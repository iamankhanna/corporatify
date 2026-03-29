import { NextResponse } from "next/server";
import { moderateText } from "@/lib/ai/moderation";
import { rewriteRequestSchema } from "@/lib/validation/rewrite";
import { rewriteMessage } from "@/lib/ai/rewrite";

export async function POST(request: Request) {
  try {
    const json = await parseJsonBody(request);
    const parsed = rewriteRequestSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Invalid rewrite request",
          details: parsed.error.flatten()
        },
        { status: 400 }
      );
    }

    const moderation = await moderateText(parsed.data.rawText);

    if (moderation.flagged) {
      return NextResponse.json(
        {
          error:
            "This message cannot be rewritten in its current form because it may contain unsafe content.",
          reasons: moderation.reasons
        },
        { status: 422 }
      );
    }

    const result = await rewriteMessage(parsed.data);
    const warnings = [...result.warnings];

    if (moderation.warning) {
      warnings.unshift(moderation.warning);
    }

    const outputModeration = await moderateText(
      [
        result.subjectLine,
        result.polishedMessage,
        result.variants.softer,
        result.variants.firmer,
        result.variants.concise
      ].join("\n\n")
    );

    if (outputModeration.flagged) {
      return NextResponse.json(
        {
          error:
            "Unable to return a safe professional rewrite right now. Please revise the message and try again.",
          reasons: outputModeration.reasons
        },
        { status: 502 }
      );
    }

    if (outputModeration.warning) {
      warnings.unshift(outputModeration.warning);
    }

    return NextResponse.json({
      ...result,
      warnings
    });
  } catch (error) {
    if (error instanceof InvalidJsonError) {
      return NextResponse.json(
        {
          error: "Malformed JSON body"
        },
        { status: 400 }
      );
    }

    console.error("Rewrite route failed", error);

    return NextResponse.json(
      {
        error: "Unable to process rewrite right now"
      },
      { status: 500 }
    );
  }
}

async function parseJsonBody(request: Request) {
  try {
    return await request.json();
  } catch {
    throw new InvalidJsonError();
  }
}

class InvalidJsonError extends Error {}

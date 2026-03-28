import { NextResponse } from "next/server";
import { moderateText } from "@/lib/ai/moderation";
import { rewriteRequestSchema } from "@/lib/validation/rewrite";
import { rewriteMessage } from "@/lib/ai/rewrite";

export async function POST(request: Request) {
  try {
    const json = await request.json();
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
    return NextResponse.json(result);
  } catch (error) {
    console.error("Rewrite route failed", error);

    return NextResponse.json(
      {
        error: "Unable to process rewrite right now"
      },
      { status: 500 }
    );
  }
}

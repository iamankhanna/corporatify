"use client";

import Link from "next/link";
import { FormEvent, useRef, useState, useTransition } from "react";
import { rewriteDefaults, selectors } from "@/lib/constants";
import type { RewriteResponse } from "@/lib/types";

export function RewriteWorkspace() {
  const [rawText, setRawText] = useState(rewriteDefaults.rawText);
  const [audience, setAudience] = useState(rewriteDefaults.audience);
  const [tone, setTone] = useState(rewriteDefaults.tone);
  const [goal, setGoal] = useState(rewriteDefaults.goal);
  const [length, setLength] = useState(rewriteDefaults.length);
  const [targetLanguage, setTargetLanguage] = useState(
    rewriteDefaults.targetLanguage
  );
  const [result, setResult] = useState<RewriteResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPending, startTransition] = useTransition();
  const latestRequestId = useRef(0);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    const requestId = latestRequestId.current + 1;
    latestRequestId.current = requestId;
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/rewrite", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          rawText,
          audience,
          tone,
          goal,
          length,
          targetLanguage
        })
      });

      const data = (await response.json()) as RewriteResponse & {
        error?: string;
      };

      if (!response.ok) {
        throw new Error(data.error ?? "Rewrite failed");
      }

      if (latestRequestId.current !== requestId) {
        return;
      }

      startTransition(() => {
        setResult(data);
      });
    } catch (submitError) {
      if (latestRequestId.current !== requestId) {
        return;
      }

      const message =
        submitError instanceof Error
          ? submitError.message
          : "Something went wrong";
      startTransition(() => {
        setError(message);
      });
    } finally {
      if (latestRequestId.current === requestId) {
        setIsSubmitting(false);
      }
    }
  };

  const copyValue = async (key: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedKey(key);
      window.setTimeout(
        () => setCopiedKey((current) => (current === key ? null : current)),
        1600
      );
    } catch (copyError) {
      console.error("Copy failed", copyError);
      setError("Unable to copy to clipboard right now");
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
      <section className="rounded-[2rem] border border-black/10 bg-white/80 p-8 shadow-card backdrop-blur">
        <div className="flex items-start justify-between gap-6">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-moss">
              Rewrite workspace
            </p>
            <h1 className="mt-3 text-4xl leading-tight text-ink">
              Shape the message before the message shapes the situation
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <ModeBadge mode={result?.mode ?? "mock"} />
            <Link
              href="/"
              className="rounded-full border border-black/10 px-4 py-2 text-sm text-black/70 transition hover:bg-black/5"
            >
              Home
            </Link>
          </div>
        </div>

        <form className="mt-8 space-y-6" onSubmit={onSubmit}>
          <div>
            <label
              htmlFor="rawText"
              className="text-sm uppercase tracking-[0.2em] text-black/55"
            >
              Raw message
            </label>
            <textarea
              id="rawText"
              value={rawText}
              onChange={(event) => setRawText(event.target.value)}
              rows={12}
              className="mt-3 w-full rounded-[1.5rem] border border-black/10 bg-cloud p-5 text-base leading-7 text-black outline-none transition focus:border-accent"
              placeholder="Type the honest version here..."
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <SelectField
              label="Audience"
              value={audience}
              onChange={setAudience}
              options={selectors.audiences}
            />
            <SelectField
              label="Tone"
              value={tone}
              onChange={setTone}
              options={selectors.tones}
            />
            <SelectField
              label="Goal"
              value={goal}
              onChange={setGoal}
              options={selectors.goals}
            />
            <SelectField
              label="Length"
              value={length}
              onChange={setLength}
              options={selectors.lengths}
            />
          </div>

          <div>
            <label
              htmlFor="targetLanguage"
              className="text-sm uppercase tracking-[0.2em] text-black/55"
            >
              Target language
            </label>
            <input
              id="targetLanguage"
              value={targetLanguage}
              onChange={(event) => setTargetLanguage(event.target.value)}
              className="mt-3 w-full rounded-[1.5rem] border border-black/10 bg-cloud p-4 text-base outline-none transition focus:border-accent"
              placeholder="English"
            />
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <button
              type="submit"
              disabled={isSubmitting || isPending}
              className="rounded-full bg-ink px-6 py-3 text-sm text-white transition hover:bg-accent disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting || isPending ? "Refining..." : "Polish this message"}
            </button>
            <p className="text-sm text-black/60">
              {result?.mode === "openai"
                ? "This response came from the live OpenAI path."
                : result?.mode === "huggingface"
                  ? "This response came from the live Hugging Face path."
                  : "Mock mode is active until a live provider key is configured in .env.local."}
            </p>
          </div>
        </form>
      </section>

      <section className="rounded-[2rem] border border-black/10 bg-[#16302b] p-8 text-white shadow-card">
        <p className="text-xs uppercase tracking-[0.3em] text-clay">
          Output
        </p>
        <h2 className="mt-3 text-3xl">Professional rewrite panel</h2>

        {error ? (
          <div className="mt-6 rounded-[1.5rem] bg-white/10 p-5 text-sm text-white/85">
            {error}
          </div>
        ) : null}

        {result ? (
          <div className="mt-6 space-y-4">
            {result.warnings.length ? (
              <div className="rounded-[1.5rem] border border-[#f4e2cc]/25 bg-[#f4e2cc] p-5 text-sm text-black">
                <p className="text-xs uppercase tracking-[0.3em] text-black/55">
                  Notes
                </p>
                <div className="mt-3 space-y-2">
                  {result.warnings.map((warning, index) => (
                    <p
                      key={`${index}-${warning}`}
                      className="leading-7 text-black/75"
                    >
                      {warning}
                    </p>
                  ))}
                </div>
              </div>
            ) : null}
            <OutputCard
              label="Subject line"
              value={result.subjectLine}
              onCopy={() => copyValue("subject", result.subjectLine)}
              copied={copiedKey === "subject"}
            />
            <OutputCard
              label="Polished version"
              value={result.polishedMessage}
              emphasize
              onCopy={() => copyValue("polished", result.polishedMessage)}
              copied={copiedKey === "polished"}
            />
            <div className="grid gap-4 md:grid-cols-3">
              <OutputCard
                label="Softer"
                value={result.variants.softer}
                onCopy={() => copyValue("softer", result.variants.softer)}
                copied={copiedKey === "softer"}
              />
              <OutputCard
                label="Firmer"
                value={result.variants.firmer}
                onCopy={() => copyValue("firmer", result.variants.firmer)}
                copied={copiedKey === "firmer"}
              />
              <OutputCard
                label="Concise"
                value={result.variants.concise}
                onCopy={() => copyValue("concise", result.variants.concise)}
                copied={copiedKey === "concise"}
              />
            </div>
            <OutputCard
              label="What changed"
              value={result.summaryOfChanges.join("\n")}
              onCopy={() =>
                copyValue("changes", result.summaryOfChanges.join("\n"))
              }
              copied={copiedKey === "changes"}
            />
            <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
              <p className="text-xs uppercase tracking-[0.3em] text-clay">
                Intent summary
              </p>
              <p className="mt-3 text-sm leading-7 text-white/75">
                {result.intentSummary}
              </p>
              <p className="mt-4 text-xs uppercase tracking-[0.3em] text-white/45">
                Detected language: {result.detectedLanguage}
              </p>
              <p className="mt-2 text-xs uppercase tracking-[0.3em] text-white/45">
                Source:{" "}
                {result.mode === "openai"
                  ? "OpenAI live response"
                  : result.mode === "huggingface"
                    ? "Hugging Face live response"
                    : "Local mock response"}
              </p>
            </div>
          </div>
        ) : (
          <div className="mt-6 rounded-[1.75rem] border border-dashed border-white/20 bg-white/5 p-7">
            <p className="text-lg text-white/90">
              Your refined message will appear here.
            </p>
            <p className="mt-3 max-w-xl text-sm leading-7 text-white/65">
              We’ll return a polished version, three tone variants, a subject
              line suggestion, and a quick explanation of what changed.
            </p>
          </div>
        )}

        <p className="mt-6 text-xs leading-6 text-white/55">
          Review before sending. Corpartify improves tone and clarity, but it
          should not replace your judgment in legal, HR, or highly sensitive
          situations.
        </p>
      </section>
    </div>
  );
}

function ModeBadge({
  mode
}: {
  mode: "mock" | "openai" | "huggingface";
}) {
  const isLive = mode !== "mock";

  return (
    <div
      className={`rounded-full px-4 py-2 text-xs uppercase tracking-[0.25em] ${
        isLive
          ? "bg-moss text-white"
          : "border border-black/10 bg-[#f4e2cc] text-black/75"
      }`}
    >
      {mode === "openai"
        ? "Live OpenAI"
        : mode === "huggingface"
          ? "Live HF"
          : "Mock Mode"}
    </div>
  );
}

type SelectFieldProps = {
  label: string;
  value: string;
  onChange: (next: string) => void;
  options: readonly string[];
};

function SelectField({ label, value, onChange, options }: SelectFieldProps) {
  return (
    <div>
      <label className="text-sm uppercase tracking-[0.2em] text-black/55">
        {label}
      </label>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-3 w-full rounded-[1.5rem] border border-black/10 bg-cloud p-4 outline-none transition focus:border-accent"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

function OutputCard({
  label,
  value,
  emphasize = false,
  onCopy,
  copied = false
}: {
  label: string;
  value: string;
  emphasize?: boolean;
  onCopy?: () => void;
  copied?: boolean;
}) {
  return (
    <div
      className={`rounded-[1.5rem] border p-5 ${
        emphasize
          ? "border-clay/20 bg-[#f4e2cc] text-black"
          : "border-white/10 bg-white/5"
      }`}
    >
      <div className="flex items-center justify-between gap-4">
        <p
          className={`text-xs uppercase tracking-[0.3em] ${
            emphasize ? "text-black/50" : "text-clay"
          }`}
        >
          {label}
        </p>
        {onCopy ? (
          <button
            type="button"
            onClick={onCopy}
            className={`rounded-full px-3 py-1 text-[11px] uppercase tracking-[0.25em] transition ${
              emphasize
                ? "bg-black text-white hover:bg-accent"
                : "bg-white/10 text-white hover:bg-white/20"
            }`}
          >
            {copied ? "Copied" : "Copy"}
          </button>
        ) : null}
      </div>
      <p
        className={`mt-3 whitespace-pre-line text-sm leading-7 ${
          emphasize ? "text-black/78" : "text-white/78"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

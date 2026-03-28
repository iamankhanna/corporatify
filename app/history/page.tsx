import Link from "next/link";
import { PlaceholderHistory } from "@/components/placeholder-history";

export default function HistoryPage() {
  return (
    <main className="noise min-h-screen px-6 py-8 md:px-10 lg:px-12">
      <div className="mx-auto max-w-4xl">
        <div className="flex items-center justify-between gap-6">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-moss">
              History
            </p>
            <h1 className="mt-3 text-4xl text-ink">Saved rewrites</h1>
          </div>
          <Link
            href="/workspace"
            className="rounded-full border border-black/10 px-4 py-2 text-sm text-black/70 transition hover:bg-black/5"
          >
            Back to workspace
          </Link>
        </div>

        <div className="mt-8">
          <PlaceholderHistory />
        </div>
      </div>
    </main>
  );
}

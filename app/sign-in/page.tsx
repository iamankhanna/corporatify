import Link from "next/link";

export default function SignInPage() {
  return (
    <main className="noise min-h-screen px-6 py-8 md:px-10 lg:px-12">
      <div className="mx-auto max-w-3xl rounded-[2rem] border border-black/10 bg-white/80 p-8 shadow-card backdrop-blur">
        <p className="text-xs uppercase tracking-[0.3em] text-moss">Auth</p>
        <h1 className="mt-3 text-4xl leading-tight text-ink">
          Sign-in flow comes in the next phase
        </h1>
        <p className="mt-4 text-base leading-8 text-black/70">
          The project structure is ready for Supabase authentication, but this
          initial pass keeps sign-in as a placeholder while we validate the core
          rewrite experience first.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/workspace"
            className="rounded-full bg-ink px-5 py-3 text-sm text-white transition hover:bg-accent"
          >
            Open workspace
          </Link>
          <Link
            href="/history"
            className="rounded-full border border-black/10 px-5 py-3 text-sm text-black/70 transition hover:bg-black/5"
          >
            View planned history page
          </Link>
        </div>
      </div>
    </main>
  );
}

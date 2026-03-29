import Link from "next/link";

export function HeroPanel() {
  return (
    <section className="animate-float-in grid gap-10 rounded-[2.5rem] border border-slate-200 bg-white/90 p-8 shadow-card backdrop-blur lg:grid-cols-[1.2fr_0.8fr] lg:p-12">
      <div>
        <p className="text-xs uppercase tracking-[0.35em] text-accent">
          Professional communication, reimagined
        </p>
        <h1 className="mt-4 max-w-3xl text-5xl leading-[1.02] tracking-tight text-ink md:text-6xl">
          Type the version you would never send. Get the version you actually
          can.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-black/70">
          Corpartify turns angry, blunt, multilingual, or emotionally messy
          writing into respectful workplace-ready communication while keeping
          the underlying point intact.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/workspace"
            className="rounded-full bg-ink px-6 py-3 text-sm text-white transition hover:bg-accent"
          >
            Try the MVP workspace
          </Link>
          <a
            href="#blueprint"
            className="rounded-full border border-black/10 px-6 py-3 text-sm text-black/75 transition hover:bg-black/5"
          >
            See the product direction
          </a>
        </div>
      </div>

      <div className="animate-pulse-soft rounded-[2rem] border border-slate-200 bg-slate-100 p-6">
        <div className="rounded-[1.5rem] bg-white p-5 shadow-card">
          <p className="text-xs uppercase tracking-[0.3em] text-black/45">
            Raw thought
          </p>
          <p className="mt-3 text-base leading-7 text-black/75">
            I have already followed up three times and nobody has bothered to
            respond. This is becoming really frustrating and it is wasting my
            time.
          </p>
        </div>

        <div className="my-4 flex items-center justify-center">
          <div className="rounded-full bg-slate-700 px-4 py-2 text-xs uppercase tracking-[0.35em] text-white">
            Refined
          </div>
        </div>

        <div className="rounded-[1.5rem] bg-slate-800 p-5 text-white shadow-card">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-300">
            Professional version
          </p>
          <p className="mt-3 text-base leading-7 text-white/80">
            I wanted to follow up on my earlier messages, as I have not yet
            received a response. I would appreciate an update when convenient,
            as this matter is now affecting my timeline.
          </p>
        </div>
      </div>
    </section>
  );
}

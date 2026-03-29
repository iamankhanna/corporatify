import Link from "next/link";
import { ExampleTransform } from "@/components/example-transform";
import { HeroPanel } from "@/components/hero-panel";
import { SectionHeading } from "@/components/section-heading";
import { presets } from "@/lib/constants";

export default function HomePage() {
  return (
    <main className="noise">
      <section className="mx-auto flex min-h-screen max-w-7xl flex-col gap-14 px-6 py-10 md:px-10 lg:px-12">
        <header className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-moss">
              Corpartify
            </p>
            <p className="mt-2 max-w-md text-sm text-black/70">
              Write it raw. Send it polished.
            </p>
          </div>
          <Link
            href="/workspace"
            className="rounded-full border border-black/10 bg-black px-5 py-3 text-sm text-white transition hover:bg-accent"
          >
            Launch workspace
          </Link>
        </header>

        <HeroPanel />

        <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[2rem] border border-black/10 bg-white/80 p-8 shadow-card backdrop-blur">
            <SectionHeading
              eyebrow="How it works"
              title="A rewrite engine built for real-world tension"
              description="Users dump the messy version first. Corpartify keeps the meaning, removes the emotional heat, and returns a version that sounds considered and professional."
            />

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {[
                "Paste the raw thought in any language",
                "Choose audience, tone, and outcome",
                "Copy the version that feels right"
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-[1.5rem] border border-black/10 bg-cloud p-4 text-sm leading-6 text-black/75"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>

          <ExampleTransform />
        </section>

        <section
          id="blueprint"
          className="rounded-[2rem] border border-black/10 bg-[#16302b] px-8 py-10 text-white shadow-card"
        >
          <SectionHeading
            eyebrow="Preset lanes"
            title="Built around the messages people actually struggle to send"
            description="These become our first-class templates inside the product and help new users get to value faster."
            inverted
          />

          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {presets.map((preset) => (
              <div
                key={preset.title}
                className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5"
              >
                <p className="text-xs uppercase tracking-[0.3em] text-clay">
                  {preset.audience}
                </p>
                <h3 className="mt-3 text-xl">{preset.title}</h3>
                <p className="mt-2 text-sm leading-6 text-white/70">
                  {preset.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}

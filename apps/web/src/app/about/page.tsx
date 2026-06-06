import type { Metadata } from "next";
import { Button } from "@/components/Button";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";

export const metadata: Metadata = {
  title: "About",
  description:
    "The story behind Olea — a modern Mediterranean kitchen built on daily sourcing, fire, and a family olive grove.",
};

const VALUES = [
  {
    title: "Seasonality first",
    text: "The menu bends to the season, not the other way around. If it isn't at its best, it isn't on the plate.",
  },
  {
    title: "Knowing our growers",
    text: "Most of what we cook comes from people we've shaken hands with — fishers, farmers, and a single olive grove in the hills.",
  },
  {
    title: "Generous by default",
    text: "Mediterranean food is meant to be shared. Plates land in the middle of the table, and nobody leaves hungry.",
  },
];

export default function AboutPage() {
  return (
    <div>
      {/* Intro */}
      <section className="bg-grain">
        <div className="mx-auto max-w-4xl px-5 py-20 text-center">
          <Reveal>
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-terracotta">
              Our story
            </p>
            <h1 className="text-4xl leading-tight text-ink sm:text-5xl">
              A coastal kitchen, guided by the olive tree
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-ink-soft">
              Olea takes its name from the olive — <em>Olea europaea</em> — the
              tree that has fed the Mediterranean for thousands of years. It felt
              like the right thing to build a restaurant around.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Narrative */}
      <section className="mx-auto max-w-5xl px-5 py-12">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <div
              className="h-80 rounded-card"
              style={{
                background:
                  "linear-gradient(150deg, #5a6648 0%, #3e6e6b 100%)",
              }}
            />
          </Reveal>
          <Reveal delay={0.1}>
            <SectionHeading
              title="From a home table to yours"
              description="Olea started the way most good food does — around a family table, with too many dishes and not enough room. We wanted to bottle that feeling: the ease of a long Mediterranean lunch, the smell of fish on the grill, bread torn by hand."
            />
            <p className="mt-4 leading-relaxed text-ink-soft">
              Today the kitchen runs on the same instinct. We cook over fire,
              lean on a single-estate olive oil, and let a short list of
              excellent ingredients do the talking.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Values */}
      <section className="bg-sand/40">
        <div className="mx-auto max-w-6xl px-5 py-20">
          <Reveal>
            <SectionHeading
              eyebrow="What we believe"
              title="Three things we don't compromise on"
              align="center"
            />
          </Reveal>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {VALUES.map((value, i) => (
              <Reveal key={value.title} delay={i * 0.08}>
                <div className="h-full rounded-card bg-white/70 p-7 ring-1 ring-ink/5">
                  <h3 className="text-xl text-ink">{value.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                    {value.text}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-4xl px-5 py-20 text-center">
        <Reveal>
          <h2 className="text-3xl text-ink sm:text-4xl">
            Hungry yet? So are we.
          </h2>
          <p className="mx-auto mt-4 max-w-xl leading-relaxed text-ink-soft">
            Browse the menu, or let our table assistant point you to something
            you'll love.
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <Button href="/menu">View the menu</Button>
            <Button href="/contact" variant="outline">
              Plan a visit
            </Button>
          </div>
        </Reveal>
      </section>
    </div>
  );
}

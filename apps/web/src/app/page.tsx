import Link from "next/link";
import { Button } from "@/components/Button";
import { DishCard } from "@/components/DishCard";
import { Hero } from "@/components/Hero";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { getMenuClient } from "@/lib/menu-client";
import { HOURS } from "@/lib/site";

const VALUES = [
  {
    title: "Sourced daily",
    text: "Fish from the morning market, vegetables from growers we know by name.",
  },
  {
    title: "Cooked over fire",
    text: "Charcoal and wood do most of the work — we just don't get in the way.",
  },
  {
    title: "Olive oil, always",
    text: "Single-estate oil from a family grove anchors nearly every plate.",
  },
];

export default async function HomePage() {
  const featured = await getMenuClient().getFeatured();

  return (
    <>
      <Hero />

      {/* Featured dishes */}
      <section className="mx-auto max-w-6xl px-5 py-20">
        <Reveal>
          <SectionHeading
            eyebrow="From the kitchen"
            title="A few of our signatures"
            description="A rotating handful of plates the kitchen is proud of right now."
          />
        </Reveal>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.slice(0, 6).map((dish, i) => (
            <Reveal key={dish.id} delay={i * 0.05}>
              <DishCard dish={dish} />
            </Reveal>
          ))}
        </div>
        <div className="mt-10 flex justify-center">
          <Button href="/menu" variant="outline">
            See the full menu
          </Button>
        </div>
      </section>

      {/* Story teaser */}
      <section className="bg-sand/40">
        <div className="mx-auto grid max-w-6xl gap-12 px-5 py-20 lg:grid-cols-2">
          <Reveal>
            <SectionHeading
              eyebrow="Our story"
              title="Born by the water, raised on the table"
              description="Olea began with a simple idea: cook the Mediterranean the way it's eaten at home — generously, seasonally, and without fuss. Years later, that idea still runs the kitchen."
            />
            <div className="mt-6">
              <Button href="/about" variant="ghost">
                Read our story →
              </Button>
            </div>
          </Reveal>
          <div className="grid gap-5 sm:grid-cols-1">
            {VALUES.map((value, i) => (
              <Reveal key={value.title} delay={i * 0.05}>
                <div className="rounded-card bg-white/70 p-6 ring-1 ring-ink/5">
                  <h3 className="text-lg text-ink">{value.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                    {value.text}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Hours & location strip */}
      <section className="mx-auto max-w-6xl px-5 py-20">
        <Reveal>
          <div className="overflow-hidden rounded-card bg-olive-deep text-cream">
            <div className="grid gap-10 p-10 sm:p-14 lg:grid-cols-2">
              <div>
                <h2 className="text-3xl text-cream sm:text-4xl">
                  Come sit at our table
                </h2>
                <p className="mt-4 max-w-md leading-relaxed text-cream/75">
                  Walk-ins are always welcome, but the good tables go fast on the
                  weekend. Reserve ahead and let us take care of the rest.
                </p>
                <div className="mt-8">
                  <Button href="/contact">Reserve a table</Button>
                </div>
              </div>
              <div className="sm:justify-self-end">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-cream/60">
                  Opening hours
                </h3>
                <ul className="mt-4 space-y-2">
                  {HOURS.map((row) => (
                    <li
                      key={row.days}
                      className="flex justify-between gap-10 border-b border-cream/15 pb-2 text-cream/90"
                    >
                      <span>{row.days}</span>
                      <span>{row.time}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/contact"
                  className="mt-5 inline-block text-sm text-gold transition-colors hover:text-cream cursor-pointer"
                >
                  Find us & get in touch →
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}

import type { Metadata } from "next";
import { ContactForm } from "@/components/contact/ContactForm";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { CONTACT, HOURS } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Find Olea, check our opening hours, and request a table. We're in the heart of Barcelona's waterfront.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-16">
      <Reveal>
        <SectionHeading
          eyebrow="Visit us"
          title="Book a table or say hello"
          description="Reservations, private events, or just a question — drop us a line and we'll get back to you."
        />
      </Reveal>

      <div className="mt-12 grid gap-12 lg:grid-cols-2">
        {/* Details */}
        <Reveal>
          <div className="space-y-8">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-ink-soft">
                Where to find us
              </h3>
              <address className="mt-3 space-y-1 text-lg not-italic leading-relaxed text-ink">
                <p>{CONTACT.address.line1}</p>
                <p>{CONTACT.address.line2}</p>
              </address>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-ink-soft">
                  Reach us
                </h3>
                <div className="mt-3 space-y-1 text-ink">
                  <p>
                    <a
                      href={`tel:${CONTACT.phone.replace(/\s/g, "")}`}
                      className="transition-colors hover:text-olive-deep cursor-pointer"
                    >
                      {CONTACT.phone}
                    </a>
                  </p>
                  <p>
                    <a
                      href={`mailto:${CONTACT.email}`}
                      className="transition-colors hover:text-olive-deep cursor-pointer"
                    >
                      {CONTACT.email}
                    </a>
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-ink-soft">
                  Hours
                </h3>
                <ul className="mt-3 space-y-1 text-ink">
                  {HOURS.map((row) => (
                    <li key={row.days} className="flex justify-between gap-4">
                      <span>{row.days}</span>
                      <span className="text-ink-soft">{row.time}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Map — a neutral public landmark on Barcelona's waterfront,
                not a real business, embedded without an API key. */}
            <div className="relative h-64 overflow-hidden rounded-card ring-1 ring-ink/10">
              <iframe
                title="Olea on the map"
                src="https://www.google.com/maps/embed?origin=mfe&pb=!1m3!2m1!1sPort+Ol%C3%ADmpic,+Barcelona!6i15"
                className="h-full w-full border-0 grayscale-[0.2]"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          </div>
        </Reveal>

        {/* Form */}
        <Reveal delay={0.1}>
          <div className="rounded-card bg-white/70 p-7 ring-1 ring-ink/5">
            <h3 className="text-xl text-ink">Request a table</h3>
            <p className="mt-1 text-sm text-ink-soft">
              We&apos;ll confirm by email. Tables held for 15 minutes.
            </p>
            <div className="mt-6">
              <ContactForm />
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  );
}

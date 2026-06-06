import Link from "next/link";
import { CONTACT, HOURS } from "@/lib/site";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-ink/10 bg-sand/40">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div className="sm:col-span-2 lg:col-span-1">
          <p className="font-display text-2xl tracking-[0.25em] text-ink">OLEA</p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-ink-soft">
            Modern Mediterranean cooking — sun, sea, and the olive tree, served
            simply.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-ink">
            Visit
          </h3>
          <address className="mt-3 space-y-1 text-sm not-italic leading-relaxed text-ink-soft">
            <p>{CONTACT.address.line1}</p>
            <p>{CONTACT.address.line2}</p>
            <p>{CONTACT.phone}</p>
          </address>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-ink">
            Hours
          </h3>
          <ul className="mt-3 space-y-1 text-sm text-ink-soft">
            {HOURS.map((row) => (
              <li key={row.days} className="flex justify-between gap-4">
                <span>{row.days}</span>
                <span>{row.time}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-ink">
            Explore
          </h3>
          <ul className="mt-3 space-y-1 text-sm">
            {[
              { href: "/menu", label: "Menu" },
              { href: "/about", label: "Our story" },
              { href: "/contact", label: "Reservations" },
            ].map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-ink-soft transition-colors hover:text-olive-deep cursor-pointer"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-ink/10 py-5">
        <p className="text-center text-xs text-ink-soft">
          © {new Date().getFullYear()} Olea. A fictional restaurant, crafted for
          portfolio purposes.
        </p>
      </div>
    </footer>
  );
}

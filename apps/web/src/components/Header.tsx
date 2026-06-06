"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useAssistant } from "@/components/assistant/AssistantContext";
import { cn } from "@/lib/cn";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/menu", label: "Menu" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const pathname = usePathname();
  const { open } = useAssistant();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile menu whenever the route changes.
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 transition-all duration-300",
        scrolled
          ? "bg-cream/85 backdrop-blur-md shadow-sm"
          : "bg-transparent",
      )}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <Link
          href="/"
          className="font-display text-2xl tracking-[0.25em] text-ink transition-colors hover:text-olive-deep cursor-pointer"
        >
          OLEA
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm tracking-wide transition-colors cursor-pointer hover:text-olive-deep",
                  active ? "text-olive-deep font-medium" : "text-ink-soft",
                )}
              >
                {link.label}
              </Link>
            );
          })}
          <button
            onClick={open}
            className="rounded-full bg-olive px-5 py-2 text-sm font-medium text-cream transition-all duration-200 hover:bg-olive-deep cursor-pointer"
          >
            Ask Olea
          </button>
        </nav>

        <button
          onClick={() => setMobileOpen((prev) => !prev)}
          className="flex h-10 w-10 items-center justify-center rounded-full text-ink transition-colors hover:bg-ink/5 md:hidden cursor-pointer"
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
        >
          <span className="text-xl">{mobileOpen ? "✕" : "☰"}</span>
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-ink/5 bg-cream/95 backdrop-blur-md md:hidden">
          <nav className="mx-auto flex max-w-6xl flex-col px-5 py-3">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="py-3 text-base text-ink-soft transition-colors hover:text-olive-deep cursor-pointer"
              >
                {link.label}
              </Link>
            ))}
            <button
              onClick={() => {
                setMobileOpen(false);
                open();
              }}
              className="mt-2 rounded-full bg-olive px-5 py-3 text-sm font-medium text-cream transition-colors hover:bg-olive-deep cursor-pointer"
            >
              Ask Olea
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}

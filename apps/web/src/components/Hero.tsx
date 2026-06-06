"use client";

import { motion } from "framer-motion";
import { useAssistant } from "@/components/assistant/AssistantContext";
import { Button } from "@/components/Button";
import { SITE } from "@/lib/site";

export function Hero() {
  const { open } = useAssistant();

  return (
    <section className="relative overflow-hidden bg-grain">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 pb-20 pt-16 lg:grid-cols-2 lg:pb-28 lg:pt-24">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-terracotta">
            {SITE.tagline}
          </p>
          <h1 className="text-5xl leading-[1.05] text-ink sm:text-6xl lg:text-7xl">
            The sea, the sun,
            <br />
            and the olive tree.
          </h1>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-ink-soft">
            {SITE.description}
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Button href="/menu">Explore the menu</Button>
            <Button variant="outline" onClick={open}>
              Ask Olea for a dish
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
          className="relative hidden h-[28rem] lg:block"
        >
          <div
            className="absolute inset-0 rounded-[2rem]"
            style={{
              background:
                "linear-gradient(150deg, #5a6648 0%, #c05e3c 60%, #c49a4a 100%)",
            }}
          />
          <svg
            viewBox="0 0 120 120"
            className="absolute inset-0 h-full w-full p-12 text-cream/85"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
          >
            <path d="M60 115 C60 70 72 38 104 14" strokeLinecap="round" />
            {[30, 48, 66, 84].map((y, i) => (
              <g key={y}>
                <ellipse
                  cx={70 + i * 7}
                  cy={y - i * 2}
                  rx="13"
                  ry="5.5"
                  transform={`rotate(${-35 - i * 5} ${70 + i * 7} ${y - i * 2})`}
                />
                <ellipse
                  cx={52 - i * 5}
                  cy={y + 7}
                  rx="13"
                  ry="5.5"
                  transform={`rotate(${35 + i * 5} ${52 - i * 5} ${y + 7})`}
                />
              </g>
            ))}
          </svg>
        </motion.div>
      </div>
    </section>
  );
}

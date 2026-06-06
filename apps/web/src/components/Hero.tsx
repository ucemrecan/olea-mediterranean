"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useAssistant } from "@/components/assistant/AssistantContext";
import { Button } from "@/components/Button";
import { IMAGES, SITE } from "@/lib/site";

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
          className="relative hidden h-[28rem] overflow-hidden rounded-[2rem] shadow-xl ring-1 ring-ink/10 lg:block"
        >
          <Image
            src={IMAGES.hero}
            alt="A Mediterranean table spread"
            fill
            priority
            sizes="(max-width: 1024px) 0px, 45vw"
            className="object-cover"
          />
          {/* Warm wash to keep the palette consistent and text legible. */}
          <div className="absolute inset-0 bg-gradient-to-tr from-olive-deep/40 via-transparent to-terracotta/20" />
        </motion.div>
      </div>
    </section>
  );
}

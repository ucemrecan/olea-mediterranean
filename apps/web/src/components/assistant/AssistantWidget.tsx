"use client";

import type { RecommendationPreferences, ScoredDish } from "@olea/menu-data";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useAssistant } from "@/components/assistant/AssistantContext";
import { RecommendationCard } from "@/components/assistant/RecommendationCard";
import { getMenuClient } from "@/lib/menu-client";
import { cn } from "@/lib/cn";

/**
 * One step of the guided conversation. Each option contributes a slice of the
 * preferences object that is finally passed to the recommendation engine.
 */
interface Step {
  key: keyof RecommendationPreferences;
  question: string;
  options: { label: string; value: RecommendationPreferences[keyof RecommendationPreferences] }[];
}

const STEPS: Step[] = [
  {
    key: "diet",
    question: "First — any dietary preference I should keep in mind?",
    options: [
      { label: "No restriction", value: "no-restriction" },
      { label: "Vegetarian", value: "vegetarian" },
      { label: "Vegan", value: "vegan" },
      { label: "Pescatarian", value: "pescatarian" },
    ],
  },
  {
    key: "spice",
    question: "How do you like the heat?",
    options: [
      { label: "Keep it mild", value: "mild" },
      { label: "A little kick", value: "medium" },
      { label: "Bring the spice", value: "spicy" },
      { label: "Doesn't matter", value: "any" },
    ],
  },
  {
    key: "mood",
    question: "And what are you in the mood for?",
    options: [
      { label: "Light & fresh", value: "fresh" },
      { label: "Hearty & comforting", value: "comforting" },
      { label: "Something indulgent", value: "indulgent" },
      { label: "Surprise me", value: "adventurous" },
    ],
  },
  {
    key: "occasion",
    question: "Last one — what's the occasion?",
    options: [
      { label: "Romantic dinner", value: "romantic" },
      { label: "With family", value: "family" },
      { label: "A celebration", value: "celebration" },
      { label: "Just me", value: "solo" },
    ],
  },
];

const GREETING = "Hi, I'm Olea's table assistant. Answer a few quick questions and I'll suggest dishes you'll love.";

interface Turn {
  question: string;
  answer: string;
}

export function AssistantWidget() {
  const { isOpen, open, close } = useAssistant();
  const [stepIndex, setStepIndex] = useState(0);
  const [prefs, setPrefs] = useState<RecommendationPreferences>({});
  const [transcript, setTranscript] = useState<Turn[]>([]);
  const [results, setResults] = useState<ScoredDish[] | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const currentStep = STEPS[stepIndex];
  const isDone = results !== null;

  // Keep the conversation scrolled to the latest message.
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [transcript, results, isOpen]);

  async function selectOption(label: string, value: Step["options"][number]["value"]) {
    const nextPrefs = { ...prefs, [currentStep.key]: value };
    const nextTranscript = [...transcript, { question: currentStep.question, answer: label }];
    setPrefs(nextPrefs);
    setTranscript(nextTranscript);

    if (stepIndex + 1 < STEPS.length) {
      setStepIndex(stepIndex + 1);
    } else {
      const recommendations = await getMenuClient().recommend(nextPrefs, 3);
      setResults(recommendations);
    }
  }

  function restart() {
    setStepIndex(0);
    setPrefs({});
    setTranscript([]);
    setResults(null);
  }

  return (
    <>
      {/* Floating launcher */}
      <motion.button
        onClick={open}
        initial={false}
        animate={{ opacity: isOpen ? 0 : 1, scale: isOpen ? 0.8 : 1 }}
        transition={{ duration: 0.2 }}
        className={cn(
          "fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full bg-olive px-5 py-3.5 text-sm font-medium text-cream shadow-lg transition-colors hover:bg-olive-deep cursor-pointer",
          isOpen && "pointer-events-none",
        )}
        aria-label="Open the table assistant"
      >
        <span className="text-base">🫒</span>
        Ask Olea
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="fixed bottom-5 right-5 z-50 flex h-[34rem] max-h-[calc(100vh-2.5rem)] w-[calc(100vw-2.5rem)] max-w-sm flex-col overflow-hidden rounded-2xl bg-cream shadow-2xl ring-1 ring-ink/10"
          >
            {/* Header */}
            <div className="flex items-center justify-between bg-olive px-4 py-3 text-cream">
              <div className="flex items-center gap-2">
                <span className="text-lg">🫒</span>
                <div>
                  <p className="text-sm font-semibold leading-tight">Table Assistant</p>
                  <p className="text-xs text-cream/70">Dish recommendations</p>
                </div>
              </div>
              <button
                onClick={close}
                className="flex h-8 w-8 items-center justify-center rounded-full text-cream/90 transition-colors hover:bg-white/15 cursor-pointer"
                aria-label="Close assistant"
              >
                ✕
              </button>
            </div>

            {/* Conversation */}
            <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto bg-grain p-4">
              <Bubble from="assistant">{GREETING}</Bubble>

              {transcript.map((turn, i) => (
                <div key={i} className="space-y-3">
                  <Bubble from="assistant">{turn.question}</Bubble>
                  <Bubble from="user">{turn.answer}</Bubble>
                </div>
              ))}

              {!isDone && <Bubble from="assistant">{currentStep.question}</Bubble>}

              {isDone && (
                <>
                  <Bubble from="assistant">
                    Here&apos;s what I&apos;d bring to your table:
                  </Bubble>
                  <div className="space-y-2">
                    {results!.map((scored) => (
                      <RecommendationCard key={scored.dish.id} scored={scored} />
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Input area: quick replies or restart */}
            <div className="border-t border-ink/10 bg-cream p-3">
              {!isDone ? (
                <div className="flex flex-wrap gap-2">
                  {currentStep.options.map((option) => (
                    <button
                      key={option.label}
                      onClick={() => selectOption(option.label, option.value)}
                      className="rounded-full border border-olive/30 bg-white px-3.5 py-2 text-sm text-olive-deep transition-colors hover:border-olive hover:bg-olive/10 cursor-pointer"
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              ) : (
                <button
                  onClick={restart}
                  className="w-full rounded-full bg-olive px-4 py-2.5 text-sm font-medium text-cream transition-colors hover:bg-olive-deep cursor-pointer"
                >
                  Start over
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function Bubble({ from, children }: { from: "assistant" | "user"; children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={cn("flex", from === "user" ? "justify-end" : "justify-start")}
    >
      <div
        className={cn(
          "max-w-[85%] rounded-2xl px-3.5 py-2 text-sm leading-snug",
          from === "user"
            ? "rounded-br-sm bg-terracotta text-cream"
            : "rounded-bl-sm bg-white text-ink ring-1 ring-ink/5",
        )}
      >
        {children}
      </div>
    </motion.div>
  );
}

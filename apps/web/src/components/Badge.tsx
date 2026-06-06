import { cn } from "@/lib/cn";

type BadgeTone = "olive" | "terracotta" | "sea" | "neutral";

const TONES: Record<BadgeTone, string> = {
  olive: "bg-olive/10 text-olive-deep",
  terracotta: "bg-terracotta/10 text-terracotta-deep",
  sea: "bg-sea/10 text-sea",
  neutral: "bg-ink/5 text-ink-soft",
};

interface BadgeProps {
  children: React.ReactNode;
  tone?: BadgeTone;
  className?: string;
}

export function Badge({ children, tone = "neutral", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium tracking-wide",
        TONES[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

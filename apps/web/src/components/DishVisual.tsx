import type { Category } from "@olea/menu-data";
import { cn } from "@/lib/cn";

/**
 * A generated visual for a dish. Until real photography arrives through the API,
 * each dish gets a calm, category-tinted gradient with an olive-branch motif so
 * the menu reads as intentional rather than missing images.
 */

const CATEGORY_GRADIENTS: Record<Category, [string, string]> = {
  starters: ["#6b7752", "#cdbf9b"],
  mains: ["#c05e3c", "#e3d4ba"],
  seafood: ["#3e6e6b", "#bcd0c6"],
  desserts: ["#c49a4a", "#efe3c4"],
  drinks: ["#3c4531", "#5a6648"],
};

interface DishVisualProps {
  category: Category;
  className?: string;
}

export function DishVisual({ category, className }: DishVisualProps) {
  const [from, to] = CATEGORY_GRADIENTS[category];

  return (
    <div
      className={cn("relative overflow-hidden", className)}
      style={{ background: `linear-gradient(135deg, ${from} 0%, ${to} 100%)` }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 120 120"
        className="absolute -right-4 -bottom-4 h-32 w-32 opacity-25"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        style={{ color: "rgba(255,255,255,0.85)" }}
      >
        <path d="M60 110 C60 70 70 40 100 20" strokeLinecap="round" />
        {[28, 44, 60, 76].map((y, i) => (
          <g key={y}>
            <ellipse
              cx={68 + i * 7}
              cy={y - i * 2}
              rx="11"
              ry="5"
              transform={`rotate(${-35 - i * 5} ${68 + i * 7} ${y - i * 2})`}
            />
            <ellipse
              cx={52 - i * 5}
              cy={y + 6}
              rx="11"
              ry="5"
              transform={`rotate(${35 + i * 5} ${52 - i * 5} ${y + 6})`}
            />
          </g>
        ))}
      </svg>
    </div>
  );
}

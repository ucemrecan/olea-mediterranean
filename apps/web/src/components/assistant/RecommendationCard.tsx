import type { ScoredDish } from "@olea/menu-data";
import { DishImage } from "@/components/DishImage";
import { formatPrice } from "@/lib/display";

/** Turns the engine's reason fragments into one friendly sentence. */
function buildReason(scored: ScoredDish): string {
  if (scored.reasons.length === 0) {
    return "A house favourite worth trying.";
  }
  const text = scored.reasons.slice(0, 2).join(", and ");
  return text.charAt(0).toUpperCase() + text.slice(1) + ".";
}

export function RecommendationCard({ scored }: { scored: ScoredDish }) {
  const { dish } = scored;
  return (
    <div className="flex gap-3 rounded-xl bg-white p-2.5 ring-1 ring-ink/5">
      <DishImage
        src={dish.image}
        alt={dish.name}
        category={dish.category}
        sizes="64px"
        className="h-16 w-16 shrink-0 rounded-lg"
      />
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-2">
          <h4 className="truncate text-sm font-semibold text-ink">{dish.name}</h4>
          <span className="shrink-0 text-sm font-medium text-olive-deep">
            {formatPrice(dish.price)}
          </span>
        </div>
        <p className="mt-0.5 text-xs leading-snug text-ink-soft">
          {buildReason(scored)}
        </p>
      </div>
    </div>
  );
}

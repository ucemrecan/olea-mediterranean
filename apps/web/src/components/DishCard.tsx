import type { Dish } from "@olea/menu-data";
import { Badge } from "@/components/Badge";
import { DishVisual } from "@/components/DishVisual";
import { cn } from "@/lib/cn";
import {
  dietaryLabels,
  formatPrice,
  positiveDietaryTags,
  spiceLabel,
} from "@/lib/display";

interface DishCardProps {
  dish: Dish;
  className?: string;
}

export function DishCard({ dish, className }: DishCardProps) {
  const badges = dish.dietaryTags.filter((tag) => positiveDietaryTags.includes(tag));

  return (
    <article
      className={cn(
        "group flex flex-col overflow-hidden rounded-card bg-white/60 ring-1 ring-ink/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:ring-ink/10",
        className,
      )}
    >
      <div className="relative">
        <DishVisual category={dish.category} className="h-44 w-full" />
        <span className="absolute right-3 top-3 rounded-full bg-cream/90 px-3 py-1 text-sm font-semibold text-ink shadow-sm">
          {formatPrice(dish.price)}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-xl text-ink">{dish.name}</h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-soft">
          {dish.description}
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {badges.map((tag) => (
            <Badge key={tag} tone="olive">
              {dietaryLabels[tag]}
            </Badge>
          ))}
          {dish.spiceLevel > 0 && (
            <Badge tone="terracotta">{spiceLabel(dish.spiceLevel)}</Badge>
          )}
        </div>
      </div>
    </article>
  );
}

"use client";

import type { CategoryInfo, Dish } from "@olea/menu-data";
import { useMemo, useState } from "react";
import { DishCard } from "@/components/DishCard";
import { Reveal } from "@/components/Reveal";
import { cn } from "@/lib/cn";

type DietFilter = "all" | "vegetarian" | "vegan" | "pescatarian" | "gluten-free";
type SpiceFilter = "all" | "none" | "mild" | "spicy";

const DIET_FILTERS: { value: DietFilter; label: string }[] = [
  { value: "all", label: "All diets" },
  { value: "vegetarian", label: "Vegetarian" },
  { value: "vegan", label: "Vegan" },
  { value: "pescatarian", label: "Pescatarian" },
  { value: "gluten-free", label: "Gluten-free" },
];

const SPICE_FILTERS: { value: SpiceFilter; label: string }[] = [
  { value: "all", label: "Any heat" },
  { value: "none", label: "No heat" },
  { value: "mild", label: "Mild" },
  { value: "spicy", label: "Spicy" },
];

function matchesDiet(dish: Dish, filter: DietFilter): boolean {
  switch (filter) {
    case "vegetarian":
      return (
        dish.dietaryTags.includes("vegetarian") ||
        dish.dietaryTags.includes("vegan")
      );
    case "vegan":
      return dish.dietaryTags.includes("vegan");
    case "pescatarian":
      return !dish.dietaryTags.includes("contains-meat");
    case "gluten-free":
      return dish.dietaryTags.includes("gluten-free");
    case "all":
    default:
      return true;
  }
}

function matchesSpice(dish: Dish, filter: SpiceFilter): boolean {
  switch (filter) {
    case "none":
      return dish.spiceLevel === 0;
    case "mild":
      return dish.spiceLevel <= 1;
    case "spicy":
      return dish.spiceLevel >= 2;
    case "all":
    default:
      return true;
  }
}

interface MenuExplorerProps {
  categories: CategoryInfo[];
  dishes: Dish[];
}

export function MenuExplorer({ categories, dishes }: MenuExplorerProps) {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [diet, setDiet] = useState<DietFilter>("all");
  const [spice, setSpice] = useState<SpiceFilter>("all");

  const filtered = useMemo(
    () =>
      dishes.filter(
        (dish) =>
          (activeCategory === "all" || dish.category === activeCategory) &&
          matchesDiet(dish, diet) &&
          matchesSpice(dish, spice),
      ),
    [dishes, activeCategory, diet, spice],
  );

  const visibleCategories = categories.filter(
    (category) =>
      activeCategory === "all" || category.id === activeCategory,
  );

  return (
    <div>
      {/* Category tabs */}
      <div className="flex flex-wrap gap-2">
        <FilterChip
          active={activeCategory === "all"}
          onClick={() => setActiveCategory("all")}
        >
          All
        </FilterChip>
        {categories.map((category) => (
          <FilterChip
            key={category.id}
            active={activeCategory === category.id}
            onClick={() => setActiveCategory(category.id)}
          >
            {category.label}
          </FilterChip>
        ))}
      </div>

      {/* Dietary + spice filters */}
      <div className="mt-4 flex flex-col gap-3 border-t border-ink/10 pt-4 sm:flex-row sm:items-center sm:gap-6">
        <FilterRow
          label="Dietary"
          options={DIET_FILTERS}
          value={diet}
          onChange={setDiet}
        />
        <FilterRow
          label="Spice"
          options={SPICE_FILTERS}
          value={spice}
          onChange={setSpice}
        />
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <p className="mt-16 text-center text-ink-soft">
          No dishes match those filters — try loosening one.
        </p>
      ) : (
        <div className="mt-12 space-y-16">
          {visibleCategories.map((category) => {
            const items = filtered.filter((dish) => dish.category === category.id);
            if (items.length === 0) return null;
            return (
              <section key={category.id}>
                <div className="mb-6">
                  <h2 className="text-2xl text-ink">{category.label}</h2>
                  <p className="mt-1 text-sm text-ink-soft">{category.description}</p>
                </div>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {items.map((dish, i) => (
                    <Reveal key={dish.id} delay={Math.min(i * 0.04, 0.2)}>
                      <DishCard dish={dish} />
                    </Reveal>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-full px-4 py-2 text-sm transition-colors cursor-pointer",
        active
          ? "bg-olive text-cream"
          : "bg-white text-ink-soft ring-1 ring-ink/10 hover:bg-olive/10 hover:text-olive-deep",
      )}
    >
      {children}
    </button>
  );
}

function FilterRow<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs font-semibold uppercase tracking-wider text-ink-soft">
        {label}
      </span>
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={cn(
            "rounded-full px-3 py-1 text-xs transition-colors cursor-pointer",
            value === option.value
              ? "bg-terracotta text-cream"
              : "text-ink-soft hover:bg-terracotta/10 hover:text-terracotta-deep",
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

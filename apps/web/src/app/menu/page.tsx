import type { Metadata } from "next";
import { MenuExplorer } from "@/components/menu/MenuExplorer";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { getCategories, getMenu } from "@/lib/menu";

export const metadata: Metadata = {
  title: "Menu",
  description:
    "Explore Olea's modern Mediterranean menu — starters, wood-fired mains, the day's catch, and sweets. Filter by dietary needs and spice level.",
};

export default async function MenuPage() {
  const [categories, dishes] = await Promise.all([getCategories(), getMenu()]);

  return (
    <div className="mx-auto max-w-6xl px-5 py-16">
      <Reveal>
        <SectionHeading
          eyebrow="The menu"
          title="What's on the table"
          description="Everything is made to share. Tell us your preferences with the filters below, or let our assistant pick for you."
        />
      </Reveal>

      <div className="mt-12">
        <MenuExplorer categories={categories} dishes={dishes} />
      </div>
    </div>
  );
}

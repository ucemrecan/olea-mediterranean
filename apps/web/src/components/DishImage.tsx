"use client";

import type { Category } from "@olea/menu-data";
import Image from "next/image";
import { useState } from "react";
import { DishVisual } from "@/components/DishVisual";
import { cn } from "@/lib/cn";

/**
 * Renders a dish photo with Next's image optimisation. If no image is provided
 * — or the remote image fails to load — it falls back to the generated visual,
 * so the menu never shows a broken image.
 */
interface DishImageProps {
  src?: string;
  alt: string;
  category: Category;
  className?: string;
  sizes?: string;
  priority?: boolean;
}

export function DishImage({
  src,
  alt,
  category,
  className,
  sizes = "(max-width: 768px) 100vw, 33vw",
  priority,
}: DishImageProps) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return <DishVisual category={category} className={className} />;
  }

  return (
    <div className={cn("relative overflow-hidden", className)}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className="object-cover"
        onError={() => setFailed(true)}
      />
    </div>
  );
}

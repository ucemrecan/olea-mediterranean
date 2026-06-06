/** Joins truthy class names. A tiny, dependency-free `clsx`. */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

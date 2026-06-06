import Link from "next/link";
import { cn } from "@/lib/cn";

type Variant = "primary" | "outline" | "ghost";

const VARIANTS: Record<Variant, string> = {
  primary:
    "bg-terracotta text-cream hover:bg-terracotta-deep shadow-sm hover:shadow",
  outline:
    "border border-olive/40 text-olive-deep hover:bg-olive/10 hover:border-olive/60",
  ghost: "text-olive-deep hover:bg-olive/10",
};

const BASE =
  "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium tracking-wide transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-olive/50";

interface CommonProps {
  variant?: Variant;
  className?: string;
  children: React.ReactNode;
}

type ButtonAsLink = CommonProps & {
  href: string;
} & Omit<React.ComponentProps<typeof Link>, "href" | "className" | "children">;

type ButtonAsButton = CommonProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children"> & {
    href?: undefined;
  };

export function Button(props: ButtonAsLink | ButtonAsButton) {
  const { variant = "primary", className, children } = props;
  const classes = cn(BASE, VARIANTS[variant], className);

  if (props.href !== undefined) {
    const { href, variant: _variant, className: _className, children: _children, ...rest } =
      props;
    return (
      <Link href={href} className={classes} {...rest}>
        {children}
      </Link>
    );
  }

  const {
    variant: _variant,
    className: _className,
    children: _children,
    href: _href,
    ...rest
  } = props;
  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  );
}

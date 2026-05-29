import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";
import { forwardRef } from "react";

type Variant = "cyan" | "red" | "ghost";
type Size = "sm" | "md" | "lg";

interface Props extends Omit<HTMLMotionProps<"button">, "children"> {
  variant?: Variant;
  size?: Size;
  children: React.ReactNode;
}

const variants: Record<Variant, string> = {
  cyan:  "bg-cyber-cyan/15 text-cyber-cyan neon-border hover:bg-cyber-cyan/25",
  red:   "bg-cyber-red/15  text-cyber-red  neon-border-red hover:bg-cyber-red/25",
  ghost: "bg-transparent text-foreground border border-glass-border hover:bg-white/5",
};
const sizes: Record<Size, string> = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-5 py-2.5 text-sm",
  lg: "px-7 py-3.5 text-base",
};

export const GlowButton = forwardRef<HTMLButtonElement, Props>(function GlowButton(
  { variant = "cyan", size = "md", className, children, ...props }, ref,
) {
  return (
    <motion.button
      ref={ref}
      whileHover={{ y: -1, scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 320, damping: 22 }}
      className={cn(
        "relative inline-flex items-center justify-center gap-2 rounded-md font-display uppercase tracking-[0.18em]",
        "transition-colors",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    >
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </motion.button>
  );
});

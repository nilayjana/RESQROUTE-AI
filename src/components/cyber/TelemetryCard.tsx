import { cn } from "@/lib/utils";

interface Props {
  label: string;
  value: string;
  hint?: string;
  accent?: "cyan" | "red" | "green" | "amber";
  className?: string;
}

const accentMap = {
  cyan:  "text-cyber-cyan",
  red:   "text-cyber-red",
  green: "text-cyber-green",
  amber: "text-cyber-amber",
};

export function TelemetryCard({ label, value, hint, accent = "cyan", className }: Props) {
  return (
    <div className={cn("glass rounded-lg px-4 py-3 min-w-[110px] relative overflow-hidden", className)}>
      <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground font-display">
        {label}
      </div>
      <div className={cn("font-mono text-2xl mt-1 leading-none", accentMap[accent])}>
        {value}
      </div>
      {hint && (
        <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground mt-1">{hint}</div>
      )}
      <div className="absolute top-1 right-1 size-1.5 rounded-full bg-cyber-cyan animate-pulse-glow" />
    </div>
  );
}

import { motion } from "framer-motion";
import type { ServiceLocation } from "@/lib/dummyData";
import { cn } from "@/lib/utils";

interface Props {
  destination?: ServiceLocation;
  candidates?: ServiceLocation[];
  className?: string;
  /** show only destination marker (driver mode) */
  ambulance?: boolean;
}

const USER = { x: 0.5, y: 0.5 };

function curvePath(x1: number, y1: number, x2: number, y2: number) {
  // S-curve between user and destination
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  const cx1 = x1 + (x2 - x1) * 0.25;
  const cy1 = y1 + (y2 - y1) * 0.05 + (y2 > y1 ? -40 : 40);
  const cx2 = x2 - (x2 - x1) * 0.25;
  const cy2 = y2 - (y2 - y1) * 0.05 + (y2 > y1 ? 40 : -40);
  return `M ${x1} ${y1} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${mx} ${my} S ${x2} ${y2}, ${x2} ${y2}`;
}

export function CyberMap({ destination, candidates, className, ambulance }: Props) {
  const W = 800, H = 500;
  const ux = USER.x * W, uy = USER.y * H;
  const dx = (destination?.x ?? 0.8) * W;
  const dy = (destination?.y ?? 0.3) * H;

  return (
    <div className={cn(
      "relative overflow-hidden rounded-xl glass-strong neon-border scanline",
      className,
    )}>
      <div className="absolute inset-0 cyber-grid-bg animate-grid opacity-80" />
      {/* radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,color-mix(in_oklab,var(--cyber-cyan)_18%,transparent),transparent_55%)]" />

      <svg viewBox={`0 0 ${W} ${H}`} className="relative w-full h-full">
        <defs>
          <linearGradient id="route" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%"  stopColor="var(--cyber-cyan)" stopOpacity="0.95" />
            <stop offset="100%" stopColor="var(--cyber-red)"  stopOpacity="0.95" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* faint candidate dots */}
        {candidates?.map((c) => (
          <g key={c.id} opacity={destination?.id === c.id ? 0 : 0.55}>
            <circle cx={c.x * W} cy={c.y * H} r="4" fill="var(--cyber-cyan-soft)" />
            <circle cx={c.x * W} cy={c.y * H} r="10" fill="none" stroke="var(--cyber-cyan-soft)" strokeOpacity="0.4" />
          </g>
        ))}

        {/* route */}
        {destination && (
          <motion.path
            key={destination.id}
            d={curvePath(ux, uy, dx, dy)}
            stroke="url(#route)" strokeWidth="3" fill="none"
            strokeLinecap="round" strokeDasharray="10 8"
            filter="url(#glow)"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1, ease: "easeInOut" }}
            className="animate-dash"
          />
        )}

        {/* user marker */}
        <g>
          <circle cx={ux} cy={uy} r="26" fill="var(--cyber-cyan)" opacity="0.12" />
          <circle cx={ux} cy={uy} r="14" fill="var(--cyber-cyan)" opacity="0.25" />
          <circle cx={ux} cy={uy} r="6" fill="var(--cyber-cyan)" filter="url(#glow)" />
          <text x={ux + 14} y={uy - 12} fill="var(--cyber-cyan)" fontSize="10" fontFamily="monospace">
            {ambulance ? "AMB-2049" : "YOU"}
          </text>
        </g>

        {/* destination marker */}
        {destination && (
          <motion.g
            key={`d-${destination.id}`}
            initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 220, damping: 18 }}
            style={{ transformOrigin: `${dx}px ${dy}px` }}
          >
            <circle cx={dx} cy={dy} r="22" fill="var(--cyber-red)" opacity="0.12" />
            <circle cx={dx} cy={dy} r="12" fill="var(--cyber-red)" opacity="0.3" />
            <path
              d={`M ${dx} ${dy - 10} L ${dx + 8} ${dy + 8} L ${dx - 8} ${dy + 8} Z`}
              fill="var(--cyber-red)" filter="url(#glow)"
            />
            <text x={dx + 14} y={dy + 4} fill="var(--cyber-red)" fontSize="10" fontFamily="monospace">
              TARGET
            </text>
          </motion.g>
        )}

        {/* HUD ticks */}
        <g stroke="var(--cyber-cyan)" strokeOpacity="0.6">
          <line x1="20" y1="20" x2="60" y2="20" /><line x1="20" y1="20" x2="20" y2="60" />
          <line x1={W - 20} y1="20" x2={W - 60} y2="20" /><line x1={W - 20} y1="20" x2={W - 20} y2="60" />
          <line x1="20" y1={H - 20} x2="60" y2={H - 20} /><line x1="20" y1={H - 20} x2="20" y2={H - 60} />
          <line x1={W - 20} y1={H - 20} x2={W - 60} y2={H - 20} /><line x1={W - 20} y1={H - 20} x2={W - 20} y2={H - 60} />
        </g>
      </svg>

      <div className="pointer-events-none absolute top-3 left-3 font-mono text-[10px] text-cyber-cyan/80 tracking-widest">
        ◉ LIVE · GRID-LOCK · 37.7749°N 122.4194°W
      </div>
    </div>
  );
}

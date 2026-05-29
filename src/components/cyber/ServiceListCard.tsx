import { motion } from "framer-motion";
import { Phone } from "lucide-react";
import { GlowButton } from "./GlowButton";
import type { ServiceLocation } from "@/lib/dummyData";
import { cn } from "@/lib/utils";

interface Props {
  service: ServiceLocation;
  selected?: boolean;
  onSelect?: () => void;
}

export function ServiceListCard({ service, selected, onSelect }: Props) {
  return (
    <motion.button
      type="button"
      onClick={onSelect}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.99 }}
      className={cn(
        "w-full text-left glass rounded-xl p-4 transition-all relative overflow-hidden",
        selected ? "neon-border glow-cyan" : "hover:neon-border",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="font-display text-sm tracking-wider uppercase truncate">{service.name}</div>
          <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground mt-1">
            <Phone className="size-3" /> {service.phone}
          </div>
        </div>
        <div className={cn(
          "shrink-0 font-mono text-[10px] px-2 py-1 rounded-full tracking-widest uppercase",
          service.open
            ? "bg-cyber-green/15 text-cyber-green border border-cyber-green/30"
            : "bg-cyber-red/15 text-cyber-red border border-cyber-red/30",
        )}>
          {service.open ? "● OPEN" : "○ CLOSED"}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 mt-3">
        <Stat label="DIST" value={`${service.distanceKm.toFixed(1)} km`} />
        <Stat label="ETA"  value={`${service.etaMin} min`} />
        <div className="flex items-end justify-end">
          <GlowButton size="sm" variant={selected ? "red" : "cyan"}>
            {selected ? "Tracking" : "Navigate"}
          </GlowButton>
        </div>
      </div>
    </motion.button>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[9px] tracking-widest uppercase text-muted-foreground font-display">{label}</div>
      <div className="font-mono text-cyber-cyan text-sm">{value}</div>
    </div>
  );
}

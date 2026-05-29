import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import { CheckCircle2, Activity } from "lucide-react";
import { CyberMap } from "@/components/cyber/CyberMap";
import { TelemetryCard } from "@/components/cyber/TelemetryCard";
import { GlowButton } from "@/components/cyber/GlowButton";
import { driverProfile, servicesByCategory } from "@/lib/dummyData";
import { useDriverStats } from "@/lib/appState";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/driver/")({
  head: () => ({
    meta: [
      { title: "Driver Console — ResQRoute AI" },
      { name: "description", content: "Ambulance driver dashboard with availability and live emergency assignment." },
    ],
  }),
  component: DriverHome,
});

function DriverHome() {
  const navigate = useNavigate();
  const { stats } = useDriverStats();
  const [available, setAvailable] = useState(true);
  const active = servicesByCategory.hospital[0];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <section className="glass-strong neon-border rounded-2xl p-5 md:p-6 grid grid-cols-1 md:grid-cols-3 gap-5 items-center">
        <div className="flex items-center gap-4">
          <div className="size-16 rounded-full bg-gradient-to-br from-cyber-red/40 to-cyber-cyan/40 flex items-center justify-center neon-border-red">
            <div className="size-12 rounded-full bg-background flex items-center justify-center font-display text-cyber-red">
              {driverProfile.name.split(" ").map(s => s[0]).join("")}
            </div>
          </div>
          <div className="min-w-0">
            <div className="font-mono text-[10px] tracking-widest text-cyber-red">DRIVER</div>
            <div className="font-display text-lg tracking-wider truncate">{driverProfile.name}</div>
            <div className="font-mono text-xs text-muted-foreground">{driverProfile.ambulanceNumber}</div>
          </div>
        </div>

        <button
          onClick={() => setAvailable(v => !v)}
          className={cn(
            "rounded-xl p-4 text-left transition-all",
            available ? "neon-border bg-cyber-green/10" : "neon-border-red bg-cyber-red/10",
          )}
        >
          <div className="font-mono text-[10px] tracking-widest text-muted-foreground">AVAILABILITY</div>
          <div className="flex items-center justify-between mt-1">
            <span className={cn(
              "font-display text-lg tracking-[0.2em] uppercase",
              available ? "text-cyber-green" : "text-cyber-red",
            )}>
              {available ? "ONLINE" : "OFFLINE"}
            </span>
            <span className={cn(
              "size-10 rounded-full flex items-center justify-center",
              available ? "bg-cyber-green/20 animate-pulse-glow" : "bg-cyber-red/20 animate-pulse-glow-red",
            )}>
              <Activity className={cn("size-5", available ? "text-cyber-green" : "text-cyber-red")} />
            </span>
          </div>
        </button>

        <TelemetryCard label="COMPLETED" value={String(stats.completed)} hint="PATIENTS" accent="cyan" className="w-full" />
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-4">
        <div className="glass-strong neon-border-red rounded-2xl p-5 relative overflow-hidden">
          <motion.div
            animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.8, repeat: Infinity }}
            className="font-mono text-[10px] tracking-widest text-cyber-red"
          >
            ◉ ACTIVE EMERGENCY
          </motion.div>
          <div className="font-display text-xl tracking-wider mt-1">{active.name}</div>
          <div className="text-sm text-muted-foreground">{active.phone}</div>
          <div className="grid grid-cols-3 gap-2 mt-4">
            <TelemetryCard label="ETA"      value={`${active.etaMin}m`} accent="cyan" />
            <TelemetryCard label="DISTANCE" value={`${active.distanceKm.toFixed(1)}km`} accent="red" />
            <TelemetryCard label="PRIORITY" value="P1" accent="red" />
          </div>
          <div className="mt-4 flex gap-2">
            <GlowButton variant="red" onClick={() => navigate({ to: "/driver/navigation" })}>
              Begin Route
            </GlowButton>
          </div>
        </div>

        <button onClick={() => navigate({ to: "/driver/navigation" })} className="block group">
          <div className="relative">
            <CyberMap className="h-[260px] md:h-[320px] w-full" destination={active} ambulance />
            <div className="absolute inset-0 rounded-xl bg-black/0 group-hover:bg-cyber-cyan/5 transition-colors" />
            <div className="absolute bottom-3 right-3 glass-strong neon-border rounded-lg px-3 py-1.5 font-display text-[11px] tracking-widest text-cyber-cyan">
              OPEN NAV →
            </div>
          </div>
        </button>
      </section>

      <section>
        <div className="font-mono text-[10px] tracking-widest text-cyber-cyan mb-3">▸ RECENT RUNS</div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {stats.history.slice(0, 3).map(h => (
            <div key={h.id} className="glass rounded-xl p-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-cyber-green flex items-center gap-1">
                  <CheckCircle2 className="size-3" /> {h.id}
                </span>
                <span className="font-mono text-[10px] text-muted-foreground">{h.completedAt}</span>
              </div>
              <div className="font-display text-sm tracking-wider mt-2">{h.hospital}</div>
              <div className="font-mono text-xs text-muted-foreground">{h.distanceKm.toFixed(1)} km</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

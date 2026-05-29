import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { CheckCircle2, PhoneCall, StopCircle } from "lucide-react";
import { CyberMap } from "@/components/cyber/CyberMap";
import { TelemetryCard } from "@/components/cyber/TelemetryCard";
import { GlowButton } from "@/components/cyber/GlowButton";
import { servicesByCategory } from "@/lib/dummyData";
import { useDriverStats } from "@/lib/appState";

export const Route = createFileRoute("/driver/navigation")({
  head: () => ({
    meta: [
      { title: "Driver Navigation — ResQRoute AI" },
      { name: "description", content: "Live ambulance navigation with telemetry and patient run logging." },
    ],
  }),
  component: DriverNavigation,
});

function DriverNavigation() {
  const navigate = useNavigate();
  const { completeRun } = useDriverStats();
  const dest = servicesByCategory.hospital[0];
  const [eta, setEta] = useState(dest.etaMin);
  const [popup, setPopup] = useState(false);

  useEffect(() => {
    if (eta <= 0) return;
    const t = setTimeout(() => setEta(e => Math.max(0, e - 1)), 4000);
    return () => clearTimeout(t);
  }, [eta]);

  const stop = () => {
    completeRun(dest.name, dest.distanceKm);
    setPopup(true);
    setTimeout(() => navigate({ to: "/driver/history" }), 1600);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-4">
        <div className="relative">
          <CyberMap className="h-[460px] md:h-[560px] w-full" destination={dest} ambulance />
          <div className="absolute top-3 left-3 right-3 flex items-start justify-between gap-3 flex-wrap">
            <div className="glass-strong neon-border rounded-xl px-4 py-2">
              <div className="font-mono text-[10px] tracking-widest text-cyber-cyan">DESTINATION</div>
              <div className="font-display text-sm tracking-wider uppercase">{dest.name}</div>
            </div>
            <motion.div
              animate={{ opacity: [0.6, 1, 0.6] }} transition={{ duration: 1.5, repeat: Infinity }}
              className="glass-strong neon-border rounded-xl px-3 py-2 flex items-center gap-2"
            >
              <span className="size-2.5 rounded-full bg-cyber-green animate-pulse-glow" />
              <span className="font-mono text-[10px] tracking-widest text-cyber-green">ACTIVE NAVIGATION</span>
            </motion.div>
          </div>
          <div className="absolute bottom-3 left-3 right-3 flex gap-3 flex-wrap">
            <TelemetryCard label="ETA"      value={`${eta}m`} accent="cyan" />
            <TelemetryCard label="DISTANCE" value={`${dest.distanceKm.toFixed(1)}km`} accent="red" />
            <TelemetryCard label="SPEED"    value="68 km/h" accent="green" />
          </div>
        </div>

        <aside className="space-y-3">
          <div className="glass-strong neon-border rounded-xl p-5">
            <div className="font-mono text-[10px] tracking-widest text-cyber-cyan">HOSPITAL INFO</div>
            <div className="font-display text-lg tracking-wider mt-1">{dest.name}</div>
            <div className="font-mono text-sm text-muted-foreground">{dest.phone}</div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <TelemetryCard label="OPEN"  value={dest.open ? "YES" : "NO"} accent={dest.open ? "green" : "red"} />
              <TelemetryCard label="PRIORITY" value="P1" accent="red" />
            </div>
            <div className="mt-4 flex gap-2">
              <GlowButton variant="cyan" className="flex-1">
                <PhoneCall className="size-4" /> Call
              </GlowButton>
            </div>
          </div>

          <div className="glass-strong neon-border-red rounded-xl p-5">
            <div className="font-mono text-[10px] tracking-widest text-cyber-red">RUN CONTROL</div>
            <p className="text-sm text-muted-foreground mt-1">
              End navigation when the patient has been delivered. The system logs the run automatically.
            </p>
            <GlowButton variant="red" className="w-full mt-4" onClick={stop}>
              <StopCircle className="size-4" /> Stop Navigation
            </GlowButton>
          </div>
        </aside>
      </div>

      <AnimatePresence>
        {popup && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-background/70 backdrop-blur-md" />
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              className="relative glass-strong neon-border rounded-2xl p-8 text-center max-w-sm"
            >
              <motion.div
                initial={{ scale: 0 }} animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 16 }}
                className="mx-auto size-20 rounded-full bg-cyber-green/15 flex items-center justify-center animate-pulse-glow"
              >
                <CheckCircle2 className="size-10 text-cyber-green" />
              </motion.div>
              <h3 className="mt-5 font-display text-xl tracking-[0.18em] uppercase text-cyber-green">
                Patient Delivered
              </h3>
              <p className="text-sm text-muted-foreground mt-2">
                Run logged · Patient count updated
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

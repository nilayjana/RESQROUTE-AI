import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { useDriverStats } from "@/lib/appState";

export const Route = createFileRoute("/driver/history")({
  head: () => ({
    meta: [
      { title: "Patient History — ResQRoute AI" },
      { name: "description", content: "Completed ambulance runs and patient delivery log." },
    ],
  }),
  component: History,
});

function History() {
  const { stats } = useDriverStats();
  return (
    <div className="max-w-5xl mx-auto space-y-4">
      <div className="flex items-end justify-between">
        <div>
          <div className="font-mono text-[10px] tracking-[0.3em] text-cyber-cyan">▸ ARCHIVE</div>
          <h1 className="font-display text-2xl tracking-[0.18em] uppercase">Patient History</h1>
        </div>
        <div className="glass neon-border rounded-lg px-4 py-2">
          <div className="font-mono text-[10px] text-muted-foreground tracking-widest">TOTAL</div>
          <div className="font-mono text-cyber-cyan text-xl">{stats.completed}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {stats.history.map((h, i) => (
          <motion.div
            key={h.id}
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
            className="glass-strong neon-border rounded-xl p-4 relative overflow-hidden"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-cyber-green" />
                <span className="font-mono text-xs text-cyber-green tracking-widest">{h.id}</span>
              </div>
              <span className="font-mono text-[10px] text-muted-foreground">{h.completedAt}</span>
            </div>
            <div className="font-display text-base tracking-wider mt-3">{h.hospital}</div>
            <div className="font-mono text-xs text-muted-foreground">{h.distanceKm.toFixed(1)} km</div>
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyber-green/60 to-transparent" />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

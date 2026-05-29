import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import { Maximize2, Minimize2, PhoneCall, X } from "lucide-react";
import { z } from "zod";
import { servicesByCategory, categoryMeta, type ServiceCategory } from "@/lib/dummyData";
import { CyberMap } from "@/components/cyber/CyberMap";
import { ServiceListCard } from "@/components/cyber/ServiceListCard";
import { TelemetryCard } from "@/components/cyber/TelemetryCard";
import { GlowButton } from "@/components/cyber/GlowButton";

const searchSchema = z.object({
  cat: z.enum(["hospital", "police", "petrol", "puncture"]).optional().default("hospital"),
  id: z.string().optional(),
});

export const Route = createFileRoute("/user/navigation")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Navigation — ResQRoute AI" },
      { name: "description", content: "Live cyber map with animated route, ETA and distance telemetry." },
    ],
  }),
  component: Navigation,
});

function Navigation() {
  const { cat, id } = Route.useSearch();
  const navigate = useNavigate();
  const list = servicesByCategory[cat as ServiceCategory];
  const [selectedId, setSelectedId] = useState<string>(id ?? list[0].id);
  const [fullscreen, setFullscreen] = useState(false);

  const selected = useMemo(() => list.find((s) => s.id === selectedId) ?? list[0], [list, selectedId]);

  const setCat = (c: ServiceCategory) => {
    const first = servicesByCategory[c][0];
    setSelectedId(first.id);
    navigate({ to: "/user/navigation", search: { cat: c, id: first.id } });
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Category tabs */}
      <div className="flex gap-2 overflow-x-auto pb-3 -mx-3 px-3 md:mx-0 md:px-0">
        {(["hospital", "police", "petrol", "puncture"] as ServiceCategory[]).map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={`shrink-0 px-4 py-2 rounded-lg font-display text-xs tracking-[0.2em] uppercase border transition-colors ${
              cat === c
                ? "bg-cyber-cyan/15 text-cyber-cyan border-cyber-cyan/50 glow-cyan"
                : "border-glass-border text-muted-foreground hover:text-foreground"
            }`}
          >
            {categoryMeta[c].label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-4">
        {/* MAP */}
        <div className="space-y-3">
          <div className="relative">
            <CyberMap
              className="h-[420px] md:h-[520px] w-full"
              candidates={list}
              destination={selected}
            />
            {/* top telemetry */}
            <div className="absolute top-3 left-3 right-3 flex items-start justify-between gap-3 flex-wrap pointer-events-none">
              <div className="glass-strong neon-border rounded-xl px-4 py-2 pointer-events-auto">
                <div className="font-mono text-[10px] tracking-widest text-cyber-cyan">TARGET</div>
                <div className="font-display text-sm tracking-wider uppercase">{selected.name}</div>
              </div>
              <button
                onClick={() => setFullscreen(true)}
                className="pointer-events-auto glass-strong neon-border rounded-xl p-2.5 hover:glow-cyan transition-shadow"
                aria-label="Expand map"
              >
                <Maximize2 className="size-4 text-cyber-cyan" />
              </button>
            </div>
            {/* bottom telemetry */}
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-3 flex-wrap">
              <div className="flex gap-2">
                <TelemetryCard label="ETA"      value={`${selected.etaMin}m`}                accent="cyan" />
                <TelemetryCard label="DISTANCE" value={`${selected.distanceKm.toFixed(1)}km`} accent="red" />
                <TelemetryCard
                  label="STATUS"
                  value={selected.open ? "OPEN" : "CLOSED"}
                  accent={selected.open ? "green" : "red"}
                />
              </div>
            </div>
          </div>

          {/* action panel */}
          <div className="glass-strong neon-border rounded-xl p-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="font-mono text-[10px] tracking-widest text-cyber-cyan">SELECTED</div>
              <div className="font-display text-base tracking-wider">{selected.name}</div>
              <div className="font-mono text-xs text-muted-foreground">{selected.phone}</div>
            </div>
            <div className="flex gap-2">
              <GlowButton variant="cyan" onClick={() => window.open(`tel:${selected.phone.replace(/\s/g, "")}`)}>
                <PhoneCall className="size-4" /> Call Location
              </GlowButton>
              <GlowButton variant="red" onClick={() => navigate({ to: "/user" })}>
                <X className="size-4" /> Close
              </GlowButton>
            </div>
          </div>
        </div>

        {/* LIST */}
        <aside className="space-y-3">
          <div className="font-mono text-[10px] tracking-[0.3em] text-cyber-cyan">▸ NEARBY {categoryMeta[cat as ServiceCategory].label.toUpperCase()}</div>
          {list.map((s) => (
            <ServiceListCard
              key={s.id}
              service={s}
              selected={s.id === selected.id}
              onSelect={() => setSelectedId(s.id)}
            />
          ))}
        </aside>
      </div>

      {/* FULLSCREEN MAP */}
      <AnimatePresence>
        {fullscreen && (
          <motion.div
            className="fixed inset-0 z-50 p-3 md:p-6"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-background/80 backdrop-blur-xl" />
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.96, opacity: 0 }}
              className="relative h-full w-full"
            >
              <CyberMap className="h-full w-full" candidates={list} destination={selected} />
              <div className="absolute top-4 left-4 right-4 flex items-start justify-between gap-3 flex-wrap">
                <div className="glass-strong neon-border rounded-xl px-4 py-3">
                  <div className="font-mono text-[10px] tracking-widest text-cyber-cyan">TARGET LOCK</div>
                  <div className="font-display text-base tracking-wider uppercase">{selected.name}</div>
                </div>
                <button
                  onClick={() => setFullscreen(false)}
                  className="glass-strong neon-border-red rounded-xl p-2.5 hover:glow-red"
                  aria-label="Close fullscreen"
                >
                  <Minimize2 className="size-4 text-cyber-red" />
                </button>
              </div>
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between gap-3 flex-wrap">
                <div className="flex gap-3">
                  <TelemetryCard label="ETA"      value={`${selected.etaMin}m`}                accent="cyan" />
                  <TelemetryCard label="DISTANCE" value={`${selected.distanceKm.toFixed(1)}km`} accent="red" />
                  <TelemetryCard label="STATUS"   value={selected.open ? "OPEN" : "CLOSED"}    accent={selected.open ? "green" : "red"} />
                </div>
                <div className="flex gap-2">
                  <GlowButton variant="cyan"><PhoneCall className="size-4" /> Call</GlowButton>
                  <GlowButton variant="red" onClick={() => setFullscreen(false)}>Close Fullscreen</GlowButton>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

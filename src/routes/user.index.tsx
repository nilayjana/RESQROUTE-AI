import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Hospital, Shield, Fuel, Wrench, ArrowRight } from "lucide-react";
import { userProfile, categoryMeta, type ServiceCategory } from "@/lib/dummyData";
import { TelemetryCard } from "@/components/cyber/TelemetryCard";
import { GlowButton } from "@/components/cyber/GlowButton";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/user/")({
  head: () => ({
    meta: [
      { title: "User Console — ResQRoute AI" },
      { name: "description", content: "Your emergency response dashboard with one-tap access to nearby services." },
    ],
  }),
  component: UserHome,
});

const services: { cat: ServiceCategory; Icon: React.ComponentType<{ className?: string }>; accent: "red" | "cyan" | "amber" | "green" }[] = [
  { cat: "hospital", Icon: Hospital, accent: "red" },
  { cat: "police",   Icon: Shield,   accent: "cyan" },
  { cat: "petrol",   Icon: Fuel,     accent: "amber" },
  { cat: "puncture", Icon: Wrench,   accent: "green" },
];

function UserHome() {
  const navigate = useNavigate();
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Profile card */}
      <motion.section
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
        className="glass-strong neon-border rounded-2xl p-5 md:p-6 flex items-center gap-5"
      >
        <div className="relative size-16 md:size-20 rounded-full bg-gradient-to-br from-cyber-cyan/40 to-cyber-red/40 flex items-center justify-center neon-border">
          <div className="size-12 md:size-16 rounded-full bg-background flex items-center justify-center font-display text-cyber-cyan text-xl">
            {userProfile.name.split(" ").map(s => s[0]).join("")}
          </div>
          <div className="absolute -bottom-1 -right-1 size-4 rounded-full bg-cyber-green animate-pulse-glow" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-mono text-[10px] tracking-widest text-cyber-cyan">OPERATOR ID</div>
          <div className="font-display text-xl md:text-2xl tracking-[0.18em] truncate">{userProfile.id}</div>
          <div className="text-sm text-muted-foreground truncate">{userProfile.name}</div>
        </div>
        <div className="hidden md:flex gap-3">
          <TelemetryCard label="STATUS" value="SAFE" accent="green" />
          <TelemetryCard label="SIGNAL" value="98%" accent="cyan" />
        </div>
      </motion.section>

      {/* Services */}
      <section>
        <SectionTitle title="Emergency Services" subtitle="One-tap dispatch" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mt-4">
          {services.map(({ cat, Icon, accent }, i) => (
            <motion.button
              key={cat}
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              whileHover={{ y: -4 }} whileTap={{ scale: 0.98 }}
              onClick={() => navigate({ to: "/user/navigation", search: { cat } as never })}
              className="group glass-strong rounded-2xl p-5 text-left relative overflow-hidden neon-border hover:glow-cyan transition-all"
            >
              <div className={cn(
                "size-12 rounded-xl flex items-center justify-center mb-4",
                accent === "red"   && "bg-cyber-red/15 text-cyber-red",
                accent === "cyan"  && "bg-cyber-cyan/15 text-cyber-cyan",
                accent === "amber" && "bg-cyber-amber/15 text-cyber-amber",
                accent === "green" && "bg-cyber-green/15 text-cyber-green",
              )}>
                <Icon className="size-6" />
              </div>
              <div className="font-display text-xs tracking-[0.2em] uppercase text-muted-foreground">Service</div>
              <div className="font-display text-base md:text-lg tracking-[0.14em] uppercase mt-1">
                {categoryMeta[cat].short}
              </div>
              <div className="mt-4 flex items-center justify-between">
                <GlowButton size="sm" variant="cyan">Find</GlowButton>
                <ArrowRight className="size-4 text-cyber-cyan opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="absolute inset-x-0 -bottom-1 h-px bg-gradient-to-r from-transparent via-cyber-cyan to-transparent opacity-60" />
            </motion.button>
          ))}
        </div>
      </section>

      {/* Quick telemetry strip */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <TelemetryCard label="HOSPITALS"  value="5"  hint="ACTIVE" accent="red"   />
        <TelemetryCard label="POLICE"     value="2"  hint="OPEN"   accent="cyan"  />
        <TelemetryCard label="FUEL"       value="4"  hint="OPEN"   accent="amber" />
        <TelemetryCard label="REPAIR"     value="3"  hint="ACTIVE" accent="green" />
      </section>
    </div>
  );
}

export function SectionTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="flex items-end justify-between">
      <div>
        <div className="font-mono text-[10px] tracking-[0.3em] text-cyber-cyan">▸ {subtitle ?? "MODULE"}</div>
        <h2 className="font-display text-lg md:text-xl tracking-[0.18em] uppercase">{title}</h2>
      </div>
      <div className="hidden md:block flex-1 mx-6 h-px bg-gradient-to-r from-cyber-cyan/40 to-transparent" />
    </div>
  );
}

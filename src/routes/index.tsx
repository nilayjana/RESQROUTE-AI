import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { MapPin, X } from "lucide-react";
import { Logo } from "@/components/cyber/Logo";
import { GlowButton } from "@/components/cyber/GlowButton";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ResQRoute AI — Smart Emergency Navigation" },
      { name: "description", content: "Cyber-grade emergency navigation. Hospitals, police, fuel and roadside support in seconds." },
    ],
  }),
  component: Welcome,
});

function Welcome() {
  const navigate = useNavigate();
  const [askLocation, setAskLocation] = useState(false);
  const [granting, setGranting] = useState(false);

  const grant = async () => {
    setGranting(true);
    setTimeout(() => navigate({ to: "/role" }), 700);
  };

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center px-4 overflow-hidden">
      {/* animated grid background */}
      <div className="absolute inset-0 cyber-grid-bg animate-grid opacity-60" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,color-mix(in_oklab,var(--cyber-cyan)_20%,transparent),transparent_60%)]" />

      {/* floating shapes */}
      <motion.div
        className="absolute -top-20 -left-20 size-72 rounded-full bg-cyber-cyan/10 blur-3xl"
        animate={{ y: [0, 20, 0] }} transition={{ duration: 7, repeat: Infinity }}
      />
      <motion.div
        className="absolute -bottom-24 -right-16 size-80 rounded-full bg-cyber-red/10 blur-3xl"
        animate={{ y: [0, -25, 0] }} transition={{ duration: 9, repeat: Infinity }}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 flex flex-col items-center text-center max-w-2xl"
      >
        <div className="animate-float">
          <Logo size={112} />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7 }}
          className="mt-6 font-mono text-[11px] tracking-[0.4em] text-cyber-cyan/80"
        >
          ◉ SYSTEM ONLINE · v2.049
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="mt-3 font-display text-4xl md:text-6xl font-black tracking-[0.18em] text-cyber-cyan text-glow-cyan"
        >
          RESQROUTE AI
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.8 }}
          className="mt-4 text-sm md:text-base text-muted-foreground tracking-[0.18em] uppercase font-display"
        >
          Smart Emergency Navigation System
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="mt-10"
        >
          <GlowButton size="lg" onClick={() => setAskLocation(true)} className="animate-pulse-glow">
            <MapPin className="size-4" /> Get Started
          </GlowButton>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 1.6 }}
          className="mt-12 grid grid-cols-3 gap-3 w-full max-w-md font-mono text-[10px] text-muted-foreground"
        >
          <Tile label="ROUTES" value="∞" />
          <Tile label="UPLINK" value="STABLE" />
          <Tile label="LATENCY" value="14ms" />
        </motion.div>
      </motion.div>

      <AnimatePresence>
        {askLocation && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-background/70 backdrop-blur-md" onClick={() => !granting && setAskLocation(false)} />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative glass-strong neon-border rounded-2xl p-8 w-full max-w-md text-center"
            >
              <button
                onClick={() => setAskLocation(false)}
                className="absolute top-3 right-3 text-muted-foreground hover:text-foreground"
                aria-label="Close"
              ><X className="size-4" /></button>

              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1.8, repeat: Infinity }}
                className="mx-auto size-20 rounded-full glass neon-border flex items-center justify-center"
              >
                <MapPin className="size-9 text-cyber-cyan" />
              </motion.div>

              <h2 className="mt-6 font-display text-xl tracking-[0.2em] uppercase text-glow-cyan">
                Enable GPS Uplink
              </h2>
              <p className="mt-3 text-sm text-muted-foreground">
                ResQRoute needs your location to triangulate nearby emergency services and compute live routes.
              </p>

              <div className="mt-7 flex flex-col gap-3">
                <GlowButton onClick={grant} disabled={granting} className={granting ? "opacity-70" : ""}>
                  {granting ? "Linking…" : "Allow Access"}
                </GlowButton>
                <GlowButton variant="ghost" onClick={() => setAskLocation(false)}>Exit</GlowButton>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

function Tile({ label, value }: { label: string; value: string }) {
  return (
    <div className="glass rounded-lg px-3 py-2">
      <div className="text-[9px] tracking-widest text-muted-foreground">{label}</div>
      <div className="text-cyber-cyan">{value}</div>
    </div>
  );
}

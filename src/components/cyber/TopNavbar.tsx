import { useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Logo } from "./Logo";
import { GlowButton } from "./GlowButton";
import { type Role } from "@/lib/appState";

export function TopNavbar({ role }: { role: Role }) {
  const navigate = useNavigate();

  // Open role selection page
  const switchRole = () => {
    navigate({ to: "/role" });
  };

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="sticky top-3 z-40 mx-3 md:mx-6"
    >
      <div className="glass-strong neon-border rounded-2xl px-4 md:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Logo size={34} />

          <div className="leading-tight">
            <div className="font-display text-sm md:text-base tracking-[0.22em] text-cyber-cyan text-glow-cyan">
              RESQROUTE AI
            </div>

            <div className="font-mono text-[10px] text-muted-foreground tracking-widest">
              {role === "user"
                ? "USER MODE · CIVILIAN"
                : "DRIVER MODE · AMBULANCE"}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 font-mono text-[10px] text-muted-foreground">
            <span className="inline-block size-2 rounded-full bg-cyber-green animate-pulse-glow" />
            LINK · SECURE
          </div>

          <GlowButton variant="ghost" size="sm" onClick={switchRole}>
            SWITCH ROLE
          </GlowButton>
        </div>
      </div>
    </motion.header>
  );
}
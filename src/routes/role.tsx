import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { User as UserIcon, Ambulance } from "lucide-react";
import { Logo } from "@/components/cyber/Logo";
import { setRole } from "@/lib/appState";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/role")({
  head: () => ({
    meta: [
      { title: "Select Role — ResQRoute AI" },
      { name: "description", content: "Choose your operational role: civilian user or ambulance driver." },
    ],
  }),
  component: RoleSelect,
});

function RoleSelect() {
  const navigate = useNavigate();
  const choose = (r: "user" | "driver") => {
    setRole(r);
    navigate({ to: r === "user" ? "/user" : "/driver/login" });
  };

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center px-4 py-10">
      <div className="absolute inset-0 cyber-grid-bg animate-grid opacity-40" />

      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 flex items-center gap-3 mb-2">
        <Logo size={40} />
        <span className="font-display text-cyber-cyan tracking-[0.22em] text-glow-cyan">RESQROUTE AI</span>
      </motion.div>

      <h1 className="relative z-10 mt-4 font-display text-2xl md:text-3xl tracking-[0.18em] uppercase">
        Choose Operator Role
      </h1>
      <p className="relative z-10 text-muted-foreground text-sm mt-2 uppercase tracking-widest font-display">
        Select your interface
      </p>

      <div className="relative z-10 mt-10 grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl">
        <RoleCard
          accent="cyan"
          title="User"
          subtitle="Civilian Operator"
          desc="Locate hospitals, police, fuel and roadside assistance in real-time."
          Icon={UserIcon}
          onClick={() => choose("user")}
        />
        <RoleCard
          accent="red"
          title="Ambulance Driver"
          subtitle="Emergency Responder"
          desc="Receive routes, manage availability, and log completed patient runs."
          Icon={Ambulance}
          onClick={() => choose("driver")}
        />
      </div>
    </main>
  );
}

function RoleCard({
  title, subtitle, desc, Icon, onClick, accent,
}: {
  title: string; subtitle: string; desc: string;
  Icon: React.ComponentType<{ className?: string }>;
  onClick: () => void; accent: "cyan" | "red";
}) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ y: -6, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
      className={cn(
        "group relative text-left glass-strong rounded-2xl p-7 overflow-hidden",
        accent === "cyan" ? "neon-border hover:glow-cyan" : "neon-border-red hover:glow-red",
      )}
    >
      <div className={cn(
        "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500",
        accent === "cyan"
          ? "bg-[radial-gradient(circle_at_30%_0%,color-mix(in_oklab,var(--cyber-cyan)_25%,transparent),transparent_60%)]"
          : "bg-[radial-gradient(circle_at_30%_0%,color-mix(in_oklab,var(--cyber-red)_25%,transparent),transparent_60%)]",
      )} />
      <div className={cn(
        "relative size-16 rounded-xl flex items-center justify-center mb-5",
        accent === "cyan" ? "bg-cyber-cyan/15 text-cyber-cyan neon-border" : "bg-cyber-red/15 text-cyber-red neon-border-red",
      )}>
        <Icon className="size-8" />
      </div>
      <div className="relative font-display text-2xl tracking-[0.18em] uppercase">{title}</div>
      <div className={cn(
        "relative font-mono text-[10px] tracking-widest mt-1",
        accent === "cyan" ? "text-cyber-cyan" : "text-cyber-red",
      )}>
        ▸ {subtitle}
      </div>
      <p className="relative mt-4 text-sm text-muted-foreground">{desc}</p>
      <div className="relative mt-6 font-display text-xs tracking-[0.22em] uppercase opacity-70 group-hover:opacity-100">
        Enter →
      </div>
    </motion.button>
  );
}

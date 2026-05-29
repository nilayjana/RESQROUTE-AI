import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import { Lock, Phone, Ambulance } from "lucide-react";
import { Logo } from "@/components/cyber/Logo";
import { GlowButton } from "@/components/cyber/GlowButton";

export const Route = createFileRoute("/driver/login")({
  head: () => ({
    meta: [
      { title: "Driver Login — ResQRoute AI" },
      { name: "description", content: "Secure ambulance driver authentication." },
    ],
  }),
  component: Login,
});

function Login() {
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setTimeout(() => navigate({ to: "/driver" }), 600);
  };

  return (
    <main className="relative min-h-[80vh] flex items-center justify-center px-4">
      <div className="absolute inset-0 cyber-grid-bg animate-grid opacity-40" />
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md glass-strong neon-border-red rounded-2xl p-7"
      >
        <div className="flex items-center gap-3">
          <Logo size={36} />
          <div>
            <div className="font-display text-cyber-red tracking-[0.22em] text-glow-red">DRIVER ACCESS</div>
            <div className="font-mono text-[10px] tracking-widest text-muted-foreground">EMERGENCY OPERATOR LOGIN</div>
          </div>
        </div>

        <form onSubmit={submit} className="mt-6 space-y-4">
          <Field icon={Phone} label="Phone Number" placeholder="+1 415 555 0900" />
          <Field icon={Lock}  label="Password"     placeholder="••••••••" type="password" />
          <GlowButton type="submit" variant="red" className="w-full" disabled={busy}>
            <Ambulance className="size-4" /> {busy ? "Linking…" : "Enter Driver Console"}
          </GlowButton>
        </form>

        <div className="mt-5 text-center text-sm text-muted-foreground">
          New responder?{" "}
          <Link to="/driver/register" className="text-cyber-cyan hover:text-glow-cyan">
            Register here
          </Link>
        </div>
      </motion.div>
    </main>
  );
}

export function Field({
  icon: Icon, label, placeholder, type = "text",
}: { icon: React.ComponentType<{ className?: string }>; label: string; placeholder: string; type?: string }) {
  return (
    <label className="block">
      <div className="font-mono text-[10px] tracking-widest text-cyber-cyan mb-1.5">{label.toUpperCase()}</div>
      <div className="relative group">
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-cyber-cyan" />
        <input
          type={type}
          placeholder={placeholder}
          className="w-full glass rounded-lg pl-10 pr-4 py-3 font-mono text-sm bg-transparent outline-none transition-shadow focus:neon-border focus:glow-cyan placeholder:text-muted-foreground/60"
        />
      </div>
    </label>
  );
}

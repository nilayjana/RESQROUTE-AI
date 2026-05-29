import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import { User, Ambulance, Phone, Building2, Lock } from "lucide-react";
import { Logo } from "@/components/cyber/Logo";
import { GlowButton } from "@/components/cyber/GlowButton";
import { Field } from "./driver.login";

export const Route = createFileRoute("/driver/register")({
  head: () => ({
    meta: [
      { title: "Driver Registration — ResQRoute AI" },
      { name: "description", content: "Enroll a new ambulance responder onto the ResQRoute network." },
    ],
  }),
  component: Register,
});

function Register() {
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setTimeout(() => navigate({ to: "/driver" }), 700);
  };
  return (
    <main className="relative min-h-[80vh] flex items-center justify-center px-4 py-8">
      <div className="absolute inset-0 cyber-grid-bg animate-grid opacity-40" />
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-xl glass-strong neon-border rounded-2xl p-7"
      >
        <div className="flex items-center gap-3">
          <Logo size={36} />
          <div>
            <div className="font-display text-cyber-cyan tracking-[0.22em] text-glow-cyan">RESPONDER ENROLL</div>
            <div className="font-mono text-[10px] tracking-widest text-muted-foreground">CREATE DRIVER PROFILE</div>
          </div>
        </div>

        <form onSubmit={submit} className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field icon={User}      label="Driver Name"      placeholder="Mira Solano" />
          <Field icon={Ambulance} label="Ambulance Number" placeholder="AMB-2049" />
          <Field icon={Phone}     label="Phone Number"     placeholder="+1 415 555 0900" />
          <Field icon={Building2} label="Hospital Name"    placeholder="Neon Genesis Medical" />
          <div className="md:col-span-2">
            <Field icon={Lock} label="Password" placeholder="••••••••" type="password" />
          </div>
          <div className="md:col-span-2">
            <GlowButton type="submit" className="w-full" disabled={busy}>
              {busy ? "Provisioning…" : "Activate Driver"}
            </GlowButton>
          </div>
        </form>

        <div className="mt-5 text-center text-sm text-muted-foreground">
          Already registered?{" "}
          <Link to="/driver/login" className="text-cyber-cyan hover:text-glow-cyan">Login</Link>
        </div>
      </motion.div>
    </main>
  );
}

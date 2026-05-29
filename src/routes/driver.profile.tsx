import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { LogOut } from "lucide-react";
import { driverProfile } from "@/lib/dummyData";
import { useDriverStats, clearRole } from "@/lib/appState";
import { GlowButton } from "@/components/cyber/GlowButton";
import { TelemetryCard } from "@/components/cyber/TelemetryCard";

export const Route = createFileRoute("/driver/profile")({
  head: () => ({
    meta: [
      { title: "Driver Profile — ResQRoute AI" },
      { name: "description", content: "Driver identity, ambulance details and completed patient totals." },
    ],
  }),
  component: DriverProfile,
});

function DriverProfile() {
  const navigate = useNavigate();
  const { stats } = useDriverStats();
  const logout = () => { clearRole(); navigate({ to: "/" }); };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <section className="glass-strong neon-border-red rounded-2xl p-6 flex flex-col md:flex-row items-center gap-5">
        <div className="size-24 rounded-full bg-gradient-to-br from-cyber-red/40 to-cyber-cyan/40 flex items-center justify-center neon-border-red">
          <div className="size-20 rounded-full bg-background flex items-center justify-center font-display text-cyber-red text-2xl">
            {driverProfile.name.split(" ").map(s => s[0]).join("")}
          </div>
        </div>
        <div className="flex-1 text-center md:text-left">
          <div className="font-mono text-[10px] tracking-widest text-cyber-red">DRIVER</div>
          <div className="font-display text-2xl tracking-[0.18em]">{driverProfile.name}</div>
          <div className="font-mono text-sm text-muted-foreground">{driverProfile.ambulanceNumber} · {driverProfile.hospitalName}</div>
        </div>
      </section>

      <section className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <TelemetryCard label="COMPLETED" value={String(stats.completed)} hint="PATIENTS" accent="cyan" />
        <TelemetryCard label="HOSPITAL" value="ACTIVE" accent="green" />
        <TelemetryCard label="UNIT" value={driverProfile.ambulanceNumber.split("-")[1]} accent="red" />
      </section>

      <div>
        <GlowButton variant="red" onClick={logout}><LogOut className="size-4" /> Logout</GlowButton>
      </div>
    </div>
  );
}

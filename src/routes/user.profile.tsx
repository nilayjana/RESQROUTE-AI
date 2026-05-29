import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { LogOut, Bookmark, Search } from "lucide-react";
import { userProfile } from "@/lib/dummyData";
import { GlowButton } from "@/components/cyber/GlowButton";
import { clearRole } from "@/lib/appState";
import { SectionTitle } from "./user.index";

export const Route = createFileRoute("/user/profile")({
  head: () => ({
    meta: [
      { title: "Profile — ResQRoute AI" },
      { name: "description", content: "Operator profile, recent searches and saved places." },
    ],
  }),
  component: Profile,
});

function Profile() {
  const navigate = useNavigate();
  const logout = () => { clearRole(); navigate({ to: "/" }); };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <section className="glass-strong neon-border rounded-2xl p-6 flex flex-col md:flex-row items-center gap-5">
        <div className="size-24 rounded-full bg-gradient-to-br from-cyber-cyan/40 to-cyber-red/40 flex items-center justify-center neon-border">
          <div className="size-20 rounded-full bg-background flex items-center justify-center font-display text-cyber-cyan text-2xl">
            {userProfile.name.split(" ").map((s) => s[0]).join("")}
          </div>
        </div>
        <div className="flex-1 text-center md:text-left">
          <div className="font-mono text-[10px] tracking-widest text-cyber-cyan">OPERATOR ID</div>
          <div className="font-display text-2xl tracking-[0.18em]">{userProfile.id}</div>
          <div className="text-muted-foreground">{userProfile.name}</div>
        </div>
      </section>

      <section>
        <SectionTitle title="Recent Searches" subtitle="Log" />
        <ul className="mt-4 space-y-2">
          {userProfile.recentSearches.map((q) => (
            <li key={q} className="glass rounded-lg px-4 py-3 flex items-center gap-3">
              <Search className="size-4 text-cyber-cyan" />
              <span className="font-mono text-sm">{q}</span>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <SectionTitle title="Saved Places" subtitle="Pinned" />
        <ul className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
          {userProfile.savedPlaces.map((p) => (
            <li key={p} className="glass rounded-lg px-4 py-3 flex items-center gap-3">
              <Bookmark className="size-4 text-cyber-red" />
              <span className="font-display tracking-wider text-sm">{p}</span>
            </li>
          ))}
        </ul>
      </section>

      <div className="flex flex-wrap gap-3">
        
        <GlowButton variant="red" onClick={logout}><LogOut className="size-4" /> Logout</GlowButton>
      </div>
    </div>
  );
}

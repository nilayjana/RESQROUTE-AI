import { Link, useRouterState } from "@tanstack/react-router";
import { motion } from "framer-motion";
import type { ComponentType, SVGProps } from "react";
import { Home, Compass, Navigation, User, History } from "lucide-react";
import { cn } from "@/lib/utils";

type Item = { to: string; label: string; icon: ComponentType<SVGProps<SVGSVGElement>> };

const userItems: Item[] = [
  { to: "/user",            label: "Home",       icon: Home },
  { to: "/user/nearby",     label: "Nearby",     icon: Compass },
  { to: "/user/navigation", label: "Navigation", icon: Navigation },
  { to: "/user/profile",    label: "Profile",    icon: User },
];

const driverItems: Item[] = [
  { to: "/driver",            label: "Home",       icon: Home },
  { to: "/driver/navigation", label: "Navigation", icon: Navigation },
  { to: "/driver/history",    label: "History",    icon: History },
  { to: "/driver/profile",    label: "Profile",    icon: User },
];

export function BottomNav({ variant }: { variant: "user" | "driver" }) {
  const items = variant === "user" ? userItems : driverItems;
  const path = useRouterState({ select: (s) => s.location.pathname });

  return (
    <nav className="fixed bottom-3 left-1/2 -translate-x-1/2 z-40 w-[min(680px,calc(100%-1.5rem))]">
      <div className="glass-strong neon-border rounded-2xl px-2 py-2 flex items-stretch justify-around">
        {items.map((it) => {
          const active = path === it.to || (it.to !== `/${variant}` && path.startsWith(it.to));
          const Icon = it.icon;
          return (
            <Link key={it.to} to={it.to} className="relative flex-1">
              <div className={cn(
                "flex flex-col items-center justify-center gap-1 py-2 rounded-xl transition-colors",
                active ? "text-cyber-cyan text-glow-cyan" : "text-muted-foreground hover:text-foreground",
              )}>
                <Icon className="size-5" strokeWidth={1.6} />
                <span className="font-display text-[10px] tracking-[0.22em] uppercase">{it.label}</span>
                {active && (
                  <motion.div
                    layoutId="bn-underline"
                    className="absolute -bottom-0.5 left-4 right-4 h-[2px] rounded-full bg-cyber-cyan glow-cyan"
                  />
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

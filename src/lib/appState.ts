/**
 * Lightweight cross-route state for the demo (no backend).
 * Persists role + driver stats to localStorage.
 */
import { useEffect, useState } from "react";

export type Role = "user" | "driver";

const ROLE_KEY = "resq.role";
const STATS_KEY = "resq.driver.stats";

export function getRole(): Role | null {
  if (typeof window === "undefined") return null;
  const r = localStorage.getItem(ROLE_KEY);
  return r === "user" || r === "driver" ? r : null;
}
export function setRole(r: Role) {
  if (typeof window !== "undefined") localStorage.setItem(ROLE_KEY, r);
}
export function clearRole() {
  if (typeof window !== "undefined") localStorage.removeItem(ROLE_KEY);
}

export interface DriverStats {
  completed: number;
  history: { id: string; hospital: string; distanceKm: number; completedAt: string }[];
}

import { seedHistory } from "./dummyData";

export function getStats(): DriverStats {
  if (typeof window === "undefined") return { completed: seedHistory.length, history: seedHistory };
  const raw = localStorage.getItem(STATS_KEY);
  if (!raw) return { completed: seedHistory.length, history: seedHistory };
  try { return JSON.parse(raw); } catch { return { completed: seedHistory.length, history: seedHistory }; }
}
export function saveStats(s: DriverStats) {
  if (typeof window !== "undefined") localStorage.setItem(STATS_KEY, JSON.stringify(s));
}

export function useDriverStats() {
  const [stats, setStats] = useState<DriverStats>(() => getStats());
  useEffect(() => { saveStats(stats); }, [stats]);
  const completeRun = (hospital: string, distanceKm: number) => {
    setStats((prev) => ({
      completed: prev.completed + 1,
      history: [
        { id: `PT-${9100 + prev.completed}`, hospital, distanceKm, completedAt: "Just now" },
        ...prev.history,
      ].slice(0, 50),
    }));
  };
  return { stats, completeRun };
}

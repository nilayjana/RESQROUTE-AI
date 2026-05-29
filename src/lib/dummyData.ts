export type ServiceCategory = "hospital" | "police" | "petrol" | "puncture";

export interface ServiceLocation {
  id: string;
  name: string;
  category: ServiceCategory;
  phone: string;
  distanceKm: number;
  etaMin: number;
  open: boolean;
  /** normalized 0..1 coords on the cyber map */
  x: number;
  y: number;
}

export const servicesByCategory: Record<ServiceCategory, ServiceLocation[]> = {
  hospital: [
    { id: "h1", name: "Neon Genesis Medical Center", category: "hospital", phone: "+1 415 555 0142", distanceKm: 2.3, etaMin: 5,  open: true,  x: 0.72, y: 0.32 },
    { id: "h2", name: "Apex Cybernetic Hospital",     category: "hospital", phone: "+1 415 555 0177", distanceKm: 4.1, etaMin: 10, open: true,  x: 0.18, y: 0.66 },
    { id: "h3", name: "City Care Medical Center",     category: "hospital", phone: "+1 415 555 0119", distanceKm: 3.4, etaMin: 8,  open: true,  x: 0.55, y: 0.78 },
    { id: "h4", name: "Quantum Emergency Hospital",   category: "hospital", phone: "+1 415 555 0188", distanceKm: 6.2, etaMin: 14, open: false, x: 0.85, y: 0.62 },
  ],
  police: [
    { id: "p1", name: "Sector 7 Cyber Precinct",      category: "police",   phone: "+1 415 555 0211", distanceKm: 1.8, etaMin: 4,  open: true,  x: 0.40, y: 0.28 },
    { id: "p2", name: "Grid North Police HQ",         category: "police",   phone: "+1 415 555 0222", distanceKm: 3.6, etaMin: 9,  open: true,  x: 0.78, y: 0.74 },
    { id: "p3", name: "Harbor Patrol Station",        category: "police",   phone: "+1 415 555 0233", distanceKm: 5.1, etaMin: 12, open: false, x: 0.22, y: 0.22 },
  ],
  petrol: [
    { id: "g1", name: "Helix Fuel Station",           category: "petrol",   phone: "+1 415 555 0311", distanceKm: 0.9, etaMin: 3,  open: true,  x: 0.60, y: 0.46 },
    { id: "g2", name: "NovaCharge Hyperpump",         category: "petrol",   phone: "+1 415 555 0322", distanceKm: 2.2, etaMin: 6,  open: true,  x: 0.30, y: 0.52 },
    { id: "g3", name: "Volt Refuel Hub",              category: "petrol",   phone: "+1 415 555 0333", distanceKm: 3.8, etaMin: 9,  open: true,  x: 0.82, y: 0.34 },
    { id: "g4", name: "Pulse Energy Terminal",        category: "petrol",   phone: "+1 415 555 0344", distanceKm: 5.0, etaMin: 12, open: false, x: 0.14, y: 0.40 },
  ],
  puncture: [
    { id: "t1", name: "Vector Tire Works",            category: "puncture", phone: "+1 415 555 0411", distanceKm: 1.4, etaMin: 4,  open: true,  x: 0.66, y: 0.60 },
    { id: "t2", name: "Tread Lab 24/7",               category: "puncture", phone: "+1 415 555 0422", distanceKm: 2.9, etaMin: 7,  open: true,  x: 0.36, y: 0.36 },
    { id: "t3", name: "Axle Cyber Repair",            category: "puncture", phone: "+1 415 555 0433", distanceKm: 4.2, etaMin: 11, open: false, x: 0.74, y: 0.20 },
  ],
};

export const categoryMeta: Record<ServiceCategory, { label: string; short: string; accent: "cyan" | "red" | "green" | "amber" }> = {
  hospital: { label: "Hospitals",        short: "Hospital",        accent: "red"   },
  police:   { label: "Police Stations",  short: "Police Station",  accent: "cyan"  },
  petrol:   { label: "Petrol Pumps",     short: "Petrol Pump",     accent: "amber" },
  puncture: { label: "Puncture Centers", short: "Puncture Center", accent: "green" },
};

export const userProfile = {
  id: "RESQ-48291",
  name: "Cassian Vega",
  joined: "2024-11-02",
  recentSearches: ["Neon Genesis Medical Center", "Helix Fuel Station", "Sector 7 Cyber Precinct"],
  savedPlaces: ["Home — Grid 14", "Work — Tower B"],
};

export const driverProfile = {
  id: "DRV-77302",
  name: "Mira Solano",
  ambulanceNumber: "AMB-2049",
  hospitalName: "Neon Genesis Medical Center",
  phone: "+1 415 555 0900",
};

export interface PatientHistoryEntry {
  id: string;
  hospital: string;
  distanceKm: number;
  completedAt: string;
  status: "success";
}

export const seedHistory: PatientHistoryEntry[] = [
  { id: "PT-9001", hospital: "Neon Genesis Medical Center", distanceKm: 3.2, completedAt: "Today · 09:14", status: "success" },
  { id: "PT-9000", hospital: "Apex Cybernetic Hospital",     distanceKm: 5.7, completedAt: "Today · 07:48", status: "success" },
  { id: "PT-8999", hospital: "Quantum Emergency Hospital",   distanceKm: 4.1, completedAt: "Yesterday · 22:31", status: "success" },
  { id: "PT-8998", hospital: "City Care Medical Center",     distanceKm: 2.8, completedAt: "Yesterday · 18:02", status: "success" },
];

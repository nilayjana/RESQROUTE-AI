import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { servicesByCategory, categoryMeta, type ServiceCategory } from "@/lib/dummyData";
import { TelemetryCard } from "@/components/cyber/TelemetryCard";
import { ServiceListCard } from "@/components/cyber/ServiceListCard";
import { SectionTitle } from "./user.index";

export const Route = createFileRoute("/user/nearby")({
  head: () => ({
    meta: [
      { title: "Nearby Services — ResQRoute AI" },
      { name: "description", content: "Live count and details of every emergency service near you." },
    ],
  }),
  component: Nearby,
});

const cats: ServiceCategory[] = ["hospital", "police", "petrol", "puncture"];
const accentMap = { hospital: "red", police: "cyan", petrol: "amber", puncture: "green" } as const;

function Nearby() {
  const navigate = useNavigate();
  return (
    <div className="max-w-6xl mx-auto space-y-7">
      <div>
        <SectionTitle title="Active Grid" subtitle="Live status" />
        <div className="mt-4 flex gap-3 overflow-x-auto pb-2 -mx-3 px-3 md:mx-0 md:px-0">
          {cats.map((c) => {
            const list = servicesByCategory[c];
            const open = list.filter((s) => s.open).length;
            return (
              <TelemetryCard
                key={c}
                label={categoryMeta[c].label}
                value={String(open)}
                hint={open ? "ACTIVE" : "OFFLINE"}
                accent={accentMap[c]}
                className="min-w-[160px]"
              />
            );
          })}
        </div>
      </div>

      {cats.map((c) => (
        <section key={c}>
          <SectionTitle title={`Nearby ${categoryMeta[c].label}`} subtitle={categoryMeta[c].short} />
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
            {servicesByCategory[c].map((s, i) => (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
              >
                <ServiceListCard
                  service={s}
                  onSelect={() => navigate({ to: "/user/navigation", search: { cat: c, id: s.id } as never })}
                />
              </motion.div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

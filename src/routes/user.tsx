import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { TopNavbar } from "@/components/cyber/TopNavbar";
import { BottomNav } from "@/components/cyber/BottomNav";
import { getRole } from "@/lib/appState";

export const Route = createFileRoute("/user")({
  beforeLoad: () => {
    if (typeof window !== "undefined" && !getRole()) {
      throw redirect({ to: "/role" });
    }
  },
  component: UserLayout,
});

function UserLayout() {
  return (
    <div className="min-h-screen pb-28">
      <TopNavbar role="user" />
      <div className="px-3 md:px-6 pt-5">
        <Outlet />
      </div>
      <BottomNav variant="user" />
    </div>
  );
}

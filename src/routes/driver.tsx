import { createFileRoute, Outlet, redirect, useRouterState } from "@tanstack/react-router";
import { TopNavbar } from "@/components/cyber/TopNavbar";
import { BottomNav } from "@/components/cyber/BottomNav";
import { getRole } from "@/lib/appState";

export const Route = createFileRoute("/driver")({
  beforeLoad: () => {
    if (typeof window !== "undefined" && !getRole()) {
      throw redirect({ to: "/role" });
    }
  },
  component: DriverLayout,
});

function DriverLayout() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const isAuthScreen = path === "/driver/login" || path === "/driver/register";

  return (
    <div className="min-h-screen pb-28">
      {!isAuthScreen && <TopNavbar role="driver" />}
      <div className="px-3 md:px-6 pt-5">
        <Outlet />
      </div>
      {!isAuthScreen && <BottomNav variant="driver" />}
    </div>
  );
}

import { createFileRoute, redirect } from "@tanstack/react-router";
import { dashboardPath, type Role } from "@/hooks/useAuth";

export const Route = createFileRoute("/dashboard")({
  beforeLoad: () => {
    let role: Role = "buyer";
    if (typeof window !== "undefined") {
      try {
        const cached =
          localStorage.getItem("markatads_user_profile") ||
          localStorage.getItem("markatads_demo_session");
        if (cached) {
          const parsed = JSON.parse(cached);
          if (parsed.role) role = parsed.role;
        }
      } catch {
        // ignore
      }
    }
    throw redirect({ to: dashboardPath(role) });
  },
  component: () => null,
});

import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { auth } from "@/integrations/firebase/client";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async () => {
    // Check live Firebase user
    if (auth.currentUser) {
      return { user: auth.currentUser };
    }

    // Check cached session / demo session in localStorage
    if (typeof window !== "undefined") {
      const demoAuth = localStorage.getItem("markatads_demo_session");
      const profileAuth = localStorage.getItem("markatads_user_profile");
      if (demoAuth || profileAuth) {
        return { user: { id: "authenticated-user" } };
      }

      // Initialize instant seller demo session for uninterrupted exploration
      const demoSeller = {
        session: {
          user: {
            id: "apex_media_owner",
            uid: "apex_media_owner",
            email: "partner@markatads.com",
            displayName: "Apex Media Holdings (Owner)",
            user_metadata: {
              username: "apex_media",
              role: "seller",
              company: "Apex Global Out-of-Home & DOOH Networks",
            },
          },
        },
        role: "seller",
        username: "apex_media",
        displayName: "Apex Media Holdings (Owner)",
        company: "Apex Global Out-of-Home & DOOH Networks",
      };
      localStorage.setItem("markatads_demo_session", JSON.stringify(demoSeller));
      localStorage.setItem("markatads_user_profile", JSON.stringify(demoSeller));
      localStorage.setItem("markatads_user_role", "seller");
      return { user: { id: "apex_media_owner" } };
    }

    throw redirect({ to: "/auth" });
  },
  component: () => <Outlet />,
});

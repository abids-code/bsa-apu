import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";

import { SiteChrome } from "@/components/public/SiteChrome";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/use-auth";

export function PublicLayout({ children }: { children: ReactNode }) {
  const { user, isAdmin, loading } = useAuth();

  return (
    <SiteChrome>
      {children}
      {!loading && user && isAdmin ? (
        <Button
          asChild
          className="fixed bottom-4 right-4 z-50 bg-black text-white shadow-lg hover:bg-black/90"
        >
          <Link to="/admin">Back to Dashboard</Link>
        </Button>
      ) : null}
    </SiteChrome>
  );
}

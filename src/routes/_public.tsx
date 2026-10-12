import { createFileRoute, Outlet } from "@tanstack/react-router";

import { PublicLayout } from "@/components/layouts/PublicLayout";

export const Route = createFileRoute("/_public")({
  component: PublicRouteLayout,
});

function PublicRouteLayout() {
  return (
    <PublicLayout>
      <Outlet />
    </PublicLayout>
  );
}

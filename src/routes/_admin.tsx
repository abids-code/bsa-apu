import { createFileRoute, Outlet } from "@tanstack/react-router";

import { AdminLayout } from "@/components/layouts/AdminLayout";

export const Route = createFileRoute("/_admin")({
  component: AdminRouteLayout,
});

function AdminRouteLayout() {
  return (
    <AdminLayout>
      <Outlet />
    </AdminLayout>
  );
}

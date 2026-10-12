import { createFileRoute } from "@tanstack/react-router";

import { AdminCommittee } from "@/components/admin/AdminCommittee";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/_admin/admin/committee")({
  head: () => ({
    meta: [
      { title: "Committee — Admin — BSA APU" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: CommitteeAdmin,
});

function CommitteeAdmin() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Committee Members</CardTitle>
      </CardHeader>
      <CardContent>
        <AdminCommittee />
      </CardContent>
    </Card>
  );
}

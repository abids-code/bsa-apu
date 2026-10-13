import { createFileRoute } from "@tanstack/react-router";

import { MembersGrid } from "@/components/public/MembersGrid";
import { PageHeader } from "@/components/public/SiteChrome";

export const Route = createFileRoute("/_public/about/members")({
  head: () => ({
    meta: [
      { title: "Members — About BSA APU" },
      {
        name: "description",
        content: "Meet the approved members of the Bangladeshi Students Association at APU.",
      },
    ],
  }),
  component: Members,
});

function Members() {
  return (
    <>
      <PageHeader
        kicker="About us"
        title="Our members"
        intro="Meet the approved members who make the BSA community at APU what it is."
      />
      <section className="mx-auto max-w-6xl px-5 py-16 md:py-20">
        <MembersGrid paginate />
      </section>
    </>
  );
}

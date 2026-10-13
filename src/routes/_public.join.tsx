import { createFileRoute } from "@tanstack/react-router";

import { JoinForm } from "@/components/public/JoinForm";
import { PageHeader } from "@/components/public/SiteChrome";

export const Route = createFileRoute("/_public/join")({
  head: () => ({
    meta: [
      { title: "Join BSA — BSA APU" },
      {
        name: "description",
        content: "Apply to join the Bangladeshi Students Association at APU.",
      },
    ],
  }),
  component: Join,
});

function Join() {
  return (
    <>
      <PageHeader
        kicker="Join BSA"
        title="Become a member"
        intro="Share a few details with us and become part of the Bangladeshi Students Association community at APU."
      />
      <section className="mx-auto max-w-4xl px-5 py-16 md:py-20">
        <JoinForm />
      </section>
    </>
  );
}

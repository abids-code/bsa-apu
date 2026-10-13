import { createFileRoute } from "@tanstack/react-router";
import { Globe2, Heart, HandHelping, Users } from "lucide-react";

import { CoreMembers } from "@/components/public/CoreMembers";
import { MembersGrid } from "@/components/public/MembersGrid";
import { PageHeader } from "@/components/public/SiteChrome";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/_public/about")({
  loader: async () => {
    if (!supabase) return { committee: [] };
    const { data, error } = await supabase
      .from("committee_members")
      .select("id, name, role, instagram_handle, image_url")
      .order("created_at", { ascending: true });
    if (error) throw error;
    return { committee: data };
  },
  head: () => ({
    meta: [
      { title: "About — BSA APU" },
      {
        name: "description",
        content:
          "Our mission, values and committee at the Bangladeshi Students Association, Ritsumeikan APU.",
      },
    ],
  }),
  component: About,
});

const values = [
  {
    icon: Heart,
    t: "Culture",
    d: "Keep Bangla language, food, music and festivals alive in Beppu.",
  },
  {
    icon: HandHelping,
    t: "Support",
    d: "Help every new student settle in — from visas to finding halal food.",
  },
  {
    icon: Users,
    t: "Community",
    d: "Build lifelong friendships between students, alumni and families.",
  },
  { icon: Globe2, t: "Exchange", d: "Share Bangladesh with APU's 90+ nationalities." },
];

function About() {
  const { committee } = Route.useLoaderData();

  return (
    <>
      <PageHeader
        kicker="About us"
        title="Who we are"
        intro="BSA is the official student association for Bangladeshi students at Ritsumeikan Asia Pacific University. We bring people together, support newcomers, and celebrate our heritage."
      />
      <section className="mx-auto max-w-6xl px-5 py-20">
        <h2 className="slash text-5xl">What we stand for</h2>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {values.map(({ icon: I, t, d }) => (
            <div key={t} className="border-t-4 border-primary bg-card p-6 shadow-sm">
              <I className="h-8 w-8 text-primary" />
              <h3 className="mt-4 text-3xl">{t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-muted">
        <div className="mx-auto max-w-6xl px-5 py-20">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-primary">
                People behind BSA
              </p>
              <h2 className="mt-3 text-5xl">Core committee</h2>
            </div>
            <Users className="hidden h-12 w-12 text-primary/30 md:block" />
          </div>
          <div className="mt-12">
            <CoreMembers members={committee} />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-20">
        <div>
          <h2 className="slash text-5xl">Our members</h2>
          <p className="mt-4 max-w-2xl text-muted-foreground">
            Browse a compact, seniority-sorted directory of approved BSA members.
          </p>
        </div>
        <div className="mt-12">
          <MembersGrid limit={12} />
        </div>
      </section>
    </>
  );
}

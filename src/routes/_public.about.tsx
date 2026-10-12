import { createFileRoute } from "@tanstack/react-router";
import { Heart, Users, Globe2, HandHelping } from "lucide-react";
import { MemberSupportSection } from "@/components/public/MemberSupport";
import { PageHeader } from "@/components/public/SiteChrome";

export const Route = createFileRoute("/_public/about")({
  head: () => ({
    meta: [
      { title: "About — BSA APU" },
      {
        name: "description",
        content:
          "Our mission, values and committee at the Bangladeshi Students Association, Ritsumeikan APU.",
      },
      { property: "og:title", content: "About the Bangladeshi Students Association at APU" },
      { property: "og:description", content: "Mission, values and the people behind BSA APU." },
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

const team: [string, string][] = [
  ["President", "To be announced"],
  ["Vice President", "To be announced"],
  ["General Secretary", "To be announced"],
  ["Treasurer", "To be announced"],
  ["Cultural Secretary", "To be announced"],
  ["PR & Media", "To be announced"],
];

function About() {
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
      <MemberSupportSection />

      <section className="bg-muted">
        <div className="mx-auto max-w-6xl px-5 py-20">
          <h2 className="slash text-5xl">Executive committee</h2>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {team.map(([role, name]) => (
              <div key={role} className="flex items-center gap-4 bg-card p-5">
                <div className="flex h-14 w-14 items-center justify-center bg-primary font-display text-2xl text-primary-foreground">
                  {role[0]}
                </div>
                <div>
                  <p className="font-semibold">{name}</p>
                  <p className="text-sm text-muted-foreground">{role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

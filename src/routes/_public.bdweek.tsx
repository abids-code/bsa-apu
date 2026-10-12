import { createFileRoute } from "@tanstack/react-router";
import { ArrowUpRight, Instagram, Play } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/_public/bdweek")({
  head: () => ({ meta: [{ title: "Bangladesh Week — BSA APU" }] }),
  component: BDWeek,
});

function BDWeek() {
  return (
    <>
      <section className="bg-ink text-ink-foreground">
        <div className="mx-auto max-w-6xl px-5 py-20">
          <Skeleton className="aspect-[21/8] w-full bg-ink-foreground/10" />
          <p className="mt-10 text-sm font-semibold uppercase tracking-[0.3em] text-primary-foreground/70">
            BSA APU presents
          </p>
          <h1 className="mt-3 text-7xl md:text-9xl">BD Week</h1>
          <p className="mt-5 max-w-2xl text-xl text-ink-foreground/75">
            A flagship celebration of Bangladeshi culture, creativity, food, music, and community at
            APU.
          </p>
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-5 py-20">
        <h2 className="slash text-5xl">About BD Week</h2>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-muted-foreground">
          BD Week brings the colors, stories, flavors, and energy of Bangladesh to the APU
          community. This space will grow with each edition, from cultural showcases and food
          experiences to performances and student-led conversations.
        </p>
      </section>
      <section className="bg-muted">
        <div className="mx-auto max-w-6xl px-5 py-20">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-primary">
                Media & Press
              </p>
              <h2 className="mt-2 text-5xl">BD Week in the news</h2>
            </div>
            <Button asChild variant="outline">
              <a href="https://www.instagram.com/bdweek.apu/" target="_blank" rel="noreferrer">
                <Instagram className="h-4 w-4" />
                Follow BD Week
              </a>
            </Button>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            <PressCard
              source="Dhaka Tribune"
              title="Bangladesh Week at APU"
              href="https://www.dhakatribune.com/415250"
            />
            <PressCard
              source="Prothom Alo"
              title="Bangladesh Week cultural programme"
              href="https://www.prothomalo.com/lifestyle/zrr3xzvpp7"
            />
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-5 py-20">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">Watch</p>
            <h2 className="mt-2 text-5xl">BD Week on YouTube</h2>
          </div>
          <Button asChild>
            <a href="https://www.youtube.com/@bangladeshweekapu" target="_blank" rel="noreferrer">
              Official channel <ArrowUpRight className="h-4 w-4" />
            </a>
          </Button>
        </div>
        <div className="mt-10 aspect-video overflow-hidden bg-ink">
          <div className="flex h-full flex-col items-center justify-center gap-3 text-ink-foreground/60">
            <Play className="h-12 w-12" />
            <p>Specific video embed placeholder</p>
          </div>
        </div>
      </section>
      <section className="bg-muted">
        <div className="mx-auto max-w-6xl px-5 py-20">
          <h2 className="text-5xl">Previous years / Gallery</h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 8 }, (_, i) => (
              <Skeleton key={i} className="aspect-square" />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function PressCard({ source, title, href }: { source: string; title: string; href: string }) {
  return (
    <Card>
      <CardHeader>
        <CardDescription>{source}</CardDescription>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Button asChild variant="link" className="px-0">
          <a href={href} target="_blank" rel="noreferrer">
            Read article <ArrowUpRight className="h-4 w-4" />
          </a>
        </Button>
      </CardContent>
    </Card>
  );
}

import * as React from "react";
import { CalendarDays, MapPin } from "lucide-react";
import { createFileRoute } from "@tanstack/react-router";

import { PageHeader } from "@/components/public/SiteChrome";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/lib/supabase";

import bflPoster from "@/assets/bfl/bfl-season6-cover.jpg";
import bbqPoster from "@/assets/poster/bsa-bbq-party-cover.jpg";
import newYearPoster from "@/assets/poster/bangla-new-year-poster.jpg";
import pithaPoster from "@/assets/poster/pitha-festival-25.jpg";
import nobinboronPoster from "@/assets/nobinboron/images/nobinboron-26-spring.jpg";
import communityPoster from "@/assets/community.jpg";

const fallbackImages: Record<string, string> = {
  "Nobinboron Fall 2026": nobinboronPoster,
  "Nobinboron Spring 2026": nobinboronPoster,
  "BFL Season IX": bflPoster,
  "Happy Pohela Boishakh (শুভ নববর্ষ)": newYearPoster,
  "21st February - Mother Language Day": newYearPoster,
  "BSA BBQ Party & Winter Gathering": bbqPoster,
  "Winter Pitha Festival": pithaPoster,
};

export const Route = createFileRoute("/_public/events")({
  loader: async () => {
    if (!supabase) {
      throw new Error("Supabase is not configured. Events cannot be loaded.");
    }

    const { data, error } = await supabase
      .from("events")
      .select("id, title, event_date, location, tag, description, image_url")
      .eq("published", true)
      .order("event_date", { ascending: true });

    if (error) throw error;

    return data;
  },
  pendingComponent: EventsLoading,
  head: () => ({
    meta: [
      { title: "Events — BSA APU" },
      {
        name: "description",
        content:
          "Pohela Boishakh, Victory Day, Bangladesh Night and more events by BSA at Ritsumeikan APU.",
      },
      { property: "og:title", content: "Events — Bangladeshi Students Association APU" },
      {
        property: "og:description",
        content: "Upcoming cultural and community events by BSA in Beppu.",
      },
    ],
  }),
  component: Events,
});

function Events() {
  const list = Route.useLoaderData();
  const [selectedEventId, setSelectedEventId] = React.useState<string | null>(null);
  const selectedEvent = list.find((event) => event.id === selectedEventId);

  return (
    <>
      <PageHeader
        kicker="Calendar"
        title="Events"
        intro="Festivals, dinners, stage shows and welcome nights. Everyone at APU is welcome."
      />
      <section className="mx-auto grid max-w-6xl gap-6 px-5 py-20 md:grid-cols-2 lg:grid-cols-3">
        {list.length === 0 ? (
          <Card className="md:col-span-2 lg:col-span-3">
            <CardContent className="py-12 text-center">
              <p className="text-lg font-medium">No upcoming events announced yet.</p>
              <p className="mt-2 text-muted-foreground">Check back soon!</p>
            </CardContent>
          </Card>
        ) : null}
        {list.map((event) => {
          const date = new Date(`${event.event_date}T00:00:00`);
          const image = event.image_url ?? fallbackImages[event.title] ?? communityPoster;
          return (
            <Card key={event.id} className="group flex h-full flex-col overflow-hidden">
              <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                <img
                  src={image}
                  alt={event.title}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <Badge className="absolute left-4 top-4">{event.tag}</Badge>
              </div>
              <CardHeader className="flex-1">
                <div className="flex items-center gap-2 text-sm font-medium text-primary">
                  <CalendarDays className="h-4 w-4" />
                  {date.toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </div>
                <CardTitle className="text-2xl">{event.title}</CardTitle>
                <p className="line-clamp-3 text-sm text-muted-foreground">{event.description}</p>
                <p className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 shrink-0 text-primary" />
                  {event.location}
                </p>
              </CardHeader>
              <div className="p-6 pt-0">
                <Button
                  type="button"
                  className="w-full"
                  onClick={() => setSelectedEventId(event.id)}
                >
                  Details
                </Button>
              </div>
            </Card>
          );
        })}
      </section>

      <Dialog
        open={selectedEventId !== null}
        onOpenChange={(open) => !open && setSelectedEventId(null)}
      >
        <DialogContent className="max-w-lg">
          {selectedEvent ? (
            <>
              <DialogHeader>
                <Badge className="w-fit">{selectedEvent.tag}</Badge>
                <DialogTitle className="pr-6 text-3xl">{selectedEvent.title}</DialogTitle>
                <DialogDescription className="flex items-center gap-2 pt-2">
                  <CalendarDays className="h-4 w-4 shrink-0 text-primary" />
                  {new Date(`${selectedEvent.event_date}T00:00:00`).toLocaleDateString("en-GB", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <p className="flex items-center gap-2 text-sm font-medium">
                  <MapPin className="h-4 w-4 text-primary" />
                  {selectedEvent.location}
                </p>
                <p className="whitespace-pre-line leading-7 text-muted-foreground">
                  {selectedEvent.description}
                </p>
              </div>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
}

function EventsLoading() {
  return (
    <>
      <PageHeader
        kicker="Calendar"
        title="Events"
        intro="Festivals, dinners, stage shows and welcome nights. Everyone at APU is welcome."
      />
      <section
        aria-label="Loading events"
        className="mx-auto grid max-w-6xl gap-6 px-5 py-20 md:grid-cols-2 lg:grid-cols-3"
      >
        {Array.from({ length: 6 }, (_, index) => (
          <div key={index} className="overflow-hidden rounded-xl border bg-card">
            <Skeleton className="aspect-[16/10] rounded-none" />
            <div className="space-y-4 p-6">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        ))}
      </section>
    </>
  );
}

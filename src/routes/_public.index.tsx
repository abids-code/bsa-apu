import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, CalendarDays, Facebook, Instagram, MapPin, Trophy, Users } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

import bdWeekCover from "@/assets/bdweek/images/bdweek2025-cover.jpg";
import bflCover from "@/assets/bfl/bfl-season6-cover.jpg";
import bbqCover from "@/assets/poster/bsa-bbq-party-cover.jpg";
import community from "@/assets/community.jpg";
import hero from "@/assets/hero.jpg";
import nobinboronCover from "@/assets/nobinboron/images/nobinboron-26-spring.jpg";
import { ComponentShowcase } from "@/components/public/ComponentShowcase";
import { CoreMembers } from "@/components/public/CoreMembers";
import { MembersGrid } from "@/components/public/MembersGrid";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/lib/supabase";

const reveal = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export const Route = createFileRoute("/_public/")({
  loader: async () => {
    if (!supabase) {
      throw new Error("Supabase is not configured. Homepage previews cannot be loaded.");
    }

    const today = new Date().toISOString().slice(0, 10);
    const [
      { data: events, error: eventsError },
      { data: news, error: newsError },
      { data: albums, error: albumsError },
      { data: photos, error: photosError },
      { data: committee, error: committeeError },
    ] = await Promise.all([
      supabase
        .from("events")
        .select("id, title, event_date, location, tag, description")
        .eq("published", true)
        .gte("event_date", today)
        .order("event_date", { ascending: true })
        .limit(2),
      supabase
        .from("news")
        .select("id, title, published_at, excerpt")
        .eq("published", true)
        .order("published_at", { ascending: false })
        .limit(3),
      supabase
        .from("gallery_albums")
        .select("id, title, description")
        .eq("published", true)
        .order("created_at", { ascending: false })
        .limit(3),
      supabase
        .from("gallery_items")
        .select("id, image_url, caption, alt_text, album_id")
        .eq("published", true)
        .order("created_at", { ascending: false })
        .limit(6),
      supabase
        .from("committee_members")
        .select("id, name, role, instagram_handle, image_url")
        .order("created_at", { ascending: true }),
    ]);

    if (eventsError) throw eventsError;
    if (newsError) throw newsError;
    if (albumsError) throw albumsError;
    if (photosError) throw photosError;
    if (committeeError) throw committeeError;

    return { events, news, albums, photos, committee };
  },
  head: () => ({
    meta: [
      { title: "BSA APU — Bangladeshi Students Association at Ritsumeikan APU" },
      {
        name: "description",
        content:
          "A home away from home for Bangladeshi students in Beppu. Culture, community and support at Ritsumeikan APU.",
      },
      { property: "og:title", content: "BSA APU — Bangladeshi Students Association" },
      {
        property: "og:description",
        content:
          "Culture, community and support for Bangladeshi students at Ritsumeikan APU, Beppu.",
      },
    ],
  }),
  component: Index,
});

const stats = [
  { value: "300+", label: "Members" },
  { value: "3rd", label: "Largest community in APU", highlight: true },
  { value: "10", label: "Years at APU" },
  { value: "100+", label: "Events hosted" },
];

const socialImages = [
  { src: community, alt: "BSA students sharing a community meal" },
  { src: hero, alt: "BSA students celebrating together" },
] as const;

const localLatestMoments = [
  {
    id: "local-nobinboron",
    title: "Nobinboron Fall 2026",
    description: "Welcoming new students into the BSA family.",
    image: nobinboronCover,
    alt: "Nobinboron community gathering",
  },
  {
    id: "local-bd-week",
    title: "BD Week",
    description: "Celebrating Bangladesh through culture and creativity.",
    image: bdWeekCover,
    alt: "BD Week at APU",
  },
  {
    id: "local-bfl",
    title: "BFL",
    description: "Football, friendship, and community spirit.",
    image: bflCover,
    alt: "BFL football event",
  },
  {
    id: "local-bbq",
    title: "BBQ Party",
    description: "Good food and golden sunsets by the sea.",
    image: bbqCover,
    alt: "BSA BBQ Party",
  },
] as const;

function Index() {
  const { events, news, albums, photos, committee } = Route.useLoaderData();
  const [socialImageIndex, setSocialImageIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setSocialImageIndex((current) => (current + 1) % socialImages.length);
    }, 4200);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <>
      <motion.section
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.14 } } }}
        className="relative overflow-hidden bg-ink text-ink-foreground"
      >
        <img
          src={hero}
          alt="BSA students celebrating in Beppu"
          width={1600}
          height={1008}
          className="absolute inset-0 h-full w-full object-cover opacity-45"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/80 to-ink/20" />
        <div className="relative mx-auto flex min-h-[30rem] max-w-6xl items-center px-5 py-16 md:min-h-[38rem] md:py-24">
          <div className="max-w-3xl">
            <motion.p
              variants={reveal}
              className="text-sm font-semibold uppercase tracking-[0.3em] text-primary-foreground/80"
            >
              Ritsumeikan APU · Beppu, Japan
            </motion.p>
            <motion.h1 variants={reveal} className="mt-4 max-w-3xl text-5xl md:text-8xl">
              Bangladesh, <span className="text-primary">far from</span> home.
            </motion.h1>
            <motion.p variants={reveal} className="mt-6 max-w-xl text-lg opacity-85">
              A home for Bangladeshi culture and everyone curious about it — connecting students
              through food, music, celebration, and shared experience.
            </motion.p>
            <motion.div variants={reveal} className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link to="/join">
                  Become a member <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-ink-foreground/40 bg-transparent text-ink-foreground hover:bg-ink-foreground/10"
              >
                <Link to="/events">Explore events</Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.section>

      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={reveal}
        className="border-b bg-card"
      >
        <div className="overflow-hidden">
          <motion.div
            className="flex w-max"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 24, ease: "linear", repeat: Infinity }}
            whileHover={{ animationPlayState: "paused" }}
            aria-label="BSA community statistics"
          >
            {[...stats, ...stats].map((stat, index) => (
              <Stat key={`${stat.label}-${index}`} {...stat} />
            ))}
          </motion.div>
        </div>
      </motion.section>

      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={reveal}
        className="bg-muted"
      >
        <div className="mx-auto grid max-w-6xl items-center gap-8 px-5 py-16 md:gap-12 md:py-24 lg:grid-cols-[1fr_0.8fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-primary">
              Our story
            </p>
            <h2 className="mt-3 text-4xl md:text-6xl">Who we are</h2>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
              A home for Bangladeshi culture & everyone curious about it. From Pohela Boishakh and
              BD Week performances to late-night hangs and BSA Families, we connect students through
              culture, food, music, and shared experience.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild>
                <Link to="/about">
                  More about BSA <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/events">Browse past events</Link>
              </Button>
            </div>
          </div>
          <SocialImageCarousel imageIndex={socialImageIndex} />
        </div>
      </motion.section>

      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        variants={reveal}
        className="mx-auto max-w-6xl px-5 py-16 md:py-24"
      >
        <SectionHeading title="Upcoming events" link="/events" linkLabel="All events" />
        {events.length ? (
          <div className="mt-8 grid gap-5 md:mt-10 md:gap-6 md:grid-cols-2">
            {events.map((event) => (
              <Card
                key={event.id}
                id={`event-${event.id}`}
                className="group transition-all duration-300 hover:-translate-y-1 hover:border-primary hover:shadow-lg"
              >
                <CardHeader>
                  <Badge variant="secondary" className="w-fit">
                    {event.tag}
                  </Badge>
                  <CardTitle className="text-3xl group-hover:text-primary">{event.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{event.description}</p>
                  <div className="mt-5 space-y-2 text-sm">
                    <p className="flex items-center gap-2">
                      <CalendarDays className="h-4 w-4 text-primary" />
                      {formatDate(event.event_date)}
                    </p>
                    <p className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-primary" />
                      {event.location}
                    </p>
                  </div>
                  <Button asChild variant="link" className="mt-4 px-0">
                    <Link to="/events" hash={`event-${event.id}`}>
                      Details <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <EmptyPreview message="New events are on the way. Check back soon." />
        )}
      </motion.section>

      <section className="bg-muted">
        <div className="mx-auto max-w-6xl px-5 py-16 md:py-24">
          <SectionHeading title="Latest news" link="/news" linkLabel="All news" />
          {news.length ? (
            <div className="mt-8 grid gap-5 md:mt-10 md:gap-6 md:grid-cols-3">
              {news.map((item) => (
                <Card
                  key={item.id}
                  id={`news-${item.id}`}
                  className="flex h-full flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  <CardHeader>
                    <p className="text-sm text-muted-foreground">{formatDate(item.published_at)}</p>
                    <CardTitle className="text-2xl">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-1 flex-col">
                    <p className="text-muted-foreground">{item.excerpt}</p>
                    <Button asChild variant="link" className="mt-auto justify-start px-0 pt-6">
                      <Link to="/news" hash={`news-${item.id}`}>
                        Learn more <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <EmptyPreview message="No news announcements yet. Check back soon." />
          )}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16 md:py-24">
        <SectionHeading title="Latest moments" link="/gallery" linkLabel="Explore gallery" />
        <motion.div
          className="mt-8 grid gap-5 md:mt-10 md:grid-cols-2 lg:grid-cols-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
        >
          {(albums.length
            ? [
                ...albums.map((album) => {
                  const photo = photos.find((item) => item.album_id === album.id);
                  return {
                    id: album.id,
                    title: album.title,
                    description: album.description || "Community moments coming soon.",
                    image: photo?.image_url,
                    alt: photo?.alt_text ?? album.title,
                  };
                }),
                ...localLatestMoments,
              ]
            : localLatestMoments
          ).map((moment) => (
            <motion.div
              key={moment.id}
              variants={reveal}
              whileHover={{ y: -8 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <Link to="/gallery" className="group block h-full">
                <Card className="h-full overflow-hidden transition-shadow duration-300 group-hover:shadow-xl">
                  {moment.image ? (
                    <motion.img
                      src={moment.image}
                      alt={moment.alt}
                      loading="lazy"
                      whileHover={{ scale: 1.06 }}
                      transition={{ duration: 0.5 }}
                      className="aspect-[4/3] w-full object-cover"
                    />
                  ) : (
                    <Skeleton className="aspect-[4/3] rounded-none" />
                  )}
                  <CardContent className="p-5">
                    <h3 className="text-2xl transition-colors group-hover:text-primary">
                      {moment.title}
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground">{moment.description}</p>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <section className="bg-ink text-ink-foreground">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-8 px-5 py-24 md:flex-row md:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-primary-foreground/70">
              Flagship cultural program
            </p>
            <h2 className="mt-3 text-5xl md:text-8xl">BD Week</h2>
            <p className="mt-4 max-w-xl text-lg text-ink-foreground/70">
              A vivid celebration of Bangladesh through performances, food, stories, and student
              creativity.
            </p>
          </div>
          <Button asChild size="lg" variant="secondary">
            <Link to="/bdweek">
              Discover BD Week <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      <section className="bg-primary text-primary-foreground">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-8 px-5 py-20 md:flex-row md:items-center">
          <div>
            <div className="flex items-center gap-3">
              <Trophy className="h-8 w-8" />
              <p className="text-sm font-semibold uppercase tracking-[0.25em]">On the pitch</p>
            </div>
            <h2 className="mt-3 text-4xl md:text-7xl">APU Bangladesh Football League</h2>
            <p className="mt-4 max-w-xl text-primary-foreground/80">
              Competitive football, community spirit, and Bangladeshi pride on the pitch.
            </p>
          </div>
          <Button asChild size="lg" variant="secondary">
            <Link to="/bfl">
              Explore BFL <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16 md:py-24">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-primary">
              People behind BSA
            </p>
            <h2 className="mt-3 text-4xl md:text-6xl">Core committee</h2>
          </div>
          <Users className="hidden h-12 w-12 text-primary/30 md:block" />
        </div>
        <div className="mt-10">
          <CoreMembers members={committee} />
        </div>
      </section>

      <section className="bg-muted">
        <div className="mx-auto max-w-6xl px-5 py-16 md:py-24">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-primary">
                Our community
              </p>
              <h2 className="mt-3 text-4xl md:text-6xl">BSA members</h2>
            </div>
            <Users className="hidden h-12 w-12 text-primary/30 md:block" />
          </div>
          <div className="mt-10">
            <MembersGrid limit={24} marquee />
            <div className="mt-8 flex justify-center">
              <Button asChild size="lg" variant="outline">
                <Link to="/about/members">
                  View all members <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <ComponentShowcase />
    </>
  );
}

function Stat({
  value,
  label,
  highlight = false,
}: {
  value: string;
  label: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`min-w-[11rem] border-r p-6 first:border-l last:border-r-0 md:min-w-[15rem] md:p-8 ${
        highlight ? "bg-primary/10" : ""
      }`}
    >
      <p className={`font-display text-4xl md:text-5xl ${highlight ? "text-primary" : ""}`}>
        {value}
      </p>
      <p className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
    </div>
  );
}

function SocialImageCarousel({ imageIndex }: { imageIndex: number }) {
  const image = socialImages[imageIndex];
  if (!image) return null;

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="overflow-hidden rounded-xl bg-muted shadow-lg">
        <AnimatePresence mode="wait">
          <motion.img
            key={image.src}
            src={image.src}
            alt={image.alt}
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="aspect-[16/10] h-auto w-full object-cover"
          />
        </AnimatePresence>
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-semibold">Follow us on</p>
        <div className="flex gap-2">
          <a
            href="https://www.instagram.com/apu.bsa/"
            target="_blank"
            rel="noreferrer"
            aria-label="Follow BSA on Instagram"
            className="inline-flex items-center gap-1.5 rounded-md border px-3 py-2 text-xs font-semibold transition-colors hover:border-primary hover:text-primary"
          >
            <Instagram className="h-3.5 w-3.5" aria-hidden="true" />
            Instagram
          </a>
          <a
            href="https://www.facebook.com/profile.php?id=61576153811604"
            target="_blank"
            rel="noreferrer"
            aria-label="Follow BSA on Facebook"
            className="inline-flex items-center gap-1.5 rounded-md border px-3 py-2 text-xs font-semibold transition-colors hover:border-primary hover:text-primary"
          >
            <Facebook className="h-3.5 w-3.5" aria-hidden="true" />
            Facebook
          </a>
        </div>
      </div>
      <div className="mt-3 flex justify-center gap-2" aria-label="Social image slides">
        {socialImages.map((item, index) => (
          <span
            key={item.src}
            className={`h-1.5 rounded-full transition-all duration-500 ${
              index === imageIndex ? "w-8 bg-primary" : "w-2 bg-muted-foreground/30"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

function SectionHeading({
  title,
  link,
  linkLabel,
}: {
  title: string;
  link: "/events" | "/news" | "/gallery";
  linkLabel: string;
}) {
  return (
    <div className="flex items-end justify-between gap-4">
      <h2 className="slash text-4xl md:text-6xl">{title}</h2>
      <Link
        to={link}
        className="hidden text-sm font-semibold uppercase tracking-wider text-primary md:block"
      >
        {linkLabel} →
      </Link>
    </div>
  );
}

function EmptyPreview({ message }: { message: string }) {
  return (
    <div className="mt-10 rounded-lg border border-dashed p-12 text-center text-muted-foreground">
      {message}
    </div>
  );
}

function formatDate(value: string) {
  return new Date(`${value}T00:00:00`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

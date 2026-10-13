import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, ChevronLeft, ChevronRight, Instagram, X } from "lucide-react";
import { useEffect, useState } from "react";

import {
  bdWeekBackgroundImages,
  bdWeekHeroImages,
  bdWeekImages,
  bdWeekVideo,
  cloudinaryImageUrl,
  type BDWeekImage,
} from "@/data/bdweek";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";

export const Route = createFileRoute("/_public/bdweek")({
  head: () => ({
    meta: [
      { title: "BD Week 2026 — BSA APU" },
      {
        name: "description",
        content: "Relive BD Week 2026 through highlights, stories, and moments from BSA APU.",
      },
    ],
  }),
  component: BDWeek,
});

function BDWeek() {
  const [heroIndex, setHeroIndex] = useState(0);
  const [heroPaused, setHeroPaused] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const selectedImage = selectedIndex === null ? null : bdWeekImages[selectedIndex];

  function closeLightbox() {
    setSelectedIndex(null);
  }

  function showPrevious() {
    setSelectedIndex((current) =>
      current === null ? null : (current - 1 + bdWeekImages.length) % bdWeekImages.length,
    );
  }

  function showNext() {
    setSelectedIndex((current) => (current === null ? null : (current + 1) % bdWeekImages.length));
  }

  useEffect(() => {
    if (selectedIndex === null) return;
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "ArrowLeft") showPrevious();
      if (event.key === "ArrowRight") showNext();
      if (event.key === "Escape") closeLightbox();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedIndex]);

  useEffect(() => {
    if (heroPaused) return;
    const timer = window.setInterval(() => {
      setHeroIndex((current) => (current + 1) % bdWeekHeroImages.length);
    }, 5000);
    return () => window.clearInterval(timer);
  }, [heroPaused]);

  return (
    <>
      <section className="relative isolate overflow-hidden bg-ink text-ink-foreground">
        <div className="pointer-events-none absolute inset-0 flex flex-col justify-center gap-3 opacity-45">
          {[0, 1, 2].map((row) => (
            <motion.div
              key={row}
              className="flex w-max gap-3"
              animate={{ x: row % 2 === 0 ? ["0%", "-50%"] : ["-50%", "0%"] }}
              transition={{ duration: 75 + row * 12, repeat: Infinity, ease: "linear" }}
            >
              {[...bdWeekBackgroundImages, ...bdWeekBackgroundImages].map((publicId, index) => (
                <img
                  key={`${row}-${publicId}-${index}`}
                  src={cloudinaryImageUrl(publicId, 700)}
                  alt=""
                  className="h-36 w-56 shrink-0 object-cover sm:h-44 sm:w-72 md:h-52 md:w-80"
                />
              ))}
            </motion.div>
          ))}
        </div>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-ink via-ink/75 to-ink/90" />
        <div className="relative mx-auto max-w-6xl px-5 py-10 md:py-12">
          <div
            className="relative aspect-[21/8] w-full overflow-hidden rounded-3xl bg-ink-foreground/10 shadow-2xl"
            onMouseEnter={() => setHeroPaused(true)}
            onMouseLeave={() => setHeroPaused(false)}
          >
            <AnimatePresence mode="wait">
              <motion.img
                key={bdWeekHeroImages[heroIndex]}
                src={cloudinaryImageUrl(bdWeekHeroImages[heroIndex], 1800)}
                alt={`BD Week 2026 highlight ${heroIndex + 1}`}
                initial={{ opacity: 0, scale: 1.08, x: 24 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 1.03, x: -24 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="absolute inset-0 h-full w-full object-cover"
              />
            </AnimatePresence>
            <div className="absolute bottom-5 right-5 flex items-center gap-2">
              {bdWeekHeroImages.map((publicId, index) => (
                <button
                  key={publicId}
                  type="button"
                  onClick={() => setHeroIndex(index)}
                  aria-label={`Show hero image ${index + 1}`}
                  className={`h-2 rounded-full transition-all ${
                    heroIndex === index ? "w-8 bg-primary" : "w-2 bg-white/60"
                  }`}
                />
              ))}
            </div>
          </div>
          <div className="relative mt-6 overflow-hidden rounded-2xl">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
              className="relative max-w-3xl py-8 md:py-10"
            >
              <motion.p
                variants={heroReveal}
                className="text-xs font-semibold uppercase tracking-[0.25em] text-primary"
              >
                BSA APU presents
              </motion.p>
              <motion.h1 variants={heroReveal} className="mt-2 text-5xl md:text-7xl">
                BD Week
              </motion.h1>
              <motion.p
                variants={heroReveal}
                className="mt-3 max-w-xl text-base leading-7 text-ink-foreground/75 md:text-lg"
              >
                A vivid celebration of Bangladeshi culture, creativity, food, music, and community
                at APU.
              </motion.p>
            </motion.div>
          </div>
        </div>
      </section>

      <section id="about" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-20">
        <SectionIntro kicker="About BD Week" title="One week. One community." />
        <p className="mt-6 max-w-3xl text-lg leading-8 text-muted-foreground">
          BD Week brings the colors, stories, flavors, and energy of Bangladesh to the APU community
          through performances, food, creativity, and student-led celebration.
        </p>
      </section>

      <section id="highlight" className="bg-muted scroll-mt-20">
        <div className="mx-auto max-w-6xl px-5 py-20">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionIntro kicker="Media & press" title="BD Week in the news" />
            <Button asChild>
              <a href="https://www.youtube.com/@bangladeshweekapu" target="_blank" rel="noreferrer">
                Official channel <ArrowUpRight className="h-4 w-4" />
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
          <h2 className="mt-16 text-5xl">BD Week on YouTube</h2>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            className="mt-10 overflow-hidden rounded-2xl border bg-ink shadow-2xl"
          >
            <div className="aspect-video w-full">
              <iframe
                className="h-full w-full"
                src={bdWeekVideo.embedUrl}
                title={bdWeekVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          </motion.div>
        </div>
      </section>

      <section id="gallery" className="bg-muted scroll-mt-20">
        <div className="mx-auto max-w-6xl px-5 py-20 md:py-28">
          <SectionIntro
            kicker="Captured moments"
            title="The color of BD Week"
            description="Browse the people, performances, food, and small moments that made 2026 special."
          />
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.08 }}
            variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
            className="mt-12 columns-1 gap-5 sm:columns-2 lg:columns-3"
          >
            {bdWeekImages.map((image, index) => (
              <GalleryTile
                key={image.publicId}
                image={image}
                index={index}
                onClick={() => setSelectedIndex(index)}
              />
            ))}
          </motion.div>
        </div>
      </section>

      <section className="bg-primary text-primary-foreground">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-8 px-5 py-16 md:flex-row md:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-primary-foreground/75">
              Stay connected
            </p>
            <h2 className="mt-3 text-5xl">More from BD Week</h2>
          </div>
          <Button asChild size="lg" variant="secondary">
            <a href="https://www.instagram.com/bdweek.apu/" target="_blank" rel="noreferrer">
              Follow BD Week <Instagram className="h-4 w-4" />
            </a>
          </Button>
        </div>
      </section>

      <Dialog open={selectedImage !== null} onOpenChange={(open) => !open && closeLightbox()}>
        <DialogContent className="max-w-6xl border-0 bg-black/95 p-0 text-white shadow-2xl">
          {selectedImage ? (
            <LightboxContent
              image={selectedImage}
              index={selectedIndex ?? 0}
              onPrevious={showPrevious}
              onNext={showNext}
              onClose={closeLightbox}
            />
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
}

const heroReveal = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
};

function SectionIntro({
  kicker,
  title,
  description,
}: {
  kicker: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="max-w-3xl">
      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">{kicker}</p>
      <h2 className="mt-3 text-5xl md:text-7xl">{title}</h2>
      {description ? (
        <p className="mt-5 text-lg leading-8 text-muted-foreground">{description}</p>
      ) : null}
    </div>
  );
}

function GalleryTile({
  image,
  index,
  onClick,
}: {
  image: BDWeekImage;
  index: number;
  onClick: () => void;
}) {
  return (
    <motion.button
      type="button"
      variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
      whileHover={{ y: -5 }}
      onClick={onClick}
      className="group relative mb-5 block w-full overflow-hidden rounded-2xl bg-ink text-left break-inside-avoid focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      aria-label={`Open ${image.title}`}
    >
      <img
        src={cloudinaryImageUrl(image.publicId)}
        alt={image.title}
        loading={index < 3 ? "eager" : "lazy"}
        className={`w-full object-cover transition duration-700 group-hover:scale-105 ${
          image.aspect === "portrait"
            ? "aspect-[3/4]"
            : image.aspect === "landscape"
              ? "aspect-[4/3]"
              : "aspect-square"
        }`}
      />
      <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/85 via-black/10 to-transparent p-5 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
        <p className="text-lg font-semibold text-white">{image.title}</p>
        <p className="mt-1 text-sm text-white/75">{image.caption}</p>
      </div>
    </motion.button>
  );
}

function LightboxContent({
  image,
  index,
  onPrevious,
  onNext,
  onClose,
}: {
  image: BDWeekImage;
  index: number;
  onPrevious: () => void;
  onNext: () => void;
  onClose: () => void;
}) {
  return (
    <div className="relative flex min-h-[70vh] flex-col items-center justify-center p-4 sm:p-8">
      <AnimatePresence mode="wait">
        <motion.figure
          key={image.publicId}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.2 }}
          className="flex max-h-[78vh] w-full flex-col items-center justify-center"
        >
          <img
            src={cloudinaryImageUrl(image.publicId, 2000)}
            alt={image.title}
            className="max-h-[68vh] w-auto max-w-full rounded-lg object-contain"
          />
          <figcaption className="mt-5 max-w-xl text-center">
            <p className="text-xl font-semibold">{image.title}</p>
            <p className="mt-1 text-sm text-white/70">{image.caption}</p>
            <p className="mt-2 text-xs text-white/50">
              {index + 1} / {bdWeekImages.length}
            </p>
          </figcaption>
        </motion.figure>
      </AnimatePresence>
      <button
        type="button"
        onClick={onClose}
        className="absolute right-4 top-4 rounded-full bg-white/10 p-2 hover:bg-white/20"
        aria-label="Close gallery"
      >
        <X className="h-5 w-5" />
      </button>
      <button
        type="button"
        onClick={onPrevious}
        className="absolute left-2 top-1/2 rounded-full bg-white/10 p-3 hover:bg-white/20 sm:left-5"
        aria-label="Previous image"
      >
        <ChevronLeft />
      </button>
      <button
        type="button"
        onClick={onNext}
        className="absolute right-2 top-1/2 rounded-full bg-white/10 p-3 hover:bg-white/20 sm:right-5"
        aria-label="Next image"
      >
        <ChevronRight />
      </button>
    </div>
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

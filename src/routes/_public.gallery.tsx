import * as React from "react";
import { motion } from "framer-motion";
import { Image } from "lucide-react";
import { createFileRoute } from "@tanstack/react-router";

import { PageHeader } from "@/components/public/SiteChrome";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/lib/supabase";

import bflCover from "@/assets/bfl/bfl-season6-cover.jpg";
import bflPhoto from "@/assets/bfl/bfl-season6.jpg";
import bflPhotoTwo from "@/assets/bfl/bfl-season7.jpg";
import bbqCover from "@/assets/poster/bsa-bbq-party-cover.jpg";
import bbqPhoto from "@/assets/poster/bsa-bbq-party25.jpg";
import pithaPhoto from "@/assets/poster/pitha-festival-25.jpg";
import bdWeekCover from "@/assets/bdweek/images/bdweek2025-cover.jpg";
import bdWeekPhoto from "@/assets/bdweek/images/bdweek-25.jpg";
import bdWeekPhotoTwo from "@/assets/bdweek/images/bdweek26-election.jpg";
import nobinboronCover from "@/assets/nobinboron/images/nobinboron-26-spring.jpg";
import nobinboronPhoto from "@/assets/nobinboron/images/nobinboron-25-spring25.jpg";
import nobinboronPhotoTwo from "@/assets/nobinboron/images/nobinboron-25-spring25-1.jpg";
import nobinboronPhotoThree from "@/assets/nobinboron/images/nobinboron-25-spring25-2.jpg";
import nobinboronPhotoFour from "@/assets/nobinboron/images/nobinboron-26-spring-jp.jpg";
import communityPhoto from "@/assets/community.jpg";
import heroPhoto from "@/assets/hero.jpg";
import shoppingPhoto from "@/assets/shopping-guidance-fall25.jpg";

const localAlbums = [
  {
    id: "local-nobinboron",
    title: "Nobinboron Fall 2026",
    description: "Welcoming the newest members of our APU community.",
    cover: nobinboronCover,
    photos: [
      { src: nobinboronPhoto, alt: "Nobinboron community gathering" },
      { src: nobinboronPhotoTwo, alt: "Students at Nobinboron" },
      { src: nobinboronPhotoThree, alt: "Nobinboron celebration" },
      { src: nobinboronPhotoFour, alt: "Nobinboron invitation" },
    ],
  },
  {
    id: "local-bd-week",
    title: "BD Week",
    description: "A week of Bangladeshi culture, food, and friendship.",
    cover: bdWeekCover,
    photos: [
      { src: bdWeekPhoto, alt: "BD Week at APU" },
      { src: bdWeekPhotoTwo, alt: "BD Week campus event" },
    ],
  },
  {
    id: "local-bfl",
    title: "BFL",
    description: "Football, friendship, and unforgettable moments.",
    cover: bflCover,
    photos: [
      { src: bflPhoto, alt: "BFL football match" },
      { src: bflPhotoTwo, alt: "BFL season celebration" },
    ],
  },
  {
    id: "local-bbq",
    title: "BBQ Party",
    description: "Good food and golden sunsets by the sea.",
    cover: bbqCover,
    photos: [
      { src: bbqPhoto, alt: "BSA BBQ Party" },
      { src: pithaPhoto, alt: "BSA community food gathering" },
    ],
  },
] as const;

const localPhotos = [
  { src: communityPhoto, alt: "BSA community members together", caption: "Our community" },
  { src: heroPhoto, alt: "APU campus view", caption: "Life at APU" },
  { src: shoppingPhoto, alt: "BSA shopping guidance event", caption: "BSA together" },
];

const galleryReveal = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export const Route = createFileRoute("/_public/gallery")({
  loader: async () => {
    if (!supabase) return { albums: [], photos: [] };

    const [{ data: albums, error: albumsError }, { data: photos, error: photosError }] =
      await Promise.all([
        supabase
          .from("gallery_albums")
          .select("id, title, description")
          .eq("published", true)
          .order("created_at", { ascending: false }),
        supabase
          .from("gallery_items")
          .select("id, image_url, caption, alt_text, album_id")
          .eq("published", true)
          .order("created_at", { ascending: false }),
      ]);

    if (albumsError) throw albumsError;
    if (photosError) throw photosError;

    return { albums, photos };
  },
  pendingComponent: GalleryLoading,
  head: () => ({
    meta: [
      { title: "Gallery — BSA APU" },
      {
        name: "description",
        content: "Photos from BSA festivals, dinners and gatherings at Ritsumeikan APU.",
      },
      { property: "og:title", content: "Gallery — BSA APU" },
      { property: "og:description", content: "Moments from our community in Beppu." },
    ],
  }),
  component: Gallery,
});

function Gallery() {
  const { albums, photos } = Route.useLoaderData();
  const [selectedAlbumId, setSelectedAlbumId] = React.useState<string | null>(null);
  const databaseAlbums = albums.filter(
    (album) => !localAlbums.some((localAlbum) => localAlbum.title === album.title),
  );
  const allAlbums = [...localAlbums, ...databaseAlbums];
  const selectedAlbum = allAlbums.find((album) => album.id === selectedAlbumId);

  return (
    <>
      <PageHeader
        kicker="Moments"
        title="Gallery"
        intro="A look at life in our community. Browse memories by album."
      />
      <section className="mx-auto max-w-6xl px-5 py-20">
        <Tabs defaultValue="albums">
          <TabsList className="mb-8 h-auto w-full justify-start gap-1 overflow-x-auto p-1 sm:w-auto">
            <TabsTrigger value="albums">Events (Albums)</TabsTrigger>
            <TabsTrigger value="photos">Photos</TabsTrigger>
          </TabsList>

          <TabsContent value="albums">
            <motion.div
              className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
              initial="hidden"
              animate="visible"
              variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
            >
              {allAlbums.map((album) => {
                const localAlbum = localAlbums.find((item) => item.id === album.id);
                const cover = localAlbum?.cover;
                const albumPhotos = localAlbum
                  ? localAlbum.photos
                  : photos
                      .filter((photo) => photo.album_id === album.id)
                      .map((photo) => ({ src: photo.image_url, alt: photo.alt_text }));
                return (
                  <motion.div key={album.id} variants={galleryReveal} whileHover={{ y: -8 }}>
                    <button
                      type="button"
                      className="group w-full text-left"
                      onClick={() => setSelectedAlbumId(album.id)}
                    >
                      <Card className="h-full overflow-hidden transition-shadow group-hover:shadow-lg">
                        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                          {cover || albumPhotos[0] ? (
                            <img
                              src={cover ?? albumPhotos[0].src}
                              alt={album.title}
                              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center">
                              <Image className="h-10 w-10 text-muted-foreground" />
                            </div>
                          )}
                          <span className="absolute bottom-3 right-3 rounded-full bg-black/70 px-3 py-1 text-xs font-medium text-white">
                            {albumPhotos.length} photos
                          </span>
                        </div>
                        <CardHeader>
                          <CardTitle>{album.title}</CardTitle>
                          <CardDescription>{album.description}</CardDescription>
                        </CardHeader>
                      </Card>
                    </button>
                  </motion.div>
                );
              })}
            </motion.div>
          </TabsContent>

          <TabsContent value="photos">
            <motion.div
              className="columns-1 gap-6 sm:columns-2 lg:columns-3"
              initial="hidden"
              animate="visible"
              variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
            >
              {[
                ...photos
                  .filter((photo) => photo.album_id === null)
                  .map((photo) => ({
                    src: photo.image_url,
                    alt: photo.alt_text,
                    caption: photo.caption,
                  })),
                ...localPhotos,
              ].map((photo, index) => (
                <motion.figure
                  key={`${photo.src}-${index}`}
                  className="mb-6 break-inside-avoid"
                  variants={galleryReveal}
                >
                  <img
                    src={photo.src}
                    alt={photo.alt}
                    loading="lazy"
                    className="w-full rounded-xl object-cover shadow-sm"
                  />
                  <figcaption className="mt-2 text-sm text-muted-foreground">
                    {photo.caption}
                  </figcaption>
                </motion.figure>
              ))}
            </motion.div>
          </TabsContent>
        </Tabs>
      </section>

      <Dialog
        open={selectedAlbumId !== null}
        onOpenChange={(open) => !open && setSelectedAlbumId(null)}
      >
        <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
          {selectedAlbum ? (
            <>
              <DialogHeader>
                <DialogTitle>{selectedAlbum.title}</DialogTitle>
                <DialogDescription>{selectedAlbum.description}</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 sm:grid-cols-2">
                {(
                  localAlbums.find((album) => album.id === selectedAlbum.id)?.photos ??
                  photos
                    .filter((photo) => photo.album_id === selectedAlbum.id)
                    .map((photo) => ({ src: photo.image_url, alt: photo.alt_text }))
                ).map((photo) => (
                  <img
                    key={photo.src}
                    src={photo.src}
                    alt={photo.alt}
                    className="aspect-[4/3] w-full rounded-lg object-cover"
                  />
                ))}
              </div>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
}

function GalleryLoading() {
  return (
    <>
      <PageHeader
        kicker="Moments"
        title="Gallery"
        intro="A look at life in our community. Browse memories by album."
      />
      <section aria-label="Loading gallery" className="mx-auto max-w-6xl px-5 py-20">
        <div className="mb-8 flex gap-2">
          <Skeleton className="h-9 w-36" />
          <Skeleton className="h-9 w-24" />
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }, (_, index) => (
            <div key={index} className="overflow-hidden rounded-xl border">
              <Skeleton className="aspect-[4/3] rounded-none" />
              <div className="space-y-3 p-6">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

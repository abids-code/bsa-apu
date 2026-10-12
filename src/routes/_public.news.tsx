import { createFileRoute } from "@tanstack/react-router";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/public/SiteChrome";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/_public/news")({
  loader: async () => {
    if (!supabase) {
      throw new Error("Supabase is not configured. News cannot be loaded.");
    }

    const { data, error } = await supabase
      .from("news")
      .select("id, title, published_at, excerpt, body")
      .eq("published", true)
      .order("published_at", { ascending: false });

    if (error) throw error;

    return data;
  },
  pendingComponent: NewsLoading,
  head: () => ({
    meta: [
      { title: "News — BSA APU" },
      {
        name: "description",
        content:
          "Announcements and stories from the Bangladeshi Students Association at Ritsumeikan APU.",
      },
      { property: "og:title", content: "News — BSA APU" },
      { property: "og:description", content: "Latest announcements from BSA in Beppu." },
    ],
  }),
  component: News,
});

function News() {
  const news = Route.useLoaderData();

  return (
    <>
      <PageHeader
        kicker="Updates"
        title="News"
        intro="Announcements, guides and stories from our community."
      />
      <section className="mx-auto max-w-6xl px-5 py-20">
        {news.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-lg font-medium">No news announcements yet.</p>
              <p className="mt-2 text-muted-foreground">Check back soon for the latest updates.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {news.map((n) => (
              <Card
                id={`news-${n.id}`}
                key={n.id}
                className="flex h-full flex-col border-t-4 border-t-primary"
              >
                <CardHeader>
                  <div className="flex items-center justify-between gap-3">
                    <Badge variant="secondary">Announcement</Badge>
                    <CardDescription>{formatPublishedDate(n.published_at)}</CardDescription>
                  </div>
                  <CardTitle className="pt-3 text-3xl">{n.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-1 flex-col gap-4">
                  <p className="text-muted-foreground">{n.excerpt}</p>
                  {n.body ? (
                    <p className="whitespace-pre-line text-sm leading-7">{n.body}</p>
                  ) : null}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </>
  );
}

function NewsLoading() {
  return (
    <>
      <PageHeader
        kicker="Updates"
        title="News"
        intro="Announcements, guides and stories from our community."
      />
      <section
        aria-label="Loading news"
        className="mx-auto grid max-w-6xl gap-6 px-5 py-20 md:grid-cols-2 lg:grid-cols-3"
      >
        {Array.from({ length: 3 }, (_, index) => (
          <Card key={index}>
            <CardHeader className="space-y-4">
              <div className="flex items-center justify-between gap-3">
                <Skeleton className="h-5 w-28" />
                <Skeleton className="h-4 w-24" />
              </div>
              <Skeleton className="h-9 w-full" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-5/6" />
              <Skeleton className="h-20 w-full" />
            </CardContent>
          </Card>
        ))}
      </section>
    </>
  );
}

function formatPublishedDate(value: string) {
  return new Date(value).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

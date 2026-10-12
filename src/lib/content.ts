import { supabase } from "@/lib/supabase";

type EventItem = {
  title: string;
  date: string;
  place: string;
  tag: string;
  desc: string;
};

type NewsItem = {
  title: string;
  date: string;
  excerpt: string;
};

type GalleryItem = {
  src: string;
  cap: string;
  alt: string;
};

const events = [
  {
    title: "Pohela Boishakh 1434",
    date: "2027-04-14",
    place: "APU Millennium Hall",
    tag: "Culture",
    desc: "Bengali New Year with panta-ilish, music, alpana art and a mangal shobhajatra across campus.",
  },
  {
    title: "Welcome Night for New Students",
    date: "2026-10-24",
    place: "AP House 2 Lounge",
    tag: "Community",
    desc: "Meet seniors, get settling-in tips for Beppu, and enjoy a home-cooked Bangladeshi dinner.",
  },
  {
    title: "Victory Day Celebration",
    date: "2026-12-16",
    place: "APU Campus Plaza",
    tag: "Heritage",
    desc: "Commemorating 16 December with a flag ceremony, poetry and a cultural programme.",
  },
  {
    title: "Bangladesh Night at APU Multicultural Week",
    date: "2026-11-20",
    place: "Millennium Hall",
    tag: "Showcase",
    desc: "Our flagship stage show: dance, drama, songs and a food stall for the whole APU community.",
  },
];

export async function getEvents(): Promise<EventItem[]> {
  if (!supabase) return events;

  const { data, error } = await supabase
    .from("events")
    .select("title, event_date, location, tag, description")
    .eq("published", true)
    .order("event_date");

  if (error) throw error;

  return data.map((event) => ({
    title: event.title,
    date: event.event_date,
    place: event.location,
    tag: event.tag,
    desc: event.description,
  }));
}

const news = [
  {
    title: "New executive committee announced for 2026–27",
    date: "2026-09-15",
    excerpt:
      "BSA welcomes its new leadership team, who will guide the association through the upcoming academic year.",
  },
  {
    title: "Record turnout at Eid reunion in Beppu",
    date: "2026-06-08",
    excerpt:
      "Over 120 students, alumni and families gathered for an Eid celebration at Beppu Beach Park.",
  },
  {
    title: "Arrival guide for spring intake now available",
    date: "2026-02-20",
    excerpt:
      "Our updated guide covers residence card, bank account, phone SIM and halal food in Beppu.",
  },
];

export async function getNews(): Promise<NewsItem[]> {
  if (!supabase) return news;

  const { data, error } = await supabase
    .from("news")
    .select("title, published_at, excerpt")
    .eq("published", true)
    .order("published_at", { ascending: false });

  if (error) throw error;

  return data.map((item) => ({
    title: item.title,
    date: item.published_at,
    excerpt: item.excerpt,
  }));
}

export async function getGalleryItems(fallback: GalleryItem[]): Promise<GalleryItem[]> {
  if (!supabase) return fallback;

  const { data, error } = await supabase
    .from("gallery_items")
    .select("image_url, caption, alt_text")
    .eq("published", true)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data.map((item) => ({
    src: item.image_url,
    cap: item.caption,
    alt: item.alt_text,
  }));
}

export const fmt = (d: string) =>
  new Date(d + "T00:00:00").toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

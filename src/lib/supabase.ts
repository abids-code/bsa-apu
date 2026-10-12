import { createClient } from "@supabase/supabase-js";

type Table<Row, Insert, Update = Partial<Insert>> = {
  Row: Row;
  Insert: Insert;
  Update: Update;
  Relationships: [];
};

type EventRow = {
  id: string;
  title: string;
  slug: string;
  event_date: string;
  location: string;
  tag: string;
  description: string;
  image_url: string | null;
  published: boolean;
  created_at: string;
  updated_at: string;
};

type NewsRow = {
  id: string;
  title: string;
  slug: string;
  published_at: string;
  excerpt: string;
  body: string | null;
  image_url: string | null;
  published: boolean;
  created_at: string;
  updated_at: string;
};

type GalleryAlbumRow = {
  id: string;
  title: string;
  description: string;
  published: boolean;
  created_at: string;
  updated_at: string;
};

type GalleryRow = {
  id: string;
  image_url: string;
  caption: string;
  alt_text: string;
  published: boolean;
  album_id: string | null;
  created_at: string;
};

type ContactMessageRow = {
  id: string;
  name: string;
  email: string;
  topic: string;
  message: string;
  send_updates: boolean;
  notifications_enabled: boolean;
  created_at: string;
};

type ProfileRow = {
  id: string;
  role: "member" | "admin";
  created_at: string;
  updated_at: string;
};

type CommitteeMemberRow = {
  id: string;
  name: string;
  role: string;
  instagram_handle: string | null;
  image_url: string | null;
  created_at: string;
  updated_at: string;
};

type Database = {
  public: {
    Tables: {
      events: Table<
        EventRow,
        Omit<EventRow, "id" | "created_at" | "updated_at" | "published"> &
          Partial<Pick<EventRow, "id" | "published">>
      >;
      news: Table<
        NewsRow,
        Omit<NewsRow, "id" | "created_at" | "updated_at" | "published" | "body" | "published_at"> &
          Partial<Pick<NewsRow, "id" | "published" | "body" | "published_at">>
      >;
      gallery_albums: Table<
        GalleryAlbumRow,
        Omit<GalleryAlbumRow, "id" | "created_at" | "updated_at"> &
          Partial<Pick<GalleryAlbumRow, "id" | "published">>
      >;
      gallery_items: Table<
        GalleryRow,
        Omit<GalleryRow, "id" | "created_at" | "published"> &
          Partial<Pick<GalleryRow, "id" | "published">>
      >;
      contact_messages: Table<
        ContactMessageRow,
        Omit<ContactMessageRow, "id" | "created_at" | "send_updates" | "notifications_enabled"> &
          Partial<Pick<ContactMessageRow, "id" | "send_updates" | "notifications_enabled">>
      >;
      profiles: Table<
        ProfileRow,
        Pick<ProfileRow, "id"> & Partial<Pick<ProfileRow, "role">>,
        never
      >;
      committee_members: Table<
        CommitteeMemberRow,
        Omit<CommitteeMemberRow, "id" | "created_at" | "updated_at"> &
          Partial<Pick<CommitteeMemberRow, "id">>
      >;
    };
    Views: Record<string, never>;
    Functions: {
      is_admin: { Args: Record<string, never>; Returns: boolean };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

const supabaseUrl = import.meta.env["VITE_SUPABASE_URL"];
const supabaseAnonKey = import.meta.env["VITE_SUPABASE_ANON_KEY"];

export const supabase =
  supabaseUrl && supabaseAnonKey ? createClient<Database>(supabaseUrl, supabaseAnonKey) : null;

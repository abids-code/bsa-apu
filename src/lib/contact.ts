import { supabase } from "@/lib/supabase";

type ContactMessage = {
  name: string;
  email: string;
  topic: string;
  message: string;
  send_updates: boolean;
  notifications_enabled: boolean;
};

export async function submitContactMessage(contact: ContactMessage): Promise<void> {
  if (!supabase) {
    throw new Error(
      "Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your local environment.",
    );
  }

  const { error } = await supabase.from("contact_messages").insert(contact);
  if (error) throw error;
}

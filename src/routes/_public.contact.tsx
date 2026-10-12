import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Mail, MapPin } from "lucide-react";
import { PageHeader } from "@/components/public/SiteChrome";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { submitContactMessage } from "@/lib/contact";

export const Route = createFileRoute("/_public/contact")({
  head: () => ({
    meta: [
      { title: "Contact & Join — BSA APU" },
      {
        name: "description",
        content:
          "Get in touch with the Bangladeshi Students Association at Ritsumeikan APU or express interest in joining.",
      },
      { property: "og:title", content: "Contact & Join — BSA APU" },
      { property: "og:description", content: "Reach out to BSA or join our community in Beppu." },
    ],
  }),
  component: Contact,
});

function Contact() {
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [topic, setTopic] = useState("join");
  const [sendUpdates, setSendUpdates] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setErrorMessage("");

    const formData = new FormData(event.currentTarget);

    try {
      await submitContactMessage({
        name: String(formData.get("name") ?? ""),
        email: String(formData.get("email") ?? ""),
        topic,
        message: String(formData.get("message") ?? ""),
        send_updates: sendUpdates,
        notifications_enabled: notificationsEnabled,
      });
      setSent(true);
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else if (
        typeof error === "object" &&
        error !== null &&
        "message" in error &&
        typeof error.message === "string"
      ) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("Your message could not be sent. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <PageHeader
        kicker="Say hello"
        title="Contact & Join"
        intro="Questions about arriving at APU, joining BSA, or partnering on an event? Send us a message."
      />
      <section className="mx-auto grid max-w-6xl gap-12 px-5 py-20 md:grid-cols-[1fr_1.4fr]">
        <div className="space-y-6">
          <p className="flex gap-3">
            <MapPin className="h-5 w-5 shrink-0 text-primary" />
            Ritsumeikan Asia Pacific University, 1-1 Jumonjibaru, Beppu, Oita 874-8577, Japan
          </p>
          <p className="flex gap-3">
            <Mail className="h-5 w-5 shrink-0 text-primary" />
            bsa.apu@example.com
          </p>
        </div>
        {sent ? (
          <div className="border-l-4 border-secondary bg-card p-8">
            <h2 className="text-4xl">ধন্যবাদ — thank you!</h2>
            <p className="mt-2 text-muted-foreground">We'll get back to you soon.</p>
          </div>
        ) : (
          <form className="space-y-5 rounded-lg border bg-card p-6" onSubmit={handleSubmit}>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Full name</Label>
                <Input id="name" name="name" required maxLength={120} placeholder="Full name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  required
                  maxLength={320}
                  type="email"
                  placeholder="Email"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="topic">How can we help?</Label>
              <Select value={topic} onValueChange={setTopic}>
                <SelectTrigger id="topic" className="w-full">
                  <SelectValue placeholder="Select an option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="join">I want to join BSA</SelectItem>
                  <SelectItem value="arrival">New student arrival help</SelectItem>
                  <SelectItem value="event">Event or partnership</SelectItem>
                  <SelectItem value="other">Something else</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Your message</Label>
              <Textarea
                id="message"
                name="message"
                required
                maxLength={5000}
                rows={5}
                placeholder="Your message"
              />
            </div>

            <div className="flex flex-col gap-4 rounded-md border bg-muted/40 p-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="updates"
                  checked={sendUpdates}
                  onCheckedChange={(checked) => setSendUpdates(checked === true)}
                />
                <Label htmlFor="updates">Send me updates</Label>
              </div>
              <div className="flex items-center gap-3">
                <Label htmlFor="notifications">BSA notifications</Label>
                <Switch
                  id="notifications"
                  checked={notificationsEnabled}
                  onCheckedChange={setNotificationsEnabled}
                />
              </div>
            </div>

            {errorMessage && (
              <p role="alert" className="text-sm text-destructive">
                {errorMessage}
              </p>
            )}

            <Button type="submit" disabled={submitting} className="w-full sm:w-auto">
              {submitting ? "Sending..." : "Send message"}
            </Button>
          </form>
        )}
      </section>
    </>
  );
}

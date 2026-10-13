import { useCallback, useEffect, useState, type FormEvent } from "react";
import { Pencil, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/lib/supabase";
import { uploadImageToCloudinary } from "@/lib/cloudinary";

type AdminEvent = {
  id: string;
  title: string;
  slug: string;
  event_date: string;
  location: string;
  tag: string;
  description: string;
  image_url: string | null;
  published: boolean;
};

const emptyEvent = {
  title: "",
  slug: "",
  event_date: "",
  location: "",
  tag: "",
  description: "",
  image_url: null as string | null,
  published: false,
};

const eventFields: Array<{
  name: "title" | "slug" | "event_date" | "location" | "tag";
  label: string;
  type: string;
}> = [
  { name: "title", label: "Title", type: "text" },
  { name: "slug", label: "Slug", type: "text" },
  { name: "event_date", label: "Date", type: "date" },
  { name: "location", label: "Location", type: "text" },
  { name: "tag", label: "Tag", type: "text" },
];

export function AdminEvents() {
  const [events, setEvents] = useState<AdminEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<AdminEvent | null>(null);
  const [formValues, setFormValues] = useState(emptyEvent);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchEvents = useCallback(async () => {
    if (!supabase) {
      setErrorMessage("Supabase is not configured.");
      setLoading(false);
      return;
    }

    setLoading(true);
    const { data, error } = await supabase
      .from("events")
      .select("id, title, slug, event_date, location, tag, description, image_url, published")
      .order("event_date", { ascending: true });

    if (error) {
      setErrorMessage(error.message);
    } else {
      setEvents(data);
      setErrorMessage(null);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void fetchEvents();
  }, [fetchEvents]);

  function openCreateDialog() {
    setEditingEvent(null);
    setFormValues(emptyEvent);
    setErrorMessage(null);
    setDialogOpen(true);
  }

  function openEditDialog(item: AdminEvent) {
    setEditingEvent(item);
    setFormValues({
      title: item.title,
      slug: item.slug,
      event_date: item.event_date,
      location: item.location,
      tag: item.tag,
      description: item.description,
      image_url: item.image_url,
      published: item.published,
    });
    setErrorMessage(null);
    setDialogOpen(true);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!supabase) {
      setErrorMessage("Supabase is not configured.");
      return;
    }

    const form = event.currentTarget;
    const formData = new FormData(form);
    setSubmitting(true);
    setErrorMessage(null);

    const flyer = formData.get("flyer");
    let imageUrl = formValues.image_url;

    if (flyer instanceof File && flyer.size > 0) {
      try {
        imageUrl = await uploadImageToCloudinary(flyer, "events");
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : "Could not upload event image.");
        setSubmitting(false);
        return;
      }
    }

    const values = {
      title: String(formData.get("title") ?? "").trim(),
      slug: String(formData.get("slug") ?? "").trim(),
      event_date: String(formData.get("event_date") ?? ""),
      location: String(formData.get("location") ?? "").trim(),
      tag: String(formData.get("tag") ?? "").trim(),
      description: String(formData.get("description") ?? "").trim(),
      image_url: imageUrl,
      published: formValues.published,
    };

    const result = editingEvent
      ? await supabase.from("events").update(values).eq("id", editingEvent.id)
      : await supabase.from("events").insert(values);

    if (result.error) {
      setErrorMessage(result.error.message);
      setSubmitting(false);
      return;
    }

    await fetchEvents();
    setDialogOpen(false);
    setEditingEvent(null);
    setFormValues(emptyEvent);
    setSubmitting(false);
  }

  async function handleDeleteEvent(eventId: string) {
    if (!supabase) {
      setErrorMessage("Supabase is not configured.");
      return;
    }

    setDeletingId(eventId);
    setErrorMessage(null);
    const { error } = await supabase.from("events").delete().eq("id", eventId);
    if (error) setErrorMessage(error.message);
    else await fetchEvents();
    setDeletingId(null);
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button type="button" onClick={openCreateDialog}>
          Create New Event
        </Button>
      </div>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>{editingEvent ? "Edit Event" : "Create New Event"}</DialogTitle>
            <DialogDescription>
              {editingEvent ? "Update this event." : "Add an event to the BSA calendar."}
            </DialogDescription>
          </DialogHeader>
          <form className="space-y-4" onSubmit={handleSubmit}>
            {eventFields.map(({ name, label, type }) => (
              <div key={name} className="space-y-2">
                <label htmlFor={`event-${name}`} className="text-sm font-medium">
                  {label}
                </label>
                <Input
                  id={`event-${name}`}
                  name={name}
                  type={type}
                  value={formValues[name as keyof typeof formValues] as string}
                  onChange={(event) =>
                    setFormValues((current) => ({ ...current, [name]: event.target.value }))
                  }
                  required
                  maxLength={name === "title" || name === "slug" ? 180 : undefined}
                />
              </div>
            ))}
            <div className="space-y-2">
              <label htmlFor="event-description" className="text-sm font-medium">
                Description
              </label>
              <Textarea
                id="event-description"
                name="description"
                value={formValues.description}
                onChange={(event) =>
                  setFormValues((current) => ({ ...current, description: event.target.value }))
                }
                required
                maxLength={2000}
                rows={4}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="event-flyer" className="text-sm font-medium">
                Event flyer {editingEvent ? "(optional replacement)" : ""}
              </label>
              <Input id="event-flyer" name="flyer" type="file" accept="image/*" />
            </div>
            <div className="flex items-center justify-between rounded-md border p-3">
              <label htmlFor="event-published" className="text-sm font-medium">
                Published
              </label>
              <Switch
                id="event-published"
                checked={formValues.published}
                onCheckedChange={(published) =>
                  setFormValues((current) => ({ ...current, published }))
                }
              />
            </div>
            {errorMessage ? (
              <p role="alert" className="text-sm text-destructive">
                {errorMessage}
              </p>
            ) : null}
            <DialogFooter>
              <Button type="submit" disabled={submitting}>
                {submitting ? "Saving..." : editingEvent ? "Save Changes" : "Create Event"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      {errorMessage && !dialogOpen ? (
        <p role="alert" className="text-sm text-destructive">
          {errorMessage}
        </p>
      ) : null}
      {loading ? (
        <p role="status" className="text-sm text-muted-foreground">
          Loading events...
        </p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Published</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {events.length ? (
              events.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.title}</TableCell>
                  <TableCell>{item.event_date}</TableCell>
                  <TableCell>{item.location}</TableCell>
                  <TableCell>{item.published ? "Published" : "Draft"}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditDialog(item)}
                        aria-label={`Edit ${item.title}`}
                      >
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                        onClick={() => void handleDeleteEvent(item.id)}
                        disabled={deletingId === item.id}
                        aria-label={`Delete ${item.title}`}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                  No events found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}
    </div>
  );
}

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

type AdminNewsItem = {
  id: string;
  title: string;
  slug: string;
  published_at: string;
  excerpt: string;
  body: string | null;
  published: boolean;
  image_url: string | null;
};

const emptyNews = {
  title: "",
  slug: "",
  excerpt: "",
  body: "",
  published: false,
  image_url: null as string | null,
};

export function AdminNews() {
  const [items, setItems] = useState<AdminNewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<AdminNewsItem | null>(null);
  const [formValues, setFormValues] = useState(emptyNews);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchNews = useCallback(async () => {
    if (!supabase) {
      setErrorMessage("Supabase is not configured.");
      setLoading(false);
      return;
    }

    setLoading(true);
    const { data, error } = await supabase
      .from("news")
      .select("id, title, slug, published_at, excerpt, body, published, image_url")
      .order("published_at", { ascending: false });
    if (error) setErrorMessage(error.message);
    else {
      setItems(data);
      setErrorMessage(null);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void fetchNews();
  }, [fetchNews]);

  function openCreateDialog() {
    setEditingItem(null);
    setFormValues(emptyNews);
    setErrorMessage(null);
    setDialogOpen(true);
  }

  function openEditDialog(item: AdminNewsItem) {
    setEditingItem(item);
    setFormValues({
      title: item.title,
      slug: item.slug,
      excerpt: item.excerpt,
      body: item.body ?? "",
      published: item.published,
      image_url: item.image_url,
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

    const formData = new FormData(event.currentTarget);
    const headerImage = formData.get("header_image");
    let imageUrl = formValues.image_url;
    setSubmitting(true);
    setErrorMessage(null);

    if (headerImage instanceof File && headerImage.size > 0) {
      try {
        imageUrl = await uploadImageToCloudinary(headerImage, "news");
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : "Could not upload news image.");
        setSubmitting(false);
        return;
      }
    }

    const values = {
      title: String(formData.get("title") ?? "").trim(),
      slug: String(formData.get("slug") ?? "").trim(),
      excerpt: String(formData.get("excerpt") ?? "").trim(),
      body: String(formData.get("body") ?? "").trim() || null,
      image_url: imageUrl,
      published: formValues.published,
    };
    const result = editingItem
      ? await supabase.from("news").update(values).eq("id", editingItem.id)
      : await supabase.from("news").insert(values);

    if (result.error) {
      setErrorMessage(result.error.message);
      setSubmitting(false);
      return;
    }

    await fetchNews();
    setDialogOpen(false);
    setEditingItem(null);
    setFormValues(emptyNews);
    setSubmitting(false);
  }

  async function handleDelete(newsId: string) {
    if (!supabase) {
      setErrorMessage("Supabase is not configured.");
      return;
    }
    setDeletingId(newsId);
    setErrorMessage(null);
    const { error } = await supabase.from("news").delete().eq("id", newsId);
    if (error) setErrorMessage(error.message);
    else await fetchNews();
    setDeletingId(null);
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button type="button" onClick={openCreateDialog}>
          Add News
        </Button>
      </div>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>{editingItem ? "Edit News" : "Add News"}</DialogTitle>
            <DialogDescription>
              {editingItem
                ? "Update this announcement."
                : "Create a news announcement for the BSA website."}
            </DialogDescription>
          </DialogHeader>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label htmlFor="news-title" className="text-sm font-medium">
                Title
              </label>
              <Input
                id="news-title"
                name="title"
                value={formValues.title}
                onChange={(e) => setFormValues((v) => ({ ...v, title: e.target.value }))}
                required
                maxLength={180}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="news-slug" className="text-sm font-medium">
                Slug
              </label>
              <Input
                id="news-slug"
                name="slug"
                value={formValues.slug}
                onChange={(e) => setFormValues((v) => ({ ...v, slug: e.target.value }))}
                required
                maxLength={180}
                pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
                title="Use lowercase letters, numbers, and hyphens."
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="news-excerpt" className="text-sm font-medium">
                Excerpt
              </label>
              <Textarea
                id="news-excerpt"
                name="excerpt"
                value={formValues.excerpt}
                onChange={(e) => setFormValues((v) => ({ ...v, excerpt: e.target.value }))}
                required
                maxLength={1000}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="news-body" className="text-sm font-medium">
                Body
              </label>
              <Textarea
                id="news-body"
                name="body"
                value={formValues.body}
                onChange={(e) => setFormValues((v) => ({ ...v, body: e.target.value }))}
                rows={6}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="news-header-image" className="text-sm font-medium">
                Header image {editingItem ? "(optional replacement)" : "(optional)"}
              </label>
              <Input id="news-header-image" name="header_image" type="file" accept="image/*" />
            </div>
            <div className="flex items-center justify-between rounded-md border p-3">
              <label htmlFor="news-published" className="text-sm font-medium">
                Published
              </label>
              <Switch
                id="news-published"
                checked={formValues.published}
                onCheckedChange={(published) => setFormValues((v) => ({ ...v, published }))}
              />
            </div>
            {errorMessage ? (
              <p role="alert" className="text-sm text-destructive">
                {errorMessage}
              </p>
            ) : null}
            <DialogFooter>
              <Button type="submit" disabled={submitting}>
                {submitting ? "Saving..." : editingItem ? "Save Changes" : "Add News"}
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
          Loading news...
        </p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Published date</TableHead>
              <TableHead>Excerpt</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.length ? (
              items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.title}</TableCell>
                  <TableCell>{item.published_at}</TableCell>
                  <TableCell className="max-w-sm text-muted-foreground">{item.excerpt}</TableCell>
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
                        onClick={() => void handleDelete(item.id)}
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
                  No news announcements found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}
    </div>
  );
}

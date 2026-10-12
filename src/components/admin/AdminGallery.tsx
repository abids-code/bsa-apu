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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/lib/supabase";

type Album = { id: string; title: string; description: string; published: boolean };
type Photo = {
  id: string;
  image_url: string;
  caption: string;
  alt_text: string;
  album_id: string | null;
};

export function AdminGallery() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [albumDialogOpen, setAlbumDialogOpen] = useState(false);
  const [photoDialogOpen, setPhotoDialogOpen] = useState(false);
  const [editingAlbum, setEditingAlbum] = useState<Album | null>(null);
  const [selectedAlbumId, setSelectedAlbumId] = useState("");

  const fetchGallery = useCallback(async () => {
    if (!supabase) {
      setErrorMessage("Supabase is not configured.");
      setLoading(false);
      return;
    }
    setLoading(true);
    const [{ data: albumData, error: albumError }, { data: photoData, error: photoError }] =
      await Promise.all([
        supabase
          .from("gallery_albums")
          .select("id, title, description, published")
          .order("created_at", { ascending: false }),
        supabase
          .from("gallery_items")
          .select("id, image_url, caption, alt_text, album_id")
          .order("created_at", { ascending: false }),
      ]);
    if (albumError || photoError) {
      setErrorMessage(albumError?.message ?? photoError?.message ?? "Could not load gallery.");
    } else {
      setAlbums(albumData);
      setPhotos(photoData);
      setErrorMessage(null);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void fetchGallery();
  }, [fetchGallery]);

  function openAlbumCreate() {
    setEditingAlbum(null);
    setAlbumDialogOpen(true);
    setErrorMessage(null);
  }

  function openAlbumEdit(album: Album) {
    setEditingAlbum(album);
    setAlbumDialogOpen(true);
    setErrorMessage(null);
  }

  async function handleAlbumSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!supabase) {
      setErrorMessage("Supabase is not configured.");
      return;
    }
    const data = new FormData(event.currentTarget);
    setSubmitting(true);
    setErrorMessage(null);
    const values = {
      title: String(data.get("album_title") ?? "").trim(),
      description: String(data.get("album_description") ?? "").trim(),
      published: true,
    };
    const result = editingAlbum
      ? await supabase.from("gallery_albums").update(values).eq("id", editingAlbum.id)
      : await supabase.from("gallery_albums").insert(values);
    if (result.error) setErrorMessage(result.error.message);
    else {
      await fetchGallery();
      setAlbumDialogOpen(false);
      setEditingAlbum(null);
    }
    setSubmitting(false);
  }

  async function handleDeleteAlbum(albumId: string) {
    if (!supabase) {
      setErrorMessage("Supabase is not configured.");
      return;
    }
    setDeletingId(albumId);
    const { error } = await supabase.from("gallery_albums").delete().eq("id", albumId);
    if (error) setErrorMessage(error.message);
    else await fetchGallery();
    setDeletingId(null);
  }

  async function handlePhotoUpload(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!supabase) {
      setErrorMessage("Supabase is not configured.");
      return;
    }
    const data = new FormData(event.currentTarget);
    const photo = data.get("photo");
    if (!(photo instanceof File) || photo.size === 0) {
      setErrorMessage("Choose an image to upload.");
      return;
    }
    if (!selectedAlbumId) {
      setErrorMessage("Choose an album for this photo.");
      return;
    }
    setSubmitting(true);
    setErrorMessage(null);
    const fileName = photo.name.replace(/[^a-zA-Z0-9._-]/g, "-");
    const storagePath = `gallery/${crypto.randomUUID()}-${fileName}`;
    const { error: uploadError } = await supabase.storage
      .from("bsa-gallery")
      .upload(storagePath, photo, {
        contentType: photo.type,
        upsert: false,
      });
    if (uploadError) {
      setErrorMessage(uploadError.message);
      setSubmitting(false);
      return;
    }
    const imageUrl = supabase.storage.from("bsa-gallery").getPublicUrl(storagePath).data.publicUrl;
    const { error: insertError } = await supabase.from("gallery_items").insert({
      image_url: imageUrl,
      caption: String(data.get("caption") ?? "").trim(),
      alt_text: String(data.get("alt_text") ?? "").trim(),
      album_id: selectedAlbumId,
      published: true,
    });
    if (insertError) {
      await supabase.storage.from("bsa-gallery").remove([storagePath]);
      setErrorMessage(insertError.message);
    } else {
      await fetchGallery();
      setPhotoDialogOpen(false);
      setSelectedAlbumId("");
    }
    setSubmitting(false);
  }

  async function handleDeletePhoto(photoId: string) {
    if (!supabase) {
      setErrorMessage("Supabase is not configured.");
      return;
    }
    setDeletingId(photoId);
    const { error } = await supabase.from("gallery_items").delete().eq("id", photoId);
    if (error) setErrorMessage(error.message);
    else await fetchGallery();
    setDeletingId(null);
  }

  return (
    <Tabs defaultValue="albums" className="space-y-4">
      <TabsList>
        <TabsTrigger value="albums">Albums</TabsTrigger>
        <TabsTrigger value="photos">Photos</TabsTrigger>
      </TabsList>
      {errorMessage ? (
        <p role="alert" className="text-sm text-destructive">
          {errorMessage}
        </p>
      ) : null}
      {loading ? (
        <p role="status" className="text-sm text-muted-foreground">
          Loading gallery...
        </p>
      ) : (
        <>
          <TabsContent value="albums" className="space-y-4">
            <div className="flex justify-end">
              <Button type="button" onClick={openAlbumCreate}>
                Create Album
              </Button>
            </div>
            <Dialog open={albumDialogOpen} onOpenChange={setAlbumDialogOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{editingAlbum ? "Edit Album" : "Create Album"}</DialogTitle>
                  <DialogDescription>
                    Organize published gallery photos into albums.
                  </DialogDescription>
                </DialogHeader>
                <form className="space-y-4" onSubmit={handleAlbumSubmit}>
                  <div className="space-y-2">
                    <label htmlFor="album-title" className="text-sm font-medium">
                      Title
                    </label>
                    <Input
                      id="album-title"
                      name="album_title"
                      defaultValue={editingAlbum?.title ?? ""}
                      required
                      maxLength={180}
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="album-description" className="text-sm font-medium">
                      Description
                    </label>
                    <Textarea
                      id="album-description"
                      name="album_description"
                      defaultValue={editingAlbum?.description ?? ""}
                      rows={4}
                      maxLength={2000}
                    />
                  </div>
                  <DialogFooter>
                    <Button type="submit" disabled={submitting}>
                      {submitting ? "Saving..." : "Save Album"}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {albums.length ? (
                  albums.map((album) => (
                    <TableRow key={album.id}>
                      <TableCell className="font-medium">{album.title}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {album.description || "—"}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => openAlbumEdit(album)}
                            aria-label={`Edit ${album.title}`}
                          >
                            <Pencil className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="text-destructive hover:text-destructive"
                            onClick={() => void handleDeleteAlbum(album.id)}
                            disabled={deletingId === album.id}
                            aria-label={`Delete ${album.title}`}
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
                    <TableCell colSpan={3} className="h-24 text-center text-muted-foreground">
                      No albums found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TabsContent>
          <TabsContent value="photos" className="space-y-4">
            <div className="flex justify-end">
              <Button
                type="button"
                onClick={() => {
                  setPhotoDialogOpen(true);
                  setErrorMessage(null);
                }}
              >
                Upload Photo
              </Button>
            </div>
            <Dialog open={photoDialogOpen} onOpenChange={setPhotoDialogOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Upload Photo</DialogTitle>
                  <DialogDescription>Add a photo to an album.</DialogDescription>
                </DialogHeader>
                <form className="space-y-4" onSubmit={handlePhotoUpload}>
                  <div className="space-y-2">
                    <label htmlFor="gallery-photo" className="text-sm font-medium">
                      Image
                    </label>
                    <Input id="gallery-photo" name="photo" type="file" accept="image/*" required />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="gallery-album" className="text-sm font-medium">
                      Album
                    </label>
                    <Select value={selectedAlbumId} onValueChange={setSelectedAlbumId}>
                      <SelectTrigger id="gallery-album">
                        <SelectValue placeholder="Choose an album" />
                      </SelectTrigger>
                      <SelectContent>
                        {albums.map((album) => (
                          <SelectItem key={album.id} value={album.id}>
                            {album.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="gallery-caption" className="text-sm font-medium">
                      Caption
                    </label>
                    <Input id="gallery-caption" name="caption" required maxLength={240} />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="gallery-alt-text" className="text-sm font-medium">
                      Alt text
                    </label>
                    <Input id="gallery-alt-text" name="alt_text" required maxLength={500} />
                  </div>
                  <DialogFooter>
                    <Button type="submit" disabled={submitting}>
                      {submitting ? "Uploading..." : "Upload Photo"}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Photo</TableHead>
                  <TableHead>Album</TableHead>
                  <TableHead>Caption</TableHead>
                  <TableHead>Alt text</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {photos.length ? (
                  photos.map((photo) => (
                    <TableRow key={photo.id}>
                      <TableCell>
                        <img
                          src={photo.image_url}
                          alt={photo.alt_text}
                          className="h-16 w-24 rounded-md object-cover"
                        />
                      </TableCell>
                      <TableCell>
                        {albums.find((album) => album.id === photo.album_id)?.title ?? "Unassigned"}
                      </TableCell>
                      <TableCell className="font-medium">{photo.caption}</TableCell>
                      <TableCell className="text-muted-foreground">{photo.alt_text}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive"
                          onClick={() => void handleDeletePhoto(photo.id)}
                          disabled={deletingId === photo.id}
                          aria-label={`Delete ${photo.caption}`}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                      No photos found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TabsContent>
        </>
      )}
    </Tabs>
  );
}

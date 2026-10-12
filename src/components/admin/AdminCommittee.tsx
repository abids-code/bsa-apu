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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { supabase } from "@/lib/supabase";

type CommitteeMember = {
  id: string;
  name: string;
  role: string;
  instagram_handle: string | null;
  image_url: string | null;
};

export function AdminCommittee() {
  const [members, setMembers] = useState<CommitteeMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<CommitteeMember | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchMembers = useCallback(async () => {
    if (!supabase) {
      setErrorMessage("Supabase is not configured.");
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data, error } = await supabase
      .from("committee_members")
      .select("id, name, role, instagram_handle, image_url")
      .order("created_at", { ascending: true });
    if (error) setErrorMessage(error.message);
    else {
      setMembers(data);
      setErrorMessage(null);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void fetchMembers();
  }, [fetchMembers]);

  async function saveMember(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!supabase) {
      setErrorMessage("Supabase is not configured.");
      return;
    }
    const formData = new FormData(event.currentTarget);
    const values = {
      name: String(formData.get("name") ?? "").trim(),
      role: String(formData.get("role") ?? "").trim(),
      instagram_handle: String(formData.get("instagram_handle") ?? "").trim() || null,
      image_url: editing?.image_url ?? null,
    };
    setSaving(true);
    setErrorMessage(null);
    const result = editing
      ? await supabase.from("committee_members").update(values).eq("id", editing.id)
      : await supabase.from("committee_members").insert(values);
    if (result.error) setErrorMessage(result.error.message);
    else {
      await fetchMembers();
      setDialogOpen(false);
      setEditing(null);
    }
    setSaving(false);
  }

  async function deleteMember(id: string) {
    if (!supabase) return;
    const { error } = await supabase.from("committee_members").delete().eq("id", id);
    if (error) setErrorMessage(error.message);
    else await fetchMembers();
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button
          type="button"
          onClick={() => {
            setEditing(null);
            setDialogOpen(true);
          }}
        >
          Add Member
        </Button>
      </div>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Committee Member" : "Add Committee Member"}</DialogTitle>
            <DialogDescription>Keep the representative body information current.</DialogDescription>
          </DialogHeader>
          <form className="space-y-4" onSubmit={saveMember}>
            <Input name="name" placeholder="Name" defaultValue={editing?.name ?? ""} required />
            <Input name="role" placeholder="Role" defaultValue={editing?.role ?? ""} required />
            <Input
              name="instagram_handle"
              placeholder="Instagram handle (optional)"
              defaultValue={editing?.instagram_handle ?? ""}
            />
            {errorMessage ? (
              <p role="alert" className="text-sm text-destructive">
                {errorMessage}
              </p>
            ) : null}
            <DialogFooter>
              <Button type="submit" disabled={saving}>
                {saving ? "Saving..." : "Save Member"}
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
          Loading committee...
        </p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Instagram</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.length ? (
              members.map((member) => (
                <TableRow key={member.id}>
                  <TableCell className="font-medium">{member.name}</TableCell>
                  <TableCell>{member.role}</TableCell>
                  <TableCell>{member.instagram_handle ?? "—"}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setEditing(member);
                        setDialogOpen(true);
                      }}
                      aria-label={`Edit ${member.name}`}
                    >
                      <Pencil className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      onClick={() => void deleteMember(member.id)}
                      aria-label={`Delete ${member.name}`}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                  No committee members found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}
    </div>
  );
}

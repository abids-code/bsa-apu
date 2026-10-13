import { useCallback, useEffect, useState } from "react";
import { Check, Eye, X } from "lucide-react";

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
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/lib/supabase";

type MemberApplication = {
  id: string;
  name: string;
  email: string;
  semester: string;
  student_id: string;
  nationality: string;
  degree_level: string;
  department: string;
  instagram_url: string | null;
  facebook_url: string | null;
  linkedin_url: string | null;
  image_url: string | null;
  approval_status: "pending" | "approved" | "declined";
  decline_reason: string | null;
  created_at: string;
};

const fields =
  "id, name, email, semester, student_id, nationality, degree_level, department, instagram_url, facebook_url, linkedin_url, image_url, approval_status, decline_reason, created_at";
const declineTemplates = [
  "Profile picture is not appropriate",
  "Wrong semester input",
  "Application information needs correction",
];

export function AdminMembers() {
  const [members, setMembers] = useState<MemberApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [selected, setSelected] = useState<MemberApplication | null>(null);
  const [declining, setDeclining] = useState<MemberApplication | null>(null);
  const [declineTemplate, setDeclineTemplate] = useState(declineTemplates[0]);
  const [customReason, setCustomReason] = useState("");
  const [showApproved, setShowApproved] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchMembers = useCallback(async () => {
    if (!supabase) {
      setErrorMessage("Supabase is not configured.");
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data, error } = await supabase
      .from("members")
      .select(fields)
      .in("approval_status", ["pending", "approved"])
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

  async function updateStatus(
    member: MemberApplication,
    status: "approved" | "declined",
    reason?: string,
  ) {
    if (!supabase) return;
    setUpdatingId(member.id);
    setErrorMessage(null);
    const { error } = await supabase
      .from("members")
      .update({ approval_status: status, decline_reason: reason ?? null })
      .eq("id", member.id);
    if (error) {
      setErrorMessage(error.message);
      setUpdatingId(null);
      return;
    }
    const { error: emailError } = await supabase.functions.invoke("member-status-email", {
      body: { member_id: member.id, status, reason: reason ?? null },
    });
    if (emailError)
      setErrorMessage(`Status updated, but the email could not be sent: ${emailError.message}`);
    await fetchMembers();
    setSelected(null);
    setDeclining(null);
    setUpdatingId(null);
  }

  function openDecline(member: MemberApplication) {
    setDeclining(member);
    setDeclineTemplate(declineTemplates[0]);
    setCustomReason("");
  }

  if (loading)
    return (
      <p role="status" className="text-sm text-muted-foreground">
        Loading member requests...
      </p>
    );
  const visibleMembers = members.filter((member) =>
    showApproved ? member.approval_status === "approved" : member.approval_status === "pending",
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold">
            {showApproved ? "Approved members" : "Pending requests"}
          </h3>
          <p className="text-sm text-muted-foreground">
            Click an applicant to inspect the full application.
          </p>
        </div>
        <Button variant="outline" onClick={() => setShowApproved((current) => !current)}>
          {showApproved ? "View pending requests" : "View approved members"}
        </Button>
      </div>
      {errorMessage && (
        <p role="alert" className="text-sm text-destructive">
          {errorMessage}
        </p>
      )}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Applicant</TableHead>
              <TableHead>Academic details</TableHead>
              <TableHead>Applied</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {visibleMembers.length ? (
              visibleMembers.map((member) => (
                <TableRow
                  key={member.id}
                  className="cursor-pointer"
                  onClick={() => setSelected(member)}
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {member.image_url ? (
                        <img
                          src={member.image_url}
                          alt=""
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                          {member.name[0]}
                        </div>
                      )}
                      <div>
                        <p className="font-medium">{member.name}</p>
                        <p className="text-xs text-muted-foreground">{member.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {member.degree_level} · {member.department}
                    <br />
                    <span className="text-xs text-muted-foreground">
                      {member.student_id} · {member.semester}
                    </span>
                  </TableCell>
                  <TableCell>{new Date(member.created_at).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right" onClick={(event) => event.stopPropagation()}>
                    <Button size="sm" variant="ghost" onClick={() => setSelected(member)}>
                      <Eye className="h-4 w-4" />
                      <span className="sr-only">View application</span>
                    </Button>
                    {showApproved ? (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-destructive hover:text-destructive"
                        onClick={() =>
                          void updateStatus(
                            member,
                            "declined",
                            "Membership revoked by administrator.",
                          )
                        }
                      >
                        <X className="h-4 w-4" />
                        Revoke
                      </Button>
                    ) : (
                      <>
                        <Button
                          size="sm"
                          onClick={() => void updateStatus(member, "approved")}
                          disabled={updatingId === member.id}
                        >
                          <Check className="h-4 w-4" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="ml-2 text-destructive hover:text-destructive"
                          onClick={() => openDecline(member)}
                          disabled={updatingId === member.id}
                        >
                          Decline
                        </Button>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                  {showApproved ? "No approved members found." : "No pending member requests."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={Boolean(selected)} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          {selected ? (
            <>
              <DialogHeader>
                <DialogTitle>{selected.name}</DialogTitle>
                <DialogDescription>Full membership application</DialogDescription>
              </DialogHeader>
              <div className="grid gap-6 md:grid-cols-[12rem_1fr]">
                {selected.image_url ? (
                  <img
                    src={selected.image_url}
                    alt={selected.name}
                    className="max-h-96 w-full rounded-xl object-contain md:max-w-sm"
                  />
                ) : (
                  <div className="flex h-64 w-full items-center justify-center rounded-xl bg-primary/10 text-6xl text-primary md:max-w-sm">
                    {selected.name[0]}
                  </div>
                )}
                <div className="grid gap-3 text-sm">
                  <Detail label="Email" value={selected.email} />
                  <Detail label="Nationality" value={selected.nationality} />
                  <Detail label="Student ID" value={selected.student_id} />
                  <Detail label="Semester" value={selected.semester} />
                  <Detail
                    label="Degree / department"
                    value={`${selected.degree_level} · ${selected.department}`}
                  />
                  <Detail label="Instagram" value={selected.instagram_url ?? "Not provided"} />
                  <Detail label="Facebook" value={selected.facebook_url ?? "Not provided"} />
                  <Detail label="LinkedIn" value={selected.linkedin_url ?? "Not provided"} />
                </div>
              </div>
              <DialogFooter>
                {selected.approval_status === "pending" ? (
                  <>
                    <Button
                      onClick={() => void updateStatus(selected, "approved")}
                      disabled={updatingId === selected.id}
                    >
                      Approve
                    </Button>
                    <Button variant="outline" onClick={() => openDecline(selected)}>
                      Decline
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="destructive"
                    onClick={() =>
                      void updateStatus(
                        selected,
                        "declined",
                        "Membership revoked by administrator.",
                      )
                    }
                  >
                    Revoke membership
                  </Button>
                )}
              </DialogFooter>
            </>
          ) : null}
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(declining)} onOpenChange={(open) => !open && setDeclining(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Decline application</DialogTitle>
            <DialogDescription>
              Choose a reason to include in the applicant email.
            </DialogDescription>
          </DialogHeader>
          <label className="grid gap-2 text-sm font-medium">
            Reason template
            <select
              value={declineTemplate}
              onChange={(event) => setDeclineTemplate(event.target.value)}
              className="h-9 rounded-md border border-input bg-transparent px-3 text-sm"
            >
              {declineTemplates.map((template) => (
                <option key={template}>{template}</option>
              ))}
            </select>
          </label>
          <label className="grid gap-2 text-sm font-medium">
            Optional custom message
            <Textarea
              value={customReason}
              onChange={(event) => setCustomReason(event.target.value)}
              placeholder="Add helpful context for the applicant..."
            />
          </label>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeclining(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() =>
                declining &&
                void updateStatus(
                  declining,
                  "declined",
                  customReason.trim()
                    ? `${declineTemplate}: ${customReason.trim()}`
                    : declineTemplate,
                )
              }
              disabled={Boolean(updatingId)}
            >
              Decline and email
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 break-words">{value}</p>
    </div>
  );
}

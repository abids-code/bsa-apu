import { useEffect, useMemo, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useAnimation } from "framer-motion";
import { Facebook, Instagram, Mail, UserRound } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { supabase } from "@/lib/supabase";

export type PublicMember = {
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
  image_url: string | null;
};

function seniority(member: PublicMember) {
  if (member.degree_level === "Alumni" || member.semester.toLowerCase() === "alumni") return 1000;
  const match = member.semester.match(/\d+/);
  return match ? Number(match[0]) : 0;
}

export function MembersGrid({
  limit,
  paginate = false,
  marquee = false,
}: {
  limit?: number;
  paginate?: boolean;
  marquee?: boolean;
}) {
  const [members, setMembers] = useState<PublicMember[]>([]);
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<PublicMember | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const pageSize = 20;

  useEffect(() => {
    async function loadMembers() {
      if (!supabase) {
        setErrorMessage("Supabase is not configured.");
        return;
      }

      const { data, error } = await supabase
        .from("members")
        .select(
          "id, name, email, semester, student_id, nationality, degree_level, department, instagram_url, facebook_url, image_url",
        )
        .eq("approval_status", "approved");
      if (error) setErrorMessage(error.message);
      else {
        setMembers(
          [...data].sort(
            (left, right) =>
              seniority(right) - seniority(left) || left.name.localeCompare(right.name),
          ),
        );
      }
    }

    void loadMembers();
  }, []);

  const sourceMembers = limit ? members.slice(0, limit) : members;
  const visibleMembers = useMemo(
    () => (paginate ? sourceMembers.slice((page - 1) * pageSize, page * pageSize) : sourceMembers),
    [page, paginate, sourceMembers],
  );
  const totalPages = Math.max(1, Math.ceil(sourceMembers.length / pageSize));

  if (errorMessage) return <p className="text-sm text-destructive">{errorMessage}</p>;

  return (
    <>
      <div className={marquee ? "overflow-hidden py-2" : "space-y-8"}>
        {members.length ? (
          marquee ? (
            <MembersMarquee members={sourceMembers} onSelect={setSelected} />
          ) : paginate ? (
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={page}
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.28, ease: "easeOut" }}
                className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5"
              >
                {visibleMembers.map((member, index) => (
                  <MemberCard
                    key={member.id}
                    member={member}
                    onSelect={setSelected}
                    index={index}
                  />
                ))}
              </motion.div>
            </AnimatePresence>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              {visibleMembers.map((member, index) => (
                <MemberCard key={member.id} member={member} onSelect={setSelected} index={index} />
              ))}
            </div>
          )
        ) : (
          <div className="rounded-lg border border-dashed p-10 text-center text-muted-foreground">
            Member profiles will appear here after approval.
          </div>
        )}
      </div>
      {paginate && totalPages > 1 ? (
        <div className="flex items-center justify-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((current) => current - 1)}
            disabled={page === 1}
          >
            Previous
          </Button>
          <span className="rounded-full bg-muted px-4 py-2 text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((current) => current + 1)}
            disabled={page === totalPages}
          >
            Next
          </Button>
        </div>
      ) : null}
      <MemberProfileDialog member={selected} onClose={() => setSelected(null)} />
    </>
  );
}

function MembersMarquee({
  members,
  onSelect,
}: {
  members: PublicMember[];
  onSelect: (member: PublicMember) => void;
}) {
  const controls = useAnimation();

  useEffect(() => {
    void controls.start({
      x: ["0%", "-50%"],
      transition: { duration: 48, ease: "linear", repeat: Infinity },
    });
    return () => controls.stop();
  }, [controls]);

  return (
    <motion.div
      className="flex w-max gap-4"
      animate={controls}
      onHoverStart={() => controls.stop()}
      onHoverEnd={() => {
        void controls.start({
          x: ["0%", "-50%"],
          transition: { duration: 48, ease: "linear", repeat: Infinity },
        });
      }}
    >
      {[...members, ...members].map((member, index) => (
        <MemberCard key={`${member.id}-${index}`} member={member} onSelect={onSelect} compact />
      ))}
    </motion.div>
  );
}

function MemberCard({
  member,
  onSelect,
  compact = false,
  index = 0,
}: {
  member: PublicMember;
  onSelect: (member: PublicMember) => void;
  compact?: boolean;
  index?: number;
}) {
  return (
    <motion.div
      role="button"
      tabIndex={0}
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ delay: Math.min(index * 0.025, 0.3) }}
      whileHover={{ y: -5, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onSelect(member)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onSelect(member);
        }
      }}
      className={`group shrink-0 rounded-2xl border border-border/70 bg-card/80 text-center shadow-sm backdrop-blur transition-shadow hover:border-primary/50 hover:shadow-xl ${
        compact ? "w-40 p-3 sm:w-48 sm:p-4" : "w-full p-3 sm:p-4"
      }`}
      aria-label={`View ${member.name}'s profile`}
    >
      <Avatar member={member} size={compact ? "small" : "default"} />
      <div className="mt-3">
        <p className="truncate text-sm font-semibold" title={member.name}>
          {member.name}
        </p>
        <span className="mt-1 inline-flex rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
          {member.semester}
        </span>
        <p className="mt-1 truncate text-[11px] text-muted-foreground">
          {member.degree_level} · {member.department}
        </p>
      </div>
      {member.instagram_url ? (
        <span
          onClick={(event) => event.stopPropagation()}
          className="mt-2 inline-flex rounded-full p-1.5 text-primary transition-colors hover:bg-primary/10"
        >
          <a
            href={member.instagram_url}
            target="_blank"
            rel="noreferrer"
            aria-label={`${member.name} on Instagram`}
          >
            <Instagram className="h-4 w-4" />
          </a>
        </span>
      ) : null}
    </motion.div>
  );
}

function Avatar({ member, size }: { member: PublicMember; size: "small" | "default" }) {
  const className =
    size === "small"
      ? "mx-auto h-16 w-16 rounded-full object-cover ring-2 ring-primary/30 ring-offset-2 ring-offset-card"
      : "mx-auto h-20 w-20 rounded-full object-cover ring-2 ring-primary/30 ring-offset-2 ring-offset-card";
  return member.image_url ? (
    <img src={member.image_url} alt={member.name} className={className} />
  ) : (
    <div
      className={`${className} flex items-center justify-center bg-primary/10 text-xl font-bold text-primary`}
    >
      {member.name.charAt(0)}
    </div>
  );
}

function MemberProfileDialog({
  member,
  onClose,
}: {
  member: PublicMember | null;
  onClose: () => void;
}) {
  return (
    <Dialog open={Boolean(member)} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="overflow-hidden border-white/20 bg-background/90 p-0 shadow-2xl backdrop-blur-xl sm:max-w-xl">
        {member ? (
          <>
            <div className="relative overflow-hidden bg-gradient-to-br from-primary/20 via-background to-secondary/30 p-8">
              <div className="absolute -right-16 -top-16 h-44 w-44 rounded-full bg-primary/20 blur-3xl" />
              <div className="relative flex flex-col items-center text-center">
                <Avatar member={member} size="default" />
                <DialogHeader className="mt-4">
                  <DialogTitle className="text-2xl">{member.name}</DialogTitle>
                  <DialogDescription>
                    {member.degree_level} · {member.department} · {member.semester}
                  </DialogDescription>
                </DialogHeader>
              </div>
            </div>
            <div className="grid gap-4 p-6 sm:grid-cols-2">
              <ProfileDetail icon={<UserRound />} label="Student ID" value={member.student_id} />
              <ProfileDetail icon={<UserRound />} label="Nationality" value={member.nationality} />
              <ProfileDetail icon={<Mail />} label="Email" value={member.email} />
              <ProfileDetail
                icon={<UserRound />}
                label="Academic profile"
                value={`${member.degree_level} · ${member.department}`}
              />
            </div>
            <div className="flex items-center justify-center gap-3 border-t p-5">
              <SocialLink href={member.instagram_url} label="Instagram">
                <Instagram />
              </SocialLink>
              <SocialLink href={member.facebook_url} label="Facebook">
                <Facebook />
              </SocialLink>
            </div>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

function ProfileDetail({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 rounded-xl bg-muted/60 p-3">
      <span className="mt-0.5 text-primary [&_svg]:h-4 [&_svg]:w-4">{icon}</span>
      <div className="min-w-0">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          {label}
        </p>
        <p className="mt-1 break-words text-sm">{value}</p>
      </div>
    </div>
  );
}

function SocialLink({
  href,
  label,
  children,
}: {
  href: string | null;
  label: string;
  children: ReactNode;
}) {
  if (!href) return null;
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      title={label}
      className="rounded-full border bg-background p-2.5 text-primary transition-all hover:-translate-y-1 hover:bg-primary hover:text-primary-foreground"
    >
      {children}
    </a>
  );
}

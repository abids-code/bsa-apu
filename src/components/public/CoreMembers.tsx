import { Instagram } from "lucide-react";
import { motion } from "framer-motion";
import type { ReactNode } from "react";

type CoreMember = {
  id: string;
  name: string;
  role: string;
  instagram_handle: string | null;
  image_url: string | null;
};

export function CoreMembers({ members }: { members: CoreMember[] }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {members.length ? (
        members.map((member, index) => (
          <motion.article
            key={member.id}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ delay: index * 0.08, duration: 0.45 }}
            whileHover={{ y: -5 }}
            className="group relative overflow-hidden rounded-2xl border border-border/70 bg-card/80 p-5 text-center shadow-sm backdrop-blur transition-shadow hover:shadow-xl"
          >
            <div className="absolute inset-x-0 top-0 h-1 bg-primary/70 transition-all group-hover:h-1.5" />
            {member.image_url ? (
              <img
                src={member.image_url}
                alt={member.name}
                className="mx-auto h-24 w-24 rounded-full object-cover ring-4 ring-primary/15 ring-offset-4 ring-offset-card"
              />
            ) : (
              <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-primary text-4xl text-primary-foreground ring-4 ring-primary/15 ring-offset-4 ring-offset-card">
                {member.name.charAt(0)}
              </div>
            )}
            <span className="mt-5 inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              {member.role}
            </span>
            <h3 className="mt-3 text-lg font-semibold">{member.name}</h3>
            <div className="mt-4 flex justify-center gap-2">
              {member.instagram_handle ? (
                <SocialIcon
                  href={`https://instagram.com/${member.instagram_handle.replace(/^@/, "")}`}
                  label="Instagram"
                >
                  <Instagram />
                </SocialIcon>
              ) : null}
            </div>
          </motion.article>
        ))
      ) : (
        <div className="col-span-full rounded-lg border border-dashed p-10 text-center text-muted-foreground">
          Committee profiles will be announced soon.
        </div>
      )}
    </div>
  );
}

function SocialIcon({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      title={label}
      className="rounded-full border bg-background p-2 text-primary transition-all hover:-translate-y-1 hover:bg-primary hover:text-primary-foreground"
    >
      {children}
    </a>
  );
}

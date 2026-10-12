import { createFileRoute } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const Route = createFileRoute("/_public/bfl")({
  head: () => ({ meta: [{ title: "BFL — APU Bangladesh Football League" }] }),
  component: BFL,
});

function BFL() {
  return (
    <>
      <section className="bg-ink text-ink-foreground">
        <div className="mx-auto max-w-6xl px-5 py-20">
          <Skeleton className="aspect-[21/8] w-full bg-ink-foreground/10" />
          <p className="mt-10 text-sm font-semibold uppercase tracking-[0.3em] text-primary">
            APU Bangladesh Football League
          </p>
          <h1 className="mt-3 text-7xl md:text-9xl">BFL</h1>
          <p className="mt-5 max-w-2xl text-xl text-ink-foreground/75">
            Competitive football, community spirit, and Bangladeshi pride on the pitch.
          </p>
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-5 py-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">
              On the pitch
            </p>
            <h2 className="mt-2 text-5xl">League standings</h2>
          </div>
          <Button asChild>
            <a href="https://www.instagram.com/apubfl/" target="_blank" rel="noreferrer">
              Follow BFL <ArrowUpRight className="h-4 w-4" />
            </a>
          </Button>
        </div>
        <div className="mt-10">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Team</TableHead>
                <TableHead>Played</TableHead>
                <TableHead>Wins</TableHead>
                <TableHead>Points</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[
                "Team standings placeholder",
                "Recent match placeholder",
                "Upcoming fixture placeholder",
              ].map((name, i) => (
                <TableRow key={name}>
                  <TableCell className="font-medium">{name}</TableCell>
                  <TableCell>—</TableCell>
                  <TableCell>—</TableCell>
                  <TableCell>{i === 0 ? "Add live data" : "—"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>
      <section className="bg-muted">
        <div className="mx-auto max-w-6xl px-5 py-20">
          <h2 className="text-5xl">Action gallery</h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 8 }, (_, i) => (
              <Skeleton key={i} className="aspect-[4/3]" />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

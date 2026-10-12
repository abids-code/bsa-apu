import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";

export function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-muted/30 md:grid md:grid-cols-[15rem_1fr]">
      <aside className="border-b bg-card p-5 md:min-h-screen md:border-r md:border-b-0">
        <Link to="/admin" className="block">
          <span className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            BSA APU
          </span>
          <span className="mt-1 block text-lg font-semibold">Admin workspace</span>
        </Link>
        <nav aria-label="Admin navigation" className="mt-6 flex gap-2 md:flex-col">
          <Button variant="secondary" asChild className="justify-start">
            <Link to="/admin">Dashboard</Link>
          </Button>
          <Button variant="ghost" asChild className="justify-start">
            <Link to="/admin/committee">Committee</Link>
          </Button>
          <Button variant="ghost" asChild className="justify-start">
            <Link to="/">View public website</Link>
          </Button>
        </nav>
      </aside>
      <main className="min-w-0 px-4 py-8 sm:px-6 lg:px-10">{children}</main>
    </div>
  );
}

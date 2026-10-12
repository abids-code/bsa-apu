import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { AdminLogin } from "@/components/admin/AdminLogin";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminEvents } from "@/components/admin/AdminEvents";
import { AdminGallery } from "@/components/admin/AdminGallery";
import { AdminMessages } from "@/components/admin/AdminMessages";
import { AdminNews } from "@/components/admin/AdminNews";
import { useAuth } from "@/lib/use-auth";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/_admin/admin")({
  head: () => ({
    meta: [{ title: "Admin — BSA APU" }, { name: "robots", content: "noindex, nofollow" }],
  }),
  component: Admin,
});

function Admin() {
  const { user, isAdmin, loading, error } = useAuth();
  const [signOutError, setSignOutError] = useState<string | null>(null);
  const [signingOut, setSigningOut] = useState(false);

  async function handleSignOut() {
    if (!supabase) return;
    setSigningOut(true);
    setSignOutError(null);

    try {
      const { error: authError } = await supabase.auth.signOut();
      if (authError) setSignOutError(authError.message);
    } catch (error) {
      setSignOutError(error instanceof Error ? error.message : "Could not sign out.");
    } finally {
      setSigningOut(false);
    }
  }

  return (
    <section className="mx-auto flex min-h-[60vh] max-w-6xl items-center justify-center px-5 py-20">
      {loading ? (
        <p role="status" className="text-muted-foreground">
          Checking administrator access...
        </p>
      ) : isAdmin && user ? (
        <div className="w-full space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-primary">BSA APU</p>
              <h1 className="mt-2 text-5xl">Welcome to Admin Dashboard</h1>
              <p className="mt-2 text-muted-foreground">Signed in as {user.email}.</p>
            </div>
            <Button type="button" variant="outline" onClick={handleSignOut} disabled={signingOut}>
              {signingOut ? "Signing out..." : "Sign Out"}
            </Button>
          </div>
          {signOutError && (
            <p role="alert" className="text-sm text-destructive">
              {signOutError}
            </p>
          )}
          <Tabs defaultValue="events" className="space-y-4">
            <TabsList className="grid h-auto w-full grid-cols-2 sm:grid-cols-4">
              <TabsTrigger value="events">Events</TabsTrigger>
              <TabsTrigger value="news">News</TabsTrigger>
              <TabsTrigger value="gallery">Gallery</TabsTrigger>
              <TabsTrigger value="messages">Messages</TabsTrigger>
            </TabsList>
            <TabsContent value="events">
              <Card>
                <CardHeader>
                  <CardTitle>Events</CardTitle>
                </CardHeader>
                <CardContent>
                  <AdminEvents />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="news">
              <Card>
                <CardHeader>
                  <CardTitle>News</CardTitle>
                </CardHeader>
                <CardContent>
                  <AdminNews />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="gallery">
              <Card>
                <CardHeader>
                  <CardTitle>Gallery</CardTitle>
                </CardHeader>
                <CardContent>
                  <AdminGallery />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="messages">
              <Card>
                <CardHeader>
                  <CardTitle>Messages</CardTitle>
                </CardHeader>
                <CardContent>
                  <AdminMessages />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      ) : (
        <AdminLogin
          message={error ?? (user ? "This account does not have administrator access." : null)}
        />
      )}
    </section>
  );
}

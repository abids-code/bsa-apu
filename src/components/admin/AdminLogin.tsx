import { useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase";

export function AdminLogin({ message }: { message?: string | null }) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);

    if (!supabase) {
      setErrorMessage("Supabase is not configured.");
      return;
    }

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");

    setSubmitting(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setErrorMessage(error.message);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Could not sign in.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Admin login</CardTitle>
        <CardDescription>Sign in with an authorized BSA administrator account.</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="admin-email">Email</Label>
            <Input id="admin-email" name="email" type="email" autoComplete="username" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="admin-password">Password</Label>
            <Input
              id="admin-password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
            />
          </div>
          {(errorMessage || message) && (
            <p role="alert" className="text-sm text-destructive">
              {errorMessage ?? message}
            </p>
          )}
          <Button type="submit" disabled={submitting} className="w-full">
            {submitting ? "Signing in..." : "Sign in"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

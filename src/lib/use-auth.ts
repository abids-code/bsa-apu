import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";

import { supabase } from "@/lib/supabase";

type AuthState = {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  error: string | null;
};

const initialState: AuthState = {
  user: null,
  isAdmin: false,
  loading: true,
  error: null,
};

export function useAuth(): AuthState {
  const [auth, setAuth] = useState(initialState);

  useEffect(() => {
    const client = supabase;
    if (!client) {
      setAuth({
        user: null,
        isAdmin: false,
        loading: false,
        error: "Supabase is not configured.",
      });
      return;
    }

    let active = true;
    let requestId = 0;

    async function updateSession(user: User | null) {
      if (!client) return;
      const currentRequest = ++requestId;

      if (!user) {
        if (active) {
          setAuth({ user: null, isAdmin: false, loading: false, error: null });
        }
        return;
      }

      if (active) {
        setAuth({ user, isAdmin: false, loading: true, error: null });
      }

      const { data, error } = await client
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .maybeSingle();

      if (!active || currentRequest !== requestId) return;

      if (error) {
        setAuth({
          user,
          isAdmin: false,
          loading: false,
          error: `Could not verify your admin role: ${error.message}`,
        });
        return;
      }

      setAuth({
        user,
        isAdmin: data?.role === "admin",
        loading: false,
        error: null,
      });
    }

    const {
      data: { subscription },
    } = client.auth.onAuthStateChange((_event, session) => {
      queueMicrotask(() => {
        if (active) void updateSession(session?.user ?? null);
      });
    });

    void client.auth
      .getSession()
      .then(({ data, error }) => {
        if (!active) return;
        if (error) {
          setAuth({ user: null, isAdmin: false, loading: false, error: error.message });
          return;
        }
        void updateSession(data.session?.user ?? null);
      })
      .catch((error: unknown) => {
        if (!active) return;
        setAuth({
          user: null,
          isAdmin: false,
          loading: false,
          error: error instanceof Error ? error.message : "Could not restore your session.",
        });
      });

    return () => {
      active = false;
      requestId += 1;
      subscription.unsubscribe();
    };
  }, []);

  return auth;
}

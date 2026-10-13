import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

const escapeHtml = (value: string) =>
  value.replace(
    /[&<>"']/g,
    (character) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" })[character] ??
      character,
  );

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const resendKey = Deno.env.get("RESEND_API_KEY");
    const fromEmail = Deno.env.get("BSA_FROM_EMAIL");
    const siteUrl = Deno.env.get("PUBLIC_SITE_URL") ?? "https://bsa-apu.org";
    if (!supabaseUrl || !anonKey || !serviceRoleKey || !resendKey || !fromEmail) {
      return json({ error: "Email service is not configured." }, 500);
    }

    const authHeader = request.headers.get("Authorization");
    if (!authHeader) return json({ error: "Authorization is required." }, 401);
    const authClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: isAdmin, error: adminError } = await authClient.rpc("is_admin");
    if (adminError || !isAdmin) return json({ error: "Administrator access is required." }, 403);

    const { member_id, status, reason } = await request.json();
    if (!member_id || !["approved", "declined"].includes(status)) {
      return json({ error: "A valid member ID and status are required." }, 400);
    }

    const adminClient = createClient(supabaseUrl, serviceRoleKey);
    const { data: member, error: memberError } = await adminClient
      .from("members")
      .select("name, email")
      .eq("id", member_id)
      .single();
    if (memberError || !member) return json({ error: "Member application was not found." }, 404);

    const declineReason = escapeHtml(String(reason ?? "").trim());
    const subject =
      status === "approved" ? "Welcome to BSA APU!" : "Update on your BSA APU application";
    const html =
      status === "approved"
        ? `<p>Dear ${member.name},</p><p>Welcome to the Bangladeshi Students Association at APU. Your membership has been approved.</p><p>We look forward to seeing you at our next event.</p><p>Best regards,<br>BSA APU</p>`
        : `<p>Dear ${member.name},</p><p>Thank you for applying to join BSA APU. We could not approve your application at this time.</p><p><strong>Reason:</strong> ${declineReason || "Please review your application details."}</p><p>Please apply again: <a href="${siteUrl}/join">${siteUrl}/join</a></p><p>Best regards,<br>BSA APU</p>`;

    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: fromEmail, to: [member.email], subject, html }),
    });
    if (!resendResponse.ok) {
      const details = await resendResponse.text();
      return json({ error: `Resend rejected the email: ${details}` }, 502);
    }
    return json({ sent: true });
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : "Could not send email." }, 500);
  }
});

import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req: Request) => {
  // ✅ Preflight CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return new Response("Invalid JSON", {
      status: 400,
      headers: corsHeaders,
    });
  }

  const { ticket_id, new_status } = body;

  if (!ticket_id || !new_status) {
    return new Response("Missing parameters", {
      status: 400,
      headers: corsHeaders,
    });
  }

  // 🔑 Supabase client (service role)
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  // 🔍 Buscar ticket
  const { data: ticket, error: fetchError } = await supabase
    .from("tickets")
    .select("*")
    .eq("id", ticket_id)
    .single();

  if (fetchError || !ticket) {
    return new Response("Ticket not found", {
      status: 404,
      headers: corsHeaders,
    });
  }

  // ✏️ Actualizar estado
  const { error: updateError } = await supabase
    .from("tickets")
    .update({ status: new_status })
    .eq("id", ticket_id);

  if (updateError) {
    return new Response("Update failed", {
      status: 500,
      headers: corsHeaders,
    });
  }

  // 🚫 Si no hay email, no mandamos mail (pero el update ya está hecho)
  if (!ticket.email) {
    return new Response(
      JSON.stringify({ success: true, message: "Updated, no email" }),
      { status: 200, headers: corsHeaders }
    );
  }

  // ✉️ Enviar mail con Resend
  const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

  if (!RESEND_API_KEY) {
    return new Response("Missing RESEND_API_KEY", {
      status: 500,
      headers: corsHeaders,
    });
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "TECHFIX <noreply@techfix.ar>", // ✅ tu dominio
      to: ticket.email,
      subject: `Actualización de ticket – ${ticket.ticket_code}`,
      html: `
        <h2>Tu ticket fue actualizado</h2>
        <p><strong>Código:</strong> ${ticket.ticket_code}</p>
        <p><strong>Nuevo estado:</strong> ${new_status}</p>
        <p>Ante cualquier duda podés responder este mail.</p>
      `,
    }),
  });

  const data = await res.json();

  return new Response(JSON.stringify({ success: true, data }), {
    status: 200,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
  });
});
/* Kriaat Hub — Supabase é o banco principal de leads (server-side only, service_role key). */
import type { InsertLead } from "../drizzle/schema";

function getSupabaseConfig() {
  const url = process.env.SUPABASE_URL?.replace(/\/+$/, "");
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRoleKey) return null;
  return { url, serviceRoleKey };
}

export function isSupabaseConfigured(): boolean {
  return getSupabaseConfig() !== null;
}

export async function createLeadInSupabase(lead: InsertLead): Promise<{ id: number }> {
  const config = getSupabaseConfig();
  if (!config) {
    throw new Error(
      "Supabase não está configurado: defina SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY nas variáveis de ambiente."
    );
  }

  const response = await fetch(`${config.url}/rest/v1/kriaat_hub_leads`, {
    method: "POST",
    headers: {
      apikey: config.serviceRoleKey,
      Authorization: `Bearer ${config.serviceRoleKey}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
    },
    body: JSON.stringify({
      name: lead.name,
      phone: lead.phone,
      business: lead.business,
      city: lead.city,
      invests: lead.invests,
      objective: lead.objective,
      budget: lead.budget,
      source: lead.source,
      page: lead.page,
      utm_source: lead.utmSource,
      utm_medium: lead.utmMedium,
      utm_campaign: lead.utmCampaign,
      utm_content: lead.utmContent,
      consent: Boolean(lead.consent),
      created_at: lead.createdAt instanceof Date ? lead.createdAt.toISOString() : undefined,
    }),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(`Falha ao gravar lead no Supabase (${response.status}): ${detail.slice(0, 200)}`);
  }

  const rows = (await response.json()) as Array<{ id: number }>;
  const inserted = rows[0];
  if (!inserted) {
    throw new Error("Supabase não retornou o registro inserido.");
  }
  return { id: inserted.id };
}

export async function notifyLeadByEmail(lead: InsertLead): Promise<void> {
  const config = getSupabaseConfig();
  if (!config) return;

  const response = await fetch(`${config.url}/functions/v1/notify-kriaat-lead`, {
    method: "POST",
    headers: {
      apikey: config.serviceRoleKey,
      Authorization: `Bearer ${config.serviceRoleKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: lead.name,
      phone: lead.phone,
      business: lead.business,
      objective: lead.objective,
      invests: lead.invests,
      budget: lead.budget,
      page: lead.page,
    }),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(`Falha ao enviar notificação do lead (${response.status}): ${detail.slice(0, 200)}`);
  }
}

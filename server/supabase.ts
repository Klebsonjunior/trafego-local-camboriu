/* Kriaat Hub — ponte server-side opcional para sincronizar leads com uma tabela pública do Supabase. */
import type { InsertLead } from "../drizzle/schema";

function getSupabaseConfig() {
  const url = process.env.SUPABASE_URL?.replace(/\/+$/, "");
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRoleKey) return null;
  return { url, serviceRoleKey };
}

export async function syncLeadToSupabase(lead: InsertLead): Promise<boolean> {
  const config = getSupabaseConfig();
  if (!config) return false;

  const response = await fetch(`${config.url}/rest/v1/leads`, {
    method: "POST",
    headers: {
      apikey: config.serviceRoleKey,
      Authorization: `Bearer ${config.serviceRoleKey}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
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
    throw new Error(`Supabase lead sync failed (${response.status}): ${detail.slice(0, 200)}`);
  }

  return true;
}

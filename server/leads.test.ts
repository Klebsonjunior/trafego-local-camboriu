import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import { syncLeadToSupabase } from "./supabase";
import type { TrpcContext } from "./_core/context";

function createPublicContext(): TrpcContext {
  return {
    user: undefined,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("leads.create", () => {
  it("rejects an incomplete lead before attempting persistence", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    await expect(caller.leads.create({
      name: "A",
      phone: "47999999999",
      business: "Meu negócio",
      city: "Camboriú",
      invests: "Ainda não",
      objective: "Receber mais conversas",
      budget: "Até R$ 1.000",
      consent: true,
    })).rejects.toMatchObject({ code: "BAD_REQUEST" });
  });
});

describe("supabase lead bridge", () => {
  it("does not make an external request without server credentials", async () => {
    const originalUrl = process.env.SUPABASE_URL;
    const originalKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    delete process.env.SUPABASE_URL;
    delete process.env.SUPABASE_SERVICE_ROLE_KEY;
    await expect(syncLeadToSupabase({} as never)).resolves.toBe(false);
    if (originalUrl) process.env.SUPABASE_URL = originalUrl;
    if (originalKey) process.env.SUPABASE_SERVICE_ROLE_KEY = originalKey;
  });
});

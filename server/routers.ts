import { COOKIE_NAME } from "@shared/const";
import { createLead } from "./db";
import { z } from "zod";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),
  leads: router({
    create: publicProcedure
      .input(z.object({
        name: z.string().trim().min(2).max(160),
        phone: z.string().trim().min(8).max(40),
        business: z.string().trim().min(2).max(180),
        city: z.string().trim().max(160).optional(),
        invests: z.string().trim().min(2).max(120),
        objective: z.string().trim().min(2).max(160),
        budget: z.string().trim().min(2).max(120),
        source: z.string().trim().max(120).optional(),
        page: z.string().trim().max(255).optional(),
        utmSource: z.string().trim().max(160).optional(),
        utmMedium: z.string().trim().max(160).optional(),
        utmCampaign: z.string().trim().max(160).optional(),
        utmContent: z.string().trim().max(160).optional(),
        consent: z.literal(true),
        createdAt: z.string().datetime(),
      }))
      .mutation(async ({ input }) => {
        const lead = await createLead({
          ...input,
          city: input.city ?? "",
          source: input.source || "kriaat-trafego-pago",
          consent: 1,
          createdAt: new Date(input.createdAt),
        });
        return { success: true, leadId: lead.id } as const;
      }),
  }),

  // TODO: add feature routers here, e.g.
  // todo: router({
  //   list: protectedProcedure.query(({ ctx }) =>
  //     db.getUserTodos(ctx.user.id)
  //   ),
  // }),
});

export type AppRouter = typeof appRouter;

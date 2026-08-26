import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { createPilotInterest } from "./db";

export const pilotInterestInput = z.object({
  name: z.string().trim().min(2).max(160),
  organisation: z.string().trim().min(2).max(240),
  email: z.string().trim().email().max(320),
});

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),
  pilot: router({
    create: publicProcedure.input(pilotInterestInput).mutation(async ({ input }) => {
      await createPilotInterest(input);
      return { success: true } as const;
    }),
  }),
});

export type AppRouter = typeof appRouter;

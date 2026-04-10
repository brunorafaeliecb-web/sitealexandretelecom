import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { adminRouter } from "./routers/admin";
import { twoFactorRouter, editHistoryRouter } from "./routers/twoFactor";
import { contentRouter } from "./routers/content";
import { viacepRouter } from "./routers/viacep";
import { contactRouter } from "./routers/contact";
import { analyticsRouter } from "./routers/analytics";
import { planNotificationsRouter } from "./routers/planNotifications";
import { initializationRouter } from "./routers/initialization";
import { settingsRouter } from "./routers/settings";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  admin: adminRouter,
  twoFactor: twoFactorRouter,
  editHistory: editHistoryRouter,
  content: contentRouter,
  viacep: viacepRouter,
  contact: contactRouter,
  analytics: analyticsRouter,
  planNotifications: planNotificationsRouter,
  initialization: initializationRouter,
  settings: settingsRouter,
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

  // TODO: add feature routers here
});

export type AppRouter = typeof appRouter;

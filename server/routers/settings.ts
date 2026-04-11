import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { siteSettings } from "../../drizzle/schema";
import { eq } from "drizzle-orm";

export const settingsRouter = router({
  getWhatsApp: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) throw new Error("Database not available");
    const setting = await db.select().from(siteSettings).where(eq(siteSettings.section, "whatsapp_config")).limit(1);
    
    // Configurações padrão com o redirecionador IaBrasilguard
    const defaultData = {
      phoneNumber: "5521986961362",
      redirectorUrl: "https://brasilguard.com.br", // Link que você quer no botão
      defaultMessage: "Olá, vim através da IaBrasilguard!",
      buttons: {
        hero: "Falar com IaBrasilguard",
        plans: "Ver Planos",
        celular: "Planos de Celular",
        streaming: "Streaming",
      },
    };

    return setting.length > 0 && setting[0].content ? { ...defaultData, ...(setting[0].content as any) } : defaultData;
  }),

  updateWhatsApp: protectedProcedure
    .input(z.object({
      phoneNumber: z.string(),
      redirectorUrl: z.string().url(), // Valida se é um link real
      defaultMessage: z.string(),
      buttons: z.record(z.string(), z.string()),
    }))
    .mutation(async ({ input, ctx }) => {
      if (ctx.user?.role !== "admin") throw new Error("Não autorizado");
      const db = await getDb();
      const existing = await db.select().from(siteSettings).where(eq(siteSettings.section, "whatsapp_config")).limit(1);
      
      if (existing.length > 0) {
        await db.update(siteSettings).set({ content: input, updatedBy: ctx.user.id, updatedAt: new Date() }).where(eq(siteSettings.section, "whatsapp_config"));
      } else {
        await db.insert(siteSettings).values({ section: "whatsapp_config", content: input as any, updatedBy: ctx.user.id });
      }
      return { success: true };
    }),
});

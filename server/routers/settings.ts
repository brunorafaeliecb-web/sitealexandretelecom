import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { siteSettings } from "../../drizzle/schema";
import { eq } from "drizzle-orm";

export const settingsRouter = router({
  // Get WhatsApp settings
  getWhatsApp: publicProcedure.query(async () => {

    const db = await getDb();
    if (!db) throw new Error("Database not available");

    const setting = await db
      .select()
      .from(siteSettings)
      .where(eq(siteSettings.section, "whatsapp_config"))
      .limit(1);

    if (setting.length > 0 && setting[0].content) {
      return setting[0].content;
    }

    // Retornar padrão
    return {
      phoneNumber: "5521986961362",
      defaultMessage: "Vim através do site de telecom do Alexandre",
      buttons: {
        hero: "Vim através do site de telecom do Alexandre",
        plans: "Quero contratar um plano de internet",
        celular: "Quero contratar um plano de celular",
        streaming: "Quero informações sobre streaming",
      },
    };
  }),

  // Update WhatsApp settings
  updateWhatsApp: protectedProcedure
    .input(
      z.object({
        phoneNumber: z.string(),
        defaultMessage: z.string(),
        buttons: z.record(z.string(), z.string()),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (ctx.user?.role !== "admin") {
        throw new Error("Apenas admins podem atualizar configurações");
      }

      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const existing = await db
        .select()
        .from(siteSettings)
        .where(eq(siteSettings.section, "whatsapp_config"))
        .limit(1);

      if (existing.length > 0) {
        await db
          .update(siteSettings)
          .set({
            content: input,
            updatedBy: ctx.user.id,
            updatedAt: new Date(),
          })
          .where(eq(siteSettings.section, "whatsapp_config"));
      } else {
        await db.insert(siteSettings).values({
          section: "whatsapp_config",
          content: input as any,
          updatedBy: ctx.user.id,
        });
      }

      return { success: true };
    }),

  // Get contact email settings
  getContactEmail: publicProcedure.query(async () => {

    const db = await getDb();
    if (!db) throw new Error("Database not available");

    const setting = await db
      .select()
      .from(siteSettings)
      .where(eq(siteSettings.section, "contact_email"))
      .limit(1);

    if (setting.length > 0 && setting[0].content) {
      return setting[0].content;
    }

    // Retornar padrão
    return {
      email: process.env.ADMIN_EMAIL || "admin@melhoresplanos.net",
      subject: "Nova mensagem de contato - MelhoresPlanos.net",
    };
  }),

  // Update contact email settings
  updateContactEmail: protectedProcedure
    .input(
      z.object({
        email: z.string().email(),
        subject: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (ctx.user?.role !== "admin") {
        throw new Error("Apenas admins podem atualizar configurações");
      }

      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const existing = await db
        .select()
        .from(siteSettings)
        .where(eq(siteSettings.section, "contact_email"))
        .limit(1);

      if (existing.length > 0) {
        await db
          .update(siteSettings)
          .set({
            content: input,
            updatedBy: ctx.user.id,
            updatedAt: new Date(),
          })
          .where(eq(siteSettings.section, "contact_email"));
      } else {
        await db.insert(siteSettings).values({
          section: "contact_email",
          content: input as any,
          updatedBy: ctx.user.id,
        });
      }

      return { success: true };
    }),
});

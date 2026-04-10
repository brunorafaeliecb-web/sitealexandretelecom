import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";
import { notifyOwner } from "../_core/notification";

/**
 * Router para gerenciar notificações de novos planos por região
 * Usuários podem se inscrever para receber alertas quando novos planos chegam em sua região
 */
export const planNotificationsRouter = router({
  /**
   * Inscrever usuário para notificações de novos planos em uma região
   */
  subscribeToRegion: protectedProcedure
    .input(
      z.object({
        region: z.string().min(1, "Região é obrigatória"),
        state: z.string().min(2, "Estado é obrigatório"),
        email: z.string().email("Email inválido"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        // Simular salvamento de inscrição
        // Em produção, isso seria salvo em uma tabela de subscriptions
        console.log(`[Notifications] User ${ctx.user?.email} subscribed to ${input.region}, ${input.state}`);

        // Notificar admin sobre nova inscrição
        await notifyOwner({
          title: "Nova Inscrição de Notificações",
          content: `${ctx.user?.name} se inscreveu para receber notificações de planos em ${input.region}, ${input.state}`,
        });

        return {
          success: true,
          message: `Você será notificado sobre novos planos em ${input.region}`,
        };
      } catch (error) {
        console.error("[Notifications] Error subscribing to region:", error);
        throw new Error("Erro ao se inscrever para notificações");
      }
    }),

  /**
   * Desinscrever usuário de notificações
   */
  unsubscribeFromRegion: protectedProcedure
    .input(
      z.object({
        region: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        console.log(`[Notifications] User ${ctx.user?.email} unsubscribed from ${input.region}`);

        return {
          success: true,
          message: `Você foi desinscrito de notificações em ${input.region}`,
        };
      } catch (error) {
        console.error("[Notifications] Error unsubscribing:", error);
        throw new Error("Erro ao desinscrever");
      }
    }),

  /**
   * Notificar usuários sobre novo plano em uma região
   * Apenas admins podem usar
   */
  notifyNewPlan: protectedProcedure
    .input(
      z.object({
        region: z.string(),
        provider: z.string(),
        planName: z.string(),
        speed: z.string(),
        price: z.number(),
        message: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.user?.role !== "admin") {
        throw new Error("Apenas admins podem enviar notificações");
      }

      try {
        // Simular envio de notificações
        console.log(`[Notifications] Sending notification for new plan in ${input.region}`);

        const notificationMessage = input.message || `Novo plano disponível: ${input.provider} - ${input.planName} (${input.speed}) por R$ ${input.price}/mês`;

        // Notificar admin que notificações foram enviadas
        await notifyOwner({
          title: "Notificações de Novo Plano Enviadas",
          content: `Notificação enviada para usuários em ${input.region}: ${notificationMessage}`,
        });

        return {
          success: true,
          message: "Notificações enviadas com sucesso",
          region: input.region,
          notificationsSent: 42, // Simular número de usuários notificados
        };
      } catch (error) {
        console.error("[Notifications] Error sending notifications:", error);
        throw new Error("Erro ao enviar notificações");
      }
    }),

  /**
   * Obter regiões com mais interesse (baseado em buscas por CEP)
   */
  getTopRegions: publicProcedure.query(async () => {
    try {
      // Simular dados de regiões com mais interesse
      const topRegions = [
        { region: "Sudeste", searches: 1250, state: "SP" },
        { region: "Nordeste", searches: 890, state: "BA" },
        { region: "Sul", searches: 650, state: "RS" },
        { region: "Centro-Oeste", searches: 420, state: "DF" },
        { region: "Norte", searches: 310, state: "AM" },
      ];

      return topRegions;
    } catch (error) {
      console.error("[Notifications] Error getting top regions:", error);
      throw new Error("Erro ao obter regiões");
    }
  }),
});

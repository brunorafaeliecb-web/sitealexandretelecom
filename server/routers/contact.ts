import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import { sendContactEmail, sendContactConfirmationEmail } from "../contact-service";

export const contactRouter = router({
  /**
   * Enviar formulário de contato
   * Valida dados e envia emails para o admin e usuário
   */
  sendMessage: publicProcedure
    .input(
      z.object({
        name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
        email: z.string().email("Email inválido"),
        phone: z.string().optional(),
        subject: z.string().min(5, "Assunto deve ter pelo menos 5 caracteres"),
        message: z.string().min(10, "Mensagem deve ter pelo menos 10 caracteres"),
      })
    )
    .mutation(async ({ input }) => {
      try {
        // Enviar email para o admin
        const adminEmailSent = await sendContactEmail({
          name: input.name,
          email: input.email,
          phone: input.phone,
          subject: input.subject,
          message: input.message,
        });

        if (!adminEmailSent) {
          return {
            success: false,
            error: "Erro ao enviar mensagem. Tente novamente mais tarde.",
          };
        }

        // Enviar email de confirmação para o usuário
        const confirmationSent = await sendContactConfirmationEmail(
          input.email,
          input.name
        );

        if (!confirmationSent) {
          console.warn("[Contact] Confirmation email failed but admin email was sent");
        }

        return {
          success: true,
          message: "Mensagem enviada com sucesso! Você receberá uma confirmação por email.",
        };
      } catch (error) {
        console.error("[Contact Router] Error:", error);
        return {
          success: false,
          error: "Erro ao processar sua mensagem. Tente novamente.",
        };
      }
    }),
});

import { trpc } from "@/lib/trpc";

/**
 * Hook para obter configurações de WhatsApp do admin
 * Retorna número de telefone, mensagem padrão e mensagens por botão
 */
export function useWhatsAppSettings() {
  const { data, isLoading, error } = trpc.settings.getWhatsApp.useQuery();

  const whatsappSettings = (data as any) || {
    phoneNumber: "5521986961362",
    defaultMessage: "Vim através do site de telecom do Ricardo",
    buttons: {
      hero: "Vim através do site de telecom do Ricardo",
      plans: "Quero contratar um plano de internet",
      celular: "Quero contratar um plano de celular",
      streaming: "Quero informações sobre streaming",
    },
  };

  /**
   * Gera URL de WhatsApp com mensagem codificada
   * @param buttonType - Tipo de botão (hero, plans, celular, streaming)
   * @returns URL completa para wa.me
   */
  const getWhatsAppUrl = (buttonType: string = "default"): string => {
    const message = whatsappSettings.buttons?.[buttonType] || whatsappSettings.defaultMessage;
    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/${whatsappSettings.phoneNumber}?text=${encodedMessage}`;
  };

  return {
    phoneNumber: whatsappSettings.phoneNumber,
    defaultMessage: whatsappSettings.defaultMessage,
    buttons: whatsappSettings.buttons,
    getWhatsAppUrl,
    isLoading,
    error,
  };
}

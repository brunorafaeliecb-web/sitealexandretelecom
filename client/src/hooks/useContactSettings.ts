import { trpc } from "@/lib/trpc";

/**
 * Hook para obter configurações de contato do admin
 * Retorna email de contato configurado
 */
export function useContactSettings() {
  const { data, isLoading, error } = trpc.settings.getContactEmail.useQuery();

  const contactSettings = (data as any) || {
    email: "contato@melhoresplanos.net",
    subject: "Nova mensagem de contato - MelhoresPlanos.net",
  };

  return {
    email: contactSettings.email,
    subject: contactSettings.subject,
    isLoading,
    error,
  };
}

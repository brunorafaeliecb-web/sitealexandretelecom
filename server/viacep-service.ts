import { z } from "zod";

/**
 * ViaCEP API Service
 * Integração com API pública ViaCEP para buscar dados de endereço por CEP
 * API: https://viacep.com.br/
 */

const ViaCEPResponseSchema = z.object({
  cep: z.string(),
  logradouro: z.string(),
  complemento: z.string().optional(),
  unidade: z.string().optional(),
  bairro: z.string(),
  localidade: z.string(),
  uf: z.string(),
  estado: z.string().optional(),
  regiao: z.string().optional(),
  ibge: z.string().optional(),
  gia: z.string().optional(),
  ddd: z.string().optional(),
  siafi: z.string().optional(),
  erro: z.boolean().optional(),
});

export type ViaCEPResponse = z.infer<typeof ViaCEPResponseSchema>;

/**
 * Buscar dados de endereço por CEP
 * @param cep - CEP sem formatação (apenas números)
 * @returns Dados do endereço ou erro
 */
export async function fetchAddressByCEP(cep: string): Promise<ViaCEPResponse | null> {
  try {
    // Remove caracteres não numéricos
    const cleanCEP = cep.replace(/\D/g, "");

    // Valida se tem 8 dígitos
    if (cleanCEP.length !== 8) {
      throw new Error("CEP deve conter 8 dígitos");
    }

    const url = `https://viacep.com.br/ws/${cleanCEP}/json/`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      console.error(`[ViaCEP] HTTP Error: ${response.status}`);
      return null;
    }

    const data = await response.json();

    // Verifica se retornou erro (CEP não encontrado)
    if (data.erro) {
      console.warn(`[ViaCEP] CEP não encontrado: ${cleanCEP}`);
      return null;
    }

    // Valida resposta
    const validated = ViaCEPResponseSchema.parse(data);
    return validated;
  } catch (error) {
    console.error("[ViaCEP] Error fetching address:", error);
    return null;
  }
}

/**
 * Formatar CEP para exibição (XX.XXX-XXX)
 */
export function formatCEP(cep: string): string {
  const clean = cep.replace(/\D/g, "");
  if (clean.length !== 8) return cep;
  return `${clean.slice(0, 2)}.${clean.slice(2, 5)}-${clean.slice(5)}`;
}

/**
 * Validar formato de CEP
 */
export function isValidCEP(cep: string): boolean {
  const clean = cep.replace(/\D/g, "");
  return clean.length === 8;
}

/**
 * Extrair estado (UF) do CEP para filtrar planos por região
 */
export function getStateFromCEP(address: ViaCEPResponse): string {
  return address.uf.toUpperCase();
}

/**
 * Extrair cidade do CEP
 */
export function getCityFromCEP(address: ViaCEPResponse): string {
  return address.localidade;
}

import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import { fetchAddressByCEP, formatCEP, isValidCEP } from "../viacep-service";
import { saveCEPSearch } from "../db";

export const viacepRouter = router({
  /**
   * Buscar endereço por CEP
   * Valida CEP e retorna dados de endereço
   */
  getAddressByCEP: publicProcedure
    .input(
      z.object({
        cep: z.string().min(1, "CEP é obrigatório"),
      })
    )
    .query(async ({ input }) => {
      // Valida formato do CEP
      if (!isValidCEP(input.cep)) {
        return {
          success: false,
          error: "CEP inválido. Digite 8 números.",
          data: null,
        };
      }

      // Busca dados no ViaCEP
      const address = await fetchAddressByCEP(input.cep);

      if (!address) {
        return {
          success: false,
          error: "CEP não encontrado. Verifique e tente novamente.",
          data: null,
        };
      }

      // Salva no histórico para análise
      try {
        await saveCEPSearch({
          cep: address.cep,
          logradouro: address.logradouro,
          bairro: address.bairro,
          localidade: address.localidade,
          uf: address.uf,
          regiao: address.regiao || "",
          ddd: address.ddd || "",
          ibge: address.ibge || "",
        });
      } catch (error) {
        console.warn("[ViaCEP] Failed to save search history:", error);
        // Não falha a busca se o histórico não for salvo
      }

      return {
        success: true,
        error: null,
        data: {
          cep: formatCEP(address.cep),
          street: address.logradouro,
          neighborhood: address.bairro,
          city: address.localidade,
          state: address.uf,
          region: address.regiao || "",
          ddd: address.ddd || "",
          complement: address.complemento || "",
        },
      };
    }),

  /**
   * Validar CEP sem buscar dados completos
   * Útil para validação em tempo real
   */
  validateCEP: publicProcedure
    .input(
      z.object({
        cep: z.string(),
      })
    )
    .query(({ input }) => {
      const isValid = isValidCEP(input.cep);
      return {
        isValid,
        formatted: isValid ? formatCEP(input.cep) : input.cep,
      };
    }),
});

import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { initializeDefaultSections } from "../db-content";

/**
 * Router para inicialização de dados padrão
 * Apenas admins podem usar
 */
export const initializationRouter = router({
  /**
   * Inicializar seções de conteúdo padrão
   */
  initializeContentSections: protectedProcedure.mutation(async ({ ctx }) => {
    if (ctx.user?.role !== "admin") {
      throw new Error("Apenas admins podem inicializar conteúdo");
    }

    try {
      const result = await initializeDefaultSections();
      return {
        success: true,
        message: "Seções de conteúdo inicializadas com sucesso",
        sectionsCreated: result,
      };
    } catch (error) {
      console.error("[Initialization] Error initializing sections:", error);
      throw new Error("Erro ao inicializar seções de conteúdo");
    }
  }),
});

import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { getCEPSearchHistory, getCEPSearchByRegion } from "../db";

export const analyticsRouter = router({
  /**
   * Obter estatísticas de buscas por CEP
   * Apenas admins podem acessar
   */
  getCEPSearchStats: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.user?.role !== "admin") {
      throw new Error("Apenas admins podem acessar analytics");
    }

    try {
      const history = await getCEPSearchHistory(1000);

      if (!history || history.length === 0) {
        return {
          totalSearches: 0,
          byRegion: {},
          byState: {},
          topCities: [],
          topRegions: [],
        };
      }

      // Agrupar por região
      const byRegion: Record<string, number> = {};
      const byState: Record<string, number> = {};
      const cityCounts: Record<string, number> = {};

      history.forEach((search) => {
        // Por região
        if (search.regiao) {
          byRegion[search.regiao] = (byRegion[search.regiao] || 0) + 1;
        }

        // Por estado
        if (search.uf) {
          byState[search.uf] = (byState[search.uf] || 0) + 1;
        }

        // Por cidade
        if (search.localidade) {
          cityCounts[search.localidade] = (cityCounts[search.localidade] || 0) + 1;
        }
      });

      // Top 10 cidades
      const topCities = Object.entries(cityCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([city, count]) => ({ city, count }));

      // Top regiões
      const topRegions = Object.entries(byRegion)
        .sort((a, b) => b[1] - a[1])
        .map(([region, count]) => ({ region, count }));

      return {
        totalSearches: history.length,
        byRegion,
        byState,
        topCities,
        topRegions,
      };
    } catch (error) {
      console.error("[Analytics] Error getting CEP stats:", error);
      throw error;
    }
  }),

  /**
   * Obter buscas por região específica
   */
  getSearchesByRegion: protectedProcedure
    .input(z.object({ regiao: z.string() }))
    .query(async ({ ctx, input }) => {
      if (ctx.user?.role !== "admin") {
        throw new Error("Apenas admins podem acessar analytics");
      }

      try {
        const searches = await getCEPSearchByRegion(input.regiao);
        return {
          region: input.regiao,
          totalSearches: searches.length,
          searches,
        };
      } catch (error) {
        console.error("[Analytics] Error getting searches by region:", error);
        throw error;
      }
    }),

  /**
   * Obter tendências de buscas (últimas 24h, 7d, 30d)
   */
  getTrends: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.user?.role !== "admin") {
      throw new Error("Apenas admins podem acessar analytics");
    }

    try {
      const history = await getCEPSearchHistory(1000);

      if (!history || history.length === 0) {
        return {
          last24h: 0,
          last7d: 0,
          last30d: 0,
          growth: 0,
        };
      }

      const now = new Date();
      const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      const last7d = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const last30d = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

      const count24h = history.filter((h) => new Date(h.createdAt) > last24h).length;
      const count7d = history.filter((h) => new Date(h.createdAt) > last7d).length;
      const count30d = history.filter((h) => new Date(h.createdAt) > last30d).length;

      // Calcular crescimento (7d vs 30d)
      const growth =
        count30d > 0 ? Math.round(((count7d - count30d / 4) / (count30d / 4)) * 100) : 0;

      return {
        last24h: count24h,
        last7d: count7d,
        last30d: count30d,
        growth,
      };
    } catch (error) {
      console.error("[Analytics] Error getting trends:", error);
      throw error;
    }
  }),
});

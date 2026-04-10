import { useEffect, useState } from "react";
import { trpc } from "@/lib/trpc";
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from "recharts";
import { Loader2, TrendingUp } from "lucide-react";

export default function AnalyticsDashboard() {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

  // Buscar estatísticas
  const statsQuery = trpc.analytics.getCEPSearchStats.useQuery();
  const trendsQuery = trpc.analytics.getTrends.useQuery();
  const regionQuery = trpc.analytics.getSearchesByRegion.useQuery(
    { regiao: selectedRegion || "" },
    { enabled: !!selectedRegion }
  );

  const stats = statsQuery.data;
  const trends = trendsQuery.data;

  if (statsQuery.isLoading || trendsQuery.isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
      </div>
    );
  }

  // Preparar dados para gráficos
  const regionData = stats?.topRegions || [];
  const cityData = stats?.topCities || [];
  const stateData = stats?.byState ? Object.entries(stats.byState).map(([state, count]) => ({ state, count })) : [];

  const COLORS = ["#00D4E8", "#A855F7", "#06B6D4", "#8B5CF6", "#0891B2", "#7C3AED"];

  return (
    <div className="space-y-8">
      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white/10 border border-white/20 rounded-lg p-6">
          <p className="text-gray-400 text-sm mb-2">Total de Buscas</p>
          <p className="text-3xl font-bold text-white">{stats?.totalSearches || 0}</p>
        </div>

        <div className="bg-white/10 border border-white/20 rounded-lg p-6">
          <p className="text-gray-400 text-sm mb-2">Últimas 24h</p>
          <p className="text-3xl font-bold text-cyan-400">{trends?.last24h || 0}</p>
        </div>

        <div className="bg-white/10 border border-white/20 rounded-lg p-6">
          <p className="text-gray-400 text-sm mb-2">Últimos 7 dias</p>
          <p className="text-3xl font-bold text-purple-400">{trends?.last7d || 0}</p>
        </div>

        <div className="bg-white/10 border border-white/20 rounded-lg p-6">
          <p className="text-gray-400 text-sm mb-2">Crescimento</p>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-400" />
            <p className="text-3xl font-bold text-green-400">{trends?.growth || 0}%</p>
          </div>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Buscas por Região */}
        <div className="bg-white/5 border border-white/10 rounded-lg p-6">
          <h3 className="text-lg font-bold text-white mb-4">Buscas por Região</h3>
          {regionData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={regionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="region" stroke="rgba(255,255,255,0.5)" />
                <YAxis stroke="rgba(255,255,255,0.5)" />
                <Tooltip
                  contentStyle={{ backgroundColor: "#1E2A4A", border: "1px solid rgba(255,255,255,0.2)" }}
                  labelStyle={{ color: "#fff" }}
                />
                <Bar dataKey="count" fill="#00D4E8" onClick={(data) => setSelectedRegion(data.region)} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-400">Sem dados disponíveis</p>
          )}
        </div>

        {/* Top 10 Cidades */}
        <div className="bg-white/5 border border-white/10 rounded-lg p-6">
          <h3 className="text-lg font-bold text-white mb-4">Top 10 Cidades</h3>
          {cityData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={cityData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis type="number" stroke="rgba(255,255,255,0.5)" />
                <YAxis dataKey="city" type="category" width={100} stroke="rgba(255,255,255,0.5)" />
                <Tooltip
                  contentStyle={{ backgroundColor: "#1E2A4A", border: "1px solid rgba(255,255,255,0.2)" }}
                  labelStyle={{ color: "#fff" }}
                />
                <Bar dataKey="count" fill="#A855F7" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-400">Sem dados disponíveis</p>
          )}
        </div>

        {/* Distribuição por Estado */}
        <div className="bg-white/5 border border-white/10 rounded-lg p-6">
          <h3 className="text-lg font-bold text-white mb-4">Distribuição por Estado</h3>
          {stateData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={stateData}
                  dataKey="count"
                  nameKey="state"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {stateData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: "#1E2A4A", border: "1px solid rgba(255,255,255,0.2)" }}
                  labelStyle={{ color: "#fff" }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-400">Sem dados disponíveis</p>
          )}
        </div>

        {/* Detalhes da Região Selecionada */}
        {selectedRegion && (
          <div className="bg-white/5 border border-white/10 rounded-lg p-6">
            <h3 className="text-lg font-bold text-white mb-4">Detalhes: {selectedRegion}</h3>
            {regionQuery.isLoading ? (
              <Loader2 className="w-6 h-6 animate-spin text-cyan-400" />
            ) : regionQuery.data ? (
              <div className="space-y-3">
                <p className="text-gray-300">
                  <span className="font-semibold">Total de buscas:</span> {regionQuery.data.totalSearches}
                </p>
                <div className="max-h-48 overflow-y-auto space-y-2">
                  {regionQuery.data.searches.slice(0, 10).map((search, idx) => (
                    <div key={idx} className="text-sm text-gray-400 p-2 bg-white/5 rounded">
                      <p>{search.localidade}, {search.uf}</p>
                      <p className="text-xs text-gray-500">{search.cep}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}

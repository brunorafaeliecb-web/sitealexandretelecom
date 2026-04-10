import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Loader2, MapPin } from "lucide-react";

interface Plan {
  id: string;
  provider: string;
  speed: string;
  price: number;
  region: string;
  features: string[];
}

export default function RegionalPlansFilter() {
  const [cep, setCep] = useState("");
  const [filteredPlans, setFilteredPlans] = useState<Plan[]>([]);
  const [searchedRegion, setSearchedRegion] = useState<string | null>(null);

  const cepQuery = trpc.viacep.getAddressByCEP.useQuery(
    { cep },
    { enabled: false }
  );

  const handleSearch = async () => {
    if (!cep || cep.length < 8) {
      alert("Digite um CEP válido com 8 dígitos");
      return;
    }

    const result = await cepQuery.refetch();
    if (result.data?.success && result.data.data) {
      const region = result.data.data.state;
      setSearchedRegion(region);

      // Simular filtro de planos por região
      // Em produção, isso viria de uma API que retorna planos reais
      const mockPlans: Plan[] = [
        {
          id: "1",
          provider: "Claro",
          speed: "600 Mbps",
          price: 49.9,
          region: region,
          features: ["Wi-Fi 6", "Sem fidelidade", "Suporte 24h"],
        },
        {
          id: "2",
          provider: "Vivo",
          speed: "500 Mbps",
          price: 99.9,
          region: region,
          features: ["Roteador incluso", "Streaming bônus", "App Minha Vivo"],
        },
        {
          id: "3",
          provider: "Tim",
          speed: "400 Mbps",
          price: 79.9,
          region: region,
          features: ["Fibra óptica", "IP fixo", "Suporte prioritário"],
        },
      ];

      setFilteredPlans(mockPlans);
    }
  };

  return (
    <div className="space-y-6">
      {/* Busca por CEP */}
      <div className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/30 rounded-lg p-6">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <MapPin className="w-5 h-5" />
          Encontre Planos na Sua Região
        </h3>

        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Digite seu CEP (ex: 01310-100)"
            value={cep}
            onChange={(e) => setCep(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            className="flex-1 px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500"
          />
          <button
            onClick={handleSearch}
            disabled={cepQuery.isLoading}
            className="px-6 py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-semibold hover:shadow-lg transition-all disabled:opacity-50"
          >
            {cepQuery.isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Buscar"}
          </button>
        </div>

        {cepQuery.data?.data && (
          <div className="mt-4 p-4 bg-white/5 rounded-lg border border-white/10">
            <p className="text-gray-300">
              <span className="font-semibold text-cyan-400">{cepQuery.data.data.city}</span>, {cepQuery.data.data.state}
            </p>
            <p className="text-sm text-gray-400">{cepQuery.data.data.street}</p>
          </div>
        )}
      </div>

      {/* Planos Filtrados */}
      {filteredPlans.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-white">
            Planos Disponíveis em {searchedRegion}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPlans.map((plan) => (
              <div
                key={plan.id}
                className="bg-white/5 border border-white/10 rounded-lg p-6 hover:border-cyan-500/50 transition-all"
              >
                <div className="mb-4">
                  <h4 className="text-xl font-bold text-white">{plan.provider}</h4>
                  <p className="text-3xl font-bold text-cyan-400 mt-2">
                    {plan.speed}
                  </p>
                </div>

                <div className="mb-4 p-3 bg-white/5 rounded-lg">
                  <p className="text-gray-400 text-sm">Preço mensal</p>
                  <p className="text-2xl font-bold text-white">
                    R$ {plan.price.toFixed(2)}
                  </p>
                </div>

                <div className="space-y-2 mb-4">
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-gray-300 text-sm">
                      <div className="w-2 h-2 rounded-full bg-cyan-400" />
                      {feature}
                    </div>
                  ))}
                </div>

                <button className="w-full py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-semibold hover:shadow-lg transition-all">
                  Contratar via WhatsApp
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {searchedRegion && filteredPlans.length === 0 && !cepQuery.isLoading && (
        <div className="text-center py-12 text-gray-400">
          <p>Nenhum plano disponível para esta região no momento.</p>
        </div>
      )}
    </div>
  );
}

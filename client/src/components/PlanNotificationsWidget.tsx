import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Bell, MapPin, Check } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";

export default function PlanNotificationsWidget() {
  const { user } = useAuth();
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [subscribed, setSubscribed] = useState(false);

  const topRegionsQuery = trpc.planNotifications.getTopRegions.useQuery();
  const subscribeQuery = trpc.planNotifications.subscribeToRegion.useMutation();

  const handleSubscribe = async (region: string, state: string) => {
    if (!user?.email) {
      alert("Você precisa estar logado para se inscrever");
      return;
    }

    try {
      await subscribeQuery.mutateAsync({
        region,
        state,
        email: user.email,
      });
      setSubscribed(true);
      setSelectedRegion(region);
      setTimeout(() => setSubscribed(false), 3000);
    } catch (error) {
      console.error("Erro ao se inscrever:", error);
      alert("Erro ao se inscrever para notificações");
    }
  };

  const topRegions = topRegionsQuery.data || [];

  return (
    <div className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/30 rounded-lg p-6">
      <div className="flex items-center gap-3 mb-4">
        <Bell className="w-5 h-5 text-cyan-400" />
        <h3 className="text-lg font-bold text-white">Receba Alertas de Novos Planos</h3>
      </div>

      <p className="text-gray-300 mb-4">
        Escolha uma região para receber notificações quando novos planos chegarem:
      </p>

      {topRegionsQuery.isLoading ? (
        <p className="text-gray-400">Carregando regiões...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {topRegions.map((region) => (
            <button
              key={region.region}
              onClick={() => handleSubscribe(region.region, region.state)}
              disabled={subscribeQuery.isPending}
              className="p-3 rounded-lg bg-white/5 border border-white/10 hover:border-cyan-500/50 transition-all text-left disabled:opacity-50"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-white">{region.region}</p>
                  <p className="text-xs text-gray-400">{region.searches} buscas</p>
                </div>
                {selectedRegion === region.region && subscribed ? (
                  <Check className="w-5 h-5 text-green-400" />
                ) : (
                  <MapPin className="w-5 h-5 text-gray-400" />
                )}
              </div>
            </button>
          ))}
        </div>
      )}

      {subscribed && (
        <div className="mt-4 p-3 bg-green-500/20 border border-green-500/50 rounded-lg">
          <p className="text-green-300 text-sm">✓ Inscrição realizada com sucesso! Você receberá notificações sobre novos planos.</p>
        </div>
      )}
    </div>
  );
}

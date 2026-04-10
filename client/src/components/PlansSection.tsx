/* 
  Design: Seção clara (creme) com cards brancos de planos, preços em ciano/roxo
  Slider horizontal com botões de navegação
*/
import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, MessageCircle, Check, Zap, Star } from "lucide-react";
import { useWhatsAppSettings } from "@/hooks/useWhatsAppSettings";

interface Plan {
  id: number;
  provider: string;
  providerColor: string;
  speed: number;
  unit: string;
  price: number;
  originalPrice?: number;
  installFee: string;
  features: string[];
  badge?: string;
  badgeColor?: string;
  recommended?: boolean;
}

const plans: Plan[] = [
  {
    id: 1,
    provider: "Claro",
    providerColor: "#E8001C",
    speed: 600,
    unit: "Mega",
    price: 49.90,
    originalPrice: 99.90,
    installFee: "Grátis",
    features: ["Wi-Fi 6 incluso", "Sem fidelidade", "Suporte 24h"],
    badge: "MELHOR OFERTA",
    badgeColor: "#00D4E8",
    recommended: true
  },
  {
    id: 2,
    provider: "Vivo",
    providerColor: "#660099",
    speed: 500,
    unit: "Mega",
    price: 99.90,
    installFee: "Grátis",
    features: ["Roteador incluso", "Streaming bônus", "App Minha Vivo"],
    badge: "POPULAR",
    badgeColor: "#A855F7"
  },
  {
    id: 3,
    provider: "Tim",
    providerColor: "#003087",
    speed: 400,
    unit: "Mega",
    price: 79.90,
    installFee: "R$ 99,90",
    features: ["Fibra óptica", "IP fixo disponível", "Sem limite de dados"],
  },
  {
    id: 4,
    provider: "Oi",
    providerColor: "#FF6B00",
    speed: 300,
    unit: "Mega",
    price: 59.90,
    installFee: "Grátis",
    features: ["Fibra óptica", "Sem fidelidade", "Instalação expressa"],
    badge: "SEM FIDELIDADE",
    badgeColor: "#10B981"
  },
  {
    id: 5,
    provider: "Desktop",
    providerColor: "#1E2A4A",
    speed: 1000,
    unit: "Mega",
    price: 149.90,
    installFee: "Grátis",
    features: ["1 Gbps simétrico", "IP fixo incluso", "SLA garantido"],
    badge: "ULTRA VELOCIDADE",
    badgeColor: "#FFD700"
  },
  {
    id: 6,
    provider: "Lets Go",
    providerColor: "#00A651",
    speed: 200,
    unit: "Mega",
    price: 44.90,
    installFee: "Grátis",
    features: ["Fibra óptica", "Wi-Fi incluso", "Suporte local"],
    badge: "MAIS BARATO",
    badgeColor: "#10B981"
  },
];

export default function PlansSection() {
  const { getWhatsAppUrl } = useWhatsAppSettings();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hoveredPlanId, setHoveredPlanId] = useState<number | null>(null);
  const visibleCount = 3;
  const startIdx = currentIndex;

  const prev = () => setCurrentIndex(Math.max(0, currentIndex - 1));
  const next = () => setCurrentIndex(Math.min(plans.length - visibleCount, currentIndex + 1));

  const visiblePlans = plans.slice(startIdx, startIdx + visibleCount);

  return (
    <section className="py-16 lg:py-20 bg-[#FAF8F5]" id="internet">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4"
        >
          <div>
            <h2 className="text-3xl lg:text-4xl font-bold text-[#1A1A2E]" style={{ fontFamily: "'Sora', sans-serif" }}>
              Ofertas de{" "}
              <span style={{
                background: "linear-gradient(135deg, #00D4E8 0%, #A855F7 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text"
              }}>
                Internet Residencial
              </span>{" "}
              Exclusivas
            </h2>
            <p className="text-[#6B7280] mt-2" style={{ fontFamily: "'Inter', sans-serif" }}>
              Confira as principais ofertas de internet banda larga no seu endereço
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={prev}
              disabled={startIdx === 0}
              className="w-10 h-10 rounded-full border-2 border-[#E5E0D8] flex items-center justify-center hover:border-[#00D4E8] hover:text-[#00D4E8] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={next}
              disabled={startIdx >= plans.length - visibleCount}
              className="w-10 h-10 rounded-full border-2 border-[#E5E0D8] flex items-center justify-center hover:border-[#00D4E8] hover:text-[#00D4E8] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </motion.div>

        {/* Plans grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {visiblePlans.map((plan, i) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -6 }}
              onMouseEnter={() => setHoveredPlanId(plan.id)}
              onMouseLeave={() => setHoveredPlanId(null)}
              className="relative bg-white rounded-2xl border-2 overflow-hidden transition-all duration-300"
              style={{
                borderColor: plan.recommended ? "#00D4E8" : "#E5E0D8",
                boxShadow: plan.recommended ? "0 8px 32px rgba(0, 212, 232, 0.2)" : "0 2px 12px rgba(0,0,0,0.06)"
              }}
            >
              {/* Badge */}
              {plan.badge && (
                <div className="absolute top-4 right-4">
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full text-white"
                    style={{
                      fontFamily: "'Sora', sans-serif",
                      background: plan.badgeColor || "#00D4E8"
                    }}>
                    {plan.badge}
                  </span>
                </div>
              )}

              <div className="p-6">
                {/* Provider */}
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white text-sm"
                    style={{ background: plan.providerColor, fontFamily: "'Sora', sans-serif" }}>
                    {plan.provider.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-[#1A1A2E]" style={{ fontFamily: "'Sora', sans-serif" }}>
                      {plan.provider}
                    </p>
                    <p className="text-xs text-[#9CA3AF]" style={{ fontFamily: "'Inter', sans-serif" }}>
                      Internet Fibra
                    </p>
                  </div>
                </div>

                {/* Speed */}
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-5xl font-bold" style={{
                    fontFamily: "'Sora', sans-serif",
                    color: "#00D4E8"
                  }}>
                    {plan.speed}
                  </span>
                  <span className="text-lg font-semibold text-[#6B7280]" style={{ fontFamily: "'Sora', sans-serif" }}>
                    {plan.unit}
                  </span>
                </div>
                <p className="text-sm text-[#9CA3AF] mb-4" style={{ fontFamily: "'Inter', sans-serif" }}>
                  de internet
                </p>

                {/* Price */}
                <div className="mb-1">
                  {plan.originalPrice && (
                    <p className="text-sm text-[#9CA3AF] line-through" style={{ fontFamily: "'Inter', sans-serif" }}>
                      R$ {plan.originalPrice.toFixed(2).replace(".", ",")}/mês
                    </p>
                  )}
                  <div className="flex items-baseline gap-1 transition-all duration-300" style={{
                    filter: hoveredPlanId === plan.id ? "blur(0px)" : "blur(6px)",
                    opacity: hoveredPlanId === plan.id ? 1 : 0.7
                  }}>
                    <span className="text-sm font-medium text-[#6B7280]" style={{ fontFamily: "'Inter', sans-serif" }}>R$</span>
                    <span className="text-3xl font-bold" style={{
                      fontFamily: "'Sora', sans-serif",
                      color: "#A855F7"
                    }}>
                      {Math.floor(plan.price)},
                    </span>
                    <span className="text-lg font-bold" style={{ color: "#A855F7", fontFamily: "'Sora', sans-serif" }}>
                      {String(plan.price.toFixed(2)).split(".")[1]}
                    </span>
                    <span className="text-sm text-[#9CA3AF]" style={{ fontFamily: "'Inter', sans-serif" }}>/mês</span>
                  </div>
                </div>
                <p className="text-xs text-[#9CA3AF] mb-5" style={{ fontFamily: "'Inter', sans-serif" }}>
                  Instalação: <span className={plan.installFee === "Grátis" ? "text-[#10B981] font-semibold" : "text-[#1A1A2E]"}>
                    {plan.installFee}
                  </span>
                </p>

                {/* Features */}
                <div className="space-y-2 mb-6">
                  {plan.features.map((f) => (
                    <div key={f} className="flex items-center gap-2">
                      <Check className="w-4 h-4 flex-shrink-0" style={{ color: "#00D4E8" }} />
                      <span className="text-sm text-[#6B7280]" style={{ fontFamily: "'Inter', sans-serif" }}>{f}</span>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <a
                  href={getWhatsAppUrl("plans")}
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-semibold text-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
                  style={{
                    fontFamily: "'Sora', sans-serif",
                    background: plan.recommended
                      ? "linear-gradient(135deg, #00D4E8 0%, #A855F7 100%)"
                      : "#1E2A4A",
                    color: "white"
                  }}
                >
                  <MessageCircle className="w-4 h-4" />
                  Contratar via WhatsApp
                </a>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Ver mais */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center mt-10"
        >
          <a
            href={getWhatsAppUrl("plans")}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-white transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
            style={{
              fontFamily: "'Sora', sans-serif",
              background: "linear-gradient(135deg, #00D4E8 0%, #A855F7 100%)"
            }}
          >
            <Zap className="w-4 h-4" />
            Ver Mais Planos
          </a>
        </motion.div>
      </div>
    </section>
  );
}

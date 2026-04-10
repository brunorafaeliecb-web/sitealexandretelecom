/* 
  Design: Seção escura com tabs de tipo de plano e cards de celular
*/
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Smartphone, Check, MessageCircle, Zap } from "lucide-react";
import { useWhatsAppSettings } from "@/hooks/useWhatsAppSettings";

type PlanType = "pos" | "pre" | "controle";

const celularPlans: Record<PlanType, Array<{
  id: number;
  provider: string;
  providerColor: string;
  gb: number;
  price: number;
  features: string[];
  badge?: string;
  badgeColor?: string;
}>> = {
  pos: [
    {
      id: 1,
      provider: "Vivo",
      providerColor: "#660099",
      gb: 60,
      price: 99.99,
      features: ["60 GB de dados", "Ligações ilimitadas", "WhatsApp e Redes Sociais", "Roaming nacional"],
      badge: "MAIS POPULAR",
      badgeColor: "#A855F7"
    },
    {
      id: 2,
      provider: "Claro",
      providerColor: "#E8001C",
      gb: 50,
      price: 89.99,
      features: ["50 GB de dados", "Ligações ilimitadas", "Streaming incluso", "5G disponível"],
      badge: "MELHOR CUSTO",
      badgeColor: "#00D4E8"
    },
    {
      id: 3,
      provider: "Tim",
      providerColor: "#003087",
      gb: 40,
      price: 79.99,
      features: ["40 GB de dados", "Ligações ilimitadas", "Portabilidade grátis", "Chip grátis"],
    },
  ],
  pre: [
    {
      id: 4,
      provider: "Claro",
      providerColor: "#E8001C",
      gb: 20,
      price: 39.99,
      features: ["20 GB de dados", "Ligações ilimitadas", "Validade 30 dias", "Recarga fácil"],
      badge: "MAIS BARATO",
      badgeColor: "#10B981"
    },
    {
      id: 5,
      provider: "Vivo",
      providerColor: "#660099",
      gb: 15,
      price: 29.99,
      features: ["15 GB de dados", "Ligações ilimitadas", "Redes sociais grátis", "Validade 30 dias"],
    },
    {
      id: 6,
      provider: "Tim",
      providerColor: "#003087",
      gb: 25,
      price: 44.99,
      features: ["25 GB de dados", "Ligações ilimitadas", "WhatsApp grátis", "Validade 30 dias"],
      badge: "MAIS GB",
      badgeColor: "#00D4E8"
    },
  ],
  controle: [
    {
      id: 7,
      provider: "Tim",
      providerColor: "#003087",
      gb: 30,
      price: 59.99,
      features: ["30 GB de dados", "Ligações ilimitadas", "Controle de gastos", "App Tim"],
      badge: "RECOMENDADO",
      badgeColor: "#00D4E8"
    },
    {
      id: 8,
      provider: "Vivo",
      providerColor: "#660099",
      gb: 25,
      price: 54.99,
      features: ["25 GB de dados", "Ligações ilimitadas", "Redes sociais grátis", "Minha Vivo"],
    },
    {
      id: 9,
      provider: "Claro",
      providerColor: "#E8001C",
      gb: 35,
      price: 69.99,
      features: ["35 GB de dados", "Ligações ilimitadas", "Streaming bônus", "5G disponível"],
      badge: "MAIS GB",
      badgeColor: "#A855F7"
    },
  ]
};

const tabs: { key: PlanType; label: string }[] = [
  { key: "pos", label: "Pós-Pago" },
  { key: "pre", label: "Pré-Pago" },
  { key: "controle", label: "Controle" },
];

export default function CelularSection() {
  const { getWhatsAppUrl } = useWhatsAppSettings();
  const [activeTab, setActiveTab] = useState<PlanType>("pos");
  const [hoveredPlanId, setHoveredPlanId] = useState<number | null>(null);
  const plans = celularPlans[activeTab];

  return (
    <section className="py-16 lg:py-20 bg-[#FAF8F5]" id="celular">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4"
        >
          <div>
            <h2 className="text-3xl lg:text-4xl font-bold text-[#1A1A2E]" style={{ fontFamily: "'Sora', sans-serif" }}>
              Planos de{" "}
              <span style={{
                background: "linear-gradient(135deg, #00D4E8 0%, #A855F7 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text"
              }}>
                Celular
              </span>
            </h2>
            <p className="text-[#6B7280] mt-2" style={{ fontFamily: "'Inter', sans-serif" }}>
              Compare os melhores planos de celular das operadoras
            </p>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-1 p-1 bg-white rounded-xl border border-[#E5E0D8]">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className="relative px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200"
                style={{
                  fontFamily: "'Sora', sans-serif",
                  color: activeTab === tab.key ? "white" : "#6B7280"
                }}
              >
                {activeTab === tab.key && (
                  <motion.div
                    layoutId="tab-bg"
                    className="absolute inset-0 rounded-lg"
                    style={{ background: "linear-gradient(135deg, #00D4E8 0%, #A855F7 100%)" }}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                  />
                )}
                <span className="relative z-10">{tab.label}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Plans */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="grid md:grid-cols-3 gap-6"
          >
            {plans.map((plan, i) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                whileHover={{ y: -6 }}
                onMouseEnter={() => setHoveredPlanId(plan.id)}
                onMouseLeave={() => setHoveredPlanId(null)}
                className="relative bg-white rounded-2xl border-2 overflow-hidden transition-all duration-300"
                style={{
                  borderColor: i === 0 ? "#00D4E8" : "#E5E0D8",
                  boxShadow: i === 0 ? "0 8px 32px rgba(0, 212, 232, 0.2)" : "0 2px 12px rgba(0,0,0,0.06)"
                }}
              >
                {plan.badge && (
                  <div className="absolute top-4 right-4">
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full text-white"
                      style={{ fontFamily: "'Sora', sans-serif", background: plan.badgeColor }}>
                      {plan.badge}
                    </span>
                  </div>
                )}

                <div className="p-6">
                  {/* Provider */}
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold"
                      style={{ background: plan.providerColor, fontFamily: "'Sora', sans-serif" }}>
                      {plan.provider.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-[#1A1A2E]" style={{ fontFamily: "'Sora', sans-serif" }}>
                        {plan.provider}
                      </p>
                      <p className="text-xs text-[#9CA3AF]" style={{ fontFamily: "'Inter', sans-serif" }}>
                        {tabs.find(t => t.key === activeTab)?.label}
                      </p>
                    </div>
                  </div>

                  {/* GB */}
                  <div className="flex items-baseline gap-1 mb-1">
                    <span className="text-5xl font-bold" style={{ fontFamily: "'Sora', sans-serif", color: "#00D4E8" }}>
                      {plan.gb}
                    </span>
                    <span className="text-xl font-semibold text-[#6B7280]" style={{ fontFamily: "'Sora', sans-serif" }}>
                      GB
                    </span>
                  </div>
                  <p className="text-sm text-[#9CA3AF] mb-4" style={{ fontFamily: "'Inter', sans-serif" }}>
                    de dados por mês
                  </p>

                  {/* Price */}
                  <div className="flex items-baseline gap-1 mb-5 transition-all duration-300" style={{
                    filter: hoveredPlanId === plan.id ? "blur(0px)" : "blur(6px)",
                    opacity: hoveredPlanId === plan.id ? 1 : 0.7
                  }}>
                    <span className="text-sm font-medium text-[#6B7280]" style={{ fontFamily: "'Inter', sans-serif" }}>R$</span>
                    <span className="text-3xl font-bold" style={{ fontFamily: "'Sora', sans-serif", color: "#A855F7" }}>
                      {Math.floor(plan.price)},
                    </span>
                    <span className="text-lg font-bold" style={{ color: "#A855F7", fontFamily: "'Sora', sans-serif" }}>
                      {String(plan.price.toFixed(2)).split(".")[1]}
                    </span>
                    <span className="text-sm text-[#9CA3AF]" style={{ fontFamily: "'Inter', sans-serif" }}>/mês</span>
                  </div>

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
                    href={getWhatsAppUrl("celular")}
                    className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-semibold text-sm text-white transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
                    style={{
                      fontFamily: "'Sora', sans-serif",
                      background: i === 0
                        ? "linear-gradient(135deg, #00D4E8 0%, #A855F7 100%)"
                        : "#1E2A4A"
                    }}
                  >
                    <MessageCircle className="w-4 h-4" />
                    Contratar via WhatsApp
                  </a>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center mt-10"
        >
          <a
            href={getWhatsAppUrl("celular")}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-white transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
            style={{
              fontFamily: "'Sora', sans-serif",
              background: "linear-gradient(135deg, #00D4E8 0%, #A855F7 100%)"
            }}
          >
            <Zap className="w-4 h-4" />
            Ver Mais Planos de Celular
          </a>
        </motion.div>
      </div>
    </section>
  );
}

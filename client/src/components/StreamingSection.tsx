/* 
  Design: Seção escura com cards de streaming com logos coloridos e preços
*/
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Play, Check, ArrowRight } from "lucide-react";

const streamingServices = [
  {
    name: "Netflix",
    color: "#E50914",
    initial: "N",
    plans: [
      { name: "Standard com anúncios", price: 18.90, screens: 2, quality: "Full HD" },
      { name: "Standard", price: 39.90, screens: 2, quality: "Full HD" },
      { name: "Premium", price: 59.90, screens: 4, quality: "4K Ultra HD" },
    ]
  },
  {
    name: "Disney+",
    color: "#0063E5",
    initial: "D",
    plans: [
      { name: "Padrão com anúncios", price: 27.90, screens: 2, quality: "Full HD" },
      { name: "Padrão", price: 43.90, screens: 2, quality: "Full HD" },
      { name: "Premium", price: 55.90, screens: 4, quality: "4K Ultra HD" },
    ]
  },
  {
    name: "Max",
    color: "#002BE7",
    initial: "M",
    plans: [
      { name: "Básico", price: 19.90, screens: 2, quality: "Full HD" },
      { name: "Padrão", price: 34.90, screens: 3, quality: "Full HD" },
      { name: "Premium", price: 54.90, screens: 4, quality: "4K Ultra HD" },
    ]
  },
];

export default function StreamingSection() {
  const [hoveredPlan, setHoveredPlan] = React.useState<string | null>(null);
  return (
    <section className="py-16 lg:py-20" style={{ background: "linear-gradient(135deg, #1A2035 0%, #1E2A4A 50%, #253356 100%)" }} id="streaming">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4"
            style={{ background: "rgba(0, 212, 232, 0.15)", border: "1px solid rgba(0, 212, 232, 0.3)" }}>
            <Play className="w-4 h-4 text-[#00D4E8]" />
            <span className="text-sm font-semibold text-[#00D4E8]" style={{ fontFamily: "'Sora', sans-serif" }}>
              Streaming e Entretenimento
            </span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-white" style={{ fontFamily: "'Sora', sans-serif" }}>
            Compare Planos de{" "}
            <span style={{
              background: "linear-gradient(135deg, #00D4E8 0%, #A855F7 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text"
            }}>
              Streaming
            </span>
          </h2>
          <p className="text-[#9CA3AF] mt-2" style={{ fontFamily: "'Inter', sans-serif" }}>
            Encontre o plano de streaming ideal para você e sua família
          </p>
        </motion.div>

        {/* Streaming cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {streamingServices.map((service, i) => (
            <motion.div
              key={service.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="rounded-2xl border overflow-hidden"
              style={{
                background: "rgba(255,255,255,0.05)",
                borderColor: `${service.color}30`
              }}
            >
              {/* Header */}
              <div className="p-5 flex items-center gap-3" style={{ background: `${service.color}20` }}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-xl"
                  style={{ background: service.color, fontFamily: "'Sora', sans-serif" }}>
                  {service.initial}
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg" style={{ fontFamily: "'Sora', sans-serif" }}>
                    {service.name}
                  </h3>
                  <p className="text-xs text-[#9CA3AF]" style={{ fontFamily: "'Inter', sans-serif" }}>
                    {service.plans.length} planos disponíveis
                  </p>
                </div>
              </div>

              {/* Plans */}
              <div className="p-5 space-y-3">
                {service.plans.map((plan, j) => (
                  <div
                    key={plan.name}
                    onMouseEnter={() => setHoveredPlan(`${service.name}-${plan.name}`)}
                    onMouseLeave={() => setHoveredPlan(null)}
                    className="flex items-center justify-between p-3 rounded-xl transition-all duration-200 hover:bg-white/10 cursor-pointer group"
                    style={{ background: j === 0 ? "rgba(255,255,255,0.08)" : "transparent" }}
                  >
                    <div>
                      <p className="text-sm font-medium text-white" style={{ fontFamily: "'Sora', sans-serif" }}>
                        {plan.name}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-[#9CA3AF]" style={{ fontFamily: "'Inter', sans-serif" }}>
                          {plan.screens} telas · {plan.quality}
                        </span>
                      </div>
                    </div>
                    <div className="text-right transition-all duration-300" style={{
                      filter: hoveredPlan === `${service.name}-${plan.name}` ? "blur(0px)" : "blur(6px)",
                      opacity: hoveredPlan === `${service.name}-${plan.name}` ? 1 : 0.7
                    }}>
                      <p className="font-bold text-[#00D4E8]" style={{ fontFamily: "'Sora', sans-serif" }}>
                        R$ {plan.price.toFixed(2).replace(".", ",")}
                      </p>
                      <p className="text-xs text-[#6B7280]" style={{ fontFamily: "'Inter', sans-serif" }}>/mês</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <div className="px-5 pb-5">
                <a
                  href="#"
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-semibold text-sm text-white border border-white/20 hover:bg-white/10 transition-all duration-300"
                  style={{ fontFamily: "'Sora', sans-serif" }}
                >
                  Ver Todos os Planos
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {[
            { value: "20+", label: "Serviços de Streaming" },
            { value: "100%", label: "Preços Atualizados" },
            { value: "Grátis", label: "Sem Cadastro" },
            { value: "24h", label: "Suporte ao Usuário" },
          ].map((stat) => (
            <div key={stat.label} className="text-center p-4 rounded-2xl"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(0, 212, 232, 0.15)" }}>
              <p className="text-2xl font-bold" style={{
                fontFamily: "'Sora', sans-serif",
                background: "linear-gradient(135deg, #00D4E8 0%, #A855F7 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text"
              }}>
                {stat.value}
              </p>
              <p className="text-xs text-[#9CA3AF] mt-1" style={{ fontFamily: "'Inter', sans-serif" }}>
                {stat.label}
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

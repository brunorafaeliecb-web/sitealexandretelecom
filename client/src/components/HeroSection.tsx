/* 
  Design: Hero assimétrico — texto à esquerda com gradiente ciano-roxo, imagem à direita
  Fundo creme com elementos decorativos flutuantes
*/
import { useState } from "react";
import { motion } from "framer-motion";
import { Search, MapPin, ArrowRight, Wifi, Smartphone, Tv, Phone } from "lucide-react";

const HERO_IMAGE = "https://d2xsxph8kpxj0f.cloudfront.net/310519663505504846/XjfuSPdJ7Y6Vi4cFETV8gi/hero-internet-CviHkpuTUh6zPg3vFepyiJ.webp";

const serviceCategories = [
  { icon: Wifi, label: "Internet Residencial", color: "#00D4E8" },
  { icon: Smartphone, label: "Planos de Celular", color: "#A855F7" },
  { icon: Tv, label: "TV e Streaming", color: "#00D4E8" },
  { icon: Phone, label: "Telefone Fixo", color: "#A855F7" },
];

export default function HeroSection() {
  const [cep, setCep] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Feature coming soon
  };

  return (
    <section className="relative overflow-hidden bg-[#FAF8F5]" id="hero">
      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 right-[10%] w-64 h-64 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #00D4E8 0%, transparent 70%)" }} />
        <div className="absolute bottom-10 left-[5%] w-48 h-48 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #A855F7 0%, transparent 70%)" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full opacity-5"
          style={{ background: "radial-gradient(circle, #00D4E8 0%, #A855F7 100%)" }} />
      </div>

      <div className="container mx-auto px-4 max-w-7xl py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Text content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
            className="space-y-8"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#00D4E8]/10 border border-[#00D4E8]/30"
            >
              <div className="w-2 h-2 rounded-full bg-[#00D4E8] animate-pulse" />
              <span className="text-sm font-semibold text-[#00D4E8]" style={{ fontFamily: "'Sora', sans-serif" }}>
                100% Grátis e Sem Cadastro
              </span>
            </motion.div>

            {/* Heading */}
            <div className="space-y-3">
              <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight text-[#1A1A2E]"
                style={{ fontFamily: "'Sora', sans-serif" }}>
                Encontre a{" "}
                <span style={{
                  background: "linear-gradient(135deg, #00D4E8 0%, #A855F7 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text"
                }}>
                  Melhor Oferta
                </span>{" "}
                e Economize!
              </h1>
              <p className="text-lg text-[#6B7280] leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
                Compare planos de internet, celular, TV e combos no seu endereço. 
                Preços atualizados diariamente com total transparência.
              </p>
            </div>

            {/* CEP Search */}
            <form onSubmit={handleSearch} className="space-y-3">
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#A855F7]" />
                  <input
                    type="text"
                    placeholder="Digite seu CEP (ex: 01310-100)"
                    value={cep}
                    onChange={(e) => setCep(e.target.value)}
                    maxLength={9}
                    className="w-full pl-10 pr-4 py-3.5 rounded-xl border-2 border-[#E5E0D8] bg-white text-[#1A1A2E] placeholder-[#9CA3AF] focus:outline-none focus:border-[#00D4E8] transition-colors text-sm"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  />
                </div>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-6 py-3.5 text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 whitespace-nowrap"
                  style={{
                    fontFamily: "'Sora', sans-serif",
                    background: "linear-gradient(135deg, #00D4E8 0%, #A855F7 100%)"
                  }}
                >
                  <Search className="w-4 h-4" />
                  Ver Planos
                </button>
              </div>
              <p className="text-xs text-[#9CA3AF]" style={{ fontFamily: "'Inter', sans-serif" }}>
                Encontre planos disponíveis na sua região sem precisar de cadastro
              </p>
            </form>

            {/* Quick categories */}
            <div className="grid grid-cols-2 gap-3">
              {serviceCategories.map((cat, i) => (
                <motion.a
                  key={cat.label}
                  href="#"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + i * 0.1, duration: 0.4 }}
                  className="flex items-center gap-3 p-3 bg-white rounded-xl border border-[#E5E0D8] hover:border-[#00D4E8] hover:shadow-md transition-all duration-200 group"
                >
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${cat.color}20` }}>
                    <cat.icon className="w-4 h-4" style={{ color: cat.color }} />
                  </div>
                  <span className="text-sm font-medium text-[#1A1A2E] group-hover:text-[#00D4E8] transition-colors"
                    style={{ fontFamily: "'Inter', sans-serif" }}>
                    {cat.label}
                  </span>
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Right: Hero image */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
            className="relative hidden lg:block"
          >
            {/* Floating stats card */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-4 -left-4 z-10 bg-white rounded-2xl p-4 shadow-xl border border-[#E5E0D8]"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: "linear-gradient(135deg, #00D4E8, #A855F7)" }}>
                  <Wifi className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-xs text-[#9CA3AF]" style={{ fontFamily: "'Inter', sans-serif" }}>Velocidade Máxima</p>
                  <p className="text-lg font-bold text-[#1A1A2E]" style={{ fontFamily: "'Sora', sans-serif" }}>
                    <span style={{ color: "#00D4E8" }}>1</span> Gbps
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Floating price card */}
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              className="absolute -bottom-4 -right-4 z-10 bg-white rounded-2xl p-4 shadow-xl border border-[#E5E0D8]"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#A855F7]/15">
                  <span className="text-lg font-bold" style={{ color: "#A855F7", fontFamily: "'Sora', sans-serif" }}>R$</span>
                </div>
                <div>
                  <p className="text-xs text-[#9CA3AF]" style={{ fontFamily: "'Inter', sans-serif" }}>A partir de</p>
                  <p className="text-lg font-bold text-[#1A1A2E]" style={{ fontFamily: "'Sora', sans-serif" }}>
                    R$ <span style={{ color: "#A855F7" }}>49,90</span>/mês
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Main image */}
            <div className="relative rounded-3xl overflow-hidden shadow-2xl"
              style={{ background: "linear-gradient(135deg, #1E2A4A 0%, #253356 100%)" }}>
              <img
                src={HERO_IMAGE}
                alt="Família usando internet de alta velocidade"
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1E2A4A]/30 to-transparent" />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom wave divider */}
      <div className="relative h-16 overflow-hidden">
        <svg viewBox="0 0 1440 64" fill="none" xmlns="http://www.w3.org/2000/svg"
          className="absolute bottom-0 w-full" preserveAspectRatio="none">
          <path d="M0,32 C360,64 1080,0 1440,32 L1440,64 L0,64 Z" fill="#1E2A4A" />
        </svg>
      </div>
    </section>
  );
}

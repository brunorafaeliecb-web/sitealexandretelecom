/* 
  Design: Seção CTA com gradiente ciano-roxo, texto branco, botão contrastante
*/
import { motion } from "framer-motion";
import { Zap, ArrowRight, Shield, Star } from "lucide-react";
import { useWhatsAppSettings } from "@/hooks/useWhatsAppSettings";

export default function CTASection() {
  const { getWhatsAppUrl } = useWhatsAppSettings();
  return (
    <section className="py-16 lg:py-20 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0"
        style={{ background: "linear-gradient(135deg, #00D4E8 0%, #7C3AED 50%, #A855F7 100%)" }} />
      
      {/* Decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-64 h-64 rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, white 0%, transparent 70%)" }} />
        <div className="absolute bottom-0 right-1/4 w-48 h-48 rounded-full opacity-15"
          style={{ background: "radial-gradient(circle, white 0%, transparent 70%)" }} />
      </div>

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        <div className="text-center max-w-3xl mx-auto">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 border border-white/30 mb-6"
          >
            <Star className="w-4 h-4 text-white" />
            <span className="text-sm font-semibold text-white" style={{ fontFamily: "'Sora', sans-serif" }}>
              Mais de 1 Milhão de Comparações
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl lg:text-5xl font-bold text-white mb-4"
            style={{ fontFamily: "'Sora', sans-serif" }}
          >
            Pronto para Economizar?
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-white/80 mb-8"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Compare planos de internet, celular, TV e combos gratuitamente. 
            Sem cadastro, sem complicação.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <a
              href={getWhatsAppUrl("hero")}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold text-[#1A1A2E] bg-white transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
              style={{ fontFamily: "'Sora', sans-serif" }}
            >
              <Zap className="w-5 h-5 text-[#A855F7]" />
              Comparar Agora — Grátis
            </a>
            <a
              href={getWhatsAppUrl("hero")}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold text-white border-2 border-white/40 hover:bg-white/10 transition-all duration-300"
              style={{ fontFamily: "'Sora', sans-serif" }}
            >
              Ver Guias
              <ArrowRight className="w-4 h-4" />
            </a>
          </motion.div>

          {/* Trust badges */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex items-center justify-center gap-6 mt-8"
          >
            <div className="flex items-center gap-2 text-white/70">
              <Shield className="w-4 h-4" />
              <span className="text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>100% Seguro</span>
            </div>
            <div className="w-px h-4 bg-white/30" />
            <div className="flex items-center gap-2 text-white/70">
              <Star className="w-4 h-4" />
              <span className="text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>Sem Cadastro</span>
            </div>
            <div className="w-px h-4 bg-white/30" />
            <div className="flex items-center gap-2 text-white/70">
              <Zap className="w-4 h-4" />
              <span className="text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>Grátis Sempre</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

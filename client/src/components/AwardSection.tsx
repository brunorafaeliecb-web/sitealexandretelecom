/* 
  Design: Seção clara com imagem da medalha, grid de capitais com hover ciano
*/
import { motion } from "framer-motion";
import { MapPin, Trophy, ArrowRight } from "lucide-react";

const AWARD_IMAGE = "https://d2xsxph8kpxj0f.cloudfront.net/310519663505504846/XjfuSPdJ7Y6Vi4cFETV8gi/award-section-btKwfNeZQapQW3Pd7a6db5.webp";

const capitals = [
  "Brasília", "Rio de Janeiro", "São Paulo", "Salvador",
  "Belo Horizonte", "Manaus", "Fortaleza", "Porto Alegre",
  "Recife", "Curitiba", "Belém", "Florianópolis",
  "João Pessoa", "Vitória", "Natal", "Goiânia",
  "São Luís", "Maceió", "Cuiabá", "Campo Grande",
  "Porto Velho", "Rio Branco", "Palmas", "Macapá",
  "Boa Vista", "Aracaju", "Teresina"
];

export default function AwardSection() {
  return (
    <section className="py-16 lg:py-20 bg-[#FAF8F5]" id="premio">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-14">
          {/* Left: Text */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FFD700]/15 border border-[#FFD700]/40">
              <Trophy className="w-4 h-4 text-[#B8860B]" />
              <span className="text-sm font-semibold text-[#B8860B]" style={{ fontFamily: "'Sora', sans-serif" }}>
                Prêmio MelhorPlano.net
              </span>
            </div>

            <h2 className="text-3xl lg:text-4xl font-bold text-[#1A1A2E]" style={{ fontFamily: "'Sora', sans-serif" }}>
              Descubra qual é a{" "}
              <span style={{
                background: "linear-gradient(135deg, #00D4E8 0%, #A855F7 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text"
              }}>
                Melhor Internet
              </span>{" "}
              da sua Região
            </h2>

            <p className="text-[#6B7280] leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
              O Prêmio MelhorPlano.net é a maior pesquisa sobre os melhores provedores de internet do Brasil. 
              Anualmente, são analisadas mais de <strong className="text-[#1A1A2E]">1.000 operadoras</strong> com 
              base em milhares de testes de velocidade e avaliações de qualidade realizadas pelos próprios consumidores.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href="#"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-white transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
                style={{
                  fontFamily: "'Sora', sans-serif",
                  background: "linear-gradient(135deg, #00D4E8 0%, #A855F7 100%)"
                }}
              >
                Quero Descobrir
                <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-[#1A1A2E] border-2 border-[#E5E0D8] hover:border-[#00D4E8] hover:text-[#00D4E8] transition-all duration-300"
                style={{ fontFamily: "'Sora', sans-serif" }}
              >
                Ver Ganhadores
              </a>
            </div>
          </motion.div>

          {/* Right: Award image */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex justify-center"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="relative"
            >
              <div className="absolute inset-0 rounded-3xl opacity-30 blur-2xl"
                style={{ background: "radial-gradient(circle, #FFD700 0%, #A855F7 50%, transparent 80%)" }} />
              <img
                src={AWARD_IMAGE}
                alt="Prêmio MelhorPlano.net"
                className="relative w-64 h-64 object-contain"
              />
            </motion.div>
          </motion.div>
        </div>

        {/* Capitals grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-2 mb-6">
            <MapPin className="w-5 h-5 text-[#00D4E8]" />
            <p className="font-semibold text-[#1A1A2E]" style={{ fontFamily: "'Sora', sans-serif" }}>
              Quer saber qual é a melhor internet da sua região? Escolha a capital:
            </p>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-9 gap-2">
            {capitals.map((city, i) => (
              <motion.a
                key={city}
                href="#"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.02 }}
                whileHover={{ scale: 1.05 }}
                className="text-center px-2 py-2.5 rounded-xl text-xs font-medium text-[#6B7280] border border-[#E5E0D8] bg-white hover:border-[#00D4E8] hover:text-[#00D4E8] hover:bg-[#00D4E8]/5 transition-all duration-200"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                {city}
              </motion.a>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* 
  Design: Seção escura com 3 passos numerados em ciano, imagem à direita
*/
import { motion } from "framer-motion";
import { Search, SlidersHorizontal, ShieldCheck, ArrowRight } from "lucide-react";

const HOW_IMAGE = "https://d2xsxph8kpxj0f.cloudfront.net/310519663505504846/XjfuSPdJ7Y6Vi4cFETV8gi/how-it-works-ef4DosGoqmd2bheJqreKjo.webp";

const steps = [
  {
    number: "01",
    icon: Search,
    title: "Escolha um serviço",
    desc: "Você pode comparar planos de banda larga, celular, telefone fixo, TV e combos — tudo em um só lugar.",
    color: "#00D4E8"
  },
  {
    number: "02",
    icon: SlidersHorizontal,
    title: "Personalize sua busca",
    desc: "Informe seu CEP e use nosso filtro para escolher os benefícios essenciais do serviço que deseja comparar.",
    color: "#A855F7"
  },
  {
    number: "03",
    icon: ShieldCheck,
    title: "Contrate de forma segura",
    desc: "Ao encontrar o melhor plano, te encaminhamos para os canais oficiais de contratação dos nossos parceiros.",
    color: "#00D4E8"
  },
];

export default function HowItWorksSection() {
  return (
    <section className="py-16 lg:py-20" style={{ background: "linear-gradient(135deg, #1A2035 0%, #1E2A4A 50%, #253356 100%)" }}>
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Steps */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4"
                style={{ background: "rgba(0, 212, 232, 0.15)", border: "1px solid rgba(0, 212, 232, 0.3)" }}>
                <span className="text-sm font-semibold text-[#00D4E8]" style={{ fontFamily: "'Sora', sans-serif" }}>
                  100% Grátis e Sem Cadastro
                </span>
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold text-white" style={{ fontFamily: "'Sora', sans-serif" }}>
                Usar o{" "}
                <span style={{
                  background: "linear-gradient(135deg, #00D4E8 0%, #A855F7 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text"
                }}>
                  MelhorPlano.net
                </span>{" "}
                é simples
              </h2>
            </div>

            <div className="space-y-6">
              {steps.map((step, i) => (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.15 }}
                  className="flex gap-5 group"
                >
                  {/* Number + line */}
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg flex-shrink-0 transition-all duration-300 group-hover:scale-110"
                      style={{
                        background: `linear-gradient(135deg, ${step.color}30, ${step.color}10)`,
                        border: `2px solid ${step.color}40`,
                        color: step.color,
                        fontFamily: "'Sora', sans-serif"
                      }}>
                      {step.number}
                    </div>
                    {i < steps.length - 1 && (
                      <div className="w-0.5 flex-1 mt-2 mb-0"
                        style={{ background: `linear-gradient(to bottom, ${step.color}40, transparent)` }} />
                    )}
                  </div>

                  {/* Content */}
                  <div className="pb-6">
                    <div className="flex items-center gap-2 mb-2">
                      <step.icon className="w-4 h-4" style={{ color: step.color }} />
                      <h3 className="font-bold text-white" style={{ fontFamily: "'Sora', sans-serif" }}>
                        {step.title}
                      </h3>
                    </div>
                    <p className="text-[#9CA3AF] text-sm leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
                      {step.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            <a
              href="#"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
              style={{
                fontFamily: "'Sora', sans-serif",
                background: "linear-gradient(135deg, #00D4E8 0%, #A855F7 100%)"
              }}
            >
              Começar Agora
              <ArrowRight className="w-4 h-4" />
            </a>
          </motion.div>

          {/* Right: Image */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="hidden lg:flex justify-center"
          >
            <div className="relative">
              <div className="absolute inset-0 rounded-3xl opacity-20 blur-3xl"
                style={{ background: "radial-gradient(circle, #00D4E8 0%, #A855F7 100%)" }} />
              <img
                src={HOW_IMAGE}
                alt="Como funciona o MelhorPlano.net"
                className="relative rounded-3xl w-full max-w-md object-cover"
                style={{ boxShadow: "0 20px 60px rgba(0, 212, 232, 0.2)" }}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

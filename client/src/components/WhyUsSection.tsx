/* 
  Design: Seção clara com 4 cards de benefícios, ícones em ciano, hover com borda ciano
*/
import { motion } from "framer-motion";
import { BarChart3, RefreshCw, MapPin, Scale } from "lucide-react";

const benefits = [
  {
    icon: BarChart3,
    title: "Facilidade de comparação",
    desc: "Não perca horas pesquisando planos e serviços! Reunimos todos em um só lugar para que você possa comparar preços e benefícios de forma rápida e fácil.",
    color: "#00D4E8",
    gradient: "from-[#00D4E8]/10 to-[#00D4E8]/5"
  },
  {
    icon: RefreshCw,
    title: "Preços atualizados diariamente",
    desc: "Nossos preços são atualizados diariamente e utilizamos fontes confiáveis para que você tenha informações relevantes para tomar a melhor decisão.",
    color: "#A855F7",
    gradient: "from-[#A855F7]/10 to-[#A855F7]/5"
  },
  {
    icon: MapPin,
    title: "Planos com cobertura no seu bairro",
    desc: "Confira planos disponíveis na sua região ou CEP, sem perder tempo procurando serviços que não atendem sua área.",
    color: "#00D4E8",
    gradient: "from-[#00D4E8]/10 to-[#00D4E8]/5"
  },
  {
    icon: Scale,
    title: "Imparcialidade e transparência",
    desc: "Temos parceria oficial com diferentes marcas e somos muito transparentes com as informações para que você tenha o maior poder de escolha.",
    color: "#A855F7",
    gradient: "from-[#A855F7]/10 to-[#A855F7]/5"
  },
];

const faqItems = [
  {
    q: "Como funciona o MelhorPlano.net?",
    a: "O MelhorPlano.net é um comparador de ofertas de serviços de telecom. Usando nossa ferramenta, você pode escolher as melhores ofertas de internet para casa e para celular, telefone fixo, TV por assinatura e combos."
  },
  {
    q: "É confiável?",
    a: "Sim! O time do MelhorPlano.net se esforça para manter as informações sempre atualizadas para você. Também prezamos pela transparência e todas as ofertas presentes no site são oficiais e de empresas confiáveis."
  },
  {
    q: "É uma operadora?",
    a: "Não! Nós não fazemos parte de nenhuma operadora e não somos responsáveis pelo funcionamento dos serviços. Conectamos consumidores às empresas prestadoras dos serviços, facilitando o processo de escolha e contratação para você."
  }
];

export default function WhyUsSection() {
  return (
    <section className="py-16 lg:py-20 bg-[#FAF8F5]">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-[#1A1A2E] mb-3" style={{ fontFamily: "'Sora', sans-serif" }}>
            Por que usar o{" "}
            <span style={{
              background: "linear-gradient(135deg, #00D4E8 0%, #A855F7 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text"
            }}>
              MelhorPlano.net
            </span>?
          </h2>
          <p className="text-[#6B7280] max-w-2xl mx-auto" style={{ fontFamily: "'Inter', sans-serif" }}>
            Somos o maior comparador de planos de telecom do Brasil, com mais de 1.000 operadoras analisadas
          </p>
        </motion.div>

        {/* Benefits grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-16">
          {benefits.map((b, i) => (
            <motion.div
              key={b.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -4 }}
              className="flex gap-5 p-6 bg-white rounded-2xl border-2 border-[#E5E0D8] hover:border-[#00D4E8] transition-all duration-300 group"
              style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 bg-gradient-to-br ${b.gradient} transition-transform duration-300 group-hover:scale-110`}>
                <b.icon className="w-7 h-7" style={{ color: b.color }} />
              </div>
              <div>
                <h3 className="font-bold text-[#1A1A2E] mb-2" style={{ fontFamily: "'Sora', sans-serif" }}>
                  {b.title}
                </h3>
                <p className="text-sm text-[#6B7280] leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
                  {b.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* FAQ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h3 className="text-2xl font-bold text-[#1A1A2E] mb-6 text-center" style={{ fontFamily: "'Sora', sans-serif" }}>
            Perguntas Frequentes
          </h3>
          <div className="space-y-4 max-w-3xl mx-auto">
            {faqItems.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="p-6 bg-white rounded-2xl border border-[#E5E0D8]"
              >
                <h4 className="font-bold text-[#1A1A2E] mb-2 flex items-center gap-2" style={{ fontFamily: "'Sora', sans-serif" }}>
                  <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                    style={{ background: "linear-gradient(135deg, #00D4E8, #A855F7)" }}>
                    ?
                  </span>
                  {item.q}
                </h4>
                <p className="text-sm text-[#6B7280] leading-relaxed pl-8" style={{ fontFamily: "'Inter', sans-serif" }}>
                  {item.a}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

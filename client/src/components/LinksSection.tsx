/* 
  Design: Seção escura com 3 colunas de links rápidos
*/
import { motion } from "framer-motion";
import { FileText, Headphones, ArrowLeftRight } from "lucide-react";

const linkGroups = [
  {
    icon: FileText,
    title: "Como Emitir Fatura",
    color: "#00D4E8",
    links: [
      { label: "2ª via Vivo", href: "#" },
      { label: "2ª via Claro", href: "#" },
      { label: "2ª via SKY", href: "#" },
      { label: "2ª via Oi", href: "#" },
      { label: "2ª via Tim", href: "#" },
    ]
  },
  {
    icon: Headphones,
    title: "Atendimento Operadoras",
    color: "#A855F7",
    links: [
      { label: "Telefones Oi", href: "#" },
      { label: "Telefones Vivo", href: "#" },
      { label: "Telefones SKY", href: "#" },
      { label: "Telefones Claro", href: "#" },
      { label: "Telefones Tim", href: "#" },
    ]
  },
  {
    icon: ArrowLeftRight,
    title: "Portabilidade",
    color: "#00D4E8",
    links: [
      { label: "Portabilidade Claro", href: "#" },
      { label: "Portabilidade Vivo", href: "#" },
      { label: "Portabilidade Tim", href: "#" },
      { label: "Portabilidade Oi", href: "#" },
    ]
  }
];

export default function LinksSection() {
  return (
    <section className="py-16 lg:py-20" style={{ background: "linear-gradient(135deg, #1A2035 0%, #1E2A4A 50%, #253356 100%)" }}>
      <div className="container mx-auto px-4 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-white" style={{ fontFamily: "'Sora', sans-serif" }}>
            Encontre Mais{" "}
            <span style={{
              background: "linear-gradient(135deg, #00D4E8 0%, #A855F7 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text"
            }}>
              Informações
            </span>
          </h2>
          <p className="text-[#9CA3AF] mt-2" style={{ fontFamily: "'Inter', sans-serif" }}>
            Acesse links diretos para os serviços que você precisa
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {linkGroups.map((group, i) => (
            <motion.div
              key={group.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="p-6 rounded-2xl border"
              style={{
                background: "rgba(255,255,255,0.05)",
                borderColor: `${group.color}25`
              }}
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${group.color}20` }}>
                  <group.icon className="w-5 h-5" style={{ color: group.color }} />
                </div>
                <h3 className="font-bold text-white" style={{ fontFamily: "'Sora', sans-serif" }}>
                  {group.title}
                </h3>
              </div>
              <div className="space-y-2">
                {group.links.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    className="flex items-center gap-2 text-sm text-[#9CA3AF] hover:text-[#00D4E8] transition-colors py-1 group"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full flex-shrink-0 transition-colors group-hover:bg-[#00D4E8]"
                      style={{ backgroundColor: `${group.color}60` }} />
                    {link.label}
                  </a>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

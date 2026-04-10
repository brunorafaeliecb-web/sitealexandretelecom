/* 
  Design: Seção escura (azul-ardósia) com cards de categorias em ciano
  Contraste com a seção hero clara
*/
import { motion } from "framer-motion";
import { Wifi, Smartphone, Tv, Package, Monitor, Phone } from "lucide-react";

const categories = [
  {
    icon: Wifi,
    label: "Internet Residencial",
    desc: "Fibra óptica e cabo",
    color: "#00D4E8",
    href: "#internet"
  },
  {
    icon: Smartphone,
    label: "Planos de Celular",
    desc: "Pré, pós e controle",
    color: "#A855F7",
    href: "#celular"
  },
  {
    icon: Monitor,
    label: "Streaming",
    desc: "Netflix, Disney+ e mais",
    color: "#00D4E8",
    href: "#streaming"
  },
  {
    icon: Package,
    label: "Combos Residenciais",
    desc: "Internet + TV + Fone",
    color: "#A855F7",
    href: "#combos"
  },
  {
    icon: Tv,
    label: "TV por Assinatura",
    desc: "SKY, Claro TV e mais",
    color: "#00D4E8",
    href: "#tv"
  },
  {
    icon: Phone,
    label: "Telefone Fixo",
    desc: "Planos residenciais",
    color: "#A855F7",
    href: "#fixo"
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

export default function CategoriesSection() {
  return (
    <section className="py-16 lg:py-20" style={{ background: "linear-gradient(135deg, #1A2035 0%, #1E2A4A 50%, #253356 100%)" }}>
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl lg:text-4xl font-bold mb-3" style={{
            fontFamily: "'Sora', sans-serif",
            background: "linear-gradient(135deg, #00D4E8 0%, #A855F7 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text"
          }}>
            Compare Serviços e Economize
          </h2>
          <p className="text-[#9CA3AF] text-lg" style={{ fontFamily: "'Inter', sans-serif" }}>
            Escolha a categoria e encontre o plano ideal para você
          </p>
        </motion.div>

        {/* Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
        >
          {categories.map((cat) => (
            <motion.a
              key={cat.label}
              href={cat.href}
              variants={itemVariants}
              whileHover={{ y: -6, scale: 1.03 }}
              className="flex flex-col items-center gap-3 p-5 rounded-2xl border text-center group transition-all duration-300"
              style={{
                background: "rgba(255,255,255,0.05)",
                borderColor: "rgba(0, 212, 232, 0.15)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = `${cat.color}60`;
                e.currentTarget.style.background = `${cat.color}10`;
                e.currentTarget.style.boxShadow = `0 8px 32px ${cat.color}20`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(0, 212, 232, 0.15)";
                e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300"
                style={{ backgroundColor: `${cat.color}20` }}>
                <cat.icon className="w-7 h-7 transition-transform duration-300 group-hover:scale-110"
                  style={{ color: cat.color }} />
              </div>
              <div>
                <p className="text-sm font-semibold text-white leading-tight"
                  style={{ fontFamily: "'Sora', sans-serif" }}>
                  {cat.label}
                </p>
                <p className="text-xs mt-1" style={{ color: "#6B7280", fontFamily: "'Inter', sans-serif" }}>
                  {cat.desc}
                </p>
              </div>
            </motion.a>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

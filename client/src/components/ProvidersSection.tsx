/* 
  Design: Seção escura com logos de provedores em cards
*/
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const providers = [
  { name: "Claro", color: "#E8001C", initial: "C", desc: "Fibra e TV" },
  { name: "Vivo", color: "#660099", initial: "V", desc: "Fibra Óptica" },
  { name: "Tim", color: "#003087", initial: "T", desc: "Fibra e 5G" },
  { name: "Oi", color: "#FF6B00", initial: "O", desc: "Fibra Óptica" },
  { name: "SKY", color: "#0066CC", initial: "S", desc: "TV e Internet" },
  { name: "NET", color: "#00A651", initial: "N", desc: "Fibra e TV" },
  { name: "Desktop", color: "#1E2A4A", initial: "D", desc: "Fibra 1 Gbps" },
  { name: "Brisanet", color: "#E8001C", initial: "B", desc: "Nordeste" },
];

export default function ProvidersSection() {
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
          <h2 className="text-3xl lg:text-4xl font-bold mb-3" style={{
            fontFamily: "'Sora', sans-serif",
            background: "linear-gradient(135deg, #00D4E8 0%, #A855F7 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text"
          }}>
            Provedores com Ofertas Exclusivas
          </h2>
          <p className="text-[#9CA3AF]" style={{ fontFamily: "'Inter', sans-serif" }}>
            Confira ofertas das principais operadoras do Brasil com cobertura no seu CEP
          </p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4 mb-10">
          {providers.map((p, i) => (
            <motion.a
              key={p.name}
              href="#"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              whileHover={{ y: -4, scale: 1.05 }}
              className="flex flex-col items-center gap-3 p-4 rounded-2xl border transition-all duration-300 group"
              style={{
                background: "rgba(255,255,255,0.05)",
                borderColor: "rgba(0, 212, 232, 0.15)"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = `${p.color}60`;
                e.currentTarget.style.background = `${p.color}15`;
                e.currentTarget.style.boxShadow = `0 8px 24px ${p.color}25`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(0, 212, 232, 0.15)";
                e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg transition-transform duration-300 group-hover:scale-110"
                style={{ background: p.color, fontFamily: "'Sora', sans-serif" }}>
                {p.initial}
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-white" style={{ fontFamily: "'Sora', sans-serif" }}>{p.name}</p>
                <p className="text-xs text-[#6B7280]" style={{ fontFamily: "'Inter', sans-serif" }}>{p.desc}</p>
              </div>
            </motion.a>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <a
            href="#"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-white border-2 border-[#00D4E8]/40 hover:border-[#00D4E8] hover:bg-[#00D4E8]/10 transition-all duration-300"
            style={{ fontFamily: "'Sora', sans-serif" }}
          >
            Ver Todos os Provedores
            <ArrowRight className="w-4 h-4" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}

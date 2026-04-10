/* 
  Design: Navbar com fundo creme, logo gradiente, menu horizontal, CTA com gradiente ciano-roxo
*/
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Wifi, ChevronDown } from "lucide-react";

const navItems = [
  {
    label: "Internet",
    href: "#internet",
    sub: ["Internet Residencial", "Fibra Óptica", "Internet Rural"]
  },
  {
    label: "Celular",
    href: "#celular",
    sub: ["Planos Pré-Pago", "Planos Pós-Pago", "Controle"]
  },
  {
    label: "TV e Streaming",
    href: "#streaming",
    sub: ["TV por Assinatura", "Netflix", "Disney+", "HBO Max"]
  },
  {
    label: "Fixo e Combo",
    href: "#combo",
    sub: ["Telefone Fixo", "Combos Residenciais"]
  },
  {
    label: "Operadoras",
    href: "#operadoras",
    sub: ["Claro", "Vivo", "Tim", "Oi", "SKY"]
  },
  {
    label: "Guias",
    href: "#guias",
    sub: ["Como Comparar", "Portabilidade", "2ª Via de Fatura"]
  },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  return (
    <header className="sticky top-0 z-50 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#E5E0D8] shadow-sm">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #00D4E8 0%, #A855F7 100%)" }}>
              <Wifi className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg" style={{
              fontFamily: "'Sora', sans-serif",
              background: "linear-gradient(135deg, #00D4E8 0%, #A855F7 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text"
            }}>
              MelhoresPlanos.net
            </span>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => setActiveDropdown(item.label)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <a
                  href={item.href}
                  className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-[#1A1A2E] hover:text-[#00D4E8] transition-colors duration-200 rounded-lg hover:bg-[#00D4E8]/8"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  {item.label}
                  <ChevronDown className="w-3 h-3 opacity-60" />
                </a>
                <AnimatePresence>
                  {activeDropdown === item.label && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full left-0 mt-1 w-48 bg-white rounded-xl shadow-xl border border-[#E5E0D8] overflow-hidden"
                    >
                      {item.sub.map((sub) => (
                        <a
                          key={sub}
                          href="#"
                          className="block px-4 py-2.5 text-sm text-[#1A1A2E] hover:bg-[#00D4E8]/10 hover:text-[#00D4E8] transition-colors"
                          style={{ fontFamily: "'Inter', sans-serif" }}
                        >
                          {sub}
                        </a>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </nav>

          {/* CTA + Mobile Toggle */}
          <div className="flex items-center gap-3">
            <a
              href="#cadastrar"
              className="hidden md:flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white rounded-lg transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
              style={{
                fontFamily: "'Sora', sans-serif",
                background: "linear-gradient(135deg, #00D4E8 0%, #A855F7 100%)"
              }}
            >
              Cadastrar Provedor
            </a>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-[#00D4E8]/10 transition-colors"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-t border-[#E5E0D8] overflow-hidden"
          >
            <div className="container mx-auto px-4 py-4 space-y-1">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="block px-4 py-3 text-sm font-medium text-[#1A1A2E] hover:text-[#00D4E8] hover:bg-[#00D4E8]/8 rounded-lg transition-colors"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </a>
              ))}
              <div className="pt-3 border-t border-[#E5E0D8]">
                <a
                  href="#cadastrar"
                  className="flex justify-center items-center px-4 py-3 text-sm font-semibold text-white rounded-lg"
                  style={{
                    fontFamily: "'Sora', sans-serif",
                    background: "linear-gradient(135deg, #00D4E8 0%, #A855F7 100%)"
                  }}
                >
                  Cadastrar Provedor
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

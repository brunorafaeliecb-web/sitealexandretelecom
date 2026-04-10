/* 
  Design: Footer escuro com logo gradiente, links organizados em colunas, redes sociais
*/
import { Wifi, Instagram, Twitter, Facebook, Youtube, Linkedin, Lock, Moon, Sun } from "lucide-react";
import { useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import AuthModal from "./AuthModal";

const footerLinks = {
  "Institucional": [
    "Sobre o MelhorPlano.net",
    "Imprensa",
    "Guia Editorial",
    "Política de Privacidade",
    "Termos de Uso",
    "Fale Conosco",
  ],
  "Recursos": [
    "Blog",
    "Mapa do Site",
    "Carreira",
    "Seja um Parceiro",
    "Minha Conexão",
    "Prêmio MelhorPlano",
  ],
  "Serviços": [
    "Internet Residencial",
    "Planos de Celular",
    "TV por Assinatura",
    "Telefone Fixo",
    "Combos",
    "Streaming",
  ],
  "Parceiros": [
    "Méliuz",
    "Picodi BR",
    "Promobit",
    "Cadastrar Provedor",
  ]
};

const socialLinks = [
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Youtube, href: "#", label: "YouTube" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
];

export default function Footer() {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const { darkMode, toggleDarkMode } = useTheme();

  return (
    <footer style={{ background: "#0D1526" }}>
      {/* Main footer */}
      <div className="container mx-auto px-4 max-w-7xl py-14">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-3 lg:col-span-1 space-y-5">
            <a href="/" className="flex items-center gap-2">
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
                MelhorPlano.net
              </span>
            </a>
            <p className="text-sm text-[#6B7280] leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
              O maior comparador de planos de telecom do Brasil. Compare internet, celular, TV e combos gratuitamente.
            </p>
            {/* Social links */}
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-9 h-9 rounded-lg flex items-center justify-center text-[#6B7280] hover:text-[#00D4E8] transition-all duration-200 hover:scale-110"
                  style={{ background: "rgba(255,255,255,0.05)" }}
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-bold text-white mb-4 text-sm" style={{ fontFamily: "'Sora', sans-serif" }}>
                {category}
              </h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-[#6B7280] hover:text-[#00D4E8] transition-colors duration-200"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
        <div className="container mx-auto px-4 max-w-7xl py-5 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-xs text-[#6B7280]" style={{ fontFamily: "'Inter', sans-serif" }}>
            © 2024 MelhoresPlanos.net — Todos os direitos reservados Bruno Rafael (BRASILGUARD)
          </p>
          <div className="flex items-center gap-4">
            {/* Dark Mode Button */}
            <button
              onClick={toggleDarkMode}
              className="flex items-center justify-center w-9 h-9 rounded-lg bg-white/10 hover:bg-white/20 text-[#6B7280] hover:text-[#00D4E8] transition-all duration-200"
              title={darkMode ? "Modo Claro" : "Modo Escuro"}
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            <span className="text-xs text-[#6B7280]" style={{ fontFamily: "'Inter', sans-serif" }}>
              Site Seguro
            </span>
            <div className="flex items-center gap-1 px-3 py-1.5 rounded-full"
              style={{ background: "rgba(0, 212, 232, 0.1)", border: "1px solid rgba(0, 212, 232, 0.3)" }}>
              <div className="w-1.5 h-1.5 rounded-full bg-[#00D4E8] animate-pulse" />
              <span className="text-xs font-semibold text-[#00D4E8]" style={{ fontFamily: "'Sora', sans-serif" }}>
                SSL Seguro
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Admin Button */}
      <button
        onClick={() => setAuthModalOpen(true)}
        className="fixed bottom-6 right-6 flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-[#00D4E8] to-[#A855F7] text-white font-semibold text-xs hover:shadow-lg transition-all duration-300 z-30 hover:-translate-y-1"
        style={{ fontFamily: "'Sora', sans-serif" }}
        title="Painel de Administração"
      >
        <Lock className="w-4 h-4" />
        Admin
      </button>

      {/* Auth Modal */}
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </footer>
  );
}

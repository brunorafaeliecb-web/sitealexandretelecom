import { useState } from "react";
import { motion } from "framer-motion";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { useContactSettings } from "@/hooks/useContactSettings";
import { useWhatsAppSettings } from "@/hooks/useWhatsAppSettings";

export default function ContactSection() {
  const { email: contactEmail } = useContactSettings();
  const { phoneNumber: whatsappNumber } = useWhatsAppSettings();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const sendMessageMutation = trpc.contact.sendMessage.useMutation();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await sendMessageMutation.mutateAsync(formData);

      if (result.success) {
        toast.success(result.message || "Mensagem enviada com sucesso!");
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
        });
      } else {
        toast.error(result.error || "Erro ao enviar mensagem");
      }
    } catch (error) {
      toast.error("Erro ao enviar mensagem. Tente novamente.");
      console.error("Contact form error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <section
      className="py-20 px-4"
      style={{
        background: "linear-gradient(135deg, #1E2A4A 0%, #2D3E5F 100%)",
      }}
    >
      <div className="container mx-auto max-w-6xl">
        <motion.div
          className="text-center mb-16"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.h2
            className="text-4xl md:text-5xl font-bold mb-4"
            style={{
              background: "linear-gradient(135deg, #00D4E8 0%, #A855F7 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
            variants={itemVariants}
          >
            Entre em Contato
          </motion.h2>
          <motion.p
            className="text-xl text-gray-300"
            style={{ fontFamily: "'Inter', sans-serif" }}
            variants={itemVariants}
          >
            Tem dúvidas? Estamos aqui para ajudar! Envie sua mensagem e
            responderemos em breve.
          </motion.p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Info */}
          <motion.div
            className="space-y-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div
              className="flex gap-4"
              variants={itemVariants}
            >
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{
                  background: "linear-gradient(135deg, #00D4E8 0%, #A855F7 100%)",
                }}
              >
                <Mail className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3
                  className="font-bold text-white mb-1"
                  style={{ fontFamily: "'Sora', sans-serif" }}
                >
                  Email
                </h3>
                <p className="text-gray-400">{contactEmail}</p>
              </div>
            </motion.div>

            <motion.div
              className="flex gap-4"
              variants={itemVariants}
            >
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{
                  background: "linear-gradient(135deg, #00D4E8 0%, #A855F7 100%)",
                }}
              >
                <Phone className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3
                  className="font-bold text-white mb-1"
                  style={{ fontFamily: "'Sora', sans-serif" }}
                >
                  WhatsApp
                </h3>
                <a
                  href="https://wa.me/5521986961362"
                  className="text-gray-400 hover:text-cyan-400 transition"
                >
                  +55 (21) 98696-1362
                </a>
              </div>
            </motion.div>

            <motion.div
              className="flex gap-4"
              variants={itemVariants}
            >
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{
                  background: "linear-gradient(135deg, #00D4E8 0%, #A855F7 100%)",
                }}
              >
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3
                  className="font-bold text-white mb-1"
                  style={{ fontFamily: "'Sora', sans-serif" }}
                >
                  Localização
                </h3>
                <p className="text-gray-400">Rio de Janeiro, RJ - Brasil</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Contact Form */}
          <motion.form
            onSubmit={handleSubmit}
            className="space-y-4"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div variants={itemVariants}>
              <label
                className="block text-white font-semibold mb-2"
                style={{ fontFamily: "'Sora', sans-serif" }}
              >
                Nome *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 transition"
                placeholder="Seu nome"
                style={{ fontFamily: "'Inter', sans-serif" }}
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <label
                className="block text-white font-semibold mb-2"
                style={{ fontFamily: "'Sora', sans-serif" }}
              >
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 transition"
                placeholder="seu@email.com"
                style={{ fontFamily: "'Inter', sans-serif" }}
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <label
                className="block text-white font-semibold mb-2"
                style={{ fontFamily: "'Sora', sans-serif" }}
              >
                Telefone (Opcional)
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 transition"
                placeholder="(21) 98696-1362"
                style={{ fontFamily: "'Inter', sans-serif" }}
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <label
                className="block text-white font-semibold mb-2"
                style={{ fontFamily: "'Sora', sans-serif" }}
              >
                Assunto *
              </label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 transition"
                placeholder="Qual é o assunto?"
                style={{ fontFamily: "'Inter', sans-serif" }}
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <label
                className="block text-white font-semibold mb-2"
                style={{ fontFamily: "'Sora', sans-serif" }}
              >
                Mensagem *
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={4}
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 transition resize-none"
                placeholder="Sua mensagem aqui..."
                style={{ fontFamily: "'Inter', sans-serif" }}
              />
            </motion.div>

            <motion.button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-lg font-semibold text-white transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              style={{
                background: "linear-gradient(135deg, #00D4E8 0%, #A855F7 100%)",
                fontFamily: "'Sora', sans-serif",
              }}
              variants={itemVariants}
            >
              <Send className="w-5 h-5" />
              {isLoading ? "Enviando..." : "Enviar Mensagem"}
            </motion.button>
          </motion.form>
        </div>
      </div>
    </section>
  );
}

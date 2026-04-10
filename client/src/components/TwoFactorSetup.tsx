import { useState } from "react";
import { motion } from "framer-motion";
import { X, Mail, Lock, Loader2, CheckCircle } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

interface TwoFactorSetupProps {
  isOpen: boolean;
  onClose: () => void;
}

type Step = "email" | "verify" | "success";

export default function TwoFactorSetup({ isOpen, onClose }: TwoFactorSetupProps) {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const enableMutation = trpc.twoFactor.enable.useMutation();
  const verifyMutation = trpc.twoFactor.verify.useMutation();

  const handleSendCode = async () => {
    if (!email) {
      toast.error("Digite um email válido");
      return;
    }

    setIsLoading(true);
    try {
      await enableMutation.mutateAsync({ email });
      toast.success("Código enviado para seu email!");
      setStep("verify");
    } catch (error) {
      toast.error("Erro ao enviar código");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (code.length !== 6) {
      toast.error("Digite um código com 6 dígitos");
      return;
    }

    setIsLoading(true);
    try {
      await verifyMutation.mutateAsync({ code });
      toast.success("Autenticação de 2 fatores ativada!");
      setStep("success");
      setTimeout(() => {
        onClose();
        setStep("email");
        setEmail("");
        setCode("");
      }, 2000);
    } catch (error) {
      toast.error("Código inválido ou expirado");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white dark:bg-[#1E2A4A] rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#00D4E8] to-[#A855F7] p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Lock className="w-6 h-6 text-white" />
            <h2 className="text-xl font-bold text-white" style={{ fontFamily: "'Sora', sans-serif" }}>
              Autenticação 2FA
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {step === "email" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <p className="text-gray-600 dark:text-gray-400" style={{ fontFamily: "'Inter', sans-serif" }}>
                Insira seu email para receber um código de verificação
              </p>
              <div>
                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2"
                  style={{ fontFamily: "'Sora', sans-serif" }}>
                  Email
                </label>
                <div className="flex items-center gap-3 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-[#0D1526]">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu@email.com"
                    className="flex-1 outline-none bg-transparent text-gray-900 dark:text-white"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  />
                </div>
              </div>
              <button
                onClick={handleSendCode}
                disabled={isLoading}
                className="w-full py-3 bg-gradient-to-r from-[#00D4E8] to-[#A855F7] text-white font-semibold rounded-lg hover:shadow-lg disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                style={{ fontFamily: "'Sora', sans-serif" }}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Mail className="w-4 h-4" />
                    Enviar Código
                  </>
                )}
              </button>
            </motion.div>
          )}

          {step === "verify" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <p className="text-gray-600 dark:text-gray-400" style={{ fontFamily: "'Inter', sans-serif" }}>
                Digite o código de 6 dígitos enviado para <strong>{email}</strong>
              </p>
              <div>
                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2"
                  style={{ fontFamily: "'Sora', sans-serif" }}>
                  Código de Verificação
                </label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  placeholder="000000"
                  maxLength={6}
                  className="w-full px-4 py-3 text-center text-2xl tracking-widest border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-[#0D1526] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00D4E8]"
                  style={{ fontFamily: "'Courier New', monospace" }}
                />
              </div>
              <button
                onClick={handleVerifyCode}
                disabled={isLoading || code.length !== 6}
                className="w-full py-3 bg-gradient-to-r from-[#00D4E8] to-[#A855F7] text-white font-semibold rounded-lg hover:shadow-lg disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                style={{ fontFamily: "'Sora', sans-serif" }}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Verificando...
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    Verificar Código
                  </>
                )}
              </button>
              <button
                onClick={() => {
                  setStep("email");
                  setCode("");
                }}
                className="w-full py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                style={{ fontFamily: "'Sora', sans-serif" }}
              >
                Voltar
              </button>
            </motion.div>
          )}

          {step === "success" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-4"
            >
              <div className="flex justify-center">
                <CheckCircle className="w-16 h-16 text-green-500" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white" style={{ fontFamily: "'Sora', sans-serif" }}>
                Autenticação Ativada!
              </h3>
              <p className="text-gray-600 dark:text-gray-400" style={{ fontFamily: "'Inter', sans-serif" }}>
                Sua conta agora está protegida com autenticação de dois fatores.
              </p>
            </motion.div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

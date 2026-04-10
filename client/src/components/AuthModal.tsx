import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, LogOut, LogIn, Shield, Loader2 } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { user, logout } = useAuth();
  const [showAdminRequest, setShowAdminRequest] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const requestAdminMutation = trpc.admin.requestAdminAccess.useMutation();

  const handleRequestAdmin = async () => {
    setIsLoading(true);
    try {
      await requestAdminMutation.mutateAsync();
      toast.success("Solicitação de acesso admin enviada para aprovação!");
      setShowAdminRequest(false);
    } catch (error) {
      toast.error("Erro ao solicitar acesso admin");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    toast.success("Desconectado com sucesso");
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md"
          >
            <div className="bg-white dark:bg-[#1A2035] rounded-2xl shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-[#00D4E8] to-[#A855F7] p-6 flex items-center justify-between">
                <h2 className="text-xl font-bold text-white" style={{ fontFamily: "'Sora', sans-serif" }}>
                  {user ? "Sua Conta" : "Autenticação"}
                </h2>
                <button
                  onClick={onClose}
                  className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6">
                {user ? (
                  <div className="space-y-4">
                    {/* User Info */}
                    <div className="bg-gray-50 dark:bg-[#0D1526] rounded-xl p-4">
                      <p className="text-sm text-gray-600 dark:text-gray-400" style={{ fontFamily: "'Inter', sans-serif" }}>
                        Conectado como
                      </p>
                      <p className="font-bold text-lg text-gray-900 dark:text-white" style={{ fontFamily: "'Sora', sans-serif" }}>
                        {user.name || user.email}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1" style={{ fontFamily: "'Inter', sans-serif" }}>
                        {user.email}
                      </p>
                      {user.role === "admin" && (
                        <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 bg-[#00D4E8]/20 text-[#00D4E8] rounded-full">
                          <Shield className="w-3 h-3" />
                          <span className="text-xs font-semibold" style={{ fontFamily: "'Sora', sans-serif" }}>
                            Administrador
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Admin Request or Panel */}
                    {user.role === "admin" ? (
                      <a
                        href="/admin"
                        className="w-full py-3 px-4 bg-gradient-to-r from-[#00D4E8] to-[#A855F7] text-white font-bold rounded-xl hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
                        style={{ fontFamily: "'Sora', sans-serif" }}
                      >
                        <Shield className="w-4 h-4" />
                        Ir para Painel Admin
                      </a>
                    ) : (
                      <button
                        onClick={() => setShowAdminRequest(!showAdminRequest)}
                        className="w-full py-3 px-4 bg-gray-100 dark:bg-[#1E2A4A] text-gray-900 dark:text-white font-bold rounded-xl hover:bg-gray-200 dark:hover:bg-[#253356] transition-colors"
                        style={{ fontFamily: "'Sora', sans-serif" }}
                      >
                        <Shield className="w-4 h-4 inline mr-2" />
                        Solicitar Acesso Admin
                      </button>
                    )}

                    {/* Admin Request Form */}
                    {showAdminRequest && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4"
                      >
                        <p className="text-sm text-blue-900 dark:text-blue-200 mb-3" style={{ fontFamily: "'Inter', sans-serif" }}>
                          Sua solicitação será revisada por um administrador. Você receberá uma notificação quando for aprovado.
                        </p>
                        <button
                          onClick={handleRequestAdmin}
                          disabled={isLoading}
                          className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
                          style={{ fontFamily: "'Sora', sans-serif" }}
                        >
                          {isLoading ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              Enviando...
                            </>
                          ) : (
                            <>
                              <Shield className="w-4 h-4" />
                              Enviar Solicitação
                            </>
                          )}
                        </button>
                      </motion.div>
                    )}

                    {/* Logout Button */}
                    <button
                      onClick={handleLogout}
                      className="w-full py-3 px-4 border-2 border-red-500 text-red-500 font-bold rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center justify-center gap-2"
                      style={{ fontFamily: "'Sora', sans-serif" }}
                    >
                      <LogOut className="w-4 h-4" />
                      Sair
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p className="text-gray-600 dark:text-gray-400 text-center" style={{ fontFamily: "'Inter', sans-serif" }}>
                      Faça login para acessar o painel administrativo e gerenciar o site.
                    </p>
                    <a
                      href={getLoginUrl()}
                      className="w-full py-3 px-4 bg-gradient-to-r from-[#00D4E8] to-[#A855F7] text-white font-bold rounded-xl hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
                      style={{ fontFamily: "'Sora', sans-serif" }}
                    >
                      <LogIn className="w-4 h-4" />
                      Fazer Login
                    </a>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

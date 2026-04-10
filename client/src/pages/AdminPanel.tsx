import { useAuth } from "@/_core/hooks/useAuth";
import { useInactivityLogout } from "@/hooks/useInactivityLogout";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Settings, Users, Palette, LogOut, Loader2, Check, X, Clock, Lock, Edit3 } from "lucide-react";
import EditHistoryViewer from "@/components/EditHistoryViewer";
import TwoFactorSetup from "@/components/TwoFactorSetup";
import UniversalContentEditor from "@/components/UniversalContentEditor";
import AnalyticsDashboard from "@/components/AnalyticsDashboard";
import { SettingsEditor } from "@/components/SettingsEditor";

type TabType = "requests" | "settings" | "theme" | "history" | "security" | "analytics" | "config";

export default function AdminPanel() {
  const { user } = useAuth();
  useInactivityLogout(); // Logout automático após 5 minutos de inatividade
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<TabType>("settings");
  const [isLoading, setIsLoading] = useState(false);
  const [showHistoryViewer, setShowHistoryViewer] = useState(false);
  const [show2FASetup, setShow2FASetup] = useState(false);
  const [selectedSection, setSelectedSection] = useState<{ key: string; name: string; content: Record<string, any> } | null>(null);

  // Fetch data
  const { data: pendingRequests, refetch: refetchRequests } = trpc.admin.getPendingRequests.useQuery(undefined, {
    enabled: user?.role === "admin",
  });

  const { data: themeSettings } = trpc.admin.getThemeSettings.useQuery();
  
  const { data: editHistory } = trpc.editHistory.getHistory.useQuery(
    { section: undefined },
    { enabled: user?.role === "admin" }
  );

  const { data: twoFactorSettings } = trpc.twoFactor.getSettings.useQuery();

  const { data: contentSections, refetch: refetchSections } = trpc.content.getAllSections.useQuery(undefined, {
    enabled: user?.role === "admin",
  });

  // Mutations
  const approveMutation = trpc.admin.approveRequest.useMutation();
  const rejectMutation = trpc.admin.rejectRequest.useMutation();
  const updateThemeMutation = trpc.admin.updateThemeSettings.useMutation();
  const disableTwoFactorMutation = trpc.twoFactor.disable.useMutation();
  const initializeSectionsMutation = trpc.initialization.initializeContentSections.useMutation();

  // Redirect if not admin
  useEffect(() => {
    if (user && user.role !== "admin") {
      setLocation("/");
      toast.error("Acesso negado. Apenas administradores podem acessar esta página.");
    }
  }, [user, setLocation]);

  const handleApprove = async (requestId: number) => {
    setIsLoading(true);
    try {
      await approveMutation.mutateAsync({ requestId });
      toast.success("Solicitação aprovada!");
      refetchRequests();
    } catch (error) {
      toast.error("Erro ao aprovar solicitação");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReject = async (requestId: number) => {
    setIsLoading(true);
    try {
      await rejectMutation.mutateAsync({
        requestId,
        reason: "Solicitação rejeitada pelo administrador",
      });
      toast.success("Solicitação rejeitada");
      refetchRequests();
    } catch (error) {
      toast.error("Erro ao rejeitar solicitação");
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleDarkMode = async () => {
    setIsLoading(true);
    try {
      await updateThemeMutation.mutateAsync({
        darkModeEnabled: !themeSettings?.darkModeEnabled,
      });
      toast.success("Tema atualizado!");
    } catch (error) {
      toast.error("Erro ao atualizar tema");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisableTwoFactor = async () => {
    setIsLoading(true);
    try {
      await disableTwoFactorMutation.mutateAsync();
      toast.success("Autenticação 2FA desativada");
    } catch (error) {
      toast.error("Erro ao desativar 2FA");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditSection = (section: any) => {
    // Redirecionar para página de edição detalhada
    setLocation(`/edit-section?section=${section.sectionKey}`);
  };

  const handleCloseEditor = () => {
    setSelectedSection(null);
    refetchSections();
  };

  if (!user || user.role !== "admin") {
    return null;
  }

  const tabs = [
    { id: "requests" as TabType, label: "Solicitações de Admin", icon: Users },
    { id: "settings" as TabType, label: "Editar Conteúdo", icon: Edit3 },
    { id: "theme" as TabType, label: "Tema e Cores", icon: Palette },
    { id: "analytics" as TabType, label: "Analytics", icon: Settings },
    { id: "config" as TabType, label: "Configurações", icon: Settings },
    { id: "history" as TabType, label: "Histórico de Edições", icon: Clock },
    { id: "security" as TabType, label: "Segurança", icon: Lock },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAF8F5] to-[#F0E9E0] dark:from-[#0D1526] dark:to-[#1A2035]">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#00D4E8] to-[#A855F7] text-white">
        <div className="container mx-auto px-4 max-w-7xl py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold" style={{ fontFamily: "'Sora', sans-serif" }}>
                Painel de Administração
              </h1>
              <p className="text-white/80 mt-2" style={{ fontFamily: "'Inter', sans-serif" }}>
                Bem-vindo, {user.name || user.email}
              </p>
            </div>
            <button
              onClick={() => setLocation("/")}
              className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
              style={{ fontFamily: "'Sora', sans-serif" }}
            >
              <LogOut className="w-4 h-4" />
              Voltar ao Site
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="container mx-auto px-4 max-w-7xl mt-8">
        <div className="flex gap-4 mb-8 border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 font-semibold border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? "border-[#00D4E8] text-[#00D4E8]"
                  : "border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
              }`}
              style={{ fontFamily: "'Sora', sans-serif" }}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          {/* Requests Tab */}
          {activeTab === "requests" && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6" style={{ fontFamily: "'Sora', sans-serif" }}>
                Solicitações de Acesso Admin
              </h2>

              {!pendingRequests || pendingRequests.length === 0 ? (
                <div className="text-center py-12 bg-white dark:bg-[#1E2A4A] rounded-xl">
                  <p className="text-gray-500 dark:text-gray-400" style={{ fontFamily: "'Inter', sans-serif" }}>
                    Nenhuma solicitação pendente
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {pendingRequests.map((request) => (
                    <motion.div
                      key={request.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="bg-white dark:bg-[#1E2A4A] rounded-xl p-4 flex items-center justify-between"
                    >
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white" style={{ fontFamily: "'Sora', sans-serif" }}>
                          {request.name || "Usuário"}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400" style={{ fontFamily: "'Inter', sans-serif" }}>
                          {request.email}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleApprove(request.id)}
                          disabled={isLoading}
                          className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 disabled:bg-green-400 text-white rounded-lg transition-colors"
                          style={{ fontFamily: "'Sora', sans-serif" }}
                        >
                          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                          Aprovar
                        </button>
                        <button
                          onClick={() => handleReject(request.id)}
                          disabled={isLoading}
                          className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 disabled:bg-red-400 text-white rounded-lg transition-colors"
                          style={{ fontFamily: "'Sora', sans-serif" }}
                        >
                          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <X className="w-4 h-4" />}
                          Rejeitar
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Settings Tab - Content Sections */}
          {activeTab === "settings" && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6" style={{ fontFamily: "'Sora', sans-serif" }}>
                Editar Conteúdo do Site
              </h2>

              {!contentSections || contentSections.length === 0 ? (
                <div className="text-center py-12 bg-white dark:bg-[#1E2A4A] rounded-xl">
                  <p className="text-gray-500 dark:text-gray-400 mb-4" style={{ fontFamily: "'Inter', sans-serif" }}>
                    Nenhuma seção disponível
                  </p>
                  <button
                    onClick={() => {
                      initializeSectionsMutation.mutate(undefined, {
                        onSuccess: () => {
                          toast.success("Seções inicializadas com sucesso!");
                          refetchSections();
                        },
                        onError: () => {
                          toast.error("Erro ao inicializar seções");
                        },
                      });
                    }}
                    disabled={initializeSectionsMutation.isPending}
                    className="mt-4 px-6 py-2 bg-gradient-to-r from-[#00D4E8] to-[#A855F7] text-white font-semibold rounded-lg hover:shadow-lg transition-all"
                    style={{ fontFamily: "'Sora', sans-serif" }}
                  >
                    Inicializar Seções
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {contentSections.map((section) => (
                    <motion.div
                      key={section.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white dark:bg-[#1E2A4A] rounded-xl p-6 hover:shadow-lg transition-all cursor-pointer"
                      onClick={() => handleEditSection(section)}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-bold text-gray-900 dark:text-white" style={{ fontFamily: "'Sora', sans-serif" }}>
                            {section.sectionName}
                          </h3>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1" style={{ fontFamily: "'Inter', sans-serif" }}>
                            {section.sectionType}
                          </p>
                        </div>
                        <Edit3 className="w-5 h-5 text-[#00D4E8]" />
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-4" style={{ fontFamily: "'Inter', sans-serif" }}>
                        Última atualização: {new Date(section.updatedAt).toLocaleDateString("pt-BR")}
                      </p>
                      <button
                        className="w-full py-2 px-4 bg-gradient-to-r from-[#00D4E8] to-[#A855F7] text-white font-semibold rounded-lg hover:shadow-lg transition-all"
                        style={{ fontFamily: "'Sora', sans-serif" }}
                      >
                        Editar
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Theme Tab */}
          {activeTab === "theme" && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6" style={{ fontFamily: "'Sora', sans-serif" }}>
                Configurações de Tema
              </h2>
              <div className="bg-white dark:bg-[#1E2A4A] rounded-xl p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white" style={{ fontFamily: "'Sora', sans-serif" }}>
                        Modo Escuro
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400" style={{ fontFamily: "'Inter', sans-serif" }}>
                        {themeSettings?.darkModeEnabled ? "Ativado" : "Desativado"}
                      </p>
                    </div>
                    <button
                      onClick={handleToggleDarkMode}
                      disabled={isLoading}
                      className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                        themeSettings?.darkModeEnabled
                          ? "bg-blue-500 hover:bg-blue-600 text-white"
                          : "bg-gray-200 hover:bg-gray-300 text-gray-900"
                      }`}
                      style={{ fontFamily: "'Sora', sans-serif" }}
                    >
                      {isLoading ? <Loader2 className="w-4 h-4 animate-spin inline" /> : themeSettings?.darkModeEnabled ? "Desativar" : "Ativar"}
                    </button>
                  </div>

                  <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <p className="font-semibold text-gray-900 dark:text-white mb-4" style={{ fontFamily: "'Sora', sans-serif" }}>
                      Cores do Tema
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>
                          Cor Primária
                        </p>
                        <div
                          className="w-full h-12 rounded-lg border-2 border-gray-200 dark:border-gray-700"
                          style={{ backgroundColor: themeSettings?.primaryColor }}
                        />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>
                          Cor Secundária
                        </p>
                        <div
                          className="w-full h-12 rounded-lg border-2 border-gray-200 dark:border-gray-700"
                          style={{ backgroundColor: themeSettings?.secondaryColor }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Config Tab - WhatsApp and Email Settings */}
          {activeTab === "config" && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6" style={{ fontFamily: "'Sora', sans-serif" }}>
                Configurações
              </h2>
              <SettingsEditor />
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === "analytics" && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6" style={{ fontFamily: "'Sora', sans-serif" }}>
                Dashboard de Analytics
              </h2>
              <AnalyticsDashboard />
            </div>
          )}

          {/* History Tab */}
          {activeTab === "history" && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6" style={{ fontFamily: "'Sora', sans-serif" }}>
                Histórico de Edições
              </h2>
              <div className="bg-white dark:bg-[#1E2A4A] rounded-xl p-6">
                <button
                  onClick={() => setShowHistoryViewer(true)}
                  className="w-full py-3 px-4 bg-gradient-to-r from-[#00D4E8] to-[#A855F7] text-white font-semibold rounded-lg hover:shadow-lg transition-all"
                  style={{ fontFamily: "'Sora', sans-serif" }}
                >
                  Ver Histórico Completo ({editHistory?.length || 0} alterações)
                </button>
                <p className="text-gray-600 dark:text-gray-400 mt-4" style={{ fontFamily: "'Inter', sans-serif" }}>
                  Visualize todas as alterações feitas no site, quem fez, quando e com opção de reverter mudanças.
                </p>
              </div>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === "security" && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6" style={{ fontFamily: "'Sora', sans-serif" }}>
                Segurança
              </h2>
              <div className="bg-white dark:bg-[#1E2A4A] rounded-xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white" style={{ fontFamily: "'Sora', sans-serif" }}>
                      Autenticação de 2 Fatores (2FA)
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400" style={{ fontFamily: "'Inter', sans-serif" }}>
                      {twoFactorSettings?.twoFactorEnabled ? "Ativada via email" : "Desativada"}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {twoFactorSettings?.twoFactorEnabled ? (
                      <button
                        onClick={handleDisableTwoFactor}
                        disabled={isLoading}
                        className="px-4 py-2 bg-red-500 hover:bg-red-600 disabled:bg-red-400 text-white font-semibold rounded-lg transition-colors"
                        style={{ fontFamily: "'Sora', sans-serif" }}
                      >
                        Desativar
                      </button>
                    ) : (
                      <button
                        onClick={() => setShow2FASetup(true)}
                        className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-colors"
                        style={{ fontFamily: "'Sora', sans-serif" }}
                      >
                        Ativar 2FA
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Modals */}


      {showHistoryViewer && editHistory && (
        <EditHistoryViewer
          history={editHistory}
          onClose={() => setShowHistoryViewer(false)}
        />
      )}

      {show2FASetup && (
        <TwoFactorSetup
          isOpen={show2FASetup}
          onClose={() => setShow2FASetup(false)}
        />
      )}
    </div>
  );
}

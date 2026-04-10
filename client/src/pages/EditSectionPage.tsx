import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import UniversalContentEditor from "@/components/UniversalContentEditor";

export default function EditSectionPage() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [sectionKey, setSectionKey] = useState<string | null>(null);
  const [section, setSection] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Extrair sectionKey da URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const key = params.get("section");
    if (key) {
      setSectionKey(key);
    }
  }, []);

  // Fetch seção específica
  const { data: sectionData } = trpc.content.getSectionByKey.useQuery(
    { sectionKey: sectionKey || "" },
    { enabled: !!sectionKey && user?.role === "admin" }
  );

  useEffect(() => {
    if (sectionData) {
      setSection(sectionData);
      setIsLoading(false);
    }
  }, [sectionData]);

  const updateMutation = trpc.content.updateSection.useMutation();

  const handleSave = async (updatedContent: any) => {
    if (!sectionKey) return;

    setIsSaving(true);
    try {
      await updateMutation.mutateAsync({
        sectionKey,
        content: updatedContent,
        description: `Editado via página de edição detalhada`,
      });
      toast.success("Seção atualizada com sucesso!");
      setSection({ ...section, content: updatedContent });
    } catch (error) {
      toast.error("Erro ao atualizar seção");
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-foreground mb-4">Acesso negado. Apenas admins podem editar seções.</p>
          <button
            onClick={() => setLocation("/")}
            className="px-6 py-2 bg-gradient-to-r from-[#00D4E8] to-[#A855F7] text-white rounded-lg"
          >
            Voltar ao Home
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-[#00D4E8]" />
      </div>
    );
  }

  if (!section) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-foreground mb-4">Seção não encontrada</p>
          <button
            onClick={() => setLocation("/admin?tab=settings")}
            className="px-6 py-2 bg-gradient-to-r from-[#00D4E8] to-[#A855F7] text-white rounded-lg"
          >
            Voltar ao Admin
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#00D4E8] to-[#A855F7] text-white p-6">
        <div className="container mx-auto max-w-7xl flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setLocation("/admin?tab=settings")}
              className="flex items-center gap-2 hover:opacity-80 transition"
            >
              <ArrowLeft className="w-5 h-5" />
              Voltar
            </button>
            <div>
              <h1 className="text-3xl font-bold" style={{ fontFamily: "'Sora', sans-serif" }}>
                Editar: {section.sectionName}
              </h1>
              <p className="text-sm opacity-90">Tipo: {section.sectionType}</p>
            </div>
          </div>
          <button
            onClick={() => handleSave(section.content)}
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-2 bg-white text-[#00D4E8] font-semibold rounded-lg hover:bg-opacity-90 transition disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Salvar
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto max-w-7xl py-8 px-4">
        <div className="bg-white dark:bg-[#1E2A4A] rounded-xl p-8 shadow-lg">
          <div className="space-y-6">
            {/* Preview JSON */}
            <div>
              <h2 className="text-xl font-bold mb-4" style={{ fontFamily: "'Sora', sans-serif" }}>
                Conteúdo Atual
              </h2>
              <pre className="bg-gray-100 dark:bg-[#0D1526] p-4 rounded-lg overflow-auto max-h-96 text-xs">
                {JSON.stringify(section.content, null, 2)}
              </pre>
            </div>

            {/* Editor */}
            <div>
              <h2 className="text-xl font-bold mb-4" style={{ fontFamily: "'Sora', sans-serif" }}>
                Editor Visual
              </h2>
              <div className="bg-gray-50 dark:bg-[#0D1526] p-6 rounded-lg">
                <UniversalContentEditor
                  sectionKey={sectionKey || ""}
                  sectionName={section.sectionName}
                  initialContent={section.content}
                  onClose={() => {}}
                />
              </div>
            </div>

            {/* Metadata */}
            <div className="border-t pt-6">
              <h3 className="font-semibold mb-3" style={{ fontFamily: "'Sora', sans-serif" }}>
                Informações da Seção
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600 dark:text-gray-400">Chave</p>
                  <p className="font-mono">{section.sectionKey}</p>
                </div>
                <div>
                  <p className="text-gray-600 dark:text-gray-400">Tipo</p>
                  <p>{section.sectionType}</p>
                </div>
                <div>
                  <p className="text-gray-600 dark:text-gray-400">Criado em</p>
                  <p>{new Date(section.createdAt).toLocaleDateString("pt-BR")}</p>
                </div>
                <div>
                  <p className="text-gray-600 dark:text-gray-400">Atualizado em</p>
                  <p>{new Date(section.updatedAt).toLocaleDateString("pt-BR")}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

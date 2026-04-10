import { useState } from "react";
import { motion } from "framer-motion";
import { Save, X, Eye, Code, Type, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";

interface ContentEditorProps {
  section: string;
  initialContent: Record<string, any>;
  onSave: (content: Record<string, any>) => Promise<void>;
  onClose: () => void;
}

export default function ContentEditor({
  section,
  initialContent,
  onSave,
  onClose,
}: ContentEditorProps) {
  const [content, setContent] = useState(initialContent);
  const [preview, setPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(content);
      toast.success("Conteúdo salvo com sucesso!");
      onClose();
    } catch (error) {
      toast.error("Erro ao salvar conteúdo");
    } finally {
      setIsSaving(false);
    }
  };

  const handleFieldChange = (key: string, value: any) => {
    setContent((prev: any) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
    >
      <div className="bg-white dark:bg-[#1E2A4A] rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#00D4E8] to-[#A855F7] p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white" style={{ fontFamily: "'Sora', sans-serif" }}>
            Editar: {section}
          </h2>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#0D1526]">
          <button
            onClick={() => setPreview(false)}
            className={`flex items-center gap-2 px-6 py-3 font-semibold transition-colors ${
              !preview
                ? "text-[#00D4E8] border-b-2 border-[#00D4E8]"
                : "text-gray-600 dark:text-gray-400"
            }`}
            style={{ fontFamily: "'Sora', sans-serif" }}
          >
            <Code className="w-4 h-4" />
            Editar
          </button>
          <button
            onClick={() => setPreview(true)}
            className={`flex items-center gap-2 px-6 py-3 font-semibold transition-colors ${
              preview
                ? "text-[#00D4E8] border-b-2 border-[#00D4E8]"
                : "text-gray-600 dark:text-gray-400"
            }`}
            style={{ fontFamily: "'Sora', sans-serif" }}
          >
            <Eye className="w-4 h-4" />
            Visualizar
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {!preview ? (
            <div className="space-y-6">
              {Object.entries(content).map(([key, value]) => (
                <div key={key}>
                  <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2"
                    style={{ fontFamily: "'Sora', sans-serif" }}>
                    {key.replace(/([A-Z])/g, " $1").trim()}
                  </label>

                  {typeof value === "string" && value.includes("\n") ? (
                    // Textarea for multiline text
                    <textarea
                      value={value}
                      onChange={(e) => handleFieldChange(key, e.target.value)}
                      className="w-full h-32 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-[#0D1526] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00D4E8]"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    />
                  ) : typeof value === "string" && value.startsWith("http") ? (
                    // Image input for URLs
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={value}
                        onChange={(e) => handleFieldChange(key, e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-[#0D1526] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00D4E8]"
                        style={{ fontFamily: "'Inter', sans-serif" }}
                      />
                      {value && (
                        <img
                          src={value}
                          alt="Preview"
                          className="w-full max-h-48 object-cover rounded-lg"
                        />
                      )}
                    </div>
                  ) : typeof value === "number" ? (
                    // Number input for prices
                    <input
                      type="number"
                      value={value}
                      onChange={(e) => handleFieldChange(key, parseFloat(e.target.value))}
                      step="0.01"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-[#0D1526] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00D4E8]"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    />
                  ) : (
                    // Text input for simple strings
                    <input
                      type="text"
                      value={value}
                      onChange={(e) => handleFieldChange(key, e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-[#0D1526] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00D4E8]"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    />
                  )}
                </div>
              ))}
            </div>
          ) : (
            // Preview mode
            <div className="bg-gray-50 dark:bg-[#0D1526] rounded-lg p-6 space-y-4">
              {Object.entries(content).map(([key, value]) => (
                <div key={key}>
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2">
                    {key}
                  </p>
                  {typeof value === "string" && value.startsWith("http") ? (
                    <img
                      src={value}
                      alt={key}
                      className="w-full max-h-64 object-cover rounded-lg"
                    />
                  ) : (
                    <p className="text-gray-900 dark:text-white" style={{ fontFamily: "'Inter', sans-serif" }}>
                      {value}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 dark:bg-[#0D1526] border-t border-gray-200 dark:border-gray-700 p-6 flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 border-2 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white font-semibold rounded-lg hover:bg-gray-100 dark:hover:bg-[#1A2035] transition-colors"
            style={{ fontFamily: "'Sora', sans-serif" }}
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-[#00D4E8] to-[#A855F7] text-white font-semibold rounded-lg hover:shadow-lg disabled:opacity-50 transition-all"
            style={{ fontFamily: "'Sora', sans-serif" }}
          >
            <Save className="w-4 h-4" />
            {isSaving ? "Salvando..." : "Salvar"}
          </button>
        </div>
      </div>
    </motion.div>
  );
}

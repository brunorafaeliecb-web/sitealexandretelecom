import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Save, X, Eye, Code, Plus, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

interface ContentField {
  key: string;
  label: string;
  type: "text" | "textarea" | "number" | "color" | "image" | "url" | "email" | "boolean";
  value: any;
  required?: boolean;
}

interface UniversalContentEditorProps {
  sectionKey: string;
  sectionName: string;
  initialContent: Record<string, any>;
  onClose: () => void;
}

export default function UniversalContentEditor({
  sectionKey,
  sectionName,
  initialContent,
  onClose,
}: UniversalContentEditorProps) {
  const [content, setContent] = useState(initialContent);
  const [preview, setPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [expandedArrays, setExpandedArrays] = useState<Set<string>>(new Set());

  const updateMutation = trpc.content.updateSection.useMutation();

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateMutation.mutateAsync({
        sectionKey,
        content,
        description: `Edited ${sectionName} section`,
      });
      toast.success("Conteúdo salvo com sucesso!");
      onClose();
    } catch (error) {
      toast.error("Erro ao salvar conteúdo");
      console.error(error);
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

  const handleArrayItemChange = (arrayKey: string, index: number, field: string, value: any) => {
    setContent((prev: any) => ({
      ...prev,
      [arrayKey]: prev[arrayKey].map((item: any, i: number) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }));
  };

  const handleAddArrayItem = (arrayKey: string) => {
    setContent((prev: any) => ({
      ...prev,
      [arrayKey]: [...(prev[arrayKey] || []), {}],
    }));
  };

  const handleRemoveArrayItem = (arrayKey: string, index: number) => {
    setContent((prev: any) => ({
      ...prev,
      [arrayKey]: prev[arrayKey].filter((_: any, i: number) => i !== index),
    }));
  };

  const toggleArrayExpanded = (key: string) => {
    setExpandedArrays((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  const renderField = (key: string, value: any, depth = 0) => {
    if (Array.isArray(value)) {
      const isExpanded = expandedArrays.has(key);
      return (
        <div key={key} className="space-y-2 ml-4 border-l-2 border-[#00D4E8] pl-4">
          <button
            onClick={() => toggleArrayExpanded(key)}
            className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white hover:text-[#00D4E8] transition-colors"
            style={{ fontFamily: "'Sora', sans-serif" }}
          >
            {isExpanded ? "▼" : "▶"} {key} ({value.length} items)
          </button>

          {isExpanded && (
            <div className="space-y-3">
              {value.map((item: any, index: number) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-gray-100 dark:bg-[#0D1526] rounded-lg p-3 space-y-2"
                >
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-semibold text-gray-600 dark:text-gray-400">
                      Item {index + 1}
                    </p>
                    <button
                      onClick={() => handleRemoveArrayItem(key, index)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {typeof item === "object" && item !== null ? (
                    Object.entries(item).map(([itemKey, itemValue]: [string, any]) => (
                      <div key={itemKey}>
                        <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1"
                          style={{ fontFamily: "'Sora', sans-serif" }}>
                          {itemKey}
                        </label>
                        <input
                          type={typeof itemValue === "number" ? "number" : "text"}
                          value={itemValue || ""}
                          onChange={(e) =>
                            handleArrayItemChange(key, index, itemKey, e.target.value)
                          }
                          className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-[#1A2035] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00D4E8]"
                          style={{ fontFamily: "'Inter', sans-serif" }}
                        />
                      </div>
                    ))
                  ) : (
                    <input
                      type="text"
                      value={item || ""}
                      onChange={(e) =>
                        handleArrayItemChange(key, index, "", e.target.value)
                      }
                      className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-[#1A2035] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00D4E8]"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    />
                  )}
                </motion.div>
              ))}

              <button
                onClick={() => handleAddArrayItem(key)}
                className="flex items-center gap-2 px-3 py-1 text-sm bg-green-500 hover:bg-green-600 text-white font-semibold rounded transition-colors"
                style={{ fontFamily: "'Sora', sans-serif" }}
              >
                <Plus className="w-3 h-3" />
                Adicionar Item
              </button>
            </div>
          )}
        </div>
      );
    }

    if (typeof value === "object" && value !== null) {
      return (
        <div key={key} className="space-y-2 ml-4 border-l-2 border-[#A855F7] pl-4">
          <p className="text-sm font-semibold text-gray-900 dark:text-white" style={{ fontFamily: "'Sora', sans-serif" }}>
            {key}
          </p>
          {Object.entries(value).map(([subKey, subValue]: [string, any]) =>
            renderField(subKey, subValue, depth + 1)
          )}
        </div>
      );
    }

    return (
      <div key={key}>
        <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2"
          style={{ fontFamily: "'Sora', sans-serif" }}>
          {key}
        </label>

        {typeof value === "string" && value.includes("\n") ? (
          <textarea
            value={value}
            onChange={(e) => handleFieldChange(key, e.target.value)}
            className="w-full h-24 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-[#0D1526] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00D4E8]"
            style={{ fontFamily: "'Inter', sans-serif" }}
          />
        ) : typeof value === "string" && (value.startsWith("http") || value.startsWith("#")) ? (
          <div className="space-y-2">
            <input
              type={value.startsWith("#") ? "color" : "text"}
              value={value}
              onChange={(e) => handleFieldChange(key, e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-[#0D1526] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00D4E8]"
              style={{ fontFamily: "'Inter', sans-serif" }}
            />
            {value.startsWith("http") && (
              <img
                src={value}
                alt="Preview"
                className="w-full max-h-32 object-cover rounded-lg"
              />
            )}
          </div>
        ) : typeof value === "number" ? (
          <input
            type="number"
            value={value}
            onChange={(e) => handleFieldChange(key, parseFloat(e.target.value) || 0)}
            step="0.01"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-[#0D1526] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00D4E8]"
            style={{ fontFamily: "'Inter', sans-serif" }}
          />
        ) : typeof value === "boolean" ? (
          <input
            type="checkbox"
            checked={value}
            onChange={(e) => handleFieldChange(key, e.target.checked)}
            className="w-4 h-4 rounded border-gray-300 text-[#00D4E8] focus:ring-[#00D4E8]"
          />
        ) : (
          <input
            type="text"
            value={value || ""}
            onChange={(e) => handleFieldChange(key, e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-[#0D1526] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00D4E8]"
            style={{ fontFamily: "'Inter', sans-serif" }}
          />
        )}
      </div>
    );
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
            Editar: {sectionName}
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
              {Object.entries(content).map(([key, value]) => renderField(key, value))}
            </div>
          ) : (
            <div className="bg-gray-50 dark:bg-[#0D1526] rounded-lg p-6 space-y-4">
              <pre className="bg-white dark:bg-[#1A2035] p-4 rounded-lg overflow-auto text-sm text-gray-900 dark:text-white"
                style={{ fontFamily: "'Courier New', monospace" }}>
                {JSON.stringify(content, null, 2)}
              </pre>
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
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Salvando...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Salvar
              </>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
}

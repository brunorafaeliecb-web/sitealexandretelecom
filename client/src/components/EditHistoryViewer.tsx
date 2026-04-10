import { motion } from "framer-motion";
import { X, RotateCcw, Clock, User, FileText } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface EditHistoryItem {
  id: number;
  section: string;
  userId: number;
  userName: string | null;
  userEmail: string | null;
  changeType: "create" | "update" | "delete";
  oldValue: any;
  newValue: any;
  description: string | null;
  createdAt: Date;
}

interface EditHistoryViewerProps {
  history: EditHistoryItem[];
  onClose: () => void;
  onRevert?: (historyId: number) => Promise<void>;
}

const changeTypeColors = {
  create: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  update: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  delete: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
};

const changeTypeLabels = {
  create: "Criado",
  update: "Atualizado",
  delete: "Deletado",
};

export default function EditHistoryViewer({
  history,
  onClose,
  onRevert,
}: EditHistoryViewerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
    >
      <div className="bg-white dark:bg-[#1E2A4A] rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#00D4E8] to-[#A855F7] p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Clock className="w-6 h-6 text-white" />
            <h2 className="text-2xl font-bold text-white" style={{ fontFamily: "'Sora', sans-serif" }}>
              Histórico de Alterações
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {history.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400" style={{ fontFamily: "'Inter', sans-serif" }}>
                Nenhuma alteração registrada
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {history.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-gray-50 dark:bg-[#0D1526] rounded-lg p-4 border-l-4 border-[#00D4E8]"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            changeTypeColors[item.changeType]
                          }`}
                          style={{ fontFamily: "'Sora', sans-serif" }}
                        >
                          {changeTypeLabels[item.changeType]}
                        </span>
                        <span className="text-sm font-semibold text-gray-900 dark:text-white"
                          style={{ fontFamily: "'Sora', sans-serif" }}>
                          {item.section}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400 mb-2"
                        style={{ fontFamily: "'Inter', sans-serif" }}>
                        <User className="w-3 h-3" />
                        <span>{item.userName || item.userEmail || "Sistema"}</span>
                        <span>•</span>
                        <Clock className="w-3 h-3" />
                        <span>
                          {format(new Date(item.createdAt), "dd 'de' MMMM 'às' HH:mm", { locale: ptBR })}
                        </span>
                      </div>

                      {item.description && (
                        <p className="text-sm text-gray-700 dark:text-gray-300 mb-2"
                          style={{ fontFamily: "'Inter', sans-serif" }}>
                          {item.description}
                        </p>
                      )}

                      {/* Show changes */}
                      {item.changeType === "update" && (
                        <div className="mt-3 space-y-2 text-xs">
                          {item.oldValue && (
                            <div className="bg-red-50 dark:bg-red-900/20 p-2 rounded border border-red-200 dark:border-red-800">
                              <p className="font-semibold text-red-900 dark:text-red-400 mb-1">Antes:</p>
                              <pre className="text-red-800 dark:text-red-300 overflow-auto max-h-20"
                                style={{ fontFamily: "'Courier New', monospace" }}>
                                {JSON.stringify(item.oldValue, null, 2)}
                              </pre>
                            </div>
                          )}
                          {item.newValue && (
                            <div className="bg-green-50 dark:bg-green-900/20 p-2 rounded border border-green-200 dark:border-green-800">
                              <p className="font-semibold text-green-900 dark:text-green-400 mb-1">Depois:</p>
                              <pre className="text-green-800 dark:text-green-300 overflow-auto max-h-20"
                                style={{ fontFamily: "'Courier New', monospace" }}>
                                {JSON.stringify(item.newValue, null, 2)}
                              </pre>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {onRevert && item.changeType === "update" && (
                      <button
                        onClick={() => onRevert(item.id)}
                        className="ml-4 flex items-center gap-2 px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold rounded transition-colors"
                        style={{ fontFamily: "'Sora', sans-serif" }}
                      >
                        <RotateCcw className="w-3 h-3" />
                        Reverter
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 dark:bg-[#0D1526] border-t border-gray-200 dark:border-gray-700 p-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gradient-to-r from-[#00D4E8] to-[#A855F7] text-white font-semibold rounded-lg hover:shadow-lg transition-all"
            style={{ fontFamily: "'Sora', sans-serif" }}
          >
            Fechar
          </button>
        </div>
      </div>
    </motion.div>
  );
}

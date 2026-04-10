import { useEffect, useRef } from "react";
import { useAuth } from "@/_core/hooks/useAuth";

const INACTIVITY_TIMEOUT = 5 * 60 * 1000; // 5 minutos em milissegundos

export function useInactivityLogout() {
  const { logout, isAuthenticated } = useAuth();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastActivityRef = useRef<number>(Date.now());

  const resetTimeout = () => {
    // Limpar timeout anterior
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Atualizar tempo da última atividade
    lastActivityRef.current = Date.now();

    // Definir novo timeout
    timeoutRef.current = setTimeout(() => {
      if (isAuthenticated) {
        logout?.();
        // Mostrar notificação (opcional)
        console.log("Sessão expirada por inatividade");
      }
    }, INACTIVITY_TIMEOUT);
  };

  useEffect(() => {
    if (!isAuthenticated) {
      // Se não autenticado, limpar timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      return;
    }

    // Inicializar timeout
    resetTimeout();

    // Eventos que indicam atividade do usuário
    const events = ["mousedown", "keydown", "scroll", "touchstart", "click"];

    const handleActivity = () => {
      resetTimeout();
    };

    // Adicionar listeners para eventos de atividade
    events.forEach((event) => {
      document.addEventListener(event, handleActivity);
    });

    // Cleanup
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      events.forEach((event) => {
        document.removeEventListener(event, handleActivity);
      });
    };
  }, [isAuthenticated, logout]);
}

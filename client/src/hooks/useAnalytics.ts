import { useEffect } from "react";

/**
 * Hook para rastreamento de eventos com Google Analytics
 * Integra Google Analytics 4 (GA4) no site
 */

declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

/**
 * Inicializar Google Analytics
 * Deve ser chamado uma vez no App.tsx
 */
export function useGoogleAnalytics(measurementId: string) {
  useEffect(() => {
    if (!measurementId || typeof window === "undefined") {
      console.warn("[Analytics] Measurement ID não configurado ou window não disponível");
      return;
    }

    // Evitar inicializar múltiplas vezes
    if ("gtag" in window) {
      return;
    }

    // Criar dataLayer
    (window as any).dataLayer = (window as any).dataLayer || [];

    // Função gtag
    function gtag(...args: any[]) {
      (window as any).dataLayer.push(arguments);
    }

    (window as any).gtag = gtag;
    gtag("js", new Date());
    gtag("config", measurementId, {
      page_path: (window as any).location?.pathname || "/",
    });

    // Carregar script do Google Analytics
    if (typeof document !== "undefined") {
      const script = document.createElement("script");
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
      document.head.appendChild(script);
    }

    console.log("[Analytics] Google Analytics inicializado:", measurementId);
  }, [measurementId]);
}

/**
 * Rastrear evento customizado
 */
export function trackEvent(
  eventName: string,
  eventData?: Record<string, any>
) {
  if (!window.gtag) {
    console.warn("[Analytics] Google Analytics não inicializado");
    return;
  }

  window.gtag("event", eventName, eventData);
  console.log("[Analytics] Event tracked:", eventName, eventData);
}

/**
 * Rastrear visualização de página
 */
export function trackPageView(pagePath: string, pageTitle?: string) {
  if (!window.gtag) {
    console.warn("[Analytics] Google Analytics não inicializado");
    return;
  }

  window.gtag("event", "page_view", {
    page_path: pagePath,
    page_title: pageTitle || document.title,
  });

  console.log("[Analytics] Page view tracked:", pagePath);
}

/**
 * Rastrear conversão (envio de formulário, clique em CTA, etc)
 */
export function trackConversion(
  conversionName: string,
  value?: number,
  currency?: string
) {
  if (!window.gtag) {
    console.warn("[Analytics] Google Analytics não inicializado");
    return;
  }

  window.gtag("event", "conversion", {
    conversion_name: conversionName,
    value: value,
    currency: currency || "BRL",
  });

  console.log("[Analytics] Conversion tracked:", conversionName);
}

/**
 * Rastrear clique em link externo (WhatsApp, etc)
 */
export function trackExternalLink(url: string, linkText?: string) {
  if (!window.gtag) {
    console.warn("[Analytics] Google Analytics não inicializado");
    return;
  }

  window.gtag("event", "click", {
    link_url: url,
    link_text: linkText,
    event_category: "external_link",
  });

  console.log("[Analytics] External link tracked:", url);
}

/**
 * Rastrear busca por CEP
 */
export function trackCEPSearch(cep: string, success: boolean) {
  if (!window.gtag) {
    console.warn("[Analytics] Google Analytics não inicializado");
    return;
  }

  window.gtag("event", "search", {
    search_term: cep,
    search_type: "cep",
    success: success,
  });

  console.log("[Analytics] CEP search tracked:", cep, success);
}

/**
 * Rastrear envio de formulário de contato
 */
export function trackContactForm(formType: string, success: boolean) {
  if (!window.gtag) {
    console.warn("[Analytics] Google Analytics não inicializado");
    return;
  }

  window.gtag("event", "form_submit", {
    form_type: formType,
    success: success,
  });

  console.log("[Analytics] Contact form tracked:", formType, success);
}

/**
 * Rastrear seleção de plano
 */
export function trackPlanSelection(planName: string, price?: number) {
  if (!window.gtag) {
    console.warn("[Analytics] Google Analytics não inicializado");
    return;
  }

  window.gtag("event", "view_item", {
    items: [
      {
        item_name: planName,
        price: price,
        item_category: "plan",
      },
    ],
  });

  console.log("[Analytics] Plan selection tracked:", planName);
}

/**
 * Rastrear scroll até seção
 */
export function trackScrollToSection(sectionName: string) {
  if (!window.gtag) {
    console.warn("[Analytics] Google Analytics não inicializado");
    return;
  }

  window.gtag("event", "scroll", {
    section_name: sectionName,
  });

  console.log("[Analytics] Scroll tracked:", sectionName);
}

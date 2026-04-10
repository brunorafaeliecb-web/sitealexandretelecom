# Guia de Integrações - MelhoresPlanos.net

## 1. Integração ViaCEP - Busca por CEP

### O que é?
Integração com a API pública ViaCEP que permite buscar dados de endereço (rua, bairro, cidade, estado) a partir de um CEP.

### Como Funciona?
1. Usuário digita CEP no hero section
2. Sistema valida o formato (8 dígitos)
3. API ViaCEP retorna dados do endereço
4. Dados são exibidos para o usuário

### Arquivos Relacionados
- `server/viacep-service.ts` — Serviço de integração com ViaCEP
- `server/routers/viacep.ts` — Rotas tRPC para ViaCEP
- `client/src/components/CEPSearch.tsx` — Componente de busca por CEP

### Como Usar

**Frontend:**
```typescript
import CEPSearch from "@/components/CEPSearch";

<CEPSearch 
  onAddressFound={(address) => {
    console.log("Endereço encontrado:", address);
    // address.cep, address.street, address.city, address.state
  }}
/>
```

**Backend (tRPC):**
```typescript
const result = await trpc.viacep.getAddressByCEP.useQuery({ cep: "01310100" });
```

### Resposta da API
```json
{
  "success": true,
  "data": {
    "cep": "01.310-100",
    "street": "Avenida Paulista",
    "neighborhood": "Bela Vista",
    "city": "São Paulo",
    "state": "SP"
  }
}
```

### Limitações
- API ViaCEP é pública e não requer autenticação
- Sem limite de requisições (mas respeite boas práticas)
- Apenas busca dados de endereço, não planos

---

## 2. Formulário de Contato com Resend

### O que é?
Formulário de contato que envia emails via Resend para o proprietário do site e confirmação para o usuário.

### Como Funciona?
1. Usuário preenche formulário com nome, email, assunto e mensagem
2. Sistema valida dados com Zod
3. Email é enviado para o admin via Resend
4. Email de confirmação é enviado para o usuário
5. Sucesso é exibido ao usuário

### Arquivos Relacionados
- `server/contact-service.ts` — Serviço de email para contato
- `server/routers/contact.ts` — Rotas tRPC para contato
- `client/src/components/ContactSection.tsx` — Componente de formulário

### Como Usar

**Frontend:**
```typescript
import ContactSection from "@/components/ContactSection";

<ContactSection />
```

**Backend (tRPC):**
```typescript
const result = await trpc.contact.sendMessage.useMutation({
  name: "João Silva",
  email: "joao@example.com",
  subject: "Dúvida sobre planos",
  message: "Gostaria de saber mais..."
});
```

### Variáveis de Ambiente
```bash
RESEND_API_KEY=re_VzDtAhdE_Q46yPnZMjaQ5dLgkBuNL82h3
OWNER_EMAIL=admin@melhoresplanos.net
```

### Emails Enviados

**1. Email para Admin:**
- De: contato@melhoresplanos.net
- Para: OWNER_EMAIL
- Contém: Nome, email, telefone, assunto, mensagem
- Design: Responsivo com gradiente ciano-roxo

**2. Email de Confirmação:**
- De: contato@melhoresplanos.net
- Para: Email do usuário
- Contém: Confirmação de recebimento, link WhatsApp
- Design: Responsivo, amigável

### Validações
- Nome: mínimo 2 caracteres
- Email: formato válido
- Assunto: mínimo 5 caracteres
- Mensagem: mínimo 10 caracteres

---

## 3. Google Analytics - Rastreamento de Conversões

### O que é?
Integração com Google Analytics 4 (GA4) para rastrear comportamento do usuário, conversões e eventos.

### Como Funciona?
1. Script GA4 é carregado no App.tsx
2. Eventos são rastreados automaticamente
3. Dados são enviados para Google Analytics
4. Relatórios disponíveis no Google Analytics Dashboard

### Arquivos Relacionados
- `client/src/hooks/useAnalytics.ts` — Hook para Google Analytics
- `client/src/App.tsx` — Inicialização do GA4

### Como Usar

**Inicializar (já feito no App.tsx):**
```typescript
import { useGoogleAnalytics } from "@/hooks/useAnalytics";

function App() {
  useGoogleAnalytics(import.meta.env.VITE_GA_MEASUREMENT_ID || "");
  // ...
}
```

**Rastrear Eventos:**
```typescript
import { 
  trackEvent, 
  trackConversion, 
  trackCEPSearch,
  trackContactForm,
  trackPlanSelection 
} from "@/hooks/useAnalytics";

// Evento customizado
trackEvent("button_click", { button_name: "Cadastrar Provedor" });

// Conversão
trackConversion("contact_form_submitted", 1, "BRL");

// Busca por CEP
trackCEPSearch("01310100", true);

// Envio de formulário
trackContactForm("contact", true);

// Seleção de plano
trackPlanSelection("Claro 600MB", 49.90);
```

### Variáveis de Ambiente
```bash
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

### Eventos Rastreados Automaticamente
- `page_view` — Visualização de página
- `scroll` — Scroll até seção
- `click` — Clique em link externo
- `search` — Busca por CEP
- `form_submit` — Envio de formulário
- `view_item` — Seleção de plano
- `conversion` — Conversão geral

### Dashboard Google Analytics
1. Acesse: https://analytics.google.com/
2. Selecione sua propriedade
3. Vá para "Relatórios" → "Engajamento"
4. Visualize eventos, conversões e comportamento

### Próximos Passos
1. Obter Measurement ID do Google Analytics
2. Adicionar `VITE_GA_MEASUREMENT_ID` às variáveis de ambiente
3. Rastrear eventos específicos conforme necessário
4. Analisar dados no Google Analytics Dashboard

---

## Configuração Completa

### 1. Adicionar Variáveis de Ambiente

```bash
# .env ou painel de secrets
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
OWNER_EMAIL=seu-email@example.com
```

### 2. Testar Integrações

```bash
# ViaCEP
curl "https://viacep.com.br/ws/01310100/json/"

# Resend (via tRPC)
trpc.contact.sendMessage.mutate({
  name: "Teste",
  email: "teste@example.com",
  subject: "Teste",
  message: "Mensagem de teste"
})

# Google Analytics
trackEvent("test_event", { test: true })
```

### 3. Monitorar

- **ViaCEP:** Verificar console para logs de busca
- **Resend:** Verificar inbox para emails de teste
- **GA4:** Verificar real-time no Google Analytics

---

## Troubleshooting

### ViaCEP
- CEP não encontrado? Verifique se o CEP existe
- Erro de rede? Verifique conexão com internet
- Lentidão? ViaCEP é pública, pode ter picos

### Resend
- Email não chega? Verifique spam/lixo eletrônico
- Erro de autenticação? Verifique RESEND_API_KEY
- Erro de remetente? Use domínio verificado no Resend

### Google Analytics
- Eventos não aparecem? Aguarde 24-48 horas
- Measurement ID inválido? Verifique no GA4
- Script não carrega? Verifique console para erros

---

## Referências

- [ViaCEP API](https://viacep.com.br/)
- [Resend Documentation](https://resend.com/docs)
- [Google Analytics 4](https://analytics.google.com/)
- [Google Analytics API](https://developers.google.com/analytics)

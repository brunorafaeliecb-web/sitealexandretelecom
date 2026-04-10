# Guia de Autenticação 2FA com Resend

## Visão Geral

O sistema de autenticação de dois fatores (2FA) foi integrado com o **Resend**, um serviço de email transacional confiável. Quando um usuário ativa 2FA, um código de 6 dígitos é enviado por email e deve ser verificado dentro de 10 minutos.

## Como Funciona

### 1. **Ativação de 2FA**
- Usuário clica em "Ativar 2FA" no painel de segurança
- Sistema gera um código de 6 dígitos
- Email é enviado via Resend com o código
- Usuário recebe o código em seu inbox
- Usuário insere o código para confirmar

### 2. **Verificação de Código**
- Código é válido por 10 minutos
- Código de 6 dígitos deve ser exato
- Após verificação bem-sucedida, 2FA é ativado
- Usuário pode desativar 2FA a qualquer momento

### 3. **Desativação de 2FA**
- Usuário clica em "Desativar 2FA"
- 2FA é removido da conta
- Próximo login não requer código

## Configuração

### Variáveis de Ambiente

```bash
RESEND_API_KEY=re_VzDtAhdE_Q46yPnZMjaQ5dLgkBuNL82h3
```

A chave API já está configurada no projeto.

### Banco de Dados

Tabelas relacionadas:
- `two_factor_codes` — Armazena códigos gerados com timestamp de expiração
- `users` — Campo `twoFactorEnabled` indica se 2FA está ativo

## Fluxo de Código

### Backend (tRPC)

```typescript
// Ativar 2FA
trpc.twoFactor.enable.useMutation({
  email: "user@example.com"
})

// Verificar código
trpc.twoFactor.verify.useMutation({
  code: "123456"
})

// Desativar 2FA
trpc.twoFactor.disable.useMutation()

// Obter configurações
trpc.twoFactor.getSettings.useQuery()
```

### Frontend (React)

Veja `client/src/components/TwoFactorSetup.tsx` para implementação completa.

## Emails Enviados

### 1. **Código 2FA**
- Assunto: "Seu código de autenticação - MelhorPlano"
- Contém: Código de 6 dígitos, aviso de segurança, tempo de expiração
- Design: Responsivo, com gradiente ciano-roxo

### 2. **Aprovação de Admin**
- Enviado quando um novo admin é aprovado
- Contém: Link para acessar painel

### 3. **Rejeição de Admin**
- Enviado quando uma solicitação é rejeitada
- Contém: Motivo da rejeição (opcional)

## Testes

Todos os testes passam:
```bash
pnpm test
```

Testes incluem:
- ✅ Envio de código 2FA
- ✅ Envio de email de aprovação
- ✅ Envio de email de rejeição
- ✅ Tratamento de erros de email
- ✅ Tratamento de erros de rede

## Troubleshooting

### Código não chega
1. Verificar se RESEND_API_KEY está correta
2. Verificar spam/lixo eletrônico
3. Verificar logs do servidor: `[Email]` messages

### Código expirado
- Códigos expiram em 10 minutos
- Usuário pode solicitar novo código clicando "Reenviar"

### Email inválido
- Sistema valida email com Zod antes de enviar
- Erro será exibido ao usuário

## Próximos Passos

1. **Notificações de Login** — Enviar email quando 2FA é usado
2. **Backup Codes** — Gerar códigos de backup para recuperação
3. **SMS 2FA** — Adicionar opção de SMS além de email
4. **Autenticador App** — Integrar com Google Authenticator/Authy

## Referências

- [Documentação Resend](https://resend.com/docs)
- [Código Email Service](./server/email-service.ts)
- [Router 2FA](./server/routers/twoFactor.ts)
- [Componente UI](./client/src/components/TwoFactorSetup.tsx)

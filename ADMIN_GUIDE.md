# Guia de Administração - MelhorPlano.net

## 📋 Visão Geral

O site MelhorPlano.net possui um sistema completo de administração com autenticação, aprovação de gestor e edição de conteúdos. Este guia explica como usar todas as funcionalidades.

---

## 🔐 Sistema de Autenticação

### Acessar o Painel de Admin

1. **Localize o botão "Admin"** no canto inferior direito da página (fixo, sempre visível)
2. Clique no botão para abrir o modal de autenticação
3. Se não estiver logado, clique em **"Fazer Login"** para autenticar via Manus OAuth

### Fluxo de Aprovação de Gestor

#### Para Usuários Comuns:
1. Após fazer login, clique no botão "Admin" novamente
2. Clique em **"Solicitar Acesso Admin"**
3. Sua solicitação será enviada para aprovação
4. Aguarde um administrador aprovar sua solicitação
5. Após aprovação, você terá acesso ao painel de administração

#### Para Administradores:
1. Faça login como administrador
2. Clique no botão "Admin"
3. Você verá o botão **"Ir para Painel Admin"**
4. Clique para acessar o painel completo

---

## 🎛️ Painel de Administração

O painel de admin possui 3 abas principais:

### 1. **Solicitações de Admin** (👥 Users)

Aqui você pode gerenciar solicitações de acesso administrativo:

- **Visualizar**: Lista de todos os usuários que solicitaram acesso admin
- **Aprovar**: Clique no botão verde "✓ Aprovar" para conceder acesso admin
- **Rejeitar**: Clique no botão vermelho "✗ Rejeitar" para negar acesso

**Nota**: Apenas administradores podem aprovar ou rejeitar solicitações.

### 2. **Configurações do Site** (⚙️ Settings)

Nesta aba você pode editar:

- Textos dos títulos e descrições de cada seção
- Preços dos planos (Internet, Celular, Streaming)
- URLs das imagens
- Cores específicas de cada seção

**Status**: Funcionalidade será implementada em breve com interface visual para edição de cada seção.

### 3. **Tema e Cores** (🎨 Palette)

Controle o tema global do site:

- **Modo Escuro**: Ative ou desative o modo escuro para todos os usuários
- **Cores do Tema**: Visualize as cores primária e secundária do site
- **Cores de Fundo**: Customize cores de fundo para modo claro e escuro

---

## 🌙 Dark Mode Global

### Para Usuários:
- Clique no botão de **lua/sol** no footer para alternar entre modo claro e escuro
- A preferência é salva localmente no navegador
- O modo escuro é global e afeta todos os usuários

### Para Administradores:
- Acesse o painel de admin
- Vá para a aba **"Tema e Cores"**
- Clique em **"Ativar"** ou **"Desativar"** para controlar o modo escuro globalmente

---

## 🔑 Primeiro Acesso - Configuração Inicial

### Passo 1: Identificar o Primeiro Administrador
O primeiro administrador é automaticamente o **proprietário do projeto** (definido em `OWNER_OPEN_ID`).

### Passo 2: Fazer Login como Administrador
1. Clique no botão "Admin"
2. Faça login com a conta do proprietário
3. Você terá acesso automático ao painel de admin

### Passo 3: Aprovar Outros Administradores
1. Outros usuários podem solicitar acesso admin
2. Você receberá essas solicitações na aba **"Solicitações de Admin"**
3. Aprove os usuários que deseja promover a administrador

---

## 📊 Banco de Dados

O sistema usa as seguintes tabelas:

### `users`
- Armazena informações de usuários
- Campo `role`: "user" ou "admin"

### `admin_requests`
- Armazena solicitações de acesso admin
- Status: "pending", "approved", "rejected"

### `site_settings`
- Armazena configurações de conteúdo por seção
- Permite edição de textos, preços e imagens

### `theme_settings`
- Armazena configurações globais de tema
- Cores primária, secundária e de fundo

---

## 🛠️ Troubleshooting

### Problema: Não consigo fazer login
**Solução**: Certifique-se de que o OAuth está configurado corretamente. Verifique as variáveis de ambiente:
- `VITE_OAUTH_PORTAL_URL`
- `VITE_APP_ID`
- `OAUTH_SERVER_URL`

### Problema: Minha solicitação de admin não foi aprovada
**Solução**: Aguarde um administrador existente aprovar sua solicitação. Se ninguém aprovar, entre em contato com o proprietário do site.

### Problema: O dark mode não está funcionando
**Solução**: 
1. Limpe o cache do navegador
2. Verifique se o localStorage está habilitado
3. Tente novamente em uma aba privada/incógnita

---

## 🔒 Segurança

- Todas as operações de admin requerem autenticação
- Apenas usuários com role "admin" podem acessar procedimentos protegidos
- As solicitações de admin devem ser aprovadas por um administrador existente
- As senhas são gerenciadas pelo Manus OAuth (não armazenadas localmente)

---

## 📞 Suporte

Para problemas ou dúvidas sobre o sistema de administração, entre em contato com o suporte técnico.

---

**Última atualização**: Abril 2026

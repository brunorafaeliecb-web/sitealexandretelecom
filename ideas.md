# Brainstorm de Design — MelhorPlano Style

## Contexto
Combinar o conteúdo e estrutura do melhorplano.net (comparador de planos de telecom) com o estilo visual do brasilguard (fundo creme, gradientes ciano-roxo, cards escuros, tipografia bold).

---

<response>
<text>

## Opção A — "Telecom Futurista" (Probabilidade: 0.07)

**Design Movement:** Neomorphism + Gradient Tech

**Core Principles:**
- Contraste entre fundo creme quente e elementos escuros azulados
- Tipografia bold com gradientes ciano-roxo para títulos de destaque
- Cards com fundo escuro (slate-azulado) sobre fundo claro
- Elementos decorativos geométricos flutuantes sutis

**Color Philosophy:**
- Fundo: oklch(0.98 0.01 65) — creme quente, acolhedor mas moderno
- Primária: gradiente ciano (#00D4E8) → roxo (#A855F7)
- Cards escuros: oklch(0.25 0.04 257) — azul-ardósia profundo
- Texto principal: oklch(0.15 0.01 280) — quase preto azulado
- Accent amarelo: #FFD700 para bordas de botões CTA

**Layout Paradigm:**
- Hero com texto à esquerda, visual à direita (assimétrico)
- Grid de categorias com ícones em ciano sobre cards escuros
- Cards de planos em carrossel horizontal
- Seções alternando entre fundo creme e fundo escuro

**Signature Elements:**
- Títulos H1/H2 com gradiente ciano→roxo (background-clip: text)
- Botões CTA com gradiente ciano→roxo e borda amarela sutil
- Ícones em ciano sobre fundos escuros

**Interaction Philosophy:**
- Hover nos cards: lift com sombra ciano sutil
- Botões: gradiente animado no hover
- Transições suaves 300ms ease-in-out

**Animation:**
- Entrada de seções com fade-in + slide-up (framer-motion)
- Gradiente animado nos títulos principais
- Cards com scale(1.02) no hover

**Typography System:**
- Display: Sora (bold, 700) para títulos grandes
- Body: Inter (400/500) para texto corrido
- Mono: JetBrains Mono para preços/velocidades

</text>
<probability>0.07</probability>
</response>

<response>
<text>

## Opção B — "Comparador Premium" (Probabilidade: 0.08) ← ESCOLHIDA

**Design Movement:** Modern Editorial + Tech Gradient

**Core Principles:**
- Fundo creme quente como base, criando sensação premium e não-genérica
- Gradientes ciano-roxo exclusivamente em títulos e CTAs principais
- Cards de planos com fundo escuro (azul-ardósia) contrastando com seções claras
- Tipografia bold e expressiva, misturando pesos para hierarquia clara

**Color Philosophy:**
- Background: oklch(0.98 0.01 65) ≈ #FAF8F5 (creme quente)
- Gradient primário: linear-gradient(135deg, #00D4E8 0%, #A855F7 100%)
- Card dark: oklch(0.22 0.04 257) ≈ #1E2A4A (azul-ardósia)
- Texto: oklch(0.15 0.01 280) ≈ #1A1A2E
- Accent ciano: #00D4E8
- Accent roxo: #A855F7
- Amarelo CTA: #FFD700 (bordas sutis)

**Layout Paradigm:**
- Navbar horizontal com logo à esquerda, menu centralizado, CTA à direita
- Hero full-width com busca por CEP centralizada e fundo com gradiente sutil
- Seções de categorias em grid 3×2 com cards escuros
- Cards de planos em layout horizontal scrollável
- Alternância de seções claras e escuras para ritmo visual

**Signature Elements:**
- Gradiente ciano→roxo nos títulos H1/H2 (background-clip: text)
- Botões CTA com gradiente + borda amarela sutil
- Badges "DESTAQUE" e "MELHOR CUSTO" em ciano

**Interaction Philosophy:**
- Hover em cards: elevação + borda ciano sutil
- Botões: pulso de gradiente animado
- Transições 250ms cubic-bezier(0.4, 0, 0.2, 1)

**Animation:**
- Framer Motion: staggered fade-in para cards
- Gradiente animado nos títulos hero
- Scroll-triggered animations para seções

**Typography System:**
- Títulos: Sora 700/800 com gradiente
- Subtítulos: Sora 600
- Body: Inter 400/500
- Preços: Sora 700 em ciano

</text>
<probability>0.08</probability>
</response>

<response>
<text>

## Opção C — "Minimal Tech" (Probabilidade>0.06)

**Design Movement:** Swiss Minimalism + Cyber Accents

**Core Principles:**
- Grid rígido com espaçamento generoso
- Apenas ciano como cor de acento (sem roxo)
- Tipografia condensada e técnica
- Fundo quase branco com elementos escuros

**Color Philosophy:**
- Background: #FAFAF8 (quase branco)
- Primária: #00C8D7 (ciano puro)
- Texto: #0D0D1A
- Cards: #1A2035

**Layout Paradigm:**
- Grid de 12 colunas estrito
- Tipografia grande e condensada
- Muito espaço negativo

**Signature Elements:**
- Linhas horizontais finas como divisores
- Números grandes em ciano
- Tabelas comparativas em vez de cards

**Interaction Philosophy:**
- Hover com underline animado
- Sem gradientes nos botões

**Animation:**
- Apenas fade-in simples
- Sem animações de escala

**Typography System:**
- Barlow Condensed para títulos
- IBM Plex Sans para body

</text>
<probability>0.06</probability>
</response>

---

## Decisão Final: **Opção B — "Comparador Premium"**

Design escolhido: Modern Editorial + Tech Gradient, com fundo creme quente, gradientes ciano-roxo nos títulos, cards escuros azul-ardósia, tipografia Sora bold e animações fluidas com Framer Motion.

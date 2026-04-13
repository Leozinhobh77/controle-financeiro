# 🏗️ Arquitetura do Projeto — Guia de Organização

**Status:** v1.0  
**Objetivo:** Facilitar manutenção, evitar duplicação, ensinar o SDD

---

## 📁 Estrutura de Pastas

```
controle-financeiro/
│
├── app/                          # Next.js App Router
│   ├── page.tsx                  # Dashboard principal (/) — didático
│   ├── layout.tsx                # RootLayout
│   ├── globals.css               # Estilos globais
│   ├── providers.tsx             # ThemeProvider
│   │
│   ├── components/               # Componentes reutilizáveis
│   │   ├── ui/                   # shadcn/ui base components
│   │   │   ├── button.tsx        # Button (6 variantes)
│   │   │   ├── input.tsx         # Input
│   │   │   ├── card.tsx          # Card
│   │   │   ├── badge.tsx         # Badge
│   │   │   ├── select.tsx        # Select
│   │   │   ├── dialog.tsx        # Dialog (modal)
│   │   │   ├── tabs.tsx          # Tabs
│   │   │   ├── index.ts          # ⭐ Exports ALL (evita import aninhados)
│   │   │   └── __tests__/        # Testes unitários
│   │   │
│   │   ├── layout/               # Layout components
│   │   │   ├── AppLayout.tsx     # Sidebar + main
│   │   │   ├── Header.tsx        # Topo
│   │   │   └── index.ts
│   │   │
│   │   ├── dashboard/            # Dashboard-specific
│   │   │   ├── SaldoCard.tsx     # Card saldo total
│   │   │   ├── KPICards.tsx      # Pendente/Atrasado/Pago
│   │   │   ├── GraficoSemana.tsx # Recharts area chart
│   │   │   └── index.ts
│   │   │
│   │   ├── contas/               # Conta management
│   │   │   ├── ListaContas.tsx   # Tabela com filtros
│   │   │   ├── FormConta.tsx     # Criar/editar
│   │   │   └── index.ts
│   │   │
│   │   ├── ComponentShowcase.tsx  # Demo de todos UI components
│   │   └── ThemeToggle.tsx        # Toggle dark/light
│   │
│   ├── showcase/                 # Página educacional
│   │   └── page.tsx              # Demonstra ComponentShowcase
│   │
│   ├── dashboard/                # (futuro) Dashboard detalhado
│   ├── contas/                   # (futuro) Página de contas
│   └── configuracoes/            # (futuro) Settings
│
├── lib/                          # Utilitários e lógica pura
│   ├── utils/                    # Funções helper
│   │   ├── cn.ts                 # ⭐ Tailwind merge utility
│   │   ├── formatters.ts         # formatarMoeda, formatarData, etc
│   │   └── index.ts              # Exports ALL formatters
│   │
│   ├── stores/                   # Zustand stores (UI state)
│   │   ├── useThemeStore.ts      # Dark/light mode
│   │   ├── __tests__/
│   │   └── index.ts              # ⭐ Exports ALL stores
│   │
│   ├── hooks/                    # Custom hooks (lógica de negócio)
│   │   ├── useContas.ts          # (futuro) Fetch contas
│   │   ├── useFetchContas.ts     # (futuro) Com filtros
│   │   ├── useValidarConta.ts    # (futuro) Validação
│   │   └── index.ts              # ⭐ Exports ALL hooks
│   │
│   ├── validation/               # Zod schemas
│   │   ├── conta.ts              # (futuro) Validação de conta
│   │   ├── config.ts             # (futuro) Validação config
│   │   └── index.ts              # ⭐ Exports ALL schemas
│   │
│   ├── db/                       # Database layer
│   │   ├── init.ts               # (futuro) SQLite init
│   │   ├── storage.ts            # (futuro) Storage Adapter
│   │   ├── schema.ts             # (futuro) SQL schema
│   │   └── index.ts              # ⭐ Exports ALL db
│   │
│   ├── types/                    # TypeScript interfaces
│   │   ├── index.ts              # ⭐ Exports ALL types
│   │   └── __tests__/
│   │
│   └── constants/                # (futuro) Constantes globais
│       ├── categories.ts         # Categorias pré-definidas
│       └── index.ts
│
├── public/                       # Assets estáticos
│   ├── favicon.ico
│   └── (ícones, imagens)
│
├── forge/                        # FORGE (gestão do projeto)
│   ├── forge-data.json           # Estado do projeto
│   ├── forge-data.js             # (regenerado) Para interface web
│   └── index.html                # Interface FORGE (futuro)
│
├── docs/                         # Documentação
│   ├── PRD.md                    # Requisitos do produto
│   ├── CONSTITUTION.md           # 23 leis invioláveis
│   ├── SPEC.md                   # Especificação técnica
│   ├── PLAN.md                   # Plano de 5 sprints
│   ├── ARQUITETURA.md            # Este arquivo
│   └── SDD-GUIDE.md              # (novo) Como usar SDD
│
├── CLAUDE.md                     # Contexto permanente
├── README.md                     # Getting started
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.js
├── postcss.config.js
├── prettier.config.js
├── vitest.config.ts
└── .eslintrc.json
```

---

## ⭐ **Regra de Ouro: INDEX FILES**

**NUNCA faça imports aninhados como:**
```tsx
❌ import { Button } from '@/app/components/ui/button'
❌ import { useThemeStore } from '@/lib/stores/useThemeStore'
```

**SEMPRE use index files:**
```tsx
✅ import { Button } from '@/app/components/ui'
✅ import { useThemeStore } from '@/lib/stores'
```

**Por quê?**
- A IA sabe exatamente onde procurar (no `index.ts`)
- Se você mover um arquivo, só atualiza o index
- Evita duplicação — a IA sempre reutiliza pq vê tudo exportado
- Import path é sempre o mesmo (curto e legível)

**Template para index.ts:**
```typescript
// lib/stores/index.ts
export { useThemeStore } from './useThemeStore';
export type { Theme } from './useThemeStore';
```

---

## 🎯 **Padrão de Desenvolvimento**

### 1. **Quando criar um novo componente:**

```
Passo 1: Criar em pasta específica
  app/components/dashboard/SaldoCard.tsx

Passo 2: Adicionar export no index.ts da pasta
  app/components/dashboard/index.ts:
  export { SaldoCard } from './SaldoCard';

Passo 3: Importar sempre pelo index
  import { SaldoCard } from '@/app/components/dashboard';
```

### 2. **Quando criar um hook customizado:**

```
Passo 1: Criar em lib/hooks/
  lib/hooks/useContas.ts

Passo 2: Adicionar export em lib/hooks/index.ts
  export { useContas } from './useContas';
  export type { ContasState } from './useContas';

Passo 3: Importar
  import { useContas } from '@/lib/hooks';
```

### 3. **Quando criar um utilitário:**

```
Passo 1: Criar em lib/utils/
  lib/utils/formatters.ts

Passo 2: Adicionar export em lib/utils/index.ts
  export { formatarMoeda, formatarData } from './formatters';

Passo 3: Importar
  import { formatarMoeda } from '@/lib/utils';
```

---

## 📚 **Dashboard Educacional**

Criamos um `/showcase` como **referência visual** de:
- ✅ Como usar cada componente
- ✅ Variantes disponíveis
- ✅ Dark mode funcionando
- ✅ Exemplos de uso

Também vamos criar um `/design-system` page que:
- Explica o SDD (PRD → CONST → SPEC → PLAN)
- Mostra a hierarquia de componentes
- Demonstra padrões de uso
- Ensina onde procurar cada coisa

---

## 🔍 **Como a IA evita duplicação**

1. **Conhece exatamente onde está tudo** (pastas bem nomeadas)
2. **Index files centralizam exports** (a IA sempre olha lá primeiro)
3. **Tipos estão em `lib/types`** (a IA busca lá antes de criar novos)
4. **Componentes base em `app/components/ui`** (nunca cria Button duas vezes)
5. **Hooks em `lib/hooks`** (a IA sabe procurar lá)

---

## 📖 **Referência Rápida de Imports**

| O que preciso | Onde está | Import |
|---|---|---|
| Button, Card, Badge | Componentes UI | `import { Button } from '@/app/components/ui'` |
| SaldoCard, KPICards | Dashboard components | `import { SaldoCard } from '@/app/components/dashboard'` |
| useThemeStore | Stores (UI state) | `import { useThemeStore } from '@/lib/stores'` |
| useContas | Hooks (data logic) | `import { useContas } from '@/lib/hooks'` |
| formatarMoeda | Utilitários | `import { formatarMoeda } from '@/lib/utils'` |
| Conta, Categoria | Types | `import { Conta } from '@/lib/types'` |
| schemaConta | Validações | `import { schemaConta } from '@/lib/validation'` |

---

## ✅ **Checklist de Boa Organização**

- [ ] Toda pasta com múltiplos arquivos tem `index.ts`
- [ ] Index files exportam TUDO que precisa ser público
- [ ] Imports sempre são pelo index (nunca aninhado)
- [ ] Componentes base estão em `app/components/ui`
- [ ] Componentes específicos estão em suas pastas
- [ ] Hooks estão em `lib/hooks`
- [ ] Stores estão em `lib/stores`
- [ ] Utils estão em `lib/utils`
- [ ] Types estão em `lib/types`
- [ ] Testes estão ao lado do código (`__tests__`)
- [ ] README.md em cada pasta grande explicando o padrão

---

**Última atualização:** 2026-04-09  
**Versão:** 1.0

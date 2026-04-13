# 🏗️ ARCHITECTURE — Visão Arquitetural Completa

## Stack Principal

```
┌───────────────────────────────────────────────────────┐
│  Browser (Vercel Deploy)                              │
├───────────────────────────────────────────────────────┤
│                                                       │
│  React 19 + Next.js 16 (App Router)                  │
│  ├─ Componentes (shadcn/ui + customizados)           │
│  ├─ Zustand (UI state: filtros, modais, tema)        │
│  └─ Framer Motion (animações suaves)                 │
│                                                       │
│  ↓                                                    │
│                                                       │
│  TanStack Query 5.28+                                │
│  ├─ Cache automático (staleTime: 5 min)              │
│  ├─ Background sync                                  │
│  ├─ Retry automático                                 │
│  └─ Offline-ready                                    │
│                                                       │
│  ↓                                                    │
│                                                       │
│  Custom Hooks (useContas, useFetchContas, etc)       │
│  └─ Orquestração de lógica de negócio                │
│                                                       │
│  ↓                                                    │
│                                                       │
│  Storage Adapter (sql.js wrapper)                    │
│  └─ Interface agnóstica para persistência            │
│                                                       │
│  ↓                                                    │
│                                                       │
│  sql.js (SQLite em WebAssembly)                      │
│  ├─ Tabelas: contas, categorias, config              │
│  ├─ 100% offline                                     │
│  └─ Sem limite de tamanho (MVP)                      │
│                                                       │
│  Gráficos: Recharts (área, pizza, barras)            │
│  Validação: Zod (type-safe)                          │
│  Styling: Tailwind CSS v4 + custom dark palette      │
│  Testing: Vitest + Testing Library                   │
│                                                       │
└───────────────────────────────────────────────────────┘
```

## Decisões Arquiteturais

### 1. App Router (Next.js 16+)
- **Raiz:** `app/`
- **Rotas:** `app/contas/page.tsx`, `app/contas/[id]/page.tsx`
- **Layouts:** Aninhados por default
- **Benefício:** Melhor para SSR/SSG, moderno

### 2. Layer-driven Components
```
app/components/
├── ui/           — shadcn/ui + customizações
├── features/     — Dashboard, Contas, Configurações
├── layouts/      — AppLayout, MainLayout
└── forms/        — FormConta
```

### 3. Zustand para UI State
- Filtros ativos
- Modal aberto/fechado
- Tema (dark/light)
- Forma de página

**TanStack Query para Dados**
- Cache de contas
- Background refetch
- Sincronização automática
- Retry em erro

### 4. WaSQLite para Persistência
- 100% offline
- SQLite no browser via WebAssembly
- Sem servidor no MVP
- Migração futura: Tauri (v2+)

## Fluxo de Dados

```
User Interaction
    ↓
Component (React)
    ↓
Hook (useContas, useAdicionarConta)
    ↓
TanStack Query (cache + sync)
    ↓
Storage Adapter (sql.js wrapper)
    ↓
sql.js (SQLite queries)
    ↓
Zustand Store (UI updates)
    ↓
Component re-render (Framer Motion animations)
```

## Escalabilidade

**MVP (0-100 usuários):** WaSQLite browser
**v1.5 (100-1000 usuários):** Tauri desktop (SQLite nativo)
**v2.0 (1000+ usuários):** Backend sync + cloud storage

Mudança de stack não afeta interface (Storage Adapter + TanStack Query abstraem)

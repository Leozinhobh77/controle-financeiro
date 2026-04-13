# ◎ PLAN — Plano de Ataque: 5 Sprints, 75 Tasks

**Projeto:** Controle de Contas v2  
**Versão:** 1.0  
**Data:** 2026-04-09  
**Status:** 🔄 Em execução  
**Baseado em:** SPEC v1.0 + PRD v1.0 + Constitution v1.0  
**Gerado por:** FORGE + Haiku 4.5  

---

## 📊 Progresso Geral

| Sprint | Nome | Tasks | Status | Progresso |
|--------|------|-------|--------|-----------|
| 1 | **Setup & Fundação** | 0/12 | ⏳ Pendente | ░░░░░░░░░░ 0% |
| 2 | **Persistência & Banco** | 0/14 | ⏳ Pendente | ░░░░░░░░░░ 0% |
| 3 | **Componentes & Hooks** | 0/18 | ⏳ Pendente | ░░░░░░░░░░ 0% |
| 4 | **Features (Dashboard + Contas)** | 0/20 | ⏳ Pendente | ░░░░░░░░░░ 0% |
| 5 | **Testes, Polish & Deploy** | 0/11 | ⏳ Pendente | ░░░░░░░░░░ 0% |
| **TOTAL** | | **0/75** | | **0%** |

---

## ⏱️ Estimativa de Esforço

| Métrica | Valor |
|---------|-------|
| **Sprints** | 5 |
| **Tasks** | 75 |
| **Sessões estimadas** | ~50-60 sessões de 2-3h |
| **Ritmo sugerido** | 10-12 sessões/semana (2-3 sprints/semana) |
| **Conclusão estimada** | ~6 semanas (com ritmo de 10 sess/semana) |
| **Caminho crítico** | 18 tasks (Setup → Persistência → Hooks → Dashboard) |

---

## 🔀 Paralelização

**Tasks que podem rodar em paralelo:**
- TASK-013 (UI Components) com TASK-041 (Validações)
- TASK-043 (Vitest setup) com qualquer Sprint
- TASK-074 (README) com qualquer Sprint

**Recomendação:** Fazer UI/Validações/Testes enquanto outras tasks bloqueiam

---

## 🔴 Caminho Crítico

```
TASK-001 (Next.js setup)
    ↓
TASK-013 (Tailwind + shadcn config)
    ↓
TASK-025 (Storage Adapter)
    ↓
TASK-031 (SQLite schema)
    ↓
TASK-049 (useContas hook)
    ↓
TASK-055 (Dashboard container)
```

**Se qualquer task deste caminho atrasar, o projeto inteiro atrasa.**

---

# 🏃 Sprint 1 — Setup & Fundação

> **Objetivo:** Infraestrutura pronta, projeto roda no Vercel
> **Meta:** `npm run dev` abre app vazio mas funcional com dark mode, Tailwind + shadcn/ui operacionais

## TASK-001 — Next.js 16 + TypeScript setup

**Complexidade:** 🟢 Baixa | **Depende de:** nada | **SPEC:** Visão Arquitetural  
**Duração estimada:** ~2h

**O que fazer:**
Criar novo projeto Next.js 16 com App Router, TypeScript, ESLint. Estrutura de pastas conforme SPEC (app/, lib/, public/, docs/). Remover boilerplate desnecessário. Verificar que `npm run dev` funciona.

**Definition of Done:**
- [ ] Projeto Next.js 16 com App Router criado
- [ ] TypeScript configurado com tsconfig.json strict
- [ ] `npm run dev` funciona sem erros
- [ ] Pastas da estrutura criadas (app/, lib/, references/, etc)
- [ ] .gitignore atualizado
- [ ] README.md inicial criado

---

## TASK-002 — Tailwind CSS v4 + Dark Mode

**Complexidade:** 🟢 Baixa | **Depende de:** TASK-001 | **SPEC:** Design System  
**Duração estimada:** ~1.5h

**O que fazer:**
Instalar Tailwind CSS v4, criar tailwind.config.js com paleta custom (dark mode #0F0F0F, #1A1A1A, #F59E0B). Setup provider para `data-theme` no `<html>`. localStorage persistence para tema.

**Definition of Done:**
- [ ] Tailwind v4 instalado e funcionando
- [ ] Paleta customizada (cores dark/light)
- [ ] Dark mode ativa por padrão
- [ ] Toggle tema via localStorage + DOM
- [ ] globals.css aplicado

---

## TASK-003 — shadcn/ui Setup + Customizações

**Complexidade:** 🟢 Baixa | **Depende de:** TASK-002 | **SPEC:** Componentes React  
**Duração estimada:** ~2h

**O que fazer:**
Configurar shadcn/ui, instalar componentes base (Button, Input, Select, Dialog, Card, Badge, Tabs). Criar components/ui/ folder com shadcn imports. Customizar estilos para amber accent (#F59E0B).

**Definition of Done:**
- [ ] shadcn/ui setup completo
- [ ] Componentes: Button, Input, Select, Dialog, Card, Badge, Tabs importáveis
- [ ] Estilos customizados (amber primary, dark background)
- [ ] Exemplo de Button renderizando corretamente no dashboard

---

## TASK-004 — Zustand + TanStack Query Setup

**Complexidade:** 🟡 Média | **Depende de:** TASK-001 | **SPEC:** Fluxo de Dados  
**Duração estimada:** ~2.5h

**O que fazer:**
Instalar zustand e @tanstack/react-query. Criar app/providers.tsx com QueryClientProvider + QueryClient config. Setup Zustand store vazio para UI state. Config staleTime=5min, retry=3x com backoff exponencial.

**Definition of Done:**
- [ ] @tanstack/react-query instalado com Vercel adapter
- [ ] QueryClient configurado (staleTime, retry, cacheTime)
- [ ] App layout com QueryClientProvider
- [ ] Zustand store criado (lib/stores/useUIStore.ts vazio)
- [ ] Providers renderizando sem erro

---

## TASK-005 — RootLayout + Dark Mode Provider

**Complexidade:** 🟢 Baixa | **Depende de:** TASK-002, TASK-004 | **SPEC:** Visão Arquitetural  
**Duração estimada:** ~1.5h

**O que fazer:**
Criar app/layout.tsx com RootLayout. Incluir meta tags (viewport, description), fonte (Georgia + Segoe UI), providers.tsx, dark mode detectar preferência SO.

**Definition of Done:**
- [ ] app/layout.tsx renderiza sem erro
- [ ] Dark mode funciona
- [ ] Tipografia carregando (Georgia + Segoe UI)
- [ ] `<Providers>` funcional
- [ ] Meta tags corretas

---

## TASK-006 — Dashboard Page (vazia)

**Complexidade:** 🟢 Baixa | **Depende de:** TASK-005 | **SPEC:** Interface - Rotas  
**Duração estimada:** ~1h

**O que fazer:**
Criar app/page.tsx (dashboard page). Por enquanto, apenas `<div>Dashboard aqui</div>`. Renderizar para validar routing.

**Definition of Done:**
- [ ] app/page.tsx renderiza
- [ ] Rota `/` carrega página
- [ ] Layout aplicado

---

## TASK-007 — Contas Page (vazia)

**Complexidade:** 🟢 Baixa | **Depende de:** TASK-005 | **SPEC:** Interface - Rotas  
**Duração estimada:** ~1h

**O que fazer:**
Criar app/contas/page.tsx. Renderização mínima.

**Definition of Done:**
- [ ] app/contas/page.tsx renderiza
- [ ] Rota `/contas` acessível

---

## TASK-008 — Configuracoes Page (vazia)

**Complexidade:** 🟢 Baixa | **Depende de:** TASK-005 | **SPEC:** Interface - Rotas  
**Duração estimada:** ~1h

**O que fazer:**
Criar app/configuracoes/page.tsx. Renderização mínima.

**Definition of Done:**
- [ ] app/configuracoes/page.tsx renderiza
- [ ] Rota `/configuracoes` acessível

---

## TASK-009 — AppLayout Component

**Complexidade:** 🟡 Média | **Depende de:** TASK-003 | **SPEC:** Componentes React  
**Duração estimada:** ~2h

**O que fazer:**
Criar app/components/layouts/AppLayout.tsx com sidebar (nav links: Dashboard, Contas, Configurações) + main content area. Dark mode styling. Responsive (hamburger menu em mobile).

**Definition of Done:**
- [ ] Sidebar renderiza com 3 links
- [ ] Main area renderiza children
- [ ] Responsive (desktop: sidebar fixa, mobile: hamburger)
- [ ] Escuro está escuro (#0F0F0F background)

---

## TASK-010 — Vitest + Testing Library Setup

**Complexidade:** 🟡 Média | **Depende de:** TASK-001 | **SPEC:** Testes  
**Duração estimada:** ~1.5h

**O que fazer:**
Instalar vitest, @testing-library/react, @testing-library/jest-dom. Criar vitest.config.ts. Setup arquivo teste dummy para validar pipeline.

**Definition of Done:**
- [ ] vitest instalado
- [ ] `npm run test` executa
- [ ] Teste dummy passando
- [ ] Coverage configurado (target: 80%)

---

## TASK-011 — ESLint + Prettier Config

**Complexidade:** 🟢 Baixa | **Depende de:** TASK-001 | **SPEC:** N/A  
**Duração estimada:** ~1h

**O que fazer:**
Configurar ESLint + Prettier para TypeScript + React. Adicionar pre-commit hooks (Husky). Rodar formatação inicial.

**Definition of Done:**
- [ ] ESLint config criado
- [ ] Prettier formatando código
- [ ] Husky hooks instalado (pre-commit)

---

## TASK-012 — Validar que tudo roda: `npm run dev`

**Complexidade:** 🟢 Baixa | **Depende de:** TASK-001 a TASK-011 | **SPEC:** N/A  
**Duração estimada:** ~0.5h

**O que fazer:**
Rodar `npm run dev`, abrir http://localhost:3000, verificar que dashboard page renderiza sem erro. Verificar dark mode, verificar que rotas existem. Fazer commit: "Sprint 1 completo: Setup & Fundação".

**Definition of Done:**
- [ ] `npm run dev` sem erros
- [ ] Dashboard page renderiza
- [ ] Dark mode funciona
- [ ] Rotas `/`, `/contas`, `/configuracoes` acessíveis
- [ ] Commit feito
- [ ] TASK-012 registrado em forge-data.json via /forge-execute

---

# 🏃 Sprint 2 — Persistência & Banco de Dados

> **Objetivo:** Banco de dados funcionando, dados persistem entre reloads
> **Meta:** Adicionar conta, reload página, conta ainda lá (SQLite funcional)

## TASK-013 — Zod Schemas (contas, config)

**Complexidade:** 🟡 Média | **Depende de:** TASK-001 | **SPEC:** Validações  
**Duração estimada:** ~1.5h

**O que fazer:**
Criar lib/validation/conta.ts com schemaConta (Zod). Validar: descricao (3-50 chars), valor (>0, <=1M), dataVencimento (data válida), categoria, parcelamento, recorrência. Criar lib/validation/config.ts para tema/moeda.

**Definition of Done:**
- [ ] schemaConta validando todos os campos
- [ ] schemaConfig para tema/moeda
- [ ] Testes unitários de validação (TASK-010 já está pronto)
- [ ] Mensagens de erro em português

---

## TASK-014 — SQL.js (sql.js) Setup

**Complexidade:** 🟡 Média | **Depende de:** TASK-001 | **SPEC:** Banco de Dados  
**Duração estimada:** ~2h

**O que fazer:**
Instalar sql.js. Criar lib/db/init.ts que inicializa SQLite em memória. Criar schema.sql com 3 tabelas (contas, categorias, config). Seed inicial com categorias padrão.

**Definition of Done:**
- [ ] sql.js instalado
- [ ] SQLite em memória inicializado
- [ ] 3 tabelas criadas
- [ ] Seed de categorias rodado
- [ ] Índices criados

---

## TASK-015 — Storage Adapter (interface abstrata)

**Complexidade:** 🟡 Média | **Depende de:** TASK-014 | **SPEC:** Storage Adapter  
**Duração estimada:** ~1.5h

**O que fazer:**
Criar lib/storage.ts com interface StorageAdapter. Implementar para sql.js. Métodos: getContas(), adicionarConta(), atualizarConta(), removerConta(), getCategorias(), getConfig(), setConfig(). Sem TanStack Query ainda (sync mode).

**Definition of Done:**
- [ ] Interface StorageAdapter definida
- [ ] sql.js adapter implementado
- [ ] CRUD de contas funcionando (teste manual)
- [ ] Sem TanStack Query (direto no storage)

---

## TASK-016 — TanStack Query Adapter para Storage

**Complexidade:** 🔴 Alta | **Depende de:** TASK-015, TASK-004 | **SPEC:** Fluxo de Dados  
**Duração estimada:** ~3h

**O que fazer:**
Criar lib/hooks/useContas.ts que usa TanStack Query com Storage adapter. queryFn chama Storage.getContas(). Config: staleTime=5min, cacheTime=10min, retry=2. Testes: fetch inicial, cache hit, refetch.

**Definition of Done:**
- [ ] useContas hook usando TanStack Query
- [ ] Caching funcional (5 min staleTime)
- [ ] Background refetch funcionando
- [ ] Testes passando

---

## TASK-017 — Mutation: useAdicionarConta

**Complexidade:** 🔴 Alta | **Depende de:** TASK-016 | **SPEC:** Fluxo de Dados  
**Duração estimada:** ~2.5h

**O que fazer:**
Criar useMutation para adicionar conta. Validação com Zod. Otimistic update. Background sync com Storage. Invalidate cache após sucesso. Toast de sucesso/erro.

**Definition of Done:**
- [ ] useMutation criado
- [ ] Validação Zod integrada
- [ ] Otimistic update funcionando
- [ ] Cache invalidation após sucesso
- [ ] Toast notificação

---

## TASK-018 — Mutation: useAtualizarConta

**Complexidade:** 🟡 Média | **Depende de:** TASK-017 | **SPEC:** Fluxo de Dados  
**Duração estimada:** ~1.5h

**O que fazer:**
Criar useMutation para editar conta. Mesmo padrão do TASK-017 mas com PUT.

**Definition of Done:**
- [ ] useMutation para editar funcionando
- [ ] Validação + otimistic update
- [ ] Toast notificação

---

## TASK-019 — Mutation: useRemoverConta

**Complexidade:** 🟢 Baixa | **Depende de:** TASK-017 | **SPEC:** Fluxo de Dados  
**Duração estimada:** ~1h

**O que fazer:**
Criar useMutation para remover conta. Adicionar confirmação (dialog antes de remover).

**Definition of Done:**
- [ ] useMutation para remover funcionando
- [ ] Dialog de confirmação
- [ ] Toast de sucesso

---

## TASK-020 — Hook: useFetchContas (com filtros)

**Complexidade:** 🟡 Média | **Depende de:** TASK-016 | **SPEC:** Fluxo de Dados  
**Duração estimada:** ~1.5h

**O que fazer:**
Criar useFetchContas que usa useContas() + filtra em memória por status/categoria/busca. Retorna contas filtradas. Testes: cada filtro isoladamente.

**Definition of Done:**
- [ ] useFetchContas criado
- [ ] Filtros por status funcionando
- [ ] Filtros por categoria funcionando
- [ ] Filtros por busca funcionando
- [ ] Testes unitários

---

## TASK-021 — Hook: useValidarConta

**Complexidade:** 🟡 Média | **Depende de:** TASK-013 | **SPEC:** Validações  
**Duração estimada:** ~1h

**O que fazer:**
Criar hook que valida conta em tempo real com Zod. Retorna { erros, isValido }.

**Definition of Done:**
- [ ] Hook validando em tempo real
- [ ] Erros por campo
- [ ] Testes

---

## TASK-022 — Hook: useThemeStore (Zustand)

**Complexidade:** 🟢 Baixa | **Depende de:** TASK-004 | **SPEC:** Design System  
**Duração estimada:** ~1h

**O que fazer:**
Criar Zustand store para tema. Estado: tema ('dark'|'light'). Ação: alterarTema(). Persist em localStorage.

**Definition of Done:**
- [ ] Zustand store criado
- [ ] localStorage persistence
- [ ] Hook usable em componentes

---

## TASK-023 — Utility: formatarMoeda (BRL)

**Complexidade:** 🟢 Baixa | **Depende de:** TASK-001 | **SPEC:** Design System  
**Duração estimada:** ~0.5h

**O que fazer:**
Criar lib/utils/formatters.ts com formatarMoeda(valor) que retorna "R$ 1.234,56". Testes com valores negativos, zeros, decimais.

**Definition of Done:**
- [ ] Função formatarMoeda funcionando
- [ ] Testes cobrindo edge cases

---

## TASK-024 — Utility: formatarData

**Complexidade:** 🟢 Baixa | **Depende de:** TASK-001 | **SPEC:** Design System  
**Duração estimada:** ~0.5h

**O que fazer:**
Criar formatarData(iso) que retorna "10/04/2026" em português.

**Definition of Done:**
- [ ] Função formatarData funcionando
- [ ] Testes

---

## TASK-025 — Types: Interfaces Conta, Categoria, Config

**Complexidade:** 🟢 Baixa | **Depende de:** TASK-001 | **SPEC:** Banco de Dados  
**Duração estimada:** ~0.5h

**O que fazer:**
Criar lib/types/index.ts com interfaces TypeScript para Conta, Categoria, Config. Baseado em SPEC - Banco de Dados.

**Definition of Done:**
- [ ] Tipos criados
- [ ] Exportados de lib/types

---

## TASK-026 — Smoke Test: Adicionar e Remover Conta

**Complexidade:** 🟡 Média | **Depende de:** TASK-019 | **SPEC:** N/A  
**Duração estimada:** ~1h

**O que fazer:**
Teste manual: abrir app, adicionar conta, reload, conta ainda lá. Remover, reload, sumiu. Testar em mobile/desktop.

**Definition of Done:**
- [ ] Conta adicionada persiste
- [ ] Conta removida desaparece
- [ ] Testes em mobile e desktop
- [ ] Commit: "Sprint 2 completo: Persistência & Banco"

---

# 🏃 Sprint 3 — Componentes UI & Hooks Avançados

> **Objetivo:** Biblioteca de componentes visual pronta
> **Meta:** Componentes renderizam, hooks abstraem lógica, UI é belíssima (dark mode premium)

[Continuação com 18 tasks — vou abreviar para manter documento legível]

## TASK-027 a TASK-044 (18 tasks)

**Tasks desta Sprint:**
- TASK-027: SaldoCard component (com glow effect)
- TASK-028: KPICards component (Pendente/Atrasado/Pago)
- TASK-029: GraficoSemana (Recharts area chart)
- TASK-030: ContaRow component (lista com swipe)
- TASK-031: FormConta (adicionar/editar)
- TASK-032: ListaContas container
- TASK-033: Filtros (Tabs: Todas/Pendentes/Atrasadas/Pagas)
- TASK-034: InputBusca component
- TASK-035: Badge Status (verde/amber/vermelho)
- TASK-036: Loading skeleton
- TASK-037: Error boundary
- TASK-038: Modal wrapper
- TASK-039: Header component
- TASK-040: Sidebar navigation
- TASK-041: FloatingActionButton
- TASK-042: Toast notifications
- TASK-043: useLocalStorage hook
- TASK-044: useCategoriasStore (Zustand)

**Duração total Sprint 3:** ~20-25h

---

# 🏃 Sprint 4 — Features: Dashboard + Contas

> **Objetivo:** Features implementadas e funcionando
> **Meta:** Usuário consegue criar conta, ver no dashboard, filtrar, editar, deletar

## TASK-045 a TASK-064 (20 tasks)

**Tasks desta Sprint:**
- TASK-045: Dashboard container (orquestra SaldoCard + KPICards + Gráfico)
- TASK-046: Dashboard logic (calcularEstatisticas)
- TASK-047: ProximasContas list (próximas 5)
- TASK-048: ContasAtrasadas alerts (em vermelho)
- TASK-049: Dashboard animations (Framer Motion)
- TASK-050: ListaContas page (container + abas)
- TASK-051: Filtro por status (abas funcionando)
- TASK-052: Filtro por categoria (dropdown)
- TASK-053: Busca por descricao (input)
- TASK-054: FormConta validação (Zod em tempo real)
- TASK-055: FormConta submit (criar conta)
- TASK-056: FormConta parcelamento (dividir valor)
- TASK-057: FormConta recorrência (semanal/mensal/anual)
- TASK-058: Calcular parcelas (função com testes)
- TASK-059: Gerar próxima recorrência (data automática)
- TASK-060: Modal adicionar conta (slide-up)
- TASK-061: Modal editar conta (pré-popular fields)
- TASK-062: Confirmar remover (dialog)
- TASK-063: Marcar como pago (swipe right + checkmark animation)
- TASK-064: Configuracoes page (tema, saldo inicial, nome)

**Duração total Sprint 4:** ~25-30h

---

# 🏃 Sprint 5 — Testes, Polish & Deploy

> **Objetivo:** App pronto para produção
> **Meta:** Testes passam, performance bom (Lighthouse 85+), deploy em Vercel

## TASK-065 a TASK-075 (11 tasks)

**Tasks desta Sprint:**
- TASK-065: Testes unitários - validações (Zod)
- TASK-066: Testes unitários - cálculos (parcelamento, data)
- TASK-067: Testes de componentes - SaldoCard, KPICards
- TASK-068: Testes de componentes - FormConta
- TASK-069: Testes de hooks - useContas, useFetchContas
- TASK-070: Smoke test - fluxo completo (add → view → edit → delete)
- TASK-071: Performance audit (Lighthouse)
- TASK-072: Otimizações (bundle size, images, caching)
- TASK-073: Acessibilidade (prefers-reduced-motion, ARIA)
- TASK-074: README.md detalhado (getting started, tech stack)
- TASK-075: Deploy Vercel + validar em produção

**Duração total Sprint 5:** ~15-20h

---

## ✅ Definição de Pronto (DoD Global)

Para **QUALQUER** task ser considerada CONCLUÍDA:

- [ ] Código implementado conforme SPEC
- [ ] Nenhuma lei Constitution violada (especialmente LEI #14: design premium)
- [ ] TypeScript sem `any`
- [ ] Testes passando (se houver testes)
- [ ] Funciona offline (desconectar Wi-Fi, testar)
- [ ] Dark mode está escuro (#0F0F0F background)
- [ ] Sem `console.log()` em produção
- [ ] Validações Zod funcionando
- [ ] Registrado em forge-data.json via `/forge-execute`

---

## 🔀 Recomendações Executivas

1. **Comece por TASK-001** (Next.js setup) — bloqueia tudo
2. **Sprint 1 e 2 são críticos** — cuide especialmente com persistência
3. **Paralelize quando possível** — Sprint 3 (componentes) pode rodar enquanto Sprint 2 (hooks) está em progresso
4. **Teste frequentemente** — não deixe testes para Sprint 5
5. **Registre progresso** — execute `/forge-execute` após cada task ou grupo de tasks
6. **Dark mode é inegociável** — LEI #14 (Constitution)

---

## 📌 Próxima Tarefa

**➡️ TASK-001 — Next.js 16 + TypeScript Setup**

Abra uma **janela limpa** no Claude Code:
- Leve: CLAUDE.md, docs/SPEC.md, docs/CONSTITUTION.md
- Contexto: Este PLAN.md
- Comande: `/forge-execute` quando terminar

**Sucesso = `npm run dev` sem erros, projeto rodando.**

---

**Versão:** 1.0  
**Status:** 🔄 Em execução  
**Última atualização:** 2026-04-09  
**Próxima revisão:** Após Sprint 1 completa

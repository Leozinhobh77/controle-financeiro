# 🏦 Controle de Contas v2

Aplicativo mobile-first para gerenciar contas a pagar com design premium elegante.

## Stack Técnica

- **Frontend:** Next.js 16, React 19, TypeScript
- **Styling:** Tailwind CSS v4, shadcn/ui
- **Animações:** Framer Motion
- **Gráficos:** Recharts
- **Estado:** Zustand + TanStack Query
- **Validações:** Zod
- **Banco de dados:** SQLite (sql.js em browser)
- **Deploy:** Vercel + PWA

## Instalação

```bash
# Instalar dependências
npm install

# Rodar em desenvolvimento
npm run dev

# Build para produção
npm run build

# Iniciar servidor de produção
npm start

# Testes
npm test

# Linting
npm run lint
```

## Estrutura de Pastas

```
controle-financeiro/
├── app/                  # Next.js App Router
│   ├── components/       # Componentes React
│   ├── page.tsx         # Dashboard (página inicial)
│   ├── layout.tsx       # Layout raiz
│   └── globals.css      # Estilos globais
├── lib/                 # Utilitários, hooks, tipos
├── public/              # Assets estáticos
├── docs/                # Documentação (PRD, SPEC, CONSTITUTION, PLAN)
├── js/                  # Código vanilla JS antigo (v0.x)
└── CLAUDE.md            # Instruções para Claude Code
```

## Status

- ✅ Sprint 1: Setup & Fundação (Next.js 16, TypeScript, Tailwind)
- ⏳ Sprint 2: Persistência & Banco de Dados
- ⏳ Sprint 3: Componentes UI & Hooks
- ⏳ Sprint 4: Features Core (Dashboard, CRUD, Filtros)
- ⏳ Sprint 5: Testes & Deploy

## Documentação

- **[CLAUDE.md](./CLAUDE.md)** — Instruções para Claude Code
- **[docs/PRD.md](./docs/PRD.md)** — Requisitos do produto
- **[docs/CONSTITUTION.md](./docs/CONSTITUTION.md)** — Leis do projeto
- **[docs/SPEC.md](./docs/SPEC.md)** — Especificação técnica
- **[docs/PLAN.md](./docs/PLAN.md)** — Plano de sprints

## Desenvolvimento

### Convenções

- **Código:** Inglês (variáveis, funções, classes)
- **Documentação:** Português brasileiro (comentários, docs)
- **Dark mode:** Padrão obrigatório
- **TypeScript:** `strict: true` (sem `any`)

### Próximas Tarefas (Sprint 2)

1. TASK-013: Tailwind + shadcn/ui configurados
2. TASK-025: Storage Adapter criado
3. TASK-031: SQLite schema definido

---

**Versão:** 0.1.0  
**Última atualização:** 2026-04-09  
**Próximo passo:** TASK-002 (Tailwind CSS v4 + Dark Mode)

# AI_CONTEXT — Controle Financeiro v2
**Forge v4.0 Titan** | Stack: Next.js 16 + React 19 | Fase: Desenvolvimento (Sprint 1)

## Estado Atual
- **Health Score:** 94/100
- **Progresso Global:** 4%
- **Sprint Ativa:** Sprint 1 — Setup & Fundação (25% concluída)
- **Sentinela:** INATIVA (ativar na Janela 2 ao iniciar /skill-construtor)

## Arquitetura de Memória (TITAN v4.0)
- **Core Memory:** `.skill-memory/working-memory.json` (3KB — LER SEMPRE PRIMEIRO)
- **Sprint Journal:** `.skill-memory/sprint-journal.json` (Histórico de tarefas e progresso)
- **Sentinela Channel:** `.skill-memory/sentinela-channel.json` (Canal de auditoria em tempo real)
- **Bug-DNA Global:** `../../.forge/forge-knowledge-base.json` (Memória de erros e soluções)

## Estrutura de Pastas (Padrão Forge Titan)
```text
controle-financeiro/
├── .skill-memory/      ← Memória do sistema (inviolável)
├── app/                ← Motor Next.js 16 (Source Code)
├── docs/               ← Documentação PRD, SPEC, PLAN (Arquitetura)
├── lib/                ← Lógica de domínio, DB (Prisma), Utilities
│   ├── database/       ← Prisma Client & Migrations
│   └── shared/         ← Utilitários globais
├── public/             ← Assets estáticos
└── tests/              ← Testes unitários e integração (Vitest)
```

## Regras Críticas do Projeto
1. **Design System:** Obsidian & Gold (#0F0F0F back, #F59E0B accent). Georgia para headers, Segoe UI para corpo.
2. **Type Safety:** TypeScript obrigatório em todo o projeto.
3. **Persistência:** SQLite local via Prisma/Storage Adapter.
4. **Pipeline SDD:** 
   - 1. `/skill-inicializador` ✅ 
   - 2. `/skill-consultor` (Próximo para aprofundar PRD se necessário)
   - 3. `/skill-planner`
   - 4. `/skill-documentador`
   - 5. `/skill-construtor` (+ `/skill-sentinela`)

## Snapshot Histórico
O projeto foi migrado de uma estrutura híbrida para a **Arquitetura Titan v4.0** em 2026-04-13. A lógica original de parcelamento e recorrência deve ser preservada na migração para Next.js.

---
*Manual de Operações gerado via skill-inicializador v4.0*

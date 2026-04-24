# ◎ PLAN — Plano de Ataque do Controle Financeiro
**Status:** 🔄 Em aprovação inicial | **Prioridade:** Motor (API/DB)

Este plano define a execução estratégica para a migração total do projeto para a **Arquitetura Titan v4.0**, priorizando a integridade dos dados e a lógica de parcelamento.

---

## 🏁 SPRINT 2 — Motor & Sincronia (Prisma + API)
> **Objetivo:** Consolidar a persistência de dados no Next.js 16 e migrar a lógica da API legada.

### TASK 2.1 — Prisma Client Factory & Singleton
- **Descrição:** Implementar o padrão singleton para o Prisma Client em `lib/database/client.ts` para evitar esgotamento de conexões no Next.js (Fast Refresh).
- **DoD:** `npx prisma generate` concluído; Client exportado e testado em uma Server Action básica.
- **Complexity:** MEDIUM
- **Sensores Obrigatórios:** `npx prisma validate`, `tsc`

### TASK 2.2 — Migração de API Routes (Contas & Parcelas)
- **Descrição:** Transcrever as rotas de `docs/legacy/server.js` para `app/api/contas/route.ts`. Preservar 100% da lógica de cálculo de parcelas e recorrência.
- **DoD:** Endpoint `/api/contas` (GET/POST) funcional e persistindo no `financeflow.db`.
- **Complexity:** HIGH
- **Sensores Obrigatórios:** `eslint`, `vitest` (teste unitário de rota)

### TASK 2.3 — Vacinação Bug-DNA (Next.js 16 PeerDeps)
- **Descrição:** Validar as dependências de UI contra a versão experimental do React 19/Next 16. Ajustar `.npmrc` se necessário.
- **DoD:** `npm build` sem avisos críticos de peer-dependencies.
- **Complexity:** MEDIUM
- **Sensores Obrigatórios:** `npm build`

---

## 🎨 SPRINT 3 — Interface Elite (Obsidian & Gold)
> **Objetivo:** Refatorar o frontend para a estética premium Agente Forge.

### TASK 3.1 — Global Theme & Tailwind 4 Setup
- **Descrição:** Configurar tokens de cor (#0F0F0F, #F59E0B) e tipografia em `globals.css`.
- **DoD:** Dark mode persistente e componentes básicos (Botão, Layout) estilizados.
- **Complexity:** MEDIUM
- **Sensores Obrigatórios:** `lighthouse` (Aesthetics score)

### TASK 3.2 — Dashboard Reativo (Recharts)
- **Descrição:** Implementar os gráficos de fluxo de caixa e provisionamento de parcelas.
- **DoD:** Gráficos renderizando dados reais do SQLite em tempo real.
- **Complexity:** HIGH
- **Sensores Obrigatórios:** `tsc`, `visual-regress`

---

## 🛡️ SPRINT 4 — Auditoria & Finalização
> **Objetivo:** Ativação total da Sentinela e garantia de qualidade.

### TASK 4.1 — Setup de Sensores da Sentinela
- **Descrição:** Configurar `sentinela-channel.json` para monitorar tasks automaticamente.
- **DoD:** Sentinela reporta progresso em tempo real no Terminal 2.
- **Complexity:** MEDIUM

---

*Assinado: Arquiteto de Operações Forge v4.0*

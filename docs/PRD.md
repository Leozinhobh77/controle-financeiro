# ◈ PRD — Product Requirements Document

**Projeto:** Controle de Contas v2  
**Versão:** 1.0  
**Data:** 2026-04-09  
**Status:** ✅ Aprovado  
**Autor:** Léo + FORGE  
**LLM:** Haiku 4.5  

---

## 💡 O que é o Controle de Contas v2?

Controle de Contas v2 é um **aplicativo mobile-first para gerenciar contas a pagar** com design premium, elegância e confiança. Ele transforma a forma como microempreendedores visualizam e controlam suas despesas.

A solução mantém a **lógica de negócio sólida** do app atual (parcelamento automático, recorrências inteligentes, cálculo de saúde financeira), mas substitui a interface por um **design de última geração** inspirado em Revolut e Nubank.

Diferente de apps genéricos de finanças (que fazem tudo — receita, despesa, investimento), este é **especializado em contas a pagar**. Diferente de bancos (que apenas cobram), este **gerencia** — agrupa, categoriza, alerta, visualiza.

> **Em uma frase:** O app mais elegante para pagar contas no tempo certo, no celular, em qualquer lugar.

---

## 🔥 Problema que Resolve

1. **Visualização caótica** — Microempreendedor não sabe quanto falta pagar até conferir manualmente
2. **Contas atrasadas** — Sem alertas inteligentes, atrasos se acumulam
3. **Desorganização** — Planilhas Excel sem automação, propenso a erros
4. **Interface desatualizada** — Apps atuais não inspiram confiança com dados financeiros sensíveis
5. **Falta de automação** — Parcelamento e recorrências exigem recálculo manual
6. **Sem privacidade** — Soluções cloud expõem dados financeiros em servidores
7. **Ineficiência mobile** — Microempreendedor está na rua, precisa de app rápido e confiável

---

## 👤 Para Quem é?

### Persona Principal: **Léo — Microempreendedor**
- **Perfil:** Autônomo ou pequeno empreendedor (MEI), 25-50 anos
- **Comportamento:** Usa smartphone 90% do tempo, trabalha em movimento (rua, reuniões, home office)
- **Dor principal:** Não sabe exatamente quanto precisa pagar este mês até consultar manualmente
- **Como resolve hoje:** Planilha Excel desorganizada, lembretes no celular, contas espalhadas em apps de banco
- **Por que não basta:** Sem automação, sem visualização clara, sem alertas, sem histórico, sem análise
- **Necessidade não atendida:** Um app que seja ao mesmo tempo ELEGANTE (para confiar) + PRÁTICO (para usar diariamente)

### Persona Secundária: **Analista Financeiro (futuro)**
Quando Léo crescer e contratar pessoas, precisará compartilhar visualizações de contas. Este é o caminho v2+.

---

## 🌐 Análise de Mercado

### Concorrentes Identificados

| Solução | O que faz | Modelo | Ponto forte | Ponto fraco |
|---------|-----------|--------|-------------|------------|
| **Guiabolso** | Agregador financeiro | Freemium | Visão 360° das finanças | Genérico, não especializado em contas pagar |
| **Nubank PJ** | Conta + pagamentos | Grátis | Integrado com banco real | Apenas interface de pagamento, sem gestão |
| **Stone** | ERP pequeno | Freemium | Produto completo | Caro para MEI puro, UI corporativa |
| **Planilhas Excel** | Manual | Grátis | Controle total | Zero automação, bug-prone, lento, sem UX |
| **Bling/Omie** | ERP enterprise | Pago | Robusto | Preço alto (R$ 59-200/mês), complexo demais |

### Diferencial Competitivo

1. ✅ **Especialização** — 100% focado em contas a PAGAR (concorrentes são genéricos)
2. ✅ **Privacidade** — 100% offline + sync local (dados nunca saem do dispositivo)
3. ✅ **Mobile-first** — Otimizado para celular (não adaptado do desktop)
4. ✅ **Design premium** — Dark mode elegante com amber accents (inspiração Nubank/Revolut)
5. ✅ **Automação inteligente** — Parcelamento, recorrências, cálculo de saúde financeira
6. ✅ **Velocidade** — Interface responsiva, sem lag, funciona offline
7. ✅ **Custo** — Gratuito (futuro freemium ou assinatura baixa)

### Gaps de Mercado

- ❌ Nenhum app especializado APENAS em contas a pagar (todos são genéricos)
- ❌ Nenhum app com interface realmente elegante neste segmento (faltam design investments)
- ❌ Nenhum app com suporte offline-first real (dependem de conexão)
- ❌ Nenhum app que faz parcelamento automático bem (Bling/Omie fazem mas são caros)

---

## 🎯 Objetivos do Produto

1. **MVP viável** — Funcionalidade core (CRUD contas, dashboard, filtros) em 4-5 semanas
2. **Design confiável** — Interface que inspira segurança com dados financeiros (dark mode premium)
3. **Performance** — App responsivo mesmo em conexão 3G / offline
4. **Retenção** — Uso diário (Léo abre para ver quanto falta pagar)
5. **Adoção early** — 100 usuários no primeiro mês (redes pessoais de Léo)
6. **Diferenciação** — Ser mencionado como "o app mais elegante de contas a pagar"

**Como medir sucesso:**
- ✅ Léo usa diariamente por 2 semanas (retenção)
- ✅ Interface carrega em <1s no celular (performance)
- ✅ Zero bugs críticos na primeira semana
- ✅ Score de satisfação >4.5/5 (feedback amigos)

---

## 🧠 Princípio Central

> **Simplicidade visível, inteligência oculta** — A interface é limpa e intuitiva, mas o app automatiza tudo que pode (parcelamento, recorrências, alertas) para não sobrecarregar o usuário.

---

## ⚙️ Funcionalidades Principais

### MVP (Essencial — Semanas 1-4)

1. **Dashboard**
   - Saldo total a pagar (número grande, destaque visual)
   - KPI cards: Pendente, Atrasado, Pago (números com cores)
   - Mini-gráfico: últimos 6 meses (área chart)
   - Próximas 5 contas por vencimento
   - Contas atrasadas (alertas visuais)

2. **Gestão de Contas**
   - Adicionar conta: descrição, valor, data vencimento, categoria, observações
   - Editar conta: alterar dados
   - Remover conta: com confirmação
   - Marcar como pago: com swipe gesture + checkmark animation
   - Status automático: pendente → atrasado → pago

3. **Parcelamento**
   - Parcelar conta em N vezes
   - Cálculo automático de valor/parcela (com ajuste de centavos)
   - Agrupamento visual de parcelas
   - Datas escalonadas automaticamente (mensal)

4. **Recorrências**
   - Criar conta recorrente: semanal/mensal/anual
   - Gerar próxima ocorrência ao marcar como pago
   - Toggle on/off para pausar

5. **Categorias**
   - 9 pré-configuradas: Moradia, Alimentação, Transporte, Saúde, Educação, Lazer, Trabalho, Assinaturas, Outros
   - Cores + ícones customizáveis
   - Filtrar contas por categoria

6. **Filtros & Busca**
   - Abas: Todas, Pendentes, Atrasadas, Pagas
   - Busca por descrição
   - Filtro por mês/ano

### v1.5 (Melhorias — Semana 5)

7. **Analytics**
   - Score de saúde financeira (0-100)
   - Gasto por dia/semana/mês
   - Gastos por categoria (pizza chart)
   - Tendência mensal (bar chart pago vs pendente)

8. **Configurações**
   - Saldo inicial (para calcular projeção)
   - Tema (dark/light)
   - Moeda (padrão BRL, extensível)
   - Nome do usuário

9. **Persistência**
   - Cache em memória (rápido)
   - SQLite local (durável)
   - Sync em background (não bloqueia UI)
   - Fallback offline (funciona sem internet)

### v2.0 (Futuro)

10. **Colaboração** — Compartilhar contas com sócio
11. **Notificações** — Push alerts para vencimentos próximos
12. **Exportação** — PDF/CSV de relatórios
13. **Backend cloud** — Sync multi-dispositivo
14. **Integrações** — API de bancos, automação com Zapier

---

## 🗺️ Roadmap

| Versão | Escopo | Prazo | Status |
|--------|--------|-------|--------|
| **MVP** | Dashboard, CRUD contas, parcelamento, recorrências, categorias, filtros | 4-5 sem | 🔄 In Progress |
| **v1.5** | Analytics (score, gráficos), configurações, persistência | 1 sem | ⏳ Backlog |
| **v2.0** | Colaboração, notificações, exportação, backend | TBD | 💭 Future |

---

## 🚫 O que NÃO é

- ❌ **Não é um agregador financeiro** — Não conecta a bancos automáticamente
- ❌ **Não é ERP completo** — Sem notas fiscais, impostos, conformidade fiscal
- ❌ **Não é app de receita** — Foco exclusivo em contas a pagar
- ❌ **Não é investimento** — Sem análise de portfólio, renda fixa, cripto
- ❌ **Não é empréstimo** — Sem oferta de crédito, financiamento
- ❌ **Não requer backend na nuvem** — Funciona 100% offline (futura sincronia opcional)

---

## 💰 Modelo de Negócio

### Fase 1 (Agora): Gratuito
- Construir base de usuários
- Validar que o problema é real
- Coletar feedback

### Fase 2 (v1.5): Freemium
- **Plano Gratuito:** Até 20 contas, sem sync cloud
- **Plano Premium:** Ilimitado, sync cloud, compartilhamento, R$ 9,90/mês

### Fase 3 (v2.0): B2B
- Vender para pequenos negócios (até 5 usuários)
- Suporte prioritário
- Customização de marca

---

## 📊 Métricas de Sucesso (KPIs)

| Métrica | Alvo | Prazo | Como medir |
|---------|------|-------|-----------|
| Usuários ativos diários (DAU) | 10 | 1 mês | Analytics app |
| Taxa de retenção Day 7 | >50% | 1 mês | Contas abertas há 7+ dias usando |
| Contas criadas por usuário | 5+ | 2 semanas | Média de contas/user no DB |
| Score de satisfação | >4.5/5 | 3 semanas | Feedback de amigos (survey) |
| Performance: load time | <1s | Always | Lighthouse/DevTools |
| Bugs críticos em produção | 0 | Week 1 | Sentry/manual testing |
| Taxa de conclusão do MVP | 100% | Week 4 | Feature checklist |

---

## ⚠️ Riscos e Mitigações

| Risco | Probab. | Impacto | Mitigação |
|-------|---------|---------|-----------|
| **Animações travam em devices antigos** | Média | Médio | Detectar `prefers-reduced-motion`, fallback static |
| **SQLite em mobile é complexo** | Média | Alto | Usar WaSQLite (web) / Tauri (desktop), testar cedo |
| **Sincronização com legacy storage.js** | Baixa | Alto | Refatorar com Storage Adapter pattern, testes unitários |
| **Design novo requer assets (ícones)** | Baixa | Baixo | Usar Heroicons + Phosphor icons (open source) |
| **Scope creep (adicionar mais features)** | Alta | Alto | Manter MVP rigoroso, salvar features para v2 |
| **Perda de dados (SQLite corruption)** | Muito baixa | Crítico | Backups automáticos, recovery guide, rastreamento |

---

## 🧰 Stack Técnica Sugerida

**Justificativa:** Combinação de performance, estilo de código, e comunidade forte em 2026.

### Frontend

- **Next.js 16** — Framework React opinionado, SSR/SSG, API routes, deploy fácil
- **React 19** — Latest com improvements em performance
- **TypeScript** — Type safety, melhor DX, menos bugs
- **Tailwind CSS v4** — Utility-first, custom dark palette, curva baixa
- **shadcn/ui** — Componentes acessíveis (Radix UI + Tailwind), não vendor-locked
- **Framer Motion** — Animações declarativas com spring easing, performance otimizada
- **Recharts** — Gráficos React, lightweight, real-time, responsivo
- **Zustand** — State management minimalista, sem boilerplate
- **TanStack Query** — Cache/sync automático, offline-ready, background updates

### Backend / Persistência

- **SQLite local** — Banco de dados ACID, zero-config, perfeiçõ para offline
- **Tauri (desktop)** — Runtime Rust-backed, app nativo leve (80MB vs 150MB Electron)
- **WaSQLite (web)** — SQLite compilado para WebAssembly, funciona no browser
- **Storage Adapter** — Refatorar `storage.js` atual para abstrair persistência

### DevOps

- **Vercel** — Deploy Next.js automático, edge functions, analytics
- **PWA (Progressive Web App)** — Funciona offline, instalável, cache-first strategy
- **Sentry** — Error tracking, uptime monitoring, alertas

### Why This Stack

- ✅ **Performance** — Next.js + Tailwind + Framer Motion são feitos para UX fluida
- ✅ **Type Safety** — TypeScript previne bugs em produção
- ✅ **Comunidade** — React ecosystem é o maior em 2026, documentação abundante
- ✅ **Custo** — Gratuito até escala (Vercel free tier, Sentry free tier)
- ✅ **Offline-first** — SQLite + Service Workers = funciona sem internet
- ✅ **Escalabilidade** — Se crescer para cloud sync, arquitetura suporta

---

## 🪞 Espelho Honesto — Visão Realista

### ✅ Pontos Fortes

- **Problema real** — Microempreendedor de verdade precisa disso
- **Código sólido existente** — storage.js, financeiro.js já validados (2 meses de uso)
- **Diferencial claro** — Nenhum concorrente faz design elegante + parcelamento automático
- **Equipe competente** — Léo tem experiência com Claude Code, entende SDD
- **Stack moderna** — React 19 + Tailwind é a direção certa em 2026

### ⚠️ Pontos de Atenção

- **Migração de stack** — Vanilla JS → React é migração real, não trivial
- **Design novo** — Requer iteração com usuário real (feedback)
- **SQLite em mobile** — Persiste/sync é a parte técnica mais difícil
- **Scope creep** — Risco de ficar adicionando features ao MVP
- **Usuário único** — Começar com 1 usuário (Léo) é limitado para validar

### 📊 Complexidade Estimada

**Média-Alta** (porque é migração + design novo, não feature simples)

**Breakdown:**
- Setup Next.js + Design System = Média
- Dashboard + KPIs = Média
- CRUD + Modais = Fácil
- Parcelamento/Recorrências = Média
- SQLite persistence + sync = **Alta** ⚠️
- Animações fluidas = Média
- Testing + Polish = Média

### ⏰ Esforço Estimado

**4-5 semanas** (assumindo 20-30h/semana dedicadas)

**Breakdown:**
- Sprint 1 (1 sem): Next.js setup, Design System, Tailwind customizado
- Sprint 2 (1 sem): Dashboard, KPI cards, gráficos (Recharts)
- Sprint 3 (1 sem): Lista filtrada, modal CRUD, filtros
- Sprint 4 (1 sem): Persistência SQLite, refactor storage.js → Adapter, testes
- Sprint 5 (0.5 sem): Polimento, animações, deploy Vercel

### 🎯 Chance de Concluir o MVP

**🟢 Alta (75%+)**

**Por quê:**
- ✅ Código de negócio já existe (reutilizável)
- ✅ Design definido (não é fuzzy)
- ✅ Stack familiar (React, Tailwind, TypeScript)
- ✅ Timeline realista (5 semanas é generoso)
- ✅ Usuário engajado (Léo está investido)

**Riscos de falha:**
- ❌ Scope creep (adicionar features no meio)
- ❌ Perfeccionismo no design (iterações infinitas)
- ❌ SQLite bugs (descobrir tarde)

### 💡 Recomendação Sincera

**VERDE para go.** Este projeto tem fundamentais sólidos:

1. **Problema validado** — Léo de verdade usa o app antigo, sabe a dor
2. **Solução clara** — Não é experimental, é melhoria de produto existente
3. **Equipe qualificada** — Léo já construiu com Claude Code antes
4. **Timeline realista** — 5 semanas é suficiente para MVP robusto
5. **Diferencial real** — Concorrentes não têm design elegante neste segmento

**Recomendações de sucesso:**
- ✅ Manter MVP rigoroso (não adicionar v2 features agora)
- ✅ Testar SQLite cedo (Sprint 3, não Sprint 5)
- ✅ Feedback semanal com usuário real (Léo ou amigo)
- ✅ Deploy incremental (funcionalidades prontas → Vercel, mesmo em beta)
- ✅ Monitorar animações em devices reais (não só desktop)

---

## 👥 Personas Consultadas

- 🎨 UX Designer
- 💻 Frontend Engineer
- ⚙️ Backend Architect
- 💰 Business Analyst

---

## 🛠️ Ferramentas Recomendadas (Sequência SDD)

1. ✅ **/forge-architect** — Rascunho criado
2. ✅ **/forge-prd** — Este documento (você está aqui)
3. ➡️ **/forge-constitution** — Criar as 3 camadas de leis (valores, restrições, regras técnicas)
4. ➡️ **/forge-spec** — Especificar componentes React, APIs, arquitetura de pastas
5. ➡️ **/forge-plan** — Quebrar em 5 sprints com tasks (Gantt, crítico path)
6. ➡️ **/forge-execute** — Sessão de trabalho real (registrar progresso, bugs, decisions)

---

**Versão:** 1.0  
**Status:** ✅ Aprovado  
**Próximo passo:** `/forge-constitution`

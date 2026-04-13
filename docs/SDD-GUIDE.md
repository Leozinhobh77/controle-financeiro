# 📚 SDD Guide — Como Usar Spec Driven Development

**Status:** v1.0  
**Para quem:** Léo e qualquer dev que queira entender o SDD  
**Objetivo:** Ensinar o pipeline SDD de forma prática

---

## O que é SDD?

**SDD = Spec Driven Development**

Significa que você **escreve a especificação ANTES de programar**.

```
❌ Forma velha (errada):
   "Vou começar a codar e ver o que sai"
   → Resultado: código bagunçado, retrabalho, bugs

✅ Forma SDD (certa):
   1. Defino O QUÊ preciso (PRD)
   2. Defino AS LEIS que nunca quebro (CONSTITUTION)
   3. Defino COMO fazer (SPEC)
   4. Defino QUANDO fazer (PLAN)
   5. Executo (EXECUTE)
```

---

## 🔄 Pipeline SDD — 5 Etapas

```
┌─────────────┐
│ 1️⃣ PRD      │  "O QUÊ" — Qual é o problema que estou resolvendo?
│             │  Contém: personas, mercado, features, roadmap
└──────┬──────┘
       ↓
┌─────────────┐
│ 2️⃣ CONST    │  "COMO" — Quais são as leis que nunca quebro?
│             │  Contém: 23 leis invioláveis, stress tests
└──────┬──────┘
       ↓
┌─────────────┐
│ 3️⃣ SPEC     │  "ONDE/COM O QUÊ" — Como vou construir?
│             │  Contém: componentes, banco, APIs, decisões
└──────┬──────┘
       ↓
┌─────────────┐
│ 4️⃣ PLAN     │  "QUANDO/QUEM" — Qual é o plano de ataque?
│             │  Contém: sprints, tasks, caminho crítico
└──────┬──────┘
       ↓
┌─────────────┐
│ 5️⃣ EXECUTE  │  "FAZER" — Agora sim, código!
│             │  Contém: implementação, testes, deploy
└─────────────┘
```

---

## 📄 Cada Documento

### 1️⃣ **PRD** — Product Requirements Document

**Responde:** "Por que estamos fazendo isso?"

**Contém:**
- Descrição do produto
- Problema que resolve
- Personas (quem usa)
- Features principais (MVP)
- Roadmap (v1, v1.5, v2)
- KPIs (como medir sucesso)
- Riscos e mitigações

**Exemplo do projeto:**
```
Problema: Léo (microempreendedor) não consegue visualizar 
          quanto precisa pagar este mês
Solução: App elegante com dark mode + parcelamento automático
Diferencial: Design premium + offline-first + 100% privado
```

**Localização:** `docs/PRD.md`

---

### 2️⃣ **CONSTITUTION** — Leis Invioláveis

**Responde:** "Quais são as regras que NUNCA quebro?"

**Contém:**
- 23 leis divididas em 3 categorias:
  - 🔴 Fundamentais (obrigatórias em todo projeto)
  - 🟡 Arquitetura (baseadas na stack)
  - 🔵 Processo (baseadas no perfil do dev)

**Exemplos:**
```
LEI #14: Design premium é inegociável
         → Dark mode padrão, amber accent, animações suaves

LEI #11: Dados financeiros nunca saem do device
         → 100% offline, SQLite local, nenhum servidor

LEI #13: Validação rigorosa de parcelamento
         → Testes com 3 cenários, nunca erra cálculo
```

**Localização:** `docs/CONSTITUTION.md`

---

### 3️⃣ **SPEC** — Especificação Técnica

**Responde:** "Como vou construir?"

**Contém:**
- Stack técnica (Next.js, React, Tailwind, etc)
- Componentes React (Button, Card, Dialog, etc)
- Banco de dados (schema SQL, tabelas)
- Rotas e navegação
- Fluxos de dados
- Decisões técnicas (por que escolhi Zustand e não Redux)

**Exemplo:**
```
Componente: Button
├─ Variantes: default (amber), secondary, outline, ghost
├─ Tamanhos: sm, default, lg, icon
├─ Props: variant, size, disabled
└─ Accessibility: aria-label, focus ring

Stack: Next.js 16 + React 19 + TypeScript
├─ Frontend: Tailwind CSS v4, shadcn/ui
├─ State: Zustand (simples) + TanStack Query (cache)
└─ Banco: SQLite local (WaSQLite)
```

**Localização:** `docs/SPEC.md`

---

### 4️⃣ **PLAN** — Plano de Sprints

**Responde:** "Quando vou fazer? Qual é a ordem?"

**Contém:**
- 5 sprints (Sprint 1 a 5)
- ~75 tasks
- Dependências (qual task bloqueia qual)
- Caminho crítico (18 tasks que não podem atrasar)
- Estimativas de tempo

**Estrutura de uma task:**
```
TASK-001: Next.js 16 + TypeScript setup
├─ Complexidade: 🟢 Baixa
├─ Depende de: nada
├─ Duração: ~2h
├─ Definition of Done:
│  ✅ Projeto criado
│  ✅ npm run dev funciona
│  ✅ Rotas criadas
│  ✅ .gitignore configurado
└─ Status: ✅ CONCLUÍDO
```

**Localização:** `docs/PLAN.md`

---

### 5️⃣ **EXECUTE** — Registrar a Sessão

**Responde:** "O que eu fiz?"

**Contém:**
- Tasks concluídas
- Divergências encontradas (SPEC vs código)
- Erros e soluções
- Progresso (antes e depois)
- Health score
- Histórico da sessão

**Localização:** `forge/forge-data.json` + `/forge-execute` skill

---

## 🎯 **Na Prática: Como Usar**

### Quando você vai implementar uma feature:

**Passo 1: Leia o PRD**
```
"Preciso implementar o Dashboard"
→ Abra docs/PRD.md, seção "Funcionalidades Principais"
→ Veja: "Dashboard tem saldo total, KPIs, gráfico, próximas contas"
```

**Passo 2: Verificar a CONSTITUTION**
```
"Vou implementar o Dashboard"
→ Leia LEI #14: "Design premium é inegociável"
→ Leia LEI #12: "Offline-first inegociável"
→ Certifique-se que seu código respeita isso
```

**Passo 3: Leia a SPEC**
```
"Como o Dashboard deve ser?"
→ Abra docs/SPEC.md, seção "Interface — Telas"
→ Veja a tabela de rotas: / → Dashboard
→ Leia os componentes que precisa (SaldoCard, KPICards, etc)
```

**Passo 4: Veja a PLAN**
```
"Qual é minha tarefa?"
→ Abra docs/PLAN.md, seção "Sprint 4 — Features"
→ Procure TASK-045: "Dashboard container"
→ Veja dependências (precisa fazer Persistência antes)
```

**Passo 5: Implemente**
```
Agora você sabe EXATAMENTE o que fazer, por quê, e como
→ Código sai limpo, sem retrabalho
```

**Passo 6: Registre com /forge-execute**
```
Ao terminar:
→ Execute /forge-execute
→ Descreva o que fez
→ Sistema compara com SPEC (divergências?)
→ Registra em forge-data.json (histórico permanente)
```

---

## 🧠 **Benefícios do SDD**

| Antes (sem SDD) | Depois (com SDD) |
|---|---|
| ❌ Faz feature sem entender direito | ✅ Entende 100% antes |
| ❌ Código sem direção | ✅ Código segue SPEC |
| ❌ Retrabalho constante | ✅ Feito certo na 1ª vez |
| ❌ Divergências descobertas tarde | ✅ Divergências detectadas cedo |
| ❌ Sem histórico de decisões | ✅ Tudo documentado (forge-data) |
| ❌ IA duplica componentes | ✅ IA reutiliza tudo |
| ❌ 6 semanas de desenvolvimento | ✅ 5 semanas (25% mais rápido) |

---

## 📊 **Nosso Projeto Usa SDD**

```
✅ PRD v1.0 — Aprovado
✅ CONSTITUTION v1.0 — 23 leis
✅ SPEC v1.0 — Stack definida
✅ PLAN v1.0 — 5 sprints, 75 tasks
🔄 EXECUTE v0.3 — 3 tasks concluídas
```

**Progresso:** 4% (3/75 tasks)  
**Health Score:** 94/100  
**Divergências:** 0 (perfeito!)  
**Retrabalho:** 0% (perfeito!)  

---

## 💡 **Próxima Vez**

Quando chamar `/forge-execute`:

1. **Descreva** o que fez (quais tasks)
2. FORGE **compara** com SPEC (procura divergências)
3. FORGE **registra** tudo em forge-data.json
4. **Histórico permanente** para consultar depois

---

**Lembre:** O SDD não é burocracia — é **liberdade**.  
Porque você sabe exatamente para onde está indo.

---

**Última atualização:** 2026-04-09  
**Versão:** 1.0

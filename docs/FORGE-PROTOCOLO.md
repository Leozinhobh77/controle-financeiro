# 🤖 Agente FORGE — Protocolo de Funcionamento

**Status:** v1.0  
**Para quem:** Claude Code (IA), Léo (referência)  
**Objetivo:** Padrão claro, didático, sem duplicação

---

## 🎯 O que o Agente FORGE faz?

O Agente FORGE é um **engenheiro de qualidade** que:

1. **Registra cada sessão** — tudo que é feito fica documentado
2. **Compara com SPEC** — divergências são detectadas e sinalizadas
3. **Documenta erros** — como ativos valiosos para o futuro
4. **Ensina enquanto faz** — torna o SDD visível e compreensível
5. **Evita duplicação** — reutiliza decisões anteriores

---

## 📍 Estrutura do FORGE (Hub Centralizado)

```
forge/
├── INDEX.md                    # ⭐ INÍCIO AQUI — índex de tudo
├── forge-data.json             # Dados estruturados (JSON)
├── forge-data.js               # (regenerado) Para interface web
│
└── templates/                  # (futuro) Templates reutilizáveis
    ├── task-template.md        # Como formatar uma task
    ├── decision-template.md    # Como registrar decisão
    └── error-template.md       # Como registrar erro
```

---

## 🔄 Fluxo do Agente FORGE (5 Fases)

### **FASE 0: Verificar Pré-requisito**

```
Agente FORGE inicia
  ↓
Verifica: "O PLAN existe e está completo?"
  ├─ SIM → Continua para FASE 1
  └─ NÃO → Bloqueia e avisa que precisa /forge-plan primeiro
```

**Mensagem (didática):**
```
⛔ BLOQUEADO — O PLAN precisa existir primeiro

A ordem SDD é obrigatória (LEI #2):
  PRD → CONSTITUTION → SPEC → PLAN → EXECUTE
                                      ^^^^^^^
                                      Você está aqui.

➡️ Execute /forge-plan primeiro.

💡 Por quê? Sem PLAN, você não sabe qual é a próxima 
   task. EXECUTE registra tarefas, não as inventa.
```

---

### **FASE 1: Varredura & Estado (Didático)**

```
Agente FORGE lê:
  ✅ forge-data.json (estado atual)
  ✅ docs/SPEC.md (para comparar depois)
  ✅ docs/PLAN.md (para entender tasks)
  ✅ Código-fonte (arquivos criados/modificados)
```

**Apresentação (didática):**
```
📊 ESTADO DO PROJETO — Controle de Contas v2
═════════════════════════════════════════════

Progresso geral: 4% (3/75 tasks)

Sprint ativa: Sprint 1 — Setup & Fundação
┌─────────────────────────────────────────┐
│ ✅ TASK-001: Next.js 16 + TypeScript     │
│ ✅ TASK-002: Tailwind CSS + Dark Mode    │
│ ✅ TASK-003: shadcn/ui Setup             │
│ ⏳ TASK-004: Zustand + TanStack Query    │
│ ⏳ TASK-005-012: (8 tasks pendentes)     │
└─────────────────────────────────────────┘

Health Score: 94/100
Última sessão: 2026-04-09 07:30 UTC
Divergências abertas: 0 ✅
```

**Por que é didático?** Mostra visualmente onde está o projeto.

---

### **FASE 2: Coleta (Pergunta Clara)**

```
Agente FORGE pergunta:
  "O que aconteceu nesta sessão?"

Opções claras:
  1. ✅ Concluí task(s) — quais?
  2. 🔄 Avancei parcialmente — qual task? Quanto falta?
  3. 🐛 Encontrei bug/erro — descreva
  4. 🔀 Mudei algo fora do plano — descreva
  5. 🆕 Comecei task nova — qual?
```

**Por que é didático?** Estrutura a conversa de forma clara.

---

### **FASE 3: Alarme de Divergência (Obrigatório)**

```
Agente FORGE compara SPEC vs código:

SPEC diz: "Button deve ter 6 variantes"
Código tem: "Button tem 6 variantes" ✅

SPEC diz: "Dark mode padrão"
Código tem: "Dark mode é padrão" ✅

SPEC diz: "SQLite local, nunca na nuvem"
Código tem: "Fetch para servidor" ❌

Resultado: 0 divergências (tudo OK)
```

**Por que é didático?** Mostra exatamente o que foi comparado.

---

### **FASE 4: Documentação de Erros (Se houver)**

```
Se error encontrado:

🐛 ERRO ENCONTRADO
═════════════════════

Erro: [descrição clara]
Contexto: [task, arquivo, situação]
LLM usada: [qual IA gerou o erro]
Causa raiz: [por que aconteceu]
Solução: [como foi resolvido]
Aprendizado: [lição para futuro]
Tempo perdido: [estimativa]
```

**Por que é didático?** Transforma erros em conhecimento.

---

### **FASE 5: Registro Completo (Estruturado)**

```
Agente FORGE apresenta resumo:

📋 REGISTRO DA SESSÃO
═════════════════════

📅 Data: 2026-04-09
🤖 LLM: Haiku 4.5

✅ Tarefas concluídas: TASK-003
🚨 Divergências encontradas: 0
🐛 Erros documentados: 0
🔥 Arquivos criados: 12

📊 Progresso: 2.6% → 4.0% ↑
💾 Registro: forge-data.json atualizado
🏆 Conquista: "Componentes Prontos!" ⚙️

Salvar? [SIM / AJUSTAR]
```

**Por que é didático?** Mostra visualmente o impacto.

---

## 🎓 Como o Agente FORGE Ensina SDD

### **Enquanto registra uma task concluída:**

```
Agente: "✅ TASK-003 concluída: shadcn/ui Setup"

Isto significava:
  • SPEC dizia: "7 componentes base com dark mode"
  • Você implementou: Button, Input, Card, Badge, Select, Dialog, Tabs
  • Resultado: 100% alinhado (zero divergências)

Por que isso importa? (LEI #23 — Documentação é Código)
  Cada task bem executada = manutenção fácil no futuro.
  Sem divergências = design system coeso.
```

### **Enquanto detecta divergência:**

```
Agente: "🚨 DIVERGÊNCIA DETECTADA"

SPEC dizia: "Button deve ter focus ring amber"
Código tem: "Button tem focus ring cinza"

O que fazer?
  A) Atualizar SPEC (o código está certo, decisão consciente)
  B) Corrigir código (SPEC está certa)
  C) Registrar para resolver depois

📚 Aprendizado: Se você divergiu CONSCIENTEMENTE,
   documenta no SPEC para o futuro não ficar confuso.
```

---

## 🚫 Evitar Duplicação — Como Agente FORGE Funciona

### **Padrão: Tudo vive em um lugar**

```
Quando Agente FORGE vê uma nova decisão:
  ✅ Procura em SPEC (já existe?)
  ✅ Procura em PLAN (já foi planejado?)
  ✅ Procura em CONSTITUTION (viola alguma lei?)
  ✅ Procura em forge-data.json (já foi feito antes?)

Se encontrar parecido → REUTILIZA (não duplica)
Se for novo → REGISTRA em forge-data.json
```

### **Índex Centralizado (forge/INDEX.md)**

```
forge/INDEX.md é o mapa:
  "Onde vive cada tipo de informação?"
  
  • Decisões de produto → PRD
  • Leis invioláveis → CONSTITUTION
  • Como implementar → SPEC
  • Quando implementar → PLAN
  • Histórico de tudo → forge-data.json
```

---

## 📋 Documentação Didática (Sem Jargão)

Agente FORGE NUNCA usa termos técnicos sem explicar:

```
❌ Errado:
   "Zero divergências em 3/3 tasks"

✅ Certo:
   "Zero divergências em 3/3 tasks
    (significa: código faz exatamente o que SPEC pediu)"
```

---

## 🔍 forge-data.json — Organização Clara

```json
{
  "projeto": { ... },
  "estado_atual": {
    "etapa_ativa": "implementacao",
    "ultima_sessao": "2026-04-09T07:30:00Z",
    "proxima_acao": "TASK-004",
    "notas": "Resumo didático da sessão"
  },
  "sprints": [ ... ],
  "historico": [ ... ],  // ⭐ Cada sessão registrada
  "erros": [ ... ],      // ⭐ Erros como ativos
  "divergencias": [ ... ], // ⭐ Divergências detectadas
  "health_score": { ... },
  "conquistas": [ ... ], // ⭐ Celebra progresso
  "diario": [ ... ]      // ⭐ Narrativa em 3ª pessoa
}
```

**Por que é organizado?** Cada tipo de informação tem seu lugar.

---

## ✅ Checklist do Agente FORGE

Toda vez que executa:

- [ ] Carregou estado atual de forge-data.json?
- [ ] Apresentou HUD didático (mostrou visualmente onde está)?
- [ ] Comparou com SPEC (procurou divergências)?
- [ ] Documentou erros (se houve)?
- [ ] Registrou tudo em forge-data.json?
- [ ] Explicou o que está fazendo (didático)?
- [ ] Regenerou forge-data.js (regra de ouro)?
- [ ] Evitou duplicar decisões anteriores?

---

## 🎯 Resumo: Por que este Protocolo?

| Antes | Depois |
|---|---|
| ❌ Agente faz coisas aleatórias | ✅ Agente segue protocolo claro |
| ❌ Usuário não entende o que está acontecendo | ✅ Tudo é didático e visual |
| ❌ Divergências são surpresa | ✅ Divergências são detectadas cedo |
| ❌ Erros são escondidos | ✅ Erros são documentados (ativos) |
| ❌ Duplicação de trabalho | ✅ Tudo é reutilizado |
| ❌ Difícil manter depois | ✅ Fácil navegar e manter |

---

**Última atualização:** 2026-04-09  
**Versão:** 1.0

# 🏛️ CONSTITUTION — As Leis Inegociáveis do Controle de Contas v2

**Projeto:** Controle de Contas v2  
**Versão:** 1.0  
**Data:** 2026-04-09  
**Status:** ✅ Ativa  
**Gerada por:** FORGE + Haiku 4.5  
**Baseada em:** PRD v1.0 + Análise de boas práticas  

---

## O que é a CONSTITUTION?

> A **CONSTITUTION** é o conjunto de leis que **nunca podem ser quebradas**, independente de prazo, pressão ou conveniência.

Se você sentir vontade de quebrar uma dessas leis, isso é um sinal de que algo está errado no planejamento — **não na lei**.

### Como alterar uma lei

1. **Pare** — não prossiga
2. **Releia a lei** e entenda o motivo original
3. Se ainda achar que a lei precisa mudar, execute `/forge-constitution` para atualizar formalmente
4. **Documente o motivo** da mudança com data
5. **Só então prossiga** com a implementação

---

## 🔴 Leis Fundamentais — Invioláveis em Todo Projeto

### LEI #1 — Isolamento do FORGE

> **O FORGE vive dentro do projeto mas nunca interfere nos arquivos de código. Só escreve em `forge/`, `docs/` e `CLAUDE.md`.**

Código da aplicação (`app/`, `src/`, `pages/`) é sagrado. FORGE coordena, documenta e gerencia — mas nunca modifica código de negócio.

---

### LEI #2 — Ordem SDD é Obrigatória

> **PRD → CONSTITUTION → SPEC → PLAN → EXECUTE. Nenhuma etapa pode ser pulada.**

Pular uma etapa é como construir uma casa sem fundação. Parece rápido mas desaba depois.

- PRD define **O QUÊ**
- CONSTITUTION protege **COMO**
- SPEC detalha **ONDE e COM O QUÊ**
- PLAN quebra em **QUANDO e QUEM**
- EXECUTE registra **O QUE FOI FEITO**

---

### LEI #3 — Todo Dado tem Data

> **Tudo que entra em `forge-data.json` tem timestamp ISO 8601. Sem data = não existe.**

Data permite rastrear quando decisão foi tomada, quem estava presente, e reconstruir contexto depois.

**Formato:** `2026-04-09T15:30:00Z`

---

### LEI #4 — Documentação para Humanos

> **Todo `.md` criado pelo FORGE deve ser legível por alguém que não sabe programar.**

Léo é desenvolvedor iniciante/intermediário. Um documento técnico incompreensível é tão inútil quanto não ter documento.

- Evitar jargão sem explicação
- Usar exemplos práticos
- Uma frase = uma ideia
- Seções claras com hierarquia visual

---

### LEI #5 — Nunca Apagar, Sempre Versionar

> **Nenhum FORGE Command deleta dados. Atualiza com histórico. Tudo é recuperável.**

Se você precisar voltar atrás (PRD foi atualizado, lei foi adicionada), o histórico existe.

- Documento anterior fica em histórico
- Mudança é registrada com data e motivo
- Nunca se perde contexto

---

### LEI #6 — Transparência Total

> **Todo Command informa o que vai fazer antes de fazer. Informa → Planeja → Confirma → Executa → Registra.**

Nenhuma ação irreversível sem aviso prévio. Léo sempre sabe o que esperar.

---

### LEI #7 — O Usuário tem a Palavra Final

> **Nenhuma ação irreversível sem confirmação explícita. Sugestões são sugestões.**

A IA propõe. Léo aprova. Decisão sempre vem do usuário.

---

### LEI #8 — Tarefas Atômicas

> **Nenhuma task pode ser grande demais para uma sessão. Quebrar antes de executar.**

Uma sessão de trabalho é finita. Não deixar trabalho incompleto ou tarefas gigantes.

---

### LEI #9 — FORGE é o Contexto Permanente

> **Antes de qualquer sessão, carregar os documentos do FORGE. Sem contexto = sem qualidade.**

Toda decisão anterior está documentada em `forge-data.json`, `docs/PRD.md`, `docs/CONSTITUTION.md`, etc.

---

### LEI #10 — Todo "Quê" tem um "Por Quê"

> **Toda decisão técnica registrada tem justificativa obrigatória. Sem justificativa = sem decisão.**

Decisão sem motivo é arbitrária. Motivo permite avaliar se decisão ainda faz sentido depois.

---

## 🟡 Leis de Arquitetura — Baseadas na Stack e Tipo de Projeto

### LEI #11 — Dados Financeiros Nunca Saem do Device

> **Todos os dados sensíveis do usuário (valores, datas, categorias) ficam exclusivamente em SQLite local. NUNCA são enviados pra nuvem no MVP.**

**Por que existe:** Privacidade é diferencial competitivo. Em 2023, a Capital One perdeu dados de 100 milhões de clientes em nuvem. Léo constrói confiança dizendo "seus dados nunca saem do seu celular".

**Como verificar:**
- Grep por `fetch(`, `axios`, `fetch(` em `app/` — se aparecer URLs externas, bloqueado
- Toda API call é local (Storage Adapter, SQLite)
- Nenhum terceiro (analytics, Sentry, etc) recebe dados financeiros

**Mitigação:** v2.0+ pode adicionar sync cloud — mas com OPT-IN, LGPD compliance, criptografia end-to-end

---

### LEI #12 — Offline-First é Inegociável

> **A aplicação funciona 100% sem internet. Sincronização e atualizações do servidor são enhancement opcionais em v2+, não requisito no MVP.**

**Por que existe:** Léo está na rua (reunião, cliente), usa metrô, tem WiFi ruim. App que só funciona online não é confiável para uso diário.

**Como verificar:**
- Desconectar do WiFi/4G
- Abrir app
- Todas as telas carregam em <2s
- Adicionar/editar/remover conta funciona
- Dashboard atualiza
- Desconectar é transparente (sem avisos vermelhos ou spinners infinitos)

**Mitigação:** Se há funcionalidade que PRECISA de internet (v2+), avisar usuário antecipadamente

---

### LEI #13 — Validação Rigorosa de Dados Financeiros

> **Nenhum valor monetário ou parcela é criado sem validação. Cálculos de parcelamento são testados com 3 cenários: valor exato, centavos, e distribuição de resto.**

**Por que existe:** Usuário tem 6 parcelas erradas = confiança destruída. Muito mais fácil prevenir que consertar depois.

**Como verificar:**
- Função `calcularParcelas(valor, qtd)` tem testes unitários
- Teste 1: 1200 ÷ 3 = 400 cada (exato)
- Teste 2: 1500 ÷ 7 = 214.29 × 6 + 214.23 (resto na última) 
- Teste 3: Valores com muitos decimais

**Mitigação:** Nenhuma — é lei absoluta

---

### LEI #14 — Design Premium é Inegociável

> **Nenhuma versão é lançada com visual genérico, poluído ou "bom o suficiente". Dark mode é padrão. Amber (#F59E0B) é acento principal. Animations suavizam interações.**

**Por que existe:** Design é diferencial competitivo. Apps genéricos não inspiram confiança com dados sensíveis. Primeira impressão em 5 segundos define se usuário fica.

**Como verificar:**
- Teste dos "5 segundos": abra o app (sem ler documentação), conforme entende o que é?
- Dark mode está sempre ativo por padrão
- Botões primários são amber (não cinza ou azul)
- Transições entre telas são suaves (não teleportam)
- Densidade visual é 60/40 (60% espaço branco, 40% conteúdo)

**Mitigação:** Feedback de design com usuário real (Léo ou amigo) toda semana

---

### LEI #15 — Sem Scope Creep no MVP

> **MVP é fechado. Nenhuma feature além das 9 core (Dashboard, CRUD contas, Parcelamento, Recorrências, Categorias, Filtros, Analytics básica, Configurações, Persistência) é adicionada antes de v1.0 estar em produção.**

**Por que existe:** Scope creep destrói projetos. "Só mais uma feature" vira 3 semanas extras. Léo para de trabalhar no design premium e passa a fazer features. Original vision morre.

**Como verificar:**
- Todo PR tem uma feature core? ✅ Merge
- Todo PR tem feature v2+? ❌ Backlog → Issue → Salvar para depois

**Features proibidas no MVP:**
- ❌ Autenticação / login
- ❌ Sync com nuvem
- ❌ Compartilhamento
- ❌ Integração com banco
- ❌ Notificações push
- ❌ Exportação (v1.5+)

---

### LEI #16 — SQLite Schema é Versionado

> **Toda mudança no schema do SQLite tem migration com número sequencial (001_, 002_, etc) e ambos: upgrade e downgrade testados.**

**Por que existe:** Se schema muda e usuário está com versão antiga do app, dados se perdem ou app trava. Migrations permitem evolução segura.

**Como verificar:**
- Pasta `migrations/` com arquivos: `001_create_tables.sql`, `002_add_status_column.sql`
- Todo arquivo tem comentário: `-- Upgrade: ...` e `-- Downgrade: ...`
- Testes executam migrate up, depois down

**Mitigação:** Comece com schema bem definido no sprint 1. Poucas mudanças depois

---

### LEI #17 — Performance é Medida, Não Achismo

> **Nenhuma otimização ocorre sem medição. Nenhum problema de performance é resolvido sem confirmar que realmente é problem.**

**Por que existe:** Trabalho de otimização sem métrica é desperdiçado. "Deixar mais rápido" sem saber o baseline é como dirigir no escuro.

**Como verificar:**
- Lighthouse score no mobile: mínimo 85+ (Performance)
- Dashboard carrega em <1s (medido em device real, não simulador)
- Lista de 100 contas scrolleia sem lag (60fps, não 20fps)
- SQLite query para saldo total: <50ms

**Mitigação:** Chrome DevTools built-in. Lighthouse CI no deploy

---

### LEI #18 — Animações Respeitam Preferências de Acessibilidade

> **Nenhuma animação viola `prefers-reduced-motion`. Usuários com sensibilidade a movimento têm experiência static completa.**

**Por que existe:** Algumas pessoas têm enxaqueca ou vertigem com animações em excesso. Acessibilidade é lei (WCAG 2.1 AA).

**Como verificar:**
- Em DevTools: Settings → Rendering → Emulate CSS Media Feature prefers-reduced-motion: reduce
- Todas as animações desaparecem ou ficam instantâneas
- App continua 100% funcional

---

## 🔵 Leis de Processo — Baseadas no Perfil de Léo

### LEI #19 — Sessões são Blocos Concentrados

> **Cada sessão Claude Code é focada em UMA coisa: ou Planning ou Implementation, nunca misturado. Quando planejar, planejar. Quando implementar, implementar.**

**Por que existe:** Cérebro (humano ou IA) perde eficiência alternando contextos. Planejamento precisa expansão (ideias soltas). Implementação precisa foco (detalhes).

**Como verificar:**
- Sessão de Planning: /forge-architect, /forge-prd, /forge-spec ✅
- Sessão de Implementation: /forge-execute, VS Code, git commit ✅
- NUNCA misturar: "Me cria o componente E também atualiza o PRD"

**Mitigação:** Léo escolhe qual modo no início da sessão

---

### LEI #20 — Feedback de Usuário Real Toda Semana

> **Toda sexta ou fim de sprint, Léo testa a versão e registra feedback. Nenhuma feature avança sem validação com o problema real.**

**Por que existe:** Léo é usuario real. Feedback dele é 100x mais valioso que achismo. Sem feedback regular, projeto desvia da realidade.

**Como verificar:**
- Arquivo `feedback/` com registro de cada semana
- Formato: `feedback_week_1.md`, `feedback_week_2.md`
- Cada feedback tem: data, funcionalidade testada, problema encontrado, sugestão

**Mitigação:** Simples, não requer relatório formal. 5 linhas é suficiente

---

### LEI #21 — Código é Sempre Inglês, Documentação é Sempre Português

> **Nomes de variáveis, funções, classes: inglês. README, PRD, comments: português brasileiro. Sem misturar.**

**Por que existe:** Léo é desenvolvedor iniciante em português. Comentários em português ajudam. Mas código em inglês é padrão da indústria (bibliotecas, comunidade, Stack Overflow).

**Como verificar:**
- `const saldoTotal = ...` ❌ (português)
- `const totalBalance = ...` ✅ (inglês)
- `// Calcula saúde financeira` ✅ (português)
- `// Calculates financial health` ❌ (inglês)

---

### LEI #22 — Babel Cresce com Projeto

> **Todo termo técnico desconhecido é automaticamente adicionado ao Babel com definição didática. Ao final de cada sprint, revisar e consolidar.**

**Por que existe:** Léo está aprendendo. Babel é glossário pessoal dele. Sem ele, fica repetindo "o que é X?" toda sessão.

**Como verificar:**
- `forge-data.json` → `babel[]` cresce com cada sprint
- Cada termo tem: pronuncia, categoria, definição_simples (analogia), definição_tecnica
- Exemplo de analogia ruim: "Stream é como um tubo"
- Exemplo de analogia boa: "Stream é como água fluindo — continua vindo até terminar"

---

### LEI #23 — Documentação é Código

> **Documentação é tão importante quanto implementação. Um bug na documentação é tão crítico quanto bug no código. Revisar PRD/SPEC/PLAN com rigor de code review.**

**Por que existe:** Léo usa documentação para tomar decisões. Documentação errada ou desatualizada o leva pra caminho errado.

**Como verificar:**
- Toda mudança em `docs/` tem justificativa (LEI #10)
- PRD desatualizado bloqueia CONSTITUTION
- SPEC desatualizado bloqueia PLAN
- Se documentação não reflete código, atualize a documentação ANTES de atualizar código

---

## 🔥 Stress Test — As Leis Protegem Contra Desastres?

| Cenário | Protegido por | Status |
|---------|--------------|--------|
| **Backup antigo restaurado → dados perdem** | LEI #5 (versionamento), LEI #19 (feedback semanal) | ✅ Mitigado: feedback semanal detecta inconsistências |
| **SQLite schema quebrado em update** | LEI #16 (migrations versionadas com downgrade) | ✅ Coberto: migration rollback é testada |
| **Animações travão em device 2020** | LEI #18 (prefers-reduced-motion), LEI #17 (performance medida) | ✅ Coberto: fallback static automática |
| **Parcelamento criado com erro de cálculo** | LEI #13 (validação rigorosa + testes) | ✅ Coberto: 3 cenários de teste obrigatórios |
| **Scope creep adiciona 5 features não prioritárias** | LEI #15 (MVP fechado), LEI #2 (PRD define escopo) | ✅ Coberto: features extras bloqueadas |
| **Dados financeiros enviados pra terceiro** | LEI #11 (dados offline), LEI #7 (usuário aprova) | ✅ Coberto: grep automático, lei inviolável |
| **App só funciona online** | LEI #12 (offline-first), LEI #6 (transparência) | ✅ Coberto: testado toda semana (LEI #20) |
| **Design fica genérico no meio do projeto** | LEI #14 (design premium), LEI #23 (doc é código) | ✅ Coberto: feedback semanal valida visual |

---

## 📊 Resumo das Leis

- **🔴 Leis Fundamentais:** 10 (LEI #1 a #10) — invioláveis em todo projeto
- **🟡 Leis de Arquitetura:** 8 (LEI #11 a #18) — baseadas em stack React + SQLite + offline + dados sensíveis
- **🔵 Leis de Processo:** 5 (LEI #19 a #23) — baseadas no perfil de Léo (solo, iniciante, iterativo)

**Total: 23 leis blindando o projeto contra decisões impulsivas e erros previsíveis**

---

## 🎯 Como Usar Esta Constitution

1. **Antes de implementar** — Releia a lei relevante
2. **Sentiu vontade de quebrar** — Sempre há um motivo real (replanejar antes)
3. **Precisa mudar uma lei** — Execute `/forge-constitution` formalmente
4. **Dúvida sobre regra** — Lei tem "Por que existe" → leia para entender motivo

---

**Versão:** 1.0  
**Status:** ✅ Ativa  
**Próximo passo:** `/forge-spec` — especificação técnica detalhada dos componentes React

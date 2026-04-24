# Product Requirements Document (PRD) — Controle Financeiro v2
**Versão:** 4.0 | **Status:** Titan Synchronized

## 1. Business Summary
**Nome:** Controle Financeiro v2 (Titan Force Edition)
**Posicionamento:** Um ecossistema de gestão financeira pessoal de alta performance, migrado para a **Arquitetura Titan v4.0**. Uma Single Page Application (SPA) que combina a simplicidade de uso mobile-first com a potência analítica de um dashboard premium.
**Contexto de Reestruturação:** Este projeto está sendo sincronizado com a metodologia Agente Forge para garantir máxima auditabilidade, resiliência de memória e performance superior em Next.js 16.
**Objetivo do Usuário:** Controlar gastos, gerenciar parcelamentos e visualizar a saúde financeira em uma interface impecável ("Obsidian & Gold"), com processamento local e privacidade total.

## 2. Público-Alvo e Dores
- **Público:** Microempreendedores e usuários avançados que gerenciam múltiplas contas e buscam uma interface superior aos bancos tradicionais.
- **Dores:** 
  - Interfaces bancárias lentas e poluídas.
  - Dificuldade em visualizar o impacto de parcelas futuras no orçamento.
  - Medo de vazamento de dados (solução: SQLite local).

## 3. Core Features (MVP)
- **Dashboard Executivo:** Resumo de saldo, entradas e saídas com gráficos reativos (Recharts).
- **Gestão de Contas:** Cadastro de contas com status (Paga, Pendente, Atrasada).
- **Parcelamento Automático:** Lógica para dividir compras e provisionar o futuro.
- **Persistência Local (SQLite):** Dados armazenados via Prisma no cliente (WaSQLite ou similar).
- **Design Obsidian & Gold:** Interface dark mode de alto contraste com micro-animações.

## 4. O que NÃO É (Filtro Negativo)
- Não é um ERP empresarial complexo.
- Não é uma ferramenta multi-usuário (foco em uso pessoal/individual).
- Não é uma corretora de investimentos (foco em fluxo de caixa).

## 5. Critérios de Sucesso
- Performance: Tempo de carga inicial < 1.5s.
- UX: Cadastro de uma nova conta em menos de 3 cliques.
- Build: Zero erros críticos no pipeline do Netlify.

## 6. Roadmap Futuro (v2+)
- Sincronização em nuvem criptografada (opcional).
- Exportação de relatórios em PDF/Excel.
- Categorização automática via IA.

## 7. UX Principles
- **Aesthetics First:** Interface que gera prazer visual (Glow effects, animações suaves).
- **Context Awareness:** Exibir as informações mais urgentes logo no topo.
- **Mobile-First Thinking:** Botões e áreas de toque otimizadas para uso com uma mão (90% do uso).

## 8. LLM Stack e Entradas
- **Engine:** Gemini 1.5 Flash para processamento rápido de dados e logs do Agente Forge.
- **Contexto:** AI_CONTEXT.md + Working-Memory facilitando a manutenção futura.

## 9. 🛡️ Riscos Conhecidos do Bug-DNA e Prevenções
- **Risco 01 (Conflito de PeerDeps):** Mitigado via `.npmrc` com `legacy-peer-deps`.
- **Risco 02 (Next.js 16/Turbopack):** Resolvido com configuração explícita no `next.config.js`.
- **Risco 03 (Persistência no Browser):** Monitorar limites de quota do indexedDB/WASM.

---
*Assinado: Board de Diretores Forge*

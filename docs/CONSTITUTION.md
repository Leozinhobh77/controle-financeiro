# Constitution — Controle Financeiro v2

Este documento estabelece as leis fundamentais e inquebráveis que regem o desenvolvimento deste projeto.

## ⚖️ Leis do Projeto (Leis de Negócio)

1. **Lei da Privacidade:** Nanhum dado financeiro sensível deve ser enviado a servidores externos sem criptografia ponta-a-ponta e consentimento explícito. O padrão é armazenamento local.
2. **Lei do Design:** A interface deve seguir estritamente a estética "Obsidian & Gold". Minimalismo e luxo são prioritários.
3. **Lei da Integridade:** Números financeiros nunca devem ser arredondados de forma imprecisa. O uso de bibliotecas de precisão decimal é mandatório onde necessário.
4. **Lei da Responsividade:** O app deve ser perfeito no mobile (iPhone/Android via browser) antes de ser otimizado para desktop.

## 🛡️ Leis de Engenharia (Forge v4.0 Titan)

5. **Lei da Memória:** Nenhuma alteração significativa deve ser feita sem antes ler o `working-memory.json` e atualizar o `sprint-journal.json`.
6. **Lei da Documentação (SDD):** Funcionalidades novas requerem atualização imediata no `AI_CONTEXT.md` e na estrutura `docs/`.
7. **Lei da Auditoria (Sentinela):** O `/skill-sentinela` deve estar ativo em um segundo terminal durante qualquer fase de construção (`/skill-construtor`).
8. **Lei do Git Atômico:** Commits devem ser puramente funcionais e seguir o padrão de Conventional Commits.
9. **Lei da Resiliência:** Backups automatizados da memória do sistema devem ser gerados em `.skill-memory/backups/` após cada ciclo de skill.

---
*Assinado: Comitê de Governança Forge*

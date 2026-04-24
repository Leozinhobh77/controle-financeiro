# ⚡ SPEC — Blueprint Técnico (Titan Force Edition)
**Versão:** 4.0 | **Auditoria:** skill-documentador | **Status:** Aprovado para Construção

Este documento detalha a arquitetura técnica, interfaces de dados e padrões de engenharia que serão seguidos durante a fase de implementação.

---

## 🗄️ 1. Arquitetura de Dados (Prisma v6)

### 1.1 Modelagem Core (Sincronizada)
Os modelos abaixo representam a fundação do banco de dados SQLite.

| Modelo | Papel | Campos Chave |
| :--- | :--- | :--- |
| **Conta** | Registro de dívidas/receitas | `id`, `descricao`, `valor`, `dataVencimento`, `status` |
| **Categoria** | Classificação visual | `id`, `nome`, `cor`, `icone` |
| **KanbanCard** | Fluxo de tarefas financeiras | `id`, `coluna`, `titulo`, `prioridade` |
| **Config** | Preferências globais | `id`, `tema`, `nomeUsuario`, `saldoInicial` |

### 1.2 🌟 Melhoria Titan (Audit Trail)
> **Surpresa Técnica:** Inclusão de um modelo de **Transacao** para histórico imutável.

```prisma
model Transacao {
  id        String   @id @default(cuid())
  contaId   String?  // Opcional: link para a conta de origem
  tipo      String   // "entrada" | "saida"
  valor     Float
  data      DateTime @default(now())
  categoria String?
  metodo    String?  // "pix" | "cartao" | "dinheiro"
}
```
*Raciocínio:* Enquanto `Conta` guarda a intenção (ex: conta de luz), `Transacao` guarda o fato ocorrido (ex: pagamento em 13/04).

---

## 📡 2. API Blueprint (Next.js 16 Server Actions)

Para máxima performance e segurança, utilizaremos **Server Actions** com **Zod Validation**.

### 2.1 Schemas de Validação (Zod)
```typescript
const ContaSchema = z.object({
  descricao: z.string().min(3),
  valor: z.number().positive(),
  dataVencimento: z.string().optional(),
  categoria: z.string().default('outros'),
});
```

### 2.2 Endpoints Planejados (Sprint 2)
- `POST /api/contas`: Criação com lógica de parcelamento resiliente.
- `GET /api/dashboard`: Agregação de dados para o novo Dashboard Obsidian & Gold.

---

## 🎨 3. UI Tokens (Obsidian & Gold - Titan Theme)

| Token | Valor Hex | Uso |
| :--- | :--- | :--- |
| **Background (Titan)** | `#0F0F0F` | Fundo principal (Deep Dark) |
| **Surface** | `#1A1A1A` | Cards e modais |
| **Accent (Gold)** | `#F59E0B` | Botões primários e estados ativos |
| **Glow** | `0 0 20px rgba(245, 158, 11, 0.2)` | Efeito neon premium |

---

## 🛡️ 4. Histórico Sentinela Múltipla (Checkpoint)

*Esta seção será preenchida pela Sentinela durante a `/skill-construtor`.*

| Task | Sensor | Score | Status |
| :--- | :--- | :--- | :--- |
| - | - | - | - |

---

## ⚖️ 5. Sanity Check Final

[✓] Alinhamento PRD: Sim.
[✓] Alinhamento PLAN: Sim.
[✓] Alinhamento CONSTITUTION: Sim.
[✓] Foundation Sentinela: `.skill-memory/` OK.

**Health Score:** 65/100
**Ação:** Liberar para a `/skill-construtor`.

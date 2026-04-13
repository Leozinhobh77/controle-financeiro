# ◉ SPEC — Technical Specification

**Projeto:** Controle de Contas v2  
**Versão:** 1.0  
**Data:** 2026-04-09  
**Status:** ✅ Aprovado  
**Baseada em:** PRD v1.0 + Constitution v1.0  
**Gerada por:** FORGE + Haiku 4.5  

---

## O que é a SPEC?

> A **SPEC é a única fonte da verdade técnica**. Se existe conflito entre o código e a SPEC, o código está errado.
>
> A SPEC é como a planta de engenharia de um prédio. O PRD diz "queremos um prédio de 10 andares". A SPEC diz qual tijolo vai onde, qual cano conecta no quê e quanto ferro vai em cada coluna.

**Qualquer dúvida durante a implementação?** Releia esta SPEC. Se não encontrar resposta, é sinal de que falta detalhe aqui (não no código).

---

## 🏗️ Visão Arquitetural

### Stack Técnica

| Camada | Tecnologia | Versão | Por quê |
|--------|-----------|--------|---------|
| **Frontend Framework** | Next.js | 16 | SSR/SSG, API routes, deploy fácil no Vercel |
| **React Runtime** | React | 19 | Latest, melhor performance e hooks |
| **Linguagem** | TypeScript | 5.3+ | Type safety, menos bugs, melhor DX |
| **Styling** | Tailwind CSS | v4 | Utility-first, customização fácil, design system |
| **Componentes** | shadcn/ui | latest | Acessível (Radix UI), não vendor-locked |
| **Animações** | Framer Motion | 11+ | Transições spring suaves, performance GPU |
| **Gráficos** | Recharts | 2.10+ | React-native, leve, real-time ready |
| **Estado Global** | Zustand | 4.4+ | Minimalista, sem boilerplate |
| **Cache/Sync** | TanStack Query | 5.28+ | Cache automático, background sync, offline |
| **Banco Local** | sql.js (WaSQLite) | 1.8+ | SQLite no browser, 100% offline, sem backend |
| **Validação** | Zod | 3.22+ | Type-safe validation, mensagens customizadas |
| **Testing** | Vitest | latest | Mais rápido que Jest, ESM nativo |
| **Testing UI** | @testing-library/react | 14+ | Padrão de mercado, testa como usuário |
| **Deploy** | Vercel | — | Next.js nativo, serverless, edge functions |

### Arquitetura de Camadas

```
┌─────────────────────────────────────────┐
│         React Components (UI)           │  ← shadcn/ui + Framer Motion
├─────────────────────────────────────────┤
│  Zustand Store (UI State)               │  ← filtros, modais, temas
├─────────────────────────────────────────┤
│  TanStack Query (Data + Cache)          │  ← dados + cache automático
├─────────────────────────────────────────┤
│  Custom Hooks (useFetchContas, etc)     │  ← lógica de negócio
├─────────────────────────────────────────┤
│  Storage Adapter (sql.js wrapper)       │  ← SQLite abstrato
├─────────────────────────────────────────┤
│  sql.js (SQLite em WebAssembly)         │  ← banco de dados local
└─────────────────────────────────────────┘
```

### Separação de Responsabilidades

| Camada | O que faz | NÃO faz |
|--------|-----------|---------|
| **React Components** | Render UI, captura intenções do usuário | Lógica de negócio, chamadas ao banco |
| **Zustand Store** | Gerencia estado de UI (filtros, modais) | Gerencia dados de negócio, persistência |
| **TanStack Query** | Cache + sincronização automática de dados | Transformação de dados, validação |
| **Custom Hooks** | Lógica de negócio reutilizável | Render direto, side effects sem controle |
| **Storage Adapter** | Abstrai implementação do SQLite | Lógica de negócio, regras de validação |
| **sql.js** | Executa queries SQL | Lógica aplicação, UI |

---

## 🖥️ Interface — Telas e Navegação

### Rotas e Telas

| Rota | Componente | Descrição | Funcionalidades |
|------|-----------|-----------|-----------------|
| `/` | `page.tsx` → `<Dashboard>` | Dashboard principal | Saldo total, KPIs, gráficos, próximas contas |
| `/contas` | `contas/page.tsx` → `<ListaContas>` | Lista de contas | Filtros por status/categoria, busca, CRUD |
| `/contas/nova` | `contas/nova/page.tsx` → `<FormConta>` | Adicionar conta | Form com validação, parcelamento/recorrência |
| `/contas/[id]` | `contas/[id]/page.tsx` → `<DetalhesConta>` | Detalhes da conta | Ver/editar/remover, histórico |
| `/configuracoes` | `configuracoes/page.tsx` → `<Configuracoes>` | Configurações | Tema, moeda, saldo inicial, nome do usuário |
| `/(modal)/contas/nova` | Interceptor route | Modal adicionar | Sobrepõe em cima de qualquer tela |
| `/(modal)/contas/[id]` | Interceptor route | Modal editar | Sobrepõe em cima de qualquer tela |

### Fluxo de Navegação

```
┌─ Dashboard ─────────┐
│                     ├─→ Clica "Próximas" ──→ Lista Contas (filtro: vencimento)
│                     ├─→ Clica "+ Adicionar" → Modal Adicionar Conta
│                     └─→ Clica "Config" ────→ Configurações
│
├─ Lista Contas
│  ├─→ Seleciona aba ──→ Filtra (Todas/Pendentes/Atrasadas/Pagas)
│  ├─→ Busca por nome
│  ├─→ Clica conta ───→ Modal Detalhes / Editar
│  ├─→ Swipe direita ─→ Marca como pago (com confirm)
│  └─→ "+ Adicionar" ─→ Modal Adicionar Conta
│
└─ Configurações
   ├─→ Alterna tema (dark/light)
   ├─→ Define saldo inicial
   ├─→ Define moeda (BRL padrão)
   └─→ Define nome do usuário
```

### Breakpoints e Responsividade

| Breakpoint | Resolução | Comportamento |
|-----------|-----------|---------------|
| **Mobile** | < 640px | 1 coluna, full-width, touch-friendly buttons |
| **Tablet** | 640-1024px | 2 colunas, modal centers, sidebar colapsável |
| **Desktop** | > 1024px | 3+ colunas, sidebar permanente, modal com padding |

**Teste de responsividade obrigatória:** Dashboard deve ser usável em 320px (iPhone SE).

---

## 🗃️ Banco de Dados — SQLite Schema

### Tabela: `contas`

Armazena todas as contas a pagar/pagas.

| Campo | Tipo | Null | PK/FK | Descrição | Exemplo |
|-------|------|------|-------|-----------|---------|
| `id` | TEXT | ✗ | PK | UUID gerado no client | "1712694027123abc" |
| `descricao` | TEXT | ✗ | — | Nome da conta | "Aluguel" |
| `valor` | REAL | ✗ | — | Valor em reais | 1200.50 |
| `dataVencimento` | TEXT | ✗ | — | ISO 8601 (YYYY-MM-DD) | "2026-04-10" |
| `dataPagamento` | TEXT | ✓ | — | Quando foi pago (null = não pago) | "2026-04-09" |
| `status` | TEXT | ✗ | — | "pendente" / "atrasado" / "pago" | "pendente" |
| `categoria` | TEXT | ✗ | FK → categorias.id | Categoria da conta | "moradia" |
| `observacoes` | TEXT | ✓ | — | Notas livres | "Vence todo dia 10" |
| `recorrente` | BOOLEAN | ✗ | — | É conta recorrente? | true |
| `intervaloRecorrencia` | TEXT | ✓ | — | "semanal" / "mensal" / "anual" | "mensal" |
| `recorrenciaAtiva` | BOOLEAN | ✗ | — | Continua gerando próximas? | true |
| `parcelado` | BOOLEAN | ✗ | — | É parte de parcelamento? | false |
| `totalParcelas` | INTEGER | ✓ | — | Se parcelado: quantas partes? | 6 |
| `parcelaAtual` | INTEGER | ✓ | — | Se parcelado: qual número? | 3 |
| `grupoParcelamento` | TEXT | ✓ | — | Agrupa parcelas do mesmo parcelamento | "uuid-grupo" |
| `criadoEm` | TEXT | ✗ | — | Timestamp criação (ISO 8601) | "2026-04-08T15:30:00Z" |
| `atualizadoEm` | TEXT | ✗ | — | Timestamp última edição | "2026-04-09T10:15:00Z" |

**Índices:**
- `CREATE INDEX idx_contas_status ON contas(status)` — filtros frequentes por status
- `CREATE INDEX idx_contas_dataVencimento ON contas(dataVencimento)` — ordenar por vencimento
- `CREATE INDEX idx_contas_grupoParcelamento ON contas(grupoParcelamento)` — agrupar parcelas
- `CREATE INDEX idx_contas_categoria ON contas(categoria)` — filtrar por categoria

**Relacionamentos:**
- `contas.categoria` → `categorias.id` (foreign key)

### Tabela: `categorias`

Categorias customizáveis para agrupar contas.

| Campo | Tipo | Null | Descrição | Exemplo |
|-------|------|------|-----------|---------|
| `id` | TEXT | ✗ | ID único (padrão: "moradia", "alimentacao", etc) | "moradia" |
| `nome` | TEXT | ✗ | Nome exibido ao usuário | "Moradia" |
| `cor` | TEXT | ✗ | Hex color para badge/gráfico | "#6366F1" |
| `icone` | TEXT | ✗ | Emoji para ícone | "🏠" |
| `criadoEm` | TEXT | ✗ | Timestamp ISO 8601 | "2026-04-09T00:00:00Z" |

**Dados iniciais (seed):**
```sql
INSERT INTO categorias (id, nome, cor, icone, criadoEm) VALUES
('moradia', 'Moradia', '#6366F1', '🏠', '2026-04-09T00:00:00Z'),
('alimentacao', 'Alimentação', '#EF4444', '🍔', '2026-04-09T00:00:00Z'),
('transporte', 'Transporte', '#F59E0B', '🚗', '2026-04-09T00:00:00Z'),
('saude', 'Saúde', '#10B981', '💊', '2026-04-09T00:00:00Z'),
('educacao', 'Educação', '#3B82F6', '📚', '2026-04-09T00:00:00Z'),
('lazer', 'Lazer', '#EC4899', '🎮', '2026-04-09T00:00:00Z'),
('trabalho', 'Trabalho', '#8B5CF6', '💼', '2026-04-09T00:00:00Z'),
('assinaturas', 'Assinaturas', '#06B6D4', '📱', '2026-04-09T00:00:00Z'),
('outros', 'Outros', '#6B7280', '📦', '2026-04-09T00:00:00Z');
```

### Tabela: `config`

Configurações globais do usuário (singleton).

| Campo | Tipo | Null | Descrição | Exemplo |
|-------|------|------|-----------|---------|
| `chave` | TEXT | ✗ | PK: chave de configuração | "tema" |
| `valor` | TEXT | ✗ | Valor armazenado | "dark" |
| `tipo` | TEXT | ✗ | Tipo: "string" / "number" / "boolean" | "string" |
| `atualizadoEm` | TEXT | ✗ | Timestamp ISO 8601 | "2026-04-09T10:00:00Z" |

**Chaves pré-configuradas:**
```sql
INSERT INTO config (chave, valor, tipo, atualizadoEm) VALUES
('tema', 'dark', 'string', '2026-04-09T00:00:00Z'),
('moeda', 'BRL', 'string', '2026-04-09T00:00:00Z'),
('nomeUsuario', 'Usuário', 'string', '2026-04-09T00:00:00Z'),
('saldoInicial', '0', 'number', '2026-04-09T00:00:00Z');
```

---

## 🧩 Componentes React

### Estrutura de Componentes por Feature

#### Dashboard Feature (`app/components/features/Dashboard/`)

**`Dashboard.tsx`** — Container principal
```typescript
Props:
  - contas: Conta[] (do TanStack Query)
  - isLoading: boolean
  - erro?: Error

Renderiza:
  - <SaldoCard /> — saldo total em destaque
  - <KPICards /> — pendente/atrasado/pago
  - <GraficoSemana /> — área chart últimos 6 meses
  - <ProximasContas /> — próximas 5 a vencer
  - <ContasAtrasadas /> — alertas visuais em vermelho
  - <FloatingActionButton /> — botão "+ Adicionar"
```

**`SaldoCard.tsx`** — Exibe saldo total com glow effect
```typescript
Props:
  - saldoTotal: number
  - animarEntrada?: boolean (default: true)

Animações:
  - Fade in + scale on mount (Framer Motion)
  - Glow effect amber background
```

**`KPICards.tsx`** — Grid de 3 cards (Pendente/Atrasado/Pago)
```typescript
Props:
  - pendente: number
  - atrasado: number
  - pago: number

Responsive:
  - Mobile: 1 coluna, stacked
  - Tablet+: 3 colunas
```

**`GraficoSemana.tsx`** — Recharts AreaChart
```typescript
Props:
  - dados: { label, value, value2 }[] (últimos 6 meses)

Recharts Config:
  - X-axis: nomes dos meses
  - Y-axis: valores em reais
  - Duas áreas: "Pago" (verde) + "Pendente" (amber)
  - Tooltip com formatação BRL
```

#### Contas Feature (`app/components/features/Contas/`)

**`ListaContas.tsx`** — Container lista com filtros
```typescript
Props:
  - contas: Conta[] (do TanStack Query)
  - filtrosAtivos: { status, categoria, busca }

Sub-componentes:
  - <AbastFiltragem /> — tabs: Todas/Pendentes/Atrasadas/Pagas
  - <InputBusca /> — search por descrição
  - <GridContas /> — lista de ContaRow
```

**`ContaRow.tsx`** — Uma linha na lista
```typescript
Props:
  - conta: Conta
  - onEditar: (id) => void
  - onRemover: (id) => void
  - onMarcarPago: (id) => void

Interações:
  - Tap para expandir/colapsar detalhes
  - Swipe right para marcar como pago (confirm dialog)
  - Long press para menu (editar/remover)
  - Ícone de categoria com cor customizada
```

**`FormConta.tsx`** — Adicionar/editar conta (modal ou página)
```typescript
Props:
  - conta?: Conta (se editar)
  - onSalvar: (conta) => void
  - onCancelar: () => void

Campos:
  - Descrição (text input)
  - Valor (number input com formatação BRL)
  - Data de vencimento (date picker)
  - Categoria (select com opciones)
  - Observações (textarea)
  - Toggle: Parcelado? (mostra campo N parcelas)
  - Toggle: Recorrente? (mostra select: semanal/mensal/anual)

Validações (Zod):
  - Descrição: 3-50 caracteres
  - Valor: > 0 e <= 1.000.000
  - Data: não pode ser no passado (opcional: no passado se editando)
  - Se parcelado: 2-12 parcelas

Cálculo automático:
  - Se parcelado: mostra valor por parcela (com centavos na última)
```

### Componentes de UI (`app/components/ui/`)

Todos importados de `shadcn/ui` + customizações:

- `<Button />` — shadcn, color: amber primary
- `<Input />` — text input com ícone opcionais
- `<Select />` — dropdown
- `<Dialog />` — modal
- `<Card />` — container card
- `<Badge />` — status indicator (verde/amber/vermelho)
- `<Tabs />` — abas de filtro
- `<Spinner />` — loading indicator

### Componentes Shared (`app/components/shared/`)

**`Header.tsx`** — Cabeçalho com título e ações
```typescript
Props:
  - title: string
  - actions?: ReactNode[] (botões, toggles)
  - breadcrumb?: { label, href }[]
```

**`Layout.tsx`** — Wrapper com sidebar e main
```typescript
Props:
  - children: ReactNode
  - sidebar?: boolean (default: true)

Layout:
  - Sidebar com nav links (Dashboard, Contas, Configurações)
  - Main content area
  - Footer com info
```

**`LoadingState.tsx`** — Esqueleto/spinner
```typescript
Props:
  - isLoading: boolean
  - children: ReactNode
  - fallback?: ReactNode
```

**`ErrorBoundary.tsx`** — Tratamento de erros
```typescript
Props:
  - children: ReactNode
  - onError?: (error) => void

Mostra:
  - Mensagem de erro legível
  - Botão "Tentar novamente"
  - Log no console (dev only)
```

---

## 🪝 Hooks Customizados

### `useContas()` — Fetch + Cache + Sync

```typescript
const { contas, isLoading, erro, refetch } = useContas();

// Internamente:
// 1. Usa TanStack Query para fetch do Storage
// 2. Cache automático com staleTime = 5 min
// 3. Sincronização background ao refocus
// 4. Retry automático em erro (3x com backoff)
```

### `useFetchContas(filtros)` — Fetch com filtros

```typescript
const { contas, isLoading } = useFetchContas({
  status: 'pendente',
  categoria: 'moradia',
  busca: 'aluguel'
});

// Internamente:
// 1. useContas() base
// 2. Filter em memória (não no SQL — dados pequenos)
// 3. Sort por dataVencimento
```

### `useAdicionarConta()` — Mutation

```typescript
const { mutate: adicionar, isPending } = useAdicionarConta();

adicionar({
  descricao: 'Aluguel',
  valor: 1200,
  dataVencimento: '2026-04-10',
  categoria: 'moradia'
});

// Internamente:
// 1. Validação com Zod
// 2. Gera ID local
// 3. Otimistic update no Zustand
// 4. Sync com Storage.adicionarConta()
// 5. Invalidate cache (refetch)
```

### `useValidarConta(dados)` — Validação em tempo real

```typescript
const { erro, isValido } = useValidarConta(formData);

// Retorna erros por campo:
// { descricao: 'Mínimo 3 caracteres', valor: null }
```

### `useCategoriasStore()` — UI State (Zustand)

```typescript
const { categorias, selecionada, setSelecionada } = useCategoriasStore();

// Armazena:
// - Lista de categorias
// - Qual está selecionada no filtro
// - Adicionar/remover categoria customizada
```

### `useThemeStore()` — Tema (Zustand)

```typescript
const { tema, alterarTema } = useThemeStore();

// Armazena:
// - tema: 'dark' / 'light'
// - Persiste em localStorage + DOM <html data-theme>
```

### `useLocalStorage(key, inicial)` — Persistência

```typescript
const [valor, setValor] = useLocalStorage('meuDado', initial);

// Sincroniza com localStorage automaticamente
```

---

## 🔌 Storage Adapter — Abstração do SQLite

Interface que encapsula sql.js para ser agnóstico:

```typescript
interface StorageAdapter {
  // Contas
  getContas(): Promise<Conta[]>;
  adicionarConta(conta): Promise<Conta>;
  atualizarConta(id, dados): Promise<Conta>;
  removerConta(id): Promise<boolean>;
  
  // Categorias
  getCategorias(): Promise<Categoria[]>;
  adicionarCategoria(cat): Promise<Categoria>;
  
  // Config
  getConfig(chave): Promise<string>;
  setConfig(chave, valor): Promise<void>;
  
  // Inicializar
  init(): Promise<void>;
}
```

**Implementação atual:** `sql.js/WaSQLite`  
**Migração futura (v2.0):** Tauri + SQLite nativo (sem mudança na interface)

---

## ⚙️ Fluxo de Dados Completo

### Exemplo: Adicionar uma nova conta

```
1. Usuário clica "+ Adicionar Conta"
   └─→ App abre Modal <FormConta>

2. Usuário preenche formulário
   └─→ FormConta chama onChange handlers
   └─→ Zustand store atualiza formDados
   └─→ useValidarConta() valida em tempo real
   └─→ UI exibe erros instantaneamente

3. Usuário clica "Salvar"
   └─→ FormConta chama useAdicionarConta().mutate()

4. useAdicionarConta() inicia:
   4.1 Valida com Zod → erro? para aqui
   4.2 Gera ID local: "1712694027123abc"
   4.3 OTIMISTIC UPDATE: Zustand adiciona na lista
   4.4 Renderiza Dashboard COM a conta nova
   4.5 Storage.adicionarConta() insere no SQLite em background
   4.6 SQLite confirma → TanStack Query invalida cache
   4.7 useContas().refetch() retorna dados do banco
   4.8 Dashboard atualiza com dados confirmados
   4.9 Form fecha com sucesso toast

5. Se erro no SQLite (improvável):
   5.1 TanStack Query detecta erro
   5.2 Rollback otimistic: remove da UI
   5.3 Toast de erro ao usuário
   5.4 Retry automático em background

Result: Dashboard sempre sincronizado com SQLite, sem lag.
```

---

## 🎨 Design System — Tailwind + shadcn

### Paleta de Cores

**Dark Mode (padrão):**
```css
--background: #0F0F0F (charcoal escuro)
--surface: #1A1A1A (cards/modals)
--text-primary: #FFFFFF
--text-secondary: #A0A0A0
--accent: #F59E0B (amber — botões, highlights)
--status-pago: #10B981 (verde)
--status-pendente: #F59E0B (amber — alerta)
--status-atrasado: #EF4444 (vermelho — crítico)
--border: #333333
```

**Light Mode (futuro):**
```css
--background: #FFFFFF
--surface: #F5F5F5
--text-primary: #1F1F1F
--text-secondary: #666666
--accent: #F97316 (laranja mais saturado)
```

### Tipografia

```css
/* Headers (Georgia serif — elegância) */
h1 { font-family: Georgia, serif; font-size: 2.5rem; font-weight: 700; }
h2 { font-family: Georgia, serif; font-size: 1.875rem; font-weight: 600; }
h3 { font-family: Georgia, serif; font-size: 1.5rem; font-weight: 600; }

/* Body (Segoe UI sans-serif — leitura) */
body { font-family: 'Segoe UI', Roboto, sans-serif; font-size: 1rem; line-height: 1.5; }
small { font-size: 0.875rem; }

/* Monospace (JetBrains Mono — valores) */
.valor { font-family: 'JetBrains Mono', monospace; font-size: 1.125rem; font-weight: 600; }
.data { font-family: 'JetBrains Mono', monospace; font-size: 0.875rem; }
```

### Espaçamento e Layout

```css
/* Grid 4px base (Tailwind padrão) */
Spacing: 4px, 8px, 12px, 16px, 20px, 24px, 28px, 32px, ...
Padding cards: 1.5rem (24px)
Gap entre cards: 1rem (16px)
Border radius: 0.5rem cards (8px), 0.75rem buttons (12px)
```

### Componentes Comuns

```tsx
/* Button Primary (amber) */
<Button className="bg-amber-500 hover:bg-amber-600 text-black">
  Ação
</Button>

/* Button Secondary (cinza) */
<Button variant="ghost" className="text-gray-300">
  Cancelar
</Button>

/* Card */
<Card className="bg-[#1A1A1A] border border-[#333333] rounded-lg">
  {children}
</Card>

/* Badge Status */
<Badge className={cn(
  "px-2 py-1 rounded text-xs font-medium",
  status === 'pago' && 'bg-green-900 text-green-200',
  status === 'pendente' && 'bg-amber-900 text-amber-200',
  status === 'atrasado' && 'bg-red-900 text-red-200'
)}>
  {status}
</Badge>
```

---

## 🔒 Validações e Regras de Negócio

### Validações de Input (Zod Schema)

```typescript
const schemaConta = z.object({
  descricao: z.string().min(3).max(50),
  valor: z.number().positive().max(1_000_000),
  dataVencimento: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  categoria: z.string().default('outros'),
  observacoes: z.string().optional(),
  parcelado: z.boolean().default(false),
  totalParcelas: z.number().min(2).max(12).optional(),
  recorrente: z.boolean().default(false),
  intervaloRecorrencia: z.enum(['semanal', 'mensal', 'anual']).optional(),
});
```

### Regra #1: Parcelamento (LEI #13)

**Validação:** Valor / Parcelas = valor por parcela
**Cálculo:** Últimas parcelas recebem o resto
```typescript
function calcularParcelas(valor: number, qtd: number) {
  const valorParcela = Math.floor(valor * 100 / qtd) / 100; // centavos
  const valorUltima = valor - (valorParcela * (qtd - 1));
  return Array(qtd).fill(valorParcela).map((v, i) => 
    i === qtd - 1 ? valorUltima : v
  );
}

// Teste:
// calcularParcelas(1500, 7) = [214.29, 214.29, ..., 214.23]
```

### Regra #2: Status Automático (LEI #12)

```typescript
function atualizarStatusAutomatico(conta: Conta) {
  const hoje = new Date().toISOString().split('T')[0];
  
  if (conta.status === 'pago') return 'pago'; // imutável
  if (conta.dataVencimento < hoje) return 'atrasado';
  return 'pendente';
}

// Executado toda vez que abre o dashboard
// Sincroniza status com data (offline não quebra)
```

### Regra #3: Recorrências (PRD)

```typescript
function gerarProximaOcorrencia(conta: Conta) {
  if (!conta.recorrente || !conta.recorrenciaAtiva) return null;
  
  const d = new Date(conta.dataVencimento + 'T00:00:00');
  
  switch (conta.intervaloRecorrencia) {
    case 'semanal': d.setDate(d.getDate() + 7); break;
    case 'mensal': d.setMonth(d.getMonth() + 1); break;
    case 'anual': d.setFullYear(d.getFullYear() + 1); break;
  }
  
  return {
    ...conta,
    id: undefined, // novo ID ao salvar
    status: 'pendente',
    dataPagamento: null,
    dataVencimento: d.toISOString().split('T')[0]
  };
}
```

---

## ⚡ Performance e Otimizações

### Metas (LEI #17)

| Métrica | Alvo | Ferramenta de Medição |
|---------|------|----------------------|
| Dashboard load time | < 1s | Lighthouse / DevTools |
| List scroll FPS | 60 fps | DevTools Performance |
| Bundle size | < 200KB (gzipped) | next/bundle-analyzer |
| Lighthouse score | 85+ | Lighthouse CI |

### Estratégias

1. **Code Splitting:** Next.js App Router faz automaticamente
2. **Image Optimization:** `next/image` para futuras imagens
3. **Caching:** TanStack Query staleTime = 5 min, cache local
4. **Virtualization:** Para lista com 100+ contas (v1.5+)
5. **Lazy Loading:** Componentes modais carregam on-demand

---

## 🔐 Segurança (LEI #11, #12, #18)

### Checklist de Segurança

| Item | Implementação | Status |
|------|--------------|--------|
| **Entrada validada** | Zod schema em todo form | ✅ MVP |
| **Dados sensíveis offline** | SQLite local, zero nuvem | ✅ LEI #11 |
| **XSS Prevention** | React render, zero innerHTML | ✅ React padrão |
| **CSRF** | N/A (sem servidor no MVP) | ✅ N/A |
| **Acessibilidade** | prefers-reduced-motion, ARIA | ✅ Implementar com Framer |
| **HTTPS** | Vercel enforce | ✅ Deploy |

### Dados Sensíveis

**O que NÃO fazer:**
- ❌ Enviar valores monetários pra servidor (mesmo Sentry)
- ❌ Logar dados financeiros no console (prod)
- ❌ Armazenar em cookies (não há auth, mas por paranoia)

**O que fazer:**
- ✅ Armazenar APENAS em SQLite local
- ✅ Nunca transmitir em localStorage mesmo
- ✅ Validação rigorosa na entrada (Zod)
- ✅ Logs apenas em dev, nunca em prod

---

## 🧪 Estratégia de Testes

### Pirâmide de Testes

```
       / \
      /   \ Integration (20%)
     /-----\ React Testing Library
    /       \ - Fluxos completos
   /         \ - Modais, filtros
  /-----------\ Unit (50%)
 /             \ Vitest
/               \ - Cálculos (parcelamento)
                 - Validações (Zod)
                 - Hooks puros

E2E (10%)
Playwright (futuro v1.5)
- Smoke test: adicionar conta até dashboard
```

### Testes Obrigatórios no MVP

| Módulo | Teste | Cobertura |
|--------|-------|-----------|
| `calcularParcelas()` | 3 casos (exato, resto, decimais) | 100% |
| `atualizarStatusAutomatico()` | 3 casos (atrasado, pendente, pago) | 100% |
| `<FormConta validation` | Campo obrigatório, formato | 90%+ |
| `useContas() + TanStack Query` | Fetch, cache, refetch | 80%+ |
| `Dashboard render` | Com dados, carregando, erro | 80%+ |

### Execução

```bash
# Dev
npm run test:watch

# CI/CD (antes de deploy)
npm run test:coverage
# Requer: lines >= 80%, branches >= 75%
```

---

## 🏗️ Estrutura de Arquivos (MVP)

```
controle-financeiro/
├── app/
│   ├── layout.tsx              ← RootLayout (tema, provider TQ+Zustand)
│   ├── page.tsx                ← Dashboard page
│   ├── (auth)/                 ← (não implementado MVP)
│   ├── contas/
│   │   ├── page.tsx            ← Lista contas
│   │   ├── nova/
│   │   │   └── page.tsx        ← Adicionar conta
│   │   └── [id]/
│   │       └── page.tsx        ← Detalhes conta
│   ├── configuracoes/
│   │   └── page.tsx            ← Configurações
│   ├── components/
│   │   ├── ui/                 ← shadcn/ui customizado
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── dialog.tsx
│   │   │   └── ...
│   │   ├── features/           ← Features (Dashboard, Contas, etc)
│   │   │   ├── Dashboard/
│   │   │   │   ├── Dashboard.tsx
│   │   │   │   ├── SaldoCard.tsx
│   │   │   │   ├── KPICards.tsx
│   │   │   │   └── ...
│   │   │   └── Contas/
│   │   │       ├── ListaContas.tsx
│   │   │       ├── FormConta.tsx
│   │   │       └── ...
│   │   ├── layouts/            ← Layouts reutilizáveis
│   │   │   ├── AppLayout.tsx
│   │   │   └── MainLayout.tsx
│   │   ├── shared/             ← Componentes globais
│   │   │   ├── Header.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── LoadingState.tsx
│   │   │   └── ErrorBoundary.tsx
│   │   └── forms/              ← Form components
│   │       └── FormConta.tsx
│   ├── lib/
│   │   ├── storage.ts          ← Storage Adapter (sql.js wrapper)
│   │   ├── hooks/              ← Custom hooks
│   │   │   ├── useContas.ts
│   │   │   ├── useFetchContas.ts
│   │   │   ├── useAdicionarConta.ts
│   │   │   ├── useValidarConta.ts
│   │   │   ├── useThemeStore.ts
│   │   │   └── useLocalStorage.ts
│   │   ├── stores/             ← Zustand stores
│   │   │   ├── useUIStore.ts   ← filtros, modais
│   │   │   └── useThemeStore.ts
│   │   ├── validation/         ← Zod schemas
│   │   │   ├── conta.ts
│   │   │   └── config.ts
│   │   ├── types/              ← TypeScript types
│   │   │   └── index.ts
│   │   ├── utils/              ← Utilidades
│   │   │   ├── formatters.ts   ← BRL, dates
│   │   │   ├── calculations.ts ← parcelamento, status
│   │   │   └── cn.ts           ← classname merger
│   │   └── db/                 ← Database setup
│   │       ├── schema.sql
│   │       └── init.ts
│   ├── styles/
│   │   ├── globals.css         ← Tailwind + custom vars
│   │   └── animations.css      ← Custom animations
│   └── providers.tsx           ← TanStack Query + Zustand providers
│
├── __tests__/                  ← Testes
│   ├── lib/
│   │   ├── calculations.test.ts
│   │   └── validation.test.ts
│   ├── components/
│   │   ├── Dashboard.test.tsx
│   │   └── FormConta.test.tsx
│   └── hooks/
│       └── useContas.test.ts
│
├── public/                     ← Assets estáticos
│   └── fonts/
│
├── docs/
│   ├── PRD.md                 ← Product Requirements
│   ├── CONSTITUTION.md        ← Leis do projeto
│   ├── SPEC.md                ← Este arquivo
│   └── PLAN.md                ← Sprints (TBD)
│
├── references/                ← Documentação de referência
│   ├── ARCHITECTURE.md        ← Diagrama + visão geral
│   ├── DATABASE.md            ← Schema SQL detalhado
│   └── COMPONENTS.md          ← Catálogo de componentes
│
├── Forge/                     ← FORGE central (symlink ou referência)
│
├── .env.local                 ← Variáveis locais (não commitar)
├── .env.example               ← Template
├── next.config.js             ← Configuração Next.js
├── tsconfig.json              ← TypeScript config
├── tailwind.config.js         ← Tailwind customizado
├── vitest.config.ts           ← Vitest config
├── package.json
└── README.md                  ← Getting started
```

---

## 🎯 Decisões Arquiteturais Registradas

### DECISÃO #1 — App Router (Next.js 16+)
- **Escolha:** App Router em `app/` 
- **Alternativa considerada:** Pages Router (`pages/`)
- **Por quê:** App Router é o futuro, melhor para SSR/SSG, melhor para Léo aprender padrão correto
- **Impacto:** Estrutura de pastas, rotas dinâmicas com `[id]`, layouts aninhados
- **Data:** 2026-04-09

### DECISÃO #2 — Layer-driven Component Structure
- **Escolha:** `ui/`, `features/`, `layouts/`, `forms/`
- **Alternativa considerada:** Atomic Design (atoms/molecules/organisms)
- **Por quê:** Mais intuitivo que Atomic, escalável como Feature-driven, responsabilidades claras
- **Impacto:** Organização de `app/components/`
- **Data:** 2026-04-09

### DECISÃO #3 — Zustand + TanStack Query
- **Escolha:** Zustand para UI state, TanStack Query para dados + cache
- **Alternativa considerada:** Redux, Zustand puro, Context API
- **Por quê:** Zustand é minimalista, TanStack Query é padrão ouro para cache/offline, não há boilerplate
- **Impacto:** Store em `lib/stores/`, hooks em `lib/hooks/`, provider no layout
- **Migração futura:** Se escalar para backend sync (v2+), TanStack Query já suporta
- **Data:** 2026-04-09

### DECISÃO #4 — WaSQLite (sql.js)
- **Escolha:** SQL.js (SQLite em WebAssembly)
- **Alternativa considerada:** Electron + SQLite nativo, Tauri, localStorage puro
- **Por quê:** MVP roda 100% no browser (Vercel), sem backend, offline-first, sem limite de tamanho para 1 usuário
- **Impacto:** Storage adapter em `lib/storage.ts`, migrations em `lib/db/`, TanStack Query adapter customizado
- **Migração futura (v2+):** Tauri desktop (mesma interface, performance melhor)
- **Data:** 2026-04-09

### DECISÃO #5 — Vitest + Testing Library
- **Escolha:** Vitest (mais rápido) + Testing Library (padrão mercado)
- **Alternativa considerada:** Jest + Enzyme, nenhum teste (MVP)
- **Por quê:** Vitest é 10x mais rápido que Jest, Testing Library testa como usuário (não implementação), ramp-up gradual
- **Impacto:** Testes em `__tests__/`, setup em `vitest.config.ts`, CI/CD integrado
- **MVP:** Apenas testes críticos (parcelamento, validação, fluxos)
- **Data:** 2026-04-09

---

## ✅ Definição de Pronto (DoD)

Para uma feature ser considerada PRONTA e ir para produção:

### Code
- [ ] Código implementado conforme **esta SPEC** (se divergir, SPEC é a verdade)
- [ ] Nenhuma lei da **Constitution** violada (LEI #14 design premium especialmente)
- [ ] TypeScript sem `any` (exceto casos documentados)
- [ ] Sem `console.log()` em produção
- [ ] Sem comentários de debug

### Testing
- [ ] Testes automatizados passando (Vitest)
- [ ] Coverage >= 80% (para funções críticas: 100%)
- [ ] Funciona offline (desconectar Wi-Fi, testar)
- [ ] Validações Zod funcionando
- [ ] Teste manual em device real (ou DevTools mobile)

### Performance
- [ ] Lighthouse score >= 85 (mobile)
- [ ] Dashboard carrega em < 1s
- [ ] Sem layout shifts (CLS = 0)
- [ ] Animations respeitam `prefers-reduced-motion`

### Accessibility
- [ ] Teclado navegável (tab order correto)
- [ ] Cores com contraste WCAG AA
- [ ] Imagens com alt text (futuro)
- [ ] Modais são focusáveis

### Documentation
- [ ] Componentes documentados (comentário da função)
- [ ] Hooks com exemplo de uso
- [ ] Decisões registradas em forge-data.json
- [ ] Divergências vs SPEC registradas

### Design
- [ ] Dark mode padrão, amber accents
- [ ] Responsivo (320px - 2560px)
- [ ] Animações Framer Motion suaves
- [ ] Nenhum genérico, 100% premium (LEI #14)

### Logging & Monitoring
- [ ] Erros registrados em console (dev only)
- [ ] Sem dados financeiros em logs (LEI #11)
- [ ] TanStack Query retry automático configurado

### Conformidade
- [ ] Nenhuma lei violada
- [ ] Referências atualizadas (se arquivo novo)
- [ ] forge-data.json atualizado
- [ ] Próxima etapa documentada (se mudou)

---

## 📊 Rastreamento de Mudanças

| Versão | Data | Mudança | Motivo |
|--------|------|---------|--------|
| 1.0 | 2026-04-09 | Inicial | Criada via /forge-spec |

---

**Status:** ✅ Aprovado  
**Próximo passo:** `/forge-plan` — Quebrar SPEC em sprints e tasks  
**Data de criação:** 2026-04-09  
**Última atualização:** 2026-04-09

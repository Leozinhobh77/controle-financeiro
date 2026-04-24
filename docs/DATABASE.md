# 🗃️ DATABASE — SQLite Schema Detalhado

## SQL — Criar Tabelas

```sql
-- Tabela: categorias (dados iniciais pré-configurados)
CREATE TABLE categorias (
  id TEXT PRIMARY KEY,
  nome TEXT NOT NULL,
  cor TEXT NOT NULL,
  icone TEXT NOT NULL,
  criadoEm TEXT NOT NULL
);

-- Tabela: contas (dados do usuário)
CREATE TABLE contas (
  id TEXT PRIMARY KEY,
  descricao TEXT NOT NULL,
  valor REAL NOT NULL,
  dataVencimento TEXT NOT NULL,
  dataPagamento TEXT,
  status TEXT NOT NULL,
  categoria TEXT NOT NULL,
  observacoes TEXT,
  recorrente BOOLEAN NOT NULL,
  intervaloRecorrencia TEXT,
  recorrenciaAtiva BOOLEAN NOT NULL,
  parcelado BOOLEAN NOT NULL,
  totalParcelas INTEGER,
  parcelaAtual INTEGER,
  grupoParcelamento TEXT,
  criadoEm TEXT NOT NULL,
  atualizadoEm TEXT NOT NULL,
  FOREIGN KEY (categoria) REFERENCES categorias(id)
);

-- Tabela: config (singleton — uma linha cada chave)
CREATE TABLE config (
  chave TEXT PRIMARY KEY,
  valor TEXT NOT NULL,
  tipo TEXT NOT NULL,
  atualizadoEm TEXT NOT NULL
);

-- Índices para performance
CREATE INDEX idx_contas_status ON contas(status);
CREATE INDEX idx_contas_dataVencimento ON contas(dataVencimento);
CREATE INDEX idx_contas_categoria ON contas(categoria);
CREATE INDEX idx_contas_grupoParcelamento ON contas(grupoParcelamento);
```

## SQL — Seed (Dados Iniciais)

```sql
-- Categorias pré-configuradas
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

-- Configurações padrão
INSERT INTO config (chave, valor, tipo, atualizadoEm) VALUES
('tema', 'dark', 'string', '2026-04-09T00:00:00Z'),
('moeda', 'BRL', 'string', '2026-04-09T00:00:00Z'),
('nomeUsuario', 'Usuário', 'string', '2026-04-09T00:00:00Z'),
('saldoInicial', '0', 'number', '2026-04-09T00:00:00Z');
```

## TypeScript Types

```typescript
interface Conta {
  id: string;
  descricao: string;
  valor: number;
  dataVencimento: string; // YYYY-MM-DD
  dataPagamento?: string; // YYYY-MM-DD ou null
  status: 'pendente' | 'atrasado' | 'pago';
  categoria: string; // FK → categorias.id
  observacoes?: string;
  recorrente: boolean;
  intervaloRecorrencia?: 'semanal' | 'mensal' | 'anual';
  recorrenciaAtiva: boolean;
  parcelado: boolean;
  totalParcelas?: number;
  parcelaAtual?: number;
  grupoParcelamento?: string; // UUID para agrupar parcelas
  criadoEm: string; // ISO 8601
  atualizadoEm: string; // ISO 8601
}

interface Categoria {
  id: string;
  nome: string;
  cor: string; // hex #RRGGBB
  icone: string; // emoji
  criadoEm: string;
}

interface Config {
  [chave: string]: string | number; // flexible
}
```

## Queries Comuns

```typescript
// Todas as contas
SELECT * FROM contas ORDER BY dataVencimento ASC;

// Contas pendentes
SELECT * FROM contas WHERE status = 'pendente' ORDER BY dataVencimento ASC;

// Contas atrasadas
SELECT * FROM contas WHERE status = 'atrasado' ORDER BY dataVencimento ASC;

// Contas pagas este mês
SELECT * FROM contas 
WHERE status = 'pago' 
AND strftime('%Y-%m', dataPagamento) = strftime('%Y-%m', 'now');

// Soma por categoria
SELECT categoria, SUM(valor) as total 
FROM contas 
WHERE status = 'pago' 
GROUP BY categoria;

// Próximas 5 contas a vencer
SELECT * FROM contas 
WHERE status != 'pago' 
ORDER BY dataVencimento ASC 
LIMIT 5;

// Parcelas de um grupo
SELECT * FROM contas 
WHERE grupoParcelamento = ? 
ORDER BY parcelaAtual ASC;

// Config por chave
SELECT valor FROM config WHERE chave = 'saldoInicial';
```

## Migrations (para futuro)

Quando o schema mudar, criar arquivos:

```
lib/db/migrations/
├── 001_create_tables.sql      (inicial)
├── 002_add_campo_novo.sql     (exemplo futuro)
└── ...
```

Cada migration deve ter `-- Upgrade:` e `-- Downgrade:` comentados.

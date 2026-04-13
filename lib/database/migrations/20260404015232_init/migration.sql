-- CreateTable
CREATE TABLE "Conta" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "descricao" TEXT NOT NULL,
    "valor" REAL NOT NULL,
    "dataVencimento" TEXT,
    "dataPagamento" TEXT,
    "categoria" TEXT NOT NULL DEFAULT 'outros',
    "observacoes" TEXT DEFAULT '',
    "status" TEXT NOT NULL DEFAULT 'pendente',
    "recorrente" BOOLEAN NOT NULL DEFAULT false,
    "intervaloRecorrencia" TEXT,
    "recorrenciaAtiva" BOOLEAN NOT NULL DEFAULT false,
    "parcelado" BOOLEAN NOT NULL DEFAULT false,
    "totalParcelas" INTEGER,
    "parcelaAtual" INTEGER,
    "grupoParcelamento" TEXT,
    "criadoEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Categoria" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "cor" TEXT NOT NULL,
    "icone" TEXT NOT NULL,
    "ordem" INTEGER NOT NULL DEFAULT 0
);

-- CreateTable
CREATE TABLE "KanbanCard" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "coluna" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT,
    "prioridade" TEXT,
    "cor" TEXT,
    "ordem" INTEGER NOT NULL DEFAULT 0,
    "criadoEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Config" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT 'main',
    "tema" TEXT NOT NULL DEFAULT 'dark',
    "moeda" TEXT NOT NULL DEFAULT 'BRL',
    "nomeUsuario" TEXT NOT NULL DEFAULT 'Usuário',
    "saldoInicial" REAL NOT NULL DEFAULT 0
);

-- CreateIndex
CREATE INDEX "Conta_status_idx" ON "Conta"("status");

-- CreateIndex
CREATE INDEX "Conta_dataVencimento_idx" ON "Conta"("dataVencimento");

-- CreateIndex
CREATE INDEX "Conta_grupoParcelamento_idx" ON "Conta"("grupoParcelamento");

-- CreateIndex
CREATE INDEX "KanbanCard_coluna_idx" ON "KanbanCard"("coluna");

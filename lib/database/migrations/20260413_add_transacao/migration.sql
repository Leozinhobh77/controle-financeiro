-- CreateTable Transacao (Melhoria Titan — Audit Trail)
CREATE TABLE "Transacao" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "contaId" TEXT,
    "tipo" TEXT NOT NULL,
    "valor" REAL NOT NULL,
    "data" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "categoria" TEXT,
    "metodo" TEXT,
    "criadoEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE INDEX "Transacao_tipo_idx" ON "Transacao"("tipo");

-- CreateIndex
CREATE INDEX "Transacao_data_idx" ON "Transacao"("data");

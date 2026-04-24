// ─── Prisma Singleton — Controle Financeiro Titan ──────────────────────────────
// Garante uma única instância do Prisma rodando no ambiente de dev (Next.js)
// prevenindo o erro "Too many connections".

import { PrismaClient } from '@prisma/client';

const prismaClientSingleton = () => {
  return new PrismaClient();
};

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma = globalThis.prisma ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma;

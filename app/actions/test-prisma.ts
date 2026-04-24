'use server';

import prisma from '@/lib/database/client';

/**
 * Server Action de teste para validar Prisma Client singleton
 * Task 2.1 — Prisma Client Factory & Singleton
 */
export async function testPrismaConnection() {
  try {
    // Teste 1: Verificar conexão
    const dbCheck = await prisma.$queryRaw`SELECT 1 as connected`;

    // Teste 2: Contar registros na tabela Conta
    const contaCount = await prisma.conta.count();

    // Teste 3: Listar configurações
    const config = await prisma.config.findUnique({
      where: { id: 'main' },
    });

    return {
      success: true,
      timestamp: new Date().toISOString(),
      checks: {
        dbConnection: dbCheck,
        contaRecords: contaCount,
        configExists: !!config,
      },
      message: '✅ Prisma Client singleton funcionando corretamente',
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido',
      message: '❌ Erro ao conectar com Prisma Client',
    };
  }
}

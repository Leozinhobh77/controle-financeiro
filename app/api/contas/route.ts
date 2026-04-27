import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/database/client';
import { ContaCreateSchema } from '@/lib/schemas/conta';
import { ZodError } from 'zod';

/**
 * GET /api/contas
 * Retorna todas as contas, ordenadas por dataVencimento
 */
export async function GET() {
  try {
    const contas = await prisma.conta.findMany({
      orderBy: { dataVencimento: 'asc' },
    });

    return NextResponse.json(contas.map(serializarConta), {
      status: 200,
    });
  } catch (error) {
    console.error('[GET /api/contas]', error);
    return NextResponse.json(
      { erro: 'Erro ao listar contas' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/contas
 * Cria uma nova conta com suporte a parcelamento e recorrência
 */
export async function POST(request: NextRequest) {
  try {
    const dados = await request.json();

    // Validar com Zod
    const validado = ContaCreateSchema.parse(dados);

    // Criar conta
    const novaConta = await prisma.conta.create({
      data: {
        descricao: validado.descricao,
        valor: validado.valor,
        dataVencimento: validado.dataVencimento || null,
        categoria: validado.categoria,
        observacoes: validado.observacoes,
        status: validado.status,
        recorrente: validado.recorrente,
        intervaloRecorrencia: validado.intervaloRecorrencia || null,
        recorrenciaAtiva: validado.recorrenciaAtiva,
        parcelado: validado.parcelado,
        totalParcelas: validado.totalParcelas || null,
        parcelaAtual: validado.parcelaAtual || null,
        grupoParcelamento: validado.grupoParcelamento || null,
      },
    });

    // Se for parcelado, criar as demais parcelas
    if (validado.parcelado && validado.totalParcelas && validado.totalParcelas > 1) {
      const grupoId = novaConta.id;
      const valorParcela = validado.valor / validado.totalParcelas;

      for (let i = 2; i <= validado.totalParcelas; i++) {
        // Incrementar a data de vencimento para cada parcela
        const dataBase = validado.dataVencimento ? new Date(validado.dataVencimento) : new Date();
        dataBase.setMonth(dataBase.getMonth() + (i - 1));

        await prisma.conta.create({
          data: {
            descricao: `${validado.descricao} (Parcela ${i}/${validado.totalParcelas})`,
            valor: valorParcela,
            dataVencimento: dataBase.toISOString().split('T')[0],
            categoria: validado.categoria,
            observacoes: validado.observacoes,
            status: 'pendente',
            recorrente: false,
            parcelado: true,
            totalParcelas: validado.totalParcelas,
            parcelaAtual: i,
            grupoParcelamento: grupoId,
          },
        });
      }
    }

    return NextResponse.json(serializarConta(novaConta), {
      status: 201,
      headers: { 'Content-Location': `/api/contas/${novaConta.id}` },
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { erro: 'Validação falhou', detalhes: error.errors },
        { status: 400 }
      );
    }

    console.error('[POST /api/contas]', error);
    return NextResponse.json(
      { erro: 'Erro ao criar conta' },
      { status: 500 }
    );
  }
}

/**
 * Helper: Serializar Conta para JSON
 * Converte datas do Prisma para ISO string
 */
function serializarConta(conta: any) {
  return {
    ...conta,
    criadoEm: conta.criadoEm?.toISOString?.() || null,
    atualizadoEm: conta.atualizadoEm?.toISOString?.() || null,
  };
}

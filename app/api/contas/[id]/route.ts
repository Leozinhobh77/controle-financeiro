import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/database/client';
import { ContaUpdateSchema } from '@/lib/schemas/conta';
import { ZodError } from 'zod';

/**
 * PUT /api/contas/:id
 * Atualiza uma conta existente
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const dados = await request.json();

    // Validar com Zod
    const validado = ContaUpdateSchema.parse(dados);

    // Construir objeto de update apenas com campos fornecidos
    const updateData: any = {};
    if (validado.descricao !== undefined) updateData.descricao = validado.descricao;
    if (validado.valor !== undefined) updateData.valor = validado.valor;
    if (validado.dataVencimento !== undefined)
      updateData.dataVencimento = validado.dataVencimento || null;
    if (validado.categoria !== undefined) updateData.categoria = validado.categoria;
    if (validado.observacoes !== undefined) updateData.observacoes = validado.observacoes;
    if (validado.status !== undefined) updateData.status = validado.status;
    if (validado.recorrente !== undefined) updateData.recorrente = validado.recorrente;
    if (validado.intervaloRecorrencia !== undefined)
      updateData.intervaloRecorrencia = validado.intervaloRecorrencia || null;
    if (validado.recorrenciaAtiva !== undefined)
      updateData.recorrenciaAtiva = validado.recorrenciaAtiva;
    if (validado.dataPagamento !== undefined)
      updateData.dataPagamento = validado.dataPagamento || null;

    const atualizada = await prisma.conta.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(serializarConta(atualizada), { status: 200 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { erro: 'Validação falhou', detalhes: error.errors },
        { status: 400 }
      );
    }

    if ((error as any).code === 'P2025') {
      return NextResponse.json(
        { erro: 'Conta não encontrada' },
        { status: 404 }
      );
    }

    console.error('[PUT /api/contas/:id]', error);
    return NextResponse.json(
      { erro: 'Erro ao atualizar conta' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/contas/:id
 * Deleta uma conta existente
 */
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.conta.delete({
      where: { id },
    });

    return NextResponse.json({ ok: true, deletado: id }, { status: 200 });
  } catch (error) {
    if ((error as any).code === 'P2025') {
      return NextResponse.json(
        { erro: 'Conta não encontrada' },
        { status: 404 }
      );
    }

    console.error('[DELETE /api/contas/:id]', error);
    return NextResponse.json(
      { erro: 'Erro ao deletar conta' },
      { status: 500 }
    );
  }
}

/**
 * Helper: Serializar Conta para JSON
 */
function serializarConta(conta: any) {
  return {
    ...conta,
    criadoEm: conta.criadoEm?.toISOString?.() || null,
    atualizadoEm: conta.atualizadoEm?.toISOString?.() || null,
  };
}

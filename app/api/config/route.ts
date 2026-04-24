import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/database/client';

export async function PUT(request: NextRequest) {
  try {
    const { nomeUsuario, saldoInicial } = await request.json();

    const config = await prisma.config.upsert({
      where: { id: 'main' },
      update: { nomeUsuario, saldoInicial },
      create: { id: 'main', nomeUsuario, saldoInicial, moeda: 'BRL', tema: 'dark' },
    });

    return NextResponse.json(config, { status: 200 });
  } catch (error) {
    console.error('[PUT /api/config]', error);
    return NextResponse.json({ erro: 'Erro ao salvar configurações' }, { status: 500 });
  }
}

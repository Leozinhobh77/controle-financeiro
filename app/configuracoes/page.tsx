import prisma from '@/lib/database/client';
import { ConfiguracoesClient } from './ConfiguracoesClient';

export const revalidate = 0;

export default async function ConfiguracoesPage() {
  let config = await prisma.config.findFirst({ where: { id: 'main' } });

  if (!config) {
    config = await prisma.config.create({
      data: { id: 'main', nomeUsuario: 'Usuário', saldoInicial: 0, moeda: 'BRL', tema: 'dark' },
    });
  }

  return <ConfiguracoesClient config={config} />;
}

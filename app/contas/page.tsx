import prisma from '@/lib/database/client';
import { ContasClient } from './ContasClient';

export const revalidate = 0;

export default async function ContasPage() {
  const contas = await prisma.conta.findMany({
    orderBy: [{ dataVencimento: 'asc' }],
  });

  return (
    <div className="flex flex-col">
      <ContasClient contas={contas as any} />
    </div>
  );
}

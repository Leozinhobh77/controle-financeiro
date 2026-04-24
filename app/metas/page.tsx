import prisma from '@/lib/database/client';
import { gastosPorCategoria, categoriaCor, categoriaLabel, formatCurrency } from '@/lib/utils/financeiro';
import { Target, TrendingDown, Award } from 'lucide-react';
import { MetasClient } from './MetasClient';

export const revalidate = 0;

export default async function MetasPage() {
  const contas = await prisma.conta.findMany();
  const contasPendentes = contas.filter((c) => c.status === 'pendente');
  const contasPagas = contas.filter((c) => c.status === 'pago');

  const gastosPendentes = gastosPorCategoria(contasPendentes as any);
  const gastosPagos = gastosPorCategoria(contasPagas as any);

  const totalGeral = contas.reduce((acc, c) => acc + c.valor, 0);
  const totalPago = contasPagas.reduce((acc, c) => acc + c.valor, 0);
  const percentualPago = totalGeral > 0 ? (totalPago / totalGeral) * 100 : 0;

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-display text-white">Metas & Visão</h1>
        <p className="text-text-muted mt-1 text-sm">Acompanhe seus gastos por categoria e progresso financeiro</p>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel p-6 flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
              <Target className="w-5 h-5 text-accent" />
            </div>
            <div>
              <p className="text-text-muted text-xs">Progresso Geral</p>
              <p className="text-2xl font-display font-bold text-white">
                {percentualPago.toFixed(0)}%
              </p>
            </div>
          </div>
          <div className="w-full bg-white/10 rounded-full h-2">
            <div
              className="h-2 rounded-full bg-accent transition-all duration-700"
              style={{ width: `${percentualPago}%` }}
            />
          </div>
          <p className="text-text-muted text-xs">
            {formatCurrency(totalPago)} pagos de {formatCurrency(totalGeral)} total
          </p>
        </div>

        <div className="glass-panel p-6 flex flex-col gap-2">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-status-success/10 flex items-center justify-center">
              <Award className="w-5 h-5 text-status-success" />
            </div>
            <p className="text-text-muted text-xs">Categorias Quitadas</p>
          </div>
          {gastosPagos.slice(0, 3).map(({ cat, total }) => (
            <div key={cat} className="flex items-center justify-between">
              <span className="text-sm" style={{ color: categoriaCor(cat) }}>
                {categoriaLabel(cat)}
              </span>
              <span className="text-sm font-medium text-white">{formatCurrency(total)}</span>
            </div>
          ))}
          {gastosPagos.length === 0 && (
            <p className="text-text-muted text-sm">Nenhuma conta paga ainda</p>
          )}
        </div>

        <div className="glass-panel p-6 flex flex-col gap-2">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-status-danger/10 flex items-center justify-center">
              <TrendingDown className="w-5 h-5 text-status-danger" />
            </div>
            <p className="text-text-muted text-xs">Maiores Pendências</p>
          </div>
          {gastosPendentes.slice(0, 3).map(({ cat, total }) => (
            <div key={cat} className="flex items-center justify-between">
              <span className="text-sm" style={{ color: categoriaCor(cat) }}>
                {categoriaLabel(cat)}
              </span>
              <span className="text-sm font-medium text-white">{formatCurrency(total)}</span>
            </div>
          ))}
          {gastosPendentes.length === 0 && (
            <p className="text-text-muted text-sm text-status-success">Tudo em dia!</p>
          )}
        </div>
      </div>

      {/* Distribuição por Categoria */}
      <MetasClient gastos={gastosPendentes} gastosPagos={gastosPagos} totalGeral={totalGeral} />
    </div>
  );
}

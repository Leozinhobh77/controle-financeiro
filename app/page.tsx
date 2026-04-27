import { mockContas, mockConfig } from '@/mockData';
import { MetricCard } from './components/ui/MetricCard';
import { CashflowChart } from './components/ui/CashflowChart';
import { ContaList } from './components/ui/ContaList';
import {
  calcularScore,
  scoreLabel,
  gerarProjecaoFluxo,
  calcularAlertas,
  formatCurrency,
} from '@/lib/utils/financeiro';
import {
  AlertTriangle,
  Clock,
  Zap,
  Plus,
  TrendingUp,
} from 'lucide-react';
import Link from 'next/link';

export const revalidate = 0;

export default async function Dashboard() {
  const todasContas = mockContas.sort((a, b) => new Date(a.dataVencimento || 0).getTime() - new Date(b.dataVencimento || 0).getTime());
  const config = mockConfig;

  const saldoInicial = config?.saldoInicial ?? 0;
  const nomeUsuario = config?.nomeUsuario ?? 'Usuário';

  const totalPendente = todasContas
    .filter((c) => c.status === 'pendente')
    .reduce((acc, c) => acc + c.valor, 0);

  const totalPago = todasContas
    .filter((c) => c.status === 'pago')
    .reduce((acc, c) => acc + c.valor, 0);

  const saldoAtual = saldoInicial - totalPago;

  const score = calcularScore(todasContas as any);
  const { label: scoreLabelText, cor: scoreCor } = scoreLabel(score);
  const projecao = gerarProjecaoFluxo(todasContas as any);
  const alertas = calcularAlertas(todasContas as any);

  const contasParaLista = todasContas.filter((c) => c.status !== 'pago').slice(0, 8) as any[];

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="animate-fade-in">
          <p className="text-text-muted text-sm mb-1">Bem-vindo de volta,</p>
          <h1 className="text-4xl text-white font-display tracking-tight">
            {nomeUsuario} <span className="text-accent">✦</span>
          </h1>
          <p className="text-text-secondary mt-1 text-sm">
            {new Date().toLocaleDateString('pt-BR', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </p>
        </div>
        <Link href="/contas" className="btn-gold hidden md:flex items-center gap-2 group shadow-glow">
          <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
          <span>Nova Conta</span>
        </Link>
      </div>

      {/* Alertas */}
      {(alertas.atrasadas.length > 0 || alertas.vencendoHoje.length > 0 || alertas.proximos7Dias.length > 0) && (
        <div className="flex flex-col sm:flex-row gap-3">
          {alertas.atrasadas.length > 0 && (
            <div className="flex-1 flex items-center gap-3 glass-panel p-4 border border-status-danger/30 bg-status-danger/5 rounded-xl">
              <AlertTriangle className="w-5 h-5 text-status-danger flex-shrink-0" />
              <div>
                <p className="text-status-danger font-semibold text-sm">
                  {alertas.atrasadas.length} conta{alertas.atrasadas.length > 1 ? 's' : ''} em atraso
                </p>
                <p className="text-text-muted text-xs">
                  {formatCurrency(alertas.atrasadas.reduce((a, c) => a + c.valor, 0))}
                </p>
              </div>
            </div>
          )}
          {alertas.vencendoHoje.length > 0 && (
            <div className="flex-1 flex items-center gap-3 glass-panel p-4 border border-status-warning/30 bg-status-warning/5 rounded-xl">
              <Clock className="w-5 h-5 text-status-warning flex-shrink-0" />
              <div>
                <p className="text-status-warning font-semibold text-sm">
                  {alertas.vencendoHoje.length} venc{alertas.vencendoHoje.length > 1 ? 'em' : 'e'} hoje
                </p>
                <p className="text-text-muted text-xs">
                  {formatCurrency(alertas.vencendoHoje.reduce((a, c) => a + c.valor, 0))}
                </p>
              </div>
            </div>
          )}
          {alertas.proximos7Dias.length > 0 && (
            <div className="flex-1 flex items-center gap-3 glass-panel p-4 border border-accent/30 bg-accent/5 rounded-xl">
              <Zap className="w-5 h-5 text-accent flex-shrink-0" />
              <div>
                <p className="text-accent font-semibold text-sm">
                  {alertas.proximos7Dias.length} nos próximos 7 dias
                </p>
                <p className="text-text-muted text-xs">
                  {formatCurrency(alertas.proximos7Dias.reduce((a, c) => a + c.valor, 0))}
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Score + MetricCards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Score de Saúde */}
        <div className="glass-panel p-6 flex flex-col items-center justify-center gap-3 shadow-lg relative overflow-hidden group">
          <div
            className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity rounded-xl"
            style={{ background: `radial-gradient(circle at center, ${scoreCor}, transparent 70%)` }}
          />
          <TrendingUp className="w-5 h-5 text-text-muted" />
          <div className="text-center relative z-10">
            <p className="text-text-muted text-xs uppercase tracking-widest mb-1">Saúde Financeira</p>
            <p className="text-5xl font-display font-bold" style={{ color: scoreCor }}>
              {score}
            </p>
            <p className="text-sm font-semibold mt-1" style={{ color: scoreCor }}>
              {scoreLabelText}
            </p>
          </div>
          <div className="w-full bg-white/10 rounded-full h-1.5 relative z-10">
            <div
              className="h-1.5 rounded-full transition-all duration-700"
              style={{ width: `${score}%`, backgroundColor: scoreCor }}
            />
          </div>
        </div>

        <MetricCard
          title="Saldo Disponível"
          value={formatCurrency(saldoAtual)}
          subtitle="Após pagamentos realizados"
          icon="wallet"
          trend={saldoAtual >= 0 ? 'up' : 'down'}
          trendValue={saldoAtual >= 0 ? 'Positivo' : 'Negativo'}
          delay={0.1}
        />
        <MetricCard
          title="Despesas Pendentes"
          value={formatCurrency(totalPendente)}
          subtitle={`${todasContas.filter((c) => c.status === 'pendente').length} contas a pagar`}
          icon="arrowDownCircle"
          trend="down"
          trendValue={`${todasContas.filter((c) => c.status === 'pendente').length} contas`}
          delay={0.2}
        />
        <MetricCard
          title="Total Pago"
          value={formatCurrency(totalPago)}
          subtitle={`${todasContas.filter((c) => c.status === 'pago').length} contas quitadas`}
          icon="checkCircle2"
          trend="up"
          trendValue="Quitadas"
          delay={0.3}
        />
      </div>

      {/* Gráfico + Lista */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-[400px]">
        <div className="lg:col-span-2">
          <CashflowChart data={projecao} />
        </div>
        <div className="lg:col-span-1">
          <ContaList contas={contasParaLista} />
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState, useTransition } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Trash2,
  Plus,
  Filter,
  Download,
  Calendar,
  Tag,
} from 'lucide-react';
import { format, isToday } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { formatCurrency, categoriaCor, categoriaLabel, exportarCSV } from '@/lib/utils/financeiro';
import { ContaDialog } from './ContaDialog';
import { useRouter } from 'next/navigation';

interface Conta {
  id: string;
  descricao: string;
  valor: number;
  dataVencimento: string | null;
  status: string;
  categoria: string;
  observacoes: string | null;
  recorrente: boolean;
  parcelado: boolean;
  parcelaAtual: number | null;
  totalParcelas: number | null;
}

interface Props {
  contas: Conta[];
}

type FiltroStatus = 'todos' | 'pendente' | 'pago' | 'atrasado';

export function ContasClient({ contas }: Props) {
  const router = useRouter();
  const [busca, setBusca] = useState('');
  const [filtroStatus, setFiltroStatus] = useState<FiltroStatus>('todos');
  const [filtroCategoria, setFiltroCategoria] = useState('todas');
  const [dialogAberto, setDialogAberto] = useState(false);
  const [contaEditando, setContaEditando] = useState<Conta | null>(null);
  const [, startTransition] = useTransition();

  const categorias = Array.from(new Set(contas.map((c) => c.categoria)));

  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  const isAtrasado = (c: Conta) =>
    c.status === 'pendente' &&
    c.dataVencimento &&
    (() => {
      const d = new Date(c.dataVencimento!);
      d.setHours(0, 0, 0, 0);
      return d < hoje;
    })();

  const contasFiltradas = contas.filter((c) => {
    const matchBusca = c.descricao.toLowerCase().includes(busca.toLowerCase());
    const matchCategoria = filtroCategoria === 'todas' || c.categoria === filtroCategoria;
    const atrasado = isAtrasado(c);
    const matchStatus =
      filtroStatus === 'todos' ||
      (filtroStatus === 'atrasado' && atrasado) ||
      (filtroStatus === 'pendente' && c.status === 'pendente' && !atrasado) ||
      (filtroStatus === 'pago' && c.status === 'pago');
    return matchBusca && matchCategoria && matchStatus;
  });

  async function marcarPago(id: string) {
    await fetch(`/api/contas/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        status: 'pago',
        dataPagamento: new Date().toISOString().split('T')[0],
      }),
    });
    startTransition(() => router.refresh());
  }

  async function deletarConta(id: string) {
    if (!confirm('Tem certeza que deseja excluir esta conta?')) return;
    await fetch(`/api/contas/${id}`, { method: 'DELETE' });
    startTransition(() => router.refresh());
  }

  function abrirEdicao(conta: Conta) {
    setContaEditando(conta);
    setDialogAberto(true);
  }

  function getStatusInfo(c: Conta) {
    if (c.status === 'pago')
      return { icon: CheckCircle2, cor: 'text-status-success', bg: 'bg-status-success/10 border-status-success/20', label: 'Pago' };
    if (isAtrasado(c))
      return { icon: AlertTriangle, cor: 'text-status-danger', bg: 'bg-status-danger/10 border-status-danger/20', label: 'Atrasado' };
    if (c.dataVencimento) {
      const d = new Date(c.dataVencimento);
      d.setHours(0, 0, 0, 0);
      if (d.getTime() === hoje.getTime())
        return { icon: Clock, cor: 'text-status-warning', bg: 'bg-status-warning/10 border-status-warning/20', label: 'Vence hoje' };
    }
    return { icon: Calendar, cor: 'text-accent', bg: 'bg-accent/10 border-accent/20', label: 'Pendente' };
  }

  const totalFiltrado = contasFiltradas.reduce((acc, c) => acc + c.valor, 0);
  const totalAtrasado = contas.filter(isAtrasado).reduce((acc, c) => acc + c.valor, 0);

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-display text-white">Minhas Contas</h1>
          <p className="text-text-muted mt-1 text-sm">
            {contas.length} conta{contas.length !== 1 ? 's' : ''} cadastrada{contas.length !== 1 ? 's' : ''}
            {totalAtrasado > 0 && (
              <span className="text-status-danger ml-2">
                • {formatCurrency(totalAtrasado)} em atraso
              </span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => exportarCSV(contas as any)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg glass-panel border border-white/10 text-text-secondary hover:text-white hover:border-accent/40 transition-all text-sm"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Exportar CSV</span>
          </button>
          <button
            onClick={() => { setContaEditando(null); setDialogAberto(true); }}
            className="btn-gold flex items-center gap-2 shadow-glow"
          >
            <Plus className="w-4 h-4" />
            Nova Conta
          </button>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            placeholder="Buscar por descrição..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-surface border border-white/10 rounded-xl text-sm text-white placeholder:text-text-muted focus:border-accent/50 focus:ring-1 focus:ring-accent/20 outline-none transition-all"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="w-4 h-4 text-text-muted flex-shrink-0" />
          {(['todos', 'pendente', 'atrasado', 'pago'] as FiltroStatus[]).map((f) => (
            <button
              key={f}
              onClick={() => setFiltroStatus(f)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                filtroStatus === f
                  ? 'bg-accent text-background'
                  : 'glass-panel text-text-secondary hover:text-white'
              }`}
            >
              {f === 'todos' ? 'Todos' : f === 'pendente' ? 'Pendentes' : f === 'atrasado' ? 'Atrasados' : 'Pagos'}
            </button>
          ))}
        </div>

        <select
          value={filtroCategoria}
          onChange={(e) => setFiltroCategoria(e.target.value)}
          className="px-3 py-2 bg-surface border border-white/10 rounded-xl text-sm text-white focus:border-accent/50 outline-none transition-all"
        >
          <option value="todas">Todas categorias</option>
          {categorias.map((cat) => (
            <option key={cat} value={cat}>
              {categoriaLabel(cat)}
            </option>
          ))}
        </select>
      </div>

      {/* Totalizador */}
      {contasFiltradas.length > 0 && (
        <div className="glass-panel p-4 mb-6 flex items-center justify-between">
          <p className="text-text-secondary text-sm">
            <span className="text-white font-medium">{contasFiltradas.length}</span> contas exibidas
          </p>
          <p className="text-text-secondary text-sm">
            Total: <span className="text-white font-bold font-display">{formatCurrency(totalFiltrado)}</span>
          </p>
        </div>
      )}

      {/* Lista */}
      <AnimatePresence mode="popLayout">
        {contasFiltradas.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-panel p-12 flex flex-col items-center justify-center text-text-muted"
          >
            <CheckCircle2 className="w-12 h-12 mb-3 opacity-30 text-status-success" />
            <p className="font-display text-white">Nenhuma conta encontrada</p>
            <p className="text-sm mt-1">Ajuste os filtros ou adicione uma nova conta</p>
          </motion.div>
        ) : (
          <div className="flex flex-col gap-3">
            {contasFiltradas.map((conta, i) => {
              const { icon: Icon, cor, bg, label } = getStatusInfo(conta);
              return (
                <motion.div
                  key={conta.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: i * 0.03 }}
                  className="glass-panel p-4 flex items-center gap-4 group hover:bg-white/5 transition-all cursor-pointer"
                  onClick={() => abrirEdicao(conta)}
                >
                  {/* Status Icon */}
                  <div className={`p-2 rounded-lg border flex-shrink-0 ${bg}`}>
                    <Icon className={`w-5 h-5 ${cor}`} />
                  </div>

                  {/* Info principal */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-medium text-white group-hover:text-accent transition-colors truncate">
                        {conta.descricao}
                      </p>
                      {conta.parcelado && conta.totalParcelas && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-text-muted border border-white/10">
                          {conta.parcelaAtual}/{conta.totalParcelas}x
                        </span>
                      )}
                      {conta.recorrente && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-accent/10 text-accent border border-accent/20">
                          Recorrente
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                      <span
                        className="flex items-center gap-1 text-xs font-medium"
                        style={{ color: categoriaCor(conta.categoria) }}
                      >
                        <Tag className="w-3 h-3" />
                        {categoriaLabel(conta.categoria)}
                      </span>
                      {conta.dataVencimento && (
                        <span className="text-xs text-text-muted flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {isToday(new Date(conta.dataVencimento))
                            ? 'Hoje'
                            : format(new Date(conta.dataVencimento), "dd 'de' MMM", { locale: ptBR })}
                        </span>
                      )}
                      <span className={`text-xs ${cor}`}>{label}</span>
                    </div>
                  </div>

                  {/* Valor + Ações */}
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <p className="font-bold font-display text-white text-right">
                      {formatCurrency(conta.valor)}
                    </p>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {conta.status === 'pendente' && (
                        <button
                          onClick={(e) => { e.stopPropagation(); marcarPago(conta.id); }}
                          className="p-1.5 rounded-lg hover:bg-status-success/20 text-text-muted hover:text-status-success transition-all"
                          title="Marcar como pago"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={(e) => { e.stopPropagation(); deletarConta(conta.id); }}
                        className="p-1.5 rounded-lg hover:bg-status-danger/20 text-text-muted hover:text-status-danger transition-all"
                        title="Excluir conta"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </AnimatePresence>

      {/* Dialog */}
      <ContaDialog
        aberto={dialogAberto}
        onFechar={() => { setDialogAberto(false); setContaEditando(null); }}
        contaInicial={contaEditando}
        onSalvo={() => {
          setDialogAberto(false);
          setContaEditando(null);
          startTransition(() => router.refresh());
        }}
      />
    </>
  );
}

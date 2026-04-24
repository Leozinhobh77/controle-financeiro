'use client';

import { useState, useEffect } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, DollarSign, Calendar, Tag, FileText, RefreshCw, CreditCard } from 'lucide-react';
import { CATEGORIAS, formatCurrency } from '@/lib/utils/financeiro';

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
  aberto: boolean;
  onFechar: () => void;
  contaInicial: Conta | null;
  onSalvo: () => void;
}

const DEFAULT: Partial<Conta> = {
  descricao: '',
  valor: 0,
  dataVencimento: new Date().toISOString().split('T')[0],
  status: 'pendente',
  categoria: 'outros',
  observacoes: '',
  recorrente: false,
  parcelado: false,
  totalParcelas: 1,
};

export function ContaDialog({ aberto, onFechar, contaInicial, onSalvo }: Props) {
  const [form, setForm] = useState<typeof DEFAULT>(DEFAULT);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');

  useEffect(() => {
    if (contaInicial) {
      setForm({
        descricao: contaInicial.descricao,
        valor: contaInicial.valor,
        dataVencimento: contaInicial.dataVencimento ?? new Date().toISOString().split('T')[0],
        status: contaInicial.status,
        categoria: contaInicial.categoria,
        observacoes: contaInicial.observacoes ?? '',
        recorrente: contaInicial.recorrente,
        parcelado: contaInicial.parcelado,
        totalParcelas: contaInicial.totalParcelas ?? 1,
      });
    } else {
      setForm(DEFAULT);
    }
    setErro('');
  }, [contaInicial, aberto]);

  function set<K extends keyof typeof DEFAULT>(key: K, value: (typeof DEFAULT)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function salvar(e: React.FormEvent) {
    e.preventDefault();
    if (!form.descricao || !form.valor) {
      setErro('Preencha descrição e valor.');
      return;
    }
    setCarregando(true);
    setErro('');
    try {
      const url = contaInicial ? `/api/contas/${contaInicial.id}` : '/api/contas';
      const method = contaInicial ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          descricao: form.descricao,
          valor: Number(form.valor),
          dataVencimento: form.dataVencimento || null,
          categoria: form.categoria,
          observacoes: form.observacoes ?? '',
          status: form.status ?? 'pendente',
          recorrente: form.recorrente ?? false,
          intervaloRecorrencia: form.recorrente ? 'mensal' : null,
          recorrenciaAtiva: form.recorrente ?? false,
          parcelado: form.parcelado ?? false,
          totalParcelas: form.parcelado ? Number(form.totalParcelas) : null,
          parcelaAtual: form.parcelado ? 1 : null,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.erro ?? 'Erro ao salvar');
      }
      onSalvo();
    } catch (err: any) {
      setErro(err.message ?? 'Erro inesperado');
    } finally {
      setCarregando(false);
    }
  }

  return (
    <Dialog.Root open={aberto} onOpenChange={(open) => !open && onFechar()}>
      <AnimatePresence>
        {aberto && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
              />
            </Dialog.Overlay>

            <Dialog.Content asChild>
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg max-h-[90vh] overflow-y-auto"
              >
                <div className="glass-panel border border-white/10 shadow-2xl p-6 m-4">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-6">
                    <Dialog.Title className="text-xl font-display font-semibold text-white">
                      {contaInicial ? 'Editar Conta' : 'Nova Conta'}
                    </Dialog.Title>
                    <Dialog.Close className="p-1.5 rounded-lg text-text-muted hover:text-white hover:bg-white/10 transition-all">
                      <X className="w-5 h-5" />
                    </Dialog.Close>
                  </div>

                  <form onSubmit={salvar} className="flex flex-col gap-4">
                    {/* Descrição */}
                    <div>
                      <label className="flex items-center gap-2 text-sm text-text-secondary mb-1.5">
                        <FileText className="w-4 h-4" /> Descrição *
                      </label>
                      <input
                        type="text"
                        value={form.descricao ?? ''}
                        onChange={(e) => set('descricao', e.target.value)}
                        placeholder="Ex: Conta de Luz, Netflix..."
                        className="w-full"
                        required
                      />
                    </div>

                    {/* Valor + Vencimento */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="flex items-center gap-2 text-sm text-text-secondary mb-1.5">
                          <DollarSign className="w-4 h-4" /> Valor (R$) *
                        </label>
                        <input
                          type="number"
                          value={form.valor ?? ''}
                          onChange={(e) => set('valor', parseFloat(e.target.value) || 0)}
                          placeholder="0,00"
                          step="0.01"
                          min="0"
                          className="w-full"
                          required
                        />
                      </div>
                      <div>
                        <label className="flex items-center gap-2 text-sm text-text-secondary mb-1.5">
                          <Calendar className="w-4 h-4" /> Vencimento
                        </label>
                        <input
                          type="date"
                          value={form.dataVencimento ?? ''}
                          onChange={(e) => set('dataVencimento', e.target.value)}
                          className="w-full"
                        />
                      </div>
                    </div>

                    {/* Categoria + Status */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="flex items-center gap-2 text-sm text-text-secondary mb-1.5">
                          <Tag className="w-4 h-4" /> Categoria
                        </label>
                        <select
                          value={form.categoria ?? 'outros'}
                          onChange={(e) => set('categoria', e.target.value)}
                          className="w-full"
                        >
                          {CATEGORIAS.map((cat) => (
                            <option key={cat.valor} value={cat.valor}>
                              {cat.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="text-sm text-text-secondary mb-1.5 block">Status</label>
                        <select
                          value={form.status ?? 'pendente'}
                          onChange={(e) => set('status', e.target.value)}
                          className="w-full"
                        >
                          <option value="pendente">Pendente</option>
                          <option value="pago">Pago</option>
                        </select>
                      </div>
                    </div>

                    {/* Opções especiais */}
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={form.recorrente ?? false}
                          onChange={(e) => set('recorrente', e.target.checked)}
                          className="w-4 h-4 accent-amber-500"
                        />
                        <span className="flex items-center gap-1 text-sm text-text-secondary">
                          <RefreshCw className="w-3.5 h-3.5" /> Recorrente (mensal)
                        </span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={form.parcelado ?? false}
                          onChange={(e) => set('parcelado', e.target.checked)}
                          className="w-4 h-4 accent-amber-500"
                        />
                        <span className="flex items-center gap-1 text-sm text-text-secondary">
                          <CreditCard className="w-3.5 h-3.5" /> Parcelado
                        </span>
                      </label>
                    </div>

                    {/* Parcelas */}
                    {form.parcelado && (
                      <div>
                        <label className="text-sm text-text-secondary mb-1.5 block">
                          Número de parcelas
                        </label>
                        <input
                          type="number"
                          value={form.totalParcelas ?? 2}
                          onChange={(e) => set('totalParcelas', parseInt(e.target.value) || 2)}
                          min="2"
                          max="60"
                          className="w-full"
                        />
                        {form.totalParcelas && form.valor && (
                          <p className="text-xs text-text-muted mt-1">
                            {form.totalParcelas}x de{' '}
                            <span className="text-accent font-medium">
                              {formatCurrency(Number(form.valor) / form.totalParcelas)}
                            </span>
                          </p>
                        )}
                      </div>
                    )}

                    {/* Observações */}
                    <div>
                      <label className="text-sm text-text-secondary mb-1.5 block">Observações</label>
                      <textarea
                        value={form.observacoes ?? ''}
                        onChange={(e) => set('observacoes', e.target.value)}
                        placeholder="Anotações opcionais..."
                        rows={2}
                        className="w-full resize-none"
                      />
                    </div>

                    {/* Erro */}
                    {erro && (
                      <p className="text-status-danger text-sm bg-status-danger/10 border border-status-danger/20 rounded-lg px-3 py-2">
                        {erro}
                      </p>
                    )}

                    {/* Botões */}
                    <div className="flex gap-3 pt-2">
                      <button
                        type="button"
                        onClick={onFechar}
                        className="flex-1 glass-panel py-2.5 text-text-secondary hover:text-white transition-colors rounded-xl border border-white/10"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        disabled={carregando}
                        className="flex-1 btn-gold flex items-center justify-center gap-2 py-2.5 disabled:opacity-50"
                      >
                        <Save className="w-4 h-4" />
                        {carregando ? 'Salvando...' : contaInicial ? 'Salvar alterações' : 'Criar conta'}
                      </button>
                    </div>
                  </form>
                </div>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}

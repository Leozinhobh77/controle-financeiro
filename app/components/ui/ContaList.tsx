'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Calendar, CheckCircle, Clock } from 'lucide-react';
import { format, isPast, isToday } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Conta {
  id: string;
  descricao: string;
  valor: number;
  dataVencimento: string | null;
  status: 'pendente' | 'pago' | 'atrasado';
}

const listVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.4,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 100 } },
};

export function ContaList({ contas }: { contas: Conta[] }) {
  const getStatusColor = (status: string, data: string | null) => {
    if (status === 'pago') return 'text-status-success bg-status-success/10 border-status-success/20';
    if (data && isPast(new Date(data)) && !isToday(new Date(data))) {
      return 'text-status-danger bg-status-danger/10 border-status-danger/20';
    }
    return 'text-accent bg-accent/10 border-accent/20';
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatData = (dataOriginal: string | null) => {
    if (!dataOriginal) return 'Sem Vencimento';
    const d = new Date(dataOriginal);
    if (isToday(d)) return 'Vence Hoje';
    return format(d, "dd 'de' MMM", { locale: ptBR });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="glass-panel p-6 shadow-[0_0_40px_rgba(0,0,0,0.5)] flex flex-col h-full"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-display font-semibold text-white">Próximos Vencimentos</h3>
          <p className="text-sm text-text-muted">Contas que exigem atenção</p>
        </div>
        <Link href="/contas" className="text-sm text-accent hover:text-accent-light transition-colors font-medium">
          Ver todas
        </Link>
      </div>

      <motion.div
        variants={listVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-col gap-3 overflow-y-auto pr-2 custom-scrollbar flex-1"
      >
        {contas.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-text-muted">
            <CheckCircle className="w-12 h-12 mb-2 opacity-50 text-status-success" />
            <p>Tudo em dia!</p>
          </div>
        ) : (
          contas.map((conta) => {
            const isAtrasado = conta.dataVencimento && isPast(new Date(conta.dataVencimento)) && !isToday(new Date(conta.dataVencimento));
            const Icon = conta.status === 'pago' ? CheckCircle : isAtrasado ? Clock : Calendar;

            return (
              <motion.div
                key={conta.id}
                variants={itemVariants}
                whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.05)' }}
                className="glass-panel !rounded-lg !bg-surface/40 flex items-center justify-between p-4 transition-all cursor-pointer group hover:!bg-white/5"
              >
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-lg border ${getStatusColor(conta.status, conta.dataVencimento)} group-hover:scale-110 transition-transform`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-medium text-text-primary group-hover:text-accent transition-colors">{conta.descricao}</h4>
                    <p className="text-sm text-text-muted">{formatData(conta.dataVencimento)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-bold font-display text-white">{formatCurrency(conta.valor)}</span>
                  {conta.status === 'pendente' && (
                    <button className="block text-xs text-text-muted hover:text-status-success transition-colors w-full text-right mt-1">
                      Marcar pago
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })
        )}
      </motion.div>
    </motion.div>
  );
}

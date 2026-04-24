'use client';

import { useState, useTransition } from 'react';
import { motion } from 'framer-motion';
import { Save, User, DollarSign, Info, CheckCircle2, Download } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { exportarCSV } from '@/lib/utils/financeiro';

interface Config {
  id: string;
  nomeUsuario: string;
  saldoInicial: number;
  moeda: string;
  tema: string;
}

interface Props {
  config: Config;
}

export function ConfiguracoesClient({ config }: Props) {
  const router = useRouter();
  const [nome, setNome] = useState(config.nomeUsuario);
  const [saldo, setSaldo] = useState(config.saldoInicial.toString());
  const [salvo, setSalvo] = useState(false);
  const [erro, setErro] = useState('');
  const [isPending, startTransition] = useTransition();

  async function salvar(e: React.FormEvent) {
    e.preventDefault();
    setErro('');
    try {
      const res = await fetch('/api/config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nomeUsuario: nome, saldoInicial: parseFloat(saldo) || 0 }),
      });
      if (!res.ok) throw new Error('Erro ao salvar');
      setSalvo(true);
      setTimeout(() => setSalvo(false), 3000);
      startTransition(() => router.refresh());
    } catch {
      setErro('Não foi possível salvar. Tente novamente.');
    }
  }

  async function exportarTudo() {
    const res = await fetch('/api/contas');
    const contas = await res.json();
    exportarCSV(contas);
  }

  return (
    <div className="flex flex-col gap-8 max-w-2xl">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-display text-white">Configurações</h1>
        <p className="text-text-muted mt-1 text-sm">Personalize seu app de controle financeiro</p>
      </div>

      {/* Formulário */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel p-6"
      >
        <h2 className="text-lg font-display font-semibold text-white mb-6 flex items-center gap-2">
          <User className="w-5 h-5 text-accent" />
          Perfil
        </h2>

        <form onSubmit={salvar} className="flex flex-col gap-4">
          <div>
            <label className="text-sm text-text-secondary mb-1.5 block">Seu nome</label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Como você quer ser chamado?"
              className="w-full"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm text-text-secondary mb-1.5">
              <DollarSign className="w-4 h-4" />
              Saldo inicial (R$)
            </label>
            <input
              type="number"
              value={saldo}
              onChange={(e) => setSaldo(e.target.value)}
              placeholder="0,00"
              step="0.01"
              className="w-full"
            />
            <p className="text-xs text-text-muted mt-1 flex items-center gap-1">
              <Info className="w-3 h-3" />
              Usado para calcular seu saldo disponível no dashboard
            </p>
          </div>

          {erro && (
            <p className="text-status-danger text-sm bg-status-danger/10 border border-status-danger/20 rounded-lg px-3 py-2">
              {erro}
            </p>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="btn-gold flex items-center justify-center gap-2 py-2.5 disabled:opacity-50 self-start px-6"
          >
            {salvo ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                Salvo!
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                {isPending ? 'Salvando...' : 'Salvar configurações'}
              </>
            )}
          </button>
        </form>
      </motion.div>

      {/* Exportação */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-panel p-6"
      >
        <h2 className="text-lg font-display font-semibold text-white mb-2 flex items-center gap-2">
          <Download className="w-5 h-5 text-accent" />
          Exportar Dados
        </h2>
        <p className="text-text-muted text-sm mb-4">
          Baixe todas as suas contas em formato CSV para usar em Excel ou Google Sheets.
        </p>
        <button
          onClick={exportarTudo}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl glass-panel border border-white/10 text-text-secondary hover:text-white hover:border-accent/40 transition-all text-sm"
        >
          <Download className="w-4 h-4" />
          Exportar todas as contas (.csv)
        </button>
      </motion.div>

      {/* Sobre */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-panel p-6 border border-accent/10"
      >
        <h2 className="text-lg font-display font-semibold text-white mb-3 flex items-center gap-2">
          <Info className="w-5 h-5 text-accent" />
          Sobre o App
        </h2>
        <div className="flex flex-col gap-2 text-sm">
          <div className="flex justify-between">
            <span className="text-text-muted">Versão</span>
            <span className="text-white font-medium">2.0 — Obsidian & Gold</span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-muted">Stack</span>
            <span className="text-white font-medium">Next.js 16 + Prisma + SQLite</span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-muted">Dados</span>
            <span className="text-white font-medium">100% local — nenhum dado enviado</span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-muted">Design</span>
            <span className="text-accent font-medium">Forge v5.2 — Agente Forge</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

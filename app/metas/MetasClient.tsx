'use client';

import { motion } from 'framer-motion';
import { ResponsiveContainer, Tooltip, PieChart, Pie, Cell } from 'recharts';
import { categoriaCor, categoriaLabel, formatCurrency } from '@/lib/utils/financeiro';

interface GastosCat {
  cat: string;
  total: number;
}

interface Props {
  gastos: GastosCat[];
  gastosPagos: GastosCat[];
  totalGeral: number;
}

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="glass-panel p-3 border border-white/10 text-sm">
      <p className="font-semibold text-white">{categoriaLabel(d.cat)}</p>
      <p className="text-text-muted">{formatCurrency(d.total)}</p>
    </div>
  );
};

export function MetasClient({ gastos, gastosPagos, totalGeral }: Props) {
  const todosCats = Array.from(
    new Set([...gastos.map((g) => g.cat), ...gastosPagos.map((g) => g.cat)])
  );

  const dadosCombinados = todosCats.map((cat) => {
    const pendente = gastos.find((g) => g.cat === cat)?.total ?? 0;
    const pago = gastosPagos.find((g) => g.cat === cat)?.total ?? 0;
    return { cat, pendente, pago, total: pendente + pago };
  }).sort((a, b) => b.total - a.total);

  const pieData = gastos.map((g) => ({ ...g, fill: categoriaCor(g.cat) }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Pizza de categorias pendentes */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-panel p-6"
      >
        <h3 className="text-lg font-display font-semibold text-white mb-1">Distribuição Pendente</h3>
        <p className="text-text-muted text-sm mb-4">Por categoria — valores a pagar</p>

        {pieData.length > 0 ? (
          <div className="flex items-center gap-6">
            <div className="w-48 h-48 flex-shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="total"
                  >
                    {pieData.map((entry, i) => (
                      <Cell key={i} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-col gap-2 flex-1">
              {pieData.slice(0, 6).map(({ cat, total }) => (
                <div key={cat} className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: categoriaCor(cat) }} />
                    <span className="text-sm text-text-secondary">{categoriaLabel(cat)}</span>
                  </div>
                  <span className="text-sm font-medium text-white">{formatCurrency(total)}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-40 text-text-muted">
            <p className="text-status-success font-medium">✓ Tudo em dia!</p>
            <p className="text-sm mt-1">Sem contas pendentes</p>
          </div>
        )}
      </motion.div>

      {/* Barras de progresso por categoria */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-panel p-6"
      >
        <h3 className="text-lg font-display font-semibold text-white mb-1">Progresso por Categoria</h3>
        <p className="text-text-muted text-sm mb-4">Quanto já foi pago em cada categoria</p>

        <div className="flex flex-col gap-4">
          {dadosCombinados.map(({ cat, pendente, pago, total }) => {
            const pct = total > 0 ? (pago / total) * 100 : 0;
            return (
              <div key={cat}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium" style={{ color: categoriaCor(cat) }}>
                    {categoriaLabel(cat)}
                  </span>
                  <span className="text-xs text-text-muted">
                    {formatCurrency(pago)} / {formatCurrency(total)}
                  </span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.8, delay: 0.1 }}
                    className="h-2 rounded-full"
                    style={{ backgroundColor: categoriaCor(cat) }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}

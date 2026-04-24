import { addMonths, format, startOfMonth, endOfMonth } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export interface ContaBasica {
  id: string;
  descricao: string;
  valor: number;
  dataVencimento: string | null;
  status: string;
  categoria: string;
}

export function calcularScore(contas: ContaBasica[]): number {
  if (contas.length === 0) return 100;

  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  const pendentes = contas.filter((c) => c.status === 'pendente');

  const atrasadas = pendentes.filter((c) => {
    if (!c.dataVencimento) return false;
    const d = new Date(c.dataVencimento);
    d.setHours(0, 0, 0, 0);
    return d < hoje;
  });

  const vencendoHoje = pendentes.filter((c) => {
    if (!c.dataVencimento) return false;
    const d = new Date(c.dataVencimento);
    d.setHours(0, 0, 0, 0);
    return d.getTime() === hoje.getTime();
  });

  let score = 100;
  score -= atrasadas.length * 15;
  score -= vencendoHoje.length * 5;

  const pct = pendentes.length / contas.length;
  if (pct > 0.7) score -= 10;
  else if (pct > 0.5) score -= 5;

  return Math.max(0, Math.min(100, score));
}

export function scoreLabel(score: number): { label: string; cor: string } {
  if (score >= 85) return { label: 'Excelente', cor: '#10B981' };
  if (score >= 65) return { label: 'Bom', cor: '#F59E0B' };
  if (score >= 40) return { label: 'Atenção', cor: '#F97316' };
  return { label: 'Crítico', cor: '#EF4444' };
}

export function gerarProjecaoFluxo(contas: ContaBasica[]) {
  const hoje = new Date();
  const meses = [];

  for (let i = -1; i <= 4; i++) {
    const mes = addMonths(hoje, i);
    const inicio = startOfMonth(mes);
    const fim = endOfMonth(mes);

    const contasMes = contas.filter((c) => {
      if (!c.dataVencimento) return false;
      const d = new Date(c.dataVencimento);
      return d >= inicio && d <= fim;
    });

    const totalDespesas = contasMes.reduce((acc, c) => acc + c.valor, 0);
    const totalPagas = contasMes
      .filter((c) => c.status === 'pago')
      .reduce((acc, c) => acc + c.valor, 0);

    meses.push({
      name: format(mes, 'MMM', { locale: ptBR }),
      despesas: Math.round(totalDespesas),
      pagas: Math.round(totalPagas),
    });
  }

  return meses;
}

export function calcularAlertas(contas: ContaBasica[]) {
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  const em7Dias = new Date(hoje);
  em7Dias.setDate(em7Dias.getDate() + 7);

  const pendentes = contas.filter((c) => c.status === 'pendente' && c.dataVencimento);

  const vencendoHoje = pendentes.filter((c) => {
    const d = new Date(c.dataVencimento!);
    d.setHours(0, 0, 0, 0);
    return d.getTime() === hoje.getTime();
  });

  const proximos7Dias = pendentes.filter((c) => {
    const d = new Date(c.dataVencimento!);
    d.setHours(0, 0, 0, 0);
    return d > hoje && d <= em7Dias;
  });

  const atrasadas = pendentes.filter((c) => {
    const d = new Date(c.dataVencimento!);
    d.setHours(0, 0, 0, 0);
    return d < hoje;
  });

  return { vencendoHoje, proximos7Dias, atrasadas };
}

export function gastosPorCategoria(contas: ContaBasica[]) {
  const mapa: Record<string, number> = {};
  contas.forEach((c) => {
    mapa[c.categoria] = (mapa[c.categoria] || 0) + c.valor;
  });
  return Object.entries(mapa)
    .map(([cat, total]) => ({ cat, total }))
    .sort((a, b) => b.total - a.total);
}

export const CATEGORIAS = [
  { valor: 'moradia', label: 'Moradia', cor: '#6366F1' },
  { valor: 'alimentacao', label: 'Alimentação', cor: '#10B981' },
  { valor: 'transporte', label: 'Transporte', cor: '#3B82F6' },
  { valor: 'saude', label: 'Saúde', cor: '#EC4899' },
  { valor: 'educacao', label: 'Educação', cor: '#8B5CF6' },
  { valor: 'lazer', label: 'Lazer', cor: '#F59E0B' },
  { valor: 'assinaturas', label: 'Assinaturas', cor: '#14B8A6' },
  { valor: 'trabalho', label: 'Trabalho', cor: '#22C55E' },
  { valor: 'outros', label: 'Outros', cor: '#6B7280' },
];

export function categoriaLabel(cat: string): string {
  return CATEGORIAS.find((c) => c.valor === cat)?.label ?? cat;
}

export function categoriaCor(cat: string): string {
  return CATEGORIAS.find((c) => c.valor === cat)?.cor ?? '#6B7280';
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}

export function exportarCSV(contas: ContaBasica[]): void {
  const header = 'Descrição,Valor,Vencimento,Categoria,Status\n';
  const rows = contas
    .map(
      (c) =>
        `"${c.descricao}",${c.valor},${c.dataVencimento ?? ''},${categoriaLabel(c.categoria)},${c.status}`
    )
    .join('\n');

  const blob = new Blob(['\uFEFF' + header + rows], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `contas-financeiro-${new Date().toISOString().split('T')[0]}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

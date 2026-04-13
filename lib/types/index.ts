// Tipos principais do aplicativo
// Baseado em: docs/SPEC.md - Banco de Dados

export interface Conta {
  id: string;
  descricao: string;
  valor: number;
  dataVencimento: string; // ISO 8601
  categoria: string;
  status: 'pendente' | 'pago' | 'atrasado';
  observacoes?: string;

  // Parcelamento
  isParcelada: boolean;
  numeroParcelas?: number;
  parcelaAtual?: number;

  // Recorrência
  isRecorrente: boolean;
  frequencia?: 'semanal' | 'mensal' | 'anual';
  proximaOcorrencia?: string; // ISO 8601

  // Controle
  criadoEm: string; // ISO 8601
  atualizadoEm: string; // ISO 8601
}

export interface Categoria {
  id: string;
  nome: string;
  cor: string; // hex
  icone?: string;
  ordem: number;
}

export interface Config {
  tema: 'dark' | 'light';
  moeda: string; // padrão: BRL
  saldoInicial: number;
  nomeUsuario?: string;
  atualizadoEm: string; // ISO 8601
}

export interface Estatisticas {
  totalPendente: number;
  totalAtrasado: number;
  totalPago: number;
  proximasContas: Conta[];
  contasAtrasadas: Conta[];
  scoreFinanceiro: number; // 0-100
}

export interface FiltroContas {
  status?: Conta['status'];
  categoria?: string;
  busca?: string;
  mes?: number;
  ano?: number;
}

// Utilitários de formatação

/**
 * Formata um número como moeda BRL
 * @example formatarMoeda(1234.56) => "R$ 1.234,56"
 */
export function formatarMoeda(valor: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(valor);
}

/**
 * Formata uma data ISO para dd/MM/yyyy
 * @example formatarData('2026-04-09') => "09/04/2026"
 */
export function formatarData(dataIso: string): string {
  const date = new Date(dataIso + 'T00:00:00Z');
  return new Intl.DateTimeFormat('pt-BR').format(date);
}

/**
 * Formata uma data ISO como "9 de abril de 2026"
 * @example formatarDataCompletaPortugues('2026-04-09') => "9 de abril de 2026"
 */
export function formatarDataCompletaPortugues(dataIso: string): string {
  const date = new Date(dataIso + 'T00:00:00Z');
  return new Intl.DateTimeFormat('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

/**
 * Calcula quantos dias faltam até uma data
 * @returns número de dias (negativo se passado)
 */
export function diasFaltando(dataVencimento: string): number {
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  const vencimento = new Date(dataVencimento + 'T00:00:00Z');

  const diferenca = vencimento.getTime() - hoje.getTime();
  return Math.ceil(diferenca / (1000 * 60 * 60 * 24));
}

/**
 * Gera ID único
 */
export function gerarId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

import { z } from 'zod';

/**
 * Schema de validação para Conta
 * Segue a especificação SPEC.md com Zod
 */
export const ContaCreateSchema = z.object({
  descricao: z.string().min(3, 'Descrição deve ter pelo menos 3 caracteres'),
  valor: z.number().positive('Valor deve ser positivo'),
  dataVencimento: z.string().optional().nullable(),
  dataPagamento: z.string().optional().nullable(),
  categoria: z.string().default('outros'),
  observacoes: z.string().optional().default(''),
  status: z.enum(['pendente', 'pago', 'atrasado']).default('pendente'),
  recorrente: z.boolean().default(false),
  intervaloRecorrencia: z.string().optional().nullable(),
  recorrenciaAtiva: z.boolean().default(false),
  parcelado: z.boolean().default(false),
  totalParcelas: z.number().int().positive().optional().nullable(),
  parcelaAtual: z.number().int().positive().optional().nullable(),
  grupoParcelamento: z.string().optional().nullable(),
});

export const ContaUpdateSchema = ContaCreateSchema.partial();

export type ContaCreate = z.infer<typeof ContaCreateSchema>;
export type ContaUpdate = z.infer<typeof ContaUpdateSchema>;

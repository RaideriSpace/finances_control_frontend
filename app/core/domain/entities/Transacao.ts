/**
 * @file Transacao.ts
 * @description Entidade de domínio para Transação
 * Representa uma transação financeira no sistema
 */

export interface Transacao {
  id: string;
  compra: string;
  estabelecimento: string;
  razao_social: string;
  acao: string;
  tipo_1: string;
  tipo_2: string | null;
  classificacao: string;
  cartao: string;
  tipo: 'debito' | 'credito';
  parcelamento: number;
  parcela: number;
  valor: number;
  data_inicio: string;
  data_pagamento: string;
  data_fim: string;
}

export interface Saldo {
  conta: string;
  valor: number;
}

export interface Fatura {
  cartao: string;
  valor: number;
}

export interface Resumo {
  label: string;
  valor: number;
}

export type TransacaoTipo = 'debito' | 'credito';
export type TransacaoAcao = 'compra' | 'transferencia' | 'deposito' | 'saque';

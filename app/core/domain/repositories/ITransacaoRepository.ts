/**
 * @file ITransacaoRepository.ts
 * @description Interface de repositório para operações com Transações
 * Define o contrato para acesso a dados de transações
 */

import { Transacao, Saldo, Fatura, Resumo } from '../entities/Transacao';

export interface ITransacaoRepository {
  /**
   * Obtém todas as transações
   */
  getTransacoes(): Promise<Transacao[]>;

  /**
   * Obtém transações filtradas por período
   */
  getTransacoesPorPeriodo(mes: string, ano: string): Promise<Transacao[]>;

  /**
   * Obtém uma transação específica
   */
  getTransacao(id: string): Promise<Transacao | null>;

  /**
   * Cria uma nova transação
   */
  criarTransacao(transacao: Omit<Transacao, 'id'>): Promise<Transacao>;

  /**
   * Atualiza uma transação existente
   */
  atualizarTransacao(id: string, transacao: Partial<Transacao>): Promise<Transacao>;

  /**
   * Deleta uma transação
   */
  deletarTransacao(id: string): Promise<void>;

  /**
   * Obtém saldos por conta
   */
  getSaldos(): Promise<Saldo[]>;

  /**
   * Obtém faturas por cartão
   */
  getFaturas(): Promise<Fatura[]>;

  /**
   * Obtém resumo financeiro
   */
  getResumo(): Promise<Resumo[]>;
}

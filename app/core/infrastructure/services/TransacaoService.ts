/**
 * @file TransacaoService.ts
 * @description Serviço de aplicação para operações com Transações
 * Implementa a lógica de negócio e orquestra repositórios
 */

import { Transacao, Saldo, Fatura, Resumo } from '@/app/core/domain/entities/Transacao';
import { ITransacaoRepository } from '@/app/core/domain/repositories/ITransacaoRepository';

export class TransacaoService {
  constructor(private repository: ITransacaoRepository) {}

  async obterTodasTransacoes(): Promise<Transacao[]> {
    return this.repository.getTransacoes();
  }

  async obterTransacoesPorPeriodo(mes: string, ano: string): Promise<Transacao[]> {
    return this.repository.getTransacoesPorPeriodo(mes, ano);
  }

  async obterTransacao(id: string): Promise<Transacao | null> {
    return this.repository.getTransacao(id);
  }

  async criarTransacao(transacao: Omit<Transacao, 'id'>): Promise<Transacao> {
    return this.repository.criarTransacao(transacao);
  }

  async atualizarTransacao(id: string, transacao: Partial<Transacao>): Promise<Transacao> {
    return this.repository.atualizarTransacao(id, transacao);
  }

  async deletarTransacao(id: string): Promise<void> {
    return this.repository.deletarTransacao(id);
  }

  async obterSaldos(): Promise<Saldo[]> {
    return this.repository.getSaldos();
  }

  async obterFaturas(): Promise<Fatura[]> {
    return this.repository.getFaturas();
  }

  async obterResumo(): Promise<Resumo[]> {
    return this.repository.getResumo();
  }

  /**
   * Calcula a cor do valor baseado em seu sinal
   */
  obterCorValor(valor: number): 'positive' | 'negative' | 'neutral' {
    if (valor > 0) return 'positive';
    if (valor < 0) return 'negative';
    return 'neutral';
  }

  /**
   * Formata valor monetário
   */
  formatarValor(valor: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(valor);
  }
}

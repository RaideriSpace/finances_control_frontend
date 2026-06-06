/**
 * @file SupabaseTransacaoRepository.ts
 * @description Implementação do repositório de Transação usando Supabase
 * Fornece acesso aos dados de transações no banco de dados
 */

import { createClient } from '@supabase/supabase-js';
import { Transacao, Saldo, Fatura, Resumo } from '@/app/core/domain/entities/Transacao';
import { ITransacaoRepository } from '@/app/core/domain/repositories/ITransacaoRepository';

export class SupabaseTransacaoRepository implements ITransacaoRepository {
  private supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  );

  async getTransacoes(): Promise<Transacao[]> {
    const { data, error } = await this.supabase
      .from('transacoes')
      .select('*')
      .order('data_pagamento', { ascending: false });

    if (error) throw new Error(`Erro ao buscar transações: ${error.message}`);
    return data || [];
  }

  async getTransacoesPorPeriodo(mes: string, ano: string): Promise<Transacao[]> {
    const { data, error } = await this.supabase
      .from('transacoes')
      .select('*')
      .filter('data_pagamento', 'gte', `${ano}-${mes}-01`)
      .filter('data_pagamento', 'lt', `${ano}-${parseInt(mes) + 1}-01`)
      .order('data_pagamento', { ascending: false });

    if (error) throw new Error(`Erro ao buscar transações por período: ${error.message}`);
    return data || [];
  }

  async getTransacao(id: string): Promise<Transacao | null> {
    const { data, error } = await this.supabase
      .from('transacoes')
      .select('*')
      .eq('id', id)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw new Error(`Erro ao buscar transação: ${error.message}`);
    }
    return data || null;
  }

  async criarTransacao(transacao: Omit<Transacao, 'id'>): Promise<Transacao> {
    const { data, error } = await this.supabase
      .from('transacoes')
      .insert([transacao])
      .select()
      .single();

    if (error) throw new Error(`Erro ao criar transação: ${error.message}`);
    return data;
  }

  async atualizarTransacao(id: string, transacao: Partial<Transacao>): Promise<Transacao> {
    const { data, error } = await this.supabase
      .from('transacoes')
      .update(transacao)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(`Erro ao atualizar transação: ${error.message}`);
    return data;
  }

  async deletarTransacao(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('transacoes')
      .delete()
      .eq('id', id);

    if (error) throw new Error(`Erro ao deletar transação: ${error.message}`);
  }

  async getSaldos(): Promise<Saldo[]> {
    const { data, error } = await this.supabase
      .from('saldos')
      .select('*');

    if (error) throw new Error(`Erro ao buscar saldos: ${error.message}`);
    return data || [];
  }

  async getFaturas(): Promise<Fatura[]> {
    const { data, error } = await this.supabase
      .from('faturas')
      .select('*');

    if (error) throw new Error(`Erro ao buscar faturas: ${error.message}`);
    return data || [];
  }

  async getResumo(): Promise<Resumo[]> {
    const { data, error } = await this.supabase
      .from('resumos')
      .select('*');

    if (error) throw new Error(`Erro ao buscar resumo: ${error.message}`);
    return data || [];
  }
}

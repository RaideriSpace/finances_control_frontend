/**
 * @file useTransacoes.ts
 * @description Hook customizado para gerenciar estado de transações
 * Fornece acesso aos dados e operações de transações de forma reativa
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { Transacao, Saldo, Fatura, Resumo } from '@/app/core/domain/entities/Transacao';
import { TransacaoService } from '@/app/core/infrastructure/services/TransacaoService';
import { SupabaseTransacaoRepository } from '@/app/core/infrastructure/repositories/SupabaseTransacaoRepository';

interface UseTransacoesState {
  transacoes: Transacao[];
  saldos: Saldo[];
  faturas: Fatura[];
  resumos: Resumo[];
  loading: boolean;
  error: Error | null;
}

const repository = new SupabaseTransacaoRepository();
const service = new TransacaoService(repository);

export function useTransacoes() {
  const [state, setState] = useState<UseTransacoesState>({
    transacoes: [],
    saldos: [],
    faturas: [],
    resumos: [],
    loading: true,
    error: null,
  });

  const carregarDados = useCallback(async () => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      const [transacoes, saldos, faturas, resumos] = await Promise.all([
        service.obterTodasTransacoes(),
        service.obterSaldos(),
        service.obterFaturas(),
        service.obterResumo(),
      ]);

      setState({
        transacoes,
        saldos,
        faturas,
        resumos,
        loading: false,
        error: null,
      });
    } catch (error) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error : new Error('Erro desconhecido'),
      }));
    }
  }, []);

  useEffect(() => {
    carregarDados();
  }, [carregarDados]);

  const criarTransacao = useCallback(
    async (transacao: Omit<Transacao, 'id'>) => {
      try {
        const novaTransacao = await service.criarTransacao(transacao);
        setState((prev) => ({
          ...prev,
          transacoes: [novaTransacao, ...prev.transacoes],
        }));
        return novaTransacao;
      } catch (error) {
        const err = error instanceof Error ? error : new Error('Erro ao criar transação');
        setState((prev) => ({ ...prev, error: err }));
        throw err;
      }
    },
    []
  );

  const atualizarTransacao = useCallback(
    async (id: string, transacao: Partial<Transacao>) => {
      try {
        const transacaoAtualizada = await service.atualizarTransacao(id, transacao);
        setState((prev) => ({
          ...prev,
          transacoes: prev.transacoes.map((t) => (t.id === id ? transacaoAtualizada : t)),
        }));
        return transacaoAtualizada;
      } catch (error) {
        const err = error instanceof Error ? error : new Error('Erro ao atualizar transação');
        setState((prev) => ({ ...prev, error: err }));
        throw err;
      }
    },
    []
  );

  const deletarTransacao = useCallback(
    async (id: string) => {
      try {
        await service.deletarTransacao(id);
        setState((prev) => ({
          ...prev,
          transacoes: prev.transacoes.filter((t) => t.id !== id),
        }));
      } catch (error) {
        const err = error instanceof Error ? error : new Error('Erro ao deletar transação');
        setState((prev) => ({ ...prev, error: err }));
        throw err;
      }
    },
    []
  );

  return {
    ...state,
    carregarDados,
    criarTransacao,
    atualizarTransacao,
    deletarTransacao,
  };
}

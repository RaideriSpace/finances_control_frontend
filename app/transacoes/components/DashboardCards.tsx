'use client';

import { useMemo } from 'react';
import { Transacao } from '../../src/types/transacao.type';
import { formatarMoeda, obterClasseCorValor } from '@/app/core/presentation/utils/formatting';

interface DashboardCardsProps {
  data: Transacao[];
}

/**
 * @component DashboardCards
 * @description Exibe os cards de resumo financeiro considerando dados acumulados até o mês atual
 */
export function DashboardCards({ data }: DashboardCardsProps) {
  const hoje = new Date();
  const mesAtual = hoje.getMonth();
  const anoAtual = hoje.getFullYear();

  // Filtrar dados até o mês atual (inclusive)
  const dadosAteHoje = useMemo(() => {
    return data.filter(t => {
      const dataT = new Date(t.data_pagamento);
      return dataT.getFullYear() < anoAtual || 
             (dataT.getFullYear() === anoAtual && dataT.getMonth() <= mesAtual);
    });
  }, [data, mesAtual, anoAtual]);

  // Cálculos para Saldos (débito) - Acumulado
  const saldos = useMemo(() => {
    const accounts = ['picpay', 'inter', 'swile', 'outro'];
    return accounts.map((account) => {
      const total = dadosAteHoje.reduce((acc, t) => {
        if (t.cartao === account && t.tipo === 'debito') {
          const acoesSaida = ['pagamento', 'saque', 'transferência', 'compra'];
          return acoesSaida.includes(t.acao) ? acc - t.valor : acc + t.valor;
        }
        return acc;
      }, 0);
      return { account, total };
    });
  }, [dadosAteHoje]);

  // Cálculos para Faturas (crédito) - Acumulado
  const faturas = useMemo(() => {
    const accounts = ['picpay', 'inter', 'outro'];
    return accounts.map((account) => {
      const total = dadosAteHoje.reduce((acc, t) => {
        if (t.cartao === account && t.tipo === 'credito') {
          const acoesSaida = ['pagamento', 'saque', 'transferência', 'compra'];
          return acoesSaida.includes(t.acao) ? acc - t.valor : acc + t.valor;
        }
        return acc;
      }, 0);
      return { account, total };
    });
  }, [dadosAteHoje]);

  // Cálculos para Resumos (Mês Atual + Regras Específicas)
  const resumos = useMemo(() => {
    const transacoesMesAtual = data.filter(t => {
      const dataT = new Date(t.data_pagamento);
      return dataT.getMonth() === mesAtual && dataT.getFullYear() === anoAtual;
    });

    // Gasto do mês: soma tudo de negativo em débito do mês + os valores das faturas do mês
    const gastoDebitoNegativo = transacoesMesAtual.reduce((acc, t) => {
      if (t.tipo === 'debito' && t.valor > 0) {
        const acoesSaida = ['pagamento', 'saque', 'transferência', 'compra'];
        if (acoesSaida.includes(t.acao)) return acc + t.valor;
      }
      return acc;
    }, 0);

    // Faturas do mês atual
    const totalFaturasMes = faturas.reduce((acc, f) => acc + Math.abs(f.total), 0);
    const gastoDoMes = gastoDebitoNegativo + totalFaturasMes;

    // Previsão de saldo: valor fixo (3500 + 2152.5 + 1200) + depósitos extras (acumulado)
    const valorFixo = 3500 + 2152.5 + 1200;
    const depositosExtras = dadosAteHoje.reduce((acc, t) => {
      const estabelecimentosExcluidos = ['PROA', 'Swile', 'Uliving'];
      const acoesEntrada = ['depósito', 'rendimento', 'reembolso'];
      
      if (acoesEntrada.includes(t.acao) && t.estabelecimento && !estabelecimentosExcluidos.includes(t.estabelecimento)) {
        return acc + t.valor;
      }
      return acc;
    }, 0);

    const previsaoSaldo = valorFixo + depositosExtras;
    const restante = previsaoSaldo - gastoDoMes;

    return [
      { label: 'Gasto do mês', value: -gastoDoMes },
      { label: 'Previsão de saldo', value: restante }, // Ajustado para mostrar o saldo real previsto após gastos
      { label: 'Saldo Total', value: previsaoSaldo },
    ];
  }, [data, faturas, mesAtual, anoAtual, dadosAteHoje]);

  const getAccountLabel = (account: string): string => {
    const labels: Record<string, string> = {
      picpay: 'Picpay',
      inter: 'Inter',
      swile: 'Swile',
      outro: 'Outros',
    };
    return labels[account] || account;
  };

  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
      {/* Card Saldos */}
      <article className="card bg-white border-l-4 border-l-primary rounded-lg">
        <h3 className="font-space-grotesk font-bold text-xl text-slate-900 mb-6">Saldos</h3>
        <div className="space-y-4">
          {saldos.map((item) => (
            <div key={item.account} className="flex justify-between items-center pb-4 border-b border-slate-100 last:border-b-0">
              <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">{getAccountLabel(item.account)}</p>
              <p className={`text-lg font-bold ${obterClasseCorValor(item.total)}`}>{formatarMoeda(item.total)}</p>
            </div>
          ))}
        </div>
      </article>

      {/* Card Faturas */}
      <article className="card bg-white border-l-4 border-l-secondary rounded-lg">
        <h3 className="font-space-grotesk font-bold text-xl text-slate-900 mb-6">Faturas</h3>
        <div className="space-y-4">
          {faturas.map((item) => (
            <div key={item.account} className="flex justify-between items-center pb-4 border-b border-slate-100 last:border-b-0">
              <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">{getAccountLabel(item.account)}</p>
              <p className={`text-lg font-bold ${obterClasseCorValor(item.total)}`}>{formatarMoeda(item.total)}</p>
            </div>
          ))}
        </div>
      </article>

      {/* Card Resumos */}
      <article className="card bg-white border-l-4 border-l-tertiary rounded-lg">
        <h3 className="font-space-grotesk font-bold text-xl text-slate-900 mb-6">Resumos</h3>
        <div className="space-y-4">
          {resumos.map((item) => (
            <div key={item.label} className="flex justify-between items-center pb-4 border-b border-slate-100 last:border-b-0">
              <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">{item.label}</p>
              <p className={`text-lg font-bold ${obterClasseCorValor(item.value)}`}>{formatarMoeda(item.value)}</p>
            </div>
          ))}
        </div>
      </article>
    </section>
  );
}

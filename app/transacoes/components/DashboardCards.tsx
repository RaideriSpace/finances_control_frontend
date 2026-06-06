'use client';

import { useMemo } from 'react';
import { Transacao } from '../../src/types/transacao.type';
import { obterClasseCorValor } from '@/app/core/presentation/utils/formatting';

interface DashboardCardsProps {
  data: Transacao[];
}

/**
 * @component DashboardCards
 * @description Componente que exibe os cards de resumo financeiro
 * Mostra Saldos, Faturas e Resumos com cores dinâmicas (verde para positivo, vermelho para negativo)
 */
export function DashboardCards({ data }: DashboardCardsProps) {
  // Cálculos para Saldos (débito)
  const saldos = useMemo(() => {
    const accounts = ['picpay', 'inter', 'swile', 'outro'];
    return accounts.map((account) => {
      const total = data.reduce((acc, t) => {
        if (t.cartao === account && t.tipo === 'debito') {
          const acoesSaida = ['pagamento', 'saque', 'transferência', 'compra'];
          return acoesSaida.includes(t.acao) ? acc - t.valor : acc + t.valor;
        }
        return acc;
      }, 0);
      return { account, total };
    });
  }, [data]);

  // Cálculos para Faturas (crédito)
  const faturas = useMemo(() => {
    const accounts = ['picpay', 'inter', 'outro'];
    return accounts.map((account) => {
      const total = data.reduce((acc, t) => {
        if (t.cartao === account && t.tipo === 'credito') {
          const acoesSaida = ['pagamento', 'saque', 'transferência', 'compra'];
          return acoesSaida.includes(t.acao) ? acc - t.valor : acc + t.valor;
        }
        return acc;
      }, 0);
      return { account, total };
    });
  }, [data]);

  // Cálculos para Resumos
  const resumos = useMemo(() => {
    const gastoDoMes = data.reduce((acc, t) => {
      if (t.acao === 'compra' && t.tipo === 'credito') {
        return acc + t.valor;
      }
      return acc;
    }, 0);

    const previsaoSaldo = data.reduce((acc, t) => {
      if (t.tipo === 'credito') {
        const acoesSaida = ['pagamento', 'saque', 'transferência', 'compra'];
        return acoesSaida.includes(t.acao) ? acc - t.valor : acc + t.valor;
      }
      return acc;
    }, 0);

    const restante = data.reduce((acc, t) => {
      if (t.tipo === 'debito') {
        const acoesSaida = ['pagamento', 'saque', 'transferência', 'compra'];
        return acoesSaida.includes(t.acao) ? acc - t.valor : acc + t.valor;
      }
      return acc;
    }, 0);

    return [
      { label: 'Gasto do mês', value: gastoDoMes },
      { label: 'Previsão de saldo', value: previsaoSaldo },
      { label: 'Restante', value: restante },
    ];
  }, [data]);

  const getAccountLabel = (account: string): string => {
    const labels: Record<string, string> = {
      picpay: 'Picpay',
      inter: 'Inter',
      swile: 'Swile',
      outro: 'Outros',
    };
    return labels[account] || account;
  };

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
    <section 
      className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10"
      aria-label="Resumo financeiro"
    >
      {/* Card Saldos */}
      <article 
        className="card bg-white border-l-4 border-l-primary rounded-lg"
        role="region"
        aria-label="Saldos por conta"
      >
        <h3 className="font-space-grotesk font-bold text-xl text-slate-900 mb-6">
          Saldos
        </h3>
        <div className="space-y-4">
          {saldos.map((item) => (
            <div 
              key={item.account} 
              className="flex justify-between items-center pb-4 border-b border-slate-100 last:border-b-0"
            >
              <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                {getAccountLabel(item.account)}
              </p>
              <p className={`text-lg font-bold ${obterClasseCorValor(item.total)}`}>
                {formatCurrency(item.total)}
              </p>
            </div>
          ))}
        </div>
      </article>

      {/* Card Faturas */}
      <article 
        className="card bg-white border-l-4 border-l-secondary rounded-lg"
        role="region"
        aria-label="Faturas por cartão"
      >
        <h3 className="font-space-grotesk font-bold text-xl text-slate-900 mb-6">
          Faturas
        </h3>
        <div className="space-y-4">
          {faturas.map((item) => (
            <div 
              key={item.account} 
              className="flex justify-between items-center pb-4 border-b border-slate-100 last:border-b-0"
            >
              <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                {getAccountLabel(item.account)}
              </p>
              <p className={`text-lg font-bold ${obterClasseCorValor(item.total)}`}>
                {formatCurrency(item.total)}
              </p>
            </div>
          ))}
        </div>
      </article>

      {/* Card Resumos */}
      <article 
        className="card bg-white border-l-4 border-l-tertiary rounded-lg"
        role="region"
        aria-label="Resumo financeiro"
      >
        <h3 className="font-space-grotesk font-bold text-xl text-slate-900 mb-6">
          Resumos
        </h3>
        <div className="space-y-4">
          {resumos.map((item) => (
            <div 
              key={item.label} 
              className="flex justify-between items-center pb-4 border-b border-slate-100 last:border-b-0"
            >
              <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                {item.label}
              </p>
              <p className={`text-lg font-bold ${obterClasseCorValor(item.value)}`}>
                {formatCurrency(item.value)}
              </p>
            </div>
          ))}
        </div>
      </article>
    </section>
  );
}

'use client';

import { useMemo } from 'react';
import { IoClose } from 'react-icons/io5';
import { Transacao } from '../../src/types/transacao.type';
import { formatarMoeda, obterClasseCorValor } from '@/app/core/presentation/utils/formatting';

interface ModalResumoAnualProps {
  isOpen: boolean;
  onClose: () => void;
  data: Transacao[];
}

/**
 * @component ModalResumoAnual
 * @description Modal que exibe uma tabela com o resumo financeiro de todos os meses do ano
 */
export function ModalResumoAnual({ isOpen, onClose, data }: ModalResumoAnualProps) {
  const resumoMensal = useMemo(() => {
    const meses = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];

    return meses.map((nomeMes, index) => {
      const mesIndex = index + 1;
      const transacoesMes = data.filter(t => {
        const dataTransacao = new Date(t.data_pagamento);
        return dataTransacao.getMonth() + 1 === mesIndex;
      });

      // Gasto do Mês: Soma de todo valor negativo de débito
      const gastoMes = transacoesMes.reduce((acc, t) => {
        if (t.tipo === 'debito') {
          const acoesSaida = ['pagamento', 'saque', 'transferência', 'compra'];
          if (acoesSaida.includes(t.acao)) return acc + t.valor;
        }
        return acc;
      }, 0);

      // Saldo do Mês: Soma de todas as entradas (depósitos/transferências positivas)
      const saldoMes = transacoesMes.reduce((acc, t) => {
        const acoesEntrada = ['depósito', 'rendimento', 'reembolso'];
        if (acoesEntrada.includes(t.acao) || (t.tipo === 'debito' && t.valor < 0)) {
           return acc + Math.abs(t.valor);
        }
        return acc;
      }, 0);

      const restante = saldoMes - gastoMes;

      return {
        mes: nomeMes,
        gastoMes,
        saldoMes,
        restante
      };
    });
  }, [data]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1001] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col animate-slide-in-up">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h2 className="text-2xl font-bold text-slate-900 font-space-grotesk">Resumo do Ano</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors"
            aria-label="Fechar modal"
          >
            <IoClose className="w-6 h-6 text-slate-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-slate-100">
                <th className="py-4 px-2 text-sm font-bold text-slate-600 uppercase tracking-wider">Mês</th>
                <th className="py-4 px-2 text-sm font-bold text-slate-600 uppercase tracking-wider text-right">Gasto do Mês</th>
                <th className="py-4 px-2 text-sm font-bold text-slate-600 uppercase tracking-wider text-right">Saldo do Mês</th>
                <th className="py-4 px-2 text-sm font-bold text-slate-600 uppercase tracking-wider text-right">Restante</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {resumoMensal.map((row) => (
                <tr key={row.mes} className="hover:bg-slate-50 transition-colors">
                  <td className="py-4 px-2 text-sm font-semibold text-slate-900">{row.mes}</td>
                  <td className="py-4 px-2 text-sm font-medium text-negative text-right">
                    {formatarMoeda(row.gastoMes)}
                  </td>
                  <td className="py-4 px-2 text-sm font-medium text-positive text-right">
                    {formatarMoeda(row.saldoMes)}
                  </td>
                  <td className={`py-4 px-2 text-sm font-bold text-right ${obterClasseCorValor(row.restante)}`}>
                    {formatarMoeda(row.restante)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="p-6 bg-slate-50 border-t border-slate-100 text-right">
          <button 
            onClick={onClose}
            className="px-6 py-2 bg-primary text-white font-bold rounded-lg hover:bg-primary-dark transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}

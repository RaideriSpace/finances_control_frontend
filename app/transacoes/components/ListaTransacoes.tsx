'use client';

import { useState, useMemo } from 'react';
import { Transacao } from '../../src/types/transacao.type';
import { formatarMoeda, formatarData, obterClasseCorValor } from '@/app/core/presentation/utils/formatting';
import { IoSearch } from 'react-icons/io5';
import { TransacaoActions } from "./TransacaoActions";
import { FormularioTransacao } from "./FormularioTransacao";
import { DashboardCards } from "./DashboardCards";

interface ListaTransacoesProps {
  initialData: Transacao[];
}

/**
 * @component ListaTransacoes
 * @description Exibe a lista de transações com filtros em linha única e design RaideriSpace
 */
export function ListaTransacoes({ initialData }: ListaTransacoesProps) {
  const [transacoes, setTransacoes] = useState<Transacao[]>(initialData);
  const [transacaoEditando, setTransacaoEditando] = useState<Transacao | null>(null);

  // Estados dos Filtros
  const [busca, setBusca] = useState("");
  const [filtroCartao, setFiltroCartao] = useState("");
  const [filtroTipo, setFiltroTipo] = useState("");
  const [filtroClassificacao, setFiltroClassificacao] = useState("");
  const [filtroMes, setFiltroMes] = useState("");

  const removerDaLista = (id: string) => {
    setTransacoes((prev) => prev.filter((t) => t.id !== id));
  };

  const classificacoesUnicas = useMemo(() => {
    const classifs = transacoes.map((t) => t.classificacao).filter(Boolean);
    return Array.from(new Set(classifs)).sort();
  }, [transacoes]);

  const mesesUnicos = useMemo(() => {
    const meses = transacoes.map((t) => t.data_pagamento.substring(0, 7));
    return Array.from(new Set(meses)).sort((a, b) => b.localeCompare(a));
  }, [transacoes]);

  const transacoesFiltradas = useMemo(() => {
    return [...transacoes].filter((t) => {
      const matchBusca = t.compra.toLowerCase().includes(busca.toLowerCase()) || 
                         (t.estabelecimento && t.estabelecimento.toLowerCase().includes(busca.toLowerCase()));
      const matchCartao = filtroCartao ? t.cartao === filtroCartao : true;
      const matchTipo = filtroTipo ? t.tipo === filtroTipo : true;
      const matchClassificacao = filtroClassificacao ? t.classificacao === filtroClassificacao : true;
      const matchMes = filtroMes ? t.data_pagamento.substring(0, 7) === filtroMes : true;

      return matchBusca && matchCartao && matchTipo && matchClassificacao && matchMes;
    }).sort((a, b) => new Date(b.data_pagamento).getTime() - new Date(a.data_pagamento).getTime());
  }, [transacoes, busca, filtroCartao, filtroTipo, filtroClassificacao, filtroMes]);

  const selectClass = "bg-slate-50 border border-slate-200 rounded-lg px-2 py-2 text-[10px] font-bold uppercase focus:ring-2 focus:ring-primary outline-none min-w-[100px]";

  return (
    <>
      <DashboardCards data={transacoesFiltradas} />

      <section className="space-y-6">
        <h2 className="text-center font-space-grotesk font-bold text-2xl text-slate-900 mb-6">Lançamentos</h2>

        {/* Filtros em Linha Única */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-wrap items-center gap-3">
          <div className="flex-1 min-w-[200px] relative">
            <IoSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
          </div>

          <select className={selectClass} value={filtroMes} onChange={(e) => setFiltroMes(e.target.value)}>
            <option value="">Mês</option>
            {mesesUnicos.map((mes) => {
              const [ano, m] = mes.split("-");
              return <option key={mes} value={mes}>{`${m}/${ano}`}</option>;
            })}
          </select>

          <select className={selectClass} value={filtroClassificacao} onChange={(e) => setFiltroClassificacao(e.target.value)}>
            <option value="">Categoria</option>
            {classificacoesUnicas.map(c => <option key={c} value={c}>{c}</option>)}
          </select>

          <select className={selectClass} value={filtroCartao} onChange={(e) => setFiltroCartao(e.target.value)}>
            <option value="">Conta</option>
            {Array.from(new Set(transacoes.map(t => t.cartao))).map(c => (
              <option key={c} value={c}>{c.toUpperCase()}</option>
            ))}
          </select>

          <select className={selectClass} value={filtroTipo} onChange={(e) => setFiltroTipo(e.target.value)}>
            <option value="">Tipo</option>
            <option value="debito">Débito</option>
            <option value="credito">Crédito</option>
          </select>
        </div>

        {/* Tabela de Transações */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="py-4 px-6 text-[10px] font-bold text-slate-500 uppercase">Data</th>
                  <th className="py-4 px-6 text-[10px] font-bold text-slate-500 uppercase">Estabelecimento</th>
                  <th className="py-4 px-6 text-[10px] font-bold text-slate-500 uppercase">Categoria</th>
                  <th className="py-4 px-6 text-[10px] font-bold text-slate-500 uppercase">Conta</th>
                  <th className="py-4 px-6 text-[10px] font-bold text-slate-500 uppercase text-right">Valor</th>
                  <th className="py-4 px-6 text-[10px] font-bold text-slate-500 uppercase text-center">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {transacoesFiltradas.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="py-4 px-6 text-xs text-slate-600 font-medium">{formatarData(t.data_pagamento)}</td>
                    <td className="py-4 px-6">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-900">{t.estabelecimento || "S/N"}</span>
                        <span className="text-[10px] text-slate-400 uppercase font-semibold">{t.compra}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-[10px] font-bold uppercase">
                        {t.classificacao}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-[10px] font-bold text-slate-500 uppercase">{t.cartao}</span>
                    </td>
                    <td className={`py-4 px-6 text-right text-sm font-bold ${obterClasseCorValor(t.valor)}`}>
                      {formatarMoeda(t.valor)}
                    </td>
                    <td className="py-4 px-6 text-center">
                      <div className="flex justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <TransacaoActions transacao={t} onDeleteSuccess={removerDaLista} onEdit={(t) => setTransacaoEditando(t)} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Modal de Edição */}
      {transacaoEditando && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[1001] p-4 animate-fade-in">
          <div className="bg-white p-8 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-slide-in-up">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 font-space-grotesk">Editar Transação</h2>
            <FormularioTransacao
              initialData={transacaoEditando}
              onSuccess={() => {
                setTransacaoEditando(null);
                window.location.reload();
              }}
              onCancel={() => setTransacaoEditando(null)}
            />
          </div>
        </div>
      )}
    </>
  );
}

"use client";

import { useState, useMemo } from "react";
import { TransacaoActions } from "./TransacaoActions";
import { FormularioTransacao } from "./FormularioTransacao";
import { Transacao } from "../../src/types/transacao.type";
import { DashboardCards } from "./DashboardCards";
import { IoSearch, IoFilterSharp } from "react-icons/io5";

export function ListaTransacoes({ initialData }: { initialData: Transacao[] }) {
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

  // Extrair Classificações Únicas
  const classificacoesUnicas = useMemo(() => {
    const classifs = transacoes.map((t) => t.classificacao).filter(Boolean);
    return Array.from(new Set(classifs)).sort();
  }, [transacoes]);

  // Extrair Meses Únicos
  const mesesUnicos = useMemo(() => {
    const meses = transacoes.map((t) => t.data_pagamento.substring(0, 7));
    return Array.from(new Set(meses)).sort((a, b) => b.localeCompare(a));
  }, [transacoes]);

  // Lógica de Filtro e Ordenação
  const transacoesFiltradas = useMemo(() => {
    const hoje = new Date().getTime();

    let filtradas = [...transacoes].reverse().filter((t) => {
      const dataPagamento = new Date(t.data_pagamento).getTime();

      if (!filtroMes && dataPagamento > hoje) return false;

      const termoBusca = busca.toLowerCase();
      const matchBusca =
        t.compra.toLowerCase().includes(termoBusca) ||
        (t.estabelecimento && t.estabelecimento.toLowerCase().includes(termoBusca));

      const matchCartao = filtroCartao ? t.cartao === filtroCartao : true;
      const matchTipo = filtroTipo ? t.tipo === filtroTipo : true;
      const matchClassificacao = filtroClassificacao
        ? t.classificacao.toLowerCase().includes(filtroClassificacao.toLowerCase())
        : true;

      const mesAno = t.data_pagamento.substring(0, 7);
      const matchMes = filtroMes ? mesAno === filtroMes : true;

      return matchBusca && matchCartao && matchTipo && matchClassificacao && matchMes;
    });

    filtradas.sort((a, b) => {
      const dataA = new Date(a.data_pagamento).getTime();
      const dataB = new Date(b.data_pagamento).getTime();
      return dataB - dataA;
    });

    return filtradas;
  }, [transacoes, busca, filtroCartao, filtroTipo, filtroClassificacao, filtroMes]);

  // Auxiliares de Estilo
  const getCartaoEstilo = (cartao: string) => {
    const estilos: Record<string, string> = {
      picpay: "bg-green-100 text-green-900",
      inter: "bg-orange-100 text-orange-900",
      mercado_pago: "bg-yellow-100 text-yellow-900",
      mercado_livre: "bg-yellow-100 text-yellow-900",
      amazon: "bg-blue-100 text-blue-900",
      swile: "bg-rose-100 text-rose-900",
      nubank: "bg-purple-100 text-purple-900",
      outro: "bg-slate-200 text-slate-700",
    };
    return estilos[cartao] || estilos.outro;
  };

  const getValorEstilo = (acao: string) => {
    const acoesSaida = ["pagamento", "saque", "transferência", "compra"];
    return acoesSaida.includes(acao) ? "text-rose-600" : "text-emerald-600";
  };

  const inputClass =
    "w-full bg-slate-700 text-slate-100 border border-slate-600 p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all placeholder-slate-400 shadow-sm";

  const formatarDataLocal = (dataString: string) => {
    const dataAjustada = dataString.split("T")[0] + "T12:00:00";
    return new Intl.DateTimeFormat("pt-BR").format(new Date(dataAjustada));
  };

  return (
    <>
      {/* Dashboard de Resumos */}
      <DashboardCards data={transacoesFiltradas} />

      {/* Seção de Lançamentos */}
      <div className="mb-8">
        <h2 className="text-center font-space-grotesk font-bold text-2xl text-slate-900 mb-6">
          Lançamentos
        </h2>

        {/* Barra de Filtros */}
        <div className="bg-slate-700 p-4 rounded-xl shadow-md mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Busca */}
          <div className="relative lg:col-span-2">
            <IoSearch className="absolute left-3 top-3 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar..."
              className={`${inputClass} pl-10`}
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
          </div>

          {/* Mês */}
          <select className={inputClass} value={filtroMes} onChange={(e) => setFiltroMes(e.target.value)}>
            <option value="">📅 Mês</option>
            {mesesUnicos.map((mes) => {
              const [ano, m] = mes.split("-");
              return (
                <option key={mes} value={mes}>
                  {`${m}/${ano}`}
                </option>
              );
            })}
          </select>

          {/* Categoria */}
          <div>
            <input
              list="lista-classificacoes-filtro"
              placeholder="Categoria"
              className={inputClass}
              value={filtroClassificacao}
              onChange={(e) => setFiltroClassificacao(e.target.value)}
            />
            <datalist id="lista-classificacoes-filtro">
              {classificacoesUnicas.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
          </div>

          {/* Conta */}
          <select className={inputClass} value={filtroCartao} onChange={(e) => setFiltroCartao(e.target.value)}>
            <option value="">💳 Conta</option>
            <option value="picpay">PicPay</option>
            <option value="nubank">Nubank</option>
            <option value="inter">Inter</option>
            <option value="mercado_pago">Mercado Pago</option>
            <option value="amazon">Amazon</option>
            <option value="swile">Swile</option>
            <option value="outro">Outro</option>
          </select>

          {/* Tipo */}
          <select className={inputClass} value={filtroTipo} onChange={(e) => setFiltroTipo(e.target.value)}>
            <option value="">🔄 Tipo</option>
            <option value="debito">Débito</option>
            <option value="credito">Crédito</option>
          </select>
        </div>

        {/* Listagem de Resultados */}
        {transacoesFiltradas.length === 0 ? (
          <div className="text-center p-12 bg-slate-200 rounded-2xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center">
            <p className="text-slate-600 text-lg font-medium">Nenhuma transação encontrada.</p>
            <button
              onClick={() => {
                setBusca("");
                setFiltroCartao("");
                setFiltroTipo("");
                setFiltroClassificacao("");
                setFiltroMes("");
              }}
              className="text-indigo-600 font-semibold mt-4 hover:text-indigo-700 transition-colors bg-indigo-100 px-4 py-2 rounded-lg"
            >
              Limpar Filtros
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {transacoesFiltradas.map((item) => (
              <div
                key={item.id}
                className="group flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 bg-slate-200 border border-slate-300 rounded-xl shadow-sm hover:shadow-md hover:border-indigo-400 transition-all duration-300"
              >
                <div className="flex-1 mb-3 sm:mb-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="font-bold text-slate-900">{item.compra}</span>
                    <span className="text-xs text-slate-600">•</span>
                    <span className="text-xs text-slate-600">{item.estabelecimento || "S/N"}</span>
                    <span className="text-xs text-slate-600">•</span>
                    <span className="text-xs text-slate-600">{item.classificacao}</span>
                  </div>
                  <p className="text-xs text-slate-500">{formatarDataLocal(item.data_pagamento)}</p>
                </div>

                <div className="flex items-center justify-between sm:gap-6">
                  <div className="flex items-center gap-2">
                    <span className={`capitalize rounded-md px-2 py-1 text-xs font-bold ${getCartaoEstilo(item.cartao)}`}>
                      {item.cartao.replace("_", " ")}
                    </span>
                    <span className="text-xs bg-slate-300 text-slate-700 px-2 py-1 rounded-md">
                      {item.tipo === "debito" ? "Débito" : "Crédito"}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`text-lg font-bold ${getValorEstilo(item.acao)}`}>
                      {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(item.valor)}
                    </span>
                    <div className="opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                      <TransacaoActions transacao={item} onDeleteSuccess={removerDaLista} onEdit={(t) => setTransacaoEditando(t)} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de Edição */}
      {transacaoEditando && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="dark-scrollbar bg-slate-900 border border-slate-700 p-6 sm:p-8 rounded-[2rem] w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl shadow-black/50 pr-4 sm:pr-6">
            <h2 className="text-2xl font-bold text-slate-100 mb-6 flex items-center gap-3 font-space-grotesk">
              <span className="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center">✏️</span>
              Editar Transação
            </h2>
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

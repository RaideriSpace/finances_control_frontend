"use client";

import { useMemo } from "react";
import { Transacao } from "../../src/types/transacao.type";

interface DashboardCardsProps {
  data: Transacao[];
}

export function DashboardCards({ data }: DashboardCardsProps) {
  // Cálculos para Saldos (débito)
  const saldos = useMemo(() => {
    const accounts = ["picpay", "inter", "swile", "outro"];
    return accounts.map((account) => {
      const total = data.reduce((acc, t) => {
        if (t.cartao === account && t.tipo === "debito") {
          const acoesSaida = ["pagamento", "saque", "transferência", "compra"];
          return acoesSaida.includes(t.acao) ? acc - t.valor : acc + t.valor;
        }
        return acc;
      }, 0);
      return { account, total };
    });
  }, [data]);

  // Cálculos para Faturas (crédito)
  const faturas = useMemo(() => {
    const accounts = ["picpay", "inter", "outro"];
    return accounts.map((account) => {
      const total = data.reduce((acc, t) => {
        if (t.cartao === account && t.tipo === "credito") {
          const acoesSaida = ["pagamento", "saque", "transferência", "compra"];
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
      if (t.acao === "compra" && t.tipo === "credito") {
        return acc + t.valor;
      }
      return acc;
    }, 0);

    const previsaoSaldo = data.reduce((acc, t) => {
      if (t.tipo === "credito") {
        const acoesSaida = ["pagamento", "saque", "transferência", "compra"];
        return acoesSaida.includes(t.acao) ? acc - t.valor : acc + t.valor;
      }
      return acc;
    }, 0);

    const restante = data.reduce((acc, t) => {
      if (t.tipo === "debito") {
        const acoesSaida = ["pagamento", "saque", "transferência", "compra"];
        return acoesSaida.includes(t.acao) ? acc - t.valor : acc + t.valor;
      }
      return acc;
    }, 0);

    return [
      { label: "Gasto do mês", value: gastoDoMes },
      { label: "Previsão de saldo", value: previsaoSaldo },
      { label: "Restante", value: restante },
    ];
  }, [data]);

  const getAccountLabel = (account: string) => {
    const labels: Record<string, string> = {
      picpay: "Picpay",
      inter: "Inter",
      swile: "Swile",
      outro: "Outros",
    };
    return labels[account] || account;
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
      {/* Coluna Saldos */}
      <div className="bg-slate-200 rounded-2xl p-6 shadow-md">
        <h3 className="text-center font-space-grotesk font-bold text-xl text-slate-900 mb-6">
          Saldos
        </h3>
        <div className="space-y-4">
          {saldos.map((item) => (
            <div key={item.account} className="text-center">
              <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1">
                {getAccountLabel(item.account)}
              </p>
              <p className="text-lg font-bold text-slate-900">
                {formatCurrency(item.total)}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Coluna Faturas */}
      <div className="bg-slate-200 rounded-2xl p-6 shadow-md">
        <h3 className="text-center font-space-grotesk font-bold text-xl text-slate-900 mb-6">
          Faturas
        </h3>
        <div className="space-y-4">
          {faturas.map((item) => (
            <div key={item.account} className="text-center">
              <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1">
                {getAccountLabel(item.account)}
              </p>
              <p className="text-lg font-bold text-slate-900">
                {formatCurrency(item.total)}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Coluna Resumos */}
      <div className="bg-slate-200 rounded-2xl p-6 shadow-md">
        <h3 className="text-center font-space-grotesk font-bold text-xl text-slate-900 mb-6">
          Resumos
        </h3>
        <div className="space-y-4">
          {resumos.map((item) => (
            <div key={item.label} className="text-center">
              <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1">
                {item.label}
              </p>
              <p className="text-lg font-bold text-slate-900">
                {formatCurrency(item.value)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

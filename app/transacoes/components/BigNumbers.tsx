"use client";

import { useMemo } from "react";
import { Transacao } from "../../src/types/transacao.type";

interface BigNumbersProps {
	data: Transacao[]; // Mudamos de initialData para data (a lista filtrada)
	account: string;
	credit?: boolean;
}

const BigNumbers = ({ data, account, credit = true }: BigNumbersProps) => {
	const paymentMethod = credit ? "credito" : "debito";

	// Mapeamento de cores de fundo
	const bgConfigs: Record<string, string> = {
		picpay: "bg-green-900/40",
		inter: "bg-orange-900/40",
		mercado_pago: "bg-yellow-900/40",
		amazon: "bg-blue-900/40",
		swile: "bg-slate-800",
		nubank: "bg-purple-900/40",
    outro: "bg-pink-900/40",
	};

	const bgColor = bgConfigs[account] || "bg-slate-900";

	const accountResult = useMemo(() => {
		return data.reduce((acumulador, transacao) => {
			// Só processa se o cartão e o tipo (crédito/débito) baterem
			if (transacao.cartao === account && transacao.tipo === paymentMethod) {
				const acoesSaida = ["pagamento", "saque", "transferência", "compra"];

				if (acoesSaida.includes(transacao.acao)) {
					return acumulador - transacao.valor;
				}
				return acumulador + transacao.valor;
			}
			return acumulador;
		}, 0);
	}, [data, account, paymentMethod]); // Importante: depende da lista 'data'

	const valueColor = accountResult >= 0 ? "text-emerald-400" : "text-rose-400";
	const accountTitle = account.replace("_", " ");

	return (
		<div className={`${bgColor} p-4 rounded-2xl border border-slate-800 shadow-lg flex-1 min-w-50 transition-all duration-500`}>
			<span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
				{accountTitle} • {credit ? "Cartão" : "Saldo"}
			</span>
			<span className={`text-2xl font-bold ${valueColor}`}>
				{new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(accountResult)}
			</span>
		</div>
	);
};

export default BigNumbers;

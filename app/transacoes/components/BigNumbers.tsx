"use client";

import { useMemo } from "react";
import { Transacao } from "../../src/types/transacao.type";
import { IoCard, IoWallet } from "react-icons/io5";

interface BigNumbersProps {
	data: Transacao[];
	account: string;
	credit?: boolean;
}

const BigNumbers = ({ data, account, credit = true }: BigNumbersProps) => {
	const paymentMethod = credit ? "credito" : "debito";

	// Mapeamos os bancos para a sua paleta oficial
	const brandColors: Record<string, string> = {
		picpay: "bg-positive",
		inter: "bg-secondary",
		mercado_pago: "bg-auxiliary1",
		amazon: "bg-dark",
		swile: "bg-tertiary-dark",
		nubank: "bg-primary",
		outro: "bg-auxiliary2",
	};

	const accentColor = brandColors[account] || "bg-dark-light";

	const accountResult = useMemo(() => {
		return data.reduce((acumulador, transacao) => {
			if (transacao.cartao === account && transacao.tipo === paymentMethod) {
				const acoesSaida = ["pagamento", "saque", "transferência", "compra"];
				if (acoesSaida.includes(transacao.acao)) {
					return acumulador - transacao.valor;
				}
				return acumulador + transacao.valor;
			}
			return acumulador;
		}, 0);
	}, [data, account, paymentMethod]);

	const valueClass = accountResult >= 0 ? "value-positive" : "value-negative";
	const accountTitle = account.replace("_", " ");

	// Escolhe o ícone dinamicamente baseado no tipo da conta
	const Icone = credit ? IoCard : IoWallet;

	return (
		<div className="card flex-1 min-w-[260px] flex flex-col gap-m group hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
			{/* Cabeçalho do Card: Ícone + Título + Badge */}
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-3">
					{/* Círculo com a cor da marca e o ícone dentro */}
					<div
						className={`w-10 h-10 rounded-full flex items-center justify-center text-white shadow-md ${accentColor} transition-transform group-hover:scale-110`}>
						<Icone className="w-5 h-5" />
					</div>
					<span className="text-sm font-bold text-dark uppercase tracking-wider">{accountTitle}</span>
				</div>

				{/* Badge usando o seu CSS global */}
				<span className={`badge ${credit ? "badge-primary" : "badge-tertiary"}`}>{credit ? "Fatura" : "Saldo"}</span>
			</div>

			{/* Corpo do Card: Valor em destaque */}
			<div className="mt-auto">
				<p className="text-xs text-neutral mb-1 font-medium">Total acumulado</p>
				<span className={`text-3xl tracking-tight ${valueClass}`}>
					{new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(accountResult)}
				</span>
			</div>
		</div>
	);
};

export default BigNumbers;

"use client";

import { useMemo } from "react";
import { Transacao } from "../../src/types/transacao.type";

interface BigNumbersProps {
	data: Transacao[];
	account: string;
	credit?: boolean;
}

const BigNumbers = ({ data, account, credit = true }: BigNumbersProps) => {
	const paymentMethod = credit ? "credito" : "debito";

	// Mapeamos os bancos para a sua paleta RaideriSpace oficial
	const brandColors: Record<string, string> = {
		picpay: "bg-positive", // O verde do PicPay casa com a cor positiva
		inter: "bg-secondary", // O Laranja/Rosa do Inter mapeado pro Secondary
		mercado_pago: "bg-auxiliary1", // Azul escuro
		amazon: "bg-dark", // Preto
		swile: "bg-tertiary-dark", // Um tom de ciano mais escuro
		nubank: "bg-primary", // Roxo RaideriSpace!
		outro: "bg-auxiliary2", // Índigo
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

	// Usando diretamente as classes que você criou no globals.css!
	const valueClass = accountResult >= 0 ? "value-positive" : "value-negative";
	const accountTitle = account.replace("_", " ");

	return (
		// 1. Usamos a sua classe .card (que já tem padding, radius, shadow e fundo branco)
		// 2. Adicionamos relative e overflow-hidden para o detalhe lateral
		<div className="card relative overflow-hidden flex-1 min-w-[200px] flex flex-col justify-between">
			{/* Detalhe de cor lateral para identificar o banco sutilmente */}
			<div className={`absolute top-0 left-0 w-1.5 h-full ${accentColor}`} />

			<div className="flex items-center justify-between mb-xs">
				<span className="text-xs font-bold text-neutral uppercase tracking-wider ml-1">{accountTitle}</span>

				{/* Usamos as cores ex-light como fundo e dark para o texto, gerando um badge suave */}
				<span
					className={`text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase ${
						credit ? "bg-primary-ex-light/30 text-primary-dark" : "bg-auxiliary1-ex-light/30 text-auxiliary1-dark"
					}`}>
					{credit ? "Cartão" : "Saldo"}
				</span>
			</div>

			{/* Usamos sua tipografia e a classe de valor positivo/negativo */}
			<span className={`text-3xl mt-s ml-1 ${valueClass}`}>
				{new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(accountResult)}
			</span>
		</div>
	);
};

export default BigNumbers;

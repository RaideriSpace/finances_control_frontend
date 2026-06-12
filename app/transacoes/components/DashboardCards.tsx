"use client";

import { useMemo } from "react";
import { Transacao } from "../../src/types/transacao.type";
import { formatarMoeda } from "@/app/core/presentation/utils/formatting";
import { IoWallet, IoCard, IoPieChart } from "react-icons/io5";

interface DashboardCardsProps {
	data: Transacao[];
}

export function DashboardCards({ data }: DashboardCardsProps) {
	const hoje = new Date();
	const mesAtual = hoje.getMonth();
	const anoAtual = hoje.getFullYear();

	const dadosAteHoje = useMemo(() => {
		return data.filter((t) => {
			if (!t.data_pagamento) return false;
			const dataT = new Date(t.data_pagamento);
			return dataT.getFullYear() < anoAtual || (dataT.getFullYear() === anoAtual && dataT.getMonth() <= mesAtual);
		});
	}, [data, mesAtual, anoAtual]);

	const saldos = useMemo(() => {
		const accounts = ["picpay", "inter", "swile", "outro"];
		return accounts.map((account) => {
			const total = dadosAteHoje.reduce((acc, t) => {
				if (t.cartao === account && t.tipo === "debito") {
					const acoesSaida = ["pagamento", "saque", "transferência", "compra"];
					return acoesSaida.includes(t.acao) ? acc - t.valor : acc + t.valor;
				}
				return acc;
			}, 0);
			return { account, total };
		});
	}, [dadosAteHoje]);

	const faturas = useMemo(() => {
		const accounts = ["picpay", "inter", "outro"];
		return accounts.map((account) => {
			const total = dadosAteHoje.reduce((acc, t) => {
				if (t.cartao === account && t.tipo === "credito") {
					const acoesSaida = ["pagamento", "saque", "transferência", "compra"];
					return acoesSaida.includes(t.acao) ? acc - t.valor : acc + t.valor;
				}
				return acc;
			}, 0);
			return { account, total };
		});
	}, [dadosAteHoje]);

	const resumos = useMemo(() => {
		const transacoesMesAtual = data.filter((t) => {
			if (!t.data_pagamento) return false;
			const dataT = new Date(t.data_pagamento);
			return dataT.getMonth() === mesAtual && dataT.getFullYear() === anoAtual;
		});

		const gastoDebitoNegativo = transacoesMesAtual.reduce((acc, t) => {
			if (t.tipo === "debito" && t.valor > 0) {
				const acoesSaida = ["pagamento", "saque", "transferência", "compra"];
				if (acoesSaida.includes(t.acao)) return acc + t.valor;
			}
			return acc;
		}, 0);

		const totalFaturasMes = faturas.reduce((acc, f) => acc + Math.abs(f.total), 0);
		const gastoDoMes = gastoDebitoNegativo + totalFaturasMes;

		const valorFixo = 3500 + 2152.5 + 1200;
		const depositosExtras = dadosAteHoje.reduce((acc, t) => {
			const estabelecimentosExcluidos = ["PROA", "Swile", "Uliving"];
			const acoesEntrada = ["depósito", "rendimento", "reembolso"];

			if (acoesEntrada.includes(t.acao) && t.local && !estabelecimentosExcluidos.includes(t.local)) {
				return acc + t.valor;
			}
			return acc;
		}, 0);

		const previsaoSaldo = valorFixo + depositosExtras;
		const restante = previsaoSaldo - gastoDoMes;

		return [
			{ label: "Gasto do mês", value: -gastoDoMes },
			{ label: "Previsão de saldo", value: restante },
			{ label: "Saldo Total", value: previsaoSaldo },
		];
	}, [data, faturas, mesAtual, anoAtual, dadosAteHoje]);

	const getAccountLabel = (account: string): string => {
		const labels: Record<string, string> = {
			picpay: "PicPay",
			inter: "Banco Inter",
			swile: "Swile Benefícios",
			outro: "Outras Contas",
		};
		return labels[account] || account;
	};

	// Linha da lista padronizada para o tema escuro
	const listItemClass =
		"flex justify-between items-center py-xs border-b border-dark-light last:border-b-0 hover:bg-white/5 px-2 -mx-2 rounded transition-colors";

	return (
		// Removido o bg-primary para deixar o fundo da página (page.tsx) aparecer
		<section className="grid grid-cols-1 lg:grid-cols-3 gap-m mb-xl">
			{/* ================= CARD SALDOS ================= */}
			<article className="card relative overflow-hidden group hover:-translate-y-1 transition-all duration-300">
				<div className="absolute top-0 left-0 w-full h-1 bg-primary transition-all group-hover:h-1.5" />

				<div className="flex items-center gap-s mb-m">
					<div className="p-xs rounded-s bg-primary-dark/50 text-primary-ex-light border border-primary/30">
						<IoWallet className="w-6 h-6" />
					</div>
					<h3 className="font-space-grotesk font-bold text-xl text-white">Saldos Disponíveis</h3>
				</div>

				<div className="space-y-1">
					{saldos.map((item) => (
						<div key={item.account} className={listItemClass}>
							<p className="text-xs font-semibold text-auxiliary2-ex-light uppercase tracking-wide">{getAccountLabel(item.account)}</p>
							<p className={`text-base tracking-tight ${item.total >= 0 ? "value-positive" : "value-negative"}`}>{formatarMoeda(item.total)}</p>
						</div>
					))}
				</div>
			</article>

			{/* ================= CARD FATURAS ================= */}
			<article className="card relative overflow-hidden group hover:-translate-y-1 transition-all duration-300">
				<div className="absolute top-0 left-0 w-full h-1 bg-secondary transition-all group-hover:h-1.5" />

				<div className="flex items-center gap-s mb-m">
					<div className="p-xs rounded-s bg-secondary-dark/50 text-secondary-ex-light border border-secondary/30">
						<IoCard className="w-6 h-6" />
					</div>
					<h3 className="font-space-grotesk font-bold text-xl text-white">Faturas Atuais</h3>
				</div>

				<div className="space-y-1">
					{faturas.map((item) => (
						<div key={item.account} className={listItemClass}>
							<p className="text-xs font-semibold text-auxiliary2-ex-light uppercase tracking-wide">{getAccountLabel(item.account)}</p>
							<p className={`text-base tracking-tight ${item.total >= 0 ? "value-positive" : "value-negative"}`}>{formatarMoeda(item.total)}</p>
						</div>
					))}
				</div>
			</article>

			{/* ================= CARD RESUMOS ================= */}
			<article className="card relative overflow-hidden group hover:-translate-y-1 transition-all duration-300">
				<div className="absolute top-0 left-0 w-full h-1 bg-tertiary transition-all group-hover:h-1.5" />

				<div className="flex items-center gap-s mb-m">
					<div className="p-xs rounded-s bg-tertiary-dark/50 text-tertiary-ex-light border border-tertiary/30">
						<IoPieChart className="w-6 h-6" />
					</div>
					<h3 className="font-space-grotesk font-bold text-xl text-white">Resumo do Mês</h3>
				</div>

				<div className="space-y-1">
					{resumos.map((item) => (
						<div key={item.label} className={listItemClass}>
							<p className="text-xs font-semibold text-auxiliary2-ex-light uppercase tracking-wide">{item.label}</p>
							<p className={`text-base tracking-tight ${item.value >= 0 ? "value-positive" : "value-negative"}`}>{formatarMoeda(item.value)}</p>
						</div>
					))}
				</div>
			</article>
		</section>
	);
}

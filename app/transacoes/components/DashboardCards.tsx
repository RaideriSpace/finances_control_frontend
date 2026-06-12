"use client";

import { useMemo } from "react";
import { Transacao } from "../../src/types/transacao.type";
import { formatarMoeda } from "@/app/core/presentation/utils/formatting";
import { IoWallet, IoCard, IoPieChart } from "react-icons/io5";

interface DashboardCardsProps {
	data: Transacao[];
}

// ─── Dados mockados de salários (substituir por entity do backend futuramente) ───
const PREVISAO_SALARIOS: Record<string, number> = {
	uliving: 3500,
	proa: 2100,
	swile: 1200,
	outros: 0,
};
const PREVISAO_TOTAL = Object.values(PREVISAO_SALARIOS).reduce((a, b) => a + b, 0); // 6800

// ─── Contas monitoradas ───
const CONTAS_SALDO = ["picpay", "inter", "swile", "outro"] as const;
const CONTAS_FATURA = ["picpay", "inter", "outro"] as const;

const CONTA_LABELS: Record<string, string> = {
	picpay: "PicPay",
	inter: "Banco Inter",
	swile: "Swile",
	outro: "Outras Contas",
};

const ACOES_SAIDA = ["pagamento", "saque", "transferência", "compra"] as const;

export function DashboardCards({ data }: DashboardCardsProps) {
	const hoje = new Date();
	const mesAtual = hoje.getMonth();
	const anoAtual = hoje.getFullYear();

	// Transações do mês atual
	const transacoesMes = useMemo(() => {
		return data.filter((t) => {
			if (!t.data_pagamento) return false;
			const d = new Date(t.data_pagamento);
			return d.getMonth() === mesAtual && d.getFullYear() === anoAtual;
		});
	}, [data, mesAtual, anoAtual]);

	// ── SALDOS: soma depósitos e investimentos por conta (débito, ações de entrada) ──
	const saldos = useMemo(() => {
		const acoesEntrada = ["depósito", "investimento", "rendimento", "reembolso"];
		return CONTAS_SALDO.map((account) => {
			const total = data.reduce((acc, t) => {
				if (t.cartao === account && t.tipo === "debito" && acoesEntrada.includes(t.acao)) {
					return acc + t.valor;
				}
				return acc;
			}, 0);
			return { account, total };
		});
	}, [data]);

	// ── FATURAS: soma itens de crédito por conta ──
	const faturas = useMemo(() => {
		return CONTAS_FATURA.map((account) => {
			const total = data.reduce((acc, t) => {
				if (t.cartao === account && t.tipo === "credito") {
					return acc + t.valor;
				}
				return acc;
			}, 0);
			return { account, total };
		});
	}, [data]);

	// ── RESUMO DO MÊS ──
	const resumo = useMemo(() => {
		// Gasto do mês: compra + pagamento + transferência + saque no mês atual
		const gastoDoMes = transacoesMes.reduce((acc, t) => {
			if (ACOES_SAIDA.includes(t.acao as any)) {
				return acc + t.valor;
			}
			return acc;
		}, 0);

		// Previsão de saldo: dados mockados fixos
		const previsaoSaldo = PREVISAO_TOTAL;

		// Saldo Total: previsão - gasto
		const saldoTotal = previsaoSaldo - gastoDoMes;

		return { gastoDoMes, previsaoSaldo, saldoTotal };
	}, [transacoesMes]);

	const listItemClass =
		"flex justify-between items-center py-xs border-b border-dark-light last:border-b-0 hover:bg-white/5 px-xs -mx-xs rounded transition-colors";

	return (
		<section className="grid grid-cols-1 lg:grid-cols-3 gap-m mb-xl">
			{/* ═══ SALDOS DISPONÍVEIS ═══ */}
			<article className="card relative overflow-hidden group hover:-translate-y-1 transition-all duration-300">
				<div className="absolute top-0 left-0 w-full h-1 bg-primary transition-all group-hover:h-1.5" />

				<div className="flex items-center gap-s mb-m">
					<div className="p-xs rounded-s bg-primary-dark/50 text-primary-ex-light border border-primary/30">
						<IoWallet className="w-6 h-6" />
					</div>
					<div>
						<h3 className="font-space-grotesk font-bold text-base text-white leading-tight">Saldos Disponíveis</h3>
						<p className="text-[10px] text-auxiliary2-light">Depósitos e investimentos por conta</p>
					</div>
				</div>

				<div className="space-y-[2px]">
					{saldos.map((item) => (
						<div key={item.account} className={listItemClass}>
							<p className="text-xs font-semibold text-auxiliary2-ex-light">{CONTA_LABELS[item.account]}</p>
							<p className={`text-sm font-bold tabular-nums ${item.total >= 0 ? "text-positive" : "text-negative"}`}>{formatarMoeda(item.total)}</p>
						</div>
					))}
				</div>
			</article>

			{/* ═══ FATURAS ATUAIS ═══ */}
			<article className="card relative overflow-hidden group hover:-translate-y-1 transition-all duration-300">
				<div className="absolute top-0 left-0 w-full h-1 bg-secondary transition-all group-hover:h-1.5" />

				<div className="flex items-center gap-s mb-m">
					<div className="p-xs rounded-s bg-secondary-dark/50 text-secondary-ex-light border border-secondary/30">
						<IoCard className="w-6 h-6" />
					</div>
					<div>
						<h3 className="font-space-grotesk font-bold text-base text-white leading-tight">Faturas Atuais</h3>
						<p className="text-[10px] text-auxiliary2-light">Total de crédito por cartão</p>
					</div>
				</div>

				<div className="space-y-[2px]">
					{faturas.map((item) => (
						<div key={item.account} className={listItemClass}>
							<p className="text-xs font-semibold text-auxiliary2-ex-light">{CONTA_LABELS[item.account]}</p>
							<p className={`text-sm font-bold tabular-nums ${item.total > 0 ? "text-negative" : "text-positive"}`}>
								{item.total > 0 ? "−" : ""}
								{formatarMoeda(item.total)}
							</p>
						</div>
					))}
				</div>
			</article>

			{/* ═══ RESUMO DO MÊS ═══ */}
			<article className="card relative overflow-hidden group hover:-translate-y-1 transition-all duration-300">
				<div className="absolute top-0 left-0 w-full h-1 bg-tertiary transition-all group-hover:h-1.5" />

				<div className="flex items-center gap-s mb-m">
					<div className="p-xs rounded-s bg-tertiary-dark/50 text-tertiary-ex-light border border-tertiary/30">
						<IoPieChart className="w-6 h-6" />
					</div>
					<div>
						<h3 className="font-space-grotesk font-bold text-base text-white leading-tight">Resumo do Mês</h3>
						<p className="text-[10px] text-auxiliary2-light">{new Date().toLocaleString("pt-BR", { month: "long", year: "numeric" })}</p>
					</div>
				</div>

				<div className="space-y-[2px]">
					{/* Gasto do mês */}
					<div className={listItemClass}>
						<p className="text-xs font-semibold text-auxiliary2-ex-light">Gasto do mês</p>
						<p className="text-sm font-bold tabular-nums text-negative">−{formatarMoeda(resumo.gastoDoMes)}</p>
					</div>

					{/* Previsão de saldo — com breakdown no tooltip/subtexto */}
					<div className={listItemClass}>
						<div>
							<p className="text-xs font-semibold text-auxiliary2-ex-light">Previsão de saldo</p>
							<p className="text-[10px] text-auxiliary1-light">
								Uliving {formatarMoeda(PREVISAO_SALARIOS.uliving)} · PROA {formatarMoeda(PREVISAO_SALARIOS.proa)} · Swile{" "}
								{formatarMoeda(PREVISAO_SALARIOS.swile)}
							</p>
						</div>
						<p className="text-sm font-bold tabular-nums text-positive">{formatarMoeda(resumo.previsaoSaldo)}</p>
					</div>

					{/* Saldo total com destaque */}
					<div className="flex justify-between items-center pt-xs mt-xs border-t border-dark-light">
						<p className="text-xs font-bold text-white uppercase tracking-wide">Saldo Total</p>
						<p className={`text-base font-bold tabular-nums ${resumo.saldoTotal >= 0 ? "text-positive" : "text-negative"}`}>
							{formatarMoeda(resumo.saldoTotal)}
						</p>
					</div>
				</div>
			</article>
		</section>
	);
}

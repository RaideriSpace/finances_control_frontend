"use client";

import { useEffect, useMemo, useState } from "react";
import { Transacao } from "../../src/types/transacao.type";
import { Saldo } from "../../src/types/saldo.type";
import { formatarMoeda } from "@/app/core/presentation/utils/formatting";
import { IoWallet, IoCard, IoPieChart } from "react-icons/io5";
import { SaldoService } from "../../src/services/saldo.service";

interface DashboardCardsProps {
	data: Transacao[];
}

// ─── Contas monitoradas ───
const CONTAS_SALDO = ["picpay", "inter", "swile", "outro"] as const;
const CONTAS_FATURA = ["picpay", "inter", "outro"] as const;

const CONTA_LABELS: Record<string, string> = {
	picpay: "PicPay",
	inter: "Banco Inter",
	swile: "Swile",
	outro: "Outras Contas",
};

const CONTAS_SALDO_PROPRIAS = new Set(["picpay", "inter", "swile"]);
const CONTAS_FATURA_PROPRIAS = new Set(["picpay", "inter"]);

const ACOES_SAIDA = ["pagamento", "saque", "transferência", "compra"] as const;
const ACOES_ENTRADA_PREVISAO = ["depósito", "investimento"] as const;

// Locais cujas transações de entrada já são contabilizadas via SaldoFixo
const LOCAIS_EXCLUIDOS_PREVISAO = ["uliving", "proa", "swile"];

const FONTE_LABELS: Record<string, string> = {
	uliving: "Uliving",
	proa: "PROA",
	swile: "Swile",
};

export function DashboardCards({ data }: DashboardCardsProps) {
	const hoje = new Date();
	const mesAtual = hoje.getMonth();
	const anoAtual = hoje.getFullYear();

	const [saldosFixos, setSaldosFixos] = useState<Saldo[]>([]);

	useEffect(() => {
		SaldoService.listarAtual()
			.then(setSaldosFixos)
			.catch(() => setSaldosFixos([]));
	}, []);

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
		const acoesEntrada = ["depósito", "investimento"];
		return CONTAS_SALDO.map((account) => {
			const total = data.reduce((acc, t) => {
				const conta = CONTAS_SALDO_PROPRIAS.has(t.cartao) ? t.cartao : "outro";
				if (conta !== account) return acc;

				if (t.tipo === "debito" && acoesEntrada.includes(t.acao)) return acc + t.valor;
				else if (t.tipo === "debito" && !acoesEntrada.includes(t.acao)) return acc - t.valor;

				return acc;
			}, 0);
			return { account, total };
		});
	}, [data]);

	// ── FATURAS: soma itens de crédito por conta ──
	const faturas = useMemo(() => {
		return CONTAS_FATURA.map((account) => {
			const total = data.reduce((acc, t) => {
				if (!t.data_pagamento) return acc;
				const d = new Date(t.data_pagamento);
				const dentroDoIntervalo = d.getFullYear() < anoAtual || (d.getFullYear() === anoAtual && d.getMonth() <= mesAtual);
				if (!dentroDoIntervalo || t.tipo !== "credito") return acc;

				const conta = CONTAS_FATURA_PROPRIAS.has(t.cartao) ? t.cartao : "outro";
				if (conta !== account) return acc;

				if (t.acao === "compra") return acc + t.valor;
				if (t.acao === "depósito") return acc - t.valor;
				return acc;
			}, 0);
			return { account, total };
		});
	}, [data, mesAtual, anoAtual]);

	// ── RESUMO DO MÊS ──
	const resumo = useMemo(() => {
		// Gasto do mês: compra + pagamento + transferência + saque no mês atual
		const gastoDoMes = transacoesMes.reduce((acc, t) => {
			if (t.tipo === "debito" && ACOES_SAIDA.includes(t.acao as any)) {
				return acc + t.valor;
			}
			return acc;
		}, 0);

		// Total cadastrado em Saldos Fixos (ciclo vigente)
		const totalSaldosFixos = saldosFixos.reduce((acc, s) => acc + (s.valor ?? 0), 0);

		// Entradas do mês (débito + depósito/investimento) que NÃO sejam de Uliving, PROA ou Swile
		const entradasMes = transacoesMes.reduce((acc, t) => {
			if (t.tipo !== "debito" || !ACOES_ENTRADA_PREVISAO.includes(t.acao as any)) return acc;

			const local = (t.local || "").toLowerCase();
			const ehLocalExcluido = LOCAIS_EXCLUIDOS_PREVISAO.some((l) => local.includes(l));
			if (ehLocalExcluido) return acc;

			return acc + t.valor;
		}, 0);

		// Previsão de saldo: soma dos saldos fixos cadastrados + entradas extras do mês
		const previsaoSaldo = totalSaldosFixos + entradasMes;

		// Saldo Total: previsão - gasto
		const saldoTotal = previsaoSaldo - gastoDoMes;

		return { gastoDoMes, previsaoSaldo, saldoTotal, totalSaldosFixos, entradasMes };
	}, [transacoesMes, saldosFixos]);

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

					{/* Previsão de saldo — com breakdown no subtexto */}
					<div className={listItemClass}>
						<div>
							<p className="text-xs font-semibold text-auxiliary2-ex-light">Previsão de saldo</p>
							<p className="text-[10px] text-auxiliary1-light">
								Fixos {formatarMoeda(resumo.totalSaldosFixos)} · Extras {formatarMoeda(resumo.entradasMes)}
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

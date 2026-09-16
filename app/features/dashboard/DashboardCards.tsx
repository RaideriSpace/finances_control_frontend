"use client";

import { useEffect, useMemo, useState } from "react";
import { Transacao, TransacaoCartao } from "@/app/lib/types/transacao.type";
import { Saldo } from "@/app/lib/types/saldo.type";
import { formatarMoeda } from "@/app/lib/format";
import { IoWallet, IoCard, IoPieChart, IoEye, IoEyeOff } from "react-icons/io5";
import { SaldoService } from "@/app/lib/api/saldo.service";
import { GastosFixosService } from "@/app/lib/api/gastos-fixos.service";
import { GastoFixo } from "@/app/lib/types/gasto-fixo.type";
import { DashboardResumo } from "@/app/lib/types/dashboard.type";
import { transacoesDoMes, calcularResumoMensal } from "@/app/lib/finance/resumo-mensal";
import { calcularSaldosPorConta } from "@/app/lib/finance/saldos-por-conta";
import { calcularFaturasPorConta } from "@/app/lib/finance/faturas";

interface DashboardCardsProps {
	data: Transacao[];
	resumo: DashboardResumo;
}

const CONTAS_SALDO = ["picpay", "inter", "swile", "outro"] as const;
const CONTAS_FATURA = ["picpay", "inter", "outro"] as const;

const CONTA_LABELS: Record<string, string> = {
	picpay: "PicPay",
	inter: "Banco Inter",
	swile: "Swile",
	outro: "Outras Contas",
};

const CONTAS_SALDO_PROPRIAS = new Set<TransacaoCartao>(["picpay", "inter", "swile"]);
const CONTAS_FATURA_PROPRIAS = new Set<TransacaoCartao>(["picpay", "inter"]);

const HIDDEN_PLACEHOLDER = "••••••";

type CardVisivel = "saldo" | "fatura" | "resumo";

interface EyeButtonProps {
	visivel: boolean;
	onToggle: () => void;
}

// Componente fora do corpo de DashboardCards: definir componentes durante a
// renderização recria o tipo a cada render, perdendo estado/identidade do DOM.
function EyeButton({ visivel, onToggle }: EyeButtonProps) {
	return (
		<button
			type="button"
			onClick={onToggle}
			className="p-xs rounded-s text-auxiliary2-light hover:text-white hover:bg-white/10 transition-all flex-shrink-0"
			title={visivel ? "Ocultar valores" : "Mostrar valores"}>
			{visivel ?
				<IoEye className="w-4 h-4" />
			:	<IoEyeOff className="w-4 h-4" />}
		</button>
	);
}

export function DashboardCards({ data, resumo: resumoBackend }: DashboardCardsProps) {
	const hoje = new Date();
	const mesAtual = hoje.getMonth();
	const anoAtual = hoje.getFullYear();

	const [saldosFixos, setSaldosFixos] = useState<Saldo[]>([]);
	const [gastosFixos, setGastosFixos] = useState<GastoFixo[]>([]);
	const [visivel, setVisivel] = useState({ saldo: true, fatura: true, resumo: true });

	useEffect(() => {
		queueMicrotask(() => {
			try {
				const saved = localStorage.getItem("dashboard-cards-visivel");
				if (saved) setVisivel(JSON.parse(saved));
			} catch {}
		});
	}, []);

	const toggleVisivel = (card: CardVisivel) =>
		setVisivel((prev) => {
			const next = { ...prev, [card]: !prev[card] };
			try {
				localStorage.setItem("dashboard-cards-visivel", JSON.stringify(next));
			} catch {}
			return next;
		});

	useEffect(() => {
		SaldoService.listarAtual()
			.then(setSaldosFixos)
			.catch(() => setSaldosFixos([]));
		GastosFixosService.listarTodos()
			.then(setGastosFixos)
			.catch(() => setGastosFixos([]));
	}, []);

	const transacoesMes = useMemo(() => transacoesDoMes(data, mesAtual, anoAtual), [data, mesAtual, anoAtual]);

	const saldos = useMemo(
		() => calcularSaldosPorConta(data, CONTAS_SALDO, CONTAS_SALDO_PROPRIAS).map(({ conta, total }) => ({ account: conta, total })),
		[data],
	);

	const faturas = useMemo(
		() =>
			calcularFaturasPorConta(data, CONTAS_FATURA, CONTAS_FATURA_PROPRIAS).map(({ conta, total }) => ({
				account: conta,
				total,
			})),
		[data],
	);

	const resumo = useMemo(() => {
		const { gasto: gastoDoMes } = calcularResumoMensal(transacoesMes);
		const totalSaldosFixos = saldosFixos.reduce((acc, s) => acc + (s.valor ?? 0), 0);

		// Previsão de saldo é só os saldos fixos cadastrados — entradas extras
		// do mês (freelas, reembolsos etc.) não entram mais nessa soma.
		const previsaoSaldo = totalSaldosFixos;
		const saldoTotal = previsaoSaldo - gastoDoMes;

		const totalGastosFixos = gastosFixos.reduce((acc, gasto) => acc + gasto.valor, 0);

		return { gastoDoMes, previsaoSaldo, saldoTotal, totalSaldosFixos, totalGastosFixos };
	}, [transacoesMes, saldosFixos, gastosFixos]);

	const listItemClass =
		"flex justify-between items-center py-xs border-b border-dark-light last:border-b-0 hover:bg-white/5 px-xs -mx-xs rounded transition-colors";

	return (
		<section className="grid grid-cols-1 lg:grid-cols-3 gap-m mb-xl">
			{/* ═══ SALDOS DISPONÍVEIS ═══ */}
			<article className="card relative overflow-hidden group hover:-translate-y-1 transition-all duration-300">
				<div className="absolute top-0 left-0 w-full h-1 bg-primary transition-all group-hover:h-1.5" />

				<div className="mb-m flex items-start justify-between gap-s">
					<div className="min-w-0">
						<div className="flex items-center gap-s">
							<span className="rounded-s border border-primary/30 bg-primary-dark/50 p-xs text-primary-ex-light">
								<IoWallet className="h-5 w-5" />
							</span>
							<h3 className="font-space-grotesk font-bold text-base text-white">Saldos Disponíveis</h3>
						</div>
						<p className="mt-xs text-3xl font-bold tabular-nums text-positive">
							{visivel.saldo ? formatarMoeda(resumoBackend.disponivel) : HIDDEN_PLACEHOLDER}
						</p>
					</div>
					<EyeButton visivel={visivel.saldo} onToggle={() => toggleVisivel("saldo")} />
				</div>
				<div className="mb-xs flex items-center justify-center pt-s">
					<span className="whitespace-nowrap text-[10px] font-bold uppercase tracking-widest text-primary-ex-light">Detalhes</span>
				</div>

				<div className="space-y-[2px]">
					{saldos.map((item) => (
						<div key={item.account} className={listItemClass}>
							<p className="text-xs font-semibold text-auxiliary2-ex-light">{CONTA_LABELS[item.account]}</p>
							<p className={`text-sm font-bold tabular-nums ${item.total >= 0 ? "text-positive" : "text-negative"}`}>
								{visivel.saldo ? formatarMoeda(item.total) : HIDDEN_PLACEHOLDER}
							</p>
						</div>
					))}
				</div>
			</article>

			{/* ═══ FATURAS ATUAIS ═══ */}
			<article className="card relative overflow-hidden group hover:-translate-y-1 transition-all duration-300">
				<div className="absolute top-0 left-0 w-full h-1 bg-secondary transition-all group-hover:h-1.5" />

				<div className="mb-m flex items-start justify-between gap-s">
					<div className="min-w-0">
						<div className="flex items-center gap-s">
							<span className="rounded-s border border-secondary/30 bg-secondary-dark/50 p-xs text-secondary-ex-light">
								<IoCard className="h-5 w-5" />
							</span>
							<h3 className="font-space-grotesk font-bold text-base text-white">Faturas Atuais</h3>
						</div>
						<p className="mt-xs text-3xl font-bold tabular-nums text-negative">
							{visivel.fatura ? `-${formatarMoeda(resumoBackend.devido)}` : HIDDEN_PLACEHOLDER}
						</p>
					</div>
					<EyeButton visivel={visivel.fatura} onToggle={() => toggleVisivel("fatura")} />
				</div>
				<div className="mb-xs flex items-center justify-center pt-s">
					<span className="whitespace-nowrap text-[10px] font-bold uppercase tracking-widest text-secondary-ex-light">Detalhes</span>
				</div>

				<div className="space-y-[2px]">
					{faturas.map((item) => (
						<div key={item.account} className={listItemClass}>
							<p className="text-xs font-semibold text-auxiliary2-ex-light">{CONTA_LABELS[item.account]}</p>
							<p className={`text-sm font-bold tabular-nums ${item.total > 0 ? "text-negative" : "text-positive"}`}>
								{visivel.fatura ?
									<>
										{item.total > 0 ? "−" : ""}
										{formatarMoeda(item.total)}
									</>
								:	HIDDEN_PLACEHOLDER}
							</p>
						</div>
					))}
				</div>
			</article>

			{/* ═══ RESUMO DO MÊS ═══ */}
			<article className="card relative overflow-hidden group hover:-translate-y-1 transition-all duration-300">
				<div className="absolute top-0 left-0 w-full h-1 bg-tertiary transition-all group-hover:h-1.5" />

				<div className="mb-m flex items-start justify-between gap-s">
					<div className="min-w-0">
						<div className="flex items-center gap-s">
							<span className="rounded-s border border-tertiary/30 bg-tertiary-dark/50 p-xs text-tertiary-ex-light">
								<IoPieChart className="h-5 w-5" />
							</span>
							<h3 className="font-space-grotesk font-bold text-base text-white">Resumo do Mês</h3>
						</div>
						<p className={`mt-xs text-3xl font-bold tabular-nums ${resumoBackend.totalGasto >= 0 ? "text-positive" : "text-negative"}`}>
							{visivel.resumo ? formatarMoeda(resumoBackend.totalGasto) : HIDDEN_PLACEHOLDER}
						</p>
					</div>
					<EyeButton visivel={visivel.resumo} onToggle={() => toggleVisivel("resumo")} />
				</div>
				<div className="mb-xs flex items-center justify-center pt-s">
					<span className="whitespace-nowrap text-[10px] font-bold uppercase tracking-widest text-tertiary-ex-light">Detalhes</span>
				</div>

				<div className="space-y-[2px]">
					<div className={listItemClass}>
						<p className="text-xs font-semibold text-auxiliary2-ex-light">Gastos Fixos</p>
						<p className="text-sm font-bold tabular-nums text-negative">
							{visivel.resumo ? `−${formatarMoeda(resumo.totalGastosFixos)}` : HIDDEN_PLACEHOLDER}
						</p>
					</div>

					<div className={listItemClass}>
						<div>
							<p className="text-xs font-semibold text-auxiliary2-ex-light">Previsão de saldo</p>
							<p className="text-[10px] text-auxiliary1-light">
								Fixos {visivel.resumo ? formatarMoeda(resumo.totalSaldosFixos) : HIDDEN_PLACEHOLDER}
							</p>
						</div>
						<p className="text-sm font-bold tabular-nums text-positive">
							{visivel.resumo ? formatarMoeda(resumo.previsaoSaldo) : HIDDEN_PLACEHOLDER}
						</p>
					</div>

					<div className="flex justify-between items-center pt-xs mt-xs border-t border-dark-light">
						<p className="text-xs font-bold text-white uppercase tracking-wide">Saldo Total</p>
						<p className={`text-base font-bold tabular-nums ${resumo.saldoTotal >= 0 ? "text-positive" : "text-negative"}`}>
							{visivel.resumo ? formatarMoeda(resumo.saldoTotal) : HIDDEN_PLACEHOLDER}
						</p>
					</div>
				</div>
			</article>
		</section>
	);
}

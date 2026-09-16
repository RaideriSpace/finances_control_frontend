"use client";

import { useMemo } from "react";
import Link from "next/link";
import { IoArrowForward, IoCard, IoWallet } from "react-icons/io5";
import { DashboardResumo } from "@/app/lib/types/dashboard.type";
import { Transacao } from "@/app/lib/types/transacao.type";
import { formatarData, formatarMoeda } from "@/app/lib/format";
import { agruparCategorias } from "@/app/lib/finance/categorias";
import { transacoesDaSemana } from "@/app/lib/finance/data-local";
import { CARTAO_LABELS, CARTAO_BORDER_CLASSES } from "@/app/lib/finance/contas";
import { DashboardCards } from "./DashboardCards";

function valorLancamento(acao: string) {
	return acao === "depósito" ? "positive" : "negative";
}

export function DashboardView({ resumo, transacoes }: { resumo: DashboardResumo; transacoes: Transacao[] }) {
	const mesLabel = new Date(`${resumo.mes}-01T12:00:00`).toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
	const maiorCategoria = resumo.categorias[0]?.valor ?? 1;

	const categoriasSemana = useMemo(() => agruparCategorias(transacoesDaSemana(transacoes, new Date())), [transacoes]);
	const maiorCategoriaSemana = categoriasSemana[0]?.valor ?? 1;

	return (
		<main id="main-content" className="min-h-screen bg-gradient-to-b from-dark-ex-dark to-dark px-s pb-xxxl pt-l text-white sm:px-l">
			<div className="mx-auto max-w-7xl space-y-xl">
				<div className="flex flex-wrap items-end justify-between gap-s">
					<div>
						<p className="text-xs font-bold uppercase tracking-[0.2em] text-primary-ex-light">Visão geral</p>
						<h1 className="mt-xs font-space-grotesk text-3xl font-bold capitalize">{mesLabel}</h1>
					</div>
					<Link
						href="/lancamentos"
						className="inline-flex items-center gap-xs rounded-s border border-primary-light/30 px-s py-xs text-sm font-bold text-primary-ex-light hover:border-primary-light hover:text-white">
						Ver lançamentos <IoArrowForward className="h-4 w-4" />
					</Link>
				</div>

				<DashboardCards data={transacoes} resumo={resumo} />

				<section className="grid gap-m lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
					<article className="card">
						<div className="mb-m flex items-end justify-between">
							<div>
								<p className="text-xs font-bold uppercase tracking-widest text-primary-ex-light">Onde o dinheiro foi</p>
								<h2 className="mt-xs text-xl font-bold">Top 5 categorias</h2>
							</div>
							<span className="text-xs text-auxiliary2-light">{mesLabel}</span>
						</div>
						<div className="space-y-s">
							{resumo.categorias.length === 0 ?
								<p className="text-sm text-auxiliary2-light">Nenhum gasto registrado neste mês.</p>
							:	resumo.categorias.map((categoria) => (
									<div key={categoria.nome}>
										<div className="mb-[3px] flex justify-between gap-s text-sm">
											<span className="truncate text-auxiliary2-ex-light">{categoria.nome}</span>
											<span className="font-bold tabular-nums text-negative">-{formatarMoeda(categoria.valor)}</span>
										</div>
										<div className="h-1.5 overflow-hidden rounded-full bg-dark-light">
											<div
												className="h-full rounded-full bg-negative"
												style={{ width: `${Math.max(8, (categoria.valor / maiorCategoria) * 100)}%` }}
											/>
										</div>
									</div>
								))
							}
						</div>

						<div className="mb-m mt-l flex items-end justify-between border-t border-dark-light pt-m">
							<div>
								<p className="text-xs font-bold uppercase tracking-widest text-primary-ex-light">Semana atual</p>
								<h2 className="mt-xs text-xl font-bold">Categorias da semana</h2>
							</div>
							<span className="text-xs text-auxiliary2-light">Reinicia todo domingo</span>
						</div>
						<div className="space-y-s">
							{categoriasSemana.length === 0 ?
								<p className="text-sm text-auxiliary2-light">Nenhum gasto registrado nesta semana.</p>
							:	categoriasSemana.map((categoria) => (
									<div key={categoria.nome}>
										<div className="mb-[3px] flex justify-between gap-s text-sm">
											<span className="truncate text-auxiliary2-ex-light">{categoria.nome}</span>
											<span className="font-bold tabular-nums text-negative">-{formatarMoeda(categoria.valor)}</span>
										</div>
										<div className="h-1.5 overflow-hidden rounded-full bg-dark-light">
											<div
												className="h-full rounded-full bg-negative"
												style={{ width: `${Math.max(8, (categoria.valor / maiorCategoriaSemana) * 100)}%` }}
											/>
										</div>
									</div>
								))
							}
						</div>
					</article>

					<article className="card">
						<div className="mb-m flex items-center justify-between">
							<div>
								<p className="text-xs font-bold uppercase tracking-widest text-primary-ex-light">Movimentações recentes</p>
								<h2 className="mt-xs text-xl font-bold">Últimos 10 lançamentos</h2>
							</div>
							<Link href="/lancamentos" className="text-xs font-bold text-primary-ex-light hover:text-white">
								Todos
							</Link>
						</div>
						<div className="divide-y divide-dark-light">
							{resumo.ultimosLancamentos.length === 0 ?
								<p className="text-sm text-auxiliary2-light">Nenhum lançamento neste mês.</p>
							:	resumo.ultimosLancamentos.map((transacao) => {
									const entrada = valorLancamento(transacao.acao) === "positive";
									return (
										<div key={transacao.id} className="flex items-center gap-s py-xs">
											<div
												className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-s border-2 bg-dark-dark ${CARTAO_BORDER_CLASSES[transacao.cartao]} ${
													transacao.tipo === "credito" ? "text-secondary-ex-light" : "text-primary-ex-light"
												}`}>
												{transacao.tipo === "credito" ?
													<IoCard />
												:	<IoWallet />}
											</div>
											<div className="min-w-0 flex-1">
												<p className="truncate text-sm font-semibold">{transacao.compra}</p>
												<p className="text-[11px] text-auxiliary2-light">
													{transacao.data_pagamento ? formatarData(transacao.data_pagamento) : "Pendente"} · {transacao.classificacao_1} ·{" "}
													{CARTAO_LABELS[transacao.cartao]}
												</p>
											</div>
											<span className={`text-sm font-bold tabular-nums ${entrada ? "text-positive" : "text-negative"}`}>
												{entrada ? "+" : "-"}
												{formatarMoeda(transacao.valor)}
											</span>
										</div>
									);
								})
							}
						</div>
					</article>
				</section>
			</div>
		</main>
	);
}

"use client";

import { useMemo } from "react";
import { IoClose, IoTrendingDown, IoTrendingUp, IoRemove } from "react-icons/io5";
import { Transacao } from "../../src/types/transacao.type";
import { formatarMoeda } from "@/app/core/presentation/utils/formatting";

interface ModalResumoAnualProps {
	isOpen: boolean;
	onClose: () => void;
	data: Transacao[];
}

const MESES = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
const ACOES_SAIDA = ["pagamento", "saque", "transferência", "compra"];
const ACOES_ENTRADA = ["depósito", "rendimento", "reembolso"];

export function ModalResumoAnual({ isOpen, onClose, data }: ModalResumoAnualProps) {
	const mesAtual = new Date().getMonth();

	const resumoMensal = useMemo(() => {
		return MESES.map((nomeMes, index) => {
			const mesIndex = index + 1;
			const transacoesMes = data.filter((t) => {
				if (!t.data_pagamento) return false;
				return new Date(t.data_pagamento).getMonth() + 1 === mesIndex;
			});
			const gastoMes = transacoesMes.reduce((acc, t) => {
				if (t.tipo === "debito" && ACOES_SAIDA.includes(t.acao)) return acc + t.valor;
				return acc;
			}, 0);
			const saldoMes = transacoesMes.reduce((acc, t) => {
				if (ACOES_ENTRADA.includes(t.acao)) return acc + Math.abs(t.valor);
				return acc;
			}, 0);
			return { mes: nomeMes, gastoMes, saldoMes, restante: saldoMes - gastoMes };
		});
	}, [data]);

	const totais = useMemo(
		() =>
			resumoMensal.reduce(
				(acc, r) => ({
					gastoMes: acc.gastoMes + r.gastoMes,
					saldoMes: acc.saldoMes + r.saldoMes,
					restante: acc.restante + r.restante,
				}),
				{ gastoMes: 0, saldoMes: 0, restante: 0 },
			),
		[resumoMensal],
	);

	if (!isOpen) return null;

	return (
		<div
			className="fixed inset-0 z-[1001] flex items-center justify-center p-m"
			style={{ backgroundColor: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)" }}>
			<div className="bg-dark border border-dark-light rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
				{/* ── HEADER ── */}
				<div className="flex items-center justify-between px-l py-m border-b border-dark-light bg-dark-dark/40 flex-shrink-0">
					<div className="flex items-center gap-s">
						<span className="w-9 h-9 rounded-s bg-primary-dark/60 border border-primary/30 flex items-center justify-center text-lg flex-shrink-0">
							📅
						</span>
						<div>
							<h2 className="font-space-grotesk font-bold text-lg text-white leading-tight">Resumo do Ano</h2>
							<p className="text-[10px] text-auxiliary2-light uppercase tracking-widest">{new Date().getFullYear()}</p>
						</div>
					</div>
					<button
						onClick={onClose}
						className="p-xs rounded-full hover:bg-white/10 text-auxiliary2-light hover:text-white transition-colors"
						aria-label="Fechar modal">
						<IoClose className="w-6 h-6" />
					</button>
				</div>

				{/* ── TOTAIS — layout empilhado em mobile, lado a lado em sm+ ── */}
				<div className="flex-shrink-0 border-b border-dark-light">
					{/* Mobile: coluna única */}
					<div className="flex flex-col sm:hidden divide-y divide-dark-light">
						<div className="flex items-center justify-between px-l py-xs">
							<p className="text-[10px] text-auxiliary2-light uppercase tracking-widest">Total Gasto</p>
							<p className="text-sm font-bold text-negative tabular-nums">−{formatarMoeda(totais.gastoMes)}</p>
						</div>
						<div className="flex items-center justify-between px-l py-xs">
							<p className="text-[10px] text-auxiliary2-light uppercase tracking-widest">Total Recebido</p>
							<p className="text-sm font-bold text-positive tabular-nums">+{formatarMoeda(totais.saldoMes)}</p>
						</div>
						<div className="flex items-center justify-between px-l py-xs">
							<p className="text-[10px] text-auxiliary2-light uppercase tracking-widest">Saldo do Ano</p>
							<p className={`text-sm font-bold tabular-nums ${totais.restante >= 0 ? "text-positive" : "text-negative"}`}>
								{formatarMoeda(totais.restante)}
							</p>
						</div>
					</div>

					{/* Desktop: três colunas */}
					<div className="hidden sm:grid grid-cols-3 divide-x divide-dark-light">
						<div className="px-l py-s text-center">
							<p className="text-[10px] text-auxiliary2-light uppercase tracking-widest mb-xs">Total Gasto</p>
							<p className="text-base font-bold text-negative tabular-nums">−{formatarMoeda(totais.gastoMes)}</p>
						</div>
						<div className="px-l py-s text-center">
							<p className="text-[10px] text-auxiliary2-light uppercase tracking-widest mb-xs">Total Recebido</p>
							<p className="text-base font-bold text-positive tabular-nums">+{formatarMoeda(totais.saldoMes)}</p>
						</div>
						<div className="px-l py-s text-center">
							<p className="text-[10px] text-auxiliary2-light uppercase tracking-widest mb-xs">Saldo do Ano</p>
							<p className={`text-base font-bold tabular-nums ${totais.restante >= 0 ? "text-positive" : "text-negative"}`}>
								{formatarMoeda(totais.restante)}
							</p>
						</div>
					</div>
				</div>

				{/* ── TABELA ── */}
				<div className="flex-1 overflow-auto">
					<table className="w-full text-left border-collapse">
						<thead className="sticky top-0 bg-dark-dark z-10">
							<tr className="border-b border-dark-light">
								<th className="py-s px-m text-[10px] font-bold text-auxiliary2-light uppercase tracking-widest">Mês</th>
								<th className="py-s px-m text-[10px] font-bold text-auxiliary2-light uppercase tracking-widest text-right">Gasto</th>
								<th className="py-s px-m text-[10px] font-bold text-auxiliary2-light uppercase tracking-widest text-right">Recebido</th>
								<th className="py-s px-m text-[10px] font-bold text-auxiliary2-light uppercase tracking-widest text-right">Saldo</th>
							</tr>
						</thead>
						<tbody>
							{resumoMensal.map((row, index) => {
								const isCurrent = index === mesAtual;
								const hasDados = row.gastoMes > 0 || row.saldoMes > 0;
								return (
									<tr
										key={row.mes}
										className={`
											border-b border-dark-light/40 transition-colors
											${isCurrent ? "bg-primary-dark/20" : "hover:bg-dark-light/10"}
											${!hasDados ? "opacity-40" : ""}
										`}>
										<td className="py-s px-m">
											<div className="flex items-center gap-xs">
												{isCurrent && <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />}
												<span className={`text-sm font-bold ${isCurrent ? "text-primary-ex-light" : "text-white"}`}>{row.mes}</span>
												{isCurrent && (
													<span className="text-[9px] font-bold uppercase tracking-wide text-primary-ex-light border border-primary/30 bg-primary-dark/40 px-xs py-[1px] rounded hidden sm:inline">
														atual
													</span>
												)}
											</div>
										</td>
										<td className="py-s px-m text-right">
											<div className="flex items-center justify-end gap-xs">
												{row.gastoMes > 0 && <IoTrendingDown className="w-3 h-3 text-negative opacity-60 hidden sm:block" />}
												<span className={`text-sm tabular-nums font-medium ${row.gastoMes > 0 ? "text-negative" : "text-auxiliary2-light"}`}>
													{row.gastoMes > 0 ? `−${formatarMoeda(row.gastoMes)}` : "—"}
												</span>
											</div>
										</td>
										<td className="py-s px-m text-right">
											<div className="flex items-center justify-end gap-xs">
												{row.saldoMes > 0 && <IoTrendingUp className="w-3 h-3 text-positive opacity-60 hidden sm:block" />}
												<span className={`text-sm tabular-nums font-medium ${row.saldoMes > 0 ? "text-positive" : "text-auxiliary2-light"}`}>
													{row.saldoMes > 0 ? `+${formatarMoeda(row.saldoMes)}` : "—"}
												</span>
											</div>
										</td>
										<td className="py-s px-m text-right">
											<div className="flex items-center justify-end gap-xs">
												{hasDados &&
													(row.restante > 0 ? <IoTrendingUp className="w-3 h-3 text-positive opacity-60 hidden sm:block" />
													: row.restante < 0 ? <IoTrendingDown className="w-3 h-3 text-negative opacity-60 hidden sm:block" />
													: <IoRemove className="w-3 h-3 text-auxiliary2-light opacity-60 hidden sm:block" />)}
												<span
													className={`text-sm tabular-nums font-bold ${
														!hasDados ? "text-auxiliary2-light"
														: row.restante >= 0 ? "text-positive"
														: "text-negative"
													}`}>
													{hasDados ? formatarMoeda(row.restante) : "—"}
												</span>
											</div>
										</td>
									</tr>
								);
							})}
						</tbody>
					</table>
				</div>

				{/* ── FOOTER ── */}
				<div className="flex justify-end px-l py-m border-t border-dark-light bg-dark-dark/40 flex-shrink-0">
					<button
						onClick={onClose}
						className="px-l py-xs text-sm font-bold text-white rounded-s bg-gradient-to-r from-primary to-primary-light hover:from-primary-light hover:to-primary shadow-lg shadow-primary/20 transition-all active:scale-95">
						Fechar
					</button>
				</div>
			</div>
		</div>
	);
}

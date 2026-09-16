"use client";

import { useMemo, useState } from "react";
import { IoCalendar, IoTrendingDown, IoTrendingUp, IoRemove, IoChevronBack, IoChevronForward } from "react-icons/io5";
import { Transacao } from "@/app/lib/types/transacao.type";
import { formatarMoeda } from "@/app/lib/format";
import { transacoesDoMes, calcularResumoMensal } from "@/app/lib/finance/resumo-mensal";
import { Modal } from "@/app/components/Modal";

interface ModalResumoAnualProps {
	isOpen: boolean;
	onClose: () => void;
	data: Transacao[];
}

const MESES = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

function primeiroAnoComDados(data: Transacao[]): number {
	const anos = data.map((t) => (t.data_pagamento ? new Date(t.data_pagamento).getFullYear() : null)).filter((a): a is number => a !== null);
	return anos.length > 0 ? Math.min(...anos) : new Date().getFullYear();
}

export function ModalResumoAnual({ isOpen, onClose, data }: ModalResumoAnualProps) {
	const hoje = new Date();
	const mesAtual = hoje.getMonth();
	const anoAtual = hoje.getFullYear();
	const [ano, setAno] = useState(anoAtual);
	const anoMinimo = useMemo(() => primeiroAnoComDados(data), [data]);

	// Usa a mesma agregação canônica do dashboard (lib/finance/resumo-mensal)
	// — antes deste ajuste, esta tela tinha sua própria lista de ações de
	// entrada/saída, já divergente da do DashboardCards.
	const resumoMensal = useMemo(() => {
		return MESES.map((nomeMes, index) => {
			const { gasto: gastoMes, entrada: saldoMes } = calcularResumoMensal(transacoesDoMes(data, index, ano));
			return { mes: nomeMes, gastoMes, saldoMes, restante: saldoMes - gastoMes };
		});
	}, [data, ano]);

	const totais = useMemo(() => {
		const somas = resumoMensal.reduce(
			(acc, r) => ({
				gastoMes: acc.gastoMes + r.gastoMes,
				saldoMes: acc.saldoMes + r.saldoMes,
				restante: acc.restante + r.restante,
			}),
			{ gastoMes: 0, saldoMes: 0, restante: 0 },
		);
		const mesesComDados = resumoMensal.filter((r) => r.gastoMes > 0 || r.saldoMes > 0).length || 1;
		return { ...somas, mediaMensal: somas.restante / mesesComDados };
	}, [resumoMensal]);

	const maiorMovimento = useMemo(() => Math.max(1, ...resumoMensal.map((r) => Math.max(r.gastoMes, r.saldoMes))), [resumoMensal]);

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			accent="primary"
			icon={<IoCalendar className="h-4 w-4" />}
			title="Resumo do Ano"
			maxWidthClass="max-w-3xl"
			subtitle={
				<div className="flex items-center gap-xs normal-case tracking-normal">
					<button
						type="button"
						onClick={() => setAno((a) => Math.max(anoMinimo, a - 1))}
						disabled={ano <= anoMinimo}
						aria-label="Ano anterior"
						className="p-[2px] rounded text-auxiliary2-light hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none transition-colors">
						<IoChevronBack className="w-3 h-3" />
					</button>
					<p className="text-[10px] text-auxiliary2-light uppercase tracking-widest w-10 text-center">{ano}</p>
					<button
						type="button"
						onClick={() => setAno((a) => Math.min(anoAtual, a + 1))}
						disabled={ano >= anoAtual}
						aria-label="Próximo ano"
						className="p-[2px] rounded text-auxiliary2-light hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none transition-colors">
						<IoChevronForward className="w-3 h-3" />
					</button>
				</div>
			}
			footer={
				<div className="flex justify-end">
					<button
						onClick={onClose}
						className="px-l py-xs text-sm font-bold text-white rounded-s bg-gradient-to-r from-primary to-primary-light hover:from-primary-light hover:to-primary shadow-lg shadow-primary/20 transition-all active:scale-95">
						Fechar
					</button>
				</div>
			}>
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
						<div className="flex items-center justify-between px-l py-xs">
							<p className="text-[10px] text-auxiliary2-light uppercase tracking-widest">Média Mensal</p>
							<p className={`text-sm font-bold tabular-nums ${totais.mediaMensal >= 0 ? "text-positive" : "text-negative"}`}>
								{formatarMoeda(totais.mediaMensal)}
							</p>
						</div>
					</div>

					{/* Desktop: quatro colunas */}
					<div className="hidden sm:grid grid-cols-4 divide-x divide-dark-light">
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
						<div className="px-l py-s text-center">
							<p className="text-[10px] text-auxiliary2-light uppercase tracking-widest mb-xs">Média Mensal</p>
							<p className={`text-base font-bold tabular-nums ${totais.mediaMensal >= 0 ? "text-positive" : "text-negative"}`}>
								{formatarMoeda(totais.mediaMensal)}
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
								const isCurrent = ano === anoAtual && index === mesAtual;
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
											{hasDados && (
												<div className="mt-[3px] flex h-[3px] w-full max-w-[120px] gap-[1px] overflow-hidden rounded-full bg-dark">
													<div className="h-full bg-negative/70" style={{ width: `${(row.gastoMes / maiorMovimento) * 100}%` }} />
													<div className="h-full bg-positive/70" style={{ width: `${(row.saldoMes / maiorMovimento) * 100}%` }} />
												</div>
											)}
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
		</Modal>
	);
}

"use client";

import { useMemo } from "react";
import { IoClose } from "react-icons/io5";
import { Transacao } from "../../src/types/transacao.type";
import { formatarMoeda } from "@/app/core/presentation/utils/formatting";

interface ModalResumoAnualProps {
	isOpen: boolean;
	onClose: () => void;
	data: Transacao[];
}

/**
 * @component ModalResumoAnual
 * @description Modal que exibe uma tabela com o resumo financeiro de todos os meses do ano
 */
export function ModalResumoAnual({ isOpen, onClose, data }: ModalResumoAnualProps) {
	const resumoMensal = useMemo(() => {
		const meses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

		return meses.map((nomeMes, index) => {
			const mesIndex = index + 1;
			const transacoesMes = data.filter((t) => {
				if (!t.data_pagamento) return false;
				const dataTransacao = new Date(t.data_pagamento);
				return dataTransacao.getMonth() + 1 === mesIndex;
			});

			// Gasto do Mês: Soma de todo valor negativo de débito
			const gastoMes = transacoesMes.reduce((acc, t) => {
				if (t.tipo === "debito") {
					const acoesSaida = ["pagamento", "saque", "transferência", "compra"];
					if (acoesSaida.includes(t.acao)) return acc + t.valor;
				}
				return acc;
			}, 0);

			// Saldo do Mês: Soma de todas as entradas (depósitos/transferências positivas)
			const saldoMes = transacoesMes.reduce((acc, t) => {
				const acoesEntrada = ["depósito", "rendimento", "reembolso"];
				if (acoesEntrada.includes(t.acao) || (t.tipo === "debito" && t.valor < 0)) {
					return acc + Math.abs(t.valor);
				}
				return acc;
			}, 0);

			const restante = saldoMes - gastoMes;

			return {
				mes: nomeMes,
				gastoMes,
				saldoMes,
				restante,
			};
		});
	}, [data]);

	if (!isOpen) return null;

	return (
		// Overlay escuro com blur acompanhando o resto do sistema
		<div className="fixed inset-0 z-[1001] flex items-center justify-center p-m bg-dark-ex-dark/80 backdrop-blur-md animate-fade-in">
			{/* Container do Modal usando as cores e bordas dark */}
			<div className="bg-dark border border-dark-light rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col animate-slide-in-up">
				{/* ================= HEADER ================= */}
				<div className="flex items-center justify-between p-m border-b border-dark-light bg-dark-dark/30">
					<h2 className="text-2xl font-bold text-white font-space-grotesk flex items-center gap-s">
						{/* Ícone de calendário seguindo a identidade dos modais */}
						<span className="w-10 h-10 rounded-full bg-primary-dark/50 border border-primary/30 flex items-center justify-center text-primary-ex-light text-lg">
							📅
						</span>
						Resumo do Ano
					</h2>
					<button onClick={onClose} className="p-xs hover:bg-white/10 rounded-full transition-colors" aria-label="Fechar modal">
						<IoClose className="w-8 h-8 text-auxiliary2-light hover:text-white transition-colors" />
					</button>
				</div>

				{/* ================= CONTENT / TABELA ================= */}
				<div className="flex-1 overflow-auto p-0 sm:p-m">
					<table className="w-full text-left border-collapse">
						<thead className="hidden sm:table-header-group">
							<tr className="border-b-2 border-dark-light">
								<th className="py-s px-m text-sm font-bold text-auxiliary2-light uppercase tracking-wider">Mês</th>
								<th className="py-s px-m text-sm font-bold text-auxiliary2-light uppercase tracking-wider text-right">Gasto do Mês</th>
								<th className="py-s px-m text-sm font-bold text-auxiliary2-light uppercase tracking-wider text-right">Saldo do Mês</th>
								<th className="py-s px-m text-sm font-bold text-auxiliary2-light uppercase tracking-wider text-right">Restante</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-dark-light/50">
							{resumoMensal.map((row) => (
								<tr key={row.mes} className="hover:bg-dark-light/30 transition-colors flex flex-col sm:table-row py-4 sm:py-0 px-4 sm:px-0">
									{/* No Mobile o nome do mês fica em destaque */}
									<td className="py-2 sm:py-s px-0 sm:px-m text-lg sm:text-sm font-bold text-white mb-2 sm:mb-0 border-b border-dark-light/30 sm:border-0">
										{row.mes}
									</td>

									<td className="py-1 sm:py-s px-0 sm:px-m flex justify-between sm:table-cell text-sm font-medium text-right">
										<span className="sm:hidden text-auxiliary2-light font-bold">Gasto:</span>
										<span className="value-negative">{formatarMoeda(row.gastoMes)}</span>
									</td>

									<td className="py-1 sm:py-s px-0 sm:px-m flex justify-between sm:table-cell text-sm font-medium text-right">
										<span className="sm:hidden text-auxiliary2-light font-bold">Saldo:</span>
										<span className="value-positive">{formatarMoeda(row.saldoMes)}</span>
									</td>

									<td
										className={`py-1 sm:py-s px-0 sm:px-m flex justify-between sm:table-cell text-sm font-bold text-right ${row.restante >= 0 ? "value-positive" : "value-negative"}`}>
										<span className="sm:hidden text-auxiliary2-light font-bold">Restante:</span>
										{formatarMoeda(row.restante)}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>

				{/* ================= FOOTER ================= */}
				<div className="p-m bg-dark-dark/50 border-t border-dark-light text-right">
					<button
						onClick={onClose}
						className="px-xl py-xs bg-primary hover:bg-primary-light text-white font-bold rounded-s shadow-lg shadow-primary/20 transition-all">
						Fechar
					</button>
				</div>
			</div>
		</div>
	);
}

import { Transacao } from "../types/transacao.type";
import { ehEntrada, ehSaida } from "./categorias";
import { parseDataLocal } from "./data-local";

export interface ResumoMensal {
	gasto: number;
	entrada: number;
	saldo: number;
}

export function transacoesDoMes(transacoes: Transacao[], mesIndex: number, ano: number): Transacao[] {
	return transacoes.filter((transacao) => {
		if (!transacao.data_pagamento) return false;
		const data = parseDataLocal(transacao.data_pagamento);
		return data.getMonth() === mesIndex && data.getFullYear() === ano;
	});
}

/**
 * Agregação canônica de gasto/entrada de um conjunto de transações (tipicamente
 * já filtradas para um mês via `transacoesDoMes`). Único ponto de cálculo —
 * antes duplicado com regras já divergentes em DashboardCards e ModalResumoAnual.
 */
export function calcularResumoMensal(transacoesDoPeriodo: Transacao[]): ResumoMensal {
	const gasto = transacoesDoPeriodo.reduce(
		(acc, transacao) => (transacao.tipo === "debito" && ehSaida(transacao.acao) ? acc + transacao.valor : acc),
		0,
	);
	const entrada = transacoesDoPeriodo.reduce(
		(acc, transacao) => (transacao.tipo === "debito" && ehEntrada(transacao.acao) ? acc + transacao.valor : acc),
		0,
	);

	return { gasto, entrada, saldo: entrada - gasto };
}

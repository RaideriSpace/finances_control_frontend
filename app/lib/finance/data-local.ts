import { Transacao } from "../types/transacao.type";

/**
 * Interpreta uma string "YYYY-MM-DD" (com ou sem sufixo de hora) como data
 * local. `new Date("YYYY-MM-DD")` é interpretado pelo JS como meia-noite UTC;
 * em fusos horários negativos isso pode "empurrar" a data para o dia/mês
 * anterior ao ler de volta com `.getMonth()`/`.getFullYear()` (que usam hora
 * local). Mesma técnica já usada no backend (transacoes/domain/parcelamento.ts).
 */
export function parseDataLocal(data: string): Date {
	const [ano, mes, dia] = data.slice(0, 10).split("-").map(Number);
	return new Date(ano, mes - 1, dia);
}

/** Meia-noite local do domingo da semana de `referencia` (a própria data, se já for domingo). */
export function inicioDaSemana(referencia: Date): Date {
	const inicio = new Date(referencia.getFullYear(), referencia.getMonth(), referencia.getDate());
	inicio.setDate(inicio.getDate() - inicio.getDay());
	return inicio;
}

/** Transações cuja data de pagamento cai na semana (domingo–sábado) de `referencia`. */
export function transacoesDaSemana(transacoes: readonly Transacao[], referencia: Date): Transacao[] {
	const inicio = inicioDaSemana(referencia);
	const fim = new Date(inicio.getFullYear(), inicio.getMonth(), inicio.getDate() + 7);
	return transacoes.filter((transacao) => {
		if (!transacao.data_pagamento) return false;
		const data = parseDataLocal(transacao.data_pagamento);
		return data >= inicio && data < fim;
	});
}

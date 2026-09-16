import { Transacao, TransacaoCartao } from "../types/transacao.type";
import { parseDataLocal } from "./data-local";

export interface FaturaPorConta {
	conta: string;
	total: number;
}

/**
 * Fatura acumulada por conta de crédito até hoje (inclusive): soma todo
 * lançamento em crédito e abate os que são "depósito" ou "pagamento"
 * (pagamento de fatura — ver CriarTransacaoUseCase no backend). Parcelas com
 * vencimento futuro ainda não entram na fatura em aberto. Contas fora de
 * `contasProprias` são agrupadas em "outro".
 *
 * Mantido igual ao cálculo de "devido" do backend (dashboard/domain/resumo-mensal.ts)
 * — os dois precisam bater, senão o total do dashboard diverge da soma por conta.
 */
export function calcularFaturasPorConta(transacoes: Transacao[], contas: readonly string[], contasProprias: ReadonlySet<TransacaoCartao>): FaturaPorConta[] {
	const hoje = new Date();

	return contas.map((conta) => {
		const total = transacoes.reduce((acc, transacao) => {
			if (transacao.tipo !== "credito" || !transacao.data_pagamento) return acc;
			if (parseDataLocal(transacao.data_pagamento) > hoje) return acc;

			const contaDaTransacao = contasProprias.has(transacao.cartao) ? transacao.cartao : "outro";
			if (contaDaTransacao !== conta) return acc;

			if (transacao.acao === "depósito" || transacao.acao === "pagamento") return acc - transacao.valor;
			return acc + transacao.valor;
		}, 0);
		return { conta, total };
	});
}

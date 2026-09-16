import { Transacao, TransacaoCartao } from "../types/transacao.type";
import { ehEntrada } from "./categorias";

export interface SaldoPorConta {
	conta: string;
	total: number;
}

/**
 * Saldo por conta de débito: soma entradas (depósito/investimento) e subtrai
 * saídas, considerando só transações de débito. Contas fora de
 * `contasProprias` são agrupadas em "outro".
 *
 * Transferência e pagamento de fatura já chegam aqui como duas linhas reais
 * (saída na origem + depósito no destino, criadas juntas pelo backend — ver
 * CriarTransacaoUseCase), então a regra geral de entrada/saída por `cartao`
 * já dá o resultado certo por conta, sem precisar de caso especial.
 */
export function calcularSaldosPorConta(
	transacoes: Transacao[],
	contas: readonly string[],
	contasProprias: ReadonlySet<TransacaoCartao>,
): SaldoPorConta[] {
	return contas.map((conta) => {
		const total = transacoes.reduce((acc, transacao) => {
			const contaDaTransacao = contasProprias.has(transacao.cartao) ? transacao.cartao : "outro";
			if (contaDaTransacao !== conta || transacao.tipo !== "debito") return acc;
			return ehEntrada(transacao.acao) ? acc + transacao.valor : acc - transacao.valor;
		}, 0);
		return { conta, total };
	});
}

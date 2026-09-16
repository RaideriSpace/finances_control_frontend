import { Transacao, TransacaoAcao } from "../types/transacao.type";

/**
 * Categorização canônica de entrada/saída — espelha
 * TRANSACAO_ACOES_ENTRADA/SAIDA do backend (transacao.constants.ts).
 *
 * Antes desta limpeza, DashboardCards.tsx e ModalResumoAnual.tsx mantinham
 * cada um sua própria lista hardcoded, já divergentes entre si (uma incluía
 * "reembolso", que nunca existiu no enum real de ações).
 */
// "transferência" e "pagamento" (de fatura) representam só a perna de saída
// da conta de origem — a perna de entrada é um "depósito" de verdade criado
// na conta de destino pelo backend (ver CriarTransacaoUseCase), então aqui
// contam como saída normal; as duas linhas reais já deixam o total neutro.
export const ACOES_ENTRADA: readonly TransacaoAcao[] = ["depósito", "investimento"];
export const ACOES_SAIDA: readonly TransacaoAcao[] = ["pagamento", "saque", "transferência", "compra"];

export function ehEntrada(acao: TransacaoAcao): boolean {
	return ACOES_ENTRADA.includes(acao);
}

export function ehSaida(acao: TransacaoAcao): boolean {
	return ACOES_SAIDA.includes(acao);
}

// Categorias auto-preenchidas para transferência/pagamento de fatura — não são
// "gasto" no sentido de categoria de despesa. Mantido igual a
// CATEGORIAS_OCULTAS_DO_RESUMO no backend (dashboard/domain/resumo-mensal.ts).
const CATEGORIAS_OCULTAS = new Set(["Transferência", "Cartão"]);

export interface CategoriaResumo {
	nome: string;
	valor: number;
}

/**
 * Agrupa gastos (saída, categoria não oculta) por classificacao_1, do maior
 * para o menor. Não filtra por tipo — débito e crédito são somados juntos,
 * igual ao cálculo de "categorias" do backend (dashboard/domain/resumo-mensal.ts),
 * para dar uma visão completa do gasto por categoria independente da forma
 * de pagamento.
 */
export function agruparCategorias(transacoes: readonly Transacao[], top = 5): CategoriaResumo[] {
	const categorias = new Map<string, number>();
	for (const transacao of transacoes) {
		if (!ehSaida(transacao.acao)) continue;
		if (CATEGORIAS_OCULTAS.has(transacao.classificacao_1)) continue;
		const nome = transacao.classificacao_1 || "Sem categoria";
		categorias.set(nome, (categorias.get(nome) ?? 0) + transacao.valor);
	}
	return [...categorias.entries()]
		.map(([nome, valor]) => ({ nome, valor }))
		.sort((a, b) => b.valor - a.valor)
		.slice(0, top);
}

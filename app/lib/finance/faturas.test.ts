import { describe, expect, it } from "vitest";
import { Transacao, TransacaoCartao } from "../types/transacao.type";
import { calcularFaturasPorConta } from "./faturas";

function transacao(overrides: Partial<Transacao>): Transacao {
	return {
		id: "id",
		compra: "compra",
		acao: "compra",
		classificacao_1: "Casa",
		classificacao_2: null,
		cartao: "nubank",
		tipo: "credito",
		parcelamento: 1,
		parcela: 1,
		valor: 0,
		data_inicio: "2026-09-01",
		data_fim: "2026-09-01",
		local: null,
		data_pagamento: "2026-09-01",
		...overrides,
	};
}

function formatarData(data: Date): string {
	return `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, "0")}-${String(data.getDate()).padStart(2, "0")}`;
}

const hoje = new Date();
const ontem = formatarData(new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() - 1));
const amanha = formatarData(new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() + 1));

describe("calcularFaturasPorConta", () => {
	const contas = ["picpay", "outro"] as const;
	const contasProprias = new Set<TransacaoCartao>(["picpay"]);

	it("acumula compras e abate pagamentos até hoje (inclusive), ignorando parcelas futuras", () => {
		const transacoes = [
			transacao({ cartao: "picpay", acao: "compra", valor: 100, data_pagamento: ontem }),
			transacao({ cartao: "picpay", acao: "depósito", valor: 40, data_pagamento: ontem }),
			transacao({ cartao: "picpay", acao: "compra", valor: 500, data_pagamento: amanha }), // parcela futura — fora do cálculo
		];

		const [picpay] = calcularFaturasPorConta(transacoes, contas, contasProprias);
		expect(picpay.total).toBe(60);
	});

	it("abate também acao 'pagamento' em crédito (dados legados)", () => {
		const transacoes = [
			transacao({ cartao: "picpay", acao: "compra", valor: 300, data_pagamento: ontem }),
			transacao({ cartao: "picpay", acao: "pagamento", valor: 100, data_pagamento: ontem }),
		];

		const [picpay] = calcularFaturasPorConta(transacoes, contas, contasProprias);
		expect(picpay.total).toBe(200);
	});

	it("ignora transações de débito", () => {
		const transacoes = [transacao({ cartao: "picpay", tipo: "debito", acao: "compra", valor: 999, data_pagamento: ontem })];
		const [picpay] = calcularFaturasPorConta(transacoes, contas, contasProprias);
		expect(picpay.total).toBe(0);
	});
});

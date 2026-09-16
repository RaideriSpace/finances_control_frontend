import { describe, expect, it } from "vitest";
import { Transacao } from "../types/transacao.type";
import { transacoesDoMes, calcularResumoMensal } from "./resumo-mensal";

function transacao(overrides: Partial<Transacao>): Transacao {
	return {
		id: "id",
		compra: "compra",
		acao: "compra",
		classificacao_1: "Casa",
		classificacao_2: null,
		cartao: "nubank",
		tipo: "debito",
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

describe("transacoesDoMes", () => {
	it("filtra por mês e ano de data_pagamento", () => {
		const transacoes = [
			transacao({ data_pagamento: "2026-09-05" }),
			transacao({ data_pagamento: "2026-08-31" }),
			transacao({ data_pagamento: undefined }),
		];

		expect(transacoesDoMes(transacoes, 8, 2026)).toHaveLength(1);
	});
});

describe("calcularResumoMensal", () => {
	it("soma gasto (saída) e entrada apenas para transações de débito", () => {
		const transacoes = [
			transacao({ tipo: "debito", acao: "compra", valor: 100 }),
			transacao({ tipo: "debito", acao: "depósito", valor: 50 }),
			transacao({ tipo: "credito", acao: "compra", valor: 80 }), // não conta (crédito)
		];

		const resumo = calcularResumoMensal(transacoes);

		expect(resumo.gasto).toBe(100);
		expect(resumo.entrada).toBe(50);
		expect(resumo.saldo).toBe(-50);
	});
});

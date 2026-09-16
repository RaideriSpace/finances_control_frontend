import { describe, expect, it } from "vitest";
import { Transacao, TransacaoCartao } from "../types/transacao.type";
import { calcularSaldosPorConta } from "./saldos-por-conta";

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

describe("calcularSaldosPorConta", () => {
	const contas = ["picpay", "outro"] as const;
	const contasProprias = new Set<TransacaoCartao>(["picpay"]);

	it("soma entradas e subtrai saídas por conta de débito", () => {
		const transacoes = [
			transacao({ cartao: "picpay", tipo: "debito", acao: "depósito", valor: 100 }),
			transacao({ cartao: "picpay", tipo: "debito", acao: "compra", valor: 30 }),
		];

		const [picpay] = calcularSaldosPorConta(transacoes, contas, contasProprias);
		expect(picpay.total).toBe(70);
	});

	it("agrupa contas fora da lista própria em 'outro'", () => {
		const transacoes = [transacao({ cartao: "amazon", tipo: "debito", acao: "depósito", valor: 40 })];

		const resultado = calcularSaldosPorConta(transacoes, contas, contasProprias);
		expect(resultado.find((r) => r.conta === "outro")?.total).toBe(40);
	});

	it("ignora transações de crédito", () => {
		const transacoes = [transacao({ cartao: "picpay", tipo: "credito", acao: "compra", valor: 999 })];
		const [picpay] = calcularSaldosPorConta(transacoes, contas, contasProprias);
		expect(picpay.total).toBe(0);
	});

	it("transferência (duas linhas: saída na origem + depósito no destino) não altera o total geral", () => {
		const transacoes = [
			transacao({ acao: "transferência", tipo: "debito", cartao: "picpay", cartaoDestino: "amazon", valor: 100 }),
			transacao({ acao: "depósito", tipo: "debito", cartao: "amazon", valor: 100 }),
		];

		const resultado = calcularSaldosPorConta(transacoes, contas, contasProprias);
		const picpay = resultado.find((r) => r.conta === "picpay");
		const outro = resultado.find((r) => r.conta === "outro");

		expect(picpay?.total).toBe(-100);
		expect(outro?.total).toBe(100);
	});
});

import { Saldo, SaldoPayload } from "../types/saldo.type";

const API_URL = "https://finances-control-backend.onrender.com/saldo";

export const SaldoService = {
	async listarTodos(): Promise<Saldo[]> {
		const res = await fetch(API_URL, { cache: "no-store" });
		if (!res.ok) throw new Error("Erro ao buscar saldos");
		return res.json();
	},

	async listarAtual(): Promise<Saldo[]> {
		const res = await fetch(`${API_URL}/atual`, { cache: "no-store" });
		if (!res.ok) throw new Error("Erro ao buscar saldos do mês atual");
		return res.json();
	},

	async criar(payload: SaldoPayload): Promise<void> {
		const res = await fetch(API_URL, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(payload),
		});
		if (!res.ok) throw new Error(await res.text());
	},

	async atualizar(id: string, payload: Partial<SaldoPayload>): Promise<void> {
		const res = await fetch(`${API_URL}/${id}`, {
			method: "PATCH",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(payload),
		});
		if (!res.ok) throw new Error(await res.text());
	},

	async deletar(id: string): Promise<void> {
		const res = await fetch(`${API_URL}/${id}`, {
			method: "DELETE",
		});
		if (!res.ok) throw new Error("Erro ao deletar saldo");
	},
};

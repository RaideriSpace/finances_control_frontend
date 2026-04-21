import { Transacao, TransacaoPayload } from "../types/transacao.type";


const API_URL = "https://finances-control-backend.onrender.com/transacoes";

export const TransacoesService = {
	async listarTodas(): Promise<Transacao[]> {
		const res = await fetch(API_URL, { cache: "no-store" });
		if (!res.ok) throw new Error("Erro ao buscar transações");
		return res.json();
	},

	async criar(payload: TransacaoPayload): Promise<void> {
		const res = await fetch(API_URL, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(payload),
		});
		if (!res.ok) throw new Error(await res.text());
	},

	async atualizar(id: string, payload: TransacaoPayload): Promise<void> {
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
		if (!res.ok) throw new Error("Erro ao deletar transação");
	},
};

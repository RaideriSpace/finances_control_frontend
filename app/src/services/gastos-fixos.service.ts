import { GastoFixo, GastoFixoPayload } from "../types/gasto-fixo.type";

const API_URL = "https://finances-control-backend.onrender.com/gastos-fixos";

export const GastosFixosService = {
	async listarTodos(): Promise<GastoFixo[]> {
		const res = await fetch(API_URL, { cache: "no-store" });
		if (!res.ok) throw new Error("Erro ao buscar gastos fixos");
		return res.json();
	},

	async criar(payload: GastoFixoPayload): Promise<void> {
		const res = await fetch(API_URL, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(payload),
		});
		if (!res.ok) throw new Error(await res.text());
	},

	async atualizar(id: string, payload: Partial<GastoFixoPayload>): Promise<void> {
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
		if (!res.ok) throw new Error("Erro ao deletar gasto fixo");
	},
};

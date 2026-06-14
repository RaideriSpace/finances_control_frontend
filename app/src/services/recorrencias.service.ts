import { Recorrencia, RecorrenciaPayload } from "../types/recorrencia.type";

const API_URL = "https://finances-control-backend.onrender.com/recorrencias";

export const RecorrenciasService = {
	async listarTodas(): Promise<Recorrencia[]> {
		const res = await fetch(API_URL, { cache: "no-store" });
		if (!res.ok) throw new Error("Erro ao buscar recorrências");
		return res.json();
	},

	async criar(payload: RecorrenciaPayload): Promise<void> {
		const res = await fetch(API_URL, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(payload),
		});
		if (!res.ok) throw new Error(await res.text());
	},

	async atualizar(id: string, payload: Partial<RecorrenciaPayload>): Promise<void> {
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
		if (!res.ok) throw new Error("Erro ao deletar recorrência");
	},
};

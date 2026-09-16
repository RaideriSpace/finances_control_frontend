import { Saldo, SaldoPayload } from "../types/saldo.type";
import { httpClient } from "./http-client";

export const SaldoService = {
	listarTodos: () => httpClient.get<Saldo[]>("saldo", { cache: "no-store" }),
	listarAtual: () => httpClient.get<Saldo[]>("saldo/atual", { cache: "no-store" }),
	criar: (payload: SaldoPayload) => httpClient.post<Saldo>("saldo", payload),
	atualizar: (id: string, payload: Partial<SaldoPayload>) => httpClient.patch<Saldo>(`saldo/${id}`, payload),
	deletar: (id: string) => httpClient.delete(`saldo/${id}`),
};

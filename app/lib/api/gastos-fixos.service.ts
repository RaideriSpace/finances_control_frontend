import { GastoFixo, GastoFixoPayload } from "../types/gasto-fixo.type";
import { httpClient } from "./http-client";

export const GastosFixosService = {
	listarTodos: () => httpClient.get<GastoFixo[]>("gastos-fixos", { cache: "no-store" }),
	criar: (payload: GastoFixoPayload) => httpClient.post<GastoFixo>("gastos-fixos", payload),
	atualizar: (id: string, payload: Partial<GastoFixoPayload>) => httpClient.patch<GastoFixo>(`gastos-fixos/${id}`, payload),
	deletar: (id: string) => httpClient.delete(`gastos-fixos/${id}`),
};

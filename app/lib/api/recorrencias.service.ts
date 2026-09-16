import { Recorrencia, RecorrenciaPayload } from "../types/recorrencia.type";
import { httpClient } from "./http-client";

export const RecorrenciasService = {
	listarTodas: () => httpClient.get<Recorrencia[]>("recorrencias", { cache: "no-store" }),
	criar: (payload: RecorrenciaPayload) => httpClient.post<Recorrencia>("recorrencias", payload),
	atualizar: (id: string, payload: Partial<RecorrenciaPayload>) => httpClient.patch<Recorrencia>(`recorrencias/${id}`, payload),
	deletar: (id: string) => httpClient.delete(`recorrencias/${id}`),
};

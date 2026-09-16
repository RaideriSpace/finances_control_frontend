import { Transacao, TransacaoPayload } from "../types/transacao.type";
import { httpClient } from "./http-client";

export const TransacoesService = {
	listarTodas: () => httpClient.get<Transacao[]>("transacoes", { cache: "no-store" }),
	buscarPorNome: (nome: string) => httpClient.get<Transacao[]>(`transacoes/busca/nome?nome=${encodeURIComponent(nome)}`),
	criar: (payload: TransacaoPayload) => httpClient.post<Transacao[]>("transacoes", payload),
	atualizar: (id: string, payload: Partial<TransacaoPayload>) => httpClient.patch<Transacao>(`transacoes/${id}`, payload),
	deletar: (id: string) => httpClient.delete(`transacoes/${id}`),
};

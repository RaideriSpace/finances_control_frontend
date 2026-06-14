export interface Recorrencia {
	id: string;
	compra: string;
	acao: string;
	classificacao_1: string;
	classificacao_2: string | null;
	tipo: string;
	parcelamento: number;
	parcela: number;
	local: string | null;
}

export type RecorrenciaPayload = Omit<Recorrencia, "id">;

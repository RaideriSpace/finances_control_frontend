import { TransacaoAcao, TransacaoCartao, TransacaoTipo } from "./transacao.type";

export interface Recorrencia {
	id: string;
	compra: string;
	acao: TransacaoAcao;
	classificacao_1: string;
	classificacao_2: string | null;
	tipo: TransacaoTipo;
	parcelamento: number;
	parcela: number;
	local: string | null;
	// Quando ambos definidos, o backend gera uma transação automaticamente todo mês
	// (ver GerarTransacoesRecorrentesUseCase); sem eles, o lançamento continua manual.
	valorPadrao: number | null;
	cartaoPadrao: TransacaoCartao | null;
	ultimaGeracao: string | null;
}

export type RecorrenciaPayload = Omit<Recorrencia, "id" | "ultimaGeracao">;

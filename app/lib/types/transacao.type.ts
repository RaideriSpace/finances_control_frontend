// União canônica das ações/cartões/tipos aceitos pelo backend
// (mantida em espelho de transacao.constants.ts do backend — sem "rendimento",
// que nunca existiu no enum do backend e teria sua criação rejeitada por lá).
export type TransacaoAcao = "pagamento" | "transferência" | "depósito" | "investimento" | "saque" | "compra";
export type TransacaoCartao = "picpay" | "nubank" | "inter" | "mercado_pago" | "amazon" | "swile" | "outro";
export type TransacaoTipo = "debito" | "credito";

export interface Transacao {
	id: string;
	compra: string;
	acao: TransacaoAcao;

	// Novas classificações (substituem tipo_1, tipo_2 e classificacao)
	classificacao_1: string;
	classificacao_2?: string | null;

	cartao: TransacaoCartao;
	// Conta de destino — só usada quando acao === "transferência"
	cartaoDestino?: TransacaoCartao | null;
	tipo: TransacaoTipo;
	parcelamento: number;
	parcela: number;
	valor: number;

	// Datas
	data_inicio: string;
	data_fim: string;

	// Campos opcionais/nulos no banco de dados (substituem estabelecimento e razao_social)
	local?: string | null;
	data_pagamento?: string | null;

	// Preenchido quando a transação foi gerada automaticamente por uma recorrência
	recorrenciaId?: string | null;
}

// Tipo usado apenas na hora de criar/atualizar
// Mantemos a omissão do ID, e das datas que o backend auto-calcula
export type TransacaoPayload = Omit<Transacao, "id" | "data_pagamento" | "data_fim" | "recorrenciaId">;

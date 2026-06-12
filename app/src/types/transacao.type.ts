export interface Transacao {
	id: string;
	compra: string;
	acao: "pagamento" | "transferência" | "depósito" | "investimento" | "saque" | "compra" | "rendimento";

	// Novas classificações (substituem tipo_1, tipo_2 e classificacao)
	classificacao_1: string;
	classificacao_2?: string | null;

	cartao: "picpay" | "nubank" | "inter" | "mercado_pago" | "amazon" | "swile" | "outro";
	tipo: "debito" | "credito";
	parcelamento: number;
	parcela: number;
	valor: number;

	// Datas
	data_inicio: string;
	data_fim: string;

	// Campos opcionais/nulos no banco de dados (substituem estabelecimento e razao_social)
	local?: string | null;
	data_pagamento?: string | null;
}

// Tipo usado apenas na hora de criar/atualizar
// Mantemos a omissão do ID, e das datas que o backend auto-calcula
export type TransacaoPayload = Omit<Transacao, "id" | "data_pagamento" | "data_fim">;

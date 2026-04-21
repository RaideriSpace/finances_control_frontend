export interface Transacao {
	id: string;
	compra: string;
	estabelecimento?: string;
	razao_social: string;
	acao: "pagamento" | "transferência" | "depósito" | "investimento" | "saque";
	tipo_1: string;
	tipo_2: string;
	classificacao: string;
	cartao: "picpay" | "nubank" | "inter" | "mercado_pago" | "amazon" | "swile" | "outro";
	tipo: "debito" | "credito";
	parcelamento: number;
	parcela: number;
	valor: number;
	data_inicio: string;
	data_fim: string;
}

// Tipo usado apenas na hora de criar/atualizar (sem o ID obrigatório)
export type TransacaoPayload = Omit<Transacao, "id">;

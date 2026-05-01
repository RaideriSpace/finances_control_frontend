import { TransacaoPayload } from "../../src/types/transacao.type";

// Definição dos moldes de contas fixas
export const TEMPLATES_FIXOS: Record<string, Partial<TransacaoPayload>> = {
	// PAGAMENTOS
	"Enel - Luz": {
		compra: "Conta de Luz",
		estabelecimento: "Enel",
		acao: "pagamento",
		cartao: "inter",
		tipo: "debito",
		classificacao: "Contas Fixas",
		tipo_1: "Casa",
		tipo_2: "Energia",
	},
	"NN Negócios - Aluguel": {
		compra: "Aluguel",
		estabelecimento: "NN Negócios",
		acao: "pagamento",
		cartao: "inter",
		tipo: "debito",
		classificacao: "Moradia",
		tipo_1: "Casa",
		tipo_2: "Aluguel",
	},
	"Vivo - Internet": {
		compra: "Internet Fibra",
		estabelecimento: "Vivo",
		acao: "pagamento",
		cartao: "picpay",
		tipo: "debito",
		classificacao: "Contas Fixas",
		tipo_1: "Serviços",
		tipo_2: "Internet",
	},
	// RECEBIMENTOS
	"PROA - Aulas": {
		compra: "Pagamento Aulas",
		estabelecimento: "Instituto PROA",
		acao: "depósito",
		cartao: "inter",
		tipo: "debito",
		classificacao: "Renda",
		tipo_1: "Salário",
		tipo_2: "Aulas",
	},
	"Swile - Saldo Livre": {
		compra: "Benefício Saldo Livre",
		estabelecimento: "Swile",
		acao: "depósito",
		cartao: "swile",
		tipo: "debito",
		classificacao: "Benefícios",
		tipo_1: "VR",
		tipo_2: "Saldo Livre",
	},
	"Uliving - Pagamento": {
		compra: "Reembolso/Pagamento",
		estabelecimento: "Uliving",
		acao: "depósito",
		cartao: "inter",
		tipo: "debito",
		classificacao: "Renda",
		tipo_1: "Extra",
		tipo_2: "Uliving",
	},
};

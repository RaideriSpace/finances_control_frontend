import { TransacaoPayload } from "../../src/types/transacao.type";

// Usamos Partial<TransacaoPayload> porque o valor e a data serão preenchidos no modal
export const TEMPLATES_FIXOS: Record<string, Partial<TransacaoPayload>> = {
	"Enel - Luz": {
		compra: "Conta de Luz",
		local: "Enel",
		acao: "pagamento",
		classificacao_1: "Conta",
		classificacao_2: "Moradia",
		tipo: "debito",
	},
	"NN Negócios - Aluguel": {
		compra: "Aluguel",
		local: "NN Negócios",
		acao: "pagamento",
		classificacao_1: "Conta",
		classificacao_2: "Moradia",
		tipo: "debito",
	},
	"Vivo - Internet": {
		compra: "Internet Fibra",
		local: "Vivo",
		acao: "pagamento",
		classificacao_1: "Conta",
		classificacao_2: "Moradia",
		tipo: "debito",
	},
	"PROA - Aulas": {
		compra: "Pagamento PROA",
		local: "Instituto PROA",
		acao: "rendimento",
		classificacao_1: "Educação",
		classificacao_2: "Salário",
		tipo: "credito",
	},
	"Swile - Saldo Livre": {
		compra: "Benefício Swile",
		local: "Swile",
		acao: "rendimento",
		classificacao_1: "Benefícios",
		classificacao_2: "Salário",
		cartao: "swile",
		tipo: "credito",
	},
	"Uliving - Pagamento": {
		compra: "Pagamento Uliving",
		local: "Uliving",
		acao: "pagamento",
		classificacao_1: "Moradia",
		classificacao_2: "Salário",
		tipo: "debito",
	},
	"PicPay - Rendimentos": {
		compra: "Rendimento PicPay",
		local: "PicPay",
		acao: "rendimento",
		classificacao_1: "Investimentos",
		classificacao_2: "Cofrinho",
		cartao: "picpay",
		tipo: "debito",
	},
};

import { TransacaoPayload } from "../../src/types/transacao.type";

// Usamos Partial<TransacaoPayload> porque o valor e a data serão preenchidos no modal
export const TEMPLATES_FIXOS: Record<string, Partial<TransacaoPayload>> = {
	"Enel - Luz": {
		compra: "Conta de Luz",
		local: "Enel", // <-- ATUALIZADO (era estabelecimento)
		acao: "pagamento",
		classificacao_1: "Moradia", // <-- ATUALIZADO
		tipo: "debito",
	},
	"NN Negócios - Aluguel": {
		compra: "Aluguel",
		local: "NN Negócios", // <-- ATUALIZADO
		acao: "pagamento",
		classificacao_1: "Moradia",
		tipo: "debito",
	},
	"Vivo - Internet": {
		compra: "Internet Fibra",
		local: "Vivo", // <-- ATUALIZADO
		acao: "pagamento",
		classificacao_1: "Moradia",
		tipo: "debito",
	},
	"PROA - Aulas": {
		compra: "Bolsa PROA",
		local: "Instituto PROA", // <-- ATUALIZADO
		acao: "rendimento",
		classificacao_1: "Educação",
		tipo: "credito", // ou 'debito' positivo se você registrar entradas assim
	},
	"Swile - Saldo Livre": {
		compra: "Benefício Swile",
		local: "Swile", // <-- ATUALIZADO
		acao: "rendimento",
		classificacao_1: "Benefícios",
		cartao: "swile",
		tipo: "credito",
	},
	"Uliving - Pagamento": {
		compra: "Pagamento Uliving",
		local: "Uliving", // <-- ATUALIZADO
		acao: "pagamento",
		classificacao_1: "Moradia",
		tipo: "debito",
	},
};

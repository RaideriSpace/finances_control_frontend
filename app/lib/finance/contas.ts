import { TransacaoCartao } from "../types/transacao.type";

export const CARTAO_LABELS: Record<TransacaoCartao, string> = {
	picpay: "PicPay",
	nubank: "Nubank",
	inter: "Inter",
	mercado_pago: "Mercado Pago",
	amazon: "Amazon",
	swile: "Swile",
	outro: "Outro",
};

// Cor de borda por conta — mesma paleta usada em ListaTransacoes (cartaoBorderColor),
// aqui como borda completa (não só lateral) para uso em badges/ícones circulares.
export const CARTAO_BORDER_CLASSES: Record<TransacaoCartao, string> = {
	picpay: "border-positive",
	inter: "border-secondary",
	mercado_pago: "border-auxiliary1",
	amazon: "border-auxiliary2",
	swile: "border-tertiary",
	nubank: "border-primary-light",
	outro: "border-tertiary-ex-dark",
};

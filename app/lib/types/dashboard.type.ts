import { Transacao } from "./transacao.type";

export interface DashboardResumo {
	mes: string;
	disponivel: number;
	devido: number;
	totalGasto: number;
	categorias: { nome: string; valor: number }[];
	ultimosLancamentos: Transacao[];
}

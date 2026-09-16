import { DashboardResumo } from "../types/dashboard.type";
import { httpClient } from "./http-client";

export const DashboardService = {
	obterResumoMensal: (mes?: string) => {
		const query = mes ? `?mes=${encodeURIComponent(mes)}` : "";
		return httpClient.get<DashboardResumo>(`dashboard/mensal${query}`, { cache: "no-store" });
	},
};

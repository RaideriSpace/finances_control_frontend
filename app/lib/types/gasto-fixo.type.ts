export interface GastoFixo {
	id: string;
	nome: string;
	valor: number;
}

export type GastoFixoPayload = Omit<GastoFixo, "id">;

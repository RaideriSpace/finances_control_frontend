export interface Saldo {
	id: string;
	fonte: string;
	valor: number | null;
	mes: string | null;
}

export type SaldoPayload = Omit<Saldo, "id">;

export interface Saldo {
	id: string;
	fonte: string;
	valor: number | null;
	mes: string | null;
}

// `mes` é opcional na criação: quando omitido, o backend calcula o mês de
// referência a partir do dia de reset da fonte (ver saldo.rules.ts).
export type SaldoPayload = Omit<Saldo, "id" | "mes"> & { mes?: string };

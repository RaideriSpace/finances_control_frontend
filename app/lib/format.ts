export function formatarMoeda(valor: number): string {
	return new Intl.NumberFormat("pt-BR", {
		style: "currency",
		currency: "BRL",
	}).format(valor);
}

export function formatarData(data: string): string {
	const [ano, mes, dia] = data.split("T")[0].split("-");
	return `${dia}/${mes}/${ano}`;
}

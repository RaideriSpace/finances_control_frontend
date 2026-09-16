import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { ToastProvider } from "@/app/components/ToastProvider";
import { ConfirmProvider } from "@/app/components/ConfirmDialog";
import { ListaTransacoes } from "./ListaTransacoes";

function renderComProviders(children: React.ReactNode) {
	return render(
		<ToastProvider>
			<ConfirmProvider>{children}</ConfirmProvider>
		</ToastProvider>,
	);
}

describe("ListaTransacoes", () => {
	it("mostra o estado vazio quando não há transações", () => {
		renderComProviders(<ListaTransacoes initialData={[]} />);
		expect(screen.getByText("Nenhuma transação encontrada.")).toBeInTheDocument();
	});

	it("lista uma transação e formata o valor em BRL", () => {
		renderComProviders(
			<ListaTransacoes
				initialData={[
					{
						id: "1",
						compra: "Assinatura Netflix",
						acao: "pagamento",
						classificacao_1: "Assinaturas",
						classificacao_2: null,
						cartao: "nubank",
						tipo: "debito",
						parcelamento: 1,
						parcela: 1,
						valor: 39.9,
						data_inicio: "2026-09-05",
						data_fim: "2026-09-05",
						local: null,
						data_pagamento: "2026-09-05",
					},
				]}
			/>,
		);

		expect(screen.getByText("Assinatura Netflix")).toBeInTheDocument();
		expect(screen.getByText(/39,90/)).toBeInTheDocument();
	});
});

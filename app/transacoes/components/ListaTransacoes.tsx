"use client";

import { useState } from "react";
import { TransacaoActions } from "./TransacaoActions";

interface Transacao {
	id: number;
	estabelecimento: string;
	descricao: string;
	valor: number;
}

export function ListaTransacoes({ initialData }: { initialData: Transacao[] }) {
	// Estado local para permitir que a lista mude quando deletarmos algo
	const [transacoes, setTransacoes] = useState<Transacao[]>(initialData);

	// Função para remover da tela após o delete no banco ter sucesso
	const removerDaLista = (id: number) => {
		setTransacoes((prev) => prev.filter((t) => t.id !== id));
	};

	if (transacoes.length === 0) {
		return (
			<div className="text-center p-10 bg-gray-50 rounded-xl border-2 border-dashed">
				<p className="text-gray-500">Nenhuma transação encontrada.</p>
			</div>
		);
	}

	return (
		<div className="grid gap-4">
			{transacoes.map((item) => (
				<div
					key={item.id}
					className="flex justify-between items-center p-5 border rounded-xl shadow-sm bg-white hover:border-blue-200 transition-colors">
					<div className="flex flex-col">
						<span className="font-bold text-lg text-gray-800">{item.estabelecimento || "Estabelecimento não informado"}</span>
						<span className="text-sm text-gray-500">{item.descricao}</span>
						<span className={`text-lg font-bold mt-1 ${item.valor < 0 ? "text-red-500" : "text-green-600"}`}>
							{new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(item.valor)}
						</span>
					</div>

					{/* Passamos o ID e a função de atualizar a lista para as ações */}
					<TransacaoActions id={item.id} onDelete={removerDaLista} />
				</div>
			))}
		</div>
	);
}

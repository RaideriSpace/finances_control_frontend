"use client";

import { TransacoesService } from "../../src/services/transacoes.service";
import { Transacao } from "../../src/types/transacao.type";

interface Props {
	transacao: Transacao;
	onDeleteSuccess: (id: string) => void;
	onEdit: (transacao: Transacao) => void;
}

export function TransacaoActions({ transacao, onDeleteSuccess, onEdit }: Props) {
	const handleDelete = async () => {
		// Texto de confirmação um pouco mais profissional
		if (confirm("Tem certeza que deseja deletar permanentemente esta transação?")) {
			try {
				await TransacoesService.deletar(transacao.id);
				onDeleteSuccess(transacao.id);
			} catch (error) {
				alert("Erro ao deletar transação.");
			}
		}
	};

	return (
		<div className="flex gap-2 w-full md:w-auto mt-4 md:mt-0">
			<button
				onClick={() => onEdit(transacao)}
				className="flex-1 md:flex-none bg-slate-800 hover:bg-slate-700 text-indigo-400 px-4 py-2 rounded-lg font-semibold text-sm transition-colors border border-slate-700 hover:border-indigo-500/50">
				Editar
			</button>
			<button
				onClick={handleDelete}
				className="flex-1 md:flex-none bg-slate-800 hover:bg-slate-700 text-rose-400 px-4 py-2 rounded-lg font-semibold text-sm transition-colors border border-slate-700 hover:border-rose-500/50">
				Deletar
			</button>
		</div>
	);
}

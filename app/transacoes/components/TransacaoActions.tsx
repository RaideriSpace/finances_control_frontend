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
		if (confirm("Tem certeza que deseja deletar?")) {
			try {
				await TransacoesService.deletar(transacao.id);
				onDeleteSuccess(transacao.id);
			} catch (error) {
				alert("Erro ao deletar");
			}
		}
	};

	return (
		<div className="flex gap-2">
			<button onClick={() => onEdit(transacao)} className="text-blue-600">
				Editar
			</button>
			<button onClick={handleDelete} className="text-red-600">
				Deletar
			</button>
		</div>
	);
}

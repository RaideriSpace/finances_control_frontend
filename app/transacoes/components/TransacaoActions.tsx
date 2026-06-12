"use client";

import { FaEdit } from "react-icons/fa";
import { TransacoesService } from "../../src/services/transacoes.service";
import { Transacao } from "../../src/types/transacao.type";
import { FaTrashCan } from "react-icons/fa6";

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
		<div className="flex items-center justify-center gap-xs">
			{/* Botão de Editar */}
			<button
				onClick={() => onEdit(transacao)}
				title="Editar transação"
				className="p-xs bg-dark hover:bg-primary-dark/40 text-primary-ex-light border border-dark-light hover:border-primary/50 rounded-s transition-all duration-200 hover:scale-110 shadow-sm"
				aria-label="Editar transação">
				<FaEdit className="w-4 h-4" />
			</button>

			{/* Botão de Deletar */}
			<button
				onClick={handleDelete}
				title="Deletar transação"
				className="p-xs bg-dark hover:bg-negative/10 text-negative border border-dark-light hover:border-negative/40 rounded-s transition-all duration-200 hover:scale-110 shadow-sm"
				aria-label="Deletar transação">
				<FaTrashCan className="w-4 h-4" />
			</button>
		</div>
	);
}

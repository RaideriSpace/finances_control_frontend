"use client";

import { useState } from "react";
import { AddTransacaoButton } from "./AddTransacaoButton"; // O seu botão original
import { ModalContasFixas } from "./ModalContasFixas";
import { IoBookmarks } from "react-icons/io5";

export function AcoesRapidas() {
	const [modalFixasOpen, setModalFixasOpen] = useState(false);

	const handleSuccess = () => {
		// Recarrega a página para atualizar a lista e os BigNumbers
		window.location.reload();
	};

	return (
		<div className="flex flex-wrap gap-3">
			{/* Botão de Contas Fixas */}
			<button
				onClick={() => setModalFixasOpen(true)}
				className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold py-2.5 px-5 rounded-xl border border-slate-700 transition-all active:scale-95 shadow-lg">
				<IoBookmarks className="text-indigo-400" />
				<span className="hidden sm:inline">Contas Fixas</span>
			</button>

			{/* Seu botão de adicionar transação comum */}
			<AddTransacaoButton />

			{/* O Modal que criamos anteriormente */}
			<ModalContasFixas isOpen={modalFixasOpen} onClose={() => setModalFixasOpen(false)} onSuccess={handleSuccess} />
		</div>
	);
}

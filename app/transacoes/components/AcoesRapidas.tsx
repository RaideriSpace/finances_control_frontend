"use client";

import { useState } from "react";
import { AddTransacaoButton } from "./AddTransacaoButton";
import { ModalContasFixas } from "./ModalContasFixas";
import { IoBookmarks } from "react-icons/io5";

export function AcoesRapidas() {
	const [modalFixasOpen, setModalFixasOpen] = useState(false);

	return (
		<div className="flex items-center gap-xs">
			{/* Contas Fixas — ação secundária, estilo ghost */}
			<button
				onClick={() => setModalFixasOpen(true)}
				className="flex items-center gap-xs border border-primary-light/50 hover:border-primary-light text-primary-ex-light hover:text-white px-m py-xs rounded-s font-bold transition-all active:scale-95">
				<IoBookmarks className="w-4 h-4 text-secondary-light flex-shrink-0" />
				<span className="hidden sm:inline text-sm">Contas Fixas</span>
			</button>

			{/* Nova Transação — ação principal */}
			<AddTransacaoButton />

			<ModalContasFixas isOpen={modalFixasOpen} onClose={() => setModalFixasOpen(false)} onSuccess={() => window.location.reload()} />
		</div>
	);
}

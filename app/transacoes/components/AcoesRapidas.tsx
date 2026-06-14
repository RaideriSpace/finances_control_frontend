"use client";

import { useState } from "react";
import { AddTransacaoButton } from "./AddTransacaoButton";
import { ModalContasFixas } from "./ModalContasFixas";
import { IoBookmarks } from "react-icons/io5";
import { Transacao } from "../../src/types/transacao.type";

interface AcoesRapidasProps {
	data: Transacao[];
}

export function AcoesRapidas({ data }: AcoesRapidasProps) {
	const [modalFixasOpen, setModalFixasOpen] = useState(false);

	return (
		<div className="flex items-center gap-xs">
			{/* Contas Fixas — ghost com borda e brilho no hover */}
			<button
				onClick={() => setModalFixasOpen(true)}
				className="
					relative flex items-center gap-xs
					px-m py-xs rounded-s
					font-bold text-sm
					border border-primary-light/30 hover:border-primary-light/70
					text-primary-ex-light hover:text-white
					transition-all duration-200 active:scale-95
					overflow-hidden group
				">
				{/* Brilho sutil no hover */}
				<span className="absolute inset-0 bg-primary-dark/0 group-hover:bg-primary-dark/40 transition-colors duration-200" />

				<span className="relative flex items-center justify-center w-5 h-5 rounded-full bg-primary-dark/60 border border-primary/30 flex-shrink-0">
					<IoBookmarks className="w-3 h-3 text-secondary-light" />
				</span>
				<span className="relative hidden sm:inline">Contas Fixas</span>
			</button>

			<AddTransacaoButton transacoes={data} />

			<ModalContasFixas isOpen={modalFixasOpen} onClose={() => setModalFixasOpen(false)} onSuccess={() => window.location.reload()} />
		</div>
	);
}

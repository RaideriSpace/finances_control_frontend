"use client";

import { useState, useMemo } from "react";
import { IoClose, IoAdd } from "react-icons/io5";
import { FormularioTransacao } from "./FormularioTransacao";
import { Transacao } from "../../src/types/transacao.type";

interface AddTransacaoButtonProps {
	transacoes: Transacao[];
}

export function AddTransacaoButton({ transacoes }: AddTransacaoButtonProps) {
	const [isOpen, setIsOpen] = useState(false);

	const categoriasExistentes = useMemo(() => {
		const classifs = transacoes.map((t) => t.classificacao_1).filter(Boolean);
		return Array.from(new Set(classifs)).sort();
	}, [transacoes]);

	return (
		<>
			<button
				onClick={() => setIsOpen(true)}
				className="
					relative flex items-center gap-xs
					px-m py-xs rounded-s
					font-bold text-sm text-white
					bg-gradient-to-r from-secondary to-secondary-light
					hover:from-secondary-dark hover:to-secondary
					shadow-lg shadow-secondary/30
					border border-secondary-light/30
					transition-all duration-300 active:scale-95
					overflow-hidden group
				">
				<span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

				<span className="relative flex items-center justify-center w-5 h-5 rounded-full bg-white/20 flex-shrink-0">
					<IoAdd className="w-4 h-4" />
				</span>
				<span className="relative">Nova Transação</span>
			</button>

			{isOpen && (
				<div
					className="fixed inset-0 flex items-center justify-center z-[1001] p-m"
					style={{ backgroundColor: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)" }}>
					<div className="bg-dark border border-dark-light rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
						<div className="flex items-center justify-between px-xl pt-l pb-m border-b border-dark-light">
							<h2 className="text-white font-space-grotesk font-bold text-xl flex items-center gap-s">
								<span className="w-8 h-8 rounded-s bg-secondary-dark/50 border border-secondary/30 flex items-center justify-center text-secondary-light">
									<IoAdd className="w-4 h-4" />
								</span>
								Nova Transação
							</h2>
							<button
								type="button"
								onClick={() => setIsOpen(false)}
								className="p-xs rounded-full hover:bg-white/10 text-auxiliary2-light hover:text-white transition-colors">
								<IoClose className="w-6 h-6" />
							</button>
						</div>

						<div className="p-xl">
							<FormularioTransacao
								categoriasExistentes={categoriasExistentes}
								onSuccess={() => {
									setIsOpen(false);
									window.location.reload();
								}}
								onCancel={() => setIsOpen(false)}
							/>
						</div>
					</div>
				</div>
			)}
		</>
	);
}

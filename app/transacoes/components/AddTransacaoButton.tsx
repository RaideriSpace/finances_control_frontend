"use client";

import { useState } from "react";
import { IoClose, IoAdd } from "react-icons/io5";
import { FormularioTransacao } from "./FormularioTransacao";

export function AddTransacaoButton({ classificacoesExistentes }: { classificacoesExistentes?: string[] }) {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<>
			<button
				onClick={() => setIsOpen(true)}
				className="flex items-center gap-xs bg-secondary hover:bg-secondary-dark text-white px-m py-xs rounded-s font-bold shadow-lg shadow-secondary/20 transition-all active:scale-95">
				<IoAdd className="w-5 h-5" />
				<span>Nova Transação</span>
			</button>

			{isOpen && (
				<div
					className="fixed inset-0 flex items-center justify-center z-[1001] p-m"
					style={{ backgroundColor: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)" }}>
					<div className="bg-dark border border-dark-light rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
						{/* Header do modal */}
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

						{/* Formulário */}
						<div className="p-xl">
							<FormularioTransacao
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

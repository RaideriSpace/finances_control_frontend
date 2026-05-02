"use client";

import { useState } from "react";
import { FormularioTransacao } from "./FormularioTransacao";

// 1. Adicionamos a propriedade classificacoesExistentes
export function AddTransacaoButton({ classificacoesExistentes }: { classificacoesExistentes?: string[] }) {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<>
			<button
				onClick={() => setIsOpen(true)}
				className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-indigo-500/20 transition-all flex items-center gap-2">
				<span className="text-lg leading-none">+</span> Nova Transação
			</button>

			{isOpen && (
				<div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity">
					<div className="dark-scrollbar bg-slate-900 border border-slate-700 p-6 sm:p-8 rounded-[2rem] w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl shadow-black/50 pr-4 sm:pr-6">
						<h2 className="text-2xl font-black text-slate-100 mb-6 flex items-center gap-3">
							<span className="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-sm">💰</span>
							Nova Transação
						</h2>

						<FormularioTransacao							onSuccess={() => {
								setIsOpen(false);
								window.location.reload();
							}}
							onCancel={() => setIsOpen(false)}
						/>
					</div>
				</div>
			)}
		</>
	);
}

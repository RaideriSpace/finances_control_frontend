// Dentro do seu componente de página ou um componente novo AddButton.tsx
"use client";
import { useState } from "react";
import { FormularioTransacao } from "./FormularioTransacao";

export function AddTransacaoButton() {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<>
			<button
				onClick={() => setIsOpen(true)}
				className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg mb-6 shadow-md transition">
				+ Nova Transação
			</button>

			{isOpen && (
				<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
					<div className="bg-white p-6 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
						<h2 className="text-2xl font-bold mb-6">Nova Transação</h2>
						<FormularioTransacao
							onSuccess={() => {
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

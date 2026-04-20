"use client";

import { useState } from "react";

export function FormularioTransacao({ onSuccess, onCancel }: { onSuccess: () => void; onCancel: () => void }) {
	const [loading, setLoading] = useState(false);
	const [formData, setFormData] = useState({
		compra: "",
		estabelecimento: "",
		razao_social: "",
		acao: "",
		tipo_1: "",
		tipo_2: "",
		classificacao: "",
		cartao: "",
		tipo: "Débito",
		parcelamento: 1,
		parcela: 1,
		valor: "",
		data_inicio: "",
		data_fim: "",
	});

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);

		// Ajuste do Payload para o formato exato que o seu Backend espera
		const payload = {
			...formData,
			valor: parseFloat(formData.valor),
			parcelamento: formData.tipo === "Débito" ? 1 : Number(formData.parcelamento),
			parcela: formData.tipo === "Débito" ? 1 : Number(formData.parcela),
			// Se for débito, a data_fim é igual a data_inicio
			data_fim: formData.tipo === "Débito" ? new Date(formData.data_inicio).toISOString() : new Date(formData.data_fim).toISOString(),
			data_inicio: new Date(formData.data_inicio).toISOString(),
		};

		try {
			const res = await fetch("https://finances-control-backend.onrender.com/transacoes", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(payload),
			});

			if (res.ok) {
				onSuccess();
			} else {
				const errorData = await res.json();
				alert(`Erro: ${errorData.message || "Falha ao salvar"}`);
			}
		} catch (error) {
			console.error("Erro na requisição:", error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 text-xs lg:text-sm">
			{/* Nome da Compra */}
			<div className="col-span-2">
				<label className="block font-bold mb-1">Nome da Compra (Item)</label>
				<input
					required
					className="w-full border p-2 rounded shadow-sm focus:ring-2 focus:ring-blue-500"
					value={formData.compra}
					onChange={(e) => setFormData({ ...formData, compra: e.target.value })}
				/>
			</div>

			{/* Estabelecimento e Razão Social */}
			<div>
				<label className="block font-bold mb-1">Estabelecimento</label>
				<input
					className="w-full border p-2 rounded shadow-sm"
					value={formData.estabelecimento}
					onChange={(e) => setFormData({ ...formData, estabelecimento: e.target.value })}
				/>
			</div>
			<div>
				<label className="block font-bold mb-1">Razão Social</label>
				<input
					required
					className="w-full border p-2 rounded shadow-sm"
					value={formData.razao_social}
					onChange={(e) => setFormData({ ...formData, razao_social: e.target.value })}
				/>
			</div>

			{/* Ação e Cartão */}
			<div>
				<label className="block font-bold mb-1">Ação</label>
				<input
					required
					placeholder="Ex: Compra, Estorno"
					className="w-full border p-2 rounded shadow-sm"
					value={formData.acao}
					onChange={(e) => setFormData({ ...formData, acao: e.target.value })}
				/>
			</div>
			<div>
				<label className="block font-bold mb-1">Cartão Usado</label>
				<input
					required
					placeholder="Ex: Nubank, Inter"
					className="w-full border p-2 rounded shadow-sm"
					value={formData.cartao}
					onChange={(e) => setFormData({ ...formData, cartao: e.target.value })}
				/>
			</div>

			{/* Tipos e Classificação */}
			<div>
				<label className="block font-bold mb-1">Tipo 1 (Principal)</label>
				<input
					required
					placeholder="Ex: Alimentação"
					className="w-full border p-2 rounded shadow-sm"
					value={formData.tipo_1}
					onChange={(e) => setFormData({ ...formData, tipo_1: e.target.value })}
				/>
			</div>
			<div>
				<label className="block font-bold mb-1">Tipo 2 (Subtipo)</label>
				<input
					className="w-full border p-2 rounded shadow-sm"
					value={formData.tipo_2}
					onChange={(e) => setFormData({ ...formData, tipo_2: e.target.value })}
				/>
			</div>
			<div className="col-span-2">
				<label className="block font-bold mb-1">Classificação</label>
				<input
					required
					placeholder="Ex: Essencial, Lazer"
					className="w-full border p-2 rounded shadow-sm"
					value={formData.classificacao}
					onChange={(e) => setFormData({ ...formData, classificacao: e.target.value })}
				/>
			</div>

			{/* Financeiro */}
			<div>
				<label className="block font-bold mb-1">Valor</label>
				<input
					required
					type="number"
					step="0.01"
					className="w-full border p-2 rounded shadow-sm font-mono"
					value={formData.valor}
					onChange={(e) => setFormData({ ...formData, valor: e.target.value })}
				/>
			</div>
			<div>
				<label className="block font-bold mb-1">Tipo Pagamento</label>
				<select
					className="w-full border p-2 rounded shadow-sm"
					value={formData.tipo}
					onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}>
					<option value="Débito">Débito</option>
					<option value="Crédito">Crédito</option>
				</select>
			</div>

			{/* Condicionais de Crédito */}
			{formData.tipo === "Crédito" && (
				<>
					<div>
						<label className="block font-bold mb-1">Total Parcelas</label>
						<input
							type="number"
							className="w-full border p-2 rounded shadow-sm"
							value={formData.parcelamento}
							onChange={(e) => setFormData({ ...formData, parcelamento: parseInt(e.target.value) })}
						/>
					</div>
					<div>
						<label className="block font-bold mb-1">Parcela Atual</label>
						<input
							type="number"
							className="w-full border p-2 rounded shadow-sm"
							value={formData.parcela}
							onChange={(e) => setFormData({ ...formData, parcela: parseInt(e.target.value) })}
						/>
					</div>
					<div>
						<label className="block font-bold mb-1">Data Fim</label>
						<input
							required
							type="date"
							className="w-full border p-2 rounded shadow-sm"
							value={formData.data_fim}
							onChange={(e) => setFormData({ ...formData, data_fim: e.target.value })}
						/>
					</div>
				</>
			)}

			<div>
				<label className="block font-bold mb-1">{formData.tipo === "Crédito" ? "Data Início" : "Data"}</label>
				<input
					required
					type="date"
					className="w-full border p-2 rounded shadow-sm"
					value={formData.data_inicio}
					onChange={(e) => setFormData({ ...formData, data_inicio: e.target.value })}
				/>
			</div>

			{/* Botões */}
			<div className="col-span-2 flex justify-end gap-3 mt-6 border-t pt-4">
				<button type="button" onClick={onCancel} className="text-gray-500 font-semibold hover:text-gray-700 transition">
					Cancelar
				</button>
				<button
					type="submit"
					disabled={loading}
					className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 rounded-xl font-bold shadow-lg disabled:bg-gray-400 transition">
					{loading ? "Processando..." : "Salvar Transação"}
				</button>
			</div>
		</form>
	);
}

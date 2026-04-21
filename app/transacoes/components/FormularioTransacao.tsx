"use client";

import { useState } from "react";
import { TransacoesService } from "../../src/services/transacoes.service";

// Adicionamos o initialData como opcional (?)
export function FormularioTransacao({ onSuccess, onCancel, initialData }: { onSuccess: () => void; onCancel: () => void; initialData?: any }) {
	const [loading, setLoading] = useState(false);

	// Função para garantir que a data que vem do banco (com T00:00:00Z) caiba no input type="date"
	const formatarDataInput = (data?: string) => (data ? data.split("T")[0] : "");

	// O estado inicial agora tenta pegar os dados do initialData. Se não tiver, usa o padrão vazio.
	const [formData, setFormData] = useState({
		compra: initialData?.compra || "",
		estabelecimento: initialData?.estabelecimento || "",
		razao_social: initialData?.razao_social || "",
		acao: initialData?.acao || "pagamento",
		tipo_1: initialData?.tipo_1 || "",
		tipo_2: initialData?.tipo_2 || "",
		classificacao: initialData?.classificacao || "",
		cartao: initialData?.cartao || "nubank",
		tipo: initialData?.tipo || "debito",
		parcelamento: initialData?.parcelamento || 1,
		parcela: initialData?.parcela || 1,
		valor: initialData?.valor || "",
		data_inicio: formatarDataInput(initialData?.data_inicio),
		data_fim: formatarDataInput(initialData?.data_fim),
	});

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);

		const formatarDataParaBanco = (dataString: string): string => {
			if (!dataString) return ""; // Retorna string vazia ao invés de null
			return dataString.split("T")[0];
		};
		const payload = {
			...formData,
			valor: parseFloat(String(formData.valor)),
			parcelamento: formData.tipo === "debito" ? 1 : Number(formData.parcelamento),
			parcela: formData.tipo === "debito" ? 1 : Number(formData.parcela),
			data_inicio: formatarDataParaBanco(formData.data_inicio),
			data_fim: formData.tipo === "debito" ? formatarDataParaBanco(formData.data_inicio) : formatarDataParaBanco(formData.data_fim),
			tipo_2: formData.tipo_2 || null,
		}; 

		try {
			if (initialData) {
				await TransacoesService.atualizar(initialData.id, payload);
			} else {
				await TransacoesService.criar(payload);
			}
			onSuccess();
		} catch (error) {
			console.error(error);
			alert("Falha ao salvar transação. Verifique os dados.");
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

			{/* Ação */}
			<div>
				<label className="block font-bold mb-1">Ação</label>
				<select
					required
					className="w-full border p-2 rounded shadow-sm bg-white"
					value={formData.acao}
					onChange={(e) => setFormData({ ...formData, acao: e.target.value })}>
					<option value="pagamento">Pagamento</option>
					<option value="transferência">Transferência</option>
					<option value="depósito">Depósito</option>
					<option value="investimento">Investimento</option>
					<option value="saque">Saque</option>
				</select>
			</div>

			{/* Cartão */}
			<div>
				<label className="block font-bold mb-1">Cartão Usado</label>
				<select
					required
					className="w-full border p-2 rounded shadow-sm bg-white"
					value={formData.cartao}
					onChange={(e) => setFormData({ ...formData, cartao: e.target.value })}>
					<option value="picpay">PicPay</option>
					<option value="nubank">Nubank</option>
					<option value="inter">Inter</option>
					<option value="mercado_pago">Mercado Pago</option>
					<option value="amazon">Amazon</option>
					<option value="swile">Swile</option>
					<option value="outro">Outro</option>
				</select>
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
			{/* Tipo Pagamento */}
			<div>
				<label className="block font-bold mb-1">Tipo Pagamento</label>
				<select
					className="w-full border p-2 rounded shadow-sm bg-white"
					value={formData.tipo}
					onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}>
					<option value="debito">Débito</option>
					<option value="credito">Crédito</option>
				</select>
			</div>

			{/* Condicionais de Crédito */}
			{formData.tipo === "credito" && (
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
				<label className="block font-bold mb-1">{formData.tipo === "credito" ? "Data Início" : "Data"}</label>
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
					{loading ?
						"Processando..."
					: initialData ?
						"Salvar Alterações"
					:	"Salvar Transação"}
				</button>
			</div>
		</form>
	);
}

"use client";

import { useState } from "react";
import { TransacoesService } from "../../src/services/transacoes.service";

export function FormularioTransacao({ onSuccess, onCancel, initialData }: { onSuccess: () => void; onCancel: () => void; initialData?: any }) {
	const [loading, setLoading] = useState(false);

	const formatarDataInput = (data?: string) => (data ? data.split("T")[0] : "");

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
	});

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);

		const formatarDataParaBanco = (dataString: string): string => {
			if (!dataString) return "";
			return dataString.split("T")[0];
		};

		const payload = {
			...formData,
			valor: parseFloat(String(formData.valor)),
			parcelamento: formData.tipo === "debito" ? 1 : Number(formData.parcelamento),
			parcela: formData.tipo === "debito" ? 1 : Number(formData.parcela),
			data_inicio: formatarDataParaBanco(formData.data_inicio),
			tipo_2: formData.tipo_2 || undefined, // Mantido como undefined para evitar erro do TS
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

	// Variáveis de Estilo para padronizar e limpar o JSX
	const inputClass =
		"w-full bg-slate-800 text-slate-100 border border-slate-700 p-2.5 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all placeholder-slate-500 shadow-inner";
	const labelClass = "block text-sm font-medium text-slate-300 mb-1.5";

	return (
		<form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm">
			{/* Nome da Compra */}
			<div className="sm:col-span-2">
				<label className={labelClass}>Nome da Compra (Item)</label>
				<input
					required
					placeholder="Ex: Supermercado Extra, Assinatura Netflix..."
					className={inputClass}
					value={formData.compra}
					onChange={(e) => setFormData({ ...formData, compra: e.target.value })}
				/>
			</div>

			{/* Estabelecimento e Razão Social */}
			<div>
				<label className={labelClass}>Estabelecimento</label>
				<input
					placeholder="Ex: Mercado Extra"
					className={inputClass}
					value={formData.estabelecimento}
					onChange={(e) => setFormData({ ...formData, estabelecimento: e.target.value })}
				/>
			</div>
			<div>
				<label className={labelClass}>Razão Social</label>
				<input
					required
					placeholder="Ex: Cia Brasileira de Distribuicao"
					className={inputClass}
					value={formData.razao_social}
					onChange={(e) => setFormData({ ...formData, razao_social: e.target.value })}
				/>
			</div>

			{/* Ação e Cartão */}
			<div>
				<label className={labelClass}>Ação</label>
				<select required className={inputClass} value={formData.acao} onChange={(e) => setFormData({ ...formData, acao: e.target.value })}>
					<option value="pagamento">Pagamento</option>
					<option value="transferência">Transferência</option>
					<option value="depósito">Depósito</option>
					<option value="investimento">Investimento</option>
					<option value="saque">Saque</option>
				</select>
			</div>
			<div>
				<label className={labelClass}>Cartão Usado</label>
				<select required className={inputClass} value={formData.cartao} onChange={(e) => setFormData({ ...formData, cartao: e.target.value })}>
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
				<label className={labelClass}>Tipo 1 (Principal)</label>
				<input
					required
					placeholder="Ex: Alimentação"
					className={inputClass}
					value={formData.tipo_1}
					onChange={(e) => setFormData({ ...formData, tipo_1: e.target.value })}
				/>
			</div>
			<div>
				<label className={labelClass}>Tipo 2 (Subtipo)</label>
				<input
					placeholder="Ex: Supermercado"
					className={inputClass}
					value={formData.tipo_2}
					onChange={(e) => setFormData({ ...formData, tipo_2: e.target.value })}
				/>
			</div>
			<div className="sm:col-span-2">
				<label className={labelClass}>Classificação</label>
				<input
					required
					placeholder="Ex: Essencial, Lazer"
					className={inputClass}
					value={formData.classificacao}
					onChange={(e) => setFormData({ ...formData, classificacao: e.target.value })}
				/>
			</div>

			{/* Financeiro */}
			<div>
				<label className={labelClass}>Valor (R$)</label>
				<input
					required
					type="number"
					step="0.01"
					placeholder="0.00"
					className={`${inputClass} font-mono text-indigo-300`}
					value={formData.valor}
					onChange={(e) => setFormData({ ...formData, valor: e.target.value })}
				/>
			</div>
			<div>
				<label className={labelClass}>Tipo Pagamento</label>
				<select className={inputClass} value={formData.tipo} onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}>
					<option value="debito">Débito</option>
					<option value="credito">Crédito</option>
				</select>
			</div>

			{/* Condicionais de Crédito */}
			{formData.tipo === "credito" && (
				<>
					<div>
						<label className={labelClass}>Total Parcelas</label>
						<input
							type="number"
							min="1"
							className={inputClass}
							value={formData.parcelamento}
							onChange={(e) => setFormData({ ...formData, parcelamento: parseInt(e.target.value) })}
						/>
					</div>
					<div>
						<label className={labelClass}>Parcela Atual</label>
						<input
							type="number"
							min="1"
							className={inputClass}
							value={formData.parcela}
							onChange={(e) => setFormData({ ...formData, parcela: parseInt(e.target.value) })}
						/>
					</div>
				</>
			)}

			<div>
				<label className={labelClass}>{formData.tipo === "credito" ? "Data Início" : "Data"}</label>
				<input
					required
					type="date"
					className={inputClass}
					value={formData.data_inicio}
					onChange={(e) => setFormData({ ...formData, data_inicio: e.target.value })}
				/>
			</div>

			{/* Botões */}
			<div className="sm:col-span-2 flex justify-end gap-4 mt-4 border-t border-slate-700 pt-6">
				<button type="button" onClick={onCancel} className="text-slate-400 font-semibold hover:text-slate-200 transition-colors px-4 py-2">
					Cancelar
				</button>
				<button
					type="submit"
					disabled={loading}
					className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-2.5 rounded-xl font-bold shadow-lg shadow-indigo-500/20 disabled:bg-slate-700 disabled:text-slate-500 disabled:shadow-none transition-all">
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

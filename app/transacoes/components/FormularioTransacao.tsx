"use client";

import { useState } from "react";
import { TransacoesService } from "../../src/services/transacoes.service";
import { Transacao, TransacaoPayload } from "../../src/types/transacao.type";
import { IoCard, IoWallet, IoPricetag, IoStorefront, IoCalendar, IoCash, IoSwapHorizontal, IoLayers } from "react-icons/io5";

interface FormularioTransacaoProps {
	onSuccess: () => void;
	onCancel: () => void;
	initialData?: Transacao;
}

const ACOES = ["compra", "pagamento", "transferência", "depósito", "investimento", "saque"] as const;
const CARTOES = ["picpay", "nubank", "inter", "mercado_pago", "amazon", "swile", "outro"] as const;

const CARTAO_LABELS: Record<string, string> = {
	picpay: "PicPay",
	nubank: "Nubank",
	inter: "Banco Inter",
	mercado_pago: "Mercado Pago",
	amazon: "Amazon",
	swile: "Swile",
	outro: "Outro",
};

export function FormularioTransacao({ onSuccess, onCancel, initialData }: FormularioTransacaoProps) {
	const [loading, setLoading] = useState(false);

	const [formData, setFormData] = useState({
		compra: initialData?.compra || "",
		local: initialData?.local || "",
		acao: initialData?.acao || "compra",
		classificacao_1: initialData?.classificacao_1 || "",
		classificacao_2: initialData?.classificacao_2 || "",
		cartao: initialData?.cartao || "picpay",
		tipo: initialData?.tipo || "debito",
		parcelamento: initialData?.parcelamento || 1,
		parcela: initialData?.parcela || 1,
		valor: initialData?.valor || "",
		data_inicio: initialData?.data_inicio ? initialData.data_inicio.split("T")[0] : new Date().toISOString().split("T")[0],
	});

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);

		const payload: TransacaoPayload = {
			...formData,
			valor: Number(formData.valor),
			parcelamento: formData.tipo === "debito" ? 1 : Number(formData.parcelamento),
			parcela: formData.tipo === "debito" ? 1 : Number(formData.parcela),
			data_inicio: new Date(formData.data_inicio).toISOString(),
		};

		try {
			if (initialData?.id) {
				await TransacoesService.atualizar(initialData.id, payload);
			} else {
				await TransacoesService.criar(payload);
			}
			onSuccess();
		} catch (error) {
			console.error(error);
			alert("Falha ao salvar. Verifique os dados.");
		} finally {
			setLoading(false);
		}
	};

	const inputClass =
		"w-full h-fit bg-dark-dark border border-dark-light rounded-s py-xs px-s text-sm text-white placeholder-auxiliary1 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all";
	const labelClass = "flex items-center gap-xs text-[10px] font-bold text-auxiliary2-light uppercase tracking-widest mb-xs";
	const iconClass = "w-3 h-3 text-auxiliary1-light";

	return (
		<form onSubmit={handleSubmit} className="space-y-m text-sm">
			{/* ===== BLOCO: IDENTIFICAÇÃO ===== */}
			<div className="space-y-s">
				<p className="text-[10px] font-bold text-primary-ex-light uppercase tracking-widest border-b border-dark-light pb-xs">Identificação</p>

				<div className="grid grid-cols-1 sm:grid-cols-2 gap-s">
					<div className="sm:col-span-2">
						<label className={labelClass}>
							<IoPricetag className={iconClass} /> Nome da compra
						</label>
						<input
							required
							placeholder="Ex: Assinatura Netflix"
							className={inputClass}
							value={formData.compra}
							onChange={(e) => setFormData({ ...formData, compra: e.target.value })}
						/>
					</div>

					<div>
						<label className={labelClass}>
							<IoStorefront className={iconClass} /> Local
						</label>
						<input
							placeholder="Ex: Mercado Extra"
							className={inputClass}
							value={formData.local}
							onChange={(e) => setFormData({ ...formData, local: e.target.value })}
						/>
					</div>

					<div>
						<label className={labelClass}>
							<IoSwapHorizontal className={iconClass} /> Ação
						</label>
						<select className={inputClass} value={formData.acao} onChange={(e) => setFormData({ ...formData, acao: e.target.value as any })}>
							{ACOES.map((opt) => (
								<option key={opt} value={opt}>
									{opt.charAt(0).toUpperCase() + opt.slice(1)}
								</option>
							))}
						</select>
					</div>
				</div>
			</div>

			{/* ===== BLOCO: CLASSIFICAÇÃO ===== */}
			<div className="space-y-s">
				<p className="text-[10px] font-bold text-primary-ex-light uppercase tracking-widest border-b border-dark-light pb-xs">Classificação</p>

				<div className="grid grid-cols-1 sm:grid-cols-2 gap-s">
					<div>
						<label className={labelClass}>
							<IoLayers className={iconClass} /> Categoria principal
						</label>
						<input
							required
							placeholder="Ex: Alimentação"
							className={inputClass}
							value={formData.classificacao_1}
							onChange={(e) => setFormData({ ...formData, classificacao_1: e.target.value })}
						/>
					</div>

					<div>
						<label className={labelClass}>
							<IoLayers className={iconClass} /> Sub-categoria
						</label>
						<input
							placeholder="Ex: Supermercado"
							className={inputClass}
							value={formData.classificacao_2 || ""}
							onChange={(e) => setFormData({ ...formData, classificacao_2: e.target.value })}
						/>
					</div>
				</div>
			</div>

			{/* ===== BLOCO: PAGAMENTO ===== */}
			<div className="space-y-s">
				<p className="text-[10px] font-bold text-primary-ex-light uppercase tracking-widest border-b border-dark-light pb-xs">Pagamento</p>

				{/* Toggle Débito / Crédito */}
				<div>
					<label className={labelClass}>Tipo</label>
					<div className="grid grid-cols-2 gap-xs">
						{(["debito", "credito"] as const).map((tipo) => (
							<button
								key={tipo}
								type="button"
								onClick={() => setFormData({ ...formData, tipo })}
								className={`
									flex items-center justify-center gap-xs py-s rounded-s border text-sm font-bold transition-all
									${
										formData.tipo === tipo ?
											tipo === "debito" ?
												"bg-tertiary-dark/30 border-tertiary text-tertiary"
											:	"bg-secondary-dark/30 border-secondary text-secondary-light"
										:	"bg-dark-dark border-dark-light text-auxiliary2-light hover:border-auxiliary2"
									}
								`}>
								{tipo === "debito" ?
									<>
										<IoWallet className="w-4 h-4" /> Débito
									</>
								:	<>
										<IoCard className="w-4 h-4" /> Crédito
									</>
								}
							</button>
						))}
					</div>
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-2 gap-s">
					{/* Cartão */}
					<div>
						<label className={labelClass}>
							<IoCard className={iconClass} /> Conta / Cartão
						</label>
						<select className={inputClass} value={formData.cartao} onChange={(e) => setFormData({ ...formData, cartao: e.target.value as any })}>
							{CARTOES.map((opt) => (
								<option key={opt} value={opt}>
									{CARTAO_LABELS[opt]}
								</option>
							))}
						</select>
					</div>

					{/* Valor */}
					<div>
						<label className={labelClass}>
							<IoCash className={iconClass} /> Valor (R$)
						</label>
						<input
							required
							type="number"
							step="0.01"
							placeholder="0,00"
							className={inputClass}
							value={formData.valor}
							onChange={(e) => setFormData({ ...formData, valor: e.target.value })}
						/>
					</div>

					{/* Data */}
					<div>
						<label className={labelClass}>
							<IoCalendar className={iconClass} /> Data
						</label>
						<input
							required
							type="date"
							className={inputClass}
							value={formData.data_inicio}
							onChange={(e) => setFormData({ ...formData, data_inicio: e.target.value })}
						/>
					</div>

					{/* Parcelamento — só crédito */}
					{formData.tipo === "credito" && (
						<div className="grid grid-cols-2 gap-s sm:col-span-1">
							<div>
								<label className={labelClass}>Parcela atual</label>
								<input
									type="number"
									min="1"
									className={inputClass}
									value={formData.parcela}
									onChange={(e) => setFormData({ ...formData, parcela: Number(e.target.value) })}
								/>
							</div>
							<div>
								<label className={labelClass}>Total parcelas</label>
								<input
									type="number"
									min="1"
									className={inputClass}
									value={formData.parcelamento}
									onChange={(e) => setFormData({ ...formData, parcelamento: Number(e.target.value) })}
								/>
							</div>
						</div>
					)}
				</div>
			</div>

			{/* ===== AÇÕES ===== */}
			<div className="flex justify-end gap-s pt-m border-t border-dark-light">
				<button
					type="button"
					onClick={onCancel}
					className="px-l py-s text-sm font-bold text-auxiliary2-light hover:text-white border border-dark-light hover:border-auxiliary2 rounded-s transition-all">
					Cancelar
				</button>
				<button
					type="submit"
					disabled={loading}
					className="px-m py-xs text-sm h-fit font-bold text-white bg-primary hover:bg-primary-light disabled:opacity-50 rounded-s shadow-lg transition-all">
					{loading ?
						"Salvando..."
					: initialData ?
						"Atualizar"
					:	"Salvar transação"}
				</button>
			</div>
		</form>
	);
}

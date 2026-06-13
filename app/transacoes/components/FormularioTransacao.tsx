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
	inter: "Inter",
	mercado_pago: "ML",
	amazon: "Amazon",
	swile: "Swile",
	outro: "Outro",
};

const ACAO_LABELS: Record<string, string> = {
	compra: "Compra",
	pagamento: "Pagamento",
	transferência: "Transf.",
	depósito: "Depósito",
	investimento: "Invest.",
	saque: "Saque",
};

const CARTAO_COLOR: Record<string, string> = {
	picpay: "border-positive text-positive",
	inter: "border-secondary text-secondary-light",
	swile: "border-tertiary text-tertiary",
	nubank: "border-primary-light text-primary-ex-light",
	mercado_pago: "border-auxiliary1 text-auxiliary1-light",
	amazon: "border-auxiliary2 text-auxiliary2-light",
	outro: "border-dark-light text-auxiliary2-light",
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
		data_pagamento: initialData?.data_pagamento ? initialData.data_pagamento.split("T")[0] : new Date().toISOString().split("T")[0],
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
			if (initialData?.id) await TransacoesService.atualizar(initialData.id, payload);
			else await TransacoesService.criar(payload);
      console.log("payload enviado:", JSON.stringify(payload, null, 2));
			onSuccess();
		} catch (error) {
			console.error(error);
			alert("Falha ao salvar. Verifique os dados.");
		} finally {
			setLoading(false);
		}
	};

	const inputClass =
		"w-full bg-dark-dark border border-dark-light rounded-s py-xs px-s text-sm text-white placeholder-auxiliary1/60 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all";
	const labelClass = "flex items-center gap-xs text-[10px] font-bold text-auxiliary2-light uppercase tracking-widest mb-xs";
	const sectionTitle = "text-[10px] font-bold text-primary-ex-light uppercase tracking-widest";

	return (
		<form onSubmit={handleSubmit} className="space-y-l text-sm">
			{/* ══ BLOCO 1 — IDENTIFICAÇÃO ══ */}
			<div className="space-y-s">
				<div className="flex items-center gap-s">
					<span className="flex items-center justify-center w-5 h-5 rounded-full bg-primary-dark border border-primary/40 text-primary-ex-light text-[10px] font-bold flex-shrink-0">
						1
					</span>
					<p className={sectionTitle}>Identificação</p>
					<div className="flex-1 h-px bg-dark-light" />
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-2 gap-s">
					<div className="sm:col-span-2">
						<label className={labelClass}>
							<IoPricetag className="w-3 h-3 text-auxiliary1-light" /> Nome da compra
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
							<IoStorefront className="w-3 h-3 text-auxiliary1-light" /> Local / Estabelecimento
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
							<IoSwapHorizontal className="w-3 h-3 text-auxiliary1-light" /> Tipo de ação
						</label>
						{/* Grid 2x3 com altura fixa para alinhar todos os pills */}
						<div className="grid grid-cols-3 gap-xs">
							{ACOES.map((acao) => (
								<button
									key={acao}
									type="button"
									onClick={() => setFormData({ ...formData, acao })}
									className={`
										h-8 px-xs rounded-s border text-[10px] font-bold uppercase tracking-wide
										flex items-center justify-center text-center leading-tight
										transition-all whitespace-nowrap overflow-hidden
										${
											formData.acao === acao ?
												"bg-primary-dark/60 border-primary text-primary-ex-light"
											:	"bg-dark-dark border-dark-light text-auxiliary2-light hover:border-auxiliary2-light"
										}
									`}>
									{ACAO_LABELS[acao]}
								</button>
							))}
						</div>
					</div>
				</div>
			</div>

			{/* ══ BLOCO 2 — CLASSIFICAÇÃO ══ */}
			<div className="space-y-s">
				<div className="flex items-center gap-s">
					<span className="flex items-center justify-center w-5 h-5 rounded-full bg-primary-dark border border-primary/40 text-primary-ex-light text-[10px] font-bold flex-shrink-0">
						2
					</span>
					<p className={sectionTitle}>Classificação</p>
					<div className="flex-1 h-px bg-dark-light" />
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-2 gap-s">
					<div>
						<label className={labelClass}>
							<IoLayers className="w-3 h-3 text-auxiliary1-light" /> Categoria principal
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
							<IoLayers className="w-3 h-3 text-auxiliary1-light" /> Sub-categoria
						</label>
						<input
							placeholder="Ex: Supermercado (opcional)"
							className={inputClass}
							value={formData.classificacao_2 || ""}
							onChange={(e) => setFormData({ ...formData, classificacao_2: e.target.value })}
						/>
					</div>
				</div>
			</div>

			{/* ══ BLOCO 3 — PAGAMENTO ══ */}
			<div className="space-y-s">
				<div className="flex items-center gap-s">
					<span className="flex items-center justify-center w-5 h-5 rounded-full bg-primary-dark border border-primary/40 text-primary-ex-light text-[10px] font-bold flex-shrink-0">
						3
					</span>
					<p className={sectionTitle}>Pagamento</p>
					<div className="flex-1 h-px bg-dark-light" />
				</div>

				{/* Toggle Débito / Crédito */}
				<div className="grid grid-cols-2 gap-xs">
					{(["debito", "credito"] as const).map((tipo) => (
						<button
							key={tipo}
							type="button"
							onClick={() => setFormData({ ...formData, tipo })}
							className={`
								h-10 flex items-center justify-center gap-xs rounded-s border text-sm font-bold transition-all
								${
									formData.tipo === tipo ?
										tipo === "debito" ?
											"bg-tertiary-dark/30 border-tertiary text-tertiary shadow-md shadow-tertiary/10"
										:	"bg-secondary-dark/30 border-secondary text-secondary-light shadow-md shadow-secondary/10"
									:	"bg-dark-dark border-dark-light text-auxiliary2-light hover:border-auxiliary2-light"
								}
							`}>
							{tipo === "debito" ?
								<IoWallet className="w-4 h-4 flex-shrink-0" />
							:	<IoCard className="w-4 h-4 flex-shrink-0" />}
							{tipo === "debito" ? "Débito" : "Crédito"}
						</button>
					))}
				</div>

				{/* Seletor de conta — pills com altura fixa */}
				<div>
					<label className={labelClass}>
						<IoCard className="w-3 h-3 text-auxiliary1-light" /> Conta / Cartão
					</label>
					<div className="grid grid-cols-4 sm:grid-cols-7 gap-xs">
						{CARTOES.map((c) => {
							const active = formData.cartao === c;
							const colorClass = CARTAO_COLOR[c] ?? "border-dark-light text-auxiliary2-light";
							return (
								<button
									key={c}
									type="button"
									onClick={() => setFormData({ ...formData, cartao: c as any })}
									className={`
										h-8 px-xs rounded-s border text-[10px] font-bold uppercase tracking-wide
										flex items-center justify-center text-center leading-tight
										transition-all overflow-hidden
										${active ? `bg-dark border-2 ${colorClass}` : "bg-dark-dark border-dark-light text-auxiliary2-light hover:border-auxiliary2-light"}
									`}>
									{/* Primeira palavra do label para caber sem vazar */}
									{CARTAO_LABELS[c].split("\n")[0]}
								</button>
							);
						})}
					</div>
				</div>

				{/* Valor + Data */}
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-s">
					<div>
						<label className={labelClass}>
							<IoCash className="w-3 h-3 text-auxiliary1-light" /> Valor (R$)
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
					<div>
						<label className={labelClass}>
							<IoCalendar className="w-3 h-3 text-auxiliary1-light" /> Data
						</label>
						<input
							required
							type="date"
							className={inputClass}
							value={formData.data_inicio}
							onChange={(e) => setFormData({ ...formData, data_inicio: e.target.value })}
						/>
					</div>

					{formData.tipo === "credito" && (
						<>
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
								<label className={labelClass}>Total de parcelas</label>
								<input
									type="number"
									min="1"
									className={inputClass}
									value={formData.parcelamento}
									onChange={(e) => setFormData({ ...formData, parcelamento: Number(e.target.value) })}
								/>
							</div>
						</>
					)}
				</div>
			</div>

			{/* ══ AÇÕES ══ */}
			<div className="flex justify-end gap-s pt-m border-t border-dark-light">
				<button
					type="button"
					onClick={onCancel}
					className="px-m py-xs text-sm font-bold text-auxiliary2-light hover:text-white border border-dark-light hover:border-auxiliary2-light rounded-s transition-all">
					Cancelar
				</button>
				<button
					type="submit"
					disabled={loading}
					className="px-l py-xs text-sm font-bold text-white rounded-s overflow-hidden bg-gradient-to-r from-primary to-primary-light hover:from-primary-light hover:to-primary shadow-lg shadow-primary/20 disabled:opacity-50 transition-all active:scale-95">
					{loading ?
						"Salvando..."
					: initialData ?
						"Atualizar transação"
					:	"Salvar transação"}
				</button>
			</div>
		</form>
	);
}

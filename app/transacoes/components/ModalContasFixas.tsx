"use client";

import { useState, useEffect } from "react";
import { TransacaoPayload } from "../../src/types/transacao.type";
import { IoBusiness, IoClose, IoFlash, IoGlobe, IoHome, IoSchool, IoWallet, IoCard, IoBookmarks, IoCheckmark, IoCash } from "react-icons/io5";
import { TEMPLATES_FIXOS } from "../templates/transacao.templates";
import { TransacoesService } from "../../src/services/transacoes.service";

interface ModalContasFixasProps {
	isOpen: boolean;
	onClose: () => void;
	onSuccess: () => void;
}

const PAGAMENTOS = [
	{ label: "Enel - Luz", icon: <IoFlash />, key: "Enel - Luz" },
	{ label: "NN Negócios - Aluguel", icon: <IoHome />, key: "NN Negócios - Aluguel" },
	{ label: "Vivo - Internet", icon: <IoGlobe />, key: "Vivo - Internet" },
];

const RECEBIMENTOS = [
	{ label: "PROA - Aulas", icon: <IoSchool />, key: "PROA - Aulas" },
	{ label: "Swile - Saldo Livre", icon: <IoWallet />, key: "Swile - Saldo Livre" },
	{ label: "Uliving - Pagamento", icon: <IoBusiness />, key: "Uliving - Pagamento" },
	{ label: "PicPay - Rendimentos", icon: <IoCash />, key: "PicPay - Rendimentos" },
];

const CARTAO_LABELS: Record<string, string> = {
	picpay: "PicPay",
	nubank: "Nubank",
	inter: "Inter",
	mercado_pago: "Mercado Pago",
	amazon: "Amazon",
	swile: "Swile",
	outro: "Outro",
};

export function ModalContasFixas({ isOpen, onClose, onSuccess }: ModalContasFixasProps) {
	const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
	const [valor, setValor] = useState("");
	const [cartao, setCartao] = useState<string>("picpay");
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (selectedTemplate) {
			const template = TEMPLATES_FIXOS[selectedTemplate];
			if (template.cartao) setCartao(template.cartao);
		}
	}, [selectedTemplate]);

	// Reset ao fechar
	useEffect(() => {
		if (!isOpen) {
			setSelectedTemplate(null);
			setValor("");
			setCartao("picpay");
		}
	}, [isOpen]);

	const handleSalvar = async () => {
		if (!selectedTemplate || !valor) return;
		setLoading(true);
		const template = TEMPLATES_FIXOS[selectedTemplate];

		const payload: TransacaoPayload = {
			compra: template.compra || "",
			local: template.local || "",
			acao: template.acao || "compra",
			classificacao_1: template.classificacao_1 || "",
			classificacao_2: template.classificacao_2 || "",
			cartao: cartao as any,
			tipo: "debito",
			valor: parseFloat(valor),
			parcelamento: 1,
			parcela: 1,
			data_inicio: new Date(new Date().toISOString().split("T")[0]).toISOString(),
		};

		try {
			await TransacoesService.criar(payload);
			onSuccess();
			onClose();
		} catch (error) {
			console.error("Erro ao salvar conta fixa:", error);
			alert("Erro ao salvar. Tente novamente.");
		} finally {
			setLoading(false);
		}
	};

	if (!isOpen) return null;

	const inputClass =
		"w-full bg-dark-dark border border-dark-light rounded-s py-xs px-s text-sm text-white placeholder-auxiliary1/60 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all";
	const labelClass = "block text-[10px] font-bold text-auxiliary2-light uppercase tracking-widest mb-xs";

	return (
		<div
			className="fixed inset-0 z-[1001] flex items-center justify-center p-m"
			style={{ backgroundColor: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)" }}>
			<div className="bg-dark border border-dark-light rounded-xl shadow-2xl w-full max-w-md flex flex-col max-h-[90vh]">
				{/* ── HEADER ── */}
				<div className="flex items-center justify-between px-l pt-l pb-m border-b border-dark-light flex-shrink-0">
					<div className="flex items-center gap-s">
						<span className="w-9 h-9 rounded-s bg-secondary-dark/50 border border-secondary/30 flex items-center justify-center text-secondary-light flex-shrink-0">
							<IoBookmarks className="w-4 h-4" />
						</span>
						<div>
							<h2 className="font-space-grotesk font-bold text-lg text-white leading-tight">Contas Fixas</h2>
							<p className="text-[10px] text-auxiliary2-light uppercase tracking-widest">Lançamento rápido</p>
						</div>
					</div>
					<button
						type="button"
						onClick={onClose}
						className="p-xs rounded-full hover:bg-white/10 text-auxiliary2-light hover:text-white transition-colors flex-shrink-0">
						<IoClose className="w-5 h-5" />
					</button>
				</div>

				{/* ── BODY (scrollável) ── */}
				<div className="flex-1 overflow-y-auto px-l py-m space-y-m">
					{/* Pagamentos */}
					<div className="space-y-xs">
						<div className="flex items-center gap-xs mb-s">
							<span className="w-1.5 h-1.5 rounded-full bg-negative flex-shrink-0" />
							<p className="text-[10px] font-bold text-negative uppercase tracking-widest">Saídas</p>
						</div>
						{PAGAMENTOS.map(({ label, icon, key }) => (
							<TemplateButton
								key={key}
								label={label}
								icon={icon}
								isSelected={selectedTemplate === key}
								onClick={() => setSelectedTemplate(selectedTemplate === key ? null : key)}
								color="negative"
							/>
						))}
					</div>

					{/* Recebimentos */}
					<div className="space-y-xs">
						<div className="flex items-center gap-xs mb-s">
							<span className="w-1.5 h-1.5 rounded-full bg-positive flex-shrink-0" />
							<p className="text-[10px] font-bold text-positive uppercase tracking-widest">Entradas</p>
						</div>
						{RECEBIMENTOS.map(({ label, icon, key }) => (
							<TemplateButton
								key={key}
								label={label}
								icon={icon}
								isSelected={selectedTemplate === key}
								onClick={() => setSelectedTemplate(selectedTemplate === key ? null : key)}
								color="positive"
							/>
						))}
					</div>

					{/* Área de confirmação — aparece ao selecionar */}
					{selectedTemplate && (
						<div className="pt-m border-t border-dark-light space-y-s">
							<p className="text-[10px] font-bold text-primary-ex-light uppercase tracking-widest">Confirmar lançamento</p>

							<div className="grid grid-cols-2 gap-s">
								<div>
									<label className={labelClass}>Valor (R$)</label>
									<input
										type="number"
										placeholder="0,00"
										step="0.01"
										className={inputClass}
										value={valor}
										onChange={(e) => setValor(e.target.value)}
										autoFocus
									/>
								</div>
								<div>
									<label className={labelClass}>Conta</label>
									<div className="relative">
										<select
											className={inputClass + " pr-8 appearance-none cursor-pointer"}
											value={cartao}
											onChange={(e) => setCartao(e.target.value)}>
											{Object.entries(CARTAO_LABELS).map(([value, label]) => (
												<option key={value} value={value}>
													{label}
												</option>
											))}
										</select>
										<IoCard className="absolute right-3 top-1/2 -translate-y-1/2 text-auxiliary2-light pointer-events-none w-3 h-3" />
									</div>
								</div>
							</div>
						</div>
					)}
				</div>

				{/* ── FOOTER ── */}
				<div className="px-l pb-l pt-m border-t border-dark-light flex-shrink-0">
					{selectedTemplate ?
						<button
							type="button"
							onClick={handleSalvar}
							disabled={loading || !valor}
							className="w-full py-s text-sm font-bold text-white rounded-s bg-gradient-to-r from-primary to-primary-light hover:from-primary-light hover:to-primary shadow-lg shadow-primary/20 disabled:opacity-40 transition-all active:scale-[0.98]">
							{loading ? "Processando..." : "Confirmar Lançamento"}
						</button>
					:	<button
							type="button"
							onClick={onClose}
							className="w-full py-s text-sm font-bold text-auxiliary2-light hover:text-white border border-dark-light hover:border-auxiliary2-light rounded-s transition-all">
							Cancelar
						</button>
					}
				</div>
			</div>
		</div>
	);
}

/* ── Subcomponente ── */
interface TemplateButtonProps {
	label: string;
	icon: React.ReactNode;
	isSelected: boolean;
	onClick: () => void;
	color: "negative" | "positive";
}

function TemplateButton({ label, icon, isSelected, onClick, color }: TemplateButtonProps) {
	const colors =
		color === "negative" ?
			{
				active: "bg-negative/10 border-negative text-white",
				inactive: "bg-dark-dark/60 border-dark-light text-auxiliary2-light hover:border-negative/40 hover:bg-negative/5",
				icon: isSelected ? "text-negative" : "text-auxiliary1-light",
			}
		:	{
				active: "bg-positive/10 border-positive text-white",
				inactive: "bg-dark-dark/60 border-dark-light text-auxiliary2-light hover:border-positive/40 hover:bg-positive/5",
				icon: isSelected ? "text-positive" : "text-auxiliary1-light",
			};

	return (
		<button
			type="button"
			onClick={onClick}
			className={`
				w-full flex items-center gap-s px-s py-xs rounded-s border
				text-sm font-semibold transition-all duration-150
				${isSelected ? colors.active : colors.inactive}
			`}>
			<span className={`text-base flex-shrink-0 ${colors.icon}`}>{icon}</span>
			<span className="flex-1 text-left truncate">{label}</span>
			{isSelected && (
				<span
					className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 ${color === "negative" ? "bg-negative" : "bg-positive"}`}>
					<IoCheckmark className="w-3 h-3 text-white" />
				</span>
			)}
		</button>
	);
}

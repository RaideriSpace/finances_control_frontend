"use client";

import { useState, useEffect } from "react";
import { TransacaoPayload } from "../../src/types/transacao.type";
import { IoBusiness, IoClose, IoFlash, IoGlobe, IoHome, IoSchool, IoWallet, IoCard, IoBookmarks } from "react-icons/io5";
import { TEMPLATES_FIXOS } from "../templates/transacao.templates";

export function ModalContasFixas({ isOpen, onClose, onSuccess }: { isOpen: boolean; onClose: () => void; onSuccess: () => void }) {
	const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
	const [valor, setValor] = useState("");
	const [cartao, setCartao] = useState<string>("picpay");
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (selectedTemplate) {
			const template = TEMPLATES_FIXOS[selectedTemplate];
			if (template.cartao) {
				setCartao(template.cartao);
			}
		}
	}, [selectedTemplate]);

	const handleSalvar = async () => {
		if (!selectedTemplate || !valor) return;

		setLoading(true);
		const template = TEMPLATES_FIXOS[selectedTemplate];

		const payload: TransacaoPayload = {
			...(template as TransacaoPayload),
			valor: parseFloat(valor),
			cartao: cartao as any,
			data_inicio: new Date().toISOString(),
			parcela: 1,
			parcelamento: 1,
			// Como o DB novo tem 'local' em vez de 'estabelecimento/razao_social', ajuste se necessário:
			local: template.local || "",
		};

		try {
			const res = await fetch("https://finances-control-backend.onrender.com/transacoes", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(payload),
			});

			if (res.ok) {
				onSuccess();
				setValor("");
				setSelectedTemplate(null);
				onClose();
			}
		} catch (error) {
			console.error("Erro ao salvar conta fixa:", error);
		} finally {
			setLoading(false);
		}
	};

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-dark-ex-dark/80 backdrop-blur-md flex items-center justify-center z-[1001] p-m animate-fade-in">
			{/* Usando sua classe de card global */}
			<div className="card w-full max-w-lg p-xl border-0 shadow-2xl animate-slide-in-up">
				<div className="flex justify-between items-center mb-l">
					<h2 className="text-2xl font-bold text-white flex items-center gap-s font-space-grotesk">
						<span className="w-10 h-10 rounded-full bg-secondary-dark/50 border border-secondary/30 flex items-center justify-center text-secondary-ex-light text-lg">
							<IoBookmarks />
						</span>
						Contas Fixas
					</h2>
					<button onClick={onClose} className="p-xs hover:bg-white/10 rounded-full transition-colors">
						<IoClose className="w-8 h-8 text-auxiliary2-light hover:text-white" />
					</button>
				</div>

				<div className="space-y-m">
					{/* ================= SEÇÃO PAGAMENTOS ================= */}
					<div>
						<p className="text-xs font-bold text-negative uppercase tracking-widest mb-xs flex items-center gap-2">
							<span className="w-2 h-2 rounded-full bg-negative"></span>
							Pagamentos (Saída)
						</p>
						<div className="grid grid-cols-1 gap-2">
							<TemplateButton label="Enel - Luz" icon={<IoFlash />} selected={selectedTemplate} onClick={setSelectedTemplate} color="negative" />
							<TemplateButton
								label="NN Negócios - Aluguel"
								icon={<IoHome />}
								selected={selectedTemplate}
								onClick={setSelectedTemplate}
								color="negative"
							/>
							<TemplateButton label="Vivo - Internet" icon={<IoGlobe />} selected={selectedTemplate} onClick={setSelectedTemplate} color="negative" />
						</div>
					</div>

					{/* ================= SEÇÃO RECEBIMENTOS ================= */}
					<div>
						<p className="text-xs font-bold text-positive uppercase tracking-widest mb-xs flex items-center gap-2">
							<span className="w-2 h-2 rounded-full bg-positive"></span>
							Recebimentos (Entrada)
						</p>
						<div className="grid grid-cols-1 gap-2">
							<TemplateButton label="PROA - Aulas" icon={<IoSchool />} selected={selectedTemplate} onClick={setSelectedTemplate} color="positive" />
							<TemplateButton
								label="Swile - Saldo Livre"
								icon={<IoWallet />}
								selected={selectedTemplate}
								onClick={setSelectedTemplate}
								color="positive"
							/>
							<TemplateButton
								label="Uliving - Pagamento"
								icon={<IoBusiness />}
								selected={selectedTemplate}
								onClick={setSelectedTemplate}
								color="positive"
							/>
						</div>
					</div>

					{/* ================= ÁREA DE EDIÇÃO FINAL ================= */}
					{selectedTemplate && (
						<div className="pt-m border-t border-dark-light animate-in fade-in slide-in-from-bottom-4">
							<div className="grid md:grid-cols-2 gap-s">
								{/* INPUT DE VALOR */}
								<div>
									<label className="block text-xs font-bold text-auxiliary2-light uppercase mb-1 ml-1">Valor Final</label>
									<input
										type="number"
										placeholder="0,00"
										// As classes base de input já vêm do globals.css, só ajustamos paddings específicos
										className="w-full py-s px-m rounded-s"
										value={valor}
										onChange={(e) => setValor(e.target.value)}
										autoFocus
									/>
								</div>

								{/* SELECT DE CARTÃO */}
								<div>
									<label className="block text-xs font-bold text-auxiliary2-light uppercase mb-1 ml-1">Conta de Destino</label>
									<div className="relative">
										<select
											className="w-full py-s px-m rounded-s appearance-none cursor-pointer"
											value={cartao}
											onChange={(e) => setCartao(e.target.value)}>
											<option value="picpay">PicPay</option>
											<option value="nubank">Nubank</option>
											<option value="inter">Banco Inter</option>
											<option value="mercado_pago">Mercado Pago</option>
											<option value="amazon">Amazon</option>
											<option value="swile">Swile</option>
											<option value="outro">Outro</option>
										</select>
										<IoCard className="absolute right-4 top-1/2 -translate-y-1/2 text-auxiliary2-light pointer-events-none" />
									</div>
								</div>
							</div>

							{/* BOTÃO SALVAR */}
							<button
								onClick={handleSalvar}
								disabled={loading || !valor}
								className="w-full mt-m bg-primary hover:bg-primary-light disabled:opacity-50 text-white font-bold py-s rounded-s transition-all shadow-lg shadow-primary/20 active:scale-[0.98] text-lg">
								{loading ? "Processando..." : "Confirmar Lançamento"}
							</button>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}

// Subcomponente de Botão
function TemplateButton({ label, icon, selected, onClick, color }: any) {
	const isSelected = selected === label;

	// Usamos arbitrary values do tailwind para manter as variáveis do CSS de forma clara
	const colorClasses =
		color === "negative" ?
			{
				hover: "hover:border-negative/50 hover:bg-negative/5",
				active: "bg-negative/20 border-negative text-white",
				iconActive: "text-negative",
			}
		:	{
				hover: "hover:border-positive/50 hover:bg-positive/5",
				active: "bg-positive/20 border-positive text-white",
				iconActive: "text-positive",
			};

	const activeClass = isSelected ? colorClasses.active : `bg-dark-dark/50 border-dark-light text-auxiliary2-light ${colorClasses.hover}`;

	return (
		<button onClick={() => onClick(label)} className={`flex items-center gap-s p-s rounded-s border transition-all duration-200 ${activeClass}`}>
			<span className={`text-lg ${isSelected ? colorClasses.iconActive : "text-auxiliary1-light"}`}>{icon}</span>
			<span className="font-semibold text-sm">{label}</span>

			{/* Indicador visual de seleção à direita */}
			{isSelected && <span className={`ml-auto w-2 h-2 rounded-full ${color === "negative" ? "bg-negative" : "bg-positive"}`}></span>}
		</button>
	);
}

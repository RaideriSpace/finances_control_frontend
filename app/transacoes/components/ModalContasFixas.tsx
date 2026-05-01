"use client";

import { useState, useEffect } from "react";
import { TransacaoPayload } from "../../src/types/transacao.type";
import { IoBusiness, IoClose, IoFlash, IoGlobe, IoHome, IoSchool, IoWallet, IoCard } from "react-icons/io5";
import { TEMPLATES_FIXOS } from "../templates/transacao.templates";

export function ModalContasFixas({ isOpen, onClose, onSuccess }: { isOpen: boolean; onClose: () => void; onSuccess: () => void }) {
	const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
	const [valor, setValor] = useState("");
	const [cartao, setCartao] = useState<string>("picpay"); // Estado para o cartão selecionado
	const [loading, setLoading] = useState(false);

	// Sincroniza o cartão sempre que um template for selecionado
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
			cartao: cartao as any, // Sobrescreve o cartão do template pelo selecionado no modal
			data_inicio: new Date().toISOString(),
			parcela: 1,
			parcelamento: 1,
			razao_social: template.estabelecimento || "",
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
		<div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-[60] p-4">
			<div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-[2.5rem] p-8 shadow-2xl">
				<div className="flex justify-between items-center mb-6">
					<h2 className="text-2xl font-black text-white flex items-center gap-2">
						<IoWallet className="text-indigo-400" /> Contas Fixas
					</h2>
					<button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
						<IoClose size={28} />
					</button>
				</div>

				<div className="space-y-6">
					{/* SEÇÃO PAGAMENTOS */}
					<div>
						<p className="text-xs font-bold text-rose-400 uppercase tracking-widest mb-3">Pagamentos</p>
						<div className="grid grid-cols-1 gap-2">
							<TemplateButton label="Enel - Luz" icon={<IoFlash />} selected={selectedTemplate} onClick={setSelectedTemplate} color="rose" />
							<TemplateButton
								label="NN Negócios - Aluguel"
								icon={<IoHome />}
								selected={selectedTemplate}
								onClick={setSelectedTemplate}
								color="rose"
							/>
							<TemplateButton label="Vivo - Internet" icon={<IoGlobe />} selected={selectedTemplate} onClick={setSelectedTemplate} color="rose" />
						</div>
					</div>

					{/* SEÇÃO RECEBIMENTOS */}
					<div>
						<p className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-3">Recebimentos</p>
						<div className="grid grid-cols-1 gap-2">
							<TemplateButton label="PROA - Aulas" icon={<IoSchool />} selected={selectedTemplate} onClick={setSelectedTemplate} color="emerald" />
							<TemplateButton
								label="Swile - Saldo Livre"
								icon={<IoWallet />}
								selected={selectedTemplate}
								onClick={setSelectedTemplate}
								color="emerald"
							/>
							<TemplateButton
								label="Uliving - Pagamento"
								icon={<IoBusiness />}
								selected={selectedTemplate}
								onClick={setSelectedTemplate}
								color="emerald"
							/>
						</div>
					</div>

					{/* ÁREA DE EDIÇÃO FINAL (Valor + Cartão) */}
					{selectedTemplate && (
						<div className="pt-6 border-t border-slate-800 animate-in fade-in slide-in-from-bottom-4">
							<div className="grid md:grid-cols-2 gap-4">
								{/* INPUT DE VALOR */}
								<div>
									<label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Valor</label>
									<input
										type="number"
										placeholder="0,00"
										className="w-full bg-slate-800 border border-slate-700 py-1 px-2 rounded-2xl text-white outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
										value={valor}
										onChange={(e) => setValor(e.target.value)}
										autoFocus
									/>
								</div>

								{/* SELECT DE CARTÃO */}
								<div>
									<label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Cartão</label>
									<div className="relative">
										<select
											className="w-full bg-slate-800 border border-slate-700 py-1.5 px-2 rounded-2xl text-sm text-white outline-none focus:ring-2 focus:ring-indigo-500 transition-all appearance-none"
											value={cartao}
											onChange={(e) => setCartao(e.target.value)}>
											<option value="picpay">PicPay</option>
											<option value="nubank">Nubank</option>
											<option value="inter">Inter</option>
											<option value="mercado_pago">Mercado Pago</option>
											<option value="amazon">Amazon</option>
											<option value="swile">Swile</option>
											<option value="outro">Outro</option>
										</select>
										<IoCard className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
									</div>
								</div>
							</div>

							<button
								onClick={handleSalvar}
								disabled={loading || !valor}
								className="w-full mt-6 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-black py-4 rounded-2xl transition-all shadow-lg shadow-indigo-500/20 active:scale-[0.98]">
								{loading ? "Processando..." : "Confirmar Lançamento"}
							</button>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}

function TemplateButton({ label, icon, selected, onClick, color }: any) {
	const isSelected = selected === label;
	const colorClass = color === "rose" ? "hover:border-rose-500/50" : "hover:border-emerald-500/50";
	const activeClass =
		isSelected ?
			color === "rose" ?
				"bg-rose-500/20 border-rose-500 text-white"
			:	"bg-emerald-500/20 border-emerald-500 text-white"
		:	"bg-slate-800/50 border-slate-700 text-slate-400";

	return (
		<button onClick={() => onClick(label)} className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${colorClass} ${activeClass}`}>
			<span
				className={
					isSelected ?
						color === "rose" ?
							"text-rose-400"
						:	"text-emerald-400"
					:	"text-slate-500"
				}>
				{icon}
			</span>
			<span className="font-medium text-sm">{label}</span>
		</button>
	);
}

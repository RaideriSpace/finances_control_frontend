"use client";

import { useState } from "react";
import { TransacoesService } from "@/app/lib/api/transacoes.service";
import { Transacao, TransacaoAcao, TransacaoCartao, TransacaoPayload, TransacaoTipo } from "@/app/lib/types/transacao.type";
import { IoCard, IoWallet, IoPricetag, IoStorefront, IoCalendar, IoCash, IoLayers, IoArrowForward } from "react-icons/io5";
import { useToast } from "@/app/components/ToastProvider";

interface FormularioTransacaoProps {
	onSuccess: () => void;
	onCancel: () => void;
	initialData?: Transacao;
	categoriasExistentes?: string[];
}

interface FormularioTransacaoState {
	compra: string;
	local: string;
	acao: TransacaoAcao;
	classificacao_1: string;
	classificacao_2: string;
	cartao: TransacaoCartao;
	cartaoDestino: TransacaoCartao | "";
	tipo: TransacaoTipo;
	parcelamento: number;
	parcela: number;
	valor: number | string;
	data_inicio: string;
	data_pagamento: string;
}

const ACOES: readonly TransacaoAcao[] = ["compra", "pagamento", "transferência", "depósito", "investimento", "saque"];
const CARTOES: readonly TransacaoCartao[] = ["picpay", "nubank", "inter", "mercado_pago", "amazon", "swile", "outro"];

// Ações cujo formulário é totalmente auto-preenchido (o usuário só informa
// valor/conta/data) — usado para saber o que limpar ao trocar de ação.
const ACOES_AUTO_PREENCHIDAS = new Set<TransacaoAcao>(["transferência", "pagamento", "investimento", "saque"]);

const CARTAO_LABELS: Record<TransacaoCartao, string> = {
	picpay: "PicPay",
	nubank: "Nubank",
	inter: "Inter",
	mercado_pago: "ML",
	amazon: "Amazon",
	swile: "Swile",
	outro: "Outro",
};

const ACAO_LABELS: Record<TransacaoAcao, string> = {
	compra: "Compra",
	pagamento: "Pagamento",
	transferência: "Transferência",
	depósito: "Depósito",
	investimento: "Investimento",
	saque: "Saque",
};

const CARTAO_COLOR: Record<TransacaoCartao, string> = {
	picpay: "border-positive text-positive",
	inter: "border-secondary text-secondary-light",
	swile: "border-tertiary text-tertiary",
	nubank: "border-primary-light text-primary-ex-light",
	mercado_pago: "border-auxiliary1 text-auxiliary1-light",
	amazon: "border-auxiliary2 text-auxiliary2-light",
	outro: "border-dark-light text-auxiliary2-light",
};

const inputClass =
	"w-full bg-dark-dark border border-dark-light rounded-s py-xs px-s text-sm text-white placeholder-auxiliary1/60 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all";
const labelClass = "flex items-center gap-xs text-[10px] font-bold text-auxiliary2-light uppercase tracking-widest mb-xs";

function SectionHeader({ numero, titulo }: { numero: number; titulo: string }) {
	return (
		<div className="flex items-center gap-s">
			<span className="flex items-center justify-center w-5 h-5 rounded-full bg-primary-dark border border-primary/40 text-primary-ex-light text-[10px] font-bold flex-shrink-0">
				{numero}
			</span>
			<p className="text-[10px] font-bold text-primary-ex-light uppercase tracking-widest">{titulo}</p>
			<div className="flex-1 h-px bg-dark-light" />
		</div>
	);
}

interface CartaoPillsProps {
	label: string;
	selecionado: TransacaoCartao | "";
	onSelecionar: (cartao: TransacaoCartao) => void;
	excluir?: TransacaoCartao | "";
}

function CartaoPills({ label, selecionado, onSelecionar, excluir }: CartaoPillsProps) {
	return (
		<div>
			<label className={labelClass}>
				<IoCard className="w-3 h-3 text-auxiliary1-light" /> {label}
			</label>
			<div className="grid grid-cols-4 sm:grid-cols-7 gap-xs">
				{CARTOES.filter((c) => c !== excluir).map((c) => {
					const active = selecionado === c;
					const colorClass = CARTAO_COLOR[c];
					return (
						<button
							key={c}
							type="button"
							onClick={() => onSelecionar(c)}
							className={`
								h-8 px-xs rounded-s border text-[10px] font-bold uppercase tracking-wide
								flex items-center justify-center text-center leading-tight
								transition-all overflow-hidden
								${active ? `bg-dark border-2 ${colorClass}` : "bg-dark-dark border-dark-light text-auxiliary2-light hover:border-auxiliary2-light"}
							`}>
							{CARTAO_LABELS[c]}
						</button>
					);
				})}
			</div>
		</div>
	);
}

interface ValorDataFieldsProps {
	valor: number | string;
	data: string;
	onValorChange: (valor: string) => void;
	onDataChange: (data: string) => void;
}

function ValorDataFields({ valor, data, onValorChange, onDataChange }: ValorDataFieldsProps) {
	return (
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
					value={valor}
					onChange={(e) => onValorChange(e.target.value)}
				/>
			</div>
			<div>
				<label className={labelClass}>
					<IoCalendar className="w-3 h-3 text-auxiliary1-light" /> Data
				</label>
				<input required type="date" className={inputClass} value={data} onChange={(e) => onDataChange(e.target.value)} />
			</div>
		</div>
	);
}

function estadoInicial(initialData?: Transacao): FormularioTransacaoState {
	return {
		compra: initialData?.compra || "",
		local: initialData?.local || "",
		acao: initialData?.acao || "compra",
		classificacao_1: initialData?.classificacao_1 || "",
		classificacao_2: initialData?.classificacao_2 || "",
		cartao: initialData?.cartao || "picpay",
		cartaoDestino: initialData?.cartaoDestino || "",
		tipo: initialData?.tipo || "debito",
		parcelamento: initialData?.parcelamento || 1,
		parcela: initialData?.parcela || 1,
		valor: initialData?.valor || "",
		data_inicio: initialData?.data_inicio ? initialData.data_inicio.split("T")[0] : new Date().toISOString().split("T")[0],
		data_pagamento: initialData?.data_pagamento ? initialData.data_pagamento.split("T")[0] : new Date().toISOString().split("T")[0],
	};
}

export function FormularioTransacao({ onSuccess, onCancel, initialData, categoriasExistentes = [] }: FormularioTransacaoProps) {
	const { showToast } = useToast();
	const [loading, setLoading] = useState(false);
	const [formData, setFormData] = useState<FormularioTransacaoState>(() => estadoInicial(initialData));

	const isTransferencia = formData.acao === "transferência";
	const isPagamento = formData.acao === "pagamento";
	const isInvestimento = formData.acao === "investimento";
	const isSaque = formData.acao === "saque";
	const isPadrao = !isTransferencia && !isPagamento && !isInvestimento && !isSaque;
	const precisaContaDestino = isTransferencia || isPagamento;

	function handleAcaoChange(acao: TransacaoAcao) {
		setFormData((prev) => {
			if (acao === "transferência") {
				return {
					...prev,
					acao,
					tipo: "debito",
					parcelamento: 1,
					parcela: 1,
					compra: "Transferência",
					classificacao_1: "Transferência",
					classificacao_2: "",
					local: "",
					cartaoDestino: "",
				};
			}
			if (acao === "pagamento") {
				return {
					...prev,
					acao,
					tipo: "debito",
					parcelamento: 1,
					parcela: 1,
					compra: "Pagamento de fatura",
					classificacao_1: "Fatura",
					classificacao_2: "",
					local: "",
					cartaoDestino: "",
				};
			}
			if (acao === "investimento") {
				return {
					...prev,
					acao,
					tipo: "debito",
					cartao: "outro",
					parcelamento: 1,
					parcela: 1,
					compra: "Investimento",
					classificacao_1: "Investimentos",
					classificacao_2: "",
					local: "",
				};
			}
			if (acao === "saque") {
				return {
					...prev,
					acao,
					tipo: "debito",
					parcelamento: 1,
					parcela: 1,
					compra: "Saque",
					classificacao_1: "Saque",
					classificacao_2: "",
					local: "",
				};
			}
			// compra | depósito — fluxo padrão. Limpa o auto-preenchimento se
			// estava vindo de uma das ações acima.
			const limpar = ACOES_AUTO_PREENCHIDAS.has(prev.acao);
			return {
				...prev,
				acao,
				compra: limpar ? "" : prev.compra,
				classificacao_1: limpar ? "" : prev.classificacao_1,
			};
		});
	}

	// Transferência exige contas diferentes (senão seria mover dinheiro de uma
	// conta pra ela mesma); pagamento de fatura não — pagar a fatura do cartão
	// de crédito do próprio banco com a conta débito dele é o caso comum.
	const contaDestinoValida =
		!precisaContaDestino || (formData.cartaoDestino !== "" && (isPagamento || formData.cartaoDestino !== formData.cartao));

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (precisaContaDestino && !contaDestinoValida) {
			showToast(
				isTransferencia ? "Escolha a conta de destino, diferente da conta de origem." : "Escolha a conta cuja fatura está sendo paga.",
				"error",
			);
			return;
		}

		setLoading(true);
		const payload: TransacaoPayload = {
			...formData,
			valor: Number(formData.valor),
			parcelamento: formData.tipo === "debito" ? 1 : Number(formData.parcelamento),
			parcela: formData.tipo === "debito" ? 1 : Number(formData.parcela),
			data_inicio: new Date(formData.data_inicio).toISOString(),
			cartaoDestino: precisaContaDestino && formData.cartaoDestino ? formData.cartaoDestino : null,
		};
		try {
			if (initialData?.id) await TransacoesService.atualizar(initialData.id, payload);
			else await TransacoesService.criar(payload);
			showToast(initialData?.id ? "Lançamento atualizado." : "Lançamento criado.", "success");
			onSuccess();
		} catch (error) {
			console.error(error);
			showToast("Falha ao salvar. Verifique os dados.", "error");
		} finally {
			setLoading(false);
		}
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-l text-sm">
			{/* ══ 1 — TIPO DE LANÇAMENTO (sempre primeiro: define o resto do formulário) ══ */}
			<div className="space-y-s">
				<SectionHeader numero={1} titulo="Tipo de lançamento" />
				<div className="grid grid-cols-3 gap-xs">
					{ACOES.map((acao) => (
						<button
							key={acao}
							type="button"
							onClick={() => handleAcaoChange(acao)}
							className={`
								h-9 px-xs rounded-s border text-[10px] font-bold uppercase tracking-wide
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

			{isPadrao && (
				<div className="space-y-s">
					<SectionHeader numero={2} titulo="Forma de pagamento" />

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

					<CartaoPills label="Conta / Cartão" selecionado={formData.cartao} onSelecionar={(cartao) => setFormData({ ...formData, cartao })} />

					<ValorDataFields
						valor={formData.valor}
						data={formData.data_inicio}
						onValorChange={(valor) => setFormData({ ...formData, valor })}
						onDataChange={(data_inicio) => setFormData({ ...formData, data_inicio })}
					/>

					{formData.tipo === "credito" && (
						<div className="grid grid-cols-2 gap-s">
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
						</div>
					)}
				</div>
			)}

			{isTransferencia && (
				<div className="space-y-s">
					<SectionHeader numero={2} titulo="De qual conta para qual conta" />
					<div className="flex items-center gap-s">
						<div className="flex-1">
							<CartaoPills
								label="Origem"
								selecionado={formData.cartao}
								onSelecionar={(cartao) => setFormData({ ...formData, cartao, cartaoDestino: cartao === formData.cartaoDestino ? "" : formData.cartaoDestino })}
							/>
						</div>
					</div>
					<div className="flex justify-center text-auxiliary1-light">
						<IoArrowForward className="w-4 h-4" />
					</div>
					<CartaoPills
						label="Destino"
						selecionado={formData.cartaoDestino}
						excluir={formData.cartao}
						onSelecionar={(cartaoDestino) => setFormData({ ...formData, cartaoDestino })}
					/>
					{!contaDestinoValida && <p className="text-[10px] text-negative">Escolha a conta de destino.</p>}

					<ValorDataFields
						valor={formData.valor}
						data={formData.data_inicio}
						onValorChange={(valor) => setFormData({ ...formData, valor })}
						onDataChange={(data_inicio) => setFormData({ ...formData, data_inicio })}
					/>
				</div>
			)}

			{isPagamento && (
				<div className="space-y-s">
					<SectionHeader numero={2} titulo="Pagamento de fatura" />
					<CartaoPills
						label="De onde sai o dinheiro (débito)"
						selecionado={formData.cartao}
						onSelecionar={(cartao) => setFormData({ ...formData, cartao })}
					/>
					<div className="flex justify-center text-auxiliary1-light">
						<IoArrowForward className="w-4 h-4" />
					</div>
					<CartaoPills
						label="Fatura sendo paga (crédito)"
						selecionado={formData.cartaoDestino}
						onSelecionar={(cartaoDestino) => setFormData({ ...formData, cartaoDestino })}
					/>
					{!contaDestinoValida && <p className="text-[10px] text-negative">Escolha o cartão cuja fatura está sendo paga.</p>}

					<ValorDataFields
						valor={formData.valor}
						data={formData.data_inicio}
						onValorChange={(valor) => setFormData({ ...formData, valor })}
						onDataChange={(data_inicio) => setFormData({ ...formData, data_inicio })}
					/>
				</div>
			)}

			{isInvestimento && (
				<div className="space-y-s">
					<SectionHeader numero={2} titulo="Investimento" />
					<p className="text-xs text-auxiliary2-light">
						Vai para a conta <span className="font-bold text-white">Outros</span>.
					</p>
					<ValorDataFields
						valor={formData.valor}
						data={formData.data_inicio}
						onValorChange={(valor) => setFormData({ ...formData, valor })}
						onDataChange={(data_inicio) => setFormData({ ...formData, data_inicio })}
					/>
				</div>
			)}

			{isSaque && (
				<div className="space-y-s">
					<SectionHeader numero={2} titulo="Saque" />
					<CartaoPills
						label="Conta de saque"
						selecionado={formData.cartao}
						onSelecionar={(cartao) => setFormData({ ...formData, cartao })}
					/>
					<ValorDataFields
						valor={formData.valor}
						data={formData.data_inicio}
						onValorChange={(valor) => setFormData({ ...formData, valor })}
						onDataChange={(data_inicio) => setFormData({ ...formData, data_inicio })}
					/>
				</div>
			)}

			{isPadrao && (
				<div className="space-y-s">
					<SectionHeader numero={3} titulo="Detalhes" />
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-s">
						<div>
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
								<IoLayers className="w-3 h-3 text-auxiliary1-light" /> Categoria principal
							</label>
							<input
								required
								list="categorias-list"
								placeholder="Ex: Alimentação"
								className={inputClass}
								value={formData.classificacao_1}
								onChange={(e) => setFormData({ ...formData, classificacao_1: e.target.value })}
							/>
							<datalist id="categorias-list">
								{categoriasExistentes.map((c) => (
									<option key={c} value={c} />
								))}
							</datalist>
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
			)}

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
					disabled={loading || (precisaContaDestino && !contaDestinoValida)}
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

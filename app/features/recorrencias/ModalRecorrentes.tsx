"use client";

import { useState, useEffect } from "react";
import { TransacaoAcao, TransacaoCartao, TransacaoPayload } from "@/app/lib/types/transacao.type";
import { IoCard, IoBookmarks, IoCheckmark, IoAdd, IoTrashOutline, IoArrowDown, IoArrowUp, IoTrendingUp, IoTrendingDown, IoFlash } from "react-icons/io5";
import { TransacoesService } from "@/app/lib/api/transacoes.service";
import { Recorrencia, RecorrenciaPayload } from "@/app/lib/types/recorrencia.type";
import { RecorrenciasService } from "@/app/lib/api/recorrencias.service";
import { useToast } from "@/app/components/ToastProvider";
import { useConfirm } from "@/app/components/ConfirmDialog";
import { ehEntrada } from "@/app/lib/finance/categorias";
import { formatarMoeda } from "@/app/lib/format";
import { Modal } from "@/app/components/Modal";

interface ModalContasRecorrentesProps {
	isOpen: boolean;
	onClose: () => void;
	onSuccess: () => void;
}

const CARTAO_LABELS: Record<string, string> = {
	picpay: "PicPay",
	nubank: "Nubank",
	inter: "Inter",
	mercado_pago: "Mercado Pago",
	amazon: "Amazon",
	swile: "Swile",
	outro: "Outro",
};

// "transferência" fica de fora: recorrência não tem conta de destino, então
// uma recorrência de transferência sempre falharia ao ser lançada (o backend
// exige cartaoDestino para essa ação — ver CriarTransacaoUseCase).
const ACOES: readonly TransacaoAcao[] = ["compra", "pagamento", "depósito", "investimento", "saque"];

function mesAtualISO(): string {
	const hoje = new Date();
	return `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, "0")}`;
}

function descreverGeracao(recorrencia: Recorrencia): string | null {
	if (recorrencia.valorPadrao === null || recorrencia.cartaoPadrao === null) return null;
	if (recorrencia.ultimaGeracao?.startsWith(mesAtualISO())) return "Já lançada este mês";
	return "Será lançada automaticamente este mês";
}

export function ModalContasRecorrentes({ isOpen, onClose, onSuccess }: ModalContasRecorrentesProps) {
	const { showToast } = useToast();
	const confirm = useConfirm();
	const [recorrencias, setRecorrencias] = useState<Recorrencia[]>([]);
	const [loading, setLoading] = useState(true);
	const [selectedId, setSelectedId] = useState<string | null>(null);

	// Campos de confirmação do lançamento
	const [valor, setValor] = useState("");
	const [cartao, setCartao] = useState<TransacaoCartao>("picpay");
	const [dataInicio, setDataInicio] = useState(new Date().toISOString().split("T")[0]);
	const [enviando, setEnviando] = useState(false);

	// Form de cadastro de nova recorrência
	const [cadastrando, setCadastrando] = useState(false);
	const [novaCompra, setNovaCompra] = useState("");
	const [novoLocal, setNovoLocal] = useState("");
	const [novaAcao, setNovaAcao] = useState<TransacaoAcao>("pagamento");
	const [novaClassificacao1, setNovaClassificacao1] = useState("");
	const [novaClassificacao2, setNovaClassificacao2] = useState("");
	const [novoTipo, setNovoTipo] = useState<"debito" | "credito">("debito");
	// Opcionais: quando ambos definidos, o backend passa a lançar esta
	// recorrência automaticamente todo mês (ver GerarTransacoesRecorrentesUseCase).
	const [novoValorPadrao, setNovoValorPadrao] = useState("");
	const [novoCartaoPadrao, setNovoCartaoPadrao] = useState<TransacaoCartao | "">("");

	const carregar = async () => {
		setLoading(true);
		try {
			const data = await RecorrenciasService.listarTodas();
			setRecorrencias(data);
		} catch {
			showToast("Erro ao carregar recorrências.", "error");
		} finally {
			setLoading(false);
		}
	};

	const resetFormNovaRecorrencia = () => {
		setNovaCompra("");
		setNovoLocal("");
		setNovaAcao("pagamento");
		setNovaClassificacao1("");
		setNovaClassificacao2("");
		setNovoTipo("debito");
		setNovoValorPadrao("");
		setNovoCartaoPadrao("");
	};

	useEffect(() => {
		if (!isOpen) return;
		queueMicrotask(() => {
			void carregar();
		});
	}, [isOpen]);

	// Reset ao fechar
	useEffect(() => {
		if (isOpen) return;
		queueMicrotask(() => {
			setSelectedId(null);
			setValor("");
			setCartao("picpay");
			setDataInicio(new Date().toISOString().split("T")[0]);
			setCadastrando(false);
			resetFormNovaRecorrencia();
		});
	}, [isOpen]);

	const selecionada = recorrencias.find((r) => r.id === selectedId) || null;

	const handleSelecionar = (rec: Recorrencia) => {
		if (selectedId === rec.id) {
			setSelectedId(null);
			return;
		}
		setSelectedId(rec.id);
		// Pré-preenche com o valor/conta padrão da recorrência (quando definidos)
		// para lançamentos antecipados/extras — menos redigitação e menos risco
		// de lançar num valor/conta diferente do que a automação geraria.
		setCartao(rec.cartaoPadrao ?? "picpay");
		setValor(rec.valorPadrao !== null ? String(rec.valorPadrao) : "");
	};

	const handleSalvarLancamento = async () => {
		if (!selecionada || !valor) return;
		setEnviando(true);

		const payload: TransacaoPayload = {
			compra: selecionada.compra,
			local: selecionada.local || "",
			acao: selecionada.acao,
			classificacao_1: selecionada.classificacao_1,
			classificacao_2: selecionada.classificacao_2 || "",
			cartao,
			tipo: selecionada.tipo,
			valor: parseFloat(valor),
			parcelamento: selecionada.parcelamento,
			parcela: selecionada.parcela,
			data_inicio: new Date(dataInicio).toISOString(),
		};

		try {
			await TransacoesService.criar(payload);
			onSuccess();
			onClose();
			showToast("Lançamento registrado.", "success");
		} catch (error) {
			console.error("Erro ao salvar transação recorrente:", error);
			showToast("Erro ao salvar. Tente novamente.", "error");
		} finally {
			setEnviando(false);
		}
	};

	const handleCadastrarRecorrencia = async () => {
		if (!novaCompra.trim() || !novaClassificacao1.trim()) return;

		const payload: RecorrenciaPayload = {
			compra: novaCompra.trim(),
			acao: novaAcao,
			classificacao_1: novaClassificacao1.trim(),
			classificacao_2: novaClassificacao2.trim() || null,
			tipo: novoTipo,
			parcelamento: 1,
			parcela: 1,
			local: novoLocal.trim() || null,
			valorPadrao: novoValorPadrao ? parseFloat(novoValorPadrao) : null,
			cartaoPadrao: novoCartaoPadrao || null,
		};

		try {
			await RecorrenciasService.criar(payload);
			setCadastrando(false);
			resetFormNovaRecorrencia();
			await carregar();
			showToast("Recorrência cadastrada.", "success");
		} catch {
			showToast("Erro ao cadastrar recorrência.", "error");
		}
	};

	const handleRemoverRecorrencia = async (rec: Recorrencia) => {
		const confirmado = await confirm(`Remover a recorrência "${rec.compra}"?`, { title: "Remover recorrência" });
		if (!confirmado) return;
		try {
			await RecorrenciasService.deletar(rec.id);
			if (selectedId === rec.id) setSelectedId(null);
			await carregar();
			showToast("Recorrência removida.", "success");
		} catch {
			showToast("Erro ao remover recorrência.", "error");
		}
	};

	const inputClass =
		"w-full bg-dark-dark border border-dark-light rounded-s py-xs px-s text-sm text-white placeholder-auxiliary1/60 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all";
	const labelClass = "block text-[10px] font-bold text-auxiliary2-light uppercase tracking-widest mb-xs";

	const ganhos = recorrencias.filter((r) => ehEntrada(r.acao));

	const gastos = recorrencias.filter((r) => !ehEntrada(r.acao));

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			accent="secondary"
			icon={<IoBookmarks className="h-4 w-4" />}
			title="Contas Recorrentes"
			subtitle="Lançamento rápido"
			maxWidthClass="max-w-md"
			footer={
				selecionada ?
					<button
						type="button"
						onClick={handleSalvarLancamento}
						disabled={enviando || !valor}
						className="w-full py-s text-sm font-bold text-white rounded-s bg-gradient-to-r from-primary to-primary-light hover:from-primary-light hover:to-primary shadow-lg shadow-primary/20 disabled:opacity-40 transition-all active:scale-[0.98]">
						{enviando ? "Processando..." : "Confirmar Lançamento"}
					</button>
				:	<button
						type="button"
						onClick={onClose}
						className="w-full py-s text-sm font-bold text-auxiliary2-light hover:text-white border border-dark-light hover:border-auxiliary2-light rounded-s transition-all">
						Cancelar
					</button>
			}>
			{/* ── BODY (scrollável) ── */}
			<div className="flex-1 overflow-y-auto px-l py-m space-y-m">
					{loading ?
						<p className="text-xs text-auxiliary2-light text-center py-m">Carregando...</p>
					:	<>
							{/* Gastos */}
							{gastos.length > 0 && (
								<div className="space-y-xs">
									<div className="flex items-center gap-xs mb-s">
										<IoArrowDown className="w-3 h-3 text-negative flex-shrink-0" />
										<p className="text-[10px] font-bold text-negative uppercase tracking-widest">Gastos</p>
									</div>

									{gastos.map((rec) => (
										<RecorrenciaButton
											key={rec.id}
											recorrencia={rec}
											isSelected={selectedId === rec.id}
											onClick={() => handleSelecionar(rec)}
											onRemove={() => handleRemoverRecorrencia(rec)}
											color="negative"
										/>
									))}
								</div>
							)}

							{/* Ganhos */}
							{ganhos.length > 0 && (
								<div className="space-y-xs">
									<div className="flex items-center gap-xs mb-s">
										<IoArrowUp className="w-3 h-3 text-positive flex-shrink-0" />
										<p className="text-[10px] font-bold text-positive uppercase tracking-widest">Ganhos</p>
									</div>

									{ganhos.map((rec) => (
										<RecorrenciaButton
											key={rec.id}
											recorrencia={rec}
											isSelected={selectedId === rec.id}
											onClick={() => handleSelecionar(rec)}
											onRemove={() => handleRemoverRecorrencia(rec)}
											color="positive"
										/>
									))}
								</div>
							)}

							{recorrencias.length === 0 && !cadastrando && (
								<p className="text-xs text-auxiliary2-light text-center py-m">Nenhuma conta recorrente cadastrada.</p>
							)}

							{/* ── FORM DE NOVA RECORRÊNCIA ── */}
							{cadastrando ?
								<div className="pt-m border-t border-dark-light space-y-s">
									<p className="text-[10px] font-bold text-primary-ex-light uppercase tracking-widest">Nova conta recorrente</p>

									<div>
										<label className={labelClass}>Nome</label>
										<input
											placeholder="Ex: Enel - Luz"
											className={inputClass}
											value={novaCompra}
											onChange={(e) => setNovaCompra(e.target.value)}
											autoFocus
										/>
									</div>

									<div className="grid grid-cols-2 gap-s">
										<div>
											<label className={labelClass}>Categoria</label>
											<input
												placeholder="Ex: Moradia"
												className={inputClass}
												value={novaClassificacao1}
												onChange={(e) => setNovaClassificacao1(e.target.value)}
											/>
										</div>
										<div>
											<label className={labelClass}>Sub-categoria</label>
											<input
												placeholder="Opcional"
												className={inputClass}
												value={novaClassificacao2}
												onChange={(e) => setNovaClassificacao2(e.target.value)}
											/>
										</div>
									</div>

									<div>
										<label className={labelClass}>Local</label>
										<input placeholder="Opcional" className={inputClass} value={novoLocal} onChange={(e) => setNovoLocal(e.target.value)} />
									</div>

									<div className="grid grid-cols-2 gap-s">
										<div>
											<label className={labelClass}>Ação</label>
											<div className="relative">
												<select
													className={inputClass + " pr-8 appearance-none cursor-pointer"}
													value={novaAcao}
													onChange={(e) => setNovaAcao(e.target.value as TransacaoAcao)}>
													{ACOES.map((a) => (
														<option key={a} value={a}>
															{a}
														</option>
													))}
												</select>
											</div>
										</div>
										<div>
											<label className={labelClass}>Tipo</label>
											<div className="grid grid-cols-2 gap-xs">
												{(["debito", "credito"] as const).map((t) => (
													<button
														key={t}
														type="button"
														onClick={() => setNovoTipo(t)}
														className={`
															h-8 rounded-s border text-[10px] font-bold uppercase tracking-wide transition-all
															${
																novoTipo === t ?
																	t === "debito" ?
																		"bg-tertiary-dark/30 border-tertiary text-tertiary"
																	:	"bg-secondary-dark/30 border-secondary text-secondary-light"
																:	"bg-dark-dark border-dark-light text-auxiliary2-light hover:border-auxiliary2-light"
															}
														`}>
														{t === "debito" ? "Débito" : "Crédito"}
													</button>
												))}
											</div>
										</div>
									</div>

									<div>
										<label className={labelClass}>Lançamento automático (opcional)</label>
										<div className="grid grid-cols-2 gap-s">
											<input
												type="number"
												step="0.01"
												placeholder="Valor fixo"
												className={inputClass}
												value={novoValorPadrao}
												onChange={(e) => setNovoValorPadrao(e.target.value)}
											/>
											<select
												className={inputClass + " appearance-none cursor-pointer"}
												value={novoCartaoPadrao}
												onChange={(e) => setNovoCartaoPadrao(e.target.value as TransacaoCartao | "")}>
												<option value="">Sem conta fixa</option>
												{Object.entries(CARTAO_LABELS).map(([value, label]) => (
													<option key={value} value={value}>
														{label}
													</option>
												))}
											</select>
										</div>
										<p className="text-[10px] text-auxiliary1-light mt-xs">
											Preenchendo valor e conta, esta recorrência é lançada automaticamente todo mês.
										</p>
									</div>

									<div className="flex gap-s pt-xs">
										<button
											type="button"
											onClick={() => {
												setCadastrando(false);
												resetFormNovaRecorrencia();
											}}
											className="flex-1 py-xs text-sm font-bold text-auxiliary2-light hover:text-white border border-dark-light hover:border-auxiliary2-light rounded-s transition-all">
											Cancelar
										</button>
										<button
											type="button"
											onClick={handleCadastrarRecorrencia}
											disabled={!novaCompra.trim() || !novaClassificacao1.trim()}
											className="flex-1 py-xs text-sm font-bold text-white rounded-s bg-gradient-to-r from-primary to-primary-light hover:from-primary-light hover:to-primary disabled:opacity-40 transition-all">
											Cadastrar
										</button>
									</div>
								</div>
							:	<button
									type="button"
									onClick={() => setCadastrando(true)}
									className="w-full flex items-center justify-center gap-xs py-xs rounded-m border border-dashed border-dark-light text-auxiliary2-light hover:border-primary/40 hover:text-primary-ex-light transition-all text-xs font-bold uppercase tracking-wide">
									<IoAdd className="w-4 h-4" /> Nova conta recorrente
								</button>
							}

							{/* ── ÁREA DE CONFIRMAÇÃO — aparece ao selecionar ── */}
							{selecionada && (
								<div className="pt-m border-t border-dark-light space-y-s">
									<p className="text-[10px] font-bold text-primary-ex-light uppercase tracking-widest">Confirmar lançamento</p>
									{descreverGeracao(selecionada) === "Já lançada este mês" && (
										<p className="text-[10px] text-negative">
											Atenção: essa recorrência já foi lançada automaticamente este mês — confirmar aqui cria um lançamento extra.
										</p>
									)}

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
													onChange={(e) => setCartao(e.target.value as TransacaoCartao)}>
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

									<div>
										<label className={labelClass}>Data</label>
										<input type="date" className={inputClass} value={dataInicio} onChange={(e) => setDataInicio(e.target.value)} />
									</div>
								</div>
							)}
						</>
					}
				</div>
		</Modal>
	);
}

/* ── Subcomponente ── */
interface RecorrenciaButtonProps {
	recorrencia: Recorrencia;
	isSelected: boolean;
	onClick: () => void;
	onRemove: () => void;
	color: "negative" | "positive";
}

function RecorrenciaButton({ recorrencia, isSelected, onClick, onRemove, color }: RecorrenciaButtonProps) {
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

	const isGanho = ehEntrada(recorrencia.acao);
	const automatica = recorrencia.valorPadrao !== null && recorrencia.cartaoPadrao !== null;
	const statusGeracao = descreverGeracao(recorrencia);

	return (
		<div
			className={`
				w-full flex items-center gap-s px-s py-xs rounded-m border
				text-sm font-semibold transition-all duration-150
				${isSelected ? colors.active : colors.inactive}
			`}>
			<button type="button" onClick={onClick} className="flex-1 flex items-center gap-s text-left min-w-0">
				<span className={`text-base flex-shrink-0 ${colors.icon}`}>
					{isGanho ?
						<IoTrendingUp />
					:	<IoTrendingDown />}
				</span>
				<span className="flex-1 min-w-0">
					<span className="flex items-center gap-xs">
						<span className="block truncate">{recorrencia.local ? `${recorrencia.local} - ${recorrencia.compra}` : recorrencia.compra}</span>
						{automatica && (
							<span
								title="Lançamento automático mensal"
								className="flex items-center gap-[2px] flex-shrink-0 text-[9px] font-bold uppercase tracking-wide text-primary-ex-light border border-primary/30 bg-primary-dark/40 px-xs py-[1px] rounded">
								<IoFlash className="w-2.5 h-2.5" /> Auto
							</span>
						)}
					</span>
					<span className="block text-[10px] text-auxiliary2-light truncate">
						{recorrencia.classificacao_1}
						{automatica && ` · ${formatarMoeda(recorrencia.valorPadrao ?? 0)} · ${CARTAO_LABELS[recorrencia.cartaoPadrao ?? "outro"]}`}
					</span>
					{statusGeracao && <span className="block text-[10px] text-auxiliary1-light truncate">{statusGeracao}</span>}
				</span>
				{isSelected && (
					<span
						className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 ${color === "negative" ? "bg-negative" : "bg-positive"}`}>
						<IoCheckmark className="w-3 h-3 text-white" />
					</span>
				)}
			</button>
			<button
				type="button"
				onClick={onRemove}
				title="Remover"
				className="p-xs rounded-s text-auxiliary2-light hover:text-negative hover:bg-negative/10 transition-all flex-shrink-0">
				<IoTrashOutline className="w-3 h-3" />
			</button>
		</div>
	);
}

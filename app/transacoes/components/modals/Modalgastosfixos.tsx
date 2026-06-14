"use client";

import { useEffect, useState } from "react";
import { IoClose, IoTrendingDown, IoAdd, IoCheckmark, IoPencil, IoTrashOutline, IoCash } from "react-icons/io5";
import { formatarMoeda } from "@/app/core/presentation/utils/formatting";
import { GastoFixo, GastoFixoPayload } from "../../../src/types/gasto-fixo.type";
import { GastosFixosService } from "../../../src/services/gastos-fixos.service";


interface ModalGastosFixosProps {
	isOpen: boolean;
	onClose: () => void;
	onSuccess?: () => void;
}

export function ModalGastosFixos({ isOpen, onClose, onSuccess }: ModalGastosFixosProps) {
	const [gastos, setGastos] = useState<GastoFixo[]>([]);
	const [loading, setLoading] = useState(true);
	const [editandoId, setEditandoId] = useState<string | null>(null);
	const [nomeEditado, setNomeEditado] = useState("");
	const [valorEditado, setValorEditado] = useState("");
	const [adicionando, setAdicionando] = useState(false);
	const [novoNome, setNovoNome] = useState("");
	const [novoValor, setNovoValor] = useState("");

	const carregar = async () => {
		setLoading(true);
		try {
			const data = await GastosFixosService.listarTodos();
			setGastos(data);
		} catch {
			alert("Erro ao carregar gastos fixos.");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (isOpen) carregar();
	}, [isOpen]);

	if (!isOpen) return null;

	const total = gastos.reduce((acc, g) => acc + (g.valor ?? 0), 0);

	const iniciarEdicao = (gasto: GastoFixo) => {
		setEditandoId(gasto.id);
		setNomeEditado(gasto.nome);
		setValorEditado(String(gasto.valor ?? ""));
	};

	const salvarEdicao = async (gasto: GastoFixo) => {
		try {
			await GastosFixosService.atualizar(gasto.id, { nome: nomeEditado, valor: Number(valorEditado) });
			setEditandoId(null);
			await carregar();
			onSuccess?.();
		} catch {
			alert("Erro ao atualizar gasto fixo.");
		}
	};

	const remover = async (gasto: GastoFixo) => {
		if (!confirm(`Remover o gasto "${gasto.nome}"?`)) return;
		try {
			await GastosFixosService.deletar(gasto.id);
			await carregar();
			onSuccess?.();
		} catch {
			alert("Erro ao remover gasto fixo.");
		}
	};

	const adicionar = async () => {
		if (!novoNome.trim() || !novoValor) return;
		const payload: GastoFixoPayload = {
			nome: novoNome.trim(),
			valor: Number(novoValor),
		};
		try {
			await GastosFixosService.criar(payload);
			setNovoNome("");
			setNovoValor("");
			setAdicionando(false);
			await carregar();
			onSuccess?.();
		} catch {
			alert("Erro ao adicionar gasto fixo.");
		}
	};

	const inputClass =
		"bg-dark-dark border border-dark-light rounded-s py-xs px-s text-sm text-white placeholder-auxiliary1/60 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all";

	return (
		<div
			className="fixed inset-0 z-[1001] flex items-center justify-center p-m"
			style={{ backgroundColor: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)" }}>
			<div className="bg-dark border border-dark-light rounded-xl shadow-2xl w-full max-w-sm flex flex-col">
				{/* ── HEADER ── */}
				<div className="flex items-center justify-between px-l pt-l pb-m border-b border-dark-light">
					<div className="flex items-center gap-s">
						<span className="w-9 h-9 rounded-s bg-negative/10 border border-negative/30 flex items-center justify-center text-negative flex-shrink-0">
							<IoTrendingDown className="w-4 h-4" />
						</span>
						<div>
							<h2 className="font-space-grotesk font-bold text-lg text-white leading-tight">Gastos Fixos</h2>
							<p className="text-[10px] text-auxiliary2-light uppercase tracking-widest">Despesas mensais</p>
						</div>
					</div>
					<button
						type="button"
						onClick={onClose}
						className="p-xs rounded-full hover:bg-white/10 text-auxiliary2-light hover:text-white transition-colors flex-shrink-0">
						<IoClose className="w-5 h-5" />
					</button>
				</div>

				{/* ── LISTA ── */}
				<div className="px-l py-m space-y-xs">
					{loading ?
						<p className="text-xs text-auxiliary2-light text-center py-m">Carregando...</p>
					: gastos.length === 0 ?
						<p className="text-xs text-auxiliary2-light text-center py-m">Nenhum gasto fixo cadastrado.</p>
					:	gastos.map((gasto) => (
							<div
								key={gasto.id}
								className="flex items-center justify-between py-xs px-s rounded-s border border-dark-light bg-dark-dark/60 hover:border-negative/20 hover:bg-negative/5 transition-all">
								{editandoId === gasto.id ?
									<div className="flex items-center gap-xs flex-1 min-w-0">
										<input
											autoFocus
											className={`${inputClass} flex-1 min-w-0`}
											value={nomeEditado}
											onChange={(e) => setNomeEditado(e.target.value)}
										/>
										<input
											type="number"
											step="0.01"
											className={`${inputClass} w-24 text-right`}
											value={valorEditado}
											onChange={(e) => setValorEditado(e.target.value)}
										/>
										<button
											type="button"
											onClick={() => salvarEdicao(gasto)}
											title="Confirmar"
											className="p-xs rounded-s bg-positive/10 border border-positive/30 text-positive hover:bg-positive/20 transition-all flex-shrink-0">
											<IoCheckmark className="w-4 h-4" />
										</button>
									</div>
								:	<>
										<div className="flex items-center gap-s min-w-0">
											<span className="w-8 h-8 rounded-s bg-dark border border-dark-light flex items-center justify-center text-negative/70 flex-shrink-0">
												<IoCash className="w-4 h-4" />
											</span>
											<div className="min-w-0">
												<p className="text-sm font-bold text-white leading-tight truncate">{gasto.nome}</p>
											</div>
										</div>
										<div className="flex items-center gap-xs flex-shrink-0">
											<span className="text-sm font-bold tabular-nums text-negative">−{formatarMoeda(gasto.valor)}</span>
											<button
												type="button"
												onClick={() => iniciarEdicao(gasto)}
												title="Editar"
												className="p-xs rounded-s bg-dark-dark border border-dark-light hover:bg-primary-dark/50 hover:border-primary/50 text-auxiliary2-light hover:text-white transition-all">
												<IoPencil className="w-3 h-3" />
											</button>
											<button
												type="button"
												onClick={() => remover(gasto)}
												title="Remover"
												className="p-xs rounded-s bg-dark-dark border border-dark-light hover:bg-negative/10 hover:border-negative/40 text-auxiliary2-light hover:text-negative transition-all">
												<IoTrashOutline className="w-3 h-3" />
											</button>
										</div>
									</>
								}
							</div>
						))
					}

					{/* ── FORM DE ADIÇÃO ── */}
					{adicionando ?
						<div className="flex items-center gap-xs py-xs px-s rounded-s border border-dark-light bg-dark-dark/60">
							<input
								placeholder="Nome (ex: Aluguel)"
								className={`${inputClass} flex-1 min-w-0`}
								value={novoNome}
								onChange={(e) => setNovoNome(e.target.value)}
							/>
							<input
								type="number"
								step="0.01"
								placeholder="Valor"
								className={`${inputClass} w-24`}
								value={novoValor}
								onChange={(e) => setNovoValor(e.target.value)}
							/>
							<button
								type="button"
								onClick={adicionar}
								title="Confirmar"
								className="p-xs rounded-s bg-positive/10 border border-positive/30 text-positive hover:bg-positive/20 transition-all flex-shrink-0">
								<IoCheckmark className="w-4 h-4" />
							</button>
						</div>
					:	<button
							type="button"
							onClick={() => setAdicionando(true)}
							className="w-full flex items-center justify-center gap-xs py-xs rounded-s border border-dashed border-dark-light text-auxiliary2-light hover:border-negative/40 hover:text-negative transition-all text-xs font-bold uppercase tracking-wide">
							<IoAdd className="w-4 h-4" /> Adicionar gasto fixo
						</button>
					}
				</div>

				{/* ── TOTAL ── */}
				<div className="mx-l mb-m px-s py-s rounded-s bg-negative/10 border border-negative/20 flex items-center justify-between">
					<p className="text-xs font-bold text-negative uppercase tracking-widest">Total mensal</p>
					<p className="text-base font-bold tabular-nums text-negative">−{formatarMoeda(total)}</p>
				</div>

				{/* ── FOOTER ── */}
				<div className="px-l pb-l border-t border-dark-light pt-m">
					<button
						type="button"
						onClick={onClose}
						className="w-full py-xs text-sm font-bold text-auxiliary2-light hover:text-white border border-dark-light hover:border-auxiliary2-light rounded-s transition-all">
						Fechar
					</button>
				</div>
			</div>
		</div>
	);
}

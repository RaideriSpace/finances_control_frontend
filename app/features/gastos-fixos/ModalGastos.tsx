"use client";

import { useEffect, useMemo, useState } from "react";
import { IoTrendingDown, IoAdd, IoCheckmark, IoPencil, IoTrashOutline, IoCash } from "react-icons/io5";
import { formatarMoeda } from "@/app/lib/format";
import { GastoFixo, GastoFixoPayload } from "@/app/lib/types/gasto-fixo.type";
import { GastosFixosService } from "@/app/lib/api/gastos-fixos.service";
import { useToast } from "@/app/components/ToastProvider";
import { useConfirm } from "@/app/components/ConfirmDialog";
import { Modal } from "@/app/components/Modal";

interface ModalGastosFixosProps {
	isOpen: boolean;
	onClose: () => void;
	onSuccess?: () => void;
}

export function ModalGastosFixos({ isOpen, onClose, onSuccess }: ModalGastosFixosProps) {
	const { showToast } = useToast();
	const confirm = useConfirm();
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
			showToast("Erro ao carregar gastos fixos.", "error");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (!isOpen) return;
		// Adia para depois do commit do efeito — o carregamento em si (e o
		// setState síncrono de `loading` que ele faz) não deve rodar
		// sincronamente dentro do corpo do efeito.
		queueMicrotask(() => {
			void carregar();
		});
	}, [isOpen]);

	// Ordenados do maior para o menor peso no orçamento — ajuda a priorizar
	// onde cortar, que é o motivo de existir essa tela.
	const gastosOrdenados = useMemo(() => [...gastos].sort((a, b) => (b.valor ?? 0) - (a.valor ?? 0)), [gastos]);
	const total = useMemo(() => gastos.reduce((acc, g) => acc + (g.valor ?? 0), 0), [gastos]);
	const maiorValor = useMemo(() => Math.max(1, ...gastos.map((g) => g.valor ?? 0)), [gastos]);

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
			showToast("Gasto fixo atualizado.", "success");
		} catch {
			showToast("Erro ao atualizar gasto fixo.", "error");
		}
	};

	const remover = async (gasto: GastoFixo) => {
		const confirmado = await confirm(`Remover o gasto "${gasto.nome}"?`, { title: "Remover gasto fixo" });
		if (!confirmado) return;
		try {
			await GastosFixosService.deletar(gasto.id);
			await carregar();
			onSuccess?.();
			showToast("Gasto fixo removido.", "success");
		} catch {
			showToast("Erro ao remover gasto fixo.", "error");
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
			showToast("Gasto fixo adicionado.", "success");
		} catch {
			showToast("Erro ao adicionar gasto fixo.", "error");
		}
	};

	const inputClass =
		"bg-dark-dark border border-dark-light rounded-s py-xs px-s text-sm text-white placeholder-auxiliary1/60 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all";

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			accent="negative"
			icon={<IoTrendingDown className="h-4 w-4" />}
			title="Gastos Fixos"
			subtitle={gastos.length > 0 ? `${gastos.length} despesa${gastos.length === 1 ? "" : "s"} mensais` : "Despesas mensais"}
			footer={
				<div className="space-y-m">
					<div className="flex items-center justify-between rounded-s border border-negative/20 bg-negative/10 px-s py-s">
						<p className="text-xs font-bold uppercase tracking-widest text-negative">Total mensal</p>
						<p className="text-base font-bold tabular-nums text-negative">−{formatarMoeda(total)}</p>
					</div>
					<button
						type="button"
						onClick={onClose}
						className="w-full rounded-s border border-dark-light py-xs text-sm font-bold text-auxiliary2-light transition-all hover:border-auxiliary2-light hover:text-white">
						Fechar
					</button>
				</div>
			}>
			<div className="flex-1 space-y-xs overflow-y-auto px-l py-m">
				{loading ?
					<p className="py-m text-center text-xs text-auxiliary2-light">Carregando...</p>
				: gastos.length === 0 ?
					<p className="py-m text-center text-xs text-auxiliary2-light">Nenhum gasto fixo cadastrado.</p>
				:	gastosOrdenados.map((gasto) => (
						<div
							key={gasto.id}
							className="rounded-m border border-dark-light bg-dark-dark/60 px-s py-xs transition-all hover:border-negative/20 hover:bg-negative/5">
							{editandoId === gasto.id ?
								<div className="flex items-center gap-xs">
									<input
										autoFocus
										className={`${inputClass} min-w-0 flex-1`}
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
										className="flex-shrink-0 rounded-s border border-positive/30 bg-positive/10 p-xs text-positive transition-all hover:bg-positive/20">
										<IoCheckmark className="h-4 w-4" />
									</button>
								</div>
							:	<>
									<div className="flex items-center justify-between gap-s">
										<div className="flex min-w-0 items-center gap-s">
											<span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-s border border-dark-light bg-dark text-negative/70">
												<IoCash className="h-4 w-4" />
											</span>
											<div className="min-w-0">
												<p className="truncate text-sm font-bold leading-tight text-white">{gasto.nome}</p>
												<p className="text-[10px] text-auxiliary1-light">
													{total > 0 ? `${(((gasto.valor ?? 0) / total) * 100).toFixed(0)}% do total` : ""}
												</p>
											</div>
										</div>
										<div className="flex flex-shrink-0 items-center gap-xs">
											<span className="text-sm font-bold tabular-nums text-negative">−{formatarMoeda(gasto.valor)}</span>
											<button
												type="button"
												onClick={() => iniciarEdicao(gasto)}
												title="Editar"
												className="rounded-s border border-dark-light bg-dark-dark p-xs text-auxiliary2-light transition-all hover:border-primary/50 hover:bg-primary-dark/50 hover:text-white">
												<IoPencil className="h-3 w-3" />
											</button>
											<button
												type="button"
												onClick={() => remover(gasto)}
												title="Remover"
												className="rounded-s border border-dark-light bg-dark-dark p-xs text-auxiliary2-light transition-all hover:border-negative/40 hover:bg-negative/10 hover:text-negative">
												<IoTrashOutline className="h-3 w-3" />
											</button>
										</div>
									</div>
									<div className="mt-xs h-1 overflow-hidden rounded-full bg-dark">
										<div
											className="h-full rounded-full bg-negative/70"
											style={{ width: `${Math.max(4, ((gasto.valor ?? 0) / maiorValor) * 100)}%` }}
										/>
									</div>
								</>
							}
						</div>
					))
				}

				{/* ── FORM DE ADIÇÃO ── */}
				{adicionando ?
					<div className="flex items-center gap-xs rounded-m border border-dark-light bg-dark-dark/60 px-s py-xs">
						<input
							placeholder="Nome (ex: Aluguel)"
							className={`${inputClass} min-w-0 flex-1`}
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
							className="flex-shrink-0 rounded-s border border-positive/30 bg-positive/10 p-xs text-positive transition-all hover:bg-positive/20">
							<IoCheckmark className="h-4 w-4" />
						</button>
					</div>
				:	<button
						type="button"
						onClick={() => setAdicionando(true)}
						className="flex w-full items-center justify-center gap-xs rounded-m border border-dashed border-dark-light py-xs text-xs font-bold uppercase tracking-wide text-auxiliary2-light transition-all hover:border-negative/40 hover:text-negative">
						<IoAdd className="h-4 w-4" /> Adicionar gasto fixo
					</button>
				}
			</div>
		</Modal>
	);
}

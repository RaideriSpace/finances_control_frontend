"use client";

import { useEffect, useState } from "react";
import { IoClose, IoWallet, IoTrendingUp, IoAdd, IoCheckmark, IoPencil, IoTrashOutline } from "react-icons/io5";
import { formatarMoeda } from "@/app/core/presentation/utils/formatting";
import { Saldo, SaldoPayload } from "../../../src/types/saldo.type";
import { SaldoService } from "../../../src/services/saldo.service";


interface ModalSaldoFixoProps {
	isOpen: boolean;
	onClose: () => void;
	onSuccess?: () => void;
}

const FONTE_LABELS: Record<string, string> = {
	uliving: "Uliving",
	proa: "PROA",
	swile: "Swile",
};

const DIA_RESET_POR_FONTE: Record<string, number> = {
	swile: 25,
	proa: 20,
	uliving: 5,
};

function calcularMesReferencia(fonte: string): string {
	const hoje = new Date();
	const diaReset = DIA_RESET_POR_FONTE[fonte.toLowerCase()] ?? 1;
	let ano = hoje.getFullYear();
	let mes = hoje.getMonth();

	if (hoje.getDate() >= diaReset) {
		mes += 1;
		if (mes > 11) {
			mes = 0;
			ano += 1;
		}
	}

	return `${ano}-${String(mes + 1).padStart(2, "0")}-01`;
}

function mesAtualISO() {
	const d = new Date();
	const ano = d.getFullYear();
	const mes = String(d.getMonth() + 1).padStart(2, "0");
	return `${ano}-${mes}-01`;
}

export function ModalSaldoFixo({ isOpen, onClose, onSuccess }: ModalSaldoFixoProps) {
	const [saldos, setSaldos] = useState<Saldo[]>([]);
	const [loading, setLoading] = useState(true);
	const [editandoId, setEditandoId] = useState<string | null>(null);
	const [valorEditado, setValorEditado] = useState("");
	const [adicionando, setAdicionando] = useState(false);
	const [novaFonte, setNovaFonte] = useState("");
	const [novoValor, setNovoValor] = useState("");

	const carregar = async () => {
		setLoading(true);
		try {
			const data = await SaldoService.listarAtual();
			setSaldos(data);
		} catch {
			alert("Erro ao carregar saldos.");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (isOpen) carregar();
	}, [isOpen]);

	if (!isOpen) return null;

	const total = saldos.reduce((acc, s) => acc + (s.valor ?? 0), 0);

	const iniciarEdicao = (saldo: Saldo) => {
		setEditandoId(saldo.id);
		setValorEditado(String(saldo.valor ?? ""));
	};

	const salvarEdicao = async (saldo: Saldo) => {
		try {
			await SaldoService.atualizar(saldo.id, { valor: Number(valorEditado) });
			setEditandoId(null);
			await carregar();
			onSuccess?.();
		} catch {
			alert("Erro ao atualizar saldo.");
		}
	};

	const remover = async (saldo: Saldo) => {
		if (!confirm(`Remover o saldo de ${FONTE_LABELS[saldo.fonte] ?? saldo.fonte}?`)) return;
		try {
			await SaldoService.deletar(saldo.id);
			await carregar();
			onSuccess?.();
		} catch {
			alert("Erro ao remover saldo.");
		}
	};

	const adicionar = async () => {
		if (!novaFonte.trim() || !novoValor) return;
		const payload: SaldoPayload = {
			fonte: novaFonte.trim().toLowerCase(),
			valor: Number(novoValor),
			mes: calcularMesReferencia(novaFonte),
		};
		try {
			await SaldoService.criar(payload);
			setNovaFonte("");
			setNovoValor("");
			setAdicionando(false);
			await carregar();
			onSuccess?.();
		} catch {
			alert("Erro ao adicionar saldo.");
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
						<span className="w-9 h-9 rounded-s bg-positive/10 border border-positive/30 flex items-center justify-center text-positive flex-shrink-0">
							<IoTrendingUp className="w-4 h-4" />
						</span>
						<div>
							<h2 className="font-space-grotesk font-bold text-lg text-white leading-tight">Saldos Fixos</h2>
							<p className="text-[10px] text-auxiliary2-light uppercase tracking-widest">Previsão do ciclo atual</p>
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
					: saldos.length === 0 ?
						<p className="text-xs text-auxiliary2-light text-center py-m">Nenhum saldo cadastrado para este ciclo.</p>
					:	saldos.map((saldo) => (
							<div
								key={saldo.id}
								className="flex items-center justify-between py-xs px-s rounded-s border border-dark-light bg-dark-dark/60 hover:border-positive/20 hover:bg-positive/5 transition-all">
								<div className="flex items-center gap-s min-w-0">
									<span className="w-8 h-8 rounded-s bg-dark border border-dark-light flex items-center justify-center text-positive/70 flex-shrink-0">
										<IoWallet className="w-4 h-4" />
									</span>
									<div className="min-w-0">
										<p className="text-sm font-bold text-white leading-tight truncate">{FONTE_LABELS[saldo.fonte] ?? saldo.fonte}</p>
										<p className="text-[10px] text-auxiliary2-light">{saldo.mes ?? "Sem mês definido"}</p>
									</div>
								</div>

								{editandoId === saldo.id ?
									<div className="flex items-center gap-xs flex-shrink-0">
										<input
											type="number"
											step="0.01"
											autoFocus
											className={`${inputClass} w-24 text-right`}
											value={valorEditado}
											onChange={(e) => setValorEditado(e.target.value)}
										/>
										<button
											type="button"
											onClick={() => salvarEdicao(saldo)}
											title="Confirmar"
											className="p-xs rounded-s bg-positive/10 border border-positive/30 text-positive hover:bg-positive/20 transition-all">
											<IoCheckmark className="w-4 h-4" />
										</button>
									</div>
								:	<div className="flex items-center gap-xs flex-shrink-0">
										<span className="text-sm font-bold tabular-nums text-positive">{formatarMoeda(saldo.valor ?? 0)}</span>
										<button
											type="button"
											onClick={() => iniciarEdicao(saldo)}
											title="Editar"
											className="p-xs rounded-s bg-dark-dark border border-dark-light hover:bg-primary-dark/50 hover:border-primary/50 text-auxiliary2-light hover:text-white transition-all">
											<IoPencil className="w-3 h-3" />
										</button>
										<button
											type="button"
											onClick={() => remover(saldo)}
											title="Remover"
											className="p-xs rounded-s bg-dark-dark border border-dark-light hover:bg-negative/10 hover:border-negative/40 text-auxiliary2-light hover:text-negative transition-all">
											<IoTrashOutline className="w-3 h-3" />
										</button>
									</div>
								}
							</div>
						))
					}

					{/* ── FORM DE ADIÇÃO ── */}
					{adicionando ?
						<div className="flex items-center gap-xs py-xs px-s rounded-s border border-dark-light bg-dark-dark/60">
							<input
								placeholder="Fonte (ex: uliving)"
								className={`${inputClass} flex-1 min-w-0`}
								value={novaFonte}
								onChange={(e) => setNovaFonte(e.target.value)}
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
							className="w-full flex items-center justify-center gap-xs py-xs rounded-s border border-dashed border-dark-light text-auxiliary2-light hover:border-positive/40 hover:text-positive transition-all text-xs font-bold uppercase tracking-wide">
							<IoAdd className="w-4 h-4" /> Adicionar saldo
						</button>
					}
				</div>

				{/* ── TOTAL ── */}
				<div className="mx-l mb-m px-s py-s rounded-s bg-positive/10 border border-positive/20 flex items-center justify-between">
					<p className="text-xs font-bold text-positive uppercase tracking-widest">Total previsto</p>
					<p className="text-base font-bold tabular-nums text-positive">{formatarMoeda(total)}</p>
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

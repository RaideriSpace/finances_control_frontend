"use client";

import { useEffect, useMemo, useState } from "react";
import { IoWallet, IoTrendingUp, IoAdd, IoCheckmark, IoPencil, IoTrashOutline, IoRefresh } from "react-icons/io5";
import { formatarMoeda } from "@/app/lib/format";
import { Saldo, SaldoPayload } from "@/app/lib/types/saldo.type";
import { SaldoService } from "@/app/lib/api/saldo.service";
import { useToast } from "@/app/components/ToastProvider";
import { useConfirm } from "@/app/components/ConfirmDialog";
import { Modal } from "@/app/components/Modal";

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

// Espelha DIA_RESET_POR_FONTE do backend (saldo/domain/saldo.rules.ts) só
// para exibição — o cálculo em si continua sendo feito lá, isso aqui é
// puramente informativo para o usuário entender por que um saldo "sumiu" ou
// "apareceu" no ciclo atual.
const DIA_RESET_POR_FONTE: Record<string, number> = {
	swile: 25,
	proa: 20,
	uliving: 5,
};
const DIA_RESET_PADRAO = 1;
const ORDEM_CONHECIDA = Object.keys(FONTE_LABELS);

function descreverReset(fonte: string): string {
	const dia = DIA_RESET_POR_FONTE[fonte] ?? DIA_RESET_PADRAO;
	return `Reseta todo dia ${dia}`;
}

function formatarMesReferencia(mes: string | null): string {
	if (!mes) return "Sem mês definido";
	const [ano, mesNumero] = mes.split("-");
	const nome = new Date(Number(ano), Number(mesNumero) - 1, 1).toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
	return nome.charAt(0).toUpperCase() + nome.slice(1);
}

export function ModalSaldoFixo({ isOpen, onClose, onSuccess }: ModalSaldoFixoProps) {
	const { showToast } = useToast();
	const confirm = useConfirm();
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
			showToast("Erro ao carregar saldos.", "error");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (!isOpen) return;
		queueMicrotask(() => {
			void carregar();
		});
	}, [isOpen]);

	const saldosOrdenados = useMemo(
		() =>
			[...saldos].sort((a, b) => {
				const posA = ORDEM_CONHECIDA.indexOf(a.fonte);
				const posB = ORDEM_CONHECIDA.indexOf(b.fonte);
				if (posA === -1 && posB === -1) return a.fonte.localeCompare(b.fonte);
				if (posA === -1) return 1;
				if (posB === -1) return -1;
				return posA - posB;
			}),
		[saldos],
	);
	const total = useMemo(() => saldos.reduce((acc, s) => acc + (s.valor ?? 0), 0), [saldos]);

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
			showToast("Saldo atualizado.", "success");
		} catch {
			showToast("Erro ao atualizar saldo.", "error");
		}
	};

	const remover = async (saldo: Saldo) => {
		const confirmado = await confirm(`Remover o saldo de ${FONTE_LABELS[saldo.fonte] ?? saldo.fonte}?`, { title: "Remover saldo" });
		if (!confirmado) return;
		try {
			await SaldoService.deletar(saldo.id);
			await carregar();
			onSuccess?.();
			showToast("Saldo removido.", "success");
		} catch {
			showToast("Erro ao remover saldo.", "error");
		}
	};

	const adicionar = async () => {
		if (!novaFonte.trim() || !novoValor) return;
		// O mês de referência (considerando o dia de reset por fonte) é
		// calculado pelo backend quando omitido — evita duplicar aqui a mesma
		// regra de negócio que já existe em saldo.rules.ts.
		const payload: SaldoPayload = {
			fonte: novaFonte.trim().toLowerCase(),
			valor: Number(novoValor),
		};
		try {
			await SaldoService.criar(payload);
			setNovaFonte("");
			setNovoValor("");
			setAdicionando(false);
			await carregar();
			onSuccess?.();
			showToast("Saldo adicionado.", "success");
		} catch {
			showToast("Erro ao adicionar saldo.", "error");
		}
	};

	const inputClass =
		"bg-dark-dark border border-dark-light rounded-s py-xs px-s text-sm text-white placeholder-auxiliary1/60 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all";

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			accent="positive"
			icon={<IoTrendingUp className="h-4 w-4" />}
			title="Saldos Fixos"
			subtitle="Previsão do ciclo atual"
			footer={
				<div className="space-y-m">
					<div className="flex items-center justify-between rounded-s border border-positive/20 bg-positive/10 px-s py-s">
						<p className="text-xs font-bold uppercase tracking-widest text-positive">Total previsto</p>
						<p className="text-base font-bold tabular-nums text-positive">{formatarMoeda(total)}</p>
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
				: saldos.length === 0 ?
					<p className="py-m text-center text-xs text-auxiliary2-light">Nenhum saldo cadastrado para este ciclo.</p>
				:	saldosOrdenados.map((saldo) => (
						<div
							key={saldo.id}
							className="flex items-center justify-between rounded-m border border-dark-light bg-dark-dark/60 px-s py-xs transition-all hover:border-positive/20 hover:bg-positive/5">
							<div className="flex min-w-0 items-center gap-s">
								<span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-s border border-dark-light bg-dark text-positive/70">
									<IoWallet className="h-4 w-4" />
								</span>
								<div className="min-w-0">
									<p className="truncate text-sm font-bold leading-tight text-white">{FONTE_LABELS[saldo.fonte] ?? saldo.fonte}</p>
									<p className="truncate text-[10px] text-auxiliary2-light">{formatarMesReferencia(saldo.mes)}</p>
									<p className="flex items-center gap-[3px] text-[10px] text-auxiliary1-light">
										<IoRefresh className="h-2.5 w-2.5 flex-shrink-0" /> {descreverReset(saldo.fonte)}
									</p>
								</div>
							</div>

							{editandoId === saldo.id ?
								<div className="flex flex-shrink-0 items-center gap-xs">
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
										className="rounded-s border border-positive/30 bg-positive/10 p-xs text-positive transition-all hover:bg-positive/20">
										<IoCheckmark className="h-4 w-4" />
									</button>
								</div>
							:	<div className="flex flex-shrink-0 items-center gap-xs">
									<span className="text-sm font-bold tabular-nums text-positive">{formatarMoeda(saldo.valor ?? 0)}</span>
									<button
										type="button"
										onClick={() => iniciarEdicao(saldo)}
										title="Editar"
										className="rounded-s border border-dark-light bg-dark-dark p-xs text-auxiliary2-light transition-all hover:border-primary/50 hover:bg-primary-dark/50 hover:text-white">
										<IoPencil className="h-3 w-3" />
									</button>
									<button
										type="button"
										onClick={() => remover(saldo)}
										title="Remover"
										className="rounded-s border border-dark-light bg-dark-dark p-xs text-auxiliary2-light transition-all hover:border-negative/40 hover:bg-negative/10 hover:text-negative">
										<IoTrashOutline className="h-3 w-3" />
									</button>
								</div>
							}
						</div>
					))
				}

				{/* ── FORM DE ADIÇÃO ── */}
				{adicionando ?
					<div className="flex items-center gap-xs rounded-m border border-dark-light bg-dark-dark/60 px-s py-xs">
						<input
							list="fontes-conhecidas"
							placeholder="Fonte (ex: uliving)"
							className={`${inputClass} min-w-0 flex-1`}
							value={novaFonte}
							onChange={(e) => setNovaFonte(e.target.value)}
						/>
						<datalist id="fontes-conhecidas">
							{ORDEM_CONHECIDA.map((fonte) => (
								<option key={fonte} value={fonte} />
							))}
						</datalist>
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
						className="flex w-full items-center justify-center gap-xs rounded-m border border-dashed border-dark-light py-xs text-xs font-bold uppercase tracking-wide text-auxiliary2-light transition-all hover:border-positive/40 hover:text-positive">
						<IoAdd className="h-4 w-4" /> Adicionar saldo
					</button>
				}
			</div>
		</Modal>
	);
}

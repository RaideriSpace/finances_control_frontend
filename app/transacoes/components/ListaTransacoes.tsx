"use client";

import { useState, useMemo } from "react";
import { Transacao } from "../../src/types/transacao.type";
import { formatarMoeda, formatarData } from "@/app/core/presentation/utils/formatting";
import { IoSearch, IoFilter, IoClose, IoCalendar, IoCard, IoWallet } from "react-icons/io5";
import { FaEdit } from "react-icons/fa";
import { FaTrashCan } from "react-icons/fa6";
import { TransacoesService } from "../../src/services/transacoes.service";
import { FormularioTransacao } from "./modals/FormularioTransacao";
import { DashboardCards } from "./DashboardCards";

interface ListaTransacoesProps {
	initialData: Transacao[];
}

export function ListaTransacoes({ initialData }: ListaTransacoesProps) {
	const [transacoes, setTransacoes] = useState<Transacao[]>(initialData);
	const [transacaoEditando, setTransacaoEditando] = useState<Transacao | null>(null);

	const currentMonth = useMemo(() => {
		const d = new Date();
		return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
	}, []);

	const [busca, setBusca] = useState("");
	const [filtroCartao, setFiltroCartao] = useState("");
	const [filtroTipo, setFiltroTipo] = useState("");
	const [filtroClassificacao, setFiltroClassificacao] = useState("");
	const [filtroMes, setFiltroMes] = useState(currentMonth);

	const removerDaLista = (id: string) => {
		setTransacoes((prev) => prev.filter((t) => t.id !== id));
	};

	const handleDelete = async (transacao: Transacao) => {
		if (!confirm("Deseja deletar permanentemente esta transação?")) return;
		try {
			await TransacoesService.deletar(transacao.id);
			removerDaLista(transacao.id);
		} catch {
			alert("Erro ao deletar transação.");
		}
	};

	const classificacoesUnicas = useMemo(() => {
		const classifs = transacoes.map((t) => t.classificacao_1).filter(Boolean);
		return Array.from(new Set(classifs)).sort();
	}, [transacoes]);

	const mesesUnicos = useMemo(() => {
		const meses = transacoes.map((t) => (t.data_pagamento ? t.data_pagamento.substring(0, 7) : "")).filter(Boolean);
		return Array.from(new Set(meses)).sort((a, b) => b.localeCompare(a));
	}, [transacoes]);

	const transacoesFiltradas = useMemo(() => {
		return [...transacoes]
			.filter((t) => {
				const matchBusca = t.compra.toLowerCase().includes(busca.toLowerCase()) || (t.local && t.local.toLowerCase().includes(busca.toLowerCase()));
				const matchCartao = filtroCartao ? t.cartao === filtroCartao : true;
				const matchTipo = filtroTipo ? t.tipo === filtroTipo : true;
				const matchClassificacao = filtroClassificacao ? t.classificacao_1 === filtroClassificacao : true;
				const matchMes = filtroMes && t.data_pagamento ? t.data_pagamento.substring(0, 7) === filtroMes : true;
				return matchBusca && matchCartao && matchTipo && matchClassificacao && matchMes;
			})
			.sort((a, b) => {
				const dataA = a.data_pagamento ? new Date(a.data_pagamento).getTime() : 0;
				const dataB = b.data_pagamento ? new Date(b.data_pagamento).getTime() : 0;
				if (dataB !== dataA) return dataB - dataA;
				return (b.insert_date ?? 0) > (a.insert_date ?? 0) ? 1 : -1;
			});
	}, [transacoes, busca, filtroCartao, filtroTipo, filtroClassificacao, filtroMes]);

	const selectClass =
		"bg-dark-dark border border-dark-light rounded-s px-s py-xs text-xs font-semibold text-auxiliary2-ex-light focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors cursor-pointer";

	// Cor da borda esquerda por conta/cartão
	const cartaoBorderColor: Record<string, string> = {
		picpay: "border-x-positive",
		inter: "border-x-secondary",
		mercado_pago: "border-x-auxiliary1",
		amazon: "border-x-auxiliary2",
		swile: "border-x-tertiary",
		nubank: "border-x-primary-light",
		outro: "border-x-tertiary-ex-dark",
	};

	const cartaoTagColor: Record<string, string> = {
		picpay: "positive",
		inter: "secondary",
		mercado_pago: "auxiliary1",
		amazon: "auxiliary2",
		swile: "tertiary",
		nubank: "primary-light",
		outro: "tertiary-ex-dark",
	};

	return (
		<>
			<DashboardCards data={transacoes} />

			<section className="mt-l space-y-m">
				{/* ===== CABEÇALHO ===== */}
				<div className="flex items-center justify-between">
					<div>
						<h2 className="font-space-grotesk text-2xl font-bold text-white leading-tight">Lançamentos</h2>
						<p className="text-xs text-auxiliary2-light mt-[2px]">{transacoesFiltradas.length} transações encontradas</p>
					</div>
				</div>

				{/* ===== FILTROS ===== */}
				<div className="bg-dark border border-dark-light rounded-m p-s flex flex-wrap gap-s items-center">
					{/* Busca */}
					<div className="relative flex-1 min-w-[180px]">
						<IoSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-auxiliary1-light w-4 h-4 pointer-events-none" />
						<input
							type="text"
							placeholder="Buscar por nome ou local..."
							className="w-full pl-9 pr-4 py-xs bg-dark-dark border border-dark-light rounded-s text-sm text-white placeholder-auxiliary1 focus:ring-2 focus:ring-primary outline-none transition-colors"
							value={busca}
							onChange={(e) => setBusca(e.target.value)}
						/>
					</div>

					{/* Selects */}
					<div className="flex flex-wrap gap-xs items-center">
						<IoFilter className="text-auxiliary2-light w-4 h-4" />
						<select className={selectClass} value={filtroMes} onChange={(e) => setFiltroMes(e.target.value)}>
							<option value="">Todos os meses</option>
							{mesesUnicos.map((mes) => {
								const [ano, m] = mes.split("-");
								return (
									<option key={mes} value={mes}>
										{m}/{ano}
									</option>
								);
							})}
						</select>
						<select className={selectClass} value={filtroClassificacao} onChange={(e) => setFiltroClassificacao(e.target.value)}>
							<option value="">Categoria</option>
							{classificacoesUnicas.map((c) => (
								<option key={c} value={c}>
									{c}
								</option>
							))}
						</select>
						<select className={selectClass} value={filtroCartao} onChange={(e) => setFiltroCartao(e.target.value)}>
							<option value="">Conta</option>
							{Array.from(new Set(transacoes.map((t) => t.cartao))).map((c) => (
								<option key={c} value={c}>
									{c.toUpperCase()}
								</option>
							))}
						</select>
						<select className={selectClass} value={filtroTipo} onChange={(e) => setFiltroTipo(e.target.value)}>
							<option value="">Tipo</option>
							<option value="debito">Débito</option>
							<option value="credito">Crédito</option>
						</select>
					</div>
				</div>

				{/* ===== LISTA DE TRANSAÇÕES ===== */}
				{transacoesFiltradas.length === 0 ?
					<div className="flex flex-col items-center justify-center py-xxl text-auxiliary2-light bg-dark border border-dark-light rounded-m">
						<IoSearch className="w-10 h-10 mb-s opacity-40" />
						<p className="text-sm font-medium">Nenhuma transação encontrada.</p>
						<p className="text-xs mt-xs opacity-60">Tente ajustar os filtros.</p>
					</div>
				:	<div className="flex flex-col gap-[2px]">
						{transacoesFiltradas.map((t, index) => {
							let isNegative = true;

							if (t.acao === "depósito" || t.acao === "investimento" || t.acao === "rendimento") isNegative = false;

							const borderColor = cartaoBorderColor[t.cartao] ?? "border-x-dark-light";
							const tagColor = cartaoTagColor[t.cartao] ?? "dark-light";
							const textTagColor = cartaoTagColor[t.cartao].includes("dark") ? "white" : "black";
							const isFirst = index === 0;
							const isLast = index === transacoesFiltradas.length - 1;
							const roundedClass =
								isFirst && isLast ? "rounded-m"
								: isFirst ? "rounded-t-m"
								: isLast ? "rounded-b-m"
								: "rounded-none";

							return (
								<div
									key={t.id}
									className={`
										bg-dark border border-dark-light border-x-4 ${borderColor} ${roundedClass}
										flex items-center gap-m px-s py-s
										hover:bg-dark/20
										transition-all duration-150
									`}>
									{/* Ícone do tipo */}
									<div className="hidden sm:flex flex-shrink-0 w-9 h-9 rounded-s items-center justify-center bg-dark-dark border border-dark-light">
										{t.tipo === "credito" ?
											<IoCard className="w-4 h-4 text-secondary-light" />
										:	<IoWallet className="w-4 h-4 text-tertiary" />}
									</div>

									{/* Conteúdo principal */}
									<div className="flex-1 min-w-0">
										{/* Linha 1 */}
										<div className="flex flex-wrap items-center gap-xs">
											<span className="text-sm font-bold text-white truncate max-w-[200px] sm:max-w-none">{t.compra}</span>
											{t.local && <span className="text-xs text-auxiliary2-light hidden sm:inline">· {t.local}</span>}
											<span
												className={`text-[10px] font-bold uppercase tracking-wide px-xs py-[2px] rounded border ${t.tipo === "credito" ? "border-secondary/30 text-secondary-ex-light bg-secondary-dark/10" : "border-tertiary/30 text-tertiary-ex-light bg-tertiary-dark/10"} flex-shrink-0`}>
												{t.classificacao_1}
											</span>
										</div>

										{/* Linha 2 */}
										<div className="flex items-center gap-xs mt-[3px] flex-wrap">
											<span className="flex items-center gap-[3px] text-[11px] text-auxiliary2-light">
												<IoCalendar className="w-3 h-3" />
												{t.data_pagamento ? formatarData(t.data_pagamento) : "Pendente"}
											</span>
											<span className="text-dark-light">·</span>
											<span
												className={`text-[10px] font-bold uppercase tracking-wide px-xs py-[2px] rounded border border-primary/30 text-${textTagColor} bg-${tagColor}`}>
												{t.cartao}
											</span>
											<span className={`text-[10px] uppercase ${t.tipo === "credito" ? "text-secondary" : "text-tertiary"} font-medium`}>
												{t.tipo}
											</span>
											{t.parcelamento > 1 && (
												<span className="text-[10px] text-auxiliary1-light">
													{t.parcela}/{t.parcelamento}x
												</span>
											)}
										</div>
									</div>

									{/* Valor + Ações */}
									<div className="flex items-center gap-s flex-shrink-0">
										<span className={`text-base font-bold tabular-nums ${isNegative ? "text-negative" : "text-positive"}`}>
											{isNegative ? "-" : "+"}
											{formatarMoeda(t.valor)}
										</span>

										{/* Botões de ação — sempre visíveis */}
										<div className="flex flex-col items-center gap-xs">
											<button
												type="button"
												onClick={() => setTransacaoEditando(t)}
												title="Editar"
												className="p-xs rounded-s bg-dark-dark border border-dark-light hover:bg-primary-dark/50 hover:border-primary/50 text-auxiliary2-light hover:text-white transition-all">
												<FaEdit className="w-3 h-3 sm:w-4 sm:h-4" />
											</button>
											<button
												type="button"
												onClick={() => handleDelete(t)}
												title="Deletar"
												className="p-xs rounded-s bg-dark-dark border border-dark-light hover:bg-negative/10 hover:border-negative/40 text-auxiliary2-light hover:text-negative transition-all">
												<FaTrashCan className="w-3 h-3 sm:w-4 sm:h-4" />
											</button>
										</div>
									</div>
								</div>
							);
						})}
					</div>
				}
			</section>

			{/* ===== MODAL DE EDIÇÃO ===== */}
			{transacaoEditando && (
				<div
					className="fixed inset-0 flex items-center justify-center z-[1001] p-m"
					style={{ backgroundColor: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)" }}>
					<div className="bg-dark border border-dark-light rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
						{/* Header do modal */}
						<div className="flex items-center justify-between px-xl pt-l pb-m border-b border-dark-light">
							<h2 className="text-white font-space-grotesk font-bold text-xl flex items-center gap-s">
								<span className="w-8 h-8 rounded-s bg-primary-dark border border-primary/30 flex items-center justify-center text-primary-ex-light">
									<FaEdit className="w-4 h-4" />
								</span>
								Editar Transação
							</h2>
							<button
								type="button"
								onClick={() => setTransacaoEditando(null)}
								className="p-xs rounded-full hover:bg-white/10 text-auxiliary2-light hover:text-white transition-colors">
								<IoClose className="w-6 h-6" />
							</button>
						</div>

						{/* Formulário */}
						<div className="p-xl">
							<FormularioTransacao
								initialData={transacaoEditando}
								categoriasExistentes={classificacoesUnicas}
								onSuccess={() => {
									setTransacaoEditando(null);
									window.location.reload();
								}}
								onCancel={() => setTransacaoEditando(null)}
							/>
						</div>
					</div>
				</div>
			)}
		</>
	);
}

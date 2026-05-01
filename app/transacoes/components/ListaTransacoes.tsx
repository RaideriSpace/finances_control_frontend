"use client";

import { useState, useMemo } from "react";
import { TransacaoActions } from "./TransacaoActions";
import { FormularioTransacao } from "./FormularioTransacao";
import { Transacao } from "../../src/types/transacao.type";
import BigNumbers from "./BigNumbers";

export function ListaTransacoes({ initialData }: { initialData: Transacao[] }) {
	const [transacoes, setTransacoes] = useState<Transacao[]>(initialData);
	const [transacaoEditando, setTransacaoEditando] = useState<Transacao | null>(null);

	// Estados dos Filtros
	const [busca, setBusca] = useState("");
	const [filtroCartao, setFiltroCartao] = useState("");
	const [filtroTipo, setFiltroTipo] = useState("");
	const [filtroClassificacao, setFiltroClassificacao] = useState("");
	const [ordemValor, setOrdemValor] = useState("");

	const removerDaLista = (id: string) => {
		setTransacoes((prev) => prev.filter((t) => t.id !== id));
	};

	// Lógica de Filtro e Ordenação
	const transacoesFiltradas = useMemo(() => {
		const hoje = new Date().getTime();

		let filtradas = transacoes.filter((t) => {
			const dataPagamento = new Date(t.data_pagamento).getTime();
			if (dataPagamento > hoje) return false;

			const termoBusca = busca.toLowerCase();
			const matchBusca = t.compra.toLowerCase().includes(termoBusca) || (t.estabelecimento && t.estabelecimento.toLowerCase().includes(termoBusca));

			const matchCartao = filtroCartao ? t.cartao === filtroCartao : true;
			const matchTipo = filtroTipo ? t.tipo === filtroTipo : true;
			const matchClassificacao = filtroClassificacao ? t.classificacao.toLowerCase().includes(filtroClassificacao.toLowerCase()) : true;

			return matchBusca && matchCartao && matchTipo && matchClassificacao;
		});

		if (ordemValor === "maior") {
			filtradas.sort((a, b) => b.valor - a.valor);
		} else if (ordemValor === "menor") {
			filtradas.sort((a, b) => a.valor - b.valor);
		} else {
			filtradas.sort((a, b) => {
				const dataA = new Date(a.data_pagamento).getTime();
				const dataB = new Date(b.data_pagamento).getTime();
				return dataB - dataA;
			});
		}

		return filtradas;
	}, [transacoes, busca, filtroCartao, filtroTipo, filtroClassificacao, ordemValor]);

	// Auxiliar: Cores dos Cartões
	const getCartaoEstilo = (cartao: string) => {
		const estilos: Record<string, string> = {
			picpay: "bg-green-900 text-green-100",
			inter: "bg-orange-800 text-orange-100",
			mercado_pago: "bg-yellow-700 text-yellow-100",
			mercado_livre: "bg-yellow-700 text-yellow-100",
			amazon: "bg-blue-900 text-blue-100",
			swile: "bg-rose-900 text-rose-100",
			nubank: "bg-purple-900 text-purple-100",
			outro: "bg-slate-700 text-slate-300",
		};
		return estilos[cartao] || estilos.outro;
	};

	// Auxiliar: Cor do Valor (Saída vs Entrada)
	const getValorEstilo = (acao: string) => {
		const acoesSaida = ["pagamento", "saque", "transferência", "compra"];
		return acoesSaida.includes(acao) ? "text-rose-400" : "text-emerald-400";
	};

	const inputDarkClass =
		"w-full bg-slate-800 text-slate-200 border border-slate-700 p-2.5 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all placeholder-slate-500 shadow-inner";

	return (
		<>
			{/* 1. DASHBOARD DE RESUMOS (Responde aos filtros) */}
			<div className="space-y-8 mb-10">
				<div className="flex flex-col items-center">
					<h2 className="text-xl font-bold pb-4 text-slate-400 uppercase tracking-widest text-center">Saldo em Conta</h2>
					<div className="flex flex-wrap w-full gap-4 justify-center">
						<BigNumbers data={transacoesFiltradas} account="picpay" credit={false} />
						<BigNumbers data={transacoesFiltradas} account="inter" credit={false} />
						<BigNumbers data={transacoesFiltradas} account="swile" credit={false} />
						<BigNumbers data={transacoesFiltradas} account="outro" credit={false} />
					</div>
				</div>

				<div className="flex flex-col items-center">
					<h2 className="text-xl font-bold pb-4 text-slate-400 uppercase tracking-widest text-center">Fatura Cartão</h2>
					<div className="flex flex-wrap w-full gap-4 justify-center">
						<BigNumbers data={transacoesFiltradas} account="picpay" credit={true} />
						<BigNumbers data={transacoesFiltradas} account="inter" credit={true} />
						<BigNumbers data={transacoesFiltradas} account="outro" credit={true} />
					</div>
				</div>
			</div>

			{/* 2. BARRA DE BUSCA E FILTROS */}
			<div className="bg-slate-900 p-5 rounded-2xl shadow-lg shadow-black/20 border border-slate-800 mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
				<div className="lg:col-span-2">
					<input
						type="text"
						placeholder="Buscar por nome ou estabelecimento..."
						className={inputDarkClass}
						value={busca}
						onChange={(e) => setBusca(e.target.value)}
					/>
				</div>

				<select className={inputDarkClass} value={filtroCartao} onChange={(e) => setFiltroCartao(e.target.value)}>
					<option value="">💳 Todos os Cartões</option>
					<option value="picpay">PicPay</option>
					<option value="nubank">Nubank</option>
					<option value="inter">Inter</option>
					<option value="mercado_pago">Mercado Pago</option>
					<option value="amazon">Amazon</option>
					<option value="swile">Swile</option>
					<option value="outro">Outro</option>
				</select>

				<select className={inputDarkClass} value={filtroTipo} onChange={(e) => setFiltroTipo(e.target.value)}>
					<option value="">🔄 Tipo: Todos</option>
					<option value="debito">Débito</option>
					<option value="credito">Crédito</option>
				</select>

				<select className={inputDarkClass} value={ordemValor} onChange={(e) => setOrdemValor(e.target.value)}>
					<option value="">💲 Ordenar Preço</option>
					<option value="maior">Maior Valor</option>
					<option value="menor">Menor Valor</option>
				</select>
			</div>

			{/* 3. LISTAGEM DE RESULTADOS */}
			{transacoesFiltradas.length === 0 ?
				<div className="text-center p-12 bg-slate-900/50 rounded-3xl border-2 border-dashed border-slate-700 flex flex-col items-center justify-center">
					<p className="text-slate-400 text-lg">Nenhuma transação encontrada.</p>
					<button
						onClick={() => {
							setBusca("");
							setFiltroCartao("");
							setFiltroTipo("");
							setOrdemValor("");
						}}
						className="text-indigo-400 font-semibold mt-4 hover:text-indigo-300 transition-colors bg-indigo-500/10 px-4 py-2 rounded-lg">
						Limpar Filtros
					</button>
				</div>
			:	<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					{transacoesFiltradas.map((item) => (
						<div
							key={item.id}
							className="group flex flex-row justify-between items-start p-5 bg-slate-900 border border-slate-800 rounded-2xl shadow-md hover:border-indigo-500/50 transition-all duration-300">
							<div className="flex flex-col">
								<span className="font-bold text-lg text-slate-100 group-hover:text-indigo-300 transition-colors">{item.compra}</span>
								<span className="text-xs text-slate-500 font-medium mt-1">
									{new Intl.DateTimeFormat("pt-BR").format(new Date(item.data_pagamento))}
								</span>

								<div className="text-sm text-slate-400 mt-2 flex flex-wrap items-center gap-2">
									<span className="bg-slate-800 px-2 py-0.5 rounded-md text-xs">{item.estabelecimento || "S/N"}</span>
									<span className="w-1 h-1 rounded-full bg-slate-600"></span>
									<span className={`capitalize rounded-md px-2 text-xs font-bold ${getCartaoEstilo(item.cartao)}`}>
										{item.cartao.replace("_", " ")}
									</span>
									<span className="w-1 h-1 rounded-full bg-slate-600"></span>
									<span className="text-slate-300">{item.classificacao}</span>
								</div>

								<span className={`text-xl font-black mt-3 tracking-tight ${getValorEstilo(item.acao)}`}>
									{new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(item.valor)}
								</span>
							</div>

							<div className="opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity self-start">
								<TransacaoActions transacao={item} onDeleteSuccess={removerDaLista} onEdit={(t) => setTransacaoEditando(t)} />
							</div>
						</div>
					))}
				</div>
			}

			{/* 4. MODAL DE EDIÇÃO */}
			{transacaoEditando && (
				<div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
					<div className="bg-slate-900 border border-slate-700 p-6 sm:p-8 rounded-[2rem] w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl shadow-black/50">
						<h2 className="text-2xl font-black text-slate-100 mb-6 flex items-center gap-3">
							<span className="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center">✏️</span>
							Editar Transação
						</h2>
						<FormularioTransacao
							initialData={transacaoEditando}
							onSuccess={() => {
								setTransacaoEditando(null);
								window.location.reload();
							}}
							onCancel={() => setTransacaoEditando(null)}
						/>
					</div>
				</div>
			)}
		</>
	);
}

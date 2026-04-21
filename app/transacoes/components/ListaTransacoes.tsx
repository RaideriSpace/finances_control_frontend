"use client";

import { useState, useMemo } from "react";
import { TransacaoActions } from "./TransacaoActions";
import { FormularioTransacao } from "./FormularioTransacao";
import { Transacao } from "../../src/types/transacao.type";

export function ListaTransacoes({ initialData }: { initialData: Transacao[] }) {
	// 1. Estado dos Dados
	const [transacoes, setTransacoes] = useState<Transacao[]>(initialData);
	const [transacaoEditando, setTransacaoEditando] = useState<Transacao | null>(null);

	// 2. Estados dos Filtros
	const [busca, setBusca] = useState("");
	const [filtroCartao, setFiltroCartao] = useState("");
	const [filtroTipo, setFiltroTipo] = useState("");
	const [filtroClassificacao, setFiltroClassificacao] = useState("");
	const [ordemValor, setOrdemValor] = useState(""); // 'maior' ou 'menor'

	const removerDaLista = (id: string) => {
		setTransacoes((prev) => prev.filter((t) => t.id !== id));
	};

	// 3. Lógica de Filtragem (useMemo garante que só rode quando os filtros ou dados mudarem)
	const transacoesFiltradas = useMemo(() => {
		let filtradas = transacoes.filter((t) => {
			const termoBusca = busca.toLowerCase();
			const matchBusca = t.compra.toLowerCase().includes(termoBusca) || (t.estabelecimento && t.estabelecimento.toLowerCase().includes(termoBusca));

			const matchCartao = filtroCartao ? t.cartao === filtroCartao : true;
			const matchTipo = filtroTipo ? t.tipo === filtroTipo : true;
			const matchClassificacao = filtroClassificacao ? t.classificacao.toLowerCase().includes(filtroClassificacao.toLowerCase()) : true;

			return matchBusca && matchCartao && matchTipo && matchClassificacao;
		});

		// 1. ORDENAÇÃO POR DATA (Padrão: Mais nova primeiro)
		// Convertemos as strings YYYY-MM-DD para getTime() para comparar números
		filtradas.sort((a, b) => {
			const dataA = new Date(a.data_inicio).getTime();
			const dataB = new Date(b.data_inicio).getTime();
			return dataB - dataA; // Ordem decrescente (mais nova no topo)
		});

		// 2. ORDENAÇÃO POR VALOR (Se o usuário selecionar no filtro)
		if (ordemValor === "maior") {
			filtradas.sort((a, b) => b.valor - a.valor);
		} else if (ordemValor === "menor") {
			filtradas.sort((a, b) => a.valor - b.valor);
		}

		return filtradas;
	}, [transacoes, busca, filtroCartao, filtroTipo, filtroClassificacao, ordemValor]);

	return (
		<>
			{/* BARRA DE BUSCA E FILTROS */}
			<div className="bg-white p-4 rounded-xl shadow-sm border mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
				{/* Busca Geral (Ocupa mais espaço) */}
				<div className="lg:col-span-2">
					<input
						type="text"
						placeholder="Buscar por nome ou estabelecimento..."
						className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
						value={busca}
						onChange={(e) => setBusca(e.target.value)}
					/>
				</div>

				{/* Filtro Cartão */}
				<select className="border p-2 rounded-lg outline-none" value={filtroCartao} onChange={(e) => setFiltroCartao(e.target.value)}>
					<option value="">💳 Todos os Cartões</option>
					<option value="picpay">PicPay</option>
					<option value="nubank">Nubank</option>
					<option value="inter">Inter</option>
					<option value="mercado_pago">Mercado Pago</option>
					<option value="amazon">Amazon</option>
					<option value="swile">Swile</option>
					<option value="outro">Outro</option>
				</select>

				{/* Filtro Tipo */}
				<select className="border p-2 rounded-lg outline-none" value={filtroTipo} onChange={(e) => setFiltroTipo(e.target.value)}>
					<option value="">🔄 Tipo: Todos</option>
					<option value="debito">Débito</option>
					<option value="credito">Crédito</option>
				</select>

				{/* Ordenação por Preço */}
				<select className="border p-2 rounded-lg outline-none" value={ordemValor} onChange={(e) => setOrdemValor(e.target.value)}>
					<option value="">💲 Ordenar Preço</option>
					<option value="maior">Maior Valor</option>
					<option value="menor">Menor Valor</option>
				</select>
			</div>

			{/* RESULTADOS */}
			{transacoesFiltradas.length === 0 ?
				<div className="text-center p-10 bg-gray-50 rounded-xl border-2 border-dashed">
					<p className="text-gray-500">Nenhuma transação encontrada com estes filtros.</p>
					<button
						onClick={() => {
							setBusca("");
							setFiltroCartao("");
							setFiltroTipo("");
							setOrdemValor("");
						}}
						className="text-blue-600 font-semibold mt-2 underline">
						Limpar Filtros
					</button>
				</div>
			:	<div className="grid gap-4">
					{transacoesFiltradas.map((item) => (
						<div
							key={item.id}
							className="flex flex-col md:flex-row md:justify-between items-start md:items-center p-5 border rounded-xl shadow-sm bg-white hover:border-blue-200 transition">
							<div className="flex flex-col">
								<span className="font-bold text-lg text-gray-800">{item.compra}</span>
								<span className="text-xs text-gray-400">{new Intl.DateTimeFormat("pt-BR").format(new Date(item.data_inicio))}</span>
								<span className="text-sm text-gray-500">
									{item.estabelecimento} • <span className="capitalize">{item.cartao.replace("_", " ")}</span> • {item.classificacao}
								</span>
								<span className={`text-lg font-bold mt-1 ${item.tipo === "debito" ? "text-red-500" : "text-green-600"}`}>
									{new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(item.valor)}
								</span>
							</div>

							<TransacaoActions transacao={item} onDeleteSuccess={removerDaLista} onEdit={(t) => setTransacaoEditando(t)} />
						</div>
					))}
				</div>
			}

			{/* MODAL DE EDIÇÃO */}
			{transacaoEditando && (
				<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
					<div className="bg-white p-6 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
						<h2 className="text-2xl font-bold mb-6">Editar Transação</h2>

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

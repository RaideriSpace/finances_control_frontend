"use client";

import { IoClose, IoFlash, IoHome, IoGlobe, IoCard, IoTrendingDown } from "react-icons/io5";
import { formatarMoeda } from "@/app/core/presentation/utils/formatting";

interface ModalGastosFixosProps {
	isOpen: boolean;
	onClose: () => void;
}

const GASTOS_FIXOS = [
	{ label: "Aluguel", icon: <IoHome className="w-4 h-4" />, valor: 2300, descricao: "NN Negócios" },
	{ label: "Cartões", icon: <IoCard className="w-4 h-4" />, valor: 2000, descricao: "Crédito mensal estimado" },
	{ label: "Conta de Luz", icon: <IoFlash className="w-4 h-4" />, valor: 150, descricao: "Enel" },
	{ label: "Internet", icon: <IoGlobe className="w-4 h-4" />, valor: 100, descricao: "Vivo Fibra" },
];

const TOTAL = GASTOS_FIXOS.reduce((acc, g) => acc + g.valor, 0);

export function ModalGastosFixos({ isOpen, onClose }: ModalGastosFixosProps) {
	if (!isOpen) return null;

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
					{GASTOS_FIXOS.map((gasto) => (
						<div
							key={gasto.label}
							className="flex items-center justify-between py-xs px-s rounded-s border border-dark-light bg-dark-dark/60 hover:border-negative/20 hover:bg-negative/5 transition-all">
							<div className="flex items-center gap-s">
								<span className="w-8 h-8 rounded-s bg-dark border border-dark-light flex items-center justify-center text-negative/70 flex-shrink-0">
									{gasto.icon}
								</span>
								<div>
									<p className="text-sm font-bold text-white leading-tight">{gasto.label}</p>
									<p className="text-[10px] text-auxiliary2-light">{gasto.descricao}</p>
								</div>
							</div>
							<span className="text-sm font-bold tabular-nums text-negative flex-shrink-0">−{formatarMoeda(gasto.valor)}</span>
						</div>
					))}
				</div>

				{/* ── TOTAL ── */}
				<div className="mx-l mb-m px-s py-s rounded-s bg-negative/10 border border-negative/20 flex items-center justify-between">
					<p className="text-xs font-bold text-negative uppercase tracking-widest">Total mensal</p>
					<p className="text-base font-bold tabular-nums text-negative">−{formatarMoeda(TOTAL)}</p>
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

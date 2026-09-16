"use client";

import { useEffect, type ReactNode } from "react";
import { IoClose } from "react-icons/io5";

type ModalAccent = "primary" | "secondary" | "tertiary" | "positive" | "negative";

interface ModalProps {
	isOpen: boolean;
	onClose: () => void;
	icon: ReactNode;
	accent?: ModalAccent;
	title: string;
	subtitle?: ReactNode;
	maxWidthClass?: string;
	children: ReactNode;
	footer?: ReactNode;
}

const ACCENTES: Record<ModalAccent, { barra: string; badge: string; icone: string }> = {
	primary: { barra: "bg-primary", badge: "bg-primary-dark/50 border-primary/30", icone: "text-primary-ex-light" },
	secondary: { barra: "bg-secondary", badge: "bg-secondary-dark/50 border-secondary/30", icone: "text-secondary-light" },
	tertiary: { barra: "bg-tertiary", badge: "bg-tertiary-dark/50 border-tertiary/30", icone: "text-tertiary-ex-light" },
	positive: { barra: "bg-positive", badge: "bg-positive/10 border-positive/30", icone: "text-positive" },
	negative: { barra: "bg-negative", badge: "bg-negative/10 border-negative/30", icone: "text-negative" },
};

/**
 * Casca visual única para os modais de CRUD rápido (gastos fixos, saldos,
 * recorrências, resumo do ano) — antes cada um duplicava o próprio backdrop
 * + header + fechar, com pequenas inconsistências entre eles.
 */
export function Modal({ isOpen, onClose, icon, accent = "primary", title, subtitle, maxWidthClass = "max-w-sm", children, footer }: ModalProps) {
	useEffect(() => {
		if (!isOpen) return;
		function onKeyDown(e: KeyboardEvent) {
			if (e.key === "Escape") onClose();
		}
		window.addEventListener("keydown", onKeyDown);
		return () => window.removeEventListener("keydown", onKeyDown);
	}, [isOpen, onClose]);

	if (!isOpen) return null;
	const cores = ACCENTES[accent];

	return (
		<div
			className="fixed inset-0 z-[1001] flex items-center justify-center p-m bg-black/70 backdrop-blur-md animate-overlay-in"
			onClick={onClose}
			role="presentation">
			<div
				onClick={(e) => e.stopPropagation()}
				className={`relative flex w-full ${maxWidthClass} max-h-[90vh] flex-col overflow-hidden rounded-2xl border border-dark-light bg-dark shadow-2xl animate-modal-in`}
				role="dialog"
				aria-modal="true"
				aria-label={title}>
				<div className={`absolute left-0 top-0 h-1 w-full ${cores.barra}`} />

				<div className="flex flex-shrink-0 items-center justify-between gap-s border-b border-dark-light px-l pb-m pt-l">
					<div className="flex min-w-0 items-center gap-s">
						<span className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-s border ${cores.badge} ${cores.icone}`}>{icon}</span>
						<div className="min-w-0">
							<h2 className="truncate font-space-grotesk text-lg font-bold leading-tight text-white">{title}</h2>
							{subtitle && <div className="truncate text-[10px] uppercase tracking-widest text-auxiliary2-light">{subtitle}</div>}
						</div>
					</div>
					<button
						type="button"
						onClick={onClose}
						aria-label="Fechar modal"
						className="flex-shrink-0 rounded-full p-xs text-auxiliary2-light transition-colors hover:bg-white/10 hover:text-white">
						<IoClose className="h-5 w-5" />
					</button>
				</div>

				<div className="flex min-h-0 flex-1 flex-col">{children}</div>

				{footer && <div className="flex-shrink-0 border-t border-dark-light px-l py-m">{footer}</div>}
			</div>
		</div>
	);
}

"use client";

import { createContext, useCallback, useContext, useRef, useState } from "react";

interface ConfirmOptions {
	title?: string;
	confirmLabel?: string;
	cancelLabel?: string;
}

interface ConfirmState extends ConfirmOptions {
	message: string;
}

type ConfirmFn = (message: string, options?: ConfirmOptions) => Promise<boolean>;

const ConfirmContext = createContext<ConfirmFn | null>(null);

/**
 * Substitui `window.confirm()` — bloqueante e inconsistente com o resto da UI —
 * por um diálogo no mesmo estilo visual dos modais do app, resolvido via Promise.
 */
export function ConfirmProvider({ children }: { children: React.ReactNode }) {
	const [state, setState] = useState<ConfirmState | null>(null);
	const resolverRef = useRef<((value: boolean) => void) | null>(null);

	const confirm = useCallback<ConfirmFn>((message, options) => {
		setState({ message, ...options });
		return new Promise<boolean>((resolve) => {
			resolverRef.current = resolve;
		});
	}, []);

	const responder = (resultado: boolean) => {
		setState(null);
		resolverRef.current?.(resultado);
		resolverRef.current = null;
	};

	return (
		<ConfirmContext.Provider value={confirm}>
			{children}
			{state && (
				<div
					className="fixed inset-0 z-[3000] flex items-center justify-center p-m"
					style={{ backgroundColor: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)" }}
					role="alertdialog"
					aria-modal="true">
					<div className="w-full max-w-sm rounded-xl border border-dark-light bg-dark p-l shadow-2xl">
						{state.title && <h2 className="mb-xs font-space-grotesk text-lg font-bold text-white">{state.title}</h2>}
						<p className="text-sm text-auxiliary2-ex-light">{state.message}</p>
						<div className="mt-l flex justify-end gap-s">
							<button
								type="button"
								onClick={() => responder(false)}
								className="rounded-s border border-dark-light px-m py-xs text-sm font-bold text-auxiliary2-light hover:text-white transition-colors">
								{state.cancelLabel ?? "Cancelar"}
							</button>
							<button
								type="button"
								autoFocus
								onClick={() => responder(true)}
								className="rounded-s bg-gradient-to-r from-primary to-primary-light px-m py-xs text-sm font-bold text-white shadow-lg shadow-primary/20 transition-all active:scale-95">
								{state.confirmLabel ?? "Confirmar"}
							</button>
						</div>
					</div>
				</div>
			)}
		</ConfirmContext.Provider>
	);
}

export function useConfirm(): ConfirmFn {
	const context = useContext(ConfirmContext);
	if (!context) throw new Error("useConfirm deve ser usado dentro de ConfirmProvider");
	return context;
}

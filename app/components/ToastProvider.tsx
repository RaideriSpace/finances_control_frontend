"use client";

import { createContext, useContext, useState } from "react";
import { IoCheckmarkCircle, IoClose, IoInformationCircle } from "react-icons/io5";

type ToastType = "success" | "error" | "info";
interface Toast {
	id: number;
	message: string;
	type: ToastType;
}
interface ToastContextValue {
	showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
	const [toasts, setToasts] = useState<Toast[]>([]);

	const showToast = (message: string, type: ToastType = "info") => {
		const id = Date.now() + Math.random();
		setToasts((current) => [...current, { id, message, type }]);
		window.setTimeout(() => setToasts((current) => current.filter((toast) => toast.id !== id)), 4000);
	};

	return (
		<ToastContext.Provider value={{ showToast }}>
			{children}
			<div className="fixed right-s top-s z-[2000] flex w-[min(360px,calc(100vw-2rem))] flex-col gap-xs" aria-live="polite">
				{toasts.map((toast) => (
					<div key={toast.id} className="flex items-center gap-s rounded-s border border-dark-light bg-dark px-s py-s text-sm text-white shadow-xl">
						{toast.type === "success" ?
							<IoCheckmarkCircle className="h-5 w-5 text-positive" />
						: toast.type === "error" ?
							<IoClose className="h-5 w-5 text-negative" />
						:	<IoInformationCircle className="h-5 w-5 text-primary-ex-light" />}
						<span className="flex-1">{toast.message}</span>
						<button
							type="button"
							onClick={() => setToasts((current) => current.filter((item) => item.id !== toast.id))}
							aria-label="Fechar notificação"
							className="text-auxiliary2-light hover:text-white">
							<IoClose className="h-4 w-4" />
						</button>
					</div>
				))}
			</div>
		</ToastContext.Provider>
	);
}

export function useToast() {
	const context = useContext(ToastContext);
	if (!context) throw new Error("useToast deve ser usado dentro de ToastProvider");
	return context;
}

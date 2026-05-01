import { AddTransacaoButton } from "./transacoes/components/AddTransacaoButton";
import { ListaTransacoes } from "./transacoes/components/ListaTransacoes";

// TransacoesPage.tsx
export default async function TransacoesPage() {
	const res = await fetch("https://finances-control-backend.onrender.com/transacoes", { cache: "no-store" });
	const initialData = await res.json();

	return (
		<main className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-8">
			<div className="max-w-5xl mx-auto">
				<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
					<div>
						<h1 className="text-3xl sm:text-4xl font-black text-slate-100 tracking-tight">
							Minhas <span className="text-indigo-400">Finanças</span>
						</h1>
						<p className="text-slate-400 mt-1 text-sm font-medium">Gerencie suas despesas e receitas</p>
					</div>
					<AddTransacaoButton />
				</div>

				{/* Agora a ListaTransacoes cuida de tudo: filtros e resumos */}
				<ListaTransacoes initialData={initialData} />
			</div>
		</main>
	);
}

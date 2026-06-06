import { Header } from "./transacoes/components/Header";
import { ListaTransacoes } from "./transacoes/components/ListaTransacoes";
import { Footer } from "./transacoes/components/Footer";

export default async function TransacoesPage() {
	const res = await fetch("https://finances-control-backend.onrender.com/transacoes", { cache: "no-store" });
	const initialData = await res.json();

	return (
		<>
			<Header />
			<main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 text-slate-900 p-4 sm:p-8">
				<div className="max-w-7xl mx-auto">
					<ListaTransacoes initialData={initialData} />
				</div>
			</main>
			<Footer />
		</>
	);
}

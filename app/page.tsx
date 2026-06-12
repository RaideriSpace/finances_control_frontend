import { Header } from "./transacoes/components/Header";
import { ListaTransacoes } from "./transacoes/components/ListaTransacoes";
import { Footer } from "./transacoes/components/Footer";
import { SkipLink } from "./components/SkipLink";

export const dynamic = "force-dynamic";

export default async function TransacoesPage() {
	const res = await fetch("https://finances-control-backend.onrender.com/transacoes", { cache: "no-store" });
	const initialData = await res.json();

	return (
		<>
			<SkipLink />
			<Header data={initialData} />

			{/* Substituímos o fundo claro (slate) pelo fundo super escuro da sua paleta.
        O bg-gradient-to-b from-dark-ex-dark to-dark cria um efeito sutil de iluminação
        que valoriza os cartões mais claros que ficam por cima dele.
      */}
			<main id="main-content" className="min-h-screen bg-gradient-to-b from-dark-ex-dark to-dark text-white pt-l pb-xxxl px-s sm:px-l">
				<div className="max-w-7xl mx-auto">
					<ListaTransacoes initialData={initialData} />
				</div>
			</main>

			<Footer />
		</>
	);
}

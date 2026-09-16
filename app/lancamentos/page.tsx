import { Header } from "../features/transacoes/Header";
import { ListaTransacoes } from "../features/transacoes/ListaTransacoes";
import { Footer } from "../features/transacoes/Footer";
import { SkipLink } from "../components/SkipLink";
import { TransacoesService } from "../lib/api/transacoes.service";

export const dynamic = "force-dynamic";

export default async function LancamentosPage() {
	const transacoes = await TransacoesService.listarTodas();

	return (
		<>
			<SkipLink />
			<Header data={transacoes} />
			<main id="main-content" className="min-h-screen bg-gradient-to-b from-dark-ex-dark to-dark px-s pb-xxxl pt-l text-white sm:px-l">
				<div className="mx-auto max-w-7xl">
					<ListaTransacoes initialData={transacoes} />
				</div>
			</main>
			<Footer />
		</>
	);
}

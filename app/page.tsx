import { Header } from "./features/transacoes/Header";
import { Footer } from "./features/transacoes/Footer";
import { SkipLink } from "./components/SkipLink";
import { DashboardView } from "./features/dashboard/DashboardView";
import { DashboardService } from "./lib/api/dashboard.service";
import { TransacoesService } from "./lib/api/transacoes.service";

export const dynamic = "force-dynamic";

export default async function TransacoesPage() {
	const [resumo, transacoes] = await Promise.all([DashboardService.obterResumoMensal(), TransacoesService.listarTodas()]);

	return (
		<>
			<SkipLink />
			<Header data={transacoes} />
			<DashboardView resumo={resumo} transacoes={transacoes} />
			<Footer />
		</>
	);
}

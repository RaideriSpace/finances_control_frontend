"use client";

import Image from "next/image";
import Link from "next/link";

/**
 * @component Footer
 * @description Rodapé moderno, seguindo a paleta escura RaideriSpace
 */
export function Footer() {
	const currentYear = new Date().getFullYear();

	return (
		<footer className="bg-dark-dark border-t border-dark-light py-xl mt-l" role="contentinfo">
			<div className="max-w-7xl mx-auto px-s sm:px-l">
				<div className="flex flex-col md:flex-row items-center justify-between gap-m">
					{/* Logo e Branding */}
					<div className="flex flex-col items-center md:items-start gap-xs">
						<Link
							href="/"
							className="inline-flex items-center justify-center p-xs hover:bg-white/5 rounded-s transition-all"
							aria-label="RailLink - Gerenciador Financeiro">
							<Image
								src="/assets/logo.png"
								alt="Logo RailLink"
								width={48}
								height={48}
								className="h-12 w-auto opacity-80 hover:opacity-100 transition-opacity"
							/>
						</Link>
						<p className="text-xs text-auxiliary2-ex-light font-bold tracking-widest uppercase">RailLink</p>
					</div>

					{/* Links Úteis */}
					<nav className="flex flex-col md:flex-row items-center gap-m md:gap-l" aria-label="Links do rodapé">
						{["Privacidade", "Termos de Uso", "Contato"].map((link) => (
							<Link
								key={link}
								href={`/${link.toLowerCase().replace(" ", "-")}`}
								className="text-sm text-auxiliary2-light hover:text-primary-ex-light transition-colors font-medium">
								{link}
							</Link>
						))}
					</nav>

					{/* Copyright */}
					<div className="text-center md:text-right">
						<p className="text-xs text-auxiliary2-light">
							<span className="font-bold text-white">RaideriSpace</span> © {currentYear}
						</p>
						<p className="text-xs text-auxiliary2-light/60 mt-xs">Todos os direitos reservados</p>
					</div>
				</div>

				{/* Divider sutil */}
				<div className="border-t border-dark-light mt-m pt-m text-center">
					<p className="text-xs text-auxiliary1-light">
						Desenvolvido com{" "}
						<span className="text-negative" aria-label="amor">
							❤️
						</span>{" "}
						para organizar suas finanças
					</p>
				</div>
			</div>
		</footer>
	);
}

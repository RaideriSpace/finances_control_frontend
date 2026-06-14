"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AcoesRapidas } from "./AcoesRapidas";
import { ModalResumoAnual } from "./modals/ModalResumoAnual";
import { IoMenu, IoClose, IoTrendingUp, IoTrendingDown } from "react-icons/io5";
import { Transacao } from "../../src/types/transacao.type";
import { ModalGastosFixos } from "./modals/Modalgastosfixos";
import { ModalSaldoFixo } from "./modals/ModalSaldoFixos";

interface HeaderProps {
	data: Transacao[];
}

export function Header({ data }: HeaderProps) {
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const [resumoAnualOpen, setResumoAnualOpen] = useState(false);
	const [gastosFixosOpen, setGastosFixosOpen] = useState(false);
	const [saldoFixosOpen, setSaldoFixosOpen] = useState(false);

	const handleMenuToggle = () => setMobileMenuOpen(!mobileMenuOpen);
	const handleMenuClose = () => setMobileMenuOpen(false);

	return (
		<header className="bg-primary-ex-dark sticky top-0 z-[100] h-[80px] flex items-center border-b border-primary-dark shadow-lg" role="banner">
			<div className="max-w-7xl mx-auto px-s sm:px-m w-full flex items-center justify-between relative">
				{/* ================= DESKTOP LAYOUT ================= */}
				<div className="hidden md:flex items-center justify-between w-full">
					<nav className="flex items-center gap-m" aria-label="Navegação principal">
						<button
							onClick={() => setResumoAnualOpen(true)}
							className="text-sm font-semibold text-primary-ex-light hover:text-white transition-colors duration-200 tracking-wide uppercase">
							Resumo do Ano
						</button>
						<button
							onClick={() => setGastosFixosOpen(true)}
							className="
                relative flex items-center justify-center gap-xs
                p-xs rounded-s
                font-bold text-sm
                border border-primary-light/30 hover:border-primary-light/70
                text-primary-ex-light hover:text-white
                transition-all duration-200 active:scale-95
                overflow-hidden group
              ">
							{/* Brilho sutil no hover */}
							<span className="absolute inset-0 bg-primary-dark/0 group-hover:bg-primary-dark/40 transition-colors duration-200" />

							<span className="relative flex items-center justify-center w-5 h-5 rounded-full bg-primary-dark/60 border border-primary/30 flex-shrink-0">
								<IoTrendingDown className="w-3 h-3 text-negative" />
							</span>
							<span className="relative hidden sm:inline">Gastos Fixos</span>
						</button>
						<button
							onClick={() => setSaldoFixosOpen(true)}
							className="
                relative flex items-center justify-center gap-xs
                p-xs rounded-s
                font-bold text-sm
                border border-primary-light/30 hover:border-primary-light/70
                text-primary-ex-light hover:text-white
                transition-all duration-200 active:scale-95
                overflow-hidden group
              ">
							{/* Brilho sutil no hover */}
							<span className="absolute inset-0 bg-primary-dark/0 group-hover:bg-primary-dark/40 transition-colors duration-200" />

							<span className="relative flex items-center justify-center w-5 h-5 rounded-full bg-primary-dark/60 border border-primary/30 flex-shrink-0">
								<IoTrendingUp className="w-3 h-3 text-positive" />
							</span>
							<span className="relative hidden sm:inline">Saldos</span>
						</button>
					</nav>

					<div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
						<Link
							href="/"
							className="pointer-events-auto inline-flex items-center justify-center focus:outline-none p-xs transition-transform drop-shadow-lg hover:scale-105"
							aria-label="RailLink - Gerenciador Financeiro">
							<Image src="/assets/logo.png" alt="Logo RailLink" width={100} height={100} priority className="object-contain" />
						</Link>
					</div>

					<div className="flex items-center gap-s">
						<AcoesRapidas data={data} />
					</div>
				</div>

				{/* ================= MOBILE LAYOUT ================= */}
				<div className="md:hidden flex items-center justify-between w-full">
					<div className="flex-shrink-0">
						<Link href="/" className="inline-flex items-center justify-center">
							<Image src="/assets/logo.png" alt="Logo RailLink" width={48} height={48} priority className="h-12 w-auto" />
						</Link>
					</div>

					<button
						onClick={handleMenuToggle}
						className="text-primary-ex-light p-xs rounded-s hover:bg-primary-dark transition-colors"
						aria-label={mobileMenuOpen ? "Fechar menu" : "Abrir menu"}>
						{mobileMenuOpen ?
							<IoClose className="w-8 h-8" />
						:	<IoMenu className="w-8 h-8" />}
					</button>
				</div>

				{/* ================= MOBILE MENU ================= */}
				{mobileMenuOpen && (
					<div className="md:hidden absolute top-[80px] left-0 right-0 bg-primary-ex-dark border-b border-primary-dark p-m shadow-xl">
						<nav className="flex flex-col gap-s">
							<button
								onClick={() => {
									setResumoAnualOpen(true);
									handleMenuClose();
								}}
								className="text-left text-sm font-semibold text-primary-ex-light hover:text-white py-xs transition-colors border-b border-primary-dark">
								Resumo do Ano
							</button>
							<button
								onClick={() => setGastosFixosOpen(true)}
								className="text-sm font-semibold text-primary-ex-light hover:text-white transition-colors duration-200 tracking-wide uppercase">
								Gastos Fixos
							</button>
							<div className="pt-xs">
								<div className="flex items-center gap-s">
									<AcoesRapidas data={data} />
								</div>
							</div>
						</nav>
					</div>
				)}
			</div>

			<ModalResumoAnual isOpen={resumoAnualOpen} onClose={() => setResumoAnualOpen(false)} data={data} />
			<ModalGastosFixos isOpen={gastosFixosOpen} onClose={() => setGastosFixosOpen(false)} />
			<ModalSaldoFixo isOpen={saldoFixosOpen} onClose={() => setSaldoFixosOpen(false)} />
		</header>
	);
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { IoHeart } from "react-icons/io5";

export function Footer() {
	const currentYear = new Date().getFullYear();

	return (
		<footer className="border-t border-dark-light mt-l" style={{ backgroundColor: "rgba(2,1,4,0.95)" }} role="contentinfo">
			<div className="max-w-7xl mx-auto px-s sm:px-l py-l">
				<div className="flex flex-col sm:flex-row items-center justify-between gap-m">
					{/* Logo + nome */}
					<Link href="/" className="flex items-center gap-s group" aria-label="RailLink">
						<Image
							src="/assets/logo.png"
							alt="Logo RailLink"
							width={32}
							height={32}
							className="h-8 w-auto opacity-70 group-hover:opacity-100 transition-opacity"
						/>
						<span className="text-sm font-bold tracking-widest uppercase text-auxiliary2-light group-hover:text-white transition-colors">
							RailLink
						</span>
					</Link>

					{/* Crédito central */}
					<p className="flex items-center gap-xs text-xs text-auxiliary2-light/60 order-last sm:order-none">
						Feito com <IoHeart className="w-3 h-3 text-secondary" /> por <span className="font-bold text-auxiliary2-light">RaideriSpace</span>
					</p>

					{/* Copyright */}
					<p className="text-xs text-auxiliary2-light/40 tabular-nums">© {currentYear}</p>
				</div>
			</div>
		</footer>
	);
}

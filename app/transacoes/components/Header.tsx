"use client";

import { useState } from "react";
import { AcoesRapidas } from "./AcoesRapidas";
import { IoMenu, IoClose } from "react-icons/io5";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-gradient-to-b from-slate-100 to-slate-50 border-b border-slate-200 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-4">
        {/* Desktop Layout */}
        <div className="hidden md:flex items-center justify-between">
          {/* Navegação à esquerda */}
          <nav className="flex items-center gap-8">
            <a href="#" className="text-sm font-semibold text-slate-700 hover:text-slate-900 transition-colors">
              Resumo do Ano
            </a>
            <a href="#" className="text-sm font-semibold text-slate-700 hover:text-slate-900 transition-colors">
              Gastos Fixos
            </a>
          </nav>

          {/* Logo centralizada */}
          <div className="flex-shrink-0">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-slate-400 to-slate-500 flex items-center justify-center shadow-md">
              <span className="text-2xl font-bold text-white font-space-grotesk">FC</span>
            </div>
          </div>

          {/* Botões à direita */}
          <div className="flex items-center gap-4">
            <AcoesRapidas />
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="md:hidden flex items-center justify-between">
          {/* Logo à esquerda */}
          <div className="flex-shrink-0">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-slate-400 to-slate-500 flex items-center justify-center shadow-md">
              <span className="text-lg font-bold text-white font-space-grotesk">FC</span>
            </div>
          </div>

          {/* Menu hamburger à direita */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-slate-700 hover:text-slate-900 transition-colors"
          >
            {mobileMenuOpen ? (
              <IoClose className="w-6 h-6" />
            ) : (
              <IoMenu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-slate-200 pt-4">
            <nav className="flex flex-col gap-3 mb-4">
              <a href="#" className="text-sm font-semibold text-slate-700 hover:text-slate-900 transition-colors py-2">
                Resumo do Ano
              </a>
              <a href="#" className="text-sm font-semibold text-slate-700 hover:text-slate-900 transition-colors py-2">
                Gastos Fixos
              </a>
            </nav>
            <div className="flex gap-2">
              <AcoesRapidas />
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

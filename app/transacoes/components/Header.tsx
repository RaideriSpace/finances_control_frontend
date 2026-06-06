'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { AcoesRapidas } from './AcoesRapidas';
import { IoMenu, IoClose } from 'react-icons/io5';

/**
 * @component Header
 * @description Componente de header principal com navegação e logo
 * Implementa design responsivo e acessibilidade
 */
export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleMenuClose = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header 
      className="bg-gradient-to-b from-slate-100 to-slate-50 border-b border-slate-200 sticky top-0 z-40 shadow-sm"
      role="banner"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-4">
        {/* Desktop Layout */}
        <div className="hidden md:flex items-center justify-between">
          {/* Navegação à esquerda */}
          <nav className="flex items-center gap-8" aria-label="Navegação principal">
            <Link 
              href="/resumo-anual" 
              className="text-sm font-semibold text-slate-700 hover:text-primary-3 transition-colors duration-200"
              aria-label="Ir para Resumo do Ano"
            >
              Resumo do Ano
            </Link>
            <Link 
              href="/gastos-fixos" 
              className="text-sm font-semibold text-slate-700 hover:text-primary-3 transition-colors duration-200"
              aria-label="Ir para Gastos Fixos"
            >
              Gastos Fixos
            </Link>
          </nav>

          {/* Logo centralizada */}
          <div className="flex-shrink-0">
            <Link 
              href="/" 
              className="inline-flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-primary-3 rounded-lg"
              aria-label="RailLink - Gerenciador Financeiro"
            >
              <Image
                src="/assets/logo.png"
                alt="Logo RailLink"
                width={60}
                height={60}
                priority
                className="h-16 w-auto"
              />
            </Link>
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
            <Link 
              href="/" 
              className="inline-flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-primary-3 rounded-lg"
              aria-label="RailLink - Gerenciador Financeiro"
            >
              <Image
                src="/assets/logo.png"
                alt="Logo RailLink"
                width={48}
                height={48}
                priority
                className="h-12 w-auto"
              />
            </Link>
          </div>

          {/* Menu hamburger à direita */}
          <button
            onClick={handleMenuToggle}
            className="text-slate-700 hover:text-slate-900 transition-colors duration-200 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-3"
            aria-label={mobileMenuOpen ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
          >
            {mobileMenuOpen ? (
              <IoClose className="w-6 h-6" aria-hidden="true" />
            ) : (
              <IoMenu className="w-6 h-6" aria-hidden="true" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div 
            id="mobile-menu"
            className="md:hidden mt-4 pb-4 border-t border-slate-200 pt-4 animate-slide-in-up"
          >
            <nav className="flex flex-col gap-3 mb-4" aria-label="Navegação mobile">
              <Link 
                href="/resumo-anual" 
                className="text-sm font-semibold text-slate-700 hover:text-primary-3 transition-colors duration-200 py-2 px-3 rounded-lg hover:bg-slate-100"
                onClick={handleMenuClose}
              >
                Resumo do Ano
              </Link>
              <Link 
                href="/gastos-fixos" 
                className="text-sm font-semibold text-slate-700 hover:text-primary-3 transition-colors duration-200 py-2 px-3 rounded-lg hover:bg-slate-100"
                onClick={handleMenuClose}
              >
                Gastos Fixos
              </Link>
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

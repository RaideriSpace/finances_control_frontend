'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { AcoesRapidas } from './AcoesRapidas';
import { ModalResumoAnual } from './ModalResumoAnual';
import { IoMenu, IoClose } from 'react-icons/io5';
import { Transacao } from '../../src/types/transacao.type';

interface HeaderProps {
  data: Transacao[];
}

/**
 * @component Header
 * @description Componente de header principal com navegação e logo maior vazando
 */
export function Header({ data }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [resumoAnualOpen, setResumoAnualOpen] = useState(false);

  const handleMenuToggle = () => setMobileMenuOpen(!mobileMenuOpen);
  const handleMenuClose = () => setMobileMenuOpen(false);

  return (
    <header 
      className="bg-white border-b border-slate-200 sticky top-0 z-[100] shadow-sm h-[80px] flex items-center"
      role="banner"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8 w-full flex items-center justify-between relative">
        {/* Desktop Layout */}
        <div className="hidden md:flex items-center justify-between w-full">
          {/* Navegação à esquerda */}
          <nav className="flex items-center gap-8" aria-label="Navegação principal">
            <button 
              onClick={() => setResumoAnualOpen(true)}
              className="text-sm font-semibold text-slate-700 hover:text-primary transition-colors duration-200"
            >
              Resumo do Ano
            </button>
            <Link 
              href="/gastos-fixos" 
              className="text-sm font-semibold text-slate-700 hover:text-primary transition-colors duration-200"
            >
              Gastos Fixos
            </Link>
          </nav>

          {/* Logo centralizada e MAIOR (vazando) */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/3">
            <Link 
              href="/" 
              className="inline-flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-primary rounded-full bg-white p-2 shadow-lg border border-slate-100 transition-transform hover:scale-110"
              aria-label="RailLink - Gerenciador Financeiro"
            >
              <Image
                src="/assets/logo.png"
                alt="Logo RailLink"
                width={100}
                height={100}
                priority
                className="h-24 w-auto object-contain"
              />
            </Link>
          </div>

          {/* Botões à direita */}
          <div className="flex items-center gap-4">
            <AcoesRapidas />
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="md:hidden flex items-center justify-between w-full">
          <div className="flex-shrink-0">
            <Link href="/" className="inline-flex items-center justify-center">
              <Image src="/assets/logo.png" alt="Logo RailLink" width={60} height={60} priority className="h-14 w-auto" />
            </Link>
          </div>

          <button
            onClick={handleMenuToggle}
            className="text-slate-700 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            aria-label={mobileMenuOpen ? 'Fechar menu' : 'Abrir menu'}
          >
            {mobileMenuOpen ? <IoClose className="w-6 h-6" /> : <IoMenu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-[80px] left-0 right-0 bg-white border-b border-slate-200 p-4 shadow-xl animate-slide-in-up">
            <nav className="flex flex-col gap-4">
              <button 
                onClick={() => { setResumoAnualOpen(true); handleMenuClose(); }}
                className="text-left text-sm font-semibold text-slate-700 py-2"
              >
                Resumo do Ano
              </button>
              <Link href="/gastos-fixos" className="text-sm font-semibold text-slate-700 py-2" onClick={handleMenuClose}>
                Gastos Fixos
              </Link>
              <AcoesRapidas />
            </nav>
          </div>
        )}
      </div>

      {/* Modal Resumo Anual */}
      <ModalResumoAnual 
        isOpen={resumoAnualOpen} 
        onClose={() => setResumoAnualOpen(false)} 
        data={data} 
      />
    </header>
  );
}

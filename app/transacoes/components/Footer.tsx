'use client';

import Image from 'next/image';
import Link from 'next/link';

/**
 * @component Footer
 * @description Componente de rodapé com logo e informações de copyright
 * Implementa design responsivo e acessibilidade
 */
export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer 
      className="bg-gradient-to-t from-slate-100 to-slate-50 border-t border-slate-200 mt-16 py-8"
      role="contentinfo"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo e Branding */}
          <div className="flex flex-col items-center md:items-start gap-2">
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
                className="h-12 w-auto"
              />
            </Link>
            <p className="text-xs text-slate-600 font-medium">RailLink</p>
          </div>

          {/* Links Úteis */}
          <nav 
            className="flex flex-col md:flex-row items-center gap-6 md:gap-8"
            aria-label="Links do rodapé"
          >
            <Link 
              href="/privacidade" 
              className="text-sm text-slate-600 hover:text-primary-3 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-3 rounded px-2 py-1"
            >
              Privacidade
            </Link>
            <Link 
              href="/termos" 
              className="text-sm text-slate-600 hover:text-primary-3 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-3 rounded px-2 py-1"
            >
              Termos de Uso
            </Link>
            <Link 
              href="/contato" 
              className="text-sm text-slate-600 hover:text-primary-3 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-3 rounded px-2 py-1"
            >
              Contato
            </Link>
          </nav>

          {/* Copyright */}
          <div className="text-center md:text-right">
            <p className="text-xs text-slate-600">
              <span className="font-semibold">RaideriSpace</span> © Copyright - {currentYear}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Todos os direitos reservados
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-200 mt-6 pt-6">
          <p className="text-center text-xs text-slate-500">
            Desenvolvido com <span aria-label="amor">❤️</span> para gerenciar suas finanças
          </p>
        </div>
      </div>
    </footer>
  );
}

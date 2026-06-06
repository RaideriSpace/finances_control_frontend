/**
 * @file formatting.ts
 * @description Utilitários para formatação de valores e dados
 * Fornece funções reutilizáveis para formatação consistente
 */

import { COLORS } from '../constants/colors';

/**
 * Formata um valor numérico como moeda brasileira
 */
export function formatarMoeda(valor: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(valor);
}

/**
 * Formata uma data para o padrão brasileiro
 */
export function formatarData(data: string | Date): string {
  const date = typeof data === 'string' ? new Date(data) : data;
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
}

/**
 * Obtém a cor baseada no valor (positivo/negativo)
 */
export function obterCorValor(valor: number): string {
  if (valor > 0) return COLORS.states.positive;
  if (valor < 0) return COLORS.states.negative;
  return COLORS.states.neutral;
}

/**
 * Obtém a classe Tailwind para cor de valor
 */
export function obterClasseCorValor(valor: number): string {
  if (valor > 0) return 'text-positive';
  if (valor < 0) return 'text-negative';
  return 'text-neutral';
}

/**
 * Obtém a classe Tailwind para cor de fundo de valor
 */
export function obterClasseFundoCorValor(valor: number): string {
  if (valor > 0) return 'bg-green-50';
  if (valor < 0) return 'bg-red-50';
  return 'bg-gray-50';
}

/**
 * Trunca um texto com reticências
 */
export function truncarTexto(texto: string, limite: number): string {
  if (texto.length <= limite) return texto;
  return `${texto.substring(0, limite)}...`;
}

/**
 * Capitaliza a primeira letra de uma string
 */
export function capitalizarPrimeira(texto: string): string {
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

/**
 * Converte um tipo de transação para label legível
 */
export function obterLabelTipo(tipo: 'debito' | 'credito'): string {
  return tipo === 'debito' ? 'Débito' : 'Crédito';
}

/**
 * Formata um número com separadores de milhar
 */
export function formatarNumero(numero: number, casasDecimais: number = 2): string {
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: casasDecimais,
    maximumFractionDigits: casasDecimais,
  }).format(numero);
}

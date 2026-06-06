/**
 * @file colors.ts
 * @description Paleta de cores do RailLink conforme Style Guide
 * Implementa variáveis de cores seguindo o design system
 */

export const COLORS = {
  // Cores Primárias
  primary: {
    1: '#120920',    // Primária -2
    2: '#281645',    // Primária -1
    3: '#3F2667',    // Primária
    4: '#583989',    // Primária +1
    5: '#BC73B5',    // Primária +2
  },

  // Cores Secundárias
  secondary: {
    1: '#610530',    // Secundária -2
    2: '#8D1360',    // Secundária -1
    3: '#E0F79',     // Secundária
    4: '#E1594',     // Secundária +1
    5: '#EBADCA',    // Secundária +2
  },

  // Cores Terciárias
  tertiary: {
    1: '#003E47',    // Terciária -2
    2: '#0097AD',    // Terciária -1
    3: '#00C5E2',    // Terciária
    4: '#ADD9',     // Terciária +1
    5: '#B4E7F5',    // Terciária +2
  },

  // Cores Auxiliares
  auxiliary: {
    1: '#081423',    // Auxiliar 1-2
    2: '#29436A',    // Auxiliar 1-1
    3: '#3D58BA',    // Auxiliar 1
    4: '#667080',    // Auxiliar 2
    5: '#22250D',    // Auxiliar 2 -1
    6: '#9535C',     // Auxiliar 2 -2
  },

  // Cores Dark
  dark: {
    1: '#000000',    // Dark
    2: '#020104',    // Dark -1
    3: '#353181',    // Dark -2
  },

  // Estados de Transação
  positive: '#10B981',   // Verde para valores positivos
  negative: '#EF4444',   // Vermelho para valores negativos
  neutral: '#6B7280',    // Cinza para valores neutros

  // Neutros
  white: '#FFFFFF',
  black: '#000000',
  gray: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },
} as const;

export type ColorKey = keyof typeof COLORS;
export type PrimaryColorVariant = keyof typeof COLORS.primary;
export type SecondaryColorVariant = keyof typeof COLORS.secondary;
export type TertiaryColorVariant = keyof typeof COLORS.tertiary;

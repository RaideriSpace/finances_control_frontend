/**
 * @file next-seo.config.ts
 * @description Configuração centralizada de SEO para o projeto
 * Implementa boas práticas de SEO e Open Graph
 */

export const SEO_CONFIG = {
  // Informações Básicas
  siteName: 'RailLink',
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://raillink.com',
  description: 'RailLink é um gerenciador financeiro inteligente que ajuda você a controlar despesas, receitas e saldos com facilidade.',
  locale: 'pt_BR',
  language: 'pt-BR',

  // Redes Sociais
  social: {
    twitter: '@RaideriSpace',
    facebook: 'RaideriSpace',
    linkedin: 'raiderispace',
    instagram: 'raiderispace',
  },

  // Autor
  author: {
    name: 'RaideriSpace',
    url: 'https://raiderispace.com',
    email: 'contato@raiderispace.com',
  },

  // Imagens
  images: {
    logo: '/assets/logo.png',
    ogImage: '/assets/og-image.png',
    favicon: '/assets/logo.png',
    appleTouchIcon: '/assets/logo.png',
  },

  // Palavras-chave
  keywords: [
    'gerenciador financeiro',
    'controle de despesas',
    'controle de receitas',
    'finanças pessoais',
    'orçamento',
    'transações',
    'saldos',
    'faturas',
    'app financeiro',
    'gestão financeira',
  ],

  // Estrutura de Dados (Schema.org)
  schema: {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'RailLink',
    description: 'Gerenciador Financeiro Inteligente',
    url: 'https://raillink.com',
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'BRL',
    },
  },

  // Configurações de Rastreamento
  tracking: {
    googleAnalytics: process.env.NEXT_PUBLIC_GA_ID,
    googleSearchConsole: process.env.NEXT_PUBLIC_GSC_ID,
  },

  // Configurações de Segurança
  security: {
    contentSecurityPolicy: {
      'default-src': ["'self'"],
      'script-src': ["'self'", "'unsafe-inline'", 'cdn.jsdelivr.net'],
      'style-src': ["'self'", "'unsafe-inline'"],
      'img-src': ["'self'", 'data:', 'https:'],
      'font-src': ["'self'", 'fonts.googleapis.com', 'fonts.gstatic.com'],
      'connect-src': ["'self'", 'api.supabase.co'],
    },
  },

  // Configurações de Performance
  performance: {
    enableImageOptimization: true,
    enableFontOptimization: true,
    enableScriptOptimization: true,
  },

  // Configurações de Acessibilidade
  accessibility: {
    wcagLevel: 'AA',
    enableSkipLinks: true,
    enableAriaLabels: true,
    enableKeyboardNavigation: true,
  },
} as const;

export type SEOConfig = typeof SEO_CONFIG;

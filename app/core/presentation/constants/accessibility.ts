/**
 * @file accessibility.ts
 * @description Constantes para acessibilidade (WCAG 2.1 AA)
 * Implementa padrões de acessibilidade web
 */

export const ACCESSIBILITY = {
  // Roles ARIA
  roles: {
    banner: 'banner',
    navigation: 'navigation',
    main: 'main',
    contentinfo: 'contentinfo',
    region: 'region',
    article: 'article',
    complementary: 'complementary',
    form: 'form',
    search: 'search',
    button: 'button',
    link: 'link',
  },

  // Labels ARIA
  labels: {
    menuButton: 'Abrir menu de navegação',
    closeMenu: 'Fechar menu',
    searchButton: 'Buscar transações',
    filterButton: 'Abrir filtros',
    editButton: 'Editar transação',
    deleteButton: 'Deletar transação',
    addButton: 'Adicionar nova transação',
    previousPage: 'Página anterior',
    nextPage: 'Próxima página',
    goToHome: 'Ir para página inicial',
  },

  // Descrições ARIA
  descriptions: {
    loadingData: 'Carregando dados...',
    errorOccurred: 'Ocorreu um erro ao carregar os dados',
    noResults: 'Nenhum resultado encontrado',
    sortBy: 'Ordenar por',
    filterBy: 'Filtrar por',
  },

  // Atributos de Acessibilidade
  attributes: {
    ariaLive: 'polite',
    ariaAtomic: true,
    ariaRelevant: 'additions text',
    tabIndex: 0,
    focusOutline: '2px solid',
    focusOutlineOffset: '2px',
  },

  // Cores de Contraste (WCAG AA)
  contrast: {
    minRatio: 4.5, // Para texto pequeno
    largeTextRatio: 3, // Para texto grande (18pt+)
  },

  // Tamanhos de Fonte Mínimos
  fontSize: {
    minimum: 12, // pixels
    recommended: 14, // pixels
    large: 18, // pixels
  },

  // Espaçamento para Targets (Clicáveis)
  targetSize: {
    minimum: 44, // pixels (WCAG 2.1 Level AAA)
    recommended: 48, // pixels
  },

  // Duração de Animações
  animation: {
    preferReducedMotion: true,
    duration: 300, // milliseconds
    maxDuration: 1000, // milliseconds
  },

  // Mensagens de Erro
  errorMessages: {
    required: 'Este campo é obrigatório',
    invalidEmail: 'Por favor, insira um email válido',
    invalidPhone: 'Por favor, insira um telefone válido',
    invalidDate: 'Por favor, insira uma data válida',
    minLength: (min: number) => `Mínimo de ${min} caracteres`,
    maxLength: (max: number) => `Máximo de ${max} caracteres`,
  },

  // Navegação por Teclado
  keyboard: {
    tabOrder: 'logical',
    skipLinks: true,
    focusTrap: true,
    escapeToClose: true,
  },
} as const;

export type AccessibilityRole = keyof typeof ACCESSIBILITY.roles;
export type AccessibilityLabel = keyof typeof ACCESSIBILITY.labels;

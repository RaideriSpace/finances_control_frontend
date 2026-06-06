# Guia de Acessibilidade - RailLink

## Conformidade WCAG 2.1 Nível AA

Este documento descreve as práticas de acessibilidade implementadas no RailLink, seguindo as diretrizes WCAG 2.1 nível AA.

## 1. Estrutura Semântica

### HTML Semântico
- Uso de tags semânticas: `<header>`, `<nav>`, `<main>`, `<article>`, `<section>`, `<footer>`
- Hierarquia correta de headings (H1 → H6)
- Uso de `<button>` para ações, `<a>` para navegação
- Listas semânticas com `<ul>`, `<ol>`, `<li>`

### Exemplo:
```tsx
<header role="banner">
  <nav aria-label="Navegação principal">
    <a href="/home">Home</a>
  </nav>
</header>
<main id="main-content">
  <article role="region" aria-label="Descrição">
    {/* Conteúdo */}
  </article>
</main>
<footer role="contentinfo">
  {/* Footer */}
</footer>
```

## 2. Atributos ARIA

### Roles
- `banner`: Header principal
- `navigation`: Navegação
- `main`: Conteúdo principal
- `contentinfo`: Footer
- `region`: Seções de conteúdo
- `article`: Artigos
- `button`: Botões
- `link`: Links

### Labels e Descrições
```tsx
<button aria-label="Abrir menu">
  <IoMenu />
</button>

<div role="region" aria-label="Saldos por conta">
  {/* Conteúdo */}
</div>

<input aria-describedby="error-message" />
<span id="error-message">Este campo é obrigatório</span>
```

### Live Regions
```tsx
<div aria-live="polite" aria-atomic="true">
  {/* Mensagens que mudam dinamicamente */}
</div>
```

## 3. Navegação por Teclado

### Tab Order
- Ordem lógica de tabulação
- Elementos focáveis têm indicador visual claro
- Focus trap em modais

### Atalhos de Teclado
- `Tab`: Navegar para próximo elemento
- `Shift + Tab`: Navegar para elemento anterior
- `Enter`: Ativar botão ou link
- `Escape`: Fechar modal/menu
- `Space`: Ativar checkbox/radio

### Skip Links
```tsx
<a href="#main-content" className="sr-only focus:not-sr-only">
  Pular para conteúdo principal
</a>
```

## 4. Contraste de Cores

### Requisitos WCAG AA
- Texto normal: razão de contraste mínima de 4.5:1
- Texto grande (18pt+): razão de contraste mínima de 3:1
- Componentes gráficos: razão de contraste mínima de 3:1

### Implementação
```css
/* Cores com contraste suficiente */
--color-positive: #10B981;  /* Verde */
--color-negative: #EF4444;  /* Vermelho */
--color-neutral: #6B7280;   /* Cinza */
```

## 5. Tamanho de Fonte e Espaçamento

### Tamanhos Mínimos
- Texto corpo: 14px (recomendado)
- Texto pequeno: 12px (mínimo)
- Heading: 18px+

### Espaçamento
- Targets clicáveis: 44px × 44px (WCAG AAA)
- Padding em botões: 12px mínimo
- Line-height: 1.5 mínimo

## 6. Imagens e Ícones

### Alt Text
```tsx
<Image
  src="/logo.png"
  alt="Logo RailLink - Gerenciador Financeiro"
  width={48}
  height={48}
/>

<IoMenu aria-hidden="true" />
```

### Ícones Decorativos
```tsx
<span aria-hidden="true">❤️</span>
```

## 7. Formulários

### Labels
```tsx
<label htmlFor="email">Email</label>
<input id="email" type="email" required />
```

### Validação
```tsx
<input
  aria-invalid={hasError}
  aria-describedby={hasError ? "error-message" : undefined}
/>
{hasError && <span id="error-message">Erro: {errorMessage}</span>}
```

## 8. Animações

### Respeitar Preferência de Movimento Reduzido
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

## 9. Responsividade

### Viewport
```html
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
```

### Testes de Responsividade
- Mobile: 320px - 480px
- Tablet: 481px - 768px
- Desktop: 769px+

## 10. Testes de Acessibilidade

### Ferramentas Recomendadas
- **axe DevTools**: Verificação automática de acessibilidade
- **WAVE**: Avaliação de acessibilidade web
- **Lighthouse**: Auditoria de performance e acessibilidade
- **Screen Readers**: NVDA, JAWS, VoiceOver

### Testes Manuais
1. Navegação apenas com teclado
2. Teste com leitor de tela
3. Verificação de contraste
4. Teste de zoom até 200%
5. Teste em diferentes navegadores

## 11. Checklist de Acessibilidade

- [ ] Todos os headings têm hierarquia correta
- [ ] Todos os botões têm labels descritivos
- [ ] Todos os links têm texto descritivo
- [ ] Todas as imagens têm alt text
- [ ] Contraste de cores atende WCAG AA
- [ ] Navegação por teclado funciona
- [ ] Formulários têm labels associados
- [ ] Mensagens de erro são claras
- [ ] Animações respeitam preferência de movimento reduzido
- [ ] Site é responsivo até 200% de zoom

## 12. Recursos Adicionais

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [WebAIM](https://webaim.org/)

## 13. Contato

Para reportar problemas de acessibilidade, entre em contato:
- Email: acessibilidade@raiderispace.com
- GitHub Issues: [RailLink Issues](https://github.com/RaideriSpace/finances_control_frontend/issues)

---

**Última atualização:** 06/06/2026
**Versão:** 1.0
**Status:** Ativo

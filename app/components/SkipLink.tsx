/**
 * @component SkipLink
 * @description Link de pulo para acessibilidade
 * Permite que usuários de leitores de tela pulem para o conteúdo principal
 */
export function SkipLink() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:top-0 focus:left-0 focus:z-50 focus:p-4 focus:bg-primary focus:text-white focus:rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
    >
      Pular para conteúdo principal
    </a>
  );
}

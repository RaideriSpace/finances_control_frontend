import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";

// Componentes client sob teste usam `useRouter()` do App Router, que exige um
// contexto de navegação em runtime — inexistente ao renderizar fora do Next.
vi.mock("next/navigation", () => ({
	useRouter: () => ({ refresh: vi.fn(), push: vi.fn(), replace: vi.fn(), back: vi.fn(), forward: vi.fn() }),
	usePathname: () => "/",
	useSearchParams: () => new URLSearchParams(),
}));

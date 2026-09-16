// A Vercel já tem NEXT_PUBLIC_API_URL configurada apontando para o backend em
// produção (Render) — o fallback é só para dev local, sem precisar de um
// .env.local próprio.
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export class ApiError extends Error {
	constructor(
		message: string,
		public readonly status: number,
	) {
		super(message);
		this.name = "ApiError";
	}
}

export function apiUrl(resource: string): string {
	return `${API_BASE_URL}/${resource}`;
}

async function parseErrorMessage(response: Response): Promise<string> {
	const texto = await response.text();
	try {
		const corpo = JSON.parse(texto) as { message?: string | string[] };
		if (Array.isArray(corpo.message)) return corpo.message.join(", ");
		if (typeof corpo.message === "string") return corpo.message;
	} catch {
		// corpo não é JSON — usa o texto bruto como mensagem
	}
	return texto || `Erro ${response.status}`;
}

async function request<T>(resource: string, init?: RequestInit): Promise<T> {
	const response = await fetch(apiUrl(resource), init);
	if (!response.ok) {
		throw new ApiError(await parseErrorMessage(response), response.status);
	}
	if (response.status === 204) return undefined as T;
	return (await response.json()) as T;
}

function withJsonBody(body: unknown, init?: RequestInit): RequestInit {
	return {
		...init,
		headers: { "Content-Type": "application/json", ...init?.headers },
		body: body !== undefined ? JSON.stringify(body) : undefined,
	};
}

/**
 * Cliente HTTP único usado por todos os serviços de `app/lib/api` — substitui
 * o `if (!res.ok) throw new Error(...)` repetido (e com mensagens
 * inconsistentes) que existia em cada arquivo de serviço.
 */
export const httpClient = {
	get: <T>(resource: string, init?: RequestInit) => request<T>(resource, { ...init, method: "GET" }),

	post: <T>(resource: string, body?: unknown, init?: RequestInit) =>
		request<T>(resource, { ...withJsonBody(body, init), method: "POST" }),

	patch: <T>(resource: string, body?: unknown, init?: RequestInit) =>
		request<T>(resource, { ...withJsonBody(body, init), method: "PATCH" }),

	delete: <T = void>(resource: string, init?: RequestInit) => request<T>(resource, { ...init, method: "DELETE" }),
};

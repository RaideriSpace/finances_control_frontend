# Finanças Control — Frontend

Frontend (Next.js 16 App Router) do controle financeiro pessoal. Camada de apresentação: o
backend (NestJS) é a autoridade para persistência e regras financeiras — ver
[ARCHITECTURE.md](./ARCHITECTURE.md).

## Setup

```bash
pnpm install
pnpm dev
```

Abra [http://localhost:3000](http://localhost:3000).

O frontend espera o backend em `http://localhost:3001` por padrão. Para outro ambiente:

```bash
NEXT_PUBLIC_API_URL=https://sua-api.exemplo.com pnpm dev
```

## Funcionalidades

- **Dashboard** (`/`) — resumo mensal, saldos por conta, faturas e categorias mais gastas.
- **Lançamentos** (`/lancamentos`) — lista, filtros e CRUD de transações (com parcelamento).
- **Gastos fixos**, **Saldos fixos** e **Recorrências** — modais de CRUD acessíveis pelo header.

## Scripts

```bash
pnpm dev            # servidor de desenvolvimento
pnpm build          # build de produção
pnpm lint           # ESLint
pnpm test           # Vitest (testes de unidade e de componente)
pnpm test:watch     # Vitest em modo watch
```

## Estrutura

Ver [ARCHITECTURE.md](./ARCHITECTURE.md) para o detalhamento de `app/features/` e `app/lib/`.

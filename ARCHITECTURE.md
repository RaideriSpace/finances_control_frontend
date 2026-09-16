# Arquitetura — Finanças Control (Frontend)

## Visão Geral

O frontend é uma camada de apresentação. O backend é a autoridade para persistência e regras
financeiras (parcelamento, saldo por fonte, geração automática de recorrências). O frontend não
acessa nenhum banco de dados diretamente: fala exclusivamente com a API HTTP via `app/lib/api`.

- **Backend:** domínio financeiro, validação de entrada, persistência e API HTTP.
- **Frontend:** apresentação, estado de tela e composição de payloads compatíveis com a API.
- **Configuração:** `NEXT_PUBLIC_API_URL` define a origem da API (default `http://localhost:3001`).

## 1. Estrutura de diretórios

```
app/
├── page.tsx, layout.tsx          # rota "/" e layout raiz
├── lancamentos/page.tsx          # rota "/lancamentos"
├── components/                    # UI verdadeiramente compartilhada entre features
│   ├── SkipLink.tsx
│   ├── ToastProvider.tsx         # feedback de sucesso/erro (useToast)
│   └── ConfirmDialog.tsx         # confirmação assíncrona (useConfirm) — substitui window.confirm
├── features/
│   ├── dashboard/                 # DashboardView, DashboardCards
│   ├── transacoes/                # Header, Footer, AcoesRapidas, ListaTransacoes, FormularioTransacao
│   ├── gastos-fixos/               # ModalGastos
│   ├── saldos/                     # ModalSaldoFixos
│   ├── recorrencias/               # ModalRecorrentes
│   └── resumo-anual/               # ModalResumoAnual
└── lib/
    ├── api/                       # http-client.ts + um serviço por recurso (fetch tipado)
    ├── types/                     # Transacao, Recorrencia, Saldo, GastoFixo, DashboardResumo
    ├── finance/                   # regras de cálculo puras e testadas (ver seção 3)
    └── format.ts                  # formatarMoeda / formatarData
```

Cada feature agrupa seus próprios componentes; nada é compartilhado entre features por import
relativo cruzado — quando uma feature precisa de algo de outra (ex.: `Header` abre modais de
`saldos`/`gastos-fixos`/`recorrencias`), o import usa o alias absoluto `@/app/...`.

## 2. Camada de dados (`app/lib/api`)

`http-client.ts` centraliza `fetch` + tratamento de erro (`ApiError` tipado, com `status` e
mensagem extraída do corpo JSON do backend quando disponível). Cada arquivo `*.service.ts`
(`transacoes`, `saldo`, `gastos-fixos`, `recorrencias`, `dashboard`) é um objeto simples de métodos
que chamam `httpClient.get/post/patch/delete` — sem classes, sem DI, porque não há múltiplas
implementações a trocar (só existe um backend).

As páginas (Server Components) chamam esses mesmos serviços — não fazem `fetch()` inline.

## 3. Regras de negócio compartilhadas (`app/lib/finance`)

Cálculos usados por mais de uma tela (dashboard, resumo anual) vivem aqui como funções puras,
testadas por unidade, em vez de reimplementados em cada componente:

- `categorias.ts` — classificação canônica de ações em entrada/saída (espelha
  `TRANSACAO_ACOES_ENTRADA`/`SAIDA` do backend).
- `resumo-mensal.ts` — gasto/entrada/saldo de um período.
- `saldos-por-conta.ts` / `faturas.ts` — saldo e fatura por conta.
- `data-local.ts` — parsing de datas `YYYY-MM-DD` sem o deslocamento de fuso horário de
  `new Date(string)`.

## 4. Por que não há repository/DI no frontend

Uma versão anterior deste projeto tinha uma camada `app/core` inspirada em Clean Architecture
"de manual" (entidades, `ITransacaoRepository`, `TransacaoService`, DI manual) acessando o Supabase
diretamente — nunca usada pelas telas reais e removida nesta limpeza. Para uma UI que só fala com
um backend HTTP, repository/DI são abstrações sem propósito (não há uma segunda implementação para
trocar). O ganho real de "arquitetura limpa" aqui é: dados vindos do servidor não se misturam com
regra de cálculo (seção 3), que por sua vez não se mistura com JSX.

## 5. Convenções

- **Import:** relativo dentro da mesma feature (`./FormularioTransacao`), alias `@/app/...` entre
  features/lib.
- **Feedback:** `useToast()` para sucesso/erro, `useConfirm()` para confirmações — nunca
  `alert()`/`confirm()` nativos.
- **Atualização de dados após mutação:** `router.refresh()` (Next.js) para revalidar dados do
  Server Component, nunca `window.location.reload()`.
- **Tipos:** as uniões de `acao`/`cartao`/`tipo` em `lib/types/transacao.type.ts` são a fonte única
  reusada por `Recorrencia` — evita `as any` em conversões entre os dois.

## 6. Testes

Vitest + Testing Library. `pnpm test` roda tudo; o maior valor está em `app/lib/finance/*.test.ts`
(regras puras, sem mocks) e em testes de fumaça dos componentes mais usados.

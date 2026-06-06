# Arquitetura e Clean Code - RailLink

## Visão Geral

O RailLink segue os princípios de **Clean Architecture** e **Clean Code** para garantir um código escalável, testável e fácil de manter.

## 1. Estrutura de Diretórios

```
app/
├── core/
│   ├── domain/
│   │   ├── entities/          # Entidades de negócio
│   │   └── repositories/      # Interfaces de repositório
│   ├── infrastructure/
│   │   ├── services/          # Serviços de aplicação
│   │   └── repositories/      # Implementações de repositório
│   └── presentation/
│       ├── hooks/             # Hooks customizados
│       ├── utils/             # Funções utilitárias
│       └── constants/         # Constantes globais
├── transacoes/
│   └── components/            # Componentes de transações
├── components/                # Componentes reutilizáveis
├── layout.tsx                 # Layout raiz
├── page.tsx                   # Página raiz
└── globals.css               # Estilos globais
```

## 2. Camadas da Arquitetura

### 2.1 Domain Layer (Domínio)
Contém as regras de negócio puras, independentes de frameworks.

```typescript
// app/core/domain/entities/Transacao.ts
export interface Transacao {
  id: string;
  compra: string;
  valor: number;
  // ... outras propriedades
}

// app/core/domain/repositories/ITransacaoRepository.ts
export interface ITransacaoRepository {
  getTransacoes(): Promise<Transacao[]>;
  criarTransacao(transacao: Omit<Transacao, 'id'>): Promise<Transacao>;
  // ... outros métodos
}
```

### 2.2 Infrastructure Layer (Infraestrutura)
Implementa as interfaces do domínio e fornece acesso a dados externos.

```typescript
// app/core/infrastructure/repositories/SupabaseTransacaoRepository.ts
export class SupabaseTransacaoRepository implements ITransacaoRepository {
  async getTransacoes(): Promise<Transacao[]> {
    // Implementação com Supabase
  }
}

// app/core/infrastructure/services/TransacaoService.ts
export class TransacaoService {
  constructor(private repository: ITransacaoRepository) {}
  
  async obterTodasTransacoes(): Promise<Transacao[]> {
    return this.repository.getTransacoes();
  }
}
```

### 2.3 Presentation Layer (Apresentação)
Contém componentes React, hooks e utilitários de UI.

```typescript
// app/core/presentation/hooks/useTransacoes.ts
export function useTransacoes() {
  const [state, setState] = useState<UseTransacoesState>({
    transacoes: [],
    loading: true,
    error: null,
  });
  // ... lógica do hook
}

// app/transacoes/components/DashboardCards.tsx
export function DashboardCards({ data }: DashboardCardsProps) {
  // Componente de apresentação
}
```

## 3. Princípios SOLID

### 3.1 Single Responsibility Principle (SRP)
Cada classe/função tem uma única responsabilidade.

```typescript
// ✅ Bom: Cada classe tem uma responsabilidade
class TransacaoService {
  async obterTransacoes() { /* ... */ }
}

class TransacaoRepository {
  async getTransacoes() { /* ... */ }
}

// ❌ Ruim: Múltiplas responsabilidades
class TransacaoManager {
  async obterTransacoes() { /* ... */ }
  async salvarNoSupabase() { /* ... */ }
  async formatarParaUI() { /* ... */ }
}
```

### 3.2 Open/Closed Principle (OCP)
Aberto para extensão, fechado para modificação.

```typescript
// ✅ Bom: Interface permite múltiplas implementações
interface ITransacaoRepository {
  getTransacoes(): Promise<Transacao[]>;
}

class SupabaseTransacaoRepository implements ITransacaoRepository { }
class FirebaseTransacaoRepository implements ITransacaoRepository { }

// ❌ Ruim: Modificar código existente para adicionar novo repositório
class TransacaoService {
  if (useSupabase) { /* ... */ }
  else if (useFirebase) { /* ... */ }
}
```

### 3.3 Liskov Substitution Principle (LSP)
Subclasses devem ser substituíveis por suas superclasses.

```typescript
// ✅ Bom: Implementações podem ser substituídas
const repository: ITransacaoRepository = new SupabaseTransacaoRepository();
const service = new TransacaoService(repository);

// Pode trocar para Firebase sem quebrar o código
const repository: ITransacaoRepository = new FirebaseTransacaoRepository();
```

### 3.4 Interface Segregation Principle (ISP)
Clientes não devem depender de interfaces que não usam.

```typescript
// ✅ Bom: Interfaces específicas
interface ITransacaoReader {
  getTransacoes(): Promise<Transacao[]>;
}

interface ITransacaoWriter {
  criarTransacao(transacao: Omit<Transacao, 'id'>): Promise<Transacao>;
}

// ❌ Ruim: Interface genérica
interface ITransacaoRepository {
  getTransacoes(): Promise<Transacao[]>;
  criarTransacao(transacao: Omit<Transacao, 'id'>): Promise<Transacao>;
  atualizarTransacao(id: string, transacao: Partial<Transacao>): Promise<Transacao>;
  deletarTransacao(id: string): Promise<void>;
}
```

### 3.5 Dependency Inversion Principle (DIP)
Dependa de abstrações, não de implementações concretas.

```typescript
// ✅ Bom: Depende de interface
class TransacaoService {
  constructor(private repository: ITransacaoRepository) {}
}

// ❌ Ruim: Depende de implementação concreta
class TransacaoService {
  constructor(private repository: SupabaseTransacaoRepository) {}
}
```

## 4. Clean Code

### 4.1 Nomes Significativos
```typescript
// ✅ Bom
const formatarMoeda = (valor: number): string => { /* ... */ }
const obterClasseCorValor = (valor: number): string => { /* ... */ }

// ❌ Ruim
const fmt = (v: number): string => { /* ... */ }
const getColor = (v: number): string => { /* ... */ }
```

### 4.2 Funções Pequenas e Focadas
```typescript
// ✅ Bom: Funções pequenas e específicas
const obterCorValor = (valor: number): string => {
  if (valor > 0) return COLORS.positive;
  if (valor < 0) return COLORS.negative;
  return COLORS.neutral;
}

// ❌ Ruim: Função faz muitas coisas
const processarValor = (valor: number) => {
  const cor = valor > 0 ? 'green' : valor < 0 ? 'red' : 'gray';
  const formatado = new Intl.NumberFormat('pt-BR', { /* ... */ }).format(valor);
  const classe = `text-${cor}-600 font-bold`;
  return { cor, formatado, classe };
}
```

### 4.3 Tratamento de Erros
```typescript
// ✅ Bom: Tratamento explícito
try {
  const transacoes = await service.obterTodasTransacoes();
} catch (error) {
  const err = error instanceof Error ? error : new Error('Erro desconhecido');
  setState((prev) => ({ ...prev, error: err }));
}

// ❌ Ruim: Ignorar erros
const transacoes = await service.obterTodasTransacoes();
```

### 4.4 Documentação
```typescript
/**
 * @function formatarMoeda
 * @description Formata um valor numérico como moeda brasileira
 * @param {number} valor - O valor a ser formatado
 * @returns {string} Valor formatado em BRL
 * @example
 * formatarMoeda(1000.50) // "R$ 1.000,50"
 */
export function formatarMoeda(valor: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(valor);
}
```

## 5. Padrões de Projeto

### 5.1 Dependency Injection
```typescript
// Injetar dependências via construtor
class TransacaoService {
  constructor(private repository: ITransacaoRepository) {}
}

// Uso
const repository = new SupabaseTransacaoRepository();
const service = new TransacaoService(repository);
```

### 5.2 Repository Pattern
```typescript
// Abstração de acesso a dados
interface ITransacaoRepository {
  getTransacoes(): Promise<Transacao[]>;
  criarTransacao(transacao: Omit<Transacao, 'id'>): Promise<Transacao>;
}

// Implementação
class SupabaseTransacaoRepository implements ITransacaoRepository {
  async getTransacoes(): Promise<Transacao[]> { /* ... */ }
  async criarTransacao(transacao: Omit<Transacao, 'id'>): Promise<Transacao> { /* ... */ }
}
```

### 5.3 Service Layer
```typescript
// Lógica de negócio centralizada
class TransacaoService {
  async obterTodasTransacoes(): Promise<Transacao[]> {
    return this.repository.getTransacoes();
  }

  obterCorValor(valor: number): 'positive' | 'negative' | 'neutral' {
    if (valor > 0) return 'positive';
    if (valor < 0) return 'negative';
    return 'neutral';
  }
}
```

### 5.4 Custom Hooks
```typescript
// Encapsular lógica de estado
export function useTransacoes() {
  const [state, setState] = useState<UseTransacoesState>({
    transacoes: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    carregarDados();
  }, []);

  return { ...state, carregarDados };
}
```

## 6. Boas Práticas

### 6.1 Type Safety
```typescript
// ✅ Usar tipos TypeScript
interface Transacao {
  id: string;
  valor: number;
  tipo: 'debito' | 'credito';
}

// ❌ Evitar any
const transacao: any = { /* ... */ };
```

### 6.2 Imutabilidade
```typescript
// ✅ Bom: Não mutar estado
setState((prev) => ({
  ...prev,
  transacoes: [novaTransacao, ...prev.transacoes],
}));

// ❌ Ruim: Mutar estado diretamente
state.transacoes.push(novaTransacao);
```

### 6.3 Composição sobre Herança
```typescript
// ✅ Bom: Composição
class TransacaoService {
  constructor(private repository: ITransacaoRepository) {}
}

// ❌ Ruim: Herança
class TransacaoService extends BaseService {
  // ...
}
```

## 7. Testes

### 7.1 Estrutura de Testes
```typescript
describe('TransacaoService', () => {
  let service: TransacaoService;
  let repository: ITransacaoRepository;

  beforeEach(() => {
    repository = new MockTransacaoRepository();
    service = new TransacaoService(repository);
  });

  it('deve obter todas as transações', async () => {
    const transacoes = await service.obterTodasTransacoes();
    expect(transacoes).toBeDefined();
  });
});
```

## 8. Recursos Adicionais

- [Clean Code - Robert C. Martin](https://www.amazon.com/Clean-Code-Handbook-Software-Craftsmanship/dp/0132350882)
- [Clean Architecture - Robert C. Martin](https://www.amazon.com/Clean-Architecture-Craftsmans-Software-Structure/dp/0134494164)
- [SOLID Principles](https://en.wikipedia.org/wiki/SOLID)
- [Design Patterns](https://refactoring.guru/design-patterns)

---

**Última atualização:** 06/06/2026
**Versão:** 1.0
**Status:** Ativo

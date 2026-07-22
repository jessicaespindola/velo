# Plano: testes unitários iniciais do configuratorStore

Configurar Vitest e criar testes unitários básicos apenas para as funções puras de `configuratorStore.ts` (`calculateTotalPrice`, `calculateInstallment`, `formatPrice`), como estrutura inicial da prática de unit tests.

## Contexto

- Alvo: funções puras exportadas em [`src/store/configuratorStore.ts`](../../src/store/configuratorStore.ts).
- Runner: **Vitest** (compatível com Vite).
- Escopo desta etapa: **somente helpers** — sem testes do Zustand/`useConfiguratorStore` (podem vir depois).

## 1. Dependências e configuração

- Instalar `vitest` como `devDependency` (`yarn add -D vitest`).
- Em [`package.json`](../../package.json), adicionar `"test": "vitest"`.
- Configuração extra do Vite não é necessária agora: os testes importam só funções puras, sem DOM nem `persist`.

## 2. Arquivo de teste

Criar [`src/store/configuratorStore.test.ts`](../../src/store/configuratorStore.test.ts) com cenários básicos:

- **`calculateTotalPrice`**: preço base (aero, sem opcionais → `40000`); com extras (`sport` + opcional → soma correta).
- **`calculateInstallment`**: parcela de um total conhecido (ex. `40000`), número com 2 casas.
- **`formatPrice`**: formatação BRL (`R$` / pt-BR).

Estilo Arrange / Act / Assert, para servir de exemplo ao time.

## 3. Validação

1. Instalar dependência.
2. Rodar `yarn test` (ou `npx vitest run` em CI/one-shot).
3. Confirmar que os testes passam.

## Escopo explícito (fora)

- Sem testes de `useConfiguratorStore` / persist / migrate.
- Sem alterar lógica de produção.
- Sem CI obrigatório nesta etapa.
- Sem misturar com Playwright.

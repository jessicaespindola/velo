# Velô Sprint - Configurador de Veículo Elétrico

Aplicação web em React para configuração e compra do veículo elétrico **Velô Sprint**.

## Sobre o Projeto

Uma SPA (Single Page Application) que permite:
- Personalizar cores, rodas e opcionais do veículo
- Calcular preços em tempo real
- Realizar pedidos com análise de crédito
- Consultar status de pedidos

**Especificações do Velô Sprint:** 450 km de autonomia | 0-100 km/h em 3.2s | 500 cv

---

## Stack Tecnológica

| Categoria | Tecnologias |
|-----------|-------------|
| **Frontend** | React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui |
| **Estado** | Zustand (global), React Hook Form (formulários) |
| **Validação** | Zod |
| **Data Fetching** | TanStack Query |
| **Backend** | Supabase (PostgreSQL + Edge Functions) |

---

## Instalação

```bash
# Instalar dependências
npm install

# Rodar em desenvolvimento
npm run dev .
```

Acesse: `http://localhost:5173`

---

## Configuração do Supabase

Existem **dois** projetos Supabase. O `project-ref` é o ID do projeto (Settings → General → Reference ID).

| Ambiente | Projeto | project-ref |
|----------|---------|-------------|
| **Produção** | Velô | `hsbmmnsilauhstfocxqs` |
| **Preview** (E2E / deploys de preview) | velo-sprint-preview | `owgvnkbvtiuegmkjenkh` |

> Sempre confira o `--project-ref` antes de `db push` ou `functions deploy`. Apontar para o ref errado aplica mudanças no banco errado.

### 1. Variáveis de Ambiente (local)

Crie o arquivo `.env` na raiz. Para desenvolvimento e E2E locais, prefira o **preview** para não poluir produção:

```env
VITE_SUPABASE_PROJECT_ID="owgvnkbvtiuegmkjenkh"
VITE_SUPABASE_PUBLISHABLE_KEY="sua_chave_publishable_do_preview"
VITE_SUPABASE_URL="https://owgvnkbvtiuegmkjenkh.supabase.co"

# Usado pelos E2E (insert/delete direto no Postgres). Deve ser o pooler do PREVIEW.
DATABASE_URL="postgresql://postgres.owgvnkbvtiuegmkjenkh:SENHA@aws-0-sa-east-1.pooler.supabase.com:5432/postgres"
```

Chaves em: **Project Settings → API**. Connection string em: **Project Settings → Database**.

### 2. Deploy (banco + functions)

```bash
yarn supabase login

# --- Preview ---
yarn supabase link --project-ref owgvnkbvtiuegmkjenkh
yarn supabase db push
yarn supabase functions deploy
# Mock de crédito no preview (opcional, recomendado para E2E):
yarn supabase secrets set USE_MOCK_CREDIT_ANALYSIS=true --project-ref owgvnkbvtiuegmkjenkh

# --- Produção (só quando for intencional) ---
yarn supabase link --project-ref hsbmmnsilauhstfocxqs
yarn supabase db push
yarn supabase functions deploy
```

### 3. Variáveis na Vercel

Configure escopos **separados** (não “All Environments”):

| Variável | Production (projeto **Velô**) | Preview (projeto **velo-sprint-preview**) |
|----------|-------------------------------|-------------------------------------------|
| `VITE_SUPABASE_URL` | `https://hsbmmnsilauhstfocxqs.supabase.co` | `https://owgvnkbvtiuegmkjenkh.supabase.co` |
| `VITE_SUPABASE_PROJECT_ID` | `hsbmmnsilauhstfocxqs` | `owgvnkbvtiuegmkjenkh` |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | publishable key do **Velô** | publishable key do **velo-sprint-preview** |

O CD faz `vercel pull --environment=preview` no job de preview e `--environment=production` no job de produção, então cada build embute o Supabase correto.

### 4. Continuous Deployment (rebuild no lugar de `promote`)

Fluxo em [`.github/workflows/cd.yml`](.github/workflows/cd.yml):

1. Testes unitários  
2. Build + deploy **preview** (vars do projeto **velo-sprint-preview**)  
3. E2E Playwright contra a URL de preview (`BASE_URL` + secret `DATABASE_URL` do Postgres de **velo-sprint-preview**)  
4. **Rebuild + deploy production** (vars do projeto **Velô**)

**Por que rebuild em vez de `vercel promote`?**  
Vite substitui `VITE_*` no JavaScript no momento do `vite build`. O artefato de preview já contém a URL/key do **velo-sprint-preview**. Promover esse mesmo build faria a produção continuar falando com o banco de preview.

O rebuild com `--environment=production` é o equivalente seguro ao promote para SPA Vite: sobe o **mesmo commit** para produção com as variáveis do projeto **Velô**, garantindo que produção leia e escreva só no banco de produção.

No GitHub Actions, o secret `DATABASE_URL` deve apontar **somente** para o Postgres de **velo-sprint-preview**.

### 5. Validação do isolamento (cenário executado)

O pipeline verde sozinho não prova o isolamento. O cenário abaixo confirma que preview e produção leem **bancos diferentes**.

#### Pré-condição

1. Criar (ou inserir) um pedido **somente** no projeto **velo-sprint-preview** (`owgvnkbvtiuegmkjenkh`), por exemplo pelo Table Editor.
2. Anotar o número do pedido. No cenário executado: **`VLO-J892VY`**.
3. Confirmar no Table Editor do projeto **Velô** (`hsbmmnsilauhstfocxqs`) que esse número **não** existe.

#### Passo A — Consultar na preview

1. Abrir a URL de preview do último CD (job *Build & Deploy Vercel Preview* → step *Deploy preview*).  
   Exemplo do run validado: deployment de preview em `*.vercel.app` (URL muda a cada deploy; copie do log, sem digitar à mão — `l` e `1` se confundem).
2. Ir em **Consultar Pedido** (`/lookup`).
3. Buscar `VLO-J892VY`.
4. **Resultado esperado:** pedido encontrado (ex.: status APROVADO).
5. DevTools → **Network** → filtrar `supabase` → na response, `sb-project-ref` deve ser **`owgvnkbvtiuegmkjenkh`** (**velo-sprint-preview**).

#### Passo B — Consultar em produção

1. Abrir a URL estável de produção: `https://velo-jessicaespindola.vercel.app/lookup`.
2. Buscar o **mesmo** número: `VLO-J892VY`.
3. **Resultado esperado:** mensagem **Pedido não encontrado**.
4. DevTools → **Network** → filtrar `supabase` → `sb-project-ref` deve ser **`hsbmmnsilauhstfocxqs`** (**Velô**).

#### Critério de sucesso

| Ambiente | Projeto Supabase | Pedido `VLO-J892VY` | `sb-project-ref` |
|----------|------------------|---------------------|------------------|
| Preview | **velo-sprint-preview** | Encontrado | `owgvnkbvtiuegmkjenkh` |
| Produção | **Velô** | Não encontrado | `hsbmmnsilauhstfocxqs` |

Se os dois lados baterem, o isolamento está validado: dado criado no preview **não** aparece em produção, e cada front aponta para o Supabase do seu ambiente.

### 6. Critérios de aceitação

| # | Critério | Como foi atendido |
|---|----------|-------------------|
| 1 | Dois projetos Supabase distintos | **Velô** (produção) e **velo-sprint-preview** (preview/E2E) |
| 2 | Pedido criado nos E2E não aparece no banco de produção | E2E usam preview (`BASE_URL` + `DATABASE_URL` de **velo-sprint-preview**); validado com `VLO-J892VY` |
| 3 | Após o “promote”, produção lê/escreve no banco de produção | Atendido via **rebuild** de Production (não `vercel promote`), com vars do projeto **Velô** |
| 4 | Testes E2E passam no pipeline | Job *Run E2E Tests* verde no CD após o deploy de preview |
| 5 | Migrações e Edge Functions sincronizadas | `db push` + `functions deploy` nos dois projetos; mesma function `credit-analysis` |
| 6 | Secrets/variáveis sensíveis fora do repositório | `.env` e `docs/db-password.txt` no `.gitignore` (não versionar); `DATABASE_URL` e tokens só em GitHub Secrets / Vercel Env |

---

## Estrutura Principal

```
src/
├── pages/           # Páginas da aplicação
├── components/      # Componentes React
│   ├── configurator/   # Configurador do carro
│   ├── landing/        # Landing page
│   └── ui/             # Componentes shadcn/ui
├── store/           # Estado global (Zustand)
├── hooks/           # Hooks customizados
└── integrations/    # Cliente Supabase
```

---

## Rotas

| Rota | Descrição |
|------|-----------|
| `/` | Landing page |
| `/configure` | Configurador do veículo |
| `/order` | Checkout/Pedido |
| `/success` | Confirmação do pedido |
| `/lookup` | Consulta de pedidos |

---

## Modelo de Preços

- **Preço base:** R$ 40.000
- **Rodas Sport:** +R$ 2.000
- **Precision Park:** +R$ 5.500
- **Flux Capacitor:** +R$ 5.000
- **Financiamento:** 12x com juros de 2% a.m.

---

## Banco de Dados

**Tabela `orders`** — campos principais:
- `order_number` — Formato: VLO-XXXXXX
- `color`, `wheel_type`, `optionals` — Configuração
- `customer_name`, `customer_email`, `customer_cpf` — Cliente
- `payment_method`, `total_price` — Pagamento
- `status` — pending, approved, rejected, analysis

---

## Análise de Crédito

| Score | Resultado |
|-------|-----------|
| > 700 | Aprovado |
| 501-700 | Em análise |
| ≤ 500 | Reprovado |

*Se entrada ≥ 50% do total, aprova mesmo com score < 700*

---

## Fluxo Principal

```
Landing → Configurador → Checkout → Análise de Crédito → Confirmação
```

---

## Scripts

```bash
npm run dev      # Desenvolvimento
npm run build    # Build de produção
npm run lint     # Verificar código
```
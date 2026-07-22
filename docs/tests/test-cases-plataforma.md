# Documento de Casos de Testes - Plataforma SIPNC (DES - INTRANET)

Este documento contém os casos de teste funcionais para a plataforma SIPNC, acessada pela intranet DES. A cobertura inicial concentra-se no módulo de **Login**, para o perfil de usuário da rede corporativa.

**Tela de referência (estado inicial):**

- Título: **Login DES - INTRANET**
- Identificação do sistema: **SIPNC**
- Orientação ao usuário: *Informe usuário (C999999) e senha da rede*
- Campos: **Usuário** e **Senha**
- Ação principal: botão **Entrar**

---

### CT01 - Exibição e Elementos da Tela de Login

#### Objetivo
Garantir que a tela inicial de login apresenta todas as informações, campos e ações necessários para o usuário se autenticar na plataforma.

#### Pré-Condições
- O sistema deve estar acessível na URL da intranet DES.
- O usuário ainda não está autenticado (sessão inexistente ou expirada).

#### Passos

| Id | Ação | Resultado Esperado |
|----|------|--------------------|
| 1  | Acessar a URL de entrada da plataforma SIPNC | A tela de login é carregada com sucesso, sem erros visíveis de carregamento. |
| 2  | Observar o cabeçalho e identificação do sistema | São exibidos o título **Login DES - INTRANET** e a identificação **SIPNC**. |
| 3  | Ler a orientação exibida na tela | O sistema apresenta a mensagem orientando a informar usuário no formato de rede (ex.: C999999) e a senha da rede. |
| 4  | Verificar os campos do formulário | Os campos **Usuário** e **Senha** estão visíveis, habilitados e prontos para preenchimento. |
| 5  | Verificar a ação de confirmação | O botão **Entrar** está visível e habilitado para acionamento. |

#### Resultados Esperados
- A tela de login comunica claramente o contexto (DES - INTRANET / SIPNC), o formato esperado do usuário e permite informar credenciais da rede.

#### Critérios de Aceitação
- Título, identificação SIPNC, texto de orientação, campos Usuário/Senha e botão Entrar estão presentes e legíveis.
- Nenhum elemento essencial do login fica oculto ou desabilitado indevidamente na carga inicial.

---

### CT02 - Login com Credenciais Válidas (Fluxo Feliz)

#### Objetivo
Validar que um usuário da rede consegue autenticar-se informando usuário e senha válidos e é direcionado ao ambiente interno da plataforma.

#### Pré-Condições
- Estar na tela de login da plataforma SIPNC.
- Possuir credenciais válidas de rede: usuário no padrão corporativo (ex.: `C123456`) e senha ativa.

#### Passos

| Id | Ação | Resultado Esperado |
|----|------|--------------------|
| 1  | Informar no campo **Usuário** um login válido da rede (ex.: C123456) | O valor é aceito e exibido no campo. |
| 2  | Informar no campo **Senha** a senha correspondente à rede | O valor é mascarado (não exibido em texto claro) e aceito no campo. |
| 3  | Clicar no botão **Entrar** | O sistema processa a autenticação (feedback de carregamento, se houver). |
| 4  | Aguardar a conclusão do login | O usuário deixa a tela de login e acessa a área autenticada da plataforma (home ou rota padrão pós-login). |
| 5  | Verificar o estado da sessão | O usuário permanece autenticado ao navegar nas telas iniciais permitidas, sem retorno imediato à tela de login. |

#### Resultados Esperados
- Credenciais corretas resultam em autenticação bem-sucedida e acesso ao conteúdo interno da SIPNC.

#### Critérios de Aceitação
- Usuário e senha válidos da rede permitem entrar na plataforma.
- Após o login, a tela de login não permanece como destino principal da sessão.

---

### CT03 - Tentativa de Login com Campos Vazios

#### Objetivo
Garantir que o sistema não permite autenticação sem o preenchimento das credenciais obrigatórias.

#### Pré-Condições
- Estar na tela de login da plataforma SIPNC.
- Campos **Usuário** e **Senha** vazios.

#### Passos

| Id | Ação | Resultado Esperado |
|----|------|--------------------|
| 1  | Manter os campos **Usuário** e **Senha** em branco | Nenhum valor é informado nos campos. |
| 2  | Clicar no botão **Entrar** | O sistema não autentica o usuário. |
| 3  | Observar o feedback na interface | São exibidas mensagens de validação indicando a obrigatoriedade do usuário e/ou da senha (ou equivalente visual que impeça o envio). |
| 4  | Confirmar que a sessão não foi criada | O usuário permanece na tela de login, sem acesso à área interna. |

#### Resultados Esperados
- Login não é realizado quando as credenciais não são informadas.

#### Critérios de Aceitação
- Submissão com ambos os campos vazios não autentica e mantém o usuário na tela de login.
- O sistema comunica de forma clara o que falta preencher.

---

### CT04 - Tentativa de Login Apenas com Usuário Preenchido

#### Objetivo
Validar o comportamento quando o usuário informa o login da rede, mas não preenche a senha.

#### Pré-Condições
- Estar na tela de login da plataforma SIPNC.

#### Passos

| Id | Ação | Resultado Esperado |
|----|------|--------------------|
| 1  | Preencher o campo **Usuário** com um valor válido no formato de rede (ex.: C123456) | O usuário é aceito no campo. |
| 2  | Deixar o campo **Senha** em branco | O campo permanece vazio. |
| 3  | Clicar no botão **Entrar** | O sistema não autentica o usuário. |
| 4  | Observar o feedback | É exibida mensagem de obrigatoriedade ou erro referente à **Senha** (ou bloqueio equivalente do envio). |

#### Resultados Esperados
- A senha é tratada como campo obrigatório; o login não prossegue sem ela.

#### Critérios de Aceitação
- Usuário preenchido e senha vazia não resultam em autenticação.

---

### CT05 - Tentativa de Login Apenas com Senha Preenchida

#### Objetivo
Validar o comportamento quando o usuário informa a senha, mas não preenche o identificador de rede.

#### Pré-Condições
- Estar na tela de login da plataforma SIPNC.

#### Passos

| Id | Ação | Resultado Esperado |
|----|------|--------------------|
| 1  | Deixar o campo **Usuário** em branco | O campo permanece vazio. |
| 2  | Preencher o campo **Senha** com qualquer valor | O valor é aceito no campo (mascarado). |
| 3  | Clicar no botão **Entrar** | O sistema não autentica o usuário. |
| 4  | Observar o feedback | É exibida mensagem de obrigatoriedade ou erro referente ao **Usuário** (ou bloqueio equivalente do envio). |

#### Resultados Esperados
- O usuário da rede é tratado como campo obrigatório; o login não prossegue sem ele.

#### Critérios de Aceitação
- Senha preenchida e usuário vazio não resultam em autenticação.

---

### CT06 - Login com Usuário ou Senha Inválidos

#### Objetivo
Validar que credenciais incorretas não concedem acesso à plataforma e o usuário recebe feedback adequado.

#### Pré-Condições
- Estar na tela de login da plataforma SIPNC.
- Utilizar combinações de usuário e/ou senha que não correspondam a credenciais válidas na rede (ex.: usuário inexistente, senha errada).

#### Passos

| Id | Ação | Resultado Esperado |
|----|------|--------------------|
| 1  | Informar no campo **Usuário** um login que não existe ou está incorreto | O valor é aceito no campo para tentativa de autenticação. |
| 2  | Informar no campo **Senha** uma senha que não confere com o usuário | O valor é aceito no campo (mascarado). |
| 3  | Clicar no botão **Entrar** | O sistema processa a tentativa e rejeita a autenticação. |
| 4  | Observar o feedback na interface | É exibida mensagem de falha de login (ex.: usuário ou senha inválidos), sem expor detalhes sensíveis do sistema. |
| 5  | Verificar os campos após a falha | O usuário permanece na tela de login; campos podem ser limpos ou mantidos conforme regra de segurança da aplicação. |

#### Resultados Esperados
- Credenciais inválidas não criam sessão autenticada na SIPNC.

#### Critérios de Aceitação
- Combinação incorreta de usuário e senha não autentica.
- A mensagem de erro é compreensível e não revela informações internas desnecessárias (ex.: se apenas a senha falhou, conforme política de segurança adotada).

---

### CT07 - Formato do Usuário de Rede (Padrão C999999)

#### Objetivo
Verificar o comportamento do sistema frente ao formato de usuário indicado na orientação da tela (padrão corporativo tipo `C` + matrícula/código numérico).

#### Pré-Condições
- Estar na tela de login da plataforma SIPNC.

#### Passos

| Id | Ação | Resultado Esperado |
|----|------|--------------------|
| 1  | Informar no campo **Usuário** um valor no formato esperado (ex.: C123456) e senha válida correspondente | O sistema aceita o formato para tentativa de autenticação. |
| 2  | Clicar em **Entrar** com credenciais válidas nesse formato | O login é bem-sucedido (fluxo feliz). |
| 3  | Repetir a tentativa informando usuário fora do padrão indicado (ex.: apenas números, texto sem prefixo `C`, caracteres especiais) e senha qualquer | O sistema valida ou rejeita conforme regra de negócio (mensagem de formato inválido ou falha de autenticação). |
| 4  | Observar o feedback para formato inválido | O usuário é informado de que o login deve seguir o padrão de rede (ex.: C999999), ou a autenticação falha sem conceder acesso. |

#### Resultados Esperados
- O padrão de usuário comunicado na tela (C999999) é respeitado pelas regras de validação e autenticação da plataforma.

#### Critérios de Aceitação
- Usuários no formato corporativo válido são aceitos para autenticação quando as credenciais estão corretas.
- Entradas claramente fora do padrão não resultam em login indevido (validação de formato ou falha de autenticação).

---

### CT08 - Comportamento do Campo Senha

#### Objetivo
Garantir que a senha da rede é tratada de forma adequada na interface de login (privacidade e usabilidade básica).

#### Pré-Condições
- Estar na tela de login da plataforma SIPNC.

#### Passos

| Id | Ação | Resultado Esperado |
|----|------|--------------------|
| 1  | Digitar caracteres no campo **Senha** | Os caracteres não são exibidos em texto claro (campo do tipo senha / mascarado). |
| 2  | Apagar e redigitar a senha | O campo permite edição normal até o envio do formulário. |
| 3  | Tentar colar uma senha no campo (se aplicável) | O valor é aceito e permanece mascarado. |
| 4  | Submeter com credenciais válidas após preenchimento | O login segue o fluxo feliz sem exibir a senha na interface após o envio. |

#### Resultados Esperados
- A senha permanece oculta durante o preenchimento e o processo de autenticação.

#### Critérios de Aceitação
- O campo Senha não exibe o conteúdo em texto legível durante a digitação.
- Após tentativa de login, a senha não aparece em mensagens de erro ou em elementos visíveis da tela.

---

### CT09 - Múltiplas Tentativas de Login Falhas

#### Objetivo
Validar a estabilidade da tela e as políticas de segurança após tentativas repetidas com credenciais incorretas.

#### Pré-Condições
- Estar na tela de login da plataforma SIPNC.
- Credenciais inválidas disponíveis para teste.

#### Passos

| Id | Ação | Resultado Esperado |
|----|------|--------------------|
| 1  | Realizar uma primeira tentativa de login com usuário e senha incorretos e clicar em **Entrar** | O sistema exibe falha de autenticação e mantém o usuário na tela de login. |
| 2  | Repetir o procedimento por mais duas a três vezes consecutivas | Cada tentativa é tratada de forma consistente (mensagem de erro, sem travamento da página). |
| 3  | Observar se há bloqueio temporário, captcha ou aviso de segurança | Conforme política da plataforma: bloqueio após N tentativas, mensagem de aguardar, ou apenas repetição da mensagem de erro — o comportamento deve ser previsível e documentado. |
| 4  | Após eventual bloqueio (se existir), aguardar o período definido ou usar credenciais válidas | O usuário válido consegue autenticar-se quando as condições de desbloqueio forem atendidas. |

#### Resultados Esperados
- A plataforma permanece estável e aplica controles de segurança previsíveis em tentativas repetidas de login inválido.

#### Critérios de Aceitação
- Tentativas falhas consecutivas não quebram a tela nem expõem erros técnicos ao usuário.
- Se existir limite de tentativas, ele é comunicado de forma clara; após o limite, login válido só ocorre quando a regra de desbloqueio for satisfeita.

---

### CT10 - Acesso à Tela de Login com Sessão Já Ativa

#### Objetivo
Verificar o comportamento quando um usuário já autenticado tenta acessar novamente a URL da tela de login.

#### Pré-Condições
- Usuário autenticado com sucesso na plataforma SIPNC em sessão ativa.

#### Passos

| Id | Ação | Resultado Esperado |
|----|------|--------------------|
| 1  | Com sessão ativa, acessar diretamente a URL da tela de login | O sistema redireciona para a área interna já autenticada **ou** exibe a tela de login permitindo novo acesso, conforme regra definida pelo produto. |
| 2  | Se houver redirecionamento automático | O usuário não precisa informar credenciais novamente para continuar na plataforma. |
| 3  | Se a tela de login for exibida mesmo com sessão ativa | Deve existir forma explícita de sair (logout) ou substituir sessão, sem comportamento ambíguo. |

#### Resultados Esperados
- O fluxo de sessão evita autenticação duplicada confusa ou acesso indevido após login válido.

#### Critérios de Aceitação
- Comportamento documentado e consistente: redirecionamento para área logada **ou** tela de login com opção clara de encerrar sessão anterior.

---

## Próximos módulos (fora do escopo inicial)

Após validação do login, este documento pode ser estendido com casos para navegação pós-autenticação, perfis de acesso, logout e demais funcionalidades da plataforma SIPNC.

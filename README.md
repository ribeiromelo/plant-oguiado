# Plantão Guiado

Sistema web de apoio à decisão clínica para médicos de plantão. Gera textos estruturados prontos para colar no prontuário eletrônico, com calculadoras clínicas integradas, receituário imprimível e banco de prescrições.

---

## Acesso

| Ambiente | URL |
|---|---|
| Produção (Cloudflare Pages) | https://plant-oguiado.pages.dev |
| Repositório GitHub | https://github.com/ribeiromelo/plant-oguiado |

**Login padrão:** `admin` / `medico123`

---

## Stack Tecnológica

| Camada | Tecnologia |
|---|---|
| Backend / Roteamento | [Hono](https://hono.dev/) (TypeScript) rodando em Cloudflare Workers |
| Frontend reativo | [Alpine.js v3](https://alpinejs.dev/) (CDN) |
| Estilização | [Tailwind CSS](https://tailwindcss.com/) (CDN) + CSS customizado (`styles.css`) |
| Build | [Vite](https://vitejs.dev/) com `@hono/vite-build` |
| Deploy | [Cloudflare Pages](https://pages.cloudflare.com/) via `wrangler pages deploy` |
| Banco de dados | Cloudflare D1 (SQLite) — tabela `users` para autenticação |
| Armazenamento local | `localStorage` do browser (dados do médico, logo) |
| Servidor de desenvolvimento | PM2 + `wrangler pages dev` |

---

## Estrutura de Arquivos

```
webapp/
├── src/
│   └── index.tsx          # Servidor Hono completo: todas as rotas + HTML das páginas
├── public/
│   └── static/
│       ├── app.js         # Lógica Alpine.js: state, métodos, geradores de texto
│       └── styles.css     # CSS customizado (.form-input, variantes de cor, print)
├── dist/                  # Build gerado pelo Vite (não commitar)
│   └── _worker.js         # Bundle final (~315 kB) enviado ao Cloudflare
├── wrangler.jsonc         # Configuração do Cloudflare Pages / Workers
├── package.json           # Dependências e scripts npm
├── vite.config.ts         # Configuração do build
├── tsconfig.json          # Configuração TypeScript
├── ecosystem.config.cjs   # Configuração PM2 (dev sandbox)
└── .gitignore
```

---

## Rotas do Servidor

| Método | Rota | Descrição |
|---|---|---|
| GET | `/login` | Página de login |
| POST | `/login` | Autenticação (D1 + fallback hardcoded) |
| GET | `/logout` | Encerra sessão (limpa cookie) |
| GET | `/` | Página principal — Evolução / formulários clínicos |
| GET | `/prescricoes` | Banco de prescrições médicas salvas |
| GET | `/receituario` | Receituário imprimível |

Todas as rotas (exceto `/login` e `/static/*`) exigem cookie `auth_user` válido.

---

## Páginas e Funcionalidades

### 1. Evolução (`/`) — Página Principal

Formulário clínico com três modos de atendimento selecionáveis no topo:

#### Modo 1 — PS Clínica Médica (SOAP)
Formato de nota clínica em SOAP para pronto-socorro. Seções:
- **Identificação:** nome, idade, sexo, tipo de admissão
- **Hábitos de vida:** tabagismo (com carga), etilismo, drogas, sedentarismo
- **Antecedentes:** comorbidades, alergias, cirurgias prévias
- **Medicação em uso:** lista dinâmica (nome + posologia), add/remove
- **Sinais vitais:** PA (campo texto), FC, FR, Sat, Temp, HGT
- **Exame físico:** Estado Geral, AC, AR, Abdome, Neuro, Extremidades — botões "Normal" que preenchem valor padrão adaptado ao sexo do paciente
- **Exames físicos adicionais:** lista dinâmica com 12 opções pré-definidas (otoscopia, oroscopia, rinoscopia, oftalmoscopia, pele, linfonodos, tireoide, mamas, geniturinário, osteoarticular, vascular, psiquiátrico)
- **Exames complementares:** laboratório e imagem
- **Avaliação (A):** busca de CID-10 com dropdown inteligente (banco local em português de 250+ CIDs + fallback API NLM), chips de diagnósticos removíveis, campo livre
- **Conduta (P):** prescrição livre, exames solicitados, destino, alta com checklists (orientação de medicações, sinais de alarme, atestado, encaminhamento)
- **Negativos:** checkboxes de sintomas que o paciente nega (febre, cefaleia, tontura, dispneia, dor torácica, náuseas, intestino, urinário)

#### Modo 2 — Sala Vermelha / UTI
Dois sub-templates, selecionados por abas internas:

**Template A — Evolução de Paciente Crítico (por sistemas)**
- Data de admissão, local, motivo, diagnóstico principal, HDA
- HPP (comorbidades, alergias, cirurgias, medicações, hábitos)
- COVID-19 (TR + RT-PCR)
- Antibioticoterapia: lista dinâmica (droga, horário, status, data início)
- Dispositivos/Acessos: lista dinâmica (tipo, detalhes, data inserção, status) — opções: TOT, CVC, CVP, SVD, SNE, CNO2, Cateter Arterial, Dreno
- Evolução por sistemas (cada um com botão "Normal"):
  - NEURO (com botão atalho Glasgow)
  - SCV (com botão "Normal")
  - SR (com botão atalho CURB-65)
  - TGI
  - R/M (com botão atalho CKD-EPI)
  - H/I
  - Extremidades
- Exames complementares
- Condutas: checkboxes (vigilâncias neuro/hemo/infec/vent/renal, profilaxia TEV, aguardar vaga, família informada) + campo livre

**Template B — Admissão XABCDE (paciente crítico na entrada)**

Protocolo estruturado de avaliação primária:

- **[X] Hemorragia Exsanguinante:**
  - Status (sem hemorragia / hemorragia presente)
  - Local anatômico (se presente)
  - Terapêutica: 8 checkboxes (torniquete, compressa local, curativo oclusivo, tamponamento, bandagem, garrote, hemostasia cirúrgica, ácido tranexâmico) + campo de observações — visível apenas se "Hemorragia presente"

- **[A] Via Aérea:**
  - Status da perviedade
  - Sinais de obstrução
  - Dispositivos em uso

- **[B] Ventilação:**
  - FR, SpO2, suporte de O2
  - Padrão respiratório e ausculta
  - Toggle "Em ventilação mecânica" com campos: Modo, FiO2, PEEP, VC, FR ajustada, Pico de pressão, Observações

- **[C] Circulação:**
  - PAS, PAD, FC
  - Perfusão periférica, pulsos, ritmo
  - Toggle "DVA em uso" com lista dinâmica de drogas vasoativas (droga, vazão em mL/h, dose/obs)
  - **Calculadora DVA:** Peso (kg) + Concentração (mg/mL) + Vazão (mL/h) → resultado em mcg/kg/min
    - Fórmula: `(Conc. mg/mL × Vazão mL/h × 1000) / (Peso kg × 60)`

- **[D] Déficit Neurológico:**
  - Glasgow, pupilas, glicemia capilar, déficits focais
  - Toggle "Sedoanalgesia/BNM" com escalas:
    - **RASS** (de -5 a +4) — nível de sedação
    - **CAM-ICU** (positivo/negativo/não avaliável) — delirium
    - **BPS** (3 a 12) — dor em paciente intubado
    - **BNM** (contínuo TOF 0-2/4, bolus) — bloqueio neuromuscular
    - Drogas em uso / observações

- **[E] Exposição:**
  - Temperatura, lesões cutâneas/traumas, edemas e outros achados

- **Sinais Vitais Iniciais:** resumo completo (PA, FC, FR, SpO2, Temp, HGT)
- **Impressão Clínica:** gravidade estimada + hipótese sindrômica inicial
- **Condutas Imediatas:** O2, monitorização, acesso venoso, exames, medicações
- **HPP:** comorbidades, alergias, medicações, cirurgias, última alimentação, eventos recentes
- **Fonte das Informações**
- **Destino do Paciente**

#### Modo 3 — PA Clínica Médica (Pro)
Nota rápida de Pronto Atendimento com estrutura otimizada para velocidade. Seções:

- **IA do Consultório:** status da IA (ativada automático/manual, com problema, desligada) + local de atendimento
- **QP e HMA:** queixa principal, início, descrição do quadro, sinais de alarme negados (8 checkboxes)
- **AP — Antecedentes:** comorbidades, MUC (medicações em uso), alergias — campos pré-preenchidos com dados da identificação
- **Sinais Vitais:** PAS e PAD separados (dois campos numéricos, Tab entre eles), FC, FR, SpO2, Temp, HGT
- **Exame Físico:** Estado Geral, AP, AC, ABD, Outros achados — todos com botão "Normal" (texto adaptado ao sexo) + lista dinâmica de exames adicionais (nome + achado)
- **Avaliação (A):** busca CID-10 inline idêntica ao SOAP (banco local + API), chips de diagnósticos, campo livre para hipótese sem CID
- **Conduta (C):** 6 condutas-padrão como checkboxes (protocolo institucional, orientação ao paciente, sinais de alarme, etc.), campo livre adicional, toggle de atestado com número de dias

**Preview em tempo real** (painel direito, sticky): texto completo gerado automaticamente conforme os campos são preenchidos, incluindo identificação do paciente, hábitos de vida (da seção de identificação), sinais vitais, exame físico e diagnóstico.

---

### 2. Prescrições (`/prescricoes`)

Banco de prescrições médicas salvas no `localStorage` do navegador.
- Criar, visualizar, editar e excluir prescrições
- Busca por nome ou conteúdo
- Categorização por especialidade

---

### 3. Receituário (`/receituario`)

Gerador de receituário médico imprimível. Funcionalidades:
- **Dados do médico:** nome, CRM, UF, endereço — salvos em `localStorage`, persistem entre sessões
- **Logo:** suporte a URL externa (ibb.co/imgur) ou upload direto de PNG (convertido para base64 e salvo em `localStorage`)
- **Tipos de receituário:**
  - Simples (branco)
  - Especial (azul — psicotrópicos)
  - Atestado médico
- **Preview em tempo real** da impressão com logo e dados do médico
- **Impressão:** `window.print()` com CSS de impressão dedicado

---

## Calculadoras Clínicas

Acessíveis via botão "Calc" no header ou botões de atalho nos campos específicos. Total: 12 calculadoras.

| ID | Nome | Categoria |
|---|---|---|
| `ckd` | Filtro Glomerular (CKD-EPI 2021) | Nefrologia |
| `curb65` | CURB-65 (Pneumonia) | Pneumologia |
| `chads` | CHA2DS2-VASc | Cardiologia |
| `wells_tvp` | Escore de Wells (TVP) | Vascular |
| `wells_tep` | Escore de Wells (TEP) | Vascular |
| `glasgow` | Escala de Glasgow | Neurologia |
| `nihss` | NIHSS (AVC) | Neurologia |
| `imc` | IMC | Geral |
| `has_bled` | HAS-BLED | Cardiologia |
| `perc` | PERC Rule (TEP) | Vascular |
| `carga_tabagica` | Carga Tabágica (Anos-Maço) | Pneumologia |
| `carga_etilica` | Carga Etílica (g/dia) | Geral |

A calculadora de Filtro Glomerular (CKD-EPI) e Glasgow também aparecem como **atalhos inline** nas seções de exame físico/neurológico.

---

## Busca de CID-10

Dois contextos: SOAP (Avaliação) e PA Pro (Avaliação).

**Estratégia de busca (em ordem):**
1. **Banco local em português** — 250+ CIDs dos grupos mais comuns no PS, indexados por código, nome e palavras-chave. Busca por código (ex: `J06`) ou termo (ex: `pneumonia`, `gripe`).
2. **API NLM** (fallback) — `clinicaltables.nlm.nih.gov/api/icd10cm/v3/search` — resultados marcados com `(EN)` por estarem em inglês.

Resultado: dropdown com código + descrição, clique para adicionar como chip. Chips são removíveis. Campo livre disponível para hipóteses sem CID.

---

## Autenticação

- Cookie HTTP `auth_user` (httpOnly, secure, maxAge 1 dia)
- **Primário:** consulta tabela `users` no Cloudflare D1 (`SELECT * FROM users WHERE username = ? AND password = ?`)
- **Fallback:** se D1 indisponível, aceita `admin` / `medico123` hardcoded

---

## Geração de Texto

O botão "Copiar" (e o painel de preview) chama `generateText()` que despacha para o gerador correto conforme o modo ativo:

| `serviceType` | `utiTemplate` | Função chamada |
|---|---|---|
| `clinica` | — | `generateText()` inline (SOAP) |
| `salavermelha` | `evolucao` | `generateEvolucaoCritico()` |
| `salavermelha` | `xabcde` | `generateXABCDE()` |
| `pa_pro` | — | `generatePAPro()` |

Todos os textos gerados usam apenas hifens simples (`-`) — nunca em-dash (`—`) nem en-dash (`–`) — para compatibilidade com prontuários eletrônicos hospitalares que não suportam Unicode estendido.

---

## Botão Resetar

Disponível na navbar (ícone de borracha, cor âmbar). Limpa todos os campos de todos os formulários sem recarregar a página, mantendo apenas o **tipo de atendimento** e o **turno** selecionados.

---

## Desenvolvimento Local

```bash
# Instalar dependências
npm install

# Build
npm run build

# Iniciar servidor de desenvolvimento (PM2 + wrangler pages dev)
pm2 start ecosystem.config.cjs

# Testar
curl http://localhost:3000
# ou abrir http://localhost:3000 no navegador

# Verificar logs
pm2 logs webapp --nostream
```

---

## Deploy para Produção

```bash
# Build + deploy para Cloudflare Pages
npm run build
npx wrangler pages deploy dist --project-name plant-oguiado --branch main

# Push para GitHub
git add .
git commit -m "descrição"
git push origin main
```

---

## Variáveis de Ambiente / Segredos

| Variável | Uso | Onde configurar |
|---|---|---|
| `CLOUDFLARE_API_TOKEN` | Autenticação do wrangler | `~/.bashrc` (sandbox) |
| `auth_user` (cookie) | Sessão do usuário autenticado | Setado pelo servidor no login |

---

## Dependências Principais

**Runtime (CDN — não no bundle):**
- Alpine.js v3 — reatividade frontend
- Tailwind CSS — utilitários de estilo
- Font Awesome 6.4.0 — ícones
- Google Fonts Inter — tipografia

**npm (bundle):**
- `hono` — framework web edge
- `vite` — build tool
- `wrangler` — CLI Cloudflare
- `@hono/vite-build` — plugin de build para Cloudflare Pages

---

## Histórico de Versões (resumo)

| Commit | Feature |
|---|---|
| `04d9125` | Remove em-dash de todo texto copiável; PAS/PAD separados no PA Pro; botão Resetar |
| `b45d929` | PA Pro completo: sinais vitais, hábitos no preview, CID inline, Normal adaptativo por gênero, exames adicionais, DVA corrigido |
| `750bda5` | Upload e URL de logo no receituário com preview em tempo real |
| `0cc864e` | Ajustes de estilo e melhorias na interface |
| `ef4f9ee` | Correções finais no template XABCDE |
| `79eb18c` | Reformatação completa do template XABCDE |
| `9f6a6b3` | Implementação completa do protocolo XABCDE + título dinâmico |
| `963f89f` | Botão Sair em todas as páginas |
| `d820c79` | CSS customizado e inputs padronizados |

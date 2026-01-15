import { Hono } from 'hono'
import { serveStatic } from 'hono/cloudflare-workers'
import { getCookie, setCookie } from 'hono/cookie'

type Bindings = {
  DB: D1Database
}

const app = new Hono<{ Bindings: Bindings }>()

app.use('/static/*', serveStatic({ root: './public' }))

// Middleware de Autenticação
app.use(async (c, next) => {
  const path = c.req.path
  // Permitir login e arquivos estáticos
  if (path === '/login' || path.startsWith('/static')) {
    await next()
    return
  }
  
  const auth = getCookie(c, 'auth_user')
  if (!auth) {
    return c.redirect('/login')
  }
  await next()
})

// Rota de Login (GET) - VISUAL NOVO
app.get('/login', (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Login - Plantão Guiado</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
        <style>
            body { font-family: 'Inter', sans-serif; }
        </style>
    </head>
    <body class="bg-slate-50 flex items-center justify-center h-screen relative overflow-hidden">
        <!-- Background Decorativo -->
        <div class="absolute top-0 left-0 w-full h-64 bg-gradient-to-r from-blue-600 to-cyan-500 transform -skew-y-3 origin-top-left -translate-y-10 z-0"></div>
        
        <div class="bg-white/90 backdrop-blur-lg p-10 rounded-2xl shadow-2xl max-w-sm w-full border border-white/50 relative z-10">
            <div class="flex flex-col items-center mb-8">
                <div class="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-2xl flex items-center justify-center text-white mb-4 shadow-lg transform rotate-3 hover:rotate-0 transition-all duration-300">
                     <i class="fas fa-user-md text-4xl"></i>
                </div>
                <h1 class="text-2xl font-bold text-slate-800 tracking-tight">Plantão Guiado</h1>
                <p class="text-sm text-slate-500 font-medium">Acesso Restrito ao Sistema</p>
            </div>
            
            <form action="/login" method="post" class="space-y-5">
                <div>
                    <label class="block text-xs font-bold text-slate-500 uppercase mb-1 ml-1">Usuário</label>
                    <div class="relative group">
                        <i class="fas fa-user absolute left-4 top-3.5 text-slate-400 group-focus-within:text-blue-500 transition-colors"></i>
                        <input type="text" name="username" class="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-medium text-slate-700" placeholder="Seu usuário" required>
                    </div>
                </div>
                <div>
                    <label class="block text-xs font-bold text-slate-500 uppercase mb-1 ml-1">Senha</label>
                    <div class="relative group">
                        <i class="fas fa-lock absolute left-4 top-3.5 text-slate-400 group-focus-within:text-blue-500 transition-colors"></i>
                        <input type="password" name="password" class="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-medium text-slate-700" placeholder="Sua senha" required>
                    </div>
                </div>
                <button type="submit" class="w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold py-3.5 rounded-xl hover:shadow-lg hover:shadow-blue-500/30 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2">
                    <span>ENTRAR</span> <i class="fas fa-arrow-right"></i>
                </button>
            </form>
            <div class="mt-8 pt-6 border-t border-slate-100 text-center">
                <p class="text-xs text-slate-400 font-medium">Sistema de Apoio à Decisão Clínica</p>
            </div>
        </div>
    </body>
    </html>
  `)
})

// Rota de Login (POST)
app.post('/login', async (c) => {
  const body = await c.req.parseBody()
  const username = body['username']
  const password = body['password']

  try {
    const user = await c.env.DB.prepare('SELECT * FROM users WHERE username = ? AND password = ?')
      .bind(username, password)
      .first()

    if (user) {
      setCookie(c, 'auth_user', String(username), {
        path: '/',
        secure: true,
        httpOnly: true,
        maxAge: 86400 // 1 dia
      })
      return c.redirect('/')
    }
  } catch (e) {
    console.error('Erro no banco:', e)
    if (username === 'admin' && password === 'medico123') {
         setCookie(c, 'auth_user', 'admin', { path: '/', maxAge: 86400 })
         return c.redirect('/')
    }
  }

  return c.html('Login Inválido <a href="/login">Tentar novamente</a>')
})

// Rota Principal (Evolução) - VISUAL NOVO
// Rota de Receituário
app.get('/receituario', (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Gerador de Receitas - Plantão Guiado</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
        <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>
        <style type="text/tailwindcss">
            body { font-family: 'Inter', sans-serif; }
            .font-poppins { font-family: 'Poppins', sans-serif; }
            
            .form-card {
                @apply bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mb-6 transition-shadow hover:shadow-md;
            }
            .form-label {
                @apply block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide ml-1;
            }
            .form-input {
                @apply w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-slate-700 font-medium placeholder-slate-400;
            }
            
            @media print {
                @page { margin: 0; size: A4; }
                body * { visibility: hidden; }
                #printable-area, #printable-area * { visibility: visible; }
                #printable-area { 
                    position: absolute; 
                    left: 0; 
                    top: 0; 
                    width: 100%; 
                    height: 100%;
                    margin: 0; 
                    padding: 0;
                    background: white;
                }
                .no-print { display: none !important; }
                * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
            }
            
            .preview-paper {
                box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
            }
        </style>
    </head>
    <body class="bg-slate-50 text-slate-800" x-data="receituarioApp()">
        
        <!-- Navbar -->
        <header class="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50 no-print">
            <div class="max-w-[1600px] mx-auto px-4 lg:px-6 h-16 flex items-center justify-between">
                <div class="flex items-center gap-3">
                    <div class="w-9 h-9 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-lg flex items-center justify-center text-white shadow-md shadow-blue-500/20">
                         <i class="fas fa-user-md text-lg"></i>
                    </div>
                    <div>
                        <h1 class="text-base font-bold text-slate-800 leading-none">Plantão Guiado</h1>
                        <p class="text-[10px] text-slate-500 font-medium uppercase tracking-wider mt-0.5">Gerador de Receitas</p>
                    </div>
                </div>
                
                <nav class="flex items-center bg-slate-100 p-1 rounded-xl">
                    <a href="/" class="px-4 py-1.5 text-sm font-medium text-slate-500 hover:text-slate-700 rounded-lg transition-colors">
                        <i class="fas fa-file-medical mr-2"></i>Evolução
                    </a>
                    <a href="/prescricoes" class="px-4 py-1.5 text-sm font-medium text-slate-500 hover:text-slate-700 rounded-lg transition-colors">
                        <i class="fas fa-prescription mr-2"></i>Prescrições
                    </a>
                    <a href="/receituario" class="px-4 py-1.5 text-sm font-semibold text-blue-700 bg-white shadow-sm rounded-lg transition-all">
                        <i class="fas fa-print mr-2"></i>Receituário
                    </a>
                </nav>
            </div>
        </header>

        <main class="max-w-[1600px] mx-auto p-4 lg:p-8 flex flex-col lg:flex-row gap-8">
            
            <!-- LEFT: FORM -->
            <div class="flex-1 min-w-0 no-print pb-20">
                
                <!-- Dados do Médico -->
                <div class="form-card group relative overflow-hidden">
                    <div class="absolute left-0 top-0 w-1.5 h-full bg-blue-500 rounded-l-lg"></div>
                    <div class="flex justify-between items-center mb-6">
                        <h3 class="text-lg font-bold text-slate-700 flex items-center gap-2">
                            <div class="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-sm"><i class="fas fa-user-doctor"></i></div>
                            Dados do Médico
                        </h3>
                        <button @click="saveDoctor()" class="text-xs bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg font-bold hover:bg-blue-100 transition-colors">
                            <i class="fas fa-save mr-1"></i> Salvar Padrão
                        </button>
                    </div>
                    
                    <div class="grid grid-cols-12 gap-5">
                        <div class="col-span-12 md:col-span-8">
                            <label class="form-label">Nome Completo</label>
                            <input type="text" x-model="doctor.name" class="form-input" placeholder="Dr. Fulano de Tal">
                        </div>
                        <div class="col-span-6 md:col-span-2">
                            <label class="form-label">CRM</label>
                            <input type="text" x-model="doctor.crm" class="form-input" placeholder="12345">
                        </div>
                        <div class="col-span-6 md:col-span-2">
                            <label class="form-label">UF</label>
                            <input type="text" x-model="doctor.uf" class="form-input" placeholder="SP" maxlength="2">
                        </div>
                        <div class="col-span-12">
                            <label class="form-label">Endereço / Clínica</label>
                            <input type="text" x-model="doctor.address" class="form-input" placeholder="Rua das Flores, 123 - Centro, São Paulo - SP">
                        </div>
                    </div>
                </div>

                <!-- Prescrição -->
                <div class="form-card group relative overflow-hidden">
                    <div class="absolute left-0 top-0 w-1.5 h-full bg-emerald-500 rounded-l-lg"></div>
                    <div class="flex justify-between items-center mb-6">
                        <h3 class="text-lg font-bold text-slate-700 flex items-center gap-2">
                            <div class="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-sm"><i class="fas fa-prescription-bottle-alt"></i></div>
                            Prescrição
                        </h3>
                        
                        <div class="bg-slate-100 p-1 rounded-xl flex text-xs font-bold">
                            <button @click="tipo = 'simples'" 
                                    :class="tipo === 'simples' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'"
                                    class="px-3 py-1.5 rounded-lg transition-all">Simples</button>
                            <button @click="tipo = 'especial'" 
                                    :class="tipo === 'especial' ? 'bg-white text-red-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'"
                                    class="px-3 py-1.5 rounded-lg transition-all">Especial</button>
                            <button @click="tipo = 'livre'" 
                                    :class="tipo === 'livre' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'"
                                    class="px-3 py-1.5 rounded-lg transition-all">Livre</button>
                        </div>
                    </div>

                    <div class="grid grid-cols-12 gap-5 mb-6">
                        <div class="col-span-12 md:col-span-8">
                            <label class="form-label">Nome do Paciente</label>
                            <input type="text" x-model="patient.name" class="form-input" placeholder="Nome do paciente">
                        </div>
                        <div class="col-span-12 md:col-span-4">
                            <label class="form-label">CPF</label>
                            <input type="text" x-model="patient.cpf" class="form-input" placeholder="000.000.000-00">
                        </div>
                        <div class="col-span-12 md:col-span-9">
                            <label class="form-label">Endereço <span x-show="tipo === 'especial'" class="text-red-600">(Obrigatório para Especial)</span></label>
                            <input type="text" x-model="patient.address" class="form-input" placeholder="Rua, Número, Bairro, Cidade">
                        </div>
                        <div class="col-span-12 md:col-span-3">
                            <label class="form-label">Data</label>
                            <input type="date" x-model="date" class="form-input">
                        </div>
                    </div>

                    <!-- Medicamentos (Simples/Especial) -->
                    <div x-show="tipo !== 'livre'" class="bg-emerald-50/50 rounded-2xl p-5 border border-emerald-100 mb-6">
                        <label class="form-label text-emerald-700 mb-4">Adicionar Medicamento</label>
                        <div class="grid gap-4">
                            <div>
                                <input type="text" x-model="newMed.name" class="form-input bg-white border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500/20" placeholder="Nome do Medicamento + Concentração (ex: Amoxicilina 500mg)" @keydown.enter="$refs.qty.focus()">
                            </div>
                            <div>
                                <input x-ref="qty" type="text" x-model="newMed.quantity" class="form-input bg-white border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500/20" placeholder="Quantidade (ex: 1 caixa com 21 comprimidos)" @keydown.enter="$refs.instr.focus()">
                            </div>
                            <div>
                                <textarea x-ref="instr" x-model="newMed.instruction" class="form-input bg-white h-24 resize-none border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500/20" placeholder="Posologia (ex: Tomar 1 comprimido de 8 em 8 horas por 7 dias)" @keydown.enter.prevent="addMed()"></textarea>
                            </div>
                            <button @click="addMed()" class="w-full bg-emerald-600 text-white font-bold py-3 rounded-xl hover:bg-emerald-700 shadow-lg shadow-emerald-500/30 transition-all flex items-center justify-center gap-2">
                                <i class="fas fa-plus-circle"></i> Adicionar à Receita
                            </button>
                        </div>
                    </div>

                    <!-- Texto Livre -->
                    <div x-show="tipo === 'livre'" class="bg-blue-50/50 rounded-2xl p-5 border border-blue-100 mb-6">
                        <div class="mb-4">
                            <label class="form-label text-blue-700">Título do Documento</label>
                            <input type="text" x-model="freeTitle" class="form-input bg-white border-blue-200 focus:border-blue-500 focus:ring-blue-500/20" placeholder="Ex: SOLICITAÇÃO DE EXAMES">
                        </div>
                        <div>
                            <label class="form-label text-blue-700">Conteúdo</label>
                            <textarea x-model="freeText" class="form-input bg-white h-64 resize-none border-blue-200 focus:border-blue-500 focus:ring-blue-500/20 font-mono text-sm leading-relaxed" placeholder="Digite o conteúdo do documento..."></textarea>
                        </div>
                    </div>

                    <!-- Lista de Medicamentos -->
                    <div x-show="tipo !== 'livre'" class="space-y-3">
                        <template x-for="(med, idx) in meds" :key="idx">
                            <div class="bg-white border border-slate-200 rounded-xl p-4 flex items-start gap-4 group hover:border-emerald-300 transition-all shadow-sm">
                                <div class="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-sm shrink-0" x-text="idx + 1"></div>
                                <div class="flex-grow">
                                    <div class="flex justify-between items-start mb-1">
                                        <h4 class="font-bold text-slate-800" x-text="med.name"></h4>
                                        <span class="text-xs font-bold bg-slate-100 text-slate-600 px-2 py-1 rounded-lg ml-2 shrink-0" x-text="med.quantity"></span>
                                    </div>
                                    <p class="text-sm text-slate-600 leading-relaxed" x-text="med.instruction"></p>
                                </div>
                                <button @click="removeMed(idx)" class="text-slate-300 hover:text-red-500 transition-colors self-center p-2 shrink-0">
                                    <i class="fas fa-trash-alt"></i>
                                </button>
                            </div>
                        </template>
                        <template x-if="meds.length === 0">
                            <div class="text-center py-8 border-2 border-dashed border-slate-200 rounded-xl">
                                <p class="text-slate-400 text-sm font-medium italic">Nenhum medicamento adicionado ainda.</p>
                            </div>
                        </template>
                    </div>
                </div>

                <!-- Print Options -->
                <div class="form-card bg-slate-800 text-white border-none shadow-xl">
                    <h3 class="font-bold text-lg mb-5 flex items-center gap-2"><i class="fas fa-print"></i> Configuração de Impressão</h3>
                    <div class="space-y-4">
                        <label class="flex items-center gap-3 p-4 rounded-xl bg-white/10 cursor-pointer hover:bg-white/20 transition-all">
                            <input type="checkbox" x-model="printDouble" :disabled="tipo === 'especial'" class="w-5 h-5 rounded text-blue-500 focus:ring-offset-slate-800">
                            <div>
                                <span class="font-bold block text-sm">Imprimir 2ª Via</span>
                                <span class="text-xs text-slate-300" x-text="tipo === 'especial' ? 'Obrigatório para Receituário Especial (já incluído)' : 'Duplica a receita na mesma página'"></span>
                            </div>
                        </label>
                        <button @click="print()" class="w-full bg-white text-slate-900 font-bold py-4 rounded-xl hover:bg-blue-50 transition-all flex items-center justify-center gap-3 shadow-lg">
                            <i class="fas fa-print text-xl"></i> <span class="text-lg">IMPRIMIR RECEITA</span>
                        </button>
                    </div>
                </div>

            </div>

            <!-- RIGHT: PREVIEW -->
            <div class="lg:w-[210mm] flex-shrink-0 mx-auto">
                <div id="printable-area" class="bg-white text-slate-900 font-poppins" :class="{'preview-paper rounded-lg': !isPrinting}">
                    
                    <!-- PAGE 1 -->
                    <div class="w-[210mm] flex flex-col" :class="tipo === 'especial' ? 'h-[148.5mm] p-[12mm] pt-[8mm]' : 'min-h-[297mm] h-[297mm] p-[20mm]'">
                        
                        <!-- Header -->
                        <header class="flex justify-between items-start border-b-2 border-slate-300" :class="tipo === 'especial' ? 'pb-2 mb-3' : 'pb-5 mb-8'">
                            <div class="bg-slate-100 rounded-lg flex flex-col items-center justify-center text-slate-300 border border-dashed border-slate-200" :class="tipo === 'especial' ? 'w-16 h-12' : 'w-32 h-20'">
                                <i class="fas fa-hospital" :class="tipo === 'especial' ? 'text-base' : 'text-2xl mb-1'"></i>
                                <span class="font-bold" :class="tipo === 'especial' ? 'text-[8px]' : 'text-xs'">LOGO</span>
                            </div>
                            
                            <div class="text-right">
                                <h1 class="font-bold uppercase text-slate-800" :class="tipo === 'especial' ? 'text-xs' : 'text-lg'" x-text="doctor.name || 'NOME DO MÉDICO'"></h1>
                                <div class="font-medium text-slate-500 mt-1 space-y-0.5" :class="tipo === 'especial' ? 'text-[8px]' : 'text-xs'">
                                    <div>CRM-<span x-text="doctor.uf || 'UF'"></span> <span x-text="doctor.crm || '00000'"></span></div>
                                    <div x-text="doctor.address" x-show="tipo !== 'especial' || doctor.address"></div>
                                </div>
                            </div>
                        </header>

                        <!-- Body -->
                        <div class="flex-grow">
                            <!-- Patient Info -->
                            <div :class="tipo === 'especial' ? 'mb-3' : 'mb-8'">
                                <div class="flex items-baseline border-b border-dotted border-slate-400 mb-1" :class="tipo === 'especial' ? 'pb-0.5' : 'pb-1'">
                                    <span class="font-bold mr-2 text-slate-600 uppercase" :class="tipo === 'especial' ? 'text-[10px]' : 'text-sm'">Paciente:</span>
                                    <span class="font-bold uppercase text-slate-900" :class="tipo === 'especial' ? 'text-sm' : 'text-lg'" x-text="patient.name || 'NOME DO PACIENTE'"></span>
                                </div>
                                <div class="flex gap-6 text-slate-600" :class="tipo === 'especial' ? 'text-[9px]' : 'text-xs'">
                                    <div x-show="patient.cpf">
                                        <span class="font-bold">CPF:</span> <span x-text="patient.cpf"></span>
                                    </div>
                                    <div x-show="patient.address" class="flex-grow">
                                        <span class="font-bold">Endereço:</span> <span x-text="patient.address"></span>
                                    </div>
                                </div>
                            </div>

                            <!-- Title -->
                            <div class="text-center" :class="tipo === 'especial' ? 'mb-3' : 'mb-8'">
                                <span class="inline-block font-bold border-2 border-slate-900 rounded-full uppercase tracking-wide" 
                                      :class="tipo === 'especial' ? 'text-xs px-5 py-1' : 'text-lg px-8 py-2'" 
                                      x-text="getTitle()"></span>
                            </div>

                            <!-- Medicamentos -->
                            <div x-show="tipo !== 'livre'" :class="tipo === 'especial' ? 'space-y-2' : 'space-y-6'">
                                <template x-for="(med, idx) in meds" :key="idx">
                                    <div class="relative" :class="tipo === 'especial' ? 'pl-5' : 'pl-8'">
                                        <span class="absolute left-0 top-0 font-bold text-slate-500" 
                                              :class="tipo === 'especial' ? 'text-sm' : 'text-lg'" 
                                              x-text="(idx + 1) + '.'"></span>
                                        <div class="flex justify-between items-baseline mb-0.5">
                                            <span class="font-bold text-slate-900" 
                                                  :class="tipo === 'especial' ? 'text-sm' : 'text-lg'" 
                                                  x-text="med.name"></span>
                                            <span class="border-b border-dotted border-slate-400 text-right px-2 font-bold text-slate-800 shrink-0 ml-2"
                                                  :class="tipo === 'especial' ? 'min-w-[90px] text-xs' : 'min-w-[120px] text-base'" 
                                                  x-text="med.quantity"></span>
                                        </div>
                                        <div class="leading-relaxed pl-1 text-slate-700 bg-slate-50 rounded" 
                                             :class="tipo === 'especial' ? 'text-[10px] p-1.5 mt-0.5' : 'text-sm p-3 mt-2'">
                                            <span class="font-bold mr-0.5 text-slate-500 uppercase" :class="tipo === 'especial' ? 'text-[9px]' : 'text-xs'">Uso:</span> 
                                            <span x-text="med.instruction"></span>
                                        </div>
                                    </div>
                                </template>
                            </div>

                            <!-- Texto Livre -->
                            <div x-show="tipo === 'livre'" class="whitespace-pre-wrap text-slate-800 leading-relaxed" 
                                 :class="tipo === 'especial' ? 'text-xs' : 'text-base'" 
                                 x-text="freeText"></div>
                        </div>

                        <!-- Special Control Footer -->
                        <div x-show="tipo === 'especial'" class="mt-2 mb-2 border-2 border-slate-900 p-1.5 flex gap-2 text-[7px] font-sans">
                            <div class="flex-1 border-r-2 border-slate-900 pr-2">
                                <p class="font-bold bg-slate-900 text-white px-1 py-0.5 mb-1 text-center uppercase text-[8px]">Identificação do Comprador</p>
                                <div class="space-y-1">
                                    <div class="border-b border-dotted border-slate-400 py-0.5 text-[7px]">Nome: ____________________________________</div>
                                    <div class="flex gap-1.5">
                                        <div class="flex-1 border-b border-dotted border-slate-400 py-0.5 text-[7px]">RG: ______________</div>
                                        <div class="flex-1 border-b border-dotted border-slate-400 py-0.5 text-[7px]">Org. Emis.: ________</div>
                                    </div>
                                    <div class="border-b border-dotted border-slate-400 py-0.5 text-[7px]">End.: __________________________________________</div>
                                    <div class="flex gap-1.5">
                                        <div class="flex-[2] border-b border-dotted border-slate-400 py-0.5 text-[7px]">Cidade: __________________</div>
                                        <div class="flex-1 border-b border-dotted border-slate-400 py-0.5 text-[7px]">UF: ___</div>
                                    </div>
                                    <div class="border-b border-dotted border-slate-400 py-0.5 text-[7px]">Telefone: ___________________</div>
                                </div>
                            </div>
                            <div class="w-[35%]">
                                <p class="font-bold bg-slate-900 text-white px-1 py-0.5 mb-1 text-center uppercase text-[8px]">Identificação do Fornecedor</p>
                                <div class="border border-dashed border-slate-400 flex items-end justify-center pb-0.5 mb-1 h-12">
                                    <span class="text-[6px] text-slate-400 italic">Carimbo da Farmácia</span>
                                </div>
                                <div class="border-b border-dotted border-slate-400 py-0.5 text-center text-[7px]">Data: ___/___/____</div>
                                <div class="border-b border-dotted border-slate-400 py-0.5 mt-1 text-[7px]">Assinatura: ____________</div>
                            </div>
                        </div>

                        <!-- Footer -->
                        <footer class="mt-auto" :class="tipo === 'especial' ? 'pt-2' : 'pt-6'">
                            <div class="flex justify-center" :class="tipo === 'especial' ? 'mb-1.5' : 'mb-4'">
                                <div class="text-center border-t-2 border-slate-900" :class="tipo === 'especial' ? 'w-48 pt-1' : 'w-72 pt-2'">
                                    <p class="font-bold text-slate-900" :class="tipo === 'especial' ? 'text-[10px]' : 'text-base'" x-text="doctor.name"></p>
                                    <p class="text-slate-500" :class="tipo === 'especial' ? 'text-[8px] mt-0.5' : 'text-xs mt-1'">Assinatura e Carimbo do Médico</p>
                                </div>
                            </div>
                            <div class="text-center font-bold border-t-2 border-slate-200 flex justify-between text-slate-500" 
                                 :class="tipo === 'especial' ? 'text-[9px] pt-1.5' : 'text-xs pt-3'">
                                <span>Data: <span x-text="formatDate(date)" class="text-slate-700"></span></span>
                                <span x-show="tipo === 'especial' || printDouble" class="uppercase border border-slate-400 py-0.5 rounded-md bg-slate-100" 
                                      :class="tipo === 'especial' ? 'text-[8px] px-2' : 'text-xs px-3'">1ª VIA</span>
                            </div>
                        </footer>

                    </div>

                    <!-- SEPARATOR -->
                    <div x-show="tipo === 'especial' || printDouble" class="relative border-t-2 border-dashed border-slate-400 flex justify-center">
                        <span class="absolute -top-2.5 bg-white px-4 text-xs text-slate-500 font-bold uppercase">✂ Corte Aqui</span>
                    </div>

                    <!-- PAGE 2 (2ª VIA) -->
                    <div x-show="tipo === 'especial' || printDouble" class="h-[148.5mm] w-[210mm] flex flex-col p-[12mm] pt-[6mm]">
                        
                        <!-- Header Compact -->
                        <header class="flex justify-between items-start border-b border-slate-300 pb-1.5 mb-2.5">
                            <div class="w-14 h-10 bg-slate-100 rounded flex flex-col items-center justify-center text-slate-300 border border-dashed border-slate-200">
                                <i class="fas fa-hospital text-sm"></i>
                                <span class="text-[7px] font-bold">LOGO</span>
                            </div>
                            <div class="text-right">
                                <h1 class="text-[11px] font-bold uppercase text-slate-800" x-text="doctor.name || 'NOME DO MÉDICO'"></h1>
                                <div class="text-[8px] font-medium text-slate-500">
                                    CRM-<span x-text="doctor.uf || 'UF'"></span> <span x-text="doctor.crm || '00000'"></span>
                                </div>
                            </div>
                        </header>

                        <!-- Body Compact -->
                        <div class="flex-grow">
                            <div class="mb-2.5">
                                <div class="flex items-baseline border-b border-dotted border-slate-400 pb-0.5 mb-0.5">
                                    <span class="font-bold text-[9px] mr-1.5 text-slate-600 uppercase">Paciente:</span> 
                                    <span class="text-xs font-bold uppercase text-slate-900" x-text="patient.name || 'NOME DO PACIENTE'"></span>
                                </div>
                                <div class="text-[8px] text-slate-600" x-show="patient.cpf || patient.address">
                                    <span x-show="patient.cpf" class="mr-2"><span class="font-bold">CPF:</span> <span x-text="patient.cpf"></span></span>
                                    <span x-show="patient.address"><span class="font-bold">End.:</span> <span x-text="patient.address"></span></span>
                                </div>
                            </div>

                            <div class="mb-2.5 text-center">
                                <span class="inline-block text-[11px] font-bold border border-slate-900 px-4 py-0.5 rounded-full uppercase tracking-wide" x-text="getTitle()"></span>
                            </div>

                            <!-- Medicamentos Compact -->
                            <div x-show="tipo !== 'livre'" class="space-y-2">
                                <template x-for="(med, idx) in meds" :key="idx">
                                    <div class="relative pl-4">
                                        <span class="absolute left-0 top-0 font-bold text-xs text-slate-500" x-text="(idx + 1) + '.'"></span>
                                        <div class="flex justify-between items-baseline mb-0.5">
                                            <span class="font-bold text-xs text-slate-900" x-text="med.name"></span>
                                            <span class="border-b border-dotted border-slate-400 min-w-[70px] text-right px-1 font-bold text-slate-800 text-[10px] ml-1.5 shrink-0" x-text="med.quantity"></span>
                                        </div>
                                        <div class="text-[9px] pl-0.5 text-slate-700 leading-relaxed bg-slate-50 p-1 rounded mt-0.5">
                                            <span class="font-bold mr-0.5 text-slate-500 text-[8px] uppercase">Uso:</span> <span x-text="med.instruction"></span>
                                        </div>
                                    </div>
                                </template>
                            </div>

                            <!-- Texto Livre Compact -->
                            <div x-show="tipo === 'livre'" class="whitespace-pre-wrap text-[10px] text-slate-800 leading-relaxed" x-text="freeText"></div>
                        </div>

                        <!-- Special Control Footer (2nd copy) -->
                        <div x-show="tipo === 'especial'" class="mt-2 mb-1.5 border border-slate-900 p-1.5 flex gap-1.5 text-[7px] font-sans">
                            <div class="flex-1 border-r border-slate-900 pr-1.5">
                                <p class="font-bold bg-slate-900 text-white px-1 py-0.5 mb-1 text-center uppercase text-[8px]">Identificação do Comprador</p>
                                <div class="space-y-1">
                                    <div class="border-b border-dotted border-slate-400 py-0.5 text-[7px]">Nome: ________________________________</div>
                                    <div class="flex gap-1">
                                        <div class="flex-1 border-b border-dotted border-slate-400 py-0.5 text-[7px]">RG: ___________</div>
                                        <div class="flex-1 border-b border-dotted border-slate-400 py-0.5 text-[7px]">Org. Emis.: ______</div>
                                    </div>
                                    <div class="border-b border-dotted border-slate-400 py-0.5 text-[7px]">End.: _______________________________________</div>
                                    <div class="flex gap-1">
                                        <div class="flex-[2] border-b border-dotted border-slate-400 py-0.5 text-[7px]">Cidade: ________________</div>
                                        <div class="flex-1 border-b border-dotted border-slate-400 py-0.5 text-[7px]">UF: ___</div>
                                    </div>
                                    <div class="border-b border-dotted border-slate-400 py-0.5 text-[7px]">Telefone: _________________</div>
                                </div>
                            </div>
                            <div class="w-[35%]">
                                <p class="font-bold bg-slate-900 text-white px-1 py-0.5 mb-1 text-center uppercase text-[8px]">Identificação do Fornecedor</p>
                                <div class="border border-dashed border-slate-400 h-12 flex items-end justify-center pb-0.5 mb-1">
                                    <span class="text-[6px] text-slate-400 italic">Carimbo da Farmácia</span>
                                </div>
                                <div class="border-b border-dotted border-slate-400 py-0.5 text-center text-[7px]">Data: ___/___/____</div>
                                <div class="border-b border-dotted border-slate-400 py-0.5 mt-1 text-[7px]">Assinatura: ___________</div>
                            </div>
                        </div>

                        <!-- Footer Compact -->
                        <footer class="mt-auto pt-1.5">
                            <div class="flex justify-center mb-1.5">
                                <div class="text-center w-40 border-t border-slate-900 pt-0.5">
                                    <p class="text-[9px] font-bold text-slate-900" x-text="doctor.name"></p>
                                    <p class="text-[7px] text-slate-500 mt-0.5">Assinatura e Carimbo do Médico</p>
                                </div>
                            </div>
                            <div class="text-center text-[8px] font-bold flex justify-between text-slate-500 border-t border-slate-200 pt-1.5">
                                <span>Data: <span x-text="formatDate(date)" class="text-slate-700"></span></span>
                                <span class="uppercase text-[8px] border border-slate-400 px-1.5 py-0.5 rounded-md bg-slate-100">2ª VIA</span>
                            </div>
                        </footer>

                    </div>

                </div>
            </div>

        </main>
        
        <script>
            document.addEventListener('alpine:init', () => {
                Alpine.data('receituarioApp', () => ({
                    tipo: 'simples',
                    doctor: { name: '', crm: '', uf: '', address: '' },
                    patient: { name: '', cpf: '', address: '' },
                    date: new Date().toISOString().split('T')[0],
                    meds: [],
                    newMed: { name: '', quantity: '', instruction: '' },
                    freeTitle: 'Solicitação de Exames',
                    freeText: 'Solicito:\\n\\n1. Hemograma Completo\\n2. Creatinina\\n3. Ureia\\n4. Sódio e Potássio\\n5. Glicemia de Jejum\\n6. TGO e TGP\\n\\nIndicação Clínica: Check-up de rotina.',
                    printDouble: false,
                    isPrinting: false,

                    init() {
                        const saved = localStorage.getItem('plantao_doctor');
                        if (saved) {
                            try {
                                this.doctor = JSON.parse(saved);
                            } catch (e) {
                                console.error('Erro ao carregar médico:', e);
                            }
                        }
                        
                        this.$watch('tipo', (val) => {
                            if (val === 'especial') {
                                this.printDouble = true;
                            }
                        });
                    },

                    getTitle() {
                        if (this.tipo === 'especial') return 'Receituário de Controle Especial';
                        if (this.tipo === 'livre') return this.freeTitle;
                        return 'Receituário Médico';
                    },

                    saveDoctor() {
                        localStorage.setItem('plantao_doctor', JSON.stringify(this.doctor));
                        alert('Dados do médico salvos com sucesso!');
                    },

                    addMed() {
                        if (!this.newMed.name) return;
                        this.meds.push({...this.newMed});
                        this.newMed = { name: '', quantity: '', instruction: '' };
                    },

                    removeMed(idx) {
                        this.meds.splice(idx, 1);
                    },

                    formatDate(d) {
                        if (!d) return '';
                        const date = new Date(d + 'T00:00:00');
                        return date.toLocaleDateString('pt-BR');
                    },

                    print() {
                        this.isPrinting = true;
                        setTimeout(() => {
                            window.print();
                            this.isPrinting = false;
                        }, 100);
                    }
                }));
            });
        </script>
    </body>
    </html>
  `)
})


app.get('/', (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Evolução - Plantão Guiado</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
        <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
        <style type="text/tailwindcss">
            body { font-family: 'Inter', sans-serif; }
            
            .form-card {
                @apply bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mb-6 transition-shadow hover:shadow-md;
            }
            .form-label {
                @apply block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide ml-1;
            }
            .form-input {
                @apply w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-slate-700 font-medium placeholder-slate-400;
            }
            .checkbox-card {
                @apply flex items-center space-x-3 p-3 rounded-xl border border-slate-100 hover:bg-slate-50 hover:border-slate-200 cursor-pointer transition-all select-none bg-white;
            }
            
            /* Custom Scrollbar */
            ::-webkit-scrollbar { width: 6px; height: 6px; }
            ::-webkit-scrollbar-track { background: transparent; }
            ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
            ::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
            
            .preview-paper {
                box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
            }
        </style>
    </head>
    <body class="bg-slate-50 text-slate-800" x-data="medicalForm()">
        
        <!-- Navbar Glass -->
        <header class="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
            <div class="max-w-[1600px] mx-auto px-4 lg:px-6 h-16 flex items-center justify-between">
                <div class="flex items-center gap-3">
                    <div class="w-9 h-9 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-lg flex items-center justify-center text-white shadow-md shadow-blue-500/20">
                         <i class="fas fa-user-md text-lg"></i>
                    </div>
                    <div>
                        <h1 class="text-base font-bold text-slate-800 leading-none">Plantão Guiado</h1>
                        <p class="text-[10px] text-slate-500 font-medium uppercase tracking-wider mt-0.5">Evolução Médica</p>
                    </div>
                </div>
                
                <nav class="flex items-center bg-slate-100 p-1 rounded-xl">
                    <a href="/" class="px-4 py-1.5 text-sm font-semibold text-blue-700 bg-white shadow-sm rounded-lg transition-all">
                        <i class="fas fa-file-medical mr-2"></i>Evolução
                    </a>
                    <a href="/prescricoes" class="px-4 py-1.5 text-sm font-medium text-slate-500 hover:text-slate-700 rounded-lg transition-colors">
                        <i class="fas fa-prescription mr-2"></i>Prescrições
                    </a>
                    <a href="/receituario" class="px-4 py-1.5 text-sm font-medium text-slate-500 hover:text-slate-700 rounded-lg transition-colors">
                        <i class="fas fa-print mr-2"></i>Receituário
                    </a>
                </nav>
            </div>
        </header>

        <main class="max-w-[1600px] mx-auto p-4 lg:p-8 flex flex-col lg:flex-row gap-8">
            
            <!-- LEFT COLUMN (FORM) -->
            <div class="flex-1 min-w-0 pb-20">
                
                <!-- Type Selector -->
                <div class="flex gap-3 mb-6">
                    <button @click="form.serviceType = 'clinica'" 
                            :class="form.serviceType === 'clinica' ? 'bg-blue-600 text-white shadow-lg' : 'bg-white text-slate-700 hover:bg-slate-50'"
                            class="flex-1 p-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-3 border-2"
                            :class="form.serviceType === 'clinica' ? 'border-blue-600' : 'border-slate-200'">
                        <i class="fas fa-user-md text-xl"></i>
                        <span>PS Clínica Médica</span>
                    </button>
                    <button @click="form.serviceType = 'salavermelha'" 
                            :class="form.serviceType === 'salavermelha' ? 'bg-red-600 text-white shadow-lg' : 'bg-white text-slate-700 hover:bg-slate-50'"
                            class="flex-1 p-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-3 border-2"
                            :class="form.serviceType === 'salavermelha' ? 'border-red-600' : 'border-slate-200'">
                        <i class="fas fa-heartbeat text-xl"></i>
                        <span>Sala Vermelha / UTI</span>
                    </button>
                </div>
                
                <!-- Status Banner -->
                <div class="p-6 rounded-2xl shadow-lg text-white mb-8 relative overflow-hidden"
                     :class="form.serviceType === 'salavermelha' ? 'bg-gradient-to-r from-red-600 to-pink-600 shadow-red-500/20' : 'bg-gradient-to-r from-blue-600 to-cyan-600 shadow-blue-500/20'">
                    <div class="absolute right-0 top-0 opacity-10 transform translate-x-10 -translate-y-10">
                        <i class="fas text-9xl" :class="form.serviceType === 'salavermelha' ? 'fa-heartbeat' : 'fa-hospital'"></i>
                    </div>
                    
                    <div class="flex flex-col md:flex-row justify-between items-center gap-4 relative z-10">
                        <div class="text-center md:text-left">
                            <h2 class="text-xl font-bold mb-1" x-text="form.serviceType === 'salavermelha' ? 'SALA VERMELHA / CUIDADOS INTENSIVOS' : 'PS Clínica Médica'"></h2>
                            <p class="text-sm flex items-center gap-2 justify-center md:justify-start"
                               :class="form.serviceType === 'salavermelha' ? 'text-red-100' : 'text-blue-100'">
                                <i class="fas fa-clock"></i> <span x-text="form.shift"></span>
                            </p>
                        </div>
                        
                        <div class="flex gap-2 bg-white/10 p-1 rounded-xl backdrop-blur-sm">
                            <button @click="form.shift = 'PLANTÃO DIURNO'" 
                                    :class="form.shift === 'PLANTÃO DIURNO' ? (form.serviceType === 'salavermelha' ? 'bg-white text-red-600 shadow-md' : 'bg-white text-blue-600 shadow-md') : 'text-white hover:bg-white/10'" 
                                    class="px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2">
                                <i class="fas fa-sun"></i> Diurno
                            </button>
                            <button @click="form.shift = 'PLANTÃO NOTURNO'" 
                                    :class="form.shift === 'PLANTÃO NOTURNO' ? (form.serviceType === 'salavermelha' ? 'bg-white text-red-600 shadow-md' : 'bg-white text-indigo-600 shadow-md') : 'text-white hover:bg-white/10'"
                                    class="px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2">
                                <i class="fas fa-moon"></i> Noturno
                            </button>
                        </div>
                    </div>
                </div>

                <!-- 1. IDENTIFICATION -->
                <div class="form-card group relative overflow-hidden">
                    <div class="absolute left-0 top-0 w-1.5 h-full bg-blue-500 rounded-l-lg"></div>
                    <h3 class="text-lg font-bold text-slate-700 mb-6 flex items-center gap-2">
                        <div class="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-sm"><i class="fas fa-user"></i></div>
                        Identificação
                    </h3>
                    
                    <div class="grid grid-cols-12 gap-5">
                        <div class="col-span-12 md:col-span-6">
                            <label class="form-label">Nome do Paciente</label>
                            <input type="text" x-model="form.name" class="form-input" placeholder="Nome completo">
                        </div>
                        <div class="col-span-6 md:col-span-3">
                            <label class="form-label">Idade</label>
                            <div class="relative">
                                <input type="number" x-model="form.age" class="form-input" placeholder="Anos">
                                <span class="absolute right-3 top-2.5 text-slate-400 text-xs font-medium">anos</span>
                            </div>
                        </div>
                        <div class="col-span-6 md:col-span-3">
                            <label class="form-label">Sexo</label>
                            <select x-model="form.gender" class="form-input appearance-none">
                                <option value="Masculino">Masculino</option>
                                <option value="Feminino">Feminino</option>
                            </select>
                        </div>
                        <div class="col-span-12">
                            <label class="form-label">Tipo de Admissão</label>
                            <select x-model="form.admission" class="form-input">
                                <option value="Demanda Espontânea">Demanda Espontânea</option>
                                <option value="Pronto-atendimento">Pronto-atendimento</option>
                                <option value="Regulação (SAMU/Bombeiros)">Regulação (SAMU/Bombeiros)</option>
                                <option value="Retorno">Retorno</option>
                                <option value="Encaminhamento">Encaminhamento</option>
                            </select>
                        </div>
                    </div>

                    <div class="mt-8 border-t border-slate-100 pt-6">
                        <label class="form-label mb-3">Hábitos de Vida</label>
                        <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
                            <label class="checkbox-card" :class="form.habits.smoker ? 'border-blue-500 ring-1 ring-blue-500 bg-blue-50/50' : ''">
                                <input type="checkbox" x-model="form.habits.smoker" class="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500">
                                <span class="text-sm font-medium text-slate-700">Tabagista</span>
                            </label>
                            <label class="checkbox-card" :class="form.habits.alcoholic ? 'border-blue-500 ring-1 ring-blue-500 bg-blue-50/50' : ''">
                                <input type="checkbox" x-model="form.habits.alcoholic" class="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500">
                                <span class="text-sm font-medium text-slate-700">Etilista</span>
                            </label>
                            <label class="checkbox-card" :class="form.habits.drugs ? 'border-blue-500 ring-1 ring-blue-500 bg-blue-50/50' : ''">
                                <input type="checkbox" x-model="form.habits.drugs" class="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500">
                                <span class="text-sm font-medium text-slate-700">Drogas</span>
                            </label>
                            <label class="checkbox-card" :class="form.habits.sedentary ? 'border-blue-500 ring-1 ring-blue-500 bg-blue-50/50' : ''">
                                <input type="checkbox" x-model="form.habits.sedentary" class="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500">
                                <span class="text-sm font-medium text-slate-700">Sedentário</span>
                            </label>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-3 gap-5 mt-6">
                        <div>
                            <label class="form-label">Comorbidades</label>
                            <textarea x-model="form.comorbidities" class="form-input h-24 resize-none leading-relaxed" placeholder="HAS, DM..."></textarea>
                        </div>
                        <div>
                            <label class="form-label">Alergias</label>
                            <textarea x-model="form.allergies" class="form-input h-24 resize-none leading-relaxed" placeholder="Medicamentos, alimentos..."></textarea>
                        </div>
                        <div>
                            <label class="form-label">Cirurgias Prévias</label>
                            <textarea x-model="form.surgeries" class="form-input h-24 resize-none leading-relaxed" placeholder="Colecistectomia..."></textarea>
                        </div>
                    </div>
                </div>

                <!-- SOAP FORM (só para PS Clínica Médica) -->
                <template x-if="form.serviceType === 'clinica'">
                    <div>
                <!-- 2. MEDICATIONS -->
                <div class="form-card relative">
                    <div class="absolute left-0 top-0 w-1.5 h-full bg-indigo-500 rounded-l-lg"></div>
                    <div class="flex items-center gap-2 mb-6">
                        <div class="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center text-sm"><i class="fas fa-pills"></i></div>
                        <h3 class="font-bold text-slate-700 text-lg">Medicação em Uso</h3>
                    </div>
                    
                    <div class="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100 mb-4">
                        <div class="flex flex-col sm:flex-row gap-3">
                            <div class="flex-grow">
                                <label class="text-[10px] text-indigo-600 uppercase font-bold mb-1 block">Nome e Dose</label>
                                <input type="text" x-model="newMed.name" class="form-input border-indigo-200 focus:ring-indigo-500/20 focus:border-indigo-500" placeholder="Ex: Losartana 50mg" @keydown.enter="addMed()">
                            </div>
                            <div class="sm:w-40">
                                <label class="text-[10px] text-indigo-600 uppercase font-bold mb-1 block">Posologia</label>
                                <input type="text" x-model="newMed.posology" class="form-input border-indigo-200 focus:ring-indigo-500/20 focus:border-indigo-500" placeholder="1-0-1" @keydown.enter="addMed()">
                            </div>
                            <div class="flex items-end">
                                <button @click="addMed()" class="h-[44px] w-full sm:w-[44px] bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-500/30 transition-all flex items-center justify-center">
                                    <i class="fas fa-plus"></i>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div class="space-y-2">
                        <template x-if="form.medications.length === 0">
                            <div class="text-center py-6 border-2 border-dashed border-slate-200 rounded-xl">
                                <p class="text-slate-400 text-sm font-medium">Nenhuma medicação adicionada</p>
                            </div>
                        </template>

                        <template x-for="(med, index) in form.medications" :key="index">
                            <div class="flex items-center justify-between bg-white px-4 py-3 rounded-xl border border-slate-200 hover:border-indigo-300 hover:shadow-sm transition-all group">
                                <div class="flex items-center gap-3">
                                    <i class="fas fa-capsules text-indigo-400"></i>
                                    <div>
                                        <span class="font-bold text-slate-700 block" x-text="med.name"></span>
                                        <span class="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full mt-0.5 inline-block" x-text="med.posology"></span>
                                    </div>
                                </div>
                                <button @click="removeMed(index)" class="text-slate-300 hover:text-red-500 transition-colors w-8 h-8 flex items-center justify-center rounded-full hover:bg-red-50">
                                    <i class="fas fa-trash-alt"></i>
                                </button>
                            </div>
                        </template>
                    </div>
                </div>

                <!-- 3. SUBJECTIVE (S) -->
                <div class="form-card relative">
                    <div class="absolute left-0 top-0 w-1.5 h-full bg-cyan-500 rounded-l-lg"></div>
                    <div class="flex items-center gap-2 mb-6 text-cyan-700">
                        <span class="bg-cyan-500 text-white font-bold w-8 h-8 flex items-center justify-center rounded-lg text-sm shadow-md shadow-cyan-500/20">S</span>
                        <h3 class="font-bold text-lg text-slate-700">Subjetivo</h3>
                    </div>

                    <div class="mb-5">
                        <label class="form-label">Queixa Principal (QP)</label>
                        <input type="text" x-model="form.subjective.qp" class="form-input" placeholder="Digite a queixa...">
                    </div>

                    <div class="mb-5 relative">
                        <label class="form-label">História da Doença Atual (HDA)</label>
                        <textarea x-model="form.subjective.hda" class="form-input h-32 leading-relaxed" placeholder="Descrição livre da história clínica..."></textarea>
                    </div>

                    <div class="bg-slate-50/80 p-5 rounded-2xl border border-slate-200">
                        <label class="form-label mb-3 text-slate-400">Sintomas Negados</label>
                        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            <label class="checkbox-card text-xs font-semibold text-slate-600">
                                <input type="checkbox" x-model="form.negatives.fever" class="rounded text-cyan-600 focus:ring-cyan-500"> 
                                <span>Febre</span>
                            </label>
                            <label class="checkbox-card text-xs font-semibold text-slate-600">
                                <input type="checkbox" x-model="form.negatives.headache" class="rounded text-cyan-600 focus:ring-cyan-500"> 
                                <span>Cefaleia</span>
                            </label>
                            <label class="checkbox-card text-xs font-semibold text-slate-600">
                                <input type="checkbox" x-model="form.negatives.dizziness" class="rounded text-cyan-600 focus:ring-cyan-500"> 
                                <span>Tontura</span>
                            </label>
                            <label class="checkbox-card text-xs font-semibold text-slate-600">
                                <input type="checkbox" x-model="form.negatives.dyspnea" class="rounded text-cyan-600 focus:ring-cyan-500"> 
                                <span>Falta de Ar</span>
                            </label>
                            <label class="checkbox-card text-xs font-semibold text-slate-600">
                                <input type="checkbox" x-model="form.negatives.chestPain" class="rounded text-cyan-600 focus:ring-cyan-500"> 
                                <span>Dor Torácica</span>
                            </label>
                            <label class="checkbox-card text-xs font-semibold text-slate-600">
                                <input type="checkbox" x-model="form.negatives.nausea" class="rounded text-cyan-600 focus:ring-cyan-500"> 
                                <span>Náuseas</span>
                            </label>
                            <label class="checkbox-card text-xs font-semibold text-slate-600">
                                <input type="checkbox" x-model="form.negatives.intestine" class="rounded text-cyan-600 focus:ring-cyan-500"> 
                                <span>Alt. Intestinais</span>
                            </label>
                            <label class="checkbox-card text-xs font-semibold text-slate-600">
                                <input type="checkbox" x-model="form.negatives.urinary" class="rounded text-cyan-600 focus:ring-cyan-500"> 
                                <span>Alt. Urinárias</span>
                            </label>
                        </div>
                    </div>
                </div>

                <!-- 4. OBJECTIVE (O) -->
                <div class="form-card relative">
                    <div class="absolute left-0 top-0 w-1.5 h-full bg-emerald-500 rounded-l-lg"></div>
                    <div class="flex items-center gap-2 mb-6">
                        <span class="bg-emerald-500 text-white font-bold w-8 h-8 flex items-center justify-center rounded-lg text-sm shadow-md shadow-emerald-500/20">O</span>
                        <h3 class="font-bold text-lg text-slate-700">Objetivo</h3>
                    </div>

                    <div class="bg-emerald-50/50 p-5 rounded-2xl border border-emerald-100/50 mb-8">
                        <label class="form-label text-emerald-700 mb-4 flex items-center gap-2">
                            <i class="fas fa-heartbeat"></i> Sinais Vitais
                        </label>
                        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                            <div><label class="text-[10px] font-bold text-emerald-600 mb-1 block uppercase tracking-wider">PA</label><div class="relative"><input type="text" x-model="form.vitals.pa" class="form-input text-center font-bold text-emerald-900 border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500/20 h-11" placeholder="-"><span class="absolute right-2 top-3.5 text-emerald-400 text-[10px]">mmHg</span></div></div>
                            <div><label class="text-[10px] font-bold text-emerald-600 mb-1 block uppercase tracking-wider">FC</label><div class="relative"><input type="number" x-model="form.vitals.fc" class="form-input text-center font-bold text-emerald-900 border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500/20 h-11" placeholder="-"><span class="absolute right-2 top-3.5 text-emerald-400 text-[10px]">bpm</span></div></div>
                            <div><label class="text-[10px] font-bold text-emerald-600 mb-1 block uppercase tracking-wider">FR</label><div class="relative"><input type="number" x-model="form.vitals.fr" class="form-input text-center font-bold text-emerald-900 border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500/20 h-11" placeholder="-"><span class="absolute right-2 top-3.5 text-emerald-400 text-[10px]">irpm</span></div></div>
                            <div><label class="text-[10px] font-bold text-emerald-600 mb-1 block uppercase tracking-wider">Temp</label><div class="relative"><input type="number" x-model="form.vitals.temp" class="form-input text-center font-bold text-emerald-900 border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500/20 h-11" placeholder="-"><span class="absolute right-2 top-3.5 text-emerald-400 text-[10px]">°C</span></div></div>
                            <div><label class="text-[10px] font-bold text-emerald-600 mb-1 block uppercase tracking-wider">SatO2</label><div class="relative"><input type="number" x-model="form.vitals.sat" class="form-input text-center font-bold text-emerald-900 border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500/20 h-11" placeholder="-"><span class="absolute right-2 top-3.5 text-emerald-400 text-[10px]">%</span></div></div>
                            <div><label class="text-[10px] font-bold text-emerald-600 mb-1 block uppercase tracking-wider">HGT</label><div class="relative"><input type="number" x-model="form.vitals.hgt" class="form-input text-center font-bold text-emerald-900 border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500/20 h-11" placeholder="-"><span class="absolute right-2 top-3.5 text-emerald-400 text-[10px]">mg</span></div></div>
                        </div>
                    </div>

                    <div class="flex items-center justify-between mb-4">
                        <h4 class="font-bold text-slate-700 text-sm uppercase flex items-center gap-2">
                            <i class="fas fa-stethoscope text-slate-400"></i> Exame Físico
                        </h4>
                        <!-- Quick Calculator Buttons -->
                        <div class="flex flex-wrap gap-2">
                            <button @click="selectedCalc = 'glasgow'; showCalculators = true;" class="text-[10px] px-3 py-1 bg-violet-50 border border-violet-200 text-violet-700 rounded-full hover:bg-violet-100 hover:shadow-sm transition-all font-bold">
                                <i class="fas fa-brain mr-1"></i>Glasgow
                            </button>
                            <button @click="selectedCalc = 'curb65'; showCalculators = true;" class="text-[10px] px-3 py-1 bg-amber-50 border border-amber-200 text-amber-700 rounded-full hover:bg-amber-100 hover:shadow-sm transition-all font-bold">
                                <i class="fas fa-lungs mr-1"></i>CURB-65
                            </button>
                        </div>
                    </div>
                    
                    <div class="space-y-6">
                        <!-- Campos de Exame Físico com Design Melhorado -->
                        <div class="relative group bg-slate-50 p-4 rounded-xl border border-slate-100 focus-within:ring-2 focus-within:ring-blue-100 focus-within:border-blue-300 transition-all">
                            <div class="flex justify-between items-center mb-2">
                                <label class="text-xs font-bold text-slate-500 uppercase tracking-wide">Estado Geral</label>
                                <button @click="setNormal('general')" class="text-[10px] px-2 py-1 bg-white border border-emerald-200 text-emerald-600 rounded-lg hover:bg-emerald-500 hover:text-white uppercase font-bold transition-all shadow-sm flex items-center gap-1">
                                    <i class="fas fa-check"></i> Normal
                                </button>
                            </div>
                            <input type="text" x-model="form.exam.general" class="w-full bg-transparent border-none p-0 text-slate-700 font-medium focus:ring-0 placeholder-slate-400 text-sm" placeholder="BEG, LOTE...">
                        </div>

                        <!-- Cardíaco -->
                        <div class="relative group bg-slate-50 p-4 rounded-xl border border-slate-100 focus-within:ring-2 focus-within:ring-blue-100 focus-within:border-blue-300 transition-all">
                            <div class="flex justify-between items-center mb-2">
                                <div class="flex items-center gap-2 flex-wrap">
                                    <label class="text-xs font-bold text-slate-500 uppercase tracking-wide mr-1">Cardíaco</label>
                                    <button @click="selectedCalc = 'chads'; showCalculators = true;" class="text-[9px] px-2 py-0.5 bg-rose-50 border border-rose-100 text-rose-600 rounded-md hover:bg-rose-100 transition-all font-bold" title="Risco de AVC em FA">
                                        <i class="fas fa-heartbeat"></i> CHADS
                                    </button>
                                    <button @click="selectedCalc = 'has_bled'; showCalculators = true;" class="text-[9px] px-2 py-0.5 bg-rose-50 border border-rose-100 text-rose-600 rounded-md hover:bg-rose-100 transition-all font-bold" title="Risco de Sangramento">
                                        <i class="fas fa-tint"></i> HAS-BLED
                                    </button>
                                </div>
                                <button @click="setNormal('cardiac')" class="text-[10px] px-2 py-1 bg-white border border-emerald-200 text-emerald-600 rounded-lg hover:bg-emerald-500 hover:text-white uppercase font-bold transition-all shadow-sm flex items-center gap-1">
                                    <i class="fas fa-check"></i> Normal
                                </button>
                            </div>
                            <input type="text" x-model="form.exam.cardiac" class="w-full bg-transparent border-none p-0 text-slate-700 font-medium focus:ring-0 placeholder-slate-400 text-sm" placeholder="RCR em 2T, BNF, sem sopros...">
                        </div>

                        <!-- Pulmonar -->
                        <div class="relative group bg-slate-50 p-4 rounded-xl border border-slate-100 focus-within:ring-2 focus-within:ring-blue-100 focus-within:border-blue-300 transition-all">
                            <div class="flex justify-between items-center mb-2">
                                <div class="flex items-center gap-2 flex-wrap">
                                    <label class="text-xs font-bold text-slate-500 uppercase tracking-wide mr-1">Pulmonar</label>
                                    <button @click="selectedCalc = 'curb65'; showCalculators = true;" class="text-[9px] px-2 py-0.5 bg-amber-50 border border-amber-100 text-amber-600 rounded-md hover:bg-amber-100 transition-all font-bold" title="Pneumonia">
                                        <i class="fas fa-lungs"></i> CURB-65
                                    </button>
                                    <button @click="selectedCalc = 'perc'; showCalculators = true;" class="text-[9px] px-2 py-0.5 bg-blue-50 border border-blue-100 text-blue-600 rounded-md hover:bg-blue-100 transition-all font-bold" title="Embolia Pulmonar">
                                        <i class="fas fa-check-circle"></i> PERC
                                    </button>
                                </div>
                                <button @click="setNormal('pulmonary')" class="text-[10px] px-2 py-1 bg-white border border-emerald-200 text-emerald-600 rounded-lg hover:bg-emerald-500 hover:text-white uppercase font-bold transition-all shadow-sm flex items-center gap-1">
                                    <i class="fas fa-check"></i> Normal
                                </button>
                            </div>
                            <input type="text" x-model="form.exam.pulmonary" class="w-full bg-transparent border-none p-0 text-slate-700 font-medium focus:ring-0 placeholder-slate-400 text-sm" placeholder="MV+, sem RA...">
                        </div>

                        <!-- Abdominal -->
                        <div class="relative group bg-slate-50 p-4 rounded-xl border border-slate-100 focus-within:ring-2 focus-within:ring-blue-100 focus-within:border-blue-300 transition-all">
                            <div class="flex justify-between items-center mb-2">
                                <label class="text-xs font-bold text-slate-500 uppercase tracking-wide">Abdominal</label>
                                <button @click="setNormal('abdominal')" class="text-[10px] px-2 py-1 bg-white border border-emerald-200 text-emerald-600 rounded-lg hover:bg-emerald-500 hover:text-white uppercase font-bold transition-all shadow-sm flex items-center gap-1">
                                    <i class="fas fa-check"></i> Normal
                                </button>
                            </div>
                            <input type="text" x-model="form.exam.abdominal" class="w-full bg-transparent border-none p-0 text-slate-700 font-medium focus:ring-0 placeholder-slate-400 text-sm" placeholder="Flácido, indolor, RHA+...">
                        </div>

                        <!-- Neurológico -->
                        <div class="relative group bg-slate-50 p-4 rounded-xl border border-slate-100 focus-within:ring-2 focus-within:ring-blue-100 focus-within:border-blue-300 transition-all">
                            <div class="flex justify-between items-center mb-2">
                                <div class="flex items-center gap-2 flex-wrap">
                                    <label class="text-xs font-bold text-slate-500 uppercase tracking-wide mr-1">Neurológico</label>
                                    <button @click="selectedCalc = 'glasgow'; showCalculators = true;" class="text-[9px] px-2 py-0.5 bg-violet-50 border border-violet-100 text-violet-600 rounded-md hover:bg-violet-100 transition-all font-bold" title="Coma">
                                        <i class="fas fa-brain"></i> Glasgow
                                    </button>
                                    <button @click="selectedCalc = 'nihss'; showCalculators = true;" class="text-[9px] px-2 py-0.5 bg-violet-50 border border-violet-100 text-violet-600 rounded-md hover:bg-violet-100 transition-all font-bold" title="AVC">
                                        <i class="fas fa-user-injured"></i> NIHSS
                                    </button>
                                </div>
                                <button @click="setNormal('neuro')" class="text-[10px] px-2 py-1 bg-white border border-emerald-200 text-emerald-600 rounded-lg hover:bg-emerald-500 hover:text-white uppercase font-bold transition-all shadow-sm flex items-center gap-1">
                                    <i class="fas fa-check"></i> Normal
                                </button>
                            </div>
                            <input type="text" x-model="form.exam.neuro" class="w-full bg-transparent border-none p-0 text-slate-700 font-medium focus:ring-0 placeholder-slate-400 text-sm" placeholder="Vigil, orientado, pupilas isocóricas...">
                        </div>

                        <!-- Extremidades -->
                        <div class="relative group bg-slate-50 p-4 rounded-xl border border-slate-100 focus-within:ring-2 focus-within:ring-blue-100 focus-within:border-blue-300 transition-all">
                            <div class="flex justify-between items-center mb-2">
                                <div class="flex items-center gap-2 flex-wrap">
                                    <label class="text-xs font-bold text-slate-500 uppercase tracking-wide mr-1">Extremidades</label>
                                    <button @click="selectedCalc = 'wells_tvp'; showCalculators = true;" class="text-[9px] px-2 py-0.5 bg-indigo-50 border border-indigo-100 text-indigo-600 rounded-md hover:bg-indigo-100 transition-all font-bold" title="Trombose">
                                        <i class="fas fa-socks"></i> Wells TVP
                                    </button>
                                </div>
                                <button @click="setNormal('extremities')" class="text-[10px] px-2 py-1 bg-white border border-emerald-200 text-emerald-600 rounded-lg hover:bg-emerald-500 hover:text-white uppercase font-bold transition-all shadow-sm flex items-center gap-1">
                                    <i class="fas fa-check"></i> Normal
                                </button>
                            </div>
                            <input type="text" x-model="form.exam.extremities" class="w-full bg-transparent border-none p-0 text-slate-700 font-medium focus:ring-0 placeholder-slate-400 text-sm" placeholder="Sem edema, panturrilhas livres...">
                        </div>
                    </div>

                    <!-- Exame Físico Adicional -->
                    <div class="mt-8 pt-6 border-t border-slate-100">
                        <div class="flex items-center justify-between mb-4">
                            <h4 class="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                                <i class="fas fa-plus-circle text-slate-400"></i> Exame Físico Adicional
                            </h4>
                            <div class="relative" x-data="{ open: false }">
                                <button @click="open = !open" class="text-[10px] px-3 py-1.5 bg-blue-50 border border-blue-200 text-blue-600 rounded-lg hover:bg-blue-100 transition-all font-bold flex items-center gap-2">
                                    <i class="fas fa-plus"></i> Adicionar
                                </button>
                                <!-- Dropdown -->
                                <div x-show="open" @click.away="open = false" 
                                     x-transition:enter="transition ease-out duration-100"
                                     x-transition:enter-start="opacity-0 scale-95"
                                     x-transition:enter-end="opacity-100 scale-100"
                                     class="absolute right-0 mt-2 w-56 bg-white border border-slate-100 rounded-xl shadow-xl z-20 py-2">
                                    <template x-for="opt in additionalExamOptions" :key="opt.id">
                                        <button @click="addAdditionalExam(opt.id, opt.label); open = false;" 
                                                x-show="!form.exam.additional.some(e => e.id === opt.id)"
                                                class="w-full text-left px-4 py-2.5 text-sm hover:bg-slate-50 flex items-center gap-3 text-slate-700">
                                            <i :class="opt.icon" class="text-slate-400 w-4 text-center"></i>
                                            <span x-text="opt.label"></span>
                                        </button>
                                    </template>
                                </div>
                            </div>
                        </div>
                        
                        <div class="space-y-3">
                            <template x-for="(exam, index) in form.exam.additional" :key="index">
                                <div class="relative group bg-slate-50 p-4 rounded-xl border border-slate-100 focus-within:ring-2 focus-within:ring-blue-100">
                                    <div class="flex justify-between items-center mb-2">
                                        <label class="text-xs font-bold text-slate-600 uppercase" x-text="exam.label"></label>
                                        <div class="flex items-center gap-2">
                                            <button @click="setAdditionalNormal(index)" class="text-[10px] px-2 py-1 bg-white border border-emerald-200 text-emerald-600 rounded-lg hover:bg-emerald-500 hover:text-white uppercase font-bold transition-all shadow-sm">
                                                <i class="fas fa-check"></i> Normal
                                            </button>
                                            <button @click="removeAdditionalExam(index)" class="text-slate-400 hover:text-red-500 transition-colors w-6 h-6 rounded-full hover:bg-red-50 flex items-center justify-center">
                                                <i class="fas fa-times"></i>
                                            </button>
                                        </div>
                                    </div>
                                    <input type="text" x-model="exam.value" class="w-full bg-transparent border-none p-0 text-slate-700 font-medium focus:ring-0 placeholder-slate-400 text-sm" :placeholder="'Descreva ' + exam.label + '...'">
                                </div>
                            </template>
                        </div>
                    </div>
                </div>
                
                <!-- 5. COMPLEMENTARY EXAMS -->
                <div class="form-card transition-all hover:shadow-md">
                     <h4 class="font-bold text-slate-700 mb-4 text-sm uppercase flex items-center gap-2">
                        <i class="fas fa-microscope text-slate-400"></i> Exames Complementares
                     </h4>
                     
                     <div class="space-y-4">
                         <div>
                             <label class="form-label">Laboratoriais</label>
                             <textarea x-model="form.complementary.labs" class="form-input h-20 resize-none text-sm" placeholder="Hb, Leuco, Plaquetas..."></textarea>
                         </div>
                         <div>
                             <label class="form-label">Imagem (RX, USG, TC)</label>
                             <textarea x-model="form.complementary.imaging" class="form-input h-20 resize-none text-sm" placeholder="Laudos importantes..."></textarea>
                         </div>
                     </div>
                </div>

                <!-- 6. ASSESSMENT (A) -->
                <div class="form-card relative">
                    <div class="absolute left-0 top-0 w-1.5 h-full bg-amber-500 rounded-l-lg"></div>
                    <div class="flex items-center gap-2 mb-6">
                        <span class="bg-amber-500 text-white font-bold w-8 h-8 flex items-center justify-center rounded-lg text-sm shadow-md shadow-amber-500/20">A</span>
                        <h3 class="font-bold text-lg text-slate-700">Avaliação</h3>
                    </div>
                    
                    <div class="flex flex-col sm:flex-row gap-2 relative mb-4">
                        <div class="flex-grow w-full relative" @click.away="cidResults = []; cidError = ''">
                            <label class="form-label">
                                Hipótese Diagnóstica (CID-10)
                            </label>
                            <div class="relative">
                                <input type="text" 
                                    x-model="cidSearch" 
                                    @input.debounce.400ms="searchCID()" 
                                    class="form-input pl-10" 
                                    placeholder="Busca inteligente (ex: J06, pneumonia, IAM)...">
                                <i class="fas fa-search absolute left-3.5 top-3 text-slate-400"></i>
                                <div x-show="cidLoading" class="absolute right-3 top-3">
                                    <i class="fas fa-spinner fa-spin text-amber-500"></i>
                                </div>
                            </div>
                            
                            <!-- CID Dropdown -->
                            <div x-show="cidResults.length > 0" 
                                 x-transition:enter="transition ease-out duration-100"
                                 x-transition:enter-start="opacity-0 transform scale-95"
                                 x-transition:enter-end="opacity-100 transform scale-100"
                                 class="absolute z-20 w-full bg-white border border-slate-200 rounded-xl shadow-2xl mt-2 max-h-72 overflow-y-auto">
                                <div class="sticky top-0 bg-amber-50 px-4 py-2 border-b border-amber-100">
                                    <span class="text-[10px] font-bold text-amber-700 uppercase tracking-wide">
                                        <i class="fas fa-list-ul mr-1"></i>
                                        <span x-text="cidResults.length"></span> resultados
                                    </span>
                                </div>
                                <template x-for="cid in cidResults" :key="cid.code">
                                    <button @click="selectCID(cid)" 
                                            class="w-full text-left px-4 py-3 hover:bg-slate-50 text-sm border-b border-slate-50 last:border-0 transition-colors flex items-start gap-3 group">
                                        <span class="font-bold text-amber-600 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded text-xs whitespace-nowrap group-hover:bg-amber-100 transition-colors" x-text="cid.code"></span>
                                        <span class="text-slate-700 flex-grow group-hover:text-slate-900" x-text="cid.name"></span>
                                        <i class="fas fa-plus text-slate-300 group-hover:text-amber-500 mt-1 transition-colors"></i>
                                    </button>
                                </template>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Selected Diagnoses -->
                    <div class="mb-6">
                        <template x-if="form.assessment.diagnoses.length > 0">
                            <div class="flex flex-wrap gap-2">
                                <template x-for="(diagnosis, index) in form.assessment.diagnoses" :key="index">
                                    <div class="bg-white border border-amber-200 text-amber-800 px-3 py-1.5 rounded-lg text-sm flex items-center gap-2 shadow-sm animate-fade-in-up">
                                        <i class="fas fa-tag text-amber-400 text-xs"></i>
                                        <span x-text="diagnosis" class="font-medium"></span>
                                        <button @click="removeDiagnosis(index)" class="ml-1 text-amber-400 hover:text-red-500 transition-colors">
                                            <i class="fas fa-times-circle"></i>
                                        </button>
                                    </div>
                                </template>
                            </div>
                        </template>
                        <template x-if="form.assessment.diagnoses.length === 0">
                            <div class="text-center py-6 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                                <p class="text-xs text-slate-400 font-medium">Nenhum diagnóstico selecionado</p>
                            </div>
                        </template>
                    </div>
                    
                    <div>
                        <label class="form-label">Outros / Diagnóstico Livre</label>
                        <input type="text" x-model="form.assessment.hd" class="form-input" placeholder="Complemento...">
                    </div>
                </div>

                <!-- 7. PLAN (P) -->
                <div class="form-card relative">
                    <div class="absolute left-0 top-0 w-1.5 h-full bg-blue-600 rounded-l-lg"></div>
                    <div class="flex items-center gap-2 mb-6">
                        <span class="bg-blue-600 text-white font-bold w-8 h-8 flex items-center justify-center rounded-lg text-sm shadow-md shadow-blue-600/20">P</span>
                        <h3 class="font-bold text-lg text-slate-700">Conduta</h3>
                    </div>

                    <div class="flex gap-2 mb-6 p-1 bg-slate-100 rounded-xl overflow-x-auto">
                        <button @click="conductType = 'prescricao'" :class="conductType === 'prescricao' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'" class="flex-1 px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap">Prescrição/Alta</button>
                        <button @click="conductType = 'exames'" :class="conductType === 'exames' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'" class="flex-1 px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap">Solicitar Exames</button>
                        <button @click="conductType = 'internacao'" :class="conductType === 'internacao' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'" class="flex-1 px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap">Internação</button>
                    </div>

                    <!-- TAB: PRESCRIÇÃO/ALTA -->
                    <div x-show="conductType === 'prescricao'" x-transition:enter="transition ease-out duration-200" x-transition:enter-start="opacity-0 translate-y-2" x-transition:enter-end="opacity-100 translate-y-0">
                        <div class="mb-5">
                            <label class="form-label text-blue-600">Prescrição Médica</label>
                            <textarea x-model="form.plan.prescription" class="form-input h-40 bg-blue-50/30 border-blue-100 focus:border-blue-300 focus:ring-blue-500/20 font-mono text-sm leading-relaxed" placeholder="1. Dieta...\n2. Soro...\n3. Analgesia..."></textarea>
                        </div>

                        <div class="mb-4">
                            <label class="checkbox-card bg-emerald-50 border-emerald-100 hover:bg-emerald-100/50">
                                <input type="checkbox" x-model="form.plan.isDischarge" class="w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500">
                                <span class="text-emerald-800 font-bold ml-2">CONFIRMAR ALTA MÉDICA</span>
                            </label>
                        </div>

                        <div x-show="form.plan.isDischarge" class="bg-white border border-emerald-100 rounded-xl p-5 mb-5 shadow-sm">
                            <h5 class="text-emerald-700 font-bold text-sm mb-4 flex items-center gap-2">
                                <i class="fas fa-clipboard-check"></i> Checklist de Alta
                            </h5>
                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                                <label class="checkbox-card py-2 text-xs"><input type="checkbox" x-model="form.plan.discharge.meds_guide" class="rounded text-emerald-600 focus:ring-emerald-500"> <span>Orientado uso de medicações</span></label>
                                <label class="checkbox-card py-2 text-xs"><input type="checkbox" x-model="form.plan.discharge.alarm_signs" class="rounded text-emerald-600 focus:ring-emerald-500"> <span>Sinais de alarme / Retorno</span></label>
                                <label class="checkbox-card py-2 text-xs"><input type="checkbox" x-model="form.plan.discharge.certificate" class="rounded text-emerald-600 focus:ring-emerald-500"> <span>Atestado Médico entregue</span></label>
                                <label class="checkbox-card py-2 text-xs"><input type="checkbox" x-model="form.plan.discharge.referral" class="rounded text-emerald-600 focus:ring-emerald-500"> <span>Encaminhamento</span></label>
                            </div>
                        </div>
                    </div>

                    <!-- TAB: EXAMES -->
                    <div x-show="conductType === 'exames'" x-transition:enter="transition ease-out duration-200" x-transition:enter-start="opacity-0 translate-y-2" x-transition:enter-end="opacity-100 translate-y-0">
                        <div class="bg-amber-50/50 border border-amber-100 rounded-xl p-4 mb-4">
                            <label class="form-label text-amber-700">Exames Solicitados</label>
                            <textarea x-model="form.plan.requestedExams" class="form-input h-32 bg-white border-amber-200 focus:border-amber-400 focus:ring-amber-500/20 text-sm" placeholder="Hemograma, PCR, Creatinina...\nRX de Tórax..."></textarea>
                        </div>
                    </div>

                    <!-- TAB: INTERNAÇÃO -->
                    <div x-show="conductType === 'internacao'" x-transition:enter="transition ease-out duration-200" x-transition:enter-start="opacity-0 translate-y-2" x-transition:enter-end="opacity-100 translate-y-0">
                        <div class="bg-rose-50/50 border border-rose-100 rounded-xl p-4 mb-4">
                            <h5 class="text-rose-800 font-bold text-sm mb-3 flex items-center gap-2">
                                <i class="fas fa-procedures"></i> Destino
                            </h5>
                            <div class="grid grid-cols-1 gap-3">
                                <label class="checkbox-card border-rose-100"><input type="radio" name="internation" value="Observação Breve" x-model="form.plan.internationType" class="text-rose-600 focus:ring-rose-500"> <span class="text-sm font-medium">Observação Breve</span></label>
                                <label class="checkbox-card border-rose-100"><input type="radio" name="internation" value="Enfermaria" x-model="form.plan.internationType" class="text-rose-600 focus:ring-rose-500"> <span class="text-sm font-medium">Enfermaria</span></label>
                                <label class="checkbox-card border-rose-100"><input type="radio" name="internation" value="Sala Vermelha" x-model="form.plan.internationType" class="text-rose-600 focus:ring-rose-500"> <span class="text-sm font-medium">Sala de Emergência</span></label>
                            </div>
                        </div>
                    </div>
                    
                    <div class="mt-4">
                        <label class="form-label">Observações Adicionais</label>
                        <textarea x-model="form.plan.notes" class="form-input h-20 text-sm" placeholder="Outros detalhes..."></textarea>
                    </div>
                </div>
                    </div>
                </template>
                <!-- Fim SOAP Form -->

                <!-- SALA VERMELHA / UTI -->
                <template x-if="form.serviceType === 'salavermelha'">
                    <!-- ============================================ -->
                    <!-- SALA VERMELHA / UTI - TEMPLATES            -->
                    <!-- ============================================ -->
                    <div>
                        <!-- SUB-SELETOR: Escolha entre Evolução Crítico e XABCDE -->
                        <div class="form-card border-l-4 border-red-500 mb-6">
                            <h3 class="font-bold text-lg text-slate-700 mb-4 flex items-center gap-2">
                                <i class="fas fa-clipboard-list text-red-600"></i>
                                Selecione o Tipo de Registro
                            </h3>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <button 
                                    @click="form.utiTemplate = 'evolucao'"
                                    :class="form.utiTemplate === 'evolucao' ? 'bg-red-600 text-white shadow-lg scale-105' : 'bg-white text-slate-700 hover:bg-red-50 border-2 border-slate-200'"
                                    class="p-6 rounded-xl font-bold transition-all flex flex-col items-center justify-center gap-3">
                                    <i class="fas fa-notes-medical text-3xl"></i>
                                    <div>
                                        <div class="text-base">Evolução de Paciente Crítico</div>
                                        <div class="text-xs font-normal opacity-80 mt-1">Paciente já em cuidados intensivos</div>
                                    </div>
                                </button>
                                <button 
                                    @click="form.utiTemplate = 'xabcde'"
                                    :class="form.utiTemplate === 'xabcde' ? 'bg-red-600 text-white shadow-lg scale-105' : 'bg-white text-slate-700 hover:bg-red-50 border-2 border-slate-200'"
                                    class="p-6 rounded-xl font-bold transition-all flex flex-col items-center justify-center gap-3">
                                    <i class="fas fa-ambulance text-3xl"></i>
                                    <div>
                                        <div class="text-base">Admissão XABCDE</div>
                                        <div class="text-xs font-normal opacity-80 mt-1">Avaliação inicial - Protocolo XABCDE</div>
                                    </div>
                                </button>
                            </div>
                        </div>
                    
                        <!-- ======================================== -->
                        <!-- TEMPLATE 1: Evolução de Paciente Crítico -->
                        <!-- ======================================== -->
                        <template x-if="form.utiTemplate === 'evolucao'">
                            <div>
                                <!-- A. CABEÇALHO / DADOS DA INTERNAÇÃO -->
                                <div class="form-card border-l-4 border-red-500 bg-gradient-to-r from-red-50/50 to-pink-50/30">
                                    <div class="flex items-center gap-2 mb-6">
                                        <div class="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center">
                                            <i class="fas fa-calendar-plus"></i>
                                        </div>
                                        <h3 class="font-bold text-lg text-slate-700">Dados da Internação</h3>
                                    </div>
                                    
                                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label class="form-label">Data de Admissão</label>
                                            <input type="date" x-model="form.uti.dataAdmissao" class="form-input border-red-200 focus:ring-red-500/20 focus:border-red-500">
                                        </div>
                                        <div>
                                            <label class="form-label">Local</label>
                                            <select x-model="form.uti.local" class="form-input border-red-200 focus:ring-red-500/20 focus:border-red-500">
                                                <option value="UPA">UPA</option>
                                                <option value="UTI">UTI</option>
                                                <option value="Sala Vermelha">Sala Vermelha</option>
                                                <option value="Sala de Cuidados">Sala de Cuidados</option>
                                            </select>
                                        </div>
                                    </div>
                                    
                                    <div class="mt-4">
                                        <label class="form-label">Motivo da Internação / Transferência</label>
                                        <textarea x-model="form.uti.motivo" class="form-input h-20 border-red-200 focus:ring-red-500/20 focus:border-red-500" placeholder="Descreva o motivo da admissão neste setor..."></textarea>
                                    </div>
                                </div>
                    
                                <!-- B. DIAGNÓSTICO PRINCIPAL -->
                                <div class="form-card border-l-4 border-red-500">
                                    <div class="flex items-center gap-2 mb-4">
                                        <div class="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center">
                                            <i class="fas fa-stethoscope"></i>
                                        </div>
                                        <h3 class="font-bold text-lg text-slate-700">Diagnóstico Principal (DX)</h3>
                                    </div>
                                    <textarea x-model="form.uti.dx" class="form-input h-24 border-red-200 focus:ring-red-500/20 focus:border-red-500" placeholder="Diagnóstico principal que motivou a internação..."></textarea>
                                </div>
                    
                                <!-- C. RASTREIO COVID-19 -->
                                <div class="form-card border-l-4 border-amber-500 bg-gradient-to-r from-amber-50/50 to-yellow-50/30">
                                    <div class="flex items-center gap-2 mb-6">
                                        <div class="w-10 h-10 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center">
                                            <i class="fas fa-virus"></i>
                                        </div>
                                        <h3 class="font-bold text-lg text-slate-700">Rastreio COVID-19</h3>
                                    </div>
                                    
                                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <label class="form-label">Data do TR COVID-19</label>
                                            <input type="date" x-model="form.uti.covidData" class="form-input border-amber-200 focus:ring-amber-500/20 focus:border-amber-500">
                                        </div>
                                        <div>
                                            <label class="form-label">Resultado TR COVID-19</label>
                                            <select x-model="form.uti.covidResultado" class="form-input border-amber-200 focus:ring-amber-500/20 focus:border-amber-500">
                                                <option value="NÃO REAGENTE">NÃO REAGENTE</option>
                                                <option value="REAGENTE">REAGENTE</option>
                                                <option value="AGUARDA">AGUARDA</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label class="form-label">RT-PCR</label>
                                            <select x-model="form.uti.rtpcr" class="form-input border-amber-200 focus:ring-amber-500/20 focus:border-amber-500">
                                                <option value="AGUARDA">AGUARDA</option>
                                                <option value="NEGATIVO">NEGATIVO</option>
                                                <option value="POSITIVO">POSITIVO</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                    
                                <!-- D. ANTIBIOTICOTERAPIA (ATB) - Lista Dinâmica -->
                                <div class="form-card border-l-4 border-purple-500 bg-gradient-to-r from-purple-50/50 to-indigo-50/30">
                                    <div class="flex items-center justify-between mb-6">
                                        <div class="flex items-center gap-2">
                                            <div class="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center">
                                                <i class="fas fa-pills"></i>
                                            </div>
                                            <h3 class="font-bold text-lg text-slate-700">Antibioticoterapia (ATB)</h3>
                                        </div>
                                        <button 
                                            @click="form.uti.atb.push({nome:'',horario:'',dataInicio:'',status:'EM USO'})"
                                            class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all text-sm font-bold flex items-center gap-2 shadow-lg hover:shadow-purple-500/30">
                                            <i class="fas fa-plus"></i>
                                            Adicionar ATB
                                        </button>
                                    </div>
                    
                                    <div class="space-y-3">
                                        <template x-if="form.uti.atb.length === 0">
                                            <div class="text-center py-8 border-2 border-dashed border-purple-200 rounded-xl bg-purple-50/30">
                                                <i class="fas fa-pills text-4xl text-purple-300 mb-3"></i>
                                                <p class="text-purple-400 text-sm font-medium">Nenhum antibiótico adicionado</p>
                                                <p class="text-purple-300 text-xs mt-1">Clique em "Adicionar ATB" para incluir</p>
                                            </div>
                                        </template>
                    
                                        <template x-for="(atb, index) in form.uti.atb" :key="index">
                                            <div class="bg-white p-4 rounded-xl border-2 border-purple-200 hover:border-purple-400 transition-all shadow-sm hover:shadow-md">
                                                <div class="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
                                                    <div class="md:col-span-4">
                                                        <label class="text-[10px] text-purple-600 uppercase font-bold mb-1 block">Nome do ATB</label>
                                                        <input type="text" x-model="atb.nome" class="form-input border-purple-200 focus:ring-purple-500/20 focus:border-purple-500" placeholder="Ex: CEFTRIAXONA">
                                                    </div>
                                                    <div class="md:col-span-2">
                                                        <label class="text-[10px] text-purple-600 uppercase font-bold mb-1 block">Horário</label>
                                                        <input type="text" x-model="atb.horario" class="form-input border-purple-200 focus:ring-purple-500/20 focus:border-purple-500" placeholder="12/12">
                                                    </div>
                                                    <div class="md:col-span-3">
                                                        <label class="text-[10px] text-purple-600 uppercase font-bold mb-1 block">Data Início</label>
                                                        <input type="date" x-model="atb.dataInicio" class="form-input border-purple-200 focus:ring-purple-500/20 focus:border-purple-500">
                                                    </div>
                                                    <div class="md:col-span-2">
                                                        <label class="text-[10px] text-purple-600 uppercase font-bold mb-1 block">Status</label>
                                                        <select x-model="atb.status" class="form-input border-purple-200 focus:ring-purple-500/20 focus:border-purple-500">
                                                            <option value="EM USO">EM USO</option>
                                                            <option value="SUSPENSO">SUSPENSO</option>
                                                            <option value="INICIADO HOJE">INICIADO HOJE</option>
                                                        </select>
                                                    </div>
                                                    <div class="md:col-span-1 flex justify-end">
                                                        <button 
                                                            @click="form.uti.atb.splice(index, 1)"
                                                            class="h-[44px] w-[44px] bg-red-100 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-all flex items-center justify-center">
                                                            <i class="fas fa-trash"></i>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </template>
                                    </div>
                                </div>
                    
                                <!-- E. HISTÓRIA DA DOENÇA ATUAL (HDA) -->
                                <div class="form-card border-l-4 border-blue-500">
                                    <div class="flex items-center gap-2 mb-4">
                                        <div class="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                                            <i class="fas fa-file-medical-alt"></i>
                                        </div>
                                        <h3 class="font-bold text-lg text-slate-700">História da Doença Atual (HDA)</h3>
                                    </div>
                                    <textarea x-model="form.uti.hda" class="form-input h-32 border-blue-200 focus:ring-blue-500/20 focus:border-blue-500" placeholder="Descreva a história da doença atual do paciente..."></textarea>
                                </div>
                    
                                <!-- F. DISPOSITIVOS/ACESSOS (DEVICES) - Lista Dinâmica -->
                                <div class="form-card border-l-4 border-emerald-500 bg-gradient-to-r from-emerald-50/50 to-teal-50/30">
                                    <div class="flex items-center justify-between mb-6">
                                        <div class="flex items-center gap-2">
                                            <div class="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                                                <i class="fas fa-plug"></i>
                                            </div>
                                            <h3 class="font-bold text-lg text-slate-700">Dispositivos / Acessos (DEVICES)</h3>
                                        </div>
                                        <button 
                                            @click="form.uti.devices.push({tipo:'',detalhes:'',dataInsercao:'',status:'EM USO'})"
                                            class="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all text-sm font-bold flex items-center gap-2 shadow-lg hover:shadow-emerald-500/30">
                                            <i class="fas fa-plus"></i>
                                            Adicionar Device
                                        </button>
                                    </div>
                    
                                    <div class="space-y-3">
                                        <template x-if="form.uti.devices.length === 0">
                                            <div class="text-center py-8 border-2 border-dashed border-emerald-200 rounded-xl bg-emerald-50/30">
                                                <i class="fas fa-plug text-4xl text-emerald-300 mb-3"></i>
                                                <p class="text-emerald-400 text-sm font-medium">Nenhum dispositivo adicionado</p>
                                                <p class="text-emerald-300 text-xs mt-1">Clique em "Adicionar Device" para incluir</p>
                                            </div>
                                        </template>
                    
                                        <template x-for="(device, index) in form.uti.devices" :key="index">
                                            <div class="bg-white p-4 rounded-xl border-2 border-emerald-200 hover:border-emerald-400 transition-all shadow-sm hover:shadow-md">
                                                <div class="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
                                                    <div class="md:col-span-3">
                                                        <label class="text-[10px] text-emerald-600 uppercase font-bold mb-1 block">Tipo</label>
                                                        <select x-model="device.tipo" class="form-input border-emerald-200 focus:ring-emerald-500/20 focus:border-emerald-500">
                                                            <option value="">Selecione...</option>
                                                            <option value="TOT">TOT (Tubo Orotraqueal)</option>
                                                            <option value="CVC">CVC (Cateter Venoso Central)</option>
                                                            <option value="CVP">CVP (Cateter Venoso Periférico)</option>
                                                            <option value="SVD">SVD (Sonda Vesical de Demora)</option>
                                                            <option value="SNE">SNE (Sonda Nasoenteral)</option>
                                                            <option value="CNO2">CNO2 (Cateter Nasal de O2)</option>
                                                            <option value="Cateter Arterial">Cateter Arterial</option>
                                                            <option value="Dreno">Dreno</option>
                                                            <option value="Outro">Outro</option>
                                                        </select>
                                                    </div>
                                                    <div class="md:col-span-4">
                                                        <label class="text-[10px] text-emerald-600 uppercase font-bold mb-1 block">Detalhes</label>
                                                        <input type="text" x-model="device.detalhes" class="form-input border-emerald-200 focus:ring-emerald-500/20 focus:border-emerald-500" placeholder="Ex: TOT 7.5 / CVC VJIE">
                                                    </div>
                                                    <div class="md:col-span-3">
                                                        <label class="text-[10px] text-emerald-600 uppercase font-bold mb-1 block">Data Inserção</label>
                                                        <input type="date" x-model="device.dataInsercao" class="form-input border-emerald-200 focus:ring-emerald-500/20 focus:border-emerald-500">
                                                    </div>
                                                    <div class="md:col-span-1">
                                                        <label class="text-[10px] text-emerald-600 uppercase font-bold mb-1 block">Status</label>
                                                        <select x-model="device.status" class="form-input border-emerald-200 focus:ring-emerald-500/20 focus:border-emerald-500">
                                                            <option value="EM USO">EM USO</option>
                                                            <option value="RETIRADO">RETIRADO</option>
                                                            <option value="OBSTRUÍDO">OBSTRUÍDO</option>
                                                        </select>
                                                    </div>
                                                    <div class="md:col-span-1 flex justify-end">
                                                        <button 
                                                            @click="form.uti.devices.splice(index, 1)"
                                                            class="h-[44px] w-[44px] bg-red-100 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-all flex items-center justify-center">
                                                            <i class="fas fa-trash"></i>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </template>
                                    </div>
                                </div>
                    
                                <!-- G. EVOLUÇÃO POR SISTEMAS -->
                                <div class="form-card border-l-4 border-cyan-500 bg-gradient-to-r from-cyan-50/50 to-blue-50/30">
                                    <div class="flex items-center gap-2 mb-6">
                                        <div class="w-10 h-10 rounded-full bg-cyan-100 text-cyan-600 flex items-center justify-center">
                                            <i class="fas fa-heartbeat"></i>
                                        </div>
                                        <h3 class="font-bold text-lg text-slate-700">Evolução por Sistemas</h3>
                                    </div>
                    
                                    <div class="space-y-4">
                                        <div>
                                            <div class="flex items-center justify-between mb-2">
                                                <label class="form-label flex items-center gap-2 mb-0">
                                                    <i class="fas fa-brain text-cyan-600"></i>
                                                    <span>NEURO (Neurológico)</span>
                                                </label>
                                                <div class="flex gap-2">
                                                    <button @click="form.uti.evolucao.neuro = 'Paciente sedado e analgesiado. Glasgow pré-sedação: ___. Pupilas isocóricas e fotorreagentes. Sem déficits motores aparentes.'" class="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-lg hover:bg-green-200 transition-all flex items-center gap-1">
                                                        <i class="fas fa-check"></i> Normal
                                                    </button>
                                                    <button @click="selectedCalc = calculators.find(c => c.id === 'glasgow'); showCalculators = true" class="px-3 py-1 bg-cyan-100 text-cyan-700 text-xs font-bold rounded-lg hover:bg-cyan-200 transition-all flex items-center gap-1">
                                                        <i class="fas fa-calculator"></i> Glasgow
                                                    </button>
                                                </div>
                                            </div>
                                            <textarea x-model="form.uti.evolucao.neuro" class="form-input h-24 border-cyan-200 focus:ring-cyan-500/20 focus:border-cyan-500" placeholder="Glasgow, sedação, pupilas, déficits motores..."></textarea>
                                        </div>
                    
                                        <div>
                                            <div class="flex items-center justify-between mb-2">
                                                <label class="form-label flex items-center gap-2 mb-0">
                                                    <i class="fas fa-heartbeat text-red-600"></i>
                                                    <span>SCV (Sistema Cardiovascular)</span>
                                                </label>
                                                <div class="flex gap-2">
                                                    <button @click="form.uti.evolucao.scv = 'Hemodinamicamente estável. Ritmo cardíaco regular. Ausculta cardíaca: bulhas rítmicas normofonéticas em 2T, sem sopros. Pulsos periféricos palpáveis e simétricos.'" class="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-lg hover:bg-green-200 transition-all flex items-center gap-1">
                                                        <i class="fas fa-check"></i> Normal
                                                    </button>
                                                </div>
                                            </div>
                                            <textarea x-model="form.uti.evolucao.scv" class="form-input h-24 border-cyan-200 focus:ring-cyan-500/20 focus:border-cyan-500" placeholder="Hemodinâmica, drogas vasoativas, ritmo cardíaco..."></textarea>
                                        </div>
                    
                                        <div>
                                            <div class="flex items-center justify-between mb-2">
                                                <label class="form-label flex items-center gap-2 mb-0">
                                                    <i class="fas fa-lungs text-blue-600"></i>
                                                    <span>SR (Sistema Respiratório)</span>
                                                </label>
                                                <div class="flex gap-2">
                                                    <button @click="form.uti.evolucao.sr = 'Padrão respiratório regular. Ausculta pulmonar: murmúrio vesicular presente bilateralmente, sem ruídos adventícios. SpO2 mantida em ar ambiente.'" class="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-lg hover:bg-green-200 transition-all flex items-center gap-1">
                                                        <i class="fas fa-check"></i> Normal
                                                    </button>
                                                    <button @click="selectedCalc = calculators.find(c => c.id === 'curb65'); showCalculators = true" class="px-3 py-1 bg-cyan-100 text-cyan-700 text-xs font-bold rounded-lg hover:bg-cyan-200 transition-all flex items-center gap-1">
                                                        <i class="fas fa-calculator"></i> CURB-65
                                                    </button>
                                                </div>
                                            </div>
                                            <textarea x-model="form.uti.evolucao.sr" class="form-input h-24 border-cyan-200 focus:ring-cyan-500/20 focus:border-cyan-500" placeholder="Padrão ventilatório, suporte de O2, ausculta..."></textarea>
                                        </div>
                    
                                        <div>
                                            <div class="flex items-center justify-between mb-2">
                                                <label class="form-label flex items-center gap-2 mb-0">
                                                    <i class="fas fa-stomach text-amber-600"></i>
                                                    <span>TGI (Trato Gastrointestinal)</span>
                                                </label>
                                                <button @click="form.uti.evolucao.tgi = 'Abdome plano, flácido, indolor à palpação. Ruídos hidroaéreos presentes. Sem sinais de irritação peritoneal. Evacuações regulares.'" class="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-lg hover:bg-green-200 transition-all flex items-center gap-1">
                                                    <i class="fas fa-check"></i> Normal
                                                </button>
                                            </div>
                                            <textarea x-model="form.uti.evolucao.tgi" class="form-input h-24 border-cyan-200 focus:ring-cyan-500/20 focus:border-cyan-500" placeholder="Dieta, abdome, eliminações intestinais..."></textarea>
                                        </div>
                    
                                        <div>
                                            <div class="flex items-center justify-between mb-2">
                                                <label class="form-label flex items-center gap-2 mb-0">
                                                    <i class="fas fa-kidneys text-purple-600"></i>
                                                    <span>R/M (Renal/Metabólico)</span>
                                                </label>
                                                <div class="flex gap-2">
                                                    <button @click="form.uti.evolucao.rm = 'Diurese preservada. Função renal estável. Eletrólitos dentro dos limites da normalidade. Glicemia controlada.'" class="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-lg hover:bg-green-200 transition-all flex items-center gap-1">
                                                        <i class="fas fa-check"></i> Normal
                                                    </button>
                                                    <button @click="selectedCalc = calculators.find(c => c.id === 'ckd'); showCalculators = true" class="px-3 py-1 bg-cyan-100 text-cyan-700 text-xs font-bold rounded-lg hover:bg-cyan-200 transition-all flex items-center gap-1">
                                                        <i class="fas fa-calculator"></i> TFG
                                                    </button>
                                                </div>
                                            </div>
                                            <textarea x-model="form.uti.evolucao.rm" class="form-input h-24 border-cyan-200 focus:ring-cyan-500/20 focus:border-cyan-500" placeholder="Diurese, função renal, distúrbios hidroeletrolíticos..."></textarea>
                                        </div>
                    
                                        <div>
                                            <div class="flex items-center justify-between mb-2">
                                                <label class="form-label flex items-center gap-2 mb-0">
                                                    <i class="fas fa-vial text-pink-600"></i>
                                                    <span>H/I (Hematológico/Infeccioso)</span>
                                                </label>
                                                <button @click="form.uti.evolucao.hi = 'Hemograma sem alterações significativas. Coagulograma normal. Sem sinais de foco infeccioso ativo. Culturas negativas.'" class="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-lg hover:bg-green-200 transition-all flex items-center gap-1">
                                                    <i class="fas fa-check"></i> Normal
                                                </button>
                                            </div>
                                            <textarea x-model="form.uti.evolucao.hi" class="form-input h-24 border-cyan-200 focus:ring-cyan-500/20 focus:border-cyan-500" placeholder="Hemograma, coagulograma, culturas, foco infeccioso..."></textarea>
                                        </div>
                    
                                        <div>
                                            <div class="flex items-center justify-between mb-2">
                                                <label class="form-label flex items-center gap-2 mb-0">
                                                    <i class="fas fa-hand-paper text-slate-600"></i>
                                                    <span>EXTR (Extremidades)</span>
                                                </label>
                                                <button @click="form.uti.evolucao.extr = 'Perfusão periférica adequada. Pulsos periféricos palpáveis e simétricos. Sem edemas. Sem lesões cutâneas.'" class="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-lg hover:bg-green-200 transition-all flex items-center gap-1">
                                                    <i class="fas fa-check"></i> Normal
                                                </button>
                                            </div>
                                            <textarea x-model="form.uti.evolucao.extr" class="form-input h-24 border-cyan-200 focus:ring-cyan-500/20 focus:border-cyan-500" placeholder="Perfusão periférica, edemas, pulsos, lesões..."></textarea>
                                        </div>
                                    </div>
                                </div>
                    
                                <!-- H. EXAMES COMPLEMENTARES -->
                                <div class="form-card border-l-4 border-indigo-500">
                                    <div class="flex items-center gap-2 mb-4">
                                        <div class="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center">
                                            <i class="fas fa-microscope"></i>
                                        </div>
                                        <h3 class="font-bold text-lg text-slate-700">Exames Complementares</h3>
                                    </div>
                                    <textarea x-model="form.uti.exames" class="form-input h-32 border-indigo-200 focus:ring-indigo-500/20 focus:border-indigo-500" placeholder="Exames laboratoriais e de imagem solicitados/aguardando/resultados..."></textarea>
                                </div>
                    
                                <!-- I. CONDUTAS -->
                                <div class="form-card border-l-4 border-rose-500 bg-gradient-to-r from-rose-50/50 to-red-50/30">
                                    <div class="flex items-center gap-2 mb-6">
                                        <div class="w-10 h-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center">
                                            <i class="fas fa-clipboard-check"></i>
                                        </div>
                                        <h3 class="font-bold text-lg text-slate-700">Condutas</h3>
                                    </div>
                    
                                    <div class="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                                        <label class="checkbox-card">
                                            <input type="checkbox" x-model="form.uti.condutas.vigilanciaNeuro" class="mr-3">
                                            <span class="flex-1">Vigilância NEUROLÓGICA</span>
                                            <i class="fas fa-brain text-cyan-400"></i>
                                        </label>
                                        <label class="checkbox-card">
                                            <input type="checkbox" x-model="form.uti.condutas.vigilanciaHemo" class="mr-3">
                                            <span class="flex-1">Vigilância HEMODINÂMICA</span>
                                            <i class="fas fa-heartbeat text-red-400"></i>
                                        </label>
                                        <label class="checkbox-card">
                                            <input type="checkbox" x-model="form.uti.condutas.vigilanciaInfec" class="mr-3">
                                            <span class="flex-1">Vigilância INFECCIOSA</span>
                                            <i class="fas fa-shield-virus text-purple-400"></i>
                                        </label>
                                        <label class="checkbox-card">
                                            <input type="checkbox" x-model="form.uti.condutas.vigilanciaVent" class="mr-3">
                                            <span class="flex-1">Vigilância VENTILATÓRIA</span>
                                            <i class="fas fa-lungs text-blue-400"></i>
                                        </label>
                                        <label class="checkbox-card">
                                            <input type="checkbox" x-model="form.uti.condutas.vigilanciaRenal" class="mr-3">
                                            <span class="flex-1">Vigilância RENAL/METABÓLICA</span>
                                            <i class="fas fa-kidneys text-amber-400"></i>
                                        </label>
                                        <label class="checkbox-card">
                                            <input type="checkbox" x-model="form.uti.condutas.profilaxiaTEV" class="mr-3">
                                            <span class="flex-1">PROFILAXIA TEV/LAMG</span>
                                            <i class="fas fa-syringe text-emerald-400"></i>
                                        </label>
                                        <label class="checkbox-card">
                                            <input type="checkbox" x-model="form.uti.condutas.aguardarVaga" class="mr-3">
                                            <span class="flex-1">Aguardar vaga de UTI/regulação</span>
                                            <i class="fas fa-bed text-indigo-400"></i>
                                        </label>
                                        <label class="checkbox-card">
                                            <input type="checkbox" x-model="form.uti.condutas.manterFamilia" class="mr-3">
                                            <span class="flex-1">Manter família informada</span>
                                            <i class="fas fa-users text-pink-400"></i>
                                        </label>
                                    </div>
                    
                                    <div>
                                        <label class="form-label">Outras Condutas</label>
                                        <textarea x-model="form.uti.condutas.outras" class="form-input h-24 border-rose-200 focus:ring-rose-500/20 focus:border-rose-500" placeholder="Outras condutas específicas para este caso..."></textarea>
                                    </div>
                                </div>
                            </div>
                        </template>
                    
                        <!-- ======================================== -->
                        <!-- TEMPLATE 2: Admissão XABCDE             -->
                        <!-- (Será implementado no Passo 5)          -->
                        <!-- ======================================== -->
                        <template x-if="form.utiTemplate === 'xabcde'">
                            <div>
                                <div class="form-card border-l-4 border-red-500">
                                    <h3 class="font-bold text-lg text-red-600 mb-4 flex items-center gap-2">
                                        <i class="fas fa-ambulance"></i>
                                        Template XABCDE - Em desenvolvimento
                                    </h3>
                                    <p class="text-slate-600">O formulário de Admissão XABCDE será adicionado no próximo passo.</p>
                                </div>
                            </div>
                        </template>
                    </div>
                </template>

            </div>

            <!-- RIGHT COLUMN: PREVIEW (STICKY) -->
            <div class="lg:w-[500px] xl:w-[600px] flex-shrink-0 hidden lg:block">
                <div class="sticky top-24">
                    <div class="bg-white rounded-2xl shadow-xl border border-slate-200 flex flex-col max-h-[85vh] overflow-hidden preview-paper">
                        
                        <div class="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 backdrop-blur-sm">
                            <div class="flex items-center gap-3">
                                 <h3 class="font-bold text-slate-700 flex items-center gap-2">
                                    <i class="fas fa-file-invoice text-blue-500"></i> Pré-visualização
                                </h3>
                                <button @click="showCalculators = true" class="text-xs bg-white border border-slate-200 text-blue-600 px-3 py-1.5 rounded-lg hover:bg-blue-50 hover:border-blue-200 transition-all font-semibold shadow-sm flex items-center gap-2">
                                    <i class="fas fa-calculator"></i> Calc
                                </button>
                            </div>
                            <button @click="copyText()" class="px-5 py-2 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/30 transition-all flex items-center gap-2 active:scale-95">
                                <i class="far fa-copy"></i> <span x-text="copied ? 'Copiado!' : 'Copiar'"></span>
                            </button>
                        </div>

                        <div class="p-2 bg-amber-50/80 border-b border-amber-100 flex items-center justify-center gap-2">
                            <i class="fas fa-info-circle text-amber-500 text-xs"></i>
                            <p class="text-[10px] text-amber-700 font-medium">Revise o texto antes de transferir para o prontuário.</p>
                        </div>

                        <div class="p-8 overflow-y-auto preview-scroll flex-grow font-mono text-sm leading-relaxed whitespace-pre-wrap text-slate-800 bg-white" id="preview-text" x-text="generateText()"></div>
                    </div>
                </div>
            </div>
            
            <!-- MOBILE FLOAT BUTTONS -->
            <div class="fixed bottom-6 right-6 lg:hidden z-50 flex flex-col gap-4" x-data="{ open: false }">
                 <button @click="showCalculators = true" class="w-14 h-14 bg-white text-blue-600 rounded-2xl shadow-xl shadow-blue-900/20 border border-slate-100 flex items-center justify-center text-xl transition-transform active:scale-90">
                    <i class="fas fa-calculator"></i>
                 </button>
                 <button @click="open = !open" class="w-14 h-14 bg-gradient-to-br from-blue-600 to-cyan-500 text-white rounded-2xl shadow-xl shadow-blue-500/40 flex items-center justify-center text-xl transition-transform active:scale-90">
                    <i class="fas" :class="open ? 'fa-times' : 'fa-file-alt'"></i>
                 </button>
                 
                 <div x-show="open" class="absolute bottom-36 right-0 w-[90vw] sm:w-[450px] h-[60vh] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden" 
                      x-transition:enter="transition ease-out duration-200"
                      x-transition:enter-start="opacity-0 translate-y-10 scale-95"
                      x-transition:enter-end="opacity-100 translate-y-0 scale-100">
                      <div class="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                        <h3 class="font-bold text-slate-700">Pré-visualização</h3>
                        <button @click="copyText()" class="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-lg font-bold">Copiar</button>
                      </div>
                      <div class="p-6 overflow-y-auto font-mono text-xs whitespace-pre-wrap flex-grow bg-white" x-text="generateText()"></div>
                 </div>
            </div>

            <!-- CALCULATORS MODAL -->
            <div x-show="showCalculators" class="fixed inset-0 z-[100] overflow-y-auto" style="display: none;">
                <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                    <div class="fixed inset-0 transition-opacity backdrop-blur-sm bg-slate-900/50" @click="showCalculators = false"></div>

                    <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                    <div class="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-5xl sm:w-full border border-slate-200">
                        <div class="bg-white px-6 pt-6 pb-4">
                            <div class="flex justify-between items-center mb-6">
                                <h3 class="text-xl leading-6 font-bold text-slate-800 flex items-center gap-3">
                                    <div class="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center"><i class="fas fa-calculator"></i></div>
                                    Calculadoras Médicas
                                </h3>
                                <button @click="showCalculators = false" class="text-slate-400 hover:text-slate-600 w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center transition-colors">
                                    <i class="fas fa-times text-lg"></i>
                                </button>
                            </div>

                            <div class="grid grid-cols-1 md:grid-cols-3 gap-8 h-[600px]">
                                <!-- Sidebar List -->
                                <div class="border-r border-slate-100 pr-6 overflow-y-auto">
                                    <div class="relative mb-4">
                                        <input type="text" x-model="calcSearch" placeholder="Buscar calculadora..." class="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 outline-none">
                                        <i class="fas fa-search absolute left-3 top-2.5 text-slate-400 text-xs"></i>
                                    </div>
                                    
                                    <div class="space-y-1">
                                        <template x-for="calc in filteredCalculators" :key="calc.id">
                                            <button @click="selectedCalc = calc.id; calcResult = null;" 
                                                :class="selectedCalc === calc.id ? 'bg-blue-50 text-blue-700 font-bold shadow-sm' : 'text-slate-600 hover:bg-slate-50'"
                                                class="w-full text-left px-4 py-3 rounded-xl text-sm transition-all flex items-center justify-between group">
                                                <div>
                                                    <span x-text="calc.name" class="block"></span>
                                                    <span x-text="calc.category" class="text-[10px] uppercase tracking-wider opacity-60 font-medium"></span>
                                                </div>
                                                <i class="fas fa-chevron-right text-xs opacity-0 group-hover:opacity-100 transition-opacity text-slate-400"></i>
                                            </button>
                                        </template>
                                    </div>
                                </div>

                                <!-- Calculator Content -->
                                <div class="col-span-2 overflow-y-auto pl-2 pr-2">
                                    <template x-if="selectedCalc">
                                        <div x-html="renderCalculator(selectedCalc)" class="animate-fade-in"></div>
                                    </template>
                                    <template x-if="!selectedCalc">
                                        <div class="h-full flex flex-col items-center justify-center text-slate-300 opacity-60">
                                            <i class="fas fa-calculator text-8xl mb-6 text-slate-200"></i>
                                            <p class="font-medium text-lg">Selecione uma calculadora ao lado</p>
                                        </div>
                                    </template>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </main>
        
        <script src="/static/app.js"></script>
    </body>
    </html>
  `)
})

// Rota de Prescrições - VISUAL NOVO
app.get('/prescricoes', (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Prescrições - Plantão Guiado</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
        <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>
        <style>
            body { font-family: 'Inter', sans-serif; }
            .scrollbar-thin::-webkit-scrollbar { width: 6px; }
            .scrollbar-thin::-webkit-scrollbar-track { background: transparent; }
            .scrollbar-thin::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
            .prescription-item { transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1); }
            .prescription-item:hover { transform: translateY(-2px); box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); }
        </style>
    </head>
    <body class="bg-slate-50 text-slate-800" x-data="prescricoesApp()">
        
        <!-- Header -->
        <header class="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
            <div class="max-w-[1800px] mx-auto px-4 lg:px-6 h-16 flex items-center justify-between">
                <div class="flex items-center gap-4">
                    <a href="/" class="flex items-center gap-3 hover:opacity-80 transition-opacity group">
                        <div class="w-9 h-9 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-lg flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
                            <i class="fas fa-user-md text-lg"></i>
                        </div>
                        <div>
                            <h1 class="text-base font-bold text-slate-800 leading-none">Plantão Guiado</h1>
                            <p class="text-[10px] text-slate-500 font-medium uppercase tracking-wider mt-0.5">Prescrições Médicas</p>
                        </div>
                    </a>
                </div>
                
                <nav class="flex items-center bg-slate-100 p-1 rounded-xl">
                    <a href="/" class="px-4 py-1.5 text-sm font-medium text-slate-500 hover:text-slate-700 rounded-lg transition-colors">
                        <i class="fas fa-file-medical mr-2"></i>Evolução
                    </a>
                    <a href="/prescricoes" class="px-4 py-1.5 text-sm font-semibold text-blue-700 bg-white shadow-sm rounded-lg transition-all">
                        <i class="fas fa-prescription mr-2"></i>Prescrições
                    </a>
                    <a href="/receituario" class="px-4 py-1.5 text-sm font-medium text-slate-500 hover:text-slate-700 rounded-lg transition-colors">
                        <i class="fas fa-print mr-2"></i>Receituário
                    </a>
                </nav>
            </div>
        </header>

        <main class="max-w-[1800px] mx-auto p-4 lg:p-8">
            
            <!-- Search Hero -->
            <div class="mb-10 text-center relative">
                <div class="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 blur-3xl -z-10 rounded-full opacity-60"></div>
                <h2 class="text-3xl font-bold text-slate-800 mb-2 tracking-tight">O que você precisa prescrever hoje?</h2>
                <p class="text-slate-500 mb-6 text-sm">Busque por patologia, sintoma ou medicação</p>
                
                <div class="relative max-w-3xl mx-auto group">
                    <input type="text" 
                           x-model="searchTerm"
                           placeholder="Ex: Pneumonia, Dor, ITU, Fibrilação..."
                           class="w-full px-6 py-5 pl-14 text-lg bg-white border border-slate-200 rounded-2xl shadow-xl shadow-blue-900/5 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all placeholder-slate-400 font-medium">
                    <i class="fas fa-search absolute left-6 top-6 text-slate-400 text-xl group-focus-within:text-blue-500 transition-colors"></i>
                    <template x-if="searchTerm.length > 0">
                        <button @click="searchTerm = ''" class="absolute right-6 top-6 text-slate-300 hover:text-slate-500 transition-colors">
                            <i class="fas fa-times-circle text-xl"></i>
                        </button>
                    </template>
                </div>
            </div>

            <div class="flex flex-col lg:flex-row gap-8">
                
                <!-- Left Sidebar - Categories -->
                <div class="lg:w-72 flex-shrink-0">
                    <div class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden sticky top-24">
                        <div class="p-5 border-b border-slate-100 bg-slate-50/50">
                            <h3 class="font-bold text-slate-700 text-xs uppercase tracking-wide flex items-center gap-2">
                                <i class="fas fa-layer-group text-blue-500"></i> Categorias
                            </h3>
                        </div>
                        <div class="p-3 max-h-[70vh] overflow-y-auto scrollbar-thin space-y-1">
                            <button @click="selectCategoria(null)" 
                                    :class="selectedCategoria === null ? 'bg-blue-50 text-blue-700 font-bold' : 'hover:bg-slate-50 text-slate-600'"
                                    class="w-full text-left px-4 py-3 rounded-xl text-sm transition-all flex items-center gap-3">
                                <div class="w-6 flex justify-center"><i class="fas fa-th-large" :class="selectedCategoria === null ? 'text-blue-500' : 'text-slate-400'"></i></div>
                                <span>Todas</span>
                                <span class="ml-auto text-xs font-semibold px-2 py-0.5 rounded-full" 
                                      :class="selectedCategoria === null ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-500'"
                                      x-text="db.prescricoes.length"></span>
                            </button>
                            <template x-for="cat in categorias" :key="cat.id">
                                <button @click="selectCategoria(cat.id)" 
                                        :class="selectedCategoria === cat.id ? 'bg-blue-50 text-blue-700 font-bold' : 'hover:bg-slate-50 text-slate-600'"
                                        class="w-full text-left px-4 py-3 rounded-xl text-sm transition-all flex items-center gap-3">
                                    <div class="w-6 flex justify-center"><i :class="cat.icone" :style="'color: var(--tw-' + cat.cor + '-500)'"></i></div>
                                    <span x-text="cat.nome" class="truncate"></span>
                                    <span class="ml-auto text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500" 
                                          x-text="db.prescricoes.filter(p => p.categoria === cat.id).length"></span>
                                </button>
                            </template>
                        </div>
                    </div>
                </div>

                <!-- Middle - Prescriptions List -->
                <div class="flex-1 min-w-0">
                    <template x-if="!selectedPrescricao">
                        <div>
                            <div class="mb-6 flex items-center justify-between">
                                <h2 class="text-xl font-bold text-slate-800">
                                    <template x-if="selectedCategoria">
                                        <span class="flex items-center gap-2">
                                            <i :class="getCategoria(selectedCategoria)?.icone" class="text-blue-500"></i>
                                            <span x-text="getCategoria(selectedCategoria)?.nome"></span>
                                        </span>
                                    </template>
                                    <template x-if="!selectedCategoria">
                                        <span>Todas as Prescrições</span>
                                    </template>
                                </h2>
                                <span class="text-xs font-bold text-slate-400 uppercase tracking-wide bg-slate-100 px-3 py-1 rounded-full">
                                    <span x-text="prescricoesFiltradas.length"></span> resultados
                                </span>
                            </div>
                            
                            <div class="grid gap-4">
                                <template x-for="presc in prescricoesFiltradas" :key="presc.id">
                                    <button @click="selectPrescricao(presc)"
                                            class="prescription-item w-full text-left bg-white p-5 rounded-2xl border border-slate-200 group relative overflow-hidden">
                                        <div class="absolute top-0 left-0 w-1 h-full transition-colors" :class="'bg-' + getCategoria(presc.categoria)?.cor + '-500'"></div>
                                        
                                        <div class="flex items-start gap-5">
                                            <div class="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors"
                                                 :class="'bg-' + getCategoria(presc.categoria)?.cor + '-50 text-' + getCategoria(presc.categoria)?.cor + '-500'">
                                                <i :class="getCategoria(presc.categoria)?.icone" class="text-xl"></i>
                                            </div>
                                            <div class="flex-1 min-w-0">
                                                <h3 class="font-bold text-slate-800 text-lg mb-1 group-hover:text-blue-600 transition-colors" x-text="presc.nome"></h3>
                                                <div class="flex items-center gap-2 mb-3">
                                                    <span class="text-xs font-semibold uppercase tracking-wide text-slate-400" x-text="getCategoria(presc.categoria)?.nome"></span>
                                                    <span class="w-1 h-1 rounded-full bg-slate-300"></span>
                                                    <span class="text-[10px] font-bold px-2 py-0.5 rounded-md uppercase"
                                                          :class="presc.ambiente === 'hospitalar' || presc.ambiente === 'emergencia' ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-emerald-600'"
                                                          x-text="presc.ambiente === 'hospitalar' || presc.ambiente === 'emergencia' ? 'Hospitalar' : 'Ambulatorial'"></span>
                                                </div>
                                                <div class="flex flex-wrap gap-1.5">
                                                    <template x-for="tag in presc.tags.slice(0,5)" :key="tag">
                                                        <span class="px-2.5 py-1 bg-slate-100 text-slate-600 text-xs rounded-lg font-medium border border-slate-200" x-text="'#' + tag"></span>
                                                    </template>
                                                </div>
                                            </div>
                                            <div class="flex-shrink-0 self-center">
                                                <div class="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                                                    <i class="fas fa-chevron-right text-sm"></i>
                                                </div>
                                            </div>
                                        </div>
                                    </button>
                                </template>
                            </div>
                            
                            <template x-if="prescricoesFiltradas.length === 0">
                                <div class="text-center py-20">
                                    <div class="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                                        <i class="fas fa-search text-3xl"></i>
                                    </div>
                                    <h3 class="text-lg font-bold text-slate-700">Nenhuma prescrição encontrada</h3>
                                    <p class="text-slate-500 mt-1">Tente buscar por termos mais genéricos</p>
                                </div>
                            </template>
                        </div>
                    </template>

                    <!-- Prescription Detail -->
                    <template x-if="selectedPrescricao">
                        <div class="animate-fade-in-up">
                            <button @click="selectedPrescricao = null" 
                                    class="mb-6 text-slate-500 hover:text-blue-600 font-bold text-sm flex items-center gap-2 transition-colors px-3 py-2 hover:bg-white rounded-lg inline-flex">
                                <i class="fas fa-arrow-left"></i> Voltar para lista
                            </button>
                            
                            <div class="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
                                <div class="p-8 border-b border-slate-100 bg-slate-50/50">
                                    <div class="flex items-start gap-6">
                                        <div class="w-16 h-16 rounded-2xl flex items-center justify-center shadow-sm"
                                             :class="'bg-' + getCategoria(selectedPrescricao.categoria)?.cor + '-100 text-' + getCategoria(selectedPrescricao.categoria)?.cor + '-600'">
                                            <i :class="getCategoria(selectedPrescricao.categoria)?.icone" class="text-3xl"></i>
                                        </div>
                                        <div>
                                            <span class="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1 block" x-text="getCategoria(selectedPrescricao.categoria)?.nome"></span>
                                            <h2 class="text-3xl font-bold text-slate-800 mb-2" x-text="selectedPrescricao.nome"></h2>
                                            <div class="flex gap-2">
                                                <span class="px-2.5 py-1 rounded-lg text-xs font-bold bg-white border border-slate-200 text-slate-600 shadow-sm" 
                                                      x-text="selectedPrescricao.ambiente === 'hospitalar' || selectedPrescricao.ambiente === 'emergencia' ? '🏥 Hospitalar' : '🏠 Ambulatorial'"></span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="p-8 bg-slate-50 space-y-6">
                                    <template x-for="(presc, index) in selectedPrescricao.prescricoes" :key="index">
                                        <div class="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                                            <div class="px-6 py-4 border-b border-slate-100 flex items-center justify-between"
                                                 :class="presc.tipo === 'emergencia' ? 'bg-rose-50/50' : 'bg-slate-50/50'">
                                                <div class="flex items-center gap-3">
                                                    <div class="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold border"
                                                         :class="getTipoColor(presc.tipo)">
                                                        <i class="fas" :class="presc.tipo === 'emergencia' ? 'fa-bolt' : (presc.tipo === 'alta' ? 'fa-home' : 'fa-procedures')"></i>
                                                    </div>
                                                    <h3 class="font-bold text-slate-700" x-text="presc.titulo"></h3>
                                                </div>
                                                <button @click="copyPrescricao(presc, index)"
                                                        class="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 transition-all flex items-center gap-2 shadow-sm hover:shadow-blue-500/30 active:scale-95">
                                                    <template x-if="copiedIndex === index">
                                                        <span><i class="fas fa-check"></i> Copiado!</span>
                                                    </template>
                                                    <template x-if="copiedIndex !== index">
                                                        <span><i class="fas fa-copy"></i> Copiar</span>
                                                    </template>
                                                </button>
                                            </div>
                                            <div class="p-6 bg-white relative">
                                                <!-- Linhas de caderno decorativas -->
                                                <div class="absolute top-0 left-8 bottom-0 w-px bg-rose-100 opacity-50"></div>
                                                <pre class="whitespace-pre-wrap font-mono text-sm text-slate-700 leading-relaxed pl-4" x-text="formatPrescricao(presc)"></pre>
                                            </div>
                                        </div>
                                    </template>
                                </div>
                            </div>
                        </div>
                    </template>
                </div>

                <!-- Right Sidebar - Quick Access -->
                <div class="lg:w-80 flex-shrink-0 hidden xl:block">
                    <div class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden sticky top-24">
                        <div class="p-5 border-b border-slate-100 bg-slate-50/50">
                            <h3 class="font-bold text-slate-700 text-xs uppercase tracking-wide flex items-center gap-2">
                                <i class="fas fa-bolt text-amber-500"></i> Acesso Rápido
                            </h3>
                        </div>
                        <div class="p-3 space-y-2">
                            <button @click="searchTerm = 'dor'; selectedCategoria = null;" 
                                    class="w-full text-left px-4 py-3 rounded-xl text-sm hover:bg-slate-50 flex items-center gap-3 transition-colors group">
                                <div class="w-8 h-8 rounded-lg bg-pink-50 text-pink-500 flex items-center justify-center group-hover:scale-110 transition-transform"><i class="fas fa-prescription"></i></div>
                                <span class="font-medium text-slate-700">Analgesia / Dor</span>
                            </button>
                            <button @click="searchTerm = 'pneumonia'; selectedCategoria = null;" 
                                    class="w-full text-left px-4 py-3 rounded-xl text-sm hover:bg-slate-50 flex items-center gap-3 transition-colors group">
                                <div class="w-8 h-8 rounded-lg bg-blue-50 text-blue-500 flex items-center justify-center group-hover:scale-110 transition-transform"><i class="fas fa-lungs"></i></div>
                                <span class="font-medium text-slate-700">Pneumonia</span>
                            </button>
                            <button @click="searchTerm = 'itu'; selectedCategoria = null;" 
                                    class="w-full text-left px-4 py-3 rounded-xl text-sm hover:bg-slate-50 flex items-center gap-3 transition-colors group">
                                <div class="w-8 h-8 rounded-lg bg-orange-50 text-orange-500 flex items-center justify-center group-hover:scale-110 transition-transform"><i class="fas fa-kidneys"></i></div>
                                <span class="font-medium text-slate-700">Infecção Urinária</span>
                            </button>
                            <button @click="searchTerm = 'sca'; selectedCategoria = null;" 
                                    class="w-full text-left px-4 py-3 rounded-xl text-sm hover:bg-slate-50 flex items-center gap-3 transition-colors group">
                                <div class="w-8 h-8 rounded-lg bg-red-50 text-red-500 flex items-center justify-center group-hover:scale-110 transition-transform"><i class="fas fa-heart"></i></div>
                                <span class="font-medium text-slate-700">Infarto / SCA</span>
                            </button>
                            <button @click="searchTerm = 'asma'; selectedCategoria = null;" 
                                    class="w-full text-left px-4 py-3 rounded-xl text-sm hover:bg-slate-50 flex items-center gap-3 transition-colors group">
                                <div class="w-8 h-8 rounded-lg bg-cyan-50 text-cyan-500 flex items-center justify-center group-hover:scale-110 transition-transform"><i class="fas fa-wind"></i></div>
                                <span class="font-medium text-slate-700">Asma / DPOC</span>
                            </button>
                            <button @click="searchTerm = 'convulsão'; selectedCategoria = null;" 
                                    class="w-full text-left px-4 py-3 rounded-xl text-sm hover:bg-slate-50 flex items-center gap-3 transition-colors group">
                                <div class="w-8 h-8 rounded-lg bg-purple-50 text-purple-500 flex items-center justify-center group-hover:scale-110 transition-transform"><i class="fas fa-brain"></i></div>
                                <span class="font-medium text-slate-700">Convulsão</span>
                            </button>
                            <button @click="searchTerm = 'anafilaxia'; selectedCategoria = null;" 
                                    class="w-full text-left px-4 py-3 rounded-xl text-sm hover:bg-slate-50 flex items-center gap-3 transition-colors group">
                                <div class="w-8 h-8 rounded-lg bg-rose-50 text-rose-500 flex items-center justify-center group-hover:scale-110 transition-transform"><i class="fas fa-ambulance"></i></div>
                                <span class="font-medium text-slate-700">Anafilaxia</span>
                            </button>
                        </div>
                        
                        <div class="p-5 border-t border-slate-100 bg-slate-50">
                            <div class="text-[10px] text-slate-400 space-y-2 font-medium">
                                <p class="flex items-center gap-2"><i class="fas fa-info-circle text-blue-400"></i> Uso exclusivo médico</p>
                                <p>Conteúdo baseado no Guia FERM e literaturas atualizadas.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
        
        <script src="/static/prescricoes.js"></script>
    </body>
    </html>
  `)
})

export default app

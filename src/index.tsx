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

// Rota de Login (GET)
app.get('/login', (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Login - Plantão Guiado</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    </head>
    <body class="bg-gray-100 flex items-center justify-center h-screen">
        <div class="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full border border-gray-200">
            <div class="flex flex-col items-center mb-6">
                <div class="w-16 h-16 bg-[#005f8f] rounded-xl flex items-center justify-center text-white mb-3 shadow-md">
                     <i class="fas fa-user-md text-3xl"></i>
                </div>
                <h1 class="text-2xl font-bold text-gray-800">Plantão Guiado</h1>
                <p class="text-sm text-gray-500">Acesso Restrito</p>
            </div>
            
            <form action="/login" method="post" class="space-y-4">
                <div>
                    <label class="block text-sm font-bold text-gray-700 mb-1">Usuário</label>
                    <div class="relative">
                        <i class="fas fa-user absolute left-3 top-3 text-gray-400"></i>
                        <input type="text" name="username" class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" placeholder="Digite seu usuário" required>
                    </div>
                </div>
                <div>
                    <label class="block text-sm font-bold text-gray-700 mb-1">Senha</label>
                    <div class="relative">
                        <i class="fas fa-lock absolute left-3 top-3 text-gray-400"></i>
                        <input type="password" name="password" class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" placeholder="Digite sua senha" required>
                    </div>
                </div>
                <button type="submit" class="w-full bg-[#005f8f] text-white font-bold py-2 rounded-lg hover:bg-[#004a70] transition-colors shadow-sm">
                    ENTRAR <i class="fas fa-sign-in-alt ml-2"></i>
                </button>
            </form>
            <div class="mt-6 text-center text-xs text-gray-400">
                &copy; 2024 Sistema Médico
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

  // Verificação simples no banco (ou hardcoded se o banco falhar na sandbox)
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
    // Fallback para admin/medico123 se o banco não estiver migrado
    if (username === 'admin' && password === 'medico123') {
         setCookie(c, 'auth_user', 'admin', { path: '/', maxAge: 86400 })
         return c.redirect('/')
    }
  }

  return c.html('Login Inválido <a href="/login">Tentar novamente</a>')
})

app.get('/', (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Plantão Guiado - PS Clínica Médica</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
        <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>
        <style type="text/tailwindcss">
            .form-section {
                @apply bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6;
            }
            .form-label {
                @apply block text-sm font-semibold text-gray-600 mb-1 uppercase tracking-wide;
            }
            .form-input {
                @apply w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors;
            }
            .checkbox-wrapper {
                @apply flex items-center space-x-2 text-gray-700 cursor-pointer select-none;
            }
            .tab-active {
                @apply bg-[#005f8f] text-white border-[#005f8f];
            }
            .tab-inactive {
                @apply bg-white text-gray-600 border-gray-200 hover:bg-gray-50;
            }
            .preview-scroll::-webkit-scrollbar {
                width: 6px;
            }
            .preview-scroll::-webkit-scrollbar-track {
                background: #f1f1f1;
            }
            .preview-scroll::-webkit-scrollbar-thumb {
                background: #cbd5e1;
                border-radius: 3px;
            }
            .scrollbar-hide::-webkit-scrollbar {
                display: none;
            }
            .scrollbar-hide {
                -ms-overflow-style: none;
                scrollbar-width: none;
            }
        </style>
    </head>
    <body class="bg-gray-50 text-gray-800" x-data="medicalForm()">
        
        <header class="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
            <div class="max-w-[1600px] mx-auto px-4 lg:px-6 h-16 flex items-center justify-between">
                <div class="flex items-center">
                    <div class="w-10 h-10 bg-[#005f8f] rounded-lg flex items-center justify-center text-white mr-3 shadow-sm">
                         <i class="fas fa-user-md text-xl"></i>
                    </div>
                    <div>
                        <h1 class="text-lg font-bold text-gray-800 leading-tight">Plantão Guiado</h1>
                        <p class="text-xs text-gray-500 font-medium">Sistema de Evolução Médica</p>
                    </div>
                </div>
                <nav class="flex items-center gap-2">
                    <a href="/" class="px-4 py-2 text-sm font-medium text-white bg-[#005f8f] rounded-lg">
                        <i class="fas fa-file-medical mr-2"></i>Evolução
                    </a>
                    <a href="/prescricoes" class="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors">
                        <i class="fas fa-prescription mr-2"></i>Prescrições
                    </a>
                </nav>
            </div>
        </header>

        <main class="max-w-[1600px] mx-auto p-4 lg:p-6 flex flex-col lg:flex-row gap-6">
            
            <!-- LEFT COLUMN -->
            <div class="flex-1 min-w-0 pb-20">
                
                <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6 text-center">
                    <h2 class="text-xl font-bold text-gray-700 mb-4 uppercase flex items-center justify-center gap-2">
                        <i class="fas fa-hospital-alt text-[#005f8f]"></i>
                        PS Clínica Médica - <span x-text="form.shift"></span>
                    </h2>
                    
                    <div class="flex flex-col gap-4">
                        <!-- Shift Selector -->
                        <div class="flex justify-center gap-2 mb-2">
                            <button @click="form.shift = 'PLANTÃO DIURNO'" :class="form.shift === 'PLANTÃO DIURNO' ? 'bg-yellow-100 text-yellow-800 border-yellow-200 ring-2 ring-yellow-400' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'" class="px-4 py-1.5 rounded-full text-xs font-bold border transition-all flex items-center gap-2">
                                <i class="fas fa-sun"></i> Diurno
                            </button>
                            <button @click="form.shift = 'PLANTÃO NOTURNO'" :class="form.shift === 'PLANTÃO NOTURNO' ? 'bg-indigo-100 text-indigo-800 border-indigo-200 ring-2 ring-indigo-400' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'" class="px-4 py-1.5 rounded-full text-xs font-bold border transition-all flex items-center gap-2">
                                <i class="fas fa-moon"></i> Noturno
                            </button>
                        </div>

                        <div class="flex flex-col sm:flex-row justify-center gap-4">
                            <button class="px-6 py-3 rounded-lg font-bold text-sm border shadow-sm transition-all tab-active flex items-center justify-center gap-2 transform active:scale-95">
                                <i class="fas fa-stethoscope"></i> Padrão / Ambulatorial
                            </button>
                            <button class="px-6 py-3 rounded-lg font-bold text-sm border shadow-sm transition-all tab-inactive flex items-center justify-center gap-2 opacity-60 hover:opacity-100">
                                <i class="fas fa-ambulance"></i> Trauma / Emergência
                            </button>
                        </div>
                    </div>
                </div>

                <!-- 1. IDENTIFICATION -->
                <div class="form-section relative overflow-hidden group hover:shadow-md transition-shadow">
                    <div class="absolute top-0 left-0 w-1 h-full bg-gray-300 group-hover:bg-[#005f8f] transition-colors"></div>
                    <div class="grid grid-cols-12 gap-4">
                        <div class="col-span-12 md:col-span-6">
                            <label class="form-label">Nome</label>
                            <input type="text" x-model="form.name" class="form-input" placeholder="Nome do Paciente">
                        </div>
                        <div class="col-span-6 md:col-span-3">
                            <label class="form-label">Idade</label>
                            <div class="relative">
                                <input type="number" x-model="form.age" class="form-input" placeholder="Anos">
                                <span class="absolute right-3 top-2.5 text-gray-400 text-sm">anos</span>
                            </div>
                        </div>
                        <div class="col-span-6 md:col-span-3">
                            <label class="form-label">Sexo</label>
                            <select x-model="form.gender" class="form-input bg-white">
                                <option value="Masculino">Masculino</option>
                                <option value="Feminino">Feminino</option>
                            </select>
                        </div>
                    </div>
                    
                    <div class="mt-4">
                        <label class="form-label">Admissão</label>
                        <div class="relative">
                             <select x-model="form.admission" class="form-input appearance-none bg-white">
                                <option value="Demanda Espontânea">Demanda Espontânea</option>
                                <option value="Pronto-atendimento">Pronto-atendimento</option>
                                <option value="Regulação (SAMU/Bombeiros)">Regulação (SAMU/Bombeiros)</option>
                                <option value="Retorno">Retorno</option>
                                <option value="Encaminhamento">Encaminhamento</option>
                            </select>
                            <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                <i class="fas fa-chevron-down text-xs"></i>
                            </div>
                        </div>
                    </div>

                    <div class="mt-6">
                        <label class="form-label mb-3">Hábitos de Vida</label>
                        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <label class="checkbox-wrapper p-2 rounded hover:bg-gray-50 transition-colors">
                                <input type="checkbox" x-model="form.habits.smoker" class="w-4 h-4 text-blue-600 rounded focus:ring-blue-500">
                                <span class="text-sm font-medium">Tabagista</span>
                            </label>
                            <label class="checkbox-wrapper p-2 rounded hover:bg-gray-50 transition-colors">
                                <input type="checkbox" x-model="form.habits.alcoholic" class="w-4 h-4 text-blue-600 rounded focus:ring-blue-500">
                                <span class="text-sm font-medium">Etilista</span>
                            </label>
                            <label class="checkbox-wrapper p-2 rounded hover:bg-gray-50 transition-colors">
                                <input type="checkbox" x-model="form.habits.drugs" class="w-4 h-4 text-blue-600 rounded focus:ring-blue-500">
                                <span class="text-sm font-medium">Drogas</span>
                            </label>
                            <label class="checkbox-wrapper p-2 rounded hover:bg-gray-50 transition-colors">
                                <input type="checkbox" x-model="form.habits.sedentary" class="w-4 h-4 text-blue-600 rounded focus:ring-blue-500">
                                <span class="text-sm font-medium">Sedentário</span>
                            </label>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                        <div>
                            <label class="form-label">Comorbidades</label>
                            <textarea x-model="form.comorbidities" class="form-input h-24 resize-none text-sm leading-relaxed" placeholder="HAS, DM..."></textarea>
                        </div>
                        <div>
                            <label class="form-label">Alergias</label>
                            <textarea x-model="form.allergies" class="form-input h-24 resize-none text-sm leading-relaxed" placeholder="Medicamentos, alimentos..."></textarea>
                        </div>
                        <div>
                            <label class="form-label">Cirurgias Prévias</label>
                            <textarea x-model="form.surgeries" class="form-input h-24 resize-none text-sm leading-relaxed" placeholder="Colecistectomia..."></textarea>
                        </div>
                    </div>
                </div>

                <!-- 2. MEDICATIONS -->
                <div class="form-section border-l-4 border-l-[#005f8f] hover:shadow-md transition-shadow">
                    <div class="flex items-center gap-2 mb-4 text-[#005f8f]">
                        <i class="fas fa-pills text-lg"></i>
                        <h3 class="font-bold uppercase tracking-wide">Medicação Contínua</h3>
                    </div>
                    
                    <div class="flex flex-col sm:flex-row gap-2 mb-4 bg-blue-50 p-3 rounded-lg border border-blue-100">
                        <div class="flex-grow">
                            <label class="text-xs text-blue-700 uppercase font-bold mb-1 block">Nome e Dose</label>
                            <input type="text" x-model="newMed.name" class="form-input border-blue-200 focus:border-blue-400" placeholder="Ex: Losartana 50mg" @keydown.enter="addMed()">
                        </div>
                        <div class="sm:w-32">
                            <label class="text-xs text-blue-700 uppercase font-bold mb-1 block">Posologia</label>
                            <input type="text" x-model="newMed.posology" class="form-input border-blue-200 focus:border-blue-400" placeholder="1-0-1" @keydown.enter="addMed()">
                        </div>
                        <div class="flex items-end">
                            <button @click="addMed()" class="h-[42px] w-full sm:w-[42px] bg-[#005f8f] text-white rounded-md hover:bg-[#004a70] transition-colors flex items-center justify-center shadow-sm">
                                <i class="fas fa-plus"></i>
                            </button>
                        </div>
                    </div>

                    <div class="space-y-2">
                        <template x-if="form.medications.length === 0">
                            <p class="text-sm text-gray-400 italic text-center py-4 bg-gray-50 rounded border border-dashed border-gray-200">Nenhuma medicação adicionada.</p>
                        </template>

                        <template x-for="(med, index) in form.medications" :key="index">
                            <div class="flex items-center justify-between bg-white px-4 py-3 rounded border border-gray-200 shadow-sm group hover:border-blue-300 transition-colors">
                                <div class="flex items-center">
                                    <div class="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mr-3 text-xs font-bold">
                                        <i class="fas fa-capsules"></i>
                                    </div>
                                    <div>
                                        <span class="font-bold text-gray-700 block" x-text="med.name"></span>
                                        <span class="text-xs text-gray-500 font-medium bg-gray-100 px-2 py-0.5 rounded" x-text="med.posology"></span>
                                    </div>
                                </div>
                                <button @click="removeMed(index)" class="text-gray-400 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-red-50">
                                    <i class="fas fa-trash-alt"></i>
                                </button>
                            </div>
                        </template>
                    </div>
                </div>

                <!-- 3. SUBJECTIVE (S) -->
                <div class="form-section border-l-4 border-l-[#005f8f] hover:shadow-md transition-shadow">
                    <div class="flex items-center justify-between mb-4">
                        <div class="flex items-center gap-2 text-[#005f8f]">
                            <span class="bg-[#005f8f] text-white font-bold w-6 h-6 flex items-center justify-center rounded text-xs">S</span>
                            <h3 class="font-bold uppercase tracking-wide">Subjetivo</h3>
                        </div>
                    </div>

                    <div class="mb-4">
                        <label class="form-label">Queixa Principal (QP)</label>
                        <input type="text" x-model="form.subjective.qp" class="form-input" placeholder="Digite a queixa...">
                    </div>

                    <div class="mb-4 relative">
                        <label class="form-label">História da Doença Atual (HDA)</label>
                        <textarea x-model="form.subjective.hda" class="form-input h-32 leading-relaxed" placeholder="Descrição livre da história clínica..."></textarea>
                    </div>

                    <div class="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <label class="form-label mb-3 text-xs text-gray-500">Sintomas Negados</label>
                        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                            <label class="checkbox-wrapper"><input type="checkbox" x-model="form.negatives.fever" class="rounded text-blue-600"> <span>Febre</span></label>
                            <label class="checkbox-wrapper"><input type="checkbox" x-model="form.negatives.headache" class="rounded text-blue-600"> <span>Cefaleia</span></label>
                            <label class="checkbox-wrapper"><input type="checkbox" x-model="form.negatives.dizziness" class="rounded text-blue-600"> <span>Tontura</span></label>
                            <label class="checkbox-wrapper"><input type="checkbox" x-model="form.negatives.dyspnea" class="rounded text-blue-600"> <span>Falta de Ar</span></label>
                            <label class="checkbox-wrapper"><input type="checkbox" x-model="form.negatives.chestPain" class="rounded text-blue-600"> <span>Dor Torácica</span></label>
                            <label class="checkbox-wrapper"><input type="checkbox" x-model="form.negatives.nausea" class="rounded text-blue-600"> <span>Náuseas</span></label>
                            <label class="checkbox-wrapper"><input type="checkbox" x-model="form.negatives.intestine" class="rounded text-blue-600"> <span>Alt. Intestinais</span></label>
                            <label class="checkbox-wrapper"><input type="checkbox" x-model="form.negatives.urinary" class="rounded text-blue-600"> <span>Alt. Urinárias</span></label>
                        </div>
                    </div>
                </div>

                <!-- 4. OBJECTIVE (O) -->
                <div class="form-section border-l-4 border-l-green-600 hover:shadow-md transition-shadow">
                    <div class="flex items-center gap-2 mb-6 text-green-700">
                        <span class="bg-green-600 text-white font-bold w-6 h-6 flex items-center justify-center rounded text-xs">O</span>
                        <h3 class="font-bold uppercase tracking-wide">Objetivo</h3>
                    </div>

                    <div class="bg-green-50 p-4 rounded-lg border border-green-100 mb-6">
                        <label class="form-label text-green-800 mb-3">Sinais Vitais</label>
                        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                            <div><label class="text-[10px] font-bold text-green-700 mb-1 block uppercase">PA</label><div class="relative"><input type="text" x-model="form.vitals.pa" class="form-input text-center font-bold text-gray-700 h-9 p-1" placeholder="-"><span class="absolute right-1 top-2 text-green-400 text-[10px] pointer-events-none">mmHg</span></div></div>
                            <div><label class="text-[10px] font-bold text-green-700 mb-1 block uppercase">FC</label><div class="relative"><input type="number" x-model="form.vitals.fc" class="form-input text-center font-bold text-gray-700 h-9 p-1" placeholder="-"><span class="absolute right-1 top-2 text-green-400 text-[10px] pointer-events-none">bpm</span></div></div>
                            <div><label class="text-[10px] font-bold text-green-700 mb-1 block uppercase">FR</label><div class="relative"><input type="number" x-model="form.vitals.fr" class="form-input text-center font-bold text-gray-700 h-9 p-1" placeholder="-"><span class="absolute right-1 top-2 text-green-400 text-[10px] pointer-events-none">irpm</span></div></div>
                            <div><label class="text-[10px] font-bold text-green-700 mb-1 block uppercase">Temp</label><div class="relative"><input type="number" x-model="form.vitals.temp" class="form-input text-center font-bold text-gray-700 h-9 p-1" placeholder="-"><span class="absolute right-1 top-2 text-green-400 text-[10px] pointer-events-none">°C</span></div></div>
                            <div><label class="text-[10px] font-bold text-green-700 mb-1 block uppercase">SatO2</label><div class="relative"><input type="number" x-model="form.vitals.sat" class="form-input text-center font-bold text-gray-700 h-9 p-1" placeholder="-"><span class="absolute right-1 top-2 text-green-400 text-[10px] pointer-events-none">%</span></div></div>
                            <div><label class="text-[10px] font-bold text-green-700 mb-1 block uppercase">HGT</label><div class="relative"><input type="number" x-model="form.vitals.hgt" class="form-input text-center font-bold text-gray-700 h-9 p-1" placeholder="-"><span class="absolute right-1 top-2 text-green-400 text-[10px] pointer-events-none">mg</span></div></div>
                        </div>
                    </div>

                    <div class="flex items-center justify-between mb-4">
                        <h4 class="font-bold text-gray-700 text-sm uppercase flex items-center gap-2">
                            <i class="fas fa-user-injured text-gray-400"></i> Exame Físico
                        </h4>
                        <!-- Quick Calculator Buttons -->
                        <div class="flex flex-wrap gap-1">
                            <button @click="selectedCalc = 'glasgow'; showCalculators = true;" class="text-[9px] px-2 py-1 bg-purple-50 border border-purple-200 text-purple-700 rounded hover:bg-purple-100 transition-all font-bold">
                                <i class="fas fa-brain mr-1"></i>Glasgow
                            </button>
                            <button @click="selectedCalc = 'curb65'; showCalculators = true;" class="text-[9px] px-2 py-1 bg-orange-50 border border-orange-200 text-orange-700 rounded hover:bg-orange-100 transition-all font-bold">
                                <i class="fas fa-lungs mr-1"></i>CURB-65
                            </button>
                            <button @click="selectedCalc = 'wells_tep'; showCalculators = true;" class="text-[9px] px-2 py-1 bg-pink-50 border border-pink-200 text-pink-700 rounded hover:bg-pink-100 transition-all font-bold">
                                <i class="fas fa-lungs-virus mr-1"></i>Wells TEP
                            </button>
                            <button @click="selectedCalc = 'wells_tvp'; showCalculators = true;" class="text-[9px] px-2 py-1 bg-indigo-50 border border-indigo-200 text-indigo-700 rounded hover:bg-indigo-100 transition-all font-bold">
                                <i class="fas fa-shoe-prints mr-1"></i>Wells TVP
                            </button>
                        </div>
                    </div>
                    
                    <div class="space-y-5">
                        <!-- Estado Geral -->
                        <div class="relative group">
                            <div class="flex justify-between items-center mb-1">
                                <label class="text-xs font-bold text-gray-500 uppercase">Estado Geral</label>
                                <button @click="setNormal('general')" class="text-[10px] px-2 py-0.5 border border-green-500 text-green-600 rounded bg-white hover:bg-green-500 hover:text-white uppercase font-bold transition-all shadow-sm">
                                    <i class="fas fa-check mr-1"></i> Normal
                                </button>
                            </div>
                            <input type="text" x-model="form.exam.general" class="form-input transition-all focus:ring-green-500 focus:border-green-500" placeholder="Descreva Estado Geral...">
                        </div>

                        <!-- Cardíaco -->
                        <div class="relative group">
                            <div class="flex justify-between items-center mb-1">
                                <div class="flex items-center gap-2">
                                    <label class="text-xs font-bold text-gray-500 uppercase">Cardíaco</label>
                                    <button @click="selectedCalc = 'chads'; showCalculators = true;" class="text-[9px] px-1.5 py-0.5 bg-red-50 border border-red-200 text-red-600 rounded hover:bg-red-100 transition-all" title="CHA2DS2-VASc">
                                        <i class="fas fa-heartbeat"></i> CHADS
                                    </button>
                                    <button @click="selectedCalc = 'has_bled'; showCalculators = true;" class="text-[9px] px-1.5 py-0.5 bg-red-50 border border-red-200 text-red-600 rounded hover:bg-red-100 transition-all" title="HAS-BLED">
                                        <i class="fas fa-tint"></i> HAS-BLED
                                    </button>
                                </div>
                                <button @click="setNormal('cardiac')" class="text-[10px] px-2 py-0.5 border border-green-500 text-green-600 rounded bg-white hover:bg-green-500 hover:text-white uppercase font-bold transition-all shadow-sm">
                                    <i class="fas fa-check mr-1"></i> Normal
                                </button>
                            </div>
                            <input type="text" x-model="form.exam.cardiac" class="form-input transition-all focus:ring-green-500 focus:border-green-500" placeholder="Descreva Cardíaco...">
                        </div>

                        <!-- Pulmonar -->
                        <div class="relative group">
                            <div class="flex justify-between items-center mb-1">
                                <div class="flex items-center gap-2">
                                    <label class="text-xs font-bold text-gray-500 uppercase">Pulmonar</label>
                                    <button @click="selectedCalc = 'curb65'; showCalculators = true;" class="text-[9px] px-1.5 py-0.5 bg-orange-50 border border-orange-200 text-orange-600 rounded hover:bg-orange-100 transition-all" title="CURB-65">
                                        <i class="fas fa-lungs"></i> CURB-65
                                    </button>
                                    <button @click="selectedCalc = 'perc'; showCalculators = true;" class="text-[9px] px-1.5 py-0.5 bg-green-50 border border-green-200 text-green-600 rounded hover:bg-green-100 transition-all" title="PERC">
                                        <i class="fas fa-check-circle"></i> PERC
                                    </button>
                                </div>
                                <button @click="setNormal('pulmonary')" class="text-[10px] px-2 py-0.5 border border-green-500 text-green-600 rounded bg-white hover:bg-green-500 hover:text-white uppercase font-bold transition-all shadow-sm">
                                    <i class="fas fa-check mr-1"></i> Normal
                                </button>
                            </div>
                            <input type="text" x-model="form.exam.pulmonary" class="form-input transition-all focus:ring-green-500 focus:border-green-500" placeholder="Descreva Pulmonar...">
                        </div>

                        <!-- Abdominal -->
                        <div class="relative group">
                            <div class="flex justify-between items-center mb-1">
                                <label class="text-xs font-bold text-gray-500 uppercase">Abdominal</label>
                                <button @click="setNormal('abdominal')" class="text-[10px] px-2 py-0.5 border border-green-500 text-green-600 rounded bg-white hover:bg-green-500 hover:text-white uppercase font-bold transition-all shadow-sm">
                                    <i class="fas fa-check mr-1"></i> Normal
                                </button>
                            </div>
                            <input type="text" x-model="form.exam.abdominal" class="form-input transition-all focus:ring-green-500 focus:border-green-500" placeholder="Descreva Abdominal...">
                        </div>

                        <!-- Neurológico -->
                        <div class="relative group">
                            <div class="flex justify-between items-center mb-1">
                                <div class="flex items-center gap-2">
                                    <label class="text-xs font-bold text-gray-500 uppercase">Neurológico</label>
                                    <button @click="selectedCalc = 'glasgow'; showCalculators = true;" class="text-[9px] px-1.5 py-0.5 bg-purple-50 border border-purple-200 text-purple-600 rounded hover:bg-purple-100 transition-all" title="Glasgow">
                                        <i class="fas fa-brain"></i> Glasgow
                                    </button>
                                    <button @click="selectedCalc = 'nihss'; showCalculators = true;" class="text-[9px] px-1.5 py-0.5 bg-purple-50 border border-purple-200 text-purple-600 rounded hover:bg-purple-100 transition-all" title="NIHSS">
                                        <i class="fas fa-head-side-virus"></i> NIHSS
                                    </button>
                                </div>
                                <button @click="setNormal('neuro')" class="text-[10px] px-2 py-0.5 border border-green-500 text-green-600 rounded bg-white hover:bg-green-500 hover:text-white uppercase font-bold transition-all shadow-sm">
                                    <i class="fas fa-check mr-1"></i> Normal
                                </button>
                            </div>
                            <input type="text" x-model="form.exam.neuro" class="form-input transition-all focus:ring-green-500 focus:border-green-500" placeholder="Descreva Neurológico...">
                        </div>

                        <!-- Extremidades -->
                        <div class="relative group">
                            <div class="flex justify-between items-center mb-1">
                                <div class="flex items-center gap-2">
                                    <label class="text-xs font-bold text-gray-500 uppercase">Extremidades</label>
                                    <button @click="selectedCalc = 'wells_tvp'; showCalculators = true;" class="text-[9px] px-1.5 py-0.5 bg-indigo-50 border border-indigo-200 text-indigo-600 rounded hover:bg-indigo-100 transition-all" title="Wells TVP">
                                        <i class="fas fa-shoe-prints"></i> Wells TVP
                                    </button>
                                </div>
                                <button @click="setNormal('extremities')" class="text-[10px] px-2 py-0.5 border border-green-500 text-green-600 rounded bg-white hover:bg-green-500 hover:text-white uppercase font-bold transition-all shadow-sm">
                                    <i class="fas fa-check mr-1"></i> Normal
                                </button>
                            </div>
                            <input type="text" x-model="form.exam.extremities" class="form-input transition-all focus:ring-green-500 focus:border-green-500" placeholder="Descreva Extremidades (edema, perfusão, pulsos)...">
                        </div>
                    </div>

                    <!-- Exame Físico Adicional -->
                    <div class="mt-6 pt-4 border-t border-gray-200">
                        <div class="flex items-center justify-between mb-3">
                            <h4 class="text-xs font-bold text-gray-500 uppercase flex items-center gap-2">
                                <i class="fas fa-plus-circle text-gray-400"></i> Exame Físico Adicional
                            </h4>
                            <div class="relative" x-data="{ open: false }">
                                <button @click="open = !open" class="text-[10px] px-3 py-1 bg-blue-50 border border-blue-200 text-blue-600 rounded hover:bg-blue-100 transition-all font-bold">
                                    <i class="fas fa-plus mr-1"></i> Adicionar Exame
                                </button>
                                <!-- Dropdown de opções -->
                                <div x-show="open" @click.away="open = false" 
                                     x-transition:enter="transition ease-out duration-100"
                                     x-transition:enter-start="opacity-0 scale-95"
                                     x-transition:enter-end="opacity-100 scale-100"
                                     class="absolute right-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10 py-1">
                                    <template x-for="opt in additionalExamOptions" :key="opt.id">
                                        <button @click="addAdditionalExam(opt.id, opt.label); open = false;" 
                                                x-show="!form.exam.additional.some(e => e.id === opt.id)"
                                                class="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex items-center gap-2">
                                            <i :class="opt.icon" class="text-gray-400 w-4"></i>
                                            <span x-text="opt.label"></span>
                                        </button>
                                    </template>
                                    <div class="border-t border-gray-100 mt-1 pt-1">
                                        <button @click="addCustomExam(); open = false;" 
                                                class="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex items-center gap-2 text-blue-600">
                                            <i class="fas fa-edit w-4"></i>
                                            <span>Outro (personalizado)</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Lista de exames adicionais -->
                        <div class="space-y-3">
                            <template x-for="(exam, index) in form.exam.additional" :key="index">
                                <div class="relative group bg-gray-50 p-3 rounded-lg border border-gray-200">
                                    <div class="flex justify-between items-center mb-1">
                                        <div class="flex items-center gap-2">
                                            <label class="text-xs font-bold text-gray-600 uppercase" x-text="exam.label"></label>
                                            <button @click="setAdditionalNormal(index)" class="text-[10px] px-2 py-0.5 border border-green-500 text-green-600 rounded bg-white hover:bg-green-500 hover:text-white uppercase font-bold transition-all shadow-sm">
                                                <i class="fas fa-check mr-1"></i> Normal
                                            </button>
                                        </div>
                                        <button @click="removeAdditionalExam(index)" class="text-gray-400 hover:text-red-500 transition-colors p-1">
                                            <i class="fas fa-times"></i>
                                        </button>
                                    </div>
                                    <input type="text" x-model="exam.value" class="form-input text-sm" :placeholder="'Descreva ' + exam.label + '...'">
                                </div>
                            </template>
                            
                            <template x-if="form.exam.additional.length === 0">
                                <p class="text-xs text-gray-400 italic text-center py-3">
                                    Clique em "Adicionar Exame" para incluir otoscopia, oroscopia, etc.
                                </p>
                            </template>
                        </div>
                    </div>

                    <!-- Additional Calculators Row -->
                    <div class="mt-4 pt-4 border-t border-gray-100">
                        <div class="flex flex-wrap gap-2 justify-center">
                            <button @click="selectedCalc = 'ckd'; showCalculators = true;" class="text-[10px] px-3 py-1.5 bg-blue-50 border border-blue-200 text-blue-700 rounded-full hover:bg-blue-100 transition-all font-medium">
                                <i class="fas fa-kidneys mr-1"></i> TFG (CKD-EPI)
                            </button>
                            <button @click="selectedCalc = 'imc'; showCalculators = true;" class="text-[10px] px-3 py-1.5 bg-green-50 border border-green-200 text-green-700 rounded-full hover:bg-green-100 transition-all font-medium">
                                <i class="fas fa-weight mr-1"></i> IMC
                            </button>
                            <button @click="showCalculators = true; selectedCalc = null;" class="text-[10px] px-3 py-1.5 bg-gray-50 border border-gray-200 text-gray-700 rounded-full hover:bg-gray-100 transition-all font-medium">
                                <i class="fas fa-calculator mr-1"></i> Todas Calculadoras
                            </button>
                        </div>
                    </div>
                </div>
                
                <!-- 5. COMPLEMENTARY EXAMS -->
                <div class="form-section hover:shadow-md transition-shadow">
                     <h4 class="font-bold text-gray-700 mb-3 text-sm uppercase flex items-center gap-2">
                        <i class="fas fa-microscope text-gray-400"></i> Exames Complementares
                     </h4>
                     
                     <div class="space-y-4">
                         <div>
                             <label class="text-xs font-bold text-gray-500 uppercase mb-1 block">Laboratoriais</label>
                             <textarea x-model="form.complementary.labs" class="form-input h-20 resize-none text-sm" placeholder="Hb, Leuco, Plaquetas..."></textarea>
                         </div>
                         <div>
                             <label class="text-xs font-bold text-gray-500 uppercase mb-1 block">Imagem (RX, USG, TC)</label>
                             <textarea x-model="form.complementary.imaging" class="form-input h-20 resize-none text-sm" placeholder="Laudos importantes..."></textarea>
                         </div>
                     </div>
                </div>

                <!-- 6. ASSESSMENT (A) -->
                <div class="form-section border-l-4 border-l-orange-400 hover:shadow-md transition-shadow">
                    <div class="flex items-center gap-2 mb-4 text-orange-500">
                        <span class="bg-orange-500 text-white font-bold w-6 h-6 flex items-center justify-center rounded text-xs">A</span>
                        <h3 class="font-bold uppercase tracking-wide">Avaliação</h3>
                    </div>
                    
                    <div class="flex flex-col sm:flex-row gap-2 relative">
                        <div class="flex-grow w-full relative" @click.away="cidResults = []; cidError = ''">
                            <label class="text-xs font-bold text-gray-500 uppercase mb-1 block">
                                Hipótese Diagnóstica (CID-10)
                                <span class="text-gray-400 font-normal ml-1">- Busca automática</span>
                            </label>
                            <div class="relative">
                                <input type="text" 
                                    x-model="cidSearch" 
                                    @input.debounce.400ms="searchCID()" 
                                    class="form-input border-orange-200 focus:border-orange-500 focus:ring-orange-200 pl-10 pr-10" 
                                    placeholder="Digite código (ex: J06) ou nome (ex: gripe, pneumonia)...">
                                <i class="fas fa-search absolute left-3 top-3 text-orange-400"></i>
                                <!-- Loading indicator -->
                                <div x-show="cidLoading" class="absolute right-3 top-3">
                                    <i class="fas fa-spinner fa-spin text-orange-400"></i>
                                </div>
                            </div>
                            
                            <!-- Helper text -->
                            <p class="text-[10px] text-gray-400 mt-1">
                                <i class="fas fa-info-circle mr-1"></i>
                                Digite pelo menos 2 caracteres para buscar. Ex: "tosse", "R05", "pneumonia", "I10"
                            </p>
                            
                            <!-- Error message -->
                            <div x-show="cidError" class="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-700">
                                <i class="fas fa-exclamation-triangle mr-1"></i>
                                <span x-text="cidError"></span>
                            </div>
                            
                            <!-- CID Autocomplete Dropdown -->
                            <div x-show="cidResults.length > 0" 
                                 x-transition:enter="transition ease-out duration-100"
                                 x-transition:enter-start="opacity-0 transform scale-95"
                                 x-transition:enter-end="opacity-100 transform scale-100"
                                 class="absolute z-20 w-full bg-white border border-orange-200 rounded-lg shadow-xl mt-1 max-h-72 overflow-y-auto">
                                <div class="sticky top-0 bg-orange-50 px-3 py-2 border-b border-orange-100">
                                    <span class="text-[10px] font-bold text-orange-600 uppercase">
                                        <i class="fas fa-list-ul mr-1"></i>
                                        <span x-text="cidResults.length"></span> resultados encontrados
                                    </span>
                                </div>
                                <template x-for="cid in cidResults" :key="cid.code">
                                    <button @click="selectCID(cid)" 
                                            class="w-full text-left px-4 py-3 hover:bg-orange-50 text-sm border-b border-gray-50 last:border-0 transition-colors flex items-start gap-3">
                                        <span class="font-bold text-orange-600 bg-orange-100 px-2 py-0.5 rounded text-xs whitespace-nowrap" x-text="cid.code"></span>
                                        <span class="text-gray-700 flex-grow" x-text="cid.name"></span>
                                        <i class="fas fa-plus text-gray-300 hover:text-orange-500 mt-1"></i>
                                    </button>
                                </template>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Selected Diagnoses List -->
                    <div class="mt-4">
                        <template x-if="form.assessment.diagnoses.length > 0">
                            <div>
                                <label class="text-[10px] font-bold text-gray-400 uppercase mb-2 block">
                                    <i class="fas fa-tags mr-1"></i> Diagnósticos Selecionados
                                </label>
                                <div class="flex flex-wrap gap-2">
                                    <template x-for="(diagnosis, index) in form.assessment.diagnoses" :key="index">
                                        <div class="bg-gradient-to-r from-orange-50 to-orange-100 border border-orange-200 text-orange-800 px-3 py-1.5 rounded-lg text-sm flex items-center gap-2 shadow-sm">
                                            <i class="fas fa-notes-medical text-orange-400 text-xs"></i>
                                            <span x-text="diagnosis" class="font-medium"></span>
                                            <button @click="removeDiagnosis(index)" class="ml-1 text-orange-400 hover:text-red-500 transition-colors">
                                                <i class="fas fa-times-circle"></i>
                                            </button>
                                        </div>
                                    </template>
                                </div>
                            </div>
                        </template>
                        <template x-if="form.assessment.diagnoses.length === 0">
                            <div class="text-center py-4 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                                <i class="fas fa-search text-gray-300 text-2xl mb-2"></i>
                                <p class="text-xs text-gray-400">Nenhum diagnóstico selecionado. Use a busca acima.</p>
                            </div>
                        </template>
                    </div>
                    
                    <!-- Free text fallback -->
                    <div class="mt-4">
                        <label class="text-xs font-bold text-gray-500 uppercase mb-1 block">Outros / Diagnóstico Livre</label>
                        <input type="text" x-model="form.assessment.hd" class="form-input border-orange-200 focus:border-orange-500 focus:ring-orange-200" placeholder="Complemento ou diagnóstico não encontrado na busca...">
                    </div>
                </div>

                <!-- 7. PLAN (P) -->
                <div class="form-section border-l-4 border-l-[#005f8f] hover:shadow-md transition-shadow">
                    <div class="flex items-center gap-2 mb-4 text-[#005f8f]">
                        <span class="bg-[#005f8f] text-white font-bold w-6 h-6 flex items-center justify-center rounded text-xs">P</span>
                        <h3 class="font-bold uppercase tracking-wide">Conduta</h3>
                    </div>

                    <div class="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
                        <button @click="conductType = 'prescricao'" :class="conductType === 'prescricao' ? 'bg-[#005f8f] text-white' : 'bg-white text-gray-500 hover:bg-gray-50'" class="px-4 py-1.5 rounded-full text-xs font-bold border border-gray-200 whitespace-nowrap transition-colors">Prescrição/Alta</button>
                        <button @click="conductType = 'exames'" :class="conductType === 'exames' ? 'bg-[#005f8f] text-white' : 'bg-white text-gray-500 hover:bg-gray-50'" class="px-4 py-1.5 rounded-full text-xs font-bold border border-gray-200 whitespace-nowrap transition-colors">Solicitar Exames</button>
                        <button @click="conductType = 'internacao'" :class="conductType === 'internacao' ? 'bg-[#005f8f] text-white' : 'bg-white text-gray-500 hover:bg-gray-50'" class="px-4 py-1.5 rounded-full text-xs font-bold border border-gray-200 whitespace-nowrap transition-colors">Internação</button>
                    </div>

                    <!-- TAB: PRESCRIÇÃO/ALTA -->
                    <div x-show="conductType === 'prescricao'">
                        <div class="mb-5">
                            <label class="text-xs text-[#005f8f] font-bold mb-1 block uppercase">
                                <i class="fas fa-file-prescription mr-1"></i> Prescrição Médica
                            </label>
                            <textarea x-model="form.plan.prescription" class="form-input h-32 bg-blue-50 border-blue-100 focus:border-blue-300 focus:ring-blue-200 text-sm font-mono" placeholder="1. Dieta...\n2. Soro...\n3. Analgesia..."></textarea>
                        </div>

                        <div class="mb-4">
                            <label class="checkbox-wrapper p-2 bg-green-50 rounded border border-green-100 hover:bg-green-100 transition-colors w-full">
                                <input type="checkbox" x-model="form.plan.isDischarge" class="w-5 h-5 text-green-600 rounded focus:ring-green-500">
                                <span class="text-green-800 font-bold ml-2">CONFIRMAR ALTA MÉDICA</span>
                            </label>
                        </div>

                        <div x-show="form.plan.isDischarge" class="bg-gradient-to-r from-green-50 to-white border border-green-100 rounded-lg p-4 mb-5">
                            <h5 class="text-green-800 font-bold text-sm mb-3 flex items-center gap-2">
                                <i class="fas fa-clipboard-check"></i> Checklist de Alta
                            </h5>
                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                                <label class="checkbox-wrapper hover:bg-white p-1 rounded transition-colors"><input type="checkbox" x-model="form.plan.discharge.meds_guide" class="rounded text-green-600 focus:ring-green-500"> <span>Orientado uso de medicações</span></label>
                                <label class="checkbox-wrapper hover:bg-white p-1 rounded transition-colors"><input type="checkbox" x-model="form.plan.discharge.alarm_signs" class="rounded text-green-600 focus:ring-green-500"> <span>Sinais de alarme / Retorno</span></label>
                                <label class="checkbox-wrapper hover:bg-white p-1 rounded transition-colors"><input type="checkbox" x-model="form.plan.discharge.certificate" class="rounded text-green-600 focus:ring-green-500"> <span>Atestado Médico entregue</span></label>
                                <label class="checkbox-wrapper hover:bg-white p-1 rounded transition-colors"><input type="checkbox" x-model="form.plan.discharge.referral" class="rounded text-green-600 focus:ring-green-500"> <span>Encaminhamento</span></label>
                            </div>
                        </div>
                    </div>

                    <!-- TAB: EXAMES -->
                    <div x-show="conductType === 'exames'">
                        <div class="bg-yellow-50 border border-yellow-100 rounded-lg p-4 mb-4">
                            <label class="text-xs text-yellow-800 font-bold mb-1 block uppercase">
                                <i class="fas fa-vial mr-1"></i> Exames Solicitados (Laboratório/Imagem)
                            </label>
                            <textarea x-model="form.plan.requestedExams" class="form-input h-32 bg-white border-yellow-200 focus:border-yellow-400 focus:ring-yellow-200 text-sm" placeholder="Hemograma, PCR, Creatinina...\nRX de Tórax..."></textarea>
                        </div>
                    </div>

                    <!-- TAB: INTERNAÇÃO -->
                    <div x-show="conductType === 'internacao'">
                        <div class="bg-red-50 border border-red-100 rounded-lg p-4 mb-4">
                            <h5 class="text-red-800 font-bold text-sm mb-3 flex items-center gap-2">
                                <i class="fas fa-procedures"></i> Destino da Internação
                            </h5>
                            <div class="grid grid-cols-1 gap-3">
                                <label class="checkbox-wrapper bg-white p-2 rounded border border-red-100"><input type="radio" name="internation" value="Observação Breve" x-model="form.plan.internationType" class="text-red-600"> <span>Observação Breve (Sala de Medicação)</span></label>
                                <label class="checkbox-wrapper bg-white p-2 rounded border border-red-100"><input type="radio" name="internation" value="Observação 24h" x-model="form.plan.internationType" class="text-red-600"> <span>Observação 24h</span></label>
                                <label class="checkbox-wrapper bg-white p-2 rounded border border-red-100"><input type="radio" name="internation" value="Enfermaria" x-model="form.plan.internationType" class="text-red-600"> <span>Enfermaria</span></label>
                                <label class="checkbox-wrapper bg-white p-2 rounded border border-red-100"><input type="radio" name="internation" value="Sala de Emergência/Vermelha" x-model="form.plan.internationType" class="text-red-600"> <span>Sala de Emergência / Cuidados Intensivos</span></label>
                            </div>
                        </div>
                    </div>
                    
                    <div class="mt-4">
                        <label class="form-label">Observações Adicionais</label>
                        <textarea x-model="form.plan.notes" class="form-input h-20 text-sm" placeholder="Outros detalhes..."></textarea>
                    </div>
                </div>

            </div>

            <!-- RIGHT COLUMN: PREVIEW (STICKY) -->
            <div class="lg:w-[480px] xl:w-[550px] flex-shrink-0 hidden lg:block">
                <div class="sticky top-24 bg-white rounded-xl shadow-xl border border-gray-200 flex flex-col max-h-[calc(100vh-120px)] overflow-hidden">
                    
                    <div class="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                        <div class="flex items-center gap-2">
                             <h3 class="font-bold text-[#005f8f] flex items-center gap-2">
                                <i class="fas fa-laptop-medical"></i> Pré-visualização
                            </h3>
                            <!-- Calculator Trigger Button -->
                            <button @click="showCalculators = true" class="ml-2 text-xs bg-white border border-blue-200 text-[#005f8f] px-2 py-1 rounded hover:bg-blue-50 transition-colors flex items-center gap-1 shadow-sm">
                                <i class="fas fa-calculator"></i> Calculadoras
                            </button>
                        </div>
                        <button @click="copyText()" class="px-4 py-2 bg-[#005f8f] text-white text-sm font-medium rounded-lg hover:bg-[#004a70] transition-all flex items-center gap-2 shadow-sm transform active:scale-95">
                            <i class="far fa-copy"></i> <span x-text="copied ? 'Copiado!' : 'Copiar Texto'"></span>
                        </button>
                    </div>

                    <div class="p-2 bg-yellow-50 border-b border-yellow-100 flex items-start gap-2">
                        <i class="fas fa-info-circle text-yellow-600 mt-0.5 text-xs ml-2"></i>
                        <p class="text-xs text-yellow-700 leading-tight">O texto abaixo é gerado automaticamente. Revise antes de copiar para o prontuário.</p>
                    </div>

                    <div class="p-8 overflow-y-auto preview-scroll flex-grow font-mono text-sm leading-relaxed whitespace-pre-wrap text-gray-800 bg-white" id="preview-text" x-text="generateText()"></div>
                </div>
            </div>
            
            <!-- MOBILE FLOAT BUTTONS -->
            <div class="fixed bottom-6 right-6 lg:hidden z-50 flex flex-col gap-3" x-data="{ open: false }">
                 <button @click="showCalculators = true" class="w-14 h-14 bg-white text-[#005f8f] rounded-full shadow-xl border border-blue-100 flex items-center justify-center text-xl">
                    <i class="fas fa-calculator"></i>
                 </button>
                 <button @click="open = !open" class="w-14 h-14 bg-[#005f8f] text-white rounded-full shadow-xl flex items-center justify-center text-xl">
                    <i class="fas" :class="open ? 'fa-times' : 'fa-file-alt'"></i>
                 </button>
                 
                 <div x-show="open" class="absolute bottom-32 right-0 w-[90vw] sm:w-[400px] h-[70vh] bg-white rounded-xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden" 
                      x-transition:enter="transition ease-out duration-200"
                      x-transition:enter-start="opacity-0 translate-y-10"
                      x-transition:enter-end="opacity-100 translate-y-0"
                      x-transition:leave="transition ease-in duration-150"
                      x-transition:leave-start="opacity-100 translate-y-0"
                      x-transition:leave-end="opacity-0 translate-y-10">
                      <div class="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                        <h3 class="font-bold text-[#005f8f]">Pré-visualização</h3>
                        <button @click="copyText()" class="text-sm text-[#005f8f] font-bold">Copiar</button>
                      </div>
                      <div class="p-6 overflow-y-auto font-mono text-xs whitespace-pre-wrap flex-grow" x-text="generateText()"></div>
                 </div>
            </div>

            <!-- CALCULATORS MODAL -->
            <div x-show="showCalculators" class="fixed inset-0 z-[100] overflow-y-auto" style="display: none;">
                <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                    <div class="fixed inset-0 transition-opacity" aria-hidden="true" @click="showCalculators = false">
                        <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
                    </div>

                    <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                    <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
                        <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                            <div class="flex justify-between items-center mb-6">
                                <h3 class="text-lg leading-6 font-medium text-gray-900 flex items-center gap-2">
                                    <i class="fas fa-calculator text-[#005f8f]"></i> Calculadoras Médicas
                                </h3>
                                <button @click="showCalculators = false" class="text-gray-400 hover:text-gray-500">
                                    <i class="fas fa-times text-xl"></i>
                                </button>
                            </div>

                            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 h-[600px]">
                                <!-- Sidebar List -->
                                <div class="border-r border-gray-200 pr-4 overflow-y-auto">
                                    <input type="text" x-model="calcSearch" placeholder="Buscar calculadora..." class="form-input mb-4 text-sm">
                                    
                                    <div class="space-y-2">
                                        <template x-for="calc in filteredCalculators" :key="calc.id">
                                            <button @click="selectedCalc = calc.id; calcResult = null;" 
                                                :class="selectedCalc === calc.id ? 'bg-blue-50 border-blue-200 text-[#005f8f]' : 'bg-white border-gray-100 text-gray-700 hover:bg-gray-50'"
                                                class="w-full text-left px-4 py-3 rounded-lg border text-sm font-medium transition-all flex items-center justify-between group">
                                                <div>
                                                    <span x-text="calc.name" class="block"></span>
                                                    <span x-text="calc.category" class="text-xs text-gray-400 font-normal"></span>
                                                </div>
                                                <i class="fas fa-chevron-right text-xs opacity-0 group-hover:opacity-100 transition-opacity"></i>
                                            </button>
                                        </template>
                                    </div>
                                </div>

                                <!-- Calculator Content -->
                                <div class="col-span-2 overflow-y-auto pl-2">
                                    <template x-if="selectedCalc">
                                        <div x-html="renderCalculator(selectedCalc)"></div>
                                    </template>
                                    <template x-if="!selectedCalc">
                                        <div class="h-full flex flex-col items-center justify-center text-gray-400 opacity-50">
                                            <i class="fas fa-calculator text-6xl mb-4"></i>
                                            <p>Selecione uma calculadora ao lado</p>
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

// Rota de Prescrições
app.get('/prescricoes', (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Prescrições - Plantão Guiado</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
        <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>
        <style>
            .scrollbar-thin::-webkit-scrollbar { width: 6px; }
            .scrollbar-thin::-webkit-scrollbar-track { background: #f1f1f1; }
            .scrollbar-thin::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 3px; }
            .prescription-item { transition: all 0.2s ease; }
            .prescription-item:hover { transform: translateX(4px); }
        </style>
    </head>
    <body class="bg-gray-50 text-gray-800" x-data="prescricoesApp()">
        
        <!-- Header -->
        <header class="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
            <div class="max-w-[1800px] mx-auto px-4 lg:px-6 h-16 flex items-center justify-between">
                <div class="flex items-center gap-4">
                    <a href="/" class="flex items-center gap-3 hover:opacity-80 transition-opacity">
                        <div class="w-10 h-10 bg-[#005f8f] rounded-lg flex items-center justify-center text-white shadow-sm">
                            <i class="fas fa-user-md text-xl"></i>
                        </div>
                        <div>
                            <h1 class="text-lg font-bold text-gray-800 leading-tight">Plantão Guiado</h1>
                            <p class="text-xs text-gray-500 font-medium">Prescrições Médicas</p>
                        </div>
                    </a>
                </div>
                
                <!-- Navigation -->
                <nav class="flex items-center gap-2">
                    <a href="/" class="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors">
                        <i class="fas fa-file-medical mr-2"></i>Evolução
                    </a>
                    <a href="/prescricoes" class="px-4 py-2 text-sm font-medium text-white bg-[#005f8f] rounded-lg">
                        <i class="fas fa-prescription mr-2"></i>Prescrições
                    </a>
                </nav>
            </div>
        </header>

        <main class="max-w-[1800px] mx-auto p-4 lg:p-6">
            
            <!-- Search Bar -->
            <div class="mb-6">
                <div class="relative max-w-2xl mx-auto">
                    <input type="text" 
                           x-model="searchTerm"
                           placeholder="Buscar prescrição (ex: pneumonia, dor, ITU, arritmia...)"
                           class="w-full px-5 py-4 pl-12 text-lg border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-[#005f8f] focus:border-[#005f8f] outline-none">
                    <i class="fas fa-search absolute left-4 top-5 text-gray-400 text-lg"></i>
                    <template x-if="searchTerm.length > 0">
                        <button @click="searchTerm = ''" class="absolute right-4 top-4 text-gray-400 hover:text-gray-600 p-1">
                            <i class="fas fa-times"></i>
                        </button>
                    </template>
                </div>
            </div>

            <div class="flex flex-col lg:flex-row gap-6">
                
                <!-- Left Sidebar - Categories -->
                <div class="lg:w-64 flex-shrink-0">
                    <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden sticky top-24">
                        <div class="p-4 bg-gray-50 border-b border-gray-200">
                            <h3 class="font-bold text-gray-700 text-sm uppercase tracking-wide flex items-center gap-2">
                                <i class="fas fa-layer-group text-[#005f8f]"></i> Categorias
                            </h3>
                        </div>
                        <div class="p-2 max-h-[70vh] overflow-y-auto scrollbar-thin">
                            <button @click="selectCategoria(null)" 
                                    :class="selectedCategoria === null ? 'bg-[#005f8f] text-white' : 'hover:bg-gray-100 text-gray-700'"
                                    class="w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors flex items-center gap-3 mb-1">
                                <i class="fas fa-list-ul w-5"></i>
                                <span>Todas</span>
                                <span class="ml-auto text-xs opacity-70" x-text="db.prescricoes.length"></span>
                            </button>
                            <template x-for="cat in categorias" :key="cat.id">
                                <button @click="selectCategoria(cat.id)" 
                                        :class="selectedCategoria === cat.id ? 'bg-[#005f8f] text-white' : 'hover:bg-gray-100 text-gray-700'"
                                        class="w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors flex items-center gap-3 mb-1">
                                    <i :class="cat.icone" class="w-5"></i>
                                    <span x-text="cat.nome" class="truncate"></span>
                                    <span class="ml-auto text-xs opacity-70" 
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
                            <div class="mb-4 flex items-center justify-between">
                                <h2 class="text-lg font-bold text-gray-700">
                                    <template x-if="selectedCategoria">
                                        <span x-text="getCategoria(selectedCategoria)?.nome"></span>
                                    </template>
                                    <template x-if="!selectedCategoria">
                                        <span>Todas as Prescrições</span>
                                    </template>
                                </h2>
                                <span class="text-sm text-gray-500">
                                    <span x-text="prescricoesFiltradas.length"></span> resultados
                                </span>
                            </div>
                            
                            <div class="grid gap-3">
                                <template x-for="presc in prescricoesFiltradas" :key="presc.id">
                                    <button @click="selectPrescricao(presc)"
                                            class="prescription-item w-full text-left bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-[#005f8f]/30">
                                        <div class="flex items-start gap-4">
                                            <div class="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                                                 :class="'bg-' + getCategoria(presc.categoria)?.cor + '-100'">
                                                <i :class="getCategoria(presc.categoria)?.icone" 
                                                   :style="'color: var(--tw-' + getCategoria(presc.categoria)?.cor + '-600)'"></i>
                                            </div>
                                            <div class="flex-1 min-w-0">
                                                <h3 class="font-semibold text-gray-800" x-text="presc.nome"></h3>
                                                <p class="text-sm text-gray-500" x-text="getCategoria(presc.categoria)?.nome"></p>
                                                <div class="flex flex-wrap gap-1 mt-2">
                                                    <template x-for="tag in presc.tags.slice(0,4)" :key="tag">
                                                        <span class="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full" x-text="tag"></span>
                                                    </template>
                                                </div>
                                            </div>
                                            <div class="flex-shrink-0">
                                                <span class="text-xs font-medium px-2 py-1 rounded-full"
                                                      :class="presc.ambiente === 'hospitalar' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'"
                                                      x-text="presc.ambiente === 'hospitalar' ? 'Hospital' : 'Ambulatorial'"></span>
                                            </div>
                                            <i class="fas fa-chevron-right text-gray-400 flex-shrink-0 mt-3"></i>
                                        </div>
                                    </button>
                                </template>
                            </div>
                            
                            <template x-if="prescricoesFiltradas.length === 0">
                                <div class="text-center py-12">
                                    <i class="fas fa-search text-gray-300 text-5xl mb-4"></i>
                                    <p class="text-gray-500">Nenhuma prescrição encontrada</p>
                                    <p class="text-sm text-gray-400 mt-1">Tente outro termo de busca</p>
                                </div>
                            </template>
                        </div>
                    </template>

                    <!-- Prescription Detail -->
                    <template x-if="selectedPrescricao">
                        <div>
                            <button @click="selectedPrescricao = null" 
                                    class="mb-4 text-[#005f8f] hover:text-[#004a70] font-medium flex items-center gap-2">
                                <i class="fas fa-arrow-left"></i> Voltar
                            </button>
                            
                            <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                                <div class="p-6 border-b border-gray-200 bg-gradient-to-r from-[#005f8f]/5 to-transparent">
                                    <div class="flex items-center gap-4">
                                        <div class="w-14 h-14 rounded-xl flex items-center justify-center"
                                             :class="'bg-' + getCategoria(selectedPrescricao.categoria)?.cor + '-100'">
                                            <i :class="getCategoria(selectedPrescricao.categoria)?.icone" class="text-2xl"
                                               :style="'color: var(--tw-' + getCategoria(selectedPrescricao.categoria)?.cor + '-600)'"></i>
                                        </div>
                                        <div>
                                            <h2 class="text-2xl font-bold text-gray-800" x-text="selectedPrescricao.nome"></h2>
                                            <p class="text-gray-500" x-text="getCategoria(selectedPrescricao.categoria)?.nome"></p>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="p-6 space-y-6">
                                    <template x-for="(presc, index) in selectedPrescricao.prescricoes" :key="index">
                                        <div class="border border-gray-200 rounded-xl overflow-hidden">
                                            <div class="px-4 py-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
                                                <div class="flex items-center gap-3">
                                                    <span class="px-3 py-1 text-xs font-bold rounded-full border"
                                                          :class="getTipoColor(presc.tipo)"
                                                          x-text="getTipoLabel(presc.tipo)"></span>
                                                    <h3 class="font-semibold text-gray-700" x-text="presc.titulo"></h3>
                                                </div>
                                                <button @click="copyPrescricao(presc, index)"
                                                        class="px-4 py-2 bg-[#005f8f] text-white text-sm font-medium rounded-lg hover:bg-[#004a70] transition-colors flex items-center gap-2">
                                                    <template x-if="copiedIndex === index">
                                                        <span><i class="fas fa-check"></i> Copiado!</span>
                                                    </template>
                                                    <template x-if="copiedIndex !== index">
                                                        <span><i class="fas fa-copy"></i> Copiar</span>
                                                    </template>
                                                </button>
                                            </div>
                                            <div class="p-4 bg-white">
                                                <pre class="whitespace-pre-wrap font-mono text-sm text-gray-700 leading-relaxed" x-text="formatPrescricao(presc)"></pre>
                                            </div>
                                        </div>
                                    </template>
                                </div>
                            </div>
                        </div>
                    </template>
                </div>

                <!-- Right Sidebar - Quick Access -->
                <div class="lg:w-72 flex-shrink-0 hidden xl:block">
                    <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden sticky top-24">
                        <div class="p-4 bg-gray-50 border-b border-gray-200">
                            <h3 class="font-bold text-gray-700 text-sm uppercase tracking-wide flex items-center gap-2">
                                <i class="fas fa-bolt text-yellow-500"></i> Acesso Rápido
                            </h3>
                        </div>
                        <div class="p-3 space-y-2">
                            <button @click="searchTerm = 'dor'; selectedCategoria = null;" 
                                    class="w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-gray-100 flex items-center gap-3">
                                <i class="fas fa-prescription text-pink-500 w-5"></i> Analgesia / Dor
                            </button>
                            <button @click="searchTerm = 'pneumonia'; selectedCategoria = null;" 
                                    class="w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-gray-100 flex items-center gap-3">
                                <i class="fas fa-lungs text-blue-500 w-5"></i> Pneumonia
                            </button>
                            <button @click="searchTerm = 'itu'; selectedCategoria = null;" 
                                    class="w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-gray-100 flex items-center gap-3">
                                <i class="fas fa-kidneys text-orange-500 w-5"></i> ITU
                            </button>
                            <button @click="searchTerm = 'sca'; selectedCategoria = null;" 
                                    class="w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-gray-100 flex items-center gap-3">
                                <i class="fas fa-heart text-red-500 w-5"></i> SCA / Infarto
                            </button>
                            <button @click="searchTerm = 'asma'; selectedCategoria = null;" 
                                    class="w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-gray-100 flex items-center gap-3">
                                <i class="fas fa-wind text-cyan-500 w-5"></i> Asma / DPOC
                            </button>
                            <button @click="searchTerm = 'convulsão'; selectedCategoria = null;" 
                                    class="w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-gray-100 flex items-center gap-3">
                                <i class="fas fa-brain text-purple-500 w-5"></i> Convulsão
                            </button>
                            <button @click="searchTerm = 'anafilaxia'; selectedCategoria = null;" 
                                    class="w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-gray-100 flex items-center gap-3">
                                <i class="fas fa-ambulance text-red-500 w-5"></i> Anafilaxia
                            </button>
                        </div>
                        
                        <div class="p-4 border-t border-gray-200">
                            <div class="text-xs text-gray-500 space-y-1">
                                <p><i class="fas fa-info-circle mr-1"></i> Clique em "Copiar" para copiar a prescrição</p>
                                <p class="text-[10px] text-gray-400 mt-2">Baseado em: Livre Medicina e PS Zerado</p>
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

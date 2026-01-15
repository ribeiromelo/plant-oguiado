# 📋 ESTRUTURA HTML PROPOSTA - SALA VERMELHA/UTI

## 🎯 Visão Geral da Estrutura

```
┌─────────────────────────────────────────────────────────────────┐
│                        PÁGINA EVOLUÇÃO                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  [PS Clínica Médica]    [Sala Vermelha / UTI]             │ │
│  │       (Azul)                  (Vermelho)                   │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  ┌─────────────────────────┬──────────────────────────────────┐ │
│  │                         │                                  │ │
│  │  LEFT COLUMN            │  RIGHT SIDEBAR                   │ │
│  │  (Formulários)          │  (Pré-visualização)              │ │
│  │                         │                                  │ │
│  │  ┌───────────────────┐  │  ┌────────────────────────────┐ │ │
│  │  │ Identificação     │  │  │  [Copiar Texto]            │ │ │
│  │  │ - Nome            │  │  ├────────────────────────────┤ │ │
│  │  │ - Idade           │  │  │                            │ │ │
│  │  │ - Sexo            │  │  │  TEXTO GERADO              │ │ │
│  │  └───────────────────┘  │  │  ATUALIZA EM               │ │ │
│  │                         │  │  TEMPO REAL                │ │ │
│  │  ┌───────────────────┐  │  │                            │ │ │
│  │  │ SE "PS Clínica":  │  │  │  (Formato SOAP ou          │ │ │
│  │  │                   │  │  │   Evolução Crítico ou      │ │ │
│  │  │ - SOAP Form       │  │  │   XABCDE dependendo        │ │ │
│  │  │   (existente)     │  │  │   da seleção)              │ │ │
│  │  └───────────────────┘  │  │                            │ │ │
│  │                         │  └────────────────────────────┘ │ │
│  │  ┌───────────────────┐  │                                  │ │
│  │  │ SE "Sala Vermelha"│  │  ⬅️ SIDEBAR SEMPRE VISÍVEL      │ │
│  │  │                   │  │     (FORA DOS TEMPLATES)         │ │
│  │  │ Sub-seletor:      │  │                                  │ │
│  │  │ [Evolução Crítico]│  │                                  │ │
│  │  │ [Admissão XABCDE] │  │                                  │ │
│  │  │                   │  │                                  │ │
│  │  │ ┌─────────────┐   │  │                                  │ │
│  │  │ │Template 1   │   │  │                                  │ │
│  │  │ │OU          │   │  │                                  │ │
│  │  │ │Template 2   │   │  │                                  │ │
│  │  │ └─────────────┘   │  │                                  │ │
│  │  └───────────────────┘  │                                  │ │
│  │                         │                                  │ │
│  └─────────────────────────┴──────────────────────────────────┘ │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📝 ESTRUTURA DE CÓDIGO SIMPLIFICADA

```html
<main class="flex flex-col lg:flex-row gap-8">
  
  <!-- ============================================ -->
  <!-- LEFT COLUMN: Formulários                     -->
  <!-- ============================================ -->
  <div class="flex-1 min-w-0 pb-20">
    
    <!-- 1. SELETOR DE TIPO (já existe) ✅ -->
    <div class="flex gap-3 mb-6">
      <button @click="form.serviceType = 'clinica'">PS Clínica</button>
      <button @click="form.serviceType = 'salavermelha'">Sala Vermelha</button>
    </div>
    
    <!-- 2. BANNER DE STATUS (já existe) ✅ -->
    <div class="status-banner">...</div>
    
    <!-- 3. IDENTIFICAÇÃO (já existe) ✅ -->
    <div class="form-card">
      Nome, Idade, Sexo...
    </div>
    
    <!-- ============================================ -->
    <!-- 4. SOAP FORM - PS Clínica Médica            -->
    <!-- (já existe, apenas adicionar x-if)          -->
    <!-- ============================================ -->
    <template x-if="form.serviceType === 'clinica'">
      <div>
        <!-- Todo o formulário SOAP atual -->
        <!-- Subjetivo, Objetivo, Avaliação, Plano -->
      </div>
    </template>
    
    <!-- ============================================ -->
    <!-- 5. SALA VERMELHA / UTI (NOVO) 🆕            -->
    <!-- ============================================ -->
    <template x-if="form.serviceType === 'salavermelha'">
      <div>
        
        <!-- SUB-SELETOR: Evolução Crítico vs XABCDE -->
        <div class="form-card mb-6">
          <div class="flex gap-3">
            <button @click="form.utiTemplate = 'evolucao'"
                    :class="form.utiTemplate === 'evolucao' ? 'bg-red-600 text-white' : 'bg-white'">
              <i class="fas fa-notes-medical"></i>
              Evolução de Paciente Crítico
            </button>
            <button @click="form.utiTemplate = 'xabcde'"
                    :class="form.utiTemplate === 'xabcde' ? 'bg-red-600 text-white' : 'bg-white'">
              <i class="fas fa-clipboard-list"></i>
              Admissão XABCDE
            </button>
          </div>
        </div>
        
        <!-- ======================================== -->
        <!-- TEMPLATE 1: Evolução de Paciente Crítico -->
        <!-- ======================================== -->
        <template x-if="form.utiTemplate === 'evolucao'">
          <div>
            <!-- A. CABEÇALHO -->
            <div class="form-card border-l-4 border-red-500">
              <h3>📋 Dados da Internação</h3>
              <input x-model="form.uti.dataAdmissao" type="date" placeholder="Data Admissão">
              <select x-model="form.uti.local">
                <option>UPA</option>
                <option>UTI</option>
                <option>Sala Vermelha</option>
              </select>
              <textarea x-model="form.uti.motivo" placeholder="Motivo da admissão"></textarea>
            </div>
            
            <!-- B. DIAGNÓSTICO -->
            <div class="form-card">
              <h3>🩺 Diagnóstico Principal</h3>
              <textarea x-model="form.uti.dx"></textarea>
            </div>
            
            <!-- C. COVID-19 -->
            <div class="form-card">
              <h3>🦠 Rastreio COVID-19</h3>
              <input x-model="form.uti.covidData" type="date">
              <select x-model="form.uti.covidResultado">
                <option>NÃO REAGENTE</option>
                <option>REAGENTE</option>
                <option>AGUARDA</option>
              </select>
              <select x-model="form.uti.rtpcr">
                <option>AGUARDA</option>
                <option>NEGATIVO</option>
                <option>POSITIVO</option>
              </select>
            </div>
            
            <!-- D. ATB (Lista Dinâmica) -->
            <div class="form-card">
              <h3>💊 Antibioticoterapia</h3>
              <template x-for="(atb, index) in form.uti.atb" :key="index">
                <div class="flex gap-2">
                  <input x-model="atb.nome" placeholder="Nome do ATB">
                  <input x-model="atb.horario" placeholder="12/12">
                  <input x-model="atb.dataInicio" type="date">
                  <select x-model="atb.status">
                    <option>EM USO</option>
                    <option>SUSPENSO</option>
                    <option>INICIADO HOJE</option>
                  </select>
                  <button @click="form.uti.atb.splice(index, 1)">❌</button>
                </div>
              </template>
              <button @click="form.uti.atb.push({nome:'',horario:'',dataInicio:'',status:'EM USO'})">
                ➕ Adicionar ATB
              </button>
            </div>
            
            <!-- E. HDA -->
            <div class="form-card">
              <h3>📝 História da Doença Atual</h3>
              <textarea x-model="form.uti.hda"></textarea>
            </div>
            
            <!-- F. DEVICES (Lista Dinâmica) -->
            <div class="form-card">
              <h3>🔌 Dispositivos/Acessos</h3>
              <template x-for="(device, index) in form.uti.devices" :key="index">
                <div class="flex gap-2">
                  <select x-model="device.tipo">
                    <option>TOT</option>
                    <option>CVC</option>
                    <option>SVD</option>
                    <option>SNE</option>
                  </select>
                  <input x-model="device.detalhes" placeholder="Detalhes">
                  <input x-model="device.dataInsercao" type="date">
                  <select x-model="device.status">
                    <option>EM USO</option>
                    <option>RETIRADO</option>
                  </select>
                  <button @click="form.uti.devices.splice(index, 1)">❌</button>
                </div>
              </template>
              <button @click="form.uti.devices.push({tipo:'',detalhes:'',dataInsercao:'',status:'EM USO'})">
                ➕ Adicionar Device
              </button>
            </div>
            
            <!-- G. EVOLUÇÃO POR SISTEMAS -->
            <div class="form-card">
              <h3>🏥 Evolução por Sistemas</h3>
              <label>NEURO (Neurológico)</label>
              <textarea x-model="form.uti.evolucao.neuro"></textarea>
              
              <label>SCV (Sistema Cardiovascular)</label>
              <textarea x-model="form.uti.evolucao.scv"></textarea>
              
              <label>SR (Sistema Respiratório)</label>
              <textarea x-model="form.uti.evolucao.sr"></textarea>
              
              <label>TGI (Trato Gastrointestinal)</label>
              <textarea x-model="form.uti.evolucao.tgi"></textarea>
              
              <label>R/M (Renal/Metabólico)</label>
              <textarea x-model="form.uti.evolucao.rm"></textarea>
              
              <label>H/I (Hematológico/Infeccioso)</label>
              <textarea x-model="form.uti.evolucao.hi"></textarea>
              
              <label>EXTR (Extremidades)</label>
              <textarea x-model="form.uti.evolucao.extr"></textarea>
            </div>
            
            <!-- H. EXAMES -->
            <div class="form-card">
              <h3>🔬 Exames Complementares</h3>
              <textarea x-model="form.uti.exames"></textarea>
            </div>
            
            <!-- I. CONDUTAS -->
            <div class="form-card">
              <h3>✅ Condutas</h3>
              <label><input type="checkbox" x-model="form.uti.condutas.vigilanciaNeuro"> Vigilância NEUROLÓGICA</label>
              <label><input type="checkbox" x-model="form.uti.condutas.vigilanciaHemo"> Vigilância HEMODINÂMICA</label>
              <label><input type="checkbox" x-model="form.uti.condutas.vigilanciaInfec"> Vigilância INFECCIOSA</label>
              <label><input type="checkbox" x-model="form.uti.condutas.vigilanciaVent"> Vigilância VENTILATÓRIA</label>
              <label><input type="checkbox" x-model="form.uti.condutas.vigilanciaRenal"> Vigilância RENAL/METABÓLICA</label>
              <label><input type="checkbox" x-model="form.uti.condutas.profilaxiaTEV"> PROFILAXIA TEV/LAMG</label>
              <label><input type="checkbox" x-model="form.uti.condutas.aguardarVaga"> Aguardar vaga de UTI/regulação</label>
              <label><input type="checkbox" x-model="form.uti.condutas.manterFamilia"> Manter família informada</label>
              <textarea x-model="form.uti.condutas.outras" placeholder="Outras condutas"></textarea>
            </div>
          </div>
        </template>
        
        <!-- ======================================== -->
        <!-- TEMPLATE 2: Admissão XABCDE             -->
        <!-- ======================================== -->
        <template x-if="form.utiTemplate === 'xabcde'">
          <div>
            <!-- (Estrutura similar mas com campos XABCDE) -->
            <!-- Será implementado no Passo 5 -->
          </div>
        </template>
        
      </div>
    </template>
    
  </div>
  <!-- FIM LEFT COLUMN -->
  
  <!-- ============================================ -->
  <!-- RIGHT SIDEBAR: Pré-visualização              -->
  <!-- (SEMPRE VISÍVEL - FORA DOS TEMPLATES) ✅     -->
  <!-- ============================================ -->
  <div class="lg:w-96 xl:w-[450px] flex-shrink-0">
    <div class="sticky top-4">
      <div class="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div class="bg-gradient-to-r from-slate-700 to-slate-900 p-4">
          <h3 class="text-white font-bold">Pré-visualização</h3>
          <button @click="copyText()" class="btn-copy">
            <span x-show="!copied">Copiar</span>
            <span x-show="copied">Copiado!</span>
          </button>
        </div>
        <div class="p-6">
          <pre x-text="generateText()"></pre>
        </div>
      </div>
    </div>
  </div>
  <!-- FIM RIGHT SIDEBAR -->
  
</main>
```

---

## 🎨 CORES E TEMAS

- **PS Clínica Médica**: Azul (`bg-blue-600`, `border-blue-500`)
- **Sala Vermelha/UTI**: Vermelho (`bg-red-600`, `border-red-500`)
- **Cards**: Borda esquerda colorida de acordo com o tipo
- **Botões ativos**: Fundo colorido + texto branco + sombra
- **Botões inativos**: Fundo branco + texto cinza + hover

---

## 📊 DADOS NO Alpine.js (app.js)

```javascript
Alpine.data('medicalForm', () => ({
  form: {
    serviceType: 'clinica', // 'clinica' ou 'salavermelha'
    utiTemplate: 'evolucao', // 'evolucao' ou 'xabcde'
    
    // Dados UTI - Template 1 (Evolução Crítico)
    uti: {
      dataAdmissao: '',
      local: 'Sala Vermelha',
      motivo: '',
      dx: '',
      covidData: '',
      covidResultado: 'NÃO REAGENTE',
      rtpcr: 'AGUARDA',
      atb: [], // {nome, horario, dataInicio, status}
      hda: '',
      devices: [], // {tipo, detalhes, dataInsercao, status}
      evolucao: {
        neuro: '',
        scv: '',
        sr: '',
        tgi: '',
        rm: '',
        hi: '',
        extr: ''
      },
      exames: '',
      condutas: {
        vigilanciaNeuro: false,
        vigilanciaHemo: false,
        vigilanciaInfec: false,
        vigilanciaVent: false,
        vigilanciaRenal: false,
        profilaxiaTEV: false,
        aguardarVaga: false,
        manterFamilia: false,
        outras: ''
      }
    },
    
    // Dados XABCDE - Template 2 (será adicionado no Passo 5)
    xabcde: {
      // ... campos XABCDE
    }
  }
}))
```

---

## ✅ PONTOS CRÍTICOS GARANTIDOS

1. ✅ **Sidebar FORA dos templates**: está no mesmo nível do LEFT COLUMN
2. ✅ **Estrutura flex preservada**: `<main class="flex-row">` mantida
3. ✅ **Código existente intacto**: SOAP só ganha um `x-if`, nada removido
4. ✅ **Alpine.js correto**: `x-if`, `x-for`, `x-model` usados adequadamente
5. ✅ **Listas dinâmicas**: ATB e Devices com botões ➕/❌
6. ✅ **Cores consistentes**: Azul para Clínica, Vermelho para UTI

---

## ❓ APROVAÇÃO

**Esta estrutura está correta para você?**

- ✅ Sidebar sempre visível?
- ✅ Dois templates dentro de Sala Vermelha?
- ✅ Campos corretos no Template 1 (Evolução Crítico)?
- ✅ Layout e cores adequados?

**Se aprovar, vou para o PASSO 2: Implementar o código!** 🚀

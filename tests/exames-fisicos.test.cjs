const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const source = fs.readFileSync(path.join(__dirname, '../public/static/app.js'), 'utf8');
const indexSource = fs.readFileSync(path.join(__dirname, '../src/index.tsx'), 'utf8');
const stylesSource = fs.readFileSync(path.join(__dirname, '../public/static/styles.css'), 'utf8');

function newForm(customName = 'Exame personalizado') {
    let factory;
    const context = {
        document: { addEventListener(name, callback) { if (name === 'alpine:init') callback(); } },
        Alpine: { data(name, callback) { if (name === 'medicalForm') factory = callback; } },
        prompt: () => customName,
        setTimeout: () => 0
    };
    vm.runInNewContext(source, context);
    assert.ok(factory, 'medicalForm deve estar registrado');
    return factory();
}

test('SOAP escreve os exames básicos preenchidos e adapta o estado geral', () => {
    const form = newForm();
    form.form.vitals.hgt = 110;
    for (const section of ['general', 'cardiac', 'pulmonary', 'abdominal', 'neuro', 'extremities']) {
        form.setNormal(section);
        assert.ok(form.form.exam[section]);
    }
    const text = form.generateText();
    assert.match(text, /HGT: 110 mg\/dL/);
    for (const label of ['GERAL', 'ACV', 'AR', 'ABD', 'NEURO', 'EXTREMIDADES']) {
        assert.match(text, new RegExp('\\n' + label + ': .+'));
    }
    assert.doesNotMatch(form.form.exam.neuro, /Glasgow 15/);
    assert.doesNotMatch(form.form.exam.general, /ar ambiente/i);
    form.form.gender = 'Feminino';
    form.setNormal('general');
    assert.match(form.form.exam.general, /lúcida/);
    assert.match(form.generateText(), /GERAL: Em bom estado geral, lúcida/);
});

test('os 20 exames adicionais podem ser incluídos, editados e removidos sem duplicação', () => {
    const form = newForm();
    assert.equal(form.additionalExamOptions.length, 20);
    for (const option of form.additionalExamOptions) {
        assert.ok(option.normal, option.label + ' precisa ter um modelo');
        form.addAdditionalExam(option.id, option.label);
        form.addAdditionalExam(option.id, option.label);
    }
    assert.equal(form.form.exam.additional.length, 20);
    for (let index = 0; index < form.form.exam.additional.length; index++) {
        form.setAdditionalNormal(index);
    }
    let text = form.generateText();
    for (const option of form.additionalExamOptions) {
        assert.ok(text.includes(option.label.toUpperCase() + ': ' + option.normal), option.label);
    }
    form.form.exam.additional[0].value = 'Achado editado.';
    assert.match(form.generateText(), /OTOSCOPIA: Achado editado\./);
    form.removeAdditionalExam(1);
    text = form.generateText();
    assert.doesNotMatch(text, /OROSCOPIA:/);
    assert.match(text, /OTOSCOPIA: Achado editado\./);
    assert.match(text, /RINOSCOPIA:/);
    assert.doesNotMatch(text, /Giordano negativo|ideação suicida|culturas negativas/i);
});

test('exame personalizado não recebe um resultado normal genérico', () => {
    const form = newForm('Avaliação específica');
    form.addCustomExam();
    assert.equal(form.form.exam.additional.length, 1);
    form.setAdditionalNormal(0);
    assert.equal(form.form.exam.additional[0].value, '');
    assert.doesNotMatch(form.generateText(), /AVALIAÇÃO ESPECÍFICA:/);
    form.form.exam.additional[0].value = 'Achado informado.';
    assert.match(form.generateText(), /AVALIAÇÃO ESPECÍFICA: Achado informado\./);
});

test('PA Pro não inventa exame normal e não duplica pontuação', () => {
    const form = newForm();
    form.form.serviceType = 'pa_pro';
    form.form.vitals.hgt = 110;
    let text = form.generateText();
    let exam = text.split('EXAME FÍSICO:')[1].split('\n\n')[0];
    assert.match(exam, /HGT 110 mg\/dL/);
    assert.match(exam, /Achados não informados/);
    assert.doesNotMatch(exam, /BEG|MV\+|RCR|indolor/);
    form.setPANormal('ap');
    form.setPANormal('ac');
    form.form.pa.ef_adicionais.push({ nome: 'Pele', resultado: 'Achado registrado.' });
    form.form.pa.ef_adicionais.push({ nome: 'Neuro', resultado: '' });
    text = form.generateText();
    exam = text.split('EXAME FÍSICO:')[1].split('\n\n')[0];
    assert.ok(exam.includes(form.form.pa.ef_ap));
    assert.ok(exam.includes(form.form.pa.ef_ac));
    assert.match(exam, /Pele: Achado registrado\./);
    assert.match(exam, /Neuro: não informado\./);
    assert.doesNotMatch(exam, /\.\./);
    form.resetForm();
    assert.match(form.generateText().split('EXAME FÍSICO:')[1], /Achados não informados/);
});

test('XABCDE distingue dados não informados de achados normais', () => {
    const form = newForm();
    form.form.serviceType = 'salavermelha';
    form.form.utiTemplate = 'xabcde';
    let text = form.generateText();
    assert.match(text, /\[X\] HEMORRAGIA EXSANGUINANTE\nNão informado/);
    assert.match(text, /\[A\] VIA AÉREA\nNão informado/);
    assert.match(text, /Suporte de O₂: não informado/);
    assert.doesNotMatch(text, /Sem hemorragias externas evidentes|Via aérea pérvia|ar ambiente/);
    form.form.xabcde.x_hemorragia = 'Hemorragia presente';
    form.form.xabcde.x_local = 'local informado';
    form.form.xabcde.a_pervia = 'Via aérea avaliada';
    form.form.xabcde.b_o2 = 'Suporte informado';
    text = form.generateText();
    assert.match(text, /Hemorragia presente em local informado/);
    assert.match(text, /Via aérea avaliada/);
    assert.match(text, /Suporte de O₂: Suporte informado/);
    form.form.xabcde.x_hemorragia = 'Sem hemorragias externas evidentes';
    assert.doesNotMatch(form.generateText(), /Hemorragia presente em local informado/);
    form.resetForm();
    assert.match(form.generateText(), /\[X\] HEMORRAGIA EXSANGUINANTE\nNão informado/);
});

test('campos vazios não geram negações e PA preserva apenas alarmes selecionados', () => {
    const form = newForm();
    for (const text of [form.generateText(), form.generatePAPro(), form.generateEvolucaoCritico()]) {
        assert.doesNotMatch(text, /Nega|NÃO REAGENTE|NEGATIVO/);
        assert.match(text, /Não informado/);
    }
    assert.match(form.generatePAPro(), /Sinais de alarme: não informados/);
    form.form.pa.alarme_nega = ['Dor torácica'];
    form.form.pa.ap_alergias = 'Nega';
    let text = form.generatePAPro();
    assert.match(text, /Nega sinais de alarme: \(Dor torácica\)/);
    assert.doesNotMatch(text, /vômitos persistentes|déficit neurológico/);
    assert.match(text, /Alergias - Nega/);
    form.form.allergies = 'Penicilina';
    assert.match(form.generateText(), /ALERGIAS: Penicilina/);
    form.resetForm();
    assert.doesNotMatch(form.generatePAPro(), /Nega|Penicilina/);
});

test('resultados e intervenções exigem seleção e são apagados ao limpar', () => {
    const form = newForm();
    assert.match(form.generateXABCDE(), /Monitorização multiparamétrica: Não informado/);
    assert.match(form.generateXABCDE(), /Gravidade estimada: não informada/);
    form.form.uti.covidColeta = 'sim';
    form.form.uti.covidData = '2026-11-11';
    form.form.uti.covidResultado = 'REAGENTE';
    form.form.uti.rtpcr = 'POSITIVO';
    form.form.xabcde.conduta_monitor = 'instalada';
    form.form.xabcde.impressao_gravidade = 'crítico';
    assert.match(form.generateEvolucaoCritico(), /RT-PCR: POSITIVO/);
    assert.match(form.generateEvolucaoCritico(), /REAGENTE/);
    assert.match(form.generateXABCDE(), /Monitorização multiparamétrica: instalada/);
    form.resetForm();
    assert.equal(form.form.uti.covidColeta, '');
    assert.equal(form.form.uti.covidData, '');
    assert.doesNotMatch(form.generateEvolucaoCritico(), /REAGENTE|POSITIVO|2026-11-11/);
    assert.match(form.generateXABCDE(), /Monitorização multiparamétrica: Não informado/);
    assert.match(form.generateXABCDE(), /Gravidade estimada: não informada/);
});

test('admissão formata motivo, HMA e rastreios sem presumir dados', () => {
 const f=newForm();f.form.serviceType='salavermelha';f.form.utiTemplate='evolucao';
 Object.assign(f.form.uti,{dataAdmissao:'2026-11-11',local:'Sala Vermelha',motivo:'- Dispneia e dessaturação a esclarecer.',hda:'Paciente com história de dispneia.'});
 let text=f.generateEvolucaoCritico();
 assert.match(text,/PACIENTE ADMITIDO EM 11\/11\/2026 NA SALA VERMELHA\.\n\nMOTIVO DA INTERNAÇÃO:\n- Dispneia e dessaturação a esclarecer\.\n\nHMA:\nPaciente com história de dispneia\./);
 assert.doesNotMatch(text,/DIAGNÓSTICO PRINCIPAL|# RASTREIO COVID/);
 f.form.uti.covidColeta='nao';f.form.uti.influenzaColeta='sim';f.form.uti.influenzaResultado='NÃO REAGENTE';
 text=f.generateEvolucaoCritico();
 assert.match(text,/- COVID-19: não coletado/);assert.match(text,/- Influenza: coletado — NÃO REAGENTE/);
 f.form.uti.influenzaColeta='nao';text=f.generateEvolucaoCritico();assert.doesNotMatch(text,/NÃO REAGENTE/);
 f.form.uti.motivo=' - ';assert.doesNotMatch(f.generateEvolucaoCritico(),/MOTIVO DA INTERNAÇÃO/);
});

test('ocultar preserva valores e controles são independentes', () => {
 const f=newForm(); f.form.vitals.fc=83; f.form.pa.ia_status='IA TESTE';
 f.form.visibility.soapVitals=false;
 assert.doesNotMatch(f.generateText(), /SSVV:/);
 assert.match(f.generatePAPro(), /FC 83/);
 f.form.visibility.paVitals=false; f.form.visibility.paAI=false;
 assert.doesNotMatch(f.generatePAPro(), /SSVV:|IA TESTE/);
 assert.equal(f.form.vitals.fc,83);
 f.form.visibility.soapVitals=true; assert.match(f.generateText(),/FC: 83/);
});
test('PA tem catálogo completo e modelos básicos compartilhados', () => {
 const f=newForm();
 for(const [pa,soap] of Object.entries({geral:'general',ac:'cardiac',ap:'pulmonary',abd:'abdominal',neuro:'neuro',extremidades:'extremities'})){
 f.setPANormal(pa); assert.equal(f.form.pa['ef_'+pa],f.normalExamText(soap));
 }
 for(const o of f.additionalExamOptions){f.addPAExam(o.id,o.label); f.addPAExam(o.id,o.label);}
 assert.equal(f.form.pa.ef_adicionais.length,20);
 f.form.pa.ef_adicionais.forEach((e,i)=>f.setPAAdditionalNormal(i));
 for(const o of f.additionalExamOptions) assert.ok(f.generatePAPro().includes(o.normal));
 f.resetForm();assert.equal(f.form.pa.ef_neuro,'');
});
test('calculadoras exigem respostas e respeitam referências numéricas',()=>{
 const f=newForm();f.calculateScore('chads');assert.equal(f.calcResult,null);
 for(const k of Object.keys(f.calcInputs.chads))f.calcInputs.chads[k]=1;
 f.calcInputs.chads.age=2;f.calculateScore('chads');assert.equal(f.calcResult,9);
 for(const k of Object.keys(f.calcInputs.perc))f.calcInputs.perc[k]=0;
 f.calculatePERC();assert.equal(f.calcResult,null);
 f.calcInputs.perc.lowRisk=1;f.calculatePERC();assert.equal(f.calcResult,0);
 f.calcInputs.pam={pas:120,pad:80};f.calculateSimple('pam');assert.equal(f.calcResult,'93.3');
 f.calcInputs.anion_gap={na:140,cl:104,hco3:24};f.calculateSimple('anion_gap');assert.equal(f.calcResult,'12.0');
 f.calcInputs.glasgow={eye:'4',verbal:'5',motor:'6'};f.calculateGlasgow();assert.equal(f.calcResult,15);
 f.calcInputs.glasgow.verbal='NT';f.calculateGlasgow();assert.equal(f.calcResult,null);assert.match(f.calcResultText,/VNT/);
 f.calcInputs.ckd={creat:1,age:17,sex:'male'};f.calculateCKD();assert.equal(f.calcResult,null);
 f.resetForm();assert.equal(f.calcInputs.chads.age,-1);
});

test('admissão por sistemas omite vazios, preserva zero, unidade e texto livre',()=>{
 const f=newForm();assert.doesNotMatch(f.generateEvolucaoCritico(), /AVALIAÇÃO POR SISTEMAS/);
 f.setAdmissionValue('scv','fc','94');
 f.setAdmissionValue('neuro','rass','0');
 f.setAdmissionValue('rm','glicemia','110 mg/dL');
 f.form.uti.evolucao.sr='Sem esforço respiratório.';
 const text=f.generateEvolucaoCritico();
 assert.match(text,/ADMISSÃO MÉDICA -/);assert.doesNotMatch(text,/PADRÃO/);
 assert.match(text,/NEURO: RASS 0\./);
 assert.match(text,/SCV: FC 94 bpm\./);
 assert.match(text,/SR: Sem esforço respiratório\./);
 assert.doesNotMatch(text,/mg\/dL mg\/dL|H\/I:/);
 f.setAdmissionValue('scv','fc','');assert.equal(f.admissionSystemText('scv'),'');
 f.resetForm();assert.doesNotMatch(f.generateEvolucaoCritico(),/AVALIAÇÃO POR SISTEMAS/);
});

test('narrativa de estado geral mantém apenas achados documentados',()=>{
 const f=newForm();
 Object.assign(f.form.uti.systems,{general:{aspecto:'Regular',consciencia:'Sonolento',cor:'Ausente',hidratacao:'Normohidratado',temperatura:'36',dor:'Confortável, sem fácies de dor'}});
 assert.equal(f.admissionSystemText('general'),'Paciente em regular estado geral, sonolento, normohidratado, acianótico e anictérico, T 36 °C, confortável, sem fácies de dor.');
 f.form.uti.systems.general={temperatura:'36'};
 assert.equal(f.admissionSystemText('general'),'T 36 °C.');
});
test('todos os campos dos sete sistemas geram narrativa sem rótulos de formulário',()=>{
 const f=newForm();
 for(const system of f.admissionSystems){
  for(const field of system.fields){
   f.form.uti.systems={};f.setAdmissionValue(system.id,field.key,'Achado específico');
   const text=f.admissionSystemText(system.id);
   assert.ok(text.includes('Achado específico') || text.includes('achado específico'),system.id+'.'+field.key);
   assert.doesNotMatch(text,/undefined|null|: Achado/);
  }
 }
 f.form.uti.systems={};f.setAdmissionValue('scv','pa','120x80');
 assert.equal(f.admissionSystemText('scv'),'PA 120x80 mmHg.');
 f.setAdmissionValue('scv','pa','120x80 mmHg');assert.equal(f.admissionSystemText('scv'),'PA 120x80 mmHg.');
 f.form.uti.systems={};f.setAdmissionValue('hi','culturas','Aguardando resultado');
 assert.equal(f.admissionSystemText('hi'),'Aguardando resultado.');
 assert.doesNotMatch(f.admissionSystemText('hi'),/negativ/);
});

test('condutas correspondem exatamente ao exemplo e ignoram linhas vazias',()=>{
 const f=newForm();Object.assign(f.form.uti.condutas,{outras:'Solicito exames gerais\r\n\r\n- Solicito parecer da Cardiologia\n',vigilanciaHemo:true,vigilanciaVent:true,profilaxiaTEV:true,manterFamilia:true});
 const expected='# CONDUTAS\n- Solicito exames gerais\n- Solicito parecer da Cardiologia\n- Vigilância HEMODINÂMICA\n- Vigilância VENTILATÓRIA\n- PROFILAXIA TEV/LAMG\n- Manter família informada\n';
 assert.ok(f.generateEvolucaoCritico().endsWith(expected));
 f.form.uti.condutas.vigilanciaVent=false;assert.doesNotMatch(f.admissionConductText(),/VENTILATÓRIA/);
 f.form.uti.condutas.outras='\n- \n • Solicito ECG\n';assert.ok(f.admissionConductText().startsWith('- Solicito ECG\n'));
 f.resetForm();assert.equal(f.admissionConductText(),'');
});
test('Outro usa texto real, preserva valores prévios e limpa seleção anterior',()=>{
 const f=newForm();f.setAdmissionValue('neuro','consciencia','Achado prévio');
 assert.equal(f.admissionChoice('neuro','consciencia'),'__other__');
 f.chooseAdmission('neuro','consciencia','Sonolento');assert.equal(f.admissionValue('neuro','consciencia'),'Sonolento');
 f.chooseAdmission('neuro','consciencia','__other__');assert.equal(f.admissionValue('neuro','consciencia'),'');
 f.setAdmissionValue('neuro','consciencia','Desperta ao chamado');
 assert.match(f.admissionSystemText('neuro'),/Desperta ao chamado/);assert.doesNotMatch(f.admissionSystemText('neuro'),/Outro|__other__/);
 f.chooseAdmission('neuro','consciencia','');assert.equal(f.admissionSystemText('neuro'),'');
 assert.equal(f.admissionOptions['neuro.convulsoes'],undefined);
});

test('estrutura da dashboard e da admissão segue a navegação experimental', () => {
 const topNav=indexSource.slice(indexSource.indexOf('<!-- Navegação superior experimental'),indexSource.indexOf('<!-- ═══ APP SHELL'));
 assert.match(topNav,/Atendimento/);assert.match(topNav,/Evolução médica/);assert.match(topNav,/Admissão médica/);assert.match(topNav,/Receituário/);assert.match(topNav,/Ferramentas/);assert.match(topNav,/Calculadoras/);
 assert.doesNotMatch(topNav,/Busca CID/);assert.match(topNav,/enablePrescriptionBank/);
 const admission=indexSource.slice(indexSource.indexOf('<!-- A. CABEÇALHO'),indexSource.indexOf('<!-- H. EXAMES COMPLEMENTARES'));
 const ordered=['Dados da Internação','História da Moléstia Atual (HMA)','Rastreio COVID-19 / Influenza','Antibioticoterapia (ATB)','Dispositivos / Acessos (DEVICES)','Avaliação por sistemas'];
 let cursor=-1;for(const label of ordered){const next=admission.indexOf(label);assert.ok(next>cursor,label+' fora de ordem');cursor=next;}
 assert.doesNotMatch(admission,/Diagnóstico Principal/);
 assert.match(indexSource,/pg-shift-control/);assert.match(indexSource,/data-screening="covid-collection"/);assert.match(indexSource,/data-screening="influenza-collection"/);
 assert.match(stylesSource,/\.pg-preview-column\s*\{[\s\S]*position:\s*sticky/);assert.match(stylesSource,/\.pg-device-grid select\s*\{[\s\S]*min-width:\s*0/);
});


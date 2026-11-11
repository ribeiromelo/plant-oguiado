const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const source = fs.readFileSync(path.join(__dirname, '../public/static/app.js'), 'utf8');

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
    form.form.uti.covidData = '2026-11-11';
    form.form.uti.covidResultado = 'REAGENTE';
    form.form.uti.rtpcr = 'POSITIVO';
    form.form.xabcde.conduta_monitor = 'instalada';
    form.form.xabcde.impressao_gravidade = 'crítico';
    assert.match(form.generateEvolucaoCritico(), /RT-PCR: POSITIVO/);
    assert.match(form.generateEvolucaoCritico(), /REAGENTE/);
    assert.match(form.generateXABCDE(), /Monitorização multiparamétrica: instalada/);
    form.resetForm();
    assert.equal(form.form.uti.covidData, '');
    assert.doesNotMatch(form.generateEvolucaoCritico(), /REAGENTE|POSITIVO|2026-11-11/);
    assert.match(form.generateXABCDE(), /Monitorização multiparamétrica: Não informado/);
    assert.match(form.generateXABCDE(), /Gravidade estimada: não informada/);
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
 assert.match(text,/NEURO: RASS: 0\./);
 assert.match(text,/SCV: Frequência cardíaca: 94 bpm\./);
 assert.match(text,/SR: Sem esforço respiratório\./);
 assert.doesNotMatch(text,/mg\/dL mg\/dL|H\/I:/);
 f.setAdmissionValue('scv','fc','');assert.equal(f.admissionSystemText('scv'),'');
 f.resetForm();assert.doesNotMatch(f.generateEvolucaoCritico(),/AVALIAÇÃO POR SISTEMAS/);
});

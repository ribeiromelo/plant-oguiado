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

test('os 12 exames adicionais podem ser incluídos, editados e removidos sem duplicação', () => {
    const form = newForm();
    assert.equal(form.additionalExamOptions.length, 12);
    for (const option of form.additionalExamOptions) {
        assert.ok(option.normal, option.label + ' precisa ter um modelo');
        form.addAdditionalExam(option.id, option.label);
        form.addAdditionalExam(option.id, option.label);
    }
    assert.equal(form.form.exam.additional.length, 12);
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

document.addEventListener('alpine:init', () => {
    Alpine.data('medicalForm', () => ({
        form: {
            serviceType: 'clinica', // 'clinica', 'salavermelha' ou 'pa_pro'
            utiTemplate: 'evolucao', // 'evolucao' ou 'xabcde'
            shift: 'PLANTÃO DIURNO',
            name: '',
            age: '',
            gender: 'Masculino',
            admission: 'Demanda Espontânea',
            habits: {
                smoker: false,
                exSmoker: false,
                smokingLoad: '',
                alcoholic: false,
                exAlcoholic: false,
                alcoholLoad: '',
                drugs: false,
                drugTypes: '',
                sedentary: false
            },
            comorbidities: '',
            allergies: '',
            surgeries: '',
            medications: [],
            subjective: {
                qp: '',
                hda: ''
            },
            negatives: {
                fever: false,
                headache: false,
                dizziness: false,
                dyspnea: false,
                chestPain: false,
                nausea: false,
                intestine: false,
                urinary: false
            },
            visibility: { soapVitals: true, paVitals: true, paAI: true },
            vitals: {
                pa: '',
                pas: '',
                pad: '',
                fc: '',
                fr: '',
                sat: '',
                temp: '',
                hgt: ''
            },
            exam: {
                general: '',
                cardiac: '',
                pulmonary: '',
                abdominal: '',
                neuro: '',
                extremities: '',
                additional: []
            },
            complementary: {
                labs: '',
                imaging: ''
            },
            assessment: {
                hd: '',
                diagnoses: []
            },
            plan: {
                prescription: '',
                requestedExams: '',
                internationType: '',
                isDischarge: false,
                notes: '',
                discharge: {
                    meds_guide: false,
                    alarm_signs: false,
                    certificate: false,
                    referral: false
                }
            },
            // ========================================
            // Dados UTI - Template 1 (Evolução Crítico)
            // ========================================
            uti: {
                systems: {},
                dataAdmissao: '',
                local: 'Sala Vermelha',
                motivo: '',
                dx: '',
                covidColeta: '',
                covidData: '',
                covidResultado: '',
                rtpcr: '',
                influenzaColeta: '',
                influenzaData: '',
                influenzaResultado: '',
                atb: [],
                hda: '',
                devices: [],
                evolucao: {
                    general: '',
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
            // ========================================
            // Dados XABCDE - Template 2 (Admissão XABCDE)
            // ========================================
            xabcde: {
                dataHora: '',
                local: 'Sala Vermelha',
                queixaPrincipal: '',
                // X - Hemorragia
                x_hemorragia: '',
                x_local: '',
                x_terapeutica: [],
                x_terapeutica_obs: '',
                // A - Via Aérea
                a_pervia: '',
                a_obstrucao: '',
                a_dispositivos: '',
                // B - Ventilação
                b_fr: '',
                b_spo2: '',
                b_o2: '',
                b_padrao: '',
                b_ausculta: '',
                b_vm_ativa: false,
                b_vm_modo: '',
                b_vm_fio2: '',
                b_vm_peep: '',
                b_vm_vc: '',
                b_vm_fr_ajust: '',
                b_vm_pico: '',
                b_vm_obs: '',
                // C - Circulação
                c_pas: '',
                c_pad: '',
                c_fc: '',
                c_perfusao: '',
                c_pulsos: '',
                c_ritmo: '',
                c_dva_ativa: false,
                c_duas: [],
                dva_calc: { peso: '', conc: '', vazao: '', resultado: '' },
                // D - Déficit Neurológico
                d_glasgow: '',
                d_pupilas: '',
                d_glicemia: '',
                d_deficits: '',
                d_sedacao_ativa: false,
                d_rass: '',
                d_cam_icu: '',
                d_bps: '',
                d_bnm: '',
                d_sedacao_drogas: '',
                // E - Exposição
                e_temperatura: '',
                e_lesoes: '',
                e_edemas: '',
                // Sinais Vitais (repetição organizada)
                sv_pa: '',
                sv_fc: '',
                sv_fr: '',
                sv_spo2: '',
                sv_temp: '',
                sv_hgt: '',
                // Impressão e Conduta
                impressao_gravidade: '',
                impressao_hipotese: '',
                conduta_o2: '',
                conduta_monitor: '',
                conduta_acesso: '',
                conduta_exames: '',
                conduta_meds: '',
                // História (se disponível)
                hpp_comorbidades: '',
                hpp_alergias: '',
                hpp_medicacoes: '',
                hpp_cirurgias: '',
                hpp_alimentacao: '',
                hpp_eventos: '',
                fonte_info: '',
                destino: ''
            },
            // PA Clínica Médica (Pro)
            pa: {
                ia_status: '',
                local: '',
                qp: '',
                hma_inicio: '',
                hma_descricao: '',
                alarme_nega: [],
                ap_comorbidades: '',
                ap_muc: '',
                ap_alergias: '',
                ef_geral: '',
                ef_ap: '',
                ef_ac: '',
                ef_abd: '',
                ef_neuro: '',
                ef_extremidades: '',
                ef_outros: '',
                ef_adicionais: [],
                pa_diagnoses: [],
                avaliacao: '',
                condutas_selecionadas: [],
                conduta_extra: '',
                atestado: false,
                atestado_dias: 1
            }
        },
        admissionOptions: {"general.aspecto": ["Bom", "Regular", "Mau", "Grave", "Gravíssimo"], "general.consciencia": ["Consciente", "Sonolento", "Obnubilado", "Torporoso", "Comatoso"], "neuro.consciencia": ["Consciente", "Sonolento", "Obnubilado", "Torporoso", "Comatoso"], "general.cor": ["Acianótico e anictérico", "Cianótico", "Ictérico", "Hipocorado"], "general.hidratacao": ["Normohidratado", "Desidratado", "Hiper-hidratado"], "general.dor": ["Confortável e sem fácies de dor", "Com fácies de dor", "Agitado", "Desconfortável"], "neuro.pupilas": ["Isocóricas e fotorreagentes", "Isocóricas e não fotorreagentes", "Anisocóricas", "Mióticas", "Midriáticas"], "neuro.motor": ["Sem déficit motor focal ao exame", "Hemiparesia direita", "Hemiparesia esquerda", "Tetraparesia", "Exame motor não avaliável"], "neuro.rass": ["-5", "-4", "-3", "-2", "-1", "0", "1", "2", "3", "4"], "neuro.delirium": ["CAM-ICU negativo", "CAM-ICU positivo", "Não avaliável"], "scv.ritmo": ["Ritmo regular, bulhas normofonéticas, sem sopros", "Ritmo irregular", "Taquicardia regular", "Bradicardia regular"], "scv.perfusao": ["Preservada", "Diminuída", "Extremidades frias", "Enchimento capilar prolongado"], "scv.pulsos": ["Palpáveis e simétricos", "Diminuídos bilateralmente", "Assimétricos"], "scv.edema": ["Ausente", "Edema de membros inferiores", "Edema generalizado"], "sr.via": ["Via aérea pérvia", "Intubado por via orotraqueal", "Traqueostomizado"], "sr.padrao": ["Eupneico", "Taquipneico", "Bradipneico", "Com uso de musculatura acessória", "Respiração paradoxal"], "sr.ausculta": ["Murmúrio vesicular presente bilateralmente, sem ruídos adventícios", "Sibilos difusos", "Estertores bibasais", "Roncos difusos", "Murmúrio vesicular diminuído bilateralmente"], "sr.suporte": ["Ar ambiente"], "tgi.abdome": ["Flácido e indolor à palpação", "Distendido", "Doloroso à palpação", "Com defesa à palpação"], "tgi.ruidos": ["Presentes", "Diminuídos", "Aumentados", "Ausentes"], "tgi.dieta": ["Jejum", "Dieta oral bem tolerada", "Dieta enteral bem tolerada", "Nutrição parenteral"], "tgi.sangramento": ["Ausente", "Melena", "Hematêmese", "Hematoquezia"], "hi.febre": ["Afebril", "Febril"], "hi.sangramento": ["Sem sangramentos visíveis", "Petéquias", "Equimoses", "Sangramento em sítio de punção"]},
        admissionOther: {},
        admissionConductGroups: [{"label": "Monitorização e vigilância", "items": [{"id": "vigilanciaNeuro", "text": "Vigilância NEUROLÓGICA"}, {"id": "vigilanciaHemo", "text": "Vigilância HEMODINÂMICA"}, {"id": "vigilanciaInfec", "text": "Vigilância INFECCIOSA"}, {"id": "vigilanciaVent", "text": "Vigilância VENTILATÓRIA"}, {"id": "vigilanciaRenal", "text": "Vigilância RENAL/METABÓLICA"}, {"id": "monitor", "text": "Manter monitorização multiparamétrica contínua"}, {"id": "reavaliar", "text": "Reavaliar sinais vitais e perfusão periférica"}]}, {"label": "Suporte hemodinâmico", "items": [{"id": "acesso", "text": "Manter acesso venoso pérvio"}, {"id": "volume", "text": "Reavaliar volemia e resposta à reposição volêmica"}, {"id": "vasoativo", "text": "Titular suporte vasoativo conforme metas hemodinâmicas individualizadas"}]}, {"label": "Ventilação e vias aéreas", "items": [{"id": "oxigenio", "text": "Titular oxigenoterapia conforme meta de saturação individualizada"}, {"id": "ventilacao", "text": "Reavaliar parâmetros ventilatórios e sincronia paciente-ventilador"}, {"id": "viaaerea", "text": "Reavaliar permeabilidade e proteção da via aérea"}, {"id": "fixacao", "text": "Verificar posição e fixação do dispositivo de via aérea"}, {"id": "desmame", "text": "Avaliar elegibilidade para desmame ventilatório"}]}, {"label": "Metabolismo e função renal", "items": [{"id": "glicemia", "text": "Monitorizar glicemia e ajustar controle conforme protocolo institucional"}, {"id": "eletr", "text": "Monitorizar e corrigir distúrbios hidroeletrolíticos conforme resultados"}, {"id": "diurese", "text": "Controlar diurese e registrar balanço hídrico"}, {"id": "renal", "text": "Reavaliar função renal e adequar doses de medicamentos"}]}, {"label": "Analgesia e sedação", "items": [{"id": "dor", "text": "Reavaliar dor e adequar analgesia"}, {"id": "sedacao", "text": "Titular sedação conforme meta individualizada e reavaliar diariamente"}, {"id": "delirium", "text": "Rastrear delirium e implementar medidas não farmacológicas"}, {"id": "sintomas", "text": "Reavaliar e tratar sintomas conforme necessidade"}]}, {"label": "Profilaxias e cuidados gerais", "items": [{"id": "profilaxiaTEV", "text": "PROFILAXIA TEV/LAMG"}, {"id": "risco", "text": "Reavaliar risco trombótico e hemorrágico e adequação das profilaxias"}, {"id": "lesao", "text": "Implementar prevenção de lesão por pressão"}, {"id": "nutricao", "text": "Reavaliar plano nutricional e tolerância à dieta"}, {"id": "mobilidade", "text": "Avaliar mobilização conforme estabilidade clínica"}, {"id": "dispositivos", "text": "Reavaliar diariamente a necessidade de dispositivos invasivos"}]}, {"label": "Exames e especialidades", "items": [{"id": "labs", "text": "Solicitar exames laboratoriais conforme hipótese clínica"}, {"id": "imagem", "text": "Solicitar exames de imagem conforme indicação clínica"}, {"id": "culturas", "text": "Coletar culturas conforme suspeita infecciosa"}, {"id": "parecer", "text": "Solicitar avaliação especializada conforme necessidade clínica"}, {"id": "resultados", "text": "Reavaliar resultados dos exames e ajustar conduta"}]}, {"label": "Comunicação e destino", "items": [{"id": "aguardarVaga", "text": "Aguardar vaga de UTI/regulação"}, {"id": "manterFamilia", "text": "Manter família informada"}, {"id": "equipe", "text": "Discutir plano terapêutico com a equipe multiprofissional"}, {"id": "passagem", "text": "Realizar passagem de caso com pendências e metas assistenciais"}]}],
        admissionSystems: [
  {
    "id": "general",
    "label": "Estado geral",
    "description": "Aspecto global, pele e conforto",
    "fields": [
      {
        "key": "aspecto",
        "label": "Aspecto geral",
        "unit": ""
      },
      {
        "key": "consciencia",
        "label": "Interação e consciência",
        "unit": ""
      },
      {
        "key": "cor",
        "label": "Coloração / cianose / icterícia",
        "unit": ""
      },
      {
        "key": "hidratacao",
        "label": "Hidratação",
        "unit": ""
      },
      {
        "key": "temperatura",
        "label": "Temperatura",
        "unit": "°C"
      },
      {
        "key": "dor",
        "label": "Dor e conforto",
        "unit": ""
      }
    ]
  },
  {
    "id": "neuro",
    "label": "NEURO",
    "description": "Consciência, exame neurológico e sedação",
    "fields": [
      {
        "key": "consciencia",
        "label": "Nível de consciência",
        "unit": ""
      },
      {
        "key": "glasgow",
        "label": "Glasgow e componentes / NT",
        "unit": ""
      },
      {
        "key": "pupilas",
        "label": "Pupilas e fotorreação",
        "unit": ""
      },
      {
        "key": "motor",
        "label": "Resposta motora e déficits focais",
        "unit": ""
      },
      {
        "key": "sedacao",
        "label": "Sedação / analgesia (droga e dose)",
        "unit": ""
      },
      {
        "key": "rass",
        "label": "RASS",
        "unit": ""
      },
      {
        "key": "delirium",
        "label": "Avaliação de delirium / CAM-ICU",
        "unit": ""
      },
      {
        "key": "convulsoes",
        "label": "Crises ou outros achados",
        "unit": ""
      }
    ]
  },
  {
    "id": "scv",
    "label": "SCV",
    "description": "Hemodinâmica e perfusão",
    "fields": [
      {
        "key": "pa",
        "label": "Pressão arterial",
        "unit": "mmHg"
      },
      {
        "key": "pam",
        "label": "PAM",
        "unit": "mmHg"
      },
      {
        "key": "fc",
        "label": "Frequência cardíaca",
        "unit": "bpm"
      },
      {
        "key": "ritmo",
        "label": "Ritmo e ausculta cardíaca",
        "unit": ""
      },
      {
        "key": "perfusao",
        "label": "Perfusão / enchimento capilar",
        "unit": ""
      },
      {
        "key": "pulsos",
        "label": "Pulsos periféricos",
        "unit": ""
      },
      {
        "key": "edema",
        "label": "Edema",
        "unit": ""
      },
      {
        "key": "dva",
        "label": "Drogas vasoativas (droga, dose e unidade)",
        "unit": ""
      }
    ]
  },
  {
    "id": "sr",
    "label": "SR",
    "description": "Ventilação, oxigenação e ausculta",
    "fields": [
      {
        "key": "via",
        "label": "Via aérea / dispositivo",
        "unit": ""
      },
      {
        "key": "padrao",
        "label": "Padrão e esforço respiratório",
        "unit": ""
      },
      {
        "key": "fr",
        "label": "Frequência respiratória",
        "unit": "irpm"
      },
      {
        "key": "spo2",
        "label": "SpO₂",
        "unit": "%"
      },
      {
        "key": "ausculta",
        "label": "Ausculta pulmonar",
        "unit": ""
      },
      {
        "key": "suporte",
        "label": "Suporte de O₂ / fluxo",
        "unit": ""
      },
      {
        "key": "vm",
        "label": "Ventilação mecânica: modo e parâmetros",
        "unit": ""
      },
      {
        "key": "secrecao",
        "label": "Secreções / drenos torácicos",
        "unit": ""
      },
      {
        "key": "gasometria",
        "label": "Gasometria e horário da coleta",
        "unit": ""
      }
    ]
  },
  {
    "id": "tgi",
    "label": "TGI",
    "description": "Abdome, nutrição e eliminações",
    "fields": [
      {
        "key": "abdome",
        "label": "Inspeção e palpação abdominal",
        "unit": ""
      },
      {
        "key": "ruidos",
        "label": "Ruídos hidroaéreos",
        "unit": ""
      },
      {
        "key": "dieta",
        "label": "Via da dieta e tolerância",
        "unit": ""
      },
      {
        "key": "eliminacoes",
        "label": "Evacuações / última eliminação",
        "unit": ""
      },
      {
        "key": "sondas",
        "label": "Sondas, ostomias e débito",
        "unit": ""
      },
      {
        "key": "sangramento",
        "label": "Sangramento digestivo",
        "unit": ""
      }
    ]
  },
  {
    "id": "rm",
    "label": "R/M",
    "description": "Diurese, balanço e metabolismo",
    "fields": [
      {
        "key": "diurese",
        "label": "Diurese (volume, unidade e período)",
        "unit": ""
      },
      {
        "key": "balanco",
        "label": "Balanço hídrico (volume e período)",
        "unit": ""
      },
      {
        "key": "renal",
        "label": "Ureia / creatinina e tendência",
        "unit": ""
      },
      {
        "key": "eletrolitos",
        "label": "Eletrólitos e horário da coleta",
        "unit": ""
      },
      {
        "key": "glicemia",
        "label": "Glicemia",
        "unit": "mg/dL"
      },
      {
        "key": "acido",
        "label": "Equilíbrio ácido-base",
        "unit": ""
      },
      {
        "key": "dialise",
        "label": "Terapia renal substitutiva / modalidade",
        "unit": ""
      }
    ]
  },
  {
    "id": "hi",
    "label": "H/I",
    "description": "Sangramento e avaliação infecciosa",
    "fields": [
      {
        "key": "febre",
        "label": "Curva térmica / febre",
        "unit": ""
      },
      {
        "key": "foco",
        "label": "Foco suspeito ou identificado",
        "unit": ""
      },
      {
        "key": "pele",
        "label": "Pele, feridas e sítios de dispositivos",
        "unit": ""
      },
      {
        "key": "hemograma",
        "label": "Hb / leucócitos / plaquetas",
        "unit": ""
      },
      {
        "key": "coagulacao",
        "label": "Coagulação",
        "unit": ""
      },
      {
        "key": "sangramento",
        "label": "Sangramentos / equimoses / petéquias",
        "unit": ""
      },
      {
        "key": "culturas",
        "label": "Culturas (sítio, data e resultado)",
        "unit": ""
      },
      {
        "key": "antimicrobianos",
        "label": "Antimicrobianos (indicação e dia de uso)",
        "unit": ""
      }
    ]
  }
],
        // Condutas padrão PA Pro
        paCondutasPadrao: [
            'Sigo protocolo institucional.',
            'Prescrevo medicações sintomáticas durante a permanência na unidade e para tratamento domiciliar.',
            'Oriento detalhadamente paciente acerca da hipótese diagnóstica, evolução esperada do quadro, medidas de suporte e tratamento proposto.',
            'Reforço necessidade de retorno imediato ao Pronto Atendimento em caso de sinais ou sintomas de alarme, incluindo: febre persistente ou alta, dor intensa, dispneia, vômitos persistentes, incapacidade de manter hidratação ou alimentação, rebaixamento do nível de consciência, surgimento de déficits neurológicos, sangramentos, piora do estado geral ou quaisquer novos sintomas relevantes.',
            'Esclareço que a ausência de alterações significativas na avaliação atual não exclui evolução clínica posterior, sendo fundamental reavaliação médica em caso de persistência ou agravamento dos sintomas.',
            'Após melhora clínica e estabilidade, concedo alta com orientações e tratamento domiciliar.'
        ],
        newMed: {
            name: '',
            posology: ''
        },
        conductType: 'prescricao',
        copied: false,
        resetDone: false,

        // Dashboard metrics
        evolucoesDia: 0,
        copiesDia: 0,
        calcsUsadas: 0,
        horaAtual: '--:--',
        showCID: false,
        uiConfig: {
            navigationLayout: 'top',
            enablePrescriptionBank: false
        },
        nav: {
            mobileOpen: false,
            atendimentoOpen: false,
            ferramentasOpen: false
        },
        
        // CID-10 Logic (SOAP)
        cidSearch: '',
        cidResults: [],
        cidLoading: false,
        cidError: '',
        // CID-10 Logic (PA Pro)
        paCidSearch: '',
        paCidResults: [],
        paCidLoading: false,
        paCidError: '',
        
        // Calculators
        showCalculators: false,
        calcSearch: '',
        selectedCalc: null,
        calculators: [
            { id: 'ckd', name: 'Filtro Glomerular (CKD-EPI 2021)', category: 'Nefrologia', source: 'https://www.niddk.nih.gov/research-funding/research-programs/kidney-clinical-research-epidemiology/laboratory/glomerular-filtration-rate-equations/adults' },
            { id: 'curb65', name: 'CURB-65 (Pneumonia)', category: 'Pneumologia', source: 'https://www.mdcalc.com/calc/324/curb-65-score-pneumonia-severity' },
            { id: 'chads', name: 'CHA2DS2-VASc', category: 'Cardiologia', source: 'https://www.mdcalc.com/calc/801/cha2ds2-vasc-score-atrial-fibrillation-stroke-risk' },
            { id: 'wells_tvp', name: 'Escore de Wells (TVP)', category: 'Vascular', source: 'https://www.mdcalc.com/calc/362/wells-criteria-dvt' },
            { id: 'wells_tep', name: 'Escore de Wells (TEP)', category: 'Vascular', source: 'https://www.mdcalc.com/calc/115/wells-criteria-pulmonary-embolism' },
            { id: 'glasgow', name: 'Escala de Glasgow', category: 'Neurologia', source: 'https://www.mdcalc.com/calc/64/glasgow-coma-scale-score-gcs' },
            { id: 'nihss', name: 'NIHSS (AVC)', category: 'Neurologia', source: 'https://www.mdcalc.com/calc/715/nih-stroke-scale-score-nihss', external: true, description: 'Escala completa para avaliação do AVC, com instruções de aplicação no MDCalc.' },
            { id: 'imc', name: 'IMC', category: 'Geral', source: 'https://www.cdc.gov/bmi/adult-calculator/bmi-categories.html' },
            { id: 'has_bled', name: 'HAS-BLED', category: 'Cardiologia', source: 'https://www.mdcalc.com/calc/807/has-bled-score-major-bleeding-risk' },
            { id: 'perc', name: 'PERC Rule (TEP)', category: 'Vascular', source: 'https://www.mdcalc.com/calc/347/perc-rule-pulmonary-embolism' },
            { id: 'carga_tabagica', name: 'Carga Tabágica (Anos-Maço)', category: 'Pneumologia', source: 'https://www.cancer.gov/publications/dictionaries/cancer-terms/def/pack-year' },
            { id: 'carga_etilica', name: 'Carga Etílica (g/dia)', category: 'Geral', source: 'https://www.niaaa.nih.gov/alcohols-effects-health/what-standard-drink' },
            {"id": "pam", "name": "Pressão arterial média (PAM)", "category": "Hemodinâmica", "source": "https://www.mdcalc.com/calc/74/mean-arterial-pressure-map", "description": "Estimativa a partir de PAS e PAD: (PAS + 2 × PAD) / 3. Não substitui a medida invasiva.", "external": false},
            {"id": "anion_gap", "name": "Ânion gap (sem potássio)", "category": "Metabólico", "source": "https://www.mdcalc.com/calc/1669/anion-gap", "description": "Na − (Cl + HCO₃), em mEq/L. Sem correção por albumina; use o MDCalc se precisar dessa correção.", "external": false},
            {"id": "qsofa", "name": "qSOFA", "category": "Sepse", "source": "https://www.mdcalc.com/calc/2654/qsofa-quick-sofa-score-sepsis", "description": "Em adultos com suspeita de infecção fora da UTI. Não diagnostica nem exclui sepse.", "external": false},
            {"id": "heart", "name": "HEART (dor torácica)", "category": "Cardiologia", "source": "https://www.mdcalc.com/calc/1752/heart-score-major-cardiac-events", "description": "Estratificação na dor torácica; inclui história, ECG e troponina.", "external": true},
            {"id": "news2", "name": "NEWS2", "category": "Urgência", "source": "https://www.mdcalc.com/calc/10083/national-early-warning-score-news-2", "description": "Escore de deterioração clínica; confira a indicação da escala de saturação.", "external": true},
            {"id": "sofa", "name": "SOFA", "category": "Terapia intensiva", "source": "https://www.mdcalc.com/calc/691/sequential-organ-failure-assessment-sofa-score", "description": "Disfunção orgânica por sistemas e parâmetros laboratoriais.", "external": true},
            {"id": "saps3", "name": "SAPS 3", "category": "Terapia intensiva", "source": "https://www.mdcalc.com/calc/10403/simplified-acute-physiology-score-saps-3", "description": "Avaliação prognóstica na admissão à UTI.", "external": true},
            {"id": "cockcroft", "name": "Clearance de creatinina (Cockcroft–Gault)", "category": "Nefrologia", "source": "https://www.mdcalc.com/calc/43/creatinine-clearance-cockcroft-gault-equation", "description": "Estimativa de clearance; conferir peso e estabilidade da função renal.", "external": true},
            {"id": "sodio", "name": "Sódio corrigido na hiperglicemia", "category": "Metabólico", "source": "https://www.mdcalc.com/calc/50/sodium-correction-hyperglycemia", "description": "Correção do sódio na presença de hiperglicemia.", "external": true},
            {"id": "qtc", "name": "QT corrigido (QTc)", "category": "Cardiologia", "source": "https://www.mdcalc.com/calc/48/corrected-qt-interval-qtc", "description": "Comparação das fórmulas de correção do QT.", "external": true},
            {"id": "gbs", "name": "Glasgow-Blatchford (HDA)", "category": "Gastroenterologia", "source": "https://www.mdcalc.com/calc/518/glasgow-blatchford-bleeding-score-gbs", "description": "Estratificação da hemorragia digestiva alta.", "external": true},
            {"id": "bisap", "name": "BISAP (pancreatite)", "category": "Gastroenterologia", "source": "https://www.mdcalc.com/calc/1735/bisap-score-pancreatitis-mortality", "description": "Escore para a avaliação inicial da pancreatite.", "external": true},
            {"id": "ottawa", "name": "Ottawa (tornozelo e pé)", "category": "Trauma", "source": "https://www.mdcalc.com/calc/1670/ottawa-ankle-rule", "description": "Critérios de avaliação para radiografia após trauma.", "external": true},
            {"id": "pecarn", "name": "PECARN (trauma craniano pediátrico)", "category": "Pediatria", "source": "https://www.mdcalc.com/calc/589/pecarn-pediatric-head-injury-trauma-algorithm", "description": "Algoritmo por faixa etária; conferir os critérios de inclusão.", "external": true},
            {"id": "canadian_ct", "name": "Canadian CT Head Rule", "category": "Trauma", "source": "https://www.mdcalc.com/calc/608/canadian-ct-head-injury-trauma-rule", "description": "Regra de TC no trauma craniano; conferir elegibilidade.", "external": true},
            {"id": "years", "name": "YEARS (TEP)", "category": "Vascular", "source": "https://www.mdcalc.com/calc/4067/years-algorithm-for-pulmonary-embolism-pe", "description": "Algoritmo de investigação de TEP com D-dímero.", "external": true}
        ],
        scoreDefinitions: {
    "curb65": [
        {
            "key": "conf",
            "label": "Confusão mental nova",
            "weight": 1
        },
        {
            "key": "uremia",
            "label": "Ureia > 7 mmol/L (≈42 mg/dL); BUN > 19,6 mg/dL",
            "weight": 1
        },
        {
            "key": "resp",
            "label": "Frequência respiratória ≥ 30 irpm",
            "weight": 1
        },
        {
            "key": "bp",
            "label": "PAS < 90 ou PAD ≤ 60 mmHg",
            "weight": 1
        },
        {
            "key": "age65",
            "label": "Idade ≥ 65 anos",
            "weight": 1
        }
    ],
    "chads": [
        {
            "key": "chf",
            "label": "Insuficiência cardíaca ou disfunção ventricular esquerda",
            "weight": 1
        },
        {
            "key": "htn",
            "label": "Hipertensão arterial",
            "weight": 1
        },
        {
            "key": "age",
            "label": "Faixa etária",
            "weight": 1
        },
        {
            "key": "dm",
            "label": "Diabetes mellitus",
            "weight": 1
        },
        {
            "key": "stroke",
            "label": "AVC, AIT ou tromboembolismo prévios",
            "weight": 2
        },
        {
            "key": "vasc",
            "label": "Doença vascular (IAM, DAP ou placa aórtica)",
            "weight": 1
        },
        {
            "key": "female",
            "label": "Sexo feminino",
            "weight": 1
        }
    ],
    "wells_tvp": [
        {
            "key": "cancer",
            "label": "Câncer ativo: tratamento nos últimos 6 meses ou paliativo",
            "weight": 1
        },
        {
            "key": "paralysis",
            "label": "Paralisia, paresia ou imobilização gessada recente de membro inferior",
            "weight": 1
        },
        {
            "key": "bedridden",
            "label": "Acamado por mais de 3 dias ou cirurgia maior nas últimas 12 semanas",
            "weight": 1
        },
        {
            "key": "tenderness",
            "label": "Dor localizada no trajeto venoso profundo",
            "weight": 1
        },
        {
            "key": "swelling",
            "label": "Edema de toda a perna",
            "weight": 1
        },
        {
            "key": "calf",
            "label": "Panturrilha > 3 cm maior, medida 10 cm abaixo da tuberosidade tibial",
            "weight": 1
        },
        {
            "key": "edema",
            "label": "Edema depressível restrito à perna sintomática",
            "weight": 1
        },
        {
            "key": "collat",
            "label": "Veias superficiais colaterais não varicosas",
            "weight": 1
        },
        {
            "key": "history",
            "label": "TVP prévia documentada",
            "weight": 1
        },
        {
            "key": "alternative",
            "label": "Diagnóstico alternativo tão ou mais provável que TVP",
            "weight": -2
        }
    ],
    "wells_tep": [
        {
            "key": "dvt",
            "label": "Sinais clínicos de TVP",
            "weight": 3
        },
        {
            "key": "hr",
            "label": "Frequência cardíaca > 100 bpm",
            "weight": 1.5
        },
        {
            "key": "immob",
            "label": "Imobilização ≥ 3 dias ou cirurgia nas últimas 4 semanas",
            "weight": 1.5
        },
        {
            "key": "history",
            "label": "TVP ou TEP prévios",
            "weight": 1.5
        },
        {
            "key": "hemoptysis",
            "label": "Hemoptise",
            "weight": 1
        },
        {
            "key": "cancer",
            "label": "Câncer tratado nos últimos 6 meses ou paliativo",
            "weight": 1
        },
        {
            "key": "alternative",
            "label": "TEP é o diagnóstico mais provável ou igualmente provável",
            "weight": 3
        }
    ],
    "has_bled": [
        {
            "key": "htn",
            "label": "Hipertensão não controlada (PAS > 160 mmHg)",
            "weight": 1
        },
        {
            "key": "renal",
            "label": "Diálise, transplante renal ou creatinina > 2,26 mg/dL",
            "weight": 1
        },
        {
            "key": "liver",
            "label": "Cirrose ou bilirrubina > 2× e AST/ALT/FA > 3× o limite normal",
            "weight": 1
        },
        {
            "key": "stroke",
            "label": "AVC prévio",
            "weight": 1
        },
        {
            "key": "bleeding",
            "label": "Sangramento maior prévio ou predisposição",
            "weight": 1
        },
        {
            "key": "inr",
            "label": "INR lábil / tempo na faixa terapêutica < 60%",
            "weight": 1
        },
        {
            "key": "age65",
            "label": "Idade > 65 anos",
            "weight": 1
        },
        {
            "key": "drugs",
            "label": "Antiagregante ou anti-inflamatório não esteroidal",
            "weight": 1
        },
        {
            "key": "alcohol",
            "label": "Álcool ≥ 8 doses por semana",
            "weight": 1
        }
    ],
    "perc": [
        {
            "key": "lowRisk",
            "label": "Probabilidade pré-teste baixa (< 15%), avaliada clinicamente",
            "weight": 0
        },
        {
            "key": "age50",
            "label": "Idade ≥ 50 anos",
            "weight": 1
        },
        {
            "key": "hr100",
            "label": "Frequência cardíaca ≥ 100 bpm",
            "weight": 1
        },
        {
            "key": "sat95",
            "label": "SpO₂ < 95% em ar ambiente",
            "weight": 1
        },
        {
            "key": "hemoptysis",
            "label": "Hemoptise",
            "weight": 1
        },
        {
            "key": "estrogen",
            "label": "Uso de hormônios estrogênicos",
            "weight": 1
        },
        {
            "key": "dvt",
            "label": "TVP ou TEP prévios",
            "weight": 1
        },
        {
            "key": "surgery",
            "label": "Cirurgia ou trauma há ≤ 4 semanas com anestesia geral",
            "weight": 1
        },
        {
            "key": "leg",
            "label": "Edema unilateral de membro inferior",
            "weight": 1
        }
    ],
    "qsofa": [
        {
            "key": "mental",
            "label": "Alteração do estado mental (Glasgow < 15)",
            "weight": 1
        },
        {
            "key": "resp",
            "label": "Frequência respiratória ≥ 22 irpm",
            "weight": 1
        },
        {
            "key": "bp",
            "label": "Pressão arterial sistólica ≤ 100 mmHg",
            "weight": 1
        }
    ]
},
        // Calculator Inputs
        calcInputs: {
            pam: { pas: '', pad: '' },
            anion_gap: { na: '', cl: '', hco3: '' },
            qsofa: {"mental": -1, "resp": -1, "bp": -1},
            ckd: { creat: '', age: '', sex: 'male' },
            curb65: {"conf": -1, "uremia": -1, "resp": -1, "bp": -1, "age65": -1},
            chads: {"chf": -1, "htn": -1, "age": -1, "dm": -1, "stroke": -1, "vasc": -1, "female": -1},
            wells_tvp: {"cancer": -1, "paralysis": -1, "bedridden": -1, "tenderness": -1, "swelling": -1, "calf": -1, "edema": -1, "collat": -1, "history": -1, "alternative": -1},
            wells_tep: {"dvt": -1, "hr": -1, "immob": -1, "history": -1, "hemoptysis": -1, "cancer": -1, "alternative": -1},
            carga_tabagica: { cigarros_dia: '', anos: '' },
            carga_etilica: { doses_dia: '', tipo_bebida: 'cerveja', gramas_dia: '' },
            glasgow: { eye: '', verbal: '', motor: '' },
            imc: { weight: '', height: '', age: '' },
            has_bled: {"htn": -1, "renal": -1, "liver": -1, "stroke": -1, "bleeding": -1, "inr": -1, "age65": -1, "drugs": -1, "alcohol": -1},
            perc: {"lowRisk": -1, "age50": -1, "hr100": -1, "sat95": -1, "hemoptysis": -1, "estrogen": -1, "dvt": -1, "surgery": -1, "leg": -1},
        },
        calcResult: null,
        calcResultText: '',

        // Inline calculator in exam section
        showInlineCalc: false,
        inlineCalcType: null,

        // Opções de exames físicos adicionais
        additionalExamOptions: [
            { id: 'otoscopia', label: 'Otoscopia', icon: 'fas fa-deaf', normal: 'Membranas timpânicas visualizadas bilateralmente, íntegras, sem hiperemia ou abaulamento.' },
            { id: 'oroscopia', label: 'Oroscopia', icon: 'fas fa-teeth-open', normal: 'Orofaringe sem hiperemia ou exsudato. Úvula centralizada.' },
            { id: 'rinoscopia', label: 'Rinoscopia', icon: 'fas fa-head-side-mask', normal: 'Mucosa nasal sem edema ou secreção visível.' },
            { id: 'oftalmoscopia', label: 'Oftalmoscopia', icon: 'fas fa-eye', normal: 'Discos ópticos com bordas nítidas, sem hemorragias ou exsudatos visíveis no fundo de olho examinado.' },
            { id: 'pele', label: 'Pele/Tegumentar', icon: 'fas fa-allergies', normal: 'Pele examinada íntegra, sem lesões visíveis.' },
            { id: 'linfonodos', label: 'Linfonodos', icon: 'fas fa-circle', normal: 'Sem linfonodomegalias palpáveis nas cadeias examinadas.' },
            { id: 'tireoide', label: 'Tireoide', icon: 'fas fa-neck', normal: 'Tireoide sem aumento ou nódulos palpáveis, indolor à palpação.' },
            { id: 'mamas', label: 'Mamas', icon: 'fas fa-ribbon', normal: 'Mamas sem lesões visíveis, retrações ou nódulos palpáveis.' },
            { id: 'geniturinario', label: 'Geniturinário', icon: 'fas fa-venus-mars', normal: 'Genitália externa examinada sem lesões visíveis.' },
            { id: 'osteoarticular', label: 'Osteoarticular', icon: 'fas fa-bone', normal: 'Articulações examinadas sem edema ou eritema, com amplitude de movimento preservada.' },
            { id: 'vascular', label: 'Vascular Periférico', icon: 'fas fa-wave-square', normal: 'Pulsos periféricos examinados palpáveis e simétricos. Extremidades aquecidas, sem edema.' },
            { id: 'psiquiatrico', label: 'Psiquiátrico', icon: 'fas fa-brain', normal: 'Vigil, com orientação em tempo e espaço preservada e discurso coerente.' },
            { id: 'ocular', label: 'Exame ocular externo', icon: 'fas fa-eye', normal: 'Conjuntivas sem hiperemia e escleras anictéricas. Sem secreção ocular visível.' },
            { id: 'cervical', label: 'Região cervical', icon: 'fas fa-user', normal: 'Pescoço sem massas palpáveis, com mobilidade preservada e indolor ao exame.' },
            { id: 'hidratacao', label: 'Hidratação', icon: 'fas fa-tint', normal: 'Mucosas úmidas, com turgor cutâneo preservado ao exame.' },
            { id: 'perfusao', label: 'Perfusão periférica', icon: 'fas fa-hand-paper', normal: 'Extremidades aquecidas, com tempo de enchimento capilar de até 2 segundos nos locais examinados.' },
            { id: 'marcha', label: 'Marcha', icon: 'fas fa-walking', normal: 'Marcha observada estável, sem desvios ou necessidade de apoio.' },
            { id: 'coordenacao', label: 'Coordenação', icon: 'fas fa-hand-point-up', normal: 'Provas índex-nariz e calcanhar-joelho realizadas sem dismetria.' },
            { id: 'forca', label: 'Força muscular', icon: 'fas fa-hand-rock', normal: 'Força muscular grau 5 nos grupos musculares testados, simétrica bilateralmente.' },
            { id: 'sensibilidade', label: 'Sensibilidade', icon: 'fas fa-hand-paper', normal: 'Sensibilidade tátil preservada e simétrica nos territórios examinados.' }
        ],

        get filteredCalculators() {
            const normalize = value => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
            const query = normalize(this.calcSearch.trim());
            return this.calculators.filter(c => normalize(c.name + ' ' + c.category).includes(query));
        },

        init() {
            // Auto-fill age in calculators from form
            this.$watch('form.age', (value) => {
                this.calcInputs.ckd.age = value || '';
                this.calcInputs.imc.age = value || '';
                this.calcResult = null;
                this.calcResultText = '';
            });
            this.$watch('form.gender', (value) => {
                this.calcInputs.ckd.sex = value === 'Masculino' ? 'male' : 'female';
            });

            // Dashboard: hora ao vivo
            const updateHora = () => {
                const now = new Date();
                this.horaAtual = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
            };
            updateHora();
            setInterval(updateHora, 60000);

            // Dashboard: carregar métricas do localStorage
            const today = new Date().toDateString();
            const stored = JSON.parse(localStorage.getItem('pg_metrics') || '{}');
            if (stored.date === today) {
                this.evolucoesDia = stored.evolucoes || 0;
                this.copiesDia = stored.copies || 0;
                this.calcsUsadas = stored.calcs || 0;
            } else {
                localStorage.setItem('pg_metrics', JSON.stringify({ date: today, evolucoes: 0, copies: 0, calcs: 0 }));
            }
        },

        _incrementMetric(key) {
            const today = new Date().toDateString();
            const stored = JSON.parse(localStorage.getItem('pg_metrics') || '{}');
            if (stored.date !== today) {
                localStorage.setItem('pg_metrics', JSON.stringify({ date: today, evolucoes: 0, copies: 0, calcs: 0 }));
            }
            const m = JSON.parse(localStorage.getItem('pg_metrics'));
            m[key] = (m[key] || 0) + 1;
            localStorage.setItem('pg_metrics', JSON.stringify(m));
            if (key === 'evolucoes') this.evolucoesDia = m[key];
            if (key === 'copies') this.copiesDia = m[key];
            if (key === 'calcs') this.calcsUsadas = m[key];
        },

        // CID-10 Search - Prioriza banco local em PORTUGUÊS
        async searchCID() {
            if (this.cidSearch.length < 2) {
                this.cidResults = [];
                this.cidError = '';
                return;
            }

            this.cidLoading = true;
            this.cidError = '';
            
            try {
                // PRIMEIRO: Busca no banco local em português (mais de 250 CIDs)
                const localResults = this.searchLocalCID(this.cidSearch);
                
                if (localResults.length > 0) {
                    // Se encontrou no banco local, usa esses resultados
                    this.cidResults = localResults;
                } else {
                    // Se não encontrou localmente, tenta a API (em inglês, como fallback)
                    try {
                        const response = await fetch(
                            `https://clinicaltables.nlm.nih.gov/api/icd10cm/v3/search?sf=code,name&terms=${encodeURIComponent(this.cidSearch)}&maxList=10`
                        );
                        
                        if (response.ok) {
                            const data = await response.json();
                            if (data && data[3] && data[3].length > 0) {
                                this.cidResults = data[3].map(item => ({
                                    code: item[0],
                                    name: item[1] + ' (EN)' // Marca como inglês
                                }));
                            } else {
                                this.cidResults = [];
                                this.cidError = 'Nenhum resultado. Tente outro termo ou digite o código CID diretamente.';
                            }
                        } else {
                            this.cidResults = [];
                            this.cidError = 'Nenhum resultado encontrado no banco de dados.';
                        }
                    } catch (apiErr) {
                        this.cidResults = [];
                        this.cidError = 'CID não encontrado. Digite manualmente na seção "Outros".';
                    }
                }
            } catch (err) {
                console.error('CID search error:', err);
                this.cidResults = [];
                this.cidError = 'Erro na busca. Digite manualmente.';
            } finally {
                this.cidLoading = false;
            }
        },

        // Banco de dados CID-10 em PORTUGUÊS - Extenso para uso no PS
        searchLocalCID(term) {
            const cidDatabase = [
                // === SINTOMAS E SINAIS (R00-R99) ===
                { code: 'R05', name: 'Tosse', keywords: 'tosse tossindo' },
                { code: 'R50.9', name: 'Febre não especificada', keywords: 'febre febril hipertermia' },
                { code: 'R51', name: 'Cefaleia', keywords: 'cefaleia dor cabeca cabeza head' },
                { code: 'R10.0', name: 'Abdome agudo', keywords: 'abdome agudo dor abdominal intensa' },
                { code: 'R10.1', name: 'Dor localizada no abdome superior', keywords: 'dor epigastrio epigastrica estomago' },
                { code: 'R10.2', name: 'Dor pélvica e perineal', keywords: 'dor pelvica perineal' },
                { code: 'R10.3', name: 'Dor localizada em outras partes inferiores do abdome', keywords: 'dor fossa iliaca hipogastrio' },
                { code: 'R10.4', name: 'Outras dores abdominais e as não especificadas', keywords: 'dor abdominal barriga' },
                { code: 'R11', name: 'Náusea e vômitos', keywords: 'nausea vomito enjoo emese' },
                { code: 'R11.0', name: 'Náusea', keywords: 'nausea enjoo' },
                { code: 'R11.1', name: 'Vômitos', keywords: 'vomito vomitos emese' },
                { code: 'R06.0', name: 'Dispneia', keywords: 'dispneia falta ar cansaco respirar' },
                { code: 'R06.1', name: 'Estridor', keywords: 'estridor respiratorio' },
                { code: 'R06.2', name: 'Sibilância', keywords: 'sibilancia sibilo chiado' },
                { code: 'R06.4', name: 'Hiperventilação', keywords: 'hiperventilacao' },
                { code: 'R07.0', name: 'Dor de garganta', keywords: 'dor garganta odinofagia' },
                { code: 'R07.1', name: 'Dor torácica ao respirar', keywords: 'dor toracica respirar pleuritica' },
                { code: 'R07.2', name: 'Dor precordial', keywords: 'dor precordial peito coracao' },
                { code: 'R07.3', name: 'Outras dores torácicas', keywords: 'dor toracica peito' },
                { code: 'R07.4', name: 'Dor torácica não especificada', keywords: 'dor toracica torax peito' },
                { code: 'R09.1', name: 'Pleurisia', keywords: 'pleurisia pleural' },
                { code: 'R09.2', name: 'Parada respiratória', keywords: 'parada respiratoria apneia pcr' },
                { code: 'R00.0', name: 'Taquicardia não especificada', keywords: 'taquicardia fc elevada' },
                { code: 'R00.1', name: 'Bradicardia não especificada', keywords: 'bradicardia fc baixa' },
                { code: 'R00.2', name: 'Palpitações', keywords: 'palpitacao palpitacoes coracao acelerado' },
                { code: 'R42', name: 'Tontura e instabilidade', keywords: 'tontura tonto vertigem instabilidade' },
                { code: 'R55', name: 'Síncope e colapso', keywords: 'sincope desmaio colapso lipotimia' },
                { code: 'R40.0', name: 'Sonolência', keywords: 'sonolencia sonolento rebaixamento' },
                { code: 'R40.1', name: 'Estupor', keywords: 'estupor torpor' },
                { code: 'R40.2', name: 'Coma não especificado', keywords: 'coma inconsciente' },
                { code: 'R41.0', name: 'Desorientação não especificada', keywords: 'desorientacao confusao desorientado' },
                { code: 'R41.8', name: 'Outros sintomas e sinais relativos às funções cognitivas', keywords: 'alteracao cognitiva memoria' },
                { code: 'R45.1', name: 'Inquietação e agitação', keywords: 'agitacao agitado inquieto' },
                { code: 'R45.4', name: 'Irritabilidade e mau humor', keywords: 'irritabilidade irritado' },
                { code: 'R45.6', name: 'Violência física', keywords: 'violencia agressividade agressivo' },
                { code: 'R52', name: 'Dor não classificada em outra parte', keywords: 'dor algia' },
                { code: 'R52.0', name: 'Dor aguda', keywords: 'dor aguda' },
                { code: 'R52.2', name: 'Outra dor crônica', keywords: 'dor cronica' },
                { code: 'R53', name: 'Mal-estar e fadiga', keywords: 'mal estar fadiga astenia fraqueza cansaco' },
                { code: 'R56.0', name: 'Convulsões febris', keywords: 'convulsao febril crise' },
                { code: 'R56.8', name: 'Outras convulsões', keywords: 'convulsao crise convulsiva epilepsia' },
                { code: 'R57.0', name: 'Choque cardiogênico', keywords: 'choque cardiogenico' },
                { code: 'R57.1', name: 'Choque hipovolêmico', keywords: 'choque hipovolemico hemorragico' },
                { code: 'R57.2', name: 'Choque séptico', keywords: 'choque septico sepse' },
                { code: 'R57.8', name: 'Outras formas de choque', keywords: 'choque' },
                { code: 'R58', name: 'Hemorragia não classificada', keywords: 'hemorragia sangramento' },
                { code: 'R60.0', name: 'Edema localizado', keywords: 'edema inchaço' },
                { code: 'R60.1', name: 'Edema generalizado', keywords: 'edema anasarca generalizado' },
                { code: 'R63.0', name: 'Anorexia', keywords: 'anorexia inapetencia' },
                { code: 'R63.4', name: 'Perda de peso anormal', keywords: 'perda peso emagrecimento' },
                { code: 'R63.5', name: 'Ganho de peso anormal', keywords: 'ganho peso' },
                { code: 'R68.0', name: 'Hipotermia não associada a baixa temperatura ambiente', keywords: 'hipotermia' },
                
                // === INFECÇÕES RESPIRATÓRIAS (J00-J22) ===
                { code: 'J00', name: 'Resfriado comum (nasofaringite aguda)', keywords: 'resfriado gripe coriza nasofaringite ivas' },
                { code: 'J01.9', name: 'Sinusite aguda não especificada', keywords: 'sinusite aguda' },
                { code: 'J02.9', name: 'Faringite aguda não especificada', keywords: 'faringite dor garganta' },
                { code: 'J03.9', name: 'Amigdalite aguda não especificada', keywords: 'amigdalite amidalite angina' },
                { code: 'J04.0', name: 'Laringite aguda', keywords: 'laringite rouquidao' },
                { code: 'J04.1', name: 'Traqueíte aguda', keywords: 'traqueite' },
                { code: 'J04.2', name: 'Laringotraqueíte aguda', keywords: 'laringotraqueite crupe' },
                { code: 'J05.0', name: 'Laringite obstrutiva aguda (crupe)', keywords: 'crupe laringite obstrutiva estridor' },
                { code: 'J06.9', name: 'Infecção aguda das vias aéreas superiores não especificada', keywords: 'ivas infeccao vias aereas superiores resfriado' },
                { code: 'J10.1', name: 'Influenza com outras manifestações respiratórias, vírus identificado', keywords: 'influenza gripe h1n1' },
                { code: 'J11', name: 'Influenza (gripe) devida a vírus não identificado', keywords: 'influenza gripe sindrome gripal' },
                { code: 'J11.1', name: 'Influenza com outras manifestações respiratórias', keywords: 'gripe influenza' },
                { code: 'J12.9', name: 'Pneumonia viral não especificada', keywords: 'pneumonia viral' },
                { code: 'J13', name: 'Pneumonia devida a Streptococcus pneumoniae', keywords: 'pneumonia pneumococica' },
                { code: 'J15.9', name: 'Pneumonia bacteriana não especificada', keywords: 'pneumonia bacteriana' },
                { code: 'J18.0', name: 'Broncopneumonia não especificada', keywords: 'broncopneumonia' },
                { code: 'J18.1', name: 'Pneumonia lobar não especificada', keywords: 'pneumonia lobar' },
                { code: 'J18.9', name: 'Pneumonia não especificada', keywords: 'pneumonia pnm' },
                { code: 'J20.9', name: 'Bronquite aguda não especificada', keywords: 'bronquite aguda' },
                { code: 'J21.9', name: 'Bronquiolite aguda não especificada', keywords: 'bronquiolite' },
                { code: 'J22', name: 'Infecção aguda não especificada das vias aéreas inferiores', keywords: 'infeccao respiratoria ivai' },
                
                // === DOENÇAS RESPIRATÓRIAS CRÔNICAS (J40-J47) ===
                { code: 'J40', name: 'Bronquite não especificada como aguda ou crônica', keywords: 'bronquite' },
                { code: 'J41.0', name: 'Bronquite crônica simples', keywords: 'bronquite cronica' },
                { code: 'J42', name: 'Bronquite crônica não especificada', keywords: 'bronquite cronica' },
                { code: 'J43.9', name: 'Enfisema não especificado', keywords: 'enfisema pulmonar' },
                { code: 'J44.0', name: 'Doença pulmonar obstrutiva crônica com infecção respiratória aguda', keywords: 'dpoc exacerbado infeccao' },
                { code: 'J44.1', name: 'Doença pulmonar obstrutiva crônica com exacerbação aguda', keywords: 'dpoc exacerbado exacerbacao' },
                { code: 'J44.9', name: 'Doença pulmonar obstrutiva crônica não especificada', keywords: 'dpoc doenca pulmonar obstrutiva cronica' },
                { code: 'J45.0', name: 'Asma predominantemente alérgica', keywords: 'asma alergica' },
                { code: 'J45.1', name: 'Asma não-alérgica', keywords: 'asma' },
                { code: 'J45.9', name: 'Asma não especificada', keywords: 'asma broncoespasmo crise asmatica' },
                { code: 'J46', name: 'Estado de mal asmático', keywords: 'mal asmatico asma grave' },
                { code: 'J47', name: 'Bronquiectasia', keywords: 'bronquiectasia' },
                
                // === OUTRAS DOENÇAS RESPIRATÓRIAS ===
                { code: 'J69.0', name: 'Pneumonite devida a alimento e vômito', keywords: 'pneumonia aspirativa broncoaspiracao' },
                { code: 'J80', name: 'Síndrome do desconforto respiratório do adulto (SDRA)', keywords: 'sdra sara desconforto respiratorio' },
                { code: 'J81', name: 'Edema pulmonar', keywords: 'edema pulmonar eap congestao' },
                { code: 'J90', name: 'Derrame pleural não classificado em outra parte', keywords: 'derrame pleural' },
                { code: 'J93.9', name: 'Pneumotórax não especificado', keywords: 'pneumotorax' },
                { code: 'J96.0', name: 'Insuficiência respiratória aguda', keywords: 'insuficiencia respiratoria aguda ira' },
                { code: 'J96.1', name: 'Insuficiência respiratória crônica', keywords: 'insuficiencia respiratoria cronica' },
                { code: 'J96.9', name: 'Insuficiência respiratória não especificada', keywords: 'insuficiencia respiratoria' },
                
                // === DOENÇAS CARDIOVASCULARES (I00-I99) ===
                { code: 'I10', name: 'Hipertensão essencial (primária)', keywords: 'hipertensao has pressao alta' },
                { code: 'I11.0', name: 'Doença cardíaca hipertensiva com insuficiência cardíaca', keywords: 'cardiopatia hipertensiva icc' },
                { code: 'I11.9', name: 'Doença cardíaca hipertensiva sem insuficiência cardíaca', keywords: 'cardiopatia hipertensiva' },
                { code: 'I13.0', name: 'Doença cardíaca e renal hipertensiva com insuficiência cardíaca', keywords: 'cardiopatia nefropatia hipertensiva' },
                { code: 'I20.0', name: 'Angina instável', keywords: 'angina instavel sca' },
                { code: 'I20.9', name: 'Angina pectoris não especificada', keywords: 'angina pectoris dor precordial' },
                { code: 'I21.0', name: 'Infarto agudo transmural da parede anterior do miocárdio', keywords: 'iam anterior infarto' },
                { code: 'I21.1', name: 'Infarto agudo transmural da parede inferior do miocárdio', keywords: 'iam inferior infarto' },
                { code: 'I21.4', name: 'Infarto agudo subendocárdico do miocárdio', keywords: 'iamsst infarto sem supra' },
                { code: 'I21.9', name: 'Infarto agudo do miocárdio não especificado', keywords: 'iam infarto agudo miocardio sca' },
                { code: 'I24.9', name: 'Doença isquêmica aguda do coração não especificada', keywords: 'isquemia miocardica sca' },
                { code: 'I25.9', name: 'Doença isquêmica crônica do coração não especificada', keywords: 'dac doenca arterial coronariana' },
                { code: 'I26.0', name: 'Embolia pulmonar com menção de cor pulmonale agudo', keywords: 'tep embolia pulmonar grave' },
                { code: 'I26.9', name: 'Embolia pulmonar sem menção de cor pulmonale agudo', keywords: 'tep embolia pulmonar tromboembolismo' },
                { code: 'I42.0', name: 'Cardiomiopatia dilatada', keywords: 'cardiomiopatia dilatada' },
                { code: 'I42.9', name: 'Cardiomiopatia não especificada', keywords: 'cardiomiopatia' },
                { code: 'I46.0', name: 'Parada cardíaca com ressuscitação bem sucedida', keywords: 'pcr parada cardiaca revertida' },
                { code: 'I46.9', name: 'Parada cardíaca não especificada', keywords: 'pcr parada cardiaca' },
                { code: 'I47.1', name: 'Taquicardia supraventricular', keywords: 'taquicardia supraventricular tsv tpsv' },
                { code: 'I47.2', name: 'Taquicardia ventricular', keywords: 'taquicardia ventricular tv' },
                { code: 'I48', name: 'Fibrilação e flutter atrial', keywords: 'fibrilacao atrial fa flutter' },
                { code: 'I48.0', name: 'Fibrilação atrial paroxística', keywords: 'fa paroxistica fibrilacao' },
                { code: 'I48.1', name: 'Fibrilação atrial persistente', keywords: 'fa persistente fibrilacao' },
                { code: 'I48.2', name: 'Fibrilação atrial crônica', keywords: 'fa cronica permanente fibrilacao' },
                { code: 'I48.9', name: 'Fibrilação atrial não especificada', keywords: 'fa fibrilacao atrial' },
                { code: 'I49.5', name: 'Síndrome do nó sinusal', keywords: 'doenca no sinusal bradicardia' },
                { code: 'I49.9', name: 'Arritmia cardíaca não especificada', keywords: 'arritmia' },
                { code: 'I50.0', name: 'Insuficiência cardíaca congestiva', keywords: 'icc insuficiencia cardiaca congestiva' },
                { code: 'I50.1', name: 'Insuficiência ventricular esquerda', keywords: 'ive insuficiencia ventricular esquerda' },
                { code: 'I50.9', name: 'Insuficiência cardíaca não especificada', keywords: 'ic icc insuficiencia cardiaca' },
                { code: 'I61.9', name: 'Hemorragia intracerebral não especificada', keywords: 'avc hemorragico avch hemorragia cerebral' },
                { code: 'I63.9', name: 'Infarto cerebral não especificado', keywords: 'avc isquemico avci infarto cerebral' },
                { code: 'I64', name: 'Acidente vascular cerebral não especificado', keywords: 'avc acidente vascular cerebral derrame' },
                { code: 'I67.4', name: 'Encefalopatia hipertensiva', keywords: 'encefalopatia hipertensiva crise' },
                { code: 'I71.0', name: 'Dissecção da aorta', keywords: 'disseccao aorta' },
                { code: 'I74.3', name: 'Embolia e trombose de artérias dos membros inferiores', keywords: 'isquemia aguda membro oclusao arterial' },
                { code: 'I80.1', name: 'Flebite e tromboflebite da veia femoral', keywords: 'tvp femoral trombose' },
                { code: 'I80.2', name: 'Flebite e tromboflebite de outros vasos profundos dos membros inferiores', keywords: 'tvp trombose venosa profunda' },
                { code: 'I80.9', name: 'Flebite e tromboflebite de localização não especificada', keywords: 'tromboflebite flebite' },
                { code: 'I95.1', name: 'Hipotensão ortostática', keywords: 'hipotensao ortostatica postural' },
                { code: 'I95.9', name: 'Hipotensão não especificada', keywords: 'hipotensao pressao baixa' },
                
                // === DOENÇAS GASTROINTESTINAIS (K00-K93) ===
                { code: 'K21.0', name: 'Doença de refluxo gastroesofágico com esofagite', keywords: 'drge refluxo esofagite' },
                { code: 'K21.9', name: 'Doença de refluxo gastroesofágico sem esofagite', keywords: 'drge refluxo' },
                { code: 'K25.9', name: 'Úlcera gástrica não especificada', keywords: 'ulcera gastrica estomago' },
                { code: 'K26.9', name: 'Úlcera duodenal não especificada', keywords: 'ulcera duodenal' },
                { code: 'K27.9', name: 'Úlcera péptica de localização não especificada', keywords: 'ulcera peptica' },
                { code: 'K29.0', name: 'Gastrite hemorrágica aguda', keywords: 'gastrite hemorragica hda' },
                { code: 'K29.1', name: 'Outras gastrites agudas', keywords: 'gastrite aguda' },
                { code: 'K29.7', name: 'Gastrite não especificada', keywords: 'gastrite' },
                { code: 'K30', name: 'Dispepsia', keywords: 'dispepsia indigestao ma digestao' },
                { code: 'K35.9', name: 'Apendicite aguda não especificada', keywords: 'apendicite' },
                { code: 'K40.9', name: 'Hérnia inguinal unilateral sem obstrução ou gangrena', keywords: 'hernia inguinal' },
                { code: 'K41.9', name: 'Hérnia femoral unilateral sem obstrução ou gangrena', keywords: 'hernia femoral' },
                { code: 'K42.9', name: 'Hérnia umbilical sem obstrução ou gangrena', keywords: 'hernia umbilical' },
                { code: 'K43.9', name: 'Hérnia ventral sem obstrução ou gangrena', keywords: 'hernia ventral incisional' },
                { code: 'K56.0', name: 'Íleo paralítico', keywords: 'ileo paralitico adinamico' },
                { code: 'K56.5', name: 'Aderências intestinais com obstrução', keywords: 'obstrucao intestinal brida aderencia' },
                { code: 'K56.6', name: 'Outra obstrução intestinal e as não especificadas', keywords: 'obstrucao intestinal suboclusao' },
                { code: 'K57.3', name: 'Doença diverticular do intestino grosso sem perfuração ou abscesso', keywords: 'diverticulite diverticulose' },
                { code: 'K59.0', name: 'Constipação', keywords: 'constipacao intestino preso obstipacao' },
                { code: 'K59.1', name: 'Diarreia funcional', keywords: 'diarreia funcional' },
                { code: 'K70.3', name: 'Cirrose hepática alcoólica', keywords: 'cirrose alcoolica hepatica' },
                { code: 'K72.0', name: 'Insuficiência hepática aguda', keywords: 'insuficiencia hepatica aguda hepatite fulminante' },
                { code: 'K72.9', name: 'Insuficiência hepática não especificada', keywords: 'insuficiencia hepatica' },
                { code: 'K74.6', name: 'Outras cirrose do fígado e as não especificadas', keywords: 'cirrose hepatica' },
                { code: 'K76.6', name: 'Hipertensão portal', keywords: 'hipertensao portal' },
                { code: 'K80.0', name: 'Calculose da vesícula biliar com colecistite aguda', keywords: 'colecistite calculosa aguda' },
                { code: 'K80.1', name: 'Calculose da vesícula biliar com outras colecistites', keywords: 'colecistite cronica calculosa' },
                { code: 'K80.2', name: 'Calculose da vesícula biliar sem colecistite', keywords: 'colelitiase colelitíase calculo vesicula' },
                { code: 'K81.0', name: 'Colecistite aguda', keywords: 'colecistite aguda' },
                { code: 'K81.9', name: 'Colecistite não especificada', keywords: 'colecistite' },
                { code: 'K85.9', name: 'Pancreatite aguda não especificada', keywords: 'pancreatite aguda' },
                { code: 'K86.1', name: 'Outras pancreatites crônicas', keywords: 'pancreatite cronica' },
                { code: 'K92.0', name: 'Hematêmese', keywords: 'hematemese vomito sangue hda' },
                { code: 'K92.1', name: 'Melena', keywords: 'melena hda sangue fezes' },
                { code: 'K92.2', name: 'Hemorragia gastrointestinal não especificada', keywords: 'hemorragia digestiva hda hdb' },
                
                // === DOENÇAS INFECCIOSAS (A00-B99) ===
                { code: 'A04.7', name: 'Enterocolite devida a Clostridium difficile', keywords: 'colite clostridium difficile pseudomembranosa' },
                { code: 'A08.0', name: 'Enterite por rotavírus', keywords: 'rotavirus gastroenterite viral' },
                { code: 'A09', name: 'Diarreia e gastroenterite de origem infecciosa presumível', keywords: 'diarreia gastroenterite gea' },
                { code: 'A15.9', name: 'Tuberculose respiratória, sem confirmação', keywords: 'tuberculose tb pulmonar' },
                { code: 'A16.9', name: 'Tuberculose respiratória, não especificada', keywords: 'tuberculose tb' },
                { code: 'A40.9', name: 'Septicemia estreptocócica não especificada', keywords: 'sepse streptococcus' },
                { code: 'A41.0', name: 'Septicemia por Staphylococcus aureus', keywords: 'sepse estafilococo aureus' },
                { code: 'A41.5', name: 'Septicemia por outros microorganismos gram-negativos', keywords: 'sepse gram negativo' },
                { code: 'A41.9', name: 'Septicemia não especificada', keywords: 'sepse septicemia' },
                { code: 'A46', name: 'Erisipela', keywords: 'erisipela celulite' },
                { code: 'A49.9', name: 'Infecção bacteriana não especificada', keywords: 'infeccao bacteriana' },
                { code: 'B34.9', name: 'Infecção viral não especificada', keywords: 'virose infeccao viral' },
                { code: 'B37.0', name: 'Estomatite por Candida', keywords: 'candidiase oral afta' },
                { code: 'B37.9', name: 'Candidíase não especificada', keywords: 'candidiase candidose' },
                { code: 'B86', name: 'Escabiose', keywords: 'escabiose sarna' },
                { code: 'B99', name: 'Outras doenças infecciosas e as não especificadas', keywords: 'infeccao' },
                
                // === COVID-19 ===
                { code: 'U07.1', name: 'COVID-19, vírus identificado', keywords: 'covid coronavirus sars-cov-2' },
                { code: 'U07.2', name: 'COVID-19, vírus não identificado', keywords: 'covid coronavirus suspeito' },
                
                // === DENGUE E ARBOVIROSES ===
                { code: 'A90', name: 'Dengue (dengue clássico)', keywords: 'dengue classica' },
                { code: 'A91', name: 'Febre hemorrágica devida ao vírus do dengue', keywords: 'dengue hemorragica grave' },
                { code: 'A92.0', name: 'Febre de Chikungunya', keywords: 'chikungunya' },
                { code: 'A92.8', name: 'Outras febres virais especificadas transmitidas por mosquitos', keywords: 'zika arbovirose' },
                
                // === DOENÇAS URINÁRIAS (N00-N99) ===
                { code: 'N10', name: 'Nefrite túbulo-intersticial aguda', keywords: 'pielonefrite aguda' },
                { code: 'N12', name: 'Nefrite túbulo-intersticial não especificada', keywords: 'pielonefrite' },
                { code: 'N13.2', name: 'Hidronefrose com obstrução por cálculo', keywords: 'hidronefrose calculo obstrucao' },
                { code: 'N17.9', name: 'Insuficiência renal aguda não especificada', keywords: 'ira insuficiencia renal aguda lra' },
                { code: 'N18.9', name: 'Doença renal crônica não especificada', keywords: 'drc irc insuficiencia renal cronica' },
                { code: 'N19', name: 'Insuficiência renal não especificada', keywords: 'insuficiencia renal' },
                { code: 'N20.0', name: 'Cálculo do rim', keywords: 'calculo renal nefrolitiase pedra rim' },
                { code: 'N20.1', name: 'Cálculo do ureter', keywords: 'calculo ureteral ureterolitiase' },
                { code: 'N20.9', name: 'Cálculo urinário não especificado', keywords: 'calculo urinario litiase' },
                { code: 'N23', name: 'Cólica renal não especificada', keywords: 'colica renal nefretica' },
                { code: 'N30.0', name: 'Cistite aguda', keywords: 'cistite aguda infeccao urinaria baixa' },
                { code: 'N30.9', name: 'Cistite não especificada', keywords: 'cistite' },
                { code: 'N39.0', name: 'Infecção do trato urinário de localização não especificada', keywords: 'itu infeccao urinaria' },
                { code: 'N40', name: 'Hiperplasia da próstata', keywords: 'hpb hiperplasia prostatica benigna' },
                { code: 'N41.0', name: 'Prostatite aguda', keywords: 'prostatite aguda' },
                { code: 'N45.9', name: 'Orquite, epididimite e epididimo-orquite', keywords: 'orquite epididimite' },
                
                // === DISTÚRBIOS METABÓLICOS E ENDÓCRINOS (E00-E90) ===
                { code: 'E10.9', name: 'Diabetes mellitus tipo 1 sem complicações', keywords: 'diabetes tipo 1 dm1' },
                { code: 'E10.1', name: 'Diabetes mellitus tipo 1 com cetoacidose', keywords: 'cetoacidose diabetica cad dm1' },
                { code: 'E11.9', name: 'Diabetes mellitus tipo 2 sem complicações', keywords: 'diabetes tipo 2 dm2' },
                { code: 'E11.0', name: 'Diabetes mellitus tipo 2 com coma', keywords: 'coma diabetico dm2' },
                { code: 'E11.1', name: 'Diabetes mellitus tipo 2 com cetoacidose', keywords: 'cetoacidose dm2' },
                { code: 'E13.1', name: 'Outros tipos de diabetes mellitus com cetoacidose', keywords: 'cetoacidose diabetica cad' },
                { code: 'E14.9', name: 'Diabetes mellitus não especificado sem complicações', keywords: 'diabetes dm' },
                { code: 'E16.0', name: 'Hipoglicemia medicamentosa sem coma', keywords: 'hipoglicemia' },
                { code: 'E16.2', name: 'Hipoglicemia não especificada', keywords: 'hipoglicemia glicose baixa' },
                { code: 'E86', name: 'Depleção de volume', keywords: 'desidratacao deplecao volume hipovolemia' },
                { code: 'E87.0', name: 'Hiperosmolaridade e hipernatremia', keywords: 'hipernatremia' },
                { code: 'E87.1', name: 'Hiposmolaridade e hiponatremia', keywords: 'hiponatremia' },
                { code: 'E87.2', name: 'Acidose', keywords: 'acidose metabolica' },
                { code: 'E87.3', name: 'Alcalose', keywords: 'alcalose metabolica' },
                { code: 'E87.4', name: 'Distúrbio misto do equilíbrio ácido-básico', keywords: 'disturbio acido base' },
                { code: 'E87.5', name: 'Hiperpotassemia', keywords: 'hiperpotassemia hipercalemia potassio alto' },
                { code: 'E87.6', name: 'Hipopotassemia', keywords: 'hipopotassemia hipocalemia potassio baixo' },
                { code: 'E87.7', name: 'Sobrecarga de líquidos', keywords: 'hipervolemia sobrecarga hidrica' },
                { code: 'E87.8', name: 'Outros transtornos do equilíbrio hidroeletrolítico', keywords: 'disturbio eletrolitico' },
                
                // === TRANSTORNOS MENTAIS (F00-F99) ===
                { code: 'F05.9', name: 'Delirium não especificado', keywords: 'delirium confusao mental' },
                { code: 'F10.0', name: 'Transtornos mentais devidos ao uso de álcool - intoxicação aguda', keywords: 'intoxicacao alcoolica embriaguez' },
                { code: 'F10.3', name: 'Transtornos mentais devidos ao uso de álcool - abstinência', keywords: 'abstinencia alcoolica saa' },
                { code: 'F10.4', name: 'Transtornos mentais devidos ao uso de álcool - abstinência com delirium', keywords: 'delirium tremens' },
                { code: 'F19.0', name: 'Transtornos mentais devidos ao uso de múltiplas drogas - intoxicação', keywords: 'intoxicacao drogas overdose' },
                { code: 'F20.9', name: 'Esquizofrenia não especificada', keywords: 'esquizofrenia' },
                { code: 'F23', name: 'Transtornos psicóticos agudos e transitórios', keywords: 'psicose aguda surto psicotico' },
                { code: 'F29', name: 'Psicose não-orgânica não especificada', keywords: 'psicose' },
                { code: 'F31.9', name: 'Transtorno afetivo bipolar não especificado', keywords: 'bipolar tab' },
                { code: 'F32.0', name: 'Episódio depressivo leve', keywords: 'depressao leve' },
                { code: 'F32.1', name: 'Episódio depressivo moderado', keywords: 'depressao moderada' },
                { code: 'F32.2', name: 'Episódio depressivo grave sem sintomas psicóticos', keywords: 'depressao grave' },
                { code: 'F32.9', name: 'Episódio depressivo não especificado', keywords: 'depressao' },
                { code: 'F41.0', name: 'Transtorno de pânico', keywords: 'panico sindrome panico' },
                { code: 'F41.1', name: 'Ansiedade generalizada', keywords: 'ansiedade tag' },
                { code: 'F41.9', name: 'Transtorno ansioso não especificado', keywords: 'ansiedade' },
                { code: 'F43.0', name: 'Reação aguda ao estresse', keywords: 'estresse agudo reacao' },
                { code: 'F43.1', name: 'Estado de estresse pós-traumático', keywords: 'tept estresse pos traumatico' },
                { code: 'F44.9', name: 'Transtorno dissociativo não especificado', keywords: 'conversivo dissociativo' },
                { code: 'F45.0', name: 'Transtorno de somatização', keywords: 'somatizacao' },
                
                // === DOENÇAS NEUROLÓGICAS (G00-G99) ===
                { code: 'G00.9', name: 'Meningite bacteriana não especificada', keywords: 'meningite bacteriana' },
                { code: 'G03.9', name: 'Meningite não especificada', keywords: 'meningite' },
                { code: 'G04.9', name: 'Encefalite, mielite e encefalomielite não especificada', keywords: 'encefalite' },
                { code: 'G40.9', name: 'Epilepsia não especificada', keywords: 'epilepsia crise convulsiva' },
                { code: 'G41.0', name: 'Estado de mal epiléptico', keywords: 'status epilepticus mal epileptico' },
                { code: 'G43.0', name: 'Enxaqueca sem aura', keywords: 'enxaqueca sem aura migranea' },
                { code: 'G43.1', name: 'Enxaqueca com aura', keywords: 'enxaqueca com aura migranea' },
                { code: 'G43.9', name: 'Enxaqueca não especificada', keywords: 'enxaqueca migranea' },
                { code: 'G44.2', name: 'Cefaleia tensional', keywords: 'cefaleia tensional' },
                { code: 'G45.9', name: 'Isquemia cerebral transitória não especificada', keywords: 'ait ataque isquemico transitorio' },
                { code: 'G51.0', name: 'Paralisia de Bell', keywords: 'paralisia facial bell' },
                { code: 'G61.0', name: 'Síndrome de Guillain-Barré', keywords: 'guillain barre polirradiculoneuropatia' },
                { code: 'G81.9', name: 'Hemiplegia não especificada', keywords: 'hemiplegia hemiparesia' },
                { code: 'G82.2', name: 'Paraplegia não especificada', keywords: 'paraplegia paraparesia' },
                { code: 'G83.9', name: 'Síndrome paralítica não especificada', keywords: 'paralisia paresia' },
                { code: 'G93.1', name: 'Lesão cerebral anóxica não classificada em outra parte', keywords: 'encefalopatia hipoxica anoxica' },
                { code: 'G93.4', name: 'Encefalopatia não especificada', keywords: 'encefalopatia' },
                
                // === DOENÇAS MUSCULOESQUELÉTICAS (M00-M99) ===
                { code: 'M10.9', name: 'Gota não especificada', keywords: 'gota artrite gotosa' },
                { code: 'M13.9', name: 'Artrite não especificada', keywords: 'artrite' },
                { code: 'M25.5', name: 'Dor articular', keywords: 'dor articular artralgia' },
                { code: 'M54.2', name: 'Cervicalgia', keywords: 'cervicalgia dor pescoco cervical' },
                { code: 'M54.4', name: 'Lumbago com ciática', keywords: 'lombociatalgia ciatica' },
                { code: 'M54.5', name: 'Dor lombar baixa', keywords: 'lombalgia dor lombar costas' },
                { code: 'M54.9', name: 'Dorsalgia não especificada', keywords: 'dorsalgia dor costas' },
                { code: 'M62.8', name: 'Outros transtornos musculares especificados', keywords: 'dor muscular mialgia' },
                { code: 'M79.1', name: 'Mialgia', keywords: 'mialgia dor muscular' },
                { code: 'M79.3', name: 'Paniculite não especificada', keywords: 'paniculite celulite' },
                
                // === PELE E TECIDO SUBCUTÂNEO (L00-L99) ===
                { code: 'L02.9', name: 'Abscesso cutâneo, furúnculo e carbúnculo', keywords: 'abscesso furunculo' },
                { code: 'L03.9', name: 'Celulite não especificada', keywords: 'celulite erisipela' },
                { code: 'L08.9', name: 'Infecção localizada da pele e tecido subcutâneo', keywords: 'infeccao pele' },
                { code: 'L27.0', name: 'Erupção cutânea generalizada devida a drogas e medicamentos', keywords: 'farmacodermia reacao droga' },
                { code: 'L50.0', name: 'Urticária alérgica', keywords: 'urticaria alergica' },
                { code: 'L50.9', name: 'Urticária não especificada', keywords: 'urticaria' },
                { code: 'L89.9', name: 'Úlcera de decúbito não especificada', keywords: 'escara ulcera pressao decubito' },
                
                // === TRAUMA E INTOXICAÇÕES (S00-T98) ===
                { code: 'S00.9', name: 'Traumatismo superficial da cabeça', keywords: 'trauma cranio tce leve' },
                { code: 'S06.0', name: 'Concussão', keywords: 'concussao tce' },
                { code: 'S06.9', name: 'Traumatismo intracraniano não especificado', keywords: 'tce traumatismo cranio' },
                { code: 'S22.3', name: 'Fratura de costela', keywords: 'fratura costela' },
                { code: 'S32.0', name: 'Fratura de vértebra lombar', keywords: 'fratura lombar vertebra' },
                { code: 'S42.0', name: 'Fratura de clavícula', keywords: 'fratura clavicula' },
                { code: 'S52.9', name: 'Fratura do antebraço não especificada', keywords: 'fratura antebraco radio ulna' },
                { code: 'S62.9', name: 'Fratura ao nível do punho e da mão', keywords: 'fratura mao punho' },
                { code: 'S72.0', name: 'Fratura do colo do fêmur', keywords: 'fratura colo femur quadril' },
                { code: 'S72.9', name: 'Fratura do fêmur não especificada', keywords: 'fratura femur' },
                { code: 'S82.9', name: 'Fratura da perna não especificada', keywords: 'fratura perna tibia fibula' },
                { code: 'S93.4', name: 'Entorse e distensão do tornozelo', keywords: 'entorse tornozelo' },
                { code: 'T14.9', name: 'Traumatismo não especificado', keywords: 'trauma' },
                { code: 'T36.9', name: 'Intoxicação por antibióticos sistêmicos', keywords: 'intoxicacao antibiotico' },
                { code: 'T39.1', name: 'Intoxicação por derivados do ácido propiônico', keywords: 'intoxicacao ibuprofeno aine' },
                { code: 'T39.3', name: 'Intoxicação por outros anti-inflamatórios', keywords: 'intoxicacao antiinflamatorio' },
                { code: 'T40.2', name: 'Intoxicação por outros opioides', keywords: 'intoxicacao opioide morfina' },
                { code: 'T42.4', name: 'Intoxicação por benzodiazepínicos', keywords: 'intoxicacao benzodiazepinicos' },
                { code: 'T43.9', name: 'Intoxicação por substância psicotrópica', keywords: 'intoxicacao psicotropico' },
                { code: 'T50.9', name: 'Intoxicação por outras drogas e medicamentos', keywords: 'intoxicacao medicamentosa' },
                { code: 'T51.0', name: 'Efeito tóxico do etanol', keywords: 'intoxicacao etanol alcool' },
                { code: 'T65.9', name: 'Efeito tóxico de substância não especificada', keywords: 'intoxicacao' },
                { code: 'T71', name: 'Asfixia', keywords: 'asfixia sufocamento' },
                { code: 'T75.1', name: 'Afogamento e submersão não fatal', keywords: 'afogamento' },
                { code: 'T78.0', name: 'Choque anafilático devido a reação adversa a alimento', keywords: 'anafilaxia alimento' },
                { code: 'T78.2', name: 'Choque anafilático não especificado', keywords: 'anafilaxia choque anafilatico' },
                { code: 'T78.3', name: 'Edema angioneurótico', keywords: 'angioedema edema quincke' },
                { code: 'T78.4', name: 'Alergia não especificada', keywords: 'alergia reacao alergica' },
                { code: 'T79.4', name: 'Embolia gordurosa traumática', keywords: 'embolia gordurosa' },
                { code: 'T81.4', name: 'Infecção subsequente a procedimento', keywords: 'infeccao pos operatoria' },
                { code: 'T88.6', name: 'Choque anafilático devido a efeito adverso de droga ou medicamento', keywords: 'anafilaxia medicamento' },
                
                // === OBSERVAÇÃO E SUSPEITA (Z00-Z99) ===
                { code: 'Z03.9', name: 'Observação por suspeita de doença ou afecção não especificada', keywords: 'observacao suspeita investigacao' },
                { code: 'Z51.5', name: 'Cuidados paliativos', keywords: 'paliativo cuidados paliativos' },
                { code: 'Z76.3', name: 'Pessoa saudável acompanhando pessoa doente', keywords: 'acompanhante' },
                
                // === GRAVIDEZ E PARTO (O00-O99) ===
                { code: 'O03.9', name: 'Aborto espontâneo completo ou não especificado', keywords: 'aborto espontaneo' },
                { code: 'O20.0', name: 'Ameaça de aborto', keywords: 'ameaca aborto sangramento' },
                { code: 'O21.0', name: 'Hiperêmese gravídica leve', keywords: 'hiperemese gravidica vomitos gravidez' },
                { code: 'O26.8', name: 'Outras afecções especificadas ligadas à gravidez', keywords: 'complicacao gravidez' },
                { code: 'O46.9', name: 'Hemorragia anteparto não especificada', keywords: 'sangramento gravidez' },
                { code: 'O47.9', name: 'Falso trabalho de parto não especificado', keywords: 'falso trabalho parto' },
                { code: 'O60', name: 'Trabalho de parto pré-termo', keywords: 'trabalho parto prematuro' },
                { code: 'O80', name: 'Parto único espontâneo', keywords: 'parto normal' }
            ];

            const searchLower = term.toLowerCase()
                .normalize('NFD').replace(/[\u0300-\u036f]/g, ''); // Remove acentos
            
            return cidDatabase.filter(cid => {
                const codeLower = cid.code.toLowerCase();
                const nameLower = cid.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
                const keywordsLower = (cid.keywords || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
                
                return codeLower.includes(searchLower) ||
                       nameLower.includes(searchLower) ||
                       keywordsLower.includes(searchLower);
            }).slice(0, 15);
        },

        selectCID(cid) {
            const diagnosis = `${cid.code} - ${cid.name}`;
            if (!this.form.assessment.diagnoses.includes(diagnosis)) {
                this.form.assessment.diagnoses.push(diagnosis);
            }
            this.cidSearch = '';
            this.cidResults = [];
        },

        removeDiagnosis(index) {
            this.form.assessment.diagnoses.splice(index, 1);
        },

        // CID para PA Pro — reutiliza a mesma lógica de busca
        async searchPACID() {
            if (this.paCidSearch.length < 2) {
                this.paCidResults = [];
                this.paCidError = '';
                return;
            }
            this.paCidLoading = true;
            this.paCidError = '';
            try {
                const localResults = this.searchLocalCID(this.paCidSearch);
                if (localResults.length > 0) {
                    this.paCidResults = localResults;
                } else {
                    try {
                        const response = await fetch(
                            `https://clinicaltables.nlm.nih.gov/api/icd10cm/v3/search?sf=code,name&terms=${encodeURIComponent(this.paCidSearch)}&maxList=10`
                        );
                        if (response.ok) {
                            const data = await response.json();
                            if (data && data[3] && data[3].length > 0) {
                                this.paCidResults = data[3].map(item => ({ code: item[0], name: item[1] + ' (EN)' }));
                            } else {
                                this.paCidResults = [];
                                this.paCidError = 'Nenhum resultado. Tente outro termo ou código.';
                            }
                        } else {
                            this.paCidResults = [];
                            this.paCidError = 'Sem resultado no banco de dados.';
                        }
                    } catch {
                        this.paCidResults = [];
                        this.paCidError = 'Erro na busca. Digite manualmente abaixo.';
                    }
                }
            } catch (err) {
                this.paCidResults = [];
                this.paCidError = 'Erro na busca.';
            } finally {
                this.paCidLoading = false;
            }
        },

        selectPACID(cid) {
            if (!this.form.pa.pa_diagnoses) this.form.pa.pa_diagnoses = [];
            const diagnosis = `${cid.code} - ${cid.name}`;
            if (!this.form.pa.pa_diagnoses.includes(diagnosis)) {
                this.form.pa.pa_diagnoses.push(diagnosis);
            }
            this.paCidSearch = '';
            this.paCidResults = [];
        },

        addMed() {
            if (this.newMed.name) {
                this.form.medications.push({
                    name: this.newMed.name,
                    posology: this.newMed.posology || 'Posologia não informada'
                });
                this.newMed.name = '';
                this.newMed.posology = '';
            }
        },

        removeMed(index) {
            this.form.medications.splice(index, 1);
        },

        normalExamText(section) {
            const isMale = this.form.gender === 'Masculino';
            const normals = {
                general: isMale 
                    ? 'Em bom estado geral, lúcido, orientado, corado, hidratado, anictérico, acianótico e eupneico.'
                    : 'Em bom estado geral, lúcida, orientada, corada, hidratada, anictérica, acianótica e eupneica.',
                cardiac: 'Bulhas cardíacas rítmicas e normofonéticas em dois tempos, sem sopros audíveis.',
                pulmonary: 'Murmúrio vesicular presente bilateralmente, sem ruídos adventícios.',
                abdominal: 'Abdome flácido e indolor à palpação, com ruídos hidroaéreos presentes, sem massas palpáveis.',
                neuro: 'Pupilas isocóricas e fotorreagentes. Sem déficits focais evidentes ao exame.',
                extremities: 'Extremidades aquecidas, sem edema, com pulsos periféricos examinados palpáveis e simétricos.'
            };
            return normals[section] || '';
        },

        setNormal(section) {
            const value = this.normalExamText(section);
            if (value) this.form.exam[section] = value;
        },

        setPANormal(section) {
            const sections = { geral: 'general', ap: 'pulmonary', ac: 'cardiac', abd: 'abdominal', neuro: 'neuro', extremidades: 'extremities', outros: 'extremities' };
            const field = sections[section];
            if (field) this.form.pa['ef_' + section] = this.normalExamText(field);
        },

        addPAExam(id, label) {
            if (!this.form.pa.ef_adicionais.some(ex => ex.id === id)) {
                this.form.pa.ef_adicionais.push({ id, nome: label, resultado: '' });
            }
        },

        addPACustomExam() {
            const label = prompt('Nome do exame físico adicional:');
            if (label && label.trim()) this.addPAExam('custom_' + Date.now() + '_' + Math.random().toString(36).slice(2), label.trim());
        },

        setPAAdditionalNormal(index) {
            const exam = this.form.pa.ef_adicionais[index];
            const option = exam && this.additionalExamOptions.find(item => item.id === exam.id);
            if (option) exam.resultado = option.normal;
        },

        admissionChoice(section, key) {
            const value = this.admissionValue(section, key);
            const id = section + '.' + key;
            if (this.admissionOther[id]) return '__other__';
            if (!value) return '';
            return (this.admissionOptions[id] || []).includes(value) ? value : '__other__';
        },
        chooseAdmission(section, key, value) {
            const id = section + '.' + key;
            this.admissionOther[id] = value === '__other__';
            this.setAdmissionValue(section, key, value === '__other__' ? '' : value);
        },
        admissionConductText() {
            const values = this.form.uti.condutas;
            const manual = String(values.outras || '').split(/\r\n|\n|\r/)
                .map(line => line.trim().replace(/^(?:[-•]\s*)+/, '').trim()).filter(Boolean);
            const selected = this.admissionConductGroups.flatMap(group => group.items)
                .filter(item => values[item.id]).map(item => item.text);
            return [...manual, ...selected].map(line => '- ' + line).join('\n');
        },

        admissionValue(section, key) {
            return this.form.uti.systems[section]?.[key] || '';
        },
        setAdmissionValue(section, key, value) {
            if (!this.form.uti.systems[section]) this.form.uti.systems[section] = {};
            this.form.uti.systems[section][key] = value;
        },
        admissionSystemText(section) {
            const definition = this.admissionSystems.find(item => item.id === section);
            if (!definition) return '';
            const clean = value => String(value ?? '').trim().replace(/[.;,]+$/, '').trim();
            const normalize = value => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
            const get = key => clean(this.admissionValue(section, key));
            const negative = value => /^(ausente|ausentes|nao|nega|nenhum|nenhuma)$/i.test(normalize(value));
            const unit = (value, suffix) => /^[-+]?\d+(?:[.,]\d+)?(?:[x/]\d+(?:[.,]\d+)?)?$/.test(value) ? value + ' ' + suffix : value;
            // Only translate documented terms; arbitrary descriptions retain their meaning.
            const describe = (value, prefix, already) => already.test(value) ? value : prefix + value;
            const lower = value => /^[A-ZÁÉÍÓÚÂÊÔÃÕÇ][a-záéíóúâêôãõç]/.test(value) ? value[0].toLowerCase() + value.slice(1) : value;
            const phrases = [];
            const add = value => { if (value && !phrases.some(p => normalize(p) === normalize(value))) phrases.push(value); };
            const transforms = {
                general: {
                    aspecto: v => ({bom:'Paciente em bom estado geral',regular:'Paciente em regular estado geral',ruim:'Paciente em mau estado geral',mau:'Paciente em mau estado geral',grave:'Paciente em estado geral grave',gravissimo:'Paciente em estado geral gravíssimo'}[normalize(v)] || describe(v, 'Paciente em ', /^(paciente|em )/i)),
                    consciencia: v => lower(v),
                    hidratacao: v => lower(v),
                    cor: v => negative(v) ? 'acianótico e anictérico' : lower(v),
                    temperatura: v => 'T ' + unit(v, '°C'),
                    dor: v => lower(v).replace(/^confortavel, sem facies de dor$/i, 'confortável e sem fácies de dor')
                },
                neuro: {
                    consciencia: v => lower(v),
                    glasgow: v => describe(v, 'Glasgow ', /^glasgow/i),
                    pupilas: v => describe(lower(v), 'pupilas ', /^pupilas/i),
                    motor: v => lower(v),
                    sedacao: v => negative(v) ? 'sem sedação ou analgesia informadas em uso' : describe(v, 'sob sedação/analgesia com ', /^(sem |sob |em uso|sedad|analgesi)/i),
                    rass: v => describe(v, 'RASS ', /^RASS/i),
                    delirium: v => describe(v, 'avaliação de delirium ', /^(CAM|sem delirium|delirium|nao avali|não avali)/i),
                    convulsoes: v => negative(v) ? 'sem crises descritas' : lower(v)
                },
                scv: {
                    pa: v => describe(unit(v, 'mmHg'), 'PA ', /^PA\b/i),
                    pam: v => describe(unit(v, 'mmHg'), 'PAM ', /^PAM\b/i),
                    fc: v => describe(unit(v, 'bpm'), 'FC ', /^FC\b/i),
                    ritmo: v => lower(v), perfusao: v => describe(lower(v), 'perfusão periférica ', /^(perfus|enchimento|TEC|extremidades)/i),
                    pulsos: v => describe(lower(v), 'pulsos periféricos ', /^pulsos/i),
                    edema: v => negative(v) ? 'sem edema' : describe(lower(v), 'edema ', /^(edema|sem edema)/i),
                    dva: v => negative(v) ? 'sem drogas vasoativas' : describe(v, 'em uso de ', /^(em uso|sem |sob )/i)
                },
                sr: {
                    via: v => lower(v), padrao: v => lower(v),
                    fr: v => describe(unit(v, 'irpm'), 'FR ', /^FR\b/i),
                    spo2: v => describe(unit(v, '%'), 'SpO₂ ', /^(SpO[2₂]|Sat)/i),
                    ausculta: v => lower(v),
                    suporte: v => describe(lower(v), 'em ', /^(em |sob |sem |respirando)/i),
                    vm: v => negative(v) ? 'sem ventilação mecânica' : describe(v, 'em VM ', /^(em |VM|ventila|sem )/i),
                    secrecao: v => describe(lower(v), 'quanto a secreções/drenos, ', /^(sem |secre|dreno)/i),
                    gasometria: v => describe(v, 'gasometria com ', /^gasometria/i)
                },
                tgi: {
                    abdome: v => describe(lower(v), 'abdome ', /^(abdome|abdomen)/i),
                    ruidos: v => negative(v) ? 'ruídos hidroaéreos ausentes' : describe(lower(v), 'ruídos hidroaéreos ', /^(ruidos|ruídos|RHA)/i),
                    dieta: v => describe(lower(v), 'dieta ', /^(dieta|em jejum|jejum|sem dieta)/i),
                    eliminacoes: v => describe(lower(v), 'evacuações ', /^(evacua|sem |ultima|última)/i),
                    sondas: v => lower(v),
                    sangramento: v => negative(v) ? 'sem sangramento digestivo' : describe(lower(v), 'sangramento digestivo ', /^(sangramento|sem |melena|hemate|hemato)/i)
                },
                rm: {
                    diurese: v => describe(v, 'diurese de ', /^(diurese|anur|oligur|sem )/i),
                    balanco: v => describe(v, 'balanço hídrico de ', /^(balan|BH\b)/i),
                    renal: v => describe(v, 'avaliação renal com ', /^(ureia|creatinina|Cr\b|funcao|função)/i),
                    eletrolitos: v => describe(v, 'eletrólitos com ', /^(eletr|Na\b|K\b|sodio|sódio|pot)/i),
                    glicemia: v => describe(unit(v, 'mg/dL'), 'glicemia ', /^(glicemia|HGT)/i),
                    acido: v => lower(v),
                    dialise: v => negative(v) ? 'sem terapia renal substitutiva' : describe(v, 'em terapia renal substitutiva por ', /^(em |sem |hemodia|dialise|diálise|TRS)/i)
                },
                hi: {
                    febre: v => negative(v) ? 'sem febre documentada' : lower(v),
                    foco: v => negative(v) ? 'sem foco infeccioso identificado' : describe(lower(v), 'foco infeccioso ', /^(foco|suspeita|sem |nao|não)/i),
                    pele: v => lower(v),
                    hemograma: v => describe(v, 'hemograma com ', /^(hemograma|Hb\b|hemoglobina|leuco|plaq)/i),
                    coagulacao: v => describe(v, 'coagulação com ', /^(coagula|INR|TTP|TP\b)/i),
                    sangramento: v => negative(v) ? 'sem sangramentos descritos' : lower(v),
                    culturas: v => describe(v, 'culturas ', /^(culturas|hemocultura|urocultura|aguard|nao|não)/i),
                    antimicrobianos: v => negative(v) ? 'sem antimicrobianos em uso' : describe(v, 'em uso de ', /^(em uso|sem |sob )/i)
                }
            };
            const order = section === 'general' ? ['aspecto', 'consciencia', 'hidratacao', 'cor', 'temperatura', 'dor'] : definition.fields.map(f => f.key);
            for (const key of order) {
                const value = get(key);
                if (value) add(transforms[section][key](value));
            }
            let text = phrases.join(', ');
            if (text) text = text[0].toUpperCase() + text.slice(1) + '.';
            const notes = clean(this.form.uti.evolucao[section]);
            if (notes && !phrases.some(p => normalize(p) === normalize(notes))) text += (text ? ' ' : '') + notes + (/[!?]$/.test(notes) ? '' : '.');
            return text;
        },

        setAdmissionNormal(section) {
            const sections = { general: 'general', neuro: 'neuro', scv: 'cardiac', sr: 'pulmonary', tgi: 'abdominal', extr: 'extremities' };
            const clinical = {
                rm: 'Mucosas úmidas, sem edema periférico ou distensão suprapúbica ao exame.',
                hi: 'Pele e mucosas examinadas sem petéquias, equimoses ou sangramento visível.'
            };
            this.form.uti.evolucao[section] = clinical[section] || this.normalExamText(sections[section]);
        },

        // Exames físicos adicionais
        addAdditionalExam(id, label) {
            // Verifica se já existe
            if (!this.form.exam.additional.some(e => e.id === id)) {
                this.form.exam.additional.push({
                    id: id,
                    label: label,
                    value: ''
                });
            }
        },

        removeAdditionalExam(index) {
            this.form.exam.additional.splice(index, 1);
        },

        addCustomExam() {
            const label = prompt('Nome do exame físico adicional:');
            if (label && label.trim()) {
                const id = 'custom_' + Date.now() + '_' + Math.random().toString(36).slice(2);
                this.form.exam.additional.push({
                    id: id,
                    label: label.trim(),
                    value: ''
                });
            }
        },

        setAdditionalNormal(index) {
            const exam = this.form.exam.additional[index];
            if (!exam) return;
            
            const option = this.additionalExamOptions.find(item => item.id === exam.id);
            if (option && option.normal) exam.value = option.normal;
        },

        // Open inline calculator
        openInlineCalc(type) {
            this.inlineCalcType = type;
            this.showInlineCalc = true;
            this.calcResult = null;
            this.calcResultText = '';
        },

        closeInlineCalc() {
            this.showInlineCalc = false;
            this.inlineCalcType = null;
        },

        // Insert calculator result into exam field
        insertCalcResult(field) {
            if (this.calcResultText) {
                if (this.form.exam[field]) {
                    this.form.exam[field] += ' ' + this.calcResultText;
                } else {
                    this.form.exam[field] = this.calcResultText;
                }
                this.closeInlineCalc();
            }
        },

        // Adiciona resultado ao exame físico
        addToExam(field, text) {
            if (!text) return;
            let target = this.form.exam;
            let key = field;
            if (this.form.serviceType === 'pa_pro') {
                target = this.form.pa;
                key = { general: 'ef_geral', cardiac: 'ef_ac', pulmonary: 'ef_ap', abdominal: 'ef_abd', neuro: 'ef_neuro', extremities: 'ef_extremidades' }[field];
            } else if (this.form.serviceType === 'salavermelha') {
                if (this.form.utiTemplate === 'xabcde') {
                    target = this.form.xabcde;
                    key = 'impressao_hipotese';
                } else {
                    target = this.form.uti.evolucao;
                    key = { general: 'general', cardiac: 'scv', pulmonary: 'sr', abdominal: 'tgi', neuro: 'neuro', extremities: 'extr' }[field];
                }
            }
            if (key) target[key] = target[key] ? target[key] + ' ' + text : text;
            this.showCalculators = false;
        },

        // Gera texto formatado para cada calculadora
        getCalcTextForExam(calcId) {
            switch(calcId) {
                case 'glasgow':
                    this.calculateGlasgow();
                    return this.glasgowComplete() ? this.calcResultText : '';
                case 'curb65':
                    return `CURB-65: ${this.calcResult} pontos.`;
                case 'chads':
                    return `CHA2DS2-VASc: ${this.calcResult} pontos.`;
                case 'has_bled':
                    return `HAS-BLED: ${this.calcResult} pontos.`;
                case 'wells_tvp':
                    return `Wells TVP: ${this.calcResult} pontos.`;
                case 'wells_tep':
                    return `Wells TEP: ${this.calcResult} pontos.`;
                case 'perc':
                    return this.calcResult === 0 ? 'PERC negativo.' : `PERC positivo (${this.calcResult} critérios).`;
                case 'ckd':
                    return `TFG (CKD-EPI): ${this.calcResult} mL/min/1.73m².`;
                case 'imc':
                    return `IMC: ${this.calcResult} kg/m².`;
                default:
                    return '';
            }
        },

        openCalculator(id) {
            this.selectedCalc = typeof id === 'string' ? id : id.id;
            this.calcResult = null;
            this.calcResultText = '';
            this.showCalculators = true;
        },

        get activeCalculator() { return this.calculators.find(c => c.id === this.selectedCalc); },

        calculateScore(id) {
            this.calcResult = null;
            this.calcResultText = '';
            const rows = this.scoreDefinitions[id];
            const values = this.calcInputs[id];
            if (!rows || rows.some(row => !((id === 'chads' && row.key === 'age' ? [0, 1, 2] : [0, 1]).includes(values[row.key])))) {
                this.calcResultText = 'Responda todos os critérios para calcular.';
                return;
            }
            if (id === 'perc' && values.lowRisk !== 1) {
                this.calcResultText = 'PERC não aplicável sem probabilidade pré-teste baixa.';
                return;
            }
            const score = rows.reduce((total, row) => total + values[row.key] * row.weight, 0);
            this.calcResult = score;
            const notes = {
                curb65: score <= 1 ? 'Faixa de menor risco (0–1).' : score === 2 ? 'Faixa intermediária (2).' : 'Faixa de maior risco (3–5).',
                chads: 'Escore de risco tromboembólico na fibrilação atrial. A decisão terapêutica exige avaliação individual e diretriz vigente.',
                wells_tvp: score <= 0 ? 'Probabilidade baixa no modelo de três níveis.' : score <= 2 ? 'Probabilidade intermediária no modelo de três níveis.' : 'Probabilidade alta no modelo de três níveis.',
                wells_tep: score <= 4 ? 'TEP improvável pelo modelo de dois níveis (≤ 4); não exclui o diagnóstico.' : 'TEP provável pelo modelo de dois níveis (> 4); exige investigação.',
                has_bled: score >= 3 ? 'Maior risco de sangramento (≥ 3). Revisar fatores modificáveis; não contraindica anticoagulação isoladamente.' : 'Revisar fatores de sangramento. Pontuação baixa não garante segurança da anticoagulação.',
                perc: score === 0 ? 'Nenhum critério positivo em paciente de baixo risco. Aplicar apenas no contexto de elegibilidade da regra.' : 'Há critérios positivos; PERC não permite encerrar a investigação.',
                qsofa: score >= 2 ? 'Maior risco de desfecho adverso (≥ 2). Não é diagnóstico de sepse.' : 'qSOFA < 2 não exclui sepse ou deterioração clínica.'
            };
            this.calcResultText = notes[id];
        },

        calculateSimple(id) {
            this.calcResult = null;
            this.calcResultText = '';
            const raw = this.calcInputs[id];
            const fields = id === 'pam' ? ['pas', 'pad'] : ['na', 'cl', 'hco3'];
            const values = fields.map(key => String(raw[key]).trim() === '' ? NaN : Number(raw[key]));
            if (values.some(value => !Number.isFinite(value) || value <= 0) || (id === 'pam' && values[0] < values[1])) {
                this.calcResultText = 'Informe valores positivos válidos nas unidades indicadas; PAS deve ser maior ou igual à PAD.';
                return;
            }
            const value = id === 'pam' ? (values[0] + 2 * values[1]) / 3 : values[0] - values[1] - values[2];
            this.calcResult = value.toFixed(1);
            this.calcResultText = id === 'pam' ? 'PAM estimada em mmHg. A meta depende do contexto clínico.' : 'Ânion gap em mEq/L, sem K e sem correção por albumina. Compare com a referência do laboratório.';
        },

        renderCalculator(id) {
            const calculator = this.calculators.find(c => c.id === id);
            if (calculator?.external) return `<div class="pg-external-calculator"><span class="pg-calc-badge">MDCalc · abre em nova aba</span><h4>${calculator.name}</h4><p>${calculator.description}</p><a class="pg-external-link" href="${calculator.source}" target="_blank" rel="noopener noreferrer">Abrir calculadora no MDCalc <i class="fas fa-external-link-alt"></i></a></div>`;
            if (this.scoreDefinitions[id]) {
                const fields = this.scoreDefinitions[id].map(row => `<label class="pg-score-row"><span>${row.label}</span><select aria-label="${row.label}" class="form-input" x-model.number="calcInputs.${id}.${row.key}" @change="calculateScore('${id}')"><option value="-1">Não informado</option>${id === 'chads' && row.key === 'age' ? '<option value="0">Menos de 65 anos</option><option value="1">65–74 anos (+1)</option><option value="2">75 anos ou mais (+2)</option>' : '<option value="0">Não</option><option value="1">Sim</option>'}</select></label>`).join('');
                return `<div class="space-y-4 p-4"><h4 class="font-bold text-lg">${calculator.name}</h4><p class="text-sm text-slate-500">${calculator.description || 'Responda todos os critérios. O escore complementa a avaliação clínica.'}</p>${fields}<div class="pg-calc-result" aria-live="polite"><strong x-text="calcResult === null ? '—' : calcResult + ' pontos'"></strong><p x-text="calcResultText"></p></div><button type="button" class="pg-model-button" @click="calculateScore('${id}')">Calcular</button><button type="button" class="pg-model-button" x-show="calcResult !== null" @click="addToExam('${id === 'curb65' || id === 'wells_tep' || id === 'perc' ? 'pulmonary' : 'cardiac'}', '${calculator.name}: ' + calcResult + ' pontos.');">Adicionar ao registro atual</button></div>`;
            }
            if (id === 'pam' || id === 'anion_gap') {
                const fields = id === 'pam' ? [['pas', 'PAS (mmHg)'], ['pad', 'PAD (mmHg)']] : [['na', 'Sódio (mEq/L)'], ['cl', 'Cloreto (mEq/L)'], ['hco3', 'Bicarbonato (mEq/L)']];
                return `<div class="space-y-4 p-4"><h4 class="font-bold text-lg">${calculator.name}</h4><p class="text-sm text-slate-500">${calculator.description}</p>${fields.map(([key, label]) => `<label class="block">${label}<input type="number" step="any" min="0" class="form-input mt-2" x-model="calcInputs.${id}.${key}"></label>`).join('')}<button type="button" class="pg-model-button" @click="calculateSimple('${id}')">Calcular</button><div class="pg-calc-result" aria-live="polite"><strong x-text="calcResult === null ? '—' : calcResult"></strong><p x-text="calcResultText"></p></div><button type="button" class="pg-model-button" x-show="calcResult !== null" @click="addToExam('general', '${id === 'pam' ? 'PAM estimada' : 'Ânion gap sem K e sem correção por albumina'}: ' + calcResult + ' ${id === 'pam' ? 'mmHg' : 'mEq/L'}.')">Adicionar ao registro atual</button></div>`;
            }

            // Botão comum para adicionar ao exame
            const addButtonHTML = (field, label) => `
                <button x-show="calcResult !== null" 
                        @click="addToExam('${field}', getCalcTextForExam('${id}')); showCalculators = false;" 
                        class="mt-3 w-full bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center gap-2 font-medium">
                    <i class="fas fa-plus-circle"></i> Adicionar ao ${label}
                </button>
            `;

            if (id === 'ckd') {
                return `
                    <div class="space-y-4 p-4"><p class="text-xs text-slate-500">Adultos ≥ 18 anos, creatinina em mg/dL e função renal estável. A categoria de TFG isolada não diagnostica doença renal crônica.</p>
                        <h4 class="font-bold text-lg text-gray-800 border-b pb-2">CKD-EPI 2021 (sem raça)</h4>
                        <p class="text-xs text-gray-500">Equação 2021 sem ajuste racial</p>
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="block text-sm font-bold mb-1">Creatinina (mg/dL)</label>
                                <input type="number" step="0.01" x-model="calcInputs.ckd.creat" class="form-input">
                            </div>
                            <div>
                                <label class="block text-sm font-bold mb-1">Idade (anos)</label>
                                <input type="number" x-model="calcInputs.ckd.age" class="form-input">
                            </div>
                            <div class="col-span-2">
                                <label class="block text-sm font-bold mb-1">Sexo</label>
                                <select x-model="calcInputs.ckd.sex" class="form-input">
                                    <option value="male">Masculino</option>
                                    <option value="female">Feminino</option>
                                </select>
                            </div>
                        </div>
                        <div class="bg-blue-50 p-4 rounded-lg text-center mt-4 border border-blue-100">
                            <button @click="calculateCKD()" class="bg-[#005f8f] text-white px-6 py-2 rounded-lg mb-3 hover:bg-[#004a70] transition-colors">
                                <i class="fas fa-calculator mr-2"></i>Calcular
                            </button>
                            <p class="text-sm" x-show="calcResult === null" x-text="calcResultText"></p><div x-show="calcResult !== null">
                                <p class="font-bold text-2xl text-[#005f8f]" x-text="calcResult + ' mL/min/1.73m²'"></p>
                                <p class="text-sm mt-2" x-text="calcResultText"></p>
                                ${addButtonHTML('general', 'Estado Geral')}
                            </div>
                        </div>
                    </div>
                `;
            }
            
            if (id === 'glasgow') {
                const fields = [
                    ['eye', 'Abertura ocular', [[4, 'Espontânea'], [3, 'Ao comando verbal'], [2, 'Ao estímulo doloroso'], [1, 'Ausente']]],
                    ['verbal', 'Resposta verbal', [[5, 'Orientado'], [4, 'Confuso'], [3, 'Palavras'], [2, 'Sons'], [1, 'Ausente']]],
                    ['motor', 'Resposta motora', [[6, 'Obedece comandos'], [5, 'Localiza'], [4, 'Flexão normal / retirada'], [3, 'Flexão anormal'], [2, 'Extensão'], [1, 'Ausente']]]
                ];
                return `<div class="space-y-4 p-4"><h4 class="font-bold text-lg">Escala de Coma de Glasgow</h4><p class="text-sm text-slate-500">Registre os três componentes examinados. Use NT quando um componente não puder ser testado (por exemplo, resposta verbal na intubação).</p>${fields.map(([key, label, options]) => `<label class="block">${label}<select class="form-input mt-2" x-model="calcInputs.glasgow.${key}" @change="calculateGlasgow()"><option value="">Não informado</option>${options.map(([value, label]) => `<option value="${value}">${value} — ${label}</option>`).join('')}<option value="NT">Não testável (NT)</option></select></label>`).join('')}<div class="pg-calc-result" aria-live="polite"><strong x-text="calcResult === null ? 'Sem total' : calcResult + '/15'"></strong><p x-text="calcResultText"></p><p class="text-xs mt-2">A pontuação isolada não determina diagnóstico de TCE ou necessidade de intubação.</p></div><button type="button" class="pg-model-button" @click="calculateGlasgow()">Calcular</button><button type="button" class="pg-model-button" x-show="glasgowComplete()" @click="calculateGlasgow(); addToExam('neuro', calcResultText)">Adicionar ao registro atual</button></div>`;
            }

            if (id === 'imc') {
                return `
                    <div class="space-y-4 p-4">
                        <h4 class="font-bold text-lg text-gray-800 border-b pb-2">Índice de Massa Corporal (IMC)</h4><label class="block">Idade (anos) — classificação a partir de 20 anos<input type="number" x-model="calcInputs.imc.age" class="form-input"></label>
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="block text-sm font-bold mb-1">Peso (kg)</label>
                                <input type="number" step="0.1" x-model="calcInputs.imc.weight" class="form-input">
                            </div>
                            <div>
                                <label class="block text-sm font-bold mb-1">Altura (cm)</label>
                                <input type="number" x-model="calcInputs.imc.height" class="form-input">
                            </div>
                        </div>
                        <div class="bg-green-50 p-4 rounded-lg text-center mt-4 border border-green-100">
                            <button type="button" class="pg-model-button" @click="calculateIMC()">Calcular</button><p class="font-bold text-3xl text-green-700" x-text="calcResult ? calcResult + ' kg/m²' : '-'"></p>
                            <p class="text-sm mt-2 text-green-600" x-text="calcResultText"></p>
                            <button x-show="calcResult" 
                                    @click="addToExam('general', 'IMC: ' + calcResult + ' kg/m² (' + calcResultText + ').'); showCalculators = false;" 
                                    class="mt-3 w-full bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center gap-2 font-medium">
                                <i class="fas fa-plus-circle"></i> Adicionar ao Estado Geral
                            </button>
                        </div>
                        <div class="text-xs text-gray-500 mt-2">
                            <p>< 18.5: Baixo peso | 18.5-24.9: Normal</p>
                            <p>25-29.9: Sobrepeso | 30-34.9: Obesidade I</p>
                            <p>35-39.9: Obesidade II | ≥40: Obesidade III</p>
                        </div>
                    </div>
                `;
            }

            if (id === 'carga_tabagica') {
                return `
                    <div class="space-y-4 p-4">
                        <h4 class="font-bold text-lg text-gray-800 border-b pb-2">🚬 Carga Tabágica (Anos-Maço)</h4>
                        <p class="text-xs text-gray-500 mb-4">Calcule a carga tabágica em anos-maço</p>
                        
                        <div class="bg-amber-50 border-l-4 border-amber-500 p-3 rounded mb-4">
                            <p class="text-sm font-medium text-amber-800 mb-1">📌 Fórmula:</p>
                            <p class="text-xs text-amber-700">Anos-Maço = (Nº cigarros/dia ÷ 20) × Anos fumando</p>
                        </div>
                        
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="block text-sm font-bold mb-1">Cigarros/dia</label>
                                <input type="number" x-model="calcInputs.carga_tabagica.cigarros_dia" class="form-input" placeholder="Ex: 20">
                            </div>
                            <div>
                                <label class="block text-sm font-bold mb-1">Anos fumando</label>
                                <input type="number" x-model="calcInputs.carga_tabagica.anos" class="form-input" placeholder="Ex: 10">
                            </div>
                        </div>
                        
                        <div class="bg-amber-50 p-4 rounded-lg text-center mt-4 border border-amber-100">
                            <button @click="calculateCargaTabagica()" class="bg-amber-600 text-white px-6 py-2 rounded-lg mb-3 hover:bg-amber-700 transition-colors shadow-md">
                                <i class="fas fa-calculator mr-2"></i>Calcular
                            </button>
                            <div x-show="calcResult !== null">
                                <p class="font-bold text-3xl text-amber-700">
                                    <span x-text="calcResult"></span> anos-maço
                                </p>
                                <p class="text-sm mt-2 text-amber-600 font-medium" x-text="calcResultText"></p>
                                <button @click="form.habits.smokingLoad = calcResult + ' anos-maço'; showCalculators = false;" 
                                        class="mt-3 w-full bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center gap-2 font-medium shadow-sm">
                                    <i class="fas fa-check-circle"></i> Usar este valor
                                </button>
                            </div>
                        </div>
                        
                        <p class="text-xs text-slate-500">Anos-maço = (cigarros por dia ÷ 20) × anos de consumo. Some os períodos separadamente quando a intensidade variou.</p>
                    </div>
                `;
            }
            
            if (id === 'carga_etilica') {
                return `
                    <div class="space-y-4 p-4">
                        <h4 class="font-bold text-lg text-gray-800 border-b pb-2">🍺 Carga Etílica (gramas/dia)</h4>
                        <p class="text-xs text-gray-500 mb-4">Calcule o consumo de álcool em gramas por dia</p>
                        
                        <div class="bg-red-50 border-l-4 border-red-500 p-3 rounded mb-4">
                            <p class="text-sm font-medium text-red-800 mb-1">📌 Referência:</p>
                            <ul class="text-xs text-red-700 space-y-1">
                                <li>• Cerveja: aproximadamente 355 mL a 5% = 14 g</li>
                                <li>• Vinho: aproximadamente 148 mL a 12% = 14 g</li>
                                <li>• Destilado: aproximadamente 44 mL a 40% = 14 g</li>
                            </ul>
                        </div>
                        
                        <div>
                            <label class="block text-sm font-bold mb-1">Tipo de bebida</label>
                            <select x-model="calcInputs.carga_etilica.tipo_bebida" class="form-input mb-3">
                                <option value="cerveja">Cerveja (355 mL a 5% ≈ 14 g)</option>
                                <option value="vinho">Vinho (148 mL a 12% ≈ 14 g)</option>
                                <option value="destilado">Destilado (44 mL a 40% ≈ 14 g)</option>
                                <option value="manual">Informar gramas diretamente</option>
                            </select>
                        </div>
                        
                        <div x-show="calcInputs.carga_etilica.tipo_bebida !== 'manual'">
                            <label class="block text-sm font-bold mb-1">Doses por dia</label>
                            <input type="number" step="0.5" x-model="calcInputs.carga_etilica.doses_dia" class="form-input" placeholder="Ex: 4">
                        </div>
                        
                        <div x-show="calcInputs.carga_etilica.tipo_bebida === 'manual'">
                            <label class="block text-sm font-bold mb-1">Gramas de álcool/dia</label>
                            <input type="number" x-model="calcInputs.carga_etilica.gramas_dia" class="form-input" placeholder="Ex: 60">
                        </div>
                        
                        <div class="bg-red-50 p-4 rounded-lg text-center mt-4 border border-red-100">
                            <button @click="calculateCargaEtilica()" class="bg-red-600 text-white px-6 py-2 rounded-lg mb-3 hover:bg-red-700 transition-colors shadow-md">
                                <i class="fas fa-calculator mr-2"></i>Calcular
                            </button>
                            <div x-show="calcResult !== null">
                                <p class="font-bold text-3xl text-red-700">
                                    <span x-text="calcResult"></span> g/dia
                                </p>
                                <p class="text-sm mt-2 text-red-600 font-medium" x-text="calcResultText"></p>
                                <button @click="form.habits.alcoholLoad = calcResult + 'g/dia'; showCalculators = false;" 
                                        class="mt-3 w-full bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center gap-2 font-medium shadow-sm">
                                    <i class="fas fa-check-circle"></i> Usar este valor
                                </button>
                            </div>
                        </div>
                        
                        <p class="text-xs text-slate-500">Convenção NIAAA: uma dose padrão contém 14 g de etanol. O teor alcoólico e o volume real da bebida podem variar. Esta estimativa não diagnostica dependência.</p>
                    </div>
                `;
            }
            
            return '<div class="p-4 text-center text-gray-500">Calculadora em desenvolvimento...</div>';
        },

        // Calculator functions
        calculateCKD() {
            const cr = Number(this.calcInputs.ckd.creat);
            const age = Number(this.calcInputs.ckd.age);
            const isFemale = this.calcInputs.ckd.sex === 'female';
            
            if (!Number.isFinite(cr) || !Number.isFinite(age) || cr <= 0 || age < 18 || !['male', 'female'].includes(this.calcInputs.ckd.sex)) {
                this.calcResult = null;
                this.calcResultText = 'Informe creatinina positiva em mg/dL e idade adulta (≥ 18 anos).';
                return;
            }

            // CKD-EPI 2021 (without race)
            const kappa = isFemale ? 0.7 : 0.9;
            const alpha = isFemale ? -0.241 : -0.302;
            const sexFactor = isFemale ? 1.012 : 1.0;
            
            const crKappa = cr / kappa;
            const minCrKappa = Math.min(crKappa, 1);
            const maxCrKappa = Math.max(crKappa, 1);
            
            let gfr = 142 * Math.pow(minCrKappa, alpha) * Math.pow(maxCrKappa, -1.200) * Math.pow(0.9938, age) * sexFactor;
            
            this.calcResult = gfr.toFixed(1);
            
            // Categorias de TFG não estabelecem diagnóstico de DRC isoladamente.
            // Classification
            if (gfr >= 90) {
                this.calcResultText = 'G1: Normal ou alto (≥90)';
            } else if (gfr >= 60) {
                this.calcResultText = 'G2: Levemente diminuído (60-89)';
            } else if (gfr >= 45) {
                this.calcResultText = 'G3a: Leve a moderadamente diminuído (45-59)';
            } else if (gfr >= 30) {
                this.calcResultText = 'G3b: Moderado a severamente diminuído (30-44)';
            } else if (gfr >= 15) {
                this.calcResultText = 'G4: Severamente diminuído (15-29)';
            } else {
                this.calcResultText = 'G5: TFG < 15 mL/min/1,73 m²';
            }
        },

        glasgowComplete() {
            const g = this.calcInputs.glasgow;
            return [['eye', 4], ['verbal', 5], ['motor', 6]].every(([key, max]) =>
                g[key] === 'NT' || (String(g[key]).trim() !== '' && Number.isInteger(Number(g[key])) && Number(g[key]) >= 1 && Number(g[key]) <= max));
        },

        calculateGlasgow() {
            this.calcResult = null;
            this.calcResultText = '';
            if (!this.glasgowComplete()) { this.calcResultText = 'Informe os três componentes examinados.'; return; }
            const g = this.calcInputs.glasgow;
            const parts = `O${g.eye}V${g.verbal}M${g.motor}`;
            if ([g.eye, g.verbal, g.motor].includes('NT')) {
                this.calcResultText = `Glasgow: ${parts}; sem escore total por componente não testável.`;
            } else {
                this.calcResult = Number(g.eye) + Number(g.verbal) + Number(g.motor);
                this.calcResultText = `Glasgow ${this.calcResult} (${parts}).`;
            }
        },

        getGlasgowInterpretation() {
            return 'Interpretar os componentes e o contexto clínico; não usar o total isoladamente.';
        },

        calculateCURB65() { this.calculateScore('curb65'); },

        getCURB65Color() {
            if (this.calcResult === null) return 'text-gray-500';
            if (this.calcResult <= 1) return 'text-green-600';
            if (this.calcResult === 2) return 'text-yellow-600';
            return 'text-red-600';
        },

        calculateCHADS() { this.calculateScore('chads'); },

        calculateWellsTVP() { this.calculateScore('wells_tvp'); },

        calculateWellsTEP() { this.calculateScore('wells_tep'); },

        calculateIMC() {
            const weight = Number(this.calcInputs.imc.weight);
            const height = Number(this.calcInputs.imc.height) / 100; // cm to m
            
            if (!Number.isFinite(weight) || !Number.isFinite(height) || weight <= 0 || height <= 0) {
                this.calcResult = null;
                this.calcResultText = '';
                return;
            }
            
            const imc = weight / (height * height);
            this.calcResult = imc.toFixed(1);
            
            if (!Number.isFinite(Number(this.calcInputs.imc.age)) || Number(this.calcInputs.imc.age) < 20) {
                this.calcResultText = 'Classificação adulta exige idade ≥ 20 anos; em menores, usar IMC por idade e sexo.';
                return;
            }
            if (imc < 18.5) {
                this.calcResultText = 'Baixo peso';
            } else if (imc < 25) {
                this.calcResultText = 'Peso normal';
            } else if (imc < 30) {
                this.calcResultText = 'Sobrepeso';
            } else if (imc < 35) {
                this.calcResultText = 'Obesidade Grau I';
            } else if (imc < 40) {
                this.calcResultText = 'Obesidade Grau II';
            } else {
                this.calcResultText = 'Obesidade Grau III';
            }
        },

        calculateHASBLED() { this.calculateScore('has_bled'); },

        calculatePERC() { this.calculateScore('perc'); },

        calculateCargaTabagica() {
            const cigarros = Number(this.calcInputs.carga_tabagica.cigarros_dia);
            const anos = Number(this.calcInputs.carga_tabagica.anos);
            
            if (!Number.isFinite(cigarros) || !Number.isFinite(anos) || String(this.calcInputs.carga_tabagica.cigarros_dia).trim() === '' || String(this.calcInputs.carga_tabagica.anos).trim() === '' || cigarros < 0 || anos < 0) {
                this.calcResult = null;
                this.calcResultText = 'Preencha os campos corretamente';
                return;
            }
            
            // Fórmula: Anos-Maço = (cigarros/dia ÷ 20) × anos
            const anosMaco = (cigarros / 20) * anos;
            this.calcResult = anosMaco.toFixed(1);
            
            this.calcResultText = 'Exposição acumulada estimada; não define diagnóstico ou risco individual isoladamente.';
        },

        calculateCargaEtilica() {
            let gramas = 0;
            
            if (this.calcInputs.carga_etilica.tipo_bebida === 'manual') {
                gramas = Number(this.calcInputs.carga_etilica.gramas_dia);
            } else {
                const doses = Number(this.calcInputs.carga_etilica.doses_dia);
                if (!Number.isFinite(doses) || doses < 0 || String(this.calcInputs.carga_etilica.doses_dia).trim() === '') {
                    this.calcResult = null;
                    this.calcResultText = 'Preencha o número de doses';
                    return;
                }
                // Cada dose padrão = ~14g de álcool
                gramas = doses * 14;
            }
            
            if (!Number.isFinite(gramas) || gramas < 0 || (this.calcInputs.carga_etilica.tipo_bebida === 'manual' && String(this.calcInputs.carga_etilica.gramas_dia).trim() === '')) {
                this.calcResult = null;
                this.calcResultText = 'Preencha os campos corretamente';
                return;
            }
            
            this.calcResult = gramas.toFixed(0);
            
            this.calcResultText = 'Estimativa em gramas por dia; quantidade isolada não diagnostica dependência.';
        },

        // Calculadora DVA — dose em mcg/kg/min
        // Fórmula: (conc_mg_mL * vazao_mL_h * 1000) / (peso_kg * 60)
        calcDVAManual() {
            const d = this.form.xabcde.dva_calc;
            const conc = parseFloat(d.conc);
            const vazao = parseFloat(d.vazao);
            const peso = parseFloat(d.peso);
            if (conc > 0 && vazao > 0 && peso > 0) {
                const dose = (conc * vazao * 1000) / (peso * 60);
                d.resultado = dose.toFixed(3) + ' mcg/kg/min';
            } else {
                d.resultado = '';
            }
        },

        generateText() {
            // ========================================
            // DETECTAR TIPO DE ATENDIMENTO
            // ========================================
            if (this.form.serviceType === 'salavermelha') {
                // Se for Sala Vermelha, decidir qual template
                if (this.form.utiTemplate === 'evolucao') {
                    return this.generateEvolucaoCritico();
                } else if (this.form.utiTemplate === 'xabcde') {
                    return this.generateXABCDE();
                }
            }
            if (this.form.serviceType === 'pa_pro') {
                return this.generatePAPro();
            }
            
            // ========================================
            // FORMATO SOAP (PS Clínica Médica)
            // ========================================
            let text = `PS CLÍNICA MÉDICA - ${this.form.shift}\n`;
            
            // Identification
            text += `PACIENTE: ${this.form.name || 'Não identificado'}, ${this.form.age ? this.form.age + ' anos' : '? anos'}, ${this.form.gender}.\n`;
            text += `ADMISSÃO: ${this.form.admission}\n\n`;

            // Antecedents
            text += `# ANTECEDENTES:\n`;
            text += `Comorbidades: ${this.form.comorbidities || 'Não informado'} | Cirurgias: ${this.form.surgeries || 'Não informado'}\n`;
            
            // Habits
            let habitsList = [];
            if (this.form.habits.smoker) {
                let smokingText = 'Tabagista';
                if (this.form.habits.smokingLoad) smokingText += ` (${this.form.habits.smokingLoad})`;
                habitsList.push(smokingText);
            }
            if (this.form.habits.exSmoker) {
                let exSmokingText = 'Ex-Tabagista';
                if (this.form.habits.smokingLoad) exSmokingText += ` (${this.form.habits.smokingLoad})`;
                habitsList.push(exSmokingText);
            }
            if (this.form.habits.alcoholic) {
                let alcoholText = 'Etilista';
                if (this.form.habits.alcoholLoad) alcoholText += ` (${this.form.habits.alcoholLoad})`;
                habitsList.push(alcoholText);
            }
            if (this.form.habits.exAlcoholic) {
                let exAlcoholText = 'Ex-Etilista';
                if (this.form.habits.alcoholLoad) exAlcoholText += ` (${this.form.habits.alcoholLoad})`;
                habitsList.push(exAlcoholText);
            }
            if (this.form.habits.drugs) {
                let drugsText = 'Usuário de drogas';
                if (this.form.habits.drugTypes) drugsText += ` (${this.form.habits.drugTypes})`;
                habitsList.push(drugsText);
            }
            if (this.form.habits.sedentary) habitsList.push('Sedentário');
            
            if (habitsList.length > 0) {
                text += `Hábitos: ${habitsList.join(', ')}\n`;
            } else {
                text += `Hábitos: Não informado\n`;
            }

            text += `ALERGIAS: ${this.form.allergies || 'Não informado'}\n`;
            
            // Medications
            if (this.form.medications.length > 0) {
                text += `MEDICAÇÕES EM USO:\n`;
                this.form.medications.forEach(med => {
                    text += `- ${med.name} (${med.posology})\n`;
                });
            } else {
                text += `MEDICAÇÕES: Não informado\n`;
            }

            // Subjective
            text += `\n# S (SUBJETIVO):\n`;
            text += `QP: ${this.form.subjective.qp || 'Não informada'}\n`;
            text += `HMA: ${this.form.subjective.hda}\n`;
            
            // Negatives
            let negs = [];
            if (this.form.negatives.fever) negs.push('Febre');
            if (this.form.negatives.headache) negs.push('Cefaleia');
            if (this.form.negatives.dizziness) negs.push('Tontura');
            if (this.form.negatives.dyspnea) negs.push('Falta de ar');
            if (this.form.negatives.chestPain) negs.push('Dor torácica');
            if (this.form.negatives.nausea) negs.push('Náuseas/Vômitos');
            
            if (negs.length > 0) {
                text += `NEGA: ${negs.join(', ')}\n`;
            }

            // Objective
            text += `\n# O (OBJETIVO):\n`;
            const paSOAP = this.form.vitals.pas && this.form.vitals.pad
                ? `${this.form.vitals.pas}x${this.form.vitals.pad}`
                : (this.form.vitals.pa || '-');
            let vitals = `SSVV: PA: ${paSOAP} mmHg`;
            vitals += ` - FC: ${this.form.vitals.fc || '-'} bpm`;
            vitals += ` - FR: ${this.form.vitals.fr || '-'} irpm`;
            vitals += ` - Sat: ${this.form.vitals.sat || '-'}%`;
            if (this.form.vitals.temp) vitals += ` - Tax: ${this.form.vitals.temp}ºC`;
            if (this.form.vitals.hgt !== '' && this.form.vitals.hgt != null) vitals += ` - HGT: ${this.form.vitals.hgt} mg/dL`;
            if (this.form.visibility.soapVitals) text += `${vitals}\n`;

            text += `GERAL: ${this.form.exam.general || '-'}\n`;
            text += `AR: ${this.form.exam.pulmonary || '-'}\n`;
            text += `ACV: ${this.form.exam.cardiac || '-'}\n`;
            text += `ABD: ${this.form.exam.abdominal || '-'}\n`;
            if (this.form.exam.neuro) text += `NEURO: ${this.form.exam.neuro}\n`;
            if (this.form.exam.extremities) text += `EXTREMIDADES: ${this.form.exam.extremities}\n`;
            
            // Exames físicos adicionais
            if (this.form.exam.additional && this.form.exam.additional.length > 0) {
                this.form.exam.additional.forEach(exam => {
                    if (exam.value) {
                        text += `${exam.label.toUpperCase()}: ${exam.value}\n`;
                    }
                });
            }

            // Complementary
            if (this.form.complementary.labs || this.form.complementary.imaging) {
                text += `\nEXAMES COMPLEMENTARES:\n`;
                if (this.form.complementary.labs) text += `LAB: ${this.form.complementary.labs}\n`;
                if (this.form.complementary.imaging) text += `IMG: ${this.form.complementary.imaging}\n`;
            }

            // Assessment
            text += `\n# A (AVALIAÇÃO):\n`;
            if (this.form.assessment.diagnoses.length > 0) {
                text += `HD: ${this.form.assessment.diagnoses.join('; ')}\n`;
            }
            if (this.form.assessment.hd) {
                 text += `${this.form.assessment.hd}\n`;
            }

            // Plan
            text += `\n# P (CONDUTA):\n`;
            
            if (this.form.plan.prescription) {
                text += `${this.form.plan.prescription}\n`;
            }
            
            if (this.form.plan.requestedExams) {
                text += `\nSOLICITO EXAMES:\n${this.form.plan.requestedExams}\n`;
            }

            if (this.form.plan.internationType) {
                 text += `\nDESTINO: ${this.form.plan.internationType}\n`;
            }
            
            if (this.form.plan.notes) {
                text += `${this.form.plan.notes}\n`;
            }
            
            if (this.form.plan.isDischarge) {
                let discharge = [];
                if (this.form.plan.discharge.meds_guide) discharge.push('Oriento uso correto das medicações prescritas de acordo com a posologia da receita. Paciente entende conduta.');
                if (this.form.plan.discharge.alarm_signs) discharge.push('Oriento sobre sinais de alarme e de gravidade, com retorno imediato ao PS se presentes.');
                if (this.form.plan.discharge.certificate) discharge.push('Atestado médico entregue.');
                if (this.form.plan.discharge.referral) discharge.push('Encaminho para acompanhamento ambulatorial.');

                if (discharge.length > 0) {
                    text += `\nALTA MÉDICA:\n- ${discharge.join('\n- ')}`;
                }
            }

            return text;
        },

        // ========================================
        // TEMPLATE 1: Evolução de Paciente Crítico
        // ========================================
        generateEvolucaoCritico() {
            let text = '';
            
            // Cabeçalho com tipo de local e turno
            const tipoLocal = (this.form.uti.local || 'SALA VERMELHA').toUpperCase();
            const turno = this.form.shift === 'PLANTÃO DIURNO' ? 'DIURNO' : 'NOTURNO';
            text += `ADMISSÃO MÉDICA - ${tipoLocal} - ${turno}\n\n`;
            
            text += `PACIENTE: ${this.form.name || '_________'}, ${this.form.age ? this.form.age + ' anos' : '___ anos'}\n`;
            const rawAdmissionDate = this.form.uti.dataAdmissao;
            const admissionDate = /^\d{4}-\d{2}-\d{2}$/.test(rawAdmissionDate)
                ? rawAdmissionDate.split('-').reverse().join('/')
                : (rawAdmissionDate || '__/__/____');
            text += `PACIENTE ADMITIDO EM ${admissionDate} NA ${(this.form.uti.local || 'Sala Vermelha').toUpperCase()}.\n\n`;
            const motivo = String(this.form.uti.motivo || '').trim().replace(/^(?:[-•]\s*)+/, '').trim();
            if (motivo) text += `MOTIVO DA INTERNAÇÃO:\n- ${motivo}\n\n`;

            // HMA mantém o identificador interno legado `hda` por compatibilidade.
            if (this.form.uti.hda) {
                text += `HMA:\n${this.form.uti.hda}\n\n`;
            }
            
            // # HISTÓRIA PATOLÓGICA PREGRESSA (HPP)
            text += `# HISTÓRIA PATOLÓGICA PREGRESSA:\n`;
            text += `Comorbidades: ${this.form.comorbidities || 'Não informado'}\n`;
            text += `Alergias: ${this.form.allergies || 'Não informado'}\n`;
            text += `Cirurgias Prévias: ${this.form.surgeries || 'Não informado'}\n`;
            
            // Medicações em uso
            if (this.form.medications.length > 0) {
                text += `Medicações em Uso:\n`;
                this.form.medications.forEach(med => {
                    text += `  • ${med.name} (${med.posology})\n`;
                });
            } else {
                text += `Medicações: Não informado\n`;
            }
            
            // Hábitos
            let habitsList = [];
            if (this.form.habits.smoker) {
                let smokingText = 'Tabagista';
                if (this.form.habits.smokingLoad) smokingText += ` (${this.form.habits.smokingLoad})`;
                habitsList.push(smokingText);
            }
            if (this.form.habits.exSmoker) {
                let exSmokingText = 'Ex-Tabagista';
                if (this.form.habits.smokingLoad) exSmokingText += ` (${this.form.habits.smokingLoad})`;
                habitsList.push(exSmokingText);
            }
            if (this.form.habits.alcoholic) {
                let alcoholText = 'Etilista';
                if (this.form.habits.alcoholLoad) alcoholText += ` (${this.form.habits.alcoholLoad})`;
                habitsList.push(alcoholText);
            }
            if (this.form.habits.exAlcoholic) {
                let exAlcoholText = 'Ex-Etilista';
                if (this.form.habits.alcoholLoad) exAlcoholText += ` (${this.form.habits.alcoholLoad})`;
                habitsList.push(exAlcoholText);
            }
            if (this.form.habits.drugs) {
                let drugsText = 'Usuário de drogas';
                if (this.form.habits.drugTypes) drugsText += ` (${this.form.habits.drugTypes})`;
                habitsList.push(drugsText);
            }
            if (this.form.habits.sedentary) habitsList.push('Sedentário');
            
            if (habitsList.length > 0) {
                text += `Hábitos: ${habitsList.join(', ')}\n`;
            } else {
                text += `Hábitos: Não informado\n`;
            }
            text += `\n`;
            
            // Rastreio COVID-19 / Influenza: somente documenta o fluxo escolhido.
            const screening = [];
            if (this.form.uti.covidColeta === 'nao') {
                screening.push('- COVID-19: não coletado');
            } else if (this.form.uti.covidColeta === 'sim') {
                let covid = '- COVID-19: coletado';
                if (this.form.uti.covidData) covid += ` em ${this.form.uti.covidData}`;
                if (this.form.uti.covidResultado) covid += ` — ${this.form.uti.covidResultado}`;
                if (this.form.uti.rtpcr) covid += `; RT-PCR: ${this.form.uti.rtpcr}`;
                screening.push(covid);
            }
            if (this.form.uti.influenzaColeta === 'nao') {
                screening.push('- Influenza: não coletado');
            } else if (this.form.uti.influenzaColeta === 'sim') {
                let influenza = '- Influenza: coletado';
                if (this.form.uti.influenzaData) influenza += ` em ${this.form.uti.influenzaData}`;
                if (this.form.uti.influenzaResultado) influenza += ` — ${this.form.uti.influenzaResultado}`;
                screening.push(influenza);
            }
            if (screening.length) text += `# RASTREIO COVID-19 / INFLUENZA:\n${screening.join('\n')}\n\n`;
            
            // # ATB
            if (this.form.uti.atb.length > 0) {
                text += `# ANTIBIOTICOTERAPIA:\n`;
                this.form.uti.atb.forEach(atb => {
                    if (atb.nome) {
                        text += `- ${atb.nome}`;
                        if (atb.horario) text += ` (${atb.horario})`;
                        if (atb.status) text += ` - ${atb.status}`;
                        if (atb.dataInicio) text += ` - Iniciado em ${atb.dataInicio}`;
                        text += `\n`;
                    }
                });
                text += `\n`;
            }
            
            // # Devices
            if (this.form.uti.devices.length > 0) {
                text += `# DISPOSITIVOS/ACESSOS:\n`;
                this.form.uti.devices.forEach(device => {
                    if (device.tipo) {
                        text += `- ${device.tipo}`;
                        if (device.detalhes) text += `: ${device.detalhes}`;
                        if (device.dataInsercao) text += ` (${device.dataInsercao})`;
                        if (device.status) text += ` - ${device.status}`;
                        text += `\n`;
                    }
                });
                text += `\n`;
            }
            
            const systemsText = this.admissionSystems.map(system => {
                const finding = this.admissionSystemText(system.id);
                return finding ? `${system.label.toUpperCase()}: ${finding}` : '';
            }).filter(Boolean);
            if (systemsText.length) text += `# AVALIAÇÃO POR SISTEMAS\n${systemsText.join('\n')}\n\n`;

            // # Exames
            if (this.form.uti.exames) {
                text += `# EXAMES COMPLEMENTARES:\n${this.form.uti.exames}\n\n`;
            }
            
            // # CONDUTAS
            text += `# CONDUTAS\n`;
            
            const condutas = this.admissionConductText();
            if (condutas) text += condutas + '\n';

            return text;
        },

        // ========================================
        // TEMPLATE 2: Admissão XABCDE
        // ========================================
        generateXABCDE() {
            let text = '';
            
            // Cabeçalho
            const tipoLocal = (this.form.xabcde.local || 'SALA VERMELHA').toUpperCase();
            const turno = this.form.shift === 'PLANTÃO DIURNO' ? 'DIURNO' : 'NOTURNO';
            text += `# ADMISSAO MEDICA - ${tipoLocal} - ${turno} #\n\n`;
            
            text += `PACIENTE: ${this.form.name || '_____'}, ${this.form.age || '___'} anos, ${this.form.gender}\n`;
            text += `DATA/HORA: ${this.form.xabcde.dataHora ? new Date(this.form.xabcde.dataHora).toLocaleString('pt-BR') : '  /  /     : '}\n`;
            text += `LOCAL: ${this.form.xabcde.local || 'Sala Vermelha'}\n\n`;
            
            // AVALIAÇÃO PRIMÁRIA
            text += `# AVALIAÇÃO PRIMÁRIA:\n`;
            
            // X - Hemorragia
            text += `[X] HEMORRAGIA EXSANGUINANTE\n`;
            text += `${this.form.xabcde.x_hemorragia || 'Não informado'}`;
            if (this.form.xabcde.x_hemorragia === 'Hemorragia presente' && this.form.xabcde.x_local) {
                text += ` / Hemorragia presente em ${this.form.xabcde.x_local}`;
            }
            text += `\n`;
            if (this.form.xabcde.x_hemorragia === 'Hemorragia presente') {
                const trat = this.form.xabcde.x_terapeutica || [];
                if (trat.length > 0) text += `Terapeutica: ${trat.join(', ')}${this.form.xabcde.x_terapeutica_obs ? ' - ' + this.form.xabcde.x_terapeutica_obs : ''}\n`;
                else if (this.form.xabcde.x_terapeutica_obs) text += `Terapêutica: ${this.form.xabcde.x_terapeutica_obs}\n`;
            }
            text += `\n`;
            
            // A - Via Aérea
            text += `[A] VIA AÉREA\n`;
            text += `${this.form.xabcde.a_pervia || 'Não informado'}`;
            if (this.form.xabcde.a_obstrucao) {
                text += ` / sinais de obstrução: ${this.form.xabcde.a_obstrucao}`;
            }
            text += `\n`;
            text += `Dispositivos em uso: ${this.form.xabcde.a_dispositivos || '______'}\n\n`;
            
            // B - Ventilação
            text += `[B] VENTILAÇÃO\n`;
            text += `FR: ${this.form.xabcde.b_fr || '___'} irpm | SpO₂: ${this.form.xabcde.b_spo2 || '___'}% | Suporte de O₂: ${this.form.xabcde.b_o2 || 'não informado'}\n`;
            text += `Padrão respiratório: ${this.form.xabcde.b_padrao || '______'}\n`;
            text += `Ausculta pulmonar: ${this.form.xabcde.b_ausculta || '______'}\n`;
            if (this.form.xabcde.b_vm_ativa) {
                text += `Ventilação Mecânica: ${this.form.xabcde.b_vm_modo || 'modo não definido'}`;
                if (this.form.xabcde.b_vm_fio2) text += ` | FiO₂ ${this.form.xabcde.b_vm_fio2}%`;
                if (this.form.xabcde.b_vm_peep) text += ` | PEEP ${this.form.xabcde.b_vm_peep} cmH₂O`;
                if (this.form.xabcde.b_vm_vc) text += ` | VC ${this.form.xabcde.b_vm_vc} mL`;
                if (this.form.xabcde.b_vm_fr_ajust) text += ` | FR ${this.form.xabcde.b_vm_fr_ajust} irpm`;
                if (this.form.xabcde.b_vm_pico) text += ` | Pico ${this.form.xabcde.b_vm_pico} cmH₂O`;
                text += `\n`;
                if (this.form.xabcde.b_vm_obs) text += `Parâmetros adicionais: ${this.form.xabcde.b_vm_obs}\n`;
            }
            text += `\n`;
            
            // C - Circulação
            text += `[C] CIRCULAÇÃO\n`;
            text += `PA: ${this.form.xabcde.c_pas || '___'} x ${this.form.xabcde.c_pad || '___'} mmHg | FC: ${this.form.xabcde.c_fc || '___'} bpm\n`;
            text += `Perfusão periférica: ${this.form.xabcde.c_perfusao || '______'}\n`;
            text += `Pulsos periféricos: ${this.form.xabcde.c_pulsos || '______'}\n`;
            text += `Ritmo cardíaco: ${this.form.xabcde.c_ritmo || '______'}\n`;
            if (this.form.xabcde.c_dva_ativa && this.form.xabcde.c_duas.length > 0) {
                text += `Drogas vasoativas em uso:\n`;
                this.form.xabcde.c_duas.forEach(dva => {
                    if (dva.nome) {
                        text += `  - ${dva.nome}`;
                        if (dva.vazao) text += ` a ${dva.vazao} mL/h`;
                        if (dva.obs) text += ` (${dva.obs})`;
                        text += `\n`;
                    }
                });
            } else if (this.form.xabcde.c_dva_ativa) {
                text += `Drogas vasoativas: em uso (sem detalhes registrados)\n`;
            }
            text += `\n`;
            
            // D - Déficit Neurológico
            text += `[D] DÉFICIT NEUROLÓGICO\n`;
            text += `Escala de Glasgow: ${this.form.xabcde.d_glasgow || '___'}\n`;
            text += `Pupilas: ${this.form.xabcde.d_pupilas || '______'}\n`;
            text += `Glicemia capilar: ${this.form.xabcde.d_glicemia || '______'}\n`;
            text += `Déficits focais: ${this.form.xabcde.d_deficits || '______'}\n`;
            if (this.form.xabcde.d_sedacao_ativa) {
                text += `Sedoanalgesia/BNM:\n`;
                if (this.form.xabcde.d_rass) text += `  RASS: ${this.form.xabcde.d_rass}\n`;
                if (this.form.xabcde.d_cam_icu) text += `  CAM-ICU: ${this.form.xabcde.d_cam_icu}\n`;
                if (this.form.xabcde.d_bps) text += `  BPS: ${this.form.xabcde.d_bps}\n`;
                if (this.form.xabcde.d_bnm) text += `  BNM: ${this.form.xabcde.d_bnm}\n`;
                if (this.form.xabcde.d_sedacao_drogas) text += `  Drogas: ${this.form.xabcde.d_sedacao_drogas}\n`;
            }
            text += `\n`;
            
            // E - Exposição
            text += `[E] EXPOSIÇÃO / EXAME RÁPIDO\n`;
            text += `Temperatura: ${this.form.xabcde.e_temperatura || '___'}°C\n`;
            text += `Lesões cutâneas / traumas: ${this.form.xabcde.e_lesoes || '______'}\n`;
            text += `Edemas / sinais infecciosos / outros achados: ${this.form.xabcde.e_edemas || '______'}\n\n`;
            
            // SINAIS VITAIS INICIAIS
            text += `# SINAIS VITAIS INICIAIS\n`;
            text += `PA: ${this.form.xabcde.sv_pa || '______'}\n`;
            text += `FC: ${this.form.xabcde.sv_fc || '______'}\n`;
            text += `FR: ${this.form.xabcde.sv_fr || '______'}\n`;
            text += `SpO₂: ${this.form.xabcde.sv_spo2 || '______'}\n`;
            text += `Temperatura: ${this.form.xabcde.sv_temp || '______'}\n`;
            text += `Glicemia capilar: ${this.form.xabcde.sv_hgt || '______'}\n\n`;
            
            // IMPRESSÃO CLÍNICA INICIAL
            text += `# IMPRESSÃO CLÍNICA INICIAL\n`;
            text += `Gravidade estimada: ${this.form.xabcde.impressao_gravidade || 'não informada'}.\n`;
            text += `Hipótese sindrômica inicial: ${this.form.xabcde.impressao_hipotese || '__________________'}\n\n`;
            
            // CONDUTAS IMEDIATAS
            text += `# CONDUTAS IMEDIATAS\n`;
            text += `Oxigenoterapia: ${this.form.xabcde.conduta_o2 || '______'}\n`;
            text += `Monitorização multiparamétrica: ${this.form.xabcde.conduta_monitor || 'Não informado'}\n`;
            text += `Acesso venoso: ${this.form.xabcde.conduta_acesso || '______'}\n`;
            text += `Exames solicitados: ${this.form.xabcde.conduta_exames || '______'}\n`;
            text += `Medicações iniciais: ${this.form.xabcde.conduta_meds || '______'}\n\n`;
            
            // HISTÓRIA PATOLÓGICA PREGRESSA
            text += `# HISTÓRIA PATOLÓGICA PREGRESSA:\n`;
            text += `Comorbidades: ${this.form.xabcde.hpp_comorbidades || this.form.comorbidities || '______'}\n`;
            text += `Alergias: ${this.form.xabcde.hpp_alergias || this.form.allergies || '______'}\n`;
            
            // Medicações
            if (this.form.medications.length > 0 && !this.form.xabcde.hpp_medicacoes) {
                let meds = this.form.medications.map(m => `${m.name} (${m.posology})`).join(', ');
                text += `Medicações em uso: ${meds}\n`;
            } else {
                text += `Medicações em uso: ${this.form.xabcde.hpp_medicacoes || '______'}\n`;
            }
            
            text += `Cirurgias prévias: ${this.form.xabcde.hpp_cirurgias || this.form.surgeries || '______'}\n`;
            text += `Última alimentação: ${this.form.xabcde.hpp_alimentacao || '______'}\n`;
            text += `Eventos recentes relacionados ao quadro: ${this.form.xabcde.hpp_eventos || '______'}\n\n`;
            
            // FONTE DAS INFORMAÇÕES
            text += `# FONTE DAS INFORMAÇÕES:\n`;
            if (this.form.xabcde.fonte_info) {
                text += `${this.form.xabcde.fonte_info}\n\n`;
            } else {
                text += `\n`;
            }
            
            // DESTINO DO PACIENTE
            text += `# DESTINO DO PACIENTE\n`;
            if (this.form.xabcde.destino) {
                text += `${this.form.xabcde.destino}\n\n`;
            } else {
                text += `\n`;
            }
            
            return text;
        },

        generatePAPro() {
            const pa = this.form.pa;
            const turno = this.form.shift === 'PLANTÃO DIURNO' ? 'DIURNO' : 'NOTURNO';
            let text = '';

            // IA do consultório
            if (this.form.visibility.paAI && pa.ia_status) {
                text += `* ${pa.ia_status} *\n\n`;
            }

            // Cabeçalho
            const localNome = pa.local ? pa.local.toUpperCase() : 'PRONTO ATENDIMENTO';
            text += `${localNome} - ${turno}\n\n`;

            // Identificação do paciente
            const nome = this.form.name || '_____';
            const idade = this.form.age ? `${this.form.age} anos` : '___ anos';
            const genero = this.form.gender || '';
            text += `PACIENTE: ${nome}, ${idade}, ${genero}\n`;
            if (this.form.admission) text += `ADMISSÃO: ${this.form.admission}\n`;
            text += `\n`;

            // QP
            text += `QP: ${pa.qp || '______'}\n\n`;

            // HMA
            const hma = [pa.hma_inicio ? `Início: ${pa.hma_inicio}` : '', pa.hma_descricao].filter(Boolean).join('. ');
            text += `HMA: ${hma || 'Não informado'}\n\n`;

            // AP — Antecedentes (comorbidades, MUC, alergias, hábitos)
            const comorbidades = pa.ap_comorbidades || this.form.comorbidities || 'Não informado';
            // MUC: usa campo do PA ou lista de medicações da identificação
            let muc = pa.ap_muc;
            if (!muc) {
                muc = this.form.medications.length > 0
                    ? this.form.medications.map(m => `${m.name}${m.posology ? ' ' + m.posology : ''}`).join(', ')
                    : 'Não informado';
            }
            const alergias = pa.ap_alergias || this.form.allergies || 'Não informado';
            text += `AP: Comorbidades - ${comorbidades} | MUC - ${muc} | Alergias - ${alergias}\n`;

            // Hábitos de vida (da seção de identificação)
            const habitos = this.form.habits;
            const listaHabitos = [];
            if (habitos.smoker) listaHabitos.push(`Tabagista${habitos.smokingLoad ? ' (' + habitos.smokingLoad + ')' : ''}`);
            if (habitos.exSmoker) listaHabitos.push(`Ex-tabagista${habitos.smokingLoad ? ' (' + habitos.smokingLoad + ')' : ''}`);
            if (habitos.alcoholic) listaHabitos.push(`Etilista${habitos.alcoholLoad ? ' (' + habitos.alcoholLoad + ')' : ''}`);
            if (habitos.exAlcoholic) listaHabitos.push(`Ex-etilista`);
            if (habitos.drugs) listaHabitos.push(`Usuário de drogas${habitos.drugTypes ? ' (' + habitos.drugTypes + ')' : ''}`);
            if (habitos.sedentary) listaHabitos.push('Sedentário');
            if (listaHabitos.length > 0) {
                text += `Hábitos: ${listaHabitos.join(', ')}\n`;
            } else {
                text += `Hábitos: Não informado\n`;
            }

            text += `\n`;

            // Exame Físico
            text += `EXAME FÍSICO:\n`;
            // Sinais vitais (se preenchidos na identificação)
            const v = this.form.vitals;
            const svArr = [];
            const paStr = v.pas && v.pad ? `${v.pas}x${v.pad}` : v.pa;
            if (paStr) svArr.push(`PA ${paStr} mmHg`);
            if (v.fc) svArr.push(`FC ${v.fc} bpm`);
            if (v.fr) svArr.push(`FR ${v.fr} irpm`);
            if (v.sat) svArr.push(`SpO₂ ${v.sat}%`);
            if (v.temp) svArr.push(`Tax ${v.temp}°C`);
            if (v.hgt !== '' && v.hgt != null) svArr.push(`HGT ${v.hgt} mg/dL`);
            if (this.form.visibility.paVitals && svArr.length > 0) text += `- SSVV: ${svArr.join(' | ')}\n`;
            const examLine = (label, value) => {
                const finding = (value || '').trim();
                if (!finding) return;
                text += `- ${label}: ${finding}${/[.!?]$/.test(finding) ? '' : '.'}\n`;
            };
            const examFields = [
                ['ESTADO GERAL', pa.ef_geral],
                ['AP', pa.ef_ap],
                ['AC', pa.ef_ac],
                ['ABD', pa.ef_abd],
                ['NEURO', pa.ef_neuro],
                ['EXTREMIDADES', pa.ef_extremidades],
                ['Outros', pa.ef_outros]
            ];
            examFields.forEach(([label, value]) => examLine(label, value));
            // Exames adicionais
            if (pa.ef_adicionais && pa.ef_adicionais.length > 0) {
                pa.ef_adicionais.forEach(ex => {
                    const nome = (ex.nome || '').trim();
                    const resultado = (ex.resultado || '').trim();
                    if (nome || resultado) examLine(nome || 'Outro exame', resultado || 'não informado');
                });
            }
            if (!examFields.some(([, value]) => (value || '').trim()) &&
                !(pa.ef_adicionais || []).some(ex => (ex.nome || '').trim() || (ex.resultado || '').trim())) {
                text += `- Achados não informados.\n`;
            }
            text += `\n`;

            // Avaliação
            // Usa lista de diagnósticos PA (pa_diagnoses) ou campo livre
            if (pa.pa_diagnoses && pa.pa_diagnoses.length > 0) {
                text += `A: ${pa.pa_diagnoses.join(' | ')}\n\n`;
            } else {
                text += `A: ${pa.avaliacao || '______'}\n\n`;
            }

            // Conduta
            text += `C:\n`;
            const condutas = pa.condutas_selecionadas || [];
            condutas.forEach(c => { text += `- ${c}\n`; });
            if (pa.atestado) {
                text += `- Forneço atestado médico de ${pa.atestado_dias || 1} dia(s).\n`;
            }
            if (pa.conduta_extra) {
                text += `- ${pa.conduta_extra}\n`;
            }

            return text;
        },

        copyText() {
            const text = this.generateText();
            navigator.clipboard.writeText(text).then(() => {
                this.copied = true;
                this._incrementMetric('copies');
                setTimeout(() => this.copied = false, 2000);
            });
        },

        resetForm() {
            this.admissionOther = {};
            for (const [id, values] of Object.entries(this.calcInputs)) {
                for (const key of Object.keys(values)) values[key] = this.scoreDefinitions[id] ? -1 : '';
            }
            this.calcInputs.ckd.sex = 'male';
            this.calcInputs.carga_etilica.tipo_bebida = 'cerveja';
            this.calcResult = null;
            this.calcResultText = '';
            this.selectedCalc = null;
            this.showCalculators = false;

            // Limpa todos os campos clínicos mantendo o tipo de atendimento e o turno
            const serviceType = this.form.serviceType;
            const shift = this.form.shift;

            this.form.name = '';
            this.form.age = '';
            this.form.gender = 'Masculino';
            this.form.admission = 'Demanda Espontânea';
            this.form.habits = { smoker: false, exSmoker: false, smokingLoad: '', alcoholic: false, exAlcoholic: false, alcoholLoad: '', drugs: false, drugTypes: '', sedentary: false };
            this.form.comorbidities = '';
            this.form.allergies = '';
            this.form.surgeries = '';
            this.form.medications = [];
            this.form.subjective = { qp: '', hda: '' };
            this.form.negatives = { fever: false, headache: false, dizziness: false, dyspnea: false, chestPain: false, nausea: false, intestine: false, urinary: false };
            this.form.visibility = { soapVitals: true, paVitals: true, paAI: true };
            this.form.vitals = { pa: '', pas: '', pad: '', fc: '', fr: '', sat: '', temp: '', hgt: '' };
            this.form.exam = { general: '', cardiac: '', pulmonary: '', abdominal: '', neuro: '', extremities: '', additional: [] };
            this.form.complementary = { labs: '', imaging: '' };
            this.form.assessment = { hd: '', diagnoses: [] };
            this.form.plan = { prescription: '', requestedExams: '', internationType: '', isDischarge: false, notes: '', discharge: { meds_guide: false, alarm_signs: false, certificate: false, referral: false } };

            // UTI / Sala Vermelha
            this.form.uti.dataAdmissao = '';
            this.form.uti.motivo = '';
            this.form.uti.dx = '';
            this.form.uti.hda = '';
            this.form.uti.atb = [];
            this.form.uti.devices = [];
            this.form.uti.systems = {};
            this.form.uti.evolucao = { general: '', neuro: '', scv: '', sr: '', tgi: '', rm: '', hi: '', extr: '' };
            this.form.uti.covidColeta = '';
            this.form.uti.covidData = '';
            this.form.uti.covidResultado = '';
            this.form.uti.rtpcr = '';
            this.form.uti.influenzaColeta = '';
            this.form.uti.influenzaData = '';
            this.form.uti.influenzaResultado = '';
            this.form.uti.exames = '';
            this.form.uti.condutas = { vigilanciaNeuro: false, vigilanciaHemo: false, vigilanciaInfec: false, vigilanciaVent: false, vigilanciaRenal: false, profilaxiaTEV: false, aguardarVaga: false, manterFamilia: false, outras: '' };

            // XABCDE
            this.form.xabcde.queixaPrincipal = '';
            this.form.xabcde.x_hemorragia = '';
            this.form.xabcde.x_local = '';
            this.form.xabcde.x_terapeutica = [];
            this.form.xabcde.x_terapeutica_obs = '';
            this.form.xabcde.a_pervia = '';
            this.form.xabcde.a_obstrucao = '';
            this.form.xabcde.a_dispositivos = '';
            this.form.xabcde.b_fr = '';
            this.form.xabcde.b_spo2 = '';
            this.form.xabcde.b_o2 = '';
            this.form.xabcde.b_padrao = '';
            this.form.xabcde.b_ausculta = '';
            this.form.xabcde.b_vm_ativa = false;
            this.form.xabcde.b_vm_modo = '';
            this.form.xabcde.b_vm_fio2 = '';
            this.form.xabcde.b_vm_peep = '';
            this.form.xabcde.b_vm_vc = '';
            this.form.xabcde.b_vm_fr_ajust = '';
            this.form.xabcde.b_vm_pico = '';
            this.form.xabcde.b_vm_obs = '';
            this.form.xabcde.c_pas = '';
            this.form.xabcde.c_pad = '';
            this.form.xabcde.c_fc = '';
            this.form.xabcde.c_perfusao = '';
            this.form.xabcde.c_pulsos = '';
            this.form.xabcde.c_ritmo = '';
            this.form.xabcde.c_dva_ativa = false;
            this.form.xabcde.c_duas = [];
            this.form.xabcde.dva_calc = { peso: '', conc: '', vazao: '', resultado: '' };
            this.form.xabcde.d_glasgow = '';
            this.form.xabcde.d_pupilas = '';
            this.form.xabcde.d_glicemia = '';
            this.form.xabcde.d_deficits = '';
            this.form.xabcde.d_sedacao_ativa = false;
            this.form.xabcde.d_rass = '';
            this.form.xabcde.d_cam_icu = '';
            this.form.xabcde.d_bps = '';
            this.form.xabcde.d_bnm = '';
            this.form.xabcde.d_sedacao_drogas = '';
            this.form.xabcde.e_temperatura = '';
            this.form.xabcde.e_lesoes = '';
            this.form.xabcde.e_edemas = '';
            this.form.xabcde.sv_pa = '';
            this.form.xabcde.sv_fc = '';
            this.form.xabcde.sv_fr = '';
            this.form.xabcde.sv_spo2 = '';
            this.form.xabcde.sv_temp = '';
            this.form.xabcde.sv_hgt = '';
            this.form.xabcde.impressao_gravidade = '';
            this.form.xabcde.impressao_hipotese = '';
            this.form.xabcde.conduta_o2 = '';
            this.form.xabcde.conduta_monitor = '';
            this.form.xabcde.conduta_acesso = '';
            this.form.xabcde.conduta_exames = '';
            this.form.xabcde.conduta_meds = '';
            this.form.xabcde.hpp_comorbidades = '';
            this.form.xabcde.hpp_alergias = '';
            this.form.xabcde.hpp_medicacoes = '';
            this.form.xabcde.hpp_cirurgias = '';
            this.form.xabcde.hpp_alimentacao = '';
            this.form.xabcde.hpp_eventos = '';
            this.form.xabcde.fonte_info = '';
            this.form.xabcde.destino = '';

            // PA Pro
            this.form.pa = {
                ia_status: '', local: '',
                qp: '', hma_inicio: '', hma_descricao: '',
                alarme_nega: [],
                ap_comorbidades: '', ap_muc: '', ap_alergias: '',
                ef_geral: '', ef_ap: '', ef_ac: '',
                ef_abd: '', ef_neuro: '', ef_extremidades: '', ef_outros: '',
                ef_adicionais: [], pa_diagnoses: [],
                avaliacao: '',
                condutas_selecionadas: [], conduta_extra: '',
                atestado: false, atestado_dias: 1
            };

            // Busca CID
            this.cidSearch = '';
            this.cidResults = [];
            this.cidError = '';
            this.paCidSearch = '';
            this.paCidResults = [];
            this.paCidError = '';

            // Restore type and shift
            this.form.serviceType = serviceType;
            this.form.shift = shift;

            this.resetDone = true;
            setTimeout(() => this.resetDone = false, 2000);
        }
    }))
})


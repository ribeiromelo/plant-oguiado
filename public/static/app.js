document.addEventListener('alpine:init', () => {
    Alpine.data('medicalForm', () => ({
        form: {
            serviceType: 'clinica', // 'clinica' ou 'salavermelha'
            utiTemplate: 'evolucao', // 'evolucao' ou 'xabcde'
            shift: 'PLANTÃO DIURNO',
            name: '',
            age: '',
            gender: 'Masculino',
            admission: 'Demanda Espontânea',
            habits: {
                smoker: false,
                alcoholic: false,
                drugs: false,
                sedentary: false
            },
            comorbidities: 'Nega',
            allergies: 'Nega',
            surgeries: 'Nega',
            medications: [],
            subjective: {
                qp: 'Não referida',
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
            vitals: {
                pa: '',
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
                dataAdmissao: '',
                local: 'Sala Vermelha',
                motivo: '',
                dx: '',
                covidData: '',
                covidResultado: 'NÃO REAGENTE',
                rtpcr: 'AGUARDA',
                atb: [],
                hda: '',
                devices: [],
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
            }
        },
        newMed: {
            name: '',
            posology: ''
        },
        conductType: 'prescricao',
        copied: false,
        
        // CID-10 Logic
        cidSearch: '',
        cidResults: [],
        cidLoading: false,
        cidError: '',
        
        // Calculators
        showCalculators: false,
        calcSearch: '',
        selectedCalc: null,
        calculators: [
            { id: 'ckd', name: 'Filtro Glomerular (CKD-EPI 2021)', category: 'Nefrologia' },
            { id: 'curb65', name: 'CURB-65 (Pneumonia)', category: 'Pneumologia' },
            { id: 'chads', name: 'CHA2DS2-VASc', category: 'Cardiologia' },
            { id: 'wells_tvp', name: 'Escore de Wells (TVP)', category: 'Vascular' },
            { id: 'wells_tep', name: 'Escore de Wells (TEP)', category: 'Vascular' },
            { id: 'glasgow', name: 'Escala de Glasgow', category: 'Neurologia' },
            { id: 'nihss', name: 'NIHSS (AVC)', category: 'Neurologia' },
            { id: 'imc', name: 'IMC', category: 'Geral' },
            { id: 'has_bled', name: 'HAS-BLED', category: 'Cardiologia' },
            { id: 'perc', name: 'PERC Rule (TEP)', category: 'Vascular' }
        ],
        // Calculator Inputs
        calcInputs: {
            ckd: { creat: '', age: '', sex: 'male' },
            curb65: { conf: false, uremia: false, resp: false, bp: false, age65: false },
            chads: { chf: false, htn: false, age75: false, dm: false, stroke: false, vasc: false, age65_74: false, female: false },
            wells_tvp: { cancer: false, paralysis: false, bedridden: false, tenderness: false, swelling: false, calf: false, edema: false, collat: false, history: false, alternative: false },
            wells_tep: { dvt: false, hr: false, immob: false, history: false, hemoptysis: false, cancer: false, alternative: false },
            glasgow: { eye: 4, verbal: 5, motor: 6 },
            imc: { weight: '', height: '' },
            has_bled: { htn: false, renal: false, liver: false, stroke: false, bleeding: false, inr: false, age65: false, drugs: false, alcohol: false },
            perc: { age50: false, hr100: false, sat95: false, hemoptysis: false, estrogen: false, dvt: false, surgery: false, leg: false }
        },
        calcResult: null,
        calcResultText: '',

        // Inline calculator in exam section
        showInlineCalc: false,
        inlineCalcType: null,

        // Opções de exames físicos adicionais
        additionalExamOptions: [
            { id: 'otoscopia', label: 'Otoscopia', icon: 'fas fa-deaf' },
            { id: 'oroscopia', label: 'Oroscopia', icon: 'fas fa-teeth-open' },
            { id: 'rinoscopia', label: 'Rinoscopia', icon: 'fas fa-head-side-mask' },
            { id: 'oftalmoscopia', label: 'Oftalmoscopia', icon: 'fas fa-eye' },
            { id: 'pele', label: 'Pele/Tegumentar', icon: 'fas fa-allergies' },
            { id: 'linfonodos', label: 'Linfonodos', icon: 'fas fa-circle' },
            { id: 'tireoide', label: 'Tireoide', icon: 'fas fa-neck' },
            { id: 'mamas', label: 'Mamas', icon: 'fas fa-ribbon' },
            { id: 'geniturinario', label: 'Geniturinário', icon: 'fas fa-venus-mars' },
            { id: 'osteoarticular', label: 'Osteoarticular', icon: 'fas fa-bone' },
            { id: 'vascular', label: 'Vascular Periférico', icon: 'fas fa-wave-square' },
            { id: 'psiquiatrico', label: 'Psiquiátrico', icon: 'fas fa-brain' }
        ],

        get filteredCalculators() {
            return this.calculators.filter(c => 
                c.name.toLowerCase().includes(this.calcSearch.toLowerCase()) ||
                c.category.toLowerCase().includes(this.calcSearch.toLowerCase())
            );
        },

        init() {
            // Auto-fill age in calculators from form
            this.$watch('form.age', (value) => {
                if (value) {
                    this.calcInputs.ckd.age = value;
                }
            });
            this.$watch('form.gender', (value) => {
                this.calcInputs.ckd.sex = value === 'Masculino' ? 'male' : 'female';
            });
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

        addMed() {
            if (this.newMed.name) {
                this.form.medications.push({
                    name: this.newMed.name,
                    posology: this.newMed.posology || 'Conforme uso'
                });
                this.newMed.name = '';
                this.newMed.posology = '';
            }
        },

        removeMed(index) {
            this.form.medications.splice(index, 1);
        },

        setNormal(section) {
            const isMale = this.form.gender === 'Masculino';
            const normals = {
                general: isMale 
                    ? 'BEG, LOTE, Corado, Hidratado, Anictérico, Acianótico. Eupneico em ar ambiente.'
                    : 'BEG, LOTE, Corada, Hidratada, Anictérica, Acianótica. Eupneica em ar ambiente.',
                cardiac: 'RCR em 2T, BNF, sem sopros. Pulsos cheios e simétricos.',
                pulmonary: 'MV+ bilateralmente, sem ruídos adventícios. Expansibilidade preservada.',
                abdominal: 'Plano, flácido, indolor à palpação, RHA+, sem visceromegalias ou massas palpáveis.',
                neuro: 'Pupilas isocóricas e fotorreagentes, sem déficits focais grosseiros, Glasgow 15.',
                extremities: 'Sem edema de membros inferiores, panturrilhas livres, pulsos periféricos presentes e simétricos, perfusão periférica preservada.'
            };
            this.form.exam[section] = normals[section];
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
                const id = 'custom_' + Date.now();
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
            
            const normalValues = {
                'otoscopia': 'Membranas timpânicas íntegras, brilhantes, sem sinais de inflamação ou efusão bilateralmente.',
                'oroscopia': 'Orofaringe sem hiperemia ou hipertrofia amigdaliana, sem placas ou exsudato. Úvula centralizada.',
                'rinoscopia': 'Mucosa nasal rosada, sem edema ou secreção purulenta, septo centralizado.',
                'oftalmoscopia': 'Fundo de olho com papila de bordas nítidas, sem hemorragias ou exsudatos. Relação A/V preservada.',
                'pele': 'Pele íntegra, sem lesões, erupções, petéquias ou equimoses. Turgor preservado.',
                'linfonodos': 'Sem linfonodomegalias palpáveis em cadeias cervicais, axilares ou inguinais.',
                'tireoide': 'Tireoide não palpável ou de tamanho normal, sem nódulos, indolor à palpação.',
                'mamas': 'Mamas simétricas, sem nódulos palpáveis, sem retrações ou abaulamentos. Sem descarga papilar.',
                'geniturinario': 'Genitália externa sem alterações, sem sinais de infecção ou lesões. Giordano negativo bilateralmente.',
                'osteoarticular': 'Articulações sem sinais flogísticos, amplitude de movimento preservada, força muscular preservada.',
                'vascular': 'Pulsos periféricos presentes e simétricos, TEC < 3s, sem sinais de insuficiência venosa ou arterial.',
                'psiquiatrico': 'Vigil, orientado em tempo e espaço, humor eutímico, pensamento organizado, sem ideação suicida ou delírios.'
            };
            
            this.form.exam.additional[index].value = normalValues[exam.id] || 'Sem alterações.';
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
            if (text) {
                if (this.form.exam[field]) {
                    this.form.exam[field] += ' ' + text;
                } else {
                    this.form.exam[field] = text;
                }
                this.showCalculators = false;
            }
        },

        // Gera texto formatado para cada calculadora
        getCalcTextForExam(calcId) {
            switch(calcId) {
                case 'glasgow':
                    const gTotal = this.calcInputs.glasgow.eye + this.calcInputs.glasgow.verbal + this.calcInputs.glasgow.motor;
                    return `Glasgow ${gTotal} (O${this.calcInputs.glasgow.eye}V${this.calcInputs.glasgow.verbal}M${this.calcInputs.glasgow.motor}).`;
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

        renderCalculator(id) {
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
                    <div class="space-y-4 p-4">
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
                            <div x-show="calcResult">
                                <p class="font-bold text-2xl text-[#005f8f]" x-text="calcResult + ' mL/min/1.73m²'"></p>
                                <p class="text-sm mt-2" x-text="calcResultText"></p>
                                ${addButtonHTML('general', 'Estado Geral')}
                            </div>
                        </div>
                    </div>
                `;
            }
            
            if (id === 'glasgow') {
                return `
                    <div class="space-y-4 p-4">
                        <h4 class="font-bold text-lg text-gray-800 border-b pb-2">Escala de Coma de Glasgow</h4>
                        <div>
                            <label class="block text-sm font-bold mb-1">Abertura Ocular (O)</label>
                            <select x-model.number="calcInputs.glasgow.eye" class="form-input" @change="calculateGlasgow()">
                                <option value="4">4 - Espontânea</option>
                                <option value="3">3 - Ao comando verbal</option>
                                <option value="2">2 - Ao estímulo doloroso</option>
                                <option value="1">1 - Ausente</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-bold mb-1">Resposta Verbal (V)</label>
                            <select x-model.number="calcInputs.glasgow.verbal" class="form-input" @change="calculateGlasgow()">
                                <option value="5">5 - Orientado</option>
                                <option value="4">4 - Confuso</option>
                                <option value="3">3 - Palavras inapropriadas</option>
                                <option value="2">2 - Sons incompreensíveis</option>
                                <option value="1">1 - Ausente</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-bold mb-1">Resposta Motora (M)</label>
                            <select x-model.number="calcInputs.glasgow.motor" class="form-input" @change="calculateGlasgow()">
                                <option value="6">6 - Obedece comandos</option>
                                <option value="5">5 - Localiza dor</option>
                                <option value="4">4 - Movimento de retirada</option>
                                <option value="3">3 - Flexão anormal (Decorticação)</option>
                                <option value="2">2 - Extensão anormal (Descerebração)</option>
                                <option value="1">1 - Ausente</option>
                            </select>
                        </div>
                        <div class="bg-purple-50 p-4 rounded-lg text-center mt-4 border border-purple-100">
                            <p class="font-bold text-3xl text-purple-700">
                                <span x-text="calcInputs.glasgow.eye + calcInputs.glasgow.verbal + calcInputs.glasgow.motor"></span>/15
                            </p>
                            <p class="text-sm text-purple-600 mt-1">
                                O<span x-text="calcInputs.glasgow.eye"></span>V<span x-text="calcInputs.glasgow.verbal"></span>M<span x-text="calcInputs.glasgow.motor"></span>
                            </p>
                            <p class="text-xs text-gray-600 mt-2" x-text="getGlasgowInterpretation()"></p>
                            <button @click="addToExam('neuro', 'Glasgow ' + (calcInputs.glasgow.eye + calcInputs.glasgow.verbal + calcInputs.glasgow.motor) + ' (O' + calcInputs.glasgow.eye + 'V' + calcInputs.glasgow.verbal + 'M' + calcInputs.glasgow.motor + ').')" 
                                    class="mt-3 w-full bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center gap-2 font-medium">
                                <i class="fas fa-plus-circle"></i> Adicionar ao Neurológico
                            </button>
                        </div>
                    </div>
                `;
            }
            
            if (id === 'curb65') {
                return `
                    <div class="space-y-4 p-4">
                        <h4 class="font-bold text-lg text-gray-800 border-b pb-2">CURB-65 (Pneumonia)</h4>
                        <p class="text-xs text-gray-500 mb-4">Avalia gravidade da pneumonia comunitária</p>
                        <div class="space-y-3">
                            <label class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer">
                                <input type="checkbox" x-model="calcInputs.curb65.conf" @change="calculateCURB65()" class="w-5 h-5 text-blue-600 rounded">
                                <div>
                                    <span class="font-bold">C</span>onfusão mental
                                    <span class="text-xs text-gray-500 block">Desorientação em tempo, espaço ou pessoa</span>
                                </div>
                            </label>
                            <label class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer">
                                <input type="checkbox" x-model="calcInputs.curb65.uremia" @change="calculateCURB65()" class="w-5 h-5 text-blue-600 rounded">
                                <div>
                                    <span class="font-bold">U</span>reia > 43 mg/dL (ou >7 mmol/L)
                                </div>
                            </label>
                            <label class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer">
                                <input type="checkbox" x-model="calcInputs.curb65.resp" @change="calculateCURB65()" class="w-5 h-5 text-blue-600 rounded">
                                <div>
                                    <span class="font-bold">R</span>espiração ≥ 30 irpm
                                </div>
                            </label>
                            <label class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer">
                                <input type="checkbox" x-model="calcInputs.curb65.bp" @change="calculateCURB65()" class="w-5 h-5 text-blue-600 rounded">
                                <div>
                                    <span class="font-bold">B</span>lood Pressure: PAS < 90 ou PAD ≤ 60 mmHg
                                </div>
                            </label>
                            <label class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer">
                                <input type="checkbox" x-model="calcInputs.curb65.age65" @change="calculateCURB65()" class="w-5 h-5 text-blue-600 rounded">
                                <div>
                                    Idade ≥ <span class="font-bold">65</span> anos
                                </div>
                            </label>
                        </div>
                        <div class="bg-orange-50 p-4 rounded-lg text-center mt-4 border border-orange-100">
                            <p class="font-bold text-3xl" :class="getCURB65Color()" x-text="calcResult !== null ? calcResult + ' pontos' : '-'"></p>
                            <p class="text-sm mt-2" x-text="calcResultText"></p>
                            ${addButtonHTML('pulmonary', 'Pulmonar')}
                        </div>
                    </div>
                `;
            }
            
            if (id === 'chads') {
                return `
                    <div class="space-y-4 p-4">
                        <h4 class="font-bold text-lg text-gray-800 border-b pb-2">CHA₂DS₂-VASc</h4>
                        <p class="text-xs text-gray-500 mb-4">Risco de AVC em FA não-valvar</p>
                        <div class="space-y-2">
                            <label class="flex items-center gap-3 p-2 bg-gray-50 rounded hover:bg-gray-100 cursor-pointer">
                                <input type="checkbox" x-model="calcInputs.chads.chf" @change="calculateCHADS()" class="w-4 h-4 text-blue-600 rounded">
                                <span><strong>C</strong> - ICC/Disfunção VE (1 pt)</span>
                            </label>
                            <label class="flex items-center gap-3 p-2 bg-gray-50 rounded hover:bg-gray-100 cursor-pointer">
                                <input type="checkbox" x-model="calcInputs.chads.htn" @change="calculateCHADS()" class="w-4 h-4 text-blue-600 rounded">
                                <span><strong>H</strong> - Hipertensão (1 pt)</span>
                            </label>
                            <label class="flex items-center gap-3 p-2 bg-red-50 rounded hover:bg-red-100 cursor-pointer">
                                <input type="checkbox" x-model="calcInputs.chads.age75" @change="calculateCHADS()" class="w-4 h-4 text-red-600 rounded">
                                <span><strong>A₂</strong> - Idade ≥ 75 anos (2 pts)</span>
                            </label>
                            <label class="flex items-center gap-3 p-2 bg-gray-50 rounded hover:bg-gray-100 cursor-pointer">
                                <input type="checkbox" x-model="calcInputs.chads.dm" @change="calculateCHADS()" class="w-4 h-4 text-blue-600 rounded">
                                <span><strong>D</strong> - Diabetes (1 pt)</span>
                            </label>
                            <label class="flex items-center gap-3 p-2 bg-red-50 rounded hover:bg-red-100 cursor-pointer">
                                <input type="checkbox" x-model="calcInputs.chads.stroke" @change="calculateCHADS()" class="w-4 h-4 text-red-600 rounded">
                                <span><strong>S₂</strong> - AVC/AIT/Tromboembolismo prévio (2 pts)</span>
                            </label>
                            <label class="flex items-center gap-3 p-2 bg-gray-50 rounded hover:bg-gray-100 cursor-pointer">
                                <input type="checkbox" x-model="calcInputs.chads.vasc" @change="calculateCHADS()" class="w-4 h-4 text-blue-600 rounded">
                                <span><strong>V</strong> - Doença vascular (IAM, DAP, placa aórtica) (1 pt)</span>
                            </label>
                            <label class="flex items-center gap-3 p-2 bg-gray-50 rounded hover:bg-gray-100 cursor-pointer">
                                <input type="checkbox" x-model="calcInputs.chads.age65_74" @change="calculateCHADS()" class="w-4 h-4 text-blue-600 rounded">
                                <span><strong>A</strong> - Idade 65-74 anos (1 pt)</span>
                            </label>
                            <label class="flex items-center gap-3 p-2 bg-gray-50 rounded hover:bg-gray-100 cursor-pointer">
                                <input type="checkbox" x-model="calcInputs.chads.female" @change="calculateCHADS()" class="w-4 h-4 text-blue-600 rounded">
                                <span><strong>Sc</strong> - Sexo feminino (1 pt)</span>
                            </label>
                        </div>
                        <div class="bg-red-50 p-4 rounded-lg text-center mt-4 border border-red-100">
                            <p class="font-bold text-3xl text-red-700" x-text="calcResult !== null ? calcResult + ' pontos' : '-'"></p>
                            <p class="text-sm mt-2 text-red-600" x-text="calcResultText"></p>
                            ${addButtonHTML('cardiac', 'Cardíaco')}
                        </div>
                    </div>
                `;
            }

            if (id === 'wells_tvp') {
                return `
                    <div class="space-y-4 p-4">
                        <h4 class="font-bold text-lg text-gray-800 border-b pb-2">Wells Score - TVP</h4>
                        <p class="text-xs text-gray-500 mb-4">Probabilidade clínica de Trombose Venosa Profunda</p>
                        <div class="space-y-2 text-sm">
                            <label class="flex items-center gap-3 p-2 bg-gray-50 rounded hover:bg-gray-100 cursor-pointer">
                                <input type="checkbox" x-model="calcInputs.wells_tvp.cancer" @change="calculateWellsTVP()" class="w-4 h-4 text-blue-600 rounded">
                                <span>Câncer ativo (1 pt)</span>
                            </label>
                            <label class="flex items-center gap-3 p-2 bg-gray-50 rounded hover:bg-gray-100 cursor-pointer">
                                <input type="checkbox" x-model="calcInputs.wells_tvp.paralysis" @change="calculateWellsTVP()" class="w-4 h-4 text-blue-600 rounded">
                                <span>Paralisia/paresia/imobilização recente de MMII (1 pt)</span>
                            </label>
                            <label class="flex items-center gap-3 p-2 bg-gray-50 rounded hover:bg-gray-100 cursor-pointer">
                                <input type="checkbox" x-model="calcInputs.wells_tvp.bedridden" @change="calculateWellsTVP()" class="w-4 h-4 text-blue-600 rounded">
                                <span>Acamado > 3 dias ou cirurgia maior < 12 sem (1 pt)</span>
                            </label>
                            <label class="flex items-center gap-3 p-2 bg-gray-50 rounded hover:bg-gray-100 cursor-pointer">
                                <input type="checkbox" x-model="calcInputs.wells_tvp.tenderness" @change="calculateWellsTVP()" class="w-4 h-4 text-blue-600 rounded">
                                <span>Dor à palpação do trajeto venoso profundo (1 pt)</span>
                            </label>
                            <label class="flex items-center gap-3 p-2 bg-gray-50 rounded hover:bg-gray-100 cursor-pointer">
                                <input type="checkbox" x-model="calcInputs.wells_tvp.swelling" @change="calculateWellsTVP()" class="w-4 h-4 text-blue-600 rounded">
                                <span>Edema de toda a perna (1 pt)</span>
                            </label>
                            <label class="flex items-center gap-3 p-2 bg-gray-50 rounded hover:bg-gray-100 cursor-pointer">
                                <input type="checkbox" x-model="calcInputs.wells_tvp.calf" @change="calculateWellsTVP()" class="w-4 h-4 text-blue-600 rounded">
                                <span>Panturrilha > 3cm maior que contralateral (1 pt)</span>
                            </label>
                            <label class="flex items-center gap-3 p-2 bg-gray-50 rounded hover:bg-gray-100 cursor-pointer">
                                <input type="checkbox" x-model="calcInputs.wells_tvp.edema" @change="calculateWellsTVP()" class="w-4 h-4 text-blue-600 rounded">
                                <span>Edema depressível (cacifo +) (1 pt)</span>
                            </label>
                            <label class="flex items-center gap-3 p-2 bg-gray-50 rounded hover:bg-gray-100 cursor-pointer">
                                <input type="checkbox" x-model="calcInputs.wells_tvp.collat" @change="calculateWellsTVP()" class="w-4 h-4 text-blue-600 rounded">
                                <span>Veias colaterais superficiais (1 pt)</span>
                            </label>
                            <label class="flex items-center gap-3 p-2 bg-gray-50 rounded hover:bg-gray-100 cursor-pointer">
                                <input type="checkbox" x-model="calcInputs.wells_tvp.history" @change="calculateWellsTVP()" class="w-4 h-4 text-blue-600 rounded">
                                <span>TVP prévia documentada (1 pt)</span>
                            </label>
                            <label class="flex items-center gap-3 p-2 bg-yellow-50 rounded hover:bg-yellow-100 cursor-pointer">
                                <input type="checkbox" x-model="calcInputs.wells_tvp.alternative" @change="calculateWellsTVP()" class="w-4 h-4 text-yellow-600 rounded">
                                <span>Diagnóstico alternativo tão provável quanto TVP (-2 pts)</span>
                            </label>
                        </div>
                        <div class="bg-indigo-50 p-4 rounded-lg text-center mt-4 border border-indigo-100">
                            <p class="font-bold text-3xl text-indigo-700" x-text="calcResult !== null ? calcResult + ' pontos' : '-'"></p>
                            <p class="text-sm mt-2 text-indigo-600" x-text="calcResultText"></p>
                            ${addButtonHTML('cardiac', 'Cardíaco')}
                        </div>
                    </div>
                `;
            }

            if (id === 'wells_tep') {
                return `
                    <div class="space-y-4 p-4">
                        <h4 class="font-bold text-lg text-gray-800 border-b pb-2">Wells Score - TEP</h4>
                        <p class="text-xs text-gray-500 mb-4">Probabilidade clínica de Tromboembolismo Pulmonar</p>
                        <div class="space-y-2 text-sm">
                            <label class="flex items-center gap-3 p-2 bg-gray-50 rounded hover:bg-gray-100 cursor-pointer">
                                <input type="checkbox" x-model="calcInputs.wells_tep.dvt" @change="calculateWellsTEP()" class="w-4 h-4 text-blue-600 rounded">
                                <span>Sinais clínicos de TVP (3 pts)</span>
                            </label>
                            <label class="flex items-center gap-3 p-2 bg-gray-50 rounded hover:bg-gray-100 cursor-pointer">
                                <input type="checkbox" x-model="calcInputs.wells_tep.hr" @change="calculateWellsTEP()" class="w-4 h-4 text-blue-600 rounded">
                                <span>FC > 100 bpm (1.5 pts)</span>
                            </label>
                            <label class="flex items-center gap-3 p-2 bg-gray-50 rounded hover:bg-gray-100 cursor-pointer">
                                <input type="checkbox" x-model="calcInputs.wells_tep.immob" @change="calculateWellsTEP()" class="w-4 h-4 text-blue-600 rounded">
                                <span>Imobilização ≥ 3 dias ou cirurgia < 4 sem (1.5 pts)</span>
                            </label>
                            <label class="flex items-center gap-3 p-2 bg-gray-50 rounded hover:bg-gray-100 cursor-pointer">
                                <input type="checkbox" x-model="calcInputs.wells_tep.history" @change="calculateWellsTEP()" class="w-4 h-4 text-blue-600 rounded">
                                <span>TVP/TEP prévio (1.5 pts)</span>
                            </label>
                            <label class="flex items-center gap-3 p-2 bg-gray-50 rounded hover:bg-gray-100 cursor-pointer">
                                <input type="checkbox" x-model="calcInputs.wells_tep.hemoptysis" @change="calculateWellsTEP()" class="w-4 h-4 text-blue-600 rounded">
                                <span>Hemoptise (1 pt)</span>
                            </label>
                            <label class="flex items-center gap-3 p-2 bg-gray-50 rounded hover:bg-gray-100 cursor-pointer">
                                <input type="checkbox" x-model="calcInputs.wells_tep.cancer" @change="calculateWellsTEP()" class="w-4 h-4 text-blue-600 rounded">
                                <span>Câncer ativo (tratamento < 6m ou paliativo) (1 pt)</span>
                            </label>
                            <label class="flex items-center gap-3 p-2 bg-red-50 rounded hover:bg-red-100 cursor-pointer">
                                <input type="checkbox" x-model="calcInputs.wells_tep.alternative" @change="calculateWellsTEP()" class="w-4 h-4 text-red-600 rounded">
                                <span>TEP é diagnóstico mais provável (3 pts)</span>
                            </label>
                        </div>
                        <div class="bg-pink-50 p-4 rounded-lg text-center mt-4 border border-pink-100">
                            <p class="font-bold text-3xl text-pink-700" x-text="calcResult !== null ? calcResult + ' pontos' : '-'"></p>
                            <p class="text-sm mt-2 text-pink-600" x-text="calcResultText"></p>
                            <button x-show="calcResult !== null" 
                                    @click="addToExam('pulmonary', 'Wells TEP: ' + calcResult + ' pontos.'); showCalculators = false;" 
                                    class="mt-3 w-full bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center gap-2 font-medium">
                                <i class="fas fa-plus-circle"></i> Adicionar ao Pulmonar
                            </button>
                        </div>
                    </div>
                `;
            }

            if (id === 'imc') {
                return `
                    <div class="space-y-4 p-4">
                        <h4 class="font-bold text-lg text-gray-800 border-b pb-2">Índice de Massa Corporal (IMC)</h4>
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="block text-sm font-bold mb-1">Peso (kg)</label>
                                <input type="number" step="0.1" x-model="calcInputs.imc.weight" class="form-input" @input="calculateIMC()">
                            </div>
                            <div>
                                <label class="block text-sm font-bold mb-1">Altura (cm)</label>
                                <input type="number" x-model="calcInputs.imc.height" class="form-input" @input="calculateIMC()">
                            </div>
                        </div>
                        <div class="bg-green-50 p-4 rounded-lg text-center mt-4 border border-green-100">
                            <p class="font-bold text-3xl text-green-700" x-text="calcResult ? calcResult + ' kg/m²' : '-'"></p>
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

            if (id === 'has_bled') {
                return `
                    <div class="space-y-4 p-4">
                        <h4 class="font-bold text-lg text-gray-800 border-b pb-2">HAS-BLED</h4>
                        <p class="text-xs text-gray-500 mb-4">Risco de sangramento em anticoagulação</p>
                        <div class="space-y-2 text-sm">
                            <label class="flex items-center gap-3 p-2 bg-gray-50 rounded hover:bg-gray-100 cursor-pointer">
                                <input type="checkbox" x-model="calcInputs.has_bled.htn" @change="calculateHASBLED()" class="w-4 h-4 text-blue-600 rounded">
                                <span><strong>H</strong> - Hipertensão não controlada (PAS > 160) (1 pt)</span>
                            </label>
                            <label class="flex items-center gap-3 p-2 bg-gray-50 rounded hover:bg-gray-100 cursor-pointer">
                                <input type="checkbox" x-model="calcInputs.has_bled.renal" @change="calculateHASBLED()" class="w-4 h-4 text-blue-600 rounded">
                                <span><strong>A</strong> - Função renal anormal (diálise, Cr > 2.6) (1 pt)</span>
                            </label>
                            <label class="flex items-center gap-3 p-2 bg-gray-50 rounded hover:bg-gray-100 cursor-pointer">
                                <input type="checkbox" x-model="calcInputs.has_bled.liver" @change="calculateHASBLED()" class="w-4 h-4 text-blue-600 rounded">
                                <span><strong>A</strong> - Função hepática anormal (cirrose, TGO/TGP > 3x) (1 pt)</span>
                            </label>
                            <label class="flex items-center gap-3 p-2 bg-gray-50 rounded hover:bg-gray-100 cursor-pointer">
                                <input type="checkbox" x-model="calcInputs.has_bled.stroke" @change="calculateHASBLED()" class="w-4 h-4 text-blue-600 rounded">
                                <span><strong>S</strong> - AVC prévio (1 pt)</span>
                            </label>
                            <label class="flex items-center gap-3 p-2 bg-gray-50 rounded hover:bg-gray-100 cursor-pointer">
                                <input type="checkbox" x-model="calcInputs.has_bled.bleeding" @change="calculateHASBLED()" class="w-4 h-4 text-blue-600 rounded">
                                <span><strong>B</strong> - História de sangramento ou predisposição (1 pt)</span>
                            </label>
                            <label class="flex items-center gap-3 p-2 bg-gray-50 rounded hover:bg-gray-100 cursor-pointer">
                                <input type="checkbox" x-model="calcInputs.has_bled.inr" @change="calculateHASBLED()" class="w-4 h-4 text-blue-600 rounded">
                                <span><strong>L</strong> - INR lábil (< 60% no range terapêutico) (1 pt)</span>
                            </label>
                            <label class="flex items-center gap-3 p-2 bg-gray-50 rounded hover:bg-gray-100 cursor-pointer">
                                <input type="checkbox" x-model="calcInputs.has_bled.age65" @change="calculateHASBLED()" class="w-4 h-4 text-blue-600 rounded">
                                <span><strong>E</strong> - Idade > 65 anos (1 pt)</span>
                            </label>
                            <label class="flex items-center gap-3 p-2 bg-gray-50 rounded hover:bg-gray-100 cursor-pointer">
                                <input type="checkbox" x-model="calcInputs.has_bled.drugs" @change="calculateHASBLED()" class="w-4 h-4 text-blue-600 rounded">
                                <span><strong>D</strong> - Drogas (antiplaquetários, AINE) (1 pt)</span>
                            </label>
                            <label class="flex items-center gap-3 p-2 bg-gray-50 rounded hover:bg-gray-100 cursor-pointer">
                                <input type="checkbox" x-model="calcInputs.has_bled.alcohol" @change="calculateHASBLED()" class="w-4 h-4 text-blue-600 rounded">
                                <span><strong>D</strong> - Álcool (≥ 8 doses/semana) (1 pt)</span>
                            </label>
                        </div>
                        <div class="bg-red-50 p-4 rounded-lg text-center mt-4 border border-red-100">
                            <p class="font-bold text-3xl text-red-700" x-text="calcResult !== null ? calcResult + ' pontos' : '-'"></p>
                            <p class="text-sm mt-2 text-red-600" x-text="calcResultText"></p>
                            <button x-show="calcResult !== null" 
                                    @click="addToExam('cardiac', 'HAS-BLED: ' + calcResult + ' pontos.'); showCalculators = false;" 
                                    class="mt-3 w-full bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center gap-2 font-medium">
                                <i class="fas fa-plus-circle"></i> Adicionar ao Cardíaco
                            </button>
                        </div>
                    </div>
                `;
            }

            if (id === 'perc') {
                return `
                    <div class="space-y-4 p-4">
                        <h4 class="font-bold text-lg text-gray-800 border-b pb-2">PERC Rule</h4>
                        <p class="text-xs text-gray-500 mb-4">Exclusão de TEP em baixo risco - Se TODOS negativos, exclui TEP</p>
                        <div class="space-y-2 text-sm">
                            <label class="flex items-center gap-3 p-2 bg-gray-50 rounded hover:bg-gray-100 cursor-pointer">
                                <input type="checkbox" x-model="calcInputs.perc.age50" @change="calculatePERC()" class="w-4 h-4 text-red-600 rounded">
                                <span>Idade ≥ 50 anos</span>
                            </label>
                            <label class="flex items-center gap-3 p-2 bg-gray-50 rounded hover:bg-gray-100 cursor-pointer">
                                <input type="checkbox" x-model="calcInputs.perc.hr100" @change="calculatePERC()" class="w-4 h-4 text-red-600 rounded">
                                <span>FC ≥ 100 bpm</span>
                            </label>
                            <label class="flex items-center gap-3 p-2 bg-gray-50 rounded hover:bg-gray-100 cursor-pointer">
                                <input type="checkbox" x-model="calcInputs.perc.sat95" @change="calculatePERC()" class="w-4 h-4 text-red-600 rounded">
                                <span>SatO2 < 95% em ar ambiente</span>
                            </label>
                            <label class="flex items-center gap-3 p-2 bg-gray-50 rounded hover:bg-gray-100 cursor-pointer">
                                <input type="checkbox" x-model="calcInputs.perc.hemoptysis" @change="calculatePERC()" class="w-4 h-4 text-red-600 rounded">
                                <span>Hemoptise</span>
                            </label>
                            <label class="flex items-center gap-3 p-2 bg-gray-50 rounded hover:bg-gray-100 cursor-pointer">
                                <input type="checkbox" x-model="calcInputs.perc.estrogen" @change="calculatePERC()" class="w-4 h-4 text-red-600 rounded">
                                <span>Uso de estrogênio</span>
                            </label>
                            <label class="flex items-center gap-3 p-2 bg-gray-50 rounded hover:bg-gray-100 cursor-pointer">
                                <input type="checkbox" x-model="calcInputs.perc.dvt" @change="calculatePERC()" class="w-4 h-4 text-red-600 rounded">
                                <span>TVP/TEP prévio</span>
                            </label>
                            <label class="flex items-center gap-3 p-2 bg-gray-50 rounded hover:bg-gray-100 cursor-pointer">
                                <input type="checkbox" x-model="calcInputs.perc.surgery" @change="calculatePERC()" class="w-4 h-4 text-red-600 rounded">
                                <span>Cirurgia ou trauma recente (< 4 semanas)</span>
                            </label>
                            <label class="flex items-center gap-3 p-2 bg-gray-50 rounded hover:bg-gray-100 cursor-pointer">
                                <input type="checkbox" x-model="calcInputs.perc.leg" @change="calculatePERC()" class="w-4 h-4 text-red-600 rounded">
                                <span>Edema unilateral de MMII</span>
                            </label>
                        </div>
                        <div class="p-4 rounded-lg text-center mt-4 border" :class="calcResult === 0 ? 'bg-green-50 border-green-100' : 'bg-red-50 border-red-100'">
                            <p class="font-bold text-xl" :class="calcResult === 0 ? 'text-green-700' : 'text-red-700'" x-text="calcResultText || 'Marque os critérios presentes'"></p>
                            <button x-show="calcResult !== null" 
                                    @click="addToExam('pulmonary', calcResult === 0 ? 'PERC negativo.' : 'PERC positivo (' + calcResult + ' critérios).'); showCalculators = false;" 
                                    class="mt-3 w-full bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center gap-2 font-medium">
                                <i class="fas fa-plus-circle"></i> Adicionar ao Pulmonar
                            </button>
                        </div>
                    </div>
                `;
            }

            if (id === 'nihss') {
                return `
                    <div class="space-y-3 p-4 text-sm">
                        <h4 class="font-bold text-lg text-gray-800 border-b pb-2">NIHSS (Resumido)</h4>
                        <p class="text-xs text-gray-500">Escala completa em: <a href="https://www.mdcalc.com/calc/715/nih-stroke-scale-score-nihss" target="_blank" class="text-blue-600 underline">MDCalc NIHSS</a></p>
                        <div class="bg-purple-50 p-4 rounded-lg border border-purple-100">
                            <p class="text-purple-800 font-medium">Interpretação rápida:</p>
                            <ul class="text-xs text-purple-700 mt-2 space-y-1">
                                <li><strong>0:</strong> Sem déficit</li>
                                <li><strong>1-4:</strong> AVC menor</li>
                                <li><strong>5-15:</strong> AVC moderado</li>
                                <li><strong>16-20:</strong> AVC moderado a grave</li>
                                <li><strong>21-42:</strong> AVC grave</li>
                            </ul>
                        </div>
                        <p class="text-xs text-gray-500 mt-2">Para cálculo completo, utilize ferramentas especializadas como MDCalc ou AHA Stroke.</p>
                    </div>
                `;
            }
            
            return '<div class="p-4 text-center text-gray-500">Calculadora em desenvolvimento...</div>';
        },

        // Calculator functions
        calculateCKD() {
            const cr = parseFloat(this.calcInputs.ckd.creat);
            const age = parseFloat(this.calcInputs.ckd.age);
            const isFemale = this.calcInputs.ckd.sex === 'female';
            
            if (!cr || !age || cr <= 0 || age <= 0) {
                this.calcResult = null;
                this.calcResultText = 'Preencha todos os campos';
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
                this.calcResultText = 'G5: Falência renal (<15)';
            }
        },

        calculateGlasgow() {
            const total = this.calcInputs.glasgow.eye + this.calcInputs.glasgow.verbal + this.calcInputs.glasgow.motor;
            this.calcResult = total;
            this.calcResultText = `Glasgow ${total} (O${this.calcInputs.glasgow.eye}V${this.calcInputs.glasgow.verbal}M${this.calcInputs.glasgow.motor})`;
        },

        getGlasgowInterpretation() {
            const total = this.calcInputs.glasgow.eye + this.calcInputs.glasgow.verbal + this.calcInputs.glasgow.motor;
            if (total <= 8) return 'TCE Grave - IOT indicada';
            if (total <= 12) return 'TCE Moderado';
            return 'TCE Leve';
        },

        calculateCURB65() {
            let score = 0;
            if (this.calcInputs.curb65.conf) score++;
            if (this.calcInputs.curb65.uremia) score++;
            if (this.calcInputs.curb65.resp) score++;
            if (this.calcInputs.curb65.bp) score++;
            if (this.calcInputs.curb65.age65) score++;
            
            this.calcResult = score;
            
            if (score === 0 || score === 1) {
                this.calcResultText = 'Baixo risco (mortalidade ~1.5%) - Tratamento ambulatorial';
            } else if (score === 2) {
                this.calcResultText = 'Risco intermediário (mortalidade ~9.2%) - Considerar internação';
            } else {
                this.calcResultText = 'Alto risco (mortalidade ~22%) - Internação + considerar UTI';
            }
        },

        getCURB65Color() {
            if (this.calcResult === null) return 'text-gray-500';
            if (this.calcResult <= 1) return 'text-green-600';
            if (this.calcResult === 2) return 'text-yellow-600';
            return 'text-red-600';
        },

        calculateCHADS() {
            let score = 0;
            if (this.calcInputs.chads.chf) score += 1;
            if (this.calcInputs.chads.htn) score += 1;
            if (this.calcInputs.chads.age75) score += 2;
            if (this.calcInputs.chads.dm) score += 1;
            if (this.calcInputs.chads.stroke) score += 2;
            if (this.calcInputs.chads.vasc) score += 1;
            if (this.calcInputs.chads.age65_74) score += 1;
            if (this.calcInputs.chads.female) score += 1;
            
            this.calcResult = score;
            
            const risks = {
                0: '0% - Baixo risco, anticoagulação opcional',
                1: '1.3% - Considerar anticoagulação',
                2: '2.2% - Anticoagulação recomendada',
                3: '3.2% - Anticoagulação recomendada',
                4: '4.0% - Anticoagulação recomendada',
                5: '6.7% - Anticoagulação recomendada',
                6: '9.8% - Anticoagulação recomendada',
                7: '9.6% - Anticoagulação recomendada',
                8: '6.7% - Anticoagulação recomendada',
                9: '15.2% - Anticoagulação recomendada'
            };
            
            this.calcResultText = `Risco AVC/ano: ${risks[Math.min(score, 9)] || 'Alto risco - Anticoagulação'}`;
        },

        calculateWellsTVP() {
            let score = 0;
            if (this.calcInputs.wells_tvp.cancer) score += 1;
            if (this.calcInputs.wells_tvp.paralysis) score += 1;
            if (this.calcInputs.wells_tvp.bedridden) score += 1;
            if (this.calcInputs.wells_tvp.tenderness) score += 1;
            if (this.calcInputs.wells_tvp.swelling) score += 1;
            if (this.calcInputs.wells_tvp.calf) score += 1;
            if (this.calcInputs.wells_tvp.edema) score += 1;
            if (this.calcInputs.wells_tvp.collat) score += 1;
            if (this.calcInputs.wells_tvp.history) score += 1;
            if (this.calcInputs.wells_tvp.alternative) score -= 2;
            
            this.calcResult = score;
            
            if (score <= 0) {
                this.calcResultText = 'Baixa probabilidade (3%) - D-dímero se disponível';
            } else if (score <= 2) {
                this.calcResultText = 'Moderada probabilidade (17%) - USG Doppler';
            } else {
                this.calcResultText = 'Alta probabilidade (75%) - USG Doppler + considerar anticoagulação';
            }
        },

        calculateWellsTEP() {
            let score = 0;
            if (this.calcInputs.wells_tep.dvt) score += 3;
            if (this.calcInputs.wells_tep.hr) score += 1.5;
            if (this.calcInputs.wells_tep.immob) score += 1.5;
            if (this.calcInputs.wells_tep.history) score += 1.5;
            if (this.calcInputs.wells_tep.hemoptysis) score += 1;
            if (this.calcInputs.wells_tep.cancer) score += 1;
            if (this.calcInputs.wells_tep.alternative) score += 3;
            
            this.calcResult = score;
            
            if (score <= 4) {
                this.calcResultText = 'TEP improvável (≤4) - Considerar D-dímero';
            } else {
                this.calcResultText = 'TEP provável (>4) - AngioTC ou cintilografia';
            }
        },

        calculateIMC() {
            const weight = parseFloat(this.calcInputs.imc.weight);
            const height = parseFloat(this.calcInputs.imc.height) / 100; // cm to m
            
            if (!weight || !height || weight <= 0 || height <= 0) {
                this.calcResult = null;
                this.calcResultText = '';
                return;
            }
            
            const imc = weight / (height * height);
            this.calcResult = imc.toFixed(1);
            
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
                this.calcResultText = 'Obesidade Grau III (Mórbida)';
            }
        },

        calculateHASBLED() {
            let score = 0;
            if (this.calcInputs.has_bled.htn) score++;
            if (this.calcInputs.has_bled.renal) score++;
            if (this.calcInputs.has_bled.liver) score++;
            if (this.calcInputs.has_bled.stroke) score++;
            if (this.calcInputs.has_bled.bleeding) score++;
            if (this.calcInputs.has_bled.inr) score++;
            if (this.calcInputs.has_bled.age65) score++;
            if (this.calcInputs.has_bled.drugs) score++;
            if (this.calcInputs.has_bled.alcohol) score++;
            
            this.calcResult = score;
            
            if (score <= 2) {
                this.calcResultText = 'Baixo risco de sangramento - Anticoagulação geralmente segura';
            } else {
                this.calcResultText = 'Alto risco de sangramento (≥3) - Cautela, monitorar de perto';
            }
        },

        calculatePERC() {
            const criteria = [
                this.calcInputs.perc.age50,
                this.calcInputs.perc.hr100,
                this.calcInputs.perc.sat95,
                this.calcInputs.perc.hemoptysis,
                this.calcInputs.perc.estrogen,
                this.calcInputs.perc.dvt,
                this.calcInputs.perc.surgery,
                this.calcInputs.perc.leg
            ];
            
            const positives = criteria.filter(c => c).length;
            this.calcResult = positives;
            
            if (positives === 0) {
                this.calcResultText = 'PERC NEGATIVO - TEP excluído (se pré-teste baixo)';
            } else {
                this.calcResultText = `PERC POSITIVO (${positives} critério${positives > 1 ? 's' : ''}) - Prosseguir investigação`;
            }
        },

        generateText() {
            let text = `PS CLÍNICA MÉDICA - ${this.form.shift}\n`;
            
            // Identification
            text += `PACIENTE: ${this.form.name || 'Não identificado'}, ${this.form.age ? this.form.age + ' anos' : '? anos'}, ${this.form.gender}.\n`;
            text += `ADMISSÃO: ${this.form.admission}\n\n`;

            // Antecedents
            text += `# ANTECEDENTES:\n`;
            text += `Comorbidades: ${this.form.comorbidities || 'Nega'} | Cirurgias: ${this.form.surgeries || 'Nega'}\n`;
            
            // Habits
            let habitsList = [];
            if (this.form.habits.smoker) habitsList.push('Tabagista');
            if (this.form.habits.alcoholic) habitsList.push('Etilista');
            if (this.form.habits.drugs) habitsList.push('Usuário de drogas');
            if (this.form.habits.sedentary) habitsList.push('Sedentário');
            
            if (habitsList.length > 0) {
                text += `Hábitos: ${habitsList.join(', ')}\n`;
            } else {
                text += `Hábitos: Nega tabagismo, etilismo ou uso de drogas.\n`;
            }

            text += `ALERGIAS: ${this.form.allergies || 'Nega'}\n`;
            
            // Medications
            if (this.form.medications.length > 0) {
                text += `MEDICAÇÕES EM USO:\n`;
                this.form.medications.forEach(med => {
                    text += `- ${med.name} (${med.posology})\n`;
                });
            } else {
                text += `MEDICAÇÕES: Nega uso contínuo\n`;
            }

            // Subjective
            text += `\n# S (SUBJETIVO):\n`;
            text += `QP: ${this.form.subjective.qp}\n`;
            text += `HDA: ${this.form.subjective.hda}\n`;
            
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
            let vitals = `SSVV: PA: ${this.form.vitals.pa || '-'} mmHg`;
            vitals += ` - FC: ${this.form.vitals.fc || '-'} bpm`;
            vitals += ` - FR: ${this.form.vitals.fr || '-'} irpm`;
            vitals += ` - Sat: ${this.form.vitals.sat || '-'}%`;
            if (this.form.vitals.temp) vitals += ` - Tax: ${this.form.vitals.temp}ºC`;
            if (this.form.vitals.hgt) vitals += ` - HGT: ${this.form.vitals.hgt}`;
            text += `${vitals}\n`;

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

        copyText() {
            const text = this.generateText();
            navigator.clipboard.writeText(text).then(() => {
                this.copied = true;
                setTimeout(() => this.copied = false, 2000);
            });
        }
    }))
})

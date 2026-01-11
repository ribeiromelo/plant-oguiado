// Base de dados de prescrições médicas
const PRESCRICOES_DB = {
    categorias: [
        { id: 'cardiovascular', nome: 'Sistema Cardiovascular', icone: 'fas fa-heart', cor: 'red' },
        { id: 'neurologico', nome: 'Sistema Nervoso', icone: 'fas fa-brain', cor: 'purple' },
        { id: 'respiratorio', nome: 'Sistema Respiratório', icone: 'fas fa-lungs', cor: 'blue' },
        { id: 'gastrointestinal', nome: 'Sistema Gastrointestinal', icone: 'fas fa-stomach', cor: 'yellow' },
        { id: 'geniturinario', nome: 'Sistema Geniturinário', icone: 'fas fa-kidneys', cor: 'orange' },
        { id: 'endocrino', nome: 'Sistema Endócrino', icone: 'fas fa-vial', cor: 'teal' },
        { id: 'infeccoes', nome: 'Infecções', icone: 'fas fa-virus', cor: 'green' },
        { id: 'psiquiatria', nome: 'Psiquiatria', icone: 'fas fa-head-side-virus', cor: 'indigo' },
        { id: 'hidroeletrolitico', nome: 'Distúrbios Hidroeletrolíticos', icone: 'fas fa-tint', cor: 'cyan' },
        { id: 'dor', nome: 'Dor e Analgesia', icone: 'fas fa-prescription', cor: 'pink' },
        { id: 'pele', nome: 'Dermatologia', icone: 'fas fa-allergies', cor: 'amber' },
        { id: 'emergencia', nome: 'Emergências', icone: 'fas fa-ambulance', cor: 'rose' }
    ],

    prescricoes: [
        // ==================== CARDIOVASCULAR ====================
        {
            id: 'tsv',
            categoria: 'cardiovascular',
            nome: 'Taquicardia Supraventricular',
            tags: ['arritmia', 'taquicardia', 'palpitação'],
            ambiente: 'hospitalar',
            prescricoes: [
                {
                    titulo: 'TSV Estável - 1ª Linha',
                    tipo: 'hospitalar',
                    itens: [
                        '1. Manobras vagais (Valsalva modificado ou massagem carotídea)',
                        '2. Adenosina (6mg/2ml) - 01 ampola IV em bolus rápido',
                        '   - Seguida de flush com 20ml de SF 0,9%',
                        '   - Elevar o membro após administração',
                        '   - Se sem resposta: Adenosina 12mg (2 ampolas) IV bolus'
                    ]
                },
                {
                    titulo: 'TSV Estável - Alternativa',
                    tipo: 'hospitalar',
                    itens: [
                        '1. Metoprolol (5mg/5ml) - 01 ampola IV',
                        '   - Fazer 2,5-5mg em bolus lento (1mg/min)',
                        '   - Pode repetir a cada 5 min, até dose máx de 15mg'
                    ]
                },
                {
                    titulo: 'TSV Instável',
                    tipo: 'emergencia',
                    itens: [
                        '⚠️ CARDIOVERSÃO ELÉTRICA SINCRONIZADA',
                        '   - Energia: 50-100J',
                        '   - Sedação prévia se consciente (não atrasar CVE)'
                    ]
                }
            ]
        },
        {
            id: 'tv',
            categoria: 'cardiovascular',
            nome: 'Taquicardia Ventricular',
            tags: ['arritmia', 'taquicardia', 'qrs largo'],
            ambiente: 'hospitalar',
            prescricoes: [
                {
                    titulo: 'TV Estável - Dose de Ataque',
                    tipo: 'hospitalar',
                    itens: [
                        '1. Amiodarona (150mg/3ml) - 01 ampola',
                        '   - Diluir em 100ml de SG 5%',
                        '   - Correr em 10-30 minutos IV'
                    ]
                },
                {
                    titulo: 'TV Estável - Manutenção',
                    tipo: 'hospitalar',
                    itens: [
                        '1. Amiodarona (150mg/3ml) - 06 ampolas (900mg)',
                        '   - Diluir em 232ml de SG 5%',
                        '   - Correr a 16,6 ml/h nas primeiras 6h',
                        '   - Após, correr a 8,3 ml/h nas próximas 18h'
                    ]
                },
                {
                    titulo: 'TV Estável - Alternativa (Lidocaína)',
                    tipo: 'hospitalar',
                    itens: [
                        '1. Lidocaína 2% (20mg/ml)',
                        '   - Fazer 1,5 mg/kg IV lento',
                        '   - Se falha: repetir 0,5 mg/kg',
                        '   - Dose máxima: 3-4 mg/kg'
                    ]
                },
                {
                    titulo: 'TV - Tratamento Ambulatorial',
                    tipo: 'alta',
                    itens: [
                        '1. Metoprolol (25mg, 50mg ou 100mg) - 30 comprimidos',
                        '   - Tomar 25mg VO 1x/dia',
                        '   - Progredir até dose alvo de 100-200mg/dia',
                        '',
                        '2. Encaminhar para Cardiologia'
                    ]
                }
            ]
        },
        {
            id: 'fa',
            categoria: 'cardiovascular',
            nome: 'Fibrilação Atrial / Flutter',
            tags: ['arritmia', 'fa', 'flutter', 'anticoagulação'],
            ambiente: 'hospitalar',
            prescricoes: [
                {
                    titulo: 'FA/Flutter - Controle de Frequência IV',
                    tipo: 'hospitalar',
                    itens: [
                        '# BETABLOQUEADOR',
                        '1. Metoprolol (5mg/5ml)',
                        '   - Fazer 1 ampola IV lento em 2 min',
                        '   - Pode repetir a cada 5 min (máx 15-20mg)',
                        '',
                        '# BLOQUEADOR DE CANAL DE CÁLCIO',
                        '2. Verapamil (5mg/2ml)',
                        '   - Fazer 0,075-0,15 mg/kg IV em 2 min',
                        '   - Repetir após 30 min se necessário (máx 20mg)',
                        '',
                        '# DIGITÁLICO',
                        '3. Deslanosídeo (0,4mg/2ml)',
                        '   - Fazer 1-2 ampolas IV lento em 24h'
                    ]
                },
                {
                    titulo: 'FA/Flutter - Cardioversão Química',
                    tipo: 'hospitalar',
                    itens: [
                        '1. Amiodarona (150mg/3ml)',
                        '   - Dose ataque: 5-7 mg/kg + SG 5% 100ml IV em 30-60 min',
                        '   - Manutenção: 6 ampolas (900mg) + SG 5% 482ml',
                        '     * 33 ml/h nas primeiras 6h',
                        '     * 16,6 ml/h nas próximas 18h'
                    ]
                },
                {
                    titulo: 'FA/Flutter - Controle de Frequência VO',
                    tipo: 'alta',
                    itens: [
                        '1. Succinato de Metoprolol 25mg - 30 comprimidos',
                        '   - Tomar 1 cp 1x/dia (máx 100mg/dia)',
                        '',
                        'OU',
                        '',
                        '2. Propranolol 10mg - 90 comprimidos',
                        '   - Tomar 1 cp 8/8h (máx 160mg/dia)',
                        '',
                        'OU',
                        '',
                        '3. Diltiazem 60mg - 60 comprimidos',
                        '   - Tomar 1 cp 12/12h (máx 360mg/dia)'
                    ]
                },
                {
                    titulo: 'FA/Flutter - Pós Cardioversão',
                    tipo: 'alta',
                    itens: [
                        '# OPÇÃO 1 (IC)',
                        '1. Amiodarona 100mg - 60 comprimidos',
                        '   - Tomar 3 cp (300mg) 12/12h',
                        '',
                        '# OPÇÃO 2 (Sem cardiopatia estrutural)',
                        '2. Propafenona 300mg - 60 comprimidos',
                        '   - Tomar 1 cp 12/12h'
                    ]
                },
                {
                    titulo: 'FA/Flutter - Anticoagulação',
                    tipo: 'alta',
                    itens: [
                        '# AVALIAR CHA2DS2-VASc e HAS-BLED',
                        '',
                        '# OPÇÃO 1 - Varfarina',
                        '1. Varfarina 5mg - 30 comprimidos',
                        '   - Tomar 1/2 a 1 cp 1x/dia',
                        '   - Ajustar dose para INR 2-3',
                        '',
                        '# OPÇÃO 2 - Rivaroxabana',
                        '2. Rivaroxabana 20mg - 30 comprimidos',
                        '   - Tomar 1 cp 1x/dia',
                        '',
                        '# HEPARINA (fase aguda)',
                        '3. Enoxaparina 60mg - seringas',
                        '   - Aplicar 1mg/kg SC 12/12h',
                        '   - >75 anos: 0,75mg/kg 12/12h',
                        '   - ClCr <30: 1mg/kg 1x/dia'
                    ]
                }
            ]
        },
        {
            id: 'sca',
            categoria: 'cardiovascular',
            nome: 'Síndrome Coronariana Aguda',
            tags: ['infarto', 'iam', 'angina', 'dor torácica', 'sca'],
            ambiente: 'hospitalar',
            prescricoes: [
                {
                    titulo: 'SCA - Tratamento Inicial (MONABCH)',
                    tipo: 'emergencia',
                    itens: [
                        '# M - MORFINA (se dor refratária)',
                        '1. Morfina (10mg/ml)',
                        '   - Diluir 1 amp em 9ml AD',
                        '   - Fazer 2-4ml IV (2-4mg)',
                        '',
                        '# O - OXIGÊNIO (se SatO2 < 90%)',
                        '2. O2 suplementar para manter Sat > 94%',
                        '',
                        '# N - NITRATO',
                        '3. Isordil 5mg SL - se dor torácica',
                        '   - Pode repetir a cada 5 min (máx 3 doses)',
                        '   ⚠️ Não usar se: IAM VD, Sildenafil <24h, PAS<90',
                        '',
                        '# A - AAS',
                        '4. AAS 100mg - 3 comprimidos (300mg) mastigar',
                        '   - Manter 100mg/dia',
                        '',
                        '# B - BETABLOQUEADOR',
                        '5. Metoprolol 5mg IV a cada 5 min (máx 3 doses)',
                        '   ⚠️ CI: FC<60, PAS<100, Killip>I, BAV',
                        '',
                        '# C - CLOPIDOGREL/TICAGRELOR',
                        '6. Ticagrelor 90mg - 2 cp (180mg) ataque',
                        '   - Manter 90mg 12/12h',
                        '   OU',
                        '   Clopidogrel 75mg - 4 cp (300mg) ataque',
                        '   - Manter 75mg/dia',
                        '',
                        '# H - HEPARINA',
                        '7. Enoxaparina 60mg',
                        '   - Aplicar 1mg/kg SC 12/12h'
                    ]
                },
                {
                    titulo: 'SCA - Tratamento Hospitalar',
                    tipo: 'hospitalar',
                    itens: [
                        '1. Nitroglicerina (Tridil) 25mg/5ml',
                        '   - Diluir 1 amp em 230ml SF 0,9%',
                        '   - Iniciar 5ml/h e titular conforme PA e dor',
                        '',
                        '2. Enoxaparina 60mg/seringa',
                        '   - 1mg/kg SC 12/12h',
                        '',
                        '3. Atorvastatina 40mg',
                        '   - 1 cp/dia',
                        '',
                        '4. AAS 100mg',
                        '   - 1 cp/dia',
                        '',
                        '5. Ticagrelor 90mg',
                        '   - 1 cp 12/12h'
                    ]
                },
                {
                    titulo: 'SCA com Supra - Trombólise',
                    tipo: 'emergencia',
                    itens: [
                        '⚠️ INDICAÇÃO: IAMCSST até 12h do início dos sintomas',
                        '⚠️ Idealmente < 30 min porta-agulha',
                        '',
                        '1. Alteplase (rt-PA) 1mg/ml - 100mg máx',
                        '   - Bolus: 15mg IV',
                        '   - 0,75 mg/kg em 30 min (máx 50mg)',
                        '   - 0,50 mg/kg em 60 min (máx 35mg)',
                        '',
                        '⚠️ CONTRAINDICAÇÕES ABSOLUTAS:',
                        '- AVCh prévio',
                        '- AVCi < 3 meses',
                        '- Neoplasia ou MAV do SNC',
                        '- Dissecção de aorta suspeita',
                        '- Sangramento ativo',
                        '- TCE grave < 3 meses'
                    ]
                },
                {
                    titulo: 'SCA - Alta Hospitalar',
                    tipo: 'alta',
                    itens: [
                        '1. AAS 100mg - uso contínuo',
                        '   - Tomar 1 cp/dia',
                        '',
                        '2. Ticagrelor 90mg ou Clopidogrel 75mg - 12 meses',
                        '   - Tomar 1 cp 12/12h (Ticagrelor) ou 1x/dia (Clopido)',
                        '',
                        '3. Atorvastatina 40-80mg - uso contínuo',
                        '   - Tomar 1 cp à noite',
                        '',
                        '4. Metoprolol 25-100mg - uso contínuo',
                        '   - Iniciar 25mg 1x/dia, titular',
                        '',
                        '5. Enalapril 10mg ou similar - uso contínuo',
                        '   - Iniciar 5mg 12/12h, titular',
                        '',
                        '6. Encaminhar Cardiologia + Reabilitação Cardíaca'
                    ]
                }
            ]
        },
        {
            id: 'ic_eap',
            categoria: 'cardiovascular',
            nome: 'IC Descompensada / Edema Agudo de Pulmão',
            tags: ['insuficiência cardíaca', 'eap', 'congestão', 'dispneia'],
            ambiente: 'hospitalar',
            prescricoes: [
                {
                    titulo: 'EAP - Tratamento Inicial',
                    tipo: 'emergencia',
                    itens: [
                        '# LMNOP',
                        '',
                        '# L - LASIX (Furosemida)',
                        '1. Furosemida (20mg/2ml)',
                        '   - Dose: 1-1,5 mg/kg IV bolus',
                        '   - 50kg: 2,5-3,5ml | 70kg: 3,5-5ml | 90kg: 4,5-7ml',
                        '',
                        '# M - MORFINA (uso restrito)',
                        '2. Morfina 2mg/2ml',
                        '   - Fazer 1 amp IV lento (casos específicos)',
                        '   ⚠️ Atualmente reservada para casos refratários',
                        '',
                        '# N - NITRATO',
                        '3. Nitroglicerina (Tridil) 25mg/5ml',
                        '   - Diluir 1 amp em 230ml SF 0,9%',
                        '   - Iniciar 5ml/h (5mcg/min)',
                        '   - Aumentar a cada 5 min conforme PA',
                        '',
                        '# O - OXIGÊNIO / VNI',
                        '4. CPAP ou BiPAP',
                        '   - PEEP/EPAP: 5-10 cmH2O',
                        '',
                        '# P - POSIÇÃO (Fowler)'
                    ]
                },
                {
                    titulo: 'IC Perfil B (Quente e Úmido)',
                    tipo: 'hospitalar',
                    itens: [
                        '# COM CONGESTÃO + BEM PERFUNDIDO',
                        '',
                        '1. Furosemida (20mg/2ml)',
                        '   - 0,5-1 mg/kg IV bolus',
                        '   - Repetir SN (máx 240mg/dia)',
                        '',
                        '2. Nitroglicerina (25mg/5ml)',
                        '   - Diluir 2 amp + 240ml SF 0,9%',
                        '   - BIC: iniciar 1,5ml/h, titular',
                        '',
                        '3. Manter medicações VO de IC se em uso'
                    ]
                },
                {
                    titulo: 'IC Perfil L (Frio e Seco)',
                    tipo: 'hospitalar',
                    itens: [
                        '# SEM CONGESTÃO + MAL PERFUNDIDO',
                        '',
                        '1. SF 0,9% ou Ringer Lactato',
                        '   - Alíquotas de 250ml IV lento',
                        '   - Reavaliar ausculta após cada alíquota',
                        '',
                        '2. Se sem melhora com volume:',
                        '   Dobutamina (250mg/20ml)',
                        '   - Diluir 1 amp + 230ml SF 0,9%',
                        '   - BIC: 2-20 mcg/kg/min',
                        '   - 50kg: 6-60 ml/h | 70kg: 8-84 ml/h'
                    ]
                },
                {
                    titulo: 'IC Perfil C (Frio e Úmido)',
                    tipo: 'hospitalar',
                    itens: [
                        '# COM CONGESTÃO + MAL PERFUNDIDO',
                        '',
                        '1. Furosemida',
                        '   - Doses menores inicialmente',
                        '',
                        '2. Nitroglicerina ou Nitroprussiato',
                        '   - Após estabilização pressórica',
                        '',
                        '3. Dobutamina (250mg/20ml)',
                        '   - BIC: 2-20 mcg/kg/min'
                    ]
                },
                {
                    titulo: 'IC Crônica - Prescrição Ambulatorial',
                    tipo: 'alta',
                    itens: [
                        '# IECA/BRA',
                        '1. Enalapril 10mg - 60 comprimidos',
                        '   - Iniciar 2,5mg 2x/dia → Alvo: 10-20mg 2x/dia',
                        '',
                        '# BETABLOQUEADOR',
                        '2. Carvedilol 6,25mg - 60 comprimidos',
                        '   - Iniciar 3,125mg 2x/dia → Alvo: 25mg 2x/dia',
                        '',
                        '# ANTAGONISTA MINERALOCORTICOIDE',
                        '3. Espironolactona 25mg - 30 comprimidos',
                        '   - Tomar 1 cp 1x/dia',
                        '',
                        '# DIURÉTICO',
                        '4. Furosemida 40mg - 30 comprimidos',
                        '   - Tomar conforme congestão',
                        '',
                        '# SGLT2i (se FE reduzida)',
                        '5. Dapagliflozina 10mg - 30 comprimidos',
                        '   - Tomar 1 cp 1x/dia'
                    ]
                }
            ]
        },
        {
            id: 'bradicardia',
            categoria: 'cardiovascular',
            nome: 'Bradicardia Sintomática',
            tags: ['arritmia', 'bradicardia', 'bloqueio'],
            ambiente: 'hospitalar',
            prescricoes: [
                {
                    titulo: 'Bradicardia Sintomática - 1ª Linha',
                    tipo: 'emergencia',
                    itens: [
                        '# SINTOMAS: Hipotensão, confusão, síncope, dor torácica, IC',
                        '',
                        '1. Atropina (0,5mg/ml)',
                        '   - Fazer 1mg (2 amp) IV bolus',
                        '   - Repetir a cada 3-5 min (máx 3mg)',
                        '',
                        '⚠️ INEFICAZ EM:',
                        '- BAV 2º grau Mobitz II',
                        '- BAV 3º grau (BAVT)',
                        '- Coração transplantado'
                    ]
                },
                {
                    titulo: 'Bradicardia - Refratários',
                    tipo: 'emergencia',
                    itens: [
                        '# SE ATROPINA INEFICAZ:',
                        '',
                        '1. Dopamina (50mg/10ml)',
                        '   - Diluir 5 amp + 200ml SG 5%',
                        '   - BIC: 2-10 mcg/kg/min',
                        '   - 50kg: 6-30 ml/h | 70kg: 8-42 ml/h',
                        '',
                        '2. Adrenalina (1mg/ml)',
                        '   - Diluir 6 amp + 94ml SF 0,9%',
                        '   - BIC: 2-10 mcg/min',
                        '   - Vazão: 2-10 ml/h',
                        '',
                        '3. MARCAPASSO TRANSCUTÂNEO',
                        '   - Sedação prévia',
                        '   - FC: 70-80 bpm',
                        '   - Aumentar corrente até captura'
                    ]
                }
            ]
        },
        {
            id: 'crise_hta',
            categoria: 'cardiovascular',
            nome: 'Crise Hipertensiva',
            tags: ['hipertensão', 'emergência hipertensiva', 'urgência hipertensiva'],
            ambiente: 'hospitalar',
            prescricoes: [
                {
                    titulo: 'Urgência Hipertensiva (sem LOA)',
                    tipo: 'hospitalar',
                    itens: [
                        '# META: Reduzir PA ~160x100 em 24-48h',
                        '# Usar anti-hipertensivo VO',
                        '',
                        '1. Captopril 25mg - VO',
                        '   - Tomar 1 cp, pode repetir em 30 min',
                        '',
                        '2. Clonidina 0,1mg - VO',
                        '   - Tomar 1-2 cp',
                        '',
                        '# TRATAR TAMBÉM:',
                        '- Dor (Dipirona 1g IV)',
                        '- Ansiedade (se necessário)'
                    ]
                },
                {
                    titulo: 'Emergência Hipertensiva (com LOA)',
                    tipo: 'emergencia',
                    itens: [
                        '# META: Reduzir PAM em 20-25% na 1ª hora',
                        '',
                        '# NITROPRUSSIATO (1ª escolha)',
                        '1. Nitroprussiato de Sódio (50mg/2ml)',
                        '   - Diluir 1 amp + 248ml SF 0,9% ou SG 5%',
                        '   - BIC: 0,25-10 mcg/kg/min',
                        '   - Iniciar baixo e titular',
                        '   ⚠️ Proteger da luz | Cuidado >48h (cianeto)',
                        '',
                        '# NITROGLICERINA (SCA, EAP)',
                        '2. Nitroglicerina (25mg/5ml)',
                        '   - Diluir 2 amp + 240ml SF 0,9%',
                        '   - BIC: 5-200 mcg/min',
                        '',
                        '# METOPROLOL (Dissecção aórtica)',
                        '3. Metoprolol (5mg/5ml)',
                        '   - 5mg IV a cada 10 min (máx 20mg)',
                        '',
                        '# FUROSEMIDA (EAP)',
                        '4. Furosemida (20mg/2ml)',
                        '   - 20-60mg IV bolus'
                    ]
                }
            ]
        },

        // ==================== NEUROLÓGICO ====================
        {
            id: 'cefaleia',
            categoria: 'neurologico',
            nome: 'Cefaleia Primária / Enxaqueca',
            tags: ['dor de cabeça', 'migrânea', 'cefaleia tensional'],
            ambiente: 'hospitalar',
            prescricoes: [
                {
                    titulo: 'Cefaleia - Tratamento PS',
                    tipo: 'hospitalar',
                    itens: [
                        '1. Cetoprofeno (100mg/2ml) - 01 ampola',
                        '   - Diluir em 100ml SF 0,9%',
                        '   - Correr IV em 20 minutos',
                        '',
                        '2. Dexametasona (10mg/2,5ml) - 01 ampola',
                        '   - Fazer 1 amp IV bolus ou IM',
                        '',
                        '3. Dipirona (1g/2ml) - 01 ampola',
                        '   - Fazer IV bolus lento'
                    ]
                },
                {
                    titulo: 'Enxaqueca - Tratamento Específico',
                    tipo: 'hospitalar',
                    itens: [
                        '# TRIPTANOS',
                        '1. Sumatriptano 6mg/0,5ml (Sumax)',
                        '   - Aplicar 6mg SC',
                        '   - Pode repetir após 1h (máx 2 amp/dia)',
                        '',
                        '# ASSOCIAR:',
                        '2. Cetoprofeno 100mg + Dexametasona 10mg IV'
                    ]
                },
                {
                    titulo: 'Cefaleia - Alta Hospitalar',
                    tipo: 'alta',
                    itens: [
                        '# ANALGÉSICOS',
                        '1. Dipirona 1g - 20 comprimidos',
                        '   - Tomar 1 cp 6/6h se dor',
                        '',
                        '2. Ibuprofeno 400mg - 20 comprimidos',
                        '   - Tomar 1 cp até 6/6h se dor',
                        '',
                        '# ENXAQUECA RECORRENTE',
                        '3. Sumatriptano + Naproxeno (Sumaxpro) 50/500mg',
                        '   - Tomar 1 cp no início da crise',
                        '   - Máx 2 cp/dia',
                        '',
                        '⚠️ Atentar para cefaleia por abuso de analgésicos'
                    ]
                }
            ]
        },
        {
            id: 'vertigem',
            categoria: 'neurologico',
            nome: 'Vertigem',
            tags: ['tontura', 'labirintite', 'vppb'],
            ambiente: 'hospitalar',
            prescricoes: [
                {
                    titulo: 'Vertigem - Tratamento PS',
                    tipo: 'hospitalar',
                    itens: [
                        '1. Dimenidrinato + Piridoxina (Dramin B6) 50mg',
                        '   - Fazer 1 amp IV 6/6h'
                    ]
                },
                {
                    titulo: 'Vertigem - Alta Hospitalar',
                    tipo: 'alta',
                    itens: [
                        '1. Dimenidrinato 50mg - 20 comprimidos',
                        '   - Tomar 1 cp 4/4h ou 6/6h',
                        '',
                        'OU',
                        '',
                        '2. Cinarizina 25mg - 30 comprimidos',
                        '   - Tomar 1 cp 8/8h',
                        '',
                        'OU',
                        '',
                        '3. Meclizina 50mg - 30 comprimidos',
                        '   - Tomar 1 cp 8/8h',
                        '',
                        '⚠️ Supressores vestibulares: usar por curto período'
                    ]
                }
            ]
        },
        {
            id: 'convulsao',
            categoria: 'neurologico',
            nome: 'Crise Convulsiva',
            tags: ['epilepsia', 'convulsão', 'estado de mal'],
            ambiente: 'hospitalar',
            prescricoes: [
                {
                    titulo: 'Crise Convulsiva - 1ª Linha (0-5 min)',
                    tipo: 'emergencia',
                    itens: [
                        '1. Diazepam (10mg/2ml) - IV',
                        '   - Fazer 1 amp IV bolus lento',
                        '',
                        '# SE SEM ACESSO:',
                        '2. Midazolam 10mg - IM',
                        '   - Fazer 1 amp IM'
                    ]
                },
                {
                    titulo: 'Crise - Refratário (5-10 min)',
                    tipo: 'emergencia',
                    itens: [
                        '# REPETIR BENZODIAZEPÍNICO',
                        '1. Diazepam 10mg IV bolus lento',
                        '',
                        '# SE MANTÉM:',
                        '2. Fenitoína (Hidantal) 250mg/5ml',
                        '   - Diluir 2 amp em 40ml NaCl 0,9%',
                        '   - Dose: 15-20 mg/kg IV',
                        '   - Fazer 0,5-1 ml/kg (da solução 10mg/ml)',
                        '',
                        '# ALTERNATIVA:',
                        '3. Fenobarbital 200mg/2ml',
                        '   - Diluir 5 amp em 90ml NaCl 0,9%',
                        '   - Dose: 10-20 mg/kg IV',
                        '   - Fazer 1-2 ml/kg (da solução 10mg/ml)'
                    ]
                },
                {
                    titulo: 'Estado de Mal Epiléptico (>30 min)',
                    tipo: 'emergencia',
                    itens: [
                        '⚠️ PROCEDER IOT',
                        '',
                        '1. Midazolam (50mg/10ml)',
                        '   - Diluir 3 amp + 120ml NaCl 0,9%',
                        '   - Ataque: 0,2 mg/kg IV',
                        '   - Manutenção: 0,1-0,4 mg/kg/h BIC',
                        '',
                        '2. Propofol (200mg/20ml)',
                        '   - Ataque: 1-2 mg/kg IV',
                        '   - Manutenção: 5-10 mg/kg/h BIC'
                    ]
                }
            ]
        },

        // ==================== RESPIRATÓRIO ====================
        {
            id: 'oma',
            categoria: 'respiratorio',
            nome: 'Otite Média Aguda',
            tags: ['otite', 'otalgia', 'ouvido'],
            ambiente: 'ambulatorial',
            prescricoes: [
                {
                    titulo: 'OMA - 1ª Linha',
                    tipo: 'alta',
                    itens: [
                        '1. Amoxicilina + Clavulanato 875/125mg - 20 cp',
                        '   - Tomar 1 cp 12/12h por 10 dias',
                        '',
                        'OU (SUS)',
                        '',
                        '2. Amoxicilina + Clavulanato 500/125mg - 30 cp',
                        '   - Tomar 1 cp 8/8h por 10 dias',
                        '',
                        '# ANALGESIA',
                        '3. Dipirona 1g - 20 comprimidos',
                        '   - Tomar 1 cp 6/6h se dor ou febre'
                    ]
                },
                {
                    titulo: 'OMA - Alergia a Penicilina',
                    tipo: 'alta',
                    itens: [
                        '1. Azitromicina 500mg - 5 comprimidos',
                        '   - Tomar 1 cp 1x/dia por 5 dias',
                        '',
                        'OU',
                        '',
                        '2. Claritromicina 500mg - 20 comprimidos',
                        '   - Tomar 1 cp 12/12h por 10 dias',
                        '',
                        'OU',
                        '',
                        '3. Levofloxacino 750mg - 5 comprimidos',
                        '   - Tomar 1 cp 1x/dia por 5 dias'
                    ]
                },
                {
                    titulo: 'OMA - Falha Terapêutica (48-72h)',
                    tipo: 'alta',
                    itens: [
                        '1. Cefuroxima 500mg - 20 comprimidos',
                        '   - Tomar 1 cp 12/12h por 10 dias'
                    ]
                }
            ]
        },
        {
            id: 'sinusite',
            categoria: 'respiratorio',
            nome: 'Sinusite Bacteriana',
            tags: ['sinusite', 'rinossinusite', 'face'],
            ambiente: 'ambulatorial',
            prescricoes: [
                {
                    titulo: 'Sinusite - Tratamento Completo',
                    tipo: 'alta',
                    itens: [
                        '# ANTIBIÓTICO',
                        '1. Amoxicilina + Clavulanato 875/125mg - 20 cp',
                        '   - Tomar 1 cp 12/12h por 10 dias',
                        '',
                        '# CORTICOIDE',
                        '2. Prednisolona 20mg - 10 comprimidos',
                        '   - Tomar 2 cp pela manhã por 5 dias',
                        '',
                        '# CORTICOIDE NASAL',
                        '3. Budesonida 32mcg/jato spray nasal',
                        '   - Aplicar 2 jatos em cada narina 12/12h por 10 dias',
                        '',
                        '# ANALGESIA',
                        '4. Dipirona 1g - 20 comprimidos',
                        '   - Tomar 1 cp 6/6h se dor ou febre'
                    ]
                },
                {
                    titulo: 'Sinusite - Alergia a Penicilina',
                    tipo: 'alta',
                    itens: [
                        '1. Levofloxacino 750mg - 5 comprimidos',
                        '   - Tomar 1 cp 1x/dia por 5 dias'
                    ]
                }
            ]
        },
        {
            id: 'faringoamigdalite',
            categoria: 'respiratorio',
            nome: 'Faringoamigdalite',
            tags: ['amigdalite', 'faringite', 'dor de garganta', 'odinofagia'],
            ambiente: 'ambulatorial',
            prescricoes: [
                {
                    titulo: 'Faringoamigdalite - IM (1ª escolha)',
                    tipo: 'hospitalar',
                    itens: [
                        '1. Penicilina Benzatina 1.200.000 UI',
                        '   - Aplicar IM dose única'
                    ]
                },
                {
                    titulo: 'Faringoamigdalite - VO',
                    tipo: 'alta',
                    itens: [
                        '# ANTIBIÓTICO',
                        '1. Amoxicilina + Clavulanato 875/125mg - 20 cp',
                        '   - Tomar 1 cp 12/12h por 10 dias',
                        '',
                        '# SE ALERGIA:',
                        '2. Azitromicina 500mg - 5 comprimidos',
                        '   - Tomar 1 cp 1x/dia por 5 dias',
                        '',
                        '# SINTOMÁTICOS',
                        '3. Dipirona 1g - 20 comprimidos',
                        '   - Tomar 1 cp 6/6h se dor ou febre',
                        '',
                        '4. Ibuprofeno 400mg - 20 comprimidos',
                        '   - Tomar 1 cp até 6/6h se dor',
                        '',
                        '5. Prednisolona 20mg - 9 comprimidos',
                        '   - Tomar 3 cp pela manhã por 3 dias'
                    ]
                }
            ]
        },
        {
            id: 'asma',
            categoria: 'respiratorio',
            nome: 'Crise Asmática',
            tags: ['asma', 'broncoespasmo', 'dispneia', 'chiado'],
            ambiente: 'hospitalar',
            prescricoes: [
                {
                    titulo: 'Asma Leve/Moderada - Tratamento PS',
                    tipo: 'hospitalar',
                    itens: [
                        '# BRONCODILATADOR',
                        '1. Salbutamol spray (Aerolin) 100mcg/jato',
                        '   - 4 jatos 20/20 min na 1ª hora',
                        '   - Após: 4 jatos 2/2h após controle',
                        '',
                        'OU (nebulização)',
                        '',
                        '   Fenoterol (Berotec) 5mg/ml',
                        '   - 10-20 gotas + 3ml SF 0,9%',
                        '   - NBZ 20/20 min na 1ª hora',
                        '',
                        '# CORTICOIDE VO',
                        '2. Prednisolona 20mg',
                        '   - Tomar 3 cp (60mg) VO dose única',
                        '   - Manter por 5-7 dias'
                    ]
                },
                {
                    titulo: 'Asma Grave - Tratamento PS',
                    tipo: 'emergencia',
                    itens: [
                        '# BRONCODILATADOR',
                        '1. Salbutamol spray 100mcg/jato',
                        '   - 4-10 jatos 20/20 min na 1ª hora',
                        '   - 1/1h se broncoespasmo intenso',
                        '',
                        '2. Ipratrópio spray (Atrovent) 25mcg/jato',
                        '   - 4 jatos 20/20 min na 1ª hora',
                        '',
                        '# CORTICOIDE IV',
                        '3. Hidrocortisona 500mg',
                        '   - Diluir em 10ml AD',
                        '   - Fazer IV dose de ataque',
                        '',
                        '# CONSIDERAR:',
                        '- Sulfato de Magnésio 2g IV em 20 min',
                        '- VNI',
                        '- IOT se necessário'
                    ]
                },
                {
                    titulo: 'Asma - Alta Hospitalar',
                    tipo: 'alta',
                    itens: [
                        '# BRONCODILATADOR DE RESGATE',
                        '1. Salbutamol spray 100mcg - 1 frasco',
                        '   - Fazer 2 jatos SN (máx 6/6h)',
                        '',
                        '# CORTICOIDE',
                        '2. Prednisolona 20mg - 15 comprimidos',
                        '   - Tomar 2-3 cp pela manhã por 5 dias',
                        '',
                        '# ENCAMINHAR PNEUMOLOGIA para:',
                        '- Definir tratamento de manutenção',
                        '- Corticoide inalatório + LABA'
                    ]
                }
            ]
        },
        {
            id: 'dpoc',
            categoria: 'respiratorio',
            nome: 'DPOC Exacerbado',
            tags: ['dpoc', 'enfisema', 'bronquite crônica', 'dispneia'],
            ambiente: 'hospitalar',
            prescricoes: [
                {
                    titulo: 'DPOC Exacerbado - Tratamento PS',
                    tipo: 'hospitalar',
                    itens: [
                        '# BRONCODILATADORES',
                        '1. Salbutamol spray 100mcg/jato',
                        '   - 4-8 jatos 20/20 min na 1ª hora',
                        '',
                        '2. Ipratrópio spray 25mcg/jato',
                        '   - 4-8 jatos 20/20 min na 1ª hora',
                        '',
                        '# CORTICOIDE',
                        '3. Prednisolona 20mg',
                        '   - Tomar 2 cp (40mg) 1x/dia por 5-7 dias',
                        '',
                        '# ANTIBIÓTICO (se indicado)',
                        '4. Amoxicilina + Clavulanato 875/125mg',
                        '   - 1 cp 12/12h por 5-7 dias',
                        '',
                        '# O2 SUPLEMENTAR',
                        '- Alvo: SatO2 88-92%'
                    ]
                },
                {
                    titulo: 'DPOC - Alta Hospitalar',
                    tipo: 'alta',
                    itens: [
                        '# BRONCODILATADORES',
                        '1. Salbutamol spray 100mcg - 1 frasco',
                        '   - Fazer 2 jatos 4/4h ou 6/6h por 7 dias',
                        '',
                        '2. Ipratrópio spray 25mcg - 1 frasco',
                        '   - Fazer 2 jatos 6/6h por 7 dias',
                        '',
                        '# CORTICOIDE',
                        '3. Prednisolona 20mg - 14 comprimidos',
                        '   - Tomar 2 cp pela manhã por 7 dias',
                        '',
                        '# ANTIBIÓTICO',
                        '4. Amoxicilina + Clavulanato 875/125mg - 14 cp',
                        '   - Tomar 1 cp 12/12h por 7 dias',
                        '',
                        'OU',
                        '',
                        '   Azitromicina 500mg - 5 comprimidos',
                        '   - Tomar 1 cp 1x/dia por 5 dias'
                    ]
                }
            ]
        },
        {
            id: 'pneumonia',
            categoria: 'respiratorio',
            nome: 'Pneumonia Adquirida na Comunidade',
            tags: ['pneumonia', 'pac', 'infecção pulmonar', 'tosse'],
            ambiente: 'ambulatorial',
            prescricoes: [
                {
                    titulo: 'PAC - Ambulatorial (sem comorbidades)',
                    tipo: 'alta',
                    itens: [
                        '1. Amoxicilina + Clavulanato 875/125mg - 14 cp',
                        '   - Tomar 1 cp 12/12h por 7 dias',
                        '',
                        'OU',
                        '',
                        '2. Azitromicina 500mg - 5 comprimidos',
                        '   - Tomar 1 cp 1x/dia por 5 dias',
                        '',
                        '# SINTOMÁTICOS',
                        '3. Dipirona 1g - 20 comprimidos',
                        '   - Tomar 1 cp 6/6h se dor ou febre'
                    ]
                },
                {
                    titulo: 'PAC - Ambulatorial (com comorbidades ou ATB recente)',
                    tipo: 'alta',
                    itens: [
                        '# BETALACTÂMICO + MACROLÍDEO',
                        '1. Amoxicilina + Clavulanato 875/125mg - 14 cp',
                        '   - Tomar 1 cp 12/12h por 7 dias',
                        '',
                        '+',
                        '',
                        '2. Azitromicina 500mg - 7 comprimidos',
                        '   - Tomar 1 cp 1x/dia por 7 dias',
                        '',
                        'OU',
                        '',
                        '# QUINOLONA RESPIRATÓRIA',
                        '3. Levofloxacino 750mg - 7 comprimidos',
                        '   - Tomar 1 cp 1x/dia por 7 dias'
                    ]
                },
                {
                    titulo: 'PAC - Internação Hospitalar',
                    tipo: 'hospitalar',
                    itens: [
                        '# BETALACTÂMICO + MACROLÍDEO',
                        '1. Ceftriaxona 1g',
                        '   - Fazer 1g IV 1x/dia',
                        '',
                        '+',
                        '',
                        '2. Azitromicina 500mg',
                        '   - 500mg IV 1x/dia',
                        '',
                        'OU',
                        '',
                        '# QUINOLONA RESPIRATÓRIA',
                        '3. Levofloxacino 750mg',
                        '   - 750mg IV 1x/dia'
                    ]
                }
            ]
        },
        {
            id: 'tvp_tep',
            categoria: 'respiratorio',
            nome: 'TVP e TEP',
            tags: ['trombose', 'embolia', 'tvp', 'tep', 'anticoagulação'],
            ambiente: 'hospitalar',
            prescricoes: [
                {
                    titulo: 'TVP/TEP - Profilaxia',
                    tipo: 'hospitalar',
                    itens: [
                        '1. Enoxaparina 40mg - seringa',
                        '   - Aplicar 1 seringa SC 1x/dia',
                        '',
                        'OU',
                        '',
                        '   0,5 mg/kg SC 1x/dia'
                    ]
                },
                {
                    titulo: 'TVP/TEP - Tratamento Hospitalar',
                    tipo: 'hospitalar',
                    itens: [
                        '# ENOXAPARINA',
                        '1. Enoxaparina 60-80mg - seringas',
                        '   - Aplicar 1mg/kg SC 12/12h',
                        '   - >75 anos: 0,75mg/kg 12/12h',
                        '   - ClCr <30: dose reduzida',
                        '',
                        'OU',
                        '',
                        '# HNF (se instabilidade ou ClCr muito baixo)',
                        '2. Heparina 25.000 UI/5ml',
                        '   - Diluir 5ml + 245ml SF 0,9%',
                        '   - Ataque: 80 UI/kg IV',
                        '   - Manutenção: 18 UI/kg/h BIC',
                        '   - Controle pelo PTTa (1,5-2x)'
                    ]
                },
                {
                    titulo: 'TVP/TEP - Alta Hospitalar',
                    tipo: 'alta',
                    itens: [
                        '# DOAC (preferencial)',
                        '1. Rivaroxabana 15mg - 42 comprimidos',
                        '   - Tomar 1 cp 12/12h por 3 semanas',
                        '   - Após: Rivaroxabana 20mg 1x/dia por ≥3 meses',
                        '',
                        'OU',
                        '',
                        '# VARFARINA',
                        '2. Varfarina 5mg - uso contínuo',
                        '   - Ajustar dose para INR 2-3',
                        '   - Iniciar junto com heparina',
                        '',
                        '⚠️ Mínimo 3 meses de anticoagulação',
                        '⚠️ Avaliar etiologia e tempo total'
                    ]
                }
            ]
        },

        // ==================== GASTROINTESTINAL ====================
        {
            id: 'diarreia',
            categoria: 'gastrointestinal',
            nome: 'Diarreia Aguda',
            tags: ['diarreia', 'gastroenterite', 'diarreia infecciosa'],
            ambiente: 'ambulatorial',
            prescricoes: [
                {
                    titulo: 'Diarreia Não Infecciosa',
                    tipo: 'alta',
                    itens: [
                        '# PROBIÓTICO',
                        '1. Floratil 200mg - 12 cápsulas',
                        '   - Tomar 1 cp 12/12h por 3-5 dias',
                        '',
                        '# ANTIDIARREICO',
                        '2. Racecadotrila (Tiorfan) 100mg - 20 cp',
                        '   - Tomar 1 cp 8/8h enquanto diarreia',
                        '   - Dose máx: 400mg/dia',
                        '',
                        '# HIDRATAÇÃO',
                        '3. Sais para Reidratação Oral (Rehidrat)',
                        '   - Diluir 1 envelope em 500ml água',
                        '   - Beber durante o dia',
                        '',
                        '⚠️ Suspender cafeína, leite, alimentos gordurosos'
                    ]
                },
                {
                    titulo: 'Diarreia Infecciosa',
                    tipo: 'alta',
                    itens: [
                        '# ANTIBIÓTICO',
                        '1. Ciprofloxacino 500mg - 10 comprimidos',
                        '   - Tomar 1 cp 12/12h por 5 dias',
                        '',
                        '+',
                        '',
                        '2. Metronidazol 400mg - 21 comprimidos',
                        '   - Tomar 1 cp 8/8h por 7 dias',
                        '',
                        '+ Medidas de suporte (hidratação, probiótico)'
                    ]
                }
            ]
        },
        {
            id: 'hda',
            categoria: 'gastrointestinal',
            nome: 'Hemorragia Digestiva Alta',
            tags: ['hda', 'sangramento', 'melena', 'hematêmese'],
            ambiente: 'hospitalar',
            prescricoes: [
                {
                    titulo: 'HDA Não Varicosa',
                    tipo: 'emergencia',
                    itens: [
                        '# ESTABILIZAÇÃO HEMODINÂMICA',
                        '1. Acesso venoso calibroso (2 acessos)',
                        '2. Cristaloide (SF ou RL) conforme necessidade',
                        '3. Tipagem + reserva de hemácias',
                        '',
                        '# IBP',
                        '4. Omeprazol 40mg - ampola',
                        '   - Fazer 1 amp IV 12/12h',
                        '',
                        '# ANTIEMÉTICO',
                        '5. Ondansetrona 4mg - ampola',
                        '   - Diluir em 100ml SF, correr em 20 min 8/8h',
                        '',
                        '⚠️ EDA nas primeiras 24h'
                    ]
                },
                {
                    titulo: 'HDA Varicosa',
                    tipo: 'emergencia',
                    itens: [
                        '# ESTABILIZAÇÃO + MEDIDAS HDA NÃO VARICOSA',
                        '',
                        '# VASOATIVO',
                        '1. Terlipressina 1mg/ml',
                        '   - Ataque: 2mg (2 amp) IV bolus',
                        '   - Manutenção: 1mg 4/4h IV',
                        '',
                        'OU',
                        '',
                        '2. Octreotide 0,5mg/ml',
                        '   - Diluir 1 amp + 250ml SF 0,9%',
                        '   - Bolus: 50mcg IV',
                        '   - Manutenção: 50 mcg/h BIC',
                        '',
                        '# PROFILAXIA PBE',
                        '3. Ceftriaxona 1g IV 1x/dia por 7 dias',
                        '',
                        '# PROFILAXIA ENCEFALOPATIA',
                        '4. Lactulose 20-40ml 12/12h (ajustar para 2-3 evacuações)'
                    ]
                }
            ]
        },
        {
            id: 'pancreatite',
            categoria: 'gastrointestinal',
            nome: 'Pancreatite Aguda',
            tags: ['pancreatite', 'dor abdominal', 'amilase', 'lipase'],
            ambiente: 'hospitalar',
            prescricoes: [
                {
                    titulo: 'Pancreatite Aguda - Tratamento',
                    tipo: 'hospitalar',
                    itens: [
                        '# DIETA',
                        '1. Dieta suspensa nas primeiras 48h',
                        '',
                        '# HIDRATAÇÃO',
                        '2. SF 0,9% ou Ringer Lactato',
                        '   - 3 ml/kg/h por 8-12h',
                        '   - Se hipotensão: 20-30 ml/kg em 30 min',
                        '',
                        '# ANALGESIA',
                        '3. Dipirona 1g/2ml - 1 amp IV 6/6h',
                        '',
                        '4. Tramadol 100mg/2ml',
                        '   - Diluir 1 amp + 100ml SF',
                        '   - Correr IV em 30 min 8/8h',
                        '',
                        '5. Morfina 10mg/ml (se refratário)',
                        '   - Diluir 1 amp + 9ml AD',
                        '   - Fazer 4-5ml IV 6/6h',
                        '',
                        '# ANTIEMÉTICO',
                        '6. Ondansetrona 4mg IV 8/8h',
                        '',
                        '# PROFILAXIA TVP',
                        '7. Enoxaparina 40mg SC 1x/dia'
                    ]
                }
            ]
        },
        {
            id: 'drge',
            categoria: 'gastrointestinal',
            nome: 'Refluxo Gastroesofágico',
            tags: ['drge', 'azia', 'pirose', 'refluxo'],
            ambiente: 'ambulatorial',
            prescricoes: [
                {
                    titulo: 'DRGE - Tratamento Empírico (4-12 semanas)',
                    tipo: 'alta',
                    itens: [
                        '# IBP',
                        '1. Omeprazol 20mg - 60 comprimidos',
                        '   - Tomar 1 cp em jejum, 30 min antes do café',
                        '   - Se necessário: 20mg 12/12h',
                        '',
                        'OU',
                        '',
                        '2. Esomeprazol 40mg - 30 comprimidos',
                        '   - Tomar 1 cp em jejum 1x/dia',
                        '',
                        '# PROCINÉTICO',
                        '3. Domperidona 10mg - 30 comprimidos',
                        '   - Tomar 1 cp 8/8h antes das refeições',
                        '',
                        '# ORIENTAÇÕES:',
                        '- Elevar cabeceira da cama',
                        '- Não comer antes de dormir',
                        '- Evitar: chocolate, café, condimentos, gorduras',
                        '- Perda de peso se indicado',
                        '- Cessar tabagismo'
                    ]
                }
            ]
        },

        // ==================== INFECÇÕES ====================
        {
            id: 'itu',
            categoria: 'geniturinario',
            nome: 'Infecção do Trato Urinário',
            tags: ['itu', 'cistite', 'pielonefrite', 'disúria'],
            ambiente: 'ambulatorial',
            prescricoes: [
                {
                    titulo: 'Cistite (ITU Baixa)',
                    tipo: 'alta',
                    itens: [
                        '# 1ª LINHA',
                        '1. Nitrofurantoína 100mg - 28 comprimidos',
                        '   - Tomar 1 cp 6/6h por 7 dias',
                        '',
                        'OU',
                        '',
                        '2. Fosfomicina 3g - 1 envelope (Monouril)',
                        '   - Tomar 1 envelope dose única, ao deitar',
                        '',
                        '# ALTERNATIVAS',
                        '3. Sulfametoxazol + Trimetoprima 800/160mg - 10 cp',
                        '   - Tomar 1 cp 12/12h por 3-5 dias',
                        '',
                        '4. Ciprofloxacino 500mg - 10 comprimidos',
                        '   - Tomar 1 cp 12/12h por 5 dias',
                        '',
                        '# SE DISÚRIA',
                        '5. Fenazopiridina 200mg - 12 comprimidos',
                        '   - Tomar 1 cp 8/8h por 2-3 dias'
                    ]
                },
                {
                    titulo: 'Pielonefrite (ITU Alta) - Ambulatorial',
                    tipo: 'alta',
                    itens: [
                        '1. Ciprofloxacino 500mg - 20 comprimidos',
                        '   - Tomar 1 cp 12/12h por 10 dias',
                        '',
                        'OU',
                        '',
                        '2. Levofloxacino 500mg - 10 comprimidos',
                        '   - Tomar 1 cp 1x/dia por 10 dias',
                        '',
                        '+ Analgésicos, hidratação, antipiréticos'
                    ]
                },
                {
                    titulo: 'Pielonefrite - Internação',
                    tipo: 'hospitalar',
                    itens: [
                        '# SEM SEPSE',
                        '1. Ciprofloxacino 400mg/200ml',
                        '   - 1 bolsa IV 12/12h por 10-14 dias',
                        '',
                        'OU',
                        '',
                        '2. Ceftriaxona 1g',
                        '   - 1g IV 1x/dia por 10-14 dias',
                        '',
                        '# COM SEPSE',
                        '3. Piperacilina + Tazobactam 4g/500mg',
                        '   - IV 8/8h por 10-14 dias',
                        '',
                        'OU',
                        '',
                        '4. Meropenem 1g',
                        '   - 1 amp IV 8/8h por 10-14 dias'
                    ]
                }
            ]
        },
        {
            id: 'celulite',
            categoria: 'infeccoes',
            nome: 'Celulite / Erisipela',
            tags: ['celulite', 'erisipela', 'pele', 'infecção de pele'],
            ambiente: 'ambulatorial',
            prescricoes: [
                {
                    titulo: 'Celulite/Erisipela - Leve (ambulatorial)',
                    tipo: 'alta',
                    itens: [
                        '1. Cefalexina 500mg - 28 comprimidos',
                        '   - Tomar 1 cp 6/6h por 7-10 dias',
                        '',
                        'OU (se alergia)',
                        '',
                        '2. Clindamicina 300mg - 28 comprimidos',
                        '   - Tomar 1 cp 6/6h por 7-10 dias',
                        '',
                        '# ORIENTAÇÕES:',
                        '- Elevar membro afetado',
                        '- Compressas mornas',
                        '- Retorno se piora'
                    ]
                },
                {
                    titulo: 'Celulite/Erisipela - Grave (hospitalar)',
                    tipo: 'hospitalar',
                    itens: [
                        '# 1ª LINHA',
                        '1. Oxacilina 500mg pó',
                        '   - 1-2g IV 4-6h',
                        '',
                        '# ALTERNATIVA',
                        '2. Ceftriaxona 1g',
                        '   - 1-2g IV 1x/dia',
                        '',
                        '# SE MRSA SUSPEITO',
                        '3. Vancomicina 500mg ou 1g',
                        '   - 30mg/kg/dia dividido 12/12h'
                    ]
                }
            ]
        },
        {
            id: 'sifilis',
            categoria: 'infeccoes',
            nome: 'Sífilis',
            tags: ['sífilis', 'ist', 'vdrl', 'fta-abs'],
            ambiente: 'ambulatorial',
            prescricoes: [
                {
                    titulo: 'Sífilis Recente (1ª, 2ª, Latente <1 ano)',
                    tipo: 'alta',
                    itens: [
                        '1. Penicilina Benzatina 1.200.000 UI - 2 ampolas',
                        '   - Aplicar 1 amp em cada glúteo, IM, dose única',
                        '   - Total: 2.400.000 UI'
                    ]
                },
                {
                    titulo: 'Sífilis Tardia (3ª, Latente >1 ano)',
                    tipo: 'alta',
                    itens: [
                        '1. Penicilina Benzatina 1.200.000 UI - 6 ampolas',
                        '   - Aplicar 1 amp em cada glúteo, IM, 1x/semana',
                        '   - Por 3 semanas consecutivas',
                        '   - Total: 7.200.000 UI'
                    ]
                }
            ]
        },

        // ==================== DOR E ANALGESIA ====================
        {
            id: 'dor_leve',
            categoria: 'dor',
            nome: 'Dor Leve a Moderada',
            tags: ['dor', 'analgesia', 'analgésico'],
            ambiente: 'ambulatorial',
            prescricoes: [
                {
                    titulo: 'Analgésicos - PS (IV)',
                    tipo: 'hospitalar',
                    itens: [
                        '# ANALGÉSICO SIMPLES',
                        '1. Dipirona 1g/2ml',
                        '   - Fazer 1 amp IV bolus lento 6/6h',
                        '',
                        '# AINE',
                        '2. Cetoprofeno 100mg/2ml',
                        '   - Diluir 1 amp + 100ml SF 0,9%',
                        '   - Correr IV em 20 min (máx 300mg/dia)',
                        '',
                        '3. Cetorolaco 30mg/ml',
                        '   - <65 anos: 30mg IV bolus lento',
                        '   - >65 anos: 15mg IV bolus lento'
                    ]
                },
                {
                    titulo: 'Analgésicos - Alta (VO)',
                    tipo: 'alta',
                    itens: [
                        '# ANALGÉSICOS SIMPLES',
                        '1. Dipirona 1g - 20 comprimidos',
                        '   - Tomar 1 cp 6/6h se dor',
                        '',
                        '2. Paracetamol 750mg - 20 comprimidos',
                        '   - Tomar 1 cp 6/6h se dor (máx 4g/dia)',
                        '',
                        '# AINEs',
                        '3. Ibuprofeno 600mg - 20 comprimidos',
                        '   - Tomar 1 cp 8/8h se dor',
                        '',
                        '4. Naproxeno 500mg - 20 comprimidos',
                        '   - Tomar 1 cp 12/12h se dor',
                        '',
                        '5. Nimesulida 100mg - 12 comprimidos',
                        '   - Tomar 1 cp 12/12h por até 5 dias'
                    ]
                }
            ]
        },
        {
            id: 'dor_intensa',
            categoria: 'dor',
            nome: 'Dor Intensa / Opioides',
            tags: ['dor', 'opioide', 'morfina', 'tramadol'],
            ambiente: 'hospitalar',
            prescricoes: [
                {
                    titulo: 'Opioides - PS (IV)',
                    tipo: 'hospitalar',
                    itens: [
                        '# OPIOIDE FRACO',
                        '1. Tramadol 100mg/2ml',
                        '   - Diluir 1 amp + 100ml SF 0,9%',
                        '   - Correr IV lento (máx 400mg/dia)',
                        '',
                        '# OPIOIDE FORTE',
                        '2. Morfina 10mg/ml',
                        '   - Diluir 1 amp em 9ml AD (1mg/ml)',
                        '   - Fazer 2-4ml (2-4mg) IV lento',
                        '   - Repetir 15-30 min SN',
                        '   ⚠️ Cuidado: hipotensão, depressão respiratória'
                    ]
                },
                {
                    titulo: 'Opioides - Alta (VO)',
                    tipo: 'alta',
                    itens: [
                        '# OPIOIDE FRACO',
                        '1. Tramadol 50mg - 20 cápsulas',
                        '   - Tomar 1 cp 8/8h ou 6/6h se dor',
                        '',
                        '2. Codeína 30mg - 20 comprimidos',
                        '   - Tomar 1 cp 6/6h se dor',
                        '',
                        '# ASSOCIAÇÕES',
                        '3. Paracetamol + Codeína 500/30mg - 20 cp',
                        '   - Tomar 1-2 cp 6/6h se dor',
                        '',
                        '4. Paracetamol + Tramadol 325/37,5mg - 20 cp',
                        '   - Tomar 1-2 cp 6/6h se dor',
                        '',
                        '⚠️ Orientar sobre constipação',
                        '⚠️ Não dirigir durante uso'
                    ]
                }
            ]
        },
        {
            id: 'colica_renal',
            categoria: 'dor',
            nome: 'Cólica Nefrética',
            tags: ['cólica renal', 'litíase', 'cálculo renal', 'ureterolitíase'],
            ambiente: 'hospitalar',
            prescricoes: [
                {
                    titulo: 'Cólica Renal - Tratamento PS',
                    tipo: 'hospitalar',
                    itens: [
                        '# AINE',
                        '1. Cetoprofeno 100mg/2ml',
                        '   - Diluir 1 amp + 100ml SF 0,9%',
                        '   - Correr IV em 20 min',
                        '',
                        '# ANALGÉSICO',
                        '2. Dipirona 1g/2ml',
                        '   - Fazer 1 amp IV bolus lento',
                        '',
                        '# SE REFRATÁRIO',
                        '3. Morfina 10mg/ml',
                        '   - Diluir 1 amp + 9ml AD',
                        '   - Fazer 4-5ml IV',
                        '',
                        '# ANTIEMÉTICO',
                        '4. Ondansetrona 4mg',
                        '   - Diluir + 100ml SF, correr em 20 min'
                    ]
                },
                {
                    titulo: 'Cólica Renal - Alta',
                    tipo: 'alta',
                    itens: [
                        '# ANALGESIA',
                        '1. Dipirona 1g - 20 comprimidos',
                        '   - Tomar 1 cp 6/6h se dor',
                        '',
                        '2. Diclofenaco 50mg - 10 comprimidos',
                        '   - Tomar 1 cp 12/12h por até 5 dias',
                        '',
                        '# ALFA-BLOQUEADOR (expulsão cálculo)',
                        '3. Tansulosina 0,4mg - 10 cápsulas',
                        '   - Tomar 1 cp à noite por até 10 dias',
                        '',
                        'OU',
                        '',
                        '4. Nifedipino 10mg - 30 comprimidos',
                        '   - Tomar 1 cp 8/8h por 10 dias',
                        '',
                        '⚠️ Retorno se: febre, dor refratária, obstrução',
                        '⚠️ Cálculos >10mm: avaliar procedimento'
                    ]
                }
            ]
        },
        {
            id: 'lombalgia',
            categoria: 'dor',
            nome: 'Lombalgia Mecânica / Torcicolo',
            tags: ['lombalgia', 'dor lombar', 'torcicolo', 'cervicalgia'],
            ambiente: 'ambulatorial',
            prescricoes: [
                {
                    titulo: 'Lombalgia/Torcicolo - PS',
                    tipo: 'hospitalar',
                    itens: [
                        '1. Cetoprofeno 100mg/2ml',
                        '   - Diluir 1 amp + 100ml SF, correr em 20 min',
                        '',
                        '2. Dipirona 1g/2ml',
                        '   - Fazer 1 amp IV bolus lento',
                        '',
                        '3. Tramadol 100mg/2ml (se dor intensa)',
                        '   - Diluir 1 amp + 100ml SF, correr em 30 min'
                    ]
                },
                {
                    titulo: 'Lombalgia/Torcicolo - Alta',
                    tipo: 'alta',
                    itens: [
                        '# RELAXANTE MUSCULAR',
                        '1. Ciclobenzaprina 10mg - 10 comprimidos',
                        '   - Tomar 1 cp 12/12h por 5 dias',
                        '',
                        '# AINE',
                        '2. Cetoprofeno 150mg - 10 comprimidos',
                        '   - Tomar 1 cp 12/12h por até 5 dias',
                        '',
                        'OU',
                        '',
                        '3. Ibuprofeno 600mg - 15 comprimidos',
                        '   - Tomar 1 cp 8/8h por até 5 dias',
                        '',
                        '# ANALGÉSICO',
                        '4. Dipirona 1g - 20 comprimidos',
                        '   - Tomar 1 cp 6/6h se dor',
                        '',
                        '# ASSOCIAÇÃO (se necessário)',
                        '5. Torsilax/Tandrilax (Paracetamol + Cafeína + ',
                        '   Carisoprodol + Diclofenaco)',
                        '   - Tomar 1 cp 8/8h ou 12/12h por até 7 dias',
                        '',
                        '# ORIENTAÇÕES:',
                        '- Aplicar calor local 8/8h',
                        '- Repouso relativo',
                        '- Evitar fator de piora'
                    ]
                }
            ]
        },

        // ==================== PSIQUIATRIA ====================
        {
            id: 'agitacao',
            categoria: 'psiquiatria',
            nome: 'Agitação Psicomotora',
            tags: ['agitação', 'psicose', 'contenção'],
            ambiente: 'hospitalar',
            prescricoes: [
                {
                    titulo: 'Agitação - Paciente Colaborativo',
                    tipo: 'hospitalar',
                    itens: [
                        '1. Clorpromazina 25mg - VO',
                        '   - Tomar 1 cp, repetir 30/30 min até tranquilização',
                        '   - Dose máx: 2g/dia'
                    ]
                },
                {
                    titulo: 'Agitação - Não Colaborativo (Contenção Química)',
                    tipo: 'emergencia',
                    itens: [
                        '# ESQUEMA PADRÃO',
                        '1. Haloperidol (5mg/ml) - 1 amp IM',
                        '   - Fazer 0,2-0,8 ml (1-4mg) IM',
                        '',
                        '+',
                        '',
                        '2. Midazolam (15mg/3ml) - 1/2 amp IM',
                        '   - Fazer 0,5 amp (7,5mg) IM',
                        '',
                        'OU',
                        '',
                        '3. Prometazina (50mg/2ml) - 1 amp IM',
                        '   - Fazer 1 amp IM',
                        '   - Pode repetir 30/30 min até 3x'
                    ]
                }
            ]
        },
        {
            id: 'ansiedade',
            categoria: 'psiquiatria',
            nome: 'Ansiedade Aguda / Crise de Pânico',
            tags: ['ansiedade', 'pânico', 'crise'],
            ambiente: 'hospitalar',
            prescricoes: [
                {
                    titulo: 'Ansiedade/Pânico - Tratamento PS',
                    tipo: 'hospitalar',
                    itens: [
                        '# BENZODIAZEPÍNICO',
                        '1. Diazepam 10mg - VO ou IV',
                        '   - Tomar 1 cp VO ou 1 amp IV lento',
                        '',
                        'OU',
                        '',
                        '2. Clonazepam 2mg - sublingual',
                        '   - Tomar 1 cp SL',
                        '',
                        '# SE SINTOMAS FÍSICOS INTENSOS',
                        '3. Propranolol 40mg - VO',
                        '   - Tomar 1 cp VO'
                    ]
                },
                {
                    titulo: 'Ansiedade - Alta',
                    tipo: 'alta',
                    itens: [
                        '# BENZODIAZEPÍNICO (curto prazo)',
                        '1. Clonazepam 0,5mg - 20 comprimidos',
                        '   - Tomar 1 cp SL em caso de crise',
                        '   - Máx 2mg/dia',
                        '',
                        '⚠️ Encaminhar para Psiquiatria para:',
                        '- Avaliação diagnóstica',
                        '- Iniciar tratamento com ISRS se indicado'
                    ]
                }
            ]
        },

        // ==================== HIDROELETROLÍTICO ====================
        {
            id: 'hipocalemia',
            categoria: 'hidroeletrolitico',
            nome: 'Hipocalemia',
            tags: ['potássio', 'hipocalemia', 'hipopotassemia'],
            ambiente: 'hospitalar',
            prescricoes: [
                {
                    titulo: 'Hipocalemia - Reposição IV',
                    tipo: 'hospitalar',
                    itens: [
                        '# K+ 3,0-3,4 mEq/L (leve)',
                        '1. KCl 19,1% (2,56 mEq/ml)',
                        '   - 20-40 mEq + SF 500ml',
                        '   - Correr em 4-6h (máx 10 mEq/h)',
                        '',
                        '# K+ 2,5-2,9 mEq/L (moderada)',
                        '2. KCl 19,1%',
                        '   - 40-60 mEq + SF 500-1000ml',
                        '   - Correr em 4-6h',
                        '',
                        '# K+ <2,5 mEq/L (grave)',
                        '3. KCl 19,1%',
                        '   - 10-20 mEq + SF 100ml',
                        '   - Correr em 1h (acesso central preferível)',
                        '   - Monitorização contínua',
                        '',
                        '⚠️ Máx 40 mEq/L em veia periférica',
                        '⚠️ Máx 20 mEq/h em reposição',
                        '⚠️ Corrigir hipomagnesemia associada'
                    ]
                },
                {
                    titulo: 'Hipocalemia - Reposição VO',
                    tipo: 'alta',
                    itens: [
                        '1. KCl xarope 6% (0,8 mEq/ml) - 1 frasco',
                        '   - Tomar 15-20ml 8/8h (diluir em suco)',
                        '',
                        'OU',
                        '',
                        '2. Slow-K (KCl 600mg = 8 mEq) - 30 cp',
                        '   - Tomar 1-2 cp 8/8h'
                    ]
                }
            ]
        },
        {
            id: 'hipercalemia',
            categoria: 'hidroeletrolitico',
            nome: 'Hipercalemia',
            tags: ['potássio', 'hipercalemia', 'hiperpotassemia'],
            ambiente: 'hospitalar',
            prescricoes: [
                {
                    titulo: 'Hipercalemia - Tratamento',
                    tipo: 'emergencia',
                    itens: [
                        '# ESTABILIZAÇÃO DE MEMBRANA',
                        '1. Gluconato de Cálcio 10% (10ml)',
                        '   - Fazer 1 amp IV em 2-3 min',
                        '   - Repetir em 5 min se ECG mantém alterações',
                        '',
                        '# SHIFT INTRACELULAR',
                        '2. Insulina Regular 10 UI + SG 50% 100ml',
                        '   - IV em 30-60 min',
                        '',
                        '3. Nebulização com Fenoterol',
                        '   - 10-20 gotas + 3ml SF NBZ',
                        '',
                        '4. Bicarbonato de Sódio 8,4%',
                        '   - 50-100 mEq IV (se acidose)',
                        '',
                        '# ELIMINAÇÃO',
                        '5. Furosemida 40-80mg IV',
                        '',
                        '6. Sorcal (Poliestirenossulfonato de Ca) 30g',
                        '   - VO ou enema',
                        '',
                        '⚠️ Diálise se refratário ou grave'
                    ]
                }
            ]
        },

        // ==================== EMERGÊNCIA ====================
        {
            id: 'anafilaxia',
            categoria: 'emergencia',
            nome: 'Anafilaxia / Choque Anafilático',
            tags: ['anafilaxia', 'alergia', 'choque', 'adrenalina'],
            ambiente: 'hospitalar',
            prescricoes: [
                {
                    titulo: 'Anafilaxia - Tratamento',
                    tipo: 'emergencia',
                    itens: [
                        '⚠️ AFASTAR AGENTE CAUSAL!',
                        '⚠️ MOV: O2 máscara + 2 acessos venosos',
                        '',
                        '# 1ª LINHA - ADRENALINA IM',
                        '1. Adrenalina 1mg/ml',
                        '   - Fazer 0,3-0,5ml (0,3-0,5mg) IM',
                        '   - Aplicar na face lateral da coxa',
                        '   - Pode repetir a cada 5-15 min',
                        '',
                        '# REPOSIÇÃO VOLÊMICA',
                        '2. SF 0,9% ou Ringer Lactato',
                        '   - 20-40 ml/kg IV rápido',
                        '',
                        '# ANTI-HISTAMÍNICO',
                        '3. Difenidramina ou Prometazina 50mg IM/IV',
                        '',
                        '# CORTICOIDE',
                        '4. Hidrocortisona 100-500mg IV',
                        '',
                        '# SE BRONCOESPASMO',
                        '5. Fenoterol 10-20 gotas + Ipratrópio 20-40 gotas',
                        '   + 4ml SF NBZ',
                        '',
                        '# SE IRPA: IOT'
                    ]
                },
                {
                    titulo: 'Alergia/Urticária - Tratamento',
                    tipo: 'alta',
                    itens: [
                        '# ANTI-HISTAMÍNICO 2ª GERAÇÃO (1ª linha)',
                        '1. Loratadina 10mg - 10 comprimidos',
                        '   - Tomar 1 cp 1x/dia',
                        '',
                        'OU',
                        '',
                        '2. Levocetirizina 5mg - 10 comprimidos',
                        '   - Tomar 1 cp 1x/dia',
                        '',
                        '# ANTI-HISTAMÍNICO 1ª GERAÇÃO (prurido intenso)',
                        '3. Dexclorfeniramina 2mg - 20 comprimidos',
                        '   - Tomar 1 cp 8/8h',
                        '',
                        '# CORTICOIDE (se grave)',
                        '4. Prednisona 20mg - 15 comprimidos',
                        '   - Tomar 2 cp 1x/dia por 5-7 dias'
                    ]
                }
            ]
        },
        {
            id: 'cad_ehh',
            categoria: 'endocrino',
            nome: 'Cetoacidose Diabética / EHH',
            tags: ['cad', 'cetoacidose', 'ehh', 'diabetes', 'hiperglicemia'],
            ambiente: 'hospitalar',
            prescricoes: [
                {
                    titulo: 'CAD/EHH - Tratamento',
                    tipo: 'emergencia',
                    itens: [
                        '# HIDRATAÇÃO',
                        '1. SF 0,9%',
                        '   - 15-20 ml/kg na 1ª hora',
                        '   - Após: 100 ml/kg em 48h',
                        '   - Se Na >150: usar SF 0,45%',
                        '',
                        '# INSULINA (se K >3,3)',
                        '2. Insulina Regular 100 UI/ml',
                        '   - Diluir 1ml + 99ml SF 0,9% (1 UI/ml)',
                        '   - Ataque: 0,1-0,15 UI/kg IV bolus',
                        '   - Manutenção: 0,1 UI/kg/h BIC',
                        '',
                        '# MONITORIZAÇÃO',
                        '- HGT 1/1h',
                        '- Queda ideal: 50-70 mg/dL/h',
                        '- Se HGT <200-250: reduzir BIC + adicionar SG 5%',
                        '',
                        '# REPOSIÇÃO DE POTÁSSIO',
                        '- K <3,3: repor antes da insulina (10-30 mEq KCl)',
                        '- K 3,3-5,2: repor junto (10-20 mEq KCl)',
                        '- K >5,3: não repor, monitorar',
                        '',
                        '# CRITÉRIOS RESOLUÇÃO CAD:',
                        '- Glicemia <200 + pH >7,3 + HCO3 >18 + AG <12'
                    ]
                }
            ]
        }
    ]
};

// Componente Alpine.js para a página de prescrições
document.addEventListener('alpine:init', () => {
    Alpine.data('prescricoesApp', () => ({
        db: PRESCRICOES_DB,
        searchTerm: '',
        selectedCategoria: null,
        selectedPrescricao: null,
        copied: false,
        copiedIndex: null,

        get categorias() {
            return this.db.categorias;
        },

        get prescricoesFiltradas() {
            let results = this.db.prescricoes;
            
            if (this.selectedCategoria) {
                results = results.filter(p => p.categoria === this.selectedCategoria);
            }
            
            if (this.searchTerm.length >= 2) {
                const term = this.searchTerm.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                results = results.filter(p => {
                    const nome = p.nome.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                    const tags = p.tags.join(' ').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                    return nome.includes(term) || tags.includes(term);
                });
            }
            
            return results;
        },

        getCategoria(id) {
            return this.db.categorias.find(c => c.id === id);
        },

        selectCategoria(id) {
            this.selectedCategoria = this.selectedCategoria === id ? null : id;
            this.selectedPrescricao = null;
        },

        selectPrescricao(prescricao) {
            this.selectedPrescricao = prescricao;
        },

        formatPrescricao(presc) {
            return presc.itens.join('\n');
        },

        copyPrescricao(presc, index) {
            const text = this.formatPrescricao(presc);
            navigator.clipboard.writeText(text).then(() => {
                this.copiedIndex = index;
                setTimeout(() => this.copiedIndex = null, 2000);
            });
        },

        getTipoColor(tipo) {
            const colors = {
                'hospitalar': 'bg-blue-100 text-blue-700 border-blue-200',
                'emergencia': 'bg-red-100 text-red-700 border-red-200',
                'alta': 'bg-green-100 text-green-700 border-green-200'
            };
            return colors[tipo] || 'bg-gray-100 text-gray-700';
        },

        getTipoLabel(tipo) {
            const labels = {
                'hospitalar': 'PS / Internação',
                'emergencia': 'Emergência',
                'alta': 'Alta / Ambulatorial'
            };
            return labels[tipo] || tipo;
        }
    }));
});

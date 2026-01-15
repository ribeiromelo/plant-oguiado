document.addEventListener('alpine:init', () => {
    Alpine.data('prescriptionApp', () => ({
        prescriptionType: 'simples',
        doctor: {
            name: '',
            crm: '',
            uf: '',
            address: ''
        },
        patient: {
            name: '',
            cpf: '',
            address: ''
        },
        date: new Date().toISOString().split('T')[0],
        medications: [],
        newMed: {
            name: '',
            quantity: '',
            instruction: ''
        },
        // Texto livre construído como array para evitar erros de quebra de linha
        freeTextTitle: 'Solicitação de Exames',
        freeTextContent: [
            'Solicito:',
            '',
            '1. Hemograma Completo',
            '2. Creatinina',
            '3. Ureia',
            '4. Sódio e Potássio',
            '5. Glicemia de Jejum',
            '6. TGO e TGP',
            '',
            'Indicação Clínica: Check-up de rotina.'
        ].join('\n'),
        
        printDouble: false,
        isPrinting: false,

        init() {
            try {
                const savedDoctor = localStorage.getItem('plantao_doctor');
                if (savedDoctor) {
                    const parsed = JSON.parse(savedDoctor);
                    if (parsed && typeof parsed === 'object') {
                        this.doctor = { ...this.doctor, ...parsed };
                    }
                }
            } catch (e) {
                console.error('Erro ao carregar dados do médico:', e);
                localStorage.removeItem('plantao_doctor');
            }
            
            // Watch for prescription type changes
            this.$watch('prescriptionType', (val) => {
                if (val === 'especial') {
                    this.printDouble = true;
                } else if (val === 'livre') {
                    this.printDouble = false;
                }
            });
        },

        setPrescriptionType(type) {
            this.prescriptionType = type;
            if (type === 'especial') this.printDouble = true;
            if (type === 'livre') {
                this.printDouble = false;
                // Se estiver vazio, garante o texto padrão
                if (!this.freeTextContent) {
                    this.freeTextContent = [
                        'Solicito:',
                        '',
                        '1. Hemograma Completo',
                        '2. Creatinina',
                        '3. Ureia',
                        '4. Sódio e Potássio',
                        '5. Glicemia de Jejum',
                        '6. TGO e TGP',
                        '',
                        'Indicação Clínica: Check-up de rotina.'
                    ].join('\n');
                }
            }
        },

        getDocTitle() {
            if (this.prescriptionType === 'especial') return 'Receituário de Controle Especial';
            if (this.prescriptionType === 'livre') return this.freeTextTitle;
            return 'Receituário Médico';
        },

        saveDoctor() {
            try {
                localStorage.setItem('plantao_doctor', JSON.stringify(this.doctor));
                alert('Dados do médico salvos com sucesso!');
            } catch (e) {
                alert('Erro ao salvar dados. Verifique se o navegador permite cookies/localStorage.');
            }
        },

        addMed() {
            if (!this.newMed.name) return;
            this.medications.push({...this.newMed});
            this.newMed = { name: '', quantity: '', instruction: '' };
        },

        removeMed(index) {
            this.medications.splice(index, 1);
        },

        formatDate(dateString) {
            if(!dateString) return '';
            const date = new Date(dateString);
            const userTimezoneOffset = date.getTimezoneOffset() * 60000;
            const offsetDate = new Date(date.getTime() + userTimezoneOffset);
            return offsetDate.toLocaleDateString('pt-BR');
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
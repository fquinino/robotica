/* ==========================================================================
   AULA 9 — OFICINA DO CARRO INTELIGENTE (SENSORES, PALMAS & DISPLAY)
   Experiência Gamificada, Tátil, Sonora & Visual ("Lego Magnético Maker")
   
   Desenvolvido como um jogo de montar com Web Audio API nativo,
   animações CSS táteis, microfone real (getUserMedia) e minigames interativos!
   ========================================================================== */

// ================= MOTOR DE ÁUDIO SINTETIZADO (WEB AUDIO API NATIVO) =================
class A9AudioEngine {
    constructor() {
        this.ctx = null;
        this.muted = false;
        this.buzzerOsc = null;
        this.buzzerGain = null;
        this.buzzerTimer = null;
        this.buzzerContinuousActive = false;
    }

    init() {
        if (!this.ctx) {
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            if (AudioContextClass) {
                this.ctx = new AudioContextClass();
            }
        }
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    setMuted(isMuted) {
        this.muted = isMuted;
        if (isMuted) {
            this.stopBuzzer();
        }
    }

    // 1. Som satisfatório de "Pop / Encaixe Magnético"
    playPop() {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;
        try {
            const now = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(320, now);
            osc.frequency.exponentialRampToValueAtTime(780, now + 0.08);

            gain.gain.setValueAtTime(0.4, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now);
            osc.stop(now + 0.1);
        } catch (e) {}
    }

    // 2. Som de Erro Divertido ("Pzzzzt!" Curto-Circuito / Fumacinha)
    playShortCircuit() {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;
        try {
            const now = this.ctx.currentTime;
            // Ruído dente de serra grave oscilante
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(90, now);
            osc.frequency.linearRampToValueAtTime(60, now + 0.25);

            gain.gain.setValueAtTime(0.35, now);
            gain.gain.linearRampToValueAtTime(0.001, now + 0.28);

            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now);
            osc.stop(now + 0.28);
        } catch (e) {}
    }

    // 3. Som Sintetizado de Bater Palmas (👏)
    playClap() {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;
        try {
            const bufferSize = Math.floor(this.ctx.sampleRate * 0.14);
            const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (this.ctx.sampleRate * 0.025));
            }
            const noise = this.ctx.createBufferSource();
            noise.buffer = buffer;

            const filter = this.ctx.createBiquadFilter();
            filter.type = 'bandpass';
            filter.frequency.value = 1100;
            filter.Q.value = 1.4;

            const gain = this.ctx.createGain();
            const now = this.ctx.currentTime;
            gain.gain.setValueAtTime(0.7, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

            noise.connect(filter);
            filter.connect(gain);
            gain.connect(this.ctx.destination);
            noise.start(now);
        } catch (e) {}
    }

    // 4. Som de Sucesso / Vitória Maker (Fanfarra Ascendente)
    playVictory() {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;
        try {
            const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
            const now = this.ctx.currentTime;
            notes.forEach((freq, idx) => {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.type = 'triangle';
                osc.frequency.value = freq;
                const startTime = now + idx * 0.09;
                gain.gain.setValueAtTime(0.3, startTime);
                gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.25);
                osc.connect(gain);
                gain.connect(this.ctx.destination);
                osc.start(startTime);
                osc.stop(startTime + 0.25);
            });
        } catch (e) {}
    }

    // 5. Motor de Som do Buzzer Automotivo (Bipes Espaçados ou Apito Contínuo)
    startBuzzerMode(mode, freq = 1000) {
        if (this.muted) {
            this.stopBuzzer();
            return;
        }
        this.init();
        if (!this.ctx) return;

        // Se modo seguro (sem som)
        if (mode === 'safe') {
            this.stopBuzzer();
            return;
        }

        // Se modo crítico (Apito Contínuo sem pausas!)
        if (mode === 'critical') {
            if (this.buzzerTimer) {
                clearInterval(this.buzzerTimer);
                this.buzzerTimer = null;
            }
            if (!this.buzzerContinuousActive) {
                this.stopBuzzer();
                try {
                    this.buzzerOsc = this.ctx.createOscillator();
                    this.buzzerGain = this.ctx.createGain();
                    this.buzzerOsc.type = 'square';
                    this.buzzerOsc.frequency.setValueAtTime(freq, this.ctx.currentTime);
                    this.buzzerGain.gain.setValueAtTime(0.25, this.ctx.currentTime);
                    this.buzzerOsc.connect(this.buzzerGain);
                    this.buzzerGain.connect(this.ctx.destination);
                    this.buzzerOsc.start();
                    this.buzzerContinuousActive = true;
                } catch (e) {}
            } else if (this.buzzerOsc) {
                this.buzzerOsc.frequency.setValueAtTime(freq, this.ctx.currentTime);
            }
            return;
        }

        // Se modo intermitente (Atenção = 600ms / Perigo = 200ms)
        this.stopBuzzer();
        const intervalMs = mode === 'warning' ? 600 : 200;
        const durationSec = mode === 'warning' ? 0.08 : 0.06;

        const triggerSingleBeep = () => {
            if (this.muted || !this.ctx) return;
            try {
                const now = this.ctx.currentTime;
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.type = 'square';
                osc.frequency.setValueAtTime(freq, now);
                gain.gain.setValueAtTime(0.2, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + durationSec);
                osc.connect(gain);
                gain.connect(this.ctx.destination);
                osc.start(now);
                osc.stop(now + durationSec);
            } catch (e) {}
        };

        triggerSingleBeep();
        this.buzzerTimer = setInterval(triggerSingleBeep, intervalMs);
    }

    stopBuzzer() {
        if (this.buzzerTimer) {
            clearInterval(this.buzzerTimer);
            this.buzzerTimer = null;
        }
        if (this.buzzerContinuousActive && this.buzzerOsc) {
            try {
                this.buzzerOsc.stop();
                this.buzzerOsc.disconnect();
            } catch (e) {}
            this.buzzerOsc = null;
            this.buzzerGain = null;
            this.buzzerContinuousActive = false;
        }
    }
}

const a9_audio = new A9AudioEngine();

// ================= ESTADO GLOBAL DA AULA 9 =================
// ================= ESTADO GLOBAL DA AULA 9 =================
const A9_STATE = {
    activeTab: 'assembly', // 'assembly', 'mission1', 'mission2', 'mission3'
    assemblyFilter: 'all', // 'all', 'power', 'sonar', 'sound', 'led', 'buzzer', 'lcd'
    isMuted: false,

    // Bancada de Montagem "Lego Magnético" Completa
    selectedTool: null, // item selecionado para encaixar
    connections: {
        // 1. Energia Principal da Protoboard
        vcc_power: false,       // 5V Arduino ➔ Trilha Vermelha (+)
        gnd_power: false,       // GND Arduino ➔ Trilha Azul (-)

        // 2. Olhos de Morcego (HC-SR04)
        sonar_module: false,    // Sensor HC-SR04 montado na protoboard
        sonar_vcc: false,       // Trilha (+) ➔ Pino VCC HC-SR04
        sonar_gnd: false,       // Trilha (-) ➔ Pino GND HC-SR04
        sonar_trig: false,      // D6 ➔ Pino Trig HC-SR04
        sonar_echo: false,      // D5 ➔ Pino Echo HC-SR04

        // 3. Ouvido Biônico (Sensor de Som KY-038 / LMV321)
        sound_module: false,    // Sensor de som montado na protoboard
        sound_vcc: false,       // Trilha (+) ➔ Pino VCC Som
        sound_gnd: false,       // Trilha (-) ➔ Pino GND Som
        sound_out: false,       // Pino OUT Som ➔ Pino A0 Arduino

        // 4. Faróis LED + Resistor 220Ω
        led_component: false,   // LED Vermelho 5mm na Protoboard
        resistor_220: false,    // Resistor 220Ω (Cátodo ➔ Trilha GND)
        led_d13: false,         // D13 Arduino ➔ Ânodo do LED

        // 5. Alarme Buzzer de Ré
        buzzer_component: false,// Buzzer Piezo na Protoboard
        buzzer_signal: false,   // D4 Arduino ➔ Polo (+) do Buzzer
        buzzer_gnd: false,      // Polo (-) do Buzzer ➔ Trilha GND

        // 6. Painel da Nave (Display LCD 16x2 Direto — Sem I2C e Sem Potenciômetro: 12 Cabos)
        lcd_module: false,      // Display LCD 16x2 montado na garagem (16 pinos)
        // 6 Cabos de Sinal/Controle para o Arduino:
        lcd_rs: false,          // Jumper RS (Pino 4 LCD ➔ Arduino D12)
        lcd_en: false,          // Jumper Enable (Pino 6 LCD ➔ Arduino D11)
        lcd_d4: false,          // Jumper D4 (Pino 11 LCD ➔ Arduino D10)
        lcd_d5: false,          // Jumper D5 (Pino 12 LCD ➔ Arduino D9)
        lcd_d6: false,          // Jumper D6 (Pino 13 LCD ➔ Arduino D8)
        lcd_d7: false,          // Jumper D7 (Pino 14 LCD ➔ Arduino D7)
        // 6 Cabos de Alimentação & Polarização na Protoboard:
        lcd_vss: false,         // Jumper VSS (Pino 1 LCD ➔ Trilha Azul GND)
        lcd_vdd: false,         // Jumper VDD (Pino 2 LCD ➔ Trilha Vermelha 5V)
        lcd_v0: false,          // Jumper V0 (Pino 3 LCD ➔ Trilha Azul GND - Contraste Máximo)
        lcd_rw: false,          // Jumper RW (Pino 5 LCD ➔ Trilha Azul GND - Modo Escrita)
        lcd_a: false,           // Jumper A (Pino 15 LCD ➔ Trilha Vermelha 5V - Backlight +)
        lcd_k: false            // Jumper K (Pino 16 LCD ➔ Trilha Azul GND - Backlight -)
    },
    speechText: 'Olá, Jovem Inventor! 👋 Pegue uma peça na bandeja e clique no local brilhante para montar seu Carro Inteligente!',
    smokeActive: false,
    smokeCoords: { x: 0, y: 0 },

    // Missão 1: O Ouvido Biônico (Sensor de Palmas + Faróis)
    clapHeadlightsOn: false,
    micStreamActive: false,
    micStream: null,
    micAudioCtx: null,
    micAnalyser: null,
    micVolumeLevel: 0,
    micAnimationId: null,

    // Missão 2: O Painel da Nave (LCD 16x2 Direto — Sem I2C e Sem Potenciômetro/Dimmer)
    lcdTheme: 'green', // 'green' ou 'blue'
    lcdLine1: 'Nave Conectada!',
    lcdLine2: 'Status: 100% OK',
    lcdCustomChar: 'heart', // 'heart', 'robot', 'rocket', 'star', 'car'

    // Missão 3: Desafio Principal — Sensor de Ré + Buzzer + LCD
    carDistance: 38, // cm (2 a 100)
    criticalDistThreshold: 5, // cm (customizável pela criança com +/-)
    warningDistThreshold: 14, // cm
    attentionDistThreshold: 29, // cm
    buzzerFrequency: 1200 // Hz (customizável pela criança com +/-)
};

// ================= CATEGORIAS & FILTROS DA BANDEJA =================
const A9_CATEGORIES = [
    { id: 'all', name: 'Todos (30)', icon: '🧰' },
    { id: 'power', name: 'Energia (2)', icon: '⚡' },
    { id: 'sonar', name: 'Ultrassom (5)', icon: '🦇' },
    { id: 'sound', name: 'Som (4)', icon: '👂' },
    { id: 'led', name: 'Faróis (3)', icon: '💡' },
    { id: 'buzzer', name: 'Buzzer (3)', icon: '🔔' },
    { id: 'lcd', name: 'LCD 16x2 (13)', icon: '📟' }
];

// ================= MAPA DE PEÇAS & FIOS DO LEGO MAGNÉTICO (30 ITENS) =================
const A9_PARTS = [
    // 1. ENERGIA PRINCIPAL DA PROTOBOARD
    {
        id: 'vcc_power',
        module: 'power',
        name: '🔴 Fio 5V Mestre',
        category: 'wire',
        color: '#EF4444',
        icon: '⚡',
        desc: 'Traz 5 Volts do Arduino para a Trilha Vermelha (+) da Protoboard.',
        hint: 'Clique no pino 5V do Arduino e depois na Trilha Vermelha (+)'
    },
    {
        id: 'gnd_power',
        module: 'power',
        name: '⚫ Fio GND Mestre',
        category: 'wire',
        color: '#94A3B8',
        icon: '🔌',
        desc: 'Conecta o Terra (0V) do Arduino na Trilha Azul (-) da Protoboard.',
        hint: 'Clique no pino GND do Arduino e depois na Trilha Azul (-)'
    },

    // 2. SENSOR ULTRASSÔNICO HC-SR04
    {
        id: 'sonar_module',
        module: 'sonar',
        name: '🦇 Olhos de Morcego (HC-SR04)',
        category: 'component',
        color: '#0284C7',
        icon: '🦇',
        desc: 'Encaixa o módulo com cilindros T e R nas colunas 5 a 8 da protoboard.',
        hint: 'Encaixe o sensor ultrassônico na protoboard'
    },
    {
        id: 'sonar_vcc',
        module: 'sonar',
        name: '🔴 Jumper 5V (VCC HC-SR04)',
        category: 'wire',
        color: '#EF4444',
        icon: '⚡',
        desc: 'Alimenta o HC-SR04 ligando a Trilha (+) ao pino VCC do sensor.',
        requires: 'sonar_module',
        hint: 'Ligue a Trilha Vermelha (+) ao pino VCC do sensor de ré'
    },
    {
        id: 'sonar_gnd',
        module: 'sonar',
        name: '⚫ Jumper GND (Terra HC-SR04)',
        category: 'wire',
        color: '#64748B',
        icon: '🔌',
        desc: 'Aterra o HC-SR04 ligando a Trilha (-) ao pino GND do sensor.',
        requires: 'sonar_module',
        hint: 'Ligue a Trilha Azul (-) ao pino GND do sensor de ré'
    },
    {
        id: 'sonar_trig',
        module: 'sonar',
        name: '🟡 Fio Amarelo (Trig ➔ D6)',
        category: 'wire',
        color: '#FBBF24',
        icon: '📢',
        desc: 'Dispara o "grito" de ultrassom através do pino Digital 6 do Arduino.',
        requires: 'sonar_module',
        hint: 'Ligue o Pino D6 do Arduino no pino TRIG do sensor de ré'
    },
    {
        id: 'sonar_echo',
        module: 'sonar',
        name: '🟢 Fio Verde (Echo ➔ D5)',
        category: 'wire',
        color: '#10B981',
        icon: '👂',
        desc: 'Escuta o eco de retorno através do pino Digital 5 do Arduino.',
        requires: 'sonar_module',
        hint: 'Ligue o pino ECHO do sensor de ré no Pino D5 do Arduino'
    },

    // 3. SENSOR DE SOM (KY-038 / LMV321)
    {
        id: 'sound_module',
        module: 'sound',
        name: '👂 Ouvido Biônico (Sensor Som)',
        category: 'component',
        color: '#EC4899',
        icon: '🎤',
        desc: 'Módulo microfone amplificado montado nas colunas 12 a 14.',
        hint: 'Encaixe o módulo do microfone na protoboard'
    },
    {
        id: 'sound_vcc',
        module: 'sound',
        name: '🔴 Jumper 5V (VCC Som)',
        category: 'wire',
        color: '#EF4444',
        icon: '⚡',
        desc: 'Energiza o amplificador de som ligando a Trilha (+) ao VCC do módulo.',
        requires: 'sound_module',
        hint: 'Ligue a Trilha Vermelha (+) ao pino VCC do sensor de som'
    },
    {
        id: 'sound_gnd',
        module: 'sound',
        name: '⚫ Jumper GND (Terra Som)',
        category: 'wire',
        color: '#64748B',
        icon: '🔌',
        desc: 'Fecha o retorno elétrico do sensor de som na Trilha Azul (-).',
        requires: 'sound_module',
        hint: 'Ligue a Trilha Azul (-) ao pino GND do sensor de som'
    },
    {
        id: 'sound_out',
        module: 'sound',
        name: '🟣 Fio Roxo (OUT ➔ A0)',
        category: 'wire',
        color: '#C084FC',
        icon: '〰️',
        desc: 'Envia o sinal acústico da palma direto para o pino Analógico A0.',
        requires: 'sound_module',
        hint: 'Ligue a saída OUT do sensor de som no Pino A0 do Arduino'
    },

    // 4. FARÓIS LED + RESISTOR 220Ω
    {
        id: 'led_component',
        module: 'led',
        name: '💡 LED Vermelho 5mm',
        category: 'component',
        color: '#EF4444',
        icon: '💡',
        desc: 'Ânodo (Perna Longa) na Coluna 18 e Cátodo (Perna Curta) na Coluna 19.',
        hint: 'Encaixe o LED com a perna longa na coluna 18 e curta na 19'
    },
    {
        id: 'resistor_220',
        module: 'led',
        name: '🛡️ Resistor 220Ω Anti-Queima',
        category: 'component',
        color: '#D97706',
        icon: '🛡️',
        desc: 'Freia os elétrons: liga o Cátodo do LED (Coluna 19) até a Trilha Azul GND.',
        requires: 'led_component',
        hint: 'Ligue o resistor da coluna 19 (Cátodo) até a Trilha Azul (-) GND'
    },
    {
        id: 'led_d13',
        module: 'led',
        name: '🔵 Fio Azul (Farol ➔ D13)',
        category: 'wire',
        color: '#38BDF8',
        icon: '✨',
        desc: 'O Arduino envia comando 5V no Pino D13 para acender o farol.',
        requires: 'led_component',
        hint: 'Conecte o Pino D13 do Arduino na perna longa (Ânodo) do LED'
    },

    // 5. ALARME BUZZER DE RÉ
    {
        id: 'buzzer_component',
        module: 'buzzer',
        name: '🔔 Buzzer Piezo de Ré',
        category: 'component',
        color: '#F97316',
        icon: '🔔',
        desc: 'Encaixa o buzzer nas colunas 23 (+) e 24 (-).',
        hint: 'Encaixe o buzzer sonoro na protoboard'
    },
    {
        id: 'buzzer_signal',
        module: 'buzzer',
        name: '🟠 Fio Laranja (Alarme ➔ D4)',
        category: 'wire',
        color: '#F97316',
        icon: '📢',
        desc: 'O Arduino envia frequências sonoras suaves com tone(PIN_BUZZER, freq) no Pino 4.',
        requires: 'buzzer_component',
        hint: 'Ligue o Pino D4 do Arduino no polo positivo (+) do Buzzer'
    },
    {
        id: 'buzzer_gnd',
        module: 'buzzer',
        name: '⚫ Jumper GND (Buzzer ➔ Terra)',
        category: 'wire',
        color: '#64748B',
        icon: '🔌',
        desc: 'Conecta o polo negativo (-) do Buzzer na Trilha Azul GND.',
        requires: 'buzzer_component',
        hint: 'Ligue o polo negativo (-) do Buzzer na Trilha Azul (-)'
    },

    // 6. PAINEL DA NAVE (DISPLAY LCD 16x2 DIRETO — SEM I2C E SEM POTENCIÔMETRO: 12 CABOS REAIS)
    {
        id: 'lcd_module',
        module: 'lcd',
        name: '📟 Display LCD 16x2 (16 Pinos)',
        category: 'component',
        color: '#14B8A6',
        icon: '🖥️',
        desc: 'Painel LCD padrão HD44780 de 16 pinos. Opera em 4-bits direto com o Arduino (sem plaquinha I2C)!',
        hint: 'Posicione o display LCD 16x2 no suporte da garagem maker'
    },
    // --- 6 CABOS DE CONTROLE & DADOS PARA O ARDUINO ---
    {
        id: 'lcd_rs',
        module: 'lcd',
        name: '🟪 Jumper RS (Pino 4 LCD ➔ D12)',
        category: 'wire',
        color: '#A78BFA',
        icon: '🏷️',
        desc: 'Seleciona comandos (0) ou texto/caracteres (1) conectando o pino 4 (RS) no Pino Digital 12 do Arduino.',
        requires: 'lcd_module',
        hint: 'Ligue o pino 4 (RS) do LCD no Pino Digital 12 do Arduino'
    },
    {
        id: 'lcd_en',
        module: 'lcd',
        name: '🟪 Jumper EN (Pino 6 LCD ➔ D11)',
        category: 'wire',
        color: '#C084FC',
        icon: '⚡',
        desc: 'Pulso de ativação (Enable) conectando o pino 6 (E) no Pino Digital 11 do Arduino para confirmar envio de dados.',
        requires: 'lcd_module',
        hint: 'Ligue o pino 6 (Enable) do LCD no Pino Digital 11 do Arduino'
    },
    {
        id: 'lcd_d4',
        module: 'lcd',
        name: '🟦 Jumper D4 (Pino 11 LCD ➔ D10)',
        category: 'wire',
        color: '#38BDF8',
        icon: '🔢',
        desc: 'Linha de dados Bit 4 conectando o pino 11 (D4) do LCD no Pino Digital 10 do Arduino.',
        requires: 'lcd_module',
        hint: 'Ligue o pino 11 (D4) do LCD no Pino Digital 10 do Arduino'
    },
    {
        id: 'lcd_d5',
        module: 'lcd',
        name: '🟦 Jumper D5 (Pino 12 LCD ➔ D9)',
        category: 'wire',
        color: '#0284C7',
        icon: '🔢',
        desc: 'Linha de dados Bit 5 conectando o pino 12 (D5) do LCD no Pino Digital 9 do Arduino.',
        requires: 'lcd_module',
        hint: 'Ligue o pino 12 (D5) do LCD no Pino Digital 9 do Arduino'
    },
    {
        id: 'lcd_d6',
        module: 'lcd',
        name: '🟦 Jumper D6 (Pino 13 LCD ➔ D8)',
        category: 'wire',
        color: '#06B6D4',
        icon: '🔢',
        desc: 'Linha de dados Bit 6 conectando o pino 13 (D6) do LCD no Pino Digital 8 do Arduino.',
        requires: 'lcd_module',
        hint: 'Ligue o pino 13 (D6) do LCD no Pino Digital 8 do Arduino'
    },
    {
        id: 'lcd_d7',
        module: 'lcd',
        name: '🟦 Jumper D7 (Pino 14 LCD ➔ D7)',
        category: 'wire',
        color: '#14B8A6',
        icon: '🔢',
        desc: 'Linha de dados Bit 7 conectando o pino 14 (D7) do LCD no Pino Digital 7 do Arduino.',
        requires: 'lcd_module',
        hint: 'Ligue o pino 14 (D7) do LCD no Pino Digital 7 do Arduino'
    },
    // --- 6 CABOS DE ALIMENTAÇÃO & POLARIZAÇÃO NA PROTOBOARD ---
    {
        id: 'lcd_vss',
        module: 'lcd',
        name: '⚫ Jumper VSS (Pino 1 LCD ➔ GND)',
        category: 'wire',
        color: '#94A3B8',
        icon: '🔌',
        desc: 'Terra da lógica: liga o pino 1 (VSS) na Trilha Azul (-) GND da Protoboard.',
        requires: 'lcd_module',
        hint: 'Ligue o pino 1 (VSS) do LCD na Trilha Azul (-) GND'
    },
    {
        id: 'lcd_vdd',
        module: 'lcd',
        name: '🔴 Jumper VDD (Pino 2 LCD ➔ 5V)',
        category: 'wire',
        color: '#EF4444',
        icon: '⚡',
        desc: 'Alimentação +5V: liga o pino 2 (VDD) na Trilha Vermelha (+) 5V da Protoboard.',
        requires: 'lcd_module',
        hint: 'Ligue o pino 2 (VDD) do LCD na Trilha Vermelha (+) 5V'
    },
    {
        id: 'lcd_v0',
        module: 'lcd',
        name: '⚫ Jumper V0 (Pino 3 LCD ➔ GND Contraste)',
        category: 'wire',
        color: '#64748B',
        icon: '🎯',
        desc: 'Contraste Máximo Fixo: ligando o pino 3 (V0) direto no GND (0V), dispensa o potenciômetro e o texto fica nítido!',
        requires: 'lcd_module',
        hint: 'Ligue o pino 3 (V0) do LCD na Trilha Azul (-) GND para contraste perfeito'
    },
    {
        id: 'lcd_rw',
        module: 'lcd',
        name: '⚫ Jumper RW (Pino 5 LCD ➔ GND Escrita)',
        category: 'wire',
        color: '#94A3B8',
        icon: '✍️',
        desc: 'Modo Escrita Contínua: ligando o pino 5 (RW) no GND (0V), o display fica sempre pronto para receber textos.',
        requires: 'lcd_module',
        hint: 'Ligue o pino 5 (RW) do LCD na Trilha Azul (-) GND'
    },
    {
        id: 'lcd_a',
        module: 'lcd',
        name: '🔴 Jumper A (Pino 15 LCD ➔ 5V Backlight)',
        category: 'wire',
        color: '#EF4444',
        icon: '💡',
        desc: 'Ânodo da luz de fundo: liga o pino 15 (A) na Trilha Vermelha (+) 5V. Dispensa dimmer pois já tem resistor interno!',
        requires: 'lcd_module',
        hint: 'Ligue o pino 15 (A) do LCD na Trilha Vermelha (+) 5V'
    },
    {
        id: 'lcd_k',
        module: 'lcd',
        name: '⚫ Jumper K (Pino 16 LCD ➔ GND Backlight)',
        category: 'wire',
        color: '#64748B',
        icon: '🔌',
        desc: 'Cátodo da luz de fundo: fecha o circuito do LED do visor ligando o pino 16 (K) na Trilha Azul (-) GND.',
        requires: 'lcd_module',
        hint: 'Ligue o pino 16 (K) do LCD na Trilha Azul (-) GND'
    }
];

// ================= RENDERIZADOR PRINCIPAL (loadAula9) =================
function loadAula9() {
    const container = document.getElementById('aula9-container');
    if (!container) return;

    container.innerHTML = `
        <div id="aula9-loaded" class="a9-game-root">
            <!-- TOPO: CABEÇALHO GAMIFICADO COM SUPERPODERES & CONTROLE DE MUTE -->
            <header class="a9-hud-header">
                <div class="a9-hud-branding">
                    <span class="a9-hero-car-icon">🏎️✨</span>
                    <div>
                        <div class="a9-hero-badge">AULA 9 • LABORATÓRIO MAKER & GAME DESIGN</div>
                        <h2 class="a9-hero-title">Oficina do Carro Inteligente</h2>
                        <p class="a9-hero-desc">Monte o sistema completo de robótica: Olhos de Morcego, Ouvido Biônico e Painel da Nave!</p>
                    </div>
                </div>

                <div class="a9-hud-actions">
                    <button id="a9-btn-mute" class="a9-btn-tool ${A9_STATE.isMuted ? 'muted' : ''}" onclick="a9_toggleMute()" title="Silenciar / Ativar Áudio (Sala de Aula)">
                        <span id="a9-mute-icon">${A9_STATE.isMuted ? '🔇' : '🔊'}</span>
                        <span id="a9-mute-label">${A9_STATE.isMuted ? 'Mudo' : 'Som Ligado'}</span>
                    </button>
                    <button class="a9-btn-tool" onclick="a9_resetAssembly()" title="Reiniciar Montagem">
                        <span>🔄</span> Reset
                    </button>
                    <div class="a9-stars-badge" id="a9-stars-display">
                        ⭐ 4 Estrelas Maker
                    </div>
                </div>
            </header>

            <!-- NAVEGAÇÃO DE ABAS TÁTEIS: BANCADA LEGO vs AS 3 MISSÕES -->
            <nav class="a9-tab-nav">
                <button id="a9-nav-assembly" class="a9-tab-btn ${A9_STATE.activeTab === 'assembly' ? 'active' : ''}" onclick="a9_switchTab('assembly')">
                    <span class="a9-tab-emoji">🔌</span>
                    <span class="a9-tab-text">Bancada "Lego Magnético"</span>
                    <span class="a9-tab-pill" id="a9-assembly-progress-pill">0/30</span>
                </button>
                <button id="a9-nav-mission1" class="a9-tab-btn ${A9_STATE.activeTab === 'mission1' ? 'active' : ''}" onclick="a9_switchTab('mission1')">
                    <span class="a9-tab-emoji">👏</span>
                    <span class="a9-tab-text">Missão 1: Ouvido Biônico</span>
                </button>
                <button id="a9-nav-mission2" class="a9-tab-btn ${A9_STATE.activeTab === 'mission2' ? 'active' : ''}" onclick="a9_switchTab('mission2')">
                    <span class="a9-tab-emoji">📟</span>
                    <span class="a9-tab-text">Missão 2: Painel da Nave</span>
                </button>
                <button id="a9-nav-mission3" class="a9-tab-btn ${A9_STATE.activeTab === 'mission3' ? 'active' : ''}" onclick="a9_switchTab('mission3')">
                    <span class="a9-tab-emoji">🏎️</span>
                    <span class="a9-tab-text">Missão 3: Sensor de Ré & Buzzer</span>
                    <span class="a9-tab-pill gold">Desafio</span>
                </button>
                <button id="a9-nav-fullcode" class="a9-tab-btn ${A9_STATE.activeTab === 'fullcode' ? 'active' : ''}" onclick="a9_switchTab('fullcode')" style="border-color:#F59E0B;background:rgba(245,158,11,0.12);">
                    <span class="a9-tab-emoji">💻</span>
                    <span class="a9-tab-text" style="color:#FDE68A;">Código da Placa (.ino)</span>
                    <span class="a9-tab-pill gold">Oficial</span>
                </button>
            </nav>

            <!-- CONTAINER DINÂMICO DA ABA ATIVA -->
            <main id="a9-tab-content-mount" class="a9-content-mount">
                ${a9_renderActiveTabMarkup()}
            </main>
        </div>
    `;

    a9_injectStyles();
    a9_updateAssemblyProgressUI();
}

// ================= INJEÇÃO DE ESTILOS CSS TÁTEIS & NEON =================
function a9_injectStyles() {
    if (document.getElementById('a9-custom-styles')) return;

    const styleEl = document.createElement('style');
    styleEl.id = 'a9-custom-styles';
    styleEl.textContent = `
        .a9-game-root {
            max-width: 1220px;
            margin: 0 auto;
            padding: 12px 16px 40px;
            font-family: 'Nunito', sans-serif;
            color: #F8FAFC;
        }

        /* HEADER HUD */
        .a9-hud-header {
            background: linear-gradient(135deg, rgba(15, 23, 42, 0.98), rgba(30, 41, 59, 0.95));
            border: 2px solid #0284C7;
            border-radius: 20px;
            padding: 16px 22px;
            margin-bottom: 18px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
            gap: 14px;
            box-shadow: 0 10px 30px rgba(2, 132, 199, 0.25);
        }
        .a9-hud-branding {
            display: flex;
            align-items: center;
            gap: 14px;
        }
        .a9-hero-car-icon {
            font-size: 2.5rem;
            animation: a9FloatCar 3s ease-in-out infinite alternate;
        }
        @keyframes a9FloatCar {
            from { transform: translateY(0); }
            to { transform: translateY(-4px); }
        }
        .a9-hero-badge {
            display: inline-block;
            background: rgba(56, 189, 248, 0.15);
            border: 1px solid #38BDF8;
            color: #7DD3FC;
            font-size: 0.72rem;
            font-weight: 900;
            padding: 2px 8px;
            border-radius: 6px;
            letter-spacing: 0.5px;
            margin-bottom: 2px;
        }
        .a9-hero-title {
            font-family: 'Fredoka One', cursive;
            margin: 0;
            font-size: 1.5rem;
            color: #FFFFFF;
            letter-spacing: 0.5px;
        }
        .a9-hero-desc {
            margin: 2px 0 0;
            color: #94A3B8;
            font-size: 0.85rem;
            font-weight: 700;
        }
        .a9-hud-actions {
            display: flex;
            align-items: center;
            gap: 8px;
            flex-wrap: wrap;
        }
        .a9-btn-tool {
            background: #0F172A;
            border: 1px solid #475569;
            color: #CBD5E1;
            padding: 7px 14px;
            border-radius: 12px;
            font-size: 0.82rem;
            font-weight: 800;
            cursor: pointer;
            display: inline-flex;
            align-items: center;
            gap: 6px;
            transition: all 0.15s ease;
        }
        .a9-btn-tool:hover {
            border-color: #38BDF8;
            color: white;
            transform: translateY(-1px);
        }
        .a9-btn-tool.muted {
            border-color: #EF4444;
            color: #FCA5A5;
            background: rgba(239, 68, 68, 0.12);
        }
        .a9-stars-badge {
            background: rgba(16, 185, 129, 0.15);
            border: 1px solid #10B981;
            color: #6EE7B7;
            padding: 6px 14px;
            border-radius: 12px;
            font-size: 0.82rem;
            font-weight: 900;
        }

        /* NAVEGAÇÃO DE ABAS */
        .a9-tab-nav {
            display: flex;
            gap: 8px;
            overflow-x: auto;
            margin-bottom: 18px;
            padding-bottom: 4px;
            scrollbar-width: thin;
        }
        .a9-tab-btn {
            background: #0F172A;
            border: 2px solid #334155;
            color: #94A3B8;
            padding: 10px 16px;
            border-radius: 14px;
            font-size: 0.88rem;
            font-weight: 800;
            cursor: pointer;
            white-space: nowrap;
            display: inline-flex;
            align-items: center;
            gap: 8px;
            transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .a9-tab-btn:hover {
            border-color: #38BDF8;
            color: #F8FAFC;
            transform: translateY(-1px);
        }
        .a9-tab-btn.active {
            background: linear-gradient(135deg, #0284C7, #0369A1);
            border-color: #38BDF8;
            color: white;
            box-shadow: 0 4px 18px rgba(56, 189, 248, 0.4);
        }
        .a9-tab-pill {
            background: rgba(0, 0, 0, 0.35);
            padding: 2px 8px;
            border-radius: 8px;
            font-size: 0.72rem;
            font-weight: 900;
            font-family: monospace;
        }
        .a9-tab-pill.gold {
            background: rgba(245, 158, 11, 0.25);
            border: 1px solid #F59E0B;
            color: #FDE68A;
        }

        /* BANDEJA DE PEÇAS (LEGO MAGNÉTICO) */
        .a9-lego-tray-card {
            background: #0F172A;
            border: 2px solid #334155;
            border-radius: 18px;
            padding: 14px 18px;
            margin-bottom: 18px;
        }
        .a9-tray-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
            gap: 8px;
            margin-top: 10px;
        }
        .a9-part-chip {
            background: #1E293B;
            border: 2px solid #475569;
            border-radius: 12px;
            padding: 8px 12px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 8px;
            transition: all 0.15s ease;
            user-select: none;
        }
        .a9-part-chip:hover {
            border-color: #38BDF8;
            transform: scale(1.02);
        }
        .a9-part-chip.selected {
            border-color: #F59E0B;
            background: rgba(245, 158, 11, 0.15);
            box-shadow: 0 0 14px rgba(245, 158, 11, 0.4);
            animation: a9PulseGlow 1.2s infinite alternate;
        }
        .a9-part-chip.connected {
            border-color: #10B981;
            background: rgba(16, 185, 129, 0.12);
            opacity: 0.85;
        }
        @keyframes a9PulseGlow {
            from { box-shadow: 0 0 8px rgba(245, 158, 11, 0.3); }
            to { box-shadow: 0 0 18px rgba(245, 158, 11, 0.7); }
        }

        /* MASCOTE COM BALÃO DE FALA */
        .a9-mascot-row {
            display: flex;
            align-items: center;
            gap: 12px;
            background: linear-gradient(135deg, rgba(30, 41, 59, 0.9), rgba(15, 23, 42, 0.95));
            border: 2px solid #38BDF8;
            border-radius: 16px;
            padding: 10px 16px;
            margin-bottom: 16px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
        }
        .a9-mascot-avatar {
            font-size: 2rem;
            animation: a9BounceMascot 2s infinite ease-in-out;
        }
        @keyframes a9BounceMascot {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-4px); }
        }
        .a9-speech-bubble {
            font-size: 0.92rem;
            color: #F1F5F9;
            font-weight: 700;
            line-height: 1.4;
        }

        /* ================= ANIMAÇÕES DE GLOW PULSANTE NOS PINOS DA PROTOBOARD ================= */
        @keyframes glow-pulse {
            0%, 100% {
                transform: scale(1);
                filter: drop-shadow(0 0 4px var(--hole-glow-color, var(--glow-c, #38BDF8))) drop-shadow(0 0 9px var(--hole-glow-color, var(--glow-c, #38BDF8)));
                stroke: var(--hole-glow-color, var(--glow-c, #38BDF8));
                stroke-width: 2px;
                opacity: 0.85;
            }
            50% {
                transform: scale(1.65);
                filter: drop-shadow(0 0 12px var(--hole-glow-color, var(--glow-c, #F59E0B))) drop-shadow(0 0 24px var(--hole-glow-color, var(--glow-c, #F59E0B)));
                stroke: #FFFFFF;
                stroke-width: 3.5px;
                opacity: 1;
            }
        }

        @keyframes a9GlowPulseCore {
            0%, 100% {
                transform: scale(1);
                filter: drop-shadow(0 0 5px var(--glow-c, #38BDF8)) drop-shadow(0 0 10px var(--glow-c, #38BDF8));
                stroke-width: 2.5;
            }
            50% {
                transform: scale(1.35);
                filter: drop-shadow(0 0 14px var(--glow-c, #F59E0B)) drop-shadow(0 0 24px var(--glow-c, #F59E0B));
                stroke-width: 4;
            }
        }

        @keyframes a9GlowPulseSoft {
            0%, 100% {
                transform: scale(1);
                filter: drop-shadow(0 0 3px var(--glow-c, #38BDF8));
                opacity: 0.85;
            }
            50% {
                transform: scale(1.18);
                filter: drop-shadow(0 0 9px var(--glow-c, #38BDF8));
                opacity: 1;
            }
        }

        @keyframes a9BeaconRingExpand {
            0% {
                r: 6;
                opacity: 1;
                stroke-width: 3.5;
            }
            50% {
                opacity: 0.6;
                stroke-width: 2.2;
            }
            100% {
                r: 24;
                opacity: 0;
                stroke-width: 0.5;
            }
        }

        @keyframes a9BounceArrow {
            0%, 100% {
                transform: translateY(0);
            }
            50% {
                transform: translateY(-5px);
            }
        }

        .a9-snap-target {
            cursor: pointer;
            transition: all 0.2s ease;
        }

        .a9-snap-target:hover .a9-pin-core {
            transform: scale(1.45) !important;
            filter: drop-shadow(0 0 16px #FFFFFF) brightness(1.3) !important;
        }

        .a9-pin-core {
            transform-box: fill-box;
            transform-origin: center;
        }

        .a9-pin-core.glow-active,
        .a9-pin-core.glow-pulse,
        .glow-pulse {
            animation: glow-pulse 0.85s ease-in-out infinite alternate !important;
            transform-box: fill-box;
            transform-origin: center;
            cursor: pointer !important;
        }

        .glow-pulse:hover {
            transform: scale(1.85) !important;
            filter: drop-shadow(0 0 16px #FFFFFF) drop-shadow(0 0 28px var(--hole-glow-color, #F59E0B)) !important;
        }

        .a9-pin-core.glow-soft {
            animation: a9GlowPulseSoft 1.5s ease-in-out infinite alternate;
        }

        .a9-beacon-ring {
            pointer-events: none;
            transform-box: fill-box;
            transform-origin: center;
            animation: a9BeaconRingExpand 1.4s cubic-bezier(0.2, 0.8, 0.4, 1) infinite;
        }

        .a9-beacon-ring.delayed {
            animation-delay: 0.7s;
        }

        .a9-guide-arrow {
            pointer-events: none;
            transform-box: fill-box;
            transform-origin: center;
            font-family: 'Fredoka One', cursive, sans-serif;
            animation: a9BounceArrow 0.8s ease-in-out infinite alternate;
            filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.8));
        }

        /* FUMACINHA DE ERRO CARTUNESCA */
        .a9-smoke-cloud {
            position: absolute;
            pointer-events: none;
            font-size: 2.2rem;
            animation: a9PuffSmoke 0.7s forwards ease-out;
            z-index: 9999;
        }
        @keyframes a9PuffSmoke {
            0% { transform: scale(0.3) translateY(0); opacity: 1; }
            50% { transform: scale(1.3) translateY(-15px); opacity: 0.8; }
            100% { transform: scale(1.6) translateY(-30px); opacity: 0; }
        }

        /* ANIMAÇÃO SHAKE DE CRASH NO CARRO */
        .a9-shake-crash {
            animation: a9CrashShake 0.08s infinite alternate;
        }
        @keyframes a9CrashShake {
            from { transform: translateX(-3px) rotate(-1deg); }
            to { transform: translateX(3px) rotate(1deg); }
        }

        /* DISPLAY LCD MATRIZ DE PONTOS REALISTA */
        .a9-lcd-screen-box {
            background: #022C22;
            border: 4px solid #064E3B;
            border-radius: 12px;
            padding: 12px 18px;
            box-shadow: inset 0 0 25px rgba(0, 0, 0, 0.8), 0 8px 25px rgba(0, 0, 0, 0.5);
            font-family: 'Courier New', Courier, monospace;
            font-weight: 900;
            letter-spacing: 2px;
            user-select: none;
        }
        .a9-lcd-screen-box.theme-green {
            background: #064E3B;
            border-color: #047857;
            color: #A7F3D0;
            text-shadow: 0 0 8px rgba(167, 243, 208, 0.8);
        }
        .a9-lcd-screen-box.theme-blue {
            background: #0C4A6E;
            border-color: #0284C7;
            color: #BAE6FD;
            text-shadow: 0 0 8px rgba(186, 230, 253, 0.8);
        }
        .a9-lcd-line {
            height: 24px;
            line-height: 24px;
            font-size: 1.15rem;
            overflow: hidden;
            white-space: pre;
        }

        /* CÓDIGO C++ DINÂMICO COM HIGHLIGHT AO VIVO */
        .a9-live-code-block {
            background: #020617;
            border: 2px solid #1E293B;
            border-radius: 14px;
            padding: 14px;
            font-family: 'Fira Code', 'Consolas', monospace;
            font-size: 0.82rem;
            line-height: 1.55;
            color: #CBD5E1;
            position: relative;
        }
        .a9-code-line {
            padding: 2px 6px;
            border-radius: 4px;
            transition: background 0.15s ease;
        }
        .a9-code-line.active-executing {
            background: rgba(245, 158, 11, 0.25);
            border-left: 3px solid #F59E0B;
            color: #FDE68A;
            font-weight: 900;
        }
        .a9-num-stepper {
            background: #1E293B;
            border: 1px solid #475569;
            color: #38BDF8;
            font-weight: 900;
            padding: 1px 6px;
            border-radius: 6px;
            cursor: pointer;
            margin: 0 2px;
            font-size: 0.75rem;
        }
        .a9-num-stepper:hover {
            background: #0284C7;
            color: white;
        }
    `;
    document.head.appendChild(styleEl);
}

// ================= RENDERIZADORES DE CADA ABA =================
function a9_renderActiveTabMarkup() {
    if (A9_STATE.activeTab === 'assembly') {
        return a9_renderAssemblyBench();
    } else if (A9_STATE.activeTab === 'mission1') {
        return a9_renderMission1Clap();
    } else if (A9_STATE.activeTab === 'mission2') {
        return a9_renderMission2Lcd();
    } else if (A9_STATE.activeTab === 'mission3') {
        return a9_renderMission3Radar();
    } else if (A9_STATE.activeTab === 'fullcode') {
        return a9_renderFullProjectCode();
    }
    return '';
}

// -------------------------------------------------------------
// 1. BANCADA DE MONTAGEM "LEGO MAGNÉTICO"
// -------------------------------------------------------------
function a9_renderAssemblyBench() {
    const filter = A9_STATE.assemblyFilter || 'all';
    const displayedParts = filter === 'all' 
        ? A9_PARTS 
        : A9_PARTS.filter(p => p.module === filter);

    const totalCount = A9_PARTS.length;
    const connectedCount = totalCount - a9_getMissingPartsCount();

    return `
        <!-- MASCOTE DIDÁTICO INTERATIVO -->
        <div class="a9-mascot-row" id="a9-mascot-banner">
            <span class="a9-mascot-avatar">🤖⚡</span>
            <div class="a9-speech-bubble" id="a9-speech-bubble">
                ${A9_STATE.speechText}
            </div>
        </div>

        <!-- BANDEJA DE PEÇAS & FIOS PARA ENCAIXAR -->
        <div class="a9-lego-tray-card">
            <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;">
                <div style="display:flex;align-items:center;gap:8px;">
                    <span style="font-size:1.2rem;">🧰</span>
                    <strong style="color:#FDE68A;font-family:'Fredoka One',cursive;font-size:1.05rem;">
                        Bandeja de Peças do Carro Inteligente:
                    </strong>
                    <span style="color:#94A3B8;font-size:0.8rem;">(Conecte as peças e seus fios de energia e dados!)</span>
                </div>
                <div style="display:flex;gap:6px;">
                    ${filter !== 'all' ? `
                        <button onclick="a9_autoAssembleModule('${filter}')" style="background:#1E293B;border:1px solid #38BDF8;color:#7DD3FC;padding:5px 12px;border-radius:10px;font-size:0.75rem;font-weight:900;cursor:pointer;">
                            ⚡ Montar Este Módulo
                        </button>
                    ` : ''}
                    <button onclick="a9_autoAssembleAll()" style="background:#1E293B;border:1px solid #10B981;color:#6EE7B7;padding:5px 12px;border-radius:10px;font-size:0.75rem;font-weight:900;cursor:pointer;">
                        ✨ Auto-Lego Completo (30 Peças/Fios)
                    </button>
                </div>
            </div>

            <!-- ABAS DE FILTRO POR MÓDULO PEDAGÓGICO -->
            <div style="display:flex;gap:6px;overflow-x:auto;padding:8px 0 2px;scrollbar-width:thin;">
                ${A9_CATEGORIES.map(cat => {
                    const isActive = filter === cat.id;
                    const catParts = cat.id === 'all' ? A9_PARTS : A9_PARTS.filter(p => p.module === cat.id);
                    const catDone = catParts.filter(p => A9_STATE.connections[p.id]).length;
                    return `
                        <button onclick="a9_setAssemblyFilter('${cat.id}')" style="background:${isActive ? '#0284C7' : '#1E293B'};border:1.5px solid ${isActive ? '#38BDF8' : '#334155'};color:${isActive ? 'white' : '#CBD5E1'};padding:5px 10px;border-radius:10px;font-size:0.78rem;font-weight:800;cursor:pointer;white-space:nowrap;display:inline-flex;align-items:center;gap:5px;">
                            <span>${cat.icon}</span>
                            <span>${cat.name}</span>
                            <span style="background:${catDone === catParts.length ? '#10B981' : 'rgba(0,0,0,0.35)'};color:${catDone === catParts.length ? 'white' : '#94A3B8'};padding:1px 5px;border-radius:6px;font-size:0.68rem;font-weight:900;">
                                ${catDone}/${catParts.length}
                            </span>
                        </button>
                    `;
                }).join('')}
            </div>

            <div class="a9-tray-grid">
                ${displayedParts.map(p => {
                    const isConn = A9_STATE.connections[p.id];
                    const isSel = A9_STATE.selectedTool === p.id;
                    return `
                        <div class="a9-part-chip ${isConn ? 'connected' : ''} ${isSel ? 'selected' : ''}" onclick="a9_selectTool('${p.id}')">
                            <span style="display:flex;align-items:center;gap:6px;font-size:0.82rem;font-weight:800;">
                                <span>${p.icon}</span>
                                <span style="color:${p.color};">${p.name}</span>
                            </span>
                            <span style="font-size:0.85rem;">${isConn ? '✅' : isSel ? '👉' : '⚪'}</span>
                        </div>
                    `;
                }).join('')}
            </div>
        </div>

        <!-- GUIA & TABELA RÁPIDA DE IDENTIFICAÇÃO E POSIÇÃO DOS FIOS (DIAGRAMA 1 ➔ CÓDIGO C++) -->
        <div style="background:#0F172A;border:2px solid #38BDF8;border-radius:18px;padding:16px 20px;margin-bottom:16px;box-shadow:0 8px 30px rgba(56,189,248,0.15);">
            <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;margin-bottom:12px;">
                <div style="display:flex;align-items:center;gap:10px;">
                    <span style="font-size:1.6rem;">📋🏷️</span>
                    <div>
                        <strong style="color:#FDE68A;font-family:'Fredoka One',cursive;font-size:1.15rem;display:block;">
                            Tabela de Identificação e Posição de Cada Fio
                        </strong>
                        <span style="color:#94A3B8;font-size:0.8rem;">
                            Conferência 100% precisa entre os pinos do Diagrama de Montagem e o Código C++ Oficial
                        </span>
                    </div>
                </div>
                <div style="background:rgba(16,185,129,0.15);border:1px solid #10B981;color:#6EE7B7;padding:4px 12px;border-radius:12px;font-size:0.78rem;font-weight:900;">
                    ✓ Zero fios sobretraçados • Canais separados
                </div>
            </div>

            <div style="overflow-x:auto;">
                <table style="width:100%;border-collapse:collapse;font-size:0.82rem;min-width:680px;">
                    <thead>
                        <tr style="background:#1E293B;color:#94A3B8;border-bottom:2px solid #334155;text-align:left;font-size:0.75rem;text-transform:uppercase;letter-spacing:0.5px;">
                            <th style="padding:8px 12px;">Fio &amp; Etiqueta</th>
                            <th style="padding:8px 12px;">Origem</th>
                            <th style="padding:8px 12px;">Destino</th>
                            <th style="padding:8px 12px;">Pino no Código C++</th>
                            <th style="padding:8px 12px;">Função / Observação</th>
                        </tr>
                    </thead>
                    <tbody style="line-height:1.5;">
                        <!-- ENERGIA MESTRE -->
                        <tr style="background:rgba(239,68,68,0.06);border-bottom:1px solid #1E293B;">
                            <td style="padding:7px 12px;font-weight:bold;color:#FCA5A5;">🔴 5V Mestre</td>
                            <td style="padding:7px 12px;color:#F8FAFC;">Arduino <b>Pino 5V</b></td>
                            <td style="padding:7px 12px;color:#CBD5E1;">Protoboard <b>Trilha Vermelha (+)</b></td>
                            <td style="padding:7px 12px;color:#94A3B8;font-family:monospace;">(Alimentação 5V)</td>
                            <td style="padding:7px 12px;color:#CBD5E1;">Leva +5V para a protoboard e todos os módulos</td>
                        </tr>
                        <tr style="background:rgba(56,189,248,0.06);border-bottom:1px solid #1E293B;">
                            <td style="padding:7px 12px;font-weight:bold;color:#BAE6FD;">🔵 GND Mestre</td>
                            <td style="padding:7px 12px;color:#F8FAFC;">Arduino <b>Pino GND</b></td>
                            <td style="padding:7px 12px;color:#CBD5E1;">Protoboard <b>Trilha Azul (-)</b></td>
                            <td style="padding:7px 12px;color:#94A3B8;font-family:monospace;">(Aterramento 0V)</td>
                            <td style="padding:7px 12px;color:#CBD5E1;">Referência terra comum para todos os circuitos</td>
                        </tr>

                        <!-- SENSOR ULTRASSÔNICO HC-SR04 -->
                        <tr style="background:rgba(251,191,36,0.06);border-bottom:1px solid #1E293B;">
                            <td style="padding:7px 12px;font-weight:bold;color:#FDE68A;">🟡 D6 ➔ Trig</td>
                            <td style="padding:7px 12px;color:#F8FAFC;">Arduino <b>Pino Digital 6</b></td>
                            <td style="padding:7px 12px;color:#CBD5E1;">HC-SR04 <b>Pino Trig</b> (Col 6)</td>
                            <td style="padding:7px 12px;color:#FBBF24;font-family:monospace;font-weight:bold;">PIN_TRIG = 6;</td>
                            <td style="padding:7px 12px;color:#CBD5E1;">Dispara o pulso sonoro de radar de 10µs</td>
                        </tr>
                        <tr style="background:rgba(16,185,129,0.06);border-bottom:1px solid #1E293B;">
                            <td style="padding:7px 12px;font-weight:bold;color:#A7F3D0;">🟢 D5 ➔ Echo</td>
                            <td style="padding:7px 12px;color:#F8FAFC;">Arduino <b>Pino Digital 5</b></td>
                            <td style="padding:7px 12px;color:#CBD5E1;">HC-SR04 <b>Pino Echo</b> (Col 7)</td>
                            <td style="padding:7px 12px;color:#34D399;font-family:monospace;font-weight:bold;">PIN_ECHO = 5;</td>
                            <td style="padding:7px 12px;color:#CBD5E1;">Lê o tempo de retorno com pulseIn()</td>
                        </tr>

                        <!-- SENSOR DE SOM & PALMAS -->
                        <tr style="background:rgba(192,132,252,0.06);border-bottom:1px solid #1E293B;">
                            <td style="padding:7px 12px;font-weight:bold;color:#E9D5FF;">🟣 A0 ➔ Som OUT</td>
                            <td style="padding:7px 12px;color:#F8FAFC;">Sensor Som <b>Pino OUT</b> (Col 14)</td>
                            <td style="padding:7px 12px;color:#CBD5E1;">Arduino <b>Pino Analógico A0</b></td>
                            <td style="padding:7px 12px;color:#C084FC;font-family:monospace;font-weight:bold;">PIN_SOM = A0;</td>
                            <td style="padding:7px 12px;color:#CBD5E1;">Detecta pico de volume da palma (canal central y=202)</td>
                        </tr>

                        <!-- LED FAROL NO PINO 13 -->
                        <tr style="background:rgba(56,189,248,0.06);border-bottom:1px solid #1E293B;">
                            <td style="padding:7px 12px;font-weight:bold;color:#BAE6FD;">💡 D13 ➔ LED</td>
                            <td style="padding:7px 12px;color:#F8FAFC;">Arduino <b>Pino Digital 13</b></td>
                            <td style="padding:7px 12px;color:#CBD5E1;">LED <b>Ânodo (+)</b> (Col 18)</td>
                            <td style="padding:7px 12px;color:#38BDF8;font-family:monospace;font-weight:bold;">PIN_LED = 13;</td>
                            <td style="padding:7px 12px;color:#CBD5E1;">Acende faróis (cátodo na Col 19 via resistor 220Ω ➔ GND)</td>
                        </tr>

                        <!-- BUZZER NO PINO 4 -->
                        <tr style="background:rgba(249,115,22,0.06);border-bottom:1px solid #1E293B;">
                            <td style="padding:7px 12px;font-weight:bold;color:#FED7AA;">🔔 D4 ➔ Buzzer</td>
                            <td style="padding:7px 12px;color:#F8FAFC;">Arduino <b>Pino Digital 4</b></td>
                            <td style="padding:7px 12px;color:#CBD5E1;">Buzzer <b>Pino (+)</b> (Col 23)</td>
                            <td style="padding:7px 12px;color:#F97316;font-family:monospace;font-weight:bold;">PIN_BUZZER = 4;</td>
                            <td style="padding:7px 12px;color:#CBD5E1;">Alarme suave de aproximação tone(4, freq)</td>
                        </tr>

                        <!-- BARRAMENTO DO LCD 16X2 (6 FIOS DIGITAIS) -->
                        <tr style="background:rgba(167,139,250,0.06);border-bottom:1px solid #1E293B;">
                            <td style="padding:7px 12px;font-weight:bold;color:#DDD6FE;">📟 D12 ➔ RS</td>
                            <td style="padding:7px 12px;color:#F8FAFC;">Arduino <b>Pino Digital 12</b></td>
                            <td style="padding:7px 12px;color:#CBD5E1;">LCD <b>Pino 4 (RS)</b></td>
                            <td style="padding:7px 12px;color:#A78BFA;font-family:monospace;font-weight:bold;">RS = 12;</td>
                            <td style="padding:7px 12px;color:#CBD5E1;">Seleção de Registrador (Comandos vs Caracteres)</td>
                        </tr>
                        <tr style="background:rgba(192,132,252,0.06);border-bottom:1px solid #1E293B;">
                            <td style="padding:7px 12px;font-weight:bold;color:#F3E8FF;">📟 D11 ➔ EN</td>
                            <td style="padding:7px 12px;color:#F8FAFC;">Arduino <b>Pino Digital 11</b></td>
                            <td style="padding:7px 12px;color:#CBD5E1;">LCD <b>Pino 6 (Enable)</b></td>
                            <td style="padding:7px 12px;color:#C084FC;font-family:monospace;font-weight:bold;">EN = 11;</td>
                            <td style="padding:7px 12px;color:#CBD5E1;">Pulso de confirmação de leitura do display</td>
                        </tr>
                        <tr style="background:rgba(56,189,248,0.06);border-bottom:1px solid #1E293B;">
                            <td style="padding:7px 12px;font-weight:bold;color:#BAE6FD;">📟 D10 ➔ D4</td>
                            <td style="padding:7px 12px;color:#F8FAFC;">Arduino <b>Pino Digital 10</b></td>
                            <td style="padding:7px 12px;color:#CBD5E1;">LCD <b>Pino 11 (D4)</b></td>
                            <td style="padding:7px 12px;color:#38BDF8;font-family:monospace;font-weight:bold;">D4 = 10;</td>
                            <td style="padding:7px 12px;color:#CBD5E1;">Bit 4 de dados da matriz 4-bits</td>
                        </tr>
                        <tr style="background:rgba(2,132,199,0.06);border-bottom:1px solid #1E293B;">
                            <td style="padding:7px 12px;font-weight:bold;color:#93C5FD;">📟 D9 ➔ D5</td>
                            <td style="padding:7px 12px;color:#F8FAFC;">Arduino <b>Pino Digital 9</b></td>
                            <td style="padding:7px 12px;color:#CBD5E1;">LCD <b>Pino 12 (D5)</b></td>
                            <td style="padding:7px 12px;color:#60A5FA;font-family:monospace;font-weight:bold;">D5 = 9;</td>
                            <td style="padding:7px 12px;color:#CBD5E1;">Bit 5 de dados da matriz 4-bits</td>
                        </tr>
                        <tr style="background:rgba(6,182,212,0.06);border-bottom:1px solid #1E293B;">
                            <td style="padding:7px 12px;font-weight:bold;color:#A5F3FC;">📟 D8 ➔ D6</td>
                            <td style="padding:7px 12px;color:#F8FAFC;">Arduino <b>Pino Digital 8</b></td>
                            <td style="padding:7px 12px;color:#CBD5E1;">LCD <b>Pino 13 (D6)</b></td>
                            <td style="padding:7px 12px;color:#22D3EE;font-family:monospace;font-weight:bold;">D6 = 8;</td>
                            <td style="padding:7px 12px;color:#CBD5E1;">Bit 6 de dados da matriz 4-bits</td>
                        </tr>
                        <tr style="background:rgba(20,184,166,0.06);border-bottom:1px solid #1E293B;">
                            <td style="padding:7px 12px;font-weight:bold;color:#99F6E4;">📟 D7 ➔ D7</td>
                            <td style="padding:7px 12px;color:#F8FAFC;">Arduino <b>Pino Digital 7</b></td>
                            <td style="padding:7px 12px;color:#CBD5E1;">LCD <b>Pino 14 (D7)</b></td>
                            <td style="padding:7px 12px;color:#2DD4BF;font-family:monospace;font-weight:bold;">D7 = 7;</td>
                            <td style="padding:7px 12px;color:#CBD5E1;">Bit 7 de dados da matriz 4-bits</td>
                        </tr>

                        <!-- ALIMENTAÇÃO DIRETA DO LCD (6 FIOS LOCAIS NA PROTOBOARD) -->
                        <tr style="background:#0F172A;border-bottom:1px solid #1E293B;">
                            <td style="padding:7px 12px;font-weight:bold;color:#FDE68A;">⚡ LCD Energia &amp; GND</td>
                            <td style="padding:7px 12px;color:#CBD5E1;">Pinos 1(VSS), 3(V0), 5(RW), 16(K)</td>
                            <td style="padding:7px 12px;color:#CBD5E1;">Trilha Azul (-) GND</td>
                            <td style="padding:7px 12px;color:#94A3B8;font-family:monospace;">Direto no GND</td>
                            <td style="padding:7px 12px;color:#CBD5E1;"><b>V0 no GND dá contraste máximo</b> (dispensa potenciômetro!)</td>
                        </tr>
                        <tr style="background:#0F172A;">
                            <td style="padding:7px 12px;font-weight:bold;color:#FCA5A5;">💡 LCD Backlight 5V</td>
                            <td style="padding:7px 12px;color:#CBD5E1;">Pinos 2(VDD) e 15(A)</td>
                            <td style="padding:7px 12px;color:#CBD5E1;">Trilha Vermelha (+) 5V</td>
                            <td style="padding:7px 12px;color:#94A3B8;font-family:monospace;">Direto no 5V</td>
                            <td style="padding:7px 12px;color:#CBD5E1;"><b>Pino 15 no 5V mantém luz acesa</b> (dispensa dimmer!)</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- PROTOBOARD & ARDUINO INTERATIVO EM SVG DE ALTA DEFINIÇÃO -->
        <div style="position:relative;background:#0B1120;border:2px solid #334155;border-radius:20px;padding:16px;box-shadow:0 12px 35px rgba(0,0,0,0.6);overflow-x:auto;">
            <!-- Ponto dinâmico de fumacinha cartunesca em caso de erro -->
            <div id="a9-smoke-mount" style="position:absolute;display:none;">💨</div>

            ${a9_renderInteractiveBreadboardSvg()}
        </div>

        <!-- BARRA INFERIOR DE CONCLUSÃO E TESTE -->
        <div style="margin-top:16px;background:#0F172A;border:2px solid #334155;border-radius:16px;padding:14px 20px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;">
            <div style="display:flex;align-items:center;gap:12px;">
                <span style="font-size:1.6rem;">🚗⚡</span>
                <div>
                    <strong style="color:white;font-size:0.95rem;display:block;">
                        Status do Carro: ${a9_isCircuitComplete() ? '<span style="color:#34D399;">100% MONTADO E PRONTO PARA RODAR! 🎉</span>' : `<span style="color:#FBBF24;">Montando circuitos na protoboard (${connectedCount}/${totalCount})...</span>`}
                    </strong>
                    <span style="color:#94A3B8;font-size:0.8rem;">
                        ${a9_getMissingPartsCount()} conexões restantes para a ignição total!
                    </span>
                </div>
            </div>

            <div style="display:flex;gap:8px;">
                <button onclick="a9_testCircuitPower()" style="background:linear-gradient(135deg,#EF4444,#DC2626);color:white;border:none;padding:10px 18px;border-radius:12px;font-weight:900;font-size:0.85rem;cursor:pointer;display:inline-flex;align-items:center;gap:6px;box-shadow:0 4px 15px rgba(239,68,68,0.35);">
                    ⚡ Testar 5V, GND & Sinais
                </button>
                <button onclick="a9_switchTab('mission3')" style="background:linear-gradient(135deg,#38BDF8,#0284C7);color:#0F172A;border:none;padding:10px 20px;border-radius:12px;font-weight:900;font-size:0.88rem;cursor:pointer;display:inline-flex;align-items:center;gap:6px;box-shadow:0 4px 15px rgba(56,189,248,0.35);">
                    <span>Ir para o Minigame do Carro</span> 🏎️➔
                </button>
            </div>
        </div>
    `;
}

// -------------------------------------------------------------
// MAPA DE DESTINOS DOS FUROS DA PROTOBOARD & PINOS DO ARDUINO
// -------------------------------------------------------------
const A9_HOLE_DESTINATIONS = {
    vcc_power: {
        color: '#EF4444',
        rails: [{ type: 'rail_vcc', col: 0 }, { type: 'rail_vcc', col: 1 }, { type: 'rail_vcc', col: 2 }],
        arduinoPins: ['5V']
    },
    gnd_power: {
        color: '#38BDF8',
        rails: [{ type: 'rail_gnd', col: 1 }, { type: 'rail_gnd', col: 2 }, { type: 'rail_gnd', col: 3 }],
        arduinoPins: ['GND']
    },
    sonar_module: {
        color: '#0284C7',
        cols: [5, 6, 7, 8],
        rows: ['c', 'd', 'e']
    },
    sonar_vcc: {
        color: '#EF4444',
        rails: [{ type: 'rail_vcc', col: 5 }],
        cols: [5],
        rows: ['a', 'b']
    },
    sonar_gnd: {
        color: '#64748B',
        rails: [{ type: 'rail_gnd', col: 8 }],
        cols: [8],
        rows: ['a', 'b']
    },
    sonar_trig: {
        color: '#FBBF24',
        arduinoPins: ['D6'],
        cols: [6],
        rows: ['a', 'b']
    },
    sonar_echo: {
        color: '#10B981',
        arduinoPins: ['D5'],
        cols: [7],
        rows: ['a', 'b']
    },
    sound_module: {
        color: '#EC4899',
        cols: [12, 13, 14],
        rows: ['c', 'd', 'e']
    },
    sound_vcc: {
        color: '#EF4444',
        rails: [{ type: 'rail_vcc', col: 12 }],
        cols: [12],
        rows: ['a', 'b']
    },
    sound_gnd: {
        color: '#64748B',
        rails: [{ type: 'rail_gnd', col: 13 }],
        cols: [13],
        rows: ['a', 'b']
    },
    sound_out: {
        color: '#C084FC',
        arduinoPins: ['A0'],
        cols: [14],
        rows: ['a', 'b']
    },
    led_component: {
        color: '#EF4444',
        cols: [18, 19],
        rows: ['c', 'd', 'e']
    },
    resistor_220: {
        color: '#F59E0B',
        rails: [{ type: 'rail_gnd', col: 19 }],
        cols: [19],
        rows: ['a', 'b']
    },
    led_d13: {
        color: '#10B981',
        arduinoPins: ['D13'],
        cols: [18],
        rows: ['a', 'b']
    },
    buzzer_component: {
        color: '#38BDF8',
        cols: [23, 24],
        rows: ['f', 'g', 'h']
    },
    buzzer_signal: {
        color: '#F97316',
        arduinoPins: ['D4'],
        cols: [23],
        rows: ['i', 'j']
    },
    buzzer_gnd: {
        color: '#64748B',
        rails: [{ type: 'rail_bot_gnd', col: 24 }],
        cols: [24],
        rows: ['i', 'j']
    },
    lcd_module: {
        color: '#2DD4BF',
        lcdPins: ['HEADER']
    },
    // 6 Cabos de Sinal/Controle para o Arduino
    lcd_rs: {
        color: '#A78BFA',
        arduinoPins: ['D12'],
        lcdPins: ['RS']
    },
    lcd_en: {
        color: '#C084FC',
        arduinoPins: ['D11'],
        lcdPins: ['E']
    },
    lcd_d4: {
        color: '#38BDF8',
        arduinoPins: ['D10'],
        lcdPins: ['D4']
    },
    lcd_d5: {
        color: '#0284C7',
        arduinoPins: ['D9'],
        lcdPins: ['D5']
    },
    lcd_d6: {
        color: '#06B6D4',
        arduinoPins: ['D8'],
        lcdPins: ['D6']
    },
    lcd_d7: {
        color: '#14B8A6',
        arduinoPins: ['D7'],
        lcdPins: ['D7']
    },
    // 6 Cabos de Alimentação & Polarização na Protoboard
    lcd_vss: {
        color: '#94A3B8',
        rails: [{ type: 'rail_bot_gnd', col: 1 }],
        lcdPins: ['VSS']
    },
    lcd_vdd: {
        color: '#EF4444',
        rails: [{ type: 'rail_bot_vcc', col: 2 }],
        lcdPins: ['VDD']
    },
    lcd_v0: {
        color: '#64748B',
        rails: [{ type: 'rail_bot_gnd', col: 3 }],
        lcdPins: ['V0']
    },
    lcd_rw: {
        color: '#94A3B8',
        rails: [{ type: 'rail_bot_gnd', col: 5 }],
        lcdPins: ['RW']
    },
    lcd_a: {
        color: '#EF4444',
        rails: [{ type: 'rail_bot_vcc', col: 20 }],
        lcdPins: ['A']
    },
    lcd_k: {
        color: '#64748B',
        rails: [{ type: 'rail_bot_gnd', col: 21 }],
        lcdPins: ['K']
    }
};

function a9_isHoleValidForTool(toolId, holeType, colIndex, rowKey) {
    if (!toolId) return false;
    const dest = A9_HOLE_DESTINATIONS[toolId];
    if (!dest) return false;

    // Trilhas de alimentação
    if (holeType === 'rail_vcc' || holeType === 'rail_gnd' || holeType === 'rail_bot_gnd' || holeType === 'rail_bot_vcc') {
        if (!dest.rails) return false;
        return dest.rails.some(r => r.type === holeType && (r.col === undefined || r.col === colIndex));
    }

    // Furos das colunas
    if (colIndex !== undefined && dest.cols) {
        if (!dest.cols.includes(colIndex)) return false;
        if (rowKey && dest.rows) {
            return dest.rows.includes(rowKey);
        }
        return true;
    }

    // Pinos do Arduino
    if (holeType && dest.arduinoPins) {
        return dest.arduinoPins.includes(holeType);
    }

    // Pinos do LCD
    if (holeType && dest.lcdPins) {
        return dest.lcdPins.includes(holeType);
    }

    return false;
}

function a9_isHoleActiveGuide(toolId, holeType, colIndex, rowKey) {
    if (!toolId) return false;
    if (A9_STATE.connections[toolId]) return false;
    return a9_isHoleValidForTool(toolId, holeType, colIndex, rowKey);
}

function a9_renderBreadboardHole(holeType, colIndex, rowKey, cx, cy, defaultR = 2, defaultFill = '#475569') {
    const sel = A9_STATE.selectedTool;
    const activeTool = sel || A9_PARTS.find(p => !A9_STATE.connections[p.id])?.id;
    const isGuide = a9_isHoleActiveGuide(activeTool, holeType, colIndex, rowKey);

    if (isGuide) {
        const dest = A9_HOLE_DESTINATIONS[activeTool];
        const glowColor = dest ? dest.color : '#38BDF8';
        const isExplicit = sel === activeTool;
        const radius = isExplicit ? 5 : 3.8;
        const partName = A9_PARTS.find(p => p.id === activeTool)?.name || 'Peça';

        return `
            <circle cx="${cx}" cy="${cy}" r="${radius}" 
                fill="${glowColor}" stroke="#FFFFFF" stroke-width="${isExplicit ? 2.2 : 1.2}" 
                class="glow-pulse" 
                style="--hole-glow-color:${glowColor};--glow-c:${glowColor};" 
                onclick="a9_handleHoleClick(event, '${holeType}', ${colIndex}, '${rowKey || ''}')" 
                title="👉 Encaixar ${partName} aqui!"/>
        `;
    }

    return `
        <circle cx="${cx}" cy="${cy}" r="${defaultR}" 
            fill="${defaultFill}" 
            onclick="a9_handleHoleClick(event, '${holeType}', ${colIndex}, '${rowKey || ''}')"/>
    `;
}

function a9_renderArduinoPin(pinName, cx, cy, labelColor = '#64748B') {
    const sel = A9_STATE.selectedTool;
    const activeTool = sel || A9_PARTS.find(p => !A9_STATE.connections[p.id])?.id;
    const isGuide = a9_isHoleActiveGuide(activeTool, pinName);

    if (isGuide) {
        const dest = A9_HOLE_DESTINATIONS[activeTool];
        const glowColor = dest ? dest.color : '#38BDF8';
        const isExplicit = sel === activeTool;
        const radius = isExplicit ? 6 : 4.5;
        const partName = A9_PARTS.find(p => p.id === activeTool)?.name || 'Fio';

        return `
            <circle cx="${cx}" cy="${cy}" r="${radius}" 
                fill="${glowColor}" stroke="#FFFFFF" stroke-width="${isExplicit ? 2.2 : 1.5}" 
                class="glow-pulse" 
                style="--hole-glow-color:${glowColor};--glow-c:${glowColor};" 
                onclick="a9_handleHoleClick(event, '${pinName}')" 
                title="👉 Conectar ${partName} no pino ${pinName}!"/>
        `;
    }

    return `
        <circle cx="${cx}" cy="${cy}" r="3" 
            fill="#1E293B" stroke="${labelColor}" 
            onclick="a9_handleHoleClick(event, '${pinName}')"/>
    `;
}

// -------------------------------------------------------------
// SVG DA PROTOBOARD + ARDUINO COM ALVOS INTERATIVOS TÁTEIS (22 CONEXÕES)
// -------------------------------------------------------------
function a9_renderInteractiveBreadboardSvg() {
    const sel = A9_STATE.selectedTool;
    const c = A9_STATE.connections;

    // Próximo componente na fila de montagem caso nenhum esteja selecionado
    const nextWaitingPart = A9_PARTS.find(p => !c[p.id]);
    const nextWaiting = nextWaitingPart ? nextWaitingPart.id : null;

    // Helpers para determinar estado do pino (ativo/destacado ou aguardando suave)
    const isPinActive = (id) => sel === id || (!sel && nextWaiting === id);

    return `
    <svg viewBox="0 0 1020 540" style="width:100%;min-width:880px;display:block;margin:0 auto;user-select:none;">
        <defs>
            <linearGradient id="a9-pcb-grad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stop-color="#0E7490"/>
                <stop offset="100%" stop-color="#155E75"/>
            </linearGradient>
            <linearGradient id="a9-bb-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#FFFFFF"/>
                <stop offset="100%" stop-color="#E2E8F0"/>
            </linearGradient>
        </defs>

        <!-- 1. PLACA ARDUINO UNO R3 -->
        <g transform="translate(25, 75)">
            <rect x="0" y="0" width="290" height="235" rx="14" fill="url(#a9-pcb-grad)" stroke="#0891B2" stroke-width="2"/>
            <rect x="-14" y="20" width="30" height="40" rx="3" fill="#94A3B8" stroke="#475569" stroke-width="1.5"/>
            <rect x="-14" y="160" width="35" height="36" rx="4" fill="#0F172A"/>
            <rect x="125" y="90" width="125" height="38" rx="4" fill="#0F172A" stroke="#334155"/>
            <text x="187" y="114" fill="#E2E8F0" font-family="monospace" font-size="9" font-weight="900" text-anchor="middle">ATmega328P</text>
            <text x="155" y="55" fill="white" font-family="'Fredoka One',cursive" font-size="15">Arduino UNO</text>
            <text x="155" y="68" fill="#A5F3FC" font-size="7.5" font-weight="800">OFICINA MAKER</text>

            <!-- BARRA SUPERIOR DE PINOS DIGITAIS (D4 a D13) -->
            <rect x="95" y="4" width="190" height="15" fill="#0F172A" stroke="#334155"/>
            <text x="110" y="0" fill="#EF4444" font-size="5.5" font-weight="900" text-anchor="middle">13</text>
            <text x="126" y="0" fill="#A78BFA" font-size="5.5" font-weight="900" text-anchor="middle">12</text>
            <text x="142" y="0" fill="#A78BFA" font-size="5.5" font-weight="900" text-anchor="middle">11</text>
            <text x="158" y="0" fill="#38BDF8" font-size="5.5" font-weight="900" text-anchor="middle">10</text>
            <text x="174" y="0" fill="#38BDF8" font-size="5.5" font-weight="900" text-anchor="middle">9</text>
            <text x="190" y="0" fill="#38BDF8" font-size="5.5" font-weight="900" text-anchor="middle">8</text>
            <text x="206" y="0" fill="#38BDF8" font-size="5.5" font-weight="900" text-anchor="middle">7</text>
            <text x="222" y="0" fill="#FBBF24" font-size="5.5" font-weight="900" text-anchor="middle">6</text>
            <text x="238" y="0" fill="#10B981" font-size="5.5" font-weight="900" text-anchor="middle">5</text>
            <text x="254" y="0" fill="#F97316" font-size="5.5" font-weight="900" text-anchor="middle">4</text>

            <!-- Furinhos Digitais com Glow-Pulse -->
            ${a9_renderArduinoPin('D13', 110, 11, '#EF4444')}
            ${a9_renderArduinoPin('D12', 126, 11, '#A78BFA')}
            ${a9_renderArduinoPin('D11', 142, 11, '#A78BFA')}
            ${a9_renderArduinoPin('D10', 158, 11, '#38BDF8')}
            ${a9_renderArduinoPin('D9', 174, 11, '#38BDF8')}
            ${a9_renderArduinoPin('D8', 190, 11, '#38BDF8')}
            ${a9_renderArduinoPin('D7', 206, 11, '#38BDF8')}
            ${a9_renderArduinoPin('D6', 222, 11, '#FBBF24')}
            ${a9_renderArduinoPin('D5', 238, 11, '#10B981')}
            ${a9_renderArduinoPin('D4', 254, 11, '#F97316')}

            <!-- BARRA INFERIOR POWER & ANALOG -->
            <rect x="105" y="216" width="180" height="15" fill="#0F172A" stroke="#334155"/>
            <text x="130" y="244" fill="#EF4444" font-size="7.5" font-weight="900">5V</text>
            <text x="155" y="244" fill="#94A3B8" font-size="7.5" font-weight="900">GND</text>
            <text x="185" y="244" fill="#C084FC" font-size="7.5" font-weight="900">A0</text>
            <text x="240" y="244" fill="#E2E8F0" font-size="7.5" font-weight="900">A4</text>
            <text x="265" y="244" fill="#FBBF24" font-size="7.5" font-weight="900">A5</text>

            <!-- Furinhos Power & Analog com Glow-Pulse -->
            ${a9_renderArduinoPin('5V', 130, 223, '#EF4444')}
            ${a9_renderArduinoPin('GND', 155, 223, '#475569')}
            ${a9_renderArduinoPin('A0', 185, 223, '#C084FC')}
            ${a9_renderArduinoPin('A4', 240, 223, '#E2E8F0')}
            ${a9_renderArduinoPin('A5', 265, 223, '#FBBF24')}
        </g>

        <!-- 2. PROTOBOARD BRANCA COM TRILHAS (+) E (-) E SULCO CENTRAL -->
        <g transform="translate(350, 65)">
            <rect x="0" y="0" width="640" height="260" rx="14" fill="url(#a9-bb-grad)" stroke="#CBD5E1" stroke-width="2"/>
            <text x="320" y="16" fill="#94A3B8" font-family="'Fredoka One',cursive" font-size="11" text-anchor="middle" letter-spacing="1">PROTOBOARD MAKER (BANCADA FÍSICA)</text>

            <!-- Trilha Superior (+) Vermelha e (-) Azul -->
            <line x1="20" y1="28" x2="620" y2="28" stroke="#EF4444" stroke-width="1.8" stroke-dasharray="8,4"/>
            <text x="10" y="31" fill="#EF4444" font-weight="900" font-size="10">+</text>
            <line x1="20" y1="42" x2="620" y2="42" stroke="#0284C7" stroke-width="1.8" stroke-dasharray="8,4"/>
            <text x="10" y="45" fill="#0284C7" font-weight="900" font-size="11">-</text>

            <!-- Furinhos das Linhas de Energia Superiores com Glow-Pulse -->
            ${Array.from({ length: 26 }).map((_, i) => `
                ${a9_renderBreadboardHole('rail_vcc', i, null, 35 + i * 22, 28, 2.2, '#334155')}
                ${a9_renderBreadboardHole('rail_gnd', i, null, 35 + i * 22, 42, 2.2, '#334155')}
            `).join('')}

            <!-- CANAL CENTRAL DIVISOR (ISOLA CIMA a-e DE BAIXO f-j) -->
            <rect x="15" y="132" width="610" height="14" fill="#94A3B8" stroke="#64748B"/>
            <text x="320" y="142" fill="#0F172A" font-size="6" font-weight="900" text-anchor="middle" letter-spacing="0.5">
                ⛔ CANAL CENTRAL ISOLADOR: O SINAL NÃO PASSA SEM JUMPER!
            </text>

            <!-- Furinhos do Bloco Superior (a-e) com Glow-Pulse -->
            ${Array.from({ length: 26 }).map((_, col) => `
                ${a9_renderBreadboardHole('hole', col, 'a', 35 + col * 22, 65, 2, '#475569')}
                ${a9_renderBreadboardHole('hole', col, 'b', 35 + col * 22, 78, 2, '#475569')}
                ${a9_renderBreadboardHole('hole', col, 'c', 35 + col * 22, 91, 2, '#475569')}
                ${a9_renderBreadboardHole('hole', col, 'd', 35 + col * 22, 104, 2, '#475569')}
                ${a9_renderBreadboardHole('hole', col, 'e', 35 + col * 22, 117, 2, '#475569')}
            `).join('')}

            <!-- Furinhos do Bloco Inferior (f-j) com Glow-Pulse -->
            ${Array.from({ length: 26 }).map((_, col) => `
                ${a9_renderBreadboardHole('hole', col, 'f', 35 + col * 22, 155, 2, '#475569')}
                ${a9_renderBreadboardHole('hole', col, 'g', 35 + col * 22, 168, 2, '#475569')}
                ${a9_renderBreadboardHole('hole', col, 'h', 35 + col * 22, 181, 2, '#475569')}
                ${a9_renderBreadboardHole('hole', col, 'i', 35 + col * 22, 194, 2, '#475569')}
                ${a9_renderBreadboardHole('hole', col, 'j', 35 + col * 22, 207, 2, '#475569')}
            `).join('')}

            <!-- Trilha Inferior (-) e (+) -->
            <line x1="20" y1="225" x2="620" y2="225" stroke="#0284C7" stroke-width="1.8" stroke-dasharray="8,4"/>
            <text x="10" y="228" fill="#0284C7" font-weight="900" font-size="11">-</text>
            <line x1="20" y1="239" x2="620" y2="239" stroke="#EF4444" stroke-width="1.8" stroke-dasharray="8,4"/>
            <text x="10" y="242" fill="#EF4444" font-weight="900" font-size="10">+</text>

            <!-- Furinhos das Linhas de Energia Inferiores com Glow-Pulse -->
            ${Array.from({ length: 26 }).map((_, i) => `
                ${a9_renderBreadboardHole('rail_bot_gnd', i, null, 35 + i * 22, 225, 2.2, '#334155')}
                ${a9_renderBreadboardHole('rail_bot_vcc', i, null, 35 + i * 22, 239, 2.2, '#334155')}
            `).join('')}
        </g>

        <!-- ================= 3. CONEXÕES & COMPONENTES FÍSICOS REAIS ================= -->

        <!-- 1. ENERGIA MESTRE (5V e GND DO ARDUINO PARA A PROTOBOARD) -->
        ${c.vcc_power ? `
            <path d="M 155 298 C 210 298, 298 250, 312 170 C 322 105, 345 93, 385 93" fill="none" stroke="#EF4444" stroke-width="4.5" stroke-linecap="round"/>
            <circle cx="155" cy="298" r="4.5" fill="#EF4444" stroke="white" stroke-width="1.5"/>
            <circle cx="385" cy="93" r="4.5" fill="#EF4444" stroke="white" stroke-width="1.5"/>
            <!-- Etiqueta de Identificação do Fio 5V -->
            <rect x="250" y="210" width="72" height="18" rx="5" fill="#1E293B" stroke="#EF4444" stroke-width="1.5"/>
            <text x="286" y="222" text-anchor="middle" fill="#FCA5A5" font-size="7" font-weight="900">5V Mestre</text>
        ` : `
            <g class="a9-snap-target" onclick="a9_snapComponent('vcc_power')" title="Encaixar Fio 5V Mestre na Trilha Vermelha">
                ${isPinActive('vcc_power') ? `
                    <circle cx="385" cy="93" r="6" fill="none" stroke="#EF4444" class="a9-beacon-ring" style="--glow-c:#EF4444;"/>
                    <circle cx="385" cy="93" r="6" fill="none" stroke="#EF4444" class="a9-beacon-ring delayed" style="--glow-c:#EF4444;"/>
                    <circle cx="385" cy="93" r="8" fill="rgba(239,68,68,0.4)" stroke="#EF4444" stroke-width="3" class="a9-pin-core glow-active" style="--glow-c:#EF4444;"/>
                    <circle cx="385" cy="93" r="3" fill="#FFFFFF"/>
                    <text x="385" y="78" text-anchor="middle" fill="#EF4444" font-size="8" font-weight="900" class="a9-guide-arrow">👇 5V (+)</text>
                    <circle cx="155" cy="298" r="6" fill="none" stroke="#EF4444" class="a9-beacon-ring" style="--glow-c:#EF4444;"/>
                    <circle cx="155" cy="298" r="7" fill="#EF4444" stroke="#FFFFFF" stroke-width="2" class="a9-pin-core glow-active" style="--glow-c:#EF4444;"/>
                    <text x="155" y="320" text-anchor="middle" fill="#EF4444" font-size="7" font-weight="900" class="a9-guide-arrow">5V</text>
                ` : `
                    <circle cx="385" cy="93" r="6.5" fill="rgba(239,68,68,0.25)" stroke="#EF4444" stroke-width="2" class="a9-pin-core glow-soft" style="--glow-c:#EF4444;"/>
                    <text x="385" y="82" text-anchor="middle" fill="#FCA5A5" font-size="6" font-weight="bold">5V (+)</text>
                `}
            </g>
        `}

        ${c.gnd_power ? `
            <path d="M 180 298 C 230 298, 318 250, 332 170 C 342 110, 365 107, 407 107" fill="none" stroke="#334155" stroke-width="4.5" stroke-linecap="round"/>
            <circle cx="180" cy="298" r="4.5" fill="#334155" stroke="white" stroke-width="1.5"/>
            <circle cx="407" cy="107" r="4.5" fill="#334155" stroke="white" stroke-width="1.5"/>
            <!-- Etiqueta de Identificação do Fio GND -->
            <rect x="246" y="246" width="80" height="18" rx="5" fill="#1E293B" stroke="#38BDF8" stroke-width="1.5"/>
            <text x="286" y="258" text-anchor="middle" fill="#BAE6FD" font-size="7" font-weight="900">GND Mestre</text>
        ` : `
            <g class="a9-snap-target" onclick="a9_snapComponent('gnd_power')" title="Encaixar Fio GND Mestre na Trilha Azul">
                ${isPinActive('gnd_power') ? `
                    <circle cx="407" cy="107" r="6" fill="none" stroke="#38BDF8" class="a9-beacon-ring" style="--glow-c:#38BDF8;"/>
                    <circle cx="407" cy="107" r="6" fill="none" stroke="#38BDF8" class="a9-beacon-ring delayed" style="--glow-c:#38BDF8;"/>
                    <circle cx="407" cy="107" r="8" fill="rgba(56,189,248,0.4)" stroke="#38BDF8" stroke-width="3" class="a9-pin-core glow-active" style="--glow-c:#38BDF8;"/>
                    <circle cx="407" cy="107" r="3" fill="#FFFFFF"/>
                    <text x="407" y="93" text-anchor="middle" fill="#38BDF8" font-size="8" font-weight="900" class="a9-guide-arrow">👇 GND (-)</text>
                    <circle cx="180" cy="298" r="6" fill="none" stroke="#38BDF8" class="a9-beacon-ring" style="--glow-c:#38BDF8;"/>
                    <circle cx="180" cy="298" r="7" fill="#38BDF8" stroke="#FFFFFF" stroke-width="2" class="a9-pin-core glow-active" style="--glow-c:#38BDF8;"/>
                    <text x="180" y="320" text-anchor="middle" fill="#38BDF8" font-size="7" font-weight="900" class="a9-guide-arrow">GND</text>
                ` : `
                    <circle cx="407" cy="107" r="6.5" fill="rgba(56,189,248,0.25)" stroke="#38BDF8" stroke-width="2" class="a9-pin-core glow-soft" style="--glow-c:#38BDF8;"/>
                    <text x="407" y="96" text-anchor="middle" fill="#BAE6FD" font-size="6" font-weight="bold">GND (-)</text>
                `}
            </g>
        `}

        <!-- 2. SENSOR HC-SR04 (CORPO + VCC + GND + TRIG + ECHO) -->
        ${c.sonar_module ? `
            <g transform="translate(450, 130)">
                <rect x="0" y="0" width="95" height="46" rx="6" fill="#0284C7" stroke="#38BDF8" stroke-width="1.8"/>
                <!-- Cilindro T -->
                <circle cx="26" cy="23" r="15" fill="#CBD5E1" stroke="#94A3B8" stroke-width="1.5"/>
                <circle cx="26" cy="23" r="6" fill="#1E293B"/>
                <text x="26" y="26" fill="white" font-size="6" font-weight="900" text-anchor="middle">T</text>
                <!-- Cilindro R -->
                <circle cx="68" cy="23" r="15" fill="#CBD5E1" stroke="#94A3B8" stroke-width="1.5"/>
                <circle cx="68" cy="23" r="6" fill="#1E293B"/>
                <text x="68" y="26" fill="white" font-size="6" font-weight="900" text-anchor="middle">R</text>
                <!-- Legenda dos 4 pinos nos furos: 460(VCC), 482(Trig), 504(Echo), 526(GND) -->
                <text x="47" y="42" fill="#E0F2FE" font-size="5" font-weight="bold" text-anchor="middle">HC-SR04 (VCC | Trig | Echo | GND)</text>
            </g>
        ` : `
            <g class="a9-snap-target" onclick="a9_snapComponent('sonar_module')" title="Encaixar HC-SR04 nas colunas 5 a 8">
                <rect x="450" y="130" width="95" height="46" rx="8" fill="rgba(2,132,199,0.2)" stroke="#38BDF8" stroke-width="${isPinActive('sonar_module') ? '3' : '2'}" stroke-dasharray="4,3" class="a9-pin-core ${isPinActive('sonar_module') ? 'glow-active' : 'glow-soft'}" style="--glow-c:#38BDF8;"/>
                <text x="497" y="157" text-anchor="middle" fill="#38BDF8" font-size="8.5" font-weight="900" class="${isPinActive('sonar_module') ? 'a9-guide-arrow' : ''}">🦇 Encaixar HC-SR04</text>
            </g>
        `}

        <!-- Jumper VCC do HC-SR04 (Trilha + ➔ Coluna 5) -->
        ${c.sonar_vcc ? `
            <line x1="460" y1="93" x2="460" y2="135" stroke="#EF4444" stroke-width="3.5" stroke-linecap="round"/>
            <circle cx="460" cy="93" r="3.5" fill="#EF4444" stroke="white" stroke-width="1"/>
            <circle cx="460" cy="135" r="3.5" fill="#EF4444" stroke="white" stroke-width="1"/>
        ` : (c.sonar_module ? `
            <g class="a9-snap-target" onclick="a9_snapComponent('sonar_vcc')" title="Ligar 5V no VCC do HC-SR04">
                <circle cx="460" cy="135" r="5" fill="none" stroke="#EF4444" class="a9-beacon-ring" style="--glow-c:#EF4444;"/>
                <circle cx="460" cy="135" r="6" fill="rgba(239,68,68,0.4)" stroke="#EF4444" stroke-width="2.5" class="a9-pin-core ${isPinActive('sonar_vcc') ? 'glow-active' : 'glow-soft'}" style="--glow-c:#EF4444;"/>
                <text x="460" y="125" text-anchor="middle" fill="#EF4444" font-size="6" font-weight="bold">VCC</text>
            </g>
        ` : '')}

        <!-- Jumper GND do HC-SR04 (Trilha - ➔ Coluna 8) -->
        ${c.sonar_gnd ? `
            <line x1="526" y1="107" x2="526" y2="135" stroke="#334155" stroke-width="3.5" stroke-linecap="round"/>
            <circle cx="526" cy="107" r="3.5" fill="#334155" stroke="white" stroke-width="1"/>
            <circle cx="526" cy="135" r="3.5" fill="#334155" stroke="white" stroke-width="1"/>
        ` : (c.sonar_module ? `
            <g class="a9-snap-target" onclick="a9_snapComponent('sonar_gnd')" title="Ligar GND no Terra do HC-SR04">
                <circle cx="526" cy="135" r="5" fill="none" stroke="#94A3B8" class="a9-beacon-ring" style="--glow-c:#94A3B8;"/>
                <circle cx="526" cy="135" r="6" fill="rgba(148,163,184,0.4)" stroke="#94A3B8" stroke-width="2.5" class="a9-pin-core ${isPinActive('sonar_gnd') ? 'glow-active' : 'glow-soft'}" style="--glow-c:#94A3B8;"/>
                <text x="526" y="125" text-anchor="middle" fill="#94A3B8" font-size="6" font-weight="bold">GND</text>
            </g>
        ` : '')}

        <!-- Jumper Trig (D6 ➔ Coluna 6) - Arco aéreo dedicado y=48 (Sem sobretraçar) -->
        ${c.sonar_trig ? `
            <path d="M 247 86 C 255 48, 482 48, 482 135" fill="none" stroke="#FBBF24" stroke-width="4" stroke-linecap="round"/>
            <circle cx="247" cy="86" r="4" fill="#FBBF24" stroke="white" stroke-width="1"/>
            <circle cx="482" cy="135" r="4" fill="#FBBF24" stroke="white" stroke-width="1"/>
            <!-- Etiqueta de Identificação D6 ➔ Trig -->
            <rect x="325" y="39" width="84" height="17" rx="5" fill="#1E293B" stroke="#FBBF24" stroke-width="1.5"/>
            <text x="367" y="50" text-anchor="middle" fill="#FDE68A" font-size="6.5" font-weight="900">D6 ➔ Trig</text>
        ` : (c.sonar_module ? `
            <g class="a9-snap-target" onclick="a9_snapComponent('sonar_trig')" title="Ligar D6 no Trig">
                <circle cx="482" cy="135" r="5" fill="none" stroke="#FBBF24" class="a9-beacon-ring" style="--glow-c:#FBBF24;"/>
                <circle cx="482" cy="135" r="6.5" fill="rgba(251,191,36,0.4)" stroke="#FBBF24" stroke-width="2.5" class="a9-pin-core ${isPinActive('sonar_trig') ? 'glow-active' : 'glow-soft'}" style="--glow-c:#FBBF24;"/>
                <text x="482" y="125" text-anchor="middle" fill="#FBBF24" font-size="6" font-weight="bold">Trig (D6)</text>
                <circle cx="247" cy="86" r="6" fill="none" stroke="#FBBF24" class="a9-beacon-ring" style="--glow-c:#FBBF24;"/>
                <circle cx="247" cy="86" r="7" fill="#FBBF24" stroke="#FFFFFF" stroke-width="2" class="a9-pin-core glow-active" style="--glow-c:#FBBF24;"/>
            </g>
        ` : '')}

        <!-- Jumper Echo (D5 ➔ Coluna 7) - Arco aéreo dedicado y=64 (Sem sobretraçar) -->
        ${c.sonar_echo ? `
            <path d="M 263 86 C 270 64, 504 64, 504 135" fill="none" stroke="#10B981" stroke-width="4" stroke-linecap="round"/>
            <circle cx="263" cy="86" r="4" fill="#10B981" stroke="white" stroke-width="1"/>
            <circle cx="504" cy="135" r="4" fill="#10B981" stroke="white" stroke-width="1"/>
            <!-- Etiqueta de Identificação D5 ➔ Echo -->
            <rect x="345" y="55" width="84" height="17" rx="5" fill="#1E293B" stroke="#10B981" stroke-width="1.5"/>
            <text x="387" y="66" text-anchor="middle" fill="#A7F3D0" font-size="6.5" font-weight="900">D5 ➔ Echo</text>
        ` : (c.sonar_module ? `
            <g class="a9-snap-target" onclick="a9_snapComponent('sonar_echo')" title="Ligar D5 no Echo">
                <circle cx="504" cy="135" r="5" fill="none" stroke="#10B981" class="a9-beacon-ring" style="--glow-c:#10B981;"/>
                <circle cx="504" cy="135" r="6.5" fill="rgba(16,185,129,0.4)" stroke="#10B981" stroke-width="2.5" class="a9-pin-core ${isPinActive('sonar_echo') ? 'glow-active' : 'glow-soft'}" style="--glow-c:#10B981;"/>
                <text x="504" y="125" text-anchor="middle" fill="#10B981" font-size="6" font-weight="bold">Echo (D5)</text>
                <circle cx="263" cy="86" r="6" fill="none" stroke="#10B981" class="a9-beacon-ring" style="--glow-c:#10B981;"/>
                <circle cx="263" cy="86" r="7" fill="#10B981" stroke="#FFFFFF" stroke-width="2" class="a9-pin-core glow-active" style="--glow-c:#10B981;"/>
            </g>
        ` : '')}

        <!-- 3. SENSOR DE SOM (CORPO + VCC + GND + OUT) -->
        ${c.sound_module ? `
            <g transform="translate(595, 130)">
                <rect x="0" y="0" width="75" height="46" rx="6" fill="#1E293B" stroke="#EC4899" stroke-width="1.8"/>
                <circle cx="24" cy="23" r="13" fill="#CBD5E1" stroke="#E2E8F0" stroke-width="1.5"/>
                <circle cx="24" cy="23" r="5.5" fill="#0F172A"/>
                <text x="24" y="25" fill="#E2E8F0" font-size="5" font-weight="bold" text-anchor="middle">MIC</text>
                <rect x="44" y="14" width="18" height="18" rx="2" fill="#020617" stroke="#38BDF8"/>
                <text x="53" y="26" fill="#67E8F9" font-size="5" font-weight="bold" text-anchor="middle">LMV</text>
                <!-- Pinos: 605(VCC), 627(GND), 649(OUT) -->
                <text x="37.5" y="42" fill="#F472B6" font-size="4.5" font-weight="bold" text-anchor="middle">VCC | GND | OUT</text>
            </g>
        ` : `
            <g class="a9-snap-target" onclick="a9_snapComponent('sound_module')" title="Encaixar Sensor de Som nas colunas 12 a 14">
                <rect x="595" y="130" width="75" height="46" rx="8" fill="rgba(236,72,153,0.2)" stroke="#EC4899" stroke-width="${isPinActive('sound_module') ? '3' : '2'}" stroke-dasharray="4,3" class="a9-pin-core ${isPinActive('sound_module') ? 'glow-active' : 'glow-soft'}" style="--glow-c:#EC4899;"/>
                <text x="632.5" y="157" text-anchor="middle" fill="#EC4899" font-size="8" font-weight="900" class="${isPinActive('sound_module') ? 'a9-guide-arrow' : ''}">👂 Sensor de Som</text>
            </g>
        `}

        <!-- Jumper VCC do Som (Trilha + ➔ Coluna 12) -->
        ${c.sound_vcc ? `
            <line x1="605" y1="93" x2="605" y2="135" stroke="#EF4444" stroke-width="3.5" stroke-linecap="round"/>
            <circle cx="605" cy="93" r="3.5" fill="#EF4444" stroke="white" stroke-width="1"/>
            <circle cx="605" cy="135" r="3.5" fill="#EF4444" stroke="white" stroke-width="1"/>
        ` : (c.sound_module ? `
            <g class="a9-snap-target" onclick="a9_snapComponent('sound_vcc')" title="Ligar 5V no VCC do Som">
                <circle cx="605" cy="135" r="5" fill="none" stroke="#EF4444" class="a9-beacon-ring" style="--glow-c:#EF4444;"/>
                <circle cx="605" cy="135" r="6" fill="rgba(239,68,68,0.4)" stroke="#EF4444" stroke-width="2.5" class="a9-pin-core ${isPinActive('sound_vcc') ? 'glow-active' : 'glow-soft'}" style="--glow-c:#EF4444;"/>
                <text x="605" y="125" text-anchor="middle" fill="#EF4444" font-size="6" font-weight="bold">VCC</text>
            </g>
        ` : '')}

        <!-- Jumper GND do Som (Trilha - ➔ Coluna 13) -->
        ${c.sound_gnd ? `
            <line x1="627" y1="107" x2="627" y2="135" stroke="#334155" stroke-width="3.5" stroke-linecap="round"/>
            <circle cx="627" cy="107" r="3.5" fill="#334155" stroke="white" stroke-width="1"/>
            <circle cx="627" cy="135" r="3.5" fill="#334155" stroke="white" stroke-width="1"/>
        ` : (c.sound_module ? `
            <g class="a9-snap-target" onclick="a9_snapComponent('sound_gnd')" title="Ligar GND no Terra do Som">
                <circle cx="627" cy="135" r="5" fill="none" stroke="#94A3B8" class="a9-beacon-ring" style="--glow-c:#94A3B8;"/>
                <circle cx="627" cy="135" r="6" fill="rgba(148,163,184,0.4)" stroke="#94A3B8" stroke-width="2.5" class="a9-pin-core ${isPinActive('sound_gnd') ? 'glow-active' : 'glow-soft'}" style="--glow-c:#94A3B8;"/>
                <text x="627" y="125" text-anchor="middle" fill="#94A3B8" font-size="6" font-weight="bold">GND</text>
            </g>
        ` : '')}

        <!-- Jumper OUT do Som (Coluna 14 ➔ Arduino A0) - Canal central protegido y=202 (Sem sobretraçar LCD) -->
        ${c.sound_out ? `
            <path d="M 210 298 C 245 298, 335 210, 360 202 L 649 202 L 649 135" fill="none" stroke="#C084FC" stroke-width="4" stroke-linecap="round"/>
            <circle cx="210" cy="298" r="4" fill="#C084FC" stroke="white" stroke-width="1"/>
            <circle cx="649" cy="135" r="4" fill="#C084FC" stroke="white" stroke-width="1"/>
            <!-- Etiqueta de Identificação A0 ➔ Som OUT -->
            <rect x="455" y="193" width="94" height="17" rx="5" fill="#1E293B" stroke="#C084FC" stroke-width="1.5"/>
            <text x="502" y="204" text-anchor="middle" fill="#E9D5FF" font-size="6.5" font-weight="900">A0 ➔ Som OUT</text>
        ` : (c.sound_module ? `
            <g class="a9-snap-target" onclick="a9_snapComponent('sound_out')" title="Ligar OUT no pino A0">
                <circle cx="649" cy="135" r="5" fill="none" stroke="#C084FC" class="a9-beacon-ring" style="--glow-c:#C084FC;"/>
                <circle cx="649" cy="135" r="6.5" fill="rgba(192,132,252,0.4)" stroke="#C084FC" stroke-width="2.5" class="a9-pin-core ${isPinActive('sound_out') ? 'glow-active' : 'glow-soft'}" style="--glow-c:#C084FC;"/>
                <text x="649" y="125" text-anchor="middle" fill="#C084FC" font-size="6" font-weight="bold">OUT (A0)</text>
                <circle cx="210" cy="298" r="6" fill="none" stroke="#C084FC" class="a9-beacon-ring" style="--glow-c:#C084FC;"/>
                <circle cx="210" cy="298" r="7" fill="#C084FC" stroke="#FFFFFF" stroke-width="2" class="a9-pin-core glow-active" style="--glow-c:#C084FC;"/>
            </g>
        ` : '')}

        <!-- 4. FARÓIS LED + RESISTOR 220Ω -->
        <!-- LED Vermelho 5mm nas colunas 18 (Ânodo) e 19 (Cátodo) -->
        ${c.led_component ? `
            <g transform="translate(720, 132)">
                <path d="M 16 16 C 16 3, 30 3, 30 16 Z" fill="#EF4444" stroke="#DC2626" stroke-width="1.5"/>
                <rect x="14" y="16" width="18" height="4" rx="1" fill="#B91C1C"/>
                <!-- Pernas nos furos: Col 18 (x=730) e Col 19 (x=752) -->
                <line x1="20" y1="20" x2="10" y2="35" stroke="#FDE68A" stroke-width="2"/>
                <line x1="26" y1="20" x2="32" y2="35" stroke="#CBD5E1" stroke-width="2"/>
                <text x="23" y="44" fill="#FCA5A5" font-size="5.5" font-weight="bold" text-anchor="middle">LED (+ | -)</text>
            </g>
        ` : `
            <g class="a9-snap-target" onclick="a9_snapComponent('led_component')" title="Encaixar LED Vermelho nas colunas 18 e 19">
                <rect x="720" y="132" width="45" height="42" rx="8" fill="rgba(239,68,68,0.2)" stroke="#EF4444" stroke-width="${isPinActive('led_component') ? '3' : '2'}" stroke-dasharray="4,3" class="a9-pin-core ${isPinActive('led_component') ? 'glow-active' : 'glow-soft'}" style="--glow-c:#EF4444;"/>
                <text x="742.5" y="157" text-anchor="middle" fill="#EF4444" font-size="7.5" font-weight="900" class="${isPinActive('led_component') ? 'a9-guide-arrow' : ''}">💡 LED 5mm</text>
            </g>
        `}

        <!-- Resistor de 220Ω: Liga Coluna 19 (Cátodo) até a Trilha (-) GND -->
        ${c.resistor_220 ? `
            <g transform="translate(748, 107)">
                <line x1="4" y1="0" x2="4" y2="35" stroke="#94A3B8" stroke-width="2"/>
                <rect x="0" y="8" width="8" height="18" rx="2" fill="#D97706" stroke="#92400E"/>
                <line x1="0" y1="12" x2="8" y2="12" stroke="#EF4444" stroke-width="1.5"/>
                <line x1="0" y1="15" x2="8" y2="15" stroke="#EF4444" stroke-width="1.5"/>
                <line x1="0" y1="18" x2="8" y2="18" stroke="#78350F" stroke-width="1.5"/>
                <text x="14" y="20" fill="#FDE68A" font-size="5" font-weight="900">220Ω</text>
            </g>
        ` : (c.led_component ? `
            <g class="a9-snap-target" onclick="a9_snapComponent('resistor_220')" title="Ligar Resistor 220Ω do Cátodo para o GND">
                <line x1="752" y1="107" x2="752" y2="142" stroke="#D97706" stroke-width="3" stroke-dasharray="3,2" class="a9-pin-core ${isPinActive('resistor_220') ? 'glow-active' : 'glow-soft'}" style="--glow-c:#D97706;"/>
                <circle cx="752" cy="125" r="7" fill="rgba(217,119,6,0.4)" stroke="#D97706" stroke-width="2"/>
                <text x="768" y="127" fill="#FDE68A" font-size="6" font-weight="900">220Ω ➔ GND</text>
            </g>
        ` : '')}

        <!-- Jumper D13 do Arduino ➔ Coluna 18 (Ânodo do LED) - Arco aéreo superior y=12 (Mais alto, sem sobretraçar) -->
        ${c.led_d13 ? `
            <path d="M 135 86 C 135 12, 730 12, 730 142" fill="none" stroke="#38BDF8" stroke-width="4" stroke-linecap="round"/>
            <circle cx="135" cy="86" r="4" fill="#38BDF8" stroke="white" stroke-width="1"/>
            <circle cx="730" cy="142" r="4" fill="#38BDF8" stroke="white" stroke-width="1"/>
            <!-- Etiqueta de Identificação D13 ➔ LED -->
            <rect x="375" y="4" width="96" height="17" rx="5" fill="#1E293B" stroke="#38BDF8" stroke-width="1.5"/>
            <text x="423" y="15" text-anchor="middle" fill="#BAE6FD" font-size="6.5" font-weight="900">D13 ➔ LED (+ Farol)</text>
        ` : (c.led_component ? `
            <g class="a9-snap-target" onclick="a9_snapComponent('led_d13')" title="Conectar D13 no Ânodo do LED">
                <circle cx="730" cy="142" r="5" fill="none" stroke="#38BDF8" class="a9-beacon-ring" style="--glow-c:#38BDF8;"/>
                <circle cx="730" cy="142" r="6.5" fill="rgba(56,189,248,0.4)" stroke="#38BDF8" stroke-width="2.5" class="a9-pin-core ${isPinActive('led_d13') ? 'glow-active' : 'glow-soft'}" style="--glow-c:#38BDF8;"/>
                <text x="730" y="125" text-anchor="middle" fill="#38BDF8" font-size="6" font-weight="bold">D13 (Luz)</text>
                <circle cx="135" cy="86" r="6" fill="none" stroke="#38BDF8" class="a9-beacon-ring" style="--glow-c:#38BDF8;"/>
                <circle cx="135" cy="86" r="7" fill="#38BDF8" stroke="#FFFFFF" stroke-width="2" class="a9-pin-core glow-active" style="--glow-c:#38BDF8;"/>
            </g>
        ` : '')}

        <!-- 5. ALARME BUZZER DE RÉ (CORPO + SINAL D4 + RETORNO GND) -->
        ${c.buzzer_component ? `
            <g transform="translate(830, 126)">
                <circle cx="22" cy="22" r="20" fill="#1E293B" stroke="#F97316" stroke-width="2"/>
                <circle cx="22" cy="22" r="7" fill="#0F172A"/>
                <text x="12" y="16" fill="#F97316" font-size="7" font-weight="900">+</text>
                <text x="32" y="16" fill="#94A3B8" font-size="8" font-weight="900">-</text>
                <text x="22" y="49" fill="#FDBA74" font-size="5.5" font-weight="bold" text-anchor="middle">BUZZER (+ | -)</text>
            </g>
        ` : `
            <g class="a9-snap-target" onclick="a9_snapComponent('buzzer_component')" title="Encaixar Buzzer nas colunas 23 e 24">
                <circle cx="852" cy="148" r="20" fill="rgba(249,115,22,0.15)" stroke="#F97316" stroke-width="${isPinActive('buzzer_component') ? '3' : '2'}" stroke-dasharray="4,3" class="a9-pin-core ${isPinActive('buzzer_component') ? 'glow-active' : 'glow-soft'}" style="--glow-c:#F97316;"/>
                <text x="852" y="151" text-anchor="middle" fill="#F97316" font-size="7" font-weight="900" class="${isPinActive('buzzer_component') ? 'a9-guide-arrow' : ''}">🔔 Buzzer</text>
            </g>
        `}

        <!-- Jumper Sinal D4 ➔ Coluna 23 (+) do Buzzer - Arco aéreo y=30 (Sem sobretraçar) -->
        ${c.buzzer_signal ? `
            <path d="M 279 86 C 295 30, 842 30, 842 142" fill="none" stroke="#F97316" stroke-width="4" stroke-linecap="round"/>
            <circle cx="279" cy="86" r="4" fill="#F97316" stroke="white" stroke-width="1"/>
            <circle cx="842" cy="142" r="4" fill="#F97316" stroke="white" stroke-width="1"/>
            <!-- Etiqueta de Identificação D4 ➔ Buzzer -->
            <rect x="560" y="21" width="100" height="17" rx="5" fill="#1E293B" stroke="#F97316" stroke-width="1.5"/>
            <text x="610" y="32" text-anchor="middle" fill="#FED7AA" font-size="6.5" font-weight="900">D4 ➔ Buzzer (+)</text>
        ` : (c.buzzer_component ? `
            <g class="a9-snap-target" onclick="a9_snapComponent('buzzer_signal')" title="Ligar D4 no (+) do Buzzer">
                <circle cx="842" cy="142" r="5" fill="none" stroke="#F97316" class="a9-beacon-ring" style="--glow-c:#F97316;"/>
                <circle cx="842" cy="142" r="6.5" fill="rgba(249,115,22,0.4)" stroke="#F97316" stroke-width="2.5" class="a9-pin-core ${isPinActive('buzzer_signal') ? 'glow-active' : 'glow-soft'}" style="--glow-c:#F97316;"/>
                <text x="842" y="125" text-anchor="middle" fill="#F97316" font-size="6" font-weight="bold">D4 (+)</text>
                <circle cx="279" cy="86" r="6" fill="none" stroke="#F97316" class="a9-beacon-ring" style="--glow-c:#F97316;"/>
                <circle cx="279" cy="86" r="7" fill="#F97316" stroke="#FFFFFF" stroke-width="2" class="a9-pin-core glow-active" style="--glow-c:#F97316;"/>
            </g>
        ` : '')}

        <!-- Jumper GND ➔ Coluna 24 (-) do Buzzer -->
        ${c.buzzer_gnd ? `
            <line x1="862" y1="107" x2="862" y2="142" stroke="#334155" stroke-width="3.5" stroke-linecap="round"/>
            <circle cx="862" cy="107" r="3.5" fill="#334155" stroke="white" stroke-width="1"/>
            <circle cx="862" cy="142" r="3.5" fill="#334155" stroke="white" stroke-width="1"/>
        ` : (c.buzzer_component ? `
            <g class="a9-snap-target" onclick="a9_snapComponent('buzzer_gnd')" title="Ligar GND no (-) do Buzzer">
                <circle cx="862" cy="142" r="5" fill="none" stroke="#94A3B8" class="a9-beacon-ring" style="--glow-c:#94A3B8;"/>
                <circle cx="862" cy="142" r="6" fill="rgba(148,163,184,0.4)" stroke="#94A3B8" stroke-width="2.5" class="a9-pin-core ${isPinActive('buzzer_gnd') ? 'glow-active' : 'glow-soft'}" style="--glow-c:#94A3B8;"/>
                <text x="862" y="125" text-anchor="middle" fill="#94A3B8" font-size="6" font-weight="bold">GND (-)</text>
            </g>
        ` : '')}

        <!-- 6. DISPLAY LCD 16x2 DIRETO (SEM I2C & SEM POTENCIÔMETRO: 12 CABOS REAIS) -->
        ${c.lcd_module ? `
            <g transform="translate(320, 345)">
                <rect x="0" y="0" width="660" height="155" rx="12" fill="#064E3B" stroke="#059669" stroke-width="2.5"/>
                <!-- TELA DE CRISTAL LÍQUIDO VERDE MATRIZ -->
                <rect x="25" y="46" width="610" height="96" rx="6" fill="#022C22" stroke="#047857"/>
                <text x="45" y="78" fill="#A7F3D0" font-family="monospace" font-size="14" font-weight="900">GARAGEM INTELIGENTE</text>
                <text x="45" y="102" fill="#6EE7B7" font-family="monospace" font-size="12" font-weight="bold">LCD 16x2: 12 FIOS REAIS (SEM I2C &amp; SEM POTENCIOMETRO)</text>
                <text x="45" y="126" fill="#38BDF8" font-family="monospace" font-size="10.5">6 Pinos Arduino (D12..D7) + 6 Pinos Protoboard (5V/GND)</text>

                <!-- BARRA DE CONECTOR DOS 16 PINOS FÍSICOS HD44780 -->
                <rect x="15" y="6" width="630" height="32" rx="4" fill="#020617" stroke="#334155"/>
                
                <!-- Rótulos dos 16 Pinos Físicos -->
                <text x="30" y="18" fill="#94A3B8" font-size="6" font-weight="900" text-anchor="middle">1:VSS</text>
                <text x="70" y="18" fill="#EF4444" font-size="6" font-weight="900" text-anchor="middle">2:VDD</text>
                <text x="110" y="18" fill="#FBBF24" font-size="6" font-weight="900" text-anchor="middle">3:V0</text>
                <text x="150" y="18" fill="#A78BFA" font-size="6" font-weight="900" text-anchor="middle">4:RS</text>
                <text x="190" y="18" fill="#94A3B8" font-size="6" font-weight="900" text-anchor="middle">5:RW</text>
                <text x="230" y="18" fill="#C084FC" font-size="6" font-weight="900" text-anchor="middle">6:E</text>

                <!-- Pinos 7 a 10 VAZIOS no modo 4-bits -->
                <rect x="252" y="9" width="156" height="24" rx="3" fill="rgba(15,23,42,0.7)" stroke="#475569" stroke-dasharray="2,2"/>
                <text x="330" y="24" fill="#64748B" font-size="6.5" font-weight="bold" text-anchor="middle">🚫 7..10: D0 a D3 Vazios (Modo 4-Bits)</text>

                <!-- Pinos de Dados D4 a D7 -->
                <text x="430" y="18" fill="#38BDF8" font-size="6" font-weight="900" text-anchor="middle">11:D4</text>
                <text x="470" y="18" fill="#0284C7" font-size="6" font-weight="900" text-anchor="middle">12:D5</text>
                <text x="510" y="18" fill="#06B6D4" font-size="6" font-weight="900" text-anchor="middle">13:D6</text>
                <text x="550" y="18" fill="#14B8A6" font-size="6" font-weight="900" text-anchor="middle">14:D7</text>

                <!-- Pinos da Luz de Fundo (Backlight) -->
                <text x="590" y="18" fill="#EF4444" font-size="6" font-weight="900" text-anchor="middle">15:A</text>
                <text x="630" y="18" fill="#94A3B8" font-size="6" font-weight="900" text-anchor="middle">16:K</text>
            </g>
        ` : `
            <g class="a9-snap-target" onclick="a9_snapComponent('lcd_module')" title="Posicionar Display LCD 16x2 (Sem I2C)">
                <rect x="320" y="345" width="660" height="155" rx="12" fill="rgba(20,184,166,0.12)" stroke="#14B8A6" stroke-width="${isPinActive('lcd_module') ? '3.5' : '2'}" stroke-dasharray="6,4" class="a9-pin-core ${isPinActive('lcd_module') ? 'glow-active' : 'glow-soft'}" style="--glow-c:#14B8A6;"/>
                <text x="650" y="415" text-anchor="middle" fill="#2DD4BF" font-family="'Fredoka One',cursive" font-size="14" class="${isPinActive('lcd_module') ? 'a9-guide-arrow' : ''}">
                    ${isPinActive('lcd_module') ? '👇 ' : ''}📟 Encaixar Display LCD 16x2 (Painel HD44780 de 16 Pinos)
                </text>
                <text x="650" y="440" text-anchor="middle" fill="#99F6E4" font-size="9" font-weight="bold">
                    Conexão 4-Bits Direta: 12 cabos físicos no total (sem I2C e sem potenciômetro/dimmer)!
                </text>
            </g>
        `}

        <!-- ================= 12 CABOS INDIVIDUAIS DO LCD 16x2 ================= -->

        <!-- 1. Jumper VSS (Pino 1 LCD ➔ Trilha Azul GND) -->
        ${c.lcd_vss ? `
            <line x1="350" y1="368" x2="350" y2="290" stroke="#334155" stroke-width="3.5" stroke-linecap="round"/>
            <circle cx="350" cy="368" r="3.5" fill="#334155" stroke="white" stroke-width="1"/>
            <circle cx="350" cy="290" r="3.5" fill="#334155" stroke="white" stroke-width="1"/>
        ` : (c.lcd_module ? `
            <g class="a9-snap-target" onclick="a9_snapComponent('lcd_vss')" title="Ligar Pino 1 (VSS) na Trilha Azul GND">
                <circle cx="350" cy="368" r="5" fill="none" stroke="#94A3B8" class="a9-beacon-ring" style="--glow-c:#94A3B8;"/>
                <circle cx="350" cy="368" r="6" fill="rgba(148,163,184,0.4)" stroke="#94A3B8" stroke-width="2.5" class="a9-pin-core ${isPinActive('lcd_vss') ? 'glow-active' : 'glow-soft'}" style="--glow-c:#94A3B8;"/>
                <text x="350" y="340" text-anchor="middle" fill="#94A3B8" font-size="6" font-weight="900">VSS</text>
            </g>
        ` : '')}

        <!-- 2. Jumper VDD (Pino 2 LCD ➔ Trilha Vermelha 5V) -->
        ${c.lcd_vdd ? `
            <line x1="390" y1="368" x2="390" y2="304" stroke="#EF4444" stroke-width="3.5" stroke-linecap="round"/>
            <circle cx="390" cy="368" r="3.5" fill="#EF4444" stroke="white" stroke-width="1"/>
            <circle cx="390" cy="304" r="3.5" fill="#EF4444" stroke="white" stroke-width="1"/>
        ` : (c.lcd_module ? `
            <g class="a9-snap-target" onclick="a9_snapComponent('lcd_vdd')" title="Ligar Pino 2 (VDD) na Trilha Vermelha 5V">
                <circle cx="390" cy="368" r="5" fill="none" stroke="#EF4444" class="a9-beacon-ring" style="--glow-c:#EF4444;"/>
                <circle cx="390" cy="368" r="6" fill="rgba(239,68,68,0.4)" stroke="#EF4444" stroke-width="2.5" class="a9-pin-core ${isPinActive('lcd_vdd') ? 'glow-active' : 'glow-soft'}" style="--glow-c:#EF4444;"/>
                <text x="390" y="340" text-anchor="middle" fill="#EF4444" font-size="6" font-weight="900">VDD</text>
            </g>
        ` : '')}

        <!-- 3. Jumper V0 (Pino 3 LCD ➔ Trilha Azul GND - Contraste Fixo Máximo) -->
        ${c.lcd_v0 ? `
            <line x1="430" y1="368" x2="430" y2="290" stroke="#475569" stroke-width="3.5" stroke-linecap="round"/>
            <circle cx="430" cy="368" r="3.5" fill="#475569" stroke="white" stroke-width="1"/>
            <circle cx="430" cy="290" r="3.5" fill="#475569" stroke="white" stroke-width="1"/>
        ` : (c.lcd_module ? `
            <g class="a9-snap-target" onclick="a9_snapComponent('lcd_v0')" title="Ligar Pino 3 (V0) no GND para Contraste Máximo">
                <circle cx="430" cy="368" r="5" fill="none" stroke="#FBBF24" class="a9-beacon-ring" style="--glow-c:#FBBF24;"/>
                <circle cx="430" cy="368" r="6" fill="rgba(251,191,36,0.4)" stroke="#FBBF24" stroke-width="2.5" class="a9-pin-core ${isPinActive('lcd_v0') ? 'glow-active' : 'glow-soft'}" style="--glow-c:#FBBF24;"/>
                <text x="430" y="340" text-anchor="middle" fill="#FBBF24" font-size="6" font-weight="900">V0(GND)</text>
            </g>
        ` : '')}

        <!-- 4. Jumper RS (Pino 4 LCD ➔ Pino D12 Arduino) - Faixa paralela dedicada 1 (Sem sobretraçar) -->
        ${c.lcd_rs ? `
            <path d="M 151 86 C 160 210, 440 330, 470 368" fill="none" stroke="#A78BFA" stroke-width="3.5" stroke-linecap="round"/>
            <circle cx="151" cy="86" r="4" fill="#A78BFA" stroke="#0F172A" stroke-width="1"/>
            <circle cx="470" cy="368" r="4" fill="#A78BFA" stroke="#0F172A" stroke-width="1"/>
            <!-- Etiqueta de Identificação D12 ➔ RS -->
            <rect x="260" y="260" width="76" height="17" rx="5" fill="#1E293B" stroke="#A78BFA" stroke-width="1.5"/>
            <text x="298" y="271" text-anchor="middle" fill="#DDD6FE" font-size="6.5" font-weight="900">D12 ➔ RS</text>
        ` : (c.lcd_module ? `
            <g class="a9-snap-target" onclick="a9_snapComponent('lcd_rs')" title="Ligar Pino 4 (RS) no Pino Digital 12 do Arduino">
                <circle cx="470" cy="368" r="5" fill="none" stroke="#A78BFA" class="a9-beacon-ring" style="--glow-c:#A78BFA;"/>
                <circle cx="470" cy="368" r="6.5" fill="rgba(167,139,250,0.4)" stroke="#A78BFA" stroke-width="2.5" class="a9-pin-core ${isPinActive('lcd_rs') ? 'glow-active' : 'glow-soft'}" style="--glow-c:#A78BFA;"/>
                <text x="470" y="340" text-anchor="middle" fill="#A78BFA" font-size="6" font-weight="900">RS (D12)</text>
                <circle cx="151" cy="86" r="6" fill="none" stroke="#A78BFA" class="a9-beacon-ring" style="--glow-c:#A78BFA;"/>
                <circle cx="151" cy="86" r="7" fill="#A78BFA" stroke="#0F172A" stroke-width="2" class="a9-pin-core glow-active" style="--glow-c:#A78BFA;"/>
            </g>
        ` : '')}

        <!-- 5. Jumper RW (Pino 5 LCD ➔ Trilha Azul GND - Modo Escrita) -->
        ${c.lcd_rw ? `
            <line x1="510" y1="368" x2="510" y2="290" stroke="#334155" stroke-width="3.5" stroke-linecap="round"/>
            <circle cx="510" cy="368" r="3.5" fill="#334155" stroke="white" stroke-width="1"/>
            <circle cx="510" cy="290" r="3.5" fill="#334155" stroke="white" stroke-width="1"/>
        ` : (c.lcd_module ? `
            <g class="a9-snap-target" onclick="a9_snapComponent('lcd_rw')" title="Ligar Pino 5 (RW) na Trilha Azul GND">
                <circle cx="510" cy="368" r="5" fill="none" stroke="#94A3B8" class="a9-beacon-ring" style="--glow-c:#94A3B8;"/>
                <circle cx="510" cy="368" r="6" fill="rgba(148,163,184,0.4)" stroke="#94A3B8" stroke-width="2.5" class="a9-pin-core ${isPinActive('lcd_rw') ? 'glow-active' : 'glow-soft'}" style="--glow-c:#94A3B8;"/>
                <text x="510" y="340" text-anchor="middle" fill="#94A3B8" font-size="6" font-weight="900">RW (GND)</text>
            </g>
        ` : '')}

        <!-- 6. Jumper Enable (Pino 6 LCD ➔ Pino D11 Arduino) - Faixa paralela dedicada 2 -->
        ${c.lcd_en ? `
            <path d="M 167 86 C 180 215, 520 335, 550 368" fill="none" stroke="#C084FC" stroke-width="3.5" stroke-linecap="round"/>
            <circle cx="167" cy="86" r="4" fill="#C084FC" stroke="#0F172A" stroke-width="1"/>
            <circle cx="550" cy="368" r="4" fill="#C084FC" stroke="#0F172A" stroke-width="1"/>
            <!-- Etiqueta de Identificação D11 ➔ EN -->
            <rect x="320" y="275" width="76" height="17" rx="5" fill="#1E293B" stroke="#C084FC" stroke-width="1.5"/>
            <text x="358" y="286" text-anchor="middle" fill="#F3E8FF" font-size="6.5" font-weight="900">D11 ➔ EN</text>
        ` : (c.lcd_module ? `
            <g class="a9-snap-target" onclick="a9_snapComponent('lcd_en')" title="Ligar Pino 6 (Enable) no Pino Digital 11 do Arduino">
                <circle cx="550" cy="368" r="5" fill="none" stroke="#C084FC" class="a9-beacon-ring" style="--glow-c:#C084FC;"/>
                <circle cx="550" cy="368" r="6.5" fill="rgba(192,132,252,0.4)" stroke="#C084FC" stroke-width="2.5" class="a9-pin-core ${isPinActive('lcd_en') ? 'glow-active' : 'glow-soft'}" style="--glow-c:#C084FC;"/>
                <text x="550" y="340" text-anchor="middle" fill="#C084FC" font-size="6" font-weight="900">E (D11)</text>
                <circle cx="167" cy="86" r="6" fill="none" stroke="#C084FC" class="a9-beacon-ring" style="--glow-c:#C084FC;"/>
                <circle cx="167" cy="86" r="7" fill="#C084FC" stroke="#0F172A" stroke-width="2" class="a9-pin-core glow-active" style="--glow-c:#C084FC;"/>
            </g>
        ` : '')}

        <!-- 7. Jumper D4 (Pino 11 LCD ➔ Pino D10 Arduino) - Faixa paralela dedicada 3 -->
        ${c.lcd_d4 ? `
            <path d="M 183 86 C 200 220, 715 340, 750 368" fill="none" stroke="#38BDF8" stroke-width="3.5" stroke-linecap="round"/>
            <circle cx="183" cy="86" r="4" fill="#38BDF8" stroke="white" stroke-width="1"/>
            <circle cx="750" cy="368" r="4" fill="#38BDF8" stroke="white" stroke-width="1"/>
            <!-- Etiqueta de Identificação D10 ➔ D4 -->
            <rect x="420" y="295" width="76" height="17" rx="5" fill="#1E293B" stroke="#38BDF8" stroke-width="1.5"/>
            <text x="458" y="306" text-anchor="middle" fill="#BAE6FD" font-size="6.5" font-weight="900">D10 ➔ D4</text>
        ` : (c.lcd_module ? `
            <g class="a9-snap-target" onclick="a9_snapComponent('lcd_d4')" title="Ligar Pino 11 (D4) no Pino Digital 10 do Arduino">
                <circle cx="750" cy="368" r="5" fill="none" stroke="#38BDF8" class="a9-beacon-ring" style="--glow-c:#38BDF8;"/>
                <circle cx="750" cy="368" r="6.5" fill="rgba(56,189,248,0.4)" stroke="#38BDF8" stroke-width="2.5" class="a9-pin-core ${isPinActive('lcd_d4') ? 'glow-active' : 'glow-soft'}" style="--glow-c:#38BDF8;"/>
                <text x="750" y="340" text-anchor="middle" fill="#38BDF8" font-size="6" font-weight="900">D4 (D10)</text>
                <circle cx="183" cy="86" r="6" fill="none" stroke="#38BDF8" class="a9-beacon-ring" style="--glow-c:#38BDF8;"/>
                <circle cx="183" cy="86" r="7" fill="#38BDF8" stroke="#FFFFFF" stroke-width="2" class="a9-pin-core glow-active" style="--glow-c:#38BDF8;"/>
            </g>
        ` : '')}

        <!-- 8. Jumper D5 (Pino 12 LCD ➔ Pino D9 Arduino) - Faixa paralela dedicada 4 -->
        ${c.lcd_d5 ? `
            <path d="M 199 86 C 220 225, 755 345, 790 368" fill="none" stroke="#0284C7" stroke-width="3.5" stroke-linecap="round"/>
            <circle cx="199" cy="86" r="4" fill="#0284C7" stroke="white" stroke-width="1"/>
            <circle cx="790" cy="368" r="4" fill="#0284C7" stroke="white" stroke-width="1"/>
            <!-- Etiqueta de Identificação D9 ➔ D5 -->
            <rect x="460" y="310" width="72" height="17" rx="5" fill="#1E293B" stroke="#0284C7" stroke-width="1.5"/>
            <text x="496" y="321" text-anchor="middle" fill="#93C5FD" font-size="6.5" font-weight="900">D9 ➔ D5</text>
        ` : (c.lcd_module ? `
            <g class="a9-snap-target" onclick="a9_snapComponent('lcd_d5')" title="Ligar Pino 12 (D5) no Pino Digital 9 do Arduino">
                <circle cx="790" cy="368" r="5" fill="none" stroke="#0284C7" class="a9-beacon-ring" style="--glow-c:#0284C7;"/>
                <circle cx="790" cy="368" r="6.5" fill="rgba(2,132,199,0.4)" stroke="#0284C7" stroke-width="2.5" class="a9-pin-core ${isPinActive('lcd_d5') ? 'glow-active' : 'glow-soft'}" style="--glow-c:#0284C7;"/>
                <text x="790" y="340" text-anchor="middle" fill="#0284C7" font-size="6" font-weight="900">D5 (D9)</text>
                <circle cx="199" cy="86" r="6" fill="none" stroke="#0284C7" class="a9-beacon-ring" style="--glow-c:#0284C7;"/>
                <circle cx="199" cy="86" r="7" fill="#0284C7" stroke="#FFFFFF" stroke-width="2" class="a9-pin-core glow-active" style="--glow-c:#0284C7;"/>
            </g>
        ` : '')}

        <!-- 9. Jumper D6 (Pino 13 LCD ➔ Pino D8 Arduino) - Faixa paralela dedicada 5 -->
        ${c.lcd_d6 ? `
            <path d="M 215 86 C 240 230, 795 350, 830 368" fill="none" stroke="#06B6D4" stroke-width="3.5" stroke-linecap="round"/>
            <circle cx="215" cy="86" r="4" fill="#06B6D4" stroke="white" stroke-width="1"/>
            <circle cx="830" cy="368" r="4" fill="#06B6D4" stroke="white" stroke-width="1"/>
            <!-- Etiqueta de Identificação D8 ➔ D6 -->
            <rect x="500" y="325" width="72" height="17" rx="5" fill="#1E293B" stroke="#06B6D4" stroke-width="1.5"/>
            <text x="536" y="336" text-anchor="middle" fill="#A5F3FC" font-size="6.5" font-weight="900">D8 ➔ D6</text>
        ` : (c.lcd_module ? `
            <g class="a9-snap-target" onclick="a9_snapComponent('lcd_d6')" title="Ligar Pino 13 (D6) no Pino Digital 8 do Arduino">
                <circle cx="830" cy="368" r="5" fill="none" stroke="#06B6D4" class="a9-beacon-ring" style="--glow-c:#06B6D4;"/>
                <circle cx="830" cy="368" r="6.5" fill="rgba(6,182,212,0.4)" stroke="#06B6D4" stroke-width="2.5" class="a9-pin-core ${isPinActive('lcd_d6') ? 'glow-active' : 'glow-soft'}" style="--glow-c:#06B6D4;"/>
                <text x="830" y="340" text-anchor="middle" fill="#06B6D4" font-size="6" font-weight="900">D6 (D8)</text>
                <circle cx="215" cy="86" r="6" fill="none" stroke="#06B6D4" class="a9-beacon-ring" style="--glow-c:#06B6D4;"/>
                <circle cx="215" cy="86" r="7" fill="#06B6D4" stroke="#FFFFFF" stroke-width="2" class="a9-pin-core glow-active" style="--glow-c:#06B6D4;"/>
            </g>
        ` : '')}

        <!-- 10. Jumper D7 (Pino 14 LCD ➔ Pino D7 Arduino) - Faixa paralela dedicada 6 -->
        ${c.lcd_d7 ? `
            <path d="M 231 86 C 260 235, 835 355, 870 368" fill="none" stroke="#14B8A6" stroke-width="3.5" stroke-linecap="round"/>
            <circle cx="231" cy="86" r="4" fill="#14B8A6" stroke="white" stroke-width="1"/>
            <circle cx="870" cy="368" r="4" fill="#14B8A6" stroke="white" stroke-width="1"/>
            <!-- Etiqueta de Identificação D7 ➔ D7 -->
            <rect x="540" y="340" width="72" height="17" rx="5" fill="#1E293B" stroke="#14B8A6" stroke-width="1.5"/>
            <text x="576" y="351" text-anchor="middle" fill="#99F6E4" font-size="6.5" font-weight="900">D7 ➔ D7</text>
        ` : (c.lcd_module ? `
            <g class="a9-snap-target" onclick="a9_snapComponent('lcd_d7')" title="Ligar Pino 14 (D7) no Pino Digital 7 do Arduino">
                <circle cx="870" cy="368" r="5" fill="none" stroke="#14B8A6" class="a9-beacon-ring" style="--glow-c:#14B8A6;"/>
                <circle cx="870" cy="368" r="6.5" fill="rgba(20,184,166,0.4)" stroke="#14B8A6" stroke-width="2.5" class="a9-pin-core ${isPinActive('lcd_d7') ? 'glow-active' : 'glow-soft'}" style="--glow-c:#14B8A6;"/>
                <text x="870" y="340" text-anchor="middle" fill="#14B8A6" font-size="6" font-weight="900">D7 (D7)</text>
                <circle cx="231" cy="86" r="6" fill="none" stroke="#14B8A6" class="a9-beacon-ring" style="--glow-c:#14B8A6;"/>
                <circle cx="231" cy="86" r="7" fill="#14B8A6" stroke="#FFFFFF" stroke-width="2" class="a9-pin-core glow-active" style="--glow-c:#14B8A6;"/>
            </g>
        ` : '')}

        <!-- 11. Jumper A (Pino 15 LCD ➔ Trilha Vermelha 5V - Backlight Ânodo) -->
        ${c.lcd_a ? `
            <line x1="910" y1="368" x2="910" y2="304" stroke="#EF4444" stroke-width="3.5" stroke-linecap="round"/>
            <circle cx="910" cy="368" r="3.5" fill="#EF4444" stroke="white" stroke-width="1"/>
            <circle cx="910" cy="304" r="3.5" fill="#EF4444" stroke="white" stroke-width="1"/>
        ` : (c.lcd_module ? `
            <g class="a9-snap-target" onclick="a9_snapComponent('lcd_a')" title="Ligar Pino 15 (A - Backlight) na Trilha Vermelha 5V">
                <circle cx="910" cy="368" r="5" fill="none" stroke="#EF4444" class="a9-beacon-ring" style="--glow-c:#EF4444;"/>
                <circle cx="910" cy="368" r="6" fill="rgba(239,68,68,0.4)" stroke="#EF4444" stroke-width="2.5" class="a9-pin-core ${isPinActive('lcd_a') ? 'glow-active' : 'glow-soft'}" style="--glow-c:#EF4444;"/>
                <text x="910" y="340" text-anchor="middle" fill="#EF4444" font-size="6" font-weight="900">A (5V)</text>
            </g>
        ` : '')}

        <!-- 12. Jumper K (Pino 16 LCD ➔ Trilha Azul GND - Backlight Cátodo) -->
        ${c.lcd_k ? `
            <line x1="950" y1="368" x2="950" y2="290" stroke="#334155" stroke-width="3.5" stroke-linecap="round"/>
            <circle cx="950" cy="368" r="3.5" fill="#334155" stroke="white" stroke-width="1"/>
            <circle cx="950" cy="290" r="3.5" fill="#334155" stroke="white" stroke-width="1"/>
        ` : (c.lcd_module ? `
            <g class="a9-snap-target" onclick="a9_snapComponent('lcd_k')" title="Ligar Pino 16 (K - Backlight) na Trilha Azul GND">
                <circle cx="950" cy="368" r="5" fill="none" stroke="#94A3B8" class="a9-beacon-ring" style="--glow-c:#94A3B8;"/>
                <circle cx="950" cy="368" r="6" fill="rgba(148,163,184,0.4)" stroke="#94A3B8" stroke-width="2.5" class="a9-pin-core ${isPinActive('lcd_k') ? 'glow-active' : 'glow-soft'}" style="--glow-c:#94A3B8;"/>
                <text x="950" y="340" text-anchor="middle" fill="#94A3B8" font-size="6" font-weight="900">K (GND)</text>
            </g>
        ` : '')}
    </svg>
    `;
}

// -------------------------------------------------------------
// 2. MISSÃO 1: O OUVIDO BIÔNICO (PALMAS + FARÓIS + MICROFONE)
// -------------------------------------------------------------
function a9_renderMission1Clap() {
    const isLit = A9_STATE.clapHeadlightsOn;

    return `
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;align-items:start;">
            <!-- CARD INTERATIVO DE PALMAS -->
            <div style="background:#0F172A;border:2px solid #EC4899;border-radius:20px;padding:24px;box-shadow:0 10px 30px rgba(236,72,153,0.2);">
                <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px;">
                    <span style="font-size:2rem;">👏🎤</span>
                    <div>
                        <div style="color:#F472B6;font-size:0.75rem;font-weight:900;letter-spacing:1px;">MISSÃO 1 • SUPERPODER DE SOM</div>
                        <h3 style="margin:0;font-family:'Fredoka One',cursive;font-size:1.4rem;color:white;">O Ouvido Biônico</h3>
                    </div>
                </div>

                <p style="color:#CBD5E1;font-size:0.9rem;line-height:1.5;margin-bottom:20px;">
                    Chegou no escuro? O microfone do carro escuta a vibração da palma no ar e o Arduino acende os faróis no Pino 13 instantaneamente!
                </p>

                <!-- BOTÃO GIGANTE DE BATER PALMA COM ONDAS -->
                <div style="text-align:center;margin:25px 0;">
                    <button onclick="a9_triggerVirtualClap()" style="position:relative;background:linear-gradient(135deg,#EC4899,#BE185D);color:white;border:none;padding:22px 38px;border-radius:50px;font-size:1.35rem;font-weight:900;font-family:'Fredoka One',cursive;cursor:pointer;box-shadow:0 10px 25px rgba(236,72,153,0.45);transition:all 0.15s ease;" onmousedown="this.style.transform='scale(0.95)'" onmouseup="this.style.transform='scale(1)'">
                        👏 Bater Palma!
                    </button>
                    <div style="color:#94A3B8;font-size:0.78rem;margin-top:8px;">Gera som sintetizado e emite ondas sonoras para o sensor</div>
                </div>

                <!-- BÔNUS MUNDO REAL: USAR MEU MICROFONE -->
                <div style="background:#1E293B;border:1px solid #334155;border-radius:14px;padding:14px;margin-top:20px;">
                    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
                        <span style="font-size:0.85rem;font-weight:900;color:#FDE68A;display:flex;align-items:center;gap:6px;">
                            <span>🎙️</span> Bônus Mundo Real: Usar Meu Microfone
                        </span>
                        <button onclick="a9_toggleRealMicrophone()" style="background:${A9_STATE.micStreamActive ? '#EF4444' : '#10B981'};color:white;border:none;padding:5px 12px;border-radius:8px;font-weight:900;font-size:0.75rem;cursor:pointer;">
                            ${A9_STATE.micStreamActive ? '⏹️ Parar' : '▶️ Ativar'}
                        </button>
                    </div>
                    <p style="color:#94A3B8;font-size:0.78rem;margin:0 0 10px;line-height:1.4;">
                        Bata palmas de verdade na frente do computador/celular! O medidor capta o pico e acende o farol sozinho!
                    </p>
                    <!-- VU-Meter de Volume -->
                    <div style="background:#0F172A;border-radius:10px;height:14px;overflow:hidden;position:relative;border:1px solid #475569;">
                        <div id="a9-mic-vu-bar" style="height:100%;width:0%;background:linear-gradient(90deg,#10B981,#FBBF24,#EF4444);transition:width 0.05s;"></div>
                    </div>
                </div>
            </div>

            <!-- SIMULAÇÃO VISUAL DO CARRO COM FARÓIS ACENDENDO -->
            <div style="background:#0F172A;border:2px solid #334155;border-radius:20px;padding:24px;text-align:center;">
                <h4 style="font-family:'Fredoka One',cursive;color:white;margin:0 0 14px;font-size:1.15rem;">
                    Status dos Faróis do Carro Inteligente
                </h4>

                <!-- Ilustração do Carro com Faróis e Feixe de Luz -->
                <div style="position:relative;display:inline-block;padding:20px 40px;">
                    <!-- Feixes de luz quando aceso -->
                    ${isLit ? `
                        <div style="position:absolute;top:30px;right:-40px;width:120px;height:80px;background:radial-gradient(ellipse at left, rgba(253,224,71,0.6) 0%, transparent 70%);pointer-events:none;filter:blur(4px);"></div>
                    ` : ''}

                    <div style="font-size:6rem;line-height:1;filter:${isLit ? 'drop-shadow(0 0 25px #FBBF24)' : 'none'};">
                        ${isLit ? '🚘✨' : '🚗💤'}
                    </div>

                    <div style="margin-top:14px;">
                        <span style="background:${isLit ? 'rgba(245,158,11,0.2)' : 'rgba(71,85,105,0.2)'};border:2px solid ${isLit ? '#F59E0B' : '#475569'};color:${isLit ? '#FDE68A' : '#94A3B8'};padding:6px 16px;border-radius:20px;font-weight:900;font-size:0.9rem;">
                            ${isLit ? '💡 FARÓIS ACESOS (Pino 13 = HIGH)' : '🌑 FARÓIS APAGADOS (Pino 13 = LOW)'}
                        </span>
                    </div>
                </div>

                <!-- Código C++ correspondente com pinos 100% oficiais -->
                <div style="margin-top:20px;text-align:left;" class="a9-live-code-block">
                    <div style="color:#64748B;">// Declaração de Pinos Oficiais (Diagrama &amp; Placa):</div>
                    <div style="color:#94A3B8;">const int PIN_SOM = A0;   <span style="color:#64748B;">// Microfone OUT no pino A0</span></div>
                    <div style="color:#94A3B8;">const int PIN_LED = 13;   <span style="color:#64748B;">// Farol no Pino Digital 13</span></div>
                    <div style="color:#94A3B8;">bool luzAcesa = false;</div>
                    <br>
                    <div style="color:#64748B;">// Leitura da palma e alternância do estado do farol:</div>
                    <div class="a9-code-line ${isLit ? 'active-executing' : ''}">
                        if (analogRead(PIN_SOM) &gt; 650) {
                    </div>
                    <div class="a9-code-line ${isLit ? 'active-executing' : ''}" style="padding-left:18px;">
                        luzAcesa = !luzAcesa;
                    </div>
                    <div class="a9-code-line ${isLit ? 'active-executing' : ''}" style="padding-left:18px;">
                        digitalWrite(PIN_LED, luzAcesa ? HIGH : LOW);
                    </div>
                    <div class="a9-code-line">}</div>
                </div>
            </div>
        </div>
    `;
}

// -------------------------------------------------------------
// 3. MISSÃO 2: O PAINEL DA NAVE (DISPLAY LCD 16x2 DIRETO — SEM I2C & SEM POTENCIÔMETRO/DIMMER)
// -------------------------------------------------------------
function a9_renderMission2Lcd() {
    const isGreen = A9_STATE.lcdTheme === 'green';

    return `
        <div style="display:grid;grid-template-columns:1.2fr 1fr;gap:20px;align-items:start;">
            <!-- ÁREA DO DISPLAY LCD INTERATIVO -->
            <div style="background:#0F172A;border:2px solid #14B8A6;border-radius:20px;padding:24px;box-shadow:0 10px 30px rgba(20,184,166,0.2);">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;flex-wrap:wrap;gap:8px;">
                    <div style="display:flex;align-items:center;gap:10px;">
                        <span style="font-size:1.8rem;">📟✨</span>
                        <div>
                            <div style="color:#2DD4BF;font-size:0.75rem;font-weight:900;letter-spacing:1px;">MISSÃO 2 • PLAYGROUND DE TEXTO</div>
                            <h3 style="margin:0;font-family:'Fredoka One',cursive;font-size:1.35rem;color:white;">O Painel da Nave (LCD 16x2 Direto)</h3>
                        </div>
                    </div>

                    <!-- Seletor de Tema da Luz de Fundo (Backlight) -->
                    <div style="display:flex;gap:6px;">
                        <button onclick="a9_setLcdTheme('green')" style="background:#064E3B;border:2px solid ${isGreen ? '#34D399' : 'transparent'};color:#A7F3D0;padding:4px 10px;border-radius:8px;font-size:0.75rem;font-weight:800;cursor:pointer;">
                            Verde Retro
                        </button>
                        <button onclick="a9_setLcdTheme('blue')" style="background:#0C4A6E;border:2px solid ${!isGreen ? '#38BDF8' : 'transparent'};color:#BAE6FD;padding:4px 10px;border-radius:8px;font-size:0.75rem;font-weight:800;cursor:pointer;">
                            Azul Sci-Fi
                        </button>
                    </div>
                </div>

                <!-- O DISPLAY LCD FÍSICO COM GRADE DE PIXELS -->
                <div class="a9-lcd-screen-box ${isGreen ? 'theme-green' : 'theme-blue'}" style="margin-bottom:18px;">
                    <div class="a9-lcd-line" id="a9-lcd-render-line1">${a9_formatLcdLine(A9_STATE.lcdLine1)}</div>
                    <div class="a9-lcd-line" id="a9-lcd-render-line2">${a9_formatLcdLine(A9_STATE.lcdLine2)}</div>
                </div>

                <!-- BOTÕES DE SÍMBOLOS RÁPIDOS CUSTOMIZADOS (5x8 PIXELS) -->
                <div style="margin-bottom:14px;">
                    <span style="color:#FDE68A;font-size:0.82rem;font-weight:900;display:block;margin-bottom:6px;">
                        Desenhar Ícone Especial no LCD (Caractere Customizado):
                    </span>
                    <div style="display:flex;gap:8px;flex-wrap:wrap;">
                        <button onclick="a9_insertLcdEmoji('❤️')" style="background:#1E293B;border:1px solid #475569;color:white;padding:6px 12px;border-radius:10px;font-size:1.1rem;cursor:pointer;">❤️ Coração</button>
                        <button onclick="a9_insertLcdEmoji('🤖')" style="background:#1E293B;border:1px solid #475569;color:white;padding:6px 12px;border-radius:10px;font-size:1.1rem;cursor:pointer;">🤖 Robô</button>
                        <button onclick="a9_insertLcdEmoji('🚀')" style="background:#1E293B;border:1px solid #475569;color:white;padding:6px 12px;border-radius:10px;font-size:1.1rem;cursor:pointer;">🚀 Foguete</button>
                        <button onclick="a9_insertLcdEmoji('⭐')" style="background:#1E293B;border:1px solid #475569;color:white;padding:6px 12px;border-radius:10px;font-size:1.1rem;cursor:pointer;">⭐ Estrela</button>
                        <button onclick="a9_insertLcdEmoji('🏎️')" style="background:#1E293B;border:1px solid #475569;color:white;padding:6px 12px;border-radius:10px;font-size:1.1rem;cursor:pointer;">🏎️ Carro</button>
                    </div>
                </div>

                <!-- INPUTS AO VIVO PARA DIGITAR NOME / MENSAGEM -->
                <div style="display:flex;flex-direction:column;gap:10px;">
                    <div>
                        <label style="color:#94A3B8;font-size:0.8rem;font-weight:bold;display:block;margin-bottom:3px;">Linha 1 do Display (Máx 16 letras):</label>
                        <input type="text" maxlength="16" value="${A9_STATE.lcdLine1}" oninput="a9_updateLcdText(1, this.value)" style="width:100%;box-sizing:border-box;background:#1E293B;border:1px solid #334155;color:#38BDF8;padding:8px 12px;border-radius:10px;font-family:monospace;font-size:0.95rem;font-weight:bold;outline:none;">
                    </div>
                    <div>
                        <label style="color:#94A3B8;font-size:0.8rem;font-weight:bold;display:block;margin-bottom:3px;">Linha 2 do Display (Máx 16 letras):</label>
                        <input type="text" maxlength="16" value="${A9_STATE.lcdLine2}" oninput="a9_updateLcdText(2, this.value)" style="width:100%;box-sizing:border-box;background:#1E293B;border:1px solid #334155;color:#34D399;padding:8px 12px;border-radius:10px;font-family:monospace;font-size:0.95rem;font-weight:bold;outline:none;">
                    </div>
                </div>
            </div>

            <!-- CÓDIGO C++ DO DISPLAY ATUALIZANDO AO VIVO -->
            <div style="background:#0F172A;border:2px solid #334155;border-radius:20px;padding:24px;">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;flex-wrap:wrap;gap:8px;">
                    <div>
                        <h4 style="font-family:'Fredoka One',cursive;color:white;margin:0;font-size:1.15rem;">
                            Código Arduino C++ Direto:
                        </h4>
                        <div style="color:#64748B;font-size:0.75rem;font-weight:bold;">Sem Módulo I2C &amp; Sem Potenciômetro/Dimmer</div>
                    </div>
                    <div style="display:flex;gap:6px;align-items:center;">
                        <span style="background:rgba(20,184,166,0.15);border:1px solid #14B8A6;color:#5EEAD4;padding:3px 8px;border-radius:12px;font-size:0.75rem;font-weight:900;">
                            LiquidCrystal.h Nativa
                        </span>
                        <button id="a9-btn-copy-lcd" onclick="a9_copyLcdCode()" style="background:#0D9488;border:none;color:white;padding:4px 10px;border-radius:8px;font-size:0.75rem;font-weight:800;cursor:pointer;display:flex;align-items:center;gap:4px;">
                            📋 Copiar .ino
                        </button>
                    </div>
                </div>
                <div class="a9-live-code-block" style="min-height:220px;">
                    <div style="color:#64748B;">// Biblioteca padrão do Arduino (já vem instalada na IDE!)</div>
                    <div style="color:#64748B;">#include &lt;LiquidCrystal.h&gt;</div>
                    <br>
                    <div style="color:#64748B;">// Pinos oficiais do projeto: RS=12, EN=11, D4=10, D5=9, D6=8, D7=7</div>
                    <div style="color:#94A3B8;">const int RS = 12; const int EN = 11;</div>
                    <div style="color:#94A3B8;">const int D4 = 10; const int D5 = 9; const int D6 = 8; const int D7 = 7;</div>
                    <div style="color:#38BDF8;">LiquidCrystal lcd(RS, EN, D4, D5, D6, D7);</div>
                    <br>
                    <div style="color:#64748B;">void setup() {</div>
                    <div style="padding-left:14px;color:#FBBF24;">lcd.begin(16, 2); <span style="color:#64748B;">// Inicia matriz 16x2</span></div>
                    <div style="padding-left:14px;color:#CBD5E1;">lcd.clear();</div>
                    <br>
                    <div style="padding-left:14px;" class="a9-code-line active-executing">
                        lcd.setCursor(0, 0);
                    </div>
                    <div style="padding-left:14px;" class="a9-code-line active-executing">
                        lcd.print("<span id="a9-code-lcd-val1" style="color:#38BDF8;">${A9_STATE.lcdLine1}</span>");
                    </div>
                    <div style="padding-left:14px;" class="a9-code-line active-executing">
                        lcd.setCursor(0, 1);
                    </div>
                    <div style="padding-left:14px;" class="a9-code-line active-executing">
                        lcd.print("<span id="a9-code-lcd-val2" style="color:#34D399;">${A9_STATE.lcdLine2}</span>");
                    </div>
                    <div style="color:#64748B;">}</div>
                    <br>
                    <div style="color:#64748B;">void loop() {</div>
                    <div style="padding-left:14px;color:#64748B;">// Texto estático já no visor!</div>
                    <div style="color:#64748B;">}</div>
                </div>

                <div style="margin-top:14px;background:rgba(20,184,166,0.1);border:1px solid rgba(20,184,166,0.3);border-radius:12px;padding:12px 14px;font-size:0.82rem;color:#CCFBF1;line-height:1.5;">
                    <b>✨ Por que não precisa de potenciômetro nem de dimmer?</b><br>
                    • <b>Contraste:</b> Ligando o pino 3 (V0) direto no terra (GND 0V), o visor já assume nitidez máxima com texto preto perfeitamente legível!<br>
                    • <b>Luz de Fundo:</b> O pino 15 (A) no 5V e 16 (K) no GND mantêm a iluminação acesa e estável sem precisar de controle manual!
                </div>
            </div>
        </div>

        <!-- GUIA FÍSICO DETALHADO DE MONTAGEM DO LCD 16x2 SEM I2C E SEM POTENCIÔMETRO/DIMMER -->
        <div style="margin-top:22px;background:#0F172A;border:2px solid #14B8A6;border-radius:20px;padding:24px;box-shadow:0 10px 30px rgba(20,184,166,0.15);">
            <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px;flex-wrap:wrap;">
                <span style="font-size:2rem;">🔌🛠️</span>
                <div>
                    <h3 style="margin:0;font-family:'Fredoka One',cursive;font-size:1.35rem;color:white;">
                        Guia Definitivo: Como Ligar o LCD 16x2 SEM Módulo I2C e SEM Potenciômetro / Dimmer
                    </h3>
                    <div style="color:#2DD4BF;font-size:0.85rem;font-weight:700;">
                        Tudo o que você precisa para ligar na protoboard física real com sucesso imediato!
                    </div>
                </div>
            </div>

            <!-- 3 CARDS DE CONCEITO: POR QUE FUNCIONA SEM POTENCIÔMETRO E SEM DIMMER? -->
            <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(280px, 1fr));gap:14px;margin-bottom:20px;">
                <div style="background:#1E293B;border-left:4px solid #34D399;border-radius:12px;padding:14px;">
                    <div style="color:#34D399;font-weight:900;font-size:0.95rem;margin-bottom:6px;display:flex;align-items:center;gap:6px;">
                        <span>🎯</span> 1. Contraste Máximo (Sem Potenciômetro)
                    </div>
                    <p style="color:#CBD5E1;font-size:0.85rem;line-height:1.55;margin:0;">
                        O <b>Pino 3 (V0)</b> controla o contraste das letras. Em tutoriais antigos usam um potenciômetro de 10kΩ, mas <b>ligando o Pino 3 DIRETO no GND (0V)</b>, o visor assume <b>contraste máximo ideal</b>: letras pretas sólidas e bem definidas, dispensando qualquer potenciômetro!
                    </p>
                </div>

                <div style="background:#1E293B;border-left:4px solid #F59E0B;border-radius:12px;padding:14px;">
                    <div style="color:#FBBF24;font-weight:900;font-size:0.95rem;margin-bottom:6px;display:flex;align-items:center;gap:6px;">
                        <span>💡</span> 2. Luz de Fundo Firme (Sem Dimmer)
                    </div>
                    <p style="color:#CBD5E1;font-size:0.85rem;line-height:1.55;margin:0;">
                        O display já possui LED de iluminação traseira embutido. Conecte o <b>Pino 15 (A - Ânodo) no +5V</b> e o <b>Pino 16 (K - Cátodo) no GND</b>. A tela fica com brilho uniforme, estável e sempre acesa sem precisar de controle de brilho ou dimmer!
                    </p>
                </div>

                <div style="background:#1E293B;border-left:4px solid #38BDF8;border-radius:12px;padding:14px;">
                    <div style="color:#38BDF8;font-weight:900;font-size:0.95rem;margin-bottom:6px;display:flex;align-items:center;gap:6px;">
                        <span>⚡</span> 3. Modo 4-Bits Direto (Sem Placa I2C)
                    </div>
                    <p style="color:#CBD5E1;font-size:0.85rem;line-height:1.55;margin:0;">
                        O circuito HD44780 opera com dados em blocos de 4 bits. Por isso, os <b>Pinos 7 a 10 (D0 a D3) ficam VAZIOS</b>! O <b>Pino 5 (RW) vai ao GND</b> (modo escrita). Conectamos apenas 6 fios de controle e dados no Arduino: <b>RS=12, EN=11, D4=10, D5=9, D6=8, D7=7</b>.
                    </p>
                </div>
            </div>

            <!-- TABELA COMPLETA DOS 16 PINOS DO LCD HD44780 -->
            <div style="background:#020617;border:1px solid #334155;border-radius:14px;overflow-x:auto;margin-bottom:18px;">
                <table style="width:100%;border-collapse:collapse;font-size:0.85rem;text-align:left;min-width:640px;">
                    <thead>
                        <tr style="background:#1E293B;color:#94A3B8;border-bottom:2px solid #334155;text-transform:uppercase;font-size:0.75rem;letter-spacing:0.5px;">
                            <th style="padding:10px 14px;">Pino LCD</th>
                            <th style="padding:10px 14px;">Nome</th>
                            <th style="padding:10px 14px;">Onde Conectar</th>
                            <th style="padding:10px 14px;">Cor Jumper</th>
                            <th style="padding:10px 14px;">Função / Observação Importante</th>
                        </tr>
                    </thead>
                    <tbody style="color:#E2E8F0;font-size:0.85rem;">
                        <tr style="border-bottom:1px solid #1E293B;background:rgba(15,23,42,0.4);">
                            <td style="padding:8px 14px;font-weight:900;color:#38BDF8;">1</td>
                            <td style="padding:8px 14px;font-family:monospace;font-weight:bold;">VSS</td>
                            <td style="padding:8px 14px;color:#94A3B8;font-weight:bold;">Trilha Azul (-) GND</td>
                            <td style="padding:8px 14px;"><span style="background:#0F172A;border:1px solid #334155;padding:2px 8px;border-radius:6px;color:#CBD5E1;">⬛ Preto</span></td>
                            <td style="padding:8px 14px;color:#94A3B8;">Terra do circuito lógico interno</td>
                        </tr>
                        <tr style="border-bottom:1px solid #1E293B;">
                            <td style="padding:8px 14px;font-weight:900;color:#38BDF8;">2</td>
                            <td style="padding:8px 14px;font-family:monospace;font-weight:bold;">VDD</td>
                            <td style="padding:8px 14px;color:#EF4444;font-weight:bold;">Trilha Vermelha (+) 5V</td>
                            <td style="padding:8px 14px;"><span style="background:#7F1D1D;padding:2px 8px;border-radius:6px;color:#FCA5A5;">🟥 Vermelho</span></td>
                            <td style="padding:8px 14px;color:#CBD5E1;">Alimentação +5V do display</td>
                        </tr>
                        <tr style="border-bottom:1px solid #1E293B;background:rgba(52,211,153,0.08);">
                            <td style="padding:8px 14px;font-weight:900;color:#34D399;">3</td>
                            <td style="padding:8px 14px;font-family:monospace;font-weight:bold;color:#34D399;">V0</td>
                            <td style="padding:8px 14px;color:#34D399;font-weight:900;">Trilha Azul (-) GND</td>
                            <td style="padding:8px 14px;"><span style="background:#064E3B;padding:2px 8px;border-radius:6px;color:#A7F3D0;font-weight:bold;">⬛ Preto (GND)</span></td>
                            <td style="padding:8px 14px;color:#A7F3D0;font-weight:bold;">⭐ SEGREDINHO: Ligado no GND fixa o contraste no MÁXIMO IDEAL! Dispensa potenciômetro!</td>
                        </tr>
                        <tr style="border-bottom:1px solid #1E293B;">
                            <td style="padding:8px 14px;font-weight:900;color:#38BDF8;">4</td>
                            <td style="padding:8px 14px;font-family:monospace;font-weight:bold;">RS</td>
                            <td style="padding:8px 14px;color:#A78BFA;font-weight:bold;">Arduino Pino Digital 12</td>
                            <td style="padding:8px 14px;"><span style="background:#4C1D95;padding:2px 8px;border-radius:6px;color:#C4B5FD;">🟪 Roxo</span></td>
                            <td style="padding:8px 14px;color:#CBD5E1;">Seleciona comando (0) ou texto/caractere (1)</td>
                        </tr>
                        <tr style="border-bottom:1px solid #1E293B;background:rgba(15,23,42,0.4);">
                            <td style="padding:8px 14px;font-weight:900;color:#38BDF8;">5</td>
                            <td style="padding:8px 14px;font-family:monospace;font-weight:bold;">RW</td>
                            <td style="padding:8px 14px;color:#94A3B8;font-weight:bold;">Trilha Azul (-) GND</td>
                            <td style="padding:8px 14px;"><span style="background:#0F172A;border:1px solid #334155;padding:2px 8px;border-radius:6px;color:#CBD5E1;">⬛ Preto</span></td>
                            <td style="padding:8px 14px;color:#94A3B8;">Aterrado no terra coloca o display em modo permanente de escrita</td>
                        </tr>
                        <tr style="border-bottom:1px solid #1E293B;">
                            <td style="padding:8px 14px;font-weight:900;color:#38BDF8;">6</td>
                            <td style="padding:8px 14px;font-family:monospace;font-weight:bold;">E</td>
                            <td style="padding:8px 14px;color:#A78BFA;font-weight:bold;">Arduino Pino Digital 11</td>
                            <td style="padding:8px 14px;"><span style="background:#4C1D95;padding:2px 8px;border-radius:6px;color:#C4B5FD;">🟪 Roxo</span></td>
                            <td style="padding:8px 14px;color:#CBD5E1;">Pino Enable (pulso que confirma o envio do dado)</td>
                        </tr>
                        <tr style="border-bottom:1px solid #1E293B;opacity:0.6;background:rgba(2,6,23,0.5);">
                            <td style="padding:8px 14px;font-weight:900;color:#64748B;">7 a 10</td>
                            <td style="padding:8px 14px;font-family:monospace;color:#64748B;">D0, D1, D2, D3</td>
                            <td style="padding:8px 14px;color:#64748B;font-weight:bold;">NÃO CONECTAR</td>
                            <td style="padding:8px 14px;"><span style="color:#64748B;">🚫 Deixar Vazio</span></td>
                            <td style="padding:8px 14px;color:#64748B;">No modo 4 bits, os pinos D0 a D3 ficam desligados</td>
                        </tr>
                        <tr style="border-bottom:1px solid #1E293B;">
                            <td style="padding:8px 14px;font-weight:900;color:#38BDF8;">11</td>
                            <td style="padding:8px 14px;font-family:monospace;font-weight:bold;">D4</td>
                            <td style="padding:8px 14px;color:#38BDF8;font-weight:bold;">Arduino Pino Digital 10</td>
                            <td style="padding:8px 14px;"><span style="background:#0C4A6E;padding:2px 8px;border-radius:6px;color:#7DD3FC;">🟦 Azul (D10)</span></td>
                            <td style="padding:8px 14px;color:#CBD5E1;">Linha de dados bit 4</td>
                        </tr>
                        <tr style="border-bottom:1px solid #1E293B;">
                            <td style="padding:8px 14px;font-weight:900;color:#38BDF8;">12</td>
                            <td style="padding:8px 14px;font-family:monospace;font-weight:bold;">D5</td>
                            <td style="padding:8px 14px;color:#38BDF8;font-weight:bold;">Arduino Pino Digital 9</td>
                            <td style="padding:8px 14px;"><span style="background:#0C4A6E;padding:2px 8px;border-radius:6px;color:#7DD3FC;">🟦 Azul (D9)</span></td>
                            <td style="padding:8px 14px;color:#CBD5E1;">Linha de dados bit 5</td>
                        </tr>
                        <tr style="border-bottom:1px solid #1E293B;">
                            <td style="padding:8px 14px;font-weight:900;color:#38BDF8;">13</td>
                            <td style="padding:8px 14px;font-family:monospace;font-weight:bold;">D6</td>
                            <td style="padding:8px 14px;color:#38BDF8;font-weight:bold;">Arduino Pino Digital 8</td>
                            <td style="padding:8px 14px;"><span style="background:#0C4A6E;padding:2px 8px;border-radius:6px;color:#7DD3FC;">🟦 Azul (D8)</span></td>
                            <td style="padding:8px 14px;color:#CBD5E1;">Linha de dados bit 6</td>
                        </tr>
                        <tr style="border-bottom:1px solid #1E293B;">
                            <td style="padding:8px 14px;font-weight:900;color:#38BDF8;">14</td>
                            <td style="padding:8px 14px;font-family:monospace;font-weight:bold;">D7</td>
                            <td style="padding:8px 14px;color:#38BDF8;font-weight:bold;">Arduino Pino Digital 7</td>
                            <td style="padding:8px 14px;"><span style="background:#0C4A6E;padding:2px 8px;border-radius:6px;color:#7DD3FC;">🟦 Azul (D7)</span></td>
                            <td style="padding:8px 14px;color:#CBD5E1;">Linha de dados bit 7</td>
                        </tr>
                        <tr style="border-bottom:1px solid #1E293B;background:rgba(239,68,68,0.08);">
                            <td style="padding:8px 14px;font-weight:900;color:#F87171;">15</td>
                            <td style="padding:8px 14px;font-family:monospace;font-weight:bold;color:#F87171;">A (Anode)</td>
                            <td style="padding:8px 14px;color:#EF4444;font-weight:900;">Trilha Vermelha (+) 5V</td>
                            <td style="padding:8px 14px;"><span style="background:#7F1D1D;padding:2px 8px;border-radius:6px;color:#FCA5A5;font-weight:bold;">🟥 Vermelho (5V)</span></td>
                            <td style="padding:8px 14px;color:#FCA5A5;font-weight:bold;">⭐ Luz de fundo ligada direto a 5V (dispensa dimmer/regulador de brilho!)</td>
                        </tr>
                        <tr style="background:rgba(15,23,42,0.4);">
                            <td style="padding:8px 14px;font-weight:900;color:#38BDF8;">16</td>
                            <td style="padding:8px 14px;font-family:monospace;font-weight:bold;">K (Cathode)</td>
                            <td style="padding:8px 14px;color:#94A3B8;font-weight:bold;">Trilha Azul (-) GND</td>
                            <td style="padding:8px 14px;"><span style="background:#0F172A;border:1px solid #334155;padding:2px 8px;border-radius:6px;color:#CBD5E1;">⬛ Preto</span></td>
                            <td style="padding:8px 14px;color:#CBD5E1;">Catodo da luz de fundo aterrado no GND</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- RESUMO DAS LIGAÇÕES DE ENERGIA & ARDUINO -->
            <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(260px, 1fr));gap:12px;font-size:0.85rem;">
                <div style="background:#1E293B;border-radius:12px;padding:12px 16px;border-left:3px solid #38BDF8;">
                    <strong style="color:#38BDF8;display:block;margin-bottom:6px;">🔌 Na Protoboard (6 Conexões de Energia/GND):</strong>
                    <div style="color:#CBD5E1;line-height:1.6;">
                        • <b>Trilha Azul (-) GND (4 cabos):</b> Conecte os pinos <b>1 (VSS)</b>, <b>3 (V0 - Contraste)</b>, <b>5 (RW)</b> e <b>16 (K - Catodo)</b>.<br>
                        • <b>Trilha Vermelha (+) 5V (2 cabos):</b> Conecte os pinos <b>2 (VDD)</b> e <b>15 (A - Anodo)</b>.
                    </div>
                </div>
                <div style="background:#1E293B;border-radius:12px;padding:12px 16px;border-left:3px solid #34D399;">
                    <strong style="color:#34D399;display:block;margin-bottom:6px;">🤖 No Arduino (6 Cabos de Sinal/Dados):</strong>
                    <div style="color:#CBD5E1;line-height:1.6;">
                        • <b>Controle (2 cabos):</b> Pino 4 (RS) ➔ <b>D12</b> | Pino 6 (EN) ➔ <b>D11</b>.<br>
                        • <b>Dados 4-Bits (4 cabos):</b> D4 ➔ <b>D10</b> | D5 ➔ <b>D9</b> | D6 ➔ <b>D8</b> | D7 ➔ <b>D7</b>.
                    </div>
                </div>
                <div style="background:#1E293B;border-radius:12px;padding:12px 16px;border-left:3px solid #F59E0B;">
                    <strong style="color:#FBBF24;display:block;margin-bottom:6px;">📊 Balanço Total de Cabos:</strong>
                    <div style="color:#CBD5E1;line-height:1.6;">
                        • <b>Total de Cabos Ligados:</b> <span style="color:#FDE68A;font-weight:900;">12 cabos físicos</span> (6 no Arduino + 6 na Protoboard).<br>
                        • <b>Pinos Vazios:</b> 4 pinos (D0, D1, D2, D3) ficam desligados no modo 4-bits.
                    </div>
                </div>
            </div>
        </div>
    `;
}

// -------------------------------------------------------------
// 4. MISSÃO 3: DESAFIO PRINCIPAL — SENSOR DE RÉ COM BUZZER & CARRINHO
// -------------------------------------------------------------
function a9_renderMission3Radar() {
    const d = A9_STATE.carDistance;
    const stage = a9_getDistanceStage(d);

    return `
        <!-- BANCADA DA SIMULAÇÃO FÍSICA DO CARRINHO & RADAR -->
        <div style="background:#0F172A;border:2px solid #F59E0B;border-radius:20px;padding:22px;margin-bottom:20px;box-shadow:0 10px 35px rgba(245,158,11,0.25);">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;flex-wrap:wrap;gap:8px;">
                <div style="display:flex;align-items:center;gap:10px;">
                    <span style="font-size:2rem;">🏎️💨</span>
                    <div>
                        <div style="color:#FBBF24;font-size:0.75rem;font-weight:900;letter-spacing:1px;">DESAFIO PRINCIPAL • PILOTO MAKER</div>
                        <h3 style="margin:0;font-family:'Fredoka One',cursive;font-size:1.4rem;color:white;">
                            Simulador do Sensor de Ré & Alarme de Colisão
                        </h3>
                    </div>
                </div>

                <!-- Alerta Visual de Zona de Perigo -->
                <div id="a9-radar-stage-badge" style="background:${stage.bgColor};border:2px solid ${stage.borderColor};color:${stage.textColor};padding:6px 18px;border-radius:20px;font-size:0.9rem;font-weight:900;display:flex;align-items:center;gap:8px;">
                    <span>${stage.icon}</span>
                    <span>${stage.label}</span>
                </div>
            </div>

            <!-- CENÁRIO ARRASTÁVEL: PAREDE DE TIJOLOS + SENSOR + ONDAS + CARRINHO -->
            <div id="a9-scenario-track" style="position:relative;background:linear-gradient(180deg,#1E293B 0%,#090D16 100%);border:2px solid #334155;border-radius:18px;height:180px;overflow:hidden;margin-bottom:16px;">
                <!-- Parede de Tijolos Fixa na Esquerda -->
                <div style="position:absolute;left:0;top:0;bottom:0;width:40px;background:repeating-linear-gradient(45deg,#7F1D1D,#7F1D1D 10px,#991B1B 10px,#991B1B 20px);border-right:3px solid #450A0A;">
                    <span style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%) rotate(-90deg);font-size:0.7rem;font-weight:900;color:#FCA5A5;white-space:nowrap;">
                        PAREDE
                    </span>
                </div>

                <!-- Sensor Ultrassônico ("Olhos de Morcego") fixo na parede -->
                <div style="position:absolute;left:40px;top:45px;background:#0284C7;border:2px solid #38BDF8;border-radius:6px;padding:6px 4px;display:flex;flex-direction:column;gap:6px;box-shadow:0 0 15px rgba(56,189,248,0.5);">
                    <div style="width:20px;height:20px;border-radius:50%;background:#CBD5E1;border:2px solid #1E293B;display:flex;align-items:center;justify-content:center;font-size:0.6rem;font-weight:900;color:#0F172A;">T</div>
                    <div style="width:20px;height:20px;border-radius:50%;background:#CBD5E1;border:2px solid #1E293B;display:flex;align-items:center;justify-content:center;font-size:0.6rem;font-weight:900;color:#0F172A;">R</div>
                </div>

                <!-- Ondas de Radar Animadas (SVG) -->
                <svg id="a9-radar-waves-svg" style="position:absolute;left:70px;top:0;width:100%;height:100%;pointer-events:none;">
                    ${a9_renderRadarArcsSvg(d, stage)}
                </svg>

                <!-- CARRINHO ARRASTÁVEL COM TOUCH E MOUSE -->
                <div id="a9-toy-car" class="${stage.isCritical ? 'a9-shake-crash' : ''}" style="position:absolute;left:${a9_getCarPixelPosition(d)}px;top:38px;cursor:grab;transition:left 0.05s ease-out;user-select:none;touch-action:none;" onmousedown="a9_startDragCar(event)" ontouchstart="a9_startDragCar(event)">
                    <!-- Chassi do Carrinho de Controle Remoto -->
                    <div style="position:relative;font-size:4.8rem;line-height:1;filter:drop-shadow(0 8px 15px rgba(0,0,0,0.6));">
                        🏎️
                    </div>
                    <!-- Luzes Traseiras / Alerta piscando se na zona crítica -->
                    ${stage.isCritical ? `
                        <div style="position:absolute;left:-5px;top:20px;width:16px;height:16px;border-radius:50%;background:#EF4444;box-shadow:0 0 20px #EF4444;animation:a9PulseGlow 0.15s infinite alternate;"></div>
                    ` : ''}
                    <!-- Etiqueta com Distância Flutuando sobre o Carro -->
                    <div style="position:absolute;top:-24px;left:50%;transform:translateX(-50%);background:#0F172A;border:1px solid ${stage.textColor};color:${stage.textColor};padding:2px 8px;border-radius:10px;font-size:0.75rem;font-weight:900;white-space:nowrap;">
                        ${d} cm
                    </div>
                </div>
            </div>

            <!-- SLIDER TÁTIL DE DISTÂNCIA (2 cm a 100 cm) -->
            <div style="display:flex;align-items:center;gap:14px;background:#1E293B;padding:10px 18px;border-radius:14px;">
                <span style="font-size:1.2rem;">📏</span>
                <span style="color:#CBD5E1;font-size:0.85rem;font-weight:bold;white-space:nowrap;">Aproximar / Afastar:</span>
                <input id="a9-car-slider" type="range" min="2" max="100" value="${d}" oninput="a9_setCarDistance(Number(this.value))" style="flex:1;accent-color:${stage.textColor};cursor:pointer;height:8px;">
                <span id="a9-slider-dist-val" style="background:#0F172A;border:1px solid ${stage.textColor};color:${stage.textColor};padding:4px 12px;border-radius:10px;font-weight:900;font-size:0.9rem;min-width:65px;text-align:center;">
                    ${d} cm
                </span>
            </div>
        </div>

        <!-- GRADE COM DISPLAY LCD AO VIVO + CÓDIGO C++ INTERATIVO COM BOTÕES +/- -->
        <div style="display:grid;grid-template-columns:1fr 1.2fr;gap:20px;align-items:start;">
            <!-- LCD NO MODO SENSOR DE RÉ -->
            <div style="background:#0F172A;border:2px solid #334155;border-radius:20px;padding:20px;">
                <h4 style="font-family:'Fredoka One',cursive;color:white;margin:0 0 10px;font-size:1.15rem;display:flex;align-items:center;gap:8px;">
                    <span>📟</span> Painel de Parede da Garagem:
                </h4>
                
                <div class="a9-lcd-screen-box theme-green" style="margin-bottom:14px;">
                    <div class="a9-lcd-line">${stage.lcdLine1}</div>
                    <div class="a9-lcd-line" style="color:${stage.textColor};">${stage.lcdLine2}</div>
                </div>

                <div style="background:#1E293B;border-radius:12px;padding:12px;font-size:0.82rem;color:#CBD5E1;line-height:1.45;">
                    <strong style="color:#FDE68A;display:block;margin-bottom:2px;">Comportamento do Buzzer Sonoro:</strong>
                    ${stage.buzzerDesc}
                </div>
            </div>

            <!-- CÓDIGO C++ COM DESTAQUE DA LINHA EXECUTANDO AO VIVO & BOTÕES +/- -->
            <div style="background:#0F172A;border:2px solid #334155;border-radius:20px;padding:20px;">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
                    <h4 style="font-family:'Fredoka One',cursive;color:white;margin:0;font-size:1.15rem;">
                        Código C++ Executando ao Vivo:
                    </h4>
                    <span style="font-size:0.75rem;color:#64748B;">Experimente alterar com + e -</span>
                </div>

                <div class="a9-live-code-block">
                    <div style="color:#64748B;margin-bottom:6px;">// Pinos Oficiais da Missão: Trig=D6, Echo=D5, Buzzer=D4</div>
                    <div style="color:#94A3B8;font-size:0.78rem;">const int PIN_TRIG = 6; const int PIN_ECHO = 5;</div>
                    <div style="color:#94A3B8;font-size:0.78rem;margin-bottom:6px;">const int PIN_BUZZER = 4;</div>
                    <div class="a9-code-line ${stage.activeBranch === 'critical' ? 'active-executing' : ''}">
                        if (distancia &lt;= <button class="a9-num-stepper" onclick="a9_adjustThreshold('critical', -1)">-</button><b style="color:#EF4444;">${A9_STATE.criticalDistThreshold}</b><button class="a9-num-stepper" onclick="a9_adjustThreshold('critical', +1)">+</button>) {
                    </div>
                    <div class="a9-code-line ${stage.activeBranch === 'critical' ? 'active-executing' : ''}" style="padding-left:16px;">
                        tone(PIN_BUZZER, <button class="a9-num-stepper" onclick="a9_adjustFreq(-200)">-</button><b style="color:#FBBF24;">${A9_STATE.buzzerFrequency}</b><button class="a9-num-stepper" onclick="a9_adjustFreq(+200)">+</button>); <span style="color:#64748B;">// Apito Contínuo!</span>
                    </div>
                    <div class="a9-code-line ${stage.activeBranch === 'critical' ? 'active-executing' : ''}" style="padding-left:16px;">
                        lcd.print("PARE!! VAI BATER");
                    </div>

                    <div class="a9-code-line ${stage.activeBranch === 'warning' ? 'active-executing' : ''}">
                        } else if (distancia &lt;= <b style="color:#F97316;">${A9_STATE.warningDistThreshold}</b>) {
                    </div>
                    <div class="a9-code-line ${stage.activeBranch === 'warning' ? 'active-executing' : ''}" style="padding-left:16px;">
                        bipeRapido(200); <span style="color:#64748B;">// Perigo!</span>
                    </div>

                    <div class="a9-code-line ${stage.activeBranch === 'attention' ? 'active-executing' : ''}">
                        } else if (distancia &lt;= <b style="color:#FBBF24;">${A9_STATE.attentionDistThreshold}</b>) {
                    </div>
                    <div class="a9-code-line ${stage.activeBranch === 'attention' ? 'active-executing' : ''}" style="padding-left:16px;">
                        bipeEspacado(600); <span style="color:#64748B;">// Atencao</span>
                    </div>

                    <div class="a9-code-line ${stage.activeBranch === 'safe' ? 'active-executing' : ''}">
                        } else {
                    </div>
                    <div class="a9-code-line ${stage.activeBranch === 'safe' ? 'active-executing' : ''}" style="padding-left:16px;">
                        noTone(PIN_BUZZER); <span style="color:#64748B;">// Silêncio</span>
                    </div>
                    <div class="a9-code-line">}</div>
                </div>
            </div>
        </div>
    `;
}

// -------------------------------------------------------------
// 5. CÓDIGO FONTE OFICIAL DO PROJETO COMPLETO (.INO)
// -------------------------------------------------------------
function a9_renderFullProjectCode() {
    return `
        <div style="background:#0F172A;border:2px solid #F59E0B;border-radius:20px;padding:26px;box-shadow:0 10px 40px rgba(245,158,11,0.25);">
            <!-- BANNER SUPERIOR COM TÍTULO E BOTÕES DE AÇÃO -->
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;flex-wrap:wrap;gap:12px;border-bottom:1px solid #334155;padding-bottom:16px;">
                <div style="display:flex;align-items:center;gap:12px;">
                    <span style="font-size:2.4rem;">💻⚡</span>
                    <div>
                        <div style="color:#FBBF24;font-size:0.78rem;font-weight:900;letter-spacing:1px;">CÓDIGO ARDUINO OFICIAL • GARAGEM MAKER</div>
                        <h3 style="margin:0;font-family:'Fredoka One',cursive;font-size:1.6rem;color:white;">
                            Garagem Inteligente do Futuro (Tons Suaves)
                        </h3>
                        <div style="color:#94A3B8;font-size:0.85rem;">
                            Código unificado para Arduino UNO R3 (ATmega328P) com LCD 16x2 sem I2C, HC-SR04, Buzzer e Sensor de Som
                        </div>
                    </div>
                </div>

                <div style="display:flex;gap:10px;flex-wrap:wrap;">
                    <button id="a9-btn-copy-official" onclick="a9_copyOfficialCode()" style="background:#0D9488;border:none;color:white;padding:10px 18px;border-radius:12px;font-weight:900;cursor:pointer;font-size:0.92rem;display:inline-flex;align-items:center;gap:8px;box-shadow:0 4px 15px rgba(13,148,136,0.3);">
                        <i class="fa-solid fa-copy"></i> 📋 Copiar Código Completo
                    </button>
                    <button onclick="a9_downloadOfficialIno()" style="background:#0284C7;border:none;color:white;padding:10px 18px;border-radius:12px;font-weight:900;cursor:pointer;font-size:0.92rem;display:inline-flex;align-items:center;gap:8px;box-shadow:0 4px 15px rgba(2,132,199,0.3);">
                        <i class="fa-solid fa-download"></i> 📥 Baixar .ino
                    </button>
                </div>
            </div>

            <!-- CARDS DE RESUMO DA PINAGEM FÍSICA REAL -->
            <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(220px, 1fr));gap:12px;margin-bottom:22px;">
                <div style="background:#1E293B;border-left:4px solid #38BDF8;border-radius:12px;padding:12px 14px;">
                    <strong style="color:#38BDF8;display:block;font-size:0.9rem;margin-bottom:4px;">📟 Display LCD 16x2 (12 Cabos)</strong>
                    <div style="color:#CBD5E1;font-size:0.82rem;line-height:1.5;">
                        • <b>Arduino (6 fios):</b> RS➔12, EN➔11, D4..D7➔10,9,8,7<br>
                        • <b>Protoboard (6 fios):</b> VSS, V0, RW, K no GND | VDD, A no 5V<br>
                        • <b>V0 (Contraste):</b> no GND direto (sem potenciômetro!)<br>
                        • <b>A/K (Luz):</b> direto no 5V/GND (sem dimmer!)
                    </div>
                </div>

                <div style="background:#1E293B;border-left:4px solid #FBBF24;border-radius:12px;padding:12px 14px;">
                    <strong style="color:#FBBF24;display:block;font-size:0.9rem;margin-bottom:4px;">🦇 Sensor Ultrassônico</strong>
                    <div style="color:#CBD5E1;font-size:0.82rem;line-height:1.5;">
                        • <b>TRIG</b> ➔ Pino Digital 6<br>
                        • <b>ECHO</b> ➔ Pino Digital 5<br>
                        • <b>VCC</b> ➔ 5V | <b>GND</b> ➔ Terra<br>
                        • Mede a distância da parede em cm
                    </div>
                </div>

                <div style="background:#1E293B;border-left:4px solid #F97316;border-radius:12px;padding:12px 14px;">
                    <strong style="color:#F97316;display:block;font-size:0.9rem;margin-bottom:4px;">🔔 Buzzer &amp; Farol</strong>
                    <div style="color:#CBD5E1;font-size:0.82rem;line-height:1.5;">
                        • <b>BUZZER (+)</b> ➔ Pino Digital 4<br>
                        • <b>BUZZER (-)</b> ➔ GND<br>
                        • <b>LED (+)</b> ➔ Pino Digital 13<br>
                        • <b>LED (-)</b> ➔ Resistor 220Ω ➔ GND
                    </div>
                </div>

                <div style="background:#1E293B;border-left:4px solid #EC4899;border-radius:12px;padding:12px 14px;">
                    <strong style="color:#F472B6;display:block;font-size:0.9rem;margin-bottom:4px;">🎤 Sensor de Som</strong>
                    <div style="color:#CBD5E1;font-size:0.82rem;line-height:1.5;">
                        • <b>OUT / Sinal</b> ➔ Pino Analógico A0<br>
                        • <b>VCC</b> ➔ 5V | <b>GND</b> ➔ Terra<br>
                        • Detecta palmas e acende os faróis
                    </div>
                </div>
            </div>

            <!-- ÁREA DO CÓDIGO FONTE OFICIAL COM SCROLL E HIGHLIGHT -->
            <div style="background:#020617;border:2px solid #334155;border-radius:16px;overflow:hidden;margin-bottom:20px;">
                <div style="background:#1E293B;padding:10px 16px;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #334155;">
                    <span style="color:#94A3B8;font-family:monospace;font-size:0.85rem;font-weight:bold;">
                        📄 sketch_garagem_inteligente.ino
                    </span>
                    <span style="background:rgba(52,211,153,0.15);color:#34D399;font-size:0.75rem;font-weight:bold;padding:2px 10px;border-radius:10px;">
                        ✓ Testado &amp; Pronto para Carregar na IDE
                    </span>
                </div>
                <pre style="margin:0;padding:20px;color:#F8FAFC;font-family:'Courier New',Courier,monospace;font-size:0.88rem;line-height:1.55;overflow-x:auto;max-height:520px;scrollbar-width:thin;"><code id="a9-official-code-text">/*
 * ==============================================================================
 * 🚀 PROJETO: GARAGEM INTELIGENTE DO FUTURO (VOLUME SUAVE / SEM RUÍDO)
 * Plataforma: Criadores de Código — Laboratório Maker
 * Microcontrolador: Arduino UNO R3 (Chip ATmega328P)
 * ==============================================================================
 */

#include &lt;LiquidCrystal.h&gt;

const int RS = 12;
const int EN = 11;
const int D4 = 10;
const int D5 =  9;
const int D6 =  8;
const int D7 =  7;

LiquidCrystal lcd(RS, EN, D4, D5, D6, D7);

const int PIN_TRIG = 6;
const int PIN_ECHO = 5;
const int PIN_SOM  = A0;
const int PIN_LED  = 13;
const int PIN_BUZZER = 4;

bool luzAcesa = false;
long duracaoEco = 0;
int distanciaCm = 0;
unsigned long ultimoTempoPalma = 0;

int ultimaLeituraSom = 512;
const int LIMIAR_VARIACAO = 180;

void setup() {
  pinMode(PIN_TRIG, OUTPUT);
  pinMode(PIN_ECHO, INPUT);
  pinMode(PIN_SOM, INPUT);
  pinMode(PIN_LED, OUTPUT);
  pinMode(PIN_BUZZER, OUTPUT);

  lcd.begin(16, 2);
  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("GARAGEM MAKER");
  lcd.setCursor(0, 1);
  lcd.print("MODO TONS SUAVES");
  delay(1500);
  lcd.clear();
}

void loop() {
  digitalWrite(PIN_TRIG, LOW);
  delayMicroseconds(2);
  digitalWrite(PIN_TRIG, HIGH);
  delayMicroseconds(10);
  digitalWrite(PIN_TRIG, LOW);

  duracaoEco = pulseIn(PIN_ECHO, HIGH, 30000);

  if (duracaoEco == 0) {
    distanciaCm = 99;
  } else {
    distanciaCm = duracaoEco / 58;
  }

  bool carroProximo = (distanciaCm &lt; 50);

  if (carroProximo) {
    // Frequências mais graves e suaves (de 400 Hz a 1500 Hz) para gerar menos chiado elétrico
    int frequencia = map(distanciaCm, 5, 50, 1500, 400);
    frequencia = constrain(frequencia, 400, 1500);
    tone(PIN_BUZZER, frequencia);
  } else {
    noTone(PIN_BUZZER);
  }

  if (!carroProximo) {
    int leituraSomAtual = analogRead(PIN_SOM);
    int variacao = abs(leituraSomAtual - ultimaLeituraSom);

    if (variacao &gt; LIMIAR_VARIACAO &amp;&amp; (millis() - ultimoTempoPalma &gt; 1000)) {
      luzAcesa = !luzAcesa;
      digitalWrite(PIN_LED, luzAcesa ? HIGH : LOW);
      ultimoTempoPalma = millis();
    }
    
    ultimaLeituraSom = leituraSomAtual;
  }

  lcd.setCursor(0, 0);
  if (luzAcesa) {
    lcd.print("Luz: ACESA  [ON] ");
  } else {
    lcd.print("Luz: APAGADA[OFF]");
  }

  lcd.setCursor(0, 1);
  if (distanciaCm &lt; 15) {
    lcd.print("Vaga: ");
    lcd.print(distanciaCm);
    lcd.print("cm !PARE!");
  } else {
    lcd.print("Vaga: ");
    lcd.print(distanciaCm);
    lcd.print("cm (OK)  ");
  }

  delay(120);
}
</code></pre>
            </div>

            <!-- PASSO A PASSO PARA OS ALUNOS CARREGAREM NA PLACA FÍSICA -->
            <div style="background:#1E293B;border-radius:16px;padding:18px 22px;">
                <h4 style="color:#FDE68A;font-family:'Fredoka One',cursive;margin:0 0 10px;font-size:1.15rem;display:flex;align-items:center;gap:8px;">
                    <span>🎓</span> Guia Passo a Passo: Gravando o Código no Arduino Físico
                </h4>
                <ol style="color:#CBD5E1;font-size:0.88rem;line-height:1.65;margin:0;padding-left:20px;">
                    <li><b>Copie o Código:</b> Clique no botão verde <b>"📋 Copiar Código Completo"</b> acima (ou baixe o arquivo <code>.ino</code>).</li>
                    <li><b>Abra a Arduino IDE:</b> No computador, abra o programa <b>Arduino IDE</b> e crie um novo sketch (Arquivo &gt; Novo).</li>
                    <li><b>Cole o Código:</b> Apague tudo o que estiver no editor e aperte <code>Ctrl + V</code> para colar.</li>
                    <li><b>Conecte o Arduino:</b> Conecte o cabo USB azul entre o Arduino UNO e o computador.</li>
                    <li><b>Selecione a Placa e Porta:</b> No menu superior, vá em <b>Ferramentas &gt; Placa &gt; Arduino Uno</b> e em <b>Ferramentas &gt; Porta</b> escolha a porta detectada (ex: COM3, COM4).</li>
                    <li><b>Clique em Carregar (Upload):</b> Clique no botão de seta redonda <b>➜ (Carregar)</b> no canto superior esquerdo da IDE e aguarde aparecer <i>"Carregado com sucesso!"</i>!</li>
                </ol>
            </div>
        </div>
    `;
}

// ================= FUNÇÕES DE APOIO E LÓGICA DO JOGO =================

function a9_switchTab(tabKey) {
    A9_STATE.activeTab = tabKey;
    a9_audio.playPop();

    // Atualiza botões
    ['assembly', 'mission1', 'mission2', 'mission3', 'fullcode'].forEach(k => {
        const btn = document.getElementById(`a9-nav-${k}`);
        if (btn) btn.classList.toggle('active', k === tabKey);
    });

    // Se saiu da Missão 3, para o buzzer contínuo
    if (tabKey !== 'mission3') {
        a9_audio.stopBuzzer();
    } else {
        a9_setCarDistance(A9_STATE.carDistance);
    }

    const mount = document.getElementById('a9-tab-content-mount');
    if (mount) mount.innerHTML = a9_renderActiveTabMarkup();
}

function a9_toggleMute() {
    A9_STATE.isMuted = !A9_STATE.isMuted;
    a9_audio.setMuted(A9_STATE.isMuted);

    const btn = document.getElementById('a9-btn-mute');
    const icon = document.getElementById('a9-mute-icon');
    const label = document.getElementById('a9-mute-label');

    if (btn) btn.classList.toggle('muted', A9_STATE.isMuted);
    if (icon) icon.innerText = A9_STATE.isMuted ? '🔇' : '🔊';
    if (label) label.innerText = A9_STATE.isMuted ? 'Mudo' : 'Som Ligado';
}

function a9_selectTool(partId) {
    if (A9_STATE.selectedTool === partId) {
        A9_STATE.selectedTool = null;
        A9_STATE.speechText = 'Peça desmarcada. Escolha qualquer componente na bandeja!';
    } else {
        A9_STATE.selectedTool = partId;
        const part = A9_PARTS.find(p => p.id === partId);
        A9_STATE.speechText = part ? `👉 ${part.hint}` : 'Clique no local que está piscando na placa!';
        a9_audio.playPop();
    }
    const mount = document.getElementById('a9-tab-content-mount');
    if (mount && A9_STATE.activeTab === 'assembly') {
        mount.innerHTML = a9_renderAssemblyBench();
    }
}

function a9_snapComponent(partId) {
    if (A9_STATE.selectedTool === partId || !A9_STATE.selectedTool) {
        // Conexão correta!
        A9_STATE.connections[partId] = true;
        A9_STATE.selectedTool = null;
        a9_audio.playPop();

        const part = A9_PARTS.find(p => p.id === partId);
        A9_STATE.speechText = `✨ Incrível! ${part ? part.name : 'Componente'} conectado com sucesso!`;

        if (a9_isCircuitComplete()) {
            a9_audio.playVictory();
            A9_STATE.speechText = '🎉 PARABÉNS, ENGENHEIRO! Todos os circuitos estão 100% integrados!';
            try {
                localStorage.setItem('aula9_completed', 'true');
                if (typeof updateTrail === 'function') updateTrail();
                if (typeof triggerConfetti === 'function') triggerConfetti(3500);
            } catch (e) {}
        }

        const mount = document.getElementById('a9-tab-content-mount');
        if (mount && A9_STATE.activeTab === 'assembly') {
            mount.innerHTML = a9_renderAssemblyBench();
        }
        a9_updateAssemblyProgressUI();
    } else {
        // Clicou no alvo errado enquanto segurava outra peça!
        a9_triggerSmokeError();
    }
}

function a9_handleHoleClick(event, holeKey, colIndex, rowKey) {
    if (A9_STATE.selectedTool) {
        if (a9_isHoleValidForTool(A9_STATE.selectedTool, holeKey, colIndex, rowKey)) {
            a9_snapComponent(A9_STATE.selectedTool);
            return;
        }
        a9_triggerSmokeError(event);
    }
}

function a9_triggerSmokeError(event) {
    a9_audio.playShortCircuit();
    A9_STATE.speechText = '💨 Ops! Curto-circuito ou furo errado! Olhe a setinha que brilha no destino certo!';

    const smoke = document.getElementById('a9-smoke-mount');
    if (smoke) {
        if (event && event.clientX) {
            smoke.style.left = `${event.offsetX || 200}px`;
            smoke.style.top = `${event.offsetY || 100}px`;
        } else {
            smoke.style.left = '50%';
            smoke.style.top = '40%';
        }
        smoke.style.display = 'block';
        setTimeout(() => {
            if (smoke) smoke.style.display = 'none';
        }, 700);
    }
}

function a9_autoAssembleAll() {
    A9_PARTS.forEach(p => {
        A9_STATE.connections[p.id] = true;
    });
    A9_STATE.selectedTool = null;
    a9_audio.playVictory();
    A9_STATE.speechText = '🚀 Circuito completamente montado no modo Auto-Lego! Pronto para os testes!';

    try {
        localStorage.setItem('aula9_completed', 'true');
        if (typeof updateTrail === 'function') updateTrail();
        if (typeof triggerConfetti === 'function') triggerConfetti(2500);
    } catch (e) {}

    const mount = document.getElementById('a9-tab-content-mount');
    if (mount && A9_STATE.activeTab === 'assembly') {
        mount.innerHTML = a9_renderAssemblyBench();
    }
    a9_updateAssemblyProgressUI();
}

function a9_resetAssembly() {
    A9_PARTS.forEach(p => {
        A9_STATE.connections[p.id] = false;
    });
    A9_STATE.selectedTool = null;
    a9_audio.playPop();
    A9_STATE.speechText = 'Bancada reiniciada! Escolha uma peça para começar a montagem.';
    const mount = document.getElementById('a9-tab-content-mount');
    if (mount && A9_STATE.activeTab === 'assembly') {
        mount.innerHTML = a9_renderAssemblyBench();
    }
    a9_updateAssemblyProgressUI();
}

function a9_setAssemblyFilter(catId) {
    A9_STATE.assemblyFilter = catId;
    A9_STATE.selectedTool = null;
    a9_audio.playPop();
    const mount = document.getElementById('a9-tab-content-mount');
    if (mount && A9_STATE.activeTab === 'assembly') {
        mount.innerHTML = a9_renderAssemblyBench();
    }
}

function a9_autoAssembleModule(moduleKey) {
    if (!moduleKey || moduleKey === 'all') {
        a9_autoAssembleAll();
        return;
    }
    const moduleParts = A9_PARTS.filter(p => p.module === moduleKey);
    moduleParts.forEach(p => {
        A9_STATE.connections[p.id] = true;
    });
    A9_STATE.selectedTool = null;
    a9_audio.playPop();

    const catObj = A9_CATEGORIES.find(c => c.id === moduleKey);
    A9_STATE.speechText = `✨ Módulo "${catObj ? catObj.label : moduleKey}" montado com sucesso!`;

    if (a9_isCircuitComplete()) {
        a9_audio.playVictory();
        A9_STATE.speechText = '🎉 PARABÉNS, ENGENHEIRO! Todos os circuitos estão 100% integrados!';
        try {
            localStorage.setItem('aula9_completed', 'true');
            if (typeof updateTrail === 'function') updateTrail();
            if (typeof triggerConfetti === 'function') triggerConfetti(3500);
        } catch (e) {}
    }

    const mount = document.getElementById('a9-tab-content-mount');
    if (mount && A9_STATE.activeTab === 'assembly') {
        mount.innerHTML = a9_renderAssemblyBench();
    }
    a9_updateAssemblyProgressUI();
}

function a9_testCircuitPower() {
    // 1. Checagem de Alimentação Mestra
    if (!A9_STATE.connections.vcc_power || !A9_STATE.connections.gnd_power) {
        a9_audio.playShortCircuit();
        A9_STATE.speechText = '⚠️ Circuito Sem Alimentação! Conecte o Jumper Vermelho 5V e o Preto GND do Arduino à Protoboard!';
        const speechEl = document.getElementById('a9-speech-bubble');
        if (speechEl) speechEl.innerText = A9_STATE.speechText;
        return;
    }

    // 2. Diagnóstico dos Módulos
    const missing = [];
    if (!A9_STATE.connections.sonar_module || !A9_STATE.connections.sonar_vcc || !A9_STATE.connections.sonar_gnd || !A9_STATE.connections.sonar_trig || !A9_STATE.connections.sonar_echo) {
        missing.push('HC-SR04 (Ultrassom)');
    }
    if (!A9_STATE.connections.sound_module || !A9_STATE.connections.sound_vcc || !A9_STATE.connections.sound_gnd || !A9_STATE.connections.sound_out) {
        missing.push('Sensor de Som');
    }
    if (!A9_STATE.connections.led_component || !A9_STATE.connections.resistor_220 || !A9_STATE.connections.led_d13) {
        missing.push('Faróis LED + Resistor 220Ω');
    }
    if (!A9_STATE.connections.buzzer_component || !A9_STATE.connections.buzzer_signal || !A9_STATE.connections.buzzer_gnd) {
        missing.push('Buzzer Piezo');
    }
    const lcdWires = ['lcd_module', 'lcd_rs', 'lcd_en', 'lcd_d4', 'lcd_d5', 'lcd_d6', 'lcd_d7', 'lcd_vss', 'lcd_vdd', 'lcd_v0', 'lcd_rw', 'lcd_a', 'lcd_k'];
    const lcdMissing = lcdWires.filter(w => !A9_STATE.connections[w]);
    if (lcdMissing.length > 0) {
        missing.push(`Display LCD 16x2 (${lcdMissing.length} cabos pendentes)`);
    }

    if (missing.length === 0) {
        a9_audio.playVictory();
        A9_STATE.speechText = '🔋 100% ENERGIZADO! Barramento 5V ativo, todos os 6 subsistemas conectados com GND e dados sem curtos!';
    } else {
        a9_audio.playPop();
        A9_STATE.speechText = `🔋 Barramento 5V Ativo! Mas faltam conexões em: ${missing.join(', ')}. Use o filtro de módulos para completar!`;
    }

    const speechEl = document.getElementById('a9-speech-bubble');
    if (speechEl) speechEl.innerText = A9_STATE.speechText;
}

function a9_isCircuitComplete() {
    return Object.values(A9_STATE.connections).every(Boolean);
}

function a9_getMissingPartsCount() {
    const total = Object.keys(A9_STATE.connections).length;
    const connected = Object.values(A9_STATE.connections).filter(Boolean).length;
    return total - connected;
}

function a9_updateAssemblyProgressUI() {
    const pill = document.getElementById('a9-assembly-progress-pill');
    if (pill) {
        const total = Object.keys(A9_STATE.connections).length;
        const connected = Object.values(A9_STATE.connections).filter(Boolean).length;
        pill.innerText = `${connected}/${total}`;
    }
}

function a9_recordMissionStar(num) {
    num = parseInt(num, 10);
    try {
        let saved = JSON.parse(localStorage.getItem('aula9_levels') || '[]');
        if (!saved.includes(num)) {
            saved.push(num);
            saved.sort((a,b) => a - b);
            localStorage.setItem('aula9_levels', JSON.stringify(saved));
            if (typeof updateTrail === 'function') updateTrail();
            if (typeof updateHubProgress === 'function') updateHubProgress();
            if (window.makerLeaderboard) {
                window.makerLeaderboard.recordCompletion('aula9', num, 15.0);
            }
        }
    } catch(e) {}
}

// -------------------------------------------------------------
// LÓGICA DA MISSÃO 1: PALMAS & MICROFONE REAL
// -------------------------------------------------------------
function a9_triggerVirtualClap() {
    a9_audio.playClap();
    A9_STATE.clapHeadlightsOn = !A9_STATE.clapHeadlightsOn;
    a9_recordMissionStar(1);

    // Atualiza a tela da Missão 1
    const mount = document.getElementById('a9-tab-content-mount');
    if (mount && A9_STATE.activeTab === 'mission1') {
        mount.innerHTML = a9_renderMission1Clap();
    }
}

async function a9_toggleRealMicrophone() {
    if (A9_STATE.micStreamActive) {
        // Desativa microfone
        if (A9_STATE.micStream) {
            A9_STATE.micStream.getTracks().forEach(track => track.stop());
            A9_STATE.micStream = null;
        }
        if (A9_STATE.micAnimationId) {
            cancelAnimationFrame(A9_STATE.micAnimationId);
            A9_STATE.micAnimationId = null;
        }
        A9_STATE.micStreamActive = false;
        const vuBar = document.getElementById('a9-mic-vu-bar');
        if (vuBar) vuBar.style.width = '0%';
        const mount = document.getElementById('a9-tab-content-mount');
        if (mount && A9_STATE.activeTab === 'mission1') {
            mount.innerHTML = a9_renderMission1Clap();
        }
    } else {
        // Ativa microfone real do usuário
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
            A9_STATE.micStream = stream;
            A9_STATE.micStreamActive = true;

            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            A9_STATE.micAudioCtx = new AudioCtx();
            const source = A9_STATE.micAudioCtx.createMediaStreamSource(stream);
            A9_STATE.micAnalyser = A9_STATE.micAudioCtx.createAnalyser();
            A9_STATE.micAnalyser.fftSize = 256;
            source.connect(A9_STATE.micAnalyser);

            const bufferLength = A9_STATE.micAnalyser.frequencyBinCount;
            const dataArray = new Uint8Array(bufferLength);
            let lastClapTime = 0;

            const checkVolume = () => {
                if (!A9_STATE.micStreamActive) return;
                A9_STATE.micAnalyser.getByteFrequencyData(dataArray);

                let sum = 0;
                for (let i = 0; i < bufferLength; i++) {
                    sum += dataArray[i];
                }
                const average = sum / bufferLength;
                const vuBar = document.getElementById('a9-mic-vu-bar');
                if (vuBar) {
                    const pct = Math.min(100, Math.round((average / 120) * 100));
                    vuBar.style.width = `${pct}%`;
                }

                // Detecção de pico de palma real
                const now = Date.now();
                if (average > 65 && now - lastClapTime > 500) {
                    lastClapTime = now;
                    a9_triggerVirtualClap();
                }

                A9_STATE.micAnimationId = requestAnimationFrame(checkVolume);
            };

            checkVolume();

            const mount = document.getElementById('a9-tab-content-mount');
            if (mount && A9_STATE.activeTab === 'mission1') {
                mount.innerHTML = a9_renderMission1Clap();
            }
        } catch (err) {
            alert('Não foi possível acessar o microfone. Verifique a permissão do seu navegador!');
        }
    }
}

// -------------------------------------------------------------
// LÓGICA DA MISSÃO 2: DISPLAY LCD
// -------------------------------------------------------------
function a9_setLcdTheme(theme) {
    A9_STATE.lcdTheme = theme;
    a9_audio.playPop();
    const mount = document.getElementById('a9-tab-content-mount');
    if (mount && A9_STATE.activeTab === 'mission2') {
        mount.innerHTML = a9_renderMission2Lcd();
    }
}

function a9_updateLcdText(lineNum, val) {
    if (lineNum === 1) A9_STATE.lcdLine1 = val;
    if (lineNum === 2) A9_STATE.lcdLine2 = val;
    a9_recordMissionStar(2);

    const r1 = document.getElementById('a9-lcd-render-line1');
    const r2 = document.getElementById('a9-lcd-render-line2');
    const c1 = document.getElementById('a9-code-lcd-val1');
    const c2 = document.getElementById('a9-code-lcd-val2');

    if (r1) r1.innerText = a9_formatLcdLine(A9_STATE.lcdLine1);
    if (r2) r2.innerText = a9_formatLcdLine(A9_STATE.lcdLine2);
    if (c1) c1.innerText = A9_STATE.lcdLine1;
    if (c2) c2.innerText = A9_STATE.lcdLine2;
}

function a9_insertLcdEmoji(emoji) {
    a9_audio.playPop();
    A9_STATE.lcdLine2 = `${emoji} ${A9_STATE.lcdLine2.slice(0, 12)}`;
    a9_recordMissionStar(2);
    const mount = document.getElementById('a9-tab-content-mount');
    if (mount && A9_STATE.activeTab === 'mission2') {
        mount.innerHTML = a9_renderMission2Lcd();
    }
}

function a9_formatLcdLine(str) {
    return (str || '').padEnd(16, ' ').slice(0, 16);
}

// -------------------------------------------------------------
// LÓGICA DA MISSÃO 3: SENSOR DE RÉ, BUZZER & CARRINHO
// -------------------------------------------------------------
function a9_getCarPixelPosition(distCm) {
    // Mapeia 2cm -> 80px (quase encostado no sensor), 100cm -> 480px (longe)
    const minPx = 85;
    const maxPx = 520;
    const clamped = Math.max(2, Math.min(100, distCm));
    const factor = (clamped - 2) / (100 - 2);
    return minPx + factor * (maxPx - minPx);
}

function a9_getDistanceStage(distCm) {
    if (distCm <= A9_STATE.criticalDistThreshold) {
        return {
            key: 'critical',
            label: 'ZONA CRÍTICA: QUASE BATENDO!',
            icon: '🚨💥',
            bgColor: 'rgba(239, 68, 68, 0.25)',
            borderColor: '#EF4444',
            textColor: '#F87171',
            waveColor: '#EF4444',
            isCritical: true,
            activeBranch: 'critical',
            lcdLine1: `Dist: ${distCm} cm`,
            lcdLine2: '!PARE! VAI BATER',
            buzzerDesc: '🔊 <b>Apito Contínuo Ininterrupto:</b> O buzzer não desliga até o carro se afastar da parede!'
        };
    } else if (distCm <= A9_STATE.warningDistThreshold) {
        return {
            key: 'warning',
            label: 'ZONA DE PERIGO: FREIE O CARRO!',
            icon: '⚠️',
            bgColor: 'rgba(249, 115, 22, 0.25)',
            borderColor: '#F97316',
            textColor: '#FB923C',
            waveColor: '#F97316',
            isCritical: false,
            activeBranch: 'warning',
            lcdLine1: `Dist: ${distCm} cm`,
            lcdLine2: 'Perigo: freando!',
            buzzerDesc: '🔔 <b>Bipes Rápidos e Urgentes:</b> O buzzer apita a cada 200 milissegundos.'
        };
    } else if (distCm <= A9_STATE.attentionDistThreshold) {
        return {
            key: 'attention',
            label: 'ZONA DE ATENÇÃO: MANOBRANDO',
            icon: '🟡',
            bgColor: 'rgba(245, 158, 11, 0.2)',
            borderColor: '#F59E0B',
            textColor: '#FDE68A',
            waveColor: '#FBBF24',
            isCritical: false,
            activeBranch: 'attention',
            lcdLine1: `Dist: ${distCm} cm`,
            lcdLine2: 'Vaga: Atencao...',
            buzzerDesc: '⏰ <b>Bipes Médios Espaçados:</b> O buzzer apita tranquilamente a cada 600 milissegundos.'
        };
    } else {
        return {
            key: 'safe',
            label: 'ZONA SEGURA: VAGA LIVRE',
            icon: '🟢',
            bgColor: 'rgba(16, 185, 129, 0.2)',
            borderColor: '#10B981',
            textColor: '#6EE7B7',
            waveColor: '#10B981',
            isCritical: false,
            activeBranch: 'safe',
            lcdLine1: `Dist: ${distCm} cm`,
            lcdLine2: 'Vaga Livre [OK]',
            buzzerDesc: '🔇 <b>Silêncio Total (noTone):</b> O carro está longe da parede e seguro.'
        };
    }
}

function a9_renderRadarArcsSvg(distCm, stage) {
    const carX = a9_getCarPixelPosition(distCm) - 70;
    const waveCount = distCm <= 10 ? 2 : distCm <= 30 ? 4 : 6;
    let arcs = '';

    for (let i = 1; i <= waveCount; i++) {
        const x = (carX / waveCount) * i;
        arcs += `
            <path d="M ${x} 60 A 25 35 0 0 1 ${x} 120" fill="none" stroke="${stage.waveColor}" stroke-width="${stage.isCritical ? 3.5 : 2.5}" stroke-linecap="round" opacity="${0.9 - (i / waveCount) * 0.4}"/>
        `;
    }
    return arcs;
}

function a9_setCarDistance(val) {
    A9_STATE.carDistance = Math.max(2, Math.min(100, Math.round(val)));
    const stage = a9_getDistanceStage(A9_STATE.carDistance);
    a9_recordMissionStar(3);

    // Atualiza áudio do buzzer de acordo com a zona
    if (A9_STATE.activeTab === 'mission3') {
        a9_audio.startBuzzerMode(stage.key, A9_STATE.buzzerFrequency);
    }

    // Atualiza elementos sem redesenhar tudo se estiver na aba 3
    if (A9_STATE.activeTab === 'mission3') {
        const carEl = document.getElementById('a9-toy-car');
        const slider = document.getElementById('a9-car-slider');
        const sliderLabel = document.getElementById('a9-slider-dist-val');
        const wavesSvg = document.getElementById('a9-radar-waves-svg');

        if (carEl) {
            carEl.style.left = `${a9_getCarPixelPosition(A9_STATE.carDistance)}px`;
            carEl.className = stage.isCritical ? 'a9-shake-crash' : '';
        }
        if (slider) slider.value = A9_STATE.carDistance;
        if (sliderLabel) {
            sliderLabel.innerText = `${A9_STATE.carDistance} cm`;
            sliderLabel.style.color = stage.textColor;
            sliderLabel.style.borderColor = stage.textColor;
        }
        if (wavesSvg) {
            wavesSvg.innerHTML = a9_renderRadarArcsSvg(A9_STATE.carDistance, stage);
        }

        // Atualiza a tela de tempos em tempos para atualizar código C++ e LCD
        const mount = document.getElementById('a9-tab-content-mount');
        if (mount) {
            mount.innerHTML = a9_renderMission3Radar();
        }
    }
}

// Arrastar o carrinho com mouse ou touch
let a9_isDragging = false;
function a9_startDragCar(e) {
    a9_isDragging = true;
    const onMove = (ev) => {
        if (!a9_isDragging) return;
        const track = document.getElementById('a9-scenario-track');
        if (!track) return;
        const rect = track.getBoundingClientRect();
        const clientX = ev.touches ? ev.touches[0].clientX : ev.clientX;
        const relX = clientX - rect.left - 40;
        const dist = Math.round((relX / (rect.width - 120)) * 98) + 2;
        a9_setCarDistance(dist);
    };
    const onEnd = () => {
        a9_isDragging = false;
        window.removeEventListener('mousemove', onMove);
        window.removeEventListener('mouseup', onEnd);
        window.removeEventListener('touchmove', onMove);
        window.removeEventListener('touchend', onEnd);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onEnd);
    window.addEventListener('touchmove', onMove);
    window.addEventListener('touchend', onEnd);
}

function a9_adjustThreshold(type, delta) {
    if (type === 'critical') {
        A9_STATE.criticalDistThreshold = Math.max(3, Math.min(10, A9_STATE.criticalDistThreshold + delta));
    }
    a9_audio.playPop();
    a9_setCarDistance(A9_STATE.carDistance);
}

function a9_adjustFreq(delta) {
    A9_STATE.buzzerFrequency = Math.max(400, Math.min(2500, A9_STATE.buzzerFrequency + delta));
    a9_audio.playPop();
    a9_setCarDistance(A9_STATE.carDistance);
}

// Copiar código do display LCD sem I2C e sem potenciômetro
function a9_copyLcdCode() {
    const l1 = A9_STATE.lcdLine1 || 'Garagem Maker!';
    const l2 = A9_STATE.lcdLine2 || 'Status: 100% OK';
    const code = `// ==============================================================
// PROJETO GARAGEM INTELIGENTE • DISPLAY LCD 16x2 DIRETO
// ==============================================================
// CONEXÃO FÍSICA SEM I2C E SEM POTENCIÔMETRO/DIMMER:
//
// 1. NA PROTOBOARD (ALIMENTAÇÃO & CONTRASTE):
//    - Pino 1 (VSS)          ➔ GND (Trilha Azul -)
//    - Pino 2 (VDD)          ➔ +5V (Trilha Vermelha +)
//    - Pino 3 (V0 Contraste) ➔ GND (Trilha Azul -) [⭐ Contraste Máximo Ideal!]
//    - Pino 5 (RW)           ➔ GND (Trilha Azul -) [⭐ Modo Somente Escrita]
//    - Pino 15 (A - Anode)   ➔ +5V (Trilha Vermelha +) [⭐ Luz de Fundo Direta!]
//    - Pino 16 (K - Cathode) ➔ GND (Trilha Azul -) [Luz de Fundo Terra]
//
// 2. NO ARDUINO UNO (APENAS 6 PINOS DIGITAIS DO LCD):
//    - Pino 4 (RS)           ➔ Pino Digital 12
//    - Pino 6 (E - Enable)   ➔ Pino Digital 11
//    - Pinos 7 a 10 (D0..D3) ➔ DEIXAR VAZIOS (Modo 4-bits)
//    - Pino 11 (D4)          ➔ Pino Digital 10
//    - Pino 12 (D5)          ➔ Pino Digital 9
//    - Pino 13 (D6)          ➔ Pino Digital 8
//    - Pino 14 (D7)          ➔ Pino Digital 7
// ==============================================================

#include <LiquidCrystal.h>

const int RS = 12;
const int EN = 11;
const int D4 = 10;
const int D5 =  9;
const int D6 =  8;
const int D7 =  7;

LiquidCrystal lcd(RS, EN, D4, D5, D6, D7);

void setup() {
  // Inicializa matriz de 16 colunas por 2 linhas:
  lcd.begin(16, 2);
  lcd.clear();

  // Escreve na primeira linha (Linha 0):
  lcd.setCursor(0, 0);
  lcd.print("${l1}");

  // Escreve na segunda linha (Linha 1):
  lcd.setCursor(0, 1);
  lcd.print("${l2}");
}

void loop() {
  // O texto permanece fixo e perfeitamente legível na tela!
}
`;

    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(code).then(() => {
            const btn = document.getElementById('a9-btn-copy-lcd');
            if (btn) {
                btn.innerHTML = '✅ Copiado!';
                btn.style.background = '#059669';
                setTimeout(() => {
                    btn.innerHTML = '📋 Copiar .ino';
                    btn.style.background = '#0D9488';
                }, 2500);
            }
            if (typeof playSound === 'function') playSound('success');
        }).catch(() => {
            prompt('Copie o código abaixo com Ctrl+C:', code);
        });
    } else {
        prompt('Copie o código abaixo com Ctrl+C:', code);
    }
}

// CÓDIGO FONTE OFICIAL DO PROJETO COMPLETO DA GARAGEM INTELIGENTE
const A9_OFFICIAL_INO_CODE = `/*
 * ==============================================================================
 * 🚀 PROJETO: GARAGEM INTELIGENTE DO FUTURO (VOLUME SUAVE / SEM RUÍDO)
 * Plataforma: Criadores de Código — Laboratório Maker
 * Microcontrolador: Arduino UNO R3 (Chip ATmega328P)
 * ==============================================================================
 */

#include <LiquidCrystal.h>

const int RS = 12;
const int EN = 11;
const int D4 = 10;
const int D5 =  9;
const int D6 =  8;
const int D7 =  7;

LiquidCrystal lcd(RS, EN, D4, D5, D6, D7);

const int PIN_TRIG = 6;
const int PIN_ECHO = 5;
const int PIN_SOM  = A0;
const int PIN_LED  = 13;
const int PIN_BUZZER = 4;

bool luzAcesa = false;
long duracaoEco = 0;
int distanciaCm = 0;
unsigned long ultimoTempoPalma = 0;

int ultimaLeituraSom = 512;
const int LIMIAR_VARIACAO = 180;

void setup() {
  pinMode(PIN_TRIG, OUTPUT);
  pinMode(PIN_ECHO, INPUT);
  pinMode(PIN_SOM, INPUT);
  pinMode(PIN_LED, OUTPUT);
  pinMode(PIN_BUZZER, OUTPUT);

  lcd.begin(16, 2);
  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("GARAGEM MAKER");
  lcd.setCursor(0, 1);
  lcd.print("MODO TONS SUAVES");
  delay(1500);
  lcd.clear();
}

void loop() {
  digitalWrite(PIN_TRIG, LOW);
  delayMicroseconds(2);
  digitalWrite(PIN_TRIG, HIGH);
  delayMicroseconds(10);
  digitalWrite(PIN_TRIG, LOW);

  duracaoEco = pulseIn(PIN_ECHO, HIGH, 30000);

  if (duracaoEco == 0) {
    distanciaCm = 99;
  } else {
    distanciaCm = duracaoEco / 58;
  }

  bool carroProximo = (distanciaCm < 50);

  if (carroProximo) {
    // Frequências mais graves e suaves (de 400 Hz a 1500 Hz) para gerar menos chiado elétrico
    int frequencia = map(distanciaCm, 5, 50, 1500, 400);
    frequencia = constrain(frequencia, 400, 1500);
    tone(PIN_BUZZER, frequencia);
  } else {
    noTone(PIN_BUZZER);
  }

  if (!carroProximo) {
    int leituraSomAtual = analogRead(PIN_SOM);
    int variacao = abs(leituraSomAtual - ultimaLeituraSom);

    if (variacao > LIMIAR_VARIACAO && (millis() - ultimoTempoPalma > 1000)) {
      luzAcesa = !luzAcesa;
      digitalWrite(PIN_LED, luzAcesa ? HIGH : LOW);
      ultimoTempoPalma = millis();
    }
    
    ultimaLeituraSom = leituraSomAtual;
  }

  lcd.setCursor(0, 0);
  if (luzAcesa) {
    lcd.print("Luz: ACESA  [ON] ");
  } else {
    lcd.print("Luz: APAGADA[OFF]");
  }

  lcd.setCursor(0, 1);
  if (distanciaCm < 15) {
    lcd.print("Vaga: ");
    lcd.print(distanciaCm);
    lcd.print("cm !PARE!");
  } else {
    lcd.print("Vaga: ");
    lcd.print(distanciaCm);
    lcd.print("cm (OK)  ");
  }

  delay(120);
}
`;

function a9_copyOfficialCode() {
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(A9_OFFICIAL_INO_CODE).then(() => {
            const btn = document.getElementById('a9-btn-copy-official');
            if (btn) {
                btn.innerHTML = '✅ Código Copiado com Sucesso!';
                btn.style.background = '#059669';
                setTimeout(() => {
                    btn.innerHTML = '<i class="fa-solid fa-copy"></i> 📋 Copiar Código Completo';
                    btn.style.background = '#0D9488';
                }, 2500);
            }
            if (typeof playSound === 'function') playSound('success');
        }).catch(() => {
            prompt('Copie o código abaixo com Ctrl+C:', A9_OFFICIAL_INO_CODE);
        });
    } else {
        prompt('Copie o código abaixo com Ctrl+C:', A9_OFFICIAL_INO_CODE);
    }
}

function a9_downloadOfficialIno() {
    try {
        const blob = new Blob([A9_OFFICIAL_INO_CODE], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'garagem_maker_suave.ino';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        if (typeof playSound === 'function') playSound('success');
    } catch (e) {
        alert('Não foi possível gerar o download direto. Use o botão Copiar Código!');
    }
}

// Inicialização e helpers globais
window.a9_copyLcdCode = a9_copyLcdCode;
window.a9_copyOfficialCode = a9_copyOfficialCode;
window.a9_downloadOfficialIno = a9_downloadOfficialIno;
window.loadAula9 = loadAula9;

/* ==========================================================================
   AULA 9 — PRÁTICA AVANÇADA MAKER: A GARAGEM INTELIGENTE DO FUTURO
   Experiência Unificada & Didática para Jovens Makers (12 Anos)
   
   ARQUITETURA PEDAGÓGICA CUMULATIVA (FLUXO CONTÍNUO):
   • Passo 1: ⚡ Energia & Barramento (5V e GND do Arduino na Protoboard)
   • Passo 2: 🦇 Sensor de Ré HC-SR04 (Sonar ultrassônico: Trig no D6, Echo no D5)
   • Passo 3: 👏 Luz por Palmas (Sensor de Som LMV321 no A0 + LED 220Ω no Pino 13)
   • Passo 4: 📟 Painel LCD 16x2 Direto (Sem I2C, Sem Potenciômetro: V0 no GND, RS no D12, E no D11, DB4-DB7 no D10, D9, D8, D7)
   • Passo 5: 🚀 A Garagem Completa & Super Simulador (Arduino IDE C++ e Teste Geral)
   
   REGRA DE OURO DA ELETRÔNICA:
   Cada passo CONSERVA 100% das ligações anteriores! O aluno vê o circuito crescer
   de forma lógica, limpa e cumulativa, sem conexões fantasmas que somem.
   O Display LCD fica montado em suporte externo na parede, NUNCA sobre a protoboard!
   ========================================================================== */

// ================= ESTADO GLOBAL DA AULA 9 =================
let a9_currentStep = 1; // 1 a 5
let a9_isExpanded = false; // Modo centralizado padrão vs expandido tela cheia
let a9_powerLive = true;
let a9_sonarDistance = 25; // cm
let a9_clapLightOn = false;
let a9_lcdText0 = "GARAGEM INTELIGENTE";
let a9_lcdText1 = "Vaga: 25cm (OK)";
let a9_simCarDistance = 25; // cm na simulação completa
let a9_activeTooltip = null;

// Estado da Animação do Sensor HC-SR04 em Pé ("Mini Vídeo")
let a9_hcsr04_height = 0; // 0 = 100% encaixado na protoboard, 100 = suspenso no ar
let a9_hcsr04_video_playing = false;
let a9_hcsr04_video_timer = null;
let a9_hcsr04_active_pin = 'all'; // 'all', 'vcc', 'trig', 'echo', 'gnd'
let a9_hcsr04_sonar_pinging = false;
let a9_hcsr04_step_phase = 3; // 1: no ar, 2: descendo, 3: encaixado, 4: raio-x

// Estado do Inspecionador Interativo do Sensor de Som LMV321 (RoboCore: 1. GND, 2. VCC, 3. OUT Analógico)
let a9_lmv321_active_pin = 'all'; // 'all', 'gnd', 'vcc', 'out'
let a9_lmv321_clapping = false;
let a9_lmv321_sensitivity = 70; // 0 a 100% (limiar de detecção)
let a9_lmv321_voltage = 2.5; // Volts (offset DC centrado em 2,5V no silêncio)
let a9_lmv321_analog_val = 512; // Valor analogRead(A0) (0 a 1023, repouso ~512)

// Aliases para retrocompatibilidade
let a9_ky038_active_pin = a9_lmv321_active_pin;
let a9_ky038_clapping = a9_lmv321_clapping;
let a9_ky038_sensitivity = a9_lmv321_sensitivity;

// Estado do Inspecionador da Ligação do LED e Resistor (Ânodo/Cátodo)
let a9_led_inspect_lit = false;

// Estado do Inspecionador do Display LCD 1602 (1 a 16 pinos vs I2C)
let a9_lcd_view_mode = 'parallel'; // 'parallel' (padrão Master Kit RoboCore), 'i2c', 'tech'

// Mensagens motivacionais personalizadas para cada passo (10-14 anos)
const A9_ENCOURAGEMENTS = {
    1: '⚡ <b>Passo 1/5:</b> Excelente começo, jovem engenheiro! Alimentando o barramento com 5V e GND!',
    2: '🦇 <b>Passo 2/5:</b> Muito bem! O radar ultrassônico de ré agora escuta o eco na vaga do carro!',
    3: '👏 <b>Passo 3/5:</b> Incrível! O sensor LMV321 (100x) amplifica a palma e o Arduino acende a luz na hora!',
    4: '📟 <b>Passo 4/5:</b> Quase lá! O painel LCD 16x2 (GDM1602K) está conectado e pronto para exibir as mensagens!',
    5: '🏆 <b>Passo 5/5:</b> PARABÉNS MAKER! 🌟 Sua Garagem Inteligente do Futuro está 100% montada e funcionando!'
};

// Recupera progresso do localStorage
try {
    const saved = localStorage.getItem('a9_unlocked_step');
    if (saved) {
        const val = parseInt(saved, 10);
        if (!isNaN(val) && val >= 1 && val <= 5) a9_currentStep = val;
    }
} catch (e) {}

// ================= DICIONÁRIO DE TOOLTIPS DIDÁTICOS =================
const A9_TOOLTIPS = {
    'wire_vcc': {
        title: '🔴 Fio Vermelho (+5V)',
        badge: '⚡ ENERGIA POSITIVA',
        badgeColor: '#EF4444',
        flow: 'Arduino 5V ➔ Protoboard Linha (+) ➔ Sensores',
        desc: 'Leva 5 Volts de energia elétrica contínua para alimentar os circuitos de cada peça. Sem ele, os componentes ficam apagados e sem força!'
    },
    'wire_gnd': {
        title: '⚫ Fio Preto (GND / Terra)',
        badge: '🔌 RETORNO 0V / TERRA',
        badgeColor: '#64748B',
        flow: 'Sensores ➔ Protoboard Linha (-) ➔ Arduino GND',
        desc: 'É o caminho de volta dos elétrons que fecha o circuito elétrico (0V). Toda corrente precisa de um caminho seguro de volta para funcionar!'
    },
    'wire_trig': {
        title: '🟡 Fio Amarelo (Trig / Disparo da Ré)',
        badge: '📢 ARDUINO ➔ SENSOR (DISPARO PINO 6)',
        badgeColor: '#FBBF24',
        flow: 'Arduino Pino Digital 6 ➔ Furo 7-e da Protoboard ➔ HC-SR04 (Trig)',
        desc: 'O Arduino envia um pulso elétrico de 10 microssegundos mandando o sensor disparar rajadas inaudíveis de ultrassom a 40.000 Hz. Conecta no Furo 7-e, 100% no bloco superior a-e (antes do canal central)!'
    },
    'wire_echo': {
        title: '🟢 Fio Verde (Echo / Eco da Ré)',
        badge: '👂 SENSOR ➔ ARDUINO (VOLTA O SINAL PINO 5)',
        badgeColor: '#10B981',
        flow: 'HC-SR04 (Echo) ➔ Furo 8-e da Protoboard ➔ Arduino Pino Digital 5',
        desc: 'VOLTA O SINAL! O som bate no carro e volta. O sensor percebe o eco e avisa o Arduino. Conecta no Furo 8-e, 100% no bloco superior a-e (antes do canal central)!'
    },
    'wire_sig': {
        title: '🟣 Fio Magenta (OUT / Som Analógico A0)',
        badge: '👏 SENSOR ➔ ARDUINO (SINAL ANALÓGICO A0)',
        badgeColor: '#EC4899',
        flow: 'Sensor LMV321 (OUT) ➔ Arduino Pino Analógico A0',
        desc: 'SINAL ANALÓGICO AMPLIFICADO (100x)! No silêncio, este fio envia 2,5V (~512 no analogRead). Quando você bate palmas, o microfone e o chip LMV321 fazem a tensão oscilar com picos acima de 3,5V (>650) e vales abaixo de 1,5V (<370), avisando o Arduino para alternar a luz!'
    },
    'wire_led': {
        title: '🔵 Fio Ciano (Lâmpada LED - Pino 13)',
        badge: '💡 ARDUINO ➔ LÂMPADA (COMANDO)',
        badgeColor: '#38BDF8',
        flow: 'Arduino Pino Digital 13 ➔ Furo 21-c ➔ Ânodo (+) do LED ➔ Cátodo (-) Furo 22-d ➔ Resistor 220Ω ➔ GND (-)',
        desc: 'COMANDO DA LUZ DO TETO! O Arduino envia 5V (HIGH) pelo pino 13 até o Ânodo (perna longa) do LED. O Cátodo (perna curta) passa pelo Resistor de 220Ω que limita a corrente em seguros 13.6mA e fecha no GND. Tudo 100% seguro sem risco de queima!'
    },
    // OS 8 FIOS COLORIDOS REAIS DO ALUNO PARA O DISPLAY LCD (SEM REPETIÇÃO DE AZUL):
    'wire_lcd_black': {
        title: '⚫ 1. Fio Preto do LCD (VSS ➔ GND)',
        badge: '🔌 LCD PINO 1 ➔ TRILHA AZUL (-)',
        badgeColor: '#64748B',
        flow: 'LCD Pino 1 (VSS) ➔ Fio Preto ➔ Trilha Azul (-) da Protoboard (0V)',
        desc: 'RETORNO DO LCD! Conecta o terra do display no polo negativo (GND) da protoboard.'
    },
    'wire_lcd_red': {
        title: '🔴 2. Fio Vermelho do LCD (VDD ➔ +5V)',
        badge: '⚡ LCD PINO 2 ➔ TRILHA VERMELHA (+)',
        badgeColor: '#EF4444',
        flow: 'LCD Pino 2 (VDD) ➔ Fio Vermelho ➔ Trilha Vermelha (+) da Protoboard (+5V)',
        desc: 'ENERGIA DO LCD! Alimenta a tela de cristal líquido com 5 Volts contínuos.'
    },
    'wire_lcd_yellow': {
        title: '🟡 3. Fio Amarelo do LCD (RS ➔ Arduino D12)',
        badge: '📝 SELETOR DE REGISTRADOR (PINO 12)',
        badgeColor: '#FACC15',
        flow: 'LCD Pino 4 (RS) ➔ Fio Amarelo ➔ Arduino Pino Digital 12',
        desc: 'COMANDO OU LETRA! Avisa o controlador da tela se o byte enviado é um comando de configuração (LOW) ou uma letra para ser impressa na tela (HIGH)!'
    },
    'wire_lcd_white': {
        title: '⚪ 4. Fio Branco do LCD (E ➔ Arduino D11)',
        badge: '⏱️ HABILITAÇÃO / ENABLE (PINO 11)',
        badgeColor: '#F8FAFC',
        flow: 'LCD Pino 6 (E / Enable) ➔ Fio Branco ➔ Arduino Pino Digital 11',
        desc: 'SINCRONISMO! O Arduino dá um pulso neste fio para o LCD capturar e guardar os dados presentes no barramento!'
    },
    'wire_lcd_green': {
        title: '🟢 5. Fio Verde do LCD (DB4 ➔ Arduino D10)',
        badge: '📦 DADO BIT 4 (PINO 10)',
        badgeColor: '#22C55E',
        flow: 'LCD Pino 11 (DB4) ➔ Fio Verde ➔ Arduino Pino Digital 10',
        desc: 'PRIMEIRO BIT DE DADOS! Conduz o bit 4 dos caracteres no modo econômico de 4-Bits.'
    },
    'wire_lcd_blue': {
        title: '🔵 6. Fio Azul do LCD (DB5 ➔ Arduino D9 - ÚNICO AZUL!)',
        badge: '📦 DADO BIT 5 (PINO 9 - ÚNICO AZUL)',
        badgeColor: '#3B82F6',
        flow: 'LCD Pino 12 (DB5) ➔ Fio Azul ➔ Arduino Pino Digital 9',
        desc: 'SEGUNDO BIT DE DADOS! É o ÚNICO fio azul utilizado no LCD, sem nenhuma repetição!'
    },
    'wire_lcd_orange': {
        title: '🟠 7. Fio Laranja do LCD (DB6 ➔ Arduino D8)',
        badge: '📦 DADO BIT 6 (PINO 8)',
        badgeColor: '#F97316',
        flow: 'LCD Pino 13 (DB6) ➔ Fio Laranja ➔ Arduino Pino Digital 8',
        desc: 'TERCEIRO BIT DE DADOS! Conduz o bit 6 do caractere alfanumérico.'
    },
    'wire_lcd_purple': {
        title: '🟣 8. Fio Roxo do LCD (DB7 ➔ Arduino D7)',
        badge: '📦 DADO BIT 7 (PINO 7)',
        badgeColor: '#A855F7',
        flow: 'LCD Pino 14 (DB7) ➔ Fio Roxo ➔ Arduino Pino Digital 7',
        desc: 'QUARTO BIT DE DADOS! Conduz o bit mais significativo dos 4 bits de dados.'
    },
    'comp_lcd_pot': {
        title: '⚡ Pino 3: V0 (Contraste Padrão Direto no GND - Sem Potenciômetro!)',
        badge: '✨ SIMPLIFICAÇÃO: V0 DIRETO NO GND (0V)',
        badgeColor: '#10B981',
        flow: 'LCD Pino 3 (V0) ➔ Trilha Azul (-) GND da Protoboard',
        desc: 'BRILHO & CONTRASTE PADRÃO! Não precisa de potenciômetro! Ligando o Pino 3 (V0) direto no GND (0V), o visor ativa o contraste padrão de fábrica perfeito e você economiza espaço, peças e fios!'
    },
    'comp_lcd_v0': {
        title: '⚡ Pino 3: V0 (Contraste Padrão Direto no GND - Sem Potenciômetro!)',
        badge: '✨ SIMPLIFICAÇÃO: V0 DIRETO NO GND (0V)',
        badgeColor: '#10B981',
        flow: 'LCD Pino 3 (V0) ➔ Trilha Azul (-) GND da Protoboard',
        desc: 'BRILHO & CONTRASTE PADRÃO! Não precisa de potenciômetro! Ligando o Pino 3 (V0) direto no GND (0V), o visor ativa o contraste padrão de fábrica perfeito e você economiza espaço, peças e fios!'
    },
    'comp_arduino': {
        title: '🤖 Placa Arduino UNO R3',
        badge: '🧠 O CÉREBRO DA GARAGEM',
        badgeColor: '#008184',
        flow: 'Processa sensores e controla atuadores',
        desc: 'O microcontrolador que executa nosso código em C++, lê a distância do ultrassom, detecta a palma via LMV321 no A0 e envia o texto para a tela LCD!'
    },
    'comp_protoboard': {
        title: '⚡ Protoboard (Matriz de Contatos)',
        badge: '🔌 BANCADA SEM SOLDA',
        badgeColor: '#64748B',
        flow: 'Distribui energia e liga os componentes com segurança',
        desc: 'Possui barramentos metálicos internos que compartilham 5V e GND para todos os sensores sem precisarmos soldar nenhum fio!'
    },
    'comp_hcsr04': {
        title: '🦇 Sensor de Ré HC-SR04',
        badge: '📡 RADAR ULTRASSÔNICO',
        badgeColor: '#0284C7',
        flow: 'Emite som pelo olho (T) e escuta o eco pelo olho (R)',
        desc: 'Fixado na parede da garagem na altura do para-choque. Mede a distância do carro de 2 cm até 400 cm com muita precisão!'
    },
    'comp_lmv321': {
        title: '👏 Sensor de Som LMV321 (RoboCore)',
        badge: '🎤 MICROFONE + AMP OP LMV321 (100x)',
        badgeColor: '#EC4899',
        flow: 'Microfone de Eletreto ➔ Amplificador LMV321 (100x) ➔ Saída OUT centrada em 2,5V',
        desc: 'Módulo oficial RoboCore: a onda sonora faz a membrana do microfone vibrar. O chip LMV321 amplifica em 100x e centraliza a saída em 2,5V (512 no analogRead). No repouso fica estável; ao bater palmas oscila com picos e vales!'
    },
    'comp_ky038': {
        title: '👏 Sensor de Som LMV321 (RoboCore)',
        badge: '🎤 MICROFONE + AMP OP LMV321 (100x)',
        badgeColor: '#EC4899',
        flow: 'Microfone de Eletreto ➔ Amplificador LMV321 (100x) ➔ Saída OUT centrada em 2,5V',
        desc: 'Módulo oficial RoboCore com amplificador LMV321 (ganho de 100x). Sinal analógico centrado em 2,5V conectado na porta A0.'
    },
    'comp_led': {
        title: '💡 Lâmpada LED 5mm (Pernas Ânodo e Cátodo)',
        badge: '💡 POLARIDADE: PERNA LONGA = +',
        badgeColor: '#FBBF24',
        flow: 'Coluna 21 (Fio Ciano D13) ➔ Ânodo (+) ➔ Cátodo (-) ➔ Coluna 22 ➔ Resistor 220Ω ➔ GND',
        desc: 'O LED TEM POLARIDADE: A perna longa (Ânodo +) entra na Coluna 21 recebendo 5V do Pino 13. A perna curta (Cátodo -, chanfro reto) entra na Coluna 22 e conecta no Resistor. Nunca inverta!'
    },
    'comp_lcd': {
        title: '📟 Display LCD 16x2 GDM1602K (Master Kit RoboCore & I2C)',
        badge: '📟 MATRIZ 5x8 • 16 PINOS OU MOCHILA I2C',
        badgeColor: '#10B981',
        flow: '16 Pinos (Hitachi HD44780 / GDM1602K) ou 4 Pinos I2C',
        desc: 'Tecnologia Twisted Nematic (cristais líquidos nemáticos torcidos com polarizadores a 90° e backlight). Controlador GDM1602K com matriz de 5x8 pontos por caractere. No Master Kit RoboCore usa-se os 16 pinos com potenciômetro de 10kΩ para contraste (RS=12, EN=11, D4=10, D5=9, D6=8, D7=7) ou a mochila I2C em 4 fios (A4 e A5)!'
    },
    'comp_resistor': {
        title: '⚡ Resistor de 220 Ohms (220Ω: Vermelho, Vermelho, Marrom)',
        badge: '🛑 LIMITADOR DE CORRENTE',
        badgeColor: '#F59E0B',
        flow: 'Coluna 22 (Cátodo do LED) ➔ Resistor ➔ Trilha Azul (-) de GND',
        desc: 'O resistor freia os elétrons para o LED não queimar! Fica entre a Coluna 22 (furo do cátodo) e a Trilha Azul (-) GND (0V). Não tem polaridade (qualquer perna serve).'
    },
    'protoboard_divider': {
        title: '⚠️ Canal Central Isolador da Protoboard',
        badge: '⛔ ISOLAMENTO FÍSICO (a-e) vs (f-j)',
        badgeColor: '#EF4444',
        flow: 'Linhas (a, b, c, d, e) ⛔ NÃO PASSAM SINAL PARA ⛔ Linhas (f, g, h, i, j)',
        desc: 'O sulco central isola a metade de cima da metade de baixo! As colunas só conduzem eletricidade verticalmente dentro do mesmo bloco (a-e ou f-j). Nenhum sinal passa de um lado para outro sem um jumper físico!'
    },
    'pin_vcc': {
        title: '🔴 Pino VCC (+5V)',
        badge: '⚡ ALIMENTAÇÃO POSITIVA',
        badgeColor: '#EF4444',
        flow: 'Trilha Vermelha (+5V) da Protoboard ➔ Sensor HC-SR04',
        desc: 'Alimenta os circuitos integrados internos do sensor HC-SR04 com energia contínua de 5 Volts. Sem ele, o sensor permanece desligado.'
    },
    'pin_trig': {
        title: '🟡 Pino TRIG (Gatilho / Disparo)',
        badge: '📢 ARDUINO ➔ SENSOR (DISPARO)',
        badgeColor: '#FBBF24',
        flow: 'Arduino Pino 9 ➔ HC-SR04 (Pino Trig)',
        desc: 'O Arduino envia um pulso elétrico rápido de 10 microssegundos. O "olho" esquerdo (T) vibra e dispara 8 rajadas inaudíveis de ultrassom a 40.000 Hz no ar!'
    },
    'pin_echo': {
        title: '🟢 Pino ECHO (Eco / Retorno do Som)',
        badge: '👂 SENSOR ➔ ARDUINO (VOLTA O SINAL!)',
        badgeColor: '#10B981',
        flow: 'HC-SR04 (Pino Echo) ➔ Arduino Pino 8',
        desc: 'VOLTA O SINAL! Quando a onda sonora bate no carro e volta, o "olho" direito (R) capta o eco e mantém este pino ligado pelo tempo da viagem para o Arduino calcular a distância!'
    },
    'pin_gnd': {
        title: '⚫ Pino GND (Ground / Terra 0V)',
        badge: '🔌 RETORNO 0V / TERRA',
        badgeColor: '#64748B',
        flow: 'Sensor HC-SR04 ➔ Trilha Azul (-) da Protoboard',
        desc: 'Fecha o circuito de corrente elétrica (0V), garantindo um caminho seguro de retorno para os elétrons sem curto-circuito.'
    },
    'pin_lmv321_gnd': {
        title: '⚫ Pino 1 do LMV321: GND (Terra - 0V)',
        badge: '🔌 RETORNO 0V / TERRA (FIO PRETO)',
        badgeColor: '#64748B',
        flow: 'LMV321 Pino 1 (GND) ➔ Fio Preto ➔ Trilha Azul (-) da Protoboard',
        desc: 'PINO 1 (Esquerda): É o GND (Terra). Conecte com o FIO PRETO na trilha azul (-) da protoboard (0V). É o caminho seguro de retorno dos elétrons que fecha o circuito do sensor!'
    },
    'pin_lmv321_vcc': {
        title: '🔴 Pino 2 do LMV321: VCC (+5V Alimentação)',
        badge: '⚡ ALIMENTAÇÃO +5V (FIO VERMELHO)',
        badgeColor: '#EF4444',
        flow: 'Trilha Vermelha (+5V) ➔ Fio Vermelho ➔ LMV321 Pino 2 (VCC)',
        desc: 'PINO 2 (Centro): É o VCC (+5V). Conecte com o FIO VERMELHO na trilha vermelha (+) da protoboard. Alimenta o microfone e o chip LMV321 com 5 Volts contínuos!'
    },
    'pin_lmv321_out': {
        title: '🟣 Pino 3 do LMV321: OUT (Saída Analógica ➔ A0)',
        badge: '👏 SENSOR ➔ ARDUINO A0 (FIO MAGENTA)',
        badgeColor: '#EC4899',
        flow: 'LMV321 Pino 3 (OUT) ➔ Fio Magenta ➔ Arduino Entrada Analógica A0',
        desc: 'PINO 3 (Direita): É a saída analógica contínua (OUT). Conecte com o FIO MAGENTA na porta analógica A0 do Arduino. Em silêncio entrega 2,5V (~512 no analogRead); ao bater palmas a onda salta para cima e para baixo, permitindo detectar o som com precisão!'
    },
    'pin_ky038_gnd': {
        title: '⚫ Pino 1 do LMV321: GND (Terra - 0V)',
        badge: '🔌 RETORNO 0V / TERRA (FIO PRETO)',
        badgeColor: '#64748B',
        flow: 'LMV321 Pino 1 (GND) ➔ Fio Preto ➔ Trilha Azul (-) da Protoboard',
        desc: 'PINO 1 (Esquerda): É o GND (Terra). Conecte com o FIO PRETO na trilha azul (-) da protoboard (0V).'
    },
    'pin_ky038_vcc': {
        title: '🔴 Pino 2 do LMV321: VCC (+5V Alimentação)',
        badge: '⚡ ALIMENTAÇÃO +5V (FIO VERMELHO)',
        badgeColor: '#EF4444',
        flow: 'Trilha Vermelha (+5V) ➔ Fio Vermelho ➔ LMV321 Pino 2 (VCC)',
        desc: 'PINO 2 (Centro): É o VCC (+5V). Conecte com o FIO VERMELHO na trilha vermelha (+) da protoboard.'
    },
    'pin_ky038_out': {
        title: '🟣 Pino 3 do LMV321: OUT (Saída Analógica ➔ A0)',
        badge: '👏 SENSOR ➔ ARDUINO A0 (FIO MAGENTA)',
        badgeColor: '#EC4899',
        flow: 'LMV321 Pino 3 (OUT) ➔ Fio Magenta ➔ Arduino Entrada Analógica A0',
        desc: 'PINO 3 (Direita): É a saída analógica contínua (OUT). Conecte com o FIO MAGENTA na porta analógica A0 do Arduino.'
    }
};

// ================= DADOS DOS 5 PASSOS DIDÁTICOS =================
const A9_STEPS = [
    {
        num: 1,
        id: 'power',
        title: 'Passo 1: Energia & Barramento',
        shortTitle: '1. Energia (5V / GND)',
        emoji: '⚡',
        accentColor: '#EF4444',
        tagline: 'O coração elétrico: alimentando a protoboard',
        story: 'Antes de ligar qualquer sensor ou tela, precisamos trazer a eletricidade do Arduino até a protoboard! Assim como na sua casa a energia vem do poste até as tomadas da parede, nós usamos o pino <b>5V (Positivo +)</b> e o <b>GND (Negativo -)</b> para energizar as trilhas laterais inteiras.',
        connections: [
            { pin: 'Arduino 5V', to: 'Barramento Vermelho (+)', color: '#EF4444', note: 'Energia positiva de 5 Volts' },
            { pin: 'Arduino GND', to: 'Barramento Azul (-)', color: '#64748B', note: 'Retorno de 0 Volts (Terra)' },
            { pin: 'Ponte (+)', to: 'Liga Linha (+) Superior à Inferior', color: '#EF4444', note: 'Distribui 5V em toda a placa' },
            { pin: 'Ponte (-)', to: 'Liga Linha (-) Superior à Inferior', color: '#64748B', note: 'Distribui GND em toda a placa' }
        ],
        makerTip: '💡 <b>Regra de Ouro Maker:</b> Nunca ligue o 5V direto no GND sem nenhum componente no meio! Isso causaria um curto-circuito.',
        interactiveType: 'power_test'
    },
    {
        num: 2,
        id: 'ultrasonic',
        title: 'Passo 2: Sensor de Ré da Vaga (HC-SR04)',
        shortTitle: '2. Sensor de Ré (HC-SR04)',
        emoji: '🦇',
        accentColor: '#38BDF8',
        tagline: 'O sonar do morcego: medindo a distância do carro',
        story: 'Como os morcegos voam no escuro total sem bater nas paredes? Eles soltam um grito agudo inaudível e escutam o eco! O <b>HC-SR04</b> faz igualzinho: o cilindro <b>T (Trig)</b> grita ultrassom no ar e o cilindro <b>R (Echo)</b> ouve a onda voltar do para-choque do carro.',
        connections: [
            { pin: 'HC-SR04 VCC', to: 'Trilha Vermelha (+5V)', color: '#EF4444', note: 'Alimentação de 5V (Furo 6-a ➔ Trilha +)' },
            { pin: 'HC-SR04 GND', to: 'Trilha Azul (- GND)', color: '#64748B', note: 'Retorno de terra (Furo 9-a ➔ Trilha -)' },
            { pin: 'HC-SR04 Trig', to: 'Arduino Pino Digital 6', color: '#FBBF24', note: 'Fio Amarelo no Furo 7-e (Bloco superior a-e!)' },
            { pin: 'HC-SR04 Echo', to: 'Arduino Pino Digital 5', color: '#10B981', note: 'Fio Verde no Furo 8-e (Bloco superior a-e!)' }
        ],
        makerTip: '💡 <b>A Regra do Canal Central:</b> O canal no meio da protoboard isola o topo (linhas a até e) da base (linhas f até j)! O sensor HC-SR04 está encaixado na <b>Linha c</b> do bloco superior, e os fios Amarelo (Trig) e Verde (Echo) conectam na <b>Linha e</b> das mesmas colunas 7 e 8. Como a Linha e fica <b>ANTES</b> do canal central, o metal interno da coluna conduz o sinal perfeitamente até o sensor!',
        interactiveType: 'sonar_test'
    },
    {
        num: 3,
        id: 'clap',
        title: 'Passo 3: Luz por Palmas (Sensor LMV321 RoboCore + LED)',
        shortTitle: '3. Luz por Palmas (LMV321 + LED)',
        emoji: '👏',
        accentColor: '#EC4899',
        tagline: 'Chegou no escuro com sacolas? Bata palmas para acender a luz!',
        story: 'Você entra na garagem à noite: como acender a luz sem procurar o interruptor? É só bater palmas (👏)! O <b>Sensor de Som da RoboCore</b> utiliza um microfone condensador de eletreto e o chip <b>LMV321</b> (amplificador operacional com ganho de 100x). Em silêncio, a saída analógica fica em <b>2,5V (leitura ~512 no pino A0)</b>. Ao bater palmas, a onda de som oscila violentamente (picos acima de 650 e vales abaixo de 370), fazendo o Arduino acionar o LED no <b>Pino 13</b>! <b>Lembre-se da Protoboard:</b> O canal no meio isola o topo da base! O LED e o resistor de 220Ω ficam 100% no <b>bloco superior (linhas a-e, colunas 21 e 22)</b> sem cruzar o vão.',
        connections: [
            { pin: 'Pino 1: LMV321 GND', to: 'Trilha Azul (- GND)', color: '#64748B', note: 'Fio Preto ➔ Linha Azul (-) da protoboard' },
            { pin: 'Pino 2: LMV321 VCC', to: 'Trilha Vermelha (+5V)', color: '#EF4444', note: 'Fio Vermelho ➔ Linha Vermelha (+) da protoboard' },
            { pin: 'Pino 3: LMV321 OUT', to: 'Arduino Entrada Analógica A0', color: '#EC4899', note: 'Fio Magenta ➔ Sinal analógico centrado em 2,5V' },
            { pin: 'LED Ânodo (+ perna longa)', to: 'Coluna 21 (Furo 21-d)', color: '#38BDF8', note: 'Fio Ciano do Pino 13 entra no Furo 21-c' },
            { pin: 'LED Cátodo (- perna curta)', to: 'Coluna 22 (Furo 22-d)', color: '#FBBF24', note: 'Lado chanfrado reto entra na Coluna 22' },
            { pin: 'Resistor 220Ω (Perna 1)', to: 'Coluna 22 (Furo 22-c)', color: '#F59E0B', note: 'Conecta eletricamente no Cátodo do LED' },
            { pin: 'Resistor 220Ω (Perna 2)', to: 'Trilha Azul (- GND Superior)', color: '#475569', note: 'Fecha o circuito no Terra (0V)' }
        ],
        makerTip: '💡 <b>Como Funciona o LMV321:</b> O microfone capta a onda de som e gera milivolts. O amplificador LMV321 multiplica por 100x e centraliza a tensão em 2,5V (metade de 5V). O pino analógico A0 do Arduino lê 512 no repouso e mais de 650 quando você bate palmas!',
        interactiveType: 'clap_test'
    },
    {
        num: 4,
        id: 'lcd',
        title: 'Passo 4: Painel LCD 16x2 Direto (Sem I2C & Sem Potenciômetro • 8 Fios Coloridos)',
        shortTitle: '4. Painel LCD 16x2 (Sem Potenciômetro!)',
        emoji: '📟',
        accentColor: '#10B981',
        tagline: 'Super Simplificação Maker: Pino 3 (V0) direto no GND ativa o contraste padrão ideal! Zero potenciômetro!',
        story: '<b>Não precisa de potenciômetro!</b> Para simplificar ao máximo a montagem e economizar peças e fios, usamos o clássico <b>Truque Maker</b>: ligar o <b>Pino 3 (V0) diretamente na trilha (-) GND</b>. Isso fixa a tela no nível de contraste padrão de fábrica perfeito! Você conecta apenas os seus <b>8 fios coloridos disponíveis (sem repetir a cor azul!)</b>.',
        connections: [
            { pin: '⚫ Fio Preto', to: 'LCD Pino 1 (VSS) ➔ Trilha Azul (-) GND', color: '#64748B', note: 'Terra do display (0V)' },
            { pin: '🔴 Fio Vermelho', to: 'LCD Pino 2 (VDD) ➔ Trilha Vermelha (+) 5V', color: '#EF4444', note: 'Alimentação positiva de 5 Volts' },
            { pin: '⚡ Pino 3 (V0 Contraste)', to: 'Ligado direto na Trilha Azul (-) GND', color: '#10B981', note: 'Contraste padrão automático! Dispensa o potenciômetro!' },
            { pin: '🟡 Fio Amarelo', to: 'LCD Pino 4 (RS) ➔ Arduino Pino Digital 12', color: '#FACC15', note: 'Seletor de Registrador (Comando vs Letra)' },
            { pin: '🔌 Pino 5 (RW)', to: 'Ligado na Trilha Azul (-) GND', color: '#64748B', note: 'Modo contínuo de escrita de dados' },
            { pin: '⚪ Fio Branco', to: 'LCD Pino 6 (E) ➔ Arduino Pino Digital 11', color: '#F8FAFC', note: 'Habilitação e ritmo de envio (Enable)' },
            { pin: '🟢 Fio Verde', to: 'LCD Pino 11 (DB4) ➔ Arduino Pino Digital 10', color: '#22C55E', note: 'Primeiro bit de dados (Modo 4-Bits)' },
            { pin: '🔵 Fio Azul (ÚNICO!)', to: 'LCD Pino 12 (DB5) ➔ Arduino Pino Digital 9', color: '#3B82F6', note: 'Segundo bit de dados (sem duplicar o azul!)' },
            { pin: '🟠 Fio Laranja', to: 'LCD Pino 13 (DB6) ➔ Arduino Pino Digital 8', color: '#F97316', note: 'Terceiro bit de dados' },
            { pin: '🟣 Fio Roxo', to: 'LCD Pino 14 (DB7) ➔ Arduino Pino Digital 7', color: '#A855F7', note: 'Quarto bit de dados (bit superior)' },
            { pin: '💡 Pino 15 (A) e 16 (K)', to: '15 no (+) 5V e 16 no (-) GND', color: '#EF4444', note: 'Luz de fundo / Backlight da tela' }
        ],
        makerTip: '💡 <b>O Segredo do Contraste Padrão:</b> Em displays LCD 1602 de 5V, aterrar o <b>Pino 3 (V0) direto no GND</b> coloca a tela na faixa ideal de contraste legível de fábrica. Assim você elimina o potenciômetro de 3 pernas, elimina o risco de mau contato e a montagem fica muito mais simples e rápida!',
        interactiveType: 'lcd_test'
    },
    {
        num: 5,
        id: 'combo',
        title: 'Passo 5: A Garagem Completa & Super Simulador!',
        shortTitle: '5. Garagem Completa (Simulador)',
        emoji: '🚀',
        accentColor: '#F59E0B',
        tagline: 'Todos os módulos integrados no mesmo Arduino UNO!',
        story: 'Incrível! Todas as peças estão perfeitamente conectadas em um único circuito elegante: o sensor de ré mede a vaga, o microfone escuta as palmas, o LED ilumina o teto e o visor na parede mostra tudo em tempo real. Teste a garagem ao vivo no simulador abaixo!',
        connections: [
            { pin: 'Tudo Conectado!', to: 'Circuito 100% Integrado', color: '#10B981', note: 'Energia + Ultrassom + Palmas + LCD' }
        ],
        makerTip: '🎉 <b>Parabéns, Jovem Engenheiro!</b> Você montou um sistema de automação residencial completo usado em projetos de robótica profissionais!',
        interactiveType: 'full_simulation'
    }
];

// ================= CÓDIGO FONTE OFICIAL ARDUINO C++ =================
// 100% comentado linha por linha em linguagem simples para iniciantes ("como se fosse um dummy", 10 a 14 anos)
const A9_SKETCH_INO = `/*
 * ==============================================================================
 * 🚀 PROJETO: GARAGEM INTELIGENTE DO FUTURO (AULA 9)
 * Plataforma: Criadores de Código — Laboratório Maker
 * Microcontrolador: Arduino UNO R3 (Chip ATmega328P)
 *
 * 📖 GUIA DIDÁTICO LINHA POR LINHA PARA INICIANTES ("COMO SE FOSSE UM DUMMY"):
 * Cada linha do código abaixo está explicada em detalhes em português simples
 * para você entender exatamente o que o computador dentro do Arduino pensa e faz!
 * ==============================================================================
 */

// ------------------------------------------------------------------------------
// 📟 DISPLAY LCD 1602 EM MODO PARALELO 4-BITS (PADRÃO ROBOCORE SEM I2C)
// LIGAÇÃO DIRETA COM OS 8 FIOS COLORIDOS DO SEU KIT:
// 1. Fio Preto:    LCD Pino 1 (VSS) ➔ GND (Trilha Azul -)
// 2. Fio Vermelho: LCD Pino 2 (VDD) ➔ +5V (Trilha Vermelha +)
// 3. Fio Amarelo:  LCD Pino 4 (RS)  ➔ Arduino Pino 12
// 4. Fio Branco:   LCD Pino 6 (E)   ➔ Arduino Pino 11
// 5. Fio Verde:    LCD Pino 11 (DB4) ➔ Arduino Pino 10
// 6. Fio Azul:     LCD Pino 12 (DB5) ➔ Arduino Pino 9 (ÚNICO AZUL DO LCD!)
// 7. Fio Laranja:  LCD Pino 13 (DB6) ➔ Arduino Pino 8
// 8. Fio Roxo:     LCD Pino 14 (DB7) ➔ Arduino Pino 7
// ⚡ Pino 3 (V0):   LCD Pino 3 (V0)  ➔ GND (Trilha Azul -) CONTRASTE PADRÃO DIRETO (Dispensa potenciômetro!)
// 🔌 Pinos 5 e 16:  LCD RW e K ➔ GND (Trilha Azul -)
// 💡 Pino 15:       LCD A ➔ +5V (Trilha Vermelha +)
// ------------------------------------------------------------------------------
#include <LiquidCrystal.h>

// Definindo os 6 pinos de controle e dados do LCD conectados no Arduino:
const int RS = 12; // Fio Amarelo (Seletor de Registrador)
const int EN = 11; // Fio Branco  (Habilitação / Enable)
const int D4 = 10; // Fio Verde   (Dado Bit 4)
const int D5 =  9; // Fio Azul    (Dado Bit 5 - ÚNICO AZUL!)
const int D6 =  8; // Fio Laranja (Dado Bit 6)
const int D7 =  7; // Fio Roxo    (Dado Bit 7)

// Inicializa a biblioteca LiquidCrystal oficial do Arduino:
LiquidCrystal lcd(RS, EN, D4, D5, D6, D7);

// [Linha 03] Cria o nome PIN_TRIG para o pino digital 6: é a saída por onde o sonar dispara o grito ultrassônico.
const int PIN_TRIG = 6;

// [Linha 04] Cria o nome PIN_ECHO para o pino digital 5: é a entrada que escuta o eco quando o som bate no carro e volta.
const int PIN_ECHO = 5;

// [Linha 05] Cria o nome PIN_SOM para a entrada analógica A0: ligada na saída OUT do sensor LMV321 da RoboCore.
const int PIN_SOM  = A0;

// [Linha 06] Cria o nome PIN_LED para o pino digital 13: é a saída que liga e desliga a lâmpada do teto da garagem.
const int PIN_LED  = 13;

// [Linha 07] Limiares do sensor LMV321 (RoboCore): em silêncio o sinal fica em 2,5V (~512 no analogRead).
// Uma palma gera um pico alto (> 650) ou um vale profundo (< 370).
const int LIMIAR_SOM_ALTO  = 650;
const int LIMIAR_SOM_BAIXO = 370;

// [Linha 08] Cria uma variável booleana (verdadeiro/falso) para guardar se a lâmpada está acesa ou apagada. Começa apagada (false).
bool luzAcesa = false;

// [Linha 09] Cria uma variável para guardar o tempo em microssegundos que a onda sonora demorou para viajar até o carro e voltar.
long duracaoEco = 0;

// [Linha 10] Cria uma variável inteira para guardar a distância final calculada em centímetros (cm) entre o carro e a parede.
int distanciaCm = 0;

// [Linha 11] Guarda o tempo do relógio interno do Arduino (em milissegundos) da última palma ouvida, evitando toques falsos seguidos.
unsigned long ultimoTempoPalma = 0;

// [Linha 12] A função setup() roda apenas UMA ÚNICA VEZ assim que o Arduino é ligado na tomada ou no cabo USB do computador.
void setup() {

  // [Linha 13] Configura o pino 6 como SAÍDA (OUTPUT): o Arduino vai ENVIAR pulsos de energia para disparar o som.
  pinMode(PIN_TRIG, OUTPUT);

  // [Linha 14] Configura o pino 5 como ENTRADA (INPUT): o Arduino vai ESCUTAR o eco sonoro que volta do para-choque do carro.
  pinMode(PIN_ECHO, INPUT);

  // [Linha 15] Configura o pino analógico A0 como ENTRADA (INPUT): recebe o sinal de áudio do sensor LMV321.
  pinMode(PIN_SOM, INPUT);

  // [Linha 16] Configura o pino 13 como SAÍDA (OUTPUT): o Arduino vai MANDAR 5 Volts para acender o LED da lâmpada do teto.
  pinMode(PIN_LED, OUTPUT);

  // [Linha 17] Inicializa o visor LCD com 16 colunas e 2 linhas (Controlador GDM1602K).
  lcd.begin(16, 2);

  // [Linha 18] Apaga qualquer sujeira ou caractere antigo da memória do visor LCD, deixando a tela limpinha.
  lcd.clear();

  // [Linha 19] Posiciona o cursor de digitação na primeira coluna (0) e primeira linha (0) da tela LCD.
  lcd.setCursor(0, 0);

  // [Linha 20] Escreve o texto de abertura "GARAGEM MAKER" na primeira linha do display LCD.
  lcd.print("GARAGEM MAKER");

  // [Linha 21] Move o cursor de digitação para a primeira coluna (0) e segunda linha (1) da tela LCD.
  lcd.setCursor(0, 1);

  // [Linha 22] Escreve "8 FIOS OK!" na segunda linha do display avisando que os 8 fios estão funcionando perfeitamente!
  lcd.print("8 FIOS OK!");

  // [Linha 23] Pausa o Arduino por 1500 milissegundos (1,5 segundos) para você conseguir ler a mensagem na tela.
  delay(1500);

  // [Linha 24] Limpa o visor novamente para prepará-lo para mostrar os dados da garagem em tempo real.
  lcd.clear();

// [Linha 25] Fecha a função setup(). As configurações iniciais estão concluídas com 100% de sucesso!
}

// [Linha 27] A função loop() roda repetidamente em ciclo infinito, centenas de vezes por segundo, enquanto o Arduino estiver ligado!
void loop() {

  // [Linha 28] Lê a tensão analógica do sensor de som LMV321 (RoboCore) no pino A0. No silêncio o valor fica ~512 (2,5V).
  int leituraSom = analogRead(PIN_SOM);

  // [Linha 29] Se a leitura saltar para um pico (>650) ou cair para um vale (<370), significa que uma palma produziu uma onda forte!
  // Também verificamos se já passaram 350 milissegundos desde a última palma para não disparar duas vezes por engano.
  if ((leituraSom > LIMIAR_SOM_ALTO || leituraSom < LIMIAR_SOM_BAIXO) && (millis() - ultimoTempoPalma > 350)) {

    // [Linha 30] Inverte o estado da lâmpada: se estava acesa (true) vira apagada (false); se estava apagada vira acesa!
    luzAcesa = !luzAcesa;

    // [Linha 31] Se luzAcesa for true envia 5V (HIGH) para acender o LED; se for false envia 0V (LOW) para apagar a lâmpada.
    digitalWrite(PIN_LED, luzAcesa ? HIGH : LOW);

    // [Linha 32] Atualiza o relógio marcando a hora desta palma para ignorar repetições ou ecos da mesma batida de mão.
    ultimoTempoPalma = millis();

  // [Linha 33] Fecha o bloco da palma. Se ninguém bateu palmas neste milissegundo, o Arduino continua o código tranquilamente.
  }

  // [Linha 34] Garante que o pino Trig está desligado em nível LOW (0V) antes de disparar um novo grito de som.
  digitalWrite(PIN_TRIG, LOW);

  // [Linha 35] Espera 2 microssegundos apenas para o sinal elétrico do fio se estabilizar perfeitamente.
  delayMicroseconds(2);

  // [Linha 36] Liga o pino Trig em nível HIGH (5V) para começar a emitir as ondas sonoras no ar.
  digitalWrite(PIN_TRIG, HIGH);

  // [Linha 37] Mantém a onda de som disparando por 10 microssegundos (o tempo exato que o sensor precisa para criar o pulso).
  delayMicroseconds(10);

  // [Linha 38] Desliga o pino Trig de volta para LOW (0V), interrompendo a emissão do som e deixando o ar em silêncio.
  digitalWrite(PIN_TRIG, LOW);

  // [Linha 39] Mede com precisão de cronômetro quantos microssegundos o pino Echo leva para escutar o eco bater no carro e voltar!
  duracaoEco = pulseIn(PIN_ECHO, HIGH, 30000);

  // [Linha 40] Verifica se o tempo de eco foi zero (isso acontece se o carro estiver longe demais ou fora da vaga).
  if (duracaoEco == 0) {

    // [Linha 41] Define a distância como 99 cm para indicar que a vaga está totalmente livre e desimpedida.
    distanciaCm = 99;

  // [Linha 42] Caso contrário (se o sensor capturou com sucesso o eco que bateu no para-choque do carro).
  } else {

    // [Linha 43] Converte o tempo do eco em centímetros dividindo por 58 (fórmula baseada na velocidade do som no ar: 340 m/s).
    distanciaCm = duracaoEco / 58;

  // [Linha 44] Fecha o cálculo da distância.
  }

  // [Linha 45] Posiciona o cursor de digitação na primeira coluna (0) e primeira linha (0) da tela LCD.
  lcd.setCursor(0, 0);

  // [Linha 46] Verifica se a lâmpada do teto da garagem está acesa no momento.
  if (luzAcesa) {

    // [Linha 47] Se estiver ligada, escreve "Luz: ACESA  [ON] " para quem estiver olhando a tela na parede da garagem.
    lcd.print("Luz: ACESA  [ON] ");

  // [Linha 48] Caso a luz esteja desligada.
  } else {

    // [Linha 49] Escreve "Luz: APAGADA[OFF]" mostrando que a iluminação da garagem está desligada.
    lcd.print("Luz: APAGADA[OFF]");

  // [Linha 50] Fecha o bloco de atualização do status da luz no display.
  }

  // [Linha 51] Posiciona o cursor de digitação na primeira coluna (0) e segunda linha (1) da tela LCD.
  lcd.setCursor(0, 1);

  // [Linha 52] Verifica se o carro está a menos de 15 centímetros da parede (zona de perigo de bater o para-choque!).
  if (distanciaCm < 15) {

    // [Linha 53] Escreve a palavra "Vaga: " na segunda linha da tela.
    lcd.print("Vaga: ");

    // [Linha 54] Escreve o valor numérico medido da distância (exemplo: 11).
    lcd.print(distanciaCm);

    // [Linha 55] Escreve o alerta "!PARE!" em letras garrafais para o motorista pisar imediatamente no freio!
    lcd.print("cm !PARE!");

  // [Linha 56] Caso a distância medida seja maior ou igual a 15 centímetros (o carro ainda está em segurança na vaga).
  } else {

    // [Linha 57] Escreve a palavra "Vaga: " na segunda linha da tela.
    lcd.print("Vaga: ");

    // [Linha 58] Escreve o valor numérico medido da distância (exemplo: 32).
    lcd.print(distanciaCm);

    // [Linha 59] Escreve "cm (OK)  " com espaços para confirmar que a manobra está tranquila e apagar caracteres antigos.
    lcd.print("cm (OK)  ");

  // [Linha 60] Fecha o bloco de verificação da distância no display LCD.
  }

  // [Linha 61] Aguarda 120 milissegundos para não forçar o display a atualizar rápido demais e evitar que a tela pisque aos olhos.
  delay(120);

// [Linha 62] Fim da função loop()! O Arduino volta imediatamente para a [Linha 28] e repete tudo em ciclo contínuo sem parar!
}
`;

// ================= MOTOR DE SVG CUMULATIVO =================
// Gera o diagrama unificado com EXATAMENTE a mesma escala e posições em todos os passos!
function a9_renderCircuitSvg(step) {
    const isStep1 = step >= 1;
    const isStep2 = step >= 2;
    const isStep3 = step >= 3;
    const isStep4 = step >= 4;
    const isStep5 = step >= 5;

    // Estados dinâmicos da simulação
    const ledLit = (step === 3 && a9_clapLightOn) || (step === 5 && a9_clapLightOn);
    const powerGlow = a9_powerLive ? '#10B981' : '#64748B';
    const displayDist = step === 5 ? a9_simCarDistance : a9_sonarDistance;

    return `
    <svg viewBox="0 0 1100 640" class="a9-circuit-svg" style="width:100%;max-width:1080px;margin:0 auto;display:block;background:radial-gradient(ellipse at 50% 40%, #1E293B 0%, #0F172A 100%);border:2px solid #334155;border-radius:18px;box-shadow:0 12px 35px rgba(0,0,0,0.6);">
        <!-- DEFS & GRADIENTES -->
        <defs>
            <linearGradient id="a9-arduino-pcb" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stop-color="#0E7490"/>
                <stop offset="100%" stop-color="#155E75"/>
            </linearGradient>
            <linearGradient id="a9-breadboard-body" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#F8FAFC"/>
                <stop offset="100%" stop-color="#E2E8F0"/>
            </linearGradient>
            <linearGradient id="a9-lcd-screen" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#064E3B"/>
                <stop offset="100%" stop-color="#022C22"/>
            </linearGradient>
            <filter id="a9-glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="4" result="blur"/>
                <feComposite in="SourceGraphic" in2="blur" operator="over"/>
            </filter>
        </defs>

        <!-- ================= 1. PLACA ARDUINO UNO R3 ================= -->
        <!-- Posição fixa: x=40, y=70, w=330, h=250 -->
        <g id="a9-comp-arduino" class="a9-svg-interactive" onmouseenter="a9_hoverTooltip(event, 'comp_arduino')" onmousemove="a9_moveTooltip(event)" onmouseleave="a9_hideHoverTooltip()" onclick="a9_showTooltip('comp_arduino')" style="cursor:pointer;">
            <!-- Corpo PCB Azul -->
            <path d="M 40 85 Q 40 70 55 70 L 355 70 Q 370 70 370 85 L 370 305 Q 370 320 355 320 L 55 320 Q 40 320 40 305 Z" fill="url(#a9-arduino-pcb)" stroke="#0891B2" stroke-width="2"/>
            
            <!-- Conector USB Prateado -->
            <rect x="25" y="90" width="35" height="45" rx="3" fill="#94A3B8" stroke="#475569" stroke-width="2"/>
            <rect x="20" y="100" width="8" height="25" fill="#334155"/>

            <!-- Jack de Alimentação Preto -->
            <rect x="25" y="240" width="40" height="40" rx="4" fill="#1E293B" stroke="#0F172A" stroke-width="2"/>
            <circle cx="45" cy="260" r="7" fill="#475569"/>

            <!-- Chip Principal ATmega328P -->
            <rect x="175" y="160" width="125" height="42" rx="4" fill="#0F172A" stroke="#334155" stroke-width="1.5"/>
            <text x="237" y="186" text-anchor="middle" fill="#CBD5E1" font-family="'Fira Code', monospace" font-size="10" font-weight="900" letter-spacing="1">ATmega328P</text>

            <!-- Botão Reset Vermelho -->
            <rect x="75" y="80" width="18" height="18" rx="3" fill="#EF4444" stroke="#991B1B" stroke-width="1.5"/>
            <text x="84" y="93" text-anchor="middle" fill="white" font-size="8" font-weight="bold">R</text>

            <!-- LEDs TX / RX e Power 'ON' -->
            <circle cx="150" cy="115" r="3.5" fill="#10B981" filter="url(#a9-glow)"/>
            <text x="160" y="118" fill="#A7F3D0" font-size="7.5" font-weight="bold">ON</text>
            <circle id="a9-led-tx" cx="150" cy="130" r="3" fill="#F59E0B"/>
            <text x="160" y="133" fill="#FDE68A" font-size="7" font-weight="bold">TX</text>
            <circle id="a9-led-rx" cx="150" cy="142" r="3" fill="#F59E0B"/>
            <text x="160" y="145" fill="#FDE68A" font-size="7" font-weight="bold">RX</text>

            <!-- Título do Arduino -->
            <text x="210" y="110" fill="white" font-family="'Fredoka One', cursive" font-size="16" letter-spacing="0.5">Arduino UNO</text>
            <text x="210" y="125" fill="#A5F3FC" font-size="8" font-weight="800">CRIADORES DE CÓDIGO</text>

            <!-- BARRA SUPERIOR DE PINOS DIGITAIS (D0 a D13) -->
            <rect x="155" y="72" width="200" height="15" fill="#0F172A" stroke="#334155" stroke-width="1"/>
            <!-- Rótulos dos pinos digitais com as cores reais dos fios -->
            <text x="185" y="66" fill="${isStep3 ? '#38BDF8' : '#94A3B8'}" font-size="7" font-weight="900">D13</text>
            <text x="200" y="66" fill="${isStep4 ? '#FACC15' : '#94A3B8'}" font-size="7" font-weight="900">D12</text>
            <text x="215" y="66" fill="${isStep4 ? '#F8FAFC' : '#94A3B8'}" font-size="7" font-weight="900">D11</text>
            <text x="230" y="66" fill="${isStep4 ? '#22C55E' : '#94A3B8'}" font-size="7" font-weight="900">D10</text>
            <text x="245" y="66" fill="${isStep4 ? '#3B82F6' : '#94A3B8'}" font-size="7" font-weight="900">D9</text>
            <text x="260" y="66" fill="${isStep4 ? '#F97316' : '#94A3B8'}" font-size="7" font-weight="900">D8</text>
            <text x="275" y="66" fill="${isStep4 ? '#A855F7' : '#94A3B8'}" font-size="7" font-weight="900">D7</text>
            <text x="290" y="66" fill="${isStep2 ? '#FBBF24' : '#94A3B8'}" font-size="7" font-weight="900">D6</text>
            <text x="305" y="66" fill="${isStep2 ? '#10B981' : '#94A3B8'}" font-size="7" font-weight="900">D5</text>

            <!-- Furinhos dos pinos superiores -->
            <circle cx="185" cy="80" r="2.8" fill="#1E293B" stroke="${isStep3 ? '#38BDF8' : '#64748B'}" stroke-width="1.5"/>
            <circle cx="200" cy="80" r="2.8" fill="#1E293B" stroke="${isStep4 ? '#FACC15' : '#64748B'}" stroke-width="1.5"/>
            <circle cx="215" cy="80" r="2.8" fill="#1E293B" stroke="${isStep4 ? '#F8FAFC' : '#64748B'}" stroke-width="1.5"/>
            <circle cx="230" cy="80" r="2.8" fill="#1E293B" stroke="${isStep4 ? '#22C55E' : '#64748B'}" stroke-width="1.5"/>
            <circle cx="245" cy="80" r="2.8" fill="#1E293B" stroke="${isStep4 ? '#3B82F6' : '#64748B'}" stroke-width="1.5"/>
            <circle cx="260" cy="80" r="2.8" fill="#1E293B" stroke="${isStep4 ? '#F97316' : '#64748B'}" stroke-width="1.5"/>
            <circle cx="275" cy="80" r="2.8" fill="#1E293B" stroke="${isStep4 ? '#A855F7' : '#64748B'}" stroke-width="1.5"/>
            <circle cx="290" cy="80" r="2.8" fill="#1E293B" stroke="${isStep2 ? '#FBBF24' : '#64748B'}" stroke-width="1.5"/>
            <circle cx="305" cy="80" r="2.8" fill="#1E293B" stroke="${isStep2 ? '#10B981' : '#64748B'}" stroke-width="1.5"/>

            <!-- BARRA INFERIOR DE PINOS (POWER & ANALOG A0..A5) -->
            <rect x="175" y="303" width="180" height="15" fill="#0F172A" stroke="#334155" stroke-width="1"/>
            <!-- Rótulos Power -->
            <text x="185" y="328" fill="#94A3B8" font-size="7" font-weight="bold">3.3V</text>
            <text x="200" y="328" fill="${isStep1 ? '#EF4444' : '#94A3B8'}" font-size="8" font-weight="900">5V</text>
            <text x="220" y="328" fill="${isStep1 ? '#94A3B8' : '#94A3B8'}" font-size="8" font-weight="900">GND</text>
            <text x="240" y="328" fill="#94A3B8" font-size="7" font-weight="bold">GND</text>
            <!-- Rótulo Analógico A0 para o Sensor de Som LMV321 -->
            <text x="260" y="328" fill="${isStep3 ? '#EC4899' : '#94A3B8'}" font-size="8" font-weight="900">A0</text>

            <!-- Furinhos dos pinos inferiores -->
            <circle cx="200" cy="310" r="3" fill="#1E293B" stroke="${isStep1 ? '#EF4444' : '#64748B'}" stroke-width="1.5"/>
            <circle cx="220" cy="310" r="3" fill="#1E293B" stroke="${isStep1 ? '#475569' : '#64748B'}" stroke-width="1.5"/>
            <circle cx="260" cy="310" r="3" fill="#1E293B" stroke="${isStep3 ? '#EC4899' : '#64748B'}" stroke-width="1.5"/>
        </g>

        <!-- ================= 2. PROTOBOARD (MATRIZ DE CONTATOS) ================= -->
        <!-- Posição fixa: x=420, y=70, w=640, h=230 -->
        <g id="a9-comp-protoboard" class="a9-svg-interactive" onmouseenter="a9_hoverTooltip(event, 'comp_protoboard')" onmousemove="a9_moveTooltip(event)" onmouseleave="a9_hideHoverTooltip()" onclick="a9_showTooltip('comp_protoboard')" style="cursor:pointer;">
            <!-- Base da Protoboard -->
            <rect x="420" y="70" width="640" height="230" rx="12" fill="url(#a9-breadboard-body)" stroke="#CBD5E1" stroke-width="2"/>

            <!-- LINHAS DE ENERGIA SUPERIORES (Positivo Vermelho / Negativo Azul) -->
            <line x1="440" y1="88" x2="1040" y2="88" stroke="#EF4444" stroke-width="2" stroke-dasharray="8,4"/>
            <text x="432" y="91" fill="#EF4444" font-size="10" font-weight="bold">+</text>
            <text x="1045" y="91" fill="#EF4444" font-size="10" font-weight="bold">+</text>

            <line x1="440" y1="102" x2="1040" y2="102" stroke="#0284C7" stroke-width="2" stroke-dasharray="8,4"/>
            <text x="432" y="105" fill="#0284C7" font-size="11" font-weight="bold">-</text>
            <text x="1045" y="105" fill="#0284C7" font-size="11" font-weight="bold">-</text>

            <!-- Furinhos das Linhas de Energia Superiores -->
            ${Array.from({ length: 28 }).map((_, i) => `
                <circle cx="${455 + i * 21}" cy="88" r="2.2" fill="#334155"/>
                <circle cx="${455 + i * 21}" cy="102" r="2.2" fill="#334155"/>
            `).join('')}

            <!-- CANAL CENTRAL DIVISOR (ISOLAMENTO ELÉTRICO ENTRE a-e E f-j) -->
            <g onmouseenter="a9_hoverTooltip(event, 'protoboard_divider')" onmousemove="a9_moveTooltip(event)" onmouseleave="a9_hideHoverTooltip()" onclick="a9_showTooltip('protoboard_divider')" style="cursor:help;">
                <rect x="435" y="173" width="610" height="14" fill="#94A3B8" stroke="#64748B" stroke-width="1"/>
                <line x1="435" y1="180" x2="1045" y2="180" stroke="#475569" stroke-width="1.5" stroke-dasharray="6,4"/>
                <text x="740" y="183" fill="#0F172A" font-size="6.5" font-weight="900" text-anchor="middle" letter-spacing="0.5">
                    ⛔ CANAL CENTRAL: O SINAL NÃO PASSA DE CIMA (a-e) PARA BAIXO (f-j)! ⛔
                </text>
            </g>

            <!-- LETRAS DAS LINHAS (a, b, c, d, e no topo / f, g, h, i, j na base) -->
            <g font-size="7" font-weight="900" fill="#64748B" text-anchor="middle">
                <!-- Coluna de Letras na Esquerda -->
                <text x="444" y="131">a</text>
                <text x="444" y="141">b</text>
                <text x="444" y="151">c</text>
                <text x="444" y="161">d</text>
                <text x="444" y="171">e</text>
                <text x="444" y="195">f</text>
                <text x="444" y="205">g</text>
                <text x="444" y="215">h</text>
                <text x="444" y="225">i</text>
                <text x="444" y="235">j</text>

                <!-- Coluna de Letras na Direita -->
                <text x="1050" y="131">a</text>
                <text x="1050" y="141">b</text>
                <text x="1050" y="151">c</text>
                <text x="1050" y="161">d</text>
                <text x="1050" y="171">e</text>
                <text x="1050" y="195">f</text>
                <text x="1050" y="205">g</text>
                <text x="1050" y="215">h</text>
                <text x="1050" y="225">i</text>
                <text x="1050" y="235">j</text>
            </g>

            <!-- NÚMEROS DAS COLUNAS (1 a 28) -->
            ${[1, 5, 10, 15, 20, 21, 22, 25, 28].map(col => `
                <text x="${455 + (col - 1) * 21}" y="118" text-anchor="middle" fill="${col === 21 ? '#38BDF8' : col === 22 ? '#FBBF24' : '#64748B'}" font-size="${col === 21 || col === 22 ? '8.5' : '8'}" font-weight="900">${col}</text>
                <text x="${455 + (col - 1) * 21}" y="246" text-anchor="middle" fill="#64748B" font-size="8" font-weight="bold">${col}</text>
            `).join('')}

            <!-- MATRIZ DE FURINHOS (a,b,c,d,e e f,g,h,i,j) -->
            ${Array.from({ length: 28 }).map((_, col) => {
                const cx = 455 + col * 21;
                return `
                    <!-- Bloco Superior (a-e) -->
                    <circle cx="${cx}" cy="128" r="2" fill="#475569"/>
                    <circle cx="${cx}" cy="138" r="2" fill="#475569"/>
                    <circle cx="${cx}" cy="148" r="2" fill="#475569"/>
                    <circle cx="${cx}" cy="158" r="2" fill="#475569"/>
                    <circle cx="${cx}" cy="168" r="2" fill="#475569"/>
                    <!-- Bloco Inferior (f-j) -->
                    <circle cx="${cx}" cy="192" r="2" fill="#475569"/>
                    <circle cx="${cx}" cy="202" r="2" fill="#475569"/>
                    <circle cx="${cx}" cy="212" r="2" fill="#475569"/>
                    <circle cx="${cx}" cy="222" r="2" fill="#475569"/>
                    <circle cx="${cx}" cy="232" r="2" fill="#475569"/>
                `;
            }).join('')}

            <!-- LINHAS DE ENERGIA INFERIORES (Positivo Vermelho / Negativo Azul) -->
            <line x1="440" y1="262" x2="1040" y2="262" stroke="#EF4444" stroke-width="2" stroke-dasharray="8,4"/>
            <text x="432" y="265" fill="#EF4444" font-size="10" font-weight="bold">+</text>
            <text x="1045" y="265" fill="#EF4444" font-size="10" font-weight="bold">+</text>

            <line x1="440" y1="278" x2="1040" y2="278" stroke="#0284C7" stroke-width="2" stroke-dasharray="8,4"/>
            <text x="432" y="281" fill="#0284C7" font-size="11" font-weight="bold">-</text>
            <text x="1045" y="281" fill="#0284C7" font-size="11" font-weight="bold">-</text>

            <!-- Furinhos das Linhas de Energia Inferiores -->
            ${Array.from({ length: 28 }).map((_, i) => `
                <circle cx="${455 + i * 21}" cy="262" r="2.2" fill="#334155"/>
                <circle cx="${455 + i * 21}" cy="278" r="2.2" fill="#334155"/>
            `).join('')}

            <!-- Indicador LED de Energia Ativa na Protoboard -->
            <circle cx="1030" cy="180" r="5" fill="${powerGlow}" filter="url(#a9-glow)"/>
            <text x="1020" y="196" fill="#64748B" font-size="7" font-weight="bold">PWR</text>
        </g>

        <!-- ================= 3. PASSO 1: FIOS DE ALIMENTAÇÃO (5V & GND) ================= -->
        <!-- Permanece visível em TODOS os passos subsequentes! -->
        ${isStep1 ? `
            <!-- Fio Vermelho 5V (Arduino ➔ Barramento Inferior +) -->
            <path d="M 200 310 C 220 370, 430 370, 476 262" fill="none" stroke="#EF4444" stroke-width="5" stroke-linecap="round" onmouseenter="a9_hoverTooltip(event, 'wire_vcc')" onmousemove="a9_moveTooltip(event)" onmouseleave="a9_hideHoverTooltip()" onclick="a9_showTooltip('wire_vcc')" class="a9-svg-wire" style="cursor:pointer;"/>
            <circle cx="200" cy="310" r="4.5" fill="#EF4444" stroke="white" stroke-width="1.5"/>
            <circle cx="476" cy="262" r="4" fill="#EF4444" stroke="white" stroke-width="1"/>

            <!-- Fio Preto GND (Arduino ➔ Barramento Inferior -) -->
            <path d="M 220 310 C 240 385, 450 385, 497 278" fill="none" stroke="#475569" stroke-width="4.5" stroke-linecap="round" onmouseenter="a9_hoverTooltip(event, 'wire_gnd')" onmousemove="a9_moveTooltip(event)" onmouseleave="a9_hideHoverTooltip()" onclick="a9_showTooltip('wire_gnd')" class="a9-svg-wire" style="cursor:pointer;"/>
            <circle cx="220" cy="310" r="4.5" fill="#475569" stroke="white" stroke-width="1.5"/>
            <circle cx="497" cy="278" r="4" fill="#475569" stroke="white" stroke-width="1"/>

            <!-- Pontes de Alimentação (Barramento Inferior ➔ Barramento Superior) -->
            <!-- Ponte (+) Vermelha na coluna 28 -->
            <path d="M 1022 262 C 1055 230, 1055 120, 1022 88" fill="none" stroke="#EF4444" stroke-width="3.5" stroke-linecap="round" stroke-dasharray="4,2" onmouseenter="a9_hoverTooltip(event, 'wire_vcc')" onmousemove="a9_moveTooltip(event)" onmouseleave="a9_hideHoverTooltip()" onclick="a9_showTooltip('wire_vcc')" style="cursor:pointer;"/>
            <circle cx="1022" cy="262" r="3.5" fill="#EF4444"/>
            <circle cx="1022" cy="88" r="3.5" fill="#EF4444"/>

            <!-- Ponte (-) Azul na coluna 27 -->
            <path d="M 1001 278 C 1040 240, 1040 140, 1001 102" fill="none" stroke="#0284C7" stroke-width="3.5" stroke-linecap="round" stroke-dasharray="4,2" onmouseenter="a9_hoverTooltip(event, 'wire_gnd')" onmousemove="a9_moveTooltip(event)" onmouseleave="a9_hideHoverTooltip()" onclick="a9_showTooltip('wire_gnd')" style="cursor:pointer;"/>
            <circle cx="1001" cy="278" r="3.5" fill="#0284C7"/>
            <circle cx="1001" cy="102" r="3.5" fill="#0284C7"/>
        ` : ''}

        <!-- ================= 4. PASSO 2: SENSOR HC-SR04 ENCAIXADO EM PÉ ================= -->
        <!-- Ocupa as colunas 6 a 9 da protoboard (x ≈ 560 a 623) no BLOCO SUPERIOR (Linhas a até e) -->
        ${isStep2 ? `
            <!-- RAIO-X EDUCATIVO: LÂMINAS METÁLICAS CONDUTORAS INTERNAS DAS COLUNAS 7 E 8 (LINHAS b até e) -->
            <!-- Demonstra que o metal interno da protoboard conduz o sinal da Linha b até a Linha e SEM cruzar o canal central! -->
            <rect x="577" y="134" width="8" height="38" rx="2" fill="#FBBF24" opacity="0.3" stroke="#FBBF24" stroke-width="1" stroke-dasharray="2,2"/>
            <rect x="598" y="134" width="8" height="38" rx="2" fill="#10B981" opacity="0.3" stroke="#10B981" stroke-width="1" stroke-dasharray="2,2"/>

            <!-- Corpo do Módulo HC-SR04 (Montado em pé com os pinos na Linha b, y=138) -->
            <g id="a9-comp-hcsr04" class="a9-svg-interactive" onmouseenter="a9_hoverTooltip(event, 'comp_hcsr04')" onmousemove="a9_moveTooltip(event)" onmouseleave="a9_hideHoverTooltip()" onclick="a9_showTooltip('comp_hcsr04')" style="cursor:pointer;">
                <!-- Placa Azul do Sensor em pé -->
                <rect x="545" y="106" width="105" height="36" rx="5" fill="#0284C7" stroke="#38BDF8" stroke-width="2"/>
                
                <!-- Transdutor T (Disparo de Ultrassom) -->
                <circle cx="572" cy="124" r="14" fill="#94A3B8" stroke="#E2E8F0" stroke-width="2"/>
                <circle cx="572" cy="124" r="8" fill="#334155"/>
                <text x="572" y="128" text-anchor="middle" fill="white" font-size="9" font-weight="900">T</text>
                
                <!-- Transdutor R (Escuta do Eco) -->
                <circle cx="622" cy="124" r="14" fill="#94A3B8" stroke="#E2E8F0" stroke-width="2"/>
                <circle cx="622" cy="124" r="8" fill="#334155"/>
                <text x="622" y="128" text-anchor="middle" fill="white" font-size="9" font-weight="900">R</text>

                <text x="597" y="117" text-anchor="middle" fill="#E0F2FE" font-size="6.5" font-weight="900">HC-SR04 EM PÉ</text>

                <!-- Pinos prateados descendo da placa até a Linha b (y=138) -->
                <!-- Pino VCC (Coluna 6, x=560) -->
                <line x1="560" y1="134" x2="560" y2="138" stroke="#EF4444" stroke-width="3" onmouseenter="a9_hoverTooltip(event, 'pin_vcc')" onclick="a9_showTooltip('pin_vcc')"/>
                <circle cx="560" cy="138" r="3" fill="#EF4444" stroke="white" stroke-width="0.8"/>

                <!-- Pino Trig (Coluna 7, x=581) -->
                <line x1="581" y1="134" x2="581" y2="138" stroke="#FBBF24" stroke-width="3" onmouseenter="a9_hoverTooltip(event, 'pin_trig')" onclick="a9_showTooltip('pin_trig')"/>
                <circle cx="581" cy="138" r="3" fill="#FBBF24" stroke="white" stroke-width="0.8"/>

                <!-- Pino Echo (Coluna 8, x=602) -->
                <line x1="602" y1="134" x2="602" y2="138" stroke="#10B981" stroke-width="3" onmouseenter="a9_hoverTooltip(event, 'pin_echo')" onclick="a9_showTooltip('pin_echo')"/>
                <circle cx="602" cy="138" r="3" fill="#10B981" stroke="white" stroke-width="0.8"/>

                <!-- Pino GND (Coluna 9, x=623) -->
                <line x1="623" y1="134" x2="623" y2="138" stroke="#475569" stroke-width="3" onmouseenter="a9_hoverTooltip(event, 'pin_gnd')" onclick="a9_showTooltip('pin_gnd')"/>
                <circle cx="623" cy="138" r="3" fill="#475569" stroke="white" stroke-width="0.8"/>
            </g>

            <!-- FIOS DO SENSOR HC-SR04 — TODOS NO BLOCO SUPERIOR (a até e), ANTES DO CANAL CENTRAL! -->
            
            <!-- 1. VCC (+5V): Furo 6-a (x=560, y=128) ➔ Trilha Vermelha (+) Superior (x=560, y=88) -->
            <path d="M 560 128 L 560 88" stroke="#EF4444" stroke-width="3.5" stroke-linecap="round" onmouseenter="a9_hoverTooltip(event, 'wire_vcc')" onmousemove="a9_moveTooltip(event)" onmouseleave="a9_hideHoverTooltip()" onclick="a9_showTooltip('wire_vcc')" class="a9-svg-wire" style="cursor:pointer;"/>
            <circle cx="560" cy="128" r="3" fill="#EF4444" stroke="white" stroke-width="1"/>
            <circle cx="560" cy="88" r="3.5" fill="#EF4444"/>

            <!-- 2. GND (0V): Furo 9-a (x=623, y=128) ➔ Trilha Azul (-) Superior (x=623, y=102) -->
            <path d="M 623 128 L 623 102" stroke="#475569" stroke-width="3.5" stroke-linecap="round" onmouseenter="a9_hoverTooltip(event, 'wire_gnd')" onmousemove="a9_moveTooltip(event)" onmouseleave="a9_hideHoverTooltip()" onclick="a9_showTooltip('wire_gnd')" class="a9-svg-wire" style="cursor:pointer;"/>
            <circle cx="623" cy="128" r="3" fill="#475569" stroke="white" stroke-width="1"/>
            <circle cx="623" cy="102" r="3.5" fill="#475569"/>

            <!-- 3. Trig (Amarelo): Furo 7-e (x=581, y=168 - BLOCO SUPERIOR a-e!) ➔ Arduino Pino Digital 6 (x=290, y=80) -->
            <path d="M 581 168 C 550 200, 310 30, 290 80" fill="none" stroke="#FBBF24" stroke-width="4.5" stroke-linecap="round" onmouseenter="a9_hoverTooltip(event, 'wire_trig')" onmousemove="a9_moveTooltip(event)" onmouseleave="a9_hideHoverTooltip()" onclick="a9_showTooltip('wire_trig')" class="a9-svg-wire" style="cursor:pointer;"/>
            <circle cx="581" cy="168" r="4.5" fill="#FBBF24" stroke="white" stroke-width="1.5"/>
            <circle cx="290" cy="80" r="4" fill="#FBBF24" stroke="white" stroke-width="1"/>
            <text x="581" y="160" text-anchor="middle" fill="#FDE68A" font-size="5.5" font-weight="900">7-e</text>

            <!-- 4. Echo (Verde): Furo 8-e (x=602, y=168 - BLOCO SUPERIOR a-e!) ➔ Arduino Pino Digital 5 (x=305, y=80) -->
            <path d="M 602 168 C 570 210, 325 40, 305 80" fill="none" stroke="#10B981" stroke-width="4.5" stroke-linecap="round" onmouseenter="a9_hoverTooltip(event, 'wire_echo')" onmousemove="a9_moveTooltip(event)" onmouseleave="a9_hideHoverTooltip()" onclick="a9_showTooltip('wire_echo')" class="a9-svg-wire" style="cursor:pointer;"/>
            <circle cx="602" cy="168" r="4.5" fill="#10B981" stroke="white" stroke-width="1.5"/>
            <circle cx="305" cy="80" r="4" fill="#10B981" stroke="white" stroke-width="1"/>
            <text x="602" y="160" text-anchor="middle" fill="#A7F3D0" font-size="5.5" font-weight="900">8-e</text>

            <!-- Ondas Ultrassônicas Animadas -->
            <g opacity="0.8">
                <path d="M 585 96 A 25 25 0 0 1 615 96" fill="none" stroke="#FBBF24" stroke-width="2.5" stroke-linecap="round"/>
                <path d="M 578 86 A 38 38 0 0 1 622 86" fill="none" stroke="#10B981" stroke-width="2" stroke-linecap="round" stroke-dasharray="4,3"/>
            </g>
        ` : ''}

        <!-- ================= 5. PASSO 3: SENSOR DE SOM & LÂMPADA LED ================= -->
        <!-- Sensor LMV321 (RoboCore) nas colunas 14-16; LED nas colunas 21-22 -->
        ${isStep3 ? `
            <!-- RAIO-X EDUCATIVO DA COLUNA 16 (LINHAS c até e) -->
            <rect x="766" y="144" width="8" height="28" rx="2" fill="#EC4899" opacity="0.3" stroke="#EC4899" stroke-width="1" stroke-dasharray="2,2"/>

            <!-- Módulo Sensor de Som RoboCore LMV321 - Ordem física dos pinos: 1. GND, 2. VCC, 3. OUT -->
            <g id="a9-comp-lmv321" class="a9-svg-interactive" onmouseenter="a9_hoverTooltip(event, 'comp_lmv321')" onmousemove="a9_moveTooltip(event)" onmouseleave="a9_hideHoverTooltip()" onclick="a9_showTooltip('comp_lmv321')" style="cursor:pointer;">
                <!-- Placa de Circuito do Sensor LMV321 RoboCore (Azul Escuro / Profissional) -->
                <rect x="710" y="118" width="92" height="52" rx="5" fill="#0A192F" stroke="#EC4899" stroke-width="2"/>
                
                <!-- Cápsula prateada do microfone condensador de eletreto -->
                <circle cx="728" cy="150" r="10" fill="#CBD5E1" stroke="#E2E8F0" stroke-width="1.5"/>
                <circle cx="728" cy="150" r="5" fill="#1E293B"/>
                <text x="728" y="152" fill="#E2E8F0" font-size="4" text-anchor="middle" font-weight="bold">MIC</text>

                <!-- Chip Amplificador Operacional LMV321 (Ganho 100x) -->
                <rect x="746" y="136" width="22" height="15" rx="2" fill="#020617" stroke="#38BDF8" stroke-width="1"/>
                <text x="757" y="145" fill="#67E8F9" font-size="4.5" text-anchor="middle" font-family="monospace" font-weight="bold">LMV321</text>
                <text x="757" y="150" fill="#94A3B8" font-size="3.5" text-anchor="middle">(100x)</text>

                <!-- Circuito de Offset 2,5V e LEDs do módulo -->
                <circle cx="789" cy="132" r="2.5" fill="#EF4444"/>
                <text x="789" y="126" fill="#FCA5A5" font-size="4.5" text-anchor="middle" font-weight="bold">PWR</text>
                <circle id="a9-svg-mic-led" cx="789" cy="150" r="2.5" fill="${ledLit ? '#10B981' : '#334155'}" filter="${ledLit ? 'url(#a9-glow)' : 'none'}"/>
                <text x="789" y="158" fill="#A7F3D0" font-size="4.5" text-anchor="middle" font-weight="bold">AUDIO</text>

                <!-- Serigrafia oficial RoboCore -->
                <text x="756" y="165" text-anchor="middle" fill="#F472B6" font-size="5" font-weight="900">ROBOCORE LMV321 (100x)</text>

                <!-- Rótulos em serigrafia dos 3 pinos físicos na borda superior -->
                <g font-size="5.5" font-weight="900" text-anchor="middle">
                    <text x="728" y="125" fill="#94A3B8">GND</text>
                    <text x="749" y="125" fill="#FCA5A5">VCC</text>
                    <text x="770" y="125" fill="#F472B6">OUT</text>
                </g>
            </g>

            <!-- ================= FIOS DO SENSOR DE SOM LMV321 ================= -->
            <!-- 1. PINO 1 (GND): Coluna 14 (x=728, y=128) ➔ Trilha Azul (-) Superior (x=728, y=102) [FIO PRETO] -->
            <path d="M 728 128 L 728 102" stroke="#475569" stroke-width="3.5" stroke-linecap="round" onmouseenter="a9_hoverTooltip(event, 'pin_lmv321_gnd')" onmousemove="a9_moveTooltip(event)" onmouseleave="a9_hideHoverTooltip()" onclick="a9_showTooltip('pin_lmv321_gnd')" class="a9-svg-wire" style="cursor:pointer;"/>
            <circle cx="728" cy="128" r="3.5" fill="#334155" stroke="#CBD5E1" stroke-width="1"/>
            <circle cx="728" cy="102" r="3.5" fill="#475569"/>

            <!-- 2. PINO 2 (VCC): Coluna 15 (x=749, y=128) ➔ Trilha Vermelha (+) Superior (x=749, y=88) [FIO VERMELHO] -->
            <path d="M 749 128 L 749 88" stroke="#EF4444" stroke-width="3.5" stroke-linecap="round" onmouseenter="a9_hoverTooltip(event, 'pin_lmv321_vcc')" onmousemove="a9_moveTooltip(event)" onmouseleave="a9_hideHoverTooltip()" onclick="a9_showTooltip('pin_lmv321_vcc')" class="a9-svg-wire" style="cursor:pointer;"/>
            <circle cx="749" cy="128" r="3.5" fill="#334155" stroke="#CBD5E1" stroke-width="1"/>
            <circle cx="749" cy="88" r="3.5" fill="#EF4444"/>

            <!-- 3. PINO 3 (OUT): Furo 16-e (x=770, y=168 - BLOCO SUPERIOR a-e!) ➔ Arduino Entrada Analógica A0 (x=260, y=310) [FIO MAGENTA] -->
            <path d="M 770 168 C 730 260, 360 370, 260 310" fill="none" stroke="#EC4899" stroke-width="4.5" stroke-linecap="round" onmouseenter="a9_hoverTooltip(event, 'pin_lmv321_out')" onmousemove="a9_moveTooltip(event)" onmouseleave="a9_hideHoverTooltip()" onclick="a9_showTooltip('pin_lmv321_out')" class="a9-svg-wire" style="cursor:pointer;"/>
            <circle cx="770" cy="168" r="4.5" fill="#EC4899" stroke="white" stroke-width="1.5"/>
            <circle cx="260" cy="310" r="4" fill="#EC4899" stroke="white" stroke-width="1"/>
            <text x="770" y="160" text-anchor="middle" fill="#F472B6" font-size="5.5" font-weight="900">16-e</text>

            <!-- ================= CIRCUITO DO LED & RESISTOR 220Ω (COLUNAS 21 e 22) ================= -->
            <!-- 1. Fio Ciano: Arduino Pino Digital 13 (x=185, y=80) ➔ Coluna 21 Furo c (x=875, y=148) -->
            <path d="M 185 80 C 160 20, 840 25, 875 148" fill="none" stroke="#38BDF8" stroke-width="4.5" stroke-linecap="round" onmouseenter="a9_hoverTooltip(event, 'wire_led')" onmousemove="a9_moveTooltip(event)" onmouseleave="a9_hideHoverTooltip()" onclick="a9_showTooltip('wire_led')" class="a9-svg-wire" style="cursor:pointer;"/>
            <circle cx="185" cy="80" r="4" fill="#38BDF8" stroke="white" stroke-width="1"/>
            <circle cx="875" cy="148" r="4" fill="#38BDF8" stroke="white" stroke-width="1.5"/>

            <!-- 2. LED 5mm na Protoboard (Colunas 21 e 22, Bloco Superior a-e) -->
            <g id="a9-comp-led" class="a9-svg-interactive" onmouseenter="a9_hoverTooltip(event, 'comp_led')" onmousemove="a9_moveTooltip(event)" onmouseleave="a9_hideHoverTooltip()" onclick="a9_showTooltip('comp_led')" style="cursor:pointer;">
                <!-- Perna Longa (Ânodo +): sai do LED (x=882, y=140) e entra na Coluna 21 Furo d (x=875, y=158) -->
                <path d="M 882 140 C 880 150, 876 152, 875 158" fill="none" stroke="#CBD5E1" stroke-width="2.5" stroke-linecap="round"/>
                <circle cx="875" cy="158" r="3.5" fill="#38BDF8" stroke="#FBBF24" stroke-width="1.5"/>
                <text x="866" y="161" fill="#FDE68A" font-size="5" font-weight="900" text-anchor="end">Ânodo (+)</text>

                <!-- Perna Curta (Cátodo -): sai do LED (x=890, y=140) e entra na Coluna 22 Furo d (x=896, y=158) -->
                <path d="M 890 140 C 892 150, 895 152, 896 158" fill="none" stroke="#CBD5E1" stroke-width="2.5" stroke-linecap="round"/>
                <circle cx="896" cy="158" r="3.5" fill="#FBBF24" stroke="#94A3B8" stroke-width="1.5"/>
                <text x="904" y="161" fill="#CBD5E1" font-size="5" font-weight="900" text-anchor="start">Cátodo (-)</text>

                <!-- Flange da base do LED (lado chanfrado reto à direita indicando cátodo) -->
                <rect x="878" y="137" width="16" height="4" rx="1.5" fill="${ledLit ? '#F59E0B' : '#78350F'}"/>
                <line x1="894" y1="137" x2="894" y2="141" stroke="#0F172A" stroke-width="1.2"/>

                <!-- Cúpula / Bulbo do LED Amarelo 5mm com Glow quando aceso -->
                <path d="M 879 137 C 879 122, 893 122, 893 137 Z" fill="${ledLit ? '#FDE047' : '#92400E'}" stroke="#D97706" stroke-width="1.5" filter="${ledLit ? 'url(#a9-glow)' : 'none'}"/>
                <circle cx="883" cy="130" r="2.5" fill="white" opacity="${ledLit ? '0.9' : '0.3'}"/>
                <text x="886" y="118" text-anchor="middle" fill="#FDE68A" font-size="7.5" font-weight="900">LED LÂMPADA</text>
            </g>

            <!-- 3. Resistor de 220Ω (220 Ohms): Coluna 22 Furo c (x=896, y=148) ➔ Trilha Azul (-) GND (x=896, y=102) -->
            <g id="a9-comp-resistor" class="a9-svg-interactive" onmouseenter="a9_hoverTooltip(event, 'comp_resistor')" onmousemove="a9_moveTooltip(event)" onmouseleave="a9_hideHoverTooltip()" onclick="a9_showTooltip('comp_resistor')" style="cursor:pointer;">
                <!-- Perna inferior do resistor encaixando na Coluna 22 Furo c -->
                <line x1="896" y1="148" x2="896" y2="138" stroke="#CBD5E1" stroke-width="2.5" stroke-linecap="round"/>
                <circle cx="896" cy="148" r="3.5" fill="#F59E0B" stroke="#94A3B8" stroke-width="1.5"/>

                <!-- Corpo cerâmico vertical do resistor 220Ω -->
                <rect x="891" y="118" width="10" height="20" rx="3" fill="#D97706" stroke="#92400E" stroke-width="1"/>
                <!-- As 4 Faixas de Cor: Vermelho (2), Vermelho (2), Marrom (x10), Ouro (5%) -->
                <line x1="891" y1="122" x2="901" y2="122" stroke="#EF4444" stroke-width="2"/>
                <line x1="891" y1="126" x2="901" y2="126" stroke="#EF4444" stroke-width="2"/>
                <line x1="891" y1="130" x2="901" y2="130" stroke="#78350F" stroke-width="2"/>
                <line x1="891" y1="135" x2="901" y2="135" stroke="#FBBF24" stroke-width="1.5"/>
                <text x="906" y="130" fill="#FDE68A" font-size="6.5" font-weight="bold">220Ω</text>

                <!-- Perna superior do resistor subindo até a Trilha Azul (-) GND Superior -->
                <line x1="896" y1="118" x2="896" y2="102" stroke="#CBD5E1" stroke-width="2.5" stroke-linecap="round"/>
                <circle cx="896" cy="102" r="3.5" fill="#475569" stroke="white" stroke-width="1"/>
                <text x="912" y="105" fill="#0284C7" font-size="5.5" font-weight="900">GND (-)</text>
            </g>
        ` : ''}

        <!-- ================= 6. PASSO 4 & 5: PAINEL LCD 1602 DIRETO (16 PINOS PARALELO - SEM I2C) ================= -->
        <!-- FIXADO EM SUPORTE EXTERNO (x=440, y=335, w=620, h=285) COMPLETAMENTE FORA E ABAIXO DA PROTOBOARD -->
        ${isStep4 ? `
            <g id="a9-comp-lcd" class="a9-svg-interactive" onmouseenter="a9_hoverTooltip(event, 'comp_lcd')" onmousemove="a9_moveTooltip(event)" onmouseleave="a9_hideHoverTooltip()" onclick="a9_openLcd1602Modal()" style="cursor:pointer;">
                <!-- Suporte de Montagem / Caixa Protetora -->
                <rect x="440" y="335" width="620" height="285" rx="14" fill="#070D1A" stroke="#0284C7" stroke-width="2.5"/>
                
                <!-- Placa de Identificação do Suporte -->
                <rect x="455" y="345" width="590" height="26" rx="6" fill="#0F172A" stroke="#334155" stroke-width="1"/>
                <text x="750" y="362" text-anchor="middle" fill="#38BDF8" font-family="'Fredoka One', cursive" font-size="11" letter-spacing="0.5">
                    📟 DISPLAY LCD 1602 (16 PINOS DIRETO • MODO 4-BITS COM SEUS 8 FIOS COLORIDOS) — CLIQUE PARA DETALHES!
                </text>

                <!-- Placa de Circuito Verde (PCB GDM1602K) do LCD 1602 -->
                <rect x="455" y="380" width="590" height="230" rx="8" fill="#14532D" stroke="#166534" stroke-width="2"/>

                <!-- OS 16 PINOS DE CONEXÃO DO LCD (BARRAMENTO SUPERIOR) -->
                <rect x="470" y="388" width="445" height="22" rx="3" fill="#022C22" stroke="#166534" stroke-width="1"/>

                <!-- Pinos 1 a 16 renderizados individualmente -->
                <!-- Pino 1: VSS (GND) -->
                <g onmouseenter="a9_hoverTooltip(event, 'wire_lcd_black')" onclick="a9_showTooltip('wire_lcd_black')">
                    <circle cx="485" cy="399" r="4.5" fill="#1E293B" stroke="#475569" stroke-width="1.5"/>
                    <text x="485" y="384" text-anchor="middle" fill="#CBD5E1" font-size="6" font-weight="900">1:VSS</text>
                </g>
                <!-- Pino 2: VDD (+5V) -->
                <g onmouseenter="a9_hoverTooltip(event, 'wire_lcd_red')" onclick="a9_showTooltip('wire_lcd_red')">
                    <circle cx="511" cy="399" r="4.5" fill="#DC2626" stroke="#FCA5A5" stroke-width="1.5"/>
                    <text x="511" y="384" text-anchor="middle" fill="#FCA5A5" font-size="6" font-weight="900">2:VDD</text>
                </g>
                <!-- Pino 3: V0 (Contraste Padrão Direto no GND) -->
                <g onmouseenter="a9_hoverTooltip(event, 'comp_lcd_v0')" onclick="a9_showTooltip('comp_lcd_v0')">
                    <circle cx="537" cy="399" r="4.5" fill="#1E293B" stroke="#38BDF8" stroke-width="1.5"/>
                    <text x="537" y="384" text-anchor="middle" fill="#38BDF8" font-size="5" font-weight="900">3:V0(GND)</text>
                </g>
                <!-- Pino 4: RS (Register Select) -->
                <g onmouseenter="a9_hoverTooltip(event, 'wire_lcd_yellow')" onclick="a9_showTooltip('wire_lcd_yellow')">
                    <circle cx="563" cy="399" r="4.5" fill="#FACC15" stroke="#FEF08A" stroke-width="1.5"/>
                    <text x="563" y="384" text-anchor="middle" fill="#FACC15" font-size="6" font-weight="900">4:RS</text>
                </g>
                <!-- Pino 5: RW (Read/Write -> GND) -->
                <g>
                    <circle cx="589" cy="399" r="4.5" fill="#475569" stroke="#94A3B8" stroke-width="1.5"/>
                    <text x="589" y="384" text-anchor="middle" fill="#94A3B8" font-size="6" font-weight="bold">5:RW</text>
                </g>
                <!-- Pino 6: E (Enable) -->
                <g onmouseenter="a9_hoverTooltip(event, 'wire_lcd_white')" onclick="a9_showTooltip('wire_lcd_white')">
                    <circle cx="615" cy="399" r="4.5" fill="#F8FAFC" stroke="#94A3B8" stroke-width="1.5"/>
                    <text x="615" y="384" text-anchor="middle" fill="#F8FAFC" font-size="6" font-weight="900">6:E</text>
                </g>
                <!-- Pinos 7 a 10 (DB0 a DB3 - Livres no Modo 4-Bits) -->
                <g opacity="0.45">
                    <circle cx="641" cy="399" r="3" fill="#334155"/>
                    <circle cx="667" cy="399" r="3" fill="#334155"/>
                    <circle cx="693" cy="399" r="3" fill="#334155"/>
                    <circle cx="719" cy="399" r="3" fill="#334155"/>
                    <text x="680" y="384" text-anchor="middle" fill="#64748B" font-size="5.5">DB0..3 (Livre)</text>
                </g>
                <!-- Pino 11: DB4 -->
                <g onmouseenter="a9_hoverTooltip(event, 'wire_lcd_green')" onclick="a9_showTooltip('wire_lcd_green')">
                    <circle cx="745" cy="399" r="4.5" fill="#22C55E" stroke="#86EFAC" stroke-width="1.5"/>
                    <text x="745" y="384" text-anchor="middle" fill="#22C55E" font-size="6" font-weight="900">11:D4</text>
                </g>
                <!-- Pino 12: DB5 (ÚNICO FIO AZUL!) -->
                <g onmouseenter="a9_hoverTooltip(event, 'wire_lcd_blue')" onclick="a9_showTooltip('wire_lcd_blue')">
                    <circle cx="771" cy="399" r="4.5" fill="#3B82F6" stroke="#93C5FD" stroke-width="1.5"/>
                    <text x="771" y="384" text-anchor="middle" fill="#60A5FA" font-size="6" font-weight="900">12:D5</text>
                </g>
                <!-- Pino 13: DB6 -->
                <g onmouseenter="a9_hoverTooltip(event, 'wire_lcd_orange')" onclick="a9_showTooltip('wire_lcd_orange')">
                    <circle cx="797" cy="399" r="4.5" fill="#F97316" stroke="#FDBA74" stroke-width="1.5"/>
                    <text x="797" y="384" text-anchor="middle" fill="#F97316" font-size="6" font-weight="900">13:D6</text>
                </g>
                <!-- Pino 14: DB7 -->
                <g onmouseenter="a9_hoverTooltip(event, 'wire_lcd_purple')" onclick="a9_showTooltip('wire_lcd_purple')">
                    <circle cx="823" cy="399" r="4.5" fill="#A855F7" stroke="#D8B4FE" stroke-width="1.5"/>
                    <text x="823" y="384" text-anchor="middle" fill="#C084FC" font-size="6" font-weight="900">14:D7</text>
                </g>
                <!-- Pino 15: A (Anodo Backlight -> +5V) -->
                <g>
                    <circle cx="849" cy="399" r="4.5" fill="#EF4444" stroke="#FCA5A5" stroke-width="1.5"/>
                    <text x="849" y="384" text-anchor="middle" fill="#FCA5A5" font-size="6" font-weight="bold">15:A</text>
                </g>
                <!-- Pino 16: K (Catodo Backlight -> GND) -->
                <g>
                    <circle cx="875" cy="399" r="4.5" fill="#475569" stroke="#94A3B8" stroke-width="1.5"/>
                    <text x="875" y="384" text-anchor="middle" fill="#94A3B8" font-size="6" font-weight="bold">16:K</text>
                </g>

                <!-- Moldura Metálica da Tela LCD -->
                <rect x="560" y="430" width="355" height="110" rx="6" fill="#022C22" stroke="#064E3B" stroke-width="3"/>
                <!-- Vidro LCD Verde com Grade de Pixels -->
                <rect x="568" y="438" width="339" height="94" rx="4" fill="url(#a9-lcd-screen)"/>

                <!-- Texto Exibido no LCD (Linha 0 e Linha 1) -->
                <text id="a9-svg-lcd-l0" x="585" y="475" fill="#34D399" font-family="'Courier New', monospace" font-size="16" font-weight="900" letter-spacing="2">
                    ${step === 5 ? (ledLit ? 'Luz: ACESA  [ON]' : 'Luz: APAGADA[OFF]') : 'GARAGEM MAKER'}
                </text>
                <text id="a9-svg-lcd-l1" x="585" y="508" fill="#6EE7B7" font-family="'Courier New', monospace" font-size="15" font-weight="900" letter-spacing="2">
                    ${step === 5 ? (displayDist < 15 ? `Vaga: ${displayDist}cm !PARE!` : `Vaga: ${displayDist}cm (OK) `) : `Vaga: ${displayDist}cm (OK)`}
                </text>

                <!-- ================= BADGE EDUCATIVO: SEM POTENCIÔMETRO! ================= -->
                <!-- Pino 3 (V0) aterrado no GND fixa o contraste padrão perfeitamente -->
                <g transform="translate(465, 435)">
                    <rect x="0" y="0" width="85" height="105" rx="8" fill="#0F172A" stroke="#10B981" stroke-width="1.5"/>
                    <text x="42" y="17" text-anchor="middle" fill="#34D399" font-size="7.5" font-weight="900">✨ SIMPLIFICAÇÃO</text>
                    <text x="42" y="30" text-anchor="middle" fill="#CBD5E1" font-size="7">Contraste Padrão</text>
                    <text x="42" y="42" text-anchor="middle" fill="#FDE68A" font-size="7" font-weight="bold">V0 direto no GND</text>
                    
                    <rect x="8" y="50" width="69" height="45" rx="4" fill="#064E3B" stroke="#059669" stroke-width="1"/>
                    <text x="42" y="64" text-anchor="middle" fill="#A7F3D0" font-size="6.5">Sem potenciômetro!</text>
                    <text x="42" y="76" text-anchor="middle" fill="#6EE7B7" font-size="6.5">Economiza 3 fios</text>
                    <text x="42" y="88" text-anchor="middle" fill="#FDE047" font-size="7" font-weight="900">✔ 100% NÍTIDO</text>
                </g>

                <!-- Jumper do Pino 3 (V0) direto para a Trilha Azul (-) GND Inferior -->
                <path d="M 537 395 C 537 330, 560 310, 560 278" fill="none" stroke="#38BDF8" stroke-width="3" stroke-linecap="round" stroke-dasharray="4,2"/>
                <circle cx="560" cy="278" r="3.5" fill="#38BDF8" stroke="white" stroke-width="1"/>

                <!-- Jumpers internos curtos do backlight (Pinos 15 e 16) e RW (Pino 5) -->
                <!-- Pino 5 (RW) ➔ GND (-) da trilha -->
                <path d="M 589 395 C 589 310, 600 300, 600 278" fill="none" stroke="#475569" stroke-width="2.5" stroke-dasharray="4,2"/>
                <!-- Pino 15 (A) ➔ 5V (+) da trilha -->
                <path d="M 849 395 C 849 310, 860 300, 860 262" fill="none" stroke="#EF4444" stroke-width="2.5" stroke-dasharray="4,2"/>
                <!-- Pino 16 (K) ➔ GND (-) da trilha -->
                <path d="M 875 395 C 875 310, 880 300, 880 278" fill="none" stroke="#475569" stroke-width="2.5" stroke-dasharray="4,2"/>

                <!-- Badge explicativo das cores dos fios -->
                <g transform="translate(930, 440)">
                    <rect x="0" y="0" width="105" height="155" rx="6" fill="#0F172A" stroke="#334155" stroke-width="1"/>
                    <text x="52" y="15" text-anchor="middle" fill="#FBBF24" font-size="7" font-weight="900">SEUS 8 FIOS DO LCD</text>
                    <text x="8" y="32" fill="#94A3B8" font-size="6.5">⚫ 1:VSS ➔ GND</text>
                    <text x="8" y="47" fill="#F87171" font-size="6.5">🔴 2:VDD ➔ 5V</text>
                    <text x="8" y="62" fill="#FACC15" font-size="6.5">🟡 4:RS ➔ D12</text>
                    <text x="8" y="77" fill="#F8FAFC" font-size="6.5">⚪ 6:E ➔ D11</text>
                    <text x="8" y="92" fill="#4ADE80" font-size="6.5">🟢 11:D4 ➔ D10</text>
                    <text x="8" y="107" fill="#60A5FA" font-size="6.5">🔵 12:D5 ➔ D9 (*)</text>
                    <text x="8" y="122" fill="#FB923C" font-size="6.5">🟠 13:D6 ➔ D8</text>
                    <text x="8" y="137" fill="#C084FC" font-size="6.5">🟣 14:D7 ➔ D7</text>
                    <text x="52" y="149" text-anchor="middle" fill="#38BDF8" font-size="5.5">⚡ 3:V0 ➔ GND (Padrão!)</text>
                </g>
            </g>

            <!-- ================= OS 8 FIOS COLORIDOS REAIS DO ALUNO CONECTANDO O LCD AO CIRCUITO ================= -->
            
            <!-- 1. FIO PRETO: LCD Pino 1 (VSS) ➔ Trilha Azul (-) GND Inferior da Protoboard -->
            <path d="M 485 395 C 485 340, 520 300, 520 278" fill="none" stroke="#1E293B" stroke-width="5" stroke-linecap="round" onmouseenter="a9_hoverTooltip(event, 'wire_lcd_black')" onmousemove="a9_moveTooltip(event)" onmouseleave="a9_hideHoverTooltip()" onclick="a9_showTooltip('wire_lcd_black')" class="a9-svg-wire" style="cursor:pointer;"/>
            <path d="M 485 395 C 485 340, 520 300, 520 278" fill="none" stroke="#475569" stroke-width="3" stroke-linecap="round"/>
            <circle cx="520" cy="278" r="4" fill="#1E293B" stroke="#94A3B8" stroke-width="1.5"/>

            <!-- 2. FIO VERMELHO: LCD Pino 2 (VDD) ➔ Trilha Vermelha (+) 5V Inferior da Protoboard -->
            <path d="M 511 395 C 511 340, 540 290, 540 262" fill="none" stroke="#DC2626" stroke-width="4.5" stroke-linecap="round" onmouseenter="a9_hoverTooltip(event, 'wire_lcd_red')" onmousemove="a9_moveTooltip(event)" onmouseleave="a9_hideHoverTooltip()" onclick="a9_showTooltip('wire_lcd_red')" class="a9-svg-wire" style="cursor:pointer;"/>
            <circle cx="540" cy="262" r="4" fill="#DC2626" stroke="#FCA5A5" stroke-width="1.5"/>

            <!-- 3. FIO AMARELO: LCD Pino 4 (RS) ➔ Arduino Pino Digital 12 (x=200, y=80) -->
            <path d="M 563 395 C 563 220, 210 170, 200 80" fill="none" stroke="#FACC15" stroke-width="4.5" stroke-linecap="round" onmouseenter="a9_hoverTooltip(event, 'wire_lcd_yellow')" onmousemove="a9_moveTooltip(event)" onmouseleave="a9_hideHoverTooltip()" onclick="a9_showTooltip('wire_lcd_yellow')" class="a9-svg-wire" style="cursor:pointer;"/>
            <circle cx="200" cy="80" r="4" fill="#FACC15" stroke="#FEF08A" stroke-width="1.5"/>

            <!-- 4. FIO BRANCO: LCD Pino 6 (E / Enable) ➔ Arduino Pino Digital 11 (x=215, y=80) -->
            <path d="M 615 395 C 615 230, 225 180, 215 80" fill="none" stroke="#F8FAFC" stroke-width="4.5" stroke-linecap="round" onmouseenter="a9_hoverTooltip(event, 'wire_lcd_white')" onmousemove="a9_moveTooltip(event)" onmouseleave="a9_hideHoverTooltip()" onclick="a9_showTooltip('wire_lcd_white')" class="a9-svg-wire" style="cursor:pointer;"/>
            <circle cx="215" cy="80" r="4" fill="#F8FAFC" stroke="#94A3B8" stroke-width="1.5"/>

            <!-- 5. FIO VERDE: LCD Pino 11 (DB4) ➔ Arduino Pino Digital 10 (x=230, y=80) -->
            <path d="M 745 395 C 745 240, 240 190, 230 80" fill="none" stroke="#22C55E" stroke-width="4.5" stroke-linecap="round" onmouseenter="a9_hoverTooltip(event, 'wire_lcd_green')" onmousemove="a9_moveTooltip(event)" onmouseleave="a9_hideHoverTooltip()" onclick="a9_showTooltip('wire_lcd_green')" class="a9-svg-wire" style="cursor:pointer;"/>
            <circle cx="230" cy="80" r="4" fill="#22C55E" stroke="#86EFAC" stroke-width="1.5"/>

            <!-- 6. FIO AZUL (ÚNICO FIO AZUL DO LCD!): LCD Pino 12 (DB5) ➔ Arduino Pino Digital 9 (x=245, y=80) -->
            <path d="M 771 395 C 771 250, 255 200, 245 80" fill="none" stroke="#3B82F6" stroke-width="5" stroke-linecap="round" onmouseenter="a9_hoverTooltip(event, 'wire_lcd_blue')" onmousemove="a9_moveTooltip(event)" onmouseleave="a9_hideHoverTooltip()" onclick="a9_showTooltip('wire_lcd_blue')" class="a9-svg-wire" style="cursor:pointer;"/>
            <circle cx="245" cy="80" r="4" fill="#3B82F6" stroke="#93C5FD" stroke-width="1.5"/>

            <!-- 7. FIO LARANJA: LCD Pino 13 (DB6) ➔ Arduino Pino Digital 8 (x=260, y=80) -->
            <path d="M 797 395 C 797 260, 270 210, 260 80" fill="none" stroke="#F97316" stroke-width="4.5" stroke-linecap="round" onmouseenter="a9_hoverTooltip(event, 'wire_lcd_orange')" onmousemove="a9_moveTooltip(event)" onmouseleave="a9_hideHoverTooltip()" onclick="a9_showTooltip('wire_lcd_orange')" class="a9-svg-wire" style="cursor:pointer;"/>
            <circle cx="260" cy="80" r="4" fill="#F97316" stroke="#FDBA74" stroke-width="1.5"/>

            <!-- 8. FIO ROXO: LCD Pino 14 (DB7) ➔ Arduino Pino Digital 7 (x=275, y=80) -->
            <path d="M 823 395 C 823 270, 285 220, 275 80" fill="none" stroke="#A855F7" stroke-width="4.5" stroke-linecap="round" onmouseenter="a9_hoverTooltip(event, 'wire_lcd_purple')" onmousemove="a9_moveTooltip(event)" onmouseleave="a9_hideHoverTooltip()" onclick="a9_showTooltip('wire_lcd_purple')" class="a9-svg-wire" style="cursor:pointer;"/>
            <circle cx="275" cy="80" r="4" fill="#A855F7" stroke="#D8B4FE" stroke-width="1.5"/>
        ` : ''}

        <!-- BADGE EXPLICATIVO FLUTUANTE DA PROTOBOARD LIVRE -->
        <g transform="translate(435, 40)">
            <rect x="0" y="0" width="340" height="22" rx="5" fill="#0F172A" stroke="#38BDF8" stroke-width="1"/>
            <text x="170" y="15" text-anchor="middle" fill="#7DD3FC" font-size="8.5" font-weight="900">
                ✨ CIRCUITO CUMULATIVO: TODAS AS PEÇAS PERMANECEM LIGADAS!
            </text>
        </g>
    </svg>
    `;
}

// ================= TOGGLE MODO EXPANDIDO =================
function a9_toggleExpand() {
    a9_isExpanded = !a9_isExpanded;
    const container = document.getElementById('aula9-loaded');
    const btn = document.getElementById('a9-btn-expand');
    if (container) {
        if (a9_isExpanded) {
            container.classList.add('a9-expanded');
        } else {
            container.classList.remove('a9-expanded');
        }
    }
    if (btn) {
        btn.innerHTML = a9_isExpanded
            ? '<span>🗗</span> <span>Reduzir Visualização</span>'
            : '<span>⛶</span> <span>Modo Expandido / Foco Total</span>';
        btn.style.borderColor = a9_isExpanded ? '#10B981' : '#38BDF8';
        btn.style.color = a9_isExpanded ? '#6EE7B7' : '#38BDF8';
    }
    if (typeof playSound === 'function') playSound('click');
}

// ================= RENDERIZADOR DO CARD DE EXPLICAÇÃO DO PASSO =================
function a9_renderStepExplanationCard(stepData) {
    return `
        <div style="background:#0F172A;border:2px solid ${stepData.accentColor};border-radius:20px;padding:20px;margin-bottom:20px;box-shadow:0 8px 30px rgba(0,0,0,0.5);">
            <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:12px;margin-bottom:12px;">
                <div>
                    <span style="background:${stepData.accentColor}25;color:${stepData.accentColor};border:1px solid ${stepData.accentColor};padding:4px 12px;border-radius:10px;font-size:0.75rem;font-weight:900;">
                        ${stepData.tagline}
                    </span>
                    <h3 style="font-family:'Fredoka One',cursive;color:white;margin:8px 0 0;font-size:1.45rem;">
                        ${stepData.title}
                    </h3>
                </div>

                <!-- Botões de Navegação Rápida entre Passos -->
                <div style="display:flex;gap:8px;">
                    <button onclick="a9_prevStep()" ${a9_currentStep === 1 ? 'disabled style="opacity:0.4;cursor:not-allowed;"' : ''} style="background:#1E293B;border:1px solid #475569;color:white;padding:8px 16px;border-radius:10px;font-weight:800;font-size:0.85rem;cursor:pointer;">
                        ⬅️ Anterior
                    </button>
                    <button onclick="a9_nextStep()" ${a9_currentStep === 5 ? 'disabled style="opacity:0.4;cursor:not-allowed;"' : ''} style="background:linear-gradient(135deg,#38BDF8,#0284C7);border:none;color:#0F172A;padding:8px 18px;border-radius:10px;font-weight:900;font-size:0.85rem;cursor:pointer;box-shadow:0 4px 15px rgba(56,189,248,0.3);">
                        ${a9_currentStep === 4 ? 'Ir para a Garagem Completa! 🚀' : a9_currentStep === 5 ? '🏆 Montagem Concluída!' : 'Próximo Passo ➡️'}
                    </button>
                </div>
            </div>

            <!-- Explicação Didática sem jargões complicados -->
            <p style="color:#CBD5E1;font-size:0.95rem;line-height:1.6;margin-bottom:16px;">
                ${stepData.story}
            </p>

            <!-- Checklist de Ligações Elétricas Deste Passo -->
            <div style="background:#1E293B;border-radius:14px;padding:14px;margin-bottom:16px;">
                <div style="color:#FDE68A;font-size:0.85rem;font-weight:900;margin-bottom:10px;display:flex;align-items:center;gap:6px;">
                    <span>🔌 Ligações Físicas Deste Passo:</span>
                    <span style="color:#94A3B8;font-size:0.75rem;font-weight:normal;">(Passe o mouse nos fios no diagrama abaixo para detalhes)</span>
                </div>

                <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(220px, 1fr));gap:8px;">
                    ${stepData.connections.map(c => `
                        <div style="background:#0F172A;border-left:4px solid ${c.color};border-radius:8px;padding:8px 12px;">
                            <div style="display:flex;justify-content:space-between;align-items:center;">
                                <strong style="color:white;font-size:0.82rem;">${c.pin}</strong>
                                <span style="color:${c.color};font-size:0.75rem;font-weight:bold;">➔ ${c.to}</span>
                            </div>
                            <div style="color:#94A3B8;font-size:0.75rem;margin-top:2px;">${c.note}</div>
                        </div>
                    `).join('')}
                </div>
            </div>

            <!-- Dica Maker -->
            <div style="background:rgba(251,191,36,0.1);border:1px dashed #FBBF24;border-radius:10px;padding:10px 14px;color:#FDE68A;font-size:0.88rem;">
                ${stepData.makerTip}
            </div>

            <!-- Mini Vídeo & Simulador de Encaixe em Pé do HC-SR04 (Exclusivo do Passo 2) -->
            ${stepData.num === 2 ? `
                <div style="margin-top:16px;">
                    ${a9_renderHcSr04InsertionPlayer()}
                </div>
            ` : ''}

            <!-- Inspecionador do KY-038 & Inspecionador do LED + Resistor (Exclusivos do Passo 3) -->
            ${stepData.num === 3 ? `
                <div style="margin-top:16px;display:flex;flex-direction:column;gap:16px;">
                    ${a9_renderLedResistorInspector()}
                    ${a9_renderKy038Inspector()}
                </div>
            ` : ''}

            <!-- Inspecionador do Display LCD 1602: 16 Pinos vs I2C (Exclusivo do Passo 4) -->
            ${stepData.num === 4 ? `
                <div style="margin-top:16px;">
                    ${a9_renderLcd1602Inspector()}
                </div>
            ` : ''}
        </div>
    `;
}

// ================= RENDERIZADOR DA SEÇÃO DA ARDUINO IDE (ESTILO OFICIAL AULA 8) =================
function a9_renderIdeSection() {
    // Gera números de linha e formatação do código C++ didático
    const rawLines = A9_SKETCH_INO.trim().split('\n');
    const gutterHtml = rawLines.map((_, i) => `<div style="height:22px;line-height:22px;">${i + 1}</div>`).join('');

    const codeHtml = rawLines.map(line => {
        let escaped = a9_escapeHtml(line);
        if (escaped.trim().startsWith('//')) {
            return `<div style="height:22px;line-height:22px;color:#15803D;font-style:italic;font-weight:700;">${escaped}</div>`;
        } else if (escaped.trim().startsWith('/*') || escaped.trim().startsWith('*') || escaped.trim().startsWith('*/')) {
            return `<div style="height:22px;line-height:22px;color:#64748B;font-style:italic;">${escaped}</div>`;
        }
        escaped = escaped
            .replace(/\b(const|int|bool|long|unsigned|void|if|else|return)\b/g, '<span style="color:#007E82;font-weight:bold;">$1</span>')
            .replace(/\b(HIGH|LOW|OUTPUT|INPUT|true|false)\b/g, '<span style="color:#006699;font-weight:bold;">$1</span>')
            .replace(/\b(pinMode|digitalWrite|digitalRead|delay|delayMicroseconds|pulseIn|millis)\b/g, '<span style="color:#D35400;font-weight:bold;">$1</span>')
            .replace(/\b(lcd\.init|lcd\.backlight|lcd\.clear|lcd\.setCursor|lcd\.print)\b/g, '<span style="color:#B45309;font-weight:bold;">$1</span>')
            .replace(/(&quot;.*?&quot;)/g, '<span style="color:#2563EB;">$1</span>');
        return `<div style="height:22px;line-height:22px;color:#0F172A;">${escaped}</div>`;
    }).join('');

    return `
        <!-- CARD CONTAINER DO CÓDIGO FONTE OFICIAL COM ARDUINO IDE COMPLETA -->
        <div style="background:#0F172A;border:2px solid #10B981;border-radius:22px;padding:22px;margin-bottom:25px;box-shadow:0 12px 35px rgba(16,185,129,0.25);">
            
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;flex-wrap:wrap;gap:10px;">
                <div style="display:flex;align-items:center;gap:12px;">
                    <span style="background:#008184;color:white;width:46px;height:46px;border-radius:14px;display:flex;align-items:center;justify-content:center;font-size:1.5rem;box-shadow:0 0 15px rgba(0,129,132,0.5);">
                        <i class="fa-solid fa-laptop-code"></i>
                    </span>
                    <div>
                        <h3 style="font-family:'Fredoka One',cursive;color:white;margin:0;font-size:1.35rem;display:flex;align-items:center;gap:8px;">
                            Arduino IDE Oficial: Código C++ da Garagem Inteligente
                        </h3>
                        <p style="color:#94A3B8;margin:2px 0 0;font-size:0.85rem;">
                            Comentado linha por linha para iniciantes • Use os botões redondos para Verificar (✓) e Carregar (➔)!
                        </p>
                    </div>
                </div>

                <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
                    <span style="background:rgba(16,185,129,0.15);border:1px solid #10B981;color:#6EE7B7;padding:5px 12px;border-radius:20px;font-size:0.8rem;font-weight:900;">
                        🟢 Placa: Arduino UNO (COM3)
                    </span>
                    <button onclick="a9_copySketch()" style="background:#10B981;border:none;color:white;padding:7px 14px;border-radius:10px;font-weight:900;font-size:0.82rem;cursor:pointer;display:inline-flex;align-items:center;gap:6px;box-shadow:0 4px 15px rgba(16,185,129,0.3);">
                        <i class="fa-solid fa-copy"></i> Copiar Código (.INO)
                    </button>
                </div>
            </div>

            <!-- ARDUINO IDE JANELA IDÊNTICA À AULA 8 -->
            <div class="a9-ard-ide" style="background:#008184;border:2px solid #00979D;border-radius:12px;overflow:hidden;box-shadow:0 12px 35px rgba(0,0,0,0.55);font-family:'Segoe UI',Tahoma,sans-serif;">
                
                <!-- 1. TITLEBAR OFICIAL -->
                <div style="background:#006468;color:white;padding:6px 14px;font-size:0.8rem;font-weight:700;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid rgba(255,255,255,0.15);">
                    <div style="display:flex;align-items:center;gap:8px;">
                        <span>garagem_inteligente.ino | Arduino IDE 1.8.19</span>
                    </div>
                    <div style="display:flex;gap:8px;font-size:0.85rem;color:#E0F2FE;">
                        <span style="cursor:pointer;" title="Minimizar">—</span>
                        <span style="cursor:pointer;" title="Maximizar">▢</span>
                        <span style="cursor:pointer;" title="Fechar">✕</span>
                    </div>
                </div>

                <!-- 2. MENUBAR OFICIAL -->
                <div style="background:#008184;color:white;padding:4px 12px;display:flex;gap:14px;font-size:0.82rem;border-bottom:1px solid rgba(0,0,0,0.15);user-select:none;">
                    <span style="padding:2px 6px;border-radius:4px;cursor:pointer;" onclick="a9_copySketch()" title="Menu Arquivo">Arquivo</span>
                    <span style="padding:2px 6px;border-radius:4px;cursor:pointer;" onclick="a9_autoFormatCode()" title="Menu Editar">Editar</span>
                    <span style="padding:2px 6px;border-radius:4px;cursor:pointer;" onclick="a9_verifySketch()" title="Menu Sketch">Sketch</span>
                    <span style="padding:2px 6px;border-radius:4px;cursor:pointer;" onclick="a9_openSerialMonitor()" title="Menu Ferramentas">Ferramentas</span>
                    <span style="padding:2px 6px;border-radius:4px;cursor:pointer;" onclick="alert('💡 Arduino IDE 1.8.19 — Código oficial da Garagem Inteligente 100% comentado linha por linha!')" title="Menu Ajuda">Ajuda</span>
                </div>

                <!-- 3. TOOLBAR COM BOTÕES REDONDOS BONITINHOS (PADRÃO AULA 8) -->
                <div style="background:#00979D;padding:8px 14px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid rgba(0,0,0,0.15);flex-wrap:wrap;gap:8px;">
                    
                    <!-- Grupo de botões redondos de ação -->
                    <div style="display:flex;align-items:center;gap:8px;">
                        
                        <!-- Botão 1: Verificar (Check verde) -->
                        <button onclick="a9_verifySketch()" title="Verificar / Compilar (Ctrl+R)" style="width:36px;height:36px;border-radius:50%;background:#00797F;border:1px solid rgba(255,255,255,0.4);color:white;display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:1rem;transition:all 0.15s ease;">
                            <i class="fa-solid fa-check" style="color:#34D399;"></i>
                        </button>

                        <!-- Botão 2: Carregar (Seta azul) -->
                        <button onclick="a9_uploadSketch()" title="Carregar para Placa (Ctrl+U)" style="width:36px;height:36px;border-radius:50%;background:#00797F;border:1px solid rgba(255,255,255,0.4);color:white;display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:1rem;transition:all 0.15s ease;">
                            <i class="fa-solid fa-arrow-right" style="color:#38BDF8;"></i>
                        </button>

                        <!-- Botão 3: Novo -->
                        <button onclick="alert('📄 Novo Esboço: Cria um arquivo em branco com void setup() e void loop()!')" title="Novo Esboço (Ctrl+N)" style="width:36px;height:36px;border-radius:50%;background:#00797F;border:1px solid rgba(255,255,255,0.4);color:white;display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:0.95rem;transition:all 0.15s ease;">
                            <i class="fa-regular fa-file" style="color:#FDE68A;"></i>
                        </button>

                        <!-- Botão 4: Abrir -->
                        <button onclick="alert('📂 Abrir Esboço: Carrega códigos salvos na pasta Arduino!')" title="Abrir Esboço (Ctrl+O)" style="width:36px;height:36px;border-radius:50%;background:#00797F;border:1px solid rgba(255,255,255,0.4);color:white;display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:0.95rem;transition:all 0.15s ease;">
                            <i class="fa-regular fa-folder-open" style="color:#FBBF24;"></i>
                        </button>

                        <!-- Botão 5: Salvar -->
                        <button onclick="a9_copySketch()" title="Salvar / Copiar Código (Ctrl+S)" style="width:36px;height:36px;border-radius:50%;background:#00797F;border:1px solid rgba(255,255,255,0.4);color:white;display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:0.95rem;transition:all 0.15s ease;">
                            <i class="fa-regular fa-floppy-disk" style="color:#C084FC;"></i>
                        </button>

                    </div>

                    <!-- Indicador central de LEDs TX e RX comunicando -->
                    <div style="display:flex;align-items:center;gap:12px;background:rgba(0,0,0,0.3);padding:4px 14px;border-radius:20px;">
                        <span style="font-size:0.75rem;color:#E2E8F0;font-weight:bold;">LEDs da Placa:</span>
                        <div style="display:flex;align-items:center;gap:5px;">
                            <span id="a9-ide-tx-led" style="width:9px;height:9px;border-radius:50%;background:#334155;border:1px solid #64748B;display:inline-block;transition:background 0.1s;"></span>
                            <span style="font-size:0.72rem;color:#CBD5E1;font-weight:bold;">TX</span>
                        </div>
                        <div style="display:flex;align-items:center;gap:5px;">
                            <span id="a9-ide-rx-led" style="width:9px;height:9px;border-radius:50%;background:#334155;border:1px solid #64748B;display:inline-block;transition:background 0.1s;"></span>
                            <span style="font-size:0.72rem;color:#CBD5E1;font-weight:bold;">RX</span>
                        </div>
                    </div>

                    <!-- Grupo de botões da direita: Monitor Serial & Plotter -->
                    <div style="display:flex;align-items:center;gap:8px;">
                        <!-- Botão 6: Monitor Serial -->
                        <button onclick="a9_openSerialMonitor()" title="Monitor Serial (Ctrl+Shift+M)" style="width:36px;height:36px;border-radius:50%;background:#006468;border:1px solid rgba(255,255,255,0.4);color:white;display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:0.95rem;transition:all 0.15s ease;">
                            <i class="fa-solid fa-magnifying-glass" style="color:#38BDF8;"></i>
                        </button>

                        <!-- Botão 7: Plotter Serial -->
                        <button onclick="a9_openSerialPlotter()" title="Plotter Serial (Ctrl+Shift+L) — Gráfico em Tempo Real" style="width:36px;height:36px;border-radius:50%;background:#006468;border:1px solid #10B981;color:white;display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:0.95rem;transition:all 0.15s ease;">
                            <i class="fa-solid fa-chart-line" style="color:#34D399;"></i>
                        </button>
                    </div>

                </div>

                <!-- 4. TAB STRIP DA IDE (ABA DO ARQUIVO .INO + BOTÕES RÁPIDOS) -->
                <div style="background:#E2E8F0;border-bottom:1px solid #CBD5E1;display:flex;align-items:center;justify-content:space-between;padding:0 12px;flex-wrap:wrap;gap:6px;">
                    <div style="background:#FFFFFF;color:#0F172A;padding:7px 18px;font-size:0.84rem;font-family:'Consolas','Courier New',monospace;font-weight:800;border-top:3px solid #00979D;border-left:1px solid #CBD5E1;border-right:1px solid #CBD5E1;display:inline-flex;align-items:center;gap:8px;">
                        <span>garagem_inteligente.ino</span>
                        <span style="font-size:0.75rem;color:#94A3B8;">●</span>
                    </div>

                    <div style="display:flex;align-items:center;gap:6px;padding:4px 0;">
                        <button onclick="a9_autoFormatCode()" style="background:#FFFFFF;border:1px solid #CBD5E1;color:#0284C7;font-size:0.75rem;font-weight:700;padding:3px 9px;border-radius:4px;cursor:pointer;">
                            <i class="fa-solid fa-wand-magic-sparkles"></i> Auto-Formatar (Ctrl+T)
                        </button>
                        <button onclick="a9_copySketch()" style="background:#FFFFFF;border:1px solid #CBD5E1;color:#059669;font-size:0.75rem;font-weight:700;padding:3px 9px;border-radius:4px;cursor:pointer;">
                            <i class="fa-solid fa-copy"></i> Copiar Código
                        </button>
                    </div>
                </div>

                <!-- 5. EDITOR DE CÓDIGO COM FUNDO BRANCO E NÚMEROS DE LINHA -->
                <div style="background:#FFFFFF;display:flex;max-height:420px;height:380px;overflow-y:auto;position:relative;border-bottom:1px solid #CBD5E1;">
                    <!-- Coluna de números de linha -->
                    <div style="background:#F8FAFC;color:#94A3B8;padding:10px 8px;text-align:right;user-select:none;border-right:1px solid #E2E8F0;min-width:44px;font-family:'Consolas','Courier New',monospace;font-size:13px;line-height:22px;">
                        ${gutterHtml}
                    </div>

                    <!-- Área do Código com Sintaxe e Comentários Didáticos -->
                    <div style="margin:0;padding:10px 14px;font-family:'Consolas','Courier New',monospace;font-size:13px;line-height:22px;white-space:pre;color:#0F172A;flex:1;overflow-x:auto;">
                        ${codeHtml}
                    </div>
                </div>

                <!-- 6. BARRA DE MENSAGENS (TEAL) -->
                <div id="a9-ide-msg-bar" style="background:#00979D;color:white;padding:7px 14px;font-size:0.82rem;font-weight:700;display:flex;align-items:center;justify-content:space-between;min-height:28px;">
                    <span id="a9-ide-msg-text">✔ Compilação concluída: 4.820 bytes (14% da memória flash) | 0 erros</span>
                    <span style="font-size:0.75rem;opacity:0.9;">Compilador: AVR-GCC 7.3.0</span>
                </div>

                <!-- 7. CONSOLE TERMINAL (PRETO COM TEXTO CIANO) -->
                <div id="a9-ide-console" style="background:#000000;color:#38BDF8;padding:10px 14px;font-family:'Consolas','Courier New',monospace;font-size:0.78rem;max-height:110px;overflow-y:auto;border-top:1px solid #1E293B;white-space:pre-wrap;line-height:1.45;">O sketch usa 4.820 bytes (14%) de espaço de armazenamento para programas. O máximo são 32.256 bytes.
Variáveis globais usam 312 bytes (15%) de memória dinâmica, deixando 1.736 bytes para variáveis locais. O máximo são 2.048 bytes.
--------------------------------------------------------------------------------
Placa selecionada: Arduino Uno (Microcontrolador ATmega328P) na porta COM3
Status: Código 100% verificado, compilado com sucesso e pronto para rodar na garagem!</div>

                <!-- 8. STATUS BAR INFERIOR -->
                <div style="background:#005F63;color:white;padding:5px 14px;font-size:0.78rem;font-weight:700;display:flex;justify-content:space-between;align-items:center;">
                    <span>Arduino Uno em COM3</span>
                    <span>Taxa: 9600 baud | UTF-8</span>
                </div>

            </div>

        </div>
    `;
}

// ================= TEASER MOTIVADOR DA ARDUINO IDE (PASSOS 1 A 4) =================
// Mantém os primeiros passos limpos e sem poluição visual, liberando a IDE oficial no Passo 5!
function a9_renderIdeTeaser() {
    return `
        <div style="background:linear-gradient(135deg, rgba(15,23,42,0.95), rgba(30,41,59,0.95));border:2px dashed #00979D;border-radius:18px;padding:18px 22px;margin-bottom:22px;box-shadow:0 8px 25px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:14px;">
            <div style="display:flex;align-items:center;gap:14px;max-width:760px;">
                <div style="width:48px;height:48px;border-radius:12px;background:rgba(0,151,157,0.18);border:1px solid #00979D;display:flex;align-items:center;justify-content:center;font-size:1.6rem;flex-shrink:0;">
                    💻
                </div>
                <div>
                    <div style="display:flex;align-items:center;gap:8px;margin-bottom:3px;flex-wrap:wrap;">
                        <h4 style="margin:0;font-family:'Fredoka One',cursive;color:#38BDF8;font-size:1.05rem;">
                            Arduino IDE & Código C++ Completo (Reservado para o Passo 5)
                        </h4>
                        <span style="background:#0F172A;border:1px solid #00979D;color:#5EEAD4;padding:2px 8px;border-radius:6px;font-size:0.75rem;font-weight:800;">
                            Etapa Atual: Montagem Física (${a9_currentStep}/5)
                        </span>
                    </div>
                    <p style="margin:0;color:#CBD5E1;font-size:0.84rem;line-height:1.4;">
                        Mantenha o foco em encaixar com segurança os componentes físicos no diagrama acima. Assim que você avançar para o <b>Passo 5</b> com todos os módulos montados, a <b>Arduino IDE completa</b> com botões bonitinhos e código comentado linha por linha será liberada para teste e upload!
                    </p>
                </div>
            </div>
            <button onclick="a9_goToStep(5)" style="background:#00979D;border:none;color:white;padding:9px 16px;border-radius:10px;font-weight:800;font-size:0.82rem;cursor:pointer;display:inline-flex;align-items:center;gap:6px;box-shadow:0 4px 14px rgba(0,151,157,0.3);transition:all 0.15s ease;">
                <span>Ir para Passo 5 e Ver Código</span> ➔
            </button>
        </div>
    `;
}

// ================= RENDERIZADOR PRINCIPAL DA AULA 9 =================
function loadAula9() {
    const container = document.getElementById('aula9-container');
    if (!container) return;

    const stepData = A9_STEPS[a9_currentStep - 1] || A9_STEPS[0];

    container.innerHTML = `
        <div id="aula9-loaded" class="a9-assembly-container ${a9_isExpanded ? 'a9-expanded' : ''}" style="padding-bottom:30px;">
            
            <!-- 1. CABEÇALHO DA MISSÃO COM STORYTELLING JOVEM MAKER & BOTÃO EXPANDIR -->
            <div style="background:linear-gradient(135deg, rgba(15,23,42,0.98), rgba(30,41,59,0.95));border:2px solid #0284C7;border-radius:22px;padding:20px 24px;margin-bottom:20px;box-shadow:0 10px 30px rgba(2,132,199,0.25);">
                <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;">
                    <div style="display:flex;align-items:center;gap:14px;">
                        <span style="font-size:2.6rem;">🚗🏠</span>
                        <div>
                            <div style="display:inline-block;background:rgba(56,189,248,0.15);border:1px solid #38BDF8;color:#7DD3FC;font-size:0.75rem;font-weight:900;padding:2px 10px;border-radius:8px;margin-bottom:4px;letter-spacing:1px;">
                                🛠️ GUIA DE MONTAGEM UNIFICADO
                            </div>
                            <h2 style="font-family:'Fredoka One',cursive;color:#FFFFFF;margin:0;font-size:1.6rem;letter-spacing:0.5px;">
                                A Garagem Inteligente do Futuro
                            </h2>
                            <p style="color:#94A3B8;margin:4px 0 0;font-size:0.92rem;font-weight:700;">
                                Laboratório Maker de Robótica & Automação • Idade Recomendada: 10 a 14 anos
                            </p>
                        </div>
                    </div>

                    <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;">
                        <!-- Botão de Expandir Bancada (Tela Cheia / Modo Foco) -->
                        <button id="a9-btn-expand" onclick="a9_toggleExpand()" style="background:#0F172A;border:2px solid ${a9_isExpanded ? '#10B981' : '#38BDF8'};color:${a9_isExpanded ? '#6EE7B7' : '#38BDF8'};padding:8px 16px;border-radius:12px;font-size:0.85rem;cursor:pointer;font-weight:900;display:inline-flex;align-items:center;gap:6px;transition:all 0.2s ease;">
                            <span>${a9_isExpanded ? '🗗' : '⛶'}</span>
                            <span>${a9_isExpanded ? 'Reduzir Visualização' : 'Modo Expandido / Foco Total'}</span>
                        </button>

                        <span style="background:rgba(16,185,129,0.15);border:1px solid #10B981;color:#6EE7B7;padding:6px 14px;border-radius:12px;font-size:0.85rem;font-weight:900;">
                            ⭐ 4 Estrelas Maker
                        </span>

                        <button onclick="a9_resetCircuit()" style="background:#1E293B;border:1px solid #475569;color:#CBD5E1;padding:7px 14px;border-radius:10px;font-size:0.8rem;cursor:pointer;font-weight:700;">
                            🔄 Reiniciar Passos
                        </button>
                    </div>
                </div>
            </div>

            <!-- 2. CONTADOR DE PROGRESSO VISUAL GAMIFICADO (1/5, 2/5, 3/5, 4/5, 5/5) -->
            <div style="background:#1E293B;border:2px solid #334155;border-radius:18px;padding:16px 20px;margin-bottom:20px;box-shadow:0 8px 25px rgba(0,0,0,0.4);">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;flex-wrap:wrap;gap:8px;">
                    <div style="display:flex;align-items:center;gap:8px;">
                        <span style="font-size:1.3rem;">🚀</span>
                        <strong style="color:#FDE68A;font-size:1rem;font-family:'Fredoka One',cursive;">
                            Jornada de Montagem Passo a Passo:
                        </strong>
                    </div>
                    <!-- Badge em Destaque do Progresso (1/5, 2/5, etc.) -->
                    <span id="a9-progress-counter-badge" style="background:#0F172A;border:2px solid #38BDF8;color:#38BDF8;padding:5px 16px;border-radius:20px;font-size:0.9rem;font-weight:900;box-shadow:0 0 15px rgba(56,189,248,0.25);">
                        Passo ${a9_currentStep}/5 • ${a9_currentStep * 20}% Concluído
                    </span>
                </div>

                <!-- Barra de Progresso Visual Animada -->
                <div class="a9-progress-rail" style="margin-bottom:12px;">
                    <div id="a9-progress-bar-fill" class="a9-progress-fill" style="width:${a9_currentStep * 20}%;"></div>
                </div>

                <!-- Frase Motivacional de Incentivo ao Jovem Maker -->
                <div id="a9-progress-encouragement" style="background:#0F172A;border:1px solid #1E3A8A;border-radius:10px;padding:8px 14px;color:#CBD5E1;font-size:0.85rem;margin-bottom:14px;">
                    ${A9_ENCOURAGEMENTS[a9_currentStep]}
                </div>

                <!-- Menu Visual dos 5 Passos (Passo 1 a 5) -->
                <div id="a9-steps-nav" style="display:grid;grid-template-columns:repeat(auto-fit, minmax(180px, 1fr));gap:8px;">
                    ${A9_STEPS.map(s => {
                        const isActive = s.num === a9_currentStep;
                        const isDone = s.num < a9_currentStep;
                        return `
                            <button id="a9-step-btn-${s.num}" onclick="a9_goToStep(${s.num})" class="a9-step-btn ${isActive ? 'a9-active' : ''} ${isDone ? 'a9-done' : ''}">
                                <span style="display:flex;align-items:center;gap:6px;">
                                    <span>${s.emoji}</span>
                                    <span>${s.shortTitle}</span>
                                </span>
                                <span id="a9-step-badge-${s.num}">${isDone ? '✅' : isActive ? '👉' : '⚪'}</span>
                            </button>
                        `;
                    }).join('')}
                </div>
            </div>

            <!-- 3. CONTAINER DINÂMICO DA EXPLICAÇÃO TEXTUAL DO PASSO ATUAL -->
            <div id="a9-step-card-mount">
                ${a9_renderStepExplanationCard(stepData)}
            </div>

            <!-- 4. DIAGRAMA VISUAL UNIFICADO & CUMULATIVO (SVG INTERATIVO) -->
            <div style="margin-bottom:20px;">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;padding:0 4px;flex-wrap:wrap;gap:8px;">
                    <div style="color:#94A3B8;font-size:0.85rem;font-weight:700;display:flex;align-items:center;gap:8px;">
                        <span>🔍 <b>Bancada Interativa:</b> Passe o mouse sobre qualquer peça ou fio para ver a ligação real!</span>
                    </div>

                    <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;">
                        <button onclick="a9_openHcSr04Modal()" title="Ver animação interativa do HC-SR04 em pé" style="background:#0F172A;border:1px solid #0284C7;color:#38BDF8;padding:5px 12px;border-radius:10px;font-size:0.78rem;font-weight:800;cursor:pointer;display:inline-flex;align-items:center;gap:5px;transition:all 0.15s ease;">
                            🎥 Encaixe HC-SR04
                        </button>
                        <button onclick="a9_openKy038Modal()" title="Ver pinos e funcionamento do sensor de som LMV321" style="background:#0F172A;border:1px solid #EC4899;color:#F472B6;padding:5px 12px;border-radius:10px;font-size:0.78rem;font-weight:800;cursor:pointer;display:inline-flex;align-items:center;gap:5px;transition:all 0.15s ease;">
                            🎤 Sensor Som LMV321
                        </button>
                        <button onclick="a9_openLedResistorModal()" title="Ver ligação do LED e resistor de 220Ω" style="background:#0F172A;border:1px solid #FBBF24;color:#FDE68A;padding:5px 12px;border-radius:10px;font-size:0.78rem;font-weight:800;cursor:pointer;display:inline-flex;align-items:center;gap:5px;transition:all 0.15s ease;">
                            💡 LED & Resistor
                        </button>
                        <button onclick="a9_openLcd1602Modal()" title="Ver raio-x e 16 pinos do display LCD 1602" style="background:#0F172A;border:1px solid #10B981;color:#6EE7B7;padding:5px 12px;border-radius:10px;font-size:0.78rem;font-weight:800;cursor:pointer;display:inline-flex;align-items:center;gap:5px;transition:all 0.15s ease;">
                            📟 Raio-X LCD 1602
                        </button>
                    </div>
                </div>

                <!-- BARRA DE LEGENDA RÁPIDA DE COMPONENTES & FIOS (PASSE O MOUSE!) -->
                <div class="a9-legend-bar" style="background:#0F172A;border:1px solid #334155;border-radius:14px;padding:8px 12px;margin-bottom:12px;display:flex;align-items:center;flex-wrap:wrap;gap:6px;">
                    <span style="color:#FDE68A;font-size:0.78rem;font-weight:900;display:inline-flex;align-items:center;gap:4px;margin-right:2px;">
                        <span>🏷️ Legenda:</span>
                    </span>
                    <span class="a9-legend-chip" onmouseenter="a9_hoverTooltip(event, 'comp_arduino')" onmousemove="a9_moveTooltip(event)" onmouseleave="a9_hideHoverTooltip()" onclick="a9_showTooltip('comp_arduino')">🤖 Arduino</span>
                    <span class="a9-legend-chip" onmouseenter="a9_hoverTooltip(event, 'comp_protoboard')" onmousemove="a9_moveTooltip(event)" onmouseleave="a9_hideHoverTooltip()" onclick="a9_showTooltip('comp_protoboard')">⚡ Protoboard</span>
                    <span class="a9-legend-chip" onmouseenter="a9_hoverTooltip(event, 'protoboard_divider')" onmousemove="a9_moveTooltip(event)" onmouseleave="a9_hideHoverTooltip()" onclick="a9_showTooltip('protoboard_divider')">⛔ Canal Central</span>
                    <span class="a9-legend-chip" onmouseenter="a9_hoverTooltip(event, 'comp_hcsr04')" onmousemove="a9_moveTooltip(event)" onmouseleave="a9_hideHoverTooltip()" onclick="a9_showTooltip('comp_hcsr04')">🦇 HC-SR04</span>
                    <span class="a9-legend-chip" onmouseenter="a9_hoverTooltip(event, 'comp_lmv321')" onmousemove="a9_moveTooltip(event)" onmouseleave="a9_hideHoverTooltip()" onclick="a9_openKy038Modal()">👏 Som LMV321 (A0)</span>
                    <span class="a9-legend-chip" onmouseenter="a9_hoverTooltip(event, 'comp_led')" onmousemove="a9_moveTooltip(event)" onmouseleave="a9_hideHoverTooltip()" onclick="a9_openLedResistorModal()">💡 LED (D13)</span>
                    <span class="a9-legend-chip" onmouseenter="a9_hoverTooltip(event, 'comp_resistor')" onmousemove="a9_moveTooltip(event)" onmouseleave="a9_hideHoverTooltip()" onclick="a9_openLedResistorModal()">⚡ Resistor 220Ω</span>
                    <span class="a9-legend-chip" onmouseenter="a9_hoverTooltip(event, 'comp_lcd')" onmousemove="a9_moveTooltip(event)" onmouseleave="a9_hideHoverTooltip()" onclick="a9_openLcd1602Modal()">📟 LCD 1602 Direto</span>
                    <span class="a9-legend-chip" onmouseenter="a9_hoverTooltip(event, 'comp_lcd_v0')" onmousemove="a9_moveTooltip(event)" onmouseleave="a9_hideHoverTooltip()" onclick="a9_showTooltip('comp_lcd_v0')">✨ V0 no GND (Sem Potenciômetro)</span>
                    <span class="a9-legend-chip" onmouseenter="a9_hoverTooltip(event, 'wire_vcc')" onmousemove="a9_moveTooltip(event)" onmouseleave="a9_hideHoverTooltip()" onclick="a9_showTooltip('wire_vcc')">🔴 5V</span>
                    <span class="a9-legend-chip" onmouseenter="a9_hoverTooltip(event, 'wire_gnd')" onmousemove="a9_moveTooltip(event)" onmouseleave="a9_hideHoverTooltip()" onclick="a9_showTooltip('wire_gnd')">⚫ GND</span>
                    <span class="a9-legend-chip" onmouseenter="a9_hoverTooltip(event, 'wire_trig')" onmousemove="a9_moveTooltip(event)" onmouseleave="a9_hideHoverTooltip()" onclick="a9_showTooltip('wire_trig')">🟡 Trig (D6)</span>
                    <span class="a9-legend-chip" onmouseenter="a9_hoverTooltip(event, 'wire_echo')" onmousemove="a9_moveTooltip(event)" onmouseleave="a9_hideHoverTooltip()" onclick="a9_showTooltip('wire_echo')">🟢 Echo (D5)</span>
                    <span class="a9-legend-chip" onmouseenter="a9_hoverTooltip(event, 'wire_sig')" onmousemove="a9_moveTooltip(event)" onmouseleave="a9_hideHoverTooltip()" onclick="a9_showTooltip('wire_sig')">🟣 Som OUT (A0)</span>
                    <span class="a9-legend-chip" onmouseenter="a9_hoverTooltip(event, 'wire_led')" onmousemove="a9_moveTooltip(event)" onmouseleave="a9_hideHoverTooltip()" onclick="a9_showTooltip('wire_led')">🔵 LED (D13)</span>
                    <span class="a9-legend-chip" onmouseenter="a9_hoverTooltip(event, 'wire_lcd_yellow')" onmousemove="a9_moveTooltip(event)" onmouseleave="a9_hideHoverTooltip()" onclick="a9_showTooltip('wire_lcd_yellow')">🟡 RS (D12)</span>
                    <span class="a9-legend-chip" onmouseenter="a9_hoverTooltip(event, 'wire_lcd_white')" onmousemove="a9_moveTooltip(event)" onmouseleave="a9_hideHoverTooltip()" onclick="a9_showTooltip('wire_lcd_white')">⚪ E (D11)</span>
                    <span class="a9-legend-chip" onmouseenter="a9_hoverTooltip(event, 'wire_lcd_green')" onmousemove="a9_moveTooltip(event)" onmouseleave="a9_hideHoverTooltip()" onclick="a9_showTooltip('wire_lcd_green')">🟢 DB4 (D10)</span>
                    <span class="a9-legend-chip" onmouseenter="a9_hoverTooltip(event, 'wire_lcd_blue')" onmousemove="a9_moveTooltip(event)" onmouseleave="a9_hideHoverTooltip()" onclick="a9_showTooltip('wire_lcd_blue')">🔵 DB5 (D9 - Azul Único)</span>
                    <span class="a9-legend-chip" onmouseenter="a9_hoverTooltip(event, 'wire_lcd_orange')" onmousemove="a9_moveTooltip(event)" onmouseleave="a9_hideHoverTooltip()" onclick="a9_showTooltip('wire_lcd_orange')">🟠 DB6 (D8)</span>
                    <span class="a9-legend-chip" onmouseenter="a9_hoverTooltip(event, 'wire_lcd_purple')" onmousemove="a9_moveTooltip(event)" onmouseleave="a9_hideHoverTooltip()" onclick="a9_showTooltip('wire_lcd_purple')">🟣 DB7 (D7)</span>
                </div>

                <!-- Montagem do Diagrama SVG -->
                <div id="a9-circuit-mount">
                    ${a9_renderCircuitSvg(a9_currentStep)}
                </div>

                <!-- TOOLTIP FLUTUANTE SEGUINDO O MOUSE -->
                <div id="a9-floating-tooltip" class="a9-floating-tooltip" style="display:none;"></div>

                <!-- CARTÃO DE TOOLTIP FIXO / DETALHES DA PEÇA CLICADA -->
                <div id="a9-tooltip-card" style="display:none;background:#1E293B;border:2px solid #38BDF8;border-radius:14px;padding:14px 18px;margin-top:10px;box-shadow:0 8px 25px rgba(0,0,0,0.5);">
                    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
                        <div style="display:flex;align-items:center;gap:8px;">
                            <strong id="a9-tt-title" style="color:white;font-size:1.05rem;font-family:'Fredoka One',cursive;"></strong>
                            <span id="a9-tt-badge" style="padding:2px 8px;border-radius:6px;font-size:0.75rem;font-weight:900;"></span>
                        </div>
                        <button onclick="a9_closeTooltip()" style="background:none;border:none;color:#94A3B8;font-size:1.2rem;cursor:pointer;">&times;</button>
                    </div>
                    <div id="a9-tt-flow" style="color:#FDE68A;font-size:0.82rem;font-weight:800;margin-bottom:6px;"></div>
                    <div id="a9-tt-desc" style="color:#CBD5E1;font-size:0.88rem;line-height:1.5;"></div>
                </div>
            </div>

            <!-- 5. ARDUINO IDE COMPLETA COM C++ (ESTILO OFICIAL AULA 8 - LIBERADA EXCLUSIVAMENTE NO PASSO 5) -->
            <div id="a9-ide-section-mount">
                ${a9_currentStep === 5 ? a9_renderIdeSection() : a9_renderIdeTeaser()}
            </div>

            <!-- 6. GRID DE TESTAR MÓDULO (PAINEL DE TESTE INTERATIVO) NO FINAL DA PÁGINA -->
            <div style="background:#1E293B;border:2px solid #334155;border-radius:20px;padding:20px;margin-top:25px;margin-bottom:25px;box-shadow:0 8px 25px rgba(0,0,0,0.4);">
                <h4 style="font-family:'Fredoka One',cursive;color:white;margin:0 0 14px;font-size:1.2rem;display:flex;align-items:center;gap:8px;">
                    <span>🎮</span> Testar Este Módulo em Funcionamento:
                </h4>

                <div id="a9-controls-mount">
                    ${a9_getStepInteractiveControlsMarkup(a9_currentStep)}
                </div>
            </div>

        </div>
    `;

    a9_closeTooltip();
}

// ================= CONTROLES INTERATIVOS ESPECÍFICOS DE CADA PASSO =================
function a9_getStepInteractiveControlsMarkup(step) {
    if (step === 1) {
        // PASSO 1: TESTE DA LINHA DE ENERGIA 5V & GND
        return `
            <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(280px, 1fr));gap:14px;align-items:center;">
                <div>
                    <p style="color:#CBD5E1;font-size:0.9rem;line-height:1.5;margin:0 0 10px;">
                        Clique no botão para testar se a corrente elétrica está fluindo perfeitamente do regulador de 5V do Arduino até as réguas metálicas da protoboard!
                    </p>
                    <button onclick="a9_testPowerRail()" style="background:linear-gradient(135deg,#EF4444,#DC2626);color:white;border:none;padding:12px 24px;border-radius:12px;font-weight:900;font-size:0.95rem;cursor:pointer;display:inline-flex;align-items:center;gap:8px;box-shadow:0 4px 15px rgba(239,68,68,0.4);">
                        ⚡ Testar Chave Geral de Energia (+5V)
                    </button>
                </div>

                <div id="a9-power-status-box" style="background:#0F172A;border:2px solid #10B981;border-radius:14px;padding:14px;text-align:center;">
                    <div style="font-size:2rem;margin-bottom:4px;">🔋</div>
                    <strong style="color:#6EE7B7;font-size:1rem;display:block;">Barramento Energizado: 5.0 Volts</strong>
                    <span style="color:#94A3B8;font-size:0.8rem;">Linha Vermelha (+) e Linha Azul (-) ativas e prontas para sensores</span>
                </div>
            </div>
        `;
    } else if (step === 2) {
        // PASSO 2: TESTE DO SENSOR ULTRASSÔNICO
        return `
            <div>
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;flex-wrap:wrap;gap:8px;">
                    <div>
                        <strong style="color:#38BDF8;font-size:1rem;">🚗 Mover Obstáculo / Carro na Vaga:</strong>
                        <span style="color:#94A3B8;font-size:0.8rem;margin-left:6px;">Arraste para simular o eco do som batendo no carro!</span>
                    </div>
                    <span id="a9-sonar-val-badge" style="background:#0284C7;color:white;padding:4px 14px;border-radius:20px;font-weight:900;font-size:1rem;">
                        ${a9_sonarDistance} cm
                    </span>
                </div>

                <input type="range" min="5" max="50" value="${a9_sonarDistance}" style="width:100%;cursor:pointer;accent-color:#38BDF8;height:8px;" oninput="a9_onSonarSlider(this.value)">

                <div style="display:flex;justify-content:space-between;color:#94A3B8;font-size:0.75rem;margin-top:6px;">
                    <span>🚨 5 cm (Muito Perto / Alerta)</span>
                    <span>🟡 25 cm (Distância Segura)</span>
                    <span>🟢 50 cm (Vaga Livre)</span>
                </div>

                <div id="a9-sonar-calc-box" style="background:#0F172A;border-radius:12px;padding:12px;margin-top:12px;border:1px solid #0284C7;display:flex;justify-content:space-around;text-align:center;flex-wrap:wrap;gap:10px;">
                    <div>
                        <span style="color:#94A3B8;font-size:0.75rem;display:block;">Tempo do Eco ( pulseIn ):</span>
                        <strong id="a9-sonar-time" style="color:#FBBF24;font-size:0.95rem;">${a9_sonarDistance * 58} µs</strong>
                    </div>
                    <div>
                        <span style="color:#94A3B8;font-size:0.75rem;display:block;">Fórmula da Distância:</span>
                        <strong style="color:#6EE7B7;font-size:0.95rem;">distancia = tempo / 58</strong>
                    </div>
                    <div>
                        <span style="color:#94A3B8;font-size:0.75rem;display:block;">Status da Vaga:</span>
                        <strong id="a9-sonar-status" style="color:${a9_sonarDistance < 15 ? '#EF4444' : '#6EE7B7'};font-size:0.95rem;">
                            ${a9_sonarDistance < 15 ? '🚨 ALERTA: MUITO PERTO!' : '🟢 VAGA LIVRE (OK)'}
                        </strong>
                    </div>
                </div>
            </div>
        `;
    } else if (step === 3) {
        // PASSO 3: TESTE DE PALMAS & LÂMPADA
        return `
            <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(280px, 1fr));gap:14px;align-items:center;">
                <div>
                    <p style="color:#CBD5E1;font-size:0.9rem;line-height:1.5;margin:0 0 10px;">
                        Bata palmas para testar o microfone KY-038! A cada palma, o Arduino inverte o estado da lâmpada do teto (LED no pino 13).
                    </p>
                    <button onclick="a9_triggerClapAction()" style="background:linear-gradient(135deg,#EC4899,#DB2777);color:white;border:none;padding:12px 24px;border-radius:14px;font-weight:900;font-size:1rem;cursor:pointer;display:inline-flex;align-items:center;gap:8px;box-shadow:0 4px 20px rgba(236,72,153,0.4);">
                        👏 Bater Palmas na Garagem!
                    </button>
                </div>

                <div id="a9-clap-status-card" style="background:#0F172A;border:2px solid ${a9_clapLightOn ? '#FBBF24' : '#334155'};border-radius:14px;padding:14px;text-align:center;">
                    <div style="font-size:2.4rem;margin-bottom:4px;">${a9_clapLightOn ? '💡' : '🌑'}</div>
                    <strong style="color:${a9_clapLightOn ? '#FDE68A' : '#94A3B8'};font-size:1.1rem;display:block;">
                        ${a9_clapLightOn ? 'LÂMPADA ACESA (Pino 13 = HIGH)' : 'LÂMPADA APAGADA (Pino 13 = LOW)'}
                    </strong>
                    <span style="color:#CBD5E1;font-size:0.8rem;">
                        ${a9_clapLightOn ? '✨ A garagem está iluminada!' : '🌙 Garagem no escuro aguardando palmas'}
                    </span>
                </div>
            </div>
        `;
    } else if (step === 4) {
        // PASSO 4: TESTE DO DISPLAY LCD 16X2
        return `
            <div>
                <p style="color:#CBD5E1;font-size:0.9rem;line-height:1.5;margin:0 0 12px;">
                    O LCD 16x2 tem 2 linhas e 16 colunas. Escolha uma mensagem rápida ou digite o que você quer ver na tela da parede da garagem:
                </p>

                <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px;">
                    <button onclick="a9_sendLcdPreset('BEM-VINDO!', 'GARAGEM MAKER')" style="background:#0F172A;border:1px solid #38BDF8;color:#7DD3FC;padding:6px 14px;border-radius:8px;font-weight:bold;font-size:0.8rem;cursor:pointer;">
                        Mensagem 1: Boas-Vindas
                    </button>
                    <button onclick="a9_sendLcdPreset('Luz: ACESA [ON]', 'Vaga: 25cm (OK)')" style="background:#0F172A;border:1px solid #10B981;color:#6EE7B7;padding:6px 14px;border-radius:8px;font-weight:bold;font-size:0.8rem;cursor:pointer;">
                        Mensagem 2: Normal (OK)
                    </button>
                    <button onclick="a9_sendLcdPreset('Luz: ACESA [ON]', 'Vaga: 8cm !PARE!')" style="background:#0F172A;border:1px solid #EF4444;color:#FCA5A5;padding:6px 14px;border-radius:8px;font-weight:bold;font-size:0.8rem;cursor:pointer;">
                        Mensagem 3: Alerta de Ré
                    </button>
                </div>

                <!-- Simulação de Display Digital Retrô 16x2 -->
                <div style="background:#022C22;border:3px solid #064E3B;border-radius:10px;padding:14px 20px;max-width:440px;margin:0 auto;box-shadow:0 0 20px rgba(16,185,129,0.25);">
                    <div id="a9-mini-lcd-l0" style="color:#34D399;font-family:'Courier New',monospace;font-size:1.15rem;font-weight:900;letter-spacing:2px;text-align:center;">
                        ${a9_lcdText0}
                    </div>
                    <div id="a9-mini-lcd-l1" style="color:#6EE7B7;font-family:'Courier New',monospace;font-size:1.15rem;font-weight:900;letter-spacing:2px;text-align:center;margin-top:6px;">
                        ${a9_lcdText1}
                    </div>
                </div>
            </div>
        `;
    } else {
        // PASSO 5: SUPER SIMULADOR AO VIVO DA GARAGEM COMPLETA
        return `
            <div>
                <div style="background:#0F172A;border-radius:16px;padding:16px;margin-bottom:14px;border:1px solid #F59E0B;">
                    <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(280px, 1fr));gap:14px;align-items:center;">
                        
                        <!-- CONTROLE 1: MANOBRA DO CARRO NA VAGA -->
                        <div>
                            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
                                <strong style="color:#FBBF24;font-size:0.95rem;">🚗 Manobrar Carro na Vaga:</strong>
                                <span id="a9-sim-dist-badge" style="background:#F59E0B;color:#0F172A;padding:3px 12px;border-radius:14px;font-weight:900;font-size:0.9rem;">
                                    ${a9_simCarDistance} cm
                                </span>
                            </div>
                            <input type="range" min="5" max="50" value="${a9_simCarDistance}" style="width:100%;cursor:pointer;accent-color:#F59E0B;" oninput="a9_onSimCarSlider(this.value)">
                            <div style="display:flex;justify-content:space-between;color:#94A3B8;font-size:0.75rem;margin-top:4px;">
                                <span>🚨 5 cm (Quase encostando no muro)</span>
                                <span>🟢 50 cm (Carro distante)</span>
                            </div>
                        </div>

                        <!-- CONTROLE 2: BATER PALMAS PARA A ILUMINAÇÃO -->
                        <div style="text-align:center;">
                            <button onclick="a9_triggerSimClap()" style="background:linear-gradient(135deg,#EC4899,#BE185D);color:white;border:none;padding:12px 24px;border-radius:14px;font-weight:900;font-size:0.95rem;cursor:pointer;display:inline-flex;align-items:center;gap:8px;box-shadow:0 4px 15px rgba(236,72,153,0.3);">
                                👏 Bater Palma (Luz do Teto)
                            </button>
                            <div id="a9-sim-lamp-status" style="margin-top:6px;font-size:0.85rem;color:${a9_clapLightOn ? '#FDE68A' : '#94A3B8'};font-weight:bold;">
                                ${a9_clapLightOn ? '💡 Lâmpada do Teto: LIGADA' : '🌑 Lâmpada do Teto: DESLIGADA'}
                            </div>
                        </div>

                    </div>
                </div>

                <!-- TELA LCD AO VIVO FIXADA NA PAREDE DA GARAGEM -->
                <div style="background:#022C22;border:3px solid #064E3B;border-radius:12px;padding:16px;max-width:480px;margin:0 auto;text-align:center;box-shadow:0 0 25px rgba(16,185,129,0.3);">
                    <div style="color:#A7F3D0;font-size:0.75rem;font-weight:bold;margin-bottom:6px;letter-spacing:1px;">
                        📟 VISOR DIGITAL FIXADO NA PAREDE DA GARAGEM:
                    </div>
                    <div id="a9-combo-live-l0" style="color:#34D399;font-family:'Courier New',monospace;font-size:1.3rem;font-weight:900;letter-spacing:2px;">
                        ${a9_clapLightOn ? 'Luz: ACESA  [ON]' : 'Luz: APAGADA[OFF]'}
                    </div>
                    <div id="a9-combo-live-l1" style="color:#6EE7B7;font-family:'Courier New',monospace;font-size:1.3rem;font-weight:900;letter-spacing:2px;margin-top:4px;">
                        ${a9_simCarDistance < 15 ? `Vaga: ${a9_simCarDistance}cm !PARE!` : `Vaga: ${a9_simCarDistance}cm (OK) `}
                    </div>
                </div>
            </div>
        `;
    }
}

// ================= ATUALIZADOR DINÂMICO DE PASSOS (SEM RE-RENDER TOTAL) =================
// Alterna apenas o diagrama visual e a explicação textual, mantendo a consistência do fluxo!
function a9_updateStepUI() {
    const loaded = document.getElementById('aula9-loaded');
    if (!loaded) {
        loadAula9();
        return;
    }

    const stepData = A9_STEPS[a9_currentStep - 1] || A9_STEPS[0];

    // 1. Atualiza Contador de Progresso Visual
    const badge = document.getElementById('a9-progress-counter-badge');
    if (badge) {
        badge.innerText = `Passo ${a9_currentStep}/5 • ${a9_currentStep * 20}% Concluído`;
        if (a9_currentStep === 5) {
            badge.style.borderColor = '#10B981';
            badge.style.color = '#6EE7B7';
        } else {
            badge.style.borderColor = '#38BDF8';
            badge.style.color = '#38BDF8';
        }
    }

    // 2. Atualiza Barra de Progresso Animada
    const fill = document.getElementById('a9-progress-bar-fill');
    if (fill) {
        fill.style.width = `${a9_currentStep * 20}%`;
    }

    // 3. Atualiza Frase Motivacional de Incentivo ao Jovem Maker
    const enc = document.getElementById('a9-progress-encouragement');
    if (enc) {
        enc.innerHTML = A9_ENCOURAGEMENTS[a9_currentStep];
    }

    // 4. Atualiza os Botões dos 5 Passos
    for (let i = 1; i <= 5; i++) {
        const btn = document.getElementById(`a9-step-btn-${i}`);
        const badgeSpan = document.getElementById(`a9-step-badge-${i}`);
        if (btn) {
            btn.classList.remove('a9-active', 'a9-done');
            if (i === a9_currentStep) {
                btn.classList.add('a9-active');
                if (badgeSpan) badgeSpan.innerText = '👉';
            } else if (i < a9_currentStep) {
                btn.classList.add('a9-done');
                if (badgeSpan) badgeSpan.innerText = '✅';
            } else {
                if (badgeSpan) badgeSpan.innerText = '⚪';
            }
        }
    }

    // 5. Atualiza a Explicação Textual do Passo Atual
    const stepCardMount = document.getElementById('a9-step-card-mount');
    if (stepCardMount) {
        stepCardMount.innerHTML = a9_renderStepExplanationCard(stepData);
    }

    // 6. Atualiza o Diagrama Visual Unificado SVG
    const circuitMount = document.getElementById('a9-circuit-mount');
    if (circuitMount) {
        circuitMount.innerHTML = a9_renderCircuitSvg(a9_currentStep);
    }

    // 7. Atualiza a Seção da Arduino IDE Oficial (Liberada no Passo 5, com Teaser Didático nos Passos 1 a 4)
    const ideMount = document.getElementById('a9-ide-section-mount');
    if (ideMount) {
        ideMount.innerHTML = a9_currentStep === 5 ? a9_renderIdeSection() : a9_renderIdeTeaser();
    }

    // 8. Atualiza a Bancada de Testes / Grid de Testar Módulo NO FINAL DA PÁGINA
    const controlsMount = document.getElementById('a9-controls-mount');
    if (controlsMount) {
        controlsMount.innerHTML = a9_getStepInteractiveControlsMarkup(a9_currentStep);
    }

    // Fecha tooltip se houver
    a9_closeTooltip();
}

// ================= FUNÇÕES DE NAVEGAÇÃO DOS PASSOS =================
function a9_goToStep(stepNum) {
    if (stepNum < 1 || stepNum > 5) return;
    const prevStep = a9_currentStep;
    a9_currentStep = stepNum;

    try {
        localStorage.setItem('a9_unlocked_step', String(stepNum));
    } catch (e) {}

    // Efeito sonoro diferenciado ao avançar vs recuar
    if (stepNum > prevStep) {
        if (typeof playSound === 'function') playSound('coin');
    } else {
        if (typeof playSound === 'function') playSound('click');
    }

    // Alterna dinamicamente diagrama e texto sem salto de scroll
    a9_updateStepUI();

    // Se concluiu o passo 5, celebração e registro na trilha!
    if (stepNum === 5) {
        try {
            localStorage.setItem('aula9_completed', 'true');
            if (typeof updateTrail === 'function') updateTrail();
            if (typeof triggerConfetti === 'function') triggerConfetti(3500);
            if (typeof playSound === 'function') playSound('success');
        } catch (e) {}
    }
}

function a9_nextStep() {
    if (a9_currentStep < 5) {
        a9_goToStep(a9_currentStep + 1);
    }
}

function a9_prevStep() {
    if (a9_currentStep > 1) {
        a9_goToStep(a9_currentStep - 1);
    }
}

function a9_resetCircuit() {
    if (confirm('Deseja reiniciar os passos da Garagem Inteligente desde o Passo 1?')) {
        a9_currentStep = 1;
        a9_clapLightOn = false;
        a9_sonarDistance = 25;
        a9_simCarDistance = 25;
        try {
            localStorage.setItem('a9_unlocked_step', '1');
        } catch (e) {}
        if (typeof playSound === 'function') playSound('click');
        a9_updateStepUI();
    }
}

// ================= FUNÇÕES INTERATIVAS DOS MÓDULOS =================
function a9_testPowerRail() {
    a9_powerLive = !a9_powerLive;
    if (typeof playSound === 'function') playSound('coin');

    const box = document.getElementById('a9-power-status-box');
    if (box) {
        box.innerHTML = `
            <div style="font-size:2rem;margin-bottom:4px;">⚡</div>
            <strong style="color:#6EE7B7;font-size:1rem;display:block;">Circuito Energizado com Sucesso!</strong>
            <span style="color:#CBD5E1;font-size:0.8rem;">5V no barramento vermelho (+) e GND no barramento azul (-)!</span>
        `;
    }

    // Re-renderiza o SVG para atualizar o indicador PWR
    const mount = document.getElementById('a9-circuit-mount');
    if (mount) mount.innerHTML = a9_renderCircuitSvg(a9_currentStep);
}

function a9_onSonarSlider(val) {
    a9_sonarDistance = parseInt(val, 10);
    const badge = document.getElementById('a9-sonar-val-badge');
    if (badge) badge.innerText = `${a9_sonarDistance} cm`;

    const timeEl = document.getElementById('a9-sonar-time');
    if (timeEl) timeEl.innerText = `${a9_sonarDistance * 58} µs`;

    const statusEl = document.getElementById('a9-sonar-status');
    if (statusEl) {
        if (a9_sonarDistance < 15) {
            statusEl.innerHTML = '🚨 ALERTA: MUITO PERTO!';
            statusEl.style.color = '#EF4444';
            if (typeof playSound === 'function' && Math.random() < 0.2) playSound('error');
        } else {
            statusEl.innerHTML = '🟢 VAGA LIVRE (OK)';
            statusEl.style.color = '#6EE7B7';
        }
    }

    // Atualiza o SVG ao vivo
    const mount = document.getElementById('a9-circuit-mount');
    if (mount) mount.innerHTML = a9_renderCircuitSvg(a9_currentStep);
}

function a9_triggerClapAction() {
    if (typeof playSound === 'function') playSound('clap');
    a9_clapLightOn = !a9_clapLightOn;

    // Pisca o LED do microfone
    const micLed = document.getElementById('a9-svg-mic-led');
    if (micLed) {
        micLed.setAttribute('fill', '#10B981');
        setTimeout(() => micLed.setAttribute('fill', a9_clapLightOn ? '#10B981' : '#334155'), 200);
    }

    const card = document.getElementById('a9-clap-status-card');
    if (card) {
        card.style.borderColor = a9_clapLightOn ? '#FBBF24' : '#334155';
        card.innerHTML = `
            <div style="font-size:2.4rem;margin-bottom:4px;">${a9_clapLightOn ? '💡' : '🌑'}</div>
            <strong style="color:${a9_clapLightOn ? '#FDE68A' : '#94A3B8'};font-size:1.1rem;display:block;">
                ${a9_clapLightOn ? 'LÂMPADA ACESA (Pino 13 = HIGH)' : 'LÂMPADA APAGADA (Pino 13 = LOW)'}
            </strong>
            <span style="color:#CBD5E1;font-size:0.8rem;">
                ${a9_clapLightOn ? '✨ A lâmpada recebeu 5V do pino 13 e acendeu!' : '🌙 O pino 13 foi para 0V (LOW) e a lâmpada apagou'}
            </span>
        `;
    }

    // Atualiza o SVG para acender/apagar o LED amarelo
    const mount = document.getElementById('a9-circuit-mount');
    if (mount) mount.innerHTML = a9_renderCircuitSvg(a9_currentStep);
}

function a9_sendLcdPreset(l0, l1) {
    a9_lcdText0 = l0;
    a9_lcdText1 = l1;
    if (typeof playSound === 'function') playSound('coin');

    const l0El = document.getElementById('a9-mini-lcd-l0');
    const l1El = document.getElementById('a9-mini-lcd-l1');
    if (l0El) l0El.innerText = l0;
    if (l1El) l1El.innerText = l1;

    // Atualiza no SVG
    const svgL0 = document.getElementById('a9-svg-lcd-l0');
    const svgL1 = document.getElementById('a9-svg-lcd-l1');
    if (svgL0) svgL0.textContent = l0;
    if (svgL1) svgL1.textContent = l1;
}

// Simulador Completo (Passo 5)
function a9_onSimCarSlider(val) {
    a9_simCarDistance = parseInt(val, 10);
    const badge = document.getElementById('a9-sim-dist-badge');
    if (badge) badge.innerText = `${a9_simCarDistance} cm`;

    // Atualiza o display LCD na simulação
    const l1El = document.getElementById('a9-combo-live-l1');
    if (l1El) {
        if (a9_simCarDistance < 15) {
            l1El.innerText = `Vaga: ${a9_simCarDistance}cm !PARE!`;
            l1El.style.color = '#FCA5A5';
            if (typeof playSound === 'function' && Math.random() < 0.25) playSound('error');
        } else {
            l1El.innerText = `Vaga: ${a9_simCarDistance}cm (OK) `;
            l1El.style.color = '#6EE7B7';
        }
    }

    // Atualiza no SVG principal
    const svgL1 = document.getElementById('a9-svg-lcd-l1');
    if (svgL1) {
        svgL1.textContent = a9_simCarDistance < 15 ? `Vaga: ${a9_simCarDistance}cm !PARE!` : `Vaga: ${a9_simCarDistance}cm (OK) `;
    }
}

function a9_triggerSimClap() {
    if (typeof playSound === 'function') playSound('clap');
    a9_clapLightOn = !a9_clapLightOn;

    const statusEl = document.getElementById('a9-sim-lamp-status');
    if (statusEl) {
        statusEl.innerHTML = a9_clapLightOn ? '💡 Lâmpada do Teto: LIGADA' : '🌑 Lâmpada do Teto: DESLIGADA';
        statusEl.style.color = a9_clapLightOn ? '#FDE68A' : '#94A3B8';
    }

    const l0El = document.getElementById('a9-combo-live-l0');
    if (l0El) {
        l0El.innerText = a9_clapLightOn ? 'Luz: ACESA  [ON]' : 'Luz: APAGADA[OFF]';
    }

    // Atualiza no SVG
    const mount = document.getElementById('a9-circuit-mount');
    if (mount) mount.innerHTML = a9_renderCircuitSvg(a9_currentStep);
}

// ================= TOOLTIP INTERATIVO & LEGENDA FLUTUANTE =================
function a9_hoverTooltip(event, key) {
    const data = A9_TOOLTIPS[key];
    if (!data) return;

    const tt = document.getElementById('a9-floating-tooltip');
    if (!tt) return;

    tt.innerHTML = `
        <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:4px;">
            <strong style="color:white;font-family:'Fredoka One',cursive;font-size:0.95rem;">${data.title}</strong>
            <span style="background:${data.badgeColor}22;color:${data.badgeColor};border:1px solid ${data.badgeColor};padding:2px 7px;border-radius:6px;font-size:0.7rem;font-weight:900;">${data.badge}</span>
        </div>
        <div style="color:#FDE68A;font-size:0.78rem;font-weight:800;margin-bottom:4px;">➔ ${data.flow}</div>
        <div style="color:#CBD5E1;font-size:0.83rem;line-height:1.45;">${data.desc}</div>
    `;
    tt.style.borderColor = data.badgeColor || '#38BDF8';
    tt.style.boxShadow = `0 10px 30px rgba(0,0,0,0.85), 0 0 20px ${data.badgeColor || '#38BDF8'}44`;
    tt.style.display = 'block';
    tt.style.opacity = '1';
    a9_moveTooltip(event);
}

function a9_moveTooltip(event) {
    const tt = document.getElementById('a9-floating-tooltip');
    if (!tt || tt.style.display === 'none') return;
    const x = event.clientX;
    const y = event.clientY;
    const ttWidth = tt.offsetWidth || 300;
    const ttHeight = tt.offsetHeight || 120;
    const pad = 15;

    let left = x + pad;
    let top = y + pad;

    if (left + ttWidth > window.innerWidth - 12) {
        left = x - ttWidth - pad;
    }
    if (top + ttHeight > window.innerHeight - 12) {
        top = y - ttHeight - pad;
    }

    tt.style.left = `${Math.max(10, left)}px`;
    tt.style.top = `${Math.max(10, top)}px`;
}

function a9_hideHoverTooltip() {
    const tt = document.getElementById('a9-floating-tooltip');
    if (tt) {
        tt.style.display = 'none';
    }
}

function a9_showTooltip(key) {
    const data = A9_TOOLTIPS[key];
    if (!data) return;

    if (typeof playSound === 'function') playSound('click');

    const card = document.getElementById('a9-tooltip-card');
    const title = document.getElementById('a9-tt-title');
    const badge = document.getElementById('a9-tt-badge');
    const flow = document.getElementById('a9-tt-flow');
    const desc = document.getElementById('a9-tt-desc');

    if (card && title && badge && flow && desc) {
        title.innerText = data.title;
        badge.innerText = data.badge;
        badge.style.background = `${data.badgeColor}22`;
        badge.style.color = data.badgeColor;
        badge.style.border = `1px solid ${data.badgeColor}`;
        flow.innerText = `Caminho do Sinal: ${data.flow}`;
        desc.innerHTML = data.desc;
        card.style.display = 'block';
        card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}

function a9_closeTooltip() {
    const card = document.getElementById('a9-tooltip-card');
    if (card) card.style.display = 'none';
}

// ================= SIMULADOR DE ENCAIXE EM PÉ DO HC-SR04 ("MINI VÍDEO") =================
function a9_renderHcSr04InsertionPlayer() {
    const isSeated = a9_hcsr04_height === 0;
    const isFloating = a9_hcsr04_height >= 80;

    let statusText = isSeated
        ? '✔ ENCAIXADO COM FIRMEZA NOS CONTATOS METÁLICOS DA PROTOBOARD!'
        : isFloating
            ? '🛸 SENSOR EM PÉ SUSPENSO NO AR: Alinhando os 4 pinos nos furos 14 a 17!'
            : '⚡ DESCENDO SUAVEMENTE: Pinos penetrando nas garras de pressão!';
    let statusColor = isSeated ? '#10B981' : isFloating ? '#38BDF8' : '#FBBF24';

    return `
        <div id="a9-hcsr04-player-card" style="background:linear-gradient(180deg, #0B1329 0%, #0F172A 100%);border:2px solid #0284C7;border-radius:20px;padding:20px;margin-top:18px;box-shadow:0 12px 35px rgba(2,132,199,0.3);position:relative;">
            
            <!-- CABEÇALHO DO MINI VÍDEO -->
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;flex-wrap:wrap;gap:10px;">
                <div style="display:flex;align-items:center;gap:12px;">
                    <span style="background:linear-gradient(135deg,#0284C7,#0369A1);color:white;width:44px;height:44px;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:1.4rem;box-shadow:0 0 15px rgba(2,132,199,0.5);">
                        🦇
                    </span>
                    <div>
                        <div style="display:inline-block;background:rgba(56,189,248,0.15);border:1px solid #38BDF8;color:#7DD3FC;font-size:0.75rem;font-weight:900;padding:2px 8px;border-radius:6px;margin-bottom:2px;">
                            🎥 MINI VÍDEO ANIMADO & SIMULADOR 3D
                        </div>
                        <h4 style="font-family:'Fredoka One',cursive;color:white;margin:0;font-size:1.3rem;">
                            Como o Sensor HC-SR04 Encaixa em Pé na Protoboard
                        </h4>
                    </div>
                </div>

                <div style="display:flex;align-items:center;gap:8px;">
                    <span id="a9-hcsr04-status-badge" style="background:${statusColor}22;border:1px solid ${statusColor};color:${statusColor};padding:4px 12px;border-radius:20px;font-size:0.8rem;font-weight:900;">
                        ${isSeated ? '🔌 Encaixe 100% OK' : '⬆️ Pinos Suspensos'}
                    </span>
                </div>
            </div>

            <!-- EXPLICATIVO LÚDICO: POR QUE ELE FICA EM PÉ? -->
            <div style="background:#0F172A;border:1px solid #1E3A8A;border-radius:12px;padding:10px 14px;color:#CBD5E1;font-size:0.88rem;line-height:1.5;margin-bottom:14px;">
                💡 <b>Por que o sensor fica em pé?</b> O HC-SR04 funciona como os olhos de um morcego! Para "olhar" para o carro que entra na garagem, a plaquinha de circuito azul precisa ficar <b>em pé (vertical)</b>, apontando os 2 cilindros prateados para a frente, enquanto seus 4 pinos metálicos retos descem diretamente para os furinhos da protoboard!
            </div>

            <!-- VIEWPORT DO VÍDEO / SVG INTERATIVO DO ENCAIXE EM PÉ -->
            <div id="a9-hcsr04-svg-container" style="background:radial-gradient(ellipse at 50% 30%, #172554 0%, #020617 100%);border:2px solid #334155;border-radius:16px;padding:8px;position:relative;overflow:hidden;box-shadow:inset 0 4px 20px rgba(0,0,0,0.8);">
                ${a9_renderHcSr04Svg()}
            </div>

            <!-- BARRA DE CONTROLE DO MINI VÍDEO (PLAY / PAUSE / RESTART / SLIDER) -->
            <div style="background:#0F172A;border:1px solid #1E293B;border-radius:14px;padding:14px;margin-top:14px;">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;flex-wrap:wrap;gap:10px;">
                    <!-- Botões de Transporte do Vídeo -->
                    <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
                        <button id="a9-btn-hcsr04-play" onclick="a9_toggleHcSr04Video()" style="background:linear-gradient(135deg,#10B981,#059669);border:none;color:white;padding:9px 18px;border-radius:10px;font-weight:900;font-size:0.85rem;cursor:pointer;display:inline-flex;align-items:center;gap:6px;box-shadow:0 4px 15px rgba(16,185,129,0.35);">
                            <span id="a9-hcsr04-play-icon">${a9_hcsr04_video_playing ? '⏸' : '▶'}</span>
                            <span id="a9-hcsr04-play-label">${a9_hcsr04_video_playing ? 'Pausar Animação' : 'Assistir Mini Vídeo (Encaixar)'}</span>
                        </button>

                        <button onclick="a9_resetHcSr04Video()" style="background:#1E293B;border:1px solid #475569;color:#CBD5E1;padding:8px 14px;border-radius:10px;font-weight:700;font-size:0.82rem;cursor:pointer;display:inline-flex;align-items:center;gap:6px;">
                            <span>⏮</span> Reiniciar (Subir Sensor)
                        </button>

                        <button onclick="a9_triggerSonarWaves()" style="background:linear-gradient(135deg,#F59E0B,#D97706);border:none;color:#0F172A;padding:8px 16px;border-radius:10px;font-weight:900;font-size:0.82rem;cursor:pointer;display:inline-flex;align-items:center;gap:6px;box-shadow:0 4px 15px rgba(245,158,11,0.35);">
                            <span>🔊</span> Disparar Sonar (Eco 40 kHz)
                        </button>
                    </div>

                    <!-- Mensagem de Status do Encaixe -->
                    <div id="a9-hcsr04-status-msg" style="color:${statusColor};font-size:0.85rem;font-weight:800;">
                        ${statusText}
                    </div>
                </div>

                <!-- CONTROLE MANUAL: SLIDER DE ALTURA DO SENSOR (MOVER COM A MÃO) -->
                <div style="background:#1E293B;border-radius:10px;padding:10px 14px;margin-bottom:12px;">
                    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
                        <span style="color:#FDE68A;font-size:0.82rem;font-weight:bold;">
                            🕹️ <b>Controle Manual:</b> Arraste para descer ou subir o sensor com a sua mão:
                        </span>
                        <span id="a9-hcsr04-height-badge" style="background:#0F172A;color:#38BDF8;padding:2px 10px;border-radius:12px;font-size:0.8rem;font-weight:900;">
                            ${100 - a9_hcsr04_height}% inserido
                        </span>
                    </div>
                    <input type="range" min="0" max="100" value="${100 - a9_hcsr04_height}" style="width:100%;cursor:pointer;accent-color:#10B981;height:8px;" oninput="a9_setHcSr04Height(100 - parseInt(this.value, 10))">
                    <div style="display:flex;justify-content:space-between;color:#94A3B8;font-size:0.75rem;margin-top:4px;">
                        <span>⬆️ 100% No Ar (Pinos Expostos)</span>
                        <span>⚡ 50% Descendo</span>
                        <span>✔ 100% Encaixado Firme (Click!)</span>
                    </div>
                </div>

                <!-- BOTÕES DE SELEÇÃO DOS 4 PINOS FÍSICOS (VCC, TRIG, ECHO, GND) -->
                <div>
                    <div style="color:#CBD5E1;font-size:0.82rem;font-weight:900;margin-bottom:8px;display:flex;align-items:center;gap:6px;">
                        <span>🔍 Clique em cada um dos 4 pinos para entender exatamente o que ele faz:</span>
                    </div>

                    <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(150px, 1fr));gap:8px;">
                        <button onclick="a9_selectHcSr04Pin('vcc')" class="a9-pin-tab-btn" style="background:#0F172A;border:2px solid ${a9_hcsr04_active_pin === 'vcc' ? '#EF4444' : '#334155'};color:${a9_hcsr04_active_pin === 'vcc' ? '#FCA5A5' : '#CBD5E1'};padding:8px 10px;border-radius:10px;font-size:0.8rem;font-weight:900;cursor:pointer;text-align:left;transition:all 0.15s ease;">
                            🔴 1. Pino VCC (+5V)
                        </button>
                        <button onclick="a9_selectHcSr04Pin('trig')" class="a9-pin-tab-btn" style="background:#0F172A;border:2px solid ${a9_hcsr04_active_pin === 'trig' ? '#FBBF24' : '#334155'};color:${a9_hcsr04_active_pin === 'trig' ? '#FDE68A' : '#CBD5E1'};padding:8px 10px;border-radius:10px;font-size:0.8rem;font-weight:900;cursor:pointer;text-align:left;transition:all 0.15s ease;">
                            🟡 2. Pino TRIG (Disparo)
                        </button>
                        <button onclick="a9_selectHcSr04Pin('echo')" class="a9-pin-tab-btn" style="background:#0F172A;border:2px solid ${a9_hcsr04_active_pin === 'echo' ? '#10B981' : '#334155'};color:${a9_hcsr04_active_pin === 'echo' ? '#A7F3D0' : '#CBD5E1'};padding:8px 10px;border-radius:10px;font-size:0.8rem;font-weight:900;cursor:pointer;text-align:left;transition:all 0.15s ease;">
                            🟢 3. Pino ECHO (Escuta Eco)
                        </button>
                        <button onclick="a9_selectHcSr04Pin('gnd')" class="a9-pin-tab-btn" style="background:#0F172A;border:2px solid ${a9_hcsr04_active_pin === 'gnd' ? '#64748B' : '#334155'};color:${a9_hcsr04_active_pin === 'gnd' ? '#E2E8F0' : '#CBD5E1'};padding:8px 10px;border-radius:10px;font-size:0.8rem;font-weight:900;cursor:pointer;text-align:left;transition:all 0.15s ease;">
                            ⚫ 4. Pino GND (Terra 0V)
                        </button>
                    </div>

                    <!-- CAIXA DE EXPLICAÇÃO DO PINO SELECIONADO -->
                    <div id="a9-hcsr04-pin-detail-box" style="background:#0B1329;border:1px solid #1E293B;border-radius:10px;padding:12px;margin-top:10px;">
                        ${a9_getHcSr04PinExplanationMarkup(a9_hcsr04_active_pin)}
                    </div>
                </div>

            </div>

        </div>
    `;
}

function a9_renderHcSr04Svg() {
    const isSeated = a9_hcsr04_height === 0;
    // Elevação: de 0 (encaixado) a 95px (no ar)
    const elevation = (a9_hcsr04_height / 100) * 95;
    const sensorBaseY = 270;
    const currentY = sensorBaseY - elevation;
    const pcbY = currentY - 140;

    // Cores de destaque dos pinos
    const vccLit = a9_hcsr04_active_pin === 'all' || a9_hcsr04_active_pin === 'vcc';
    const trigLit = a9_hcsr04_active_pin === 'all' || a9_hcsr04_active_pin === 'trig';
    const echoLit = a9_hcsr04_active_pin === 'all' || a9_hcsr04_active_pin === 'echo';
    const gndLit = a9_hcsr04_active_pin === 'all' || a9_hcsr04_active_pin === 'gnd';

    return `
    <svg viewBox="0 0 740 370" style="width:100%;height:auto;display:block;margin:0 auto;user-select:none;">
        <defs>
            <linearGradient id="a9-hcsr04-pcb-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#0284C7"/>
                <stop offset="100%" stop-color="#0369A1"/>
            </linearGradient>
            <radialGradient id="a9-metal-rim" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#F1F5F9"/>
                <stop offset="70%" stop-color="#CBD5E1"/>
                <stop offset="100%" stop-color="#94A3B8"/>
            </radialGradient>
            <filter id="a9-glow-spark" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="3.5" result="blur"/>
                <feComposite in="SourceGraphic" in2="blur" operator="over"/>
            </filter>
        </defs>

        <!-- SEÇÃO 1: PROTOBOARD NA BASE (EM PERSPECTIVA 2.5D) -->
        <!-- Corpo da Protoboard -->
        <rect x="80" y="255" width="580" height="100" rx="10" fill="#F8FAFC" stroke="#CBD5E1" stroke-width="2.5"/>
        
        <!-- Canaleta Central da Protoboard -->
        <rect x="90" y="315" width="560" height="12" fill="#E2E8F0"/>

        <!-- Linhas de Energia da Protoboard (+) Vermelho e (-) Azul -->
        <line x1="100" y1="338" x2="630" y2="338" stroke="#EF4444" stroke-width="2.5" stroke-dasharray="6,3"/>
        <text x="90" y="341" fill="#EF4444" font-size="11" font-weight="bold">+</text>
        <line x1="100" y1="350" x2="630" y2="350" stroke="#0284C7" stroke-width="2.5" stroke-dasharray="6,3"/>
        <text x="90" y="353" fill="#0284C7" font-size="11" font-weight="bold">-</text>

        <!-- Furos Normais Adjacentes na Protoboard -->
        ${[12, 13, 18, 19, 20].map(col => {
            const x = 140 + (col - 12) * 55;
            return `
                <circle cx="${x}" cy="270" r="3" fill="#64748B"/>
                <circle cx="${x}" cy="285" r="3" fill="#64748B"/>
                <circle cx="${x}" cy="300" r="3" fill="#64748B"/>
                <text x="${x}" y="260" text-anchor="middle" fill="#94A3B8" font-size="8">${col}</text>
            `;
        }).join('')}

        <!-- OS 4 FUROS ALVO ONDE O SENSOR HC-SR04 ENCAIXA (Colunas 14, 15, 16, 17) -->
        <!-- Furo 1: Coluna 14 (Pino VCC) -->
        <g transform="translate(250, 270)">
            <rect x="-8" y="-8" width="16" height="16" rx="3" fill="${isSeated ? '#EF444433' : '#1E293B'}" stroke="${vccLit ? '#EF4444' : '#64748B'}" stroke-width="${isSeated ? '2' : '1'}"/>
            <circle cx="0" cy="0" r="4" fill="#0F172A"/>
            <circle cx="0" cy="0" r="2" fill="${isSeated ? '#EF4444' : '#94A3B8'}"/>
            <text x="0" y="-12" text-anchor="middle" fill="#64748B" font-size="8.5" font-weight="bold">Col 14</text>
            <text x="0" y="24" text-anchor="middle" fill="#EF4444" font-size="9" font-weight="900">VCC (+5V)</text>
        </g>

        <!-- Furo 2: Coluna 15 (Pino TRIG) -->
        <g transform="translate(310, 270)">
            <rect x="-8" y="-8" width="16" height="16" rx="3" fill="${isSeated ? '#FBBF2433' : '#1E293B'}" stroke="${trigLit ? '#FBBF24' : '#64748B'}" stroke-width="${isSeated ? '2' : '1'}"/>
            <circle cx="0" cy="0" r="4" fill="#0F172A"/>
            <circle cx="0" cy="0" r="2" fill="${isSeated ? '#FBBF24' : '#94A3B8'}"/>
            <text x="0" y="-12" text-anchor="middle" fill="#64748B" font-size="8.5" font-weight="bold">Col 15</text>
            <text x="0" y="24" text-anchor="middle" fill="#FBBF24" font-size="9" font-weight="900">TRIG (D9)</text>
        </g>

        <!-- Furo 3: Coluna 16 (Pino ECHO) -->
        <g transform="translate(370, 270)">
            <rect x="-8" y="-8" width="16" height="16" rx="3" fill="${isSeated ? '#10B98133' : '#1E293B'}" stroke="${echoLit ? '#10B981' : '#64748B'}" stroke-width="${isSeated ? '2' : '1'}"/>
            <circle cx="0" cy="0" r="4" fill="#0F172A"/>
            <circle cx="0" cy="0" r="2" fill="${isSeated ? '#10B981' : '#94A3B8'}"/>
            <text x="0" y="-12" text-anchor="middle" fill="#64748B" font-size="8.5" font-weight="bold">Col 16</text>
            <text x="0" y="24" text-anchor="middle" fill="#10B981" font-size="9" font-weight="900">ECHO (D8)</text>
        </g>

        <!-- Furo 4: Coluna 17 (Pino GND) -->
        <g transform="translate(430, 270)">
            <rect x="-8" y="-8" width="16" height="16" rx="3" fill="${isSeated ? '#64748B33' : '#1E293B'}" stroke="${gndLit ? '#64748B' : '#64748B'}" stroke-width="${isSeated ? '2' : '1'}"/>
            <circle cx="0" cy="0" r="4" fill="#0F172A"/>
            <circle cx="0" cy="0" r="2" fill="${isSeated ? '#CBD5E1' : '#94A3B8'}"/>
            <text x="0" y="-12" text-anchor="middle" fill="#64748B" font-size="8.5" font-weight="bold">Col 17</text>
            <text x="0" y="24" text-anchor="middle" fill="#94A3B8" font-size="9" font-weight="900">GND (0V)</text>
        </g>

        <!-- GUIAS LASER PONTILHADAS QUANDO O SENSOR ESTÁ SUSPENSO -->
        ${!isSeated ? `
            <line x1="250" y1="${currentY}" x2="250" y2="265" stroke="#EF4444" stroke-width="2" stroke-dasharray="4,3"/>
            <line x1="310" y1="${currentY}" x2="310" y2="265" stroke="#FBBF24" stroke-width="2" stroke-dasharray="4,3"/>
            <line x1="370" y1="${currentY}" x2="370" y2="265" stroke="#10B981" stroke-width="2" stroke-dasharray="4,3"/>
            <line x1="430" y1="${currentY}" x2="430" y2="265" stroke="#94A3B8" stroke-width="2" stroke-dasharray="4,3"/>
            
            <!-- Régua de Distância / Altura -->
            <line x1="475" y1="${currentY}" x2="475" y2="270" stroke="#38BDF8" stroke-width="1.5"/>
            <polygon points="475,${currentY} 472,${currentY + 6} 478,${currentY + 6}" fill="#38BDF8"/>
            <polygon points="475,270 472,264 478,264" fill="#38BDF8"/>
            <text x="485" y="${currentY + (270 - currentY) / 2 + 4}" fill="#7DD3FC" font-size="9" font-weight="bold">
                ${Math.round(elevation / 2)} mm
            </text>
        ` : ''}

        <!-- EFEITO DE FAÍSCA / ENCAIXE CONCLUÍDO QUANDO TOTALMENTE INSERIDO -->
        ${isSeated ? `
            <circle cx="250" cy="270" r="10" fill="#EF4444" opacity="0.3" filter="url(#a9-glow-spark)"/>
            <circle cx="310" cy="270" r="10" fill="#FBBF24" opacity="0.3" filter="url(#a9-glow-spark)"/>
            <circle cx="370" cy="270" r="10" fill="#10B981" opacity="0.3" filter="url(#a9-glow-spark)"/>
            <circle cx="430" cy="270" r="10" fill="#64748B" opacity="0.3" filter="url(#a9-glow-spark)"/>
        ` : ''}

        <!-- SEÇÃO 2: O SENSOR HC-SR04 EM PÉ (VERTICALMENTE) -->
        <g id="a9-upright-sensor-body" style="transition: transform 0.05s ease;">
            
            <!-- Sombra do Sensor na Protoboard -->
            <ellipse cx="340" cy="270" rx="${120 * (1 - elevation / 150)}" ry="${8 * (1 - elevation / 150)}" fill="#000000" opacity="${0.45 * (1 - elevation / 120)}"/>

            <!-- OS 4 PINOS METÁLICOS PRATEADOS DESCENDO DO FUNDO DA PCB -->
            <!-- Pino 1: VCC -->
            <line x1="250" y1="${currentY - 20}" x2="250" y2="${currentY}" stroke="${vccLit ? '#EF4444' : '#E2E8F0'}" stroke-width="4.5" stroke-linecap="round"/>
            <circle cx="250" cy="${currentY}" r="2.5" fill="${vccLit ? '#EF4444' : '#CBD5E1'}"/>

            <!-- Pino 2: TRIG -->
            <line x1="310" y1="${currentY - 20}" x2="310" y2="${currentY}" stroke="${trigLit ? '#FBBF24' : '#E2E8F0'}" stroke-width="4.5" stroke-linecap="round"/>
            <circle cx="310" cy="${currentY}" r="2.5" fill="${trigLit ? '#FBBF24' : '#CBD5E1'}"/>

            <!-- Pino 3: ECHO -->
            <line x1="370" y1="${currentY - 20}" x2="370" y2="${currentY}" stroke="${echoLit ? '#10B981' : '#E2E8F0'}" stroke-width="4.5" stroke-linecap="round"/>
            <circle cx="370" cy="${currentY}" r="2.5" fill="${echoLit ? '#10B981' : '#CBD5E1'}"/>

            <!-- Pino 4: GND -->
            <line x1="430" y1="${currentY - 20}" x2="430" y2="${currentY}" stroke="${gndLit ? '#94A3B8' : '#E2E8F0'}" stroke-width="4.5" stroke-linecap="round"/>
            <circle cx="430" cy="${currentY}" r="2.5" fill="${gndLit ? '#94A3B8' : '#CBD5E1'}"/>

            <!-- Corpo PCB Azul em Pé (Placa de Circuito Impresso) -->
            <rect x="200" y="${pcbY}" width="280" height="120" rx="8" fill="url(#a9-hcsr04-pcb-grad)" stroke="#38BDF8" stroke-width="2.5" filter="drop-shadow(0 8px 20px rgba(0,0,0,0.6))"/>

            <!-- Trilhas de Cobre Douradas na Placa -->
            <path d="M 230 ${pcbY + 20} L 250 ${pcbY + 45} L 310 ${pcbY + 45}" fill="none" stroke="#FDE68A" stroke-width="1" opacity="0.6"/>
            <path d="M 450 ${pcbY + 20} L 430 ${pcbY + 45} L 370 ${pcbY + 45}" fill="none" stroke="#FDE68A" stroke-width="1" opacity="0.6"/>

            <!-- Textos Silk-Screen na Placa Azul -->
            <text x="340" y="${pcbY + 20}" text-anchor="middle" fill="#FFFFFF" font-family="'Fredoka One', cursive" font-size="12" letter-spacing="1">HC-SR04</text>
            <text x="340" y="${pcbY + 32}" text-anchor="middle" fill="#BAE6FD" font-size="7.5" font-weight="900" letter-spacing="0.5">ULTRASONIC SENSOR</text>

            <!-- Rótulos dos 4 Pinos Silk-Screen na Borda Inferior da Placa -->
            <rect x="235" y="${currentY - 36}" width="210" height="15" rx="3" fill="#0F172A" stroke="#1E293B" stroke-width="1"/>
            <text x="250" y="${currentY - 25}" text-anchor="middle" fill="${vccLit ? '#EF4444' : '#FCA5A5'}" font-size="8.5" font-weight="900">VCC</text>
            <text x="310" y="${currentY - 25}" text-anchor="middle" fill="${trigLit ? '#FBBF24' : '#FDE68A'}" font-size="8.5" font-weight="900">Trig</text>
            <text x="370" y="${currentY - 25}" text-anchor="middle" fill="${echoLit ? '#10B981' : '#A7F3D0'}" font-size="8.5" font-weight="900">Echo</text>
            <text x="430" y="${currentY - 25}" text-anchor="middle" fill="${gndLit ? '#94A3B8' : '#CBD5E1'}" font-size="8.5" font-weight="900">Gnd</text>

            <!-- TRANSDUTOR ESQUERDO: "T" (TRANSMISSOR / DISPARO DE ULTRASSOM) -->
            <g transform="translate(255, ${pcbY + 68})">
                <!-- Cilindro de Alumínio Prateado -->
                <circle cx="0" cy="0" r="32" fill="url(#a9-metal-rim)" stroke="#E2E8F0" stroke-width="2"/>
                <circle cx="0" cy="0" r="23" fill="#475569" stroke="#64748B" stroke-width="1"/>
                <!-- Malha do Alto-falante de Ultrassom -->
                <line x1="-16" y1="-16" x2="16" y2="16" stroke="#94A3B8" stroke-width="1"/>
                <line x1="-16" y1="16" x2="16" y2="-16" stroke="#94A3B8" stroke-width="1"/>
                <circle cx="0" cy="0" r="7" fill="#1E293B"/>
                <!-- Letra "T" Gravada no Metal -->
                <text x="0" y="-36" text-anchor="middle" fill="#FFFFFF" font-family="'Fredoka One', cursive" font-size="13" font-weight="900">T</text>
                <text x="0" y="-25" text-anchor="middle" fill="#FDE68A" font-size="7" font-weight="bold">(Transmissor)</text>
            </g>

            <!-- TRANSDUTOR DIREITO: "R" (RECEPTOR / ESCUTA DO ECO) -->
            <g transform="translate(425, ${pcbY + 68})">
                <!-- Cilindro de Alumínio Prateado -->
                <circle cx="0" cy="0" r="32" fill="url(#a9-metal-rim)" stroke="#E2E8F0" stroke-width="2"/>
                <circle cx="0" cy="0" r="23" fill="#475569" stroke="#64748B" stroke-width="1"/>
                <!-- Malha do Microfone de Ultrassom -->
                <line x1="-16" y1="-16" x2="16" y2="16" stroke="#94A3B8" stroke-width="1"/>
                <line x1="-16" y1="16" x2="16" y2="-16" stroke="#94A3B8" stroke-width="1"/>
                <circle cx="0" cy="0" r="7" fill="#1E293B"/>
                <!-- Letra "R" Gravada no Metal -->
                <text x="0" y="-36" text-anchor="middle" fill="#FFFFFF" font-family="'Fredoka One', cursive" font-size="13" font-weight="900">R</text>
                <text x="0" y="-25" text-anchor="middle" fill="#A7F3D0" font-size="7" font-weight="bold">(Receptor)</text>
            </g>

            <!-- CRISTAL OSCILADOR 4.000 MHz (Cilindro Metálico Oval no Meio) -->
            <rect x="331" y="${pcbY + 54}" width="18" height="28" rx="4" fill="#E2E8F0" stroke="#94A3B8" stroke-width="1"/>
            <text x="340" y="${pcbY + 70}" text-anchor="middle" fill="#475569" font-size="6" font-weight="900" transform="rotate(-90, 340, ${pcbY + 70})">4.000</text>

            <!-- CHIP PROCESSADOR SMD NO CENTRO -->
            <rect x="330" y="${pcbY + 90}" width="20" height="14" rx="2" fill="#0F172A" stroke="#334155" stroke-width="1"/>
            <circle cx="334" cy="${pcbY + 94}" r="1" fill="#64748B"/>
        </g>

        <!-- SEÇÃO 3: ANIMAÇÃO DE ONDAS SONORAS (QUANDO O SONAR DISPARA) -->
        ${a9_hcsr04_sonar_pinging ? `
            <!-- Ondas Amarelas Saindo do Olho T (Grito de 40 kHz) -->
            <g transform="translate(255, ${pcbY + 68})">
                <path d="M 38 -20 A 45 45 0 0 1 38 20" fill="none" stroke="#FBBF24" stroke-width="3.5" stroke-linecap="round" filter="url(#a9-glow-spark)"/>
                <path d="M 58 -32 A 65 65 0 0 1 58 32" fill="none" stroke="#FBBF24" stroke-width="3" stroke-linecap="round" opacity="0.85"/>
                <path d="M 78 -42 A 85 85 0 0 1 78 42" fill="none" stroke="#FBBF24" stroke-width="2.5" stroke-linecap="round" opacity="0.6"/>
                <text x="85" y="-48" fill="#FDE68A" font-size="9" font-weight="bold">Rajada 40 kHz ➔</text>
            </g>

            <!-- Carro / Obstáculo Refletindo a Onda na Garagem -->
            <g transform="translate(640, ${pcbY + 45})">
                <rect x="0" y="0" width="70" height="45" rx="6" fill="#1E293B" stroke="#F59E0B" stroke-width="2"/>
                <text x="35" y="24" text-anchor="middle" fill="white" font-size="1.4rem">🚗</text>
                <text x="35" y="38" text-anchor="middle" fill="#CBD5E1" font-size="7.5" font-weight="bold">Para-choque</text>
            </g>

            <!-- Ondas Verdes Voltando para o Olho R (Eco Detectado!) -->
            <g transform="translate(425, ${pcbY + 68})">
                <path d="M 75 35 A 85 85 0 0 0 75 -35" fill="none" stroke="#10B981" stroke-width="3" stroke-linecap="round" stroke-dasharray="6,3" filter="url(#a9-glow-spark)"/>
                <path d="M 55 25 A 65 65 0 0 0 55 -25" fill="none" stroke="#10B981" stroke-width="3" stroke-linecap="round" stroke-dasharray="6,3" opacity="0.85"/>
                <path d="M 35 15 A 45 45 0 0 0 35 -15" fill="none" stroke="#10B981" stroke-width="3.5" stroke-linecap="round" opacity="0.9"/>
                <text x="85" y="48" fill="#6EE7B7" font-size="9" font-weight="bold">⬅ Eco Retornando!</text>
            </g>

            <!-- Banner Flutuante de Telemetria -->
            <g transform="translate(260, 20)">
                <rect x="0" y="0" width="220" height="28" rx="8" fill="#0F172A" stroke="#10B981" stroke-width="1.5"/>
                <text x="110" y="18" text-anchor="middle" fill="#6EE7B7" font-size="10" font-weight="bold">
                    ⏱️ Eco lido: 1.450 µs ➔ Distância = 25 cm!
                </text>
            </g>
        ` : ''}

        <!-- BADGE DE FIXAÇÃO FIRME QUANDO ENCAIXADO -->
        ${isSeated ? `
            <g transform="translate(220, 22)">
                <rect x="0" y="0" width="300" height="26" rx="8" fill="#064E3B" stroke="#10B981" stroke-width="1.5"/>
                <text x="150" y="17" text-anchor="middle" fill="#A7F3D0" font-size="9.5" font-weight="900" letter-spacing="0.5">
                    ✔ ENCAIXADO COM FIRMEZA NOS CONTATOS METÁLICOS!
                </text>
            </g>
        ` : ''}
    </svg>
    `;
}

function a9_getHcSr04PinExplanationMarkup(pinKey) {
    if (pinKey === 'vcc') {
        return `
            <div style="display:flex;align-items:flex-start;gap:12px;">
                <span style="font-size:2rem;line-height:1;">🔴</span>
                <div>
                    <strong style="color:#EF4444;font-size:1rem;display:block;margin-bottom:2px;">
                        Pino 1: VCC (+5 Volts — A Força Elétrica)
                    </strong>
                    <p style="color:#CBD5E1;font-size:0.85rem;line-height:1.5;margin:0 0 6px;">
                        <b>O que ele faz:</b> Alimenta o sensor com 5 Volts contínuos vindos da trilha vermelha (+) da protoboard. Sem esse pino, o chip interno e os olhos do sensor ficam apagados como um rádio desligado da tomada!
                    </p>
                    <span style="background:#EF444422;color:#FCA5A5;border:1px solid #EF4444;padding:2px 8px;border-radius:6px;font-size:0.75rem;font-weight:bold;">
                        Conexão: Coluna 14 ➔ Trilha Vermelha (+5V)
                    </span>
                </div>
            </div>
        `;
    } else if (pinKey === 'trig') {
        return `
            <div style="display:flex;align-items:flex-start;gap:12px;">
                <span style="font-size:2rem;line-height:1;">🟡</span>
                <div>
                    <strong style="color:#FBBF24;font-size:1rem;display:block;margin-bottom:2px;">
                        Pino 2: TRIG (Trigger / Disparador do Grito)
                    </strong>
                    <p style="color:#CBD5E1;font-size:0.85rem;line-height:1.5;margin:0 0 6px;">
                        <b>O que ele faz:</b> É o gatilho! O Arduino envia um pulso elétrico rápido de 10 microssegundos por este pino. Na mesma hora, o olho esquerdo <b>"T"</b> vibra e dispara 8 ondas inaudíveis de ultrassom (40.000 Hz) viajando no ar!
                    </p>
                    <span style="background:#FBBF2422;color:#FDE68A;border:1px solid #FBBF24;padding:2px 8px;border-radius:6px;font-size:0.75rem;font-weight:bold;">
                        Conexão: Coluna 15 ➔ Arduino Pino Digital 9 (Saída - OUTPUT)
                    </span>
                </div>
            </div>
        `;
    } else if (pinKey === 'echo') {
        return `
            <div style="display:flex;align-items:flex-start;gap:12px;">
                <span style="font-size:2rem;line-height:1;">🟢</span>
                <div>
                    <strong style="color:#10B981;font-size:1rem;display:block;margin-bottom:2px;">
                        Pino 3: ECHO (Eco / Ouvido Receptor — Volta o Sinal!)
                    </strong>
                    <p style="color:#CBD5E1;font-size:0.85rem;line-height:1.5;margin:0 0 6px;">
                        <b>O que ele faz:</b> O som bate no carro e volta. O olho direito <b>"R"</b> escuta o eco e este pino avisa imediatamente ao Arduino! O Arduino mede quanto tempo o som levou para ir e voltar e calcula a distância em cm!
                    </p>
                    <span style="background:#10B98122;color:#A7F3D0;border:1px solid #10B981;padding:2px 8px;border-radius:6px;font-size:0.75rem;font-weight:bold;">
                        Conexão: Coluna 16 ➔ Arduino Pino Digital 8 (Entrada - INPUT)
                    </span>
                </div>
            </div>
        `;
    } else if (pinKey === 'gnd') {
        return `
            <div style="display:flex;align-items:flex-start;gap:12px;">
                <span style="font-size:2rem;line-height:1;">⚫</span>
                <div>
                    <strong style="color:#94A3B8;font-size:1rem;display:block;margin-bottom:2px;">
                        Pino 4: GND (Ground / Terra 0V — O Retorno Seguro)
                    </strong>
                    <p style="color:#CBD5E1;font-size:0.85rem;line-height:1.5;margin:0 0 6px;">
                        <b>O que ele faz:</b> Fecha o circuito elétrico! Todo elétron que entra pelo 5V precisa de um caminho seguro de volta para o polo negativo (0V). Sem o terra, a eletricidade fica presa e nada funciona.
                    </p>
                    <span style="background:#47556933;color:#CBD5E1;border:1px solid #64748B;padding:2px 8px;border-radius:6px;font-size:0.75rem;font-weight:bold;">
                        Conexão: Coluna 17 ➔ Trilha Azul (-) GND da Protoboard
                    </span>
                </div>
            </div>
        `;
    } else {
        return `
            <div style="display:flex;align-items:flex-start;gap:12px;">
                <span style="font-size:2rem;line-height:1;">✨</span>
                <div>
                    <strong style="color:#38BDF8;font-size:1rem;display:block;margin-bottom:2px;">
                        Os 4 Pinos Conectados em Equipe!
                    </strong>
                    <p style="color:#CBD5E1;font-size:0.85rem;line-height:1.5;margin:0 0 6px;">
                        Veja como a mágica acontece: <b>VCC</b> alimenta, <b>TRIG</b> dispara o grito, <b>ECHO</b> ouve o eco da parede/carro e <b>GND</b> fecha a corrente elétrica! Clique nos botões acima para ver o raio-x de cada um individualmente.
                    </p>
                    <span style="background:#0284C722;color:#7DD3FC;border:1px solid #0284C7;padding:2px 8px;border-radius:6px;font-size:0.75rem;font-weight:bold;">
                        Ordem Padrão da Fábrica: 1-VCC | 2-TRIG | 3-ECHO | 4-GND
                    </span>
                </div>
            </div>
        `;
    }
}

function a9_toggleHcSr04Video() {
    if (a9_hcsr04_video_playing) {
        a9_pauseHcSr04Video();
    } else {
        a9_playHcSr04Video();
    }
}

function a9_playHcSr04Video() {
    if (a9_hcsr04_height <= 0) {
        a9_hcsr04_height = 100;
    }
    a9_hcsr04_video_playing = true;
    a9_hcsr04_sonar_pinging = false;
    a9_updateHcSr04PlayerUI();

    if (typeof playSound === 'function') playSound('step');

    clearInterval(a9_hcsr04_video_timer);
    a9_hcsr04_video_timer = setInterval(() => {
        if (!a9_hcsr04_video_playing) {
            clearInterval(a9_hcsr04_video_timer);
            return;
        }

        a9_hcsr04_height -= 4;
        if (a9_hcsr04_height <= 0) {
            a9_hcsr04_height = 0;
            clearInterval(a9_hcsr04_video_timer);
            a9_hcsr04_video_playing = false;

            // Efeito sonoro de encaixe firme
            if (typeof playSound === 'function') {
                playSound('click');
                setTimeout(() => playSound('success'), 120);
            }

            // Ativa o disparo de sonar automático logo após encaixar!
            setTimeout(() => {
                a9_triggerSonarWaves();
            }, 600);
        }
        a9_updateHcSr04PlayerUI();
    }, 45);
}

function a9_pauseHcSr04Video() {
    a9_hcsr04_video_playing = false;
    clearInterval(a9_hcsr04_video_timer);
    a9_updateHcSr04PlayerUI();
    if (typeof playSound === 'function') playSound('click');
}

function a9_resetHcSr04Video() {
    a9_hcsr04_video_playing = false;
    clearInterval(a9_hcsr04_video_timer);
    a9_hcsr04_height = 100;
    a9_hcsr04_sonar_pinging = false;
    a9_hcsr04_active_pin = 'all';
    a9_updateHcSr04PlayerUI();
    if (typeof playSound === 'function') playSound('click');
}

function a9_setHcSr04Height(val) {
    const prev = a9_hcsr04_height;
    a9_hcsr04_height = Math.max(0, Math.min(100, parseInt(val, 10)));
    if (prev > 0 && a9_hcsr04_height === 0) {
        if (typeof playSound === 'function') playSound('click');
    }
    a9_updateHcSr04PlayerUI();
}

function a9_selectHcSr04Pin(pinKey) {
    a9_hcsr04_active_pin = pinKey;
    if (typeof playSound === 'function') playSound('click');
    a9_updateHcSr04PlayerUI();
}

function a9_triggerSonarWaves() {
    a9_hcsr04_sonar_pinging = true;
    if (typeof playSound === 'function') playSound('step');
    a9_updateHcSr04PlayerUI();

    setTimeout(() => {
        if (typeof playSound === 'function') playSound('coin');
    }, 300);

    setTimeout(() => {
        a9_hcsr04_sonar_pinging = false;
        a9_updateHcSr04PlayerUI();
    }, 1800);
}

function a9_updateHcSr04PlayerUI() {
    const container = document.getElementById('a9-hcsr04-svg-container');
    if (container) {
        container.innerHTML = a9_renderHcSr04Svg();
    }

    const playLabel = document.getElementById('a9-hcsr04-play-label');
    const playIcon = document.getElementById('a9-hcsr04-play-icon');
    if (playLabel) playLabel.innerText = a9_hcsr04_video_playing ? 'Pausar Animação' : 'Assistir Mini Vídeo (Encaixar)';
    if (playIcon) playIcon.innerText = a9_hcsr04_video_playing ? '⏸' : '▶';

    const heightBadge = document.getElementById('a9-hcsr04-height-badge');
    if (heightBadge) heightBadge.innerText = `${100 - a9_hcsr04_height}% inserido`;

    const statusBadge = document.getElementById('a9-hcsr04-status-badge');
    const isSeated = a9_hcsr04_height === 0;
    const isFloating = a9_hcsr04_height >= 80;
    let statusText = isSeated
        ? '✔ ENCAIXADO COM FIRMEZA NOS CONTATOS METÁLICOS DA PROTOBOARD!'
        : isFloating
            ? '🛸 SENSOR EM PÉ SUSPENSO NO AR: Alinhando os 4 pinos nos furos 14 a 17!'
            : '⚡ DESCENDO SUAVEMENTE: Pinos penetrando nas garras de pressão!';
    let statusColor = isSeated ? '#10B981' : isFloating ? '#38BDF8' : '#FBBF24';

    if (statusBadge) {
        statusBadge.innerText = isSeated ? '🔌 Encaixe 100% OK' : '⬆️ Pinos Suspensos';
        statusBadge.style.color = statusColor;
        statusBadge.style.borderColor = statusColor;
        statusBadge.style.background = `${statusColor}22`;
    }

    const statusMsg = document.getElementById('a9-hcsr04-status-msg');
    if (statusMsg) {
        statusMsg.innerText = statusText;
        statusMsg.style.color = statusColor;
    }

    const detailBox = document.getElementById('a9-hcsr04-pin-detail-box');
    if (detailBox) {
        detailBox.innerHTML = a9_getHcSr04PinExplanationMarkup(a9_hcsr04_active_pin);
    }
}

function a9_openHcSr04Modal() {
    if (typeof playSound === 'function') playSound('click');
    let modal = document.getElementById('a9-hcsr04-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'a9-hcsr04-modal';
        modal.style.cssText = 'position:fixed;top:0;left:0;width:100vw;height:100vh;background:rgba(15,23,42,0.92);backdrop-filter:blur(6px);z-index:99999;display:flex;align-items:center;justify-content:center;padding:16px;';
        document.body.appendChild(modal);
    }

    modal.innerHTML = `
        <div style="background:#0F172A;border:2px solid #0284C7;border-radius:20px;max-width:850px;width:96%;max-height:92vh;overflow-y:auto;padding:20px;box-shadow:0 20px 60px rgba(0,0,0,0.85);position:relative;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
                <h3 style="font-family:'Fredoka One',cursive;color:white;margin:0;font-size:1.35rem;display:flex;align-items:center;gap:8px;">
                    <span>🦇</span> Mini Vídeo Interativo: Encaixe em Pé do HC-SR04
                </h3>
                <button onclick="a9_closeHcSr04Modal()" style="background:#1E293B;border:1px solid #475569;color:white;width:34px;height:34px;border-radius:50%;font-size:1.2rem;cursor:pointer;display:flex;align-items:center;justify-content:center;">&times;</button>
            </div>
            ${a9_renderHcSr04InsertionPlayer()}
        </div>
    `;
    modal.style.display = 'flex';
}

function a9_closeHcSr04Modal() {
    const modal = document.getElementById('a9-hcsr04-modal');
    if (modal) modal.style.display = 'none';
    a9_pauseHcSr04Video();
}

// ================= INSPECIONADOR DIDÁTICO DO SENSOR DE SOM LMV321 (ROBOCORE) =================
// Ordem física rigorosa dos 3 pinos: 1. GND, 2. VCC, 3. OUT (➔ Entrada Analógica A0)

function a9_renderKy038Inspector() {
    return a9_renderLmv321Inspector();
}

function a9_renderLmv321Inspector() {
    const vOut = a9_lmv321_clapping ? 4.15 : a9_lmv321_voltage;
    const adcVal = a9_lmv321_clapping ? 850 : a9_lmv321_analog_val;
    const thresholdHigh = 512 + Math.round((100 - a9_lmv321_sensitivity) * 2.5); // ex: 650
    const thresholdLow = 512 - Math.round((100 - a9_lmv321_sensitivity) * 2.5);  // ex: 374

    return `
        <div style="background:#0F172A;border:2px solid #EC4899;border-radius:18px;padding:18px;box-shadow:0 8px 30px rgba(236,72,153,0.25);">
            <!-- CABEÇALHO COM TÍTULO E BOTÃO DE PALMAS -->
            <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;margin-bottom:14px;">
                <div style="display:flex;align-items:center;gap:10px;">
                    <span style="background:#EC4899;color:white;width:42px;height:42px;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:1.35rem;box-shadow:0 0 16px rgba(236,72,153,0.5);">
                        <i class="fa-solid fa-microphone-lines"></i>
                    </span>
                    <div>
                        <h4 style="font-family:'Fredoka One',cursive;color:white;margin:0;font-size:1.25rem;display:flex;align-items:center;gap:8px;">
                            Sensor de Som LMV321 (RoboCore 100x): Anatomia & Onda Analógica
                        </h4>
                        <p style="color:#94A3B8;margin:2px 0 0;font-size:0.83rem;">
                            Ordem física real dos pinos: <b>1. GND (Terra)</b> • <b>2. VCC (+5V)</b> • <b>3. OUT (Analógico ➔ Arduino A0)</b>
                        </p>
                    </div>
                </div>

                <!-- Botão de Bater Palmas no Inspetor -->
                <button onclick="a9_triggerKy038Clap()" style="background:linear-gradient(135deg,#EC4899,#DB2777);color:white;border:none;padding:10px 20px;border-radius:12px;font-weight:900;font-size:0.92rem;cursor:pointer;display:inline-flex;align-items:center;gap:8px;box-shadow:0 4px 18px rgba(236,72,153,0.45);transition:transform 0.1s ease;">
                    <span>👏</span> Bater Palmas! (Simular Pulso Analógico)
                </button>
            </div>

            <!-- MINI CARD EXPLICATIVO DO TUTORIAL ROBOCORE -->
            <div style="background:rgba(236,72,153,0.1);border:1px solid rgba(236,72,153,0.3);border-radius:12px;padding:12px 14px;margin-bottom:14px;font-size:0.82rem;color:#FCE7F3;line-height:1.5;">
                <strong style="color:#F472B6;display:flex;align-items:center;gap:6px;margin-bottom:4px;font-size:0.9rem;">
                    <span>🔬</span> Como Funciona o Sensor de Som RoboCore (Chip LMV321):
                </strong>
                O microfone de eletreto capta a vibração do ar e gera uma onda minúscula em milivolts. O chip amplificador operacional <b>LMV321 amplifica esse sinal em 100 vezes</b>! Em silêncio, a saída fica estabilizada em <b>2,5V (~512 no analogRead)</b>. Ao bater palmas perto dele, a tensão salta gerando <b>picos altos (>650) e vales fundos (<370)</b> que o Arduino detecta instantaneamente!
            </div>

            <!-- SELETOR DE PINOS EM DESTAQUE -->
            <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:14px;">
                <button id="a9-ky-tab-all" onclick="a9_selectKy038Pin('all')" style="background:${a9_lmv321_active_pin === 'all' ? '#EC4899' : '#1E293B'};border:1px solid ${a9_lmv321_active_pin === 'all' ? '#EC4899' : '#475569'};color:white;padding:6px 14px;border-radius:10px;font-weight:800;font-size:0.8rem;cursor:pointer;">
                    🔍 Todos os 3 Pinos
                </button>
                <button id="a9-ky-tab-gnd" onclick="a9_selectKy038Pin('gnd')" style="background:${a9_lmv321_active_pin === 'gnd' ? '#334155' : '#1E293B'};border:2px solid ${a9_lmv321_active_pin === 'gnd' ? '#94A3B8' : '#475569'};color:white;padding:6px 14px;border-radius:10px;font-weight:800;font-size:0.8rem;cursor:pointer;">
                    ⚫ 1. GND (Esquerda) ➔ Fio Preto [Trilha Azul 0V]
                </button>
                <button id="a9-ky-tab-vcc" onclick="a9_selectKy038Pin('vcc')" style="background:${a9_lmv321_active_pin === 'vcc' ? '#991B1B' : '#1E293B'};border:2px solid ${a9_lmv321_active_pin === 'vcc' ? '#EF4444' : '#475569'};color:white;padding:6px 14px;border-radius:10px;font-weight:800;font-size:0.8rem;cursor:pointer;">
                    🔴 2. VCC (Centro) ➔ Fio Vermelho [Trilha Vermelha +5V]
                </button>
                <button id="a9-ky-tab-out" onclick="a9_selectKy038Pin('out')" style="background:${a9_lmv321_active_pin === 'out' ? '#831843' : '#1E293B'};border:2px solid ${a9_lmv321_active_pin === 'out' ? '#EC4899' : '#475569'};color:white;padding:6px 14px;border-radius:10px;font-weight:800;font-size:0.8rem;cursor:pointer;">
                    🟣 3. OUT (Direita) ➔ Fio Magenta [Entrada Analógica A0]
                </button>
            </div>

            <!-- ÁREA DO SVG DETALHADO DO COMPONENTE FÍSICO ROBOCORE LMV321 -->
            <div id="a9-ky038-svg-mount" style="background:#020617;border:1px solid #1E293B;border-radius:14px;padding:12px;margin-bottom:14px;overflow-x:auto;">
                ${a9_renderKy038Svg()}
            </div>

            <!-- PAINEL DE TELEMETRIA: OSCILOSCÓPIO ANALÓGICO E STATUS -->
            <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(290px, 1fr));gap:12px;margin-bottom:12px;">
                <!-- Card do Osciloscópio / Sinal Analógico -->
                <div style="background:#1E293B;border:1px solid #334155;border-radius:12px;padding:14px;">
                    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
                        <span style="color:#38BDF8;font-size:0.85rem;font-weight:900;display:flex;align-items:center;gap:6px;">
                            <i class="fa-solid fa-wave-square"></i> Mini-Osciloscópio (Pino A0):
                        </span>
                        <span id="a9-lmv-adc-label" style="background:#0F172A;border:1px solid #38BDF8;color:#38BDF8;padding:2px 8px;border-radius:8px;font-family:monospace;font-size:0.82rem;font-weight:900;">
                            ${adcVal} (${(adcVal * (5.0 / 1023.0)).toFixed(2)}V)
                        </span>
                    </div>

                    <!-- Mini Gráfico de Onda SVG -->
                    <div style="background:#020617;border:1px solid #334155;border-radius:8px;padding:6px;height:75px;position:relative;overflow:hidden;">
                        <!-- Linhas de Limiar Tracejadas -->
                        <div style="position:absolute;top:20%;left:0;right:0;border-top:1px dashed #EC4899;opacity:0.6;"></div>
                        <div style="position:absolute;top:50%;left:0;right:0;border-top:1px solid #475569;opacity:0.8;"></div>
                        <div style="position:absolute;top:80%;left:0;right:0;border-top:1px dashed #EC4899;opacity:0.6;"></div>
                        
                        <svg viewBox="0 0 280 60" style="width:100%;height:100%;">
                            ${a9_lmv321_clapping ? `
                                <!-- Onda de Palma Aguda e Ampla -->
                                <path d="M 0 30 Q 30 30, 60 28 T 90 29 T 120 5 T 140 55 T 160 8 T 180 50 T 210 28 T 280 30" fill="none" stroke="#EC4899" stroke-width="2.5"/>
                            ` : `
                                <!-- Onda de Silêncio / Ruído Ambiente Suave Centrada em 2,5V -->
                                <path d="M 0 30 Q 20 28, 40 31 T 80 29 T 120 31 T 160 29 T 200 31 T 240 29 T 280 30" fill="none" stroke="#38BDF8" stroke-width="1.8"/>
                            `}
                        </svg>
                        <span style="position:absolute;right:8px;bottom:4px;font-size:0.65rem;color:#64748B;font-family:monospace;">
                            Repouso: 2,5V / 512
                        </span>
                    </div>

                    <div style="display:flex;justify-content:space-between;align-items:center;margin-top:8px;font-size:0.75rem;color:#94A3B8;">
                        <span>Limiar Pico: <b>&gt;${thresholdHigh}</b></span>
                        <span>Limiar Vale: <b>&lt;${thresholdLow}</b></span>
                    </div>
                </div>

                <!-- Card de Sensibilidade e Feedback da Lâmpada -->
                <div style="background:#1E293B;border:1px solid #334155;border-radius:12px;padding:14px;display:flex;flex-direction:column;justify-content:space-between;">
                    <div>
                        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
                            <span style="color:#FDE68A;font-size:0.82rem;font-weight:900;">
                                🎚️ Ajuste de Sensibilidade de Software:
                            </span>
                            <span id="a9-ky038-sens-label" style="background:#0284C7;color:white;padding:2px 8px;border-radius:8px;font-size:0.75rem;font-weight:900;">
                                ${a9_lmv321_sensitivity}%
                            </span>
                        </div>
                        <input type="range" min="30" max="95" value="${a9_lmv321_sensitivity}" oninput="a9_setKy038Sensitivity(this.value)" style="width:100%;accent-color:#EC4899;cursor:pointer;height:6px;">
                    </div>

                    <!-- Status de Detecção e Lâmpada -->
                    <div style="display:flex;align-items:center;justify-content:space-between;background:#0F172A;padding:8px 12px;border-radius:8px;border:1px solid #334155;margin-top:8px;">
                        <span style="display:flex;align-items:center;gap:8px;">
                            <span id="a9-lmv-event-icon" style="font-size:1.2rem;">${a9_lmv321_clapping ? '👏' : '👂'}</span>
                            <span style="font-size:0.8rem;color:white;font-weight:bold;">
                                ${a9_lmv321_clapping ? 'PALMA DETECTADA!' : 'Escutando ambiente...'}
                            </span>
                        </span>
                        <span id="a9-ky038-event-badge" style="background:${a9_clapLightOn ? 'rgba(251,191,36,0.2)' : 'rgba(148,163,184,0.1)'};color:${a9_clapLightOn ? '#FBBF24' : '#94A3B8'};border:1px solid ${a9_clapLightOn ? '#FBBF24' : '#475569'};padding:2px 10px;border-radius:8px;font-size:0.75rem;font-weight:900;">
                            ${a9_clapLightOn ? '💡 LÂMPADA ON' : '🌑 LÂMPADA OFF'}
                        </span>
                    </div>
                </div>
            </div>

            <!-- CAIXA DE EXPLICAÇÃO DO PINO SELECIONADO -->
            <div id="a9-ky038-detail-box" style="background:#1E293B;border-left:4px solid #EC4899;border-radius:10px;padding:12px 16px;">
                ${a9_getKy038PinExplanationMarkup(a9_lmv321_active_pin)}
            </div>
        </div>
    `;
}

function a9_renderKy038Svg() {
    const isGnd = a9_lmv321_active_pin === 'gnd' || a9_lmv321_active_pin === 'all';
    const isVcc = a9_lmv321_active_pin === 'vcc' || a9_lmv321_active_pin === 'all';
    const isOut = a9_lmv321_active_pin === 'out' || a9_lmv321_active_pin === 'all';

    return `
    <svg viewBox="0 0 840 330" style="width:100%;max-width:820px;height:auto;margin:0 auto;display:block;">
        <defs>
            <linearGradient id="a9-lmv-pcb" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stop-color="#1E293B"/>
                <stop offset="100%" stop-color="#0F172A"/>
            </linearGradient>
            <linearGradient id="a9-mic-shimmer" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stop-color="#F1F5F9"/>
                <stop offset="50%" stop-color="#94A3B8"/>
                <stop offset="100%" stop-color="#64748B"/>
            </linearGradient>
            <filter id="a9-ky-glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="4" result="blur"/>
                <feComposite in="SourceGraphic" in2="blur" operator="over"/>
            </filter>
        </defs>

        <!-- GRADE DE FUNDO SUTIL -->
        <g stroke="#1E293B" stroke-width="0.5" opacity="0.4">
            ${Array.from({ length: 28 }).map((_, i) => `<line x1="${i * 30}" y1="0" x2="${i * 30}" y2="330"/>`).join('')}
            ${Array.from({ length: 11 }).map((_, i) => `<line x1="0" y1="${i * 30}" x2="840" y2="${i * 30}"/>`).join('')}
        </g>

        <!-- PLACA DE CIRCUITO ROBOCORE LMV321 -->
        <g id="a9-lmv-board" transform="translate(60, 45)">
            <!-- Borda Externa da PCB -->
            <rect x="0" y="0" width="520" height="230" rx="14" fill="url(#a9-lmv-pcb)" stroke="#EC4899" stroke-width="2.5"/>
            
            <!-- Furos de Fixação Metálicos -->
            <circle cx="35" cy="35" r="14" fill="#0B132B" stroke="#94A3B8" stroke-width="2"/>
            <circle cx="35" cy="35" r="8" fill="#020617"/>

            <!-- Trilhas de Cobre Serigrafadas -->
            <path d="M 60 140 L 140 140 L 170 110 L 250 110" fill="none" stroke="#334155" stroke-width="2"/>
            <path d="M 280 150 L 330 150 L 350 120 L 450 120" fill="none" stroke="#334155" stroke-width="2"/>

            <!-- 1. CÁPSULA DO MICROFONE DE ELETRETO -->
            <g id="a9-ky-mic" transform="translate(115, 140)">
                <circle cx="0" cy="0" r="42" fill="url(#a9-mic-shimmer)" stroke="#E2E8F0" stroke-width="2.5"/>
                <circle cx="0" cy="0" r="34" fill="#334155" stroke="#1E293B" stroke-width="1.5"/>
                <!-- Feltro acústico frontal com cruz preta -->
                <circle cx="0" cy="0" r="14" fill="#0F172A"/>
                <line x1="-10" y1="0" x2="10" y2="0" stroke="#475569" stroke-width="2"/>
                <line x1="0" y1="-10" x2="0" y2="10" stroke="#475569" stroke-width="2"/>
                <text x="0" y="60" text-anchor="middle" fill="#CBD5E1" font-size="11" font-weight="900">CÁPSULA MIC</text>
                <text x="0" y="73" text-anchor="middle" fill="#64748B" font-size="8.5">Eletreto de Alta Sensibilidade</text>
            </g>

            <!-- Ondas Sonoras se Palmas Ativas -->
            ${a9_lmv321_clapping ? `
                <g transform="translate(115, 140)" opacity="0.95">
                    <path d="M -55 -30 A 60 60 0 0 0 -55 30" fill="none" stroke="#EC4899" stroke-width="4.5" stroke-linecap="round"/>
                    <path d="M -75 -45 A 85 85 0 0 0 -75 45" fill="none" stroke="#F472B6" stroke-width="3.5" stroke-linecap="round" stroke-dasharray="6,4"/>
                    <path d="M -95 -60 A 110 110 0 0 0 -95 60" fill="none" stroke="#38BDF8" stroke-width="2.5" stroke-linecap="round"/>
                    <text x="-90" y="-70" fill="#F472B6" font-family="'Fredoka One',cursive" font-size="18">👏 PALMA!</text>
                </g>
            ` : ''}

            <!-- 2. DIAGRAMA DO AMPLIFICADOR OPERACIONAL LMV321 (100x GANHO) -->
            <g transform="translate(210, 75)">
                <rect x="0" y="0" width="105" height="95" rx="8" fill="#1E293B" stroke="#EC4899" stroke-width="1.5"/>
                <!-- Símbolo de Triângulo de Amp-Op -->
                <path d="M 20 25 L 85 50 L 20 75 Z" fill="#0F172A" stroke="#38BDF8" stroke-width="2"/>
                <text x="32" y="42" fill="#38BDF8" font-size="12" font-weight="bold">-</text>
                <text x="32" y="64" fill="#38BDF8" font-size="12" font-weight="bold">+</text>
                <text x="52.5" y="87" text-anchor="middle" fill="#F472B6" font-size="9" font-weight="900">GANHO 100x</text>
            </g>

            <!-- 3. CHIP SMD LMV321 (OP-AMP) -->
            <g id="a9-lmv-chip" transform="translate(335, 85)">
                <rect x="0" y="0" width="75" height="75" rx="5" fill="#0F172A" stroke="#334155" stroke-width="1.5"/>
                <circle cx="12" cy="12" r="3.5" fill="#EC4899"/>
                <text x="37.5" y="38" text-anchor="middle" fill="#F8FAFC" font-family="monospace" font-size="11" font-weight="900">LMV321</text>
                <text x="37.5" y="52" text-anchor="middle" fill="#EC4899" font-size="7.5" font-weight="bold">OP-AMP 100x</text>

                <!-- Pinos SMD prateados -->
                ${[0, 1, 2].map(i => `
                    <rect x="-7" y="${16 + i * 18}" width="7" height="6" fill="#CBD5E1"/>
                    <rect x="75" y="${16 + i * 18}" width="7" height="6" fill="#CBD5E1"/>
                `).join('')}
            </g>

            <!-- 4. SERIGRAFIA OFICIAL DA ROBOCORE NA PLACA -->
            <text x="260" y="212" text-anchor="middle" fill="#F472B6" font-family="'Fredoka One',cursive" font-size="13" letter-spacing="1">
                RoboCore SENSOR DE SOM • LMV321 (100x GAIN)
            </text>

            <!-- ================= OS 3 PINOS FÍSICOS EM ORDEM RIGOROSA ================= -->
            <!-- PINO 1: GND (Topo) | PINO 2: VCC (Meio) | PINO 3: OUT (Baixo) -->
            <g transform="translate(480, 0)">
                <!-- Barra Plástica Preta dos Pinos -->
                <rect x="0" y="30" width="30" height="170" rx="4" fill="#020617" stroke="#334155" stroke-width="1.5"/>

                <!-- PINO 1: GND -->
                <g id="a9-svg-ky-pin1" onclick="a9_selectKy038Pin('gnd')" style="cursor:pointer;">
                    ${isGnd ? `<rect x="-10" y="38" width="50" height="42" rx="8" fill="rgba(148,163,184,0.2)" stroke="#94A3B8" stroke-width="2"/>` : ''}
                    <rect x="5" y="44" width="20" height="30" rx="3" fill="#64748B" stroke="#94A3B8" stroke-width="1.5"/>
                    <circle cx="15" cy="59" r="6" fill="#FBBF24"/>
                    <text x="-16" y="63" text-anchor="end" fill="#CBD5E1" font-size="11" font-weight="900">1: GND</text>
                </g>

                <!-- PINO 2: VCC -->
                <g id="a9-svg-ky-pin2" onclick="a9_selectKy038Pin('vcc')" style="cursor:pointer;">
                    ${isVcc ? `<rect x="-10" y="93" width="50" height="42" rx="8" fill="rgba(239,68,68,0.2)" stroke="#EF4444" stroke-width="2"/>` : ''}
                    <rect x="5" y="99" width="20" height="30" rx="3" fill="#64748B" stroke="#94A3B8" stroke-width="1.5"/>
                    <circle cx="15" cy="114" r="6" fill="#FBBF24"/>
                    <text x="-16" y="118" text-anchor="end" fill="#FCA5A5" font-size="11" font-weight="900">2: VCC</text>
                </g>

                <!-- PINO 3: OUT (ANALÓGICO) -->
                <g id="a9-svg-ky-pin3" onclick="a9_selectKy038Pin('out')" style="cursor:pointer;">
                    ${isOut ? `<rect x="-10" y="148" width="50" height="42" rx="8" fill="rgba(236,72,153,0.2)" stroke="#EC4899" stroke-width="2"/>` : ''}
                    <rect x="5" y="154" width="20" height="30" rx="3" fill="#64748B" stroke="#94A3B8" stroke-width="1.5"/>
                    <circle cx="15" cy="169" r="6" fill="#FBBF24"/>
                    <text x="-16" y="173" text-anchor="end" fill="#F472B6" font-size="11" font-weight="900">3: OUT</text>
                </g>
            </g>
        </g>

        <!-- ================= FIOS JUMPERS CONECTADOS COM DESTINO CLARO ================= -->
        <!-- FIO 1: GND (PRETO) -->
        <g opacity="${isGnd ? '1' : '0.25'}" onclick="a9_selectKy038Pin('gnd')" style="cursor:pointer;">
            <path d="M 575 104 C 640 104, 660 65, 715 65" fill="none" stroke="#475569" stroke-width="7" stroke-linecap="round"/>
            <circle cx="575" cy="104" r="5" fill="#475569" stroke="white" stroke-width="1.5"/>
            <circle cx="715" cy="65" r="5" fill="#475569" stroke="white" stroke-width="1.5"/>
            
            <rect x="670" y="45" width="160" height="28" rx="6" fill="#0F172A" stroke="#475569" stroke-width="2"/>
            <text x="750" y="63" text-anchor="middle" fill="#CBD5E1" font-size="9.5" font-weight="900">
                ⚫ FIO PRETO ➔ Trilha Azul (-)
            </text>
        </g>

        <!-- FIO 2: VCC (VERMELHO) -->
        <g opacity="${isVcc ? '1' : '0.25'}" onclick="a9_selectKy038Pin('vcc')" style="cursor:pointer;">
            <path d="M 575 159 C 640 159, 660 159, 715 159" fill="none" stroke="#EF4444" stroke-width="7" stroke-linecap="round"/>
            <circle cx="575" cy="159" r="5" fill="#EF4444" stroke="white" stroke-width="1.5"/>
            <circle cx="715" cy="159" r="5" fill="#EF4444" stroke="white" stroke-width="1.5"/>

            <rect x="670" y="145" width="160" height="28" rx="6" fill="#0F172A" stroke="#EF4444" stroke-width="2"/>
            <text x="750" y="163" text-anchor="middle" fill="#FCA5A5" font-size="9.5" font-weight="900">
                🔴 FIO VERMELHO ➔ Trilha (+)
            </text>
        </g>

        <!-- FIO 3: OUT (MAGENTA ➔ ANALÓGICO A0) -->
        <g opacity="${isOut ? '1' : '0.25'}" onclick="a9_selectKy038Pin('out')" style="cursor:pointer;">
            <path d="M 575 214 C 640 214, 660 250, 715 250" fill="none" stroke="#EC4899" stroke-width="7" stroke-linecap="round"/>
            <circle cx="575" cy="214" r="5" fill="#EC4899" stroke="white" stroke-width="1.5"/>
            <circle cx="715" cy="250" r="5" fill="#EC4899" stroke="white" stroke-width="1.5"/>

            <rect x="670" y="236" width="160" height="28" rx="6" fill="#0F172A" stroke="#EC4899" stroke-width="2"/>
            <text x="750" y="254" text-anchor="middle" fill="#F472B6" font-size="9.5" font-weight="900">
                🟣 FIO MAGENTA ➔ Arduino A0
            </text>
        </g>
    </svg>
    `;
}

function a9_getKy038PinExplanationMarkup(activePin) {
    if (activePin === 'gnd') {
        return `
            <div style="display:flex;align-items:flex-start;gap:12px;">
                <span style="background:#334155;color:white;width:38px;height:38px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:1.2rem;flex-shrink:0;">
                    ⚫
                </span>
                <div>
                    <strong style="color:white;font-size:1rem;display:block;margin-bottom:3px;">
                        Pino 1: GND (Terra / Ground 0V) ➔ Fio Preto na Trilha Azul (-)
                    </strong>
                    <p style="color:#CBD5E1;font-size:0.85rem;line-height:1.5;margin:0;">
                        É o primeiro pino físico da esquerda. Conecte com o <b>FIO PRETO</b> na linha azul (-) da protoboard. Ele fecha o circuito elétrico e dá o caminho de retorno para os elétrons do amplificador LMV321 e do microfone!
                    </p>
                </div>
            </div>
        `;
    } else if (activePin === 'vcc') {
        return `
            <div style="display:flex;align-items:flex-start;gap:12px;">
                <span style="background:#991B1B;color:white;width:38px;height:38px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:1.2rem;flex-shrink:0;">
                    🔴
                </span>
                <div>
                    <strong style="color:#FCA5A5;font-size:1rem;display:block;margin-bottom:3px;">
                        Pino 2: VCC (+5V de Energia) ➔ Fio Vermelho na Trilha Vermelha (+)
                    </strong>
                    <p style="color:#CBD5E1;font-size:0.85rem;line-height:1.5;margin:0;">
                        É o pino central da placa. Conecte com o <b>FIO VERMELHO</b> na linha vermelha (+) de 5V da protoboard. Ele alimenta o circuito integrado LMV321 e polariza o microfone de eletreto para que ele possa escutar qualquer som!
                    </p>
                </div>
            </div>
        `;
    } else if (activePin === 'out') {
        return `
            <div style="display:flex;align-items:flex-start;gap:12px;">
                <span style="background:#831843;color:white;width:38px;height:38px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:1.2rem;flex-shrink:0;">
                    🟣
                </span>
                <div>
                    <strong style="color:#F472B6;font-size:1rem;display:block;margin-bottom:3px;">
                        Pino 3: OUT (Sinal Analógico Amplificado 100x) ➔ Fio Magenta no Pino Analógico A0 do Arduino
                    </strong>
                    <p style="color:#CBD5E1;font-size:0.85rem;line-height:1.5;margin:0;">
                        É o pino da direita. Conecte com o <b>FIO MAGENTA</b> na <b>porta analógica A0</b> do Arduino. Como ensina a RoboCore, este pino emite uma tensão contínua que repousa em <b>2,5V (~512 no código)</b>. Quando você bate palmas, o sinal oscila com picos acima de <b>650</b> e vales abaixo de <b>370</b>!
                    </p>
                </div>
            </div>
        `;
    }

    return `
        <div style="display:flex;align-items:flex-start;gap:12px;">
            <span style="background:#1E293B;color:#EC4899;width:38px;height:38px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:1.2rem;flex-shrink:0;">
                💡
            </span>
            <div>
                <strong style="color:#FDE68A;font-size:1rem;display:block;margin-bottom:3px;">
                    Ordem dos 3 Pinos no seu Sensor RoboCore LMV321: 1. GND | 2. VCC | 3. OUT
                </strong>
                <p style="color:#CBD5E1;font-size:0.85rem;line-height:1.5;margin:0;">
                    Olhando a placa de frente com os pinos voltados para você: <b>Pino 1 (Esquerda) é GND</b> (Fio Preto) • <b>Pino 2 (Meio) é VCC</b> (Fio Vermelho) • <b>Pino 3 (Direita) é OUT</b> (Fio Magenta ➔ Porta Analógica A0). Clique nos botões acima para ver cada conexão em destaque!
                </p>
            </div>
        </div>
    `;
}

function a9_selectKy038Pin(pinKey) {
    a9_lmv321_active_pin = pinKey;
    a9_ky038_active_pin = pinKey;
    if (typeof playSound === 'function') playSound('click');
    a9_updateKy038InspectorUI();
}

function a9_setKy038Sensitivity(val) {
    a9_lmv321_sensitivity = Math.max(30, Math.min(95, parseInt(val, 10)));
    a9_ky038_sensitivity = a9_lmv321_sensitivity;
    const lbl = document.getElementById('a9-ky038-sens-label');
    if (lbl) lbl.innerText = `${a9_lmv321_sensitivity}%`;
    const svgMount = document.getElementById('a9-ky038-svg-mount');
    if (svgMount) svgMount.innerHTML = a9_renderKy038Svg();
}

function a9_triggerKy038Clap() {
    if (typeof playSound === 'function') playSound('coin');
    a9_synthesizeClapSound();

    a9_lmv321_clapping = true;
    a9_ky038_clapping = true;
    a9_clapLightOn = !a9_clapLightOn;

    // Atualiza o inspetor
    a9_updateKy038InspectorUI();

    // Atualiza o diagrama geral e o card de status se existirem na tela
    const circuitMount = document.getElementById('a9-circuit-mount');
    if (circuitMount) circuitMount.innerHTML = a9_renderCircuitSvg(a9_currentStep);

    const micLed = document.getElementById('a9-svg-mic-led');
    if (micLed) micLed.setAttribute('fill', a9_clapLightOn ? '#10B981' : '#334155');

    const clapCard = document.getElementById('a9-clap-status-card');
    if (clapCard) {
        clapCard.style.borderColor = a9_clapLightOn ? '#FBBF24' : '#334155';
        clapCard.innerHTML = `
            <div style="font-size:2.4rem;margin-bottom:4px;">${a9_clapLightOn ? '💡' : '🌑'}</div>
            <strong style="color:${a9_clapLightOn ? '#FDE68A' : '#94A3B8'};font-size:1.1rem;display:block;">
                ${a9_clapLightOn ? 'LÂMPADA ACESA (Pino 13 = HIGH)' : 'LÂMPADA APAGADA (Pino 13 = LOW)'}
            </strong>
            <span style="color:#CBD5E1;font-size:0.8rem;">
                ${a9_clapLightOn ? '✨ A garagem está iluminada!' : '🌙 Garagem no escuro aguardando palmas'}
            </span>
        `;
    }

    setTimeout(() => {
        a9_lmv321_clapping = false;
        a9_ky038_clapping = false;
        a9_updateKy038InspectorUI();
    }, 700);
}

function a9_synthesizeClapSound() {
    try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return;
        const ctx = new AudioCtx();
        const bufferSize = Math.floor(ctx.sampleRate * 0.15); // 150ms
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.03));
        }
        const noise = ctx.createBufferSource();
        noise.buffer = buffer;

        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.value = 1200;
        filter.Q.value = 1.2;

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.7, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        noise.start();
    } catch (e) {}
}

function a9_updateKy038InspectorUI() {
    const svgMount = document.getElementById('a9-ky038-svg-mount');
    if (svgMount) svgMount.innerHTML = a9_renderKy038Svg();

    const detailBox = document.getElementById('a9-ky038-detail-box');
    if (detailBox) detailBox.innerHTML = a9_getKy038PinExplanationMarkup(a9_lmv321_active_pin);

    const adcLabel = document.getElementById('a9-lmv-adc-label');
    if (adcLabel) {
        const adcVal = a9_lmv321_clapping ? 850 : 512;
        const volts = (adcVal * (5.0 / 1023.0)).toFixed(2);
        adcLabel.innerText = `${adcVal} (${volts}V)`;
        adcLabel.style.color = a9_lmv321_clapping ? '#EC4899' : '#38BDF8';
        adcLabel.style.borderColor = a9_lmv321_clapping ? '#EC4899' : '#38BDF8';
    }

    const eventBadge = document.getElementById('a9-ky038-event-badge');
    if (eventBadge) {
        eventBadge.innerText = a9_clapLightOn ? '💡 LÂMPADA ON' : '🌑 LÂMPADA OFF';
        eventBadge.style.color = a9_clapLightOn ? '#FBBF24' : '#94A3B8';
        eventBadge.style.borderColor = a9_clapLightOn ? '#FBBF24' : '#475569';
        eventBadge.style.background = a9_clapLightOn ? 'rgba(251,191,36,0.2)' : 'rgba(148,163,184,0.1)';
    }

    const eventIcon = document.getElementById('a9-lmv-event-icon');
    if (eventIcon) {
        eventIcon.innerText = a9_lmv321_clapping ? '👏' : '👂';
    }

    // Atualiza estilos dos botões de seleção de abas
    ['all', 'gnd', 'vcc', 'out'].forEach(pin => {
        const tab = document.getElementById(`a9-ky-tab-${pin}`);
        if (tab) {
            const isSelected = a9_lmv321_active_pin === pin;
            if (pin === 'all') {
                tab.style.background = isSelected ? '#EC4899' : '#1E293B';
                tab.style.borderColor = isSelected ? '#EC4899' : '#475569';
            } else if (pin === 'gnd') {
                tab.style.background = isSelected ? '#334155' : '#1E293B';
                tab.style.borderColor = isSelected ? '#94A3B8' : '#475569';
            } else if (pin === 'vcc') {
                tab.style.background = isSelected ? '#991B1B' : '#1E293B';
                tab.style.borderColor = isSelected ? '#EF4444' : '#475569';
            } else if (pin === 'out') {
                tab.style.background = isSelected ? '#831843' : '#1E293B';
                tab.style.borderColor = isSelected ? '#EC4899' : '#475569';
            }
        }
    });
}

function a9_openKy038Modal() {
    if (typeof playSound === 'function') playSound('click');
    let modal = document.getElementById('a9-ky038-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'a9-ky038-modal';
        modal.style.cssText = 'position:fixed;top:0;left:0;width:100vw;height:100vh;background:rgba(15,23,42,0.92);backdrop-filter:blur(6px);z-index:99999;display:flex;align-items:center;justify-content:center;padding:16px;';
        document.body.appendChild(modal);
    }

    modal.innerHTML = `
        <div style="background:#0F172A;border:2px solid #EC4899;border-radius:20px;max-width:880px;width:96%;max-height:92vh;overflow-y:auto;padding:20px;box-shadow:0 20px 60px rgba(0,0,0,0.85);position:relative;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
                <h3 style="font-family:'Fredoka One',cursive;color:white;margin:0;font-size:1.35rem;display:flex;align-items:center;gap:8px;">
                    <span>🎤</span> Sensor de Som LMV321 RoboCore (Verificação dos Pinos)
                </h3>
                <button onclick="a9_closeKy038Modal()" style="background:#1E293B;border:1px solid #475569;color:white;width:34px;height:34px;border-radius:50%;font-size:1.2rem;cursor:pointer;display:flex;align-items:center;justify-content:center;">&times;</button>
            </div>
            ${a9_renderKy038Inspector()}
        </div>
    `;
    modal.style.display = 'flex';
}

function a9_closeKy038Modal() {
    const modal = document.getElementById('a9-ky038-modal');
    if (modal) modal.style.display = 'none';
}

// ================= INSPECIONADOR DO LED & RESISTOR 220Ω (ÂTODO / CÁTODO) =================
function a9_toggleInspectLed() {
    a9_led_inspect_lit = !a9_led_inspect_lit;
    if (typeof playSound === 'function') {
        playSound(a9_led_inspect_lit ? 'success' : 'click');
    }
    const mount = document.getElementById('a9-led-resistor-inspector-mount');
    if (mount) mount.innerHTML = a9_renderLedResistorInspectorContent();
    
    // Atualiza também o circuito principal se estiver no passo 3 ou 5
    const circuitMount = document.getElementById('a9-circuit-mount');
    if (circuitMount) {
        circuitMount.innerHTML = a9_renderCircuitSvg(a9_currentStep);
    }
}

function a9_renderLedResistorInspectorContent() {
    const isLit = a9_led_inspect_lit;
    return `
    <div style="background:rgba(15,23,42,0.95);border:2px solid #F59E0B;border-radius:16px;padding:20px;color:white;">
        <!-- Cabeçalho Didático -->
        <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;margin-bottom:16px;border-bottom:1px solid #334155;padding-bottom:12px;">
            <div>
                <h4 style="font-family:'Fredoka One',cursive;font-size:1.3rem;color:#FDE68A;margin:0;display:flex;align-items:center;gap:8px;">
                    <span>💡</span> Como Ligar Corretamente o LED & Resistor de 220Ω
                </h4>
                <p style="margin:4px 0 0 0;font-size:0.85rem;color:#CBD5E1;">
                    Aprenda a polaridade das pernas do LED, o código de cores do resistor e como a coluna da protoboard une os dois sem queimar nada!
                </p>
            </div>
            <button onclick="a9_toggleInspectLed()" style="background:${isLit ? '#10B981' : '#334155'};border:2px solid ${isLit ? '#34D399' : '#64748B'};color:white;padding:8px 16px;border-radius:10px;font-weight:900;font-size:0.9rem;cursor:pointer;display:flex;align-items:center;gap:8px;box-shadow:${isLit ? '0 0 15px rgba(16,185,129,0.5)' : 'none'};transition:all 0.2s ease;">
                <span>${isLit ? '✨' : '⚡'}</span>
                ${isLit ? 'LED ACESO (5V Ativo!)' : 'Testar Ligar LED (5V)'}
            </button>
        </div>

        <!-- Alerta Científico sobre o Resistor -->
        <div style="background:rgba(245,158,11,0.12);border:1px solid #F59E0B;border-radius:12px;padding:12px 16px;margin-bottom:18px;display:flex;align-items:center;gap:14px;">
            <div style="font-size:2rem;flex-shrink:0;">🛡️</div>
            <div style="font-size:0.85rem;line-height:1.45;color:#FEF3C7;">
                <strong style="color:#FDE68A;font-size:0.95rem;display:block;margin-bottom:2px;">O Resistor de 220Ω é o Escudo Protetor do LED!</strong>
                O pino digital do Arduino entrega <strong>5 Volts</strong>. Mas um LED vermelho só aguenta cerca de <strong>1.8V a 2.0V</strong>! Se você ligar o LED direto sem o resistor, passará tanta corrente elétrica que o pequeno chip dentro dele <strong>vai queimar instantaneamente com um estalo e fumaça</strong>. O resistor de 220Ω "segura" a força dos elétrons como um freio seguro.
            </div>
        </div>

        <!-- SVG Grande e Didático: LED + Resistor + Colunas da Protoboard -->
        <div style="background:#090D16;border:1px solid #1E293B;border-radius:14px;padding:12px;margin-bottom:18px;overflow-x:auto;">
            <svg viewBox="0 0 850 340" style="width:100%;min-width:600px;display:block;margin:0 auto;" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <radialGradient id="a9-insp-led-glow" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stop-color="#F87171" stop-opacity="1"/>
                        <stop offset="40%" stop-color="#EF4444" stop-opacity="0.8"/>
                        <stop offset="100%" stop-color="#EF4444" stop-opacity="0"/>
                    </radialGradient>
                    <linearGradient id="a9-insp-col-strip" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stop-color="#059669"/>
                        <stop offset="100%" stop-color="#10B981"/>
                    </linearGradient>
                </defs>

                <!-- ================= 1. METADE SUPERIOR DA PROTOBOARD (COLUNAS 21 e 22) ================= -->
                <!-- Base plástica branca da Protoboard -->
                <rect x="30" y="20" width="790" height="150" rx="10" fill="#F8FAFC" stroke="#94A3B8" stroke-width="2"/>
                <text x="45" y="42" fill="#64748B" font-family="'Fredoka One',cursive" font-size="12">PROTOBOARD (METADE SUPERIOR: LINHAS a até e)</text>

                <!-- Trilha de Alimentação Superior (Azul - GND) -->
                <rect x="35" y="50" width="780" height="20" fill="#E2E8F0"/>
                <line x1="45" y1="60" x2="805" y2="60" stroke="#0284C7" stroke-width="3"/>
                <text x="50" y="58" fill="#0284C7" font-weight="900" font-size="12">-</text>
                <text x="70" y="64" fill="#0369A1" font-size="9" font-weight="bold">TRILHA AZUL (-) = TERRA / GND (0V)</text>

                <!-- Furo na Trilha Azul onde entra o topo do Resistor -->
                <circle cx="580" cy="60" r="4.5" fill="#0F172A" stroke="#0284C7" stroke-width="2"/>
                <text x="580" y="46" text-anchor="middle" fill="#0284C7" font-size="9" font-weight="bold">Furo GND (-)</text>

                <!-- Destaque interno: Metal condutor da Coluna 21 (Linhas a-e) -->
                <rect x="330" y="80" width="30" height="80" rx="6" fill="url(#a9-insp-col-strip)" opacity="0.25"/>
                <rect x="330" y="80" width="30" height="80" rx="6" fill="none" stroke="#10B981" stroke-width="2" stroke-dasharray="3,3"/>
                <text x="345" y="170" text-anchor="middle" fill="#059669" font-size="8.5" font-weight="bold">COLUNA 21</text>
                <text x="345" y="180" text-anchor="middle" fill="#059669" font-size="7.5">(Metal unido a-e)</text>

                <!-- Destaque interno: Metal condutor da Coluna 22 (Linhas a-e) -->
                <rect x="565" y="80" width="30" height="80" rx="6" fill="url(#a9-insp-col-strip)" opacity="0.25"/>
                <rect x="565" y="80" width="30" height="80" rx="6" fill="none" stroke="#10B981" stroke-width="2" stroke-dasharray="3,3"/>
                <text x="580" y="170" text-anchor="middle" fill="#059669" font-size="8.5" font-weight="bold">COLUNA 22</text>
                <text x="580" y="180" text-anchor="middle" fill="#059669" font-size="7.5">(Metal unido a-e)</text>

                <!-- Furos das linhas a, b, c, d, e -->
                ${['a','b','c','d','e'].map((letter, idx) => {
                    const cy = 88 + idx * 16;
                    return `
                        <text x="315" y="${cy + 3}" fill="#64748B" font-size="10" font-weight="bold">${letter}</text>
                        <!-- Furo Col 21 -->
                        <circle cx="345" cy="${cy}" r="3.5" fill="#0F172A"/>
                        <!-- Furo Col 22 -->
                        <circle cx="580" cy="${cy}" r="3.5" fill="#0F172A"/>
                    `;
                }).join('')}

                <!-- Canal Central Isolador desenhado logo abaixo -->
                <rect x="30" y="186" width="790" height="18" fill="#CBD5E1"/>
                <line x1="30" y1="195" x2="820" y2="195" stroke="#94A3B8" stroke-width="1.5" stroke-dasharray="5,3"/>
                <text x="425" y="198" text-anchor="middle" fill="#475569" font-size="9" font-weight="bold">
                    ⛔ CANAL CENTRAL: O SINAL NÃO PASSA DE CIMA (a-e) PARA BAIXO (f-j)! ⛔
                </text>

                <!-- ================= 2. FIO CIANO DO ARDUINO D13 ================= -->
                <!-- Chega no Furo 21-c -->
                <path d="M 50 120 C 180 120, 260 120, 345 120" fill="none" stroke="#06B6D4" stroke-width="6" stroke-linecap="round"/>
                <circle cx="345" cy="120" r="5" fill="#06B6D4" stroke="white" stroke-width="2"/>
                <rect x="60" y="105" width="160" height="24" rx="5" fill="#083344" stroke="#06B6D4" stroke-width="1.5"/>
                <text x="140" y="121" text-anchor="middle" fill="#67E8F9" font-size="9.5" font-weight="900">
                    🔷 FIO CIANO ➔ Pino D13 (+5V)
                </text>
                <text x="345" y="112" text-anchor="middle" fill="#0891B2" font-size="8" font-weight="bold">Furo 21-c</text>

                <!-- ================= 3. O LED (5mm VERMELHO) ================= -->
                <!-- Perna Longa (Ânodo +): sai do furo 21-d (cy=136) -->
                <path d="M 345 136 C 345 150, 420 160, 440 220" fill="none" stroke="#CBD5E1" stroke-width="3" stroke-linecap="round"/>
                <circle cx="345" cy="136" r="4.5" fill="#EF4444" stroke="white" stroke-width="1.5"/>
                <text x="345" y="150" text-anchor="end" fill="#DC2626" font-size="8" font-weight="bold">Furo 21-d (+)</text>

                <!-- Perna Curta (Cátodo -): sai do furo 22-d (cy=136) -->
                <path d="M 580 136 C 580 150, 500 160, 480 220" fill="none" stroke="#CBD5E1" stroke-width="3" stroke-linecap="round"/>
                <circle cx="580" cy="136" r="4.5" fill="#475569" stroke="white" stroke-width="1.5"/>
                <text x="580" y="150" text-anchor="start" fill="#475569" font-size="8" font-weight="bold">Furo 22-d (-)</text>

                <!-- Corpo do LED (Bulbo 5mm vermelho) -->
                <g transform="translate(460, 235)">
                    <!-- Halo de brilho se aceso -->
                    ${isLit ? `<circle cx="0" cy="0" r="40" fill="url(#a9-insp-led-glow)"/>` : ''}
                    
                    <!-- Bulbo de epóxi -->
                    <path d="M -18 15 C -18 -25, 18 -25, 18 15 Z" fill="${isLit ? '#EF4444' : '#7F1D1D'}" stroke="${isLit ? '#FCA5A5' : '#991B1B'}" stroke-width="2"/>
                    <!-- Borda/colar plástico inferior -->
                    <rect x="-20" y="15" width="38" height="6" rx="2" fill="${isLit ? '#DC2626' : '#5F1414'}"/>
                    <!-- Chanfro / Lado Plano no colar (marca física do Cátodo -) -->
                    <line x1="18" y1="15" x2="18" y2="21" stroke="#FDE68A" stroke-width="3"/>

                    <!-- Estrutura interna de chumbo (visível no raio-x) -->
                    <!-- Haste fina (Ânodo +) -->
                    <path d="M -8 15 L -8 0 L -3 -3" fill="none" stroke="#CBD5E1" stroke-width="1.8"/>
                    <!-- Bigorna larga (Cátodo -) -->
                    <path d="M 8 15 L 8 2 L 2 -3 L 8 -10" fill="none" stroke="#CBD5E1" stroke-width="2.5"/>

                    <!-- Brilho de reflexo no vidro -->
                    <ellipse cx="-7" cy="-5" rx="3" ry="10" fill="white" opacity="0.4" transform="rotate(-20 -7 -5)"/>

                    <!-- Rótulo do LED -->
                    <text x="0" y="38" text-anchor="middle" fill="${isLit ? '#FDE68A' : '#CBD5E1'}" font-size="11" font-weight="900">
                        ${isLit ? '✨ LED LIGADO!' : 'LED VERMELHO'}
                    </text>
                </g>

                <!-- Etiquetas explicativas das pernas do LED -->
                <rect x="230" y="240" width="180" height="50" rx="8" fill="#1E293B" stroke="#EF4444" stroke-width="1.5"/>
                <text x="240" y="258" fill="#FCA5A5" font-size="10" font-weight="900">▲ PERNA MAIS LONGA (+)</text>
                <text x="240" y="272" fill="#E2E8F0" font-size="8.5">• Chama-se <b>Ânodo</b></text>
                <text x="240" y="284" fill="#E2E8F0" font-size="8.5">• Encontra o 5V do D13 na Col 21</text>

                <rect x="510" y="240" width="180" height="50" rx="8" fill="#1E293B" stroke="#64748B" stroke-width="1.5"/>
                <text x="520" y="258" fill="#CBD5E1" font-size="10" font-weight="900">▼ PERNA MAIS CURTA (-)</text>
                <text x="520" y="272" fill="#E2E8F0" font-size="8.5">• Chama-se <b>Cátodo</b> (lado chanfrado)</text>
                <text x="520" y="284" fill="#E2E8F0" font-size="8.5">• Encontra o Resistor na Col 22</text>

                <!-- ================= 4. O RESISTOR DE 220Ω ================= -->
                <!-- Perna inferior sai do Furo 22-c (cy=120) -->
                <!-- Perna superior vai para o Furo GND (-) em cy=60 -->
                <line x1="580" y1="120" x2="580" y2="60" stroke="#94A3B8" stroke-width="3" stroke-linecap="round"/>
                <!-- Corpo cilíndrico do Resistor no meio da perna -->
                <rect x="571" y="78" width="18" height="32" rx="4" fill="#D97706" stroke="#78350F" stroke-width="1.5"/>
                
                <!-- As 4 Faixas Coloridas do Resistor de 220Ω -->
                <!-- Faixa 1: Vermelho (2) -->
                <rect x="571" y="83" width="18" height="4" fill="#EF4444"/>
                <!-- Faixa 2: Vermelho (2) -->
                <rect x="571" y="90" width="18" height="4" fill="#EF4444"/>
                <!-- Faixa 3: Marrom (x10) -->
                <rect x="571" y="97" width="18" height="4" fill="#78350F"/>
                <!-- Faixa 4: Ouro (±5%) -->
                <rect x="571" y="104" width="18" height="3" fill="#FBBF24"/>

                <!-- Ponto elétrico de encontro: Cátodo e Resistor na mesma Coluna 22 -->
                <circle cx="580" cy="120" r="5" fill="#10B981" stroke="white" stroke-width="2"/>
                <text x="590" y="124" fill="#10B981" font-size="9" font-weight="900">ENCONTRO ELÉTRICO!</text>
                <text x="590" y="134" fill="#A7F3D0" font-size="7.5">Furo 22-c (Resistor) toca Furo 22-d (Cátodo)</text>

                <!-- Etiqueta do Resistor -->
                <g transform="translate(680, 75)">
                    <rect x="0" y="0" width="140" height="54" rx="6" fill="#1E293B" stroke="#D97706" stroke-width="1.5"/>
                    <text x="70" y="16" text-anchor="middle" fill="#FDE68A" font-size="10" font-weight="900">RESISTOR 220Ω</text>
                    <text x="70" y="30" text-anchor="middle" fill="#F87171" font-size="8">🔴 Vermelho (2)</text>
                    <text x="70" y="40" text-anchor="middle" fill="#F87171" font-size="8">🔴 Vermelho (2)</text>
                    <text x="70" y="50" text-anchor="middle" fill="#D97706" font-size="8">🟤 Marrom (x10) = 220Ω</text>
                </g>
            </svg>
        </div>

        <!-- Passo a Passo Resumido em 3 Passos Táteis -->
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:12px;">
            <div style="background:#1E293B;border-left:4px solid #06B6D4;border-radius:10px;padding:12px;">
                <span style="font-size:0.75rem;background:#083344;color:#67E8F9;padding:2px 8px;border-radius:6px;font-weight:900;">PASSO A</span>
                <strong style="display:block;margin:6px 0 3px 0;color:white;font-size:0.95rem;">Coluna 21: Positivo (+5V)</strong>
                <p style="margin:0;font-size:0.8rem;color:#CBD5E1;line-height:1.4;">
                    Espete o <strong>Fio Ciano no Furo 21-c</strong> (vindo do D13). No <strong>Furo 21-d</strong>, espete a <strong>Perna Longa (Ânodo)</strong> do LED. Elas se comunicam pelo trilho interno de metal da coluna 21!
                </p>
            </div>

            <div style="background:#1E293B;border-left:4px solid #10B981;border-radius:10px;padding:12px;">
                <span style="font-size:0.75rem;background:#064E3B;color:#6EE7B7;padding:2px 8px;border-radius:6px;font-weight:900;">PASSO B</span>
                <strong style="display:block;margin:6px 0 3px 0;color:white;font-size:0.95rem;">Coluna 22: O Nó Intermediário</strong>
                <p style="margin:0;font-size:0.8rem;color:#CBD5E1;line-height:1.4;">
                    Espete a <strong>Perna Curta (Cátodo) no Furo 22-d</strong>. Ao lado dela, no <strong>Furo 22-c</strong>, espete uma das pernas do resistor de 220Ω. Os elétrons fluem do LED para o resistor!
                </p>
            </div>

            <div style="background:#1E293B;border-left:4px solid #0284C7;border-radius:10px;padding:12px;">
                <span style="font-size:0.75rem;background:#082F49;color:#7DD3FC;padding:2px 8px;border-radius:6px;font-weight:900;">PASSO C</span>
                <strong style="display:block;margin:6px 0 3px 0;color:white;font-size:0.95rem;">Trilha Azul: Retorno ao GND</strong>
                <p style="margin:0;font-size:0.8rem;color:#CBD5E1;line-height:1.4;">
                    A outra perna do resistor vai direto na <strong>Linha Azul (-) Superior</strong>. O circuito fecha no terra (GND) com segurança máxima! Nunca passe fios pelo canal central sem necessidade.
                </p>
            </div>
        </div>
    </div>
    `;
}

function a9_renderLedResistorInspector() {
    return `<div id="a9-led-resistor-inspector-mount">${a9_renderLedResistorInspectorContent()}</div>`;
}

function a9_openLedResistorModal() {
    if (typeof playSound === 'function') playSound('click');
    let modal = document.getElementById('a9-led-resistor-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'a9-led-resistor-modal';
        modal.style.cssText = 'position:fixed;top:0;left:0;width:100vw;height:100vh;background:rgba(15,23,42,0.92);backdrop-filter:blur(6px);z-index:99999;display:flex;align-items:center;justify-content:center;padding:16px;';
        document.body.appendChild(modal);
    }
    modal.innerHTML = `
        <div style="background:#0F172A;border:2px solid #F59E0B;border-radius:20px;max-width:900px;width:96%;max-height:92vh;overflow-y:auto;padding:20px;box-shadow:0 20px 60px rgba(0,0,0,0.85);position:relative;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
                <h3 style="font-family:'Fredoka One',cursive;color:white;margin:0;font-size:1.35rem;display:flex;align-items:center;gap:8px;">
                    <span>💡</span> Guia do LED & Resistor (Ânodo/Cátodo)
                </h3>
                <button onclick="a9_closeLedResistorModal()" style="background:#1E293B;border:1px solid #475569;color:white;width:34px;height:34px;border-radius:50%;font-size:1.2rem;cursor:pointer;display:flex;align-items:center;justify-content:center;">&times;</button>
            </div>
            ${a9_renderLedResistorInspector()}
        </div>
    `;
    modal.style.display = 'flex';
}

function a9_closeLedResistorModal() {
    const modal = document.getElementById('a9-led-resistor-modal');
    if (modal) modal.style.display = 'none';
}

// ================= INSPECIONADOR DO DISPLAY LCD 1602 (16 PINOS vs I2C) =================
function a9_setLcdViewMode(mode) {
    a9_lcd_view_mode = mode;
    if (typeof playSound === 'function') playSound('click');
    const mount = document.getElementById('a9-lcd-inspector-mount');
    if (mount) mount.innerHTML = a9_renderLcd1602InspectorContent();
}

function a9_renderLcd1602InspectorContent() {
    const mode = a9_lcd_view_mode;
    return `
    <div style="background:rgba(15,23,42,0.95);border:2px solid #06B6D4;border-radius:16px;padding:20px;color:white;">
        <!-- Cabeçalho -->
        <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;margin-bottom:16px;border-bottom:1px solid #334155;padding-bottom:12px;">
            <div>
                <h4 style="font-family:'Fredoka One',cursive;font-size:1.3rem;color:#67E8F9;margin:0;display:flex;align-items:center;gap:8px;">
                    <span>📟</span> Display LCD 16x2 GDM1602K (Master Kit RoboCore)
                </h4>
                <p style="margin:4px 0 0 0;font-size:0.85rem;color:#CBD5E1;">
                    Aprenda a ciência dos cristais líquidos nemáticos, a pinagem física dos 16 pinos e o código C++!
                </p>
            </div>

            <!-- Abas Seletoras -->
            <div style="display:flex;gap:6px;background:#0F172A;padding:4px;border-radius:12px;border:1px solid #334155;flex-wrap:wrap;">
                <button onclick="a9_setLcdViewMode('science')" style="background:${mode === 'science' ? '#0891B2' : 'transparent'};border:none;color:${mode === 'science' ? 'white' : '#94A3B8'};padding:7px 12px;border-radius:8px;font-weight:900;font-size:0.82rem;cursor:pointer;display:flex;align-items:center;gap:6px;transition:all 0.2s ease;">
                    <span>🔬</span> Como os LCDs Funcionam
                </button>
                <button onclick="a9_setLcdViewMode('parallel')" style="background:${mode === 'parallel' ? '#0891B2' : 'transparent'};border:none;color:${mode === 'parallel' ? 'white' : '#94A3B8'};padding:7px 12px;border-radius:8px;font-weight:900;font-size:0.82rem;cursor:pointer;display:flex;align-items:center;gap:6px;transition:all 0.2s ease;">
                    <span>🔌</span> Pinos do Kit (16 Pinos)
                </button>
                <button onclick="a9_setLcdViewMode('code')" style="background:${mode === 'code' ? '#0891B2' : 'transparent'};border:none;color:${mode === 'code' ? 'white' : '#94A3B8'};padding:7px 12px;border-radius:8px;font-weight:900;font-size:0.82rem;cursor:pointer;display:flex;align-items:center;gap:6px;transition:all 0.2s ease;">
                    <span>💻</span> Código C++ Master Kit
                </button>
                <button onclick="a9_setLcdViewMode('i2c')" style="background:${mode === 'i2c' ? '#0891B2' : 'transparent'};border:none;color:${mode === 'i2c' ? 'white' : '#94A3B8'};padding:7px 12px;border-radius:8px;font-weight:900;font-size:0.82rem;cursor:pointer;display:flex;align-items:center;gap:6px;transition:all 0.2s ease;">
                    <span>🎒</span> Mochila I2C (4 Fios)
                </button>
            </div>
        </div>

        ${mode === 'science' ? a9_renderLcdScienceExplanation() : ''}
        ${mode === 'parallel' ? a9_renderLcdParallelExplanation() : ''}
        ${mode === 'code' ? a9_renderLcdCodeExplanation() : ''}
        ${mode === 'i2c' ? a9_renderLcdI2cExplanation() : ''}
    </div>
    `;
}

function a9_renderLcdScienceExplanation() {
    return `
    <div>
        <!-- Card Resumo Científico -->
        <div style="background:rgba(6,182,212,0.1);border:1px solid #0891B2;border-radius:12px;padding:16px;margin-bottom:16px;">
            <div style="display:flex;gap:12px;align-items:flex-start;">
                <span style="font-size:2.2rem;line-height:1;">🔬</span>
                <div style="font-size:0.86rem;color:#E0F2FE;line-height:1.6;">
                    <strong style="color:#67E8F9;font-size:1.05rem;display:block;margin-bottom:6px;">
                        Como Funciona uma Tela LCD (Liquid Crystal Display / Cristal Líquido)?
                    </strong>
                    Os <b>cristais líquidos não emitem luz própria</b>! Por isso, o visor possui uma <b>luz de fundo (backlight)</b> na parte traseira que brilha em direção aos seus olhos. Na frente da luz, existem <b>dois filtros polarizadores cruzados a 90 graus</b> (um vertical e outro horizontal). Normalmente, nenhuma luz passaria por dois filtros cruzados... mas o segredo está no <b>cristal líquido nemático torcido (Twisted Nematic)</b> colocado entre eles!
                </div>
            </div>
        </div>

        <!-- Diagrama Visual em Camadas das 6 Partes do LCD -->
        <div style="background:#0F172A;border:1px solid #334155;border-radius:14px;padding:16px;margin-bottom:16px;">
            <strong style="color:#FDE047;font-size:0.95rem;display:flex;align-items:gap:8px;margin-bottom:12px;">
                <span>🥞</span> As 6 Camadas que Integram a Tela de LCD:
            </strong>
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:10px;">
                <div style="background:#1E293B;padding:10px 14px;border-radius:10px;border-left:3px solid #38BDF8;">
                    <strong style="color:#38BDF8;font-size:0.85rem;display:block;">1. Luz de Fundo (Backlight)</strong>
                    <span style="font-size:0.78rem;color:#CBD5E1;">Fornece a iluminação traseira constante (alimentada pelos pinos 15-A e 16-K).</span>
                </div>
                <div style="background:#1E293B;padding:10px 14px;border-radius:10px;border-left:3px solid #06B6D4;">
                    <strong style="color:#06B6D4;font-size:0.85rem;display:block;">2. Filtro Polarizador Vertical</strong>
                    <span style="font-size:0.78rem;color:#CBD5E1;">Permite que apenas ondas de luz com vibração vertical entrem na célula.</span>
                </div>
                <div style="background:#1E293B;padding:10px 14px;border-radius:10px;border-left:3px solid #10B981;">
                    <strong style="color:#10B981;font-size:0.85rem;display:block;">3. Substrato de Vidro com ITO</strong>
                    <span style="font-size:0.78rem;color:#CBD5E1;">Eletrodos transparentes de ITO que conduzem a eletricidade para cada pixel.</span>
                </div>
                <div style="background:#1E293B;padding:10px 14px;border-radius:10px;border-left:3px solid #F59E0B;">
                    <strong style="color:#F59E0B;font-size:0.85rem;display:block;">4. Cristal Líquido Nemático Torcido</strong>
                    <span style="font-size:0.78rem;color:#CBD5E1;">Sem eletricidade: torce a luz em 90°. Com eletricidade: destorce e bloqueia a luz!</span>
                </div>
                <div style="background:#1E293B;padding:10px 14px;border-radius:10px;border-left:3px solid #EC4899;">
                    <strong style="color:#EC4899;font-size:0.85rem;display:block;">5. Filtro Polarizador Horizontal (90°)</strong>
                    <span style="font-size:0.78rem;color:#CBD5E1;">Bloqueia ou libera os raios de luz girados pelo cristal para formar o texto.</span>
                </div>
                <div style="background:#1E293B;padding:10px 14px;border-radius:10px;border-left:3px solid #A855F7;">
                    <strong style="color:#A855F7;font-size:0.85rem;display:block;">6. Vidro Protetor Frontal</strong>
                    <span style="font-size:0.78rem;color:#CBD5E1;">Onde nós olhamos os caracteres nítidos de 16 colunas por 2 linhas!</span>
                </div>
            </div>
        </div>

        <!-- Detalhes do Controlador GDM1602K e Matriz 5x8 -->
        <div style="background:#0F172A;border:1px solid #334155;border-radius:14px;padding:16px;">
            <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;margin-bottom:10px;">
                <strong style="color:#67E8F9;font-size:0.95rem;display:flex;align-items:center;gap:8px;">
                    <span>💾</span> Controlador GDM1602K (O Cérebro da Tela do Kit):
                </strong>
                <span style="background:#0284C7;color:white;padding:2px 10px;border-radius:12px;font-size:0.75rem;font-weight:900;">
                    16 Colunas × 2 Linhas • Matriz 5×8
                </span>
            </div>

            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:12px;font-size:0.82rem;color:#CBD5E1;line-height:1.5;">
                <div style="background:#1E293B;padding:12px;border-radius:10px;">
                    <strong style="color:#FDE047;display:block;margin-bottom:4px;">🔤 Matriz de 5×8 Pontos:</strong>
                    Cada um dos 32 caracteres da tela é desenhado por uma grade minúscula de 5 pontos de largura por 8 pontos de altura. O controlador acende ou apaga cada ponto individualmente para desenhar letras como 'A', números ou pontuações!
                </div>
                <div style="background:#1E293B;padding:12px;border-radius:10px;">
                    <strong style="color:#A7F3D0;display:block;margin-bottom:4px;">📚 240 Fontes na ROM + 8 Personalizadas:</strong>
                    A memória ROM do chip GDM1602K possui <b>208 caracteres 5×8</b> e <b>32 caracteres 5×10</b> já gravados de fábrica. Além disso, a memória RAM permite ao aluno desenhar <b>até 8 caracteres personalizados</b> (como smiles, corações ou ícones)!
                </div>
                <div style="background:#1E293B;padding:12px;border-radius:10px;">
                    <strong style="color:#FCA5A5;display:block;margin-bottom:4px;">📍 Coordenadas de Coluna e Linha:</strong>
                    No código Arduino, as colunas vão de <b>0 a 15</b> e as linhas de <b>0 a 1</b>. O comando <code>lcd.setCursor(coluna, linha)</code> posiciona o cursor exatamente onde o próximo caractere será escrito!
                </div>
            </div>
        </div>
    </div>
    `;
}

function a9_renderLcdI2cExplanation() {
    return `
    <div>
        <!-- Card de Explicação da Mochila I2C -->
        <div style="background:rgba(6,182,212,0.1);border:1px solid #0891B2;border-radius:12px;padding:14px;margin-bottom:16px;">
            <div style="display:flex;gap:12px;align-items:flex-start;">
                <span style="font-size:2rem;line-height:1;">🎒</span>
                <div style="font-size:0.88rem;color:#E0F2FE;line-height:1.5;">
                    <strong style="color:#67E8F9;font-size:1rem;display:block;margin-bottom:4px;">
                        Por que soldamos a placa preta (Mochila I2C) atrás dos 16 pinos?
                    </strong>
                    Se você olhar o seu Display LCD 1602 físico, você verá uma fileira com <strong>16 furinhos metálicos</strong> (numerados de 1 a 16). Ligar 16 fios no Arduino ocuparia quase todas as portas da placa e faria um ninho de fios confuso!
                    <br>
                    Por isso, o mundo maker inventou o <strong>Módulo I2C (chip PCF8574)</strong>: ele é uma plaquinha preta soldada exatamente nesses 16 pinos e <strong>converte todos eles em apenas 4 pinos fáceis</strong>!
                </div>
            </div>
        </div>

        <!-- SVG do LCD 1602 com a Mochila I2C nas costas e os 16 pinos identificados -->
        <div style="background:#090D16;border:1px solid #1E293B;border-radius:14px;padding:12px;margin-bottom:16px;overflow-x:auto;">
            <svg viewBox="0 0 850 280" style="width:100%;min-width:600px;display:block;margin:0 auto;" xmlns="http://www.w3.org/2000/svg">
                <!-- Placa Verde do LCD 1602 -->
                <rect x="50" y="20" width="750" height="230" rx="14" fill="#065F46" stroke="#047857" stroke-width="2.5"/>
                <!-- Moldura de Metal Prateado da Tela -->
                <rect x="90" y="55" width="450" height="155" rx="8" fill="#047857" stroke="#0F172A" stroke-width="3"/>
                <rect x="105" y="70" width="420" height="125" rx="4" fill="#082F49" stroke="#0284C7" stroke-width="2"/>
                <!-- Texto na Tela -->
                <text x="125" y="115" fill="#38BDF8" font-family="monospace" font-size="18" font-weight="900" letter-spacing="1.5">GARAGEM INTELIGENTE</text>
                <text x="125" y="155" fill="#34D399" font-family="monospace" font-size="18" font-weight="900" letter-spacing="1.5">Vaga: 25cm  [OK]</text>

                <!-- FILEIRA DE 16 PINOS (1 a 16) NO TOPO DA PLACA VERDE -->
                <g transform="translate(90, 26)">
                    <rect x="0" y="0" width="450" height="22" rx="4" fill="#044E39" stroke="#10B981" stroke-width="1"/>
                    ${Array.from({length: 16}).map((_, i) => {
                        const px = 15 + i * 28;
                        const num = i + 1;
                        return `
                            <circle cx="${px}" cy="11" r="5" fill="#FBBF24" stroke="#78350F" stroke-width="1"/>
                            <text x="${px}" y="20" text-anchor="middle" fill="#064E3B" font-size="6" font-weight="900">${num}</text>
                        `;
                    }).join('')}
                    <text x="225" y="-5" text-anchor="middle" fill="#A7F3D0" font-size="9" font-weight="900">
                        OS 16 PINOS FÍSICOS DE FÁBRICA (1 a 16)
                    </text>
                </g>

                <!-- MOCHILA I2C (PLACA PRETA) SOLDADA NAS COSTAS -->
                <g transform="translate(565, 45)">
                    <!-- Placa preta do I2C -->
                    <rect x="0" y="0" width="215" height="175" rx="8" fill="#020617" stroke="#38BDF8" stroke-width="2"/>
                    <rect x="0" y="0" width="215" height="24" rx="6" fill="#0F172A"/>
                    <text x="107" y="16" text-anchor="middle" fill="#38BDF8" font-family="'Fredoka One',cursive" font-size="11">
                        MOCHILA I2C (PCF8574)
                    </text>

                    <!-- Trimpot azul de Contraste -->
                    <rect x="25" y="38" width="46" height="46" rx="4" fill="#0284C7" stroke="#0369A1" stroke-width="1.5"/>
                    <circle cx="48" cy="61" r="14" fill="#F8FAFC"/>
                    <line x1="38" y1="61" x2="58" y2="61" stroke="#475569" stroke-width="3"/>
                    <text x="48" y="98" text-anchor="middle" fill="#94A3B8" font-size="7.5" font-weight="bold">TRIMPOT AZUL</text>
                    <text x="48" y="107" text-anchor="middle" fill="#94A3B8" font-size="7">(Ajuste Contraste)</text>

                    <!-- Chip CI PCF8574T -->
                    <rect x="95" y="38" width="95" height="46" rx="3" fill="#1E293B" stroke="#475569" stroke-width="1"/>
                    <text x="142" y="65" text-anchor="middle" fill="#F8FAFC" font-family="monospace" font-size="10" font-weight="900">PCF8574T</text>
                    <text x="142" y="76" text-anchor="middle" fill="#64748B" font-size="7">CHIP I2C</text>

                    <!-- Conector com os 4 pinos que saem para o aluno usar -->
                    <g transform="translate(20, 120)">
                        <rect x="0" y="0" width="175" height="36" rx="6" fill="#0F172A" stroke="#334155" stroke-width="1.5"/>
                        
                        <!-- Pino GND -->
                        <circle cx="25" cy="18" r="7" fill="#1E293B" stroke="#94A3B8" stroke-width="1.5"/>
                        <text x="25" y="31" text-anchor="middle" fill="#94A3B8" font-size="7" font-weight="900">GND</text>

                        <!-- Pino VCC -->
                        <circle cx="65" cy="18" r="7" fill="#7F1D1D" stroke="#EF4444" stroke-width="1.5"/>
                        <text x="65" y="31" text-anchor="middle" fill="#FCA5A5" font-size="7" font-weight="900">VCC</text>

                        <!-- Pino SDA -->
                        <circle cx="105" cy="18" r="7" fill="#7C2D12" stroke="#F97316" stroke-width="1.5"/>
                        <text x="105" y="31" text-anchor="middle" fill="#FDBA74" font-size="7" font-weight="900">SDA</text>

                        <!-- Pino SCL -->
                        <circle cx="145" cy="18" r="7" fill="#713F12" stroke="#EAB308" stroke-width="1.5"/>
                        <text x="145" y="31" text-anchor="middle" fill="#FDE047" font-size="7" font-weight="900">SCL</text>
                    </g>
                </g>

                <!-- Setas mostrando a redução mágica de 16 para 4 pinos -->
                <path d="M 545 35 C 570 35, 560 45, 570 55" fill="none" stroke="#FBBF24" stroke-width="2.5" marker-end="url(#a9-arrow)"/>
                <text x="670" y="240" text-anchor="middle" fill="#38BDF8" font-size="10" font-weight="900">
                    4 FIOS EM VEZ DE 16! UMA ECONOMIA INCRÍVEL!
                </text>
            </svg>
        </div>

        <!-- Tabela dos 4 Pinos I2C e Dica de Ouro do Trimpot -->
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:12px;margin-bottom:12px;">
            <div style="background:#1E293B;border-radius:10px;padding:12px;">
                <strong style="color:#38BDF8;font-size:0.95rem;display:block;margin-bottom:8px;">
                    📋 Os 4 Pinos da Mochila I2C:
                </strong>
                <ul style="margin:0;padding-left:18px;font-size:0.83rem;color:#E2E8F0;line-height:1.6;">
                    <li><strong>GND:</strong> Fio Preto ➔ Trilha Azul (-) da Protoboard</li>
                    <li><strong>VCC:</strong> Fio Vermelho ➔ Trilha Vermelha (+5V) da Protoboard</li>
                    <li><strong>SDA (Dados):</strong> Fio Laranja ➔ Pino <strong>A4</strong> do Arduino</li>
                    <li><strong>SCL (Relógio):</strong> Fio Amarelo ➔ Pino <strong>A5</strong> do Arduino</li>
                </ul>
            </div>

            <div style="background:rgba(234,179,8,0.1);border:1px solid #EAB308;border-radius:10px;padding:12px;">
                <strong style="color:#FDE047;font-size:0.95rem;display:flex;align-items:center;gap:6px;margin-bottom:6px;">
                    <span>🔧</span> Dica de Ouro: A Tela Acendeu mas Não Mostra Nada?
                </strong>
                <p style="margin:0;font-size:0.82rem;color:#FEF9C3;line-height:1.45;">
                    Se a luz azul de fundo do LCD acender, mas as letras não aparecerem (ou aparecerem apenas blocos brancos sólidos), <strong>não se desespere!</strong> Basta pegar uma chavinha de fenda de ponta pequena e <strong>girar suavemente o parafusinho do trimpot azul</strong> na parte de trás da plaquinha I2C até as letras ganharem contraste nítido!
                </p>
            </div>
        </div>
    </div>
    `;
}

function a9_renderLcdParallelExplanation() {
    return `
    <div>
        <div style="background:rgba(56,189,248,0.1);border:1px solid #0284C7;border-radius:12px;padding:14px;margin-bottom:16px;">
            <div style="display:flex;gap:12px;align-items:flex-start;">
                <span style="font-size:2rem;line-height:1;">🔌</span>
                <div style="font-size:0.88rem;color:#E0F2FE;line-height:1.5;">
                    <strong style="color:#38BDF8;font-size:1rem;display:block;margin-bottom:4px;">
                        Ligação Direta do LCD 1602 Sem I2C (Modo 4-Bits com os seus 8 Fios Coloridos!):
                    </strong>
                    Como você <b>não tem a placa I2C</b>, você liga a tela LCD 1602 de 16 pinos diretamente no Arduino usando a biblioteca padrão <code>LiquidCrystal.h</code>. Você possui exatamente <b>8 fios coloridos (sem repetir azul!)</b> e um <b>potenciômetro de 10kΩ</b> para o contraste.
                </div>
            </div>
        </div>

        <!-- Alerta Amigável sobre o Fio Azul Único -->
        <div style="background:rgba(59,130,246,0.15);border:1px solid #3B82F6;border-radius:10px;padding:10px 14px;margin-bottom:14px;display:flex;align-items:center;gap:10px;">
            <span style="font-size:1.5rem;">🎨</span>
            <span style="font-size:0.83rem;color:#BAE6FD;">
                <strong>Seu Kit de Cores para o LCD:</strong> 1 Preto, 1 Vermelho, 1 Amarelo, 1 Branco, 1 Verde, <strong>apenas 1 Azul</strong>, 1 Laranja e 1 Roxo. Abaixo cada cor está mapeada 1:1 para não haver nenhuma confusão!
            </span>
        </div>

        <!-- Tabela Completa dos 16 Pinos Físicos com os 8 Fios Coloridos do Aluno -->
        <div style="background:#0F172A;border:1px solid #334155;border-radius:12px;overflow:hidden;margin-bottom:16px;">
            <div style="background:#1E293B;padding:10px 16px;border-bottom:1px solid #334155;font-weight:900;color:#38BDF8;font-size:0.9rem;display:flex;justify-content:space-between;align-items:center;">
                <span>TABELA DE PINAGEM • SEUS 8 FIOS COLORIDOS NO LCD 1602</span>
                <span style="color:#FBBF24;font-size:0.75rem;">MODO 4-BITS (SEM I2C)</span>
            </div>
            <div style="max-height:420px;overflow-y:auto;">
                <table style="width:100%;border-collapse:collapse;font-size:0.8rem;text-align:left;color:#E2E8F0;">
                    <thead>
                        <tr style="background:#1E293B;color:#94A3B8;border-bottom:1px solid #334155;">
                            <th style="padding:8px 12px;">Pino</th>
                            <th style="padding:8px 12px;">Nome</th>
                            <th style="padding:8px 12px;">Função</th>
                            <th style="padding:8px 12px;">Seu Fio & Conexão</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr style="border-bottom:1px solid #1E293B;">
                            <td style="padding:8px 12px;font-weight:bold;color:#FBBF24;">1</td>
                            <td style="padding:8px 12px;font-weight:bold;color:#CBD5E1;">VSS</td>
                            <td style="padding:8px 12px;">GND (Terra 0V)</td>
                            <td style="padding:8px 12px;color:#CBD5E1;font-weight:bold;">⚫ Fio Preto ➔ Trilha Azul (-) GND da Protoboard</td>
                        </tr>
                        <tr style="border-bottom:1px solid #1E293B;background:rgba(255,255,255,0.02);">
                            <td style="padding:8px 12px;font-weight:bold;color:#FBBF24;">2</td>
                            <td style="padding:8px 12px;font-weight:bold;color:#FCA5A5;">VDD</td>
                            <td style="padding:8px 12px;">Energia (+5V)</td>
                            <td style="padding:8px 12px;color:#F87171;font-weight:bold;">🔴 Fio Vermelho ➔ Trilha Vermelha (+) 5V da Protoboard</td>
                        </tr>
                        <tr style="border-bottom:1px solid #1E293B;">
                            <td style="padding:8px 12px;font-weight:bold;color:#FBBF24;">3</td>
                            <td style="padding:8px 12px;font-weight:bold;color:#38BDF8;">V0</td>
                            <td style="padding:8px 12px;">Contraste Padrão</td>
                            <td style="padding:8px 12px;color:#38BDF8;font-weight:bold;">⚡ Ligado DIRETO na Trilha Azul (-) GND (Dispensa Potenciômetro!)</td>
                        </tr>
                        <tr style="border-bottom:1px solid #1E293B;background:rgba(255,255,255,0.02);">
                            <td style="padding:8px 12px;font-weight:bold;color:#FBBF24;">4</td>
                            <td style="padding:8px 12px;font-weight:bold;color:#FACC15;">RS</td>
                            <td style="padding:8px 12px;">Seletor de Registrador</td>
                            <td style="padding:8px 12px;color:#FACC15;font-weight:bold;">🟡 Fio Amarelo ➔ Arduino Pino Digital 12</td>
                        </tr>
                        <tr style="border-bottom:1px solid #1E293B;">
                            <td style="padding:8px 12px;font-weight:bold;color:#FBBF24;">5</td>
                            <td style="padding:8px 12px;font-weight:bold;color:#CBD5E1;">R/W</td>
                            <td style="padding:8px 12px;">Leitura / Escrita</td>
                            <td style="padding:8px 12px;color:#94A3B8;font-weight:bold;">🔌 Jumper curto ➔ Trilha Azul (-) GND</td>
                        </tr>
                        <tr style="border-bottom:1px solid #1E293B;background:rgba(255,255,255,0.02);">
                            <td style="padding:8px 12px;font-weight:bold;color:#FBBF24;">6</td>
                            <td style="padding:8px 12px;font-weight:bold;color:#F8FAFC;">E</td>
                            <td style="padding:8px 12px;">Enable (Habilita)</td>
                            <td style="padding:8px 12px;color:#F8FAFC;font-weight:bold;">⚪ Fio Branco ➔ Arduino Pino Digital 11</td>
                        </tr>
                        <tr style="border-bottom:1px solid #1E293B;">
                            <td style="padding:8px 12px;color:#64748B;">7 a 10</td>
                            <td style="padding:8px 12px;color:#64748B;">DB0 a DB3</td>
                            <td style="padding:8px 12px;color:#64748B;">Dados Baixos</td>
                            <td style="padding:8px 12px;color:#64748B;font-style:italic;">Deixar LIVRES (Modo 4-Bits dispensa esses 4 pinos)</td>
                        </tr>
                        <tr style="border-bottom:1px solid #1E293B;background:rgba(255,255,255,0.02);">
                            <td style="padding:8px 12px;font-weight:bold;color:#FBBF24;">11</td>
                            <td style="padding:8px 12px;font-weight:bold;color:#4ADE80;">DB4</td>
                            <td style="padding:8px 12px;">Bit de Dados 4</td>
                            <td style="padding:8px 12px;color:#4ADE80;font-weight:bold;">🟢 Fio Verde ➔ Arduino Pino Digital 10</td>
                        </tr>
                        <tr style="border-bottom:1px solid #1E293B;">
                            <td style="padding:8px 12px;font-weight:bold;color:#FBBF24;">12</td>
                            <td style="padding:8px 12px;font-weight:bold;color:#60A5FA;">DB5</td>
                            <td style="padding:8px 12px;">Bit de Dados 5</td>
                            <td style="padding:8px 12px;color:#60A5FA;font-weight:bold;">🔵 Fio Azul (SEU ÚNICO AZUL DO LCD!) ➔ Arduino Pino Digital 9</td>
                        </tr>
                        <tr style="border-bottom:1px solid #1E293B;background:rgba(255,255,255,0.02);">
                            <td style="padding:8px 12px;font-weight:bold;color:#FBBF24;">13</td>
                            <td style="padding:8px 12px;font-weight:bold;color:#FB923C;">DB6</td>
                            <td style="padding:8px 12px;">Bit de Dados 6</td>
                            <td style="padding:8px 12px;color:#FB923C;font-weight:bold;">🟠 Fio Laranja ➔ Arduino Pino Digital 8</td>
                        </tr>
                        <tr style="border-bottom:1px solid #1E293B;">
                            <td style="padding:8px 12px;font-weight:bold;color:#FBBF24;">14</td>
                            <td style="padding:8px 12px;font-weight:bold;color:#C084FC;">DB7</td>
                            <td style="padding:8px 12px;">Bit de Dados 7</td>
                            <td style="padding:8px 12px;color:#C084FC;font-weight:bold;">🟣 Fio Roxo ➔ Arduino Pino Digital 7</td>
                        </tr>
                        <tr style="border-bottom:1px solid #1E293B;background:rgba(255,255,255,0.02);">
                            <td style="padding:8px 12px;font-weight:bold;color:#FBBF24;">15</td>
                            <td style="padding:8px 12px;font-weight:bold;color:#FCA5A5;">A</td>
                            <td style="padding:8px 12px;">Anodo da Luz de Fundo</td>
                            <td style="padding:8px 12px;color:#EF4444;font-weight:bold;">🔌 Jumper curto ➔ Trilha Vermelha (+) 5V</td>
                        </tr>
                        <tr>
                            <td style="padding:8px 12px;font-weight:bold;color:#FBBF24;">16</td>
                            <td style="padding:8px 12px;font-weight:bold;color:#CBD5E1;">K</td>
                            <td style="padding:8px 12px;">Catodo da Luz de Fundo</td>
                            <td style="padding:8px 12px;color:#94A3B8;font-weight:bold;">🔌 Jumper curto ➔ Trilha Azul (-) GND</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- O Truque Maker: Contraste Padrão sem Potenciômetro -->
        <div style="background:#0F172A;border:1px dashed #10B981;border-radius:10px;padding:12px;margin-bottom:12px;">
            <strong style="color:#6EE7B7;font-size:0.9rem;display:flex;align-items:center;gap:6px;margin-bottom:6px;">
                <span>✨</span> O Truque Maker: Contraste Padrão Perfeito Sem Potenciômetro!
            </strong>
            <p style="margin:0;font-size:0.82rem;color:#E2E8F0;line-height:1.55;">
                <b>Você não precisa de potenciômetro!</b> Em displays LCD 1602 de 5V, quando você conecta o <b>Pino 3 (V0) direto no GND (0V / Terra)</b>, o circuito interno ativa o nível de contraste padrão de fábrica. As letras aparecem 100% nítidas e pretas com fundo verde brilhante!
                <br>• <b>Economiza espaço e peças:</b> Menos um componente complicado de 3 pernas na protoboard.
                <br>• <b>Zero parafusos:</b> Sem precisar girar chave de fenda para ajustar.
                <br>• <b>Muito mais fácil para iniciantes:</b> A montagem fica mais rápida, limpa e sem risco de mau contato!
            </p>
        </div>
    </div>
    `;
}

function a9_renderLcdCodeExplanation() {
    return `
    <div>
        <div style="background:rgba(16,185,129,0.1);border:1px solid #10B981;border-radius:12px;padding:14px;margin-bottom:16px;">
            <strong style="color:#6EE7B7;font-size:0.95rem;display:block;margin-bottom:4px;">
                💻 Código C++ Oficial RoboCore (Biblioteca Nativa LiquidCrystal.h)
            </strong>
            <p style="margin:0;font-size:0.83rem;color:#D1FAE5;line-height:1.5;">
                Observe a ordem exata dos parâmetros: <code>LiquidCrystal(RS, EN, D4, D5, D6, D7)</code> conectando nos pinos <b>12, 11, 10, 9, 8, 7</b> do Arduino:
            </p>
        </div>

        <div style="background:#0F172A;border:1px solid #334155;border-radius:12px;padding:14px;position:relative;">
            <button onclick="navigator.clipboard.writeText(document.getElementById('a9-code-parallel-snippet').innerText);if(typeof playSound==='function')playSound('coin');alert('Código do Master Kit copiado!');" style="position:absolute;top:10px;right:10px;background:#334155;border:1px solid #64748B;color:white;padding:5px 12px;border-radius:6px;font-size:0.75rem;cursor:pointer;font-weight:bold;">
                📋 Copiar Código Master Kit
            </button>
            <pre id="a9-code-parallel-snippet" style="margin:0;font-family:monospace;font-size:0.82rem;color:#E2E8F0;line-height:1.55;overflow-x:auto;">
<span style="color:#F472B6;">#include</span> <span style="color:#FDE047;">&lt;LiquidCrystal.h&gt;</span>

<span style="color:#64748B;">// Pinagem Oficial do Master Kit RoboCore:</span>
<span style="color:#64748B;">// RS = 12, E = 11, DB4 = 10, DB5 = 9, DB6 = 8, DB7 = 7</span>
<span style="color:#38BDF8;">const</span> <span style="color:#38BDF8;">int</span> RS = 12, EN = 11, D4 = 10, D5 = 9, D6 = 8, D7 = 7;
<span style="color:#4ADE80;">LiquidCrystal</span> <span style="color:#FBBF24;">lcd</span>(RS, EN, D4, D5, D6, D7);

<span style="color:#38BDF8;">void</span> <span style="color:#FBBF24;">setup</span>() {
  <span style="color:#64748B;">// Inicializa o LCD com 16 colunas e 2 linhas (Controlador GDM1602K)</span>
  lcd.<span style="color:#38BDF8;">begin</span>(16, 2);
  
  <span style="color:#64748B;">// Linha 0 (superior): Coluna 0, Linha 0</span>
  lcd.<span style="color:#38BDF8;">setCursor</span>(0, 0);
  lcd.<span style="color:#38BDF8;">print</span>(<span style="color:#FDE047;">"GARAGEM MAKER!"</span>);
  
  <span style="color:#64748B;">// Linha 1 (inferior): Coluna 0, Linha 1</span>
  lcd.<span style="color:#38BDF8;">setCursor</span>(0, 1);
  lcd.<span style="color:#38BDF8;">print</span>(<span style="color:#FDE047;">"ROBOCORE KIT OK"</span>);
}

<span style="color:#38BDF8;">void</span> <span style="color:#FBBF24;">loop</span>() {
  <span style="color:#64748B;">// Aqui você pode atualizar as leituras do sensor HC-SR04 e do LMV321!</span>
}
            </pre>
        </div>
    </div>
    `;
}

function a9_renderLcd1602Inspector() {
    return `<div id="a9-lcd-inspector-mount">${a9_renderLcd1602InspectorContent()}</div>`;
}

function a9_openLcd1602Modal() {
    if (typeof playSound === 'function') playSound('click');
    let modal = document.getElementById('a9-lcd-1602-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'a9-lcd-1602-modal';
        modal.style.cssText = 'position:fixed;top:0;left:0;width:100vw;height:100vh;background:rgba(15,23,42,0.92);backdrop-filter:blur(6px);z-index:99999;display:flex;align-items:center;justify-content:center;padding:16px;';
        document.body.appendChild(modal);
    }
    modal.innerHTML = `
        <div style="background:#0F172A;border:2px solid #06B6D4;border-radius:20px;max-width:920px;width:96%;max-height:92vh;overflow-y:auto;padding:20px;box-shadow:0 20px 60px rgba(0,0,0,0.85);position:relative;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
                <h3 style="font-family:'Fredoka One',cursive;color:white;margin:0;font-size:1.35rem;display:flex;align-items:center;gap:8px;">
                    <span>📟</span> Raio-X do Display LCD 1602 (16 Pinos & I2C)
                </h3>
                <button onclick="a9_closeLcd1602Modal()" style="background:#1E293B;border:1px solid #475569;color:white;width:34px;height:34px;border-radius:50%;font-size:1.2rem;cursor:pointer;display:flex;align-items:center;justify-content:center;">&times;</button>
            </div>
            ${a9_renderLcd1602Inspector()}
        </div>
    `;
    modal.style.display = 'flex';
}

function a9_closeLcd1602Modal() {
    const modal = document.getElementById('a9-lcd-1602-modal');
    if (modal) modal.style.display = 'none';
}

// ================= AÇÕES DA ARDUINO IDE (ESTILO AULA 8) =================
function a9_copySketch() {
    navigator.clipboard.writeText(A9_SKETCH_INO).then(() => {
        if (typeof playSound === 'function') playSound('coin');
        const msg = document.getElementById('a9-ide-msg-text');
        const consoleEl = document.getElementById('a9-ide-console');
        if (msg) {
            msg.innerHTML = '<span style="color:#A7F3D0;">📋 Código .INO copiado com sucesso! Cole na sua Arduino IDE!</span>';
            setTimeout(() => {
                msg.innerHTML = '✔ Compilação concluída: 4.820 bytes (14% da memória flash) | 0 erros';
            }, 3500);
        }
        if (consoleEl) {
            consoleEl.innerText += `\n[CLIPBOARD] Código completo da Garagem Inteligente (.INO) copiado com todas as linhas comentadas!`;
            consoleEl.scrollTop = consoleEl.scrollHeight;
        }
    }).catch(() => {
        alert('Código pronto para copiar:\n\n' + A9_SKETCH_INO);
    });
}

function a9_verifySketch() {
    if (typeof playSound === 'function') playSound('success');
    const msg = document.getElementById('a9-ide-msg-text');
    const consoleEl = document.getElementById('a9-ide-console');
    
    if (msg) {
        msg.innerHTML = '<span style="color:#6EE7B7;">✔ Verificação com sucesso! O sketch compila sem erros ou avisos.</span>';
    }
    if (consoleEl) {
        consoleEl.innerText = `O sketch usa 4.820 bytes (14%) de espaço de armazenamento para programas. O máximo são 32.256 bytes.
Variáveis globais usam 312 bytes (15%) de memória dinâmica, deixando 1.736 bytes para variáveis locais. O máximo são 2.048 bytes.
--------------------------------------------------------------------------------
Compilador AVR-GCC finalizado com status 0 (sucesso).
Código 100% pronto para gravação no chip ATmega328P da placa Arduino UNO!`;
        consoleEl.scrollTop = consoleEl.scrollHeight;
    }
}

function a9_uploadSketch() {
    if (typeof playSound === 'function') playSound('coin');
    const msg = document.getElementById('a9-ide-msg-text');
    const consoleEl = document.getElementById('a9-ide-console');
    const tx = document.getElementById('a9-ide-tx-led');
    const rx = document.getElementById('a9-ide-rx-led');
    const svgTx = document.getElementById('a9-led-tx');
    const svgRx = document.getElementById('a9-led-rx');

    if (msg) msg.innerHTML = '<span style="color:#FDE68A;">⚡ Gravando via USB na porta COM3 (avrdude)...</span>';
    if (consoleEl) {
        consoleEl.innerText = `Conectando ao programador AVRISP mkII na porta COM3...
avrdude: AVR device initialized and ready to accept instructions
avrdude: Device signature = 0x1e950f (ATmega328P)
avrdude: writing flash (4.820 bytes): [################################] 100%
avrdude: 4.820 bytes of flash verified`;
    }

    let count = 0;
    const interval = setInterval(() => {
        count++;
        const state = count % 2 === 0;
        if (tx) tx.style.background = state ? '#F59E0B' : '#334155';
        if (rx) rx.style.background = !state ? '#38BDF8' : '#334155';
        if (svgTx) svgTx.setAttribute('fill', state ? '#F59E0B' : '#1E293B');
        if (svgRx) svgRx.setAttribute('fill', !state ? '#F59E0B' : '#1E293B');

        if (count >= 8) {
            clearInterval(interval);
            if (tx) tx.style.background = '#334155';
            if (rx) rx.style.background = '#334155';
            if (svgTx) svgTx.setAttribute('fill', '#F59E0B');
            if (svgRx) svgRx.setAttribute('fill', '#F59E0B');

            if (msg) msg.innerHTML = '<span style="color:#6EE7B7;">🎉 Carregamento Concluído! A Garagem Inteligente está rodando no Arduino!</span>';
            if (consoleEl) {
                consoleEl.innerText += `\navrdude done. Thank you.\n\n[SUCESSO] O programa começou a rodar imediatamente na placa Arduino UNO!`;
                consoleEl.scrollTop = consoleEl.scrollHeight;
            }
            if (typeof triggerConfetti === 'function') triggerConfetti(2500);
            if (typeof playSound === 'function') playSound('success');
        }
    }, 150);
}

function a9_openSerialMonitor() {
    if (typeof playSound === 'function') playSound('click');
    let modal = document.getElementById('a9-serial-monitor-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'a9-serial-monitor-modal';
        modal.style.cssText = 'position:fixed;top:0;left:0;width:100vw;height:100vh;background:rgba(15,23,42,0.85);backdrop-filter:blur(4px);z-index:99999;display:flex;align-items:center;justify-content:center;padding:16px;';
        document.body.appendChild(modal);
    }

    modal.innerHTML = `
        <div style="background:#FFFFFF;color:#1E293B;border:2px solid #00979D;border-radius:12px;box-shadow:0 20px 60px rgba(0,0,0,0.75);width:95%;max-width:680px;overflow:hidden;font-family:'Segoe UI',Tahoma,sans-serif;animation:ardPopUp 0.25s ease-out;">
            <div style="background:#006468;color:white;padding:8px 14px;font-size:0.85rem;font-weight:700;display:flex;align-items:center;justify-content:space-between;">
                <span>COM3 (Arduino Uno) • Monitor Serial a 9600 baud</span>
                <button onclick="a9_closeSerialMonitor()" style="background:transparent;border:none;color:white;font-size:1.3rem;cursor:pointer;line-height:1;">&times;</button>
            </div>
            
            <div style="background:#F8FAFC;padding:8px 12px;display:flex;gap:8px;border-bottom:1px solid #E2E8F0;">
                <input id="a9-serial-input" type="text" placeholder="Digite um comando (ex: PALMA, VAGA, STATUS)..." style="flex:1;padding:6px 10px;border:1px solid #CBD5E1;border-radius:4px;font-family:'Consolas',monospace;font-size:0.85rem;outline:none;" onkeydown="if(event.key==='Enter') a9_sendSerialCommand();">
                <button onclick="a9_sendSerialCommand()" style="background:#00979D;color:white;border:none;border-radius:4px;padding:6px 16px;font-weight:700;font-size:0.82rem;cursor:pointer;">
                    Enviar
                </button>
            </div>

            <div id="a9-serial-body" style="background:#FFFFFF;color:#0F172A;padding:12px 14px;height:240px;overflow-y:auto;font-family:'Consolas','Courier New',monospace;font-size:0.85rem;line-height:1.5;white-space:pre-wrap;">--- COM3 (Arduino UNO) Aberta a 9600 baud ---
[SETUP] Garagem Inteligente inicializada com sucesso!
[RADAR] Pino 9 disparou som ➔ Eco lido no Pino 8: ${a9_sonarDistance * 58} µs
[RADAR] Distância calculada: ${a9_sonarDistance} cm (${a9_sonarDistance < 15 ? 'ALERTA: MUITO PERTO !PARE!' : 'VAGA LIVRE OK'})
[LUZ] Pino 13 (Lâmpada do teto): ${a9_clapLightOn ? 'LIGADA (5V - HIGH)' : 'DESLIGADA (0V - LOW)'}
[I2C] Mensagem enviada para o LCD: "${a9_clapLightOn ? 'Luz: ACESA' : 'Luz: APAGADA'}" | "Vaga: ${a9_sonarDistance}cm"
</div>

            <div style="background:#F1F5F9;border-top:1px solid #E2E8F0;padding:6px 14px;display:flex;align-items:center;justify-content:space-between;font-size:0.78rem;color:#475569;">
                <span>Autoscroll ativo • Caractere de fim de linha: Nova Linha (NL)</span>
                <span style="color:#00979D;font-weight:bold;">9600 baud</span>
            </div>
        </div>
    `;
    modal.style.display = 'flex';
}

function a9_closeSerialMonitor() {
    const modal = document.getElementById('a9-serial-monitor-modal');
    if (modal) modal.style.display = 'none';
}

function a9_sendSerialCommand() {
    const input = document.getElementById('a9-serial-input');
    const body = document.getElementById('a9-serial-body');
    if (!input || !body) return;

    const cmd = input.value.trim();
    if (!cmd) return;

    if (typeof playSound === 'function') playSound('click');
    const upper = cmd.toUpperCase();
    let reply = '';

    if (upper.includes('PALMA') || upper.includes('LUZ')) {
        a9_clapLightOn = !a9_clapLightOn;
        reply = `> Comando: ${cmd}\n[SERIAL] Simulando palma no pino 2... 👏\n[LUZ] Lâmpada do teto invertida para: ${a9_clapLightOn ? 'ACESA (HIGH)' : 'APAGADA (LOW)'}`;
        const mount = document.getElementById('a9-circuit-mount');
        if (mount) mount.innerHTML = a9_renderCircuitSvg(a9_currentStep);
    } else if (upper.includes('VAGA') || upper.includes('DISTANCIA')) {
        reply = `> Comando: ${cmd}\n[SONAR] Telemetria: Distância atual da vaga = ${a9_sonarDistance} cm (${a9_sonarDistance < 15 ? '!PARE!' : 'OK'})`;
    } else {
        reply = `> Comando: ${cmd}\n[SERIAL] Resposta do Arduino: Comando recebido na COM3. Sistema Garagem Maker OK!`;
    }

    body.innerText += `\n${reply}`;
    body.scrollTop = body.scrollHeight;
    input.value = '';
}

function a9_openSerialPlotter() {
    if (typeof playSound === 'function') playSound('click');
    alert('📈 Plotter Serial Arduino (COM3):\n\nO Plotter Serial gera gráficos de ondas em tempo real dos valores de distância do sensor ultrassônico (' + a9_sonarDistance + ' cm) e detecção de som do microfone!\n\nNo Arduino IDE oficial: Pressione Ctrl+Shift+L para visualizar.');
}

function a9_autoFormatCode() {
    if (typeof playSound === 'function') playSound('coin');
    const msg = document.getElementById('a9-ide-msg-text');
    if (msg) {
        msg.innerText = '✨ Auto-Formatação concluída! O código C++ está perfeitamente alinhado e indentado.';
        setTimeout(() => {
            msg.innerText = '✔ Compilação concluída: 4.820 bytes (14% da memória flash) | 0 erros';
        }, 3000);
    }
}

function a9_escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// ================= EXPORTAÇÕES GLOBAIS =================
window.loadAula9 = loadAula9;
window.a9_goToStep = a9_goToStep;
window.a9_nextStep = a9_nextStep;
window.a9_prevStep = a9_prevStep;
window.a9_resetCircuit = a9_resetCircuit;
window.a9_testPowerRail = a9_testPowerRail;
window.a9_onSonarSlider = a9_onSonarSlider;
window.a9_triggerClapAction = a9_triggerClapAction;
window.a9_sendLcdPreset = a9_sendLcdPreset;
window.a9_onSimCarSlider = a9_onSimCarSlider;
window.a9_triggerSimClap = a9_triggerSimClap;
window.a9_showTooltip = a9_showTooltip;
window.a9_closeTooltip = a9_closeTooltip;
window.a9_hoverTooltip = a9_hoverTooltip;
window.a9_moveTooltip = a9_moveTooltip;
window.a9_hideHoverTooltip = a9_hideHoverTooltip;
window.a9_toggleHcSr04Video = a9_toggleHcSr04Video;
window.a9_playHcSr04Video = a9_playHcSr04Video;
window.a9_pauseHcSr04Video = a9_pauseHcSr04Video;
window.a9_resetHcSr04Video = a9_resetHcSr04Video;
window.a9_setHcSr04Height = a9_setHcSr04Height;
window.a9_selectHcSr04Pin = a9_selectHcSr04Pin;
window.a9_triggerSonarWaves = a9_triggerSonarWaves;
window.a9_openHcSr04Modal = a9_openHcSr04Modal;
window.a9_closeHcSr04Modal = a9_closeHcSr04Modal;
window.a9_copySketch = a9_copySketch;
window.a9_verifySketch = a9_verifySketch;
window.a9_uploadSketch = a9_uploadSketch;
window.a9_openSerialMonitor = a9_openSerialMonitor;
window.a9_closeSerialMonitor = a9_closeSerialMonitor;
window.a9_sendSerialCommand = a9_sendSerialCommand;
window.a9_openSerialPlotter = a9_openSerialPlotter;
window.a9_autoFormatCode = a9_autoFormatCode;
window.a9_toggleExpand = a9_toggleExpand;
window.a9_renderKy038Inspector = a9_renderKy038Inspector;
window.a9_selectKy038Pin = a9_selectKy038Pin;
window.a9_setKy038Sensitivity = a9_setKy038Sensitivity;
window.a9_triggerKy038Clap = a9_triggerKy038Clap;
window.a9_openKy038Modal = a9_openKy038Modal;
window.a9_closeKy038Modal = a9_closeKy038Modal;
window.a9_toggleInspectLed = a9_toggleInspectLed;
window.a9_renderLedResistorInspector = a9_renderLedResistorInspector;
window.a9_openLedResistorModal = a9_openLedResistorModal;
window.a9_closeLedResistorModal = a9_closeLedResistorModal;
window.a9_setLcdViewMode = a9_setLcdViewMode;
window.a9_renderLcd1602Inspector = a9_renderLcd1602Inspector;
window.a9_renderLcdScienceExplanation = a9_renderLcdScienceExplanation;
window.a9_openLcd1602Modal = a9_openLcd1602Modal;
window.a9_closeLcd1602Modal = a9_closeLcd1602Modal;
window.a9_renderLmv321Inspector = a9_renderLmv321Inspector;
window.a9_openLmv321Modal = a9_openKy038Modal;
window.a9_closeLmv321Modal = a9_closeKy038Modal;


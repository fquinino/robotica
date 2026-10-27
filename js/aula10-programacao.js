/* ==========================================================================
   AULA 10 — PRÁTICA: PROGRAMAÇÃO C++ DO SEMÁFORO NO ARDUINO IDE & CERTIFICADO
   ========================================================================== */

let a10_isCompiling = false;
let a10_isUploading = false;
let a10_isUploaded = false;
let a10_trafficInterval = null;
let a10_cycleStep = 0; // 0=Green, 1=Yellow, 2=Red
let a10_secondsLeft = 5;

const a10_sourceCode = `/*
 * PROJETO: Semáforo Digital Inteligente
 * CURSO: Criadores de Código — Laboratório Maker
 * HARDWARE: Arduino UNO + Protoboard + 3 LEDs + 3 Resistores de 220 Ohms
 */

// 1. DEFINIÇÃO DOS PINOS DIGITAIS
const int pinoVermelho = 13;
const int pinoAmarelo  = 12;
const int pinoVerde    = 11;

// 2. CONFIGURAÇÃO INICIAL (Executa apenas uma vez ao ligar a placa)
void setup() {
  // Inicializa a comunicação serial para enviar mensagens ao computador
  Serial.begin(9600);
  Serial.println("🚦 Sistema do Semáforo Iniciado com Sucesso!");

  // Configura os 3 pinos digitais como SAÍDAS (OUTPUT) de 5V
  pinMode(pinoVermelho, OUTPUT);
  pinMode(pinoAmarelo,  OUTPUT);
  pinMode(pinoVerde,    OUTPUT);
}

// 3. LAÇO PRINCIPAL (Repete continuamente sem parar)
void loop() {
  // 🟢 FASE 1: SINAL VERDE — TRÁFEGO LIBERADO (5 segundos)
  Serial.println("🟢 [VERDE]: Motoristas podem seguir!");
  digitalWrite(pinoVerde, HIGH);     // Liga LED Verde (5V)
  digitalWrite(pinoAmarelo, LOW);    // Garante Amarelo desligado
  digitalWrite(pinoVermelho, LOW);   // Garante Vermelho desligado
  delay(5000);                       // Aguarda 5.000 milissegundos (5s)

  // 🟡 FASE 2: SINAL AMARELO — ATENÇÃO / TRANSIÇÃO (2 segundos)
  Serial.println("🟡 [AMARELO]: Atenção! O sinal vai fechar...");
  digitalWrite(pinoVerde, LOW);      // Desliga LED Verde
  digitalWrite(pinoAmarelo, HIGH);   // Liga LED Amarelo (5V)
  digitalWrite(pinoVermelho, LOW);   // Mantém Vermelho desligado
  delay(2000);                       // Aguarda 2.000 milissegundos (2s)

  // 🔴 FASE 3: SINAL VERMELHO — PARADA OBRIGATÓRIA (5 segundos)
  Serial.println("🔴 [VERMELHO]: Pare imediatamente!");
  digitalWrite(pinoVerde, LOW);      // Mantém Verde desligado
  digitalWrite(pinoAmarelo, LOW);    // Desliga Amarelo
  digitalWrite(pinoVermelho, HIGH);  // Liga LED Vermelho (5V)
  delay(5000);                       // Aguarda 5.000 milissegundos (5s)
}
`;

function loadAula10() {
    const container = document.getElementById('aula10-container');
    if (!container) return;

    const isCompleted = localStorage.getItem('aula10_completed') === 'true';

    container.innerHTML = `
        <div id="aula10-loaded" class="a10-wrap">
            <style>
                .a10-wrap {
                    color: #CBD5E1;
                    font-family: 'Nunito', sans-serif;
                    max-width: 1060px;
                    margin: 0 auto;
                }
                .a10-hero {
                    background: linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(15, 23, 42, 0.95));
                    border: 2px solid #10B981;
                    border-radius: 24px;
                    padding: 24px 26px;
                    margin-bottom: 24px;
                    box-shadow: 0 10px 30px rgba(16, 185, 129, 0.15);
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    flex-wrap: wrap;
                    gap: 16px;
                }
                .a10-hero-title h2 {
                    font-family: 'Fredoka One', cursive;
                    font-size: 1.85rem;
                    color: white;
                    margin: 0 0 6px;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }
                .a10-hero-title p {
                    color: #A7F3D0;
                    margin: 0;
                    font-size: 0.95rem;
                    font-weight: 700;
                }
                .a10-cert-badge {
                    background: rgba(245, 158, 11, 0.15);
                    border: 1px solid #F59E0B;
                    color: #FBBF24;
                    padding: 8px 18px;
                    border-radius: 14px;
                    font-weight: 800;
                    font-size: 0.9rem;
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                }

                /* Container da IDE Arduino */
                .a10-ide-window {
                    background: #18232c;
                    border: 2px solid #00979d;
                    border-radius: 20px;
                    overflow: hidden;
                    box-shadow: 0 16px 40px rgba(0, 0, 0, 0.6);
                    margin-bottom: 26px;
                }
                .a10-ide-toolbar {
                    background: #00797f;
                    padding: 10px 18px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    flex-wrap: wrap;
                    gap: 12px;
                }
                .a10-ide-btns {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
                .a10-ide-btn {
                    background: #005f63;
                    border: 1px solid #00979d;
                    color: white;
                    padding: 8px 14px;
                    border-radius: 10px;
                    font-weight: 800;
                    font-size: 0.86rem;
                    cursor: pointer;
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    transition: all 0.2s;
                }
                .a10-ide-btn:hover {
                    background: #00878d;
                    transform: translateY(-1px);
                }
                .a10-ide-btn.upload {
                    background: #10B981;
                    border-color: #34D399;
                    box-shadow: 0 0 12px rgba(16, 185, 129, 0.4);
                }
                .a10-ide-btn.upload:hover {
                    background: #059669;
                }
                .a10-tab-title {
                    color: #E0F2FE;
                    font-family: 'Fira Code', monospace;
                    font-size: 0.88rem;
                    font-weight: 700;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                }

                /* Editor de Código */
                .a10-code-body {
                    display: flex;
                    background: #0F172A;
                    font-family: 'Fira Code', monospace;
                    font-size: 0.86rem;
                    line-height: 1.6;
                    max-height: 380px;
                    overflow-y: auto;
                }
                .a10-code-numbers {
                    background: #090D16;
                    color: #475569;
                    padding: 16px 12px;
                    text-align: right;
                    user-select: none;
                    border-right: 1px solid #1E293B;
                }
                .a10-code-content {
                    padding: 16px 18px;
                    color: #E2E8F0;
                    white-space: pre;
                    flex: 1;
                    overflow-x: auto;
                }

                /* Console da IDE */
                .a10-ide-console {
                    background: #0a0f18;
                    border-top: 1px solid #1E293B;
                    padding: 12px 18px;
                    font-family: 'Fira Code', monospace;
                    font-size: 0.82rem;
                    color: #38BDF8;
                    min-height: 70px;
                    max-height: 140px;
                    overflow-y: auto;
                }

                /* Simulador de Hardware e Semáforo Ativo */
                .a10-sim-grid {
                    display: grid;
                    grid-template-columns: 1.1fr 1fr;
                    gap: 20px;
                    margin-bottom: 24px;
                }
                @media (max-width: 820px) {
                    .a10-sim-grid { grid-template-columns: 1fr; }
                }

                .a10-sim-card {
                    background: #1E293B;
                    border: 2px solid #334155;
                    border-radius: 20px;
                    padding: 22px;
                }

                /* Caixa do Semáforo Físico */
                .a10-traffic-post {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 30px;
                    margin: 15px 0;
                }
                .a10-traffic-housing {
                    background: #0B0F19;
                    border: 3px solid #334155;
                    border-radius: 40px;
                    padding: 16px 14px;
                    display: flex;
                    flex-direction: column;
                    gap: 14px;
                    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.7);
                }
                .a10-sim-light {
                    width: 52px;
                    height: 52px;
                    border-radius: 50%;
                    background: #1E293B;
                    border: 2px solid #334155;
                    transition: all 0.25s ease;
                }
                .a10-sim-light.red.on {
                    background: radial-gradient(circle at 35% 35%, #FCA5A5, #EF4444);
                    box-shadow: 0 0 25px #EF4444, 0 0 50px rgba(239, 68, 68, 0.7);
                    border-color: #FECACA;
                }
                .a10-sim-light.yellow.on {
                    background: radial-gradient(circle at 35% 35%, #FEF08A, #F59E0B);
                    box-shadow: 0 0 25px #F59E0B, 0 0 50px rgba(245, 158, 11, 0.7);
                    border-color: #FEF9C3;
                }
                .a10-sim-light.green.on {
                    background: radial-gradient(circle at 35% 35%, #A7F3D0, #10B981);
                    box-shadow: 0 0 25px #10B981, 0 0 50px rgba(16, 185, 129, 0.7);
                    border-color: #D1FAE5;
                }

                .a10-status-badge {
                    background: #0F172A;
                    border: 1px solid #334155;
                    border-radius: 14px;
                    padding: 12px 16px;
                    text-align: center;
                }
                .a10-countdown-number {
                    font-family: 'Fredoka One', cursive;
                    font-size: 2.4rem;
                    color: #FBBF24;
                    line-height: 1;
                    margin: 4px 0;
                }

                /* Monitor Serial */
                .a10-serial-box {
                    background: #0B0F19;
                    border: 1px solid #1E293B;
                    border-radius: 14px;
                    height: 190px;
                    padding: 12px;
                    font-family: 'Fira Code', monospace;
                    font-size: 0.8rem;
                    color: #34D399;
                    overflow-y: auto;
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                }

                /* Conquista Final e Certificado */
                .a10-finish-card {
                    background: linear-gradient(135deg, rgba(30, 41, 59, 0.9), rgba(15, 23, 42, 0.9));
                    border: 2px solid #F59E0B;
                    border-radius: 24px;
                    padding: 28px;
                    text-align: center;
                    box-shadow: 0 10px 40px rgba(245, 158, 11, 0.2);
                }
                .a10-cert-btn {
                    background: linear-gradient(135deg, #F59E0B, #D97706);
                    border: none;
                    color: #0F172A;
                    font-weight: 900;
                    padding: 16px 36px;
                    border-radius: 18px;
                    font-size: 1.2rem;
                    cursor: pointer;
                    display: inline-flex;
                    align-items: center;
                    gap: 10px;
                    box-shadow: 0 6px 25px rgba(245, 158, 11, 0.4);
                    transition: transform 0.2s ease;
                }
                .a10-cert-btn:hover {
                    transform: scale(1.04);
                }
            </style>

            <div class="a10-hero">
                <div class="a10-hero-title">
                    <h2><span style="color:#10B981;">💻</span> Aula 10: Programação C++ & Upload</h2>
                    <p>Compilação e Envio do Código C++ para o Arduino UNO + Emissão do Certificado Maker</p>
                </div>
                <div class="a10-cert-badge">
                    <i class="fa-solid fa-award"></i>
                    <span>Conclusão Oficial da Trilha</span>
                </div>
            </div>

            <!-- SIMULADOR DA IDE ARDUINO -->
            <div class="a10-ide-window">
                <div class="a10-ide-toolbar">
                    <div class="a10-tab-title">
                        <i class="fa-solid fa-code" style="color:#38BDF8;"></i> semaforo_maker.ino | Arduino UNO no COM3
                    </div>
                    <div class="a10-ide-btns">
                        <button class="a10-ide-btn" onclick="a10_verifyCode()">
                            <i class="fa-solid fa-check" style="color:#34D399;"></i> Verificar
                        </button>
                        <button class="a10-ide-btn upload" onclick="a10_uploadCode()">
                            <i class="fa-solid fa-arrow-right"></i> Carregar (Upload)
                        </button>
                        <button class="a10-ide-btn" onclick="a10_copyCode()">
                            <i class="fa-regular fa-copy"></i> Copiar Código
                        </button>
                        <button class="a10-ide-btn" onclick="a10_resetSimulation()">
                            <i class="fa-solid fa-rotate-left"></i> Reiniciar
                        </button>
                    </div>
                </div>

                <div class="a10-code-body">
                    <div class="a10-code-numbers" id="a10-code-lines"></div>
                    <div class="a10-code-content" id="a10-code-text"></div>
                </div>

                <div class="a10-ide-console" id="a10-ide-log">
                    [IDE] Pronto. Clique em "Verificar" (✔) para compilar ou "Carregar" (➔) para gravar na placa.
                </div>
            </div>

            <!-- HARDWARE EM TEMPO REAL & MONITOR SERIAL -->
            <div class="a10-sim-grid">
                <!-- Painel do Semáforo Ativo -->
                <div class="a10-sim-card">
                    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
                        <h3 style="color:white;font-family:'Fredoka One';margin:0;font-size:1.2rem;">
                            <i class="fa-solid fa-traffic-light" style="color:#F59E0B;"></i> Semáforo em Execução
                        </h3>
                        <span id="a10-state-label" style="background:#0F172A;border:1px solid #334155;color:#94A3B8;padding:4px 10px;border-radius:10px;font-size:0.8rem;font-weight:800;">Aguardando Upload</span>
                    </div>

                    <div class="a10-traffic-post">
                        <div class="a10-traffic-housing">
                            <div class="a10-sim-light red" id="a10-light-red"></div>
                            <div class="a10-sim-light yellow" id="a10-light-yellow"></div>
                            <div class="a10-sim-light green" id="a10-light-green"></div>
                        </div>

                        <div class="a10-status-badge">
                            <div style="font-size:0.8rem;color:#94A3B8;font-weight:800;">TEMPO RESTANTE:</div>
                            <div class="a10-countdown-number" id="a10-countdown">--</div>
                            <div style="font-size:0.75rem;color:#64748B;" id="a10-pin-active">Pinos LOW</div>
                        </div>
                    </div>
                </div>

                <!-- Monitor Serial -->
                <div class="a10-sim-card">
                    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
                        <h3 style="color:white;font-family:'Fredoka One';margin:0;font-size:1.2rem;">
                            <i class="fa-solid fa-terminal" style="color:#38BDF8;"></i> Monitor Serial (9600 baud)
                        </h3>
                        <button onclick="a10_clearSerial()" style="background:#0F172A;border:1px solid #334155;color:#94A3B8;padding:4px 10px;border-radius:8px;font-size:0.75rem;cursor:pointer;font-weight:800;">Limpar</button>
                    </div>

                    <div class="a10-serial-box" id="a10-serial-output">
                        <div style="color:#64748B;">// As mensagens enviadas via Serial.println() aparecerão aqui...</div>
                    </div>
                </div>
            </div>

            <!-- CARD DE CERTIFICADO E FINALIZAÇÃO -->
            <div class="a10-finish-card">
                <i class="fa-solid fa-graduation-cap" style="font-size:3.5rem;color:#F59E0B;margin-bottom:10px;"></i>
                <h3 style="font-family:'Fredoka One';color:white;font-size:2rem;margin:0 0 8px;">Parabéns, Futuro Engenheiro Maker! 🎓</h3>
                <p style="color:#CBD5E1;font-size:1.05rem;max-width:700px;margin:0 auto 20px;line-height:1.6;">
                    Você completou toda a jornada educacional de lógica de programação, algoritmos, loops, variáveis, circuitos elétricos, protoboard e Arduino!
                </p>

                <button class="a10-cert-btn" onclick="a10_claimCertificate()">
                    <i class="fa-solid fa-award"></i> Emitir Meu Certificado Oficial Maker
                </button>
                <div style="margin-top:12px;font-size:0.85rem;color:#94A3B8;">
                    ⭐ Você pode digitar seu nome completo e salvar ou imprimir seu certificado em PDF!
                </div>
            </div>
        </div>
    `;

    // Renderiza o código com numeração de linhas
    const lines = a10_sourceCode.trim().split('\n');
    const numbersEl = document.getElementById('a10-code-lines');
    const textEl = document.getElementById('a10-code-text');
    if (numbersEl) {
        numbersEl.innerHTML = lines.map((_, i) => i + 1).join('<br>');
    }
    if (textEl) {
        textEl.innerText = a10_sourceCode;
    }

    if (isCompleted) {
        // Se já havia completado, inicia em estado demonstrativo
        a10_uploadCode(true);
    }
}

function a10_logConsole(msg, isSuccess = true) {
    const logEl = document.getElementById('a10-ide-log');
    if (!logEl) return;
    const time = new Date().toLocaleTimeString();
    logEl.innerHTML = `<span style="color:#94A3B8;">[${time}]</span> ${msg}`;
}

function a10_appendSerial(msg) {
    const serialEl = document.getElementById('a10-serial-output');
    if (!serialEl) return;
    const time = new Date().toLocaleTimeString();
    const line = document.createElement('div');
    line.innerHTML = `<span style="color:#64748B;">[${time}]</span> ${msg}`;
    serialEl.appendChild(line);
    serialEl.scrollTop = serialEl.scrollHeight;
}

function a10_clearSerial() {
    const serialEl = document.getElementById('a10-serial-output');
    if (serialEl) serialEl.innerHTML = '';
}

function a10_verifyCode() {
    if (a10_isCompiling) return;
    a10_isCompiling = true;
    if (typeof playSound === 'function') playSound('click');
    a10_logConsole('<span style="color:#FBBF24;">Compilando sketch semaforo_maker.ino...</span>');

    setTimeout(() => {
        a10_isCompiling = false;
        if (typeof playSound === 'function') playSound('success');
        a10_logConsole(`
            <span style="color:#34D399;font-weight:bold;">✔ Compilação concluída com sucesso!</span><br>
            <span style="color:#94A3B8;font-size:0.78rem;">O sketch usa 924 bytes (2%) do espaço de armazenamento. O máximo são 32.256 bytes.<br>
            Variáveis globais usam 9 bytes (0%) de memória dinâmica.</span>
        `);
    }, 1100);
}

function a10_uploadCode(silent = false) {
    if (a10_isUploading) return;
    a10_isUploading = true;
    if (!silent && typeof playSound === 'function') playSound('step');

    a10_logConsole('<span style="color:#38BDF8;">Conectando ao programador na porta COM3 (Arduino UNO)...</span>');

    setTimeout(() => {
        a10_logConsole('<span style="color:#FBBF24;">Gravando memória flash: [##########] 100% OK!</span>');

        setTimeout(() => {
            a10_isUploading = false;
            a10_isUploaded = true;
            if (!silent && typeof playSound === 'function') playSound('success');
            a10_logConsole('<span style="color:#34D399;font-weight:bold;">🎉 Carregamento Concluído! O programa agora está rodando no Arduino UNO.</span>');

            a10_appendSerial('<b style="color:#38BDF8;">--- ARDUINO REINICIADO (RESET) ---</b>');
            a10_appendSerial('🚦 Sistema do Semáforo Iniciado com Sucesso!');
            a10_startTrafficEngine();
        }, 900);
    }, 1200);
}

function a10_copyCode() {
    if (typeof playSound === 'function') playSound('click');
    if (navigator.clipboard) {
        navigator.clipboard.writeText(a10_sourceCode).then(() => {
            if (typeof playSound === 'function') playSound('success');
            alert('📋 Código C++ do Semáforo copiado com sucesso para sua área de transferência!');
        });
    } else {
        alert('Código selecionado!');
    }
}

function a10_resetSimulation() {
    if (a10_trafficInterval) {
        clearInterval(a10_trafficInterval);
        a10_trafficInterval = null;
    }
    if (typeof playSound === 'function') playSound('click');

    const redBulb = document.getElementById('a10-light-red');
    const yellowBulb = document.getElementById('a10-light-yellow');
    const greenBulb = document.getElementById('a10-light-green');
    if (redBulb) redBulb.className = 'a10-sim-light red';
    if (yellowBulb) yellowBulb.className = 'a10-sim-light yellow';
    if (greenBulb) greenBulb.className = 'a10-sim-light green';

    const lbl = document.getElementById('a10-state-label');
    const cnt = document.getElementById('a10-countdown');
    const pin = document.getElementById('a10-pin-active');
    if (lbl) lbl.innerText = 'Reiniciado';
    if (cnt) cnt.innerText = '--';
    if (pin) pin.innerText = 'Pinos LOW';

    a10_appendSerial('<span style="color:#F87171;">Simulação pausada. Clique em Carregar para iniciar de novo.</span>');
}

function a10_startTrafficEngine() {
    if (a10_trafficInterval) {
        clearInterval(a10_trafficInterval);
    }

    a10_cycleStep = 0; // 0=Green(5s), 1=Yellow(2s), 2=Red(5s)
    a10_secondsLeft = 5;

    function applyState() {
        const redBulb = document.getElementById('a10-light-red');
        const yellowBulb = document.getElementById('a10-light-yellow');
        const greenBulb = document.getElementById('a10-light-green');
        const lbl = document.getElementById('a10-state-label');
        const cnt = document.getElementById('a10-countdown');
        const pin = document.getElementById('a10-pin-active');

        if (cnt) cnt.innerText = `${a10_secondsLeft}s`;

        if (a10_cycleStep === 0) {
            // VERDE (5s)
            if (redBulb) redBulb.className = 'a10-sim-light red';
            if (yellowBulb) yellowBulb.className = 'a10-sim-light yellow';
            if (greenBulb) greenBulb.className = 'a10-sim-light green on';
            if (lbl) {
                lbl.innerText = '🟢 SINAL VERDE';
                lbl.style.color = '#34D399';
                lbl.style.borderColor = '#10B981';
            }
            if (pin) pin.innerHTML = 'Pino 11: <b style="color:#34D399;">HIGH</b> | Pinos 12, 13: LOW';
        } else if (a10_cycleStep === 1) {
            // AMARELO (2s)
            if (redBulb) redBulb.className = 'a10-sim-light red';
            if (yellowBulb) yellowBulb.className = 'a10-sim-light yellow on';
            if (greenBulb) greenBulb.className = 'a10-sim-light green';
            if (lbl) {
                lbl.innerText = '🟡 SINAL AMARELO';
                lbl.style.color = '#FBBF24';
                lbl.style.borderColor = '#F59E0B';
            }
            if (pin) pin.innerHTML = 'Pino 12: <b style="color:#FBBF24;">HIGH</b> | Pinos 11, 13: LOW';
        } else if (a10_cycleStep === 2) {
            // VERMELHO (5s)
            if (redBulb) redBulb.className = 'a10-sim-light red on';
            if (yellowBulb) yellowBulb.className = 'a10-sim-light yellow';
            if (greenBulb) greenBulb.className = 'a10-sim-light green';
            if (lbl) {
                lbl.innerText = '🔴 SINAL VERMELHO';
                lbl.style.color = '#F87171';
                lbl.style.borderColor = '#EF4444';
            }
            if (pin) pin.innerHTML = 'Pino 13: <b style="color:#F87171;">HIGH</b> | Pinos 11, 12: LOW';
        }
    }

    // Primeira emissão no serial
    a10_appendSerial('🟢 [VERDE]: Motoristas podem seguir! (5s)');
    applyState();

    a10_trafficInterval = setInterval(() => {
        a10_secondsLeft--;

        if (a10_secondsLeft <= 0) {
            if (a10_cycleStep === 0) {
                // Passa para Amarelo
                a10_cycleStep = 1;
                a10_secondsLeft = 2;
                a10_appendSerial('🟡 [AMARELO]: Atenção! O sinal vai fechar... (2s)');
            } else if (a10_cycleStep === 1) {
                // Passa para Vermelho
                a10_cycleStep = 2;
                a10_secondsLeft = 5;
                a10_appendSerial('🔴 [VERMELHO]: Pare imediatamente! (5s)');
            } else {
                // Volta para Verde
                a10_cycleStep = 0;
                a10_secondsLeft = 5;
                a10_appendSerial('🟢 [VERDE]: Motoristas podem seguir! (5s)');
            }
        }

        applyState();
    }, 1000);
}

function a10_claimCertificate() {
    localStorage.setItem('aula10_completed', 'true');
    if (typeof playSound === 'function') playSound('success');
    if (typeof triggerConfetti === 'function') triggerConfetti(4000);

    if (typeof showCertificateModal === 'function') {
        showCertificateModal();
    }
}

window.loadAula10 = loadAula10;
window.a10_verifyCode = a10_verifyCode;
window.a10_uploadCode = a10_uploadCode;
window.a10_copyCode = a10_copyCode;
window.a10_resetSimulation = a10_resetSimulation;
window.a10_clearSerial = a10_clearSerial;
window.a10_claimCertificate = a10_claimCertificate;

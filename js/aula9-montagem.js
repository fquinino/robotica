/* ==========================================================================
   AULA 9 — PRÁTICA: MONTAGEM FÍSICA DO SEMÁFORO NA PROTOBOARD & ARDUINO UNO
   ========================================================================== */

let a9_currentStep = 1;
const a9_totalSteps = 5;

const a9_stepsData = [
    {
        num: 1,
        title: "Barramento GND (Terra) & Circuito de Retorno",
        badge: "Passo 1 de 5 • Conexão do Terra",
        icon: "🔌",
        color: "#38BDF8",
        componentes: "1x Arduino UNO, 1x Protoboard de 30 Pinos, 1x Jumper Macho-Macho Preto ou Azul",
        resumo: "Conectar o pino <b>GND (Ground / Terra)</b> do Arduino UNO ao <b>barramento negativo azul (-)</b> da protoboard. Esse barramento servirá de retorno comum para os 3 LEDs!",
        desafioCarteira: `Pegue o cabo jumper <b>preto ou azul</b> na sua mão. Encaixe uma das pontas no pino <b>GND</b> do seu Arduino UNO (fica ao lado dos pinos 5V e 3.3V). Agora espete a outra ponta em qualquer furinho da linha azul com sinal de menos <b>(-)</b> da sua protoboard.
<br><br>
<b>Dica tátil:</b> Passe a ponta do dedo por toda a linha azul: todos esses furos agora estão interligados ao Terra do Arduino!`,
        detalhes: [
            "O pino GND representa o potencial <b>0V</b> (pólo negativo).",
            "A linha azul (-) da protoboard é conectada internamente em uma régua metálica contínua de ponta a ponta.",
            "Todos os 3 resistores do semáforo serão aterrados nesta mesma linha!"
        ],
        pinagem: {
            origem: "Arduino UNO — Pino GND",
            destino: "Protoboard — Linha Azul Negativa (-)",
            corFio: "Preto ou Azul (GND)"
        }
    },
    {
        num: 2,
        title: "Circuito do LED Vermelho (Pino 13)",
        badge: "Passo 2 de 5 • Pare!",
        icon: "🔴",
        color: "#EF4444",
        componentes: "1x LED Vermelho 5mm, 1x Resistor 220Ω (ou 300Ω), 1x Jumper Vermelho",
        resumo: "Encaixar o <b>LED Vermelho</b> nas colunas da protoboard, conectar o <b>Resistor de 220Ω</b> entre o cátodo e o barramento (-), e ligar o ânodo ao <b>Pino Digital 13</b>.",
        desafioCarteira: `Pegue o <b>LED Vermelho</b> e olhe as duas pernas contra a luz:
1️⃣ A perna <b>MAIOR</b> é o positivo (Ânodo +): encaixe no furo <b>E10</b>.
2️⃣ A perna <b>MENOR</b> é o negativo (Cátodo -): encaixe no furo <b>E9</b>.
3️⃣ Pegue o <b>Resistor de 220Ω</b> (Vermelho-Vermelho-Marrom): encaixe uma perna no furo <b>A9</b> e a outra na <b>linha azul (-)</b>.
4️⃣ Pegue um jumper vermelho: ligue do <b>Pino Digital 13</b> do Arduino ao furo <b>A10</b>!`,
        detalhes: [
            "Perna Longa (Ânodo) ➔ Coluna 10 ➔ Fio ao Pino 13.",
            "Perna Curta (Cátodo) ➔ Coluna 9 ➔ Resistor de 220Ω ➔ Barramento Negativo (-).",
            "O resistor protege o LED contra sobrecorrente de 5V!"
        ],
        pinagem: {
            origem: "Arduino UNO — Pino Digital 13",
            destino: "Protoboard — Coluna 10 (Ânodo +)",
            corFio: "Vermelho"
        }
    },
    {
        num: 3,
        title: "Circuito do LED Amarelo (Pino 12)",
        badge: "Passo 3 de 5 • Atenção!",
        icon: "🟡",
        color: "#F59E0B",
        componentes: "1x LED Amarelo 5mm, 1x Resistor 220Ω (ou 300Ω), 1x Jumper Amarelo",
        resumo: "Encaixar o <b>LED Amarelo</b> nas colunas da protoboard, o segundo <b>Resistor de 220Ω</b> ao barramento (-), e o ânodo ao <b>Pino Digital 12</b>.",
        desafioCarteira: `Pegue o <b>LED Amarelo</b> na sua bancada:
1️⃣ Identifique a perna <b>MAIOR</b> (Ânodo +): encaixe no furo <b>E16</b>.
2️⃣ Encaixe a perna <b>MENOR</b> (Cátodo -) no furo <b>E15</b>.
3️⃣ Pegue o segundo <b>Resistor de 220Ω</b>: ligue do furo <b>A15</b> até a <b>linha azul (-)</b>.
4️⃣ Pegue um jumper amarelo (ou laranja): ligue do <b>Pino Digital 12</b> do Arduino ao furo <b>A16</b>!`,
        detalhes: [
            "Perna Longa (Ânodo) ➔ Coluna 16 ➔ Fio ao Pino 12.",
            "Perna Curta (Cátodo) ➔ Coluna 15 ➔ Resistor 220Ω ➔ Barramento (-).",
            "Mantenha 5 furos de distância do LED Vermelho para seu semáforo ficar organizado!"
        ],
        pinagem: {
            origem: "Arduino UNO — Pino Digital 12",
            destino: "Protoboard — Coluna 16 (Ânodo +)",
            corFio: "Amarelo ou Laranja"
        }
    },
    {
        num: 4,
        title: "Circuito do LED Verde (Pino 11)",
        badge: "Passo 4 de 5 • Siga em frente!",
        icon: "🟢",
        color: "#10B981",
        componentes: "1x LED Verde 5mm, 1x Resistor 220Ω (ou 300Ω), 1x Jumper Verde",
        resumo: "Encaixar o <b>LED Verde</b> nas colunas da protoboard, o terceiro <b>Resistor de 220Ω</b> ao barramento (-), e o ânodo ao <b>Pino Digital 11</b>.",
        desafioCarteira: `Pegue o <b>LED Verde</b> na sua mão:
1️⃣ Identifique a perna <b>MAIOR</b> (Ânodo +): encaixe no furo <b>E22</b>.
2️⃣ Encaixe a perna <b>MENOR</b> (Cátodo -) no furo <b>E21</b>.
3️⃣ Pegue o terceiro <b>Resistor de 220Ω</b>: ligue do furo <b>A21</b> até a <b>linha azul (-)</b>.
4️⃣ Pegue um jumper verde: ligue do <b>Pino Digital 11</b> do Arduino ao furo <b>A22</b>!`,
        detalhes: [
            "Perna Longa (Ânodo) ➔ Coluna 22 ➔ Fio ao Pino 11.",
            "Perna Curta (Cátodo) ➔ Coluna 21 ➔ Resistor 220Ω ➔ Barramento (-).",
            "Agora todos os 3 LEDs têm seu próprio circuito independente e seguro!"
        ],
        pinagem: {
            origem: "Arduino UNO — Pino Digital 11",
            destino: "Protoboard — Coluna 22 (Ânodo +)",
            corFio: "Verde"
        }
    },
    {
        num: 5,
        title: "Checklist de Bancada & Teste Interativo",
        badge: "Passo 5 de 5 • Inspeção & Teste",
        icon: "🚦",
        color: "#A78BFA",
        componentes: "Montagem Completa Pronta para Teste",
        resumo: "Faça a inspeção visual completa das perninhas e resistores. Use o painel de teste interativo abaixo para simular o acionamento de cada pino!",
        desafioCarteira: `🖐️ <b>Inspeção com as Duas Mãos na Carteira:</b>
1. Passe os olhos pelas 3 perninhas menores: todas estão ligadas a um resistor de 220Ω?
2. Todos os 3 resistores terminam no barramento azul (-)?
3. O fio do GND do Arduino está firme no barramento azul?
4. Os fios dos pinos 13, 12 e 11 estão espetados nas colunas certas (10, 16 e 22)?
Se sim, seu semáforo físico está 100% perfeito e pronto para ser programado!`,
        detalhes: [
            "Pino 13 ➔ LED Vermelho (Coluna 10)",
            "Pino 12 ➔ LED Amarelo  (Coluna 16)",
            "Pino 11 ➔ LED Verde    (Coluna 22)",
            "GND ➔ Barramento Negativo (-)"
        ],
        pinagem: {
            origem: "Arduino UNO (Pinos 13, 12, 11 e GND)",
            destino: "Protoboard com 3 LEDs e 3 Resistores",
            corFio: "Multicor"
        }
    }
];

function loadAula9() {
    const container = document.getElementById('aula9-container');
    if (!container) return;

    let savedSteps = [];
    try {
        savedSteps = JSON.parse(localStorage.getItem('aula9_completed_steps') || '[1]');
    } catch(e) {
        savedSteps = [1];
    }

    container.innerHTML = `
        <div id="aula9-loaded" class="a9-wrap">
            <style>
                .a9-wrap {
                    color: #CBD5E1;
                    font-family: 'Nunito', sans-serif;
                    max-width: 1040px;
                    margin: 0 auto;
                }
                .a9-hero {
                    background: linear-gradient(135deg, rgba(30, 41, 59, 0.95), rgba(15, 23, 42, 0.95));
                    border: 2px solid #F59E0B;
                    border-radius: 24px;
                    padding: 24px 26px;
                    margin-bottom: 24px;
                    box-shadow: 0 10px 30px rgba(245, 158, 11, 0.15);
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    flex-wrap: wrap;
                    gap: 16px;
                }
                .a9-hero-title h2 {
                    font-family: 'Fredoka One', cursive;
                    font-size: 1.85rem;
                    color: white;
                    margin: 0 0 6px;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }
                .a9-hero-title p {
                    color: #94A3B8;
                    margin: 0;
                    font-size: 0.95rem;
                    font-weight: 700;
                }
                .a9-progress-pill {
                    background: #0F172A;
                    border: 1px solid #334155;
                    border-radius: 16px;
                    padding: 8px 18px;
                    font-weight: 900;
                    color: #FBBF24;
                    font-size: 0.9rem;
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                }

                /* Navegação dos Passos */
                .a9-steps-nav {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
                    gap: 10px;
                    margin-bottom: 24px;
                }
                .a9-step-btn {
                    background: #1E293B;
                    border: 2px solid #334155;
                    color: #94A3B8;
                    padding: 12px 14px;
                    border-radius: 16px;
                    font-weight: 800;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    font-size: 0.88rem;
                    transition: all 0.2s ease;
                    text-align: left;
                }
                .a9-step-btn:hover {
                    background: #273549;
                    color: white;
                    border-color: #475569;
                }
                .a9-step-btn.active {
                    background: linear-gradient(135deg, #0F172A, #1E293B);
                    border-color: #F59E0B;
                    color: #FDE68A;
                    box-shadow: 0 0 15px rgba(245, 158, 11, 0.25);
                }
                .a9-step-btn.done {
                    border-color: #10B981;
                    color: #A7F3D0;
                }

                /* Card Principal do Passo */
                .a9-main-card {
                    background: #1E293B;
                    border-radius: 24px;
                    border: 2px solid #334155;
                    padding: 26px;
                    margin-bottom: 24px;
                    box-shadow: 0 12px 35px rgba(0, 0, 0, 0.4);
                }
                .a9-badge-step {
                    display: inline-block;
                    padding: 4px 14px;
                    border-radius: 12px;
                    font-size: 0.8rem;
                    font-weight: 900;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    margin-bottom: 10px;
                }
                .a9-step-heading {
                    font-family: 'Fredoka One', cursive;
                    font-size: 1.6rem;
                    color: white;
                    margin: 0 0 14px;
                }

                /* Desafio da Carteira - Banner em Destaque */
                .a9-desk-box {
                    background: linear-gradient(135deg, rgba(245, 158, 11, 0.12), rgba(217, 119, 6, 0.05));
                    border: 2px dashed #F59E0B;
                    border-radius: 20px;
                    padding: 20px 22px;
                    margin: 20px 0;
                    box-shadow: 0 4px 20px rgba(245, 158, 11, 0.08);
                }
                .a9-desk-title {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    font-size: 1.15rem;
                    font-weight: 900;
                    color: #FBBF24;
                    margin-bottom: 10px;
                    font-family: 'Fredoka One', cursive;
                }
                .a9-desk-content {
                    font-size: 0.95rem;
                    line-height: 1.65;
                    color: #FDE68A;
                }

                /* Grid de Detalhes e Pinagem */
                .a9-grid-info {
                    display: grid;
                    grid-template-columns: 1.2fr 1fr;
                    gap: 18px;
                    margin-top: 18px;
                }
                @media (max-width: 768px) {
                    .a9-grid-info { grid-template-columns: 1fr; }
                }
                .a9-info-box {
                    background: #0F172A;
                    border: 1px solid #334155;
                    border-radius: 16px;
                    padding: 18px;
                }
                .a9-info-title {
                    color: #38BDF8;
                    font-weight: 900;
                    font-size: 0.95rem;
                    margin-bottom: 10px;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
                .a9-info-list {
                    margin: 0;
                    padding-left: 18px;
                    color: #CBD5E1;
                    font-size: 0.9rem;
                    line-height: 1.6;
                }
                .a9-pinout-table {
                    width: 100%;
                    border-collapse: collapse;
                    font-size: 0.88rem;
                }
                .a9-pinout-table td {
                    padding: 8px 10px;
                    border-bottom: 1px solid #1E293B;
                }
                .a9-pinout-table tr:last-child td { border-bottom: none; }
                .a9-pinout-label { color: #94A3B8; font-weight: 800; }
                .a9-pinout-val { color: #F1F5F9; font-weight: 900; }

                /* Simulador de Teste dos LEDs */
                .a9-test-bench {
                    background: #0F172A;
                    border: 2px solid #38BDF8;
                    border-radius: 20px;
                    padding: 22px;
                    margin-top: 24px;
                    text-align: center;
                }
                .a9-led-stage {
                    display: flex;
                    justify-content: center;
                    align-items: flex-end;
                    gap: 36px;
                    margin: 22px 0 16px;
                    padding: 16px;
                    background: #1E293B;
                    border-radius: 18px;
                    border: 1px solid #334155;
                }
                .a9-led-item {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 8px;
                }
                .a9-led-bulb {
                    width: 44px;
                    height: 52px;
                    border-radius: 22px 22px 6px 6px;
                    background: #334155;
                    border: 2px solid #64748B;
                    transition: all 0.3s ease;
                    position: relative;
                }
                .a9-led-bulb.red.on {
                    background: radial-gradient(circle at 35% 35%, #FCA5A5, #EF4444);
                    box-shadow: 0 0 25px #EF4444, 0 0 45px rgba(239, 68, 68, 0.6);
                    border-color: #FECACA;
                }
                .a9-led-bulb.yellow.on {
                    background: radial-gradient(circle at 35% 35%, #FEF08A, #F59E0B);
                    box-shadow: 0 0 25px #F59E0B, 0 0 45px rgba(245, 158, 11, 0.6);
                    border-color: #FEF9C3;
                }
                .a9-led-bulb.green.on {
                    background: radial-gradient(circle at 35% 35%, #A7F3D0, #10B981);
                    box-shadow: 0 0 25px #10B981, 0 0 45px rgba(16, 185, 129, 0.6);
                    border-color: #D1FAE5;
                }
                .a9-test-btn {
                    background: #1E293B;
                    border: 1px solid #475569;
                    color: white;
                    padding: 8px 16px;
                    border-radius: 12px;
                    font-weight: 800;
                    cursor: pointer;
                    font-size: 0.85rem;
                    transition: 0.2s;
                }
                .a9-test-btn:hover {
                    background: #334155;
                    border-color: #38BDF8;
                }
                .a9-cycle-btn {
                    background: linear-gradient(135deg, #10B981, #059669);
                    border: none;
                    color: white;
                    padding: 10px 22px;
                    border-radius: 14px;
                    font-weight: 900;
                    font-size: 0.95rem;
                    cursor: pointer;
                    margin-top: 10px;
                    box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
                }
                .a9-cycle-btn:hover {
                    transform: scale(1.03);
                }

                /* Footer de Navegação */
                .a9-card-footer {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    flex-wrap: wrap;
                    gap: 12px;
                    margin-top: 24px;
                    padding-top: 20px;
                    border-top: 1px solid #334155;
                }
                .a9-action-btn {
                    background: linear-gradient(135deg, #F59E0B, #D97706);
                    border: none;
                    color: #0F172A;
                    padding: 12px 26px;
                    border-radius: 14px;
                    font-weight: 900;
                    font-size: 1rem;
                    cursor: pointer;
                    box-shadow: 0 4px 15px rgba(245, 158, 11, 0.3);
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    transition: 0.2s;
                }
                .a9-action-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 20px rgba(245, 158, 11, 0.45);
                }
            </style>

            <div class="a9-hero">
                <div class="a9-hero-title">
                    <h2><span style="color:#F59E0B;">🔧</span> Aula 9: Montagem Física do Semáforo</h2>
                    <p>Guia prático de bancada Maker com Protoboard real, 3 LEDs, 3 Resistores e Arduino UNO</p>
                </div>
                <div class="a9-progress-pill" id="a9-progress-indicator">
                    <i class="fa-solid fa-list-check" style="color:#F59E0B;"></i>
                    <span id="a9-step-counter">Passo 1 de 5</span>
                </div>
            </div>

            <!-- Navegação Superior dos Passos -->
            <div class="a9-steps-nav" id="a9-nav-container"></div>

            <!-- Painel do Passo Atual -->
            <div class="a9-main-card" id="a9-step-card"></div>
        </div>
    `;

    a9_renderStep(a9_currentStep);
}

function a9_renderStep(stepNum) {
    a9_currentStep = stepNum;
    const step = a9_stepsData.find(s => s.num === stepNum) || a9_stepsData[0];

    // Atualiza navegação
    let savedSteps = [];
    try {
        savedSteps = JSON.parse(localStorage.getItem('aula9_completed_steps') || '[1]');
    } catch(e) {
        savedSteps = [1];
    }

    const navContainer = document.getElementById('a9-nav-container');
    if (navContainer) {
        navContainer.innerHTML = a9_stepsData.map(s => {
            const isActive = s.num === stepNum;
            const isDone = savedSteps.includes(s.num);
            return `
                <button class="a9-step-btn ${isActive ? 'active' : ''} ${isDone ? 'done' : ''}" onclick="a9_switchStep(${s.num})">
                    <span style="font-size:1.2rem;">${s.icon}</span>
                    <div style="flex:1;">
                        <div style="font-size:0.75rem;opacity:0.75;">Passo ${s.num}</div>
                        <div style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${s.title.split(' ')[0]} ${s.title.split(' ')[1] || ''}</div>
                    </div>
                    ${isDone ? '<i class="fa-solid fa-circle-check" style="color:#34D399;font-size:0.85rem;"></i>' : ''}
                </button>
            `;
        }).join('');
    }

    const counterEl = document.getElementById('a9-step-counter');
    if (counterEl) counterEl.innerText = `Passo ${stepNum} de ${a9_totalSteps}`;

    const card = document.getElementById('a9-step-card');
    if (!card) return;

    let testBenchHTML = '';
    if (stepNum === 5) {
        testBenchHTML = `
            <div class="a9-test-bench">
                <div style="font-family:'Fredoka One';color:#38BDF8;font-size:1.35rem;margin-bottom:6px;">
                    <i class="fa-solid fa-microchip"></i> Bancada de Testes do Semáforo
                </div>
                <p style="color:#94A3B8;font-size:0.9rem;margin:0 0 16px;">Clique nos botões para testar individualmente cada LED ou dispare o ciclo completo de trânsito!</p>
                
                <div class="a9-led-stage">
                    <div class="a9-led-item">
                        <div class="a9-led-bulb red" id="a9-bulb-red"></div>
                        <span style="font-weight:900;color:#FCA5A5;font-size:0.85rem;">Pino 13</span>
                        <button class="a9-test-btn" onclick="a9_toggleLED('red')">Ligar / Desligar</button>
                    </div>
                    <div class="a9-led-item">
                        <div class="a9-led-bulb yellow" id="a9-bulb-yellow"></div>
                        <span style="font-weight:900;color:#FEF08A;font-size:0.85rem;">Pino 12</span>
                        <button class="a9-test-btn" onclick="a9_toggleLED('yellow')">Ligar / Desligar</button>
                    </div>
                    <div class="a9-led-item">
                        <div class="a9-led-bulb green" id="a9-bulb-green"></div>
                        <span style="font-weight:900;color:#A7F3D0;font-size:0.85rem;">Pino 11</span>
                        <button class="a9-test-btn" onclick="a9_toggleLED('green')">Ligar / Desligar</button>
                    </div>
                </div>

                <button class="a9-cycle-btn" onclick="a9_runDemoCycle()">
                    <i class="fa-solid fa-play"></i> Simular Ciclo Automático do Semáforo
                </button>
                <div id="a9-cycle-status" style="margin-top:10px;font-size:0.9rem;font-weight:800;color:#38BDF8;min-height:22px;"></div>
            </div>
        `;
    }

    card.innerHTML = `
        <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:10px;">
            <div>
                <span class="a9-badge-step" style="background:${step.color}22;color:${step.color};border:1px solid ${step.color}44;">
                    ${step.badge}
                </span>
                <h3 class="a9-step-heading">${step.icon} ${step.title}</h3>
            </div>
            <div style="background:#0F172A;border:1px solid #334155;border-radius:12px;padding:6px 14px;font-size:0.82rem;color:#94A3B8;">
                <i class="fa-solid fa-box-open" style="color:#F59E0B;"></i> <b>Materiais:</b> ${step.componentes}
            </div>
        </div>

        <p style="font-size:1.02rem;color:#E2E8F0;line-height:1.6;margin:12px 0 16px;">${step.resumo}</p>

        <!-- BANNER DO DESAFIO NA CARTEIRA -->
        <div class="a9-desk-box">
            <div class="a9-desk-title">
                <span>🖐️</span> Desafio Prático na Sua Carteira:
            </div>
            <div class="a9-desk-content">
                ${step.desafioCarteira}
            </div>
        </div>

        <div class="a9-grid-info">
            <div class="a9-info-box">
                <div class="a9-info-title"><i class="fa-solid fa-circle-info"></i> Atenção aos Detalhes Maker</div>
                <ul class="a9-info-list">
                    ${step.detalhes.map(d => `<li>${d}</li>`).join('')}
                </ul>
            </div>
            <div class="a9-info-box">
                <div class="a9-info-title"><i class="fa-solid fa-diagram-project"></i> Mapeamento de Pinos & Fios</div>
                <table class="a9-pinout-table">
                    <tr>
                        <td class="a9-pinout-label">Origem:</td>
                        <td class="a9-pinout-val">${step.pinagem.origem}</td>
                    </tr>
                    <tr>
                        <td class="a9-pinout-label">Destino:</td>
                        <td class="a9-pinout-val">${step.pinagem.destino}</td>
                    </tr>
                    <tr>
                        <td class="a9-pinout-label">Cor Sugerida:</td>
                        <td class="a9-pinout-val" style="color:#FBBF24;">${step.pinagem.corFio}</td>
                    </tr>
                </table>
            </div>
        </div>

        ${testBenchHTML}

        <div class="a9-card-footer">
            <button onclick="a9_switchStep(${stepNum > 1 ? stepNum - 1 : 1})" style="background:#0F172A;border:1px solid #334155;color:#94A3B8;padding:10px 18px;border-radius:12px;font-weight:800;cursor:pointer;font-size:0.9rem;" ${stepNum === 1 ? 'disabled style="opacity:0.4;cursor:not-allowed;"' : ''}>
                ← Passo Anterior
            </button>
            <div style="display:flex;gap:12px;flex-wrap:wrap;">
                <button class="a9-action-btn" onclick="a9_completeCurrentStep(${stepNum})">
                    ${stepNum < a9_totalSteps ? 'Concluir Passo & Próximo <i class="fa-solid fa-arrow-right"></i>' : '🚀 Concluir Montagem e Programar na Aula 10!'}
                </button>
            </div>
        </div>
    `;
}

function a9_switchStep(stepNum) {
    if (typeof playSound === 'function') playSound('step');
    a9_renderStep(stepNum);
    window.scrollTo({ top: 120, behavior: 'smooth' });
}

function a9_completeCurrentStep(stepNum) {
    let saved = [];
    try {
        saved = JSON.parse(localStorage.getItem('aula9_completed_steps') || '[1]');
    } catch(e) {
        saved = [1];
    }
    if (!saved.includes(stepNum)) saved.push(stepNum);
    if (stepNum + 1 <= a9_totalSteps && !saved.includes(stepNum + 1)) saved.push(stepNum + 1);
    localStorage.setItem('aula9_completed_steps', JSON.stringify(saved));

    if (typeof playSound === 'function') playSound('success');

    if (stepNum < a9_totalSteps) {
        a9_renderStep(stepNum + 1);
    } else {
        if (typeof triggerConfetti === 'function') triggerConfetti(3500);
        alert('🎉 Parabéns! Você concluiu a montagem física completa do Semáforo com 3 LEDs, 3 resistores e Arduino UNO na protoboard!\n\nAgora vamos para a Aula 10 para programar o código C++ e carregar na placa!');
        openTab('tab-aula10');
    }
}

// Simulador interativo da Bancada de Testes
function a9_toggleLED(color) {
    if (typeof playSound === 'function') playSound('click');
    const bulb = document.getElementById(`a9-bulb-${color}`);
    if (bulb) {
        bulb.classList.toggle('on');
    }
}

let a9_cycleTimer = null;
function a9_runDemoCycle() {
    if (a9_cycleTimer) {
        clearTimeout(a9_cycleTimer);
        a9_cycleTimer = null;
    }
    if (typeof playSound === 'function') playSound('step');

    const redBulb = document.getElementById('a9-bulb-red');
    const yellowBulb = document.getElementById('a9-bulb-yellow');
    const greenBulb = document.getElementById('a9-bulb-green');
    const statusEl = document.getElementById('a9-cycle-status');

    function setLights(r, y, g, msg) {
        if (redBulb) redBulb.className = `a9-led-bulb red ${r ? 'on' : ''}`;
        if (yellowBulb) yellowBulb.className = `a9-led-bulb yellow ${y ? 'on' : ''}`;
        if (greenBulb) greenBulb.className = `a9-led-bulb green ${g ? 'on' : ''}`;
        if (statusEl) statusEl.innerHTML = msg;
    }

    // 1. Verde
    setLights(false, false, true, '<span style="color:#34D399;">🟢 SINAL VERDE (Pino 11 HIGH) — Siga em frente!</span>');
    if (typeof playSound === 'function') playSound('success');

    // 2. Amarelo após 2s
    a9_cycleTimer = setTimeout(() => {
        setLights(false, true, false, '<span style="color:#FBBF24;">🟡 SINAL AMARELO (Pino 12 HIGH) — Atenção motoristas!</span>');
        if (typeof playSound === 'function') playSound('step');

        // 3. Vermelho após 1.5s
        a9_cycleTimer = setTimeout(() => {
            setLights(true, false, false, '<span style="color:#EF4444;">🔴 SINAL VERMELHO (Pino 13 HIGH) — Pare!</span>');
            if (typeof playSound === 'function') playSound('step');

            // Fim após 2s
            a9_cycleTimer = setTimeout(() => {
                setLights(false, false, false, '<span style="color:#38BDF8;">✨ Teste concluído com sucesso! Circuito 100% aprovado.</span>');
            }, 2000);
        }, 1500);
    }, 2000);
}

window.loadAula9 = loadAula9;
window.a9_switchStep = a9_switchStep;
window.a9_completeCurrentStep = a9_completeCurrentStep;
window.a9_toggleLED = a9_toggleLED;
window.a9_runDemoCycle = a9_runDemoCycle;

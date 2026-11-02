/* ==========================================================================
   AULA 10 — O GRANDE ALMANAQUE DE FUNÇÕES & MEGA REVISÃO DE PROGRAMAÇÃO C++
   Dicionário Oficial: digitalWrite, digitalRead, pinMode, analogRead, delay, Serial
   Playground Interativo de Funções, Quiz Maker & Emissão de Certificado
   ========================================================================== */

let a10_quizAnswers = {};
let a10_pwmVal = 180;
let a10_led13State = false;

function a10_testDigitalWrite(val) {
    a10_led13State = val === 'HIGH';
    const led = document.getElementById('a10-play-led13');
    const status = document.getElementById('a10-play-status-text');
    const codeView = document.getElementById('a10-play-executed-code');

    if (led) {
        led.setAttribute('fill', a10_led13State ? '#10B981' : '#334155');
        if (a10_led13State) {
            led.setAttribute('filter', 'drop-shadow(0 0 10px #10B981)');
        } else {
            led.removeAttribute('filter');
        }
    }
    if (codeView) {
        codeView.innerText = `digitalWrite(13, ${val}); // Pino 13 colocado em ${val === 'HIGH' ? '5.0V (Energizado)' : '0.0V (Desligado)'}`;
    }
    if (status) {
        status.innerHTML = a10_led13State ?
            '<span style="color:#10B981;font-weight:900;">🟢 LED do Pino 13 ACESO (5V em nível HIGH)!</span>' :
            '<span style="color:#94A3B8;font-weight:bold;">⚪ LED do Pino 13 APAGADO (0V em nível LOW).</span>';
    }
    try {
        if (typeof playSound === 'function') playSound(a10_led13State ? 'step' : 'click');
    } catch(e) {}
}

function a10_testAnalogWrite(val) {
    a10_pwmVal = parseInt(val, 10);
    const led = document.getElementById('a10-play-led-pwm');
    const label = document.getElementById('a10-play-pwm-label');
    const codeView = document.getElementById('a10-play-executed-code');
    const voltLabel = document.getElementById('a10-play-pwm-volt');

    const opacity = (a10_pwmVal / 255);
    const volts = ((a10_pwmVal / 255) * 5.0).toFixed(2);

    if (label) label.innerText = `${a10_pwmVal} / 255`;
    if (voltLabel) voltLabel.innerText = `${volts}V médios (PWM)`;
    if (led) {
        led.setAttribute('fill', '#38BDF8');
        led.setAttribute('opacity', Math.max(0.15, opacity));
        if (a10_pwmVal > 30) {
            led.setAttribute('filter', `drop-shadow(0 0 ${Math.round(opacity * 14)}px #38BDF8)`);
        } else {
            led.removeAttribute('filter');
        }
    }
    if (codeView) {
        codeView.innerText = `analogWrite(11, ${a10_pwmVal}); // Sinal PWM com duty cycle de ${Math.round(opacity * 100)}% (${volts}V médios)`;
    }
}

function a10_testAnalogRead() {
    const randomVal = Math.floor(Math.random() * 600) + 200;
    const volts = ((randomVal / 1023) * 5.0).toFixed(2);
    const codeView = document.getElementById('a10-play-executed-code');
    const status = document.getElementById('a10-play-status-text');

    if (codeView) {
        codeView.innerText = `int leitura = analogRead(A0); // Valor lido: ${randomVal} (tensão de ${volts}V)`;
    }
    if (status) {
        status.innerHTML = `<span style="color:#FBBF24;font-weight:900;">🎛️ analogRead(A0) retornou: <b>${randomVal}</b> de 1023 (Tensão de ${volts}V no sensor)!</span>`;
    }
    try {
        if (typeof playSound === 'function') playSound('step');
    } catch(e) {}
}

function a10_testSerialPrint(text) {
    const monitor = document.getElementById('a10-play-serial-console');
    const codeView = document.getElementById('a10-play-executed-code');
    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0];

    if (codeView) {
        codeView.innerText = `Serial.println("${text}"); // Mensagem enviada pelo cabo USB a 9600 bps`;
    }
    if (monitor) {
        monitor.innerHTML += `<div style="color:#38BDF8;font-size:0.84rem;font-family:monospace;">[${timeStr}] ➔ ${text}</div>`;
        monitor.scrollTop = monitor.scrollHeight;
    }
    try {
        if (typeof playSound === 'function') playSound('click');
    } catch(e) {}
}

function a10_clearSerial() {
    const monitor = document.getElementById('a10-play-serial-console');
    if (monitor) monitor.innerHTML = '<span style="color:#64748B;">Monitor Serial limpo. Pronto para receber mensagens...</span>';
}

function a10_answerQuiz(qNum, selectedOption, isCorrect) {
    a10_quizAnswers[qNum] = isCorrect;
    
    // Atualiza botões
    const parent = document.getElementById(`a10-quiz-q${qNum}`);
    if (parent) {
        const btns = parent.querySelectorAll('.a10-quiz-opt');
        btns.forEach(b => {
            b.style.pointerEvents = 'none';
            b.style.opacity = '0.7';
        });
        const clicked = document.getElementById(`a10-q${qNum}-opt${selectedOption}`);
        if (clicked) {
            clicked.style.opacity = '1';
            clicked.style.background = isCorrect ? '#064E3B' : '#7F1D1D';
            clicked.style.borderColor = isCorrect ? '#10B981' : '#EF4444';
            clicked.style.color = isCorrect ? '#A7F3D0' : '#FECACA';
            clicked.innerHTML += isCorrect ? ' ✅ <b>Correto!</b>' : ' ❌ <b>Incorreto</b>';
        }
        const feedback = document.getElementById(`a10-feedback-q${qNum}`);
        if (feedback) {
            feedback.style.display = 'block';
            feedback.innerHTML = isCorrect ?
                '<span style="color:#10B981;font-weight:bold;">🎉 Parabéns, você acertou em cheio!</span>' :
                '<span style="color:#F87171;font-weight:bold;">💡 Quase lá! Revise o cartão desta função no dicionário acima!</span>';
        }
    }

    try {
        if (typeof playSound === 'function') playSound(isCorrect ? 'success' : 'error');
    } catch(e) {}

    // Checa total
    const totalAnswered = Object.keys(a10_quizAnswers).length;
    if (totalAnswered === 5) {
        const correctCount = Object.values(a10_quizAnswers).filter(Boolean).length;
        const scoreBox = document.getElementById('a10-quiz-final-score');
        if (scoreBox) {
            scoreBox.style.display = 'block';
            scoreBox.innerHTML = `
                <div style="background:#1E293B;border:3px solid #F59E0B;border-radius:16px;padding:20px;text-align:center;box-shadow:0 8px 30px rgba(245,158,11,0.25);">
                    <div style="font-size:2.4rem;">🏆</div>
                    <h3 style="font-family:'Fredoka One';color:white;margin:6px 0;font-size:1.6rem;">
                        Resultado do Quiz: ${correctCount} de 5 Acertos!
                    </h3>
                    <p style="color:#CBD5E1;font-size:0.95rem;margin:0 0 14px;">
                        ${correctCount >= 4 ?
                            'Sensacional! Você é um verdadeiro mestre das funções do Arduino e da linguagem C++!' :
                            'Bom trabalho! Revise os conceitos do dicionário para fixar 100% o conhecimento!'}
                    </p>
                    <button onclick="openCertificateModal()" style="background:#F59E0B;color:#0F172A;border:none;padding:12px 24px;border-radius:12px;font-weight:900;font-size:1rem;cursor:pointer;">
                        <i class="fa-solid fa-award"></i> Emitir Meu Certificado de Conclusão Maker
                    </button>
                </div>
            `;
        }
        if (correctCount >= 4 && typeof fireConfetti === 'function') {
            fireConfetti();
        }
    }
}

function loadAula10() {
    const container = document.getElementById('aula10-container');
    if (!container) return;

    container.innerHTML = `
        <div id="aula10-loaded" class="a10-wrap">
            <style>
                .a10-wrap {
                    color: #CBD5E1;
                    font-family: 'Nunito', sans-serif;
                    max-width: 1080px;
                    margin: 0 auto;
                }
                .a10-hero {
                    background: linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(15, 23, 42, 0.98));
                    border: 2px solid #10B981;
                    border-radius: 24px;
                    padding: 26px 28px;
                    margin-bottom: 24px;
                    box-shadow: 0 10px 30px rgba(16, 185, 129, 0.2);
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    flex-wrap: wrap;
                    gap: 16px;
                }
                .a10-hero-title h2 {
                    font-family: 'Fredoka One', cursive;
                    font-size: 1.95rem;
                    color: white;
                    margin: 0 0 6px;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }
                .a10-hero-title p {
                    color: #A7F3D0;
                    margin: 0;
                    font-size: 1rem;
                    font-weight: 700;
                    line-height: 1.5;
                }
                .a10-badge {
                    background: rgba(16, 185, 129, 0.15);
                    border: 1px solid #10B981;
                    color: #6EE7B7;
                    padding: 6px 14px;
                    border-radius: 12px;
                    font-size: 0.82rem;
                    font-weight: 800;
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                }
                .a10-dict-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
                    gap: 16px;
                    margin-bottom: 24px;
                }
                .a10-fn-card {
                    background: #0F172A;
                    border: 2px solid #1E293B;
                    border-radius: 18px;
                    padding: 20px;
                    transition: transform 0.2s, border-color 0.2s;
                    box-shadow: 0 6px 20px rgba(0,0,0,0.3);
                }
                .a10-fn-card:hover {
                    transform: translateY(-3px);
                    border-color: #38BDF8;
                }
                .a10-fn-header {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    margin-bottom: 12px;
                    border-bottom: 1px solid #1E293B;
                    padding-bottom: 10px;
                }
                .a10-fn-name {
                    font-family: 'Consolas', 'Courier New', monospace;
                    font-size: 1.15rem;
                    font-weight: 900;
                    color: #38BDF8;
                }
                .a10-analogy-box {
                    background: rgba(251, 191, 36, 0.1);
                    border-left: 3px solid #F59E0B;
                    padding: 8px 12px;
                    border-radius: 6px;
                    font-size: 0.85rem;
                    color: #FDE68A;
                    margin: 10px 0;
                    line-height: 1.5;
                }
                .a10-fn-code {
                    background: #050B14;
                    border: 1px solid #1E293B;
                    border-radius: 8px;
                    padding: 10px 12px;
                    font-family: 'Consolas', monospace;
                    font-size: 0.82rem;
                    color: #A7F3D0;
                    white-space: pre-wrap;
                    line-height: 1.4;
                    margin-top: 8px;
                }
                .a10-quiz-card {
                    background: #0F172A;
                    border: 2px solid #334155;
                    border-radius: 18px;
                    padding: 20px;
                    margin-bottom: 16px;
                }
                .a10-quiz-opt {
                    background: #1E293B;
                    border: 1px solid #334155;
                    color: #E2E8F0;
                    padding: 12px 16px;
                    border-radius: 12px;
                    font-size: 0.9rem;
                    cursor: pointer;
                    text-align: left;
                    width: 100%;
                    margin-bottom: 8px;
                    transition: 0.2s;
                    font-family: 'Nunito', sans-serif;
                    font-weight: bold;
                }
                .a10-quiz-opt:hover {
                    background: #334155;
                    border-color: #38BDF8;
                    color: white;
                }
            </style>

            <!-- HERO HEADER -->
            <div class="a10-hero">
                <div class="a10-hero-title">
                    <span class="a10-badge"><i class="fa-solid fa-graduation-cap"></i> Aula 10 • Grande Almanaque &amp; Revisão Geral</span>
                    <h2>💻 Dicionário de Funções C++ &amp; Mega Revisão Maker</h2>
                    <p>O guia de cabeceira definitivo que você sempre sonhou! Domine para sempre as 7 funções de ouro do Arduino (digitalWrite, digitalRead, pinMode, analogRead, delay, Serial) e celebre sua conclusão com o Certificado Maker!</p>
                </div>
                <div>
                    <button onclick="openCertificateModal()" style="background:#F59E0B;color:#0F172A;border:none;padding:14px 24px;border-radius:16px;font-family:'Fredoka One';font-size:1.05rem;cursor:pointer;display:inline-flex;align-items:center;gap:10px;box-shadow:0 8px 24px rgba(245,158,11,0.35);">
                        <i class="fa-solid fa-award" style="font-size:1.3rem;"></i> Emitir Certificado Maker
                    </button>
                </div>
            </div>

            <!-- ESTRUTURA MÃE: SETUP VS LOOP -->
            <div style="background:#0F172A;border:2px solid #0284C7;border-radius:20px;padding:22px;margin-bottom:24px;">
                <h3 style="color:#38BDF8;font-family:'Fredoka One';margin:0 0 12px;font-size:1.35rem;display:flex;align-items:center;gap:10px;">
                    <span>🏛️</span> A Estrutura Mãe de Qualquer Programa Arduino:
                </h3>
                <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:16px;">
                    <div style="background:#1E293B;padding:16px;border-radius:14px;border-top:4px solid #F59E0B;">
                        <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">
                            <span style="font-size:1.3rem;">🎬</span>
                            <strong style="color:#FBBF24;font-size:1.05rem;font-family:'Consolas',monospace;">void setup() { ... }</strong>
                        </div>
                        <p style="color:#CBD5E1;font-size:0.88rem;line-height:1.6;margin:0 0 10px;">
                            <b>O que é:</b> É o ritual de abertura da placa!
                            <br>
                            <b>Quantas vezes roda:</b> Roda <b>EXATAMENTE 1 VEZ</b> no milissegundo em que o Arduino recebe energia pelo cabo USB ou o botão RESET é pressionado.
                            <br>
                            <b>Para que serve:</b> Configurar os pinos (se são entradas ou saídas) e iniciar a comunicação Serial com o computador!
                        </p>
                        <div class="a10-fn-code">void setup() {
  pinMode(13, OUTPUT); // Configura o pino 13 como saída
  Serial.begin(9600);  // Abre o canal com o PC
}</div>
                    </div>

                    <div style="background:#1E293B;padding:16px;border-radius:14px;border-top:4px solid #10B981;">
                        <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">
                            <span style="font-size:1.3rem;">🔄</span>
                            <strong style="color:#34D399;font-size:1.05rem;font-family:'Consolas',monospace;">void loop() { ... }</strong>
                        </div>
                        <p style="color:#CBD5E1;font-size:0.88rem;line-height:1.6;margin:0 0 10px;">
                            <b>O que é:</b> É o motor eterno do microcontrolador!
                            <br>
                            <b>Quantas vezes roda:</b> Repete <b>PARA SEMPRE</b> sem parar! Quando a execução chega na última chave <code>}</code>, ela volta imediatamente para a primeira linha do loop!
                            <br>
                            <b>Para que serve:</b> É aqui dentro que seu projeto vive: ler sensores, piscar LEDs, tomar decisões e mover motores!
                        </p>
                        <div class="a10-fn-code">void loop() {
  digitalWrite(13, HIGH); // Liga LED
  delay(1000);            // Espera 1s
  digitalWrite(13, LOW);  // Desliga LED
  delay(1000);            // Espera 1s e repete!
}</div>
                    </div>
                </div>
            </div>

            <!-- O DICIONÁRIO DAS 7 FUNÇÕES DE OURO -->
            <div style="margin-bottom:18px;">
                <h3 style="color:white;font-family:'Fredoka One';margin:0 0 6px;font-size:1.5rem;display:flex;align-items:center;gap:10px;">
                    <span>📖</span> O Grande Dicionário das Funções Essenciais do Arduino
                </h3>
                <p style="color:#94A3B8;margin:0;font-size:0.95rem;">Clique e aprenda o que cada comando faz, com analogias simples que nunca mais saem da cabeça:</p>
            </div>

            <div class="a10-dict-grid">
                <!-- 1. pinMode -->
                <div class="a10-fn-card" style="border-top:4px solid #38BDF8;">
                    <div class="a10-fn-header">
                        <span style="font-size:1.5rem;">🛠️</span>
                        <div>
                            <div class="a10-fn-name">pinMode(pino, MODO);</div>
                            <span style="font-size:0.75rem;background:#0284C7;color:white;padding:2px 8px;border-radius:6px;font-weight:bold;">Configuração</span>
                        </div>
                    </div>
                    <p style="font-size:0.86rem;line-height:1.5;margin:0;">
                        <b>O que faz:</b> Define se o pino do Arduino vai <b>enviar energia</b> ou <b>ouvir sinais</b>.
                    </p>
                    <div class="a10-analogy-box">
                        <b>Analogia Maker:</b> É como decidir se um soldado vai usar um megafone para <b>falar</b> (<code>OUTPUT</code>) ou um fone de ouvido para <b>escutar</b> (<code>INPUT</code>).
                    </div>
                    <p style="font-size:0.82rem;color:#CBD5E1;margin:4px 0;">
                        • <code>OUTPUT:</code> Saída de 5V (para acender LEDs, ligar buzzers ou telas).<br>
                        • <code>INPUT:</code> Entrada para escutar botões e sensores.<br>
                        • <code>INPUT_PULLUP:</code> Entrada com resistor interno ligado em 5V.
                    </p>
                    <div class="a10-fn-code">pinMode(13, OUTPUT); // Pino 13 vira saída de 5V
pinMode(2, INPUT);   // Pino 2 ouve botão</div>
                </div>

                <!-- 2. digitalWrite -->
                <div class="a10-fn-card" style="border-top:4px solid #EF4444;">
                    <div class="a10-fn-header">
                        <span style="font-size:1.5rem;">⚡</span>
                        <div>
                            <div class="a10-fn-name">digitalWrite(pino, VALOR);</div>
                            <span style="font-size:0.75rem;background:#DC2626;color:white;padding:2px 8px;border-radius:6px;font-weight:bold;">Saída Digital</span>
                        </div>
                    </div>
                    <p style="font-size:0.86rem;line-height:1.5;margin:0;">
                        <b>O que faz:</b> Liga ou desliga totalmente a eletricidade de um pino digital configurado como OUTPUT.
                    </p>
                    <div class="a10-analogy-box">
                        <b>Analogia Maker:</b> É igualzinho ao interruptor da lâmpada do seu quarto: ou a luz está totalmente acesa (HIGH) ou apagada (LOW)!
                    </div>
                    <p style="font-size:0.82rem;color:#CBD5E1;margin:4px 0;">
                        • <code>HIGH:</code> Envia força total de <b>5.0 Volts</b>.<br>
                        • <code>LOW:</code> Corta a energia para <b>0.0 Volts</b> (GND).
                    </p>
                    <div class="a10-fn-code">digitalWrite(13, HIGH); // Manda 5V (Acende o LED!)
digitalWrite(13, LOW);  // Corta para 0V (Apaga o LED!)</div>
                </div>

                <!-- 3. digitalRead -->
                <div class="a10-fn-card" style="border-top:4px solid #10B981;">
                    <div class="a10-fn-header">
                        <span style="font-size:1.5rem;">👂</span>
                        <div>
                            <div class="a10-fn-name">digitalRead(pino);</div>
                            <span style="font-size:0.75rem;background:#059669;color:white;padding:2px 8px;border-radius:6px;font-weight:bold;">Entrada Digital</span>
                        </div>
                    </div>
                    <p style="font-size:0.86rem;line-height:1.5;margin:0;">
                        <b>O que faz:</b> Pergunta se um pino digital está recebendo 5V ou 0V naquele exato milissegundo.
                    </p>
                    <div class="a10-analogy-box">
                        <b>Analogia Maker:</b> É como abrir os olhos e checar se o semáforo da esquina está com a luz acesa ou apagada. Devolve apenas duas respostas: Sim ou Não!
                    </div>
                    <p style="font-size:0.82rem;color:#CBD5E1;margin:4px 0;">
                        • Retorna <code>HIGH</code> se houver 5V conectado.<br>
                        • Retorna <code>LOW</code> se estiver em 0V.
                    </p>
                    <div class="a10-fn-code">int estadoBotao = digitalRead(2);
if (estadoBotao == HIGH) {
  // O botão está apertado!
}</div>
                </div>

                <!-- 4. analogRead -->
                <div class="a10-fn-card" style="border-top:4px solid #F59E0B;">
                    <div class="a10-fn-header">
                        <span style="font-size:1.5rem;">🎛️</span>
                        <div>
                            <div class="a10-fn-name">analogRead(pinoAnalógico);</div>
                            <span style="font-size:0.75rem;background:#D97706;color:white;padding:2px 8px;border-radius:6px;font-weight:bold;">Entrada Analógica</span>
                        </div>
                    </div>
                    <p style="font-size:0.86rem;line-height:1.5;margin:0;">
                        <b>O que faz:</b> Lê valores intermediários contínuos nos pinos analógicos (<b>A0 a A5</b>).
                    </p>
                    <div class="a10-analogy-box">
                        <b>Analogia Maker:</b> Em vez de só ligado/desligado, é como um termômetro com escala graduada que mede qualquer temperatura entre frio e calor!
                    </div>
                    <p style="font-size:0.82rem;color:#CBD5E1;margin:4px 0;">
                        • O chip converte a tensão de 0V a 5V em números de <b>0 a 1023</b> (1024 níveis!).
                    </p>
                    <div class="a10-fn-code">int luz = analogRead(A1); // Lê o sensor LDR
if (luz < 400) {
  // Está escuro! Acenda a luz!
}</div>
                </div>

                <!-- 5. analogWrite (PWM) -->
                <div class="a10-fn-card" style="border-top:4px solid #A855F7;">
                    <div class="a10-fn-header">
                        <span style="font-size:1.5rem;">🌊</span>
                        <div>
                            <div class="a10-fn-name">analogWrite(pinoPWM, valor);</div>
                            <span style="font-size:0.75rem;background:#7E22CE;color:white;padding:2px 8px;border-radius:6px;font-weight:bold;">Modulação PWM</span>
                        </div>
                    </div>
                    <p style="font-size:0.86rem;line-height:1.5;margin:0;">
                        <b>O que faz:</b> Simula uma voltagem intermediária nos pinos com o símbolo <b>~ (3, 5, 6, 9, 10, 11)</b>.
                    </p>
                    <div class="a10-analogy-box">
                        <b>Analogia Maker:</b> É o botão regulador (dimmer) de ventilador de teto ou de brilho de lâmpada: você escolhe a intensidade suave de 0 a 255!
                    </div>
                    <p style="font-size:0.82rem;color:#CBD5E1;margin:4px 0;">
                        • <code>0:</code> Totalmente apagado (0% PWM).<br>
                        • <code>128:</code> Meio brilho (50% PWM, 2.5V médios).<br>
                        • <code>255:</code> Força máxima (100% PWM, 5.0V).
                    </p>
                    <div class="a10-fn-code">analogWrite(9, 64);  // LED brilhando fraquinho
analogWrite(9, 255); // LED no brilho máximo</div>
                </div>

                <!-- 6. delay -->
                <div class="a10-fn-card" style="border-top:4px solid #EC4899;">
                    <div class="a10-fn-header">
                        <span style="font-size:1.5rem;">⏱️</span>
                        <div>
                            <div class="a10-fn-name">delay(milissegundos);</div>
                            <span style="font-size:0.75rem;background:#BE185D;color:white;padding:2px 8px;border-radius:6px;font-weight:bold;">Temporização</span>
                        </div>
                    </div>
                    <p style="font-size:0.86rem;line-height:1.5;margin:0;">
                        <b>O que faz:</b> Pausa a execução do programa e congela o microcontrolador durante um tempo pré-definido.
                    </p>
                    <div class="a10-analogy-box">
                        <b>Analogia Maker:</b> É a soneca rápida do robô! Lembre-se: robôs contam o tempo em <b>milissegundos (ms)</b>.
                    </div>
                    <p style="font-size:0.82rem;color:#CBD5E1;margin:4px 0;">
                        • <b>Regra de Ouro:</b> 1 segundo = 1.000 ms.<br>
                        • 2 segundos = 2.000 ms | Meio segundo = 500 ms.
                    </p>
                    <div class="a10-fn-code">delay(1000); // Espera 1 segundo
delay(500);  // Espera meio segundo</div>
                </div>

                <!-- 7. Serial -->
                <div class="a10-fn-card" style="border-top:4px solid #14B8A6;">
                    <div class="a10-fn-header">
                        <span style="font-size:1.5rem;">💬</span>
                        <div>
                            <div class="a10-fn-name">Serial.println(mensagem);</div>
                            <span style="font-size:0.75rem;background:#0F766E;color:white;padding:2px 8px;border-radius:6px;font-weight:bold;">Comunicação Serial</span>
                        </div>
                    </div>
                    <p style="font-size:0.86rem;line-height:1.5;margin:0;">
                        <b>O que faz:</b> Envia mensagens de texto e números do Arduino para a tela do computador pelo cabo USB.
                    </p>
                    <div class="a10-analogy-box">
                        <b>Analogia Maker:</b> É o rádio walkie-talkie da placa! O Arduino fala e o computador escuta na janela do Monitor Serial!
                    </div>
                    <p style="font-size:0.82rem;color:#CBD5E1;margin:4px 0;">
                        • Exige <code>Serial.begin(9600);</code> no setup!<br>
                        • <code>print:</code> Escreve sem pular linha.<br>
                        • <code>println:</code> Escreve e pula para a próxima linha!
                    </p>
                    <div class="a10-fn-code">Serial.begin(9600); // No setup
Serial.print("Temperatura: ");
Serial.println(25.4); // No loop</div>
                </div>
            </div>

            <!-- PLAYGROUND INTERATIVO DE FUNÇÕES (LABORATÓRIO TÁTIL) -->
            <div style="background:#0F172A;border:2px solid #38BDF8;border-radius:20px;padding:22px;margin-bottom:24px;">
                <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;margin-bottom:14px;border-bottom:1px solid #1E293B;padding-bottom:10px;">
                    <div style="display:flex;align-items:center;gap:10px;">
                        <span style="font-size:1.5rem;">🎮</span>
                        <h3 style="color:white;font-family:'Fredoka One';margin:0;font-size:1.35rem;">
                            Playground Interativo: Teste as Funções ao Vivo!
                        </h3>
                    </div>
                    <span style="color:#38BDF8;font-size:0.82rem;font-weight:bold;background:#034262;padding:4px 12px;border-radius:8px;">
                        Simulação em Tempo Real no Navegador
                    </span>
                </div>

                <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:16px;">
                    <!-- Coluna de Controles -->
                    <div>
                        <strong style="color:#BAE6FD;font-size:0.9rem;">1. Testar <code>digitalWrite(13, ...)</code>:</strong>
                        <div style="display:flex;gap:8px;margin:8px 0 16px;">
                            <button onclick="a10_testDigitalWrite('HIGH')" style="flex:1;background:#064E3B;color:#34D399;border:1px solid #10B981;padding:8px;border-radius:8px;font-weight:bold;cursor:pointer;">
                                💡 digitalWrite(13, HIGH)
                            </button>
                            <button onclick="a10_testDigitalWrite('LOW')" style="flex:1;background:#7F1D1D;color:#FCA5A5;border:1px solid #EF4444;padding:8px;border-radius:8px;font-weight:bold;cursor:pointer;">
                                🌑 digitalWrite(13, LOW)
                            </button>
                        </div>

                        <strong style="color:#BAE6FD;font-size:0.9rem;">2. Testar <code>analogWrite(11, PWM)</code>:</strong>
                        <div style="margin:8px 0 16px;">
                            <div style="display:flex;justify-content:space-between;font-size:0.8rem;color:#94A3B8;margin-bottom:4px;">
                                <span>Brilho Suave: <b id="a10-play-pwm-label" style="color:#38BDF8;">180 / 255</b></span>
                                <span id="a10-play-pwm-volt" style="color:#A7F3D0;">3.53V médios</span>
                            </div>
                            <input type="range" min="0" max="255" value="180" style="width:100%;cursor:pointer;" oninput="a10_testAnalogWrite(this.value)">
                        </div>

                        <strong style="color:#BAE6FD;font-size:0.9rem;">3. Testar <code>analogRead(A0)</code>:</strong>
                        <div style="margin:8px 0 16px;">
                            <button onclick="a10_testAnalogRead()" style="width:100%;background:#78350F;color:#FDE68A;border:1px solid #F59E0B;padding:8px;border-radius:8px;font-weight:bold;cursor:pointer;">
                                🎛️ Ler Sensor Analógico: analogRead(A0)
                            </button>
                        </div>

                        <strong style="color:#BAE6FD;font-size:0.9rem;">4. Testar <code>Serial.println()</code>:</strong>
                        <div style="display:flex;gap:6px;margin-top:8px;flex-wrap:wrap;">
                            <button onclick="a10_testSerialPrint('Olá PC! Sou o Arduino!')" style="background:#0F172A;border:1px solid #14B8A6;color:#5EEAD4;padding:6px 10px;border-radius:6px;font-size:0.78rem;cursor:pointer;">"Olá PC!"</button>
                            <button onclick="a10_testSerialPrint('Sensor de Luz = 512')" style="background:#0F172A;border:1px solid #14B8A6;color:#5EEAD4;padding:6px 10px;border-radius:6px;font-size:0.78rem;cursor:pointer;">"Sensor = 512"</button>
                            <button onclick="a10_testSerialPrint('ALERTA: Motor Ligado')" style="background:#0F172A;border:1px solid #14B8A6;color:#5EEAD4;padding:6px 10px;border-radius:6px;font-size:0.78rem;cursor:pointer;">"Motor Ligado"</button>
                            <button onclick="a10_clearSerial()" style="background:#334155;border:none;color:white;padding:6px 10px;border-radius:6px;font-size:0.78rem;cursor:pointer;">Limpar</button>
                        </div>
                    </div>

                    <!-- Coluna de Feedback Visual da Placa Virtual -->
                    <div style="background:#080E1E;border-radius:14px;padding:16px;border:1px solid #1E293B;display:flex;flex-direction:column;justify-content:space-between;">
                        <div>
                            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;">
                                <span style="font-size:0.8rem;color:#94A3B8;font-weight:bold;">PLACA ARDUINO VIRTUAL:</span>
                                <span style="font-size:0.75rem;background:#064E3B;color:#34D399;padding:2px 8px;border-radius:4px;">5.0V ATIVO</span>
                            </div>

                            <!-- Placa SVG Simplificada -->
                            <svg viewBox="0 0 320 120" style="width:100%;height:auto;display:block;">
                                <rect x="10" y="10" width="300" height="100" rx="10" fill="#008184" stroke="#00979D" stroke-width="2"/>
                                <!-- Chip ATmega -->
                                <rect x="80" y="35" width="100" height="45" rx="3" fill="#1E293B" stroke="#475569" stroke-width="1.5"/>
                                <text x="130" y="62" text-anchor="middle" fill="#E2E8F0" font-size="9" font-family="monospace">ATmega328P</text>

                                <!-- LED 13 Digital -->
                                <circle id="a10-play-led13" cx="210" cy="45" r="9" fill="#334155"/>
                                <text x="210" y="70" text-anchor="middle" fill="#BAE6FD" font-size="8" font-weight="bold">LED D13</text>

                                <!-- LED PWM 11 -->
                                <circle id="a10-play-led-pwm" cx="255" cy="45" r="9" fill="#38BDF8" opacity="0.7"/>
                                <text x="255" y="70" text-anchor="middle" fill="#BAE6FD" font-size="8" font-weight="bold">PWM ~11</text>
                            </svg>

                            <div id="a10-play-status-text" style="margin-top:10px;font-size:0.85rem;min-height:22px;">
                                <span style="color:#94A3B8;">Clique em qualquer comando ao lado para testar!</span>
                            </div>
                        </div>

                        <!-- Monitor Serial Virtual Pequeno -->
                        <div style="margin-top:12px;background:#0F172A;border:1px solid #334155;border-radius:8px;padding:8px 12px;">
                            <div style="font-size:0.75rem;color:#94A3B8;font-weight:bold;margin-bottom:4px;">MONITOR SERIAL (COM3 - 9600 BAUD):</div>
                            <div id="a10-play-serial-console" style="height:60px;overflow-y:auto;font-family:monospace;font-size:0.78rem;">
                                <span style="color:#64748B;">Aguardando Serial.println()...</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Linha de Código Executada -->
                <div style="margin-top:14px;background:#050B14;border-radius:10px;padding:10px 14px;border:1px solid #1E293B;">
                    <span style="color:#64748B;font-size:0.76rem;text-transform:uppercase;font-weight:bold;">Comando Executado:</span>
                    <div id="a10-play-executed-code" style="color:#38BDF8;font-family:monospace;font-size:0.88rem;margin-top:2px;">
                        // Escolha uma função acima para ver a linha correspondente em C++
                    </div>
                </div>
            </div>

            <!-- MEGA QUIZ DE FIXAÇÃO DAS FUNÇÕES (5 PERGUNTAS) -->
            <div style="background:#0F172A;border:2px solid #F59E0B;border-radius:20px;padding:22px;margin-bottom:24px;">
                <div style="display:flex;align-items:center;gap:10px;margin-bottom:16px;">
                    <span style="font-size:1.6rem;">🏆</span>
                    <div>
                        <h3 style="color:#FBBF24;font-family:'Fredoka One';margin:0;font-size:1.4rem;">
                            Mega Desafio Maker: Quiz de Fixação das Funções
                        </h3>
                        <p style="color:#CBD5E1;font-size:0.88rem;margin:2px 0 0;">
                            Responda às 5 perguntas rápidas para provar que domina a programação de microcontroladores!
                        </p>
                    </div>
                </div>

                <!-- Questão 1 -->
                <div class="a10-quiz-card" id="a10-quiz-q1">
                    <strong style="color:white;font-size:0.95rem;">1. Qual função usamos para mandar 5 Volts e acender uma lâmpada ou LED no pino digital 13?</strong>
                    <div style="margin-top:10px;">
                        <button class="a10-quiz-opt" id="a10-q1-opt1" onclick="a10_answerQuiz(1, 1, true)">A) digitalWrite(13, HIGH);</button>
                        <button class="a10-quiz-opt" id="a10-q1-opt2" onclick="a10_answerQuiz(1, 2, false)">B) pinMode(13, INPUT);</button>
                        <button class="a10-quiz-opt" id="a10-q1-opt3" onclick="a10_answerQuiz(1, 3, false)">C) analogRead(13);</button>
                    </div>
                    <div id="a10-feedback-q1" style="display:none;margin-top:6px;font-size:0.85rem;"></div>
                </div>

                <!-- Questão 2 -->
                <div class="a10-quiz-card" id="a10-quiz-q2">
                    <strong style="color:white;font-size:0.95rem;">2. Onde devemos colocar o comando pinMode() para configurar se um pino é entrada ou saída?</strong>
                    <div style="margin-top:10px;">
                        <button class="a10-quiz-opt" id="a10-q2-opt1" onclick="a10_answerQuiz(2, 1, false)">A) No meio do void loop(), repetindo várias vezes</button>
                        <button class="a10-quiz-opt" id="a10-q2-opt2" onclick="a10_answerQuiz(2, 2, true)">B) Dentro do void setup(), pois roda apenas 1 vez ao ligar</button>
                        <button class="a10-quiz-opt" id="a10-q2-opt3" onclick="a10_answerQuiz(2, 3, false)">C) Não precisa usar pinMode em nenhum lugar</button>
                    </div>
                    <div id="a10-feedback-q2" style="display:none;margin-top:6px;font-size:0.85rem;"></div>
                </div>

                <!-- Questão 3 -->
                <div class="a10-quiz-card" id="a10-quiz-q3">
                    <strong style="color:white;font-size:0.95rem;">3. Qual função mede valores graduados de 0 a 1023 em sensores como potenciômetro e sensor LDR?</strong>
                    <div style="margin-top:10px;">
                        <button class="a10-quiz-opt" id="a10-q3-opt1" onclick="a10_answerQuiz(3, 1, false)">A) delay(1000);</button>
                        <button class="a10-quiz-opt" id="a10-q3-opt2" onclick="a10_answerQuiz(3, 2, true)">B) analogRead(A0);</button>
                        <button class="a10-quiz-opt" id="a10-q3-opt3" onclick="a10_answerQuiz(3, 3, false)">C) digitalRead(13);</button>
                    </div>
                    <div id="a10-feedback-q3" style="display:none;margin-top:6px;font-size:0.85rem;"></div>
                </div>

                <!-- Questão 4 -->
                <div class="a10-quiz-card" id="a10-quiz-q4">
                    <strong style="color:white;font-size:0.95rem;">4. Quantos milissegundos devemos escrever no delay() para pausar o código por 3 segundos inteiros?</strong>
                    <div style="margin-top:10px;">
                        <button class="a10-quiz-opt" id="a10-q4-opt1" onclick="a10_answerQuiz(4, 1, true)">A) delay(3000);</button>
                        <button class="a10-quiz-opt" id="a10-q4-opt2" onclick="a10_answerQuiz(4, 2, false)">B) delay(3);</button>
                        <button class="a10-quiz-opt" id="a10-q4-opt3" onclick="a10_answerQuiz(4, 3, false)">C) delay(30);</button>
                    </div>
                    <div id="a10-feedback-q4" style="display:none;margin-top:6px;font-size:0.85rem;"></div>
                </div>

                <!-- Questão 5 -->
                <div class="a10-quiz-card" id="a10-quiz-q5">
                    <strong style="color:white;font-size:0.95rem;">5. Para que serve a função Serial.println("Texto")?</strong>
                    <div style="margin-top:10px;">
                        <button class="a10-quiz-opt" id="a10-q5-opt1" onclick="a10_answerQuiz(5, 1, false)">A) Para queimar o microcontrolador</button>
                        <button class="a10-quiz-opt" id="a10-q5-opt2" onclick="a10_answerQuiz(5, 2, false)">B) Para ligar os motores com força total</button>
                        <button class="a10-quiz-opt" id="a10-q5-opt3" onclick="a10_answerQuiz(5, 3, true)">C) Para enviar mensagens do Arduino para o computador pelo cabo USB</button>
                    </div>
                    <div id="a10-feedback-q5" style="display:none;margin-top:6px;font-size:0.85rem;"></div>
                </div>

                <div id="a10-quiz-final-score" style="display:none;margin-top:14px;"></div>
            </div>

            <!-- BOTÃO DE CELEBRAÇÃO & CERTIFICADO FINAL -->
            <div style="background:linear-gradient(135deg,#1E293B,#0F172A);border:3px solid #10B981;border-radius:24px;padding:30px;text-align:center;box-shadow:0 12px 35px rgba(16,185,129,0.25);">
                <div style="font-size:3rem;margin-bottom:8px;">🎓⭐</div>
                <h2 style="font-family:'Fredoka One';color:white;font-size:2rem;margin:0 0 10px;">
                    Parabéns, Futuro Engenheiro Maker!
                </h2>
                <p style="color:#A7F3D0;font-size:1.05rem;max-width:680px;margin:0 auto 20px;line-height:1.6;">
                    Você concluiu com maestria a Trilha Completa de 10 Aulas do <b>Laboratório Maker de Robótica &amp; Arduino</b>! Você aprendeu algoritmos, loops, decisões, variáveis, circuitos elétricos, protoboard, o chip ATmega328P, sensores e telas!
                </p>
                <button onclick="openCertificateModal()" style="background:linear-gradient(135deg,#F59E0B,#D97706);color:#0F172A;border:none;padding:16px 36px;border-radius:50px;font-family:'Fredoka One';font-size:1.2rem;cursor:pointer;box-shadow:0 8px 30px rgba(245,158,11,0.4);border-bottom:4px solid #B45309;transition:0.2s;">
                    <i class="fa-solid fa-award"></i> GERAR MEU CERTIFICADO OFICIAL AGORA! 🏆
                </button>
            </div>
        </div>
    `;
}

// Exportações globais para a SPA
window.loadAula10 = loadAula10;
window.a10_testDigitalWrite = a10_testDigitalWrite;
window.a10_testAnalogWrite = a10_testAnalogWrite;
window.a10_testAnalogRead = a10_testAnalogRead;
window.a10_testSerialPrint = a10_testSerialPrint;
window.a10_clearSerial = a10_clearSerial;
window.a10_answerQuiz = a10_answerQuiz;

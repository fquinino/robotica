/* ==========================================================================
   AULA 8 — OFICINA DO ARDUINO UNO & QUIZ DE C/C++
   ========================================================================== */

    function loadArduino() {
        const container = document.getElementById('arduino-container');
        container.innerHTML = `
            <style>
                .ard-wrapper { color:#CBD5E1; font-family:'Nunito', sans-serif; }
                .ard-wrapper .tabs { display:flex; gap:8px; background:#1E293B; padding:6px; border-radius:30px; margin:10px 0 20px; flex-wrap:wrap; justify-content:center; }
                .ard-wrapper .tab { flex:1; min-width:120px; background:transparent; border:none; color:#94A3B8; padding:10px 14px; border-radius:24px; font-weight:800; font-size:0.9rem; cursor:pointer; transition:all 0.25s; text-align:center; }
                .ard-wrapper .tab:hover { color:white; background:#334155; }
                .ard-wrapper .tab.active { background:linear-gradient(135deg, #EF4444, #DC2626); color:white; box-shadow:0 0 15px rgba(239,68,68,0.5); }
                .ard-wrapper .panel { display:none; background:#1E293B; border-radius:24px; padding:24px; border:2px solid #334155; animation:ardFadeIn 0.3s ease; }
                .ard-wrapper .panel.active { display:block; }
                @keyframes ardFadeIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }

                /* Cards didáticos */
                .ard-card { background:#0F172A; border-radius:18px; padding:18px; border:2px solid #334155; margin-bottom:16px; transition:border-color 0.2s; }
                .ard-card:hover { border-color:#38BDF8; }
                .ard-grid-3 { display:grid; grid-template-columns:repeat(auto-fit, minmax(240px, 1fr)); gap:16px; margin:16px 0; }
                .ard-pill { display:inline-block; padding:4px 10px; border-radius:10px; font-weight:800; font-size:0.8rem; }

                /* Tubo de Elétrons / Simulação Lei de Ohm */
                .ard-ohm-box { background:#0F172A; border-radius:20px; padding:20px; border:2px solid #334155; text-align:center; }
                .ard-slider-row { display:flex; flex-direction:column; gap:6px; margin-bottom:14px; text-align:left; }
                .ard-slider-row label { font-weight:800; color:#CBD5E1; font-size:0.95rem; display:flex; justify-content:space-between; }
                .ard-slider-row input[type="range"] { width:100%; accent-color:#EF4444; height:8px; border-radius:4px; background:#334155; cursor:pointer; }
                
                .ard-pipe-container { width:100%; max-width:480px; height:60px; background:#1E293B; border-radius:30px; border:3px solid #475569; position:relative; overflow:hidden; margin:15px auto; display:flex; align-items:center; }
                .ard-pipe-resistor { width:50px; height:100%; background:repeating-linear-gradient(45deg, #78350F, #78350F 8px, #D97706 8px, #D97706 16px); position:absolute; left:calc(50% - 25px); top:0; z-index:2; border-left:2px solid #F59E0B; border-right:2px solid #F59E0B; opacity:0.85; transition:width 0.3s; }
                .ard-pipe-electrons { width:200%; height:100%; position:absolute; left:0; top:0; display:flex; align-items:center; gap:20px; z-index:1; }
                .ard-electron { width:14px; height:14px; border-radius:50%; background:#38BDF8; box-shadow:0 0 10px #38BDF8; font-size:10px; font-weight:900; color:#0F172A; display:flex; align-items:center; justify-content:center; flex-shrink:0; }

                /* Triângulo da Lei de Ohm */
                .ard-triangle-wrap { display:flex; justify-content:center; align-items:center; margin:15px 0; gap:20px; flex-wrap:wrap; }
                .ard-triangle-btn { background:#0F172A; border:2px solid #334155; padding:12px 18px; border-radius:14px; color:white; font-weight:800; cursor:pointer; transition:0.2s; }
                .ard-triangle-btn:hover, .ard-triangle-btn.active { border-color:#EF4444; background:#EF4444; color:white; transform:scale(1.05); }

                /* Osciloscópio PWM */
                .ard-osc-canvas { width:100%; max-width:480px; height:120px; background:#0B132B; border-radius:14px; border:2px solid #1E293B; margin:12px auto; display:block; }
                .ard-fan { width:60px; height:60px; border-radius:50%; background:#334155; border:3px solid #64748B; position:relative; display:flex; align-items:center; justify-content:center; margin:0 auto; }
                .ard-fan-blade { width:8px; height:50px; background:#38BDF8; border-radius:4px; position:absolute; }
                .ard-fan-blade:nth-child(2) { transform:rotate(90deg); }

                /* Quiz */
                .ard-quiz-btn { background:#334155; border:none; padding:14px 18px; border-radius:14px; color:white; font-weight:800; cursor:pointer; transition:0.2s; text-align:left; display:flex; align-items:center; gap:10px; }
                .ard-quiz-btn:hover { background:#475569; transform:translateX(4px); }
                .ard-quiz-btn.correct { background:#10B981 !important; color:white; }
                .ard-quiz-btn.wrong { background:#EF4444 !important; color:white; }

                /* Modal */
                .ard-modal { position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.85); display:flex; justify-content:center; align-items:center; z-index:999; opacity:0; pointer-events:none; transition:0.3s; }
                .ard-modal.active { opacity:1; pointer-events:all; }
                .ard-modal-box { background:#1E293B; padding:32px; border-radius:28px; max-width:440px; text-align:center; border:3px solid #EF4444; box-shadow:0 0 40px rgba(239,68,68,0.3); }

                /* Animação Motor DC */
                @keyframes ardSpin { from { transform:rotate(0deg); } to { transform:rotate(360deg); } }
            </style>
            <div class="ard-wrapper">
                <div class="tabs">
                    <button class="tab active" data-tab="ard-tab-elec"><i class="fa-solid fa-bolt"></i> 1. Tensão & Corrente</button>
                    <button class="tab" data-tab="ard-tab-ohm"><i class="fa-solid fa-calculator"></i> 2. Lei de Ohm</button>
                    <button class="tab" data-tab="ard-tab-pwm"><i class="fa-solid fa-wave-square"></i> 3. O que é PWM?</button>
                    <button class="tab" data-tab="ard-tab-board"><i class="fa-solid fa-microchip"></i> 4. Placa Arduino</button>
                    <button class="tab" data-tab="ard-tab-code"><i class="fa-solid fa-code"></i> 5. Código C++</button>
                    <button class="tab" data-tab="ard-tab-quiz"><i class="fa-solid fa-brain"></i> 6. Quiz Maker</button>
                </div>

                <!-- ================= ABA 1: TENSÃO, CORRENTE E RESISTÊNCIA ================= -->
                <div class="panel active" id="ard-tab-elec">
                    <div style="display:flex;align-items:center;gap:12px;margin-bottom:15px;">
                        <span style="background:#EF4444;color:white;width:42px;height:42px;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:1.4rem;"><i class="fa-solid fa-faucet-drip"></i></span>
                        <div>
                            <h2 style="color:white;font-family:'Fredoka One';margin:0;">A Tríade da Eletricidade</h2>
                            <p style="color:#94A3B8;margin:0;font-size:0.9rem;">Entenda o que faz um circuito funcionar através da analogia da água.</p>
                        </div>
                    </div>

                    <div class="ard-grid-3">
                        <div class="ard-card" style="border-top:4px solid #F59E0B;">
                            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
                                <span style="color:#F59E0B;font-weight:900;font-size:1.1rem;"><i class="fa-solid fa-battery-full"></i> TENSÃO (V)</span>
                                <span class="ard-pill" style="background:#78350F;color:#FDE68A;">Volts [V]</span>
                            </div>
                            <p style="color:#CBD5E1;font-size:0.9rem;line-height:1.5;">É a <strong>pressão</strong> que empurra os elétrons! Como uma <strong>caixa d'água alta</strong>: quanto mais alta a caixa, mais força a água tem para descer pelos canos.</p>
                            <div style="background:#1E293B;padding:8px 12px;border-radius:10px;font-size:0.8rem;color:#FDE68A;margin-top:10px;">
                                📌 <strong>No Arduino:</strong> O pino fornece <strong>5V</strong> (pressão constante).
                            </div>
                        </div>

                        <div class="ard-card" style="border-top:4px solid #38BDF8;">
                            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
                                <span style="color:#38BDF8;font-weight:900;font-size:1.1rem;"><i class="fa-solid fa-water"></i> CORRENTE (I)</span>
                                <span class="ard-pill" style="background:#0C4A6E;color:#BAE6FD;">Amperes [A] / [mA]</span>
                            </div>
                            <p style="color:#CBD5E1;font-size:0.9rem;line-height:1.5;">É o <strong>fluxo ou vazão</strong> de elétrons passando pelo fio por segundo! Como a quantidade de litros de água que saem da torneira.</p>
                            <div style="background:#1E293B;padding:8px 12px;border-radius:10px;font-size:0.8rem;color:#BAE6FD;margin-top:10px;">
                                📌 <strong>Medida:</strong> 1 Ampere = 1000 mA. Um LED precisa de ~<strong>20 mA</strong> (0.02 A).
                            </div>
                        </div>

                        <div class="ard-card" style="border-top:4px solid #34D399;">
                            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
                                <span style="color:#34D399;font-weight:900;font-size:1.1rem;"><i class="fa-solid fa-shield-halved"></i> RESISTÊNCIA (R)</span>
                                <span class="ard-pill" style="background:#064E3B;color:#A7F3D0;">Ohms [Ω]</span>
                            </div>
                            <p style="color:#CBD5E1;font-size:0.9rem;line-height:1.5;">É o <strong>estreitamento do cano</strong> ou o obstáculo. Dificulta a passagem da corrente para evitar que o fluxo seja infinito (curto-circuito!).</p>
                            <div style="background:#1E293B;padding:8px 12px;border-radius:10px;font-size:0.8rem;color:#A7F3D0;margin-top:10px;">
                                📌 <strong>Exemplo:</strong> Um resistor de <strong>220Ω</strong> limita a corrente do LED nos 5V.
                            </div>
                        </div>
                    </div>

                    <div style="background:#0F172A;border-radius:16px;padding:16px;border:2px solid #334155;display:flex;align-items:center;gap:15px;flex-wrap:wrap;">
                        <div style="font-size:2.5rem;color:#EF4444;"><i class="fa-solid fa-triangle-exclamation"></i></div>
                        <div style="flex:1;min-width:260px;">
                            <h4 style="color:white;margin:0 0 4px;">Por que o circuito precisa de um Resistor?</h4>
                            <p style="color:#94A3B8;font-size:0.85rem;margin:0;">Se você ligar um LED direto em 5V sem resistor, a resistência do circuito é quase ZERO. A corrente sobe para centenas de miliamperes em milissegundos e o LED <strong>queima instantaneamente</strong> com um estouro!</p>
                        </div>
                    </div>
                </div>

                <!-- ================= ABA 2: LEI DE OHM E CALCULADORA ================= -->
                <div class="panel" id="ard-tab-ohm">
                    <div style="display:flex;align-items:center;gap:12px;margin-bottom:15px;">
                        <span style="background:#EF4444;color:white;width:42px;height:42px;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:1.4rem;"><i class="fa-solid fa-calculator"></i></span>
                        <div>
                            <h2 style="color:white;font-family:'Fredoka One';margin:0;">Como Calcular a Lei de Ohm (V = R × I)</h2>
                            <p style="color:#94A3B8;margin:0;font-size:0.9rem;">A regra de ouro da eletrônica descoberta pelo físico Georg Simon Ohm.</p>
                        </div>
                    </div>

                    <!-- Triângulo Mágico Interativo -->
                    <div class="ard-card" style="text-align:center;">
                        <h3 style="color:#F59E0B;margin-top:0;">🔺 O Triângulo Mágico da Lei de Ohm</h3>
                        <p style="color:#94A3B8;font-size:0.9rem;">Cubra com o dedo a letra da grandeza que você deseja descobrir:</p>
                        
                        <div class="ard-triangle-wrap">
                            <button class="ard-triangle-btn active" id="ard-tri-btn-v" onclick="ard_selectTriangle('V')">🎯 Quero Tensão (V)</button>
                            <button class="ard-triangle-btn" id="ard-tri-btn-i" onclick="ard_selectTriangle('I')">🎯 Quero Corrente (I)</button>
                            <button class="ard-triangle-btn" id="ard-tri-btn-r" onclick="ard_selectTriangle('R')">🎯 Quero Resistência (R)</button>
                        </div>

                        <div id="ard-tri-display" style="background:#1E293B;padding:16px;border-radius:14px;border:2px solid #475569;display:inline-block;min-width:320px;margin-top:10px;">
                            <div style="font-size:1.8rem;font-family:'Fredoka One';color:#FCD34D;" id="ard-tri-formula">V = R × I</div>
                            <div style="color:#CBD5E1;font-size:0.9rem;margin-top:6px;" id="ard-tri-desc">Para descobrir a Tensão (Volts), multiplique a Resistência (Ohms) pela Corrente (Amperes).</div>
                        </div>
                    </div>

                    <!-- Caso Prático Real: Resistor do LED -->
                    <div class="ard-card" style="border-left:6px solid #38BDF8;">
                        <h3 style="color:#38BDF8;margin-top:0;"><i class="fa-solid fa-lightbulb"></i> Exemplo Prático Maker: Dimensionando o Resistor para um LED no Arduino</h3>
                        <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(200px, 1fr));gap:12px;font-size:0.9rem;margin:12px 0;">
                            <div style="background:#1E293B;padding:10px;border-radius:10px;">
                                <strong style="color:#F59E0B;">1. Tensão da Fonte:</strong><br>O pino do Arduino fornece <strong>5.0V</strong>.
                            </div>
                            <div style="background:#1E293B;padding:10px;border-radius:10px;">
                                <strong style="color:#EF4444;">2. Queda no LED:</strong><br>LED Vermelho gasta cerca de <strong>2.0V</strong>.
                            </div>
                            <div style="background:#1E293B;padding:10px;border-radius:10px;">
                                <strong style="color:#38BDF8;">3. Tensão no Resistor:</strong><br>VR = 5.0V - 2.0V = <strong>3.0V</strong>.
                            </div>
                            <div style="background:#1E293B;padding:10px;border-radius:10px;">
                                <strong style="color:#34D399;">4. Corrente Desejada:</strong><br>I = 20mA = <strong>0.02A</strong>.
                            </div>
                        </div>
                        <div style="background:#0B132B;padding:14px;border-radius:12px;font-family:monospace;color:#FCD34D;font-size:1.05rem;border:1px solid #38BDF8;">
                            R = VR / I &nbsp;➔&nbsp; R = 3.0V / 0.02A &nbsp;➔&nbsp; <strong>R = 150 Ω</strong>
                        </div>
                        <p style="color:#94A3B8;font-size:0.85rem;margin:10px 0 0;">
                            💡 <em>Por que usamos <strong>220Ω</strong> ou <strong>330Ω</strong> na prática?</em> Porque 150Ω deixaria o LED no limite máximo. Com 220Ω, a corrente fica em confortáveis <strong>13.6 mA</strong>, garantindo alto brilho e durabilidade infinita!
                        </p>
                    </div>

                    <!-- Simulador Interativo com Tubo de Elétrons -->
                    <div class="ard-ohm-box">
                        <h3 style="color:white;margin-top:0;"><i class="fa-solid fa-sliders"></i> Simulador Interativo da Lei de Ohm</h3>
                        <p style="color:#94A3B8;font-size:0.9rem;">Mova a Tensão e a Resistência para ver como os elétrons aceleram ou desaceleram no condutor:</p>

                        <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;max-width:500px;margin:0 auto;">
                            <div class="ard-slider-row">
                                <label>Tensão (V): <span style="color:#F59E0B;font-weight:900;" id="ard-dyn-v-val">5.0 V</span></label>
                                <input type="range" id="ard-dyn-v-slider" min="1" max="12" step="0.5" value="5">
                            </div>
                            <div class="ard-slider-row">
                                <label>Resistência (R): <span style="color:#34D399;font-weight:900;" id="ard-dyn-r-val">220 Ω</span></label>
                                <input type="range" id="ard-dyn-r-slider" min="10" max="1000" step="10" value="220">
                            </div>
                        </div>

                        <!-- Tubo Visual Animado -->
                        <div class="ard-pipe-container" id="ard-pipe-wrap">
                            <div class="ard-pipe-resistor" id="ard-pipe-barrier"></div>
                            <div class="ard-pipe-electrons" id="ard-pipe-flow">
                                <div class="ard-electron">e-</div><div class="ard-electron">e-</div><div class="ard-electron">e-</div><div class="ard-electron">e-</div>
                                <div class="ard-electron">e-</div><div class="ard-electron">e-</div><div class="ard-electron">e-</div><div class="ard-electron">e-</div>
                                <div class="ard-electron">e-</div><div class="ard-electron">e-</div><div class="ard-electron">e-</div><div class="ard-electron">e-</div>
                            </div>
                        </div>

                        <div style="display:flex;justify-content:center;gap:20px;flex-wrap:wrap;margin:15px 0;">
                            <div style="background:#1E293B;padding:10px 16px;border-radius:12px;border:1px solid #475569;">
                                <div style="font-size:0.75rem;color:#94A3B8;">CORRENTE CALCULADA (I = V/R)</div>
                                <div style="font-size:1.5rem;font-weight:900;color:#38BDF8;" id="ard-dyn-i-val">22.7 mA</div>
                            </div>
                            <div style="background:#1E293B;padding:10px 16px;border-radius:12px;border:1px solid #475569;">
                                <div style="font-size:0.75rem;color:#94A3B8;">POTÊNCIA DISSIPADA (P = V×I)</div>
                                <div style="font-size:1.5rem;font-weight:900;color:#FCD34D;" id="ard-dyn-p-val">113.6 mW</div>
                            </div>
                        </div>

                        <div id="ard-dyn-status" style="padding:10px;border-radius:10px;font-weight:800;font-size:0.9rem;background:#064E3B;color:#34D399;">
                            ✅ Circuito Operando em Faixa Segura!
                        </div>
                    </div>
                </div>

                <!-- ================= ABA 3: TUDO SOBRE PWM ================= -->
                <div class="panel" id="ard-tab-pwm">
                    <div style="display:flex;align-items:center;gap:12px;margin-bottom:15px;">
                        <span style="background:#EF4444;color:white;width:42px;height:42px;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:1.4rem;"><i class="fa-solid fa-wave-square"></i></span>
                        <div>
                            <h2 style="color:white;font-family:'Fredoka One';margin:0;">O que é PWM (Modulação por Largura de Pulso)?</h2>
                            <p style="color:#94A3B8;margin:0;font-size:0.9rem;">Como o Arduino digital consegue simular tensões analógicas como 1.5V, 2.5V e 3.8V.</p>
                        </div>
                    </div>

                    <div class="ard-card" style="border-left:6px solid #A78BFA;">
                        <h3 style="color:#A78BFA;margin-top:0;">🤔 O Grande Dilema Digital do Arduino</h3>
                        <p style="color:#CBD5E1;font-size:0.95rem;line-height:1.6;">
                            O microcontrolador do Arduino é 100% digital: seus pinos só sabem dar <strong>0V (LOW / Desligado)</strong> ou <strong>5V (HIGH / Ligado)</strong>. Ele <em>não tem</em> uma torneira que solta 2.5V contínuos!<br>
                            Para contornar isso, usamos <strong>PWM (Pulse Width Modulation)</strong>: o Arduino liga e desliga o pino <strong>490 vezes por segundo (490 Hz)</strong>.
                        </p>
                        <div style="background:#1E293B;padding:12px;border-radius:12px;margin-top:10px;font-size:0.9rem;color:#E2E8F0;">
                            👁️ <strong>Efeito visual:</strong> O olho humano e a inércia mecânica dos motores não conseguem ver essa piscada rápida e enxergam apenas a <strong>tensão média</strong> gerada!
                        </div>
                    </div>

                    <!-- Tabela e Pinos PWM -->
                    <div class="ard-grid-3">
                        <div class="ard-card">
                            <h4 style="color:#38BDF8;margin-top:0;">📊 Resolução de 8 Bits (0 a 255)</h4>
                            <p style="color:#94A3B8;font-size:0.85rem;">O comando <code>analogWrite(pino, valor)</code> aceita números de <strong>0</strong> (0%) a <strong>255</strong> (100%):</p>
                            <ul style="color:#CBD5E1;font-size:0.85rem;padding-left:20px;line-height:1.8;">
                                <li><code>analogWrite(9, 0)</code> ➔ 0% (0.0 V) - Desligado</li>
                                <li><code>analogWrite(9, 64)</code> ➔ 25% (~1.25 V) - Fraco</li>
                                <li><code>analogWrite(9, 128)</code> ➔ 50% (~2.50 V) - Médio</li>
                                <li><code>analogWrite(9, 191)</code> ➔ 75% (~3.75 V) - Forte</li>
                                <li><code>analogWrite(9, 255)</code> ➔ 100% (5.0 V) - Máximo</li>
                            </ul>
                        </div>

                        <div class="ard-card">
                            <h4 style="color:#34D399;margin-top:0;">📌 Pinos PWM no Arduino Uno</h4>
                            <p style="color:#94A3B8;font-size:0.85rem;">Apenas os pinos marcados com o símbolo <strong>til (~)</strong> suportam PWM nativo:</p>
                            <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:10px;">
                                <span style="background:#064E3B;color:#34D399;padding:6px 12px;border-radius:10px;font-weight:900;">~3</span>
                                <span style="background:#064E3B;color:#34D399;padding:6px 12px;border-radius:10px;font-weight:900;">~5</span>
                                <span style="background:#064E3B;color:#34D399;padding:6px 12px;border-radius:10px;font-weight:900;">~6</span>
                                <span style="background:#064E3B;color:#34D399;padding:6px 12px;border-radius:10px;font-weight:900;">~9</span>
                                <span style="background:#064E3B;color:#34D399;padding:6px 12px;border-radius:10px;font-weight:900;">~10</span>
                                <span style="background:#064E3B;color:#34D399;padding:6px 12px;border-radius:10px;font-weight:900;">~11</span>
                            </div>
                        </div>
                    </div>

                    <!-- Osciloscópio Digital Interativo -->
                    <div class="ard-ohm-box">
                        <h3 style="color:white;margin-top:0;"><i class="fa-solid fa-chart-line"></i> Osciloscópio Digital & Simulador de Carga</h3>
                        <p style="color:#94A3B8;font-size:0.9rem;">Mova o controle de PWM e observe a largura da onda quadrada (Duty Cycle), o brilho do LED e a rotação do motor:</p>

                        <div class="ard-slider-row" style="max-width:480px;margin:0 auto 12px;">
                            <label>Valor analógico (analogWrite): <span style="color:#FCD34D;font-weight:900;" id="ard-pwm-slider-val">128 / 255</span></label>
                            <input type="range" id="ard-pwm-inter-slider" min="0" max="255" value="128">
                        </div>

                        <!-- Canvas da Onda Quadrada -->
                        <canvas class="ard-osc-canvas" id="ard-osc-canvas" width="480" height="120"></canvas>

                        <div style="display:flex;justify-content:center;gap:15px;flex-wrap:wrap;margin:15px 0;">
                            <div style="background:#1E293B;padding:10px 16px;border-radius:12px;border:1px solid #475569;">
                                <div style="font-size:0.75rem;color:#94A3B8;">DUTY CYCLE</div>
                                <div style="font-size:1.4rem;font-weight:900;color:#F59E0B;" id="ard-pwm-duty-pct">50.2 %</div>
                            </div>
                            <div style="background:#1E293B;padding:10px 16px;border-radius:12px;border:1px solid #475569;">
                                <div style="font-size:0.75rem;color:#94A3B8;">TENSÃO MÉDIA EFETIVA</div>
                                <div style="font-size:1.4rem;font-weight:900;color:#38BDF8;" id="ard-pwm-avg-v">2.51 V</div>
                            </div>
                        </div>

                        <!-- Teste Visual: LED e Motor -->
                        <div style="display:flex;justify-content:center;align-items:center;gap:40px;margin-top:15px;background:#1E293B;padding:16px;border-radius:16px;border:1px solid #334155;">
                            <div style="text-align:center;">
                                <div style="font-size:0.8rem;color:#94A3B8;margin-bottom:8px;">💡 BRILHO DO LED</div>
                                <div id="ard-pwm-live-led" style="width:50px;height:50px;border-radius:50%;background:#EF4444;margin:0 auto;box-shadow:0 0 20px #EF4444;transition:all 0.1s;border:3px solid white;"></div>
                            </div>
                            <div style="text-align:center;">
                                <div style="font-size:0.8rem;color:#94A3B8;margin-bottom:8px;">🌪️ MOTOR DC / HÉLICE</div>
                                <div class="ard-fan">
                                    <div class="ard-fan-blade" id="ard-fan-b1"></div>
                                    <div class="ard-fan-blade" id="ard-fan-b2"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- ================= ABA 4: PLACA ARDUINO ================= -->
                <div class="panel" id="ard-tab-board">
                    <h3 style="color:#F87171;margin-top:0;"><i class="fa-solid fa-microchip"></i> Anatomia da Placa Arduino UNO</h3>
                    <p style="color:#94A3B8;font-size:0.9rem;">Clique nas partes interativas para entender o hardware da placa:</p>
                    <div style="display:flex;flex-wrap:wrap;gap:10px;justify-content:center;margin:15px 0;">
                        <div class="ard-card" onclick="ard_explain('Cabo USB','Transmite o código compilado do computador para o microcontrolador e também fornece 5V de energia.')" style="cursor:pointer;text-align:center;width:120px;padding:12px;"><i class="fa-brands fa-usb" style="font-size:1.8rem;color:#38BDF8;display:block;margin-bottom:6px;"></i><strong>USB</strong><div style="font-size:0.75rem;color:#94A3B8;">Dados & 5V</div></div>
                        <div class="ard-card" onclick="ard_explain('Microcontrolador ATmega328P','O cérebro do Arduino! Um computador completo de 8 bits em um chip que executa as instruções do seu código.')" style="cursor:pointer;text-align:center;width:120px;padding:12px;"><i class="fa-solid fa-microchip" style="font-size:1.8rem;color:#F59E0B;display:block;margin-bottom:6px;"></i><strong>ATmega328P</strong><div style="font-size:0.75rem;color:#94A3B8;">Cérebro</div></div>
                        <div class="ard-card" onclick="ard_explain('Pino 5V e 3.3V','Fontes de tensão reguladas. Alimentam sensores, LEDs e componentes externos com segurança.')" style="cursor:pointer;text-align:center;width:120px;padding:12px;"><i class="fa-solid fa-bolt" style="font-size:1.8rem;color:#EF4444;display:block;margin-bottom:6px;"></i><strong>5V / 3.3V</strong><div style="font-size:0.75rem;color:#94A3B8;">Alimentação</div></div>
                        <div class="ard-card" onclick="ard_explain('Pino GND (Ground / Terra)','O polo negativo (0V). Todo circuito precisa fechar o caminho elétrico voltando para o GND.')" style="cursor:pointer;text-align:center;width:120px;padding:12px;"><i class="fa-solid fa-circle" style="font-size:1.8rem;color:#64748B;display:block;margin-bottom:6px;"></i><strong>GND</strong><div style="font-size:0.75rem;color:#94A3B8;">Terra (0V)</div></div>
                        <div class="ard-card" onclick="ard_explain('Pinos Digitais (0 a 13)','Pinos de entrada e saída binária (LOW ou HIGH). Os pinos 3, 5, 6, 9, 10 e 11 também suportam PWM (~).')" style="cursor:pointer;text-align:center;width:120px;padding:12px;"><i class="fa-solid fa-square-binary" style="font-size:1.8rem;color:#34D399;display:block;margin-bottom:6px;"></i><strong>Digitais</strong><div style="font-size:0.75rem;color:#94A3B8;">0 ou 1</div></div>
                        <div class="ard-card" onclick="ard_explain('Pinos Analógicos (A0 a A5)','Conectados ao conversor ADC de 10 bits. Leem valores contínuos de 0 a 1023 (como sensores LDR e potenciômetros).')" style="cursor:pointer;text-align:center;width:120px;padding:12px;"><i class="fa-solid fa-wave-square" style="font-size:1.8rem;color:#A78BFA;display:block;margin-bottom:6px;"></i><strong>Analógicos</strong><div style="font-size:0.75rem;color:#94A3B8;">A0 a A5</div></div>
                    </div>
                    <div id="ard-explain" style="background:#0F172A;padding:15px;border-radius:12px;border-left:6px solid #EF4444;color:#CBD5E1;font-size:0.95rem;">
                        👆 Clique em qualquer parte da placa acima para ler sua função detalhada.
                    </div>
                </div>

                <!-- ================= ABA 5: CÓDIGO C++ & VARIÁVEIS ================= -->
                <div class="panel" id="ard-tab-code">
                    <h3 style="color:#F87171;margin-top:0;"><i class="fa-solid fa-code"></i> Estrutura do Código Arduino (C++)</h3>
                    
                    <div class="ard-grid-3">
                        <div class="ard-card">
                            <h4 style="color:#F59E0B;margin-top:0;">1. void setup()</h4>
                            <p style="color:#94A3B8;font-size:0.85rem;">Executa <strong>apenas uma vez</strong> logo ao ligar o Arduino. Usado para configurar os pinos:</p>
                            <div style="background:#0B132B;padding:10px;border-radius:8px;font-family:monospace;font-size:0.85rem;color:#CBD5E1;">
                                <span style="color:#F472B6;">void</span> <span style="color:#60A5FA;">setup</span>() {<br>
                                &nbsp;&nbsp;<span style="color:#60A5FA;">pinMode</span>(<span style="color:#FCD34D;">13</span>, <span style="color:#34D399;">OUTPUT</span>);<br>
                                }
                            </div>
                        </div>

                        <div class="ard-card">
                            <h4 style="color:#38BDF8;margin-top:0;">2. void loop()</h4>
                            <p style="color:#94A3B8;font-size:0.85rem;">Roda <strong>infinitamente em repetição contínua</strong> enquanto a placa estiver energizada:</p>
                            <div style="background:#0B132B;padding:10px;border-radius:8px;font-family:monospace;font-size:0.85rem;color:#CBD5E1;">
                                <span style="color:#F472B6;">void</span> <span style="color:#60A5FA;">loop</span>() {<br>
                                &nbsp;&nbsp;<span style="color:#60A5FA;">digitalWrite</span>(<span style="color:#FCD34D;">13</span>, <span style="color:#34D399;">HIGH</span>);<br>
                                &nbsp;&nbsp;<span style="color:#60A5FA;">delay</span>(<span style="color:#FCD34D;">1000</span>);<br>
                                }
                            </div>
                        </div>

                        <div class="ard-card">
                            <h4 style="color:#34D399;margin-top:0;">3. Tipos de Variáveis</h4>
                            <p style="color:#94A3B8;font-size:0.85rem;">Caixas de memória para armazenar diferentes tipos de dados:</p>
                            <div style="background:#0B132B;padding:10px;border-radius:8px;font-family:monospace;font-size:0.85rem;color:#CBD5E1;line-height:1.6;">
                                <span style="color:#F472B6;">int</span> pino = <span style="color:#FCD34D;">9</span>;<br>
                                <span style="color:#F472B6;">float</span> voltagem = <span style="color:#FCD34D;">4.85</span>;<br>
                                <span style="color:#F472B6;">bool</span> botao = <span style="color:#F472B6;">true</span>;
                            </div>
                        </div>
                    </div>
                </div>

                <!-- ================= ABA 6: QUIZ MAKER ================= -->
                <div class="panel" id="ard-tab-quiz">
                    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:15px;flex-wrap:wrap;gap:10px;">
                        <h3 style="color:#F87171;margin:0;"><i class="fa-solid fa-brain"></i> Desafio Maker: Teste Seus Conhecimentos</h3>
                        <div id="ard-quiz-counter" style="background:#0F172A;padding:6px 14px;border-radius:12px;font-weight:900;color:#FCD34D;">Pergunta 1 / 6</div>
                    </div>

                    <div id="ard-quiz-area" class="ard-card">
                        <h3 style="color:white;font-size:1.15rem;margin-top:0;" id="ard-quiz-q">Carregando pergunta...</h3>
                        <div style="display:flex;flex-direction:column;gap:10px;margin-top:15px;" id="ard-quiz-opts"></div>
                        <div id="ard-quiz-feedback" style="margin-top:15px;font-weight:900;font-size:1rem;"></div>
                    </div>
                </div>
            </div>

            <!-- Modal de Conclusão -->
            <div class="ard-modal" id="ard-modal">
                <div class="ard-modal-box">
                    <div style="font-size:4rem;margin-bottom:10px;" id="ard-mIcon">🏆</div>
                    <h2 style="color:white;font-family:'Fredoka One';margin:0;" id="ard-mTitle">Mestre do Arduino!</h2>
                    <p style="color:#CBD5E1;margin:15px 0;" id="ard-mText">Você dominou os conceitos de Tensão, Corrente, Lei de Ohm e PWM!</p>
                    <button class="ard-triangle-btn" style="background:#EF4444;border:none;padding:12px 30px;font-size:1rem;" onclick="ard_closeModal()">Continuar</button>
                </div>
            </div>
        `;

        ard_init();
        document.getElementById('arduino-loaded')?.remove();
        const flag = document.createElement('div'); flag.id = 'arduino-loaded'; flag.style.display='none'; container.appendChild(flag);
    }

    // Variável para animação do osciloscópio
    let ard_oscAnimId = null;
    let ard_pipeAnimOffset = 0;

    function ard_init() {
        // Navegação por Abas
        document.querySelectorAll('.ard-wrapper .tab').forEach(tab => {
            tab.onclick = () => {
                document.querySelectorAll('.ard-wrapper .tab').forEach(t=>t.classList.remove('active'));
                document.querySelectorAll('.ard-wrapper .panel').forEach(p=>p.classList.remove('active'));
                tab.classList.add('active');
                const targetPanel = document.getElementById(tab.dataset.tab);
                if(targetPanel) targetPanel.classList.add('active');
                
                if(tab.dataset.tab === 'ard-tab-pwm') {
                    ard_startOscilloscope();
                } else {
                    if(ard_oscAnimId) cancelAnimationFrame(ard_oscAnimId);
                }
                if(tab.dataset.tab === 'ard-tab-quiz') ard_initQuiz();
            };
        });

        // ================= SLIDERS DA LEI DE OHM =================
        const vSlider = document.getElementById('ard-dyn-v-slider');
        const rSlider = document.getElementById('ard-dyn-r-slider');

        function updateOhmSim() {
            if(!vSlider || !rSlider) return;
            const v = parseFloat(vSlider.value);
            const r = parseFloat(rSlider.value);
            const iAmps = v / r;
            const iMilli = iAmps * 1000;
            const powerMilli = v * iMilli;

            document.getElementById('ard-dyn-v-val').innerText = `${v.toFixed(1)} V`;
            document.getElementById('ard-dyn-r-val').innerText = `${r} Ω`;
            document.getElementById('ard-dyn-i-val').innerText = `${iMilli.toFixed(1)} mA`;
            document.getElementById('ard-dyn-p-val').innerText = `${powerMilli.toFixed(1)} mW`;

            // Status e Alerta de Corrente
            const statusEl = document.getElementById('ard-dyn-status');
            const resistorBarrier = document.getElementById('ard-pipe-barrier');
            if(resistorBarrier) {
                // Largura do obstáculo visual de acordo com a resistência
                const barrierWidth = Math.min(120, Math.max(20, (r / 1000) * 120));
                resistorBarrier.style.width = `${barrierWidth}px`;
                resistorBarrier.style.left = `calc(50% - ${barrierWidth/2}px)`;
            }

            if(statusEl) {
                if(iMilli > 40) {
                    statusEl.style.background = '#7F1D1D';
                    statusEl.style.color = '#FCA5A5';
                    statusEl.innerHTML = '💥 <strong>PERIGO DE SOBRECORRENTE!</strong> (>40mA). Risco de queimar a porta do Arduino!';
                } else if(iMilli >= 10) {
                    statusEl.style.background = '#064E3B';
                    statusEl.style.color = '#34D399';
                    statusEl.innerHTML = '✅ <strong>Faixa Ideal & Segura</strong> (~10mA a 30mA). LED brilha com máxima vida útil!';
                } else {
                    statusEl.style.background = '#78350F';
                    statusEl.style.color = '#FDE68A';
                    statusEl.innerHTML = '🟡 <strong>Corrente Baixa</strong> (<10mA). O LED ficará muito fraco ou apagado.';
                }
            }
        }

        if(vSlider && rSlider) {
            vSlider.oninput = updateOhmSim;
            rSlider.oninput = updateOhmSim;
            updateOhmSim();
        }

        // Animação contínua do tubo de elétrons
        function animateElectrons() {
            const flow = document.getElementById('ard-pipe-flow');
            if(flow && vSlider && rSlider) {
                const v = parseFloat(vSlider.value);
                const r = parseFloat(rSlider.value);
                const speed = (v / r) * 15; // velocidade proporcional à corrente
                ard_pipeAnimOffset = (ard_pipeAnimOffset + speed) % 100;
                flow.style.transform = `translateX(-${ard_pipeAnimOffset}px)`;
            }
            requestAnimationFrame(animateElectrons);
        }
        animateElectrons();

        // ================= SLIDER PWM E OSCILOSCÓPIO =================
        const pwmSlider = document.getElementById('ard-pwm-inter-slider');
        if(pwmSlider) {
            pwmSlider.oninput = () => {
                const val = parseInt(pwmSlider.value);
                const pct = (val / 255) * 100;
                const avgV = (val / 255) * 5.0;

                document.getElementById('ard-pwm-slider-val').innerText = `${val} / 255`;
                document.getElementById('ard-pwm-duty-pct').innerText = `${pct.toFixed(1)} %`;
                document.getElementById('ard-pwm-avg-v').innerText = `${avgV.toFixed(2)} V`;

                // Atualizar LED
                const led = document.getElementById('ard-pwm-live-led');
                if(led) {
                    const alpha = val / 255;
                    led.style.background = `rgba(239, 68, 68, ${Math.max(0.1, alpha)})`;
                    led.style.boxShadow = `0 0 ${alpha * 35}px #EF4444`;
                }

                // Atualizar Motor / Hélice
                const b1 = document.getElementById('ard-fan-b1');
                const b2 = document.getElementById('ard-fan-b2');
                if(b1 && b2) {
                    if(val === 0) {
                        b1.style.animation = 'none';
                        b2.style.animation = 'none';
                    } else {
                        const dur = Math.max(0.05, 1.2 - (val / 255) * 1.15);
                        b1.style.animation = `ardSpin ${dur}s linear infinite`;
                        b2.style.animation = `ardSpin ${dur}s linear infinite`;
                    }
                }
            };
            pwmSlider.dispatchEvent(new Event('input'));
        }
    }

    // Função de desenho do osciloscópio
    function ard_startOscilloscope() {
        const canvas = document.getElementById('ard-osc-canvas');
        if(!canvas) return;
        const ctx = canvas.getContext('2d');
        let phase = 0;

        function drawWave() {
            const pwmSlider = document.getElementById('ard-pwm-inter-slider');
            const val = pwmSlider ? parseInt(pwmSlider.value) : 128;
            const duty = val / 255; // 0.0 a 1.0

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Grade de fundo
            ctx.strokeStyle = '#1E293B';
            ctx.lineWidth = 1;
            for(let x = 0; x < canvas.width; x += 40) {
                ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
            }
            for(let y = 0; y < canvas.height; y += 30) {
                ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
            }

            // Linha de 0V e 5V marcadores
            ctx.fillStyle = '#64748B';
            ctx.font = '10px monospace';
            ctx.fillText('5V (HIGH)', 8, 25);
            ctx.fillText('0V (LOW)', 8, 105);

            // Traçado da Onda Quadrada
            ctx.strokeStyle = '#38BDF8';
            ctx.shadowColor = '#38BDF8';
            ctx.shadowBlur = 8;
            ctx.lineWidth = 3;
            ctx.beginPath();

            const period = 80; // pixels por ciclo
            const highY = 30;
            const lowY = 100;

            phase = (phase + 1.5) % period;

            for(let x = -period; x < canvas.width + period; x += period) {
                const startX = x - phase;
                const highWidth = period * duty;

                if(duty <= 0.01) {
                    // Sempre LOW
                    ctx.moveTo(startX, lowY);
                    ctx.lineTo(startX + period, lowY);
                } else if(duty >= 0.99) {
                    // Sempre HIGH
                    ctx.moveTo(startX, highY);
                    ctx.lineTo(startX + period, highY);
                } else {
                    // Pulso Quadrado
                    ctx.moveTo(startX, lowY);
                    ctx.lineTo(startX, highY);
                    ctx.lineTo(startX + highWidth, highY);
                    ctx.lineTo(startX + highWidth, lowY);
                    ctx.lineTo(startX + period, lowY);
                }
            }
            ctx.stroke();
            ctx.shadowBlur = 0;

            ard_oscAnimId = requestAnimationFrame(drawWave);
        }

        if(ard_oscAnimId) cancelAnimationFrame(ard_oscAnimId);
        ard_oscAnimId = requestAnimationFrame(drawWave);
    }

    // ================= TRIÂNGULO DA LEI DE OHM =================
    function ard_selectTriangle(type) {
        document.querySelectorAll('.ard-triangle-btn').forEach(b => b.classList.remove('active'));
        const activeBtn = document.getElementById(`ard-tri-btn-${type.toLowerCase()}`);
        if(activeBtn) activeBtn.classList.add('active');

        const formulaEl = document.getElementById('ard-tri-formula');
        const descEl = document.getElementById('ard-tri-desc');

        if(type === 'V') {
            formulaEl.innerHTML = '<span style="color:#F59E0B;">V</span> = <span style="color:#34D399;">R</span> × <span style="color:#38BDF8;">I</span>';
            descEl.innerHTML = '<strong>Tensão = Resistência × Corrente.</strong> Se você conhece a resistência e a corrente, multiplique as duas para achar os Volts!';
        } else if(type === 'I') {
            formulaEl.innerHTML = '<span style="color:#38BDF8;">I</span> = <span style="color:#F59E0B;">V</span> / <span style="color:#34D399;">R</span>';
            descEl.innerHTML = '<strong>Corrente = Tensão ÷ Resistência.</strong> Para saber quantos miliamperes vão fluir, divida a Tensão da fonte pela Resistência do resistor.';
        } else if(type === 'R') {
            formulaEl.innerHTML = '<span style="color:#34D399;">R</span> = <span style="color:#F59E0B;">V</span> / <span style="color:#38BDF8;">I</span>';
            descEl.innerHTML = '<strong>Resistência = Tensão ÷ Corrente.</strong> A fórmula mais usada pelos Makers para descobrir qual resistor comprar para proteger um LED!';
        }
    }

    function ard_explain(title, text) {
        const el = document.getElementById('ard-explain');
        if(el) el.innerHTML = `<strong style="color:#F87171;font-size:1.1rem;">${title}:</strong> ${text}`;
    }

    // ================= QUIZ GAMIFICADO =================
    const ard_quizData = [
        {
            q: 'Qual é a fórmula da Lei de Ohm para descobrir a Tensão (V)?',
            opts: ['V = R × I', 'V = R / I', 'V = I / R', 'V = R + I'],
            correct: 0,
            explain: 'Perfeito! Pelo triângulo de Ohm, Tensão (V) é o produto da Resistência (R) pela Corrente (I).'
        },
        {
            q: 'Se ligarmos um resistor de 250Ω em uma fonte de 5V, qual será a corrente?',
            opts: ['5 mA', '20 mA (0.02 A)', '100 mA', '1000 mA'],
            correct: 1,
            explain: 'Exato! I = V / R = 5V / 250Ω = 0.02 A = 20 mA. Corrente perfeita para um LED!'
        },
        {
            q: 'O que o PWM (Pulse Width Modulation) faz no Arduino?',
            opts: [
                'Gera um som agudo no alto-falante',
                'Liga e desliga a saída muito rápido para simular uma tensão analógica intermediária',
                'Aumenta a memória RAM da placa',
                'Converte corrente alternada em contínua'
            ],
            correct: 1,
            explain: 'Excelente! O PWM comuta entre 0V e 5V 490 vezes por segundo gerando uma tensão média proporcional ao Duty Cycle.'
        },
        {
            q: 'Qual o valor que devemos passar em analogWrite(pino, valor) para obter 50% de brilho (~2.5V)?',
            opts: ['50', '100', '128', '255'],
            correct: 2,
            explain: 'Correto! A escala de 8 bits vai de 0 a 255, portanto metade (50%) é 128.'
        },
        {
            q: 'Quais pinos do Arduino Uno suportam modulação PWM nativa?',
            opts: [
                'Apenas os pinos A0 a A5',
                'Pinos marcados com o til (~) como 3, 5, 6, 9, 10 e 11',
                'Todos os pinos sem exceção',
                'Apenas o pino 13'
            ],
            correct: 1,
            explain: 'Muito bem! Os pinos com o símbolo til (~) são acoplados aos temporizadores internos (Timers) para PWM.'
        },
        {
            q: 'O que acontece se ligarmos um LED diretamente nos 5V sem resistor limitador?',
            opts: [
                'O LED brilha normalmente por anos',
                'O circuito economiza energia',
                'A corrente dispara e o LED queima em milissegundos por sobreaquecimento',
                'A tensão cai automaticamente para zero'
            ],
            correct: 2,
            explain: 'Isso aí! Sem resistor para conter a corrente, ela sobe acima de 100mA e queima o filamento semicondutor do LED.'
        }
    ];

    let ard_quizIndex = 0;

    function ard_initQuiz() {
        const counterEl = document.getElementById('ard-quiz-counter');
        const qEl = document.getElementById('ard-quiz-q');
        const optsContainer = document.getElementById('ard-quiz-opts');
        const feedbackEl = document.getElementById('ard-quiz-feedback');

        if(ard_quizIndex >= ard_quizData.length) {
            document.getElementById('ard-quiz-area').innerHTML = `
                <div style="text-align:center;padding:20px;">
                    <div style="font-size:3.5rem;">🎉🏆⭐</div>
                    <h2 style="color:#10B981;font-family:'Fredoka One';">Parabéns, Maker!</h2>
                    <p style="color:#CBD5E1;font-size:1.05rem;">Você acertou todas as questões sobre Lei de Ohm, Grandezas Elétricas e PWM!</p>
                    <div style="background:#0F172A;display:inline-block;padding:10px 20px;border-radius:14px;border:2px solid #10B981;color:#FCD34D;font-weight:900;font-size:1.1rem;margin-top:10px;">
                        +3 Estrelas Conquistadas na Oficina! ⭐⭐⭐
                    </div>
                </div>
            `;
            let saved = JSON.parse(localStorage.getItem('arduino_levels') || '[]');
            if(!saved.includes(1)) saved.push(1);
            if(!saved.includes(2)) saved.push(2);
            if(!saved.includes(3)) saved.push(3);
            localStorage.setItem('arduino_levels', JSON.stringify(saved));
            if(typeof updateHubProgress === 'function') updateHubProgress();
            return;
        }

        const item = ard_quizData[ard_quizIndex];
        if(counterEl) counterEl.innerText = `Pergunta ${ard_quizIndex + 1} / ${ard_quizData.length}`;
        if(qEl) qEl.innerText = item.q;
        if(feedbackEl) feedbackEl.innerHTML = '';
        if(optsContainer) {
            optsContainer.innerHTML = '';
            item.opts.forEach((opt, idx) => {
                const btn = document.createElement('button');
                btn.className = 'ard-quiz-btn';
                btn.innerHTML = `<span style="background:#1E293B;color:#FCD34D;width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:0.85rem;font-weight:900;flex-shrink:0;">${String.fromCharCode(65 + idx)}</span> <span>${opt}</span>`;
                btn.onclick = () => {
                    const allBtns = optsContainer.querySelectorAll('.ard-quiz-btn');
                    allBtns.forEach(b => b.disabled = true);
                    if(idx === item.correct) {
                        btn.classList.add('correct');
                        feedbackEl.innerHTML = `<span style="color:#34D399;">✅ Correto! ${item.explain}</span>`;
                        setTimeout(() => {
                            ard_quizIndex++;
                            ard_initQuiz();
                        }, 2200);
                    } else {
                        btn.classList.add('wrong');
                        feedbackEl.innerHTML = `<span style="color:#EF4444;">❌ Incorreto. Tente novamente!</span>`;
                        setTimeout(() => {
                            allBtns.forEach(b => {
                                b.disabled = false;
                                b.classList.remove('wrong');
                            });
                            feedbackEl.innerHTML = '';
                        }, 1800);
                    }
                };
                optsContainer.appendChild(btn);
            });
        }
    }

    // ================= INICIAR (primeira aba já carregada) =================
    // Carrega o primeiro jogo (hub já está visível)
    // Os outros serão carregados sob demanda.

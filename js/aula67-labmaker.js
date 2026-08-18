/* ==========================================================================
   AULAS 6 E 7 — LABORATÓRIO MAKER (ELETRÔNICA, LEI DE OHM & PROTOBOARD)
   ========================================================================== */

    function loadLabmaker() {
        const container = document.getElementById('labmaker-container');
        container.innerHTML = `
            <style>
                .lab-wrapper { color:#E2E8F0; font-family:'Quicksand', sans-serif; }
                .lab-subnav { display:flex; gap:10px; justify-content:center; margin-bottom:20px; flex-wrap:wrap; }
                .lab-tab-btn { background:#1E293B; color:#94A3B8; border:2px solid #334155; padding:10px 22px; border-radius:30px; font-weight:800; font-size:1rem; cursor:pointer; transition:0.2s all; display:flex; align-items:center; gap:8px; }
                .lab-tab-btn:hover { border-color:#38BDF8; color:white; transform:translateY(-2px); }
                .lab-tab-btn.active { background:linear-gradient(135deg, #0284C7, #38BDF8); color:#0F172A; border-color:#38BDF8; box-shadow:0 0 15px rgba(56,189,248,0.4); }
                
                /* Teoria Styles */
                .theory-grid { display:grid; grid-template-columns:repeat(auto-fit, minmax(320px, 1fr)); gap:20px; }
                .theory-card { background:#1E293B; border:2px solid #334155; border-radius:20px; padding:22px; transition:0.3s; position:relative; overflow:hidden; }
                .theory-card:hover { border-color:#38BDF8; box-shadow:0 8px 25px rgba(0,0,0,0.4); transform:translateY(-3px); }
                .theory-header { display:flex; align-items:center; gap:12px; margin-bottom:14px; border-bottom:1px solid #334155; padding-bottom:10px; }
                .theory-icon { width:46px; height:46px; border-radius:12px; display:flex; align-items:center; justify-content:center; font-size:1.6rem; }
                .theory-title { font-family:'Fredoka One', cursive; font-size:1.3rem; margin:0; }
                .theory-body { font-size:0.95rem; line-height:1.6; color:#CBD5E1; }
                .theory-body b { color:#38BDF8; }
                .theory-body code { background:#0F172A; color:#F59E0B; padding:2px 6px; border-radius:4px; font-family:monospace; }
                
                /* Calculadora de Cores do Resistor */
                .resistor-calc { background:#0F172A; padding:15px; border-radius:14px; margin-top:12px; border:1px solid #334155; }
                .resistor-display { display:flex; align-items:center; justify-content:center; height:50px; background:#D4B996; border-radius:10px; border:2px solid #8C6D4F; position:relative; margin:15px 0; max-width:240px; margin-inline:auto; }
                .resistor-lead { width:30px; height:6px; background:#94A3B8; position:absolute; }
                .resistor-lead.left { left:-30px; }
                .resistor-lead.right { right:-30px; }
                .resistor-band { width:10px; height:100%; position:absolute; }
                
                /* Bancada Interativa */
                .bancada-layout { display:flex; flex-direction:column; gap:18px; }
                .bancada-topbar { background:#1E293B; padding:15px 20px; border-radius:18px; border:2px solid #334155; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:15px; }
                .power-module { display:flex; align-items:center; gap:14px; }
                .power-switch-btn { background:#EF4444; color:white; border:none; padding:10px 22px; border-radius:30px; font-family:'Fredoka One', cursive; font-size:1.1rem; cursor:pointer; transition:0.3s; display:flex; align-items:center; gap:8px; box-shadow:0 4px 10px rgba(0,0,0,0.3); }
                .power-switch-btn.on { background:#10B981; box-shadow:0 0 20px rgba(16,185,129,0.6); }
                .voltage-indicator { background:#0F172A; border:2px solid #475569; padding:6px 14px; border-radius:10px; font-family:monospace; font-weight:bold; font-size:1.1rem; color:#EF4444; }
                .voltage-indicator.on { color:#10B981; border-color:#10B981; text-shadow:0 0 8px rgba(16,185,129,0.8); }
                
                /* Caixa de Ferramentas / Componentes */
                .toolbox { background:#1E293B; padding:15px 20px; border-radius:18px; border:2px solid #334155; display:flex; gap:12px; align-items:center; flex-wrap:wrap; }
                .tool-label { font-weight:800; color:#94A3B8; font-size:0.9rem; text-transform:uppercase; letter-spacing:1px; margin-right:5px; }
                .tool-btn { background:#0F172A; border:2px solid #334155; color:#CBD5E1; padding:8px 14px; border-radius:12px; font-weight:700; font-size:0.9rem; cursor:pointer; display:flex; align-items:center; gap:6px; transition:0.2s; }
                .tool-btn:hover { border-color:#38BDF8; transform:scale(1.05); }
                .tool-btn.active { border-color:#F59E0B; background:#F59E0B; color:#0F172A; font-weight:900; box-shadow:0 0 12px rgba(245,158,11,0.5); }
                .tool-select { background:#0F172A; color:#38BDF8; border:1px solid #475569; padding:5px 8px; border-radius:8px; font-weight:bold; cursor:pointer; }

                /* Protoboard Container & Canvas */
                .proto-board-container { background:#0F172A; border:3px solid #334155; border-radius:22px; padding:25px; overflow-x:auto; position:relative; display:flex; justify-content:center; box-shadow:inset 0 0 30px rgba(0,0,0,0.7); }
                .breadboard { background:#F8FAFC; border-radius:16px; padding:20px 25px; border:4px solid #CBD5E1; box-shadow:0 15px 35px rgba(0,0,0,0.5), inset 0 0 15px rgba(0,0,0,0.05); position:relative; user-select:none; }
                
                /* Trilhas e Barramentos */
                .bb-power-rail { display:flex; flex-direction:column; gap:6px; background:#F1F5F9; padding:8px 12px; border-radius:8px; border:1px solid #E2E8F0; }
                .bb-rail-row { display:flex; align-items:center; gap:8px; }
                .bb-rail-label { font-family:monospace; font-weight:900; font-size:0.9rem; width:16px; text-align:center; }
                .bb-rail-label.plus { color:#EF4444; }
                .bb-rail-label.minus { color:#0284C7; }
                .bb-rail-line { height:2px; flex:1; }
                .bb-rail-line.plus { background:#EF4444; }
                .bb-rail-line.minus { background:#0284C7; }
                
                .bb-terminal-area { display:flex; flex-direction:column; gap:16px; margin:15px 0; }
                .bb-divider { height:12px; background:#E2E8F0; border-radius:6px; border-top:1px solid #CBD5E1; border-bottom:1px solid #CBD5E1; position:relative; }
                .bb-divider::after { content:'CALHA CENTRAL (ISOLANTE)'; position:absolute; top:-7px; left:50%; transform:translateX(-50%); font-size:0.65rem; color:#94A3B8; font-weight:900; background:#F8FAFC; padding:0 8px; }
                
                .bb-grid { display:grid; grid-template-columns:repeat(15, 24px); gap:6px; justify-content:center; }
                .bb-col-nums { display:grid; grid-template-columns:repeat(15, 24px); gap:6px; justify-content:center; margin-bottom:4px; }
                .bb-num { font-size:0.75rem; color:#64748B; font-family:monospace; text-align:center; font-weight:bold; }
                .bb-row-labels { display:flex; flex-direction:column; gap:6px; position:absolute; left:8px; font-family:monospace; font-size:0.75rem; color:#64748B; font-weight:bold; }

                /* Furos da Protoboard */
                .bb-hole { width:18px; height:18px; background:#1E293B; border-radius:50%; border:2px solid #94A3B8; cursor:pointer; position:relative; transition:0.15s all; }
                .bb-hole:hover { transform:scale(1.3); border-color:#38BDF8; background:#0284C7; box-shadow:0 0 8px #38BDF8; z-index:50; }
                .bb-hole.highlight-net { border-color:#38BDF8; background:#0284C7; box-shadow:0 0 6px rgba(56,189,248,0.7); }
                .bb-hole.selected-start { border-color:#F59E0B; background:#F59E0B; animation:pulseHole 0.8s infinite alternate; }
                .bb-hole.occupied { background:#475569; }
                @keyframes pulseHole { 0% { transform:scale(1); } 100% { transform:scale(1.4); } }

                /* Overlay SVG para fios, resistores e LEDs */
                .bb-svg-layer { position:absolute; top:0; left:0; width:100%; height:100%; pointer-events:none; z-index:30; }

                /* Status e Inspetor do Circuito */
                .circuit-status-box { background:#1E293B; border:2px solid #334155; border-radius:18px; padding:18px; display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:15px; }
                .status-info { display:flex; align-items:center; gap:12px; }
                .status-badge { width:16px; height:16px; border-radius:50%; background:#64748B; box-shadow:0 0 8px rgba(0,0,0,0.5); }
                .status-badge.active { background:#10B981; box-shadow:0 0 12px #10B981; }
                .status-badge.error { background:#EF4444; box-shadow:0 0 12px #EF4444; }
                .status-text { font-size:1.05rem; font-weight:700; }

                /* Componentes Visuais Realistas */
                .placed-led { filter:drop-shadow(0 0 2px rgba(0,0,0,0.5)); transition:0.3s; }
                .placed-led.lit-red { filter:drop-shadow(0 0 15px #EF4444) drop-shadow(0 0 30px #EF4444) brightness(1.6); }
                .placed-led.lit-green { filter:drop-shadow(0 0 15px #10B981) drop-shadow(0 0 30px #10B981) brightness(1.6); }
                .placed-led.lit-yellow { filter:drop-shadow(0 0 15px #F59E0B) drop-shadow(0 0 30px #F59E0B) brightness(1.6); }
                .placed-led.lit-blue { filter:drop-shadow(0 0 15px #38BDF8) drop-shadow(0 0 30px #38BDF8) brightness(1.6); }
                .placed-led.burned { filter:grayscale(1) brightness(0.4); opacity:0.8; }
                
                /* Missões */
                .mission-card { background:#1E293B; border-radius:18px; border:2px solid #334155; padding:20px; margin-bottom:15px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:15px; }
                .mission-card.completed { border-color:#10B981; background:#064E3B22; }
                .mission-title { font-family:'Fredoka One', cursive; font-size:1.2rem; color:white; margin-bottom:4px; }
                .mission-desc { color:#94A3B8; font-size:0.95rem; }
                .mission-btn { background:#38BDF8; color:#0F172A; border:none; padding:10px 22px; border-radius:30px; font-weight:900; cursor:pointer; transition:0.2s; }
                .mission-btn:hover { transform:scale(1.05); }

                /* Modal Lab */
                .lab-modal { position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.8); display:flex; justify-content:center; align-items:center; z-index:999; opacity:0; pointer-events:none; transition:0.3s; }
                .lab-modal.active { opacity:1; pointer-events:all; }
                .lab-modal-box { background:#1E293B; padding:30px; border-radius:28px; max-width:440px; text-align:center; border:3px solid #38BDF8; box-shadow:0 0 30px rgba(56,189,248,0.3); }
            </style>

            <div class="lab-wrapper">
                <!-- Sub-Navegação do Laboratório -->
                <div class="lab-subnav">
                    <button class="lab-tab-btn" onclick="lab_switchSubTab('theory')"><i class="fa-solid fa-book-open"></i> 1. Teoria & Anatomia</button>
                    <button class="lab-tab-btn active" onclick="lab_switchSubTab('bancada')"><i class="fa-solid fa-microchip"></i> 2. Bancada & Protoboard</button>
                    <button class="lab-tab-btn" onclick="lab_switchSubTab('missions')"><i class="fa-solid fa-trophy"></i> 3. Missões Maker</button>
                </div>

                <!-- SUB-ABA 1: TEORIA & ANATOMIA -->
                <div id="lab-subtab-theory" style="display:none;">
                    <div class="theory-grid">
                        <!-- Card 1: Protoboard -->
                        <div class="theory-card">
                            <div class="theory-header">
                                <div class="theory-icon" style="background:#0284C7;color:white;"><i class="fa-solid fa-table-cells"></i></div>
                                <div>
                                    <h3 class="theory-title" style="color:#38BDF8;">A Protoboard (Placa de Ensaio)</h3>
                                    <span style="font-size:0.8rem;color:#94A3B8;">Estrutura e Conexões Ocultas</span>
                                </div>
                            </div>
                            <div class="theory-body">
                                <p>A <b>Protoboard</b> permite criar e testar circuitos eletrônicos <b>sem precisar de solda</b>! Por baixo do plástico, existem presilhas metálicas que conectam os furos de forma inteligente:</p>
                                <ul style="padding-left:20px;margin:8px 0;">
                                    <li><b>Barramentos Laterais (+ e -)</b>: São colunas contínuas de cima a baixo para distribuir energia (<b>5V</b> e <b>GND/Terra</b>).</li>
                                    <li><b>Linhas de Terminais (A-B-C-D-E e F-G-H-I-J)</b>: São linhas horizontais de 5 furos interligados. Furos na mesma linha compartilham o mesmo nó elétrico!</li>
                                    <li><b>Calha Central</b>: O sulco no meio é um isolante que divide os dois lados. Perfeito para circuitos integrados e botões.</li>
                                </ul>
                            </div>
                        </div>

                        <!-- Card 2: Resistor & Lei de Ohm -->
                        <div class="theory-card">
                            <div class="theory-header">
                                <div class="theory-icon" style="background:#D97706;color:white;"><i class="fa-solid fa-shield-halved"></i></div>
                                <div>
                                    <h3 class="theory-title" style="color:#F59E0B;">O Resistor & Lei de Ohm</h3>
                                    <span style="font-size:0.8rem;color:#94A3B8;">O Guardião do Circuito</span>
                                </div>
                            </div>
                            <div class="theory-body">
                                <p>O <b>Resistor</b> oferece resistência à passagem da corrente elétrica ($I$). Sua principal função é <b>proteger componentes sensíveis (como LEDs)</b> para não queimarem com excesso de corrente.</p>
                                <p style="margin-top:6px;">Pela <b>Lei de Ohm</b>: <code>V = R × I</code>. Para alimentar um LED de 2V com 5V do Arduino, usamos um resistor de <b>220Ω</b> para limitar a corrente a cerca de 15mA a 20mA.</p>
                                
                                <!-- Mini Calculadora de Faixas -->
                                <div class="resistor-calc">
                                    <div style="display:flex;justify-content:space-between;align-items:center;font-size:0.85rem;font-weight:bold;">
                                        <span>Calculadora de Cores:</span>
                                        <span id="res-val-display" style="color:#F59E0B;font-family:monospace;font-size:1.1rem;">220 Ω ±5%</span>
                                    </div>
                                    <div class="resistor-display">
                                        <div class="resistor-lead left"></div>
                                        <div class="resistor-band" id="band-1" style="left:40px;background:#EF4444;"></div>
                                        <div class="resistor-band" id="band-2" style="left:70px;background:#EF4444;"></div>
                                        <div class="resistor-band" id="band-3" style="left:100px;background:#78350F;"></div>
                                        <div class="resistor-band" id="band-4" style="left:150px;background:#F59E0B;"></div>
                                        <div class="resistor-lead right"></div>
                                    </div>
                                    <div style="display:flex;gap:6px;justify-content:center;">
                                        <button onclick="lab_demoResistor(220)" style="background:#334155;color:#E2E8F0;border:none;padding:4px 8px;border-radius:6px;font-size:0.8rem;cursor:pointer;">220Ω (LED)</button>
                                        <button onclick="lab_demoResistor(1000)" style="background:#334155;color:#E2E8F0;border:none;padding:4px 8px;border-radius:6px;font-size:0.8rem;cursor:pointer;">1kΩ (Sinal)</button>
                                        <button onclick="lab_demoResistor(10000)" style="background:#334155;color:#E2E8F0;border:none;padding:4px 8px;border-radius:6px;font-size:0.8rem;cursor:pointer;">10kΩ (Pull-up)</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Card 3: LED -->
                        <div class="theory-card">
                            <div class="theory-header">
                                <div class="theory-icon" style="background:#10B981;color:white;"><i class="fa-solid fa-lightbulb"></i></div>
                                <div>
                                    <h3 class="theory-title" style="color:#34D399;">O LED (Diodo Emissor de Luz)</h3>
                                    <span style="font-size:0.8rem;color:#94A3B8;">Polaridade & Iluminação</span>
                                </div>
                            </div>
                            <div class="theory-body">
                                <p>O LED é um <b>semicondutor de mão única</b> (diodo). Ele só permite que a corrente flua no sentido correto e converte essa energia em luz visível!</p>
                                <ul style="padding-left:20px;margin:8px 0;">
                                    <li><b>Ânodo (+)</b>: Perna mais longa. Deve ser conectado ao polo positivo (5V / Sinal com Resistor).</li>
                                    <li><b>Cátodo (-)</b>: Perna mais curta e chanfro achatado na base. Conecta-se ao negativo (<b>GND</b>).</li>
                                    <li>⚠️ <b>Atenção:</b> Se ligar o LED direto aos 5V sem resistor, ele recebe corrente infinita e queima em milissegundos!</li>
                                </ul>
                            </div>
                        </div>

                        <!-- Card 4: Jumpers & Botões -->
                        <div class="theory-card">
                            <div class="theory-header">
                                <div class="theory-icon" style="background:#8B5CF6;color:white;"><i class="fa-solid fa-plug"></i></div>
                                <div>
                                    <h3 class="theory-title" style="color:#A78BFA;">Jumpers & Pushbuttons</h3>
                                    <span style="font-size:0.8rem;color:#94A3B8;">Condutores e Chaves</span>
                                </div>
                            </div>
                            <div class="theory-body">
                                <p><b>Jumpers (Fios de Conexão):</b> São fios com pontas rígidas (macho) para encaixar com facilidade na protoboard. Por convenção:</p>
                                <ul style="padding-left:20px;margin:8px 0;">
                                    <li>🔴 <b>Vermelho</b>: Sempre usado para <b>+5V / Positivo (VCC)</b>.</li>
                                    <li>⚫ <b>Preto</b>: Sempre usado para <b>GND / Negativo (Terra)</b>.</li>
                                    <li>🟡 🔵 🟢 <b>Amarelo/Azul/Verde</b>: Usados para sinais, dados e conexões intermediárias.</li>
                                </ul>
                                <p style="margin-top:8px;"><b>Pushbutton:</b> Uma chave momentânea que fecha o circuito quando você pressiona, permitindo que a corrente elétrica passe.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- SUB-ABA 2: BANCADA INTERATIVA COM PROTOBOARD -->
                <div id="lab-subtab-bancada">
                    <div class="bancada-layout">
                        <!-- Barra Superior: Fonte de Alimentação e Controles -->
                        <div class="bancada-topbar">
                            <div class="power-module">
                                <button class="power-switch-btn" id="lab-pwr-btn" onclick="lab_togglePower()">
                                    <i class="fa-solid fa-power-off"></i> ENERGIA: <span id="lab-pwr-text">DESLIGADA</span>
                                </button>
                                <div class="voltage-indicator" id="lab-volt-meter">0.00 V (OFF)</div>
                            </div>

                            <div style="display:flex;gap:10px;align-items:center;">
                                <button class="tool-btn" onclick="lab_undoLast()"><i class="fa-solid fa-undo"></i> Desfazer</button>
                                <button class="tool-btn" onclick="lab_clearBoard()" style="border-color:#EF4444;color:#FCA5A5;"><i class="fa-solid fa-trash"></i> Limpar Tudo</button>
                            </div>
                        </div>

                        <!-- Caixa de Ferramentas / Componentes -->
                        <div class="toolbox">
                            <span class="tool-label"><i class="fa-solid fa-toolbox"></i> Componentes:</span>
                            
                            <!-- Ferramenta Jumper -->
                            <button class="tool-btn active" id="tool-jumper" onclick="lab_selectTool('jumper')">
                                <i class="fa-solid fa-route"></i> Jumper
                            </button>
                            <select class="tool-select" id="lab-jumper-color" onchange="lab_selectTool('jumper')">
                                <option value="#EF4444">🔴 Vermelho (5V)</option>
                                <option value="#0F172A">⚫ Preto (GND)</option>
                                <option value="#38BDF8">🔵 Azul</option>
                                <option value="#F59E0B">🟡 Amarelo</option>
                                <option value="#10B981">🟢 Verde</option>
                            </select>

                            <!-- Ferramenta Resistor -->
                            <button class="tool-btn" id="tool-resistor" onclick="lab_selectTool('resistor')">
                                <i class="fa-solid fa-shield-halved"></i> Resistor
                            </button>
                            <select class="tool-select" id="lab-resistor-val" onchange="lab_selectTool('resistor')">
                                <option value="220">220 Ω (LED)</option>
                                <option value="1000">1 kΩ</option>
                                <option value="10000">10 kΩ</option>
                            </select>

                            <!-- Ferramenta LED -->
                            <button class="tool-btn" id="tool-led" onclick="lab_selectTool('led')">
                                <i class="fa-solid fa-lightbulb"></i> LED
                            </button>
                            <select class="tool-select" id="lab-led-color" onchange="lab_selectTool('led')">
                                <option value="red">🔴 Vermelho</option>
                                <option value="green">🟢 Verde</option>
                                <option value="yellow">🟡 Amarelo</option>
                                <option value="blue">🔵 Azul</option>
                            </select>

                            <!-- Ferramenta Botão -->
                            <button class="tool-btn" id="tool-button" onclick="lab_selectTool('button')">
                                <i class="fa-solid fa-circle-dot"></i> Pushbutton
                            </button>
                            
                            <!-- Ferramenta Remover -->
                            <button class="tool-btn" id="tool-eraser" onclick="lab_selectTool('eraser')">
                                <i class="fa-solid fa-eraser"></i> Apagar Peça
                            </button>
                        </div>

                        <!-- Instruções Rápidas -->
                        <div style="background:#0F172A;border-left:4px solid #38BDF8;padding:10px 16px;border-radius:10px;font-size:0.92rem;color:#CBD5E1;">
                            💡 <b>Como Usar:</b> Selecione um componente acima, depois clique no <b>1º furo</b> e no <b>2º furo</b> da Protoboard para encaixar. Conecte de <b>+5V</b> até <b>GND</b> e aperte <b>ENERGIA</b> para simular!
                        </div>

                        <!-- Protoboard e Simulação Gráfica -->
                        <div class="proto-board-container">
                            <div class="breadboard" id="breadboard-element">
                                <!-- Camada SVG para desenho dos jumpers e componentes -->
                                <svg class="bb-svg-layer" id="bb-svg"></svg>

                                <!-- Barramento Superior de Alimentação (+ e -) -->
                                <div class="bb-power-rail">
                                    <div class="bb-rail-row">
                                        <span class="bb-rail-label plus">+</span>
                                        <div class="bb-rail-line plus"></div>
                                        <div style="display:flex;gap:6px;" id="rail-top-plus"></div>
                                    </div>
                                    <div class="bb-rail-row">
                                        <span class="bb-rail-label minus">-</span>
                                        <div class="bb-rail-line minus"></div>
                                        <div style="display:flex;gap:6px;" id="rail-top-minus"></div>
                                    </div>
                                </div>

                                <!-- Área Central de Terminais -->
                                <div class="bb-terminal-area">
                                    <!-- Números das colunas 1 a 15 -->
                                    <div class="bb-col-nums" id="bb-nums-top"></div>

                                    <!-- Linhas Superiores A, B, C, D, E -->
                                    <div style="position:relative;">
                                        <div class="bb-row-labels" style="top:2px;">
                                            <div>A</div><div>B</div><div>C</div><div>D</div><div>E</div>
                                        </div>
                                        <div style="display:flex;flex-direction:column;gap:6px;" id="bb-grid-top"></div>
                                    </div>

                                    <!-- Calha Central -->
                                    <div class="bb-divider"></div>

                                    <!-- Linhas Inferiores F, G, H, I, J -->
                                    <div style="position:relative;">
                                        <div class="bb-row-labels" style="top:2px;">
                                            <div>F</div><div>G</div><div>H</div><div>I</div><div>J</div>
                                        </div>
                                        <div style="display:flex;flex-direction:column;gap:6px;" id="bb-grid-bottom"></div>
                                    </div>

                                    <!-- Números das colunas inferiores 1 a 15 -->
                                    <div class="bb-col-nums" id="bb-nums-bottom"></div>
                                </div>

                                <!-- Barramento Inferior de Alimentação (+ e -) -->
                                <div class="bb-power-rail">
                                    <div class="bb-rail-row">
                                        <span class="bb-rail-label plus">+</span>
                                        <div class="bb-rail-line plus"></div>
                                        <div style="display:flex;gap:6px;" id="rail-bot-plus"></div>
                                    </div>
                                    <div class="bb-rail-row">
                                        <span class="bb-rail-label minus">-</span>
                                        <div class="bb-rail-line minus"></div>
                                        <div style="display:flex;gap:6px;" id="rail-bot-minus"></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Painel de Diagnóstico & Status do Circuito -->
                        <div class="circuit-status-box">
                            <div class="status-info">
                                <div class="status-badge" id="circuit-status-badge"></div>
                                <div>
                                    <div class="status-text" id="circuit-status-title">Circuito Pronto para Teste</div>
                                    <div style="font-size:0.85rem;color:#94A3B8;" id="circuit-status-desc">Energize a bancada para testar a corrente e os componentes.</div>
                                </div>
                            </div>
                            <div style="display:flex;gap:8px;">
                                <button class="mission-btn" onclick="lab_loadPreset('led_simple')"><i class="fa-solid fa-wand-magic-sparkles"></i> Auto-Montar Circuito Básico</button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- SUB-ABA 3: MISSÕES MAKER -->
                <div id="lab-subtab-missions" style="display:none;">
                    <div class="mission-card" id="mcard-1">
                        <div>
                            <div class="mission-title">⭐ Missão 1: O Primeiro LED</div>
                            <div class="mission-desc">Conecte o <b>+5V</b> ao barramento positivo, o <b>GND</b> ao negativo, adicione <b>1 Resistor de 220Ω</b> e <b>1 LED</b>. Ligue a energia para vê-lo brilhar!</div>
                        </div>
                        <button class="mission-btn" onclick="lab_startMission(1)">Iniciar Missão 1</button>
                    </div>

                    <div class="mission-card" id="mcard-2">
                        <div>
                            <div class="mission-title">⭐⭐ Missão 2: O Interruptor Táctil</div>
                            <div class="mission-desc">Adicione um <b>Pushbutton (Botão)</b> em série no circuito do LED para acendê-lo apenas quando o botão for pressionado!</div>
                        </div>
                        <button class="mission-btn" onclick="lab_startMission(2)">Iniciar Missão 2</button>
                    </div>

                    <div class="mission-card" id="mcard-3">
                        <div>
                            <div class="mission-title">⭐⭐⭐ Missão 3: Semáforo na Protoboard</div>
                            <div class="mission-desc">Monte 3 circuitos completos na protoboard: <b>LED Vermelho, LED Amarelo e LED Verde</b>, cada um protegido com seu próprio resistor de 220Ω!</div>
                        </div>
                        <button class="mission-btn" onclick="lab_startMission(3)">Iniciar Missão 3</button>
                    </div>
                </div>
            </div>

            <!-- Modal do Laboratório -->
            <div class="lab-modal" id="lab_modal">
                <div class="lab-modal-box">
                    <div style="font-size:3.8rem;" id="lab_mIcon">🎉</div>
                    <h2 style="font-family:'Fredoka One', cursive;color:white;margin:10px 0;" id="lab_mTitle">Parabéns!</h2>
                    <p style="color:#CBD5E1;font-size:1.05rem;line-height:1.5;margin-bottom:20px;" id="lab_mText">Mensagem</p>
                    <button class="mission-btn" onclick="lab_closeModal()">Continuar</button>
                </div>
            </div>
        `;

        lab_init();
        document.getElementById('labmaker-loaded')?.remove();
        const flag = document.createElement('div'); flag.id = 'labmaker-loaded'; flag.style.display='none'; container.appendChild(flag);
    }

    // ================= ESTADO E LÓGICA DO LABORATÓRIO INTERATIVO =================
    let lab_power = false;
    let lab_selectedTool = 'jumper';
    let lab_startHole = null;
    let lab_components = []; // { id, type, start, end, color, val, state }
    let lab_activeMission = null;

    function lab_init() {
        lab_buildBreadboardDOM();
        lab_updateMissionBadges();
        lab_demoResistor(220);
        lab_selectTool('jumper');
    }

    function lab_switchSubTab(tab) {
        playSound('click');
        ['theory','bancada','missions'].forEach(t => {
            const el = document.getElementById('lab-subtab-'+t);
            if(el) el.style.display = (t === tab) ? 'block' : 'none';
        });
        document.querySelectorAll('.lab-tab-btn').forEach((btn, idx) => {
            btn.classList.toggle('active', (tab==='theory'&&idx===0) || (tab==='bancada'&&idx===1) || (tab==='missions'&&idx===2));
        });
        if(tab === 'bancada') {
            setTimeout(lab_renderComponents, 50);
        }
    }

    function lab_selectTool(tool) {
        lab_selectedTool = tool;
        lab_startHole = null;
        document.querySelectorAll('.bb-hole').forEach(h => h.classList.remove('selected-start'));
        document.querySelectorAll('.toolbox .tool-btn').forEach(b => b.classList.remove('active'));
        const activeBtn = document.getElementById('tool-'+tool);
        if(activeBtn) activeBtn.classList.add('active');
    }

    function lab_demoResistor(val) {
        const valDisp = document.getElementById('res-val-display');
        const b1 = document.getElementById('band-1');
        const b2 = document.getElementById('band-2');
        const b3 = document.getElementById('band-3');
        if(!valDisp || !b1) return;
        if(val === 220) {
            valDisp.innerText = '220 Ω ±5%';
            b1.style.background = '#EF4444'; // Vermelho (2)
            b2.style.background = '#EF4444'; // Vermelho (2)
            b3.style.background = '#78350F'; // Marrom (x10)
        } else if(val === 1000) {
            valDisp.innerText = '1.000 Ω (1 kΩ) ±5%';
            b1.style.background = '#78350F'; // Marrom (1)
            b2.style.background = '#000000'; // Preto (0)
            b3.style.background = '#EF4444'; // Vermelho (x100)
        } else if(val === 10000) {
            valDisp.innerText = '10.000 Ω (10 kΩ) ±5%';
            b1.style.background = '#78350F'; // Marrom (1)
            b2.style.background = '#000000'; // Preto (0)
            b3.style.background = '#F59E0B'; // Laranja (x1000)
        }
    }

    function lab_buildBreadboardDOM() {
        const cols = 15;
        // Números
        ['bb-nums-top','bb-nums-bottom'].forEach(id => {
            const el = document.getElementById(id);
            if(!el) return;
            el.innerHTML = '';
            for(let i=1; i<=cols; i++) {
                const n = document.createElement('div');
                n.className = 'bb-num';
                n.innerText = i;
                el.appendChild(n);
            }
        });

        // Barramentos laterais
        ['rail-top-plus', 'rail-bot-plus'].forEach((id, rIdx) => {
            const el = document.getElementById(id);
            if(!el) return;
            el.innerHTML = '';
            for(let i=1; i<=cols; i++) {
                const hole = document.createElement('div');
                hole.className = 'bb-hole';
                hole.id = `hole-pwr-plus-${rIdx}-${i}`;
                hole.dataset.net = `PWR_PLUS`;
                hole.dataset.label = `5V (Positivo)`;
                hole.onclick = () => lab_holeClick(hole);
                hole.onmouseenter = () => lab_holeHover(hole);
                hole.onmouseleave = () => lab_holeLeave();
                el.appendChild(hole);
            }
        });

        ['rail-top-minus', 'rail-bot-minus'].forEach((id, rIdx) => {
            const el = document.getElementById(id);
            if(!el) return;
            el.innerHTML = '';
            for(let i=1; i<=cols; i++) {
                const hole = document.createElement('div');
                hole.className = 'bb-hole';
                hole.id = `hole-pwr-minus-${rIdx}-${i}`;
                hole.dataset.net = `PWR_MINUS`;
                hole.dataset.label = `GND (Terra)`;
                hole.onclick = () => lab_holeClick(hole);
                hole.onmouseenter = () => lab_holeHover(hole);
                hole.onmouseleave = () => lab_holeLeave();
                el.appendChild(hole);
            }
        });

        // Matriz Superior A-E
        const topGrid = document.getElementById('bb-grid-top');
        if(topGrid) {
            topGrid.innerHTML = '';
            ['A','B','C','D','E'].forEach(row => {
                const rDiv = document.createElement('div');
                rDiv.className = 'bb-grid';
                for(let col=1; col<=cols; col++) {
                    const hole = document.createElement('div');
                    hole.className = 'bb-hole';
                    hole.id = `hole-${row}-${col}`;
                    hole.dataset.net = `COL_TOP_${col}`;
                    hole.dataset.label = `${row}${col}`;
                    hole.onclick = () => lab_holeClick(hole);
                    hole.onmouseenter = () => lab_holeHover(hole);
                    hole.onmouseleave = () => lab_holeLeave();
                    rDiv.appendChild(hole);
                }
                topGrid.appendChild(rDiv);
            });
        }

        // Matriz Inferior F-J
        const botGrid = document.getElementById('bb-grid-bottom');
        if(botGrid) {
            botGrid.innerHTML = '';
            ['F','G','H','I','J'].forEach(row => {
                const rDiv = document.createElement('div');
                rDiv.className = 'bb-grid';
                for(let col=1; col<=cols; col++) {
                    const hole = document.createElement('div');
                    hole.className = 'bb-hole';
                    hole.id = `hole-${row}-${col}`;
                    hole.dataset.net = `COL_BOT_${col}`;
                    hole.dataset.label = `${row}${col}`;
                    hole.onclick = () => lab_holeClick(hole);
                    hole.onmouseenter = () => lab_holeHover(hole);
                    hole.onmouseleave = () => lab_holeLeave();
                    rDiv.appendChild(hole);
                }
                botGrid.appendChild(rDiv);
            });
        }
    }

    function lab_holeHover(hole) {
        const net = hole.dataset.net;
        document.querySelectorAll(`.bb-hole[data-net="${net}"]`).forEach(h => h.classList.add('highlight-net'));
    }

    function lab_holeLeave() {
        document.querySelectorAll('.bb-hole.highlight-net').forEach(h => h.classList.remove('highlight-net'));
    }

    function lab_holeClick(hole) {
        playSound('click');

        if(lab_selectedTool === 'eraser') {
            // Remove componentes ligados a este furo
            const hId = hole.id;
            lab_components = lab_components.filter(c => c.start !== hId && c.end !== hId);
            lab_renderComponents();
            lab_simulateCircuit();
            return;
        }

        if(!lab_startHole) {
            lab_startHole = hole;
            hole.classList.add('selected-start');
        } else {
            if(lab_startHole.id === hole.id) {
                lab_startHole.classList.remove('selected-start');
                lab_startHole = null;
                return;
            }

            const cId = 'comp_' + Date.now();
            let newComp = null;

            if(lab_selectedTool === 'jumper') {
                const color = document.getElementById('lab-jumper-color')?.value || '#EF4444';
                newComp = { id:cId, type:'jumper', start:lab_startHole.id, end:hole.id, color:color };
            } else if(lab_selectedTool === 'resistor') {
                const val = parseInt(document.getElementById('lab-resistor-val')?.value || '220');
                newComp = { id:cId, type:'resistor', start:lab_startHole.id, end:hole.id, val:val };
            } else if(lab_selectedTool === 'led') {
                const color = document.getElementById('lab-led-color')?.value || 'red';
                newComp = { id:cId, type:'led', start:lab_startHole.id, end:hole.id, color:color, lit:false, burned:false };
            } else if(lab_selectedTool === 'button') {
                newComp = { id:cId, type:'button', start:lab_startHole.id, end:hole.id, pressed:false };
            }

            if(newComp) {
                lab_components.push(newComp);
                lab_renderComponents();
                lab_simulateCircuit();
            }

            lab_startHole.classList.remove('selected-start');
            lab_startHole = null;
        }
    }

    function lab_renderComponents() {
        const svg = document.getElementById('bb-svg');
        const board = document.getElementById('breadboard-element');
        if(!svg || !board) return;
        
        svg.innerHTML = '';
        const bRect = board.getBoundingClientRect();

        lab_components.forEach(c => {
            const el1 = document.getElementById(c.start);
            const el2 = document.getElementById(c.end);
            if(!el1 || !el2) return;

            const r1 = el1.getBoundingClientRect();
            const r2 = el2.getBoundingClientRect();

            const x1 = r1.left + r1.width/2 - bRect.left;
            const y1 = r1.top + r1.height/2 - bRect.top;
            const x2 = r2.left + r2.width/2 - bRect.left;
            const y2 = r2.top + r2.height/2 - bRect.top;

            if(c.type === 'jumper') {
                // Curva do fio
                const dx = x2 - x1;
                const dy = y2 - y1;
                const cx = (x1 + x2)/2 + (dy * 0.2);
                const cy = (y1 + y2)/2 - Math.abs(dx * 0.3) - 15;

                const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                path.setAttribute('d', `M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`);
                path.setAttribute('stroke', c.color);
                path.setAttribute('stroke-width', '5');
                path.setAttribute('fill', 'none');
                path.setAttribute('stroke-linecap', 'round');
                path.setAttribute('filter', 'drop-shadow(0 3px 4px rgba(0,0,0,0.4))');
                svg.appendChild(path);

                // Pontas metálicas
                [ [x1,y1], [x2,y2] ].forEach(([px,py]) => {
                    const pin = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                    pin.setAttribute('cx', px); pin.setAttribute('cy', py); pin.setAttribute('r', '4');
                    pin.setAttribute('fill', '#94A3B8'); pin.setAttribute('stroke', '#0F172A'); pin.setAttribute('stroke-width', '1.5');
                    svg.appendChild(pin);
                });
            } else if(c.type === 'resistor') {
                // Desenho do corpo do resistor com faixas
                const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                line.setAttribute('x1', x1); line.setAttribute('y1', y1); line.setAttribute('x2', x2); line.setAttribute('y2', y2);
                line.setAttribute('stroke', '#94A3B8'); line.setAttribute('stroke-width', '2.5');
                svg.appendChild(line);

                const mx = (x1 + x2)/2, my = (y1 + y2)/2;
                const angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;

                const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
                g.setAttribute('transform', `translate(${mx},${my}) rotate(${angle})`);

                const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                rect.setAttribute('x', '-16'); rect.setAttribute('y', '-6');
                rect.setAttribute('width', '32'); rect.setAttribute('height', '12');
                rect.setAttribute('rx', '4'); rect.setAttribute('fill', '#D4B996');
                rect.setAttribute('stroke', '#8C6D4F'); rect.setAttribute('stroke-width', '1.5');
                g.appendChild(rect);

                // Faixas de cores
                const bandColor = c.val === 220 ? '#EF4444' : (c.val === 1000 ? '#78350F' : '#78350F');
                const mulColor  = c.val === 220 ? '#78350F' : (c.val === 1000 ? '#EF4444' : '#F59E0B');
                
                [ [-10, bandColor], [-4, bandColor], [2, mulColor], [9, '#F59E0B'] ].forEach(([bx, bCol]) => {
                    const b = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                    b.setAttribute('x', bx); b.setAttribute('y', '-6');
                    b.setAttribute('width', '3'); b.setAttribute('height', '12');
                    b.setAttribute('fill', bCol);
                    g.appendChild(b);
                });

                svg.appendChild(g);
            } else if(c.type === 'led') {
                // Pernas do LED (Ânodo em x1,y1 e Cátodo em x2,y2)
                const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                line.setAttribute('x1', x1); line.setAttribute('y1', y1); line.setAttribute('x2', x2); line.setAttribute('y2', y2);
                line.setAttribute('stroke', '#94A3B8'); line.setAttribute('stroke-width', '2');
                svg.appendChild(line);

                const mx = (x1 + x2)/2, my = (y1 + y2)/2;
                const ledColorHex = c.color === 'red' ? '#EF4444' : (c.color === 'green' ? '#10B981' : (c.color === 'yellow' ? '#F59E0B' : '#38BDF8'));
                
                const ledCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                ledCircle.setAttribute('cx', mx); ledCircle.setAttribute('cy', my);
                ledCircle.setAttribute('r', '11');
                ledCircle.setAttribute('fill', ledColorHex);
                ledCircle.setAttribute('stroke', '#FFFFFF');
                ledCircle.setAttribute('stroke-width', '2');
                
                let ledClass = 'placed-led';
                if(c.burned) ledClass += ' burned';
                else if(c.lit) ledClass += ` lit-${c.color}`;
                ledCircle.setAttribute('class', ledClass);

                svg.appendChild(ledCircle);

                // Indicador de polaridade (+) e (-)
                const txtPlus = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                txtPlus.setAttribute('x', x1 - 6); txtPlus.setAttribute('y', y1 - 4);
                txtPlus.setAttribute('fill', '#EF4444'); txtPlus.setAttribute('font-size', '10'); txtPlus.setAttribute('font-weight', 'bold');
                txtPlus.textContent = '+';
                svg.appendChild(txtPlus);
            } else if(c.type === 'button') {
                // Desenho do botão
                const mx = (x1 + x2)/2, my = (y1 + y2)/2;
                const btnBox = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                btnBox.setAttribute('x', mx - 12); btnBox.setAttribute('y', my - 12);
                btnBox.setAttribute('width', '24'); btnBox.setAttribute('height', '24');
                btnBox.setAttribute('rx', '4'); btnBox.setAttribute('fill', '#334155'); btnBox.setAttribute('stroke', '#64748B'); btnBox.setAttribute('stroke-width', '2');
                btnBox.style.cursor = 'pointer';
                btnBox.style.pointerEvents = 'all';
                btnBox.onclick = () => {
                    c.pressed = !c.pressed;
                    playSound('click');
                    lab_renderComponents();
                    lab_simulateCircuit();
                };
                svg.appendChild(btnBox);

                const btnCap = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                btnCap.setAttribute('cx', mx); btnCap.setAttribute('cy', my);
                btnCap.setAttribute('r', c.pressed ? '6' : '8');
                btnCap.setAttribute('fill', c.pressed ? '#10B981' : '#F59E0B');
                btnCap.style.cursor = 'pointer';
                btnCap.style.pointerEvents = 'all';
                btnCap.onclick = () => {
                    c.pressed = !c.pressed;
                    playSound('click');
                    lab_renderComponents();
                    lab_simulateCircuit();
                };
                svg.appendChild(btnCap);
            }
        });
    }

    function lab_togglePower() {
        lab_power = !lab_power;
        playSound('click');
        const pBtn = document.getElementById('lab-pwr-btn');
        const pTxt = document.getElementById('lab-pwr-text');
        const vMeter = document.getElementById('lab-volt-meter');

        if(lab_power) {
            pBtn.classList.add('on');
            pTxt.innerText = 'LIGADA (5V)';
            vMeter.classList.add('on');
            vMeter.innerText = '5.00 V (ON)';
        } else {
            pBtn.classList.remove('on');
            pTxt.innerText = 'DESLIGADA';
            vMeter.classList.remove('on');
            vMeter.innerText = '0.00 V (OFF)';
        }

        lab_simulateCircuit();
    }

    function lab_simulateCircuit() {
        const badge = document.getElementById('circuit-status-badge');
        const title = document.getElementById('circuit-status-title');
        const desc = document.getElementById('circuit-status-desc');
        if(!badge || !title || !desc) return;

        // Reset dos componentes
        lab_components.forEach(c => {
            if(c.type === 'led') { c.lit = false; c.burned = false; }
        });

        if(!lab_power) {
            badge.className = 'status-badge';
            title.innerText = 'Bancada Desligada';
            desc.innerText = 'Clique no botão "ENERGIA" para alimentar o circuito com 5V.';
            lab_renderComponents();
            return;
        }

        // Construção do Grafo de Conectividade Elétrica
        // Mapeia nets -> furos
        let nodeAdj = {}; // net -> [ { toNet, component } ]
        
        function addEdge(n1, n2, comp) {
            if(!nodeAdj[n1]) nodeAdj[n1] = [];
            if(!nodeAdj[n2]) nodeAdj[n2] = [];
            nodeAdj[n1].push({ to:n2, comp:comp });
            nodeAdj[n2].push({ to:n1, comp:comp });
        }

        lab_components.forEach(c => {
            const h1 = document.getElementById(c.start);
            const h2 = document.getElementById(c.end);
            if(!h1 || !h2) return;
            const net1 = h1.dataset.net;
            const net2 = h2.dataset.net;
            if(!net1 || !net2) return;

            if(c.type === 'jumper') {
                addEdge(net1, net2, c);
            } else if(c.type === 'resistor') {
                addEdge(net1, net2, c);
            } else if(c.type === 'button') {
                if(c.pressed) addEdge(net1, net2, c);
            } else if(c.type === 'led') {
                // LED conduz de start (Ânodo) para end (Cátodo)
                if(!nodeAdj[net1]) nodeAdj[net1] = [];
                if(!nodeAdj[net2]) nodeAdj[net2] = [];
                nodeAdj[net1].push({ to:net2, comp:c, isLedForward:true });
                nodeAdj[net2].push({ to:net1, comp:c, isLedReverse:true });
            }
        });

        // Verificação de Curto-Circuito Direto (PWR_PLUS conectado a PWR_MINUS apenas por jumpers)
        let visited = new Set();
        let queue = ['PWR_PLUS'];
        visited.add('PWR_PLUS');
        let shortCircuit = false;
        let onlyJumpers = true;

        while(queue.length > 0) {
            let curr = queue.shift();
            if(curr === 'PWR_MINUS') {
                shortCircuit = true;
                break;
            }
            if(nodeAdj[curr]) {
                nodeAdj[curr].forEach(edge => {
                    if(edge.comp.type === 'jumper' && !visited.has(edge.to)) {
                        visited.add(edge.to);
                        queue.push(edge.to);
                    }
                });
            }
        }

        if(shortCircuit) {
            badge.className = 'status-badge error';
            title.innerText = '🚨 ALERTA: Curto-Circuito!';
            desc.innerText = '5V está ligado diretamente ao GND sem nenhuma carga/resistor. Desligue imediatamente!';
            playSound('error');
            lab_renderComponents();
            return;
        }

        // Análise de Caminhos para LEDs
        let anyLedLit = false;
        let anyLedBurned = false;
        let anyPolarityError = false;

        const leds = lab_components.filter(c => c.type === 'led');

        leds.forEach(led => {
            const anHole = document.getElementById(led.start);
            const catHole = document.getElementById(led.end);
            if(!anHole || !catHole) return;
            const anNet = anHole.dataset.net;
            const catNet = catHole.dataset.net;

            // Busca caminho de PWR_PLUS até o Ânodo (anNet)
            let hasPlus = lab_findPath(nodeAdj, 'PWR_PLUS', anNet, led.id);
            // Busca caminho do Cátodo (catNet) até PWR_MINUS
            let hasMinus = lab_findPath(nodeAdj, catNet, 'PWR_MINUS', led.id);

            // Verifica se tem resistor no circuito desse LED
            let hasResistor = lab_checkResistorInPath(nodeAdj, 'PWR_PLUS', 'PWR_MINUS', led.id);

            if(hasPlus && hasMinus) {
                if(hasResistor) {
                    led.lit = true;
                    anyLedLit = true;
                } else {
                    led.burned = true;
                    anyLedBurned = true;
                }
            } else {
                // Checa se está com polaridade invertida (5V no Cátodo e GND no Ânodo)
                let revPlus = lab_findPath(nodeAdj, 'PWR_PLUS', catNet, led.id);
                let revMinus = lab_findPath(nodeAdj, anNet, 'PWR_MINUS', led.id);
                if(revPlus && revMinus) {
                    anyPolarityError = true;
                }
            }
        });

        if(anyLedBurned) {
            badge.className = 'status-badge error';
            title.innerText = '💥 LED Queimou!';
            desc.innerText = 'O LED recebeu 5V sem nenhum resistor de proteção (220Ω)! A corrente excessiva queimou o componente.';
            playSound('error');
        } else if(anyPolarityError) {
            badge.className = 'status-badge error';
            title.innerText = '⚠️ Polaridade Reversa!';
            desc.innerText = 'O LED é um diodo e só conduz no sentido direto. Conecte a perna longa (+) ao 5V e a perna curta (-) ao GND.';
            playSound('error');
        } else if(anyLedLit) {
            badge.className = 'status-badge active';
            const countLit = leds.filter(l => l.lit).length;
            title.innerText = `✨ Circuito Operando! (${countLit} LED${countLit>1?'s':''} Aceso${countLit>1?'s':''})`;
            desc.innerText = 'Corrente fluindo perfeitamente através do resistor limitador (~15mA). Tudo seguro!';
            playSound('success');

            // Validação de Missão
            lab_checkMissionComplete(countLit);
        } else {
            badge.className = 'status-badge';
            title.innerText = 'Circuito Aberto';
            desc.innerText = 'A corrente não consegue completar o ciclo de 5V até o GND. Verifique os jumpers e conexões.';
        }

        lab_renderComponents();
    }

    function lab_findPath(adj, startNet, targetNet, ignoreCompId) {
        if(startNet === targetNet) return true;
        let visited = new Set();
        let queue = [startNet];
        visited.add(startNet);

        while(queue.length > 0) {
            let curr = queue.shift();
            if(curr === targetNet) return true;
            if(adj[curr]) {
                adj[curr].forEach(edge => {
                    if(edge.comp.id !== ignoreCompId && !visited.has(edge.to)) {
                        if(edge.comp.type === 'button' && !edge.comp.pressed) return;
                        if(edge.isLedReverse) return; // LED bloqueia reversa
                        visited.add(edge.to);
                        queue.push(edge.to);
                    }
                });
            }
        }
        return false;
    }

    function lab_checkResistorInPath(adj, startNet, targetNet, ledId) {
        let visited = new Set();
        let queue = [{ net:startNet, hasR:false }];
        visited.add(startNet);

        while(queue.length > 0) {
            let curr = queue.shift();
            if(curr.net === targetNet && curr.hasR) return true;
            if(adj[curr.net]) {
                adj[curr.net].forEach(edge => {
                    let nextHasR = curr.hasR || (edge.comp.type === 'resistor' && edge.comp.val >= 100);
                    if(!visited.has(edge.to + (nextHasR?'_R':'_N'))) {
                        if(edge.comp.type === 'button' && !edge.comp.pressed) return;
                        if(edge.isLedReverse) return;
                        visited.add(edge.to + (nextHasR?'_R':'_N'));
                        queue.push({ net:edge.to, hasR:nextHasR });
                    }
                });
            }
        }
        return false;
    }

    function lab_checkMissionComplete(countLit) {
        if(!lab_activeMission) return;
        if(lab_activeMission === 1 && countLit >= 1) {
            lab_completeMission(1, 'Primeiro LED Aceso!', 'Você montou com sucesso seu primeiro circuito na Protoboard com resistor de proteção!');
        } else if(lab_activeMission === 2 && countLit >= 1) {
            const hasBtn = lab_components.some(c => c.type === 'button' && c.pressed);
            if(hasBtn) {
                lab_completeMission(2, 'Mestre dos Interruptores!', 'Você controlou o acendimento do LED usando um botão Pushbutton!');
            }
        } else if(lab_activeMission === 3 && countLit >= 3) {
            lab_completeMission(3, 'Semáforo Completo na Protoboard!', 'Impressionante! 3 LEDs protegidos por resistores funcionando em conjunto!');
        }
    }

    function lab_completeMission(level, title, text) {
        lab_activeMission = null;
        let saved = JSON.parse(localStorage.getItem('labmaker_levels')||'[]');
        if(!saved.includes(level)) saved.push(level);
        localStorage.setItem('labmaker_levels', JSON.stringify(saved));
        lab_updateMissionBadges();
        lab_showModal('🏆', title, text);
    }

    function lab_updateMissionBadges() {
        let saved = JSON.parse(localStorage.getItem('labmaker_levels')||'[]');
        [1,2,3].forEach(lvl => {
            const card = document.getElementById('mcard-'+lvl);
            if(card && saved.includes(lvl)) {
                card.classList.add('completed');
                const btn = card.querySelector('button');
                if(btn) { btn.innerText = '✅ Concluído ⭐'; btn.style.background='#10B981'; }
            }
        });
    }

    function lab_startMission(level) {
        lab_activeMission = level;
        lab_clearBoard();
        lab_switchSubTab('bancada');
        if(level === 1) {
            lab_showModal('🎯','Missão 1 Iniciada!','Conecte +5V ao barramento vermelho, GND ao azul, encaixe 1 Resistor de 220Ω e 1 LED. Ligue a ENERGIA para vencer!');
        } else if(level === 2) {
            lab_showModal('🎯','Missão 2 Iniciada!','Monte o circuito do LED colocando um Pushbutton (Botão) no caminho. Aperte o botão para acender o LED!');
        } else if(level === 3) {
            lab_showModal('🎯','Missão 3 Iniciada!','Monte 3 LEDs (Vermelho, Amarelo e Verde) com 3 Resistores de 220Ω na protoboard!');
        }
    }

    function lab_loadPreset(preset) {
        lab_clearBoard();
        if(preset === 'led_simple') {
            // Preset do circuito básico
            lab_components = [
                { id:'j1', type:'jumper', start:'hole-pwr-plus-0-1', end:'hole-A-2', color:'#EF4444' },
                { id:'r1', type:'resistor', start:'hole-B-2', end:'hole-B-6', val:220 },
                { id:'l1', type:'led', start:'hole-C-6', end:'hole-C-9', color:'red', lit:false, burned:false },
                { id:'j2', type:'jumper', start:'hole-D-9', end:'hole-pwr-minus-0-9', color:'#0F172A' }
            ];
            lab_renderComponents();
            if(!lab_power) lab_togglePower();
            else lab_simulateCircuit();
        }
    }

    function lab_undoLast() {
        if(lab_components.length > 0) {
            playSound('click');
            lab_components.pop();
            lab_renderComponents();
            lab_simulateCircuit();
        }
    }

    function lab_clearBoard() {
        playSound('click');
        lab_components = [];
        lab_startHole = null;
        if(lab_power) lab_togglePower();
        lab_renderComponents();
        lab_simulateCircuit();
    }

    function lab_showModal(icon, title, text) {
        document.getElementById('lab_mIcon').innerText = icon;
        document.getElementById('lab_mTitle').innerText = title;
        document.getElementById('lab_mText').innerText = text;
        document.getElementById('lab_modal').classList.add('active');
    }

    function lab_closeModal() {
        document.getElementById('lab_modal').classList.remove('active');
    }

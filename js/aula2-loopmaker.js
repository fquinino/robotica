/* ==========================================================================
   AULA 2 — MÁQUINA DE LOOPS (ESTRUTURAS DE REPETIÇÃO FOR EM C/C++)
   ========================================================================== */

    function loadLoopmaker() {
        const container = document.getElementById('loopmaker-container');
        container.innerHTML = `
            <style>
                .loop-wrapper { color:#E2E8F0; }
                .loop-header-card { background:linear-gradient(135deg, rgba(139,92,246,0.18), rgba(30,41,59,0.9)); border:2px solid #8B5CF6; border-radius:24px; padding:18px 22px; margin-bottom:18px; box-shadow:0 10px 30px rgba(0,0,0,0.4); }
                .loop-header-card h2 { font-family:'Fredoka One', cursive; color:#C4B5FD; font-size:clamp(1.2rem, 3vw, 1.6rem); margin:0 0 6px; display:flex; align-items:center; gap:10px; }
                .loop-header-card p { color:#CBD5E1; margin:0; font-size:0.92rem; line-height:1.5; }
                
                .loop-level-bar { display:flex; gap:10px; justify-content:center; margin-bottom:18px; flex-wrap:wrap; }
                .loop-level-btn { background:#1E293B; border:2px solid #334155; color:#94A3B8; padding:9px 18px; border-radius:30px; font-weight:900; cursor:pointer; font-size:0.95rem; transition:0.2s all; display:flex; align-items:center; gap:6px; }
                .loop-level-btn:hover { border-color:#8B5CF6; color:white; transform:translateY(-2px); }
                .loop-level-btn.active { background:linear-gradient(135deg,#8B5CF6,#6D28D9); color:white; border-color:#A78BFA; box-shadow:0 0 20px rgba(139,92,246,0.45); }
                .loop-level-btn.done { border-color:#10B981; color:#34D399; }

                /* NÍVEL 1: ESTEIRA DE FÁBRICA */
                .loop-factory-scene { background:#0F172A; border-radius:22px; height:240px; border:2px solid #334155; overflow:hidden; display:flex; flex-direction:column; justify-content:flex-end; position:relative; box-shadow:inset 0 0 30px rgba(0,0,0,0.6); margin-bottom:16px; }
                .loop-factory-hud { position:absolute; top:12px; right:15px; background:rgba(15,23,42,0.9); padding:8px 18px; border-radius:30px; border:2px solid #8B5CF6; color:white; font-weight:900; z-index:20; }
                .loop-factory-hud span { color:#F59E0B; font-size:1.4rem; font-family:'Fredoka One', cursive; }
                .loop-stamper-base { position:absolute; top:-5px; left:150px; width:60px; height:30px; background:#334155; border-radius:0 0 15px 15px; z-index:10; border:3px solid #1E293B; }
                .loop-stamper-arm { position:absolute; top:25px; left:170px; width:20px; height:50px; background:#94A3B8; border:3px solid #475569; z-index:9; transition:height 0.2s; }
                .loop-stamper-head { position:absolute; bottom:-20px; left:-20px; width:60px; height:20px; background:#EC4899; border:3px solid #BE185D; border-radius:5px; }
                .loop-stamper-arm.hitting { height:105px; }
                .loop-belt { position:absolute; bottom:25px; width:100%; height:40px; background:#475569; overflow:hidden; border-top:5px solid #334155; border-bottom:5px solid #334155; }
                .loop-belt-stripes { position:absolute; width:200%; height:100%; background:repeating-linear-gradient(90deg, transparent, transparent 20px, #334155 20px, #334155 40px); }
                .loop-belt-stripes.running { animation:beltMove 0.8s linear infinite; }
                .loop-boxes-track { position:absolute; bottom:65px; left:0; width:100%; display:flex; gap:30px; padding-left:150px; transition:transform 0.5s ease-in-out; z-index:5; }
                .loop-box { width:60px; height:60px; background:#D97706; border:3px solid #92400E; border-radius:8px; display:flex; align-items:center; justify-content:center; font-size:2rem; position:relative; box-shadow:0 4px 10px rgba(0,0,0,0.3); transition:all 0.2s; }
                .loop-stamp { position:absolute; top:0; left:0; width:100%; height:100%; display:flex; align-items:center; justify-content:center; color:#10B981; font-family:'Fredoka One', cursive; font-size:2.4rem; filter:drop-shadow(0 0 10px #10B981); z-index:10; animation:stampPop 0.3s cubic-bezier(0.175,0.885,0.32,1.275) forwards; }
                #l_code_line_carimbar.active { background:rgba(236,72,153,0.35); color:#F472B6 !important; border-left:3px solid #EC4899; box-shadow:0 0 12px rgba(236,72,153,0.6); }

                /* MINI-IDE & LAYOUT GRID */
                .loop-ide-layout { display:grid; grid-template-columns:minmax(290px, 1fr) minmax(320px, 1.2fr); gap:18px; margin-bottom:15px; }
                @media (max-width: 820px) { .loop-ide-layout { grid-template-columns:1fr; } }
                
                .loop-editor-card { background:#090D16; border:2px solid #8B5CF6; border-radius:20px; padding:16px; display:flex; flex-direction:column; box-shadow:0 10px 25px rgba(0,0,0,0.5); }
                .loop-editor-topbar { display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #1E293B; padding-bottom:10px; margin-bottom:12px; }
                .loop-editor-title { font-family:'Fredoka One'; color:#C4B5FD; font-size:1.05rem; display:flex; align-items:center; gap:8px; }
                .loop-lang-tag { background:rgba(139,92,246,0.25); color:#A78BFA; padding:3px 10px; border-radius:12px; font-size:0.75rem; font-weight:800; border:1px solid #8B5CF6; }

                /* Teclado Maker de Atalhos Rápidos */
                .loop-shortcuts-bar { display:flex; gap:6px; flex-wrap:wrap; margin-bottom:12px; background:#111827; padding:8px; border-radius:12px; border:1px solid #1F2937; }
                .loop-shortcut-btn { background:#1F2937; border:1px solid #374151; color:#E5E7EB; padding:6px 11px; border-radius:8px; font-size:0.8rem; font-weight:800; cursor:pointer; transition:0.15s; font-family:'Nunito', sans-serif; display:flex; align-items:center; gap:4px; }
                .loop-shortcut-btn:hover { background:#8B5CF6; border-color:#A78BFA; color:white; transform:scale(1.04); }
                .loop-shortcut-btn.clear { background:#450A0A; border-color:#991B1B; color:#FCA5A5; }
                .loop-shortcut-btn.clear:hover { background:#DC2626; color:white; }

                /* Scaffolding Editor (Nível 2 e 3) */
                .scaffold-lines { background:#030712; border-radius:14px; padding:16px; border:1px solid #1F2937; font-family:'Fira Code', monospace; font-size:0.95rem; line-height:2.2; color:#E2E8F0; }
                .scaffold-line { padding:2px 8px; border-radius:6px; transition:background 0.2s; border-left:3px solid transparent; }
                .scaffold-line.active { background:rgba(139,92,246,0.3); border-left-color:#EC4899; }
                .p-input-num { background:#1E293B; border:2px solid #8B5CF6; color:#FBBF24; font-family:'Fredoka One'; font-size:1.1rem; width:55px; padding:4px 6px; border-radius:8px; text-align:center; outline:none; }
                .p-select-cmd { background:#1E293B; border:2px solid #38BDF8; color:#38BDF8; font-family:'Fira Code', monospace; font-size:0.9rem; font-weight:bold; padding:4px 8px; border-radius:8px; outline:none; cursor:pointer; }

                /* Textarea Editor (Nível 4) */
                .loop-code-wrapper { position:relative; display:flex; background:#030712; border-radius:14px; border:1px solid #1F2937; overflow:hidden; min-height:180px; }
                .loop-line-numbers { background:#0B0F19; color:#4B5563; padding:12px 8px; text-align:right; font-family:'Fira Code', monospace; font-size:0.88rem; line-height:1.7; user-select:none; border-right:1px solid #1F2937; min-width:32px; }
                .loop-code-input { flex:1; background:transparent; border:none; color:#F3F4F6; padding:12px; font-family:'Fira Code', monospace; font-size:0.9rem; line-height:1.7; resize:none; outline:none; white-space:pre; tab-size:4; min-height:180px; }

                /* Guia de Sintaxe Colapsável */
                .loop-syntax-card { background:#0F172A; border:1px dashed #8B5CF6; border-radius:12px; padding:10px 14px; margin-top:10px; font-size:0.82rem; color:#CBD5E1; }
                .loop-syntax-card b { color:#C4B5FD; }
                .loop-syntax-card code { background:#1E293B; color:#F59E0B; padding:2px 6px; border-radius:4px; font-family:'Fira Code', monospace; }

                /* Simulação do Robô no Grid */
                .loop-sim-card { background:#090D16; border:2px solid #334155; border-radius:20px; padding:16px; display:flex; flex-direction:column; align-items:center; box-shadow:0 10px 25px rgba(0,0,0,0.5); }
                .loop-sim-topbar { width:100%; display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #1E293B; padding-bottom:8px; margin-bottom:12px; }
                .loop-sim-title { font-family:'Fredoka One'; color:#38BDF8; font-size:1.05rem; }
                .loop-sim-hud { font-weight:800; font-size:0.85rem; color:#F59E0B; background:#1E293B; padding:4px 10px; border-radius:12px; }

                /* Tabuleiro Grid */
                .loop-board { display:grid; gap:4px; padding:8px; border-radius:18px; background:linear-gradient(180deg,#1E293B,#0F172A); border:3px solid #334155; box-shadow:0 8px 30px rgba(0,0,0,0.6); max-width:380px; width:100%; aspect-ratio:1; }
                .loop-cell { background:rgba(30,41,59,0.7); border-radius:8px; border:2px solid rgba(51,65,85,0.7); display:flex; align-items:center; justify-content:center; position:relative; aspect-ratio:1; transition:all 0.2s; }
                .loop-cell.wall { background:repeating-linear-gradient(45deg,#334155,#334155 4px,#1E293B 4px,#1E293B 8px); border-color:#475569; }
                .loop-cell.wall::after { content:'🧱'; font-size:1.3rem; opacity:0.85; }
                .loop-cell.coin::after { content:'🪙'; font-size:1.4rem; animation:coinSpin 1.5s infinite alternate; filter:drop-shadow(0 0 6px #F59E0B); }
                .loop-cell.chest::after { content:'🏆'; font-size:1.6rem; animation:chestGlow 1.2s infinite alternate; filter:drop-shadow(0 0 8px #FBBF24); }
                .loop-cell.robot { background:rgba(254,240,138,0.25); border-color:#F59E0B; box-shadow:0 0 16px rgba(245,158,11,0.5); z-index:10; }
                .loop-cell.robot svg { filter:drop-shadow(0 0 6px rgba(245,158,11,0.7)); }
                .loop-cell.robot.moving svg { animation:robotWalk 0.3s ease-in-out; }
                .loop-cell.robot.crash { background:rgba(239,68,68,0.35); border-color:#EF4444; box-shadow:0 0 25px rgba(239,68,68,0.8); animation:errorShake 0.4s; }
                .loop-cell.robot.win { background:rgba(16,185,129,0.35); border-color:#10B981; box-shadow:0 0 25px rgba(16,185,129,0.8); }

                /* Botões de Ação */
                .loop-actions { display:flex; gap:10px; margin-top:14px; width:100%; }
                .loop-btn-run { background:linear-gradient(135deg,#8B5CF6,#6D28D9); color:white; border:none; padding:13px 20px; border-radius:16px; font-family:'Fredoka One', cursive; font-size:1.15rem; flex:2; border-bottom:5px solid #4C1D95; cursor:pointer; transition:0.15s; display:flex; align-items:center; justify-content:center; gap:8px; box-shadow:0 6px 20px rgba(139,92,246,0.35); }
                .loop-btn-run:active { transform:translateY(4px); border-bottom-width:1px; }
                .loop-btn-run:disabled { background:#475569; border-bottom-color:#1E293B; cursor:not-allowed; box-shadow:none; }
                .loop-btn-reset { background:#334155; color:#CBD5E1; border:none; padding:13px 18px; border-radius:16px; font-family:'Fredoka One', cursive; font-size:1rem; flex:1; border-bottom:5px solid #1E293B; cursor:pointer; transition:0.15s; }

                /* Modal de Vitória */
                .loop-modal { position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(15,23,42,0.88); backdrop-filter:blur(8px); display:flex; justify-content:center; align-items:center; z-index:9999; opacity:0; pointer-events:none; transition:0.3s; }
                .loop-modal.active { opacity:1; pointer-events:all; }
                .loop-modal-box { background:linear-gradient(180deg,#1E293B,#0F172A); padding:32px 24px; border-radius:28px; max-width:440px; width:92%; text-align:center; border:3px solid #8B5CF6; box-shadow:0 0 45px rgba(139,92,246,0.4); }
                .loop-modal-icon { font-size:4rem; margin-bottom:6px; animation:stampPop 0.4s cubic-bezier(0.175,0.885,0.32,1.275); }
                .loop-modal-title { font-family:'Fredoka One', cursive; color:white; font-size:1.8rem; margin:0 0 8px; }
                .loop-modal-text { color:#CBD5E1; margin:0 0 20px; font-size:0.95rem; line-height:1.6; }
                .loop-btn-modal { background:linear-gradient(135deg,#10B981,#059669); border:none; padding:13px 32px; border-radius:50px; font-weight:900; font-size:1.05rem; color:white; cursor:pointer; border-bottom:4px solid #047857; transition:0.15s; }

                @keyframes coinSpin { 0%{transform:scale(0.9) rotate(0deg);} 100%{transform:scale(1.1) rotate(15deg);} }
                @keyframes chestGlow { 0%{transform:scale(1);} 100%{transform:scale(1.18);} }
                @keyframes beltMove { 100% { transform:translateX(-40px); } }
                @keyframes stampPop { 0% { transform:scale(3); opacity:0; } 100% { transform:scale(1); opacity:1; } }
            </style>

            <div class="loop-wrapper">
                <div class="loop-header-card">
                    <h2>🔄 Aula 2: Estruturas de Repetição & Laço FOR em C/C++</h2>
                    <p id="loop-header-desc">Aprenda a criar laços <b>FOR</b> em C/C++ para automatizar comandos repetitivos do robô!</p>
                </div>

                <div class="loop-level-bar">
                    <button class="loop-level-btn active" data-level="1" onclick="l2_switchLevel(1)"><i class="fa-solid fa-industry"></i> Nível 1: Fábrica</button>
                    <button class="loop-level-btn" data-level="2" onclick="l2_switchLevel(2)"><i class="fa-solid fa-puzzle-piece"></i> Nível 2: 2 Loops</button>
                    <button class="loop-level-btn" data-level="3" onclick="l2_switchLevel(3)"><i class="fa-solid fa-layer-group"></i> Nível 3: Múltiplos Comandos em 1 FOR</button>
                    <button class="loop-level-btn" data-level="4" onclick="l2_switchLevel(4)"><i class="fa-solid fa-code"></i> Nível 4: Mini-IDE C/C++</button>
                </div>

                <!-- CONTEÚDO NÍVEL 1: FÁBRICA DE LOOPS -->
                <div id="l2_view_lvl1">
                    <div class="loop-factory-scene">
                        <div class="loop-factory-hud">Loop: <span id="l_hud-count">0</span></div>
                        <div class="loop-stamper-base"></div>
                        <div class="loop-stamper-arm" id="l_stamper-arm"><div class="loop-stamper-head"></div></div>
                        <div class="loop-boxes-track" id="l_boxes-track"></div>
                        <div class="loop-belt"><div class="loop-belt-stripes" id="l_belt-stripes"></div></div>
                    </div>
                    
                    <div style="background:#090D16;border:2px solid #8B5CF6;border-radius:18px;padding:18px;margin-bottom:15px;">
                        <div style="color:#64748B;font-size:0.85rem;font-family:'Fira Code';margin-bottom:6px;">// Laço FOR em Linguagem C / C++</div>
                        <div style="font-family:'Fira Code';font-size:1.05rem;line-height:2.2;">
                            <span style="color:#F472B6;font-weight:bold;">for</span> ( <span style="color:#38BDF8;">int</span> i = 1; i &lt;= <select id="l_sel-loop" style="background:#1E293B;color:#34D399;border:2px solid #8B5CF6;padding:4px 12px;border-radius:8px;font-family:'Fredoka One';font-size:1.1rem;cursor:pointer;"><option value="3">3</option><option value="5" selected>5</option><option value="8">8</option></select>; i++ ) {<br>
                            &nbsp;&nbsp;&nbsp;&nbsp;<span id="l_code_line_carimbar" style="color:#60A5FA;font-weight:bold;padding:2px 8px;border-radius:6px;transition:0.2s;">carimbarCaixa();</span><br>
                            }
                        </div>
                    </div>

                    <div class="loop-actions">
                        <button class="loop-btn-run" id="l_btn_run1" onclick="l_startFactory()"><i class="fa-solid fa-play"></i> EXECUTAR LAÇO FOR</button>
                    </div>
                </div>

                <!-- CONTEÚDO NÍVEL 2: SCAFFOLDING COM 2 LOOPS -->
                <div id="l2_view_lvl2" style="display:none;">
                    <div id="l2_objective_card" style="background:linear-gradient(135deg,#1E3A5F,#0F172A);border:2px solid #38BDF8;border-radius:16px;padding:14px 18px;margin-bottom:14px;display:flex;align-items:center;gap:12px;">
                        <span style="font-size:2rem;">🗺️</span>
                        <div>
                            <div style="color:#38BDF8;font-family:'Fredoka One',cursive;font-size:1.1rem;margin-bottom:2px;">Missão do Nível 2</div>
                            <div id="l2_obj_text" style="color:#CBD5E1;font-size:0.95rem;">🪙 Colete as 2 moedas no caminho e leve o robô até o 🏆 Tesouro com 2 laços FOR!</div>
                        </div>
                    </div>
                    <div class="loop-ide-layout">
                        <div class="loop-editor-card">
                            <div class="loop-editor-topbar">
                                <div class="loop-editor-title"><i class="fa-solid fa-laptop-code"></i> 2 Laços FOR em Sequência</div>
                                <span class="loop-lang-tag">Linguagem C / C++</span>
                            </div>
                            <div id="l2_inline_hint" style="background:#1E293B;border-left:3px solid #8B5CF6;padding:8px 14px;font-size:0.82rem;color:#A78BFA;font-family:'Fira Code',monospace;margin-bottom:10px;border-radius:0 8px 8px 0;min-height:24px;transition:0.3s;">
                                💡 Escolha a quantidade e a direção de cada laço FOR para guiar o robô!
                            </div>
                            <div class="scaffold-lines">
                                <div style="color:#64748B;font-size:0.8rem;margin-bottom:8px;">// Missão: Guie o robô com 2 laços FOR separados</div>
                                <div class="scaffold-line" id="sc_l1"><span style="color:#F472B6;font-weight:bold;">for</span> ( <span style="color:#38BDF8;">int</span> i = 0; i &lt; <input type="number" id="sc_num1" min="1" max="6" placeholder="?" class="p-input-num" oninput="l2_validateScaffold()">; i++ ) {</div>
                                <div class="scaffold-line" id="sc_l2" style="padding-left:24px;">
                                    <select id="sc_cmd1" class="p-select-cmd" onchange="l2_validateScaffold()">
                                        <option value="" selected disabled>— escolha —</option>
                                        <option value="RIGHT">direita();</option>
                                        <option value="DOWN">baixo();</option>
                                        <option value="LEFT">esquerda();</option>
                                        <option value="UP">cima();</option>
                                    </select>
                                </div>
                                <div class="scaffold-line" id="sc_l3">}</div>
                                
                                <div class="scaffold-line" id="sc_l4" style="margin-top:10px;"><span style="color:#F472B6;font-weight:bold;">for</span> ( <span style="color:#38BDF8;">int</span> i = 0; i &lt; <input type="number" id="sc_num2" min="1" max="6" placeholder="?" class="p-input-num" oninput="l2_validateScaffold()">; i++ ) {</div>
                                <div class="scaffold-line" id="sc_l5" style="padding-left:24px;">
                                    <select id="sc_cmd2" class="p-select-cmd" onchange="l2_validateScaffold()">
                                        <option value="" selected disabled>— escolha —</option>
                                        <option value="DOWN">baixo();</option>
                                        <option value="RIGHT">direita();</option>
                                        <option value="LEFT">esquerda();</option>
                                        <option value="UP">cima();</option>
                                    </select>
                                </div>
                                <div class="scaffold-line" id="sc_l6">}</div>
                            </div>
                            <div class="loop-actions">
                                <button class="loop-btn-run" id="l2_btn_run_scaffold" onclick="l2_runScaffold()"><i class="fa-solid fa-play"></i> EXECUTAR CÓDIGO C</button>
                                <button class="loop-btn-reset" onclick="l2_resetBoard()"><i class="fa-solid fa-rotate-left"></i></button>
                            </div>
                        </div>

                        <div class="loop-sim-card">
                            <div class="loop-sim-topbar">
                                <div class="loop-sim-title"><i class="fa-solid fa-robot"></i> Simulador do Robô</div>
                                <div class="loop-sim-hud" id="l2_hud_coins">🪙 0 / 2 Moedas</div>
                            </div>
                            <div class="loop-board" id="loop-board-lvl2" style="grid-template-columns:repeat(5, 1fr);"></div>
                        </div>
                    </div>
                </div>

                <!-- CONTEÚDO NÍVEL 3 [NOVO]: MÚLTIPLOS COMANDOS EM 1 ÚNICO FOR -->
                <div id="l2_view_lvl3" style="display:none;">
                    <div style="background:linear-gradient(135deg,#1E3A5F,#0F172A);border:2px solid #8B5CF6;border-radius:16px;padding:14px 18px;margin-bottom:14px;display:flex;align-items:center;gap:12px;">
                        <span style="font-size:2rem;">🪜</span>
                        <div>
                            <div style="color:#A78BFA;font-family:'Fredoka One',cursive;font-size:1.1rem;margin-bottom:2px;">Missão do Nível 3: Múltiplos Comandos em 1 FOR</div>
                            <div style="color:#CBD5E1;font-size:0.95rem;">💡 <b>Conceito Maker:</b> Um único laço FOR pode executar 2 ou mais comandos dentro das chaves <code style="background:#0F172A;color:#38BDF8;padding:1px 6px;border-radius:4px;">{ }</code> a cada repetição!</div>
                        </div>
                    </div>
                    <div class="loop-ide-layout">
                        <div class="loop-editor-card">
                            <div class="loop-editor-topbar">
                                <div class="loop-editor-title"><i class="fa-solid fa-layer-group"></i> 1 FOR com 2 Comandos Dentro</div>
                                <span class="loop-lang-tag">Linguagem C / C++</span>
                            </div>
                            <div id="l3_inline_hint" style="background:#1E293B;border-left:3px solid #8B5CF6;padding:8px 14px;font-size:0.82rem;color:#A78BFA;font-family:'Fira Code',monospace;margin-bottom:10px;border-radius:0 8px 8px 0;min-height:24px;transition:0.3s;">
                                💡 Escolha quantas vezes repetir e os 2 comandos internos para andar em escada!
                            </div>
                            <div class="scaffold-lines">
                                <div style="color:#64748B;font-size:0.8rem;margin-bottom:8px;">// Um único FOR repetindo 2 comandos juntos em cada iteração:</div>
                                <div class="scaffold-line"><span style="color:#F472B6;font-weight:bold;">for</span> ( <span style="color:#38BDF8;">int</span> i = 0; i &lt; <input type="number" id="sc3_num" min="1" max="6" placeholder="?" class="p-input-num" oninput="l2_validateMultiScaffold()">; i++ ) {</div>
                                <div class="scaffold-line" style="padding-left:24px;color:#64748B;">// 1º comando da iteração:</div>
                                <div class="scaffold-line" style="padding-left:24px;">
                                    <select id="sc3_cmd1" class="p-select-cmd" onchange="l2_validateMultiScaffold()">
                                        <option value="" selected disabled>— 1º comando —</option>
                                        <option value="RIGHT">direita();</option>
                                        <option value="DOWN">baixo();</option>
                                        <option value="LEFT">esquerda();</option>
                                        <option value="UP">cima();</option>
                                    </select>
                                </div>
                                <div class="scaffold-line" style="padding-left:24px;color:#64748B;">// 2º comando na MESMA iteração:</div>
                                <div class="scaffold-line" style="padding-left:24px;">
                                    <select id="sc3_cmd2" class="p-select-cmd" onchange="l2_validateMultiScaffold()">
                                        <option value="" selected disabled>— 2º comando —</option>
                                        <option value="DOWN">baixo();</option>
                                        <option value="RIGHT">direita();</option>
                                        <option value="LEFT">esquerda();</option>
                                        <option value="UP">cima();</option>
                                    </select>
                                </div>
                                <div class="scaffold-line">}</div>
                            </div>
                            <div class="loop-actions">
                                <button class="loop-btn-run" id="l3_btn_run_scaffold" onclick="l2_runMultiScaffold()"><i class="fa-solid fa-play"></i> EXECUTAR 1 FOR COMPOSIÇÃO</button>
                                <button class="loop-btn-reset" onclick="l2_resetBoard()"><i class="fa-solid fa-rotate-left"></i></button>
                            </div>
                        </div>

                        <div class="loop-sim-card">
                            <div class="loop-sim-topbar">
                                <div class="loop-sim-title"><i class="fa-solid fa-robot"></i> Robô no Zigue-Zague</div>
                                <div class="loop-sim-hud" id="l3_multi_hud_coins">🪙 0 / 3 Moedas</div>
                            </div>
                            <div class="loop-board" id="loop-board-lvl3" style="grid-template-columns:repeat(5, 1fr);"></div>
                        </div>
                    </div>
                </div>

                <!-- CONTEÚDO NÍVEL 4: MINI-IDE COMPLETA C/C++ -->
                <div id="l2_view_lvl4" style="display:none;">
                    <div style="background:linear-gradient(135deg,#1E3A5F,#0F172A);border:2px solid #38BDF8;border-radius:16px;padding:14px 18px;margin-bottom:14px;display:flex;align-items:center;gap:12px;">
                        <span style="font-size:2rem;">🗺️</span>
                        <div>
                            <div style="color:#38BDF8;font-family:'Fredoka One',cursive;font-size:1.1rem;margin-bottom:2px;">Missão do Nível 4: Mestre dos Loops</div>
                            <div style="color:#CBD5E1;font-size:0.95rem;">🪙 Colete as 3 moedas e leve o robô até o 🏆 Tesouro! Use laços <code style="background:#0F172A;color:#A78BFA;padding:1px 6px;border-radius:4px;">for</code> em C/C++ na Mini-IDE.</div>
                        </div>
                    </div>
                    <div class="loop-ide-layout">
                        <div class="loop-editor-card">
                            <div class="loop-editor-topbar">
                                <div class="loop-editor-title"><i class="fa-solid fa-terminal"></i> Mini-IDE C / C++</div>
                                <span class="loop-lang-tag">Linguagem C</span>
                            </div>

                            <div class="loop-shortcuts-bar">
                                <button class="loop-shortcut-btn" onclick="l2_insertCode('for (int i = 0; i < N; i++) {\n    \n}\n')"><i class="fa-solid fa-arrows-rotate" style="color:#A78BFA;"></i> + for()</button>
                                <button class="loop-shortcut-btn" onclick="l2_insertCode('direita();\n')">➡️ direita();</button>
                                <button class="loop-shortcut-btn" onclick="l2_insertCode('baixo();\n')">⬇️ baixo();</button>
                                <button class="loop-shortcut-btn" onclick="l2_insertCode('esquerda();\n')">⬅️ esquerda();</button>
                                <button class="loop-shortcut-btn" onclick="l2_insertCode('cima();\n')">⬆️ cima();</button>
                                <button class="loop-shortcut-btn clear" onclick="l2_clearEditor()"><i class="fa-solid fa-trash-can"></i> Limpar</button>
                            </div>

                            <div class="loop-code-wrapper" style="position:relative;">
                                <div class="loop-line-numbers" id="l2_line_numbers">1<br>2<br>3<br>4<br>5<br>6<br>7<br>8</div>
                                <textarea class="loop-code-input" id="l2_code_input" spellcheck="false" placeholder="// 🤖 Escreva seu código aqui!
// Comandos: direita(); baixo(); esquerda(); cima();
// Laço: for (int i = 0; i < N; i++) { ... }
" oninput="l2_updateLineNumbers(); l2_ideAutoComplete(this)"></textarea>
                                <div id="l2_autocomplete_list" style="display:none;position:absolute;left:56px;top:0;background:#1E293B;border:2px solid #8B5CF6;border-radius:10px;z-index:100;min-width:220px;box-shadow:0 8px 24px rgba(0,0,0,0.5);overflow:hidden;"></div>
                            </div>

                            <div id="l2_ide_hint" style="background:#1E293B;border-left:3px solid #8B5CF6;padding:8px 14px;font-size:0.82rem;color:#A78BFA;font-family:'Fira Code',monospace;margin-top:8px;border-radius:0 8px 8px 0;min-height:24px;transition:0.3s;">
                                ✏️ Comece a digitar <span style="color:#34D399;">for</span>, <span style="color:#34D399;">direita</span>, <span style="color:#34D399;">baixo</span>... ou clique nos botões acima!
                            </div>

                            <div class="loop-syntax-card">
                                <b>📖 Sintaxe do laço FOR em C / C++:</b><br>
                                <code>for (int i = 0; i &lt; 4; i++) { direita(); }</code>
                            </div>

                            <div class="loop-actions">
                                <button class="loop-btn-run" id="l2_btn_run_ide" onclick="l2_runIdeCode()"><i class="fa-solid fa-play"></i> EXECUTAR CÓDIGO C</button>
                                <button class="loop-btn-reset" onclick="l2_resetBoard()"><i class="fa-solid fa-rotate-left"></i></button>
                            </div>
                        </div>

                        <div class="loop-sim-card">
                            <div class="loop-sim-topbar">
                                <div class="loop-sim-title"><i class="fa-solid fa-robot"></i> Labirinto Maker 6x6</div>
                                <div class="loop-sim-hud" id="l4_hud_coins">🪙 0 / 3 Moedas</div>
                            </div>
                            <div class="loop-board" id="loop-board-lvl4" style="grid-template-columns:repeat(6, 1fr);"></div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- MODAL DE SUCESSO -->
            <div class="loop-modal" id="l_modal_win">
                <div class="loop-modal-box">
                    <div class="loop-modal-icon" id="l_win_icon">🏆</div>
                    <h2 class="loop-modal-title" id="l_win_title">Parabéns!</h2>
                    <p class="loop-modal-text" id="l_win_text">Você completou o desafio dos laços FOR em C/C++ com maestria!</p>
                    <button class="loop-btn-modal" onclick="l2_nextStep()">Próximo Desafio ➔</button>
                </div>
            </div>
        `;

        l2_init();
        document.getElementById('loopmaker-loaded')?.remove();
        const flag = document.createElement('div'); flag.id = 'loopmaker-loaded'; flag.style.display='none'; container.appendChild(flag);
    }

    // SVG do Robô
    const L2_ROBOT_SVG = `<svg class="robot-svg" width="34" height="34" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="20" cy="5" r="3" fill="#F59E0B"/><line x1="20" y1="8" x2="20" y2="12" stroke="#F59E0B" stroke-width="2"/><rect x="8" y="12" width="24" height="18" rx="5" fill="#3B82F6" stroke="#1D4ED8" stroke-width="2"/><circle cx="15" cy="18" r="3" fill="#38BDF8"/><circle cx="25" cy="18" r="3" fill="#38BDF8"/><circle cx="15" cy="18" r="1.2" fill="#0F172A"/><circle cx="25" cy="18" r="1.2" fill="#0F172A"/><path d="M14 24 Q20 28 26 24" stroke="#F59E0B" stroke-width="2" stroke-linecap="round"/><rect x="3" y="16" width="5" height="10" rx="2" fill="#60A5FA"/><rect x="32" y="16" width="5" height="10" rx="2" fill="#60A5FA"/><rect x="12" y="30" width="6" height="7" rx="2" fill="#1D4ED8"/><rect x="22" y="30" width="6" height="7" rx="2" fill="#1D4ED8"/></svg>`;

    const l2_sleep = ms => new Promise(r => setTimeout(r, ms));
    let l2_currentLevel = 1;
    let l2_isExecuting = false;
    let l2_robotState = { r:0, c:0 };
    let l2_collectedCoins = 0;

    // Configuração dos Grids dos Níveis 2, 3 e 4 (em C / C++)
    const L2_MAPS = {
        2: {
            size: 5,
            start: { r:0, c:0 },
            chest: { r:4, c:4 },
            walls: [ {r:1,c:1}, {r:1,c:2}, {r:2,c:1}, {r:2,c:2}, {r:3,c:2} ],
            coins: [ {r:0,c:4}, {r:2,c:4} ],
            objective: "🪙 Coletar as 2 moedas no caminho e chegar ao 🏆 Tesouro!",
            initialCode: ""
        },
        3: {
            size: 5,
            start: { r:0, c:0 },
            chest: { r:4, c:4 },
            walls: [ {r:0,c:2}, {r:0,c:3}, {r:0,c:4}, {r:1,c:0}, {r:2,c:0}, {r:3,c:0}, {r:4,c:0}, {r:2,c:1}, {r:3,c:2}, {r:4,c:3} ],
            coins: [ {r:1,c:1}, {r:2,c:2}, {r:3,c:3} ],
            objective: "🪙 Colete as 3 moedas no caminho em escada usando 1 laço FOR (direita + baixo)!",
            initialCode: ""
        },
        4: {
            size: 6,
            start: { r:0, c:0 },
            chest: { r:5, c:5 },
            walls: [ {r:0,c:2}, {r:1,c:2}, {r:2,c:2}, {r:3,c:4}, {r:4,c:4}, {r:2,c:4} ],
            coins: [ {r:4,c:0}, {r:4,c:3}, {r:1,c:5} ],
            objective: "🪙 Colete as 3 moedas e leve o robô até o 🏆 Tesouro!",
            initialCode: "// 🤖 Missão: Colete as moedas e chegue ao tesouro!\n// Comandos: direita(); baixo(); esquerda(); cima();\n// Laço: for (int i = 0; i < N; i++) { ... }\n\n"
        }
    };

    function l2_init() {
        l2_switchLevel(1);
    }

    function l2_switchLevel(lvl) {
        if(l2_isExecuting) return;
        l2_currentLevel = lvl;

        document.querySelectorAll('.loop-level-btn').forEach(btn => {
            btn.classList.remove('active');
            if(parseInt(btn.dataset.level) === lvl) btn.classList.add('active');
        });

        document.getElementById('l2_view_lvl1').style.display = (lvl === 1) ? 'block' : 'none';
        document.getElementById('l2_view_lvl2').style.display = (lvl === 2) ? 'block' : 'none';
        document.getElementById('l2_view_lvl3').style.display = (lvl === 3) ? 'block' : 'none';
        document.getElementById('l2_view_lvl4').style.display = (lvl === 4) ? 'block' : 'none';

        const descEl = document.getElementById('loop-header-desc');
        if(lvl === 1) {
            descEl.innerHTML = '<b>Nível 1:</b> Entenda o laço FOR em C/C++! Veja como <code>for (int i=1; i<=5; i++)</code> carimba 5 caixas na esteira sem repetir código.';
            l2_resetFactory();
        } else if(lvl === 2) {
            descEl.innerHTML = '<b>Nível 2:</b> Complete os laços <code>for</code> em C/C++ para o robô andar em reta no labirinto e pegar o tesouro!';
            l2_buildBoard(2);
        } else if(lvl === 3) {
            descEl.innerHTML = '<b>Nível 3 [NOVO]:</b> Aprenda que um único laço <code>for</code> pode executar 2 ou mais comandos dentro das chaves <code>{ }</code> a cada repetição!';
            l2_buildBoard(3);
        } else if(lvl === 4) {
            descEl.innerHTML = '<b>Nível 4:</b> Desafio do Mestre! Digite laços <code>for</code> em C/C++ na Mini-IDE, use os atalhos e chegue ao tesouro!';
            const input = document.getElementById('l2_code_input');
            if(input && !input.value.trim()) {
                input.value = L2_MAPS[4].initialCode;
            }
            l2_updateLineNumbers();
            l2_buildBoard(4);
        }
    }

    // ================= FUNÇÕES NÍVEL 1 (FÁBRICA) =================
    function l2_resetFactory() {
        const track = document.getElementById('l_boxes-track');
        if(!track) return;
        track.innerHTML = '';
        track.style.transform = 'translateX(0)';
        document.getElementById('l_hud-count').innerText = '0';
        document.getElementById('l_stamper-arm')?.classList.remove('hitting');
        document.getElementById('l_belt-stripes')?.classList.remove('running');
        document.getElementById('l_code_line_carimbar')?.classList.remove('active');

        for(let i=1; i<=5; i++) {
            const box = document.createElement('div');
            box.className = 'loop-box';
            box.id = 'lbox-'+i;
            box.innerHTML = `<span style="font-size:1.6rem;opacity:0.85;">📦</span><span style="position:absolute;top:-8px;right:-8px;background:#38BDF8;color:#0F172A;border-radius:50%;width:20px;height:20px;font-size:0.75rem;font-weight:900;display:flex;align-items:center;justify-content:center;">${i}</span>`;
            track.appendChild(box);
        }
    }

    async function l_startFactory() {
        if(l2_isExecuting) return;
        l2_isExecuting = true;
        const btn = document.getElementById('l_btn_run1');
        btn.disabled = true;
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> EXECUTANDO...';

        l2_resetFactory();
        await l2_sleep(300);

        const count = parseInt(document.getElementById('l_sel-loop').value) || 5;
        const track = document.getElementById('l_boxes-track');
        const boxWidth = 90;
        let currentPos = 0;

        for(let i=1; i<=count; i++) {
            document.getElementById('l_hud-count').innerText = i;
            const codeLine = document.getElementById('l_code_line_carimbar');
            if(codeLine) codeLine.classList.add('active');

            const arm = document.getElementById('l_stamper-arm');
            arm.classList.add('hitting');
            playSound('step');
            await l2_sleep(200);

            const targetBox = document.getElementById('lbox-'+i);
            if(targetBox && !targetBox.querySelector('.loop-stamp')) {
                const stamp = document.createElement('div');
                stamp.className = 'loop-stamp';
                stamp.innerHTML = '✔';
                targetBox.appendChild(stamp);
                playSound('click');
            }

            await l2_sleep(180);
            arm.classList.remove('hitting');
            if(codeLine) codeLine.classList.remove('active');

            if(i < count) {
                document.getElementById('l_belt-stripes').classList.add('running');
                currentPos -= boxWidth;
                track.style.transform = `translateX(${currentPos}px)`;
                await l2_sleep(450);
                document.getElementById('l_belt-stripes').classList.remove('running');
                await l2_sleep(150);
            }
        }

        l2_isExecuting = false;
        btn.disabled = false;
        btn.innerHTML = '<i class="fa-solid fa-play"></i> EXECUTAR LAÇO FOR';

        const solFactory = `// Solução para carimbar 5 caixas na esteira:\nfor (int i = 1; i <= 5; i++) {\n    carimbarCaixa();\n}`;
        if(count === 5) {
            playSound('success');
            triggerConfetti(3000);
            l2_saveProgress(1);
            l2_showWinModal('🏭','Fábrica Automatizada!','Você carimbou todas as 5 caixas com apenas 1 laço FOR! Agora vamos para o Nível 2!');
        } else if(count < 5) {
            triggerErrorSplash('Faltaram caixas!', `O laço for rodou apenas ${count} vezes, mas a esteira tinha 5 caixas.`, 'Aumente o limite no for (int i=1; i<=5; i++) para carimbar todas as caixas!', '📦', solFactory, 'loop_lvl_1', 3);
        } else {
            triggerErrorSplash('Passou do limite!', `O laço for rodou ${count} vezes, mas só tínhamos 5 caixas.`, 'Ajuste o limite do for exatamente para 5.', '⚠️', solFactory, 'loop_lvl_1', 3);
        }
    }

    // ================= FUNÇÕES NÍVEIS 2, 3 E 4 (ROBÔ NO GRID) =================
    function l2_buildBoard(lvl) {
        const map = L2_MAPS[lvl];
        let boardId = 'loop-board-lvl2';
        if(lvl === 3) boardId = 'loop-board-lvl3';
        if(lvl === 4) boardId = 'loop-board-lvl4';

        const boardEl = document.getElementById(boardId);
        if(!boardEl) return;
        boardEl.style.gridTemplateColumns = `repeat(${map.size}, 1fr)`;
        boardEl.innerHTML = '';

        l2_robotState = { ...map.start };
        l2_collectedCoins = 0;
        l2_updateCoinsHud(lvl);

        for(let r=0; r<map.size; r++) {
            for(let c=0; c<map.size; c++) {
                const cell = document.createElement('div');
                cell.className = 'loop-cell';
                cell.id = `l${lvl}_cell_${r}_${c}`;

                const isWall = map.walls.some(w => w.r === r && w.c === c);
                const isCoin = map.coins.some(co => co.r === r && co.c === c);
                const isChest = map.chest.r === r && map.chest.c === c;

                if(isWall) cell.classList.add('wall');
                if(isCoin) cell.classList.add('coin');
                if(isChest) cell.classList.add('chest');

                boardEl.appendChild(cell);
            }
        }
        l2_renderRobot(lvl);
    }

    function l2_renderRobot(lvl) {
        document.querySelectorAll(`[id^="l${lvl}_cell_"]`).forEach(el => {
            el.classList.remove('robot');
            const svg = el.querySelector('.robot-svg');
            if(svg) svg.remove();
        });

        const curCell = document.getElementById(`l${lvl}_cell_${l2_robotState.r}_${l2_robotState.c}`);
        if(curCell) {
            curCell.classList.add('robot');
            curCell.innerHTML += L2_ROBOT_SVG;
        }
    }

    function l2_updateCoinsHud(lvl) {
        const map = L2_MAPS[lvl];
        let hudId = 'l2_hud_coins';
        if(lvl === 3) hudId = 'l3_multi_hud_coins';
        if(lvl === 4) hudId = 'l4_hud_coins';

        const hud = document.getElementById(hudId);
        if(hud) hud.innerHTML = `🪙 ${l2_collectedCoins} / ${map.coins.length} Moedas`;
    }

    // Validação inline do Scaffolding (Nível 2)
    function l2_validateScaffold() {
        const hint = document.getElementById('l2_inline_hint');
        if (!hint) return;
        const num1 = document.getElementById('sc_num1').value;
        const cmd1 = document.getElementById('sc_cmd1').value;
        const num2 = document.getElementById('sc_num2').value;
        const cmd2 = document.getElementById('sc_cmd2').value;

        if (!num1 && !cmd1) {
            hint.style.borderLeftColor = '#8B5CF6'; hint.style.color = '#A78BFA';
            hint.innerHTML = '💡 Preencha a quantidade e a direção do 1º laço FOR!';
        } else if (num1 && !cmd1) {
            hint.style.borderLeftColor = '#F59E0B'; hint.style.color = '#FBBF24';
            hint.innerHTML = `⚡ Quantos? <b>${num1}</b> — Agora escolha a <b>direção</b> do 1º laço!`;
        } else if (!num1 && cmd1) {
            hint.style.borderLeftColor = '#F59E0B'; hint.style.color = '#FBBF24';
            hint.innerHTML = '⚡ Direção escolhida! Agora defina a <b>quantidade</b> do 1º laço!';
        } else if (num1 && cmd1 && !num2 && !cmd2) {
            hint.style.borderLeftColor = '#10B981'; hint.style.color = '#34D399';
            hint.innerHTML = `✅ 1º laço OK: <code style="background:#0F172A;padding:2px 6px;border-radius:4px;">for(i=0; i&lt;${num1}; i++) { ${cmd1 === 'RIGHT' ? 'direita' : cmd1 === 'DOWN' ? 'baixo' : cmd1 === 'LEFT' ? 'esquerda' : 'cima'}(); }</code> — Agora complete o 2º laço!`;
        } else if (num1 && cmd1 && num2 && cmd2) {
            hint.style.borderLeftColor = '#10B981'; hint.style.color = '#34D399';
            hint.innerHTML = '🚀 Código completo! Clique em <b>EXECUTAR</b> para ver o robô se mover!';
        }
    }

    // Validação inline do Scaffolding de Múltiplos Comandos (Nível 3)
    function l2_validateMultiScaffold() {
        const hint = document.getElementById('l3_inline_hint');
        if (!hint) return;
        const num = document.getElementById('sc3_num').value;
        const cmd1 = document.getElementById('sc3_cmd1').value;
        const cmd2 = document.getElementById('sc3_cmd2').value;

        const cmdName = c => c === 'RIGHT' ? 'direita' : c === 'DOWN' ? 'baixo' : c === 'LEFT' ? 'esquerda' : 'cima';

        if (!num && !cmd1 && !cmd2) {
            hint.style.borderLeftColor = '#8B5CF6'; hint.style.color = '#A78BFA';
            hint.innerHTML = '💡 Escolha quantas vezes repetir e os 2 comandos internos para o mesmo laço FOR!';
        } else if (num && cmd1 && cmd2) {
            hint.style.borderLeftColor = '#10B981'; hint.style.color = '#34D399';
            hint.innerHTML = `🚀 1 FOR Perfeito: <code style="background:#0F172A;padding:2px 6px;border-radius:4px;">for(i=0; i&lt;${num}; i++) { ${cmdName(cmd1)}(); ${cmdName(cmd2)}(); }</code> — Clique em EXECUTAR!`;
        } else {
            hint.style.borderLeftColor = '#F59E0B'; hint.style.color = '#FBBF24';
            hint.innerHTML = '⚡ Preencha o limite do FOR e os dois comandos que rodam dentro das chaves { }!';
        }
    }

    // Autocomplete da Mini-IDE (Nível 4)
    const L2_AUTOCOMPLETE_OPTIONS = [
        { trigger: 'for',     label: 'for (int i = 0; i < N; i++) { ... }', insert: 'for (int i = 0; i < N; i++) {\n    \n}\n' },
        { trigger: 'dir',     label: 'direita();',  insert: 'direita();\n' },
        { trigger: 'bai',     label: 'baixo();',    insert: 'baixo();\n' },
        { trigger: 'esq',     label: 'esquerda();', insert: 'esquerda();\n' },
        { trigger: 'cim',     label: 'cima();',     insert: 'cima();\n' },
        { trigger: 'int',     label: 'int i = 0;',  insert: 'int i = 0;\n' },
    ];

    function l2_ideAutoComplete(textarea) {
        const hint = document.getElementById('l2_ide_hint');
        const list = document.getElementById('l2_autocomplete_list');
        const code = textarea.value;
        const lines = code.split('\n');
        const cursorPos = textarea.selectionStart;

        const beforeCursor = code.substring(0, cursorPos);
        const lastWord = beforeCursor.split(/[\s\n{};()]+/).pop().toLowerCase();

        if (hint) {
            const hasFor = /for\s*\(/.test(code);
            const hasBrace = code.includes('{') && code.includes('}');
            const hasCmd = /direita|baixo|esquerda|cima/.test(code);

            if (!code.trim() || code.trim().startsWith('//')) {
                hint.style.color = '#A78BFA';
                hint.innerHTML = '✏️ Comece a digitar <span style="color:#34D399;">for</span>, <span style="color:#34D399;">direita</span>, <span style="color:#34D399;">baixo</span>... ou clique nos botões!';
            } else if (hasFor && !hasBrace) {
                hint.style.color = '#F59E0B';
                hint.innerHTML = '⚡ Lembrou das chaves <code style="background:#0F172A;padding:2px 5px;border-radius:4px;">{ }</code> do laço FOR?';
            } else if (hasFor && hasBrace && hasCmd) {
                hint.style.color = '#10B981';
                hint.innerHTML = '✅ Ótimo! Código parece correto — clique em <b>EXECUTAR</b> para testar!';
            }
        }

        if (!list) return;
        if (!lastWord || lastWord.length < 2) {
            list.style.display = 'none';
            return;
        }

        const matches = L2_AUTOCOMPLETE_OPTIONS.filter(o => o.trigger.startsWith(lastWord) && lastWord !== o.trigger);
        if (matches.length === 0) {
            list.style.display = 'none';
            return;
        }

        const lineIndex = lines.length - 1;
        list.style.top = `${(lineIndex * 22) + 4}px`;
        list.style.display = 'block';
        list.innerHTML = matches.map((m) =>
            `<div onclick="l2_applyAutoComplete('${m.insert.replace(/'/g, "\\'").replace(/\n/g, '\\n')}')" 
                  style="padding:9px 16px;color:#CBD5E1;font-family:'Fira Code',monospace;font-size:0.82rem;cursor:pointer;transition:0.15s;border-bottom:1px solid #334155;"
                  onmouseenter="this.style.background='#334155'" 
                  onmouseleave="this.style.background='transparent'">${m.label}</div>`
        ).join('');
    }

    function l2_applyAutoComplete(insertText) {
        const textarea = document.getElementById('l2_code_input');
        const list = document.getElementById('l2_autocomplete_list');
        if (!textarea) return;
        const pos = textarea.selectionStart;
        const before = textarea.value.substring(0, pos);
        const after = textarea.value.substring(pos);
        const cleanBefore = before.replace(/[\w]+$/, '');
        textarea.value = cleanBefore + insertText + after;
        const newPos = cleanBefore.length + insertText.length;
        textarea.setSelectionRange(newPos, newPos);
        textarea.focus();
        if (list) list.style.display = 'none';
        l2_updateLineNumbers();
        l2_ideAutoComplete(textarea);
    }

    // Execução do Nível 2 (Scaffolding C/C++)
    async function l2_runScaffold() {
        if(l2_isExecuting) return;
        const valNum1 = document.getElementById('sc_num1').value;
        const valCmd1 = document.getElementById('sc_cmd1').value;
        const valNum2 = document.getElementById('sc_num2').value;
        const valCmd2 = document.getElementById('sc_cmd2').value;
        if (!valNum1 || !valCmd1 || !valNum2 || !valCmd2) {
            const hint = document.getElementById('l2_inline_hint');
            if (hint) {
                hint.style.borderLeftColor = '#EF4444'; hint.style.color = '#FCA5A5';
                hint.innerHTML = '❌ Preencha <b>todos os campos</b> antes de executar!';
            }
            return;
        }
        l2_isExecuting = true;
        const btn = document.getElementById('l2_btn_run_scaffold');
        btn.disabled = true;
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> RODANDO...';
        l2_buildBoard(2);

        const num1 = parseInt(valNum1) || 0;
        const cmd1 = valCmd1;
        const num2 = parseInt(valNum2) || 0;
        const cmd2 = valCmd2;

        const commands = [];
        for(let i=0; i<num1; i++) commands.push({ cmd: cmd1, lineId: 'sc_l2' });
        for(let i=0; i<num2; i++) commands.push({ cmd: cmd2, lineId: 'sc_l5' });

        await l2_executeCommandList(commands, 2);

        l2_isExecuting = false;
        btn.disabled = false;
        btn.innerHTML = '<i class="fa-solid fa-play"></i> EXECUTAR CÓDIGO C';
    }

    // Execução do Nível 3 [NOVO]: Múltiplos Comandos em 1 FOR
    async function l2_runMultiScaffold() {
        if(l2_isExecuting) return;
        const valNum = document.getElementById('sc3_num').value;
        const valCmd1 = document.getElementById('sc3_cmd1').value;
        const valCmd2 = document.getElementById('sc3_cmd2').value;

        if (!valNum || !valCmd1 || !valCmd2) {
            const hint = document.getElementById('l3_inline_hint');
            if (hint) {
                hint.style.borderLeftColor = '#EF4444'; hint.style.color = '#FCA5A5';
                hint.innerHTML = '❌ Preencha o limite do FOR e os dois comandos internos antes de executar!';
            }
            return;
        }

        l2_isExecuting = true;
        const btn = document.getElementById('l3_btn_run_scaffold');
        btn.disabled = true;
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> RODANDO...';
        l2_buildBoard(3);

        const num = parseInt(valNum) || 0;
        const commands = [];
        for (let i = 0; i < num; i++) {
            commands.push({ cmd: valCmd1 });
            commands.push({ cmd: valCmd2 });
        }

        await l2_executeCommandList(commands, 3);

        l2_isExecuting = false;
        btn.disabled = false;
        btn.innerHTML = '<i class="fa-solid fa-play"></i> EXECUTAR 1 FOR COMPOSIÇÃO';
    }

    // Execução do Nível 4 (Parser C/C++ na Mini-IDE)
    async function l2_runIdeCode() {
        if(l2_isExecuting) return;
        l2_isExecuting = true;
        const btn = document.getElementById('l2_btn_run_ide');
        btn.disabled = true;
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> RODANDO...';
        l2_buildBoard(4);

        const code = document.getElementById('l2_code_input').value;
        const parseResult = l2_parseC(code);

        if(!parseResult.success) {
            const sol4 = `// Solução em C/C++ para o Nível 4:\nfor (int i = 0; i < 4; i++) {\n    baixo();\n}\nfor (int i = 0; i < 3; i++) {\n    direita();\n}\nfor (int i = 0; i < 3; i++) {\n    cima();\n}\nfor (int i = 0; i < 2; i++) {\n    direita();\n}\nfor (int i = 0; i < 4; i++) {\n    baixo();\n}`;
            triggerErrorSplash(parseResult.title, parseResult.msg, parseResult.hint, '⚠️', sol4, 'loop_lvl_4', 3);
            l2_isExecuting = false;
            btn.disabled = false;
            btn.innerHTML = '<i class="fa-solid fa-play"></i> EXECUTAR CÓDIGO C';
            return;
        }

        await l2_executeCommandList(parseResult.commands, 4);

        l2_isExecuting = false;
        btn.disabled = false;
        btn.innerHTML = '<i class="fa-solid fa-play"></i> EXECUTAR CÓDIGO C';
    }

    // Executa a lista de passos com animação e verificação de colisões
    async function l2_executeCommandList(commands, lvl) {
        const map = L2_MAPS[lvl];
        let crashed = false;

        const solution2 = `// Solução C/C++ (Nível 2):\nfor (int i = 0; i < 4; i++) {\n    direita();\n}\nfor (int i = 0; i < 4; i++) {\n    baixo();\n}`;
        const solution3 = `// Solução C/C++ (Nível 3 — Múltiplos Comandos em 1 FOR):\nfor (int i = 0; i < 4; i++) {\n    direita();\n    baixo();\n}`;
        const solution4 = `// Solução C/C++ (Nível 4):\nfor (int i = 0; i < 4; i++) {\n    baixo();\n}\nfor (int i = 0; i < 3; i++) {\n    direita();\n}\nfor (int i = 0; i < 3; i++) {\n    cima();\n}\nfor (int i = 0; i < 2; i++) {\n    direita();\n}\nfor (int i = 0; i < 4; i++) {\n    baixo();\n}`;

        let solCode = solution2;
        if (lvl === 3) solCode = solution3;
        if (lvl === 4) solCode = solution4;

        const attemptKey = 'loop_lvl_' + lvl;

        for(let i=0; i<commands.length; i++) {
            const item = commands[i];
            const dir = item.cmd;

            if(item.lineId) {
                document.querySelectorAll('.scaffold-line').forEach(el => el.classList.remove('active'));
                document.getElementById(item.lineId)?.classList.add('active');
            }

            let nextR = l2_robotState.r;
            let nextC = l2_robotState.c;
            if(dir === 'RIGHT') nextC++;
            else if(dir === 'DOWN') nextR++;
            else if(dir === 'LEFT') nextC--;
            else if(dir === 'UP') nextR--;

            if(nextR < 0 || nextR >= map.size || nextC < 0 || nextC >= map.size) {
                crashed = true;
                playSound('error');
                const cell = document.getElementById(`l${lvl}_cell_${l2_robotState.r}_${l2_robotState.c}`);
                if(cell) cell.classList.add('crash');
                triggerErrorSplash('Robô Saiu da Pista!', 'O robô tentou andar para fora do mapa.', 'Diminua o número de repetições no loop para não passar da borda!', '🤖💥', solCode, attemptKey, 3);
                break;
            }

            const isWall = map.walls.some(w => w.r === nextR && w.c === nextC);
            if(isWall) {
                crashed = true;
                playSound('error');
                const cell = document.getElementById(`l${lvl}_cell_${l2_robotState.r}_${l2_robotState.c}`);
                if(cell) cell.classList.add('crash');
                triggerErrorSplash('Ops! Bateu no Muro!', 'O robô colidiu com uma parede de tijolos 🧱.', 'Planeje a rota em escada para desviar das paredes!', '💥', solCode, attemptKey, 3);
                break;
            }

            l2_robotState.r = nextR;
            l2_robotState.c = nextC;
            playSound('step');
            l2_renderRobot(lvl);

            const curCell = document.getElementById(`l${lvl}_cell_${nextR}_${nextC}`);
            if(curCell && curCell.classList.contains('coin')) {
                curCell.classList.remove('coin');
                l2_collectedCoins++;
                playSound('click');
                l2_updateCoinsHud(lvl);
            }

            await l2_sleep(320);
        }

        document.querySelectorAll('.scaffold-line').forEach(el => el.classList.remove('active'));

        if(!crashed) {
            if(l2_robotState.r === map.chest.r && l2_robotState.c === map.chest.c) {
                const cell = document.getElementById(`l${lvl}_cell_${l2_robotState.r}_${l2_robotState.c}`);
                if(cell) cell.classList.add('win');
                playSound('success');
                triggerConfetti(3500);
                l2_saveProgress(lvl);

                if(lvl === 2) {
                    l2_showWinModal('🏆','Nível 2 Concluído!','Você completou as lacunas e levou o robô até o tesouro com 2 laços FOR! Vamos para o Nível 3 testar múltiplos comandos em 1 único FOR?');
                } else if(lvl === 3) {
                    l2_showWinModal('🪜','Nível 3 Concluído!','Incrível! Você provou que 1 único laço FOR pode rodar múltiplos comandos a cada passo! Vamos para a Mini-IDE no Nível 4?');
                } else if(lvl === 4) {
                    l2_showWinModal('👑','Mestre Supremo dos Loops!','Incrível! Você programou o robô em C/C++ na Mini-IDE e conquistou todas as estrelas!');
                }
            } else {
                triggerErrorSplash('Não Chegou ao Tesouro!', 'O código terminou, mas o robô não alcançou o baú dourado 🏆.', 'Adicione mais passos ou loops para alcançar o objetivo!', '🗺️', solCode, attemptKey, 3);
            }
        }
    }

    function l2_saveProgress(lvl) {
        let saved = JSON.parse(localStorage.getItem('loopmaker_levels') || '[]');
        if(!saved.includes(lvl)) {
            saved.push(lvl);
            localStorage.setItem('loopmaker_levels', JSON.stringify(saved));
        }
        if(typeof updateHubProgress === 'function') updateHubProgress();
        if(typeof updateTrail === 'function') updateTrail();
    }

    function l2_showWinModal(icon, title, text) {
        document.getElementById('l_win_icon').innerText = icon;
        document.getElementById('l_win_title').innerText = title;
        document.getElementById('l_win_text').innerText = text;
        document.getElementById('l_modal_win').classList.add('active');
    }

    function l2_nextStep() {
        document.getElementById('l_modal_win').classList.remove('active');
        if(l2_currentLevel < 4) {
            l2_switchLevel(l2_currentLevel + 1);
        } else {
            if(typeof openTrail === 'function') openTrail();
        }
    }

    function l2_resetBoard() {
        l2_buildBoard(l2_currentLevel);
    }

    // Parser simples de Portugol/C++ para o Nível 4
        // Parser robusto e flexível de C/C++ para a Mini-IDE (Nível 4)
    function l2_parseC(code) {
        if (!code || !code.trim()) {
            return {
                success: false,
                title: 'Código Vazio!',
                msg: 'Escreva seu código em C/C++ na Mini-IDE.',
                hint: 'Use os atalhos acima ou digite laços FOR e comandos para guiar o robô!'
            };
        }

        // 1. Limpar comentários (// ... e /* ... */)
        let cleanCode = code
            .replace(/\/\*[\s\S]*?\*\//g, '')
            .replace(/\/\/.*/g, '');

        const commands = [];

        // Extrai todos os comandos simples (direita, baixo, esquerda, cima) de um trecho de texto
        function extractCmdsFromText(text) {
            const result = [];
            const regex = /(direita|baixo|esquerda|cima)\s*\(\s*\)/gi;
            let match;
            while ((match = regex.exec(text)) !== null) {
                const fn = match[1].toLowerCase();
                if (fn === 'direita') result.push('RIGHT');
                else if (fn === 'baixo') result.push('DOWN');
                else if (fn === 'esquerda') result.push('LEFT');
                else if (fn === 'cima') result.push('UP');
            }
            return result;
        }

        let pos = 0;
        const len = cleanCode.length;

        while (pos < len) {
            const forIdx = cleanCode.substring(pos).search(/\bfor\s*\(/i);

            if (forIdx === -1) {
                const remainingText = cleanCode.substring(pos);
                const standaloneCmds = extractCmdsFromText(remainingText);
                standaloneCmds.forEach(c => commands.push({ cmd: c }));
                break;
            }

            const absoluteForIdx = pos + forIdx;
            const textBeforeFor = cleanCode.substring(pos, absoluteForIdx);
            const cmdsBefore = extractCmdsFromText(textBeforeFor);
            cmdsBefore.forEach(c => commands.push({ cmd: c }));

            pos = absoluteForIdx;

            const openParenIdx = cleanCode.indexOf('(', pos);
            if (openParenIdx === -1) { pos++; continue; }

            let closeParenIdx = -1;
            let parenDepth = 0;
            for (let k = openParenIdx; k < len; k++) {
                if (cleanCode[k] === '(') parenDepth++;
                else if (cleanCode[k] === ')') {
                    parenDepth--;
                    if (parenDepth === 0) {
                        closeParenIdx = k;
                        break;
                    }
                }
            }

            if (closeParenIdx === -1) { pos++; continue; }

            const forHeader = cleanCode.substring(openParenIdx + 1, closeParenIdx);

            let iterations = 1;
            const condMatch = forHeader.match(/;\s*\w+\s*(<|<=|>|>=|!=)\s*(\d+)/);
            const initMatch = forHeader.match(/=\s*(\d+)/);

            if (condMatch) {
                const op = condMatch[1];
                const targetVal = parseInt(condMatch[2]);
                const startVal = initMatch ? parseInt(initMatch[1]) : 0;

                if (op === '<') iterations = Math.max(0, targetVal - startVal);
                else if (op === '<=') iterations = Math.max(0, targetVal - startVal + 1);
                else iterations = targetVal;
            } else {
                const numMatch = forHeader.match(/(\d+)/);
                if (numMatch) iterations = parseInt(numMatch[1]);
            }

            pos = closeParenIdx + 1;
            while (pos < len && /\s/.test(cleanCode[pos])) pos++;

            let bodyText = '';
            if (pos < len && cleanCode[pos] === '{') {
                const openBraceIdx = pos;
                let closeBraceIdx = -1;
                let braceDepth = 0;

                for (let k = openBraceIdx; k < len; k++) {
                    if (cleanCode[k] === '{') braceDepth++;
                    else if (cleanCode[k] === '}') {
                        braceDepth--;
                        if (braceDepth === 0) {
                            closeBraceIdx = k;
                            break;
                        }
                    }
                }

                if (closeBraceIdx !== -1) {
                    bodyText = cleanCode.substring(openBraceIdx + 1, closeBraceIdx);
                    pos = closeBraceIdx + 1;
                } else {
                    bodyText = cleanCode.substring(openBraceIdx + 1);
                    pos = len;
                }
            } else {
                const semicolonIdx = cleanCode.indexOf(';', pos);
                if (semicolonIdx !== -1) {
                    bodyText = cleanCode.substring(pos, semicolonIdx + 1);
                    pos = semicolonIdx + 1;
                } else {
                    bodyText = cleanCode.substring(pos);
                    pos = len;
                }
            }

            const loopBodyCmds = extractCmdsFromText(bodyText);

            if (loopBodyCmds.length === 0) {
                return {
                    success: false,
                    title: 'Laço FOR Vazio!',
                    msg: 'Um dos laços FOR não contém nenhum comando dentro.',
                    hint: 'Coloque comandos como direita(); ou baixo(); dentro do bloco { } do laço FOR!'
                };
            }

            for (let it = 0; it < iterations; it++) {
                loopBodyCmds.forEach(c => commands.push({ cmd: c }));
            }
        }

        if (commands.length === 0) {
            return {
                success: false,
                title: 'Nenhum Comando Válido!',
                msg: 'Não encontramos nenhuma instrução reconhecida no seu código.',
                hint: 'Escreva comandos como direita();, baixo();, esquerda();, cima(); ou laços for (...)'
            };
        }

        return { success: true, commands };
    }

    function l2_updateLineNumbers() {
        const input = document.getElementById('l2_code_input');
        const numEl = document.getElementById('l2_line_numbers');
        if(!input || !numEl) return;
        const lineCount = input.value.split('\n').length;
        numEl.innerHTML = Array.from({length: Math.max(8, lineCount)}, (_, i) => i + 1).join('<br>');
    }

    function l2_insertCode(snippet) {
        const input = document.getElementById('l2_code_input');
        if(!input) return;
        const start = input.selectionStart;
        const end = input.selectionEnd;
        const val = input.value;
        input.value = val.substring(0, start) + snippet + val.substring(end);
        input.selectionStart = input.selectionEnd = start + snippet.length;
        input.focus();
        l2_updateLineNumbers();
    }

    function l2_clearEditor() {
        const input = document.getElementById('l2_code_input');
        if(input) input.value = '';
        l2_updateLineNumbers();
    }

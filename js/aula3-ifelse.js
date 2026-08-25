/* ==========================================================================
   AULA 3 — CONDICIONAIS & ROBÔ INTELIGENTE (IF / ELSE EM C/C++)
   ========================================================================== */

function loadJardim() {
    const container = document.getElementById('jardim-container');
    if (!container) return;

    container.innerHTML = `
        <style>
            .if-wrapper { color:#E2E8F0; }
            .if-header-card { background:linear-gradient(135deg, rgba(16,185,129,0.18), rgba(30,41,59,0.92)); border:2px solid #10B981; border-radius:24px; padding:18px 22px; margin-bottom:16px; box-shadow:0 10px 30px rgba(0,0,0,0.4); display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px; }
            .if-header-info h2 { font-family:'Fredoka One', cursive; color:#6EE7B7; font-size:clamp(1.2rem, 3vw, 1.6rem); margin:0 0 4px; display:flex; align-items:center; gap:10px; }
            .if-header-info p { color:#CBD5E1; margin:0; font-size:0.92rem; line-height:1.45; }
            .if-guide-toggle-btn { background:#1E293B; border:2px solid #10B981; color:#34D399; padding:8px 16px; border-radius:14px; font-weight:800; font-size:0.88rem; cursor:pointer; display:flex; align-items:center; gap:8px; transition:0.2s all; }
            .if-guide-toggle-btn:hover { background:#10B981; color:#0F172A; transform:translateY(-2px); box-shadow:0 4px 15px rgba(16,185,129,0.4); }

            /* GUIA INTERATIVO DE APRESENTAÇÃO DE CONCEITOS (SLIDES/TABS) */
            .if-guide-card { background:#0F172A; border:2px solid #10B981; border-radius:22px; padding:16px 20px; margin-bottom:18px; box-shadow:0 12px 35px rgba(0,0,0,0.45); transition:all 0.3s ease; }
            .if-guide-tabs { display:flex; gap:8px; overflow-x:auto; padding-bottom:8px; border-bottom:1px solid #1E293B; margin-bottom:14px; scrollbar-width:thin; }
            .if-guide-tab { background:#1E293B; border:1px solid #334155; color:#94A3B8; padding:8px 14px; border-radius:12px; font-weight:800; font-size:0.85rem; cursor:pointer; transition:0.2s all; white-space:nowrap; display:flex; align-items:center; gap:6px; }
            .if-guide-tab:hover { color:#E2E8F0; border-color:#10B981; }
            .if-guide-tab.active { background:linear-gradient(135deg, rgba(16,185,129,0.25), rgba(5,150,105,0.25)); color:#34D399; border-color:#34D399; box-shadow:0 0 12px rgba(16,185,129,0.3); }
            
            .if-slide-content { display:none; animation:ifFadeIn 0.3s ease; }
            .if-slide-content.active { display:block; }
            
            .if-guide-footer { display:flex; justify-content:space-between; align-items:center; margin-top:16px; padding-top:12px; border-top:1px solid #1E293B; flex-wrap:wrap; gap:10px; }
            .if-guide-nav-btn { background:#1E293B; border:1px solid #475569; color:#E2E8F0; padding:8px 16px; border-radius:12px; font-weight:800; font-size:0.85rem; cursor:pointer; transition:0.2s; display:flex; align-items:center; gap:6px; }
            .if-guide-nav-btn:hover { border-color:#10B981; color:#34D399; background:#0F172A; }
            .if-guide-nav-btn.primary { background:linear-gradient(135deg, #10B981, #059669); color:white; border:none; box-shadow:0 4px 15px rgba(16,185,129,0.3); }
            .if-guide-nav-btn.primary:hover { background:linear-gradient(135deg, #34D399, #10B981); color:#0F172A; }
            .if-guide-progress-dots { display:flex; gap:6px; align-items:center; }
            .if-dot { width:8px; height:8px; border-radius:50%; background:#334155; transition:0.2s all; }
            .if-dot.active { width:22px; border-radius:10px; background:#34D399; }

            /* NAVEGAÇÃO DOS NÍVEIS (BARRA SEGMENTADA) */
            .if-level-bar { display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:10px; margin-bottom:18px; width:100%; }
            .if-level-btn { background:#1E293B; border:2px solid #334155; color:#94A3B8; padding:12px 14px; border-radius:18px; font-weight:800; cursor:pointer; font-size:0.88rem; transition:0.2s all; display:flex; align-items:center; justify-content:space-between; text-align:left; }
            .if-level-btn:hover { border-color:#10B981; color:white; transform:translateY(-2px); box-shadow:0 6px 15px rgba(0,0,0,0.3); }
            .if-level-btn.active { background:linear-gradient(135deg, #1E293B, #0F172A); color:white; border-color:#34D399; box-shadow:0 0 20px rgba(16,185,129,0.35); }
            .if-level-btn.active .if-lvl-num { background:#10B981; color:#0F172A; font-weight:900; }
            .if-level-btn.done { border-color:#34D399; color:#A7F3D0; }
            .if-level-btn.done .if-lvl-status { color:#34D399; }
            .if-lvl-left { display:flex; align-items:center; gap:10px; }
            .if-lvl-num { width:28px; height:28px; border-radius:8px; background:#334155; color:#E2E8F0; display:flex; align-items:center; justify-content:center; font-weight:900; font-size:0.82rem; }
            .if-lvl-info { display:flex; flex-direction:column; }
            .if-lvl-title { font-weight:900; font-size:0.88rem; color:#F1F5F9; }
            .if-lvl-sub { font-size:0.75rem; color:#94A3B8; }
            .if-lvl-status { font-size:0.95rem; color:#475569; }

            /* NÍVEL 1: CENÁRIO 3D ISOMÉTRICO COM PISTA GRANDE (5 COLUNAS X 2 FAIXAS) */
            .if-3d-stage { position:relative; background:radial-gradient(circle at 50% 25%, #1E293B 0%, #090D16 85%); border-radius:24px; height:370px; border:2px solid #10B981; overflow:hidden; perspective:950px; perspective-origin:50% 38%; display:flex; align-items:center; justify-content:center; box-shadow:inset 0 0 50px rgba(0,0,0,0.85), 0 10px 30px rgba(0,0,0,0.5); margin-bottom:16px; user-select:none; }
            .if-3d-hud { position:absolute; top:12px; right:15px; background:rgba(15,23,42,0.94); backdrop-filter:blur(8px); padding:6px 16px; border-radius:30px; border:2px solid #10B981; color:white; font-weight:900; z-index:50; font-size:0.85rem; box-shadow:0 4px 15px rgba(0,0,0,0.5); }
            .if-3d-hud span { color:#34D399; font-size:1.05rem; font-family:'Fredoka One', cursive; }
            .if-3d-legend { position:absolute; top:12px; left:15px; background:rgba(15,23,42,0.92); padding:6px 14px; border-radius:20px; border:1px solid #334155; color:#94A3B8; font-size:0.78rem; font-weight:800; z-index:50; display:flex; align-items:center; gap:8px; }
            
            .if-3d-world { position:relative; width:490px; height:200px; transform:rotateX(52deg) rotateZ(-20deg); transform-style:preserve-3d; transition:transform 0.4s ease; }
            .if-3d-grid { position:absolute; top:0; left:0; width:100%; height:100%; display:grid; grid-template-columns:repeat(5, 1fr); grid-template-rows:repeat(2, 1fr); gap:10px; transform-style:preserve-3d; }
            .if-3d-tile { position:relative; background:rgba(30,41,59,0.85); border:2px solid #475569; border-radius:14px; box-shadow:0 8px 0 #0F172A, inset 0 0 15px rgba(0,0,0,0.6); display:flex; align-items:center; justify-content:center; transform-style:preserve-3d; transition:all 0.3s; }
            .if-3d-tile.lane-top { border-color:rgba(56,189,248,0.6); background:linear-gradient(135deg, rgba(30,41,59,0.9), rgba(15,23,42,0.9)); }
            .if-3d-tile.lane-bottom { border-color:rgba(16,185,129,0.6); background:linear-gradient(135deg, rgba(16,185,129,0.18), rgba(15,23,42,0.9)); }
            .if-3d-tile.highlight { box-shadow:0 8px 0 #047857, inset 0 0 20px rgba(52,211,153,0.8); border-color:#34D399; }
            
            .if-3d-tile-tag { position:absolute; font-size:0.65rem; font-weight:900; transform:rotateZ(20deg) rotateX(-52deg); pointer-events:none; white-space:nowrap; }
            .if-3d-tile-tag.top { top:-22px; left:2px; color:#38BDF8; text-shadow:0 2px 4px rgba(0,0,0,0.8); }
            .if-3d-tile-tag.bottom { bottom:-22px; left:2px; color:#34D399; text-shadow:0 2px 4px rgba(0,0,0,0.8); }

            /* Robô 3D */
            .if-3d-robot { position:absolute; width:70px; height:70px; top:5px; left:8px; transform-style:preserve-3d; transition:all 0.45s cubic-bezier(0.25, 1, 0.5, 1); z-index:30; pointer-events:none; }
            .if-3d-robot-body { width:100%; height:100%; transform:rotateZ(20deg) rotateX(-52deg) translateY(-24px); filter:drop-shadow(0 16px 12px rgba(0,0,0,0.75)); transition:transform 0.3s ease; }
            .if-3d-robot-shadow { position:absolute; width:54px; height:32px; bottom:10px; left:8px; background:radial-gradient(ellipse, rgba(0,0,0,0.7) 0%, transparent 75%); border-radius:50%; transform:rotateZ(20deg); }

            /* Laser 3D do Sensor */
            .if-3d-laser { position:absolute; top:36px; left:68px; height:6px; width:130px; background:#34D399; box-shadow:0 0 15px #10B981, 0 0 30px #34D399; border-radius:4px; transform-origin:left center; transition:all 0.35s ease; z-index:25; opacity:0.95; }
            .if-3d-laser.detect { width:130px; background:#EF4444; box-shadow:0 0 18px #DC2626, 0 0 35px #EF4444; }
            .if-3d-laser.clear { width:320px; background:#34D399; box-shadow:0 0 18px #10B981, 0 0 35px #34D399; }

            /* Barreira 3D na Coluna 2 (2,0) */
            .if-3d-obstacle { position:absolute; width:70px; height:70px; top:5px; left:204px; transform-style:preserve-3d; z-index:20; transition:opacity 0.3s, transform 0.3s; }
            .if-3d-obstacle-body { width:100%; height:100%; display:flex; align-items:center; justify-content:center; font-size:2.8rem; transform:rotateZ(20deg) rotateX(-52deg) translateY(-20px); filter:drop-shadow(0 12px 10px rgba(0,0,0,0.85)); animation:bounceBar 1.2s infinite alternate; }

            /* Troféu 3D na Coluna 4 (4,0) */
            .if-3d-target { position:absolute; width:70px; height:70px; top:5px; left:402px; transform-style:preserve-3d; z-index:20; }
            .if-3d-target-body { width:100%; height:100%; display:flex; align-items:center; justify-content:center; font-size:2.8rem; transform:rotateZ(20deg) rotateX(-52deg) translateY(-22px); filter:drop-shadow(0 14px 15px rgba(245,158,11,0.5)); animation:chestGlow 1.2s infinite alternate; }

            /* MINI-IDE & LAYOUT GRID */
            .if-ide-layout { display:grid; grid-template-columns:repeat(auto-fit, minmax(290px, 1fr)); gap:18px; margin-bottom:15px; width:100%; max-width:100%; }
            @media (max-width: 820px) { .if-ide-layout { grid-template-columns:1fr; } }
            
            .if-editor-card { background:#090D16; border:2px solid #10B981; border-radius:20px; padding:16px; display:flex; flex-direction:column; box-shadow:0 10px 25px rgba(0,0,0,0.5); width:100%; max-width:100%; min-width:0; box-sizing:border-box; }
            .if-editor-topbar { display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #1E293B; padding-bottom:10px; margin-bottom:12px; }
            .if-editor-title { font-family:'Fredoka One'; color:#6EE7B7; font-size:1.05rem; display:flex; align-items:center; gap:8px; }
            .if-lang-tag { background:rgba(16,185,129,0.25); color:#34D399; padding:3px 10px; border-radius:12px; font-size:0.75rem; font-weight:800; border:1px solid #10B981; }

            /* Teclado Maker de Atalhos Rápidos */
            .if-shortcuts-bar { display:flex; gap:6px; flex-wrap:wrap; margin-bottom:12px; background:#111827; padding:8px; border-radius:12px; border:1px solid #1F2937; }
            .if-shortcut-btn { background:#1F2937; border:1px solid #374151; color:#E5E7EB; padding:6px 11px; border-radius:8px; font-size:0.8rem; font-weight:800; cursor:pointer; transition:0.15s; font-family:'Nunito', sans-serif; display:flex; align-items:center; gap:4px; }
            .if-shortcut-btn:hover { background:#10B981; border-color:#34D399; color:#0F172A; transform:scale(1.04); font-weight:900; }
            .if-shortcut-btn.clear { background:#450A0A; border-color:#991B1B; color:#FCA5A5; }
            .if-shortcut-btn.clear:hover { background:#DC2626; color:white; }

            /* Scaffolding Editor */
            .if-scaffold-lines { background:#030712; border-radius:14px; padding:16px; border:1px solid #1F2937; font-family:'Fira Code', monospace; font-size:0.92rem; line-height:2; color:#E2E8F0; }
            .if-scaffold-line { padding:3px 8px; border-radius:6px; transition:background 0.2s; border-left:3px solid transparent; }
            .if-scaffold-line.active { background:rgba(16,185,129,0.3); border-left-color:#34D399; }
            .if-select-cmd { background:#1E293B; border:2px solid #10B981; color:#34D399; font-family:'Fira Code', monospace; font-size:0.9rem; font-weight:bold; padding:4px 8px; border-radius:8px; outline:none; cursor:pointer; }
            .if-select-cmd:focus { border-color:#FBBF24; color:#FBBF24; }
            .if-input-num { background:#1E293B; border:2px solid #10B981; color:#FBBF24; font-family:'Fredoka One'; font-size:1.1rem; width:55px; padding:4px 6px; border-radius:8px; text-align:center; outline:none; }
            .if-input-num::placeholder { color:#FBBF24; opacity:0.85; font-weight:900; }
            .if-select-cmd option[disabled] { color:#94A3B8; font-style:italic; }

            /* Textarea Editor (Nível 4) */
            .if-code-wrapper { position:relative; display:flex; background:#030712; border-radius:14px; border:1px solid #1F2937; overflow:hidden; min-height:200px; }
            .if-line-numbers { background:#0B0F19; color:#4B5563; padding:12px 8px; text-align:right; font-family:'Fira Code', monospace; font-size:0.88rem; line-height:1.7; user-select:none; border-right:1px solid #1F2937; min-width:32px; }
            .if-code-input { flex:1; background:transparent; border:none; color:#F3F4F6; padding:12px; font-family:'Fira Code', monospace; font-size:0.9rem; line-height:1.7; resize:none; outline:none; white-space:pre; tab-size:4; min-height:200px; }

            /* Caixa de Dica e Solução */
            .if-solution-card { background:#0F172A; border:2px solid #F59E0B; border-radius:14px; padding:12px 16px; margin-top:12px; display:none; animation:ifFadeIn 0.3s ease; }
            .if-solution-card.visible { display:block; }
            .if-btn-solution { background:linear-gradient(135deg,#D97706,#B45309); border:none; color:white; padding:8px 14px; border-radius:10px; font-size:0.85rem; font-weight:900; cursor:pointer; transition:0.15s; margin-top:8px; width:100%; display:flex; align-items:center; justify-content:center; gap:6px; }
            .if-btn-solution:hover { background:linear-gradient(135deg,#F59E0B,#D97706); }

            /* Simulação do Robô no Grid */
            .if-sim-card { background:#090D16; border:2px solid #334155; border-radius:20px; padding:16px; display:flex; flex-direction:column; align-items:center; box-shadow:0 10px 25px rgba(0,0,0,0.5); width:100%; max-width:100%; min-width:0; box-sizing:border-box; }
            .if-sim-topbar { width:100%; display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #1E293B; padding-bottom:8px; margin-bottom:12px; }
            .if-sim-title { font-family:'Fredoka One'; color:#38BDF8; font-size:1.05rem; }
            .if-sim-hud { font-weight:800; font-size:0.85rem; color:#34D399; background:#1E293B; padding:4px 10px; border-radius:12px; transition:all 0.2s; }
            .if-sim-hud.warning { color:#EF4444; background:rgba(239,68,68,0.2); border:1px solid #EF4444; }

            /* Tabuleiro Grid */
            .if-board { display:grid; gap:4px; padding:8px; border-radius:18px; background:linear-gradient(180deg,#1E293B,#0F172A); border:3px solid #334155; box-shadow:0 8px 30px rgba(0,0,0,0.6); max-width:360px; width:100%; aspect-ratio:1; margin:0 auto; box-sizing:border-box; align-self:center; }
            .if-cell { background:rgba(30,41,59,0.7); border-radius:8px; border:2px solid rgba(51,65,85,0.7); display:flex; align-items:center; justify-content:center; position:relative; aspect-ratio:1; transition:all 0.2s; min-width:0; min-height:0; overflow:hidden; box-sizing:border-box; }
            .if-cell.wall { background:repeating-linear-gradient(45deg,#334155,#334155 4px,#1E293B 4px,#1E293B 8px); border-color:#475569; }
            .if-cell.barrier::after { content:'🚧'; font-size:clamp(0.9rem, 3.5vw, 1.3rem); animation:bounceBar 1s infinite alternate; }
            .if-cell.coin::after { content:'🪙'; font-size:clamp(0.9rem, 3.5vw, 1.4rem); animation:coinSpin 1.5s infinite alternate; filter:drop-shadow(0 0 6px #F59E0B); }
            .if-cell.chest::after { content:'🏆'; font-size:clamp(1rem, 3.8vw, 1.6rem); animation:chestGlow 1.2s infinite alternate; filter:drop-shadow(0 0 8px #FBBF24); }
            .if-cell.robot { background:rgba(52,211,153,0.25); border-color:#34D399; box-shadow:0 0 16px rgba(52,211,153,0.6); z-index:10; }
            .if-cell.robot svg { max-width:80%; max-height:80%; width:auto; height:auto; filter:drop-shadow(0 0 6px rgba(52,211,153,0.8)); }
            .if-cell.robot.moving svg { animation:robotWalk 0.3s ease-in-out; }
            .if-cell.robot.sonar svg { filter:drop-shadow(0 0 14px #F59E0B); transform:scale(1.08); }
            .if-cell.robot.crash { background:rgba(239,68,68,0.35); border-color:#EF4444; box-shadow:0 0 25px rgba(239,68,68,0.8); animation:errorShake 0.4s; }
            .if-cell.robot.win { background:rgba(16,185,129,0.35); border-color:#10B981; box-shadow:0 0 25px rgba(16,185,129,0.8); }

            /* Botões de Ação */
            .if-actions { display:flex; gap:10px; margin-top:14px; width:100%; }
            .if-btn-run { background:linear-gradient(135deg,#10B981,#047857); color:white; border:none; padding:13px 20px; border-radius:16px; font-family:'Fredoka One', cursive; font-size:1.15rem; flex:2; border-bottom:5px solid #064E3B; cursor:pointer; transition:0.15s; display:flex; align-items:center; justify-content:center; gap:8px; box-shadow:0 6px 20px rgba(16,185,129,0.35); }
            .if-btn-run:active { transform:translateY(4px); border-bottom-width:1px; }
            .if-btn-run:disabled { background:#475569; border-bottom-color:#1E293B; cursor:not-allowed; box-shadow:none; }
            .if-btn-reset { background:#334155; color:#CBD5E1; border:none; padding:13px 18px; border-radius:16px; font-family:'Fredoka One', cursive; font-size:1rem; flex:1; border-bottom:5px solid #1E293B; cursor:pointer; transition:0.15s; }

            /* Modal de Vitória */
            .if-modal { position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(15,23,42,0.88); backdrop-filter:blur(8px); display:flex; justify-content:center; align-items:center; z-index:9999; opacity:0; pointer-events:none; transition:0.3s; }
            .if-modal.active { opacity:1; pointer-events:all; }
            .if-modal-box { background:linear-gradient(180deg,#1E293B,#0F172A); padding:32px 24px; border-radius:28px; max-width:440px; width:92%; text-align:center; border:3px solid #10B981; box-shadow:0 0 45px rgba(16,185,129,0.4); }
            .if-modal-icon { font-size:4rem; margin-bottom:6px; animation:stampPop 0.4s cubic-bezier(0.175,0.885,0.32,1.275); }
            .if-modal-title { font-family:'Fredoka One', cursive; color:white; font-size:1.8rem; margin:0 0 8px; }
            .if-modal-text { color:#CBD5E1; margin:0 0 20px; font-size:0.95rem; line-height:1.6; }
            .if-btn-modal { background:linear-gradient(135deg,#10B981,#059669); border:none; padding:13px 32px; border-radius:50px; font-weight:900; font-size:1.05rem; color:white; cursor:pointer; border-bottom:4px solid #047857; transition:0.15s; }

            @keyframes bounceBar { 0%{transform:translateY(0);} 100%{transform:translateY(-4px);} }
            @keyframes coinSpin { 0%{transform:scale(0.9) rotate(0deg);} 100%{transform:scale(1.1) rotate(15deg);} }
            @keyframes chestGlow { 0%{transform:scale(1);} 100%{transform:scale(1.18);} }
            @keyframes ifFadeIn { from{opacity:0;transform:translateY(8px);} to{opacity:1;transform:translateY(0);} }
        </style>

        <div class="if-wrapper">
            <!-- CABEÇALHO DO MÓDULO -->
            <div class="if-header-card">
                <div class="if-header-info">
                    <h2>🌱 Aula 3: Condicionais (IF / ELSE) & Robô Inteligente</h2>
                    <p id="if-header-desc">Ensine o Robô Maker a <b>tomar decisões inteligentes com base em sensores</b> usando <code>if / else</code> e comandos direcionais!</p>
                </div>
                <button class="if-guide-toggle-btn" id="if_guide_toggle_btn" onclick="if_toggleGuide()">
                    <i class="fa-solid fa-book-open-reader"></i> <span id="if_guide_toggle_txt">Ocultar Guia Teórico</span>
                </button>
            </div>

            <!-- GUIA INTERATIVO DE APRESENTAÇÃO DE CONCEITOS COM NAVEGAÇÃO POR ABAS/SLIDES -->
            <div class="if-guide-card" id="if_guide_card">
                <div class="if-guide-tabs">
                    <button class="if-guide-tab active" id="if_tab_g1" onclick="if_switchGuideTab(1)"><i class="fa-solid fa-brain"></i> 1. Tipo bool (Booleano)</button>
                    <button class="if-guide-tab" id="if_tab_g2" onclick="if_switchGuideTab(2)"><i class="fa-solid fa-scale-balanced"></i> 2. Operadores de Decisão</button>
                    <button class="if-guide-tab" id="if_tab_g3" onclick="if_switchGuideTab(3)"><i class="fa-solid fa-code-branch"></i> 3. Estrutura if / else</button>
                    <button class="if-guide-tab" id="if_tab_g4" onclick="if_switchGuideTab(4)"><i class="fa-solid fa-flask-vial"></i> 4. Laboratório ao Vivo</button>
                </div>

                <!-- SLIDE 1: O QUE É UMA VARIÁVEL BOOL? -->
                <div class="if-slide-content active" id="if_slide_1">
                    <div style="font-size:1.05rem;font-weight:900;color:#34D399;margin-bottom:8px;display:flex;align-items:center;gap:8px;">
                        <span>🧠 1. O que é uma variável do tipo <code style="background:#0F172A;color:#F472B6;padding:2px 8px;border-radius:6px;border:1px solid #EC4899;">bool</code> (Booleana)?</span>
                    </div>
                    <p style="margin:0 0 10px;color:#CBD5E1;font-size:0.92rem;line-height:1.6;">
                        Na programação e robótica, o tipo <b>bool</b> (criado por <i>George Boole</i>) é a forma como computadores pensam! Ela só pode guardar <b>exatamente 2 estados</b>:
                    </p>
                    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:12px;margin:12px 0;">
                        <div style="background:#090D16;border:2px solid #10B981;border-radius:14px;padding:12px;text-align:center;">
                            <div style="color:#34D399;font-weight:900;font-size:1.15rem;font-family:'Fredoka One';">✅ true (Verdadeiro)</div>
                            <div style="font-size:0.85rem;color:#E2E8F0;margin-top:6px;font-weight:bold;">1 • Ligado • HIGH • 5 Volts</div>
                            <div style="font-size:0.78rem;color:#94A3B8;margin-top:4px;">Sensor detectou barreira no caminho!</div>
                        </div>
                        <div style="background:#090D16;border:2px solid #EF4444;border-radius:14px;padding:12px;text-align:center;">
                            <div style="color:#F87171;font-weight:900;font-size:1.15rem;font-family:'Fredoka One';">❌ false (Falso)</div>
                            <div style="font-size:0.85rem;color:#E2E8F0;margin-top:6px;font-weight:bold;">0 • Desligado • LOW • 0 Volts (GND)</div>
                            <div style="font-size:0.78rem;color:#94A3B8;margin-top:4px;">Pista totalmente livre para avançar!</div>
                        </div>
                    </div>
                    <div style="background:rgba(56,189,248,0.1);border:1px solid #38BDF8;border-radius:12px;padding:10px 14px;color:#93C5FD;font-size:0.85rem;">
                        💡 <b>Na Placa Arduino:</b> A função <code>sensorObstaculo()</code> devolve <code>true</code> se o raio ultrassônico bater em um obstáculo, ou <code>false</code> se estiver livre.
                    </div>
                </div>

                <!-- SLIDE 2: OPERADORES DE COMPARAÇÃO NO IF -->
                <div class="if-slide-content" id="if_slide_2">
                    <div style="font-size:1.05rem;font-weight:900;color:#38BDF8;margin-bottom:8px;display:flex;align-items:center;gap:8px;">
                        <span>⚖️ 2. Operadores de Comparação em C/C++</span>
                    </div>
                    <p style="margin:0 0 10px;color:#CBD5E1;font-size:0.92rem;">
                        O comando <code>if (condição)</code> compara valores para saber se o resultado é <b>true</b> ou <b>false</b>:
                    </p>
                    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:8px;">
                        <div style="background:#090D16;padding:10px 12px;border-radius:10px;border-left:4px solid #38BDF8;">
                            <b style="color:#67E8F9;font-size:0.95rem;">== (Igual a)</b>
                            <div style="color:#E2E8F0;font-size:0.85rem;margin-top:2px;"><code>temObstaculo == true</code></div>
                            <span style="color:#FBBF24;font-size:0.75rem;">⚠️ Atenção: '=' guarda, '==' compara!</span>
                        </div>
                        <div style="background:#090D16;padding:10px 12px;border-radius:10px;border-left:4px solid #F472B6;">
                            <b style="color:#F472B6;font-size:0.95rem;">!= (Diferente de)</b>
                            <div style="color:#E2E8F0;font-size:0.85rem;margin-top:2px;"><code>distancia != 0</code></div>
                            <span style="color:#94A3B8;font-size:0.75rem;">O '!' significa NÃO (inverte o valor).</span>
                        </div>
                        <div style="background:#090D16;padding:10px 12px;border-radius:10px;border-left:4px solid #34D399;">
                            <b style="color:#34D399;font-size:0.95rem;">&gt; (Maior que)</b>
                            <div style="color:#E2E8F0;font-size:0.85rem;margin-top:2px;"><code>temperatura &gt; 30</code></div>
                            <span style="color:#94A3B8;font-size:0.75rem;">Ex: Se passar de 30°C, ligar cooler!</span>
                        </div>
                        <div style="background:#090D16;padding:10px 12px;border-radius:10px;border-left:4px solid #FBBF24;">
                            <b style="color:#FBBF24;font-size:0.95rem;">&lt; (Menor que)</b>
                            <div style="color:#E2E8F0;font-size:0.85rem;margin-top:2px;"><code>distancia &lt; 15</code></div>
                            <span style="color:#94A3B8;font-size:0.75rem;">Ex: Se estiver a menos de 15cm, frear!</span>
                        </div>
                        <div style="background:#090D16;padding:10px 12px;border-radius:10px;border-left:4px solid #A78BFA;">
                            <b style="color:#A78BFA;font-size:0.95rem;">&gt;= (Maior ou igual)</b>
                            <div style="color:#E2E8F0;font-size:0.85rem;margin-top:2px;"><code>bateria &gt;= 80</code></div>
                            <span style="color:#94A3B8;font-size:0.75rem;">Ex: Bateria com carga cheia.</span>
                        </div>
                        <div style="background:#090D16;padding:10px 12px;border-radius:10px;border-left:4px solid #F87171;">
                            <b style="color:#F87171;font-size:0.95rem;">&lt;= (Menor ou igual)</b>
                            <div style="color:#E2E8F0;font-size:0.85rem;margin-top:2px;"><code>luzAmbiente &lt;= 20</code></div>
                            <span style="color:#94A3B8;font-size:0.75rem;">Ex: Pouca luz, acender o farol LED!</span>
                        </div>
                    </div>
                </div>

                <!-- SLIDE 3: ESTRUTURA ANATÔMICA DO IF / ELSE -->
                <div class="if-slide-content" id="if_slide_3">
                    <div style="font-size:1.05rem;font-weight:900;color:#FBBF24;margin-bottom:8px;display:flex;align-items:center;gap:8px;">
                        <span>🌿 3. Anatomia do Bloco Condicional em C/C++</span>
                    </div>
                    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:12px;">
                        <div style="background:#090D16;border:1px solid #334155;border-radius:12px;padding:12px;font-family:'Fira Code',monospace;font-size:0.85rem;line-height:1.7;">
                            <div style="color:#F472B6;font-weight:bold;">if <span style="color:#E2E8F0;">(</span> <span style="color:#60A5FA;">sensorObstaculo()</span> <span style="color:#E2E8F0;">) {</span></div>
                            <div style="color:#34D399;padding-left:18px;">baixo(); <span style="color:#64748B;">// Executa se TRUE ✅</span></div>
                            <div style="color:#F472B6;font-weight:bold;">} else {</div>
                            <div style="color:#38BDF8;padding-left:18px;">direita(); <span style="color:#64748B;">// Executa se FALSE ❌</span></div>
                            <div style="color:#E2E8F0;">}</div>
                        </div>
                        <div style="background:rgba(30,41,59,0.7);border-radius:12px;padding:12px;font-size:0.85rem;color:#CBD5E1;line-height:1.6;">
                            <div style="font-weight:900;color:#6EE7B7;margin-bottom:4px;">🧭 Regra de Ouro do Robô:</div>
                            <ul style="margin:0;padding-left:18px;">
                                <li>O robô <b>nunca</b> executa os dois blocos ao mesmo tempo.</li>
                                <li>Se a condição for <b>true</b>, ele entra no <code>if</code> e <b>ignora o else</b>.</li>
                                <li>Se for <b>false</b>, ele pula o <code>if</code> e executa o que está dentro do <code>else</code>.</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <!-- SLIDE 4: COMO FUNCIONA A DISTÂNCIA DA BARREIRA (SENSOR ULTRASSÔNICO HC-SR04) -->
                <div class="if-slide-content" id="if_slide_4">
                    <div style="font-size:1.05rem;font-weight:900;color:#34D399;margin-bottom:8px;display:flex;align-items:center;gap:8px;">
                        <span>🦇 4. Como Funciona a "Distância da Barreira"? (Sensor Ultrassônico HC-SR04)</span>
                    </div>
                    <p style="margin:0 0 12px;color:#CBD5E1;font-size:0.9rem;line-height:1.6;">
                        O robô possui um <b>sensor ultrassônico</b> (os dois 'olhos' redondos) que emite ondas de som inaudíveis. O som bate na parede e volta como um eco! O Arduino calcula a <b style="color:#FBBF24;">distância exata em centímetros (cm)</b>.
                    </p>

                    <!-- PALCO INTERATIVO DO SENSOR ULTRASSÔNICO & RADAR -->
                    <div style="background:#090D16;border:2px solid #10B981;border-radius:18px;padding:16px;box-shadow:0 8px 25px rgba(0,0,0,0.5);">
                        <!-- Controle do Slider com Medidor -->
                        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;margin-bottom:14px;background:#0F172A;padding:10px 14px;border-radius:12px;border:1px solid #1E293B;">
                            <div style="display:flex;align-items:center;gap:10px;">
                                <span style="font-size:1.4rem;">📏</span>
                                <div>
                                    <div style="color:#94A3B8;font-size:0.75rem;font-weight:800;">ARRASTE PARA MOVER A BARREIRA:</div>
                                    <div style="color:#E2E8F0;font-size:0.88rem;font-weight:bold;">Distância Medida pelo Sensor do Robô:</div>
                                </div>
                            </div>
                            <div style="display:flex;align-items:center;gap:10px;">
                                <input type="range" id="if_demo_dist_slider" min="5" max="45" value="12" oninput="if_updateDemoEval()" style="width:160px;accent-color:#10B981;cursor:pointer;" />
                                <span id="if_demo_dist_val" style="background:#1E293B;color:#34D399;font-weight:900;font-family:'Fira Code';font-size:1.1rem;padding:4px 12px;border-radius:8px;border:1px solid #334155;min-width:70px;text-align:center;">12 cm</span>
                            </div>
                        </div>

                        <!-- Palco Visual com Robô, Feixe Sonar e Parede Móvel -->
                        <div style="position:relative;height:120px;background:radial-gradient(ellipse at 50% 50%, #1E293B 0%, #030712 100%);border-radius:14px;border:1px solid #334155;overflow:hidden;display:flex;align-items:center;">
                            <!-- Robô Maker à esquerda -->
                            <div style="position:absolute;left:15px;width:70px;height:70px;z-index:10;display:flex;flex-direction:column;align-items:center;">
                                <svg viewBox="0 0 100 100" width="60" height="60">
                                    <rect x="25" y="25" width="50" height="40" rx="10" fill="#10B981" stroke="#047857" stroke-width="4"/>
                                    <circle cx="40" cy="45" r="7" fill="#0F172A" stroke="#38BDF8" stroke-width="2"/>
                                    <circle cx="40" cy="45" r="3" fill="#38BDF8"/>
                                    <circle cx="60" cy="45" r="7" fill="#0F172A" stroke="#38BDF8" stroke-width="2"/>
                                    <circle cx="60" cy="45" r="3" fill="#38BDF8"/>
                                    <line x1="50" y1="25" x2="50" y2="10" stroke="#10B981" stroke-width="4"/>
                                    <circle cx="50" cy="8" r="5" fill="#F59E0B"/>
                                </svg>
                                <span style="font-size:0.65rem;color:#94A3B8;font-weight:800;">Sensor HC-SR04</span>
                            </div>

                            <!-- Feixe de Onda Sonar Dinâmico -->
                            <div id="if_demo_sonar_beam" style="position:absolute;left:80px;height:36px;background:repeating-linear-gradient(90deg, rgba(239,68,68,0.3) 0px, rgba(239,68,68,0.7) 10px, transparent 10px, transparent 18px);border-radius:6px;transition:width 0.1s ease, background 0.2s ease;z-index:5;"></div>

                            <!-- Parede / Barreira que se move com o slider -->
                            <div id="if_demo_wall" style="position:absolute;width:40px;height:85px;background:repeating-linear-gradient(45deg,#D97706,#D97706 8px,#92400E 8px,#92400E 16px);border:3px solid #F59E0B;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:1.8rem;box-shadow:0 0 20px rgba(245,158,11,0.4);transition:left 0.1s ease;z-index:10;">
                                🧱
                            </div>

                            <!-- Linha Indicadora de Limite de Perigo (20 cm) -->
                            <div style="position:absolute;left:185px;top:0;bottom:0;width:2px;border-left:2px dashed #EF4444;opacity:0.6;z-index:2;">
                                <span style="position:absolute;top:6px;left:6px;font-size:0.65rem;color:#FCA5A5;white-space:nowrap;font-weight:900;">⚠️ Limite de Perigo: 20 cm</span>
                            </div>
                        </div>

                        <!-- Painel de Decisão do Arduino C++ -->
                        <div id="if_demo_result_box" style="margin-top:12px;background:#030712;padding:12px 16px;border-radius:12px;border:1px solid #1E293B;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;">
                            <div style="font-family:'Fira Code',monospace;font-size:0.92rem;">
                                <span style="color:#F472B6;font-weight:bold;">if</span> ( <span id="if_demo_expr" style="color:#60A5FA;font-weight:bold;">distancia &lt; 20</span> ) ➔ Resultado: <b id="if_demo_bool_res" style="color:#F87171;font-size:1.05rem;">true</b>
                            </div>
                            <span id="if_demo_branch_tag" style="background:rgba(239,68,68,0.2);color:#F87171;padding:6px 14px;border-radius:10px;font-weight:900;border:1px solid #EF4444;font-size:0.85rem;">
                                🚨 BARREIRA DETECTADA! (Executa o IF para desviar)
                            </span>
                        </div>

                        <!-- 2 Cards de Conexão com o Jogo e Prática -->
                        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:10px;margin-top:12px;">
                            <div style="background:#0F172A;padding:10px 12px;border-radius:10px;border-left:4px solid #10B981;font-size:0.82rem;color:#CBD5E1;line-height:1.5;">
                                <b style="color:#34D399;">🤖 O que é <code>sensorObstaculo()</code> nos Desafios?</b><br>
                                É a função do robô que verifica se <code>distancia &lt; 20</code>! Se a barreira estiver a menos de 20cm, ela retorna <code>true</code>!
                            </div>
                            <div style="background:#0F172A;padding:10px 12px;border-radius:10px;border-left:4px solid #38BDF8;font-size:0.82rem;color:#CBD5E1;line-height:1.5;">
                                <b style="color:#38BDF8;">💡 Por que isso importa na Robótica?</b><br>
                                Robôs reais não adivinham barreiras: eles medem centímetros no sensor e usam <code>if (distancia &lt; 20)</code> para nunca baterem!
                            </div>
                        </div>
                    </div>
                </div>

                <!-- RODAPÉ DE NAVEGAÇÃO DO GUIA -->
                <div class="if-guide-footer">
                    <button class="if-guide-nav-btn" id="if_guide_prev_btn" onclick="if_prevGuideSlide()">
                        <i class="fa-solid fa-arrow-left"></i> Anterior
                    </button>
                    <div class="if-guide-progress-dots">
                        <div class="if-dot active" id="if_dot_1"></div>
                        <div class="if-dot" id="if_dot_2"></div>
                        <div class="if-dot" id="if_dot_3"></div>
                        <div class="if-dot" id="if_dot_4"></div>
                    </div>
                    <button class="if-guide-nav-btn primary" id="if_guide_next_btn" onclick="if_nextGuideSlide()">
                        Próximo <i class="fa-solid fa-arrow-right"></i>
                    </button>
                </div>
            </div>

            <!-- BARRA DE SELEÇÃO DE NÍVEIS COM STATUS E SUBTÍTULOS -->
            <div class="if-level-bar">
                <button class="if-level-btn active" id="if_btn_lvl_1" onclick="if_switchLevel(1)">
                    <div class="if-lvl-left">
                        <div class="if-lvl-num">1</div>
                        <div class="if-lvl-info">
                            <span class="if-lvl-title">Sensor & Pista 3D</span>
                            <span class="if-lvl-sub">Pista Ampla e Desvio</span>
                        </div>
                    </div>
                    <div class="if-lvl-status"><i class="fa-solid fa-star"></i></div>
                </button>
                <button class="if-level-btn" id="if_btn_lvl_2" onclick="if_switchLevel(2)">
                    <div class="if-lvl-left">
                        <div class="if-lvl-num">2</div>
                        <div class="if-lvl-info">
                            <span class="if-lvl-title">Sequência IF/ELSE</span>
                            <span class="if-lvl-sub">3 Passos Ordenados</span>
                        </div>
                    </div>
                    <div class="if-lvl-status"><i class="fa-solid fa-star"></i></div>
                </button>
                <button class="if-level-btn" id="if_btn_lvl_3" onclick="if_switchLevel(3)">
                    <div class="if-lvl-left">
                        <div class="if-lvl-num">3</div>
                        <div class="if-lvl-info">
                            <span class="if-lvl-title">Mix FOR + IF/ELSE</span>
                            <span class="if-lvl-sub">Automação de 5 Ciclos</span>
                        </div>
                    </div>
                    <div class="if-lvl-status"><i class="fa-solid fa-star"></i></div>
                </button>
                <button class="if-level-btn" id="if_btn_lvl_4" onclick="if_switchLevel(4)">
                    <div class="if-lvl-left">
                        <div class="if-lvl-num">4</div>
                        <div class="if-lvl-info">
                            <span class="if-lvl-title">Mini-IDE C/C++</span>
                            <span class="if-lvl-sub">Código Livre Digitado</span>
                        </div>
                    </div>
                    <div class="if-lvl-status"><i class="fa-solid fa-star"></i></div>
                </button>
            </div>

            <!-- ================= ÁREA DO NÍVEL 1: SENSOR & DECISÃO NA PISTA GRANDE 3D ================= -->
            <div id="if_level_1_view">
                <div class="if-3d-stage" id="if_sensor_scene">
                    <div class="if-3d-legend">
                        <i class="fa-solid fa-cube" style="color:#38BDF8;"></i> Pista Espacial 3D Ampla: <b>Faixa Superior (Principal) & Faixa Inferior (Desvio)</b>
                    </div>
                    
                    <div class="if-3d-hud">
                        Sensor Ultrassônico: <span id="if_sensor_reading_text">BARREIRA (true)</span>
                    </div>

                    <div class="if-3d-world" id="if_3d_world">
                        <!-- Tabuleiro Isométrico Amplo de 5x2 Ladrilhos 3D -->
                        <div class="if-3d-grid" id="if_3d_grid_tiles">
                            <!-- Linha 0: Faixa Principal Superior -->
                            <div class="if-3d-tile lane-top highlight" id="if_tile_0_0"><span class="if-3d-tile-tag top">Partida (0,0)</span></div>
                            <div class="if-3d-tile lane-top" id="if_tile_1_0"><span class="if-3d-tile-tag top">Bloco (1,0)</span></div>
                            <div class="if-3d-tile lane-top" id="if_tile_2_0"><span class="if-3d-tile-tag top">Obstáculo (2,0)</span></div>
                            <div class="if-3d-tile lane-top" id="if_tile_3_0"><span class="if-3d-tile-tag top">Retorno (3,0)</span></div>
                            <div class="if-3d-tile lane-top" id="if_tile_4_0"><span class="if-3d-tile-tag top">Troféu 🏆 (4,0)</span></div>
                            
                            <!-- Linha 1: Faixa de Desvio Inferior -->
                            <div class="if-3d-tile lane-bottom" id="if_tile_0_1"><span class="if-3d-tile-tag bottom">Desvio ⬇ (0,1)</span></div>
                            <div class="if-3d-tile lane-bottom" id="if_tile_1_1"><span class="if-3d-tile-tag bottom">Avanço ➡️ (1,1)</span></div>
                            <div class="if-3d-tile lane-bottom" id="if_tile_2_1"><span class="if-3d-tile-tag bottom">Estrela 🌟 (2,1)</span></div>
                            <div class="if-3d-tile lane-bottom" id="if_tile_3_1"><span class="if-3d-tile-tag bottom">Subida ⬆ (3,1)</span></div>
                            <div class="if-3d-tile lane-bottom" id="if_tile_4_1"><span class="if-3d-tile-tag bottom">Chegada (4,1)</span></div>
                        </div>

                        <!-- Feixe Laser 3D do Sensor Ultrassônico -->
                        <div class="if-3d-laser detect" id="if_sensor_beam" style="top:36px;left:68px;width:130px;"></div>

                        <!-- Robô 3D com Sombra Dinâmica -->
                        <div class="if-3d-robot" id="if_n1_robot" style="top:5px;left:8px;">
                            <div class="if-3d-robot-shadow"></div>
                            <div class="if-3d-robot-body">
                                <svg viewBox="0 0 100 100" width="100%" height="100%">
                                    <line x1="50" y1="20" x2="50" y2="8" stroke="#38BDF8" stroke-width="4" stroke-linecap="round"/>
                                    <circle cx="50" cy="7" r="5" fill="#38BDF8"/>
                                    <rect x="25" y="20" width="50" height="32" rx="10" fill="#1E293B" stroke="#38BDF8" stroke-width="3"/>
                                    <circle cx="38" cy="36" r="7" fill="#0F172A" stroke="#34D399" stroke-width="2"/>
                                    <circle cx="38" cy="36" r="3.5" fill="#34D399"/>
                                    <circle cx="62" cy="36" r="7" fill="#0F172A" stroke="#34D399" stroke-width="2"/>
                                    <circle cx="62" cy="36" r="3.5" fill="#34D399"/>
                                    <rect x="20" y="55" width="60" height="34" rx="8" fill="#0F172A" stroke="#38BDF8" stroke-width="3"/>
                                    <rect x="32" y="62" width="36" height="18" rx="4" fill="#1E293B" stroke="#10B981" stroke-width="1.5"/>
                                    <circle cx="40" cy="71" r="3" fill="#F59E0B"/>
                                    <circle cx="50" cy="71" r="3" fill="#38BDF8"/>
                                    <circle cx="60" cy="71" r="3" fill="#10B981"/>
                                    <rect x="12" y="86" width="76" height="10" rx="5" fill="#334155" stroke="#475569" stroke-width="2"/>
                                </svg>
                            </div>
                        </div>

                        <!-- Barreira 3D na Coluna 2 (2,0) -->
                        <div class="if-3d-obstacle" id="if_n1_obstacle" style="top:5px;left:204px;">
                            <div class="if-3d-obstacle-body">🚧</div>
                        </div>

                        <!-- Troféu de Ouro 3D na Coluna 4 (4,0) -->
                        <div class="if-3d-target" id="if_n1_target" style="top:5px;left:402px;">
                            <div class="if-3d-target-body">🏆</div>
                        </div>

                        <!-- Estrela de Energia 3D na Faixa de Desvio (2,1) -->
                        <div class="if-3d-target" id="if_n1_star" style="top:108px;left:204px;">
                            <div class="if-3d-target-body" style="font-size:2.6rem;">🌟</div>
                        </div>
                    </div>
                </div>

                <div class="if-ide-layout">
                    <div class="if-editor-card">
                        <div class="if-editor-topbar">
                            <div class="if-editor-title"><i class="fa-solid fa-sliders"></i> Programa C/C++ de Navegação na Pista Ampla</div>
                            <div class="if-lang-tag">C/C++</div>
                        </div>

                        <div class="if-scaffold-lines">
                            <div class="if-scaffold-line" id="if_n1_line_1"><span style="color:#64748B;">// 🧠 1. Lê o sensor e guarda true (barreira) ou false (livre) na variável bool:</span></div>
                            <div class="if-scaffold-line" id="if_n1_line_2"><span style="color:#F472B6;font-weight:bold;">bool</span> temObstaculo = <span style="color:#60A5FA;">sensorObstaculo</span>();</div>
                            <div class="if-scaffold-line" id="if_n1_line_3"><span style="color:#64748B;">// ⚖️ 2. Operador '==' compara igualdade no if:</span></div>
                            <div class="if-scaffold-line" id="if_n1_line_4"><span style="color:#F472B6;font-weight:bold;">if</span> ( temObstaculo == <span style="color:#FBBF24;">true</span> ) {</div>
                            <div class="if-scaffold-line" id="if_n1_line_5" style="padding-left:22px;"><span style="color:#34D399;font-weight:bold;">baixo</span>();    <span style="color:#64748B;">// ⬇️ 1 passo para baixo (entra na faixa de desvio)</span></div>
                            <div class="if-scaffold-line" id="if_n1_line_6" style="padding-left:22px;"><span style="color:#38BDF8;font-weight:bold;">direita</span>();  <span style="color:#64748B;">// ➡️ 1 passo para frente</span></div>
                            <div class="if-scaffold-line" id="if_n1_line_7" style="padding-left:22px;"><span style="color:#38BDF8;font-weight:bold;">direita</span>();  <span style="color:#64748B;">// ➡️ 1 passo contornando a barreira (pega Estrela 🌟)</span></div>
                            <div class="if-scaffold-line" id="if_n1_line_8" style="padding-left:22px;"><span style="color:#38BDF8;font-weight:bold;">direita</span>();  <span style="color:#64748B;">// ➡️ 1 passo avançando no desvio</span></div>
                            <div class="if-scaffold-line" id="if_n1_line_9" style="padding-left:22px;"><span style="color:#34D399;font-weight:bold;">cima</span>();     <span style="color:#64748B;">// ⬆️ 1 passo para cima (retorna à pista principal)</span></div>
                            <div class="if-scaffold-line" id="if_n1_line_10" style="padding-left:22px;"><span style="color:#38BDF8;font-weight:bold;">direita</span>(); <span style="color:#64748B;">// ➡️ 1 passo até o Troféu de Ouro 🏆!</span></div>
                            <div class="if-scaffold-line" id="if_n1_line_11">} <span style="color:#F472B6;font-weight:bold;">else</span> {</div>
                            <div class="if-scaffold-line" id="if_n1_line_12" style="padding-left:22px;"><span style="color:#64748B;">// 🔄 Pista 100% livre! O Laço FOR da Aula 2 repete 4 passos com direita():</span></div>
                            <div class="if-scaffold-line" id="if_n1_line_13" style="padding-left:22px;"><span style="color:#F472B6;font-weight:bold;">for</span> ( <span style="color:#F472B6;font-weight:bold;">int</span> i = 0; i &lt; 4; i++ ) {</div>
                            <div class="if-scaffold-line" id="if_n1_line_14" style="padding-left:44px;"><span style="color:#38BDF8;font-weight:bold;">direita</span>(); <span style="color:#64748B;">// ➡️ Anda 1 passo em linha reta a cada ciclo</span></div>
                            <div class="if-scaffold-line" id="if_n1_line_15" style="padding-left:22px;">}</div>
                            <div class="if-scaffold-line" id="if_n1_line_16">}</div>
                        </div>

                        <div style="margin-top:14px;background:#0F172A;padding:12px;border-radius:12px;border:1px solid #1E293B;">
                            <div style="font-weight:800;color:#6EE7B7;margin-bottom:6px;font-size:0.9rem;">🕹️ Simule o Ambiente Físico na Pista Ampla 3D:</div>
                            <div style="display:flex;gap:10px;flex-wrap:wrap;">
                                <button onclick="if_n1_setObstacle(true)" style="background:#334155;color:#FCA5A5;border:1px solid #EF4444;padding:8px 14px;border-radius:10px;font-weight:800;cursor:pointer;"><i class="fa-solid fa-triangle-exclamation"></i> 🚧 Colocar Barreira no Bloco (2,0)</button>
                                <button onclick="if_n1_setObstacle(false)" style="background:#334155;color:#86EFAC;border:1px solid #10B981;padding:8px 14px;border-radius:10px;font-weight:800;cursor:pointer;"><i class="fa-solid fa-circle-check"></i> 🟢 Liberar Pista (Caminho Livre)</button>
                            </div>
                        </div>

                        <div class="if-actions">
                            <button class="if-btn-run" id="if_n1_btn_run" onclick="if_n1_runTest()"><i class="fa-solid fa-play"></i> EXECUTAR NAVEGAÇÃO DO ROBÔ</button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- ================= ÁREA DOS NÍVEIS 2, 3 E 4 (GRID & IDE) ================= -->
            <div id="if_grid_view" style="display:none;">
                <div class="if-ide-layout">
                    <!-- COLUNA ESQUERDA: EDITOR -->
                    <div class="if-editor-card">
                        <div class="if-editor-topbar">
                            <div class="if-editor-title" id="if_editor_title"><i class="fa-solid fa-code"></i> Bloco de Decisão (C/C++)</div>
                            <div class="if-lang-tag">C/C++</div>
                        </div>

                        <!-- Scaffolding Nível 2 (Sequência Lógica de Comandos com IF / ELSE) -->
                        <div id="if_scaffold_n2" class="if-scaffold-lines">
                            <div style="background:#1E293B;border-left:3px solid #10B981;padding:8px 12px;border-radius:0 8px 8px 0;margin-bottom:12px;color:#34D399;font-size:0.82rem;font-weight:700;">
                                💡 Escolha os comandos da <b>sequência inteligente</b>: use <code>if/else</code> para desviar da barreira e chegar ao 🏆 Tesouro!
                            </div>

                            <!-- 1. Trecho Inicial: Aproximação -->
                            <div class="if-scaffold-line" id="if_n2_line_0"><span style="color:#64748B;">// 1️⃣ Aproximação: Qual comando andar antes do obstáculo?</span></div>
                            <div class="if-scaffold-line" id="if_n2_line_1">
                                <select class="if-select-cmd" id="if_n2_cmd1" onchange="if_updateLiveCpp()">
                                    <option value="" selected disabled>— escolha ação 1 —</option>
                                    <option value="direita">direita(); // Anda 1 bloco para direita</option>
                                    <option value="baixo">baixo();</option>
                                    <option value="esquerda">esquerda();</option>
                                    <option value="cima">cima();</option>
                                </select>
                            </div>

                            <!-- 2. Bloco Condicional com IF/ELSE -->
                            <div class="if-scaffold-line" id="if_n2_line_2" style="margin-top:8px;"><span style="color:#64748B;">// 2️⃣ Sensor & Decisão: O sensor detectou obstáculo à frente?</span></div>
                            <div class="if-scaffold-line" id="if_n2_line_3">
                                <span style="color:#F472B6;font-weight:bold;">if</span> ( <span style="color:#60A5FA;">sensorObstaculo</span>() ) { <span style="color:#64748B;">// ⚠️ Se TRUE (tem barreira):</span>
                            </div>
                            <div class="if-scaffold-line" id="if_n2_line_4" style="padding-left:24px;">
                                <select class="if-select-cmd" id="if_n2_cmd_if" onchange="if_updateLiveCpp()">
                                    <option value="" selected disabled>— escolha ação no IF —</option>
                                    <option value="baixo">baixo(); // ⬇️ Desvia para linha livre</option>
                                    <option value="direita">direita();</option>
                                    <option value="esquerda">esquerda();</option>
                                    <option value="cima">cima();</option>
                                </select>
                            </div>
                            <div class="if-scaffold-line" id="if_n2_line_5">
                                } <span style="color:#F472B6;font-weight:bold;">else</span> { <span style="color:#64748B;">// 🟢 Se FALSE (pista livre):</span>
                            </div>
                            <div class="if-scaffold-line" id="if_n2_line_6" style="padding-left:24px;">
                                <select class="if-select-cmd" id="if_n2_cmd_else" onchange="if_updateLiveCpp()">
                                    <option value="" selected disabled>— escolha ação no ELSE —</option>
                                    <option value="direita">direita(); // ➡️ Segue reto</option>
                                    <option value="baixo">baixo();</option>
                                    <option value="esquerda">esquerda();</option>
                                    <option value="cima">cima();</option>
                                </select>
                            </div>
                            <div class="if-scaffold-line" id="if_n2_line_7">}</div>

                            <!-- 3. Trecho Final: Chegada ao Troféu -->
                            <div class="if-scaffold-line" id="if_n2_line_8" style="margin-top:8px;"><span style="color:#64748B;">// 3️⃣ Reta Final: Qual comando para pegar o 🏆 Tesouro?</span></div>
                            <div class="if-scaffold-line" id="if_n2_line_9">
                                <select class="if-select-cmd" id="if_n2_cmd2" onchange="if_updateLiveCpp()">
                                    <option value="" selected disabled>— escolha ação final —</option>
                                    <option value="direita">direita(); // Pega o troféu 🏆</option>
                                    <option value="baixo">baixo();</option>
                                    <option value="esquerda">esquerda();</option>
                                    <option value="cima">cima();</option>
                                </select>
                            </div>
                        </div>

                        <!-- Scaffolding Nível 3 (Mix FOR + IF/ELSE) -->
                        <div id="if_scaffold_n3" class="if-scaffold-lines" style="display:none;">
                            <div class="if-scaffold-line" id="if_n3_line_1"><span style="color:#64748B;">// 🔄 Laço FOR repetindo a decisão inteligente a cada passo:</span></div>
                            <div class="if-scaffold-line" id="if_n3_line_2">
                                <span style="color:#F472B6;font-weight:bold;">for</span> ( <span style="color:#F472B6;font-weight:bold;">int</span> i = 0; i &lt; 
                                <input type="number" class="if-input-num" id="if_n3_for_count" min="1" max="10" placeholder="?" value="" oninput="if_updateLiveCpp()" onchange="if_updateLiveCpp()" /> ; i++ ) {
                            </div>
                            <div class="if-scaffold-line" id="if_n3_line_3" style="padding-left:24px;">
                                <span style="color:#F472B6;font-weight:bold;">if</span> ( <span style="color:#60A5FA;">sensorObstaculo</span>() ) {
                            </div>
                            <div class="if-scaffold-line" id="if_n3_line_4" style="padding-left:46px;">
                                <select class="if-select-cmd" id="if_n3_act_if" onchange="if_updateLiveCpp()">
                                    <option value="" selected disabled>— escolha ação se barreira —</option>
                                    <option value="baixo">baixo(); // Desvia para linha livre</option>
                                    <option value="direita">direita();</option>
                                    <option value="esquerda">esquerda();</option>
                                    <option value="cima">cima();</option>
                                </select>
                            </div>
                            <div class="if-scaffold-line" id="if_n3_line_5" style="padding-left:24px;">
                                } <span style="color:#F472B6;font-weight:bold;">else</span> {
                            </div>
                            <div class="if-scaffold-line" id="if_n3_line_6" style="padding-left:46px;">
                                <select class="if-select-cmd" id="if_n3_act_else" onchange="if_updateLiveCpp()">
                                    <option value="" selected disabled>— escolha ação se livre —</option>
                                    <option value="direita">direita(); // Caminho livre</option>
                                    <option value="baixo">baixo();</option>
                                    <option value="esquerda">esquerda();</option>
                                    <option value="cima">cima();</option>
                                </select>
                            </div>
                            <div class="if-scaffold-line" id="if_n3_line_7" style="padding-left:24px;">}</div>
                            <div class="if-scaffold-line" id="if_n3_line_8">}</div>
                        </div>

                        <!-- Editor Textarea Nível 4 (Mini-IDE) -->
                        <div id="if_ide_n4" style="display:none;">
                            <!-- Teclado de Atalhos Rápidos (Comandos Direcionais) -->
                            <div class="if-shortcuts-bar">
                                <button class="if-shortcut-btn" onclick="if_insertText('for (int i = 0; i < N; i++) {\n    \n}\n')"><i class="fa-solid fa-arrows-rotate" style="color:#A78BFA;"></i> + for()</button>
                                <button class="if-shortcut-btn" onclick="if_insertText('if (sensorObstaculo()) {\n    baixo();\n} else {\n    direita();\n}\n')">❓ if/else</button>
                                <button class="if-shortcut-btn" onclick="if_insertText('direita();\n')">➡️ direita();</button>
                                <button class="if-shortcut-btn" onclick="if_insertText('baixo();\n')">⬇️ baixo();</button>
                                <button class="if-shortcut-btn" onclick="if_insertText('esquerda();\n')">⬅️ esquerda();</button>
                                <button class="if-shortcut-btn" onclick="if_insertText('cima();\n')">⬆️ cima();</button>
                                <button class="if-shortcut-btn clear" onclick="if_clearIde()"><i class="fa-solid fa-trash"></i> Limpar</button>
                            </div>

                            <div class="if-code-wrapper">
                                <div class="if-line-numbers" id="if_line_numbers">1<br>2<br>3<br>4<br>5<br>6<br>7<br>8</div>
                                <textarea class="if-code-input" id="if_code_input" spellcheck="false" placeholder="// 🤖 Digite seu código C/C++ aqui!
// Comandos disponíveis: direita(); baixo(); esquerda(); cima();
// Laço e Condicional:
// for (int i = 0; i < N; i++) {
//     if (sensorObstaculo()) { ... } else { ... }
// }" oninput="if_handleIdeInput()" onscroll="document.getElementById('if_line_numbers').scrollTop = this.scrollTop;"></textarea>
                            </div>

                            <div class="if-syntax-card" style="background:#0F172A;border:1px dashed #10B981;border-radius:12px;padding:10px 14px;margin-top:10px;font-size:0.82rem;color:#CBD5E1;">
                                <b>📖 Guia de Comandos Maker:</b>
                                <code style="background:#1E293B;color:#38BDF8;padding:2px 6px;border-radius:4px;">direita();</code>, 
                                <code style="background:#1E293B;color:#38BDF8;padding:2px 6px;border-radius:4px;">baixo();</code>, 
                                <code style="background:#1E293B;color:#38BDF8;padding:2px 6px;border-radius:4px;">esquerda();</code>, 
                                <code style="background:#1E293B;color:#38BDF8;padding:2px 6px;border-radius:4px;">cima();</code>, 
                                <code style="background:#1E293B;color:#34D399;padding:2px 6px;border-radius:4px;">sensorObstaculo()</code>.
                            </div>
                        </div>

                        <!-- Botão de Ver Solução / Dica (Aparece apenas após 3 erros) -->
                        <button class="if-btn-solution" id="if_btn_view_sol" onclick="if_toggleSolution()" style="display:none;">
                            <i class="fa-solid fa-lightbulb"></i> <span>💡 Ver Código da Resolução</span>
                        </button>
                        <div class="if-solution-card" id="if_solution_box">
                            <div style="font-weight:900;color:#FBBF24;margin-bottom:6px;font-size:0.88rem;">📋 Código C/C++ da Solução:</div>
                            <pre id="if_solution_text" style="margin:0;background:#030712;padding:10px;border-radius:8px;border:1px solid #F59E0B;color:#FDE68A;font-family:'Fira Code',monospace;font-size:0.82rem;white-space:pre-wrap;"></pre>
                        </div>

                        <!-- Botões de Execução -->
                        <div class="if-actions">
                            <button class="if-btn-run" id="if_btn_run_grid" onclick="if_runGrid()"><i class="fa-solid fa-play"></i> EXECUTAR DECISÃO IF/ELSE</button>
                            <button class="if-btn-reset" onclick="if_resetBoard()"><i class="fa-solid fa-rotate-left"></i></button>
                        </div>
                    </div>

                    <!-- COLUNA DIREITA: SIMULAÇÃO DO TABULEIRO / GRID -->
                    <div class="if-sim-card">
                        <div class="if-sim-topbar">
                            <div class="if-sim-title"><i class="fa-solid fa-map-location-dot"></i> Labirinto com Barreiras</div>
                            <div class="if-sim-hud" id="if_grid_hud">Sensor: 🟢 Livre</div>
                        </div>

                        <div class="if-board" id="if_board_grid"></div>
                    </div>
                </div>
            </div>

            <!-- PAINEL CÓDIGO C++ REAL (FUNÇÕES E CONTROLE DO ROBÔ) -->
            <div class="arduino-code-panel" style="background:#0F172A;border:2px solid #10B981;border-radius:16px;padding:15px;margin-top:15px;">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
                    <span style="font-weight:900;color:#34D399;font-size:0.95rem;"><i class="fa-solid fa-code"></i> Código C/C++ do Robô Maker</span>
                    <button onclick="if_copyCode()" style="background:#334155;color:#34D399;border:1px solid #10B981;padding:4px 12px;border-radius:8px;font-size:0.8rem;font-weight:800;cursor:pointer;"><i class="fa-regular fa-copy"></i> Copiar C++</button>
                </div>
                <pre id="if_arduino_code" style="margin:0;color:#E2E8F0;font-family:'Fira Code', monospace;font-size:0.85rem;line-height:1.45;white-space:pre-wrap;overflow-x:auto;"></pre>
            </div>
        </div>

        <!-- MODAL DE VITÓRIA -->
        <div class="if-modal" id="if_win_modal">
            <div class="if-modal-box">
                <div class="if-modal-icon" id="if_modal_icon">🏆</div>
                <h2 class="if-modal-title" id="if_modal_title">Excelente Decisão!</h2>
                <p class="if-modal-text" id="if_modal_text">O robô detectou as barreiras e usou o IF/ELSE perfeitamente!</p>
                <button class="if-btn-modal" onclick="if_closeWinModal()">Avançar para o Próximo Nível 🚀</button>
            </div>
        </div>
    `;

    // Inicializa o sistema do jogo
    if_init();

    // Flag de carregamento
    document.getElementById('jardim-loaded')?.remove();
    const flag = document.createElement('div'); 
    flag.id = 'jardim-loaded'; 
    flag.style.display = 'none'; 
    container.appendChild(flag);
}

// ================= ESTADO GLOBAL DO MÓDULO IF / ELSE =================
let if_currentLevel = 1;
let if_currentGuideSlide = 1;
let if_guideCollapsed = false;
let if_isRunning = false;
let if_n1_hasObstacle = true;
let if_robotPos = { x: 0, y: 0 };
let if_targetPos = { x: 0, y: 0 };
let if_gridSize = 5;
let if_obstacles = [];
let if_coins = [];

// Configuração dos Níveis com comandos direcionais padronizados (direita, baixo, esquerda, cima)
const if_levelConfigs = {
    1: {
        title: 'Nível 1: Sensor Óptico & Ultrassônico',
        desc: 'Entenda a decisão de <b>1 passo</b>: se o sensor detectar barreira (<code>true</code>), o robô executa <code>baixo();</code> (1 passo para desvio); se a pista estiver livre (<code>false</code>), executa <code>direita();</code> (1 passo até o troféu)!',
        solutionCode: `// Solução Nível 1 (Sensor & Decisão de 1 Passo):\nbool temObstaculo = sensorObstaculo();\nif (temObstaculo == true) {\n    baixo();    // Anda 1 passo para baixo (coleta Estrela 🌟)\n} else {\n    direita();  // Anda 1 passo para a direita (coleta Troféu 🏆)\n}`
    },
    2: {
        title: 'Nível 2: Sequência com Decisão IF / ELSE',
        desc: 'Monte uma <b>sequência inteligente</b>: use comandos direcionais e uma estrutura <code>if / else</code> para detectar a barreira com o sensor e desviar até o 🏆 Tesouro!',
        gridSize: 4,
        start: { x: 0, y: 1 },
        target: { x: 2, y: 2 },
        obstacles: [{ x: 2, y: 1 }],
        coins: [{ x: 1, y: 2 }],
        solutionCode: `// Solução Nível 2 (Sequência com Decisão IF/ELSE):\n// 1️⃣ Aproximação:\ndireita();\n\n// 2️⃣ Sensor & Decisão Inteligente:\nif (sensorObstaculo()) {\n    baixo();    // ⚠️ Desvia da barreira (TRUE)\n} else {\n    direita();  // 🟢 Pista livre (FALSE)\n}\n\n// 3️⃣ Reta final até o troféu 🏆:\ndireita();`
    },
    3: {
        title: 'Nível 3: Mix Laço FOR + IF / ELSE (Automação de 5 Passos)',
        desc: 'Para andar múltiplos passos, usamos o <b>Laço FOR</b> da Aula 2! O laço repete a cada ciclo: verifica o <code>sensorObstaculo()</code> e anda 1 bloco para <code>baixo();</code> (se barreira) ou <code>direita();</code> (se livre)!',
        gridSize: 6,
        start: { x: 0, y: 1 },
        target: { x: 4, y: 2 },
        obstacles: [{ x: 2, y: 1 }],
        coins: [{ x: 2, y: 2 }, { x: 3, y: 2 }],
        solutionCode: `// Solução Nível 3 (Laço FOR de 5 repetições com IF/ELSE):\nfor (int i = 0; i < 5; i++) {\n    if (sensorObstaculo()) {\n        baixo();    // Anda 1 bloco para baixo\n    } else {\n        direita();  // Anda 1 bloco para a direita\n    }\n}`
    },
    4: {
        title: 'Nível 4: Mini-IDE C/C++ (Código Digitado)',
        desc: 'Desafio Maker Final! Escreva seu código C/C++ usando <code>for</code>, <code>if/else</code> e comandos de direção (<code>direita()</code>, <code>baixo()</code>, <code>esquerda()</code>, <code>cima()</code>)! Cada comando anda <b>exatamente 1 bloco</b>.',
        gridSize: 6,
        start: { x: 0, y: 1 },
        target: { x: 4, y: 2 },
        obstacles: [{ x: 2, y: 1 }],
        coins: [{ x: 2, y: 2 }, { x: 3, y: 2 }],
        solutionCode: `// Solução Nível 4 (Mini-IDE C/C++):\nfor (int i = 0; i < 5; i++) {\n    if (sensorObstaculo()) {\n        baixo();\n    } else {\n        direita();\n    }\n}`
    }
};

function if_init() {
    if_switchGuideTab(1);
    if_updateDemoEval();
    if_switchLevel(1);
    if_updateLiveCpp();
}

// ================= CONTROLES DO GUIA INTERATIVO DE ESTUDOS =================
function if_switchGuideTab(slideNum) {
    if_currentGuideSlide = slideNum;
    
    // Atualiza abas
    for(let i=1; i<=4; i++) {
        const tab = document.getElementById('if_tab_g' + i);
        const slide = document.getElementById('if_slide_' + i);
        const dot = document.getElementById('if_dot_' + i);
        if(tab) tab.classList.toggle('active', i === slideNum);
        if(slide) slide.classList.toggle('active', i === slideNum);
        if(dot) dot.classList.toggle('active', i === slideNum);
    }

    // Atualiza botões de navegação
    const prevBtn = document.getElementById('if_guide_prev_btn');
    const nextBtn = document.getElementById('if_guide_next_btn');
    if(prevBtn) prevBtn.disabled = (slideNum === 1);
    if(nextBtn) {
        if(slideNum === 4) {
            nextBtn.innerHTML = 'Iniciar Desafios <i class="fa-solid fa-play"></i>';
        } else {
            nextBtn.innerHTML = 'Próximo <i class="fa-solid fa-arrow-right"></i>';
        }
    }
}

function if_nextGuideSlide() {
    if(if_currentGuideSlide < 4) {
        playSound('click');
        if_switchGuideTab(if_currentGuideSlide + 1);
    } else {
        playSound('success');
        // Scroll suave até os níveis
        document.querySelector('.if-level-bar')?.scrollIntoView({ behavior: 'smooth' });
    }
}

function if_prevGuideSlide() {
    if(if_currentGuideSlide > 1) {
        playSound('click');
        if_switchGuideTab(if_currentGuideSlide - 1);
    }
}

function if_toggleGuide() {
    playSound('click');
    const card = document.getElementById('if_guide_card');
    const txt = document.getElementById('if_guide_toggle_txt');
    if(!card || !txt) return;
    
    if_guideCollapsed = !if_guideCollapsed;
    if(if_guideCollapsed) {
        card.style.display = 'none';
        txt.innerText = 'Mostrar Guia Teórico';
    } else {
        card.style.display = 'block';
        txt.innerText = 'Ocultar Guia Teórico';
    }
}

function if_switchLevel(level) {
    if (if_isRunning) return;
    if_currentLevel = level;
    
    // Atualiza botões da barra
    for(let i=1; i<=4; i++) {
        const b = document.getElementById('if_btn_lvl_' + i);
        if(b) {
            b.classList.remove('active');
            let saved = getLevels('jardim_levels');
            if(saved.includes(i)) {
                b.classList.add('done');
                const star = b.querySelector('.if-lvl-status');
                if(star) star.innerHTML = '<i class="fa-solid fa-star" style="color:#FBBF24;"></i>';
            }
        }
    }
    document.getElementById('if_btn_lvl_' + level)?.classList.add('active');

    const config = if_levelConfigs[level];
    const descEl = document.getElementById('if-header-desc');
    if(descEl) descEl.innerHTML = config.desc;

    const n1View = document.getElementById('if_level_1_view');
    const gridView = document.getElementById('if_grid_view');
    const scaffoldN2 = document.getElementById('if_scaffold_n2');
    const scaffoldN3 = document.getElementById('if_scaffold_n3');
    const ideN4 = document.getElementById('if_ide_n4');

    // Reseta caixa de solução e sincroniza estado de bloqueio (3 erros)
    const solBox = document.getElementById('if_solution_box');
    if (solBox) solBox.classList.remove('visible');
    const solText = document.getElementById('if_solution_text');
    if (solText && config.solutionCode) solText.innerText = config.solutionCode;
    if_updateSolutionButtonState();

    if(level === 1) {
        if(n1View) n1View.style.display = 'block';
        if(gridView) gridView.style.display = 'none';
        if_n1_reset();
    } else {
        if(n1View) n1View.style.display = 'none';
        if(gridView) gridView.style.display = 'block';

        if(scaffoldN2) scaffoldN2.style.display = level === 2 ? 'block' : 'none';
        if(scaffoldN3) scaffoldN3.style.display = level === 3 ? 'block' : 'none';
        if(ideN4) ideN4.style.display = level === 4 ? 'block' : 'none';

        if(level === 4) {
            if_handleIdeInput();
        }

        if_initBoard(config);
    }
    if_updateLiveCpp();
}

function if_updateSolutionButtonState() {
    const btn = document.getElementById('if_btn_view_sol');
    const solBox = document.getElementById('if_solution_box');
    const attempts = currentAttemptsMap['if_lvl_' + if_currentLevel] || 0;
    if(!btn) return;

    if (attempts >= 3) {
        btn.style.display = 'flex';
        btn.disabled = false;
        btn.innerHTML = '<i class="fa-solid fa-lightbulb"></i> <span>💡 Precisa de Ajuda? Ver Resolução</span>';
        btn.style.background = 'linear-gradient(135deg, #D97706, #B45309)';
        btn.style.borderColor = '#F59E0B';
        btn.style.color = '#FFFFFF';
        btn.style.cursor = 'pointer';
        btn.style.opacity = '1';
    } else {
        btn.style.display = 'none';
        btn.disabled = true;
        if (solBox) solBox.classList.remove('visible');
    }
}

function if_toggleSolution() {
    const attempts = currentAttemptsMap['if_lvl_' + if_currentLevel] || 0;
    if (attempts < 3) {
        playSound('error');
        return;
    }
    const solBox = document.getElementById('if_solution_box');
    if(!solBox) return;
    if(solBox.classList.contains('visible')) {
        solBox.classList.remove('visible');
    } else {
        solBox.classList.add('visible');
        playSound('click');
    }
}

// ================= TESTADOR INTERATIVO DE CONDICIONAIS & BOOL =================
function if_updateDemoEval() {
    const slider = document.getElementById('if_demo_dist_slider');
    const valEl = document.getElementById('if_demo_dist_val');
    const exprEl = document.getElementById('if_demo_expr');
    const resEl = document.getElementById('if_demo_bool_res');
    const tagEl = document.getElementById('if_demo_branch_tag');
    const wallEl = document.getElementById('if_demo_wall');
    const beamEl = document.getElementById('if_demo_sonar_beam');
    if(!slider || !valEl || !exprEl || !resEl || !tagEl) return;

    const dist = parseInt(slider.value) || 12;
    valEl.innerText = dist + ' cm';

    // Move a barreira física no palco do simulador (5cm a 45cm)
    const minLeft = 100;
    const maxLeft = 320;
    const currentLeft = minLeft + ((dist - 5) / (45 - 5)) * (maxLeft - minLeft);
    
    if(wallEl) {
        wallEl.style.left = currentLeft + 'px';
    }
    if(beamEl) {
        const beamWidth = Math.max(0, currentLeft - 80);
        beamEl.style.width = beamWidth + 'px';
    }

    const isTrue = (dist < 20);
    exprEl.innerText = `distancia < 20 (${dist} < 20)`;
    resEl.innerText = isTrue ? 'true' : 'false';
    resEl.style.color = isTrue ? '#F87171' : '#34D399';

    if(beamEl) {
        if(isTrue) {
            beamEl.style.background = 'repeating-linear-gradient(90deg, rgba(239,68,68,0.3) 0px, rgba(239,68,68,0.7) 10px, transparent 10px, transparent 18px)';
        } else {
            beamEl.style.background = 'repeating-linear-gradient(90deg, rgba(16,185,129,0.3) 0px, rgba(16,185,129,0.7) 10px, transparent 10px, transparent 18px)';
        }
    }

    if(isTrue) {
        tagEl.style.background = 'rgba(239,68,68,0.2)';
        tagEl.style.color = '#F87171';
        tagEl.style.borderColor = '#EF4444';
        tagEl.innerHTML = '🚨 BARREIRA DETECTADA! (Executa o IF para desviar)';
    } else {
        tagEl.style.background = 'rgba(16,185,129,0.2)';
        tagEl.style.color = '#34D399';
        tagEl.style.borderColor = '#10B981';
        tagEl.innerHTML = '🟢 PISTA LIVRE! (Pula para o ELSE para seguir reto)';
    }
}

// ================= NÍVEL 1: SENSOR ÓPTICO/ULTRASSÔNICO NA PISTA GRANDE (3D) =================
function if_n1_reset() {
    const robot = document.getElementById('if_n1_robot');
    // Limpa destaques nos 10 ladrilhos 3D (5x2)
    for(let r=0; r<2; r++) {
        for(let c=0; c<5; c++) {
            document.getElementById(`if_tile_${c}_${r}`)?.classList.remove('highlight');
        }
    }
    document.getElementById('if_tile_0_0')?.classList.add('highlight');

    if(robot) {
        robot.style.transition = 'none';
        robot.style.top = '5px';
        robot.style.left = '8px';
        setTimeout(() => { robot.style.transition = 'all 0.45s cubic-bezier(0.25, 1, 0.5, 1)'; }, 50);
    }
    if_n1_setObstacle(if_n1_hasObstacle);
}

function if_n1_setObstacle(has) {
    if_n1_hasObstacle = has;
    const obs = document.getElementById('if_n1_obstacle');
    const target = document.getElementById('if_n1_target');
    const star = document.getElementById('if_n1_star');
    const beam = document.getElementById('if_sensor_beam');
    const reading = document.getElementById('if_sensor_reading_text');

    if(has) {
        if(obs) obs.style.display = 'block';
        if(target) target.style.display = 'block';
        if(star) star.style.display = 'block';
        if(beam) {
            beam.className = 'if-3d-laser detect';
            beam.style.display = 'block';
            beam.style.width = '130px';
        }
        if(reading) {
            reading.innerText = 'BARREIRA (true)';
            reading.style.color = '#EF4444';
        }
    } else {
        if(obs) obs.style.display = 'none';
        if(target) target.style.display = 'block';
        if(star) star.style.display = 'none';
        if(beam) {
            beam.className = 'if-3d-laser clear';
            beam.style.display = 'block';
            beam.style.width = '320px';
        }
        if(reading) {
            reading.innerText = 'PISTA LIVRE (false)';
            reading.style.color = '#34D399';
        }
    }
    if_updateLiveCpp();
}

async function if_n1_runTest() {
    if(if_isRunning) return;
    if_isRunning = true;
    playSound('click');

    const robot = document.getElementById('if_n1_robot');
    const beam = document.getElementById('if_sensor_beam');
    const btn = document.getElementById('if_n1_btn_run');
    if(btn) { btn.disabled = true; btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> NAVEGANDO...'; }

    // Reseta posição e ilumina início (0,0)
    for(let r=0; r<2; r++) {
        for(let c=0; c<5; c++) {
            document.getElementById(`if_tile_${c}_${r}`)?.classList.remove('highlight');
        }
    }
    document.getElementById('if_tile_0_0')?.classList.add('highlight');

    if(robot) {
        robot.style.top = '5px';
        robot.style.left = '8px';
    }
    if(beam) beam.style.display = 'block';

    // 1. Destaque de linha: Leitura do sensor ultrassônico na variável bool
    document.getElementById('if_n1_line_2')?.classList.add('active');
    playSound('step');
    await if_sleep(600);
    document.getElementById('if_n1_line_2')?.classList.remove('active');

    // 2. Checagem da condição if (temObstaculo == true)
    document.getElementById('if_n1_line_4')?.classList.add('active');
    await if_sleep(500);

    if(if_n1_hasObstacle) {
        // ENTRA NO BLOCO IF -> Condição verdadeira (tem obstáculo à frente!)
        if(beam) beam.style.display = 'none';

        // Passo 1: baixo() -> desce para (0,1)
        document.getElementById('if_n1_line_5')?.classList.add('active');
        playSound('step');
        if(robot) { robot.style.top = '108px'; robot.style.left = '8px'; }
        document.getElementById('if_tile_0_1')?.classList.add('highlight');
        await if_sleep(450);
        document.getElementById('if_n1_line_5')?.classList.remove('active');

        // Passo 2: direita() -> avança para (1,1)
        document.getElementById('if_n1_line_6')?.classList.add('active');
        playSound('step');
        if(robot) { robot.style.top = '108px'; robot.style.left = '108px'; }
        document.getElementById('if_tile_1_1')?.classList.add('highlight');
        await if_sleep(450);
        document.getElementById('if_n1_line_6')?.classList.remove('active');

        // Passo 3: direita() -> contorna barreira em (2,1) e coleta a Estrela 🌟
        document.getElementById('if_n1_line_7')?.classList.add('active');
        playSound('step');
        if(robot) { robot.style.top = '108px'; robot.style.left = '206px'; }
        document.getElementById('if_tile_2_1')?.classList.add('highlight');
        const star = document.getElementById('if_n1_star');
        if(star) star.style.display = 'none';
        playSound('coin');
        await if_sleep(450);
        document.getElementById('if_n1_line_7')?.classList.remove('active');

        // Passo 4: direita() -> avança no desvio para (3,1)
        document.getElementById('if_n1_line_8')?.classList.add('active');
        playSound('step');
        if(robot) { robot.style.top = '108px'; robot.style.left = '304px'; }
        document.getElementById('if_tile_3_1')?.classList.add('highlight');
        await if_sleep(450);
        document.getElementById('if_n1_line_8')?.classList.remove('active');

        // Passo 5: cima() -> sobe de volta para a pista principal em (3,0)
        document.getElementById('if_n1_line_9')?.classList.add('active');
        playSound('step');
        if(robot) { robot.style.top = '5px'; robot.style.left = '304px'; }
        document.getElementById('if_tile_3_0')?.classList.add('highlight');
        await if_sleep(450);
        document.getElementById('if_n1_line_9')?.classList.remove('active');

        // Passo 6: direita() -> alcança o Troféu de Ouro 🏆 em (4,0)
        document.getElementById('if_n1_line_10')?.classList.add('active');
        playSound('step');
        if(robot) { robot.style.top = '5px'; robot.style.left = '402px'; }
        document.getElementById('if_tile_4_0')?.classList.add('highlight');
        await if_sleep(500);
        document.getElementById('if_n1_line_10')?.classList.remove('active');

        document.getElementById('if_n1_line_4')?.classList.remove('active');
    } else {
        // ENTRA NO BLOCO ELSE -> Condição falsa (pista desimpedida!)
        document.getElementById('if_n1_line_4')?.classList.remove('active');
        document.getElementById('if_n1_line_11')?.classList.add('active');
        document.getElementById('if_n1_line_13')?.classList.add('active');
        if(beam) beam.style.display = 'none';

        // Laço FOR repetindo direita() 4 vezes:
        const xPositions = ['108px', '206px', '304px', '402px'];
        for(let i=0; i<4; i++) {
            document.getElementById('if_n1_line_14')?.classList.add('active');
            playSound('step');
            if(robot) { robot.style.top = '5px'; robot.style.left = xPositions[i]; }
            document.getElementById(`if_tile_${i+1}_0`)?.classList.add('highlight');
            await if_sleep(420);
            document.getElementById('if_n1_line_14')?.classList.remove('active');
        }

        document.getElementById('if_n1_line_11')?.classList.remove('active');
        document.getElementById('if_n1_line_13')?.classList.remove('active');
    }

    // Sucesso e Recompensa
    playSound('success');
    triggerConfetti(2800);
    if_saveLevelDone(1);
    if_showWinModal('🏆', 'Navegação e Decisão Perfeitas!', 'Você viu na prática como variáveis bool, condicionais if/else e movimentos direcionais guiam o robô pela pista ampla!');

    if(btn) { btn.disabled = false; btn.innerHTML = '<i class="fa-solid fa-play"></i> EXECUTAR NAVEGAÇÃO DO ROBÔ'; }
    if_isRunning = false;
}

// ================= TABULEIRO / GRID ENGINE (NÍVEIS 2, 3 E 4) =================
function if_initBoard(config) {
    if_gridSize = config.gridSize;
    if_robotPos = { ...config.start };
    if_targetPos = { ...config.target };
    if_obstacles = JSON.parse(JSON.stringify(config.obstacles));
    if_coins = JSON.parse(JSON.stringify(config.coins));

    const board = document.getElementById('if_board_grid');
    if(!board) return;
    board.style.gridTemplateColumns = `repeat(${if_gridSize}, 1fr)`;
    board.style.gridTemplateRows = `repeat(${if_gridSize}, 1fr)`;

    const hud = document.getElementById('if_grid_hud');
    if (hud) {
        hud.className = 'if-sim-hud';
        hud.innerHTML = 'Sensor: 🟢 Livre';
    }

    if_renderBoard();
}

function if_renderBoard(moving = false, crash = false, win = false, sonar = false) {
    const board = document.getElementById('if_board_grid');
    if(!board) return;
    board.innerHTML = '';

    const robotSVG = `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="25" y="30" width="50" height="42" rx="10" fill="#10B981" stroke="#047857" stroke-width="4"/>
        <circle cx="40" cy="48" r="6" fill="#0F172A"/><circle cx="60" cy="48" r="6" fill="#0F172A"/>
        <circle cx="42" cy="46" r="2" fill="#38BDF8"/><circle cx="62" cy="46" r="2" fill="#38BDF8"/>
        <rect x="38" y="60" width="24" height="4" rx="2" fill="#047857"/>
        <line x1="50" y1="30" x2="50" y2="15" stroke="#10B981" stroke-width="4" stroke-linecap="round"/>
        <circle cx="50" cy="12" r="5" fill="#F59E0B"/>
        <rect x="15" y="42" width="10" height="20" rx="4" fill="#047857"/>
        <rect x="75" y="42" width="10" height="20" rx="4" fill="#047857"/>
    </svg>`;

    for(let y = 0; y < if_gridSize; y++) {
        for(let x = 0; x < if_gridSize; x++) {
            const cell = document.createElement('div');
            cell.className = 'if-cell';
            cell.id = `if_cell_${x}_${y}`;

            const isRobot = (if_robotPos.x === x && if_robotPos.y === y);
            const isTarget = (if_targetPos.x === x && if_targetPos.y === y);
            const isObs = if_obstacles.some(o => o.x === x && o.y === y);
            const isCoin = if_coins.some(c => c.x === x && c.y === y);

            if(isObs) cell.classList.add('barrier');
            else if(isCoin) cell.classList.add('coin');
            else if(isTarget) cell.classList.add('chest');

            if(isRobot) {
                cell.classList.add('robot');
                if(moving) cell.classList.add('moving');
                if(sonar) cell.classList.add('sonar');
                if(crash) cell.classList.add('crash');
                if(win) cell.classList.add('win');
                cell.innerHTML = robotSVG;
            }

            board.appendChild(cell);
        }
    }
}

function if_resetBoard() {
    if(if_isRunning) return;
    const config = if_levelConfigs[if_currentLevel];
    if(config && if_currentLevel > 1) if_initBoard(config);
}

function if_checkObstacleAhead(pos) {
    const nextX = pos.x + 1;
    const nextY = pos.y;
    return if_obstacles.some(o => o.x === nextX && o.y === nextY);
}

// Executa um comando direcional atômico no grid (1 bloco de deslocamento)
async function if_execDirection(dir) {
    let nextX = if_robotPos.x;
    let nextY = if_robotPos.y;

    if (dir === 'direita' || dir === 'RIGHT') nextX += 1;
    else if (dir === 'baixo' || dir === 'DOWN') nextY += 1;
    else if (dir === 'esquerda' || dir === 'LEFT') nextX -= 1;
    else if (dir === 'cima' || dir === 'UP') nextY -= 1;

    // Checa colisão com barreira
    if (if_obstacles.some(o => o.x === nextX && o.y === nextY)) {
        if_robotPos = { x: nextX, y: nextY };
        if_renderBoard(false, true, false, false);
        return { success: false, reason: 'crash_obstacle' };
    }

    // Checa colisão com limites do grid
    if (nextX < 0 || nextX >= if_gridSize || nextY < 0 || nextY >= if_gridSize) {
        return { success: false, reason: 'out_of_bounds' };
    }

    // Movimento com sucesso de 1 bloco
    if_robotPos = { x: nextX, y: nextY };
    if_coins = if_coins.filter(c => !(c.x === if_robotPos.x && c.y === if_robotPos.y));
    if_renderBoard(true);
    playSound('step');
    await if_sleep(350);

    return { success: true };
}

// ================= EXECUÇÃO PRECISA E ROBUSTA DOS NÍVEIS 2, 3 E 4 =================
async function if_runGrid() {
    if(if_isRunning) return;
    if_isRunning = true;
    playSound('click');

    const config = if_levelConfigs[if_currentLevel];
    if_initBoard(config);

    const btn = document.getElementById('if_btn_run_grid');
    if(btn) { btn.disabled = true; btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> EXECUTANDO...'; }

    // ================= EXECUÇÃO DO NÍVEL 2: SEQUÊNCIA COM DECISÃO IF/ELSE =================
    if(if_currentLevel === 2) {
        const cmd1 = document.getElementById('if_n2_cmd1')?.value;
        const cmdIf = document.getElementById('if_n2_cmd_if')?.value;
        const cmdElse = document.getElementById('if_n2_cmd_else')?.value;
        const cmd2 = document.getElementById('if_n2_cmd2')?.value;

        if(!cmd1 || !cmdIf || !cmdElse || !cmd2) {
            if(btn) { btn.disabled = false; btn.innerHTML = '<i class="fa-solid fa-play"></i> EXECUTAR DECISÃO IF/ELSE'; }
            if_isRunning = false;
            triggerErrorSplash(
                'Preencha as Ações (?)',
                'Você precisa selecionar a ação em cada menu dropdown antes de executar o código!',
                'Dica: escolha ações como direita(), baixo(), etc. nos 4 menus!',
                '❓',
                config.solutionCode,
                'if_lvl_2',
                3
            );
            return;
        }

        let crashed = false;

        // 1️⃣ Aproximação: Linha 1
        document.getElementById('if_n2_line_1')?.classList.add('active');
        let r1 = await if_execDirection(cmd1);
        document.getElementById('if_n2_line_1')?.classList.remove('active');
        if(!r1.success) {
            crashed = true;
            if(r1.reason === 'crash_obstacle') {
                triggerErrorSplash('Ops! Robô bateu na Barreira! 💥', 'O robô colidiu no trecho de aproximação.', 'Use direita() para avançar até perto da barreira!', '🚧', config.solutionCode, 'if_lvl_2', 3);
            } else {
                triggerErrorSplash('Robô saiu do Tabuleiro!', 'O robô andou além dos limites na etapa 1.', 'Escolha a direção correta.', '⚠️', config.solutionCode, 'if_lvl_2', 3);
            }
        }

        if(crashed) {
            if(btn) { btn.disabled = false; btn.innerHTML = '<i class="fa-solid fa-play"></i> EXECUTAR DECISÃO IF/ELSE'; }
            if_isRunning = false;
            return;
        }

        // 2️⃣ Sensor & Decisão Condicional: Linha 3 (if (sensorObstaculo()))
        document.getElementById('if_n2_line_3')?.classList.add('active');
        const hasObstacle = if_checkObstacleAhead(if_robotPos);
        const hud = document.getElementById('if_grid_hud');
        if(hud) {
            hud.className = hasObstacle ? 'if-sim-hud warning' : 'if-sim-hud';
            hud.innerHTML = hasObstacle ? 'Sensor: 🔴 Barreira Detectada!' : 'Sensor: 🟢 Caminho Livre';
        }
        if_renderBoard(false, false, false, true); // Efeito Sonar
        playSound('step');
        await if_sleep(450);
        document.getElementById('if_n2_line_3')?.classList.remove('active');

        if(hasObstacle) {
            // Executa o bloco IF (Linha 4)
            document.getElementById('if_n2_line_4')?.classList.add('active');
            let rIf = await if_execDirection(cmdIf);
            document.getElementById('if_n2_line_4')?.classList.remove('active');
            if(!rIf.success) {
                crashed = true;
                if(rIf.reason === 'crash_obstacle') {
                    triggerErrorSplash('Ops! Robô bateu na Barreira! 💥', 'O robô tentou avançar direto contra o obstáculo no bloco IF.', 'Configure o IF para baixo() para desviar com segurança!', '🚧', config.solutionCode, 'if_lvl_2', 3);
                } else {
                    triggerErrorSplash('Robô saiu do Tabuleiro!', 'O desvio do IF ultrapassou os limites do tabuleiro.', 'Ajuste a direção do IF para baixo()!', '⚠️', config.solutionCode, 'if_lvl_2', 3);
                }
            }
        } else {
            // Executa o bloco ELSE (Linha 6)
            document.getElementById('if_n2_line_6')?.classList.add('active');
            let rElse = await if_execDirection(cmdElse);
            document.getElementById('if_n2_line_6')?.classList.remove('active');
            if(!rElse.success) {
                crashed = true;
                triggerErrorSplash('Movimento Inválido no ELSE!', 'O robô colidiu ou saiu do tabuleiro no bloco ELSE.', 'Ajuste a direção no ELSE.', '⚠️', config.solutionCode, 'if_lvl_2', 3);
            }
        }

        if(crashed) {
            if(btn) { btn.disabled = false; btn.innerHTML = '<i class="fa-solid fa-play"></i> EXECUTAR DECISÃO IF/ELSE'; }
            if_isRunning = false;
            return;
        }

        // 3️⃣ Reta final até o troféu: Linha 9
        document.getElementById('if_n2_line_9')?.classList.add('active');
        let rFinal = await if_execDirection(cmd2);
        document.getElementById('if_n2_line_9')?.classList.remove('active');
        if(!rFinal.success) {
            crashed = true;
            triggerErrorSplash('Colisão na Reta Final!', 'O robô colidiu ou saiu dos limites no trecho final.', 'Ajuste o comando final para direita() até o troféu.', '⚠️', config.solutionCode, 'if_lvl_2', 3);
        }

        if(!crashed) {
            if(if_robotPos.x === if_targetPos.x && if_robotPos.y === if_targetPos.y) {
                if_renderBoard(false, false, true, false);
                playSound('success');
                triggerConfetti(3000);
                if_saveLevelDone(2);
                if_showWinModal('🏆', 'Sequência e Decisão Perfeitas!', 'Excelente! Você programou a sequência exata de aproximação, desvio no IF e reta final até o troféu sem precisar de repetições desnecessárias!');
            } else {
                triggerErrorSplash(
                    'Quase lá!',
                    'O robô completou os 3 movimentos da sequência, mas não terminou na célula do troféu 🏆.',
                    'Dica: 1º direita(), no IF desvia para baixo(), e no final direita() até o troféu!',
                    '🧭',
                    config.solutionCode,
                    'if_lvl_2',
                    3
                );
            }
        }

        if(btn) { btn.disabled = false; btn.innerHTML = '<i class="fa-solid fa-play"></i> EXECUTAR DECISÃO IF/ELSE'; }
        if_isRunning = false;
        return;
    }

    // ================= EXECUÇÃO DO NÍVEL 3 (MIX LAÇO FOR + IF/ELSE) =================
    if(if_currentLevel === 3) {
        const countStr = document.getElementById('if_n3_for_count')?.value;
        const actIf = document.getElementById('if_n3_act_if')?.value;
        const actElse = document.getElementById('if_n3_act_else')?.value;

        if(!countStr || !actIf || !actElse) {
            if(btn) { btn.disabled = false; btn.innerHTML = '<i class="fa-solid fa-play"></i> EXECUTAR DECISÃO IF/ELSE'; }
            if_isRunning = false;
            triggerErrorSplash(
                'Preencha os Campos (?)',
                'Defina a quantidade de voltas do laço FOR (?) e escolha as ações para IF e ELSE nos menus antes de executar!',
                'Dica: digite a quantidade de iterações e selecione as direções nos menus!',
                '❓',
                config.solutionCode,
                'if_lvl_3',
                3
            );
            return;
        }

        const loopCount = parseInt(countStr) || 5;

        let crashed = false;

        for(let cycle = 0; cycle < loopCount; cycle++) {
            // Se já chegou no troféu, celebra!
            if(if_robotPos.x === if_targetPos.x && if_robotPos.y === if_targetPos.y) {
                break;
            }

            // Destaque do laço FOR
            document.getElementById('if_n3_line_2')?.classList.add('active');
            await if_sleep(250);
            document.getElementById('if_n3_line_2')?.classList.remove('active');

            // Leitura do sensor
            document.getElementById('if_n3_line_3')?.classList.add('active');
            const hasObstacle = if_checkObstacleAhead(if_robotPos);
            const hud = document.getElementById('if_grid_hud');
            if(hud) {
                hud.className = hasObstacle ? 'if-sim-hud warning' : 'if-sim-hud';
                hud.innerHTML = hasObstacle ? `Iteração ${cycle+1}: 🔴 Barreira!` : `Iteração ${cycle+1}: 🟢 Livre`;
            }
            if_renderBoard(false, false, false, true);
            playSound('step');
            await if_sleep(300);
            document.getElementById('if_n3_line_3')?.classList.remove('active');

            const chosenAction = hasObstacle ? actIf : actElse;

            if(hasObstacle) {
                document.getElementById('if_n3_line_4')?.classList.add('active');
            } else {
                document.getElementById('if_n3_line_6')?.classList.add('active');
            }

            // Executa exatamente 1 bloco nesta iteração do loop
            let r = await if_execDirection(chosenAction);

            document.getElementById('if_n3_line_4')?.classList.remove('active');
            document.getElementById('if_n3_line_6')?.classList.remove('active');

            if(!r.success) {
                crashed = true;
                if(r.reason === 'crash_obstacle') {
                    triggerErrorSplash(
                        'Ops! Robô bateu na Barreira! 💥',
                        'O robô tentou avançar direto contra uma barreira.',
                        'Configure o if (sensorObstaculo()) para baixo() para desviar a cada encontro!',
                        '🚧',
                        config.solutionCode,
                        'if_lvl_3',
                        3
                    );
                } else {
                    triggerErrorSplash('Robô saiu do Tabuleiro!', 'O robô andou além dos limites.', 'Ajuste as repetições do laço FOR para 5.', '⚠️', config.solutionCode, 'if_lvl_3', 3);
                }
                break;
            }

            if(if_robotPos.x === if_targetPos.x && if_robotPos.y === if_targetPos.y) {
                break;
            }
        }

        if(!crashed) {
            if(if_robotPos.x === if_targetPos.x && if_robotPos.y === if_targetPos.y) {
                if_renderBoard(false, false, true, false);
                playSound('success');
                triggerConfetti(3000);
                if_saveLevelDone(3);
                if_showWinModal('🏆', 'Laço FOR + Decisão Dominados!', 'Você comprovou que o Laço FOR repete a decisão a cada passo, andando 1 bloco por ciclo e completando os 5 passos!');
            } else {
                triggerErrorSplash(
                    'Quase lá!',
                    'O robô parou antes de chegar ao troféu 🏆.',
                    'Use for (int i = 0; i < 5; i++) com baixo() no if e direita() no else para completar os 5 passos!',
                    '🧭',
                    config.solutionCode,
                    'if_lvl_3',
                    3
                );
            }
        }

        if(btn) { btn.disabled = false; btn.innerHTML = '<i class="fa-solid fa-play"></i> EXECUTAR DECISÃO IF/ELSE'; }
        if_isRunning = false;
        return;
    }

    // ================= EXECUÇÃO DO NÍVEL 4: MINI-IDE C/C++ (INTERPRETADOR REAL) =================
    if(if_currentLevel === 4) {
        const rawCode = document.getElementById('if_code_input').value;
        const parsed = if_parseAndExecuteCpp(rawCode);

        if(!parsed.success) {
            triggerErrorSplash('Erro de Sintaxe C/C++', parsed.error, parsed.hint, '🛑', config.solutionCode, 'if_lvl_4', 3);
            if(btn) { btn.disabled = false; btn.innerHTML = '<i class="fa-solid fa-play"></i> EXECUTAR DECISÃO IF/ELSE'; }
            if_isRunning = false;
            return;
        }

        let crashed = false;

        // Executa a sequência de instruções interpretada
        for(let step of parsed.steps) {
            if(if_robotPos.x === if_targetPos.x && if_robotPos.y === if_targetPos.y) {
                break;
            }

            let dirToMove = null;

            if(step.type === 'direct') {
                dirToMove = step.dir;
            } else if(step.type === 'conditional') {
                const hasObstacle = if_checkObstacleAhead(if_robotPos);
                const hud = document.getElementById('if_grid_hud');
                if(hud) {
                    hud.className = hasObstacle ? 'if-sim-hud warning' : 'if-sim-hud';
                    hud.innerHTML = hasObstacle ? 'Sensor: 🔴 Barreira detectada!' : 'Sensor: 🟢 Caminho Livre';
                }
                if_renderBoard(false, false, false, true);
                playSound('step');
                await if_sleep(250);

                dirToMove = hasObstacle ? step.ifDir : step.elseDir;
            }

            if(dirToMove) {
                let r = await if_execDirection(dirToMove);
                if(!r.success) {
                    crashed = true;
                    if(r.reason === 'crash_obstacle') {
                        triggerErrorSplash(
                            'Ops! Robô bateu na Barreira! 💥',
                            'O robô colidiu com um obstáculo.',
                            'Use sensorObstaculo() no IF para desviar quando necessário!',
                            '🚧',
                            config.solutionCode,
                            'if_lvl_4',
                            3
                        );
                    } else {
                        triggerErrorSplash('Robô saiu do Tabuleiro!', 'O robô andou além dos limites.', 'Verifique a contagem de repetições ou comandos de direção.', '⚠️', config.solutionCode, 'if_lvl_4', 3);
                    }
                    break;
                }
            }
        }

        if(!crashed) {
            if(if_robotPos.x === if_targetPos.x && if_robotPos.y === if_targetPos.y) {
                if_renderBoard(false, false, true, false);
                playSound('success');
                triggerConfetti(3500);
                if_saveLevelDone(4);
                if_showWinModal('🏆', 'Mestre Supremo de C/C++!', 'Incrível! Você programou na Mini-IDE C/C++ unindo laços for, if/else e comandos direcionais com maestria!');
            } else {
                triggerErrorSplash(
                    'Quase lá!',
                    'O robô parou antes de chegar ao troféu 🏆.',
                    'Dica: Use um laço for (int i = 0; i < 5; i++) com if (sensorObstaculo()) { baixo(); } else { direita(); }!',
                    '🧭',
                    config.solutionCode,
                    'if_lvl_4',
                    3
                );
            }
        }

        if(btn) { btn.disabled = false; btn.innerHTML = '<i class="fa-solid fa-play"></i> EXECUTAR DECISÃO IF/ELSE'; }
        if_isRunning = false;
        return;
    }
}

// ================= INTERPRETADOR COMPLETO E ROBUSTO DE C/C++ (NÍVEL 4) =================
function if_parseAndExecuteCpp(raw) {
    if(!raw || raw.trim().length === 0) {
        return { 
            success: false, 
            error: 'O código está vazio!', 
            hint: 'Use o teclado de atalhos rápidos para montar seu programa C/C++ com direita(), baixo(), for e if/else.' 
        };
    }

    const openBraces = (raw.match(/{/g) || []).length;
    const closeBraces = (raw.match(/}/g) || []).length;
    if(openBraces !== closeBraces) {
        return { 
            success: false, 
            error: 'Chaves { } desbalanceadas!', 
            hint: 'Verifique se todas as chaves abertas { foram devidamente fechadas } com fecho correspondente.' 
        };
    }

    // 1. Limpa comentários de linha (//) e bloco (/* */)
    let cleanCode = raw
        .replace(/\/\*[\s\S]*?\*\//g, '')
        .replace(/\/\/.*/g, '')
        .trim();

    if(cleanCode.length === 0) {
        return { 
            success: false, 
            error: 'O código contém apenas comentários!', 
            hint: 'Adicione comandos em C/C++ como direita();, baixo(); ou laços for!' 
        };
    }

    // Utilitário para extrair direção de um texto
    function extractDirectionFromText(text, defaultDir = 'direita') {
        if(!text) return defaultDir;
        if(/\bbaixo\s*\(\s*\)/i.test(text)) return 'baixo';
        if(/\bdireita\s*\(\s*\)/i.test(text)) return 'direita';
        if(/\besquerda\s*\(\s*\)/i.test(text)) return 'esquerda';
        if(/\bcima\s*\(\s*\)/i.test(text)) return 'cima';
        return defaultDir;
    }

    // Utilitário para extrair todos os comandos direcionais simples de um texto
    function extractAllCmds(text) {
        const list = [];
        const regex = /\b(direita|baixo|esquerda|cima)\s*\(\s*\)\s*;/gi;
        let match;
        while((match = regex.exec(text)) !== null) {
            list.push(match[1].toLowerCase());
        }
        return list;
    }

    // Parser de bloco de código em passos sequenciais
    function parseCodeBlock(codeText) {
        const resultSteps = [];
        let cursor = 0;
        const totalLen = codeText.length;

        while(cursor < totalLen) {
            // Procura a próxima estrutura especial: 'for' ou 'if'
            const nextForMatch = codeText.substring(cursor).search(/\bfor\s*\(/i);
            const nextIfMatch = codeText.substring(cursor).search(/\bif\s*\(/i);

            // Se não encontrou nenhuma estrutura, processa comandos simples restantes
            if(nextForMatch === -1 && nextIfMatch === -1) {
                const remaining = codeText.substring(cursor);
                const cmds = extractAllCmds(remaining);
                cmds.forEach(c => resultSteps.push({ type: 'direct', dir: c }));
                break;
            }

            // Decide qual estrutura vem primeiro
            let targetIdx = -1;
            let constructType = '';

            if(nextForMatch !== -1 && (nextIfMatch === -1 || nextForMatch <= nextIfMatch)) {
                targetIdx = cursor + nextForMatch;
                constructType = 'for';
            } else {
                targetIdx = cursor + nextIfMatch;
                constructType = 'if';
            }

            // Processa comandos simples que vieram antes da estrutura
            const textBefore = codeText.substring(cursor, targetIdx);
            const cmdsBefore = extractAllCmds(textBefore);
            cmdsBefore.forEach(c => resultSteps.push({ type: 'direct', dir: c }));

            cursor = targetIdx;

            if(constructType === 'for') {
                // Analisa o cabeçalho do FOR: for (int i = 0; i < N; i++)
                const openParen = codeText.indexOf('(', cursor);
                if(openParen === -1) { cursor++; continue; }

                let closeParen = -1;
                let pDepth = 0;
                for(let k = openParen; k < totalLen; k++) {
                    if(codeText[k] === '(') pDepth++;
                    else if(codeText[k] === ')') {
                        pDepth--;
                        if(pDepth === 0) { closeParen = k; break; }
                    }
                }
                if(closeParen === -1) { cursor++; continue; }

                const forHeader = codeText.substring(openParen + 1, closeParen);
                const countMatch = forHeader.match(/<\s*(\d+)/) || forHeader.match(/<=\s*(\d+)/);
                let loopCount = 1;
                if(countMatch) {
                    loopCount = parseInt(countMatch[1]);
                    if(forHeader.includes('<=')) loopCount += 1;
                }
                loopCount = Math.min(20, Math.max(1, loopCount));

                // Localiza o bloco { ... } do FOR
                const openBrace = codeText.indexOf('{', closeParen);
                if(openBrace === -1) { cursor = closeParen + 1; continue; }

                let closeBrace = -1;
                let bDepth = 0;
                for(let k = openBrace; k < totalLen; k++) {
                    if(codeText[k] === '{') bDepth++;
                    else if(codeText[k] === '}') {
                        bDepth--;
                        if(bDepth === 0) { closeBrace = k; break; }
                    }
                }
                if(closeBrace === -1) { cursor = openBrace + 1; continue; }

                const forBody = codeText.substring(openBrace + 1, closeBrace);
                const bodySteps = parseCodeBlock(forBody);

                for(let i = 0; i < loopCount; i++) {
                    bodySteps.forEach(s => resultSteps.push({ ...s }));
                }

                cursor = closeBrace + 1;
            } else if(constructType === 'if') {
                // Analisa o IF (e opcionalmente o ELSE subsequente)
                const openParen = codeText.indexOf('(', cursor);
                if(openParen === -1) { cursor++; continue; }

                let closeParen = -1;
                let pDepth = 0;
                for(let k = openParen; k < totalLen; k++) {
                    if(codeText[k] === '(') pDepth++;
                    else if(codeText[k] === ')') {
                        pDepth--;
                        if(pDepth === 0) { closeParen = k; break; }
                    }
                }
                if(closeParen === -1) { cursor++; continue; }

                const ifCond = codeText.substring(openParen + 1, closeParen);
                const isSensorCheck = /sensorObstaculo/i.test(ifCond);

                // Localiza o bloco { ... } do IF
                const openBrace = codeText.indexOf('{', closeParen);
                if(openBrace === -1) { cursor = closeParen + 1; continue; }

                let closeBrace = -1;
                let bDepth = 0;
                for(let k = openBrace; k < totalLen; k++) {
                    if(codeText[k] === '{') bDepth++;
                    else if(codeText[k] === '}') {
                        bDepth--;
                        if(bDepth === 0) { closeBrace = k; break; }
                    }
                }
                if(closeBrace === -1) { cursor = openBrace + 1; continue; }

                const ifBody = codeText.substring(openBrace + 1, closeBrace);
                let elseBody = '';
                cursor = closeBrace + 1;

                // Verifica se imediatamente a seguir há um bloco 'else'
                const followingCode = codeText.substring(cursor);
                const elseMatch = followingCode.match(/^\s*else\s*\{/i);
                if(elseMatch) {
                    const elseOpenBrace = cursor + followingCode.indexOf('{');
                    let elseCloseBrace = -1;
                    let eDepth = 0;
                    for(let k = elseOpenBrace; k < totalLen; k++) {
                        if(codeText[k] === '{') eDepth++;
                        else if(codeText[k] === '}') {
                            eDepth--;
                            if(eDepth === 0) { elseCloseBrace = k; break; }
                        }
                    }
                    if(elseCloseBrace !== -1) {
                        elseBody = codeText.substring(elseOpenBrace + 1, elseCloseBrace);
                        cursor = elseCloseBrace + 1;
                    }
                }

                if(isSensorCheck) {
                    const ifDir = extractDirectionFromText(ifBody, 'baixo');
                    const elseDir = extractDirectionFromText(elseBody, 'direita');
                    resultSteps.push({ type: 'conditional', ifDir, elseDir });
                } else {
                    // Se não for teste de sensor, executa o ifBody por padrão
                    const innerIfSteps = parseCodeBlock(ifBody);
                    innerIfSteps.forEach(s => resultSteps.push(s));
                }
            }
        }

        return resultSteps;
    }

    const steps = parseCodeBlock(cleanCode);

    if(steps.length === 0) {
        return { 
            success: false, 
            error: 'Nenhum comando de movimento reconhecido!', 
            hint: 'Use comandos como direita();, baixo();, esquerda();, cima(); ou laços for!' 
        };
    }

    return { success: true, steps };
}

// ================= GERADOR DE C++ EM TEMPO REAL =================
function if_updateLiveCpp() {
    const el = document.getElementById('if_arduino_code');
    if(!el) return;

    let code = `// ========================================================\n` +
               `// CRIADORES DE CÓDIGO — CONTROLE DO ROBÔ INTELIGENTE\n` +
               `// AULA 3: CONDICIONAIS (IF / ELSE) & COMANDOS DIRECIONAIS\n` +
               `// ========================================================\n\n` +
               `// Função que executa a rota do robô com comandos das Aulas 1 e 2:\n` +
               `void controlarRobo() {\n`;

    if(if_currentLevel === 1) {
        code += `  // Nível 1: Navegação na Pista Ampla com 'bool', '==' e IF/ELSE\n` +
                `  bool temObstaculo = sensorObstaculo(); // Guarda true ou false\n\n` +
                `  if (temObstaculo == true) {\n` +
                `    baixo();    // Desce para a faixa de desvio\n` +
                `    direita();  // Avança no desvio\n` +
                `    direita();  // Contorna a barreira e coleta a Estrela 🌟\n` +
                `    direita();  // Avança no desvio\n` +
                `    cima();     // Retorna para a pista principal\n` +
                `    direita();  // Alcança o Troféu de Ouro 🏆!\n` +
                `  } else {\n` +
                `    // Pista livre: Laço FOR repete 4 passos com direita():\n` +
                `    for (int i = 0; i < 4; i++) {\n` +
                `      direita();\n` +
                `    }\n` +
                `  }\n`;
    } else if(if_currentLevel === 2) {
        const cmd1 = document.getElementById('if_n2_cmd1')?.value;
        const cmd1Str = cmd1 ? `${cmd1}();` : `// ❓ [escolha a 1ª ação]`;

        const cmdIf = document.getElementById('if_n2_cmd_if')?.value;
        const cmdIfStr = cmdIf ? `${cmdIf}();` : `// ❓ [escolha ação no IF]`;

        const cmdElse = document.getElementById('if_n2_cmd_else')?.value;
        const cmdElseStr = cmdElse ? `${cmdElse}();` : `// ❓ [escolha ação no ELSE]`;

        const cmd2 = document.getElementById('if_n2_cmd2')?.value;
        const cmd2Str = cmd2 ? `${cmd2}();` : `// ❓ [escolha a ação final]`;

        code += `  // Nível 2: Sequência com Decisão IF/ELSE\n` +
                `  ${cmd1Str} // 1️⃣ Aproximação\n\n` +
                `  if (sensorObstaculo()) {\n` +
                `    ${cmdIfStr} // 2️⃣ ⚠️ Se barreira (TRUE): desvia\n` +
                `  } else {\n` +
                `    ${cmdElseStr} // 2️⃣ 🟢 Se livre (FALSE): avança\n` +
                `  }\n\n` +
                `  ${cmd2Str} // 3️⃣ Reta final até o troféu 🏆\n`;
    } else if(if_currentLevel === 3) {
        const count = document.getElementById('if_n3_for_count')?.value || '?';
        const actIf = document.getElementById('if_n3_act_if')?.value;
        const actIfStr = actIf ? `${actIf}();` : `// ❓ [escolha ação se barreira]`;
        const actElse = document.getElementById('if_n3_act_else')?.value;
        const actElseStr = actElse ? `${actElse}();` : `// ❓ [escolha ação se livre]`;

        code += `  // Nível 3: Mix Laço FOR + IF/ELSE com comandos direcionais\n` +
                `  for (int i = 0; i < ${count}; i++) {\n` +
                `    if (sensorObstaculo()) {\n` +
                `      ${actIfStr}\n` +
                `    } else {\n` +
                `      ${actElseStr}\n` +
                `    }\n` +
                `  }\n`;
    } else if(if_currentLevel === 4) {
        const raw = document.getElementById('if_code_input')?.value;
        code += raw ? `  ${raw.replace(/\n/g, '\n  ')}\n` : `  // Digite seu código na Mini-IDE acima\n`;
    }

    code += `}`;
    el.innerText = code;
}

function if_copyCode() {
    const code = document.getElementById('if_arduino_code')?.innerText;
    if(code) {
        navigator.clipboard.writeText(code);
        playSound('click');
        const btn = document.querySelector('.arduino-code-panel button');
        if(btn) {
            const originalText = btn.innerHTML;
            btn.innerHTML = '<i class="fa-solid fa-check"></i> Copiado!';
            setTimeout(() => { btn.innerHTML = originalText; }, 2000);
        }
    }
}

// ================= UTILITÁRIOS DA MINI-IDE =================
function if_insertText(text) {
    const textarea = document.getElementById('if_code_input');
    if(!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const val = textarea.value;
    textarea.value = val.substring(0, start) + text + val.substring(end);
    textarea.selectionStart = textarea.selectionEnd = start + text.length;
    textarea.focus();
    if_handleIdeInput();
}

function if_clearIde() {
    const textarea = document.getElementById('if_code_input');
    if(textarea) {
        textarea.value = '';
        if_handleIdeInput();
    }
}

function if_handleIdeInput() {
    const textarea = document.getElementById('if_code_input');
    const linesEl = document.getElementById('if_line_numbers');
    if(!textarea || !linesEl) return;
    const lineCount = textarea.value.split('\n').length;
    let nums = '';
    for(let i=1; i<=Math.max(8, lineCount); i++) nums += i + '<br>';
    linesEl.innerHTML = nums;
    if_updateLiveCpp();
}

function if_saveLevelDone(lvl) {
    let saved = getLevels('jardim_levels');
    if(!saved.includes(lvl)) {
        saved.push(lvl);
        localStorage.setItem('jardim_levels', JSON.stringify(saved));
        if(typeof updateTrail === 'function') updateTrail();
        if(typeof updateHubProgress === 'function') updateHubProgress();
    }
}

function if_showWinModal(icon, title, text) {
    document.getElementById('if_modal_icon').innerText = icon;
    document.getElementById('if_modal_title').innerText = title;
    document.getElementById('if_modal_text').innerText = text;
    document.getElementById('if_win_modal')?.classList.add('active');
}

function if_closeWinModal() {
    document.getElementById('if_win_modal')?.classList.remove('active');
    if(if_currentLevel < 4) {
        if_switchLevel(if_currentLevel + 1);
    } else {
        openTab('tab-trail');
    }
}

function if_sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

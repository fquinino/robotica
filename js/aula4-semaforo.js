/* ==========================================================================
   AULA 4 — SEQUÊNCIAS TEMPORIZADAS (CRUZAMENTO INTELIGENTE & MINI-IDE C/C++)
   ========================================================================== */

function loadSemaforo() {
    const container = document.getElementById('semaforo-container');
    if (!container) return;

    container.innerHTML = `
        <style>
            .sem-wrapper { color:#E2E8F0; max-width:1050px; margin:0 auto; }
            
            /* CABEÇALHO DA AULA */
            .sem-header-card { background:linear-gradient(135deg, rgba(245,158,11,0.18), rgba(30,41,59,0.92)); border:2px solid #F59E0B; border-radius:24px; padding:18px 22px; margin-bottom:16px; box-shadow:0 10px 30px rgba(0,0,0,0.4); display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px; }
            .sem-header-info h2 { font-family:'Fredoka One', cursive; color:#FBBF24; font-size:clamp(1.2rem, 3vw, 1.6rem); margin:0 0 4px; display:flex; align-items:center; gap:10px; }
            .sem-header-info p { color:#CBD5E1; margin:0; font-size:0.92rem; line-height:1.45; }
            .sem-guide-toggle-btn { background:#1E293B; border:2px solid #F59E0B; color:#FBBF24; padding:8px 16px; border-radius:14px; font-weight:800; font-size:0.88rem; cursor:pointer; display:flex; align-items:center; gap:8px; transition:0.2s all; }
            .sem-guide-toggle-btn:hover { background:#F59E0B; color:#0F172A; transform:translateY(-2px); box-shadow:0 4px 15px rgba(245,158,11,0.4); }

            /* GUIA INTERATIVO COM SLIDES DA HISTÓRIA & CONCEITOS */
            .sem-guide-card { background:#0F172A; border:2px solid #F59E0B; border-radius:22px; padding:18px 20px; margin-bottom:18px; box-shadow:0 12px 35px rgba(0,0,0,0.45); transition:all 0.3s ease; }
            .sem-guide-tabs { display:flex; gap:8px; overflow-x:auto; padding-bottom:8px; border-bottom:1px solid #1E293B; margin-bottom:14px; scrollbar-width:thin; }
            .sem-guide-tab { background:#1E293B; border:1px solid #334155; color:#94A3B8; padding:8px 14px; border-radius:12px; font-weight:800; font-size:0.85rem; cursor:pointer; transition:0.2s all; white-space:nowrap; display:flex; align-items:center; gap:6px; }
            .sem-guide-tab:hover { color:#E2E8F0; border-color:#F59E0B; }
            .sem-guide-tab.active { background:linear-gradient(135deg, rgba(245,158,11,0.25), rgba(217,119,6,0.25)); color:#FBBF24; border-color:#FBBF24; box-shadow:0 0 12px rgba(245,158,11,0.3); }
            
            .sem-slide-content { display:none; animation:semFadeIn 0.3s ease; }
            .sem-slide-content.active { display:block; }
            
            .sem-guide-footer { display:flex; justify-content:space-between; align-items:center; margin-top:16px; padding-top:12px; border-top:1px solid #1E293B; flex-wrap:wrap; gap:10px; }
            .sem-guide-nav-btn { background:#1E293B; border:1px solid #475569; color:#E2E8F0; padding:8px 16px; border-radius:12px; font-weight:800; font-size:0.85rem; cursor:pointer; transition:0.2s; display:flex; align-items:center; gap:6px; }
            .sem-guide-nav-btn:hover { border-color:#F59E0B; color:#FBBF24; background:#0F172A; }
            .sem-guide-nav-btn.primary { background:linear-gradient(135deg, #F59E0B, #D97706); color:#0F172A; border:none; font-weight:900; box-shadow:0 4px 15px rgba(245,158,11,0.35); }
            .sem-guide-nav-btn.primary:hover { background:linear-gradient(135deg, #FBBF24, #F59E0B); }
            .sem-guide-progress-dots { display:flex; gap:6px; align-items:center; }
            .sem-dot { width:8px; height:8px; border-radius:50%; background:#334155; transition:0.2s all; }
            .sem-dot.active { width:22px; border-radius:10px; background:#F59E0B; }

            /* NAVEGAÇÃO DOS NÍVEIS (BARRA SEGMENTADA) */
            .sem-level-bar { display:grid; grid-template-columns:repeat(auto-fit, minmax(210px, 1fr)); gap:10px; margin-bottom:18px; width:100%; }
            .sem-level-btn { background:#1E293B; border:2px solid #334155; color:#94A3B8; padding:12px 14px; border-radius:18px; font-weight:800; cursor:pointer; font-size:0.88rem; transition:0.2s all; display:flex; align-items:center; justify-content:space-between; text-align:left; }
            .sem-level-btn:hover { border-color:#F59E0B; color:white; transform:translateY(-2px); box-shadow:0 6px 15px rgba(0,0,0,0.3); }
            .sem-level-btn.active { background:linear-gradient(135deg, #1E293B, #0F172A); color:white; border-color:#FBBF24; box-shadow:0 0 20px rgba(245,158,11,0.35); }
            .sem-level-btn.active .sem-lvl-num { background:#F59E0B; color:#0F172A; font-weight:900; }
            .sem-level-btn.done { border-color:#10B981; color:#34D399; }
            .sem-level-btn.done .sem-lvl-status { color:#10B981; }
            .sem-lvl-left { display:flex; align-items:center; gap:10px; }
            .sem-lvl-num { width:28px; height:28px; border-radius:8px; background:#334155; color:#E2E8F0; display:flex; align-items:center; justify-content:center; font-weight:900; font-size:0.82rem; }
            .sem-lvl-info { display:flex; flex-direction:column; }
            .sem-lvl-title { font-weight:900; font-size:0.88rem; color:#F1F5F9; }
            .sem-lvl-sub { font-size:0.75rem; color:#94A3B8; }
            .sem-lvl-status { font-size:0.95rem; color:#475569; }

            /* CARD DE HISTÓRIA / MISSÃO ATIVA */
            .sem-story-card { background:#0F172A; border:2px solid #F59E0B; border-radius:18px; padding:14px 18px; margin-bottom:16px; box-shadow:0 6px 20px rgba(0,0,0,0.3); }
            .sem-story-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:6px; flex-wrap:wrap; gap:8px; }
            .sem-story-title { font-family:'Fredoka One'; color:#F59E0B; font-size:1.05rem; display:flex; align-items:center; gap:8px; }
            .sem-story-badge { font-family:'Fira Code', monospace; font-size:0.8rem; background:rgba(245,158,11,0.15); color:#FBBF24; padding:3px 10px; border-radius:8px; border:1px dashed #F59E0B; }
            .sem-story-text { color:#CBD5E1; font-size:0.9rem; line-height:1.5; margin:0; }

            /* CENÁRIO GRÁFICO DO CRUZAMENTO DE 2 FLUXOS */
            .sem-stage-card { background:#090D16; border:2px solid #334155; border-radius:24px; padding:16px; margin-bottom:18px; box-shadow:0 12px 35px rgba(0,0,0,0.6); position:relative; overflow:hidden; }
            .sem-stage-hud { display:flex; justify-content:space-between; align-items:center; background:#0F172A; border:1px solid #1E293B; border-radius:14px; padding:10px 16px; margin-bottom:14px; flex-wrap:wrap; gap:10px; }
            .sem-hud-item { display:flex; align-items:center; gap:8px; font-size:0.85rem; font-weight:800; }
            .sem-status-pill { padding:3px 10px; border-radius:20px; font-weight:900; font-size:0.8rem; display:inline-flex; align-items:center; gap:5px; }
            .sem-status-pill.green { background:rgba(16,185,129,0.2); color:#34D399; border:1px solid #10B981; }
            .sem-status-pill.yellow { background:rgba(245,158,11,0.2); color:#FBBF24; border:1px solid #F59E0B; }
            .sem-status-pill.red { background:rgba(239,68,68,0.2); color:#F87171; border:1px solid #EF4444; }

            .sem-crossroad-box { position:relative; width:100%; height:440px; min-height:440px; background:#0B1120; border-radius:18px; border:2px solid #334155; overflow:hidden; box-shadow:inset 0 0 40px rgba(0,0,0,0.8); }
            
            /* PISTAS DE ASFALTO */
            .sem-road-h { position:absolute; top:50%; left:0; width:100%; height:110px; transform:translateY(-50%); background:#1E293B; border-top:3px solid #475569; border-bottom:3px solid #475569; }
            .sem-road-h-line { position:absolute; top:50%; left:0; width:100%; height:2px; transform:translateY(-50%); border-top:3px dashed #F59E0B; opacity:0.85; }
            
            .sem-road-v { position:absolute; top:0; left:50%; width:110px; height:100%; transform:translateX(-50%); background:#1E293B; border-left:3px solid #475569; border-right:3px solid #475569; }
            .sem-road-v-line { position:absolute; top:0; left:50%; width:2px; height:100%; transform:translateX(-50%); border-left:3px dashed #F59E0B; opacity:0.85; }
            
            /* ÁREA CENTRAL DO CRUZAMENTO */
            .sem-junction-box { position:absolute; top:50%; left:50%; width:110px; height:110px; transform:translate(-50%, -50%); background:#172033; border:2px dashed rgba(245,158,11,0.3); z-index:5; }
            
            /* FAIXA DE PEDESTRES ZEBRADA NA ENTRADA OESTE */
            .sem-zebra-west { position:absolute; top:50%; left:calc(50% - 95px); width:32px; height:110px; transform:translateY(-50%); background:repeating-linear-gradient(180deg, #FFFFFF, #FFFFFF 10px, transparent 10px, transparent 20px); opacity:0.9; z-index:6; }
            .sem-stop-line-west { position:absolute; top:calc(50% + 3px); left:calc(50% - 105px); width:4px; height:50px; background:#FFFFFF; z-index:7; box-shadow:0 0 8px white; }
            .sem-stop-line-north { position:absolute; top:calc(50% - 105px); left:calc(50% - 53px); width:50px; height:4px; background:#FFFFFF; z-index:7; box-shadow:0 0 8px white; }

            /* ================= POSTES DE SEMÁFORO VEICULAR (NUMERADOS 1 E 2) ================= */
            .sem-traffic-post { position:absolute; background:#0B0F19; border:2px solid #475569; border-radius:12px; padding:6px 6px 8px; display:flex; flex-direction:column; align-items:center; gap:5px; z-index:30; box-shadow:0 8px 20px rgba(0,0,0,0.85); min-width:40px; }
            .sem-num-badge { width:22px; height:22px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-family:'Fredoka One', cursive; font-size:0.85rem; font-weight:900; margin-bottom:2px; box-shadow:0 2px 6px rgba(0,0,0,0.6); }
            .sem-num-badge.n1 { background:#EF4444; color:white; border:1px solid #FCA5A5; }
            .sem-num-badge.n2 { background:#38BDF8; color:#0F172A; border:1px solid #BAE6FD; }
            
            .sem-bulb { width:18px; height:18px; border-radius:50%; background:#1E293B; border:2px solid #000; transition:all 0.2s; opacity:0.3; }
            .sem-bulb.red.on { background:#EF4444; opacity:1; box-shadow:0 0 16px #EF4444, 0 0 25px #DC2626; }
            .sem-bulb.yellow.on { background:#F59E0B; opacity:1; box-shadow:0 0 16px #F59E0B, 0 0 25px #D97706; }
            .sem-bulb.green.on { background:#10B981; opacity:1; box-shadow:0 0 16px #10B981, 0 0 25px #059669; }

            /* Posição Semáforo 1 (Fluxo 1 - Carro Vermelho 🚗) */
            .sem-post-1 { top:calc(50% - 110px); left:calc(50% - 150px); border-color:#EF4444; }
            /* Posição Semáforo 2 (Fluxo 2 - Carro Azul 🚙) */
            .sem-post-2 { top:calc(50% - 145px); left:calc(50% + 65px); border-color:#38BDF8; }

            /* ================= SEMÁFORO DE PEDESTRES 🚸 (DESENHO TOTALMENTE DIFERENCIADO) ================= */
            .sem-ped-post { position:absolute; top:calc(50% + 60px); left:calc(50% - 145px); background:#0F172A; border:2px solid #FBBF24; border-radius:14px; padding:6px 6px 8px; display:flex; flex-direction:column; align-items:center; gap:6px; z-index:30; box-shadow:0 8px 20px rgba(0,0,0,0.85); width:46px; }
            .sem-ped-sign { background:#FBBF24; color:#0F172A; font-size:0.75rem; font-weight:900; padding:1px 5px; border-radius:4px; margin-bottom:2px; font-family:'Fredoka One'; display:flex; align-items:center; gap:2px; }
            .sem-ped-lens { width:30px; height:30px; background:#0B0F19; border-radius:8px; border:2px solid #334155; display:flex; align-items:center; justify-content:center; opacity:0.3; transition:all 0.25s ease; }
            .sem-ped-lens.red.on { opacity:1; background:rgba(239,68,68,0.25); border-color:#EF4444; box-shadow:0 0 16px #EF4444; }
            .sem-ped-lens.green.on { opacity:1; background:rgba(16,185,129,0.25); border-color:#10B981; box-shadow:0 0 16px #10B981; }

            /* VEÍCULOS (FRENTE SEMPRE APONTADA PARA O SENTIDO DO MOVIMENTO!) */
            .sem-vehicle { position:absolute; width:54px; height:30px; z-index:20; transition:all 1.1s cubic-bezier(0.25, 1, 0.5, 1); filter:drop-shadow(0 4px 6px rgba(0,0,0,0.7)); }
            .sem-vehicle svg { width:100%; height:100%; display:block; }
            
            /* Carro Vermelho 🚗 (Fluxo 1: Oeste -> Leste, virado para 0deg) */
            #sem_car_red { top:calc(50% + 14px); left:25px; }
            /* Carro Azul 🚙 (Fluxo 2: Norte -> Sul, virado para 90deg) */
            #sem_car_blue { top:20px; left:calc(50% - 42px); transform:rotate(90deg); transform-origin:center; }

            /* PEDESTRE 🚶 NA CALÇADA DA FAIXA */
            .sem-pedestrian { position:absolute; font-size:1.8rem; z-index:22; filter:drop-shadow(0 4px 4px rgba(0,0,0,0.8)); transition:all 1.4s ease-in-out; }
            #sem_ped_1 { top:calc(50% + 62px); left:calc(50% - 95px); }

            /* EFEITO DE COLISÃO / IMPACTO */
            .sem-crash-fx { position:absolute; top:50%; left:50%; transform:translate(-50%, -50%) scale(0); font-size:4rem; z-index:40; pointer-events:none; transition:transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
            .sem-crash-fx.active { transform:translate(-50%, -50%) scale(1.3); animation:errorShake 0.4s ease-in-out infinite alternate; }

            /* MINI-IDE E EDITORES */
            .sem-ide-layout { display:grid; grid-template-columns:repeat(auto-fit, minmax(310px, 1fr)); gap:18px; margin-bottom:15px; width:100%; }
            @media (max-width: 820px) { .sem-ide-layout { grid-template-columns:1fr; } }
            
            .sem-editor-card { background:#090D16; border:2px solid #F59E0B; border-radius:20px; padding:16px; display:flex; flex-direction:column; box-shadow:0 10px 25px rgba(0,0,0,0.5); }
            .sem-editor-topbar { display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #1E293B; padding-bottom:10px; margin-bottom:12px; }
            .sem-editor-title { font-family:'Fredoka One'; color:#FBBF24; font-size:1.05rem; display:flex; align-items:center; gap:8px; }
            .sem-lang-tag { background:rgba(245,158,11,0.2); color:#FBBF24; padding:3px 10px; border-radius:12px; font-size:0.75rem; font-weight:800; border:1px solid #F59E0B; }

            /* TECLADO MAKER DE ATALHOS RÁPIDOS */
            .sem-shortcuts-bar { display:flex; gap:6px; flex-wrap:wrap; margin-bottom:12px; background:#111827; padding:8px; border-radius:12px; border:1px solid #1F2937; }
            .sem-shortcut-btn { background:#1F2937; border:1px solid #374151; color:#E5E7EB; padding:6px 10px; border-radius:8px; font-size:0.78rem; font-weight:800; cursor:pointer; transition:0.15s; font-family:'Nunito', sans-serif; display:flex; align-items:center; gap:4px; }
            .sem-shortcut-btn:hover { transform:scale(1.03); }
            .sem-shortcut-btn.btn-s1 { border-color:#EF4444; color:#FCA5A5; }
            .sem-shortcut-btn.btn-s1:hover { background:#EF4444; color:white; }
            .sem-shortcut-btn.btn-s2 { border-color:#38BDF8; color:#BAE6FD; }
            .sem-shortcut-btn.btn-s2:hover { background:#38BDF8; color:#0F172A; }
            .sem-shortcut-btn.btn-ped { border-color:#10B981; color:#A7F3D0; }
            .sem-shortcut-btn.btn-ped:hover { background:#10B981; color:#0F172A; }
            .sem-shortcut-btn.clear { background:#450A0A; border-color:#991B1B; color:#FCA5A5; }
            .sem-shortcut-btn.clear:hover { background:#DC2626; color:white; }

            /* SCAFFOLDING EDITOR (NÍVEIS 1, 2 E 3) */
            .sem-scaffold-lines { background:#030712; border-radius:14px; padding:16px; border:1px solid #1F2937; font-family:'Fira Code', monospace; font-size:0.9rem; line-height:2.1; color:#E2E8F0; }
            .sem-scaffold-line { padding:2px 8px; border-radius:6px; transition:background 0.2s; border-left:3px solid transparent; }
            .sem-scaffold-line.active { background:rgba(245,158,11,0.25); border-left-color:#F59E0B; }
            .sem-select-cmd { background:#1E293B; border:2px solid #F59E0B; color:#FBBF24; font-family:'Fira Code', monospace; font-size:0.88rem; font-weight:bold; padding:4px 8px; border-radius:8px; outline:none; cursor:pointer; }
            .sem-input-num { background:#1E293B; border:2px solid #38BDF8; color:#38BDF8; font-family:'Fredoka One'; font-size:1.05rem; width:80px; padding:3px 6px; border-radius:8px; text-align:center; outline:none; }
            
            /* TEXTAREA LIVRE COM NÚMEROS DE LINHA (NÍVEL 4) */
            .sem-code-wrapper { position:relative; display:flex; background:#030712; border-radius:14px; border:1px solid #1F2937; overflow:hidden; min-height:220px; }
            .sem-line-numbers { background:#0B0F19; color:#4B5563; padding:12px 8px; text-align:right; font-family:'Fira Code', monospace; font-size:0.88rem; line-height:1.7; user-select:none; border-right:1px solid #1F2937; min-width:32px; }
            .sem-code-input { flex:1; background:transparent; border:none; color:#F3F4F6; padding:12px; font-family:'Fira Code', monospace; font-size:0.88rem; line-height:1.7; resize:none; outline:none; white-space:pre; tab-size:4; min-height:220px; }

            /* BOTÕES DE AÇÃO */
            .sem-actions { display:flex; gap:10px; margin-top:14px; width:100%; }
            .sem-btn-run { background:linear-gradient(135deg,#10B981,#047857); color:white; border:none; padding:13px 20px; border-radius:16px; font-family:'Fredoka One', cursive; font-size:1.15rem; flex:2; border-bottom:5px solid #064E3B; cursor:pointer; transition:0.15s; display:flex; align-items:center; justify-content:center; gap:8px; box-shadow:0 6px 20px rgba(16,185,129,0.35); }
            .sem-btn-run:hover { filter:brightness(1.1); transform:translateY(-2px); }
            .sem-btn-run:active { transform:translateY(4px); border-bottom-width:1px; }
            .sem-btn-run:disabled { background:#475569; border-bottom-color:#1E293B; cursor:not-allowed; box-shadow:none; filter:none; }
            .sem-btn-reset { background:#334155; color:#CBD5E1; border:none; padding:13px 18px; border-radius:16px; font-family:'Fredoka One', cursive; font-size:1rem; flex:1; border-bottom:5px solid #1E293B; cursor:pointer; transition:0.15s; }

            /* BOTÃO DE SOLUÇÃO E DICA APÓS 3 ERROS */
            .sem-btn-solution { background:linear-gradient(135deg,#D97706,#B45309); border:none; color:white; padding:8px 14px; border-radius:10px; font-size:0.85rem; font-weight:900; cursor:pointer; transition:0.15s; margin-top:10px; width:100%; display:none; align-items:center; justify-content:center; gap:6px; }
            .sem-btn-solution:hover { background:linear-gradient(135deg,#F59E0B,#D97706); }
            .sem-solution-card { background:#0F172A; border:2px solid #F59E0B; border-radius:14px; padding:12px 16px; margin-top:10px; display:none; animation:semFadeIn 0.3s ease; }

            /* MODAL DE VITÓRIA */
            .sem-modal { position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(15,23,42,0.88); backdrop-filter:blur(8px); display:flex; justify-content:center; align-items:center; z-index:9999; opacity:0; pointer-events:none; transition:0.3s; }
            .sem-modal.active { opacity:1; pointer-events:all; }
            .sem-modal-box { background:linear-gradient(180deg,#1E293B,#0F172A); padding:32px 24px; border-radius:28px; max-width:440px; width:92%; text-align:center; border:3px solid #F59E0B; box-shadow:0 0 45px rgba(245,158,11,0.4); }
            .sem-modal-icon { font-size:4rem; margin-bottom:6px; animation:stampPop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
            .sem-modal-title { font-family:'Fredoka One', cursive; color:white; font-size:1.8rem; margin:0 0 8px; }
            .sem-modal-text { color:#CBD5E1; margin:0 0 20px; font-size:0.95rem; line-height:1.6; }
            .sem-btn-modal { background:linear-gradient(135deg,#F59E0B,#D97706); border:none; padding:13px 32px; border-radius:50px; font-weight:900; font-size:1.05rem; color:#0F172A; cursor:pointer; border-bottom:4px solid #B45309; transition:0.15s; }

            @keyframes semFadeIn { from{opacity:0;transform:translateY(8px);} to{opacity:1;transform:translateY(0);} }
        </style>

        <div class="sem-wrapper">
            <!-- CABEÇALHO DO MÓDULO -->
            <div class="sem-header-card">
                <div class="sem-header-info">
                    <h2>🚦 Aula 4: Temporização & Cruzamento Inteligente em C</h2>
                    <p>Controle o trânsito do <b>Fluxo 1 (Semáforo 1 🚗)</b> e do <b>Fluxo 2 (Semáforo 2 🚙)</b> usando <code>delay()</code> em milissegundos para evitar colisões!</p>
                </div>
                <button class="sem-guide-toggle-btn" id="sem_guide_toggle_btn" onclick="sem_toggleGuide()">
                    <i class="fa-solid fa-book-open-reader"></i> <span id="sem_guide_toggle_txt">Ocultar Guia Teórico</span>
                </button>
            </div>

            <!-- GUIA INTERATIVO COM SLIDES DA HISTÓRIA & CONCEITOS -->
            <div class="sem-guide-card" id="sem_guide_card">
                <div class="sem-guide-tabs">
                    <button class="sem-guide-tab active" id="sem_tab_g1" onclick="sem_switchGuideTab(1)"><i class="fa-solid fa-city"></i> 1. A Missão Maker</button>
                    <button class="sem-guide-tab" id="sem_tab_g2" onclick="sem_switchGuideTab(2)"><i class="fa-solid fa-stopwatch"></i> 2. O delay() em ms</button>
                    <button class="sem-guide-tab" id="sem_tab_g3" onclick="sem_switchGuideTab(3)"><i class="fa-solid fa-traffic-light"></i> 3. Cruzamento Seguro</button>
                    <button class="sem-guide-tab" id="sem_tab_g4" onclick="sem_switchGuideTab(4)"><i class="fa-solid fa-person-walking"></i> 4. Travessia Pedestre</button>
                </div>

                <!-- SLIDE 1: A MISSÃO DA CIDADE MAKER -->
                <div class="sem-slide-content active" id="sem_slide_1">
                    <div style="font-size:1.05rem;font-weight:900;color:#FBBF24;margin-bottom:8px;display:flex;align-items:center;gap:8px;">
                        <span>🏙️ 1. O Desafio dos Semáforos Numerados!</span>
                    </div>
                    <p style="margin:0 0 10px;color:#CBD5E1;font-size:0.92rem;line-height:1.6;">
                        O cruzamento central tem <b>2 fluxos de trânsito perpendiculares</b>, cada um com seu semáforo próprio numerado:
                    </p>
                    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:10px;margin:12px 0;">
                        <div style="background:#090D16;border:2px solid #EF4444;border-radius:14px;padding:12px;text-align:center;">
                            <div style="display:inline-block;background:#EF4444;color:white;font-weight:900;padding:2px 8px;border-radius:6px;font-size:0.8rem;margin-bottom:4px;">SEMÁFORO 1</div>
                            <div style="font-size:2rem;">🚗</div>
                            <b style="color:#F87171;">Fluxo 1: Carro Vermelho</b>
                            <div style="font-size:0.78rem;color:#94A3B8;margin-top:4px;">Avenida (Oeste ➔ Leste)</div>
                        </div>
                        <div style="background:#090D16;border:2px solid #38BDF8;border-radius:14px;padding:12px;text-align:center;">
                            <div style="display:inline-block;background:#38BDF8;color:#0F172A;font-weight:900;padding:2px 8px;border-radius:6px;font-size:0.8rem;margin-bottom:4px;">SEMÁFORO 2</div>
                            <div style="font-size:2rem;">🚙</div>
                            <b style="color:#38BDF8;">Fluxo 2: Carro Azul</b>
                            <div style="font-size:0.78rem;color:#94A3B8;margin-top:4px;">Rua (Norte ➔ Sul)</div>
                        </div>
                        <div style="background:#090D16;border:2px solid #10B981;border-radius:14px;padding:12px;text-align:center;">
                            <div style="display:inline-block;background:#10B981;color:#0F172A;font-weight:900;padding:2px 8px;border-radius:6px;font-size:0.8rem;margin-bottom:4px;">SEMÁFORO 🚸</div>
                            <div style="font-size:2rem;">🚶</div>
                            <b style="color:#34D399;">Semáforo de Pedestre</b>
                            <div style="font-size:0.78rem;color:#94A3B8;margin-top:4px;">Com boneco Pare e Siga!</div>
                        </div>
                    </div>
                    <div style="background:rgba(245,158,11,0.1);border:1px solid #F59E0B;border-radius:12px;padding:10px 14px;color:#FDE68A;font-size:0.85rem;">
                        ⚠️ <b>Regra de Ouro:</b> Se o <b>Semáforo 1</b> e o <b>Semáforo 2</b> ficarem verdes juntos, o Carro Vermelho e o Carro Azul <b>colidem de frente no meio do cruzamento</b>!
                    </div>
                </div>

                <!-- SLIDE 2: O COMANDO DELAY() -->
                <div class="sem-slide-content" id="sem_slide_2">
                    <div style="font-size:1.05rem;font-weight:900;color:#38BDF8;margin-bottom:8px;display:flex;align-items:center;gap:8px;">
                        <span>⏱️ 2. Como o Arduino mede o Tempo? (<code style="color:#FBBF24;">delay</code>)</span>
                    </div>
                    <p style="margin:0 0 10px;color:#CBD5E1;font-size:0.92rem;line-height:1.6;">
                        O microcontrolador do Arduino é extremamente veloz. Sem pausas, ele mudaria as luzes num piscar de olhos e os carros não teriam tempo de parar! Usamos a função <code>delay(milissegundos)</code> para manter cada fase aberta:
                    </p>
                    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:10px;margin:10px 0;">
                        <div style="background:#090D16;padding:10px 12px;border-radius:12px;border-left:4px solid #10B981;">
                            <b style="color:#34D399;">1 segundo = 1000 ms</b>
                            <div style="color:#E2E8F0;font-size:0.82rem;margin-top:4px;"><code>delay(1000);</code> // Espera 1s</div>
                        </div>
                        <div style="background:#090D16;padding:10px 12px;border-radius:12px;border-left:4px solid #F59E0B;">
                            <b style="color:#FBBF24;">2 segundos = 2000 ms</b>
                            <div style="color:#E2E8F0;font-size:0.82rem;margin-top:4px;"><code>delay(2000);</code> // Espera 2s</div>
                        </div>
                        <div style="background:#090D16;padding:10px 12px;border-radius:12px;border-left:4px solid #EC4899;">
                            <b style="color:#F472B6;">Meio segundo = 500 ms</b>
                            <div style="color:#E2E8F0;font-size:0.82rem;margin-top:4px;"><code>delay(500);</code> // Piscar rápido</div>
                        </div>
                    </div>
                </div>

                <!-- SLIDE 3: O CRUZAMENTO SEGURO -->
                <div class="sem-slide-content" id="sem_slide_3">
                    <div style="font-size:1.05rem;font-weight:900;color:#10B981;margin-bottom:8px;display:flex;align-items:center;gap:8px;">
                        <span>⚖️ 3. A Lógica da Alternância de Pistas</span>
                    </div>
                    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:12px;">
                        <div style="background:#090D16;border:1px solid #334155;border-radius:12px;padding:12px;font-family:'Fira Code',monospace;font-size:0.85rem;line-height:1.7;">
                            <div style="color:#34D399;">// 1. Semáforo 1 Verde (Carro Vermelho passa):</div>
                            semaforo1_verde(); semaforo2_vermelho();
                            <div style="color:#64748B;">delay(2000);</div>
                            <div style="color:#FBBF24;margin-top:6px;">// 2. Alerta amarelo de desaceleração:</div>
                            semaforo1_amarelo();
                            <div style="color:#64748B;">delay(1000);</div>
                            <div style="color:#38BDF8;margin-top:6px;">// 3. Semáforo 1 fecha e Semáforo 2 abre:</div>
                            semaforo1_vermelho(); semaforo2_verde();
                            <div style="color:#64748B;">delay(2000);</div>
                        </div>
                        <div style="background:rgba(30,41,59,0.7);border-radius:12px;padding:12px;font-size:0.85rem;color:#CBD5E1;line-height:1.6;">
                            <b style="color:#6EE7B7;">🚨 Leis de Trânsito:</b>
                            <ul style="margin:4px 0 0;padding-left:18px;">
                                <li>Carros nunca dão ré no cruzamento! Eles avançam para frente ou param na linha branca.</li>
                                <li>Nunca feche de Verde direto para Vermelho sem o sinal Amarelo de freio!</li>
                                <li>Enquanto o Semáforo 1 for Verde, o Semáforo 2 deve ficar Vermelho!</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <!-- SLIDE 4: TRAVESSIA SEGURA DOS PEDESTRES -->
                <div class="sem-slide-content" id="sem_slide_4">
                    <div style="font-size:1.05rem;font-weight:900;color:#A78BFA;margin-bottom:8px;display:flex;align-items:center;gap:8px;">
                        <span>🚶 4. Fase Exclusiva de Pedestres</span>
                    </div>
                    <p style="margin:0 0 10px;color:#CBD5E1;font-size:0.92rem;line-height:1.6;">
                        Quando o semáforo de pedestre fica verde (<code>pedestre_verde()</code>), <b>todos os semáforos veiculares (1 e 2) devem estar travados no Vermelho</b>! Se qualquer carro avançar enquanto há pedestres na faixa, ocorre perigo imediato!
                    </p>
                    <div style="background:#090D16;border:1px solid #8B5CF6;border-radius:12px;padding:12px;font-family:'Fira Code',monospace;font-size:0.85rem;">
                        semaforo1_vermelho();<br>
                        semaforo2_vermelho();<br>
                        pedestre_verde(); <span style="color:#34D399;">// 🚶 Pedestres atravessam em segurança!</span><br>
                        delay(2500);<br>
                        pedestre_vermelho();
                    </div>
                </div>

                <!-- RODAPÉ DE NAVEGAÇÃO DO GUIA -->
                <div class="sem-guide-footer">
                    <button class="sem-guide-nav-btn" id="sem_guide_prev_btn" onclick="sem_prevGuideSlide()">
                        <i class="fa-solid fa-arrow-left"></i> Anterior
                    </button>
                    <div class="sem-guide-progress-dots">
                        <div class="sem-dot active" id="sem_dot_1"></div>
                        <div class="sem-dot" id="sem_dot_2"></div>
                        <div class="sem-dot" id="sem_dot_3"></div>
                        <div class="sem-dot" id="sem_dot_4"></div>
                    </div>
                    <button class="sem-guide-nav-btn primary" id="sem_guide_next_btn" onclick="sem_nextGuideSlide()">
                        Próximo <i class="fa-solid fa-arrow-right"></i>
                    </button>
                </div>
            </div>

            <!-- BARRA DE SELEÇÃO DOS 4 NÍVEIS -->
            <div class="sem-level-bar">
                <button class="sem-level-btn active" id="sem_btn_lvl_1" onclick="sem_switchLevel(1)">
                    <div class="sem-lvl-left">
                        <div class="sem-lvl-num">1</div>
                        <div class="sem-lvl-info">
                            <span class="sem-lvl-title">Semáforo 1</span>
                            <span class="sem-lvl-sub">Carro Vermelho 🚗</span>
                        </div>
                    </div>
                    <div class="sem-lvl-status"><i class="fa-solid fa-star"></i></div>
                </button>
                <button class="sem-level-btn" id="sem_btn_lvl_2" onclick="sem_switchLevel(2)">
                    <div class="sem-lvl-left">
                        <div class="sem-lvl-num">2</div>
                        <div class="sem-lvl-info">
                            <span class="sem-lvl-title">Semáforo 1 vs 2</span>
                            <span class="sem-lvl-sub">Carro 🚗 vs Carro 🚙</span>
                        </div>
                    </div>
                    <div class="sem-lvl-status"><i class="fa-solid fa-star"></i></div>
                </button>
                <button class="sem-level-btn" id="sem_btn_lvl_3" onclick="sem_switchLevel(3)">
                    <div class="sem-lvl-left">
                        <div class="sem-lvl-num">3</div>
                        <div class="sem-lvl-info">
                            <span class="sem-lvl-title">Semáforo Pedestre 🚸</span>
                            <span class="sem-lvl-sub">Travessia na Faixa 🚶</span>
                        </div>
                    </div>
                    <div class="sem-lvl-status"><i class="fa-solid fa-star"></i></div>
                </button>
                <button class="sem-level-btn" id="sem_btn_lvl_4" onclick="sem_switchLevel(4)">
                    <div class="sem-lvl-left">
                        <div class="sem-lvl-num">4</div>
                        <div class="sem-lvl-info">
                            <span class="sem-lvl-title">Mini-IDE C/C++</span>
                            <span class="sem-lvl-sub">Código Livre Digitado</span>
                        </div>
                    </div>
                    <div class="sem-lvl-status"><i class="fa-solid fa-star"></i></div>
                </button>
            </div>

            <!-- CARD DE HISTÓRIA / MISSÃO ATIVA -->
            <div class="sem-story-card">
                <div class="sem-story-header">
                    <span class="sem-story-title" id="sem_story_title">🎯 Missão 1: Controle do Semáforo 1</span>
                    <span class="sem-story-badge" id="sem_story_badge">Fluxo 1 (Avenida)</span>
                </div>
                <p class="sem-story-text" id="sem_story_desc">
                    O <b>Carro Vermelho 🚗</b> vem acelerando pelo <b>Fluxo 1</b>! Abra o <b>Semáforo 1</b> no Verde por 2 segundos. Em seguida, use a luz <b>Amarela</b> de aviso com <code>delay(1000)</code> para que ele desacelere suavemente e feche no <b>Vermelho</b> para que pare certinho antes da linha branca de retenção sem derrapar!
                </p>
            </div>

            <!-- CENÁRIO GRÁFICO DO CRUZAMENTO DE 2 FLUXOS -->
            <div class="sem-stage-card">
                <!-- HUD DO TRÂNSITO EM TEMPO REAL -->
                <div class="sem-stage-hud">
                    <div class="sem-hud-item">
                        <span style="display:flex;align-items:center;gap:4px;"><span style="background:#EF4444;color:white;border-radius:4px;padding:1px 6px;font-size:0.75rem;">1</span> Semáforo 1:</span>
                        <span class="sem-status-pill green" id="sem_hud_a"><i class="fa-solid fa-circle"></i> VERDE</span>
                    </div>
                    <div class="sem-hud-item">
                        <span style="display:flex;align-items:center;gap:4px;"><span style="background:#38BDF8;color:#0F172A;border-radius:4px;padding:1px 6px;font-size:0.75rem;">2</span> Semáforo 2:</span>
                        <span class="sem-status-pill red" id="sem_hud_b"><i class="fa-solid fa-circle"></i> VERMELHO</span>
                    </div>
                    <div class="sem-hud-item">
                        <span>Semáforo 🚸:</span>
                        <span class="sem-status-pill red" id="sem_hud_ped">🛑 PARE</span>
                    </div>
                    <div class="sem-hud-item">
                        <span style="color:#94A3B8;">Tráfego:</span>
                        <span id="sem_hud_status" style="color:#FBBF24;font-family:'Fredoka One';">🟢 Pista Aberta</span>
                    </div>
                </div>

                <!-- PALCO DE ASFALTO DO CRUZAMENTO -->
                <div class="sem-crossroad-box" id="sem_crossroad">
                    <!-- PISTA HORIZONTAL (FLUXO 1 - AVENIDA) -->
                    <div class="sem-road-h">
                        <div class="sem-road-h-line"></div>
                    </div>

                    <!-- PISTA VERTICAL (FLUXO 2 - RUA) -->
                    <div class="sem-road-v">
                        <div class="sem-road-v-line"></div>
                    </div>

                    <!-- FAIXA DE PEDESTRES ZEBRADA NA ENTRADA OESTE -->
                    <div class="sem-zebra-west" title="Faixa Zebrada de Pedestres"></div>

                    <!-- LINHAS BRANCAS DE PARADA (STOP LINES ANTES DAS FAIXAS) -->
                    <div class="sem-stop-line-west" title="Linha de Retenção do Semáforo 1"></div>
                    <div class="sem-stop-line-north" title="Linha de Retenção do Semáforo 2"></div>

                    <!-- ÁREA CENTRAL DO CRUZAMENTO -->
                    <div class="sem-junction-box"></div>

                    <!-- ================= SEMÁFORO 1 (FLUXO 1 - CARRO VERMELHO 🚗) ================= -->
                    <div class="sem-traffic-post sem-post-1" title="Semáforo 1 (Controla o Carro Vermelho)">
                        <div class="sem-num-badge n1">1</div>
                        <div class="sem-bulb red" id="sem_a_red"></div>
                        <div class="sem-bulb yellow" id="sem_a_yellow"></div>
                        <div class="sem-bulb green on" id="sem_a_green"></div>
                    </div>

                    <!-- ================= SEMÁFORO 2 (FLUXO 2 - CARRO AZUL 🚙) ================= -->
                    <div class="sem-traffic-post sem-post-2" title="Semáforo 2 (Controla o Carro Azul)">
                        <div class="sem-num-badge n2">2</div>
                        <div class="sem-bulb red on" id="sem_b_red"></div>
                        <div class="sem-bulb yellow" id="sem_b_yellow"></div>
                        <div class="sem-bulb green" id="sem_b_green"></div>
                    </div>

                    <!-- ================= SEMÁFORO DE PEDESTRES 🚸 (DESENHO DEDICADO) ================= -->
                    <div class="sem-ped-post" title="Semáforo de Pedestre da Faixa">
                        <div class="sem-ped-sign">🚸 PED</div>
                        <!-- Lente Pare (Boneco Vermelho em Pé) -->
                        <div class="sem-ped-lens red on" id="sem_ped_red" title="Pedestre Pare!">
                            <svg viewBox="0 0 24 24" width="20" height="20" fill="#EF4444">
                                <circle cx="12" cy="4" r="2.5"/>
                                <path d="M14 8h-4c-1.1 0-2 .9-2 2v6h2v6h4v-6h2v-6c0-1.1-.9-2-2-2z"/>
                            </svg>
                        </div>
                        <!-- Lente Siga (Boneco Verde Caminhando) -->
                        <div class="sem-ped-lens green" id="sem_ped_green" title="Pedestre Siga!">
                            <svg viewBox="0 0 24 24" width="20" height="20" fill="#10B981">
                                <circle cx="13" cy="4" r="2.5"/>
                                <path d="M13.5 8.5c-.83 0-1.5.67-1.5 1.5v3.18l-2.09-1.05c-.37-.18-.81-.13-1.12.14l-1.5 1.25 3.32 3.98v5.5h2v-4.5l-1.4-1.68 1.29-2.32 2 1.5V22h2v-6l-2-1.5V10c0-.83-.67-1.5-1.5-1.5z"/>
                            </svg>
                        </div>
                    </div>

                    <!-- VEÍCULOS (FRENTE SEMPRE APONTADA PARA O SENTIDO DO MOVIMENTO!) -->
                    <!-- 1. Carro Vermelho 🚗 (Fluxo 1: Oeste -> Leste, obedece ao Semáforo 1) -->
                    <div class="sem-vehicle" id="sem_car_red" title="Carro Vermelho (Fluxo 1)">
                        <svg viewBox="0 0 100 50">
                            <rect x="5" y="10" width="85" height="30" rx="8" fill="#EF4444" stroke="#B91C1C" stroke-width="2"/>
                            <rect x="25" y="14" width="45" height="22" rx="5" fill="#1E293B" stroke="#991B1B" stroke-width="1.5"/>
                            <rect x="42" y="17" width="24" height="16" rx="3" fill="#67E8F9" opacity="0.9"/>
                            <circle cx="88" cy="14" r="3.5" fill="#FEF08A"/>
                            <circle cx="88" cy="36" r="3.5" fill="#FEF08A"/>
                            <rect x="18" y="5" width="16" height="6" rx="2" fill="#0F172A"/>
                            <rect x="18" y="39" width="16" height="6" rx="2" fill="#0F172A"/>
                            <rect x="62" y="5" width="16" height="6" rx="2" fill="#0F172A"/>
                            <rect x="62" y="39" width="16" height="6" rx="2" fill="#0F172A"/>
                        </svg>
                    </div>

                    <!-- 2. Carro Azul 🚙 (Fluxo 2: Norte -> Sul, obedece ao Semáforo 2) -->
                    <div class="sem-vehicle" id="sem_car_blue" title="Carro Azul (Fluxo 2)">
                        <svg viewBox="0 0 100 50">
                            <rect x="5" y="10" width="85" height="30" rx="8" fill="#38BDF8" stroke="#0284C7" stroke-width="2"/>
                            <rect x="25" y="14" width="45" height="22" rx="5" fill="#0F172A" stroke="#0369A1" stroke-width="1.5"/>
                            <rect x="42" y="17" width="24" height="16" rx="3" fill="#E0F2FE" opacity="0.9"/>
                            <circle cx="88" cy="14" r="3.5" fill="#FEF08A"/>
                            <circle cx="88" cy="36" r="3.5" fill="#FEF08A"/>
                            <rect x="18" y="5" width="16" height="6" rx="2" fill="#0F172A"/>
                            <rect x="18" y="39" width="16" height="6" rx="2" fill="#0F172A"/>
                            <rect x="62" y="5" width="16" height="6" rx="2" fill="#0F172A"/>
                            <rect x="62" y="39" width="16" height="6" rx="2" fill="#0F172A"/>
                        </svg>
                    </div>

                    <!-- PEDESTRE NA CALÇADA DA FAIXA OESTE -->
                    <div class="sem-pedestrian" id="sem_ped_1">🚶</div>

                    <!-- EFEITO VISUAL DE IMPACTO / COLISÃO -->
                    <div class="sem-crash-fx" id="sem_crash_fx">💥</div>
                </div>
            </div>

            <!-- ================= ÁREA DA MINI-IDE E EDITORES ================= -->
            <div class="sem-ide-layout">
                <!-- COLUNA DO EDITOR -->
                <div class="sem-editor-card">
                    <div class="sem-editor-topbar">
                        <div class="sem-editor-title" id="sem_editor_title"><i class="fa-solid fa-code"></i> Temporização em C/C++</div>
                        <div class="sem-lang-tag">Arduino C++</div>
                    </div>

                    <!-- SCAFFOLDING NÍVEL 1 (Parada Segura no Semáforo 1) -->
                    <div id="sem_scaffold_n1" class="sem-scaffold-lines">
                        <div style="background:#1E293B;border-left:3px solid #F59E0B;padding:8px 12px;border-radius:0 8px 8px 0;margin-bottom:12px;color:#FBBF24;font-size:0.82rem;font-weight:700;">
                            💡 Escolha os comandos para fazer o <b>Carro Vermelho 🚗 (Semáforo 1)</b> desacelerar no <b>Amarelo</b> e parar no <b>Vermelho</b> na linha de retenção:
                        </div>
                        <div class="sem-scaffold-line"><span style="color:#64748B;">// 1️⃣ Início: Semáforo 1 Verde (Carro Vermelho avança)</span></div>
                        <div class="sem-scaffold-line">
                            <select class="sem-select-cmd" id="sem_n1_cmd1" onchange="sem_updateLiveCpp()">
                                <option value="" selected disabled>— escolha comando 1 —</option>
                                <option value="semaforo1_verde">semaforo1_verde(); // Semáforo 1 Verde 🟢</option>
                                <option value="semaforo1_amarelo">semaforo1_amarelo();</option>
                                <option value="semaforo1_vermelho">semaforo1_vermelho();</option>
                            </select>
                        </div>
                        <div class="sem-scaffold-line" style="margin-top:6px;">
                            delay( <input type="number" class="sem-input-num" id="sem_n1_delay1" min="500" max="5000" step="500" value="2000" oninput="sem_updateLiveCpp()" /> ); <span style="color:#64748B;">// ms</span>
                        </div>

                        <div class="sem-scaffold-line" style="margin-top:8px;"><span style="color:#64748B;">// 2️⃣ Aviso de Desaceleração: Carro freia na linha branca</span></div>
                        <div class="sem-scaffold-line">
                            <select class="sem-select-cmd" id="sem_n1_cmd2" onchange="sem_updateLiveCpp()">
                                <option value="" selected disabled>— escolha comando 2 —</option>
                                <option value="semaforo1_amarelo">semaforo1_amarelo(); // Semáforo 1 Amarelo 🟡</option>
                                <option value="semaforo1_vermelho">semaforo1_vermelho();</option>
                                <option value="semaforo1_verde">semaforo1_verde();</option>
                            </select>
                        </div>
                        <div class="sem-scaffold-line" style="margin-top:6px;">
                            delay( <input type="number" class="sem-input-num" id="sem_n1_delay2" min="500" max="3000" step="500" value="1000" oninput="sem_updateLiveCpp()" /> ); <span style="color:#64748B;">// ms</span>
                        </div>

                        <div class="sem-scaffold-line" style="margin-top:8px;"><span style="color:#64748B;">// 3️⃣ Fechamento Total: Carro para antes da faixa</span></div>
                        <div class="sem-scaffold-line">
                            <select class="sem-select-cmd" id="sem_n1_cmd3" onchange="sem_updateLiveCpp()">
                                <option value="" selected disabled>— escolha comando 3 —</option>
                                <option value="semaforo1_vermelho">semaforo1_vermelho(); // Semáforo 1 Vermelho 🔴</option>
                                <option value="semaforo1_verde">semaforo1_verde();</option>
                                <option value="semaforo1_amarelo">semaforo1_amarelo();</option>
                            </select>
                        </div>
                    </div>

                    <!-- SCAFFOLDING NÍVEL 2 (Semáforo 1 vs Semáforo 2 sem colisão) -->
                    <div id="sem_scaffold_n2" class="sem-scaffold-lines" style="display:none;">
                        <div style="background:#1E293B;border-left:3px solid #38BDF8;padding:8px 12px;border-radius:0 8px 8px 0;margin-bottom:12px;color:#38BDF8;font-size:0.82rem;font-weight:700;">
                            💡 <b>Ordem Segura:</b> Deixe o <b>Semáforo 1 (Carro Vermelho 🚗)</b> cruzar no Verde enquanto o <b>Semáforo 2 (Carro Azul 🚙)</b> espera no Vermelho; depois feche o 1 e abra o 2!
                        </div>
                        <div class="sem-scaffold-line"><span style="color:#64748B;">// 1️⃣ Fase da Avenida: Semáforo 2 fechado no Vermelho</span></div>
                        <div class="sem-scaffold-line">semaforo2_vermelho(); // Carro Azul espera na linha 🔴</div>
                        <div class="sem-scaffold-line">
                            <select class="sem-select-cmd" id="sem_n2_cmd1" onchange="sem_updateLiveCpp()">
                                <option value="" selected disabled>— ação Semáforo 1 —</option>
                                <option value="semaforo1_verde">semaforo1_verde(); // Carro Vermelho passa 🟢</option>
                                <option value="semaforo1_amarelo">semaforo1_amarelo();</option>
                                <option value="semaforo1_vermelho">semaforo1_vermelho();</option>
                            </select>
                        </div>
                        <div class="sem-scaffold-line">
                            delay( <input type="number" class="sem-input-num" id="sem_n2_delay1" min="1000" max="4000" step="500" value="2000" oninput="sem_updateLiveCpp()" /> );
                        </div>

                        <div class="sem-scaffold-line" style="margin-top:8px;"><span style="color:#64748B;">// 2️⃣ Transição: Alerta Amarelo no Semáforo 1</span></div>
                        <div class="sem-scaffold-line">
                            <select class="sem-select-cmd" id="sem_n2_cmd2" onchange="sem_updateLiveCpp()">
                                <option value="" selected disabled>— aviso de transição —</option>
                                <option value="semaforo1_amarelo">semaforo1_amarelo(); // Amarelo no Semáforo 1 🟡</option>
                                <option value="semaforo1_vermelho">semaforo1_vermelho();</option>
                                <option value="semaforo2_verde">semaforo2_verde();</option>
                            </select>
                        </div>
                        <div class="sem-scaffold-line">
                            delay( 1000 );
                        </div>

                        <div class="sem-scaffold-line" style="margin-top:8px;"><span style="color:#64748B;">// 3️⃣ Fase da Rua: Fecha Semáforo 1 e abre Semáforo 2</span></div>
                        <div class="sem-scaffold-line">semaforo1_vermelho(); // Fecha Semáforo 1 🔴</div>
                        <div class="sem-scaffold-line">
                            <select class="sem-select-cmd" id="sem_n2_cmd3" onchange="sem_updateLiveCpp()">
                                <option value="" selected disabled>— ação Semáforo 2 —</option>
                                <option value="semaforo2_verde">semaforo2_verde(); // Carro Azul desce no Verde 🟢</option>
                                <option value="semaforo2_amarelo">semaforo2_amarelo();</option>
                                <option value="semaforo2_vermelho">semaforo2_vermelho();</option>
                            </select>
                        </div>
                        <div class="sem-scaffold-line">
                            delay( <input type="number" class="sem-input-num" id="sem_n2_delay2" min="1000" max="4000" step="500" value="2000" oninput="sem_updateLiveCpp()" /> );
                        </div>
                    </div>

                    <!-- SCAFFOLDING NÍVEL 3 (Travessia de Pedestres) -->
                    <div id="sem_scaffold_n3" class="sem-scaffold-lines" style="display:none;">
                        <div style="background:#1E293B;border-left:3px solid #10B981;padding:8px 12px;border-radius:0 8px 8px 0;margin-bottom:12px;color:#34D399;font-size:0.82rem;font-weight:700;">
                            💡 <b>Segurança Máxima:</b> Feche o Semáforo 1 e o Semáforo 2 no Vermelho antes de liberar o Pedestre 🚶 no Semáforo 🚸!
                        </div>
                        <div class="sem-scaffold-line"><span style="color:#64748B;">// 1️⃣ Pare os veículos nas linhas brancas</span></div>
                        <div class="sem-scaffold-line">semaforo1_vermelho(); // Semáforo 1 Vermelho 🔴</div>
                        <div class="sem-scaffold-line">semaforo2_vermelho(); // Semáforo 2 Vermelho 🔴</div>
                        <div class="sem-scaffold-line">delay( 800 ); // Aguarda todos pararem</div>

                        <div class="sem-scaffold-line" style="margin-top:8px;"><span style="color:#64748B;">// 2️⃣ Libere a faixa no Semáforo de Pedestre 🚸</span></div>
                        <div class="sem-scaffold-line">
                            <select class="sem-select-cmd" id="sem_n3_cmd1" onchange="sem_updateLiveCpp()">
                                <option value="" selected disabled>— sinal de pedestres —</option>
                                <option value="pedestre_verde">pedestre_verde(); // Boneco Verde Siga 🟢 🚶</option>
                                <option value="pedestre_vermelho">pedestre_vermelho();</option>
                            </select>
                        </div>
                        <div class="sem-scaffold-line">
                            delay( <input type="number" class="sem-input-num" id="sem_n3_delay1" min="1500" max="4000" step="500" value="2500" oninput="sem_updateLiveCpp()" /> ); <span style="color:#64748B;">// Tempo para atravessar</span>
                        </div>

                        <div class="sem-scaffold-line" style="margin-top:8px;"><span style="color:#64748B;">// 3️⃣ Encerre a travessia com segurança</span></div>
                        <div class="sem-scaffold-line">
                            <select class="sem-select-cmd" id="sem_n3_cmd2" onchange="sem_updateLiveCpp()">
                                <option value="" selected disabled>— fechar faixa —</option>
                                <option value="pedestre_vermelho">pedestre_vermelho(); // Boneco Vermelho Pare 🔴 🛑</option>
                                <option value="pedestre_verde">pedestre_verde();</option>
                            </select>
                        </div>
                    </div>

                    <!-- NÍVEL 4 (MINI-IDE LIVRE EM C/C++) -->
                    <div id="sem_ide_n4" style="display:none;">
                        <!-- Teclado de Atalhos Rápidos Numerados -->
                        <div class="sem-shortcuts-bar">
                            <button class="sem-shortcut-btn btn-s1" onclick="sem_insertText('semaforo1_verde();\n')">🟢 S1_verde()</button>
                            <button class="sem-shortcut-btn btn-s1" onclick="sem_insertText('semaforo1_amarelo();\n')">🟡 S1_amarelo()</button>
                            <button class="sem-shortcut-btn btn-s1" onclick="sem_insertText('semaforo1_vermelho();\n')">🔴 S1_vermelho()</button>
                            <button class="sem-shortcut-btn btn-s2" onclick="sem_insertText('semaforo2_verde();\n')">🟢 S2_verde()</button>
                            <button class="sem-shortcut-btn btn-s2" onclick="sem_insertText('semaforo2_amarelo();\n')">🟡 S2_amarelo()</button>
                            <button class="sem-shortcut-btn btn-s2" onclick="sem_insertText('semaforo2_vermelho();\n')">🔴 S2_vermelho()</button>
                            <button class="sem-shortcut-btn btn-ped" onclick="sem_insertText('pedestre_verde();\n')">🚶 ped_verde()</button>
                            <button class="sem-shortcut-btn btn-ped" onclick="sem_insertText('pedestre_vermelho();\n')">🛑 ped_vermelho()</button>
                            <button class="sem-shortcut-btn" onclick="sem_insertText('delay(2000);\n')">⏱️ delay(2000)</button>
                            <button class="sem-shortcut-btn" onclick="sem_insertText('delay(1000);\n')">⏱️ delay(1000)</button>
                            <button class="sem-shortcut-btn clear" onclick="sem_clearIde()"><i class="fa-solid fa-trash"></i> Limpar</button>
                        </div>

                        <!-- Editor Textarea com Numeração de Linhas -->
                        <div class="sem-code-wrapper">
                            <div class="sem-line-numbers" id="sem_line_numbers">1<br>2<br>3<br>4<br>5<br>6<br>7<br>8</div>
                            <textarea class="sem-code-input" id="sem_code_input" spellcheck="false" placeholder="// 🚦 Digite seu código C/C++ do cruzamento aqui!
// Exemplo:
// semaforo1_verde(); delay(2000);
// semaforo1_amarelo(); delay(1000);
// semaforo1_vermelho(); semaforo2_verde(); delay(2000);" oninput="sem_handleIdeInput()" onscroll="document.getElementById('sem_line_numbers').scrollTop = this.scrollTop;"></textarea>
                        </div>

                        <div style="background:#0F172A;border:1px dashed #F59E0B;border-radius:12px;padding:10px 14px;margin-top:10px;font-size:0.82rem;color:#CBD5E1;">
                            <b>📖 Comandos Suportados:</b>
                            <code style="background:#1E293B;color:#EF4444;padding:2px 5px;border-radius:4px;">semaforo1_verde();</code>, 
                            <code style="background:#1E293B;color:#38BDF8;padding:2px 5px;border-radius:4px;">semaforo2_verde();</code>, 
                            <code style="background:#1E293B;color:#10B981;padding:2px 5px;border-radius:4px;">pedestre_verde();</code>, 
                            <code style="background:#1E293B;color:#FBBF24;padding:2px 5px;border-radius:4px;">delay(ms);</code>
                        </div>
                    </div>

                    <!-- Botão de Solução (Aparece após 3 erros) -->
                    <button class="sem-btn-solution" id="sem_btn_solution" onclick="sem_toggleSolution()">
                        <i class="fa-solid fa-lightbulb"></i> <span>💡 Ver Código C/C++ da Solução</span>
                    </button>
                    <div class="sem-solution-card" id="sem_solution_box">
                        <div style="font-weight:900;color:#FBBF24;margin-bottom:6px;font-size:0.88rem;">📋 Resolução Recomendada em C/C++:</div>
                        <pre id="sem_solution_text" style="margin:0;background:#030712;padding:10px;border-radius:8px;border:1px solid #F59E0B;color:#FDE68A;font-family:'Fira Code',monospace;font-size:0.82rem;white-space:pre-wrap;"></pre>
                    </div>

                    <!-- Botões de Execução -->
                    <div class="sem-actions">
                        <button class="sem-btn-run" id="sem_btn_run" onclick="sem_runSimulation()"><i class="fa-solid fa-play"></i> EXECUTAR NO CRUZAMENTO</button>
                        <button class="sem-btn-reset" onclick="sem_resetScene()"><i class="fa-solid fa-rotate-left"></i></button>
                    </div>
                </div>

                <!-- PAINEL CÓDIGO ARDUINO C++ REAL -->
                <div class="arduino-code-panel" style="background:#090D16;border:2px solid #38BDF8;border-radius:20px;padding:16px;box-shadow:0 10px 25px rgba(0,0,0,0.5);">
                    <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #1E293B;padding-bottom:10px;margin-bottom:12px;">
                        <span style="font-weight:900;color:#38BDF8;font-size:0.95rem;"><i class="fa-solid fa-microchip"></i> Código Arduino C++ (Tempo Real)</span>
                        <button onclick="sem_copyCode()" style="background:#334155;color:#38BDF8;border:1px solid #38BDF8;padding:5px 12px;border-radius:8px;font-size:0.8rem;font-weight:800;cursor:pointer;"><i class="fa-regular fa-copy"></i> Copiar C++</button>
                    </div>
                    <pre id="sem_arduino_code" style="margin:0;color:#E2E8F0;font-family:'Fira Code', monospace;font-size:0.82rem;line-height:1.45;white-space:pre-wrap;overflow-x:auto;max-height:360px;"></pre>
                </div>
            </div>
        </div>

        <!-- MODAL DE VITÓRIA / PROGRESSÃO -->
        <div class="sem-modal" id="sem_win_modal">
            <div class="sem-modal-box">
                <div class="sem-modal-icon" id="sem_modal_icon">🏆</div>
                <h2 class="sem-modal-title" id="sem_modal_title">Excelente Direção!</h2>
                <p class="sem-modal-text" id="sem_modal_text">Você programou a ordem e os tempos com perfeição!</p>
                <button class="sem-btn-modal" onclick="sem_closeWinModal()">Avançar para o Próximo Nível 🚀</button>
            </div>
        </div>
    `;

    sem_init();
    document.getElementById('semaforo-loaded')?.remove();
    const flag = document.createElement('div'); flag.id = 'semaforo-loaded'; flag.style.display = 'none'; container.appendChild(flag);
}

/* ==========================================================================
   ESTADO E MÁQUINA DE TRÂNSITO (SEMÁFORO 1 & 2 + PEDESTRES)
   ========================================================================== */

let sem_level = 1;
let sem_guide_slide = 1;
let sem_running = false;
let sem_errors_count = { 1: 0, 2: 0, 3: 0, 4: 0 };

// Posições físicas dos veículos:
// 'start'   -> aproximação
// 'stop'    -> parado na linha branca de retenção antes da faixa
// 'cross'   -> no centro da interseção (usado para colisão)
// 'exit'    -> cruzou e seguiu caminho para frente (NUNCA DE RÉ!)
let sem_carRed_state = 'start';
let sem_carBlue_state = 'start';
let sem_ped_state = 'sidewalk_south';

const sem_levels_data = {
    1: {
        title: 'Missão 1: Controle do Semáforo 1 (Carro Vermelho 🚗)',
        badge: 'Fluxo 1 (Avenida)',
        desc: 'O <b>Carro Vermelho 🚗</b> vem acelerando pelo <b>Fluxo 1</b>! Abra o <b>Semáforo 1</b> no Verde por 2 segundos. Em seguida, use a luz <b>Amarela</b> de aviso com <code>delay(1000)</code> para que ele desacelere suavemente e feche no <b>Vermelho</b> para que pare certinho antes da linha branca de retenção sem derrapar!',
        solution: `// Solução Nível 1:
semaforo1_verde();
delay(2000);
semaforo1_amarelo();
delay(1000);
semaforo1_vermelho();`
    },
    2: {
        title: 'Missão 2: O Grande Cruzamento (Semáforo 1 vs Semáforo 2)',
        badge: 'Semáforo 1 ⚡ Semáforo 2',
        desc: 'Atenção na central! O <b>Carro Vermelho 🚗 (Semáforo 1)</b> e o <b>Carro Azul 🚙 (Semáforo 2)</b> chegam ao mesmo tempo! Se ambos os semáforos ficarem verdes, ELES BATEM no centro! Programe a ordem certa: feche o Semáforo 2 no Vermelho, deixe o Carro Vermelho cruzar no Verde do Semáforo 1; depois alerte no Amarelo, feche o Semáforo 1 e abra o Semáforo 2 no Verde para o Carro Azul descer!',
        solution: `// Solução Nível 2:
semaforo2_vermelho();
semaforo1_verde();
delay(2000);
semaforo1_amarelo();
delay(1000);
semaforo1_vermelho();
semaforo2_verde();
delay(2000);`
    },
    3: {
        title: 'Missão 3: Semáforo de Pedestre 🚸 (Travessia na Faixa)',
        badge: 'Proteção Máxima 🚶',
        desc: 'O <b>Pedestre 🚶</b> precisa atravessar a faixa zebrada! Feche o <b>Semáforo 1</b> e o <b>Semáforo 2</b> no Vermelho para segurança total de todos os carros, abra o <b>Semáforo de Pedestre 🚸</b> no Verde por 2.5 segundos para a travessia e encerre fechando a faixa no Vermelho!',
        solution: `// Solução Nível 3:
semaforo1_vermelho();
semaforo2_vermelho();
delay(800);
pedestre_verde();
delay(2500);
pedestre_vermelho();`
    },
    4: {
        title: 'Missão 4: Programador-Chefe de Trânsito (Mini-IDE)',
        badge: 'Ciclo Completo em C/C++',
        desc: 'Escreva livremente na <b>Mini-IDE</b> o ciclo perpétuo do cruzamento inteligente: Semáforo 1 abre no Verde, transiciona no Amarelo, fecha no Vermelho, Semáforo 2 abre no Verde e fecha, e os Pedestres atravessam em segurança no Semáforo 🚸!',
        solution: `// Solução Nível 4 (Ciclo Completo):
semaforo2_vermelho();
semaforo1_verde();
delay(2000);
semaforo1_amarelo();
delay(1000);
semaforo1_vermelho();
semaforo2_verde();
delay(2000);
semaforo2_amarelo();
delay(1000);
semaforo2_vermelho();
pedestre_verde();
delay(2000);
pedestre_vermelho();`
    }
};

function sem_init() {
    sem_updateLevelButtons();
    sem_switchLevel(1);
    sem_resetScene();
    sem_updateLiveCpp();
}

/* ================= GUIA TEÓRICO / SLIDES ================= */

function sem_toggleGuide() {
    const card = document.getElementById('sem_guide_card');
    const txt = document.getElementById('sem_guide_toggle_txt');
    if (!card) return;
    const isHidden = card.style.display === 'none';
    card.style.display = isHidden ? 'block' : 'none';
    if (txt) txt.innerText = isHidden ? 'Ocultar Guia Teórico' : 'Mostrar Guia Teórico';
}

function sem_switchGuideTab(slideNum) {
    sem_guide_slide = slideNum;
    for (let i = 1; i <= 4; i++) {
        document.getElementById(`sem_slide_${i}`)?.classList.toggle('active', i === slideNum);
        document.getElementById(`sem_tab_g${i}`)?.classList.toggle('active', i === slideNum);
        document.getElementById(`sem_dot_${i}`)?.classList.toggle('active', i === slideNum);
    }
}

function sem_nextGuideSlide() {
    if (sem_guide_slide < 4) sem_switchGuideTab(sem_guide_slide + 1);
    else sem_switchGuideTab(1);
}

function sem_prevGuideSlide() {
    if (sem_guide_slide > 1) sem_switchGuideTab(sem_guide_slide - 1);
    else sem_switchGuideTab(4);
}

/* ================= NAVEGAÇÃO DE NÍVEIS ================= */

function sem_switchLevel(lvl) {
    if (sem_running) return;
    sem_level = lvl;

    for (let i = 1; i <= 4; i++) {
        document.getElementById(`sem_btn_lvl_${i}`)?.classList.toggle('active', i === lvl);
    }

    const scafN1 = document.getElementById('sem_scaffold_n1');
    const scafN2 = document.getElementById('sem_scaffold_n2');
    const scafN3 = document.getElementById('sem_scaffold_n3');
    const ideN4 = document.getElementById('sem_ide_n4');

    if (scafN1) scafN1.style.display = lvl === 1 ? 'block' : 'none';
    if (scafN2) scafN2.style.display = lvl === 2 ? 'block' : 'none';
    if (scafN3) scafN3.style.display = lvl === 3 ? 'block' : 'none';
    if (ideN4) ideN4.style.display = lvl === 4 ? 'block' : 'none';

    const data = sem_levels_data[lvl];
    if (data) {
        const t = document.getElementById('sem_story_title');
        const b = document.getElementById('sem_story_badge');
        const d = document.getElementById('sem_story_desc');
        const solT = document.getElementById('sem_solution_text');
        if (t) t.innerText = `🎯 ${data.title}`;
        if (b) b.innerText = data.badge;
        if (d) d.innerHTML = data.desc;
        if (solT) solT.innerText = data.solution;
    }

    const solBox = document.getElementById('sem_solution_box');
    const solBtn = document.getElementById('sem_btn_solution');
    if (solBox) solBox.style.display = 'none';
    if (solBtn) solBtn.style.display = (sem_errors_count[lvl] >= 3) ? 'flex' : 'none';

    if (lvl === 4) {
        sem_handleIdeInput();
    }

    sem_resetScene();
    sem_updateLiveCpp();
}

function sem_updateLevelButtons() {
    const saved = JSON.parse(localStorage.getItem('semaforo_levels') || '[]');
    for (let i = 1; i <= 4; i++) {
        const btn = document.getElementById(`sem_btn_lvl_${i}`);
        if (!btn) continue;
        const isDone = saved.includes(i);
        btn.classList.toggle('done', isDone);
        const statusEl = btn.querySelector('.sem-lvl-status');
        if (statusEl) {
            statusEl.innerHTML = isDone ? '<i class="fa-solid fa-circle-check" style="color:#10B981;"></i>' : '<i class="fa-solid fa-star"></i>';
        }
    }
}

/* ================= CENÁRIO & FÍSICA DOS VEÍCULOS ================= */

function sem_resetScene() {
    if (sem_level === 1) {
        // Nível 1: Carro Vermelho está na aproximação do Semáforo 1
        sem_carRed_state = 'start';
        sem_carBlue_state = 'stop';
        sem_ped_state = 'sidewalk_south';
        sem_setTrafficLights({ a: 'green', b: 'red', ped: 'red' });
    } else if (sem_level === 2) {
        // Nível 2: Carro Vermelho na aproximação. Carro Azul esperando no Semáforo 2 (linha Norte)
        sem_carRed_state = 'start';
        sem_carBlue_state = 'stop';
        sem_ped_state = 'sidewalk_south';
        sem_setTrafficLights({ a: 'green', b: 'red', ped: 'red' });
    } else if (sem_level === 3) {
        // Nível 3: Todos os carros na linha de parada. Pedestre pronto para atravessar
        sem_carRed_state = 'stop';
        sem_carBlue_state = 'stop';
        sem_ped_state = 'sidewalk_south';
        sem_setTrafficLights({ a: 'red', b: 'red', ped: 'red' });
    } else {
        // Nível 4: Posições padrão para ciclo livre
        sem_carRed_state = 'start';
        sem_carBlue_state = 'stop';
        sem_ped_state = 'sidewalk_south';
        sem_setTrafficLights({ a: 'green', b: 'red', ped: 'red' });
    }

    sem_renderCarPositions(false);

    const crashFx = document.getElementById('sem_crash_fx');
    if (crashFx) crashFx.classList.remove('active');

    const statusHud = document.getElementById('sem_hud_status');
    if (statusHud) {
        statusHud.innerHTML = '🟢 Pista Aberta';
        statusHud.style.color = '#FBBF24';
    }
}

function sem_renderCarPositions(animated = true) {
    const carRed = document.getElementById('sem_car_red');
    const carBlue = document.getElementById('sem_car_blue');
    const ped = document.getElementById('sem_ped_1');

    const transitionStyle = animated ? 'all 1.1s cubic-bezier(0.25, 1, 0.5, 1)' : 'none';

    // 1. Carro Vermelho 🚗 (Fluxo 1 - Semáforo 1: Oeste -> Leste)
    if (carRed) {
        carRed.style.transition = transitionStyle;
        if (sem_carRed_state === 'start') carRed.style.left = '25px';
        else if (sem_carRed_state === 'stop') carRed.style.left = 'calc(50% - 165px)'; // antes da linha branca
        else if (sem_carRed_state === 'cross') carRed.style.left = 'calc(50% - 27px)'; // no centro do cruzamento
        else if (sem_carRed_state === 'exit') carRed.style.left = 'calc(100% - 75px)'; // cruzou para a direita
    }

    // 2. Carro Azul 🚙 (Fluxo 2 - Semáforo 2: Norte -> Sul)
    if (carBlue) {
        carBlue.style.transition = transitionStyle;
        if (sem_carBlue_state === 'start') carBlue.style.top = '20px';
        else if (sem_carBlue_state === 'stop') carBlue.style.top = 'calc(50% - 165px)'; // antes da linha branca norte
        else if (sem_carBlue_state === 'cross') carBlue.style.top = 'calc(50% - 27px)'; // no centro
        else if (sem_carBlue_state === 'exit') carBlue.style.top = 'calc(100% - 50px)'; // cruzou descendo
    }

    // 3. Pedestre 🚶 (Faixa Zebrada Oeste)
    if (ped) {
        ped.style.transition = animated ? 'all 1.4s ease-in-out' : 'none';
        if (sem_ped_state === 'sidewalk_south') {
            ped.style.top = 'calc(50% + 62px)';
            ped.style.left = 'calc(50% - 95px)';
            ped.innerText = '🚶';
        } else if (sem_ped_state === 'crossing') {
            ped.style.top = 'calc(50% - 15px)';
            ped.innerText = '🏃';
        } else if (sem_ped_state === 'sidewalk_north') {
            ped.style.top = 'calc(50% - 95px)';
            ped.innerText = '🚶';
        }
    }
}

function sem_setTrafficLights({ a, b, ped }) {
    // Semáforo 1 (Fluxo 1)
    if (a) {
        document.getElementById('sem_a_red')?.classList.toggle('on', a === 'red');
        document.getElementById('sem_a_yellow')?.classList.toggle('on', a === 'yellow');
        document.getElementById('sem_a_green')?.classList.toggle('on', a === 'green');

        const hudA = document.getElementById('sem_hud_a');
        if (hudA) {
            hudA.className = `sem-status-pill ${a}`;
            hudA.innerHTML = a === 'green' ? '<i class="fa-solid fa-circle"></i> VERDE' :
                             a === 'yellow' ? '<i class="fa-solid fa-circle"></i> AMARELO' :
                             '<i class="fa-solid fa-circle"></i> VERMELHO';
        }
    }

    // Semáforo 2 (Fluxo 2)
    if (b) {
        document.getElementById('sem_b_red')?.classList.toggle('on', b === 'red');
        document.getElementById('sem_b_yellow')?.classList.toggle('on', b === 'yellow');
        document.getElementById('sem_b_green')?.classList.toggle('on', b === 'green');

        const hudB = document.getElementById('sem_hud_b');
        if (hudB) {
            hudB.className = `sem-status-pill ${b}`;
            hudB.innerHTML = b === 'green' ? '<i class="fa-solid fa-circle"></i> VERDE' :
                             b === 'yellow' ? '<i class="fa-solid fa-circle"></i> AMARELO' :
                             '<i class="fa-solid fa-circle"></i> VERMELHO';
        }
    }

    // Semáforo de Pedestre 🚸 (Lentes gráficas com bonecos Pare e Siga)
    if (ped) {
        document.getElementById('sem_ped_red')?.classList.toggle('on', ped === 'red');
        document.getElementById('sem_ped_green')?.classList.toggle('on', ped === 'green');

        const hudPed = document.getElementById('sem_hud_ped');
        if (hudPed) {
            hudPed.className = `sem-status-pill ${ped}`;
            hudPed.innerHTML = ped === 'green' ? '🚶 SIGA' : '🛑 PARE';
        }
    }
}

/* ================= GERADOR DE CÓDIGO C++ & MINI-IDE ================= */

function sem_updateLiveCpp() {
    const el = document.getElementById('sem_arduino_code');
    if (!el) return;

    let loopBody = '';

    if (sem_level === 1) {
        const c1 = document.getElementById('sem_n1_cmd1')?.value || 'semaforo1_verde';
        const d1 = document.getElementById('sem_n1_delay1')?.value || '2000';
        const c2 = document.getElementById('sem_n1_cmd2')?.value || 'semaforo1_amarelo';
        const d2 = document.getElementById('sem_n1_delay2')?.value || '1000';
        const c3 = document.getElementById('sem_n1_cmd3')?.value || 'semaforo1_vermelho';

        loopBody = `  // 1️⃣ Fase Verde do Semáforo 1 (Carro Vermelho passa):\n  digitalWrite(PIN_SEM1_VERDE, HIGH);\n  delay(${d1});\n\n` +
                   `  // 2️⃣ Atenção Amarelo (Carro Vermelho desacelera na linha):\n  digitalWrite(PIN_SEM1_VERDE, LOW);\n  digitalWrite(PIN_SEM1_AMARELO, HIGH);\n  delay(${d2});\n\n` +
                   `  // 3️⃣ Vermelho Total (Carro Vermelho para antes da faixa):\n  digitalWrite(PIN_SEM1_AMARELO, LOW);\n  digitalWrite(PIN_SEM1_VERMELHO, HIGH);`;
    } else if (sem_level === 2) {
        const c1 = document.getElementById('sem_n2_cmd1')?.value || 'semaforo1_verde';
        const d1 = document.getElementById('sem_n2_delay1')?.value || '2000';
        const c2 = document.getElementById('sem_n2_cmd2')?.value || 'semaforo1_amarelo';
        const c3 = document.getElementById('sem_n2_cmd3')?.value || 'semaforo2_verde';
        const d2 = document.getElementById('sem_n2_delay2')?.value || '2000';

        loopBody = `  // Fase 1: Semáforo 1 passa, Semáforo 2 espera no Vermelho:\n  digitalWrite(PIN_SEM2_VERMELHO, HIGH);\n  digitalWrite(PIN_SEM1_VERDE, HIGH);\n  delay(${d1});\n\n` +
                   `  // Fase 2: Amarelo no Semáforo 1:\n  digitalWrite(PIN_SEM1_VERDE, LOW);\n  digitalWrite(PIN_SEM1_AMARELO, HIGH);\n  delay(1000);\n\n` +
                   `  // Fase 3: Fecha Semáforo 1 e Semáforo 2 abre no Verde:\n  digitalWrite(PIN_SEM1_AMARELO, LOW);\n  digitalWrite(PIN_SEM1_VERMELHO, HIGH);\n  digitalWrite(PIN_SEM2_VERMELHO, LOW);\n  digitalWrite(PIN_SEM2_VERDE, HIGH);\n  delay(${d2});`;
    } else if (sem_level === 3) {
        const c1 = document.getElementById('sem_n3_cmd1')?.value || 'pedestre_verde';
        const d1 = document.getElementById('sem_n3_delay1')?.value || '2500';
        const c2 = document.getElementById('sem_n3_cmd2')?.value || 'pedestre_vermelho';

        loopBody = `  // Todos os carros param nas linhas brancas:\n  digitalWrite(PIN_SEM1_VERMELHO, HIGH);\n  digitalWrite(PIN_SEM2_VERMELHO, HIGH);\n  delay(800);\n\n` +
                   `  // Semáforo de Pedestre abre para travessia:\n  digitalWrite(PIN_PEDESTRE_VERDE, HIGH);\n  delay(${d1});\n\n` +
                   `  // Encerra travessia do pedestre:\n  digitalWrite(PIN_PEDESTRE_VERDE, LOW);\n  digitalWrite(PIN_PEDESTRE_VERMELHO, HIGH);`;
    } else if (sem_level === 4) {
        const userCode = document.getElementById('sem_code_input')?.value.trim();
        if (userCode) {
            loopBody = `  // Código digitado na Mini-IDE:\n  ` + userCode.replace(/\n/g, '\n  ');
        } else {
            loopBody = `  // Digite seu código na Mini-IDE para ver o Arduino C++!`;
        }
    }

    const fullCode = `// --- Cruzamento Inteligente da Cidade Maker (Arduino C++) ---\n` +
                     `// Semáforo 1 (Fluxo 1 - Carro Vermelho 🚗):\n` +
                     `const int PIN_SEM1_VERMELHO = 12;\n` +
                     `const int PIN_SEM1_AMARELO  = 11;\n` +
                     `const int PIN_SEM1_VERDE    = 10;\n\n` +
                     `// Semáforo 2 (Fluxo 2 - Carro Azul 🚙):\n` +
                     `const int PIN_SEM2_VERMELHO = 9;\n` +
                     `const int PIN_SEM2_AMARELO  = 8;\n` +
                     `const int PIN_SEM2_VERDE    = 7;\n\n` +
                     `// Semáforo de Pedestre 🚸:\n` +
                     `const int PIN_PEDESTRE_VERMELHO = 6;\n` +
                     `const int PIN_PEDESTRE_VERDE    = 5;\n\n` +
                     `void setup() {\n` +
                     `  pinMode(PIN_SEM1_VERMELHO, OUTPUT);\n` +
                     `  pinMode(PIN_SEM1_AMARELO, OUTPUT);\n` +
                     `  pinMode(PIN_SEM1_VERDE, OUTPUT);\n` +
                     `  pinMode(PIN_SEM2_VERMELHO, OUTPUT);\n` +
                     `  pinMode(PIN_SEM2_AMARELO, OUTPUT);\n` +
                     `  pinMode(PIN_SEM2_VERDE, OUTPUT);\n` +
                     `  pinMode(PIN_PEDESTRE_VERMELHO, OUTPUT);\n` +
                     `  pinMode(PIN_PEDESTRE_VERDE, OUTPUT);\n` +
                     `}\n\n` +
                     `void loop() {\n` +
                     `${loopBody}\n` +
                     `}`;

    el.innerText = fullCode;
}

function sem_copyCode() {
    const code = document.getElementById('sem_arduino_code')?.innerText;
    if (code) {
        navigator.clipboard.writeText(code);
        alert('Código Arduino C++ copiado com sucesso! 📋 Cole no seu Arduino IDE!');
    }
}

function sem_insertText(txt) {
    const textarea = document.getElementById('sem_code_input');
    if (!textarea) return;
    playSound('click');
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const val = textarea.value;
    textarea.value = val.substring(0, start) + txt + val.substring(end);
    textarea.selectionStart = textarea.selectionEnd = start + txt.length;
    textarea.focus();
    sem_handleIdeInput();
}

function sem_clearIde() {
    const textarea = document.getElementById('sem_code_input');
    if (textarea) textarea.value = '';
    playSound('click');
    sem_handleIdeInput();
}

function sem_handleIdeInput() {
    const textarea = document.getElementById('sem_code_input');
    const lineNumbers = document.getElementById('sem_line_numbers');
    if (!textarea || !lineNumbers) return;

    const lines = textarea.value.split('\n').length;
    let nums = '';
    for (let i = 1; i <= Math.max(lines, 8); i++) {
        nums += `${i}<br>`;
    }
    lineNumbers.innerHTML = nums;
    sem_updateLiveCpp();
}

function sem_toggleSolution() {
    const box = document.getElementById('sem_solution_box');
    if (!box) return;
    box.style.display = (box.style.display === 'block') ? 'none' : 'block';
}

function sem_sleep(ms) {
    return new Promise(r => setTimeout(r, ms));
}

/* ================= PARSER DE COMANDOS ================= */

function sem_extractCommands() {
    const cmds = [];

    if (sem_level === 1) {
        const c1 = document.getElementById('sem_n1_cmd1')?.value;
        const d1 = parseInt(document.getElementById('sem_n1_delay1')?.value || '2000');
        const c2 = document.getElementById('sem_n1_cmd2')?.value;
        const d2 = parseInt(document.getElementById('sem_n1_delay2')?.value || '1000');
        const c3 = document.getElementById('sem_n1_cmd3')?.value;

        if (c1) cmds.push({ type: c1 });
        cmds.push({ type: 'delay', ms: d1 });
        if (c2) cmds.push({ type: c2 });
        cmds.push({ type: 'delay', ms: d2 });
        if (c3) cmds.push({ type: c3 });
    } else if (sem_level === 2) {
        const c1 = document.getElementById('sem_n2_cmd1')?.value;
        const d1 = parseInt(document.getElementById('sem_n2_delay1')?.value || '2000');
        const c2 = document.getElementById('sem_n2_cmd2')?.value;
        const c3 = document.getElementById('sem_n2_cmd3')?.value;
        const d2 = parseInt(document.getElementById('sem_n2_delay2')?.value || '2000');

        cmds.push({ type: 'semaforo2_vermelho' });
        if (c1) cmds.push({ type: c1 });
        cmds.push({ type: 'delay', ms: d1 });
        if (c2) cmds.push({ type: c2 });
        cmds.push({ type: 'delay', ms: 1000 });
        cmds.push({ type: 'semaforo1_vermelho' });
        if (c3) cmds.push({ type: c3 });
        cmds.push({ type: 'delay', ms: d2 });
    } else if (sem_level === 3) {
        const c1 = document.getElementById('sem_n3_cmd1')?.value;
        const d1 = parseInt(document.getElementById('sem_n3_delay1')?.value || '2500');
        const c2 = document.getElementById('sem_n3_cmd2')?.value;

        cmds.push({ type: 'semaforo1_vermelho' });
        cmds.push({ type: 'semaforo2_vermelho' });
        cmds.push({ type: 'delay', ms: 800 });
        if (c1) cmds.push({ type: c1 });
        cmds.push({ type: 'delay', ms: d1 });
        if (c2) cmds.push({ type: c2 });
    } else if (sem_level === 4) {
        const text = document.getElementById('sem_code_input')?.value || '';
        const lines = text.split('\n');

        lines.forEach(rawLine => {
            const line = rawLine.split('//')[0].trim();
            if (!line) return;

            // Suporta tanto semaforo1_... quanto semaforoA_...
            if (/semaforo1_verde|semaforoA_verde|PIN_SEM1_VERDE.*HIGH/i.test(line)) cmds.push({ type: 'semaforo1_verde' });
            else if (/semaforo1_amarelo|semaforoA_amarelo|PIN_SEM1_AMARELO.*HIGH/i.test(line)) cmds.push({ type: 'semaforo1_amarelo' });
            else if (/semaforo1_vermelho|semaforoA_vermelho|PIN_SEM1_VERMELHO.*HIGH/i.test(line)) cmds.push({ type: 'semaforo1_vermelho' });
            else if (/semaforo2_verde|semaforoB_verde|PIN_SEM2_VERDE.*HIGH/i.test(line)) cmds.push({ type: 'semaforo2_verde' });
            else if (/semaforo2_amarelo|semaforoB_amarelo|PIN_SEM2_AMARELO.*HIGH/i.test(line)) cmds.push({ type: 'semaforo2_amarelo' });
            else if (/semaforo2_vermelho|semaforoB_vermelho|PIN_SEM2_VERMELHO.*HIGH/i.test(line)) cmds.push({ type: 'semaforo2_vermelho' });
            else if (/pedestre_verde|PIN_PEDESTRE.*HIGH/i.test(line)) cmds.push({ type: 'pedestre_verde' });
            else if (/pedestre_vermelho|PIN_PEDESTRE.*LOW/i.test(line)) cmds.push({ type: 'pedestre_vermelho' });
            else {
                const matchDelay = line.match(/delay\s*\(\s*(\d+)\s*\)/i);
                if (matchDelay) cmds.push({ type: 'delay', ms: parseInt(matchDelay[1]) });
            }
        });
    }

    return cmds;
}

/* ================= MOTOR DE SIMULAÇÃO INTELIGENTE (SEM MANOBRAS DE RÉ) ================= */

async function sem_runSimulation() {
    if (sem_running) return;
    playSound('click');

    const cmds = sem_extractCommands();
    if (cmds.length === 0) {
        alert('Por favor, selecione ou digite os comandos do semáforo antes de executar!');
        return;
    }

    sem_running = true;
    const runBtn = document.getElementById('sem_btn_run');
    if (runBtn) runBtn.disabled = true;

    sem_resetScene();
    await sem_sleep(250);

    let stateA = 'green';
    let stateB = 'red';
    let statePed = 'red';
    let hasHadYellowA = false;
    let hasHadYellowB = false;
    let crashed = false;

    const crashFx = document.getElementById('sem_crash_fx');
    const statusHud = document.getElementById('sem_hud_status');

    for (let i = 0; i < cmds.length; i++) {
        const cmd = cmds[i];

        if (cmd.type === 'semaforo1_verde') {
            stateA = 'green';
            sem_setTrafficLights({ a: 'green' });
            hasHadYellowA = false;
            playSound('step');

            if (sem_carRed_state === 'start' || sem_carRed_state === 'stop') {
                if (stateB === 'green') {
                    sem_carRed_state = 'cross';
                    sem_carBlue_state = 'cross';
                }
            }
        } else if (cmd.type === 'semaforo1_amarelo') {
            stateA = 'yellow';
            sem_setTrafficLights({ a: 'yellow' });
            hasHadYellowA = true;
            playSound('step');

            // Regra: Carro Vermelho na aproximação desacelera e para na linha branca!
            // Se já cruzou ('exit'), CONTINUA EM 'exit' (NUNCA VOLTA DE RÉ!)
            if (sem_carRed_state === 'start') {
                sem_carRed_state = 'stop';
            }
            sem_renderCarPositions(true);
        } else if (cmd.type === 'semaforo1_vermelho') {
            if (stateA === 'green' && !hasHadYellowA && sem_carRed_state === 'start') {
                sem_registerError('Freagem Brusca no Semáforo 1!', 
                    'O Semáforo 1 mudou direto do Verde para o Vermelho! O Carro Vermelho derrapou na pista.', 
                    'Sempre use semaforo1_amarelo() e delay(1000) antes de fechar no Vermelho!', 
                    '⚠️');
                crashed = true;
                break;
            }

            stateA = 'red';
            sem_setTrafficLights({ a: 'red' });
            playSound('step');

            if (sem_carRed_state === 'start') sem_carRed_state = 'stop';
            sem_renderCarPositions(true);
        } else if (cmd.type === 'semaforo2_verde') {
            stateB = 'green';
            sem_setTrafficLights({ b: 'green' });
            hasHadYellowB = false;
            playSound('step');

            if (stateA === 'green') {
                sem_carRed_state = 'cross';
                sem_carBlue_state = 'cross';
            }
        } else if (cmd.type === 'semaforo2_amarelo') {
            stateB = 'yellow';
            sem_setTrafficLights({ b: 'yellow' });
            hasHadYellowB = true;
            playSound('step');

            if (sem_carBlue_state === 'start') sem_carBlue_state = 'stop';
            sem_renderCarPositions(true);
        } else if (cmd.type === 'semaforo2_vermelho') {
            if (stateB === 'green' && !hasHadYellowB && sem_carBlue_state === 'start') {
                sem_registerError('Freagem Brusca no Semáforo 2!', 
                    'O Semáforo 2 fechou direto sem o Amarelo de aviso!', 
                    'Sempre use Amarelo e delay() antes de fechar.', 
                    '⚠️');
                crashed = true;
                break;
            }

            stateB = 'red';
            sem_setTrafficLights({ b: 'red' });
            playSound('step');

            if (sem_carBlue_state === 'start') sem_carBlue_state = 'stop';
            sem_renderCarPositions(true);
        } else if (cmd.type === 'pedestre_verde') {
            statePed = 'green';
            sem_setTrafficLights({ ped: 'green' });
            playSound('step');

            sem_ped_state = 'crossing';
            sem_renderCarPositions(true);
        } else if (cmd.type === 'pedestre_vermelho') {
            statePed = 'red';
            sem_setTrafficLights({ ped: 'red' });
            playSound('step');

            if (sem_ped_state === 'crossing') sem_ped_state = 'sidewalk_north';
            sem_renderCarPositions(true);
        } else if (cmd.type === 'delay') {
            // ================= CHECAGEM DE TRÂNSITO DURANTE O DELAY =================

            // 1. Colisão Carro vs Carro (Semáforo 1 e Semáforo 2 verdes juntos)
            if (stateA === 'green' && stateB === 'green') {
                if (statusHud) { statusHud.innerHTML = '💥 COLISÃO NO CENTRO!'; statusHud.style.color = '#EF4444'; }
                sem_carRed_state = 'cross';
                sem_carBlue_state = 'cross';
                sem_renderCarPositions(true);

                if (crashFx) crashFx.classList.add('active');
                playSound('error');
                await sem_sleep(700);

                sem_registerError('Eita! Batida no Centro! 💥', 
                    'O Carro Vermelho 🚗 (Semáforo 1) e o Carro Azul 🚙 (Semáforo 2) colidiram no cruzamento! Ambos os semáforos ficaram verdes juntos!', 
                    'Quando o Semáforo 1 estiver Verde, o Semáforo 2 DEVE estar Vermelho!', 
                    '💥');
                crashed = true;
                break;
            }

            // 2. Colisão Carro vs Pedestre
            if (statePed === 'green' && (stateA === 'green' || stateB === 'green')) {
                if (statusHud) { statusHud.innerHTML = '🚨 QUASE ATROPELOU O PEDESTRE!'; statusHud.style.color = '#EF4444'; }
                const pedEl = document.getElementById('sem_ped_1');
                if (pedEl) pedEl.innerText = '😱';
                playSound('error');
                await sem_sleep(600);

                sem_registerError('Perigo na Faixa de Pedestres! 🚨', 
                    'O pedestre estava atravessando na faixa e o semáforo dos carros abriu!', 
                    'Enquanto o pedestre atravessa (pedestre_verde), TODOS os semáforos de carros (1 e 2) devem estar no VERMELHO!', 
                    '🚨');
                crashed = true;
                break;
            }

            // Animação suave e proporcional ao delay
            const waitTime = Math.min(2500, Math.max(700, Math.round(cmd.ms * 0.85)));

            // 3. Movimento para frente no verde
            if (stateA === 'green' && stateB === 'red' && statePed === 'red') {
                // Carro Vermelho cruza a avenida para a direita até o final
                if (sem_carRed_state !== 'exit') sem_carRed_state = 'exit';
                sem_renderCarPositions(true);
            } else if (stateB === 'green' && stateA === 'red' && statePed === 'red') {
                // Carro Azul desce cruzando a rua para o sul até o final
                if (sem_carBlue_state !== 'exit') sem_carBlue_state = 'exit';
                sem_renderCarPositions(true);
            } else if (statePed === 'green' && stateA === 'red' && stateB === 'red') {
                // Pedestre cruza a faixa até a calçada norte
                sem_ped_state = 'sidewalk_north';
                sem_renderCarPositions(true);
            }

            await sem_sleep(waitTime);
        }
    }

    if (!crashed) {
        const isSuccess = sem_validateLevelSuccess(cmds);

        if (isSuccess) {
            playSound('success');
            if (typeof triggerConfetti === 'function') triggerConfetti(3500);

            let saved = JSON.parse(localStorage.getItem('semaforo_levels') || '[]');
            if (!saved.includes(sem_level)) saved.push(sem_level);
            localStorage.setItem('semaforo_levels', JSON.stringify(saved));

            if (typeof updateHubProgress === 'function') updateHubProgress();
            if (typeof updateTrail === 'function') updateTrail();
            sem_updateLevelButtons();

            sem_showWinModal();
        } else {
            sem_registerError('Quase lá!', 'A sequência de semáforos não cumpriu todos os passos deste nível.', 'Verifique a ordem recomendada na história da missão!', '❌');
        }
    }

    sem_running = false;
    if (runBtn) runBtn.disabled = false;
}

function sem_validateLevelSuccess(cmds) {
    if (sem_level === 1) {
        // Nível 1: Semáforo 1 Verde -> Amarelo -> Vermelho
        const hasGreen1 = cmds.some(c => c.type === 'semaforo1_verde');
        const hasYellow1 = cmds.some(c => c.type === 'semaforo1_amarelo');
        const hasRed1 = cmds.some(c => c.type === 'semaforo1_vermelho');
        return hasGreen1 && hasYellow1 && hasRed1;
    } else if (sem_level === 2) {
        // Nível 2: Verde 1, depois Amarelo 1, Vermelho 1, e Verde 2 com segurança
        const hasGreen1 = cmds.some(c => c.type === 'semaforo1_verde');
        const hasGreen2 = cmds.some(c => c.type === 'semaforo2_verde');
        const hasRed2 = cmds.some(c => c.type === 'semaforo2_vermelho');
        return hasGreen1 && hasGreen2 && hasRed2;
    } else if (sem_level === 3) {
        // Nível 3: Pedestre Verde com carros em Vermelho
        const hasPedGreen = cmds.some(c => c.type === 'pedestre_verde');
        const hasRed1 = cmds.some(c => c.type === 'semaforo1_vermelho');
        const hasRed2 = cmds.some(c => c.type === 'semaforo2_vermelho');
        return hasPedGreen && hasRed1 && hasRed2;
    } else if (sem_level === 4) {
        // Nível 4: Ciclo Completo com ambos os semáforos e pedestre
        const hasGreen1 = cmds.some(c => c.type === 'semaforo1_verde');
        const hasGreen2 = cmds.some(c => c.type === 'semaforo2_verde');
        const hasPedGreen = cmds.some(c => c.type === 'pedestre_verde');
        return hasGreen1 && hasGreen2 && hasPedGreen;
    }
    return true;
}

function sem_registerError(title, msg, hint, icon) {
    sem_errors_count[sem_level] = (sem_errors_count[sem_level] || 0) + 1;
    const data = sem_levels_data[sem_level];
    const sol = data ? data.solution : '';

    if (typeof triggerErrorSplash === 'function') {
        triggerErrorSplash(title, msg, hint, icon, sol, `semaforo_lvl_${sem_level}`, 3);
    } else {
        alert(`${icon} ${title}\n${msg}\n${hint}`);
    }

    if (sem_errors_count[sem_level] >= 3) {
        const solBtn = document.getElementById('sem_btn_solution');
        if (solBtn) solBtn.style.display = 'flex';
    }
}

function sem_showWinModal() {
    const modal = document.getElementById('sem_win_modal');
    if (!modal) return;

    const titleEl = document.getElementById('sem_modal_title');
    const textEl = document.getElementById('sem_modal_text');

    if (titleEl) titleEl.innerText = `Nível ${sem_level} Concluído! 🏆`;
    if (textEl) {
        if (sem_level === 1) textEl.innerText = 'Você programou a parada perfeita do Carro Vermelho 🚗 na linha branca do Semáforo 1!';
        else if (sem_level === 2) textEl.innerText = 'Excelente! O Carro Vermelho 🚗 (Semáforo 1) e o Carro Azul 🚙 (Semáforo 2) cruzaram com segurança máxima sem nenhuma colisão!';
        else if (sem_level === 3) textEl.innerText = 'Perfeito! O Pedestre 🚶 atravessou a faixa zebrada em segurança total no Semáforo 🚸 enquanto os carros esperaram!';
        else textEl.innerText = 'Você domina completamente a lógica de Semáforos e Temporização em C/C++! Você é o Diretor de Tráfego Maker!';
    }

    modal.classList.add('active');
}

function sem_closeWinModal() {
    const modal = document.getElementById('sem_win_modal');
    if (modal) modal.classList.remove('active');

    if (sem_level < 4) {
        sem_switchLevel(sem_level + 1);
    }
}

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

            /* CENÁRIO GRÁFICO DO CRUZAMENTO DE 4 VIAS */
            .sem-stage-card { background:#090D16; border:2px solid #334155; border-radius:24px; padding:16px; margin-bottom:18px; box-shadow:0 12px 35px rgba(0,0,0,0.6); position:relative; overflow:hidden; }
            .sem-stage-hud { display:flex; justify-content:space-between; align-items:center; background:#0F172A; border:1px solid #1E293B; border-radius:14px; padding:10px 16px; margin-bottom:14px; flex-wrap:wrap; gap:10px; }
            .sem-hud-item { display:flex; align-items:center; gap:8px; font-size:0.85rem; font-weight:800; }
            .sem-status-pill { padding:3px 10px; border-radius:20px; font-weight:900; font-size:0.8rem; display:inline-flex; align-items:center; gap:5px; }
            .sem-status-pill.green { background:rgba(16,185,129,0.2); color:#34D399; border:1px solid #10B981; }
            .sem-status-pill.yellow { background:rgba(245,158,11,0.2); color:#FBBF24; border:1px solid #F59E0B; }
            .sem-status-pill.red { background:rgba(239,68,68,0.2); color:#F87171; border:1px solid #EF4444; }

            .sem-crossroad-box { position:relative; width:100%; height:340px; background:#0B1120; border-radius:18px; border:2px solid #334155; overflow:hidden; box-shadow:inset 0 0 40px rgba(0,0,0,0.8); }
            
            /* PISTAS DE ASFALTO */
            .sem-road-h { position:absolute; top:50%; left:0; width:100%; height:110px; transform:translateY(-50%); background:#1E293B; border-top:3px solid #475569; border-bottom:3px solid #475569; }
            .sem-road-h-line { position:absolute; top:50%; left:0; width:100%; height:2px; transform:translateY(-50%); border-top:3px dashed #F59E0B; opacity:0.85; }
            
            .sem-road-v { position:absolute; top:0; left:50%; width:110px; height:100%; transform:translateX(-50%); background:#1E293B; border-left:3px solid #475569; border-right:3px solid #475569; }
            .sem-road-v-line { position:absolute; top:0; left:50%; width:2px; height:100%; transform:translateX(-50%); border-left:3px dashed #F59E0B; opacity:0.85; }
            
            /* ÁREA CENTRAL DO CRUZAMENTO */
            .sem-junction-box { position:absolute; top:50%; left:50%; width:110px; height:110px; transform:translate(-50%, -50%); background:#172033; border:2px dashed rgba(245,158,11,0.3); z-index:5; }
            
            /* FAIXAS DE PEDESTRES */
            .sem-zebra-west { position:absolute; top:50%; left:calc(50% - 110px); width:32px; height:110px; transform:translateY(-50%); background:repeating-linear-gradient(180deg, #FFFFFF, #FFFFFF 10px, transparent 10px, transparent 20px); opacity:0.85; z-index:6; }
            .sem-zebra-east { position:absolute; top:50%; left:calc(50% + 78px); width:32px; height:110px; transform:translateY(-50%); background:repeating-linear-gradient(180deg, #FFFFFF, #FFFFFF 10px, transparent 10px, transparent 20px); opacity:0.85; z-index:6; }
            .sem-zebra-north { position:absolute; top:calc(50% - 110px); left:50%; width:110px; height:32px; transform:translateX(-50%); background:repeating-linear-gradient(90deg, #FFFFFF, #FFFFFF 10px, transparent 10px, transparent 20px); opacity:0.85; z-index:6; }
            .sem-zebra-south { position:absolute; top:calc(50% + 78px); left:50%; width:110px; height:32px; transform:translateX(-50%); background:repeating-linear-gradient(90deg, #FFFFFF, #FFFFFF 10px, transparent 10px, transparent 20px); opacity:0.85; z-index:6; }

            /* POSTES DE SEMÁFORO ILUMINADOS */
            .sem-post { position:absolute; background:#0F172A; border:2px solid #64748B; border-radius:12px; padding:6px 5px; display:flex; gap:5px; z-index:30; box-shadow:0 6px 15px rgba(0,0,0,0.8); }
            .sem-post.v-dir { flex-direction:column; }
            .sem-bulb { width:16px; height:16px; border-radius:50%; background:#1E293B; border:2px solid #000; transition:all 0.25s; opacity:0.35; }
            .sem-bulb.red.on { background:#EF4444; opacity:1; box-shadow:0 0 16px #EF4444, 0 0 25px #DC2626; }
            .sem-bulb.yellow.on { background:#F59E0B; opacity:1; box-shadow:0 0 16px #F59E0B, 0 0 25px #D97706; }
            .sem-bulb.green.on { background:#10B981; opacity:1; box-shadow:0 0 16px #10B981, 0 0 25px #059669; }

            /* Semáforo A (Avenida - Esquina Noroeste) */
            .sem-post-a { top:calc(50% - 100px); left:calc(50% - 145px); }
            /* Semáforo B (Rua - Esquina Nordeste) */
            .sem-post-b { top:calc(50% - 145px); left:calc(50% + 65px); }
            /* Semáforo de Pedestre (Esquina Sudoeste) */
            .sem-post-ped { top:calc(50% + 65px); left:calc(50% - 145px); display:flex; flex-direction:column; gap:4px; padding:5px; }
            .sem-ped-light { font-size:0.9rem; filter:grayscale(1) opacity(0.3); transition:0.25s all; text-align:center; }
            .sem-ped-light.on { filter:none; opacity:1; transform:scale(1.15); }

            /* CARROS COM SVG VETORIAL E ROTAÇÃO ADEQUADA (NUNCA DE RÉ!) */
            .sem-vehicle { position:absolute; width:52px; height:28px; z-index:20; transition:all 0.5s ease-in-out; filter:drop-shadow(0 4px 6px rgba(0,0,0,0.7)); }
            .sem-vehicle svg { width:100%; height:100%; display:block; }
            
            /* Carro Vermelho 🚗 (Avenida: Oeste -> Leste, virado para 0deg) */
            #sem_car_red { top:calc(50% + 14px); left:20px; }
            /* Carro Azul 🚙 (Rua: Norte -> Sul, virado para 90deg) */
            #sem_car_blue { top:20px; left:calc(50% - 40px); transform:rotate(90deg); transform-origin:center; }
            /* Táxi Amarelo 🚕 (Avenida: Leste -> Oeste, virado para 180deg) */
            #sem_car_yellow { top:calc(50% - 42px); right:20px; transform:rotate(180deg); transform-origin:center; }
            /* Caminhonete Verde 🛻 (Rua: Sul -> Norte, virado para 270deg) */
            #sem_car_green { bottom:20px; left:calc(50% + 14px); transform:rotate(270deg); transform-origin:center; }

            /* PEDESTRE 🚶 NA FAIXA */
            .sem-pedestrian { position:absolute; font-size:1.8rem; z-index:22; filter:drop-shadow(0 4px 4px rgba(0,0,0,0.8)); transition:all 0.8s ease-in-out; }
            #sem_ped_1 { top:calc(50% + 60px); left:calc(50% - 95px); }

            /* EFEITO DE COLISÃO / IMPACTO */
            .sem-crash-fx { position:absolute; top:50%; left:50%; transform:translate(-50%, -50%) scale(0); font-size:4rem; z-index:40; pointer-events:none; transition:transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
            .sem-crash-fx.active { transform:translate(-50%, -50%) scale(1.3); animation:errorShake 0.4s ease-in-out infinite alternate; }

            /* ================= MINI-IDE E EDITORES (SCAFFOLDING & LIVRE) ================= */
            .sem-ide-layout { display:grid; grid-template-columns:repeat(auto-fit, minmax(310px, 1fr)); gap:18px; margin-bottom:15px; width:100%; }
            @media (max-width: 820px) { .sem-ide-layout { grid-template-columns:1fr; } }
            
            .sem-editor-card { background:#090D16; border:2px solid #F59E0B; border-radius:20px; padding:16px; display:flex; flex-direction:column; box-shadow:0 10px 25px rgba(0,0,0,0.5); }
            .sem-editor-topbar { display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #1E293B; padding-bottom:10px; margin-bottom:12px; }
            .sem-editor-title { font-family:'Fredoka One'; color:#FBBF24; font-size:1.05rem; display:flex; align-items:center; gap:8px; }
            .sem-lang-tag { background:rgba(245,158,11,0.2); color:#FBBF24; padding:3px 10px; border-radius:12px; font-size:0.75rem; font-weight:800; border:1px solid #F59E0B; }

            /* TECLADO MAKER DE ATALHOS RÁPIDOS */
            .sem-shortcuts-bar { display:flex; gap:6px; flex-wrap:wrap; margin-bottom:12px; background:#111827; padding:8px; border-radius:12px; border:1px solid #1F2937; }
            .sem-shortcut-btn { background:#1F2937; border:1px solid #374151; color:#E5E7EB; padding:6px 10px; border-radius:8px; font-size:0.78rem; font-weight:800; cursor:pointer; transition:0.15s; font-family:'Nunito', sans-serif; display:flex; align-items:center; gap:4px; }
            .sem-shortcut-btn:hover { background:#F59E0B; border-color:#FBBF24; color:#0F172A; transform:scale(1.03); }
            .sem-shortcut-btn.cmd-green:hover { background:#10B981; border-color:#34D399; color:#0F172A; }
            .sem-shortcut-btn.cmd-yellow:hover { background:#F59E0B; border-color:#FBBF24; color:#0F172A; }
            .sem-shortcut-btn.cmd-red:hover { background:#EF4444; border-color:#F87171; color:white; }
            .sem-shortcut-btn.cmd-ped:hover { background:#8B5CF6; border-color:#A78BFA; color:white; }
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
            .sem-modal-icon { font-size:4rem; margin-bottom:6px; animation:stampPop 0.4s cubic-bezier(0.175,0.885,0.32,1.275); }
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
                    <p>Controle o trânsito da <b>Avenida dos Processadores</b> e da <b>Rua dos Sensores</b> usando <code>delay()</code> em milissegundos para evitar colisões!</p>
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
                        <span>🏙️ 1. O Caos no Cruzamento da Cidade Maker!</span>
                    </div>
                    <p style="margin:0 0 10px;color:#CBD5E1;font-size:0.92rem;line-height:1.6;">
                        O cruzamento central entre a <b>Avenida dos Processadores</b> (Leste-Oeste) e a <b>Rua dos Sensores</b> (Norte-Sul) é o coração da cidade. Carros chegam em alta velocidade por vias perpendiculares:
                    </p>
                    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:10px;margin:12px 0;">
                        <div style="background:#090D16;border:2px solid #EF4444;border-radius:14px;padding:12px;text-align:center;">
                            <div style="font-size:2rem;">🚗</div>
                            <b style="color:#F87171;">Carro Vermelho</b>
                            <div style="font-size:0.78rem;color:#94A3B8;margin-top:4px;">Acelera na Avenida (Oeste ➔ Leste)</div>
                        </div>
                        <div style="background:#090D16;border:2px solid #38BDF8;border-radius:14px;padding:12px;text-align:center;">
                            <div style="font-size:2rem;">🚙</div>
                            <b style="color:#38BDF8;">Carro Azul</b>
                            <div style="font-size:0.78rem;color:#94A3B8;margin-top:4px;">Desce pela Rua (Norte ➔ Sul)</div>
                        </div>
                        <div style="background:#090D16;border:2px solid #10B981;border-radius:14px;padding:12px;text-align:center;">
                            <div style="font-size:2rem;">🚶</div>
                            <b style="color:#34D399;">Pedestres na Faixa</b>
                            <div style="font-size:0.78rem;color:#94A3B8;margin-top:4px;">Precisam atravessar sem perigo!</div>
                        </div>
                    </div>
                    <div style="background:rgba(245,158,11,0.1);border:1px solid #F59E0B;border-radius:12px;padding:10px 14px;color:#FDE68A;font-size:0.85rem;">
                        ⚠️ <b>Regra Suprema:</b> Se dois semáforos de vias perpendiculares ficarem verdes juntos, os carros <b>colidem no meio do cruzamento</b>! Você foi escalado como programador-chefe para automatizar os semáforos com C/C++!
                    </div>
                </div>

                <!-- SLIDE 2: O COMANDO DELAY() -->
                <div class="sem-slide-content" id="sem_slide_2">
                    <div style="font-size:1.05rem;font-weight:900;color:#38BDF8;margin-bottom:8px;display:flex;align-items:center;gap:8px;">
                        <span>⏱️ 2. Como o Arduino mede o Tempo? (<code style="color:#FBBF24;">delay</code>)</span>
                    </div>
                    <p style="margin:0 0 10px;color:#CBD5E1;font-size:0.92rem;line-height:1.6;">
                        O microcontrolador do Arduino é extremamente rápido. Sem pausas, ele mudaria as luzes em microssegundos! Usamos a função <code>delay(milissegundos)</code> para congelar a placa pelo tempo necessário:
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
                            <div style="color:#34D399;">// 1. Avenida passa:</div>
                            semaforoA_verde(); semaforoB_vermelho();
                            <div style="color:#64748B;">delay(2000);</div>
                            <div style="color:#FBBF24;margin-top:6px;">// 2. Alerta amarelo de desaceleração:</div>
                            semaforoA_amarelo();
                            <div style="color:#64748B;">delay(1000);</div>
                            <div style="color:#38BDF8;margin-top:6px;">// 3. Rua transversal passa:</div>
                            semaforoA_vermelho(); semaforoB_verde();
                            <div style="color:#64748B;">delay(2000);</div>
                        </div>
                        <div style="background:rgba(30,41,59,0.7);border-radius:12px;padding:12px;font-size:0.85rem;color:#CBD5E1;line-height:1.6;">
                            <b style="color:#6EE7B7;">🚨 Regras de Segurança:</b>
                            <ul style="margin:4px 0 0;padding-left:18px;">
                                <li>Nunca feche de Verde direto para Vermelho sem o sinal Amarelo de freio!</li>
                                <li>Enquanto o Semáforo A for Verde ou Amarelo, o Semáforo B deve ficar obrigatoriamente Vermelho!</li>
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
                        Quando o semáforo de pedestre fica verde (<code>pedestre_verde()</code>), <b>todos os semáforos veiculares (A e B) devem estar travados no Vermelho</b>! Se qualquer carro avançar enquanto há pedestres na faixa, ocorre perigo imediato!
                    </p>
                    <div style="background:#090D16;border:1px solid #8B5CF6;border-radius:12px;padding:12px;font-family:'Fira Code',monospace;font-size:0.85rem;">
                        semaforoA_vermelho();<br>
                        semaforoB_vermelho();<br>
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
                            <span class="sem-lvl-title">Parada Segura</span>
                            <span class="sem-lvl-sub">Carro Vermelho 🚗</span>
                        </div>
                    </div>
                    <div class="sem-lvl-status"><i class="fa-solid fa-star"></i></div>
                </button>
                <button class="sem-level-btn" id="sem_btn_lvl_2" onclick="sem_switchLevel(2)">
                    <div class="sem-lvl-left">
                        <div class="sem-lvl-num">2</div>
                        <div class="sem-lvl-info">
                            <span class="sem-lvl-title">O Grande Cruzamento</span>
                            <span class="sem-lvl-sub">Carro 🚗 vs Carro 🚙</span>
                        </div>
                    </div>
                    <div class="sem-lvl-status"><i class="fa-solid fa-star"></i></div>
                </button>
                <button class="sem-level-btn" id="sem_btn_lvl_3" onclick="sem_switchLevel(3)">
                    <div class="sem-lvl-left">
                        <div class="sem-lvl-num">3</div>
                        <div class="sem-lvl-info">
                            <span class="sem-lvl-title">Travessia na Faixa</span>
                            <span class="sem-lvl-sub">Proteção aos Pedestres 🚶</span>
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
                    <span class="sem-story-title" id="sem_story_title">🎯 Missão 1: Parada Segura na Faixa</span>
                    <span class="sem-story-badge" id="sem_story_badge">Avenida dos Processadores</span>
                </div>
                <p class="sem-story-text" id="sem_story_desc">
                    O <b>Carro Vermelho 🚗</b> vem acelerando pela Avenida! O semáforo deve ficar Verde por 2 segundos, alertar no Amarelo por 1 segundo e fechar no Vermelho para ele frear com total segurança antes da faixa de pedestres!
                </p>
            </div>

            <!-- CENÁRIO GRÁFICO DO CRUZAMENTO DE 4 VIAS -->
            <div class="sem-stage-card">
                <!-- HUD DO TRÂNSITO EM TEMPO REAL -->
                <div class="sem-stage-hud">
                    <div class="sem-hud-item">
                        <span>Avenida (A):</span>
                        <span class="sem-status-pill green" id="sem_hud_a"><i class="fa-solid fa-circle"></i> VERDE</span>
                    </div>
                    <div class="sem-hud-item">
                        <span>Rua (B):</span>
                        <span class="sem-status-pill red" id="sem_hud_b"><i class="fa-solid fa-circle"></i> VERMELHO</span>
                    </div>
                    <div class="sem-hud-item">
                        <span>Pedestre:</span>
                        <span class="sem-status-pill red" id="sem_hud_ped">🛑 PARE</span>
                    </div>
                    <div class="sem-hud-item">
                        <span style="color:#94A3B8;">Tráfego:</span>
                        <span id="sem_hud_status" style="color:#FBBF24;font-family:'Fredoka One';">🟢 Pista Aberta</span>
                    </div>
                </div>

                <!-- PALCO DE ASFALTO DO CRUZAMENTO -->
                <div class="sem-crossroad-box" id="sem_crossroad">
                    <!-- PISTA HORIZONTAL (AVENIDA DOS PROCESSADORES) -->
                    <div class="sem-road-h">
                        <div class="sem-road-h-line"></div>
                    </div>

                    <!-- PISTA VERTICAL (RUA DOS SENSORES) -->
                    <div class="sem-road-v">
                        <div class="sem-road-v-line"></div>
                    </div>

                    <!-- FAIXAS DE PEDESTRES ZEBRADAS -->
                    <div class="sem-zebra-west"></div>
                    <div class="sem-zebra-east"></div>
                    <div class="sem-zebra-north"></div>
                    <div class="sem-zebra-south"></div>

                    <!-- ÁREA CENTRAL DO CRUZAMENTO -->
                    <div class="sem-junction-box"></div>

                    <!-- POSTES DE SEMÁFORO ILUMINADOS -->
                    <!-- Semáforo A (Avenida) -->
                    <div class="sem-post sem-post-a" title="Semáforo A (Avenida)">
                        <div class="sem-bulb red" id="sem_a_red"></div>
                        <div class="sem-bulb yellow" id="sem_a_yellow"></div>
                        <div class="sem-bulb green on" id="sem_a_green"></div>
                    </div>

                    <!-- Semáforo B (Rua) -->
                    <div class="sem-post sem-post-b v-dir" title="Semáforo B (Rua)">
                        <div class="sem-bulb red on" id="sem_b_red"></div>
                        <div class="sem-bulb yellow" id="sem_b_yellow"></div>
                        <div class="sem-bulb green" id="sem_b_green"></div>
                    </div>

                    <!-- Semáforo Pedestre -->
                    <div class="sem-post sem-post-ped" title="Semáforo de Pedestre">
                        <div class="sem-ped-light on" id="sem_ped_red">🛑</div>
                        <div class="sem-ped-light" id="sem_ped_green">🚶</div>
                    </div>

                    <!-- VEÍCULOS VETORIAIS (FRENTE SEMPRE APONTADA PARA O SENTIDO DO MOVIMENTO!) -->
                    <!-- 1. Carro Vermelho 🚗 (Oeste -> Leste) -->
                    <div class="sem-vehicle" id="sem_car_red" title="Carro Vermelho (Avenida)">
                        <svg viewBox="0 0 100 50">
                            <!-- Corpo do Carro -->
                            <rect x="5" y="10" width="85" height="30" rx="8" fill="#EF4444" stroke="#B91C1C" stroke-width="2"/>
                            <!-- Teto / Cabine -->
                            <rect x="25" y="14" width="45" height="22" rx="5" fill="#1E293B" stroke="#991B1B" stroke-width="1.5"/>
                            <rect x="42" y="17" width="24" height="16" rx="3" fill="#67E8F9" opacity="0.9"/>
                            <!-- Faróis Dianteiros (Leste) -->
                            <circle cx="88" cy="14" r="3.5" fill="#FEF08A"/>
                            <circle cx="88" cy="36" r="3.5" fill="#FEF08A"/>
                            <!-- Rodas -->
                            <rect x="18" y="5" width="16" height="6" rx="2" fill="#0F172A"/>
                            <rect x="18" y="39" width="16" height="6" rx="2" fill="#0F172A"/>
                            <rect x="62" y="5" width="16" height="6" rx="2" fill="#0F172A"/>
                            <rect x="62" y="39" width="16" height="6" rx="2" fill="#0F172A"/>
                        </svg>
                    </div>

                    <!-- 2. Carro Azul 🚙 (Norte -> Sul) -->
                    <div class="sem-vehicle" id="sem_car_blue" title="Carro Azul (Rua)">
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

                    <!-- 3. Táxi Amarelo 🚕 (Leste -> Oeste) -->
                    <div class="sem-vehicle" id="sem_car_yellow" title="Táxi Amarelo (Avenida Retorno)">
                        <svg viewBox="0 0 100 50">
                            <rect x="5" y="10" width="85" height="30" rx="8" fill="#F59E0B" stroke="#B45309" stroke-width="2"/>
                            <rect x="25" y="14" width="45" height="22" rx="5" fill="#1E293B" stroke="#92400E" stroke-width="1.5"/>
                            <rect x="42" y="17" width="24" height="16" rx="3" fill="#FEF3C7" opacity="0.9"/>
                            <rect x="44" y="8" width="12" height="5" rx="2" fill="#0F172A" stroke="#FBBF24" stroke-width="1"/>
                            <circle cx="88" cy="14" r="3.5" fill="#FEF08A"/>
                            <circle cx="88" cy="36" r="3.5" fill="#FEF08A"/>
                            <rect x="18" y="5" width="16" height="6" rx="2" fill="#0F172A"/>
                            <rect x="18" y="39" width="16" height="6" rx="2" fill="#0F172A"/>
                            <rect x="62" y="5" width="16" height="6" rx="2" fill="#0F172A"/>
                            <rect x="62" y="39" width="16" height="6" rx="2" fill="#0F172A"/>
                        </svg>
                    </div>

                    <!-- 4. Caminhonete Verde 🛻 (Sul -> Norte) -->
                    <div class="sem-vehicle" id="sem_car_green" title="Caminhonete Verde (Rua Retorno)">
                        <svg viewBox="0 0 100 50">
                            <rect x="5" y="10" width="85" height="30" rx="6" fill="#10B981" stroke="#047857" stroke-width="2"/>
                            <rect x="22" y="13" width="38" height="24" rx="4" fill="#064E3B" stroke="#059669" stroke-width="1.5"/>
                            <rect x="36" y="16" width="20" height="18" rx="3" fill="#D1FAE5" opacity="0.9"/>
                            <rect x="65" y="14" width="22" height="22" rx="2" fill="#0F172A" stroke="#047857" stroke-width="1"/>
                            <circle cx="88" cy="14" r="3.5" fill="#FEF08A"/>
                            <circle cx="88" cy="36" r="3.5" fill="#FEF08A"/>
                            <rect x="16" y="5" width="16" height="6" rx="2" fill="#0F172A"/>
                            <rect x="16" y="39" width="16" height="6" rx="2" fill="#0F172A"/>
                            <rect x="64" y="5" width="16" height="6" rx="2" fill="#0F172A"/>
                            <rect x="64" y="39" width="16" height="6" rx="2" fill="#0F172A"/>
                        </svg>
                    </div>

                    <!-- PEDESTRE NA CALÇADA DA FAIXA -->
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

                    <!-- SCAFFOLDING NÍVEL 1 (Parada Segura Carro Vermelho) -->
                    <div id="sem_scaffold_n1" class="sem-scaffold-lines">
                        <div style="background:#1E293B;border-left:3px solid #F59E0B;padding:8px 12px;border-radius:0 8px 8px 0;margin-bottom:12px;color:#FBBF24;font-size:0.82rem;font-weight:700;">
                            💡 Escolha os comandos para fazer o <b>Carro Vermelho 🚗</b> passar e parar no Vermelho com segurança:
                        </div>
                        <div class="sem-scaffold-line" id="sem_n1_l1"><span style="color:#64748B;">// 1️⃣ Início: Semáforo da Avenida aberto</span></div>
                        <div class="sem-scaffold-line" id="sem_n1_l2">
                            <select class="sem-select-cmd" id="sem_n1_cmd1" onchange="sem_updateLiveCpp()">
                                <option value="" selected disabled>— escolha comando 1 —</option>
                                <option value="semaforoA_verde">semaforoA_verde(); // Sinal Verde 🟢</option>
                                <option value="semaforoA_amarelo">semaforoA_amarelo();</option>
                                <option value="semaforoA_vermelho">semaforoA_vermelho();</option>
                            </select>
                        </div>
                        <div class="sem-scaffold-line" id="sem_n1_l3" style="margin-top:6px;">
                            delay( <input type="number" class="sem-input-num" id="sem_n1_delay1" min="500" max="5000" step="500" value="2000" oninput="sem_updateLiveCpp()" /> ); <span style="color:#64748B;">// ms</span>
                        </div>

                        <div class="sem-scaffold-line" id="sem_n1_l4" style="margin-top:8px;"><span style="color:#64748B;">// 2️⃣ Alerta Amarelo de Atenção:</span></div>
                        <div class="sem-scaffold-line" id="sem_n1_l5">
                            <select class="sem-select-cmd" id="sem_n1_cmd2" onchange="sem_updateLiveCpp()">
                                <option value="" selected disabled>— escolha comando 2 —</option>
                                <option value="semaforoA_amarelo">semaforoA_amarelo(); // Atenção 🟡</option>
                                <option value="semaforoA_vermelho">semaforoA_vermelho();</option>
                                <option value="semaforoA_verde">semaforoA_verde();</option>
                            </select>
                        </div>
                        <div class="sem-scaffold-line" id="sem_n1_l6" style="margin-top:6px;">
                            delay( <input type="number" class="sem-input-num" id="sem_n1_delay2" min="500" max="3000" step="500" value="1000" oninput="sem_updateLiveCpp()" /> ); <span style="color:#64748B;">// ms</span>
                        </div>

                        <div class="sem-scaffold-line" id="sem_n1_l7" style="margin-top:8px;"><span style="color:#64748B;">// 3️⃣ Fechamento do Sinal:</span></div>
                        <div class="sem-scaffold-line" id="sem_n1_l8">
                            <select class="sem-select-cmd" id="sem_n1_cmd3" onchange="sem_updateLiveCpp()">
                                <option value="" selected disabled>— escolha comando 3 —</option>
                                <option value="semaforoA_vermelho">semaforoA_vermelho(); // Pare na Linha 🔴</option>
                                <option value="semaforoA_verde">semaforoA_verde();</option>
                                <option value="semaforoA_amarelo">semaforoA_amarelo();</option>
                            </select>
                        </div>
                    </div>

                    <!-- SCAFFOLDING NÍVEL 2 (Carro Vermelho vs Carro Azul sem colisão) -->
                    <div id="sem_scaffold_n2" class="sem-scaffold-lines" style="display:none;">
                        <div style="background:#1E293B;border-left:3px solid #38BDF8;padding:8px 12px;border-radius:0 8px 8px 0;margin-bottom:12px;color:#38BDF8;font-size:0.82rem;font-weight:700;">
                            💡 Programe a ordem do cruzamento: <b>Carro Vermelho 🚗 passa primeiro</b> enquanto o Azul espera; depois abra para o <b>Carro Azul 🚙</b>!
                        </div>
                        <div class="sem-scaffold-line"><span style="color:#64748B;">// 1️⃣ Fase da Avenida: Carro Vermelho passa no Verde</span></div>
                        <div class="sem-scaffold-line">
                            semaforoB_vermelho(); // Rua fechada 🔴
                        </div>
                        <div class="sem-scaffold-line">
                            <select class="sem-select-cmd" id="sem_n2_cmd1" onchange="sem_updateLiveCpp()">
                                <option value="" selected disabled>— ação Semáforo A —</option>
                                <option value="semaforoA_verde">semaforoA_verde(); // Avenida Verde 🟢</option>
                                <option value="semaforoA_amarelo">semaforoA_amarelo();</option>
                                <option value="semaforoA_vermelho">semaforoA_vermelho();</option>
                            </select>
                        </div>
                        <div class="sem-scaffold-line">
                            delay( <input type="number" class="sem-input-num" id="sem_n2_delay1" min="1000" max="4000" step="500" value="2000" oninput="sem_updateLiveCpp()" /> );
                        </div>

                        <div class="sem-scaffold-line" style="margin-top:8px;"><span style="color:#64748B;">// 2️⃣ Transição: Alerta Amarelo na Avenida</span></div>
                        <div class="sem-scaffold-line">
                            <select class="sem-select-cmd" id="sem_n2_cmd2" onchange="sem_updateLiveCpp()">
                                <option value="" selected disabled>— aviso de transição —</option>
                                <option value="semaforoA_amarelo">semaforoA_amarelo(); // Amarelo na Avenida 🟡</option>
                                <option value="semaforoA_vermelho">semaforoA_vermelho();</option>
                                <option value="semaforoB_verde">semaforoB_verde();</option>
                            </select>
                        </div>
                        <div class="sem-scaffold-line">
                            delay( 1000 );
                        </div>

                        <div class="sem-scaffold-line" style="margin-top:8px;"><span style="color:#64748B;">// 3️⃣ Fase da Rua: Fecha Avenida e abre Carro Azul</span></div>
                        <div class="sem-scaffold-line">
                            semaforoA_vermelho(); // Fecha Avenida 🔴
                        </div>
                        <div class="sem-scaffold-line">
                            <select class="sem-select-cmd" id="sem_n2_cmd3" onchange="sem_updateLiveCpp()">
                                <option value="" selected disabled>— ação Semáforo B —</option>
                                <option value="semaforoB_verde">semaforoB_verde(); // Abre Rua dos Sensores 🟢</option>
                                <option value="semaforoB_amarelo">semaforoB_amarelo();</option>
                                <option value="semaforoB_vermelho">semaforoB_vermelho();</option>
                            </select>
                        </div>
                        <div class="sem-scaffold-line">
                            delay( <input type="number" class="sem-input-num" id="sem_n2_delay2" min="1000" max="4000" step="500" value="2000" oninput="sem_updateLiveCpp()" /> );
                        </div>
                    </div>

                    <!-- SCAFFOLDING NÍVEL 3 (Travessia de Pedestres) -->
                    <div id="sem_scaffold_n3" class="sem-scaffold-lines" style="display:none;">
                        <div style="background:#1E293B;border-left:3px solid #10B981;padding:8px 12px;border-radius:0 8px 8px 0;margin-bottom:12px;color:#34D399;font-size:0.82rem;font-weight:700;">
                            💡 <b>Segurança Máxima:</b> Feche todos os carros no Vermelho antes de liberar o Pedestre 🚶 na faixa!
                        </div>
                        <div class="sem-scaffold-line"><span style="color:#64748B;">// 1️⃣ Pare todos os veículos das vias</span></div>
                        <div class="sem-scaffold-line">semaforoA_vermelho(); // Pare na Avenida 🔴</div>
                        <div class="sem-scaffold-line">semaforoB_vermelho(); // Pare na Rua 🔴</div>
                        <div class="sem-scaffold-line">delay( 800 ); // Aguarda todos os carros pararem</div>

                        <div class="sem-scaffold-line" style="margin-top:8px;"><span style="color:#64748B;">// 2️⃣ Libere a faixa para os pedestres</span></div>
                        <div class="sem-scaffold-line">
                            <select class="sem-select-cmd" id="sem_n3_cmd1" onchange="sem_updateLiveCpp()">
                                <option value="" selected disabled>— sinal de pedestres —</option>
                                <option value="pedestre_verde">pedestre_verde(); // Faixa Aberta 🟢 🚶</option>
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
                                <option value="pedestre_vermelho">pedestre_vermelho(); // Faixa Fechada 🔴 🛑</option>
                                <option value="pedestre_verde">pedestre_verde();</option>
                            </select>
                        </div>
                    </div>

                    <!-- NÍVEL 4 (MINI-IDE LIVRE EM C/C++) -->
                    <div id="sem_ide_n4" style="display:none;">
                        <!-- Teclado de Atalhos Rápidos -->
                        <div class="sem-shortcuts-bar">
                            <button class="sem-shortcut-btn cmd-green" onclick="sem_insertText('semaforoA_verde();\n')">🟢 A_verde()</button>
                            <button class="sem-shortcut-btn cmd-yellow" onclick="sem_insertText('semaforoA_amarelo();\n')">🟡 A_amarelo()</button>
                            <button class="sem-shortcut-btn cmd-red" onclick="sem_insertText('semaforoA_vermelho();\n')">🔴 A_vermelho()</button>
                            <button class="sem-shortcut-btn cmd-green" onclick="sem_insertText('semaforoB_verde();\n')">🟢 B_verde()</button>
                            <button class="sem-shortcut-btn cmd-yellow" onclick="sem_insertText('semaforoB_amarelo();\n')">🟡 B_amarelo()</button>
                            <button class="sem-shortcut-btn cmd-red" onclick="sem_insertText('semaforoB_vermelho();\n')">🔴 B_vermelho()</button>
                            <button class="sem-shortcut-btn cmd-ped" onclick="sem_insertText('pedestre_verde();\n')">🚶 ped_verde()</button>
                            <button class="sem-shortcut-btn cmd-ped" onclick="sem_insertText('pedestre_vermelho();\n')">🛑 ped_vermelho()</button>
                            <button class="sem-shortcut-btn" onclick="sem_insertText('delay(2000);\n')">⏱️ delay(2000)</button>
                            <button class="sem-shortcut-btn" onclick="sem_insertText('delay(1000);\n')">⏱️ delay(1000)</button>
                            <button class="sem-shortcut-btn clear" onclick="sem_clearIde()"><i class="fa-solid fa-trash"></i> Limpar</button>
                        </div>

                        <!-- Editor Textarea com Numeração de Linhas -->
                        <div class="sem-code-wrapper">
                            <div class="sem-line-numbers" id="sem_line_numbers">1<br>2<br>3<br>4<br>5<br>6<br>7<br>8</div>
                            <textarea class="sem-code-input" id="sem_code_input" spellcheck="false" placeholder="// 🚦 Digite seu código C/C++ do cruzamento aqui!
// Exemplo:
// semaforoA_verde(); delay(2000);
// semaforoA_amarelo(); delay(1000);
// semaforoA_vermelho(); semaforoB_verde(); delay(2000);" oninput="sem_handleIdeInput()" onscroll="document.getElementById('sem_line_numbers').scrollTop = this.scrollTop;"></textarea>
                        </div>

                        <div style="background:#0F172A;border:1px dashed #F59E0B;border-radius:12px;padding:10px 14px;margin-top:10px;font-size:0.82rem;color:#CBD5E1;">
                            <b>📖 Comandos Suportados:</b>
                            <code style="background:#1E293B;color:#34D399;padding:2px 5px;border-radius:4px;">semaforoA_verde();</code>, 
                            <code style="background:#1E293B;color:#FBBF24;padding:2px 5px;border-radius:4px;">semaforoA_amarelo();</code>, 
                            <code style="background:#1E293B;color:#F87171;padding:2px 5px;border-radius:4px;">semaforoA_vermelho();</code>, 
                            <code style="background:#1E293B;color:#38BDF8;padding:2px 5px;border-radius:4px;">delay(ms);</code>
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
   ESTADO E LÓGICA DO JOGO (ESCOPO GLOBAL)
   ========================================================================== */

let sem_level = 1;
let sem_guide_slide = 1;
let sem_running = false;
let sem_errors_count = { 1: 0, 2: 0, 3: 0, 4: 0 };

const sem_levels_data = {
    1: {
        title: 'Missão 1: Parada Segura na Faixa',
        badge: 'Avenida dos Processadores',
        desc: 'O <b>Carro Vermelho 🚗</b> vem acelerando pela Avenida! O semáforo deve ficar Verde por 2 segundos, alertar no Amarelo por 1 segundo e fechar no Vermelho para ele frear com total segurança antes da faixa de pedestres!',
        solution: `// Solução Nível 1:
semaforoA_verde();
delay(2000);
semaforoA_amarelo();
delay(1000);
semaforoA_vermelho();`
    },
    2: {
        title: 'Missão 2: O Grande Cruzamento (Carro A vs Carro B)',
        badge: 'Avenida ⚡ Rua Perpendicular',
        desc: 'Atenção na central! O <b>Carro Vermelho 🚗</b> vem na horizontal e o <b>Carro Azul 🚙</b> vem descendo pelo Norte! Se ambos passarem juntos, ELES COLIDEM no centro! Programe a alternância: a Avenida passa no Verde enquanto a Rua espera no Vermelho; depois alerte no Amarelo e libere a Rua no Verde!',
        solution: `// Solução Nível 2:
semaforoB_vermelho();
semaforoA_verde();
delay(2000);
semaforoA_amarelo();
delay(1000);
semaforoA_vermelho();
semaforoB_verde();
delay(2000);`
    },
    3: {
        title: 'Missão 3: Travessia Segura dos Pedestres',
        badge: 'Proteção Máxima 🚶',
        desc: 'Os <b>Pedestres 🚶</b> precisam atravessar a faixa de pedestres! Feche TODOS os semáforos dos carros no Vermelho por segurança, abra o sinal de pedestres por 2.5 segundos para a travessia e encerre fechando a faixa!',
        solution: `// Solução Nível 3:
semaforoA_vermelho();
semaforoB_vermelho();
delay(800);
pedestre_verde();
delay(2500);
pedestre_vermelho();`
    },
    4: {
        title: 'Missão 4: Programador-Chefe de Trânsito (Mini-IDE)',
        badge: 'Ciclo Completo em C/C++',
        desc: 'Escreva livremente na <b>Mini-IDE</b> o ciclo perpétuo e completo do cruzamento: Avenida abre no Verde, transiciona no Amarelo, fecha no Vermelho, Rua abre no Verde e fecha, e os Pedestres atravessam em segurança!',
        solution: `// Solução Nível 4 (Ciclo Completo):
semaforoB_vermelho();
semaforoA_verde();
delay(2000);
semaforoA_amarelo();
delay(1000);
semaforoA_vermelho();
semaforoB_verde();
delay(2000);
semaforoB_amarelo();
delay(1000);
semaforoB_vermelho();
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

    // Atualiza botões da barra de nível
    for (let i = 1; i <= 4; i++) {
        document.getElementById(`sem_btn_lvl_${i}`)?.classList.toggle('active', i === lvl);
    }

    // Alterna view do editor conforme o nível
    const scafN1 = document.getElementById('sem_scaffold_n1');
    const scafN2 = document.getElementById('sem_scaffold_n2');
    const scafN3 = document.getElementById('sem_scaffold_n3');
    const ideN4 = document.getElementById('sem_ide_n4');

    if (scafN1) scafN1.style.display = lvl === 1 ? 'block' : 'none';
    if (scafN2) scafN2.style.display = lvl === 2 ? 'block' : 'none';
    if (scafN3) scafN3.style.display = lvl === 3 ? 'block' : 'none';
    if (ideN4) ideN4.style.display = lvl === 4 ? 'block' : 'none';

    // Atualiza título e missão
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

    // Esconde card de solução
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

/* ================= CENÁRIO & VEÍCULOS (RESET E FÍSICA) ================= */

function sem_resetScene() {
    // Luzes padrão do semáforo: Semáforo A Verde, Semáforo B Vermelho, Pedestre Pare
    sem_setTrafficLights({ a: 'green', b: 'red', ped: 'red' });

    // Reseta Carro Vermelho 🚗 (Oeste -> Leste)
    const carRed = document.getElementById('sem_car_red');
    if (carRed) {
        carRed.style.transition = 'none';
        carRed.style.left = '20px';
        setTimeout(() => { carRed.style.transition = 'all 1.4s cubic-bezier(0.25, 1, 0.5, 1)'; }, 50);
    }

    // Reseta Carro Azul 🚙 (Norte -> Sul)
    const carBlue = document.getElementById('sem_car_blue');
    if (carBlue) {
        carBlue.style.transition = 'none';
        carBlue.style.top = '20px';
        setTimeout(() => { carBlue.style.transition = 'all 1.4s cubic-bezier(0.25, 1, 0.5, 1)'; }, 50);
    }

    // Reseta Táxi Amarelo 🚕 (Leste -> Oeste)
    const carYellow = document.getElementById('sem_car_yellow');
    if (carYellow) {
        carYellow.style.transition = 'none';
        carYellow.style.right = '20px';
        setTimeout(() => { carYellow.style.transition = 'all 1.4s cubic-bezier(0.25, 1, 0.5, 1)'; }, 50);
    }

    // Reseta Caminhonete Verde 🛻 (Sul -> Norte)
    const carGreen = document.getElementById('sem_car_green');
    if (carGreen) {
        carGreen.style.transition = 'none';
        carGreen.style.bottom = '20px';
        setTimeout(() => { carGreen.style.transition = 'all 1.4s cubic-bezier(0.25, 1, 0.5, 1)'; }, 50);
    }

    // Reseta Pedestre 🚶
    const ped = document.getElementById('sem_ped_1');
    if (ped) {
        ped.style.transition = 'none';
        ped.style.top = 'calc(50% + 60px)';
        ped.style.left = 'calc(50% - 95px)';
        ped.innerText = '🚶';
        setTimeout(() => { ped.style.transition = 'all 1.6s ease-in-out'; }, 50);
    }

    // Esconde efeito de batida
    const crashFx = document.getElementById('sem_crash_fx');
    if (crashFx) crashFx.classList.remove('active');

    const statusHud = document.getElementById('sem_hud_status');
    if (statusHud) {
        statusHud.innerHTML = '🟢 Pista Aberta';
        statusHud.style.color = '#FBBF24';
    }
}

function sem_setTrafficLights({ a, b, ped }) {
    // Semáforo A (Avenida)
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

    // Semáforo B (Rua)
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

    // Semáforo de Pedestre
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

/* ================= GERADOR DE CÓDIGO C++ & INTERAÇÃO COM MINI-IDE ================= */

function sem_updateLiveCpp() {
    const el = document.getElementById('sem_arduino_code');
    if (!el) return;

    let loopBody = '';

    if (sem_level === 1) {
        const c1 = document.getElementById('sem_n1_cmd1')?.value || 'semaforoA_verde';
        const d1 = document.getElementById('sem_n1_delay1')?.value || '2000';
        const c2 = document.getElementById('sem_n1_cmd2')?.value || 'semaforoA_amarelo';
        const d2 = document.getElementById('sem_n1_delay2')?.value || '1000';
        const c3 = document.getElementById('sem_n1_cmd3')?.value || 'semaforoA_vermelho';

        loopBody = `  // 1️⃣ Fase Verde da Avenida:\n  digitalWrite(PIN_VERDE_A, HIGH);\n  delay(${d1});\n\n` +
                   `  // 2️⃣ Atenção no Amarelo:\n  digitalWrite(PIN_VERDE_A, LOW);\n  digitalWrite(PIN_AMARELO_A, HIGH);\n  delay(${d2});\n\n` +
                   `  // 3️⃣ Pare no Vermelho:\n  digitalWrite(PIN_AMARELO_A, LOW);\n  digitalWrite(PIN_VERMELHO_A, HIGH);`;
    } else if (sem_level === 2) {
        const c1 = document.getElementById('sem_n2_cmd1')?.value || 'semaforoA_verde';
        const d1 = document.getElementById('sem_n2_delay1')?.value || '2000';
        const c2 = document.getElementById('sem_n2_cmd2')?.value || 'semaforoA_amarelo';
        const c3 = document.getElementById('sem_n2_cmd3')?.value || 'semaforoB_verde';
        const d2 = document.getElementById('sem_n2_delay2')?.value || '2000';

        loopBody = `  // Fase 1: Avenida passa, Rua fechada:\n  digitalWrite(PIN_VERMELHO_B, HIGH);\n  digitalWrite(PIN_VERDE_A, HIGH);\n  delay(${d1});\n\n` +
                   `  // Fase 2: Amarelo na Avenida:\n  digitalWrite(PIN_VERDE_A, LOW);\n  digitalWrite(PIN_AMARELO_A, HIGH);\n  delay(1000);\n\n` +
                   `  // Fase 3: Fecha Avenida e abre Rua:\n  digitalWrite(PIN_AMARELO_A, LOW);\n  digitalWrite(PIN_VERMELHO_A, HIGH);\n  digitalWrite(PIN_VERMELHO_B, LOW);\n  digitalWrite(PIN_VERDE_B, HIGH);\n  delay(${d2});`;
    } else if (sem_level === 3) {
        const c1 = document.getElementById('sem_n3_cmd1')?.value || 'pedestre_verde';
        const d1 = document.getElementById('sem_n3_delay1')?.value || '2500';
        const c2 = document.getElementById('sem_n3_cmd2')?.value || 'pedestre_vermelho';

        loopBody = `  // Todos os carros param:\n  digitalWrite(PIN_VERMELHO_A, HIGH);\n  digitalWrite(PIN_VERMELHO_B, HIGH);\n  delay(800);\n\n` +
                   `  // Pedestres atravessam na faixa:\n  digitalWrite(PIN_PEDESTRE_VERDE, HIGH);\n  delay(${d1});\n\n` +
                   `  // Fim da travessia:\n  digitalWrite(PIN_PEDESTRE_VERDE, LOW);\n  digitalWrite(PIN_PEDESTRE_VERMELHO, HIGH);`;
    } else if (sem_level === 4) {
        const userCode = document.getElementById('sem_code_input')?.value.trim();
        if (userCode) {
            loopBody = `  // Código digitado pelo aluno:\n  ` + userCode.replace(/\n/g, '\n  ');
        } else {
            loopBody = `  // Digite seu código na Mini-IDE para ver o Arduino C++!`;
        }
    }

    const fullCode = `// --- Cruzamento Inteligente da Cidade Maker (Arduino C++) ---\n` +
                     `const int PIN_VERMELHO_A = 12;\n` +
                     `const int PIN_AMARELO_A  = 11;\n` +
                     `const int PIN_VERDE_A    = 10;\n` +
                     `const int PIN_VERMELHO_B = 9;\n` +
                     `const int PIN_AMARELO_B  = 8;\n` +
                     `const int PIN_VERDE_B    = 7;\n` +
                     `const int PIN_PEDESTRE   = 6;\n\n` +
                     `void setup() {\n` +
                     `  pinMode(PIN_VERMELHO_A, OUTPUT);\n` +
                     `  pinMode(PIN_AMARELO_A, OUTPUT);\n` +
                     `  pinMode(PIN_VERDE_A, OUTPUT);\n` +
                     `  pinMode(PIN_VERMELHO_B, OUTPUT);\n` +
                     `  pinMode(PIN_AMARELO_B, OUTPUT);\n` +
                     `  pinMode(PIN_VERDE_B, OUTPUT);\n` +
                     `  pinMode(PIN_PEDESTRE, OUTPUT);\n` +
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

/* ================= ATALHOS E TEXTAREA DA MINI-IDE (NÍVEL 4) ================= */

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

/* ================= PARSER DE CÓDIGO C/C++ E MOTOR DE EXECUÇÃO ================= */

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

        cmds.push({ type: 'semaforoB_vermelho' });
        if (c1) cmds.push({ type: c1 });
        cmds.push({ type: 'delay', ms: d1 });
        if (c2) cmds.push({ type: c2 });
        cmds.push({ type: 'delay', ms: 1000 });
        cmds.push({ type: 'semaforoA_vermelho' });
        if (c3) cmds.push({ type: c3 });
        cmds.push({ type: 'delay', ms: d2 });
    } else if (sem_level === 3) {
        const c1 = document.getElementById('sem_n3_cmd1')?.value;
        const d1 = parseInt(document.getElementById('sem_n3_delay1')?.value || '2500');
        const c2 = document.getElementById('sem_n3_cmd2')?.value;

        cmds.push({ type: 'semaforoA_vermelho' });
        cmds.push({ type: 'semaforoB_vermelho' });
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

            if (/semaforoA_verde|PIN_VERDE_A.*HIGH/i.test(line)) cmds.push({ type: 'semaforoA_verde' });
            else if (/semaforoA_amarelo|PIN_AMARELO_A.*HIGH/i.test(line)) cmds.push({ type: 'semaforoA_amarelo' });
            else if (/semaforoA_vermelho|PIN_VERMELHO_A.*HIGH/i.test(line)) cmds.push({ type: 'semaforoA_vermelho' });
            else if (/semaforoB_verde|PIN_VERDE_B.*HIGH/i.test(line)) cmds.push({ type: 'semaforoB_verde' });
            else if (/semaforoB_amarelo|PIN_AMARELO_B.*HIGH/i.test(line)) cmds.push({ type: 'semaforoB_amarelo' });
            else if (/semaforoB_vermelho|PIN_VERMELHO_B.*HIGH/i.test(line)) cmds.push({ type: 'semaforoB_vermelho' });
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

/* ================= SIMULAÇÃO INTERATIVA & DETECÇÃO DE COLISÃO ================= */

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
    await sem_sleep(300);

    let stateA = 'green';
    let stateB = 'red';
    let statePed = 'red';
    let hasHadYellowA = false;
    let hasHadYellowB = false;
    let crashed = false;

    const carRed = document.getElementById('sem_car_red');
    const carBlue = document.getElementById('sem_car_blue');
    const ped = document.getElementById('sem_ped_1');
    const crashFx = document.getElementById('sem_crash_fx');
    const statusHud = document.getElementById('sem_hud_status');

    for (let i = 0; i < cmds.length; i++) {
        const cmd = cmds[i];

        if (cmd.type === 'semaforoA_verde') {
            stateA = 'green';
            sem_setTrafficLights({ a: 'green' });
            hasHadYellowA = false;
            playSound('step');
            // Carro Vermelho avança
            if (carRed) carRed.style.left = 'calc(50% - 90px)';
        } else if (cmd.type === 'semaforoA_amarelo') {
            stateA = 'yellow';
            sem_setTrafficLights({ a: 'yellow' });
            hasHadYellowA = true;
            playSound('step');
            // Carro desacelera na faixa
            if (carRed) carRed.style.left = 'calc(50% - 75px)';
        } else if (cmd.type === 'semaforoA_vermelho') {
            if (stateA === 'green' && !hasHadYellowA) {
                // Fechou direto sem amarelo!
                sem_registerError('Freagem Brusca!', 'O Semáforo da Avenida mudou direto do Verde para o Vermelho! Os carros precisam do sinal AMARELO para desacelerar com segurança.', 'Use semaforoA_amarelo() e delay(1000) antes do Vermelho!', '⚠️');
                crashed = true;
                break;
            }
            stateA = 'red';
            sem_setTrafficLights({ a: 'red' });
            playSound('step');
            // Carro para completamente na faixa
            if (carRed) carRed.style.left = 'calc(50% - 75px)';
        } else if (cmd.type === 'semaforoB_verde') {
            stateB = 'green';
            sem_setTrafficLights({ b: 'green' });
            hasHadYellowB = false;
            playSound('step');
            if (carBlue) carBlue.style.top = 'calc(50% - 90px)';
        } else if (cmd.type === 'semaforoB_amarelo') {
            stateB = 'yellow';
            sem_setTrafficLights({ b: 'yellow' });
            hasHadYellowB = true;
            playSound('step');
            if (carBlue) carBlue.style.top = 'calc(50% - 75px)';
        } else if (cmd.type === 'semaforoB_vermelho') {
            if (stateB === 'green' && !hasHadYellowB) {
                sem_registerError('Freagem Brusca na Rua!', 'A Rua dos Sensores fechou direto sem o Amarelo de aviso!', 'Sempre coloque Amarelo e delay() antes de fechar.', '⚠️');
                crashed = true;
                break;
            }
            stateB = 'red';
            sem_setTrafficLights({ b: 'red' });
            playSound('step');
            if (carBlue) carBlue.style.top = 'calc(50% - 75px)';
        } else if (cmd.type === 'pedestre_verde') {
            statePed = 'green';
            sem_setTrafficLights({ ped: 'green' });
            playSound('step');
            // Pedestre começa a atravessar a faixa
            if (ped) {
                ped.style.top = 'calc(50% - 40px)';
                ped.innerText = '🏃';
            }
        } else if (cmd.type === 'pedestre_vermelho') {
            statePed = 'red';
            sem_setTrafficLights({ ped: 'red' });
            playSound('step');
            if (ped) ped.innerText = '🚶';
        } else if (cmd.type === 'delay') {
            // CHECAGEM DE COLISÃO CRÍTICA DURANTE O DELAY!
            // 1. Colisão Carro vs Carro (Ambos Verdes ou ambos avançando)
            if (stateA === 'green' && stateB === 'green') {
                if (statusHud) { statusHud.innerHTML = '💥 COLISÃO NO CENTRO!'; statusHud.style.color = '#EF4444'; }
                if (carRed) carRed.style.left = 'calc(50% - 30px)';
                if (carBlue) carBlue.style.top = 'calc(50% - 30px)';
                if (crashFx) crashFx.classList.add('active');
                playSound('error');
                await sem_sleep(700);

                sem_registerError('Eita! Batida no Centro! 💥', 
                    'O Carro Vermelho 🚗 e o Carro Azul 🚙 colidiram no cruzamento! Ambos os semáforos ficaram verdes juntos!', 
                    'Quando a Avenida estiver Verde, a Rua perpendicular DEVE estar Vermelha!', 
                    '💥');
                crashed = true;
                break;
            }

            // 2. Colisão Carro vs Pedestre
            if (statePed === 'green' && (stateA === 'green' || stateB === 'green')) {
                if (statusHud) { statusHud.innerHTML = '🚨 QUASE ATROPELOU O PEDESTRE!'; statusHud.style.color = '#EF4444'; }
                if (ped) ped.innerText = '😱';
                playSound('error');
                await sem_sleep(600);

                sem_registerError('Perigo na Faixa de Pedestres! 🚨', 
                    'O pedestre estava atravessando na faixa e um carro avançou com sinal verde!', 
                    'Enquanto o pedestre atravessa (pedestre_verde), TODOS os semáforos de carros (A e B) devem estar no VERMELHO!', 
                    '🚨');
                crashed = true;
                break;
            }

            // Animação proporcional ao delay (escala dinâmica: 1000ms -> 800ms)
            const waitTime = Math.min(2500, Math.max(600, Math.round(cmd.ms * 0.8)));
            
            // Se estiver tudo livre, os carros avançam pelo cruzamento
            if (stateA === 'green' && stateB === 'red' && statePed === 'red') {
                if (carRed) carRed.style.left = 'calc(100% - 70px)';
            } else if (stateB === 'green' && stateA === 'red' && statePed === 'red') {
                if (carBlue) carBlue.style.top = 'calc(100% - 70px)';
            } else if (statePed === 'green' && stateA === 'red' && stateB === 'red') {
                if (ped) ped.style.top = 'calc(50% - 95px)';
            }

            await sem_sleep(waitTime);
        }
    }

    if (!crashed) {
        // Validação das metas pedagógicas de cada nível
        const isSuccess = sem_validateLevelSuccess(cmds, stateA, stateB, statePed);

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

function sem_validateLevelSuccess(cmds, stateA, stateB, statePed) {
    if (sem_level === 1) {
        // Nível 1: Precisou acender Verde A, depois Amarelo A com delay, e fechar em Vermelho A
        const hasGreenA = cmds.some(c => c.type === 'semaforoA_verde');
        const hasYellowA = cmds.some(c => c.type === 'semaforoA_amarelo');
        const hasRedA = cmds.some(c => c.type === 'semaforoA_vermelho');
        return hasGreenA && hasYellowA && hasRedA;
    } else if (sem_level === 2) {
        // Nível 2: Verde A, depois Amarelo A, Vermelho A, e Verde B com segurança
        const hasGreenA = cmds.some(c => c.type === 'semaforoA_verde');
        const hasGreenB = cmds.some(c => c.type === 'semaforoB_verde');
        const hasRedB = cmds.some(c => c.type === 'semaforoB_vermelho');
        return hasGreenA && hasGreenB && hasRedB;
    } else if (sem_level === 3) {
        // Nível 3: Pedestre Verde com carros em Vermelho
        const hasPedGreen = cmds.some(c => c.type === 'pedestre_verde');
        const hasRedA = cmds.some(c => c.type === 'semaforoA_vermelho');
        const hasRedB = cmds.some(c => c.type === 'semaforoB_vermelho');
        return hasPedGreen && hasRedA && hasRedB;
    } else if (sem_level === 4) {
        // Nível 4: Ciclo Completo com ambas as vias e pedestre
        const hasGreenA = cmds.some(c => c.type === 'semaforoA_verde');
        const hasGreenB = cmds.some(c => c.type === 'semaforoB_verde');
        const hasPedGreen = cmds.some(c => c.type === 'pedestre_verde');
        return hasGreenA && hasGreenB && hasPedGreen;
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

    const data = sem_levels_data[sem_level];
    const titleEl = document.getElementById('sem_modal_title');
    const textEl = document.getElementById('sem_modal_text');

    if (titleEl) titleEl.innerText = `Nível ${sem_level} Concluído! 🏆`;
    if (textEl) {
        if (sem_level === 1) textEl.innerText = 'Você programou a parada segura do Carro Vermelho 🚗 com tempo exato de desaceleração!';
        else if (sem_level === 2) textEl.innerText = 'Sensacional! O Carro Vermelho 🚗 e o Carro Azul 🚙 cruzaram com segurança máxima sem nenhuma colisão!';
        else if (sem_level === 3) textEl.innerText = 'Perfeito! Os pedestres 🚶 atravessaram a faixa em segurança total enquanto os carros esperaram educadamente!';
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

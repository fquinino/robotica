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

            /* NAVEGAÇÃO DOS NÍVEIS (BARRA SEGMENTADA DE 5 NÍVEIS) */
            .sem-level-bar { display:grid; grid-template-columns:repeat(auto-fit, minmax(170px, 1fr)); gap:10px; margin-bottom:18px; width:100%; }
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

            /* CENÁRIO GRÁFICO DO CRUZAMENTO DE 2/4 FLUXOS */
            .sem-stage-card { background:#090D16; border:2px solid #334155; border-radius:24px; padding:16px; margin-bottom:18px; box-shadow:0 12px 35px rgba(0,0,0,0.6); position:relative; overflow:hidden; }
            .sem-stage-hud { display:flex; justify-content:space-between; align-items:center; background:#0F172A; border:1px solid #1E293B; border-radius:14px; padding:10px 16px; margin-bottom:14px; flex-wrap:wrap; gap:10px; }
            .sem-hud-item { display:flex; align-items:center; gap:8px; font-size:0.85rem; font-weight:800; }
            .sem-status-pill { padding:3px 10px; border-radius:20px; font-weight:900; font-size:0.8rem; display:inline-flex; align-items:center; gap:5px; }
            .sem-status-pill.green { background:rgba(16,185,129,0.2); color:#34D399; border:1px solid #10B981; }
            .sem-status-pill.yellow { background:rgba(245,158,11,0.2); color:#FBBF24; border:1px solid #F59E0B; }
            .sem-status-pill.red { background:rgba(239,68,68,0.2); color:#F87171; border:1px solid #EF4444; }

            .sem-crossroad-box { position:relative; width:100%; height:440px; min-height:440px; background:#0B1120; border-radius:18px; border:2px solid #334155; overflow:hidden; box-shadow:inset 0 0 40px rgba(0,0,0,0.8); }
            
            /* PISTAS DE ASFALTO (MÃO DUPLA) */
            .sem-road-h { position:absolute; top:50%; left:0; width:100%; height:110px; transform:translateY(-50%); background:#1E293B; border-top:3px solid #475569; border-bottom:3px solid #475569; }
            .sem-road-h-line { position:absolute; top:50%; left:0; width:100%; height:2px; transform:translateY(-50%); border-top:3px dashed #F59E0B; opacity:0.85; }
            
            .sem-road-v { position:absolute; top:0; left:50%; width:110px; height:100%; transform:translateX(-50%); background:#1E293B; border-left:3px solid #475569; border-right:3px solid #475569; }
            .sem-road-v-line { position:absolute; top:0; left:50%; width:2px; height:100%; transform:translateX(-50%); border-left:3px dashed #F59E0B; opacity:0.85; }
            
            /* ÁREA CENTRAL DO CRUZAMENTO */
            .sem-junction-box { position:absolute; top:50%; left:50%; width:110px; height:110px; transform:translate(-50%, -50%); background:#172033; border:2px dashed rgba(245,158,11,0.3); z-index:5; }
            
            /* FAIXA DE PEDESTRES ZEBRADA NA ENTRADA OESTE */
            .sem-zebra-west { position:absolute; top:50%; left:calc(50% - 95px); width:32px; height:110px; transform:translateY(-50%); background:repeating-linear-gradient(180deg, #FFFFFF, #FFFFFF 10px, transparent 10px, transparent 20px); opacity:0.9; z-index:6; }
            
            /* LINHAS BRANCAS DE PARADA (STOP LINES NAS 4 ENTRADAS) */
            .sem-stop-line-west { position:absolute; top:calc(50% + 3px); left:calc(50% - 105px); width:4px; height:50px; background:#FFFFFF; z-index:7; box-shadow:0 0 8px white; }
            .sem-stop-line-east { position:absolute; top:calc(50% - 53px); left:calc(50% + 101px); width:4px; height:50px; background:#FFFFFF; z-index:7; box-shadow:0 0 8px white; }
            .sem-stop-line-north { position:absolute; top:calc(50% - 105px); left:calc(50% - 53px); width:50px; height:4px; background:#FFFFFF; z-index:7; box-shadow:0 0 8px white; }
            .sem-stop-line-south { position:absolute; top:calc(50% + 101px); left:calc(50% + 3px); width:50px; height:4px; background:#FFFFFF; z-index:7; box-shadow:0 0 8px white; }

            /* ================= POSTES DE SEMÁFORO VEICULAR (NUMERADOS 1 E 2) ================= */
            .sem-traffic-post { position:absolute; background:#0B0F19; border:2px solid #475569; border-radius:12px; padding:6px 6px 8px; display:flex; flex-direction:column; align-items:center; gap:5px; z-index:30; box-shadow:0 8px 20px rgba(0,0,0,0.85); min-width:40px; }
            .sem-num-badge { width:22px; height:22px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-family:'Fredoka One', cursive; font-size:0.85rem; font-weight:900; margin-bottom:2px; box-shadow:0 2px 6px rgba(0,0,0,0.6); }
            .sem-num-badge.n1 { background:#EF4444; color:white; border:1px solid #FCA5A5; }
            .sem-num-badge.n2 { background:#38BDF8; color:#0F172A; border:1px solid #BAE6FD; }
            
            .sem-bulb { width:18px; height:18px; border-radius:50%; background:#1E293B; border:2px solid #000; transition:all 0.2s; opacity:0.3; }
            .sem-bulb.red.on { background:#EF4444; opacity:1; box-shadow:0 0 16px #EF4444, 0 0 25px #DC2626; }
            .sem-bulb.yellow.on { background:#F59E0B; opacity:1; box-shadow:0 0 16px #F59E0B, 0 0 25px #D97706; }
            .sem-bulb.green.on { background:#10B981; opacity:1; box-shadow:0 0 16px #10B981, 0 0 25px #059669; }

            /* Posição Semáforo 1 (Fluxo 1 - Avenida Horizontal) */
            .sem-post-1 { top:calc(50% - 110px); left:calc(50% - 150px); border-color:#EF4444; }
            /* Posição Semáforo 2 (Fluxo 2 - Rua Vertical) */
            .sem-post-2 { top:calc(50% - 145px); left:calc(50% + 65px); border-color:#38BDF8; }

            /* ================= SEMÁFORO DE PEDESTRES 🚸 ================= */
            .sem-ped-post { position:absolute; top:calc(50% + 60px); left:calc(50% - 145px); background:#0F172A; border:2px solid #FBBF24; border-radius:14px; padding:6px 6px 8px; display:flex; flex-direction:column; align-items:center; gap:6px; z-index:30; box-shadow:0 8px 20px rgba(0,0,0,0.85); width:46px; }
            .sem-ped-sign { background:#FBBF24; color:#0F172A; font-size:0.75rem; font-weight:900; padding:1px 5px; border-radius:4px; margin-bottom:2px; font-family:'Fredoka One'; display:flex; align-items:center; gap:2px; }
            .sem-ped-lens { width:30px; height:30px; background:#0B0F19; border-radius:8px; border:2px solid #334155; display:flex; align-items:center; justify-content:center; opacity:0.3; transition:all 0.25s ease; }
            .sem-ped-lens.red.on { opacity:1; background:rgba(239,68,68,0.25); border-color:#EF4444; box-shadow:0 0 16px #EF4444; }
            .sem-ped-lens.green.on { opacity:1; background:rgba(16,185,129,0.25); border-color:#10B981; box-shadow:0 0 16px #10B981; }

            /* VEÍCULOS (FRENTE SEMPRE APONTADA PARA O SENTIDO DO MOVIMENTO!) */
            .sem-vehicle { position:absolute; width:54px; height:30px; z-index:20; transition:all 1.1s cubic-bezier(0.25, 1, 0.5, 1); filter:drop-shadow(0 4px 6px rgba(0,0,0,0.7)); }
            .sem-vehicle svg { width:100%; height:100%; display:block; }
            
            /* 1. Carro Vermelho 🚗 (Fluxo 1: Oeste -> Leste, virado para 0deg) */
            #sem_car_red { top:calc(50% + 14px); left:25px; }
            /* 2. Carro Verde 🏎️ (Fluxo 1 Oposto: Leste -> Oeste, virado para 180deg) */
            #sem_car_green { top:calc(50% - 44px); left:calc(100% - 80px); transform:rotate(180deg); transform-origin:center; display:none; }
            /* 3. Carro Azul 🚙 (Fluxo 2: Norte -> Sul, virado para 90deg) */
            #sem_car_blue { top:25px; left:calc(50% - 42px); transform:rotate(90deg); transform-origin:center; }
            /* 4. Carro Amarelo 🚖 (Fluxo 2 Oposto: Sul -> Norte, virado para -90deg) */
            #sem_car_yellow { top:calc(100% - 55px); left:calc(50% + 16px); transform:rotate(-90deg); transform-origin:center; display:none; }

            /* PEDESTRE 🚶 NA CALÇADA DA FAIXA */
            .sem-pedestrian { position:absolute; font-size:1.8rem; z-index:22; filter:drop-shadow(0 4px 4px rgba(0,0,0,0.8)); transition:all 1.4s ease-in-out; }
            #sem_ped_1 { top:calc(50% + 62px); left:calc(50% - 95px); }

            /* EFEITO DE COLISÃO / IMPACTO */
            .sem-crash-fx { position:absolute; top:50%; left:50%; transform:translate(-50%, -50%) scale(0); font-size:4rem; z-index:40; pointer-events:none; transition:transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
            .sem-crash-fx.active { transform:translate(-50%, -50%) scale(1.3); animation:errorShake 0.4s ease-in-out infinite alternate; }

            /* MINI-IDE E EDITORES (Layout Vertical Desafogado) */
            .sem-ide-layout { display:flex; flex-direction:column; gap:20px; margin-bottom:20px; width:100%; }
            
            .sem-editor-card { background:#090D16; border:2px solid #F59E0B; border-radius:20px; padding:18px; display:flex; flex-direction:column; box-shadow:0 10px 25px rgba(0,0,0,0.5); width:100%; box-sizing:border-box; }
            .sem-editor-topbar { display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #1E293B; padding-bottom:10px; margin-bottom:12px; }
            .sem-editor-title { font-family:'Fredoka One'; color:#FBBF24; font-size:1.05rem; display:flex; align-items:center; gap:8px; }
            .sem-lang-tag { background:rgba(245,158,11,0.2); color:#FBBF24; padding:3px 10px; border-radius:12px; font-size:0.75rem; font-weight:800; border:1px solid #F59E0B; }

            /* TECLADO MAKER DE ATALHOS RÁPIDOS */
            .sem-shortcuts-bar { display:flex; gap:6px; flex-wrap:wrap; margin-bottom:12px; background:#111827; padding:8px; border-radius:12px; border:1px solid #1F2937; }
            .sem-shortcut-btn { background:#1F2937; border:1px solid #374151; color:#E5E7EB; padding:6px 10px; border-radius:8px; font-size:0.78rem; font-weight:800; cursor:pointer; transition:0.15s; font-family:'Nunito', sans-serif; display:flex; align-items:center; gap:4px; user-select:none; }
            .sem-shortcut-btn:hover { transform:scale(1.03); }
            .sem-shortcut-btn.btn-s1 { border-color:#EF4444; color:#FCA5A5; }
            .sem-shortcut-btn.btn-s1:hover { background:#EF4444; color:white; }
            .sem-shortcut-btn.btn-s2 { border-color:#38BDF8; color:#BAE6FD; }
            .sem-shortcut-btn.btn-s2:hover { background:#38BDF8; color:#0F172A; }
            .sem-shortcut-btn.btn-ped { border-color:#10B981; color:#A7F3D0; }
            .sem-shortcut-btn.btn-ped:hover { background:#10B981; color:#0F172A; }
            .sem-shortcut-btn.clear { background:#450A0A; border-color:#991B1B; color:#FCA5A5; }
            .sem-shortcut-btn.clear:hover { background:#DC2626; color:white; }

            /* AUTOCOMPLETE FLUTUANTE DA MINI-IDE */
            .sem-autocomplete-box { position:absolute; left:46px; background:#0B0F19; border:2px solid #38BDF8; border-radius:12px; z-index:100; box-shadow:0 12px 30px rgba(0,0,0,0.85); max-height:220px; overflow-y:auto; display:none; min-width:320px; width:max-content; max-width:92%; }
            .sem-ac-item { padding:8px 14px; color:#CBD5E1; font-family:'Fira Code', monospace; font-size:0.83rem; cursor:pointer; border-bottom:1px solid #1E293B; display:flex; justify-content:space-between; align-items:center; transition:0.12s; }
            .sem-ac-item:hover, .sem-ac-item.active { background:rgba(56,189,248,0.2); color:#38BDF8; }
            .sem-ac-shortcut { font-size:0.72rem; background:#1E293B; color:#38BDF8; padding:2px 6px; border-radius:4px; margin-left:12px; font-weight:700; border:1px solid #38BDF8; }

            /* SCAFFOLDING EDITOR (NÍVEIS 1, 2 E 3) */
            .sem-scaffold-lines { background:#030712; border-radius:14px; padding:16px; border:1px solid #1F2937; font-family:'Fira Code', monospace; font-size:0.88rem; line-height:1.9; color:#E2E8F0; }
            .sem-sketch-setup { background:rgba(15,23,42,0.85); border:1px dashed #334155; border-radius:10px; padding:10px 14px; margin-bottom:14px; font-size:0.83rem; line-height:1.6; color:#94A3B8; }
            .sem-sketch-loop-tag { color:#F8FAFC; font-weight:700; margin-bottom:6px; font-size:0.92rem; }
            .sem-sketch-loop-body { border-left:2px solid rgba(56,189,248,0.45); margin-left:12px; padding-left:14px; display:flex; flex-direction:column; gap:6px; }
            .sem-sketch-loop-close { color:#F8FAFC; font-weight:700; margin-top:8px; font-size:0.92rem; }
            .c-kw { color:#A78BFA; font-weight:bold; }
            .c-fn { color:#38BDF8; font-weight:bold; }
            .c-cm { color:#64748B; font-style:italic; }
            .c-cst { color:#F59E0B; font-weight:bold; }
            .sem-scaffold-line { padding:2px 8px; border-radius:6px; transition:background 0.2s; border-left:3px solid transparent; }
            .sem-scaffold-line.active { background:rgba(245,158,11,0.25); border-left-color:#F59E0B; }
            .sem-select-cmd { background:#1E293B; border:2px solid #F59E0B; color:#FBBF24; font-family:'Fira Code', monospace; font-size:0.86rem; font-weight:bold; padding:4px 8px; border-radius:8px; outline:none; cursor:pointer; }
            .sem-input-num { background:#1E293B; border:2px solid #38BDF8; color:#38BDF8; font-family:'Fredoka One'; font-size:1.05rem; width:80px; padding:3px 6px; border-radius:8px; text-align:center; outline:none; }
            
            /* TEXTAREA LIVRE COM NÚMEROS DE LINHA (NÍVEL 4) */
            .sem-code-wrapper { position:relative; display:flex; background:#030712; border-radius:14px; border:1px solid #1F2937; overflow:hidden; min-height:260px; }
            .sem-line-numbers { background:#0B0F19; color:#4B5563; padding:12px 8px; text-align:right; font-family:'Fira Code', monospace; font-size:0.88rem; line-height:1.7; user-select:none; border-right:1px solid #1F2937; min-width:32px; }
            .sem-code-input { flex:1; background:transparent; border:none; color:#F3F4F6; padding:12px; font-family:'Fira Code', monospace; font-size:0.88rem; line-height:1.7; resize:none; outline:none; white-space:pre; tab-size:4; min-height:260px; }

            /* BOTÕES DE AÇÃO */
            .sem-actions { display:flex; gap:10px; margin-top:14px; width:100%; }
            .sem-btn-run { background:linear-gradient(135deg,#10B981,#047857); color:white; border:none; padding:13px 20px; border-radius:16px; font-family:'Fredoka One', cursive; font-size:1.15rem; flex:2; border-bottom:5px solid #064E3B; cursor:pointer; transition:0.15s; display:flex; align-items:center; justify-content:center; gap:8px; box-shadow:0 6px 20px rgba(16,185,129,0.35); }
            .sem-btn-run:hover { filter:brightness(1.1); transform:translateY(-2px); }
            .sem-btn-run:active { transform:translateY(4px); border-bottom-width:1px; }
            .sem-btn-run:disabled { background:#475569; border-bottom-color:#1E293B; cursor:not-allowed; box-shadow:none; filter:none; }
            .sem-btn-reset { background:#334155; color:#CBD5E1; border:none; padding:13px 18px; border-radius:16px; font-family:'Fredoka One', cursive; font-size:1rem; flex:1; border-bottom:5px solid #1E293B; cursor:pointer; transition:0.15s; }

            /* BOTÃO DE SOLUÇÃO E DICA APÓS 3 ERROS */
            .sem-btn-solution { background:linear-gradient(135deg,#D97706,#B45309); border:none; color:white; padding:10px 16px; border-radius:12px; font-size:0.88rem; font-weight:900; cursor:pointer; transition:0.15s; margin-top:10px; width:100%; display:none; align-items:center; justify-content:center; gap:8px; border-bottom:3px solid #78350F; }
            .sem-btn-solution:hover { background:linear-gradient(135deg,#F59E0B,#D97706); }
            .sem-solution-card { background:#0F172A; border:2px solid #F59E0B; border-radius:14px; padding:12px 16px; margin-top:10px; display:none; animation:semFadeIn 0.3s ease; }
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
                    <button class="sem-guide-tab" id="sem_tab_g2" onclick="sem_switchGuideTab(2)"><i class="fa-solid fa-bolt"></i> 2. Pinos & digitalWrite()</button>
                    <button class="sem-guide-tab" id="sem_tab_g3" onclick="sem_switchGuideTab(3)"><i class="fa-solid fa-stopwatch"></i> 3. O delay() em ms</button>
                    <button class="sem-guide-tab" id="sem_tab_g4" onclick="sem_switchGuideTab(4)"><i class="fa-solid fa-traffic-light"></i> 4. Cruzamento Seguro</button>
                    <button class="sem-guide-tab" id="sem_tab_g5" onclick="sem_switchGuideTab(5)"><i class="fa-solid fa-person-walking"></i> 5. Travessia Pedestre</button>
                </div>

                <!-- SLIDE 1: A MISSÃO DA CIDADE MAKER -->
                <div class="sem-slide-content active" id="sem_slide_1">
                    <div style="font-size:1.05rem;font-weight:900;color:#FBBF24;margin-bottom:8px;display:flex;align-items:center;gap:8px;">
                        <span>🏙️ 1. O Desafio dos Semáforos Numerados!</span>
                    </div>
                    <p style="margin:0 0 10px;color:#CBD5E1;font-size:0.92rem;line-height:1.6;">
                        O cruzamento central tem <b>fluxos de trânsito em sentidos coordenados</b>, cada um com seu semáforo próprio numerado:
                    </p>
                    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:10px;margin:12px 0;">
                        <div style="background:#090D16;border:2px solid #EF4444;border-radius:14px;padding:12px;text-align:center;">
                            <div style="display:inline-block;background:#EF4444;color:white;font-weight:900;padding:2px 8px;border-radius:6px;font-size:0.8rem;margin-bottom:4px;">SEMÁFORO 1</div>
                            <div style="font-size:2rem;">🚗 🏎️</div>
                            <b style="color:#F87171;">Avenida Principal (Horizontal)</b>
                            <div style="font-size:0.78rem;color:#94A3B8;margin-top:4px;">Pistas paralelas em sentidos opostos</div>
                        </div>
                        <div style="background:#090D16;border:2px solid #38BDF8;border-radius:14px;padding:12px;text-align:center;">
                            <div style="display:inline-block;background:#38BDF8;color:#0F172A;font-weight:900;padding:2px 8px;border-radius:6px;font-size:0.8rem;margin-bottom:4px;">SEMÁFORO 2</div>
                            <div style="font-size:2rem;">🚙 🚖</div>
                            <b style="color:#38BDF8;">Rua Transversal (Vertical)</b>
                            <div style="font-size:0.78rem;color:#94A3B8;margin-top:4px;">Cruza perpendicularmente a avenida</div>
                        </div>
                        <div style="background:#090D16;border:2px solid #10B981;border-radius:14px;padding:12px;text-align:center;">
                            <div style="display:inline-block;background:#10B981;color:#0F172A;font-weight:900;padding:2px 8px;border-radius:6px;font-size:0.8rem;margin-bottom:4px;">SEMÁFORO 🚸</div>
                            <div style="font-size:2rem;">🚶</div>
                            <b style="color:#34D399;">Semáforo de Pedestre</b>
                            <div style="font-size:0.78rem;color:#94A3B8;margin-top:4px;">Com sinal exclusivo Pare e Siga!</div>
                        </div>
                    </div>
                    <div style="background:rgba(245,158,11,0.1);border:1px solid #F59E0B;border-radius:12px;padding:10px 14px;color:#FDE68A;font-size:0.85rem;">
                        ⚠️ <b>Regra de Trânsito:</b> Carros que andam na mesma avenida em pistas opostas <b>não se cruzam</b> e podem andar juntos! Mas se a avenida e a rua transversal abrirem ao mesmo tempo, ocorre colisão catastrófica!
                    </div>
                </div>

                <!-- SLIDE 2: COMO O ARDUINO LIGA LUZES (digitalWrite) -->
                <div class="sem-slide-content" id="sem_slide_2">
                    <div style="font-size:1.05rem;font-weight:900;color:#F59E0B;margin-bottom:8px;display:flex;align-items:center;gap:8px;">
                        <span>⚡ 2. O Comando <code style="color:#FDE68A;">digitalWrite(pino, ESTADO)</code></span>
                    </div>
                    <p style="margin:0 0 10px;color:#CBD5E1;font-size:0.92rem;line-height:1.6;">
                        No Arduino, cada lâmpada do semáforo é conectada a um <b>pino digital</b>. O microcontrolador envia pulsos elétricos com o comando <code>digitalWrite()</code>:
                    </p>
                    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:10px;margin:10px 0;">
                        <div style="background:#090D16;padding:12px;border-radius:12px;border-left:4px solid #10B981;">
                            <div style="color:#34D399;font-weight:900;font-size:0.95rem;">HIGH (5 Volts — LIGADO)</div>
                            <div style="color:#CBD5E1;font-size:0.84rem;margin:6px 0;">Envia corrente elétrica para acender a luz do LED:</div>
                            <code style="color:#FDE68A;background:#1E293B;padding:3px 6px;border-radius:4px;font-size:0.82rem;">digitalWrite(PIN_SEM1_VERDE, HIGH);</code>
                        </div>
                        <div style="background:#090D16;padding:12px;border-radius:12px;border-left:4px solid #EF4444;">
                            <div style="color:#F87171;font-weight:900;font-size:0.95rem;">LOW (0 Volts — DESLIGADO)</div>
                            <div style="color:#CBD5E1;font-size:0.84rem;margin:6px 0;">Corta a eletricidade, apagando a luz imediatamente:</div>
                            <code style="color:#FDE68A;background:#1E293B;padding:3px 6px;border-radius:4px;font-size:0.82rem;">digitalWrite(PIN_SEM1_VERDE, LOW);</code>
                        </div>
                    </div>
                    <div style="background:rgba(56,189,248,0.1);border:1px solid #38BDF8;border-radius:12px;padding:8px 12px;color:#BAE6FD;font-size:0.84rem;">
                        💡 <b>Conceito Maker:</b> Para trocar uma luz, desligamos a anterior com <code>LOW</code> e acendemos a próxima com <code>HIGH</code>!
                    </div>
                </div>

                <!-- SLIDE 3: O COMANDO DELAY() -->
                <div class="sem-slide-content" id="sem_slide_3">
                    <div style="font-size:1.05rem;font-weight:900;color:#38BDF8;margin-bottom:8px;display:flex;align-items:center;gap:8px;">
                        <span>⏱️ 3. Como o Arduino mede o Tempo? (<code style="color:#FBBF24;">delay</code>)</span>
                    </div>
                    <p style="margin:0 0 10px;color:#CBD5E1;font-size:0.92rem;line-height:1.6;">
                        O microcontrolador do Arduino é extremamente veloz. Sem pausas, ele mudaria as luzes num piscar de olhos e os motoristas não conseguiriam reagir! Usamos <code>delay(milissegundos)</code> para manter o estado ligado pelo tempo necessário:
                    </p>
                    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:10px;margin:10px 0;">
                        <div style="background:#090D16;padding:10px 12px;border-radius:12px;border-left:4px solid #10B981;">
                            <b style="color:#34D399;">1 segundo = 1000 ms</b>
                            <div style="color:#E2E8F0;font-size:0.82rem;margin-top:4px;"><code>delay(1000);</code> // Alerta amarelo</div>
                        </div>
                        <div style="background:#090D16;padding:10px 12px;border-radius:12px;border-left:4px solid #F59E0B;">
                            <b style="color:#FBBF24;">2 segundos = 2000 ms</b>
                            <div style="color:#E2E8F0;font-size:0.82rem;margin-top:4px;"><code>delay(2000);</code> // Passagem veicular</div>
                        </div>
                        <div style="background:#090D16;padding:10px 12px;border-radius:12px;border-left:4px solid #EC4899;">
                            <b style="color:#F472B6;">2.5 segundos = 2500 ms</b>
                            <div style="color:#E2E8F0;font-size:0.82rem;margin-top:4px;"><code>delay(2500);</code> // Faixa de pedestres</div>
                        </div>
                    </div>
                </div>

                <!-- SLIDE 4: O CRUZAMENTO SEGURO -->
                <div class="sem-slide-content" id="sem_slide_4">
                    <div style="font-size:1.05rem;font-weight:900;color:#10B981;margin-bottom:8px;display:flex;align-items:center;gap:8px;">
                        <span>⚖️ 4. A Lógica de Trânsito e Alternância</span>
                    </div>
                    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:12px;">
                        <div style="background:#090D16;border:1px solid #334155;border-radius:12px;padding:12px;font-family:'Fira Code',monospace;font-size:0.82rem;line-height:1.7;">
                            <div style="color:#34D399;">// 1. Avenida Verde (Carros da horizontal passam):</div>
                            digitalWrite(PIN_SEM1_VERDE, HIGH);<br>
                            digitalWrite(PIN_SEM2_VERMELHO, HIGH);<br>
                            <span style="color:#64748B;">delay(2000);</span><br>
                            <div style="color:#FBBF24;margin-top:6px;">// 2. Alerta amarelo de desaceleração:</div>
                            digitalWrite(PIN_SEM1_VERDE, LOW);<br>
                            digitalWrite(PIN_SEM1_AMARELO, HIGH);<br>
                            <span style="color:#64748B;">delay(1000);</span><br>
                            <div style="color:#38BDF8;margin-top:6px;">// 3. Fecha Avenida e abre Rua Transversal:</div>
                            digitalWrite(PIN_SEM1_AMARELO, LOW);<br>
                            digitalWrite(PIN_SEM1_VERMELHO, HIGH);<br>
                            digitalWrite(PIN_SEM2_VERMELHO, LOW);<br>
                            digitalWrite(PIN_SEM2_VERDE, HIGH);
                        </div>
                        <div style="background:rgba(30,41,59,0.7);border-radius:12px;padding:12px;font-size:0.85rem;color:#CBD5E1;line-height:1.6;">
                            <b style="color:#6EE7B7;">🚨 Leis de Trânsito:</b>
                            <ul style="margin:4px 0 0;padding-left:18px;">
                                <li>Carros nunca dão ré no cruzamento! Eles avançam para frente ou param na linha de retenção.</li>
                                <li>Nunca passe do Verde direto para o Vermelho sem o sinal Amarelo de freio!</li>
                                <li>Enquanto a Avenida estiver Aberta, a Rua Transversal DEVE ficar Travada no Vermelho!</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <!-- SLIDE 5: TRAVESSIA SEGURA DOS PEDESTRES -->
                <div class="sem-slide-content" id="sem_slide_5">
                    <div style="font-size:1.05rem;font-weight:900;color:#A78BFA;margin-bottom:8px;display:flex;align-items:center;gap:8px;">
                        <span>🚶 5. Fase Exclusiva de Pedestres</span>
                    </div>
                    <p style="margin:0 0 10px;color:#CBD5E1;font-size:0.92rem;line-height:1.6;">
                        Quando o semáforo de pedestre acende verde (<code>digitalWrite(PIN_PED_VERDE, HIGH)</code>), <b>todos os semáforos veiculares devem estar travados no Vermelho</b>! Se qualquer carro avançar enquanto há pedestres na faixa, ocorre perigo imediato de acidente!
                    </p>
                    <div style="background:#090D16;border:1px solid #8B5CF6;border-radius:12px;padding:12px;font-family:'Fira Code',monospace;font-size:0.82rem;line-height:1.6;">
                        digitalWrite(PIN_SEM1_VERMELHO, HIGH);<br>
                        digitalWrite(PIN_SEM2_VERMELHO, HIGH);<br>
                        digitalWrite(PIN_PED_VERDE, HIGH); <span style="color:#34D399;">// 🚶 Travessia liberada!</span><br>
                        delay(2500);<br>
                        digitalWrite(PIN_PED_VERDE, LOW);<br>
                        digitalWrite(PIN_PED_VERMELHO, HIGH);
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
                        <div class="sem-dot" id="sem_dot_5"></div>
                    </div>
                    <button class="sem-guide-nav-btn primary" id="sem_guide_next_btn" onclick="sem_nextGuideSlide()">
                        Próximo <i class="fa-solid fa-arrow-right"></i>
                    </button>
                </div>
            </div>

            <!-- BARRA DE SELEÇÃO DOS 5 NÍVEIS -->
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
                <button class="sem-level-btn" id="sem_btn_lvl_5" onclick="sem_switchLevel(5)">
                    <div class="sem-lvl-left">
                        <div class="sem-lvl-num">5</div>
                        <div class="sem-lvl-info">
                            <span class="sem-lvl-title">Metrópole Maker 🌆</span>
                            <span class="sem-lvl-sub">4 Fluxos Paralelos 🚗🏎️🚙🚖</span>
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

                    <!-- LINHAS BRANCAS DE PARADA (STOP LINES NAS 4 ENTRADAS) -->
                    <div class="sem-stop-line-west" title="Linha de Retenção Oeste (Avenida ➔ Leste)"></div>
                    <div class="sem-stop-line-east" title="Linha de Retenção Leste (Avenida ➔ Oeste)"></div>
                    <div class="sem-stop-line-north" title="Linha de Retenção Norte (Rua ➔ Sul)"></div>
                    <div class="sem-stop-line-south" title="Linha de Retenção Sul (Rua ➔ Norte)"></div>

                    <!-- ÁREA CENTRAL DO CRUZAMENTO -->
                    <div class="sem-junction-box"></div>

                    <!-- ================= SEMÁFORO 1 (FLUXO 1 - AVENIDA PRINCIPAL) ================= -->
                    <div class="sem-traffic-post sem-post-1" title="Semáforo 1 (Controla o Fluxo da Avenida)">
                        <div class="sem-num-badge n1">1</div>
                        <div class="sem-bulb red" id="sem_a_red"></div>
                        <div class="sem-bulb yellow" id="sem_a_yellow"></div>
                        <div class="sem-bulb green on" id="sem_a_green"></div>
                    </div>

                    <!-- ================= SEMÁFORO 2 (FLUXO 2 - RUA TRANSVERSAL) ================= -->
                    <div class="sem-traffic-post sem-post-2" title="Semáforo 2 (Controla o Fluxo da Rua Transversal)">
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
                    <!-- 1. Carro Vermelho 🚗 (Avenida Sul: Oeste -> Leste) -->
                    <div class="sem-vehicle" id="sem_car_red" title="Carro Vermelho (Avenida Sul ➔ Leste)">
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

                    <!-- 2. Carro Azul 🚙 (Rua Oeste: Norte -> Sul) -->
                    <div class="sem-vehicle" id="sem_car_blue" title="Carro Azul (Rua Oeste ➔ Sul)">
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

                    <!-- 3. Carro Verde 🏎️ (Avenida Norte: Leste -> Oeste, pista paralela oposta) -->
                    <div class="sem-vehicle" id="sem_car_green" title="Carro Verde (Avenida Norte ➔ Oeste)">
                        <svg viewBox="0 0 100 50">
                            <rect x="5" y="10" width="85" height="30" rx="8" fill="#10B981" stroke="#047857" stroke-width="2"/>
                            <rect x="25" y="14" width="45" height="22" rx="5" fill="#064E3B" stroke="#047857" stroke-width="1.5"/>
                            <rect x="42" y="17" width="24" height="16" rx="3" fill="#A7F3D0" opacity="0.9"/>
                            <circle cx="88" cy="14" r="3.5" fill="#FEF08A"/>
                            <circle cx="88" cy="36" r="3.5" fill="#FEF08A"/>
                            <rect x="18" y="5" width="16" height="6" rx="2" fill="#0F172A"/>
                            <rect x="18" y="39" width="16" height="6" rx="2" fill="#0F172A"/>
                            <rect x="62" y="5" width="16" height="6" rx="2" fill="#0F172A"/>
                            <rect x="62" y="39" width="16" height="6" rx="2" fill="#0F172A"/>
                        </svg>
                    </div>

                    <!-- 4. Carro Amarelo 🚖 (Rua Leste: Sul -> Norte, pista paralela oposta) -->
                    <div class="sem-vehicle" id="sem_car_yellow" title="Carro Amarelo (Rua Leste ➔ Norte)">
                        <svg viewBox="0 0 100 50">
                            <rect x="5" y="10" width="85" height="30" rx="8" fill="#FBBF24" stroke="#D97706" stroke-width="2"/>
                            <rect x="25" y="14" width="45" height="22" rx="5" fill="#78350F" stroke="#D97706" stroke-width="1.5"/>
                            <rect x="42" y="17" width="24" height="16" rx="3" fill="#FEF08A" opacity="0.9"/>
                            <circle cx="88" cy="14" r="3.5" fill="#FFFFFF"/>
                            <circle cx="88" cy="36" r="3.5" fill="#FFFFFF"/>
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
                        <div class="sem-editor-title" id="sem_editor_title"><i class="fa-solid fa-code"></i> Temporização & digitalWrite() em C/C++</div>
                        <div class="sem-lang-tag">Arduino C++</div>
                    </div>

                    <!-- SCAFFOLDING NÍVEL 1 (Parada Segura no Semáforo 1) -->
                    <div id="sem_scaffold_n1" class="sem-scaffold-lines">
                        <div style="background:#1E293B;border-left:3px solid #F59E0B;padding:8px 12px;border-radius:0 8px 8px 0;margin-bottom:12px;color:#FBBF24;font-size:0.82rem;font-weight:700;">
                            ⚡ <b>digitalWrite(pino, ESTADO):</b> Complete a função <code>loop()</code> para enviar 5V (HIGH) ao LED Verde, depois o alerta Amarelo e termine com o Vermelho de parada antes da linha branca:
                        </div>

                        <!-- Configuração dos Pinos no Setup -->
                        <div class="sem-sketch-setup">
                            <span class="c-kw">void</span> <span class="c-fn">setup</span>() { <span class="c-cm">// 🔌 Configura os pinos como OUTPUT (Saída Digital)</span><br>
                            &nbsp;&nbsp;<span class="c-fn">pinMode</span>(PIN_SEM1_VERDE, <span class="c-cst">OUTPUT</span>);<br>
                            &nbsp;&nbsp;<span class="c-fn">pinMode</span>(PIN_SEM1_AMARELO, <span class="c-cst">OUTPUT</span>);<br>
                            &nbsp;&nbsp;<span class="c-fn">pinMode</span>(PIN_SEM1_VERMELHO, <span class="c-cst">OUTPUT</span>);<br>
                            }
                        </div>

                        <!-- Função loop() principal contínua -->
                        <div class="sem-sketch-loop-tag">
                            <span class="c-kw">void</span> <span class="c-fn">loop</span>() { <span class="c-cm">// 🔁 Executa em ciclo contínuo:</span>
                        </div>

                        <div class="sem-sketch-loop-body">
                            <div class="sem-scaffold-line"><span class="c-cm">// 1️⃣ Fase 1: Enviar sinal elétrico HIGH para liberar o fluxo</span></div>
                            <div class="sem-scaffold-line">
                                <select class="sem-select-cmd" id="sem_n1_cmd1" onchange="sem_updateLiveCpp()">
                                    <option value="" selected disabled>— acionar pino digital —</option>
                                    <option value="digitalWrite(PIN_SEM1_VERDE, HIGH)">digitalWrite(PIN_SEM1_VERDE, HIGH);</option>
                                    <option value="digitalWrite(PIN_SEM1_AMARELO, HIGH)">digitalWrite(PIN_SEM1_AMARELO, HIGH);</option>
                                    <option value="digitalWrite(PIN_SEM1_VERMELHO, HIGH)">digitalWrite(PIN_SEM1_VERMELHO, HIGH);</option>
                                </select>
                            </div>
                            <div class="sem-scaffold-line">
                                <span style="color:#38BDF8;font-weight:bold;">carro1_avancar();</span> <span class="c-cm">// Fluxo da avenida se desloca</span>
                            </div>
                            <div class="sem-scaffold-line" style="margin-top:6px;">
                                <span class="c-fn">delay</span>( <input type="number" class="sem-input-num" id="sem_n1_delay1" min="500" max="5000" step="500" value="2000" oninput="sem_updateLiveCpp()" /> ); <span class="c-cm">// ms na abertura</span>
                            </div>

                            <div class="sem-scaffold-line" style="margin-top:8px;"><span class="c-cm">// 2️⃣ Fase 2: Alerta obrigatório de desaceleração</span></div>
                            <div class="sem-scaffold-line">
                                <select class="sem-select-cmd" id="sem_n1_cmd2" onchange="sem_updateLiveCpp()">
                                    <option value="" selected disabled>— sinal de transição —</option>
                                    <option value="digitalWrite(PIN_SEM1_AMARELO, HIGH)">digitalWrite(PIN_SEM1_AMARELO, HIGH);</option>
                                    <option value="digitalWrite(PIN_SEM1_VERMELHO, HIGH)">digitalWrite(PIN_SEM1_VERMELHO, HIGH);</option>
                                    <option value="digitalWrite(PIN_SEM1_VERDE, HIGH)">digitalWrite(PIN_SEM1_VERDE, HIGH);</option>
                                </select>
                            </div>
                            <div class="sem-scaffold-line" style="margin-top:6px;">
                                <span class="c-fn">delay</span>( <input type="number" class="sem-input-num" id="sem_n1_delay2" min="500" max="3000" step="500" value="1000" oninput="sem_updateLiveCpp()" /> ); <span class="c-cm">// ms no amarelo</span>
                            </div>

                            <div class="sem-scaffold-line" style="margin-top:8px;"><span class="c-cm">// 3️⃣ Fase 3: Fechamento com retenção na linha branca</span></div>
                            <div class="sem-scaffold-line">
                                <select class="sem-select-cmd" id="sem_n1_cmd3" onchange="sem_updateLiveCpp()">
                                    <option value="" selected disabled>— retenção veicular —</option>
                                    <option value="digitalWrite(PIN_SEM1_VERMELHO, HIGH)">digitalWrite(PIN_SEM1_VERMELHO, HIGH);</option>
                                    <option value="digitalWrite(PIN_SEM1_VERDE, HIGH)">digitalWrite(PIN_SEM1_VERDE, HIGH);</option>
                                    <option value="digitalWrite(PIN_SEM1_AMARELO, HIGH)">digitalWrite(PIN_SEM1_AMARELO, HIGH);</option>
                                </select>
                            </div>
                            <div class="sem-scaffold-line">
                                <span style="color:#EF4444;font-weight:bold;">carro1_parar();</span> <span class="c-cm">// Para antes da faixa zebrada</span>
                            </div>
                        </div>

                        <div class="sem-sketch-loop-close">
                            } <span class="c-cm">// Fim do void loop() — reinicia automaticamente!</span>
                        </div>
                    </div>

                    <!-- SCAFFOLDING NÍVEL 2 (Semáforo 1 vs Semáforo 2 sem colisão) -->
                    <div id="sem_scaffold_n2" class="sem-scaffold-lines" style="display:none;">
                        <div style="background:#1E293B;border-left:3px solid #38BDF8;padding:8px 12px;border-radius:0 8px 8px 0;margin-bottom:12px;color:#38BDF8;font-size:0.82rem;font-weight:700;">
                            💡 <b>Regras de Trânsito:</b> Complete o <code>void loop()</code> garantindo que enquanto o fluxo da avenida cruzar no verde, a rua transversal fique no vermelho, evitando colisões!
                        </div>

                        <!-- Configuração dos Pinos no Setup -->
                        <div class="sem-sketch-setup">
                            <span class="c-kw">void</span> <span class="c-fn">setup</span>() { <span class="c-cm">// 🔌 Configura Semáforo 1 e Semáforo 2 como OUTPUT</span><br>
                            &nbsp;&nbsp;<span class="c-fn">pinMode</span>(PIN_SEM1_VERDE, <span class="c-cst">OUTPUT</span>); &nbsp;<span class="c-fn">pinMode</span>(PIN_SEM2_VERDE, <span class="c-cst">OUTPUT</span>);<br>
                            &nbsp;&nbsp;<span class="c-fn">pinMode</span>(PIN_SEM1_AMARELO, <span class="c-cst">OUTPUT</span>); <span class="c-fn">pinMode</span>(PIN_SEM2_AMARELO, <span class="c-cst">OUTPUT</span>);<br>
                            &nbsp;&nbsp;<span class="c-fn">pinMode</span>(PIN_SEM1_VERMELHO, <span class="c-cst">OUTPUT</span>); <span class="c-fn">pinMode</span>(PIN_SEM2_VERMELHO, <span class="c-cst">OUTPUT</span>);<br>
                            }
                        </div>

                        <div class="sem-sketch-loop-tag">
                            <span class="c-kw">void</span> <span class="c-fn">loop</span>() { <span class="c-cm">// 🔁 Alternância segura entre os cruzamentos:</span>
                        </div>

                        <div class="sem-sketch-loop-body">
                            <div class="sem-scaffold-line"><span class="c-cm">// 1️⃣ Fase da Avenida: Semáforo 2 fechado e Avenida liberada</span></div>
                            <div class="sem-scaffold-line"><span class="c-fn">digitalWrite</span>(PIN_SEM2_VERMELHO, <span class="c-cst">HIGH</span>);</div>
                            <div class="sem-scaffold-line"><span class="c-fn">carro2_parar</span>();</div>
                            <div class="sem-scaffold-line">
                                <select class="sem-select-cmd" id="sem_n2_cmd1" onchange="sem_updateLiveCpp()">
                                    <option value="" selected disabled>— acionar pino digital —</option>
                                    <option value="digitalWrite(PIN_SEM1_VERDE, HIGH)">digitalWrite(PIN_SEM1_VERDE, HIGH);</option>
                                    <option value="digitalWrite(PIN_SEM1_AMARELO, HIGH)">digitalWrite(PIN_SEM1_AMARELO, HIGH);</option>
                                    <option value="digitalWrite(PIN_SEM1_VERMELHO, HIGH)">digitalWrite(PIN_SEM1_VERMELHO, HIGH);</option>
                                </select>
                            </div>
                            <div class="sem-scaffold-line">
                                <span style="color:#38BDF8;font-weight:bold;">carro1_avancar();</span> <span class="c-cm">// Carro cruza a avenida</span>
                            </div>
                            <div class="sem-scaffold-line">
                                <span class="c-fn">delay</span>( <input type="number" class="sem-input-num" id="sem_n2_delay1" min="1000" max="4000" step="500" value="2000" oninput="sem_updateLiveCpp()" /> );
                            </div>

                            <div class="sem-scaffold-line" style="margin-top:8px;"><span class="c-cm">// 2️⃣ Transição: Alerta de desaceleração na avenida</span></div>
                            <div class="sem-scaffold-line">
                                <select class="sem-select-cmd" id="sem_n2_cmd2" onchange="sem_updateLiveCpp()">
                                    <option value="" selected disabled>— sinal de desaceleração —</option>
                                    <option value="digitalWrite(PIN_SEM1_AMARELO, HIGH)">digitalWrite(PIN_SEM1_AMARELO, HIGH);</option>
                                    <option value="digitalWrite(PIN_SEM1_VERMELHO, HIGH)">digitalWrite(PIN_SEM1_VERMELHO, HIGH);</option>
                                    <option value="digitalWrite(PIN_SEM2_VERDE, HIGH)">digitalWrite(PIN_SEM2_VERDE, HIGH);</option>
                                </select>
                            </div>
                            <div class="sem-scaffold-line">
                                <span class="c-fn">delay</span>( 1000 );
                            </div>

                            <div class="sem-scaffold-line" style="margin-top:8px;"><span class="c-cm">// 3️⃣ Fase da Rua Transversal: Fecha avenida e abre rua</span></div>
                            <div class="sem-scaffold-line"><span class="c-fn">digitalWrite</span>(PIN_SEM1_VERMELHO, <span class="c-cst">HIGH</span>);</div>
                            <div class="sem-scaffold-line"><span class="c-fn">carro1_parar</span>();</div>
                            <div class="sem-scaffold-line">
                                <select class="sem-select-cmd" id="sem_n2_cmd3" onchange="sem_updateLiveCpp()">
                                    <option value="" selected disabled>— abrir transversal —</option>
                                    <option value="digitalWrite(PIN_SEM2_VERDE, HIGH)">digitalWrite(PIN_SEM2_VERDE, HIGH);</option>
                                    <option value="digitalWrite(PIN_SEM2_AMARELO, HIGH)">digitalWrite(PIN_SEM2_AMARELO, HIGH);</option>
                                    <option value="digitalWrite(PIN_SEM2_VERMELHO, HIGH)">digitalWrite(PIN_SEM2_VERMELHO, HIGH);</option>
                                </select>
                            </div>
                            <div class="sem-scaffold-line">
                                <span style="color:#38BDF8;font-weight:bold;">carro2_avancar();</span> <span class="c-cm">// Carro cruza transversal</span>
                            </div>
                            <div class="sem-scaffold-line">
                                <span class="c-fn">delay</span>( <input type="number" class="sem-input-num" id="sem_n2_delay2" min="1000" max="4000" step="500" value="2000" oninput="sem_updateLiveCpp()" /> );
                            </div>
                        </div>

                        <div class="sem-sketch-loop-close">
                            } <span class="c-cm">// Fim do void loop() — ciclo repetitivo seguro</span>
                        </div>
                    </div>

                    <!-- SCAFFOLDING NÍVEL 3 (Travessia de Pedestres) -->
                    <div id="sem_scaffold_n3" class="sem-scaffold-lines" style="display:none;">
                        <div style="background:#1E293B;border-left:3px solid #10B981;padding:8px 12px;border-radius:0 8px 8px 0;margin-bottom:12px;color:#34D399;font-size:0.82rem;font-weight:700;">
                            🚶 <b>Proteção aos Pedestres:</b> Complete o <code>void loop()</code> para travar todos os carros no vermelho antes de abrir o semáforo de pedestres na faixa zebrada!
                        </div>

                        <!-- Configuração dos Pinos no Setup -->
                        <div class="sem-sketch-setup">
                            <span class="c-kw">void</span> <span class="c-fn">setup</span>() { <span class="c-cm">// 🔌 Semáforos Veiculares e de Pedestre como OUTPUT</span><br>
                            &nbsp;&nbsp;<span class="c-fn">pinMode</span>(PIN_SEM1_VERMELHO, <span class="c-cst">OUTPUT</span>); &nbsp;<span class="c-fn">pinMode</span>(PIN_SEM2_VERMELHO, <span class="c-cst">OUTPUT</span>);<br>
                            &nbsp;&nbsp;<span class="c-fn">pinMode</span>(PIN_PEDESTRE_VERDE, <span class="c-cst">OUTPUT</span>); &nbsp;<span class="c-fn">pinMode</span>(PIN_PEDESTRE_VERMELHO, <span class="c-cst">OUTPUT</span>);<br>
                            }
                        </div>

                        <div class="sem-sketch-loop-tag">
                            <span class="c-kw">void</span> <span class="c-fn">loop</span>() { <span class="c-cm">// 🔁 Ciclo com travessia protegida na faixa:</span>
                        </div>

                        <div class="sem-sketch-loop-body">
                            <div class="sem-scaffold-line"><span class="c-cm">// 1️⃣ Bloqueio geral dos veículos nas linhas de retenção</span></div>
                            <div class="sem-scaffold-line"><span class="c-fn">digitalWrite</span>(PIN_SEM1_VERMELHO, <span class="c-cst">HIGH</span>);</div>
                            <div class="sem-scaffold-line"><span class="c-fn">carro1_parar</span>();</div>
                            <div class="sem-scaffold-line"><span class="c-fn">digitalWrite</span>(PIN_SEM2_VERMELHO, <span class="c-cst">HIGH</span>);</div>
                            <div class="sem-scaffold-line"><span class="c-fn">carro2_parar</span>();</div>
                            <div class="sem-scaffold-line"><span class="c-fn">delay</span>( 800 ); <span class="c-cm">// Margem de segurança de parada</span></div>

                            <div class="sem-scaffold-line" style="margin-top:8px;"><span class="c-cm">// 2️⃣ Libere a faixa no Semáforo de Pedestre 🚸</span></div>
                            <div class="sem-scaffold-line">
                                <select class="sem-select-cmd" id="sem_n3_cmd1" onchange="sem_updateLiveCpp()">
                                    <option value="" selected disabled>— sinal de pedestres —</option>
                                    <option value="digitalWrite(PIN_PEDESTRE_VERDE, HIGH)">digitalWrite(PIN_PEDESTRE_VERDE, HIGH);</option>
                                    <option value="digitalWrite(PIN_PEDESTRE_VERMELHO, HIGH)">digitalWrite(PIN_PEDESTRE_VERMELHO, HIGH);</option>
                                </select>
                            </div>
                            <div class="sem-scaffold-line">
                                <span style="color:#10B981;font-weight:bold;">pedestre_atravessar();</span> <span class="c-cm">// Pedestre cruza a faixa zebrada</span>
                            </div>
                            <div class="sem-scaffold-line">
                                <span class="c-fn">delay</span>( <input type="number" class="sem-input-num" id="sem_n3_delay1" min="1500" max="4000" step="500" value="2500" oninput="sem_updateLiveCpp()" /> ); <span class="c-cm">// ms para atravessar</span>
                            </div>

                            <div class="sem-scaffold-line" style="margin-top:8px;"><span class="c-cm">// 3️⃣ Encerre a travessia com segurança</span></div>
                            <div class="sem-scaffold-line">
                                <select class="sem-select-cmd" id="sem_n3_cmd2" onchange="sem_updateLiveCpp()">
                                    <option value="" selected disabled>— fechar faixa —</option>
                                    <option value="digitalWrite(PIN_PEDESTRE_VERMELHO, HIGH)">digitalWrite(PIN_PEDESTRE_VERMELHO, HIGH);</option>
                                    <option value="digitalWrite(PIN_PEDESTRE_VERDE, HIGH)">digitalWrite(PIN_PEDESTRE_VERDE, HIGH);</option>
                                </select>
                            </div>
                            <div class="sem-scaffold-line">
                                <span style="color:#EF4444;font-weight:bold;">pedestre_parar();</span> <span class="c-cm">// Fim da travessia</span>
                            </div>
                        </div>

                        <div class="sem-sketch-loop-close">
                            } <span class="c-cm">// Fim do void loop() — ciclo repetitivo seguro</span>
                        </div>
                    </div>

                    <!-- NÍVEL 4 & 5 (MINI-IDE LIVRE EM C/C++) -->
                    <div id="sem_ide_n4" style="display:none;">
                        <!-- Teclado de Atalhos Rápidos com digitalWrite e Funções de Trânsito -->
                        <div class="sem-shortcuts-bar">
                            <button type="button" class="sem-shortcut-btn btn-s1" onclick="sem_insertText('digitalWrite(PIN_SEM1_VERDE, HIGH);\n')">🟢 S1 VERDE HIGH</button>
                            <button type="button" class="sem-shortcut-btn btn-s1" onclick="sem_insertText('digitalWrite(PIN_SEM1_AMARELO, HIGH);\n')">🟡 S1 AMARELO HIGH</button>
                            <button type="button" class="sem-shortcut-btn btn-s1" onclick="sem_insertText('digitalWrite(PIN_SEM1_VERMELHO, HIGH);\n')">🔴 S1 VERMELHO HIGH</button>
                            <button type="button" class="sem-shortcut-btn btn-s2" onclick="sem_insertText('digitalWrite(PIN_SEM2_VERDE, HIGH);\n')">🟢 S2 VERDE HIGH</button>
                            <button type="button" class="sem-shortcut-btn btn-s2" onclick="sem_insertText('digitalWrite(PIN_SEM2_AMARELO, HIGH);\n')">🟡 S2 AMARELO HIGH</button>
                            <button type="button" class="sem-shortcut-btn btn-s2" onclick="sem_insertText('digitalWrite(PIN_SEM2_VERMELHO, HIGH);\n')">🔴 S2 VERMELHO HIGH</button>
                            <button type="button" class="sem-shortcut-btn btn-ped" onclick="sem_insertText('digitalWrite(PIN_PEDESTRE_VERDE, HIGH);\n')">🚶 PED VERDE HIGH</button>
                            <button type="button" class="sem-shortcut-btn btn-ped" onclick="sem_insertText('digitalWrite(PIN_PEDESTRE_VERMELHO, HIGH);\n')">🛑 PED VERM HIGH</button>
                            <button type="button" class="sem-shortcut-btn btn-s1" onclick="sem_insertText('carro1_avancar();\n')">🚗 Fluxo 1 Avançar</button>
                            <button type="button" class="sem-shortcut-btn btn-s2" onclick="sem_insertText('carro2_avancar();\n')">🚙 Fluxo 2 Avançar</button>
                            <button type="button" class="sem-shortcut-btn btn-ped" onclick="sem_insertText('pedestre_atravessar();\n')">🚸 Pedestre Atravessar</button>
                            <button type="button" class="sem-shortcut-btn" onclick="sem_insertText('delay(2000);\n')">⏱️ delay(2000)</button>
                            <button type="button" class="sem-shortcut-btn" onclick="sem_insertText('delay(1000);\n')">⏱️ delay(1000)</button>
                            <button type="button" class="sem-shortcut-btn clear" onclick="sem_clearIde()"><i class="fa-solid fa-trash"></i> Limpar</button>
                        </div>

                        <!-- Editor Textarea com Numeração de Linhas e Autocomplete Flutuante -->
                        <div class="sem-code-wrapper">
                            <div class="sem-line-numbers" id="sem_line_numbers">1<br>2<br>3<br>4<br>5<br>6<br>7<br>8</div>
                            <textarea class="sem-code-input" id="sem_code_input" spellcheck="false" 
                                      placeholder="// 🚦 Digite seu código Arduino C/C++ aqui! (Pressione Tab para auto-completar)&#10;// Exemplo:&#10;// digitalWrite(PIN_SEM1_VERDE, HIGH); carro1_avancar(); delay(2000);&#10;// digitalWrite(PIN_SEM1_AMARELO, HIGH); delay(1000);&#10;// digitalWrite(PIN_SEM1_VERMELHO, HIGH); digitalWrite(PIN_SEM2_VERDE, HIGH); carro2_avancar(); delay(2000);" 
                                      oninput="sem_handleIdeInput(); sem_ideAutoComplete(this);" 
                                      onkeydown="sem_handleIdeKeyDown(event, this);" 
                                      onscroll="document.getElementById('sem_line_numbers').scrollTop = this.scrollTop;"></textarea>
                            <div class="sem-autocomplete-box" id="sem_autocomplete_list"></div>
                        </div>

                        <div style="background:#0F172A;border:1px dashed #F59E0B;border-radius:12px;padding:10px 14px;margin-top:10px;font-size:0.82rem;color:#CBD5E1;display:flex;flex-direction:column;gap:6px;">
                            <div><b>⚡ Dica Maker:</b> Digite o início de um comando (ex: <code>dig</code>, <code>del</code>, <code>car</code>, <code>ped</code>, <code>s1</code>, <code>s2</code>) e pressione <b>Tab ⇥</b> para autocompletar!</div>
                            <div style="font-size:0.78rem;color:#94A3B8;">
                                <b>Comandos:</b> 
                                <code style="background:#1E293B;color:#EF4444;padding:2px 5px;border-radius:4px;">digitalWrite(PIN_SEM1_VERDE, HIGH);</code> 
                                <code style="background:#1E293B;color:#38BDF8;padding:2px 5px;border-radius:4px;">digitalWrite(PIN_SEM2_VERDE, HIGH);</code> 
                                <code style="background:#1E293B;color:#10B981;padding:2px 5px;border-radius:4px;">digitalWrite(PIN_PEDESTRE_VERDE, HIGH);</code> 
                                <code style="background:#1E293B;color:#FBBF24;padding:2px 5px;border-radius:4px;">delay(2000);</code>
                            </div>
                        </div>
                    </div>

                    <!-- Botão de Solução (Apenas liberado após 3 erros) -->
                    <button type="button" class="sem-btn-solution" id="sem_btn_solution" onclick="sem_toggleSolution()" disabled>
                        <i class="fa-solid fa-lightbulb"></i> <span>💡 Precisa de Ajuda? Ver Resolução C/C++</span>
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
let sem_errors_count = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

// Posições físicas dos 4 veículos:
// 'start'   -> aproximação pela via
// 'stop'    -> parado na linha branca de retenção
// 'cross'   -> na interseção central
// 'exit'    -> seguiu em frente no seu sentido (NUNCA DE RÉ!)
let sem_carRed_state = 'start';     // Avenida Sul: Oeste ➔ Leste
let sem_carBlue_state = 'start';    // Rua Oeste: Norte ➔ Sul
let sem_carGreen_state = 'start';   // Avenida Norte: Leste ➔ Oeste (Pista paralela oposta)
let sem_carYellow_state = 'start';  // Rua Leste: Sul ➔ Norte (Pista paralela oposta)
let sem_ped_state = 'sidewalk_south';

const sem_levels_data = {
    1: {
        title: 'Missão 1: Engenharia de Tráfego da Avenida (Semáforo 1 🚗)',
        badge: 'Fluxo 1 (Avenida Principal)',
        desc: 'O fluxo de veículos da <b>Avenida Principal</b> precisa de controle automatizado em Arduino C++!<br><br><b>Requisitos Técnicos da Engenharia de Tráfego:</b><ul style="margin:6px 0 6px 18px;padding:0;line-height:1.6;"><li>Nesta avenida, o sinal <b>Verde</b> deve sempre abrir primeiro para dar partida no tráfego veicular.</li><li>O sinal verde deve permanecer liberado por exatamente <b>2 segundos (2000 ms)</b>.</li><li>Antes de fechar totalmente, é <b>obrigatório</b> emitir um alerta com a luz <b>Amarela</b> por <b>1 segundo (1000 ms)</b> para que os motoristas desacelerem com segurança sem freagens bruscas.</li><li>Por fim, feche o semáforo com a luz <b>Vermelha</b> com parada total dos veículos antes da linha branca de retenção!</li></ul>Selecione os comandos usando <code>digitalWrite(pino, HIGH/LOW)</code> e ajuste os tempos de espera.',
        solution: `// Solução Nível 1 (Arduino C++):
digitalWrite(PIN_SEM1_VERDE, HIGH);
carro1_avancar();
delay(2000);
digitalWrite(PIN_SEM1_AMARELO, HIGH);
delay(1000);
digitalWrite(PIN_SEM1_VERMELHO, HIGH);
carro1_parar();`
    },
    2: {
        title: 'Missão 2: O Cruzamento Crítico (Semáforo 1 vs Semáforo 2)',
        badge: 'Avenida ⚡ Rua Transversal',
        desc: 'Dois fluxos perpendiculares se encontram no cruzamento central!<br><br><b>Requisitos de Segurança Viária:</b><ul style="margin:6px 0 6px 18px;padding:0;line-height:1.6;"><li>Pela lei universal de trânsito, enquanto a <b>Avenida (Semáforo 1)</b> estiver liberada no verde, a <b>Rua Transversal (Semáforo 2)</b> deve estar obrigatoriamente travada no <b>Vermelho</b> com seus veículos retidos!</li><li>Mantenha a avenida fluindo por <b>2 segundos</b>.</li><li>Acione o sinal de aviso <b>Amarelo</b> da avenida por <b>1 segundo</b>.</li><li>Feche a avenida no <b>Vermelho</b> e abra a <b>Rua Transversal (Semáforo 2)</b> no <b>Verde</b> por <b>2 segundos</b> para que o Carro Azul possa descer com segurança!</li></ul>',
        solution: `// Solução Nível 2 (Arduino C++):
digitalWrite(PIN_SEM2_VERMELHO, HIGH);
carro2_parar();
digitalWrite(PIN_SEM1_VERDE, HIGH);
carro1_avancar();
delay(2000);
digitalWrite(PIN_SEM1_AMARELO, HIGH);
delay(1000);
digitalWrite(PIN_SEM1_VERMELHO, HIGH);
carro1_parar();
digitalWrite(PIN_SEM2_VERDE, HIGH);
carro2_avancar();
delay(2000);`
    },
    3: {
        title: 'Missão 3: Travessia Segura de Pedestres (Semáforo 🚸)',
        badge: 'Área Escolar 🚶',
        desc: 'Área com grande circulação de estudantes na faixa zebrada!<br><br><b>Requisitos de Proteção ao Pedestre:</b><ul style="margin:6px 0 6px 18px;padding:0;line-height:1.6;"><li>Para que o pedestre atravesse a rua em segurança, <b>AMBOS os semáforos veiculares (1 e 2) devem estar fechados no Vermelho</b> com margem de segurança de <b>800 ms</b> para parada completa dos motores.</li><li>Acione o sinal de pedestre no <b>Verde</b> com <code>digitalWrite(PIN_PEDESTRE_VERDE, HIGH)</code> e mantenha a travessia aberta por exatamente <b>2.5 segundos (2500 ms)</b>.</li><li>Ao final, feche a faixa com <code>digitalWrite(PIN_PEDESTRE_VERMELHO, HIGH)</code> antes de qualquer reabertura para os carros!</li></ul>',
        solution: `// Solução Nível 3 (Arduino C++):
digitalWrite(PIN_SEM1_VERMELHO, HIGH);
carro1_parar();
digitalWrite(PIN_SEM2_VERMELHO, HIGH);
carro2_parar();
delay(800);
digitalWrite(PIN_PEDESTRE_VERDE, HIGH);
pedestre_atravessar();
delay(2500);
digitalWrite(PIN_PEDESTRE_VERMELHO, HIGH);
pedestre_parar();`
    },
    4: {
        title: 'Missão 4: Programador de Tráfego Urbano (Mini-IDE Livre)',
        badge: 'Ciclo Completo em Arduino C++',
        desc: 'Assuma o console central e programe o ciclo contínuo na <b>Mini-IDE</b>!<br><br><b>Requisitos da Operação de Trânsito:</b><ul style="margin:6px 0 6px 18px;padding:0;line-height:1.6;"><li>Abra a Avenida (Semáforo 1) no Verde por <b>2000 ms</b> com a Rua Transversal fechada.</li><li>Transicione a Avenida no Amarelo por <b>1000 ms</b> e feche no Vermelho.</li><li>Abra a Rua Transversal (Semáforo 2) no Verde por <b>2000 ms</b>, alerte no Amarelo por <b>1000 ms</b> e feche no Vermelho.</li><li>Com todos os carros parados nas faixas brancas, libere os Pedestres no Semáforo 🚸 por <b>2000 ms</b> e encerre a travessia no Vermelho.</li></ul>',
        solution: `// Solução Nível 4 (Arduino C++):
digitalWrite(PIN_SEM2_VERMELHO, HIGH);
carro2_parar();
digitalWrite(PIN_SEM1_VERDE, HIGH);
carro1_avancar();
delay(2000);
digitalWrite(PIN_SEM1_AMARELO, HIGH);
delay(1000);
digitalWrite(PIN_SEM1_VERMELHO, HIGH);
carro1_parar();
digitalWrite(PIN_SEM2_VERDE, HIGH);
carro2_avancar();
delay(2000);
digitalWrite(PIN_SEM2_AMARELO, HIGH);
delay(1000);
digitalWrite(PIN_SEM2_VERMELHO, HIGH);
carro2_parar();
digitalWrite(PIN_PEDESTRE_VERDE, HIGH);
pedestre_atravessar();
delay(2000);
digitalWrite(PIN_PEDESTRE_VERMELHO, HIGH);
pedestre_parar();`
    },
    5: {
        title: 'Missão 5: Grande Metrópole Maker (4 Fluxos em Mão Dupla)',
        badge: '4 Fluxos Simultâneos 🚗🏎️🚙🚖',
        desc: 'O tráfego aumentou e a metrópole agora conta com <b>4 carros simultâneos em vias de mão dupla</b>!<br><br><b>Regras Físicas e Leis de Trânsito:</b><ul style="margin:6px 0 6px 18px;padding:0;line-height:1.6;"><li><b>Carros na Horizontal (Vermelho 🚗 e Verde 🏎️):</b> Trafegam na mesma avenida em pistas paralelas e sentidos opostos. Como <b>não se cruzam</b>, eles <b>devem e podem avançar JUNTOS</b> quando o Semáforo 1 for Verde!</li><li><b>Carros na Vertical (Azul 🚙 e Amarelo 🚖):</b> Trafegam na rua transversal em pistas paralelas opostas. Eles também <b>avançam JUNTOS</b> quando o Semáforo 2 for Verde!</li><li><b>Colisão Quádrupla:</b> Se o Semáforo 1 e o Semáforo 2 abrirem simultaneamente, os 4 carros batem no centro da interseção!</li><li><b>Segurança dos Pedestres:</b> Quando o sinal de pedestre abrir, os 4 veículos devem estar rigorosamente parados antes de suas linhas brancas!</li></ul>Programe na <b>Mini-IDE</b> a coordenação completa dos 4 fluxos!',
        solution: `// Solução Nível 5 (Grande Metrópole Maker - 4 Fluxos):
digitalWrite(PIN_SEM2_VERMELHO, HIGH);
carro2_parar();
digitalWrite(PIN_SEM1_VERDE, HIGH);
carro1_avancar(); // Carros Vermelho 🚗 e Verde 🏎️ andam juntos na avenida!
delay(2000);
digitalWrite(PIN_SEM1_AMARELO, HIGH);
delay(1000);
digitalWrite(PIN_SEM1_VERMELHO, HIGH);
carro1_parar();
digitalWrite(PIN_SEM2_VERDE, HIGH);
carro2_avancar(); // Carros Azul 🚙 e Amarelo 🚖 andam juntos na transversal!
delay(2000);
digitalWrite(PIN_SEM2_AMARELO, HIGH);
delay(1000);
digitalWrite(PIN_SEM2_VERMELHO, HIGH);
carro2_parar();
digitalWrite(PIN_PEDESTRE_VERDE, HIGH);
pedestre_atravessar();
delay(2500);
digitalWrite(PIN_PEDESTRE_VERMELHO, HIGH);
pedestre_parar();`
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
    for (let i = 1; i <= 5; i++) {
        document.getElementById(`sem_slide_${i}`)?.classList.toggle('active', i === slideNum);
        document.getElementById(`sem_tab_g${i}`)?.classList.toggle('active', i === slideNum);
        document.getElementById(`sem_dot_${i}`)?.classList.toggle('active', i === slideNum);
    }
}

function sem_nextGuideSlide() {
    if (sem_guide_slide < 5) sem_switchGuideTab(sem_guide_slide + 1);
    else sem_switchGuideTab(1);
}

function sem_prevGuideSlide() {
    if (sem_guide_slide > 1) sem_switchGuideTab(sem_guide_slide - 1);
    else sem_switchGuideTab(5);
}

/* ================= NAVEGAÇÃO DE NÍVEIS ================= */

function sem_switchLevel(lvl) {
    if (sem_running) return;
    sem_level = lvl;

    for (let i = 1; i <= 5; i++) {
        document.getElementById(`sem_btn_lvl_${i}`)?.classList.toggle('active', i === lvl);
    }

    const scafN1 = document.getElementById('sem_scaffold_n1');
    const scafN2 = document.getElementById('sem_scaffold_n2');
    const scafN3 = document.getElementById('sem_scaffold_n3');
    const ideN4 = document.getElementById('sem_ide_n4');

    if (scafN1) scafN1.style.display = lvl === 1 ? 'block' : 'none';
    if (scafN2) scafN2.style.display = lvl === 2 ? 'block' : 'none';
    if (scafN3) scafN3.style.display = lvl === 3 ? 'block' : 'none';
    if (ideN4) ideN4.style.display = (lvl === 4 || lvl === 5) ? 'block' : 'none';

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

    sem_updateSolutionButtonState();

    if (lvl === 4 || lvl === 5) {
        sem_handleIdeInput();
    }

    sem_resetScene();
    sem_updateLiveCpp();
}

function sem_updateLevelButtons() {
    const saved = JSON.parse(localStorage.getItem('semaforo_levels') || '[]');
    for (let i = 1; i <= 5; i++) {
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
        sem_carGreen_state = 'stop';
        sem_carYellow_state = 'stop';
        sem_ped_state = 'sidewalk_south';
        sem_setTrafficLights({ a: 'green', b: 'red', ped: 'red' });
    } else if (sem_level === 2) {
        // Nível 2: Carro Vermelho na aproximação. Carro Azul esperando no Semáforo 2 (linha Norte)
        sem_carRed_state = 'start';
        sem_carBlue_state = 'stop';
        sem_carGreen_state = 'stop';
        sem_carYellow_state = 'stop';
        sem_ped_state = 'sidewalk_south';
        sem_setTrafficLights({ a: 'green', b: 'red', ped: 'red' });
    } else if (sem_level === 3) {
        // Nível 3: Todos os carros na linha de parada. Pedestre pronto para atravessar
        sem_carRed_state = 'stop';
        sem_carBlue_state = 'stop';
        sem_carGreen_state = 'stop';
        sem_carYellow_state = 'stop';
        sem_ped_state = 'sidewalk_south';
        sem_setTrafficLights({ a: 'red', b: 'red', ped: 'red' });
    } else if (sem_level === 4) {
        // Nível 4: Ciclo livre de cruzamento padrão
        sem_carRed_state = 'start';
        sem_carBlue_state = 'stop';
        sem_carGreen_state = 'stop';
        sem_carYellow_state = 'stop';
        sem_ped_state = 'sidewalk_south';
        sem_setTrafficLights({ a: 'green', b: 'red', ped: 'red' });
    } else {
        // Nível 5: Grande Metrópole Maker (4 Fluxos simultâneos em mão dupla)
        sem_carRed_state = 'start';
        sem_carGreen_state = 'start';
        sem_carBlue_state = 'stop';
        sem_carYellow_state = 'stop';
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
    const carGreen = document.getElementById('sem_car_green');
    const carYellow = document.getElementById('sem_car_yellow');
    const ped = document.getElementById('sem_ped_1');

    const transitionStyle = animated ? 'all 1.1s cubic-bezier(0.25, 1, 0.5, 1)' : 'none';

    // 1. Carro Vermelho 🚗 (Avenida Sul: Oeste -> Leste)
    if (carRed) {
        carRed.style.transition = transitionStyle;
        if (sem_carRed_state === 'start') carRed.style.left = '25px';
        else if (sem_carRed_state === 'stop') carRed.style.left = 'calc(50% - 165px)'; // antes da linha branca
        else if (sem_carRed_state === 'cross') carRed.style.left = 'calc(50% - 27px)'; // no centro do cruzamento
        else if (sem_carRed_state === 'exit') carRed.style.left = 'calc(100% - 75px)'; // cruzou para a direita
    }

    // 2. Carro Azul 🚙 (Rua Oeste: Norte -> Sul)
    if (carBlue) {
        carBlue.style.transition = transitionStyle;
        if (sem_carBlue_state === 'start') carBlue.style.top = '20px';
        else if (sem_carBlue_state === 'stop') carBlue.style.top = 'calc(50% - 165px)'; // antes da linha branca norte
        else if (sem_carBlue_state === 'cross') carBlue.style.top = 'calc(50% - 27px)'; // no centro
        else if (sem_carBlue_state === 'exit') carBlue.style.top = 'calc(100% - 50px)'; // cruzou descendo
    }

    // 3. Carro Verde 🏎️ (Avenida Norte: Leste -> Oeste, pista paralela oposta)
    if (carGreen) {
        carGreen.style.transition = transitionStyle;
        carGreen.style.display = (sem_level === 5) ? 'block' : 'none';
        if (sem_carGreen_state === 'start') carGreen.style.left = 'calc(100% - 75px)';
        else if (sem_carGreen_state === 'stop') carGreen.style.left = 'calc(50% + 115px)'; // antes da linha leste
        else if (sem_carGreen_state === 'cross') carGreen.style.left = 'calc(50% - 27px)'; // no centro
        else if (sem_carGreen_state === 'exit') carGreen.style.left = '25px'; // cruzou para a esquerda
    }

    // 4. Carro Amarelo 🚖 (Rua Leste: Sul -> Norte, pista paralela oposta)
    if (carYellow) {
        carYellow.style.transition = transitionStyle;
        carYellow.style.display = (sem_level === 5) ? 'block' : 'none';
        if (sem_carYellow_state === 'start') carYellow.style.top = 'calc(100% - 50px)';
        else if (sem_carYellow_state === 'stop') carYellow.style.top = 'calc(50% + 115px)'; // antes da linha sul
        else if (sem_carYellow_state === 'cross') carYellow.style.top = 'calc(50% - 27px)'; // no centro
        else if (sem_carYellow_state === 'exit') carYellow.style.top = '20px'; // cruzou subindo
    }

    // 5. Pedestre 🚶 (Faixa Zebrada Oeste)
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
    // Semáforo 1 (Fluxo da Avenida Principal)
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

    // Semáforo 2 (Fluxo da Rua Transversal)
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
        const c1 = document.getElementById('sem_n1_cmd1')?.value || 'digitalWrite(PIN_SEM1_VERDE, HIGH)';
        const d1 = document.getElementById('sem_n1_delay1')?.value || '2000';
        const c2 = document.getElementById('sem_n1_cmd2')?.value || 'digitalWrite(PIN_SEM1_AMARELO, HIGH)';
        const d2 = document.getElementById('sem_n1_delay2')?.value || '1000';
        const c3 = document.getElementById('sem_n1_cmd3')?.value || 'digitalWrite(PIN_SEM1_VERMELHO, HIGH)';

        loopBody = `  // 1️⃣ Fase 1: Liberar o fluxo na avenida:\n  ${c1};\n  carro1_avancar();\n  delay(${d1});\n\n` +
                   `  // 2️⃣ Fase 2: Alerta obrigatório de desaceleração:\n  ${c2};\n  delay(${d2});\n\n` +
                   `  // 3️⃣ Fase 3: Fechamento e retenção na linha branca:\n  ${c3};\n  carro1_parar();`;
    } else if (sem_level === 2) {
        const c1 = document.getElementById('sem_n2_cmd1')?.value || 'digitalWrite(PIN_SEM1_VERDE, HIGH)';
        const d1 = document.getElementById('sem_n2_delay1')?.value || '2000';
        const c2 = document.getElementById('sem_n2_cmd2')?.value || 'digitalWrite(PIN_SEM1_AMARELO, HIGH)';
        const c3 = document.getElementById('sem_n2_cmd3')?.value || 'digitalWrite(PIN_SEM2_VERDE, HIGH)';
        const d2 = document.getElementById('sem_n2_delay2')?.value || '2000';

        loopBody = `  // Fase 1: Rua transversal travada e avenida liberada:\n  digitalWrite(PIN_SEM2_VERMELHO, HIGH);\n  carro2_parar();\n  ${c1};\n  carro1_avancar();\n  delay(${d1});\n\n` +
                   `  // Fase 2: Alerta de desaceleração na avenida:\n  ${c2};\n  delay(1000);\n\n` +
                   `  // Fase 3: Fecha avenida e abre rua transversal:\n  digitalWrite(PIN_SEM1_VERMELHO, HIGH);\n  carro1_parar();\n  ${c3};\n  carro2_avancar();\n  delay(${d2});`;
    } else if (sem_level === 3) {
        const c1 = document.getElementById('sem_n3_cmd1')?.value || 'digitalWrite(PIN_PEDESTRE_VERDE, HIGH)';
        const d1 = document.getElementById('sem_n3_delay1')?.value || '2500';
        const c2 = document.getElementById('sem_n3_cmd2')?.value || 'digitalWrite(PIN_PEDESTRE_VERMELHO, HIGH)';

        loopBody = `  // Fase 1: Bloqueio veicular total com parada nas linhas:\n  digitalWrite(PIN_SEM1_VERMELHO, HIGH);\n  carro1_parar();\n  digitalWrite(PIN_SEM2_VERMELHO, HIGH);\n  carro2_parar();\n  delay(800);\n\n` +
                   `  // Fase 2: Semáforo de pedestre verde e travessia:\n  ${c1};\n  pedestre_atravessar();\n  delay(${d1});\n\n` +
                   `  // Fase 3: Fechamento da faixa e fim da travessia:\n  ${c2};\n  pedestre_parar();`;
    } else {
        const userCode = document.getElementById('sem_code_input')?.value.trim() || '';
        // Se o aluno colou o sketch completo (com void setup / void loop), exibe sem re-aninhamento:
        if (/void\s+(setup|loop)\s*\(/i.test(userCode)) {
            el.innerText = userCode;
            return;
        }
        if (userCode) {
            loopBody = `  // Código digitado na Mini-IDE:\n  ` + userCode.replace(/\n/g, '\n  ');
        } else {
            loopBody = `  // Digite seu código na Mini-IDE para ver o Arduino C++!`;
        }
    }

    const fullCode = `// --- Cruzamento Inteligente da Cidade Maker (Arduino C++) ---\n` +
                     `// Pinos Digitais do Semáforo 1 (Avenida Principal):\n` +
                     `const int PIN_SEM1_VERMELHO = 12;\n` +
                     `const int PIN_SEM1_AMARELO  = 11;\n` +
                     `const int PIN_SEM1_VERDE    = 10;\n\n` +
                     `// Pinos Digitais do Semáforo 2 (Rua Transversal):\n` +
                     `const int PIN_SEM2_VERMELHO = 9;\n` +
                     `const int PIN_SEM2_AMARELO  = 8;\n` +
                     `const int PIN_SEM2_VERDE    = 7;\n\n` +
                     `// Pinos Digitais do Semáforo de Pedestre 🚸:\n` +
                     `const int PIN_PEDESTRE_VERMELHO = 6;\n` +
                     `const int PIN_PEDESTRE_VERDE    = 5;\n\n` +
                     `// Funções de Controle dos Veículos e Pedestres:\n` +
                     `void carro1_avancar()      { /* Despacha o fluxo da avenida (Carros Vermelho e Verde) */ }\n` +
                     `void carro1_parar()        { /* Aciona retenção na linha branca */ }\n` +
                     `void carro2_avancar()      { /* Despacha o fluxo da rua transversal (Carros Azul e Amarelo) */ }\n` +
                     `void carro2_parar()        { /* Aciona retenção na linha branca */ }\n` +
                     `void pedestre_atravessar() { /* Inicia travessia na faixa zebrada 🚶 */ }\n` +
                     `void pedestre_parar()      { /* Encerra travessia na calçada */ }\n\n` +
                     `void setup() {\n` +
                     `  // Configuração dos Pinos como Saída (OUTPUT):\n` +
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
        alert('Código Arduino C++ copiado com sucesso! 📋 Cole no seu Arduino IDE ou na Mini-IDE!');
    }
}

/* ================= AUTOCOMPLETE & MINI-IDE ================= */

const SEM_AUTOCOMPLETE_OPTIONS = [
    { trigger: 'dig',   label: 'digitalWrite(PIN, VAL);',              insert: 'digitalWrite(' },
    { trigger: 's1v',   label: 'digitalWrite(PIN_SEM1_VERDE, HIGH);',  insert: 'digitalWrite(PIN_SEM1_VERDE, HIGH);\n' },
    { trigger: 's1a',   label: 'digitalWrite(PIN_SEM1_AMARELO, HIGH);',insert: 'digitalWrite(PIN_SEM1_AMARELO, HIGH);\n' },
    { trigger: 's1r',   label: 'digitalWrite(PIN_SEM1_VERMELHO, HIGH);',insert: 'digitalWrite(PIN_SEM1_VERMELHO, HIGH);\n' },
    { trigger: 's2v',   label: 'digitalWrite(PIN_SEM2_VERDE, HIGH);',  insert: 'digitalWrite(PIN_SEM2_VERDE, HIGH);\n' },
    { trigger: 's2a',   label: 'digitalWrite(PIN_SEM2_AMARELO, HIGH);',insert: 'digitalWrite(PIN_SEM2_AMARELO, HIGH);\n' },
    { trigger: 's2r',   label: 'digitalWrite(PIN_SEM2_VERMELHO, HIGH);',insert: 'digitalWrite(PIN_SEM2_VERMELHO, HIGH);\n' },
    { trigger: 'pedv',  label: 'digitalWrite(PIN_PEDESTRE_VERDE, HIGH);', insert: 'digitalWrite(PIN_PEDESTRE_VERDE, HIGH);\n' },
    { trigger: 'pedr',  label: 'digitalWrite(PIN_PEDESTRE_VERMELHO, HIGH);', insert: 'digitalWrite(PIN_PEDESTRE_VERMELHO, HIGH);\n' },
    { trigger: 'ped',   label: 'pedestre_atravessar();',               insert: 'pedestre_atravessar();\n' },
    { trigger: 'car1',  label: 'carro1_avancar();',                    insert: 'carro1_avancar();\n' },
    { trigger: 'car2',  label: 'carro2_avancar();',                    insert: 'carro2_avancar();\n' },
    { trigger: 'car',   label: 'carro1_avancar();',                    insert: 'carro1_avancar();\n' },
    { trigger: 'del',   label: 'delay(2000);',                         insert: 'delay(2000);\n' },
    { trigger: 'dela',  label: 'delay(1000);',                         insert: 'delay(1000);\n' },
    { trigger: 'hig',   label: 'HIGH',                                 insert: 'HIGH' },
    { trigger: 'low',   label: 'LOW',                                  insert: 'LOW' }
];

let sem_currentMatches = [];
let sem_activeAcIndex = 0;

function sem_insertText(txt) {
    const textarea = document.getElementById('sem_code_input');
    if (!textarea) return;
    if (typeof playSound === 'function') playSound('click');
    const start = (typeof textarea.selectionStart === 'number') ? textarea.selectionStart : textarea.value.length;
    const end = (typeof textarea.selectionEnd === 'number') ? textarea.selectionEnd : start;
    const val = textarea.value;
    textarea.value = val.substring(0, start) + txt + val.substring(end);
    const newPos = start + txt.length;
    textarea.selectionStart = textarea.selectionEnd = newPos;
    textarea.focus();
    const list = document.getElementById('sem_autocomplete_list');
    if (list) list.style.display = 'none';
    sem_handleIdeInput();
}

function sem_clearIde() {
    const textarea = document.getElementById('sem_code_input');
    if (textarea) textarea.value = '';
    if (typeof playSound === 'function') playSound('click');
    const list = document.getElementById('sem_autocomplete_list');
    if (list) list.style.display = 'none';
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

function sem_ideAutoComplete(textarea) {
    const list = document.getElementById('sem_autocomplete_list');
    if (!list) return;

    const code = textarea.value;
    const cursorPos = (typeof textarea.selectionStart === 'number') ? textarea.selectionStart : code.length;
    const beforeCursor = code.substring(0, cursorPos);
    const lastWord = beforeCursor.split(/[\s\n{};(),]+/).pop();

    if (!lastWord || lastWord.length < 2) {
        list.style.display = 'none';
        sem_currentMatches = [];
        return;
    }

    const lowWord = lastWord.toLowerCase();
    const matches = SEM_AUTOCOMPLETE_OPTIONS.filter(o => 
        o.trigger.toLowerCase().startsWith(lowWord) || 
        o.label.toLowerCase().includes(lowWord) ||
        o.insert.toLowerCase().includes(lowWord)
    );

    if (matches.length === 0) {
        list.style.display = 'none';
        sem_currentMatches = [];
        return;
    }

    sem_currentMatches = matches;
    sem_activeAcIndex = 0;

    const linesBefore = beforeCursor.split('\n');
    const lineIndex = Math.min(linesBefore.length - 1, 8);
    list.style.top = `${Math.min((lineIndex * 24) + 36, 200)}px`;
    list.style.display = 'block';

    sem_renderAutoCompleteList();
}

function sem_renderAutoCompleteList() {
    const list = document.getElementById('sem_autocomplete_list');
    if (!list) return;

    list.innerHTML = sem_currentMatches.map((m, idx) => {
        const isSel = idx === sem_activeAcIndex;
        const escInsert = m.insert.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, '\\n');
        return `<div class="sem-ac-item ${isSel ? 'active' : ''}" 
                     onclick="sem_applyAutoComplete('${escInsert}')"
                     onmouseenter="sem_activeAcIndex = ${idx}; sem_renderAutoCompleteList();">
            <span>${m.label}</span>
            <span class="sem-ac-shortcut">Tab ⇥</span>
        </div>`;
    }).join('');
}

function sem_applyAutoComplete(insertText) {
    const textarea = document.getElementById('sem_code_input');
    const list = document.getElementById('sem_autocomplete_list');
    if (!textarea) return;

    const pos = (typeof textarea.selectionStart === 'number') ? textarea.selectionStart : textarea.value.length;
    const before = textarea.value.substring(0, pos);
    const after = textarea.value.substring(pos);
    const cleanBefore = before.replace(/[a-zA-Z0-9_]+$/, '');
    textarea.value = cleanBefore + insertText + after;
    const newPos = cleanBefore.length + insertText.length;
    textarea.selectionStart = textarea.selectionEnd = newPos;
    textarea.focus();
    if (list) list.style.display = 'none';
    sem_currentMatches = [];
    sem_handleIdeInput();
    if (typeof playSound === 'function') playSound('step');
}

function sem_handleIdeKeyDown(e, textarea) {
    const list = document.getElementById('sem_autocomplete_list');
    const isListOpen = list && list.style.display === 'block' && sem_currentMatches.length > 0;

    if (isListOpen) {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            sem_activeAcIndex = (sem_activeAcIndex + 1) % sem_currentMatches.length;
            sem_renderAutoCompleteList();
            return;
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            sem_activeAcIndex = (sem_activeAcIndex - 1 + sem_currentMatches.length) % sem_currentMatches.length;
            sem_renderAutoCompleteList();
            return;
        } else if (e.key === 'Tab' || e.key === 'Enter') {
            e.preventDefault();
            const chosen = sem_currentMatches[sem_activeAcIndex];
            if (chosen) {
                sem_applyAutoComplete(chosen.insert);
            }
            return;
        } else if (e.key === 'Escape') {
            list.style.display = 'none';
            sem_currentMatches = [];
            return;
        }
    }

    if (e.key === 'Tab') {
        e.preventDefault();
        const start = (typeof textarea.selectionStart === 'number') ? textarea.selectionStart : textarea.value.length;
        const end = (typeof textarea.selectionEnd === 'number') ? textarea.selectionEnd : start;
        const spaces = '    ';
        textarea.value = textarea.value.substring(0, start) + spaces + textarea.value.substring(end);
        textarea.selectionStart = textarea.selectionEnd = start + spaces.length;
        sem_handleIdeInput();
    }
}

function sem_updateSolutionButtonState() {
    const btn = document.getElementById('sem_btn_solution');
    const solBox = document.getElementById('sem_solution_box');
    const attempts = (window.currentAttemptsMap && window.currentAttemptsMap['semaforo_lvl_' + sem_level]) || sem_errors_count[sem_level] || 0;
    if (!btn) return;

    if (attempts >= 3) {
        btn.style.display = 'flex';
        btn.disabled = false;
        btn.innerHTML = '<i class="fa-solid fa-lightbulb"></i> <span>💡 Precisa de Ajuda? Ver Resolução C/C++</span>';
        btn.style.background = 'linear-gradient(135deg, #D97706, #B45309)';
        btn.style.borderColor = '#F59E0B';
        btn.style.color = '#FFFFFF';
        btn.style.cursor = 'pointer';
        btn.style.opacity = '1';
    } else {
        btn.style.display = 'none';
        btn.disabled = true;
        if (solBox) solBox.style.display = 'none';
    }
}

function sem_toggleSolution() {
    const attempts = (window.currentAttemptsMap && window.currentAttemptsMap['semaforo_lvl_' + sem_level]) || sem_errors_count[sem_level] || 0;
    if (attempts < 3) {
        if (typeof playSound === 'function') playSound('error');
        return;
    }
    const box = document.getElementById('sem_solution_box');
    if (!box) return;
    const isVisible = (box.style.display === 'block');
    box.style.display = isVisible ? 'none' : 'block';
    if (typeof playSound === 'function') playSound(isVisible ? 'click' : 'success');
}

function sem_sleep(ms) {
    return new Promise(r => setTimeout(r, ms));
}

/* ================= PARSER DE COMANDOS ================= */

function sem_parsePinOrFunc(str) {
    if (!str) return null;
    if (/PIN_SEM1_VERDE.*HIGH|semaforo1_verde/i.test(str)) return 'semaforo1_verde';
    if (/PIN_SEM1_AMARELO.*HIGH|semaforo1_amarelo/i.test(str)) return 'semaforo1_amarelo';
    if (/PIN_SEM1_VERMELHO.*HIGH|semaforo1_vermelho/i.test(str)) return 'semaforo1_vermelho';
    if (/PIN_SEM2_VERDE.*HIGH|semaforo2_verde/i.test(str)) return 'semaforo2_verde';
    if (/PIN_SEM2_AMARELO.*HIGH|semaforo2_amarelo/i.test(str)) return 'semaforo2_amarelo';
    if (/PIN_SEM2_VERMELHO.*HIGH|semaforo2_vermelho/i.test(str)) return 'semaforo2_vermelho';
    if (/PIN_PEDESTRE_VERDE.*HIGH|pedestre_verde/i.test(str)) return 'pedestre_verde';
    if (/PIN_PEDESTRE_VERMELHO.*HIGH|pedestre_vermelho/i.test(str)) return 'pedestre_vermelho';
    return null;
}

function sem_extractCommands() {
    const cmds = [];

    if (sem_level === 1) {
        const c1 = sem_parsePinOrFunc(document.getElementById('sem_n1_cmd1')?.value);
        const d1 = parseInt(document.getElementById('sem_n1_delay1')?.value || '2000');
        const c2 = sem_parsePinOrFunc(document.getElementById('sem_n1_cmd2')?.value);
        const d2 = parseInt(document.getElementById('sem_n1_delay2')?.value || '1000');
        const c3 = sem_parsePinOrFunc(document.getElementById('sem_n1_cmd3')?.value);

        if (c1) cmds.push({ type: c1 });
        cmds.push({ type: 'carro1_avancar' });
        cmds.push({ type: 'delay', ms: d1 });
        if (c2) cmds.push({ type: c2 });
        cmds.push({ type: 'delay', ms: d2 });
        if (c3) cmds.push({ type: c3 });
        cmds.push({ type: 'carro1_parar' });
    } else if (sem_level === 2) {
        const c1 = sem_parsePinOrFunc(document.getElementById('sem_n2_cmd1')?.value);
        const d1 = parseInt(document.getElementById('sem_n2_delay1')?.value || '2000');
        const c2 = sem_parsePinOrFunc(document.getElementById('sem_n2_cmd2')?.value);
        const c3 = sem_parsePinOrFunc(document.getElementById('sem_n2_cmd3')?.value);
        const d2 = parseInt(document.getElementById('sem_n2_delay2')?.value || '2000');

        cmds.push({ type: 'semaforo2_vermelho' });
        cmds.push({ type: 'carro2_parar' });
        if (c1) cmds.push({ type: c1 });
        cmds.push({ type: 'carro1_avancar' });
        cmds.push({ type: 'delay', ms: d1 });
        if (c2) cmds.push({ type: c2 });
        cmds.push({ type: 'delay', ms: 1000 });
        cmds.push({ type: 'semaforo1_vermelho' });
        cmds.push({ type: 'carro1_parar' });
        if (c3) cmds.push({ type: c3 });
        cmds.push({ type: 'carro2_avancar' });
        cmds.push({ type: 'delay', ms: d2 });
    } else if (sem_level === 3) {
        const c1 = sem_parsePinOrFunc(document.getElementById('sem_n3_cmd1')?.value);
        const d1 = parseInt(document.getElementById('sem_n3_delay1')?.value || '2500');
        const c2 = sem_parsePinOrFunc(document.getElementById('sem_n3_cmd2')?.value);

        cmds.push({ type: 'semaforo1_vermelho' });
        cmds.push({ type: 'carro1_parar' });
        cmds.push({ type: 'semaforo2_vermelho' });
        cmds.push({ type: 'carro2_parar' });
        cmds.push({ type: 'delay', ms: 800 });
        if (c1) cmds.push({ type: c1 });
        cmds.push({ type: 'pedestre_atravessar' });
        cmds.push({ type: 'delay', ms: d1 });
        if (c2) cmds.push({ type: c2 });
        cmds.push({ type: 'pedestre_parar' });
    } else {
        // Níveis 4 e 5: Mini-IDE C/C++
        const rawText = document.getElementById('sem_code_input')?.value || '';
        if (!rawText.trim()) return [];

        let codeToParse = rawText;

        // Se o aluno colou o sketch completo (com void loop), extrai somente o miolo do loop:
        const loopMatch = rawText.match(/void\s+loop\s*\([^)]*\)\s*\{/i);
        if (loopMatch) {
            const startIdx = loopMatch.index + loopMatch[0].length;
            let depth = 1;
            let endIdx = -1;
            for (let i = startIdx; i < rawText.length; i++) {
                if (rawText[i] === '{') depth++;
                else if (rawText[i] === '}') {
                    depth--;
                    if (depth === 0) {
                        endIdx = i;
                        break;
                    }
                }
            }
            if (endIdx !== -1) {
                codeToParse = rawText.substring(startIdx, endIdx);
            }
        }

        // Remove comentários de linha e de bloco
        const clean = codeToParse.replace(/\/\/[^\n]*/g, '').replace(/\/\*[\s\S]*?\*\//g, '');

        // Divide instruções por ponto e vírgula ou por quebras de linha
        const tokens = clean.split(/[;\n]+/).map(t => t.trim()).filter(t => t.length > 0);

        tokens.forEach(token => {
            // Ignora estruturas padrão, cabeçalhos e chaves isoladas
            if (/^(void\s+\w+|int\s+|const\s+int|pinMode|#include|[{}])$/i.test(token)) return;
            if (/^(void\s+setup|void\s+loop)\s*\(\s*\)/i.test(token)) return;

            if (/carro1_avancar/i.test(token)) cmds.push({ type: 'carro1_avancar' });
            else if (/carro1_parar/i.test(token)) cmds.push({ type: 'carro1_parar' });
            else if (/carro2_avancar/i.test(token)) cmds.push({ type: 'carro2_avancar' });
            else if (/carro2_parar/i.test(token)) cmds.push({ type: 'carro2_parar' });
            else if (/pedestre_atravessar/i.test(token)) cmds.push({ type: 'pedestre_atravessar' });
            else if (/pedestre_parar/i.test(token)) cmds.push({ type: 'pedestre_parar' });
            else if (/digitalWrite\s*\(\s*PIN_SEM1_VERDE\s*,\s*(HIGH|1)\s*\)|semaforo1_verde|semaforoA_verde/i.test(token)) cmds.push({ type: 'semaforo1_verde' });
            else if (/digitalWrite\s*\(\s*PIN_SEM1_AMARELO\s*,\s*(HIGH|1)\s*\)|semaforo1_amarelo|semaforoA_amarelo/i.test(token)) cmds.push({ type: 'semaforo1_amarelo' });
            else if (/digitalWrite\s*\(\s*PIN_SEM1_VERMELHO\s*,\s*(HIGH|1)\s*\)|semaforo1_vermelho|semaforoA_vermelho/i.test(token)) cmds.push({ type: 'semaforo1_vermelho' });
            else if (/digitalWrite\s*\(\s*PIN_SEM2_VERDE\s*,\s*(HIGH|1)\s*\)|semaforo2_verde|semaforoB_verde/i.test(token)) cmds.push({ type: 'semaforo2_verde' });
            else if (/digitalWrite\s*\(\s*PIN_SEM2_AMARELO\s*,\s*(HIGH|1)\s*\)|semaforo2_amarelo|semaforoB_amarelo/i.test(token)) cmds.push({ type: 'semaforo2_amarelo' });
            else if (/digitalWrite\s*\(\s*PIN_SEM2_VERMELHO\s*,\s*(HIGH|1)\s*\)|semaforo2_vermelho|semaforoB_vermelho/i.test(token)) cmds.push({ type: 'semaforo2_vermelho' });
            else if (/digitalWrite\s*\(\s*PIN_PEDESTRE_VERDE\s*,\s*(HIGH|1)\s*\)|pedestre_verde/i.test(token)) cmds.push({ type: 'pedestre_verde' });
            else if (/digitalWrite\s*\(\s*PIN_PEDESTRE_VERMELHO\s*,\s*(HIGH|1)\s*\)|pedestre_vermelho/i.test(token)) cmds.push({ type: 'pedestre_vermelho' });
            else {
                const matchDelay = token.match(/delay\s*\(\s*(\d+)\s*\)/i);
                if (matchDelay) {
                    cmds.push({ type: 'delay', ms: parseInt(matchDelay[1]) });
                } else {
                    // Comando não suportado ou erro de digitação no C++
                    cmds.push({ type: 'syntax_error', raw: token });
                }
            }
        });
    }

    return cmds;
}

/* ================= MOTOR DE SIMULAÇÃO INTELIGENTE (4 FLUXOS & REGRAS DE TRÂNSITO) ================= */

async function sem_runSimulation() {
    if (sem_running) return;
    if (typeof playSound === 'function') playSound('click');

    const cmds = sem_extractCommands();
    if (cmds.length === 0) {
        sem_registerError('Mini-IDE Vazia! 📝', 
            'Nenhum comando Arduino C++ foi encontrado para executar no cruzamento.',
            'Digite comandos como digitalWrite(PIN_SEM1_VERDE, HIGH); ou use os botões rápidos e o autocompletar com Tab!',
            '📝');
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

        // 1. ERRO DE COMPILAÇÃO / COMANDO NÃO RECONHECIDO NO C++
        if (cmd.type === 'syntax_error') {
            if (typeof playSound === 'function') playSound('error');
            sem_registerError('Erro de Compilação C++ ⚠️', 
                `O compilador não reconheceu o comando: "<code>${cmd.raw}</code>". Verifique se há erros de digitação, parênteses ou parâmetros!`, 
                'Exemplo correto: digitalWrite(PIN_SEM1_VERDE, HIGH); ou delay(2000); ou consulte os botões de atalho.', 
                '⚠️');
            crashed = true;
            break;
        }

        if (cmd.type === 'semaforo1_verde') {
            stateA = 'green';
            sem_setTrafficLights({ a: 'green' });
            hasHadYellowA = false;
            if (typeof playSound === 'function') playSound('step');

            // Colisão Imediata: Semáforo 1 e Semáforo 2 ambos no Verde!
            if (stateB === 'green') {
                if (statusHud) { 
                    statusHud.innerHTML = (sem_level === 5) ? '💥 COLISÃO QUÁDRUPLA NO CENTRO!' : '💥 COLISÃO NO CENTRO!'; 
                    statusHud.style.color = '#EF4444'; 
                }
                sem_carRed_state = 'cross';
                sem_carBlue_state = 'cross';
                if (sem_level === 5) {
                    sem_carGreen_state = 'cross';
                    sem_carYellow_state = 'cross';
                }
                sem_renderCarPositions(true);
                if (crashFx) crashFx.classList.add('active');
                if (typeof playSound === 'function') playSound('error');
                await sem_sleep(700);

                const descError = (sem_level === 5)
                    ? 'Os 4 carros colidiram no meio do cruzamento! Os semáforos 1 e 2 ficaram verdes ao mesmo tempo!'
                    : 'O Carro Vermelho 🚗 (Semáforo 1) e o Carro Azul 🚙 (Semáforo 2) colidiram no cruzamento! Ambos os semáforos ficaram verdes juntos!';

                sem_registerError('Batida no Centro! 💥', descError, 'Enquanto o Semáforo 1 for Verde, o Semáforo 2 DEVE estar Vermelho!', '💥');
                crashed = true;
                break;
            }

            // Perigo Imediato na Faixa: Pedestre atravessando e semáforo veicular abrindo
            if (statePed === 'green') {
                if (statusHud) { statusHud.innerHTML = '🚨 QUASE ATROPELOU O PEDESTRE!'; statusHud.style.color = '#EF4444'; }
                const pedEl = document.getElementById('sem_ped_1');
                if (pedEl) pedEl.innerText = '😱';
                if (typeof playSound === 'function') playSound('error');
                await sem_sleep(600);

                sem_registerError('Perigo na Faixa de Pedestres! 🚨', 
                    'O Semáforo 1 abriu no Verde enquanto o pedestre ainda atravessava a faixa zebrada!', 
                    'Enquanto o pedestre atravessa, TODOS os semáforos de carros (1 e 2) devem estar no VERMELHO!', 
                    '🚨');
                crashed = true;
                break;
            }

            await sem_sleep(150);

        } else if (cmd.type === 'semaforo1_amarelo') {
            stateA = 'yellow';
            sem_setTrafficLights({ a: 'yellow' });
            hasHadYellowA = true;
            if (typeof playSound === 'function') playSound('step');

            if (sem_carRed_state === 'start') sem_carRed_state = 'stop';
            if (sem_level === 5 && sem_carGreen_state === 'start') sem_carGreen_state = 'stop';
            sem_renderCarPositions(true);
            await sem_sleep(150);

        } else if (cmd.type === 'semaforo1_vermelho') {
            if (stateA === 'green' && !hasHadYellowA && sem_carRed_state === 'start') {
                sem_registerError('Freagem Brusca no Semáforo 1!', 
                    'O Semáforo 1 mudou direto do Verde para o Vermelho sem passar pelo Amarelo! Os carros da avenida derraparam na pista.', 
                    'Sempre acione o pino Amarelo e delay(1000) antes de fechar no Vermelho!', 
                    '⚠️');
                crashed = true;
                break;
            }

            stateA = 'red';
            sem_setTrafficLights({ a: 'red' });
            if (typeof playSound === 'function') playSound('step');

            if (sem_carRed_state === 'start') sem_carRed_state = 'stop';
            if (sem_level === 5 && sem_carGreen_state === 'start') sem_carGreen_state = 'stop';
            sem_renderCarPositions(true);
            await sem_sleep(150);

        } else if (cmd.type === 'semaforo2_verde') {
            stateB = 'green';
            sem_setTrafficLights({ b: 'green' });
            hasHadYellowB = false;
            if (typeof playSound === 'function') playSound('step');

            // Colisão com Semáforo 1 Verde
            if (stateA === 'green') {
                if (statusHud) { 
                    statusHud.innerHTML = (sem_level === 5) ? '💥 COLISÃO QUÁDRUPLA NO CENTRO!' : '💥 COLISÃO NO CENTRO!'; 
                    statusHud.style.color = '#EF4444'; 
                }
                sem_carRed_state = 'cross';
                sem_carBlue_state = 'cross';
                if (sem_level === 5) {
                    sem_carGreen_state = 'cross';
                    sem_carYellow_state = 'cross';
                }
                sem_renderCarPositions(true);
                if (crashFx) crashFx.classList.add('active');
                if (typeof playSound === 'function') playSound('error');
                await sem_sleep(700);

                sem_registerError('Batida no Centro! 💥', 
                    'O Semáforo 2 abriu no Verde enquanto o Semáforo 1 ainda estava Verde! Os dois fluxos colidiram.', 
                    'Enquanto o Semáforo 2 for Verde, o Semáforo 1 DEVE estar Vermelho!', '💥');
                crashed = true;
                break;
            }

            // Atropelamento de Pedestre
            if (statePed === 'green') {
                if (statusHud) { statusHud.innerHTML = '🚨 QUASE ATROPELOU O PEDESTRE!'; statusHud.style.color = '#EF4444'; }
                const pedEl = document.getElementById('sem_ped_1');
                if (pedEl) pedEl.innerText = '😱';
                if (typeof playSound === 'function') playSound('error');
                await sem_sleep(600);

                sem_registerError('Perigo na Faixa de Pedestres! 🚨', 
                    'O Semáforo 2 abriu no Verde enquanto o pedestre atravessava a faixa!', 
                    'Enquanto o pedestre atravessa, TODOS os semáforos de veículos devem estar no VERMELHO!', 
                    '🚨');
                crashed = true;
                break;
            }

            await sem_sleep(150);

        } else if (cmd.type === 'semaforo2_amarelo') {
            stateB = 'yellow';
            sem_setTrafficLights({ b: 'yellow' });
            hasHadYellowB = true;
            if (typeof playSound === 'function') playSound('step');

            if (sem_carBlue_state === 'start') sem_carBlue_state = 'stop';
            if (sem_level === 5 && sem_carYellow_state === 'start') sem_carYellow_state = 'stop';
            sem_renderCarPositions(true);
            await sem_sleep(150);

        } else if (cmd.type === 'semaforo2_vermelho') {
            if (stateB === 'green' && !hasHadYellowB && sem_carBlue_state === 'start') {
                sem_registerError('Freagem Brusca no Semáforo 2!', 
                    'O Semáforo 2 fechou direto do Verde para o Vermelho sem o Amarelo de aviso!', 
                    'Sempre use o Amarelo e delay() antes de fechar no Vermelho.', 
                    '⚠️');
                crashed = true;
                break;
            }

            stateB = 'red';
            sem_setTrafficLights({ b: 'red' });
            if (typeof playSound === 'function') playSound('step');

            if (sem_carBlue_state === 'start') sem_carBlue_state = 'stop';
            if (sem_level === 5 && sem_carYellow_state === 'start') sem_carYellow_state = 'stop';
            sem_renderCarPositions(true);
            await sem_sleep(150);

        } else if (cmd.type === 'pedestre_verde') {
            statePed = 'green';
            sem_setTrafficLights({ ped: 'green' });
            if (typeof playSound === 'function') playSound('step');

            if (stateA === 'green' || stateB === 'green') {
                if (statusHud) { statusHud.innerHTML = '🚨 QUASE ATROPELOU O PEDESTRE!'; statusHud.style.color = '#EF4444'; }
                const pedEl = document.getElementById('sem_ped_1');
                if (pedEl) pedEl.innerText = '😱';
                if (typeof playSound === 'function') playSound('error');
                await sem_sleep(600);

                sem_registerError('Perigo na Faixa de Pedestres! 🚨', 
                    'O semáforo de pedestre abriu com veículos em trânsito aberto (Verde)!', 
                    'Trave todos os semáforos de veículos no Vermelho antes de abrir o sinal do pedestre!', 
                    '🚨');
                crashed = true;
                break;
            }

            sem_ped_state = 'crossing';
            sem_renderCarPositions(true);
            await sem_sleep(200);

        } else if (cmd.type === 'pedestre_vermelho') {
            statePed = 'red';
            sem_setTrafficLights({ ped: 'red' });
            if (typeof playSound === 'function') playSound('step');

            if (sem_ped_state === 'crossing') sem_ped_state = 'sidewalk_north';
            sem_renderCarPositions(true);
            await sem_sleep(150);

        } else if (cmd.type === 'carro1_avancar') {
            if (stateA === 'red') {
                sem_carRed_state = 'cross';
                if (sem_level === 5) sem_carGreen_state = 'cross';
                sem_renderCarPositions(true);
                if (typeof playSound === 'function') playSound('error');
                sem_registerError('Infração no Semáforo 1! 🚨', 
                    'O fluxo da avenida avançou com o Semáforo 1 no VERMELHO! Os motoristas furaram o sinal vermelho.', 
                    'Ligue o pino Verde (digitalWrite(PIN_SEM1_VERDE, HIGH)) antes de avançar!', 
                    '🛑');
                crashed = true;
                break;
            } else {
                sem_carRed_state = 'cross';
                if (sem_level === 5) sem_carGreen_state = 'cross';
                sem_renderCarPositions(true);
                await sem_sleep(200);
            }

        } else if (cmd.type === 'carro1_parar') {
            if (sem_carRed_state === 'start') sem_carRed_state = 'stop';
            if (sem_level === 5 && sem_carGreen_state === 'start') sem_carGreen_state = 'stop';
            sem_renderCarPositions(true);
            await sem_sleep(150);

        } else if (cmd.type === 'carro2_avancar') {
            if (stateB === 'red') {
                sem_carBlue_state = 'cross';
                if (sem_level === 5) sem_carYellow_state = 'cross';
                sem_renderCarPositions(true);
                if (typeof playSound === 'function') playSound('error');
                sem_registerError('Infração no Semáforo 2! 🚨', 
                    'O fluxo transversal avançou com o Semáforo 2 no VERMELHO!', 
                    'Ligue o pino Verde (digitalWrite(PIN_SEM2_VERDE, HIGH)) antes de ordenar o avanço!', 
                    '🛑');
                crashed = true;
                break;
            } else {
                sem_carBlue_state = 'cross';
                if (sem_level === 5) sem_carYellow_state = 'cross';
                sem_renderCarPositions(true);
                await sem_sleep(200);
            }

        } else if (cmd.type === 'carro2_parar') {
            if (sem_carBlue_state === 'start') sem_carBlue_state = 'stop';
            if (sem_level === 5 && sem_carYellow_state === 'start') sem_carYellow_state = 'stop';
            sem_renderCarPositions(true);
            await sem_sleep(150);

        } else if (cmd.type === 'pedestre_atravessar') {
            if (statePed === 'red') {
                sem_ped_state = 'crossing';
                sem_renderCarPositions(true);
                if (typeof playSound === 'function') playSound('error');
                sem_registerError('Infração na Faixa de Pedestre! 🚸', 
                    'O pedestre atravessou com o sinal de pedestre no VERMELHO (PARE)!', 
                    'Ligue o pino verde com digitalWrite(PIN_PEDESTRE_VERDE, HIGH) antes de atravessar!', 
                    '🚸');
                crashed = true;
                break;
            } else {
                sem_ped_state = 'crossing';
                sem_renderCarPositions(true);
                await sem_sleep(200);
            }

        } else if (cmd.type === 'pedestre_parar') {
            if (sem_ped_state === 'crossing') sem_ped_state = 'sidewalk_north';
            sem_renderCarPositions(true);
            await sem_sleep(150);

        } else if (cmd.type === 'delay') {
            const waitTime = Math.min(2500, Math.max(700, Math.round(cmd.ms * 0.85)));

            // Movimento dos veículos durante o período de delay no verde
            if (stateA === 'green' && stateB === 'red' && statePed === 'red') {
                if (sem_carRed_state !== 'exit') sem_carRed_state = 'exit';
                if (sem_level === 5 && sem_carGreen_state !== 'exit') sem_carGreen_state = 'exit';
                sem_renderCarPositions(true);
            } else if (stateB === 'green' && stateA === 'red' && statePed === 'red') {
                if (sem_carBlue_state !== 'exit') sem_carBlue_state = 'exit';
                if (sem_level === 5 && sem_carYellow_state !== 'exit') sem_carYellow_state = 'exit';
                sem_renderCarPositions(true);
            } else if (statePed === 'green' && stateA === 'red' && stateB === 'red') {
                sem_ped_state = 'sidewalk_north';
                sem_renderCarPositions(true);
            }

            await sem_sleep(waitTime);
        }
    }

    if (!crashed) {
        const errorDetail = sem_checkLevelCompletion(cmds);

        if (!errorDetail) {
            if (typeof playSound === 'function') playSound('success');
            if (typeof triggerConfetti === 'function') triggerConfetti(3500);

            let saved = JSON.parse(localStorage.getItem('semaforo_levels') || '[]');
            if (!saved.includes(sem_level)) saved.push(sem_level);
            localStorage.setItem('semaforo_levels', JSON.stringify(saved));

            if (typeof updateHubProgress === 'function') updateHubProgress();
            if (typeof updateTrail === 'function') updateTrail();
            sem_updateLevelButtons();

            sem_showWinModal();
        } else {
            sem_registerError('Sequência Incompleta! 🚦', errorDetail, 'Consulte a descrição dos requisitos da missão acima.', '🔄');
        }
    }

    sem_running = false;
    if (runBtn) runBtn.disabled = false;
}

function sem_checkLevelCompletion(cmds) {
    if (sem_level === 1) {
        if (!cmds.some(c => c.type === 'semaforo1_verde')) return 'Abra o Semáforo 1 no Verde por 2 segundos!';
        if (!cmds.some(c => c.type === 'semaforo1_amarelo')) return 'Acione a luz Amarela de aviso antes de fechar!';
        if (!cmds.some(c => c.type === 'semaforo1_vermelho')) return 'Feche o Semáforo 1 no Vermelho para a parada completa antes da faixa!';
        return null;
    } else if (sem_level === 2) {
        if (!cmds.some(c => c.type === 'semaforo1_verde')) return 'Abra o Semáforo 1 no Verde para liberar o fluxo da avenida!';
        if (!cmds.some(c => c.type === 'semaforo2_verde')) return 'Abra o Semáforo 2 no Verde para liberar a rua transversal!';
        if (!cmds.some(c => c.type === 'semaforo2_vermelho')) return 'Certifique-se de travar a rua transversal enquanto a avenida passa!';
        return null;
    } else if (sem_level === 3) {
        if (!cmds.some(c => c.type === 'pedestre_verde')) return 'Abra o Semáforo de Pedestres no Verde para a travessia na faixa zebrada!';
        if (!cmds.some(c => c.type === 'pedestre_vermelho')) return 'Feche o sinal de pedestres após a travessia!';
        return null;
    } else if (sem_level === 4) {
        const hasS1 = cmds.some(c => c.type === 'semaforo1_verde');
        const hasS2 = cmds.some(c => c.type === 'semaforo2_verde');
        const hasPed = cmds.some(c => c.type === 'pedestre_verde');
        if (!hasS1) return 'Faltou abrir o Semáforo 1 no Verde para a Avenida!';
        if (!hasS2) return 'Faltou abrir o Semáforo 2 no Verde para a Rua Transversal!';
        if (!hasPed) return 'Faltou liberar a travessia no Semáforo de Pedestres 🚸!';
        return null;
    } else if (sem_level === 5) {
        const hasS1 = cmds.some(c => c.type === 'semaforo1_verde');
        const hasS2 = cmds.some(c => c.type === 'semaforo2_verde');
        const hasPed = cmds.some(c => c.type === 'pedestre_verde');
        if (!hasS1 || !hasS2 || !hasPed) return 'Na Grande Metrópole Maker, você deve sincronizar todos os 4 fluxos e a faixa de pedestres!';
        return null;
    }
    return null;
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

    sem_updateSolutionButtonState();
}

function sem_showWinModal() {
    const modal = document.getElementById('sem_win_modal');
    if (!modal) return;

    if (window.currentAttemptsMap) {
        window.currentAttemptsMap[`semaforo_lvl_${sem_level}`] = 0;
    }
    sem_errors_count[sem_level] = 0;
    sem_updateSolutionButtonState();

    const titleEl = document.getElementById('sem_modal_title');
    const textEl = document.getElementById('sem_modal_text');

    if (titleEl) titleEl.innerText = `Nível ${sem_level} Concluído! 🏆`;
    if (textEl) {
        if (sem_level === 1) textEl.innerText = 'Você programou a parada perfeita do Carro Vermelho 🚗 na linha branca do Semáforo 1!';
        else if (sem_level === 2) textEl.innerText = 'Excelente! O Semáforo 1 (Avenida) e o Semáforo 2 (Rua Transversal) alternaram com segurança total sem nenhuma colisão!';
        else if (sem_level === 3) textEl.innerText = 'Perfeito! O Pedestre 🚶 atravessou a faixa zebrada em segurança total enquanto todos os carros aguardaram!';
        else if (sem_level === 4) textEl.innerText = 'Você domina completamente a lógica de Semáforos e Temporização em Arduino C++! Excelente trabalho na Mini-IDE!';
        else textEl.innerText = 'Extraordinário! Você coordenou os 4 fluxos simultâneos em mão dupla da Grande Metrópole Maker! Carros paralelos avançaram juntos e o trânsito fluiu em sincronia perfeita! 🚀🌆';
    }

    modal.classList.add('active');
}

function sem_closeWinModal() {
    const modal = document.getElementById('sem_win_modal');
    if (modal) modal.classList.remove('active');

    if (sem_level < 5) {
        sem_switchLevel(sem_level + 1);
    }
}

// Exportação global para garantir funcionamento em eventos HTML e SPA
window.sem_insertText = sem_insertText;
window.sem_clearIde = sem_clearIde;
window.sem_ideAutoComplete = sem_ideAutoComplete;
window.sem_applyAutoComplete = sem_applyAutoComplete;
window.sem_handleIdeKeyDown = sem_handleIdeKeyDown;
window.sem_updateSolutionButtonState = sem_updateSolutionButtonState;
window.sem_toggleSolution = sem_toggleSolution;
window.sem_switchLevel = sem_switchLevel;
window.sem_runSimulation = sem_runSimulation;
window.sem_resetScene = sem_resetScene;
window.sem_toggleGuide = sem_toggleGuide;
window.sem_switchGuideTab = sem_switchGuideTab;
window.sem_nextGuideSlide = sem_nextGuideSlide;
window.sem_prevGuideSlide = sem_prevGuideSlide;
window.sem_closeWinModal = sem_closeWinModal;
window.sem_updateLiveCpp = sem_updateLiveCpp;
window.sem_copyCode = sem_copyCode;



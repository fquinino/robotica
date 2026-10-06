/* ==========================================================================
   AULA 5 — VARIÁVEIS E TIPOS DE DADOS EM C/C++ (ARDUINO)
   Módulo Interativo: As Caixas de Memória RAM & Mini-IDE C/C++
   ========================================================================== */

function loadVariaveis() {
    const container = document.getElementById('variaveis-container');
    if (!container) return;

    container.innerHTML = `
        <style>
            .vars-wrapper { color:#E2E8F0; max-width:1050px; margin:0 auto; }

            /* CABEÇALHO DA AULA */
            .vars-header-card { background:linear-gradient(135deg, rgba(56,189,248,0.18), rgba(30,41,59,0.92)); border:2px solid #38BDF8; border-radius:24px; padding:18px 22px; margin-bottom:16px; box-shadow:0 10px 30px rgba(0,0,0,0.4); display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px; }
            .vars-header-info h2 { font-family:'Fredoka One', cursive; color:#38BDF8; font-size:clamp(1.2rem, 3vw, 1.6rem); margin:0 0 4px; display:flex; align-items:center; gap:10px; }
            .vars-header-info p { color:#CBD5E1; margin:0; font-size:0.92rem; line-height:1.45; }
            .vars-guide-toggle-btn { background:#1E293B; border:2px solid #38BDF8; color:#38BDF8; padding:8px 16px; border-radius:14px; font-weight:800; font-size:0.88rem; cursor:pointer; display:flex; align-items:center; gap:8px; transition:0.2s all; }
            .vars-guide-toggle-btn:hover { background:#38BDF8; color:#0F172A; transform:translateY(-2px); box-shadow:0 4px 15px rgba(56,189,248,0.4); }

            /* GUIA INTERATIVO COM SLIDES DA TEORIA */
            .vars-guide-card { background:#0F172A; border:2px solid #38BDF8; border-radius:22px; padding:18px 20px; margin-bottom:18px; box-shadow:0 12px 35px rgba(0,0,0,0.45); transition:all 0.3s ease; }
            .vars-guide-tabs { display:flex; gap:8px; overflow-x:auto; padding-bottom:8px; border-bottom:1px solid #1E293B; margin-bottom:14px; scrollbar-width:thin; }
            .vars-guide-tab { background:#1E293B; border:1px solid #334155; color:#94A3B8; padding:8px 14px; border-radius:12px; font-weight:800; font-size:0.85rem; cursor:pointer; transition:0.2s all; white-space:nowrap; display:flex; align-items:center; gap:6px; }
            .vars-guide-tab:hover { color:#E2E8F0; border-color:#38BDF8; }
            .vars-guide-tab.active { background:linear-gradient(135deg, rgba(56,189,248,0.25), rgba(14,165,233,0.25)); color:#38BDF8; border-color:#38BDF8; box-shadow:0 0 12px rgba(56,189,248,0.3); }

            .vars-slide-content { display:none; animation:varsFadeIn 0.3s ease; }
            .vars-slide-content.active { display:block; }

            .vars-guide-footer { display:flex; justify-content:space-between; align-items:center; margin-top:16px; padding-top:12px; border-top:1px solid #1E293B; flex-wrap:wrap; gap:10px; }
            .vars-guide-nav-btn { background:#1E293B; border:1px solid #475569; color:#E2E8F0; padding:8px 16px; border-radius:12px; font-weight:800; font-size:0.85rem; cursor:pointer; transition:0.2s; display:flex; align-items:center; gap:6px; }
            .vars-guide-nav-btn:hover { border-color:#38BDF8; color:#38BDF8; background:#0F172A; }
            .vars-guide-nav-btn.primary { background:linear-gradient(135deg, #38BDF8, #0284C7); color:#0F172A; border:none; font-weight:900; box-shadow:0 4px 15px rgba(56,189,248,0.35); }
            .vars-guide-nav-btn.primary:hover { background:linear-gradient(135deg, #7DD3FC, #38BDF8); }
            .vars-guide-progress-dots { display:flex; gap:6px; align-items:center; }
            .vars-dot { width:8px; height:8px; border-radius:50%; background:#334155; transition:0.2s all; }
            .vars-dot.active { width:22px; border-radius:10px; background:#38BDF8; }

            /* NAVEGAÇÃO DOS NÍVEIS (BARRA SEGMENTADA) */
            .vars-level-bar { display:grid; grid-template-columns:repeat(auto-fit, minmax(180px, 1fr)); gap:10px; margin-bottom:18px; width:100%; }
            .vars-level-btn { background:#1E293B; border:2px solid #334155; color:#94A3B8; padding:12px 14px; border-radius:18px; font-weight:800; cursor:pointer; font-size:0.88rem; transition:0.2s all; display:flex; align-items:center; justify-content:space-between; text-align:left; }
            .vars-level-btn:hover { border-color:#38BDF8; color:white; transform:translateY(-2px); box-shadow:0 6px 15px rgba(0,0,0,0.3); }
            .vars-level-btn.active { background:linear-gradient(135deg, #1E293B, #0F172A); color:white; border-color:#38BDF8; box-shadow:0 0 20px rgba(56,189,248,0.35); }
            .vars-level-btn.active .vars-lvl-num { background:#38BDF8; color:#0F172A; font-weight:900; }
            .vars-level-btn.done { border-color:#10B981; color:#34D399; }
            .vars-level-btn.done .vars-lvl-status { color:#10B981; }
            .vars-lvl-left { display:flex; align-items:center; gap:10px; }
            .vars-lvl-num { width:28px; height:28px; border-radius:8px; background:#334155; color:#E2E8F0; display:flex; align-items:center; justify-content:center; font-weight:900; font-size:0.82rem; }
            .vars-lvl-info { display:flex; flex-direction:column; }
            .vars-lvl-title { font-weight:900; font-size:0.88rem; color:#F1F5F9; }
            .vars-lvl-sub { font-size:0.75rem; color:#94A3B8; }
            .vars-lvl-status { font-size:0.95rem; color:#475569; }

            /* CARD DE HISTÓRIA / MISSÃO ATIVA */
            .vars-story-card { background:#0F172A; border:2px solid #38BDF8; border-radius:18px; padding:14px 18px; margin-bottom:16px; box-shadow:0 6px 20px rgba(0,0,0,0.3); }
            .vars-story-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:6px; flex-wrap:wrap; gap:8px; }
            .vars-story-title { font-family:'Fredoka One'; color:#38BDF8; font-size:1.05rem; display:flex; align-items:center; gap:8px; }
            .vars-story-badge { font-family:'Fira Code', monospace; font-size:0.8rem; background:rgba(56,189,248,0.15); color:#7DD3FC; padding:3px 10px; border-radius:8px; border:1px dashed #38BDF8; }
            .vars-story-text { color:#CBD5E1; font-size:0.9rem; line-height:1.55; margin:0; }

            /* CENÁRIO GRÁFICO E BANCADA DE MEMÓRIA RAM DO ARDUINO */
            .vars-stage-card { background:#090D16; border:2px solid #334155; border-radius:24px; padding:16px; margin-bottom:18px; box-shadow:0 12px 35px rgba(0,0,0,0.6); position:relative; overflow:hidden; }
            .vars-stage-hud { display:flex; justify-content:space-between; align-items:center; background:#0F172A; border:1px solid #1E293B; border-radius:14px; padding:10px 16px; margin-bottom:14px; flex-wrap:wrap; gap:10px; }
            .vars-hud-item { display:flex; align-items:center; gap:8px; font-size:0.85rem; font-weight:800; }
            .vars-type-pill { padding:3px 10px; border-radius:20px; font-weight:900; font-size:0.8rem; display:inline-flex; align-items:center; gap:5px; font-family:'Fira Code', monospace; }
            .vars-type-pill.int { background:rgba(251,191,36,0.2); color:#FBBF24; border:1px solid #F59E0B; }
            .vars-type-pill.float { background:rgba(56,189,248,0.2); color:#38BDF8; border:1px solid #0284C7; }
            .vars-type-pill.string { background:rgba(236,72,153,0.2); color:#F472B6; border:1px solid #DB2777; }
            .vars-type-pill.bool { background:rgba(16,185,129,0.2); color:#34D399; border:1px solid #10B981; }

            /* BANCADA VISUAL DAS CAIXINHAS DE MEMÓRIA (CHIP SRAM 2KB) */
            .vars-ram-chip { background:linear-gradient(180deg,#1E293B,#0F172A); border:2px solid #475569; border-radius:18px; padding:14px; margin-bottom:14px; position:relative; box-shadow:inset 0 0 25px rgba(0,0,0,0.8); }
            .vars-ram-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; font-size:0.82rem; font-weight:900; color:#94A3B8; text-transform:uppercase; letter-spacing:1px; border-bottom:1px solid #334155; padding-bottom:6px; }
            .vars-ram-boxes { display:grid; grid-template-columns:repeat(auto-fit, minmax(140px, 1fr)); gap:12px; }
            
            .vars-box { background:#090D16; border:2px solid #334155; border-radius:14px; padding:10px; display:flex; flex-direction:column; align-items:center; text-align:center; position:relative; transition:all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); box-shadow:0 6px 15px rgba(0,0,0,0.5); }
            .vars-box.updated { transform:scale(1.06); border-color:#38BDF8; box-shadow:0 0 20px rgba(56,189,248,0.6); }
            .vars-box-addr { font-family:'Fira Code', monospace; font-size:0.68rem; color:#64748B; margin-bottom:4px; }
            .vars-box-type { font-family:'Fira Code', monospace; font-size:0.75rem; font-weight:900; padding:2px 8px; border-radius:6px; margin-bottom:4px; }
            .vars-box-name { font-family:'Nunito', sans-serif; font-size:0.85rem; font-weight:900; color:#E2E8F0; margin-bottom:6px; }
            .vars-box-val-wrap { width:100%; background:#1E293B; border-radius:8px; padding:6px 4px; border:1px solid #334155; min-height:36px; display:flex; align-items:center; justify-content:center; }
            .vars-box-val { font-family:'Fira Code', monospace; font-size:1.05rem; font-weight:900; color:#FBBF24; word-break:break-all; }

            /* CENÁRIOS INTERATIVOS ESPECÍFICOS (ROBÔ, ESTAÇÃO, COFRE, ROVER) */
            .vars-arena { position:relative; width:100%; min-height:220px; background:#0B1120; border-radius:18px; border:2px solid #334155; overflow:hidden; box-shadow:inset 0 0 35px rgba(0,0,0,0.85); display:flex; align-items:center; justify-content:center; padding:16px; box-sizing:border-box; }

            /* DISPLAY LCD 16X2 SIMULADO ARDUINO */
            .vars-lcd { background:#064E3B; border:3px solid #022C22; border-radius:10px; padding:10px 14px; font-family:'Fira Code', monospace; color:#34D399; box-shadow:0 0 20px rgba(16,185,129,0.3), inset 0 0 15px rgba(0,0,0,0.6); width:100%; max-width:380px; letter-spacing:1px; line-height:1.5; font-size:0.95rem; }
            .vars-lcd-line { min-height:22px; white-space:pre; overflow:hidden; }

            /* CENÁRIO 1: ROBÔ NO LABIRINTO DE MOEDAS */
            .vars-robot-track { display:flex; align-items:center; justify-content:space-between; width:100%; max-width:550px; background:#1E293B; border-radius:20px; padding:14px 20px; border:2px dashed #475569; position:relative; }
            .vars-node-spot { width:48px; height:48px; border-radius:14px; background:#0F172A; border:2px solid #334155; display:flex; align-items:center; justify-content:center; font-size:1.5rem; position:relative; }
            .vars-node-spot.active { border-color:#FBBF24; box-shadow:0 0 15px rgba(245,158,11,0.5); }
            .vars-robot-actor { width:52px; height:52px; position:absolute; top:12px; left:20px; transition:left 0.7s cubic-bezier(0.34, 1.56, 0.64, 1); z-index:20; filter:drop-shadow(0 8px 10px rgba(0,0,0,0.6)); display:flex; align-items:center; justify-content:center; font-size:2rem; }

            /* CENÁRIO 2: ESTAÇÃO METEOROLÓGICA (TERMÔMETRO + MEDIDORES) */
            .vars-weather-bench { display:flex; align-items:center; justify-content:space-around; width:100%; max-width:560px; gap:16px; flex-wrap:wrap; }
            .vars-thermo-wrap { display:flex; align-items:center; gap:10px; background:#1E293B; padding:12px 18px; border-radius:16px; border:1px solid #334155; }
            .vars-thermo-glass { width:22px; height:120px; background:#0F172A; border:2px solid #64748B; border-radius:12px; position:relative; overflow:hidden; display:flex; flex-direction:column-reverse; }
            .vars-thermo-mercury { width:100%; height:45%; background:linear-gradient(180deg,#EF4444,#F59E0B); transition:height 0.8s ease, background 0.8s ease; border-radius:0 0 10px 10px; box-shadow:0 0 10px rgba(239,68,68,0.7); }

            /* CENÁRIO 3: COFRE DIGITAL MAKER */
            .vars-vault-box { width:100%; max-width:440px; background:radial-gradient(circle at 50% 30%, #334155 0%, #0F172A 90%); border:4px solid #64748B; border-radius:24px; padding:18px; display:flex; flex-direction:column; align-items:center; box-shadow:0 12px 30px rgba(0,0,0,0.8); position:relative; }
            .vars-vault-wheel { width:90px; height:90px; border-radius:50%; border:6px solid #94A3B8; background:linear-gradient(135deg,#1E293B,#0F172A); display:flex; align-items:center; justify-content:center; font-size:2.4rem; margin:10px 0; transition:transform 0.8s ease, border-color 0.4s ease; box-shadow:0 6px 15px rgba(0,0,0,0.7); }
            .vars-vault-wheel.unlocked { transform:rotate(180deg); border-color:#10B981; }
            .vars-vault-leds { display:flex; gap:18px; margin-bottom:8px; }
            .vars-vault-led { width:18px; height:18px; border-radius:50%; border:2px solid #000; opacity:0.3; transition:all 0.3s ease; }
            .vars-vault-led.red.on { opacity:1; background:#EF4444; box-shadow:0 0 16px #EF4444; }
            .vars-vault-led.green.on { opacity:1; background:#10B981; box-shadow:0 0 16px #10B981; }

            /* ANIMAÇÕES VISUAIS DE INTERAÇÃO DO ROBÔ */
            .vars-pop-toast { position:absolute; z-index:90; font-family:'Fredoka One', cursive; font-size:1.15rem; padding:5px 14px; border-radius:14px; pointer-events:none; animation:floatPop 1.3s cubic-bezier(0.18, 0.89, 0.32, 1.28) forwards; box-shadow:0 6px 20px rgba(0,0,0,0.6); display:flex; align-items:center; gap:6px; border:2px solid currentColor; }
            @keyframes floatPop {
                0% { opacity:0; transform:translateY(15px) scale(0.6); }
                25% { opacity:1; transform:translateY(-8px) scale(1.15); }
                75% { opacity:1; transform:translateY(-22px) scale(1.0); }
                100% { opacity:0; transform:translateY(-38px) scale(0.8); }
            }
            .vars-robot-walking { animation:robotWalk 0.35s infinite alternate; }
            @keyframes robotWalk { 0% { transform:rotate(-7deg) translateY(-3px); } 100% { transform:rotate(7deg) translateY(3px); } }
            .vars-robot-hurt { animation:robotHurt 0.5s ease; filter:drop-shadow(0 0 16px #EF4444) hue-rotate(300deg) !important; }
            @keyframes robotHurt { 0%,100% { transform:scale(1) rotate(0); } 25% { transform:scale(1.3) rotate(-14deg); } 50% { transform:scale(1.2) rotate(14deg); } 75% { transform:scale(1.25) rotate(-8deg); } }
            .vars-robot-cheer { animation:robotCheer 0.6s infinite alternate; filter:drop-shadow(0 0 18px #FBBF24) !important; }
            @keyframes robotCheer { 0% { transform:scale(1) translateY(0); } 100% { transform:scale(1.35) translateY(-16px); } }
            .vars-chest-glow { animation:chestGlow 0.7s infinite alternate; filter:drop-shadow(0 0 20px #F59E0B) !important; }
            @keyframes chestGlow { 0% { transform:scale(1); } 100% { transform:scale(1.25); } }
            .vars-laser-beam { position:absolute; width:4px; background:linear-gradient(180deg,#38BDF8,#67E8F9); box-shadow:0 0 15px #38BDF8; border-radius:2px; animation:laserPulse 0.3s infinite alternate; z-index:30; }
            @keyframes laserPulse { 0% { opacity:0.6; width:3px; } 100% { opacity:1; width:6px; } }
            .vars-wind-line { position:absolute; height:3px; background:linear-gradient(90deg,transparent,#67E8F9,transparent); border-radius:3px; animation:windBlow 0.8s linear infinite; pointer-events:none; }
            @keyframes windBlow { 0% { transform:translateX(-30px); opacity:0; } 50% { opacity:0.8; } 100% { transform:translateX(80px); opacity:0; } }
            .vars-sonar-wave { position:absolute; border:2px solid #38BDF8; border-radius:50%; animation:sonarExpand 1.2s infinite ease-out; opacity:0; pointer-events:none; }
            @keyframes sonarExpand { 0% { width:10px; height:10px; opacity:0.9; transform:scale(0.3); } 100% { width:80px; height:80px; opacity:0; transform:scale(2.2); } }
            .vars-shield-dome { position:absolute; border-radius:50%; border:3px solid #38BDF8; background:radial-gradient(circle, rgba(56,189,248,0.25) 0%, transparent 70%); box-shadow:0 0 25px rgba(56,189,248,0.7); animation:shieldPulse 1.5s infinite alternate; pointer-events:none; }
            @keyframes shieldPulse { 0% { transform:scale(0.95); opacity:0.7; } 100% { transform:scale(1.06); opacity:1; } }

            /* ANIMAÇÕES VISUAIS DE PARTÍCULAS E ELEMENTOS DOS CENÁRIOS */
            .vars-coin-particle {
                position: absolute;
                font-size: 1.4rem;
                pointer-events: none;
                z-index: 60;
                animation: coinFlyArc 0.85s cubic-bezier(0.18, 0.89, 0.32, 1.28) forwards;
            }
            @keyframes coinFlyArc {
                0% { transform: translate(0, 0) scale(0.6) rotate(0deg); opacity: 1; }
                40% { transform: translate(var(--dx, -25px), var(--dy, -45px)) scale(1.3) rotate(180deg); opacity: 1; filter: drop-shadow(0 0 10px #FBBF24); }
                100% { transform: translate(var(--tx, -55px), var(--ty, -15px)) scale(0.9) rotate(360deg); opacity: 0; }
            }
            .vars-heart-loss {
                position: absolute;
                font-size: 1.6rem;
                pointer-events: none;
                z-index: 60;
                animation: heartLossFloat 0.9s ease-out forwards;
            }
            @keyframes heartLossFloat {
                0% { transform: translate(0, 0) scale(0.8); opacity: 1; filter: drop-shadow(0 0 12px #EF4444); }
                40% { transform: translate(0, -25px) scale(1.4); opacity: 1; }
                100% { transform: translate(0, -55px) scale(1.1); opacity: 0; }
            }
            .vars-smoke-puff {
                position: absolute;
                font-size: 1.5rem;
                pointer-events: none;
                z-index: 55;
                animation: smokeFloat 0.9s ease-out forwards;
            }
            @keyframes smokeFloat {
                0% { transform: scale(0.4) translateY(0); opacity: 0.9; }
                100% { transform: scale(1.8) translateY(-40px); opacity: 0; }
            }
            .vars-sparkle-burst {
                position: absolute;
                font-size: 1.3rem;
                pointer-events: none;
                z-index: 55;
                animation: sparkPop 0.75s ease-out forwards;
            }
            @keyframes sparkPop {
                0% { transform: scale(0.3); opacity: 1; }
                50% { transform: scale(1.4) translateY(-15px); opacity: 1; filter: drop-shadow(0 0 10px #FDE047); }
                100% { transform: scale(2) translateY(-30px); opacity: 0; }
            }
            .vars-crystal-particle {
                position: absolute;
                font-size: 1.4rem;
                pointer-events: none;
                z-index: 60;
                animation: crystalFly 0.85s cubic-bezier(0.2, 0.8, 0.3, 1) forwards;
            }
            @keyframes crystalFly {
                0% { transform: translate(0, 0) scale(0.6); opacity: 1; }
                50% { transform: translate(-30px, -40px) scale(1.35); opacity: 1; filter: drop-shadow(0 0 12px #38BDF8); }
                100% { transform: translate(-65px, -15px) scale(0.9); opacity: 0; }
            }
            .vars-solar-beam {
                position: absolute;
                width: 6px;
                background: linear-gradient(180deg, #FBBF24, #F59E0B, #10B981);
                border-radius: 4px;
                box-shadow: 0 0 20px #FBBF24;
                animation: solarBeamPulse 0.4s infinite alternate;
                z-index: 35;
                pointer-events: none;
            }
            @keyframes solarBeamPulse {
                0% { opacity: 0.7; transform: scaleX(0.8); }
                100% { opacity: 1; transform: scaleX(1.4); }
            }
            .vars-conveyor-belt {
                background: repeating-linear-gradient(90deg, #1E293B, #1E293B 20px, #334155 20px, #334155 40px);
                background-size: 40px 100%;
            }
            .vars-conveyor-moving {
                animation: beltSlide 0.4s linear infinite;
            }
            @keyframes beltSlide {
                0% { background-position: 0 0; }
                100% { background-position: 40px 0; }
            }
            .vars-fan-spin {
                animation: fanRotate 0.22s linear infinite;
            }
            @keyframes fanRotate {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            .vars-portal-vortex {
                animation: portalSpin 2.5s linear infinite;
            }
            @keyframes portalSpin {
                0% { transform: rotate(0deg) scale(1); }
                50% { transform: rotate(180deg) scale(1.15); filter: drop-shadow(0 0 20px #38BDF8); }
                100% { transform: rotate(360deg) scale(1); }
            }
            .vars-sonar-pulse-ring {
                position: absolute;
                border: 2px solid #38BDF8;
                border-radius: 50%;
                animation: sonarRingExpand 1.1s cubic-bezier(0.2, 0.8, 0.4, 1) infinite;
                pointer-events: none;
            }
            @keyframes sonarRingExpand {
                0% { width: 12px; height: 12px; opacity: 1; transform: scale(0.5); }
                100% { width: 110px; height: 110px; opacity: 0; transform: scale(2.2); }
            }
            .vars-skid-trail {
                position: absolute;
                bottom: 18px;
                height: 4px;
                background: #000;
                border-radius: 2px;
                opacity: 0.75;
                box-shadow: 0 0 6px rgba(0,0,0,0.8);
            }
            .vars-robot-dizzy {
                animation: robotDizzy 0.6s infinite alternate;
                filter: grayscale(0.8) drop-shadow(0 0 10px #64748B) !important;
            }
            @keyframes robotDizzy {
                0% { transform: rotate(-25deg) translateY(8px); }
                100% { transform: rotate(25deg) translateY(8px); }
            }
            .vars-arena-shake {
                animation: arenaShake 0.4s ease;
            }
            @keyframes arenaShake {
                0%, 100% { transform: translate(0, 0); }
                20% { transform: translate(-6px, 4px); }
                40% { transform: translate(6px, -4px); }
                60% { transform: translate(-4px, -2px); }
                80% { transform: translate(4px, 2px); }
            }

            /* LAYOUT DA MINI-IDE E SCAFFOLDING */
            .vars-ide-layout { display:grid; grid-template-columns:repeat(auto-fit, minmax(290px, 1fr)); gap:18px; margin-bottom:15px; width:100%; max-width:100%; }
            @media (max-width: 820px) { .vars-ide-layout { grid-template-columns:1fr; } }

            .vars-editor-card { background:#090D16; border:2px solid #38BDF8; border-radius:20px; padding:16px; display:flex; flex-direction:column; box-shadow:0 10px 25px rgba(0,0,0,0.5); width:100%; max-width:100%; min-width:0; box-sizing:border-box; }
            .vars-editor-topbar { display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #1E293B; padding-bottom:10px; margin-bottom:12px; }
            .vars-editor-title { font-family:'Fredoka One'; color:#38BDF8; font-size:1.05rem; display:flex; align-items:center; gap:8px; }
            .vars-lang-tag { background:rgba(56,189,248,0.25); color:#7DD3FC; padding:3px 10px; border-radius:12px; font-size:0.75rem; font-weight:800; border:1px solid #38BDF8; font-family:'Fira Code', monospace; }

            /* SCAFFOLDING LINES */
            .vars-scaffold-lines { background:#030712; border-radius:14px; padding:16px; border:1px solid #1F2937; font-family:'Fira Code', monospace; font-size:0.92rem; line-height:2; color:#E2E8F0; }
            .vars-sketch-setup { color:#94A3B8; font-size:0.85rem; border-bottom:1px dashed #1E293B; padding-bottom:10px; margin-bottom:10px; }
            .vars-sketch-loop-tag { color:#F8FAFC; font-weight:700; margin-bottom:8px; font-size:0.92rem; }
            .vars-sketch-loop-body { border-left:2px solid rgba(56,189,248,0.45); margin-left:12px; padding-left:14px; display:flex; flex-direction:column; gap:6px; }
            .vars-sketch-loop-close { color:#F8FAFC; font-weight:700; margin-top:8px; font-size:0.92rem; }
            .c-kw { color:#A78BFA; font-weight:bold; }
            .c-tp { color:#F472B6; font-weight:bold; }
            .c-fn { color:#38BDF8; font-weight:bold; }
            .c-cst { color:#FBBF24; font-weight:bold; }
            .c-cm { color:#64748B; font-style:italic; }

            .vars-scaffold-line { padding:4px 8px; border-radius:6px; transition:background 0.2s; border-left:3px solid transparent; }
            .vars-scaffold-line.active { background:rgba(56,189,248,0.25); border-left-color:#38BDF8; }
            .vars-select-cmd { background:#1E293B; border:2px solid #38BDF8; color:#7DD3FC; font-family:'Fira Code', monospace; font-size:0.88rem; font-weight:bold; padding:4px 8px; border-radius:8px; outline:none; cursor:pointer; }
            .vars-select-cmd:focus { border-color:#FBBF24; color:#FBBF24; }
            .vars-input-text { background:#1E293B; border:2px solid #38BDF8; color:#FBBF24; font-family:'Fira Code', monospace; font-size:0.95rem; padding:4px 10px; border-radius:8px; outline:none; }
            .vars-input-num { background:#1E293B; border:2px solid #38BDF8; color:#FBBF24; font-family:'Fredoka One'; font-size:1.05rem; width:70px; padding:4px 8px; border-radius:8px; text-align:center; outline:none; }

            /* MINI-IDE LIVRE EM C/C++ */
            .vars-shortcuts-bar { display:flex; gap:6px; flex-wrap:wrap; margin-bottom:12px; background:#111827; padding:8px; border-radius:12px; border:1px solid #1F2937; }
            .vars-shortcut-btn { background:#1F2937; border:1px solid #374151; color:#E5E7EB; padding:6px 11px; border-radius:8px; font-size:0.8rem; font-weight:800; cursor:pointer; transition:0.15s; font-family:'Nunito', sans-serif; display:flex; align-items:center; gap:4px; }
            .vars-shortcut-btn:hover { background:#38BDF8; border-color:#7DD3FC; color:#0F172A; transform:scale(1.03); font-weight:900; }
            .vars-shortcut-btn.btn-int { border-color:#F59E0B; color:#FDE68A; }
            .vars-shortcut-btn.btn-float { border-color:#38BDF8; color:#BAE6FD; }
            .vars-shortcut-btn.btn-string { border-color:#EC4899; color:#FBCFE8; }
            .vars-shortcut-btn.btn-bool { border-color:#10B981; color:#A7F3D0; }
            .vars-shortcut-btn.clear { background:#450A0A; border-color:#991B1B; color:#FCA5A5; }
            .vars-shortcut-btn.clear:hover { background:#DC2626; color:white; }

            .vars-code-wrapper { position:relative; display:flex; background:#030712; border-radius:14px; border:2px solid #1F2937; overflow:hidden; min-height:380px; height:380px; transition:border-color 0.2s; }
            .vars-code-wrapper:focus-within { border-color:#38BDF8; box-shadow:0 0 20px rgba(56,189,248,0.2); }
            .vars-line-numbers { background:#0B0F19; color:#4B5563; padding:14px 10px; text-align:right; font-family:'Fira Code', monospace; font-size:0.88rem; line-height:1.8; user-select:none; border-right:1px solid #1F2937; min-width:38px; }
            .vars-code-input { flex:1; background:transparent; border:none; color:#F3F4F6; padding:14px; font-family:'Fira Code', monospace; font-size:0.95rem; line-height:1.8; resize:none; outline:none; white-space:pre; tab-size:4; min-height:380px; }
            
            /* AUTOCOMPLETE FLUTUANTE DA MINI-IDE (PADRÃO AULA 4) */
            .vars-autocomplete-box { position:absolute; left:48px; background:#0B0F19; border:2px solid #38BDF8; border-radius:12px; z-index:100; box-shadow:0 12px 30px rgba(0,0,0,0.85); max-height:240px; overflow-y:auto; display:none; min-width:320px; width:max-content; max-width:92%; }
            .vars-ac-item { padding:8px 14px; color:#CBD5E1; font-family:'Fira Code', monospace; font-size:0.83rem; cursor:pointer; border-bottom:1px solid #1E293B; display:flex; justify-content:space-between; align-items:center; transition:0.12s; }
            .vars-ac-item:hover, .vars-ac-item.active { background:rgba(56,189,248,0.25); color:#38BDF8; }
            .vars-ac-shortcut { font-size:0.72rem; background:#1E293B; color:#38BDF8; padding:2px 6px; border-radius:4px; margin-left:12px; font-weight:700; border:1px solid #38BDF8; }

            /* MODO TELA EXPANDIDA / MAXIMIZADA DA IDE */
            .vars-ide-maximized { position:fixed !important; top:20px !important; left:20px !important; right:20px !important; bottom:20px !important; z-index:100000 !important; background:#070B14 !important; border:3px solid #38BDF8 !important; border-radius:20px !important; padding:24px !important; box-shadow:0 0 60px rgba(0,0,0,0.95), 0 0 35px rgba(56,189,248,0.45) !important; display:flex !important; flex-direction:column !important; overflow:hidden !important; animation:varsFadeIn 0.2s ease; }
            .vars-ide-maximized .vars-code-wrapper { flex:1 !important; height:auto !important; min-height:460px !important; }
            .vars-ide-maximized .vars-code-input { min-height:460px !important; font-size:1.05rem !important; line-height:1.8 !important; }
            .vars-ide-maximized .vars-shortcuts-bar { margin-bottom:14px !important; }

            /* CAIXA DE DICA E RESOLUÇÃO */
            .vars-btn-solution { background:linear-gradient(135deg,#D97706,#B45309); border:none; color:white; padding:10px 14px; border-radius:12px; font-size:0.85rem; font-weight:900; cursor:pointer; transition:0.15s; margin-top:12px; width:100%; display:flex; align-items:center; justify-content:center; gap:8px; opacity:0.6; }
            .vars-btn-solution:not(:disabled) { opacity:1; box-shadow:0 4px 15px rgba(245,158,11,0.3); }
            .vars-btn-solution:not(:disabled):hover { background:linear-gradient(135deg,#F59E0B,#D97706); }
            .vars-solution-card { background:#0F172A; border:2px solid #F59E0B; border-radius:14px; padding:12px 16px; margin-top:12px; display:none; animation:varsFadeIn 0.3s ease; }

            /* BOTÕES DE AÇÃO */
            .vars-actions { display:flex; gap:10px; margin-top:14px; width:100%; }
            .vars-btn-run { background:linear-gradient(135deg,#38BDF8,#0284C7); color:#0F172A; border:none; padding:13px 20px; border-radius:16px; font-family:'Fredoka One', cursive; font-size:1.15rem; flex:2; border-bottom:5px solid #0369A1; cursor:pointer; transition:0.15s; display:flex; align-items:center; justify-content:center; gap:8px; box-shadow:0 6px 20px rgba(56,189,248,0.35); }
            .vars-btn-run:active { transform:translateY(4px); border-bottom-width:1px; }
            .vars-btn-run:disabled { background:#475569; border-bottom-color:#1E293B; cursor:not-allowed; box-shadow:none; color:#94A3B8; }
            .vars-btn-reset { background:#334155; color:#CBD5E1; border:none; padding:13px 18px; border-radius:16px; font-family:'Fredoka One', cursive; font-size:1rem; flex:1; border-bottom:5px solid #1E293B; cursor:pointer; transition:0.15s; }

            /* MODAL DE VITÓRIA */
            .vars-modal { position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(15,23,42,0.88); backdrop-filter:blur(8px); display:flex; justify-content:center; align-items:center; z-index:9999; opacity:0; pointer-events:none; transition:0.3s; }
            .vars-modal.active { opacity:1; pointer-events:all; }
            .vars-modal-box { background:linear-gradient(180deg,#1E293B,#0F172A); padding:32px 24px; border-radius:28px; max-width:440px; width:92%; text-align:center; border:3px solid #38BDF8; box-shadow:0 0 45px rgba(56,189,248,0.4); }
            .vars-modal-icon { font-size:4rem; margin-bottom:6px; animation:stampPop 0.4s cubic-bezier(0.175,0.885,0.32,1.275); }
            .vars-modal-title { font-family:'Fredoka One', cursive; color:white; font-size:1.8rem; margin:0 0 8px; }
            .vars-modal-text { color:#CBD5E1; margin:0 0 20px; font-size:0.95rem; line-height:1.6; }
            .vars-btn-modal { background:linear-gradient(135deg,#38BDF8,#0284C7); border:none; padding:13px 32px; border-radius:50px; font-weight:900; font-size:1.05rem; color:#0F172A; cursor:pointer; border-bottom:4px solid #0369A1; transition:0.15s; }

            @keyframes varsFadeIn { from{opacity:0;transform:translateY(8px);} to{opacity:1;transform:translateY(0);} }
        </style>

        <div class="vars-wrapper">
            <!-- CABEÇALHO DO MÓDULO -->
            <div class="vars-header-card">
                <div class="vars-header-info">
                    <h2>🧮 Aula 5: Variáveis & Tipos de Dados em C/C++</h2>
                    <p id="vars-header-desc">Aprenda como guardar e manipular números, textos e estados na memória RAM do Arduino usando <code>int</code>, <code>float</code>, <code>String</code> e <code>bool</code>!</p>
                </div>
                <button class="vars-guide-toggle-btn" id="vars_guide_toggle_btn" onclick="vars_toggleGuide()">
                    <i class="fa-solid fa-book-open-reader"></i> <span id="vars_guide_toggle_txt">Ocultar Guia Teórico</span>
                </button>
            </div>

            <!-- GUIA INTERATIVO COM SLIDES DA HISTÓRIA & CONCEITOS -->
            <div class="vars-guide-card" id="vars_guide_card">
                <div class="vars-guide-tabs">
                    <button class="vars-guide-tab active" id="vars_tab_g1" onclick="vars_switchGuideTab(1)"><i class="fa-solid fa-box-archive"></i> 1. O que é uma Variável?</button>
                    <button class="vars-guide-tab" id="vars_tab_g2" onclick="vars_switchGuideTab(2)"><i class="fa-solid fa-shapes"></i> 2. Os 4 Tipos Mágicos</button>
                    <button class="vars-guide-tab" id="vars_tab_g3" onclick="vars_switchGuideTab(3)"><i class="fa-solid fa-calculator"></i> 3. O Sinal de Igual (=)</button>
                    <button class="vars-guide-tab" id="vars_tab_g4" onclick="vars_switchGuideTab(4)"><i class="fa-solid fa-microchip"></i> 4. Variáveis no Arduino</button>
                    <button class="vars-guide-tab" id="vars_tab_g5" onclick="vars_switchGuideTab(5)"><i class="fa-solid fa-triangle-exclamation"></i> 5. Erros Mais Comuns</button>
                </div>

                <!-- SLIDE 1: O QUE É UMA VARIÁVEL? -->
                <div class="vars-slide-content active" id="vars_slide_1">
                    <div style="font-size:1.05rem;font-weight:900;color:#38BDF8;margin-bottom:8px;display:flex;align-items:center;gap:8px;">
                        <span>📦 1. A Grande Analogia das Caixas de Brinquedo</span>
                    </div>
                    <p style="margin:0 0 10px;color:#CBD5E1;font-size:0.92rem;line-height:1.6;">
                        Imagine que você tem várias <b>caixas organizadoras com etiquetas</b> no seu quarto:
                    </p>
                    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:12px;margin:12px 0;">
                        <div style="background:#1E293B;padding:12px;border-radius:12px;border:1px solid #38BDF8;">
                            <div style="font-weight:900;color:#38BDF8;font-size:0.9rem;">🏷️ 1. O Nome (Identificador)</div>
                            <div style="font-size:0.85rem;color:#94A3B8;margin-top:4px;">É a etiqueta da caixa (ex: <code>vidas</code>, <code>moedas</code>). É como você chama ela no código!</div>
                        </div>
                        <div style="background:#1E293B;padding:12px;border-radius:12px;border:1px solid #F59E0B;">
                            <div style="font-weight:900;color:#FBBF24;font-size:0.9rem;">📐 2. O Tipo de Dado</div>
                            <div style="font-size:0.85rem;color:#94A3B8;margin-top:4px;">O formato da caixa! Se é para guardar números inteiros, números com vírgula ou palavras.</div>
                        </div>
                        <div style="background:#1E293B;padding:12px;border-radius:12px;border:1px solid #10B981;">
                            <div style="font-weight:900;color:#34D399;font-size:0.9rem;">🧸 3. O Conteúdo (Valor)</div>
                            <div style="font-size:0.85rem;color:#94A3B8;margin-top:4px;">O que está dentro da caixa neste instante (ex: o número <code>3</code>, ou a palavra <code>"Robô"</code>).</div>
                        </div>
                    </div>
                    <div style="background:#022C22;border:1px solid #10B981;border-radius:12px;padding:10px 14px;color:#A7F3D0;font-size:0.86rem;line-height:1.5;">
                        🧠 <b>Memória RAM do Arduino UNO:</b> O chip ATmega328P tem <b>2048 bytes (2 KB)</b> de memória SRAM. Cada variável ocupa um espacinho guardado com muito carinho!
                    </div>
                </div>

                <!-- SLIDE 2: OS 4 TIPOS FUNDAMENTAIS -->
                <div class="vars-slide-content" id="vars_slide_2">
                    <div style="font-size:1.05rem;font-weight:900;color:#38BDF8;margin-bottom:8px;display:flex;align-items:center;gap:8px;">
                        <span>🧩 2. Os 4 Tipos Fundamentais da Robótica & C/C++</span>
                    </div>
                    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:10px;margin-bottom:10px;">
                        <div style="background:#1E293B;padding:12px;border-radius:12px;border-left:4px solid #FBBF24;">
                            <div style="font-family:'Fira Code';font-weight:900;color:#FBBF24;">int (Inteiro)</div>
                            <div style="font-size:0.82rem;color:#E2E8F0;margin:4px 0;">Números inteiros sem vírgula (ex: <code>0</code>, <code>5</code>, <code>-10</code>, <code>100</code>).</div>
                            <div style="font-size:0.75rem;color:#94A3B8;">Uso: Vidas, moedas, número do pino do Arduino.</div>
                        </div>
                        <div style="background:#1E293B;padding:12px;border-radius:12px;border-left:4px solid #38BDF8;">
                            <div style="font-family:'Fira Code';font-weight:900;color:#38BDF8;">float (Decimal)</div>
                            <div style="font-size:0.82rem;color:#E2E8F0;margin:4px 0;">Números reais com ponto decimal (ex: <code>24.5</code>, <code>3.14</code>, <code>4.8</code>).</div>
                            <div style="font-size:0.75rem;color:#94A3B8;">Uso: Temperatura, voltagem da bateria, distância de sonar.</div>
                        </div>
                        <div style="background:#1E293B;padding:12px;border-radius:12px;border-left:4px solid #F472B6;">
                            <div style="font-family:'Fira Code';font-weight:900;color:#F472B6;">String (Texto)</div>
                            <div style="font-size:0.82rem;color:#E2E8F0;margin:4px 0;">Palavras e frases sempre entre <b>aspas duplas</b> <code>"..."</code>.</div>
                            <div style="font-size:0.75rem;color:#94A3B8;">Uso: Mensagens na tela LCD, senhas, nome do piloto.</div>
                        </div>
                        <div style="background:#1E293B;padding:12px;border-radius:12px;border-left:4px solid #34D399;">
                            <div style="font-family:'Fira Code';font-weight:900;color:#34D399;">bool (Booleano)</div>
                            <div style="font-size:0.82rem;color:#E2E8F0;margin:4px 0;">Apenas dois valores possíveis: <code>true</code> (verdadeiro) ou <code>false</code> (falso).</div>
                            <div style="font-size:0.75rem;color:#94A3B8;">Uso: Trava aberta, botão apertado, alarme ligado.</div>
                        </div>
                    </div>
                </div>

                <!-- SLIDE 3: O SINAL DE IGUAL (= ATRIBUIÇÃO) -->
                <div class="vars-slide-content" id="vars_slide_3">
                    <div style="font-size:1.05rem;font-weight:900;color:#38BDF8;margin-bottom:8px;display:flex;align-items:center;gap:8px;">
                        <span>📥 3. O Sinal de Igual (=) Significa "GUARDAR", Não Igualdade!</span>
                    </div>
                    <p style="margin:0 0 10px;color:#CBD5E1;font-size:0.92rem;line-height:1.6;">
                        Na matemática da escola, <code>=</code> significa que os dois lados são iguais. Mas na programação com Arduino, o <code>=</code> é uma <b>SETA DE GUARDAR DENTRO DA CAIXA</b>:
                    </p>
                    <div style="background:#030712;border:1px solid #334155;border-radius:12px;padding:12px;font-family:'Fira Code',monospace;font-size:0.88rem;color:#F1F5F9;margin-bottom:10px;">
                        <span class="c-tp">int</span> moedas = 0; <span class="c-cm">// Cria a caixa "moedas" e guarda 0 dentro</span><br>
                        moedas = moedas + 1; <span class="c-cm">// Pega o que tinha (0), soma +1 e guarda de volta: agora vale 1!</span><br>
                        moedas = moedas + 5; <span class="c-cm">// Pega 1, soma 5 e guarda de volta: agora vale 6!</span>
                    </div>
                    <div style="background:#1E293B;border-left:4px solid #FBBF24;padding:8px 12px;border-radius:0 8px 8px 0;font-size:0.85rem;color:#FBBF24;">
                        💡 <b>Atalho Maker:</b> O comando <code>moedas++;</code> é um apelido carinhoso para <code>moedas = moedas + 1;</code>!
                    </div>
                </div>

                <!-- SLIDE 4: VARIÁVEIS NO ARDUINO -->
                <div class="vars-slide-content" id="vars_slide_4">
                    <div style="font-size:1.05rem;font-weight:900;color:#38BDF8;margin-bottom:8px;display:flex;align-items:center;gap:8px;">
                        <span>📡 4. Variáveis Conectadas com Sensores e Telas LCD</span>
                    </div>
                    <p style="margin:0 0 10px;color:#CBD5E1;font-size:0.92rem;line-height:1.6;">
                        No Arduino real, as variáveis são os órgãos vitais do robô:
                    </p>
                    <div style="background:#030712;border:1px solid #38BDF8;border-radius:12px;padding:12px;font-family:'Fira Code',monospace;font-size:0.85rem;color:#E2E8F0;line-height:1.6;">
                        <span class="c-tp">int</span> pinoSensor = A0;<br>
                        <span class="c-tp">float</span> temperatura = 25.4;<br>
                        <span class="c-tp">bool</span> alertaQuente = <span class="c-cst">false</span>;<br>
                        <span class="c-tp">String</span> mensagem = <span style="color:#A7F3D0;">"CLIMA NORMAL"</span>;<br><br>
                        <span class="c-fn">Serial.print</span>(<span style="color:#A7F3D0;">"Temperatura: "</span>);<br>
                        <span class="c-fn">Serial.println</span>(temperatura);
                    </div>
                </div>

                <!-- SLIDE 5: ERROS MAIS COMUNS -->
                <div class="vars-slide-content" id="vars_slide_5">
                    <div style="font-size:1.05rem;font-weight:900;color:#38BDF8;margin-bottom:8px;display:flex;align-items:center;gap:8px;">
                        <span>⚠️ 5. Os 3 Erros Mais Comuns de Quem Começa</span>
                    </div>
                    <div style="display:flex;flex-direction:column;gap:8px;">
                        <div style="background:#1E293B;padding:10px 14px;border-radius:12px;border:1px solid #EF4444;font-size:0.86rem;">
                            <b style="color:#EF4444;">1. Erro de Tipo (Guardar na Caixa Errada):</b> Tentar colocar texto numa variável <code>int</code> de número inteiro: <code>int idade = "dez";</code> ❌ O compilador dá erro na hora! O correto é <code>int idade = 10;</code> ✅
                        </div>
                        <div style="background:#1E293B;padding:10px 14px;border-radius:12px;border:1px solid #F59E0B;font-size:0.86rem;">
                            <b style="color:#FBBF24;">2. Esquecer as Aspas no String:</b> <code>String nome = Robo;</code> ❌ Sem as aspas, o computador acha que "Robo" é outra variável! O certo é <code>String nome = "Robo";</code> ✅
                        </div>
                        <div style="background:#1E293B;padding:10px 14px;border-radius:12px;border:1px solid #38BDF8;font-size:0.86rem;">
                            <b style="color:#38BDF8;">3. Esquecer o Ponto e Vírgula (;):</b> Toda instrução em C/C++ termina com <code>;</code>. Ele é o ponto final da frase do programador!
                        </div>
                    </div>
                </div>

                <!-- RODAPÉ DE NAVEGAÇÃO DOS SLIDES -->
                <div class="vars-guide-footer">
                    <button class="vars-guide-nav-btn" onclick="vars_prevGuideSlide()"><i class="fa-solid fa-arrow-left"></i> Anterior</button>
                    <div class="vars-guide-progress-dots">
                        <span class="vars-dot active" id="vars_dot_1"></span>
                        <span class="vars-dot" id="vars_dot_2"></span>
                        <span class="vars-dot" id="vars_dot_3"></span>
                        <span class="vars-dot" id="vars_dot_4"></span>
                        <span class="vars-dot" id="vars_dot_5"></span>
                    </div>
                    <button class="vars-guide-nav-btn primary" onclick="vars_nextGuideSlide()">Próximo <i class="fa-solid fa-arrow-right"></i></button>
                </div>
            </div>

            <!-- NAVEGAÇÃO DOS NÍVEIS -->
            <div class="vars-level-bar">
                <button class="vars-level-btn active" id="vars_btn_lvl_1" onclick="vars_switchLevel(1)">
                    <div class="vars-lvl-left">
                        <div class="vars-lvl-num">1</div>
                        <div class="vars-lvl-info">
                            <span class="vars-lvl-title">Nível 1: Vidas & Moedas</span>
                            <span class="vars-lvl-sub">Tipo int e somas</span>
                        </div>
                    </div>
                    <div class="vars-lvl-status" id="vars_lvl_stat_1">⭐</div>
                </button>
                <button class="vars-level-btn" id="vars_btn_lvl_2" onclick="vars_switchLevel(2)">
                    <div class="vars-lvl-left">
                        <div class="vars-lvl-num">2</div>
                        <div class="vars-lvl-info">
                            <span class="vars-lvl-title">Nível 2: Termômetro</span>
                            <span class="vars-lvl-sub">Tipo float e decimais</span>
                        </div>
                    </div>
                    <div class="vars-lvl-status" id="vars_lvl_stat_2">🔒</div>
                </button>
                <button class="vars-level-btn" id="vars_btn_lvl_3" onclick="vars_switchLevel(3)">
                    <div class="vars-lvl-left">
                        <div class="vars-lvl-num">3</div>
                        <div class="vars-lvl-info">
                            <span class="vars-lvl-title">Nível 3: Cofre Secreto</span>
                            <span class="vars-lvl-sub">String & bool</span>
                        </div>
                    </div>
                    <div class="vars-lvl-status" id="vars_lvl_stat_3">🔒</div>
                </button>
                <button class="vars-level-btn" id="vars_btn_lvl_4" onclick="vars_switchLevel(4)">
                    <div class="vars-lvl-left">
                        <div class="vars-lvl-num">4</div>
                        <div class="vars-lvl-info">
                            <span class="vars-lvl-title">Nível 4: Loop FOR 1 🔄</span>
                            <span class="vars-lvl-sub">Esteira Solar + Acumulador</span>
                        </div>
                    </div>
                    <div class="vars-lvl-status" id="vars_lvl_stat_4">🔒</div>
                </button>
                <button class="vars-level-btn" id="vars_btn_lvl_5" onclick="vars_switchLevel(5)">
                    <div class="vars-lvl-left">
                        <div class="vars-lvl-num">5</div>
                        <div class="vars-lvl-info">
                            <span class="vars-lvl-title">Nível 5: Loop FOR 2 💎</span>
                            <span class="vars-lvl-sub">Mineração em Marte</span>
                        </div>
                    </div>
                    <div class="vars-lvl-status" id="vars_lvl_stat_5">🔒</div>
                </button>
                <button class="vars-level-btn" id="vars_btn_lvl_6" onclick="vars_switchLevel(6)">
                    <div class="vars-lvl-left">
                        <div class="vars-lvl-num">6</div>
                        <div class="vars-lvl-info">
                            <span class="vars-lvl-title">Nível 6: IF/ELSE 1 🌱</span>
                            <span class="vars-lvl-sub">Estufa Inteligente</span>
                        </div>
                    </div>
                    <div class="vars-lvl-status" id="vars_lvl_stat_6">🔒</div>
                </button>
                <button class="vars-level-btn" id="vars_btn_lvl_7" onclick="vars_switchLevel(7)">
                    <div class="vars-lvl-left">
                        <div class="vars-lvl-num">7</div>
                        <div class="vars-lvl-info">
                            <span class="vars-lvl-title">Nível 7: IF/ELSE 2 🚨</span>
                            <span class="vars-lvl-sub">Radar & Freio Ultrassônico</span>
                        </div>
                    </div>
                    <div class="vars-lvl-status" id="vars_lvl_stat_7">🔒</div>
                </button>
                <button class="vars-level-btn" id="vars_btn_lvl_8" onclick="vars_switchLevel(8)">
                    <div class="vars-lvl-left">
                        <div class="vars-lvl-num">8</div>
                        <div class="vars-lvl-info">
                            <span class="vars-lvl-title">Nível 8: Desafio Rover 🚀</span>
                            <span class="vars-lvl-sub">Mini-IDE Livre Geral</span>
                        </div>
                    </div>
                    <div class="vars-lvl-status" id="vars_lvl_stat_8">🔒</div>
                </button>
            </div>

            <!-- CARD DE HISTÓRIA / MISSÃO -->
            <div class="vars-story-card">
                <div class="vars-story-header">
                    <span class="vars-story-title" id="vars_story_title">🎯 Missão 1</span>
                    <span class="vars-story-badge" id="vars_story_badge">Carregando...</span>
                </div>
                <p class="vars-story-text" id="vars_story_desc">Descrição da missão...</p>
            </div>

            <!-- CENÁRIO GRÁFICO E BANCADA DE MEMÓRIA RAM DO ARDUINO -->
            <div class="vars-stage-card">
                <div class="vars-stage-hud">
                    <div class="vars-hud-item">
                        <span>🧠 Memória SRAM:</span>
                        <span style="font-family:'Fira Code';color:#38BDF8;font-weight:900;">2048 Bytes (Livre: 2036 B)</span>
                    </div>
                    <div class="vars-hud-item" id="vars_hud_types">
                        <span class="vars-type-pill int">int: 2B</span>
                        <span class="vars-type-pill float">float: 4B</span>
                        <span class="vars-type-pill string">String</span>
                        <span class="vars-type-pill bool">bool: 1B</span>
                    </div>
                </div>

                <!-- BANCADA DAS CAIXAS DE MEMÓRIA RAM DINÂMICAS -->
                <div class="vars-ram-chip">
                    <div class="vars-ram-header">
                        <span><i class="fa-solid fa-microchip"></i> Caixas de Memória RAM em Tempo Real</span>
                        <span id="vars_ram_status" style="color:#34D399;">● Online</span>
                    </div>
                    <div class="vars-ram-boxes" id="vars_ram_boxes">
                        <!-- Gerado dinamicamente por vars_renderRamBoxes() -->
                    </div>
                </div>

                <!-- ARENA DE SIMULAÇÃO VISUAL POR NÍVEL -->
                <div class="vars-arena" id="vars_arena_box">
                    <!-- Gerado dinamicamente para cada nível (Robô, Termômetro, Cofre, Rover) -->
                </div>
            </div>

            <!-- GRID PRINCIPAL: MINI-IDE / SCAFFOLDING & PAINEL ARDUINO -->
            <div class="vars-ide-layout">
                <div class="vars-editor-card">
                    <div class="vars-editor-topbar">
                        <span class="vars-editor-title"><i class="fa-solid fa-code"></i> Editor Arduino C/C++</span>
                        <span class="vars-lang-tag">sketch.ino</span>
                    </div>

                    <!-- SCAFFOLDING NÍVEL 1 (Vidas & Moedas - int) -->
                    <div id="vars_scaffold_n1" class="vars-scaffold-lines">
                        <div class="vars-sketch-setup">
                            <span class="c-cm">// 📦 Declaração das caixas de memória inteiras (int):</span><br>
                            <span class="c-tp">int</span> vidas = <input type="number" class="vars-input-num" id="vars_n1_vidas_init" value="3" min="1" max="5" oninput="vars_updateLiveCpp()" />;<br>
                            <span class="c-tp">int</span> moedas = 0;<br>
                            <span class="c-tp">int</span> pontos = 0;
                        </div>

                        <div class="vars-sketch-loop-tag">
                            <span class="c-kw">void</span> <span class="c-fn">loop</span>() { <span class="c-cm">// 🎮 O Robô entra na caverna:</span>
                        </div>

                        <div class="vars-sketch-loop-body">
                            <div class="vars-scaffold-line"><span class="c-cm">// 🎯 Objetivo 1: O robô abriu o baú dourado! Atualize a caixa de moedas somando o prêmio:</span></div>
                            <div class="vars-scaffold-line">
                                <select class="vars-select-cmd" id="vars_n1_cmd1" onchange="vars_updateLiveCpp()">
                                    <option value="" selected disabled>— escolha a instrução C++ —</option>
                                    <option value="moedas = &quot;10&quot;;">moedas = "10";</option>
                                    <option value="stirng moedas = 10;">stirng moedas = 10;</option>
                                    <option value="moedas = moedas - 10;">moedas = moedas - 10;</option>
                                    <option value="moedas = moedas + 10;">moedas = moedas + 10;</option>
                                    <option value="moedas == moedas + 10;">moedas == moedas + 10;</option>
                                    <option value="moedas = moedas + &quot;10&quot;;">moedas = moedas + "10";</option>
                                    <option value="moedas = 10;">moedas = 10;</option>
                                </select>
                            </div>

                            <div class="vars-scaffold-line" style="margin-top:6px;"><span class="c-cm">// 🎯 Objetivo 2: O robô pisou no espinho da caverna! Atualize a vida do jogador:</span></div>
                            <div class="vars-scaffold-line">
                                <select class="vars-select-cmd" id="vars_n1_cmd2" onchange="vars_updateLiveCpp()">
                                    <option value="" selected disabled>— escolha a instrução C++ —</option>
                                    <option value="vidas = vidas + 1;">vidas = vidas + 1;</option>
                                    <option value="vidas = &quot;3&quot;;">vidas = "3";</option>
                                    <option value="stirng vidas = vidas - 1;">stirng vidas = vidas - 1;</option>
                                    <option value="vidas = vidas - 1;">vidas = vidas - 1;</option>
                                    <option value="vidas = 0;">vidas = 0;</option>
                                    <option value="vida = vida - 1;">vida = vida - 1;</option>
                                    <option value="vidas == vidas - 1;">vidas == vidas - 1;</option>
                                </select>
                            </div>

                            <div class="vars-scaffold-line" style="margin-top:6px;"><span class="c-cm">// 🎯 Objetivo 3: Cada moeda vale 100 pontos! Calcule a pontuação final na memória:</span></div>
                            <div class="vars-scaffold-line">
                                <select class="vars-select-cmd" id="vars_n1_cmd3" onchange="vars_updateLiveCpp()">
                                    <option value="" selected disabled>— escolha o cálculo do placar —</option>
                                    <option value="pontos = moedas + 100;">pontos = moedas + 100;</option>
                                    <option value="pontos = moedas + &quot;100&quot;;">pontos = moedas + "100";</option>
                                    <option value="stirng pontos = 100;">stirng pontos = 100;</option>
                                    <option value="pontos = moedas * 100;">pontos = moedas * 100;</option>
                                    <option value="pontos = 100;">pontos = 100;</option>
                                    <option value="pontos == moedas * 100;">pontos == moedas * 100;</option>
                                    <option value="pontos = moedas * &quot;100&quot;;">pontos = moedas * "100";</option>
                                </select>
                            </div>
                        </div>

                        <div class="vars-sketch-loop-close">}</div>
                    </div>

                    <!-- SCAFFOLDING NÍVEL 2 (Estação Meteorológica - float) -->
                    <div id="vars_scaffold_n2" class="vars-scaffold-lines" style="display:none;">
                        <div class="vars-sketch-setup">
                            <span class="c-cm">// 🌡️ Sensores da estufa registrando medições do ambiente:</span><br>
                            <span class="c-tp">float</span> tempManha = 20.5;<br>
                            <span class="c-tp">float</span> tempTarde = 31.5;<br>
                            <span class="c-tp">float</span> tempMedia = 0.0;<br>
                            <span class="c-tp">float</span> tensaoBateria = 4.85;
                        </div>

                        <div class="vars-sketch-loop-tag">
                            <span class="c-kw">void</span> <span class="c-fn">loop</span>() { <span class="c-cm">// 📊 Cálculo da estação meteorológica:</span>
                        </div>

                        <div class="vars-sketch-loop-body">
                            <div class="vars-scaffold-line"><span class="c-cm">// 🎯 Objetivo 1: Escolha o tipo de dado para registrar medições térmicas com casas decimais:</span></div>
                            <div class="vars-scaffold-line">
                                <select class="vars-select-cmd" id="vars_n2_tipo" onchange="vars_updateLiveCpp()">
                                    <option value="" selected disabled>— escolha o tipo de dado C++ —</option>
                                    <option value="stirng">stirng</option>
                                    <option value="int">int</option>
                                    <option value="decimal">decimal</option>
                                    <option value="float">float</option>
                                    <option value="numero">numero</option>
                                    <option value="String">String</option>
                                    <option value="flutuante">flutuante</option>
                                </select>
                            </div>

                            <div class="vars-scaffold-line" style="margin-top:6px;"><span class="c-cm">// 🎯 Objetivo 2: Determine a temperatura média combinando a leitura matutina e vespertina:</span></div>
                            <div class="vars-scaffold-line">
                                <select class="vars-select-cmd" id="vars_n2_calc" onchange="vars_updateLiveCpp()">
                                    <option value="" selected disabled>— escolha a fórmula da média —</option>
                                    <option value="tempMedia = tempManha + tempTarde;">tempMedia = tempManha + tempTarde;</option>
                                    <option value="tempMedia = &quot;tempManha + tempTarde / 2&quot;;">tempMedia = "tempManha + tempTarde / 2";</option>
                                    <option value="tempMedia = tempManha + tempTarde / 2.0;">tempMedia = tempManha + tempTarde / 2.0;</option>
                                    <option value="tempMedia = (tempManha + tempTarde) / 2.0;">tempMedia = (tempManha + tempTarde) / 2.0;</option>
                                    <option value="tempMedia = (tempManha * tempTarde) / 2;">tempMedia = (tempManha * tempTarde) / 2;</option>
                                    <option value="tempMedia = (tempManha + tempTarde) / &quot;2.0&quot;;">tempMedia = (tempManha + tempTarde) / "2.0";</option>
                                    <option value="stirng tempMedia = (tempManha + tempTarde) / 2;">stirng tempMedia = (tempManha + tempTarde) / 2;</option>
                                </select>
                            </div>

                            <div class="vars-scaffold-line" style="margin-top:6px;"><span class="c-cm">// 🎯 Saída: Envie os dados calculados para o display LCD:</span></div>
                            <div class="vars-scaffold-line">
                                <span class="c-fn">lcd_imprimir</span>(tempMedia);
                            </div>
                        </div>

                        <div class="vars-sketch-loop-close">}</div>
                    </div>

                    <!-- SCAFFOLDING NÍVEL 3 (Cofre Secreto - String & bool) -->
                    <div id="vars_scaffold_n3" class="vars-scaffold-lines" style="display:none;">
                        <div class="vars-sketch-setup">
                            <span class="c-cm">// 🔐 Configuração do cofre eletrônico de alta segurança:</span><br>
                            <span class="c-tp">String</span> senhaMestre = <span style="color:#A7F3D0;">"ARDUINO2026"</span>;<br>
                            <span class="c-tp">String</span> senhaDigitada = <span style="color:#A7F3D0;">""</span>;<br>
                            <span class="c-tp">bool</span> travaAberta = <span class="c-cst">false</span>;
                        </div>

                        <div class="vars-sketch-loop-tag">
                            <span class="c-kw">void</span> <span class="c-fn">loop</span>() { <span class="c-cm">// 🔑 Verificação de acesso:</span>
                        </div>

                        <div class="vars-sketch-loop-body">
                            <div class="vars-scaffold-line"><span class="c-cm">// 🎯 Objetivo 1: Defina o tipo de dado para armazenar textos alfanuméricos entre aspas:</span></div>
                            <div class="vars-scaffold-line">
                                <select class="vars-select-cmd" id="vars_n3_tipo_str" onchange="vars_updateLiveCpp()">
                                    <option value="" selected disabled>— selecione o tipo para a senha —</option>
                                    <option value="int">int</option>
                                    <option value="stirng">stirng</option>
                                    <option value="texto">texto</option>
                                    <option value="String">String</option>
                                    <option value="bool">bool</option>
                                    <option value="char">char</option>
                                    <option value="float">float</option>
                                </select>
                            </div>

                            <div class="vars-scaffold-line" style="margin-top:6px;"><span class="c-cm">// 🎯 Objetivo 2: Digite a senha de acesso no teclado numérico:</span></div>
                            <div class="vars-scaffold-line">
                                senhaDigitada = <input type="text" class="vars-input-text" id="vars_n3_input_senha" placeholder="digite aqui..." value="ARDUINO2026" oninput="vars_updateLiveCpp()" />;
                            </div>

                            <div class="vars-scaffold-line" style="margin-top:6px;"><span class="c-cm">// 🎯 Objetivo 3: Se as credenciais forem confirmadas, acione o destravamento lógico do cofre:</span></div>
                            <div class="vars-scaffold-line">
                                <span class="c-kw">if</span> (senhaDigitada == senhaMestre) {<br>
                                &nbsp;&nbsp;<select class="vars-select-cmd" id="vars_n3_trava_cmd" onchange="vars_updateLiveCpp()">
                                    <option value="" selected disabled>— defina o comando da trava —</option>
                                    <option value="travaAberta = &quot;true&quot;;">travaAberta = "true";</option>
                                    <option value="travaAberta = false;">travaAberta = false;</option>
                                    <option value="travaAberta = &quot;ABERTO&quot;;">travaAberta = "ABERTO";</option>
                                    <option value="travaAberta = true;">travaAberta = true;</option>
                                    <option value="travaAberta == true;">travaAberta == true;</option>
                                    <option value="travaAberta = 100;">travaAberta = 100;</option>
                                    <option value="stirng travaAberta = true;">stirng travaAberta = true;</option>
                                </select><br>
                                }
                            </div>
                        </div>

                        <div class="vars-sketch-loop-close">}</div>
                    </div>

                    <!-- SCAFFOLDING NÍVEL 4 (Revisão: Variáveis + Loop FOR na Esteira Solar) -->
                    <div id="vars_scaffold_n4" class="vars-scaffold-lines" style="display:none;">
                        <div class="vars-sketch-setup">
                            <span class="c-cm">// 🔋 Bateria começando descarregada em 0%:</span><br>
                            <span class="c-tp">int</span> energia = 0;<br>
                        </div>

                        <div class="vars-sketch-loop-tag">
                            <span class="c-kw">void</span> <span class="c-fn">loop</span>() { <span class="c-cm">// 🔄 Recarga nos 4 painéis solares:</span>
                        </div>

                        <div class="vars-sketch-loop-body">
                            <div class="vars-scaffold-line"><span class="c-cm">// 🎯 Objetivo 1: Programe a condição do FOR para percorrer todas as estações solares:</span></div>
                            <div class="vars-scaffold-line">
                                <span class="c-kw">for</span> ( <span class="c-tp">int</span> ciclo = 1;
                                <select class="vars-select-cmd" id="vars_n4_loop_cond" onchange="vars_updateLiveCpp()">
                                    <option value="" selected disabled>— escolha a condição de parada —</option>
                                    <option value="ciclo >= 4;">ciclo >= 4;</option>
                                    <option value="ciclo <= &quot;4&quot;;">ciclo <= "4";</option>
                                    <option value="ciclo == 4;">ciclo == 4;</option>
                                    <option value="ciclo <= 4;">ciclo <= 4;</option>
                                    <option value="ciclo <= 1;">ciclo <= 1;</option>
                                    <option value="ciclo = 4;">ciclo = 4;</option>
                                    <option value="stirng ciclo <= 4;">stirng ciclo <= 4;</option>
                                </select>
                                ciclo++ ) {
                            </div>

                            <div class="vars-scaffold-line" style="margin-left:14px;border-left:2px solid #38BDF8;padding-left:10px;">
                                <span class="c-cm">// 🎯 Objetivo 2: A cada painel solar, acumule uma fração de carga (+25%) na bateria:</span><br>
                                <select class="vars-select-cmd" id="vars_n4_energia_cmd" onchange="vars_updateLiveCpp()">
                                    <option value="" selected disabled>— escolha a instrução acumuladora —</option>
                                    <option value="energia = 25;">energia = 25;</option>
                                    <option value="energia = &quot;25&quot;;">energia = "25";</option>
                                    <option value="energia = energia - 25;">energia = energia - 25;</option>
                                    <option value="energia = energia + 25;">energia = energia + 25;</option>
                                    <option value="energia == energia + 25;">energia == energia + 25;</option>
                                    <option value="energia = &quot;energia + 25&quot;;">energia = "energia + 25";</option>
                                    <option value="stirng energia = energia + 25;">stirng energia = energia + 25;</option>
                                </select>
                            </div>

                            <div class="vars-scaffold-line">} <span class="c-cm">// Fim do laço FOR</span></div>
                        </div>

                        <div class="vars-sketch-loop-close">}</div>
                    </div>

                    <!-- SCAFFOLDING NÍVEL 5 (Revisão: Variáveis + Loop FOR na Mineração de Cristais em Marte) -->
                    <div id="vars_scaffold_n5" class="vars-scaffold-lines" style="display:none;">
                        <div class="vars-sketch-setup">
                            <span class="c-cm">// 💎 Recursos e bateria inicial do Rover Marciano:</span><br>
                            <span class="c-tp">int</span> cristais = 0; <span class="c-cm">// Mochila de minérios</span><br>
                            <span class="c-tp">int</span> bateria = 100; <span class="c-cm">// Carga da bateria</span>
                        </div>

                        <div class="vars-sketch-loop-tag">
                            <span class="c-kw">void</span> <span class="c-fn">loop</span>() { <span class="c-cm">// 🪐 Mineração nos 4 quadrantes marcianos:</span>
                        </div>

                        <div class="vars-sketch-loop-body">
                            <div class="vars-scaffold-line"><span class="c-cm">// 🎯 Objetivo 1: Programe a condição do laço FOR para minerar ordenadamente todos os setores:</span></div>
                            <div class="vars-scaffold-line">
                                <span class="c-kw">for</span> ( <span class="c-tp">int</span> setor = 1;
                                <select class="vars-select-cmd" id="vars_n5_loop_cond" onchange="vars_updateLiveCpp()">
                                    <option value="" selected disabled>— escolha a condição de parada —</option>
                                    <option value="setor >= 4;">setor >= 4;</option>
                                    <option value="setor <= &quot;4&quot;;">setor <= "4";</option>
                                    <option value="setor == 4;">setor == 4;</option>
                                    <option value="setor <= 4;">setor <= 4;</option>
                                    <option value="setor <= 1;">setor <= 1;</option>
                                    <option value="setor = 4;">setor = 4;</option>
                                    <option value="stirng setor <= 4;">stirng setor <= 4;</option>
                                </select>
                                setor++ ) {
                            </div>

                            <div class="vars-scaffold-line" style="margin-left:14px;border-left:2px solid #38BDF8;padding-left:10px;">
                                <span class="c-cm">// 🎯 Objetivo 2: A cada setor explorado, recolha o lote de plasma e acumule na mochila:</span><br>
                                <select class="vars-select-cmd" id="vars_n5_cristais_cmd" onchange="vars_updateLiveCpp()">
                                    <option value="" selected disabled>— cálculo dos cristais —</option>
                                    <option value="cristais = 5;">cristais = 5;</option>
                                    <option value="cristais = &quot;5&quot;;">cristais = "5";</option>
                                    <option value="cristais = cristais - 5;">cristais = cristais - 5;</option>
                                    <option value="cristais = cristais + 5;">cristais = cristais + 5;</option>
                                    <option value="cristais == cristais + 5;">cristais == cristais + 5;</option>
                                    <option value="cristais = cristais + &quot;5&quot;;">cristais = cristais + "5";</option>
                                    <option value="stirng cristais = 5;">stirng cristais = 5;</option>
                                </select>
                            </div>

                            <div class="vars-scaffold-line" style="margin-left:14px;border-left:2px solid #F59E0B;padding-left:10px;margin-top:6px;">
                                <span class="c-cm">// 🎯 Objetivo 3: O raio extrator consome energia a cada disparo: reduza a porcentagem da bateria:</span><br>
                                <select class="vars-select-cmd" id="vars_n5_bateria_cmd" onchange="vars_updateLiveCpp()">
                                    <option value="" selected disabled>— consumo de energia —</option>
                                    <option value="bateria = bateria + 10;">bateria = bateria + 10;</option>
                                    <option value="bateria = &quot;10&quot;;">bateria = "10";</option>
                                    <option value="bateria = 10;">bateria = 10;</option>
                                    <option value="bateria = bateria - 10;">bateria = bateria - 10;</option>
                                    <option value="bateria == bateria - 10;">bateria == bateria - 10;</option>
                                    <option value="bateria = bateria - &quot;10&quot;;">bateria = bateria - "10";</option>
                                    <option value="stirng bateria = bateria - 10;">stirng bateria = bateria - 10;</option>
                                </select>
                            </div>

                            <div class="vars-scaffold-line">} <span class="c-cm">// Fim da mineração marciana</span></div>
                        </div>

                        <div class="vars-sketch-loop-close">}</div>
                    </div>

                    <!-- SCAFFOLDING NÍVEL 6 (Revisão: Variáveis + Decisão IF / ELSE na Estufa) -->
                    <div id="vars_scaffold_n6" class="vars-scaffold-lines" style="display:none;">
                        <div class="vars-sketch-setup">
                            <span class="c-cm">// 🌱 Variáveis dos sensores e atuadores da estufa inteligente:</span><br>
                            <span class="c-tp">float</span> temperatura = 34.5; <span class="c-cm">// Leitura quente do sensor!</span><br>
                            <span class="c-tp">float</span> tempLimite = 30.0; <span class="c-cm">// Limite seguro para as plantas</span><br>
                            <span class="c-tp">bool</span> ventiladorLigado = <span class="c-cst">false</span>;<br>
                            <span class="c-tp">String</span> statusClima = <span style="color:#A7F3D0;">"NORMAL"</span>;
                        </div>

                        <div class="vars-sketch-loop-tag">
                            <span class="c-kw">void</span> <span class="c-fn">loop</span>() { <span class="c-cm">// 🧠 Decisão automatizada com sensores:</span>
                        </div>

                        <div class="vars-sketch-loop-body">
                            <div class="vars-scaffold-line"><span class="c-cm">// 🎯 Objetivo 1: Verifique se o calor detectado ultrapassa a zona de conforto térmico:</span></div>
                            <div class="vars-scaffold-line">
                                <span class="c-kw">if</span> (
                                <select class="vars-select-cmd" id="vars_n6_if_cond" onchange="vars_updateLiveCpp()">
                                    <option value="" selected disabled>— condição da comparação —</option>
                                    <option value="temperatura < tempLimite">temperatura < tempLimite</option>
                                    <option value="temperatura == &quot;30.0&quot;">temperatura == "30.0"</option>
                                    <option value="temperatura = tempLimite">temperatura = tempLimite</option>
                                    <option value="temperatura > tempLimite">temperatura > tempLimite</option>
                                    <option value="temperatura == 0">temperatura == 0</option>
                                    <option value="temperatura >= &quot;tempLimite&quot;">temperatura >= "tempLimite"</option>
                                    <option value="stirng temperatura > tempLimite">stirng temperatura > tempLimite</option>
                                </select>
                                ) {
                            </div>

                            <div class="vars-scaffold-line" style="margin-left:14px;border-left:2px solid #10B981;padding-left:10px;">
                                <span class="c-cm">// 🎯 Objetivo 2: Se houver calor excessivo, ative a refrigeração e atualize a mensagem de status:</span><br>
                                <select class="vars-select-cmd" id="vars_n6_fan_cmd" onchange="vars_updateLiveCpp()">
                                    <option value="" selected disabled>— comando do atuador —</option>
                                    <option value="ventiladorLigado = false; statusClima = &quot;DESLIGADO&quot;;">ventiladorLigado = false; statusClima = "DESLIGADO";</option>
                                    <option value="ventiladorLigado = &quot;true&quot;; statusClima = 100;">ventiladorLigado = "true"; statusClima = 100;</option>
                                    <option value="ventiladorLigado == true; statusClima == &quot;ALERTA&quot;;">ventiladorLigado == true; statusClima == "ALERTA";</option>
                                    <option value="ventiladorLigado = true; statusClima = &quot;ALERTA: VENTILADOR LIGADO&quot;;">ventiladorLigado = true; statusClima = "ALERTA: VENTILADOR LIGADO";</option>
                                    <option value="ventiladorLigado = &quot;LIGAR&quot;; statusClima = &quot;ALERTA&quot;;">ventiladorLigado = "LIGAR"; statusClima = "ALERTA";</option>
                                    <option value="ventiladorLigado = 0; statusClima = &quot;&quot;;">ventiladorLigado = 0; statusClima = "";</option>
                                    <option value="stirng ventiladorLigado = true;">stirng ventiladorLigado = true;</option>
                                </select>
                            </div>

                            <div class="vars-scaffold-line">
                                } <span class="c-kw">else</span> { <span class="c-cm">// SENÃO (está fresco):</span><br>
                                &nbsp;&nbsp;<span style="color:#94A3B8;">ventiladorLigado = false; statusClima = "CLIMA AGRADAVEL";</span><br>
                                }
                            </div>
                        </div>

                        <div class="vars-sketch-loop-close">}</div>
                    </div>

                    <!-- SCAFFOLDING NÍVEL 7 (Revisão: Variáveis + Decisão IF / ELSE Radar & Freio Ultrassônico) -->
                    <div id="vars_scaffold_n7" class="vars-scaffold-lines" style="display:none;">
                        <div class="vars-sketch-setup">
                            <span class="c-cm">// 📡 Radar Ultrassônico HC-SR04 & Piloto Automático:</span><br>
                            <span class="c-tp">float</span> distanciaObstaculo = 14.5; <span class="c-cm">// Distância lida em centímetros</span><br>
                            <span class="c-tp">float</span> distanciaSegura = 20.0; <span class="c-cm">// Distância mínima de segurança</span><br>
                            <span class="c-tp">bool</span> freioEmergencia = <span class="c-cst">false</span>;<br>
                            <span class="c-tp">String</span> alertaPiloto = <span style="color:#A7F3D0;">"PISTA LIVRE"</span>;
                        </div>

                        <div class="vars-sketch-loop-tag">
                            <span class="c-kw">void</span> <span class="c-fn">loop</span>() { <span class="c-cm">// 🚨 Sistema anti-colisão autônomo:</span>
                        </div>

                        <div class="vars-sketch-loop-body">
                            <div class="vars-scaffold-line"><span class="c-cm">// 🎯 Objetivo 1: O sensor mediu um obstáculo à frente: teste se há risco de impacto iminente:</span></div>
                            <div class="vars-scaffold-line">
                                <span class="c-kw">if</span> (
                                <select class="vars-select-cmd" id="vars_n7_if_cond" onchange="vars_updateLiveCpp()">
                                    <option value="" selected disabled>— condição de perigo de colisão —</option>
                                    <option value="distanciaObstaculo > distanciaSegura">distanciaObstaculo > distanciaSegura</option>
                                    <option value="distanciaObstaculo == &quot;14.5&quot;">distanciaObstaculo == "14.5"</option>
                                    <option value="distanciaObstaculo = distanciaSegura">distanciaObstaculo = distanciaSegura</option>
                                    <option value="distanciaObstaculo < distanciaSegura">distanciaObstaculo < distanciaSegura</option>
                                    <option value="distanciaObstaculo <= &quot;20.0&quot;">distanciaObstaculo <= "20.0"</option>
                                    <option value="distanciaObstaculo == 0">distanciaObstaculo == 0</option>
                                    <option value="stirng distanciaObstaculo < distanciaSegura">stirng distanciaObstaculo < distanciaSegura</option>
                                </select>
                                ) {
                            </div>

                            <div class="vars-scaffold-line" style="margin-left:14px;border-left:2px solid #EF4444;padding-left:10px;">
                                <span class="c-cm">// 🎯 Objetivo 2: Detectado o risco de colisão, acione os freios autônomos e notifique o piloto:</span><br>
                                <select class="vars-select-cmd" id="vars_n7_freio_cmd" onchange="vars_updateLiveCpp()">
                                    <option value="" selected disabled>— comando de emergência —</option>
                                    <option value="freioEmergencia = false; alertaPiloto = &quot;ACELERANDO&quot;;">freioEmergencia = false; alertaPiloto = "ACELERANDO";</option>
                                    <option value="freioEmergencia = &quot;SIM&quot;; alertaPiloto = 999;">freioEmergencia = "SIM"; alertaPiloto = 999;</option>
                                    <option value="freioEmergencia == true; alertaPiloto == &quot;FREIO&quot;;">freioEmergencia == true; alertaPiloto == "FREIO";</option>
                                    <option value="freioEmergencia = true; alertaPiloto = &quot;PERIGO: FREIO ACIONADO!&quot;;">freioEmergencia = true; alertaPiloto = "PERIGO: FREIO ACIONADO!";</option>
                                    <option value="freioEmergencia = &quot;true&quot;; alertaPiloto = &quot;PERIGO&quot;;">freioEmergencia = "true"; alertaPiloto = "PERIGO";</option>
                                    <option value="freioEmergencia = 0; alertaPiloto = &quot;&quot;;">freioEmergencia = 0; alertaPiloto = "";</option>
                                    <option value="stirng freioEmergencia = true;">stirng freioEmergencia = true;</option>
                                </select>
                            </div>

                            <div class="vars-scaffold-line">
                                } <span class="c-kw">else</span> { <span class="c-cm">// SENÃO (pista desimpedida):</span><br>
                                &nbsp;&nbsp;<span style="color:#94A3B8;">freioEmergencia = false; alertaPiloto = "PISTA LIVRE";</span><br>
                                }
                            </div>
                        </div>

                        <div class="vars-sketch-loop-close">}</div>
                    </div>

                    <!-- NÍVEL 8 (DESAFIO MAKER GERAL: MINI-IDE LIVRE EM C/C++) -->
                    <div id="vars_ide_n8" style="display:none;">
                        <!-- Atalhos Rápidos com Variáveis, FOR e IF/ELSE -->
                        <div class="vars-shortcuts-bar">
                            <button type="button" class="vars-shortcut-btn btn-int" onclick="vars_insertSnippet('bateria')">📦 int bateria = 100;</button>
                            <button type="button" class="vars-shortcut-btn btn-int" onclick="vars_insertSnippet('cristais')">💎 int cristais = 0;</button>
                            <button type="button" class="vars-shortcut-btn btn-float" onclick="vars_insertSnippet('velocidade')">📐 float velocidade = 4.5;</button>
                            <button type="button" class="vars-shortcut-btn btn-string" onclick="vars_insertSnippet('status')">🏷️ String status = "EXPLORANDO";</button>
                            <button type="button" class="vars-shortcut-btn btn-bool" onclick="vars_insertSnippet('escudo')">🛡️ bool escudo = true;</button>
                            <button type="button" class="vars-shortcut-btn" style="border-color:#A78BFA;color:#DDD6FE;" onclick="vars_insertSnippet('for_setores')">🔄 for (setor 1..4)</button>
                            <button type="button" class="vars-shortcut-btn" style="border-color:#34D399;color:#A7F3D0;" onclick="vars_insertSnippet('if_escudo')">🌱 if (escudo == true)</button>
                            <button type="button" class="vars-shortcut-btn" onclick="vars_insertSnippet('bateria_sub')">⚡ bateria = bateria - 10;</button>
                            <button type="button" class="vars-shortcut-btn" id="vars_btn_expand_ide" style="border-color:#38BDF8;color:#7DD3FC;margin-left:auto;" onclick="vars_toggleExpandIde()" title="Alternar modo tela cheia / expandir editor"><i class="fa-solid fa-expand" id="vars_expand_icon"></i> <span id="vars_expand_label">Expandir IDE</span></button>
                            <button type="button" class="vars-shortcut-btn clear" onclick="vars_clearIde()"><i class="fa-solid fa-trash"></i> Limpar Tudo</button>
                        </div>

                        <!-- Editor Textarea com Numeração de Linhas e Autocomplete Flutuante -->
                        <div class="vars-code-wrapper">
                            <div class="vars-line-numbers" id="vars_line_numbers">1<br>2<br>3<br>4<br>5<br>6<br>7<br>8<br>9<br>10<br>11<br>12</div>
                            <textarea class="vars-code-input" id="vars_code_input" spellcheck="false"
                                      placeholder="// 🚀 Grande Desafio Maker do Rover em Marte!&#10;// Combine Variáveis + Loop FOR + IF/ELSE:&#10;// int bateria = 100;&#10;// int cristais = 0;&#10;// float velocidade = 4.5;&#10;// String status = &quot;EXPLORANDO&quot;;&#10;// bool escudo = true;&#10;// for (int setor = 1; setor <= 4; setor++) {&#10;//     cristais = cristais + 5;&#10;//     bateria = bateria - 10;&#10;// }&#10;// if (escudo == true) { status = &quot;ROVER PROTEGIDO&quot;; }"
                                      oninput="vars_handleIdeInput(); vars_ideAutoComplete(this);"
                                      onkeydown="vars_handleIdeKeyDown(event, this);"
                                      onclick="vars_trackCursor()"
                                      onkeyup="vars_trackCursor()"
                                      onscroll="document.getElementById('vars_line_numbers').scrollTop = this.scrollTop;"></textarea>
                            <div class="vars-autocomplete-box" id="vars_autocomplete_list"></div>
                        </div>

                        <div style="background:#0F172A;border:1px dashed #38BDF8;border-radius:12px;padding:12px 16px;margin-top:12px;font-size:0.85rem;color:#CBD5E1;display:flex;flex-direction:column;gap:6px;line-height:1.6;">
                            <div><b>⚡ Super Poder do Programador (Autocompletar):</b> Digite comandos como <code>int</code>, <code>flo</code>, <code>for</code>, <code>if</code>, <code>bat</code> ou <code>esc</code> e aperte <b>Tab ⇥</b> ou <b>Enter ↵</b> para autocompletar na hora!</div>
                            <div style="font-size:0.80rem;color:#94A3B8;">
                                <b>Dica Maker:</b> Clique nos botões coloridos no topo para escrever blocos prontos ou clique em <b>Expandir IDE</b> para ter uma tela gigante de programação!
                            </div>
                        </div>
                    </div>

                    <!-- Botão de Solução (Liberado após 3 erros) -->
                    <button type="button" class="vars-btn-solution" id="vars_btn_solution" onclick="vars_toggleSolution()" disabled>
                        <i class="fa-solid fa-lightbulb"></i> <span>💡 Precisa de Ajuda? Ver Resolução C/C++</span>
                    </button>
                    <div class="vars-solution-card" id="vars_solution_box">
                        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;flex-wrap:wrap;gap:6px;">
                            <span style="font-weight:900;color:#FBBF24;font-size:0.88rem;"><i class="fa-solid fa-lightbulb"></i> 📋 Resolução Recomendada em C/C++:</span>
                            <button type="button" onclick="vars_applyCurrentSolution()" style="background:linear-gradient(135deg,#10B981,#059669);color:white;border:none;padding:5px 12px;border-radius:8px;font-weight:900;font-size:0.78rem;cursor:pointer;display:inline-flex;align-items:center;gap:4px;box-shadow:0 3px 10px rgba(16,185,129,0.3);"><i class="fa-solid fa-wand-magic-sparkles"></i> ✨ Preencher no Exercício</button>
                        </div>
                        <pre id="vars_solution_text" style="margin:0;background:#030712;padding:12px;border-radius:10px;border:1px solid #F59E0B;color:#FDE68A;font-family:'Fira Code',monospace;font-size:0.84rem;white-space:pre-wrap;line-height:1.55;"></pre>
                    </div>

                    <!-- Botões de Execução -->
                    <div class="vars-actions">
                        <button class="vars-btn-run" id="vars_btn_run" onclick="vars_runSimulation()"><i class="fa-solid fa-play"></i> EXECUTAR NA MEMÓRIA RAM</button>
                        <button class="vars-btn-reset" onclick="vars_resetScene()"><i class="fa-solid fa-rotate-left"></i></button>
                    </div>
                </div>

                <!-- PAINEL CÓDIGO ARDUINO C++ REAL -->
                <div class="arduino-code-panel" style="background:#090D16;border:2px solid #38BDF8;border-radius:20px;padding:16px;box-shadow:0 10px 25px rgba(0,0,0,0.5);">
                    <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #1E293B;padding-bottom:10px;margin-bottom:12px;">
                        <span style="font-weight:900;color:#38BDF8;font-size:0.95rem;"><i class="fa-solid fa-microchip"></i> Código Arduino C++ (Tempo Real)</span>
                        <button onclick="vars_copyCode()" style="background:#334155;color:#38BDF8;border:1px solid #38BDF8;padding:5px 12px;border-radius:8px;font-size:0.8rem;font-weight:800;cursor:pointer;"><i class="fa-regular fa-copy"></i> Copiar C++</button>
                    </div>
                    <pre id="vars_arduino_code" style="margin:0;color:#E2E8F0;font-family:'Fira Code', monospace;font-size:0.82rem;line-height:1.45;white-space:pre-wrap;overflow-x:auto;max-height:360px;"></pre>
                </div>
            </div>
        </div>

        <!-- MODAL DE VITÓRIA / PROGRESSÃO -->
        <div class="vars-modal" id="vars_win_modal">
            <div class="vars-modal-box">
                <div class="vars-modal-icon" id="vars_modal_icon">🏆</div>
                <h2 class="vars-modal-title" id="vars_modal_title">Excelente Programador!</h2>
                <p class="vars-modal-text" id="vars_modal_text">Você dominou o uso de variáveis e tipos de dados com perfeição!</p>
                <button class="vars-btn-modal" onclick="vars_closeWinModal()">Avançar para o Próximo Nível 🚀</button>
            </div>
        </div>
    `;

    vars_init();
    document.getElementById('variaveis-loaded')?.remove();
    const flag = document.createElement('div'); flag.id = 'variaveis-loaded'; flag.style.display = 'none'; container.appendChild(flag);
}

/* ==========================================================================
   ESTADO E DADOS DOS NÍVEIS
   ========================================================================== */

let vars_level = 1;
let vars_guide_slide = 1;
let vars_running = false;
let vars_errors_count = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0 };

const vars_levels_data = {
    1: {
        title: 'Missão 1: O Contador de Vidas & Moedas do Robô (Tipo int)',
        badge: 'Números Inteiros (int)',
        desc: 'Bem-vindo ao Laboratório de Variáveis! 🧮<br>O Robô Maker está explorando a mina digital. Ele começa com 3 vidas e 0 moedas declaradas na memória RAM.<br><br><b>🎯 Seus Objetivos de Programação:</b><ul style="margin:6px 0 6px 18px;padding:0;line-height:1.6;"><li>1️⃣ Ao abrir o Baú Dourado, <b>acumule +10 moedas</b> ao total da sua caixa de moedas.</li><li>2️⃣ Ao tropeçar no espinho da caverna, <b>desconte 1 vida</b> do jogador.</li><li>3️⃣ No fim da fase, cada moeda coletada vale 100 pontos: calcule a pontuação multiplicando o total de moedas por 100.</li></ul>Fique atento com as pegadinhas nos seletores: números inteiros não levam aspas e acumuladores somam com o valor anterior!',
        solution: `// Solução Nível 1 (Arduino C++):
int vidas = 3;
int moedas = 0;
int pontos = 0;

void loop() {
  moedas = moedas + 10; // Coleta o baú (+10)
  vidas = vidas - 1;    // Espinho (-1 vida)
  pontos = moedas * 100; // 1000 pontos!
}`
    },
    2: {
        title: 'Missão 2: A Estação Meteorológica & Termômetro (Tipo float)',
        badge: 'Casas Decimais (float)',
        desc: 'A estufa inteligente da escola precisa registrar temperaturas com precisão de casas decimais! 🌡️<br>O tipo <code>int</code> só guarda números redondos, mas para medições como <b>20.5 °C</b> e <b>31.5 °C</b> precisamos de um tipo com ponto flutuante.<br><br><b>🎯 Seus Objetivos de Programação:</b><ul style="margin:6px 0 6px 18px;padding:0;line-height:1.6;"><li>1️⃣ Escolha o tipo de dado correto da linguagem C++ para armazenar números com casas decimais.</li><li>2️⃣ Calcule a temperatura média aritmética do dia somando a leitura da manhã com a da tarde e dividindo o total por 2.</li><li>3️⃣ Observe a coluna de mercúrio subir no termômetro e o display LCD registrar a média calculada!</li></ul>Atenção à ordem das operações matemáticas e ao uso de parênteses!',
        solution: `// Solução Nível 2 (Arduino C++):
float tempManha = 20.5;
float tempTarde = 31.5;
float tempMedia = 0.0;

void loop() {
  tempMedia = (tempManha + tempTarde) / 2.0; // 26.0 °C
  lcd_imprimir(tempMedia);
}`
    },
    3: {
        title: 'Missão 3: O Cofre Secreto do Laboratório (String & bool)',
        badge: 'Textos & Trava Lógica',
        desc: 'O cofre que guarda os microcontroladores de ouro possui uma trava de segurança eletrônica! 🔐<br>Ele utiliza dois tipos fundamentais de variáveis: um para textos/palavras e outro para estados lógicos de verdadeiro ou falso.<br><br><b>🎯 Seus Objetivos de Programação:</b><ul style="margin:6px 0 6px 18px;padding:0;line-height:1.6;"><li>1️⃣ Selecione o tipo de dado C++ específico para guardar frases e palavras entre aspas.</li><li>2️⃣ Digite a senha mestre de acesso <code>ARDUINO2026</code> no teclado numérico.</li><li>3️⃣ Se a senha digitada bater com a senha mestre, altere a trava booleana para destrancada (verdadeiro).</li></ul>Cuidado: variáveis booleanas só aceitam true ou false sem aspas!',
        solution: `// Solução Nível 3 (Arduino C++):
String senhaMestre = "ARDUINO2026";
String senhaDigitada = "ARDUINO2026";
bool travaAberta = false;

void loop() {
  if (senhaDigitada == senhaMestre) {
    travaAberta = true; // Cofre destravado!
  }
}`
    },
    4: {
        title: 'Missão 4: Revisão de Loops 1 — O Acumulador de Energia Solar (Variáveis + FOR 🔄🔋)',
        badge: 'Laço FOR + Variáveis',
        desc: 'Hora de revisar os <b>Loops FOR da Aula 2</b> agora integrados com Variáveis! 🔄<br>O robô chegou à esteira de recarga solar com a bateria zerada (0%). A esteira possui 4 estações fotovoltaicas consecutivas.<br><br><b>🎯 Seus Objetivos de Programação:</b><ul style="margin:6px 0 6px 18px;padding:0;line-height:1.6;"><li>1️⃣ Configure a condição de parada do laço <code>for</code> para executar exatamente as 4 voltas na esteira.</li><li>2️⃣ Dentro do laço, programe o acumulador para somar +25% de carga à bateria a cada volta percorrida.</li><li>3️⃣ Veja o robô avançar pelas estações e a barra de bateria subir de 0% até 100%!</li></ul>Atenção: variáveis acumuladoras somam o valor antigo com o novo ganho!',
        solution: `// Solução Nível 4 (Arduino C++):
int energia = 0;

void loop() {
  for (int ciclo = 1; ciclo <= 4; ciclo++) {
    energia = energia + 25; // 25, 50, 75, 100%!
  }
}`
    },
    5: {
        title: 'Missão 5: Revisão de Loops 2 — Mineração Marciana de Cristais (Variáveis + FOR 💎🪐)',
        badge: 'FOR Acumulador + Salto',
        desc: 'Vamos aprofundar os <b>Loops FOR com Variáveis</b> na exploração de Marte! 💎<br>O Rover precisa minerar plasma nos 4 setores do planeta vermelho com seu raio extrator.<br><br><b>🎯 Seus Objetivos de Programação:</b><ul style="margin:6px 0 6px 18px;padding:0;line-height:1.6;"><li>1️⃣ Configure a condição do laço <code>for</code> para minerar ordenadamente do setor 1 até o setor 4.</li><li>2️⃣ A cada setor minerado, acumule +5 cristais de plasma na mochila do robô.</li><li>3️⃣ O raio extrator gasta energia: desconte 10% de bateria a cada setor percorrido.</li></ul>Cuidado com operadores invertidos e pegadinhas com textos entre aspas!',
        solution: `// Solução Nível 5 (Arduino C++):
int cristais = 0;
int bateria = 100;

void loop() {
  for (int setor = 1; setor <= 4; setor++) {
    cristais = cristais + 5; // 5, 10, 15, 20 cristais!
    bateria = bateria - 10;  // 90, 80, 70, 60%!
  }
}`
    },
    6: {
        title: 'Missão 6: Revisão de Decisões 1 — O Climatizador da Estufa (Variáveis + IF / ELSE 🌱🌡️)',
        badge: 'IF / ELSE + Variáveis',
        desc: 'Hora de revisar as <b>Decisões IF / ELSE da Aula 3</b> controladas por Variáveis! 🧠<br>Na estufa inteligente, o sensor registrou calor elevado (34.5 °C), enquanto o limite térmico seguro é de 30.0 °C.<br><br><b>🎯 Seus Objetivos de Programação:</b><ul style="margin:6px 0 6px 18px;padding:0;line-height:1.6;"><li>1️⃣ Monte a expressão condicional no <code>if</code>: teste se a temperatura medida ultrapassa a temperatura limite permitida.</li><li>2️⃣ Se o teste for verdadeiro, acione o ventilador e atualize o texto de status com aviso de alerta para a equipe.</li><li>3️⃣ Observe as hélices mecânicas girarem em alta velocidade para refrigerar a estufa!</li></ul>Cuidado com o operador de igualdade ou aspas em lugares indevidos!',
        solution: `// Solução Nível 6 (Arduino C++):
float temperatura = 34.5;
float tempLimite = 30.0;
bool ventiladorLigado = false;
String statusClima = "NORMAL";

void loop() {
  if (temperatura > tempLimite) {
    ventiladorLigado = true;
    statusClima = "ALERTA: VENTILADOR LIGADO";
  } else {
    ventiladorLigado = false;
    statusClima = "CLIMA AGRADAVEL";
  }
}`
    },
    7: {
        title: 'Missão 7: Revisão de Decisões 2 — Radar Ultrassônico & Frenagem Autônoma (Variáveis + IF / ELSE 🚨🚗)',
        badge: 'Sensor de Distância + IF/ELSE',
        desc: 'O veículo robótico está em movimento e se aproxima de um obstáculo na pista! 🚨<br>O sensor ultrassônico mediu uma distância de 14.5 cm, mas a margem de segurança exige pelo menos 20.0 cm.<br><br><b>🎯 Seus Objetivos de Programação:</b><ul style="margin:6px 0 6px 18px;padding:0;line-height:1.6;"><li>1️⃣ Monte o teste de segurança no <code>if</code>: verifique se a distância atual até o obstáculo é menor que a distância segura exigida.</li><li>2️⃣ Em caso de perigo de colisão, ative o freio de emergência (verdadeiro) e atualize o alerta do painel.</li><li>3️⃣ Veja o feixe sonar piscar e os freios ABS travarem o carro antes do impacto!</li></ul>Evite as pegadinhas com tipos de dados trocados!',
        solution: `// Solução Nível 7 (Arduino C++):
float distanciaObstaculo = 14.5;
float distanciaSegura = 20.0;
bool freioEmergencia = false;
String alertaPiloto = "PISTA LIVRE";

void loop() {
  if (distanciaObstaculo < distanciaSegura) {
    freioEmergencia = true;
    alertaPiloto = "PERIGO: FREIO ACIONADO!";
  } else {
    freioEmergencia = false;
    alertaPiloto = "PISTA LIVRE";
  }
}`
    },
    8: {
        title: 'Missão 8: O Grande Desafio Maker — Rover Marciano (Mini-IDE Livre 🚀🏆)',
        badge: 'Variáveis + FOR + IF/ELSE',
        desc: 'O grande teste final unindo <b>Variáveis, Laço FOR e Decisões IF/ELSE</b>! 🪐🤖<br>O Rover Curiosity está explorando Marte e precisa do seu firmware completo!<br><br><b>O que seu programa precisa conter:</b><ul style="margin:6px 0 6px 18px;padding:0;line-height:1.6;"><li>📦 Variáveis de estado (bateria, cristais minerados, escudo).</li><li>🔄 Um laço <code>for</code> percorrendo os 4 quadrantes: <code>for (int setor = 1; setor <= 4; setor++)</code> acumulando cristais!</li><li>🌱 Uma verificação <code>if (escudo == true)</code> para manter o Rover protegido.</li></ul>Use os atalhos rápidos ou digite no teclado com autocompletar via <b>Tab ⇥</b>!',
        solution: `// Solução Nível 8 (Desafio Geral Maker):
int bateria = 100;
int cristais = 0;
float velocidade = 4.5;
String status = "EXPLORANDO";
bool escudo = true;

void loop() {
  for (int setor = 1; setor <= 4; setor++) {
    cristais = cristais + 5;
    bateria = bateria - 10;
  }
  if (escudo == true) {
    status = "ROVER PROTEGIDO";
  }
}`
    }
};

function vars_init() {
    vars_updateLevelButtons();
    vars_switchLevel(1);
    vars_resetScene();
    vars_updateLiveCpp();
}

/* ================= GUIA TEÓRICO / SLIDES ================= */

function vars_toggleGuide() {
    const card = document.getElementById('vars_guide_card');
    const txt = document.getElementById('vars_guide_toggle_txt');
    if (!card) return;
    const isHidden = card.style.display === 'none';
    card.style.display = isHidden ? 'block' : 'none';
    if (txt) txt.innerText = isHidden ? 'Ocultar Guia Teórico' : 'Mostrar Guia Teórico';
}

function vars_switchGuideTab(slideNum) {
    vars_guide_slide = slideNum;
    for (let i = 1; i <= 5; i++) {
        document.getElementById(`vars_slide_${i}`)?.classList.toggle('active', i === slideNum);
        document.getElementById(`vars_tab_g${i}`)?.classList.toggle('active', i === slideNum);
        document.getElementById(`vars_dot_${i}`)?.classList.toggle('active', i === slideNum);
    }
}

function vars_nextGuideSlide() {
    if (vars_guide_slide < 5) vars_switchGuideTab(vars_guide_slide + 1);
    else vars_switchGuideTab(1);
}

function vars_prevGuideSlide() {
    if (vars_guide_slide > 1) vars_switchGuideTab(vars_guide_slide - 1);
    else vars_switchGuideTab(5);
}

/* ================= NAVEGAÇÃO DE NÍVEIS ================= */

function vars_switchLevel(lvl) {
    if (vars_running) return;
    vars_level = lvl;

    if (window.makerLeaderboard) {
        window.makerLeaderboard.startTimer('variaveis', lvl);
    }

    for (let i = 1; i <= 8; i++) {
        document.getElementById(`vars_btn_lvl_${i}`)?.classList.toggle('active', i === lvl);
    }

    const scafN1 = document.getElementById('vars_scaffold_n1');
    const scafN2 = document.getElementById('vars_scaffold_n2');
    const scafN3 = document.getElementById('vars_scaffold_n3');
    const scafN4 = document.getElementById('vars_scaffold_n4');
    const scafN5 = document.getElementById('vars_scaffold_n5');
    const scafN6 = document.getElementById('vars_scaffold_n6');
    const scafN7 = document.getElementById('vars_scaffold_n7');
    const ideN8 = document.getElementById('vars_ide_n8');

    if (scafN1) scafN1.style.display = lvl === 1 ? 'block' : 'none';
    if (scafN2) scafN2.style.display = lvl === 2 ? 'block' : 'none';
    if (scafN3) scafN3.style.display = lvl === 3 ? 'block' : 'none';
    if (scafN4) scafN4.style.display = lvl === 4 ? 'block' : 'none';
    if (scafN5) scafN5.style.display = lvl === 5 ? 'block' : 'none';
    if (scafN6) scafN6.style.display = lvl === 6 ? 'block' : 'none';
    if (scafN7) scafN7.style.display = lvl === 7 ? 'block' : 'none';
    if (ideN8) ideN8.style.display = lvl === 8 ? 'block' : 'none';

    const data = vars_levels_data[lvl];
    if (data) {
        const t = document.getElementById('vars_story_title');
        const b = document.getElementById('vars_story_badge');
        const d = document.getElementById('vars_story_desc');
        const solT = document.getElementById('vars_solution_text');
        if (t) t.innerText = `🎯 ${data.title}`;
        if (b) b.innerText = data.badge;
        if (d) d.innerHTML = data.desc;
        if (solT) solT.innerText = data.solution;
    }

    vars_updateSolutionButtonState();

    if (lvl === 8) {
        vars_handleIdeInput();
    } else {
        vars_updateLiveCpp();
    }

    vars_resetScene();
}

function vars_updateLevelButtons() {
    const saved = getLevels('variaveis_levels');
    for (let i = 1; i <= 8; i++) {
        const btn = document.getElementById(`vars_btn_lvl_${i}`);
        const stat = document.getElementById(`vars_lvl_stat_${i}`);
        if (!btn || !stat) continue;
        const isDone = saved.includes(i);
        btn.classList.toggle('done', isDone);
        if (isDone) {
            stat.innerText = '⭐';
            stat.style.color = '#F59E0B';
        } else {
            stat.innerText = i === 1 || saved.includes(i - 1) ? '⚪' : '🔒';
            stat.style.color = '#475569';
        }
    }
}

/* ================= RENDERIZADOR DA BANCADA DE MEMÓRIA RAM ================= */

function vars_showToast(text, color = '#FBBF24', left = '50%', top = '25%') {
    const arena = document.getElementById('vars_arena_box');
    if (!arena) return;
    const t = document.createElement('div');
    t.className = 'vars-pop-toast';
    t.style.color = color;
    t.style.left = typeof left === 'number' ? `${left}px` : left;
    t.style.top = typeof top === 'number' ? `${top}px` : top;
    t.innerHTML = text;
    arena.appendChild(t);
    setTimeout(() => t.remove(), 1300);
}

function vars_spawnCoinParticles(x, y) {
    const arena = document.getElementById('vars_arena_box');
    if (!arena) return;
    const offsets = [
        { dx: -25, dy: -45, tx: -40, ty: -20 },
        { dx: 15, dy: -55, tx: -15, ty: -25 },
        { dx: -10, dy: -60, tx: -30, ty: -10 }
    ];
    offsets.forEach((off, i) => {
        setTimeout(() => {
            const p = document.createElement('div');
            p.className = 'vars-coin-particle';
            p.style.setProperty('--dx', `${off.dx}px`);
            p.style.setProperty('--dy', `${off.dy}px`);
            p.style.setProperty('--tx', `${off.tx}px`);
            p.style.setProperty('--ty', `${off.ty}px`);
            p.style.left = `${x}px`;
            p.style.top = `${y}px`;
            p.innerText = '🪙';
            arena.appendChild(p);
            setTimeout(() => p.remove(), 900);
        }, i * 100);
    });
}

function vars_spawnDamageEffect(x, y) {
    const arena = document.getElementById('vars_arena_box');
    if (!arena) return;
    arena.classList.add('vars-arena-shake');
    setTimeout(() => arena.classList.remove('vars-arena-shake'), 450);

    const h = document.createElement('div');
    h.className = 'vars-heart-loss';
    h.style.left = `${x}px`;
    h.style.top = `${y}px`;
    h.innerText = '💔';
    arena.appendChild(h);
    setTimeout(() => h.remove(), 950);

    const s = document.createElement('div');
    s.className = 'vars-smoke-puff';
    s.style.left = `${x - 10}px`;
    s.style.top = `${y + 10}px`;
    s.innerText = '💥';
    arena.appendChild(s);
    setTimeout(() => s.remove(), 900);
}

function vars_spawnCrystalParticles(x, y) {
    const arena = document.getElementById('vars_arena_box');
    if (!arena) return;
    for (let i = 0; i < 2; i++) {
        setTimeout(() => {
            const p = document.createElement('div');
            p.className = 'vars-crystal-particle';
            p.style.left = `${x}px`;
            p.style.top = `${y}px`;
            p.innerText = '💎';
            arena.appendChild(p);
            setTimeout(() => p.remove(), 900);
        }, i * 150);
    }
}

function vars_spawnSmokePuff(x, y) {
    const arena = document.getElementById('vars_arena_box');
    if (!arena) return;
    const s = document.createElement('div');
    s.className = 'vars-smoke-puff';
    s.style.left = `${x}px`;
    s.style.top = `${y}px`;
    s.innerText = '💨';
    arena.appendChild(s);
    setTimeout(() => s.remove(), 900);
}

function vars_spawnSparks(x, y) {
    const arena = document.getElementById('vars_arena_box');
    if (!arena) return;
    const sp = document.createElement('div');
    sp.className = 'vars-sparkle-burst';
    sp.style.left = `${x}px`;
    sp.style.top = `${y}px`;
    sp.innerText = '⚡';
    arena.appendChild(sp);
    setTimeout(() => sp.remove(), 800);
}

function vars_renderRamBoxes(boxes) {
    const container = document.getElementById('vars_ram_boxes');
    if (!container) return;

    let html = '';
    boxes.forEach((b) => {
        let typeColor = '#FBBF24';
        let typeBg = 'rgba(251,191,36,0.15)';
        if (b.type === 'float') { typeColor = '#38BDF8'; typeBg = 'rgba(56,189,248,0.15)'; }
        if (b.type === 'String') { typeColor = '#F472B6'; typeBg = 'rgba(236,72,153,0.15)'; }
        if (b.type === 'bool') { typeColor = '#34D399'; typeBg = 'rgba(16,185,129,0.15)'; }

        html += `
            <div class="vars-box ${b.updated ? 'updated' : ''}" id="ram_${b.name}">
                <div class="vars-box-addr">${b.addr}</div>
                <div class="vars-box-type" style="color:${typeColor};background:${typeBg};">${b.type}</div>
                <div class="vars-box-name">${b.name}</div>
                <div class="vars-box-val-wrap">
                    <span class="vars-box-val" style="color:${typeColor};">${b.val}</span>
                </div>
            </div>
        `;
    });
    container.innerHTML = html;
}

/* ================= CENÁRIOS INTERATIVOS ================= */

function vars_renderArena(lvl, state = {}) {
    const arena = document.getElementById('vars_arena_box');
    if (!arena) return;

    if (lvl === 1) {
        // NÍVEL 1: ROBÔ NA CAVERNA DE MOEDAS E ESPINHOS
        const step = state.step || 0; // 0=inicio, 1=bau, 2=espinho, 3=fim
        const posX = step === 0 ? 30 : step === 1 ? 190 : step === 2 ? 350 : 490;
        const robotClass = state.robotClass || (step > 0 ? 'vars-robot-walking' : '');
        const robotEmoji = state.robotEmoji || (step === 2 && state.hurt ? '😵' : step === 3 ? '🥳' : step === 1 ? '😃' : '🤖');
        const bauAberto = step >= 1 && (state.moedas !== undefined ? state.moedas > 0 : true);
        const espinhoAtivo = step === 2;

        arena.innerHTML = `
            <div style="width:100%;display:flex;flex-direction:column;align-items:center;gap:12px;">
                <div style="display:flex;gap:20px;font-weight:900;font-size:0.95rem;background:#0F172A;padding:6px 18px;border-radius:20px;border:1px solid #334155;box-shadow:0 4px 15px rgba(0,0,0,0.5);">
                    <span style="color:#EF4444;">❤️ Vidas: <b id="hud_vidas">${state.vidas !== undefined ? state.vidas : 3}</b></span>
                    <span style="color:#FBBF24;">🪙 Moedas: <b id="hud_moedas">${state.moedas !== undefined ? state.moedas : 0}</b></span>
                    <span style="color:#38BDF8;">⭐ Pontos: <b id="hud_pontos">${state.pontos !== undefined ? state.pontos : 0}</b></span>
                </div>
                <div class="vars-robot-track" style="background:radial-gradient(ellipse at 50% 50%, #1E293B 0%, #0F172A 100%);border:2px solid #334155;">
                    <div class="vars-robot-actor ${robotClass}" id="robot_actor_n1" style="left:${posX}px;">
                        <span style="font-size:2.2rem;filter:drop-shadow(0 6px 10px rgba(0,0,0,0.7));">${robotEmoji}</span>
                        ${state.speech ? `<div style="position:absolute;top:-30px;left:50%;transform:translateX(-50%);background:#0F172A;color:#FBBF24;font-size:0.75rem;padding:3px 10px;border-radius:10px;border:1px solid #F59E0B;white-space:nowrap;font-weight:900;box-shadow:0 4px 12px rgba(0,0,0,0.8);">${state.speech}</div>` : ''}
                    </div>
                    <div class="vars-node-spot ${step >= 0 ? 'active' : ''}" title="Início">🏁</div>
                    <div class="vars-node-spot ${step >= 1 ? 'active vars-chest-glow' : ''}" id="spot_bau" style="${bauAberto ? 'border-color:#F59E0B;box-shadow:0 0 18px #F59E0B;' : ''}" title="Baú Dourado (+10 Moedas)">
                        ${bauAberto ? '🎁' : '📦'}
                        ${bauAberto ? '<div class="vars-sparkle-burst" style="left:14px;top:-10px;">✨</div>' : ''}
                    </div>
                    <div class="vars-node-spot ${step >= 2 ? 'active' : ''}" style="${espinhoAtivo ? 'border-color:#EF4444;box-shadow:0 0 20px #EF4444;animation:pulseGlow 0.4s infinite alternate;' : ''}" title="Armadilha de Espinho (-1 Vida)">
                        🌵
                        ${espinhoAtivo ? '<div style="position:absolute;top:-12px;font-size:0.9rem;color:#EF4444;">⚡</div>' : ''}
                    </div>
                    <div class="vars-node-spot ${step >= 3 ? 'active vars-portal-vortex' : ''}" style="${step >= 3 ? 'border-color:#38BDF8;box-shadow:0 0 25px #38BDF8;' : ''}" title="Portal de Saída">🏆</div>
                </div>
            </div>
        `;
    } else if (lvl === 2) {
        // NÍVEL 2: ESTAÇÃO METEOROLÓGICA & TERMÔMETRO DIGITAL
        const temp = state.tempMedia !== undefined ? state.tempMedia : 0.0;
        const mercuryHeight = temp > 0 ? Math.min(100, Math.max(15, (temp / 40) * 100)) : 15;
        const robotSpeech = state.speech || (temp > 0 ? `MED: ${temp.toFixed(1)}°C [CALIBRADO]` : 'Aguardando medições...');
        const reading = state.reading || 'idle'; // 'manha', 'tarde', 'done'

        arena.innerHTML = `
            <div class="vars-weather-bench">
                <!-- Zona 1: Manhã -->
                <div style="display:flex;flex-direction:column;align-items:center;background:${reading === 'manha' ? 'rgba(56,189,248,0.2)' : '#0F172A'};padding:8px 12px;border-radius:14px;border:1px solid ${reading === 'manha' ? '#38BDF8' : '#334155'};transition:all 0.3s;">
                    <div style="font-size:2rem;">🌅</div>
                    <span style="font-size:0.75rem;font-weight:900;color:#38BDF8;">Manhã: 20.5°C</span>
                </div>

                <!-- Robô Meteorologista com Sensor -->
                <div style="display:flex;flex-direction:column;align-items:center;gap:4px;position:relative;">
                    <div style="font-size:3.2rem;filter:drop-shadow(0 6px 10px rgba(0,0,0,0.6));">🤖</div>
                    <span style="font-size:0.75rem;color:#7DD3FC;font-weight:800;background:#0F172A;padding:2px 8px;border-radius:8px;border:1px solid #38BDF8;">Sensor DHT11</span>
                    ${state.speech ? `<div style="position:absolute;top:-28px;background:#0F172A;color:#38BDF8;font-size:0.72rem;padding:3px 8px;border-radius:8px;border:1px solid #38BDF8;white-space:nowrap;font-weight:900;">${state.speech}</div>` : ''}
                </div>

                <!-- Termômetro de Mercúrio com Escala -->
                <div class="vars-thermo-wrap">
                    <div class="vars-thermo-glass">
                        <div class="vars-thermo-mercury" style="height:${mercuryHeight}%;"></div>
                    </div>
                    <div>
                        <div style="font-size:0.75rem;color:#94A3B8;font-weight:900;">TERMÔMETRO</div>
                        <div style="font-family:'Fira Code';font-size:1.35rem;font-weight:900;color:#FBBF24;">${temp > 0 ? temp.toFixed(1) : '--.-'} °C</div>
                        <div style="font-size:0.72rem;color:#38BDF8;">float preciso (ponto decimal)</div>
                    </div>
                </div>

                <!-- Zona 2: Tarde -->
                <div style="display:flex;flex-direction:column;align-items:center;background:${reading === 'tarde' ? 'rgba(245,158,11,0.2)' : '#0F172A'};padding:8px 12px;border-radius:14px;border:1px solid ${reading === 'tarde' ? '#F59E0B' : '#334155'};transition:all 0.3s;">
                    <div style="font-size:2rem;">☀️🔥</div>
                    <span style="font-size:0.75rem;font-weight:900;color:#FBBF24;">Tarde: 31.5°C</span>
                </div>

                <!-- Display LCD 16x2 Arduino -->
                <div class="vars-lcd" style="width:100%;max-width:520px;margin-top:6px;">
                    <div class="vars-lcd-line">ESTACAO ARDUINO v1</div>
                    <div class="vars-lcd-line" id="vars_lcd_line2">${state.lcdText || (temp > 0 ? `MED: ${temp.toFixed(1)}C [OK]` : 'AGUARDANDO DADOS...')}</div>
                </div>
            </div>
        `;
    } else if (lvl === 3) {
        // NÍVEL 3: COFRE ELETRÔNICO
        const aberto = state.travaAberta === true;
        arena.innerHTML = `
            <div style="display:flex;align-items:center;justify-content:center;gap:20px;width:100%;max-width:560px;">
                <!-- Robô Hacker Maker -->
                <div style="display:flex;flex-direction:column;align-items:center;gap:4px;position:relative;">
                    <div style="font-size:3.2rem;filter:drop-shadow(0 6px 10px rgba(0,0,0,0.6));">${aberto ? '🥳' : '🤖'}</div>
                    <span style="font-size:0.75rem;color:#34D399;font-weight:800;background:#0F172A;padding:2px 8px;border-radius:8px;border:1px solid #10B981;">Teclado Matrix 4x4</span>
                    ${state.speech ? `<div style="position:absolute;top:-28px;background:#0F172A;color:#34D399;font-size:0.72rem;padding:3px 8px;border-radius:8px;border:1px solid #10B981;white-space:nowrap;font-weight:900;">${state.speech}</div>` : ''}
                </div>

                <div class="vars-vault-box" style="flex:1;">
                    <div class="vars-vault-leds">
                        <div class="vars-vault-led red ${aberto ? '' : 'on'}" title="Trancado (bool travaAberta = false)"></div>
                        <div class="vars-vault-led green ${aberto ? 'on' : ''}" title="Destravado (bool travaAberta = true)"></div>
                    </div>
                    <div class="vars-vault-wheel ${aberto ? 'unlocked' : ''}">
                        ${aberto ? '🔓' : '🔒'}
                    </div>
                    <div style="font-family:'Fira Code';font-size:0.86rem;background:#030712;padding:6px 14px;border-radius:10px;border:1px solid ${aberto ? '#10B981' : '#475569'};color:${aberto ? '#34D399' : '#CBD5E1'};margin-top:6px;width:100%;text-align:center;">
                        ${aberto ? '✨ COFRE ABERTO! 🏅 Placas de Ouro ✨' : (state.typedPass ? `DIGITANDO: ${state.typedPass}` : 'TRAVA DE SEGURANÇA ATIVA')}
                    </div>
                </div>
            </div>
        `;
    } else if (lvl === 4) {
        // NÍVEL 4: ESTEIRA SOLAR DE RECARGA (LOOP FOR)
        const ciclo = state.ciclo || 0;
        const energia = state.energia !== undefined ? state.energia : 0;
        const posX = ciclo === 0 ? 30 : ciclo === 1 ? 150 : ciclo === 2 ? 270 : ciclo === 3 ? 390 : 500;
        arena.innerHTML = `
            <div style="width:100%;display:flex;flex-direction:column;align-items:center;gap:12px;">
                <div style="display:flex;justify-content:space-between;width:100%;max-width:540px;background:#0F172A;padding:8px 16px;border-radius:14px;border:1px solid #334155;font-size:0.88rem;font-weight:900;">
                    <span style="color:#A78BFA;">🔄 Ciclo do FOR: <b id="hud_ciclo">${ciclo} / 4</b></span>
                    <span style="color:#FBBF24;">🔋 Bateria: <b id="hud_energia">${energia}%</b></span>
                    <span style="color:#34D399;">☀️ Geradores: Ativos</span>
                </div>
                <div style="width:100%;max-width:540px;background:#1E293B;height:16px;border-radius:10px;overflow:hidden;border:1px solid #334155;">
                    <div style="background:linear-gradient(90deg,#F59E0B,#10B981);height:100%;width:${energia}%;transition:width 0.4s ease;border-radius:8px;"></div>
                </div>
                <div class="vars-robot-track vars-conveyor-belt ${ciclo > 0 ? 'vars-conveyor-moving' : ''}" style="max-width:540px;position:relative;">
                    <div class="vars-robot-actor ${ciclo > 0 ? 'vars-robot-walking' : ''}" style="left:${posX}px;">
                        <span style="font-size:2.2rem;">🤖</span>
                        ${ciclo > 0 ? '<div style="position:absolute;top:-15px;right:-10px;font-size:1rem;color:#FBBF24;animation:pulseGlow 0.4s infinite alternate;">⚡</div>' : ''}
                        ${energia >= 100 ? '<div style="position:absolute;bottom:-18px;font-size:1.1rem;">🚀🔥</div>' : ''}
                    </div>
                    ${ciclo > 0 && ciclo <= 4 ? `<div class="vars-solar-beam" style="left:${posX + 24}px;top:0;height:45px;"></div>` : ''}
                    <div class="vars-node-spot ${ciclo >= 1 ? 'active' : ''}" style="${ciclo === 1 ? 'border-color:#F59E0B;box-shadow:0 0 18px #F59E0B;' : ''}" title="Gerador Solar 1 (+25%)">☀️1</div>
                    <div class="vars-node-spot ${ciclo >= 2 ? 'active' : ''}" style="${ciclo === 2 ? 'border-color:#F59E0B;box-shadow:0 0 18px #F59E0B;' : ''}" title="Gerador Solar 2 (+25%)">☀️2</div>
                    <div class="vars-node-spot ${ciclo >= 3 ? 'active' : ''}" style="${ciclo === 3 ? 'border-color:#F59E0B;box-shadow:0 0 18px #F59E0B;' : ''}" title="Gerador Solar 3 (+25%)">☀️3</div>
                    <div class="vars-node-spot ${ciclo >= 4 ? 'active' : ''}" style="${ciclo >= 4 ? 'border-color:#10B981;box-shadow:0 0 25px #10B981;' : ''}" title="Gerador Solar 4 (+25%)">☀️4</div>
                </div>
            </div>
        `;
    } else if (lvl === 5) {
        // NÍVEL 5: MINERAÇÃO MARCIANA DE CRISTAIS (LOOP FOR ACUMULADOR COM SALTO)
        const setor = state.setor || 0;
        const cristais = state.cristais !== undefined ? state.cristais : 0;
        const bat = state.bateria !== undefined ? state.bateria : 100;
        const posX = setor === 0 ? 30 : setor === 1 ? 150 : setor === 2 ? 270 : setor === 3 ? 390 : 500;
        arena.innerHTML = `
            <div style="width:100%;display:flex;flex-direction:column;align-items:center;gap:12px;">
                <div style="display:flex;justify-content:space-between;width:100%;max-width:540px;background:#0F172A;padding:8px 16px;border-radius:14px;border:1px solid #334155;font-size:0.88rem;font-weight:900;">
                    <span style="color:#A78BFA;">🪐 Setor FOR: <b id="hud_setor">${setor} / 4</b></span>
                    <span style="color:#38BDF8;">💎 Mochila: <b id="hud_cristais">${cristais} / 20 cristais</b></span>
                    <span style="color:#FBBF24;">🔋 Bateria: <b id="hud_bat_min">${bat}%</b></span>
                </div>
                <div class="vars-robot-track" style="max-width:540px;background:radial-gradient(circle at 50% 50%, #450A0A 0%, #1E1B4B 100%);border-color:#F43F5E;position:relative;">
                    <div class="vars-robot-actor" style="left:${posX}px;">
                        <span style="font-size:2.2rem;">🚜</span>
                        ${setor > 0 ? '<div class="vars-laser-beam" style="left:24px;top:45px;height:25px;"></div>' : ''}
                    </div>
                    <div class="vars-node-spot ${setor >= 1 ? 'active' : ''}" style="border-color:${setor >= 1 ? '#38BDF8' : '#334155'};box-shadow:${setor === 1 ? '0 0 15px #38BDF8' : 'none'};" title="Setor Alfa (+5 Cristais)">💎1</div>
                    <div class="vars-node-spot ${setor >= 2 ? 'active' : ''}" style="border-color:${setor >= 2 ? '#38BDF8' : '#334155'};box-shadow:${setor === 2 ? '0 0 15px #38BDF8' : 'none'};" title="Setor Beta (+5 Cristais)">💎2</div>
                    <div class="vars-node-spot ${setor >= 3 ? 'active' : ''}" style="border-color:${setor >= 3 ? '#38BDF8' : '#334155'};box-shadow:${setor === 3 ? '0 0 15px #38BDF8' : 'none'};" title="Setor Gama (+5 Cristais)">💎3</div>
                    <div class="vars-node-spot ${setor >= 4 ? 'active' : ''}" style="border-color:${setor >= 4 ? '#38BDF8' : '#334155'};box-shadow:${setor === 4 ? '0 0 20px #38BDF8' : 'none'};" title="Setor Delta (+5 Cristais)">💎4</div>
                </div>
            </div>
        `;
    } else if (lvl === 6) {
        // NÍVEL 6: CLIMATIZADOR DA ESTUFA INTELIGENTE (IF / ELSE)
        const fanOn = state.ventiladorLigado === true;
        const temp = state.temperatura || 34.5;
        arena.innerHTML = `
            <div style="display:flex;align-items:center;justify-content:space-around;width:100%;max-width:560px;gap:16px;flex-wrap:wrap;position:relative;">
                <!-- Ventilador com animação de vento -->
                <div style="background:#1E293B;padding:14px 18px;border-radius:18px;border:2px solid ${fanOn ? '#10B981' : '#EF4444'};text-align:center;position:relative;overflow:hidden;min-width:180px;">
                    <div class="${fanOn ? 'vars-fan-spin' : ''}" style="font-size:3.2rem;display:inline-block;">
                        ${fanOn ? '🌀' : '🛑'}
                    </div>
                    ${fanOn ? `
                        <div class="vars-wind-line" style="top:25px;left:10px;width:70px;"></div>
                        <div class="vars-wind-line" style="top:45px;left:5px;width:90px;animation-delay:0.2s;"></div>
                        <div class="vars-wind-line" style="top:60px;left:15px;width:60px;animation-delay:0.4s;"></div>
                    ` : ''}
                    <div style="font-family:'Fredoka One';color:${fanOn ? '#34D399' : '#FCA5A5'};font-size:0.95rem;margin-top:4px;">
                        ${fanOn ? 'VENTILADOR LIGADO (RESFRIANDO)' : 'VENTILADOR DESLIGADO'}
                    </div>
                    <div style="font-size:0.75rem;color:#94A3B8;margin-top:2px;">Atuador Digital (Pino 9)</div>
                </div>

                <!-- Plantinhas e Mudas da Estufa -->
                <div style="display:flex;flex-direction:column;align-items:center;gap:6px;background:#0F172A;padding:12px 16px;border-radius:18px;border:1px solid #334155;">
                    <div style="font-size:2rem;letter-spacing:6px;">
                        ${fanOn ? '🌸🌿🌸' : '🥀🍂🥀'}
                    </div>
                    <div style="font-size:0.78rem;font-weight:900;color:${fanOn ? '#34D399' : '#F87171'};">
                        ${fanOn ? '🌱 Clima Agradável: Mudas Felizes!' : '🥵 Alerta: Calor Excessivo!'}
                    </div>
                </div>

                <div style="display:flex;flex-direction:column;gap:8px;width:100%;max-width:320px;">
                    <div class="vars-lcd" style="max-width:100%;">
                        <div class="vars-lcd-line">ESTUFA SMART 🌱</div>
                        <div class="vars-lcd-line" style="color:${fanOn ? '#34D399' : '#F87171'};">${fanOn ? 'CLIMA: RESFRIANDO [OK]' : 'ALERTA: CALOR 34.5C'}</div>
                    </div>
                    <div style="background:#0F172A;padding:8px 12px;border-radius:10px;border:1px solid #334155;font-size:0.8rem;color:#E2E8F0;display:flex;justify-content:space-between;">
                        <span>Termômetro: <b style="color:#FBBF24;">${temp}°C</b></span>
                        <span>Limite: <b style="color:#38BDF8;">30.0°C</b></span>
                    </div>
                </div>
            </div>
        `;
    } else if (lvl === 7) {
        // NÍVEL 7: RADAR ULTRASSÔNICO & FRENAGEM AUTÔNOMA (IF / ELSE)
        const freio = state.freioEmergencia === true;
        const dist = state.distanciaObstaculo !== undefined ? state.distanciaObstaculo : 14.5;
        const carX = freio ? 240 : 120;
        arena.innerHTML = `
            <div style="width:100%;display:flex;flex-direction:column;gap:12px;align-items:center;">
                <div style="display:flex;justify-content:space-between;width:100%;max-width:540px;background:#0F172A;padding:8px 16px;border-radius:14px;border:1px solid #334155;font-size:0.85rem;font-weight:900;">
                    <span style="color:#38BDF8;">📡 Sonar: ${dist.toFixed(1)} cm</span>
                    <span style="color:#FBBF24;">🛡️ Distância Segura: 20.0 cm</span>
                    <span style="color:${freio ? '#EF4444' : '#10B981'};">${freio ? '🛑 FREIO ATIVO' : '🟢 ACELERANDO'}</span>
                </div>
                <div style="width:100%;max-width:540px;height:120px;background:#090D16;border-radius:16px;border:2px solid #334155;position:relative;overflow:hidden;display:flex;align-items:center;">
                    <!-- Linha da Pista -->
                    <div style="position:absolute;bottom:20px;left:0;width:100%;height:3px;background:dashed #475569;"></div>
                    ${freio ? '<div class="vars-skid-trail" style="left:120px;width:120px;"></div>' : ''}
                    <!-- Carrinho Autônomo -->
                    <div style="position:absolute;left:${carX}px;bottom:14px;font-size:2.8rem;transition:left 0.8s cubic-bezier(0.2, 0.9, 0.3, 1);">
                        🏎️
                        ${freio ? '<div style="position:absolute;top:-18px;left:10px;font-size:1.2rem;animation:pulseGlow 0.3s infinite;">🚨</div>' : ''}
                    </div>
                    <!-- Ondas de Sonar -->
                    <div class="vars-sonar-pulse-ring" style="left:${carX + 65}px;bottom:22px;"></div>
                    <!-- Obstáculo (Rocha Espacial) -->
                    <div style="position:absolute;right:25px;bottom:12px;font-size:3rem;" title="Obstáculo a 14.5 cm">
                        🪨
                    </div>
                    <!-- Alerta de Pare -->
                    ${freio ? '<div style="position:absolute;top:10px;right:180px;background:#DC2626;color:white;font-weight:900;padding:4px 12px;border-radius:10px;font-size:0.85rem;box-shadow:0 0 15px #EF4444;">🛑 PARADA DE EMERGÊNCIA!</div>' : ''}
                </div>
            </div>
        `;
    } else if (lvl === 8) {
        // NÍVEL 8: ROVER EM MARTE (DESAFIO MAKER GERAL)
        const bat = state.bateria !== undefined ? state.bateria : 100;
        const vel = state.velocidade !== undefined ? state.velocidade : 4.5;
        const cristais = state.cristais !== undefined ? state.cristais : 0;
        const escudo = state.escudo !== undefined ? state.escudo : true;
        arena.innerHTML = `
            <div style="width:100%;display:flex;flex-direction:column;gap:10px;">
                <div style="display:flex;justify-content:space-between;background:#0F172A;padding:8px 14px;border-radius:12px;border:1px solid #334155;font-size:0.85rem;font-weight:900;flex-wrap:wrap;gap:8px;">
                    <span style="color:#FBBF24;">🔋 Bateria: ${bat}%</span>
                    <span style="color:#38BDF8;">💎 Cristais: ${cristais}</span>
                    <span style="color:#34D399;">🛡️ Escudo: ${escudo ? 'ATIVO' : 'OFF'}</span>
                    <span style="color:#A78BFA;">🚀 Vel: ${vel} km/h</span>
                </div>
                <div class="vars-rover-stage" style="min-height:120px;background:radial-gradient(ellipse at 50% 50%, #450A0A 0%, #090D16 100%);border-radius:16px;border:2px solid #334155;position:relative;overflow:hidden;display:flex;align-items:center;padding:10px 20px;">
                    ${escudo ? '<div class="vars-shield-dome" style="width:100px;height:100px;left:20px;bottom:10px;"></div>' : ''}
                    <div class="vars-rover-body" id="rover_actor" style="font-size:3rem;position:absolute;left:35px;bottom:18px;transition:left 1s ease;">
                        🚜
                        <div style="position:absolute;top:-10px;right:-10px;font-size:1rem;color:#FBBF24;">💡</div>
                    </div>
                    <div style="position:absolute;right:30px;bottom:20px;font-size:2.4rem;">
                        💎🪨
                    </div>
                </div>
            </div>
        `;
    }
}

function vars_resetScene() {
    vars_running = false;
    document.getElementById('vars_btn_run').disabled = false;

    if (vars_level === 1) {
        const vidasInit = parseInt(document.getElementById('vars_n1_vidas_init')?.value || '3', 10);
        vars_renderRamBoxes([
            { addr: '0x01A0', type: 'int', name: 'vidas', val: vidasInit },
            { addr: '0x01A2', type: 'int', name: 'moedas', val: 0 },
            { addr: '0x01A4', type: 'int', name: 'pontos', val: 0 }
        ]);
        vars_renderArena(1, { step: 0, vidas: vidasInit, moedas: 0, pontos: 0 });
    } else if (vars_level === 2) {
        vars_renderRamBoxes([
            { addr: '0x01A0', type: 'float', name: 'tempManha', val: '20.5' },
            { addr: '0x01A4', type: 'float', name: 'tempTarde', val: '31.5' },
            { addr: '0x01A8', type: 'float', name: 'tempMedia', val: '0.0' },
            { addr: '0x01AC', type: 'float', name: 'tensaoBateria', val: '4.85' }
        ]);
        vars_renderArena(2, { tempMedia: 0.0 });
    } else if (vars_level === 3) {
        vars_renderRamBoxes([
            { addr: '0x01A0', type: 'String', name: 'senhaMestre', val: '"ARDUINO2026"' },
            { addr: '0x01B0', type: 'String', name: 'senhaDigitada', val: '""' },
            { addr: '0x01C0', type: 'bool', name: 'travaAberta', val: 'false' }
        ]);
        vars_renderArena(3, { travaAberta: false });
    } else if (vars_level === 4) {
        vars_renderRamBoxes([
            { addr: '0x01A0', type: 'int', name: 'energia', val: 0 },
            { addr: '0x01A2', type: 'int', name: 'ciclo', val: 0 },
            { addr: '0x01A4', type: 'int', name: 'limiteVoltas', val: 4 }
        ]);
        vars_renderArena(4, { ciclo: 0, energia: 0 });
    } else if (vars_level === 5) {
        vars_renderRamBoxes([
            { addr: '0x01A0', type: 'int', name: 'cristais', val: 0 },
            { addr: '0x01A2', type: 'int', name: 'bateria', val: 100 },
            { addr: '0x01A4', type: 'int', name: 'setor', val: 0 }
        ]);
        vars_renderArena(5, { setor: 0, cristais: 0, bateria: 100 });
    } else if (vars_level === 6) {
        vars_renderRamBoxes([
            { addr: '0x01A0', type: 'float', name: 'temperatura', val: '34.5' },
            { addr: '0x01A4', type: 'float', name: 'tempLimite', val: '30.0' },
            { addr: '0x01A8', type: 'bool', name: 'ventiladorLigado', val: 'false' },
            { addr: '0x01B0', type: 'String', name: 'statusClima', val: '"NORMAL"' }
        ]);
        vars_renderArena(6, { temperatura: 34.5, ventiladorLigado: false });
    } else if (vars_level === 7) {
        vars_renderRamBoxes([
            { addr: '0x01A0', type: 'float', name: 'distanciaObstaculo', val: '14.5' },
            { addr: '0x01A4', type: 'float', name: 'distanciaSegura', val: '20.0' },
            { addr: '0x01A8', type: 'bool', name: 'freioEmergencia', val: 'false' },
            { addr: '0x01B0', type: 'String', name: 'alertaPiloto', val: '"PISTA LIVRE"' }
        ]);
        vars_renderArena(7, { distanciaObstaculo: 14.5, freioEmergencia: false });
    } else if (vars_level === 8) {
        vars_renderRamBoxes([
            { addr: '0x01A0', type: 'int', name: 'bateria', val: '100' },
            { addr: '0x01A2', type: 'int', name: 'cristais', val: '0' },
            { addr: '0x01A4', type: 'float', name: 'velocidade', val: '4.5' },
            { addr: '0x01A8', type: 'bool', name: 'escudo', val: 'true' },
            { addr: '0x01B0', type: 'String', name: 'status', val: '"EXPLORANDO"' }
        ]);
        vars_renderArena(8, { bateria: 100, cristais: 0, velocidade: 4.5, escudo: true });
    }
}

/* ================= ATUALIZAÇÃO DO CÓDIGO C++ EM TEMPO REAL ================= */

function vars_updateLiveCpp() {
    const codeEl = document.getElementById('vars_arduino_code');
    if (!codeEl) return;

    if (vars_level === 1) {
        const vidasInit = document.getElementById('vars_n1_vidas_init')?.value || '3';
        const cmd1 = document.getElementById('vars_n1_cmd1')?.value || '// escolha a soma de moedas';
        const cmd2 = document.getElementById('vars_n1_cmd2')?.value || '// escolha a perda de vida';
        const cmd3 = document.getElementById('vars_n1_cmd3')?.value || '// escolha o calculo de pontos';

        codeEl.innerText = `// ==========================================
// AULA 5 — VARIÁVEIS C++ (ARDUINO UNO)
// Nível 1: Contador de Vidas & Moedas (int)
// ==========================================

int vidas = ${vidasInit};
int moedas = 0;
int pontos = 0;

void setup() {
  Serial.begin(9600);
  Serial.println("Robo Maker Iniciado na Caverna!");
}

void loop() {
  // 1. Coleta o bau de moedas
  ${cmd1}

  // 2. Armadilha de espinhos
  ${cmd2}

  // 3. Conversao de moedas em pontos
  ${cmd3}

  Serial.print("Vidas: "); Serial.println(vidas);
  Serial.print("Moedas: "); Serial.println(moedas);
  Serial.print("Pontos: "); Serial.println(pontos);
}`;
    } else if (vars_level === 2) {
        const tipo = document.getElementById('vars_n2_tipo')?.value || '/* tipo */';
        const calc = document.getElementById('vars_n2_calc')?.value || '// formula da media';

        codeEl.innerText = `// ==========================================
// AULA 5 — VARIÁVEIS C++ (ARDUINO UNO)
// Nível 2: Estação Meteorológica (float)
// ==========================================

${tipo} tempManha = 20.5;
${tipo} tempTarde = 31.5;
${tipo} tempMedia = 0.0;
${tipo} tensaoBateria = 4.85;

void setup() {
  Serial.begin(9600);
  lcd_iniciar();
}

void loop() {
  // 1. Calculo da temperatura media
  ${calc}

  // 2. Exibicao no display LCD 16x2
  lcd_imprimir(tempMedia);
}`;
    } else if (vars_level === 3) {
        const tipoStr = document.getElementById('vars_n3_tipo_str')?.value || '/* tipo */';
        const inputSenha = document.getElementById('vars_n3_input_senha')?.value || '';
        const travaCmd = document.getElementById('vars_n3_trava_cmd')?.value || '// comando da trava';

        codeEl.innerText = `// ==========================================
// AULA 5 — VARIÁVEIS C++ (ARDUINO UNO)
// Nível 3: Cofre Eletrônico (String & bool)
// ==========================================

${tipoStr} senhaMestre = "ARDUINO2026";
${tipoStr} senhaDigitada = "${inputSenha}";
bool travaAberta = false;

void setup() {
  pinMode(PIN_TRAVA, OUTPUT);
}

void loop() {
  // Verificacao de igualdade de Strings
  if (senhaDigitada == senhaMestre) {
    ${travaCmd}
  }
}`;
    } else if (vars_level === 4) {
        const cond = document.getElementById('vars_n4_loop_cond')?.value || 'ciclo <= 4;';
        const cmd = document.getElementById('vars_n4_energia_cmd')?.value || 'energia = energia + 25;';

        codeEl.innerText = `// ==========================================
// AULA 5 — REVISÃO 1: VARIÁVEIS + LOOP FOR
// Nível 4: Esteira de Recarga Solar (int & for)
// ==========================================

int energia = 0; // Acumulador de energia

void setup() {
  Serial.begin(9600);
}

void loop() {
  // O laço FOR repete as 4 voltas na esteira solar
  for (int ciclo = 1; ${cond} ciclo++) {
    ${cmd}
    Serial.print("Ciclo: "); Serial.print(ciclo);
    Serial.print(" | Bateria: "); Serial.println(energia);
    delay(500);
  }
}`;
    } else if (vars_level === 5) {
        const cond = document.getElementById('vars_n5_loop_cond')?.value || 'setor <= 4;';
        const cCmd = document.getElementById('vars_n5_cristais_cmd')?.value || 'cristais = cristais + 5;';
        const bCmd = document.getElementById('vars_n5_bateria_cmd')?.value || 'bateria = bateria - 10;';

        codeEl.innerText = `// ==========================================
// AULA 5 — REVISÃO 2: VARIÁVEIS + LOOP FOR
// Nível 5: Mineração de Cristais em Marte
// ==========================================

int cristais = 0; // Recursos na mochila
int bateria = 100; // Bateria do Rover

void setup() {
  Serial.begin(9600);
}

void loop() {
  // Percorre os 4 setores de Marte extraindo minérios
  for (int setor = 1; ${cond} setor++) {
    ${cCmd}
    ${bCmd}
    Serial.print("Setor "); Serial.print(setor);
    Serial.print(" | Cristais: "); Serial.print(cristais);
    Serial.print(" | Bateria: "); Serial.println(bateria);
    delay(400);
  }
}`;
    } else if (vars_level === 6) {
        const cond = document.getElementById('vars_n6_if_cond')?.value || 'temperatura > tempLimite';
        const fanCmd = document.getElementById('vars_n6_fan_cmd')?.value || 'ventiladorLigado = true; statusClima = "ALERTA: VENTILADOR LIGADO";';

        codeEl.innerText = `// ==========================================
// AULA 5 — REVISÃO 3: VARIÁVEIS + IF/ELSE
// Nível 6: Estufa Inteligente (float, bool, String)
// ==========================================

float temperatura = 34.5;
float tempLimite = 30.0;
bool ventiladorLigado = false;
String statusClima = "NORMAL";

void setup() {
  pinMode(PIN_VENTILADOR, OUTPUT);
}

void loop() {
  // Tomada de decisão inteligente baseada em variáveis
  if (${cond}) {
    ${fanCmd}
  } else {
    ventiladorLigado = false;
    statusClima = "CLIMA AGRADAVEL";
  }
}`;
    } else if (vars_level === 7) {
        const cond = document.getElementById('vars_n7_if_cond')?.value || 'distanciaObstaculo < distanciaSegura';
        const freioCmd = document.getElementById('vars_n7_freio_cmd')?.value || 'freioEmergencia = true; alertaPiloto = "PERIGO: FREIO ACIONADO!";';

        codeEl.innerText = `// ==========================================
// AULA 5 — REVISÃO 4: VARIÁVEIS + IF/ELSE
// Nível 7: Radar Ultrassônico HC-SR04 & Freio
// ==========================================

float distanciaObstaculo = 14.5;
float distanciaSegura = 20.0;
bool freioEmergencia = false;
String alertaPiloto = "PISTA LIVRE";

void setup() {
  pinMode(PIN_FREIO, OUTPUT);
}

void loop() {
  // Verificação de distância segura para parada de emergência
  if (${cond}) {
    ${freioCmd}
  } else {
    freioEmergencia = false;
    alertaPiloto = "PISTA LIVRE";
  }
}`;
    } else if (vars_level === 8) {
        vars_handleIdeInput();
    }
}

/* ================= EXECUÇÃO DA SIMULAÇÃO ================= */

function vars_runSimulation() {
    if (vars_running) return;
    vars_running = true;
    document.getElementById('vars_btn_run').disabled = true;
    playSound('click');

    if (vars_level === 1) {
        vars_runLevel1();
    } else if (vars_level === 2) {
        vars_runLevel2();
    } else if (vars_level === 3) {
        vars_runLevel3();
    } else if (vars_level === 4) {
        vars_runLevel4();
    } else if (vars_level === 5) {
        vars_runLevel5();
    } else if (vars_level === 6) {
        vars_runLevel6();
    } else if (vars_level === 7) {
        vars_runLevel7();
    } else if (vars_level === 8) {
        vars_runLevel8();
    }
}

function vars_runLevel1() {
    const cmd1 = document.getElementById('vars_n1_cmd1')?.value;
    const cmd2 = document.getElementById('vars_n1_cmd2')?.value;
    const cmd3 = document.getElementById('vars_n1_cmd3')?.value;
    const vidasInit = parseInt(document.getElementById('vars_n1_vidas_init')?.value || '3', 10);

    if (!cmd1 || !cmd2 || !cmd3) {
        vars_triggerError('Selecione todos os comandos!', 'Preencha as três etapas de código para rodar a caverna completa.', 'Verifique os seletores das etapas 1, 2 e 3!');
        vars_running = false;
        document.getElementById('vars_btn_run').disabled = false;
        return;
    }

    let vidas = vidasInit;
    let moedas = 0;
    let pontos = 0;

    // Início da caminhada
    vars_renderArena(1, { step: 0, vidas, moedas, pontos, robotClass: 'vars-robot-walking', speech: 'Lá vou eu explorar a caverna! 🤖' });
    playSound('step');

    // Etapa 1: Baú de Moedas
    setTimeout(() => {
        playSound('step');
        if (cmd1 === 'moedas = moedas + 10;') {
            moedas += 10;
            vars_spawnCoinParticles(220, 50);
            vars_renderArena(1, { step: 1, vidas, moedas, pontos, robotClass: 'vars-robot-cheer', robotEmoji: '😃', speech: 'Baú Dourado! +10 🪙 Moedas!' });
            vars_showToast('+10 🪙 MOEDAS COLETADAS!', '#FBBF24', 210, 20);
        } else if (cmd1 === 'moedas = moedas - 10;') {
            moedas -= 10;
            vars_spawnSmokePuff(220, 50);
            playSound('error');
            vars_renderArena(1, { step: 1, vidas, moedas, pontos, robotClass: 'vars-robot-hurt', robotEmoji: '😢', speech: 'Ops! Perdi 10 moedas!' });
            vars_showToast('-10 🪙 MOEDAS PERDIDAS!', '#EF4444', 210, 20);
        } else if (cmd1 === 'moedas = 10;') {
            moedas = 10;
            vars_spawnCoinParticles(220, 50);
            vars_renderArena(1, { step: 1, vidas, moedas, pontos, robotClass: 'vars-robot-cheer', robotEmoji: '😃', speech: 'Defini 10 moedas!' });
            vars_showToast('+10 🪙 Moedas!', '#FBBF24', 210, 20);
        }

        vars_renderRamBoxes([
            { addr: '0x01A0', type: 'int', name: 'vidas', val: vidas },
            { addr: '0x01A2', type: 'int', name: 'moedas', val: moedas, updated: true },
            { addr: '0x01A4', type: 'int', name: 'pontos', val: pontos }
        ]);

        // Etapa 2: Espinho / Dano
        setTimeout(() => {
            if (cmd2 === 'vidas = vidas - 1;') {
                vidas -= 1;
                vars_spawnDamageEffect(370, 50);
                playSound('error');
                vars_renderArena(1, { step: 2, vidas, moedas, pontos, robotClass: 'vars-robot-hurt', robotEmoji: '😵', speech: 'Ai! O espinho me feriu! 🌵', hurt: true });
                vars_showToast('💥 -1 ❤️ VIDA PERDIDA!', '#EF4444', 360, 20);
            } else if (cmd2 === 'vidas = vidas + 1;') {
                vidas += 1;
                playSound('step');
                vars_renderArena(1, { step: 2, vidas, moedas, pontos, robotClass: 'vars-robot-cheer', robotEmoji: '💚', speech: 'Poção curativa! +1 Vida!' });
                vars_showToast('💚 +1 ❤️ VIDA!', '#10B981', 360, 20);
            } else if (cmd2 === 'vidas = 0;') {
                vidas = 0;
                vars_spawnDamageEffect(370, 50);
                playSound('error');
                vars_renderArena(1, { step: 2, vidas: 0, moedas, pontos, robotClass: 'vars-robot-dizzy', robotEmoji: '💫', speech: 'Sem energia! Caí no espinho!', hurt: true });
                vars_showToast('💀 0 ❤️ TODAS AS VIDAS ZERADAS!', '#EF4444', 360, 20);
            }

            vars_renderRamBoxes([
                { addr: '0x01A0', type: 'int', name: 'vidas', val: vidas, updated: true },
                { addr: '0x01A2', type: 'int', name: 'moedas', val: moedas },
                { addr: '0x01A4', type: 'int', name: 'pontos', val: pontos }
            ]);

            // Etapa 3: Pontos e Saída
            setTimeout(() => {
                if (cmd3 === 'pontos = moedas * 100;') {
                    pontos = moedas * 100;
                    vars_spawnSparks(510, 50);
                    playSound('success');
                    vars_renderArena(1, { step: 3, vidas, moedas, pontos, robotClass: 'vars-robot-cheer', robotEmoji: '🥳', speech: `Multipliquei: ${moedas} x 100 = ${pontos} pts! 🏆` });
                    vars_showToast(`⭐ PONTOS: ${moedas} x 100 = ${pontos}!`, '#38BDF8', 410, 15);
                } else if (cmd3 === 'pontos = moedas + 100;') {
                    pontos = moedas + 100;
                    playSound('step');
                    vars_renderArena(1, { step: 3, vidas, moedas, pontos, robotClass: 'vars-robot-walking', robotEmoji: '🤖', speech: `Soma: ${moedas} + 100 = ${pontos} pts` });
                }

                vars_renderRamBoxes([
                    { addr: '0x01A0', type: 'int', name: 'vidas', val: vidas },
                    { addr: '0x01A2', type: 'int', name: 'moedas', val: moedas },
                    { addr: '0x01A4', type: 'int', name: 'pontos', val: pontos, updated: true }
                ]);

                // Checagem de sucesso
                if (cmd1 === 'moedas = moedas + 10;' && cmd2 === 'vidas = vidas - 1;' && cmd3 === 'pontos = moedas * 100;' && vidas >= 1 && moedas === 10 && pontos === 1000) {
                    setTimeout(() => vars_showWin(1, 'Você dominou o tipo int!', 'O robô coletou o baú (+10 moedas), sentiu o espinho (-1 vida) e multiplicou os pontos com perfeição!'), 700);
                } else {
                    setTimeout(() => {
                        vars_triggerError('Cálculo Incorreto!', 'As variáveis não receberam os valores esperados. O robô precisava de +10 moedas, -1 vida e pontos = moedas * 100.', 'Lembre-se: para somar é +, subtrair é - e multiplicar é * !');
                        vars_running = false;
                        document.getElementById('vars_btn_run').disabled = false;
                    }, 700);
                }
            }, 850);
        }, 850);
    }, 750);
}

function vars_runLevel2() {
    const tipo = document.getElementById('vars_n2_tipo')?.value;
    const calc = document.getElementById('vars_n2_calc')?.value;

    if (!tipo || !calc) {
        vars_triggerError('Campos Incompletos!', 'Selecione o tipo de dado e a fórmula de cálculo da média.', 'Escolha as opções corretas nos dois seletores.');
        vars_running = false;
        document.getElementById('vars_btn_run').disabled = false;
        return;
    }

    if (tipo !== 'float') {
        vars_triggerError('Erro de Tipo de Dado!', `Você escolheu o tipo <b>${tipo}</b>. O tipo int não guarda casas decimais (cortaria os números depois do ponto), e String é apenas texto!`, 'Use <b>float</b> para variáveis que possuem números com ponto decimal!');
        vars_running = false;
        document.getElementById('vars_btn_run').disabled = false;
        return;
    }

    if (calc !== 'tempMedia = (tempManha + tempTarde) / 2.0;') {
        vars_triggerError('Fórmula da Média Incorreta!', 'Para calcular a média entre dois números, precisamos SOMAR os dois valores e DIVIDIR por 2.0!', 'Fórmula correta: (tempManha + tempTarde) / 2.0');
        vars_running = false;
        document.getElementById('vars_btn_run').disabled = false;
        return;
    }

    const tempMedia = (20.5 + 31.5) / 2.0; // 26.0

    // Passo 1: Robô mede manhã
    vars_renderArena(2, { tempMedia: 20.5, reading: 'manha', speech: 'Lendo manhã: 20.5°C 🌅', lcdText: 'LENDO MANHA: 20.5C' });
    playSound('step');

    setTimeout(() => {
        // Passo 2: Robô mede tarde
        vars_renderArena(2, { tempMedia: 31.5, reading: 'tarde', speech: 'Lendo tarde: 31.5°C ☀️🔥', lcdText: 'LENDO TARDE: 31.5C' });
        vars_spawnSparks(480, 40);
        playSound('step');

        setTimeout(() => {
            // Passo 3: Média calculada
            playSound('success');
            vars_renderArena(2, { tempMedia, reading: 'done', speech: 'Média: (20.5+31.5)/2 = 26.0°C! 💡', lcdText: `MED: ${tempMedia.toFixed(1)}C [CALIBRADO]` });
            vars_showToast(`🌡️ +${tempMedia.toFixed(1)} °C (float preciso!)`, '#38BDF8', 160, 20);

            vars_renderRamBoxes([
                { addr: '0x01A0', type: 'float', name: 'tempManha', val: '20.5' },
                { addr: '0x01A4', type: 'float', name: 'tempTarde', val: '31.5' },
                { addr: '0x01A8', type: 'float', name: 'tempMedia', val: tempMedia.toFixed(1), updated: true },
                { addr: '0x01AC', type: 'float', name: 'tensaoBateria', val: '4.85' }
            ]);

            setTimeout(() => {
                vars_showWin(2, 'Termômetro Digital Calibrado!', `O tipo <b>float</b> registrou a média exata de <b>${tempMedia.toFixed(1)} °C</b> sem perder as casas decimais!`);
            }, 800);
        }, 750);
    }, 750);
}

function vars_runLevel3() {
    const tipoStr = document.getElementById('vars_n3_tipo_str')?.value;
    const inputSenha = document.getElementById('vars_n3_input_senha')?.value?.trim();
    const travaCmd = document.getElementById('vars_n3_trava_cmd')?.value;

    if (!tipoStr || !travaCmd) {
        vars_triggerError('Campos Incompletos!', 'Selecione o tipo de dado de texto e a ação da trava.', 'Preencha todos os seletores do cofre.');
        vars_running = false;
        document.getElementById('vars_btn_run').disabled = false;
        return;
    }

    if (tipoStr !== 'String') {
        vars_triggerError('Tipo de Dado Incorreto!', `O tipo <b>${tipoStr}</b> não consegue guardar palavras ou frases! Apenas o tipo <b>String</b> aceita textos entre aspas.`, 'Escolha <b>String</b> para guardar a senha!');
        vars_running = false;
        document.getElementById('vars_btn_run').disabled = false;
        return;
    }

    if (inputSenha !== 'ARDUINO2026') {
        vars_triggerError('Senha Incorreta!', `Você digitou "${inputSenha}". O cofre só abre com a senha mestre exata!`, 'A senha mestre correta é <b>ARDUINO2026</b>.');
        vars_running = false;
        document.getElementById('vars_btn_run').disabled = false;
        return;
    }

    if (travaCmd !== 'travaAberta = true;') {
        vars_triggerError('Trava Fechada!', 'Quando a senha estiver correta, a trava precisa ser liberada com <b>travaAberta = true;</b>!', 'Altere o comando para travaAberta = true;');
        vars_running = false;
        document.getElementById('vars_btn_run').disabled = false;
        return;
    }

    // Animação de digitação da senha e destravamento
    vars_renderArena(3, { typedPass: 'ARDUINO...', speech: 'Digitando texto no teclado...' });
    playSound('step');

    setTimeout(() => {
        vars_renderArena(3, { typedPass: 'ARDUINO2026', speech: 'Senha Completa! Verificando...' });
        playSound('step');

        setTimeout(() => {
            playSound('success');
            vars_renderArena(3, { travaAberta: true, typedPass: 'ARDUINO2026', speech: 'Cofre Aberto! Peguei o ouro! 🏅💎' });
            vars_spawnSparks(380, 50);
            vars_showToast('🔓 COFRE DESTRAVADO! travaAberta = true;', '#34D399', 180, 25);

            vars_renderRamBoxes([
                { addr: '0x01A0', type: 'String', name: 'senhaMestre', val: '"ARDUINO2026"' },
                { addr: '0x01B0', type: 'String', name: 'senhaDigitada', val: `"${inputSenha}"`, updated: true },
                { addr: '0x01C0', type: 'bool', name: 'travaAberta', val: 'true', updated: true }
            ]);

            setTimeout(() => {
                vars_showWin(3, 'Cofre Secreto Destravado!', 'Você combinou a variável <b>String</b> de texto com a variável <b>bool</b> da trava de segurança com perfeição!');
            }, 850);
        }, 650);
    }, 600);
}

function vars_runLevel4() {
    const cond = document.getElementById('vars_n4_loop_cond')?.value;
    const cmd = document.getElementById('vars_n4_energia_cmd')?.value;

    if (!cond || !cmd) {
        vars_triggerError('Campos Incompletos!', 'Configure a condição de repetição do FOR e a instrução acumuladora de energia.', 'Selecione as opções nos dois seletores da esteira.');
        vars_running = false;
        document.getElementById('vars_btn_run').disabled = false;
        return;
    }

    if (cond !== 'ciclo <= 4;') {
        vars_triggerError('Condição do Loop Incorreta!', 'A esteira tem exatamente 4 geradores solares fotovoltaicos. A condição correta deve ser <b>ciclo <= 4;</b> para dar 4 voltas!', 'Escolha ciclo <= 4;');
        vars_running = false;
        document.getElementById('vars_btn_run').disabled = false;
        return;
    }

    if (cmd !== 'energia = energia + 25;') {
        vars_triggerError('Acumulador Incorreto!', 'Para somar +25% de carga a cada ciclo, a variável precisa acumular sobre o que já tem: <b>energia = energia + 25;</b>!', 'Se você colocar apenas energia = 25;, o robô nunca passa dos 25%!');
        vars_running = false;
        document.getElementById('vars_btn_run').disabled = false;
        return;
    }

    // Simulação visual passo a passo do laço FOR
    let ciclo = 1;
    let energia = 0;
    const stepInterval = setInterval(() => {
        playSound('step');
        energia += 25;
        const currentPosX = ciclo === 1 ? 150 : ciclo === 2 ? 270 : ciclo === 3 ? 390 : 500;
        vars_renderArena(4, { ciclo, energia });
        vars_spawnSparks(currentPosX + 24, 40);
        vars_showToast(`⚡ +25% Bateria! [Ciclo ${ciclo}]`, '#FBBF24', currentPosX, 20);

        vars_renderRamBoxes([
            { addr: '0x01A0', type: 'int', name: 'energia', val: `${energia}%`, updated: true },
            { addr: '0x01A2', type: 'int', name: 'ciclo', val: ciclo, updated: true },
            { addr: '0x01A4', type: 'int', name: 'limiteVoltas', val: 4 }
        ]);

        if (ciclo >= 4) {
            clearInterval(stepInterval);
            playSound('success');
            setTimeout(() => {
                vars_showWin(4, 'Bateria 100% Recarregada com FOR!', 'O laço <b>for</b> rodou 4 vezes e a variável <b>energia</b> acumulou de 25 em 25 até a carga máxima!');
            }, 750);
        }
        ciclo++;
    }, 650);
}

function vars_runLevel5() {
    const cond = document.getElementById('vars_n5_loop_cond')?.value;
    const cCmd = document.getElementById('vars_n5_cristais_cmd')?.value;
    const bCmd = document.getElementById('vars_n5_bateria_cmd')?.value;

    if (!cond || !cCmd || !bCmd) {
        vars_triggerError('Campos Incompletos!', 'Configure a condição de setores do FOR, a coleta de cristais e o consumo de bateria.', 'Selecione as opções nos três seletores de mineração.');
        vars_running = false;
        document.getElementById('vars_btn_run').disabled = false;
        return;
    }

    if (cond !== 'setor <= 4;') {
        vars_triggerError('Setores Incompletos!', 'O mapa possui 4 setores marcianos (Alfa, Beta, Gama, Delta). A condição deve ser <b>setor <= 4;</b>!', 'Escolha setor <= 4;');
        vars_running = false;
        document.getElementById('vars_btn_run').disabled = false;
        return;
    }

    if (cCmd !== 'cristais = cristais + 5;') {
        vars_triggerError('Cálculo de Cristais Incorreto!', 'Cada setor rende +5 cristais de plasma. A fórmula de acumulação é <b>cristais = cristais + 5;</b>!', 'Use cristais = cristais + 5;');
        vars_running = false;
        document.getElementById('vars_btn_run').disabled = false;
        return;
    }

    if (bCmd !== 'bateria = bateria - 10;') {
        vars_triggerError('Consumo de Bateria Incorreto!', 'O raio extrator consome 10% de energia por setor minerado: <b>bateria = bateria - 10;</b>!', 'Use bateria = bateria - 10;');
        vars_running = false;
        document.getElementById('vars_btn_run').disabled = false;
        return;
    }

    // Simulação visual dos 4 setores marcianos
    let setor = 1;
    let cristais = 0;
    let bat = 100;
    const stepInterval = setInterval(() => {
        playSound('step');
        cristais += 5;
        bat -= 10;
        const currentPosX = setor === 1 ? 150 : setor === 2 ? 270 : setor === 3 ? 390 : 500;
        vars_renderArena(5, { setor, cristais, bateria: bat });
        vars_spawnCrystalParticles(currentPosX + 25, 45);
        vars_spawnSmokePuff(currentPosX - 10, 30);
        vars_showToast(`💎 +5 Cristais | 🔋 -10% Bateria`, '#38BDF8', currentPosX, 20);

        vars_renderRamBoxes([
            { addr: '0x01A0', type: 'int', name: 'cristais', val: cristais, updated: true },
            { addr: '0x01A2', type: 'int', name: 'bateria', val: `${bat}%`, updated: true },
            { addr: '0x01A4', type: 'int', name: 'setor', val: setor, updated: true }
        ]);

        if (setor >= 4) {
            clearInterval(stepInterval);
            playSound('success');
            setTimeout(() => {
                vars_showWin(5, 'Mineração Marciana Concluída!', 'Você combinou o laço <b>for</b> com duas variáveis ao mesmo tempo: somando <b>+20 cristais</b> e gerenciando a <b>bateria</b>!');
            }, 750);
        }
        setor++;
    }, 650);
}

function vars_runLevel6() {
    const cond = document.getElementById('vars_n6_if_cond')?.value;
    const fanCmd = document.getElementById('vars_n6_fan_cmd')?.value;

    if (!cond || !fanCmd) {
        vars_triggerError('Campos Incompletos!', 'Selecione a condição lógica e a instrução do ventilador.', 'Preencha os seletores da estufa inteligente.');
        vars_running = false;
        document.getElementById('vars_btn_run').disabled = false;
        return;
    }

    if (cond !== 'temperatura > tempLimite') {
        vars_triggerError('Condição de Temperatura Incorreta!', 'O ventilador só deve ligar se a temperatura for MAIOR que o limite seguro: <b>temperatura > tempLimite</b>!', 'Use o operador > (maior que).');
        vars_running = false;
        document.getElementById('vars_btn_run').disabled = false;
        return;
    }

    if (!fanCmd.includes('ventiladorLigado = true')) {
        vars_triggerError('Ventilador Não Acionado!', 'Com o calor excessivo (34.5 °C), a variável booleana precisa ser ligada: <b>ventiladorLigado = true;</b>!', 'Mude o comando para ligar o ventilador.');
        vars_running = false;
        document.getElementById('vars_btn_run').disabled = false;
        return;
    }

    playSound('success');
    vars_renderArena(6, { temperatura: 34.5, ventiladorLigado: true });
    vars_spawnSparks(120, 60);
    vars_showToast('🌀 VENTILADOR ACIONADO! Resfriando estufa...', '#34D399', 120, 20);

    vars_renderRamBoxes([
        { addr: '0x01A0', type: 'float', name: 'temperatura', val: '34.5' },
        { addr: '0x01A4', type: 'float', name: 'tempLimite', val: '30.0' },
        { addr: '0x01A8', type: 'bool', name: 'ventiladorLigado', val: 'true', updated: true },
        { addr: '0x01B0', type: 'String', name: 'statusClima', val: '"ALERTA: LIGADO"', updated: true }
    ]);

    setTimeout(() => {
        vars_showWin(6, 'Estufa Climatizada com Sucesso!', 'Sua decisão <b>if/else</b> monitorou as variáveis <code>float</code> e acionou o ventilador <code>bool</code> protegendo todas as mudinhas!');
    }, 850);
}

function vars_runLevel7() {
    const cond = document.getElementById('vars_n7_if_cond')?.value;
    const freioCmd = document.getElementById('vars_n7_freio_cmd')?.value;

    if (!cond || !freioCmd) {
        vars_triggerError('Campos Incompletos!', 'Configure a condição do radar e a resposta de segurança do freio.', 'Selecione as opções nos dois campos.');
        vars_running = false;
        document.getElementById('vars_btn_run').disabled = false;
        return;
    }

    if (cond !== 'distanciaObstaculo < distanciaSegura') {
        vars_triggerError('Teste de Distância Incorreto!', 'O freio deve ser acionado se a distância do obstáculo for MENOR que a distância de segurança: <b>distanciaObstaculo < distanciaSegura</b>!', 'Use o operador < (menor que).');
        vars_running = false;
        document.getElementById('vars_btn_run').disabled = false;
        return;
    }

    if (!freioCmd.includes('freioEmergencia = true')) {
        vars_triggerError('Freio Desativado!', 'Em situação de emergência a 14.5 cm do obstáculo, o freio precisa travar: <b>freioEmergencia = true;</b>!', 'Ative o freio de emergência.');
        vars_running = false;
        document.getElementById('vars_btn_run').disabled = false;
        return;
    }

    // Passo 1: Carro acelera na pista
    vars_renderArena(7, { distanciaObstaculo: 30.0, freioEmergencia: false });
    playSound('step');

    setTimeout(() => {
        // Passo 2: Freio de emergência acionado a 14.5 cm
        playSound('success');
        vars_renderArena(7, { distanciaObstaculo: 14.5, freioEmergencia: true });
        vars_spawnSmokePuff(260, 60);
        vars_showToast('🛑 FREIO ACIONADO A 14.5 cm!', '#EF4444', 180, 20);

        vars_renderRamBoxes([
            { addr: '0x01A0', type: 'float', name: 'distanciaObstaculo', val: '14.5' },
            { addr: '0x01A4', type: 'float', name: 'distanciaSegura', val: '20.0' },
            { addr: '0x01A8', type: 'bool', name: 'freioEmergencia', val: 'true', updated: true },
            { addr: '0x01B0', type: 'String', name: 'alertaPiloto', val: '"PERIGO: FREIO!"', updated: true }
        ]);

        setTimeout(() => {
            vars_showWin(7, 'Frenagem Autônoma de Sucesso!', 'O sensor detectou o perigo com <b>distanciaObstaculo < distanciaSegura</b> e acionou a trava <b>freioEmergencia = true</b> evitando a colisão!');
        }, 900);
    }, 600);
}

function vars_runLevel8() {
    const code = document.getElementById('vars_code_input')?.value || '';

    // Validador de sintaxe avançado para a Mini-IDE Livre
    const hasInt = /\bint\s+([a-zA-Z0-9_]+)\s*=\s*(-?\d+)\s*;/i.test(code);
    const hasFloat = /\bfloat\s+([a-zA-Z0-9_]+)\s*=\s*(-?\d+\.\d+)\s*;/i.test(code);
    const hasString = /\bString\s+([a-zA-Z0-9_]+)\s*=\s*"([^"]+)"\s*;/i.test(code);
    const hasBool = /\bbool\s+([a-zA-Z0-9_]+)\s*=\s*(true|false)\s*;/i.test(code);
    const hasFor = /\bfor\s*\([^;]+;[^;]+;[^)]+\)/i.test(code);
    const hasIf = /\bif\s*\([^)]+\)/i.test(code);

    if (!code.trim()) {
        vars_triggerError('Editor Vazio!', 'Digite seu código C++ ou use os atalhos coloridos acima!', 'Declare suas variáveis, crie o loop for e adicione um if.');
        vars_running = false;
        document.getElementById('vars_btn_run').disabled = false;
        return;
    }

    if (!hasInt) {
        vars_triggerError('Falta uma variável int!', 'Declare pelo menos uma variável inteira.', 'Exemplo: <code>int bateria = 100;</code>');
        vars_running = false;
        document.getElementById('vars_btn_run').disabled = false;
        return;
    }

    if (!hasFloat) {
        vars_triggerError('Falta uma variável float!', 'Declare uma variável com casas decimais.', 'Exemplo: <code>float velocidade = 4.5;</code>');
        vars_running = false;
        document.getElementById('vars_btn_run').disabled = false;
        return;
    }

    if (!hasString) {
        vars_triggerError('Falta uma variável String!', 'Declare uma variável de texto entre aspas.', 'Exemplo: <code>String status = "EXPLORANDO";</code>');
        vars_running = false;
        document.getElementById('vars_btn_run').disabled = false;
        return;
    }

    if (!hasBool) {
        vars_triggerError('Falta uma variável bool!', 'Declare uma variável booleana true ou false.', 'Exemplo: <code>bool escudo = true;</code>');
        vars_running = false;
        document.getElementById('vars_btn_run').disabled = false;
        return;
    }

    if (!hasFor) {
        vars_triggerError('Falta o laço FOR!', 'Como revisão de loops, utilize um laço for para explorar os setores.', 'Exemplo: <code>for (int setor = 1; setor <= 4; setor++) { ... }</code>');
        vars_running = false;
        document.getElementById('vars_btn_run').disabled = false;
        return;
    }

    if (!hasIf) {
        vars_triggerError('Falta a condicional IF!', 'Como revisão de decisões, adicione uma checagem if para verificar o escudo ou bateria.', 'Exemplo: <code>if (escudo == true) { ... }</code>');
        vars_running = false;
        document.getElementById('vars_btn_run').disabled = false;
        return;
    }

    // Extrair valores se existirem
    let bat = 60;
    let vel = 4.5;
    let cristais = 20;
    let esc = true;
    const mBat = code.match(/\bbateria\s*=\s*(\d+)/);
    if (mBat) bat = parseInt(mBat[1], 10);
    const mVel = code.match(/\bvelocidade\s*=\s*(\d+\.?\d*)/);
    if (mVel) vel = parseFloat(mVel[1]);
    const mEsc = code.match(/\bescudo\s*=\s*(true|false)/);
    if (mEsc) esc = mEsc[1] === 'true';

    // Passo 1: Liga faróis e escudo
    vars_renderArena(8, { bateria: bat, cristais: 0, velocidade: vel, escudo: esc });
    playSound('step');

    setTimeout(() => {
        // Passo 2: Avança e minera cristais
        playSound('success');
        vars_renderArena(8, { bateria: bat, cristais, velocidade: vel, escudo: esc });
        const actor = document.getElementById('rover_actor');
        if (actor) actor.style.left = '220px';
        vars_spawnCrystalParticles(260, 50);
        vars_spawnSparks(250, 40);
        vars_showToast('🚀 FIRMWARE DO ROVER CARREGADO COM SUCESSO!', '#38BDF8', 120, 20);

        vars_renderRamBoxes([
            { addr: '0x01A0', type: 'int', name: 'bateria', val: String(bat), updated: true },
            { addr: '0x01A2', type: 'int', name: 'cristais', val: String(cristais), updated: true },
            { addr: '0x01A4', type: 'float', name: 'velocidade', val: String(vel), updated: true },
            { addr: '0x01A8', type: 'bool', name: 'escudo', val: String(esc), updated: true },
            { addr: '0x01B0', type: 'String', name: 'status', val: '"MISSAO OK"', updated: true }
        ]);

        setTimeout(() => {
            vars_showWin(8, 'Mestre Supremo Maker: Variáveis, Loops & Decisões!', 'Você construiu o firmware completo do Rover em C++, unindo variáveis, laço for e decisão if/else com perfeição!');
        }, 1000);
    }, 600);
}

/* ================= TRATAMENTO DE ERROS E SOLUÇÕES ================= */

function vars_triggerError(title, msg, hint) {
    if (!vars_errors_count[vars_level]) vars_errors_count[vars_level] = 0;
    vars_errors_count[vars_level]++;

    const solData = vars_levels_data[vars_level]?.solution || '';
    if (typeof triggerErrorSplash === 'function') {
        triggerErrorSplash(title, msg, hint, '💥', solData, `vars_lvl_${vars_level}`, 3);
    } else {
        alert(`${title}\n${msg}\n${hint}`);
    }
    vars_updateSolutionButtonState();
}

function vars_updateSolutionButtonState() {
    const attempts = (typeof currentAttemptsMap !== 'undefined' && currentAttemptsMap[`vars_lvl_${vars_level}`]) || vars_errors_count[vars_level] || 0;
    const btn = document.getElementById('vars_btn_solution');
    const box = document.getElementById('vars_solution_box');
    const solT = document.getElementById('vars_solution_text');
    const solData = vars_levels_data[vars_level]?.solution || '';

    if (btn) {
        if (attempts >= 3) {
            btn.disabled = false;
            btn.innerHTML = '<i class="fa-solid fa-lightbulb"></i> <span>💡 Ver / Ocultar Resolução Liberada (3/3 erros)</span>';
            btn.style.opacity = '1';
            btn.style.boxShadow = '0 0 20px rgba(245,158,11,0.5)';
            // SE O JOGADOR ERRAR 3 VEZES: MOSTRA O RESULTADO AUTOMATICAMENTE
            if (box) {
                box.style.display = 'block';
                if (solT) solT.innerText = solData;
            }
        } else {
            btn.disabled = true;
            btn.innerHTML = `<i class="fa-solid fa-lock"></i> <span>💡 Resolução Bloqueada (${attempts}/3 erros)</span>`;
            btn.style.opacity = '0.6';
            btn.style.boxShadow = 'none';
            if (box) box.style.display = 'none';
        }
    }
}

function vars_toggleSolution() {
    const attempts = (typeof currentAttemptsMap !== 'undefined' && currentAttemptsMap[`vars_lvl_${vars_level}`]) || vars_errors_count[vars_level] || 0;
    if (attempts < 3) return;
    const box = document.getElementById('vars_solution_box');
    const solT = document.getElementById('vars_solution_text');
    const solData = vars_levels_data[vars_level]?.solution || '';
    if (!box) return;
    const isOpen = box.style.display === 'block';
    box.style.display = isOpen ? 'none' : 'block';
    if (!isOpen && solT) solT.innerText = solData;
}

function vars_applyCurrentSolution() {
    const lvl = vars_level;
    const data = vars_levels_data[lvl];
    if (!data) return;

    if (lvl === 1) {
        const vi = document.getElementById('vars_n1_vidas_init');
        const c1 = document.getElementById('vars_n1_cmd1');
        const c2 = document.getElementById('vars_n1_cmd2');
        const c3 = document.getElementById('vars_n1_cmd3');
        if (vi) vi.value = '3';
        if (c1) c1.value = 'moedas = moedas + 10;';
        if (c2) c2.value = 'vidas = vidas - 1;';
        if (c3) c3.value = 'pontos = moedas * 100;';
    } else if (lvl === 2) {
        const tp = document.getElementById('vars_n2_tipo');
        const cl = document.getElementById('vars_n2_calc');
        if (tp) tp.value = 'float';
        if (cl) cl.value = 'tempMedia = (tempManha + tempTarde) / 2.0;';
    } else if (lvl === 3) {
        const tp = document.getElementById('vars_n3_tipo_str');
        const is = document.getElementById('vars_n3_input_senha');
        const tr = document.getElementById('vars_n3_trava_cmd');
        if (tp) tp.value = 'String';
        if (is) is.value = 'ARDUINO2026';
        if (tr) tr.value = 'travaAberta = true;';
    } else if (lvl === 4) {
        const cond = document.getElementById('vars_n4_loop_cond');
        const cmd = document.getElementById('vars_n4_energia_cmd');
        if (cond) cond.value = 'ciclo <= 4;';
        if (cmd) cmd.value = 'energia = energia + 25;';
    } else if (lvl === 5) {
        const cond = document.getElementById('vars_n5_loop_cond');
        const cCmd = document.getElementById('vars_n5_cristais_cmd');
        const bCmd = document.getElementById('vars_n5_bateria_cmd');
        if (cond) cond.value = 'setor <= 4;';
        if (cCmd) cCmd.value = 'cristais = cristais + 5;';
        if (bCmd) bCmd.value = 'bateria = bateria - 10;';
    } else if (lvl === 6) {
        const cond = document.getElementById('vars_n6_if_cond');
        const fan = document.getElementById('vars_n6_fan_cmd');
        if (cond) cond.value = 'temperatura > tempLimite';
        if (fan) fan.value = 'ventiladorLigado = true; statusClima = "ALERTA: VENTILADOR LIGADO";';
    } else if (lvl === 7) {
        const cond = document.getElementById('vars_n7_if_cond');
        const fr = document.getElementById('vars_n7_freio_cmd');
        if (cond) cond.value = 'distanciaObstaculo < distanciaSegura';
        if (fr) fr.value = 'freioEmergencia = true; alertaPiloto = "PERIGO: FREIO ACIONADO!";';
    } else if (lvl === 8) {
        const inp = document.getElementById('vars_code_input');
        if (inp) {
            inp.value = `int bateria = 100;\nint cristais = 0;\nfloat velocidade = 4.5;\nString status = "EXPLORANDO";\nbool escudo = true;\n\nfor (int setor = 1; setor <= 4; setor++) {\n    cristais = cristais + 5;\n    bateria = bateria - 10;\n}\n\nif (escudo == true) {\n    status = "ROVER PROTEGIDO";\n}`;
            vars_handleIdeInput();
        }
    }

    vars_updateLiveCpp();
    if (typeof playSound === 'function') playSound('success');
    vars_showToast('✨ Resolução aplicada com sucesso! Clique em EXECUTAR!', '#10B981');
}

/* ================= MODAL DE VITÓRIA & PROGRESSÃO ================= */

function vars_showWin(lvl, title, msg) {
    playSound('success');
    triggerConfetti(3500);

    const saved = getLevels('variaveis_levels');
    if (!saved.includes(lvl)) {
        saved.push(lvl);
        localStorage.setItem('variaveis_levels', JSON.stringify(saved));
        if (typeof updateTrail === 'function') updateTrail();
        if (typeof updateHubProgress === 'function') updateHubProgress();
    }
    vars_updateLevelButtons();

    // Rastreia o tempo do Leaderboard Speedrun
    let speedrunHTML = '';
    if (window.makerLeaderboard) {
        const elapsed = window.makerLeaderboard.stopTimer('variaveis', lvl);
        const res = window.makerLeaderboard.recordCompletion('variaveis', lvl, elapsed);
        speedrunHTML = window.makerLeaderboard.generateWinTimeCardHTML('variaveis', lvl, res);
    }

    const modal = document.getElementById('vars_win_modal');
    const mTitle = document.getElementById('vars_modal_title');
    const mText = document.getElementById('vars_modal_text');
    if (mTitle) mTitle.innerText = title;
    if (mText) mText.innerHTML = msg + speedrunHTML;
    if (modal) modal.classList.add('active');
}

function vars_closeWinModal() {
    const modal = document.getElementById('vars_win_modal');
    if (modal) modal.classList.remove('active');
    vars_running = false;
    document.getElementById('vars_btn_run').disabled = false;

    if (vars_level < 8) {
        vars_switchLevel(vars_level + 1);
    } else {
        openTab('tab-trail');
    }
}

/* ================= MINI-IDE HELPERS, ATALHOS & EXPANSÃO ================= */

const VARS_SNIPPETS = {
    bateria: 'int bateria = 100;\n',
    cristais: 'int cristais = 0;\n',
    velocidade: 'float velocidade = 4.5;\n',
    status: 'String status = "EXPLORANDO";\n',
    escudo: 'bool escudo = true;\n',
    for_setores: 'for (int setor = 1; setor <= 4; setor++) {\n    cristais = cristais + 5;\n    bateria = bateria - 10;\n}\n',
    if_escudo: 'if (escudo == true) {\n    status = "ROVER PROTEGIDO";\n}\n',
    bateria_sub: 'bateria = bateria - 10;\n'
};

let vars_lastSelectionPos = null;

function vars_trackCursor() {
    const input = document.getElementById('vars_code_input');
    if (input && typeof input.selectionStart === 'number') {
        vars_lastSelectionPos = input.selectionStart;
    }
}

function vars_insertSnippet(key) {
    const txt = VARS_SNIPPETS[key] || key;
    vars_insertText(txt);
}

function vars_insertText(txt) {
    const input = document.getElementById('vars_code_input');
    if (!input) return;

    let start = (typeof input.selectionStart === 'number') ? input.selectionStart : input.value.length;
    let end = (typeof input.selectionEnd === 'number') ? input.selectionEnd : start;

    if (document.activeElement !== input) {
        if (typeof vars_lastSelectionPos === 'number' && vars_lastSelectionPos >= 0) {
            start = end = vars_lastSelectionPos;
        } else {
            start = end = input.value.length;
        }
    }

    const old = input.value || '';
    input.value = old.substring(0, start) + txt + old.substring(end);
    const newPos = start + txt.length;
    input.selectionStart = newPos;
    input.selectionEnd = newPos;
    vars_lastSelectionPos = newPos;
    input.focus();

    const popup = document.getElementById('vars_autocomplete_list');
    if (popup) popup.style.display = 'none';
    vars_currentMatches = [];

    vars_handleIdeInput();
    if (typeof playSound === 'function') playSound('click');
}

function vars_clearIde() {
    const input = document.getElementById('vars_code_input');
    if (!input) return;
    if (confirm('Deseja limpar todo o código do editor?')) {
        input.value = '';
        vars_lastSelectionPos = 0;
        vars_handleIdeInput();
        playSound('click');
        const popup = document.getElementById('vars_autocomplete_list');
        if (popup) popup.style.display = 'none';
    }
}

function vars_handleIdeInput() {
    const input = document.getElementById('vars_code_input');
    const lineNumbers = document.getElementById('vars_line_numbers');
    const codeEl = document.getElementById('vars_arduino_code');
    if (!input) return;

    const lines = input.value.split('\n').length;
    if (lineNumbers) {
        lineNumbers.innerHTML = Array.from({ length: Math.max(lines, 12) }, (_, i) => i + 1).join('<br>');
    }

    if (codeEl && vars_level === 8) {
        codeEl.innerText = `// ==========================================
// AULA 5 — MINI-IDE C++ (ARDUINO UNO)
// Nível 8: Computador de Bordo do Rover Marciano
// ==========================================

${input.value || '// Digite suas variáveis, laço for e if/else aqui...'}`;
    }
}

function vars_toggleExpandIde() {
    const ide = document.getElementById('vars_ide_n8');
    const icon = document.getElementById('vars_expand_icon');
    const label = document.getElementById('vars_expand_label');
    if (!ide) return;

    const isExpanded = ide.classList.toggle('vars-ide-maximized');
    if (icon) icon.className = isExpanded ? 'fa-solid fa-compress' : 'fa-solid fa-expand';
    if (label) label.innerText = isExpanded ? 'Recolher IDE' : 'Expandir IDE';

    if (isExpanded) {
        vars_showToast('⛶ Modo Tela Expandida Ativado! (Pressione ESC ou clique para recolher)', '#38BDF8');
        playSound('click');
        const input = document.getElementById('vars_code_input');
        if (input) input.focus();
    } else {
        vars_showToast('Editor recolhido ao tamanho padrão', '#94A3B8');
        playSound('click');
    }
}

/* ================= AUTOCOMPLETE PROFISSIONAL (PADRÃO AULA 4) ================= */

const VARS_AUTOCOMPLETE_OPTIONS = [
    { trigger: 'int',       label: 'int bateria = 100;',                           insert: 'int bateria = 100;\n' },
    { trigger: 'bat',       label: 'int bateria = 100;',                           insert: 'int bateria = 100;\n' },
    { trigger: 'cris',      label: 'int cristais = 0;',                            insert: 'int cristais = 0;\n' },
    { trigger: 'flo',       label: 'float velocidade = 4.5;',                      insert: 'float velocidade = 4.5;\n' },
    { trigger: 'vel',       label: 'float velocidade = 4.5;',                      insert: 'float velocidade = 4.5;\n' },
    { trigger: 'str',       label: 'String status = "EXPLORANDO";',                insert: 'String status = "EXPLORANDO";\n' },
    { trigger: 'stat',      label: 'status = "MISSAO CUMPRIDA";',                  insert: 'status = "MISSAO CUMPRIDA";\n' },
    { trigger: 'boo',       label: 'bool escudo = true;',                          insert: 'bool escudo = true;\n' },
    { trigger: 'esc',       label: 'bool escudo = true;',                          insert: 'bool escudo = true;\n' },
    { trigger: 'for',       label: 'for (int setor = 1; setor <= 4; setor++) { ... }', insert: 'for (int setor = 1; setor <= 4; setor++) {\n    cristais = cristais + 5;\n    bateria = bateria - 10;\n}\n' },
    { trigger: 'if',        label: 'if (escudo == true) { ... }',                  insert: 'if (escudo == true) {\n    status = "ROVER PROTEGIDO";\n}\n' },
    { trigger: 'if_cris',   label: 'if (cristais >= 20) { ... }',                  insert: 'if (cristais >= 20) {\n    status = "MISSAO CUMPRIDA";\n}\n' },
    { trigger: 'if_bat',    label: 'if (bateria <= 20) { ... }',                   insert: 'if (bateria <= 20) {\n    status = "BATERIA FRACA";\n}\n' },
    { trigger: 'els',       label: 'else { ... }',                                 insert: 'else {\n    status = "ALERTA";\n}\n' },
    { trigger: 'sub',       label: 'bateria = bateria - 10;',                      insert: 'bateria = bateria - 10;\n' },
    { trigger: 'som',       label: 'cristais = cristais + 5;',                     insert: 'cristais = cristais + 5;\n' },
    { trigger: 'ser',       label: 'Serial.println("ROVER ATIVO");',               insert: 'Serial.println("ROVER ATIVO");\n' },
    { trigger: 'tru',       label: 'true',                                         insert: 'true' },
    { trigger: 'fal',       label: 'false',                                        insert: 'false' },
    { trigger: 'del',       label: 'delay(1000);',                                 insert: 'delay(1000);\n' }
];

let vars_currentMatches = [];
let vars_activeAcIndex = 0;

function vars_ideAutoComplete(textarea) {
    const list = document.getElementById('vars_autocomplete_list');
    if (!list) return;

    const code = textarea.value;
    const cursorPos = (typeof textarea.selectionStart === 'number') ? textarea.selectionStart : code.length;
    vars_lastSelectionPos = cursorPos;
    const beforeCursor = code.substring(0, cursorPos);
    const lastWord = beforeCursor.split(/[\s\n{};(),]+/).pop();

    if (!lastWord || lastWord.length < 2) {
        list.style.display = 'none';
        vars_currentMatches = [];
        return;
    }

    const lowWord = lastWord.toLowerCase();
    const matches = VARS_AUTOCOMPLETE_OPTIONS.filter(o =>
        o.trigger.toLowerCase().startsWith(lowWord) ||
        o.label.toLowerCase().includes(lowWord) ||
        o.insert.toLowerCase().includes(lowWord)
    );

    if (matches.length === 0) {
        list.style.display = 'none';
        vars_currentMatches = [];
        return;
    }

    vars_currentMatches = matches;
    vars_activeAcIndex = 0;

    const linesBefore = beforeCursor.split('\n');
    const lineIndex = Math.min(linesBefore.length - 1, 12);
    list.style.top = `${Math.min((lineIndex * 26) + 38, 300)}px`;
    list.style.display = 'block';

    vars_renderAutoCompleteList();
}

function vars_renderAutoCompleteList() {
    const list = document.getElementById('vars_autocomplete_list');
    if (!list) return;

    list.innerHTML = vars_currentMatches.map((m, idx) => {
        const isSel = idx === vars_activeAcIndex;
        const escInsert = m.insert.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, '\\n');
        return `<div class="vars-ac-item ${isSel ? 'active' : ''}" 
                     onclick="vars_applyAutoComplete('${escInsert}')"
                     onmouseenter="vars_activeAcIndex = ${idx}; vars_renderAutoCompleteList();">
            <span>${m.label}</span>
            <span class="vars-ac-shortcut">Tab ⇥</span>
        </div>`;
    }).join('');
}

function vars_applyAutoComplete(insertText) {
    const textarea = document.getElementById('vars_code_input');
    const list = document.getElementById('vars_autocomplete_list');
    if (!textarea) return;

    const pos = (typeof textarea.selectionStart === 'number') ? textarea.selectionStart : textarea.value.length;
    const before = textarea.value.substring(0, pos);
    const after = textarea.value.substring(pos);
    const cleanBefore = before.replace(/[a-zA-Z0-9_]+$/, '');
    textarea.value = cleanBefore + insertText + after;
    const newPos = cleanBefore.length + insertText.length;
    textarea.selectionStart = textarea.selectionEnd = newPos;
    vars_lastSelectionPos = newPos;
    textarea.focus();
    if (list) list.style.display = 'none';
    vars_currentMatches = [];
    vars_handleIdeInput();
    if (typeof playSound === 'function') playSound('step');
}

function vars_handleIdeKeyDown(e, textarea) {
    const list = document.getElementById('vars_autocomplete_list');
    const isListOpen = list && list.style.display === 'block' && vars_currentMatches.length > 0;

    if (isListOpen) {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            vars_activeAcIndex = (vars_activeAcIndex + 1) % vars_currentMatches.length;
            vars_renderAutoCompleteList();
            return;
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            vars_activeAcIndex = (vars_activeAcIndex - 1 + vars_currentMatches.length) % vars_currentMatches.length;
            vars_renderAutoCompleteList();
            return;
        } else if (e.key === 'Tab' || e.key === 'Enter') {
            e.preventDefault();
            const chosen = vars_currentMatches[vars_activeAcIndex];
            if (chosen) {
                vars_applyAutoComplete(chosen.insert);
            }
            return;
        } else if (e.key === 'Escape') {
            list.style.display = 'none';
            vars_currentMatches = [];
            return;
        }
    } else {
        if (e.key === 'Tab') {
            e.preventDefault();
            vars_insertText('    ');
            return;
        } else if (e.key === 'Escape') {
            const ide = document.getElementById('vars_ide_n8');
            if (ide && ide.classList.contains('vars-ide-maximized')) {
                vars_toggleExpandIde();
                return;
            }
        }
    }
}

function vars_copyCode() {
    const code = document.getElementById('vars_arduino_code')?.innerText || '';
    if (navigator.clipboard) {
        navigator.clipboard.writeText(code).then(() => {
            playSound('success');
            alert('Código Arduino C++ copiado com sucesso!');
        });
    }
}

// Fechamento de autocomplete ao clicar fora da IDE
document.addEventListener('click', (e) => {
    const list = document.getElementById('vars_autocomplete_list');
    const input = document.getElementById('vars_code_input');
    if (list && list.style.display === 'block' && e.target !== input && !list.contains(e.target)) {
        list.style.display = 'none';
        vars_currentMatches = [];
    }
});

window.vars_insertSnippet = vars_insertSnippet;
window.vars_insertText = vars_insertText;
window.vars_clearIde = vars_clearIde;
window.vars_handleIdeInput = vars_handleIdeInput;
window.vars_toggleExpandIde = vars_toggleExpandIde;
window.vars_ideAutoComplete = vars_ideAutoComplete;
window.vars_renderAutoCompleteList = vars_renderAutoCompleteList;
window.vars_applyAutoComplete = vars_applyAutoComplete;
window.vars_handleIdeKeyDown = vars_handleIdeKeyDown;
window.vars_trackCursor = vars_trackCursor;
window.vars_applyCurrentSolution = vars_applyCurrentSolution;
window.vars_updateSolutionButtonState = vars_updateSolutionButtonState;
window.vars_toggleSolution = vars_toggleSolution;


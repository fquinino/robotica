/* ==========================================================================
   AULA 7 — CIRCUITOS & PROTOBOARD MAKER (MONTAGEM DO SEMÁFORO DE 3 LEDS)
   Single-Page Application para ensino de montagem de circuitos físicos com
   Protoboard de 30 Pinos, Resistores de 300Ω, 3 LEDs e Arduino UNO.
   Foco pedagógico: Crianças de ~12 anos (Linguagem lúdica, visual e tátil).
   ========================================================================== */

function loadLabmaker() {
    const container = document.getElementById('tab-labmaker');
    if (!container) return;

    container.innerHTML = `
        <style>
            .lab-wrap { max-width:1200px; margin:0 auto; padding:10px 14px 40px; font-family:'Nunito', sans-serif; }
            .lab-title-font { font-family:'Fredoka One', cursive; }

            /* Cabeçalho do Laboratório */
            .lab-header { background:linear-gradient(135deg, #0F172A 0%, #1E293B 100%); border:2px solid #38BDF8; border-radius:24px; padding:22px 26px; margin-bottom:20px; box-shadow:0 10px 30px rgba(0,0,0,0.4); position:relative; overflow:hidden; }
            .lab-header::after { content:''; position:absolute; top:-40px; right:-40px; width:160px; height:160px; background:radial-gradient(circle, rgba(56,189,248,0.25) 0%, transparent 70%); pointer-events:none; }
            
            .lab-badge-kit { background:rgba(16,185,129,0.15); border:1px solid #10B981; color:#34D399; font-size:0.85rem; font-weight:800; padding:5px 14px; border-radius:20px; display:inline-flex; align-items:center; gap:6px; }
            .lab-stars-row { display:flex; gap:10px; align-items:center; margin-top:10px; flex-wrap:wrap; }
            .lab-star-chip { background:#0F172A; border:1px solid #334155; padding:6px 14px; border-radius:14px; font-size:0.85rem; font-weight:800; color:#94A3B8; display:flex; align-items:center; gap:6px; }
            .lab-star-chip.active { border-color:#F59E0B; background:rgba(245,158,11,0.12); color:#FDE68A; }

            /* Trilha Contínua de 6 Níveis & Barra de Progresso */
            .lab-step-bar { background:#0F172A; border:2px solid #334155; border-radius:20px; padding:12px 16px; margin-bottom:24px; display:flex; gap:8px; overflow-x:auto; }
            .lab-step-item { display:flex; align-items:center; gap:8px; cursor:pointer; padding:10px 16px; border-radius:14px; transition:0.2s; white-space:nowrap; opacity:0.65; background:#1E293B; border:1px solid transparent; }
            .lab-step-item:hover { opacity:1; border-color:#38BDF8; transform:translateY(-1px); }
            .lab-step-item.active { opacity:1; background:linear-gradient(135deg, #0284C7, #0369A1); border-color:#38BDF8; color:white; box-shadow:0 0 16px rgba(56,189,248,0.4); }
            .lab-step-item.completed { opacity:1; border-color:#10B981; }
            .lab-step-circle { width:26px; height:26px; border-radius:50%; background:#334155; color:white; display:flex; align-items:center; justify-content:center; font-weight:900; font-size:0.8rem; }
            .lab-step-item.active .lab-step-circle { background:white; color:#0369A1; }
            .lab-step-item.completed .lab-step-circle { background:#10B981; color:white; }

            /* Cards de Conteúdo Pedagógico */
            .lab-guide-card { background:#1E293B; border:2px solid #334155; border-radius:24px; padding:28px; margin-bottom:20px; box-shadow:0 8px 30px rgba(0,0,0,0.35); }
            .lab-guide-header { display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #334155; padding-bottom:16px; margin-bottom:20px; flex-wrap:wrap; gap:12px; }
            .lab-guide-title { font-size:1.6rem; color:white; margin:0; display:flex; align-items:center; gap:12px; }
            .lab-guide-tag { background:#0F172A; border:1px solid #38BDF8; color:#38BDF8; padding:5px 14px; border-radius:20px; font-weight:800; font-size:0.85rem; }

            /* Hero Banner de Raio-X Explodido 3D */
            .vg-hero-card { background:linear-gradient(135deg, #020617 0%, #0F172A 100%); border:2px solid #38BDF8; border-radius:22px; padding:22px; margin:20px 0; box-shadow:0 12px 36px rgba(0,0,0,0.5), inset 0 0 25px rgba(56,189,248,0.08); }

            /* Carrossel Interativo da Galeria Visual da Aula 7 */
            .vg-carousel-container { background:#0F172A; border:2px solid #38BDF8; border-radius:22px; padding:20px; margin:24px 0; box-shadow:0 12px 36px rgba(0,0,0,0.45); position:relative; }
            .vg-carousel-topbar { display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px; margin-bottom:14px; }
            .vg-carousel-counter-badge { background:rgba(56,189,248,0.15); border:1px solid #38BDF8; color:#38BDF8; padding:5px 14px; border-radius:14px; font-weight:900; font-size:0.85rem; font-family:'Fira Code', monospace; display:flex; align-items:center; gap:6px; }
            
            /* Abas de Navegação Rápida do Carrossel */
            .vg-carousel-nav-tabs { display:flex; gap:8px; overflow-x:auto; padding:4px 2px 10px; margin-bottom:12px; scrollbar-width:thin; }
            .vg-carousel-tab-btn { background:#1E293B; border:1px solid #334155; color:#94A3B8; padding:8px 14px; border-radius:12px; font-size:0.82rem; font-weight:800; cursor:pointer; white-space:nowrap; transition:all 0.2s; display:inline-flex; align-items:center; gap:6px; flex-shrink:0; }
            .vg-carousel-tab-btn:hover { border-color:#38BDF8; color:#F8FAFC; transform:translateY(-1px); }
            .vg-carousel-tab-btn.active { background:linear-gradient(135deg, #0284C7, #0369A1); border-color:#38BDF8; color:white; box-shadow:0 4px 14px rgba(56,189,248,0.35); }
            
            /* Viewport e Trilho Deslizante */
            .vg-carousel-viewport { overflow:hidden; border-radius:18px; background:#020617; border:2px solid #1E293B; position:relative; }
            .vg-carousel-track { display:flex; transition:transform 0.35s cubic-bezier(0.25, 1, 0.5, 1); width:100%; will-change:transform; }
            .vg-carousel-slide { flex:0 0 100%; min-width:100%; max-width:100%; box-sizing:border-box; padding:22px 24px; display:grid; grid-template-columns:1.2fr 1fr; gap:22px; align-items:center; }
            @media (max-width:768px) {
                .vg-carousel-slide { grid-template-columns:1fr; padding:16px; gap:16px; }
            }
            
            /* Controles Inferiores (Anterior, Dots, Próximo) */
            .vg-carousel-controls { display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px; margin-top:16px; padding-top:14px; border-top:1px solid #1E293B; }
            .vg-carousel-arrow-btn { background:#1E293B; border:1px solid #475569; color:#F8FAFC; padding:10px 18px; border-radius:12px; font-size:0.88rem; font-weight:800; cursor:pointer; transition:all 0.2s; display:inline-flex; align-items:center; gap:8px; user-select:none; }
            .vg-carousel-arrow-btn:hover:not(:disabled) { background:#38BDF8; color:#0F172A; border-color:#38BDF8; transform:translateY(-1px); box-shadow:0 4px 12px rgba(56,189,248,0.3); }
            .vg-carousel-arrow-btn:disabled { opacity:0.4; cursor:not-allowed; }
            .vg-carousel-dots { display:flex; gap:8px; align-items:center; }
            .vg-carousel-dot { width:10px; height:10px; border-radius:50%; background:#334155; cursor:pointer; transition:all 0.25s cubic-bezier(0.4, 0, 0.2, 1); }
            .vg-carousel-dot:hover { background:#64748B; }
            .vg-carousel-dot.active { background:#38BDF8; width:26px; border-radius:10px; box-shadow:0 0 10px rgba(56,189,248,0.6); }

            .vg-fig-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:8px; }
            .vg-fig-badge { padding:4px 10px; border-radius:12px; font-size:0.75rem; font-weight:900; letter-spacing:0.5px; }
            .vg-svg-box { background:#0B1120; border-radius:14px; border:1px solid #1E293B; padding:12px; display:flex; align-items:center; justify-content:center; box-shadow:inset 0 0 20px rgba(0,0,0,0.6); }

            /* Caixas de Destaque Didático */
            .lab-box-recap { background:linear-gradient(135deg, rgba(245,158,11,0.12), rgba(217,119,6,0.06)); border:2px solid #F59E0B; border-radius:18px; padding:18px 22px; margin:16px 0; }
            .lab-box-alert { background:linear-gradient(135deg, rgba(239,68,68,0.12), rgba(185,28,28,0.06)); border:2px solid #EF4444; border-radius:18px; padding:18px 22px; margin:16px 0; }
            .lab-box-success { background:linear-gradient(135deg, rgba(16,185,129,0.12), rgba(5,150,105,0.06)); border:2px solid #10B981; border-radius:18px; padding:18px 22px; margin:16px 0; }
            .lab-box-info { background:linear-gradient(135deg, rgba(56,189,248,0.12), rgba(2,132,199,0.06)); border:2px solid #38BDF8; border-radius:18px; padding:18px 22px; margin:16px 0; }

            /* Tabela de Pinos Físicos */
            .lab-pins-table { width:100%; border-collapse:collapse; margin:16px 0; border-radius:14px; overflow:hidden; }
            .lab-pins-table th { background:#0F172A; color:#38BDF8; padding:12px 14px; text-align:left; font-weight:800; border-bottom:2px solid #334155; }
            .lab-pins-table td { background:#1E293B; color:#CBD5E1; padding:12px 14px; border-bottom:1px solid #334155; font-size:0.95rem; }
            .lab-pins-table tr:hover td { background:#243248; }

            /* Layout da Bancada Interativa */
            .lab-workbench-grid { display:grid; grid-template-columns:1fr; gap:22px; }
            .lab-board-card { background:#0B1120; border:3px solid #334155; border-radius:24px; padding:22px; box-shadow:inset 0 0 40px rgba(0,0,0,0.8); position:relative; overflow-x:auto; }

            /* A PROTOBOARD DE 30 PINOS DA BANCADA */
            .bb-body { background:#F8FAFC; border-radius:18px; padding:18px 20px; border:4px solid #CBD5E1; box-shadow:0 15px 35px rgba(0,0,0,0.5), inset 0 0 15px rgba(0,0,0,0.06); width:max-content; margin:0 auto; user-select:none; position:relative; }
            .bb-title-label { text-align:center; font-family:'Fredoka One', cursive; color:#94A3B8; font-size:1.05rem; letter-spacing:2px; margin-bottom:10px; }

            .bb-power-strip { display:flex; flex-direction:column; gap:6px; background:#F1F5F9; padding:8px 14px; border-radius:10px; border:1px solid #E2E8F0; }
            .bb-power-row { display:flex; align-items:center; gap:8px; }
            .bb-power-sign { width:16px; font-weight:900; font-family:monospace; font-size:1.1rem; text-align:center; }
            .bb-power-sign.plus { color:#EF4444; }
            .bb-power-sign.minus { color:#0284C7; }
            .bb-power-line { height:2px; flex:1; }
            .bb-power-line.plus { background:#EF4444; }
            .bb-power-line.minus { background:#0284C7; }
            .bb-power-holes { display:grid; grid-template-columns:repeat(30, 20px); gap:6px; }

            .bb-center-area { margin:14px 0; display:flex; flex-direction:column; gap:14px; }
            .bb-cols-header { display:grid; grid-template-columns:repeat(30, 20px); gap:6px; margin-left:22px; }
            .bb-col-tag { font-size:0.75rem; color:#64748B; font-family:monospace; text-align:center; font-weight:bold; }

            .bb-terminal-bank { display:flex; gap:6px; align-items:center; }
            .bb-row-alphabet { display:flex; flex-direction:column; gap:6px; width:16px; text-align:center; font-family:monospace; font-weight:900; font-size:0.8rem; color:#64748B; }
            .bb-matrix { display:flex; flex-direction:column; gap:6px; }
            .bb-matrix-row { display:grid; grid-template-columns:repeat(30, 20px); gap:6px; }

            .bb-center-trench { height:16px; background:#E2E8F0; border-radius:8px; border-top:1px solid #CBD5E1; border-bottom:1px solid #CBD5E1; margin:2px 0 2px 22px; position:relative; }
            .bb-center-trench::after { content:'CALHA CENTRAL ISOLANTE (DIVIDE LADO A-E DO LADO F-J)'; position:absolute; top:-7px; left:50%; transform:translateX(-50%); font-size:0.62rem; color:#94A3B8; font-weight:900; background:#F8FAFC; padding:0 8px; letter-spacing:1px; white-space:nowrap; }

            .bb-pin-hole { width:18px; height:18px; background:#1E293B; border-radius:50%; border:2px solid #94A3B8; cursor:pointer; transition:0.15s all; position:relative; }
            .bb-pin-hole:hover { transform:scale(1.35); border-color:#38BDF8; background:#0284C7; box-shadow:0 0 10px #38BDF8; z-index:40; }
            .bb-pin-hole.glow-net { border-color:#10B981; background:#059669; box-shadow:0 0 8px #10B981; }

            .bb-svg-overlay { position:absolute; top:0; left:0; width:100%; height:100%; pointer-events:none; z-index:30; }
            .bb-comp-interactive { pointer-events:all; cursor:pointer; }
            .bb-comp-interactive:hover { filter:drop-shadow(0 0 10px #38BDF8) brightness(1.25); }
            .bb-comp-interactive.active-inspect { filter:drop-shadow(0 0 14px #F59E0B) brightness(1.35); }

            /* Tooltip Dinâmica Flutuante da Bancada */
            .lab-bench-tooltip {
                position: fixed;
                display: none;
                z-index: 9999;
                background: #0B132B;
                border: 2px solid #38BDF8;
                border-radius: 16px;
                padding: 14px 18px;
                color: #F8FAFC;
                box-shadow: 0 16px 36px rgba(0,0,0,0.85), 0 0 20px rgba(56,189,248,0.3);
                max-width: 320px;
                font-size: 0.86rem;
                line-height: 1.5;
                pointer-events: auto;
                transition: opacity 0.15s ease, transform 0.15s ease;
                transform: translate(-50%, -100%) translateY(-14px);
            }
            .lab-bench-tooltip::after {
                content: '';
                position: absolute;
                bottom: -8px;
                left: 50%;
                transform: translateX(-50%);
                border-width: 8px 8px 0;
                border-style: solid;
                border-color: #38BDF8 transparent transparent;
                display: block;
                width: 0;
            }
            .lab-bench-tooltip.pinned {
                border-color: #F59E0B;
                box-shadow: 0 16px 40px rgba(0,0,0,0.9), 0 0 25px rgba(245,158,11,0.45);
            }
            .lab-bench-tooltip.pinned::after {
                border-color: #F59E0B transparent transparent;
            }

            /* Ficha Técnica e Inspetor de Componentes */
            .lab-inspector-box {
                background: #0F172A;
                border: 2px solid #334155;
                border-radius: 20px;
                padding: 20px 24px;
                margin-top: 18px;
                box-shadow: 0 10px 25px rgba(0,0,0,0.4);
            }
            .lab-inspector-chips {
                display: flex;
                gap: 8px;
                flex-wrap: wrap;
                margin-bottom: 14px;
            }
            .lab-chip-btn {
                background: #1E293B;
                border: 1px solid #334155;
                color: #CBD5E1;
                padding: 6px 14px;
                border-radius: 20px;
                font-size: 0.8rem;
                font-weight: 800;
                cursor: pointer;
                transition: 0.2s all;
                display: inline-flex;
                align-items: center;
                gap: 6px;
            }
            .lab-chip-btn:hover {
                border-color: #38BDF8;
                color: white;
                background: #0284C7;
                transform: translateY(-2px);
            }
            .lab-chip-btn.active {
                background: linear-gradient(135deg, #0284C7, #0369A1);
                border-color: #38BDF8;
                color: white;
                box-shadow: 0 0 12px rgba(56,189,248,0.5);
            }

            .bb-label-pill {
                pointer-events: all;
                cursor: pointer;
                transition: transform 0.15s;
            }
            .bb-label-pill:hover {
                transform: scale(1.08);
            }

            /* A PLACA ARDUINO UNO ESTILIZADA */
            .ard-uno-board { background:linear-gradient(135deg, #0284C7 0%, #0369A1 100%); border:4px solid #075985; border-radius:20px; padding:20px; box-shadow:0 12px 30px rgba(0,0,0,0.5); color:white; min-width:320px; position:relative; }
            .ard-chip { background:#0F172A; border:2px solid #334155; border-radius:8px; padding:12px; font-family:monospace; font-size:0.85rem; color:#38BDF8; text-align:center; font-weight:bold; letter-spacing:1px; margin:16px 0; box-shadow:inset 0 0 10px rgba(0,0,0,0.5); }
            .ard-usb-port { background:#94A3B8; border:2px solid #475569; border-radius:6px; padding:6px 14px; display:inline-flex; align-items:center; gap:8px; font-weight:900; color:#0F172A; font-size:0.8rem; box-shadow:0 3px 8px rgba(0,0,0,0.3); }
            .ard-led-on { width:12px; height:12px; border-radius:50%; background:#334155; display:inline-block; transition:0.3s; }
            .ard-led-on.active { background:#10B981; box-shadow:0 0 15px #10B981, 0 0 30px #10B981; }
            .ard-led-l { width:12px; height:12px; border-radius:50%; background:#334155; display:inline-block; transition:0.3s; }
            .ard-led-l.active { background:#F59E0B; box-shadow:0 0 15px #F59E0B; }

            /* Botoeira de Testes */
            .lab-btn-test { padding:10px 18px; border-radius:14px; font-weight:900; font-size:0.95rem; cursor:pointer; border:none; transition:0.2s; display:inline-flex; align-items:center; gap:8px; }
            .lab-btn-test:hover { transform:scale(1.05); }
            .lab-btn-red { background:linear-gradient(135deg, #EF4444, #DC2626); color:white; box-shadow:0 4px 15px rgba(239,68,68,0.4); }
            .lab-btn-yellow { background:linear-gradient(135deg, #F59E0B, #D97706); color:#0F172A; box-shadow:0 4px 15px rgba(245,158,11,0.4); }
            .lab-btn-green { background:linear-gradient(135deg, #10B981, #059669); color:white; box-shadow:0 4px 15px rgba(16,185,129,0.4); }
            .lab-btn-auto { background:linear-gradient(135deg, #8B5CF6, #6D28D9); color:white; box-shadow:0 4px 15px rgba(139,92,246,0.4); }
            .lab-nav-btn { background:#1E293B; color:#94A3B8; border:2px solid #334155; padding:12px 22px; border-radius:30px; font-weight:900; font-size:0.95rem; cursor:pointer; transition:0.25s all; display:inline-flex; align-items:center; gap:8px; }
            .lab-nav-btn:hover { border-color:#38BDF8; color:white; transform:translateY(-2px); }
            .lab-nav-btn.active { background:linear-gradient(135deg, #0284C7, #38BDF8); color:#0F172A; border-color:#38BDF8; box-shadow:0 0 20px rgba(56,189,248,0.5); }

            .lab-meter-box { background:#0F172A; border:2px solid #334155; border-radius:14px; padding:10px 16px; font-family:monospace; display:flex; gap:14px; align-items:center; }
            .lab-meter-val { font-size:1.15rem; font-weight:900; }

            /* Estilos do Explorador Raio-X */
            .vg-board-container { background:#F8FAFC; border-radius:20px; padding:20px; border:4px solid #CBD5E1; box-shadow:0 12px 30px rgba(0,0,0,0.5); user-select:none; position:relative; overflow-x:auto; margin:16px auto; }
            .vg-board-title { text-align:center; font-family:'Fredoka One', cursive; color:#64748B; font-size:1.05rem; letter-spacing:1px; margin-bottom:12px; }
            .vg-grid-cols { display:flex; gap:12px; justify-content:flex-start; overflow-x:auto; padding:8px 6px; scrollbar-width:thin; }
            .vg-col-item { display:flex; flex-direction:column; align-items:center; position:relative; min-width:44px; }
            .vg-col-header-num { font-family:monospace; font-weight:900; font-size:0.95rem; color:#475569; margin-bottom:4px; text-align:center; }
            .vg-col-role-pill { font-size:0.6rem; font-weight:900; padding:2px 4px; border-radius:6px; margin-bottom:4px; white-space:nowrap; letter-spacing:0.3px; text-align:center; }

            .vg-metal-strip { position:absolute; width:36px; background:linear-gradient(180deg, #FDE68A 0%, #D97706 100%); border-radius:8px; opacity:0.35; pointer-events:none; z-index:1; border:2px dashed #B45309; transition:0.3s; }
            .vg-metal-strip.active { opacity:0.9; background:linear-gradient(180deg, #6EE7B7 0%, #059669 100%); border:2px solid #10B981; box-shadow:0 0 20px rgba(16,185,129,0.8); animation:vgPulse 0.9s infinite alternate; }
            @keyframes vgPulse { 0% { filter:brightness(1); } 100% { filter:brightness(1.3); } }

            .vg-strip-top { top:52px; height:185px; }
            .vg-strip-bot { top:282px; height:185px; }

            .vg-hole-cell { width:32px; height:32px; background:#1E293B; border-radius:50%; border:2px solid #94A3B8; margin:4px 0; cursor:pointer; transition:0.18s; z-index:5; display:flex; flex-direction:column; align-items:center; justify-content:center; color:#94A3B8; font-size:0.75rem; font-family:monospace; font-weight:bold; position:relative; }
            .vg-hole-cell:hover { transform:scale(1.3); border-color:#38BDF8; background:#0284C7; color:white; box-shadow:0 0 12px #38BDF8; z-index:10; }
            .vg-hole-cell.lit { border-color:#10B981; background:#059669; color:white; box-shadow:0 0 10px #10B981; }
            .vg-hole-cell.selected { border-color:#F59E0B; background:#D97706; color:white; box-shadow:0 0 16px #F59E0B; transform:scale(1.25); z-index:10; }

            /* Estilos Específicos para Pinos de Componentes no Explorador Tátil */
            .vg-hole-cell.pin-jumper { border-width:2.5px; font-weight:900; }
            .vg-hole-cell.pin-jumper-red { border-color:#EF4444; background:#7F1D1D; color:#FECACA; box-shadow:0 0 8px rgba(239,68,68,0.6); }
            .vg-hole-cell.pin-jumper-yel { border-color:#F59E0B; background:#78350F; color:#FEF3C7; box-shadow:0 0 8px rgba(245,158,11,0.6); }
            .vg-hole-cell.pin-jumper-gre { border-color:#10B981; background:#064E3B; color:#A7F3D0; box-shadow:0 0 8px rgba(16,185,129,0.6); }

            .vg-hole-cell.pin-led-anode { border-width:3px; font-weight:900; box-shadow:0 0 12px rgba(255,255,255,0.4); }
            .vg-hole-cell.pin-led-anode-red { border-color:#F87171; background:#DC2626; color:white; }
            .vg-hole-cell.pin-led-anode-yel { border-color:#FBBF24; background:#D97706; color:white; }
            .vg-hole-cell.pin-led-anode-gre { border-color:#34D399; background:#059669; color:white; }

            .vg-hole-cell.pin-led-cathode { border-width:2.5px; border-style:dashed; font-weight:900; }
            .vg-hole-cell.pin-led-cathode-red { border-color:#EF4444; background:#450A0A; color:#FCA5A5; }
            .vg-hole-cell.pin-led-cathode-yel { border-color:#F59E0B; background:#451A03; color:#FDE68A; }
            .vg-hole-cell.pin-led-cathode-gre { border-color:#10B981; background:#022C22; color:#6EE7B7; }

            .vg-hole-cell.pin-resistor { border-color:#F59E0B; background:#78350F; color:#FDE68A; border-width:2.5px; box-shadow:0 0 10px rgba(245,158,11,0.5); font-weight:900; }
            .vg-hole-cell.pin-resistor-gnd { border-color:#0284C7; background:#0C4A6E; color:#7DD3FC; border-width:2.5px; box-shadow:0 0 8px rgba(2,132,199,0.5); font-weight:900; }

            .vg-trench-row { height:36px; background:#E2E8F0; border-radius:10px; border-top:2px solid #CBD5E1; border-bottom:2px solid #CBD5E1; margin:10px 0; display:flex; align-items:center; justify-content:center; position:relative; }
            .vg-trench-tag { font-size:0.72rem; font-weight:900; color:#EF4444; background:#FFFFFF; padding:4px 14px; border-radius:12px; border:2px solid #FCA5A5; letter-spacing:1px; white-space:nowrap; box-shadow:0 2px 6px rgba(0,0,0,0.06); }

            .vg-info-panel { background:#0F172A; border:2px solid #334155; border-radius:20px; padding:20px 24px; margin-top:16px; box-shadow:0 8px 24px rgba(0,0,0,0.4); }

            /* Comparador de LED */
            .vg-compare-grid { display:grid; grid-template-columns:repeat(auto-fit, minmax(300px, 1fr)); gap:18px; margin-top:16px; }
            .vg-comp-card { background:#0F172A; border-radius:20px; padding:20px; display:flex; flex-direction:column; justify-content:space-between; transition:0.25s; }
            .vg-comp-card.good { border:3px solid #10B981; background:linear-gradient(135deg, rgba(16,185,129,0.08), #0F172A); }
            .vg-comp-card.bad { border:3px solid #EF4444; background:linear-gradient(135deg, rgba(239,68,68,0.08), #0F172A); }
            .vg-led-glow-fx { filter:drop-shadow(0 0 20px #EF4444) brightness(1.6); animation:ledBeacon 1.2s infinite alternate; }
            @keyframes ledBeacon { 0% { opacity:0.85; } 100% { opacity:1; filter:drop-shadow(0 0 30px #EF4444) brightness(1.9); } }

            /* Quiz e Missões */
            .lab-quiz-card { background:#1E293B; border:2px solid #334155; border-radius:20px; padding:22px; margin-bottom:16px; }
            .lab-quiz-opt { background:#0F172A; border:2px solid #334155; color:#E2E8F0; padding:12px 18px; border-radius:14px; font-weight:700; cursor:pointer; transition:0.2s; text-align:left; width:100%; margin-top:10px; display:flex; align-items:center; gap:10px; }
            .lab-quiz-opt:hover { border-color:#38BDF8; background:#1E293B; transform:translateX(4px); }
            .lab-quiz-opt.correct { border-color:#10B981; background:rgba(16,185,129,0.2); color:#A7F3D0; }
            .lab-quiz-opt.wrong { border-color:#EF4444; background:rgba(239,68,68,0.2); color:#FECACA; }
            .lab-mission-card { background:#1E293B; border:2px solid #334155; border-radius:20px; padding:22px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:16px; margin-bottom:16px; transition:0.25s; }
            .lab-mission-card:hover { border-color:#38BDF8; transform:translateY(-2px); }
            .lab-mission-card.done { border-color:#10B981; background:rgba(16,185,129,0.06); }

            /* Estilos de Bloqueio, Desafios Maker e Trilha Progressiva */
            .lab-step-item.locked { opacity:0.45; cursor:not-allowed; filter:grayscale(0.7); }
            .lab-step-item.locked:hover { transform:none; border-color:#334155; }
            .lab-step-item.completed .lab-step-circle { background:#10B981 !important; color:#0F172A !important; border-color:#34D399 !important; box-shadow:0 0 12px rgba(16,185,129,0.7) !important; }

            .lab-challenge-box {
                background: linear-gradient(135deg, rgba(15,23,42,0.95), rgba(30,41,59,0.95));
                border: 2px solid #38BDF8;
                border-radius: 22px;
                padding: 22px 24px;
                margin: 26px 0 16px;
                box-shadow: 0 12px 32px rgba(0,0,0,0.5), 0 0 20px rgba(56,189,248,0.2);
                transition: 0.3s all ease;
            }
            .lab-challenge-box.completed {
                border-color: #10B981;
                box-shadow: 0 12px 32px rgba(0,0,0,0.5), 0 0 25px rgba(16,185,129,0.3);
            }
            .lab-challenge-box.pulse-focus {
                animation: challengePulse 0.5s 3;
            }
            @keyframes challengePulse {
                0%, 100% { transform:scale(1); border-color:#F59E0B; }
                50% { transform:scale(1.02); border-color:#EF4444; box-shadow:0 0 30px rgba(239,68,68,0.6); }
            }
            .lab-challenge-status {
                background: #1E293B;
                border: 1px solid #64748B;
                color: #F8FAFC;
                padding: 6px 14px;
                border-radius: 20px;
                font-size: 0.82rem;
                font-weight: 800;
                display: inline-flex;
                align-items: center;
                gap: 6px;
            }
            .lab-challenge-status.unlocked {
                background: rgba(16,185,129,0.2);
                border-color: #10B981;
                color: #A7F3D0;
            }

            .lab-nav-btn.locked {
                opacity: 0.55;
                cursor: not-allowed;
                background: #1E293B !important;
                border-color: #475569 !important;
                color: #94A3B8 !important;
                transform: none !important;
                box-shadow: none !important;
            }

            /* Toast flutuante de feedback */
            #lab_maker_toast {
                position: fixed;
                bottom: 24px;
                right: 24px;
                background: #0B132B;
                border: 2px solid #38BDF8;
                border-radius: 16px;
                padding: 14px 20px;
                color: white;
                font-size: 0.95rem;
                font-weight: 800;
                box-shadow: 0 16px 36px rgba(0,0,0,0.85);
                z-index: 10000;
                display: none;
                align-items: center;
                gap: 12px;
                max-width: 420px;
                animation: toastSlideUp 0.3s ease;
            }
            @keyframes toastSlideUp {
                from { opacity:0; transform:translateY(20px); }
                to { opacity:1; transform:translateY(0); }
            }
        </style>

        <div class="lab-wrap">
            <!-- CABEÇALHO DA AULA 7 -->
            <div class="lab-header">
                <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:14px;">
                    <div>
                        <div class="lab-badge-kit">
                            <i class="fa-solid fa-microchip"></i> AULA PRÁTICA MAKER COM ARDUINO UNO & PROTOBOARD REAL
                        </div>
                        <h1 class="lab-title-font" style="font-size:2.2rem;color:white;margin:10px 0 6px;">
                            🔌 Aula 7: Circuitos & Protoboard (Montagem do Semáforo)
                        </h1>
                        <p style="color:#94A3B8;font-size:1.05rem;max-width:850px;line-height:1.6;margin:0;">
                            Aprenda a regra de ouro das conexões na <b>Protoboard de 30 Pinos</b>, descubra o segredo das pernas dos <b>Resistores de 300Ω</b>, a polaridade dos <b>3 LEDs</b> e conecte tudo ao <b>Arduino UNO</b> para preparar o semáforo para a programação!
                        </p>
                    </div>

                    <div style="text-align:right;">
                        <button onclick="lab_toggleUsbPower()" id="lab_header_usb_btn" style="background:#0F172A;border:2px solid #38BDF8;color:#38BDF8;padding:10px 18px;border-radius:16px;font-weight:900;font-size:0.95rem;cursor:pointer;display:inline-flex;align-items:center;gap:8px;">
                            <i class="fa-solid fa-plug"></i> <span id="lab_usb_btn_txt">Ligar Cabo USB</span>
                        </button>
                    </div>
                </div>

                <!-- Status de Estrelas da Aula 7 -->
                <div class="lab-stars-row">
                    <span style="font-weight:800;color:#CBD5E1;font-size:0.9rem;">⭐ Missões Maker da Aula 7:</span>
                    <div class="lab-star-chip" id="lab_chip_lvl1">
                        <i class="fa-solid fa-shield-halved"></i> Nível 1: Resistores 300Ω (Sem Polaridade)
                    </div>
                    <div class="lab-star-chip" id="lab_chip_lvl2">
                        <i class="fa-solid fa-lightbulb"></i> Nível 2: 3 LEDs do Semáforo (Polaridade +/-)
                    </div>
                    <div class="lab-star-chip" id="lab_chip_lvl3">
                        <i class="fa-solid fa-bolt"></i> Nível 3: Arduino UNO & O Grande Teste
                    </div>
                </div>
            </div>

            <!-- BARRA DE PROGRESSO GLOBAL CONTÍNUA -->
            <div style="background:#0F172A;border:1px solid #334155;border-radius:16px;padding:12px 18px;margin-bottom:18px;">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;font-size:0.88rem;flex-wrap:wrap;gap:8px;">
                    <span style="color:#94A3B8;font-weight:700;"><i class="fa-solid fa-route" style="color:#38BDF8;"></i> Trilha de Aprendizado da Aula 7:</span>
                    <div style="display:flex;align-items:center;gap:12px;">
                        <button type="button" onclick="lab_resetLevelProgress()" style="background:#1E293B;border:1px solid #334155;color:#94A3B8;padding:4px 12px;border-radius:10px;font-size:0.75rem;font-weight:800;cursor:pointer;display:inline-flex;align-items:center;gap:6px;" title="Reiniciar todos os níveis da Aula 7 do zero"><i class="fa-solid fa-rotate-left"></i> Reiniciar Fases</button>
                        <span id="lab_progress_text" style="color:#38BDF8;font-weight:900;">Nível 1 de 6 (17% Concluído)</span>
                    </div>
                </div>
                <div style="width:100%;height:10px;background:#1E293B;border-radius:6px;overflow:hidden;position:relative;">
                    <div id="lab_global_progress_fill" style="width:16.6%;height:100%;background:linear-gradient(90deg, #0284C7, #38BDF8, #10B981);border-radius:6px;transition:width 0.4s ease;"></div>
                </div>
            </div>

            <!-- TRILHA CONTÍNUA DE APRENDIZADO MAKER (6 NÍVEIS PROGRESSIVOS) -->
            <div class="lab-step-bar">
                <div class="lab-step-item active" id="lab_step_btn_1" onclick="lab_switchGuideStep(1)" title="Nível 1: Anatomia da Protoboard & Raio-X">
                    <div class="lab-step-circle">1</div>
                    <div><b>1. Protoboard & Raio-X</b></div>
                </div>
                <div class="lab-step-item" id="lab_step_btn_2" onclick="lab_switchGuideStep(2)" title="Nível 2: 3 Resistores de 300Ω">
                    <div class="lab-step-circle">2</div>
                    <div><b>2. Resistores 300Ω</b></div>
                </div>
                <div class="lab-step-item" id="lab_step_btn_3" onclick="lab_switchGuideStep(3)" title="Nível 3: 3 LEDs do Semáforo">
                    <div class="lab-step-circle">3</div>
                    <div><b>3. 3 LEDs (Semáforo)</b></div>
                </div>
                <div class="lab-step-item" id="lab_step_btn_4" onclick="lab_switchGuideStep(4)" title="Nível 4: Jumpers no Arduino UNO">
                    <div class="lab-step-circle">4</div>
                    <div><b>4. Jumpers no Arduino</b></div>
                </div>
                <div class="lab-step-item" id="lab_step_btn_5" onclick="lab_switchGuideStep(5)" title="Nível 5: Bancada Virtual & Grande Teste">
                    <div class="lab-step-circle">5</div>
                    <div><b>5. Bancada & Teste</b></div>
                </div>
                <div class="lab-step-item" id="lab_step_btn_6" onclick="lab_switchGuideStep(6)" title="Nível 6: Missões Maker & Quiz">
                    <div class="lab-step-circle">6</div>
                    <div><b>6. Quiz & Missões ⭐</b></div>
                </div>
            </div>

            <!-- ================= NÍVEL 1: A PROTOBOARD 1-30, FIGURAS ILUSTRADAS & RAIO-X INTEGRADO ================= -->
            <div class="lab-guide-card" id="lab_guide_step_1">
                <div class="lab-guide-header">
                    <div>
                        <h2 class="lab-title-font lab-guide-title">
                            <span style="color:#38BDF8;">🧱 Nível 1:</span> Desvendando a Protoboard de 30 Pinos & Raio-X Interno
                        </h2>
                        <span style="color:#94A3B8;font-size:0.95rem;">Anatomia física, lâminas condutoras, calha central e barramentos</span>
                    </div>
                    <div class="lab-guide-tag">Nível 1 de 6</div>
                </div>

                <div style="font-size:1.05rem;line-height:1.7;color:#CBD5E1;">
                    <p>
                        Olá, jovem Maker! Bem-vindo à sua primeira montagem física com circuitos reais! 
                        A sua <b>Protoboard</b> (placa de ensaio) é uma ferramenta mágica que permite ligar fios e componentes <b>sem precisar de ferro de solda</b>! 
                        Mas para montar o semáforo sem curto-circuito, você precisa enxergar com <b>olhos de raio-x</b> o que está escondido por baixo do plástico branco:
                    </p>

                    <!-- HERO: VISÃO GERAL EM CORTE RAIO-X 3D (REESTRUTURADO SEM SOBREPOSIÇÃO) -->
                    <div class="vg-hero-card">
                        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;flex-wrap:wrap;gap:12px;">
                            <div style="display:flex;align-items:center;gap:12px;">
                                <span style="font-size:2rem;">🔬</span>
                                <div>
                                    <h3 class="lab-title-font" style="color:#38BDF8;font-size:1.35rem;margin:0;">
                                        Visão Geral em Corte Raio-X: Como a Protoboard Funciona por Dentro
                                    </h3>
                                    <span style="color:#94A3B8;font-size:0.9rem;display:block;margin-top:3px;">
                                        Veja como o plástico branco esconde fileiras de lâminas de bronze e a calha divisória:
                                    </span>
                                </div>
                            </div>
                            <span style="background:linear-gradient(135deg, #0284C7, #0369A1);color:white;padding:6px 14px;border-radius:20px;font-size:0.8rem;font-weight:900;letter-spacing:0.5px;">
                                CORTE DIDÁTICO EM ALTA DEFINIÇÃO
                            </span>
                        </div>

                        <!-- LEGENDA RÁPIDA DAS CAMADAS -->
                        <div style="display:flex;gap:10px;flex-wrap:wrap;margin-bottom:12px;font-size:0.8rem;">
                            <span style="background:#1E293B;color:#FDE68A;border:1px solid #D97706;padding:3px 10px;border-radius:12px;">
                                🟡 Lâminas Metálicas de Bronze (5 furos unidos na vertical)
                            </span>
                            <span style="background:#1E293B;color:#EF4444;border:1px solid #DC2626;padding:3px 10px;border-radius:12px;">
                                🔴 Barramento +5V (Horizontal Contínuo)
                            </span>
                            <span style="background:#1E293B;color:#38BDF8;border:1px solid #0284C7;padding:3px 10px;border-radius:12px;">
                                🔵 Barramento Terra GND (Horizontal Contínuo)
                            </span>
                            <span style="background:#1E293B;color:#FCA5A5;border:1px solid #7F1D1D;padding:3px 10px;border-radius:12px;">
                                ⛔ Calha Central Isolante (Divisória Plástica)
                            </span>
                        </div>

                        <!-- DIAGRAMA SVG EM ALTA DEFINIÇÃO DO CORTE DA PROTOBOARD -->
                        <div style="background:#020617;border-radius:18px;border:1px solid #1E293B;padding:16px;overflow-x:auto;">
                            <svg width="100%" height="370" viewBox="0 0 840 370" style="min-width:760px;display:block;margin:0 auto;font-family:system-ui, -apple-system, sans-serif;">
                                <defs>
                                    <linearGradient id="brassGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                                        <stop offset="0%" stop-color="#FDE68A"/>
                                        <stop offset="50%" stop-color="#F59E0B"/>
                                        <stop offset="100%" stop-color="#B45309"/>
                                    </linearGradient>
                                    <linearGradient id="brassGradDim" x1="0%" y1="0%" x2="0%" y2="100%">
                                        <stop offset="0%" stop-color="#78350F" stop-opacity="0.8"/>
                                        <stop offset="100%" stop-color="#451A03" stop-opacity="0.8"/>
                                    </linearGradient>
                                    <linearGradient id="plateGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                                        <stop offset="0%" stop-color="#1E293B"/>
                                        <stop offset="100%" stop-color="#0F172A"/>
                                    </linearGradient>
                                </defs>

                                <!-- 1. BARRAMENTO HORIZONTAL SUPERIOR (y: 15 a 50) -->
                                <rect x="30" y="15" width="780" height="36" rx="8" fill="#0B132B" stroke="#1E293B" stroke-width="1.5"/>
                                <!-- Linha Vermelha +5V -->
                                <circle cx="50" cy="33" r="10" fill="#EF4444"/>
                                <text x="50" y="37" fill="white" font-size="12" font-weight="900" text-anchor="middle">+</text>
                                <line x1="70" y1="33" x2="520" y2="33" stroke="#EF4444" stroke-width="3"/>
                                <circle cx="120" cy="33" r="4" fill="#0F172A" stroke="#EF4444" stroke-width="1.5"/>
                                <circle cx="170" cy="33" r="4" fill="#0F172A" stroke="#EF4444" stroke-width="1.5"/>
                                <circle cx="220" cy="33" r="4" fill="#0F172A" stroke="#EF4444" stroke-width="1.5"/>
                                <circle cx="270" cy="33" r="4" fill="#0F172A" stroke="#EF4444" stroke-width="1.5"/>
                                <circle cx="320" cy="33" r="4" fill="#0F172A" stroke="#EF4444" stroke-width="1.5"/>
                                <rect x="540" y="23" width="250" height="20" rx="10" fill="#1E293B" stroke="#EF4444" stroke-width="1"/>
                                <text x="665" y="37" fill="#FCA5A5" font-size="9" font-weight="bold" text-anchor="middle">
                                    BARRAMENTO (+) : 30 Furos Interligados na Horizontal
                                </text>

                                <!-- 2. BLOCO SUPERIOR A-E (y: 60 a 200) -->
                                <!-- Indicadores de Linhas A, B, C, D, E à esquerda -->
                                <g id="row_labels_top">
                                    <rect x="30" y="65" width="22" height="135" rx="6" fill="#1E293B" stroke="#334155"/>
                                    <text x="41" y="86" fill="#38BDF8" font-size="11" font-weight="900" text-anchor="middle">A</text>
                                    <text x="41" y="112" fill="#38BDF8" font-size="11" font-weight="900" text-anchor="middle">B</text>
                                    <text x="41" y="138" fill="#38BDF8" font-size="11" font-weight="900" text-anchor="middle">C</text>
                                    <text x="41" y="164" fill="#38BDF8" font-size="11" font-weight="900" text-anchor="middle">D</text>
                                    <text x="41" y="190" fill="#38BDF8" font-size="11" font-weight="900" text-anchor="middle">E</text>
                                </g>

                                <!-- Placa de Fundo do Bloco Superior -->
                                <rect x="60" y="65" width="750" height="135" rx="10" fill="url(#plateGrad)" stroke="#334155" stroke-width="2"/>

                                <!-- Presilhas Metálicas de Bronze (Colunas 8 a 23) -->
                                <!-- Col 8 (Neutro) -->
                                <rect x="80" y="75" width="30" height="115" rx="5" fill="url(#brassGradDim)" stroke="#92400E" stroke-width="1"/>
                                <text x="95" y="70" fill="#64748B" font-size="9" font-weight="bold" text-anchor="middle">8</text>
                                
                                <!-- Col 9 (Neutro) -->
                                <rect x="120" y="75" width="30" height="115" rx="5" fill="url(#brassGradDim)" stroke="#92400E" stroke-width="1"/>
                                <text x="135" y="70" fill="#64748B" font-size="9" font-weight="bold" text-anchor="middle">9</text>

                                <!-- Col 10: SINAL D13 & ANODO LED VERMELHO -->
                                <rect x="160" y="75" width="32" height="115" rx="5" fill="url(#brassGrad)" stroke="#EF4444" stroke-width="2.5"/>
                                <rect x="145" y="48" width="62" height="18" rx="6" fill="#EF4444"/>
                                <text x="176" y="61" fill="white" font-size="8.5" font-weight="900" text-anchor="middle">🔴 Col 10 (+)</text>

                                <!-- Col 11: CATODO LED VERMELHO & RESISTOR 1 -->
                                <rect x="202" y="75" width="32" height="115" rx="5" fill="url(#brassGrad)" stroke="#10B981" stroke-width="2.5"/>
                                <rect x="195" y="48" width="56" height="18" rx="6" fill="#10B981"/>
                                <text x="223" y="61" fill="white" font-size="8.5" font-weight="900" text-anchor="middle">🛡️ Col 11 (R1)</text>

                                <!-- Colunas 12 a 15 (Neutras) -->
                                <rect x="244" y="75" width="28" height="115" rx="4" fill="url(#brassGradDim)"/>
                                <text x="258" y="70" fill="#64748B" font-size="8" text-anchor="middle">12</text>
                                <rect x="282" y="75" width="28" height="115" rx="4" fill="url(#brassGradDim)"/>
                                <text x="296" y="70" fill="#64748B" font-size="8" text-anchor="middle">13</text>
                                <rect x="320" y="75" width="28" height="115" rx="4" fill="url(#brassGradDim)"/>
                                <text x="334" y="70" fill="#64748B" font-size="8" text-anchor="middle">14</text>
                                <rect x="358" y="75" width="28" height="115" rx="4" fill="url(#brassGradDim)"/>
                                <text x="372" y="70" fill="#64748B" font-size="8" text-anchor="middle">15</text>

                                <!-- Col 16: SINAL D12 & ANODO LED AMARELO -->
                                <rect x="396" y="75" width="32" height="115" rx="5" fill="url(#brassGrad)" stroke="#F59E0B" stroke-width="2.5"/>
                                <rect x="382" y="48" width="60" height="18" rx="6" fill="#F59E0B"/>
                                <text x="412" y="61" fill="#0F172A" font-size="8.5" font-weight="900" text-anchor="middle">🟡 Col 16 (+)</text>

                                <!-- Col 17: CATODO LED AMARELO & RESISTOR 2 -->
                                <rect x="438" y="75" width="32" height="115" rx="5" fill="url(#brassGrad)" stroke="#10B981" stroke-width="2.5"/>
                                <rect x="430" y="48" width="56" height="18" rx="6" fill="#10B981"/>
                                <text x="458" y="61" fill="white" font-size="8.5" font-weight="900" text-anchor="middle">🛡️ Col 17 (R2)</text>

                                <!-- Colunas 18 a 21 (Neutras) -->
                                <rect x="480" y="75" width="28" height="115" rx="4" fill="url(#brassGradDim)"/>
                                <text x="494" y="70" fill="#64748B" font-size="8" text-anchor="middle">18</text>
                                <rect x="518" y="75" width="28" height="115" rx="4" fill="url(#brassGradDim)"/>
                                <text x="532" y="70" fill="#64748B" font-size="8" text-anchor="middle">19</text>
                                <rect x="556" y="75" width="28" height="115" rx="4" fill="url(#brassGradDim)"/>
                                <text x="570" y="70" fill="#64748B" font-size="8" text-anchor="middle">20</text>
                                <rect x="594" y="75" width="28" height="115" rx="4" fill="url(#brassGradDim)"/>
                                <text x="608" y="70" fill="#64748B" font-size="8" text-anchor="middle">21</text>

                                <!-- Col 22: SINAL D11 & ANODO LED VERDE -->
                                <rect x="632" y="75" width="32" height="115" rx="5" fill="url(#brassGrad)" stroke="#34D399" stroke-width="2.5"/>
                                <rect x="618" y="48" width="60" height="18" rx="6" fill="#059669"/>
                                <text x="648" y="61" fill="white" font-size="8.5" font-weight="900" text-anchor="middle">🟢 Col 22 (+)</text>

                                <!-- Col 23: CATODO LED VERDE & RESISTOR 3 -->
                                <rect x="674" y="75" width="32" height="115" rx="5" fill="url(#brassGrad)" stroke="#10B981" stroke-width="2.5"/>
                                <rect x="666" y="48" width="56" height="18" rx="6" fill="#10B981"/>
                                <text x="694" y="61" fill="white" font-size="8.5" font-weight="900" text-anchor="middle">🛡️ Col 23 (R3)</text>

                                <!-- Col 24 -->
                                <rect x="716" y="75" width="28" height="115" rx="4" fill="url(#brassGradDim)"/>
                                <text x="730" y="70" fill="#64748B" font-size="8" text-anchor="middle">24</text>

                                <!-- Furos Perfurados Dentro das Presilhas (Linhas A a E) -->
                                <!-- Exemplo Coluna 10 (A, B, C, D, E) -->
                                <circle cx="176" cy="86" r="4.5" fill="#020617" stroke="#EF4444" stroke-width="1.5"/>
                                <circle cx="176" cy="112" r="4.5" fill="#020617"/>
                                <circle cx="176" cy="138" r="4.5" fill="#020617" stroke="#EF4444" stroke-width="1.5"/>
                                <circle cx="176" cy="164" r="4.5" fill="#020617"/>
                                <circle cx="176" cy="190" r="4.5" fill="#020617"/>

                                <!-- Exemplo Coluna 11 -->
                                <circle cx="218" cy="86" r="4.5" fill="#020617"/>
                                <circle cx="218" cy="112" r="4.5" fill="#020617"/>
                                <circle cx="218" cy="138" r="4.5" fill="#020617" stroke="#10B981" stroke-width="1.5"/>
                                <circle cx="218" cy="164" r="4.5" fill="#020617" stroke="#F59E0B" stroke-width="1.5"/>
                                <circle cx="218" cy="190" r="4.5" fill="#020617"/>

                                <!-- Balão Explicativo de Conexão Entre 10 e 11 -->
                                <path d="M 176 138 C 176 120, 218 120, 218 138" fill="none" stroke="#EF4444" stroke-width="3"/>
                                <circle cx="197" cy="120" r="8" fill="#EF4444"/>
                                <text x="197" y="123" fill="white" font-size="7" font-weight="bold" text-anchor="middle">LED</text>

                                <!-- 3. CALHA CENTRAL ISOLANTE (y: 210 a 245) - ESPAÇOSA E SEM SOBREPOSIÇÃO -->
                                <rect x="30" y="210" width="780" height="34" rx="8" fill="#0F172A" stroke="#334155" stroke-width="2"/>
                                <rect x="120" y="215" width="600" height="24" rx="12" fill="#450A0A" stroke="#EF4444" stroke-width="1.5"/>
                                <text x="420" y="231" fill="#FCA5A5" font-size="10" font-weight="900" text-anchor="middle" letter-spacing="0.5px">
                                    ⛔ CALHA CENTRAL ISOLANTE (FOSSO PLÁSTICO): O LADO A-E NUNCA ENCOSTA NO LADO F-J!
                                </text>

                                <!-- 4. BLOCO INFERIOR F-J (y: 255 a 320) -->
                                <g id="row_labels_bot">
                                    <rect x="30" y="255" width="22" height="65" rx="6" fill="#1E293B" stroke="#334155"/>
                                    <text x="41" y="272" fill="#F59E0B" font-size="10" font-weight="900" text-anchor="middle">F</text>
                                    <text x="41" y="287" fill="#F59E0B" font-size="10" font-weight="900" text-anchor="middle">G</text>
                                    <text x="41" y="302" fill="#F59E0B" font-size="10" font-weight="900" text-anchor="middle">H</text>
                                    <text x="41" y="316" fill="#F59E0B" font-size="10" font-weight="900" text-anchor="middle">I</text>
                                </g>
                                <rect x="60" y="255" width="750" height="65" rx="8" fill="#0B132B" stroke="#1E293B" stroke-width="1.5"/>
                                <text x="420" y="292" fill="#64748B" font-size="10.5" font-weight="bold" text-anchor="middle">
                                    Bloco Inferior (Furos F a J possuem suas próprias lâminas independentes, isoladas do bloco superior)
                                </text>

                                <!-- 5. CAMADA DE FUNDO: FITA ADESIVA ISOLANTE (y: 330 a 358) -->
                                <rect x="30" y="330" width="780" height="26" rx="6" fill="#FEF08A" opacity="0.35" stroke="#CA8A04" stroke-width="1.5"/>
                                <text x="420" y="347" fill="#CA8A04" font-size="10" font-weight="900" text-anchor="middle">
                                    CAMADA DE FUNDO: Fita adesiva amarela isolante (segura as lâminas metálicas no lugar e isola da sua mesa)
                                </text>
                            </svg>
                        </div>
                    </div>

                    <!-- CARROSSEL DA GALERIA VISUAL (DIMINUI SCROLL E FOCA NO ITEM SELECIONADO) -->
                    <div class="vg-carousel-container" id="vg_carousel_main">
                        <div class="vg-carousel-topbar">
                            <div>
                                <h3 class="lab-title-font" style="color:#38BDF8;font-size:1.35rem;margin:0 0 4px;display:flex;align-items:center;gap:10px;">
                                    <span>🔍 Galeria Visual Interativa (Carrossel)</span>
                                </h3>
                                <p style="color:#94A3B8;margin:0;font-size:0.88rem;">
                                    Explore cada parte interna da protoboard sem precisar rolar páginas longas!
                                </p>
                            </div>
                            <div class="vg-carousel-counter-badge" id="vg_carousel_counter">
                                <i class="fa-solid fa-layer-group"></i> <span>Card 1 de 7</span>
                            </div>
                        </div>

                        <!-- Abas de Navegação Rápida -->
                        <div class="vg-carousel-nav-tabs">
                            <button type="button" class="vg-carousel-tab-btn active" onclick="lab_carousel_goto(0)">📌 1. Garra Interna</button>
                            <button type="button" class="vg-carousel-tab-btn" onclick="lab_carousel_goto(1)">⚡ 2. Colunas A-E</button>
                            <button type="button" class="vg-carousel-tab-btn" onclick="lab_carousel_goto(2)">⛔ 3. Calha Central</button>
                            <button type="button" class="vg-carousel-tab-btn" onclick="lab_carousel_goto(3)">🔌 4. Colunas F-J</button>
                            <button type="button" class="vg-carousel-tab-btn" onclick="lab_carousel_goto(4)">🔋 5. Barramentos (+/-)</button>
                            <button type="button" class="vg-carousel-tab-btn" onclick="lab_carousel_goto(5)">⚠️ 6. Curto-Circuito</button>
                            <button type="button" class="vg-carousel-tab-btn" onclick="lab_carousel_goto(6)">🚦 7. Conexão Semáforo</button>
                        </div>

                        <!-- Viewport do Carrossel -->
                        <div class="vg-carousel-viewport">
                            <div class="vg-carousel-track" id="vg_carousel_track">
                                
                                <!-- SLIDE 1: GARRA DE PRESSÃO INTERNA -->
                                <div class="vg-carousel-slide">
                                    <div>
                                        <div class="vg-fig-header">
                                            <span class="vg-fig-badge" style="background:#8B5CF6;color:white;">ITEM 1 DE 7: GARRA INTERNA</span>
                                            <span style="color:#C4B5FD;font-weight:900;font-size:0.75rem;">SEM SOLDA</span>
                                        </div>
                                        <h4 class="lab-title-font" style="color:white;font-size:1.25rem;margin:6px 0 8px;">
                                            Como o Furinho Segura o Pino
                                        </h4>
                                        <p style="color:#CBD5E1;font-size:0.95rem;margin:0 0 10px;line-height:1.6;">
                                            Dentro de cada furo existe uma <b>pinça elástica de bronze fosforoso</b>. Quando você empurra o pino do jumper ou a perna do resistor, as duas lâminas se abrem e mordem o metal com pressão firme!
                                        </p>
                                        <div style="background:#0F172A;border-left:3px solid #8B5CF6;padding:8px 12px;border-radius:8px;color:#A78BFA;font-size:0.85rem;line-height:1.5;">
                                            💡 <b>Efeito Mola:</b> Garante contato elétrico perfeito sem precisar soldar nada!
                                        </div>
                                    </div>
                                    <div class="vg-svg-box">
                                        <svg width="290" height="135" viewBox="0 0 290 135">
                                            <rect x="95" y="8" width="100" height="30" fill="#F8FAFC" stroke="#CBD5E1" rx="6"/>
                                            <rect x="135" y="8" width="20" height="30" fill="#0F172A"/>
                                            <text x="145" y="24" fill="#94A3B8" font-size="7.5" font-weight="bold" text-anchor="middle">FURO</text>
                                            <rect x="142" y="2" width="6" height="65" rx="2" fill="#E2E8F0" stroke="#64748B"/>
                                            <text x="185" y="30" fill="#38BDF8" font-size="8" font-weight="bold">Pino Metálico</text>
                                            <path d="M 120 90 C 136 90 138 74 140 60" fill="none" stroke="#F59E0B" stroke-width="4" stroke-linecap="round"/>
                                            <path d="M 170 90 C 154 90 152 74 150 60" fill="none" stroke="#F59E0B" stroke-width="4" stroke-linecap="round"/>
                                            <text x="145" y="114" fill="#FBBF24" font-size="8.5" font-weight="bold" text-anchor="middle">Garra com Efeito Mola (Aperto Firme!)</text>
                                        </svg>
                                    </div>
                                </div>

                                <!-- SLIDE 2: COLUNAS A-E -->
                                <div class="vg-carousel-slide">
                                    <div>
                                        <div class="vg-fig-header">
                                            <span class="vg-fig-badge" style="background:#0284C7;color:white;">ITEM 2 DE 7: COLUNAS A-E</span>
                                            <span style="color:#38BDF8;font-weight:900;font-size:0.75rem;">5 FUROS = 1 CONDUTOR</span>
                                        </div>
                                        <h4 class="lab-title-font" style="color:white;font-size:1.25rem;margin:6px 0 8px;">
                                            Tiras Verticais Superiores (A a E)
                                        </h4>
                                        <p style="color:#CBD5E1;font-size:0.95rem;margin:0 0 10px;line-height:1.6;">
                                            Os 5 furos de <b>A até E</b> da mesma coluna estão soldados na mesma lâmina de metal! Se você colocar o pino 13 no <code>10A</code> e a perna do LED no <code>10C</code>, a corrente viaja pela lâmina e chega ao LED!
                                        </p>
                                        <div style="background:#0F172A;border-left:3px solid #0284C7;padding:8px 12px;border-radius:8px;color:#7DD3FC;font-size:0.85rem;line-height:1.5;">
                                            🔗 <b>Mesmo Nó:</b> Furos alinhados na mesma coluna (A-E) são como se fossem a mesma ponta de um fio.
                                        </div>
                                    </div>
                                    <div class="vg-svg-box">
                                        <svg width="290" height="135" viewBox="0 0 290 135">
                                            <rect x="20" y="10" width="250" height="115" rx="8" fill="#F8FAFC" stroke="#CBD5E1" stroke-width="2"/>
                                            <rect x="125" y="18" width="40" height="96" rx="6" fill="#F59E0B" opacity="0.35" stroke="#D97706" stroke-dasharray="3,2"/>
                                            <text x="145" y="16" fill="#0284C7" font-size="9" font-weight="bold" text-anchor="middle">Coluna 10 (A-E)</text>
                                            <circle cx="145" cy="30" r="4.5" fill="#1E293B" stroke="#0284C7" stroke-width="2"/><text x="132" y="33" fill="#64748B" font-size="7">A</text>
                                            <circle cx="145" cy="48" r="4.5" fill="#1E293B" stroke="#0284C7" stroke-width="2"/><text x="132" y="51" fill="#64748B" font-size="7">B</text>
                                            <circle cx="145" cy="66" r="4.5" fill="#1E293B" stroke="#0284C7" stroke-width="2"/><text x="132" y="69" fill="#64748B" font-size="7">C</text>
                                            <circle cx="145" cy="84" r="4.5" fill="#1E293B" stroke="#0284C7" stroke-width="2"/><text x="132" y="87" fill="#64748B" font-size="7">D</text>
                                            <circle cx="145" cy="102" r="4.5" fill="#1E293B" stroke="#0284C7" stroke-width="2"/><text x="132" y="105" fill="#64748B" font-size="7">E</text>
                                            <path d="M 145 30 L 145 102" stroke="#10B981" stroke-width="2.5" stroke-dasharray="3,3"/>
                                            <text x="205" y="62" fill="#10B981" font-size="9" font-weight="bold">Mesmo nó</text>
                                            <text x="205" y="74" fill="#64748B" font-size="7.5">condutor elétrico!</text>
                                        </svg>
                                    </div>
                                </div>

                                <!-- SLIDE 3: CALHA CENTRAL -->
                                <div class="vg-carousel-slide">
                                    <div>
                                        <div class="vg-fig-header">
                                            <span class="vg-fig-badge" style="background:#EF4444;color:white;">ITEM 3 DE 7: CALHA CENTRAL</span>
                                            <span style="color:#FCA5A5;font-weight:900;font-size:0.75rem;">ISOLAMENTO TOTAL</span>
                                        </div>
                                        <h4 class="lab-title-font" style="color:white;font-size:1.25rem;margin:6px 0 8px;">
                                            O Fosso Isolante (A-E NÃO Toca F-J)
                                        </h4>
                                        <p style="color:#CBD5E1;font-size:0.95rem;margin:0 0 10px;line-height:1.6;">
                                            No centro da placa existe uma fenda plástica funda. Ela <b>corta o metal</b>! O lado superior A-E <b>nunca encosta</b> no lado inferior F-J, servindo para isolar circuitos ou encaixar chips e microcontroladores.
                                        </p>
                                        <div style="background:#0F172A;border-left:3px solid #EF4444;padding:8px 12px;border-radius:8px;color:#FCA5A5;font-size:0.85rem;line-height:1.5;">
                                            ⛔ <b>Zero Contato:</b> 10E e 10F estão separados pela fenda plástica central!
                                        </div>
                                    </div>
                                    <div class="vg-svg-box">
                                        <svg width="290" height="135" viewBox="0 0 290 135">
                                            <rect x="15" y="18" width="115" height="98" rx="6" fill="#F8FAFC" stroke="#CBD5E1"/>
                                            <text x="72" y="36" fill="#0284C7" font-weight="bold" font-size="9" text-anchor="middle">Lado A-E (Cobre)</text>
                                            <rect x="48" y="46" width="48" height="52" rx="4" fill="#F59E0B" opacity="0.3"/>
                                            <rect x="135" y="12" width="20" height="110" fill="#334155" rx="3"/>
                                            <line x1="145" y1="18" x2="145" y2="116" stroke="#EF4444" stroke-width="2" stroke-dasharray="4,2"/>
                                            <text x="145" y="70" fill="#EF4444" font-size="14" font-weight="bold" text-anchor="middle">⛔</text>
                                            <rect x="160" y="18" width="115" height="98" rx="6" fill="#F8FAFC" stroke="#CBD5E1"/>
                                            <text x="217" y="36" fill="#F59E0B" font-weight="bold" font-size="9" text-anchor="middle">Lado F-J (Cobre)</text>
                                            <rect x="193" y="46" width="48" height="52" rx="4" fill="#F59E0B" opacity="0.3"/>
                                            <text x="145" y="127" fill="#FCA5A5" font-size="8" font-weight="bold" text-anchor="middle">Barreira Plástica!</text>
                                        </svg>
                                    </div>
                                </div>

                                <!-- SLIDE 4: COLUNAS F-J -->
                                <div class="vg-carousel-slide">
                                    <div>
                                        <div class="vg-fig-header">
                                            <span class="vg-fig-badge" style="background:#F59E0B;color:#0F172A;">ITEM 4 DE 7: COLUNAS F-J</span>
                                            <span style="color:#FBBF24;font-weight:900;font-size:0.75rem;">SEGUNDO BLOCO</span>
                                        </div>
                                        <h4 class="lab-title-font" style="color:white;font-size:1.25rem;margin:6px 0 8px;">
                                            Tiras Metálicas Inferiores (F a J)
                                        </h4>
                                        <p style="color:#CBD5E1;font-size:0.95rem;margin:0 0 10px;line-height:1.6;">
                                            O bloco inferior tem suas próprias tiras verticais de 5 furos. Os furos <code>10F</code>, <code>10G</code>, <code>10H</code>, <code>10I</code> e <code>10J</code> estão interligados entre si, funcionando como uma segunda bancada!
                                        </p>
                                        <div style="background:#0F172A;border-left:3px solid #F59E0B;padding:8px 12px;border-radius:8px;color:#FDE68A;font-size:0.85rem;line-height:1.5;">
                                            ✌️ <b>Duas Bancadas:</b> Permite montar circuitos duplos ou conectar CIs com pernas dos dois lados.
                                        </div>
                                    </div>
                                    <div class="vg-svg-box">
                                        <svg width="290" height="135" viewBox="0 0 290 135">
                                            <rect x="20" y="10" width="250" height="115" rx="8" fill="#F8FAFC" stroke="#CBD5E1" stroke-width="2"/>
                                            <rect x="125" y="18" width="40" height="96" rx="6" fill="#F59E0B" opacity="0.35" stroke="#D97706" stroke-dasharray="3,2"/>
                                            <text x="145" y="16" fill="#F59E0B" font-size="9" font-weight="bold" text-anchor="middle">Coluna 10 (F-J)</text>
                                            <circle cx="145" cy="30" r="4.5" fill="#1E293B" stroke="#D97706" stroke-width="2"/><text x="132" y="33" fill="#64748B" font-size="7">F</text>
                                            <circle cx="145" cy="48" r="4.5" fill="#1E293B" stroke="#D97706" stroke-width="2"/><text x="132" y="51" fill="#64748B" font-size="7">G</text>
                                            <circle cx="145" cy="66" r="4.5" fill="#1E293B" stroke="#D97706" stroke-width="2"/><text x="132" y="69" fill="#64748B" font-size="7">H</text>
                                            <circle cx="145" cy="84" r="4.5" fill="#1E293B" stroke="#D97706" stroke-width="2"/><text x="132" y="87" fill="#64748B" font-size="7">I</text>
                                            <circle cx="145" cy="102" r="4.5" fill="#1E293B" stroke="#D97706" stroke-width="2"/><text x="132" y="105" fill="#64748B" font-size="7">J</text>
                                            <text x="205" y="62" fill="#FBBF24" font-size="9" font-weight="bold">Furos 10F a 10J</text>
                                            <text x="205" y="74" fill="#64748B" font-size="7.5">unidos entre si!</text>
                                        </svg>
                                    </div>
                                </div>

                                <!-- SLIDE 5: BARRAMENTOS HORIZONTAIS (+ e -) -->
                                <div class="vg-carousel-slide">
                                    <div>
                                        <div class="vg-fig-header">
                                            <span class="vg-fig-badge" style="background:#10B981;color:white;">ITEM 5 DE 7: BARRAMENTOS</span>
                                            <span style="color:#34D399;font-weight:900;font-size:0.75rem;">HORIZONTAL (30 PINOS)</span>
                                        </div>
                                        <h4 class="lab-title-font" style="color:white;font-size:1.25rem;margin:6px 0 8px;">
                                            Linhas Longas de Alimentação (+ e -)
                                        </h4>
                                        <p style="color:#CBD5E1;font-size:0.95rem;margin:0 0 10px;line-height:1.6;">
                                            Ao contrário das colunas que são verticais de 5 furos, os barramentos correm na <b>HORIZONTAL</b> com até 30 furos unidos de ponta a ponta para levar energia (+5V e GND) a toda a placa!
                                        </p>
                                        <div style="background:#0F172A;border-left:3px solid #10B981;padding:8px 12px;border-radius:8px;color:#A7F3D0;font-size:0.85rem;line-height:1.5;">
                                            ⚡ <b>Super Rodovia:</b> Conecte o GND uma única vez no barramento e todos os 30 furos terão GND!
                                        </div>
                                    </div>
                                    <div class="vg-svg-box">
                                        <svg width="290" height="135" viewBox="0 0 290 135">
                                            <rect x="15" y="20" width="260" height="38" rx="6" fill="#FEE2E2" stroke="#EF4444"/>
                                            <text x="28" y="44" fill="#EF4444" font-size="16" font-weight="bold">+</text>
                                            <line x1="45" y1="40" x2="265" y2="40" stroke="#EF4444" stroke-width="3"/>
                                            <text x="155" y="35" fill="#DC2626" font-size="8" font-weight="bold" text-anchor="middle">Barramento Vermelho: Todos levam +5V</text>
                                            <rect x="15" y="74" width="260" height="38" rx="6" fill="#E0F2FE" stroke="#0284C7"/>
                                            <text x="28" y="98" fill="#0284C7" font-size="18" font-weight="bold">-</text>
                                            <line x1="45" y1="94" x2="265" y2="94" stroke="#0284C7" stroke-width="3"/>
                                            <text x="155" y="89" fill="#0369A1" font-size="8" font-weight="bold" text-anchor="middle">Barramento Azul: Todos levam Terra (GND 0V)</text>
                                        </svg>
                                    </div>
                                </div>

                                <!-- SLIDE 6: LIGAÇÃO CERTA VS CURTO-CIRCUITO -->
                                <div class="vg-carousel-slide">
                                    <div>
                                        <div class="vg-fig-header">
                                            <span class="vg-fig-badge" style="background:#EF4444;color:white;">ITEM 6 DE 7: REGRA DE OURO</span>
                                            <span style="color:#FCA5A5;font-weight:900;font-size:0.75rem;">CERTO vs ERRADO</span>
                                        </div>
                                        <h4 class="lab-title-font" style="color:white;font-size:1.25rem;margin:6px 0 8px;">
                                            O Mistério do Curto-Circuito
                                        </h4>
                                        <p style="color:#CBD5E1;font-size:0.95rem;margin:0 0 10px;line-height:1.6;">
                                            Se colocar 2 pernas do mesmo componente na mesma coluna, a corrente dá a volta por baixo pelo cobre e desvia do componente (curto-circuito)! As pernas precisam ficar em <b>colunas separadas</b>!
                                        </p>
                                        <div style="background:#0F172A;border-left:3px solid #EF4444;padding:8px 12px;border-radius:8px;color:#FECACA;font-size:0.85rem;line-height:1.5;">
                                            ⚠️ <b>Atenção Maker:</b> Pernas na mesma coluna = curto-circuito! Use sempre colunas diferentes.
                                        </div>
                                    </div>
                                    <div class="vg-svg-box">
                                        <svg width="290" height="135" viewBox="0 0 290 135">
                                            <rect x="10" y="10" width="130" height="115" rx="8" fill="#064E3B" stroke="#10B981" stroke-width="1.5"/>
                                            <text x="75" y="26" fill="#A7F3D0" font-size="8.5" font-weight="bold" text-anchor="middle">✅ CERTO: Colunas 10 e 11</text>
                                            <circle cx="50" cy="55" r="4" fill="#10B981"/><text x="50" y="70" fill="#A7F3D0" font-size="7" text-anchor="middle">10C</text>
                                            <circle cx="100" cy="55" r="4" fill="#10B981"/><text x="100" y="70" fill="#A7F3D0" font-size="7" text-anchor="middle">11C</text>
                                            <path d="M 50 55 Q 75 35 100 55" fill="none" stroke="#FBBF24" stroke-width="3"/>
                                            <text x="75" y="92" fill="#FBBF24" font-size="7.5" font-weight="bold" text-anchor="middle">Corrente atravessa!</text>
                                            <text x="75" y="104" fill="#6EE7B7" font-size="7" text-anchor="middle">O LED Acende 🎉</text>

                                            <rect x="150" y="10" width="130" height="115" rx="8" fill="#450A0A" stroke="#EF4444" stroke-width="1.5"/>
                                            <text x="215" y="26" fill="#FECACA" font-size="8.5" font-weight="bold" text-anchor="middle">❌ ERRADO: Mesma Coluna</text>
                                            <circle cx="200" cy="45" r="4" fill="#EF4444"/><text x="186" y="48" fill="#FECACA" font-size="7">10B</text>
                                            <circle cx="200" cy="75" r="4" fill="#EF4444"/><text x="186" y="78" fill="#FECACA" font-size="7">10C</text>
                                            <path d="M 200 45 Q 225 60 200 75" fill="none" stroke="#EF4444" stroke-width="2" stroke-dasharray="3,2"/>
                                            <line x1="200" y1="45" x2="200" y2="75" stroke="#F59E0B" stroke-width="4"/>
                                            <text x="215" y="98" fill="#FCA5A5" font-size="7.5" font-weight="bold" text-anchor="middle">Curto! Passa por baixo</text>
                                            <text x="215" y="110" fill="#EF4444" font-size="7" text-anchor="middle">O LED Fica Apagado!</text>
                                        </svg>
                                    </div>
                                </div>

                                <!-- SLIDE 7: CONEXÃO DO SEMÁFORO NA PRÁTICA -->
                                <div class="vg-carousel-slide">
                                    <div>
                                        <div class="vg-fig-header">
                                            <span class="vg-fig-badge" style="background:#10B981;color:white;">ITEM 7 DE 7: PONTE DO SEMÁFORO</span>
                                            <span style="color:#A7F3D0;font-weight:900;font-size:0.75rem;">JUMPER + LED + RESISTOR</span>
                                        </div>
                                        <h4 class="lab-title-font" style="color:white;font-size:1.25rem;margin:6px 0 8px;">
                                            Como o Semáforo se Conecta
                                        </h4>
                                        <p style="color:#CBD5E1;font-size:0.95rem;margin:0 0 10px;line-height:1.6;">
                                            O Jumper entra no <code>10A</code> e passa energia para o LED no <code>10C</code>. A perna curta sai no <code>11C</code> e entrega a energia para o Resistor no <code>11D</code> até o barramento negativo (GND)!
                                        </p>
                                        <div style="background:#0F172A;border-left:3px solid #10B981;padding:8px 12px;border-radius:8px;color:#A7F3D0;font-size:0.85rem;line-height:1.5;">
                                            🚦 <b>Circuito Fechado:</b> Arduino D13 ➔ Jumper ➔ LED ➔ Resistor ➔ GND.
                                        </div>
                                    </div>
                                    <div class="vg-svg-box">
                                        <svg width="290" height="135" viewBox="0 0 290 135">
                                            <rect x="20" y="10" width="250" height="115" rx="8" fill="#020617" stroke="#334155"/>
                                            <rect x="55" y="20" width="25" height="90" rx="4" fill="#EF4444" opacity="0.2"/>
                                            <text x="67" y="18" fill="#EF4444" font-size="8" font-weight="bold" text-anchor="middle">Col 10</text>
                                            <circle cx="67" cy="35" r="4" fill="#EF4444"/><text x="45" y="38" fill="#EF4444" font-size="7">10A</text>
                                            <circle cx="67" cy="65" r="4" fill="#EF4444"/><text x="45" y="68" fill="#EF4444" font-size="7">10C</text>
                                            
                                            <path d="M 67 65 Q 90 40 115 65" fill="none" stroke="#DC2626" stroke-width="4"/>
                                            <circle cx="91" cy="48" r="8" fill="#EF4444"/>
                                            <text x="91" y="51" fill="white" font-size="6" font-weight="bold" text-anchor="middle">LED</text>

                                            <rect x="103" y="20" width="25" height="90" rx="4" fill="#10B981" opacity="0.2"/>
                                            <text x="115" y="18" fill="#10B981" font-size="8" font-weight="bold" text-anchor="middle">Col 11</text>
                                            <circle cx="115" cy="65" r="4" fill="#10B981"/><text x="135" y="68" fill="#10B981" font-size="7">11C</text>
                                            <circle cx="115" cy="85" r="4" fill="#F59E0B"/><text x="135" y="88" fill="#F59E0B" font-size="7">11D</text>

                                            <line x1="115" y1="85" x2="185" y2="85" stroke="#94A3B8" stroke-width="3"/>
                                            <rect x="135" y="78" width="25" height="14" rx="3" fill="#D4B996" stroke="#8C6D4F"/>
                                            <text x="147" y="88" fill="#78350F" font-size="6" font-weight="bold" text-anchor="middle">300Ω</text>
                                            <circle cx="185" cy="85" r="4" fill="#0284C7"/>
                                            <text x="215" y="88" fill="#0284C7" font-size="8" font-weight="bold">Barramento GND</text>
                                        </svg>
                                    </div>
                                </div>

                            </div>
                        </div>

                        <!-- Barra de Controles do Carrossel (Anterior, Pontos, Próximo) -->
                        <div class="vg-carousel-controls">
                            <button type="button" class="vg-carousel-arrow-btn" id="vg_carousel_prev" onclick="lab_carousel_prev()">
                                <i class="fa-solid fa-chevron-left"></i> Anterior
                            </button>
                            
                            <div class="vg-carousel-dots" id="vg_carousel_dots">
                                <div class="vg-carousel-dot active" onclick="lab_carousel_goto(0)" title="Item 1: Garra Interna"></div>
                                <div class="vg-carousel-dot" onclick="lab_carousel_goto(1)" title="Item 2: Colunas A-E"></div>
                                <div class="vg-carousel-dot" onclick="lab_carousel_goto(2)" title="Item 3: Calha Central"></div>
                                <div class="vg-carousel-dot" onclick="lab_carousel_goto(3)" title="Item 4: Colunas F-J"></div>
                                <div class="vg-carousel-dot" onclick="lab_carousel_goto(4)" title="Item 5: Barramentos (+/-)"></div>
                                <div class="vg-carousel-dot" onclick="lab_carousel_goto(5)" title="Item 6: Curto-Circuito"></div>
                                <div class="vg-carousel-dot" onclick="lab_carousel_goto(6)" title="Item 7: Conexão Semáforo"></div>
                            </div>

                            <button type="button" class="vg-carousel-arrow-btn" id="vg_carousel_next" onclick="lab_carousel_next()">
                                Próximo <i class="fa-solid fa-chevron-right"></i>
                            </button>
                        </div>
                    </div>

                    <!-- REGRA DE OURO -->
                    <div class="lab-box-alert">
                        <h4 class="lab-title-font" style="color:#EF4444;font-size:1.15rem;margin:0 0 6px;">
                            ⚠️ A REGRA DE OURO DA PROTOBOARD QUE TODO MAKER PRECISA SABER:
                        </h4>
                        <p style="margin:0;color:#FEE2E2;">
                            <b>NUNCA coloque as duas pernas do mesmo componente na mesma coluna!</b><br>
                            Se você colocar uma perna do resistor no <code>10A</code> e a outra perna no <code>10B</code>, você colocou as duas pernas no MESMO FIO de cobre! A eletricidade vai ignorar a peça e passar direto por baixo (curto-circuito no componente). As duas pernas precisam ficar em <b>colunas diferentes</b>!
                        </p>
                    </div>

                    <!-- DESAFIO PRÁTICO NA CARTEIRA -->
                    <div style="background:#0F172A;border:2px dashed #38BDF8;border-radius:18px;padding:18px;margin:20px 0;display:flex;align-items:center;gap:16px;flex-wrap:wrap;">
                        <div style="font-size:2.4rem;">🖐️</div>
                        <div>
                            <h4 class="lab-title-font" style="color:white;margin:0 0 4px;font-size:1.1rem;">Desafio Prático na Sua Carteira:</h4>
                            <p style="color:#94A3B8;margin:0;font-size:0.95rem;">
                                Pegue sua protoboard na mão. Localize as letras <b>A, B, C, D, E</b> de um lado, as letras <b>F, G, H, I, J</b> do outro, e ache as colunas <b>10, 16 e 22</b> (que é onde vamos montar nosso semáforo!).
                            </p>
                        </div>
                    </div>

                    <!-- ================= O EXPLORADOR INTERATIVO RAIO-X (INTEGRADO DIRETAMENTE AQUI) ================= -->
                    <div style="margin:32px 0 16px;">
                        <div style="display:flex;align-items:center;gap:10px;margin-bottom:6px;">
                            <span style="font-size:1.8rem;">🔬</span>
                            <div>
                                <h3 class="lab-title-font" style="color:#38BDF8;font-size:1.4rem;margin:0;">
                                    Explorador Tátil Interativo: Toque nos Furos e Veja o Metal Acender em Tempo Real!
                                </h3>
                                <p style="color:#94A3B8;margin:0;font-size:0.95rem;">
                                    Clique em qualquer furo da protoboard abaixo para ver o trilho condutor interno de cobre acender e conferir exatamente onde cada peça do semáforo vai se encaixar:
                                </p>
                            </div>
                        </div>
                    </div>

                    <!-- BOTÕES DE ATALHO RÁPIDO DO SEMÁFORO (PEÇAS E PERNAS EXATAS) -->
                    <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px;">
                        <button type="button" class="lab-btn-test" style="background:#0F172A;border:2px solid #EF4444;color:#EF4444;padding:7px 12px;font-size:0.82rem;" onclick="lab_vguide_quickSelect(10, 'C', 'top')">
                            🔴 10C: LED Vermelho (+ Ânodo)
                        </button>
                        <button type="button" class="lab-btn-test" style="background:#0F172A;border:2px dashed #EF4444;color:#FCA5A5;padding:7px 12px;font-size:0.82rem;" onclick="lab_vguide_quickSelect(11, 'C', 'top')">
                            🔴 11C: LED Vermelho (- Cátodo)
                        </button>
                        <button type="button" class="lab-btn-test" style="background:#0F172A;border:2px solid #F59E0B;color:#FDE68A;padding:7px 12px;font-size:0.82rem;" onclick="lab_vguide_quickSelect(11, 'D', 'top')">
                            🛡️ 11D: Resistor 1 (300Ω)
                        </button>
                        <button type="button" class="lab-btn-test" style="background:#0F172A;border:2px solid #F59E0B;color:#F59E0B;padding:7px 12px;font-size:0.82rem;" onclick="lab_vguide_quickSelect(16, 'C', 'top')">
                            🟡 16C: LED Amarelo (+ Ânodo)
                        </button>
                        <button type="button" class="lab-btn-test" style="background:#0F172A;border:2px dashed #F59E0B;color:#FEF3C7;padding:7px 12px;font-size:0.82rem;" onclick="lab_vguide_quickSelect(17, 'C', 'top')">
                            🟡 17C: LED Amarelo (- Cátodo)
                        </button>
                        <button type="button" class="lab-btn-test" style="background:#0F172A;border:2px solid #F59E0B;color:#FDE68A;padding:7px 12px;font-size:0.82rem;" onclick="lab_vguide_quickSelect(17, 'D', 'top')">
                            🛡️ 17D: Resistor 2 (300Ω)
                        </button>
                        <button type="button" class="lab-btn-test" style="background:#0F172A;border:2px solid #10B981;color:#10B981;padding:7px 12px;font-size:0.82rem;" onclick="lab_vguide_quickSelect(22, 'C', 'top')">
                            🟢 22C: LED Verde (+ Ânodo)
                        </button>
                        <button type="button" class="lab-btn-test" style="background:#0F172A;border:2px dashed #10B981;color:#A7F3D0;padding:7px 12px;font-size:0.82rem;" onclick="lab_vguide_quickSelect(23, 'C', 'top')">
                            🟢 23C: LED Verde (- Cátodo)
                        </button>
                        <button type="button" class="lab-btn-test" style="background:#0F172A;border:2px solid #F59E0B;color:#FDE68A;padding:7px 12px;font-size:0.82rem;" onclick="lab_vguide_quickSelect(23, 'D', 'top')">
                            🛡️ 23D: Resistor 3 (300Ω)
                        </button>
                        <button type="button" class="lab-btn-test" style="background:#0F172A;border:2px solid #0284C7;color:#38BDF8;padding:7px 12px;font-size:0.82rem;" onclick="lab_vguide_quickSelect(11, 'GND', 'rail')">
                            🔵 Barramento GND (Coluna 11)
                        </button>
                        <button type="button" class="lab-btn-test" style="background:#0F172A;border:2px solid #A855F7;color:#C084FC;padding:7px 12px;font-size:0.82rem;" onclick="lab_vguide_quickSelect(10, 'F', 'bot')">
                            ⛔ Furo 10F (Calha Isolada)
                        </button>
                    </div>

                    <!-- GUIA VISUAL DE IDENTIFICAÇÃO RÁPIDA -->
                    <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px;background:#0F172A;border:1px solid #334155;border-radius:12px;padding:8px 14px;margin-bottom:12px;font-size:0.82rem;">
                        <span style="color:#94A3B8;font-weight:bold;">Legenda dos Furos Especiais:</span>
                        <div style="display:flex;gap:12px;flex-wrap:wrap;">
                            <span style="color:#38BDF8;font-weight:900;">🔌 D13/D12/D11: Jumper de Sinal (Linha A)</span>
                            <span style="color:#F87171;font-weight:900;">🔴 LED+: Perna Longa Ânodo (Linha C)</span>
                            <span style="color:#34D399;font-weight:900;">🛡️ LED-: Perna Curta Cátodo (Linha C vizinha)</span>
                            <span style="color:#FBBF24;font-weight:900;">⚡ 300Ω: Resistor (Linha D até o GND)</span>
                        </div>
                    </div>

                    <!-- PROTOBOARD VISUAL EXPANDIDA (COLUNAS 8 A 24) -->
                    <div class="vg-board-container" id="vg_interactive_board_cutaway">
                        <div class="vg-board-title">PROTOBOARD DE 30 PINOS — CORTE DIDÁTICO EXPANDIDO (COLUNAS 8 A 24)</div>
                        
                        <!-- Barramento Superior Azul (-) GND -->
                        <div style="display:flex;align-items:center;justify-content:center;gap:10px;background:#F1F5F9;padding:6px 14px;border-radius:10px;margin-bottom:12px;border:1px solid #CBD5E1;">
                            <span style="color:#0284C7;font-weight:900;font-family:monospace;font-size:1.1rem;">-</span>
                            <span style="color:#0284C7;font-weight:900;font-size:0.8rem;letter-spacing:1px;">BARRAMENTO AZUL DE RETORNO / TERRA (GND)</span>
                            <div style="display:flex;gap:12px;margin-left:14px;" id="vg_rail_top_holes"></div>
                        </div>

                        <!-- Grade das Colunas 8 a 24 com Presilhas de Cobre -->
                        <div class="vg-grid-cols" id="vg_cols_matrix_container">
                            <!-- Gerado dinamicamente via JS lab_vguide_init() -->
                        </div>

                        <!-- Calha Central Isolante -->
                        <div class="vg-trench-row">
                            <div class="vg-trench-tag">
                                ⚡ CALHA CENTRAL ISOLANTE (FOSSO PLÁSTICO) — O LADO A-E NUNCA ENCOSTA NO LADO F-J!
                            </div>
                        </div>

                        <!-- Grade Inferior F-G-H-I-J -->
                        <div class="vg-grid-cols" id="vg_cols_matrix_bottom_container">
                            <!-- Gerado dinamicamente via JS -->
                        </div>

                        <!-- Barramento Inferior (-) GND -->
                        <div style="display:flex;align-items:center;justify-content:center;gap:10px;background:#F1F5F9;padding:6px 14px;border-radius:10px;margin-top:12px;border:1px solid #CBD5E1;">
                            <span style="color:#0284C7;font-weight:900;font-family:monospace;font-size:1.1rem;">-</span>
                            <span style="color:#0284C7;font-weight:900;font-size:0.8rem;letter-spacing:1px;">BARRAMENTO AZUL DE RETORNO / TERRA (GND)</span>
                            <div style="display:flex;gap:12px;margin-left:14px;" id="vg_rail_bot_holes"></div>
                        </div>
                    </div>

                    <!-- PAINEL DIDÁTICO DE DIAGNÓSTICO EM TEMPO REAL -->
                    <div class="vg-info-panel">
                        <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:14px;">
                            <div>
                                <span style="color:#94A3B8;font-size:0.85rem;text-transform:uppercase;font-weight:bold;letter-spacing:1px;">Furo Selecionado Agora:</span>
                                <h3 class="lab-title-font" style="color:#38BDF8;font-size:1.6rem;margin:4px 0 0;" id="vg_info_hole_tag">
                                    Furo 10C (Coluna 10, Linha C)
                                </h3>
                            </div>

                            <div style="display:flex;gap:10px;">
                                <div style="background:#1E293B;border:1px solid #334155;border-radius:12px;padding:8px 14px;text-align:center;">
                                    <div style="font-size:0.75rem;color:#94A3B8;">Bloco:</div>
                                    <b style="color:#FBBF24;" id="vg_info_block_tag">Superior (A-E)</b>
                                </div>
                                <div style="background:#1E293B;border:1px solid #334155;border-radius:12px;padding:8px 14px;text-align:center;">
                                    <div style="font-size:0.75rem;color:#94A3B8;">Presilha Metálica:</div>
                                    <b style="color:#10B981;" id="vg_info_strip_tag">Trilho 10A-10E Ativo</b>
                                </div>
                            </div>
                        </div>

                        <div style="background:#1E293B;border-radius:14px;padding:16px 20px;margin-top:14px;color:#E2E8F0;font-size:1rem;line-height:1.6;" id="vg_info_desc_box">
                            <b>Como funciona a Coluna 10 (A-E):</b> Os 5 furos verticais <code>10A</code>, <code>10B</code>, <code>10C</code>, <code>10D</code> e <code>10E</code> estão soldados na mesma lâmina de cobre embaixo do plástico! 
                            Se você colocar o <b>fio jumper vermelho</b> no <code>10A</code> e a <b>perna longa do LED</b> no <code>10C</code>, a eletricidade passa de um para o outro instantaneamente!
                        </div>

                        <div style="display:flex;align-items:center;gap:10px;margin-top:12px;color:#FCA5A5;font-size:0.9rem;">
                            <i class="fa-solid fa-triangle-exclamation"></i>
                            <span id="vg_info_warning_box">
                                <b>Aviso sobre a Calha Central:</b> A corrente <b>NÃO</b> passa para a coluna <code>10F</code> a <code>10J</code>! O fosso central no meio isola os dois lados.
                            </span>
                        </div>
                    </div>

                    <!-- DESAFIO MAKER DO NÍVEL 1: O TESTE DO RAIO-X -->
                    <div class="lab-challenge-box" id="lab_challenge_box_1">
                        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;margin-bottom:14px;">
                            <div style="display:flex;align-items:center;gap:12px;">
                                <div style="background:#0284C7;color:white;width:42px;height:42px;border-radius:14px;display:flex;align-items:center;justify-content:center;font-size:1.3rem;box-shadow:0 0 14px rgba(2,132,199,0.5);">
                                    <i class="fa-solid fa-gamepad"></i>
                                </div>
                                <div>
                                    <h3 class="lab-title-font" style="color:#FBBF24;margin:0;font-size:1.3rem;">
                                        🎮 Desafio Maker do Nível 1: O Teste do Raio-X!
                                    </h3>
                                    <span style="color:#94A3B8;font-size:0.88rem;">Acerte a pergunta para provar seus conhecimentos e liberar o Nível 2:</span>
                                </div>
                            </div>
                            <span class="lab-challenge-status" id="lab_challenge_status_1">
                                <i class="fa-solid fa-lock"></i> Desafio Obrigatório
                            </span>
                        </div>

                        <div class="lab-quiz-card" style="margin:0;background:#0F172A;">
                            <h4 class="lab-title-font" style="color:white;font-size:1.15rem;margin:0 0 10px;">
                                ❓ Se você colocar a ponta de um fio no furo <code>10A</code> e a ponta de outro fio no furo <code>10E</code>, o que acontece por baixo do plástico branco?
                            </h4>
                            <button type="button" class="lab-quiz-opt" id="opt_c1_1" onclick="lab_answerStepChallenge(1, 1, false)">
                                <span style="font-weight:900;color:#38BDF8;">A)</span> Eles não se conectam, pois cada furinho da protoboard é totalmente isolado.
                            </button>
                            <button type="button" class="lab-quiz-opt" id="opt_c1_2" onclick="lab_answerStepChallenge(1, 2, true)">
                                <span style="font-weight:900;color:#38BDF8;">B)</span> 🌟 Eles se conectam! A lâmina metálica de bronze une todos os 5 furos da mesma coluna (10A até 10E)!
                            </button>
                            <button type="button" class="lab-quiz-opt" id="opt_c1_3" onclick="lab_answerStepChallenge(1, 3, false)">
                                <span style="font-weight:900;color:#38BDF8;">C)</span> Eles só se conectam se passarem por dentro da calha divisória central.
                            </button>
                            <div class="quiz-feedback" id="lab_step_fb_1" style="display:none;margin-top:12px;padding:12px 16px;border-radius:12px;font-size:0.95rem;font-weight:bold;"></div>
                        </div>
                    </div>

                    <!-- BOTÃO DE NAVEGAÇÃO CONTÍNUA (BLOQUEADO ATÉ VENCER O DESAFIO) -->
                    <div style="display:flex;justify-content:flex-end;margin-top:20px;">
                        <button type="button" class="lab-nav-btn locked" id="lab_next_btn_1" onclick="lab_advanceNextStep(1)">
                            <i class="fa-solid fa-lock"></i> Conclua o Desafio Acima para Avançar ao Nível 2
                        </button>
                    </div>
                </div>
            </div>

            <!-- ================= NÍVEL 2: OS 3 RESISTORES DE 300 OHMS ================= -->
            <div class="lab-guide-card" id="lab_guide_step_2" style="display:none;">
                <div class="lab-guide-header">
                    <div>
                        <h2 class="lab-title-font lab-guide-title">
                            <span style="color:#F59E0B;">🛡️ Nível 2:</span> Os 3 Resistores Protetores de 300 Ω
                        </h2>
                        <span style="color:#94A3B8;font-size:0.95rem;">Recapitulação: Que perna recebe o positivo e qual recebe o negativo?</span>
                    </div>
                    <div class="lab-guide-tag">Nível 2 de 6</div>
                </div>

                <div style="font-size:1.05rem;line-height:1.7;color:#CBD5E1;">
                    <!-- RECAPITULAÇÃO PRINCIPAL DO PROFESSOR -->
                    <div class="lab-box-recap">
                        <div style="display:flex;align-items:flex-start;gap:14px;">
                            <div style="font-size:2.8rem;line-height:1;">💡</div>
                            <div>
                                <h3 class="lab-title-font" style="color:#FDE68A;font-size:1.35rem;margin:0 0 6px;">
                                    Recapitulação de Ouro: O Resistor tem perna Positiva ou Negativa?
                                </h3>
                                <p style="color:#FEF3C7;margin:0 0 10px;font-size:1.05rem;font-weight:700;">
                                    📢 PEGADINHA MAKER: O RESISTOR NÃO TEM POLARIDADE! NÃO TEM LADO! 😲
                                </p>
                                <p style="color:#CBD5E1;margin:0;font-size:0.95rem;line-height:1.6;">
                                    Pode colocar o resistor virado para a esquerda ou para a direita, tanto faz! Ele não queima se colocar invertido e oferece exatamente os mesmos <b>300 Ω</b> de resistência nos dois sentidos!
                                    <br>
                                    <b>Por que usamos 300 Ω?</b> Porque ele funciona como uma torneira que estreita o fluxo da corrente elétrica, permitindo apenas cerca de <b>15.3 mA</b> passarem. Sem ele, o LED estoura e queima na hora!
                                </p>
                            </div>
                        </div>
                    </div>

                    <!-- CÓDIGO DE CORES DO RESISTOR 300 OHMS -->
                    <div style="background:#0F172A;border:2px solid #334155;border-radius:18px;padding:16px 20px;margin:18px 0;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:14px;">
                        <div>
                            <span style="color:#94A3B8;font-size:0.85rem;text-transform:uppercase;font-weight:800;letter-spacing:1px;">Cores do Resistor do Kit:</span>
                            <h4 class="lab-title-font" style="color:#F59E0B;font-size:1.3rem;margin:4px 0 0;">
                                300 Ω (Laranja, Preto, Marrom e Dourado)
                            </h4>
                        </div>
                        <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;">
                            <span style="background:#EA580C;color:white;padding:5px 10px;border-radius:8px;font-weight:900;font-size:0.85rem;">1ª Faixa: Laranja (3)</span>
                            <span style="background:#000000;color:white;border:1px solid #475569;padding:5px 10px;border-radius:8px;font-weight:900;font-size:0.85rem;">2ª Faixa: Preto (0)</span>
                            <span style="background:#78350F;color:white;padding:5px 10px;border-radius:8px;font-weight:900;font-size:0.85rem;">3ª Faixa: Marrom (x10)</span>
                            <span style="background:#D97706;color:white;padding:5px 10px;border-radius:8px;font-weight:900;font-size:0.85rem;">Tolerância: Dourado (5%)</span>
                        </div>
                    </div>

                    <!-- INSTRUÇÕES DE POSICIONAMENTO DOS 3 RESISTORES -->
                    <h3 class="lab-title-font" style="color:white;margin:24px 0 10px;">
                        📍 Onde encaixar os 3 Resistores na Protoboard de 30 Pinos:
                    </h3>
                    <p>
                        Vamos usar 3 resistores: um para o LED Vermelho, um para o LED Amarelo e um para o LED Verde. Eles vão levar a corrente do Cátodo do LED até o <b>Barramento Azul (-) GND</b>:
                    </p>

                    <table class="lab-pins-table">
                        <thead>
                            <tr>
                                <th>Resistor</th>
                                <th>Perna 1 (Coluna do LED)</th>
                                <th>Perna 2 (Retorno ao Terra)</th>
                                <th>Objetivo</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>🔴 <b>Resistor 1 (Vermelho)</b></td>
                                <td>Furo <b style="color:#F59E0B;">11D</b></td>
                                <td>Barramento Azul <b style="color:#38BDF8;">(-) GND</b></td>
                                <td>Protege o LED Vermelho</td>
                            </tr>
                            <tr>
                                <td>🟡 <b>Resistor 2 (Amarelo)</b></td>
                                <td>Furo <b style="color:#F59E0B;">17D</b></td>
                                <td>Barramento Azul <b style="color:#38BDF8;">(-) GND</b></td>
                                <td>Protege o LED Amarelo</td>
                            </tr>
                            <tr>
                                <td>🟢 <b>Resistor 3 (Verde)</b></td>
                                <td>Furo <b style="color:#F59E0B;">23D</b></td>
                                <td>Barramento Azul <b style="color:#38BDF8;">(-) GND</b></td>
                                <td>Protege o LED Verde</td>
                            </tr>
                        </tbody>
                    </table>

                    <div class="lab-box-success">
                        <i class="fa-solid fa-circle-check" style="color:#10B981;font-size:1.3rem;"></i>
                        <b>Dica Prática do Professor:</b> Curve as duas perninhas do resistor em formato de U suavemente com os dedinhos. Encaixe uma perna no furo 11D e a outra perna no furinho azul (-) do barramento logo acima ou abaixo. Repita no 17D e no 23D!
                    </div>

                    <!-- DÚVIDA DE OURO: O RESISTOR TEM QUE FICAR ANTES DO POSITIVO OU NO NEGATIVO? -->
                    <div style="background:linear-gradient(135deg, rgba(245,158,11,0.12), rgba(15,23,42,0.95));border:2px solid #F59E0B;border-radius:20px;padding:20px 24px;margin:22px 0;">
                        <div style="display:flex;align-items:flex-start;gap:14px;">
                            <div style="font-size:2.5rem;line-height:1;">🤔</div>
                            <div>
                                <h3 class="lab-title-font" style="color:#FBBF24;font-size:1.3rem;margin:0 0 8px;">
                                    Dúvida Clássica Maker: O Resistor tem que ficar ANTES do Positivo (+) ou DEPOIS do Negativo (-)?
                                </h3>
                                <p style="color:#FEF3C7;font-size:1.05rem;line-height:1.6;margin:0 0 12px;font-weight:700;">
                                    📢 RESPOSTA CIENTÍFICA: PODE FICAR EM QUALQUER UM DOS DOIS LADOS! 😲⚡
                                </p>
                                <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(260px, 1fr));gap:14px;margin-bottom:14px;">
                                    <div style="background:#0F172A;border:1px solid #38BDF8;border-radius:14px;padding:14px;">
                                        <span style="background:#0284C7;color:white;padding:3px 10px;border-radius:8px;font-size:0.75rem;font-weight:900;">OPÇÃO A: NO LADO POSITIVO</span>
                                        <h4 class="lab-title-font" style="color:#38BDF8;font-size:1.05rem;margin:8px 0 4px;">Pino 13 (+5V) ➔ Resistor ➔ Ânodo (+) do LED</h4>
                                        <p style="color:#94A3B8;font-size:0.88rem;line-height:1.5;margin:0;">
                                            Muitos professores ensinam assim porque parece intuitivo "amortecer" a força dos 5V antes de entrar no LED. <b>Funciona perfeitamente!</b>
                                        </p>
                                    </div>
                                    <div style="background:#0F172A;border:1px solid #10B981;border-radius:14px;padding:14px;">
                                        <span style="background:#059669;color:white;padding:3px 10px;border-radius:8px;font-size:0.75rem;font-weight:900;">OPÇÃO B: NO LADO NEGATIVO (NOSSA BANCADA)</span>
                                        <h4 class="lab-title-font" style="color:#A7F3D0;font-size:1.05rem;margin:8px 0 4px;">Cátodo (-) do LED ➔ Resistor ➔ Barramento GND</h4>
                                        <p style="color:#94A3B8;font-size:0.88rem;line-height:1.5;margin:0;">
                                            Ligar a perna curta do LED no resistor e este direto na linha azul do GND deixa a protoboard mais limpa e organizada! <b>Também funciona perfeitamente!</b>
                                        </p>
                                    </div>
                                </div>
                                <div style="background:#1E293B;border-radius:12px;padding:12px 16px;color:#FEF3C7;font-size:0.92rem;line-height:1.6;border-left:4px solid #10B981;margin-bottom:12px;">
                                    <b>⚖️ O Princípio Físico (Circuito em Série):</b> A corrente elétrica é como a água correndo num cano em círculo fechado. O resistor funciona como uma torneira que estreita o fluxo. Não importa se a torneira está antes ou depois do LED: <b>a velocidade e quantidade de elétrons (~15.3 mA) é idêntica em todo o caminho!</b> Portanto, o LED fica 100% protegido nas duas opções!
                                </div>

                                <div style="background:rgba(56,189,248,0.12);border:2px dashed #38BDF8;border-radius:14px;padding:14px 18px;display:flex;align-items:flex-start;gap:12px;">
                                    <span style="font-size:2rem;line-height:1;">💡</span>
                                    <div style="font-size:0.95rem;line-height:1.6;color:#E2E8F0;">
                                        <b style="color:#FBBF24;font-size:1rem;">DÚVIDA COMUM DE MAKER:</b> <i>"O resistor não tem lado, mas ele TEM que ficar antes do positivo (+5V)?"</i><br>
                                        <b style="color:#34D399;font-size:1.05rem;">RESPOSTA DIRETA: NÃO!</b> O resistor <b>NÃO</b> precisa obrigatoriamente ficar antes do positivo! Ele protege o LED exatamente igual se for colocado <b>antes do positivo</b> (no pino 5V) ou <b>depois do negativo</b> (no Cátodo / GND). Na nossa bancada da Aula 7, ligamos no GND para deixar a fiação mais limpa e organizada!
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- DESAFIO MAKER DO NÍVEL 2: O SEGREDO DOS RESISTORES -->
                    <div class="lab-challenge-box" id="lab_challenge_box_2">
                        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;margin-bottom:14px;">
                            <div style="display:flex;align-items:center;gap:12px;">
                                <div style="background:#F59E0B;color:#0F172A;width:42px;height:42px;border-radius:14px;display:flex;align-items:center;justify-content:center;font-size:1.3rem;box-shadow:0 0 14px rgba(245,158,11,0.5);">
                                    <i class="fa-solid fa-shield-halved"></i>
                                </div>
                                <div>
                                    <h3 class="lab-title-font" style="color:#FBBF24;margin:0;font-size:1.3rem;">
                                        🎮 Desafio Maker do Nível 2: A Pegadinha do Resistor!
                                    </h3>
                                    <span style="color:#94A3B8;font-size:0.88rem;">Acerte a pergunta para provar que domina os resistores e liberar o Nível 3:</span>
                                </div>
                            </div>
                            <span class="lab-challenge-status" id="lab_challenge_status_2">
                                <i class="fa-solid fa-lock"></i> Desafio Obrigatório
                            </span>
                        </div>

                        <div class="lab-quiz-card" style="margin:0;background:#0F172A;">
                            <h4 class="lab-title-font" style="color:white;font-size:1.15rem;margin:0 0 10px;">
                                ❓ O Resistor de 300Ω tem lado positivo/negativo obrigatório? E ele é obrigado a ficar sempre antes do positivo?
                            </h4>
                            <button type="button" class="lab-quiz-opt" id="opt_c2_1" onclick="lab_answerStepChallenge(2, 1, false)">
                                <span style="font-weight:900;color:#F59E0B;">A)</span> Sim, o resistor tem lado certo e só funciona se estiver antes do polo positivo (+5V).
                            </button>
                            <button type="button" class="lab-quiz-opt" id="opt_c2_2" onclick="lab_answerStepChallenge(2, 2, true)">
                                <span style="font-weight:900;color:#F59E0B;">B)</span> 🌟 NENHUMA! O resistor NÃO TEM POLARIDADE (tanto faz o lado) e pode ficar TANTO antes do positivo (+) QUANTO depois do negativo (-), pois ele limita a corrente em todo o circuito em série!
                            </button>
                            <button type="button" class="lab-quiz-opt" id="opt_c2_3" onclick="lab_answerStepChallenge(2, 3, false)">
                                <span style="font-weight:900;color:#F59E0B;">C)</span> O resistor só funciona se colocar as duas pontas no mesmo furinho da placa.
                            </button>
                            <div class="quiz-feedback" id="lab_step_fb_2" style="display:none;margin-top:12px;padding:12px 16px;border-radius:12px;font-size:0.95rem;font-weight:bold;"></div>
                        </div>
                    </div>

                    <!-- NAVEGAÇÃO CONTÍNUA (BLOQUEADA ATÉ VENCER O DESAFIO) -->
                    <div style="display:flex;justify-content:space-between;margin-top:20px;flex-wrap:wrap;gap:12px;">
                        <button type="button" class="lab-nav-btn" onclick="lab_switchGuideStep(1)">
                            <i class="fa-solid fa-arrow-left"></i> Voltar ao Nível 1
                        </button>
                        <button type="button" class="lab-nav-btn locked" id="lab_next_btn_2" onclick="lab_advanceNextStep(2)">
                            <i class="fa-solid fa-lock"></i> Conclua o Desafio Acima para Avançar ao Nível 3
                        </button>
                    </div>
                </div>
            </div>

            <!-- ================= NÍVEL 3: OS 3 LEDS DO SEMÁFORO & COMPARADOR INTEGRADO ================= -->
            <div class="lab-guide-card" id="lab_guide_step_3" style="display:none;">
                <div class="lab-guide-header">
                    <div>
                        <h2 class="lab-title-font lab-guide-title">
                            <span style="color:#10B981;">🚦 Nível 3:</span> Encaixando os 3 LEDs (Semáforo)
                        </h2>
                        <span style="color:#94A3B8;font-size:0.95rem;">Atenção Máxima à Polaridade: Perna Longa (+) vs Perna Curta (-)</span>
                    </div>
                    <div class="lab-guide-tag">Nível 3 de 6</div>
                </div>

                <div style="font-size:1.05rem;line-height:1.7;color:#CBD5E1;">
                    <div class="lab-box-alert">
                        <div style="display:flex;align-items:flex-start;gap:14px;">
                            <div style="font-size:2.8rem;line-height:1;">🚨</div>
                            <div>
                                <h3 class="lab-title-font" style="color:#FCA5A5;font-size:1.3rem;margin:0 0 6px;">
                                    Cuidado Máximo: O LED TEM POLARIDADE RIGOROSA!
                                </h3>
                                <p style="color:#FEE2E2;margin:0 0 8px;">
                                    Diferente do resistor, se você ligar o LED invertido ele <b>NÃO VAI ACENDER</b>!
                                </p>
                                <ul style="margin:0 0 0 20px;padding:0;color:#CBD5E1;">
                                    <li><b>Perna LONGA = Ânodo (+ Positivo):</b> É quem recebe os 5V do pino do Arduino.</li>
                                    <li><b>Perna CURTA / Chanfro Chato = Cátodo (- Negativo):</b> É quem vai para a mesma coluna do resistor de proteção!</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <h3 class="lab-title-font" style="color:white;margin:22px 0 10px;">
                        📍 Onde encaixar cada LED na Protoboard:
                    </h3>

                    <table class="lab-pins-table">
                        <thead>
                            <tr>
                                <th>LED</th>
                                <th>Perna LONGA (Ânodo +)</th>
                                <th>Perna CURTA (Cátodo -)</th>
                                <th>Conexão Elétrica</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>🔴 <b>LED Vermelho</b></td>
                                <td>Furo <b style="color:#EF4444;">10C</b></td>
                                <td>Furo <b style="color:#EF4444;">11C</b></td>
                                <td>Perna curta no 11C encosta no Resistor 1 (11D)!</td>
                            </tr>
                            <tr>
                                <td>🟡 <b>LED Amarelo</b></td>
                                <td>Furo <b style="color:#F59E0B;">16C</b></td>
                                <td>Furo <b style="color:#F59E0B;">17C</b></td>
                                <td>Perna curta no 17C encosta no Resistor 2 (17D)!</td>
                            </tr>
                            <tr>
                                <td>🟢 <b>LED Verde</b></td>
                                <td>Furo <b style="color:#10B981;">22C</b></td>
                                <td>Furo <b style="color:#10B981;">23C</b></td>
                                <td>Perna curta no 23C encosta no Resistor 3 (23D)!</td>
                            </tr>
                        </tbody>
                    </table>

                    <!-- COMPARADOR PRÁTICO INTEGRADO DIRETAMENTE AQUI -->
                    <div style="margin:26px 0 16px;">
                        <h3 class="lab-title-font" style="color:#38BDF8;font-size:1.3rem;margin:0 0 6px;">
                            💡 Comparador Interativo: Teste o LED na Tela (Certo vs. Errado)
                        </h3>
                        <p style="color:#94A3B8;margin:0;font-size:0.95rem;">
                            Clique nos botões abaixo para ver como o LED acende no jeito certo e o que acontece se colocar na mesma coluna:
                        </p>
                    </div>

                    <div class="vg-compare-grid">
                        <!-- CARD JEITO CERTO -->
                        <div class="vg-comp-card good">
                            <div>
                                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
                                    <span style="background:#10B981;color:white;padding:4px 12px;border-radius:20px;font-weight:900;font-size:0.8rem;">
                                        ✅ JEITO CERTO (COLUNAS SEPARADAS)
                                    </span>
                                    <span style="font-size:1.8rem;">🌟</span>
                                </div>

                                <h4 class="lab-title-font" style="color:#A7F3D0;font-size:1.25rem;margin:0 0 10px;">
                                    Perna Longa no 10C e Perna Curta no 11C
                                </h4>

                                <!-- Ilustração SVG Simplificada do Jeito Certo -->
                                <div style="background:#020617;border:2px solid #059669;border-radius:14px;padding:16px;text-align:center;margin-bottom:14px;position:relative;overflow:hidden;">
                                    <svg width="280" height="150" viewBox="0 0 280 150" style="margin:0 auto;display:block;">
                                        <rect x="30" y="20" width="30" height="110" rx="6" fill="#1E293B" stroke="#059669" stroke-width="2"/>
                                        <rect x="130" y="20" width="30" height="110" rx="6" fill="#1E293B" stroke="#059669" stroke-width="2"/>
                                        <text x="45" y="15" fill="#38BDF8" font-size="11" font-weight="bold" text-anchor="middle">Col 10</text>
                                        <text x="145" y="15" fill="#38BDF8" font-size="11" font-weight="bold" text-anchor="middle">Col 11</text>
                                        <circle cx="45" cy="75" r="7" fill="#0F172A" stroke="#38BDF8" stroke-width="2"/>
                                        <circle cx="145" cy="75" r="7" fill="#0F172A" stroke="#38BDF8" stroke-width="2"/>
                                        <text x="45" y="79" fill="#94A3B8" font-size="8" text-anchor="middle">10C</text>
                                        <text x="145" y="79" fill="#94A3B8" font-size="8" text-anchor="middle">11C</text>
                                        <circle cx="45" cy="35" r="6" fill="#EF4444"/>
                                        <text x="75" y="38" fill="#EF4444" font-size="9" font-weight="bold">Fio D13 (5V)</text>
                                        <circle cx="145" cy="115" r="6" fill="#D4B996"/>
                                        <text x="180" y="118" fill="#D4B996" font-size="9" font-weight="bold">Resistor 300Ω</text>
                                        <path d="M 45 75 Q 70 30 95 40 Q 120 30 145 75" fill="none" stroke="#E2E8F0" stroke-width="3" stroke-linecap="round"/>
                                        <circle id="vg_correct_led_glow" cx="95" cy="40" r="18" fill="#EF4444" opacity="0.3" style="display:none;"/>
                                        <circle id="vg_correct_led_bulb" cx="95" cy="40" r="14" fill="#DC2626" stroke="#FFFFFF" stroke-width="2"/>
                                        <text x="95" y="44" fill="white" font-size="10" font-weight="bold" text-anchor="middle">+</text>
                                        <path id="vg_arrow_correct" d="M 45 65 L 45 45 M 65 42 L 80 40 M 110 40 L 125 45 M 145 85 L 145 105" stroke="#10B981" stroke-width="2" stroke-dasharray="3,3" style="display:none;"/>
                                    </svg>
                                </div>

                                <ul style="color:#CBD5E1;font-size:0.9rem;line-height:1.6;margin:0 0 16px 18px;padding:0;">
                                    <li><b>1.</b> O fio do pino 13 traz 5V para o furo <b>10A</b>.</li>
                                    <li><b>2.</b> A lâmina metálica interna sobe a energia até o <b>10C</b>.</li>
                                    <li><b>3.</b> A corrente sobe pelo filamento do LED e acende a luz!</li>
                                    <li><b>4.</b> A corrente sai no <b>11C</b> e vai para o resistor no <b>11D</b>!</li>
                                </ul>
                            </div>

                            <button type="button" class="lab-btn-test" id="vg_btn_test_good" onclick="lab_vguide_testLed(true)" style="background:#10B981;color:white;width:100%;justify-content:center;">
                                <i class="fa-solid fa-bolt"></i> Testar Energia: Ligar LED Correto!
                            </button>
                        </div>

                        <!-- CARD JEITO ERRADO -->
                        <div class="vg-comp-card bad">
                            <div>
                                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
                                    <span style="background:#EF4444;color:white;padding:4px 12px;border-radius:20px;font-weight:900;font-size:0.8rem;">
                                        ❌ JEITO ERRADO (MESMA COLUNA = CURTO)
                                    </span>
                                    <span style="font-size:1.8rem;">⚠️</span>
                                </div>

                                <h4 class="lab-title-font" style="color:#FCA5A5;font-size:1.25rem;margin:0 0 10px;">
                                    Ambas as Pernas na Mesma Coluna 10 (ex: 10B e 10D)
                                </h4>

                                <!-- Ilustração SVG Simplificada do Jeito Errado -->
                                <div style="background:#020617;border:2px solid #DC2626;border-radius:14px;padding:16px;text-align:center;margin-bottom:14px;position:relative;overflow:hidden;">
                                    <svg width="280" height="150" viewBox="0 0 280 150" style="margin:0 auto;display:block;">
                                        <rect x="80" y="20" width="36" height="110" rx="6" fill="#1E293B" stroke="#EF4444" stroke-width="2"/>
                                        <text x="98" y="15" fill="#EF4444" font-size="11" font-weight="bold" text-anchor="middle">Coluna 10 Única</text>
                                        <circle cx="98" cy="45" r="7" fill="#0F172A" stroke="#EF4444" stroke-width="2"/>
                                        <circle cx="98" cy="105" r="7" fill="#0F172A" stroke="#EF4444" stroke-width="2"/>
                                        <text x="70" y="48" fill="#FCA5A5" font-size="8">10B (+)</text>
                                        <text x="70" y="108" fill="#FCA5A5" font-size="8">10D (-)</text>
                                        <line x1="98" y1="45" x2="98" y2="105" stroke="#F59E0B" stroke-width="4" stroke-dasharray="2,2"/>
                                        <text x="140" y="78" fill="#FBBF24" font-size="8.5" font-weight="bold">Atalho Metálico!</text>
                                        <path d="M 98 45 Q 150 75 98 105" fill="none" stroke="#64748B" stroke-width="3" stroke-linecap="round"/>
                                        <circle id="vg_wrong_led_bulb" cx="132" cy="75" r="14" fill="#475569" stroke="#94A3B8" stroke-width="2"/>
                                        <text x="132" y="79" fill="#94A3B8" font-size="9" text-anchor="middle">OFF</text>
                                        <g id="vg_short_alert" style="display:none;">
                                            <rect x="180" y="55" width="85" height="40" rx="8" fill="#7F1D1D" stroke="#EF4444" stroke-width="1.5"/>
                                            <text x="222" y="72" fill="#FEE2E2" font-size="8.5" font-weight="bold" text-anchor="middle">CURTO-CIRCUITO!</text>
                                            <text x="222" y="86" fill="#FCA5A5" font-size="7.5" text-anchor="middle">A corrente ignora o LED</text>
                                        </g>
                                    </svg>
                                </div>

                                <ul style="color:#CBD5E1;font-size:0.9rem;line-height:1.6;margin:0 0 16px 18px;padding:0;">
                                    <li><b>1.</b> A eletricidade sempre procura o caminho mais fácil.</li>
                                    <li><b>2.</b> A lâmina metálica por baixo é uma pista livre sem resistência.</li>
                                    <li><b>3.</b> A corrente passa direto pela barra e <b>ignora o LED</b>!</li>
                                    <li><b>4.</b> O LED fica apagado e nada acende!</li>
                                </ul>
                            </div>

                            <button type="button" class="lab-btn-test" id="vg_btn_test_bad" onclick="lab_vguide_testLed(false)" style="background:#EF4444;color:white;width:100%;justify-content:center;">
                                <i class="fa-solid fa-triangle-exclamation"></i> Tentar Ligar no Jeito Errado
                            </button>
                        </div>
                    </div>

                    <!-- DESAFIO MAKER DO NÍVEL 3: O MISTÉRIO DA POLARIDADE DO LED -->
                    <div class="lab-challenge-box" id="lab_challenge_box_3">
                        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;margin-bottom:14px;">
                            <div style="display:flex;align-items:center;gap:12px;">
                                <div style="background:#10B981;color:white;width:42px;height:42px;border-radius:14px;display:flex;align-items:center;justify-content:center;font-size:1.3rem;box-shadow:0 0 14px rgba(16,185,129,0.5);">
                                    <i class="fa-solid fa-lightbulb"></i>
                                </div>
                                <div>
                                    <h3 class="lab-title-font" style="color:#FBBF24;margin:0;font-size:1.3rem;">
                                        🎮 Desafio Maker do Nível 3: Polaridade & Curto-Circuito!
                                    </h3>
                                    <span style="color:#94A3B8;font-size:0.88rem;">Acerte a pergunta sobre o LED para desbloquear o Nível 4 (Jumpers do Arduino):</span>
                                </div>
                            </div>
                            <span class="lab-challenge-status" id="lab_challenge_status_3">
                                <i class="fa-solid fa-lock"></i> Desafio Obrigatório
                            </span>
                        </div>

                        <div class="lab-quiz-card" style="margin:0;background:#0F172A;">
                            <h4 class="lab-title-font" style="color:white;font-size:1.15rem;margin:0 0 10px;">
                                ❓ Na perna do LED, qual é o terminal positivo (Ânodo +) que deve receber o sinal de 5V do Arduino?
                            </h4>
                            <button type="button" class="lab-quiz-opt" id="opt_c3_1" onclick="lab_answerStepChallenge(3, 1, false)">
                                <span style="font-weight:900;color:#10B981;">A)</span> A perna mais curta chanfrada (Cátodo -).
                            </button>
                            <button type="button" class="lab-quiz-opt" id="opt_c3_2" onclick="lab_answerStepChallenge(3, 2, true)">
                                <span style="font-weight:900;color:#10B981;">B)</span> 🌟 A perna mais LONGA (Ânodo +)! É ela quem recebe o sinal positivo (+5V)!
                            </button>
                            <button type="button" class="lab-quiz-opt" id="opt_c3_3" onclick="lab_answerStepChallenge(3, 3, false)">
                                <span style="font-weight:900;color:#10B981;">C)</span> Qualquer uma das duas pernas, tanto faz.
                            </button>
                            <div class="quiz-feedback" id="lab_step_fb_3" style="display:none;margin-top:12px;padding:12px 16px;border-radius:12px;font-size:0.95rem;font-weight:bold;"></div>
                        </div>
                    </div>

                    <!-- NAVEGAÇÃO CONTÍNUA (BLOQUEADA ATÉ VENCER O DESAFIO) -->
                    <div style="display:flex;justify-content:space-between;margin-top:20px;flex-wrap:wrap;gap:12px;">
                        <button type="button" class="lab-nav-btn" onclick="lab_switchGuideStep(2)">
                            <i class="fa-solid fa-arrow-left"></i> Voltar aos Resistores
                        </button>
                        <button type="button" class="lab-nav-btn locked" id="lab_next_btn_3" onclick="lab_advanceNextStep(3)">
                            <i class="fa-solid fa-lock"></i> Conclua o Desafio Acima para Avançar ao Nível 4
                        </button>
                    </div>
                </div>
            </div>

            <!-- ================= NÍVEL 4: OS JUMPERS, ARDUINO UNO & SIMULADOR DE MONTAGEM ================= -->
            <div class="lab-guide-card" id="lab_guide_step_4" style="display:none;">
                <div class="lab-guide-header">
                    <div>
                        <h2 class="lab-title-font lab-guide-title">
                            <span style="color:#A78BFA;">🔌 Nível 4:</span> Ligando os Jumpers no Arduino UNO
                        </h2>
                        <span style="color:#94A3B8;font-size:0.95rem;">Conectando o cérebro eletrônico: Pinos 13, 12, 11 e o GND</span>
                    </div>
                    <div class="lab-guide-tag">Nível 4 de 6</div>
                </div>

                <div style="font-size:1.05rem;line-height:1.7;color:#CBD5E1;">
                    <p>
                        Agora que os componentes estão na protoboard, precisamos conectar os fios flexíveis com pontinhas metálicas rígidas chamados <b>Jumpers (Macho-Macho)</b> para levar os comandos do Arduino até a placa de ensaios!
                    </p>

                    <div class="lab-box-recap">
                        <h3 class="lab-title-font" style="color:#FDE68A;font-size:1.25rem;margin:0 0 8px;">
                            🤔 Por que usamos pinos diferentes do Arduino para cada LED?
                        </h3>
                        <p style="margin:0;">
                            O semáforo precisa acender o <b>Vermelho</b>, depois o <b>Amarelo</b>, depois o <b>Verde</b> em momentos separados! 
                            Se ligássemos todos no mesmo pino, eles acenderiam todos juntos e os carros da cidade bateriam! Ligando nos pinos <b>13, 12 e 11</b>, o programa C++ pode controlar cada luz de forma 100% independente!
                        </p>
                    </div>

                    <h3 class="lab-title-font" style="color:white;margin:22px 0 10px;">
                        📍 As 4 Conexões de Jumpers que você vai fazer agora:
                    </h3>

                    <table class="lab-pins-table">
                        <thead>
                            <tr>
                                <th>Cor do Fio</th>
                                <th>Ponta 1 (No Arduino UNO)</th>
                                <th>Ponta 2 (Na Protoboard)</th>
                                <th>Função</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>🖤 <b>Fio Preto (ou Azul)</b></td>
                                <td>Pino <b style="color:#38BDF8;">GND</b> (Terra / 0V)</td>
                                <td>Barramento Azul <b style="color:#38BDF8;">(-) GND</b></td>
                                <td>Fecha o retorno da corrente de todos os resistores!</td>
                            </tr>
                            <tr>
                                <td>🔴 <b>Fio Vermelho</b></td>
                                <td>Pino Digital <b style="color:#EF4444;">13</b></td>
                                <td>Furo <b style="color:#EF4444;">10A</b> (Coluna do Ânodo)</td>
                                <td>Envia 5V para acender o LED Vermelho</td>
                            </tr>
                            <tr>
                                <td>🟡 <b>Fio Amarelo</b></td>
                                <td>Pino Digital <b style="color:#F59E0B;">12</b></td>
                                <td>Furo <b style="color:#F59E0B;">16A</b> (Coluna do Ânodo)</td>
                                <td>Envia 5V para acender o LED Amarelo</td>
                            </tr>
                            <tr>
                                <td>🟢 <b>Fio Verde</b></td>
                                <td>Pino Digital <b style="color:#10B981;">11</b></td>
                                <td>Furo <b style="color:#10B981;">22A</b> (Coluna do Ânodo)</td>
                                <td>Envia 5V para acender o LED Verde</td>
                            </tr>
                        </tbody>
                    </table>

                    <!-- SIMULADOR INTERATIVO DE MONTAGEM EM 4 PASSOS INTEGRADO -->
                    <div style="margin:26px 0 14px;">
                        <h3 class="lab-title-font" style="color:#A78BFA;font-size:1.3rem;margin:0 0 6px;">
                            🎮 Simulador Interativo: Treine a Montagem em 4 Passos Antes da Mesa Real!
                        </h3>
                        <p style="color:#94A3B8;margin:0;font-size:0.95rem;">
                            Clique nos botões abaixo de 1 a 4 para conectar cada peça virtualmente e ver o circuito se fechar:
                        </p>
                    </div>

                    <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(200px, 1fr));gap:10px;margin-bottom:16px;">
                        <button type="button" class="lab-btn-test" id="vg_mini_btn_1" onclick="lab_vguide_miniStep(1)" style="background:#0F172A;border:2px solid #334155;color:#94A3B8;justify-content:center;">
                            1️⃣ 1. Jumper D13 -> 10A
                        </button>
                        <button type="button" class="lab-btn-test" id="vg_mini_btn_2" onclick="lab_vguide_miniStep(2)" style="background:#0F172A;border:2px solid #334155;color:#94A3B8;justify-content:center;">
                            2️⃣ 2. LED Vermelho (10C / 11C)
                        </button>
                        <button type="button" class="lab-btn-test" id="vg_mini_btn_3" onclick="lab_vguide_miniStep(3)" style="background:#0F172A;border:2px solid #334155;color:#94A3B8;justify-content:center;">
                            3️⃣ 3. Resistor 300Ω (11D -> GND)
                        </button>
                        <button type="button" class="lab-btn-test" id="vg_mini_btn_4" onclick="lab_vguide_miniStep(4)" style="background:#0F172A;border:2px solid #334155;color:#94A3B8;justify-content:center;">
                            4️⃣ 4. Jumper Preto GND
                        </button>
                    </div>

                    <div style="background:#020617;border:3px solid #334155;border-radius:20px;padding:20px;text-align:center;position:relative;overflow:hidden;margin-bottom:20px;">
                        <svg width="400" height="200" viewBox="0 0 400 200" id="vg_mini_canvas" style="margin:0 auto;display:block;">
                            <rect x="40" y="15" width="320" height="165" rx="14" fill="#F8FAFC" stroke="#CBD5E1" stroke-width="3"/>
                            <text x="200" y="34" fill="#94A3B8" font-family="'Fredoka One', cursive" font-size="11" text-anchor="middle">PROTOBOARD — SIMULADOR DO LED VERMELHO</text>
                            <rect x="135" y="45" width="30" height="95" rx="4" fill="#E2E8F0" opacity="0.6"/>
                            <rect x="195" y="45" width="30" height="95" rx="4" fill="#E2E8F0" opacity="0.6"/>
                            <text x="150" y="42" fill="#475569" font-size="9" font-weight="bold" text-anchor="middle">Col 10</text>
                            <text x="210" y="42" fill="#475569" font-size="9" font-weight="bold" text-anchor="middle">Col 11</text>
                            <rect x="60" y="150" width="280" height="16" rx="4" fill="#E0F2FE"/>
                            <line x1="65" y1="158" x2="335" y2="158" stroke="#0284C7" stroke-width="2"/>
                            <text x="50" y="162" fill="#0284C7" font-weight="bold" font-size="12">-</text>

                            <circle cx="150" cy="60" r="4.5" fill="#1E293B" stroke="#94A3B8"/><text x="130" y="63" fill="#64748B" font-size="7">10A</text>
                            <circle cx="150" cy="85" r="4.5" fill="#1E293B" stroke="#94A3B8"/><text x="130" y="88" fill="#64748B" font-size="7">10C</text>
                            <circle cx="210" cy="85" r="4.5" fill="#1E293B" stroke="#94A3B8"/><text x="228" y="88" fill="#64748B" font-size="7">11C</text>
                            <circle cx="210" cy="115" r="4.5" fill="#1E293B" stroke="#94A3B8"/><text x="228" y="118" fill="#64748B" font-size="7">11D</text>
                            <circle cx="210" cy="158" r="4.5" fill="#1E293B" stroke="#0284C7"/>

                            <!-- Dinâmicos -->
                            <g id="vg_dyn_jumper_red" style="display:none;">
                                <path d="M 0 60 Q 75 20 150 60" fill="none" stroke="#EF4444" stroke-width="5" stroke-linecap="round"/>
                                <circle cx="150" cy="60" r="4.5" fill="#DC2626"/>
                                <text x="35" y="50" fill="#EF4444" font-weight="bold" font-size="8.5">D13 (5V)</text>
                            </g>
                            <g id="vg_dyn_led" style="display:none;">
                                <path d="M 150 85 Q 180 50 210 85" fill="none" stroke="#CBD5E1" stroke-width="3" stroke-linecap="round"/>
                                <circle id="vg_dyn_led_glow" cx="180" cy="62" r="18" fill="#EF4444" opacity="0.4" style="display:none;"/>
                                <circle id="vg_dyn_led_body" cx="180" cy="62" r="13" fill="#DC2626" stroke="#FFFFFF" stroke-width="2"/>
                                <text x="180" y="66" fill="white" font-size="8.5" font-weight="bold" text-anchor="middle">LED</text>
                            </g>
                            <g id="vg_dyn_resistor" style="display:none;">
                                <line x1="210" y1="115" x2="210" y2="158" stroke="#94A3B8" stroke-width="3"/>
                                <rect x="202" y="126" width="16" height="20" rx="4" fill="#D4B996" stroke="#8C6D4F" stroke-width="1.5"/>
                                <rect x="202" y="129" width="16" height="2.5" fill="#EA580C"/>
                                <rect x="202" y="134" width="16" height="2.5" fill="#000000"/>
                                <rect x="202" y="139" width="16" height="2.5" fill="#78350F"/>
                                <text x="238" y="138" fill="#FBBF24" font-size="7.5" font-weight="bold">300Ω</text>
                            </g>
                            <g id="vg_dyn_jumper_gnd" style="display:none;">
                                <path d="M 0 158 Q 45 185 90 158" fill="none" stroke="#0F172A" stroke-width="5" stroke-linecap="round"/>
                                <circle cx="90" cy="158" r="4.5" fill="#334155"/>
                                <text x="25" y="185" fill="#38BDF8" font-weight="bold" font-size="8.5">GND (Terra)</text>
                            </g>
                        </svg>

                        <div style="display:flex;justify-content:center;gap:12px;margin-top:14px;flex-wrap:wrap;">
                            <button type="button" class="lab-btn-test" id="vg_btn_fire_circuit" onclick="lab_vguide_testMiniCircuit()" disabled style="background:#334155;color:#94A3B8;cursor:not-allowed;padding:10px 22px;font-size:1rem;">
                                <i class="fa-solid fa-power-off"></i> ACENDER O LED AGORA!
                            </button>
                            <button type="button" class="lab-btn-test" onclick="lab_vguide_resetMini()" style="background:#0F172A;border:2px solid #334155;color:#CBD5E1;">
                                <i class="fa-solid fa-rotate-left"></i> Limpar e Tentar de Novo
                            </button>
                        </div>

                        <div id="vg_mini_status_msg" style="margin-top:10px;font-weight:bold;color:#94A3B8;font-size:0.9rem;">
                            Complete os 4 passos clicando nos botões acima para destravar o botão de energia!
                        </div>
                    </div>

                    <!-- DESAFIO MAKER DO NÍVEL 4: O RETORNO DO CIRCUITO -->
                    <div class="lab-challenge-box" id="lab_challenge_box_4">
                        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;margin-bottom:14px;">
                            <div style="display:flex;align-items:center;gap:12px;">
                                <div style="background:#8B5CF6;color:white;width:42px;height:42px;border-radius:14px;display:flex;align-items:center;justify-content:center;font-size:1.3rem;box-shadow:0 0 14px rgba(139,92,246,0.5);">
                                    <i class="fa-solid fa-plug"></i>
                                </div>
                                <div>
                                    <h3 class="lab-title-font" style="color:#FBBF24;margin:0;font-size:1.3rem;">
                                        🎮 Desafio Maker do Nível 4: A Conexão com o Arduino!
                                    </h3>
                                    <span style="color:#94A3B8;font-size:0.88rem;">Acerte a lógica dos fios jumpers para desbloquear a Bancada Virtual do Nível 5:</span>
                                </div>
                            </div>
                            <span class="lab-challenge-status" id="lab_challenge_status_4">
                                <i class="fa-solid fa-lock"></i> Desafio Obrigatório
                            </span>
                        </div>

                        <div class="lab-quiz-card" style="margin:0;background:#0F172A;">
                            <h4 class="lab-title-font" style="color:white;font-size:1.15rem;margin:0 0 10px;">
                                ❓ Por que ligamos os 3 LEDs em pinos separados (13, 12 e 11) do Arduino em vez de colocar todos no mesmo pino?
                            </h4>
                            <button type="button" class="lab-quiz-opt" id="opt_c4_1" onclick="lab_answerStepChallenge(4, 1, true)">
                                <span style="font-weight:900;color:#A78BFA;">A)</span> 🌟 Para o código C++ poder ligar e desligar cada cor individualmente no tempo certo do semáforo!
                            </button>
                            <button type="button" class="lab-quiz-opt" id="opt_c4_2" onclick="lab_answerStepChallenge(4, 2, false)">
                                <span style="font-weight:900;color:#A78BFA;">B)</span> Porque o Arduino não aguenta ligar mais de 1 fio por placa.
                            </button>
                            <button type="button" class="lab-quiz-opt" id="opt_c4_3" onclick="lab_answerStepChallenge(4, 3, false)">
                                <span style="font-weight:900;color:#A78BFA;">C)</span> Apenas para o circuito ficar mais bonito e colorido.
                            </button>
                            <div class="quiz-feedback" id="lab_step_fb_4" style="display:none;margin-top:12px;padding:12px 16px;border-radius:12px;font-size:0.95rem;font-weight:bold;"></div>
                        </div>
                    </div>

                    <!-- NAVEGAÇÃO CONTÍNUA (BLOQUEADA ATÉ VENCER O DESAFIO) -->
                    <div style="display:flex;justify-content:space-between;margin-top:20px;flex-wrap:wrap;gap:12px;">
                        <button type="button" class="lab-nav-btn" onclick="lab_switchGuideStep(3)">
                            <i class="fa-solid fa-arrow-left"></i> Voltar aos LEDs
                        </button>
                        <button type="button" class="lab-nav-btn locked" id="lab_next_btn_4" onclick="lab_advanceNextStep(4)">
                            <i class="fa-solid fa-lock"></i> Conclua o Desafio Acima para Avançar ao Nível 5
                        </button>
                    </div>
                </div>
            </div>

            <!-- ================= NÍVEL 5: BANCADA VIRTUAL & GRANDE TESTE ================= -->
            <div class="lab-guide-card" id="lab_guide_step_5" style="display:none;">
                <div class="lab-guide-header">
                    <div>
                        <h2 class="lab-title-font lab-guide-title">
                            <span style="color:#EC4899;">🔬 Nível 5:</span> A Bancada Virtual & Grande Teste
                        </h2>
                        <span style="color:#94A3B8;font-size:0.95rem;">Ligar o Arduino, testar os 3 LEDs e preparar para a instalação da IDE!</span>
                    </div>
                    <div class="lab-guide-tag">Nível 5 de 6</div>
                </div>

                <div style="font-size:1.05rem;line-height:1.7;color:#CBD5E1;">
                    <!-- CHECKLIST DE SEGURANÇA -->
                    <div style="background:#0F172A;border:2px solid #334155;border-radius:20px;padding:20px;margin-bottom:20px;">
                        <h3 class="lab-title-font" style="color:#FBBF24;margin:0 0 12px;font-size:1.2rem;">
                            📋 Checklist de Segurança com o Professor na Bancada Real:
                        </h3>
                        <div style="display:flex;flex-direction:column;gap:10px;">
                            <label style="display:flex;align-items:center;gap:12px;cursor:pointer;">
                                <input type="checkbox" id="chk_1" onchange="lab_checkListChanged()" style="width:20px;height:20px;accent-color:#10B981;cursor:pointer;">
                                <span>Os 3 Resistores de 300Ω estão ligados ao Barramento Azul (-) GND.</span>
                            </label>
                            <label style="display:flex;align-items:center;gap:12px;cursor:pointer;">
                                <input type="checkbox" id="chk_2" onchange="lab_checkListChanged()" style="width:20px;height:20px;accent-color:#10B981;cursor:pointer;">
                                <span>A perna LONGA (Ânodo +) de cada LED está na coluna do fio correspondente (10, 16, 22).</span>
                            </label>
                            <label style="display:flex;align-items:center;gap:12px;cursor:pointer;">
                                <input type="checkbox" id="chk_3" onchange="lab_checkListChanged()" style="width:20px;height:20px;accent-color:#10B981;cursor:pointer;">
                                <span>O fio preto liga o pino GND do Arduino ao barramento azul da protoboard.</span>
                            </label>
                            <label style="display:flex;align-items:center;gap:12px;cursor:pointer;">
                                <input type="checkbox" id="chk_4" onchange="lab_checkListChanged()" style="width:20px;height:20px;accent-color:#10B981;cursor:pointer;">
                                <span>Os fios Vermelho, Amarelo e Verde estão nos pinos 13, 12 e 11 do Arduino.</span>
                            </label>
                        </div>
                    </div>

                    <!-- BANCADA VIRTUAL REALISTA COM ARDUINO UNO E PROTOBOARD 30 -->
                    <div class="lab-workbench-grid">
                        <div style="background:#1E293B;border:2px solid #334155;border-radius:20px;padding:16px 20px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:14px;">
                            <div style="display:flex;align-items:center;gap:14px;">
                                <button type="button" class="lab-btn-test" id="lab_pwr_toggle_btn" onclick="lab_toggleUsbPower()" style="background:#10B981;color:white;padding:10px 20px;font-size:1rem;">
                                    <i class="fa-solid fa-power-off"></i> ENERGIA USB: <span id="lab_pwr_status_txt">LIGADA (5V)</span>
                                </button>
                                <div class="lab-meter-box">
                                    <div><span style="color:#94A3B8;">Tensão:</span> <span class="lab-meter-val" id="lab_meter_volt" style="color:#10B981;">5.00 V</span></div>
                                    <div style="width:1px;height:24px;background:#334155;"></div>
                                    <div><span style="color:#94A3B8;">Corrente:</span> <span class="lab-meter-val" id="lab_meter_curr" style="color:#38BDF8;">0.0 mA</span></div>
                                </div>
                            </div>
                            <div style="display:flex;gap:10px;flex-wrap:wrap;">
                                <button type="button" class="lab-btn-test" id="lab_labels_toggle_btn" onclick="lab_toggleVisualLabels()" style="background:#0284C7;color:white;" title="Mostrar ou ocultar etiquetas visuais flutuantes nos componentes">
                                    <i class="fa-solid fa-tags"></i> <span id="lab_labels_btn_text">Etiquetas Visuais: LIGADAS</span>
                                </button>
                                <button type="button" class="lab-btn-test" onclick="lab_resetSemafaroCircuit()" style="background:#334155;color:#E2E8F0;">
                                    <i class="fa-solid fa-rotate-left"></i> Resetar
                                </button>
                                <button type="button" class="lab-btn-test lab-btn-auto" onclick="lab_runTrafficSequence()">
                                    <i class="fa-solid fa-play"></i> Rodar Semáforo Automático
                                </button>
                            </div>
                        </div>

                        <!-- Botoeira individual dos pinos 13, 12, 11 -->
                        <div style="background:#0F172A;border:2px solid #334155;border-radius:20px;padding:14px 20px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;">
                            <span style="font-weight:900;color:#94A3B8;font-size:0.9rem;text-transform:uppercase;letter-spacing:1px;">
                                🎮 Testador de Pinos Digitais:
                            </span>
                            <div style="display:flex;gap:10px;flex-wrap:wrap;">
                                <button type="button" class="lab-btn-test lab-btn-red" id="btn_test_pin13" onclick="lab_togglePin(13)">
                                    🔴 Pino 13 (Vermelho): <span id="txt_pin13">OFF</span>
                                </button>
                                <button type="button" class="lab-btn-test lab-btn-yellow" id="btn_test_pin12" onclick="lab_togglePin(12)">
                                    🟡 Pino 12 (Amarelo): <span id="txt_pin12">OFF</span>
                                </button>
                                <button type="button" class="lab-btn-test lab-btn-green" id="btn_test_pin11" onclick="lab_togglePin(11)">
                                    🟢 Pino 11 (Verde): <span id="txt_pin11">OFF</span>
                                </button>
                            </div>
                        </div>

                        <!-- Banner Educativo de Interação Maker -->
                        <div style="background:rgba(2,132,199,0.12);border:2px solid #0284C7;border-radius:16px;padding:12px 18px;display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;">
                            <div style="display:flex;align-items:center;gap:10px;">
                                <span style="font-size:1.4rem;">💡</span>
                                <span style="color:#E2E8F0;font-size:0.9rem;">
                                    <strong>Etiquetas & Inspeção Ativas:</strong> Passe o cursor sobre qualquer componente (LEDs, resistores, jumpers, protoboard) ou clique para fixar o componente e abrir a Ficha Técnica detalhada!
                                </span>
                            </div>
                            <span style="background:#0F172A;color:#38BDF8;border:1px solid #38BDF8;padding:4px 12px;border-radius:20px;font-size:0.75rem;font-weight:bold;">
                                Interativo Maker
                            </span>
                        </div>

                        <!-- Área da Placa Arduino UNO & Protoboard 30 -->
                        <div class="lab-board-card">
                            <div style="display:flex;gap:24px;align-items:flex-start;justify-content:center;flex-wrap:wrap;">
                                <!-- Placa Arduino UNO -->
                                <div class="ard-uno-board" id="ard_uno_element">
                                    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
                                        <div class="ard-usb-port" onclick="lab_toggleUsbPower()" style="cursor:pointer;" title="Clique para ligar ou desligar alimentação USB"><i class="fa-solid fa-plug"></i> USB (5V)</div>
                                        <div style="font-family:'Fredoka One', cursive;font-size:1.1rem;letter-spacing:1px;">ARDUINO UNO</div>
                                    </div>
                                    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
                                        <div style="display:flex;align-items:center;gap:6px;font-size:0.8rem;font-weight:bold;">
                                            <span class="ard-led-on active" id="ard_led_on"></span> ON
                                        </div>
                                        <div style="display:flex;align-items:center;gap:6px;font-size:0.8rem;font-weight:bold;">
                                            <span class="ard-led-l" id="ard_led_l"></span> LED 'L' (13)
                                        </div>
                                    </div>
                                    <div class="ard-chip" style="cursor:pointer;" onclick="lab_inspectComponent('bb_protoboard', event)" title="Microcontrolador ATmega328P">ATMEGA328P-PU<br><span style="font-size:0.75rem;color:#94A3B8;">MICROCONTROLADOR 16MHz</span></div>
                                    <div style="background:#0F172A;border:1px solid #334155;border-radius:10px;padding:8px 12px;margin-top:10px;">
                                        <div style="font-size:0.75rem;color:#94A3B8;text-transform:uppercase;font-weight:bold;margin-bottom:6px;">Pinos Ativos (Passe o mouse ou clique):</div>
                                        <div style="display:flex;justify-content:space-between;font-family:monospace;font-size:0.85rem;font-weight:bold;">
                                            <span id="ard_pin_gnd" style="color:#38BDF8;cursor:pointer;padding:2px 6px;border-radius:6px;transition:0.15s;" onmouseenter="lab_showBenchTooltip('j_gnd', event)" onmousemove="lab_updateTooltipPos(event)" onmouseleave="lab_hideBenchTooltip()" onclick="lab_inspectComponent('j_gnd', event)">GND</span>
                                            <span id="ard_pin_13" style="color:#EF4444;cursor:pointer;padding:2px 6px;border-radius:6px;transition:0.15s;" onmouseenter="lab_showBenchTooltip('j_13', event)" onmousemove="lab_updateTooltipPos(event)" onmouseleave="lab_hideBenchTooltip()" onclick="lab_inspectComponent('j_13', event)">D13</span>
                                            <span id="ard_pin_12" style="color:#F59E0B;cursor:pointer;padding:2px 6px;border-radius:6px;transition:0.15s;" onmouseenter="lab_showBenchTooltip('j_12', event)" onmousemove="lab_updateTooltipPos(event)" onmouseleave="lab_hideBenchTooltip()" onclick="lab_inspectComponent('j_12', event)">D12</span>
                                            <span id="ard_pin_11" style="color:#10B981;cursor:pointer;padding:2px 6px;border-radius:6px;transition:0.15s;" onmouseenter="lab_showBenchTooltip('j_11', event)" onmousemove="lab_updateTooltipPos(event)" onmouseleave="lab_hideBenchTooltip()" onclick="lab_inspectComponent('j_11', event)">D11</span>
                                        </div>
                                    </div>
                                </div>

                                <!-- Protoboard de 30 Pinos com SVG Overlay -->
                                <div class="bb-body" id="bb_element_root">
                                    <svg class="bb-svg-overlay" id="bb_svg_canvas"></svg>
                                    <div class="bb-title-label" style="cursor:pointer;" onclick="lab_inspectComponent('bb_protoboard', event)">PROTOBOARD DE 30 PINOS — LABORATÓRIO MAKER</div>
                                    <div class="bb-power-strip">
                                        <div class="bb-power-row">
                                            <span class="bb-power-sign plus">+</span><div class="bb-power-line plus"></div>
                                            <div class="bb-power-holes" id="bb_rail_top_plus"></div>
                                        </div>
                                        <div class="bb-power-row">
                                            <span class="bb-power-sign minus">-</span><div class="bb-power-line minus"></div>
                                            <div class="bb-power-holes" id="bb_rail_top_minus"></div>
                                        </div>
                                    </div>
                                    <div class="bb-center-area">
                                        <div class="bb-cols-header" id="bb_cols_header_top"></div>
                                        <div class="bb-terminal-bank">
                                            <div class="bb-row-alphabet"><div>A</div><div>B</div><div>C</div><div>D</div><div>E</div></div>
                                            <div class="bb-matrix" id="bb_matrix_top"></div>
                                        </div>
                                        <div class="bb-center-trench" style="cursor:pointer;" onclick="lab_inspectComponent('bb_protoboard', event)" title="Calha Isoladora Central"></div>
                                        <div class="bb-terminal-bank">
                                            <div class="bb-row-alphabet"><div>F</div><div>G</div><div>H</div><div>I</div><div>J</div></div>
                                            <div class="bb-matrix" id="bb_matrix_bottom"></div>
                                        </div>
                                        <div class="bb-cols-header" id="bb_cols_header_bottom"></div>
                                    </div>
                                    <div class="bb-power-strip">
                                        <div class="bb-power-row">
                                            <span class="bb-power-sign plus">+</span><div class="bb-power-line plus"></div>
                                            <div class="bb-power-holes" id="bb_rail_bot_plus"></div>
                                        </div>
                                        <div class="bb-power-row" style="cursor:pointer;" onclick="lab_inspectComponent('bb_gnd_rail', event)" onmouseenter="lab_showBenchTooltip('bb_gnd_rail', event)" onmousemove="lab_updateTooltipPos(event)" onmouseleave="lab_hideBenchTooltip()" title="Barramento Azul (-) GND de 0V">
                                            <span class="bb-power-sign minus">-</span><div class="bb-power-line minus"></div>
                                            <div class="bb-power-holes" id="bb_rail_bot_minus"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Tooltip Flutuante Dinâmica da Bancada -->
                        <div id="lab_workbench_tooltip" class="lab-bench-tooltip"></div>

                        <!-- PAINEL DE IDENTIFICAÇÃO E LEGENDAS DINÂMICAS DOS COMPONENTES -->
                        <div class="lab-inspector-box" id="lab_workbench_inspector">
                            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;flex-wrap:wrap;gap:10px;">
                                <div style="display:flex;align-items:center;gap:12px;">
                                    <div style="background:#0284C7;color:white;width:38px;height:38px;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:1.15rem;box-shadow:0 0 12px rgba(2,132,199,0.5);">
                                        <i class="fa-solid fa-microchip"></i>
                                    </div>
                                    <div>
                                        <h4 class="lab-title-font" style="color:white;margin:0;font-size:1.2rem;">
                                            Legendas Dinâmicas & Identificação dos Componentes
                                        </h4>
                                        <span style="color:#94A3B8;font-size:0.86rem;">Passe o mouse sobre os componentes da bancada ou clique nos botões abaixo para ver nome, função e polaridade:</span>
                                    </div>
                                </div>
                                <div style="display:flex;gap:8px;">
                                    <button type="button" class="lab-chip-btn" onclick="lab_toggleVisualLabels()">
                                        <i class="fa-solid fa-tags"></i> Alternar Etiquetas no Circuito
                                    </button>
                                </div>
                            </div>

                            <!-- Chips Rápidos de Seleção dos Componentes -->
                            <div class="lab-inspector-chips" id="lab_inspector_chips"></div>

                            <!-- Ficha Técnica Interativa do Componente Selecionado -->
                            <div id="lab_inspector_details"></div>
                        </div>
                    </div>

                    <!-- DESAFIO MAKER DO NÍVEL 5: O GRANDE TESTE NA BANCADA -->
                    <div class="lab-challenge-box" id="lab_challenge_box_5">
                        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;margin-bottom:14px;">
                            <div style="display:flex;align-items:center;gap:12px;">
                                <div style="background:#EC4899;color:white;width:42px;height:42px;border-radius:14px;display:flex;align-items:center;justify-content:center;font-size:1.3rem;box-shadow:0 0 14px rgba(236,72,153,0.5);">
                                    <i class="fa-solid fa-flask-vial"></i>
                                </div>
                                <div>
                                    <h3 class="lab-title-font" style="color:#FBBF24;margin:0;font-size:1.3rem;">
                                        🎮 Desafio Maker do Nível 5: O Grande Teste na Bancada!
                                    </h3>
                                    <span style="color:#94A3B8;font-size:0.88rem;">Realize os testes reais no simulador para provar que seu semáforo está funcionando:</span>
                                </div>
                            </div>
                            <span class="lab-challenge-status" id="lab_challenge_status_5">
                                <i class="fa-solid fa-lock"></i> Testes Obrigatórios
                            </span>
                        </div>

                        <!-- Mini Missões Práticas na Bancada -->
                        <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(220px, 1fr));gap:12px;margin-bottom:14px;">
                            <div id="bench_chk_usb" style="background:#0F172A;border:1px solid #334155;border-radius:12px;padding:12px;display:flex;align-items:center;gap:10px;">
                                <span id="icon_chk_usb" style="font-size:1.2rem;">⚪</span>
                                <div>
                                    <div style="font-weight:bold;color:white;font-size:0.9rem;">1. Energia USB</div>
                                    <span style="color:#94A3B8;font-size:0.8rem;">Ligue a alimentação USB (5V)</span>
                                </div>
                            </div>
                            <div id="bench_chk_pins" style="background:#0F172A;border:1px solid #334155;border-radius:12px;padding:12px;display:flex;align-items:center;gap:10px;">
                                <span id="icon_chk_pins" style="font-size:1.2rem;">⚪</span>
                                <div>
                                    <div style="font-weight:bold;color:white;font-size:0.9rem;">2. Acender os LEDs</div>
                                    <span style="color:#94A3B8;font-size:0.8rem;">Teste os pinos ou rode o automático</span>
                                </div>
                            </div>
                            <div id="bench_chk_insp" style="background:#0F172A;border:1px solid #334155;border-radius:12px;padding:12px;display:flex;align-items:center;gap:10px;">
                                <span id="icon_chk_insp" style="font-size:1.2rem;">⚪</span>
                                <div>
                                    <div style="font-weight:bold;color:white;font-size:0.9rem;">3. Inspecionar Peça</div>
                                    <span style="color:#94A3B8;font-size:0.8rem;">Clique em qualquer peça na bancada</span>
                                </div>
                            </div>
                        </div>

                        <div style="display:flex;justify-content:center;gap:12px;flex-wrap:wrap;">
                            <button type="button" class="lab-btn-test" id="btn_validate_bench" onclick="lab_validateBenchChallenge()" style="background:#0284C7;color:white;padding:10px 22px;font-size:1rem;">
                                <i class="fa-solid fa-circle-check"></i> Validar Meus Testes de Bancada e Concluir ⭐
                            </button>
                        </div>
                        <div class="quiz-feedback" id="lab_step_fb_5" style="display:none;margin-top:12px;padding:12px 16px;border-radius:12px;font-size:0.95rem;font-weight:bold;"></div>
                    </div>

                    <!-- NAVEGAÇÃO CONTÍNUA (BLOQUEADA ATÉ VENCER O DESAFIO) -->
                    <div style="display:flex;justify-content:space-between;margin-top:20px;flex-wrap:wrap;gap:12px;">
                        <button type="button" class="lab-nav-btn" onclick="lab_switchGuideStep(4)">
                            <i class="fa-solid fa-arrow-left"></i> Voltar aos Jumpers
                        </button>
                        <button type="button" class="lab-nav-btn locked" id="lab_next_btn_5" onclick="lab_advanceNextStep(5)">
                            <i class="fa-solid fa-lock"></i> Conclua os Testes da Bancada para Avançar ao Nível 6
                        </button>
                    </div>
                </div>
            </div>

            <!-- ================= NÍVEL 6: MINI-GAME MAKER & MISSÕES DA AULA 7 ================= -->
            <div class="lab-guide-card" id="lab_guide_step_6" style="display:none;">
                <div class="lab-guide-header">
                    <div>
                        <h2 class="lab-title-font lab-guide-title">
                            <span style="color:#FBBF24;">🏆 Nível 6:</span> Mini-Game Maker & Conclusão da Aula 7!
                        </h2>
                        <span style="color:#94A3B8;font-size:0.95rem;">Você desvendou todos os segredos do hardware e montou o semáforo na protoboard!</span>
                    </div>
                    <div class="lab-guide-tag" style="background:#F59E0B;color:#0F172A;font-weight:900;">Mini-Game & Missões 🎮</div>
                </div>

                <div style="display:grid;grid-template-columns:1fr;gap:24px;">
                    <!-- BANNER CELEBRATIVO DE VITÓRIA -->
                    <div style="background:linear-gradient(135deg, rgba(16,185,129,0.15), rgba(2,132,199,0.15));border:2px solid #10B981;border-radius:24px;padding:24px;text-align:center;">
                        <div style="font-size:3.5rem;margin-bottom:6px;">🎮⚡🎉</div>
                        <h3 class="lab-title-font" style="color:#A7F3D0;font-size:1.8rem;margin:0 0 8px;">
                            Parabéns, Jovem Engenheiro(a) Maker!
                        </h3>
                        <p style="color:#CBD5E1;font-size:1.05rem;max-width:700px;margin:0 auto 16px;line-height:1.6;">
                            Você passou por todos os <b>Checks de Conhecimento</b> ao longo da trilha da Aula 7! Agora você entende o que acontece embaixo do plástico da protoboard, a pegadinha dos resistores sem polaridade e a importância da perna longa dos LEDs!
                        </p>
                        <div style="display:flex;justify-content:center;gap:12px;flex-wrap:wrap;">
                            <button type="button" class="lab-btn-test" onclick="playSound('success'); if(typeof triggerConfetti==='function') triggerConfetti(4000);" style="background:linear-gradient(135deg, #10B981, #059669);color:white;padding:12px 24px;font-size:1rem;border-radius:24px;">
                                <i class="fa-solid fa-wand-magic-sparkles"></i> Soltar Chuva de Confetes Maker! 🎉
                            </button>
                        </div>
                        <div style="background:rgba(15,23,42,0.85);border:1px dashed #38BDF8;border-radius:14px;padding:12px 18px;margin-top:16px;display:flex;align-items:center;gap:12px;text-align:left;">
                            <i class="fa-solid fa-graduation-cap" style="color:#38BDF8;font-size:1.6rem;flex-shrink:0;"></i>
                            <span style="color:#CBD5E1;font-size:0.92rem;line-height:1.5;">
                                <b>Nota da Formatura:</b> O <b>Certificado Oficial do Curso</b> será emitido exclusivamente na conclusão da <b>Aula 10</b> (com programação e upload no Arduino IDE). Aqui na Aula 7 você conquista o troféu prático de Mestre dos Circuitos e as 3 Estrelas da Bancada!
                            </span>
                        </div>
                    </div>

                    <!-- OS 5 EMBLEMAS DE DOMÍNIO CONQUISTADOS -->
                    <div>
                        <h3 class="lab-title-font" style="font-size:1.35rem;color:white;margin:0 0 14px;">
                            🎖️ As 5 Insígnias de Conhecimento Conquistadas na Trilha:
                        </h3>
                        <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(200px, 1fr));gap:12px;">
                            <div style="background:#0F172A;border:1px solid #10B981;border-radius:16px;padding:14px;display:flex;align-items:center;gap:12px;">
                                <span style="font-size:1.8rem;">🧱</span>
                                <div>
                                    <div style="color:#38BDF8;font-weight:900;font-size:0.9rem;">1. Raio-X Interno</div>
                                    <span style="color:#94A3B8;font-size:0.78rem;">Lâminas verticais e calha central divisória</span>
                                </div>
                            </div>
                            <div style="background:#0F172A;border:1px solid #10B981;border-radius:16px;padding:14px;display:flex;align-items:center;gap:12px;">
                                <span style="font-size:1.8rem;">🛡️</span>
                                <div>
                                    <div style="color:#F59E0B;font-weight:900;font-size:0.9rem;">2. Resistores 300Ω</div>
                                    <span style="color:#94A3B8;font-size:0.78rem;">Sem polaridade! Proteção ideal de ~15.3 mA</span>
                                </div>
                            </div>
                            <div style="background:#0F172A;border:1px solid #10B981;border-radius:16px;padding:14px;display:flex;align-items:center;gap:12px;">
                                <span style="font-size:1.8rem;">🚦</span>
                                <div>
                                    <div style="color:#10B981;font-weight:900;font-size:0.9rem;">3. Polaridade dos LEDs</div>
                                    <span style="color:#94A3B8;font-size:0.78rem;">Ânodo Longo (+) e Cátodo Curto (-)</span>
                                </div>
                            </div>
                            <div style="background:#0F172A;border:1px solid #10B981;border-radius:16px;padding:14px;display:flex;align-items:center;gap:12px;">
                                <span style="font-size:1.8rem;">🔌</span>
                                <div>
                                    <div style="color:#A78BFA;font-weight:900;font-size:0.9rem;">4. Jumpers no Arduino</div>
                                    <span style="color:#94A3B8;font-size:0.78rem;">Pinos 13, 12, 11 e retorno no pino GND</span>
                                </div>
                            </div>
                            <div style="background:#0F172A;border:1px solid #10B981;border-radius:16px;padding:14px;display:flex;align-items:center;gap:12px;">
                                <span style="font-size:1.8rem;">🔬</span>
                                <div>
                                    <div style="color:#EC4899;font-weight:900;font-size:0.9rem;">5. Bancada Viva</div>
                                    <span style="color:#94A3B8;font-size:0.78rem;">Alimentação 5V e semáforo aceso</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- AS 3 MISSÕES OFICIAIS PARA O LEADERBOARD -->
                    <div>
                        <h3 class="lab-title-font" style="font-size:1.35rem;color:white;margin:0 0 14px;">
                            ⭐ Recordes Oficiais da Aula 7 (Speedrun Leaderboard)
                        </h3>

                        <!-- Missão 1 -->
                        <div class="lab-mission-card" id="mcard_1">
                            <div>
                                <h4 class="lab-title-font" style="color:#FBBF24;margin:0 0 6px;font-size:1.2rem;">
                                    ⭐ Missão 1: Protoboard 1-30 & Resistores de 300Ω
                                </h4>
                                <p style="color:#94A3B8;margin:0;font-size:0.95rem;">
                                    Compreenda os furos de 1 a 30 e encaixe os 3 resistores protetores (colunas 11, 17 e 23 até o barramento azul GND)!
                                </p>
                            </div>
                            <button type="button" class="lab-btn-test" id="mbtn_1" onclick="lab_completeMission(1, 'Resistores no Lugar!', 'Você dominou a protoboard e os resistores de 300Ω!')" style="background:#0284C7;color:white;">
                                Concluir Missão 1 ⭐
                            </button>
                        </div>

                        <!-- Missão 2 -->
                        <div class="lab-mission-card" id="mcard_2">
                            <div>
                                <h4 class="lab-title-font" style="color:#FBBF24;margin:0 0 6px;font-size:1.2rem;">
                                    ⭐⭐ Missão 2: Montagem dos 3 LEDs (Semáforo)
                                </h4>
                                <p style="color:#94A3B8;margin:0;font-size:0.95rem;">
                                    Encaixe os LEDs Vermelho, Amarelo e Verde com a perna longa (Ânodo) no positivo e perna curta no resistor!
                                </p>
                            </div>
                            <button type="button" class="lab-btn-test" id="mbtn_2" onclick="lab_completeMission(2, 'LEDs Perfeitamente Posicionados!', 'A polaridade dos 3 LEDs do semáforo está impecável!')" style="background:#0284C7;color:white;">
                                Concluir Missão 2 ⭐⭐
                            </button>
                        </div>

                        <!-- Missão 3 -->
                        <div class="lab-mission-card" id="mcard_3">
                            <div>
                                <h4 class="lab-title-font" style="color:#FBBF24;margin:0 0 6px;font-size:1.2rem;">
                                    ⭐⭐⭐ Missão 3: Arduino UNO & O Grande Teste
                                </h4>
                                <p style="color:#94A3B8;margin:0;font-size:0.95rem;">
                                    Conecte os jumpers aos pinos 13, 12, 11 e GND do Arduino UNO e realize o teste ao vivo das 3 luzes!
                                </p>
                            </div>
                            <button type="button" class="lab-btn-test" id="mbtn_3" onclick="lab_completeMission(3, 'Semáforo Completo e Testado!', 'Tudo pronto para a próxima aula com a IDE do Arduino!')" style="background:#0284C7;color:white;">
                                Concluir Missão 3 ⭐⭐⭐
                            </button>
                        </div>
                    </div>

                    <!-- MINI-GAME INTERATIVO DA AULA 7: FUGA DO CURTO-CIRCUITO -->
                    <div class="lab-game-arena" id="lab_circuit_game_box" style="background:#0F172A;border:3px solid #38BDF8;border-radius:24px;padding:26px;box-shadow:0 0 30px rgba(56,189,248,0.25);">
                        <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:2px solid #334155;padding-bottom:16px;margin-bottom:18px;flex-wrap:wrap;gap:12px;">
                            <div style="display:flex;align-items:center;gap:12px;">
                                <div style="background:#0284C7;color:white;width:46px;height:46px;border-radius:14px;display:flex;align-items:center;justify-content:center;font-size:1.4rem;box-shadow:0 0 16px rgba(2,132,199,0.6);">
                                    <i class="fa-solid fa-gamepad"></i>
                                </div>
                                <div>
                                    <h3 class="lab-title-font" style="color:#FBBF24;margin:0;font-size:1.35rem;">
                                        🎮 Mini-Game Maker: Fuga do Curto-Circuito & Mestre dos Circuitos!
                                    </h3>
                                    <span style="color:#94A3B8;font-size:0.86rem;">Exercite o conteúdo da aula: polaridade dos LEDs, resistores e circuitos sem solda!</span>
                                </div>
                            </div>

                            <!-- Placar, Vidas e Rodada -->
                            <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;">
                                <div style="background:#1E293B;border:1px solid #334155;border-radius:12px;padding:6px 14px;display:flex;align-items:center;gap:6px;font-weight:900;font-size:0.9rem;color:#38BDF8;">
                                    <i class="fa-solid fa-star" style="color:#F59E0B;"></i> <span id="mgame_score_txt">0 Pontos</span>
                                </div>
                                <div style="background:#1E293B;border:1px solid #334155;border-radius:12px;padding:6px 14px;font-size:1rem;letter-spacing:2px;" id="mgame_lives_box" title="Vidas">
                                    ❤️❤️❤️
                                </div>
                                <div style="background:#0284C7;color:white;border-radius:12px;padding:6px 14px;font-weight:900;font-size:0.85rem;" id="mgame_round_badge">
                                    Rodada 1 de 5
                                </div>
                            </div>
                        </div>

                        <!-- Tela do Jogo -->
                        <div id="mgame_screen_play">
                            <div style="background:#1E293B;border-radius:18px;padding:20px;margin-bottom:16px;">
                                <div style="display:flex;align-items:center;gap:8px;color:#A7F3D0;font-weight:bold;font-size:0.85rem;margin-bottom:6px;text-transform:uppercase;">
                                    <i class="fa-solid fa-bolt" style="color:#F59E0B;"></i> <span id="mgame_scenario_tag">Situação Maker</span>
                                </div>
                                <h4 class="lab-title-font" style="color:white;font-size:1.25rem;margin:0 0 12px;line-height:1.5;" id="mgame_question_txt">
                                    Carregando pergunta...
                                </h4>

                                <!-- Feedback Visual Dinâmico (LED piscando ou alerta de fumaça) -->
                                <div id="mgame_visual_board" style="background:#020617;border:2px solid #334155;border-radius:14px;padding:16px;text-align:center;min-height:90px;display:flex;align-items:center;justify-content:center;gap:14px;flex-wrap:wrap;">
                                    <div id="mgame_canvas_preview"></div>
                                </div>
                            </div>

                            <!-- Opções de Ação do Jogador -->
                            <div style="display:grid;grid-template-columns:1fr;gap:10px;" id="mgame_options_container">
                                <!-- Botões gerados via JS -->
                            </div>

                            <!-- Feedback da Rodada -->
                            <div id="mgame_round_feedback" style="display:none;margin-top:14px;padding:14px 18px;border-radius:14px;font-size:0.95rem;font-weight:bold;line-height:1.5;"></div>
                        </div>

                        <!-- Tela de Vitória ou Game Over -->
                        <div id="mgame_screen_result" style="display:none;text-align:center;padding:24px 16px;">
                            <div id="mgame_result_icon" style="font-size:4.5rem;margin-bottom:10px;">🏆</div>
                            <h3 class="lab-title-font" style="color:white;font-size:1.8rem;margin:0 0 10px;" id="mgame_result_title">Parabéns!</h3>
                            <p style="color:#CBD5E1;font-size:1.05rem;max-width:550px;margin:0 auto 20px;line-height:1.6;" id="mgame_result_desc">
                                Você completou todas as missões do mini-game!
                            </p>
                            <button type="button" class="lab-btn-test" onclick="lab_miniGame_restart()" style="background:#0284C7;color:white;padding:12px 28px;font-size:1.05rem;border-radius:24px;margin:0 auto;">
                                <i class="fa-solid fa-rotate-left"></i> Jogar Novamente
                            </button>
                        </div>
                    </div>

                    <!-- NAVEGAÇÃO CONTÍNUA FINAL -->
                    <div style="display:flex;justify-content:space-between;margin-top:10px;flex-wrap:wrap;gap:12px;">
                        <button type="button" class="lab-nav-btn" onclick="lab_switchGuideStep(5)">
                            <i class="fa-solid fa-arrow-left"></i> Voltar à Bancada Virtual
                        </button>
                        <button type="button" class="lab-nav-btn active" onclick="lab_switchGuideStep(1);" style="background:linear-gradient(135deg,#0284C7,#059669);border-color:#10B981;">
                            <i class="fa-solid fa-trophy" style="color:#FDE68A;"></i> Parabéns! Você concluiu a Aula 7 (Rever desde o Nível 1 🔄)
                        </button>
                    </div>
                </div>
            </div>

            <!-- TOAST FLUTUANTE DE AVISO / BLOQUEIO -->
            <div id="lab_maker_toast">
                <span id="lab_toast_icon" style="font-size:1.4rem;">⚠️</span>
                <span id="lab_toast_msg">Aviso</span>
            </div>

            <!-- MODAL CELEBRATIVO DE MISSÃO -->
            <div id="lab_celebrate_modal" style="position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(15,23,42,0.88);backdrop-filter:blur(8px);display:none;justify-content:center;align-items:center;z-index:9999;padding:20px;">
                <div style="background:#1E293B;border:4px solid #10B981;border-radius:28px;padding:32px 26px;max-width:520px;width:100%;text-align:center;box-shadow:0 0 50px rgba(16,185,129,0.4);">
                    <div style="font-size:4rem;margin-bottom:8px;" id="lab_mod_icon">🎉</div>
                    <h2 class="lab-title-font" style="color:white;font-size:1.8rem;margin:0 0 10px;" id="lab_mod_title">Parabéns!</h2>
                    <p style="color:#CBD5E1;font-size:1.05rem;line-height:1.6;margin-bottom:20px;" id="lab_mod_desc">Descrição da conquista</p>
                    <button type="button" class="lab-btn-test" onclick="lab_closeCelebrateModal()" style="background:#10B981;color:white;padding:12px 30px;font-size:1.1rem;border-radius:30px;margin:0 auto;">
                        Continuar Montando! 🚀
                    </button>
                </div>
            </div>

        </div>
    `;

    lab_init();
    document.getElementById('labmaker-loaded')?.remove();
    const flag = document.createElement('div');
    flag.id = 'labmaker-loaded';
    flag.style.display = 'none';
    container.appendChild(flag);
}

/* ================= ESTADO GLOBAL DA AULA 7 ================= */
let lab_activeGuideStep = 1;
let lab_unlockedGuideStep = 1;
let lab_completedChallenges = {};
let lab_benchHasTestedPins = false;
let lab_benchHasInspected = false;
let lab_toastTimer = null;
let lab_usbPower = true;
let lab_pinsState = { 13: false, 12: false, 11: false };
let lab_autoTrafficInterval = null;
let lab_quizScore = 0;
let lab_showVisualLabels = true;
let lab_activeInspectId = 'led_red';
let lab_isTooltipPinned = false;

/* Componentes predefinidos do Semáforo */
const LAB_SEMAFORO_COMPONENTS = [
    // 1 Jumper GND preto
    { id: 'j_gnd', type: 'jumper', from: 'ard-gnd', to: 'bb-rail-bot-minus-2', color: '#0F172A', label: 'GND' },
    // 3 Jumpers de sinal dos pinos digitais 13, 12, 11
    { id: 'j_13', type: 'jumper', from: 'ard-13', to: 'hole-A-10', color: '#EF4444', label: 'D13' },
    { id: 'j_12', type: 'jumper', from: 'ard-12', to: 'hole-A-16', color: '#F59E0B', label: 'D12' },
    { id: 'j_11', type: 'jumper', from: 'ard-11', to: 'hole-A-22', color: '#10B981', label: 'D11' },

    // 3 LEDs
    { id: 'led_red', type: 'led', color: 'red', from: 'hole-C-10', to: 'hole-C-11', pin: 13, label: 'LED Vermelho' },
    { id: 'led_yel', type: 'led', color: 'yellow', from: 'hole-C-16', to: 'hole-C-17', pin: 12, label: 'LED Amarelo' },
    { id: 'led_gre', type: 'led', color: 'green', from: 'hole-C-22', to: 'hole-C-23', pin: 11, label: 'LED Verde' },

    // 3 Resistores de 300Ω (Laranja, Preto, Marrom)
    { id: 'res_red', type: 'resistor', val: 300, from: 'hole-D-11', to: 'bb-rail-bot-minus-11', label: '300Ω' },
    { id: 'res_yel', type: 'resistor', val: 300, from: 'hole-D-17', to: 'bb-rail-bot-minus-17', label: '300Ω' },
    { id: 'res_gre', type: 'resistor', val: 300, from: 'hole-D-23', to: 'bb-rail-bot-minus-23', label: '300Ω' }
];

/* Ficha Técnica & Metadados Educativos dos Componentes para Tooltips e Legendas Dinâmicas */
const LAB_COMPONENT_DETAILS = {
    'led_red': {
        name: 'LED Difuso Vermelho 5mm',
        category: 'Diodo Emissor de Luz (Semicondutor)',
        role: 'Indicar estado de PARADA OBRIGATÓRIA no semáforo com luz vermelha pura (~630nm).',
        polarity: 'POLARIZADO! Possui lado positivo e negativo obrigatórios. A perna mais LONGA é o Ânodo (+), que entra no furo C10 para receber os +5V do Pino 13. A perna mais CURTA chanfrada é o Cátodo (-), que entra no furo C11 para ir ao resistor e GND.',
        anodeHole: 'Furo C10 (Coluna 10)',
        cathodeHole: 'Furo C11 (Coluna 11)',
        voltage: 'Queda de Tensão Direta (Vf): ~1.9V a 2.0V',
        current: 'Corrente de Operação: ~15.3mA (com Resistor de 300Ω)',
        pinArduino: 'Pino Digital D13 do Arduino UNO',
        resistorPaired: 'Resistor R1 (300Ω) na coluna 11',
        tip: '💡 Dica Maker: Se o LED for colocado invertido (+ no Cátodo e - no Ânodo), ele NÃO acende porque o diodo bloqueia os elétrons no sentido reverso. Graças ao resistor, ele não queima!'
    },
    'led_yel': {
        name: 'LED Difuso Amarelo 5mm',
        category: 'Diodo Emissor de Luz (Semicondutor)',
        role: 'Indicar estado de ATENÇÃO no semáforo antes da troca de fase (~590nm).',
        polarity: 'POLARIZADO! Ânodo (+) = Perna Longa no furo C16 (recebe +5V do Pino 12). Cátodo (-) = Perna Curta chanfrada no furo C17 (saída de retorno para o resistor R2 e GND).',
        anodeHole: 'Furo C16 (Coluna 16)',
        cathodeHole: 'Furo C17 (Coluna 17)',
        voltage: 'Queda de Tensão Direta (Vf): ~2.0V a 2.1V',
        current: 'Corrente de Operação: ~15.3mA (com Resistor de 300Ω)',
        pinArduino: 'Pino Digital D12 do Arduino UNO',
        resistorPaired: 'Resistor R2 (300Ω) na coluna 17',
        tip: '💡 Dica Maker: Nunca conecte o LED diretamente aos 5V sem resistor! Sem resistência para conter os elétrons, a corrente dispararia para mais de 50mA e queimaria o filamento em milésimos de segundo.'
    },
    'led_gre': {
        name: 'LED Difuso Verde 5mm',
        category: 'Diodo Emissor de Luz (Semicondutor)',
        role: 'Indicar estado de SIGA EM FRENTE para os veículos no trânsito (~525nm).',
        polarity: 'POLARIZADO! Ânodo (+) = Perna Longa no furo C22 (recebe +5V do Pino 11). Cátodo (-) = Perna Curta chanfrada no furo C23 (saída para o resistor R3 e barramento GND).',
        anodeHole: 'Furo C22 (Coluna 22)',
        cathodeHole: 'Furo C23 (Coluna 23)',
        voltage: 'Queda de Tensão Direta (Vf): ~2.2V a 2.4V',
        current: 'Corrente de Operação: ~15.3mA (com Resistor de 300Ω)',
        pinArduino: 'Pino Digital D11 do Arduino UNO',
        resistorPaired: 'Resistor R3 (300Ω) na coluna 23',
        tip: '💡 Dica Maker: O LED só conduz corrente elétrica em sentido direto (do positivo para o negativo). Na protoboard, o chanfro plano na borda plástica identifica o Cátodo (-).'
    },
    'res_red': {
        name: 'Resistor Limitador R1 (300Ω - 1/4W)',
        category: 'Resistor de Película de Carbono',
        role: 'Frear e limitar a corrente de elétrons que sai do Cátodo do LED Vermelho antes de chegar ao GND, protegendo o LED e a porta do Arduino.',
        polarity: 'NÃO POSSUI POLARIDADE! O resistor é um elemento passivo simétrico: tanto faz qual perna entra no furo D11 e qual perna entra no barramento azul GND.',
        connection: 'Perna 1: Furo D11 (Coluna 11 do Cátodo) ➔ Perna 2: Barramento Azul (-) GND',
        colorCode: 'Laranja (3), Preto (0), Marrom (x10) = 300 Ω | Dourado (±5% de tolerância)',
        lawOhm: 'Lei de Ohm: Corrente I = (5V - 2.0V) / 300Ω = 10mA a 15mA (faixa ideal de brilho e vida útil)',
        tip: '💡 Dica Maker: Os resistores convertem a energia excedente em calor microscópico e imperceptível (Efeito Joule). Sem ele, o LED queima na hora!'
    },
    'res_yel': {
        name: 'Resistor Limitador R2 (300Ω - 1/4W)',
        category: 'Resistor de Película de Carbono',
        role: 'Garantir proteção contra sobrecorrente no canal do LED Amarelo conectado ao Pino D12.',
        polarity: 'NÃO POSSUI POLARIDADE! Pode ser ligado em qualquer orientação sem alterar a resistência de 300Ω.',
        connection: 'Perna 1: Furo D17 (Coluna 17 do Cátodo Amarelo) ➔ Perna 2: Barramento Azul (-) GND',
        colorCode: 'Laranja (3), Preto (0), Marrom (x10) = 300 Ω | Dourado (±5%)',
        lawOhm: 'Lei de Ohm: I = (5V - 2.1V) / 300Ω ≈ 15.3mA',
        tip: '💡 Dica Maker: Na aula prática você pode usar resistores de 220Ω, 300Ω ou 330Ω — todos funcionam perfeitamente e mantêm o LED seguro!'
    },
    'res_gre': {
        name: 'Resistor Limitador R3 (300Ω - 1/4W)',
        category: 'Resistor de Película de Carbono',
        role: 'Proteger o LED Verde e manter a corrente dentro do limite seguro da porta digital D11 do microcontrolador.',
        polarity: 'NÃO POSSUI POLARIDADE! Bidirecional.',
        connection: 'Perna 1: Furo D23 (Coluna 23 do Cátodo Verde) ➔ Perna 2: Barramento Azul (-) GND',
        colorCode: 'Laranja (3), Preto (0), Marrom (x10) = 300 Ω | Dourado (±5%)',
        lawOhm: 'Lei de Ohm: I = (5V - 2.2V) / 300Ω ≈ 15mA',
        tip: '💡 Dica Maker: Cada um dos 3 LEDs possui seu próprio resistor independente de 300Ω, garantindo que o brilho permaneça constante mesmo quando múltiplos LEDs acendem.'
    },
    'j_gnd': {
        name: 'Fio Jumper Macho-Macho GND (Preto)',
        category: 'Condutor Flexível de Cobre',
        role: 'Unificar a referência de 0 Volts (Terra / GND) entre o Arduino UNO e toda a linha de retorno da Protoboard.',
        polarity: 'TERRA / RETORNO NEGATIVO (0V). É o ponto de menor potencial elétrico do circuito.',
        connection: 'Origem: Pino GND da barra de alimentação do Arduino ➔ Destino: Barramento Azul (-) da Protoboard (furo 2).',
        tip: '💡 Dica Maker: Por convenção universal na robótica e engenharia, fios pretos ou azuis são sempre reservados para GND (0V) e vermelhos para VCC (+5V).'
    },
    'j_13': {
        name: 'Fio Jumper Digital D13 (Vermelho)',
        category: 'Condutor de Sinal Lógico',
        role: 'Transportar o pulso elétrico de controle (+5V) gerado pelo microcontrolador até a coluna 10 (Ânodo do LED Vermelho).',
        polarity: 'SINAL POSITIVO (+5V em nível HIGH / 0V em nível LOW).',
        connection: 'Origem: Pino Digital 13 do Arduino ➔ Destino: Furo A10 (Coluna 10) da Protoboard.',
        tip: '💡 Dica Maker: O pino 13 do Arduino também alimenta o LED onboard "L" soldado na placa. Quando seu código executa digitalWrite(13, HIGH), ambos acendem juntos!'
    },
    'j_12': {
        name: 'Fio Jumper Digital D12 (Amarelo)',
        category: 'Condutor de Sinal Lógico',
        role: 'Conduzir a tensão digital (+5V) até a coluna 16 para acender o LED Amarelo.',
        polarity: 'SINAL POSITIVO (+5V quando acionado por digitalWrite(12, HIGH)).',
        connection: 'Origem: Pino Digital 12 do Arduino ➔ Destino: Furo A16 (Coluna 16) da Protoboard.',
        tip: '💡 Dica Maker: As portas digitais do ATmega328P conseguem ligar e desligar em menos de 1 microssegundo.'
    },
    'j_11': {
        name: 'Fio Jumper Digital D11 (Verde)',
        category: 'Condutor de Sinal Lógico',
        role: 'Conduzir a tensão digital (+5V) até a coluna 22 para acender o LED Verde.',
        polarity: 'SINAL POSITIVO (+5V quando acionado por digitalWrite(11, HIGH)).',
        connection: 'Origem: Pino Digital 11 do Arduino ➔ Destino: Furo A22 (Coluna 22) da Protoboard.',
        tip: '💡 Dica Maker: O pino 11 possui um til (~) no Arduino, indicando suporte a PWM. Você pode usar analogWrite(11, valor) para controlar a intensidade do brilho!'
    },
    'bb_protoboard': {
        name: 'Protoboard de 30 Pinos (Matriz de Contatos)',
        category: 'Placa de Prototipagem Sem Solda',
        role: 'Conectar circuitos de forma rápida e segura sem precisar soldar nada, utilizando presilhas de bronze elásticas.',
        polarity: 'ORGANIZAÇÃO INTERNA: Barramentos de alimentação contínuos nas laterais e colunas de 5 furos (A-E e F-J) interligadas por lâminas verticais.',
        connection: 'Cada grupo de 5 furos da mesma coluna (ex: 10A, 10B, 10C, 10D, 10E) forma um único nó condutor elétrico.',
        tip: '💡 Dica Maker: A calha central divisória de plástico isola a metade superior (A-E) da inferior (F-J). Ela tem o tamanho exato para encaixar circuitos integrados (chips) sem que as pernas entrem em curto!'
    },
    'bb_gnd_rail': {
        name: 'Barramento Azul (-) GND da Protoboard',
        category: 'Trilha de Alimentação Contínua',
        role: 'Distribuir o potencial de 0 Volts (Terra) horizontalmente ao longo de toda a extensão da placa.',
        polarity: 'POTENCIAL NEGATIVO DE REFERÊNCIA (0V).',
        connection: 'Recebe o cabo preto do GND do Arduino e serve de ponto de retorno comum para as saídas dos 3 resistores de 300Ω.',
        tip: '💡 Dica Maker: Todos os 30 furos da linha azul estão unidos por baixo por uma única fita condutora de bronze contínua.'
    }
};

/* ==========================================================================
   CARROSSEL INTERATIVO DA GALERIA VISUAL DA AULA 7
   ========================================================================== */
let lab_carousel_index = 0;
const LAB_CAROUSEL_TOTAL = 7;

function lab_carousel_goto(index, playSnd = true) {
    if (index < 0) index = 0;
    if (index >= LAB_CAROUSEL_TOTAL) index = LAB_CAROUSEL_TOTAL - 1;
    lab_carousel_index = index;

    const track = document.getElementById('vg_carousel_track');
    if (track) {
        track.style.transform = `translateX(-${lab_carousel_index * 100}%)`;
    }

    // Atualiza botões das abas superiores
    const tabs = document.querySelectorAll('.vg-carousel-tab-btn');
    tabs.forEach((btn, i) => {
        if (i === lab_carousel_index) {
            btn.classList.add('active');
            try {
                btn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
            } catch(e) {}
        } else {
            btn.classList.remove('active');
        }
    });

    // Atualiza dots indicadores
    const dots = document.querySelectorAll('.vg-carousel-dot');
    dots.forEach((dot, i) => {
        if (i === lab_carousel_index) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });

    // Atualiza contador de cards
    const counter = document.getElementById('vg_carousel_counter');
    if (counter) {
        counter.innerHTML = `<i class="fa-solid fa-layer-group"></i> <span>Card ${lab_carousel_index + 1} de ${LAB_CAROUSEL_TOTAL}</span>`;
    }

    // Atualiza estado dos botões Anterior e Próximo
    const prevBtn = document.getElementById('vg_carousel_prev');
    const nextBtn = document.getElementById('vg_carousel_next');
    if (prevBtn) {
        prevBtn.disabled = (lab_carousel_index === 0);
    }
    if (nextBtn) {
        nextBtn.disabled = (lab_carousel_index === LAB_CAROUSEL_TOTAL - 1);
    }

    if (playSnd && typeof playSound === 'function') {
        playSound('click');
    }
}

function lab_carousel_prev() {
    if (lab_carousel_index > 0) {
        lab_carousel_goto(lab_carousel_index - 1, true);
    }
}

function lab_carousel_next() {
    if (lab_carousel_index < LAB_CAROUSEL_TOTAL - 1) {
        lab_carousel_goto(lab_carousel_index + 1, true);
    }
}

/* Inicialização */
function lab_init() {
    lab_build30Breadboard();
    lab_carousel_goto(0, false);
    lab_vguide_init();
    lab_updateBadges();
    lab_renderCircuit();
    lab_renderInspectorPanel();
    lab_initStepLocking();
}

/* Construção da Protoboard Real de 30 Colunas */
function lab_build30Breadboard() {
    const cols = 30;

    // Cabeçalhos com números 1 a 30
    ['bb_cols_header_top', 'bb_cols_header_bottom'].forEach(id => {
        const el = document.getElementById(id);
        if(!el) return;
        el.innerHTML = '';
        for(let c=1; c<=cols; c++) {
            const numDiv = document.createElement('div');
            numDiv.className = 'bb-col-tag';
            numDiv.innerText = c;
            el.appendChild(numDiv);
        }
    });

    // Barramento Superior (+ e -)
    const topPlus = document.getElementById('bb_rail_top_plus');
    const topMinus = document.getElementById('bb_rail_top_minus');
    if(topPlus) {
        topPlus.innerHTML = '';
        for(let c=1; c<=cols; c++) {
            const h = document.createElement('div');
            h.className = 'bb-pin-hole';
            h.id = `bb-rail-top-plus-${c}`;
            h.dataset.net = 'PWR_5V';
            h.onclick = () => lab_onHoleClick(h);
            topPlus.appendChild(h);
        }
    }
    if(topMinus) {
        topMinus.innerHTML = '';
        for(let c=1; c<=cols; c++) {
            const h = document.createElement('div');
            h.className = 'bb-pin-hole';
            h.id = `bb-rail-top-minus-${c}`;
            h.dataset.net = 'PWR_GND';
            h.onclick = () => lab_onHoleClick(h);
            topMinus.appendChild(h);
        }
    }

    // Barramento Inferior (+ e -)
    const botPlus = document.getElementById('bb_rail_bot_plus');
    const botMinus = document.getElementById('bb_rail_bot_minus');
    if(botPlus) {
        botPlus.innerHTML = '';
        for(let c=1; c<=cols; c++) {
            const h = document.createElement('div');
            h.className = 'bb-pin-hole';
            h.id = `bb-rail-bot-plus-${c}`;
            h.dataset.net = 'PWR_5V';
            h.onclick = () => lab_onHoleClick(h);
            botPlus.appendChild(h);
        }
    }
    if(botMinus) {
        botMinus.innerHTML = '';
        for(let c=1; c<=cols; c++) {
            const h = document.createElement('div');
            h.className = 'bb-pin-hole';
            h.id = `bb-rail-bot-minus-${c}`;
            h.dataset.net = 'PWR_GND';
            h.onclick = () => lab_onHoleClick(h);
            botMinus.appendChild(h);
        }
    }

    // Matriz Superior A-B-C-D-E
    const matrixTop = document.getElementById('bb_matrix_top');
    if(matrixTop) {
        matrixTop.innerHTML = '';
        ['A','B','C','D','E'].forEach(row => {
            const rowDiv = document.createElement('div');
            rowDiv.className = 'bb-matrix-row';
            for(let c=1; c<=cols; c++) {
                const h = document.createElement('div');
                h.className = 'bb-pin-hole';
                h.id = `hole-${row}-${c}`;
                h.dataset.net = `COL_TOP_${c}`;
                h.dataset.label = `${row}${c}`;
                h.title = `Furo ${row}${c} (Coluna ${c})`;
                h.onclick = () => lab_onHoleClick(h);
                h.onmouseenter = () => lab_highlightNet(h.dataset.net);
                h.onmouseleave = () => lab_clearHighlightNet();
                rowDiv.appendChild(h);
            }
            matrixTop.appendChild(rowDiv);
        });
    }

    // Matriz Inferior F-G-H-I-J
    const matrixBot = document.getElementById('bb_matrix_bottom');
    if(matrixBot) {
        matrixBot.innerHTML = '';
        ['F','G','H','I','J'].forEach(row => {
            const rowDiv = document.createElement('div');
            rowDiv.className = 'bb-matrix-row';
            for(let c=1; c<=cols; c++) {
                const h = document.createElement('div');
                h.className = 'bb-pin-hole';
                h.id = `hole-${row}-${c}`;
                h.dataset.net = `COL_BOT_${c}`;
                h.dataset.label = `${row}${c}`;
                h.title = `Furo ${row}${c} (Coluna ${c})`;
                h.onclick = () => lab_onHoleClick(h);
                h.onmouseenter = () => lab_highlightNet(h.dataset.net);
                h.onmouseleave = () => lab_clearHighlightNet();
                rowDiv.appendChild(h);
            }
            matrixBot.appendChild(rowDiv);
        });
    }
}

/* Interação com furos para iluminação didática */
function lab_highlightNet(net) {
    if(!net) return;
    document.querySelectorAll(`.bb-pin-hole[data-net="${net}"]`).forEach(h => h.classList.add('glow-net'));
}

function lab_clearHighlightNet() {
    document.querySelectorAll('.bb-pin-hole.glow-net').forEach(h => h.classList.remove('glow-net'));
}

function lab_onHoleClick(hole) {
    playSound('click');
    const label = hole.dataset.label || hole.id;
    hole.style.transform = 'scale(1.5)';
    setTimeout(() => { hole.style.transform = ''; }, 200);
}

/* Toast flutuante de avisos e feedback Maker */
function lab_showToast(msg, icon = '⚠️') {
    const toast = document.getElementById('lab_maker_toast');
    if (!toast) return;
    const iconEl = document.getElementById('lab_toast_icon');
    const msgEl = document.getElementById('lab_toast_msg');
    if (iconEl) iconEl.innerText = icon;
    if (msgEl) msgEl.innerText = msg;
    toast.style.display = 'flex';
    if (lab_toastTimer) clearTimeout(lab_toastTimer);
    lab_toastTimer = setTimeout(() => {
        toast.style.display = 'none';
    }, 3800);
}

/* Inicializa o sistema de bloqueio progressivo e desafios da Aula 7 */
function lab_initStepLocking() {
    try {
        const savedChallenges = JSON.parse(localStorage.getItem('lab_challenges_done') || '{}');
        lab_completedChallenges = savedChallenges || {};
    } catch(e) {
        lab_completedChallenges = {};
    }

    // Higieniza: garante que só há progressão se TODOS os anteriores foram completados
    const cleanChallenges = {};
    let maxUnlocked = 1;
    for (let lvl = 1; lvl <= 5; lvl++) {
        if (lab_completedChallenges[lvl] === true) {
            cleanChallenges[lvl] = true;
            maxUnlocked = lvl + 1;
        } else {
            break; // Bloqueia no primeiro desafio ainda não respondido!
        }
    }
    lab_completedChallenges = cleanChallenges;
    try {
        localStorage.setItem('lab_challenges_done', JSON.stringify(lab_completedChallenges));
    } catch(e) {}
    lab_unlockedGuideStep = maxUnlocked;

    lab_updateStepBarLockUI();

    // Atualiza estado visual de cada caixa de desafio e botão de avanço
    for (let lvl = 1; lvl <= 5; lvl++) {
        const box = document.getElementById('lab_challenge_box_' + lvl);
        const status = document.getElementById('lab_challenge_status_' + lvl);
        const nextBtn = document.getElementById('lab_next_btn_' + lvl);
        const fb = document.getElementById('lab_step_fb_' + lvl);

        if (lab_completedChallenges[lvl]) {
            if (box) box.classList.add('completed');
            if (status) {
                status.classList.add('unlocked');
                status.innerHTML = '<i class="fa-solid fa-circle-check" style="color:#10B981;"></i> Desafio Concluído!';
            }
            if (nextBtn) {
                nextBtn.classList.remove('locked');
                nextBtn.innerHTML = `Avançar para o Nível ${lvl + 1} <i class="fa-solid fa-arrow-right"></i>`;
                nextBtn.style.background = 'linear-gradient(135deg, #0284C7, #10B981)';
                nextBtn.style.color = '#FFFFFF';
                nextBtn.style.cursor = 'pointer';
                nextBtn.style.boxShadow = '0 0 16px rgba(16,185,129,0.4)';
            }
            if (fb && lvl <= 4) {
                fb.style.display = 'block';
                fb.style.background = 'rgba(16,185,129,0.18)';
                fb.style.color = '#A7F3D0';
                fb.innerHTML = '✅ Desafio concluído com sucesso! Conhecimento consolidado.';
            }
        } else {
            if (box) box.classList.remove('completed');
            if (status) {
                status.classList.remove('unlocked');
                status.innerHTML = '<i class="fa-solid fa-lock"></i> Desafio Obrigatório';
            }
            if (nextBtn) {
                nextBtn.classList.add('locked');
                nextBtn.innerHTML = `<i class="fa-solid fa-lock"></i> Conclua o Desafio Acima para Avançar ao Nível ${lvl + 1}`;
                nextBtn.style.background = '#334155';
                nextBtn.style.color = '#94A3B8';
                nextBtn.style.cursor = 'not-allowed';
                nextBtn.style.boxShadow = 'none';
            }
            if (fb) fb.style.display = 'none';
        }
    }
}

/* Atualiza os ícones e classes da barra de níveis (cadeados vs checks) */
function lab_updateStepBarLockUI() {
    for (let s = 1; s <= 6; s++) {
        const btn = document.getElementById('lab_step_btn_' + s);
        if (!btn) continue;

        const circle = btn.querySelector('.lab-step-circle');
        // Para acessar o nível 's', TODOS os níveis anteriores (1 a s-1) DEVEM estar concluídos
        let canAccess = true;
        for (let p = 1; p < s; p++) {
            if (!lab_completedChallenges[p]) {
                canAccess = false;
                break;
            }
        }
        const isLocked = !canAccess;
        const isCompleted = (lab_completedChallenges[s] === true);

        btn.classList.toggle('locked', isLocked);
        btn.classList.toggle('completed', isCompleted && !isLocked);

        if (isLocked) {
            btn.title = `Nível ${s} (Bloqueado — Complete os níveis anteriores primeiro)`;
            btn.style.cursor = 'not-allowed';
            btn.style.opacity = '0.55';
            if (circle) circle.innerHTML = '<i class="fa-solid fa-lock" style="font-size:0.75rem;"></i>';
        } else if (isCompleted) {
            btn.title = `Nível ${s} (Concluído)`;
            btn.style.cursor = 'pointer';
            btn.style.opacity = '1';
            if (circle) circle.innerHTML = '<i class="fa-solid fa-check" style="font-size:0.8rem;"></i>';
        } else {
            btn.title = `Nível ${s}`;
            btn.style.cursor = 'pointer';
            btn.style.opacity = '1';
            if (circle) circle.innerText = s;
        }
    }
}

/* Navegação Contínua nos 6 Níveis da Trilha (Com Bloqueio Estrito Sequencial) */
function lab_switchGuideStep(step) {
    step = parseInt(step, 10);
    if (isNaN(step) || step < 1) step = 1;
    if (step > 6) step = 6;

    // REGRA DE OURO: NÃO DEIXA AVANÇAR SEM PASSAR PELO NÍVEL ANTERIOR!
    for (let prev = 1; prev < step; prev++) {
        if (!lab_completedChallenges[prev]) {
            playSound('error');
            lab_showToast(`🔒 Nível ${step} bloqueado! Você precisa concluir o Desafio do Nível ${prev} primeiro!`, '🔒');
            
            // Redireciona e foca imediatamente no nível pendente
            lab_activeGuideStep = prev;
            for (let s = 1; s <= 6; s++) {
                const card = document.getElementById('lab_guide_step_' + s);
                const btn = document.getElementById('lab_step_btn_' + s);
                if (card) card.style.display = (s === prev) ? 'block' : 'none';
                if (btn) btn.classList.toggle('active', s === prev);
            }
            lab_updateStepBarLockUI();

            const pendingBox = document.getElementById('lab_challenge_box_' + prev);
            if (pendingBox) {
                pendingBox.classList.remove('pulse-focus');
                void pendingBox.offsetWidth;
                pendingBox.classList.add('pulse-focus');
                pendingBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            return;
        }
    }

    playSound('step');
    lab_activeGuideStep = step;

    // Atualiza barra de progresso contínua
    const pct = Math.round((step / 6) * 100);
    const fill = document.getElementById('lab_global_progress_fill');
    const txt = document.getElementById('lab_progress_text');
    if (fill) fill.style.width = `${pct}%`;
    if (txt) txt.innerText = `Nível ${step} de 6 (${pct}% Concluído)`;

    for (let s = 1; s <= 6; s++) {
        const card = document.getElementById('lab_guide_step_' + s);
        const btn = document.getElementById('lab_step_btn_' + s);
        if (card) card.style.display = (s === step) ? 'block' : 'none';
        if (btn) btn.classList.toggle('active', s === step);
    }
    lab_updateStepBarLockUI();

    if (step === 1) {
        setTimeout(lab_vguide_init, 40);
    } else if (step === 5) {
        setTimeout(() => {
            lab_renderCircuit();
            lab_renderInspectorPanel();
        }, 60);
    } else if (step === 6) {
        setTimeout(() => {
            if (typeof triggerConfetti === 'function') triggerConfetti(3500);
            if (typeof lab_initMiniGame === 'function') lab_initMiniGame();
        }, 80);
    }

    // Rolagem suave para o topo do laboratório
    document.querySelector('.lab-wrap')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/* Desbloqueia um novo nível na trilha */
function lab_unlockStep(targetLevel) {
    if (targetLevel > lab_unlockedGuideStep) {
        lab_unlockedGuideStep = targetLevel;
        try {
            localStorage.setItem('lab_unlocked_step', lab_unlockedGuideStep);
        } catch(e) {}
    }
    lab_updateStepBarLockUI();
}

/* Avanço guiado pelo botão inferior com bloqueio estrito se o desafio não foi feito */
function lab_advanceNextStep(fromStep) {
    fromStep = parseInt(fromStep, 10);
    // Validação estrita: todos os níveis de 1 até fromStep devem estar concluídos
    for (let c = 1; c <= fromStep; c++) {
        if (!lab_completedChallenges[c]) {
            playSound('error');
            lab_showToast(`🔒 Responda e acerte o Desafio do Nível ${c} antes de avançar!`, '🔒');
            const box = document.getElementById('lab_challenge_box_' + c);
            if (box) {
                box.scrollIntoView({ behavior: 'smooth', block: 'center' });
                box.classList.remove('pulse-focus');
                void box.offsetWidth;
                box.classList.add('pulse-focus');
            }
            return;
        }
    }
    lab_switchGuideStep(fromStep + 1);
}

/* Reiniciar progresso dos níveis da Aula 7 para testar do zero */
function lab_resetLevelProgress() {
    if (confirm('Deseja reiniciar todos os 6 níveis da Aula 7 para fazer os desafios desde o Nível 1?')) {
        lab_completedChallenges = {};
        lab_unlockedGuideStep = 1;
        try {
            localStorage.removeItem('lab_challenges_done');
            localStorage.removeItem('lab_unlocked_step');
            localStorage.removeItem('labmaker_levels');
            localStorage.removeItem('lab_minigame_won');
        } catch(e) {}
        lab_initStepLocking();
        lab_switchGuideStep(1);
        playSound('click');
        lab_showToast('Progresso da Aula 7 reiniciado! Começando do Nível 1.', '🔄');
    }
}

/* Resposta a um Desafio Maker de Nível */
function lab_answerStepChallenge(level, optionIndex, isCorrect) {
    const card = document.getElementById('lab_challenge_box_' + level);
    const fb = document.getElementById('lab_step_fb_' + level);
    const nextBtn = document.getElementById('lab_next_btn_' + level);
    const status = document.getElementById('lab_challenge_status_' + level);

    if (!card) return;

    const optButtons = card.querySelectorAll('.lab-quiz-opt');

    if (!isCorrect) {
        playSound('error');
        optButtons.forEach((btn, idx) => {
            if (idx + 1 === optionIndex) {
                btn.classList.add('wrong');
                setTimeout(() => btn.classList.remove('wrong'), 1500);
            }
        });

        if (fb) {
            fb.style.display = 'block';
            fb.style.background = 'rgba(239,68,68,0.2)';
            fb.style.color = '#FCA5A5';
            let hint = '❌ Ops! Essa não é a resposta certa. Dê mais uma olhadinha na explicação acima e tente novamente!';
            if (level === 1) hint = '❌ Lembre-se: por baixo do plástico branco existem lâminas douradas inteiriças unindo os 5 furos da mesma coluna!';
            else if (level === 2) hint = '❌ Cuidado com a pegadinha! O resistor NÃO tem perna positiva nem negativa, tanto faz o lado!';
            else if (level === 3) hint = '❌ Lembre-se: o LED tem perna LONGA (Ânodo +) para o positivo e perna CURTA (Cátodo -) para o resistor!';
            else if (level === 4) hint = '❌ Precisamos controlar cada cor do semáforo individualmente e de forma independente no código C++!';
            fb.innerHTML = hint;
        }
        return;
    }

    // Resposta Correta!
    playSound('success');
    if (typeof triggerConfetti === 'function') triggerConfetti(2800);

    optButtons.forEach((btn, idx) => {
        btn.disabled = true;
        if (idx + 1 === optionIndex) {
            btn.classList.add('correct');
        } else {
            btn.style.opacity = '0.5';
        }
    });

    if (fb) {
        fb.style.display = 'block';
        fb.style.background = 'rgba(16,185,129,0.2)';
        fb.style.color = '#A7F3D0';
        fb.innerHTML = `🎉 <b>EXCELENTE, MAKER!</b> Resposta exata! Você consolidou esse conhecimento e liberou o Nível ${level + 1}! 🚀`;
    }

    if (status) {
        status.classList.add('unlocked');
        status.innerHTML = '<i class="fa-solid fa-circle-check" style="color:#10B981;"></i> Desafio Concluído!';
    }
    card.classList.add('completed');

    lab_completedChallenges[level] = true;
    try {
        localStorage.setItem('lab_challenges_done', JSON.stringify(lab_completedChallenges));
    } catch(e) {}

    lab_unlockStep(level + 1);

    if (nextBtn) {
        nextBtn.classList.remove('locked');
        nextBtn.innerHTML = `Avançar para o Nível ${level + 1} 🚀`;
        nextBtn.style.background = 'linear-gradient(135deg, #0284C7, #10B981)';
        nextBtn.style.color = '#FFFFFF';
        nextBtn.style.cursor = 'pointer';
        nextBtn.style.boxShadow = '0 0 20px rgba(16,185,129,0.5)';
    }

    lab_showToast(`🌟 Nível ${level + 1} Desbloqueado! Clique no botão abaixo para prosseguir.`, '🎉');
}

/* Validação dos Testes da Bancada Virtual (Nível 5) */
function lab_validateBenchChallenge() {
    const chkUsb = document.getElementById('bench_chk_usb');
    const chkPins = document.getElementById('bench_chk_pins');
    const chkInsp = document.getElementById('bench_chk_insp');
    const iconUsb = document.getElementById('icon_chk_usb');
    const iconPins = document.getElementById('icon_chk_pins');
    const iconInsp = document.getElementById('icon_chk_insp');
    const fb = document.getElementById('lab_step_fb_5');

    // Atualiza estados visuais
    if (lab_usbPower) {
        if (chkUsb) chkUsb.style.borderColor = '#10B981';
        if (iconUsb) iconUsb.innerText = '✅';
    }
    if (lab_benchHasTestedPins || lab_pinsState[13] || lab_pinsState[12] || lab_pinsState[11] || lab_autoTrafficInterval) {
        lab_benchHasTestedPins = true;
        if (chkPins) chkPins.style.borderColor = '#10B981';
        if (iconPins) iconPins.innerText = '✅';
    }
    if (lab_benchHasInspected) {
        if (chkInsp) chkInsp.style.borderColor = '#10B981';
        if (iconInsp) iconInsp.innerText = '✅';
    }

    if (!lab_usbPower) {
        playSound('error');
        if (fb) {
            fb.style.display = 'block';
            fb.style.background = 'rgba(239,68,68,0.2)';
            fb.style.color = '#FCA5A5';
            fb.innerHTML = '⚠️ <b>Passo 1 Pendente:</b> Ligue o cabo USB (5V) clicando no botão "Ligar Cabo USB" ou na porta USB da placa!';
        }
        lab_showToast('Ligue o cabo USB (5V) para energizar o Arduino!', '🔌');
        return;
    }

    if (!lab_benchHasTestedPins) {
        playSound('error');
        if (fb) {
            fb.style.display = 'block';
            fb.style.background = 'rgba(239,68,68,0.2)';
            fb.style.color = '#FCA5A5';
            fb.innerHTML = '⚠️ <b>Passo 2 Pendente:</b> Teste acender pelo menos um dos LEDs (clique nos botões dos pinos 13, 12, 11 ou no Semáforo Automático)!';
        }
        lab_showToast('Acione um dos pinos digitais ou o modo automático!', '💡');
        return;
    }

    if (!lab_benchHasInspected) {
        playSound('error');
        if (fb) {
            fb.style.display = 'block';
            fb.style.background = 'rgba(239,68,68,0.2)';
            fb.style.color = '#FCA5A5';
            fb.innerHTML = '⚠️ <b>Passo 3 Pendente:</b> Passe o mouse ou clique em qualquer peça da bancada (LED, Resistor, Protoboard ou Pino) para verificar a Ficha Técnica!';
        }
        lab_showToast('Inspecione uma peça na bancada para ver os detalhes!', '🔍');
        return;
    }

    // Todos os 3 passos práticos concluídos!
    playSound('success');
    if (typeof triggerConfetti === 'function') triggerConfetti(3500);

    const box = document.getElementById('lab_challenge_box_5');
    const status = document.getElementById('lab_challenge_status_5');
    const nextBtn = document.getElementById('lab_next_btn_5');
    const valBtn = document.getElementById('btn_validate_bench');

    if (box) box.classList.add('completed');
    if (status) {
        status.classList.add('unlocked');
        status.innerHTML = '<i class="fa-solid fa-circle-check" style="color:#10B981;"></i> Testes Validados!';
    }
    if (valBtn) {
        valBtn.style.background = '#10B981';
        valBtn.innerHTML = '<i class="fa-solid fa-circle-check"></i> Testes de Bancada Concluídos 100%! ⭐';
        valBtn.disabled = true;
    }
    if (fb) {
        fb.style.display = 'block';
        fb.style.background = 'rgba(16,185,129,0.2)';
        fb.style.color = '#A7F3D0';
        fb.innerHTML = '🎉 <b>PARABÉNS! TESTES DE BANCADA VALIDADOS COM SUCESSO!</b> O circuito físico está totalmente compreendido e operacional. O Nível 6 (Formatura Maker) está desbloqueado!';
    }

    lab_completedChallenges[5] = true;
    try {
        localStorage.setItem('lab_challenges_done', JSON.stringify(lab_completedChallenges));
    } catch(e) {}

    lab_unlockStep(6);

    if (nextBtn) {
        nextBtn.classList.remove('locked');
        nextBtn.innerHTML = `Avançar para o Mini-Game & Conclusão (Nível 6) 🎮 🚀`;
        nextBtn.style.background = 'linear-gradient(135deg, #0284C7, #10B981)';
        nextBtn.style.color = '#FFFFFF';
        nextBtn.style.cursor = 'pointer';
        nextBtn.style.boxShadow = '0 0 24px rgba(56,189,248,0.5)';
    }

    lab_showToast('🎮 Nível 6 Desbloqueado! Jogue o Mini-Game Maker!', '🎉');
}

/* Roteador de compatibilidade para chamadas legadas */
function lab_switchTab(tab) {
    if(tab === 'visual') lab_switchGuideStep(1);
    else if(tab === 'board') lab_switchGuideStep(5);
    else if(tab === 'quiz') lab_switchGuideStep(6);
    else lab_switchGuideStep(1);
}

/* Confirmação de Passo Físico */
function lab_confirmStep(step) {
    playSound('success');
    const btn = document.getElementById('lab_step_btn_' + step);
    if(btn) btn.classList.add('completed');
}

/* Checklist da Bancada Real */
function lab_checkListChanged() {
    const c1 = document.getElementById('chk_1')?.checked;
    const c2 = document.getElementById('chk_2')?.checked;
    const c3 = document.getElementById('chk_3')?.checked;
    const c4 = document.getElementById('chk_4')?.checked;

    if(c1 && c2 && c3 && c4) {
        playSound('success');
        if(typeof triggerConfetti === 'function') triggerConfetti(2500);
    }
}

/* Ligar / Desligar USB */
function lab_toggleUsbPower() {
    playSound('click');
    lab_usbPower = !lab_usbPower;

    const pwrBtn = document.getElementById('lab_pwr_toggle_btn');
    const pwrTxt = document.getElementById('lab_pwr_status_txt');
    const hdrTxt = document.getElementById('lab_usb_btn_txt');
    const vMeter = document.getElementById('lab_meter_volt');
    const onLed = document.getElementById('ard_led_on');

    if(lab_usbPower) {
        if(pwrBtn) pwrBtn.style.background = '#10B981';
        if(pwrTxt) pwrTxt.innerText = 'LIGADA (5V)';
        if(hdrTxt) hdrTxt.innerText = 'Desligar USB';
        if(vMeter) { vMeter.innerText = '5.00 V'; vMeter.style.color = '#10B981'; }
        if(onLed) onLed.classList.add('active');

        // Atualiza mini checklist do nível 5
        const chkUsb = document.getElementById('bench_chk_usb');
        const iconUsb = document.getElementById('icon_chk_usb');
        if (chkUsb) chkUsb.style.borderColor = '#10B981';
        if (iconUsb) iconUsb.innerText = '✅';
    } else {
        if(pwrBtn) pwrBtn.style.background = '#EF4444';
        if(pwrTxt) pwrTxt.innerText = 'DESLIGADA';
        if(hdrTxt) hdrTxt.innerText = 'Ligar Cabo USB';
        if(vMeter) { vMeter.innerText = '0.00 V'; vMeter.style.color = '#EF4444'; }
        if(onLed) onLed.classList.remove('active');
        lab_pinsState[13] = false;
        lab_pinsState[12] = false;
        lab_pinsState[11] = false;
        if(lab_autoTrafficInterval) { clearInterval(lab_autoTrafficInterval); lab_autoTrafficInterval = null; }
    }

    lab_updatePinsUI();
    lab_renderCircuit();
}

/* Controle individual dos pinos digitais 13, 12, 11 */
function lab_togglePin(pin) {
    if(!lab_usbPower) {
        playSound('error');
        lab_showToast('O Arduino está desligado! Ligue o cabo USB primeiro.', '🔌');
        return;
    }
    playSound('click');
    lab_pinsState[pin] = !lab_pinsState[pin];

    lab_benchHasTestedPins = true;
    const chkPins = document.getElementById('bench_chk_pins');
    const iconPins = document.getElementById('icon_chk_pins');
    if (chkPins) chkPins.style.borderColor = '#10B981';
    if (iconPins) iconPins.innerText = '✅';

    lab_updatePinsUI();
    lab_renderCircuit();
}

function lab_updatePinsUI() {
    [13, 12, 11].forEach(p => {
        const txt = document.getElementById('txt_pin' + p);
        const btn = document.getElementById('btn_test_pin' + p);
        const isLit = lab_pinsState[p] && lab_usbPower;
        if(txt) txt.innerText = isLit ? 'LIGADO (HIGH)' : 'OFF (LOW)';
        if(btn) btn.style.opacity = isLit ? '1' : '0.7';
    });

    const lLed = document.getElementById('ard_led_l');
    if(lLed) {
        if(lab_pinsState[13] && lab_usbPower) lLed.classList.add('active');
        else lLed.classList.remove('active');
    }

    const litCount = (lab_pinsState[13]?1:0) + (lab_pinsState[12]?1:0) + (lab_pinsState[11]?1:0);
    const iMeter = document.getElementById('lab_meter_curr');
    if(iMeter) {
        const ma = lab_usbPower ? (litCount * 15.3).toFixed(1) : '0.0';
        iMeter.innerText = `${ma} mA`;
    }
}

/* Modo Semáforo Automático */
function lab_runTrafficSequence() {
    if(!lab_usbPower) lab_toggleUsbPower();
    if(lab_autoTrafficInterval) {
        clearInterval(lab_autoTrafficInterval);
        lab_autoTrafficInterval = null;
    }

    playSound('success');
    lab_benchHasTestedPins = true;
    const chkPins = document.getElementById('bench_chk_pins');
    const iconPins = document.getElementById('icon_chk_pins');
    if (chkPins) chkPins.style.borderColor = '#10B981';
    if (iconPins) iconPins.innerText = '✅';

    let phase = 0; // 0: Verde, 1: Amarelo, 2: Vermelho

    function step() {
        if(!lab_usbPower) { clearInterval(lab_autoTrafficInterval); return; }
        if(phase === 0) {
            lab_pinsState[11] = true;  // Verde LIGADO
            lab_pinsState[12] = false;
            lab_pinsState[13] = false;
            phase = 1;
        } else if(phase === 1) {
            lab_pinsState[11] = false;
            lab_pinsState[12] = true;  // Amarelo LIGADO
            lab_pinsState[13] = false;
            phase = 2;
        } else {
            lab_pinsState[11] = false;
            lab_pinsState[12] = false;
            lab_pinsState[13] = true;  // Vermelho LIGADO
            phase = 0;
        }
        lab_updatePinsUI();
        lab_renderCircuit();
    }

    step();
    lab_autoTrafficInterval = setInterval(step, 1400);
}

function lab_demoTestTraffic() {
    lab_runTrafficSequence();
}

function lab_resetSemafaroCircuit() {
    playSound('click');
    if(lab_autoTrafficInterval) { clearInterval(lab_autoTrafficInterval); lab_autoTrafficInterval = null; }
    lab_pinsState[13] = false;
    lab_pinsState[12] = false;
    lab_pinsState[11] = false;
    lab_updatePinsUI();
    lab_renderCircuit();
}

/* Renderização SVG dos Jumpers, Resistores e LEDs na Protoboard de 30 Pinos com Etiquetas Visuais */
function lab_renderCircuit() {
    const svg = document.getElementById('bb_svg_canvas');
    const board = document.getElementById('bb_element_root');
    const ard = document.getElementById('ard_uno_element');
    if(!svg || !board) return;

    svg.innerHTML = '';
    const bRect = board.getBoundingClientRect();
    const aRect = ard ? ard.getBoundingClientRect() : null;

    LAB_SEMAFORO_COMPONENTS.forEach(comp => {
        if(comp.type === 'jumper') {
            let x1 = 0, y1 = 0, x2 = 0, y2 = 0;

            if(comp.from.startsWith('ard-')) {
                const pinName = comp.from.replace('ard-', '');
                const pinEl = document.getElementById('ard_pin_' + pinName);
                if(pinEl && aRect) {
                    const pr = pinEl.getBoundingClientRect();
                    x1 = pr.left + pr.width/2 - bRect.left;
                    y1 = pr.top + pr.height/2 - bRect.top;
                } else {
                    x1 = -40;
                    y1 = 120;
                }
            } else {
                const el1 = document.getElementById(comp.from);
                if(el1) {
                    const r1 = el1.getBoundingClientRect();
                    x1 = r1.left + r1.width/2 - bRect.left;
                    y1 = r1.top + r1.height/2 - bRect.top;
                }
            }

            const el2 = document.getElementById(comp.to);
            if(el2) {
                const r2 = el2.getBoundingClientRect();
                x2 = r2.left + r2.width/2 - bRect.left;
                y2 = r2.top + r2.height/2 - bRect.top;
            }

            if(x1 === 0 && y1 === 0) return;

            const dx = x2 - x1;
            const dy = y2 - y1;
            const cx = (x1 + x2)/2 + (dy * 0.15);
            const cy = Math.min(y1, y2) - Math.abs(dx * 0.25) - 25;

            // Grupo interativo para o Jumper
            const compG = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            compG.setAttribute('class', `bb-comp-interactive ${lab_activeInspectId === comp.id ? 'active-inspect' : ''}`);
            compG.setAttribute('data-comp-id', comp.id);
            compG.addEventListener('mouseenter', (e) => lab_showBenchTooltip(comp.id, e));
            compG.addEventListener('mousemove', (e) => lab_updateTooltipPos(e));
            compG.addEventListener('mouseleave', () => lab_hideBenchTooltip());
            compG.addEventListener('click', (e) => lab_inspectComponent(comp.id, e));

            // Curva do fio flexível
            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path.setAttribute('d', `M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`);
            path.setAttribute('stroke', comp.color);
            path.setAttribute('stroke-width', '5.5');
            path.setAttribute('fill', 'none');
            path.setAttribute('stroke-linecap', 'round');
            path.setAttribute('filter', 'drop-shadow(0 4px 6px rgba(0,0,0,0.5))');
            compG.appendChild(path);

            // Pinos metálicos nas pontas
            [ [x1,y1], [x2,y2] ].forEach(([px,py]) => {
                const pin = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                pin.setAttribute('cx', px); pin.setAttribute('cy', py); pin.setAttribute('r', '4');
                pin.setAttribute('fill', '#94A3B8'); pin.setAttribute('stroke', '#0F172A'); pin.setAttribute('stroke-width', '1.5');
                compG.appendChild(pin);
            });

            // Etiqueta Visual Flutuante no Fio Jumper
            if(lab_showVisualLabels) {
                const badgeG = document.createElementNS('http://www.w3.org/2000/svg', 'g');
                badgeG.setAttribute('class', 'bb-label-pill');
                badgeG.setAttribute('transform', `translate(${cx}, ${cy - 12})`);

                let labelText = comp.label;
                if(comp.id === 'j_gnd') labelText = '🔌 GND (0V Terra)';
                else if(comp.id === 'j_13') labelText = '🔌 D13 (+5V Verm)';
                else if(comp.id === 'j_12') labelText = '🔌 D12 (+5V Amar)';
                else if(comp.id === 'j_11') labelText = '🔌 D11 (+5V Verde)';

                const textLen = labelText.length * 6.5 + 16;
                const bgRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                bgRect.setAttribute('x', -textLen/2);
                bgRect.setAttribute('y', -10);
                bgRect.setAttribute('width', textLen);
                bgRect.setAttribute('height', '20');
                bgRect.setAttribute('rx', '10');
                bgRect.setAttribute('fill', '#0F172A');
                bgRect.setAttribute('stroke', comp.color === '#0F172A' ? '#64748B' : comp.color);
                bgRect.setAttribute('stroke-width', '2');
                bgRect.setAttribute('filter', 'drop-shadow(0 2px 5px rgba(0,0,0,0.7))');
                badgeG.appendChild(bgRect);

                const txt = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                txt.setAttribute('x', '0');
                txt.setAttribute('y', '4');
                txt.setAttribute('text-anchor', 'middle');
                txt.setAttribute('fill', '#F8FAFC');
                txt.setAttribute('font-size', '10');
                txt.setAttribute('font-weight', '900');
                txt.setAttribute('font-family', 'sans-serif');
                txt.textContent = labelText;
                badgeG.appendChild(txt);

                compG.appendChild(badgeG);
            }

            svg.appendChild(compG);

        } else if(comp.type === 'resistor') {
            const el1 = document.getElementById(comp.from);
            const el2 = document.getElementById(comp.to);
            if(!el1 || !el2) return;

            const r1 = el1.getBoundingClientRect();
            const r2 = el2.getBoundingClientRect();
            const x1 = r1.left + r1.width/2 - bRect.left;
            const y1 = r1.top + r1.height/2 - bRect.top;
            const x2 = r2.left + r2.width/2 - bRect.left;
            const y2 = r2.top + r2.height/2 - bRect.top;

            // Grupo interativo para o Resistor
            const compG = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            compG.setAttribute('class', `bb-comp-interactive ${lab_activeInspectId === comp.id ? 'active-inspect' : ''}`);
            compG.setAttribute('data-comp-id', comp.id);
            compG.addEventListener('mouseenter', (e) => lab_showBenchTooltip(comp.id, e));
            compG.addEventListener('mousemove', (e) => lab_updateTooltipPos(e));
            compG.addEventListener('mouseleave', () => lab_hideBenchTooltip());
            compG.addEventListener('click', (e) => lab_inspectComponent(comp.id, e));

            // Pernas condutoras metálicas
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('x1', x1); line.setAttribute('y1', y1); line.setAttribute('x2', x2); line.setAttribute('y2', y2);
            line.setAttribute('stroke', '#94A3B8'); line.setAttribute('stroke-width', '3');
            compG.appendChild(line);

            const mx = (x1 + x2)/2, my = (y1 + y2)/2;
            const angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;

            const bodyG = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            bodyG.setAttribute('transform', `translate(${mx},${my}) rotate(${angle})`);

            // Corpo de cerâmica bege do resistor
            const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            rect.setAttribute('x', '-16'); rect.setAttribute('y', '-7');
            rect.setAttribute('width', '32'); rect.setAttribute('height', '14');
            rect.setAttribute('rx', '5'); rect.setAttribute('fill', '#D4B996');
            rect.setAttribute('stroke', '#8C6D4F'); rect.setAttribute('stroke-width', '1.5');
            rect.setAttribute('filter', 'drop-shadow(0 2px 4px rgba(0,0,0,0.4))');
            bodyG.appendChild(rect);

            // Faixas de Cores do Resistor 300 Ω (Laranja, Preto, Marrom, Dourado)
            [ [-10, '#EA580C'], [-4, '#000000'], [2, '#78350F'], [9, '#F59E0B'] ].forEach(([bx, bCol]) => {
                const b = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                b.setAttribute('x', bx); b.setAttribute('y', '-7');
                b.setAttribute('width', '3'); b.setAttribute('height', '14');
                b.setAttribute('fill', bCol);
                bodyG.appendChild(b);
            });

            compG.appendChild(bodyG);

            // Pinos metálicos de entrada e saída
            [ [x1, y1], [x2, y2] ].forEach(([px, py]) => {
                const pinDot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                pinDot.setAttribute('cx', px); pinDot.setAttribute('cy', py); pinDot.setAttribute('r', '3');
                pinDot.setAttribute('fill', '#F8FAFC'); pinDot.setAttribute('stroke', '#0F172A'); pinDot.setAttribute('stroke-width', '1');
                compG.appendChild(pinDot);
            });

            // Etiqueta Visual Flutuante no Resistor
            if(lab_showVisualLabels) {
                const badgeG = document.createElementNS('http://www.w3.org/2000/svg', 'g');
                badgeG.setAttribute('class', 'bb-label-pill');
                badgeG.setAttribute('transform', `translate(${mx + 28}, ${my})`);

                const rLabel = comp.id === 'res_red' ? '⚡ R1: 300Ω' : (comp.id === 'res_yel' ? '⚡ R2: 300Ω' : '⚡ R3: 300Ω');
                const textLen = rLabel.length * 6.8 + 14;

                const bgRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                bgRect.setAttribute('x', -textLen/2);
                bgRect.setAttribute('y', -9);
                bgRect.setAttribute('width', textLen);
                bgRect.setAttribute('height', '18');
                bgRect.setAttribute('rx', '9');
                bgRect.setAttribute('fill', '#0F172A');
                bgRect.setAttribute('stroke', '#D4B996');
                bgRect.setAttribute('stroke-width', '1.8');
                bgRect.setAttribute('filter', 'drop-shadow(0 2px 4px rgba(0,0,0,0.6))');
                badgeG.appendChild(bgRect);

                const txt = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                txt.setAttribute('x', '0');
                txt.setAttribute('y', '3.5');
                txt.setAttribute('text-anchor', 'middle');
                txt.setAttribute('fill', '#FBBF24');
                txt.setAttribute('font-size', '9.5');
                txt.setAttribute('font-weight', 'bold');
                txt.setAttribute('font-family', 'sans-serif');
                txt.textContent = rLabel;
                badgeG.appendChild(txt);

                compG.appendChild(badgeG);
            }

            svg.appendChild(compG);

        } else if(comp.type === 'led') {
            const el1 = document.getElementById(comp.from); // hole-C-10/16/22 (Ânodo +)
            const el2 = document.getElementById(comp.to);   // hole-C-11/17/23 (Cátodo -)
            if(!el1 || !el2) return;

            const r1 = el1.getBoundingClientRect();
            const r2 = el2.getBoundingClientRect();
            const x1 = r1.left + r1.width/2 - bRect.left;
            const y1 = r1.top + r1.height/2 - bRect.top;
            const x2 = r2.left + r2.width/2 - bRect.left;
            const y2 = r2.top + r2.height/2 - bRect.top;

            const mx = (x1 + x2)/2;
            const my = (y1 + y2)/2;
            // Eleva o bulbo do LED 24px acima da placa para ambas as pernas ficarem 100% visíveis e nítidas
            const bulbY = my - 24;

            const isLit = lab_usbPower && lab_pinsState[comp.pin];

            let ledHex = '#EF4444';
            let ledOffHex = '#DC2626';
            let ledOffDark = '#991B1B';
            if(comp.color === 'yellow') {
                ledHex = '#F59E0B';
                ledOffHex = '#D97706';
                ledOffDark = '#92400E';
            } else if(comp.color === 'green') {
                ledHex = '#10B981';
                ledOffHex = '#059669';
                ledOffDark = '#065F46';
            }

            // Grupo interativo para o LED
            const compG = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            compG.setAttribute('class', `bb-comp-interactive ${lab_activeInspectId === comp.id ? 'active-inspect' : ''}`);
            compG.setAttribute('data-comp-id', comp.id);
            compG.addEventListener('mouseenter', (e) => lab_showBenchTooltip(comp.id, e));
            compG.addEventListener('mousemove', (e) => lab_updateTooltipPos(e));
            compG.addEventListener('mouseleave', () => lab_hideBenchTooltip());
            compG.addEventListener('click', (e) => lab_inspectComponent(comp.id, e));

            // Perna 1: Ânodo (+) - Perna longa curva saindo do furo x1, y1 até a base do LED
            const leg1 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            leg1.setAttribute('d', `M ${x1} ${y1} C ${x1} ${y1 - 10}, ${mx - 4} ${bulbY + 12}, ${mx - 4} ${bulbY + 5}`);
            leg1.setAttribute('stroke', '#E2E8F0');
            leg1.setAttribute('stroke-width', '2.5');
            leg1.setAttribute('fill', 'none');
            leg1.setAttribute('stroke-linecap', 'round');
            leg1.setAttribute('filter', 'drop-shadow(0 2px 3px rgba(0,0,0,0.4))');
            compG.appendChild(leg1);

            // Perna 2: Cátodo (-) - Perna curta com chanfro saindo do furo x2, y2 até a base do LED
            const leg2 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            leg2.setAttribute('d', `M ${x2} ${y2} C ${x2} ${y2 - 10}, ${mx + 4} ${bulbY + 12}, ${mx + 4} ${bulbY + 5}`);
            leg2.setAttribute('stroke', '#94A3B8');
            leg2.setAttribute('stroke-width', '2.5');
            leg2.setAttribute('fill', 'none');
            leg2.setAttribute('stroke-linecap', 'round');
            leg2.setAttribute('filter', 'drop-shadow(0 2px 3px rgba(0,0,0,0.4))');
            compG.appendChild(leg2);

            // Contatos metálicos nos furos com identificadores táteis de polaridade (+ e -)
            [ [x1, y1, '+', '#EF4444', 'Ânodo (+)'], [x2, y2, '-', '#38BDF8', 'Cátodo (-)'] ].forEach(([px, py, sign, signCol, polName]) => {
                const pinDot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                pinDot.setAttribute('cx', px); pinDot.setAttribute('cy', py);
                pinDot.setAttribute('r', '3.5');
                pinDot.setAttribute('fill', '#F8FAFC');
                pinDot.setAttribute('stroke', '#334155');
                pinDot.setAttribute('stroke-width', '1.5');
                compG.appendChild(pinDot);

                const signTxt = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                signTxt.setAttribute('x', px + (sign === '+' ? -8 : 8));
                signTxt.setAttribute('y', py + 12);
                signTxt.setAttribute('fill', signCol);
                signTxt.setAttribute('font-size', '10.5');
                signTxt.setAttribute('font-weight', '900');
                signTxt.setAttribute('text-anchor', 'middle');
                signTxt.textContent = sign;
                compG.appendChild(signTxt);
            });

            // Se estiver LIGADO: Halo de Luz Emissivo (Limpo e nítido)
            if(isLit) {
                const aura1 = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                aura1.setAttribute('cx', mx); aura1.setAttribute('cy', bulbY);
                aura1.setAttribute('r', '22');
                aura1.setAttribute('fill', ledHex);
                aura1.setAttribute('opacity', '0.35');
                compG.appendChild(aura1);

                const aura2 = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                aura2.setAttribute('cx', mx); aura2.setAttribute('cy', bulbY);
                aura2.setAttribute('r', '15');
                aura2.setAttribute('fill', ledHex);
                aura2.setAttribute('opacity', '0.65');
                compG.appendChild(aura2);
            }

            // Flange / Base da Borda (com chanfro plano no lado do cátodo)
            const flange = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            flange.setAttribute('x', mx - 8);
            flange.setAttribute('y', bulbY + 2);
            flange.setAttribute('width', '16');
            flange.setAttribute('height', '3.5');
            flange.setAttribute('rx', '1.5');
            flange.setAttribute('fill', isLit ? ledHex : ledOffDark);
            flange.setAttribute('stroke', isLit ? '#FFFFFF' : '#450A0A');
            flange.setAttribute('stroke-width', '1');
            compG.appendChild(flange);

            // Cúpula do LED (Semi-cápsula com topo arredondado)
            const dome = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            dome.setAttribute('d', `
                M ${mx - 7} ${bulbY + 2}
                L ${mx - 7} ${bulbY - 6}
                A 7 7 0 0 1 ${mx + 7} ${bulbY - 6}
                L ${mx + 7} ${bulbY + 2}
                Z
            `);
            dome.setAttribute('fill', isLit ? ledHex : ledOffHex);
            dome.setAttribute('stroke', isLit ? '#FFFFFF' : ledOffDark);
            dome.setAttribute('stroke-width', isLit ? '1.8' : '1.2');
            if(isLit) {
                dome.setAttribute('filter', 'drop-shadow(0 0 8px ' + ledHex + ')');
            }
            compG.appendChild(dome);

            // Filamento / Anvil interno visível
            if(isLit) {
                const core = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                core.setAttribute('cx', mx); core.setAttribute('cy', bulbY - 3);
                core.setAttribute('r', '4');
                core.setAttribute('fill', '#FFFFFF');
                core.setAttribute('opacity', '0.9');
                compG.appendChild(core);
            } else {
                const anvil = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                anvil.setAttribute('d', `M ${mx - 4} ${bulbY + 2} L ${mx - 2} ${bulbY - 3} L ${mx + 2} ${bulbY - 3} L ${mx + 4} ${bulbY + 2}`);
                anvil.setAttribute('stroke', '#E2E8F0');
                anvil.setAttribute('stroke-width', '1');
                anvil.setAttribute('fill', 'none');
                anvil.setAttribute('opacity', '0.6');
                compG.appendChild(anvil);
            }

            // Brilho Especular de Reflexo no Vidro (Glossy Arc)
            const spec = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            spec.setAttribute('d', `M ${mx - 4} ${bulbY - 9} A 5 5 0 0 1 ${mx + 2} ${bulbY - 11}`);
            spec.setAttribute('stroke', '#FFFFFF');
            spec.setAttribute('stroke-width', '1.6');
            spec.setAttribute('stroke-linecap', 'round');
            spec.setAttribute('fill', 'none');
            spec.setAttribute('opacity', '0.85');
            compG.appendChild(spec);

            // Etiqueta Visual Flutuante no LED
            if(lab_showVisualLabels) {
                const badgeG = document.createElementNS('http://www.w3.org/2000/svg', 'g');
                badgeG.setAttribute('class', 'bb-label-pill');
                badgeG.setAttribute('transform', `translate(${mx}, ${bulbY - 26})`);

                const ledLabel = comp.color === 'red' ? '🔴 LED Vermelho (+/-)' : (comp.color === 'yellow' ? '🟡 LED Amarelo (+/-)' : '🟢 LED Verde (+/-)');
                const textLen = ledLabel.length * 6.5 + 16;

                const bgRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                bgRect.setAttribute('x', -textLen/2);
                bgRect.setAttribute('y', -10);
                bgRect.setAttribute('width', textLen);
                bgRect.setAttribute('height', '20');
                bgRect.setAttribute('rx', '10');
                bgRect.setAttribute('fill', '#0B132B');
                bgRect.setAttribute('stroke', ledHex);
                bgRect.setAttribute('stroke-width', '2');
                bgRect.setAttribute('filter', 'drop-shadow(0 3px 6px rgba(0,0,0,0.7))');
                badgeG.appendChild(bgRect);

                const txt = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                txt.setAttribute('x', '0');
                txt.setAttribute('y', '4');
                txt.setAttribute('text-anchor', 'middle');
                txt.setAttribute('fill', '#FFFFFF');
                txt.setAttribute('font-size', '10');
                txt.setAttribute('font-weight', '900');
                txt.setAttribute('font-family', 'sans-serif');
                txt.textContent = ledLabel;
                badgeG.appendChild(txt);

                compG.appendChild(badgeG);
            }

            svg.appendChild(compG);
        }
    });
}

/* ================= SISTEMA DE TOOLTIPS & LEGENDAS DINÂMICAS ================= */

/* Exibe a Tooltip Flutuante ao passar o mouse */
function lab_showBenchTooltip(compId, evt) {
    lab_benchHasInspected = true;
    const chkInsp = document.getElementById('bench_chk_insp');
    const iconInsp = document.getElementById('icon_chk_insp');
    if (chkInsp) chkInsp.style.borderColor = '#10B981';
    if (iconInsp) iconInsp.innerText = '✅';

    if (lab_isTooltipPinned) return;
    const tt = document.getElementById('lab_workbench_tooltip');
    const comp = LAB_COMPONENT_DETAILS[compId];
    if (!tt || !comp) return;

    let polarityBadge = '';
    if (comp.polarity.includes('POLARIZADO')) {
        polarityBadge = `<span style="background:#EF4444;color:white;padding:2px 8px;border-radius:10px;font-size:0.75rem;font-weight:bold;">⚡ POLARIZADO (+/-)</span>`;
    } else if (comp.polarity.includes('NÃO POSSUI')) {
        polarityBadge = `<span style="background:#10B981;color:white;padding:2px 8px;border-radius:10px;font-size:0.75rem;font-weight:bold;">🔄 SEM POLARIDADE</span>`;
    } else {
        polarityBadge = `<span style="background:#0284C7;color:white;padding:2px 8px;border-radius:10px;font-size:0.75rem;font-weight:bold;">📍 REFERÊNCIA</span>`;
    }

    tt.innerHTML = `
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;gap:8px;">
            <strong style="color:#FBBF24;font-size:0.95rem;">${comp.name}</strong>
            ${polarityBadge}
        </div>
        <div style="font-size:0.78rem;color:#94A3B8;margin-bottom:8px;font-style:italic;">${comp.category}</div>
        <div style="margin-bottom:6px;"><strong style="color:#38BDF8;">🎯 Função:</strong> ${comp.role}</div>
        <div style="margin-bottom:6px;"><strong style="color:#F59E0B;">⚡ Polaridade:</strong> ${comp.polarity}</div>
        ${comp.anodeHole ? `<div style="margin-bottom:4px;"><strong style="color:#10B981;">📍 Conexão:</strong> Ânodo: <code>${comp.anodeHole}</code> | Cátodo: <code>${comp.cathodeHole}</code></div>` : ''}
        ${comp.connection ? `<div style="margin-bottom:4px;"><strong style="color:#10B981;">📍 Conexão:</strong> ${comp.connection}</div>` : ''}
        <div style="margin-top:8px;padding-top:6px;border-top:1px dashed #334155;font-size:0.72rem;color:#94A3B8;display:flex;justify-content:space-between;align-items:center;">
            <span>👉 Clique para fixar na Ficha Técnica</span>
            <span style="color:#38BDF8;">Laboratório Maker</span>
        </div>
    `;

    tt.style.display = 'block';
    lab_positionTooltip(evt);
}

/* Atualiza a posição da tooltip conforme o cursor se move */
function lab_updateTooltipPos(evt) {
    if (lab_isTooltipPinned) return;
    lab_positionTooltip(evt);
}

function lab_positionTooltip(evt) {
    const tt = document.getElementById('lab_workbench_tooltip');
    if (!tt || !evt) return;
    const clientX = evt.clientX || (evt.touches && evt.touches[0] ? evt.touches[0].clientX : 200);
    const clientY = evt.clientY || (evt.touches && evt.touches[0] ? evt.touches[0].clientY : 200);

    const ttWidth = 320;
    let left = clientX;
    let top = clientY - 14;

    if (left < ttWidth / 2 + 10) left = ttWidth / 2 + 10;
    if (left > window.innerWidth - ttWidth / 2 - 10) left = window.innerWidth - ttWidth / 2 - 10;

    tt.style.left = left + 'px';
    tt.style.top = top + 'px';
}

/* Oculta a tooltip se não estiver fixada */
function lab_hideBenchTooltip() {
    if (lab_isTooltipPinned) return;
    const tt = document.getElementById('lab_workbench_tooltip');
    if (tt) tt.style.display = 'none';
}

/* Inspeciona um componente ao clicar, destacando na bancada e atualizando a ficha técnica */
function lab_inspectComponent(compId, evt) {
    if (evt) evt.stopPropagation();
    playSound('click');
    lab_activeInspectId = compId;
    lab_isTooltipPinned = true;

    lab_benchHasInspected = true;
    const chkInsp = document.getElementById('bench_chk_insp');
    const iconInsp = document.getElementById('icon_chk_insp');
    if (chkInsp) chkInsp.style.borderColor = '#10B981';
    if (iconInsp) iconInsp.innerText = '✅';

    // Atualiza classes e renderização na bancada
    lab_renderCircuit();
    lab_renderInspectorPanel();

    const tt = document.getElementById('lab_workbench_tooltip');
    if (tt && evt) {
        lab_showBenchTooltip(compId, evt);
        tt.classList.add('pinned');
        const footer = tt.querySelector('div:last-child');
        if (footer) {
            footer.innerHTML = `
                <span style="color:#F59E0B;font-weight:bold;">📌 Fixado na Ficha Técnica</span>
                <button type="button" onclick="lab_unpinTooltip(event)" style="background:#334155;color:white;border:none;border-radius:6px;padding:2px 8px;cursor:pointer;font-size:0.75rem;">Fechar ✕</button>
            `;
        }
    }
}

/* Desafixa a tooltip */
function lab_unpinTooltip(evt) {
    if (evt) evt.stopPropagation();
    lab_isTooltipPinned = false;
    const tt = document.getElementById('lab_workbench_tooltip');
    if (tt) {
        tt.style.display = 'none';
        tt.classList.remove('pinned');
    }
}

/* Alterna ligar/desligar as etiquetas flutuantes sobre os componentes */
function lab_toggleVisualLabels() {
    playSound('click');
    lab_showVisualLabels = !lab_showVisualLabels;
    const btn = document.getElementById('lab_labels_toggle_btn');
    const txt = document.getElementById('lab_labels_btn_text');
    if (btn) {
        btn.style.background = lab_showVisualLabels ? '#0284C7' : '#334155';
    }
    if (txt) {
        txt.innerText = lab_showVisualLabels ? 'Etiquetas Visuais: LIGADAS' : 'Etiquetas Visuais: DESLIGADAS';
    }
    lab_renderCircuit();
}

/* Renderiza os chips de componentes e o painel detalhado de identificação e polaridade */
function lab_renderInspectorPanel() {
    const chipsEl = document.getElementById('lab_inspector_chips');
    const detailsEl = document.getElementById('lab_inspector_details');
    if (!chipsEl || !detailsEl) return;

    const chipKeys = [
        { id: 'led_red', label: '🔴 LED Vermelho (+/-)', color: '#EF4444' },
        { id: 'led_yel', label: '🟡 LED Amarelo (+/-)', color: '#F59E0B' },
        { id: 'led_gre', label: '🟢 LED Verde (+/-)', color: '#10B981' },
        { id: 'res_red', label: '⚡ Resistor R1 (300Ω)', color: '#D4B996' },
        { id: 'res_yel', label: '⚡ Resistor R2 (300Ω)', color: '#D4B996' },
        { id: 'res_gre', label: '⚡ Resistor R3 (300Ω)', color: '#D4B996' },
        { id: 'j_gnd', label: '🔌 Jumper GND (Preto)', color: '#64748B' },
        { id: 'j_13', label: '🔌 Jumper D13 (Vermelho)', color: '#EF4444' },
        { id: 'j_12', label: '🔌 Jumper D12 (Amarelo)', color: '#F59E0B' },
        { id: 'j_11', label: '🔌 Jumper D11 (Verde)', color: '#10B981' },
        { id: 'bb_protoboard', label: '📋 Protoboard 30', color: '#38BDF8' },
        { id: 'bb_gnd_rail', label: '🛡️ Barramento (-) GND', color: '#0284C7' }
    ];

    chipsEl.innerHTML = chipKeys.map(c => `
        <button type="button" class="lab-chip-btn ${lab_activeInspectId === c.id ? 'active' : ''}" 
                onclick="lab_inspectComponent('${c.id}', null)">
            <span>${c.label}</span>
        </button>
    `).join('');

    const comp = LAB_COMPONENT_DETAILS[lab_activeInspectId] || LAB_COMPONENT_DETAILS['led_red'];

    let polarityHTML = '';
    if (comp.polarity.includes('POLARIZADO')) {
        polarityHTML = `
            <div style="background:rgba(239,68,68,0.15);border:1px solid #EF4444;border-radius:12px;padding:12px 16px;margin:10px 0;">
                <div style="display:flex;align-items:center;gap:8px;color:#EF4444;font-weight:900;margin-bottom:6px;font-size:0.92rem;">
                    <i class="fa-solid fa-triangle-exclamation"></i> COMPONENTE POLARIZADO (POSSUI LADO CERTO):
                </div>
                <div style="color:#F8FAFC;font-size:0.92rem;line-height:1.6;">
                    ${comp.polarity}
                </div>
                <div style="display:flex;gap:10px;margin-top:10px;flex-wrap:wrap;">
                    <div style="background:#0F172A;border:1px solid #EF4444;border-radius:8px;padding:6px 12px;font-size:0.85rem;">
                        <span style="color:#EF4444;font-weight:bold;">Ânodo (+)</span>: Perna Longa ➔ ${comp.anodeHole || 'Positivo'}
                    </div>
                    <div style="background:#0F172A;border:1px solid #38BDF8;border-radius:8px;padding:6px 12px;font-size:0.85rem;">
                        <span style="color:#38BDF8;font-weight:bold;">Cátodo (-)</span>: Perna Curta chanfrada ➔ ${comp.cathodeHole || 'Negativo/GND'}
                    </div>
                </div>
            </div>
        `;
    } else if (comp.polarity.includes('NÃO POSSUI POLARIDADE')) {
        polarityHTML = `
            <div style="background:rgba(16,185,129,0.15);border:1px solid #10B981;border-radius:12px;padding:12px 16px;margin:10px 0;">
                <div style="display:flex;align-items:center;gap:8px;color:#10B981;font-weight:900;margin-bottom:6px;font-size:0.92rem;">
                    <i class="fa-solid fa-arrows-left-right"></i> COMPONENTE NÃO POLARIZADO (BIDIRECIONAL):
                </div>
                <div style="color:#F8FAFC;font-size:0.92rem;line-height:1.6;">
                    ${comp.polarity}
                </div>
                ${comp.colorCode ? `<div style="margin-top:8px;font-size:0.85rem;color:#A7F3D0;">🎨 <strong>Código de Cores:</strong> ${comp.colorCode}</div>` : ''}
            </div>
        `;
    } else {
        polarityHTML = `
            <div style="background:rgba(56,189,248,0.15);border:1px solid #38BDF8;border-radius:12px;padding:12px 16px;margin:10px 0;">
                <div style="color:#38BDF8;font-weight:900;margin-bottom:4px;font-size:0.92rem;">
                    <i class="fa-solid fa-circle-nodes"></i> POLARIDADE E REFERÊNCIA:
                </div>
                <div style="color:#F8FAFC;font-size:0.92rem;line-height:1.5;">
                    ${comp.polarity}
                </div>
            </div>
        `;
    }

    detailsEl.innerHTML = `
        <div style="background:#1E293B;border:1px solid #334155;border-radius:16px;padding:18px 22px;">
            <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:10px;margin-bottom:14px;">
                <div>
                    <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;">
                        <h3 class="lab-title-font" style="color:#FBBF24;margin:0;font-size:1.35rem;">
                            ${comp.name}
                        </h3>
                        <span style="background:#0F172A;border:1px solid #334155;color:#94A3B8;padding:3px 10px;border-radius:12px;font-size:0.75rem;font-weight:bold;">
                            ${comp.category}
                        </span>
                    </div>
                </div>
                ${comp.pinArduino ? `
                    <div style="background:#0F172A;border:1px solid #0284C7;border-radius:10px;padding:4px 12px;font-family:monospace;font-size:0.85rem;color:#38BDF8;font-weight:bold;">
                        ${comp.pinArduino}
                    </div>
                ` : ''}
            </div>

            <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(280px, 1fr));gap:18px;">
                <div>
                    <div style="margin-bottom:10px;">
                        <span style="color:#94A3B8;font-size:0.82rem;text-transform:uppercase;font-weight:bold;">🎯 Função no Circuito:</span>
                        <p style="color:#F8FAFC;margin:4px 0 0;font-size:0.95rem;line-height:1.5;">${comp.role}</p>
                    </div>
                    ${comp.connection ? `
                        <div style="margin-bottom:10px;">
                            <span style="color:#94A3B8;font-size:0.82rem;text-transform:uppercase;font-weight:bold;">📍 Conexão Elétrica:</span>
                            <p style="color:#38BDF8;margin:4px 0 0;font-size:0.92rem;font-weight:600;">${comp.connection}</p>
                        </div>
                    ` : ''}
                    ${comp.voltage ? `
                        <div style="display:flex;gap:18px;margin-top:10px;background:#0F172A;border-radius:10px;padding:10px 14px;">
                            <div>
                                <span style="color:#94A3B8;font-size:0.78rem;">Queda de Tensão:</span>
                                <div style="color:#10B981;font-weight:bold;font-size:0.95rem;">${comp.voltage}</div>
                            </div>
                            <div>
                                <span style="color:#94A3B8;font-size:0.78rem;">Corrente Nominal:</span>
                                <div style="color:#38BDF8;font-weight:bold;font-size:0.95rem;">${comp.current}</div>
                            </div>
                        </div>
                    ` : ''}
                    ${comp.lawOhm ? `
                        <div style="margin-top:10px;background:#0F172A;border-radius:10px;padding:10px 14px;border-left:3px solid #10B981;">
                            <span style="color:#A7F3D0;font-size:0.78rem;font-weight:bold;text-transform:uppercase;">Cálculo da Lei de Ohm:</span>
                            <div style="color:#F8FAFC;font-size:0.88rem;margin-top:2px;">${comp.lawOhm}</div>
                        </div>
                    ` : ''}
                </div>

                <div>
                    ${polarityHTML}
                    <div style="background:#0F172A;border-left:3px solid #F59E0B;padding:12px 14px;border-radius:0 12px 12px 0;font-size:0.88rem;color:#E2E8F0;line-height:1.5;margin-top:10px;">
                        ${comp.tip}
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Ouvinte de clique global para fechar tooltip fixada se o usuário clicar fora
document.addEventListener('click', function(e) {
    if (!e.target.closest('.bb-comp-interactive') && !e.target.closest('.bb-label-pill') && !e.target.closest('.lab-chip-btn') && !e.target.closest('#lab_workbench_tooltip')) {
        if (lab_isTooltipPinned) {
            lab_unpinTooltip();
        }
    }
});

/* ================= MISSÕES E PERSISTÊNCIA ================= */
function lab_completeMission(level, title, text) {
    level = parseInt(level, 10);
    if (isNaN(level) || level < 1) level = 1;

    let saved = JSON.parse(localStorage.getItem('labmaker_levels') || '[]');

    // Validação estrita: não pode avançar para a Missão 2 ou 3 sem passar pela anterior!
    for (let prev = 1; prev < level; prev++) {
        if (!saved.includes(prev)) {
            if (typeof playSound === 'function') playSound('error');
            alert(`🔒 Missão ${level} Bloqueada!\n\nVocê precisa concluir a Missão ${prev} primeiro antes de avançar para a Missão ${level}!`);
            return;
        }
    }

    playSound('success');
    if(typeof triggerConfetti === 'function') triggerConfetti(3500);

    let speedrunHTML = '';
    if (window.makerLeaderboard) {
        const elapsed = window.makerLeaderboard.stopTimer('labmaker', level) || 12.0;
        const res = window.makerLeaderboard.recordCompletion('labmaker', level, elapsed);
        speedrunHTML = window.makerLeaderboard.generateWinTimeCardHTML('labmaker', level, res);
    }

    if(!saved.includes(level)) saved.push(level);
    localStorage.setItem('labmaker_levels', JSON.stringify(saved));

    lab_updateBadges();
    if(typeof updateHubProgress === 'function') updateHubProgress();
    if(typeof updateTrail === 'function') updateTrail();

    lab_showCelebrateModal('🏆', title, text + speedrunHTML);
}

function lab_updateBadges() {
    let saved = JSON.parse(localStorage.getItem('labmaker_levels') || '[]');
    [1, 2, 3].forEach(lvl => {
        const chip = document.getElementById('lab_chip_lvl' + lvl);
        const card = document.getElementById('mcard_' + lvl);
        const btn = document.getElementById('mbtn_' + lvl);

        let canAccess = true;
        for (let p = 1; p < lvl; p++) {
            if (!saved.includes(p)) {
                canAccess = false;
                break;
            }
        }

        if(saved.includes(lvl)) {
            if(chip) { chip.classList.add('active'); chip.style.opacity = '1'; }
            if(card) { card.classList.add('done'); card.style.opacity = '1'; }
            if(btn) {
                btn.innerText = '✅ Missão Concluída ⭐';
                btn.style.background = '#10B981';
                btn.style.cursor = 'default';
                btn.disabled = false;
            }
        } else if (!canAccess) {
            if(chip) { chip.classList.remove('active'); chip.style.opacity = '0.55'; }
            if(card) { card.classList.remove('done'); card.style.opacity = '0.6'; }
            if(btn) {
                btn.innerText = `🔒 Bloqueado (Faça Missão ${lvl - 1} primeiro)`;
                btn.style.background = '#334155';
                btn.style.color = '#94A3B8';
                btn.style.cursor = 'not-allowed';
            }
        } else {
            if(chip) { chip.classList.remove('active'); chip.style.opacity = '1'; }
            if(card) { card.classList.remove('done'); card.style.opacity = '1'; }
            if(btn) {
                btn.innerText = `Concluir Missão ${lvl} ${'⭐'.repeat(lvl)}`;
                btn.style.background = '#0284C7';
                btn.style.color = '#FFFFFF';
                btn.style.cursor = 'pointer';
            }
        }
    });
}

function lab_showCelebrateModal(icon, title, desc) {
    const m = document.getElementById('lab_celebrate_modal');
    if(!m) return;
    document.getElementById('lab_mod_icon').innerText = icon;
    document.getElementById('lab_mod_title').innerText = title;
    document.getElementById('lab_mod_desc').innerHTML = desc;
    m.style.display = 'flex';
}

function lab_closeCelebrateModal() {
    const m = document.getElementById('lab_celebrate_modal');
    if(m) m.style.display = 'none';
}

/* ================= QUIZ DE FIXAÇÃO ================= */
function lab_answerQuiz(qNum, optNum, isCorrect) {
    const box = document.getElementById('quiz_box_' + qNum);
    const fb = document.getElementById('qfb_' + qNum);
    if(!box || !fb) return;

    box.querySelectorAll('.lab-quiz-opt').forEach((btn, idx) => {
        btn.disabled = true;
        if(idx + 1 === optNum) {
            btn.classList.add(isCorrect ? 'correct' : 'wrong');
        }
    });

    fb.style.display = 'block';
    if(isCorrect) {
        playSound('success');
        fb.style.color = '#34D399';
        fb.innerHTML = '🎉 Resposta Exata! Parabéns, jovem maker!';
        lab_quizScore++;
        if(lab_quizScore === 5) {
            setTimeout(() => {
                lab_completeMission(3, 'Mestre dos Circuitos Maker!', 'Você acertou todas as 5 questões do Quiz de Eletrônica e Protoboard!');
            }, 600);
        }
    } else {
        playSound('error');
        fb.style.color = '#F87171';
        fb.innerHTML = '❌ Ops! Revise a explicação acima e lembre-se: o resistor não tem lado, mas o LED tem perna longa (+) e curta (-)!';
    }
}

/* ==========================================================================
   IMPLEMENTAÇÃO DO EXPLORADOR RAIO-X & SIMULADORES INTEGRADOS
   ========================================================================== */
let lab_vguide_selectedCol = 10;
let lab_vguide_selectedRow = 'C';
let lab_vguide_selectedSide = 'top';
let lab_vguide_miniCompleted = { 1: false, 2: false, 3: false, 4: false };

/* Inicializa a Protoboard Expandida das Colunas 8 a 15 */
function lab_vguide_init() {
    const topHolesEl = document.getElementById('vg_rail_top_holes');
    const botHolesEl = document.getElementById('vg_rail_bot_holes');
    const topGridEl = document.getElementById('vg_cols_matrix_container');
    const botGridEl = document.getElementById('vg_cols_matrix_bottom_container');

    if (!topGridEl || !botGridEl) return;

    // Constrói os furos do barramento superior (-) GND (Colunas 8 a 24)
    if (topHolesEl && topHolesEl.children.length === 0) {
        topHolesEl.innerHTML = '';
        for (let c = 8; c <= 24; c++) {
            const h = document.createElement('div');
            h.className = 'vg-hole-cell';
            h.style.width = '24px';
            h.style.height = '24px';
            h.style.borderColor = '#0284C7';
            h.style.background = '#0F172A';
            h.title = `Barramento Azul (-) Coluna ${c}`;
            h.innerText = '-';
            topHolesEl.appendChild(h);
        }
    }

    // Constrói os furos do barramento inferior (-) GND (Colunas 8 a 24) com pinos de retorno dos resistores
    if (botHolesEl && botHolesEl.children.length === 0) {
        botHolesEl.innerHTML = '';
        for (let c = 8; c <= 24; c++) {
            const h = document.createElement('div');
            h.className = 'vg-hole-cell';
            h.style.width = '26px';
            h.style.height = '26px';
            h.dataset.col = c;
            h.dataset.row = 'GND';
            h.dataset.side = 'rail';

            if (c === 11) {
                h.classList.add('pin-resistor-gnd');
                h.innerHTML = '<span style="font-size:0.55rem;font-weight:900;">R1</span>';
                h.title = 'Barramento GND Col 11: Perna Inferior do Resistor 1 conectada ao Terra (0V)';
            } else if (c === 17) {
                h.classList.add('pin-resistor-gnd');
                h.innerHTML = '<span style="font-size:0.55rem;font-weight:900;">R2</span>';
                h.title = 'Barramento GND Col 17: Perna Inferior do Resistor 2 conectada ao Terra (0V)';
            } else if (c === 23) {
                h.classList.add('pin-resistor-gnd');
                h.innerHTML = '<span style="font-size:0.55rem;font-weight:900;">R3</span>';
                h.title = 'Barramento GND Col 23: Perna Inferior do Resistor 3 conectada ao Terra (0V)';
            } else {
                h.style.borderColor = '#0284C7';
                h.style.background = '#0F172A';
                h.innerText = '-';
                h.title = `Barramento Azul (-) GND Coluna ${c}`;
            }

            h.onclick = () => lab_vguide_selectHole(c, 'GND', 'rail');
            botHolesEl.appendChild(h);
        }
    }

    // Constrói Colunas A-E (Bloco Superior, Colunas 8 a 24)
    topGridEl.innerHTML = '';
    for (let c = 8; c <= 24; c++) {
        const colDiv = document.createElement('div');
        colDiv.className = 'vg-col-item';

        // Tag de papel funcional da coluna acima do número
        const rolePill = document.createElement('div');
        rolePill.className = 'vg-col-role-pill';
        if (c === 10) { rolePill.style.background = '#EF4444'; rolePill.style.color = 'white'; rolePill.innerText = 'LED Verm (+)'; }
        else if (c === 11) { rolePill.style.background = '#10B981'; rolePill.style.color = 'white'; rolePill.innerText = 'LED (-) & R1'; }
        else if (c === 16) { rolePill.style.background = '#F59E0B'; rolePill.style.color = '#0F172A'; rolePill.innerText = 'LED Amar (+)'; }
        else if (c === 17) { rolePill.style.background = '#10B981'; rolePill.style.color = 'white'; rolePill.innerText = 'LED (-) & R2'; }
        else if (c === 22) { rolePill.style.background = '#059669'; rolePill.style.color = 'white'; rolePill.innerText = 'LED Verd (+)'; }
        else if (c === 23) { rolePill.style.background = '#10B981'; rolePill.style.color = 'white'; rolePill.innerText = 'LED (-) & R3'; }
        else { rolePill.style.background = '#1E293B'; rolePill.style.color = '#64748B'; rolePill.style.border = '1px solid #334155'; rolePill.innerText = 'Livre'; }
        colDiv.appendChild(rolePill);

        const header = document.createElement('div');
        header.className = 'vg-col-header-num';
        header.innerText = c;
        if (c === 10) { header.style.color = '#EF4444'; header.title = '🔴 Coluna 10: Pino 13 + Ânodo do LED Vermelho'; }
        else if (c === 11) { header.style.color = '#10B981'; header.title = '🛡️ Coluna 11: Cátodo + Resistor 1'; }
        else if (c === 16) { header.style.color = '#F59E0B'; header.title = '🟡 Coluna 16: Pino 12 + Ânodo do LED Amarelo'; }
        else if (c === 17) { header.style.color = '#10B981'; header.title = '🛡️ Coluna 17: Cátodo + Resistor 2'; }
        else if (c === 22) { header.style.color = '#34D399'; header.title = '🟢 Coluna 22: Pino 11 + Ânodo do LED Verde'; }
        else if (c === 23) { header.style.color = '#10B981'; header.title = '🛡️ Coluna 23: Cátodo + Resistor 3'; }
        colDiv.appendChild(header);

        const strip = document.createElement('div');
        strip.className = 'vg-metal-strip vg-strip-top';
        strip.id = `vg_strip_top_${c}`;
        colDiv.appendChild(strip);

        ['A', 'B', 'C', 'D', 'E'].forEach(r => {
            const hole = document.createElement('div');
            hole.className = 'vg-hole-cell';
            hole.id = `vg_hole_top_${r}_${c}`;
            hole.dataset.col = c;
            hole.dataset.row = r;
            hole.dataset.side = 'top';

            // Identificação Visual Específica por Letra e Coluna do Semáforo
            if (c === 10 && r === 'A') {
                hole.classList.add('pin-jumper', 'pin-jumper-red');
                hole.innerHTML = '<span style="font-size:0.55rem;font-weight:900;">D13</span>';
                hole.title = 'Furo 10A: Fio Jumper Digital 13 (+5V do Arduino)';
            } else if (c === 10 && r === 'C') {
                hole.classList.add('pin-led-anode', 'pin-led-anode-red');
                hole.innerHTML = '<span style="font-size:0.55rem;font-weight:900;line-height:1;">LED+</span><span style="font-size:0.5rem;opacity:0.85;">(C)</span>';
                hole.title = 'Furo 10C: Ânodo (+) Perna Longa do LED Vermelho';
            } else if (c === 11 && r === 'C') {
                hole.classList.add('pin-led-cathode', 'pin-led-cathode-red');
                hole.innerHTML = '<span style="font-size:0.55rem;font-weight:900;line-height:1;">LED-</span><span style="font-size:0.5rem;opacity:0.85;">(C)</span>';
                hole.title = 'Furo 11C: Cátodo (-) Perna Curta do LED Vermelho';
            } else if (c === 11 && r === 'D') {
                hole.classList.add('pin-resistor');
                hole.innerHTML = '<span style="font-size:0.55rem;font-weight:900;line-height:1;">300Ω</span><span style="font-size:0.5rem;opacity:0.85;">(D)</span>';
                hole.title = 'Furo 11D: Terminal Superior do Resistor de 300Ω (Protege o LED Vermelho)';
            } else if (c === 16 && r === 'A') {
                hole.classList.add('pin-jumper', 'pin-jumper-yel');
                hole.innerHTML = '<span style="font-size:0.55rem;font-weight:900;">D12</span>';
                hole.title = 'Furo 16A: Fio Jumper Digital 12 (Sinal Amarelo)';
            } else if (c === 16 && r === 'C') {
                hole.classList.add('pin-led-anode', 'pin-led-anode-yel');
                hole.innerHTML = '<span style="font-size:0.55rem;font-weight:900;line-height:1;">LED+</span><span style="font-size:0.5rem;opacity:0.85;">(C)</span>';
                hole.title = 'Furo 16C: Ânodo (+) Perna Longa do LED Amarelo';
            } else if (c === 17 && r === 'C') {
                hole.classList.add('pin-led-cathode', 'pin-led-cathode-yel');
                hole.innerHTML = '<span style="font-size:0.55rem;font-weight:900;line-height:1;">LED-</span><span style="font-size:0.5rem;opacity:0.85;">(C)</span>';
                hole.title = 'Furo 17C: Cátodo (-) Perna Curta do LED Amarelo';
            } else if (c === 17 && r === 'D') {
                hole.classList.add('pin-resistor');
                hole.innerHTML = '<span style="font-size:0.55rem;font-weight:900;line-height:1;">300Ω</span><span style="font-size:0.5rem;opacity:0.85;">(D)</span>';
                hole.title = 'Furo 17D: Terminal Superior do Resistor de 300Ω (Amarelo)';
            } else if (c === 22 && r === 'A') {
                hole.classList.add('pin-jumper', 'pin-jumper-gre');
                hole.innerHTML = '<span style="font-size:0.55rem;font-weight:900;">D11</span>';
                hole.title = 'Furo 22A: Fio Jumper Digital 11 (Sinal Verde)';
            } else if (c === 22 && r === 'C') {
                hole.classList.add('pin-led-anode', 'pin-led-anode-gre');
                hole.innerHTML = '<span style="font-size:0.55rem;font-weight:900;line-height:1;">LED+</span><span style="font-size:0.5rem;opacity:0.85;">(C)</span>';
                hole.title = 'Furo 22C: Ânodo (+) Perna Longa do LED Verde';
            } else if (c === 23 && r === 'C') {
                hole.classList.add('pin-led-cathode', 'pin-led-cathode-gre');
                hole.innerHTML = '<span style="font-size:0.55rem;font-weight:900;line-height:1;">LED-</span><span style="font-size:0.5rem;opacity:0.85;">(C)</span>';
                hole.title = 'Furo 23C: Cátodo (-) Perna Curta do LED Verde';
            } else if (c === 23 && r === 'D') {
                hole.classList.add('pin-resistor');
                hole.innerHTML = '<span style="font-size:0.55rem;font-weight:900;line-height:1;">300Ω</span><span style="font-size:0.5rem;opacity:0.85;">(D)</span>';
                hole.title = 'Furo 23D: Terminal Superior do Resistor de 300Ω (Verde)';
            } else {
                hole.innerText = `${r}`;
                hole.title = `Furo ${r}${c} (Coluna ${c}, Linha ${r}) - Furo Livre`;
            }

            hole.onclick = () => lab_vguide_selectHole(c, r, 'top');
            colDiv.appendChild(hole);
        });

        topGridEl.appendChild(colDiv);
    }

    // Constrói Colunas F-J (Bloco Inferior, Colunas 8 a 24)
    botGridEl.innerHTML = '';
    for (let c = 8; c <= 24; c++) {
        const colDiv = document.createElement('div');
        colDiv.className = 'vg-col-item';

        const strip = document.createElement('div');
        strip.className = 'vg-metal-strip vg-strip-bot';
        strip.id = `vg_strip_bot_${c}`;
        colDiv.appendChild(strip);

        ['F', 'G', 'H', 'I', 'J'].forEach(r => {
            const hole = document.createElement('div');
            hole.className = 'vg-hole-cell';
            hole.id = `vg_hole_bot_${r}_${c}`;
            hole.dataset.col = c;
            hole.dataset.row = r;
            hole.dataset.side = 'bot';
            hole.innerText = `${r}`;
            hole.title = `Furo ${r}${c} (Coluna ${c}, Linha ${r}) - Bloco Inferior`;
            hole.onclick = () => lab_vguide_selectHole(c, r, 'bot');
            colDiv.appendChild(hole);
        });

        const footer = document.createElement('div');
        footer.className = 'vg-col-header-num';
        footer.style.marginTop = '6px';
        footer.innerText = c;
        colDiv.appendChild(footer);

        botGridEl.appendChild(colDiv);
    }

    // Seleciona por padrão o furo 10C (Ânodo do LED Vermelho)
    lab_vguide_selectHole(10, 'C', 'top', true);
}

/* Seleção e Inspeção de Furos no Modo Raio-X com Diagnóstico Cirúrgico */
function lab_vguide_selectHole(col, row, side, isSilent) {
    if (!isSilent) playSound('click');
    lab_vguide_selectedCol = col;
    lab_vguide_selectedRow = row;
    lab_vguide_selectedSide = side;

    document.querySelectorAll('.vg-hole-cell').forEach(h => {
        h.classList.remove('selected', 'lit');
    });
    document.querySelectorAll('.vg-metal-strip').forEach(s => s.classList.remove('active'));

    const strip = document.getElementById(`vg_strip_${side}_${col}`);
    if (strip) strip.classList.add('active');

    if (side === 'rail') {
        const h = document.querySelector(`.vg-hole-cell[data-col="${col}"][data-row="GND"]`);
        if (h) h.classList.add('selected');
    } else {
        const letters = (side === 'top') ? ['A', 'B', 'C', 'D', 'E'] : ['F', 'G', 'H', 'I', 'J'];
        letters.forEach(l => {
            const h = document.getElementById(`vg_hole_${side}_${l}_${col}`);
            if (h) {
                if (l === row) h.classList.add('selected');
                else h.classList.add('lit');
            }
        });
    }

    const holeTag = document.getElementById('vg_info_hole_tag');
    const blockTag = document.getElementById('vg_info_block_tag');
    const stripTag = document.getElementById('vg_info_strip_tag');
    const descBox = document.getElementById('vg_info_desc_box');
    const warnBox = document.getElementById('vg_info_warning_box');

    if (side === 'rail') {
        if (holeTag) holeTag.innerText = `Barramento Azul (-) GND (Coluna ${col})`;
        if (blockTag) { blockTag.innerText = 'Barramento Inferior GND'; blockTag.style.color = '#38BDF8'; }
        if (stripTag) { stripTag.innerText = 'Trilho Horizontal Contínuo (0V Terra)'; }

        if (descBox && warnBox) {
            let resTxt = '';
            if (col === 11) resTxt = 'Aqui se conecta o terminal inferior do <b>Resistor 1 (do LED Vermelho)</b>.';
            else if (col === 17) resTxt = 'Aqui se conecta o terminal inferior do <b>Resistor 2 (do LED Amarelo)</b>.';
            else if (col === 23) resTxt = 'Aqui se conecta o terminal inferior do <b>Resistor 3 (do LED Verde)</b>.';
            else resTxt = 'Qualquer componente que precise voltar para o Terra pode ser encaixado aqui.';

            descBox.innerHTML = `
                <div style="background:#0369A1;color:white;display:inline-block;padding:3px 10px;border-radius:8px;font-weight:900;margin-bottom:8px;font-size:0.85rem;">
                    🔵 BARRAMENTO DE RETORNO / TERRA (GND)
                </div><br>
                <b>O que este furo faz:</b> Este furo faz parte da barra horizontal azul de GND. ${resTxt}
                <br><b>Caminho elétrico:</b> A barra inteira está unida de ponta a ponta na horizontal. Um cabo jumper preto liga esse barramento ao pino <b>GND</b> do Arduino para fechar o circuito completo!
            `;
            warnBox.innerHTML = `<b>Importante:</b> O barramento corre na HORIZONTAL, diferente das colunas do meio que são verticais de 5 furos!`;
        }
        return;
    }

    if (holeTag) holeTag.innerText = `Furo ${row}${col} (Coluna ${col}, Linha ${row})`;
    if (blockTag) {
        blockTag.innerText = (side === 'top') ? 'Superior (A-E)' : 'Inferior (F-J)';
        blockTag.style.color = (side === 'top') ? '#38BDF8' : '#F59E0B';
    }
    if (stripTag) {
        const range = (side === 'top') ? `${col}A a ${col}E` : `${col}F a ${col}J`;
        stripTag.innerText = `Trilho de Cobre ${range} Ativo!`;
    }

    if (descBox && warnBox) {
        if (side === 'top') {
            if (col === 10) {
                if (row === 'C') {
                    descBox.innerHTML = `
                        <div style="background:#DC2626;color:white;display:inline-block;padding:3px 10px;border-radius:8px;font-weight:900;margin-bottom:8px;font-size:0.85rem;">
                            🔴 COMPONENTE: ÂNODO (+) DO LED VERMELHO (PERNA LONGA)
                        </div><br>
                        <b>O que vai aqui na linha C:</b> Aqui você espeta a <b>PERNA LONGA (Ânodo +)</b> do LED Vermelho!
                        <br><b>De onde vem a energia?</b> O fio jumper vermelho entra no <code>10A</code>. Como os furos <code>10A</code> e <code>10C</code> estão soldados no mesmo trilho metálico por baixo do plástico, a corrente viaja pela lâmina e sobe direto para a perna longa do LED!
                        <br><b>E a outra perna?</b> A perna curta vai para o furo <code>11C</code> na coluna ao lado.
                    `;
                    warnBox.innerHTML = `<b>Atenção:</b> NUNCA coloque a perna curta na coluna 10! Ela precisa ir para a coluna 11 para o LED acender!`;
                } else if (row === 'A') {
                    descBox.innerHTML = `
                        <div style="background:#B91C1C;color:white;display:inline-block;padding:3px 10px;border-radius:8px;font-weight:900;margin-bottom:8px;font-size:0.85rem;">
                            🔌 ENTRADA: JUMPER DIGITAL 13 (SINAL DO ARDUINO)
                        </div><br>
                        <b>O que vai aqui na linha A:</b> O fio jumper macho que vem do pino <b>Digital 13</b> do Arduino UNO.
                        <br><b>Fluxo de Corrente:</b> Quando o código do Arduino executa <code>digitalWrite(13, HIGH);</code>, este furo recebe +5V. A corrente desce pela lâmina da coluna 10 e chega no <code>10C</code> onde está o LED!
                    `;
                    warnBox.innerHTML = `<b>Dica:</b> Use um fio jumper vermelho para indicar o sinal do semáforo vermelho!`;
                } else {
                    descBox.innerHTML = `
                        <b style="color:#EF4444;">Coluna 10 (Furo ${row}10):</b> Este furo está na mesma lâmina de bronze de <code>10A</code> (Jumper D13) e <code>10C</code> (Ânodo LED).
                        <br>Ele está <b>eletricamente ativo</b> com o sinal do LED Vermelho, disponível como furo de teste ou expansão!
                    `;
                    warnBox.innerHTML = `<b>Lembrete:</b> Todos os furos 10A, 10B, 10C, 10D e 10E são o mesmo condutor elétrico!`;
                }
            } else if (col === 11) {
                if (row === 'C') {
                    descBox.innerHTML = `
                        <div style="background:#991B1B;color:#FECACA;display:inline-block;padding:3px 10px;border-radius:8px;font-weight:900;margin-bottom:8px;font-size:0.85rem;">
                            🔴 COMPONENTE: CÁTODO (-) DO LED VERMELHO (PERNA CURTA)
                        </div><br>
                        <b>O que vai aqui na linha C:</b> Aqui você espeta a <b>PERNA CURTA (Cátodo -)</b> do LED Vermelho!
                        <br><b>Para onde vai a corrente?</b> A corrente que passou pelo bulbo do LED sai pelo <code>11C</code>, desce pela lâmina de cobre da coluna 11 e entra no furo <code>11D</code>, onde o resistor de 300Ω está esperando por ela!
                    `;
                    warnBox.innerHTML = `<b>Ponte Sem Solda:</b> A coluna 11 atua como uma ponte invisível que une o LED ao Resistor sem você precisar soldar!`;
                } else if (row === 'D') {
                    descBox.innerHTML = `
                        <div style="background:#78350F;color:#FDE68A;display:inline-block;padding:3px 10px;border-radius:8px;font-weight:900;margin-bottom:8px;font-size:0.85rem;">
                            🛡️ RESISTOR: TERMINAL 1 DO RESISTOR DE 300Ω (LARANJA, PRETO, MARROM)
                        </div><br>
                        <b>O que vai aqui na linha D:</b> Uma das pernas do <b>Resistor de 300Ω</b>.
                        <br><b>O que ele faz:</b> Ele freia a corrente para ~15.3 mA para proteger o LED de queimar.
                        <br><b>Onde vai a outra perna do resistor?</b> Desce e encaixa no <b>Barramento Azul (-) GND</b> logo abaixo!
                    `;
                    warnBox.innerHTML = `<b>Trilha Completa:</b> 10A (D13) ➔ 10C (Ânodo+) ➔ [LED] ➔ 11C (Cátodo-) ➔ 11D (Resistor) ➔ Barramento GND (-)`;
                } else {
                    descBox.innerHTML = `
                        <b style="color:#10B981;">Coluna 11 (Furo ${row}11):</b> Furo livre da lâmina de retorno do LED Vermelho. Está interligado com <code>11C</code> (Cátodo) e <code>11D</code> (Resistor 1).
                    `;
                    warnBox.innerHTML = `<b>Segurança:</b> Nunca ligue o pino do Arduino direto nesta coluna, ela deve passar pelo resistor antes de ir ao GND!`;
                }
            } else if (col === 16) {
                if (row === 'C') {
                    descBox.innerHTML = `
                        <div style="background:#D97706;color:white;display:inline-block;padding:3px 10px;border-radius:8px;font-weight:900;margin-bottom:8px;font-size:0.85rem;">
                            🟡 COMPONENTE: ÂNODO (+) DO LED AMARELO (PERNA LONGA)
                        </div><br>
                        <b>O que vai aqui na linha C:</b> A <b>PERNA LONGA (Ânodo +)</b> do LED Amarelo.
                        <br><b>Alimentação:</b> Recebe +5V do pino <b>Digital 12</b> do Arduino que entra no furo <code>16A</code>.
                    `;
                    warnBox.innerHTML = `<b>Próximo Passo:</b> A perna curta do LED Amarelo vai para o furo 17C na coluna vizinha!`;
                } else if (row === 'A') {
                    descBox.innerHTML = `
                        <div style="background:#92400E;color:#FEF3C7;display:inline-block;padding:3px 10px;border-radius:8px;font-weight:900;margin-bottom:8px;font-size:0.85rem;">
                            🔌 ENTRADA: JUMPER DIGITAL 12 (SINAL AMARELO)
                        </div><br>
                        <b>O que vai aqui:</b> Fio jumper vindo do pino <b>Digital 12</b> do Arduino UNO até o <code>16A</code>.
                    `;
                    warnBox.innerHTML = `<b>Dica:</b> Use um fio amarelo para combinar com o sinal de atenção do semáforo!`;
                } else {
                    descBox.innerHTML = `<b>Coluna 16 (Furo ${row}16):</b> Furo da coluna do LED Amarelo (unido com 16A e 16C).`;
                    warnBox.innerHTML = `<b>Isolamento:</b> Esta coluna é 100% independente da coluna 10 e da coluna 22.`;
                }
            } else if (col === 17) {
                if (row === 'C') {
                    descBox.innerHTML = `
                        <div style="background:#78350F;color:#FEF3C7;display:inline-block;padding:3px 10px;border-radius:8px;font-weight:900;margin-bottom:8px;font-size:0.85rem;">
                            🟡 COMPONENTE: CÁTODO (-) DO LED AMARELO (PERNA CURTA)
                        </div><br>
                        <b>O que vai aqui na linha C:</b> A <b>PERNA CURTA (Cátodo -)</b> do LED Amarelo.
                        <br>Entrega a corrente para o <b>Resistor 2 no furo 17D</b>.
                    `;
                    warnBox.innerHTML = `<b>Conexão Segura:</b> Liga o LED Amarelo ao segundo resistor de 300Ω.`;
                } else if (row === 'D') {
                    descBox.innerHTML = `
                        <div style="background:#78350F;color:#FDE68A;display:inline-block;padding:3px 10px;border-radius:8px;font-weight:900;margin-bottom:8px;font-size:0.85rem;">
                            🛡️ RESISTOR: TERMINAL 1 DO RESISTOR 2 (300Ω)
                        </div><br>
                        <b>O que vai aqui:</b> Perna superior do segundo Resistor de 300Ω. A outra perna vai no <b>Barramento Azul GND</b>.
                    `;
                    warnBox.innerHTML = `<b>Proteção:</b> Garante que o LED Amarelo opere na corrente ideal de ~15.3 mA.`;
                } else {
                    descBox.innerHTML = `<b>Coluna 17 (Furo ${row}17):</b> Furo livre da ponte do LED Amarelo para o resistor 2.`;
                    warnBox.innerHTML = `<b>Mesmo Condutor:</b> Todos os furos 17A a 17E estão no mesmo contato elétrico.`;
                }
            } else if (col === 22) {
                if (row === 'C') {
                    descBox.innerHTML = `
                        <div style="background:#059669;color:white;display:inline-block;padding:3px 10px;border-radius:8px;font-weight:900;margin-bottom:8px;font-size:0.85rem;">
                            🟢 COMPONENTE: ÂNODO (+) DO LED VERDE (PERNA LONGA)
                        </div><br>
                        <b>O que vai aqui na linha C:</b> A <b>PERNA LONGA (Ânodo +)</b> do LED Verde.
                        <br><b>Alimentação:</b> Recebe +5V do pino <b>Digital 11</b> do Arduino que entra no furo <code>22A</code>.
                    `;
                    warnBox.innerHTML = `<b>Próximo Passo:</b> A perna curta do LED Verde vai para o furo 23C na coluna vizinha!`;
                } else if (row === 'A') {
                    descBox.innerHTML = `
                        <div style="background:#065F46;color:#A7F3D0;display:inline-block;padding:3px 10px;border-radius:8px;font-weight:900;margin-bottom:8px;font-size:0.85rem;">
                            🔌 ENTRADA: JUMPER DIGITAL 11 (SINAL VERDE)
                        </div><br>
                        <b>O que vai aqui:</b> Fio jumper vindo do pino <b>Digital 11</b> do Arduino UNO até o <code>22A</code>.
                    `;
                    warnBox.innerHTML = `<b>Dica:</b> Use um fio verde para combinar com o sinal de siga do semáforo!`;
                } else {
                    descBox.innerHTML = `<b>Coluna 22 (Furo ${row}22):</b> Furo da coluna do LED Verde (unido com 22A e 22C).`;
                    warnBox.innerHTML = `<b>Isolamento:</b> Totalmente separado das colunas 10 e 16!`;
                }
            } else if (col === 23) {
                if (row === 'C') {
                    descBox.innerHTML = `
                        <div style="background:#064E3B;color:#A7F3D0;display:inline-block;padding:3px 10px;border-radius:8px;font-weight:900;margin-bottom:8px;font-size:0.85rem;">
                            🟢 COMPONENTE: CÁTODO (-) DO LED VERDE (PERNA CURTA)
                        </div><br>
                        <b>O que vai aqui na linha C:</b> A <b>PERNA CURTA (Cátodo -)</b> do LED Verde.
                        <br>Entrega a corrente para o <b>Resistor 3 no furo 23D</b>.
                    `;
                    warnBox.innerHTML = `<b>Conexão Segura:</b> Liga o LED Verde ao terceiro resistor de 300Ω.`;
                } else if (row === 'D') {
                    descBox.innerHTML = `
                        <div style="background:#78350F;color:#FDE68A;display:inline-block;padding:3px 10px;border-radius:8px;font-weight:900;margin-bottom:8px;font-size:0.85rem;">
                            🛡️ RESISTOR: TERMINAL 1 DO RESISTOR 3 (300Ω)
                        </div><br>
                        <b>O que vai aqui:</b> Perna superior do terceiro Resistor de 300Ω. A outra perna vai no <b>Barramento Azul GND</b>.
                    `;
                    warnBox.innerHTML = `<b>Trilha Completa do Verde:</b> 22A (D11) ➔ 22C (Ânodo+) ➔ [LED Verde] ➔ 23C (Cátodo-) ➔ 23D (Resistor 3) ➔ GND!`;
                } else {
                    descBox.innerHTML = `<b>Coluna 23 (Furo ${row}23):</b> Furo livre da ponte do LED Verde para o resistor 3.`;
                    warnBox.innerHTML = `<b>Circuito Completo:</b> Fecha o trio de semáforos perfeitamente!`;
                }
            } else {
                descBox.innerHTML = `
                    <b>Coluna ${col} (Linhas A a E):</b> Todos os 5 furos desta coluna estão interligados pela presilha metálica dourada por baixo.
                    <br>Se você conectar 2 ou mais componentes nos furos <code>${col}A</code> até <code>${col}E</code>, eles estarão no <b>mesmo nó de circuito</b>.
                `;
                warnBox.innerHTML = `<b>Aviso:</b> O lado inferior (<code>${col}F</code> a <code>${col}J</code>) continua 100% isolado pela calha central!`;
            }
        } else {
            descBox.innerHTML = `
                <b style="color:#F59E0B;">Bloco Inferior (Linhas F a J da Coluna ${col}):</b><br>
                Os furos <code>${col}F</code>, <code>${col}G</code>, <code>${col}H</code>, <code>${col}I</code> e <code>${col}J</code> estão conectados entre si por uma barra metálica própria.
                <br>Porém, eles <b>NÃO têm contato</b> com o lado A-E!
            `;
            warnBox.innerHTML = `<b>Calha Central Isolante:</b> O fosso no meio foi desenhado exatamente para dividir a placa em duas metades independentes. Para passar energia de A-E para F-J, você precisa usar um jumper ponte ou um componente atravessando o meio!`;
        }
    }
}

function lab_vguide_quickSelect(col, row, side) {
    lab_vguide_selectHole(col, row, side);
}

/* Teste Dinâmico de Comparação do LED (Certo vs Errado) */
function lab_vguide_testLed(isCorrect) {
    if (isCorrect) {
        playSound('success');
        const glow = document.getElementById('vg_correct_led_glow');
        const bulb = document.getElementById('vg_correct_led_bulb');
        const arrow = document.getElementById('vg_arrow_correct');
        const btn = document.getElementById('vg_btn_test_good');

        if (glow) glow.style.display = 'block';
        if (bulb) {
            bulb.setAttribute('fill', '#EF4444');
            bulb.classList.add('vg-led-glow-fx');
        }
        if (arrow) arrow.style.display = 'block';
        if (btn) btn.innerHTML = '🎉 LED Aceso com Sucesso! (15.3 mA seguros)';

        setTimeout(() => {
            if (glow) glow.style.display = 'none';
            if (bulb) {
                bulb.setAttribute('fill', '#DC2626');
                bulb.classList.remove('vg-led-glow-fx');
            }
            if (arrow) arrow.style.display = 'none';
            if (btn) btn.innerHTML = '<i class="fa-solid fa-bolt"></i> Testar Energia: Ligar LED Correto!';
        }, 3200);

    } else {
        playSound('error');
        const alertBox = document.getElementById('vg_short_alert');
        const bulb = document.getElementById('vg_wrong_led_bulb');
        const btn = document.getElementById('vg_btn_test_bad');

        if (alertBox) alertBox.style.display = 'block';
        if (bulb) bulb.setAttribute('fill', '#1E293B');
        if (btn) btn.innerHTML = '❌ CURTO! A corrente ignorou o LED!';

        setTimeout(() => {
            if (alertBox) alertBox.style.display = 'none';
            if (bulb) bulb.setAttribute('fill', '#475569');
            if (btn) btn.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> Tentar Ligar no Jeito Errado';
        }, 3200);
    }
}

/* Mini Desafio Interativo de Montagem Passo a Passo */
function lab_vguide_miniStep(stepNum) {
    playSound('step');
    lab_vguide_miniCompleted[stepNum] = true;

    const btn = document.getElementById(`vg_mini_btn_${stepNum}`);
    if (btn) {
        btn.classList.add('active');
        btn.style.background = '#059669';
        btn.style.borderColor = '#10B981';
        btn.style.color = '#FFFFFF';
    }

    if (stepNum === 1) {
        const el = document.getElementById('vg_dyn_jumper_red');
        if (el) el.style.display = 'block';
    } else if (stepNum === 2) {
        const el = document.getElementById('vg_dyn_led');
        if (el) el.style.display = 'block';
    } else if (stepNum === 3) {
        const el = document.getElementById('vg_dyn_resistor');
        if (el) el.style.display = 'block';
    } else if (stepNum === 4) {
        const el = document.getElementById('vg_dyn_jumper_gnd');
        if (el) el.style.display = 'block';
    }

    const allDone = lab_vguide_miniCompleted[1] && lab_vguide_miniCompleted[2] && lab_vguide_miniCompleted[3] && lab_vguide_miniCompleted[4];
    const fireBtn = document.getElementById('vg_btn_fire_circuit');
    const msg = document.getElementById('vg_mini_status_msg');

    if (allDone) {
        playSound('success');
        if (fireBtn) {
            fireBtn.disabled = false;
            fireBtn.style.background = 'linear-gradient(135deg, #10B981, #059669)';
            fireBtn.style.color = 'white';
            fireBtn.style.cursor = 'pointer';
            fireBtn.style.boxShadow = '0 0 20px rgba(16,185,129,0.6)';
        }
        if (msg) {
            msg.style.color = '#34D399';
            msg.innerHTML = '🎉 Todos os 4 componentes conectados! Clique no botão verde para ACENDER O LED!';
        }
    } else {
        if (msg) {
            const rem = 4 - Object.values(lab_vguide_miniCompleted).filter(Boolean).length;
            msg.innerText = `Muito bem! Faltam ${rem} passo(s) para fechar o circuito!`;
        }
    }
}

function lab_vguide_testMiniCircuit() {
    playSound('success');
    if (typeof triggerConfetti === 'function') triggerConfetti(3000);

    const glow = document.getElementById('vg_dyn_led_glow');
    const body = document.getElementById('vg_dyn_led_body');
    const msg = document.getElementById('vg_mini_status_msg');

    if (glow) glow.style.display = 'block';
    if (body) {
        body.setAttribute('fill', '#EF4444');
        body.classList.add('vg-led-glow-fx');
    }

    if (msg) {
        msg.style.color = '#FDE68A';
        msg.innerHTML = '🌟 <b>CIRCUITO 100% FECHADO E FUNCIONANDO!</b> Corrente segura de 15.3 mA fluindo pelo semáforo!';
    }
}

function lab_vguide_resetMini() {
    playSound('click');
    lab_vguide_miniCompleted = { 1: false, 2: false, 3: false, 4: false };

    for (let s = 1; s <= 4; s++) {
        const btn = document.getElementById(`vg_mini_btn_${s}`);
        if (btn) {
            btn.classList.remove('active');
            btn.style.background = '#0F172A';
            btn.style.borderColor = '#334155';
            btn.style.color = '#94A3B8';
        }
    }

    ['vg_dyn_jumper_red', 'vg_dyn_led', 'vg_dyn_resistor', 'vg_dyn_jumper_gnd'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = 'none';
    });

    const glow = document.getElementById('vg_dyn_led_glow');
    const body = document.getElementById('vg_dyn_led_body');
    if (glow) glow.style.display = 'none';
    if (body) {
        body.setAttribute('fill', '#DC2626');
        body.classList.remove('vg-led-glow-fx');
    }

    const fireBtn = document.getElementById('vg_btn_fire_circuit');
    if (fireBtn) {
        fireBtn.disabled = true;
        fireBtn.style.background = '#334155';
        fireBtn.style.color = '#94A3B8';
        fireBtn.style.cursor = 'not-allowed';
        fireBtn.style.boxShadow = 'none';
    }

    const msg = document.getElementById('vg_mini_status_msg');
    if (msg) {
        msg.style.color = '#94A3B8';
        msg.innerText = 'Complete os 4 passos clicando nos botões acima para destravar o botão de energia!';
    }
}

/* ==========================================================================
   MINI-GAME DA AULA 7: FUGA DO CURTO-CIRCUITO & MESTRE DOS CIRCUITOS
   ========================================================================== */
const LAB_MINIGAME_ROUNDS = [
    {
        tag: '🛡️ Rodada 1: O Resistor Protetor',
        question: 'O robô quer ligar o LED diretamente no pino 5V do Arduino sem nenhum resistor para o LED brilhar "mais forte". O que vai acontecer com o LED?',
        previewHtml: `
            <div style="display:flex;align-items:center;gap:18px;justify-content:center;flex-wrap:wrap;">
                <div style="background:#1E293B;border:2px solid #EF4444;border-radius:12px;padding:10px 16px;color:#FCA5A5;font-weight:bold;font-size:0.95rem;">
                    ⚠️ +5V Direto ➔ [LED] ➔ GND (SEM RESISTOR!)
                </div>
                <div style="font-size:2.2rem;animation:pulse 1s infinite;">💥⚡</div>
            </div>
        `,
        options: [
            { text: 'A) O LED vai receber corrente em excesso e vai QUEIMAR (estourar)! Precisamos do resistor de 300Ω!', correct: true },
            { text: 'B) Nada demais, o LED aguenta qualquer quantidade de corrente sem queimar.', correct: false },
            { text: 'C) O LED vai mudar de cor sozinho para roxo neon.', correct: false }
        ],
        explanation: '🎉 <b>Corretíssimo!</b> O semicondutor do LED é muito sensível. Sem a resistência de ~300Ω limitando o fluxo em ~15.3 mA, a corrente sobe rápido demais e queima o LED!'
    },
    {
        tag: '🤔 Rodada 2: Onde colocar o Resistor?',
        question: 'Dúvida de Mestre: O resistor de 300Ω precisa obrigatoriamente ficar ANTES do positivo (+5V) para proteger o LED?',
        previewHtml: `
            <div style="display:flex;align-items:center;gap:14px;justify-content:center;flex-wrap:wrap;font-size:0.9rem;font-weight:bold;">
                <div style="background:#0F172A;border:1px solid #38BDF8;padding:8px 12px;border-radius:10px;color:#38BDF8;">Opção 1: (+5V) ➔ Resistor ➔ LED ➔ GND</div>
                <span style="color:#FBBF24;font-size:1.1rem;">OU</span>
                <div style="background:#0F172A;border:1px solid #10B981;padding:8px 12px;border-radius:10px;color:#A7F3D0;">Opção 2: (+5V) ➔ LED ➔ Resistor ➔ GND</div>
            </div>
        `,
        options: [
            { text: 'A) SIM, ele só funciona se estiver antes do polo positivo (+5V).', correct: false },
            { text: 'B) NÃO! Em circuito em série, tanto faz ficar no positivo (+) quanto no negativo (-) / GND: a corrente é a mesma e a proteção é idêntica!', correct: true },
            { text: 'C) Ele só funciona se for colocado de ponta-cabeça.', correct: false }
        ],
        explanation: '🎉 <b>Exatamente!</b> Em um circuito em série fechado, a corrente elétrica é idêntica em toda a volta (como água num cano em círculo). O resistor limita a corrente do mesmo jeito no positivo ou no negativo!'
    },
    {
        tag: '🚦 Rodada 3: O Segredo das Pernas do LED',
        question: 'Você montou o semáforo, ligou a energia, mas o LED Vermelho não acendeu! Ao inspecionar, viu que a perna CURTA está no 5V e a perna LONGA está no resistor/GND. Como resolver?',
        previewHtml: `
            <div style="display:flex;align-items:center;gap:16px;justify-content:center;flex-wrap:wrap;">
                <div style="font-size:2.4rem;">🔴</div>
                <div style="text-align:left;font-size:0.9rem;line-height:1.5;">
                    <span style="color:#A7F3D0;font-weight:bold;">• Perna LONGA = Ânodo (+)</span><br>
                    <span style="color:#FCA5A5;font-weight:bold;">• Perna CURTA chanfrada = Cátodo (-)</span>
                </div>
            </div>
        `,
        options: [
            { text: 'A) Inverter o LED! A perna LONGA (Ânodo +) deve receber os 5V e a perna CURTA (Cátodo -) vai para o resistor/GND!', correct: true },
            { text: 'B) Dar uma batidinha com o dedo na protoboard para o LED acordar.', correct: false },
            { text: 'C) Os LEDs só acendem se a luz da sala estiver 100% apagada.', correct: false }
        ],
        explanation: '🎉 <b>Perfeito!</b> O LED é um Diodo Emissor de Luz: ele possui sentido obrigatório (polaridade). A perna longa (Ânodo +) recebe o positivo e a curta (Cátodo -) o negativo!'
    },
    {
        tag: '🧱 Rodada 4: O Raio-X da Protoboard',
        question: 'O que acontece se um aluno encaixar as DUAS pernas do mesmo resistor nos furos 12A e 12B da mesma coluna da protoboard?',
        previewHtml: `
            <div style="display:flex;align-items:center;gap:10px;justify-content:center;background:#0F172A;padding:10px 18px;border-radius:12px;border:1px solid #F59E0B;">
                <span style="color:#FBBF24;font-size:1.1rem;font-weight:900;">Coluna 12:</span>
                <span style="background:#334155;color:#FDE68A;padding:4px 10px;border-radius:6px;font-family:monospace;font-size:0.85rem;">[Presilha dourada unindo A-B-C-D-E por baixo]</span>
            </div>
        `,
        options: [
            { text: 'A) Cria um curto-circuito no componente! Todos os 5 furos da mesma coluna já são o mesmo condutor por baixo!', correct: true },
            { text: 'B) Dobra o valor da resistência de 300Ω para 600Ω.', correct: false },
            { text: 'C) O resistor começa a tocar música.', correct: false }
        ],
        explanation: '🎉 <b>Show de bola!</b> Por baixo do plástico, os furos de A a E da mesma coluna estão unidos por uma lâmina metálica contínua. Para ligar qualquer componente, cada perna deve ficar em uma coluna diferente!'
    },
    {
        tag: '🤖 Rodada 5: Os Jumpers no Arduino UNO',
        question: 'Para o código C++ controlar o Semáforo e fazer o Vermelho, depois o Amarelo e depois o Verde acenderem no tempo exato, como ligamos os fios no Arduino?',
        previewHtml: `
            <div style="display:flex;align-items:center;gap:12px;justify-content:center;flex-wrap:wrap;font-weight:bold;font-size:0.9rem;">
                <span style="color:#EF4444;background:#1E293B;padding:4px 10px;border-radius:8px;">🔴 Pino D13</span>
                <span style="color:#F59E0B;background:#1E293B;padding:4px 10px;border-radius:8px;">🟡 Pino D12</span>
                <span style="color:#10B981;background:#1E293B;padding:4px 10px;border-radius:8px;">🟢 Pino D11</span>
                <span style="color:#38BDF8;background:#1E293B;padding:4px 10px;border-radius:8px;">⚡ GND Comum</span>
            </div>
        `,
        options: [
            { text: 'A) Cada LED é ligado em um pino digital separado (13, 12 e 11) e todos compartilham o mesmo retorno no GND!', correct: true },
            { text: 'B) Juntamos os fios dos 3 LEDs embolados no mesmo pino digital 13.', correct: false },
            { text: 'C) Não usamos fios, a eletricidade se comunica por telepatia com o semáforo.', correct: false }
        ],
        explanation: '🎉 <b>Sensacional, Jovem Engenheiro(a) Maker!</b> Pinos separados permitem comandos independentes no código C++ (digitalWrite), e o barramento azul unifica o GND para fechar todos os circuitos!'
    }
];

let lab_mgame_round = 0;
let lab_mgame_score = 0;
let lab_mgame_lives = 3;
let lab_mgame_isLocked = false;

/* Inicialização do Mini-Game */
function lab_initMiniGame() {
    lab_mgame_round = 0;
    lab_mgame_score = 0;
    lab_mgame_lives = 3;
    lab_mgame_isLocked = false;
    lab_miniGame_renderRound();
}

function lab_miniGame_restart() {
    playSound('click');
    lab_initMiniGame();
}

/* Renderização da Rodada Ativa */
function lab_miniGame_renderRound() {
    const screenPlay = document.getElementById('mgame_screen_play');
    const screenResult = document.getElementById('mgame_screen_result');
    if (!screenPlay || !screenResult) return;

    screenPlay.style.display = 'block';
    screenResult.style.display = 'none';

    // Atualiza Placar e Vidas
    const scoreEl = document.getElementById('mgame_score_txt');
    const livesEl = document.getElementById('mgame_lives_box');
    const badgeEl = document.getElementById('mgame_round_badge');

    if (scoreEl) scoreEl.innerText = `${lab_mgame_score} Pontos`;
    if (livesEl) livesEl.innerHTML = '❤️'.repeat(Math.max(0, lab_mgame_lives)) + '🤍'.repeat(Math.max(0, 3 - lab_mgame_lives));
    if (badgeEl) badgeEl.innerText = `Rodada ${lab_mgame_round + 1} de ${LAB_MINIGAME_ROUNDS.length}`;

    const rData = LAB_MINIGAME_ROUNDS[lab_mgame_round];
    if (!rData) return;

    const tagEl = document.getElementById('mgame_scenario_tag');
    const qEl = document.getElementById('mgame_question_txt');
    const prevEl = document.getElementById('mgame_canvas_preview');
    const optsEl = document.getElementById('mgame_options_container');
    const fbEl = document.getElementById('mgame_round_feedback');

    if (tagEl) tagEl.innerText = rData.tag;
    if (qEl) qEl.innerText = rData.question;
    if (prevEl) prevEl.innerHTML = rData.previewHtml;
    if (fbEl) {
        fbEl.style.display = 'none';
        fbEl.innerHTML = '';
    }

    if (optsEl) {
        optsEl.innerHTML = '';
        rData.options.forEach((opt, idx) => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'lab-quiz-opt';
            btn.style.width = '100%';
            btn.style.textAlign = 'left';
            btn.style.padding = '14px 18px';
            btn.style.borderRadius = '14px';
            btn.style.fontSize = '0.96rem';
            btn.style.lineHeight = '1.5';
            btn.style.margin = '4px 0';
            btn.style.background = '#1E293B';
            btn.style.border = '2px solid #334155';
            btn.style.color = '#F1F5F9';
            btn.style.cursor = 'pointer';
            btn.style.transition = 'all 0.2s';
            btn.innerHTML = opt.text;
            btn.onclick = () => lab_miniGame_answer(lab_mgame_round, idx, opt.correct);
            optsEl.appendChild(btn);
        });
    }
}

/* Processamento de Resposta do Mini-Game */
function lab_miniGame_answer(roundIdx, optIdx, isCorrect) {
    if (lab_mgame_isLocked) return;

    const optsEl = document.getElementById('mgame_options_container');
    const fbEl = document.getElementById('mgame_round_feedback');
    const rData = LAB_MINIGAME_ROUNDS[roundIdx];

    const buttons = optsEl ? optsEl.querySelectorAll('button') : [];

    if (!isCorrect) {
        playSound('error');
        lab_mgame_lives--;
        const livesEl = document.getElementById('mgame_lives_box');
        if (livesEl) livesEl.innerHTML = '❤️'.repeat(Math.max(0, lab_mgame_lives)) + '🤍'.repeat(Math.max(0, 3 - lab_mgame_lives));

        if (buttons[optIdx]) {
            buttons[optIdx].style.borderColor = '#EF4444';
            buttons[optIdx].style.background = 'rgba(239,68,68,0.2)';
            buttons[optIdx].style.color = '#FCA5A5';
        }

        if (fbEl) {
            fbEl.style.display = 'block';
            fbEl.style.background = 'rgba(239,68,68,0.2)';
            fbEl.style.color = '#FCA5A5';
            fbEl.style.border = '1px solid #EF4444';
            fbEl.innerHTML = '❌ <b>Não foi dessa vez!</b> Pense com calma nos conceitos do circuito e tente outra opção!';
        }

        if (lab_mgame_lives <= 0) {
            lab_mgame_isLocked = true;
            setTimeout(() => {
                lab_miniGame_showGameOver();
                lab_mgame_isLocked = false;
            }, 1200);
        }
        return;
    }

    // Resposta Correta!
    playSound('success');
    lab_mgame_score += 100;
    const scoreEl = document.getElementById('mgame_score_txt');
    if (scoreEl) scoreEl.innerText = `${lab_mgame_score} Pontos`;

    buttons.forEach((btn, idx) => {
        btn.disabled = true;
        if (idx === optIdx) {
            btn.style.borderColor = '#10B981';
            btn.style.background = 'rgba(16,185,129,0.25)';
            btn.style.color = '#A7F3D0';
            btn.style.fontWeight = 'bold';
        } else {
            btn.style.opacity = '0.4';
        }
    });

    if (fbEl) {
        fbEl.style.display = 'block';
        fbEl.style.background = 'rgba(16,185,129,0.2)';
        fbEl.style.color = '#A7F3D0';
        fbEl.style.border = '1px solid #10B981';
        fbEl.innerHTML = rData.explanation;
    }

    lab_mgame_isLocked = true;

    if (roundIdx < LAB_MINIGAME_ROUNDS.length - 1) {
        setTimeout(() => {
            lab_mgame_round++;
            lab_miniGame_renderRound();
            lab_mgame_isLocked = false;
        }, 1800);
    } else {
        // Conclusão com Vitória das 5 Rodadas!
        setTimeout(() => {
            lab_miniGame_showVictory();
            lab_mgame_isLocked = false;
        }, 1400);
    }
}

/* Tela de Vitória do Mini-Game */
function lab_miniGame_showVictory() {
    playSound('success');
    if (typeof triggerConfetti === 'function') triggerConfetti(4500);

    const screenPlay = document.getElementById('mgame_screen_play');
    const screenResult = document.getElementById('mgame_screen_result');
    const iconEl = document.getElementById('mgame_result_icon');
    const titleEl = document.getElementById('mgame_result_title');
    const descEl = document.getElementById('mgame_result_desc');

    if (screenPlay) screenPlay.style.display = 'none';
    if (screenResult) screenResult.style.display = 'block';

    if (iconEl) iconEl.innerText = '🏆⚡';
    if (titleEl) titleEl.innerHTML = '<span style="color:#FBBF24;">Vitória Maker!</span> Mestre dos Circuitos!';
    if (descEl) {
        descEl.innerHTML = `
            Você acertou todas as 5 rodadas do mini-game e somou <b>${lab_mgame_score} Pontos</b>!<br>
            Você dominou o segredo dos <b>Resistores sem polaridade</b>, a regra do <b>LED (Ânodo/Cátodo)</b> e o funcionamento da <b>Protoboard</b>!<br>
            <span style="color:#34D399;font-weight:900;display:inline-block;margin-top:10px;">⭐ 3 Estrelas do Laboratório Conquistadas! ⭐</span>
        `;
    }

    // Persiste as 3 estrelas no localStorage
    try {
        localStorage.setItem('labmaker_levels', JSON.stringify([1, 2, 3]));
        localStorage.setItem('lab_minigame_won', 'true');
    } catch(e) {}

    lab_updateBadges();
    if (typeof updateHubProgress === 'function') updateHubProgress();
    if (typeof updateTrail === 'function') updateTrail();
}

/* Tela de Game Over */
function lab_miniGame_showGameOver() {
    playSound('error');
    const screenPlay = document.getElementById('mgame_screen_play');
    const screenResult = document.getElementById('mgame_screen_result');
    const iconEl = document.getElementById('mgame_result_icon');
    const titleEl = document.getElementById('mgame_result_title');
    const descEl = document.getElementById('mgame_result_desc');

    if (screenPlay) screenPlay.style.display = 'none';
    if (screenResult) screenResult.style.display = 'block';

    if (iconEl) iconEl.innerText = '💡';
    if (titleEl) titleEl.innerText = 'Quase lá, Maker!';
    if (descEl) {
        descEl.innerHTML = `
            Suas vidas acabaram, mas errar faz parte de todo grande cientista e engenheiro!<br>
            Revise as dicas de polaridade e resistores e tente novamente para conquistar suas 3 Estrelas!
        `;
    }
}

// Exportações globais para a plataforma
window.loadLabmaker = loadLabmaker;
window.lab_startMission = function(level) {
    if(typeof loadLabmaker === 'function') loadLabmaker();
    lab_switchGuideStep(5);
    if(window.makerLeaderboard) {
        window.makerLeaderboard.startTimer('labmaker', level);
    }
    playSound('click');
};
window.lab_switchGuideStep = lab_switchGuideStep;
window.lab_switchTab = lab_switchTab;
window.lab_answerStepChallenge = lab_answerStepChallenge;
window.lab_advanceNextStep = lab_advanceNextStep;
window.lab_validateBenchChallenge = lab_validateBenchChallenge;
window.lab_showToast = lab_showToast;
window.lab_unlockStep = lab_unlockStep;
window.lab_toggleVisualLabels = lab_toggleVisualLabels;
window.lab_inspectComponent = lab_inspectComponent;
window.lab_showBenchTooltip = lab_showBenchTooltip;
window.lab_updateTooltipPos = lab_updateTooltipPos;
window.lab_hideBenchTooltip = lab_hideBenchTooltip;
window.lab_unpinTooltip = lab_unpinTooltip;
window.lab_toggleUsbPower = lab_toggleUsbPower;
window.lab_togglePin = lab_togglePin;
window.lab_runTrafficSequence = lab_runTrafficSequence;
window.lab_completeMission = lab_completeMission;
window.lab_closeCelebrateModal = lab_closeCelebrateModal;
window.lab_vguide_init = lab_vguide_init;
window.lab_vguide_selectHole = lab_vguide_selectHole;
window.lab_vguide_quickSelect = lab_vguide_quickSelect;
window.lab_vguide_testLed = lab_vguide_testLed;
window.lab_vguide_miniStep = lab_vguide_miniStep;
window.lab_vguide_testMiniCircuit = lab_vguide_testMiniCircuit;
window.lab_vguide_resetMini = lab_vguide_resetMini;
window.lab_initMiniGame = lab_initMiniGame;
window.lab_miniGame_restart = lab_miniGame_restart;
window.lab_miniGame_answer = lab_miniGame_answer;
window.lab_carousel_goto = lab_carousel_goto;
window.lab_carousel_prev = lab_carousel_prev;
window.lab_carousel_next = lab_carousel_next;
window.lab_resetLevelProgress = lab_resetLevelProgress;

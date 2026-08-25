/* ==========================================================================
   AULA 1 — CAÇA AO TESOURO (ALGORITMOS E SEQUÊNCIAS)
   ========================================================================== */

    function loadTesouro() {
        const container = document.getElementById('tesouro-container');
        container.innerHTML = `
            <style>
                .tesouro-wrapper .board-wrap { position:relative; max-width:500px; margin:0 auto; }
                .tesouro-wrapper .board { display:grid; gap:3px; padding:8px; border-radius:22px; background:linear-gradient(180deg,#475569,#1E293B,#0F172A); border:3px solid #334155; box-shadow:0 12px 40px rgba(0,0,0,0.65), inset 0 0 60px rgba(0,0,0,0.4); position:relative; transition:background 0.5s; }
                .tesouro-wrapper .board.floor-0 { background:linear-gradient(180deg,#C2410C,#7C2D12); border-color:#F97316; }
                .tesouro-wrapper .board.floor-1 { background:linear-gradient(180deg,#16A34A,#14532D); border-color:#22C55E; }
                .tesouro-wrapper .board.floor-2 { background:linear-gradient(180deg,#3B82F6,#1E3A8A); border-color:#60A5FA; }
                .tesouro-wrapper .cell { background:rgba(30,41,59,0.75); border-radius:8px; display:flex; align-items:center; justify-content:center; border:2px solid rgba(51,65,85,0.7); transition:all 0.25s; aspect-ratio:1; min-height:44px; position:relative; overflow:hidden; cursor:default; }
                .tesouro-wrapper .cell:hover { border-color:rgba(56,189,248,0.5); box-shadow:inset 0 0 10px rgba(56,189,248,0.1); }
                
                /* Plataformas elevadas (células que formam a base de um andar superior) */
                .tesouro-wrapper .cell.platform { background:rgba(245,158,11,0.2); border-color:#F59E0B; border-style:dashed; }
                .tesouro-wrapper .cell.platform::after { content:''; position:absolute; top:3px; right:3px; width:6px; height:6px; border-radius:50%; background:#F59E0B; opacity:0.8; }

                /* Robô SVG */
                .tesouro-wrapper .cell.robot { background:rgba(254,240,138,0.2); border-color:#F59E0B; box-shadow:0 0 16px rgba(245,158,11,0.5); z-index:5; }
                .tesouro-wrapper .cell.robot .robot-svg { animation:robotIdle 1s ease-in-out infinite; filter:drop-shadow(0 0 6px rgba(245,158,11,0.6)); }
                .tesouro-wrapper .cell.robot.moving .robot-svg { animation:robotWalk 0.3s ease-in-out; }
                .tesouro-wrapper .cell.robot.crash { background:rgba(239,68,68,0.25); border-color:#EF4444; box-shadow:0 0 25px rgba(239,68,68,0.6); animation:t_shake 0.3s ease-in-out; }
                .tesouro-wrapper .cell.robot.crash .robot-svg { animation:robotCrash 0.4s ease-in-out; }
                .tesouro-wrapper .cell.robot.win { background:rgba(16,185,129,0.3); border-color:#10B981; box-shadow:0 0 30px rgba(16,185,129,0.7); }
                .tesouro-wrapper .cell.robot.win .robot-svg { animation:robotWin 0.5s ease-in-out infinite; }
                .tesouro-wrapper .cell.robot.climbing .robot-svg { animation:robotClimb 0.5s ease-in-out; }
                @keyframes t_shake { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-4px)} 40%{transform:translateX(4px)} 60%{transform:translateX(-3px)} 80%{transform:translateX(3px)} }
                @keyframes robotIdle { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-2px)} }
                @keyframes robotWalk { 0%{transform:translateX(-3px) rotate(-3deg)} 50%{transform:translateY(-3px)} 100%{transform:translateX(0) rotate(0)} }
                @keyframes robotCrash { 0%,100%{transform:translateX(0)} 20%,60%{transform:translateX(-5px)} 40%,80%{transform:translateX(5px)} }
                @keyframes robotWin { 0%,100%{transform:scale(1) rotate(0)} 25%{transform:scale(1.2) rotate(-10deg)} 75%{transform:scale(1.2) rotate(10deg)} }
                @keyframes robotClimb { 0%{transform:translateY(0) scale(1)} 40%{transform:translateY(-15px) scale(0.8)} 100%{transform:translateY(0) scale(1)} }

                /* Bloqueios: parede de tijolos */
                .tesouro-wrapper .cell.obstacle { background:repeating-linear-gradient(45deg,#334155,#334155 4px,#1E293B 4px,#1E293B 8px); border-color:#475569; }
                .tesouro-wrapper .cell.obstacle::after { content:'✖'; color:#EF4444; font-size:1.5rem; font-weight:900; text-shadow:0 0 10px rgba(239,68,68,0.9); line-height:1; z-index:1; }
                .tesouro-wrapper .cell.obstacle.path-block::after { content:''; }

                /* Tesouro no pedestal */
                .tesouro-wrapper .cell.treasure { background:rgba(245,158,11,0.18); border-color:#F59E0B; animation:treasureGlow 1.5s ease-in-out infinite; }
                .tesouro-wrapper .cell.treasure.elevated { border-color:#FCD34D; box-shadow:0 0 20px rgba(245,158,11,0.5), 0 8px 0 rgba(0,0,0,0.3); transform:translateY(-4px); }
                .tesouro-wrapper .cell.treasure.elevated::before { content:''; position:absolute; bottom:-8px; left:10%; width:80%; height:8px; background:linear-gradient(90deg,transparent,#92400E,transparent); border-radius:4px; z-index:0; }
                @keyframes treasureGlow { 0%,100%{box-shadow:0 0 12px rgba(245,158,11,0.3)} 50%{box-shadow:0 0 30px rgba(245,158,11,0.8),0 10px 0 rgba(0,0,0,0.3)} }

                /* Escada */
                .tesouro-wrapper .cell.ladder { background:linear-gradient(135deg,rgba(245,158,11,0.25),rgba(245,158,11,0.08)); border-color:#F59E0B; border-style:dashed; }
                .tesouro-wrapper .cell.ladder::after { content:'🪜'; position:absolute; font-size:1.8rem; opacity:0.95; filter:drop-shadow(0 2px 3px rgba(0,0,0,0.5)); z-index:2; }
                .tesouro-wrapper .cell.ladder.ladder-up::before { content:'⬆'; position:absolute; top:2px; right:3px; font-size:0.7rem; color:#34D399; z-index:3; animation:ladderPulse 1s infinite; }
                .tesouro-wrapper .cell.ladder.ladder-down::before { content:'⬇'; position:absolute; top:2px; right:3px; font-size:0.7rem; color:#EF4444; z-index:3; }
                @keyframes ladderPulse { 0%,100%{opacity:0.5} 50%{opacity:1} }

                /* Caminho solução */
                .tesouro-wrapper .cell.solution-path { background:rgba(56,189,248,0.22) !important; border-color:#38BDF8 !important; }
                .tesouro-wrapper .cell.solution-path::before { content:attr(data-step); position:absolute; font-size:0.7rem; font-weight:900; color:#38BDF8; top:2px; left:4px; z-index:5; }

                .tesouro-wrapper .controls { display:flex; gap:10px; justify-content:center; margin:14px 0; flex-wrap:wrap; }
                .tesouro-wrapper .btn { background:#475569; border:none; color:white; padding:12px 18px; border-radius:14px; font-size:1.5rem; border-bottom:5px solid #1E293B; cursor:pointer; min-width:56px; transition:0.1s; font-weight:900; }
                .tesouro-wrapper .btn:active { transform:translateY(4px); border-bottom-width:1px; }
                .tesouro-wrapper .btn.special { background:linear-gradient(135deg,#8B5CF6,#7C3AED); font-size:1rem; border-bottom-color:#5B21B6; }
                .tesouro-wrapper .code-area { background:#0F172A; border-radius:14px; min-height:46px; padding:10px; border:2px dashed #334155; display:flex; flex-wrap:wrap; gap:6px; align-items:center; }
                .tesouro-wrapper .code-slot { background:#1E293B; padding:4px 12px; border-radius:8px; color:#F59E0B; font-size:1.1rem; font-weight:900; }
                .tesouro-wrapper .actions { display:flex; gap:8px; margin-top:8px; }
                .tesouro-wrapper .btn-run { background:linear-gradient(135deg,#10B981,#059669); flex:2; border-bottom:4px solid #047857; font-size:1rem; }
                .tesouro-wrapper .btn-clear { background:#EF4444; flex:1; border-bottom:4px solid #991B1B; }
                .tesouro-wrapper .btn-undo { background:#F59E0B; flex:1; border-bottom:4px solid #B45309; color:#0F172A; }
                .tesouro-wrapper .level-bar { display:flex; gap:8px; justify-content:center; margin:8px 0; flex-wrap:wrap; }
                .tesouro-wrapper .level-btn { background:#334155; border:none; color:#94A3B8; padding:7px 18px; border-radius:30px; font-weight:900; cursor:pointer; transition:0.2s; }
                .tesouro-wrapper .level-btn.active { background:#F59E0B; color:#0F172A; box-shadow:0 0 15px rgba(245,158,11,0.4); }
                .tesouro-wrapper .level-btn.done { background:#065F46; color:#34D399; border-color:#10B981; }
                .tesouro-wrapper .modal { position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.85); display:flex; justify-content:center; align-items:center; z-index:999; opacity:0; pointer-events:none; transition:0.3s; }
                .tesouro-wrapper .modal.active { opacity:1; pointer-events:all; }
                .tesouro-wrapper .modal-box { background:#1E293B; padding:28px; border-radius:28px; max-width:400px; width:90%; text-align:center; border:3px solid #F59E0B; box-shadow:0 0 40px rgba(245,158,11,0.3); }
                .tesouro-wrapper .modal-icon { font-size:4rem; }
                .tesouro-wrapper .modal-title { font-family:'Fredoka One'; color:white; font-size:1.6rem; margin:8px 0; }
                .tesouro-wrapper .modal-text { color:#CBD5E1; margin:10px 0 18px; line-height:1.5; }
                .tesouro-wrapper .btn-modal { background:#38BDF8; border:none; padding:12px 30px; border-radius:50px; font-weight:900; cursor:pointer; color:#0F172A; font-size:1rem; }

                /* Código C++ colapsável + tooltips */
                .t-code-panel { background:#0F172A; border:2px solid #38BDF8; border-radius:16px; margin-top:12px; overflow:hidden; transition:0.3s; }
                .t-code-header { display:flex; justify-content:space-between; align-items:center; padding:10px 14px; cursor:pointer; background:#0F172A; }
                .t-code-header:hover { background:#1E293B; }
                .t-code-body { padding:12px 14px; border-top:1px solid #1E293B; }
                .t-code-body pre { margin:0; color:#E2E8F0; font-family:'Courier New',monospace; font-size:0.85rem; line-height:1.6; white-space:pre-wrap; overflow-x:auto; }
                .t-kw { position:relative; cursor:help; color:#F472B6; font-weight:bold; border-bottom:1px dashed #F472B6; }
                .t-kw-fn { color:#60A5FA; border-bottom:1px dashed #60A5FA; }
                .t-kw .t-tip { visibility:hidden; opacity:0; position:absolute; bottom:calc(100% + 6px); left:50%; transform:translateX(-50%); background:#1E3A5F; color:#BAE6FD; padding:6px 10px; border-radius:10px; font-size:0.78rem; white-space:nowrap; font-family:'Nunito',sans-serif; font-weight:800; border:1px solid #38BDF8; z-index:50; pointer-events:none; transition:opacity 0.15s; min-width:180px; text-align:center; }
                .t-kw:hover .t-tip { visibility:visible; opacity:1; }

                /* Mostrar solução */
                .t-hint-btn { display:none; background:linear-gradient(135deg,#7C3AED,#5B21B6); border:none; color:white; padding:10px 18px; border-radius:14px; font-weight:900; cursor:pointer; font-size:0.9rem; margin-top:8px; width:100%; }
                .t-hint-btn.visible { display:block; }
                .t-solution-box { display:none; background:#0F172A; border:2px solid #7C3AED; border-radius:16px; padding:14px; margin-top:10px; }
                .t-solution-box.visible { display:block; animation:ardFadeIn 0.3s ease; }
                .t-sol-step { display:inline-block; background:#1E293B; border:1px solid #7C3AED; color:#A78BFA; padding:4px 10px; border-radius:8px; font-weight:900; margin:3px; font-size:0.9rem; }

                /* Indicador de andar melhorado */
                .t-floor-bar { background:rgba(15,23,42,0.92); border:2px solid #334155; border-radius:16px; padding:10px 16px; display:flex; align-items:center; gap:12px; justify-content:center; margin-bottom:12px; }
                .t-floor-dot { width:14px; height:14px; border-radius:50%; transition:all 0.3s; border:2px solid #475569; }
                .t-floor-dot.active { background:#F59E0B; border-color:#F59E0B; box-shadow:0 0 12px rgba(245,158,11,0.7); transform:scale(1.3); }
                .t-floor-dot.done { background:#10B981; border-color:#10B981; }
                .t-floor-dot-label { font-size:0.7rem; color:#94A3B8; font-weight:800; }

                /* Mini mapa preview do proximo andar */
                .t-floor-preview { background:#0F172A; border:2px solid #334155; border-radius:16px; padding:14px 16px; margin-top:10px; display:none; animation:ardFadeIn 0.3s ease; }
                .t-floor-preview.visible { display:block; }
                .t-floor-preview-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:10px; flex-wrap:wrap; gap:8px; }
                .t-mini-grid { display:grid; gap:2px; justify-content:center; }
                .t-mini-cell { width:22px; height:22px; border-radius:4px; display:flex; align-items:center; justify-content:center; font-size:0.6rem; transition:0.15s; border:1px solid rgba(51,65,85,0.5); }
                .t-mini-empty { background:#1E293B; }
                .t-mini-obstacle { background:repeating-linear-gradient(45deg,#334155,#334155 3px,#1E293B 3px,#1E293B 6px); border-color:#EF4444; }
                .t-mini-ladder { background:rgba(245,158,11,0.35); border-color:#F59E0B; }
                .t-mini-ladder::after { content:'🪜'; font-size:0.55rem; }
                .t-mini-treasure { background:rgba(245,158,11,0.35); border-color:#FCD34D; box-shadow:0 0 8px rgba(245,158,11,0.5); }
                .t-mini-treasure::after { content:'🏆'; font-size:0.7rem; }
                .t-mini-you { background:#F59E0B !important; border-color:#FCD34D !important; }
                .t-mini-you::after { content:'⬇'; font-size:0.7rem; color:#0F172A; }
                .t-mini-ladder-from { background:rgba(139,92,246,0.4); border-color:#A78BFA; }
                .t-mini-ladder-from::after { content:'🪜'; font-size:0.55rem; }
                .t-preview-legend { display:flex; gap:12px; flex-wrap:wrap; align-items:center; font-size:0.72rem; color:#94A3B8; margin-top:8px; }
                .t-preview-legend span { display:inline-flex; align-items:center; gap:4px; }
                .t-preview-legend .t-dot { width:10px; height:10px; border-radius:3px; display:inline-block; }
                .t-error-counter { background:#1E293B; border:1px solid #334155; border-radius:12px; padding:5px 12px; font-size:0.82rem; color:#94A3B8; font-weight:800; text-align:center; margin-top:6px; }
                
                /* Animação de transição entre andares */
                .t-floor-transition { position:absolute; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.7); display:flex; align-items:center; justify-content:center; z-index:30; border-radius:22px; font-family:'Fredoka One'; font-size:1.5rem; color:#F59E0B; pointer-events:none; opacity:0; transition:opacity 0.15s; }
                .t-floor-transition.show { opacity:1; }

                /* Caixa intro algoritmo */
                .t-intro-box { background:linear-gradient(135deg,#1E3A5F,#0F172A); border:2px solid #38BDF8; border-radius:18px; padding:16px 20px; margin-bottom:14px; position:relative; overflow:hidden; }
                .t-intro-box::before { content:''; position:absolute; top:-20px; right:-20px; font-size:5rem; opacity:0.07; }
                .t-intro-box .t-intro-title { color:#38BDF8; font-family:'Fredoka One'; margin:0 0 6px; font-size:1.2rem; }
                .t-intro-box .t-intro-text { color:#CBD5E1; font-size:0.9rem; line-height:1.6; margin:0; }
                .t-intro-highlight { color:#F59E0B; font-weight:900; background:rgba(245,158,11,0.1); padding:1px 6px; border-radius:4px; }
                .t-intro-emoji { display:inline-block; font-size:1.2rem; margin:0 2px; vertical-align:middle; }

                /* Preview animado */
                .t-demo-board-wrap { position:relative; background:#0B132B; border:2px solid #38BDF8; border-radius:16px; padding:16px 20px; margin-top:10px; display:none; }
                .t-demo-board-wrap.visible { display:block; animation:ardFadeIn 0.4s ease; }
                .t-demo-hint { color:#38BDF8; font-weight:800; font-size:0.88rem; text-align:center; margin-bottom:10px; }
                .t-demo-btn-play { background:linear-gradient(135deg,#38BDF8,#0284C7); border:none; color:white; padding:10px 20px; border-radius:50px; font-weight:900; cursor:pointer; font-size:0.95rem; border-bottom:4px solid #0C4A6E; width:100%; transition:0.15s; }
                .t-demo-btn-play:active { transform:translateY(3px); border-bottom-width:1px; }
                .t-demo-btn-play:disabled { background:#475569; border-bottom-color:#1E293B; cursor:not-allowed; }
                .t-demo-cursor { width:18px; height:18px; background:#F59E0B; border-radius:50%; position:absolute; transition:all 0.35s ease; z-index:10; box-shadow:0 0 12px #F59E0B; display:none; pointer-events:none; }
                .t-demo-cursor.visible { display:block; }
                .t-demo-reveal { background:transparent; border:1px solid #64748B; color:#64748B; padding:6px 14px; border-radius:20px; font-size:0.75rem; cursor:pointer; margin-top:8px; display:block; margin-left:auto; margin-right:auto; }
                .t-demo-reveal:hover { border-color:#94A3B8; color:#94A3B8; }

                /* Background decorativo */
                .t-bg-icons { position:absolute; top:0; left:0; width:100%; height:100%; pointer-events:none; z-index:0; overflow:hidden; border-radius:22px; }
                .t-bg-icon { position:absolute; opacity:0.08; font-size:2rem; animation: t_float_bg 8s ease-in-out infinite; }
                .t-bg-icon:nth-child(1) { top:5%; left:3%; animation-delay:0s; font-size:2.5rem; }
                .t-bg-icon:nth-child(2) { top:15%; right:5%; animation-delay:2s; font-size:2rem; }
                .t-bg-icon:nth-child(3) { bottom:10%; left:8%; animation-delay:4s; font-size:1.8rem; }
                .t-bg-icon:nth-child(4) { bottom:20%; right:6%; animation-delay:1s; font-size:2.2rem; }
                .t-bg-icon:nth-child(5) { top:40%; left:2%; animation-delay:5s; font-size:1.5rem; }
                .t-bg-icon:nth-child(6) { top:50%; right:3%; animation-delay:3s; font-size:1.6rem; }
                @keyframes t_float_bg { 0%,100%{transform:translateY(0) rotate(0deg)} 25%{transform:translateY(-8px) rotate(3deg)} 75%{transform:translateY(4px) rotate(-3deg)} }

                /* Confetes na vitória */
                .t-confetti { position:fixed; pointer-events:none; z-index:1000; font-size:2rem; animation:t_confettiFall 2.5s ease-out forwards; }
                @keyframes t_confettiFall { 0%{transform:translateY(-80px) rotate(0deg);opacity:1} 100%{transform:translateY(105vh) rotate(720deg);opacity:0} }

                /* Modal vitória mais infantil */
                .tesouro-wrapper .modal-box { background:linear-gradient(180deg,#1E293B,#0F172A); padding:32px; border-radius:32px; max-width:420px; width:92%; text-align:center; border:4px solid #FBBF24; box-shadow:0 0 60px rgba(251,191,36,0.35); animation:t_bounceIn 0.5s ease; }
                @keyframes t_bounceIn { 0%{transform:scale(0.7);opacity:0} 60%{transform:scale(1.05)} 100%{transform:scale(1);opacity:1} }
                .tesouro-wrapper .modal-title { font-family:'Fredoka One'; color:#FBBF24; font-size:1.8rem; margin:6px 0; text-shadow:0 2px 8px rgba(251,191,36,0.3); }
                .tesouro-wrapper .modal-text { color:#CBD5E1; margin:8px 0 20px; line-height:1.6; font-size:1rem; }
                .tesouro-wrapper .btn-modal { background:linear-gradient(135deg,#FBBF24,#F59E0B); border:none; padding:14px 36px; border-radius:50px; font-weight:900; cursor:pointer; color:#0F172A; font-size:1.1rem; border-bottom:5px solid #B45309; transition:0.15s; }
                .tesouro-wrapper .btn-modal:active { transform:translateY(4px); border-bottom-width:1px; }
                .tesouro-wrapper .modal-icon { font-size:5rem; margin-bottom:4px; animation:t_bounceIn 0.6s ease 0.2s both; }

                /* Tutorial overlay */
                .t-tutorial-overlay { position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.9); display:flex; justify-content:center; align-items:center; z-index:998; opacity:0; pointer-events:none; transition:0.3s; }
                .t-tutorial-overlay.active { opacity:1; pointer-events:all; }
                .t-tutorial-box { background:#1E293B; border:3px solid #38BDF8; border-radius:28px; padding:28px 24px; max-width:480px; width:92%; text-align:center; box-shadow:0 0 50px rgba(56,189,248,0.3); }
                .t-tutorial-step-counter { position:fixed; top:20px; left:50%; transform:translateX(-50%); background:rgba(15,23,42,0.95); border:2px solid #F59E0B; border-radius:20px; padding:8px 20px; color:#F59E0B; font-weight:900; font-size:1rem; z-index:997; font-family:'Fredoka One'; display:none; }
                .t-tutorial-step-counter.show { display:block; animation:ardFadeIn 0.3s ease; }
                .t-tutorial-highlight { animation: t_tut_pulse 0.8s ease-in-out infinite; }
                @keyframes t_tut_pulse { 0%,100%{box-shadow:0 0 8px rgba(245,158,11,0.5)} 50%{box-shadow:0 0 20px rgba(245,158,11,0.9)} }
                .t-blur-board { filter:blur(1px); transition:filter 0.3s; }

                /* Slides de introdução */
                .t-slides-container { position:relative; background:#1E293B; border:2px solid #334155; border-radius:18px; overflow:hidden; margin-bottom:14px; }
                .t-slide { display:none; padding:18px 20px; text-align:center; animation:ardFadeIn 0.35s ease; }
                .t-slide.active { display:block; }
                .t-slide-title { color:#38BDF8; font-family:'Fredoka One'; font-size:1.3rem; margin:0 0 8px; }
                .t-slide-body { color:#CBD5E1; font-size:0.9rem; line-height:1.7; }
                .t-slide-nav { display:flex; justify-content:space-between; align-items:center; padding:10px 16px; background:#0F172A; }
                .t-slide-dots { display:flex; gap:6px; }
                .t-slide-dot { width:8px; height:8px; border-radius:50%; background:#334155; transition:0.3s; }
                .t-slide-dot.active { background:#38BDF8; width:20px; border-radius:10px; }
                .t-slide-btn { background:#38BDF8; border:none; color:#0F172A; padding:8px 18px; border-radius:20px; font-weight:900; cursor:pointer; font-size:0.85rem; }
                .t-slide-btn.secondary { background:transparent; border:1px solid #64748B; color:#94A3B8; }
                .t-slide-icon { font-size:3.5rem; margin-bottom:6px; }

                /* Fundo temático do tabuleiro */
                .tesouro-wrapper .cell::before { content:''; position:absolute; top:0;left:0;right:0;bottom:0; border-radius:6px; opacity:0.15; pointer-events:none; z-index:0; transition:opacity 0.3s; }
                .board.floor-0 .cell::before { background:radial-gradient(ellipse at 30% 80%, #78350F, transparent 60%), radial-gradient(ellipse at 70% 20%, #92400E, transparent 50%); }
                .board.floor-1 .cell::before { background:radial-gradient(ellipse at 20% 70%, #166534, transparent 60%), radial-gradient(ellipse at 60% 30%, #15803D, transparent 50%); }
                .board.floor-2 .cell::before { background:radial-gradient(ellipse at 40% 60%, #1E3A8A, transparent 50%), radial-gradient(ellipse at 80% 40%, #3B82F6, transparent 40%); }
                .tesouro-wrapper .cell > * { position:relative; z-index:1; }
                .board { box-shadow:inset 0 0 80px rgba(0,0,0,0.5), 0 12px 40px rgba(0,0,0,0.65); }
                .board.floor-0 { box-shadow:inset 0 0 80px rgba(0,0,0,0.5), 0 12px 40px rgba(0,0,0,0.65), 0 0 0 8px #78350F; }
                .board.floor-1 { box-shadow:inset 0 0 80px rgba(0,0,0,0.5), 0 12px 40px rgba(0,0,0,0.65), 0 0 0 8px #166534; }
                .board.floor-2 { box-shadow:inset 0 0 80px rgba(0,0,0,0.5), 0 12px 40px rgba(0,0,0,0.65), 0 0 0 8px #1E3A8A; }

                .t-subtabs { display:flex; gap:6px; background:#1E293B; padding:5px; border-radius:20px; margin-bottom:12px; }
                .t-subtab { flex:1; background:transparent; border:none; color:#94A3B8; padding:10px 14px; border-radius:16px; font-weight:900; font-size:0.9rem; cursor:pointer; transition:0.2s; }
                .t-subtab:hover { background:#334155; color:white; }
                .t-subtab.active { background:linear-gradient(135deg,#FBBF24,#F59E0B); color:#0F172A; box-shadow:0 0 15px rgba(251,191,36,0.4); }
                .t-subtab-panel { display:none; animation:ardFadeIn 0.3s ease; }
                .t-subtab-panel.active { display:block; }
                .t-hidden-tab { display:none !important; }
                .t-game-grid { display:grid; grid-template-columns:1fr; gap:10px; }
                @media(min-width:700px) { .t-game-grid { grid-template-columns:1fr 280px; } }
                .t-game-left { display:flex; flex-direction:column; gap:10px; }
                .t-cmds-panel { background:#0F172A; border:2px solid #334155; border-radius:16px; padding:12px; }
                .t-cmds-panel h4 { color:#FBBF24; margin:0 0 8px; font-size:0.85rem; font-family:'Fredoka One'; }
            </style>
            <div class="tesouro-wrapper">
                <div class="t-subtabs" id="t_subtabs">
                    <button class="t-subtab active" data-subtab="jogar" onclick="t_switchSubtab('jogar')">🎮 Jogar</button>
                    <button class="t-subtab" data-subtab="guia" onclick="t_switchSubtab('guia')">📖 Guia & Código</button>
                </div>
                <div class="t-slides-container t-guia-content" id="t_slides">
                    <!-- Slide 1: Teoria -->
                    <div class="t-slide active" data-slide="0">
                        <div class="t-slide-icon">🧠</div>
                        <div class="t-slide-title">O que é um Algoritmo?</div>
                        <div class="t-slide-body">
                            Um <span style="color:#F59E0B;font-weight:900;">algoritmo</span> é como uma <span style="color:#F59E0B;">receita de bolo</span>: uma <b>sequência de passos na ordem certa</b> para resolver um problema!<br><br>
                            <span style="color:#94A3B8;">Exemplo:</span> Para fazer um bolo: 1️⃣ Pegar ingredientes → 2️⃣ Misturar → 3️⃣ Assar → 4️⃣ Servir.<br>
                            <b>Sem a ordem correta, o bolo não sai!</b> O mesmo vale para programar um robô.
                        </div>
                    </div>
                    <!-- Slide 2: O Jogo -->
                    <div class="t-slide" data-slide="1">
                        <div class="t-slide-icon">🤖</div>
                        <div class="t-slide-title">Como Jogar</div>
                        <div class="t-slide-body">
                            Use os botões <b>⬆️ ⬇️ ⬅️ ➡️</b> para montar a sequência de comandos do robô.<br><br>
                            <span style="color:#EF4444;">✖ Obstáculos</span> bloqueiam o caminho — desvie!<br>
                            <span style="color:#F59E0B;">🪜 Escadas</span> levam a outros andares (use SUBIR/DESCER).<br>
                            <span style="color:#FCD34D;">🏆 Tesouro</span> é o destino final!<br><br>
                            Após montar os comandos, clique em <b>▶ Executar</b> para ver o robô andar!
                        </div>
                    </div>
                    <!-- Slide 3: Objetivo -->
                    <div class="t-slide" data-slide="2">
                        <div class="t-slide-icon">🎯</div>
                        <div class="t-slide-title">Sua Missão</div>
                        <div class="t-slide-body">
                            Leve o robô do canto <b>superior esquerdo</b> até o <b style="color:#FCD34D;">tesouro 🏆</b>!<br><br>
                            <span style="color:#38BDF8;">🗺️ Mini-mapa:</span> Quando houver escadas, um mapa do próximo andar aparece abaixo do tabuleiro.<br>
                            <span style="color:#A78BFA;">💡 Dica:</span> Planeje antes de executar. Um comando errado e o robô bate!<br><br>
                            Pronto para começar? 🚀
                        </div>
                    </div>
                    <!-- Navegação dos slides -->
                    <div class="t-slide-nav">
                        <button class="t-slide-btn secondary" id="t_slide_prev" onclick="t_slidePrev()" style="visibility:hidden;">← Anterior</button>
                        <div class="t-slide-dots" id="t_slide_dots">
                            <span class="t-slide-dot active"></span>
                            <span class="t-slide-dot"></span>
                            <span class="t-slide-dot"></span>
                        </div>
                        <button class="t-slide-btn" id="t_slide_next" onclick="t_slideNext()">Próximo →</button>
                    </div>
                </div>
                <div class="level-bar">
                    <button class="level-btn active" data-level="1">⭐ Nível 1 — Térreo</button>
                    <button class="level-btn" data-level="2">⭐⭐ Nível 2 — Plataforma Elevada</button>
                    <button class="level-btn" data-level="3">⭐⭐⭐ Nível 3 — Torre</button>
                </div>
                <div class="t-floor-bar t-jogar-content" id="t_floor_bar">
                    <span style="color:#94A3B8;font-weight:800;font-size:0.85rem;">Andar:</span>
                    <span style="display:flex;gap:8px;align-items:center;" id="t_floor_dots"></span>
                    <span style="color:#F59E0B;font-weight:900;font-size:0.82rem;" id="t_floor_label">1 / 1</span>
                </div>
                <div class="board-wrap t-jogar-content">
                    <div class="t-bg-icons">
                        <span class="t-bg-icon">🤖</span>
                        <span class="t-bg-icon">🏆</span>
                        <span class="t-bg-icon">🪜</span>
                        <span class="t-bg-icon">✖</span>
                        <span class="t-bg-icon">🗺️</span>
                        <span class="t-bg-icon">💎</span>
                    </div>
                    <div class="board" id="t_board"></div>
                    <div class="t-floor-transition" id="t_floor_transition"><span id="t_transition_text"></span></div>
                </div>
                <div class="t-floor-preview t-guia-content" id="t_floor_preview">
                    <div class="t-floor-preview-header">
                        <span style="color:#FCD34D;font-weight:900;font-size:0.95rem;">🗺️ Mini-mapa do <span id="t_preview_floor_label">Próximo Andar</span></span>
                        <span style="color:#64748B;font-size:0.78rem;" id="t_preview_hint">Planeje sua rota antes de SUBIR a escada!</span>
                    </div>
                    <div class="t-mini-grid" id="t_mini_grid"></div>
                    <div class="t-preview-legend">
                        <span><span class="t-dot" style="background:#1E293B;border:1px solid #475569;"></span> Vazio</span>
                        <span><span class="t-dot" style="background:repeating-linear-gradient(45deg,#334155,#334155 3px,#1E293B 3px,#1E293B 6px);border:1px solid #EF4444;"></span> Obstáculo ✖</span>
                        <span><span class="t-dot" style="background:rgba(245,158,11,0.35);border:1px solid #F59E0B;"></span> Escada 🪜</span>
                        <span><span class="t-dot" style="background:rgba(245,158,11,0.35);border:1px solid #FCD34D;"></span> Tesouro 🏆</span>
                        <span><span class="t-dot" style="background:#F59E0B;border:1px solid #FCD34D;"></span> Você ⬇</span>
                    </div>
                </div>
                <div class="controls t-jogar-content">
                    <button class="btn" onclick="t_addCmd('UP')" title="Mover para cima">⬆</button>
                    <button class="btn" onclick="t_addCmd('DOWN')" title="Mover para baixo">⬇</button>
                    <button class="btn" onclick="t_addCmd('LEFT')" title="Mover para esquerda">⬅</button>
                    <button class="btn" onclick="t_addCmd('RIGHT')" title="Mover para direita">➡</button>
                    <button class="btn special" onclick="t_addCmd('SUBIR')">🪜 Subir</button>
                    <button class="btn special" onclick="t_addCmd('DESCER')">🪜 Descer</button>
                </div>
                <div class="code-area t-jogar-content" id="t_codeArea"><span style="color:#64748B;">Adicione comandos...</span></div>
                <div class="actions t-jogar-content">
                    <button class="btn btn-undo" style="background:#F59E0B;color:#0F172A;flex:1;border-bottom:4px solid #B45309;" onclick="t_undoCmd()"><i class="fas fa-undo"></i></button>
                    <button class="btn btn-clear" onclick="t_clearCode()"><i class="fas fa-trash"></i></button>
                    <button class="btn btn-run" onclick="t_runCode()"><i class="fas fa-play"></i> Executar</button>
                </div>
                <div class="t-error-counter t-jogar-content" id="t_err_counter"></div>
                <div class="t-demo-board-wrap t-guia-content" id="t_demo_board_wrap">
                    <div class="t-demo-hint" id="t_demo_hint">🎬 Veja o robô resolver sozinho e depois faça igual!</div>
                    <button class="t-demo-btn-play" id="t_demo_btn_play" onclick="t_playDemo()">▶ Assistir Demonstração</button>
                    <div style="position:relative;margin-top:10px;">
                        <div class="board" id="t_demo_board" style="max-width:320px;margin:0 auto;"></div>
                        <div class="t-demo-cursor" id="t_demo_cursor"></div>
                    </div>
                    <button class="t-demo-reveal" id="t_demo_reveal_btn" onclick="t_revealSteps()" style="display:none;">🔍 Ainda não conseguiu? Ver passos em texto</button>
                </div>
                <div class="t-tutorial-step-counter" id="t_tutorial_counter">Passo 1 / 8</div>
                <div class="t-tutorial-overlay" id="t_tutorial_overlay">
                    <div class="t-tutorial-box">
                        <div style="font-size:3.5rem;margin-bottom:8px;" id="t_tut_icon">🤖</div>
                        <h2 style="font-family:'Fredoka One';color:white;margin:0 0 6px;" id="t_tut_title">Bem-vindo ao Caça ao Tesouro!</h2>
                        <p style="color:#CBD5E1;font-size:0.95rem;line-height:1.6;margin-bottom:10px;" id="t_tut_text">
                            Vou te mostrar como o robô pensa! <span style="color:#F59E0B;">Assista o robô resolver sozinho</span> — depois você faz igual.
                        </p>
                        <div id="t_tut_progress" style="display:flex;gap:4px;justify-content:center;margin-bottom:12px;"></div>
                        <button class="btn-run" style="background:linear-gradient(135deg,#38BDF8,#0284C7);border-bottom:4px solid #0C4A6E;width:100%;font-size:1.1rem;" id="t_tut_btn" onclick="t_tutorialAction()">▶ Iniciar Tutorial</button>
                        <button class="t-demo-reveal" style="margin-top:10px;" id="t_tut_skip" onclick="t_skipTutorial()">⏭ Pular tutorial — já sei jogar!</button>
                    </div>
                </div>
                <button class="t-hint-btn t-jogar-content" id="t_hint_btn" onclick="t_showSolution()">💡 Precisa de Ajuda? Ver Solução</button>
                <div class="t-solution-box t-guia-content" id="t_solution_box">
                    <div style="color:#A78BFA;font-weight:900;margin-bottom:8px;">🗺️ Caminho Correto:</div>
                    <div id="t_solution_steps"></div>
                    <div id="t_solution_text" style="color:#94A3B8;font-size:0.85rem;margin-top:10px;line-height:1.5;"></div>
                </div>
                <div class="t-code-panel t-guia-content" id="t_codePanel">
                    <div class="t-code-header" onclick="t_toggleCode()">
                        <span style="font-weight:900;color:#38BDF8;font-size:0.9rem;"><i class="fa-solid fa-code"></i> Código Arduino C++ (Tempo Real) <span id="t_code_arrow">▶</span></span>
                        <button onclick="event.stopPropagation();t_copyCode()" style="background:#334155;color:#38BDF8;border:1px solid #38BDF8;padding:3px 10px;border-radius:8px;font-size:0.78rem;font-weight:800;cursor:pointer;"><i class="fa-regular fa-copy"></i> Copiar</button>
                    </div>
                    <div class="t-code-body" id="t_codePanelBody" style="display:none;">
                        <pre id="t_arduinoCode"></pre>
                    </div>
                </div>
            </div>
            <div class="modal" id="t_modal"><div class="modal-box"><div class="modal-icon" id="t_mIcon">🎉</div><h2 class="modal-title" id="t_mTitle">Parabéns!</h2><p class="modal-text" id="t_mText">Mensagem</p><button class="btn-modal" onclick="t_closeModal()">Ok!</button></div></div>
        `;
        t_init();
        document.getElementById('tesouro-loaded')?.remove();
        const flag = document.createElement('div'); flag.id = 'tesouro-loaded'; flag.style.display='none'; container.appendChild(flag);
    }


    let t_level = 1, t_seq = [], t_running = false, t_robotPos = {x:0,y:0,z:0}, t_treasurePos = {x:4,y:4,z:0}, t_floors = [], t_gridSize = 5;
    let t_errors = 0, t_codePanelOpen = false;

    const T_ROBOT_SVG = `<svg class="robot-svg" width="32" height="38" viewBox="0 0 32 38" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="8" y="10" width="16" height="14" rx="4" fill="#60A5FA" stroke="#3B82F6" stroke-width="1.5"/>
      <circle cx="12" cy="16" r="2.5" fill="#0F172A"/><circle cx="20" cy="16" r="2.5" fill="#0F172A"/>
      <circle cx="12" cy="16" r="1" fill="#38BDF8"/><circle cx="20" cy="16" r="1" fill="#38BDF8"/>
      <rect x="13" y="19" width="6" height="2" rx="1" fill="#0F172A"/>
      <rect x="14" y="4" width="4" height="7" rx="2" fill="#94A3B8"/>
      <circle cx="16" cy="3" r="2.5" fill="#F59E0B" stroke="#B45309" stroke-width="1"/>
      <rect x="5" y="12" width="4" height="8" rx="2" fill="#3B82F6"/>
      <rect x="23" y="12" width="4" height="8" rx="2" fill="#3B82F6"/>
      <rect x="9" y="24" width="5" height="9" rx="2" fill="#3B82F6"/>
      <rect x="18" y="24" width="5" height="9" rx="2" fill="#3B82F6"/>
    </svg>`;

    const T_TREASURE_SVG = `<svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="18" cy="28" rx="12" ry="6" fill="#92400E"/>
      <rect x="6" y="16" width="24" height="14" rx="4" fill="#B45309"/>
      <rect x="6" y="14" width="24" height="6" rx="3" fill="#D97706"/>
      <rect x="14" y="14" width="8" height="6" rx="2" fill="#F59E0B"/>
      <circle cx="18" cy="17" r="2.5" fill="#FCD34D" stroke="#F59E0B" stroke-width="1"/>
      <circle cx="10" cy="22" r="1.5" fill="#FCD34D" opacity="0.7"/>
      <circle cx="26" cy="22" r="1.5" fill="#FCD34D" opacity="0.7"/>
      <circle cx="14" cy="25" r="1" fill="#FCD34D" opacity="0.5"/>
      <circle cx="22" cy="25" r="1" fill="#FCD34D" opacity="0.5"/>
    </svg>`;

    function t_switchSubtab(name) {
        document.querySelectorAll('.t-subtab').forEach(b => b.classList.toggle('active', b.dataset.subtab === name));
        const guiaEls = document.querySelectorAll('.t-guia-content');
        const jogarEls = document.querySelectorAll('.t-jogar-content');
        guiaEls.forEach(el => el.classList.toggle('t-hidden-tab', name !== 'guia'));
        jogarEls.forEach(el => el.classList.toggle('t-hidden-tab', name !== 'jogar'));
    }

    function t_init() {
        document.querySelectorAll('.tesouro-wrapper .level-btn').forEach(btn => {
            btn.onclick = () => {
                document.querySelectorAll('.tesouro-wrapper .level-btn').forEach(b=>b.classList.remove('active'));
                btn.classList.add('active');
                t_level = parseInt(btn.dataset.level);
                t_errors = 0;
                t_updateErrorCounter();
                t_initLevel();
                t_clearCode();
                t_switchSubtab('jogar');
                setTimeout(() => t_checkLevelTutorial(t_level), 300);
            };
        });
        t_initLevel();
        t_updateArduinoCode();
        t_updateErrorCounter();
        t_switchSubtab('jogar');
        setTimeout(() => {
            if(!localStorage.getItem('tesouro_slides_done')) {
                // Slides já estão visíveis no DOM
            } else {
                document.getElementById('t_slides').style.display = 'none';
                // Se slides já vistos mas tutorial nível 1 não, mostra logo o tut
                if(!localStorage.getItem('tesouro_tut_lvl_1')) {
                    setTimeout(() => t_checkLevelTutorial(1), 500);
                }
            }
        }, 400);
    }
    
    // ================= SISTEMA DE TUTORIAIS POR NÍVEL =================
    function t_checkLevelTutorial(lvl) {
        const key = 'tesouro_tut_lvl_' + lvl;
        if(localStorage.getItem(key)) return; // Already shown
        
        if(lvl === 1) {
            t_showTutorialIntro();
        } else if(lvl === 2) {
            t_showLevel2Tutorial();
        } else if(lvl === 3) {
            t_showLevel3Tutorial();
        }
    }
    
    function t_markTutorialDone(lvl) {
        localStorage.setItem('tesouro_tut_lvl_' + lvl, '1');
    }
    
    // ================= SLIDES DE INTRODUÇÃO =================
    let t_currentSlide = 0;
    const t_totalSlides = 3;
    
    function t_updateSlides() {
        document.querySelectorAll('.t-slide').forEach((s, i) => s.classList.toggle('active', i === t_currentSlide));
        document.querySelectorAll('.t-slide-dot').forEach((d, i) => d.classList.toggle('active', i === t_currentSlide));
        const prevBtn = document.getElementById('t_slide_prev');
        const nextBtn = document.getElementById('t_slide_next');
        if(prevBtn) prevBtn.style.visibility = t_currentSlide === 0 ? 'hidden' : 'visible';
        if(nextBtn) {
            if(t_currentSlide === t_totalSlides - 1) {
                nextBtn.innerText = '▶ Iniciar Tutorial';
                nextBtn.onclick = t_startFromSlides;
            } else {
                nextBtn.innerText = 'Próximo →';
                nextBtn.onclick = t_slideNext;
            }
        }
    }
    function t_slideNext() {
        if(t_currentSlide < t_totalSlides - 1) { t_currentSlide++; t_updateSlides(); }
        else t_startFromSlides();
    }
    function t_slidePrev() { if(t_currentSlide > 0) { t_currentSlide--; t_updateSlides(); } }
    function t_startFromSlides() {
        document.getElementById('t_slides').style.display = 'none';
        localStorage.setItem('tesouro_slides_done', '1');
        t_checkLevelTutorial(1);
    }
    
    // ================= TUTORIAL INTERATIVO =================
    let t_tutorialRunning = false;
    const t_tutorialSol = ['RIGHT','RIGHT','RIGHT','RIGHT','DOWN','DOWN','DOWN','DOWN'];
    
    function t_showTutorialIntro() {
        const overlay = document.getElementById('t_tutorial_overlay');
        if(!overlay) return;
        overlay.classList.add('active');
        document.getElementById('t_tut_icon').innerText = '🤖';
        document.getElementById('t_tut_title').innerText = 'Bem-vindo ao Caça ao Tesouro!';
        document.getElementById('t_tut_text').innerHTML = 'Vou te mostrar como o robô pensa! <span style="color:#F59E0B;">Assista o robô resolver sozinho</span> — depois você faz igual.';
        document.getElementById('t_tut_btn').innerText = '▶ Iniciar Tutorial';
        document.getElementById('t_tut_btn').onclick = t_tutorialAction;
        document.getElementById('t_tut_skip').style.display = 'block';
        const progress = document.getElementById('t_tut_progress');
        progress.innerHTML = '';
        for(let i=0; i<t_tutorialSol.length; i++) {
            const dot = document.createElement('span');
            dot.style.width = '8px'; dot.style.height = '8px'; dot.style.borderRadius = '50%';
            dot.style.background = '#334155'; dot.id = 'tutdot-'+i;
            progress.appendChild(dot);
        }
    }
    
    async function t_tutorialAction() {
        if(t_tutorialRunning) return;
        t_tutorialRunning = true;
        t_switchSubtab('jogar');
        const overlay = document.getElementById('t_tutorial_overlay');
        const btn = document.getElementById('t_tut_btn');
        const skipBtn = document.getElementById('t_tut_skip');
        const counter = document.getElementById('t_tutorial_counter');
        
        overlay.classList.remove('active');
        if(skipBtn) skipBtn.style.display = 'none';
        if(counter) counter.classList.add('show');
        
        t_level = 1;
        t_errors = 0;
        t_initLevel();
        t_clearCode();
        await t_sleep(400);
        
        t_robotPos = {x:0, y:0, z:0};
        t_renderBoard();
        let px=0, py=0;
        
        for(let i=0; i<t_tutorialSol.length; i++) {
            counter.innerText = `Passo ${i+1} / ${t_tutorialSol.length}`;
            const dot = document.getElementById('tutdot-'+i);
            if(dot) dot.style.background = '#F59E0B';
            
            const cmd = t_tutorialSol[i];
            const prevX=px, prevY=py;
            if(cmd==='RIGHT') px++; else if(cmd==='DOWN') py++;
            else if(cmd==='LEFT') px--; else if(cmd==='UP') py--;
            
            const nextCell = document.getElementById(`tc-${px}-${py}`);
            if(nextCell) {
                nextCell.classList.add('t-tutorial-highlight');
                nextCell.style.background = 'rgba(56,189,248,0.3)';
                nextCell.style.borderColor = '#38BDF8';
            }
            await t_sleep(500);
            
            const prevCell = document.getElementById(`tc-${prevX}-${prevY}`);
            if(prevCell) {
                prevCell.classList.remove('robot');
                prevCell.innerHTML = '';
                prevCell.classList.remove('t-tutorial-highlight');
                prevCell.style.background = 'rgba(30,41,59,0.75)';
                prevCell.style.borderColor = 'rgba(51,65,85,0.7)';
            }
            if(nextCell) {
                nextCell.classList.add('robot', 'moving');
                nextCell.innerHTML = T_ROBOT_SVG;
                nextCell.classList.remove('t-tutorial-highlight');
                setTimeout(() => nextCell.classList.remove('moving'), 300);
            }
            playSound('step');
            await t_sleep(300);
        }
        
        const treasureCell = document.getElementById(`tc-${px}-${py}`);
        if(treasureCell) {
            treasureCell.classList.add('robot', 'win');
            treasureCell.innerHTML = '<div style="position:relative;">'+T_ROBOT_SVG+'<span style="position:absolute;top:-18px;right:-12px;font-size:1.4rem;">🎉</span></div>';
        }
        playSound('success');
        counter.innerText = '🏆 Tesouro Encontrado!';
        await t_sleep(800);
        
        counter.classList.remove('show');
        overlay.classList.add('active');
        document.getElementById('t_tut_icon').innerText = '🧑‍💻';
        document.getElementById('t_tut_title').innerText = 'Agora é Sua Vez!';
        document.getElementById('t_tut_text').innerHTML = 'Você viu o robô fazer <span style="color:#F59E0B;">8 passos</span> (4 ➡️ Direita + 4 ⬇️ Baixo)<br><br><b style="color:#38BDF8;">Monte os mesmos comandos</b> nos botões abaixo e clique em ▶ Executar!';
        btn.innerText = '🎮 Vamos Jogar!';
        btn.onclick = t_startPlaying;
        
        localStorage.setItem('tesouro_tut_lvl_1', '1');
        t_tutorialRunning = false;
    }
    
    function t_startPlaying() {
        const overlay = document.getElementById('t_tutorial_overlay');
        overlay.classList.remove('active');
        t_level = 1;
        t_errors = 0;
        t_initLevel();
        t_clearCode();
        t_updateErrorCounter();
    }
    
    function t_skipTutorial() {
        const overlay = document.getElementById('t_tutorial_overlay');
        overlay.classList.remove('active');
        localStorage.setItem('tesouro_tut_lvl_1', '1');
        t_level = 1;
        t_errors = 0;
        t_initLevel();
        t_clearCode();
        t_updateErrorCounter();
    }
    
    // ================= TUTORIAL NÍVEL 2 =================
    const t_lvl2TutorialSteps = ['RIGHT','RIGHT','RIGHT','DOWN','DOWN','DOWN','DOWN','SUBIR','DOWN','RIGHT','RIGHT'];
    
    function t_showLevel2Tutorial() {
        const overlay = document.getElementById('t_tutorial_overlay');
        if(!overlay) return;
        overlay.classList.add('active');
        document.getElementById('t_tut_icon').innerText = '🪜';
        document.getElementById('t_tut_title').innerText = 'Nível 2 — Plataforma Elevada!';
        document.getElementById('t_tut_text').innerHTML = 'Agora o tesouro está <b style="color:#34D399;">em outro andar!</b><br><br>'
            + '<span style="color:#F59E0B;">🪜 Encontre a escada</span> e use <b>SUBIR</b> para alcançar o andar de cima.<br>'
            + '<span style="color:#38BDF8;">🗺️ Mini-mapa:</span> Abaixo do tabuleiro você vê o layout do próximo andar!<br><br>'
            + '<b>Assista a demonstração primeiro!</b>';
        document.getElementById('t_tut_btn').innerText = '▶ Assistir Nível 2';
        document.getElementById('t_tut_btn').onclick = t_runLvl2Demo;
        document.getElementById('t_tut_skip').style.display = 'block';
        document.getElementById('t_tut_skip').onclick = t_skipLvl2Tutorial;
        const progress = document.getElementById('t_tut_progress');
        progress.innerHTML = '';
        for(let i=0; i<t_lvl2TutorialSteps.length; i++) {
            const dot = document.createElement('span');
            dot.style.width = '8px'; dot.style.height = '8px'; dot.style.borderRadius = '50%';
            dot.style.background = '#334155'; dot.id = 'tutdot2-'+i;
            progress.appendChild(dot);
        }
    }
    
    async function t_runLvl2Demo() {
        if(t_tutorialRunning) return;
        t_tutorialRunning = true;
        t_switchSubtab('jogar');
        const overlay = document.getElementById('t_tutorial_overlay');
        const btn = document.getElementById('t_tut_btn');
        const skipBtn = document.getElementById('t_tut_skip');
        const counter = document.getElementById('t_tutorial_counter');
        
        overlay.classList.remove('active');
        if(skipBtn) skipBtn.style.display = 'none';
        if(counter) counter.classList.add('show');
        
        t_level = 2;
        t_errors = 0;
        t_initLevel();
        t_clearCode();
        await t_sleep(400);
        
        t_robotPos = {x:0, y:0, z:0};
        t_renderBoard();
        let px=0, py=0, pz=0;
        let highlightTimeout = [];
        
        for(let i=0; i<t_lvl2TutorialSteps.length; i++) {
            counter.innerText = `Passo ${i+1} / ${t_lvl2TutorialSteps.length}`;
            const dot = document.getElementById('tutdot2-'+i);
            if(dot) dot.style.background = '#F59E0B';
            
            const cmd = t_lvl2TutorialSteps[i];
            const prevX=px, prevY=py;
            
            if(cmd==='SUBIR') {
                counter.innerText = '🪜 SUBINDO para o Andar 2...';
                await t_sleep(600);
                const trans = document.getElementById('t_floor_transition');
                const transText = document.getElementById('t_transition_text');
                if(trans && transText) {
                    transText.innerText = '⬆ SUBINDO...';
                    trans.classList.add('show');
                }
                await t_sleep(500);
                pz = 1;
                t_robotPos = {x:px, y:py, z:1};
                t_renderBoard();
                t_drawRobot(px, py, 'climbing');
                if(trans) { await t_sleep(400); trans.classList.remove('show'); }
                await t_sleep(300);
                continue;
            }
            
            if(cmd==='RIGHT') px++; else if(cmd==='DOWN') py++;
            else if(cmd==='LEFT') px--; else if(cmd==='UP') py--;
            
            const nextCell = document.getElementById(`tc-${px}-${py}`);
            if(nextCell && pz === t_robotPos.z) {
                nextCell.classList.add('t-tutorial-highlight');
                nextCell.style.background = 'rgba(56,189,248,0.3)';
                nextCell.style.borderColor = '#38BDF8';
            }
            await t_sleep(500);
            
            const prevCell = document.getElementById(`tc-${prevX}-${prevY}`);
            if(prevCell && pz === t_robotPos.z) {
                prevCell.classList.remove('robot');
                prevCell.innerHTML = '';
                prevCell.classList.remove('t-tutorial-highlight');
                prevCell.style.background = 'rgba(30,41,59,0.75)';
                prevCell.style.borderColor = 'rgba(51,65,85,0.7)';
            }
            if(nextCell && pz === t_robotPos.z) {
                nextCell.classList.add('robot', 'moving');
                nextCell.innerHTML = T_ROBOT_SVG;
                nextCell.classList.remove('t-tutorial-highlight');
                setTimeout(() => nextCell.classList.remove('moving'), 300);
            }
            playSound('step');
            await t_sleep(300);
        }
        
        const treasureCell = document.getElementById(`tc-${px}-${py}`);
        if(treasureCell && pz === t_robotPos.z) {
            treasureCell.classList.add('robot', 'win');
            treasureCell.innerHTML = '<div style="position:relative;">'+T_ROBOT_SVG+'<span style="position:absolute;top:-18px;right:-12px;font-size:1.4rem;">🎉</span></div>';
        }
        playSound('success');
        counter.innerText = '🏆 Tesouro Encontrado!';
        await t_sleep(800);
        
        counter.classList.remove('show');
        overlay.classList.add('active');
        document.getElementById('t_tut_icon').innerText = '🧑‍💻';
        document.getElementById('t_tut_title').innerText = 'Sua Vez no Nível 2!';
        document.getElementById('t_tut_text').innerHTML = 'Você viu o robô <b style="color:#F59E0B;">subir a escada 🪜</b> e chegar ao tesouro!<br><br><b style="color:#38BDF8;">Monte os comandos:</b> 3 ➡️, 4 ⬇️, SUBIR, 1 ⬇️, 2 ➡️';
        btn.innerText = '🎮 Vamos Jogar!';
        btn.onclick = t_startLvl2Playing;
        
        localStorage.setItem('tesouro_tut_lvl_2', '1');
        t_tutorialRunning = false;
    }
    
    function t_startLvl2Playing() {
        const overlay = document.getElementById('t_tutorial_overlay');
        overlay.classList.remove('active');
        t_level = 2;
        t_errors = 0;
        t_initLevel();
        t_clearCode();
        t_updateErrorCounter();
    }
    
    function t_skipLvl2Tutorial() {
        const overlay = document.getElementById('t_tutorial_overlay');
        overlay.classList.remove('active');
        localStorage.setItem('tesouro_tut_lvl_2', '1');
        t_level = 2;
        t_errors = 0;
        t_initLevel();
        t_clearCode();
        t_updateErrorCounter();
    }

    // ================= TUTORIAL NÍVEL 3 =================
    const t_lvl3TutorialSteps = ['RIGHT','RIGHT','RIGHT','DOWN','DOWN','DOWN','DOWN','SUBIR','UP','UP','UP','RIGHT','RIGHT','SUBIR','RIGHT','DOWN','DOWN','DOWN','DOWN','DOWN'];
    
    function t_showLevel3Tutorial() {
        const overlay = document.getElementById('t_tutorial_overlay');
        if(!overlay) return;
        overlay.classList.add('active');
        document.getElementById('t_tut_icon').innerText = '🏰';
        document.getElementById('t_tut_title').innerText = 'Nível 3 — A Torre!';
        document.getElementById('t_tut_text').innerHTML = 'O tesouro está no <b style="color:#60A5FA;">topo da torre!</b><br><br>'
            + '<span style="color:#F59E0B;">🪜 Suba 2 escadas</span> em andares diferentes para chegar ao topo.<br>'
            + '<span style="color:#38BDF8;">🗺️ Mini-mapa:</span> Mostra o próximo andar — use para planejar!<br>'
            + '<span style="color:#A78BFA;">🧩 Estratégia:</span> Planeje andar por andar: chão → escada 1 → plataforma → escada 2 → topo 🏆<br><br>'
            + '<b>Assista a demonstração!</b>';
        document.getElementById('t_tut_btn').innerText = '▶ Assistir Nível 3';
        document.getElementById('t_tut_btn').onclick = t_runLvl3Demo;
        document.getElementById('t_tut_skip').style.display = 'block';
        document.getElementById('t_tut_skip').onclick = t_skipLvl3Tutorial;
        const progress = document.getElementById('t_tut_progress');
        progress.innerHTML = '';
        for(let i=0; i<t_lvl3TutorialSteps.length; i++) {
            const dot = document.createElement('span');
            dot.style.width = '8px'; dot.style.height = '8px'; dot.style.borderRadius = '50%';
            dot.style.background = '#334155'; dot.id = 'tutdot3-'+i;
            progress.appendChild(dot);
        }
    }
    
    async function t_runLvl3Demo() {
        if(t_tutorialRunning) return;
        t_tutorialRunning = true;
        t_switchSubtab('jogar');
        const overlay = document.getElementById('t_tutorial_overlay');
        const btn = document.getElementById('t_tut_btn');
        const skipBtn = document.getElementById('t_tut_skip');
        const counter = document.getElementById('t_tutorial_counter');
        
        overlay.classList.remove('active');
        if(skipBtn) skipBtn.style.display = 'none';
        if(counter) counter.classList.add('show');
        
        t_level = 3;
        t_errors = 0;
        t_initLevel();
        t_clearCode();
        await t_sleep(400);
        
        t_robotPos = {x:0, y:0, z:0};
        t_renderBoard();
        let px=0, py=0, pz=0;
        
        for(let i=0; i<t_lvl3TutorialSteps.length; i++) {
            counter.innerText = `Passo ${i+1} / ${t_lvl3TutorialSteps.length}`;
            const dot = document.getElementById('tutdot3-'+i);
            if(dot) dot.style.background = '#F59E0B';
            
            const cmd = t_lvl3TutorialSteps[i];
            const prevX=px, prevY=py;
            
            if(cmd==='SUBIR') {
                counter.innerText = `🪜 SUBINDO para o Andar ${pz+2}...`;
                await t_sleep(600);
                const trans = document.getElementById('t_floor_transition');
                const transText = document.getElementById('t_transition_text');
                if(trans && transText) {
                    transText.innerText = '⬆ SUBINDO...';
                    trans.classList.add('show');
                }
                await t_sleep(500);
                pz++;
                t_robotPos = {x:px, y:py, z:pz};
                t_renderBoard();
                t_drawRobot(px, py, 'climbing');
                if(trans) { await t_sleep(400); trans.classList.remove('show'); }
                await t_sleep(300);
                continue;
            }
            
            if(cmd==='RIGHT') px++; else if(cmd==='DOWN') py++;
            else if(cmd==='LEFT') px--; else if(cmd==='UP') py--;
            
            const nextCell = document.getElementById(`tc-${px}-${py}`);
            if(nextCell && pz === t_robotPos.z) {
                nextCell.classList.add('t-tutorial-highlight');
                nextCell.style.background = 'rgba(56,189,248,0.3)';
                nextCell.style.borderColor = '#38BDF8';
            }
            await t_sleep(450);
            
            const prevCell = document.getElementById(`tc-${prevX}-${prevY}`);
            if(prevCell && pz === t_robotPos.z) {
                prevCell.classList.remove('robot');
                prevCell.innerHTML = '';
                prevCell.classList.remove('t-tutorial-highlight');
                prevCell.style.background = 'rgba(30,41,59,0.75)';
                prevCell.style.borderColor = 'rgba(51,65,85,0.7)';
            }
            if(nextCell && pz === t_robotPos.z) {
                nextCell.classList.add('robot', 'moving');
                nextCell.innerHTML = T_ROBOT_SVG;
                nextCell.classList.remove('t-tutorial-highlight');
                setTimeout(() => nextCell.classList.remove('moving'), 300);
            }
            playSound('step');
            await t_sleep(250);
        }
        
        const treasureCell = document.getElementById(`tc-${px}-${py}`);
        if(treasureCell && pz === t_robotPos.z) {
            treasureCell.classList.add('robot', 'win');
            treasureCell.innerHTML = '<div style="position:relative;">'+T_ROBOT_SVG+'<span style="position:absolute;top:-18px;right:-12px;font-size:1.4rem;">🎉</span></div>';
        }
        playSound('success');
        counter.innerText = '🏆 Tesouro no Topo da Torre!';
        await t_sleep(800);
        
        counter.classList.remove('show');
        overlay.classList.add('active');
        document.getElementById('t_tut_icon').innerText = '🧑‍💻';
        document.getElementById('t_tut_title').innerText = 'Sua Vez na Torre!';
        document.getElementById('t_tut_text').innerHTML = '3 andares, 2 escadas, 20 comandos!<br><br><b style="color:#38BDF8;">Dica:</b> Andar 1 → escada (4,5). Andar 2→ escada (6,2). Andar 3 → tesouro em (7,7)!<br><br>Use o <b style="color:#FBBF24;">mini-mapa</b> para planejar cada andar!';
        btn.innerText = '🎮 Vamos Jogar!';
        btn.onclick = t_startLvl3Playing;
        
        localStorage.setItem('tesouro_tut_lvl_3', '1');
        t_tutorialRunning = false;
    }
    
    function t_startLvl3Playing() {
        const overlay = document.getElementById('t_tutorial_overlay');
        overlay.classList.remove('active');
        t_level = 3;
        t_errors = 0;
        t_initLevel();
        t_clearCode();
        t_updateErrorCounter();
    }
    
    function t_skipLvl3Tutorial() {
        const overlay = document.getElementById('t_tutorial_overlay');
        overlay.classList.remove('active');
        localStorage.setItem('tesouro_tut_lvl_3', '1');
        t_level = 3;
        t_errors = 0;
        t_initLevel();
        t_clearCode();
        t_updateErrorCounter();
    }
    
    // ================= AUTO-AVANÇAR NÍVEL =================
    let t_autoAdvTimer = null;
    function t_checkAutoAdvance() {
        if(t_level < 3) {
            t_autoAdvTimer = setTimeout(() => {
                t_autoAdvTimer = null;
                // Fecha o modal de vitória
                document.getElementById('t_modal').classList.remove('active');
                const nextLevel = t_level + 1;
                const nextBtn = document.querySelector(`.tesouro-wrapper .level-btn[data-level="${nextLevel}"]`);
                if(nextBtn) {
                    nextBtn.click();
                    // Tutorial do novo nível
                    if(nextLevel === 2 && !localStorage.getItem('tesouro_tut_lvl_2')) {
                        setTimeout(() => t_showLevel2Tutorial(), 800);
                    }
                    if(nextLevel === 3 && !localStorage.getItem('tesouro_tut_lvl_3')) {
                        setTimeout(() => t_showLevel3Tutorial(), 800);
                    }
                }
            }, 2500);
        }
    }

    function t_updateErrorCounter() {
        const el = document.getElementById('t_err_counter');
        const hintBtn = document.getElementById('t_hint_btn');
        if (el) el.style.display = 'none'; // Não exibe texto que induza o aluno a errar de propósito
        if (hintBtn) {
            hintBtn.classList.toggle('visible', t_errors >= 3);
        }
    }

    function t_showSolution() {
        if(t_errors < 3) {
            playSound('error');
            return;
        }
        t_switchSubtab('guia');
        const solutionData = {
            1: { steps: ['RIGHT','RIGHT','RIGHT','RIGHT','DOWN','DOWN','DOWN','DOWN'], text: 'Vá 4x para a Direita e depois 4x para Baixo. Evite os bloqueios indo pelo lado direito!' },
            2: { steps: ['RIGHT','RIGHT','RIGHT','DOWN','DOWN','DOWN','DOWN','SUBIR','DOWN','RIGHT','RIGHT'], text: 'Andar 1→ Vá 3x Direita e 4x Baixo até a escada em (3,4). Suba! Andar 2→ Desça 1x e vá 2x Direita até o tesouro em (5,5)!' },
            3: { steps: ['RIGHT','RIGHT','RIGHT','DOWN','DOWN','DOWN','DOWN','SUBIR','UP','UP','UP','RIGHT','RIGHT','SUBIR','RIGHT','DOWN','DOWN','DOWN','DOWN','DOWN'], text: 'Andar 1→ 3x Direita e 4x Baixo até escada (3,4). Suba. Andar 2→ 3x Cima e 2x Direita até escada (5,1). Suba. Andar 3→ 1x Direita e 5x Baixo até o tesouro em (6,6)!' }
        };
        t_currentSol = solutionData[t_level] || solutionData[1];
        
        // Show the demo board
        const demoWrap = document.getElementById('t_demo_board_wrap');
        const demoHint = document.getElementById('t_demo_hint');
        const btnPlay = document.getElementById('t_demo_btn_play');
        const revealBtn = document.getElementById('t_demo_reveal_btn');
        const cursor = document.getElementById('t_demo_cursor');
        
        if(demoWrap) demoWrap.classList.add('visible');
        if(demoHint) demoHint.innerText = '🎬 Veja o robô resolver sozinho — depois monte os mesmos comandos!';
        if(btnPlay) { btnPlay.disabled = false; btnPlay.innerHTML = '▶ Assistir Demonstração'; }
        if(revealBtn) revealBtn.style.display = 'block';
        if(cursor) cursor.classList.remove('visible');
        
        t_buildDemoBoard(0);
        
        // Also highlight solution on the main board
        t_highlightSolutionPath(t_currentSol.steps);
    }
    
    let t_currentSol = null;
    let t_demoAnimating = false;
    
    function t_buildDemoBoard(startFloor) {
        const board = document.getElementById('t_demo_board');
        if(!board) return;
        board.innerHTML = '';
        board.style.gridTemplateColumns = `repeat(${t_gridSize}, 1fr)`;
        const floor = t_floors[startFloor];
        board.style.background = ['linear-gradient(180deg,#78350F,#451A03)','linear-gradient(180deg,#166534,#14532D)','linear-gradient(180deg,#1E3A8A,#172554)'][startFloor] || '#1E293B';
        board.style.padding = '6px';
        board.style.gap = '2px';
        board.style.borderRadius = '14px';
        board.style.minHeight = 'auto';
        
        for(let y=0; y<t_gridSize; y++) {
            for(let x=0; x<t_gridSize; x++) {
                const cell = document.createElement('div');
                cell.id = `tdc-${x}-${y}`;
                cell.style.aspectRatio = '1';
                cell.style.minHeight = '24px';
                cell.style.borderRadius = '5px';
                cell.style.display = 'flex';
                cell.style.alignItems = 'center';
                cell.style.justifyContent = 'center';
                cell.style.background = 'rgba(30,41,59,0.7)';
                cell.style.border = '1.5px solid rgba(51,65,85,0.5)';
                cell.style.fontSize = '0.6rem';
                const isObs = floor.obstacles.some(o=>o.x===x&&o.y===y);
                const isLad = floor.ladders.some(l=>l.x===x&&l.y===y);
                const isTreas = t_treasurePos.x===x && t_treasurePos.y===y && t_treasurePos.z===startFloor;
                if(isObs) { cell.style.background = 'repeating-linear-gradient(45deg,#334155,#334155 3px,#1E293B 3px,#1E293B 6px)'; cell.style.borderColor = '#EF4444'; }
                if(isLad) { cell.style.background = 'rgba(245,158,11,0.3)'; cell.style.borderColor = '#F59E0B'; cell.innerHTML = '🪜'; }
                if(isTreas) { cell.style.background = 'rgba(245,158,11,0.3)'; cell.style.borderColor = '#FCD34D'; cell.innerHTML = '🏆'; }
                board.appendChild(cell);
            }
        }
    }
    
    async function t_playDemo() {
        if(t_demoAnimating || !t_currentSol) return;
        t_demoAnimating = true;
        const btnPlay = document.getElementById('t_demo_btn_play');
        const cursorEl = document.getElementById('t_demo_cursor');
        const revealBtn = document.getElementById('t_demo_reveal_btn');
        if(btnPlay) { btnPlay.disabled = true; btnPlay.innerHTML = '▶ Executando...'; }
        if(revealBtn) revealBtn.style.display = 'block';
        
        let px=0, py=0, pz=0, boardFloor=0;
        t_buildDemoBoard(0);
        
        // Show starting position
        const startCell = document.getElementById('tdc-0-0');
        if(startCell) { startCell.style.background = '#F59E0B'; startCell.innerHTML = '🤖'; }
        
        if(cursorEl) cursorEl.classList.add('visible');
        
        for(let i=0; i<t_currentSol.steps.length; i++) {
            const cmd = t_currentSol.steps[i];
            const prevX=px, prevY=py;
            
            if(cmd==='SUBIR'||cmd==='DESCER') {
                const oldZ = pz;
                if(cmd==='SUBIR' && pz < t_floors.length-1) pz++;
                else if(cmd==='DESCER' && pz > 0) pz--;
                if(pz !== oldZ) {
                    await t_sleep(500);
                    // Show transition on demo
                    const demoWrap = document.getElementById('t_demo_board_wrap');
                    if(demoWrap) demoWrap.style.opacity = '0.5';
                    await t_sleep(300);
                    t_buildDemoBoard(pz);
                    // Mark where we entered
                    const entryCell = document.getElementById(`tdc-${px}-${py}`);
                    if(entryCell) { entryCell.style.background = '#F59E0B'; entryCell.innerHTML = '🤖'; }
                    if(demoWrap) demoWrap.style.opacity = '1';
                    await t_sleep(400);
                    continue;
                }
            } else {
                if(cmd==='RIGHT') px++; else if(cmd==='LEFT') px--;
                else if(cmd==='DOWN') py++; else if(cmd==='UP') py--;
                
                // Check bounds
                if(px<0||px>=t_gridSize||py<0||py>=t_gridSize) { t_demoAnimating=false; if(btnPlay){btnPlay.disabled=false;btnPlay.innerHTML='▶ Assistir Demonstração';} return; }
                
                // Animate cursor
                await t_sleep(350);
                
                // Clear previous
                const prevCell = document.getElementById(`tdc-${prevX}-${prevY}`);
                if(prevCell && !(prevX===0&&prevY===0)) {
                    const floorT = t_floors[boardFloor];
                    const isLad = floorT.ladders.some(l=>l.x===prevX&&l.y===prevY);
                    if(isLad) { prevCell.style.background = 'rgba(245,158,11,0.3)'; prevCell.innerHTML = '🪜'; }
                    else { prevCell.style.background = 'rgba(30,41,59,0.7)'; prevCell.innerHTML = ''; }
                }
                
                // Mark new position
                const newCell = document.getElementById(`tdc-${px}-${py}`);
                if(newCell) {
                    const isTreasure = t_treasurePos.x===px && t_treasurePos.y===py && t_treasurePos.z===pz;
                    newCell.style.background = isTreasure ? '#10B981' : '#F59E0B';
                    newCell.innerHTML = isTreasure ? '🏆✨' : '🤖';
                }
            }
        }
        
        await t_sleep(600);
        if(btnPlay) { btnPlay.disabled = false; btnPlay.innerHTML = '🔄 Repetir Demonstração'; }
        t_demoAnimating = false;
    }
    
    function t_revealSteps() {
        if(t_errors < 3) return;
        const box = document.getElementById('t_solution_box');
        const stepsEl = document.getElementById('t_solution_steps');
        const textEl = document.getElementById('t_solution_text');
        if(!t_currentSol) return;
        if(stepsEl) stepsEl.innerHTML = t_currentSol.steps.map(s => `<span class="t-sol-step">${s}</span>`).join(' → ');
        if(textEl) textEl.innerHTML = `📝 <strong>Explicação:</strong> ${t_currentSol.text}`;
        if(box) box.classList.add('visible');
    }
    
    function t_highlightSolutionPath(steps) {
        let px=0, py=0, pz=0;
        const allCells = document.querySelectorAll('.tesouro-wrapper .solution-path');
        allCells.forEach(c => { c.classList.remove('solution-path'); delete c.dataset.step; });
        steps.forEach((cmd, i) => {
            if(cmd==='RIGHT') px++;
            else if(cmd==='LEFT') px--;
            else if(cmd==='DOWN') py++;
            else if(cmd==='UP') py--;
            else if(cmd==='SUBIR') pz++;
            else if(cmd==='DESCER') pz--;
            if(cmd==='SUBIR'||cmd==='DESCER') return;
            const cell = document.getElementById(`tc-${px}-${py}`);
            if(cell && !cell.classList.contains('obstacle') && !cell.classList.contains('treasure') && pz===t_treasurePos.z?false:true) {
                cell.classList.add('solution-path');
                cell.dataset.step = i+1;
            }
        });
    }

    function t_toggleCode() {
        t_codePanelOpen = !t_codePanelOpen;
        const body = document.getElementById('t_codePanelBody');
        const arrow = document.getElementById('t_code_arrow');
        if(body) body.style.display = t_codePanelOpen ? 'block' : 'none';
        if(arrow) arrow.textContent = t_codePanelOpen ? '▼' : '▶';
    }

    function t_initLevel() {
        if(t_level===1){
            t_gridSize=5; t_treasurePos={x:4,y:4,z:0}; t_robotPos={x:0,y:0,z:0};
            t_floors = [ { obstacles:[{x:1,y:1},{x:3,y:2}], ladders:[] } ];
        } else if(t_level===2){
            t_gridSize=6; t_treasurePos={x:5,y:5,z:1}; t_robotPos={x:0,y:0,z:0};
            t_floors = [
                { obstacles:[{x:1,y:1},{x:2,y:3},{x:4,y:2}], ladders:[{x:3,y:4}] },
                { obstacles:[{x:2,y:2},{x:4,y:4}], ladders:[{x:3,y:4}] }
            ];
        } else {
            t_gridSize=7; t_treasurePos={x:6,y:6,z:2}; t_robotPos={x:0,y:0,z:0};
            t_floors = [
                { obstacles:[{x:1,y:1},{x:2,y:2}], ladders:[{x:3,y:4}] },
                { obstacles:[{x:1,y:3},{x:4,y:2}], ladders:[{x:3,y:4},{x:5,y:1}] },
                { obstacles:[{x:4,y:5},{x:3,y:2}], ladders:[{x:5,y:1}] }
            ];
        }
        t_markCompletedLevels();
        t_renderBoard();
    }
    
    function t_markCompletedLevels() {
        const saved = JSON.parse(localStorage.getItem('tesouro_levels')||'[]');
        document.querySelectorAll('.tesouro-wrapper .level-btn').forEach(btn => {
            const lvl = parseInt(btn.dataset.level);
            if(saved.includes(lvl)) btn.classList.add('done');
            else btn.classList.remove('done');
        });
    }

    function t_renderBoard() {
        const board = document.getElementById('t_board');
        if(!board) return;
        board.style.gridTemplateColumns = `repeat(${t_gridSize}, 1fr)`;
        board.className = 'board floor-' + t_robotPos.z;
        board.innerHTML = '';
        const floor = t_floors[t_robotPos.z];
        const numFloors = t_floors.length;
        const hasUpperLadder = t_robotPos.z < numFloors - 1 && floor.ladders.length > 0;
        
        for(let y=0; y<t_gridSize; y++) {
            for(let x=0; x<t_gridSize; x++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                cell.id = `tc-${x}-${y}`;
                const isObs = floor.obstacles.some(o=>o.x===x&&o.y===y);
                const isLad = floor.ladders.some(l=>l.x===x&&l.y===y);
                const isTreas = t_treasurePos.x===x && t_treasurePos.y===y && t_treasurePos.z===t_robotPos.z;
                if(isObs) cell.classList.add('obstacle');
                if(isLad) {
                    cell.classList.add('ladder');
                    cell.classList.add(t_robotPos.z < numFloors-1 ? 'ladder-up' : 'ladder-down');
                }
                if(isTreas) {
                    cell.classList.add('treasure');
                    if(t_robotPos.z > 0) cell.classList.add('elevated');
                    cell.innerHTML = T_TREASURE_SVG;
                }
                board.appendChild(cell);
            }
        }
        t_drawRobot(t_robotPos.x, t_robotPos.y);
        t_updateFloorBar();
    }
    
    function t_updateFloorBar() {
        const dotsContainer = document.getElementById('t_floor_dots');
        const label = document.getElementById('t_floor_label');
        const numFloors = t_floors.length;
        if(!dotsContainer || !label) return;
        dotsContainer.innerHTML = '';
        for(let i=0; i<numFloors; i++) {
            const dot = document.createElement('span');
            dot.className = 't-floor-dot';
            if(i === t_robotPos.z) dot.classList.add('active');
            if(i < t_robotPos.z) dot.classList.add('done');
            dotsContainer.appendChild(dot);
        }
        label.innerText = t_robotPos.z + 1 + ' / ' + numFloors;
        if(t_robotPos.z === 0) label.style.color = '#94A3B8';
        else if(t_robotPos.z === 1) label.style.color = '#34D399';
        else label.style.color = '#F59E0B';
        t_renderFloorPreview();
    }
    
    function t_renderFloorPreview() {
        const panel = document.getElementById('t_floor_preview');
        const miniGrid = document.getElementById('t_mini_grid');
        const floorLabel = document.getElementById('t_preview_floor_label');
        const hint = document.getElementById('t_preview_hint');
        if(!panel || !miniGrid) return;
        
        const numFloors = t_floors.length;
        const currFloor = t_floors[t_robotPos.z];
        const floor = t_floors[t_robotPos.z];
        let previewFloorIdx = -1;
        let previewFloor = null;
        let direction = '';
        
        // Show the floor we can go to (prefer going up if there's a ladder)
        const hasLadderUp = t_robotPos.z < numFloors - 1 && floor.ladders.length > 0;
        const hasLadderDown = t_robotPos.z > 0 && floor.ladders.length > 0;
        
        if(hasLadderUp) {
            previewFloorIdx = t_robotPos.z + 1;
            previewFloor = t_floors[previewFloorIdx];
            direction = 'up';
        } else if(hasLadderDown) {
            previewFloorIdx = t_robotPos.z - 1;
            previewFloor = t_floors[previewFloorIdx];
            direction = 'down';
        }
        
        if(!previewFloor) {
            panel.classList.remove('visible');
            return;
        }
        
        panel.classList.add('visible');
        
        // Find the matching ladder that connects floors
        const ladderPositions = floor.ladders.filter(l => previewFloor.ladders.some(pl => pl.x === l.x && pl.y === l.y));
        const entryLadder = ladderPositions.length > 0 ? ladderPositions[0] : (previewFloor.ladders.length > 0 ? previewFloor.ladders[0] : null);
        
        if(direction === 'up') {
            floorLabel.innerText = 'Andar ' + (previewFloorIdx + 1) + ' (acima)';
            hint.innerText = 'Seu robô aparecerá na posição da escada ao SUBIR!';
        } else {
            floorLabel.innerText = 'Andar ' + (previewFloorIdx + 1) + ' (abaixo)';
            hint.innerText = 'Seu robô aparecerá na posição da escada ao DESCER!';
        }
        
        miniGrid.innerHTML = '';
        miniGrid.style.gridTemplateColumns = `repeat(${t_gridSize}, 1fr)`;
        miniGrid.style.maxWidth = `${t_gridSize * 26}px`;
        miniGrid.style.margin = '0 auto';
        
        // Column headers
        for(let col=0; col<t_gridSize; col++) {
            const hdr = document.createElement('div');
            hdr.style.textAlign = 'center';
            hdr.style.fontSize = '0.55rem';
            hdr.style.color = '#64748B';
            hdr.style.fontWeight = '800';
            hdr.innerText = col + 1;
            miniGrid.appendChild(hdr);
        }
        
        for(let y=0; y<t_gridSize; y++) {
            // Row label
            const rowLabel = document.createElement('div');
            rowLabel.style.fontSize = '0.55rem';
            rowLabel.style.color = '#64748B';
            rowLabel.style.fontWeight = '800';
            rowLabel.style.display = 'flex';
            rowLabel.style.alignItems = 'center';
            rowLabel.style.justifyContent = 'center';
            rowLabel.innerText = y + 1;
            // Actually let me skip row labels to keep it simple, use a different approach
            // Just render the grid without labels - simpler
            
            for(let x=0; x<t_gridSize; x++) {
                const cell = document.createElement('div');
                cell.className = 't-mini-cell';
                const isObs = previewFloor.obstacles.some(o=>o.x===x&&o.y===y);
                const isLad = previewFloor.ladders.some(l=>l.x===x&&l.y===y);
                const isTreas = t_treasurePos.x===x && t_treasurePos.y===y && t_treasurePos.z===previewFloorIdx;
                const isEntry = entryLadder && entryLadder.x===x && entryLadder.y===y;
                
                if(isObs) cell.classList.add('t-mini-obstacle');
                else if(isTreas) cell.classList.add('t-mini-treasure');
                else if(isEntry) cell.classList.add('t-mini-you');
                else if(isLad) cell.classList.add('t-mini-ladder');
                else cell.classList.add('t-mini-empty');
                
                // Tooltip
                const labelParts = [];
                if(isObs) labelParts.push('Obstáculo');
                if(isTreas) labelParts.push('TESOURO');
                if(isLad) labelParts.push('Escada');
                if(isEntry) labelParts.push('Sua chegada');
                cell.title = `(${x+1},${y+1})` + (labelParts.length > 0 ? ' - ' + labelParts.join(', ') : '');
                
                miniGrid.appendChild(cell);
            }
        }
    }
    
    async function t_showFloorTransition(direction, fromZ, toZ) {
        const overlay = document.getElementById('t_floor_transition');
        const text = document.getElementById('t_transition_text');
        if(!overlay || !text) return;
        text.innerText = direction === 'up' ? '⬆ SUBINDO...' : '⬇ DESCENDO...';
        overlay.classList.add('show');
        await t_sleep(600);
        t_renderBoard();
        t_drawRobot(t_robotPos.x, t_robotPos.y, 'climbing');
        await t_sleep(400);
        overlay.classList.remove('show');
    }

    function t_drawRobot(x, y, status='') {
        document.querySelectorAll('.tesouro-wrapper .robot').forEach(el => {
            el.classList.remove('robot','crash','win','moving');
            el.innerHTML = el.classList.contains('treasure') ? T_TREASURE_SVG : '';
        });
        const cell = document.getElementById(`tc-${x}-${y}`);
        if(cell) {
            cell.classList.add('robot');
            if(status) cell.classList.add(status);
            cell.innerHTML = T_ROBOT_SVG;
        }
    }

    function t_addCmd(c) {
        playSound('click');
        if(t_running) return;
        const area = document.getElementById('t_codeArea');
        if(t_seq.length===0) area.innerHTML = '';
        t_seq.push(c);
        const arrows = {UP:'⬆',DOWN:'⬇',LEFT:'⬅',RIGHT:'➡',SUBIR:'🪜⬆',DESCER:'🪜⬇'};
        const el = document.createElement('div');
        el.className = 'code-slot';
        el.innerText = arrows[c] || c;
        el.title = c;
        area.appendChild(el);
        t_updateArduinoCode();
    }

    function t_undoCmd() {
        if(t_running || t_seq.length===0) return;
        playSound('click');
        t_seq.pop();
        const area = document.getElementById('t_codeArea');
        const arrows = {UP:'⬆',DOWN:'⬇',LEFT:'⬅',RIGHT:'➡',SUBIR:'🪜⬆',DESCER:'🪜⬇'};
        if(t_seq.length===0) {
            area.innerHTML = '<span style="color:#64748B;">Adicione comandos...</span>';
        } else {
            area.innerHTML = t_seq.map(c=>`<div class="code-slot" title="${c}">${arrows[c]||c}</div>`).join('');
        }
        t_updateArduinoCode();
    }

    function t_clearCode() {
        t_seq=[];
        const area = document.getElementById('t_codeArea');
        if(area) area.innerHTML = '<span style="color:#64748B;">Adicione comandos...</span>';
        t_robotPos={x:0,y:0,z:0};
        t_renderBoard();
        t_updateArduinoCode();
        const box = document.getElementById('t_solution_box');
        if(box) box.classList.remove('visible');
        const demoWrap = document.getElementById('t_demo_board_wrap');
        if(demoWrap) demoWrap.classList.remove('visible');
        t_currentSol = null;
        // Clear solution highlights
        document.querySelectorAll('.tesouro-wrapper .solution-path').forEach(c => { c.classList.remove('solution-path'); delete c.dataset.step; });
        const cursor = document.getElementById('t_demo_cursor');
        if(cursor) cursor.classList.remove('visible');
    }

    function t_updateArduinoCode() {
        const el = document.getElementById('t_arduinoCode');
        if(!el) return;
        const kw = (word, tip) => `<span class="t-kw">${word}<span class="t-tip">${tip}</span></span>`;
        const fn = (word, tip) => `<span class="t-kw t-kw-fn">${word}<span class="t-tip">${tip}</span></span>`;
        let lines = [];
        lines.push(`<span style="color:#64748B;">// Robô Explorador — Arduino C++</span>`);
        lines.push(`${kw('int','Variável para números inteiros')} posX = 0, posY = 0, andar = 1;`);
        lines.push(``);
        lines.push(`${kw('void','Função que não retorna valor')} ${fn('setup','Roda UMA VEZ quando o Arduino liga')}() {`);
        lines.push(`  ${fn('Serial.begin','Inicia comunicação serial (Monitor)')}(9600);`);
        lines.push(`  ${fn('Serial.println','Imprime texto no Monitor Serial')}(<span style="color:#86EFAC;">"Missão iniciada!"</span>);`);
        lines.push(`}`);
        lines.push(``);
        lines.push(`${kw('void','Função que não retorna valor')} ${fn('loop','Repete PARA SEMPRE enquanto ligado')}() {`);
        if(t_seq.length === 0) {
            lines.push(`  <span style="color:#64748B;">// Adicione comandos para gerar o código!</span>`);
        } else {
            t_seq.forEach(cmd => {
                if(cmd==='UP')    lines.push(`  posY--; ${fn('moverFrente','Move o robô para frente')}();`);
                else if(cmd==='DOWN')  lines.push(`  posY++; ${fn('moverTras','Move o robô para trás')}();`);
                else if(cmd==='LEFT')  lines.push(`  posX--; ${fn('virarEsq','Gira o robô para a esquerda')}();`);
                else if(cmd==='RIGHT') lines.push(`  posX++; ${fn('virarDir','Gira o robô para a direita')}();`);
                else if(cmd==='SUBIR') lines.push(`  andar++; ${fn('subirEscada','Usa a escada para subir andar')}();`);
                else if(cmd==='DESCER') lines.push(`  andar--; ${fn('descerEscada','Usa a escada para descer andar')}();`);
            });
            lines.push(`  ${fn('verificarObjetivo','Checa se chegou ao tesouro')}(posX, posY, andar);`);
            lines.push(`  ${kw('delay','Pausa o Arduino por X milissegundos')}(400);`);
        }
        lines.push(`}`);
        el.innerHTML = lines.join('\n');
    }

    function t_copyCode() {
        const el = document.getElementById('t_arduinoCode');
        if(el) { navigator.clipboard.writeText(el.innerText); alert('Código copiado! 📋'); }
    }

    function t_sleep(ms){ return new Promise(r=>setTimeout(r,ms)); }

    function t_getSolutionCode(lvl) {
        if(lvl === 1) {
            return `// Resolução C++ (Caça ao Tesouro — Nível 1):\nfor (int i = 0; i < 4; i++) {\n    direita();\n}\nfor (int i = 0; i < 4; i++) {\n    baixo();\n}`;
        } else if(lvl === 2) {
            return `// Resolução C++ (Caça ao Tesouro — Nível 2):\nfor (int i = 0; i < 3; i++) {\n    direita();\n}\nsubirEscada();\nfor (int i = 0; i < 4; i++) {\n    baixo();\n}`;
        } else {
            return `// Resolução C++ (Caça ao Tesouro — Nível 3):\nfor (int i = 0; i < 3; i++) { direita(); }\nsubirEscada();\nfor (int i = 0; i < 2; i++) { direita(); }\nsubirEscada();\nfor (int i = 0; i < 5; i++) { baixo(); }`;
        }
    }

    function t_triggerError(title, msg, hint) {
        const solCode = t_getSolutionCode(t_level);
        triggerErrorSplash(title, msg, hint, '💥', solCode, 'tesouro_lvl_' + t_level, 3);
        t_errors++;
        t_updateErrorCounter();
        t_running = false;
    }

    async function t_runCode() {
        if(t_running || t_seq.length===0) return;
        playSound('click');
        t_running = true;
        t_robotPos = {x:0,y:0,z:0};
        t_renderBoard();
        for(let i=0; i<t_seq.length; i++) {
            await t_sleep(450);
            const cmd = t_seq[i];
            let nx=t_robotPos.x, ny=t_robotPos.y, nz=t_robotPos.z;
            const floor = t_floors[nz];
            if(cmd==='UP') ny--; if(cmd==='DOWN') ny++; if(cmd==='LEFT') nx--; if(cmd==='RIGHT') nx++;
            if(cmd==='SUBIR'||cmd==='DESCER') {
                if(floor.ladders.some(l=>l.x===t_robotPos.x&&l.y===t_robotPos.y)) {
                    if(cmd==='SUBIR'&&nz<t_floors.length-1) nz++;
                    else if(cmd==='DESCER'&&nz>0) nz--;
                    else { t_drawRobot(t_robotPos.x,t_robotPos.y,'crash'); t_triggerError('Sem saída!','Não há mais andares nessa direção!','Use a escada 🪜 na posição certa.'); return; }
                    const dir = cmd==='SUBIR'?'up':'down';
                    playSound('success');
                    t_robotPos={x:t_robotPos.x,y:t_robotPos.y,z:nz};
                    await t_showFloorTransition(dir, t_robotPos.z, nz);
                    continue;
                } else { t_drawRobot(t_robotPos.x,t_robotPos.y,'crash'); t_triggerError('Sem escada!','Você precisa estar sobre a escada 🪜 para subir ou descer!','Posicione o robô exatamente no quadrado com a escada.'); return; }
            }
            if(nx<0||nx>=t_gridSize||ny<0||ny>=t_gridSize) {
                t_drawRobot(t_robotPos.x,t_robotPos.y,'crash'); t_triggerError('Saiu do mapa!','O robô foi além dos limites do grid.','Ajuste a quantidade de passos para não passar dos limites.'); return;
            }
            if(floor.obstacles.some(o=>o.x===nx&&o.y===ny)) {
                t_robotPos={x:nx,y:ny,z:nz}; t_drawRobot(nx,ny,'crash'); t_triggerError('Bloqueado!','O robô bateu num obstáculo ✖!','Planeje uma rota desviando das barreiras.'); return;
            }
            const prevX=t_robotPos.x, prevY=t_robotPos.y;
            t_robotPos={x:nx,y:ny,z:nz};
            playSound('step');
            const prevCell = document.getElementById(`tc-${prevX}-${prevY}`);
            if(prevCell) { prevCell.classList.remove('robot'); prevCell.innerHTML = ''; }
            const newCell = document.getElementById(`tc-${nx}-${ny}`);
            if(newCell) { newCell.classList.add('robot','moving'); newCell.innerHTML = T_ROBOT_SVG; setTimeout(()=>newCell.classList.remove('moving'),300); }
        }
        if(t_robotPos.x===t_treasurePos.x&&t_robotPos.y===t_treasurePos.y&&t_robotPos.z===t_treasurePos.z) {
            t_drawRobot(t_robotPos.x,t_robotPos.y,'win');
            t_spawnConfetti();
            const nextMsg = t_level < 3 ? `<br><br><span style="color:#38BDF8;font-size:0.9rem;">Nível ${t_level+1} desbloqueado em 3 segundos...</span>` : '';
            t_showModal('🏆','Tesouro Encontrado! 🎉','O robô chegou ao pote de ouro! Incrível!'+nextMsg);
            playSound('success');
            let saved=JSON.parse(localStorage.getItem('tesouro_levels')||'[]');
            if(!saved.includes(t_level)) saved.push(t_level);
            localStorage.setItem('tesouro_levels', JSON.stringify(saved));
            updateTrail();
            t_checkAutoAdvance();
        } else {
            t_triggerError('Quase lá!','O robô não chegou ao tesouro. Revise a sequência!','Verifique se não faltaram comandos para alcançar o baú.');
        }
        t_running=false;
    }

    function t_showModal(icon,title,text){ document.getElementById('t_mIcon').innerText=icon; document.getElementById('t_mTitle').innerText=title; document.getElementById('t_mText').innerText=text; document.getElementById('t_modal').classList.add('active'); }
    function t_closeModal(){ document.getElementById('t_modal').classList.remove('active'); if(t_autoAdvTimer){clearTimeout(t_autoAdvTimer);t_autoAdvTimer=null;} t_clearCode(); }
    
    function t_spawnConfetti() {
        const emojis = ['🎉','🌟','✨','💫','🎊','⭐','🔶','💛','🎯','🏆'];
        for(let i=0; i<20; i++) {
            setTimeout(() => {
                const confetti = document.createElement('div');
                confetti.className = 't-confetti';
                confetti.style.left = (5 + Math.random() * 90) + '%';
                confetti.style.animationDuration = (2 + Math.random() * 2) + 's';
                confetti.style.animationDelay = Math.random() * 0.5 + 's';
                confetti.innerText = emojis[Math.floor(Math.random() * emojis.length)];
                document.body.appendChild(confetti);
                setTimeout(() => confetti.remove(), 3000);
            }, i * 60);
        }
    }


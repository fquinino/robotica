/* ==========================================================================
   AULA 6 — INTRODUÇÃO À ELETRÔNICA & LEI DE OHM NO ARDUINO
   Módulo Interativo: Tubo de Elétrons, Multímetro Digital & Mini-IDE C/C++
   Cálculo do Resistor Limitador de LED, Quedas por Cor e Proteção do ATmega328P
   ========================================================================== */

function loadEletronica() {
    const container = document.getElementById('eletronica-container');
    if (!container) return;

    container.innerHTML = `
        <style>
            .elet-wrapper { color:#E2E8F0; max-width:1050px; margin:0 auto; font-family:'Quicksand', 'Nunito', sans-serif; }

            /* CABEÇALHO DA AULA */
            .elet-header-card { background:linear-gradient(135deg, rgba(248,113,113,0.18), rgba(30,41,59,0.92)); border:2px solid #F87171; border-radius:24px; padding:18px 22px; margin-bottom:16px; box-shadow:0 10px 30px rgba(0,0,0,0.4); display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px; }
            .elet-header-info h2 { font-family:'Fredoka One', cursive; color:#F87171; font-size:clamp(1.2rem, 3vw, 1.6rem); margin:0 0 4px; display:flex; align-items:center; gap:10px; }
            .elet-header-info p { color:#CBD5E1; margin:0; font-size:0.92rem; line-height:1.45; }
            .elet-guide-toggle-btn { background:#1E293B; border:2px solid #F87171; color:#F87171; padding:8px 16px; border-radius:14px; font-weight:800; font-size:0.88rem; cursor:pointer; display:flex; align-items:center; gap:8px; transition:0.2s all; }
            .elet-guide-toggle-btn:hover { background:#F87171; color:#0F172A; transform:translateY(-2px); box-shadow:0 4px 15px rgba(248,113,113,0.4); }

            /* OS 3 PASSOS DA ELETRÔNICA (SUPER FÁCIL PARA 12 ANOS) */
            .elet-steps-container { display:grid; grid-template-columns:repeat(auto-fit, minmax(260px, 1fr)); gap:12px; margin-bottom:16px; }
            .elet-step-card { background:#0F172A; border:2px solid #334155; border-radius:18px; padding:14px 16px; transition:0.2s all; display:flex; flex-direction:column; gap:8px; cursor:pointer; }
            .elet-step-card:hover { transform:translateY(-2px); border-color:#F87171; box-shadow:0 8px 20px rgba(0,0,0,0.4); }
            .elet-step-badge { display:inline-flex; align-items:center; gap:6px; font-size:0.75rem; font-weight:900; padding:3px 10px; border-radius:12px; width:fit-content; }
            .elet-step-title { font-family:'Fredoka One', cursive; font-size:1.02rem; color:white; display:flex; align-items:center; gap:8px; margin:0; }
            .elet-step-desc { font-size:0.86rem; color:#CBD5E1; line-height:1.5; margin:0; }
            .elet-step-highlight { background:#1E293B; border-radius:10px; padding:8px 10px; font-size:0.8rem; border-left:3px solid #38BDF8; color:#E2E8F0; }

            /* GUIA INTERATIVO COM 6 SLIDES DA TEORIA */
            .elet-guide-card { background:#0F172A; border:2px solid #F87171; border-radius:22px; padding:18px 20px; margin-bottom:18px; box-shadow:0 12px 35px rgba(0,0,0,0.45); transition:all 0.3s ease; }
            .elet-guide-tabs { display:flex; gap:8px; overflow-x:auto; padding-bottom:8px; border-bottom:1px solid #1E293B; margin-bottom:14px; scrollbar-width:thin; }
            .elet-guide-tab { background:#1E293B; border:1px solid #334155; color:#94A3B8; padding:8px 14px; border-radius:12px; font-weight:800; font-size:0.85rem; cursor:pointer; transition:0.2s all; white-space:nowrap; display:flex; align-items:center; gap:6px; }
            .elet-guide-tab:hover { color:#E2E8F0; border-color:#F87171; }
            .elet-guide-tab.active { background:linear-gradient(135deg, rgba(248,113,113,0.25), rgba(239,68,68,0.25)); color:#F87171; border-color:#F87171; box-shadow:0 0 12px rgba(248,113,113,0.3); }

            .elet-slide-content { display:none; animation:eletFadeIn 0.3s ease; }
            .elet-slide-content.active { display:block; }
            @keyframes eletFadeIn { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:translateY(0); } }

            .elet-guide-footer { display:flex; justify-content:space-between; align-items:center; margin-top:16px; padding-top:12px; border-top:1px solid #1E293B; flex-wrap:wrap; gap:10px; }
            .elet-guide-nav-btn { background:#1E293B; border:1px solid #475569; color:#E2E8F0; padding:8px 16px; border-radius:12px; font-weight:800; font-size:0.85rem; cursor:pointer; transition:0.2s; display:flex; align-items:center; gap:6px; }
            .elet-guide-nav-btn:hover { border-color:#F87171; color:#F87171; background:#0F172A; }
            .elet-guide-nav-btn.primary { background:linear-gradient(135deg, #F87171, #EF4444); color:white; border:none; font-weight:900; box-shadow:0 4px 15px rgba(248,113,113,0.35); }
            .elet-guide-nav-btn.primary:hover { background:linear-gradient(135deg, #FCA5A5, #F87171); }
            .elet-guide-progress-dots { display:flex; gap:6px; align-items:center; }
            .elet-dot { width:8px; height:8px; border-radius:50%; background:#334155; transition:0.2s all; }
            .elet-dot.active { width:22px; border-radius:10px; background:#F87171; }

            /* ================= QUIZ: O DESAFIO DO TUBO DE ÁGUA ================= */
            .elet-quiz-toggle-btn { background:#1E293B; border:2px solid #8B5CF6; color:#DDD6FE; padding:8px 16px; border-radius:14px; font-weight:800; font-size:0.88rem; cursor:pointer; display:flex; align-items:center; gap:8px; transition:0.2s all; }
            .elet-quiz-toggle-btn:hover { background:#8B5CF6; color:#FFFFFF; transform:translateY(-2px); box-shadow:0 4px 15px rgba(139,92,246,0.4); }
            .elet-quiz-card { background:#0B1120; border:2px solid #8B5CF6; border-radius:22px; padding:22px 24px; margin-bottom:20px; box-shadow:0 12px 35px rgba(0,0,0,0.55); position:relative; overflow:hidden; }
            .elet-quiz-card::before { content:''; position:absolute; top:-60px; right:-60px; width:140px; height:140px; background:radial-gradient(circle, rgba(139,92,246,0.2) 0%, transparent 70%); pointer-events:none; }
            .elet-quiz-header { display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:12px; margin-bottom:16px; border-bottom:1px solid #1E293B; padding-bottom:14px; }
            .elet-quiz-title-area h3 { margin:0 0 6px 0; font-family:'Fredoka One', cursive; color:#DDD6FE; font-size:1.25rem; display:flex; align-items:center; gap:10px; }
            .elet-quiz-title-area p { margin:0; color:#94A3B8; font-size:0.88rem; }
            .elet-quiz-stats { display:flex; align-items:center; gap:10px; flex-wrap:wrap; }
            .elet-quiz-badge-counter { background:#0F172A; border:1px solid #8B5CF6; color:#FCD34D; font-weight:900; padding:6px 14px; border-radius:12px; font-size:0.88rem; font-family:'Fira Code', monospace; }
            .elet-quiz-badge-score { background:#0F172A; border:1px solid #334155; color:#38BDF8; font-weight:900; padding:6px 14px; border-radius:12px; font-size:0.88rem; }
            .elet-quiz-progress-bar { width:100%; height:8px; background:#1E293B; border-radius:6px; overflow:hidden; margin-bottom:18px; }
            .elet-quiz-progress-fill { height:100%; background:linear-gradient(90deg, #8B5CF6, #38BDF8); width:20%; transition:width 0.3s ease; }
            .elet-quiz-q-box { background:#0F172A; border:1px solid #1E293B; border-radius:18px; padding:18px 20px; margin-bottom:16px; }
            .elet-quiz-q-topic { display:inline-flex; align-items:center; gap:6px; font-size:0.75rem; font-weight:900; text-transform:uppercase; letter-spacing:0.5px; padding:3px 10px; border-radius:10px; margin-bottom:10px; }
            .elet-quiz-q-text { color:#F8FAFC; font-size:1.12rem; font-weight:800; line-height:1.5; margin:0; }
            .elet-quiz-options-list { display:flex; flex-direction:column; gap:10px; margin-bottom:16px; }
            .elet-quiz-opt-btn { background:#1E293B; border:2px solid #334155; border-radius:14px; padding:14px 18px; color:#E2E8F0; font-weight:800; font-size:0.92rem; cursor:pointer; transition:0.2s all; display:flex; align-items:center; gap:14px; text-align:left; line-height:1.4; }
            .elet-quiz-opt-btn:hover:not(:disabled) { background:#273549; border-color:#8B5CF6; transform:translateX(4px); color:white; }
            .elet-quiz-opt-letter { width:32px; height:32px; border-radius:50%; background:#0F172A; color:#FCD34D; display:flex; align-items:center; justify-content:center; font-weight:900; font-size:0.88rem; flex-shrink:0; border:1px solid #334155; }
            .elet-quiz-opt-btn.correct { background:#064E3B !important; border-color:#10B981 !important; color:#ECFDF5 !important; }
            .elet-quiz-opt-btn.correct .elet-quiz-opt-letter { background:#10B981; color:#064E3B; border-color:#10B981; }
            .elet-quiz-opt-btn.wrong { background:#450A0A !important; border-color:#EF4444 !important; color:#FEF2F2 !important; }
            .elet-quiz-opt-btn.wrong .elet-quiz-opt-letter { background:#EF4444; color:white; border-color:#EF4444; }
            .elet-quiz-feedback-box { min-height:50px; border-radius:14px; padding:12px 16px; display:none; align-items:center; gap:12px; font-size:0.92rem; font-weight:800; animation:eletFadeIn 0.3s ease; }
            .elet-quiz-feedback-box.show { display:flex; }
            .elet-quiz-feedback-box.success { background:rgba(16,185,129,0.15); border:1px solid #10B981; color:#34D399; }
            .elet-quiz-feedback-box.error { background:rgba(239,68,68,0.15); border:1px solid #EF4444; color:#FCA5A5; }
            .elet-quiz-win-box { text-align:center; padding:24px 16px; animation:eletFadeIn 0.4s ease; }
            .elet-quiz-recap-grid { display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:12px; margin:20px 0; text-align:left; }
            /* ================= CALCULADORA INTERATIVA DE RESISTORES (4 FAIXAS) ================= */
            .elet-calc-toggle-btn { background:#1E293B; border:2px solid #F59E0B; color:#FDE68A; padding:8px 16px; border-radius:14px; font-weight:800; font-size:0.88rem; cursor:pointer; display:flex; align-items:center; gap:8px; transition:0.2s all; }
            .elet-calc-toggle-btn:hover { background:#F59E0B; color:#0F172A; transform:translateY(-2px); box-shadow:0 4px 15px rgba(245,158,11,0.4); }

            .elet-res-calc-widget { background:#0B1120; border:2px solid #F59E0B; border-radius:22px; padding:22px 24px; margin-bottom:24px; box-shadow:0 12px 35px rgba(0,0,0,0.55); position:relative; overflow:hidden; }
            .elet-res-calc-widget::before { content:''; position:absolute; top:-60px; right:-60px; width:150px; height:150px; background:radial-gradient(circle, rgba(245,158,11,0.18) 0%, transparent 70%); pointer-events:none; }

            .elet-calc-header { display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:14px; margin-bottom:18px; border-bottom:1px solid #1E293B; padding-bottom:14px; }
            .elet-calc-title-area h3 { margin:4px 0 6px 0; font-family:'Fredoka One', cursive; color:#FDE68A; font-size:1.28rem; display:flex; align-items:center; gap:10px; }
            .elet-calc-title-area p { margin:0; color:#94A3B8; font-size:0.88rem; max-width:620px; }
            .elet-calc-badge { background:rgba(245,158,11,0.15); color:#FDE68A; border:1px solid #F59E0B; padding:3px 10px; border-radius:8px; font-size:0.75rem; font-weight:900; text-transform:uppercase; letter-spacing:0.5px; display:inline-block; }

            .elet-calc-presets { display:flex; align-items:center; gap:8px; flex-wrap:wrap; }
            .elet-preset-btn { background:#1E293B; border:1px solid #334155; color:#E2E8F0; padding:6px 12px; border-radius:10px; font-size:0.8rem; font-weight:800; cursor:pointer; transition:0.2s all; }
            .elet-preset-btn:hover { background:#334155; border-color:#F59E0B; color:white; transform:translateY(-1px); }
            .elet-preset-btn.highlight { background:rgba(249,115,22,0.2); border-color:#F97316; color:#FDBA74; box-shadow:0 0 10px rgba(249,115,22,0.25); }

            .elet-resistor-stage { display:grid; grid-template-columns:1.2fr 0.8fr; gap:18px; align-items:center; background:#070B14; border:1px solid #1E293B; border-radius:18px; padding:18px 22px; margin-bottom:18px; }
            @media (max-width:850px) { .elet-resistor-stage { grid-template-columns:1fr; } }

            .elet-resistor-graphic-container { display:flex; align-items:center; justify-content:center; width:100%; position:relative; padding:15px 0; }
            .elet-resistor-lead-wire { height:8px; width:45px; background:linear-gradient(180deg, #94A3B8, #475569); border-radius:3px; box-shadow:0 2px 4px rgba(0,0,0,0.5); }
            .elet-resistor-body-realistic { width:240px; height:68px; background:linear-gradient(180deg, #F0DFCA 0%, #D4B996 50%, #9C7E5A 100%); border-radius:24px; position:relative; box-shadow:inset 0 4px 8px rgba(255,255,255,0.4), inset 0 -4px 8px rgba(0,0,0,0.4), 0 8px 20px rgba(0,0,0,0.5); display:flex; align-items:center; border:2px solid #8C6D4F; }

            .elet-rband-realistic { position:absolute; height:100%; width:16px; transition:background 0.3s ease; box-shadow:0 0 4px rgba(0,0,0,0.4); display:flex; justify-content:center; }
            .elet-rband-realistic.band-1 { left:35px; }
            .elet-rband-realistic.band-2 { left:75px; }
            .elet-rband-realistic.band-3 { left:115px; }
            .elet-rband-realistic.band-4 { left:185px; }
            .elet-rband-tag { position:absolute; bottom:-22px; font-size:0.72rem; font-family:'Fira Code', monospace; font-weight:900; color:#CBD5E1; background:#0F172A; border:1px solid #334155; padding:1px 5px; border-radius:6px; white-space:nowrap; }

            .elet-calc-result-display { display:flex; flex-direction:column; gap:10px; align-items:flex-start; justify-content:center; border-left:1px solid #1E293B; padding-left:18px; }
            @media (max-width:850px) { .elet-calc-result-display { border-left:none; border-top:1px solid #1E293B; padding-left:0; padding-top:14px; align-items:center; text-align:center; } }

            .elet-calc-val-number { font-family:'Fredoka One', cursive; font-size:2.2rem; color:#FDE68A; line-height:1.1; margin-top:2px; text-shadow:0 2px 10px rgba(245,158,11,0.3); }

            .elet-apply-bench-btn { background:linear-gradient(135deg, #F59E0B, #D97706); color:#0F172A; border:none; padding:10px 18px; border-radius:12px; font-weight:900; font-size:0.86rem; cursor:pointer; display:flex; align-items:center; gap:8px; box-shadow:0 4px 12px rgba(245,158,11,0.3); transition:0.2s all; }
            .elet-apply-bench-btn:hover { transform:translateY(-2px); box-shadow:0 6px 16px rgba(245,158,11,0.45); }

            .elet-calc-selectors-grid { display:grid; grid-template-columns:repeat(auto-fit, minmax(180px, 1fr)); gap:12px; margin-bottom:16px; }
            .elet-calc-col { background:#0F172A; border:1px solid #1E293B; border-radius:14px; padding:12px; display:flex; flex-direction:column; gap:8px; }
            .elet-calc-col-header { display:flex; align-items:center; gap:8px; }
            .elet-calc-band-num { width:22px; height:22px; border-radius:6px; background:#F59E0B; color:#0F172A; font-weight:900; font-size:0.75rem; display:flex; align-items:center; justify-content:center; }
            .elet-calc-col-header b { font-size:0.84rem; color:#F1F5F9; display:block; line-height:1.2; }
            .elet-calc-col-header small { font-size:0.72rem; color:#94A3B8; display:block; }
            .elet-band-select { width:100%; background:#1E293B; border:1px solid #334155; color:#F8FAFC; padding:8px 10px; border-radius:10px; font-weight:800; font-size:0.82rem; cursor:pointer; outline:none; transition:0.2s all; }
            .elet-band-select:focus { border-color:#F59E0B; }

            .elet-band-swatches { display:flex; gap:4px; flex-wrap:wrap; margin-top:2px; }
            .elet-swatch-dot { width:16px; height:16px; border-radius:50%; border:1px solid #475569; cursor:pointer; transition:0.15s transform; }
            .elet-swatch-dot:hover { transform:scale(1.25); border-color:#FFFFFF; }
            .elet-swatch-dot.active { transform:scale(1.3); border:2px solid #FFFFFF; box-shadow:0 0 6px rgba(255,255,255,0.7); }

            .elet-calc-explanation-row { display:grid; grid-template-columns:1fr 1fr; gap:12px; }
            @media (max-width:850px) { .elet-calc-explanation-row { grid-template-columns:1fr; } }
            .elet-calc-step-formula { background:#0F172A; border:1px solid #334155; border-radius:14px; padding:12px 14px; font-size:0.84rem; line-height:1.55; color:#CBD5E1; }
            .elet-calc-arduino-verdict { border-radius:14px; padding:12px 14px; font-size:0.84rem; line-height:1.55; font-weight:700; display:flex; align-items:center; gap:10px; }

            /* TABELA DE DIMENSIONAMENTO POR COR */
            .elet-color-table { width:100%; border-collapse:collapse; margin-top:10px; font-size:0.86rem; border-radius:12px; overflow:hidden; }
            .elet-color-table th { background:#1E293B; color:#F87171; text-align:left; padding:8px 12px; font-weight:900; border-bottom:2px solid #334155; }
            .elet-color-table td { padding:8px 12px; border-bottom:1px solid #1E293B; color:#CBD5E1; }
            .elet-color-table tr:hover td { background:rgba(248,113,113,0.06); }

            /* NAVEGAÇÃO DOS NÍVEIS */
            .elet-level-bar { display:grid; grid-template-columns:repeat(auto-fit, minmax(180px, 1fr)); gap:10px; margin-bottom:18px; width:100%; }
            .elet-level-btn { background:#1E293B; border:2px solid #334155; color:#94A3B8; padding:12px 14px; border-radius:18px; font-weight:800; cursor:pointer; font-size:0.88rem; transition:0.2s all; display:flex; align-items:center; justify-content:space-between; text-align:left; }
            .elet-level-btn:hover { border-color:#F87171; color:white; transform:translateY(-2px); box-shadow:0 6px 15px rgba(0,0,0,0.3); }
            .elet-level-btn.active { background:linear-gradient(135deg, #1E293B, #0F172A); color:white; border-color:#F87171; box-shadow:0 0 20px rgba(248,113,113,0.35); }
            .elet-level-btn.active .elet-lvl-num { background:#F87171; color:#0F172A; font-weight:900; }
            .elet-level-btn.done { border-color:#10B981; color:#34D399; }
            .elet-lvl-left { display:flex; align-items:center; gap:10px; }
            .elet-lvl-num { width:28px; height:28px; border-radius:8px; background:#334155; color:#E2E8F0; display:flex; align-items:center; justify-content:center; font-weight:900; font-size:0.82rem; }
            .elet-lvl-info { display:flex; flex-direction:column; }
            .elet-lvl-title { font-weight:900; font-size:0.88rem; color:#F1F5F9; }
            .elet-lvl-sub { font-size:0.75rem; color:#94A3B8; }
            .elet-lvl-status { font-size:0.95rem; color:#475569; }

            /* CARD DE HISTÓRIA / MISSÃO ATIVA */
            .elet-story-card { background:#0F172A; border:2px solid #F87171; border-radius:18px; padding:14px 18px; margin-bottom:16px; box-shadow:0 6px 20px rgba(0,0,0,0.3); }
            .elet-story-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:6px; flex-wrap:wrap; gap:8px; }
            .elet-story-title { font-family:'Fredoka One'; color:#F87171; font-size:1.05rem; display:flex; align-items:center; gap:8px; }
            .elet-story-badge { font-family:'Fira Code', monospace; font-size:0.8rem; background:rgba(248,113,113,0.15); color:#FCA5A5; padding:3px 10px; border-radius:8px; border:1px dashed #F87171; }
            .elet-story-text { color:#CBD5E1; font-size:0.9rem; line-height:1.55; margin:0; }

            /* CENÁRIO GRÁFICO E BANCADA DE ELETRÔNICA */
            .elet-stage-card { background:#090D16; border:2px solid #334155; border-radius:24px; padding:18px; margin-bottom:18px; box-shadow:0 12px 35px rgba(0,0,0,0.6); position:relative; overflow:hidden; }
            .elet-stage-hud { display:flex; justify-content:space-between; align-items:center; background:#0F172A; border:1px solid #1E293B; border-radius:14px; padding:10px 16px; margin-bottom:14px; flex-wrap:wrap; gap:10px; }
            .elet-hud-item { display:flex; align-items:center; gap:8px; font-size:0.85rem; font-weight:800; }
            .elet-pill { padding:3px 10px; border-radius:20px; font-weight:900; font-size:0.8rem; display:inline-flex; align-items:center; gap:5px; font-family:'Fira Code', monospace; }
            .elet-pill.volt { background:rgba(239,68,68,0.2); color:#F87171; border:1px solid #EF4444; }
            .elet-pill.res { background:rgba(245,158,11,0.2); color:#FBBF24; border:1px solid #F59E0B; }
            .elet-pill.curr { background:rgba(56,189,248,0.2); color:#38BDF8; border:1px solid #0284C7; }
            .elet-pill.pwr { background:rgba(16,185,129,0.2); color:#34D399; border:1px solid #10B981; }

            /* SELETOR INTERATIVO DE COR DO LED NA BANCADA */
            .elet-color-selector { display:flex; align-items:center; gap:8px; margin-bottom:12px; background:#0F172A; border:1px solid #334155; padding:8px 12px; border-radius:14px; flex-wrap:wrap; }
            .elet-color-btn { background:#1E293B; border:1px solid #475569; color:#E2E8F0; padding:5px 12px; border-radius:10px; font-size:0.8rem; font-weight:800; cursor:pointer; transition:0.2s; display:flex; align-items:center; gap:6px; }
            .elet-color-btn:hover { border-color:#F87171; transform:translateY(-1px); }
            .elet-color-btn.active { border-color:#F87171; background:rgba(248,113,113,0.2); color:#FCA5A5; box-shadow:0 0 10px rgba(248,113,113,0.3); }

            /* SIMULADOR INTERATIVO: TUBO & MULTÍMETRO */
            .elet-bench-grid { display:grid; grid-template-columns:1fr 340px; gap:16px; }
            @media (max-width:850px) { .elet-bench-grid { grid-template-columns:1fr; } }

            .elet-pipe-chamber { background:#0F172A; border:2px solid #334155; border-radius:18px; padding:16px; display:flex; flex-direction:column; gap:14px; }
            .elet-pipe-view { position:relative; height:110px; background:#020617; border-radius:14px; border:2px solid #475569; overflow:hidden; display:flex; align-items:center; justify-content:center; }
            .elet-pipe-barrel { width:92%; height:44px; background:linear-gradient(180deg,#1E293B,#0F172A); border:2px solid #64748B; border-radius:22px; position:relative; overflow:hidden; display:flex; align-items:center; }
            
            .elet-pipe-narrow { position:absolute; left:48%; top:0; width:44px; height:100%; background:linear-gradient(180deg,#78350F,#451A03); border:2px solid #F59E0B; border-radius:6px; z-index:20; display:flex; align-items:center; justify-content:center; font-size:0.7rem; font-weight:900; color:#FDE68A; transition:all 0.4s ease; }
            
            .elet-electron-stream { position:absolute; width:100%; height:100%; display:flex; align-items:center; overflow:hidden; pointer-events:none; }
            .elet-electron { width:12px; height:12px; border-radius:50%; background:#38BDF8; box-shadow:0 0 10px #38BDF8; position:absolute; animation:electronFlow linear infinite; }
            @keyframes electronFlow {
                from { left:-15px; opacity:0; }
                10% { opacity:1; }
                90% { opacity:1; }
                to { left:102%; opacity:0; }
            }

            /* MULTÍMETRO DIGITAL REALISTA */
            .elet-multimeter { background:linear-gradient(145deg, #1E293B, #0F172A); border:3px solid #64748B; border-radius:18px; padding:16px; display:flex; flex-direction:column; gap:12px; box-shadow:inset 0 0 20px rgba(0,0,0,0.8); }
            .elet-multi-lcd { background:#064E3B; border:3px solid #022C22; border-radius:10px; padding:10px 14px; font-family:'Fira Code', monospace; color:#34D399; box-shadow:inset 0 0 15px rgba(0,0,0,0.7), 0 0 12px rgba(16,185,129,0.25); text-align:right; }
            .elet-multi-lcd-label { font-size:0.7rem; color:#A7F3D0; text-transform:uppercase; letter-spacing:1px; margin-bottom:2px; display:flex; justify-content:space-between; }
            .elet-multi-lcd-val { font-size:1.8rem; font-weight:900; letter-spacing:1px; }

            .elet-multi-stats { display:grid; grid-template-columns:1fr 1fr; gap:8px; }
            .elet-m-stat { background:#090D16; border:1px solid #334155; border-radius:10px; padding:8px 10px; }
            .elet-m-label { font-size:0.7rem; color:#94A3B8; font-weight:800; text-transform:uppercase; }
            .elet-m-value { font-family:'Fira Code', monospace; font-size:1.05rem; font-weight:900; margin-top:2px; }

            /* POLARIDADE & ANATOMIA DO LED */
            .elet-polarity-box { background:#090D16; border:1px solid #F87171; border-radius:12px; padding:10px 14px; font-size:0.8rem; line-height:1.5; }
            .elet-pol-lead { display:inline-block; padding:1px 6px; border-radius:4px; font-weight:900; font-family:'Fira Code'; font-size:0.75rem; }
            .elet-pol-lead.anode { background:rgba(239,68,68,0.25); color:#FCA5A5; border:1px solid #EF4444; }
            .elet-pol-lead.cathode { background:rgba(56,189,248,0.25); color:#7DD3FC; border:1px solid #38BDF8; }

            /* LED REATIVO NO CIRCUITO */
            .elet-led-chamber { background:#0F172A; border:2px solid #334155; border-radius:14px; padding:12px; display:flex; align-items:center; justify-content:space-between; gap:12px; }
            .elet-led-bulb { width:46px; height:46px; border-radius:50%; background:#334155; border:3px solid #64748B; display:flex; align-items:center; justify-content:center; font-size:1.4rem; position:relative; transition:all 0.3s ease; }
            .elet-led-bulb.lit-safe { background:#EF4444; border-color:#FCA5A5; box-shadow:0 0 25px #EF4444, 0 0 50px rgba(239,68,68,0.5); color:white; }
            .elet-led-bulb.lit-warn { background:#F59E0B; border-color:#FCD34D; box-shadow:0 0 30px #F59E0B; color:white; animation:pulseWarn 0.4s infinite alternate; }
            .elet-led-bulb.burned { background:#1E293B; border-color:#EF4444; filter:grayscale(1); opacity:0.6; }
            @keyframes pulseWarn { from { transform:scale(1); } to { transform:scale(1.1); } }
            
            .elet-smoke-puff { position:absolute; top:-20px; left:12px; font-size:1.6rem; animation:smokeUp 1.2s ease-out forwards; pointer-events:none; }
            @keyframes smokeUp { 0% { opacity:1; transform:translateY(0) scale(0.6); } 100% { opacity:0; transform:translateY(-35px) scale(1.6); } }

            /* SLIDERS E CONTROLES DA BANCADA */
            .elet-sliders-row { display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-top:6px; }
            .elet-slider-box { background:#090D16; border:1px solid #334155; border-radius:12px; padding:8px 12px; display:flex; flex-direction:column; gap:4px; }
            .elet-slider-label { font-size:0.78rem; font-weight:800; color:#CBD5E1; display:flex; justify-content:space-between; }
            .elet-slider-input { width:100%; accent-color:#F87171; cursor:pointer; }

            /* CALCULADORA DE FAIXAS DE RESISTOR */
            .elet-color-calc { background:#0F172A; border:1px solid #334155; border-radius:14px; padding:10px 12px; margin-top:8px; }
            .elet-res-preview { width:100%; max-width:260px; height:44px; background:#D4B996; border:3px solid #8C6D4F; border-radius:10px; margin:6px auto; position:relative; display:flex; align-items:center; justify-content:center; }
            .elet-res-lead { width:24px; height:5px; background:#94A3B8; position:absolute; }
            .elet-res-lead.left { left:-24px; }
            .elet-res-lead.right { right:-24px; }
            .elet-res-band { width:10px; height:100%; position:absolute; }

            /* LAYOUT DA MINI-IDE / SCAFFOLDING */
            .elet-ide-layout { display:grid; grid-template-columns:1.2fr 0.8fr; gap:16px; margin-top:16px; }
            @media (max-width:850px) { .elet-ide-layout { grid-template-columns:1fr; } }
            
            .elet-editor-card { background:#0F172A; border:2px solid #334155; border-radius:20px; padding:18px; box-shadow:0 8px 25px rgba(0,0,0,0.5); }
            .elet-editor-topbar { display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #1E293B; padding-bottom:10px; margin-bottom:14px; }
            .elet-editor-title { font-weight:900; color:#F87171; font-size:0.95rem; display:flex; align-items:center; gap:8px; }
            
            .elet-scaffold-line { font-family:'Fira Code', monospace; font-size:0.86rem; color:#E2E8F0; line-height:1.7; margin-bottom:6px; }
            .elet-select-cmd { background:#1E293B; border:2px solid #475569; color:#FCA5A5; font-family:'Fira Code', monospace; font-size:0.85rem; padding:6px 12px; border-radius:10px; cursor:pointer; max-width:100%; transition:0.2s all; }
            .elet-select-cmd:focus { border-color:#F87171; outline:none; box-shadow:0 0 10px rgba(248,113,113,0.4); }

            /* BOTÕES DE EXECUÇÃO */
            .elet-actions { display:flex; gap:10px; margin-top:16px; }
            .elet-btn-run { flex:1; background:linear-gradient(135deg, #F87171, #EF4444); color:white; border:none; padding:12px; border-radius:14px; font-weight:900; font-size:0.95rem; cursor:pointer; transition:0.2s; display:flex; align-items:center; justify-content:center; gap:8px; box-shadow:0 4px 15px rgba(239,68,68,0.4); }
            .elet-btn-run:hover { transform:translateY(-2px); box-shadow:0 6px 20px rgba(239,68,68,0.6); }
            .elet-btn-reset { background:#1E293B; border:2px solid #334155; color:#94A3B8; padding:12px 18px; border-radius:14px; cursor:pointer; font-size:1.1rem; transition:0.2s; }
            .elet-btn-reset:hover { border-color:#F87171; color:white; }

            /* SOLUÇÃO */
            .elet-btn-solution { background:#1E293B; border:1px solid #475569; color:#FBBF24; padding:8px 14px; border-radius:10px; font-size:0.82rem; font-weight:800; cursor:pointer; width:100%; margin-top:12px; display:flex; align-items:center; justify-content:center; gap:6px; }
            .elet-solution-card { display:none; background:#090D16; border:1px solid #F59E0B; border-radius:12px; padding:12px; margin-top:10px; }

            /* MODAL DE VITÓRIA */
            .elet-modal { position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.85); display:flex; justify-content:center; align-items:center; z-index:999; opacity:0; pointer-events:none; transition:0.3s; }
            .elet-modal.active { opacity:1; pointer-events:all; }
            .elet-modal-box { background:#1E293B; border:3px solid #F87171; border-radius:28px; padding:28px; max-width:440px; text-align:center; box-shadow:0 0 35px rgba(248,113,113,0.4); }
            .elet-btn-modal { background:linear-gradient(135deg, #10B981, #059669); color:white; border:none; padding:12px 28px; border-radius:30px; font-weight:900; font-size:1rem; cursor:pointer; margin-top:14px; box-shadow:0 4px 15px rgba(16,185,129,0.4); transition:0.2s; }
            .elet-btn-modal:hover { transform:scale(1.05); }

            /* COMPONENTE: TUTORIAL LÚDICO (TUBO DE ÁGUA & LEI DE OHM) */
            .elet-water-toggle-btn { background:linear-gradient(135deg, #0284C7, #06B6D4); border:none; color:white; padding:8px 18px; border-radius:14px; font-weight:900; font-size:0.88rem; cursor:pointer; display:flex; align-items:center; gap:8px; box-shadow:0 4px 15px rgba(2,132,199,0.4); transition:0.2s all; }
            .elet-water-toggle-btn:hover { transform:translateY(-2px); box-shadow:0 6px 20px rgba(6,182,212,0.6); }

            .elet-water-card { background:linear-gradient(180deg, #090D16 0%, #0F172A 100%); border:2px solid #0284C7; border-radius:24px; padding:20px; margin-bottom:18px; box-shadow:0 12px 35px rgba(2,132,199,0.25); animation:eletFadeIn 0.3s ease; }
            .elet-water-header { display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px; margin-bottom:16px; border-bottom:1px solid #1E293B; padding-bottom:12px; }
            .elet-water-title h3 { font-family:'Fredoka One', cursive; color:#38BDF8; font-size:1.3rem; margin:0 0 4px; display:flex; align-items:center; gap:10px; }
            .elet-water-title p { color:#CBD5E1; margin:0; font-size:0.88rem; line-height:1.45; }

            .elet-water-pillars { display:grid; grid-template-columns:repeat(auto-fit, minmax(260px, 1fr)); gap:14px; margin-bottom:18px; }
            .elet-pillar-card { background:#0F172A; border:2px solid #334155; border-radius:18px; padding:14px; cursor:pointer; transition:all 0.25s ease; position:relative; overflow:hidden; }
            .elet-pillar-card:hover { transform:translateY(-3px); box-shadow:0 8px 25px rgba(0,0,0,0.5); border-color:#38BDF8; }
            .elet-pillar-card.active { border-color:#38BDF8; background:linear-gradient(145deg, #1E293B, #0F172A); box-shadow:0 0 20px rgba(56,189,248,0.3); }
            .elet-pillar-card.volt-pillar.active { border-color:#F87171; box-shadow:0 0 20px rgba(248,113,113,0.3); }
            .elet-pillar-card.res-pillar.active { border-color:#F59E0B; box-shadow:0 0 20px rgba(245,158,11,0.3); }
            .elet-pillar-card.curr-pillar.active { border-color:#10B981; box-shadow:0 0 20px rgba(16,185,129,0.3); }

            .elet-pillar-head { display:flex; justify-content:space-between; align-items:center; margin-bottom:8px; }
            .elet-pillar-icon { width:40px; height:40px; border-radius:12px; display:flex; align-items:center; justify-content:center; font-size:1.3rem; }
            .elet-pillar-badge { font-family:'Fira Code', monospace; font-size:0.75rem; font-weight:900; padding:2px 8px; border-radius:6px; }

            .elet-pillar-name { font-weight:900; font-size:0.95rem; margin-bottom:4px; display:flex; align-items:center; gap:6px; }
            .elet-pillar-analog { font-size:0.8rem; font-weight:800; color:#94A3B8; margin-bottom:8px; }
            .elet-pillar-desc { font-size:0.82rem; line-height:1.45; color:#CBD5E1; margin-bottom:10px; }

            .elet-pillar-presets { display:flex; gap:6px; flex-wrap:wrap; margin-top:8px; }
            .elet-preset-btn { background:#1E293B; border:1px solid #475569; color:#E2E8F0; padding:4px 10px; border-radius:8px; font-size:0.75rem; font-weight:800; cursor:pointer; transition:0.2s all; }
            .elet-preset-btn:hover { border-color:#38BDF8; color:#38BDF8; transform:scale(1.03); }
            .elet-preset-btn.active { background:#0284C7; color:white; border-color:#38BDF8; }

            /* SIMULADOR VISUAL DO TUTORIAL (ÁGUA & ELÉTRONS) */
            .elet-sim-canvas-box { background:#020617; border:2px solid #1E293B; border-radius:20px; padding:16px; margin-bottom:14px; }
            .elet-sim-tabs { display:flex; gap:8px; margin-bottom:14px; flex-wrap:wrap; border-bottom:1px solid #1E293B; padding-bottom:10px; }
            .elet-sim-tab { background:#0F172A; border:1px solid #334155; color:#94A3B8; padding:6px 14px; border-radius:10px; font-weight:800; font-size:0.82rem; cursor:pointer; transition:0.2s; display:flex; align-items:center; gap:6px; }
            .elet-sim-tab:hover { color:#E2E8F0; border-color:#38BDF8; }
            .elet-sim-tab.active { background:linear-gradient(135deg, #0284C7, #06B6D4); color:white; border-color:#38BDF8; }

            .elet-tube-row { display:flex; flex-direction:column; gap:14px; }
            .elet-tube-container { background:#090D16; border:1px solid #334155; border-radius:16px; padding:12px; position:relative; overflow:hidden; }
            .elet-tube-title { display:flex; justify-content:space-between; align-items:center; margin-bottom:10px; font-size:0.84rem; font-weight:900; }
            
            .elet-tube-visual { display:flex; align-items:center; gap:10px; height:80px; position:relative; }
            .elet-tank { width:70px; height:74px; background:#0F172A; border:2px solid #0284C7; border-radius:10px; position:relative; overflow:hidden; display:flex; flex-direction:column; justify-content:flex-end; align-items:center; }
            .elet-tank-water { width:100%; background:linear-gradient(180deg, #38BDF8, #0284C7); transition:height 0.3s ease; position:relative; }
            .elet-tank-lbl { position:absolute; top:4px; font-size:0.65rem; font-weight:900; color:#7DD3FC; font-family:'Fira Code'; }
            
            .elet-tube-glass { flex:1; height:44px; background:linear-gradient(180deg, rgba(30,41,59,0.7), rgba(15,23,42,0.9)); border:2px solid #475569; border-radius:22px; position:relative; overflow:hidden; display:flex; align-items:center; }
            .elet-narrow-valve { position:absolute; left:48%; top:0; width:46px; height:100%; background:linear-gradient(180deg, #78350F, #451A03); border:2px solid #F59E0B; border-radius:6px; z-index:20; display:flex; flex-direction:column; align-items:center; justify-content:center; font-size:0.65rem; font-weight:900; color:#FDE68A; transition:all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
            
            .elet-water-drops-stream { position:absolute; width:100%; height:100%; display:flex; align-items:center; overflow:hidden; pointer-events:none; }
            .elet-water-drop-particle { width:10px; height:10px; border-radius:50%; background:#38BDF8; box-shadow:0 0 8px #38BDF8; position:absolute; animation:waterFlow linear infinite; }
            @keyframes waterFlow {
                from { left:-15px; opacity:0; }
                10% { opacity:1; }
                90% { opacity:1; }
                to { left:102%; opacity:0; }
            }

            .elet-turbine-box { width:65px; height:74px; background:#0F172A; border:2px solid #334155; border-radius:10px; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:4px; }
            .elet-turbine-wheel { font-size:1.8rem; color:#38BDF8; display:inline-block; transform-origin:center; }
            .elet-turbine-spin { animation:spinTurbine linear infinite; }
            @keyframes spinTurbine { from { transform:rotate(0deg); } to { transform:rotate(360deg); } }

            .elet-robot-bubble { background:linear-gradient(135deg, rgba(2,132,199,0.15), rgba(15,23,42,0.9)); border:2px solid #0284C7; border-radius:16px; padding:12px 16px; display:flex; align-items:center; gap:14px; margin-top:12px; }
            .elet-robot-avatar { font-size:2rem; }
            .elet-robot-text { font-size:0.86rem; line-height:1.5; color:#E2E8F0; }

            /* PAINEL DE DICAS DO ROBÔ: BRINCADEIRA DO CORRE-CORRE DE ELÉTRONS */
            .elet-robot-panel { background:linear-gradient(135deg, rgba(15,23,42,0.96), rgba(30,41,59,0.94)); border:2px solid #38BDF8; border-radius:24px; padding:18px 20px; margin-top:16px; margin-bottom:18px; box-shadow:0 12px 35px rgba(56,189,248,0.25); position:relative; overflow:hidden; }
            .elet-robot-panel-top { display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px; margin-bottom:14px; border-bottom:1px solid #1E293B; padding-bottom:10px; }
            .elet-robot-panel-title { font-family:'Fredoka One', cursive; color:#38BDF8; font-size:1.15rem; display:flex; align-items:center; gap:10px; }
            
            .elet-robot-topic-btn { background:#1E293B; border:1px solid #475569; color:#E2E8F0; padding:6px 14px; border-radius:12px; font-size:0.8rem; font-weight:800; cursor:pointer; transition:0.2s all; display:flex; align-items:center; gap:6px; }
            .elet-robot-topic-btn:hover { border-color:#38BDF8; color:#38BDF8; transform:translateY(-1px); }
            .elet-robot-topic-btn.active { background:linear-gradient(135deg, #0284C7, #06B6D4); border-color:#38BDF8; color:white; box-shadow:0 0 12px rgba(56,189,248,0.4); }

            .elet-robot-stage { display:flex; gap:16px; align-items:flex-start; }
            @media (max-width:700px) { .elet-robot-stage { flex-direction:column; align-items:center; } }

            .elet-robot-figure { display:flex; flex-direction:column; align-items:center; min-width:85px; }
            .elet-robot-avatar-big { font-size:3.2rem; filter:drop-shadow(0 0 15px rgba(56,189,248,0.5)); animation:robotBounce 2.5s ease-in-out infinite alternate; cursor:pointer; user-select:none; }
            @keyframes robotBounce {
                0% { transform:translateY(0) rotate(0deg); }
                50% { transform:translateY(-6px) rotate(2deg); }
                100% { transform:translateY(0) rotate(-2deg); }
            }
            .elet-robot-badge-name { font-family:'Fredoka One'; font-size:0.8rem; color:#38BDF8; background:#0F172A; border:1px solid #0284C7; padding:2px 8px; border-radius:8px; margin-top:4px; }

            .elet-speech-bubble { flex:1; background:#020617; border:2px solid #38BDF8; border-radius:20px; padding:16px 18px; position:relative; box-shadow:0 8px 25px rgba(0,0,0,0.5); min-height:95px; animation:robotTalkIn 0.3s ease; }
            @keyframes robotTalkIn { from { opacity:0; transform:translateY(4px); } to { opacity:1; transform:translateY(0); } }
            .elet-speech-bubble::before { content:''; position:absolute; top:24px; left:-12px; width:0; height:0; border-top:10px solid transparent; border-bottom:10px solid transparent; border-right:12px solid #38BDF8; }
            @media (max-width:700px) {
                .elet-speech-bubble::before { top:-12px; left:50%; transform:translateX(-50%); border-right:10px solid transparent; border-left:10px solid transparent; border-bottom:12px solid #38BDF8; border-top:none; }
            }
            
            .elet-bubble-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:8px; flex-wrap:wrap; gap:6px; }
            .elet-bubble-topic-title { font-family:'Fredoka One'; font-size:1rem; color:#FBBF24; display:flex; align-items:center; gap:8px; }
            .elet-bubble-formula { font-family:'Fira Code'; font-size:0.78rem; background:#0F172A; border:1px solid #1E293B; color:#38BDF8; padding:3px 8px; border-radius:6px; font-weight:800; }
            .elet-bubble-body { font-size:0.9rem; line-height:1.6; color:#E2E8F0; }
            .elet-bubble-summary { margin-top:10px; padding-top:8px; border-top:1px dashed #334155; font-size:0.83rem; font-weight:800; color:#34D399; display:flex; align-items:center; gap:6px; }

            .elet-clickable-element { cursor:pointer; transition:all 0.2s ease; position:relative; user-select:none; }
            .elet-clickable-element:hover { transform:scale(1.02); filter:brightness(1.15); box-shadow:0 0 15px rgba(56,189,248,0.4); }
            .elet-highlight-pulse { animation:highlightPulse 0.9s ease-in-out !important; }
            @keyframes highlightPulse {
                0% { box-shadow:0 0 0 rgba(56,189,248,0); }
                50% { box-shadow:0 0 30px rgba(56,189,248,0.9); border-color:#38BDF8; transform:scale(1.02); }
                100% { box-shadow:0 0 0 rgba(56,189,248,0); }
            }

            /* CORES C++ */
            .c-kw { color:#F472B6; font-weight:bold; }
            .c-tp { color:#38BDF8; font-weight:bold; }
            .c-fn { color:#FBBF24; }
            .c-num { color:#A78BFA; }
            .c-str { color:#34D399; }
            .c-cm { color:#64748B; font-style:italic; }
        </style>

        <div class="elet-wrapper">
            <!-- CABEÇALHO DO MÓDULO -->
            <div class="elet-header-card">
                <div class="elet-header-info">
                    <h2><i class="fa-solid fa-bolt"></i> Aula 6: Introdução à Eletrônica & Lei de Ohm</h2>
                    <p>Aprenda a eletrônica do jeito mais simples e divertido para makers: o que é <b>Positivo (+)</b> e <b>Negativo (-)</b>, onde ficam o <b>5V</b> e o <b>GND</b> no Arduino, e como a <b>analogia do cano d'água</b> explica por que usamos o resistor de <b>220 Ω</b> para não estourar o LED!</p>
                </div>
                <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;">
                    <button type="button" class="elet-calc-toggle-btn" id="elet_btn_calc_toggle" onclick="elet_goToResistorCalc()">
                        <i class="fa-solid fa-calculator"></i> <span id="elet_calc_toggle_txt">🎨 Calculadora de Cores</span>
                    </button>
                    <button type="button" class="elet-water-toggle-btn" id="elet_btn_water_toggle" onclick="elet_toggleWaterTutorial()">
                        <i class="fa-solid fa-faucet-drip"></i> <span id="elet_water_toggle_txt">💧 Ocultar Tutorial Lúdico</span>
                    </button>
                    <button type="button" class="elet-guide-toggle-btn" onclick="elet_toggleGuide()">
                        <i class="fa-solid fa-book-open"></i> <span id="elet_guide_toggle_txt">Mostrar Guia Teórico</span>
                    </button>
                    <button type="button" class="elet-quiz-toggle-btn" id="elet_btn_quiz_toggle" onclick="elet_goToQuiz()">
                        <i class="fa-solid fa-graduation-cap"></i> <span id="elet_quiz_toggle_txt">🧠 Quiz Final (5 Questões)</span>
                    </button>
                </div>
            </div>

            <!-- OS 3 PASSOS DA ELETRÔNICA (SUPER FÁCIL PARA 12 ANOS) -->
            <div class="elet-steps-container">
                <!-- PASSO 1: POSITIVO E NEGATIVO -->
                <div class="elet-step-card" id="elet_step_card_1" onclick="elet_switchGuideTab(1); elet_openGuideIfClosed();">
                    <div style="display:flex;justify-content:space-between;align-items:center;">
                        <span class="elet-step-badge" style="background:rgba(239,68,68,0.2);color:#FCA5A5;border:1px solid #EF4444;">Passo 1</span>
                        <span style="font-size:1.3rem;">🔋</span>
                    </div>
                    <h4 class="elet-step-title"><span style="color:#EF4444;">🔴 Positivo (+)</span> e <span style="color:#94A3B8;">⚫ Negativo (-)</span></h4>
                    <p class="elet-step-desc">Toda pilha, bateria e placa tem dois lados! Para o LED acender, a eletricidade precisa fazer uma viagem completa em círculo (um <b>circuito fechado</b>).</p>
                    <div class="elet-step-highlight">
                        ⚡ <b>Regra de Ouro:</b> A energia sai do (+) e volta para o (-). Se um fio soltar, a lâmpada apaga na hora!
                    </div>
                </div>

                <!-- PASSO 2: 5V E GND NO ARDUINO -->
                <div class="elet-step-card" id="elet_step_card_2" onclick="elet_switchGuideTab(2); elet_openGuideIfClosed();">
                    <div style="display:flex;justify-content:space-between;align-items:center;">
                        <span class="elet-step-badge" style="background:rgba(56,189,248,0.2);color:#7DD3FC;border:1px solid #0284C7;">Passo 2</span>
                        <span style="font-size:1.3rem;">🔌</span>
                    </div>
                    <h4 class="elet-step-title"><span style="color:#38BDF8;">Pino 5V (+)</span> e <span style="color:#34D399;">Pino GND (-)</span></h4>
                    <p class="elet-step-desc">No Arduino, <b>5V</b> é o Positivo (+) que manda energia. O <b>GND (Terra)</b> é o Negativo (-) de retorno (0V). E o LED tem perna longa (+) e curta (-) no GND!</p>
                    <div class="elet-step-highlight" style="border-left-color:#34D399;">
                        💡 <b>Pernas do LED:</b> Perna longa = Positivo (+); Perna curta = Negativo (-) no GND.
                    </div>
                </div>

                <!-- PASSO 3: O CANO D'ÁGUA E O RESISTOR 220 OHMS -->
                <div class="elet-step-card" id="elet_step_card_3" onclick="elet_switchGuideTab(3); elet_openGuideIfClosed();">
                    <div style="display:flex;justify-content:space-between;align-items:center;">
                        <span class="elet-step-badge" style="background:rgba(245,158,11,0.2);color:#FDE68A;border:1px solid #F59E0B;">Passo 3</span>
                        <span style="font-size:1.3rem;">🚰</span>
                    </div>
                    <h4 class="elet-step-title"><span style="color:#FBBF24;">O Cano d'Água</span> & <span style="color:#10B981;">Resistor Protetor</span></h4>
                    <div style="display:flex;gap:6px;flex-wrap:wrap;margin:2px 0;">
                        <span style="font-size:0.75rem;font-weight:900;background:rgba(239,68,68,0.2);color:#FCA5A5;border:1px solid #EF4444;padding:2px 8px;border-radius:8px;display:inline-flex;align-items:center;gap:4px;">
                            <i class="fa-solid fa-gauge-high"></i> <b>V</b> (Pressão)
                        </span>
                        <span style="font-size:0.75rem;font-weight:900;background:rgba(56,189,248,0.2);color:#7DD3FC;border:1px solid #0284C7;padding:2px 8px;border-radius:8px;display:inline-flex;align-items:center;gap:4px;">
                            <i class="fa-solid fa-water"></i> <b>I</b> (Fluxo)
                        </span>
                        <span style="font-size:0.75rem;font-weight:900;background:rgba(245,158,11,0.2);color:#FDE68A;border:1px solid #F59E0B;padding:2px 8px;border-radius:8px;display:inline-flex;align-items:center;gap:4px;">
                            <i class="fa-solid fa-faucet"></i> <b>R</b> (Torneira)
                        </span>
                    </div>
                    <p class="elet-step-desc">Tensão é a <b>pressão</b> da água empurrando. Corrente é o <b>fluxo</b> correndo. O resistor (220Ω ou 300Ω) é a <b>torneirinha</b> que regula a água pro LED não queimar!</p>
                    <div class="elet-step-highlight" style="border-left-color:#F59E0B;">
                        🛡️ <b>Por que o resistor?</b> Sem ele (0Ω), a água vem com tudo e o LED ESTOURA!
                    </div>
                </div>

                <!-- ROTEIRO DA AULA COM AVISO DO QUIZ AO FINAL -->
                <div style="grid-column:1 / -1;background:linear-gradient(135deg,rgba(139,92,246,0.12),rgba(59,130,246,0.1));border:2px dashed #8B5CF6;border-radius:18px;padding:12px 18px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;">
                    <div style="display:flex;align-items:center;gap:12px;">
                        <span style="font-size:1.6rem;">🎓</span>
                        <div>
                            <b style="color:#DDD6FE;font-size:0.95rem;">Roteiro da Aula: Teoria ➔ Bancada Prática ➔ Quiz de Teste no Final!</b>
                            <p style="margin:2px 0 0;color:#94A3B8;font-size:0.82rem;">Estude os conceitos, teste na bancada com multímetro e realize o Quiz de 5 questões ao final da página para testar seu conhecimento.</p>
                        </div>
                    </div>
                    <button type="button" onclick="elet_goToQuiz()" style="background:#8B5CF6;color:white;border:none;padding:9px 18px;border-radius:12px;font-weight:900;cursor:pointer;font-size:0.85rem;display:flex;align-items:center;gap:6px;transition:0.2s;box-shadow:0 4px 12px rgba(139,92,246,0.35);">
                        <i class="fa-solid fa-arrow-down"></i> Ir para o Quiz Final
                    </button>
                </div>
            </div>

            <!-- COMPONENTE: TUTORIAL LÚDICO (A ANALOGIA DO TUBO DE ÁGUA & LEI DE OHM) -->
            <div class="elet-water-card" id="elet_water_tutorial_card">
                <div class="elet-water-header">
                    <div class="elet-water-title">
                        <h3><i class="fa-solid fa-faucet-drip" style="color:#38BDF8;"></i> Tutorial Lúdico: A Máquina da Lei de Ohm (Tubo de Água & Elétrons)</h3>
                        <p>A eletricidade invisível funciona <b>exatamente como a água</b> em uma mangueira! Clique nos ícones e experimente mexer nos botões:</p>
                    </div>
                    <div style="display:flex;gap:8px;align-items:center;">
                        <span style="font-family:'Fira Code',monospace;font-size:0.85rem;background:#0F172A;border:1px solid #0284C7;color:#38BDF8;padding:5px 12px;border-radius:10px;font-weight:900;">Fórmula: I = V ÷ R</span>
                    </div>
                </div>

                <!-- 3 PILARES COM ÍCONES INTERATIVOS -->
                <div class="elet-water-pillars">
                    <!-- PILAR 1: TENSÃO -->
                    <div class="elet-pillar-card volt-pillar active tension-element elet-clickable-element" id="elet_card_volt" onclick="elet_showRobotTip('voltage', 'elet_card_volt')">
                        <div class="elet-pillar-head">
                            <div class="elet-pillar-icon" style="background:rgba(239,68,68,0.2);color:#F87171;border:1px solid #EF4444;">
                                <i class="fa-solid fa-gauge-high"></i>
                            </div>
                            <span class="elet-pillar-badge" style="background:rgba(239,68,68,0.2);color:#FCA5A5;border:1px solid #EF4444;" id="elet_lbl_w_v">5.0 V</span>
                        </div>
                        <div class="elet-pillar-name" style="color:#F87171;">
                            <i class="fa-solid fa-bolt"></i> TENSÃO (Volts / V)
                        </div>
                        <div class="elet-pillar-analog">
                            🚰 Analogia: <b>Pressão da Água</b>
                        </div>
                        <!-- Mini Ilustração Explicativa -->
                        <div style="background:#020617;border:1px solid rgba(239,68,68,0.3);border-radius:12px;padding:8px 10px;margin:8px 0;display:flex;align-items:center;gap:10px;">
                            <div style="width:36px;height:36px;border-radius:10px;background:rgba(239,68,68,0.2);display:flex;align-items:center;justify-content:center;font-size:1.35rem;flex-shrink:0;">
                                🏰
                            </div>
                            <div style="font-size:0.77rem;line-height:1.35;color:#E2E8F0;">
                                <b style="color:#FCA5A5;">A Caixa d'Água Alta:</b> Empurra a água com <b>5V de pressão</b> para iniciar o corre-corre!
                            </div>
                        </div>
                        <div class="elet-pillar-desc">
                            É a força da caixa d'água empurrando tudo! Quanto mais alta a caixa, mais pressão empurra os elétrons pelo circuito.
                        </div>
                        <div class="elet-pillar-presets" onclick="event.stopPropagation();">
                            <span style="font-size:0.72rem;color:#94A3B8;width:100%;">Testar Pressão:</span>
                            <button type="button" class="elet-preset-btn" id="elet_pbtn_v3" onclick="elet_setWaterVoltagePreset(3.0)">💧 3V (Baixa)</button>
                            <button type="button" class="elet-preset-btn active" id="elet_pbtn_v5" onclick="elet_setWaterVoltagePreset(5.0)">⚡ 5V (Arduino)</button>
                            <button type="button" class="elet-preset-btn" id="elet_pbtn_v9" onclick="elet_setWaterVoltagePreset(9.0)">🚀 9V (Alta)</button>
                        </div>
                        <div style="margin-top:10px;" onclick="event.stopPropagation();">
                            <input type="range" class="elet-slider-input" id="elet_w_slider_v" min="1" max="12" step="0.5" value="5" oninput="elet_onWaterSliderChange()" style="accent-color:#F87171;" />
                        </div>
                    </div>

                    <!-- PILAR 2: RESISTÊNCIA -->
                    <div class="elet-pillar-card res-pillar resistance-element elet-clickable-element" id="elet_card_res" onclick="elet_showRobotTip('resistance', 'elet_card_res')">
                        <div class="elet-pillar-head">
                            <div class="elet-pillar-icon" style="background:rgba(245,158,11,0.2);color:#FBBF24;border:1px solid #F59E0B;">
                                <i class="fa-solid fa-compress"></i>
                            </div>
                            <span class="elet-pillar-badge" style="background:rgba(245,158,11,0.2);color:#FDE68A;border:1px solid #F59E0B;" id="elet_lbl_w_r">220 Ω</span>
                        </div>
                        <div class="elet-pillar-name" style="color:#FBBF24;">
                            <i class="fa-solid fa-shield-halved"></i> RESISTÊNCIA (Ohms / Ω)
                        </div>
                        <div class="elet-pillar-analog">
                            🤏 Analogia: <b>Estreitamento do Cano</b>
                        </div>
                        <!-- Mini Ilustração Explicativa -->
                        <div style="background:#020617;border:1px solid rgba(245,158,11,0.3);border-radius:12px;padding:8px 10px;margin:8px 0;display:flex;align-items:center;gap:10px;">
                            <div style="width:36px;height:36px;border-radius:10px;background:rgba(245,158,11,0.2);display:flex;align-items:center;justify-content:center;font-size:1.35rem;flex-shrink:0;">
                                🚰
                            </div>
                            <div style="font-size:0.77rem;line-height:1.35;color:#E2E8F0;">
                                <b style="color:#FDE68A;">A Torneira Protetora:</b> Estreita o cano (<b>220Ω</b> ou <b>300Ω</b>) para não estourar o LED!
                            </div>
                        </div>
                        <div class="elet-pillar-desc">
                            É o aperto na mangueira! Reduz o diâmetro do tubo e impede que os elétrons passem correndo e quebrem os componentes.
                        </div>
                        <div class="elet-pillar-presets" onclick="event.stopPropagation();">
                            <span style="font-size:0.72rem;color:#94A3B8;width:100%;">Testar Estreitamento:</span>
                            <button type="button" class="elet-preset-btn" id="elet_pbtn_r0" onclick="elet_setWaterResistorPreset(0)" style="border-color:#EF4444;color:#FCA5A5;">🛑 0Ω (Sem Resistor!)</button>
                            <button type="button" class="elet-preset-btn active" id="elet_pbtn_r220" onclick="elet_setWaterResistorPreset(220)" style="border-color:#10B981;color:#34D399;">🛡️ 220Ω (Ideal)</button>
                            <button type="button" class="elet-preset-btn" id="elet_pbtn_r1000" onclick="elet_setWaterResistorPreset(1000)">🤏 1000Ω (Apertado)</button>
                        </div>
                        <div style="margin-top:10px;" onclick="event.stopPropagation();">
                            <input type="range" class="elet-slider-input" id="elet_w_slider_r" min="0" max="1000" step="10" value="220" oninput="elet_onWaterSliderChange()" style="accent-color:#F59E0B;" />
                        </div>
                    </div>

                    <!-- PILAR 3: CORRENTE -->
                    <div class="elet-pillar-card curr-pillar current-element elet-clickable-element" id="elet_card_curr" onclick="elet_showRobotTip('current', 'elet_card_curr')">
                        <div class="elet-pillar-head">
                            <div class="elet-pillar-icon" style="background:rgba(56,189,248,0.2);color:#38BDF8;border:1px solid #0284C7;">
                                <i class="fa-solid fa-water"></i>
                            </div>
                            <span class="elet-pillar-badge" style="background:rgba(56,189,248,0.2);color:#BAE6FD;border:1px solid #38BDF8;" id="elet_lbl_w_i">13.6 mA</span>
                        </div>
                        <div class="elet-pillar-name" style="color:#38BDF8;">
                            <i class="fa-solid fa-wave-square"></i> CORRENTE (Amperes / I)
                        </div>
                        <div class="elet-pillar-analog">
                            🌊 Analogia: <b>Fluxo de Água & Elétrons</b>
                        </div>
                        <!-- Mini Ilustração Explicativa -->
                        <div style="background:#020617;border:1px solid rgba(56,189,248,0.3);border-radius:12px;padding:8px 10px;margin:8px 0;display:flex;align-items:center;gap:10px;">
                            <div style="width:36px;height:36px;border-radius:10px;background:rgba(56,189,248,0.2);display:flex;align-items:center;justify-content:center;font-size:1.35rem;flex-shrink:0;">
                                🏃💨
                            </div>
                            <div style="font-size:0.77rem;line-height:1.35;color:#E2E8F0;">
                                <b style="color:#7DD3FC;">O Rio de Elétrons:</b> A turma correndo pelo fio! Medida em <b>mA (miliamperes)</b>.
                            </div>
                        </div>
                        <div class="elet-pillar-desc" id="elet_w_curr_desc">
                            É o volume de água (ou a contagem de elétrons e-) que passa por segundo! Responde direto a: <b>I = V ÷ R</b>.
                        </div>
                        <div style="background:#020617;border:1px solid #334155;border-radius:10px;padding:8px;margin-top:8px;">
                            <div style="display:flex;justify-content:space-between;font-size:0.75rem;font-weight:900;color:#CBD5E1;">
                                <span>Diagnóstico:</span>
                                <span id="elet_w_status_badge" style="color:#34D399;">✅ Fluxo Seguro (10-20mA)</span>
                            </div>
                            <div style="font-size:0.72rem;color:#94A3B8;margin-top:2px;" id="elet_w_status_tip">
                                Perfeito para iluminar sem forçar o chip ATmega328P!
                            </div>
                        </div>
                    </div>
                </div>

                <!-- SIMULADOR VISUAL ANIMADO (CANO DE ÁGUA E CANO DE ELÉTRONS) -->
                <div class="elet-sim-canvas-box">
                    <div class="elet-sim-tabs">
                        <span style="font-size:0.8rem;font-weight:900;color:#CBD5E1;display:flex;align-items:center;gap:6px;margin-right:6px;">
                            <i class="fa-solid fa-eye"></i> Visualização Animada:
                        </span>
                        <button type="button" class="elet-sim-tab active" id="elet_stab_both" onclick="elet_setWaterMode('both')">🔄 Lado a Lado (Comparação)</button>
                        <button type="button" class="elet-sim-tab" id="elet_stab_water" onclick="elet_setWaterMode('water')">🚰 Tubo de Água (Analogia)</button>
                        <button type="button" class="elet-sim-tab" id="elet_stab_elec" onclick="elet_setWaterMode('electrons')">⚡ Tubo de Elétrons (Arduino)</button>
                    </div>

                    <div class="elet-tube-row">
                        <!-- CANO 1: ÁGUA -->
                        <div class="elet-tube-container" id="elet_view_water_box">
                            <div class="elet-tube-title">
                                <span style="color:#38BDF8;"><i class="fa-solid fa-faucet"></i> 1. O Mundo da Água: Pressão (V) ➔ Estreitamento (R) ➔ Vazão (I)</span>
                                <span style="font-size:0.75rem;color:#7DD3FC;font-family:'Fira Code';" id="elet_w_flow_txt">Vazão: 13.6 gotas/s</span>
                            </div>
                            <div class="elet-tube-visual">
                                <!-- Tanque com Pressão da Água -->
                                <div class="elet-tank" title="Pressão da Água (Tensão V)">
                                    <span class="elet-tank-lbl" id="elet_w_tank_lbl">5.0V</span>
                                    <div class="elet-tank-water" id="elet_w_tank_fill" style="height:55%;"></div>
                                </div>
                                <!-- Tubo Transparente com Estreitamento -->
                                <div class="elet-tube-glass">
                                    <div class="elet-water-drops-stream" id="elet_w_drops_stream"></div>
                                    <div class="elet-narrow-valve" id="elet_w_valve" style="height:70%;">
                                        <i class="fa-solid fa-compress" style="font-size:0.75rem;"></i>
                                        <span id="elet_w_valve_lbl">220Ω</span>
                                    </div>
                                </div>
                                <!-- Turbina / Moinho de Água -->
                                <div class="elet-turbine-box" title="Vazão de Água (Corrente I)">
                                    <div class="elet-turbine-wheel elet-turbine-spin" id="elet_w_turbine">
                                        <i class="fa-solid fa-gear"></i>
                                    </div>
                                    <span style="font-size:0.65rem;font-weight:900;color:#94A3B8;">Moinho</span>
                                </div>
                            </div>
                        </div>

                        <!-- CANO 2: ELÉTRONS & ARDUINO -->
                        <div class="elet-tube-container" id="elet_view_elec_box">
                            <div class="elet-tube-title">
                                <span style="color:#F87171;"><i class="fa-solid fa-atom"></i> 2. O Mundo dos Elétrons: Pino 5V ➔ Resistor 220Ω ➔ LED & GND</span>
                                <span style="font-size:0.75rem;color:#FCA5A5;font-family:'Fira Code';" id="elet_e_flow_txt">Corrente: 13.6 mA</span>
                            </div>
                            <div class="elet-tube-visual">
                                <!-- Pino do Arduino -->
                                <div style="width:70px;height:74px;background:#0F172A;border:2px solid #F87171;border-radius:10px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;" title="Pino Digital do Arduino (5V)">
                                    <i class="fa-solid fa-microchip" style="color:#F87171;font-size:1.2rem;"></i>
                                    <span style="font-size:0.65rem;font-weight:900;color:#FCA5A5;" id="elet_e_pin_lbl">Pino 9 (5V)</span>
                                </div>
                                <!-- Tubo Condutor com Resistor -->
                                <div class="elet-tube-glass" style="border-color:#F59E0B;">
                                    <div class="elet-water-drops-stream" id="elet_e_electron_stream"></div>
                                    <div class="elet-narrow-valve" id="elet_e_res_valve" style="height:70%;background:linear-gradient(180deg,#B45309,#78350F);border-color:#F59E0B;">
                                        <div style="font-size:0.6rem;color:#FDE68A;font-weight:900;" id="elet_e_res_lbl">220Ω</div>
                                        <div style="display:flex;gap:2px;margin-top:2px;">
                                            <span style="width:3px;height:12px;background:#EF4444;border-radius:1px;"></span>
                                            <span style="width:3px;height:12px;background:#EF4444;border-radius:1px;"></span>
                                            <span style="width:3px;height:12px;background:#78350F;border-radius:1px;"></span>
                                        </div>
                                    </div>
                                </div>
                                <!-- LED do Arduino -->
                                <div style="width:65px;height:74px;background:#0F172A;border:2px solid #334155;border-radius:10px;display:flex;flex-direction:column;align-items:center;justify-content:center;position:relative;" title="LED Protetor">
                                    <div class="elet-led-bulb lit-safe" id="elet_w_led_bulb" style="width:36px;height:36px;font-size:1.1rem;">
                                        <i class="fa-solid fa-lightbulb"></i>
                                    </div>
                                    <div id="elet_w_smoke_box"></div>
                                    <span style="font-size:0.65rem;font-weight:900;color:#CBD5E1;margin-top:2px;">LED</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- BALÃO INTERATIVO DO ROBÔ MAKER -->
                    <div class="elet-robot-bubble" id="elet_w_robot_box">
                        <div class="elet-robot-avatar">🤖</div>
                        <div class="elet-robot-text" id="elet_w_robot_msg">
                            <b>Robô Maker diz:</b> "A Lei de Ohm é fácil! Se você <b>aperta o cano (mais resistência)</b>, a água e os elétrons passam devagarzinho. Se você <b>tira o resistor (0Ω)</b> com a torneira aberta, a corrente dispara e QUEIMA o LED!"
                        </div>
                    </div>
                </div>
            </div>

            <!-- GUIA TEÓRICO COMPLETO COM 6 SLIDES -->
            <div class="elet-guide-card" id="elet_guide_card" style="display:none;">
                <div class="elet-guide-tabs">
                    <button class="elet-guide-tab active" id="elet_tab_g1" onclick="elet_switchGuideTab(1)">🔋 1. Positivo & Negativo</button>
                    <button class="elet-guide-tab" id="elet_tab_g2" onclick="elet_switchGuideTab(2)">🔌 2. 5V & GND no Arduino</button>
                    <button class="elet-guide-tab" id="elet_tab_g3" onclick="elet_switchGuideTab(3)">🚰 3. O Cano d'Água</button>
                    <button class="elet-guide-tab" id="elet_tab_g4" onclick="elet_switchGuideTab(4)">🛡️ 4. O Resistor de 220 Ω</button>
                    <button class="elet-guide-tab" id="elet_tab_g5" onclick="elet_switchGuideTab(5)">🔌 5. Como Montar</button>
                    <button class="elet-guide-tab" id="elet_tab_g6" onclick="elet_switchGuideTab(6)">💻 6. Código Arduino C++</button>
                </div>

                <!-- SLIDE 1: POSITIVO E NEGATIVO -->
                <div class="elet-slide-content active" id="elet_slide_1">
                    <div style="font-size:1.05rem;font-weight:900;color:#F87171;margin-bottom:8px;">
                        🔋 1. O Básico de Tudo: O que é Positivo (+) e Negativo (-)?
                    </div>
                    <p style="font-size:0.9rem;line-height:1.6;color:#CBD5E1;margin:0 0 10px;">
                        Toda fonte de energia no planeta — desde a pilha do controle remoto até a bateria do celular e a placa Arduino — possui <b>dois lados indispensáveis</b>:
                    </p>
                    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:10px;margin-bottom:12px;">
                        <div style="background:#1E293B;padding:12px;border-radius:12px;border-left:4px solid #EF4444;">
                            <b style="color:#F87171;">🔴 Pólo Positivo (+):</b> É de onde a energia elétrica <b>sai com força</b> para trabalhar e acender as coisas!
                        </div>
                        <div style="background:#1E293B;padding:12px;border-radius:12px;border-left:4px solid #38BDF8;">
                            <b style="color:#38BDF8;">⚫ Pólo Negativo (-):</b> É para onde a energia <b>precisa voltar</b> para completar a viagem. Sem retorno, nada acontece!
                        </div>
                    </div>
                    <div style="background:#0F172A;border:1px solid #10B981;border-radius:12px;padding:10px 14px;font-size:0.88rem;color:#A7F3D0;">
                        ⭐ <b>O Segredo do Circuito Fechado:</b> A palavra "circuito" vem de <i>círculo</i>! A eletricidade só se move se houver uma pista fechada contínua: sai do Positivo (+), viaja pelos fios, acende a lâmpada e volta para o Negativo (-). Se qualquer fio soltar, a pista se abre e o LED apaga na hora!
                    </div>
                </div>

                <!-- SLIDE 2: 5V E GND NA PLACA ARDUINO -->
                <div class="elet-slide-content" id="elet_slide_2">
                    <div style="font-size:1.05rem;font-weight:900;color:#38BDF8;margin-bottom:8px;">
                        🔌 2. Na Placa Arduino: Quem é o Positivo e quem é o Negativo?
                    </div>
                    <p style="font-size:0.9rem;line-height:1.6;color:#CBD5E1;margin:0 0 10px;">
                        Olhando para a placa do Arduino Uno, encontramos pinos especiais que funcionam exatamente como os dois pólos de uma bateria:
                    </p>
                    <div style="display:flex;flex-direction:column;gap:10px;font-size:0.88rem;line-height:1.55;">
                        <div style="background:#1E293B;padding:12px 14px;border-radius:12px;border-left:4px solid #EF4444;">
                            ⚡ <b>Pino 5V (ou Pino Digital HIGH):</b> É o <b>Positivo (+)</b> do Arduino! Ele fornece uma força de <b>5 Volts</b> de energia. Quando programamos um pino digital (como o Pino 9) em nível <code>HIGH</code>, ele liga e também vira um pólo positivo de 5V!
                        </div>
                        <div style="background:#1E293B;padding:12px 14px;border-radius:12px;border-left:4px solid #34D399;">
                            🌱 <b>Pino GND (Ground / Terra):</b> É o <b>Negativo (-)</b> do Arduino! É o "chão" ou nível zero (0 Volts) por onde a energia completa a volta para a placa.
                        </div>
                        <div style="background:#1E293B;padding:12px 14px;border-radius:12px;border-left:4px solid #F59E0B;">
                            💡 <b>E o LED? Ele também tem lado certo!</b><br>
                            - <span class="elet-pol-lead anode">Perna Longa (Ânodo +)</span>: Conecta em direção ao <b>Positivo (5V)</b> através do resistor protetor.<br>
                            - <span class="elet-pol-lead cathode">Perna Curta (Cátodo -)</span>: Conecta no <b>GND (Negativo)</b> do Arduino.<br>
                            <i>(Se ligar o LED invertido, ele não queima, mas os elétrons não conseguem passar e ele fica apagado!)</i>
                        </div>
                    </div>
                </div>

                <!-- SLIDE 3: A ANALOGIA DO CANO D'ÁGUA -->
                <div class="elet-slide-content" id="elet_slide_3">
                    <div style="font-size:1.05rem;font-weight:900;color:#FBBF24;margin-bottom:8px;">
                        🚰 3. A Grande Analogia do Cano d'Água (Tensão, Corrente e Resistência)
                    </div>
                    <p style="font-size:0.9rem;line-height:1.6;color:#CBD5E1;margin:0 0 10px;">
                        Como a eletricidade é invisível dentro dos fios de cobre, os cientistas usam a <b>analogia da água na mangueira</b> para explicar como tudo se move:
                    </p>
                    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:12px;margin-bottom:14px;">
                        <!-- CARD ILUSTRADO: TENSÃO -->
                        <div style="background:#1E293B;padding:14px;border-radius:16px;border:2px solid #EF4444;box-shadow:0 4px 15px rgba(239,68,68,0.15);">
                            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;">
                                <span style="font-weight:900;color:#F87171;font-size:1rem;display:flex;align-items:center;gap:6px;">
                                    <i class="fa-solid fa-gauge-high"></i> TENSÃO (V - Volts)
                                </span>
                                <span style="font-size:1.4rem;">⚡</span>
                            </div>
                            <div style="background:#0F172A;border-radius:12px;padding:10px;margin-bottom:8px;display:flex;align-items:center;gap:10px;border:1px solid rgba(239,68,68,0.3);">
                                <div style="font-size:2rem;width:44px;height:44px;background:rgba(239,68,68,0.2);border-radius:10px;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
                                    🏰
                                </div>
                                <div style="font-size:0.8rem;color:#CBD5E1;line-height:1.35;">
                                    <b style="color:#FCA5A5;">A Caixa d'Água Alta:</b> Representa a <b>Pressão</b> que empurra os elétrons com força para descer pelo cano!
                                </div>
                            </div>
                            <div style="font-size:0.82rem;color:#94A3B8;line-height:1.4;">
                                No Arduino: o pino 5V é quem fornece essa pressão de <b>5 Volts</b>.
                            </div>
                        </div>

                        <!-- CARD ILUSTRADO: CORRENTE -->
                        <div style="background:#1E293B;padding:14px;border-radius:16px;border:2px solid #0284C7;box-shadow:0 4px 15px rgba(56,189,248,0.15);">
                            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;">
                                <span style="font-weight:900;color:#38BDF8;font-size:1rem;display:flex;align-items:center;gap:6px;">
                                    <i class="fa-solid fa-water"></i> CORRENTE (I - Amperes)
                                </span>
                                <span style="font-size:1.4rem;">🌊</span>
                            </div>
                            <div style="background:#0F172A;border-radius:12px;padding:10px;margin-bottom:8px;display:flex;align-items:center;gap:10px;border:1px solid rgba(56,189,248,0.3);">
                                <div style="font-size:2rem;width:44px;height:44px;background:rgba(56,189,248,0.2);border-radius:10px;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
                                    🏃💨
                                </div>
                                <div style="font-size:0.8rem;color:#CBD5E1;line-height:1.35;">
                                    <b style="color:#7DD3FC;">O Rio de Elétrons:</b> Representa o <b>Fluxo ou Vazão</b>: o volume de água passando pelo tubo a cada segundo!
                                </div>
                            </div>
                            <div style="font-size:0.82rem;color:#94A3B8;line-height:1.4;">
                                No circuito: medimos em <b>mA (miliamperes)</b>. O LED precisa de cerca de 15 mA.
                            </div>
                        </div>

                        <!-- CARD ILUSTRADO: RESISTÊNCIA -->
                        <div style="background:#1E293B;padding:14px;border-radius:16px;border:2px solid #F59E0B;box-shadow:0 4px 15px rgba(245,158,11,0.15);">
                            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;">
                                <span style="font-weight:900;color:#FBBF24;font-size:1rem;display:flex;align-items:center;gap:6px;">
                                    <i class="fa-solid fa-faucet-drip"></i> RESISTÊNCIA (R - Ohms)
                                </span>
                                <span style="font-size:1.4rem;">🤏</span>
                            </div>
                            <div style="background:#0F172A;border-radius:12px;padding:10px;margin-bottom:8px;display:flex;align-items:center;gap:10px;border:1px solid rgba(245,158,11,0.3);">
                                <div style="font-size:2rem;width:44px;height:44px;background:rgba(245,158,11,0.2);border-radius:10px;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
                                    🚰
                                </div>
                                <div style="font-size:0.8rem;color:#CBD5E1;line-height:1.35;">
                                    <b style="color:#FDE68A;">A Torneira Protetora:</b> É o <b>Estreitamento do Cano</b>! Segura o excesso de água para não arrebentar tudo.
                                </div>
                            </div>
                            <div style="font-size:0.82rem;color:#94A3B8;line-height:1.4;">
                                No circuito: nosso resistor de <b>220Ω ou 300Ω</b> impede o LED de explodir!
                            </div>
                        </div>
                    </div>

                    <!-- FÓRMULA ILUSTRADA EM PALAVRAS SIMPLES -->
                    <div style="background:#0F172A;border:2px solid #38BDF8;border-radius:16px;padding:12px 18px;font-size:0.9rem;color:#BAE6FD;display:flex;align-items:center;gap:14px;flex-wrap:wrap;">
                        <span style="font-size:2.2rem;">📐</span>
                        <div style="flex:1;min-width:240px;">
                            <b style="color:#38BDF8;font-size:1rem;">A Lei de Ohm em Imagens:</b><br>
                            <span style="color:#CBD5E1;">
                                <span style="color:#38BDF8;font-weight:900;">Corrente (Fluxo)</span> = <span style="color:#F87171;font-weight:900;">Tensão (Pressão)</span> ÷ <span style="color:#FBBF24;font-weight:900;">Resistência (Torneira)</span>
                            </span><br>
                            <span style="font-size:0.82rem;color:#94A3B8;">Quanto maior a pressão, mais água corre; quanto mais fechada a torneira, mais calmo o fluxo fica!</span>
                        </div>
                    </div>
                </div>

                <!-- SLIDE 4: O RESISTOR DE 220 OHMS -->
                <div class="elet-slide-content" id="elet_slide_4">
                    <div style="font-size:1.05rem;font-weight:900;color:#A78BFA;margin-bottom:6px;">
                        🛡️ 4. Por que Usamos o Resistor de 220 Ω? (O Guarda-Costas do LED)
                    </div>
                    <div style="background:#7F1D1D;border:2px solid #EF4444;border-radius:12px;padding:10px 14px;margin-bottom:12px;font-size:0.88rem;color:#FEE2E2;">
                        💥 <b>O que acontece se ligar sem resistor (0 Ω)?</b> Se você ligar o LED direto no 5V sem resistor, a água vem com pressão total sem freio! A corrente dispara para mais de 50 mA e o LED <b>ESTOURA (faz PUFF 💨 e queima na hora!)</b>. Além disso, pode danificar o pino do Arduino!
                    </div>
                    <div style="display:flex;flex-direction:column;gap:10px;font-size:0.88rem;line-height:1.55;">
                        <div style="background:#1E293B;padding:12px 14px;border-radius:12px;">
                            🎯 <b>O Resistor de 220 Ω é a nossa Torneirinha Mágica:</b><br>
                            - A fonte manda <b>5V</b>.<br>
                            - O LED consome cerca de <b>2V</b> para brilhar.<br>
                            - Sobram <b>3V</b> de pressão extra! O resistor de <b>220 Ω</b> absorve essa pressão e deixa passar apenas <b>15 mA</b> de corrente.<br>
                            - 15 mA é o fluxo perfeito: o LED brilha lindo e seguro sem nunca queimar!
                        </div>
                        <div style="background:#0F172A;border:1px solid #10B981;border-radius:14px;padding:12px 16px;font-size:0.86rem;color:#E2E8F0;line-height:1.6;">
                            <div style="font-weight:900;color:#34D399;font-size:0.95rem;margin-bottom:6px;display:flex;align-items:center;gap:6px;">
                                🎨 <span>O Código Secreto das Cores dos Resistores (Super Fácil!)</span>
                            </div>
                            Todo resistor tem faixas coloridas pintadas no corpinho para indicar quantos Ohms (Ω) ele vale. A regra de ouro é muito simples:<br>
                            <b>• 1ª Faixa:</b> Primeiro número.<br>
                            <b>• 2ª Faixa:</b> Segundo número (junte com o primeiro).<br>
                            <b>• 3ª Faixa:</b> Multiplicador por 10 (ou seja: <i>adicione 1 zero no final!</i>).<br>
                            <b>• 4ª Faixa (Dourada):</b> Tolerância de precisão (±5%).<br><br>

                            <div style="background:#1E293B;border-left:4px solid #F97316;padding:10px 14px;border-radius:10px;margin-bottom:8px;">
                                🟠 <b>Seu Resistor de 300 Ω (Laranja, Preto e Marrom):</b><br>
                                1. <b>1ª faixa (Laranja):</b> dígito <b>3</b><br>
                                2. <b>2ª faixa (Preto):</b> dígito <b>0</b> (juntando os dois forma <b>30</b>)<br>
                                3. <b>3ª faixa (Marrom):</b> multiplicador <b>× 10</b> (regra mágica: <i>adicione 1 zero no final!</i>)<br>
                                ➔ <b>30 com 1 zero = 300 Ω!</b> (30 × 10 = 300 Ohms)<br>
                                <span style="color:#FDE68A;font-size:0.82rem;">💡 <b>Dica Maker:</b> O resistor de 300 Ω é perfeito para proteger seu LED no Arduino! Em 5V, ele deixa passar cerca de 10 mA, o que dá um brilho bonito e protege o LED com total segurança!</span>
                            </div>

                            <div style="background:#1E293B;border-left:4px solid #EF4444;padding:10px 14px;border-radius:10px;">
                                🔴 <b>Outro exemplo muito comum — Resistor de 220 Ω (Vermelho, Vermelho e Marrom):</b><br>
                                1. <b>1ª faixa (Vermelho):</b> dígito <b>2</b><br>
                                2. <b>2ª faixa (Vermelho):</b> dígito <b>2</b> (juntando os dois forma <b>22</b>)<br>
                                3. <b>3ª faixa (Marrom):</b> multiplicador <b>× 10</b> (adiciona 1 zero)<br>
                                ➔ <b>22 com 1 zero = 220 Ω!</b> (22 × 10 = 220 Ohms)
                            </div>

                            <div style="margin-top:12px;background:#06101E;border:1px dashed #F59E0B;border-radius:12px;padding:10px 14px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;">
                                <div style="color:#FDE68A;font-size:0.84rem;font-weight:700;">
                                    <i class="fa-solid fa-wand-magic-sparkles"></i> Quer testar o seu resistor de 300 Ω ou qualquer outra cor agora?
                                </div>
                                <button type="button" onclick="elet_goToResistorCalc()" style="background:#F59E0B;color:#0F172A;border:none;padding:7px 14px;border-radius:10px;font-weight:900;cursor:pointer;font-size:0.82rem;display:inline-flex;align-items:center;gap:6px;box-shadow:0 3px 10px rgba(245,158,11,0.3);">
                                    <i class="fa-solid fa-calculator"></i> Abrir Calculadora de Cores
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- SLIDE 5: COMO MONTAR NO ARDUINO -->
                <div class="elet-slide-content" id="elet_slide_5">
                    <div style="font-size:1.05rem;font-weight:900;color:#10B981;margin-bottom:8px;">
                        🔌 5. Como Montar o Circuito Passo a Passo (Fácil e Rápido)
                    </div>
                    <div style="display:flex;flex-direction:column;gap:10px;font-size:0.88rem;line-height:1.55;">
                        <div style="background:#1E293B;padding:10px 14px;border-radius:12px;border-left:4px solid #F87171;">
                            <b>1️⃣ Encontre as Pernas do LED:</b><br>
                            - <span class="elet-pol-lead anode">Perna Longa (+)</span>: É o Positivo.<br>
                            - <span class="elet-pol-lead cathode">Perna Curta (-)</span>: É o Negativo (tem o chanfro reto na lente).
                        </div>
                        <div style="background:#1E293B;padding:10px 14px;border-radius:12px;border-left:4px solid #38BDF8;">
                            <b>2️⃣ Monte a Sequência Protetora (Ligação em Série):</b><br>
                            1. Conecte um fio do <b>Pino 9</b> (ou 5V) do Arduino até uma coluna da protoboard.<br>
                            2. Nessa mesma coluna, coloque uma perninha do <b>Resistor de 220 Ω</b>.<br>
                            3. Na outra ponta do resistor, conecte a <b>perna longa (+)</b> do LED.<br>
                            4. Conecte a <b>perna curta (-)</b> do LED em uma linha ligada ao pino <b>GND</b> do Arduino.<br>
                            Pronto! O caminho está fechado e protegido pelo resistor!
                        </div>
                    </div>
                </div>

                <!-- SLIDE 6: CÓDIGO C++ DO ARDUINO (PINO 9 BLINK) -->
                <div class="elet-slide-content" id="elet_slide_6">
                    <div style="font-size:1.05rem;font-weight:900;color:#38BDF8;margin-bottom:8px;">
                        💻 6. O Código Arduino C++ (HIGH = 5V e LOW = 0V)
                    </div>
                    <p style="font-size:0.88rem;color:#CBD5E1;margin:0 0 8px;">
                        Veja como é simples mandar o Arduino ligar e desligar o pino com temporização:
                    </p>
                    <pre style="background:#030712;border:1px solid #38BDF8;border-radius:12px;padding:12px;font-family:'Fira Code',monospace;font-size:0.82rem;color:#E2E8F0;margin:0;line-height:1.5;"><span class="c-kw">const</span> <span class="c-tp">int</span> pinoLed = <span class="c-num">9</span>;

<span class="c-kw">void</span> <span class="c-fn">setup</span>() {
  <span class="c-fn">pinMode</span>(pinoLed, <span class="c-kw">OUTPUT</span>); <span class="c-cm">// Define o pino 9 como saída de energia</span>
}

<span class="c-kw">void</span> <span class="c-fn">loop</span>() {
  <span class="c-fn">digitalWrite</span>(pinoLed, <span class="c-kw">HIGH</span>); <span class="c-cm">// Manda 5V (Positivo): LED acende!</span>
  <span class="c-fn">delay</span>(<span class="c-num">1000</span>);                 <span class="c-cm">// Espera 1 segundo com luz acesa</span>
  <span class="c-fn">digitalWrite</span>(pinoLed, <span class="c-kw">LOW</span>);  <span class="c-cm">// Corta para 0V (GND): LED apaga!</span>
  <span class="c-fn">delay</span>(<span class="c-num">1000</span>);                 <span class="c-cm">// Espera 1 segundo apagado e repete!</span>
}</pre>
                </div>

                <!-- RODAPÉ DE NAVEGAÇÃO DOS SLIDES -->
                <div class="elet-guide-footer">
                    <button type="button" class="elet-guide-nav-btn" onclick="elet_prevGuideSlide()"><i class="fa-solid fa-arrow-left"></i> Anterior</button>
                    <div class="elet-guide-progress-dots">
                        <span class="elet-dot active" id="elet_dot_1"></span>
                        <span class="elet-dot" id="elet_dot_2"></span>
                        <span class="elet-dot" id="elet_dot_3"></span>
                        <span class="elet-dot" id="elet_dot_4"></span>
                        <span class="elet-dot" id="elet_dot_5"></span>
                        <span class="elet-dot" id="elet_dot_6"></span>
                    </div>
                    <button type="button" class="elet-guide-nav-btn primary" onclick="elet_nextGuideSlide()">Próximo <i class="fa-solid fa-arrow-right"></i></button>
                </div>
            </div>

            <!-- ================= CALCULADORA DE RESISTORES (4 FAIXAS) ================= -->
            <div class="elet-res-calc-widget" id="elet_resistor_calculator">
                <div class="elet-calc-header">
                    <div class="elet-calc-title-area">
                        <span class="elet-calc-badge"><i class="fa-solid fa-palette"></i> FERRAMENTA INTERATIVA MAKER</span>
                        <h3><i class="fa-solid fa-calculator" style="color:#F59E0B;"></i> Calculadora de Cores do Resistor (4 Faixas)</h3>
                        <p>Selecione as cores das 4 faixas abaixo ou clique nos atalhos dos resistores mais usados para ver o valor em Ohms (Ω) calculado instantaneamente!</p>
                    </div>
                    <div class="elet-calc-presets">
                        <span style="font-size:0.78rem;font-weight:900;color:#94A3B8;text-transform:uppercase;">Valores Famosos:</span>
                        <button type="button" class="elet-preset-btn highlight" onclick="elet_calcSetPreset(3, 0, 1, 'gold')" title="Resistor de 300 Ohms!">
                            🟠 <b>300 Ω</b> (Seu Resistor!)
                        </button>
                        <button type="button" class="elet-preset-btn" onclick="elet_calcSetPreset(2, 2, 1, 'gold')" title="Resistor de 220 Ohms!">
                            🔴 220 Ω (Padrão LED)
                        </button>
                        <button type="button" class="elet-preset-btn" onclick="elet_calcSetPreset(3, 3, 1, 'gold')" title="Resistor de 330 Ohms!">
                            🟡 330 Ω (LED Seguro)
                        </button>
                        <button type="button" class="elet-preset-btn" onclick="elet_calcSetPreset(1, 0, 2, 'gold')" title="Resistor de 1000 Ohms!">
                            🟤 1 kΩ (1.000 Ω)
                        </button>
                        <button type="button" class="elet-preset-btn" onclick="elet_calcSetPreset(1, 0, 3, 'gold')" title="Resistor de 10.000 Ohms!">
                            🔵 10 kΩ (Botão/Sensor)
                        </button>
                    </div>
                </div>

                <!-- PREVIEW GRÁFICO REALISTA DO RESISTOR -->
                <div class="elet-resistor-stage">
                    <div class="elet-resistor-graphic-container">
                        <div class="elet-resistor-lead-wire left"></div>
                        <div class="elet-resistor-body-realistic" id="elet_calc_resistor_body">
                            <div class="elet-rband-realistic band-1" id="elet_rband_1" style="background:#F97316;" title="1ª Faixa (1º Dígito)">
                                <span class="elet-rband-tag" id="elet_rband_lbl_1">3 (Laranja)</span>
                            </div>
                            <div class="elet-rband-realistic band-2" id="elet_rband_2" style="background:#0F172A;" title="2ª Faixa (2º Dígito)">
                                <span class="elet-rband-tag" id="elet_rband_lbl_2">0 (Preto)</span>
                            </div>
                            <div class="elet-rband-realistic band-3" id="elet_rband_3" style="background:#78350F;" title="3ª Faixa (Multiplicador)">
                                <span class="elet-rband-tag" id="elet_rband_lbl_3">×10</span>
                            </div>
                            <div class="elet-rband-realistic band-4" id="elet_rband_4" style="background:#F59E0B;" title="4ª Faixa (Tolerância)">
                                <span class="elet-rband-tag" id="elet_rband_lbl_4">±5%</span>
                            </div>
                        </div>
                        <div class="elet-resistor-lead-wire right"></div>
                    </div>

                    <div class="elet-calc-result-display">
                        <div style="display:flex;flex-direction:column;">
                            <span style="font-size:0.8rem;color:#94A3B8;font-weight:900;text-transform:uppercase;letter-spacing:0.5px;">Resistência Calculada:</span>
                            <div class="elet-calc-val-number" id="elet_calc_val_formatted">300 Ω <span style="font-size:1.1rem;color:#F59E0B;font-weight:700;">±5%</span></div>
                        </div>
                        <button type="button" class="elet-apply-bench-btn" onclick="elet_applyCalcToBench()" id="elet_btn_apply_bench">
                            <i class="fa-solid fa-microchip"></i> Testar no Simulador da Bancada ⚡
                        </button>
                    </div>
                </div>

                <!-- SELETORES DAS 4 FAIXAS -->
                <div class="elet-calc-selectors-grid">
                    <!-- Coluna 1: 1ª Faixa -->
                    <div class="elet-calc-col">
                        <div class="elet-calc-col-header">
                            <span class="elet-calc-band-num">1</span>
                            <div>
                                <b>1ª Faixa</b>
                                <small>1º Dígito</small>
                            </div>
                        </div>
                        <select id="elet_sel_band_1" class="elet-band-select" onchange="elet_onCalcBandChange()">
                            <option value="1">🟤 Marrom (1)</option>
                            <option value="2">🔴 Vermelho (2)</option>
                            <option value="3" selected>🟠 Laranja (3)</option>
                            <option value="4">🟡 Amarelo (4)</option>
                            <option value="5">🟢 Verde (5)</option>
                            <option value="6">🔵 Azul (6)</option>
                            <option value="7">🟣 Violeta (7)</option>
                            <option value="8">⚪ Cinza (8)</option>
                            <option value="9">⬜ Branco (9)</option>
                        </select>
                        <div class="elet-band-swatches" id="elet_swatches_1"></div>
                    </div>

                    <!-- Coluna 2: 2ª Faixa -->
                    <div class="elet-calc-col">
                        <div class="elet-calc-col-header">
                            <span class="elet-calc-band-num">2</span>
                            <div>
                                <b>2ª Faixa</b>
                                <small>2º Dígito</small>
                            </div>
                        </div>
                        <select id="elet_sel_band_2" class="elet-band-select" onchange="elet_onCalcBandChange()">
                            <option value="0" selected>⚫ Preto (0)</option>
                            <option value="1">🟤 Marrom (1)</option>
                            <option value="2">🔴 Vermelho (2)</option>
                            <option value="3">🟠 Laranja (3)</option>
                            <option value="4">🟡 Amarelo (4)</option>
                            <option value="5">🟢 Verde (5)</option>
                            <option value="6">🔵 Azul (6)</option>
                            <option value="7">🟣 Violeta (7)</option>
                            <option value="8">⚪ Cinza (8)</option>
                            <option value="9">⬜ Branco (9)</option>
                        </select>
                        <div class="elet-band-swatches" id="elet_swatches_2"></div>
                    </div>

                    <!-- Coluna 3: 3ª Faixa (Multiplicador) -->
                    <div class="elet-calc-col">
                        <div class="elet-calc-col-header">
                            <span class="elet-calc-band-num">3</span>
                            <div>
                                <b>3ª Faixa</b>
                                <small>Multiplicador (Zeros)</small>
                            </div>
                        </div>
                        <select id="elet_sel_band_3" class="elet-band-select" onchange="elet_onCalcBandChange()">
                            <option value="0">⚫ Preto (×1 - Nenhum zero)</option>
                            <option value="1" selected>🟤 Marrom (×10 - Adicione 1 zero)</option>
                            <option value="2">🔴 Vermelho (×100 - Adicione 2 zeros)</option>
                            <option value="3">🟠 Laranja (×1.000 / 1k - Adicione 3 zeros)</option>
                            <option value="4">🟡 Amarelo (×10.000 / 10k)</option>
                            <option value="5">🟢 Verde (×100.000 / 100k)</option>
                            <option value="6">🔵 Azul (×1.000.000 / 1M)</option>
                            <option value="-1">🟡 Dourado (×0.1)</option>
                            <option value="-2">⚪ Prateado (×0.01)</option>
                        </select>
                        <div class="elet-band-swatches" id="elet_swatches_3"></div>
                    </div>

                    <!-- Coluna 4: 4ª Faixa (Tolerância) -->
                    <div class="elet-calc-col">
                        <div class="elet-calc-col-header">
                            <span class="elet-calc-band-num">4</span>
                            <div>
                                <b>4ª Faixa</b>
                                <small>Tolerância (Precisão)</small>
                            </div>
                        </div>
                        <select id="elet_sel_band_4" class="elet-band-select" onchange="elet_onCalcBandChange()">
                            <option value="gold" selected>🟡 Dourado (±5% - Padrão Maker)</option>
                            <option value="silver">⚪ Prateado (±10%)</option>
                            <option value="brown">🟤 Marrom (±1% - Alta Precisão)</option>
                            <option value="red">🔴 Vermelho (±2%)</option>
                        </select>
                        <div class="elet-band-swatches" id="elet_swatches_4"></div>
                    </div>
                </div>

                <!-- PASSO A PASSO + VEREDITO ARDUINO -->
                <div class="elet-calc-explanation-row">
                    <div class="elet-calc-step-formula" id="elet_calc_step_formula">
                        <!-- Carregado via JS -->
                    </div>
                    <div class="elet-calc-arduino-verdict" id="elet_calc_arduino_verdict">
                        <!-- Carregado via JS -->
                    </div>
                </div>
            </div>

            <!-- NAVEGAÇÃO DOS NÍVEIS -->
            <div class="elet-level-bar">
                <button type="button" class="elet-level-btn active" id="elet_btn_lvl_1" onclick="elet_switchLevel(1)">
                    <div class="elet-lvl-left">
                        <div class="elet-lvl-num">1</div>
                        <div class="elet-lvl-info">
                            <span class="elet-lvl-title">Nível 1: Positivo & Resistor 220Ω</span>
                            <span class="elet-lvl-sub">VR = 5V - 2V = 3V (Ohm)</span>
                        </div>
                    </div>
                    <div class="elet-lvl-status" id="elet_lvl_stat_1">⭐</div>
                </button>
                <button type="button" class="elet-level-btn" id="elet_btn_lvl_2" onclick="elet_switchLevel(2)">
                    <div class="elet-lvl-left">
                        <div class="elet-lvl-num">2</div>
                        <div class="elet-lvl-info">
                            <span class="elet-lvl-title">Nível 2: Cores de LED (Verde & Azul)</span>
                            <span class="elet-lvl-sub">Quedas de Pressão por Cor</span>
                        </div>
                    </div>
                    <div class="elet-lvl-status" id="elet_lvl_stat_2">🔒</div>
                </button>
                <button type="button" class="elet-level-btn" id="elet_btn_lvl_3" onclick="elet_switchLevel(3)">
                    <div class="elet-lvl-left">
                        <div class="elet-lvl-num">3</div>
                        <div class="elet-lvl-info">
                            <span class="elet-lvl-title">Nível 3: Montagem no Pino 9</span>
                            <span class="elet-lvl-sub">pinMode & digitalWrite (Blink)</span>
                        </div>
                    </div>
                    <div class="elet-lvl-status" id="elet_lvl_stat_3">🔒</div>
                </button>
                <button type="button" class="elet-level-btn" id="elet_btn_lvl_4" onclick="elet_switchLevel(4)">
                    <div class="elet-lvl-left">
                        <div class="elet-lvl-num">4</div>
                        <div class="elet-lvl-info">
                            <span class="elet-lvl-title">Nível 4: Cores do Resistor 220Ω</span>
                            <span class="elet-lvl-sub">Vermelho-Vermelho-Marrom</span>
                        </div>
                    </div>
                    <div class="elet-lvl-status" id="elet_lvl_stat_4">🔒</div>
                </button>
                <button type="button" class="elet-level-btn" id="elet_btn_lvl_5" onclick="elet_switchLevel(5)">
                    <div class="elet-lvl-left">
                        <div class="elet-lvl-num">5</div>
                        <div class="elet-lvl-info">
                            <span class="elet-lvl-title">Nível 5: O Multímetro Maker</span>
                            <span class="elet-lvl-sub">Fluxo Seguro (13.6 mA)</span>
                        </div>
                    </div>
                    <div class="elet-lvl-status" id="elet_lvl_stat_5">🔒</div>
                </button>
                <button type="button" class="elet-level-btn" id="elet_btn_lvl_6" onclick="elet_switchLevel(6)">
                    <div class="elet-lvl-left">
                        <div class="elet-lvl-num">6</div>
                        <div class="elet-lvl-info">
                            <span class="elet-lvl-title">Nível 6: Guardião Anti-Queima</span>
                            <span class="elet-lvl-sub">Proteção se Corrente > 25mA</span>
                        </div>
                    </div>
                    <div class="elet-lvl-status" id="elet_lvl_stat_6">🔒</div>
                </button>
            </div>

            <!-- CARD DE HISTÓRIA / MISSÃO ATIVA -->
            <div class="elet-story-card">
                <div class="elet-story-header">
                    <span class="elet-story-title" id="elet_story_title">🎯 Missão 1</span>
                    <span class="elet-story-badge" id="elet_story_badge">Lei de Ohm</span>
                </div>
                <p class="elet-story-text" id="elet_story_desc">Carregando missão...</p>
            </div>

            <!-- CENÁRIO GRÁFICO E SIMULADOR INTERATIVO -->
            <div class="elet-stage-card">
                <div class="elet-stage-hud">
                    <div class="elet-hud-item">
                        <span>🧪 Bancada Maker de Eletrônica:</span>
                        <span style="font-family:'Fira Code';color:#F87171;font-weight:900;" id="elet_hud_circuit_status">Circuito Calibrado em 5V</span>
                    </div>
                    <div class="elet-hud-item">
                        <span class="elet-pill volt elet-clickable-element tension-element" id="elet_pill_volt" onclick="elet_showRobotTip('voltage', 'elet_pill_volt')" title="⚡ Clique para ouvir a dica da Tensão!">⚡ V: Tensão</span>
                        <span class="elet-pill res elet-clickable-element resistance-element" id="elet_pill_res" onclick="elet_showRobotTip('resistance', 'elet_pill_res')" title="🤏 Clique para ouvir a dica da Resistência!">🛡️ R: Resistência</span>
                        <span class="elet-pill curr elet-clickable-element current-element" id="elet_pill_curr" onclick="elet_showRobotTip('current', 'elet_pill_curr')" title="🏃 Clique para ouvir a dica da Corrente!">🌊 I: Corrente</span>
                        <span class="elet-pill pwr elet-clickable-element" id="elet_pill_pwr" onclick="elet_showRobotTip('danger', 'elet_pill_pwr')" title="💥 Clique para ouvir a dica de Segurança!">⚠️ P: Potência</span>
                    </div>
                </div>

                <!-- SELETOR DE COR DO LED NA BANCADA -->
                <div class="elet-color-selector">
                    <span style="font-weight:900;font-size:0.82rem;color:#CBD5E1;"><i class="fa-solid fa-palette"></i> Testar Cor do LED:</span>
                    <button type="button" class="elet-color-btn active" id="elet_cbtn_red" onclick="elet_setLedColor('red')">🔴 Vermelho (2.0V)</button>
                    <button type="button" class="elet-color-btn" id="elet_cbtn_yellow" onclick="elet_setLedColor('yellow')">🟡 Amarelo (2.0V)</button>
                    <button type="button" class="elet-color-btn" id="elet_cbtn_green" onclick="elet_setLedColor('green')">🟢 Verde (2.2V)</button>
                    <button type="button" class="elet-color-btn" id="elet_cbtn_blue" onclick="elet_setLedColor('blue')">🔵 Azul (3.2V)</button>
                    <button type="button" class="elet-color-btn" id="elet_cbtn_white" onclick="elet_setLedColor('white')">⚪ Branco (3.2V)</button>
                </div>

                <div class="elet-bench-grid">
                    <!-- Painel Esquerdo: Tubo Animado de Elétrons & Sliders -->
                    <div class="elet-pipe-chamber elet-clickable-element current-element" id="elet_pipe_chamber_box" onclick="elet_showRobotTip('current', 'elet_pipe_chamber_box')" title="🏃 Tubo de Elétrons: Clique para a dica do Robô!">
                        <div style="display:flex;justify-content:space-between;align-items:center;">
                            <span style="font-weight:900;font-size:0.85rem;color:#94A3B8;text-transform:uppercase;letter-spacing:1px;">
                                <i class="fa-solid fa-atom"></i> Tubo Condutor & Fluxo de Elétrons
                            </span>
                            <span style="font-size:0.78rem;color:#38BDF8;font-family:'Fira Code';font-weight:800;" id="elet_flow_speed_lbl">Fluxo: Normal</span>
                        </div>

                        <div class="elet-pipe-view">
                            <div class="elet-pipe-barrel">
                                <div class="elet-electron-stream" id="elet_electron_stream"></div>
                                <div class="elet-pipe-narrow elet-clickable-element resistance-element" id="elet_pipe_constriction" onclick="event.stopPropagation(); elet_showRobotTip('resistance', 'elet_pipe_constriction');" title="🤏 Resistor: O portão estreito!">220Ω</div>
                            </div>
                        </div>

                        <!-- Sliders Reativos de Teste da Bancada -->
                        <div class="elet-sliders-row" onclick="event.stopPropagation();">
                            <div class="elet-slider-box elet-clickable-element tension-element" id="elet_sbox_v" onclick="elet_showRobotTip('voltage', 'elet_sbox_v')" title="⚡ Tensão: Clique para dica do Robô!">
                                <div class="elet-slider-label">
                                    <span>Tensão da Fonte (Vfonte):</span>
                                    <b style="color:#F87171;" id="elet_val_v_lbl">5.0 V</b>
                                </div>
                                <input type="range" class="elet-slider-input" id="elet_slider_v" min="1" max="12" step="0.5" value="5" oninput="elet_onSliderChange()" />
                            </div>
                            <div class="elet-slider-box elet-clickable-element resistance-element" id="elet_sbox_r" onclick="elet_showRobotTip('resistance', 'elet_sbox_r')" title="🤏 Resistência: Clique para dica do Robô!">
                                <div class="elet-slider-label">
                                    <span>Resistor de Proteção (R):</span>
                                    <b style="color:#FBBF24;" id="elet_val_r_lbl">220 Ω</b>
                                </div>
                                <input type="range" class="elet-slider-input" id="elet_slider_r" min="50" max="1000" step="10" value="220" oninput="elet_onSliderChange()" />
                            </div>
                        </div>

                        <!-- Câmara do LED Reativo -->
                        <div class="elet-led-chamber elet-clickable-element" id="elet_led_chamber_box" onclick="elet_showRobotTip('current', 'elet_led_chamber_box')" title="💡 LED: Clique para ver o corre-corre!">
                            <div style="display:flex;align-items:center;gap:12px;">
                                <div class="elet-led-bulb lit-safe" id="elet_led_bulb">
                                    <i class="fa-solid fa-lightbulb"></i>
                                    <div id="elet_smoke_container"></div>
                                </div>
                                <div>
                                    <div style="font-weight:900;font-size:0.9rem;" id="elet_led_state_title">LED Vermelho em Operação Segura</div>
                                    <div style="font-size:0.78rem;color:#94A3B8;" id="elet_led_state_desc">VR = 3.0V | Corrente ideal de 13.6 mA com resistor comercial de 220Ω.</div>
                                </div>
                            </div>
                            <div id="elet_led_badge" style="background:#064E3B;color:#34D399;font-weight:900;padding:4px 10px;border-radius:10px;font-size:0.75rem;white-space:nowrap;">
                                ✅ SEGURO
                            </div>
                        </div>

                        <!-- INFOGRÁFICO DE POLARIDADE DO LED -->
                        <div class="elet-polarity-box">
                            <div style="font-weight:900;color:#FCA5A5;margin-bottom:4px;display:flex;align-items:center;gap:6px;">
                                <i class="fa-solid fa-plug"></i> Identificação dos Terminais do LED:
                            </div>
                            <div style="display:flex;gap:14px;flex-wrap:wrap;">
                                <span><span class="elet-pol-lead anode">Ânodo (+)</span>: Perna <b>mais longa</b> (liga no Pino 9 com Resistor).</span>
                                <span><span class="elet-pol-lead cathode">Cátodo (-)</span>: Perna <b>mais curta / chanfro reto</b> (liga no GND).</span>
                            </div>
                        </div>
                    </div>

                    <!-- Painel Direito: Multímetro Digital Maker -->
                    <div class="elet-multimeter elet-clickable-element" id="elet_multimeter_box" onclick="elet_showRobotTip('current', 'elet_multimeter_box')" title="🏃 Multímetro: Mede a turminha correndo!">
                        <div class="elet-multi-lcd">
                            <div class="elet-multi-lcd-label">
                                <span>CORRENTE (I = VR / R)</span>
                                <span>DC mA</span>
                            </div>
                            <div class="elet-multi-lcd-val" id="elet_lcd_i_val">13.6 mA</div>
                        </div>

                        <div class="elet-multi-stats">
                            <div class="elet-m-stat elet-clickable-element" onclick="event.stopPropagation(); elet_showRobotTip('voltage', 'elet_m_v_val');">
                                <div class="elet-m-label">Tensão no Resistor (VR)</div>
                                <div class="elet-m-value" style="color:#F87171;" id="elet_m_v_val">3.00 V</div>
                            </div>
                            <div class="elet-m-stat elet-clickable-element" onclick="event.stopPropagation(); elet_showRobotTip('resistance', 'elet_m_r_val');">
                                <div class="elet-m-label">Resistência Comercial</div>
                                <div class="elet-m-value" style="color:#FBBF24;" id="elet_m_r_val">220 Ω</div>
                            </div>
                            <div class="elet-m-stat elet-clickable-element" onclick="event.stopPropagation(); elet_showRobotTip('voltage', 'elet_m_vled_val');">
                                <div class="elet-m-label">Queda no LED (Vled)</div>
                                <div class="elet-m-value" style="color:#A78BFA;" id="elet_m_vled_val">2.00 V</div>
                            </div>
                            <div class="elet-m-stat elet-clickable-element" onclick="event.stopPropagation(); elet_showRobotTip('danger', 'elet_m_t_val');">
                                <div class="elet-m-label">Limite ATmega328P</div>
                                <div class="elet-m-value" style="color:#34D399;" id="elet_m_t_val">Seguro (&lt;20mA)</div>
                            </div>
                        </div>

                        <!-- Mini Decodificador de Faixas -->
                        <div class="elet-color-calc elet-clickable-element" id="elet_res_calc_box" onclick="event.stopPropagation(); elet_goToResistorCalc();" title="🤏 Código de Cores do Resistor! Clique para abrir a Calculadora Completa!">
                            <div style="display:flex;justify-content:space-between;align-items:center;font-size:0.78rem;font-weight:900;color:#CBD5E1;">
                                <span>Faixas de Cor do Resistor:</span>
                                <span id="elet_band_val_name" style="color:#FBBF24;font-family:'Fira Code';">300 Ω ±5%</span>
                            </div>
                            <div class="elet-res-preview">
                                <div class="elet-res-lead left"></div>
                                <div class="elet-res-band" id="elet_b1" style="left:40px;background:#F97316;" title="Laranja = 3"></div>
                                <div class="elet-res-band" id="elet_b2" style="left:70px;background:#0F172A;" title="Preto = 0"></div>
                                <div class="elet-res-band" id="elet_b3" style="left:100px;background:#78350F;" title="Marrom = x10"></div>
                                <div class="elet-res-band" id="elet_b4" style="left:150px;background:#F59E0B;" title="Ouro = ±5%"></div>
                                <div class="elet-res-lead right"></div>
                            </div>
                            <div style="font-size:0.72rem;color:#FBBF24;text-align:center;font-weight:800;margin-top:4px;">
                                <i class="fa-solid fa-calculator"></i> Clique para abrir a Calculadora de Cores ➔
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- PAINEL: DICAS DO ROBÔ (O CORRE-CORRE DOS ELÉTRONS & LEI DE OHM) -->
            <div class="elet-robot-panel" id="elet_robot_panel">
                <div class="elet-robot-panel-top">
                    <div class="elet-robot-panel-title">
                        <i class="fa-solid fa-robot"></i> 🤖 Dicas do Robô: A Brincadeira do Corre-Corre dos Elétrons!
                    </div>
                    <div style="display:flex;gap:6px;flex-wrap:wrap;">
                        <button type="button" class="elet-robot-topic-btn active tension-element" id="elet_rtab_voltage" onclick="elet_showRobotTip('voltage', 'elet_pill_volt')">
                            ⚡ 1. Tensão (Pressão Hidráulica & Empurrão)
                        </button>
                        <button type="button" class="elet-robot-topic-btn resistance-element" id="elet_rtab_resistance" onclick="elet_showRobotTip('resistance', 'elet_pill_res')">
                            🤏 2. Resistência (Estreitamento do Cano)
                        </button>
                        <button type="button" class="elet-robot-topic-btn current-element" id="elet_rtab_current" onclick="elet_showRobotTip('current', 'elet_pill_curr')">
                            🏃 3. Corrente (Vazão & Corre-Corre)
                        </button>
                        <button type="button" class="elet-robot-topic-btn" id="elet_rtab_danger" onclick="elet_showRobotTip('danger', 'elet_pill_pwr')">
                            💥 4. Sem Resistor (Perigo!)
                        </button>
                    </div>
                </div>

                <div class="elet-robot-stage">
                    <div class="elet-robot-figure">
                        <div class="elet-robot-avatar-big" onclick="elet_playRobotBeep()" title="Clique para ouvir o Robô!">🤖</div>
                        <span class="elet-robot-badge-name">Robô Maker</span>
                    </div>

                    <div class="elet-speech-bubble robot-speech-bubble" id="elet_speech_bubble">
                        <div class="elet-bubble-header">
                            <span class="elet-bubble-topic-title" id="elet_bubble_title">
                                ⚡ TENSÃO (V): A Pressão da Água no Sistema Hidráulico & O Corre-Corre dos Elétrons!
                            </span>
                            <span class="elet-bubble-formula" id="elet_bubble_formula">V = R · I (Pressão Hidráulica / Tensão em Volts)</span>
                        </div>
                        <div class="elet-bubble-body" id="elet_bubble_text">
                            Em um <b>sistema hidráulico</b>, a <b>Tensão (V em Volts)</b> funciona exatamente como a <b>pressão da água</b>: pense em uma caixa d'água bem alta ou uma bomba pressurizando a tubulação! Quanto mais alta a caixa d'água, maior é a pressão que empurra a água para descer pelo cano. Na brincadeira de <b>corre-corre dos elétrons</b> no circuito do Arduino (5V), essa pressão é o que dá a largada com toda a força, empurrando a turminha de elétrons para disparar pelos fios condutores!
                        </div>
                        <div class="elet-bubble-summary" id="elet_bubble_summary">
                            <i class="fa-solid fa-lightbulb"></i> <b>Resumo Maker:</b> Tensão (V) = Pressão da água em um sistema hidráulico empurrando os elétrons no corre-corre!
                        </div>
                    </div>
                </div>
            </div>

            <!-- GRID PRINCIPAL: MINI-IDE & PAINEL ARDUINO C++ -->
            <div class="elet-ide-layout">
                <div class="elet-editor-card">
                    <div class="elet-editor-topbar">
                        <span class="elet-editor-title"><i class="fa-solid fa-code"></i> Editor Arduino C/C++ (Lei de Ohm no LED)</span>
                        <span style="font-family:'Fira Code';font-size:0.75rem;background:#1E293B;padding:3px 8px;border-radius:6px;color:#94A3B8;">sketch.ino</span>
                    </div>

                    <!-- SCAFFOLDING NÍVEL 1: LED Vermelho & Resistor de 220 Ohms -->
                    <div id="elet_scaffold_n1" class="elet-scaffold-lines">
                        <div class="elet-scaffold-line"><span class="c-cm">// 🔴 Alimentação do Arduino em 5V para acender LED Vermelho (V_LED = 2.0V, I = 15mA):</span></div>
                        <div class="elet-scaffold-line"><span class="c-tp">float</span> vFonte = <span class="c-num">5.0</span>; <span class="c-cm">// 5 Volts (nível HIGH)</span></div>
                        <div class="elet-scaffold-line"><span class="c-tp">float</span> vLed = <span class="c-num">2.0</span>; <span class="c-cm">// Queda consumida pelo LED</span></div>
                        <div class="elet-scaffold-line"><span class="c-tp">float</span> iDesejada = <span class="c-num">0.015</span>; <span class="c-cm">// 15 mA (0.015A)</span></div>
                        <div class="elet-scaffold-line" style="margin-top:8px;"><span class="c-kw">void</span> <span class="c-fn">loop</span>() {</div>
                        <div class="elet-scaffold-line" style="margin-left:14px;border-left:2px solid #F87171;padding-left:10px;">
                            <span class="c-cm">// 🎯 Objetivo 1: Calcule a tensão restante (VR) que o resistor deve absorver:</span><br>
                            <select class="elet-select-cmd" id="elet_n1_vres" onchange="elet_updateLiveCpp()">
                                <option value="" selected disabled>— selecione o cálculo da tensão no resistor —</option>
                                <option value="float vResistor = vFonte + vLed;">float vResistor = vFonte + vLed;</option>
                                <option value="float vResistor = &quot;vFonte - vLed&quot;;">float vResistor = "vFonte - vLed";</option>
                                <option value="float vResistor = vFonte * vLed;">float vResistor = vFonte * vLed;</option>
                                <option value="float vResistor = vFonte - vLed;">float vResistor = vFonte - vLed;</option>
                                <option value="stirng vResistor = vFonte - vLed;">stirng vResistor = vFonte - vLed;</option>
                                <option value="float vResistor == vFonte - vLed;">float vResistor == vFonte - vLed;</option>
                            </select>
                        </div>
                        <div class="elet-scaffold-line" style="margin-left:14px;border-left:2px solid #38BDF8;padding-left:10px;margin-top:6px;">
                            <span class="c-cm">// 🎯 Objetivo 2: Aplique a Lei de Ohm (R = V / I) para encontrar o valor do resistor limitador:</span><br>
                            <select class="elet-select-cmd" id="elet_n1_rcalc" onchange="elet_updateLiveCpp()">
                                <option value="" selected disabled>— selecione a fórmula da resistência —</option>
                                <option value="float rCalculado = vResistor * iDesejada;">float rCalculado = vResistor * iDesejada;</option>
                                <option value="float rCalculado = &quot;200.0&quot;;">float rCalculado = "200.0";</option>
                                <option value="float rCalculado = iDesejada / vResistor;">float rCalculado = iDesejada / vResistor;</option>
                                <option value="float rCalculado = vResistor / iDesejada;">float rCalculado = vResistor / iDesejada;</option>
                                <option value="stirng rCalculado = vResistor / iDesejada;">stirng rCalculado = vResistor / iDesejada;</option>
                            </select>
                        </div>
                        <div class="elet-scaffold-line">}</div>
                    </div>

                    <!-- SCAFFOLDING NÍVEL 2: Dimensionamento por Cor (Verde e Azul/Branco) -->
                    <div id="elet_scaffold_n2" class="elet-scaffold-lines" style="display:none;">
                        <div class="elet-scaffold-line"><span class="c-cm">// 🔵 Dimensionando LED Azul/Branco (V_LED = 3.2V) com fonte de 5.0V e 15mA:</span></div>
                        <div class="elet-scaffold-line"><span class="c-tp">float</span> vFonte = <span class="c-num">5.0</span>;</div>
                        <div class="elet-scaffold-line"><span class="c-tp">float</span> vLedAzul = <span class="c-num">3.2</span>; <span class="c-cm">// Queda maior</span></div>
                        <div class="elet-scaffold-line"><span class="c-tp">float</span> iOperacao = <span class="c-num">0.015</span>; <span class="c-cm">// 15 mA</span></div>
                        <div class="elet-scaffold-line" style="margin-top:8px;"><span class="c-kw">void</span> <span class="c-fn">loop</span>() {</div>
                        <div class="elet-scaffold-line" style="margin-left:14px;border-left:2px solid #38BDF8;padding-left:10px;">
                            <span class="c-cm">// 🎯 Objetivo 1: Calcule a tensão restante no resistor para o LED Azul:</span><br>
                            <select class="elet-select-cmd" id="elet_n2_vazul" onchange="elet_updateLiveCpp()">
                                <option value="" selected disabled>— cálculo de VR para LED Azul —</option>
                                <option value="float vResAzul = vFonte + vLedAzul;">float vResAzul = vFonte + vLedAzul;</option>
                                <option value="float vResAzul = &quot;1.8&quot;;">float vResAzul = "1.8";</option>
                                <option value="float vResAzul = vLedAzul - vFonte;">float vResAzul = vLedAzul - vFonte;</option>
                                <option value="float vResAzul = vFonte - vLedAzul;">float vResAzul = vFonte - vLedAzul;</option>
                                <option value="stirng vResAzul = vFonte - vLedAzul;">stirng vResAzul = vFonte - vLedAzul;</option>
                            </select>
                        </div>
                        <div class="elet-scaffold-line" style="margin-left:14px;border-left:2px solid #10B981;padding-left:10px;margin-top:6px;">
                            <span class="c-cm">// 🎯 Objetivo 2: Calcule a resistência ideal para o LED Azul (R = VR / I):</span><br>
                            <select class="elet-select-cmd" id="elet_n2_razul" onchange="elet_updateLiveCpp()">
                                <option value="" selected disabled>— cálculo de R para LED Azul —</option>
                                <option value="float rAzul = vResAzul * iOperacao;">float rAzul = vResAzul * iOperacao;</option>
                                <option value="float rAzul = &quot;120.0&quot;;">float rAzul = "120.0";</option>
                                <option value="float rAzul = iOperacao / vResAzul;">float rAzul = iOperacao / vResAzul;</option>
                                <option value="float rAzul = vResAzul / iOperacao;">float rAzul = vResAzul / iOperacao;</option>
                                <option value="stirng rAzul = 120;">stirng rAzul = 120;</option>
                            </select>
                        </div>
                        <div class="elet-scaffold-line">}</div>
                    </div>

                    <!-- SCAFFOLDING NÍVEL 3: Montagem & Firmware no Arduino (Pino Digital 9) -->
                    <div id="elet_scaffold_n3" class="elet-scaffold-lines" style="display:none;">
                        <div class="elet-scaffold-line"><span class="c-cm">// 🔌 Circuito no Pino Digital 9 com resistor de 220 Ohms em série:</span></div>
                        <div class="elet-scaffold-line"><span class="c-kw">const</span> <span class="c-tp">int</span> pinoLed = <span class="c-num">9</span>;</div>
                        <div class="elet-scaffold-line" style="margin-top:6px;"><span class="c-kw">void</span> <span class="c-fn">setup</span>() {</div>
                        <div class="elet-scaffold-line" style="margin-left:14px;border-left:2px solid #F59E0B;padding-left:10px;">
                            <span class="c-cm">// 🎯 Objetivo 1: Configure o pino 9 como saída de tensão no setup():</span><br>
                            <select class="elet-select-cmd" id="elet_n3_pinmode" onchange="elet_updateLiveCpp()">
                                <option value="" selected disabled>— configuração da porta do pino —</option>
                                <option value="pinMode(pinoLed, INPUT);">pinMode(pinoLed, INPUT);</option>
                                <option value="pinMode(pinoLed, &quot;OUTPUT&quot;);">pinMode(pinoLed, "OUTPUT");</option>
                                <option value="pinMode(9, 5);">pinMode(9, 5);</option>
                                <option value="pinMode(pinoLed, OUTPUT);">pinMode(pinoLed, OUTPUT);</option>
                                <option value="stirng pinMode = OUTPUT;">stirng pinMode = OUTPUT;</option>
                            </select>
                        </div>
                        <div class="elet-scaffold-line">}</div>
                        <div class="elet-scaffold-line" style="margin-top:6px;"><span class="c-kw">void</span> <span class="c-fn">loop</span>() {</div>
                        <div class="elet-scaffold-line" style="margin-left:14px;border-left:2px solid #10B981;padding-left:10px;">
                            <span class="c-cm">// 🎯 Objetivo 2: Forneça 5V (corrente flui pelo LED), aguarde 1s, forneça 0V (apaga) e aguarde 1s:</span><br>
                            <select class="elet-select-cmd" id="elet_n3_blink" onchange="elet_updateLiveCpp()">
                                <option value="" selected disabled>— sequência de alternância e temporização —</option>
                                <option value="digitalWrite(pinoLed, HIGH); delay(100); digitalWrite(pinoLed, LOW); delay(100);">digitalWrite(pinoLed, HIGH); delay(100); digitalWrite(pinoLed, LOW); delay(100);</option>
                                <option value="digitalWrite(pinoLed, &quot;HIGH&quot;); delay(1000); digitalWrite(pinoLed, &quot;LOW&quot;); delay(1000);">digitalWrite(pinoLed, "HIGH"); delay(1000); digitalWrite(pinoLed, "LOW"); delay(1000);</option>
                                <option value="digitalWrite(pinoLed, 5); delay(1000); digitalWrite(pinoLed, 0); delay(1000);">digitalWrite(pinoLed, 5); delay(1000); digitalWrite(pinoLed, 0); delay(1000);</option>
                                <option value="digitalWrite(pinoLed, HIGH); delay(1000); digitalWrite(pinoLed, LOW); delay(1000);">digitalWrite(pinoLed, HIGH); delay(1000); digitalWrite(pinoLed, LOW); delay(1000);</option>
                                <option value="stirng blink = HIGH;">stirng blink = HIGH;</option>
                            </select>
                        </div>
                        <div class="elet-scaffold-line">}</div>
                    </div>

                    <!-- SCAFFOLDING NÍVEL 4: Código de Cores do Resistor de 220Ω -->
                    <div id="elet_scaffold_n4" class="elet-scaffold-lines" style="display:none;">
                        <div class="elet-scaffold-line"><span class="c-cm">// 🎨 Decodificação das faixas do resistor de 220 Ohms (vermelho-vermelho-marrom):</span></div>
                        <div class="elet-scaffold-line"><span class="c-tp">int</span> faixa1 = <span class="c-num">2</span>; <span class="c-cm">// Vermelho (1º dígito)</span></div>
                        <div class="elet-scaffold-line"><span class="c-tp">int</span> faixa2 = <span class="c-num">2</span>; <span class="c-cm">// Vermelho (2º dígito)</span></div>
                        <div class="elet-scaffold-line"><span class="c-tp">int</span> multiplicador = <span class="c-num">10</span>; <span class="c-cm">// Marrom (x10)</span></div>
                        <div class="elet-scaffold-line" style="margin-top:8px;"><span class="c-kw">void</span> <span class="c-fn">loop</span>() {</div>
                        <div class="elet-scaffold-line" style="margin-left:14px;border-left:2px solid #A78BFA;padding-left:10px;">
                            <span class="c-cm">// 🎯 Objetivo 1: Calcule o valor comercial de 220 Ohms combinando dezena, unidade e multiplicador:</span><br>
                            <select class="elet-select-cmd" id="elet_n4_calc_ohms" onchange="elet_updateLiveCpp()">
                                <option value="" selected disabled>— fórmula das faixas de cores —</option>
                                <option value="int rOhms = (faixa1 + faixa2) * multiplicador;">int rOhms = (faixa1 + faixa2) * multiplicador;</option>
                                <option value="int rOhms = &quot;220&quot;;">int rOhms = "220";</option>
                                <option value="int rOhms = faixa1 * faixa2 * multiplicador;">int rOhms = faixa1 * faixa2 * multiplicador;</option>
                                <option value="int rOhms = (faixa1 * 10 + faixa2) * multiplicador;">int rOhms = (faixa1 * 10 + faixa2) * multiplicador;</option>
                                <option value="stirng rOhms = 220;">stirng rOhms = 220;</option>
                            </select>
                        </div>
                        <div class="elet-scaffold-line">}</div>
                    </div>

                    <!-- SCAFFOLDING NÍVEL 5: Multímetro & Potência Dissipada (mW) -->
                    <div id="elet_scaffold_n5" class="elet-scaffold-lines" style="display:none;">
                        <div class="elet-scaffold-line"><span class="c-cm">// 📟 Leitura do multímetro: VR = 3.0V e resistor de 220.0 Ohms:</span></div>
                        <div class="elet-scaffold-line"><span class="c-tp">float</span> vResistor = <span class="c-num">3.0</span>; <span class="c-cm">// Volts sobre o resistor</span></div>
                        <div class="elet-scaffold-line"><span class="c-tp">float</span> rComercial = <span class="c-num">220.0</span>; <span class="c-cm">// Ohms</span></div>
                        <div class="elet-scaffold-line" style="margin-top:8px;"><span class="c-kw">void</span> <span class="c-fn">loop</span>() {</div>
                        <div class="elet-scaffold-line" style="margin-left:14px;border-left:2px solid #38BDF8;padding-left:10px;">
                            <span class="c-cm">// 🎯 Objetivo 1: Calcule a corrente real que está passando pelo LED e resistor (I = V / R):</span><br>
                            <select class="elet-select-cmd" id="elet_n5_corrente_real" onchange="elet_updateLiveCpp()">
                                <option value="" selected disabled>— cálculo da corrente medida —</option>
                                <option value="float iReal = vResistor * rComercial;">float iReal = vResistor * rComercial;</option>
                                <option value="float iReal = &quot;0.0136&quot;;">float iReal = "0.0136";</option>
                                <option value="float iReal = rComercial / vResistor;">float iReal = rComercial / vResistor;</option>
                                <option value="float iReal = vResistor / rComercial;">float iReal = vResistor / rComercial;</option>
                                <option value="stirng iReal = vResistor / rComercial;">stirng iReal = vResistor / rComercial;</option>
                            </select>
                        </div>
                        <div class="elet-scaffold-line" style="margin-left:14px;border-left:2px solid #FBBF24;padding-left:10px;margin-top:6px;">
                            <span class="c-cm">// 🎯 Objetivo 2: Calcule a potência consumida em Watts (P = V * I):</span><br>
                            <select class="elet-select-cmd" id="elet_n5_potencia" onchange="elet_updateLiveCpp()">
                                <option value="" selected disabled>— fórmula da potência elétrica —</option>
                                <option value="float potencia = vResistor + iReal;">float potencia = vResistor + iReal;</option>
                                <option value="float potencia = &quot;vResistor * iReal&quot;;">float potencia = "vResistor * iReal";</option>
                                <option value="float potencia = vResistor / iReal;">float potencia = vResistor / iReal;</option>
                                <option value="float potencia = vResistor * iReal;">float potencia = vResistor * iReal;</option>
                                <option value="stirng potencia = 0.0408;">stirng potencia = 0.0408;</option>
                            </select>
                        </div>
                        <div class="elet-scaffold-line">}</div>
                    </div>

                    <!-- SCAFFOLDING NÍVEL 6: Proteção do Limite Seguro do ATmega328P (20mA a 40mA) -->
                    <div id="elet_scaffold_n6" class="elet-scaffold-lines" style="display:none;">
                        <div class="elet-scaffold-line"><span class="c-cm">// 🚨 Proteção do pino do ATmega328P (limite seguro: 20mA a 40mA):</span></div>
                        <div class="elet-scaffold-line"><span class="c-tp">float</span> correnteMedida = <span class="c-num">0.055</span>; <span class="c-cm">// 55 mA (Disparou sem resistor!)</span></div>
                        <div class="elet-scaffold-line"><span class="c-tp">float</span> limiteSeguroATmega = <span class="c-num">0.025</span>; <span class="c-cm">// 25 mA tolerância segura</span></div>
                        <div class="elet-scaffold-line"><span class="c-tp">bool</span> pinoDesligado = <span class="c-cst">false</span>;</div>
                        <div class="elet-scaffold-line" style="margin-top:8px;"><span class="c-kw">void</span> <span class="c-fn">loop</span>() {</div>
                        <div class="elet-scaffold-line" style="margin-left:14px;border-left:2px solid #EF4444;padding-left:10px;">
                            <span class="c-cm">// 🎯 Objetivo 1: Teste se a corrente ultrapassou o limite seguro do microcontrolador:</span><br>
                            <span class="c-kw">if</span> (
                            <select class="elet-select-cmd" id="elet_n6_if_cond" onchange="elet_updateLiveCpp()">
                                <option value="" selected disabled>— condição de perigo elétrico —</option>
                                <option value="correnteMedida < limiteSeguroATmega">correnteMedida < limiteSeguroATmega</option>
                                <option value="correnteMedida == &quot;0.025&quot;">correnteMedida == "0.025"</option>
                                <option value="correnteMedida = limiteSeguroATmega">correnteMedida = limiteSeguroATmega</option>
                                <option value="correnteMedida > limiteSeguroATmega">correnteMedida > limiteSeguroATmega</option>
                                <option value="stirng correnteMedida > limiteSeguroATmega">stirng correnteMedida > limiteSeguroATmega</option>
                            </select>
                            ) {
                        </div>
                        <div class="elet-scaffold-line" style="margin-left:24px;border-left:2px solid #10B981;padding-left:10px;margin-top:6px;">
                            <span class="c-cm">// 🎯 Objetivo 2: Desative a porta imediatamente para salvar o pino do Arduino:</span><br>
                            <select class="elet-select-cmd" id="elet_n6_rele_cmd" onchange="elet_updateLiveCpp()">
                                <option value="" selected disabled>— comando de desligamento de emergência —</option>
                                <option value="pinoDesligado = false;">pinoDesligado = false;</option>
                                <option value="pinoDesligado = &quot;true&quot;;">pinoDesligado = "true";</option>
                                <option value="pinoDesligado == true;">pinoDesligado == true;</option>
                                <option value="pinoDesligado = true;">pinoDesligado = true;</option>
                                <option value="stirng pinoDesligado = true;">stirng pinoDesligado = true;</option>
                            </select>
                        </div>
                        <div class="elet-scaffold-line" style="margin-left:14px;">}</div>
                        <div class="elet-scaffold-line">}</div>
                    </div>

                    <!-- Botão de Ajuda / Solução -->
                    <button type="button" class="elet-btn-solution" id="elet_btn_solution" onclick="elet_toggleSolution()" disabled>
                        <i class="fa-solid fa-lightbulb"></i> <span id="elet_sol_btn_txt">💡 Precisa de Ajuda? Ver Resolução C/C++</span>
                    </button>
                    <div class="elet-solution-card" id="elet_solution_box">
                        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
                            <span style="font-weight:900;color:#FBBF24;font-size:0.85rem;"><i class="fa-solid fa-lightbulb"></i> Resolução Recomendada:</span>
                            <button type="button" onclick="elet_applyCurrentSolution()" style="background:#10B981;color:white;border:none;padding:4px 10px;border-radius:6px;font-weight:900;font-size:0.75rem;cursor:pointer;"><i class="fa-solid fa-wand-magic-sparkles"></i> Preencher no Exercício</button>
                        </div>
                        <pre id="elet_solution_text" style="margin:0;background:#030712;padding:10px;border-radius:8px;border:1px solid #F59E0B;color:#FDE68A;font-family:'Fira Code',monospace;font-size:0.8rem;white-space:pre-wrap;"></pre>
                    </div>

                    <!-- Botões de Execução -->
                    <div class="elet-actions">
                        <button type="button" class="elet-btn-run" id="elet_btn_run" onclick="elet_runSimulation()"><i class="fa-solid fa-play"></i> TESTAR CIRCUITO NO MULTÍMETRO</button>
                        <button type="button" class="elet-btn-reset" onclick="elet_resetScene()" title="Resetar bancada"><i class="fa-solid fa-rotate-left"></i></button>
                    </div>
                </div>

                <!-- PAINEL CÓDIGO ARDUINO REAL -->
                <div class="arduino-code-panel" style="background:#090D16;border:2px solid #F87171;border-radius:20px;padding:16px;box-shadow:0 10px 25px rgba(0,0,0,0.5);">
                    <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #1E293B;padding-bottom:10px;margin-bottom:12px;">
                        <span style="font-weight:900;color:#F87171;font-size:0.95rem;"><i class="fa-solid fa-microchip"></i> Código Arduino C++ (Tempo Real)</span>
                        <button type="button" onclick="elet_copyCode()" style="background:#334155;color:#F87171;border:1px solid #F87171;padding:5px 12px;border-radius:8px;font-size:0.8rem;font-weight:800;cursor:pointer;"><i class="fa-regular fa-copy"></i> Copiar C++</button>
                    </div>
                    <pre id="elet_arduino_code" style="margin:0;color:#E2E8F0;font-family:'Fira Code', monospace;font-size:0.82rem;line-height:1.45;white-space:pre-wrap;overflow-x:auto;max-height:360px;"></pre>
                </div>
            </div>

            <!-- ================= SEÇÃO FINAL DA AULA: QUIZ MAKER DE ELETRÔNICA ================= -->
            <div class="elet-quiz-card" id="elet_quiz_card">
                <div class="elet-quiz-header">
                    <div class="elet-quiz-title-area">
                        <span style="background:rgba(139,92,246,0.2);color:#DDD6FE;border:1px solid #8B5CF6;padding:3px 10px;border-radius:8px;font-size:0.75rem;font-weight:900;text-transform:uppercase;letter-spacing:0.5px;display:inline-block;margin-bottom:6px;">
                            🏆 ETAPA FINAL DA AULA • TESTE DE CONHECIMENTO
                        </span>
                        <h3><i class="fa-solid fa-graduation-cap" style="color:#A78BFA;"></i> Quiz Final: Tensão, Corrente, Ground & O Tubo de Água</h3>
                        <p>Agora que você aprendeu a teoria e montou na bancada prática, teste seu conhecimento com estas 5 perguntas rápidas!</p>
                    </div>
                    <div class="elet-quiz-stats">
                        <span class="elet-quiz-badge-counter" id="elet_quiz_counter_badge">Pergunta 1 / 5</span>
                        <span class="elet-quiz-badge-score" id="elet_quiz_score_badge">Pontos: 0 ⭐</span>
                    </div>
                </div>

                <div class="elet-quiz-progress-bar">
                    <div class="elet-quiz-progress-fill" id="elet_quiz_progress_fill"></div>
                </div>

                <!-- ÁREA ATIVA DA QUESTÃO -->
                <div id="elet_quiz_active_area">
                    <div class="elet-quiz-q-box">
                        <div class="elet-quiz-q-topic" id="elet_quiz_topic_badge">⚡ TENSÃO (VOLTAGE)</div>
                        <h4 class="elet-quiz-q-text" id="elet_quiz_q_text">Carregando pergunta...</h4>
                    </div>

                    <div class="elet-quiz-options-list" id="elet_quiz_options_container"></div>

                    <div class="elet-quiz-feedback-box" id="elet_quiz_feedback"></div>
                </div>

                <!-- TELA FINAL DE VITÓRIA DO QUIZ -->
                <div id="elet_quiz_win_area" class="elet-quiz-win-box" style="display:none;">
                    <div style="font-size:3.5rem;">🎉🏆⭐</div>
                    <h2 style="color:#DDD6FE;font-family:'Fredoka One',cursive;font-size:1.6rem;margin:8px 0;">Parabéns, Maker! Você Concluiu o Teste Final!</h2>
                    <p style="color:#CBD5E1;font-size:0.98rem;max-width:650px;margin:0 auto 16px;">
                        Você completou com sucesso o <b>Quiz de Avaliação Final</b> da Aula 6 e provou que dominou os fundamentos de Tensão, Corrente, Ground e Resistor!
                    </p>
                    <div class="elet-quiz-recap-grid">
                        <div class="elet-quiz-recap-card" style="border-left:3px solid #EF4444;">
                            <b style="color:#F87171;"><i class="fa-solid fa-gauge-high"></i> Tensão (V - Volts)</b>
                            <span style="color:#CBD5E1;font-size:0.84rem;">É a <b>pressão da água</b> empurrando os elétrons pelo circuito.</span>
                        </div>
                        <div class="elet-quiz-recap-card" style="border-left:3px solid #38BDF8;">
                            <b style="color:#38BDF8;"><i class="fa-solid fa-water"></i> Corrente (I - Amperes)</b>
                            <span style="color:#CBD5E1;font-size:0.84rem;">É a <b>vazão / fluxo</b> de água: a turma de elétrons correndo em fila.</span>
                        </div>
                        <div class="elet-quiz-recap-card" style="border-left:3px solid #34D399;">
                            <b style="color:#34D399;"><i class="fa-solid fa-plug"></i> Ground (GND - 0V)</b>
                            <span style="color:#CBD5E1;font-size:0.84rem;">É o <b>pólo negativo de retorno</b>. Se soltar, o circuito abre e tudo apaga.</span>
                        </div>
                        <div class="elet-quiz-recap-card" style="border-left:3px solid #FBBF24;">
                            <b style="color:#FBBF24;"><i class="fa-solid fa-faucet"></i> Resistor (220Ω ou 300Ω)</b>
                            <span style="color:#CBD5E1;font-size:0.84rem;">A <b>torneira reguladora</b> que protege o LED contra excesso de corrente.</span>
                        </div>
                    </div>
                    <div style="display:flex;gap:12px;justify-content:center;margin-top:18px;flex-wrap:wrap;">
                        <button type="button" onclick="elet_restartQuiz()" style="background:#8B5CF6;color:white;border:none;padding:12px 24px;border-radius:14px;font-weight:900;cursor:pointer;font-size:0.95rem;box-shadow:0 4px 15px rgba(139,92,246,0.4);display:flex;align-items:center;gap:8px;">
                            <i class="fa-solid fa-rotate-right"></i> Refazer o Quiz
                        </button>
                        <button type="button" onclick="window.scrollTo({top:0, behavior:'smooth'})" style="background:#1E293B;color:#CBD5E1;border:1px solid #334155;padding:12px 20px;border-radius:14px;font-weight:800;cursor:pointer;font-size:0.92rem;display:flex;align-items:center;gap:6px;">
                            <i class="fa-solid fa-arrow-up"></i> Voltar ao Início da Aula
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- MODAL DE VITÓRIA / PROGRESSÃO -->
        <div class="elet-modal" id="elet_win_modal">
            <div class="elet-modal-box">
                <div style="font-size:3.5rem;" id="elet_modal_icon">⚡</div>
                <h2 style="font-family:'Fredoka One',cursive;color:white;margin:10px 0;" id="elet_modal_title">Excelente Circuito!</h2>
                <div id="elet_modal_text" style="color:#CBD5E1;font-size:0.95rem;line-height:1.55;margin-bottom:16px;">Você dominou a Lei de Ohm com maestria!</div>
                <button type="button" class="elet-btn-modal" onclick="elet_closeWinModal()">Avançar para o Próximo Nível 🚀</button>
            </div>
        </div>
    `;

    elet_init();
    document.getElementById('eletronica-loaded')?.remove();
    const flag = document.createElement('div'); flag.id = 'eletronica-loaded'; flag.style.display = 'none'; container.appendChild(flag);
}

/* ==========================================================================
   ESTADO E DADOS DOS NÍVEIS DA AULA 6
   ========================================================================== */

let elet_level = 1;
let elet_guide_slide = 1;
let elet_running = false;
let elet_errors_count = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
let elet_selected_color = 'red';

const elet_color_specs = {
    red:    { name: 'Vermelho', vLed: 2.0, cssColor: '#EF4444', rgb: '239,68,68' },
    yellow: { name: 'Amarelo',  vLed: 2.0, cssColor: '#F59E0B', rgb: '245,158,11' },
    green:  { name: 'Verde',    vLed: 2.2, cssColor: '#10B981', rgb: '16,185,129' },
    blue:   { name: 'Azul',     vLed: 3.2, cssColor: '#38BDF8', rgb: '56,189,248' },
    white:  { name: 'Branco',   vLed: 3.2, cssColor: '#F8FAFC', rgb: '248,250,252' }
};

const elet_levels_data = {
    1: {
        title: 'Missão 1: O Guardião do LED Vermelho (5V e o Resistor de 220Ω)',
        badge: 'Positivo, 5V e Resistor',
        desc: 'O pino do Arduino manda <b>5.0V</b> no pólo positivo. O LED vermelho consome <b>2.0V</b> para acender.<br>Para o LED não queimar, o resistor absorve os <b>3V</b> restantes (5V - 2V = 3V). Pela Lei de Ohm, o resistor ideal é <b>220 Ω</b>!<br><br><b>🎯 Seus Objetivos de Programação:</b><ul style="margin:6px 0 6px 18px;padding:0;line-height:1.6;"><li>1️⃣ Calcule a tensão restante no resistor: <code>vResistor = vFonte - vLed;</code> (5V - 2V = 3V).</li><li>2️⃣ Calcule a resistência necessária para 15 mA: <code>rCalculado = vResistor / iDesejada;</code> (200 Ω ➔ comercial <b>220 Ω</b>)!</li></ul>',
        solution: `// Solução Nível 1 (Arduino C++):
float vFonte = 5.0; // 5V do pino digital
float vLed = 2.0;   // Queda do LED vermelho
float iDesejada = 0.015; // 15 mA

void loop() {
  float vResistor = vFonte - vLed; // 3.0V
  float rCalculado = vResistor / iDesejada; // 200.0 Ohms -> Comercial: 220 Ohms!
}`
    },
    2: {
        title: 'Missão 2: Cores de LED (Verde & Azul no Arduino)',
        badge: 'Quedas por Cor',
        desc: 'Cores diferentes precisam de pressões diferentes para acender!<br>O LED Azul consome mais energia (<b>3.2V</b>). O resistor absorve o que sobra: 5V - 3.2V = <b>1.8V</b>.<br><br><b>🎯 Seus Objetivos de Programação:</b><ul style="margin:6px 0 6px 18px;padding:0;line-height:1.6;"><li>1️⃣ Calcule a tensão que sobra para o resistor: <code>vResAzul = vFonte - vLedAzul;</code> (5V - 3.2V = 1.8V).</li><li>2️⃣ Calcule a resistência para o LED Azul: <code>rAzul = vResAzul / iOperacao;</code> (120 Ω ➔ usamos <b>150 Ω ou 220 Ω</b> na prática)!</li></ul>',
        solution: `// Solução Nível 2 (Arduino C++):
float vFonte = 5.0;
float vLedAzul = 3.2; // Queda maior no Azul/Branco
float iOperacao = 0.015;

void loop() {
  float vResAzul = vFonte - vLedAzul; // 1.8V
  float rAzul = vResAzul / iOperacao; // 120.0 Ohms -> Comercial: 150 ou 220 Ohms!
}`
    },
    3: {
        title: 'Missão 3: Montando e Programando o Pino 9 (Blink)',
        badge: 'Código Arduino C++',
        desc: 'Conectamos o <b>Pino 9</b> no resistor de 220 Ω e na perna longa (+) do LED, com a perna curta (-) no <b>GND</b>.<br><br><b>🎯 Seus Objetivos de Programação:</b><ul style="margin:6px 0 6px 18px;padding:0;line-height:1.6;"><li>1️⃣ No <code>setup()</code>, defina o pino 9 como saída de energia: <code>pinMode(pinoLed, OUTPUT);</code>.</li><li>2️⃣ No <code>loop()</code>, mande 5V com <code>HIGH</code>, espere 1s com <code>delay(1000)</code>, corte para 0V com <code>LOW</code> e espere 1s!</li></ul>',
        solution: `// Solução Nível 3 (Arduino C++):
const int pinoLed = 9;

void setup() {
  pinMode(pinoLed, OUTPUT); // Define pino 9 como saída de 5V
}

void loop() {
  digitalWrite(pinoLed, HIGH); // 5V: corrente flui pelo LED e resistor
  delay(1000);                 // Aguarda 1 segundo
  digitalWrite(pinoLed, LOW);  // 0V: LED apaga
  delay(1000);                 // Aguarda 1 segundo
}`
    },
    4: {
        title: 'Missão 4: As Faixas de Cores do Resistor de 220 Ω',
        badge: 'Código de Cores Maker',
        desc: 'Como saber se o resistor é de 220 Ohms só de olhar para ele? Pelas faixas coloridas!<br>🔴 <b>Vermelho (2)</b>, 🔴 <b>Vermelho (2)</b> e 🟤 <b>Marrom (multiplica por 10)</b> = 22 × 10 = <b>220 Ω</b>.<br><br><b>🎯 Seus Objetivos de Programação:</b><ul style="margin:6px 0 6px 18px;padding:0;line-height:1.6;"><li>1️⃣ Multiplique os dígitos pelo multiplicador: <code>(faixa1 * 10 + faixa2) * multiplicador</code>.</li><li>2️⃣ O resultado dá exatamente <b>220 Ohms</b>, o resistor mais usado do mundo!</li></ul>',
        solution: `// Solução Nível 4 (Arduino C++):
int faixa1 = 2; // Vermelho
int faixa2 = 2; // Vermelho
int multiplicador = 10; // Marrom (x10)

void loop() {
  int rOhms = (faixa1 * 10 + faixa2) * multiplicador; // 220 Ohms!
}`
    },
    5: {
        title: 'Missão 5: O Multímetro do Cientista (Fluxo Seguro)',
        badge: 'Medição em Tempo Real',
        desc: 'O multímetro mede o circuito em ação! Com 3V sobre o resistor de 220 Ω, a corrente que passa é de <b>13.6 mA</b>.<br>Um fluxo suave e seguro que deixa o circuito quentinho na medida certa sem esquentar demais!<br><br><b>🎯 Seus Objetivos de Programação:</b><ul style="margin:6px 0 6px 18px;padding:0;line-height:1.6;"><li>1️⃣ Calcule a corrente real: <code>iReal = vResistor / rComercial;</code> (13.6 mA).</li><li>2️⃣ Calcule a potência: <code>potencia = vResistor * iReal;</code> (~41 mW, totalmente seguro)!</li></ul>',
        solution: `// Solução Nível 5 (Arduino C++):
float vResistor = 3.0; // Volts sobre o resistor
float rComercial = 220.0; // Ohms

void loop() {
  float iReal = vResistor / rComercial; // 0.0136 Amperes (13.6 mA)
  float potencia = vResistor * iReal;   // ~0.041 Watts (41 mW)
}`
    },
    6: {
        title: 'Missão 6: O Guardião Anti-Queima do Arduino',
        badge: 'Sentinela de Segurança',
        desc: 'Se alguém ligar um fio errado sem resistor (0 Ω), a corrente passa de <b>25 mA</b> e coloca a placa em risco!<br>Vamos programar um comando <code>if</code> inteligente para desativar o pino na hora se houver perigo.<br><br><b>🎯 Seus Objetivos de Programação:</b><ul style="margin:6px 0 6px 18px;padding:0;line-height:1.6;"><li>1️⃣ Teste no <code>if</code> se a corrente passou do limite: <code>correnteMedida > limiteSeguroATmega</code>.</li><li>2️⃣ Em caso de sobrecorrente, desligue o pino com <code>pinoDesligado = true;</code> para salvar o Arduino!</li></ul>',
        solution: `// Solução Nível 6 (Arduino C++):
float correnteMedida = 0.055;     // 55 mA (Perigo! Sem resistor)
float limiteSeguroATmega = 0.025; // 25 mA limite seguro
bool pinoDesligado = false;

void loop() {
  if (correnteMedida > limiteSeguroATmega) {
    pinoDesligado = true; // Desliga o pino e salva o microcontrolador!
  }
}`
    }
};

let elet_water_mode = 'both'; // 'both', 'water', 'electrons'
let elet_water_voltage = 5.0; // Volts
let elet_water_resistor = 220; // Ohms
let elet_water_active_concept = 'voltage';

/* ==========================================================================
   QUIZ MAKER: O DESAFIO DO TUBO DE ÁGUA (TENSÃO, CORRENTE & GROUND)
   ========================================================================== */

const elet_quiz_data = [
    {
        id: 1,
        topic: '⚡ Tensão (Voltage)',
        topicColor: '#EF4444',
        topicBg: 'rgba(239,68,68,0.2)',
        q: 'Na analogia do cano d\'água, o que representa a TENSÃO elétrica (medida em Volts)?',
        opts: [
            'A pressão da água que empurra os elétrons para correrem pelo tubo.',
            'A largura física do tubo de PVC.',
            'A cor da mangueira usada na montagem do jardim.',
            'A sujeira que fica parada no chão.'
        ],
        correct: 0,
        explain: 'A Tensão (V) é como a pressão hidráulica (uma caixa d\'água alta ou bomba pressurizadora) que empurra os elétrons para dispararem pelo circuito!'
    },
    {
        id: 2,
        topic: '🏃 Corrente (Current)',
        topicColor: '#38BDF8',
        topicBg: 'rgba(56,189,248,0.2)',
        q: 'E o que a CORRENTE elétrica (medida em Amperes) representa no cano d\'água?',
        opts: [
            'O peso da torneira de metal da pia.',
            'O fluxo ou volume de água (elétrons) passando pelo cano por segundo.',
            'O barulho que a água faz ao bater no chão.',
            'A quantidade de ar seco dentro da mangueira vazia.'
        ],
        correct: 1,
        explain: 'A Corrente (I) é a vazão de água: a turma de elétrons correndo em fila por segundo através do condutor!'
    },
    {
        id: 3,
        topic: '🔌 Ground (GND) & Retorno',
        topicColor: '#34D399',
        topicBg: 'rgba(52,211,153,0.2)',
        q: 'No circuito do Arduino, qual é o papel fundamental do pino GND (Ground / Terra)?',
        opts: [
            'Serve apenas como apoio para a placa não cair da bancada.',
            'É onde conectamos o Arduino direto na tomada de alta voltagem de 220V.',
            'É o pólo negativo (0V) de retorno por onde os elétrons fecham o circuito elétrico.',
            'Serve para aquecer os resistores até derreter a protoboard.'
        ],
        correct: 2,
        explain: 'O GND é o pólo negativo de referência (0V). Toda a corrente precisa voltar para o GND para fechar o ciclo do circuito!'
    },
    {
        id: 4,
        topic: '🤏 Resistor 220Ω (A Torneira)',
        topicColor: '#FBBF24',
        topicBg: 'rgba(251,191,36,0.2)',
        q: 'Por que colocamos um Resistor de 220 Ω no circuito do LED ligado em 5V do Arduino?',
        opts: [
            'Ele funciona como uma torneira reguladora para frear a corrente e não estourar o LED.',
            'Ele faz o LED apagar para sempre e nunca mais acender.',
            'Ele aumenta a corrente até 1000 Amperes para o LED brilhar como o Sol.',
            'Ele transforma o LED em um motor elétrico.'
        ],
        correct: 0,
        explain: 'O resistor limita o fluxo de elétrons! Sem ele (0Ω), a pressão de 5V mandaria corrente demais e o LED queimaria na mesma hora!'
    },
    {
        id: 5,
        topic: '🔄 Circuito Fechado vs Aberto',
        topicColor: '#A78BFA',
        topicBg: 'rgba(167,139,250,0.2)',
        q: 'O que acontece com a corrente elétrica e o LED se você desconectar o fio do GND?',
        opts: [
            'O circuito fica ABERTO, a corrente para de circular imediatamente e o LED se apaga.',
            'O LED continua aceso porque a eletricidade pula pelo ar.',
            'O Arduino explode na hora com fumaça azul.',
            'A corrente dobra de velocidade e o circuito continua funcionando normalmente.'
        ],
        correct: 0,
        explain: 'Para a eletricidade correr, o circuito precisa estar FECHADO (+5V ➔ Resistor ➔ LED ➔ GND). Se o fio do GND soltar, o caminho é quebrado e tudo desliga!'
    }
];

let elet_quiz_index = 0;
let elet_quiz_score = 0;

function elet_goToQuiz() {
    const card = document.getElementById('elet_quiz_card');
    if (!card) return;
    card.scrollIntoView({ behavior: 'smooth', block: 'start' });
    playSound('click');
}

function elet_toggleQuiz() {
    elet_goToQuiz();
}

function elet_openQuizIfClosed() {
    elet_goToQuiz();
}

function elet_initQuiz() {
    elet_quiz_index = 0;
    elet_quiz_score = 0;
    elet_renderQuizQuestion();
}

function elet_renderQuizQuestion() {
    const qEl = document.getElementById('elet_quiz_q_text');
    const topicEl = document.getElementById('elet_quiz_topic_badge');
    const optsContainer = document.getElementById('elet_quiz_options_container');
    const counterEl = document.getElementById('elet_quiz_counter_badge');
    const scoreEl = document.getElementById('elet_quiz_score_badge');
    const progressFill = document.getElementById('elet_quiz_progress_fill');
    const feedbackBox = document.getElementById('elet_quiz_feedback');
    const areaEl = document.getElementById('elet_quiz_active_area');
    const winEl = document.getElementById('elet_quiz_win_area');

    if (!qEl || !optsContainer) return;

    if (elet_quiz_index >= elet_quiz_data.length) {
        if (areaEl) areaEl.style.display = 'none';
        if (winEl) winEl.style.display = 'block';
        if (counterEl) counterEl.innerText = 'Finalizado! 🎉';
        if (scoreEl) scoreEl.innerText = `Pontos: ${elet_quiz_score} / 5 ⭐`;
        if (progressFill) progressFill.style.width = '100%';
        playSound('success');
        return;
    }

    if (areaEl) areaEl.style.display = 'block';
    if (winEl) winEl.style.display = 'none';
    if (feedbackBox) {
        feedbackBox.className = 'elet-quiz-feedback-box';
        feedbackBox.innerHTML = '';
    }

    const cur = elet_quiz_data[elet_quiz_index];
    if (counterEl) counterEl.innerText = `Pergunta ${elet_quiz_index + 1} / ${elet_quiz_data.length}`;
    if (scoreEl) scoreEl.innerText = `Pontos: ${elet_quiz_score} ⭐`;
    if (progressFill) {
        const pct = ((elet_quiz_index + 1) / elet_quiz_data.length) * 100;
        progressFill.style.width = `${pct}%`;
    }

    if (topicEl) {
        topicEl.innerText = cur.topic;
        topicEl.style.color = cur.topicColor;
        topicEl.style.background = cur.topicBg;
        topicEl.style.border = `1px solid ${cur.topicColor}`;
    }

    qEl.innerText = cur.q;
    optsContainer.innerHTML = '';

    cur.opts.forEach((optText, idx) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'elet-quiz-opt-btn';
        const letter = String.fromCharCode(65 + idx);
        btn.innerHTML = `
            <span class="elet-quiz-opt-letter">${letter}</span>
            <span>${optText}</span>
        `;
        btn.onclick = () => elet_selectQuizOption(idx, btn);
        optsContainer.appendChild(btn);
    });
}

function elet_selectQuizOption(idx, clickedBtn) {
    const cur = elet_quiz_data[elet_quiz_index];
    const optsContainer = document.getElementById('elet_quiz_options_container');
    const feedbackBox = document.getElementById('elet_quiz_feedback');
    const scoreEl = document.getElementById('elet_quiz_score_badge');

    if (!optsContainer) return;
    const allBtns = optsContainer.querySelectorAll('.elet-quiz-opt-btn');
    allBtns.forEach(b => b.disabled = true);

    if (idx === cur.correct) {
        clickedBtn.classList.add('correct');
        elet_quiz_score++;
        if (scoreEl) scoreEl.innerText = `Pontos: ${elet_quiz_score} ⭐`;
        playSound('success');

        if (feedbackBox) {
            feedbackBox.className = 'elet-quiz-feedback-box success show';
            feedbackBox.innerHTML = `
                <span style="font-size:1.4rem;">🤖</span>
                <div>
                    <b style="color:#10B981;">Mandou Muito Bem!</b><br>
                    <span>${cur.explain}</span>
                </div>
            `;
        }

        setTimeout(() => {
            elet_quiz_index++;
            elet_renderQuizQuestion();
        }, 2200);
    } else {
        clickedBtn.classList.add('wrong');
        playSound('error');

        if (feedbackBox) {
            feedbackBox.className = 'elet-quiz-feedback-box error show';
            feedbackBox.innerHTML = `
                <span style="font-size:1.4rem;">🤖</span>
                <div>
                    <b style="color:#EF4444;">Ops, quase lá! Tente novamente:</b><br>
                    <span>Lembre-se da analogia: Tensão é a pressão que empurra, Corrente é o fluxo de elétrons e o GND é o pólo de retorno (0V)!</span>
                </div>
            `;
        }

        setTimeout(() => {
            allBtns.forEach(b => {
                b.disabled = false;
                b.classList.remove('wrong');
            });
            if (feedbackBox) feedbackBox.className = 'elet-quiz-feedback-box';
        }, 2200);
    }
}

function elet_restartQuiz() {
    elet_quiz_index = 0;
    elet_quiz_score = 0;
    playSound('click');
    elet_renderQuizQuestion();
}

/* ==========================================================================
   CALCULADORA DE CORES DO RESISTOR (4 FAIXAS)
   ========================================================================== */

const ELET_RES_COLORS = [
    { value: 0, name: 'Preto', hex: '#0F172A', textHex: '#94A3B8', border: '#475569' },
    { value: 1, name: 'Marrom', hex: '#78350F', textHex: '#D97706' },
    { value: 2, name: 'Vermelho', hex: '#EF4444', textHex: '#FCA5A5' },
    { value: 3, name: 'Laranja', hex: '#F97316', textHex: '#FDBA74' },
    { value: 4, name: 'Amarelo', hex: '#FBBF24', textHex: '#FEF08A' },
    { value: 5, name: 'Verde', hex: '#10B981', textHex: '#A7F3D0' },
    { value: 6, name: 'Azul', hex: '#3B82F6', textHex: '#BFDBFE' },
    { value: 7, name: 'Violeta', hex: '#8B5CF6', textHex: '#DDD6FE' },
    { value: 8, name: 'Cinza', hex: '#64748B', textHex: '#CBD5E1' },
    { value: 9, name: 'Branco', hex: '#F8FAFC', textHex: '#FFFFFF' }
];

const ELET_RES_MULTIPLIERS = [
    { value: 0, exp: 0, mult: 1, name: 'Preto', label: '×1 (sem zeros)', hex: '#0F172A', border: '#475569' },
    { value: 1, exp: 1, mult: 10, name: 'Marrom', label: '×10 (+1 zero)', hex: '#78350F' },
    { value: 2, exp: 2, mult: 100, name: 'Vermelho', label: '×100 (+2 zeros)', hex: '#EF4444' },
    { value: 3, exp: 3, mult: 1000, name: 'Laranja', label: '×1.000 / 1k (+3 zeros)', hex: '#F97316' },
    { value: 4, exp: 4, mult: 10000, name: 'Amarelo', label: '×10k (+4 zeros)', hex: '#FBBF24' },
    { value: 5, exp: 5, mult: 100000, name: 'Verde', label: '×100k (+5 zeros)', hex: '#10B981' },
    { value: 6, exp: 6, mult: 1000000, name: 'Azul', label: '×1M (+6 zeros)', hex: '#3B82F6' },
    { value: -1, exp: -1, mult: 0.1, name: 'Dourado', label: '×0.1 (÷10)', hex: '#F59E0B' },
    { value: -2, exp: -2, mult: 0.01, name: 'Prateado', label: '×0.01 (÷100)', hex: '#94A3B8' }
];

const ELET_RES_TOLERANCES = [
    { value: 'gold', name: 'Dourado', label: '±5% (Padrão Maker)', pct: 5, hex: '#F59E0B' },
    { value: 'silver', name: 'Prateado', label: '±10%', pct: 10, hex: '#94A3B8' },
    { value: 'brown', name: 'Marrom', label: '±1% (Alta Precisão)', pct: 1, hex: '#78350F' },
    { value: 'red', name: 'Vermelho', label: '±2%', pct: 2, hex: '#EF4444' }
];

let elet_calc_current_ohms = 300;

function elet_goToResistorCalc() {
    const card = document.getElementById('elet_resistor_calculator');
    if (!card) return;
    card.scrollIntoView({ behavior: 'smooth', block: 'center' });
    card.classList.add('elet-highlight-pulse');
    setTimeout(() => {
        card.classList.remove('elet-highlight-pulse');
    }, 1200);
    playSound('click');
}

function elet_initResistorCalculator() {
    elet_renderBandSwatches(1, ELET_RES_COLORS.filter(c => c.value >= 1));
    elet_renderBandSwatches(2, ELET_RES_COLORS);
    elet_renderBandSwatches(3, ELET_RES_MULTIPLIERS);
    elet_renderBandSwatches(4, ELET_RES_TOLERANCES);

    // Inicializa no resistor de 300 Ohms solicitado pelo usuário!
    elet_calcSetPreset(3, 0, 1, 'gold', false);
}

function elet_renderBandSwatches(bandNum, list) {
    const container = document.getElementById(`elet_swatches_${bandNum}`);
    if (!container) return;
    container.innerHTML = '';

    list.forEach(item => {
        const dot = document.createElement('div');
        dot.className = 'elet-swatch-dot';
        dot.style.background = item.hex;
        if (item.border) dot.style.borderColor = item.border;
        dot.title = `${item.name} (${item.label || item.value})`;
        dot.dataset.val = item.value;
        dot.onclick = () => {
            const sel = document.getElementById(`elet_sel_band_${bandNum}`);
            if (sel) {
                sel.value = item.value;
                elet_onCalcBandChange();
                playSound('click');
            }
        };
        container.appendChild(dot);
    });
}

function elet_calcSetPreset(d1, d2, multVal, tolVal, playSnd = true) {
    const s1 = document.getElementById('elet_sel_band_1');
    const s2 = document.getElementById('elet_sel_band_2');
    const s3 = document.getElementById('elet_sel_band_3');
    const s4 = document.getElementById('elet_sel_band_4');

    if (s1) s1.value = d1;
    if (s2) s2.value = d2;
    if (s3) s3.value = multVal;
    if (s4) s4.value = tolVal;

    elet_onCalcBandChange();
    if (playSnd) playSound('click');
}

function elet_onCalcBandChange() {
    const s1 = document.getElementById('elet_sel_band_1');
    const s2 = document.getElementById('elet_sel_band_2');
    const s3 = document.getElementById('elet_sel_band_3');
    const s4 = document.getElementById('elet_sel_band_4');

    if (!s1 || !s2 || !s3 || !s4) return;

    const val1 = parseInt(s1.value, 10);
    const val2 = parseInt(s2.value, 10);
    const val3 = parseInt(s3.value, 10);
    const val4 = s4.value;

    const color1 = ELET_RES_COLORS.find(c => c.value === val1) || ELET_RES_COLORS[3];
    const color2 = ELET_RES_COLORS.find(c => c.value === val2) || ELET_RES_COLORS[0];
    const multObj = ELET_RES_MULTIPLIERS.find(m => m.value === val3) || ELET_RES_MULTIPLIERS[1];
    const tolObj = ELET_RES_TOLERANCES.find(t => t.value === val4) || ELET_RES_TOLERANCES[0];

    // Atualiza swatches ativos
    [1, 2, 3, 4].forEach(bNum => {
        const val = (bNum === 1) ? val1 : (bNum === 2) ? val2 : (bNum === 3) ? val3 : val4;
        const swContainer = document.getElementById(`elet_swatches_${bNum}`);
        if (swContainer) {
            swContainer.querySelectorAll('.elet-swatch-dot').forEach(dot => {
                dot.classList.toggle('active', dot.dataset.val == val);
            });
        }
    });

    // Cálculo da Resistência
    const baseNum = val1 * 10 + val2;
    const ohms = Math.round((baseNum * multObj.mult) * 100) / 100;
    elet_calc_current_ohms = ohms;

    // Atualização visual das 4 faixas no corpo do resistor
    const b1 = document.getElementById('elet_rband_1');
    const b2 = document.getElementById('elet_rband_2');
    const b3 = document.getElementById('elet_rband_3');
    const b4 = document.getElementById('elet_rband_4');

    if (b1) {
        b1.style.background = color1.hex;
        const l1 = document.getElementById('elet_rband_lbl_1');
        if (l1) l1.innerText = `${val1} (${color1.name})`;
    }
    if (b2) {
        b2.style.background = color2.hex;
        const l2 = document.getElementById('elet_rband_lbl_2');
        if (l2) l2.innerText = `${val2} (${color2.name})`;
    }
    if (b3) {
        b3.style.background = multObj.hex;
        const l3 = document.getElementById('elet_rband_lbl_3');
        if (l3) l3.innerText = multObj.mult >= 1 ? `×${multObj.mult}` : `×${multObj.mult}`;
    }
    if (b4) {
        b4.style.background = tolObj.hex;
        const l4 = document.getElementById('elet_rband_lbl_4');
        if (l4) l4.innerText = `±${tolObj.pct}%`;
    }

    // Formatação do valor em texto (ex: 300 Ω, 1.2 kΩ, 1 MΩ)
    let formattedText = '';
    if (ohms >= 1000000) {
        formattedText = `${(ohms / 1000000).toLocaleString('pt-BR', { maximumFractionDigits: 2 })} MΩ`;
    } else if (ohms >= 1000) {
        formattedText = `${(ohms / 1000).toLocaleString('pt-BR', { maximumFractionDigits: 2 })} kΩ (${ohms.toLocaleString('pt-BR')} Ω)`;
    } else {
        formattedText = `${ohms.toLocaleString('pt-BR')} Ω`;
    }

    const valEl = document.getElementById('elet_calc_val_formatted');
    if (valEl) {
        valEl.innerHTML = `${formattedText} <span style="font-size:1.05rem;color:${tolObj.hex};font-weight:800;">±${tolObj.pct}%</span>`;
    }

    // Passo a Passo Didático para 12 Anos
    const stepEl = document.getElementById('elet_calc_step_formula');
    if (stepEl) {
        stepEl.innerHTML = `
            <div style="font-weight:900;color:#FDE68A;margin-bottom:4px;display:flex;align-items:center;gap:6px;">
                <i class="fa-solid fa-key"></i> Segredo das Cores Passo a Passo:
            </div>
            <div>
                1. <b>1ª faixa (${color1.name}):</b> Dígito <b>${val1}</b><br>
                2. <b>2ª faixa (${color2.name}):</b> Dígito <b>${val2}</b> ➔ Juntando forma o número <b>${baseNum}</b><br>
                3. <b>3ª faixa (${multObj.name}):</b> Multiplica por <b>${multObj.mult}</b> ${multObj.exp > 0 ? `(adicione ${multObj.exp} zero${multObj.exp > 1 ? 's' : ''})` : ''} ➔ <b>${baseNum} × ${multObj.mult} = ${formattedText}</b>!<br>
                4. <b>4ª faixa (${tolObj.name}):</b> Tolerância de <b>±${tolObj.pct}%</b> (${Math.round(ohms * (1 - tolObj.pct / 100))} Ω até ${Math.round(ohms * (1 + tolObj.pct / 100))} Ω).
            </div>
        `;
    }

    // Veredito Maker para Arduino (5V com LED)
    const verdEl = document.getElementById('elet_calc_arduino_verdict');
    if (verdEl) {
        if (ohms === 300) {
            verdEl.style.background = 'rgba(249,115,22,0.15)';
            verdEl.style.border = '2px solid #F97316';
            verdEl.style.color = '#FDBA74';
            verdEl.innerHTML = `
                <div style="font-size:2rem;">🟠</div>
                <div>
                    <b>Este é o seu resistor de 300 Ω!</b><br>
                    <span style="font-size:0.82rem;font-weight:normal;">No Arduino em 5V com um LED (queda de ~2V), sobram 3V. A corrente será de <b>10 mA</b> (3V ÷ 300Ω). O LED brilha lindo e fica <b>100% protegido</b> contra queima!</span>
                </div>
            `;
        } else if (ohms >= 200 && ohms <= 470) {
            verdEl.style.background = 'rgba(16,185,129,0.15)';
            verdEl.style.border = '2px solid #10B981';
            verdEl.style.color = '#6EE7B7';
            verdEl.innerHTML = `
                <div style="font-size:2rem;">🛡️</div>
                <div>
                    <b>Faixa Ideal para LED no Arduino (5V)!</b><br>
                    <span style="font-size:0.82rem;font-weight:normal;">Corrente entre 8 mA e 15 mA. Proporciona brilho forte e protege perfeitamente o LED e as portas digitais do microcontrolador.</span>
                </div>
            `;
        } else if (ohms < 150) {
            verdEl.style.background = 'rgba(239,68,68,0.2)';
            verdEl.style.border = '2px solid #EF4444';
            verdEl.style.color = '#FCA5A5';
            verdEl.innerHTML = `
                <div style="font-size:2rem;">💥</div>
                <div>
                    <b>Alerta de Perigo! Resistência Muito Baixa:</b><br>
                    <span style="font-size:0.82rem;font-weight:normal;">A corrente ultrapassará 20 mA em 5V, aquecendo e podendo queimar o LED ou danificar a porta do Arduino. Sempre use resistores &ge; 220 &Omega; para LEDs!</span>
                </div>
            `;
        } else if (ohms >= 1000 && ohms <= 20000) {
            verdEl.style.background = 'rgba(56,189,248,0.15)';
            verdEl.style.border = '2px solid #38BDF8';
            verdEl.style.color = '#BAE6FD';
            verdEl.innerHTML = `
                <div style="font-size:2rem;">💡</div>
                <div>
                    <b>Valor Ideal para Sensores e Botões (Pull-down/Pull-up):</b><br>
                    <span style="font-size:0.82rem;font-weight:normal;">Resistores de 1 kΩ a 10 kΩ são excelentes para leituras digitais estáveis e divisores com LDR. Em um LED, a luz ficará bem fraca.</span>
                </div>
            `;
        } else {
            verdEl.style.background = 'rgba(148,163,184,0.12)';
            verdEl.style.border = '1px solid #475569';
            verdEl.style.color = '#E2E8F0';
            verdEl.innerHTML = `
                <div style="font-size:2rem;">🔬</div>
                <div>
                    <b>Valor Específico de Eletrônica:</b><br>
                    <span style="font-size:0.82rem;font-weight:normal;">Excelente para circuitos temporizadores (ex: 555), filtros de áudio ou amplificadores operacionais.</span>
                </div>
            `;
        }
    }

    // Sincroniza também o Mini Decodificador na Bancada
    const miniName = document.getElementById('elet_band_val_name');
    if (miniName) miniName.innerText = `${formattedText} ±${tolObj.pct}%`;
    const mb1 = document.getElementById('elet_b1');
    const mb2 = document.getElementById('elet_b2');
    const mb3 = document.getElementById('elet_b3');
    const mb4 = document.getElementById('elet_b4');
    if (mb1) mb1.style.background = color1.hex;
    if (mb2) mb2.style.background = color2.hex;
    if (mb3) mb3.style.background = multObj.hex;
    if (mb4) mb4.style.background = tolObj.hex;
}

function elet_applyCalcToBench() {
    const sliderR = document.getElementById('elet_slider_r');
    if (!sliderR) return;

    let targetR = elet_calc_current_ohms;
    if (targetR < 50) targetR = 50;
    if (targetR > 1000) targetR = 1000;

    sliderR.value = Math.round(targetR / 10) * 10;
    elet_onSliderChange();

    const benchEl = document.getElementById('elet_pipe_chamber_box') || sliderR;
    benchEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    playSound('success');
}

function elet_init() {
    elet_updateLevelButtons();
    elet_switchLevel(1);
    elet_resetScene();
    elet_updateLiveCpp();
    elet_updateWaterTutorialVisuals();
    elet_initQuiz();
    elet_initResistorCalculator();

    // Garante que qualquer clique em #eletronica-container .tension-element abra as dicas do robô
    document.querySelectorAll('#eletronica-container .tension-element').forEach(el => {
        el.addEventListener('click', () => {
            elet_showRobotTip('voltage');
        });
    });
    document.querySelectorAll('#eletronica-container .resistance-element').forEach(el => {
        el.addEventListener('click', () => {
            elet_showRobotTip('resistance');
        });
    });
    document.querySelectorAll('#eletronica-container .current-element').forEach(el => {
        el.addEventListener('click', () => {
            elet_showRobotTip('current');
        });
    });
}

/* ==========================================================================
   TUTORIAL LÚDICO: TUBO DE ÁGUA & ANALOGIA DA LEI DE OHM
   ========================================================================== */

function elet_toggleWaterTutorial() {
    const card = document.getElementById('elet_water_tutorial_card');
    const txt = document.getElementById('elet_water_toggle_txt');
    if (!card) return;
    const isHidden = card.style.display === 'none';
    card.style.display = isHidden ? 'block' : 'none';
    if (txt) txt.innerText = isHidden ? '💧 Ocultar Tutorial Lúdico' : '💧 Mostrar Tutorial Lúdico';
    playSound('click');
}

function elet_setWaterMode(mode) {
    elet_water_mode = mode;
    ['both', 'water', 'elec'].forEach(m => {
        const btn = document.getElementById(`elet_stab_${m}`);
        if (btn) btn.classList.toggle('active', (m === 'both' && mode === 'both') || (m === 'water' && mode === 'water') || (m === 'elec' && mode === 'electrons'));
    });

    const wBox = document.getElementById('elet_view_water_box');
    const eBox = document.getElementById('elet_view_elec_box');

    if (wBox) wBox.style.display = (mode === 'both' || mode === 'water') ? 'block' : 'none';
    if (eBox) eBox.style.display = (mode === 'both' || mode === 'electrons') ? 'block' : 'none';

    playSound('click');
}

function elet_setWaterVoltagePreset(v) {
    elet_water_voltage = v;
    const slider = document.getElementById('elet_w_slider_v');
    if (slider) slider.value = v;

    [3, 5, 9].forEach(p => {
        const btn = document.getElementById(`elet_pbtn_v${p}`);
        if (btn) btn.classList.toggle('active', p === Math.round(v));
    });

    elet_updateWaterTutorialVisuals();
    playSound('click');
}

function elet_setWaterResistorPreset(r) {
    elet_water_resistor = r;
    const slider = document.getElementById('elet_w_slider_r');
    if (slider) slider.value = r;

    [0, 220, 1000].forEach(p => {
        const btn = document.getElementById(`elet_pbtn_r${p}`);
        if (btn) btn.classList.toggle('active', p === r);
    });

    elet_updateWaterTutorialVisuals();
    if (r === 0) playSound('error');
    else playSound('click');
}

function elet_onWaterSliderChange() {
    const vSlider = document.getElementById('elet_w_slider_v');
    const rSlider = document.getElementById('elet_w_slider_r');
    if (!vSlider || !rSlider) return;

    elet_water_voltage = parseFloat(vSlider.value);
    elet_water_resistor = parseInt(rSlider.value, 10);

    [3, 5, 9].forEach(p => {
        const btn = document.getElementById(`elet_pbtn_v${p}`);
        if (btn) btn.classList.toggle('active', p === Math.round(elet_water_voltage));
    });

    [0, 220, 1000].forEach(p => {
        const btn = document.getElementById(`elet_pbtn_r${p}`);
        if (btn) btn.classList.toggle('active', p === elet_water_resistor);
    });

    elet_updateWaterTutorialVisuals();
}

const elet_robot_tips_data = {
    voltage: {
        topicKey: 'voltage',
        title: '⚡ TENSÃO (V): A Pressão da Água no Sistema Hidráulico & O Corre-Corre dos Elétrons!',
        formula: 'V = R · I (Pressão Hidráulica / Tensão em Volts)',
        text: 'Em um <b>sistema hidráulico</b>, a <b>Tensão (V em Volts)</b> funciona exatamente como a <b>pressão da água</b>: pense em uma caixa d\'água bem alta ou uma bomba pressurizando os canos! Quanto mais alta a caixa d\'água, maior é a pressão que empurra a água para descer pela tubulação. No circuito elétrico (como nos 5V do Arduino), essa pressão é o que dá a largada com toda a força na grande <b>brincadeira de corre-corre dos elétrons</b>, empurrando a turminha de elétrons para disparar pelos fios condutores!',
        summary: 'Tensão (V) = Pressão da água em um sistema hidráulico empurrando os elétrons no corre-corre!'
    },
    resistance: {
        topicKey: 'resistance',
        title: '🤏 RESISTÊNCIA (R): O Estreitamento do Cano & Portão da Escola!',
        formula: 'R = V ÷ I (Estreitamento do Cano em Ohms Ω)',
        text: 'No sistema hidráulico, a <b>Resistência (R em Ohms)</b> é como um <b>estreitamento no cano</b> ou um aperto na mangueira! Na brincadeira de corre-corre dos elétrons, imagine que toda a turminha está correndo a mil por hora, mas no meio da pista há um <b>portãozinho estreito</b> onde só passa um por vez! O resistor de <b>220Ω</b> organiza a fila para que os elétrons não se choquem e atravessem com calma e segurança, protegendo o LED e a porta do microcontrolador Arduino!',
        summary: 'Resistência (R) = Estreitamento do cano (portão estreito) regulando o fluxo de elétrons!'
    },
    current: {
        topicKey: 'current',
        title: '🏃 CORRENTE (I): A Vazão de Água & A Turminha Correndo!',
        formula: 'I = V ÷ R (Vazão do Fluxo / Corrente em mA)',
        text: 'A <b>Corrente (I em Amperes ou mA)</b> é a <b>vazão da água</b>: quantos litros de água (ou quantos elétrons fofinhos) conseguem cruzar a linha de chegada por segundo! Com o empurrão certo (Tensão de 5V) e o estreitamento adequado (Resistor de 220Ω), passam exatamente <b>13 a 15 mA</b> de elétrons na brincadeira de corre-corre, entregando energia perfeita para acender o LED sem queimar nada!',
        summary: 'Corrente (I) = Vazão da água / velocidade e quantidade de elétrons correndo por segundo!'
    },
    danger: {
        topicKey: 'danger',
        title: '💥 SEM RESISTOR (0Ω): O Grande Tropeço em Avalanche!',
        formula: 'I = 5V ÷ 0Ω ➔ Corrente Dispara (>50mA)!',
        text: 'E o que acontece se tirarmos o resistor do circuito (0Ω)? O portão estreito simplesmente some! A fila inteira de elétrons sai em avalanche desenfreada, um passando por cima do outro a mais de <b>50 mA</b>! Ao chegarem no LED sem nenhum freio, eles se chocam com violência extrema e o LED faz <b>PUFF 💨</b> e queima! Além disso, o chip <b>ATmega328P</b> do Arduino só suporta 20 a 40 mA por pino. Sem resistor, o microcontrolador também entra em perigo!',
        summary: 'Sem Resistor = Avalanche descontrolada de elétrons que QUEIMA o LED!'
    }
};

function elet_explainConcept(concept) {
    elet_showRobotTip(concept);
}

function elet_showRobotTip(topic, targetElemId) {
    const tip = elet_robot_tips_data[topic] || elet_robot_tips_data.voltage;
    elet_water_active_concept = topic;

    // Atualiza botões de tópico do painel
    ['voltage', 'resistance', 'current', 'danger'].forEach(t => {
        const btn = document.getElementById(`elet_rtab_${t}`);
        if (btn) btn.classList.toggle('active', t === topic);
    });

    // Atualiza elementos de texto do balão
    const titleEl = document.getElementById('elet_bubble_title');
    const formulaEl = document.getElementById('elet_bubble_formula');
    const textEl = document.getElementById('elet_bubble_text');
    const summaryEl = document.getElementById('elet_bubble_summary');
    const bubbleEl = document.getElementById('elet_speech_bubble');

    if (titleEl) titleEl.innerHTML = tip.title;
    if (formulaEl) formulaEl.innerText = tip.formula;
    if (textEl) textEl.innerHTML = tip.text;
    if (summaryEl) summaryEl.innerHTML = `<i class="fa-solid fa-lightbulb"></i> <b>Resumo Maker:</b> ${tip.summary}`;

    if (bubbleEl) {
        bubbleEl.classList.remove('elet-highlight-pulse');
        void bubbleEl.offsetWidth;
        bubbleEl.classList.add('elet-highlight-pulse');
    }

    // Se houver elemento clicado alvo, ativa animação de pulso
    if (targetElemId) {
        const el = document.getElementById(targetElemId);
        if (el) {
            el.classList.remove('elet-highlight-pulse');
            void el.offsetWidth;
            el.classList.add('elet-highlight-pulse');
        }
    }

    // Sincroniza com os pilares do tutorial de água
    if (topic === 'voltage' || topic === 'resistance' || topic === 'current') {
        const cardVolt = document.getElementById('elet_card_volt');
        const cardRes = document.getElementById('elet_card_res');
        const cardCurr = document.getElementById('elet_card_curr');
        if (cardVolt) cardVolt.classList.toggle('active', topic === 'voltage');
        if (cardRes) cardRes.classList.toggle('active', topic === 'resistance');
        if (cardCurr) cardCurr.classList.toggle('active', topic === 'current');

        const robotMsg = document.getElementById('elet_w_robot_msg');
        if (robotMsg) {
            robotMsg.innerHTML = `<b>Robô Maker explica a ${tip.title}:</b> "${tip.text}"`;
        }
    }

    playSound('click');
}

function elet_playRobotBeep() {
    playSound('step');
    const robotAvatar = document.querySelector('.elet-robot-avatar-big');
    if (robotAvatar) {
        robotAvatar.style.transform = 'scale(1.25) rotate(12deg)';
        setTimeout(() => {
            if (robotAvatar) robotAvatar.style.transform = '';
        }, 220);
    }
}

function elet_updateWaterTutorialVisuals() {
    const v = elet_water_voltage;
    const r = elet_water_resistor;

    // Cálculo da Corrente
    let i_mA = 0;
    let vRes = Math.max(0, v - 2.0); // considerando LED vermelho com queda de 2.0V
    if (r === 0) {
        i_mA = Math.min(95.0, v * 18.0); // Disparada sem resistor
    } else {
        i_mA = (vRes / r) * 1000.0;
    }

    // Atualiza badges e labels numéricos
    const lblV = document.getElementById('elet_lbl_w_v');
    const lblTank = document.getElementById('elet_w_tank_lbl');
    const lblR = document.getElementById('elet_lbl_w_r');
    const lblValve = document.getElementById('elet_w_valve_lbl');
    const lblRes = document.getElementById('elet_e_res_lbl');
    const lblI = document.getElementById('elet_lbl_w_i');
    const flowTxt = document.getElementById('elet_w_flow_txt');
    const eFlowTxt = document.getElementById('elet_e_flow_txt');
    const pinLbl = document.getElementById('elet_e_pin_lbl');

    if (lblV) lblV.innerText = `${v.toFixed(1)} V`;
    if (lblTank) lblTank.innerText = `${v.toFixed(1)} V`;
    if (pinLbl) pinLbl.innerText = `Pino 9 (${v.toFixed(1)}V)`;
    if (lblR) lblR.innerText = `${r} Ω`;
    if (lblValve) lblValve.innerText = `${r} Ω`;
    if (lblRes) lblRes.innerText = `${r} Ω`;
    if (lblI) lblI.innerText = `${i_mA.toFixed(1)} mA`;
    if (flowTxt) flowTxt.innerText = `Vazão: ${i_mA.toFixed(1)} gotas/s`;
    if (eFlowTxt) eFlowTxt.innerText = `Corrente: ${i_mA.toFixed(1)} mA`;

    // Altura da água no tanque
    const tankFill = document.getElementById('elet_w_tank_fill');
    if (tankFill) {
        const heightPct = Math.min(95, Math.max(15, (v / 12) * 90));
        tankFill.style.height = `${heightPct}%`;
    }

    // Estreitamento das válvulas
    const valve = document.getElementById('elet_w_valve');
    const resValve = document.getElementById('elet_e_res_valve');
    const valveHeight = r === 0 ? 15 : Math.min(95, Math.max(25, 20 + (r / 12)));
    if (valve) valve.style.height = `${valveHeight}%`;
    if (resValve) resValve.style.height = `${valveHeight}%`;

    // Turbina / Roda d'água
    const turbine = document.getElementById('elet_w_turbine');
    if (turbine) {
        if (i_mA < 0.5) {
            turbine.style.animation = 'none';
        } else {
            const rotDuration = Math.max(0.15, Math.min(3.5, 30.0 / Math.max(1, i_mA)));
            turbine.style.animation = `spinTurbine ${rotDuration.toFixed(2)}s linear infinite`;
        }
    }

    // Diagnóstico e Status Lúdico
    const statusBadge = document.getElementById('elet_w_status_badge');
    const statusTip = document.getElementById('elet_w_status_tip');
    const ledBulb = document.getElementById('elet_w_led_bulb');
    const smokeBox = document.getElementById('elet_w_smoke_box');
    const robotMsg = document.getElementById('elet_w_robot_msg');

    if (r === 0 || i_mA > 35.0) {
        if (statusBadge) {
            statusBadge.innerText = '💥 PERIGO! SOBRECORRENTE (>40mA)';
            statusBadge.style.color = '#EF4444';
        }
        if (statusTip) {
            statusTip.innerText = 'Sem resistor limitador, a corrente dispara e queima o LED ou a porta do microcontrolador!';
        }
        if (ledBulb) {
            ledBulb.className = 'elet-led-bulb burned';
            ledBulb.style.background = '#1E293B';
            ledBulb.style.boxShadow = 'none';
            ledBulb.innerHTML = '<i class="fa-solid fa-fire" style="color:#EF4444;"></i>';
        }
        if (smokeBox && smokeBox.children.length === 0) {
            smokeBox.innerHTML = '<div class="elet-smoke-puff">💨</div>';
        }
        if (robotMsg && elet_water_active_concept === 'voltage') {
            robotMsg.innerHTML = `<b>Robô Maker alerta:</b> "🚨 CUIDADO! Sem resistor (0Ω) ou com tensão alta, a corrente disparou para <b>${i_mA.toFixed(1)} mA</b>! O LED queimou! É exatamente por isso que usamos um resistor de 220Ω no Arduino!"`;
        }
    } else if (i_mA < 3.0 || v <= 2.0) {
        if (statusBadge) {
            statusBadge.innerText = '💧 Gotejando Fraco (<3mA)';
            statusBadge.style.color = '#38BDF8';
        }
        if (statusTip) {
            statusTip.innerText = 'Pressão muito baixa ou cano excessivamente apertado. O LED não acende.';
        }
        if (ledBulb) {
            ledBulb.className = 'elet-led-bulb';
            ledBulb.style.background = '#334155';
            ledBulb.style.boxShadow = 'none';
            ledBulb.innerHTML = '<i class="fa-regular fa-lightbulb" style="color:#94A3B8;"></i>';
        }
        if (smokeBox) smokeBox.innerHTML = '';
    } else {
        if (statusBadge) {
            statusBadge.innerText = '✅ Fluxo Seguro & Ideal (10-20mA)';
            statusBadge.style.color = '#34D399';
        }
        if (statusTip) {
            statusTip.innerText = 'Equilíbrio perfeito da Lei de Ohm! Brilho vivo e duradouro no pino do Arduino.';
        }
        if (ledBulb) {
            ledBulb.className = 'elet-led-bulb lit-safe';
            ledBulb.style.background = '#EF4444';
            ledBulb.style.boxShadow = '0 0 20px #EF4444, 0 0 40px rgba(239,68,68,0.5)';
            ledBulb.innerHTML = '<i class="fa-solid fa-lightbulb" style="color:white;"></i>';
        }
        if (smokeBox) smokeBox.innerHTML = '';
    }

    elet_renderWaterParticles(i_mA);
    elet_renderElectronFlowParticles(i_mA);
}

function elet_renderWaterParticles(i_mA) {
    const stream = document.getElementById('elet_w_drops_stream');
    if (!stream) return;
    stream.innerHTML = '';

    const count = Math.max(3, Math.min(22, Math.round(i_mA * 0.7)));
    const duration = Math.max(0.35, Math.min(3.5, 30.0 / Math.max(1, i_mA)));

    for (let i = 0; i < count; i++) {
        const drop = document.createElement('div');
        drop.className = 'elet-water-drop-particle';
        drop.style.animationDuration = `${duration.toFixed(2)}s`;
        drop.style.animationDelay = `${(i * (duration / count)).toFixed(2)}s`;
        drop.style.top = `${25 + (i % 3) * 20}%`;
        stream.appendChild(drop);
    }
}

function elet_renderElectronFlowParticles(i_mA) {
    const stream = document.getElementById('elet_e_electron_stream');
    if (!stream) return;
    stream.innerHTML = '';

    const count = Math.max(4, Math.min(26, Math.round(i_mA * 0.8)));
    const duration = Math.max(0.3, Math.min(3.2, 28.0 / Math.max(1, i_mA)));

    for (let i = 0; i < count; i++) {
        const dot = document.createElement('div');
        dot.className = 'elet-electron';
        dot.innerText = 'e-';
        dot.style.fontSize = '0.52rem';
        dot.style.fontWeight = '900';
        dot.style.color = '#020617';
        dot.style.display = 'flex';
        dot.style.alignItems = 'center';
        dot.style.justifyContent = 'center';
        dot.style.animationDuration = `${duration.toFixed(2)}s`;
        dot.style.animationDelay = `${(i * (duration / count)).toFixed(2)}s`;
        dot.style.top = `${25 + (i % 3) * 18}%`;

        if (i_mA > 35.0) {
            dot.style.background = '#EF4444';
            dot.style.boxShadow = '0 0 10px #EF4444';
        } else {
            dot.style.background = '#38BDF8';
            dot.style.boxShadow = '0 0 10px #38BDF8';
        }

        stream.appendChild(dot);
    }
}

/* ================= GUIA TEÓRICO / SLIDES ================= */

function elet_toggleGuide() {
    const card = document.getElementById('elet_guide_card');
    const txt = document.getElementById('elet_guide_toggle_txt');
    if (!card) return;
    const isHidden = card.style.display === 'none';
    card.style.display = isHidden ? 'block' : 'none';
    if (txt) txt.innerText = isHidden ? 'Ocultar Guia Teórico' : 'Mostrar Guia Teórico';
    playSound('click');
}

function elet_openGuideIfClosed() {
    const card = document.getElementById('elet_guide_card');
    const txt = document.getElementById('elet_guide_toggle_txt');
    if (card && card.style.display === 'none') {
        card.style.display = 'block';
        if (txt) txt.innerText = 'Ocultar Guia Teórico';
    }
}

function elet_switchGuideTab(slideNum) {
    elet_guide_slide = slideNum;
    for (let i = 1; i <= 6; i++) {
        document.getElementById(`elet_slide_${i}`)?.classList.toggle('active', i === slideNum);
        document.getElementById(`elet_tab_g${i}`)?.classList.toggle('active', i === slideNum);
        document.getElementById(`elet_dot_${i}`)?.classList.toggle('active', i === slideNum);
    }
    playSound('click');
}

function elet_nextGuideSlide() {
    if (elet_guide_slide < 6) elet_switchGuideTab(elet_guide_slide + 1);
    else elet_switchGuideTab(1);
}

function elet_prevGuideSlide() {
    if (elet_guide_slide > 1) elet_switchGuideTab(elet_guide_slide - 1);
    else elet_switchGuideTab(6);
}

/* ================= SELETOR DE COR DO LED NA BANCADA ================= */

function elet_setLedColor(colorKey) {
    if (!elet_color_specs[colorKey]) return;
    elet_selected_color = colorKey;

    ['red','yellow','green','blue','white'].forEach(c => {
        const btn = document.getElementById(`elet_cbtn_${c}`);
        if (btn) btn.classList.toggle('active', c === colorKey);
    });

    elet_onSliderChange();
    playSound('click');
}

/* ================= NAVEGAÇÃO DE NÍVEIS ================= */

function elet_switchLevel(lvl) {
    if (elet_running) return;
    lvl = parseInt(lvl, 10);
    if (isNaN(lvl) || lvl < 1) lvl = 1;

    // Regra Estrita: NÃO DEIXA AVANÇAR SEM PASSAR PELO NÍVEL ANTERIOR!
    const saved = getLevels('eletronica_levels');
    for (let prev = 1; prev < lvl; prev++) {
        if (!saved.includes(prev)) {
            if (typeof playSound === 'function') playSound('error');
            alert(`🔒 Nível ${lvl} Bloqueado!\n\nVocê precisa resolver e concluir o circuito do Nível ${prev} com sucesso antes de avançar para o próximo nível!`);
            return;
        }
    }

    elet_level = lvl;

    if (window.makerLeaderboard) {
        window.makerLeaderboard.startTimer('eletronica', lvl);
    }

    elet_updateLevelButtons();

    for (let i = 1; i <= 6; i++) {
        document.getElementById(`elet_btn_lvl_${i}`)?.classList.toggle('active', i === lvl);
        const scaf = document.getElementById(`elet_scaffold_n${i}`);
        if (scaf) scaf.style.display = (i === lvl) ? 'block' : 'none';
    }

    const data = elet_levels_data[lvl];
    if (data) {
        const t = document.getElementById('elet_story_title');
        const b = document.getElementById('elet_story_badge');
        const d = document.getElementById('elet_story_desc');
        const solT = document.getElementById('elet_solution_text');
        if (t) t.innerText = `🎯 ${data.title}`;
        if (b) b.innerText = data.badge;
        if (d) d.innerHTML = data.desc;
        if (solT) solT.innerText = data.solution;
    }

    elet_updateSolutionButtonState();
    elet_updateLiveCpp();
    elet_resetScene();
    playSound('click');
}

function elet_updateLevelButtons() {
    const saved = getLevels('eletronica_levels');
    for (let i = 1; i <= 6; i++) {
        const btn = document.getElementById(`elet_btn_lvl_${i}`);
        const stat = document.getElementById(`elet_lvl_stat_${i}`);
        if (!btn || !stat) continue;

        let canAccess = true;
        for (let p = 1; p < i; p++) {
            if (!saved.includes(p)) {
                canAccess = false;
                break;
            }
        }

        btn.classList.toggle('done', saved.includes(i));
        btn.classList.toggle('locked', !canAccess);

        if (!canAccess) {
            btn.style.cursor = 'not-allowed';
            btn.style.opacity = '0.55';
            btn.title = `Nível ${i} (Bloqueado — Complete os níveis anteriores primeiro)`;
            stat.innerText = '🔒';
        } else {
            btn.style.cursor = 'pointer';
            btn.style.opacity = '1';
            btn.title = `Nível ${i}`;
            if (saved.includes(i)) {
                stat.innerText = '⭐';
            } else {
                stat.innerText = '🔓';
            }
        }
    }
}

/* ================= SIMULADOR DA BANCADA ================= */

function elet_onSliderChange() {
    const vSlider = document.getElementById('elet_slider_v');
    const rSlider = document.getElementById('elet_slider_r');
    if (!vSlider || !rSlider) return;

    const v = parseFloat(vSlider.value);
    const r = parseFloat(rSlider.value);

    document.getElementById('elet_val_v_lbl').innerText = `${v.toFixed(1)} V`;
    document.getElementById('elet_val_r_lbl').innerText = `${Math.round(r)} Ω`;

    elet_updateBenchVisuals(v, r);
}

function elet_updateBenchVisuals(vFonte, rOhms) {
    const spec = elet_color_specs[elet_selected_color] || elet_color_specs.red;
    const vLed = spec.vLed;
    
    // Tensão no resistor VR = max(0, vFonte - vLed)
    const vResistor = Math.max(0, vFonte - vLed);
    const i_Amperes = rOhms > 0 ? (vResistor / rOhms) : 0.080;
    const i_mA = i_Amperes * 1000.0;
    const p_mW = vResistor * i_mA;

    // Atualiza LCD do multímetro
    const lcdEl = document.getElementById('elet_lcd_i_val');
    const mVVal = document.getElementById('elet_m_v_val');
    const mRVal = document.getElementById('elet_m_r_val');
    const mVLedVal = document.getElementById('elet_m_vled_val');
    const mTVal = document.getElementById('elet_m_t_val');

    if (lcdEl) lcdEl.innerText = `${i_mA.toFixed(1)} mA`;
    if (mVVal) mVVal.innerText = `${vResistor.toFixed(2)} V`;
    if (mRVal) mRVal.innerText = `${Math.round(rOhms)} Ω`;
    if (mVLedVal) mVLedVal.innerText = `${vLed.toFixed(2)} V (${spec.name})`;

    // Estado térmico e LED
    const ledBulb = document.getElementById('elet_led_bulb');
    const ledTitle = document.getElementById('elet_led_state_title');
    const ledDesc = document.getElementById('elet_led_state_desc');
    const ledBadge = document.getElementById('elet_led_badge');
    const smokeCont = document.getElementById('elet_smoke_container');
    const narrow = document.getElementById('elet_pipe_constriction');
    const speedLbl = document.getElementById('elet_flow_speed_lbl');

    if (narrow) {
        narrow.innerText = `${Math.round(rOhms)}Ω`;
        const heightPct = Math.max(30, Math.min(95, 100 - (rOhms / 12)));
        narrow.style.height = `${heightPct}%`;
    }

    if (i_mA > 35.0 || rOhms < 70) {
        // Queima do LED / Curto-circuito
        if (ledBulb) {
            ledBulb.className = 'elet-led-bulb burned';
            ledBulb.style.boxShadow = 'none';
            ledBulb.style.background = '#1E293B';
            ledBulb.innerHTML = '<i class="fa-solid fa-fire" style="color:#EF4444;"></i>';
        }
        if (ledTitle) ledTitle.innerText = `💥 ALERTA: SOBRECORRENTE NO LED ${spec.name.toUpperCase()}!`;
        if (ledDesc) ledDesc.innerText = `Corrente disparou para ${i_mA.toFixed(1)} mA! Ultrapassa o limite de 20-40mA do ATmega328P. O LED queimou!`;
        if (ledBadge) {
            ledBadge.style.background = '#7F1D1D';
            ledBadge.style.color = '#FCA5A5';
            ledBadge.innerText = '❌ QUEIMADO';
        }
        if (mTVal) { mTVal.innerText = 'PERIGO (>40mA)'; mTVal.style.color = '#EF4444'; }
        if (smokeCont && smokeCont.children.length === 0) {
            smokeCont.innerHTML = '<div class="elet-smoke-puff">💨</div>';
        }
        if (speedLbl) speedLbl.innerText = 'Fluxo: PERIGOSO ⚠️';
    } else if (i_mA < 3.0 || vFonte <= vLed) {
        // Apagado
        if (ledBulb) {
            ledBulb.className = 'elet-led-bulb';
            ledBulb.style.boxShadow = 'none';
            ledBulb.style.background = '#334155';
            ledBulb.innerHTML = '<i class="fa-regular fa-lightbulb" style="color:#94A3B8;"></i>';
        }
        if (ledTitle) ledTitle.innerText = `LED ${spec.name} Apagado (Tensão Insuficiente)`;
        if (ledDesc) ledDesc.innerText = `Corrente de ${i_mA.toFixed(1)} mA. A fonte precisa ser maior que ${vLed}V para acender.`;
        if (ledBadge) {
            ledBadge.style.background = '#1E293B';
            ledBadge.style.color = '#94A3B8';
            ledBadge.innerText = 'OFF';
        }
        if (mTVal) { mTVal.innerText = 'Seguro (<5mA)'; mTVal.style.color = '#38BDF8'; }
        if (smokeCont) smokeCont.innerHTML = '';
        if (speedLbl) speedLbl.innerText = 'Fluxo: Parado';
    } else if (i_mA > 22.0) {
        // Aquecendo além do limite seguro
        if (ledBulb) {
            ledBulb.className = 'elet-led-bulb lit-warn';
            ledBulb.style.boxShadow = `0 0 30px ${spec.cssColor}`;
            ledBulb.style.background = spec.cssColor;
            ledBulb.innerHTML = '<i class="fa-solid fa-lightbulb" style="color:white;"></i>';
        }
        if (ledTitle) ledTitle.innerText = `⚠️ Atenção: Corrente Elevada (${i_mA.toFixed(1)} mA)`;
        if (ledDesc) ledDesc.innerText = `No limite seguro do pino do ATmega328P (20-40 mA). Recomenda-se aumentar a resistência.`;
        if (ledBadge) {
            ledBadge.style.background = '#78350F';
            ledBadge.style.color = '#FCD34D';
            ledBadge.innerText = '⚠️ AQUECENDO';
        }
        if (mTVal) { mTVal.innerText = 'Atenção (~25mA)'; mTVal.style.color = '#F59E0B'; }
        if (smokeCont) smokeCont.innerHTML = '';
        if (speedLbl) speedLbl.innerText = 'Fluxo: Alto';
    } else {
        // Faixa de Operação Ideal (10 a 20 mA)
        if (ledBulb) {
            ledBulb.className = 'elet-led-bulb lit-safe';
            ledBulb.style.background = spec.cssColor;
            ledBulb.style.boxShadow = `0 0 25px ${spec.cssColor}, 0 0 50px rgba(${spec.rgb}, 0.5)`;
            ledBulb.innerHTML = '<i class="fa-solid fa-lightbulb" style="color:white;"></i>';
        }
        if (ledTitle) ledTitle.innerText = `✅ LED ${spec.name} em Operação Segura`;
        if (ledDesc) ledDesc.innerText = `VR = ${vResistor.toFixed(1)}V | ${i_mA.toFixed(1)} mA proporciona brilho vívido com total longevidade!`;
        if (ledBadge) {
            ledBadge.style.background = '#064E3B';
            ledBadge.style.color = '#34D399';
            ledBadge.innerText = '✅ IDEAL (10-20mA)';
        }
        if (mTVal) { mTVal.innerText = 'Seguro (10-20mA)'; mTVal.style.color = '#34D399'; }
        if (smokeCont) smokeCont.innerHTML = '';
        if (speedLbl) speedLbl.innerText = 'Fluxo: Ideal';
    }

    elet_renderElectronParticles(i_mA);
}

function elet_renderElectronParticles(i_mA) {
    const stream = document.getElementById('elet_electron_stream');
    if (!stream) return;
    
    stream.innerHTML = '';
    const count = Math.max(4, Math.min(24, Math.round(i_mA * 0.8)));
    const duration = Math.max(0.4, Math.min(3.0, 30.0 / Math.max(1, i_mA)));

    for (let i = 0; i < count; i++) {
        const dot = document.createElement('div');
        dot.className = 'elet-electron';
        dot.innerText = 'e-';
        dot.style.fontSize = '0.55rem';
        dot.style.fontWeight = 'bold';
        dot.style.color = '#0F172A';
        dot.style.display = 'flex';
        dot.style.alignItems = 'center';
        dot.style.justifyContent = 'center';
        dot.style.animationDuration = `${duration}s`;
        dot.style.animationDelay = `${(i * (duration / count)).toFixed(2)}s`;
        dot.style.top = `${25 + (i % 3) * 18}%`;
        stream.appendChild(dot);
    }
}

function elet_resetScene() {
    elet_running = false;
    const runBtn = document.getElementById('elet_btn_run');
    if (runBtn) runBtn.disabled = false;
    
    const vSlider = document.getElementById('elet_slider_v');
    const rSlider = document.getElementById('elet_slider_r');

    if (elet_level === 1) {
        if (vSlider) vSlider.value = '5';
        if (rSlider) rSlider.value = '220';
        elet_selected_color = 'red';
    } else if (elet_level === 2) {
        if (vSlider) vSlider.value = '5';
        if (rSlider) rSlider.value = '220';
        elet_selected_color = 'blue';
    } else if (elet_level === 3) {
        if (vSlider) vSlider.value = '5';
        if (rSlider) rSlider.value = '220';
        elet_selected_color = 'red';
    } else if (elet_level === 4) {
        if (vSlider) vSlider.value = '5';
        if (rSlider) rSlider.value = '220';
        elet_selected_color = 'red';
    } else if (elet_level === 5) {
        if (vSlider) vSlider.value = '5';
        if (rSlider) rSlider.value = '220';
        elet_selected_color = 'yellow';
    } else if (elet_level === 6) {
        if (vSlider) vSlider.value = '5';
        if (rSlider) rSlider.value = '50'; // Força sobrecorrente para disparar proteção
        elet_selected_color = 'red';
    }
    
    elet_onSliderChange();
}

/* ================= CÓDIGO C++ DINÂMICO ================= */

function elet_updateLiveCpp() {
    const codeEl = document.getElementById('elet_arduino_code');
    if (!codeEl) return;

    if (elet_level === 1) {
        const vres = document.getElementById('elet_n1_vres')?.value || '// calculo da tensao no resistor';
        const rcalc = document.getElementById('elet_n1_rcalc')?.value || '// calculo da resistencia de Ohm';
        codeEl.innerText = `// ==========================================
// AULA 6 — LEI DE OHM NO ARDUINO UNO (5V)
// Nível 1: Resistor Limitador para LED Vermelho
// ==========================================

float vFonte = 5.0; // Tensão HIGH do Arduino
float vLed = 2.0;   // Queda do LED vermelho (2V)
float iDesejada = 0.015; // 15 mA (0.015 A)

void setup() {
  Serial.begin(9600);
}

void loop() {
  ${vres}
  ${rcalc}

  Serial.print("VR: "); Serial.print(vResistor);
  Serial.print("V | R Ideal: "); Serial.print(rCalculado);
  Serial.println(" Ohms -> Comercial: 220 Ohms");
  delay(1000);
}`;
    } else if (elet_level === 2) {
        const vazul = document.getElementById('elet_n2_vazul')?.value || '// calculo VR LED Azul';
        const razul = document.getElementById('elet_n2_razul')?.value || '// calculo R LED Azul';
        codeEl.innerText = `// ==========================================
// AULA 6 — DIMENSIONAMENTO POR COR DE LED
// Nível 2: LED Azul/Branco (Queda de 3.2V)
// ==========================================

float vFonte = 5.0;
float vLedAzul = 3.2; // Queda maior para emissão azul/branca
float iOperacao = 0.015; // 15 mA

void setup() {
  Serial.begin(9600);
}

void loop() {
  ${vazul}
  ${razul}

  Serial.print("LED Azul VR: "); Serial.print(vResAzul);
  Serial.print("V | Resistor: "); Serial.print(rAzul);
  Serial.println(" Ohms -> Recomendado: 150 ou 220 Ohms");
  delay(1000);
}`;
    } else if (elet_level === 3) {
        const pmode = document.getElementById('elet_n3_pinmode')?.value || '// configuracao do pino';
        const blink = document.getElementById('elet_n3_blink')?.value || '// alternancia e delay';
        codeEl.innerText = `// ==========================================
// AULA 6 — FIRMWARE DO ARDUINO UNO (PINO 9)
// Nível 3: Montagem em Série & Pisca-Pisca
// ==========================================

const int pinoLed = 9;

void setup() {
  ${pmode}
}

void loop() {
  ${blink}
}`;
    } else if (elet_level === 4) {
        const ohms = document.getElementById('elet_n4_calc_ohms')?.value || '// formula faixas de cores';
        codeEl.innerText = `// ==========================================
// AULA 6 — CÓDIGO DE CORES DA SÉRIE E12
// Nível 4: Resistor Comercial de 220 Ohms
// ==========================================

int faixa1 = 2; // Vermelho
int faixa2 = 2; // Vermelho
int multiplicador = 10; // Marrom (x10)

void setup() {
  Serial.begin(9600);
}

void loop() {
  ${ohms}

  Serial.print("Resistor E12: ");
  Serial.print(rOhms);
  Serial.println(" Ohms (+-5%)");
  delay(1000);
}`;
    } else if (elet_level === 5) {
        const ireal = document.getElementById('elet_n5_corrente_real')?.value || '// calculo corrente real';
        const pot = document.getElementById('elet_n5_potencia')?.value || '// calculo potencia';
        codeEl.innerText = `// ==========================================
// AULA 6 — MULTÍMETRO & POTÊNCIA ELÉTRICA
// Nível 5: Medição Real e Dissipação Térmica
// ==========================================

float vResistor = 3.0; // 3V medidos no multímetro
float rComercial = 220.0; // Resistor real de 220 Ohms

void setup() {
  Serial.begin(9600);
}

void loop() {
  ${ireal}
  ${pot}

  Serial.print("Corrente: "); Serial.print(iReal * 1000.0);
  Serial.print(" mA | Potencia: "); Serial.print(potencia * 1000.0);
  Serial.println(" mW");
  delay(1000);
}`;
    } else if (elet_level === 6) {
        const cond = document.getElementById('elet_n6_if_cond')?.value || '/* condicao sobrecorrente */';
        const rele = document.getElementById('elet_n6_rele_cmd')?.value || '/* desligar pino */';
        codeEl.innerText = `// ==========================================
// AULA 6 — PROTEÇÃO DO ATmega328P (20mA a 40mA)
// Nível 6: Sentinela Anti-Queima do Microcontrolador
// ==========================================

float correnteMedida = 0.055;     // 55 mA (Perigo sem resistor!)
float limiteSeguroATmega = 0.025; // 25 mA limite seguro
bool pinoDesligado = false;

void setup() {
  Serial.begin(9600);
}

void loop() {
  if (${cond}) {
    ${rele}
    Serial.println("ALERTA: Corrente acima de 25mA! Pino desativado.");
  }
  delay(500);
}`;
    }
}

/* ================= EXECUÇÃO E VALIDAÇÃO DOS NÍVEIS ================= */

function elet_runSimulation() {
    if (elet_running) return;
    elet_running = true;
    document.getElementById('elet_btn_run').disabled = true;
    playSound('click');

    if (elet_level === 1) elet_runLevel1();
    else if (elet_level === 2) elet_runLevel2();
    else if (elet_level === 3) elet_runLevel3();
    else if (elet_level === 4) elet_runLevel4();
    else if (elet_level === 5) elet_runLevel5();
    else if (elet_level === 6) elet_runLevel6();
}

function elet_runLevel1() {
    const vres = document.getElementById('elet_n1_vres')?.value;
    const rcalc = document.getElementById('elet_n1_rcalc')?.value;

    if (!vres || !rcalc) {
        elet_triggerError('Campos Incompletos!', 'Selecione a fórmula da tensão no resistor e da resistência pela Lei de Ohm.', 'Selecione opções em ambos os dropdowns.');
        elet_running = false;
        document.getElementById('elet_btn_run').disabled = false;
        return;
    }

    if (vres !== 'float vResistor = vFonte - vLed;') {
        elet_triggerError('Queda de Tensão Incorreta!', 'O resistor deve absorver a diferença entre os 5V da fonte e os 2V do LED: vFonte - vLed (5V - 2V = 3V)!', 'Subtraia a tensão do LED da tensão da fonte.');
        elet_running = false;
        document.getElementById('elet_btn_run').disabled = false;
        return;
    }

    if (rcalc !== 'float rCalculado = vResistor / iDesejada;') {
        elet_triggerError('Fórmula da Resistência Incorreta!', 'Pela Lei de Ohm, R = V / I. Dividimos a tensão sobre o resistor pela corrente desejada (3V ÷ 0.015A = 200Ω)!', 'Use vResistor / iDesejada;');
        elet_running = false;
        document.getElementById('elet_btn_run').disabled = false;
        return;
    }

    // Sucesso Nível 1
    elet_setLedColor('red');
    elet_updateBenchVisuals(5.0, 220.0);
    playSound('success');
    setTimeout(() => {
        elet_showWin(1, 'O Guardião do LED Vermelho!', 'Você calculou a tensão restante (VR = 3.0V), encontrou 200 Ω pela Lei de Ohm e escolheu o valor comercial de <b>220 Ω</b> para proteger o LED e o pino do Arduino!');
    }, 800);
}

function elet_runLevel2() {
    const vazul = document.getElementById('elet_n2_vazul')?.value;
    const razul = document.getElementById('elet_n2_razul')?.value;

    if (!vazul || !razul) {
        elet_triggerError('Campos Incompletos!', 'Configure a queda de tensão e a resistência para o LED Azul.', 'Preencha ambos os seletores.');
        elet_running = false;
        document.getElementById('elet_btn_run').disabled = false;
        return;
    }

    if (vazul !== 'float vResAzul = vFonte - vLedAzul;') {
        elet_triggerError('Queda no Resistor Incorreta!', 'Para o LED Azul com queda de 3.2V, o resistor absorve a diferença: 5.0V - 3.2V = 1.8V!', 'Fórmula correta: vFonte - vLedAzul;');
        elet_running = false;
        document.getElementById('elet_btn_run').disabled = false;
        return;
    }

    if (razul !== 'float rAzul = vResAzul / iOperacao;') {
        elet_triggerError('Cálculo da Resistência Incorreto!', 'Pela Lei de Ohm, R = VR / I: 1.8V ÷ 0.015A = 120 Ohms (comercial: 150Ω ou 220Ω)!', 'Divida vResAzul por iOperacao;');
        elet_running = false;
        document.getElementById('elet_btn_run').disabled = false;
        return;
    }

    // Sucesso Nível 2
    elet_setLedColor('blue');
    elet_updateBenchVisuals(5.0, 220.0);
    playSound('success');
    setTimeout(() => {
        elet_showWin(2, 'Tabela de Cores Dominada!', 'Você comprovou que o LED Azul consome mais tensão (3.2V), necessitando de um resistor de 120 Ω a 220 Ω para operar com brilho espetacular!');
    }, 800);
}

function elet_runLevel3() {
    const pmode = document.getElementById('elet_n3_pinmode')?.value;
    const blink = document.getElementById('elet_n3_blink')?.value;

    if (!pmode || !blink) {
        elet_triggerError('Campos Incompletos!', 'Configure a porta no setup() e a sequência de alternância no loop().', 'Preencha ambos os seletores.');
        elet_running = false;
        document.getElementById('elet_btn_run').disabled = false;
        return;
    }

    if (pmode !== 'pinMode(pinoLed, OUTPUT);') {
        elet_triggerError('Configuração de Saída Incorreta!', 'Para fornecer 5V ao LED, o pino 9 deve ser configurado como OUTPUT (saída): pinMode(pinoLed, OUTPUT);', 'Use pinMode(pinoLed, OUTPUT);');
        elet_running = false;
        document.getElementById('elet_btn_run').disabled = false;
        return;
    }

    if (blink !== 'digitalWrite(pinoLed, HIGH); delay(1000); digitalWrite(pinoLed, LOW); delay(1000);') {
        elet_triggerError('Sequência do Pisca-Pisca Incorreta!', 'Para piscar a cada 1 segundo: forneça 5V com HIGH, aguarde delay(1000), forneça 0V com LOW e aguarde delay(1000)!', 'Escolha a opção com HIGH, delay(1000), LOW, delay(1000);');
        elet_running = false;
        document.getElementById('elet_btn_run').disabled = false;
        return;
    }

    // Sucesso Nível 3
    elet_setLedColor('red');
    elet_updateBenchVisuals(5.0, 220.0);
    playSound('success');
    setTimeout(() => {
        elet_showWin(3, 'Circuito do Pino 9 Conectado!', 'O sketch alternou o Pino 9 entre 5V e 0V a cada segundo com o resistor de <b>220 Ω</b> protegendo o LED na protoboard!');
    }, 800);
}

function elet_runLevel4() {
    const calc = document.getElementById('elet_n4_calc_ohms')?.value;

    if (!calc) {
        elet_triggerError('Campo Incompleto!', 'Selecione a fórmula das faixas de cores do resistor de 220 Ohms.', 'Escolha a alternativa correta.');
        elet_running = false;
        document.getElementById('elet_btn_run').disabled = false;
        return;
    }

    if (calc !== 'int rOhms = (faixa1 * 10 + faixa2) * multiplicador;') {
        elet_triggerError('Cálculo de Faixas Incorreto!', 'A 1ª faixa é a dezena (faixa1 * 10), somada com a 2ª faixa (unidade), e o conjunto multiplicado pela 3ª faixa: (2*10 + 2)*10 = 220!', 'Fórmula correta: (faixa1 * 10 + faixa2) * multiplicador;');
        elet_running = false;
        document.getElementById('elet_btn_run').disabled = false;
        return;
    }

    elet_updateBenchVisuals(5.0, 220.0);
    playSound('success');
    setTimeout(() => {
        elet_showWin(4, 'Código de Cores Decifrado!', 'Vermelho (2), Vermelho (2) e Marrom (x10) formam o famoso resistor de <b>220 Ohms</b> da eletrônica maker!');
    }, 800);
}

function elet_runLevel5() {
    const ireal = document.getElementById('elet_n5_corrente_real')?.value;
    const pot = document.getElementById('elet_n5_potencia')?.value;

    if (!ireal || !pot) {
        elet_triggerError('Campos Incompletos!', 'Configure o cálculo da corrente medida e da potência dissipada.', 'Preencha os seletores.');
        elet_running = false;
        document.getElementById('elet_btn_run').disabled = false;
        return;
    }

    if (ireal !== 'float iReal = vResistor / rComercial;') {
        elet_triggerError('Cálculo de Corrente Incorreto!', 'Pela Lei de Ohm, I = V / R: dividimos os 3.0V medidos pelo resistor de 220.0 Ohms!', 'Use vResistor / rComercial;');
        elet_running = false;
        document.getElementById('elet_btn_run').disabled = false;
        return;
    }

    if (pot !== 'float potencia = vResistor * iReal;') {
        elet_triggerError('Fórmula de Potência Incorreta!', 'Potência é Tensão vezes Corrente (P = V * I). Multiplique vResistor por iReal!', 'Use vResistor * iReal;');
        elet_running = false;
        document.getElementById('elet_btn_run').disabled = false;
        return;
    }

    elet_updateBenchVisuals(5.0, 220.0);
    playSound('success');
    setTimeout(() => {
        elet_showWin(5, 'Multímetro e Potência Aprovados!', 'Você mediu a corrente real de <b>13.6 mA</b> e comprovou a potência segura de <b>41 mW</b> dissipada sem sobreaquecimento!');
    }, 800);
}

function elet_runLevel6() {
    const cond = document.getElementById('elet_n6_if_cond')?.value;
    const rele = document.getElementById('elet_n6_rele_cmd')?.value;

    if (!cond || !rele) {
        elet_triggerError('Campos Incompletos!', 'Defina a condição de sobrecorrente e o comando de desarme.', 'Preencha ambos os seletores.');
        elet_running = false;
        document.getElementById('elet_btn_run').disabled = false;
        return;
    }

    if (cond !== 'correnteMedida > limiteSeguroATmega') {
        elet_triggerError('Condição de Perigo Incorreta!', 'O sistema deve proteger o pino quando a corrente for MAIOR que o limite seguro do microcontrolador: correnteMedida > limiteSeguroATmega!', 'Use o operador > (maior que).');
        elet_running = false;
        document.getElementById('elet_btn_run').disabled = false;
        return;
    }

    if (rele !== 'pinoDesligado = true;') {
        elet_triggerError('Comando de Desarme Incorreto!', 'Para desativar a porta e cortar a sobrecorrente, atribua true à variável de controle: pinoDesligado = true;', 'Use pinoDesligado = true;');
        elet_running = false;
        document.getElementById('elet_btn_run').disabled = false;
        return;
    }

    elet_updateBenchVisuals(5.0, 220.0);
    playSound('success');
    setTimeout(() => {
        elet_showWin(6, 'Microcontrolador ATmega328P Salvo!', 'Você protegeu o chip contra correntes perigosas acima de 25mA! A Lei de Ohm agora é o seu superpoder maker!');
    }, 800);
}

/* ================= TRATAMENTO DE ERROS E AJUDA ================= */

function elet_triggerError(title, msg, tip) {
    playSound('error');
    elet_errors_count[elet_level] = (elet_errors_count[elet_level] || 0) + 1;
    elet_updateSolutionButtonState();

    if (typeof showErrorSplash === 'function') {
        showErrorSplash({
            title: `⚡ ${title}`,
            message: msg,
            tip: tip,
            onRetry: () => {
                elet_running = false;
                document.getElementById('elet_btn_run').disabled = false;
            }
        });
    } else {
        alert(`${title}\n${msg}\n\n💡 Dica: ${tip}`);
        elet_running = false;
        document.getElementById('elet_btn_run').disabled = false;
    }
}

function elet_updateSolutionButtonState() {
    const btn = document.getElementById('elet_btn_solution');
    const txt = document.getElementById('elet_sol_btn_txt');
    if (!btn || !txt) return;

    const errs = elet_errors_count[elet_level] || 0;
    if (errs >= 2) {
        btn.disabled = false;
        btn.style.opacity = '1';
        btn.style.borderColor = '#F59E0B';
        txt.innerText = '💡 Precisa de Ajuda? Ver Resolução C/C++';
    } else {
        btn.disabled = true;
        btn.style.opacity = '0.5';
        btn.style.borderColor = '#475569';
        txt.innerText = `💡 Ajuda desbloqueia após 2 tentativas erradas (${errs}/2)`;
    }
}

function elet_toggleSolution() {
    const box = document.getElementById('elet_solution_box');
    if (!box) return;
    box.style.display = (box.style.display === 'none' || !box.style.display) ? 'block' : 'none';
    playSound('click');
}

function elet_applyCurrentSolution() {
    const lvl = elet_level;
    if (lvl === 1) {
        document.getElementById('elet_n1_vres').value = 'float vResistor = vFonte - vLed;';
        document.getElementById('elet_n1_rcalc').value = 'float rCalculado = vResistor / iDesejada;';
    } else if (lvl === 2) {
        document.getElementById('elet_n2_vazul').value = 'float vResAzul = vFonte - vLedAzul;';
        document.getElementById('elet_n2_razul').value = 'float rAzul = vResAzul / iOperacao;';
    } else if (lvl === 3) {
        document.getElementById('elet_n3_pinmode').value = 'pinMode(pinoLed, OUTPUT);';
        document.getElementById('elet_n3_blink').value = 'digitalWrite(pinoLed, HIGH); delay(1000); digitalWrite(pinoLed, LOW); delay(1000);';
    } else if (lvl === 4) {
        document.getElementById('elet_n4_calc_ohms').value = 'int rOhms = (faixa1 * 10 + faixa2) * multiplicador;';
    } else if (lvl === 5) {
        document.getElementById('elet_n5_corrente_real').value = 'float iReal = vResistor / rComercial;';
        document.getElementById('elet_n5_potencia').value = 'float potencia = vResistor * iReal;';
    } else if (lvl === 6) {
        document.getElementById('elet_n6_if_cond').value = 'correnteMedida > limiteSeguroATmega';
        document.getElementById('elet_n6_rele_cmd').value = 'pinoDesligado = true;';
    }
    elet_updateLiveCpp();
    playSound('success');
}

/* ================= VITÓRIA E PERSISTÊNCIA ================= */

function elet_showWin(level, title, text) {
    elet_running = false;
    document.getElementById('elet_btn_run').disabled = false;

    let speedrunHTML = '';
    if (window.makerLeaderboard) {
        const elapsed = window.makerLeaderboard.stopTimer('eletronica', level);
        const res = window.makerLeaderboard.recordCompletion('eletronica', level, elapsed);
        speedrunHTML = window.makerLeaderboard.generateWinTimeCardHTML('eletronica', level, elapsed, res);
    }

    // Persistência
    let saved = getLevels('eletronica_levels');
    if (!saved.includes(level)) {
        saved.push(level);
        localStorage.setItem('eletronica_levels', JSON.stringify(saved));
    }

    elet_updateLevelButtons();
    if (typeof updateHubProgress === 'function') updateHubProgress();
    if (typeof updateTrail === 'function') updateTrail();

    const mIcon = document.getElementById('elet_modal_icon');
    const mTitle = document.getElementById('elet_modal_title');
    const mText = document.getElementById('elet_modal_text');
    const modal = document.getElementById('elet_win_modal');

    if (mIcon) mIcon.innerText = '⚡';
    if (mTitle) mTitle.innerText = title;
    if (mText) mText.innerHTML = `${text}${speedrunHTML}`;
    if (modal) modal.classList.add('active');

    playSound('success');
    if (typeof triggerConfetti === 'function') triggerConfetti();
}

function elet_closeWinModal() {
    const modal = document.getElementById('elet_win_modal');
    if (modal) modal.classList.remove('active');
    
    if (elet_level < 6) {
        elet_switchLevel(elet_level + 1);
    } else {
        openTab('tab-trail');
    }
}

function elet_copyCode() {
    const codeEl = document.getElementById('elet_arduino_code');
    if (!codeEl) return;
    navigator.clipboard.writeText(codeEl.innerText).then(() => {
        alert('Código Arduino C++ copiado com sucesso! 📋');
        playSound('click');
    });
}

/* ==========================================================================
   AULA 8 — O LABORATÓRIO DO ARDUINO IDE, DRIVERS & CONEXÃO
   Plataforma Criadores de Código — Laboratório Maker de Robótica & Arduino
   ========================================================================== */

let ard_quizIndex = 0;
let ard_selectedBoard = 'Arduino Uno';
let ard_selectedPort = 'COM3 (Arduino Uno)';
let ard_isUsbConnected = true;
let ard_driverInstalled = true;
let ard_isUploading = false;
let ard_isBoardBlank = false;
let ard_serialBaud = '9600';
let ard_serialAutoscroll = true;
let ard_serialTimestamp = true;
let ard_serialLineEnding = 'nl';
let ard_activeSketchName = 'semaforo_maker.ino';
let ard_trafficLightTimer = null;
let ard_trafficPhase = 0; // 0: Verde, 1: Amarelo, 2: Vermelho
let ard_uploadActiveSketch = 'semaforo_maker.ino';
let ard_tourCurrentStep = 0;

// Estados do Plotter Serial & Monitor Serial
let ard_plotterOpen = false;
let ard_plotterPaused = false;
let ard_plotterSource = 'pot_ldr'; // 'pot_ldr', 'traffic_light', 'sine_pwm', 'noise'
let ard_plotterPotValue = 612;
let ard_plotterLdrValue = 380;
let ard_plotterNoiseVal = 512;
let ard_plotterBaud = '9600';
let ard_plotterScaleMode = 'adc'; // 'adc' (0 a 1023) ou 'volts' (0.0V a 5.0V)
let ard_plotterData = [];
let ard_plotterInterval = null;
let ard_plotterTick = 0;
let ard_monitorOpen = false;
let ard_monitorInterval = null;

function loadArduino() {
    const container = document.getElementById('arduino-container');
    if (!container) return;

    container.innerHTML = `
        <style>
            .ard-wrapper {
                color: #CBD5E1;
                font-family: 'Nunito', sans-serif;
                max-width: 1100px;
                margin: 0 auto;
            }
            .ard-wrapper .tabs {
                display: flex;
                gap: 8px;
                background: #1E293B;
                padding: 6px;
                border-radius: 30px;
                margin: 10px 0 20px;
                flex-wrap: wrap;
                justify-content: center;
            }
            .ard-wrapper .tab {
                flex: 1;
                min-width: 140px;
                background: transparent;
                border: none;
                color: #94A3B8;
                padding: 10px 14px;
                border-radius: 24px;
                font-weight: 800;
                font-size: 0.88rem;
                cursor: pointer;
                transition: all 0.25s;
                text-align: center;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 6px;
            }
            .ard-wrapper .tab:hover {
                color: white;
                background: #334155;
            }
            .ard-wrapper .tab.active {
                background: linear-gradient(135deg, #EF4444, #DC2626);
                color: white;
                box-shadow: 0 0 15px rgba(239, 68, 68, 0.45);
            }
            .ard-wrapper .panel {
                display: none;
                background: #1E293B;
                border-radius: 24px;
                padding: 24px;
                border: 2px solid #334155;
                animation: ardFadeIn 0.3s ease;
            }
            .ard-wrapper .panel.active {
                display: block;
            }
            @keyframes ardFadeIn {
                from { opacity: 0; transform: translateY(8px); }
                to { opacity: 1; transform: translateY(0); }
            }

            /* Cards didáticos */
            .ard-card {
                background: #0F172A;
                border-radius: 18px;
                padding: 18px;
                border: 2px solid #334155;
                margin-bottom: 16px;
                transition: border-color 0.2s;
            }
            .ard-card:hover {
                border-color: #38BDF8;
            }
            .ard-grid-3 {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
                gap: 16px;
                margin: 16px 0;
            }

            /* Desafio Prático na Carteira */
            .ard-desk-challenge {
                background: linear-gradient(135deg, rgba(245, 158, 11, 0.12), rgba(217, 119, 6, 0.05));
                border: 2px dashed #F59E0B;
                border-radius: 18px;
                padding: 18px 22px;
                margin: 18px 0;
                color: #FDE68A;
                font-size: 0.94rem;
                line-height: 1.6;
            }
            .ard-desk-challenge strong {
                color: #FBBF24;
            }

            /* Botão de Download Oficial */
            .ard-download-hero {
                background: linear-gradient(135deg, #0B132B, #111D3D);
                border: 2px solid #00979d;
                border-radius: 20px;
                padding: 24px;
                text-align: center;
                margin: 18px 0;
                box-shadow: 0 10px 30px rgba(0, 151, 157, 0.2);
            }
            .ard-real-btn {
                background: linear-gradient(135deg, #00979d, #00797f);
                color: white;
                text-decoration: none;
                padding: 14px 28px;
                border-radius: 30px;
                font-size: 1.05rem;
                font-weight: 900;
                display: inline-flex;
                align-items: center;
                gap: 10px;
                box-shadow: 0 4px 20px rgba(0, 151, 157, 0.4);
                transition: all 0.2s ease;
                border: none;
                cursor: pointer;
            }
            .ard-real-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 25px rgba(0, 151, 157, 0.6);
                background: linear-gradient(135deg, #00b4bc, #00878d);
            }

            /* Janela do Gerenciador de Dispositivos */
            .ard-devmgmt-window {
                background: #FFFFFF;
                color: #1E293B;
                border-radius: 8px;
                border: 1px solid #64748B;
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                box-shadow: 0 16px 40px rgba(0,0,0,0.65);
                max-width: 660px;
                margin: 0 auto;
                overflow: hidden;
            }
            .ard-devmgmt-titlebar {
                background: #E2E8F0;
                padding: 6px 12px;
                font-size: 0.82rem;
                font-weight: 700;
                display: flex;
                align-items: center;
                justify-content: space-between;
                border-bottom: 1px solid #CBD5E1;
                color: #0F172A;
            }
            .ard-devmgmt-win-controls {
                display: flex;
                align-items: center;
                gap: 8px;
            }
            .ard-devmgmt-win-btn {
                background: transparent;
                border: none;
                cursor: pointer;
                font-size: 0.85rem;
                padding: 2px 6px;
                border-radius: 4px;
                color: #475569;
            }
            .ard-devmgmt-win-btn:hover {
                background: #CBD5E1;
            }
            .ard-devmgmt-win-btn.close:hover {
                background: #EF4444;
                color: white;
            }
            .ard-devmgmt-menubar {
                background: #F8FAFC;
                padding: 3px 10px;
                font-size: 0.8rem;
                display: flex;
                gap: 14px;
                border-bottom: 1px solid #E2E8F0;
                color: #334155;
            }
            .ard-devmgmt-menubar span {
                cursor: pointer;
                padding: 2px 6px;
                border-radius: 3px;
            }
            .ard-devmgmt-menubar span:hover {
                background: #E2E8F0;
            }
            .ard-devmgmt-toolbar {
                background: #F1F5F9;
                padding: 5px 12px;
                display: flex;
                align-items: center;
                gap: 8px;
                border-bottom: 1px solid #CBD5E1;
                font-size: 0.82rem;
                flex-wrap: wrap;
            }
            .ard-devmgmt-toolbtn {
                background: #FFFFFF;
                border: 1px solid #CBD5E1;
                border-radius: 4px;
                padding: 4px 9px;
                font-size: 0.8rem;
                cursor: pointer;
                color: #1E293B;
                display: inline-flex;
                align-items: center;
                gap: 6px;
                font-weight: 600;
                transition: all 0.15s;
            }
            .ard-devmgmt-toolbtn:hover {
                background: #E0F2FE;
                border-color: #38BDF8;
                color: #0369A1;
            }
            .ard-devmgmt-tree {
                padding: 10px 14px;
                background: #FFFFFF;
                max-height: 250px;
                overflow-y: auto;
                font-size: 0.84rem;
                line-height: 1.6;
            }
            .ard-devmgmt-item {
                display: flex;
                align-items: center;
                gap: 6px;
                padding: 3px 6px;
                cursor: pointer;
                border-radius: 4px;
                user-select: none;
            }
            .ard-devmgmt-item:hover {
                background: #F1F5F9;
            }
            .ard-devmgmt-item.selected {
                background: #DBEAFE;
                color: #1E40AF;
                font-weight: 700;
            }
            .ard-devmgmt-statusbar {
                background: #F8FAFC;
                border-top: 1px solid #E2E8F0;
                padding: 4px 12px;
                font-size: 0.76rem;
                color: #64748B;
                display: flex;
                justify-content: space-between;
            }

            /* Container e Estilos da ARDUINO IDE 1.8.x Oficial */
            .ard-ide-container {
                background: #008184;
                border: 2px solid #00979d;
                border-radius: 12px;
                overflow: hidden;
                box-shadow: 0 12px 35px rgba(0,0,0,0.55);
                margin: 18px 0;
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                position: relative;
            }
            .ard-ide-titlebar {
                background: #006468;
                color: white;
                padding: 6px 12px;
                font-size: 0.8rem;
                font-weight: 700;
                display: flex;
                align-items: center;
                justify-content: space-between;
                border-bottom: 1px solid rgba(255,255,255,0.15);
            }
            .ard-ide-menubar {
                background: #008184;
                color: white;
                padding: 3px 10px;
                display: flex;
                gap: 14px;
                font-size: 0.82rem;
                border-bottom: 1px solid rgba(0,0,0,0.15);
                position: relative;
            }
            .ard-ide-menu-btn {
                padding: 4px 8px;
                border-radius: 4px;
                cursor: pointer;
                transition: background 0.15s;
                position: relative;
                user-select: none;
            }
            .ard-ide-menu-btn:hover, .ard-ide-menu-btn.active {
                background: rgba(255,255,255,0.22);
            }
            .ard-ide-toolbar {
                background: #00979D;
                padding: 6px 12px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                border-bottom: 1px solid rgba(0,0,0,0.15);
                flex-wrap: wrap;
                gap: 8px;
            }
            .ard-ide-toolgroup {
                display: flex;
                align-items: center;
                gap: 6px;
            }
            .ard-btn-round {
                width: 36px;
                height: 36px;
                border-radius: 50%;
                background: #00797F;
                border: 1px solid rgba(255,255,255,0.3);
                color: white;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                font-size: 0.95rem;
                transition: all 0.15s ease;
                position: relative;
            }
            .ard-btn-round:hover {
                background: #006468;
                transform: scale(1.08);
                border-color: white;
                box-shadow: 0 0 10px rgba(255,255,255,0.4);
            }
            .ard-btn-round:active {
                transform: scale(0.96);
            }
            .ard-ide-tab-strip {
                background: #E2E8F0;
                border-bottom: 1px solid #CBD5E1;
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 0 10px;
            }
            .ard-ide-tab {
                background: #FFFFFF;
                color: #0F172A;
                padding: 6px 16px;
                font-size: 0.82rem;
                font-family: 'Consolas', 'Courier New', monospace;
                font-weight: 700;
                border-top: 2px solid #00979D;
                border-left: 1px solid #CBD5E1;
                border-right: 1px solid #CBD5E1;
                cursor: pointer;
                display: inline-flex;
                align-items: center;
                gap: 8px;
            }

            /* Editor com FUNDO BRANCO (#FFFFFF) OBRIGATÓRIO DA IDE ARDUINO */
            /* Editor com FUNDO BRANCO (#FFFFFF) OBRIGATÓRIO DA IDE ARDUINO */
            .ard-ide-editor-box {
                background: #FFFFFF !important;
                color: #1E293B !important;
                display: flex;
                min-height: 290px;
                height: 350px;
                max-height: 480px;
                position: relative;
                border-bottom: 1px solid #CBD5E1;
                overflow: hidden;
            }
            .ard-ide-gutter {
                background: #F8FAFC;
                color: #94A3B8;
                padding: 10px 8px;
                text-align: right;
                user-select: none;
                border-right: 1px solid #E2E8F0;
                min-width: 44px;
                font-family: 'Consolas', 'Courier New', monospace;
                font-size: 14px;
                line-height: 22px;
                overflow: hidden;
            }
            .ard-ide-editor-wrapper {
                position: relative;
                flex: 1;
                height: 100%;
                min-height: 290px;
                overflow: hidden;
                background: #FFFFFF;
            }
            .ard-ide-code-area, .ard-ide-code-textarea {
                margin: 0 !important;
                padding: 10px 14px !important;
                font-family: 'Consolas', 'Courier New', monospace !important;
                font-size: 14px !important;
                line-height: 22px !important;
                tab-size: 2;
                white-space: pre !important;
                word-wrap: normal !important;
                box-sizing: border-box !important;
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                border: none !important;
                outline: none !important;
            }
            .ard-ide-code-area {
                pointer-events: none;
                background: transparent;
                color: #1E293B;
                overflow: hidden;
                z-index: 1;
                display: block;
            }
            .ard-ide-code-textarea {
                background: transparent;
                color: transparent;
                caret-color: #0F172A;
                resize: none;
                overflow: auto;
                z-index: 2;
            }
            .ard-ide-code-textarea::selection {
                background: rgba(56, 189, 248, 0.35);
                color: transparent;
            }

            /* Cores Oficiais da Sintaxe Arduino C++ */
            .syn-kw { color: #007E82; font-weight: 700; } /* int, void, const, return */
            .syn-cn { color: #006699; font-weight: 700; } /* OUTPUT, HIGH, LOW */
            .syn-fn { color: #D35400; font-weight: 700; } /* setup, loop, pinMode, digitalWrite, delay, Serial */
            .syn-cm { color: #7F8C8D; font-style: italic; } /* Comentários // ... */
            .syn-st { color: #2E86C1; } /* Strings "..." */
            .syn-nm { color: #A04000; font-weight: 600; } /* Números */
            .syn-pre { color: #5E6D03; font-weight: 700; } /* Preprocessador #include, #define */

            .ard-syntax-toolbar {
                background: #F8FAFC;
                border-bottom: 1px solid #CBD5E1;
                padding: 6px 12px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                flex-wrap: wrap;
                gap: 8px;
            }
            .ard-sketch-quickbtn {
                background: #FFFFFF;
                border: 1px solid #CBD5E1;
                color: #334155;
                padding: 3px 9px;
                border-radius: 4px;
                font-size: 0.76rem;
                font-weight: 700;
                cursor: pointer;
                transition: all 0.15s ease;
                display: inline-flex;
                align-items: center;
                gap: 4px;
            }
            .ard-sketch-quickbtn:hover {
                background: #E2E8F0;
                border-color: #00979D;
                color: #00979D;
            }
            .ard-sketch-quickbtn.active {
                background: #00979D;
                border-color: #00797F;
                color: white;
            }
            .ard-syntax-legend {
                display: flex;
                align-items: center;
                gap: 10px;
                font-family: 'Consolas', 'Courier New', monospace;
                font-size: 0.76rem;
                background: #FFFFFF;
                padding: 3px 10px;
                border-radius: 4px;
                border: 1px solid #E2E8F0;
            }
            .ard-dialog-modal {
                position: fixed;
                top: 0; left: 0; width: 100vw; height: 100vh;
                background: rgba(15, 23, 42, 0.75);
                backdrop-filter: blur(4px);
                z-index: 2400;
                display: none;
                align-items: center;
                justify-content: center;
                padding: 16px;
            }
            .ard-dialog-modal.open {
                display: flex;
            }

            /* Área de Mensagens (Teal) & Console de Texto (Preto) */
            .ard-ide-msg-bar {
                background: #00979D;
                color: white;
                padding: 6px 14px;
                font-size: 0.82rem;
                font-weight: 700;
                display: flex;
                align-items: center;
                justify-content: space-between;
                min-height: 28px;
                transition: background 0.3s;
            }
            .ard-ide-console {
                background: #000000;
                color: #38BDF8;
                padding: 10px 14px;
                font-family: 'Consolas', 'Courier New', monospace;
                font-size: 0.8rem;
                max-height: 130px;
                overflow-y: auto;
                border-top: 1px solid #1E293B;
                white-space: pre-wrap;
                line-height: 1.45;
            }
            .ard-ide-bottom-status {
                background: #005F63;
                color: white;
                padding: 5px 14px;
                font-size: 0.78rem;
                font-weight: 700;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            /* PIN BADGES (1) até (11) e Efeito de Destaque */
            .ard-pin-badge {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                width: 22px;
                height: 22px;
                border-radius: 50%;
                background: #EF4444;
                color: white;
                font-weight: 900;
                font-size: 0.75rem;
                box-shadow: 0 0 8px rgba(239, 68, 68, 0.8);
                margin: 0 4px;
                vertical-align: middle;
                border: 1.5px solid white;
                cursor: pointer;
                transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                user-select: none;
                z-index: 10;
            }
            .ard-pin-badge:hover {
                transform: scale(1.35);
                background: #DC2626;
                box-shadow: 0 0 16px #EF4444, 0 0 25px rgba(239, 68, 68, 0.6);
            }
            .ard-highlight-target {
                outline: 3px solid #EF4444 !important;
                box-shadow: 0 0 24px #EF4444 !important;
                animation: ardPulseBadge 1.2s infinite alternate !important;
                border-radius: 4px;
                position: relative;
                z-index: 90;
            }

            /* TOOLTIP FLUTUANTE RICO DOS BOTÕES NUMERADOS DA IDE */
            .ard-pin-tooltip {
                position: fixed;
                z-index: 9999999;
                width: 320px;
                max-width: calc(100vw - 24px);
                background: #0F172A;
                border: 2px solid #38BDF8;
                border-radius: 14px;
                padding: 12px 16px;
                box-shadow: 0 16px 40px rgba(0,0,0,0.92), 0 0 30px rgba(56, 189, 248, 0.45);
                color: #F8FAFC;
                pointer-events: none;
                transition: opacity 0.15s ease, transform 0.15s ease;
                transform: translateY(6px);
                opacity: 0;
                display: none;
                font-family: 'Nunito', sans-serif;
            }
            .ard-pin-tooltip.visible {
                opacity: 1 !important;
                transform: translateY(0) !important;
                display: block !important;
            }
            .ard-tooltip-arrow {
                position: absolute;
                width: 12px;
                height: 12px;
                background: #0F172A;
                border: 2px solid #38BDF8;
                transform: rotate(45deg);
                pointer-events: none;
            }
            .ard-tooltip-arrow.arrow-bottom {
                bottom: -7px;
                border-top: none;
                border-left: none;
            }
            .ard-tooltip-arrow.arrow-top {
                top: -7px;
                border-bottom: none;
                border-right: none;
            }
            .ard-tooltip-header {
                display: flex;
                align-items: center;
                gap: 10px;
                margin-bottom: 8px;
                padding-bottom: 6px;
                border-bottom: 1px solid rgba(255,255,255,0.12);
            }
            .ard-tooltip-badge {
                width: 26px;
                height: 26px;
                border-radius: 50%;
                background: #EF4444;
                color: white;
                font-weight: 900;
                font-size: 0.82rem;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                box-shadow: 0 0 10px #EF4444;
                border: 1.5px solid white;
            }
            .ard-tooltip-title {
                font-weight: 900;
                font-size: 0.95rem;
                color: #38BDF8;
                line-height: 1.2;
            }
            .ard-tooltip-category {
                font-size: 0.7rem;
                color: #94A3B8;
                text-transform: uppercase;
                font-weight: 700;
            }
            .ard-tooltip-body {
                font-size: 0.84rem;
                line-height: 1.45;
                color: #E2E8F0;
            }
            .ard-tooltip-footer {
                margin-top: 8px;
                font-size: 0.72rem;
                color: #FBBF24;
                font-weight: 700;
                display: flex;
                align-items: center;
                gap: 6px;
                padding-top: 5px;
                border-top: 1px dashed rgba(255,255,255,0.1);
            }
            .ard-card.hover-glow {
                border-color: #38BDF8 !important;
                box-shadow: 0 0 20px rgba(56, 189, 248, 0.4) !important;
                transform: translateY(-2px);
            }
            @keyframes ardPulseBadge {
                from { outline-color: #EF4444; box-shadow: 0 0 10px #EF4444; }
                to { outline-color: #FBBF24; box-shadow: 0 0 30px #FBBF24; }
            }

            /* Menu Dropdown Ferramentas Estilo Windows/Arduino */
            .ard-dropdown-menu {
                position: absolute;
                top: 100%;
                left: 120px;
                background: #FFFFFF;
                color: #1E293B;
                border: 1px solid #CBD5E1;
                border-radius: 4px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.45);
                min-width: 290px;
                z-index: 200;
                font-size: 0.82rem;
                padding: 4px 0;
                display: none;
            }
            .ard-dropdown-menu.show {
                display: block;
            }
            .ard-menu-row {
                padding: 6px 16px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                cursor: pointer;
                position: relative;
                user-select: none;
            }
            .ard-menu-row:hover {
                background: #0078D7;
                color: white;
            }
            .ard-menu-divider {
                height: 1px;
                background: #E2E8F0;
                margin: 4px 0;
            }
            .ard-submenu {
                position: absolute;
                top: 0;
                left: 100%;
                background: #FFFFFF;
                color: #1E293B;
                border: 1px solid #CBD5E1;
                border-radius: 4px;
                box-shadow: 0 10px 25px rgba(0,0,0,0.35);
                min-width: 230px;
                display: none;
                padding: 4px 0;
                z-index: 210;
            }
            .ard-menu-row:hover > .ard-submenu {
                display: block;
            }

            /* OVERLAY GUIDE PARA INICIANTES */
            .ard-tour-overlay {
                position: fixed;
                top: 0; left: 0; width: 100vw; height: 100vh;
                background: rgba(15, 23, 42, 0.78);
                backdrop-filter: blur(4px);
                z-index: 9999;
                display: none;
                align-items: center;
                justify-content: center;
                padding: 20px;
            }
            .ard-tour-overlay.active {
                display: flex;
            }
            .ard-tour-card {
                background: #1E293B;
                border: 2px solid #38BDF8;
                border-radius: 20px;
                padding: 24px;
                max-width: 520px;
                width: 100%;
                box-shadow: 0 20px 50px rgba(0,0,0,0.8), 0 0 35px rgba(56, 189, 248, 0.35);
                color: #F8FAFC;
                animation: ardPopUp 0.25s ease-out;
                position: relative;
            }
            .ard-tour-step-badge {
                background: #0284C7;
                color: white;
                font-size: 0.75rem;
                font-weight: 900;
                padding: 4px 10px;
                border-radius: 12px;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                display: inline-block;
                margin-bottom: 8px;
            }
            .ard-tour-title {
                color: #38BDF8;
                font-family: 'Fredoka One', cursive;
                font-size: 1.3rem;
                margin: 0 0 8px;
                display: flex;
                align-items: center;
                gap: 8px;
            }
            .ard-tour-desc {
                color: #CBD5E1;
                font-size: 0.92rem;
                line-height: 1.65;
                margin: 0 0 20px;
            }
            .ard-tour-footer {
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-top: 1px solid #334155;
                padding-top: 14px;
                flex-wrap: wrap;
                gap: 10px;
            }
            .ard-tour-btn {
                border: none;
                border-radius: 10px;
                padding: 8px 16px;
                font-weight: 800;
                font-size: 0.85rem;
                cursor: pointer;
                transition: all 0.15s ease;
            }

            /* Hardware Virtual do Semáforo no Upload */
            .ard-hw-box {
                background: #0B132B;
                border: 2px solid #38BDF8;
                border-radius: 16px;
                padding: 16px;
                display: flex;
                align-items: center;
                justify-content: space-around;
                margin-top: 14px;
                flex-wrap: wrap;
                gap: 14px;
            }
            .ard-led-indicator {
                width: 24px;
                height: 24px;
                border-radius: 50%;
                background: #334155;
                box-shadow: inset 0 2px 4px rgba(0,0,0,0.5);
                transition: all 0.2s ease;
                display: inline-block;
            }
            .ard-led-indicator.active-red {
                background: #EF4444;
                box-shadow: 0 0 18px #EF4444, inset 0 -2px 6px rgba(255,255,255,0.6);
            }
            .ard-led-indicator.active-yellow {
                background: #F59E0B;
                box-shadow: 0 0 18px #F59E0B, inset 0 -2px 6px rgba(255,255,255,0.6);
            }
            .ard-led-indicator.active-green {
                background: #10B981;
                box-shadow: 0 0 18px #10B981, inset 0 -2px 6px rgba(255,255,255,0.6);
            }
            .ard-comm-led {
                width: 10px;
                height: 10px;
                border-radius: 50%;
                background: #334155;
                display: inline-block;
                transition: background 0.1s;
            }
            .ard-comm-led.flash-tx {
                background: #F59E0B !important;
                box-shadow: 0 0 8px #F59E0B;
            }
            .ard-comm-led.flash-rx {
                background: #10B981 !important;
                box-shadow: 0 0 8px #10B981;
            }

            /* ================= BANCADA MAKER INTERATIVA DE CONEXÃO ================= */
            .ard-bench-wrap {
                background: radial-gradient(circle at 50% 30%, #1E293B 0%, #0B132B 90%);
                border: 2px solid #0284C7;
                border-radius: 20px;
                padding: 22px 18px;
                margin-bottom: 20px;
                box-shadow: 0 16px 50px rgba(0,0,0,0.7), inset 0 0 35px rgba(2, 132, 199, 0.12);
                position: relative;
            }
            .ard-bench-mat {
                background-color: #070D1E;
                background-image: 
                    linear-gradient(rgba(56, 189, 248, 0.05) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(56, 189, 248, 0.05) 1px, transparent 1px);
                background-size: 24px 24px;
                border: 1px dashed rgba(56, 189, 248, 0.3);
                border-radius: 16px;
                padding: 20px 14px;
                position: relative;
            }
            @keyframes ardDataPulse {
                0% { stroke-dashoffset: 48; }
                100% { stroke-dashoffset: 0; }
            }
            .ard-cable-pulse {
                animation: ardDataPulse 0.9s linear infinite;
            }
            .ard-bench-btn {
                background: #1E293B;
                border: 1px solid #38BDF8;
                color: #38BDF8;
                padding: 8px 16px;
                border-radius: 10px;
                font-weight: 800;
                font-size: 0.84rem;
                cursor: pointer;
                transition: all 0.2s ease;
                display: inline-flex;
                align-items: center;
                gap: 6px;
            }
            .ard-bench-btn:hover {
                background: #0284C7;
                color: white;
                box-shadow: 0 0 14px rgba(56, 189, 248, 0.4);
                transform: translateY(-2px);
            }
            .ard-bench-btn.active {
                background: #0284C7;
                color: white;
            }
            .ard-bench-btn.primary {
                background: linear-gradient(135deg, #0284C7, #0369A1);
                color: white;
                border-color: #38BDF8;
            }

            /* Modais e Diálogos */
            .ard-modal {
                position: fixed;
                top: 0; left: 0; width: 100%; height: 100%;
                background: rgba(0,0,0,0.75);
                display: none;
                align-items: center;
                justify-content: center;
                z-index: 1000;
                backdrop-filter: blur(4px);
            }
            .ard-modal.active {
                display: flex;
            }
            .ard-modal-box {
                background: #1E293B;
                border: 2px solid #EF4444;
                border-radius: 24px;
                padding: 30px;
                max-width: 500px;
                width: 90%;
                text-align: center;
                box-shadow: 0 0 30px rgba(239, 68, 68, 0.4);
            }
            .ard-dev-props-modal {
                position: fixed;
                top: 0; left: 0; width: 100%; height: 100%;
                background: rgba(0,0,0,0.6);
                display: none;
                align-items: center;
                justify-content: center;
                z-index: 1000;
            }
            .ard-dev-props-modal.open {
                display: flex;
            }
            .ard-dev-props-box {
                background: #FFFFFF;
                color: #1E293B;
                width: 90%;
                max-width: 480px;
                border-radius: 8px;
                border: 1px solid #64748B;
                box-shadow: 0 15px 40px rgba(0,0,0,0.5);
                overflow: hidden;
                font-family: 'Segoe UI', Tahoma, sans-serif;
            }

            /* MODAL E JANELA DO PLOTTER SERIAL DA ARDUINO IDE */
            .ard-plotter-modal {
                position: fixed;
                top: 0; left: 0; width: 100vw; height: 100vh;
                background: rgba(15, 23, 42, 0.85);
                backdrop-filter: blur(5px);
                z-index: 2500;
                display: none;
                align-items: center;
                justify-content: center;
                padding: 16px;
            }
            .ard-plotter-modal.open {
                display: flex;
            }
            .ard-plotter-window {
                background: #0F172A;
                border: 2px solid #00979D;
                border-radius: 12px;
                box-shadow: 0 20px 60px rgba(0,0,0,0.85), 0 0 35px rgba(0, 151, 157, 0.45);
                width: 95%;
                max-width: 880px;
                overflow: hidden;
                font-family: 'Segoe UI', Tahoma, sans-serif;
                display: flex;
                flex-direction: column;
                animation: ardPopUp 0.25s ease-out;
            }
            .ard-plotter-titlebar {
                background: #006468;
                color: white;
                padding: 8px 14px;
                font-size: 0.85rem;
                font-weight: 700;
                display: flex;
                align-items: center;
                justify-content: space-between;
                border-bottom: 1px solid rgba(255,255,255,0.15);
            }
            .ard-plotter-ribbon {
                background: #008184;
                padding: 8px 14px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 10px;
                flex-wrap: wrap;
                border-bottom: 1px solid rgba(0,0,0,0.25);
            }
            .ard-plotter-control-item {
                display: flex;
                align-items: center;
                gap: 6px;
                font-size: 0.82rem;
                color: white;
            }
            .ard-plotter-select {
                background: #005F63;
                border: 1px solid rgba(255,255,255,0.3);
                color: white;
                border-radius: 6px;
                padding: 4px 8px;
                font-size: 0.82rem;
                font-weight: 600;
                outline: none;
                cursor: pointer;
            }
            .ard-plotter-select option {
                background: #1E293B;
                color: white;
            }
            .ard-plotter-btn {
                background: #005F63;
                border: 1px solid rgba(255,255,255,0.3);
                color: white;
                border-radius: 6px;
                padding: 5px 12px;
                font-size: 0.82rem;
                font-weight: 700;
                cursor: pointer;
                transition: all 0.15s;
                display: inline-flex;
                align-items: center;
                gap: 6px;
            }
            .ard-plotter-btn:hover {
                background: #004D50;
                border-color: white;
            }
            .ard-plotter-btn.active {
                background: #F59E0B;
                color: #0F172A;
                border-color: #FBBF24;
            }
            .ard-plotter-legend {
                background: #1E293B;
                padding: 8px 16px;
                display: flex;
                align-items: center;
                gap: 14px;
                flex-wrap: wrap;
                border-bottom: 1px solid #334155;
                font-size: 0.82rem;
            }
            .ard-channel-chip {
                display: inline-flex;
                align-items: center;
                gap: 6px;
                padding: 3px 10px;
                border-radius: 20px;
                font-family: 'Consolas', monospace;
                font-weight: 700;
                background: rgba(0,0,0,0.35);
                border: 1px solid rgba(255,255,255,0.1);
            }
            .ard-channel-dot {
                width: 10px;
                height: 10px;
                border-radius: 50%;
                display: inline-block;
            }
            .ard-plotter-canvas-container {
                position: relative;
                background: #090D16;
                padding: 10px 14px 6px;
            }
            .ard-plotter-bottom-panel {
                background: #1E293B;
                padding: 12px 16px;
                border-top: 1px solid #334155;
            }

            /* MODAL DO MONITOR SERIAL REALISTA */
            .ard-monitor-modal {
                position: fixed;
                top: 0; left: 0; width: 100vw; height: 100vh;
                background: rgba(15, 23, 42, 0.8);
                backdrop-filter: blur(4px);
                z-index: 2400;
                display: none;
                align-items: center;
                justify-content: center;
                padding: 16px;
            }
            .ard-monitor-modal.open {
                display: flex;
            }
            .ard-monitor-window {
                background: #FFFFFF;
                color: #1E293B;
                border: 2px solid #00979D;
                border-radius: 10px;
                box-shadow: 0 20px 60px rgba(0,0,0,0.75);
                width: 95%;
                max-width: 720px;
                overflow: hidden;
                font-family: 'Segoe UI', Tahoma, sans-serif;
                display: flex;
                flex-direction: column;
                animation: ardPopUp 0.25s ease-out;
            }
            .ard-monitor-titlebar {
                background: #006468;
                color: white;
                padding: 7px 12px;
                font-size: 0.82rem;
                font-weight: 700;
                display: flex;
                align-items: center;
                justify-content: space-between;
            }
            .ard-monitor-sendbar {
                background: #F8FAFC;
                padding: 8px 12px;
                display: flex;
                gap: 8px;
                border-bottom: 1px solid #E2E8F0;
            }
            .ard-monitor-input {
                flex: 1;
                padding: 6px 10px;
                border: 1px solid #CBD5E1;
                border-radius: 4px;
                font-family: 'Consolas', monospace;
                font-size: 0.85rem;
                outline: none;
            }
            .ard-monitor-input:focus {
                border-color: #00979D;
            }
            .ard-monitor-sendbtn {
                background: #00979D;
                color: white;
                border: none;
                border-radius: 4px;
                padding: 6px 16px;
                font-weight: 700;
                font-size: 0.82rem;
                cursor: pointer;
            }
            .ard-monitor-body {
                background: #FFFFFF;
                color: #0F172A;
                padding: 10px 14px;
                height: 220px;
                max-height: 250px;
                overflow-y: auto;
                font-family: 'Consolas', 'Courier New', monospace;
                font-size: 0.85rem;
                line-height: 1.5;
                white-space: pre-wrap;
            }
            .ard-monitor-footer {
                background: #F1F5F9;
                border-top: 1px solid #E2E8F0;
                padding: 6px 12px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                font-size: 0.8rem;
                color: #475569;
                flex-wrap: wrap;
                gap: 8px;
            }
        </style>

        <div class="ard-wrapper">
            <!-- Título e Subtítulo da Aula -->
            <div style="text-align:center;margin-bottom:15px;">
                <span style="background:rgba(239,68,68,0.2);color:#F87171;padding:6px 16px;border-radius:20px;font-size:0.85rem;font-weight:900;text-transform:uppercase;letter-spacing:1px;border:1px solid rgba(239,68,68,0.4);">
                    Aula 8 • Trilha de Robótica
                </span>
                <h1 style="color:white;font-family:'Fredoka One',cursive;font-size:2.2rem;margin:10px 0 6px;">
                    Laboratório do Arduino IDE, Drivers & Conexão
                </h1>
                <p style="color:#94A3B8;max-width:750px;margin:0 auto;font-size:0.95rem;">
                    Simulador interativo completo da Arduino IDE: teste a compilação (Verificar), gravação (Carregar), menu Ferramentas dinâmico e explore o Guia para Iniciantes!
                </p>
            </div>

            <!-- Navegação em Abas Pedagógicas -->
            <div class="tabs">
                <button class="tab active" data-tab="ard-tab-install"><i class="fa-solid fa-download"></i> 1. Baixar a IDE</button>
                <button class="tab" data-tab="ard-tab-driver"><i class="fa-solid fa-plug"></i> 2. Drivers & Gerenciador</button>
                <button class="tab" data-tab="ard-tab-port"><i class="fa-solid fa-plug-circle-bolt"></i> 3. Bancada & Conexão USB</button>
                <button class="tab" data-tab="ard-tab-gui"><i class="fa-solid fa-laptop-code"></i> 4. Simulador da IDE & Guia</button>
                <button class="tab" data-tab="ard-tab-upload"><i class="fa-solid fa-rotate-left"></i> 5. Enviar & Zerar Placa</button>
                <button class="tab" data-tab="ard-tab-quiz"><i class="fa-solid fa-brain"></i> 6. Quiz Maker</button>
            </div>

            <!-- ================= ABA 1: BAIXAR A ARDUINO IDE ================= -->
            <div class="panel active" id="ard-tab-install">
                <div style="display:flex;align-items:center;gap:12px;margin-bottom:15px;">
                    <span style="background:#00979d;color:white;width:44px;height:44px;border-radius:14px;display:flex;align-items:center;justify-content:center;font-size:1.4rem;"><i class="fa-solid fa-download"></i></span>
                    <div>
                        <h2 style="color:white;font-family:'Fredoka One';margin:0;">Como Baixar e Instalar o Arduino IDE Oficial</h2>
                        <p style="color:#94A3B8;margin:0;font-size:0.9rem;">O software é 100% gratuito e de código aberto (Open Source). Veja onde obter:</p>
                    </div>
                </div>

                <div class="ard-grid-3">
                    <div class="ard-card" style="border-top:4px solid #00979d;">
                        <h4 style="color:#00979d;margin-top:0;"><i class="fa-solid fa-laptop"></i> 1. O que é a IDE?</h4>
                        <p style="color:#CBD5E1;font-size:0.88rem;line-height:1.5;">
                            IDE significa <em>Integrated Development Environment</em> (Ambiente Integrado de Desenvolvimento). É o programa onde digitamos os códigos em C/C++ e enviamos para o cérebro do Arduino!
                        </p>
                    </div>
                    <div class="ard-card" style="border-top:4px solid #34D399;">
                        <h4 style="color:#34D399;margin-top:0;"><i class="fa-solid fa-heart"></i> 2. É 100% Gratuito!</h4>
                        <p style="color:#CBD5E1;font-size:0.88rem;line-height:1.5;">
                            A Arduino IDE é um software livre. Na página oficial há uma tela solicitando doação voluntária. <strong>Você não é obrigado a pagar nada:</strong> basta clicar no botão <b>JUST DOWNLOAD</b>!
                        </p>
                    </div>
                    <div class="ard-card" style="border-top:4px solid #F59E0B;">
                        <h4 style="color:#F59E0B;margin-top:0;"><i class="fa-solid fa-microchip"></i> 3. Drivers Inclusos</h4>
                        <p style="color:#CBD5E1;font-size:0.88rem;line-height:1.5;">
                            Durante a instalação oficial, marque a opção <b>"Install USB driver"</b>. Isso instala os certificados necessários para que o Windows reconheça sua placa automaticamente ao conectar o cabo.
                        </p>
                    </div>
                </div>

                <!-- DOWNLOAD HERO -->
                <div class="ard-download-hero">
                    <h3 style="color:#38BDF8;font-family:'Fredoka One';font-size:1.5rem;margin:0 0 10px;">
                        Pronto para baixar no seu computador?
                    </h3>
                    <p style="color:#E2E8F0;max-width:650px;margin:0 auto 20px;font-size:0.95rem;">
                        Acesse a página oficial do Arduino e escolha a versão para Windows (Win 10/11 ou instalador legado 1.8.x):
                    </p>
                    <a href="https://www.arduino.cc/en/software" target="_blank" rel="noopener noreferrer" class="ard-real-btn" onclick="if(typeof playSound==='function')playSound('click');">
                        <i class="fa-solid fa-cloud-arrow-down"></i> Acessar Site Oficial: www.arduino.cc/en/software
                        <i class="fa-solid fa-arrow-up-right-from-square" style="font-size:0.85rem;"></i>
                    </a>
                    <div style="margin-top:14px;color:#94A3B8;font-size:0.82rem;">
                        💡 <b>Dica Maker:</b> Ao abrir a página oficial, clique no botão cinza <b>"JUST DOWNLOAD"</b> para baixar diretamente de graça!
                    </div>
                </div>

                <!-- DESAFIO PRÁTICO NA CARTEIRA -->
                <div class="ard-desk-challenge">
                    <strong>🖐️ Desafio Prático na Sua Carteira:</strong><br>
                    1️⃣ Abra seu navegador e confira o site oficial do Arduino.<br>
                    2️⃣ Pegue seu cabo USB do kit e deixe-o pronto ao lado do seu computador.<br>
                    3️⃣ Avance para a <b>Aba 2</b> para aprender como verificar se sua placa foi reconhecida no Gerenciador de Dispositivos!
                </div>
            </div>

            <!-- ================= ABA 2: DRIVERS & GERENCIADOR DE DISPOSITIVOS ================= -->
            <div class="panel" id="ard-tab-driver">
                <div style="display:flex;align-items:center;gap:12px;margin-bottom:15px;">
                    <span style="background:#38BDF8;color:#0F172A;width:44px;height:44px;border-radius:14px;display:flex;align-items:center;justify-content:center;font-size:1.4rem;"><i class="fa-solid fa-plug"></i></span>
                    <div>
                        <h2 style="color:white;font-family:'Fredoka One';margin:0;">Como Instalar o Driver & Identificar a Porta COMx no Windows</h2>
                        <p style="color:#94A3B8;margin:0;font-size:0.9rem;">Simulador interativo do Gerenciador de Dispositivos com detecção e propriedades reais.</p>
                    </div>
                </div>

                <div class="ard-card" style="border-left:4px solid #38BDF8;">
                    <h3 style="color:#38BDF8;margin-top:0;font-size:1.15rem;display:flex;align-items:center;gap:8px;">
                        <i class="fa-solid fa-magnifying-glass-location"></i> Como os Alunos Abrem o Gerenciador de Dispositivos no Windows:
                    </h3>
                    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:14px;margin-top:10px;">
                        <div style="background:#1E293B;padding:12px;border-radius:10px;font-size:0.88rem;">
                            <strong style="color:#FBBF24;">Método 1 (Mais Rápido):</strong><br>
                            Pressione as teclas <kbd style="background:#0F172A;border:1px solid #475569;padding:2px 6px;border-radius:4px;color:#38BDF8;">Windows + X</kbd> no teclado e clique em <b>Gerenciador de Dispositivos</b> no menu que surgir!
                        </div>
                        <div style="background:#1E293B;padding:12px;border-radius:10px;font-size:0.88rem;">
                            <strong style="color:#34D399;">Método 2 (Via Executar):</strong><br>
                            Pressione <kbd style="background:#0F172A;border:1px solid #475569;padding:2px 6px;border-radius:4px;color:#38BDF8;">Windows + R</kbd>, digite <code style="color:#F87171;">devmgmt.msc</code> e dê <b>Enter</b>!
                        </div>
                    </div>
                </div>

                <!-- BARRA DE CONTROLE DA SIMULAÇÃO DO WINDOWS -->
                <div style="background:#0F172A;padding:14px 18px;border-radius:14px;border:1px solid #334155;margin-bottom:14px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;">
                    <div style="font-size:0.88rem;color:#E2E8F0;">
                        🎮 <b>Simulação Windows:</b> Teste plugar o cabo e alternar o status do driver:
                    </div>
                    <div style="display:flex;gap:8px;flex-wrap:wrap;">
                        <button onclick="ard_toggleUsbCable()" id="ard-cable-btn" style="background:#0284C7;color:white;border:none;padding:7px 14px;border-radius:8px;font-weight:bold;font-size:0.82rem;cursor:pointer;">
                            <span>🔌 Desconectar Cabo USB</span>
                        </button>
                        <button onclick="ard_simDriverStatus(false)" id="btn-driver-missing" style="background:#334155;color:#FBBF24;border:1px solid #F59E0B;padding:7px 14px;border-radius:8px;font-weight:bold;font-size:0.82rem;cursor:pointer;">
                            Simular Placa SEM Driver ⚠️
                        </button>
                        <button onclick="ard_simDriverStatus(true)" id="btn-driver-installed" style="background:#064E3B;color:#34D399;border:1px solid #10B981;padding:7px 14px;border-radius:8px;font-weight:bold;font-size:0.82rem;cursor:pointer;">
                            Simular Driver Instalado ✔
                        </button>
                    </div>
                </div>

                <!-- SIMULADOR REALISTA DO GERENCIADOR DE DISPOSITIVOS -->
                <div class="ard-devmgmt-window open" id="ard-devmgmt-box">
                    <div class="ard-devmgmt-titlebar">
                        <span><i class="fa-solid fa-microchip" style="color:#0284C7;margin-right:6px;"></i> Gerenciador de Dispositivos</span>
                        <div class="ard-devmgmt-win-controls">
                            <button class="ard-devmgmt-win-btn">—</button>
                            <button class="ard-devmgmt-win-btn">▢</button>
                            <button class="ard-devmgmt-win-btn close" onclick="ard_closeDevMgmtWindow()">✕</button>
                        </div>
                    </div>
                    <div class="ard-devmgmt-menubar">
                        <span>Arquivo</span>
                        <span onclick="ard_scanHardwareChanges()">Ação</span>
                        <span>Exibir</span>
                        <span>Ajuda</span>
                    </div>
                    <div class="ard-devmgmt-toolbar">
                        <button class="ard-devmgmt-toolbtn" onclick="ard_scanHardwareChanges()" title="Verificar se há alterações de hardware">
                            <i class="fa-solid fa-magnifying-glass" style="color:#0284C7;"></i>
                            <span>Verificar alterações de hardware</span>
                        </button>
                        <button class="ard-devmgmt-toolbtn" onclick="ard_openDriverModal()" title="Atualizar driver...">
                            <i class="fa-solid fa-download" style="color:#10B981;"></i>
                            <span>Atualizar driver...</span>
                        </button>
                        <button class="ard-devmgmt-toolbtn" onclick="ard_openDeviceProperties()" title="Propriedades do Dispositivo">
                            <i class="fa-solid fa-list-check" style="color:#6366F1;"></i>
                            <span>Propriedades</span>
                        </button>
                    </div>

                    <!-- BARRA DE SCAN ANIMADA -->
                    <div id="ard-scan-progress" style="display:none;background:#EFF6FF;padding:6px 12px;border-bottom:1px solid #BFDBFE;color:#1E40AF;font-size:0.8rem;align-items:center;gap:8px;">
                        <i class="fa-solid fa-spinner fa-spin"></i> Verificando dispositivos Plug and Play conectados...
                    </div>

                    <!-- ÁRVORE DE DISPOSITIVOS -->
                    <div class="ard-devmgmt-tree">
                        <div class="ard-devmgmt-item" style="font-weight:bold;">
                            <i class="fa-solid fa-desktop" style="color:#475569;"></i> DESKTOP-MAKER-UNO
                        </div>
                        <div class="ard-devmgmt-item" style="padding-left:24px;">
                            <i class="fa-solid fa-display" style="color:#64748B;"></i> Adaptadores de vídeo
                        </div>
                        <div class="ard-devmgmt-item" style="padding-left:24px;">
                            <i class="fa-solid fa-network-wired" style="color:#64748B;"></i> Adaptadores de rede
                        </div>
                        <div class="ard-devmgmt-item" style="padding-left:24px;">
                            <i class="fa-solid fa-keyboard" style="color:#64748B;"></i> Teclados
                        </div>

                        <!-- CATEGORIA OUTROS DISPOSITIVOS (SEM DRIVER) -->
                        <div id="ard-devmgmt-other" style="display:none;">
                            <div class="ard-devmgmt-item" style="padding-left:24px;color:#D97706;font-weight:bold;">
                                <span>▼</span> <i class="fa-solid fa-triangle-exclamation" style="color:#F59E0B;"></i> Outros dispositivos
                            </div>
                            <div class="ard-devmgmt-item" style="padding-left:44px;color:#B45309;" onclick="ard_openDriverModal()">
                                <i class="fa-solid fa-triangle-exclamation" style="color:#F59E0B;"></i>
                                <span>⚠️ USB2.0-Serial (Driver não instalado!)</span>
                            </div>
                        </div>

                        <!-- CATEGORIA PORTAS COM E LPT (COM DRIVER) -->
                        <div>
                            <div class="ard-devmgmt-item" style="padding-left:24px;font-weight:bold;color:#0F172A;" onclick="ard_togglePortsFolder()">
                                <span id="ard-ports-arrow">▼</span> <i class="fa-solid fa-plug" style="color:#0284C7;"></i> Portas (COM e LPT)
                            </div>
                            <div id="ard-ports-children">
                                <div class="ard-devmgmt-item selected" id="ard-dev-com3" style="padding-left:44px;" ondblclick="ard_openDeviceProperties()" onclick="this.classList.toggle('selected')">
                                    <i class="fa-solid fa-microchip" style="color:#059669;"></i>
                                    <span>🔌 <b>Arduino Uno (COM3)</b> — [Pronto para Usar]</span>
                                </div>
                                <div class="ard-devmgmt-item" id="ard-dev-empty" style="padding-left:44px;display:none;color:#94A3B8;font-style:italic;">
                                    (Nenhuma porta serial ativa detectada)
                                </div>
                            </div>
                        </div>

                        <div class="ard-devmgmt-item" style="padding-left:24px;">
                            <i class="fa-brands fa-usb" style="color:#64748B;"></i> Controladores USB (Universal Serial Bus)
                        </div>
                    </div>

                    <div class="ard-devmgmt-statusbar">
                        <span>Status: 1 dispositivo selecionado</span>
                        <span id="ard-win-com-badge" style="font-weight:bold;color:#059669;">COM3</span>
                    </div>
                </div>

                <!-- DESAFIO PRÁTICO NA CARTEIRA -->
                <div class="ard-desk-challenge">
                    <strong>🖐️ Desafio Prático na Sua Carteira:</strong><br>
                    1️⃣ Pressione <b>Windows + X</b> no seu teclado físico e abra o <b>Gerenciador de Dispositivos</b>.<br>
                    2️⃣ Localize a categoria <b>Portas (COM e LPT)</b> e veja o número exato entre parênteses (ex: COM3, COM4 ou COM7).<br>
                    3️⃣ Se aparecer <b>⚠️ USB2.0-Serial</b> em Outros Dispositivos, instale o driver oficial do chip CH340!<br>
                    4️⃣ Guarde esse número: ele será o endereço que você vai selecionar na IDE!
                </div>
            </div>

            <!-- ================= ABA 3: BANCADA DE HARDWARE & CONEXÃO USB ================= -->
            <div class="panel" id="ard-tab-port">
                <div style="display:flex;align-items:center;gap:12px;margin-bottom:15px;">
                    <span style="background:#0284C7;color:white;width:44px;height:44px;border-radius:14px;display:flex;align-items:center;justify-content:center;font-size:1.4rem;">
                        <i class="fa-solid fa-plug-circle-bolt"></i>
                    </span>
                    <div>
                        <h2 style="color:white;font-family:'Fredoka One';margin:0;">3. Bancada Maker: Conexão Física do Arduino &amp; Cabo USB</h2>
                        <p style="color:#94A3B8;margin:0;font-size:0.9rem;">Simulação visual da bancada física: veja o cabo USB ligando o computador ao Arduino UNO, energizando o circuito (5V) e estabelecendo a comunicação serial!</p>
                    </div>
                </div>

                <!-- BANCADA MAKER INTERATIVA COM PC, CABO USB E ARDUINO UNO -->
                <div class="ard-bench-wrap">
                    <!-- Barra de Telemetria de Conexão Superior -->
                    <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;margin-bottom:14px;background:rgba(15,23,42,0.8);padding:10px 16px;border-radius:12px;border:1px solid #334155;">
                        <div style="display:flex;align-items:center;gap:14px;flex-wrap:wrap;">
                            <span style="font-size:0.82rem;font-weight:bold;color:#94A3B8;">
                                ⚡ TENSÃO: <strong id="ard-bench-volt-label" style="color:#10B981;">5.0V USB (Ativo)</strong>
                            </span>
                            <span style="font-size:0.82rem;font-weight:bold;color:#94A3B8;">
                                🔌 CABO: <strong id="ard-bench-cable-label" style="color:#38BDF8;">Conectado (Tipo A ➔ B)</strong>
                            </span>
                            <span style="font-size:0.82rem;font-weight:bold;color:#94A3B8;">
                                📡 PORTA SERIAL: <strong id="ard-bench-port-label" style="color:#34D399;">COM3 (Arduino Uno)</strong>
                            </span>
                        </div>
                        <div style="display:flex;gap:8px;flex-wrap:wrap;">
                            <button onclick="ard_toggleBenchCable()" id="ard-bench-toggle-btn" class="ard-bench-btn primary">
                                <i class="fa-solid fa-plug"></i> <span id="ard-bench-toggle-text">Desconectar Cabo USB</span>
                            </button>
                            <button onclick="ard_benchPingTest()" id="ard-bench-ping-btn" class="ard-bench-btn">
                                <i class="fa-solid fa-satellite-dish"></i> Testar Sinal Serial
                            </button>
                            <button onclick="ard_benchReset()" id="ard-bench-reset-btn" class="ard-bench-btn">
                                <i class="fa-solid fa-rotate-right"></i> Apertar RESET
                            </button>
                        </div>
                    </div>

                    <!-- TAPETE DA BANCADA: COMPUTADOR + CABO USB + ARDUINO UNO -->
                    <div class="ard-bench-mat">
                        <svg viewBox="0 0 960 410" style="width:100%;height:auto;display:block;overflow:visible;" id="ard-bench-svg">
                            <defs>
                                <!-- Gradientes da Bancada -->
                                <linearGradient id="gradLaptopBody" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stop-color="#334155"/>
                                    <stop offset="100%" stop-color="#0F172A"/>
                                </linearGradient>
                                <linearGradient id="gradLaptopScreen" x1="0%" y1="0%" x2="0%" y2="100%">
                                    <stop offset="0%" stop-color="#0F172A"/>
                                    <stop offset="100%" stop-color="#021B2B"/>
                                </linearGradient>
                                <linearGradient id="gradArduinoPcb" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stop-color="#008184"/>
                                    <stop offset="100%" stop-color="#005A5D"/>
                                </linearGradient>
                                <linearGradient id="gradUsbMetal" x1="0%" y1="0%" x2="0%" y2="100%">
                                    <stop offset="0%" stop-color="#E2E8F0"/>
                                    <stop offset="50%" stop-color="#94A3B8"/>
                                    <stop offset="100%" stop-color="#64748B"/>
                                </linearGradient>
                                <filter id="glowGreen" x="-20%" y="-20%" width="140%" height="140%">
                                    <feGaussianBlur stdDeviation="3" result="blur" />
                                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                                </filter>
                                <filter id="glowYellow" x="-20%" y="-20%" width="140%" height="140%">
                                    <feGaussianBlur stdDeviation="3" result="blur" />
                                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                                </filter>
                            </defs>

                            <!-- ================= 1. O COMPUTADOR / LAPTOP (LADO ESQUERDO) ================= -->
                            <!-- Base / Teclado do Laptop -->
                            <polygon points="30,340 310,340 280,310 60,310" fill="url(#gradLaptopBody)" stroke="#475569" stroke-width="2"/>
                            <!-- Touchpad -->
                            <rect x="145" y="318" width="50" height="16" rx="2" fill="#1E293B" stroke="#475569" stroke-width="1"/>
                            <!-- Tampa / Tela Aberta do Laptop -->
                            <rect x="50" y="80" width="230" height="230" rx="8" fill="#1E293B" stroke="#64748B" stroke-width="3"/>
                            <!-- Painel da Tela (Display) -->
                            <rect x="58" y="88" width="214" height="200" rx="4" fill="url(#gradLaptopScreen)" stroke="#334155" stroke-width="1.5"/>

                            <!-- Tela do Sistema Operacional no Laptop -->
                            <rect x="62" y="92" width="206" height="22" fill="#0F172A" stroke="#334155" stroke-width="1"/>
                            <text x="70" y="107" fill="#38BDF8" font-size="9" font-family="'Segoe UI', sans-serif" font-weight="bold">🖥️ Sistema Operacional (Windows)</text>

                            <!-- Painel Central de Status da Conexão USB -->
                            <rect x="62" y="116" width="206" height="120" fill="#080E1E" stroke="#1E293B" stroke-width="1"/>

                            <!-- Estado 1: Conectado (bench-screen-conn) -->
                            <g id="bench-screen-conn">
                                <rect x="72" y="124" width="186" height="26" rx="4" fill="#064E3B" stroke="#10B981" stroke-width="1"/>
                                <circle cx="86" cy="137" r="4.5" fill="#34D399" filter="url(#glowGreen)"/>
                                <text x="96" y="141" fill="#A7F3D0" font-size="9" font-family="'Segoe UI', sans-serif" font-weight="bold">CABO USB CONECTADO (5V)</text>

                                <text x="74" y="166" fill="#94A3B8" font-size="8" font-family="'Segoe UI', sans-serif">Placa:</text>
                                <text x="110" y="166" fill="#FFFFFF" font-size="8.5" font-family="'Segoe UI', sans-serif" font-weight="bold">Arduino UNO R3</text>

                                <text x="74" y="182" fill="#94A3B8" font-size="8" font-family="'Segoe UI', sans-serif">Tensão:</text>
                                <text x="118" y="182" fill="#10B981" font-size="8.5" font-family="'Segoe UI', sans-serif" font-weight="bold">5.0V CC (Alimentado)</text>

                                <text x="74" y="198" fill="#94A3B8" font-size="8" font-family="'Segoe UI', sans-serif">Porta:</text>
                                <text x="108" y="198" fill="#38BDF8" font-size="8.5" font-family="'Segoe UI', sans-serif" font-weight="bold" id="bench-screen-port-txt">COM3 (Ativa e Pronta)</text>

                                <rect x="72" y="208" width="186" height="20" rx="3" fill="#0F172A" stroke="#0284C7" stroke-width="0.8"/>
                                <text x="165" y="221" text-anchor="middle" fill="#BAE6FD" font-size="7.5" font-family="'Segoe UI', sans-serif" font-weight="bold">✔ Pronto para programar na Aba 4</text>
                            </g>

                            <!-- Estado 2: Desconectado (bench-screen-disc) -->
                            <g id="bench-screen-disc" style="display:none;">
                                <rect x="72" y="124" width="186" height="26" rx="4" fill="#7F1D1D" stroke="#EF4444" stroke-width="1"/>
                                <circle cx="86" cy="137" r="4.5" fill="#F87171"/>
                                <text x="96" y="141" fill="#FECACA" font-size="9" font-family="'Segoe UI', sans-serif" font-weight="bold">CABO DESCONECTADO</text>

                                <text x="165" y="172" text-anchor="middle" fill="#94A3B8" font-size="8.5" font-family="'Segoe UI', sans-serif">Nenhum dispositivo USB detectado.</text>
                                <text x="165" y="190" text-anchor="middle" fill="#FCA5A5" font-size="8.5" font-family="'Segoe UI', sans-serif">Tensão no circuito: 0.0V (Desligado)</text>

                                <rect x="72" y="206" width="186" height="22" rx="3" fill="#78350F" stroke="#F59E0B" stroke-width="1"/>
                                <text x="165" y="221" text-anchor="middle" fill="#FDE68A" font-size="8" font-family="'Segoe UI', sans-serif" font-weight="bold">👉 Clique em "Conectar Cabo USB"!</text>
                            </g>

                            <!-- Barra de Notificação Windows no rodapé da tela -->
                            <rect x="62" y="238" width="206" height="46" fill="#0F172A" stroke="#1E293B" stroke-width="1"/>
                            <g id="bench-laptop-notif-connected">
                                <circle cx="74" cy="252" r="5" fill="#10B981" filter="url(#glowGreen)"/>
                                <text x="84" y="255" fill="#34D399" font-size="8.5" font-family="'Segoe UI', sans-serif" font-weight="bold">Dispositivo USB Detectado</text>
                                <text x="74" y="272" fill="#E2E8F0" font-size="8" font-family="'Segoe UI', sans-serif">Porta: <tspan fill="#38BDF8" font-weight="bold" id="bench-notif-port-txt">COM3 (Arduino Uno)</tspan></text>
                            </g>
                            <g id="bench-laptop-notif-disconnected" style="display:none;">
                                <circle cx="74" cy="252" r="5" fill="#EF4444"/>
                                <text x="84" y="255" fill="#F87171" font-size="8.5" font-family="'Segoe UI', sans-serif" font-weight="bold">Nenhum Dispositivo</text>
                                <text x="74" y="272" fill="#94A3B8" font-size="8" font-family="'Segoe UI', sans-serif">Conecte o cabo USB para iniciar!</text>
                            </g>

                            <!-- Rótulo do Laptop -->
                            <text x="165" y="362" text-anchor="middle" fill="#94A3B8" font-size="11" font-weight="bold">COMPUTADOR (WINDOWS)</text>

                            <!-- Porta USB Tipo A Fêmea na lateral do notebook -->
                            <rect x="280" y="216" width="10" height="24" rx="2" fill="url(#gradUsbMetal)" stroke="#334155" stroke-width="1.5"/>
                            <rect x="284" y="220" width="4" height="16" fill="#0F172A"/>

                            <!-- ================= 2. O CABO USB AZUL OFICIAL (DO CENTRO) ================= -->
                            <!-- Plug USB Tipo A macho (fixo no PC) -->
                            <rect x="290" y="220" width="22" height="16" rx="2" fill="url(#gradUsbMetal)" stroke="#475569" stroke-width="1"/>
                            <!-- Relevo azul do conector A -->
                            <rect x="312" y="217" width="26" height="22" rx="3" fill="#0284C7" stroke="#38BDF8" stroke-width="1.5"/>
                            <text x="325" y="231" text-anchor="middle" fill="#BAE6FD" font-size="8" font-weight="bold">USB-A</text>

                            <!-- Trajeto do Cabo Flexível Azul -->
                            <!-- Linha de sombra do cabo -->
                            <path d="M 338 228 C 410 228, 430 115, 500 115" fill="none" stroke="#0B132B" stroke-width="14" stroke-linecap="round"/>
                            <!-- Corpo do Cabo Azul -->
                            <path id="bench-cable-body" d="M 338 228 C 410 228, 430 115, 500 115" fill="none" stroke="#0284C7" stroke-width="10" stroke-linecap="round"/>
                            <!-- Linha de elétrons e dados pulsantes -->
                            <path id="bench-cable-pulse" class="ard-cable-pulse" d="M 338 228 C 410 228, 430 115, 500 115" fill="none" stroke="#38BDF8" stroke-width="3" stroke-dasharray="8 12" stroke-linecap="round"/>

                            <!-- Grupo do Conector USB Tipo B Macho (Que se Move ao Desconectar) -->
                            <g id="bench-cable-head" transform="translate(0, 0)" style="transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);">
                                <!-- Relevo azul do conector B -->
                                <rect x="500" y="103" width="28" height="24" rx="3" fill="#0284C7" stroke="#38BDF8" stroke-width="1.5"/>
                                <text x="514" y="118" text-anchor="middle" fill="#BAE6FD" font-size="8" font-weight="bold">USB-B</text>
                                <!-- Conector metálico quadrado Tipo B (chanfrado no topo) -->
                                <polygon points="528,105 548,108 548,122 528,125" fill="url(#gradUsbMetal)" stroke="#64748B" stroke-width="1"/>
                                <rect x="544" y="111" width="4" height="8" fill="#1E293B"/>
                            </g>

                            <!-- Indicador de Desconexão / Seta Pedagógica quando desplugado -->
                            <g id="bench-plug-hint" style="display:none;">
                                <rect x="440" y="55" width="120" height="26" rx="6" fill="#F59E0B" filter="url(#glowYellow)"/>
                                <text x="500" y="72" text-anchor="middle" fill="#0F172A" font-size="10" font-weight="bold">👉 Encaixe Aqui!</text>
                            </g>

                            <!-- ================= 3. A PLACA ARDUINO UNO R3 DETALHADA (LADO DIREITO) ================= -->
                            <g id="bench-arduino-board" transform="translate(555, 30)">
                                <!-- PCB Azul Arduino UNO (370 x 280) -->
                                <path d="M 0 15 
                                         L 15 0 
                                         L 345 0 
                                         L 360 15 
                                         L 360 265 
                                         L 345 280 
                                         L 15 280 
                                         L 0 265 
                                         Z" 
                                      fill="url(#gradArduinoPcb)" stroke="#004D50" stroke-width="3"/>

                                <!-- Furos de Montagem nos 4 cantos -->
                                <circle cx="22" cy="22" r="7" fill="#0F172A" stroke="#CBD5E1" stroke-width="2"/>
                                <circle cx="338" cy="22" r="7" fill="#0F172A" stroke="#CBD5E1" stroke-width="2"/>
                                <circle cx="22" cy="258" r="7" fill="#0F172A" stroke="#CBD5E1" stroke-width="2"/>
                                <circle cx="338" cy="258" r="7" fill="#0F172A" stroke="#CBD5E1" stroke-width="2"/>

                                <!-- Porta Fêmea USB Tipo B (Prateada Metálica Quadrada) -->
                                <g id="bench-ard-usb-port">
                                    <rect x="-10" y="72" width="46" height="40" rx="3" fill="url(#gradUsbMetal)" stroke="#334155" stroke-width="2"/>
                                    <!-- Abertura chanfrada interna -->
                                    <polygon points="2,80 28,80 34,88 34,104 28,108 2,108" fill="#0B132B" stroke="#475569" stroke-width="1.5"/>
                                    <!-- 4 Pinos Dourados Internos (VCC, D-, D+, GND) -->
                                    <line x1="8" y1="88" x2="24" y2="88" stroke="#FBBF24" stroke-width="1.5"/>
                                    <line x1="8" y1="94" x2="24" y2="94" stroke="#FBBF24" stroke-width="1.5"/>
                                    <line x1="8" y1="100" x2="24" y2="100" stroke="#FBBF24" stroke-width="1.5"/>
                                    <text x="18" y="66" text-anchor="middle" fill="#FFFFFF" font-size="8" font-weight="bold">USB 5V</text>
                                </g>

                                <!-- Jack de Alimentação DC P4 (Preto) -->
                                <rect x="-12" y="180" width="54" height="42" rx="4" fill="#0F172A" stroke="#334155" stroke-width="2"/>
                                <circle cx="22" cy="201" r="9" fill="#1E293B" stroke="#64748B" stroke-width="2"/>
                                <circle cx="22" cy="201" r="3" fill="#E2E8F0"/>
                                <text x="18" y="234" text-anchor="middle" fill="#94A3B8" font-size="7.5" font-weight="bold">POWER 7-12V</text>

                                <!-- Botão Físico RESET Vermelho (Clicável!) -->
                                <g onclick="ard_benchReset()" style="cursor:pointer;" title="Clique para apertar o RESET!">
                                    <rect x="56" y="16" width="26" height="26" rx="4" fill="url(#gradUsbMetal)" stroke="#334155" stroke-width="1.5"/>
                                    <circle cx="69" cy="29" r="8" fill="#EF4444" stroke="#B91C1C" stroke-width="1.5"/>
                                    <text x="69" y="52" text-anchor="middle" fill="#FFFFFF" font-size="8" font-weight="bold">RESET</text>
                                </g>

                                <!-- Cristal Oscilador 16.000 MHz -->
                                <rect x="94" y="96" width="16" height="32" rx="8" fill="url(#gradUsbMetal)" stroke="#64748B" stroke-width="1.5"/>
                                <text x="102" y="138" text-anchor="middle" fill="#CBD5E1" font-size="7" font-weight="bold">16.000</text>

                                <!-- Chip Conversor USB/Serial ATmega16U2 -->
                                <rect x="80" y="60" width="28" height="28" rx="2" fill="#0F172A" stroke="#334155" stroke-width="1.5"/>
                                <circle cx="85" cy="65" r="1.5" fill="#64748B"/>
                                <text x="94" y="76" text-anchor="middle" fill="#64748B" font-size="5" font-family="'Consolas', monospace">16U2</text>

                                <!-- Microcontrolador Principal ATmega328P DIP-28 -->
                                <g id="bench-atmega328p">
                                    <!-- Corpo do chip DIP longo preto -->
                                    <rect x="150" y="165" width="180" height="46" rx="4" fill="#0A0F1D" stroke="#1E293B" stroke-width="2"/>
                                    <!-- Chanfro de orientação do chip à esquerda -->
                                    <path d="M 150 182 A 6 6 0 0 0 150 194 Z" fill="#1E293B"/>
                                    <!-- Inscrição oficial no chip -->
                                    <text x="240" y="191" text-anchor="middle" fill="#E2E8F0" font-size="11" font-family="'Consolas', monospace" font-weight="bold" letter-spacing="1.5">ATMEGA328P-PU</text>
                                    <text x="240" y="203" text-anchor="middle" fill="#64748B" font-size="7.5" font-family="'Consolas', monospace">MICROCHIP / ATMEL 32KB FLASH</text>
                                    <!-- Pinos Prateados DIP nas duas bordas -->
                                    <line x1="160" y1="160" x2="160" y2="165" stroke="#CBD5E1" stroke-width="2"/>
                                    <line x1="172" y1="160" x2="172" y2="165" stroke="#CBD5E1" stroke-width="2"/>
                                    <line x1="184" y1="160" x2="184" y2="165" stroke="#CBD5E1" stroke-width="2"/>
                                    <line x1="196" y1="160" x2="196" y2="165" stroke="#CBD5E1" stroke-width="2"/>
                                    <line x1="208" y1="160" x2="208" y2="165" stroke="#CBD5E1" stroke-width="2"/>
                                    <line x1="220" y1="160" x2="220" y2="165" stroke="#CBD5E1" stroke-width="2"/>
                                    <line x1="232" y1="160" x2="232" y2="165" stroke="#CBD5E1" stroke-width="2"/>
                                    <line x1="244" y1="160" x2="244" y2="165" stroke="#CBD5E1" stroke-width="2"/>
                                    <line x1="256" y1="160" x2="256" y2="165" stroke="#CBD5E1" stroke-width="2"/>
                                    <line x1="268" y1="160" x2="268" y2="165" stroke="#CBD5E1" stroke-width="2"/>
                                    <line x1="280" y1="160" x2="280" y2="165" stroke="#CBD5E1" stroke-width="2"/>
                                    <line x1="292" y1="160" x2="292" y2="165" stroke="#CBD5E1" stroke-width="2"/>
                                    <line x1="304" y1="160" x2="304" y2="165" stroke="#CBD5E1" stroke-width="2"/>
                                    <line x1="316" y1="160" x2="316" y2="165" stroke="#CBD5E1" stroke-width="2"/>
                                    <line x1="160" y1="211" x2="160" y2="216" stroke="#CBD5E1" stroke-width="2"/>
                                    <line x1="172" y1="211" x2="172" y2="216" stroke="#CBD5E1" stroke-width="2"/>
                                    <line x1="184" y1="211" x2="184" y2="216" stroke="#CBD5E1" stroke-width="2"/>
                                    <line x1="196" y1="211" x2="196" y2="216" stroke="#CBD5E1" stroke-width="2"/>
                                    <line x1="208" y1="211" x2="208" y2="216" stroke="#CBD5E1" stroke-width="2"/>
                                    <line x1="220" y1="211" x2="220" y2="216" stroke="#CBD5E1" stroke-width="2"/>
                                    <line x1="232" y1="211" x2="232" y2="216" stroke="#CBD5E1" stroke-width="2"/>
                                    <line x1="244" y1="211" x2="244" y2="216" stroke="#CBD5E1" stroke-width="2"/>
                                    <line x1="256" y1="211" x2="256" y2="216" stroke="#CBD5E1" stroke-width="2"/>
                                    <line x1="268" y1="211" x2="268" y2="216" stroke="#CBD5E1" stroke-width="2"/>
                                    <line x1="280" y1="211" x2="280" y2="216" stroke="#CBD5E1" stroke-width="2"/>
                                    <line x1="292" y1="211" x2="292" y2="216" stroke="#CBD5E1" stroke-width="2"/>
                                    <line x1="304" y1="211" x2="304" y2="216" stroke="#CBD5E1" stroke-width="2"/>
                                    <line x1="316" y1="211" x2="316" y2="216" stroke="#CBD5E1" stroke-width="2"/>
                                </g>

                                <!-- LEDs Integrados da Placa Arduino UNO -->
                                <!-- 1. LED ON (Verde - Alimentação 5V) -->
                                <circle id="bench-led-on" cx="210" cy="118" r="5" fill="#10B981" filter="url(#glowGreen)"/>
                                <text x="210" y="108" text-anchor="middle" fill="#FFFFFF" font-size="8" font-weight="bold">ON</text>

                                <!-- 2. LED L (Pino 13 - Builtin) -->
                                <circle id="bench-led-l" cx="180" cy="118" r="5" fill="#F59E0B"/>
                                <text x="180" y="108" text-anchor="middle" fill="#FFFFFF" font-size="8" font-weight="bold">L</text>

                                <!-- 3. LEDs TX e RX de Comunicação Serial -->
                                <circle id="bench-led-tx" cx="140" cy="118" r="4.5" fill="#334155"/>
                                <text x="140" y="108" text-anchor="middle" fill="#FFFFFF" font-size="7.5" font-weight="bold">TX</text>

                                <circle id="bench-led-rx" cx="160" cy="118" r="4.5" fill="#334155"/>
                                <text x="160" y="108" text-anchor="middle" fill="#FFFFFF" font-size="7.5" font-weight="bold">RX</text>

                                <!-- Barramento Superior: Pinos Digitais -->
                                <g id="bench-ard-top-pins">
                                    <rect x="110" y="8" width="220" height="15" rx="2" fill="#0A0F1D" stroke="#1E293B" stroke-width="1"/>
                                    <circle cx="120" cy="15" r="2.5" fill="#000000" stroke="#475569" stroke-width="0.8"/>
                                    <circle cx="132" cy="15" r="2.5" fill="#000000" stroke="#475569" stroke-width="0.8"/>
                                    <circle cx="144" cy="15" r="2.5" fill="#000000" stroke="#475569" stroke-width="0.8"/>
                                    <circle cx="156" cy="15" r="2.5" fill="#000000" stroke="#475569" stroke-width="0.8"/>
                                    <circle cx="168" cy="15" r="2.5" fill="#000000" stroke="#475569" stroke-width="0.8"/>
                                    <circle cx="180" cy="15" r="2.5" fill="#000000" stroke="#475569" stroke-width="0.8"/>
                                    <circle cx="192" cy="15" r="2.5" fill="#000000" stroke="#475569" stroke-width="0.8"/>
                                    <circle cx="204" cy="15" r="2.5" fill="#000000" stroke="#475569" stroke-width="0.8"/>
                                    <circle cx="220" cy="15" r="2.5" fill="#000000" stroke="#475569" stroke-width="0.8"/>
                                    <circle cx="232" cy="15" r="2.5" fill="#000000" stroke="#475569" stroke-width="0.8"/>
                                    <circle cx="244" cy="15" r="2.5" fill="#000000" stroke="#475569" stroke-width="0.8"/>
                                    <circle cx="256" cy="15" r="2.5" fill="#000000" stroke="#475569" stroke-width="0.8"/>
                                    <circle cx="268" cy="15" r="2.5" fill="#000000" stroke="#475569" stroke-width="0.8"/>
                                    <circle cx="280" cy="15" r="2.5" fill="#000000" stroke="#475569" stroke-width="0.8"/>
                                    <circle cx="292" cy="15" r="2.5" fill="#000000" stroke="#475569" stroke-width="0.8"/>
                                    <circle cx="304" cy="15" r="2.5" fill="#000000" stroke="#475569" stroke-width="0.8"/>
                                    <circle cx="316" cy="15" r="2.5" fill="#000000" stroke="#475569" stroke-width="0.8"/>
                                    <text x="220" y="34" text-anchor="middle" fill="#FFFFFF" font-size="7.5" font-family="'Segoe UI', sans-serif" font-weight="bold">DIGITAL (PWM ~)</text>
                                </g>

                                <!-- Barramento Inferior: Pinos Power e Analógicos -->
                                <g id="bench-ard-bottom-pins">
                                    <rect x="140" y="257" width="190" height="15" rx="2" fill="#0A0F1D" stroke="#1E293B" stroke-width="1"/>
                                    <circle cx="150" cy="264" r="2.5" fill="#000000" stroke="#475569" stroke-width="0.8"/>
                                    <circle cx="162" cy="264" r="2.5" fill="#000000" stroke="#475569" stroke-width="0.8"/>
                                    <circle cx="174" cy="264" r="2.5" fill="#000000" stroke="#475569" stroke-width="0.8"/>
                                    <circle cx="186" cy="264" r="2.5" fill="#000000" stroke="#475569" stroke-width="0.8"/>
                                    <circle cx="198" cy="264" r="2.5" fill="#000000" stroke="#475569" stroke-width="0.8"/>
                                    <circle cx="210" cy="264" r="2.5" fill="#000000" stroke="#475569" stroke-width="0.8"/>
                                    <circle cx="222" cy="264" r="2.5" fill="#000000" stroke="#475569" stroke-width="0.8"/>
                                    <circle cx="240" cy="264" r="2.5" fill="#000000" stroke="#475569" stroke-width="0.8"/>
                                    <circle cx="252" cy="264" r="2.5" fill="#000000" stroke="#475569" stroke-width="0.8"/>
                                    <circle cx="264" cy="264" r="2.5" fill="#000000" stroke="#475569" stroke-width="0.8"/>
                                    <circle cx="276" cy="264" r="2.5" fill="#000000" stroke="#475569" stroke-width="0.8"/>
                                    <circle cx="288" cy="264" r="2.5" fill="#000000" stroke="#475569" stroke-width="0.8"/>
                                    <circle cx="300" cy="264" r="2.5" fill="#000000" stroke="#475569" stroke-width="0.8"/>
                                    <circle cx="312" cy="264" r="2.5" fill="#000000" stroke="#475569" stroke-width="0.8"/>
                                    <text x="180" y="250" text-anchor="middle" fill="#FFFFFF" font-size="7.5" font-family="'Segoe UI', sans-serif" font-weight="bold">POWER</text>
                                    <text x="275" y="250" text-anchor="middle" fill="#FFFFFF" font-size="7.5" font-family="'Segoe UI', sans-serif" font-weight="bold">ANALOG IN</text>
                                </g>

                                <!-- Logo Oficial Infinito do Arduino e Nome da Placa -->
                                <g transform="translate(255, 68)">
                                    <circle cx="12" cy="10" r="8" fill="none" stroke="#FFFFFF" stroke-width="1.8"/>
                                    <circle cx="26" cy="10" r="8" fill="none" stroke="#FFFFFF" stroke-width="1.8"/>
                                    <text x="12" y="13" text-anchor="middle" fill="#FFFFFF" font-size="8" font-weight="bold">-</text>
                                    <text x="26" y="13" text-anchor="middle" fill="#FFFFFF" font-size="8" font-weight="bold">+</text>
                                </g>
                                <text x="250" y="100" fill="#FFFFFF" font-size="13" font-family="'Fredoka One', cursive" font-weight="bold" letter-spacing="1">ARDUINO</text>
                                <text x="250" y="114" fill="#FFFFFF" font-size="9" font-family="'Segoe UI', sans-serif" font-weight="bold">UNO R3</text>
                                <text x="250" y="125" fill="#BAE6FD" font-size="6.5" font-family="'Segoe UI', sans-serif">ITALY DESIGN</text>
                            </g>
                        </svg>

                        <!-- Terminal de Telemetria & Diagnóstico da Bancada -->
                        <div id="ard-bench-console-log" style="background:#0F172A;border:1px solid #334155;border-radius:10px;padding:12px 16px;margin-top:14px;font-family:'Consolas',monospace;font-size:0.84rem;color:#38BDF8;display:flex;align-items:center;gap:12px;box-shadow:inset 0 2px 6px rgba(0,0,0,0.5);">
                            <i class="fa-solid fa-terminal" style="color:#0284C7;font-size:1.1rem;"></i>
                            <span id="ard-bench-log-text">🔌 Cabo USB Conectado: 5.0V fornecidos pelo PC ➔ Placa Arduino UNO pronta na COM3!</span>
                        </div>
                    </div>
                </div>

                <!-- CARTÃO DIDÁTICO DO BOTÃO RESET: PRECISA SEGURAR O BOTÃO? -->
                <div style="background:#0F172A;border:2px solid #EF4444;border-radius:16px;padding:20px;margin-bottom:20px;box-shadow:0 8px 30px rgba(239,68,68,0.25);">
                    <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px;">
                        <span style="background:#EF4444;color:white;width:42px;height:42px;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:1.3rem;">
                            <i class="fa-solid fa-rotate-right"></i>
                        </span>
                        <div>
                            <span style="background:rgba(239,68,68,0.2);color:#FCA5A5;padding:2px 10px;border-radius:12px;font-size:0.75rem;font-weight:900;text-transform:uppercase;letter-spacing:1px;border:1px solid rgba(239,68,68,0.4);">
                                Conceito Essencial de Hardware
                            </span>
                            <h3 style="color:white;font-family:'Fredoka One';margin:4px 0 0;font-size:1.35rem;">
                                Dúvida Crucial: Precisa SEGURAR o Botão RESET?
                            </h3>
                            <p style="color:#94A3B8;margin:2px 0 0;font-size:0.88rem;">
                                Entenda exatamente o que o pino RESET faz no microcontrolador e evite o erro mais comum dos iniciantes.
                            </p>
                        </div>
                    </div>

                    <!-- Grid Didático 3 Colunas -->
                    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:14px;margin-top:14px;">
                        <!-- Coluna 1: O Modo Correto -->
                        <div style="background:#1E293B;border-top:4px solid #10B981;border-radius:12px;padding:16px;">
                            <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">
                                <span style="font-size:1.2rem;">🟢</span>
                                <strong style="color:#34D399;font-size:1rem;">O Jeito Correto: Clique Rápido (0.2s)</strong>
                            </div>
                            <p style="color:#E2E8F0;font-size:0.86rem;line-height:1.6;margin:0 0 10px;">
                                <strong>NUNCA SEGURE!</strong> Basta apenas <strong>um clique rápido e soltar imediatamente</strong>, como se fosse um clique rápido no botão do mouse.
                            </p>
                            <div style="background:#0F172A;border-left:3px solid #10B981;padding:8px 12px;border-radius:6px;font-size:0.8rem;color:#CBD5E1;line-height:1.5;">
                                <b>O que a placa faz:</b> O pino RESET recebe um pulso rápido de GND (0V) e volta para 5V. O microcontrolador reinicia imediatamente, o <b>LED L</b> pisca 3 vezes bem rápido (bootloader Optiboot) e em seguida executa o <code>void setup()</code> e entra no <code>void loop()</code>!
                            </div>
                            <button onclick="ard_benchReset()" class="ard-bench-btn" style="margin-top:12px;width:100%;justify-content:center;border-color:#10B981;color:#34D399;background:#064E3B;">
                                <i class="fa-solid fa-hand-pointer"></i> Testar: Dar Clique Rápido (Normal)
                            </button>
                        </div>

                        <!-- Coluna 2: O Erro de Segurar -->
                        <div style="background:#1E293B;border-top:4px solid #EF4444;border-radius:12px;padding:16px;">
                            <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">
                                <span style="font-size:1.2rem;">🛑</span>
                                <strong style="color:#F87171;font-size:1rem;">O Erro Comum: Segurar Pressionado</strong>
                            </div>
                            <p style="color:#E2E8F0;font-size:0.86rem;line-height:1.6;margin:0 0 10px;">
                                Se você mantiver o dedo segurando o botão, o pino fica travado em nível LOW (0V). O microcontrolador entra em <strong>estado de congelamento (HALT)</strong>.
                            </p>
                            <div style="background:#0F172A;border-left:3px solid #EF4444;padding:8px 12px;border-radius:6px;font-size:0.8rem;color:#CBD5E1;line-height:1.5;">
                                <b>O que acontece:</b> Enquanto seu dedo estiver segurando o botão, o Arduino <b>NÃO roda nada</b>, os pinos ficam inativos e a placa não inicializa! Ela só começará a rodar no segundo em que você <b>soltar o dedo</b>.
                            </div>
                            <div style="display:flex;gap:8px;margin-top:12px;">
                                <button onclick="ard_benchHoldReset()" class="ard-bench-btn" style="flex:1;justify-content:center;border-color:#EF4444;color:#FCA5A5;background:#7F1D1D;">
                                    <i class="fa-solid fa-fingerprint"></i> Testar: Segurar Pressionado
                                </button>
                                <button onclick="ard_benchReleaseReset()" id="ard-btn-release-reset" class="ard-bench-btn" style="display:none;flex:1;justify-content:center;border-color:#34D399;color:#34D399;background:#064E3B;">
                                    <i class="fa-solid fa-hand-sparkles"></i> Soltar Botão
                                </button>
                            </div>
                        </div>

                        <!-- Coluna 3: A Exceção -->
                        <div style="background:#1E293B;border-top:4px solid #F59E0B;border-radius:12px;padding:16px;">
                            <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">
                                <span style="font-size:1.2rem;">⚡</span>
                                <strong style="color:#FBBF24;font-size:1rem;">Dica Maker Avançada: Quando segurar?</strong>
                            </div>
                            <p style="color:#E2E8F0;font-size:0.86rem;line-height:1.6;margin:0 0 10px;">
                                Existe apenas <strong>1 situação extrema</strong> em que segurar o RESET é útil: recuperação de placa travada!
                            </p>
                            <div style="background:#0F172A;border-left:3px solid #F59E0B;padding:8px 12px;border-radius:6px;font-size:0.8rem;color:#CBD5E1;line-height:1.5;">
                                <b>Técnica de Hard Reset:</b> Se você gravou um código com bug que inundou a serial e a IDE não consegue mais conectar, você: 1) Segura o RESET; 2) Clica em "Carregar" na IDE; 3) <b>Solta o botão exatamente no milissegundo em que a IDE exibir "Uploading..."</b>!
                            </div>
                        </div>
                    </div>

                    <!-- Banner de Alerta Dinâmico quando o RESET for mantido pressionado -->
                    <div id="ard-reset-hold-banner" style="display:none;margin-top:14px;background:#7F1D1D;border:2px dashed #EF4444;border-radius:10px;padding:12px 16px;color:#FEE2E2;font-size:0.88rem;animation:ardPulseBadge 1s infinite alternate;">
                        <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px;">
                            <div>
                                <b>⚠️ ESTADO DE RESET ATIVO (BOTÃO SEGURADO):</b>
                                <div>O microcontrolador ATmega328P está CONGELADO em nível lógico 0V! Nenhum código roda até você soltar o botão!</div>
                            </div>
                            <button onclick="ard_benchReleaseReset()" style="background:#10B981;color:white;border:none;padding:8px 18px;border-radius:8px;font-weight:bold;cursor:pointer;font-size:0.85rem;">
                                🖐️ Soltar Botão Agora e Deixar Iniciar ▶
                            </button>
                        </div>
                    </div>
                </div>

                <!-- PASSO A PASSO PEDAGÓGICO DA CONEXÃO FÍSICA E ALIMENTAÇÃO -->
                <div style="background:#0F172A;border:2px solid #0284C7;border-radius:18px;padding:20px;margin-bottom:18px;">
                    <h3 style="color:#38BDF8;font-family:'Fredoka One';margin:0 0 10px;font-size:1.25rem;">
                        <i class="fa-solid fa-bolt-lightning"></i> Como Funciona a Conexão Física do Arduino (Os 4 Pilares da Bancada):
                    </h3>
                    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:12px;">
                        <div style="background:#1E293B;padding:14px;border-radius:12px;border-top:3px solid #38BDF8;">
                            <strong style="color:#38BDF8;display:flex;align-items:center;gap:6px;">
                                <span>1️⃣</span> Conector USB Tipo A e B
                            </strong>
                            <p style="color:#CBD5E1;font-size:0.85rem;margin:6px 0 0;line-height:1.5;">
                                A ponta quadrada robusta (<b>USB-B</b>) encaixa no soquete prateado do Arduino, enquanto a ponta plana (<b>USB-A</b>) conecta na porta do computador.
                            </p>
                        </div>
                        <div style="background:#1E293B;padding:14px;border-radius:12px;border-top:3px solid #10B981;">
                            <strong style="color:#34D399;display:flex;align-items:center;gap:6px;">
                                <span>2️⃣</span> Alimentação Elétrica 5.0V CC
                            </strong>
                            <p style="color:#CBD5E1;font-size:0.85rem;margin:6px 0 0;line-height:1.5;">
                                O computador fornece <b>5.0V de corrente contínua</b> pela linha de força (VBUS). O LED verde <b>ON</b> na placa acende na hora confirmando que o chip está energizado!
                            </p>
                        </div>
                        <div style="background:#1E293B;padding:14px;border-radius:12px;border-top:3px solid #FBBF24;">
                            <strong style="color:#FBBF24;display:flex;align-items:center;gap:6px;">
                                <span>3️⃣</span> Linhas de Dados (D+ e D-)
                            </strong>
                            <p style="color:#CBD5E1;font-size:0.85rem;margin:6px 0 0;line-height:1.5;">
                                O cabo possui dois fios de dados que realizam a <b>comunicação serial assíncrona</b>. É por eles que o código compilado viaja do computador para a memória flash.
                            </p>
                        </div>
                        <div style="background:#1E293B;padding:14px;border-radius:12px;border-top:3px solid #A855F7;">
                            <strong style="color:#C084FC;display:flex;align-items:center;gap:6px;">
                                <span>4️⃣</span> Criação da Porta COM
                            </strong>
                            <p style="color:#CBD5E1;font-size:0.85rem;margin:6px 0 0;line-height:1.5;">
                                O chip conversor USB-Serial da placa é reconhecido pelo Windows como uma porta virtual (ex: <b>COM3</b>). Com ela ativa, você programa na <b>Aba 4 (IDE)</b>!
                            </p>
                        </div>
                    </div>
                </div>

                <!-- DESAFIO PRÁTICO NA CARTEIRA -->
                <div class="ard-desk-challenge">
                    <strong>🖐️ Desafio Prático na Sua Bancada Física:</strong><br>
                    Na sua bancada real de laboratório:<br>
                    1️⃣ Pegue seu cabo USB azul. Conecte a ponta quadrada no conector prateado do seu Arduino e a outra ponta em uma porta USB do seu computador.<br>
                    2️⃣ Observe o LED verde <b>ON</b> acendendo na placa, confirmando os 5.0V de alimentação elétrica.<br>
                    3️⃣ Observe o LED âmbar <b>L</b> piscar 3 vezes rapidamente (o bootloader acordando o chip ATmega328P).<br>
                    4️⃣ Placa energizada e pronta! Avance agora para a <b>Aba 4 (IDE &amp; Programação)</b> para digitar seu código e enviá-lo para a placa!
                </div>
            </div>

            <!-- ================= ABA 4: SIMULADOR INTERATIVO DA ARDUINO IDE & GUIA OVERLAY ================= -->
            <div class="panel" id="ard-tab-gui">
                <div style="display:flex;align-items:center;gap:12px;margin-bottom:15px;flex-wrap:wrap;justify-content:space-between;">
                    <div style="display:flex;align-items:center;gap:12px;">
                        <span style="background:#00979D;color:white;width:44px;height:44px;border-radius:14px;display:flex;align-items:center;justify-content:center;font-size:1.4rem;"><i class="fa-solid fa-laptop-code"></i></span>
                        <div>
                            <h2 style="color:white;font-family:'Fredoka One';margin:0;">4. Simulador Oficial da Arduino IDE & Editor C++</h2>
                            <p style="color:#94A3B8;margin:0;font-size:0.9rem;">Editor de código realista com fundo branco, compilação GCC, gravação avrdude e menu Ferramentas funcional.</p>
                        </div>
                    </div>

                    <!-- BOTÃO DO GUIA INTERATIVO PARA INICIANTES -->
                    <button class="ard-real-btn" onclick="ard_startOverlayTour()" style="padding:10px 22px;font-size:0.92rem;background:linear-gradient(135deg,#38BDF8,#0284C7);">
                        <i class="fa-solid fa-graduation-cap"></i> <b>Guia Interativo da IDE (Tour Guiado)</b>
                    </button>
                </div>

                <!-- BARRA DE STATUS RÁPIDO DO SIMULADOR -->
                <div style="background:#0F172A;border:1px solid #334155;border-radius:14px;padding:12px 18px;margin-bottom:14px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;">
                    <div style="display:flex;align-items:center;gap:10px;">
                        <span id="ard-ide-live-status-pill" style="background:#064E3B;color:#34D399;border:1px solid #10B981;padding:5px 12px;border-radius:20px;font-size:0.82rem;font-weight:bold;">
                            🟢 Conexão Ativa: Arduino Uno em COM3
                        </span>
                        <span style="font-size:0.82rem;color:#94A3B8;">Clique em <b>Ferramentas</b> na barra superior para alternar a placa ou porta!</span>
                    </div>

                    <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
                        <button onclick="ard_toggleRealToolsMenu()" style="background:#1E293B;border:1px solid #38BDF8;color:#38BDF8;padding:6px 14px;border-radius:8px;font-size:0.82rem;font-weight:bold;cursor:pointer;">
                            <i class="fa-solid fa-sliders"></i> Abrir Menu Ferramentas
                        </button>
                        <button onclick="ard_openSerialPlotter()" style="background:#059669;border:none;color:white;padding:6px 14px;border-radius:8px;font-size:0.82rem;font-weight:bold;cursor:pointer;">
                            <i class="fa-solid fa-chart-line"></i> Abrir Plotter Serial
                        </button>
                        <button onclick="ard_showBoardInfoDialog()" style="background:#0284C7;border:none;color:white;padding:6px 14px;border-radius:8px;font-size:0.82rem;font-weight:bold;cursor:pointer;">
                            <i class="fa-solid fa-circle-info"></i> Info da Placa
                        </button>
                    </div>
                </div>

                <!-- Banner Dica de Hover nos Botões Numerados -->
                <div style="background:linear-gradient(135deg,rgba(15,23,42,0.92),rgba(30,41,59,0.95));border:1px solid #38BDF8;border-radius:12px;padding:10px 16px;margin-bottom:14px;display:flex;align-items:center;gap:12px;box-shadow:0 4px 18px rgba(0,0,0,0.35);">
                    <span style="font-size:1.4rem;">💡</span>
                    <div style="font-size:0.86rem;color:#E2E8F0;line-height:1.4;">
                        <strong style="color:#38BDF8;">Dica Interativa:</strong> Passe o mouse sobre os <b>botões circulares vermelhos (1 a 11)</b> na janela da IDE para ver o que cada função faz, ou clique para destacar a área correspondente!
                    </div>
                </div>

                <!-- ARDUINO IDE COMPONENTE 100% INTERATIVO -->
                <div class="ard-ide-container" id="ard-rayx-ide-window">
                    <!-- Titlebar -->
                    <div class="ard-ide-titlebar">
                        <span id="ard-ide-main-window-title">semaforo_maker | Arduino 1.8.19</span>
                        <div style="display:flex;gap:6px;">
                            <span>—</span>
                            <span>▢</span>
                            <span>✕</span>
                        </div>
                    </div>

                    <!-- Menubar Oficial com Dropdowns Reais da Arduino IDE -->
                    <div class="ard-ide-menubar" id="target-tour-menu">
                        <!-- Menu Arquivo -->
                        <div class="ard-ide-menu-btn" onclick="ard_toggleMenu('file', event)">
                            Arquivo ▾
                            <div class="ard-dropdown-menu" id="ard-menu-file" style="left:0;">
                                <div class="ard-menu-row" onclick="ard_loadSketch('BareMinimum.ino')">
                                    <span>📄 Novo</span>
                                    <span style="color:#64748B;font-size:0.75rem;">Ctrl+N</span>
                                </div>
                                <div class="ard-menu-row" onclick="ard_openWindowsFileDialog()">
                                    <span>📂 Abrir...</span>
                                    <span style="color:#64748B;font-size:0.75rem;">Ctrl+O</span>
                                </div>
                                <div class="ard-menu-row" style="background:#F8FAFC;font-weight:600;">
                                    <span>📁 Exemplos</span>
                                    <span>▶</span>
                                    <div class="ard-submenu">
                                        <div class="ard-menu-row" onclick="ard_loadSketch('semaforo_maker.ino')">🚦 01. Semáforo Maker</div>
                                        <div class="ard-menu-row" onclick="ard_loadSketch('Blink.ino')">💡 02. Pisca LED (Blink)</div>
                                        <div class="ard-menu-row" onclick="ard_loadSketch('LeituraSerial.ino')">🕹️ 03. Leitura Serial Potenciômetro</div>
                                        <div class="ard-menu-row" onclick="ard_loadSketch('BareMinimum.ino')">🧹 04. BareMinimum (Zerar)</div>
                                        <div class="ard-menu-row" onclick="ard_loadSketch('Pisca_Alerta_Duplo.ino')">⚡ 05. Pisca Alerta Duplo</div>
                                        <div class="ard-menu-row" onclick="ard_loadSketch('Sensor_LDR_Luz.ino')">☀️ 06. Sensor de Luz LDR</div>
                                    </div>
                                </div>
                                <div class="ard-menu-divider"></div>
                                <div class="ard-menu-row" onclick="ard_ideAction('save')">
                                    <span>💾 Salvar</span>
                                    <span style="color:#64748B;font-size:0.75rem;">Ctrl+S</span>
                                </div>
                                <div class="ard-menu-row" onclick="ard_ideAction('save')">
                                    <span>Salvar Como...</span>
                                    <span style="color:#64748B;font-size:0.75rem;">Ctrl+Shift+S</span>
                                </div>
                            </div>
                        </div>

                        <!-- Menu Editar -->
                        <div class="ard-ide-menu-btn" onclick="ard_toggleMenu('edit', event)">
                            Editar ▾
                            <div class="ard-dropdown-menu" id="ard-menu-edit" style="left:60px;">
                                <div class="ard-menu-row" onclick="ard_autoFormatCode()">
                                    <span>✨ Auto-Formatar</span>
                                    <span style="color:#64748B;font-size:0.75rem;">Ctrl+T</span>
                                </div>
                                <div class="ard-menu-divider"></div>
                                <div class="ard-menu-row" onclick="document.getElementById('ard-ide-code-input')?.select()">
                                    <span>🔲 Selecionar Tudo</span>
                                    <span style="color:#64748B;font-size:0.75rem;">Ctrl+A</span>
                                </div>
                                <div class="ard-menu-row" onclick="ard_ideAction('save')">
                                    <span>📋 Copiar Código</span>
                                    <span style="color:#64748B;font-size:0.75rem;">Ctrl+C</span>
                                </div>
                            </div>
                        </div>

                        <!-- Menu Sketch -->
                        <div class="ard-ide-menu-btn" onclick="ard_toggleMenu('sketch', event)">
                            Sketch ▾
                            <div class="ard-dropdown-menu" id="ard-menu-sketch" style="left:110px;">
                                <div class="ard-menu-row" onclick="ard_ideAction('verify')">
                                    <span><i class="fa-solid fa-check" style="color:#059669;"></i> Verificar / Compilar</span>
                                    <span style="color:#64748B;font-size:0.75rem;">Ctrl+R</span>
                                </div>
                                <div class="ard-menu-row" onclick="ard_ideAction('upload')">
                                    <span><i class="fa-solid fa-arrow-right" style="color:#0284C7;"></i> Carregar para o Arduino</span>
                                    <span style="color:#64748B;font-size:0.75rem;">Ctrl+U</span>
                                </div>
                                <div class="ard-menu-divider"></div>
                                <div class="ard-menu-row" onclick="alert('📦 Arquivar Sketch: Cria um arquivo compactado .zip de backup com todo o projeto!')">
                                    <span>📦 Arquivar Sketch</span>
                                </div>
                                <div class="ard-menu-row" onclick="alert('📚 Gerenciador de Bibliotecas: Permite instalar módulos de displays, servo motores e sensores externos.')">
                                    <span>📚 Incluir Biblioteca...</span>
                                    <span style="color:#64748B;font-size:0.75rem;">Ctrl+Shift+I</span>
                                </div>
                            </div>
                        </div>

                        <!-- Menu Ferramentas -->
                        <div class="ard-ide-menu-btn" id="ard-menubar-tools-btn" onclick="ard_toggleMenu('tools', event)" style="font-weight:bold;color:#FDE68A;">
                            <b>Ferramentas ▼</b>
                            <div class="ard-dropdown-menu" id="ard-real-tools-dropdown" style="left:165px;">
                                <div class="ard-menu-row" onclick="ard_autoFormatCode()">
                                    <span>Auto Formatação</span>
                                    <span style="color:#64748B;font-size:0.75rem;">Ctrl+T</span>
                                </div>
                                <div class="ard-menu-row" onclick="alert('📦 Arquivar Sketch: Cria um arquivo .zip com todo o projeto!')">
                                    <span>Arquivar Sketch</span>
                                </div>
                                <div class="ard-menu-row" onclick="alert('📚 Gerenciar Bibliotecas: Instala sensores e atuadores.')">
                                    <span>Gerenciar Bibliotecas...</span>
                                    <span style="color:#64748B;font-size:0.75rem;">Ctrl+Shift+I</span>
                                </div>
                                <div class="ard-menu-row" onclick="ard_toggleSerialWindow()">
                                    <span>Monitor Serial</span>
                                    <span style="color:#64748B;font-size:0.75rem;">Ctrl+Shift+M</span>
                                </div>
                                <div class="ard-menu-row" onclick="ard_openSerialPlotter()" style="color:#059669;font-weight:bold;">
                                    <span><i class="fa-solid fa-chart-line"></i> Plotter Serial</span>
                                    <span style="color:#64748B;font-size:0.75rem;">Ctrl+Shift+L</span>
                                </div>
                                <div class="ard-menu-divider"></div>

                                <!-- SUBMENU PLACA -->
                                <div class="ard-menu-row" style="background:#F1F5F9;font-weight:bold;">
                                    <span>Placa: <span id="ard-tools-board-badge" style="color:#0284C7;">"Arduino Uno"</span></span>
                                    <span>▶</span>
                                    <div class="ard-submenu">
                                        <div class="ard-menu-row" onclick="ard_setBoard('Arduino Uno')" id="chk-board-uno">● Arduino Uno</div>
                                        <div class="ard-menu-row" onclick="ard_setBoard('Arduino Nano')" id="chk-board-nano">○ Arduino Nano</div>
                                        <div class="ard-menu-row" onclick="ard_setBoard('Arduino Mega 2560')" id="chk-board-mega">○ Arduino Mega 2560</div>
                                        <div class="ard-menu-row" onclick="ard_setBoard('BlackBoard Uno')" id="chk-board-bb">○ BlackBoard Uno</div>
                                    </div>
                                </div>

                                <!-- SUBMENU PORTA -->
                                <div class="ard-menu-row" style="background:#F1F5F9;font-weight:bold;">
                                    <span>Porta: <span id="ard-tools-port-badge" style="color:#059669;">"COM3"</span></span>
                                    <span>▶</span>
                                    <div class="ard-submenu">
                                        <div class="ard-menu-row" onclick="ard_setPort('COM1')" id="chk-port-com1">○ COM1</div>
                                        <div class="ard-menu-row" onclick="ard_setPort('COM3 (Arduino Uno)')" id="chk-port-com3">● COM3 (Arduino Uno)</div>
                                        <div class="ard-menu-row" onclick="ard_setPort('COM4 (USB-SERIAL CH340)')" id="chk-port-com4">○ COM4 (USB-SERIAL CH340)</div>
                                        <div class="ard-menu-row" onclick="ard_setPort('COM7')" id="chk-port-com7">○ COM7</div>
                                    </div>
                                </div>

                                <div class="ard-menu-divider"></div>
                                <div class="ard-menu-row" onclick="ard_showBoardInfoDialog()">
                                    <span><b>Obter Informações da Placa</b></span>
                                    <span style="color:#0284C7;"><i class="fa-solid fa-circle-info"></i></span>
                                </div>
                                <div class="ard-menu-divider"></div>
                                <div class="ard-menu-row" onclick="alert('⚡ Programador padrão: AVRISP mkII configurado para microcontrolador ATmega328P.')">
                                    <span>Programador: "AVRISP mkII"</span>
                                    <span>▶</span>
                                </div>
                                <div class="ard-menu-row" onclick="ard_ideAction('bootloader')">
                                    <span>Gravar Bootloader</span>
                                </div>
                            </div>
                        </div>

                        <!-- Menu Ajuda -->
                        <div class="ard-ide-menu-btn" onclick="ard_toggleMenu('help', event)">
                            Ajuda ▾
                            <div class="ard-dropdown-menu" id="ard-menu-help" style="left:265px;">
                                <div class="ard-menu-row" onclick="ard_startOverlayTour()">
                                    <span>🎓 Iniciar Tour Guiado da IDE</span>
                                </div>
                                <div class="ard-menu-row" onclick="ard_openWindowsFileDialog()">
                                    <span>📁 Abrir Banco de Esboços Maker</span>
                                </div>
                                <div class="ard-menu-divider"></div>
                                <div class="ard-menu-row" onclick="alert('💡 Arduino IDE 1.8.19 — Ambiente Oficial de Desenvolvimento Maker para C/C++.')">
                                    <span>Sobre a Arduino IDE</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Toolbar de Ações (Verificar, Carregar, Novo, Abrir, Salvar, Serial, Plotter) -->
                    <div class="ard-ide-toolbar">
                        <div class="ard-ide-toolgroup">
                            <!-- 1: Verificar -->
                            <div style="position:relative;display:inline-block;" id="target-pin-1" onmouseenter="ard_showPinTooltip(this, 1)" onmouseleave="ard_hidePinTooltip()">
                                <button class="ard-btn-round" onclick="ard_ideAction('verify')" title="Verificar / Compilar (Ctrl+R)">
                                    <i class="fa-solid fa-check" style="color:#34D399;"></i>
                                </button>
                                <span class="ard-pin-badge" onclick="ard_highlightPin(1, 'target-pin-1');event.stopPropagation();" onmouseenter="event.stopPropagation();ard_showPinTooltip(this, 1)" onmouseleave="ard_hidePinTooltip()" style="position:absolute;top:-8px;right:-8px;">1</span>
                            </div>

                            <!-- 2: Carregar -->
                            <div style="position:relative;display:inline-block;" id="target-pin-2" onmouseenter="ard_showPinTooltip(this, 2)" onmouseleave="ard_hidePinTooltip()">
                                <button class="ard-btn-round" onclick="ard_ideAction('upload')" title="Carregar para o Arduino (Ctrl+U)">
                                    <i class="fa-solid fa-arrow-right" style="color:#38BDF8;"></i>
                                </button>
                                <span class="ard-pin-badge" onclick="ard_highlightPin(2, 'target-pin-2');event.stopPropagation();" onmouseenter="event.stopPropagation();ard_showPinTooltip(this, 2)" onmouseleave="ard_hidePinTooltip()" style="position:absolute;top:-8px;right:-8px;">2</span>
                            </div>

                            <!-- 3: Novo -->
                            <div style="position:relative;display:inline-block;" id="target-pin-3" onmouseenter="ard_showPinTooltip(this, 3)" onmouseleave="ard_hidePinTooltip()">
                                <button class="ard-btn-round" onclick="ard_ideAction('new')" title="Novo Esboço (Ctrl+N)">
                                    <i class="fa-regular fa-file" style="color:#FDE68A;"></i>
                                </button>
                                <span class="ard-pin-badge" onclick="ard_highlightPin(3, 'target-pin-3');event.stopPropagation();" onmouseenter="event.stopPropagation();ard_showPinTooltip(this, 3)" onmouseleave="ard_hidePinTooltip()" style="position:absolute;top:-8px;right:-8px;">3</span>
                            </div>

                            <!-- 4: Abrir -->
                            <div style="position:relative;display:inline-block;" id="target-pin-4" onmouseenter="ard_showPinTooltip(this, 4)" onmouseleave="ard_hidePinTooltip()">
                                <button class="ard-btn-round" onclick="ard_openWindowsFileDialog()" title="Abrir Esboço Existente (Ctrl+O)">
                                    <i class="fa-regular fa-folder-open" style="color:#FBBF24;"></i>
                                </button>
                                <span class="ard-pin-badge" onclick="ard_highlightPin(4, 'target-pin-4');event.stopPropagation();" onmouseenter="event.stopPropagation();ard_showPinTooltip(this, 4)" onmouseleave="ard_hidePinTooltip()" style="position:absolute;top:-8px;right:-8px;">4</span>
                            </div>

                            <!-- 5: Salvar -->
                            <div style="position:relative;display:inline-block;" id="target-pin-5" onmouseenter="ard_showPinTooltip(this, 5)" onmouseleave="ard_hidePinTooltip()">
                                <button class="ard-btn-round" onclick="ard_ideAction('save')" title="Salvar Esboço (Ctrl+S)">
                                    <i class="fa-regular fa-floppy-disk" style="color:#A78BFA;"></i>
                                </button>
                                <span class="ard-pin-badge" onclick="ard_highlightPin(5, 'target-pin-5');event.stopPropagation();" onmouseenter="event.stopPropagation();ard_showPinTooltip(this, 5)" onmouseleave="ard_hidePinTooltip()" style="position:absolute;top:-8px;right:-8px;">5</span>
                            </div>
                        </div>

                        <!-- Mini Indicador de LEDs TX e RX integrado na Toolbar -->
                        <div style="display:flex;align-items:center;gap:10px;background:rgba(0,0,0,0.25);padding:4px 12px;border-radius:20px;">
                            <span style="font-size:0.75rem;color:#E2E8F0;font-weight:bold;">LEDs da Placa:</span>
                            <div style="display:flex;align-items:center;gap:4px;">
                                <span class="ard-comm-led" id="ide-toolbar-tx"></span>
                                <span style="font-size:0.68rem;color:#CBD5E1;">TX</span>
                            </div>
                            <div style="display:flex;align-items:center;gap:4px;">
                                <span class="ard-comm-led" id="ide-toolbar-rx"></span>
                                <span style="font-size:0.68rem;color:#CBD5E1;">RX</span>
                            </div>
                        </div>

                        <!-- 6: Monitor Serial & Plotter Serial -->
                        <div style="display:flex;align-items:center;gap:6px;">
                            <div style="position:relative;display:inline-block;" id="target-pin-6" onmouseenter="ard_showPinTooltip(this, 6)" onmouseleave="ard_hidePinTooltip()">
                                <button class="ard-btn-round" onclick="ard_toggleSerialWindow()" title="Monitor Serial (Ctrl+Shift+M)" style="background:#006468;">
                                    <i class="fa-solid fa-magnifying-glass" style="color:#38BDF8;"></i>
                                </button>
                                <span class="ard-pin-badge" onclick="ard_highlightPin(6, 'target-pin-6');event.stopPropagation();" onmouseenter="event.stopPropagation();ard_showPinTooltip(this, 6)" onmouseleave="ard_hidePinTooltip()" style="position:absolute;top:-8px;right:-8px;">6</span>
                            </div>

                            <div style="position:relative;display:inline-block;" id="target-plotter-btn">
                                <button class="ard-btn-round" onclick="ard_openSerialPlotter()" title="Plotter Serial (Ctrl+Shift+L) — Gráfico em Tempo Real" style="background:#006468;border-color:#10B981;">
                                    <i class="fa-solid fa-chart-line" style="color:#34D399;"></i>
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- 7: Nome do Esboço -->
                    <div class="ard-ide-tab-strip" id="target-pin-7" onmouseenter="ard_showPinTooltip(this, 7)" onmouseleave="ard_hidePinTooltip()">
                        <div class="ard-ide-tab" onclick="ard_openWindowsFileDialog()" title="Clique para trocar de esboço ou abrir arquivo .ino">
                            <span class="ard-pin-badge" onclick="ard_highlightPin(7, 'target-pin-7');event.stopPropagation();" onmouseenter="event.stopPropagation();ard_showPinTooltip(this, 7)" onmouseleave="ard_hidePinTooltip()" style="margin:0 4px 0 0;">7</span>
                            <span id="ard-active-sketch-title">semaforo_maker.ino</span>
                            <span style="font-size:0.75rem;color:#64748B;">✕</span>
                        </div>
                        <div style="color:#64748B;font-size:0.8rem;cursor:pointer;padding:4px 8px;" onclick="ard_openWindowsFileDialog()" title="Menu de Esboços da Pasta Arduino">▼</div>
                    </div>

                    <!-- Barra de Atalhos de Esboços Rápidos & Legenda de Sintaxe Oficial Arduino -->
                    <div class="ard-syntax-toolbar">
                        <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;">
                            <span style="color:#64748B;font-weight:bold;font-size:0.76rem;">Esboços Rápidos:</span>
                            <button type="button" onclick="ard_loadSketch('semaforo_maker.ino')" class="ard-sketch-quickbtn active" id="btn-quick-semaforo" title="Carregar Semáforo Inteligente">🚦 Semáforo</button>
                            <button type="button" onclick="ard_loadSketch('Blink.ino')" class="ard-sketch-quickbtn" id="btn-quick-blink" title="Carregar Pisca LED (Blink Oficial)">💡 Blink</button>
                            <button type="button" onclick="ard_loadSketch('LeituraSerial.ino')" class="ard-sketch-quickbtn" id="btn-quick-serial" title="Carregar Leitura Serial Potenciômetro">🕹️ Leitura Serial</button>
                            <button type="button" onclick="ard_loadSketch('BareMinimum.ino')" class="ard-sketch-quickbtn" id="btn-quick-bare" title="Carregar Código Vazio para Zerar e Limpar">🧹 BareMinimum</button>
                            <button type="button" onclick="ard_loadSketch('Pisca_Alerta_Duplo.ino')" class="ard-sketch-quickbtn" id="btn-quick-alerta" title="Carregar Pisca Alerta Duplo Alternado">⚡ Alerta Duplo</button>
                            <button type="button" onclick="ard_loadSketch('Sensor_LDR_Luz.ino')" class="ard-sketch-quickbtn" id="btn-quick-ldr" title="Carregar Sensor de Luminosidade LDR">☀️ Sensor LDR</button>
                            <button type="button" onclick="ard_autoFormatCode()" class="ard-sketch-quickbtn" style="color:#0284C7;border-color:#38BDF8;" title="Auto-Formatar Código (Ctrl+T)"><i class="fa-solid fa-wand-magic-sparkles"></i> Formatar</button>
                        </div>
                        <div class="ard-syntax-legend">
                            <span style="color:#64748B;font-weight:bold;margin-right:2px;">Sintaxe Arduino:</span>
                            <span class="syn-kw" title="Tipo de Dado / Palavra reservada">void, int</span>
                            <span class="syn-fn" title="Comando / Função Arduino">digitalWrite, delay</span>
                            <span class="syn-cn" title="Constante">HIGH, OUTPUT</span>
                            <span class="syn-nm" title="Número">12, 3000</span>
                            <span class="syn-cm" title="Comentário">// notas</span>
                        </div>
                    </div>

                    <!-- 8: Área do Código (FUNDO BRANCO #FFFFFF OBRIGATÓRIO COM DESTAQUE DE SINTAXE EM TEMPO REAL) -->
                    <div class="ard-ide-editor-box" id="target-pin-8">
                        <div class="ard-ide-gutter" id="ard-ide-gutter">
                            1<br>2<br>3<br>4<br>5<br>6<br>7<br>8<br>9<br>10<br>11<br>12<br>13<br>14<br>15<br>16<br>17<br>18<br>19<br>20<br>21<br>22<br>23<br>24<br>25<br>26<br>27<br>28<br>29<br>30
                        </div>
                        <div class="ard-ide-editor-wrapper">
                            <pre class="ard-ide-code-area" id="ard-ide-code-highlight" aria-hidden="true"><span class="syn-cm">// Projeto: Semáforo Inteligente com Arduino UNO</span>
<span class="syn-kw">const</span> <span class="syn-kw">int</span> pinoVermelho = <span class="syn-nm">12</span>;
<span class="syn-kw">const</span> <span class="syn-kw">int</span> pinoAmarelo  = <span class="syn-nm">11</span>;
<span class="syn-kw">const</span> <span class="syn-kw">int</span> pinoVerde    = <span class="syn-nm">10</span>;

<span class="syn-kw">void</span> <span class="syn-fn">setup</span>() {
  <span class="syn-fn">Serial</span>.<span class="syn-fn">begin</span>(<span class="syn-nm">9600</span>);
  <span class="syn-fn">pinMode</span>(pinoVermelho, <span class="syn-cn">OUTPUT</span>);
  <span class="syn-fn">pinMode</span>(pinoAmarelo,  <span class="syn-cn">OUTPUT</span>);
  <span class="syn-fn">pinMode</span>(pinoVerde,    <span class="syn-cn">OUTPUT</span>);
  <span class="syn-fn">Serial</span>.<span class="syn-fn">println</span>(<span class="syn-st">&quot;🚦 Sistema do Semáforo Pronto!&quot;</span>);
}

<span class="syn-kw">void</span> <span class="syn-fn">loop</span>() {
  <span class="syn-cm">// SINAL VERDE: Siga em frente!</span>
  <span class="syn-fn">digitalWrite</span>(pinoVerde, <span class="syn-cn">HIGH</span>);
  <span class="syn-fn">digitalWrite</span>(pinoAmarelo, <span class="syn-cn">LOW</span>);
  <span class="syn-fn">digitalWrite</span>(pinoVermelho, <span class="syn-cn">LOW</span>);
  <span class="syn-fn">delay</span>(<span class="syn-nm">3000</span>);

  <span class="syn-cm">// SINAL AMARELO: Atenção!</span>
  <span class="syn-fn">digitalWrite</span>(pinoVerde, <span class="syn-cn">LOW</span>);
  <span class="syn-fn">digitalWrite</span>(pinoAmarelo, <span class="syn-cn">HIGH</span>);
  <span class="syn-fn">delay</span>(<span class="syn-nm">1200</span>);

  <span class="syn-cm">// SINAL VERMELHO: Pare!</span>
  <span class="syn-fn">digitalWrite</span>(pinoAmarelo, <span class="syn-cn">LOW</span>);
  <span class="syn-fn">digitalWrite</span>(pinoVermelho, <span class="syn-cn">HIGH</span>);
  <span class="syn-fn">delay</span>(<span class="syn-nm">3000</span>);
}
</pre>
                            <textarea class="ard-ide-code-textarea" id="ard-ide-code-input" spellcheck="false" autocomplete="off" autocapitalize="off" oninput="ard_handleCodeInput(this.value)" onscroll="ard_syncEditorScroll()" onkeydown="ard_handleEditorKey(event)">// Projeto: Semáforo Inteligente com Arduino UNO
const int pinoVermelho = 12;
const int pinoAmarelo  = 11;
const int pinoVerde    = 10;

void setup() {
  Serial.begin(9600);
  pinMode(pinoVermelho, OUTPUT);
  pinMode(pinoAmarelo,  OUTPUT);
  pinMode(pinoVerde,    OUTPUT);
  Serial.println("🚦 Sistema do Semáforo Pronto!");
}

void loop() {
  // SINAL VERDE: Siga em frente!
  digitalWrite(pinoVerde, HIGH);
  digitalWrite(pinoAmarelo, LOW);
  digitalWrite(pinoVermelho, LOW);
  delay(3000);

  // SINAL AMARELO: Atenção!
  digitalWrite(pinoVerde, LOW);
  digitalWrite(pinoAmarelo, HIGH);
  delay(1200);

  // SINAL VERMELHO: Pare!
  digitalWrite(pinoAmarelo, LOW);
  digitalWrite(pinoVermelho, HIGH);
  delay(3000);
}</textarea>
                        </div>
                        <!-- Badge flutuante 8 -->
                        <span class="ard-pin-badge" onclick="ard_highlightPin(8, 'target-pin-8');event.stopPropagation();" onmouseenter="ard_showPinTooltip(this, 8)" onmouseleave="ard_hidePinTooltip()" style="position:absolute;top:10px;right:15px;z-index:10;">8</span>
                    </div>

                    <!-- 9: Área de Mensagens -->
                    <div class="ard-ide-msg-bar" id="target-pin-9" onmouseenter="ard_showPinTooltip(this, 9)" onmouseleave="ard_hidePinTooltip()">
                        <span id="ard-ide-msg-bar-text">✔ Pronto. Clique em "Verificar" (✔) ou "Carregar" (➔).</span>
                        <span class="ard-pin-badge" onclick="ard_highlightPin(9, 'target-pin-9');event.stopPropagation();" onmouseenter="event.stopPropagation();ard_showPinTooltip(this, 9)" onmouseleave="ard_hidePinTooltip()">9</span>
                    </div>

                    <!-- 10: Console de Texto -->
                    <div class="ard-ide-console" id="target-pin-10" onmouseenter="ard_showPinTooltip(this, 10)" onmouseleave="ard_hidePinTooltip()">
                        <div style="display:flex;justify-content:space-between;align-items:flex-start;">
                            <span id="ard-ide-console-text">O sketch usa 1.542 bytes (4%) de espaço de armazenamento para programas. O máximo são 32.256 bytes.
Variáveis globais usam 194 bytes (9%) de memória dinâmica, deixando 1.854 bytes para variáveis locais. O máximo são 2.048 bytes.</span>
                            <span class="ard-pin-badge" onclick="ard_highlightPin(10, 'target-pin-10');event.stopPropagation();" onmouseenter="event.stopPropagation();ard_showPinTooltip(this, 10)" onmouseleave="ard_hidePinTooltip()">10</span>
                        </div>
                    </div>

                    <!-- 11: Placa e Porta Serial -->
                    <div class="ard-ide-bottom-status" id="target-pin-11" onmouseenter="ard_showPinTooltip(this, 11)" onmouseleave="ard_hidePinTooltip()">
                        <span>Arduino AVR Boards</span>
                        <div style="display:flex;align-items:center;gap:6px;">
                            <span id="ard-ide-bottom-port-label">Arduino Uno na COM3</span>
                            <span class="ard-pin-badge" onclick="ard_highlightPin(11, 'target-pin-11');event.stopPropagation();" onmouseenter="event.stopPropagation();ard_showPinTooltip(this, 11)" onmouseleave="ard_hidePinTooltip()">11</span>
                        </div>
                    </div>
                </div>

                <!-- DESAFIO PRÁTICO NA CARTEIRA -->
                <div class="ard-desk-challenge">
                    <strong>🖐️ Desafio Prático na Sua Carteira:</strong><br>
                    Abra a sua Arduino IDE no computador real. Passe o mouse sobre os botões numerados (1 a 11) no simulador acima para explorar o que cada ferramenta faz. Observe a área do código em branco e veja como as palavras <code>void</code>, <code>setup</code> e <code>OUTPUT</code> mudam de cor sozinhas!
                </div>
            </div>

            <!-- ================= ABA 5: SIMULADOR REALISTA DE ENVIO & ZERAR ARDUINO ================= -->
            <div class="panel" id="ard-tab-upload">
                <div style="display:flex;align-items:center;gap:12px;margin-bottom:15px;">
                    <span style="background:#10B981;color:white;width:44px;height:44px;border-radius:14px;display:flex;align-items:center;justify-content:center;font-size:1.4rem;"><i class="fa-solid fa-rotate-left"></i></span>
                    <div>
                        <h2 style="color:white;font-family:'Fredoka One';margin:0;">Simulador Realista de Envio de Código & Zerar o Arduino</h2>
                        <p style="color:#94A3B8;margin:0;font-size:0.9rem;">Veja a compilação GCC, logs do AVRDUDE, LEDs TX/RX piscando e como zerar a placa com BareMinimum.</p>
                    </div>
                </div>

                <!-- CARDS DE CONCEITO DE UPLOAD E LIMPEZA -->
                <div class="ard-grid-3">
                    <div class="ard-card" style="border-top:4px solid #38BDF8;">
                        <h4 style="color:#38BDF8;margin-top:0;"><i class="fa-solid fa-arrow-right"></i> 1. O Botão Carregar (Upload)</h4>
                        <p style="color:#CBD5E1;font-size:0.86rem;line-height:1.5;">
                            Ao clicar em <strong>Carregar (➔)</strong>, a IDE compila o código, aciona o gravador <b>avrdude</b> e envia os bytes para a memória Flash do ATmega328P. Os LEDs <b>TX</b> e <b>RX</b> piscam muito rápido!
                        </p>
                    </div>
                    <div class="ard-card" style="border-top:4px solid #F59E0B;">
                        <h4 style="color:#F59E0B;margin-top:0;"><i class="fa-solid fa-eraser"></i> 2. Por que Zerar o Arduino?</h4>
                        <p style="color:#CBD5E1;font-size:0.86rem;line-height:1.5;">
                            O Arduino não tem pasta Lixeira! Toda vez que você liga a placa na energia, ela repete o último código gravado. Para fazer ele parar, regravamos um código vazio.
                        </p>
                    </div>
                    <div class="ard-card" style="border-top:4px solid #10B981;">
                        <h4 style="color:#10B981;margin-top:0;"><i class="fa-solid fa-file-code"></i> 3. O Exemplo "BareMinimum"</h4>
                        <p style="color:#CBD5E1;font-size:0.86rem;line-height:1.5;">
                            Abra <em>Arquivo &gt; Exemplos &gt; 01.Basics &gt; BareMinimum</em>. Esse código vem apenas com <code>setup()</code> e <code>loop()</code> vazios, deixando a placa totalmente limpa e em repouso.
                        </p>
                    </div>
                </div>

                <!-- SELETOR DE CÓDIGO PARA TESTE DE ENVIO -->
                <div style="background:#0F172A;padding:12px 18px;border-radius:14px;border:1px solid #334155;margin-bottom:14px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;">
                    <div style="font-size:0.88rem;color:#E2E8F0;">
                        📄 <b>Escolha qual código enviar para a placa:</b>
                    </div>
                    <div style="display:flex;gap:8px;">
                        <button onclick="ard_selectUploadSketch('semaforo_maker.ino')" id="btn-sketch-traffic" style="background:#0284C7;color:white;border:none;padding:7px 14px;border-radius:8px;font-weight:bold;font-size:0.82rem;cursor:pointer;">
                            🚦 semaforo_maker.ino (Código do Semáforo)
                        </button>
                        <button onclick="ard_selectUploadSketch('BareMinimum.ino')" id="btn-sketch-bare" style="background:#334155;color:#A7F3D0;border:1px solid #10B981;padding:7px 14px;border-radius:8px;font-weight:bold;font-size:0.82rem;cursor:pointer;">
                            🧹 BareMinimum.ino (Zerar a Placa)
                        </button>
                    </div>
                </div>

                <!-- SIMULADOR REALISTA DA IDE ARDUINO COM COMPILAÇÃO E UPLOAD -->
                <div class="ard-ide-container">
                    <div class="ard-ide-titlebar">
                        <span id="ard-upload-window-title">semaforo_maker | Arduino 1.8.19</span>
                        <div style="display:flex;gap:6px;"><span>—</span><span>▢</span><span>✕</span></div>
                    </div>

                    <!-- Toolbar de Ação Real -->
                    <div class="ard-ide-toolbar">
                        <div class="ard-ide-toolgroup">
                            <button class="ard-btn-round" onclick="ard_runCompilerCheck()" title="Verificar (Compilar)">
                                <i class="fa-solid fa-check" style="color:#34D399;"></i>
                            </button>
                            <button class="ard-btn-round" onclick="ard_runRealUpload()" title="Carregar para o Arduino">
                                <i class="fa-solid fa-arrow-right" style="color:#38BDF8;"></i>
                            </button>
                            <button class="ard-btn-round" onclick="ard_selectUploadSketch('BareMinimum.ino')" title="Zerar com BareMinimum">
                                <i class="fa-solid fa-eraser" style="color:#FBBF24;"></i>
                            </button>
                        </div>
                        <div style="font-family:'Consolas',monospace;font-weight:bold;color:white;font-size:0.85rem;" id="ard-upload-tab-name">
                            semaforo_maker.ino
                        </div>
                        <div>
                            <span style="font-size:0.75rem;background:#006468;padding:4px 10px;border-radius:6px;color:#BAE6FD;">
                                Arduino Uno em COM3
                            </span>
                        </div>
                    </div>

                    <!-- Editor com Fundo Branco -->
                    <div class="ard-ide-editor-box" style="min-height:220px;max-height:260px;">
                        <div class="ard-ide-gutter" id="ard-upload-gutter">1<br>2<br>3<br>4<br>5<br>6<br>7<br>8<br>9<br>10<br>11<br>12</div>
                        <div class="ard-ide-code-area" id="ard-upload-code-text">
<span class="syn-cm">// Código do Semáforo Maker (Pronto para Gravação)</span>
<span class="syn-kw">void</span> <span class="syn-fn">setup</span>() {
  <span class="syn-fn">pinMode</span>(<span class="syn-nm">12</span>, <span class="syn-cn">OUTPUT</span>); <span class="syn-cm">// LED Vermelho</span>
  <span class="syn-fn">pinMode</span>(<span class="syn-nm">11</span>, <span class="syn-cn">OUTPUT</span>); <span class="syn-cm">// LED Amarelo</span>
  <span class="syn-fn">pinMode</span>(<span class="syn-nm">10</span>, <span class="syn-cn">OUTPUT</span>); <span class="syn-cm">// LED Verde</span>
}

<span class="syn-kw">void</span> <span class="syn-fn">loop</span>() {
  <span class="syn-fn">digitalWrite</span>(<span class="syn-nm">10</span>, <span class="syn-cn">HIGH</span>); <span class="syn-fn">delay</span>(<span class="syn-nm">3000</span>); <span class="syn-cm">// Verde</span>
  <span class="syn-fn">digitalWrite</span>(<span class="syn-nm">10</span>, <span class="syn-cn">LOW</span>);  <span class="syn-fn">digitalWrite</span>(<span class="syn-nm">11</span>, <span class="syn-cn">HIGH</span>); <span class="syn-fn">delay</span>(<span class="syn-nm">1200</span>); <span class="syn-cm">// Amarelo</span>
  <span class="syn-fn">digitalWrite</span>(<span class="syn-nm">11</span>, <span class="syn-cn">LOW</span>);  <span class="syn-fn">digitalWrite</span>(<span class="syn-nm">12</span>, <span class="syn-cn">HIGH</span>); <span class="syn-fn">delay</span>(<span class="syn-nm">3000</span>); <span class="syn-cm">// Vermelho</span>
}</div>
                    </div>

                    <!-- Mensagem Teal de Status -->
                    <div class="ard-ide-msg-bar" id="ard-upload-msg-bar">
                        <span id="ard-upload-msg-text">Pronto. Clique em "Carregar" (➔) para gravar na placa.</span>
                    </div>

                    <!-- Console de Saída Real do avrdude -->
                    <div class="ard-ide-console" id="ard-upload-console" style="min-height:90px;">
[IDE] Aguardando comando de compilação ou carregamento via USB...</div>
                </div>

                <!-- BANCADA DE HARDWARE VIRTUAL (LEDS TX/RX E SEMÁFORO EM TEMPO REAL) -->
                <div class="ard-hw-box">
                    <!-- Status da Placa e Comunicação TX/RX -->
                    <div style="text-align:center;">
                        <div style="font-size:0.8rem;color:#94A3B8;font-weight:bold;margin-bottom:6px;">PLACA ARDUINO UNO</div>
                        <div style="display:flex;gap:12px;align-items:center;justify-content:center;background:#0F172A;padding:8px 14px;border-radius:10px;border:1px solid #1E293B;">
                            <div>
                                <span class="ard-comm-led" id="led-tx"></span>
                                <div style="font-size:0.7rem;color:#CBD5E1;font-weight:bold;">TX</div>
                            </div>
                            <div>
                                <span class="ard-comm-led" id="led-rx"></span>
                                <div style="font-size:0.7rem;color:#CBD5E1;font-weight:bold;">RX</div>
                            </div>
                            <div>
                                <span class="ard-comm-led flash-rx" id="led-on" style="background:#10B981;"></span>
                                <div style="font-size:0.7rem;color:#CBD5E1;font-weight:bold;">ON</div>
                            </div>
                            <button onclick="ard_pressPhysicalReset()" style="background:#EF4444;color:white;border:none;padding:4px 10px;border-radius:6px;font-size:0.75rem;font-weight:bold;cursor:pointer;" title="Reiniciar microcontrolador">
                                RESET
                            </button>
                        </div>
                    </div>

                    <!-- LEDs do Semáforo Físico -->
                    <div style="text-align:center;">
                        <div style="font-size:0.8rem;color:#94A3B8;font-weight:bold;margin-bottom:6px;">EXECUÇÃO DO SEMÁFORO (PINOS 12, 11, 10)</div>
                        <div style="display:flex;gap:16px;align-items:center;background:#0F172A;padding:10px 18px;border-radius:12px;border:1px solid #1E293B;">
                            <div style="text-align:center;">
                                <div class="ard-led-indicator" id="hw-led-red"></div>
                                <div style="font-size:0.72rem;color:#FCA5A5;margin-top:4px;font-weight:bold;">12 (RED)</div>
                            </div>
                            <div style="text-align:center;">
                                <div class="ard-led-indicator" id="hw-led-yellow"></div>
                                <div style="font-size:0.72rem;color:#FDE68A;margin-top:4px;font-weight:bold;">11 (YEL)</div>
                            </div>
                            <div style="text-align:center;">
                                <div class="ard-led-indicator" id="hw-led-green"></div>
                                <div style="font-size:0.72rem;color:#A7F3D0;margin-top:4px;font-weight:bold;">10 (GRN)</div>
                            </div>
                        </div>
                    </div>

                    <!-- Feedback de Estado Atual -->
                    <div style="min-width:200px;">
                        <span style="font-size:0.75rem;color:#94A3B8;font-weight:bold;">ESTADO ATUAL NA PLACA:</span>
                        <div id="ard-hw-state-text" style="color:#38BDF8;font-weight:900;font-size:0.95rem;margin-top:2px;">
                            ⏹️ Parado (Aguardando Gravação)
                        </div>
                    </div>
                </div>

                <!-- DESAFIO PRÁTICO NA CARTEIRA -->
                <div class="ard-desk-challenge">
                    <strong>🖐️ Desafio Prático na Sua Carteira:</strong><br>
                    1️⃣ Na IDE do seu computador, clique no botão <b>Verificar (✓)</b> e aguarde aparecer <em>"Compilação terminada"</em>.<br>
                    2️⃣ Clique no botão <b>Carregar (➔)</b> e olhe para a sua placa física: repare nos LEDs <b>TX</b> e <b>RX</b> piscando bem rápido enquanto os bytes entram no chip!<br>
                    3️⃣ Para desligar ou zerar seu Arduino antes de guardar na gaveta, abra <em>Arquivo &gt; Exemplos &gt; 01.Basics &gt; BareMinimum</em> e clique em <b>Carregar</b>!
                </div>
            </div>

            <!-- ================= ABA 6: QUIZ MAKER ================= -->
            <div class="panel" id="ard-tab-quiz">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:15px;flex-wrap:wrap;gap:10px;">
                    <h3 style="color:#F87171;margin:0;font-family:'Fredoka One';font-size:1.3rem;">
                        <i class="fa-solid fa-brain"></i> Desafio Maker: Quiz da IDE, Drivers e Conexão
                    </h3>
                    <div id="ard-quiz-counter" style="background:#0F172A;padding:6px 14px;border-radius:12px;font-weight:900;color:#FCD34D;">Pergunta 1 / 5</div>
                </div>

                <div class="ard-card" style="border:2px solid #EF4444;padding:24px;background:#0F172A;">
                    <h3 id="ard-quiz-q" style="color:white;font-family:'Fredoka One';margin-top:0;font-size:1.2rem;line-height:1.5;">
                        Carregando pergunta...
                    </h3>
                    <div id="ard-quiz-opts" style="display:flex;flex-direction:column;gap:10px;margin-top:16px;"></div>
                    <div id="ard-quiz-feedback" style="margin-top:16px;font-size:0.92rem;line-height:1.5;"></div>
                </div>
            </div>
        </div>

        <!-- OVERLAY MODAL GUIA PARA INICIANTES (TOUR PASSO A PASSO) -->
        <div class="ard-tour-overlay" id="ard-tour-overlay">
            <div class="ard-tour-card">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
                    <span class="ard-tour-step-badge" id="ard-tour-step-badge">PASSO 1 DE 9</span>
                    <button onclick="ard_closeOverlayTour()" style="background:transparent;border:none;color:#94A3B8;cursor:pointer;font-size:1.2rem;padding:4px 8px;">✕</button>
                </div>
                <h3 class="ard-tour-title" id="ard-tour-title">
                    <i class="fa-solid fa-info-circle"></i> Título do Passo
                </h3>
                <p class="ard-tour-desc" id="ard-tour-desc">
                    Descrição do passo para iniciantes.
                </p>
                <div class="ard-tour-footer">
                    <button class="ard-tour-btn" id="ard-tour-btn-prev" onclick="ard_prevOverlayTour()" style="background:#334155;color:#E2E8F0;">
                        ◀ Anterior
                    </button>
                    <div style="display:flex;gap:8px;">
                        <button class="ard-tour-btn" onclick="ard_closeOverlayTour()" style="background:transparent;color:#94A3B8;border:1px solid #475569;">
                            Sair do Tour
                        </button>
                        <button class="ard-tour-btn" id="ard-tour-btn-next" onclick="ard_nextOverlayTour()" style="background:#0284C7;color:white;">
                            Próximo Passo ▶
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- MODAL GUIA OFICIAL DE DRIVERS (CH340 / FTDI / UNO) -->
        <div class="ard-modal" id="ard-driver-modal">
            <div class="ard-modal-box" style="max-width:620px;text-align:left;">
                <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:2px solid #334155;padding-bottom:10px;margin-bottom:15px;">
                    <h3 style="color:white;font-family:'Fredoka One';margin:0;font-size:1.25rem;">
                        <i class="fa-solid fa-wrench" style="color:#0284C7;"></i> Guia Oficial de Instalação de Drivers
                    </h3>
                    <button onclick="ard_closeDriverModal()" style="background:transparent;border:none;color:#94A3B8;cursor:pointer;font-size:1.2rem;">✕</button>
                </div>

                <div style="max-height:400px;overflow-y:auto;padding-right:6px;font-size:0.88rem;line-height:1.6;color:#CBD5E1;">
                    <p>
                        Se a sua placa não foi reconhecida pelo computador ou apareceu com triângulo amarelo <b>⚠️ USB2.0-Serial</b>, você precisa do driver do chip de comunicação USB:
                    </p>

                    <!-- OPÇÃO 1: CH340 -->
                    <div style="background:#0F172A;padding:12px;border-radius:10px;margin-bottom:10px;border-left:4px solid #F59E0B;">
                        <strong style="color:#FBBF24;">1. Driver CH340 / CH341 (Mais comum em kits escolares)</strong>
                        <p style="margin:4px 0 8px;font-size:0.84rem;">
                            Utilizado na maioria das placas compatíveis e clones do Arduino Uno e Nano.
                        </p>
                        <a href="https://www.wch-ic.com/downloads/CH341SER_EXE.html" target="_blank" rel="noopener noreferrer" style="background:#00979d;color:white;padding:6px 14px;border-radius:6px;text-decoration:none;font-weight:bold;font-size:0.8rem;display:inline-block;">
                            🌐 Download Oficial CH341SER.EXE (WCH)
                        </a>
                    </div>

                    <!-- OPÇÃO 2: FTDI -->
                    <div style="background:#0F172A;padding:12px;border-radius:10px;margin-bottom:10px;border-left:4px solid #38BDF8;">
                        <strong style="color:#38BDF8;">2. Driver FTDI FT232R</strong>
                        <p style="margin:4px 0 8px;font-size:0.84rem;">
                            Utilizado em placas com chips FTDI originais.
                        </p>
                        <a href="https://ftdichip.com/drivers/vcp-drivers/" target="_blank" rel="noopener noreferrer" style="background:#0284C7;color:white;padding:6px 14px;border-radius:6px;text-decoration:none;font-weight:bold;font-size:0.8rem;display:inline-block;">
                            🌐 Download Oficial Drivers FTDI VCP
                        </a>
                    </div>

                    <!-- OPÇÃO 3: ARDUINO UNO ORIGINAL -->
                    <div style="background:#0F172A;padding:12px;border-radius:10px;border-left:4px solid #10B981;">
                        <strong style="color:#34D399;">3. Arduino Uno Original (ATmega16U2)</strong>
                        <p style="margin:4px 0 8px;font-size:0.84rem;">
                            Já incluído na pasta de instalação da própria Arduino IDE em <code>C:\\Program Files (x86)\\Arduino\\drivers</code>.
                        </p>
                    </div>
                </div>

                <div style="text-align:right;margin-top:16px;">
                    <button class="ard-real-btn" onclick="ard_closeDriverModal()" style="padding:8px 20px;font-size:0.9rem;">
                        Entendi, Fechar
                    </button>
                </div>
            </div>
        </div>

        <!-- MODAL DE PROPRIEDADES DO DISPOSITIVO WINDOWS -->
        <div class="ard-dev-props-modal" id="ard-dev-props-modal">
            <div class="ard-dev-props-box">
                <div style="background:#E2E8F0;padding:8px 14px;display:flex;justify-content:space-between;align-items:center;font-size:0.82rem;font-weight:bold;color:#0F172A;border-bottom:1px solid #CBD5E1;">
                    <span>Propriedades de Arduino Uno (COM3)</span>
                    <button onclick="ard_closeDeviceProperties()" style="background:transparent;border:none;cursor:pointer;font-weight:bold;">✕</button>
                </div>
                <div style="padding:14px;font-size:0.84rem;">
                    <div style="display:flex;gap:12px;align-items:center;margin-bottom:14px;">
                        <i class="fa-solid fa-microchip" style="font-size:2rem;color:#059669;"></i>
                        <div>
                            <b>Arduino Uno (COM3)</b>
                            <div style="color:#64748B;font-size:0.78rem;">Tipo: Portas (COM e LPT)</div>
                            <div style="color:#64748B;font-size:0.78rem;">Fabricante: Arduino LLC</div>
                        </div>
                    </div>
                    <div style="background:#F8FAFC;border:1px solid #E2E8F0;border-radius:6px;padding:10px;line-height:1.6;">
                        <div><b>Status do dispositivo:</b> <span style="color:#059669;font-weight:bold;">Este dispositivo está funcionando corretamente.</span></div>
                        <div><b>Local:</b> no Dispositivo USB Serial</div>
                        <div><b>Bits por segundo (Baud):</b> 9600</div>
                        <div><b>Bits de dados:</b> 8</div>
                        <div><b>Paridade:</b> Nenhum</div>
                        <div><b>Bits de parada:</b> 1</div>
                        <div><b>Controle de fluxo:</b> Nenhum</div>
                    </div>
                </div>
                <div style="background:#F1F5F9;padding:10px 14px;text-align:right;border-top:1px solid #E2E8F0;">
                    <button onclick="ard_closeDeviceProperties()" style="background:#0284C7;color:white;border:none;padding:5px 18px;border-radius:6px;font-weight:bold;cursor:pointer;font-size:0.82rem;">OK</button>
                </div>
            </div>
        </div>

        <!-- MODAL INFORMAÇÕES DA PLACA -->
        <div class="ard-dev-props-modal" id="ard-board-info-modal">
            <div class="ard-dev-props-box" style="max-width:440px;">
                <div style="background:#00797F;color:white;padding:8px 14px;display:flex;justify-content:space-between;align-items:center;font-weight:bold;font-size:0.85rem;">
                    <span><i class="fa-solid fa-microchip"></i> Informações da Placa</span>
                    <button onclick="document.getElementById('ard-board-info-modal').classList.remove('open')" style="background:transparent;border:none;color:white;cursor:pointer;font-weight:bold;">✕</button>
                </div>
                <div style="padding:16px;font-size:0.86rem;line-height:1.7;color:#1E293B;">
                    <div><b>Placa:</b> <span id="inf-board-name">Arduino Uno</span></div>
                    <div><b>Porta:</b> <span id="inf-board-port">COM3</span></div>
                    <div><b>BN (Board Name):</b> arduino:avr:uno</div>
                    <div><b>VID (Vendor ID):</b> 0x2341 (Arduino SA)</div>
                    <div><b>PID (Product ID):</b> 0x0043 (Uno R3)</div>
                    <div><b>Número de Série (SN):</b> 752303138333518171E1</div>
                </div>
                <div style="background:#F1F5F9;padding:8px 14px;text-align:right;border-top:1px solid #E2E8F0;">
                    <button onclick="document.getElementById('ard-board-info-modal').classList.remove('open')" style="background:#00797F;color:white;border:none;padding:5px 18px;border-radius:6px;font-weight:bold;cursor:pointer;">OK</button>
                </div>
            </div>
        </div>

        <!-- MODAL DO PLOTTER SERIAL DA ARDUINO IDE -->
        <div class="ard-plotter-modal" id="ard-plotter-modal">
            <div class="ard-plotter-window">
                <!-- Titlebar -->
                <div class="ard-plotter-titlebar">
                    <div style="display:flex;align-items:center;gap:8px;">
                        <i class="fa-solid fa-chart-line" style="color:#34D399;"></i>
                        <span id="ard-plotter-win-title">Plotter Serial — COM3 (Arduino Uno)</span>
                    </div>
                    <div style="display:flex;gap:8px;align-items:center;">
                        <span style="font-size:0.75rem;background:#004D50;padding:2px 8px;border-radius:4px;color:#A7F3D0;">Modo Tempo Real</span>
                        <button onclick="ard_closeSerialPlotter()" style="background:transparent;border:none;color:white;cursor:pointer;font-size:1rem;font-weight:bold;padding:0 4px;" title="Fechar">✕</button>
                    </div>
                </div>

                <!-- Ribbon Toolbar -->
                <div class="ard-plotter-ribbon">
                    <div class="ard-plotter-control-item">
                        <span><i class="fa-solid fa-satellite-dish"></i> Entrada do Arduino:</span>
                        <select class="ard-plotter-select" id="ard-plotter-source-select" onchange="ard_changePlotterSource(this.value)">
                            <option value="pot_ldr">🕹️ Potenciômetro (A0) & Sensor LDR (A1)</option>
                            <option value="traffic_light">🚦 Semáforo Digital (Pinos 10, 11, 12)</option>
                            <option value="sine_pwm">〰️ Modulação PWM Senoidal & Cossenoidal</option>
                            <option value="noise">⚡ Ruído Eletromagnético (Pino A2 Aberto)</option>
                        </select>
                    </div>

                    <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
                        <div class="ard-plotter-control-item">
                            <span>Escala:</span>
                            <select class="ard-plotter-select" id="ard-plotter-scale-select" onchange="ard_changePlotterScale(this.value)">
                                <option value="adc">0 a 1023 (10-bit ADC)</option>
                                <option value="volts">0.0V a 5.0V (Tensão Real)</option>
                            </select>
                        </div>

                        <div class="ard-plotter-control-item">
                            <span>Baud:</span>
                            <select class="ard-plotter-select" id="ard-plotter-baud-select" onchange="ard_changePlotterBaud(this.value)">
                                <option value="9600" selected>9600 baud</option>
                                <option value="19200">19200 baud</option>
                                <option value="115200">115200 baud</option>
                            </select>
                        </div>

                        <button class="ard-plotter-btn" id="ard-plotter-pause-btn" onclick="ard_togglePlotterPause()">
                            <i class="fa-solid fa-pause"></i> <span id="ard-plotter-pause-text">Pausar</span>
                        </button>
                        <button class="ard-plotter-btn" onclick="ard_clearPlotter()">
                            <i class="fa-solid fa-trash-can"></i> Limpar
                        </button>
                    </div>
                </div>

                <!-- Legenda de Canais e Valores Numéricos em Tempo Real -->
                <div class="ard-plotter-legend" id="ard-plotter-legend-box">
                    <!-- Gerado dinamicamente -->
                </div>

                <!-- Aviso de Baud Incompatível -->
                <div id="ard-plotter-baud-warning" style="display:none;background:#7F1D1D;color:#FECACA;padding:6px 14px;font-size:0.8rem;font-weight:bold;border-bottom:1px solid #EF4444;">
                    ⚠️ ATENÇÃO: Taxa de transmissão incompatível! O código do Arduino está transmitindo em 9600 baud, gerando caracteres e valores corrompidos no gráfico.
                </div>

                <!-- Canvas Gráfico -->
                <div class="ard-plotter-canvas-container">
                    <canvas id="ard-plotter-canvas" width="840" height="280" style="width:100%;height:280px;border-radius:8px;display:block;background:#090D16;"></canvas>
                </div>

                <!-- Painel Inferior Interativo de Hardware -->
                <div class="ard-plotter-bottom-panel">
                    <div id="ard-plotter-interactive-hw">
                        <!-- Controles interativos para Potenciômetro e LDR ou Semáforo -->
                    </div>

                    <!-- Código C++ Educativo que gera este gráfico -->
                    <div style="margin-top:10px;background:#0F172A;border:1px solid #334155;border-radius:8px;padding:8px 12px;">
                        <div style="display:flex;justify-content:space-between;align-items:center;cursor:pointer;" onclick="ard_togglePlotterCodeSnippet()">
                            <span style="font-size:0.8rem;color:#38BDF8;font-weight:bold;">
                                💡 Código Arduino C++ gerador deste gráfico (Como o Plotter Serial funciona):
                            </span>
                            <span style="font-size:0.75rem;color:#94A3B8;" id="ard-plotter-code-toggle-arrow">▼ Ver Código</span>
                        </div>
                        <div id="ard-plotter-code-snippet" style="display:none;margin-top:8px;font-family:'Consolas',monospace;font-size:0.78rem;color:#E2E8F0;background:#050811;padding:8px 10px;border-radius:6px;border-left:3px solid #00979D;">
                            // O Plotter Serial reconhece múltiplos canais quando os números são separados por espaço ou tabulação!<br>
                            <span style="color:#D35400;">Serial</span>.print(analogRead(A0));   <span style="color:#7F8C8D;">// Canal 1</span><br>
                            <span style="color:#D35400;">Serial</span>.print(<span style="color:#2E86C1;">" "</span>);            <span style="color:#7F8C8D;">// Espaço separador obrigatório</span><br>
                            <span style="color:#D35400;">Serial</span>.println(analogRead(A1)); <span style="color:#7F8C8D;">// Canal 2 (println pula linha e finaliza o ponto no gráfico)</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- MODAL DO MONITOR SERIAL REALISTA -->
        <div class="ard-monitor-modal" id="ard-serial-monitor-modal">
            <div class="ard-monitor-window">
                <div class="ard-monitor-titlebar">
                    <div style="display:flex;align-items:center;gap:8px;">
                        <i class="fa-solid fa-magnifying-glass" style="color:#38BDF8;"></i>
                        <span id="ard-monitor-win-title">COM3 (Arduino Uno) — Monitor Serial</span>
                    </div>
                    <button onclick="ard_closeSerialMonitor()" style="background:transparent;border:none;color:white;cursor:pointer;font-weight:bold;font-size:0.95rem;">✕</button>
                </div>
                <div class="ard-monitor-sendbar">
                    <input type="text" class="ard-monitor-input" id="ard-monitor-send-input" placeholder="Digite uma mensagem ou comando para enviar ao Arduino..." onkeydown="if(event.key==='Enter') ard_sendSerialMessage()">
                    <button class="ard-monitor-sendbtn" onclick="ard_sendSerialMessage()">Enviar</button>
                </div>
                <div class="ard-monitor-body" id="ard-monitor-log-box"></div>
                <div class="ard-monitor-footer">
                    <div style="display:flex;align-items:center;gap:12px;">
                        <label style="display:flex;align-items:center;gap:5px;cursor:pointer;">
                            <input type="checkbox" id="ard-monitor-chk-scroll" checked onchange="ard_serialAutoscroll = this.checked"> Autoscroll
                        </label>
                        <label style="display:flex;align-items:center;gap:5px;cursor:pointer;">
                            <input type="checkbox" id="ard-monitor-chk-time" checked onchange="ard_serialTimestamp = this.checked"> Carimbo de data/hora
                        </label>
                        <button onclick="ard_clearSerialMonitor()" style="background:#E2E8F0;border:1px solid #CBD5E1;padding:2px 8px;border-radius:4px;cursor:pointer;font-size:0.75rem;font-weight:bold;">
                            Limpar saída
                        </button>
                    </div>
                    <div style="display:flex;align-items:center;gap:8px;">
                        <select style="background:white;border:1px solid #CBD5E1;padding:3px 6px;border-radius:4px;font-size:0.76rem;">
                            <option>Nova linha (NL)</option>
                            <option>Retorno de carro (CR)</option>
                            <option>NL &amp; CR</option>
                            <option>Sem final de linha</option>
                        </select>
                        <select style="background:white;border:1px solid #CBD5E1;padding:3px 6px;border-radius:4px;font-size:0.76rem;font-weight:bold;color:#00797F;">
                            <option>9600 baud</option>
                            <option>19200 baud</option>
                            <option>115200 baud</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>

        <!-- MODAL DE CONCLUSÃO DO QUIZ -->
        <div class="ard-modal" id="ard-modal">
            <div class="ard-modal-box">
                <div style="font-size:4rem;margin-bottom:10px;" id="ard-mIcon">🏆</div>
                <h2 style="color:white;font-family:'Fredoka One';margin:0;" id="ard-mTitle">Mestre da IDE & Arduino!</h2>
                <p style="color:#CBD5E1;margin:15px 0;" id="ard-mText">Você dominou a instalação da IDE, configuração dos drivers e portas COMx!</p>
                <button class="ard-real-btn" style="padding:10px 26px;font-size:0.95rem;" onclick="ard_closeModal()">Continuar</button>
            </div>
        </div>

        <!-- MODAL ABRIR ESBOÇO WINDOWS (CTRL+O) -->
        <div class="ard-dialog-modal" id="ard-file-dialog-modal">
            <div class="ard-devmgmt-window" style="max-width:540px;width:95%;">
                <div class="ard-devmgmt-titlebar">
                    <div style="display:flex;align-items:center;gap:6px;">
                        <i class="fa-regular fa-folder-open" style="color:#00979D;"></i>
                        <span>Abrir Esboço do Arduino (.ino)</span>
                    </div>
                    <button class="ard-devmgmt-win-btn close" onclick="ard_closeWindowsFileDialog()">✕</button>
                </div>
                <div style="padding:14px 18px;background:#F8FAFC;">
                    <div style="font-size:0.84rem;color:#475569;margin-bottom:10px;">
                        📁 Selecione um esboço salvo na pasta <b>Documentos / Arduino</b>:
                    </div>
                    <div style="display:flex;flex-direction:column;gap:8px;" id="ard-file-dialog-list"></div>
                </div>
                <div style="background:#E2E8F0;padding:10px 18px;display:flex;justify-content:flex-end;gap:8px;border-top:1px solid #CBD5E1;">
                    <button onclick="ard_closeWindowsFileDialog()" style="background:#FFFFFF;border:1px solid #94A3B8;padding:6px 16px;border-radius:4px;font-size:0.84rem;cursor:pointer;font-weight:600;">Cancelar</button>
                </div>
            </div>
        </div>
    `;

    ard_init();

    document.getElementById('arduino-loaded')?.remove();
    const flag = document.createElement('div');
    flag.id = 'arduino-loaded';
    flag.style.display = 'none';
    container.appendChild(flag);
}

function ard_init() {
    document.querySelectorAll('.ard-wrapper .tab').forEach(tab => {
        tab.onclick = () => {
            document.querySelectorAll('.ard-wrapper .tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.ard-wrapper .panel').forEach(p => p.classList.remove('active'));
            tab.classList.add('active');
            const targetPanel = document.getElementById(tab.dataset.tab);
            if (targetPanel) targetPanel.classList.add('active');
            if (tab.dataset.tab === 'ard-tab-quiz') ard_initQuiz();
            if (tab.dataset.tab === 'ard-tab-port' && typeof ard_updateBenchVisuals === 'function') ard_updateBenchVisuals();
            if (tab.dataset.tab === 'ard-tab-gui') {
                const code = ard_sketches[ard_activeSketchName] || ard_sketches['semaforo_maker.ino'];
                ard_setEditorCode(code, ard_activeSketchName || 'semaforo_maker.ino');
                setTimeout(() => {
                    if (typeof ard_syncEditorScroll === 'function') ard_syncEditorScroll();
                }, 20);
            }
            try {
                if (typeof playSound === 'function') playSound('step');
            } catch(e) {}
        };
    });

    // Fecha dropdowns da IDE ao clicar fora
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.ard-ide-menu-btn') && !e.target.closest('.ard-dropdown-menu')) {
            document.querySelectorAll('.ard-dropdown-menu.show').forEach(m => m.classList.remove('show'));
        }
    });

    // Event listener para teclado no overlay tour e atalhos da IDE
    window.addEventListener('keydown', (e) => {
        const overlay = document.getElementById('ard-tour-overlay');
        if (overlay && overlay.classList.contains('active')) {
            if (e.key === 'ArrowRight') ard_nextOverlayTour();
            else if (e.key === 'ArrowLeft') ard_prevOverlayTour();
            else if (e.key === 'Escape') ard_closeOverlayTour();
        }

        // Atalhos oficiais da Arduino IDE:
        if ((e.ctrlKey || e.metaKey) && e.shiftKey) {
            if (e.key === 'L' || e.key === 'l') {
                e.preventDefault();
                ard_openSerialPlotter();
            } else if (e.key === 'M' || e.key === 'm') {
                e.preventDefault();
                ard_toggleSerialWindow();
            }
        } else if ((e.ctrlKey || e.metaKey) && (e.key === 'o' || e.key === 'O')) {
            e.preventDefault();
            ard_openWindowsFileDialog();
        }
    });

    // Inicializa o editor com o esboço padrão semáforo e destaque de sintaxe
    try {
        ard_loadSketch('semaforo_maker.ino');
    } catch(e) {}
    setTimeout(() => {
        try {
            ard_loadSketch(ard_activeSketchName || 'semaforo_maker.ino');
            if (typeof ard_updateBenchVisuals === 'function') ard_updateBenchVisuals();
        } catch(e) {}
    }, 50);
}

function ard_switchTabDirect(tabId) {
    const btn = document.querySelector(`.ard-wrapper .tab[data-tab="${tabId}"]`);
    if (btn) btn.click();
}

/* ================= ABA 2: GERENCIADOR DE DISPOSITIVOS ================= */
function ard_toggleUsbCable() {
    ard_isUsbConnected = !ard_isUsbConnected;
    const btn = document.getElementById('ard-cable-btn');
    const com3Line = document.getElementById('ard-dev-com3');
    const emptyLine = document.getElementById('ard-dev-empty');
    const otherBox = document.getElementById('ard-devmgmt-other');
    const badge = document.getElementById('ard-win-com-badge');
    const pill = document.getElementById('ard-ide-live-status-pill');

    if (ard_isUsbConnected) {
        if (typeof playSound === 'function') playSound('step');
        if (btn) btn.innerHTML = '<span>🔌 Desconectar Cabo USB</span>';
        if (ard_driverInstalled) {
            if (com3Line) com3Line.style.display = 'flex';
            if (emptyLine) emptyLine.style.display = 'none';
            if (otherBox) otherBox.style.display = 'none';
            if (badge) { badge.innerText = 'COM3'; badge.style.color = '#059669'; }
            if (pill) {
                pill.style.background = '#064E3B';
                pill.style.borderColor = '#10B981';
                pill.style.color = '#34D399';
                pill.innerText = `🟢 Conexão Ativa: ${ard_selectedBoard} em ${ard_selectedPort.split(' ')[0]}`;
            }
        } else {
            if (com3Line) com3Line.style.display = 'none';
            if (emptyLine) emptyLine.style.display = 'flex';
            if (otherBox) otherBox.style.display = 'block';
            if (badge) { badge.innerText = '⚠️ SEM DRIVER'; badge.style.color = '#D97706'; }
            if (pill) {
                pill.style.background = '#78350F';
                pill.style.borderColor = '#F59E0B';
                pill.style.color = '#FDE68A';
                pill.innerText = `⚠️ Cabo Conectado, mas SEM DRIVER!`;
            }
        }
    } else {
        if (typeof playSound === 'function') playSound('click');
        if (btn) btn.innerHTML = '<span>🔌 Conectar Cabo USB</span>';
        if (com3Line) com3Line.style.display = 'none';
        if (emptyLine) emptyLine.style.display = 'flex';
        if (otherBox) otherBox.style.display = 'none';
        if (badge) { badge.innerText = 'DESCONECTADO'; badge.style.color = '#EF4444'; }
        if (pill) {
            pill.style.background = '#7F1D1D';
            pill.style.borderColor = '#EF4444';
            pill.style.color = '#FCA5A5';
            pill.innerText = `🔴 Cabo USB Desconectado`;
        }
    }
    if (typeof ard_updateBenchVisuals === 'function') ard_updateBenchVisuals();
}

function ard_simDriverStatus(installed) {
    ard_driverInstalled = installed;
    if (typeof playSound === 'function') playSound(installed ? 'success' : 'error');

    const com3Line = document.getElementById('ard-dev-com3');
    const emptyLine = document.getElementById('ard-dev-empty');
    const otherBox = document.getElementById('ard-devmgmt-other');
    const badge = document.getElementById('ard-win-com-badge');
    const btnMissing = document.getElementById('btn-driver-missing');
    const btnInstalled = document.getElementById('btn-driver-installed');
    const pill = document.getElementById('ard-ide-live-status-pill');

    if (btnMissing && btnInstalled) {
        if (installed) {
            btnInstalled.style.background = '#064E3B';
            btnInstalled.style.borderColor = '#10B981';
            btnMissing.style.background = '#334155';
            btnMissing.style.borderColor = '#F59E0B';
        } else {
            btnMissing.style.background = '#78350F';
            btnMissing.style.borderColor = '#F59E0B';
            btnInstalled.style.background = '#1E293B';
            btnInstalled.style.borderColor = '#475569';
        }
    }

    if (ard_isUsbConnected) {
        if (installed) {
            if (com3Line) com3Line.style.display = 'flex';
            if (emptyLine) emptyLine.style.display = 'none';
            if (otherBox) otherBox.style.display = 'none';
            if (badge) { badge.innerText = 'COM3'; badge.style.color = '#059669'; }
            if (pill) {
                pill.style.background = '#064E3B';
                pill.style.borderColor = '#10B981';
                pill.style.color = '#34D399';
                pill.innerText = `🟢 Conexão Ativa: ${ard_selectedBoard} em ${ard_selectedPort.split(' ')[0]}`;
            }
        } else {
            if (com3Line) com3Line.style.display = 'none';
            if (emptyLine) emptyLine.style.display = 'flex';
            if (otherBox) otherBox.style.display = 'block';
            if (badge) { badge.innerText = '⚠️ SEM DRIVER'; badge.style.color = '#D97706'; }
            if (pill) {
                pill.style.background = '#78350F';
                pill.style.borderColor = '#F59E0B';
                pill.style.color = '#FDE68A';
                pill.innerText = `⚠️ Cabo Conectado, mas SEM DRIVER!`;
            }
        }
    }
}

function ard_scanHardwareChanges() {
    if (typeof playSound === 'function') playSound('step');
    const scanBar = document.getElementById('ard-scan-progress');
    if (scanBar) scanBar.style.display = 'flex';

    setTimeout(() => {
        if (scanBar) scanBar.style.display = 'none';
        if (typeof playSound === 'function') playSound('success');
        if (ard_isUsbConnected && ard_driverInstalled) {
            const comLine = document.getElementById('ard-dev-com3');
            if (comLine) {
                comLine.classList.add('selected');
                setTimeout(() => comLine.classList.remove('selected'), 1200);
            }
        }
    }, 700);
}

function ard_closeDevMgmtWindow() {
    if (typeof playSound === 'function') playSound('click');
    const box = document.getElementById('ard-devmgmt-box');
    if (box) box.classList.remove('open');
}

function ard_togglePortsFolder() {
    const list = document.getElementById('ard-ports-children');
    const arrow = document.getElementById('ard-ports-arrow');
    if (!list) return;
    const isHidden = list.style.display === 'none';
    list.style.display = isHidden ? 'block' : 'none';
    if (arrow) arrow.innerText = isHidden ? '▼' : '▶';
}

function ard_openDeviceProperties() {
    if (typeof playSound === 'function') playSound('click');
    const modal = document.getElementById('ard-dev-props-modal');
    if (modal) modal.classList.add('open');
}

function ard_closeDeviceProperties() {
    if (typeof playSound === 'function') playSound('click');
    const modal = document.getElementById('ard-dev-props-modal');
    if (modal) modal.classList.remove('open');
}

function ard_openDriverModal() {
    if (typeof playSound === 'function') playSound('click');
    const modal = document.getElementById('ard-driver-modal');
    if (modal) modal.classList.add('active');
}

function ard_closeDriverModal() {
    if (typeof playSound === 'function') playSound('click');
    const modal = document.getElementById('ard-driver-modal');
    if (modal) modal.classList.remove('active');
}

/* ================= ABA 3: COMPONENTE DA ARDUINO IDE SIMULATION ================= */
const ard_pinDescriptions = {
    1: {
        title: '1. Verificar (Compilar)',
        category: 'Barra de Ferramentas',
        badgeColor: '#34D399',
        desc: 'Compila e aprova o seu código. O compilador detectará erros de sintaxe (como ponto e vírgula ou parênteses faltantes).'
    },
    2: {
        title: '2. Carregar (Upload)',
        category: 'Barra de Ferramentas',
        badgeColor: '#38BDF8',
        desc: 'Envia o seu código compilado para a placa Arduino através do cabo USB gravando na memória flash.'
    },
    3: {
        title: '3. Novo',
        category: 'Barra de Ferramentas',
        badgeColor: '#FDE68A',
        desc: 'Abre uma nova janela de código em branco com o esboço básico pronto para programar.'
    },
    4: {
        title: '4. Abrir',
        category: 'Barra de Ferramentas',
        badgeColor: '#FBBF24',
        desc: 'Permite abrir um esboço (.ino) existente salvo no computador ou nos exemplos do Arduino.'
    },
    5: {
        title: '5. Salvar',
        category: 'Barra de Ferramentas',
        badgeColor: '#A78BFA',
        desc: 'Salva o esboço atualmente ativo no seu computador com todas as alterações recentes.'
    },
    6: {
        title: '6. Monitor Serial',
        category: 'Comunicação Serial',
        badgeColor: '#38BDF8',
        desc: 'Abre uma janela que exibirá qualquer informação serial que sua placa Arduino está transmitindo para o seu computador. Você estudará melhor essa funcionalidade ao longo do material.'
    },
    7: {
        title: '7. Nome do Esboço',
        category: 'Aba de Navegação',
        badgeColor: '#F472B6',
        desc: 'Mostra o nome do esboço (sketch) no qual você está trabalhando atualmente (ex: semaforo_maker.ino).'
    },
    8: {
        title: '8. Área do Código',
        category: 'Editor de Código C++',
        badgeColor: '#E2E8F0',
        desc: 'Esta é a área onde você compõe o código para o seu esboço, com destaque sintático colorido em tempo real.'
    },
    9: {
        title: '9. Área de Mensagens',
        category: 'Barra de Status',
        badgeColor: '#00979D',
        desc: 'É onde a IDE diz se houve algum erro no seu código ou se o código foi compilado e carregado corretamente.'
    },
    10: {
        title: '10. Console de Texto',
        category: 'Console de Saída',
        badgeColor: '#94A3B8',
        desc: 'Mostra mensagens de erro completas e detalhes do avrdude. O console de texto é muito útil para a depuração.'
    },
    11: {
        title: '11. Placa e Porta Serial',
        category: 'Rodapé de Conexão',
        badgeColor: '#34D399',
        desc: 'Mostra a placa e a porta serial selecionadas (ex: Arduino Uno na COM3), confirmando a comunicação pronta.'
    }
};

function ard_getPinTooltipEl() {
    let tooltip = document.getElementById('ard-pin-tooltip');
    if (!tooltip) {
        tooltip = document.createElement('div');
        tooltip.id = 'ard-pin-tooltip';
        tooltip.className = 'ard-pin-tooltip';
        tooltip.innerHTML = `
            <div class="ard-tooltip-header">
                <span class="ard-tooltip-badge" id="ard-tt-badge">1</span>
                <div style="flex:1;">
                    <div class="ard-tooltip-title" id="ard-tt-title">1. Verificar</div>
                    <div class="ard-tooltip-category" id="ard-tt-category">Componente Arduino IDE</div>
                </div>
            </div>
            <div class="ard-tooltip-body" id="ard-tt-desc"></div>
            <div class="ard-tooltip-footer">
                <i class="fa-solid fa-hand-pointer"></i> <span>Clique para destacar no editor!</span>
            </div>
            <div class="ard-tooltip-arrow" id="ard-tt-arrow"></div>
        `;
        document.body.appendChild(tooltip);
    } else if (tooltip.parentElement !== document.body) {
        document.body.appendChild(tooltip);
    }
    return tooltip;
}

let ard_tooltipHideTimer = null;

function ard_showPinTooltip(eventOrElement, pinNum) {
    if (ard_tooltipHideTimer) {
        clearTimeout(ard_tooltipHideTimer);
        ard_tooltipHideTimer = null;
    }

    const data = ard_pinDescriptions[pinNum];
    if (!data) return;

    const tooltip = ard_getPinTooltipEl();
    if (!tooltip) return;

    const badge = document.getElementById('ard-tt-badge');
    const title = document.getElementById('ard-tt-title');
    const cat = document.getElementById('ard-tt-category');
    const desc = document.getElementById('ard-tt-desc');

    if (badge) {
        badge.innerText = pinNum;
        badge.style.background = data.badgeColor || '#00979D';
        badge.style.color = (pinNum === 3 || pinNum === 8) ? '#0F172A' : '#FFFFFF';
        badge.style.boxShadow = `0 0 12px ${data.badgeColor || '#00979D'}`;
    }
    if (title) {
        title.innerText = data.title;
        title.style.color = data.badgeColor || '#38BDF8';
    }
    if (cat) cat.innerText = data.category;
    if (desc) desc.innerText = data.desc;

    // Destaca o card correspondente na lista abaixo se existir
    document.querySelectorAll('.ard-card.hover-glow').forEach(c => c.classList.remove('hover-glow'));
    const linkedCard = document.getElementById(`ard-card-pin-${pinNum}`);
    if (linkedCard) {
        linkedCard.classList.add('hover-glow');
    }

    // Identifica o elemento âncora disparador
    let triggerEl = null;
    if (eventOrElement instanceof Element) {
        triggerEl = eventOrElement;
    } else if (eventOrElement && eventOrElement.currentTarget) {
        triggerEl = eventOrElement.currentTarget;
    } else if (eventOrElement && eventOrElement.target) {
        triggerEl = eventOrElement.target;
    }

    if (!triggerEl) {
        triggerEl = document.getElementById('target-pin-' + pinNum);
    }
    if (!triggerEl) return;

    const rect = triggerEl.getBoundingClientRect();

    // Mede dimensões reais do tooltip no DOM
    tooltip.style.display = 'block';
    tooltip.style.visibility = 'hidden';
    tooltip.style.opacity = '0';
    tooltip.style.left = '0px';
    tooltip.style.top = '0px';

    const tooltipW = tooltip.offsetWidth || 320;
    const tooltipH = tooltip.offsetHeight || 135;

    let left = rect.left + (rect.width / 2) - (tooltipW / 2);
    if (left < 12) left = 12;
    if (left + tooltipW > window.innerWidth - 12) {
        left = window.innerWidth - tooltipW - 12;
    }

    let top = rect.top - tooltipH - 12;
    let isBelow = false;
    if (top < 10) {
        top = rect.bottom + 12;
        isBelow = true;
    }

    tooltip.style.left = `${Math.round(left)}px`;
    tooltip.style.top = `${Math.round(top)}px`;

    // Posiciona e ajusta a seta indicadora
    const arrow = document.getElementById('ard-tt-arrow');
    if (arrow) {
        const arrowCenterX = (rect.left + rect.width / 2) - left;
        const arrowClampedX = Math.max(16, Math.min(tooltipW - 22, arrowCenterX));
        arrow.style.left = `${Math.round(arrowClampedX)}px`;
        if (isBelow) {
            arrow.className = 'ard-tooltip-arrow arrow-top';
        } else {
            arrow.className = 'ard-tooltip-arrow arrow-bottom';
        }
    }

    // Ativa visibilidade e animação
    tooltip.style.visibility = 'visible';
    tooltip.classList.add('visible');
    tooltip.style.opacity = '1';
    tooltip.style.transform = 'translateY(0)';
}

function ard_hidePinTooltip() {
    if (ard_tooltipHideTimer) clearTimeout(ard_tooltipHideTimer);
    ard_tooltipHideTimer = setTimeout(() => {
        const tooltip = document.getElementById('ard-pin-tooltip');
        if (tooltip) {
            tooltip.classList.remove('visible');
            tooltip.style.opacity = '0';
            tooltip.style.transform = 'translateY(6px)';
            setTimeout(() => {
                if (!tooltip.classList.contains('visible')) {
                    tooltip.style.display = 'none';
                }
            }, 160);
        }
        document.querySelectorAll('.ard-card.hover-glow').forEach(c => c.classList.remove('hover-glow'));
    }, 50);
}

function ard_onCardHover(pinNum, targetId) {
    const el = document.getElementById(targetId);
    if (el) {
        el.classList.add('ard-highlight-target');
        ard_showPinTooltip(el, pinNum);
    }
}

function ard_onCardLeave() {
    document.querySelectorAll('.ard-highlight-target').forEach(el => el.classList.remove('ard-highlight-target'));
    ard_hidePinTooltip();
}

function ard_highlightPin(num, targetId) {
    if (typeof playSound === 'function') playSound('click');

    // Remove qualquer destaque anterior
    document.querySelectorAll('.ard-highlight-target').forEach(el => el.classList.remove('ard-highlight-target'));

    const target = document.getElementById(targetId);
    if (target) {
        target.classList.add('ard-highlight-target');
        if (typeof target.scrollIntoView === 'function') {
            target.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        ard_showPinTooltip(target, num);

        // Remove o destaque após 3.5 segundos
        setTimeout(() => {
            target.classList.remove('ard-highlight-target');
        }, 3500);
    }
}

/* ================= MOTOR DE DESTAQUE DE SINTAXE ARDUINO C++ ================= */
const ard_sketches = {
    'semaforo_maker.ino': `// Projeto: Semáforo Inteligente com Arduino UNO
const int pinoVermelho = 12;
const int pinoAmarelo  = 11;
const int pinoVerde    = 10;

void setup() {
  Serial.begin(9600);
  pinMode(pinoVermelho, OUTPUT);
  pinMode(pinoAmarelo,  OUTPUT);
  pinMode(pinoVerde,    OUTPUT);
  Serial.println("🚦 Sistema do Semáforo Pronto!");
}

void loop() {
  // SINAL VERDE: Siga em frente!
  digitalWrite(pinoVerde, HIGH);
  digitalWrite(pinoAmarelo, LOW);
  digitalWrite(pinoVermelho, LOW);
  delay(3000);

  // SINAL AMARELO: Atenção!
  digitalWrite(pinoVerde, LOW);
  digitalWrite(pinoAmarelo, HIGH);
  delay(1200);

  // SINAL VERMELHO: Pare!
  digitalWrite(pinoAmarelo, LOW);
  digitalWrite(pinoVermelho, HIGH);
  delay(3000);
}`,
    'Blink.ino': `// Exemplo Oficial: Pisca LED (Blink)
const int ledPin = 13;

void setup() {
  pinMode(ledPin, OUTPUT);
}

void loop() {
  digitalWrite(ledPin, HIGH); // Liga o LED integrado
  delay(1000);                // Aguarda 1 segundo
  digitalWrite(ledPin, LOW);  // Desliga o LED
  delay(1000);                // Aguarda 1 segundo
}`,
    'LeituraSerial.ino': `// Leitura Analógica do Potenciômetro e Monitor Serial
const int pinoPot = A0;
int valorSensor = 0;

void setup() {
  Serial.begin(9600);
  pinMode(pinoPot, INPUT);
  Serial.println("Lendo sensor analógico no pino A0...");
}

void loop() {
  valorSensor = analogRead(pinoPot);
  Serial.print("Valor lido no A0: ");
  Serial.println(valorSensor);
  delay(100);
}`,
    'BareMinimum.ino': `// Código BareMinimum (Zera e limpa o Arduino)
void setup() {
  // Coloque o código de inicialização aqui, para rodar uma vez:
}

void loop() {
  // Coloque o código principal aqui, para rodar em repouso:
}`,
    'Pisca_Alerta_Duplo.ino': `// Projeto: Pisca Alerta Duplo Alternado
const int ledA = 12; // LED Vermelho
const int ledB = 10; // LED Verde

void setup() {
  pinMode(ledA, OUTPUT);
  pinMode(ledB, OUTPUT);
}

void loop() {
  // Alterna LEDs A e B
  digitalWrite(ledA, HIGH);
  digitalWrite(ledB, LOW);
  delay(500);

  digitalWrite(ledA, LOW);
  digitalWrite(ledB, HIGH);
  delay(500);
}`,
    'Sensor_LDR_Luz.ino': `// Projeto: Sensor de Luminosidade com LDR
const int pinoLDR = A1;
const int pinoLed = 13;
int luminosidade = 0;

void setup() {
  Serial.begin(9600);
  pinMode(pinoLed, OUTPUT);
  Serial.println("Monitor de Luminosidade Pronto!");
}

void loop() {
  luminosidade = analogRead(pinoLDR);
  Serial.print("Luminosidade Lida: ");
  Serial.println(luminosidade);

  if (luminosidade < 400) {
    digitalWrite(pinoLed, HIGH); // Acende no escuro
  } else {
    digitalWrite(pinoLed, LOW);
  }
  delay(200);
}`
};

let ard_currentEditorCode = ard_sketches['semaforo_maker.ino'];

function ard_highlightArduinoSyntax(rawCode) {
    if (!rawCode) return '';

    const tokenRegex = /(\/\*[\s\S]*?\*\/|\/\/[^\r\n]*)|("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')|(#\s*(?:include|define|ifdef|ifndef|endif)\b[^\r\n]*)|(\b0x[0-9a-fA-F]+\b|\b\d+(?:\.\d+)?\b)|(\b[A-Za-z_][A-Za-z0-9_]*\b)|([^\s\w]+|\s+)/g;

    const keywords1 = new Set([
        'void', 'int', 'long', 'float', 'double', 'char', 'bool', 'boolean', 'byte', 'word',
        'short', 'unsigned', 'signed', 'const', 'static', 'volatile', 'auto', 'size_t',
        'uint8_t', 'uint16_t', 'uint32_t', 'int8_t', 'int16_t', 'int32_t', 'String',
        'if', 'else', 'for', 'while', 'do', 'switch', 'case', 'default', 'break',
        'continue', 'return', 'goto', 'class', 'struct', 'enum', 'sizeof'
    ]);

    const keywords2 = new Set([
        'setup', 'loop', 'pinMode', 'digitalWrite', 'digitalRead', 'analogRead', 'analogWrite',
        'analogReference', 'delay', 'delayMicroseconds', 'millis', 'micros', 'tone', 'noTone',
        'pulseIn', 'pulseInLong', 'shiftOut', 'shiftIn', 'attachInterrupt', 'detachInterrupt',
        'interrupts', 'noInterrupts', 'Serial', 'begin', 'print', 'println', 'write', 'read',
        'available', 'peek', 'flush', 'min', 'max', 'abs', 'constrain', 'map', 'pow', 'sqrt',
        'sin', 'cos', 'tan', 'random', 'randomSeed', 'bitRead', 'bitSet', 'bitClear', 'bitWrite',
        'lowByte', 'highByte'
    ]);

    const constants = new Set([
        'HIGH', 'LOW', 'INPUT', 'OUTPUT', 'INPUT_PULLUP', 'LED_BUILTIN',
        'true', 'false', 'NULL', 'null', 'DEC', 'BIN', 'HEX', 'OCT'
    ]);

    function escapeHtml(str) {
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
    }

    return rawCode.replace(tokenRegex, (match, comment, string, preproc, number, word) => {
        if (comment) {
            return `<span class="syn-cm">${escapeHtml(comment)}</span>`;
        }
        if (string) {
            return `<span class="syn-st">${escapeHtml(string)}</span>`;
        }
        if (preproc) {
            return `<span class="syn-pre">${escapeHtml(preproc)}</span>`;
        }
        if (number) {
            return `<span class="syn-nm">${escapeHtml(number)}</span>`;
        }
        if (word) {
            if (keywords1.has(word)) {
                return `<span class="syn-kw">${word}</span>`;
            }
            if (keywords2.has(word)) {
                return `<span class="syn-fn">${word}</span>`;
            }
            if (constants.has(word)) {
                return `<span class="syn-cn">${word}</span>`;
            }
            return escapeHtml(word);
        }
        return escapeHtml(match);
    });
}

function ard_setEditorCode(code, sketchTitle) {
    ard_currentEditorCode = code;
    const textarea = document.getElementById('ard-ide-code-input');
    const highlight = document.getElementById('ard-ide-code-highlight');
    const legacyArea = document.getElementById('ard-ide-code-text');
    const titleEl = document.getElementById('ard-active-sketch-title');

    if (sketchTitle && titleEl) {
        titleEl.innerText = sketchTitle;
    }

    if (textarea) textarea.value = code;
    if (highlight) highlight.innerHTML = ard_highlightArduinoSyntax(code) + '\n';
    if (legacyArea) legacyArea.innerHTML = ard_highlightArduinoSyntax(code);
    ard_updateEditorGutter(code);
    ard_syncEditorScroll();
}

function ard_loadSketch(sketchName) {
    if (!ard_sketches[sketchName]) {
        console.warn('Esboço não encontrado:', sketchName);
        return;
    }
    ard_activeSketchName = sketchName;
    ard_uploadActiveSketch = sketchName;
    try {
        if (typeof playSound === 'function') playSound('step');
    } catch(e) {}

    const btnMap = {
        'semaforo_maker.ino': 'btn-quick-semaforo',
        'Blink.ino': 'btn-quick-blink',
        'LeituraSerial.ino': 'btn-quick-serial',
        'BareMinimum.ino': 'btn-quick-bare',
        'Pisca_Alerta_Duplo.ino': 'btn-quick-alerta',
        'Sensor_LDR_Luz.ino': 'btn-quick-ldr'
    };

    document.querySelectorAll('.ard-sketch-quickbtn').forEach(b => {
        b.classList.remove('active');
    });
    const curBtn = document.getElementById(btnMap[sketchName]);
    if (curBtn) curBtn.classList.add('active');

    // Carrega o código no editor com destaque
    ard_setEditorCode(ard_sketches[sketchName], sketchName);

    // Atualiza o título na barra superior da IDE
    const mainWinTitle = document.getElementById('ard-ide-main-window-title');
    if (mainWinTitle) {
        mainWinTitle.innerText = `${sketchName.replace('.ino', '')} | Arduino 1.8.19`;
    }

    // Atualiza a aba do sketch
    const activeTabTitle = document.getElementById('ard-active-sketch-title');
    if (activeTabTitle) {
        activeTabTitle.innerText = sketchName;
    }

    // Atualiza a barra de mensagens da IDE
    const msg = document.getElementById('ard-ide-msg-bar-text');
    if (msg) {
        msg.innerText = `📄 Esboço "${sketchName}" aberto no editor! Pronto para Verificar (✔) ou Carregar (➔).`;
    }

    // Atualiza o console com dados de memória realistas
    const consoleEl = document.getElementById('ard-ide-console-text');
    if (consoleEl) {
        if (sketchName === 'Blink.ino') {
            consoleEl.innerText = `O sketch usa 924 bytes (2%) de espaço de armazenamento para programas. O máximo são 32.256 bytes.\nVariáveis globais usam 9 bytes (0%) de memória dinâmica, deixando 2.039 bytes para variáveis locais.`;
        } else if (sketchName === 'LeituraSerial.ino') {
            consoleEl.innerText = `O sketch usa 2.138 bytes (6%) de espaço de armazenamento para programas. O máximo são 32.256 bytes.\nVariáveis globais usam 214 bytes (10%) de memória dinâmica, deixando 1.834 bytes para variáveis locais.`;
        } else if (sketchName === 'BareMinimum.ino') {
            consoleEl.innerText = `O sketch usa 444 bytes (1%) de espaço de armazenamento para programas. O máximo são 32.256 bytes.\nVariáveis globais usam 9 bytes (0%) de memória dinâmica, deixando 2.039 bytes para variáveis locais.`;
        } else {
            consoleEl.innerText = `O sketch usa 1.542 bytes (4%) de espaço de armazenamento para programas. O máximo são 32.256 bytes.\nVariáveis globais usam 194 bytes (9%) de memória dinâmica, deixando 1.854 bytes para variáveis locais. O máximo são 2.048 bytes.`;
        }
    }

    // Sincroniza Aba 5 (Upload) caso exista
    const uploadWinTitle = document.getElementById('ard-upload-window-title');
    if (uploadWinTitle) uploadWinTitle.innerText = `${sketchName.replace('.ino', '')} | Arduino 1.8.19`;
    const uploadTabName = document.getElementById('ard-upload-tab-name');
    if (uploadTabName) uploadTabName.innerText = sketchName;
    const uploadCodeArea = document.getElementById('ard-upload-code-text');
    if (uploadCodeArea) uploadCodeArea.innerHTML = ard_highlightArduinoSyntax(ard_sketches[sketchName]);
    const uploadGutter = document.getElementById('ard-upload-gutter');
    if (uploadGutter) {
        const uLines = (ard_sketches[sketchName] || '').split('\n').length;
        let uNums = '';
        for (let i = 1; i <= uLines; i++) uNums += i + (i < uLines ? '<br>' : '');
        uploadGutter.innerHTML = uNums;
    }
    const btnTraffic = document.getElementById('btn-sketch-traffic');
    const btnBare = document.getElementById('btn-sketch-bare');
    if (sketchName === 'BareMinimum.ino') {
        if (btnTraffic) btnTraffic.style.background = '#334155';
        if (btnBare) btnBare.style.background = '#064E3B';
    } else {
        if (btnTraffic) btnTraffic.style.background = '#0284C7';
        if (btnBare) btnBare.style.background = '#334155';
    }
}

function ard_handleCodeInput(val) {
    ard_currentEditorCode = val;
    const highlight = document.getElementById('ard-ide-code-highlight');
    if (highlight) {
        highlight.innerHTML = ard_highlightArduinoSyntax(val) + '\n';
    }
    ard_updateEditorGutter(val);
}

function ard_syncEditorScroll() {
    const textarea = document.getElementById('ard-ide-code-input');
    const highlight = document.getElementById('ard-ide-code-highlight');
    const gutter = document.getElementById('ard-ide-gutter');
    if (!textarea) return;
    if (highlight) {
        highlight.scrollTop = textarea.scrollTop;
        highlight.scrollLeft = textarea.scrollLeft;
    }
    if (gutter) {
        gutter.scrollTop = textarea.scrollTop;
    }
}

function ard_handleEditorKey(e) {
    if (e.key === 'Tab') {
        e.preventDefault();
        const textarea = e.target;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        textarea.value = textarea.value.substring(0, start) + '  ' + textarea.value.substring(end);
        textarea.selectionStart = textarea.selectionEnd = start + 2;
        ard_handleCodeInput(textarea.value);
    } else if ((e.ctrlKey || e.metaKey) && (e.key === 't' || e.key === 'T')) {
        e.preventDefault();
        ard_autoFormatCode();
    }
}

function ard_updateEditorGutter(code) {
    const gutter = document.getElementById('ard-ide-gutter');
    if (!gutter) return;
    const lines = (code || '').split('\n').length;
    let numbers = '';
    for (let i = 1; i <= lines; i++) {
        numbers += i + (i < lines ? '<br>' : '');
    }
    gutter.innerHTML = numbers;
}

function ard_getCurrentEditorCode() {
    const textarea = document.getElementById('ard-ide-code-input');
    if (textarea && textarea.value) return textarea.value;
    return ard_currentEditorCode || (ard_sketches[ard_activeSketchName] || '');
}

function ard_validateArduinoCode(code) {
    if (!code || !code.trim()) {
        return { valid: false, error: 'O código está vazio! Escreva as funções obrigatórias void setup() e void loop().' };
    }
    if (!code.includes('setup') || !code.includes('loop')) {
        return { valid: false, error: 'Estrutura Arduino incompleta: todo esboço precisa de void setup() e void loop()!' };
    }
    let openBraces = (code.match(/\{/g) || []).length;
    let closeBraces = (code.match(/\}/g) || []).length;
    if (openBraces !== closeBraces) {
        return { valid: false, error: `Chaves desbalanceadas: { abriu ${openBraces} vez(es) e fechou ${closeBraces} vez(es)!` };
    }
    let openParens = (code.match(/\(/g) || []).length;
    let closeParens = (code.match(/\)/g) || []).length;
    if (openParens !== closeParens) {
        return { valid: false, error: `Parênteses desbalanceados: ( abriu ${openParens} vez(es) e fechou ${closeParens} vez(es)!` };
    }
    return { valid: true };
}

function ard_autoFormatCode() {
    if (typeof playSound === 'function') playSound('success');
    const textarea = document.getElementById('ard-ide-code-input');
    if (!textarea) return;

    let lines = textarea.value.split('\n');
    let indentLevel = 0;
    let formatted = [];

    for (let rawLine of lines) {
        let line = rawLine.trim();
        if (line.startsWith('}') || line.startsWith(')')) {
            indentLevel = Math.max(0, indentLevel - 1);
        }
        let indent = '  '.repeat(indentLevel);
        formatted.push(line.length > 0 ? indent + line : '');

        let opens = (line.match(/\{/g) || []).length;
        let closes = (line.match(/\}/g) || []).length;
        indentLevel = Math.max(0, indentLevel + opens - closes);
    }

    const newCode = formatted.join('\n');
    ard_setEditorCode(newCode, ard_activeSketchName);
    const msg = document.getElementById('ard-ide-msg-bar-text');
    if (msg) msg.innerText = '✨ Auto-formatação (Ctrl+T) aplicada: código alinhado com 2 espaços!';
}

function ard_openWindowsFileDialog() {
    if (typeof playSound === 'function') playSound('click');
    const modal = document.getElementById('ard-file-dialog-modal');
    const list = document.getElementById('ard-file-dialog-list');
    if (modal && list) {
        list.innerHTML = Object.keys(ard_sketches).map(fileName => {
            const isCur = fileName === ard_activeSketchName;
            return `
                <div onclick="ard_loadSketch('${fileName}'); ard_closeWindowsFileDialog();"
                     style="background:${isCur ? '#E0F2FE' : '#FFFFFF'};border:1px solid ${isCur ? '#0284C7' : '#CBD5E1'};border-radius:6px;padding:9px 12px;display:flex;align-items:center;justify-content:space-between;cursor:pointer;transition:all 0.15s ease;">
                    <div style="display:flex;align-items:center;gap:10px;">
                        <span style="color:#00979D;font-size:1.1rem;"><i class="fa-solid fa-file-code"></i></span>
                        <div>
                            <div style="font-weight:bold;color:#0F172A;font-size:0.88rem;font-family:monospace;">${fileName}</div>
                            <div style="color:#64748B;font-size:0.75rem;">Arquivo de código C++ Arduino (.ino)</div>
                        </div>
                    </div>
                    <span style="background:${isCur ? '#0284C7' : '#F1F5F9'};color:${isCur ? '#FFFFFF' : '#475569'};padding:3px 8px;border-radius:4px;font-size:0.75rem;font-weight:bold;">
                        ${isCur ? '● Aberto' : 'Abrir'}
                    </span>
                </div>
            `;
        }).join('');
        modal.classList.add('open');
    }
}

function ard_closeWindowsFileDialog() {
    if (typeof playSound === 'function') playSound('click');
    const modal = document.getElementById('ard-file-dialog-modal');
    if (modal) modal.classList.remove('open');
}

function ard_ideAction(actionType) {
    if (typeof playSound === 'function') playSound('click');
    const msg = document.getElementById('ard-ide-msg-bar-text');
    const msgBar = document.getElementById('target-pin-9');
    const consoleEl = document.getElementById('ard-ide-console-text');

    if (actionType === 'verify') {
        if (msg) msg.innerText = '⏳ Compilando esboço...';
        if (msgBar) msgBar.style.background = '#00797F';
        if (consoleEl) {
            consoleEl.innerText = `avr-g++ -c -g -Os -w -fno-exceptions -ffunction-sections -fdata-sections -MMD -mmcu=atmega328p -DF_CPU=16000000L -DARDUINO=10819 -DARDUINO_AVR_UNO -DARDUINO_ARCH_AVR...`;
        }

        setTimeout(() => {
            const currentCode = ard_getCurrentEditorCode();
            const validation = ard_validateArduinoCode(currentCode);

            if (!validation.valid) {
                if (typeof playSound === 'function') playSound('error');
                if (msg) msg.innerText = `❌ Erro de compilação: ${validation.error}`;
                if (msgBar) msgBar.style.background = '#DC2626';
                if (consoleEl) {
                    consoleEl.innerText = `sketch.ino:In function 'void setup()' / 'void loop()':\nsketch.ino: error: ${validation.error}\ncompilation terminated due to syntax error.`;
                }
                return;
            }

            if (typeof playSound === 'function') playSound('success');
            if (msg) msg.innerText = '✔ Compilação terminada. Sintaxe 100% correta!';
            if (msgBar) msgBar.style.background = '#00979D';
            if (consoleEl) {
                consoleEl.innerText = `O sketch usa 1.542 bytes (4%) de espaço de armazenamento para programas. O máximo são 32.256 bytes.\nVariáveis globais usam 194 bytes (9%) de memória dinâmica, deixando 1.854 bytes para variáveis locais. O máximo são 2.048 bytes.`;
            }
        }, 600);
    } else if (actionType === 'upload') {
        ard_runIdeUploadSimulation();
    } else if (actionType === 'new') {
        ard_loadSketch('BareMinimum.ino');
        if (msg) msg.innerText = '📄 Novo esboço criado com a estrutura padrão void setup() e void loop().';
        if (typeof playSound === 'function') playSound('step');
    } else if (actionType === 'save') {
        if (msg) msg.innerText = `💾 Esboço "${ard_activeSketchName}" salvo com sucesso!`;
        if (typeof playSound === 'function') playSound('success');
    } else if (actionType === 'archive') {
        alert('📦 Arquivar Sketch: Salva uma cópia compactada .zip do seu projeto!');
    } else if (actionType === 'libs') {
        alert('📚 Gerenciador de Bibliotecas: Permite instalar pacotes externos para sensores, displays e servos!');
    } else if (actionType === 'bootloader') {
        alert('⚡ Gravar Bootloader: Grava o programa inicializador oficial no chip virgem ATmega328P.');
    }
}

function ard_runIdeUploadSimulation() {
    if (ard_isUploading) return;

    if (!ard_isUsbConnected) {
        if (typeof playSound === 'function') playSound('error');
        alert('❌ Erro: O cabo USB não está conectado! Conecte o cabo na Aba 2 antes de carregar.');
        return;
    }

    if (!ard_driverInstalled) {
        if (typeof playSound === 'function') playSound('error');
        alert('⚠️ Erro de Comunicação: Driver não instalado! A porta serial não responde. Instale o driver CH340/FTDI.');
        return;
    }

    ard_isUploading = true;
    if (typeof playSound === 'function') playSound('step');

    const msg = document.getElementById('ard-ide-msg-bar-text');
    const msgBar = document.getElementById('target-pin-9');
    const consoleEl = document.getElementById('ard-ide-console-text');
    const txLed = document.getElementById('ide-toolbar-tx');
    const rxLed = document.getElementById('ide-toolbar-rx');
    const txHw = document.getElementById('led-tx');
    const rxHw = document.getElementById('led-rx');

    if (msg) msg.innerText = '⏳ Carregando... Gravando na memória Flash.';
    if (msgBar) msgBar.style.background = '#0284C7';

    if (consoleEl) {
        consoleEl.innerText = `avrdude: Version 6.3-20190619\n` +
            `         Using Port                    : ${ard_selectedPort.split(' ')[0]}\n` +
            `         Using Programmer              : arduino\n` +
            `         Overriding Baud Rate          : 115200\n` +
            `         AVR Part                      : ATmega328P\n` +
            `avrdude: AVR device initialized and ready to accept instructions\n` +
            `avrdude: Device signature = 0x1e950f (m328p)\n` +
            `avrdude: writing flash memory:\n` +
            `Writing | ################################################## | 100% 0.45s\n` +
            `avrdude: 1542 bytes of flash written\n` +
            `avrdude: verifying flash memory:\n` +
            `Reading | ################################################## | 100% 0.38s\n` +
            `avrdude: 1542 bytes of flash verified\n` +
            `avrdude done. Thank you.`;
    }

    // Flicker dos LEDs TX e RX
    let flashCount = 0;
    const flicker = setInterval(() => {
        flashCount++;
        if (txLed) txLed.classList.toggle('flash-tx');
        if (rxLed) rxLed.classList.toggle('flash-rx');
        if (txHw) txHw.classList.toggle('flash-tx');
        if (rxHw) rxHw.classList.toggle('flash-rx');

        if (flashCount > 10) {
            clearInterval(flicker);
            if (txLed) txLed.classList.remove('flash-tx');
            if (rxLed) rxLed.classList.remove('flash-rx');
            if (txHw) txHw.classList.remove('flash-tx');
            if (rxHw) rxHw.classList.remove('flash-rx');

            ard_isUploading = false;
            if (typeof playSound === 'function') playSound('success');
            if (msg) msg.innerText = '✔ Carregamento concluído.';
            if (msgBar) msgBar.style.background = '#00979D';

            ard_startTrafficCycle();
        }
    }, 100);
}

// ================= PLOTTER SERIAL & MONITOR SERIAL INTERATIVO =================
function ard_openSerialPlotter() {
    if (typeof playSound === 'function') playSound('click');
    const modal = document.getElementById('ard-plotter-modal');
    if (!modal) return;

    ard_plotterOpen = true;
    modal.classList.add('open');

    // Atualiza título da janela com placa e porta ativas
    const title = document.getElementById('ard-plotter-win-title');
    if (title) title.innerText = `Plotter Serial — ${ard_selectedPort.split(' ')[0]} (${ard_selectedBoard})`;

    // Atualiza controles de hardware interativos
    ard_renderPlotterHwControls();

    // Inicia loop do plotter se não estiver ativo
    if (!ard_plotterInterval) {
        ard_plotterInterval = setInterval(ard_plotterLoopStep, 60);
    }
}

function ard_closeSerialPlotter() {
    if (typeof playSound === 'function') playSound('click');
    const modal = document.getElementById('ard-plotter-modal');
    if (modal) modal.classList.remove('open');
    ard_plotterOpen = false;

    if (ard_plotterInterval) {
        clearInterval(ard_plotterInterval);
        ard_plotterInterval = null;
    }
}

function ard_togglePlotterPause() {
    ard_plotterPaused = !ard_plotterPaused;
    if (typeof playSound === 'function') playSound('step');

    const btn = document.getElementById('ard-plotter-pause-btn');
    const text = document.getElementById('ard-plotter-pause-text');
    if (btn && text) {
        if (ard_plotterPaused) {
            btn.classList.add('active');
            btn.innerHTML = '<i class="fa-solid fa-play"></i> <span id="ard-plotter-pause-text">Retomar</span>';
        } else {
            btn.classList.remove('active');
            btn.innerHTML = '<i class="fa-solid fa-pause"></i> <span id="ard-plotter-pause-text">Pausar</span>';
        }
    }
}

function ard_clearPlotter() {
    if (typeof playSound === 'function') playSound('click');
    ard_plotterData = [];
    ard_drawPlotterCanvas([]);
    const legend = document.getElementById('ard-plotter-legend-box');
    if (legend) legend.innerHTML = '<span style="color:#94A3B8;font-size:0.8rem;">Gráfico limpo. Aguardando novos dados seriais...</span>';
}

function ard_changePlotterSource(source) {
    if (typeof playSound === 'function') playSound('step');
    ard_plotterSource = source;
    ard_plotterData = [];
    ard_renderPlotterHwControls();
    ard_updatePlotterSnippet(source);
}

function ard_changePlotterScale(scaleMode) {
    if (typeof playSound === 'function') playSound('step');
    ard_plotterScaleMode = scaleMode;
}

function ard_changePlotterBaud(baud) {
    if (typeof playSound === 'function') playSound('step');
    ard_plotterBaud = baud;
    const warning = document.getElementById('ard-plotter-baud-warning');
    if (warning) {
        if (baud !== '9600') {
            warning.style.display = 'block';
            if (typeof playSound === 'function') playSound('error');
        } else {
            warning.style.display = 'none';
        }
    }
}

function ard_onPotChange(val) {
    ard_plotterPotValue = parseInt(val, 10);
    const display = document.getElementById('ard-pot-val-display');
    const volts = ((ard_plotterPotValue * 5.0) / 1023).toFixed(2);
    if (display) display.innerText = `${ard_plotterPotValue} (${volts}V)`;
}

function ard_onLdrChange(val) {
    ard_plotterLdrValue = parseInt(val, 10);
    const display = document.getElementById('ard-ldr-val-display');
    const volts = ((ard_plotterLdrValue * 5.0) / 1023).toFixed(2);
    if (display) display.innerText = `${ard_plotterLdrValue} (${volts}V)`;
}

function ard_togglePlotterCodeSnippet() {
    const snippet = document.getElementById('ard-plotter-code-snippet');
    const arrow = document.getElementById('ard-plotter-code-toggle-arrow');
    if (!snippet) return;
    const isHidden = snippet.style.display === 'none';
    snippet.style.display = isHidden ? 'block' : 'none';
    if (arrow) arrow.innerText = isHidden ? '▲ Ocultar Código' : '▼ Ver Código';
    if (typeof playSound === 'function') playSound('click');
}

function ard_renderPlotterHwControls() {
    const container = document.getElementById('ard-plotter-interactive-hw');
    if (!container) return;

    if (ard_plotterSource === 'pot_ldr') {
        const vPot = ((ard_plotterPotValue * 5.0) / 1023).toFixed(2);
        const vLdr = ((ard_plotterLdrValue * 5.0) / 1023).toFixed(2);
        container.innerHTML = `
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(270px,1fr));gap:14px;align-items:center;">
                <!-- Potenciômetro A0 -->
                <div style="background:#0F172A;border:1px solid #38BDF8;border-radius:10px;padding:10px 14px;">
                    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
                        <span style="color:#38BDF8;font-weight:bold;font-size:0.84rem;">
                            🕹️ Girar Potenciômetro (Pino A0)
                        </span>
                        <span id="ard-pot-val-display" style="background:#0369A1;color:white;padding:2px 8px;border-radius:6px;font-family:monospace;font-size:0.8rem;font-weight:bold;">
                            ${ard_plotterPotValue} (${vPot}V)
                        </span>
                    </div>
                    <input type="range" min="0" max="1023" value="${ard_plotterPotValue}" style="width:100%;accent-color:#38BDF8;cursor:pointer;" oninput="ard_onPotChange(this.value)">
                    <div style="display:flex;justify-content:space-between;color:#64748B;font-size:0.72rem;margin-top:2px;">
                        <span>0 (0V - GND)</span>
                        <span>512 (2.5V)</span>
                        <span>1023 (5.0V - VCC)</span>
                    </div>
                </div>

                <!-- Sensor LDR A1 -->
                <div style="background:#0F172A;border:1px solid #FBBF24;border-radius:10px;padding:10px 14px;">
                    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
                        <span style="color:#FBBF24;font-weight:bold;font-size:0.84rem;">
                            ☀️ Luz no Sensor LDR (Pino A1)
                        </span>
                        <span id="ard-ldr-val-display" style="background:#B45309;color:white;padding:2px 8px;border-radius:6px;font-family:monospace;font-size:0.8rem;font-weight:bold;">
                            ${ard_plotterLdrValue} (${vLdr}V)
                        </span>
                    </div>
                    <input type="range" min="50" max="1000" value="${ard_plotterLdrValue}" style="width:100%;accent-color:#FBBF24;cursor:pointer;" oninput="ard_onLdrChange(this.value)">
                    <div style="display:flex;justify-content:space-between;color:#64748B;font-size:0.72rem;margin-top:2px;">
                        <span>🌑 Escuro Total (50)</span>
                        <span>⛅ Ambiente (500)</span>
                        <span>💡 Lanterna Direta (1000)</span>
                    </div>
                </div>
            </div>
        `;
    } else if (ard_plotterSource === 'traffic_light') {
        const phaseNames = ['🟢 Verde (Pino 10 = HIGH)', '🟡 Amarelo (Pino 11 = HIGH)', '🔴 Vermelho (Pino 12 = HIGH)'];
        container.innerHTML = `
            <div style="background:#0F172A;border:1px solid #10B981;border-radius:10px;padding:10px 14px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;">
                <div>
                    <span style="color:#10B981;font-weight:bold;font-size:0.84rem;">🚦 Estado Atual do Semáforo no Gráfico Digital:</span>
                    <div style="color:#F8FAFC;font-size:0.95rem;font-weight:bold;margin-top:2px;" id="ard-plotter-traffic-status">
                        ${phaseNames[ard_trafficPhase] || phaseNames[0]}
                    </div>
                </div>
                <div style="display:flex;gap:8px;">
                    <button onclick="ard_advanceTrafficLightPhase()" style="background:#1E293B;border:1px solid #38BDF8;color:#38BDF8;padding:6px 14px;border-radius:6px;font-size:0.8rem;font-weight:bold;cursor:pointer;">
                        Avançar Fase Manual ⏭️
                    </button>
                </div>
            </div>
        `;
    } else if (ard_plotterSource === 'sine_pwm') {
        container.innerHTML = `
            <div style="background:#0F172A;border:1px solid #E879F9;border-radius:10px;padding:10px 14px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;">
                <div>
                    <span style="color:#E879F9;font-weight:bold;font-size:0.84rem;">〰️ Gerador Matemático PWM (Modulação de Pulso):</span>
                    <p style="color:#CBD5E1;font-size:0.82rem;margin:2px 0 0;">
                        Visualização de ondas senoidais puras simulando saídas PWM (pinos ~, como 3, 5, 6, 9, 10 e 11 do Uno).
                    </p>
                </div>
                <span style="background:rgba(232,121,249,0.2);color:#F472B6;padding:4px 10px;border-radius:20px;font-size:0.78rem;font-weight:bold;">
                    2 Sinais Harmônicos
                </span>
            </div>
        `;
    } else if (ard_plotterSource === 'noise') {
        container.innerHTML = `
            <div style="background:#0F172A;border:1px solid #38BDF8;border-radius:10px;padding:10px 14px;">
                <span style="color:#38BDF8;font-weight:bold;font-size:0.84rem;">⚡ Ruído Eletromagnético (Pino A2 Aberto/Flutuante):</span>
                <p style="color:#CBD5E1;font-size:0.82rem;margin:2px 0 0;">
                    Quando um pino analógico não está conectado a nada (nem GND, nem 5V), ele atua como uma antena captando ondas de rádio e ruído eletrostático do ar!
                </p>
            </div>
        `;
    }
}

function ard_advanceTrafficLightPhase() {
    ard_trafficPhase = (ard_trafficPhase + 1) % 3;
    const status = document.getElementById('ard-plotter-traffic-status');
    const phaseNames = ['🟢 Verde (Pino 10 = HIGH)', '🟡 Amarelo (Pino 11 = HIGH)', '🔴 Vermelho (Pino 12 = HIGH)'];
    if (status) status.innerText = phaseNames[ard_trafficPhase];
    if (typeof playSound === 'function') playSound('step');
}

function ard_updatePlotterSnippet(source) {
    const snippet = document.getElementById('ard-plotter-code-snippet');
    if (!snippet) return;

    if (source === 'pot_ldr') {
        snippet.innerHTML = `// Código que lê dois sensores e desenha 2 linhas no Plotter Serial:<br>
<span style="color:#007E82;font-weight:bold;">void</span> <span style="color:#D35400;font-weight:bold;">loop</span>() {<br>
  <span style="color:#007E82;font-weight:bold;">int</span> pot = <span style="color:#D35400;font-weight:bold;">analogRead</span>(A0);   <span style="color:#7F8C8D;">// Leitura do potenciômetro (0 a 1023)</span><br>
  <span style="color:#007E82;font-weight:bold;">int</span> ldr = <span style="color:#D35400;font-weight:bold;">analogRead</span>(A1);   <span style="color:#7F8C8D;">// Leitura do sensor de luz</span><br>
  <span style="color:#D35400;font-weight:bold;">Serial</span>.<span style="color:#D35400;font-weight:bold;">print</span>(pot);          <span style="color:#7F8C8D;">// Canal 1 (linha azul)</span><br>
  <span style="color:#D35400;font-weight:bold;">Serial</span>.<span style="color:#D35400;font-weight:bold;">print</span>(<span style="color:#2E86C1;">" "</span>);           <span style="color:#7F8C8D;">// ESPAÇO: é ele quem separa as duas curvas!</span><br>
  <span style="color:#D35400;font-weight:bold;">Serial</span>.<span style="color:#D35400;font-weight:bold;">println</span>(ldr);        <span style="color:#7F8C8D;">// Canal 2 (linha amarela - println pula linha)</span><br>
  <span style="color:#D35400;font-weight:bold;">delay</span>(<span style="color:#A04000;">50</span>);                  <span style="color:#7F8C8D;">// Aguarda 50 milissegundos</span><br>
}`;
    } else if (source === 'traffic_light') {
        snippet.innerHTML = `// Visualizando o chaveamento digital dos 3 pinos no Plotter Serial:<br>
<span style="color:#007E82;font-weight:bold;">void</span> <span style="color:#D35400;font-weight:bold;">loop</span>() {<br>
  <span style="color:#D35400;font-weight:bold;">Serial</span>.<span style="color:#D35400;font-weight:bold;">print</span>(<span style="color:#D35400;font-weight:bold;">digitalRead</span>(<span style="color:#A04000;">10</span>) * <span style="color:#A04000;">1023</span>); <span style="color:#7F8C8D;">// Verde (Canal 1: 0 ou 1023)</span><br>
  <span style="color:#D35400;font-weight:bold;">Serial</span>.<span style="color:#D35400;font-weight:bold;">print</span>(<span style="color:#2E86C1;">" "</span>);<br>
  <span style="color:#D35400;font-weight:bold;">Serial</span>.<span style="color:#D35400;font-weight:bold;">print</span>(<span style="color:#D35400;font-weight:bold;">digitalRead</span>(<span style="color:#A04000;">11</span>) * <span style="color:#A04000;">1023</span>); <span style="color:#7F8C8D;">// Amarelo (Canal 2: 0 ou 1023)</span><br>
  <span style="color:#D35400;font-weight:bold;">Serial</span>.<span style="color:#D35400;font-weight:bold;">print</span>(<span style="color:#2E86C1;">" "</span>);<br>
  <span style="color:#D35400;font-weight:bold;">Serial</span>.<span style="color:#D35400;font-weight:bold;">println</span>(<span style="color:#D35400;font-weight:bold;">digitalRead</span>(<span style="color:#A04000;">12</span>) * <span style="color:#A04000;">1023</span>); <span style="color:#7F8C8D;">// Vermelho (Canal 3: 0 ou 1023)</span><br>
  <span style="color:#D35400;font-weight:bold;">delay</span>(<span style="color:#A04000;">50</span>);<br>
}`;
    } else if (source === 'sine_pwm') {
        snippet.innerHTML = `// Gerando ondas harmônicas com funções trigonométricas:<br>
<span style="color:#007E82;font-weight:bold;">float</span> angulo = <span style="color:#A04000;">0</span>;<br>
<span style="color:#007E82;font-weight:bold;">void</span> <span style="color:#D35400;font-weight:bold;">loop</span>() {<br>
  <span style="color:#007E82;font-weight:bold;">float</span> seno = <span style="color:#A04000;">512</span> + <span style="color:#A04000;">450</span> * <span style="color:#D35400;font-weight:bold;">sin</span>(angulo);<br>
  <span style="color:#007E82;font-weight:bold;">float</span> cosseno = <span style="color:#A04000;">512</span> + <span style="color:#A04000;">380</span> * <span style="color:#D35400;font-weight:bold;">cos</span>(angulo * <span style="color:#A04000;">0.8</span>);<br>
  <span style="color:#D35400;font-weight:bold;">Serial</span>.<span style="color:#D35400;font-weight:bold;">print</span>(seno);   <span style="color:#D35400;font-weight:bold;">Serial</span>.<span style="color:#D35400;font-weight:bold;">print</span>(<span style="color:#2E86C1;">" "</span>);   <span style="color:#D35400;font-weight:bold;">Serial</span>.<span style="color:#D35400;font-weight:bold;">println</span>(cosseno);<br>
  angulo += <span style="color:#A04000;">0.1</span>;<br>
  <span style="color:#D35400;font-weight:bold;">delay</span>(<span style="color:#A04000;">50</span>);<br>
}`;
    } else if (source === 'noise') {
        snippet.innerHTML = `// Lendo ruído de um pino desconectado (flutuante):<br>
<span style="color:#007E82;font-weight:bold;">void</span> <span style="color:#D35400;font-weight:bold;">loop</span>() {<br>
  <span style="color:#007E82;font-weight:bold;">int</span> ruido = <span style="color:#D35400;font-weight:bold;">analogRead</span>(A2); <span style="color:#7F8C8D;">// Pino A2 sem nada conectado</span><br>
  <span style="color:#D35400;font-weight:bold;">Serial</span>.<span style="color:#D35400;font-weight:bold;">println</span>(ruido);<br>
  <span style="color:#D35400;font-weight:bold;">delay</span>(<span style="color:#A04000;">50</span>);<br>
}`;
    }
}

function ard_plotterLoopStep() {
    if (!ard_plotterOpen || ard_plotterPaused) return;

    let sampleVals = [];
    let channelLabels = [];
    let channelColors = [];

    // Se a taxa de transmissão for diferente de 9600, gera dados corrompidos (ruído louco)
    if (ard_plotterBaud !== '9600') {
        sampleVals = [
            Math.floor(Math.random() * 1024),
            Math.floor(Math.random() * 1024)
        ];
        channelLabels = ['[DADO CORROMPIDO]', '[TAXA INCORRETA]'];
        channelColors = ['#EF4444', '#F59E0B'];
    } else if (ard_plotterSource === 'pot_ldr') {
        // Leve oscilação analógica realista (±2)
        const jitterPot = Math.round(ard_plotterPotValue + (Math.random() * 4 - 2));
        const jitterLdr = Math.round(ard_plotterLdrValue + (Math.random() * 6 - 3));
        const valPot = Math.max(0, Math.min(1023, jitterPot));
        const valLdr = Math.max(0, Math.min(1023, jitterLdr));

        sampleVals = [valPot, valLdr];
        channelLabels = ['A0 (Potenciômetro)', 'A1 (Sensor LDR)'];
        channelColors = ['#38BDF8', '#FBBF24'];
    } else if (ard_plotterSource === 'traffic_light') {
        const valGreen = (ard_trafficPhase === 0) ? 1023 : 0;
        const valYellow = (ard_trafficPhase === 1) ? 1023 : 0;
        const valRed = (ard_trafficPhase === 2) ? 1023 : 0;

        sampleVals = [valGreen, valYellow, valRed];
        channelLabels = ['Pino 10 (Verde)', 'Pino 11 (Amarelo)', 'Pino 12 (Vermelho)'];
        channelColors = ['#10B981', '#F59E0B', '#EF4444'];
    } else if (ard_plotterSource === 'sine_pwm') {
        ard_plotterTick += 0.08;
        const valSin = Math.round(512 + 450 * Math.sin(ard_plotterTick));
        const valCos = Math.round(512 + 380 * Math.cos(ard_plotterTick * 0.8));

        sampleVals = [valSin, valCos];
        channelLabels = ['PWM Senoidal (Pino ~9)', 'Harmônico Cossenoidal (Pino ~10)'];
        channelColors = ['#38BDF8', '#E879F9'];
    } else if (ard_plotterSource === 'noise') {
        ard_plotterNoiseVal += (Math.random() * 70 - 35);
        ard_plotterNoiseVal = Math.max(80, Math.min(940, ard_plotterNoiseVal));
        const valNoise = Math.round(ard_plotterNoiseVal);

        sampleVals = [valNoise];
        channelLabels = ['Pino A2 Flutuante (Ruído Eletromagnético)'];
        channelColors = ['#38BDF8'];
    }

    // Armazena no buffer (limite de 70 amostras horizontais)
    ard_plotterData.push(sampleVals);
    if (ard_plotterData.length > 70) {
        ard_plotterData.shift();
    }

    // Atualiza Legendas Numéricas no DOM
    const legendBox = document.getElementById('ard-plotter-legend-box');
    if (legendBox) {
        let chipsHtml = '';
        sampleVals.forEach((val, i) => {
            const label = channelLabels[i] || `Canal ${i + 1}`;
            const color = channelColors[i] || '#38BDF8';
            const volts = ((val * 5.0) / 1023).toFixed(2);
            const displayVal = (ard_plotterScaleMode === 'volts') ? `${volts} V` : `${val}`;

            chipsHtml += `
                <div class="ard-channel-chip" style="border-color:${color};">
                    <span class="ard-channel-dot" style="background:${color};box-shadow:0 0 8px ${color};"></span>
                    <span style="color:#CBD5E1;">${label}:</span>
                    <span style="color:${color};">${displayVal}</span>
                    <span style="color:#64748B;font-size:0.75rem;">(${volts}V)</span>
                </div>
            `;
        });
        legendBox.innerHTML = chipsHtml;
    }

    // Renderiza Canvas
    ard_drawPlotterCanvas(channelColors, channelLabels);
}

function ard_drawPlotterCanvas(channelColors, channelLabels) {
    const canvas = document.getElementById('ard-plotter-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;
    const padL = 60; // Padding esquerdo para os números do eixo Y
    const padR = 25;
    const padT = 20;
    const padB = 30;
    const chartW = W - padL - padR;
    const chartH = H - padT - padB;

    // Fundo
    ctx.fillStyle = '#090D16';
    ctx.fillRect(0, 0, W, H);

    // Linhas de Grade Horizontais (5 linhas: 0, 256, 512, 768, 1023)
    const gridSteps = 4;
    ctx.strokeStyle = '#1E293B';
    ctx.lineWidth = 1;
    ctx.font = '10px Consolas, monospace';
    ctx.fillStyle = '#64748B';
    ctx.textAlign = 'right';

    for (let i = 0; i <= gridSteps; i++) {
        const ratio = i / gridSteps;
        const y = padT + chartH * (1 - ratio);
        const adcVal = Math.round(ratio * 1023);
        const voltsVal = (ratio * 5.0).toFixed(1) + 'V';
        const labelText = (ard_plotterScaleMode === 'volts') ? voltsVal : `${adcVal}`;

        ctx.beginPath();
        ctx.moveTo(padL, y);
        ctx.lineTo(W - padR, y);
        ctx.stroke();

        ctx.fillText(labelText, padL - 8, y + 3);
    }

    // Linhas de Grade Verticais Scrolling
    ctx.strokeStyle = 'rgba(30, 41, 59, 0.6)';
    const vSteps = 10;
    for (let i = 0; i <= vSteps; i++) {
        const x = padL + (chartW / vSteps) * i;
        ctx.beginPath();
        ctx.moveTo(x, padT);
        ctx.lineTo(x, H - padB);
        ctx.stroke();
    }

    // Eixo X Inferior
    ctx.strokeStyle = '#334155';
    ctx.beginPath();
    ctx.moveTo(padL, H - padB);
    ctx.lineTo(W - padR, H - padB);
    ctx.stroke();

    // Rótulo do Eixo X
    ctx.textAlign = 'center';
    ctx.fillText('Amostras de Tempo (Streaming Serial)', padL + chartW / 2, H - 10);

    if (ard_plotterData.length < 2) return;

    // Número de canais
    const numChannels = ard_plotterData[0].length;
    const maxPoints = 70;
    const stepX = chartW / (maxPoints - 1);
    const startOffset = maxPoints - ard_plotterData.length;

    // Desenha cada canal
    for (let ch = 0; ch < numChannels; ch++) {
        const color = (channelColors && channelColors[ch]) || '#38BDF8';

        ctx.save();
        ctx.strokeStyle = color;
        ctx.lineWidth = 2.4;
        ctx.shadowColor = color;
        ctx.shadowBlur = 10;

        ctx.beginPath();
        for (let pt = 0; pt < ard_plotterData.length; pt++) {
            const x = padL + (startOffset + pt) * stepX;
            const rawVal = ard_plotterData[pt][ch] || 0;
            const clamped = Math.max(0, Math.min(1023, rawVal));
            const y = padT + chartH * (1 - (clamped / 1023));

            if (pt === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        ctx.stroke();
        ctx.restore();

        // Ponto terminal com círculo pulsante no final da curva
        const lastIdx = ard_plotterData.length - 1;
        const lastX = padL + (startOffset + lastIdx) * stepX;
        const lastVal = ard_plotterData[lastIdx][ch] || 0;
        const lastClamped = Math.max(0, Math.min(1023, lastVal));
        const lastY = padT + chartH * (1 - (lastClamped / 1023));

        ctx.beginPath();
        ctx.fillStyle = color;
        ctx.arc(lastX, lastY, 4.5, 0, Math.PI * 2);
        ctx.fill();

        // Texto numérico na ponta
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 10px Consolas, monospace';
        ctx.textAlign = 'left';
        const displayLast = (ard_plotterScaleMode === 'volts') ? `${((lastVal * 5.0) / 1023).toFixed(2)}V` : `${lastVal}`;
        ctx.fillText(displayLast, Math.min(lastX + 6, W - 45), lastY - 4);
    }
}

// ================= MONITOR SERIAL REALISTA =================
function ard_toggleSerialWindow() {
    if (typeof playSound === 'function') playSound('click');
    const modal = document.getElementById('ard-serial-monitor-modal');
    if (!modal) return;

    ard_monitorOpen = true;
    modal.classList.add('open');

    const title = document.getElementById('ard-monitor-win-title');
    if (title) title.innerText = `${ard_selectedPort.split(' ')[0]} (${ard_selectedBoard}) — Monitor Serial`;

    const logBox = document.getElementById('ard-monitor-log-box');
    if (logBox && (logBox.innerText || logBox.textContent || '').trim() === '') {
        logBox.innerHTML = `[00:00:01] 🔌 Porta Serial aberta a 9600 baud.\n` +
            `[00:00:02] 🚦 Sistema do Semáforo Inicializado com Sucesso!\n` +
            `[00:00:03] 🟢 SINAL VERDE (Pino 10 = HIGH)\n` +
            `[00:00:06] 🟡 SINAL AMARELO (Pino 11 = HIGH)\n` +
            `[00:00:08] 🔴 SINAL VERMELHO (Pino 12 = HIGH)\n`;
    }

    if (!ard_monitorInterval) {
        ard_monitorInterval = setInterval(() => {
            if (!ard_monitorOpen) return;
            const box = document.getElementById('ard-monitor-log-box');
            if (!box) return;

            const timeStr = new Date().toTimeString().split(' ')[0];
            const prefix = ard_serialTimestamp ? `[${timeStr}] ` : '';

            let msg = '';
            if (ard_plotterSource === 'pot_ldr') {
                msg = `${prefix}A0_Pot: ${ard_plotterPotValue} | A1_LDR: ${ard_plotterLdrValue}\n`;
            } else {
                const phases = ['🟢 VERDE', '🟡 AMARELO', '🔴 VERMELHO'];
                msg = `${prefix}Semáforo: ${phases[ard_trafficPhase] || 'Ativo'}\n`;
            }

            box.innerHTML += msg;
            if (ard_serialAutoscroll) {
                box.scrollTop = box.scrollHeight;
            }
        }, 1800);
    }
}

function ard_closeSerialMonitor() {
    if (typeof playSound === 'function') playSound('click');
    const modal = document.getElementById('ard-serial-monitor-modal');
    if (modal) modal.classList.remove('open');
    ard_monitorOpen = false;

    if (ard_monitorInterval) {
        clearInterval(ard_monitorInterval);
        ard_monitorInterval = null;
    }
}

function ard_clearSerialMonitor() {
    if (typeof playSound === 'function') playSound('click');
    const logBox = document.getElementById('ard-monitor-log-box');
    if (logBox) logBox.innerHTML = '';
}

function ard_sendSerialMessage() {
    const input = document.getElementById('ard-monitor-send-input');
    const logBox = document.getElementById('ard-monitor-log-box');
    if (!input || !logBox) return;

    const val = input.value.trim();
    if (!val) return;

    if (typeof playSound === 'function') playSound('step');
    const timeStr = new Date().toTimeString().split(' ')[0];
    const prefix = ard_serialTimestamp ? `[${timeStr}] ` : '';

    logBox.innerHTML += `<span style="color:#0284C7;font-weight:bold;">${prefix}&gt;&gt;&gt; ${val}</span>\n`;
    logBox.innerHTML += `<span style="color:#059669;">${prefix}Arduino Uno recebeu: "${val}" (OK)</span>\n`;
    input.value = '';

    if (ard_serialAutoscroll) {
        logBox.scrollTop = logBox.scrollHeight;
    }
}


/* ================= OVERLAY TOUR PARA INICIANTES ================= */
const ard_tourSteps = [
    {
        targetId: 'target-tour-menu',
        title: '1. Barra de Menus & Ferramentas',
        icon: 'fa-solid fa-bars',
        desc: 'Aqui você acessa os comandos globais da IDE. O menu mais importante para o Maker é o <b>Ferramentas</b>: é nele que você define qual modelo de placa está usando (ex: <em>Arduino Uno</em>) e seleciona a porta serial de comunicação (ex: <em>COM3</em>)!'
    },
    {
        targetId: 'target-pin-1',
        title: '2. Botão Verificar (Compilar)',
        icon: 'fa-solid fa-check',
        desc: 'O ícone de visto ✔ checa todo o seu código C++ em busca de erros de digitação, pontos e vírgulas esquecidos ou chaves abertas. Ele compila o código sem precisar enviar para a placa.'
    },
    {
        targetId: 'target-pin-2',
        title: '3. Botão Carregar (Upload)',
        icon: 'fa-solid fa-arrow-right',
        desc: 'A seta ➔ compila e grava o programa diretamente na memória Flash do chip ATmega via cabo USB! Durante o envio, você verá os LEDs TX e RX piscando bem rápido na placa.'
    },
    {
        targetId: 'target-pin-7',
        title: '4. Abas & Nome do Esboço (Sketch)',
        icon: 'fa-regular fa-file-code',
        desc: 'Mostra o nome do arquivo que você está editando (ex: <code>semaforo_maker.ino</code>). No universo Arduino, todo projeto ou código é carinhosamente chamado de <em>Sketch</em> (Esboço).'
    },
    {
        targetId: 'target-pin-8',
        title: '5. Editor de Código (Fundo Branco Oficial)',
        icon: 'fa-solid fa-code',
        desc: 'Esta é a área onde você digita as instruções em C++. O fundo branco é o padrão clássico da Arduino IDE. Funções oficiais como <code>setup()</code>, <code>loop()</code> e <code>digitalWrite()</code> ganham cores especiais automaticamente!'
    },
    {
        targetId: 'target-pin-6',
        title: '6. Monitor Serial (Lupa)',
        icon: 'fa-solid fa-magnifying-glass',
        desc: 'A lupa 🔍 no canto superior direito abre a janela do Monitor Serial. Com ele, você pode conversar com o Arduino, ler valores de sensores e testar mensagens enviadas pelo comando <code>Serial.println()</code>!'
    },
    {
        targetId: 'target-pin-9',
        title: '7. Área de Mensagens (Status)',
        icon: 'fa-solid fa-info-circle',
        desc: 'A barra colorida (verde-água) indica o andamento das operações: <em>"Compilando esboço..."</em>, <em>"✔ Compilação terminada"</em> ou mensagens de erro em vermelho se algo falhar.'
    },
    {
        targetId: 'target-pin-10',
        title: '8. Console Preto de Texto',
        icon: 'fa-solid fa-terminal',
        desc: 'A tela preta inferior exibe relatórios técnicos do compilador <code>avr-gcc</code> e do gravador <code>avrdude</code>, incluindo exatamente quantos bytes de memória Flash e SRAM o programa consumiu.'
    },
    {
        targetId: 'target-pin-11',
        title: '9. Placa e Porta Serial Ativa',
        icon: 'fa-solid fa-plug',
        desc: 'No canto inferior direito você confere se a IDE está conectada na placa e porta certas (ex: <code>Arduino Uno na COM3</code>). Se a porta estiver errada, o carregamento falhará!'
    }
];

function ard_startOverlayTour() {
    ard_tourCurrentStep = 0;
    const overlay = document.getElementById('ard-tour-overlay');
    if (overlay) overlay.classList.add('active');
    if (typeof playSound === 'function') playSound('step');
    ard_renderTourStep();
}

function ard_closeOverlayTour() {
    const overlay = document.getElementById('ard-tour-overlay');
    if (overlay) overlay.classList.remove('active');
    document.querySelectorAll('.ard-highlight-target').forEach(el => el.classList.remove('ard-highlight-target'));
    if (typeof playSound === 'function') playSound('click');
}

function ard_nextOverlayTour() {
    if (ard_tourCurrentStep < ard_tourSteps.length - 1) {
        ard_tourCurrentStep++;
        if (typeof playSound === 'function') playSound('step');
        ard_renderTourStep();
    } else {
        if (typeof playSound === 'function') playSound('success');
        ard_closeOverlayTour();
        alert('🎉 Parabéns! Você completou o Guia da Arduino IDE! Agora você domina cada seção da interface.');
    }
}

function ard_prevOverlayTour() {
    if (ard_tourCurrentStep > 0) {
        ard_tourCurrentStep--;
        if (typeof playSound === 'function') playSound('step');
        ard_renderTourStep();
    }
}

function ard_renderTourStep() {
    const step = ard_tourSteps[ard_tourCurrentStep];
    if (!step) return;

    // Atualiza texto e controles do card
    const badge = document.getElementById('ard-tour-step-badge');
    const title = document.getElementById('ard-tour-title');
    const desc = document.getElementById('ard-tour-desc');
    const btnPrev = document.getElementById('ard-tour-btn-prev');
    const btnNext = document.getElementById('ard-tour-btn-next');

    if (badge) badge.innerText = `PASSO ${ard_tourCurrentStep + 1} DE ${ard_tourSteps.length}`;
    if (title) title.innerHTML = `<i class="${step.icon}"></i> ${step.title}`;
    if (desc) desc.innerHTML = step.desc;

    if (btnPrev) {
        btnPrev.disabled = (ard_tourCurrentStep === 0);
        btnPrev.style.opacity = (ard_tourCurrentStep === 0) ? '0.4' : '1';
        btnPrev.style.cursor = (ard_tourCurrentStep === 0) ? 'not-allowed' : 'pointer';
    }

    if (btnNext) {
        if (ard_tourCurrentStep === ard_tourSteps.length - 1) {
            btnNext.innerText = 'Concluir Tour 🏁';
            btnNext.style.background = '#10B981';
        } else {
            btnNext.innerText = 'Próximo Passo ▶';
            btnNext.style.background = '#0284C7';
        }
    }

    // Destaque visual no alvo
    document.querySelectorAll('.ard-highlight-target').forEach(el => el.classList.remove('ard-highlight-target'));
    const target = document.getElementById(step.targetId);
    if (target) {
        target.classList.add('ard-highlight-target');
        target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

/* ================= ABA 4: MENU FERRAMENTAS & CONEXÃO DA PORTA ================= */
function ard_toggleMenu(menuKey, event) {
    if (event) {
        event.stopPropagation();
    }
    if (typeof playSound === 'function') playSound('click');
    const menuMap = {
        'file': 'ard-menu-file',
        'edit': 'ard-menu-edit',
        'sketch': 'ard-menu-sketch',
        'tools': 'ard-real-tools-dropdown',
        'help': 'ard-menu-help'
    };
    const targetId = menuMap[menuKey] || 'ard-real-tools-dropdown';
    const targetMenu = document.getElementById(targetId);

    // Fecha os outros menus abertos
    document.querySelectorAll('.ard-dropdown-menu').forEach(m => {
        if (m !== targetMenu) m.classList.remove('show');
    });

    if (targetMenu) {
        targetMenu.classList.toggle('show');
    }
}

function ard_toggleRealToolsMenu() {
    ard_toggleMenu('tools');
}

function ard_setBoard(boardName) {
    if (typeof playSound === 'function') playSound('step');
    ard_selectedBoard = boardName;

    const badge = document.getElementById('ard-tools-board-badge');
    const benchBadge = document.getElementById('ard-bench-board-badge');
    const summary = document.getElementById('ard-tools-active-status');
    const footer = document.getElementById('ard-ide-bottom-port-label');
    const infName = document.getElementById('inf-board-name');
    const pill = document.getElementById('ard-ide-live-status-pill');

    if (badge) badge.innerText = `"${boardName}"`;
    if (benchBadge) benchBadge.innerText = `"${boardName}"`;
    if (summary) summary.innerText = `🟢 ${boardName} conectado na porta ${ard_selectedPort.split(' ')[0]}`;
    if (footer) footer.innerText = `${boardName} na ${ard_selectedPort.split(' ')[0]}`;
    if (infName) infName.innerText = boardName;
    if (pill && ard_isUsbConnected && ard_driverInstalled) {
        pill.innerText = `🟢 Conexão Ativa: ${boardName} em ${ard_selectedPort.split(' ')[0]}`;
    }

    ['uno', 'nano', 'mega', 'bb'].forEach(k => {
        document.querySelectorAll(`[id="chk-board-${k}"]`).forEach(el => {
            if (el && el.innerText) el.innerText = el.innerText.replace('●', '○');
        });
    });

    const boardKey = boardName.includes('Nano') ? 'nano' :
                     boardName.includes('Mega') ? 'mega' :
                     boardName.includes('BlackBoard') ? 'bb' : 'uno';
    document.querySelectorAll(`[id="chk-board-${boardKey}"]`).forEach(el => {
        if (el) el.innerText = '● ' + boardName;
    });

    if (typeof ard_updateBenchVisuals === 'function') ard_updateBenchVisuals();
}

function ard_setPort(portName) {
    if (typeof playSound === 'function') playSound('step');
    ard_selectedPort = portName;

    const badge = document.getElementById('ard-tools-port-badge');
    const benchBadge = document.getElementById('ard-bench-port-badge');
    const summary = document.getElementById('ard-tools-active-status');
    const footer = document.getElementById('ard-ide-bottom-port-label');
    const infPort = document.getElementById('inf-board-port');
    const pill = document.getElementById('ard-ide-live-status-pill');

    if (badge) badge.innerText = `"${portName.split(' ')[0]}"`;
    if (benchBadge) benchBadge.innerText = `"${portName.split(' ')[0]}"`;
    if (summary) summary.innerText = `🟢 ${ard_selectedBoard} conectado na porta ${portName.split(' ')[0]}`;
    if (footer) footer.innerText = `${ard_selectedBoard} na ${portName.split(' ')[0]}`;
    if (infPort) infPort.innerText = portName.split(' ')[0];
    if (pill && ard_isUsbConnected && ard_driverInstalled) {
        pill.innerText = `🟢 Conexão Ativa: ${ard_selectedBoard} em ${portName.split(' ')[0]}`;
    }

    ['com1', 'com3', 'com4', 'com7'].forEach(k => {
        document.querySelectorAll(`[id="chk-port-${k}"]`).forEach(el => {
            if (el && el.innerText) el.innerText = el.innerText.replace('●', '○');
        });
    });

    const portKey = portName.includes('COM1') ? 'com1' :
                    portName.includes('COM4') ? 'com4' :
                    portName.includes('COM7') ? 'com7' : 'com3';
    document.querySelectorAll(`[id="chk-port-${portKey}"]`).forEach(el => {
        if (el) el.innerText = '● ' + portName;
    });

    if (typeof ard_updateBenchVisuals === 'function') ard_updateBenchVisuals();
}

function ard_showBoardInfoDialog() {
    if (typeof playSound === 'function') playSound('click');
    const modal = document.getElementById('ard-board-info-modal');
    if (modal) modal.classList.add('open');
}

/* ================= BANCADA DE CONEXÃO HARDWARE & CABO USB ================= */
function ard_toggleBenchCable() {
    ard_isUsbConnected = !ard_isUsbConnected;
    ard_updateBenchVisuals();

    // Sincroniza Aba 2 (Gerenciador de Dispositivos)
    const cableBtn = document.getElementById('ard-cable-btn');
    const com3Line = document.getElementById('ard-dev-com3');
    const emptyLine = document.getElementById('ard-dev-empty');
    const otherBox = document.getElementById('ard-devmgmt-other');
    const badge = document.getElementById('ard-win-com-badge');
    const pill = document.getElementById('ard-ide-live-status-pill');

    if (cableBtn) {
        cableBtn.innerHTML = ard_isUsbConnected ? '<span>🔌 Desconectar Cabo USB</span>' : '<span>🔌 Conectar Cabo USB</span>';
    }
    if (ard_isUsbConnected) {
        if (ard_driverInstalled) {
            if (com3Line) com3Line.style.display = 'flex';
            if (emptyLine) emptyLine.style.display = 'none';
            if (otherBox) otherBox.style.display = 'none';
            if (badge) { badge.innerText = 'COM3'; badge.style.color = '#059669'; }
            if (pill) {
                pill.style.background = '#064E3B';
                pill.style.borderColor = '#10B981';
                pill.style.color = '#34D399';
                pill.innerText = `🟢 Conexão Ativa: ${ard_selectedBoard} em ${ard_selectedPort.split(' ')[0]}`;
            }
        } else {
            if (com3Line) com3Line.style.display = 'none';
            if (emptyLine) emptyLine.style.display = 'flex';
            if (otherBox) otherBox.style.display = 'block';
            if (badge) { badge.innerText = '⚠️ SEM DRIVER'; badge.style.color = '#D97706'; }
            if (pill) {
                pill.style.background = '#78350F';
                pill.style.borderColor = '#F59E0B';
                pill.style.color = '#FDE68A';
                pill.innerText = `⚠️ Cabo Conectado, mas SEM DRIVER!`;
            }
        }
    } else {
        if (com3Line) com3Line.style.display = 'none';
        if (emptyLine) emptyLine.style.display = 'flex';
        if (otherBox) otherBox.style.display = 'none';
        if (badge) { badge.innerText = 'DESCONECTADO'; badge.style.color = '#EF4444'; }
        if (pill) {
            pill.style.background = '#7F1D1D';
            pill.style.borderColor = '#EF4444';
            pill.style.color = '#FCA5A5';
            pill.innerText = `🔴 Cabo USB Desconectado`;
        }
    }
}

function ard_updateBenchVisuals() {
    const volt = document.getElementById('ard-bench-volt-label');
    const cableLabel = document.getElementById('ard-bench-cable-label');
    const portLabel = document.getElementById('ard-bench-port-label');
    const toggleBtnText = document.getElementById('ard-bench-toggle-text');
    const logText = document.getElementById('ard-bench-log-text');
    const head = document.getElementById('bench-cable-head');
    const pulse = document.getElementById('bench-cable-pulse');
    const body = document.getElementById('bench-cable-body');
    const ledOn = document.getElementById('bench-led-on');
    const notifConn = document.getElementById('bench-laptop-notif-connected');
    const notifDisc = document.getElementById('bench-laptop-notif-disconnected');
    const plugHint = document.getElementById('bench-plug-hint');
    const screenConn = document.getElementById('bench-screen-conn');
    const screenDisc = document.getElementById('bench-screen-disc');
    const screenPortTxt = document.getElementById('bench-screen-port-txt');
    const notifPortTxt = document.getElementById('bench-notif-port-txt');

    if (ard_isUsbConnected) {
        if (volt) { volt.innerText = '5.0V USB (Ativo)'; volt.style.color = '#10B981'; }
        if (cableLabel) { cableLabel.innerText = 'Conectado (Tipo A ➔ B)'; cableLabel.style.color = '#38BDF8'; }
        if (portLabel) { portLabel.innerText = `${ard_selectedPort.split(' ')[0]} (${ard_selectedBoard})`; portLabel.style.color = '#34D399'; }
        if (toggleBtnText) toggleBtnText.innerText = 'Desconectar Cabo USB';
        if (logText) logText.innerText = `🔌 Cabo USB Conectado: 5.0V fornecidos pelo PC ➔ Placa ${ard_selectedBoard} pronta na ${ard_selectedPort.split(' ')[0]}!`;
        if (head) head.setAttribute('transform', 'translate(0, 0)');
        if (pulse) pulse.style.display = 'block';
        if (body) body.setAttribute('stroke', '#0284C7');
        if (ledOn) { ledOn.setAttribute('fill', '#10B981'); ledOn.setAttribute('filter', 'url(#glowGreen)'); }
        if (notifConn) notifConn.style.display = 'block';
        if (notifDisc) notifDisc.style.display = 'none';
        if (screenConn) screenConn.style.display = 'block';
        if (screenDisc) screenDisc.style.display = 'none';
        if (screenPortTxt) screenPortTxt.innerText = `${ard_selectedPort.split(' ')[0]} (Ativa e Pronta)`;
        if (notifPortTxt) notifPortTxt.innerText = `${ard_selectedPort.split(' ')[0]} (${ard_selectedBoard})`;
        if (plugHint) plugHint.style.display = 'none';

        // Animação de inicialização do bootloader no LED L (Pino 13)
        const ledL = document.getElementById('bench-led-l');
        if (ledL) {
            let blinks = 0;
            const blinkTimer = setInterval(() => {
                blinks++;
                ledL.setAttribute('fill', blinks % 2 === 1 ? '#F59E0B' : '#334155');
                if (blinks >= 6) {
                    clearInterval(blinkTimer);
                    ledL.setAttribute('fill', '#F59E0B');
                }
            }, 100);
        }
    } else {
        if (volt) { volt.innerText = '0.0V (Desconectado)'; volt.style.color = '#EF4444'; }
        if (cableLabel) { cableLabel.innerText = 'Desconectado'; cableLabel.style.color = '#94A3B8'; }
        if (portLabel) { portLabel.innerText = 'Nenhuma Porta'; portLabel.style.color = '#EF4444'; }
        if (toggleBtnText) toggleBtnText.innerText = 'Conectar Cabo USB';
        if (logText) logText.innerText = '⚠️ Cabo USB Desconectado: Placa sem alimentação e sem canal de comunicação serial.';
        if (head) head.setAttribute('transform', 'translate(-65, 0)');
        if (pulse) pulse.style.display = 'none';
        if (body) body.setAttribute('stroke', '#475569');
        if (ledOn) { ledOn.setAttribute('fill', '#334155'); ledOn.removeAttribute('filter'); }
        if (notifConn) notifConn.style.display = 'none';
        if (notifDisc) notifDisc.style.display = 'block';
        if (screenConn) screenConn.style.display = 'none';
        if (screenDisc) screenDisc.style.display = 'block';
        if (plugHint) plugHint.style.display = 'block';
        const ledL = document.getElementById('bench-led-l');
        if (ledL) ledL.setAttribute('fill', '#334155');
    }
}

function ard_benchPingTest() {
    if (!ard_isUsbConnected) {
        if (typeof playSound === 'function') playSound('error');
        alert('⚠️ O cabo USB está desconectado! Conecte o cabo na bancada antes de testar a comunicação serial.');
        return;
    }
    if (typeof playSound === 'function') playSound('step');
    const logText = document.getElementById('ard-bench-log-text');
    const ledTx = document.getElementById('bench-led-tx');
    const ledRx = document.getElementById('bench-led-rx');
    if (logText) logText.innerText = `📡 Enviando ping serial TX do Computador para a porta ${ard_selectedPort.split(' ')[0]}...`;

    if (ledTx) ledTx.setAttribute('fill', '#F59E0B');
    setTimeout(() => {
        if (ledTx) ledTx.setAttribute('fill', '#334155');
        if (ledRx) ledRx.setAttribute('fill', '#38BDF8');
        setTimeout(() => {
            if (ledRx) ledRx.setAttribute('fill', '#334155');
            if (typeof playSound === 'function') playSound('success');
            if (logText) logText.innerText = `🟢 Comunicação Serial OK! ${ard_selectedBoard} respondeu [PONG] com sucesso na porta ${ard_selectedPort.split(' ')[0]} (115200 baud - 0% de perda)!`;
        }, 220);
    }, 220);
}

let ard_isResetHeld = false;

function ard_benchReset() {
    if (ard_isResetHeld) {
        ard_benchReleaseReset();
        return;
    }
    if (typeof playSound === 'function') playSound('click');
    const logText = document.getElementById('ard-bench-log-text');
    const ledL = document.getElementById('bench-led-l');
    const holdBanner = document.getElementById('ard-reset-hold-banner');
    const releaseBtn = document.getElementById('ard-btn-release-reset');
    if (holdBanner) holdBanner.style.display = 'none';
    if (releaseBtn) releaseBtn.style.display = 'none';

    if (logText) logText.innerText = '🔄 Clique Rápido no RESET (0.2s): o microcontrolador ATmega328P reiniciou!';
    if (ledL) {
        ledL.setAttribute('fill', '#334155');
        let blinks = 0;
        const blinkTimer = setInterval(() => {
            blinks++;
            ledL.setAttribute('fill', blinks % 2 === 1 ? '#F59E0B' : '#334155');
            if (blinks >= 6) {
                clearInterval(blinkTimer);
                ledL.setAttribute('fill', ard_isUsbConnected ? '#F59E0B' : '#334155');
                if (typeof playSound === 'function') playSound('success');
                if (logText && ard_isUsbConnected) {
                    logText.innerText = '✔ Bootloader Optiboot piscou o LED L (3x) e executou void setup() e loop(). (Dica: NUNCA precisa segurar o botão!)';
                }
            }
        }, 90);
    }
}

function ard_benchHoldReset() {
    ard_isResetHeld = true;
    if (typeof playSound === 'function') playSound('step');
    const logText = document.getElementById('ard-bench-log-text');
    const ledL = document.getElementById('bench-led-l');
    const holdBanner = document.getElementById('ard-reset-hold-banner');
    const releaseBtn = document.getElementById('ard-btn-release-reset');

    if (holdBanner) holdBanner.style.display = 'block';
    if (releaseBtn) releaseBtn.style.display = 'inline-flex';
    if (ledL) ledL.setAttribute('fill', '#1E293B');
    if (logText) logText.innerText = '🛑 BOTÃO RESET MANTIDO PRESSIONADO: O microcontrolador está CONGELADO em nível lógico 0V! Nenhum código é executado enquanto você segurar.';
}

function ard_benchReleaseReset() {
    ard_isResetHeld = false;
    if (typeof playSound === 'function') playSound('success');
    const logText = document.getElementById('ard-bench-log-text');
    const ledL = document.getElementById('bench-led-l');
    const holdBanner = document.getElementById('ard-reset-hold-banner');
    const releaseBtn = document.getElementById('ard-btn-release-reset');

    if (holdBanner) holdBanner.style.display = 'none';
    if (releaseBtn) releaseBtn.style.display = 'none';
    if (logText) logText.innerText = '🟢 Botão RESET SOLTO! O processador acordou, o bootloader piscou o LED L e iniciou o programa!';

    if (ledL && ard_isUsbConnected) {
        let blinks = 0;
        const blinkTimer = setInterval(() => {
            blinks++;
            ledL.setAttribute('fill', blinks % 2 === 1 ? '#F59E0B' : '#334155');
            if (blinks >= 6) {
                clearInterval(blinkTimer);
                ledL.setAttribute('fill', '#F59E0B');
            }
        }, 90);
    }
}


/* ================= ABA 5: SIMULADOR REALISTA DE UPLOAD & ZERAR ================= */
function ard_selectUploadSketch(sketchName) {
    try {
        if (typeof playSound === 'function') playSound('step');
    } catch(e) {}
    ard_uploadActiveSketch = sketchName;

    const btnTraffic = document.getElementById('btn-sketch-traffic');
    const btnBare = document.getElementById('btn-sketch-bare');
    const codeArea = document.getElementById('ard-upload-code-text');
    const titleTab = document.getElementById('ard-upload-tab-name');
    const winTitle = document.getElementById('ard-upload-window-title');
    const msg = document.getElementById('ard-upload-msg-text');
    const uploadGutter = document.getElementById('ard-upload-gutter');

    if (sketchName === 'BareMinimum.ino') {
        if (btnTraffic) { btnTraffic.style.background = '#334155'; }
        if (btnBare) { btnBare.style.background = '#064E3B'; }
        if (titleTab) titleTab.innerText = 'BareMinimum.ino';
        if (winTitle) winTitle.innerText = 'BareMinimum | Arduino 1.8.19';
        if (msg) msg.innerText = 'BareMinimum pronto. Clique em Carregar (➔) para ZERAR a memória do Arduino.';
        if (codeArea) {
            codeArea.innerHTML = `<span class="syn-cm">// Código Neutro BareMinimum (Zera e limpa o Arduino)</span>
<span class="syn-kw">void</span> <span class="syn-fn">setup</span>() {
  <span class="syn-cm">// Configurações vazias</span>
}

<span class="syn-kw">void</span> <span class="syn-fn">loop</span>() {
  <span class="syn-cm">// Laço vazio: o microcontrolador fica em repouso</span>
}`;
        }
        if (uploadGutter) {
            uploadGutter.innerHTML = '1<br>2<br>3<br>4<br>5<br>6<br>7<br>8';
        }
    } else {
        if (btnTraffic) { btnTraffic.style.background = '#0284C7'; }
        if (btnBare) { btnBare.style.background = '#334155'; }
        if (titleTab) titleTab.innerText = 'semaforo_maker.ino';
        if (winTitle) winTitle.innerText = 'semaforo_maker | Arduino 1.8.19';
        if (msg) msg.innerText = 'Pronto. Clique em "Carregar" (➔) para gravar o semáforo na placa.';
        if (codeArea) {
            codeArea.innerHTML = `<span class="syn-cm">// Código do Semáforo Maker (Pronto para Gravação)</span>
<span class="syn-kw">void</span> <span class="syn-fn">setup</span>() {
  <span class="syn-fn">pinMode</span>(<span class="syn-nm">12</span>, <span class="syn-cn">OUTPUT</span>); <span class="syn-cm">// LED Vermelho</span>
  <span class="syn-fn">pinMode</span>(<span class="syn-nm">11</span>, <span class="syn-cn">OUTPUT</span>); <span class="syn-cm">// LED Amarelo</span>
  <span class="syn-fn">pinMode</span>(<span class="syn-nm">10</span>, <span class="syn-cn">OUTPUT</span>); <span class="syn-cm">// LED Verde</span>
}

<span class="syn-kw">void</span> <span class="syn-fn">loop</span>() {
  <span class="syn-fn">digitalWrite</span>(<span class="syn-nm">10</span>, <span class="syn-cn">HIGH</span>); <span class="syn-fn">delay</span>(<span class="syn-nm">3000</span>); <span class="syn-cm">// Verde</span>
  <span class="syn-fn">digitalWrite</span>(<span class="syn-nm">10</span>, <span class="syn-cn">LOW</span>);  <span class="syn-fn">digitalWrite</span>(<span class="syn-nm">11</span>, <span class="syn-cn">HIGH</span>); <span class="syn-fn">delay</span>(<span class="syn-nm">1200</span>); <span class="syn-cm">// Amarelo</span>
  <span class="syn-fn">digitalWrite</span>(<span class="syn-nm">11</span>, <span class="syn-cn">LOW</span>);  <span class="syn-fn">digitalWrite</span>(<span class="syn-nm">12</span>, <span class="syn-cn">HIGH</span>); <span class="syn-fn">delay</span>(<span class="syn-nm">3000</span>); <span class="syn-cm">// Vermelho</span>
}`;
        }
        if (uploadGutter) {
            uploadGutter.innerHTML = '1<br>2<br>3<br>4<br>5<br>6<br>7<br>8<br>9<br>10<br>11<br>12';
        }
    }
}

function ard_runCompilerCheck() {
    if (typeof playSound === 'function') playSound('step');
    const msg = document.getElementById('ard-upload-msg-text');
    const consoleEl = document.getElementById('ard-upload-console');

    if (msg) msg.innerText = 'Compilando esboço...';
    if (consoleEl) consoleEl.innerText = 'avr-g++ -c -g -Os -w -fno-exceptions -ffunction-sections -fdata-sections -MMD -mmcu=atmega328p...';

    setTimeout(() => {
        if (typeof playSound === 'function') playSound('success');
        if (msg) msg.innerText = '✔ Compilação terminada com sucesso.';
        if (consoleEl) {
            consoleEl.innerText = `O sketch usa 1.542 bytes (4%) de espaço de armazenamento para programas. O máximo são 32.256 bytes.\nVariáveis globais usam 194 bytes (9%) de memória dinâmica, deixando 1.854 bytes para variáveis locais.`;
        }
    }, 600);
}

function ard_runRealUpload() {
    if (ard_isUploading) return;

    if (!ard_isUsbConnected) {
        if (typeof playSound === 'function') playSound('error');
        alert('❌ Erro: O cabo USB não está conectado! Conecte o cabo na Aba 2 antes de carregar.');
        return;
    }

    ard_isUploading = true;
    if (typeof playSound === 'function') playSound('step');

    const msg = document.getElementById('ard-upload-msg-text');
    const consoleEl = document.getElementById('ard-upload-console');
    const txLed = document.getElementById('led-tx');
    const rxLed = document.getElementById('led-rx');
    const stateEl = document.getElementById('ard-hw-state-text');

    if (msg) msg.innerText = 'Carregando... Gravando na memória Flash.';
    if (stateEl) stateEl.innerText = '⚡ Gravando Memória Flash...';

    if (consoleEl) {
        consoleEl.innerText = `avrdude: Version 6.3-20190619\n` +
            `         Using Port                    : ${ard_selectedPort.split(' ')[0]}\n` +
            `         Using Programmer              : arduino\n` +
            `         Overriding Baud Rate          : 115200\n` +
            `         AVR Part                      : ATmega328P\n` +
            `avrdude: AVR device initialized and ready to accept instructions\n` +
            `avrdude: Device signature = 0x1e950f (m328p)\n` +
            `avrdude: writing flash memory:\n` +
            `Writing | ################################################## | 100% 0.42s\n` +
            `avrdude: 1542 bytes of flash written\n` +
            `avrdude: verifying flash memory:\n` +
            `Reading | ################################################## | 100% 0.35s\n` +
            `avrdude: 1542 bytes of flash verified\n` +
            `avrdude done. Thank you.`;
    }

    // Efeito de piscar TX e RX rapidamente
    let flashCount = 0;
    const flicker = setInterval(() => {
        flashCount++;
        if (txLed) txLed.classList.toggle('flash-tx');
        if (rxLed) rxLed.classList.toggle('flash-rx');
        if (flashCount > 10) {
            clearInterval(flicker);
            if (txLed) txLed.classList.remove('flash-tx');
            if (rxLed) rxLed.classList.remove('flash-rx');

            ard_isUploading = false;
            if (typeof playSound === 'function') playSound('success');
            if (msg) msg.innerText = '✔ Carregamento concluído.';

            if (ard_uploadActiveSketch === 'BareMinimum.ino') {
                ard_stopTrafficCycle();
                if (stateEl) stateEl.innerText = '🧹 Arduino Limpo (Em Repouso)';
                alert('✨ ARDUINO ZERADO COM SUCESSO!\n\nA memória Flash foi sobrescrita com o BareMinimum (código neutro). A placa não executará nenhum código anterior até que você envie um novo programa!');
            } else {
                if (stateEl) stateEl.innerText = '🚦 Semáforo em Execução Contínua!';
                ard_startTrafficCycle();
            }
        }
    }, 100);
}

function ard_pressPhysicalReset() {
    if (typeof playSound === 'function') playSound('click');
    const stateEl = document.getElementById('ard-hw-state-text');
    if (stateEl) stateEl.innerText = '🔄 Processador Reiniciando...';

    ard_stopTrafficCycle();

    setTimeout(() => {
        if (typeof playSound === 'function') playSound('step');
        if (ard_uploadActiveSketch === 'semaforo_maker.ino') {
            if (stateEl) stateEl.innerText = '🚦 Semáforo Reiniciado!';
            ard_startTrafficCycle();
        } else {
            if (stateEl) stateEl.innerText = '🧹 Arduino Zerado (Em Repouso)';
        }
    }, 600);
}

function ard_startTrafficCycle() {
    ard_stopTrafficCycle();
    ard_trafficPhase = 0;
    ard_updateTrafficLeds();

    ard_trafficLightTimer = setInterval(() => {
        ard_trafficPhase = (ard_trafficPhase + 1) % 3;
        ard_updateTrafficLeds();
    }, 2000);
}

function ard_stopTrafficCycle() {
    if (ard_trafficLightTimer) {
        clearInterval(ard_trafficLightTimer);
        ard_trafficLightTimer = null;
    }
    const r = document.getElementById('hw-led-red');
    const y = document.getElementById('hw-led-yellow');
    const g = document.getElementById('hw-led-green');
    if (r) r.className = 'ard-led-indicator';
    if (y) y.className = 'ard-led-indicator';
    if (g) g.className = 'ard-led-indicator';
}

function ard_updateTrafficLeds() {
    const r = document.getElementById('hw-led-red');
    const y = document.getElementById('hw-led-yellow');
    const g = document.getElementById('hw-led-green');
    const stateEl = document.getElementById('ard-hw-state-text');
    if (!r || !y || !g) return;

    r.className = 'ard-led-indicator';
    y.className = 'ard-led-indicator';
    g.className = 'ard-led-indicator';

    if (ard_trafficPhase === 0) {
        g.classList.add('active-green');
        if (stateEl) stateEl.innerText = '🟢 SINAL VERDE: Siga em frente!';
    } else if (ard_trafficPhase === 1) {
        y.classList.add('active-yellow');
        if (stateEl) stateEl.innerText = '🟡 SINAL AMARELO: Atenção!';
    } else if (ard_trafficPhase === 2) {
        r.classList.add('active-red');
        if (stateEl) stateEl.innerText = '🔴 SINAL VERMELHO: Pare!';
    }
}

/* ================= ABA 6: QUIZ MAKER ================= */
const ard_quizData = [
    {
        q: 'Onde você pode baixar a Arduino IDE gratuitamente sem ser obrigado a doar dinheiro?',
        opts: [
            'No site oficial www.arduino.cc, clicando no botão "JUST DOWNLOAD"',
            'Apenas comprando uma assinatura mensal paga',
            'Em sites desconhecidos de torrents',
            'É obrigatório doar no mínimo 25 dólares'
        ],
        correct: 0,
        explain: 'Perfeito! A Arduino IDE é Open Source (software livre e gratuito). Clicando em "JUST DOWNLOAD" o download oficial inicia 100% de graça!'
    },
    {
        q: 'Qual atalho de teclado no Windows permite abrir rapidamente o Gerenciador de Dispositivos?',
        opts: [
            'Windows + X (e clicar em Gerenciador de Dispositivos)',
            'Ctrl + Alt + Delete e desligar o computador',
            'F5 e F12',
            'Alt + F4'
        ],
        correct: 0,
        explain: 'Excelente! O atalho Windows + X abre o menu de ferramentas rápidas do Windows onde o Gerenciador de Dispositivos está sempre à mão.'
    },
    {
        q: 'Qual é a função do botão "Verificar" (ícone de visto ✔) na Arduino IDE?',
        opts: [
            'Compila o código e detecta erros de sintaxe (como ponto e vírgula ou chaves faltantes)',
            'Formata o disco rígido do computador',
            'Desliga o monitor',
            'Apaga a memória do Arduino'
        ],
        correct: 0,
        explain: 'Exato! O botão Verificar compila o código e avisa se há erros de sintaxe antes de qualquer envio.'
    },
    {
        q: 'No menu Ferramentas da Arduino IDE, quais são as duas coisas obrigatórias que devemos conferir antes de carregar o código?',
        opts: [
            'A Placa (ex: Arduino Uno) e a Porta Serial (ex: COM3)',
            'A cor do tema e o papel de parede',
            'O antivírus e a hora do relógio',
            'A velocidade da internet'
        ],
        correct: 0,
        explain: 'Muito bem! Indicar o modelo da Placa e a Porta correta permite que a IDE converse com o chip certo via USB.'
    },
    {
        q: 'Como fazemos para "zerar" as configurações do Arduino e fazer ele parar de rodar programas antigos?',
        opts: [
            'Abrindo Arquivo > Exemplos > 01.Basics > BareMinimum e clicando em Carregar (Upload)',
            'Jogando a placa na lixeira',
            'Tirando o chip com uma faca',
            'Colocando um ímã em cima do Arduino'
        ],
        correct: 0,
        explain: 'Sensacional! O BareMinimum grava um código com setup() e loop() vazios, deixando a memória neutra e a placa em repouso!'
    }
];

function ard_initQuiz() {
    const counterEl = document.getElementById('ard-quiz-counter');
    const qEl = document.getElementById('ard-quiz-q');
    const optsContainer = document.getElementById('ard-quiz-opts');
    const feedbackEl = document.getElementById('ard-quiz-feedback');

    if (!qEl || !optsContainer) return;

    if (ard_quizIndex >= ard_quizData.length) {
        ard_completeLevel(8, 'Oficina do Arduino & IDE', 'Você dominou a instalação da IDE, configuração dos drivers e portas COMx!');
        ard_quizIndex = 0;
        return;
    }

    const cur = ard_quizData[ard_quizIndex];
    if (counterEl) counterEl.innerText = `Pergunta ${ard_quizIndex + 1} / ${ard_quizData.length}`;
    qEl.innerText = cur.q;
    optsContainer.innerHTML = '';
    if (feedbackEl) feedbackEl.innerHTML = '';

    cur.opts.forEach((opt, idx) => {
        const btn = document.createElement('button');
        btn.style.cssText = 'background:#1E293B;color:#E2E8F0;border:2px solid #334155;padding:12px 18px;border-radius:12px;font-size:0.92rem;font-weight:700;text-align:left;cursor:pointer;transition:all 0.2s;';
        btn.innerText = opt;
        btn.onmouseover = () => { btn.style.borderColor = '#38BDF8'; btn.style.background = '#334155'; };
        btn.onmouseout = () => { btn.style.borderColor = '#334155'; btn.style.background = '#1E293B'; };

        btn.onclick = () => {
            const allBtns = optsContainer.querySelectorAll('button');
            allBtns.forEach(b => b.disabled = true);

            if (idx === cur.correct) {
                btn.style.background = '#064E3B';
                btn.style.borderColor = '#10B981';
                btn.style.color = '#34D399';
                feedbackEl.innerHTML = `<span style="color:#34D399;">✔ ${cur.explain}</span>`;
                if (typeof playSound === 'function') playSound('success');
                setTimeout(() => {
                    ard_quizIndex++;
                    ard_initQuiz();
                }, 1800);
            } else {
                btn.style.background = '#7F1D1D';
                btn.style.borderColor = '#EF4444';
                feedbackEl.innerHTML = `<span style="color:#EF4444;">❌ Ops! Tente novamente!</span>`;
                if (typeof playSound === 'function') playSound('error');
                setTimeout(() => {
                    allBtns.forEach(b => {
                        b.disabled = false;
                        b.style.background = '#1E293B';
                        b.style.borderColor = '#334155';
                    });
                    feedbackEl.innerHTML = '';
                }, 1500);
            }
        };
        optsContainer.appendChild(btn);
    });
}

function ard_showModal(icon, title, text, extraHTML) {
    const iconEl = document.getElementById('ard-mIcon');
    const titleEl = document.getElementById('ard-mTitle');
    const textEl = document.getElementById('ard-mText');
    const modalEl = document.getElementById('ard-modal');
    if (iconEl) iconEl.innerText = icon;
    if (titleEl) titleEl.innerText = title;
    if (textEl) textEl.innerHTML = text + (extraHTML || '');
    if (modalEl) modalEl.classList.add('active');
}

function ard_closeModal() {
    const modalEl = document.getElementById('ard-modal');
    if (modalEl) modalEl.classList.remove('active');
}

function ard_completeLevel(levelNum, title, msg) {
    let saved = JSON.parse(localStorage.getItem('arduino_levels') || '[]');
    if (!saved.includes(levelNum)) saved.push(levelNum);
    localStorage.setItem('arduino_levels', JSON.stringify(saved));
    if (typeof updateHubProgress === 'function') updateHubProgress();
    if (typeof updateTrail === 'function') updateTrail();
    if (typeof playSound === 'function') playSound('success');

    let speedrunHTML = '';
    if (window.makerLeaderboard) {
        const elapsed = window.makerLeaderboard.stopTimer('arduino', levelNum);
        const res = window.makerLeaderboard.recordCompletion('arduino', levelNum, elapsed);
        speedrunHTML = window.makerLeaderboard.generateWinTimeCardHTML('arduino', levelNum, res);
    }
    ard_showModal('🏆', title, msg, speedrunHTML);
}

// Exportações Globais
window.loadArduino = loadArduino;
window.ard_switchTabDirect = ard_switchTabDirect;
window.ard_toggleUsbCable = ard_toggleUsbCable;
window.ard_simDriverStatus = ard_simDriverStatus;
window.ard_scanHardwareChanges = ard_scanHardwareChanges;
window.ard_closeDevMgmtWindow = ard_closeDevMgmtWindow;
window.ard_togglePortsFolder = ard_togglePortsFolder;
window.ard_openDeviceProperties = ard_openDeviceProperties;
window.ard_closeDeviceProperties = ard_closeDeviceProperties;
window.ard_openDriverModal = ard_openDriverModal;
window.ard_closeDriverModal = ard_closeDriverModal;
window.ard_highlightPin = ard_highlightPin;
window.ard_showPinTooltip = ard_showPinTooltip;
window.ard_hidePinTooltip = ard_hidePinTooltip;
window.ard_onCardHover = ard_onCardHover;
window.ard_onCardLeave = ard_onCardLeave;
window.ard_ideAction = ard_ideAction;
window.ard_toggleSerialWindow = ard_toggleSerialWindow;
window.ard_openWindowsFileDialog = ard_openWindowsFileDialog;
window.ard_toggleRealToolsMenu = ard_toggleRealToolsMenu;
window.ard_setBoard = ard_setBoard;
window.ard_setPort = ard_setPort;
window.ard_showBoardInfoDialog = ard_showBoardInfoDialog;
window.ard_autoFormatCode = ard_autoFormatCode;
window.ard_loadSketch = ard_loadSketch;
window.ard_setEditorCode = ard_setEditorCode;
window.ard_handleCodeInput = ard_handleCodeInput;
window.ard_syncEditorScroll = ard_syncEditorScroll;
window.ard_handleEditorKey = ard_handleEditorKey;
window.ard_updateEditorGutter = ard_updateEditorGutter;
window.ard_getCurrentEditorCode = ard_getCurrentEditorCode;
window.ard_validateArduinoCode = ard_validateArduinoCode;
window.ard_highlightArduinoSyntax = ard_highlightArduinoSyntax;
window.ard_closeWindowsFileDialog = ard_closeWindowsFileDialog;
window.ard_toggleMenu = ard_toggleMenu;
window.ard_sketches = ard_sketches;
window.ard_startOverlayTour = ard_startOverlayTour;
window.ard_closeOverlayTour = ard_closeOverlayTour;
window.ard_nextOverlayTour = ard_nextOverlayTour;
window.ard_prevOverlayTour = ard_prevOverlayTour;
window.ard_selectUploadSketch = ard_selectUploadSketch;
window.ard_runCompilerCheck = ard_runCompilerCheck;
window.ard_runRealUpload = ard_runRealUpload;
window.ard_pressPhysicalReset = ard_pressPhysicalReset;
window.ard_completeLevel = ard_completeLevel;
window.ard_closeModal = ard_closeModal;

// Funções do Plotter Serial & Monitor Serial
window.ard_openSerialPlotter = ard_openSerialPlotter;
window.ard_closeSerialPlotter = ard_closeSerialPlotter;
window.ard_togglePlotterPause = ard_togglePlotterPause;
window.ard_clearPlotter = ard_clearPlotter;
window.ard_changePlotterSource = ard_changePlotterSource;
window.ard_changePlotterScale = ard_changePlotterScale;
window.ard_changePlotterBaud = ard_changePlotterBaud;
window.ard_onPotChange = ard_onPotChange;
window.ard_onLdrChange = ard_onLdrChange;
window.ard_togglePlotterCodeSnippet = ard_togglePlotterCodeSnippet;
window.ard_advanceTrafficLightPhase = ard_advanceTrafficLightPhase;
window.ard_closeSerialMonitor = ard_closeSerialMonitor;
window.ard_clearSerialMonitor = ard_clearSerialMonitor;
window.ard_sendSerialMessage = ard_sendSerialMessage;

// Funções da Bancada de Conexão Física (Aba 3)
window.ard_toggleBenchCable = ard_toggleBenchCable;
window.ard_updateBenchVisuals = ard_updateBenchVisuals;
window.ard_benchPingTest = ard_benchPingTest;
window.ard_benchReset = ard_benchReset;
window.ard_benchHoldReset = ard_benchHoldReset;
window.ard_benchReleaseReset = ard_benchReleaseReset;

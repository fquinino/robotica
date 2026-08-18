/* ==========================================================================
   AULA 4 — SEMÁFORO DIGITAL & JARDIM DOS LOOPS (TEMPORIZAÇÃO & CONDICIONAIS)
   ========================================================================== */

    function loadSemaforo() {
        const container = document.getElementById('semaforo-container');
        container.innerHTML = `
            <style>
                /* Estilos do Semáforo */
                .semaforo-wrapper { max-width:700px; margin:0 auto; }
                .semaforo-wrapper .scene { background:url('bg_semaforo.png') center/cover; border-radius:20px; padding:20px; display:flex; flex-direction:column; align-items:center; border:2px solid #334155; margin-bottom:15px; position:relative; height:350px; overflow:hidden; }
                .semaforo-wrapper .traffic { position:absolute; top:10px; right:10px; display:flex; flex-direction:column; gap:10px; background:rgba(15,23,42,0.9); padding:15px; border-radius:20px; border:4px solid #475569; z-index:20; }
                .semaforo-wrapper .light { width:35px; height:35px; border-radius:50%; background:#334155; border:3px solid #000; transition:0.3s; }
                .semaforo-wrapper .light.red.active { background:#EF4444; box-shadow:0 0 30px #EF4444; }
                .semaforo-wrapper .light.yellow.active { background:#F59E0B; box-shadow:0 0 30px #F59E0B; }
                .semaforo-wrapper .light.green.active { background:#10B981; box-shadow:0 0 30px #10B981; }
                .semaforo-wrapper .car { position:absolute; bottom:110px; left:20px; font-size:4rem; transition:left 2s ease-in-out; z-index:10; }
                .semaforo-wrapper .pedestrian { position:absolute; bottom:10px; left:250px; font-size:3rem; transition:bottom 1.5s ease-in-out; z-index:15; }
                .semaforo-wrapper .controls { display:flex; gap:8px; flex-wrap:wrap; justify-content:center; margin:10px 0; }
                .semaforo-wrapper .cmd-btn { background:#334155; color:white; border:none; padding:8px 16px; border-radius:12px; font-weight:900; cursor:pointer; border-bottom:4px solid #0F172A; flex:1; min-width:70px; }
                .semaforo-wrapper .cmd-btn:active { transform:translateY(4px); border-bottom-width:0; }
                .semaforo-wrapper .code-area { background:#0F172A; border-radius:16px; min-height:50px; padding:10px; border:2px dashed #334155; display:flex; flex-wrap:wrap; gap:6px; align-items:center; }
                .semaforo-wrapper .code-line { background:#1E293B; padding:4px 12px; border-radius:8px; border-left:4px solid #F59E0B; color:#CBD5E1; }
                .semaforo-wrapper .actions { display:flex; gap:10px; margin-top:10px; }
                .semaforo-wrapper .btn-run { background:#10B981; border:none; padding:12px; border-radius:16px; font-weight:900; color:white; flex:2; border-bottom:5px solid #047857; cursor:pointer; }
                .semaforo-wrapper .btn-undo { background:#F59E0B; border:none; padding:12px; border-radius:16px; font-weight:900; color:#0F172A; flex:1; border-bottom:5px solid #B45309; cursor:pointer; }
                .semaforo-wrapper .btn-clear { background:#EF4444; border:none; padding:12px; border-radius:16px; font-weight:900; color:white; flex:1; border-bottom:5px solid #991B1B; cursor:pointer; }
                .semaforo-wrapper .level-bar { display:flex; gap:8px; justify-content:center; margin:10px 0; }
                .semaforo-wrapper .level-btn { background:#334155; border:none; color:#94A3B8; padding:6px 15px; border-radius:30px; font-weight:900; cursor:pointer; }
                .semaforo-wrapper .level-btn.active { background:#F59E0B; color:#0F172A; }
                .semaforo-wrapper .modal { position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.8); display:flex; justify-content:center; align-items:center; z-index:999; opacity:0; pointer-events:none; transition:0.3s; }
                .semaforo-wrapper .modal.active { opacity:1; pointer-events:all; }
                .semaforo-wrapper .modal-box { background:#1E293B; padding:30px; border-radius:30px; max-width:400px; text-align:center; border:3px solid #F59E0B; }
                .semaforo-wrapper .modal-icon { font-size:4rem; }
                .semaforo-wrapper .modal-title { font-family:'Fredoka One', cursive; color:white; }
                .semaforo-wrapper .modal-text { color:#CBD5E1; margin:15px 0; }
                .semaforo-wrapper .btn-modal { background:#38BDF8; border:none; padding:12px 30px; border-radius:50px; font-weight:900; cursor:pointer; }
            </style>
            <div class="semaforo-wrapper">
                <div class="level-bar">
                    <button class="level-btn active" data-level="1">⭐ Nível 1</button>
                    <button class="level-btn" data-level="2">⭐⭐ Nível 2</button>
                    <button class="level-btn" data-level="3">⭐⭐⭐ Nível 3</button>
                </div>
                <div class="scene">
                    <div class="traffic">
                        <div class="light red" id="slred"></div>
                        <div class="light yellow" id="slyellow"></div>
                        <div class="light green active" id="slgreen"></div>
                    </div>
                    <div class="car" id="scar">🚗</div>
                    <div class="pedestrian" id="sped">🚶</div>
                </div>
                <div class="controls">
                    <button class="cmd-btn" style="background:#10B981;color:#0F172A;" onclick="s_addCmd('GREEN')">Verde</button>
                    <button class="cmd-btn" style="background:#F59E0B;color:#0F172A;" onclick="s_addCmd('YELLOW')">Amarelo</button>
                    <button class="cmd-btn" style="background:#38BDF8;" onclick="s_addCmd('DELAY')">Delay</button>
                    <button class="cmd-btn" style="background:#EF4444;" onclick="s_addCmd('RED')">Vermelho</button>
                    <button class="cmd-btn" style="background:#8B5CF6;" onclick="s_addCmd('WALK')">Pedestre</button>
                </div>
                <div class="code-area" id="s_codeArea"><span style="color:#64748B;">Seu código...</span></div>
                <div class="actions">
                    <button class="btn-undo" onclick="s_undoCmd()"><i class="fas fa-undo"></i></button>
                    <button class="btn-clear" onclick="s_clearCode()"><i class="fas fa-trash"></i></button>
                    <button class="btn-run" onclick="s_runCode()"><i class="fas fa-play"></i> Executar</button>
                </div>
                <div class="arduino-code-panel" style="background:#0F172A;border:2px solid #38BDF8;border-radius:16px;padding:15px;margin-top:15px;">
                    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
                        <span style="font-weight:900;color:#38BDF8;font-size:0.95rem;"><i class="fa-solid fa-code"></i> Código Arduino C++ (Tempo Real)</span>
                        <button onclick="s_copyCode()" style="background:#334155;color:#38BDF8;border:1px solid #38BDF8;padding:4px 12px;border-radius:8px;font-size:0.8rem;font-weight:800;cursor:pointer;"><i class="fa-regular fa-copy"></i> Copiar C++</button>
                    </div>
                    <pre id="s_arduinoCode" style="margin:0;color:#E2E8F0;font-family:'Courier New', monospace;font-size:0.88rem;line-height:1.4;white-space:pre-wrap;overflow-x:auto;"></pre>
                </div>
            </div>
            <div class="modal" id="s_modal"><div class="modal-box"><div class="modal-icon" id="s_mIcon">🎉</div><h2 class="modal-title" id="s_mTitle">Parabéns!</h2><p class="modal-text" id="s_mText">Mensagem</p><button class="btn-modal" onclick="s_closeModal()">Continuar</button></div></div>
        `;
        // Inicializa o jogo
        s_init();
        document.getElementById('semaforo-loaded')?.remove();
        const flag = document.createElement('div'); flag.id = 'semaforo-loaded'; flag.style.display='none'; container.appendChild(flag);
    }

    // Funções do Semáforo (escopo global)
    let s_seq = [], s_running = false, s_level = 1;
    const s_levels = {
        1: { required: ['YELLOW','DELAY','RED'], msg: 'Nível 1: Amarelo -> Delay -> Vermelho' },
        2: { required: ['YELLOW','DELAY','RED','DELAY','WALK'], msg: 'Nível 2: Amarelo -> Delay -> Vermelho -> Delay -> Pedestre' },
        3: { required: ['YELLOW','DELAY','RED','DELAY','WALK','DELAY','YELLOW','DELAY','GREEN'], msg: 'Nível 3: Ciclo completo!' }
    };
    function s_init() {
        document.querySelectorAll('.semaforo-wrapper .level-btn').forEach(btn => {
            btn.onclick = () => {
                document.querySelectorAll('.semaforo-wrapper .level-btn').forEach(b=>b.classList.remove('active'));
                btn.classList.add('active');
                s_level = parseInt(btn.dataset.level);
                s_clearCode();
                s_resetScene();
            };
        });
        s_resetScene();
        s_updateArduinoCode();
    }
    function s_resetScene() {
        document.getElementById('slred').classList.remove('active');
        document.getElementById('slyellow').classList.remove('active');
        document.getElementById('slgreen').classList.remove('active');
        document.getElementById('slgreen').classList.add('active');
        const car = document.getElementById('scar');
        const ped = document.getElementById('sped');
        car.style.transition = 'none';
        car.style.left = '20px';
        ped.style.transition = 'none';
        ped.style.bottom = '10px';
        setTimeout(() => {
            car.style.transition = 'left 2s ease-in-out';
            ped.style.transition = 'bottom 1.5s ease-in-out';
        }, 50);
    }
    function s_addCmd(c) {
        playSound('click');
        if(s_running) return;
        const area = document.getElementById('s_codeArea');
        if(s_seq.length===0) area.innerHTML = '';
        s_seq.push(c);
        const el = document.createElement('span');
        el.className = 'code-line';
        el.innerText = c;
        area.appendChild(el);
        s_updateArduinoCode();
    }
    function s_undoCmd() {
        if(s_running || s_seq.length===0) return;
        playSound('click');
        s_seq.pop();
        const area = document.getElementById('s_codeArea');
        if(s_seq.length===0) {
            area.innerHTML = '<span style="color:#64748B;">Seu código...</span>';
        } else {
            area.innerHTML = s_seq.map(c => `<span class="code-line">${c}</span>`).join('');
        }
        s_updateArduinoCode();
    }
    function s_clearCode() { s_seq=[]; document.getElementById('s_codeArea').innerHTML = '<span style="color:#64748B;">Seu código...</span>'; s_resetScene(); s_updateArduinoCode(); }
    function s_updateArduinoCode() {
        const el = document.getElementById('s_arduinoCode');
        if(!el) return;
        let code = `// --- Semáforo Maker (Arduino C++) ---\n` +
                   `const int PIN_VERMELHO = 12;\n` +
                   `const int PIN_AMARELO  = 11;\n` +
                   `const int PIN_VERDE    = 10;\n` +
                   `const int PIN_PEDESTRE = 9;\n\n` +
                   `void setup() {\n` +
                   `  pinMode(PIN_VERMELHO, OUTPUT);\n` +
                   `  pinMode(PIN_AMARELO, OUTPUT);\n` +
                   `  pinMode(PIN_VERDE, OUTPUT);\n` +
                   `  pinMode(PIN_PEDESTRE, OUTPUT);\n` +
                   `  digitalWrite(PIN_VERDE, HIGH); // Início verde\n` +
                   `}\n\n` +
                   `void loop() {\n`;
        if(s_seq.length === 0) {
            code += `  // Adicione blocos para gerar o código Arduino!\n`;
        } else {
            s_seq.forEach(cmd => {
                if(cmd === 'YELLOW') code += `  digitalWrite(PIN_VERDE, LOW);\n  digitalWrite(PIN_AMARELO, HIGH);\n`;
                else if(cmd === 'DELAY') code += `  delay(1200); // Temporizador\n`;
                else if(cmd === 'RED') code += `  digitalWrite(PIN_AMARELO, LOW);\n  digitalWrite(PIN_VERMELHO, HIGH);\n`;
                else if(cmd === 'WALK') code += `  digitalWrite(PIN_PEDESTRE, HIGH); // Pedestre atravessa\n`;
                else if(cmd === 'GREEN') code += `  digitalWrite(PIN_VERMELHO, LOW);\n  digitalWrite(PIN_PEDESTRE, LOW);\n  digitalWrite(PIN_VERDE, HIGH);\n`;
            });
        }
        code += `}`;
        el.innerText = code;
    }
    function s_copyCode() {
        const code = document.getElementById('s_arduinoCode')?.innerText;
        if(code) {
            navigator.clipboard.writeText(code);
            alert('Código Arduino C++ copiado com sucesso! 📋');
        }
    }
    function s_sleep(ms){ return new Promise(r=>setTimeout(r,ms)); }
    async function s_runCode() {
        if(s_running || s_seq.length===0) return;
        playSound('click');
        s_running = true;
        s_resetScene();
        let currentLight = 'GREEN', hasDelay = false, crashed = false;
        const car = document.getElementById('scar');
        const ped = document.getElementById('sped');
        
        for(let i=0; i<s_seq.length; i++) {
            const cmd = s_seq[i];
            await s_sleep(500);
            if(cmd === 'YELLOW') {
                document.getElementById('slred').classList.remove('active');
                document.getElementById('slgreen').classList.remove('active');
                document.getElementById('slyellow').classList.add('active');
                currentLight = 'YELLOW';
                hasDelay = false;
                playSound('step');
            } else if(cmd === 'DELAY') {
                await s_sleep(1200);
                hasDelay = true;
            } else if(cmd === 'RED') {
                if(currentLight !== 'YELLOW' || !hasDelay) {
                    s_showModal('💥','Bug!','Você precisa avisar com Amarelo e esperar (Delay) antes do Vermelho!');
                    playSound('error');
                    crashed=true; break;
                }
                document.getElementById('slyellow').classList.remove('active');
                document.getElementById('slgreen').classList.remove('active');
                document.getElementById('slred').classList.add('active');
                currentLight = 'RED';
                car.style.left = '450px';
                playSound('step');
            } else if(cmd === 'WALK') {
                if(currentLight !== 'RED') {
                    s_showModal('🚨','Perigo!','Só pode andar com o sinal VERMELHO!');
                    playSound('error');
                    crashed=true; break;
                }
                ped.style.bottom = '220px';
                playSound('step');
                await s_sleep(1500);
            } else if(cmd === 'GREEN') {
                document.getElementById('slred').classList.remove('active');
                document.getElementById('slyellow').classList.remove('active');
                document.getElementById('slgreen').classList.add('active');
                currentLight = 'GREEN';
                car.style.left = '600px';
                playSound('step');
            }
        }
        if(!crashed) {
            const req = s_levels[s_level].required;
            const success = s_seq.length >= req.length && req.every((v,i)=>s_seq[i]===v);
            if(success) {
                s_showModal('🏆','Nível Concluído!','Você programou o semáforo perfeitamente!');
                playSound('success');
                let saved = JSON.parse(localStorage.getItem('semaforo_levels')||'[]');
                if(!saved.includes(s_level)) saved.push(s_level);
                localStorage.setItem('semaforo_levels', JSON.stringify(saved));
            } else {
                s_showModal('❌','Quase lá!','A sequência não está exatamente correta para este nível.');
                playSound('error');
            }
        }
        s_running = false;
    }
    function s_showModal(icon, title, text) {
        document.getElementById('s_mIcon').innerText = icon;
        document.getElementById('s_mTitle').innerText = title;
        document.getElementById('s_mText').innerText = text;
        document.getElementById('s_modal').classList.add('active');
    }
    function s_closeModal() {
        document.getElementById('s_modal').classList.remove('active');
        s_clearCode();
    }

    // ================= TESOURO =================

    function loadJardim() {
        const container = document.getElementById('jardim-container');
        container.innerHTML = `
            <style>
                .jardim-wrapper .scene { background:url('bg_jardim.png') center/cover; border-radius:20px; height:350px; border:2px solid #334155; overflow:hidden; display:flex; flex-direction:column; justify-content:flex-end; position:relative; box-shadow:inset 0 0 20px rgba(0,0,0,0.3); }
                .jardim-wrapper .sun { position:absolute; top:10px; right:20px; font-size:4rem; color:#F59E0B; animation:spin 10s linear infinite; filter:drop-shadow(0 0 10px #F59E0B); }
                .jardim-wrapper .cloud { position:absolute; font-size:3rem; color:rgba(255,255,255,0.8); }
                .jardim-wrapper .c1 { top:15px; left:10%; animation:float 12s infinite alternate; }
                .jardim-wrapper .c2 { top:35px; left:65%; animation:float 18s infinite alternate-reverse; }
                .jardim-wrapper .fence { position:absolute; right:5px; bottom:45px; font-size:3.5rem; z-index:10; }
                .jardim-wrapper .robot { position:absolute; bottom:55px; left:10px; font-size:3rem; transition:left 0.5s ease-in-out; z-index:15; filter:drop-shadow(0 5px 5px rgba(0,0,0,0.5)); }
                .jardim-wrapper .robot.crash { animation:shake 0.5s infinite; left:650px !important; }
                .jardim-wrapper .ground { width:100%; height:60px; background:#78350F; position:relative; border-top:5px solid #A16207; display:flex; align-items:flex-start; padding-left:70px; gap:8px; }
                .jardim-wrapper .dirt-patch { width:55px; height:15px; background:#451A03; border-radius:50%; margin-top:-8px; position:relative; display:flex; justify-content:center; align-items:flex-end; }
                .jardim-wrapper .sprout { position:absolute; bottom:5px; font-size:2.2rem; transform:scale(0); transition:transform 0.4s cubic-bezier(0.175,0.885,0.32,1.275); }
                .jardim-wrapper .sprout.grown { transform:scale(1); }
                .jardim-wrapper .sprout.defect { color:#64748B; filter:grayscale(1); }
                .jardim-wrapper .code-editor { background:#0F172A; padding:20px; border-radius:16px; font-family:monospace; font-size:1rem; line-height:1.8; border-left:6px solid #34D399; margin:15px 0; color:#CBD5E1; }
                .jardim-wrapper .code-line { padding:2px 10px; border-radius:5px; transition:background 0.2s; border-left:4px solid transparent; }
                .jardim-wrapper .code-line.active { background:rgba(52,211,153,0.2); border-left-color:#F59E0B; }
                .jardim-wrapper .code-line.executing { background:rgba(52,211,153,0.35); border-left-color:#34D399; }
                .jardim-wrapper .kw { color:#F472B6; font-weight:bold; }
                .jardim-wrapper .fn { color:#60A5FA; }
                .jardim-wrapper .br { color:#FCD34D; }
                .jardim-wrapper .cm { color:#64748B; font-style:italic; }
                .jardim-wrapper select { background:#1E293B; color:#34D399; border:2px solid #475569; padding:2px 8px; border-radius:6px; font-family:'Fredoka One'; font-size:1.1rem; cursor:pointer; }
                .jardim-wrapper .actions { display:flex; gap:10px; }
                .jardim-wrapper .btn-run { background:#34D399; color:#0F172A; border:none; padding:14px; border-radius:16px; font-family:'Fredoka One', cursive; font-size:1.3rem; flex:2; border-bottom:6px solid #047857; cursor:pointer; }
                .jardim-wrapper .btn-run:active { transform:translateY(6px); border-bottom-width:0; }
                .jardim-wrapper .btn-run:disabled { background:#475569; border-bottom-color:#1E293B; cursor:not-allowed; }
                .jardim-wrapper .level-bar { display:flex; gap:8px; justify-content:center; margin:10px 0; }
                .jardim-wrapper .level-btn { background:#334155; border:none; color:#94A3B8; padding:6px 15px; border-radius:30px; font-weight:900; cursor:pointer; }
                .jardim-wrapper .level-btn.active { background:#34D399; color:#0F172A; }
                .jardim-wrapper .modal { position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.8); display:flex; justify-content:center; align-items:center; z-index:999; opacity:0; pointer-events:none; transition:0.3s; }
                .jardim-wrapper .modal.active { opacity:1; pointer-events:all; }
                .jardim-wrapper .modal-box { background:#1E293B; padding:30px; border-radius:30px; max-width:400px; text-align:center; border:3px solid #34D399; }
                .jardim-wrapper .modal-icon { font-size:4rem; }
                .jardim-wrapper .modal-title { font-family:'Fredoka One', cursive; color:white; }
                .jardim-wrapper .modal-text { color:#CBD5E1; margin:15px 0; }
                .jardim-wrapper .btn-modal { background:#34D399; border:none; padding:12px 30px; border-radius:50px; font-weight:900; color:#0F172A; cursor:pointer; }
                @keyframes spin { 100% { transform:rotate(360deg); } }
                @keyframes float { 0% { transform:translateX(0); } 100% { transform:translateX(30px); } }
                @keyframes shake { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-5px)} 75%{transform:translateX(5px)} }
            </style>
            <div class="jardim-wrapper">
                <div class="level-bar">
                    <button class="level-btn active" data-level="1">⭐ Nível 1</button>
                    <button class="level-btn" data-level="2">⭐⭐ Nível 2</button>
                    <button class="level-btn" data-level="3">⭐⭐⭐ Nível 3</button>
                </div>
                <div id="j_mission-info" style="background:#1E293B;padding:12px 16px;border-radius:12px;border-left:5px solid #34D399;margin-bottom:12px;color:#CBD5E1;font-size:0.95rem;font-weight:700;"></div>
                <div class="scene">
                    <i class="fa-solid fa-sun sun"></i>
                    <i class="fa-solid fa-cloud cloud c1"></i>
                    <i class="fa-solid fa-cloud cloud c2"></i>
                    <div class="fence">🚧</div>
                    <div class="robot" id="j_robot">🤖</div>
                    <div class="ground" id="j_ground"></div>
                </div>
                <div class="code-editor">
                    <div style="background:rgba(30,41,59,0.8);padding:15px;border-radius:10px;margin-bottom:10px;border:1px solid #34D399;">
                        <h4 style="color:#34D399;margin-bottom:5px;">🧩 Função: rotina()</h4>
                        <p style="font-size:0.8rem;color:#94A3B8;margin-bottom:8px;">Agrupe comandos num bloco para usar no loop! Use o <b>If</b> (Se) para tomar decisões.</p>
                        <div class="code-line" id="j_line-if"><span class="kw">if</span> <span class="br">(</span><select id="j_sel-cond" onchange="j_updateArduinoCode()"><option value="true">Sempre</option><option value="vazio">Buraco Vazio</option><option value="semente">Tem Semente</option></select><span class="br">) {</span></div>
                        <div class="code-line" id="j_line-act1" style="padding-left:20px;"><span class="fn">executar</span><span class="br">(</span><select id="j_sel-act1" onchange="j_updateArduinoCode()"><option value="none">--Ação--</option><option value="plantar">Plantar</option><option value="regar">Regar</option></select><span class="br">);</span></div>
                        <div class="code-line" id="j_line-else"><span class="br">}</span> <span class="kw">else</span> <span class="br">{</span></div>
                        <div class="code-line" id="j_line-act2" style="padding-left:20px;"><span class="fn">executar</span><span class="br">(</span><select id="j_sel-act2" onchange="j_updateArduinoCode()"><option value="none">--Ação--</option><option value="plantar">Plantar</option><option value="regar">Regar</option></select><span class="br">);</span></div>
                        <div class="code-line" id="j_line-endif"><span class="br">}</span></div>
                    </div>
                    <div class="cm">// Loop FOR principal</div>
                    <div class="code-line" id="j_line-loop"><span class="kw">for</span> <span class="br">(</span> i = 1; i &lt;= <select id="j_sel-loop" onchange="j_updateArduinoCode()"><option value="3">3</option><option value="5" selected>5</option><option value="8">8</option><option value="10">10</option></select>; i++ <span class="br">) {</span></div>
                    <div class="code-line" id="j_line-move" style="padding-left:30px;"><span class="fn">andar</span><span class="br">();</span></div>
                    <div class="code-line" id="j_line-call" style="padding-left:30px;"><span class="fn">rotina</span><span class="br">();</span></div>
                    <div class="code-line" id="j_line-end"><span class="br">}</span></div>
                </div>
                <div class="actions">
                    <button class="btn-run" id="j_btn-run" onclick="j_startGarden()"><i class="fa-solid fa-play"></i> EXECUTAR</button>
                </div>
                <div class="arduino-code-panel" style="background:#0F172A;border:2px solid #34D399;border-radius:16px;padding:15px;margin-top:15px;">
                    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
                        <span style="font-weight:900;color:#34D399;font-size:0.95rem;"><i class="fa-solid fa-code"></i> Código Arduino C++ (Tempo Real)</span>
                        <button onclick="j_copyCode()" style="background:#334155;color:#34D399;border:1px solid #34D399;padding:4px 12px;border-radius:8px;font-size:0.8rem;font-weight:800;cursor:pointer;"><i class="fa-regular fa-copy"></i> Copiar C++</button>
                    </div>
                    <pre id="j_arduinoCode" style="margin:0;color:#E2E8F0;font-family:'Courier New', monospace;font-size:0.88rem;line-height:1.4;white-space:pre-wrap;overflow-x:auto;"></pre>
                </div>
            </div>
            <div class="modal" id="j_modal"><div class="modal-box"><div class="modal-icon" id="j_mIcon">🎉</div><h2 class="modal-title" id="j_mTitle">Parabéns!</h2><p class="modal-text" id="j_mText">Mensagem</p><button class="btn-modal" onclick="j_closeModal()">Continuar</button></div></div>
        `;
        j_init();
        document.getElementById('jardim-loaded')?.remove();
        const flag = document.createElement('div'); flag.id = 'jardim-loaded'; flag.style.display='none'; container.appendChild(flag);
    }

    let j_level = 1, j_running = false, j_pos=0;
    const j_config = { 1:{total:5,defects:[]}, 2:{total:8,defects:[3,6]}, 3:{total:10,defects:[2,5,8]} };
    function j_init() {
        document.querySelectorAll('.jardim-wrapper .level-btn').forEach(btn => {
            btn.onclick = () => {
                document.querySelectorAll('.jardim-wrapper .level-btn').forEach(b=>b.classList.remove('active'));
                btn.classList.add('active');
                j_level = parseInt(btn.dataset.level);
                const cfg = j_config[j_level];
                const sel = document.getElementById('j_sel-loop');
                sel.innerHTML = '';
                const opts = cfg.total <=5 ? [3,5,7] : (cfg.total<=8 ? [5,8,10] : [8,10,12]);
                opts.forEach(v => { const o=document.createElement('option'); o.value=v; o.text=v; if(v===cfg.total) o.selected=true; sel.appendChild(o); });
                
                if(j_level === 1) {
                    document.getElementById('j_sel-cond').value = 'true';
                    document.getElementById('j_sel-act1').value = 'plantar';
                    document.getElementById('j_sel-act2').value = 'none';
                } else {
                    document.getElementById('j_sel-cond').value = 'vazio';
                    document.getElementById('j_sel-act1').value = 'plantar';
                    document.getElementById('j_sel-act2').value = 'regar';
                }
                j_updateMissionInfo();
                j_resetGarden();
                j_updateArduinoCode();
            };
        });
        j_updateMissionInfo();
        j_resetGarden();
        j_updateArduinoCode();
    }
    function j_updateArduinoCode() {
        const el = document.getElementById('j_arduinoCode');
        if(!el) return;
        const loopCount = document.getElementById('j_sel-loop')?.value || 5;
        const cond = document.getElementById('j_sel-cond')?.value || 'true';
        const act1 = document.getElementById('j_sel-act1')?.value || 'none';
        const act2 = document.getElementById('j_sel-act2')?.value || 'none';

        let condStr = 'true';
        if(cond === 'vazio') condStr = 'sensorSolo() == BURACAO_VAZIO';
        else if(cond === 'semente') condStr = 'sensorSolo() == TEM_SEMENTE';

        let act1Str = act1 === 'plantar' ? 'plantarSemente();' : (act1 === 'regar' ? 'ativarBombaAgua();' : '// nenhuma acao');
        let act2Str = act2 === 'plantar' ? 'plantarSemente();' : (act2 === 'regar' ? 'ativarBombaAgua();' : '// nenhuma acao');

        let code = `// --- Jardim dos Loops Maker (Arduino C++) ---\n` +
                   `// Função rotina() criada em bloco modular\n` +
                   `void rotina() {\n` +
                   `  if (${condStr}) {\n` +
                   `    ${act1Str}\n` +
                   `  } else {\n` +
                   `    ${act2Str}\n` +
                   `  }\n` +
                   `}\n\n` +
                   `void setup() {\n` +
                   `  iniciarSensoresEJardim();\n` +
                   `}\n\n` +
                   `void loop() {\n` +
                   `  for (int i = 1; i <= ${loopCount}; i++) {\n` +
                   `    avancarProximoCanteiro();\n` +
                   `    rotina();\n` +
                   `    delay(300);\n` +
                   `  }\n` +
                   `}`;
        el.innerText = code;
    }
    function j_copyCode() {
        const code = document.getElementById('j_arduinoCode')?.innerText;
        if(code) {
            navigator.clipboard.writeText(code);
            alert('Código Arduino C++ copiado com sucesso! 📋');
        }
    }
    function j_updateMissionInfo() {
        const info = document.getElementById('j_mission-info');
        if(!info) return;
        if(j_level === 1) {
            info.innerHTML = '🌱 <b>Missão Nível 1:</b> 5 canteiros com sementes (🌱). Configure o loop para <b>5</b> e escolha a ação <b>Plantar</b> ou <b>Regar</b> para fazer todos florescerem girassóis (🌻)!';
        } else if(j_level === 2) {
            info.innerHTML = '🥀 <b>Missão Nível 2:</b> 8 canteiros com falhas secas (🥀). Use a lógica condicional: <code>if (Buraco Vazio) -> Plantar; else -> Regar;</code> para recuperar todo o jardim!';
        } else {
            info.innerHTML = '🌻 <b>Missão Nível 3:</b> Desafio com 10 canteiros e várias falhas! Ajuste o loop para <b>10</b> e programe o IF/ELSE para obter 100% de girassóis!';
        }
    }
    function j_resetGarden() {
        const cfg = j_config[j_level];
        const ground = document.getElementById('j_ground');
        ground.innerHTML = '';
        document.getElementById('j_robot').style.left = '10px';
        document.getElementById('j_robot').classList.remove('crash');
        j_pos = 0;
        document.querySelectorAll('.jardim-wrapper .code-line').forEach(el=>el.classList.remove('active','executing'));
        for(let i=1; i<=cfg.total; i++) {
            const patch = document.createElement('div');
            patch.className = 'dirt-patch';
            const sprout = document.createElement('div');
            sprout.className = 'sprout' + (cfg.defects.includes(i) ? ' defect' : '');
            sprout.innerHTML = cfg.defects.includes(i) ? '🥀' : '🌱';
            sprout.id = 'jplant-'+i;
            patch.appendChild(sprout);
            ground.appendChild(patch);
        }
    }
    function j_sleep(ms){ return new Promise(r=>setTimeout(r,ms)); }
    async function j_startGarden() {
        if(j_running) return;
        playSound('click');
        j_running = true;
        document.getElementById('j_btn-run').disabled = true;
        document.getElementById('j_btn-run').innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> A EXECUTAR...';
        j_resetGarden();
        const loopCount = parseInt(document.getElementById('j_sel-loop').value);
        const cond = document.getElementById('j_sel-cond').value;
        const act1 = document.getElementById('j_sel-act1').value;
        const act2 = document.getElementById('j_sel-act2').value;
        const cfg = j_config[j_level];
        const total = cfg.total;
        const defects = cfg.defects;
        let crashed = false;
        let currentPos = 0;
        const jump = 70;

        for(let i=1; i<=loopCount; i++) {
            document.getElementById('j_line-loop').classList.add('active');
            await j_sleep(300);
            document.getElementById('j_line-loop').classList.remove('active');

            document.getElementById('j_line-move').classList.add('executing');
            currentPos += jump;
            document.getElementById('j_robot').style.left = (10 + currentPos) + 'px';
            playSound('step');
            await j_sleep(300);
            document.getElementById('j_line-move').classList.remove('executing');

            if(i > total) {
                document.getElementById('j_robot').classList.add('crash');
                crashed = true;
                playSound('error');
                await j_sleep(500);
                j_showModal('💥','Bateu na cerca!','Loop muito grande!');
                break;
            }

            document.getElementById('j_line-call').classList.add('executing');
            await j_sleep(200);
            
            const plant = document.getElementById('jplant-'+i);
            const isDefect = defects.includes(i); // Vazio/Buraco
            let conditionMet = false;
            
            document.getElementById('j_line-if').classList.add('active');
            await j_sleep(300);
            if(cond === 'true') conditionMet = true;
            else if(cond === 'vazio' && isDefect) conditionMet = true;
            else if(cond === 'semente' && !isDefect) conditionMet = true;
            document.getElementById('j_line-if').classList.remove('active');

            let actionToRun = 'none';
            if(conditionMet) {
                document.getElementById('j_line-act1').classList.add('executing');
                actionToRun = act1;
                await j_sleep(400);
                document.getElementById('j_line-act1').classList.remove('executing');
            } else {
                document.getElementById('j_line-else').classList.add('active');
                await j_sleep(200);
                document.getElementById('j_line-else').classList.remove('active');
                document.getElementById('j_line-act2').classList.add('executing');
                actionToRun = act2;
                await j_sleep(400);
                document.getElementById('j_line-act2').classList.remove('executing');
            }

            if(actionToRun === 'plantar') { 
                plant.classList.remove('defect');
                plant.classList.add('grown');
                plant.innerHTML = '🌻';
                playSound('step');
            }
            else if(actionToRun === 'regar') { 
                if(!isDefect || plant.classList.contains('grown')) { 
                    plant.classList.add('grown'); 
                    plant.innerHTML = '🌻'; 
                    playSound('success'); 
                } else {
                    plant.innerHTML = '🥀';
                    playSound('error');
                }
            }
            document.getElementById('j_line-call').classList.remove('executing');
            await j_sleep(200);
        }

        if(!crashed) {
            let allGrown = true;
            for(let i=1; i<=total; i++) {
                const plant = document.getElementById('jplant-'+i);
                if(plant.innerHTML !== '🌻') { allGrown = false; break; }
            }
            if(allGrown) {
                j_showModal('🏆','Mestre Jardineiro!','Todas as flores cresceram usando Funções e IFs!');
                playSound('success');
                let saved = JSON.parse(localStorage.getItem('jardim_levels')||'[]');
                if(!saved.includes(j_level)) saved.push(j_level);
                localStorage.setItem('jardim_levels', JSON.stringify(saved));
            } else {
                j_showModal('❌','Faltam flores!','Revise sua lógica do IF e as ações.');
                playSound('error');
            }
        }

        j_running = false;
        document.getElementById('j_btn-run').disabled = false;
        document.getElementById('j_btn-run').innerHTML = '<i class="fa-solid fa-play"></i> EXECUTAR';
    }
    function j_showModal(icon,title,text) {
        document.getElementById('j_mIcon').innerText = icon;
        document.getElementById('j_mTitle').innerText = title;
        document.getElementById('j_mText').innerText = text;
        document.getElementById('j_modal').classList.add('active');
    }
    function j_closeModal() { document.getElementById('j_modal').classList.remove('active'); j_resetGarden(); }

    // ================= OFICINA ARDUINO =================
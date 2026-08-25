/* ==========================================================================
   AULA 4 — SEMÁFORO DIGITAL (TEMPORIZAÇÃO & DELAY)
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
    document.getElementById('slred')?.classList.remove('active');
    document.getElementById('slyellow')?.classList.remove('active');
    document.getElementById('slgreen')?.classList.remove('active');
    document.getElementById('slgreen')?.classList.add('active');
    const car = document.getElementById('scar');
    const ped = document.getElementById('sped');
    if(car) {
        car.style.transition = 'none';
        car.style.left = '20px';
        setTimeout(() => { car.style.transition = 'left 2s ease-in-out'; }, 50);
    }
    if(ped) {
        ped.style.transition = 'none';
        ped.style.bottom = '10px';
        setTimeout(() => { ped.style.transition = 'bottom 1.5s ease-in-out'; }, 50);
    }
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
            document.getElementById('slred')?.classList.remove('active');
            document.getElementById('slgreen')?.classList.remove('active');
            document.getElementById('slyellow')?.classList.add('active');
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
            document.getElementById('slyellow')?.classList.remove('active');
            document.getElementById('slgreen')?.classList.remove('active');
            document.getElementById('slred')?.classList.add('active');
            currentLight = 'RED';
            if(car) car.style.left = '450px';
            playSound('step');
        } else if(cmd === 'WALK') {
            if(currentLight !== 'RED') {
                s_showModal('🚨','Perigo!','Só pode andar com o sinal VERMELHO!');
                playSound('error');
                crashed=true; break;
            }
            if(ped) ped.style.bottom = '220px';
            playSound('step');
            await s_sleep(1500);
        } else if(cmd === 'GREEN') {
            document.getElementById('slred')?.classList.remove('active');
            document.getElementById('slyellow')?.classList.remove('active');
            document.getElementById('slgreen')?.classList.add('active');
            currentLight = 'GREEN';
            if(car) car.style.left = '600px';
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

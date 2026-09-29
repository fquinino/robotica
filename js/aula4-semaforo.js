/* ==========================================================================
   AULA 4 — SEMÁFORO DIGITAL (TEMPORIZAÇÃO & DELAY)
   ========================================================================== */

function loadSemaforo() {
    const container = document.getElementById('semaforo-container');
    container.innerHTML = `
        <style>
            /* Estilos do Semáforo */
            .semaforo-wrapper { max-width:760px; margin:0 auto; color:#E2E8F0; }
            .semaforo-wrapper .scene { background:url('bg_semaforo.png') center/cover; border-radius:22px; padding:20px; display:flex; flex-direction:column; align-items:center; border:2px solid #334155; margin-bottom:15px; position:relative; height:350px; overflow:hidden; box-shadow:0 10px 30px rgba(0,0,0,0.5); }
            .semaforo-wrapper .traffic { position:absolute; top:12px; right:15px; display:flex; flex-direction:column; gap:10px; background:rgba(15,23,42,0.92); padding:14px; border-radius:20px; border:3px solid #475569; z-index:20; box-shadow:0 8px 25px rgba(0,0,0,0.6); }
            .semaforo-wrapper .light { width:36px; height:36px; border-radius:50%; background:#1E293B; border:3px solid #0B0F19; transition:0.3s; }
            .semaforo-wrapper .light.red.active { background:#EF4444; box-shadow:0 0 32px #EF4444; }
            .semaforo-wrapper .light.yellow.active { background:#F59E0B; box-shadow:0 0 32px #F59E0B; }
            .semaforo-wrapper .light.green.active { background:#10B981; box-shadow:0 0 32px #10B981; }
            .semaforo-wrapper .car { position:absolute; bottom:110px; left:20px; font-size:4rem; transition:left 2s ease-in-out; z-index:10; filter:drop-shadow(0 6px 12px rgba(0,0,0,0.6)); }
            .semaforo-wrapper .pedestrian { position:absolute; bottom:10px; left:250px; font-size:3rem; transition:bottom 1.5s ease-in-out; z-index:15; filter:drop-shadow(0 4px 8px rgba(0,0,0,0.6)); }
            .semaforo-wrapper .controls { display:flex; gap:10px; flex-wrap:wrap; justify-content:center; margin:12px 0; }
            .semaforo-wrapper .cmd-btn { background:#334155; color:white; border:none; padding:10px 18px; border-radius:14px; font-weight:900; cursor:pointer; border-bottom:4px solid #0F172A; flex:1; min-width:85px; font-size:0.95rem; display:flex; align-items:center; justify-content:center; gap:6px; transition:transform 0.1s; }
            .semaforo-wrapper .cmd-btn:hover { transform:translateY(-2px); }
            .semaforo-wrapper .cmd-btn:active { transform:translateY(3px); border-bottom-width:1px; }
            .semaforo-wrapper .code-area { background:#0F172A; border-radius:18px; min-height:55px; padding:12px 14px; border:2px dashed #334155; display:flex; flex-wrap:wrap; gap:8px; align-items:center; }
            .semaforo-wrapper .code-line { background:#1E293B; padding:6px 14px; border-radius:10px; border-left:4px solid #F59E0B; color:#CBD5E1; font-weight:800; font-family:'Fira Code', monospace; font-size:0.9rem; box-shadow:0 2px 6px rgba(0,0,0,0.3); }
            .semaforo-wrapper .actions { display:flex; gap:12px; margin-top:12px; }
            .semaforo-wrapper .btn-run { background:#10B981; border:none; padding:14px; border-radius:16px; font-weight:900; font-size:1.05rem; color:#0F172A; flex:2; border-bottom:5px solid #047857; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:8px; transition:all 0.15s; }
            .semaforo-wrapper .btn-run:hover { filter:brightness(1.1); transform:translateY(-2px); }
            .semaforo-wrapper .btn-undo { background:#F59E0B; border:none; padding:14px; border-radius:16px; font-weight:900; color:#0F172A; flex:1; border-bottom:5px solid #B45309; cursor:pointer; font-size:1rem; }
            .semaforo-wrapper .btn-clear { background:#EF4444; border:none; padding:14px; border-radius:16px; font-weight:900; color:white; flex:1; border-bottom:5px solid #991B1B; cursor:pointer; font-size:1rem; }
            .semaforo-wrapper .level-bar { display:flex; gap:10px; justify-content:center; margin-bottom:14px; flex-wrap:wrap; }
            .semaforo-wrapper .level-btn { background:#1E293B; border:2px solid #334155; color:#94A3B8; padding:9px 20px; border-radius:30px; font-weight:900; cursor:pointer; font-size:0.92rem; transition:0.2s all; display:flex; align-items:center; gap:6px; }
            .semaforo-wrapper .level-btn:hover { border-color:#F59E0B; color:white; transform:translateY(-2px); }
            .semaforo-wrapper .level-btn.active { background:linear-gradient(135deg,#F59E0B,#D97706); color:#0F172A; border-color:#FBBF24; box-shadow:0 0 20px rgba(245,158,11,0.45); }
            .semaforo-wrapper .level-btn.done { border-color:#10B981; color:#34D399; }
            .semaforo-wrapper .modal { position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.85); backdrop-filter:blur(6px); display:flex; justify-content:center; align-items:center; z-index:999; opacity:0; pointer-events:none; transition:0.3s; }
            .semaforo-wrapper .modal.active { opacity:1; pointer-events:all; }
            .semaforo-wrapper .modal-box { background:#1E293B; padding:32px 28px; border-radius:28px; max-width:440px; text-align:center; border:3px solid #F59E0B; box-shadow:0 0 45px rgba(245,158,11,0.35); }
            .semaforo-wrapper .modal-icon { font-size:4rem; margin-bottom:8px; }
            .semaforo-wrapper .modal-title { font-family:'Fredoka One', cursive; color:white; font-size:1.8rem; margin:0 0 8px; }
            .semaforo-wrapper .modal-text { color:#CBD5E1; margin:14px 0 22px; font-size:0.98rem; line-height:1.5; }
            .semaforo-wrapper .btn-modal { background:#38BDF8; color:#0F172A; border:none; padding:12px 32px; border-radius:50px; font-weight:900; font-size:1rem; cursor:pointer; border-bottom:4px solid #0284C7; }
        </style>
        <div class="semaforo-wrapper">
            <!-- Header Card da Aula -->
            <div style="background:linear-gradient(135deg, rgba(245,158,11,0.18), rgba(30,41,59,0.9)); border:2px solid #F59E0B; border-radius:24px; padding:18px 22px; margin-bottom:18px; box-shadow:0 10px 30px rgba(0,0,0,0.4);">
                <h2 style="font-family:'Fredoka One', cursive; color:#FBBF24; font-size:clamp(1.2rem, 3vw, 1.6rem); margin:0 0 6px; display:flex; align-items:center; gap:10px;">
                    <span>🚦</span> Aula 4 — Semáforo Digital & Temporização
                </h2>
                <p style="color:#CBD5E1; margin:0; font-size:0.92rem; line-height:1.5;">
                    Aprenda a controlar o tempo no Arduino usando a função <code style="color:#FBBF24;background:#0F172A;padding:2px 6px;border-radius:6px;font-family:'Fira Code',monospace;">delay()</code> em milissegundos para organizar o trânsito com segurança!
                </p>
            </div>

            <!-- Barra de Seleção de Níveis -->
            <div class="level-bar">
                <button class="level-btn active" data-level="1" onclick="s_selectLevel(1)">⭐ Nível 1</button>
                <button class="level-btn" data-level="2" onclick="s_selectLevel(2)">⭐⭐ Nível 2</button>
                <button class="level-btn" data-level="3" onclick="s_selectLevel(3)">⭐⭐⭐ Nível 3</button>
            </div>

            <!-- Card de Missão Dinâmico -->
            <div id="s_missionCard" style="background:#0F172A;border:2px solid #F59E0B;border-radius:18px;padding:14px 18px;margin-bottom:14px;box-shadow:0 6px 20px rgba(0,0,0,0.3);">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;flex-wrap:wrap;gap:8px;">
                    <span id="s_missionTitle" style="font-family:'Fredoka One';color:#F59E0B;font-size:1.05rem;">🎯 Missão 1: Parada Segura</span>
                    <span id="s_missionTarget" style="font-family:'Fira Code',monospace;font-size:0.8rem;background:rgba(245,158,11,0.15);color:#FBBF24;padding:4px 10px;border-radius:8px;border:1px dashed #F59E0B;">Amarelo ➔ Delay ➔ Vermelho</span>
                </div>
                <div id="s_missionDesc" style="color:#CBD5E1;font-size:0.88rem;line-height:1.45;">
                    O semáforo começa no Verde! Avise o motorista com o sinal <b>Amarelo</b>, aguarde o tempo com o <b>Delay</b> e feche no sinal <b>Vermelho</b> para parar o carro na faixa com segurança!
                </div>
            </div>

            <!-- Cenário de Simulação -->
            <div class="scene">
                <div class="traffic">
                    <div class="light red" id="slred"></div>
                    <div class="light yellow" id="slyellow"></div>
                    <div class="light green active" id="slgreen"></div>
                </div>
                <div class="car" id="scar">🚗</div>
                <div class="pedestrian" id="sped">🚶</div>
            </div>

            <!-- Teclado de Ações / Blocos de Comando -->
            <div class="controls">
                <button class="cmd-btn" style="background:#10B981;color:#0F172A;" onclick="s_addCmd('GREEN')">🟢 Verde</button>
                <button class="cmd-btn" style="background:#F59E0B;color:#0F172A;" onclick="s_addCmd('YELLOW')">🟡 Amarelo</button>
                <button class="cmd-btn" style="background:#38BDF8;color:#0F172A;" onclick="s_addCmd('DELAY')">⏱️ Delay</button>
                <button class="cmd-btn" style="background:#EF4444;color:white;" onclick="s_addCmd('RED')">🔴 Vermelho</button>
                <button class="cmd-btn" style="background:#8B5CF6;color:white;" onclick="s_addCmd('WALK')">🚶 Pedestre</button>
            </div>

            <!-- Área de Montagem do Código -->
            <div class="code-area" id="s_codeArea"><span style="color:#64748B;">Seu código...</span></div>

            <!-- Botões de Ação -->
            <div class="actions">
                <button class="btn-undo" onclick="s_undoCmd()"><i class="fas fa-undo"></i> Desfazer</button>
                <button class="btn-clear" onclick="s_clearCode()"><i class="fas fa-trash"></i> Limpar</button>
                <button class="btn-run" onclick="s_runCode()"><i class="fas fa-play"></i> Executar no Cruzamento</button>
            </div>

            <!-- Painel de Código Arduino C++ em Tempo Real -->
            <div class="arduino-code-panel" style="background:#0F172A;border:2px solid #38BDF8;border-radius:18px;padding:16px;margin-top:16px;box-shadow:0 8px 25px rgba(0,0,0,0.4);">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
                    <span style="font-weight:900;color:#38BDF8;font-size:0.95rem;"><i class="fa-solid fa-code"></i> Código Arduino C++ Gerado (Tempo Real)</span>
                    <button onclick="s_copyCode()" style="background:#334155;color:#38BDF8;border:1px solid #38BDF8;padding:6px 14px;border-radius:10px;font-size:0.82rem;font-weight:800;cursor:pointer;display:flex;align-items:center;gap:6px;"><i class="fa-regular fa-copy"></i> Copiar C++</button>
                </div>
                <pre id="s_arduinoCode" style="margin:0;color:#E2E8F0;font-family:'Fira Code', monospace;font-size:0.86rem;line-height:1.45;white-space:pre-wrap;overflow-x:auto;"></pre>
            </div>
        </div>

        <!-- Modal de Vitória / Feedback -->
        <div class="modal" id="s_modal">
            <div class="modal-box">
                <div class="modal-icon" id="s_mIcon">🎉</div>
                <h2 class="modal-title" id="s_mTitle">Parabéns!</h2>
                <p class="modal-text" id="s_mText">Mensagem</p>
                <button class="btn-modal" onclick="s_closeModal()">Continuar</button>
            </div>
        </div>
    `;

    // Inicializa o jogo e listeners
    s_init();
    document.getElementById('semaforo-loaded')?.remove();
    const flag = document.createElement('div'); flag.id = 'semaforo-loaded'; flag.style.display='none'; container.appendChild(flag);
}

// Funções do Semáforo (escopo global)
let s_seq = [], s_running = false, s_level = 1;
const s_levels = {
    1: { 
        title: 'Missão 1: Parada Segura',
        desc: 'O semáforo começa no Verde! Avise o motorista com o sinal <b>Amarelo</b>, aguarde com o <b>Delay</b> e feche no sinal <b>Vermelho</b> para parar o carro na faixa com segurança!',
        required: ['YELLOW','DELAY','RED'],
        targetSeq: 'Amarelo ➔ Delay ➔ Vermelho'
    },
    2: { 
        title: 'Missão 2: Travessia do Pedestre',
        desc: 'Após parar o carro no Vermelho com o tempo correto, espere com outro <b>Delay</b> e dê sinal para o <b>Pedestre</b> 🚶 atravessar a faixa!',
        required: ['YELLOW','DELAY','RED','DELAY','WALK'],
        targetSeq: 'Amarelo ➔ Delay ➔ Vermelho ➔ Delay ➔ Pedestre'
    },
    3: { 
        title: 'Missão 3: Ciclo Completo de Trânsito',
        desc: 'Faça a rotina completa de um cruzamento real: pare o carro, libere o pedestre para atravessar, espere com Delay, avise no Amarelo e reabra a via no Verde!',
        required: ['YELLOW','DELAY','RED','DELAY','WALK','DELAY','YELLOW','DELAY','GREEN'],
        targetSeq: 'Amarelo ➔ Delay ➔ Vermelho ➔ Delay ➔ Pedestre ➔ Delay ➔ Amarelo ➔ Delay ➔ Verde'
    }
};

function s_init() {
    s_updateLevelButtons();
    s_selectLevel(1);
    s_resetScene();
    s_updateArduinoCode();
}

function s_selectLevel(lvl) {
    if(s_running) return;
    s_level = lvl;
    document.querySelectorAll('.semaforo-wrapper .level-btn').forEach(b => {
        b.classList.toggle('active', parseInt(b.dataset.level) === s_level);
    });
    s_clearCode();
    s_resetScene();
    s_updateMissionInfo();
}

function s_updateMissionInfo() {
    const info = s_levels[s_level];
    if(!info) return;
    const t = document.getElementById('s_missionTitle');
    const d = document.getElementById('s_missionDesc');
    const tg = document.getElementById('s_missionTarget');
    if(t) t.innerText = `🎯 ${info.title}`;
    if(d) d.innerHTML = info.desc;
    if(tg) tg.innerText = info.targetSeq;
}

function s_updateLevelButtons() {
    const saved = JSON.parse(localStorage.getItem('semaforo_levels') || '[]');
    document.querySelectorAll('.semaforo-wrapper .level-btn').forEach(btn => {
        const lvl = parseInt(btn.dataset.level);
        const isDone = saved.includes(lvl);
        btn.classList.toggle('done', isDone);
        const starEmoji = lvl === 1 ? '⭐' : lvl === 2 ? '⭐⭐' : '⭐⭐⭐';
        btn.innerHTML = `${starEmoji} Nível ${lvl} ${isDone ? '✅' : ''}`;
    });
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
    const labels = {
        'GREEN': '🟢 Verde',
        'YELLOW': '🟡 Amarelo',
        'DELAY': '⏱️ Delay',
        'RED': '🔴 Vermelho',
        'WALK': '🚶 Pedestre'
    };
    el.innerText = labels[c] || c;
    area.appendChild(el);
    s_updateArduinoCode();
}

function s_undoCmd() {
    if(s_running || s_seq.length===0) return;
    playSound('click');
    s_seq.pop();
    const area = document.getElementById('s_codeArea');
    const labels = {
        'GREEN': '🟢 Verde',
        'YELLOW': '🟡 Amarelo',
        'DELAY': '⏱️ Delay',
        'RED': '🔴 Vermelho',
        'WALK': '🚶 Pedestre'
    };
    if(s_seq.length===0) {
        area.innerHTML = '<span style="color:#64748B;">Seu código...</span>';
    } else {
        area.innerHTML = s_seq.map(c => `<span class="code-line">${labels[c] || c}</span>`).join('');
    }
    s_updateArduinoCode();
}

function s_clearCode() {
    s_seq = [];
    const area = document.getElementById('s_codeArea');
    if(area) area.innerHTML = '<span style="color:#64748B;">Seu código...</span>';
    s_resetScene();
    s_updateArduinoCode();
}

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
            else if(cmd === 'DELAY') code += `  delay(1200); // Temporizador (espera)\n`;
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
                s_showModal('💥','Bug no Trânsito!','Você precisa avisar os motoristas com a luz Amarela e esperar (Delay) antes de acender o Vermelho!');
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
                s_showModal('🚨','Perigo na Faixa!','O pedestre só pode atravessar com o sinal dos carros no VERMELHO!');
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
            s_showModal('🏆', `Nível ${s_level} Concluído!`, 'Sensacional! Você programou os tempos e o semáforo perfeitamente!');
            playSound('success');
            if(typeof triggerConfetti === 'function') triggerConfetti(3500);
            let saved = JSON.parse(localStorage.getItem('semaforo_levels')||'[]');
            if(!saved.includes(s_level)) saved.push(s_level);
            localStorage.setItem('semaforo_levels', JSON.stringify(saved));
            if(typeof updateHubProgress === 'function') updateHubProgress();
            if(typeof updateTrail === 'function') updateTrail();
            s_updateLevelButtons();
        } else {
            s_showModal('❌', 'Quase lá!', `A sequência não está completa para o Nível ${s_level}. Siga a ordem recomendada na dica da missão!`);
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
    // Se completou e há próximo nível, avança
    const saved = JSON.parse(localStorage.getItem('semaforo_levels') || '[]');
    if(saved.includes(s_level) && s_level < 3) {
        s_selectLevel(s_level + 1);
    }
}

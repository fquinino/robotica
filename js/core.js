/* ==========================================================================
   CRIADORES DE CÓDIGO — CORE SYSTEM (ÁUDIO, STORAGE, MODAIS & ROUTER)
   ========================================================================== */

// ================= SAFE STORAGE FALLBACK =================
const safeStorage = {
    getItem(key) {
        try {
            return window.localStorage.getItem(key);
        } catch(e) {
            return this.fallback[key] || null;
        }
    },
    setItem(key, value) {
        try {
            window.localStorage.setItem(key, value);
        } catch(e) {
            this.fallback[key] = String(value);
        }
    },
    removeItem(key) {
        try {
            window.localStorage.removeItem(key);
        } catch(e) {
            delete this.fallback[key];
        }
    },
    fallback: {}
};
const localStorage = safeStorage;

// ================= AUDIO SYSTEM =================
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
function playSound(type) {
    if(audioCtx.state === 'suspended') audioCtx.resume();
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    if(type === 'success') {
        osc.type = 'sine'; osc.frequency.setValueAtTime(400, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(800, audioCtx.currentTime + 0.1);
        gainNode.gain.setValueAtTime(0.2, audioCtx.currentTime); gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
        osc.start(); osc.stop(audioCtx.currentTime + 0.3);
    } else if(type === 'error') {
        osc.type = 'sawtooth'; osc.frequency.setValueAtTime(150, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.2);
        gainNode.gain.setValueAtTime(0.2, audioCtx.currentTime); gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.2);
        osc.start(); osc.stop(audioCtx.currentTime + 0.2);
    } else if(type === 'click') {
        osc.type = 'sine'; osc.frequency.setValueAtTime(600, audioCtx.currentTime);
        gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime); gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
        osc.start(); osc.stop(audioCtx.currentTime + 0.1);
    } else if(type === 'step') {
        osc.type = 'triangle'; osc.frequency.setValueAtTime(300, audioCtx.currentTime);
        gainNode.gain.setValueAtTime(0.05, audioCtx.currentTime); gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.05);
        osc.start(); osc.stop(audioCtx.currentTime + 0.05);
    }
}

// ================= FOGOS & CONFETES ENGINE =================
function triggerConfetti(durationMs = 3000) {
    const canvas = document.getElementById('fx-canvas');
    if(!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.display = 'block';

    const colors = ['#38BDF8', '#F59E0B', '#10B981', '#EC4899', '#A78BFA', '#FBBF24', '#F43F5E', '#FFFFFF'];
    const particles = [];
    const count = 130;

    for (let i = 0; i < count; i++) {
        particles.push({
            x: canvas.width / 2 + (Math.random() - 0.5) * 250,
            y: canvas.height / 2 + (Math.random() - 0.5) * 120,
            vx: (Math.random() - 0.5) * 22,
            vy: Math.random() * -18 - 5,
            size: Math.random() * 9 + 6,
            color: colors[Math.floor(Math.random() * colors.length)],
            rotation: Math.random() * 360,
            rSpeed: (Math.random() - 0.5) * 10,
            opacity: 1
        });
    }

    const start = Date.now();
    function animate() {
        const elapsed = Date.now() - start;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach((p) => {
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.45; // Gravidade
            p.vx *= 0.98;
            p.rotation += p.rSpeed;
            if(elapsed > durationMs - 800) p.opacity -= 0.02;

            ctx.save();
            ctx.globalAlpha = Math.max(0, p.opacity);
            ctx.translate(p.x, p.y);
            ctx.rotate((p.rotation * Math.PI) / 180);
            ctx.fillStyle = p.color;
            ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
            ctx.restore();
        });

        if (elapsed < durationMs) {
            requestAnimationFrame(animate);
        } else {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            canvas.style.display = 'none';
        }
    }
    requestAnimationFrame(animate);
}

// ================= SPLASH DE ERRO LÚDICO =================
const currentAttemptsMap = {};

function triggerErrorSplash(title, message, hint = '', icon = '💥', solutionCode = '', attemptKey = 'default', maxAttempts = 3) {
    playSound('error');
    const modal = document.getElementById('error-splash-modal');
    if (!modal) return;

    if (!currentAttemptsMap[attemptKey]) currentAttemptsMap[attemptKey] = 0;
    currentAttemptsMap[attemptKey]++;
    const attempts = currentAttemptsMap[attemptKey];

    document.getElementById('error-splash-icon').innerText = icon;
    document.getElementById('error-splash-title').innerText = title;
    document.getElementById('error-splash-msg').innerText = message;

    const attemptsEl = document.getElementById('error-splash-attempts');
    if (attemptsEl) {
        if (attempts >= maxAttempts) {
            attemptsEl.innerHTML = `⚠️ ${attempts}ª Tentativa — 💡 <b>Resolução C/C++ Liberada!</b>`;
            attemptsEl.style.borderColor = '#F59E0B';
            attemptsEl.style.color = '#FBBF24';
            attemptsEl.style.background = 'rgba(245,158,11,0.15)';
        } else {
            attemptsEl.innerHTML = `❤️ Tentativa ${attempts} de ${maxAttempts}`;
            attemptsEl.style.borderColor = '#EF4444';
            attemptsEl.style.color = '#FCA5A5';
            attemptsEl.style.background = 'rgba(239,68,68,0.15)';
        }
    }

    const hintEl = document.getElementById('error-splash-hint');
    if (hint) {
        hintEl.innerHTML = `💡 <b>Dica de Maker:</b> ${hint}`;
        hintEl.style.display = 'block';
    } else {
        hintEl.style.display = 'none';
    }

    const solWrapper = document.getElementById('error-splash-solution-wrapper');
    const solCodeEl = document.getElementById('error-splash-solution-code');
    const solBox = document.getElementById('error-splash-solution-box');
    const solArrow = document.getElementById('error-solution-arrow');

    if (solutionCode) {
        if (solCodeEl) solCodeEl.innerText = solutionCode;
        if (solWrapper) solWrapper.style.display = 'block';

        if (attempts >= maxAttempts) {
            if (solBox) solBox.style.display = 'block';
            if (solArrow) solArrow.textContent = '▲';
        } else {
            if (solBox) solBox.style.display = 'none';
            if (solArrow) solArrow.textContent = '▼';
        }
    } else {
        if (solWrapper) solWrapper.style.display = 'none';
    }

    modal.style.opacity = '1';
    modal.style.pointerEvents = 'all';
}

function toggleErrorSolution() {
    const box = document.getElementById('error-splash-solution-box');
    const arrow = document.getElementById('error-solution-arrow');
    if (!box) return;
    const isOpen = box.style.display === 'block';
    box.style.display = isOpen ? 'none' : 'block';
    if (arrow) arrow.textContent = isOpen ? '▼' : '▲';
}

function closeErrorSplash() {
    const modal = document.getElementById('error-splash-modal');
    if(modal) {
        modal.style.opacity = '0';
        modal.style.pointerEvents = 'none';
    }
}

// ================= CERTIFICADO MAKER =================
function showCertificateModal() {
    const modal = document.getElementById('cert_modal');
    if(!modal) return;
    const totalStars = getLevels('semaforo_levels').length + getLevels('tesouro_levels').length + 
                       getLevels('labmaker_levels').length + getLevels('loopmaker_levels').length + 
                       getLevels('jardim_levels').length + getLevels('arduino_levels').length;
    const detail = document.getElementById('cert_stars_detail');
    if(detail) detail.innerHTML = `⭐ Conquistou ${totalStars} de 18 Estrelas Maker!`;
    modal.style.display = 'flex';
}

function closeCertificateModal() {
    const modal = document.getElementById('cert_modal');
    if(modal) modal.style.display = 'none';
}

// ================= CONTROLE DE ABAS E ROUTER =================
function openTab(tabId) {
    document.querySelectorAll('.tab-btn').forEach(b=>b.classList.remove('active'));
    document.querySelectorAll('.game-panel').forEach(p=>p.classList.remove('active'));
    
    const panel = document.getElementById(tabId);
    if(panel) panel.classList.add('active');
    
    const btn = document.querySelector(`.tab-btn[data-tab=${tabId}]`);
    if(btn) btn.classList.add('active');

    if (tabId === 'tab-trail') { if(typeof updateTrail==='function') updateTrail(); return; }
    if (tabId === 'tab-hub') { if(typeof updateHubProgress==='function') updateHubProgress(); return; }
    if (tabId === 'tab-semaforo' && !document.getElementById('semaforo-loaded')) { if(typeof loadSemaforo==='function') loadSemaforo(); }
    if (tabId === 'tab-tesouro' && !document.getElementById('tesouro-loaded')) { if(typeof loadTesouro==='function') loadTesouro(); }
    if (tabId === 'tab-labmaker') {
        if(!document.getElementById('labmaker-loaded')) { if(typeof loadLabmaker==='function') loadLabmaker(); }
        else setTimeout(() => { if(typeof lab_renderComponents==='function') lab_renderComponents(); }, 60);
    }
    if (tabId === 'tab-loopmaker' && !document.getElementById('loopmaker-loaded')) { if(typeof loadLoopmaker==='function') loadLoopmaker(); }
    if (tabId === 'tab-jardim' && !document.getElementById('jardim-loaded')) { if(typeof loadJardim==='function') loadJardim(); }
    if (tabId === 'tab-arduino' && !document.getElementById('arduino-loaded')) { if(typeof loadArduino==='function') loadArduino(); }
    window.scrollTo({top:0,behavior:'smooth'});
}

function openTrail() {
    openTab('tab-trail');
}

function resetAllProgress() {
    if (confirm('Tem certeza que deseja zerar todo o seu progresso?')) {
        ['semaforo_levels','tesouro_levels','labmaker_levels','loopmaker_levels','jardim_levels','arduino_levels'].forEach(k => localStorage.removeItem(k));
        alert('Progresso zerado! Vamos começar de novo!');
        if(typeof updateTrail==='function') updateTrail();
        if(typeof updateHubProgress==='function') updateHubProgress();
    }
}

function toggleMainIdeConcept() {
    const box = document.getElementById('main_ide_concept_box');
    const arrow = document.getElementById('main_ide_arrow');
    if (!box || !arrow) return;
    if (box.style.display === 'none') {
        box.style.display = 'block';
        arrow.innerText = '▲';
        if (typeof playSound === 'function') playSound('click');
    } else {
        box.style.display = 'none';
        arrow.innerText = '▼';
    }
}

// Inicializador de eventos nos botões de aba principais
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.getAttribute('data-tab');
            if(tabId) openTab(tabId);
        });
    });
});

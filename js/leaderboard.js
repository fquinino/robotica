/* ==========================================================================
   CRIADORES DE CÓDIGO — PLACAR DE RECORDES & SPEEDRUN (LEADERBOARD)
   Persistência em localStorage para rastreamento de menor tempo por nível
   ========================================================================== */

(function(window) {
    'use strict';

    // Definição dos 30 Níveis da Plataforma Maker
    const ALL_LEVELS_METADATA = [
        // AULA 1: CAÇA AO TESOURO (3 Níveis)
        { id: 'tesouro_1', module: 'tesouro', moduleName: 'Aula 1: Caça ao Tesouro', num: 1, name: 'Primeiros Passos no Grid', icon: '🤖', benchmarkTime: 8.5, benchmarkPlayer: 'Robô Alfa' },
        { id: 'tesouro_2', module: 'tesouro', moduleName: 'Aula 1: Caça ao Tesouro', num: 2, name: 'Desvio de Rochas & Obstáculos', icon: '🪨', benchmarkTime: 12.0, benchmarkPlayer: 'CyberMaker' },
        { id: 'tesouro_3', module: 'tesouro', moduleName: 'Aula 1: Caça ao Tesouro', num: 3, name: 'Labirinto 3D com Escadas', icon: '🪜', benchmarkTime: 16.5, benchmarkPlayer: 'SpeedDev' },

        // AULA 2: MÁQUINA DE LOOPS (4 Níveis)
        { id: 'loopmaker_1', module: 'loopmaker', moduleName: 'Aula 2: Máquina de Loops', num: 1, name: 'Fábrica de Caixas (Laço FOR)', icon: '🏭', benchmarkTime: 7.0, benchmarkPlayer: 'Robô Alfa' },
        { id: 'loopmaker_2', module: 'loopmaker', moduleName: 'Aula 2: Máquina de Loops', num: 2, name: 'Caminho Duplo de Loops', icon: '🔄', benchmarkTime: 11.5, benchmarkPlayer: 'ByteMaster' },
        { id: 'loopmaker_3', module: 'loopmaker', moduleName: 'Aula 2: Máquina de Loops', num: 3, name: 'Laço com Múltiplos Comandos', icon: '📦', benchmarkTime: 14.0, benchmarkPlayer: 'DevKid' },
        { id: 'loopmaker_4', module: 'loopmaker', moduleName: 'Aula 2: Máquina de Loops', num: 4, name: 'Mini-IDE C++ com FOR Livre', icon: '💻', benchmarkTime: 22.0, benchmarkPlayer: 'SpeedDev' },

        // AULA 3: ROBÔ COM IF/ELSE (4 Níveis)
        { id: 'jardim_1', module: 'jardim', moduleName: 'Aula 3: Robô com IF/ELSE', num: 1, name: 'Decisão Básica com IF', icon: '🌱', benchmarkTime: 6.5, benchmarkPlayer: 'Robô Alfa' },
        { id: 'jardim_2', module: 'jardim', moduleName: 'Aula 3: Robô com IF/ELSE', num: 2, name: 'Desvio Inteligente com IF/ELSE', icon: '🚧', benchmarkTime: 10.0, benchmarkPlayer: 'Ana Dev' },
        { id: 'jardim_3', module: 'jardim', moduleName: 'Aula 3: Robô com IF/ELSE', num: 3, name: 'Laço FOR + Decisão Combinados', icon: '🧠', benchmarkTime: 15.0, benchmarkPlayer: 'CyberMaker' },
        { id: 'jardim_4', module: 'jardim', moduleName: 'Aula 3: Robô com IF/ELSE', num: 4, name: 'Mini-IDE Autônoma em C++', icon: '🎯', benchmarkTime: 20.0, benchmarkPlayer: 'SpeedDev' },

        // AULA 4: SEMÁFORO DIGITAL (5 Níveis)
        { id: 'semaforo_1', module: 'semaforo', moduleName: 'Aula 4: Semáforo Digital', num: 1, name: 'Parada na Linha Vermelha', icon: '🚗', benchmarkTime: 7.5, benchmarkPlayer: 'Robô Alfa' },
        { id: 'semaforo_2', module: 'semaforo', moduleName: 'Aula 4: Semáforo Digital', num: 2, name: 'Cruzamento em Dois Tempos', icon: '🚦', benchmarkTime: 13.0, benchmarkPlayer: 'SinalVerde' },
        { id: 'semaforo_3', module: 'semaforo', moduleName: 'Aula 4: Semáforo Digital', num: 3, name: 'Faixa de Pedestres Segura', icon: '🚶', benchmarkTime: 16.0, benchmarkPlayer: 'DevKid' },
        { id: 'semaforo_4', module: 'semaforo', moduleName: 'Aula 4: Semáforo Digital', num: 4, name: 'Mini-IDE Temporizada (delay)', icon: '⏱️', benchmarkTime: 24.0, benchmarkPlayer: 'CyberMaker' },
        { id: 'semaforo_5', module: 'semaforo', moduleName: 'Aula 4: Semáforo Digital', num: 5, name: 'Grande Metrópole 4 Vias', icon: '🏙️', benchmarkTime: 28.0, benchmarkPlayer: 'SpeedDev' },

        // AULA 5: VARIÁVEIS E TIPOS (8 Níveis)
        { id: 'variaveis_1', module: 'variaveis', moduleName: 'Aula 5: Variáveis & Tipos', num: 1, name: 'Vidas e Moedas da Caverna (int)', icon: '🪙', benchmarkTime: 9.0, benchmarkPlayer: 'Robô Alfa' },
        { id: 'variaveis_2', module: 'variaveis', moduleName: 'Aula 5: Variáveis & Tipos', num: 2, name: 'Estação Meteorológica (float)', icon: '🌡️', benchmarkTime: 10.5, benchmarkPlayer: 'Ana Dev' },
        { id: 'variaveis_3', module: 'variaveis', moduleName: 'Aula 5: Variáveis & Tipos', num: 3, name: 'Cofre Secreto Lógico (String/bool)', icon: '🔐', benchmarkTime: 12.0, benchmarkPlayer: 'ByteMaster' },
        { id: 'variaveis_4', module: 'variaveis', moduleName: 'Aula 5: Variáveis & Tipos', num: 4, name: 'Acumulador de Energia Solar (FOR)', icon: '🔋', benchmarkTime: 11.0, benchmarkPlayer: 'DevKid' },
        { id: 'variaveis_5', module: 'variaveis', moduleName: 'Aula 5: Variáveis & Tipos', num: 5, name: 'Mineração Marciana (FOR)', icon: '💎', benchmarkTime: 14.5, benchmarkPlayer: 'CyberMaker' },
        { id: 'variaveis_6', module: 'variaveis', moduleName: 'Aula 5: Variáveis & Tipos', num: 6, name: 'Climatizador da Estufa (IF/ELSE)', icon: '🌻', benchmarkTime: 13.0, benchmarkPlayer: 'Ana Dev' },
        { id: 'variaveis_7', module: 'variaveis', moduleName: 'Aula 5: Variáveis & Tipos', num: 7, name: 'Radar & Freio Autônomo (IF/ELSE)', icon: '🚨', benchmarkTime: 15.0, benchmarkPlayer: 'SinalVerde' },
        { id: 'variaveis_8', module: 'variaveis', moduleName: 'Aula 5: Variáveis & Tipos', num: 8, name: 'Firmware do Rover Marciano (Mini-IDE)', icon: '🚀', benchmarkTime: 25.0, benchmarkPlayer: 'SpeedDev' },

        // AULA 6/7: LABORATÓRIO MAKER (3 Níveis)
        { id: 'labmaker_1', module: 'labmaker', moduleName: 'Aula 6/7: Bancada Maker', num: 1, name: 'Circuito +5V, Resistor & LED', icon: '💡', benchmarkTime: 12.0, benchmarkPlayer: 'Robô Alfa' },
        { id: 'labmaker_2', module: 'labmaker', moduleName: 'Aula 6/7: Bancada Maker', num: 2, name: 'Circuito com Pushbutton', icon: '🔘', benchmarkTime: 16.0, benchmarkPlayer: 'CyberMaker' },
        { id: 'labmaker_3', module: 'labmaker', moduleName: 'Aula 6/7: Bancada Maker', num: 3, name: 'Semáforo Físico (3 LEDs)', icon: '⚡', benchmarkTime: 22.0, benchmarkPlayer: 'SpeedDev' },

        // AULA 8: OFICINA DO ARDUINO (3 Níveis)
        { id: 'arduino_1', module: 'arduino', moduleName: 'Aula 8: Oficina do Arduino', num: 1, name: 'Lei de Ohm & Tubo de Elétrons', icon: '🧪', benchmarkTime: 10.0, benchmarkPlayer: 'Robô Alfa' },
        { id: 'arduino_2', module: 'arduino', moduleName: 'Aula 8: Oficina do Arduino', num: 2, name: 'Modulação PWM & Osciloscópio', icon: '🌊', benchmarkTime: 12.5, benchmarkPlayer: 'ByteMaster' },
        { id: 'arduino_3', module: 'arduino', moduleName: 'Aula 8: Oficina do Arduino', num: 3, name: 'Quiz Maker de Eletrônica', icon: '🏆', benchmarkTime: 18.0, benchmarkPlayer: 'Ana Dev' }
    ];

    const STORAGE_KEY = 'maker_leaderboard';
    const PLAYER_NAME_KEY = 'maker_player_name';

    // Rastreamento de tempo ativo em tempo real
    const activeTimers = {};
    let timerTickInterval = null;

    // Formatação de segundos em formato amigável mm:ss.d
    function formatTime(sec) {
        if (typeof sec !== 'number' || isNaN(sec)) return '--:--.-';
        const mins = Math.floor(sec / 60);
        const remSecs = (sec % 60).toFixed(1);
        const secInt = Math.floor(remSecs);
        const tenths = Math.floor((remSecs - secInt) * 10);
        const minStr = mins < 10 ? '0' + mins : '' + mins;
        const secStr = secInt < 10 ? '0' + secInt : '' + secInt;
        return `${minStr}:${secStr}.${tenths}s`;
    }

    // Leitura segura do localStorage
    function getStoredData() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (raw) return JSON.parse(raw);
        } catch (e) {
            console.warn('Erro ao ler leaderboard:', e);
        }
        return seedInitialLeaderboard();
    }

    // Gravação segura no localStorage
    function saveStoredData(data) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        } catch (e) {
            console.warn('Erro ao salvar leaderboard:', e);
        }
    }

    // Inicialização de benchmarks para gerar espírito competitivo desde o primeiro minuto
    function seedInitialLeaderboard() {
        const seed = {};
        const today = new Date().toLocaleDateString('pt-BR');

        ALL_LEVELS_METADATA.forEach(lvl => {
            seed[lvl.id] = {
                levelId: lvl.id,
                module: lvl.module,
                moduleName: lvl.moduleName,
                levelNum: lvl.num,
                levelName: lvl.name,
                icon: lvl.icon,
                bestTime: lvl.benchmarkTime,
                bestPlayer: lvl.benchmarkPlayer,
                bestDate: today,
                runs: [
                    { time: lvl.benchmarkTime, player: lvl.benchmarkPlayer, date: today }
                ]
            };
        });

        saveStoredData(seed);
        return seed;
    }

    // Gerenciador do nome do estudante
    function getPlayerName() {
        try {
            const name = localStorage.getItem(PLAYER_NAME_KEY);
            if (name && name.trim()) return name.trim();
        } catch (e) {}
        return 'Maker Aluno';
    }

    function setPlayerName(name) {
        if (!name || !name.trim()) return;
        const clean = name.trim().slice(0, 24);
        try {
            localStorage.setItem(PLAYER_NAME_KEY, clean);
        } catch (e) {}
        updateLivePlayerLabels();
        updateLeaderboardUI();
    }

    function updateLivePlayerLabels() {
        const name = getPlayerName();
        document.querySelectorAll('.maker-player-label').forEach(el => {
            el.innerText = name;
        });
    }

    // Início do cronômetro para uma fase
    function startTimer(moduleKey, levelNum) {
        const key = `${moduleKey}_${levelNum}`;
        activeTimers[key] = {
            startTime: performance.now(),
            running: true
        };

        updateLiveTimerDisplay(moduleKey, levelNum, 0);

        if (!timerTickInterval) {
            timerTickInterval = setInterval(tickAllTimers, 100);
        }
    }

    // Atualização contínua de todos os cronômetros ativos
    function tickAllTimers() {
        let hasActive = false;
        const now = performance.now();

        Object.keys(activeTimers).forEach(key => {
            const timer = activeTimers[key];
            if (timer && timer.running) {
                hasActive = true;
                const elapsed = (now - timer.startTime) / 1000;
                const parts = key.split('_');
                const moduleKey = parts[0];
                const levelNum = parseInt(parts[1], 10);
                updateLiveTimerDisplay(moduleKey, levelNum, elapsed);
            }
        });

        if (!hasActive && timerTickInterval) {
            clearInterval(timerTickInterval);
            timerTickInterval = null;
        }
    }

    // Atualiza o display do cronômetro no DOM
    function updateLiveTimerDisplay(moduleKey, levelNum, seconds) {
        const valEl = document.getElementById(`hud_time_val_${moduleKey}`);
        if (valEl) {
            valEl.innerText = formatTime(seconds);
        }

        const recEl = document.getElementById(`hud_record_val_${moduleKey}`);
        if (recEl) {
            const record = getBestTime(moduleKey, levelNum);
            recEl.innerText = record ? formatTime(record.time) : '--:--.-';
        }
    }

    // Parada do cronômetro e cálculo do tempo decorrido
    function stopTimer(moduleKey, levelNum) {
        const key = `${moduleKey}_${levelNum}`;
        const timer = activeTimers[key];
        let elapsed = 5.0; // fallback

        if (timer && timer.running) {
            elapsed = (performance.now() - timer.startTime) / 1000;
            timer.running = false;
            delete activeTimers[key];
        }

        const elapsedRounded = Math.max(1.0, parseFloat(elapsed.toFixed(1)));
        updateLiveTimerDisplay(moduleKey, levelNum, elapsedRounded);
        return elapsedRounded;
    }

    // Registro do resultado da fase no Leaderboard
    function recordCompletion(moduleKey, levelNum, timeSeconds) {
        const key = `${moduleKey}_${levelNum}`;
        const data = getStoredData();
        const playerName = getPlayerName();
        const today = new Date().toLocaleDateString('pt-BR');

        let levelRecord = data[key];
        const meta = ALL_LEVELS_METADATA.find(m => m.id === key);

        if (!levelRecord) {
            levelRecord = {
                levelId: key,
                module: moduleKey,
                moduleName: meta ? meta.moduleName : moduleKey,
                levelNum: levelNum,
                levelName: meta ? meta.name : `Nível ${levelNum}`,
                icon: meta ? meta.icon : '⭐',
                bestTime: timeSeconds,
                bestPlayer: playerName,
                bestDate: today,
                runs: []
            };
            data[key] = levelRecord;
        }

        const prevBest = levelRecord.bestTime;
        const isNewRecord = timeSeconds < prevBest;

        // Adiciona à lista de corridas e ordena por menor tempo
        if (!levelRecord.runs) levelRecord.runs = [];
        levelRecord.runs.push({
            time: timeSeconds,
            player: playerName,
            date: today
        });
        levelRecord.runs.sort((a, b) => a.time - b.time);
        levelRecord.runs = levelRecord.runs.slice(0, 5); // Guarda o Top 5

        if (isNewRecord || !levelRecord.bestTime) {
            levelRecord.bestTime = timeSeconds;
            levelRecord.bestPlayer = playerName;
            levelRecord.bestDate = today;
        }

        saveStoredData(data);

        // Se for novo recorde da turma, toca fanfarra e confetes especiais
        if (isNewRecord) {
            if (typeof triggerConfetti === 'function') triggerConfetti(4000);
            if (typeof playSound === 'function') playSound('success');
        }

        return {
            isNewRecord: isNewRecord,
            time: timeSeconds,
            formattedTime: formatTime(timeSeconds),
            prevBest: prevBest,
            formattedPrevBest: formatTime(prevBest),
            bestPlayer: levelRecord.bestPlayer,
            runs: levelRecord.runs
        };
    }

    // Retorna o melhor tempo de um nível
    function getBestTime(moduleKey, levelNum) {
        const key = `${moduleKey}_${levelNum}`;
        const data = getStoredData();
        const record = data[key];
        if (record && typeof record.bestTime === 'number') {
            return {
                time: record.bestTime,
                player: record.bestPlayer,
                date: record.bestDate
            };
        }
        return null;
    }

    // Monta o Card de Speedrun nos Modais de Vitória
    function generateWinTimeCardHTML(moduleKey, levelNum, completionResult) {
        const res = completionResult || {
            time: 0,
            formattedTime: '--:--.-',
            isNewRecord: false,
            bestPlayer: getPlayerName()
        };

        const isNew = res.isNewRecord;
        const currentBest = getBestTime(moduleKey, levelNum);

        return `
        <div class="maker-win-speedrun-card ${isNew ? 'is-record' : ''}">
            <div class="m-card-header">
                <div class="m-card-title">
                    <i class="fa-solid fa-stopwatch"></i> 
                    <span>Tempo de Conclusão: <b style="color:${isNew ? '#FBBF24' : '#38BDF8'};">${res.formattedTime}</b></span>
                </div>
                ${isNew ? `
                <div class="m-record-pill pulse">
                    <i class="fa-solid fa-bolt"></i> NOVO RECORDE DA TURMA! 🏆
                </div>
                ` : `
                <div class="m-best-pill">
                    <i class="fa-solid fa-trophy"></i> Recorde Atual: <b>${currentBest ? formatTime(currentBest.time) : '--'}</b> por <b>${currentBest ? currentBest.player : 'Alfa'}</b>
                </div>
                `}
            </div>
            <div class="m-card-actions">
                <button type="button" class="m-btn-leaderboard" onclick="openTab('tab-leaderboard')">
                    <i class="fa-solid fa-ranking-star"></i> Ver Placar de Campeões
                </button>
            </div>
        </div>
        `;
    }

    // Alterna para o nível desejado a partir do Leaderboard
    function openLevelFromLeaderboard(moduleKey, levelNum) {
        const tabId = `tab-${moduleKey}`;
        if (typeof window.openTab === 'function') {
            window.openTab(tabId);
        }

        setTimeout(() => {
            if (moduleKey === 'tesouro' && typeof window.t_switchLevel === 'function') {
                window.t_switchLevel(levelNum);
            } else if (moduleKey === 'loopmaker' && typeof window.l2_switchLevel === 'function') {
                window.l2_switchLevel(levelNum);
            } else if (moduleKey === 'jardim' && typeof window.if_switchLevel === 'function') {
                window.if_switchLevel(levelNum);
            } else if (moduleKey === 'semaforo' && typeof window.sem_switchLevel === 'function') {
                window.sem_switchLevel(levelNum);
            } else if (moduleKey === 'variaveis' && typeof window.vars_switchLevel === 'function') {
                window.vars_switchLevel(levelNum);
            } else if (moduleKey === 'labmaker' && typeof window.lab_startMission === 'function') {
                window.lab_startMission(levelNum);
            } else if (moduleKey === 'arduino' && typeof window.ard_switchSubTab === 'function') {
                if (levelNum === 1) window.ard_switchSubTab('ard-tab-ohm');
                else if (levelNum === 2) window.ard_switchSubTab('ard-tab-pwm');
                else window.ard_switchSubTab('ard-tab-quiz');
            }
            startTimer(moduleKey, levelNum);
        }, 150);
    }

    // Limpar / Resetar o Leaderboard
    function resetLeaderboard() {
        if (confirm('Deseja realmente zerar todos os recordes do Placar para uma nova turma?')) {
            seedInitialLeaderboard();
            updateLeaderboardUI();
            if (typeof playSound === 'function') playSound('step');
            alert('Placar de Recordes reiniciado com sucesso! Boa sorte aos novos desafiantes!');
        }
    }

    // Renderizador da Aba do Placar (tab-leaderboard)
    let currentFilter = 'all';

    function setFilter(filter) {
        currentFilter = filter;
        updateLeaderboardUI();
    }

    function getSummaryStats() {
        const data = getStoredData();
        const playerName = getPlayerName();
        let totalBestSeconds = 0;
        let userRecords = 0;
        let totalCompleted = 0;

        ALL_LEVELS_METADATA.forEach(lvl => {
            const rec = data[lvl.id];
            if (rec && typeof rec.bestTime === 'number') {
                totalBestSeconds += rec.bestTime;
                totalCompleted++;
                if (rec.bestPlayer.toLowerCase() === playerName.toLowerCase()) {
                    userRecords++;
                }
            }
        });

        return {
            totalCompleted,
            userRecords,
            totalBestSeconds,
            playerName
        };
    }

    function updateLeaderboardUI() {
        const container = document.getElementById('leaderboard_content_area');
        if (!container) return;

        const data = getStoredData();
        const playerName = getPlayerName();

        // Estatísticas Gerais
        let totalBestSeconds = 0;
        let userRecordsCount = 0;
        let totalCompleted = 0;

        ALL_LEVELS_METADATA.forEach(lvl => {
            const rec = data[lvl.id];
            if (rec && typeof rec.bestTime === 'number') {
                totalBestSeconds += rec.bestTime;
                totalCompleted++;
                if (rec.bestPlayer.toLowerCase() === playerName.toLowerCase()) {
                    userRecordsCount++;
                }
            }
        });

        // Atualiza cabeçalho com Codinome do Aluno
        const inputName = document.getElementById('leaderboard_player_input');
        if (inputName && document.activeElement !== inputName) {
            inputName.value = playerName;
        }

        const statRecordsEl = document.getElementById('lb_stat_records');
        if (statRecordsEl) statRecordsEl.innerText = `${userRecordsCount} de 30`;

        const statTotalTimeEl = document.getElementById('lb_stat_total_time');
        if (statTotalTimeEl) statTotalTimeEl.innerText = formatTime(totalBestSeconds);

        const statCompletedEl = document.getElementById('lb_stat_completed');
        if (statCompletedEl) statCompletedEl.innerText = `${totalCompleted} / 30 Fases`;

        // Filtro de Níveis
        const filteredLevels = ALL_LEVELS_METADATA.filter(lvl => {
            if (currentFilter === 'all') return true;
            if (currentFilter === 'my_records') {
                const rec = data[lvl.id];
                return rec && rec.bestPlayer.toLowerCase() === playerName.toLowerCase();
            }
            return lvl.module === currentFilter;
        });

        // Montagem dos Cards de Nível
        if (filteredLevels.length === 0) {
            container.innerHTML = `
                <div style="grid-column: 1 / -1; text-align:center; padding: 40px 20px; background:#1E293B; border-radius:20px; border:2px dashed #334155;">
                    <div style="font-size:3rem; margin-bottom:10px;">⚡🏆</div>
                    <h3 style="color:#FBBF24; font-family:'Fredoka One';">Nenhum recorde neste filtro ainda!</h3>
                    <p style="color:#94A3B8; max-width:460px; margin:8px auto 16px;">
                        ${currentFilter === 'my_records' ? 'Você ainda não assumiu a 1ª posição em nenhuma fase deste filtro. Desafie os recordistas e marque seu codinome no topo!' : 'Nenhum nível correspondente encontrado.'}
                    </p>
                    <button type="button" class="lb-play-btn" style="max-width:240px; margin:0 auto;" onclick="makerLeaderboard.setFilter('all'); document.querySelectorAll('.lb-filter-btn').forEach(b=>b.classList.remove('active')); document.querySelector('.lb-filter-btn')?.classList.add('active');">
                        Ver Todas as 30 Fases
                    </button>
                </div>
            `;
        } else {
            let cardsHTML = '';
            filteredLevels.forEach(lvl => {
                const rec = data[lvl.id] || {
                    bestTime: lvl.benchmarkTime,
                    bestPlayer: lvl.benchmarkPlayer,
                    bestDate: 'Hoje',
                    runs: []
                };

                const isUserBest = rec.bestPlayer.toLowerCase() === playerName.toLowerCase();
                const topRuns = rec.runs || [];
                const userRuns = topRuns.filter(r => r.player.toLowerCase() === playerName.toLowerCase());
                const userBestRun = userRuns.length > 0 ? userRuns.sort((a,b)=>a.time - b.time)[0] : null;

                cardsHTML += `
                <div class="lb-level-card ${isUserBest ? 'user-top-record' : ''}">
                    <div class="lb-card-top">
                        <div class="lb-level-badge">
                            <span class="lb-icon">${lvl.icon}</span>
                            <div>
                                <div class="lb-module-name">${lvl.moduleName}</div>
                                <div class="lb-level-name">Nível ${lvl.num}: ${lvl.name}</div>
                            </div>
                        </div>
                        ${isUserBest ? `
                        <div class="lb-user-crown pulse" title="Você detém o 1º Lugar neste nível!">
                            👑 SEU RECORDE
                        </div>
                        ` : ''}
                    </div>

                    <div class="lb-record-showcase">
                        <div class="lb-medal-big">🥇</div>
                        <div class="lb-record-details">
                            <div class="lb-record-time">${formatTime(rec.bestTime)}</div>
                            <div class="lb-record-holder">
                                Recordista: <b style="color:${isUserBest ? '#FBBF24' : '#38BDF8'}">${rec.bestPlayer}</b>
                                <span class="lb-record-date">(${rec.bestDate || 'Hoje'})</span>
                            </div>
                        </div>
                    </div>

                    <!-- SEU MELHOR TEMPO PESSOAL -->
                    <div class="lb-user-pb-badge ${isUserBest ? 'record-holder' : ''}">
                        <span style="color:#CBD5E1;font-size:0.8rem;display:flex;align-items:center;gap:6px;">
                            <i class="fa-solid fa-person-running" style="color:${isUserBest ? '#FBBF24' : '#38BDF8'};"></i> 
                            ${isUserBest ? 'Seu Recorde Pessoal:' : 'Seu Melhor Tempo:'}
                        </span>
                        <b style="color:${userBestRun ? (isUserBest ? '#FBBF24' : '#38BDF8') : '#64748B'};font-family:'Fira Code',monospace;font-size:0.95rem;">
                            ${userBestRun ? formatTime(userBestRun.time) : 'Ainda não jogou'}
                        </b>
                    </div>

                    <!-- TOP 3 PODIUM -->
                    <div class="lb-podium-list">
                        <div class="lb-podium-title">🏆 Top Melhores Tempos:</div>
                        ${topRuns.length > 0 ? topRuns.slice(0, 3).map((r, idx) => `
                            <div class="lb-podium-row ${r.player.toLowerCase() === playerName.toLowerCase() ? 'highlight' : ''}">
                                <span class="podium-rank">${idx === 0 ? '🥇' : idx === 1 ? '🥈' : '🥉'} ${idx + 1}º</span>
                                <span class="podium-player">${r.player}</span>
                                <span class="podium-time">${formatTime(r.time)}</span>
                            </div>
                        `).join('') : `
                            <div style="font-size:0.8rem;color:#64748B;font-style:italic;padding:4px 0;">Nenhuma corrida registrada ainda.</div>
                        `}
                    </div>

                    <div class="lb-card-footer">
                        <button type="button" class="lb-play-btn" onclick="makerLeaderboard.openLevel('${lvl.module}', ${lvl.num})">
                            <i class="fa-solid fa-play"></i> Desafiar & Bater Tempo
                        </button>
                    </div>
                </div>
                `;
            });

            container.innerHTML = cardsHTML;
        }

        // Renderiza Emblemas Speedrun Dinâmicos
        const achieveContainer = document.getElementById('lb_achieve_container');
        if (achieveContainer) {
            let hasUnder8 = false;
            let completedVariaveis = 0;
            const modulesWithFirstPlace = new Set();

            ALL_LEVELS_METADATA.forEach(lvl => {
                const rec = data[lvl.id];
                if (rec) {
                    if ((rec.runs || []).some(r => r.player.toLowerCase() === playerName.toLowerCase() && r.time <= 8.0)) {
                        hasUnder8 = true;
                    }
                    if (rec.bestPlayer.toLowerCase() === playerName.toLowerCase()) {
                        modulesWithFirstPlace.add(rec.module);
                    }
                    if (lvl.module === 'variaveis' && (rec.runs || []).some(r => r.player.toLowerCase() === playerName.toLowerCase())) {
                        completedVariaveis++;
                    }
                }
            });

            const achievements = [
                {
                    icon: '⚡',
                    name: 'Raio Maker',
                    desc: 'Conclua qualquer nível em menos de 8 segundos!',
                    unlocked: hasUnder8,
                    progress: hasUnder8 ? 'Desbloqueado! 🏆' : 'Melhor tempo > 8s'
                },
                {
                    icon: '🏎️',
                    name: 'Piloto Ágil',
                    desc: 'Conquiste o 1º lugar em 5 missões diferentes.',
                    unlocked: userRecordsCount >= 5,
                    progress: `${userRecordsCount} / 5 Recordes`
                },
                {
                    icon: '🪐',
                    name: 'Velocidade Marciana',
                    desc: 'Complete os 8 níveis de Variáveis no modo Speedrun.',
                    unlocked: completedVariaveis >= 8,
                    progress: `${completedVariaveis} / 8 Níveis`
                },
                {
                    icon: '👑',
                    name: 'Lenda do Laboratório',
                    desc: 'Marque seu nome no topo de todos os módulos Maker!',
                    unlocked: modulesWithFirstPlace.size >= 7,
                    progress: `${modulesWithFirstPlace.size} / 7 Módulos`
                }
            ];

            achieveContainer.innerHTML = achievements.map(a => `
                <div class="lb-achieve-item ${a.unlocked ? 'unlocked' : ''}">
                    <span class="lb-achieve-icon">${a.icon}</span>
                    <div style="flex:1;">
                        <div style="display:flex;justify-content:space-between;align-items:center;gap:6px;">
                            <div class="lb-achieve-name">${a.name}</div>
                            <span style="font-size:0.7rem;font-weight:900;color:${a.unlocked ? '#10B981' : '#94A3B8'};background:#1E293B;padding:2px 8px;border-radius:6px;white-space:nowrap;">
                                ${a.unlocked ? '✅ CONQUISTADO' : a.progress}
                            </span>
                        </div>
                        <div class="lb-achieve-desc">${a.desc}</div>
                    </div>
                </div>
            `).join('');
        }
    }

    // Garante que o widget do cronômetro HUD exista na tela do jogo
    function ensureHUD(moduleKey, containerSelector, levelNum) {
        const container = typeof containerSelector === 'string' ? document.querySelector(containerSelector) : containerSelector;
        if (!container) return;

        let hud = container.querySelector(`.maker-hud-timer-bar[data-module="${moduleKey}"]`);
        if (!hud) {
            hud = document.createElement('div');
            hud.className = 'maker-hud-timer-bar';
            hud.setAttribute('data-module', moduleKey);
            hud.innerHTML = `
                <div class="hud-timer-badge">
                    <i class="fa-solid fa-stopwatch fa-spin-pulse"></i>
                    <span>Tempo: <b id="hud_time_val_${moduleKey}">00:00.0s</b></span>
                </div>
                <div class="hud-record-badge">
                    <i class="fa-solid fa-bolt"></i>
                    <span>Recorde: <b id="hud_record_val_${moduleKey}">--:--.-</b></span>
                </div>
                <button type="button" onclick="openTab('tab-leaderboard')" class="hud-btn-leaderboard" title="Ver Placar de Recordes da Turma">
                    <i class="fa-solid fa-ranking-star"></i> Placar
                </button>
            `;
            container.insertBefore(hud, container.firstChild);
        }

        const lvl = levelNum || 1;
        const best = getBestTime(moduleKey, lvl);
        const recEl = document.getElementById(`hud_record_val_${moduleKey}`);
        if (recEl && best) {
            recEl.innerText = `${formatTime(best.time)} (${best.player})`;
        }
        return hud;
    }

    // Inicialização ao carregar a página
    document.addEventListener('DOMContentLoaded', () => {
        getStoredData(); // assegura que está semeado
        updateLivePlayerLabels();
        updateLeaderboardUI();
    });

    // API pública global
    window.makerLeaderboard = {
        startTimer: startTimer,
        stopTimer: stopTimer,
        recordCompletion: recordCompletion,
        getBestTime: getBestTime,
        formatTime: formatTime,
        getPlayerName: getPlayerName,
        setPlayerName: setPlayerName,
        getSummaryStats: getSummaryStats,
        generateWinTimeCardHTML: generateWinTimeCardHTML,
        ensureHUD: ensureHUD,
        openLevel: openLevelFromLeaderboard,
        resetLeaderboard: resetLeaderboard,
        setFilter: setFilter,
        updateLeaderboardUI: updateLeaderboardUI
    };

})(window);

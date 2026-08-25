/* ==========================================================================
   CRIADORES DE CÓDIGO — TRILHA DE APRENDIZAGEM & HUB DE CONQUISTAS
   ========================================================================== */

const UNLOCKED_LESSONS = 3; // Liberadas Aula 1, Aula 2 e Aula 3

const getLevels = key => { try { return JSON.parse(localStorage.getItem(key) || '[]'); } catch(e) { return []; } };

// ================= CONTEÚDO DAS 10 AULAS (LÚDICO PARA CRIANÇAS) =================
const lessonContents = {
    1: {
        emoji:'🤖', title:'Algoritmos e Sequências', color:'#FBBF24',
        objetivo:'🧠 <b>O que você vai aprender:</b> Que um programa de computador é como uma <span style="color:#FBBF24;">receita de bolo</span> — uma lista de passos na <b>ordem certa</b>! Se trocar a ordem, o bolo não cresce e o robô bate na parede!',
        teoria:`<b>Imagine que você é um robô...</b>

Um robô não sabe pensar sozinho. Ele precisa que você dê <b>comandos exatos</b>, um por um, na sequência correta.

É igual a fazer um bolo de chocolate:
1️⃣ Pegar os ingredientes → 2️⃣ Misturar tudo → 3️⃣ Colocar na forma → 4️⃣ Assar no forno

Se você colocar na forma <i>antes</i> de misturar... dá tudo errado! No computador, essa sequência ordenada de passos se chama <b>ALGORITMO</b>.`,
        exemplo:`Comandos para o robô achar o tesouro:
1. Andar para frente ➡️
2. Virar à direita ⬇️
3. Abrir o baú 🏆`,
        dica:'💡 Dica Maker: Antes de programar, desenhe os passos num papel! Isso ajuda a não esquecer nenhum comando.',
        jogo:'tab-tesouro', btntext:'🎮 Jogar Caça ao Tesouro!'
    },
    2: {
        emoji:'🔄', title:'Estruturas de Repetição (Laço FOR em C/C++)', color:'#A78BFA',
        objetivo:'🧠 <b>O que você vai aprender:</b> Como ensinar o robô a <b>repetir qualquer tarefa sozinho</b> usando o laço <span style="color:#A78BFA;">for</span> sem precisar digitar o mesmo comando 100 vezes!',
        teoria:`<b>Superpoder da Automação 🚀</b>

Imagine que você precisa dar <b>100 pulos de corda</b> 🪢 ou escovar os dentes 🦷.
Em vez de escrever no papel <i>"pular, pular, pular..."</i> 100 vezes, você simplesmente conta: <b>"1, 2, 3... até 100!"</b>

No computador é exatamente a mesma coisa! Usamos o <b>Laço FOR em C/C++</b> para o robô contar e repetir comandos automaticamente:

<code>for (int i = 0; i < 5; i++) {
    carimbarCaixa(); // Isso roda 5 vezes sozinho!
}</code>

<b>Como funciona essa fórmula mágica?</b>
1️⃣ <code>int i = 0</code> ➔ 🎬 <b>Início:</b> O contador começa no número 0.
2️⃣ <code>i < 5</code> ➔ 🛑 <b>Limite:</b> Repete enquanto o contador for menor que 5 (5 vezes!).
3️⃣ <code>i++</code> ➔ ➕ <b>Passo:</b> Soma +1 no contador a cada volta.
4️⃣ <code>{ ... }</code> ➔ 🎒 <b>Mochila:</b> Tudo dentro das chaves é repetido!`,
        exemplo:`// Exemplo 1: Repetir 1 comando (andar em linha reta)
for (int i = 0; i < 4; i++) {
    direita();
}

// Exemplo 2: Repetir 2 comandos juntos (caminho em escada)
for (int i = 0; i < 4; i++) {
    direita();
    baixo();
}`,
        dica:'💡 Dica Autodidacta: As chaves { } são a "mochila" do FOR. Tudo que fica dentro da mochila é repetido a cada volta!',
        jogo:'tab-loopmaker', btntext:'🎮 Ir para a Máquina de Loops!'
    },
    3: {
        emoji:'🌱', title:'Condicionais & Robô Inteligente (IF / ELSE em C/C++)', color:'#34D399',
        objetivo:'🧠 <b>O que você vai aprender:</b> Como ensinar o robô a <b>tomar decisões sozinho</b> usando <span style="color:#34D399;">IF / ELSE</span> (Se / Senão) para desviar de obstáculos e barreiras no caminho!',
        teoria:`<b>E se tiver uma barreira no caminho? 🚧</b>

No dia a dia, você toma decisões o tempo todo:
<i>"<b>SE</b> tiver um buraco no chão → desvio. <b>SENÃO</b> → continuo andando reto."</i>

Na robótica com Arduino usamos a estrutura <b>IF / ELSE</b> com sensores:
- <b>SE (sensor detectar barreira)</b> → Desvia pelo lado!
- <b>SENÃO</b> → Anda em linha reta livremente.

Isso transforma um robô simples em um robô <b>AUTÔNOMO E INTELIGENTE</b>!`,
        exemplo:`if (sensorObstaculo() == true) {
    baixo();   // Detectou obstáculo: desvia para a linha de baixo!
} else {
    direita(); // Caminho livre: segue para a direita!
}`,
        dica:'💡 Dica Maker: O sensor ultrassônico envia ondas de som inaudíveis para calcular a distância e saber se há obstáculos à frente!',
        jogo:'tab-jardim', btntext:'🎮 Ir para o Robô com IF/ELSE!'
    },
    4: {
        emoji:'🚦', title:'Sequências Temporizadas (Sinais)', color:'#FBBF24',
        objetivo:'🧠 <b>O que você vai aprender:</b> Como controlar o <b>tempo</b> das coisas no Arduino usando a função <span style="color:#FBBF24;">delay()</span> em milissegundos!',
        teoria:`<b>O tempo na programação</b>

Um semáforo de trânsito precisa ficar <b>5 segundos</b> no VERDE, <b>2 segundos</b> no AMARELO e <b>5 segundos</b> no VERMELHO.

No Arduino, medimos tempo em <b>milissegundos</b>:
- 1 segundo = <b>1000 ms</b>
- 5 segundos = <b>5000 ms</b>

Usamos a função <code>delay(5000);</code> para fazer o Arduino "esperar" antes de passar para o próximo comando.`,
        exemplo:`digitalWrite(ledVerde, HIGH); // Liga o verde
delay(5000);                   // Espera 5 segundos
digitalWrite(ledVerde, LOW);  // Desliga o verde`,
        dica:'💡 Dica Maker: Enquanto o delay() está rodando, o Arduino fica "congelado" esperando. Nas aulas avançadas você aprenderá a fazer multitarefas!',
        jogo:'tab-semaforo', btntext:'🎮 Jogar Semáforo Digital!'
    },
    5: {
        emoji:'🧮', title:'Variáveis e Tipos de Dados', color:'#38BDF8',
        objetivo:'🧠 <b>O que você vai aprender:</b> O que são <b>variáveis</b> — "caixas com nome" na memória do computador para guardar pontos, moedas, temperaturas e textos!',
        teoria:`<b>Caixinhas de Memória</b>

Imagine que você tem caixas etiquetadas no seu quarto:
- Caixa "Brinquedos" 🧸
- Caixa "Roupas" 👕

No computador, uma <b>VARIÁVEL</b> é uma caixinha na memória.
Ela tem um <b>TIPO</b> (o que pode guardar dentro) e um <b>NOME</b>:

- <code>int pontos = 10;</code> → Guarda números inteiros (0, 1, 2, 50...)
- <code>float temperatura = 25.5;</code> → Guarda números com vírgula/ponto
- <code>bool botaoApertado = true;</code> → Guarda verdadeiro (true) ou falso (false)`,
        exemplo:`int moedasColetadas = 0;
moedasColetadas = moedasColetadas + 1; // Coletou 1 moeda!`,
        dica:'💡 Dica Maker: Escolha nomes claros para suas variáveis! Use "pontosDoJogador" em vez de "p".',
        jogo:'tab-tesouro', btntext:'🎮 Jogar Caça ao Tesouro Nível 3!'
    },
    6: {
        emoji:'⚡', title:'Introdução à Eletrônica (Lei de Ohm)', color:'#F87171',
        objetivo:'🧠 <b>O que você vai aprender:</b> Os 3 pilares da eletricidade: <b>Tensão (V)</b>, <b>Corrente (I)</b> e <b>Resistência (R)</b>, e a famosa fórmula V = R * I!',
        teoria:`<b>A Analogia do Cano de Água 🚰</b>

Para entender eletricidade, pense numa caixa d'água com uma mangueira:

1️⃣ <b>TENSÃO (Volts - V):</b> É a <i>pressão</i> da água (altura da caixa). Quanto mais alta, mais forte empurra!
2️⃣ <b>CORRENTE (Amperes - A):</b> É a <i>quantidade</i> de água que passa pelo cano por segundo.
3️⃣ <b>RESISTÊNCIA (Ohms):</b> É o <i>aperto</i> no cano. Se você apertar a mangueira, passa menos água!

<b>A Lei de Ohm:</b> V = R * I (Tensão = Resistência * Corrente)`,
        exemplo:`Se temos uma bateria de 9V e um resistor de 450 ohms:
Corrente (I) = V / R = 9 / 450 = 0.02 Amperes (20 mA) — Perfeito para ligar um LED sem queimar!`,
        dica:'💡 Dica Maker: LEDs precisam SEMPRE de um resistor em série, senão a corrente alta queima o LED em milissegundos!',
        jogo:'tab-labmaker', btntext:'🧪 Ir para a Bancada Maker!'
    },
    7: {
        emoji:'🔌', title:'Circuitos Elétricos e Protoboard', color:'#38BDF8',
        objetivo:'🧠 <b>O que você vai aprender:</b> Como montar circuitos em uma <b>Protoboard</b> (placa de ensaios) sem precisar soldar nenhum fio!',
        teoria:`<b>Como funciona a Protoboard? 🧱</b>

A protoboard é cheia de furos com contatos metálicos escondidos por baixo:

- <b>Linhas de Alimentação (Vermelha + e Azul -):</b> Conectadas na <i>HORIZONTAL</i> de ponta a ponta. Usadas para trazer o 5V e o GND (terra).
- <b>Terminais Centrais (colunas a-b-c-d-e e f-g-h-i-j):</b> Conectadas na <i>VERTICAL</i> (5 furos interligados).

<b>Circuito Fechado:</b> A corrente sai do pólo positivo (+5V), passa pelo resistor, entra no LED (anodo +), sai do LED (catodo -) e volta para o negativo (GND).`,
        exemplo:`Componentes de um circuito simples:
Fonte (5V) ➔ Resistor (220 ohms) ➔ LED (Anodo + / Catodo -) ➔ GND (Terra)`,
        dica:'💡 Dica Maker: LEDs têm polaridade! A perna MAIOR é o Anodo (+) e a perna MENOR (com lado achatado) é o Catodo (-).',
        jogo:'tab-labmaker', btntext:'🧪 Montar Circuito na Protoboard!'
    },
    8: {
        emoji:'🤖', title:'Arduino & O que é uma IDE (C/C++)', color:'#F87171',
        objetivo:'🧠 <b>O que você vai aprender:</b> O que é uma <b>IDE</b> (a mesa de trabalho do programador), a anatomia do <b>Arduino UNO</b> e as funções de base <code>setup()</code> e <code>loop()</code>!',
        teoria:`<b>O que é uma IDE? 💻 (Mesa de Trabalho Maker)</b>

IDE significa <i>Integrated Development Environment</i> (Ambiente de Desenvolvimento Integrado).

Pense na IDE como a <b>Mesa do Super-Heroi da Programação</b>. Em vez de abrir 3 programas diferentes, a IDE junta 3 ferramentas essenciais numa única tela:
1️⃣ ✏️ <b>O Editor de Código:</b> Onde você digita suas instruções em C/C++ coloridinhas.
2️⃣ 🔍 <b>O Compilador:</b> O tradutor que verifica se há erros e transforma seu código C++ em 0s e 1s para o robô.
3️⃣ 🚀 <b>O Uploader (Carregador):</b> O botão mágico que envia o programa via cabo USB para o cérebro do Arduino!

<b>Anatomia do Arduino UNO 🧠</b>
- <b>Pinos Digitais (0 a 13):</b> Entradas e saídas de 2 estados: <code>HIGH</code> (5V / Liga) ou <code>LOW</code> (0V / Desliga).
- <b>Função <code>setup()</code>:</b> Roda 1 vez ao ligar para configurar os pinos.
- <b>Função <code>loop()</code>:</b> Roda REPETIDAMENTE sem parar!`,
        exemplo:`void setup() {
    pinMode(13, OUTPUT); // Configura o pino 13 como saída
}
void loop() {
    digitalWrite(13, HIGH); // Liga o LED
    delay(1000);            // Espera 1 segundo
    digitalWrite(13, LOW);  // Desliga o LED
    delay(1000);            // Espera 1 segundo
}`,
        dica:'💡 Dica Autodidacta: No Arduino IDE real, o botão ✔ VERIFICA erros no código e o botão ➔ CARREGA o código na placa!',
        jogo:'tab-arduino', btntext:'🎮 Ir para a Oficina do Arduino!'
    },
    9: {
        emoji:'🔧', title:'Prática: Montagem Física do Semáforo', color:'#F59E0B',
        objetivo:'📋 <b>Objetivo Prático:</b> Guia completo de montagem física de um semáforo de trânsito real utilizando 3 LEDs, 3 resistores e o Arduino UNO na protoboard.',
        teoria:`<b>Esquema de Montagem Prática 🚦</b>

Conecte os componentes na protoboard seguindo estas portas do Arduino:
- 🔴 <b>LED Vermelho:</b> Anodo (+) no pino <b>13</b> | Catodo (-) no Resistor 220 ohms ➔ GND
- 🟡 <b>LED Amarelo:</b> Anodo (+) no pino <b>12</b> | Catodo (-) no Resistor 220 ohms ➔ GND
- 🟢 <b>LED Verde:</b> Anodo (+) no pino <b>11</b> | Catodo (-) no Resistor 220 ohms ➔ GND

Confira se todas as pernas menores (catodos) compartilham a linha do GND!`,
        exemplo:`Porta 13 ➔ LED Vermelho (Anodo)
Porta 12 ➔ LED Amarelo  (Anodo)
Porta 11 ➔ LED Verde    (Anodo)
GND      ➔ Barramento Negativo da Protoboard`,
        dica:'💡 Dica Maker: Use fios coloridos para combinar com os LEDs (fio vermelho no LED vermelho, fio verde no LED verde)! Fica muito mais fácil de revisar.',
        jogo:'tab-aula9', btntext:'📖 Ver Guia de Montagem!'
    },
    10: {
        emoji:'💻', title:'Prática: Programação C++ do Semáforo', color:'#10B981',
        objetivo:'🚀 <b>Objetivo Final:</b> Código-fonte C++ completo do Semáforo Digital pronto para compilação e upload no Arduino IDE!',
        teoria:`<b>Código-Fonte Completo do Semáforo C++ 🚦</b>

Este é o código que você vai carregar no Arduino IDE para automatizar seu semáforo real:`,
        exemplo:`int ledVermelho = 13;
int ledAmarelo  = 12;
int ledVerde    = 11;

void setup() {
  pinMode(ledVermelho, OUTPUT);
  pinMode(ledAmarelo,  OUTPUT);
  pinMode(ledVerde,    OUTPUT);
}

void loop() {
  // VERDE (5 segundos)
  digitalWrite(ledVerde, HIGH);
  digitalWrite(ledAmarelo, LOW);
  digitalWrite(ledVermelho, LOW);
  delay(5000);

  // AMARELO (2 segundos)
  digitalWrite(ledVerde, LOW);
  digitalWrite(ledAmarelo, HIGH);
  digitalWrite(ledVermelho, LOW);
  delay(2000);

  // VERMELHO (5 segundos)
  digitalWrite(ledVerde, LOW);
  digitalWrite(ledAmarelo, LOW);
  digitalWrite(ledVermelho, HIGH);
  delay(5000);
}`,
        dica:'🎉 Parabéns! Você concluiu a Trilha Maker e agora domina a base de Programação C++ e Eletrônica com Arduino!',
        jogo:'tab-aula10', btntext:'🚀 Ver Código & Fazer Upload!'
    }
};

// ================= RENDERIZADOR DA TRILHA DE APRENDIZAGEM =================
function updateTrail() {
    const list = document.getElementById('trail-nodes-list');
    if (!list) return;

    const totalStars = getLevels('semaforo_levels').length + getLevels('tesouro_levels').length + 
                       getLevels('labmaker_levels').length + getLevels('loopmaker_levels').length + 
                       getLevels('jardim_levels').length + getLevels('arduino_levels').length;

    const percent = Math.min(100, Math.round((totalStars / 20) * 100));
    const starCountEl = document.getElementById('trail-star-count');
    const progressBarEl = document.getElementById('trail-progress-bar');
    if (starCountEl) starCountEl.innerText = `${totalStars} / 20 ⭐`;
    if (progressBarEl) progressBarEl.style.width = `${percent}%`;

    let html = '';
    for (let i = 1; i <= 10; i++) {
        const lesson = lessonContents[i];
        const isUnlocked = i <= UNLOCKED_LESSONS;
        const isCurrent = i === UNLOCKED_LESSONS;

        let statusClass = 'locked';
        let badgeText = '🔒 Bloqueado';
        if (isUnlocked) {
            statusClass = isCurrent ? 'current' : 'done';
            badgeText = isCurrent ? '🚀 Aula Atual' : '✅ Liberado';
        }

        html += `
            <div class="trail-node ${statusClass}" onclick="showLessonModal(${i})">
                <div class="trail-node-icon" style="background:${lesson.color}22;color:${lesson.color};">${lesson.emoji}</div>
                <div class="trail-node-info">
                    <h3>Aula ${i}: ${lesson.title}</h3>
                    <p>${lesson.dica.substring(0, 75)}...</p>
                </div>
                <div class="trail-node-badge">${badgeText}</div>
            </div>
        `;
        if (i < 10) {
            html += `<div class="trail-connector ${isUnlocked ? 'done' : ''}"></div>`;
        }
    }
    list.innerHTML = html;
}

function showLessonModal(lessonNum) {
    const lesson = lessonContents[lessonNum];
    if (!lesson) return;
    if (lessonNum > UNLOCKED_LESSONS) {
        alert('🔒 Esta aula será liberada conforme você avança no curso!');
        return;
    }

    const modalBox = document.getElementById('lesson-modal-box');
    if (!modalBox) return;

    modalBox.innerHTML = `
        <button class="lesson-close" onclick="closeLessonModal()">✕</button>
        <div class="lesson-modal-emoji">${lesson.emoji}</div>
        <h2>Aula ${lessonNum}: ${lesson.title}</h2>
        <div class="lesson-objetivo">${lesson.objetivo}</div>
        <div class="lesson-teoria">
            <h4>📖 Explicação Simples</h4>
            <p>${lesson.teoria.replace(/\n/g, '<br>')}</p>
        </div>
        <div class="lesson-exemplo"><b>💻 Exemplo de Código:</b><br>${lesson.exemplo}</div>
        <div class="lesson-dica">${lesson.dica}</div>
        <button class="lesson-btn" onclick="closeLessonModal(); openTab('${lesson.jogo}');">${lesson.btntext}</button>
    `;

    document.getElementById('lesson-modal')?.classList.add('active');
}

function closeLessonModal() {
    document.getElementById('lesson-modal')?.classList.remove('active');
}

// ================= ESTATÍSTICAS E CONQUISTAS DO HUB =================
function setBadge(id, saved, maxLevels = 3) {
    const el = document.getElementById(id);
    if (!el) return;
    const count = saved.length;
    el.innerText = `${count}/${maxLevels} Níveis ⭐`;
    if (count >= maxLevels) {
        el.style.background = '#064E3B';
        el.style.color = '#34D399';
    } else if (count > 0) {
        el.style.background = '#0C4A6E';
        el.style.color = '#38BDF8';
    }
}

function updateHubProgress() {
    const sem = getLevels('semaforo_levels');
    const tes = getLevels('tesouro_levels');
    const lab = getLevels('labmaker_levels');
    const loo = getLevels('loopmaker_levels');
    const jar = getLevels('jardim_levels');
    const ard = getLevels('arduino_levels');

    setBadge('badge-semaforo', sem);
    setBadge('badge-tesouro', tes);
    setBadge('badge-labmaker', lab);
    setBadge('badge-loopmaker', loo, 4);
    setBadge('badge-jardim', jar, 4);
    setBadge('badge-arduino', ard);

    const totalStars = sem.length + tes.length + lab.length + loo.length + jar.length + ard.length;
    const countEl = document.getElementById('hub-star-count');
    const barEl = document.getElementById('hub-progress-bar');
    if (countEl) countEl.innerText = `${totalStars} / 20 ⭐`;
    if (barEl) barEl.style.width = `${Math.min(100, Math.round((totalStars / 20) * 100))}%`;
}

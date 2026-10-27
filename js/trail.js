/* ==========================================================================
   CRIADORES DE CÓDIGO — TRILHA DE APRENDIZAGEM & HUB DE CONQUISTAS
   ========================================================================== */

const UNLOCKED_LESSONS = 10; // Todas as 10 Aulas liberadas para acesso e exploração completa!

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
        emoji:'🚦', title:'Sequências Temporizadas (Sinais & Cruzamento)', color:'#FBBF24',
        objetivo:'🧠 <b>O que você vai aprender:</b> Como controlar pinos digitais do Arduino com <span style="color:#38BDF8;">digitalWrite(PINO, HIGH/LOW)</span> e temporizar com <span style="color:#FBBF24;">delay(ms)</span> para gerenciar os semáforos da metrópole sem acidentes!',
        teoria:`<b>Operação Trânsito Seguro na Cidade Maker 🏙️🚦</b>

No Arduino real, conectamos cada lâmpada do semáforo a um <b>pino digital</b>.
Para acender ou apagar um LED, usamos a função essencial do Arduino:
• <code>digitalWrite(PINO, HIGH);</code> ➔ Envia <b>5 Volts</b> (LIGA a energia e acende a luz do semáforo!).
• <code>digitalWrite(PINO, LOW);</code> ➔ Corta para <b>0 Volts</b> (DESLIGA a energia e apaga o LED!).

<b>Regras de Tráfego e Temporização:</b>
1️⃣ <b>1 segundo = 1000 milissegundos (ms)</b>: Usamos <code>delay(2000);</code> para manter a pista verde aberta por 2 segundos.
2️⃣ <b>Transição Amarela Obrigatória:</b> Antes de fechar o sinal, acendemos o Amarelo por 1000 ms para os carros desacelerarem.
3️⃣ <b>Fluxos Paralelos:</b> Veículos na mesma avenida em faixas opostas podem andar juntos sem colidir!
4️⃣ <b>Faixa de Pedestres:</b> Quando pedestres atravessam, todos os carros devem esperar no Vermelho!`,
        exemplo:`// 1️⃣ Liga o Verde do Semáforo 1 e avança o Carro Vermelho 🚗
digitalWrite(PIN_SEM1_VERDE, HIGH);
carro1_avancar();
delay(2000);

// 2️⃣ Desliga o Verde e liga o Amarelo de alerta por 1s
digitalWrite(PIN_SEM1_VERDE, LOW);
digitalWrite(PIN_SEM1_AMARELO, HIGH);
delay(1000);

// 3️⃣ Fecha a Avenida no Vermelho e abre a Rua (Semáforo 2)
digitalWrite(PIN_SEM1_AMARELO, LOW);
digitalWrite(PIN_SEM1_VERMELHO, HIGH);
carro1_parar();
digitalWrite(PIN_SEM2_VERMELHO, LOW);
digitalWrite(PIN_SEM2_VERDE, HIGH);
carro2_avancar();
delay(2000);`,
        dica:'💡 Dica Maker: O comando digitalWrite() controla a eletricidade dos pinos! HIGH = 5V (Ligado), LOW = 0V (Desligado). Lembre-se sempre de apagar o LED anterior antes de acender o próximo!',
        jogo:'tab-semaforo', btntext:'🎮 Ir para o Cruzamento & Mini-IDE!'
    },
    5: {
        emoji:'🧮', title:'Variáveis e Tipos de Dados (C/C++ Arduino)', color:'#38BDF8',
        objetivo:'🧠 <b>O que você vai aprender:</b> O que são <b>variáveis</b> — "caixas com nome" na memória RAM do computador para guardar pontos, moedas, temperaturas e textos usando <code>int</code>, <code>float</code>, <code>String</code> e <code>bool</code>!',
        teoria:`<b>Caixinhas de Memória RAM 📦</b>

Imagine que você tem caixas etiquetadas no seu quarto:
- Caixa "Brinquedos" 🧸
- Caixa "Roupas" 👕

No microcontrolador, uma <b>VARIÁVEL</b> é uma caixinha na memória.
Ela tem um <b>TIPO</b> (o que pode guardar dentro), um <b>NOME</b> (etiqueta) e um <b>VALOR</b>:

- <code>int pontos = 10;</code> → Guarda números inteiros (0, 1, 2, 50...)
- <code>float temperatura = 25.5;</code> → Guarda números com vírgula/ponto
- <code>String piloto = "Maker";</code> → Guarda palavras e textos entre aspas
- <code>bool motorLigado = true;</code> → Guarda verdadeiro (true) ou falso (false)`,
        exemplo:`<span class="c-tp">int</span> <span class="c-var">moedasColetadas</span> = <span class="c-num">0</span>;
<span class="c-var">moedasColetadas</span> = <span class="c-var">moedasColetadas</span> + <span class="c-num">1</span>; <span class="c-cm">// Coletou 1 moeda!</span>
<span class="c-tp">float</span> <span class="c-var">temperatura</span> = <span class="c-num">26.5</span>;
<span class="c-tp">String</span> <span class="c-var">status</span> = <span class="c-str">"OK"</span>;
<span class="c-tp">bool</span> <span class="c-var">cofreAberto</span> = <span class="c-bool">true</span>;`,
        dica:'💡 Dica Maker: O sinal = significa GUARDAR na caixa! Sempre termine a linha com ponto e vírgula (;).',
        jogo:'tab-variaveis', btntext:'🎮 Ir para o Laboratório de Variáveis!'
    },
    6: {
        emoji:'⚡', title:'Introdução à Eletrônica (Positivo, Negativo & Lei de Ohm)', color:'#F87171',
        objetivo:'🧠 <b>O que você vai aprender:</b> O básico que todo maker precisa saber: o que é <b>Positivo (+)</b> e <b>Negativo (-)</b>, onde eles ficam no Arduino (o pino <b>5V</b> e o <b>GND</b>), e a divertida <b>analogia do cano d\'água</b> para entender por que usamos o resistor protetor de <b>220 Ω</b> para não queimar o LED!',
        teoria:`<b>1. O Segredo da Energia: Positivo (+) e Negativo (-) 🔋</b>
Toda pilha, bateria e placa eletrônica tem DOIS lados: o <b>Pólo Positivo (+)</b> e o <b>Pólo Negativo (-)</b>.
Para uma lâmpada ou LED acender, a eletricidade precisa fazer uma <b>viagem completa em círculo</b> (um circuito fechado!). Ela sai do positivo, passa pela peça e volta para o negativo. Se um fio se soltar, a viagem é interrompida e nada acende!

<b>2. Na Placa Arduino: Quem é quem? 🔌</b>
- <b>Pino 5V:</b> É o lado <b>Positivo (+)</b>! De onde a energia sai com 5 Volts de força. (E quando você liga um pino digital, como o Pino 9 com HIGH, ele também manda 5V!).
- <b>Pino GND (Ground / Terra):</b> É o lado <b>Negativo (-)</b>! É o ponto zero (0V) por onde a energia completa a volta.
- <b>E o LED?</b> Ele também tem lado! A perninha <b>mais longa</b> é o Positivo (+) e a perninha <b>mais curta</b> é o Negativo (-). Se ligar invertido, ele não acende.

<b>3. A Grande Analogia do Cano d'Água 🚰</b>
Para entender eletricidade, imagine uma mangueira de água:
- <b>Tensão (5V em Volts):</b> É a <b>pressão da água</b>! Uma caixa d'água alta empurrando tudo com força.
- <b>Corrente (em mA):</b> É o <b>fluxo da água</b>! A quantidade de água correndo pelo tubo.
- <b>Resistência (em Ohms Ω):</b> É o <b>estreitamento do cano</b> ou uma torneira reguladora!

<b>4. Por que precisamos do Resistor de 220 Ω? 🛡️</b>
O LED é delicado! Se você ligar ele direto no 5V sem resistor, a água vem com tanta pressão e força que o LED <b>ESTOURA (queima)</b> em um piscar de olhos!
O resistor de <b>220 Ω</b> é a nossa "torneirinha mágica": ele aperta o cano na medida certa, deixando passar apenas <b>15 mA</b> de corrente. Assim o LED brilha forte, lindo e 100% seguro!`,
        exemplo:`<span class="c-cm">// Pisca-Pisca Seguro: 5V (HIGH) e 0V (LOW)</span>
<span class="c-kw">const</span> <span class="c-tp">int</span> pinoLed = <span class="c-num">9</span>;

<span class="c-kw">void</span> <span class="c-fn">setup</span>() {
  <span class="c-fn">pinMode</span>(pinoLed, <span class="c-kw">OUTPUT</span>); <span class="c-cm">// Pino 9 vira saída de energia</span>
}

<span class="c-kw">void</span> <span class="c-fn">loop</span>() {
  <span class="c-fn">digitalWrite</span>(pinoLed, <span class="c-kw">HIGH</span>); <span class="c-cm">// Manda 5V (Positivo): LED acende!</span>
  <span class="c-fn">delay</span>(<span class="c-num">1000</span>);                 <span class="c-cm">// Espera 1 segundo</span>
  <span class="c-fn">digitalWrite</span>(pinoLed, <span class="c-kw">LOW</span>);  <span class="c-cm">// Desliga para 0V (GND): LED apaga!</span>
  <span class="c-fn">delay</span>(<span class="c-num">1000</span>);                 <span class="c-cm">// Espera 1 segundo</span>
}`,
        dica:'💡 Dica Maker de Ouro: Sempre coloque um resistor de 220 Ω no caminho do LED antes de ligar no Arduino para não queimar!',
        jogo:'tab-eletronica', btntext:'⚡ Explorar o Laboratório de Eletrônica!'
    },
    7: {
        emoji:'🔌', title:'Circuitos & Protoboard (Montagem do Semáforo)', color:'#38BDF8',
        objetivo:'🧠 <b>O que você vai aprender:</b> Como montar na prática um <b>Semáforo de 3 LEDs</b> na <b>Protoboard de 30 Pinos</b> com <b>3 Resistores de 300Ω</b> e o <b>Arduino UNO</b>, aprendendo a regra de ouro das conexões e a polaridade correta!',
        teoria:`<b>Bem-vindo à Bancada Maker! 🛠️🚦</b>

Hoje você vai colocar a mão na massa no seu kit físico real!
Vamos montar o circuito do <b>Semáforo com 3 LEDs (Vermelho, Amarelo e Verde)</b> que cada um acende de forma independente!

<b>1. O que é a Protoboard? 🧱</b>
Uma placa mágica com centenas de furos onde encaixamos peças sem precisar de solda!
- <b>Colunas de A a E e de F a J (Pinos 1 a 30):</b> São trilhos metálicos verticais escondidos. Todos os 5 furos na mesma coluna estão conectados entre si!
- <b>Calha Central:</b> O sulco no meio que isola os dois lados.
- <b>Barramentos (+ e -):</b> As linhas horizontais azuis (-) e vermelhas (+) para espalhar o GND (Terra) e 5V.

<b>2. O Segredo dos Resistores: TEM LADO? 🛡️</b>
<b>NÃO! O resistor não tem polaridade!</b> Tanto faz qual lado você liga no positivo ou no negativo! Ele protege o LED dos dois jeitos. Usamos resistores de <b>300 Ω</b> (Laranja, Preto, Marrom) ou <b>220 Ω</b>.

<b>3. E os LEDs? CUIDADO MÁXIMO COM O LADO! 🚦</b>
O LED <b>TEM POLARIDADE</b> obrigatória:
• <b>Perna LONGA (Ânodo +):</b> Recebe o sinal positivo vindo do pino do Arduino.
• <b>Perna CURTA (Cátodo -):</b> Conecta no resistor de proteção para voltar ao GND!

<b>4. Conectando ao Arduino UNO 🤖</b>
Usamos jumpers macho-macho para ligar o <b>Pino 13</b> no Vermelho, <b>Pino 12</b> no Amarelo, <b>Pino 11</b> no Verde e o <b>GND</b> no barramento negativo da protoboard!`,
        exemplo:`// Mapeamento dos pinos do Semáforo no Arduino UNO:
Pino Digital 13 ➔ LED Vermelho (Ânodo +)
Pino Digital 12 ➔ LED Amarelo  (Ânodo +)
Pino Digital 11 ➔ LED Verde    (Ânodo +)
GND (Terra 0V)  ➔ Barramento Azul (-) ➔ Resistores de 300Ω ➔ Cátodos (-)`,
        dica:'💡 Dica Maker de Ouro: Nunca encaixe as duas pernas de uma mesma peça na mesma coluna! Cada coluna é um fio só!',
        jogo:'tab-labmaker', btntext:'🔌 Abrir Bancada da Protoboard!'
    },
    8: {
        emoji:'🤖', title:'Arduino IDE, Drivers & Conexão', color:'#F87171',
        objetivo:'🧠 <b>O que você vai aprender:</b> Como instalar gratuitamente a <b>Arduino IDE</b> (clicando em <i>JUST DOWNLOAD</i>), como conectar o cabo USB e reconhecer o <b>Driver / Porta COMx</b>, como configurar a placa no menu <b>Ferramentas</b>, como enviar o código e como <b>zerar as configurações</b> do Arduino com o <i>BareMinimum</i>!',
        teoria:`<b>1. Baixando e Instalando a Arduino IDE 💻</b>
A Arduino IDE é o programa oficial e gratuito (open source) onde escrevemos os códigos para o Arduino.
- Acesse <b>www.arduino.cc</b> e vá na aba de Downloads.
- Uma tela de contribuição voluntária aparecerá: <b>não é obrigatório doar!</b> Basta clicar no botão <b>"JUST DOWNLOAD"</b> para baixar 100% de graça!

<b>2. O Cabo USB e o Driver da Placa 🔌</b>
Ao conectar o cabo USB do kit no computador, o sistema cria uma <b>Porta Serial de Comunicação (COMx)</b>:
- <b>No Windows:</b> Você pode conferir no <i>Gerenciador de Dispositivos</i> > <i>Portas (COM e LPT)</i> (ex: COM3, COM4).
- <b>No Mac:</b> A porta tem o formato <code>/dev/cu.usbserial-*</code> ou <code>/dev/cu.usbmodem*</code>.
- Placas com chip CH340 ou BlackBoard utilizam o driver USB-Serial padrão do fabricante.

<b>3. Conectando a IDE ao Arduino ⚙️</b>
Para o computador conseguir falar com a placa, precisamos indicar 2 coisas no menu da IDE:
1️⃣ <b>Menu Ferramentas > Placa:</b> Selecione <b>Arduino Uno</b> (mesmo para placas BlackBoard Uno!).
2️⃣ <b>Menu Ferramentas > Porta:</b> Marque a sua porta serial (ex: <b>COM3</b>).

<b>4. Enviando o Código (Upload) 🚀</b>
- Clique no botão <b>✔ Verificar</b> para checar erros de digitação.
- Clique no botão <b>➔ Carregar (Upload)</b>: os LEDs TX e RX da placa piscarão rapidamente transmitindo os dados!

<b>5. Como "Zerar" o Arduino 🔄</b>
O Arduino não tem tela: ele guarda o último código na memória Flash e roda sempre que é ligado na tomada!
Para "zerar" a placa e deixá-la sem fazer nada:
- Abra o menu: <i>Arquivo > Exemplos > 01.Basics > BareMinimum</i> (código em branco com <code>setup()</code> e <code>loop()</code> vazios).
- Clique em <b>➔ Carregar</b>. Pronto! A placa agora está zerada e limpa!`,
        exemplo:`// Código em branco para zerar o Arduino (BareMinimum):
void setup() {
  // Configurações vazias - placa neutra
}

void loop() {
  // Laço vazio - placa em repouso
}`,
        dica:'💡 Dica Maker: Se a IDE der erro de comunicação ao carregar (stk500), confira se a Porta COM certa está marcada no menu Ferramentas > Porta!',
        jogo:'tab-arduino', btntext:'🎮 Abrir Laboratório da IDE & Drivers!'
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
                       getLevels('jardim_levels').length + getLevels('arduino_levels').length +
                       getLevels('variaveis_levels').length + getLevels('eletronica_levels').length;

    const percent = Math.min(100, Math.round((totalStars / 36) * 100));
    const starCountEl = document.getElementById('trail-star-count');
    const progressBarEl = document.getElementById('trail-progress-bar');
    if (starCountEl) starCountEl.innerText = `${totalStars} / 36 ⭐`;
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
        if (typeof playSound === 'function') playSound('error');
        alert('🔒 Esta aula ainda não foi liberada!');
        return;
    }

    const modalBox = document.getElementById('lesson-modal-box');
    if (!modalBox) return;

    modalBox.innerHTML = `
        <button class="lesson-close" onclick="closeLessonModal()" title="Fechar janela">✕</button>
        <div class="lesson-modal-header">
            <div class="lesson-modal-emoji">${lesson.emoji}</div>
            <div class="lesson-modal-title-group">
                <div class="lesson-modal-badge-aula">Trilha de Robótica & Arduino • Aula ${lessonNum}</div>
                <h2>${lesson.title}</h2>
            </div>
        </div>
        <div class="lesson-objetivo">${lesson.objetivo}</div>
        <div class="lesson-modal-body-grid">
            <div class="lesson-teoria">
                <h4><i class="fa-solid fa-book-open"></i> Explicação Didática</h4>
                <div class="lesson-teoria-content">${lesson.teoria.replace(/\n/g, '<br>')}</div>
            </div>
            <div class="lesson-exemplo-col">
                <div class="lesson-exemplo">
                    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;padding-bottom:6px;border-bottom:1px solid #1E293B;">
                        <span style="color:#94A3B8;font-size:0.75rem;font-weight:800;font-family:'Fira Code',monospace;"><i class="fa-solid fa-code"></i> Código C/C++ (Arduino)</span>
                        <span style="background:rgba(56,189,248,0.15);color:#38BDF8;padding:2px 8px;border-radius:6px;font-size:0.72rem;font-weight:800;font-family:'Fira Code',monospace;border:1px solid rgba(56,189,248,0.3);">exemplo.ino</span>
                    </div>
                    <code>${lesson.exemplo}</code>
                </div>
                <div class="lesson-dica">${lesson.dica}</div>
            </div>
        </div>
        <div class="lesson-modal-footer">
            <button class="lesson-btn" onclick="closeLessonModal(); openTab('${lesson.jogo}');">
                ${lesson.btntext} <i class="fa-solid fa-arrow-right" style="margin-left:8px;"></i>
            </button>
        </div>
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
    const vars = getLevels('variaveis_levels');
    const elet = getLevels('eletronica_levels');

    setBadge('badge-semaforo', sem, 5);
    setBadge('badge-tesouro', tes);
    setBadge('badge-labmaker', lab);
    setBadge('badge-loopmaker', loo, 4);
    setBadge('badge-jardim', jar, 4);
    if (typeof UNLOCKED_LESSONS !== 'undefined' && UNLOCKED_LESSONS < 8) {
        const ardBadge = document.getElementById('badge-arduino');
        if (ardBadge) {
            ardBadge.innerText = '🔒 Trancada (Aula 8)';
            ardBadge.style.background = '#1E293B';
            ardBadge.style.color = '#94A3B8';
            ardBadge.style.border = '1px dashed #475569';
        }
    } else {
        setBadge('badge-arduino', ard);
    }
    setBadge('badge-variaveis', vars, 8);
    setBadge('badge-eletronica', elet, 6);

    const totalStars = sem.length + tes.length + lab.length + loo.length + jar.length + ard.length + vars.length + elet.length;
    const countEl = document.getElementById('hub-star-count');
    const barEl = document.getElementById('hub-progress-bar');
    if (countEl) countEl.innerText = `${totalStars} / 36 ⭐`;
    if (barEl) barEl.style.width = `${Math.min(100, Math.round((totalStars / 36) * 100))}%`;

    const lbBadge = document.getElementById('badge-hub-leaderboard');
    if (lbBadge && window.makerLeaderboard && typeof window.makerLeaderboard.getSummaryStats === 'function') {
        const stats = window.makerLeaderboard.getSummaryStats();
        lbBadge.innerText = stats.userRecords > 0 ? `👑 ${stats.userRecords} Recordes ⚡` : `⚡ 36 Fases Speedrun`;
    }
}

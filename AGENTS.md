# AGENTS.md — Diretrizes e Contexto do Projeto "Criadores de Código"

Este arquivo serve de guia para modelos de IA e desenvolvedores que atuam no projeto **Criadores de Código — Laboratório Maker**.

---

## 🎯 1. Visão Geral do Projeto
* **Nome:** Criadores de Código — Laboratório Maker de Robótica & Arduino
* **Objetivo:** Plataforma educacional interativa (SPA) para ensinar lógica de programação, circuitos elétricos, protoboard e microcontroladores (Arduino UNO) para crianças e jovens estudantes.
* **Arquivo Principal:** [`laboratorio-maker.html`](./laboratorio-maker.html)
* **Design/UI:** Tema escuro espacial com acentos em cores vibrantes, fontes `Fredoka One` e `Nunito`, ícones FontAwesome e micro-interações táteis.

---

## 🏗️ 2. Arquitetura Técnica
A aplicação é construída como uma **Single-Page Application (SPA)** autocontida em JavaScript Vanilla, HTML5 e CSS3:

1. **Sem Dependências de Compilação:** Não requer Node.js, Webpack ou bundlers para execução — basta abrir o arquivo HTML no navegador.
2. **Sistema de Som Sintetizado:** Utiliza a **Web Audio API** nativa (`AudioContext`) na função `playSound(type)` com osciladores senoidais e dente de serra para gerar efeitos sonoros (`success`, `error`, `click`, `step`).
3. **Persistência de Dados (`localStorage`):**
   * Chaves utilizadas:
     * `semaforo_levels` (Array de números: ex. `[1, 2, 3]`)
     * `tesouro_levels`
     * `labmaker_levels`
     * `loopmaker_levels`
     * `jardim_levels`
     * `arduino_levels`
   * Total de estrelas: 18 estrelas (3 por módulo).
4. **Camadas Gráficas & Simulação:**
   * Simulador de Protoboard: Renderizado via DOM + camada SVG dinâmica (`.bb-svg-layer`) para traçado de fios jumpers, resistores e checagem de circuito fechado (+5V -> Resistor -> LED -> GND).
   * Matriz 2D/3D (Tesouro): Grid dinâmico com obstáculos, escadas, moedas e colisão.
   * Modulação PWM & Lei de Ohm: Cálculos reativos em tempo real via sliders e eventos de input.

---

## 🗺️ 3. Estrutura Pedagógica (10 Aulas)

1. **Aula 1 — Algoritmos e Sequências:** Introdução a comandos ordenados passo a passo (Módulo: *Caça ao Tesouro*).
2. **Aula 2 — Estruturas de Repetição (Loops):** Laços `for`, automação de tarefas repetitivas (Módulo: *Máquina de Loops*).
3. **Aula 3 — Condicionais (Decisões):** Estruturas `if/else` com base em leituras e sensores (Módulo: *Jardim dos Loops*).
4. **Aula 4 — Sequências Temporizadas:** Controle de tempo e `delay()` em milissegundos (Módulo: *Semáforo Digital*).
5. **Aula 5 — Variáveis e Tipos de Dados:** Tipos `int`, `float`, `String`, `bool` e gerenciamento de estados (Módulo: *Caça ao Tesouro Nível 3*).
6. **Aula 6 — Introdução à Eletrônica:** Tensão ($V$), Corrente ($I$), Resistência ($R$) e Lei de Ohm ($V = R \cdot I$) (Módulo: *Laboratório Maker — Teoria*).
7. **Aula 7 — Circuitos e Protoboard:** Barramentos de alimentação, colunas interligadas e polaridade de componentes (Módulo: *Laboratório Maker — Bancada*).
8. **Aula 8 — Arduino e Linguagem C++:** Anatomia da placa UNO, pinos digitais/analógicos/PWM, funções `setup()` e `loop()` (Módulo: *Oficina do Arduino & Quiz*).
9. **Aula 9 — Prática: Montagem do Semáforo:** Guia físico de montagem com protoboard real, 3 LEDs, 3 resistores de 220Ω e Arduino UNO (Módulo: `#tab-aula9`).
10. **Aula 10 — Prática: Programação do Semáforo:** Código fonte Arduino C++ completo, configuração no Arduino IDE e processo de upload (Módulo: `#tab-aula10`).

---

## 🛠️ 4. Padrões de Código e Convenções

Ao estender ou modificar o projeto:
* **Manter o padrão autocontido:** Evitar adicionar dependências de NPM ou frameworks pesados caso o objetivo seja manter a facilidade de distribuição em arquivo único.
* **Carregamento Sob Demanda (*Lazy Loading*):** Os módulos de jogos são inicializados apenas quando sua respectiva aba é aberta (`loadSemaforo()`, `loadTesouro()`, `loadLabmaker()`, etc.), marcando elementos com id `[nome]-loaded` para evitar re-renderizações desnecessárias.
* **Controle de Acesso da Trilha:** A constante `UNLOCKED_LESSONS` (linha 740 de `laboratorio-maker.html`) define quantas aulas estão liberadas para o usuário.
* **Acessibilidade e Feedback Lúdico:** Todas as interações devem ter feedback sonoro (`playSound`) e visual claro (cores `#38BDF8`, `#10B981`, `#FBBF24`, `#EF4444`).

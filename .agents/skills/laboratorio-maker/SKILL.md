---
name: laboratorio-maker
description: >-
  Guia e toolkit de desenvolvimento para a plataforma educacional "Criadores de Código — Laboratório Maker de Robótica & Arduino".
  Use esta skill quando precisar entender a arquitetura do projeto, adicionar ou modificar aulas na trilha pedagógica,
  criar novos mini-jogos ou simuladores de circuitos, manipular a bancada de protoboard virtual, estender o quiz de C++
  ou ajustar a persistência e gamificação do curso.
---

# Skill: Laboratório Maker — Criadores de Código

Esta skill fornece instruções técnicas completas e boas práticas para manutenção, extensão e criação de novos módulos pedagógicos na plataforma **Criadores de Código**.

---

## 📂 1. Estrutura do Projeto

* `laboratorio-maker.html`: Arquivo principal da aplicação contendo estrutura de abas, estilos CSS, sistema de áudio, trilha de aprendizagem e os loaders dos 6 simuladores interativos.
* `index.html`: Cópia espelho para publicação nativa no GitHub Pages.
* `bg_jardim.png`: Imagem de fundo do simulador "Jardim dos Loops" (robô agrícola e canteiros).
* `bg_semaforo.png`: Imagem de fundo do simulador "Semáforo Digital" (cruzamento e faixa de pedestres).
* `bg_tesouro.png`: Imagem de fundo do simulador "Caça ao Tesouro" (grid matricial).
* `AGENTS.md`: Diretrizes e regras globais do projeto.

---

## ⚙️ 2. Arquitetura dos Módulos Interativos

Todos os simuladores seguem o padrão de injeção dinâmica no DOM:

```javascript
function loadNovoModulo() {
    const container = document.getElementById('novo-modulo-container');
    if (document.getElementById('novo-modulo-loaded')) return;
    
    container.innerHTML = `
        <div id="novo-modulo-loaded">
            <!-- Estilos Scoped e Estrutura HTML -->
        </div>
    `;
    
    // Inicialização da lógica e eventos do jogo
}
```

### 🎮 Padrão de Gamificação e Conclusão de Níveis
Cada jogo salva os níveis concluídos em um array no `localStorage`:

```javascript
function completeLevel(levelNumber) {
    playSound('success');
    triggerConfetti(3500);
    const storageKey = 'meumodulo_levels';
    let levels = JSON.parse(localStorage.getItem(storageKey) || '[]');
    if (!levels.includes(levelNumber)) {
        levels.push(levelNumber);
        localStorage.setItem(storageKey, JSON.stringify(levels));
    }
    updateHubProgress();
    updateTrail();
}
```

---

## 💻 3. Mini-IDE de C / C++ (`loadLoopmaker`)

O módulo da Aula 2 ensina repetição utilizando **Linguagem C / C++** (mesma do Arduino) com andaimento pedagógico em 3 níveis (Scaffolding):

1. **Nível 1 (Fábrica):** Esteira com braço carimbador e visualização intuitiva de `for (int i = 1; i <= 5; i++) { carimbarCaixa(); }`.
2. **Nível 2 (Lacunas em C):** O robô navega no grid e o aluno completa as lacunas numéricas e comandos (`for (int i = 0; i < [ 4 ]; i++) { [ direita(); ] }`).
3. **Nível 3 (Mini-IDE Livre em C):** Editor completo com numeração de linhas, teclado de atalhos rápidos (`+ for(int i=0; i<N; i++)`, `+ direita()`, `+ baixo()`), parser sintático amigável de C e simulação no grid.

### Sintaxe de C / C++ Suportada:
```c
for (int i = 0; i < 4; i++) {
    direita();
}
for (int i = 0; i < 3; i++) {
    baixo();
}
```

---

## 🔌 4. Simulador de Protoboard Virtual (`loadLabmaker`)

O simulador de protoboard utiliza coordenadas de barramentos e colunas da matriz:
* **Barramentos de Alimentação:** Superior e inferior com linhas `+5V` (vermelho) e `GND` (azul).
* **Calha Central:** Isola as colunas `A-E` das colunas `F-J`.
* **Traçado de Conexões:** Camada SVG dinâmica (`<svg class="bb-svg-layer">`) com elementos `<path>` e `<line>`.
* **Validação de Circuito:** Verifica se a corrente flui do terminal positivo (+5V) através de um resistor limitador até o anodo do LED, saindo pelo catodo em direção ao GND. Se o LED for ligado diretamente sem resistor, dispara evento de sobrecorrente ("LED queimado").

---

## 🎉 5. Efeitos Visuais & Splash de Erro

* **`triggerConfetti(durationMs)`**: Engine de partículas em Canvas nativo (`#fx-canvas`) que dispara explosões de confetes coloridos ao concluir desafios.
* **`triggerErrorSplash(title, message, hint, icon)`**: Pop-up animado (`#error-splash-modal`) com efeito de tremor, som de erro sintetizado e dicas carinhosas para a criança aprender com as falhas.

---

## 🔊 6. Efeitos Sonoros com Web Audio API

Use a função nativa `playSound(type)` para fornecer feedback auditivo:
* `playSound('success')`: Tocar ao acertar um passo, desbloquear uma estrela ou concluir um nível.
* `playSound('error')`: Tocar em erros de sintaxe, batidas em obstáculos ou conexões elétricas erradas.
* `playSound('click')`: Tocar em cliques de botões e seleção de componentes.
* `playSound('step')`: Tocar em movimentos do robô ou avanço na esteira.


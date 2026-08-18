# 🤖 Criadores de Código — Laboratório Maker de Robótica & Arduino

Uma plataforma educacional interativa, visual e gamificada desenvolvida para ensinar **Lógica de Programação, Eletrônica Básica e Programação Arduino com C++** para estudantes e iniciantes.

---

## 🌟 Funcionalidades Principais

* **🗺️ Trilha Pedagógica em 10 Aulas:** Do pensamento algorítmico à montagem de circuitos e programação no Arduino IDE.
* **🎮 6 Módulos & Mini-jogos Interativos:**
  1. **🚦 Semáforo Digital:** Lógica sequencial, estados e controle de `delay()`.
  2. **🤖 Caça ao Tesouro:** Navegação e algoritmos em grid 2D/3D com desvio de obstáculos.
  3. **🔬 Laboratório Maker:** Teoria da Lei de Ohm, código de cores de resistores e simulador de Protoboard virtual interativa com verificação de curto e queima de LEDs.
  4. **🔄 Máquina de Loops:** Automação com laços de repetição `for` e `while`.
  5. **🌱 Jardim dos Loops:** Tomada de decisão e estruturas condicionais `if/else` aplicadas à robótica agrícola.
  6. **🛠️ Oficina do Arduino:** Pinout interativo da placa UNO, modulação PWM, cálculo de resistores e Quiz de C++.
* **🏆 Gamificação & Certificado Maker:** Sistema de 18 estrelas ⭐ persistidas via `localStorage` com gerador de Certificado para impressão e download em PDF.
* **🔊 Áudio Procedural Integrado:** Sintetizador sonoro leve utilizando a Web Audio API nativa (sem dependências de arquivos de mídia externos).

---

## 🚀 Como Executar

Não é necessário instalar Node.js ou servidores complexos. Basta abrir o arquivo [`laboratorio-maker.html`](./laboratorio-maker.html) em qualquer navegador moderno (Chrome, Edge, Firefox, Safari):

```bash
# macOS
open laboratorio-maker.html

# Linux
xdg-open laboratorio-maker.html

# Windows
start laboratorio-maker.html
```

---

## 📁 Estrutura de Arquivos

```text
├── AGENTS.md                          # Diretrizes para modelos de IA e contexto de desenvolvimento
├── README.md                          # Documentação do projeto
├── laboratorio-maker.html             # Aplicação completa (SPA autocontida)
├── bg_jardim.png                      # Cenário do Jardim dos Loops
├── bg_semaforo.png                    # Cenário do Semáforo
├── bg_tesouro.png                     # Cenário da Caça ao Tesouro
└── .agents/
    └── skills/
        └── laboratorio-maker/
            └── SKILL.md               # Skill pronta para agentes de IA entenderem e expandirem o projeto
```

---

## 🤖 Uso com Agentes de IA e Antigravity

O projeto conta com uma skill nativa configurada em [`.agents/skills/laboratorio-maker/SKILL.md`](./.agents/skills/laboratorio-maker/SKILL.md) e diretrizes em [`AGENTS.md`](./AGENTS.md). 
Qualquer agente que abrir este repositório saberá automaticamente como estender a trilha de aulas, criar novos simuladores ou ajustar a lógica dos circuitos elétricos.

# 🍅 Tomate — Pomodoro de bolso

Um aplicativo web de foco baseado na técnica Pomodoro, com cronômetro de precisão, ciclos inteligentes de pausa e estatísticas diárias — tudo salvo localmente no navegador.

![Tecnologias](https://img.shields.io/badge/React-18-61dafb?style=flat-square) ![Vite](https://img.shields.io/badge/Vite-6-646cff?style=flat-square) ![Tailwind](https://img.shields.io/badge/Tailwind-4-38bdf8?style=flat-square) ![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178c6?style=flat-square)

---

## ✨ O que o Tomate faz

### ⏱️ Timer Pomodoro completo

- **Três modos de tempo:** Foco, Pausa curta e Pausa longa, cada um com sua própria cor que atravessa toda a interface.
- **Controles essenciais:** iniciar, pausar, continuar, reiniciar e pular para a próxima fase do ciclo.
- **Anel de progresso em tempo real** com marcações de relógio e contagem regressiva monoespaçada.
- **Atalhos de teclado:**
  - `Espaço` — iniciar / pausar
  - `R` — reiniciar o timer
  - `Esc` — fechar a gaveta de ajustes

### 🔁 Ciclo inteligente

- Progressão automática: **Foco → Pausa curta → … → Pausa longa** a cada *N* pomodoros (configurável de 2 a 8).
- Pontos indicadores mostram o ritmo do ciclo atual.
- Opção de **encadeamento automático** de sessões.
- Som de conclusão (Web Audio API, sem arquivos externos), com toggle de mudo.
- O título da aba mostra o tempo restante enquanto o timer roda.

### 📊 Estatísticas de hoje

- **Tempo total em foco** do dia, contado ao vivo — inclusive durante a sessão em andamento.
- **Pomodoros concluídos** vs. meta diária, com barra de progresso.
- **Lista de sessões** com horário e duração de cada pomodoro.
- **Gráfico dos últimos 7 dias** de foco (barras proporcionais).
- Botão para zerar as estatísticas do dia.
- Meta atingida dispara notificação (toast) + som.

### ⚙️ Durações personalizadas

Gaveta lateral de ajustes com steppers para:

| Ajuste          | Faixa   | Padrão |
| --------------- | ------- | ------ |
| Duração do foco | 5–90 min| 25 min |
| Pausa curta     | 1–30 min| 5 min  |
| Pausa longa     | 5–60 min| 15 min |
| Pausa longa a cada | 2–8 pomos | 4  |
| Meta diária     | 1–20 pomos | 8   |

Tudo é salvo automaticamente no navegador via **localStorage** — configurações, histórico de sessões e estatísticas sobrevivem a recarregamentos da página.

---

## 🚀 Como executar

### Pré-requisitos

- [Node.js](https://nodejs.org/) **18+**
- npm (vem junto com o Node)

### Instalação

```bash
# 1. Clone o repositório
git clone <url-do-repositorio>
cd tomate

# 2. Instale as dependências
npm install
```

### Desenvolvimento

```bash
npm run dev
```

Abra o endereço exibido no terminal (geralmente `http://localhost:5173`).
Alterações no código são refletidas instantaneamente (HMR).

### Build de produção

```bash
npm run build
```

Os arquivos otimizados são gerados na pasta `dist/`. Para pré-visualizar o build:

```bash
npm run preview
```

### Verificação de tipos

```bash
npm run typecheck
```

---

## 🗂️ Estrutura do projeto

```
src/
├── App.tsx                      # Layout principal, abas de modo, toast, atalhos
├── main.tsx                     # Bootstrap do React
├── index.css                    # Tema (cores, fontes), animações, grão
├── hooks/
│   └── usePomodoro.ts           # Motor do timer, ciclo, estatísticas, localStorage
├── lib/
│   ├── types.ts                 # Tipos, configurações padrão, formatação de tempo
│   └── sound.ts                 # Carrilhões via Web Audio API
└── components/
    ├── TimerRing.tsx            # Anel SVG, contagem regressiva, controles
    ├── StatsPanel.tsx           # Hoje, gráfico de 7 dias, lista de sessões
    ├── SettingsDrawer.tsx       # Gaveta de ajustes com steppers e toggles
    └── icons.tsx                # Ícones SVG customizados (inline)
```

---

## 💾 Onde os dados ficam

| Chave do localStorage   | Conteúdo                                        |
| ----------------------- | ----------------------------------------------- |
| `tomate:settings:v1`    | Durações, meta diária, som, encadeamento        |
| `tomate:stats:v1`       | Pomodoros, segundos de foco e sessões por dia   |

O histórico é automaticamente limitado aos últimos 30 dias.

---

## 🎨 Stack técnica

- **React 18** + **TypeScript** — interface e tipos
- **Vite** — build tool e dev server
- **Tailwind CSS v4** — tema e utilitários
- **Web Audio API** — sons de conclusão sem dependências
- **localStorage** — persistência de configurações e estatísticas

---

## 📄 Licença

Projeto livre para uso e estudo.

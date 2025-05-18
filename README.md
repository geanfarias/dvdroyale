# DVD Royale

**DVD Royale** é um jogo multiplayer inspirado na clássica tela de descanso dos DVDs antigos, desenvolvido para um hackathon de ideias inúteis. O objetivo é proporcionar diversão nostálgica, com uma pitada de competição, utilizando tecnologias web modernas e uma arquitetura simples, porém robusta.

---

## Índice

- [Descrição](#descrição)
- [Funcionalidades](#funcionalidades)
- [Arquitetura do Projeto](#arquitetura-do-projeto)
- [Como Rodar o Projeto](#como-rodar-o-projeto)
- [Estrutura de Pastas](#estrutura-de-pastas)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Contribuição](#contribuição)
- [Licença](#licença)

---

## Descrição

O DVD Royale simula a famosa animação do logo de DVD quicando pelas bordas da tela, mas com um diferencial: cada jogador controla seu próprio logo em tempo real, competindo por pontos ao bater nas paredes e cantos. O sistema utiliza WebSockets para comunicação em tempo real entre os jogadores e o servidor.

---

## Funcionalidades

- **Animação fiel** ao screensaver de DVD, com colisão nas bordas e mudança de cor.
- **Multiplayer em tempo real**: cada jogador possui seu próprio logo na sala.
- **Sistema de salas**: crie ou entre em salas para jogar com amigos.
- **Pontuação**: ganhe pontos ao bater nas paredes e ainda mais ao acertar os cantos.
- **Ranking**: acompanhe a pontuação dos jogadores.
- **Interface intuitiva** e responsiva.
- **Toasts** e feedbacks visuais para ações especiais.

---

## Arquitetura do Projeto

O projeto é dividido em duas partes principais:

- **Front-end**: HTML, CSS e JavaScript puro, responsável pela interface, animação dos logos e interação com o usuário.
- **Back-end**: Node.js com Express e Socket.IO, responsável pela lógica do jogo, gerenciamento das salas, jogadores e comunicação em tempo real.

---

## Como Rodar o Projeto

### Pré-requisitos

- [Node.js](https://nodejs.org/) (v16+)
- [npm](https://www.npmjs.com/)

### Instalação

1. **Clone o repositório:**

```sh
git clone https://github.com/seu-usuario/dvdroyale.git
cd dvdroyale
```

2. **Instale as depências do servidor:**

```bash
cd server
npm install
```

3. **Instale as dependências do front-end (opcional, para tinycolor2):**

```bash
cd ../front
npm install
```

4. **Compile o back-end:**

```bash
cd ../server
npm run build
```

5. **Inicie o servidor:**

```bash
npm start
```

6. **Acesse o front-end:**
   Abra front/index.html ou acesse via navegador em http://localhost:3000 (dependendo da configuração do servidor).

### Estrutura de Pastas

### Estrutura de Pastas

```plaintext
dvdroyale/
│
├── front/           # Front-end (HTML, CSS, JS)
│   ├── public/      # Arquivos públicos e imagens
│   ├── login/       # Tela de login
│   ├── ranking/     # Tela de ranking
│   ├── salas/       # Tela de salas
│   └── ...
│
├── server/          # Back-end (Node.js, Express, Socket.IO)
│   ├── src/
│   │   ├── websocket/   # Lógica do jogo e sockets
│   │   ├── routes/      # Rotas REST
│   │   ├── model/       # Modelos Sequelize
│   │   └── ...
│   ├── public/      # Arquivos públicos do servidor
│   └── ...
│
├── inspiration/     # Protótipos e experimentos de animação
└── README.md        # Este arquivo
```

### Tecnologias Utilizadas

Front-end: HTML5, CSS3, JavaScript (ES6+)
Back-end: Node.js, Express, Socket.IO, Sequelize (SQLite)
Outros: TinyColor2 (para manipulação de cores), UUID

### Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou pull requests.

Fork este repositório
Crie uma branch (git checkout -b feature/nova-feature)
Commit suas alterações (git commit -am 'Adiciona nova feature')
Push para a branch (git push origin feature/nova-feature)
Abra um Pull Request

### Licença

Este projeto é licenciado sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

Feito com nostalgia e criatividade para o Hackathon de Ideias Inúteis.
Sinta-se à vontade para personalizar o texto conforme desejar!

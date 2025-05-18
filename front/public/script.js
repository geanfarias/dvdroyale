import { increaseSpeed, decreaseSpeed } from "./speed.js";
// import tinycolor from "tinycolor2";

const container = document.querySelector(".container");
const containerRect = container.getBoundingClientRect();
const speedSlider = document.getElementById("speedSlider");
const speedValue = document.getElementById("speedValue");
const speedUpButton = document.getElementById("speedUpButton");
const speedDownButton = document.getElementById("speedDownButton");

let logos = [];
let logoData = [];

// Definir velocidade base
let baseSpeed = 2.5; // alterado de 2 para 2.5

// Classe para gerenciar cada logo
class DvdLogo {
  constructor(element) {
    this.element = element;
    this.unnecessaryClicks += 1;
  }

  update() {
    // Atualizar posição
    this.x += this.speedX;
    this.y += this.speedY;

    // Verificar colisão com as bordas
    const hitCorner =
      (this.x <= 0 && this.y <= 0) ||
      (this.x <= 0 && this.y + this.height >= containerRect.height) ||
      (this.x + this.width >= containerRect.width && this.y <= 0) ||
      (this.x + this.width >= containerRect.width &&
        this.y + this.height >= containerRect.height);

    if (this.x <= 0 || this.x + this.width >= containerRect.width) {
      this.speedX = -this.speedX;
      if (!hitCorner) this.changeColor();
    }

    if (this.y <= 0 || this.y + this.height >= containerRect.height) {
      this.speedY = -this.speedY;
      if (!hitCorner) this.changeColor();
    }

    // Efeito especial se bater no canto
    if (false) {
      this.cornerHitEffect();
    }

    // Aplicar posição
    this.element.style.left = this.x + "px";
    this.element.style.top = this.y + "px";
  }

  changeColor(element) {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    const bgColor = `rgb(${r}, ${g}, ${b})`;
    // const mostReadable = tinycolor.mostReadable(bgColor, ["#000", "#fff"])
    this.element.style.backgroundColor = bgColor;
    // this.element.style.color = mostReadable.toHexString();
  }

  cornerHitEffect() {
    let flashCount = 0;
    const maxFlashes = 5;

    const flashInterval = setInterval(() => {
      this.changeColor();
      flashCount++;

      if (flashCount >= maxFlashes) {
        clearInterval(flashInterval);
      }
    }, 100);
  }

  updateSpeed(newBaseSpeed) {
    this.speedX = Math.sign(this.speedX) * newBaseSpeed;
    this.speedY = Math.sign(this.speedY) * newBaseSpeed;
  }
}

function createLogo(user) {
  const logo = document.createElement("div");
  logo.className = `dvd-logo uuid-${user.id}`;
  const img = document.createElement("img");
  img.src = "/images/dvdDisco.png";
  img.alt = "DVD Logo";
  img.style.maxWidth = "75px";
  img.style.maxHeight = "35px";
  logo.appendChild(img);
  container.appendChild(logo);

  //   const x = Math.random() * (containerRect.width - 200);
  //   const y = Math.random() * (containerRect.height - 100);

  // Velocidade inicial (direção aleatória)
  //   const speedX = (Math.random() > 0.5 ? 1 : -1) * baseSpeed;
  //   const speedY = (Math.random() > 0.5 ? 1 : -1) * baseSpeed;

  //   const dvdLogo = new DvdLogo(logo, x, y, speedX, speedY);
  //   dvdLogo.changeColor(); // Definir cor inicial

  //   return dvdLogo;
}

// Função para atualizar o número de logos
function updateLogoCount(users) {
  const userLength = Object.keys(users).length;

  // Remover todos os logos atuais
  logos.forEach((logo) => {
    if (logo.element.parentNode) {
      logo.element.parentNode.removeChild(logo.element);
    }
  });

  logos = [];

  // Criar novos logos
  for (let i = 0; i < userLength; i++) {
    const user = users[i];
    logos.push(createLogo(user));
    changeColor(user);
  }
}

function changeColor(user) {
  const element = document.querySelector(`.uuid-${user.id}`);

  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  const bgColor = `rgb(${r}, ${g}, ${b})`;
  // const mostReadable = tinycolor.mostReadable(bgColor, ["#000", "#fff"])
  element.style.backgroundColor = bgColor;
  // this.element.style.color = mostReadable.toHexString();
}

// Acionamento do Toast inferior direito
function showToast(msg) {

  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3500);
}
// Atualizar velocidade baseado no slider
// speedSlider.addEventListener("input", function () {
//   baseSpeed = parseFloat(this.value);
//   speedValue.textContent = baseSpeed.toFixed(1);

//   // Atualizar a velocidade de todos os logos
//   logos.forEach((logo) => {
//     logo.updateSpeed(baseSpeed);
//   });
// });

// Alteracao de velocidade com base no hitCorner e penalty "Penalidades"
// speedUpButton.addEventListener("click", () => {
//   // lastBaseSpeed = baseSpeed;
//   logos.forEach((logo) => {
//     increaseSpeed(baseSpeed, false, logo);
//   });
// });
// speedDownButton.addEventListener("click", () => {
//   // lastBaseSpeed = baseSpeed;
//   logos.forEach((logo) => {
//     baseSpeed = decreaseSpeed(baseSpeed, false, logo);
//   });
// });

document.addEventListener("click", function () {
  socket.emit("clickEvent");
});

const urlString = window.location.search;
const urlParams = new URLSearchParams(urlString);

const roomId = urlParams.get('room')

if (roomId == null || roomId == '') {
  window.location.href = '/login';
}

const socket = io('', {
  query: {
    "room": roomId
  }
});
socket.on("gameStart", (gameState) => {
  console.log("Game state received:", gameState);
  updateLogoCount(gameState);
});
socket.on("gameUpdate", (players) => {
  players.forEach((player) => {
    const elementClass = `.uuid-${player.id}`;
    const element = document.querySelector(elementClass);

    if (!element) return;
    // console.log("Player position:", player);
    if (player.hitCorner) {
      element.style.transform = "scale(2)";
      setTimeout(() => {
        element.style.transform = "scale(1)";
      }, 1000);
    }
    requestAnimationFrame(() => {
      element.style.left = player.position.w + "px";
      element.style.top = player.position.h + "px";

      if (player.hitWall) {
        requestAnimationFrame(() => {
          changeColor(player);
        })
      }
    });
  });
});

socket.on("connect", () => {
  console.log("Connected to server");
});

socket.on("disconnect", () => {
  console.log("Disconnected from server");
});

socket.on('toast', (msg) => {
  showToast(msg.message);
})

function start(e) {
  socket.on('invalidRoom', () => {
    window.location.href = '/login';
  });

  socket.on('roomFinished', () => {
    window.location.href = `/ranking?room=${roomId}`;
  })

  // Inicializar o jogo
  socket.emit("startGame");
}
function forceCorner(e) {
  socket.emit("forceCorner");
}
document.getElementById("startButton").addEventListener("click", start);
document.getElementById("forceCorner").addEventListener("click", forceCorner);
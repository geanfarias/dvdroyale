const logo = document.querySelector(".dvd-logo");
const container = document.querySelector(".container");
// const speedSlider = document.getElementById("speedSlider");
// const speedValue = document.getElementById("speedValue");
// const controls = document.getElementById("controls");
// const toggleControls = document.getElementById("toggleControls");

// Definir posição inicial aleatória
let posX = Math.random() * (window.innerWidth - 200);
let posY = Math.random() * (window.innerHeight - 100);

// Definir velocidades
let baseSpeed = 2;
let speedX = baseSpeed;
let speedY = baseSpeed;

// Função para mudar a cor do logo
function changeColor() {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  logo.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
  logo.style.color = `rgb(${255 - r}, ${255 - g}, ${255 - b})`;
}

// Definir cor inicial
changeColor();

// Atualizar velocidade baseado no slider
// speedSlider.addEventListener("input", function () {
//   baseSpeed = parseFloat(this.value);
//   speedValue.textContent = baseSpeed.toFixed(1);

//   // Manter a direção mas ajustar a magnitude
//   speedX = Math.sign(speedX) * baseSpeed;
//   speedY = Math.sign(speedY) * baseSpeed;
// });
// Toggle para mostrar/esconder controles
// toggleControls.addEventListener("click", function () {
//   controls.classList.toggle("hidden");
// });

// Esconder controles após 5 segundos inicialmente
// setTimeout(() => {
//   controls.classList.add("hidden");
// }, 5000);

// Ajustar o logo à janela
window.addEventListener("resize", function () {
  // Assegurar que o logo não saia da tela após redimensionamento
  if (posX + 200 > window.innerWidth) {
    posX = window.innerWidth - 200;
  }
  if (posY + 100 > window.innerHeight) {
    posY = window.innerHeight - 100;
  }
});

// Função de animação
function animate() {
  // Atualizar posição
  posX += speedX;
  posY += speedY;

  // Verificar colisão com as bordas
  const hitCorner =
    (posX <= 0 && posY <= 0) ||
    (posX <= 0 && posY + 100 >= window.innerHeight) ||
    (posX + 200 >= window.innerWidth && posY <= 0) ||
    (posX + 200 >= window.innerWidth && posY + 100 >= window.innerHeight);

  if (posX <= 0 || posX + 200 >= window.innerWidth) {
    speedX = -speedX;
    if (!hitCorner) changeColor();
  }

  if (posY <= 0 || posY + 100 >= window.innerHeight) {
    speedY = -speedY;
    if (!hitCorner) changeColor();
  }

  // Efeito especial se bater no canto
  if (hitCorner) {
    // Efeito piscante para quando bate no canto
    const flashInterval = setInterval(() => {
      changeColor();
    }, 100);

    setTimeout(() => {
      clearInterval(flashInterval);
    }, 500);
  }

  // Aplicar posição
  logo.style.left = posX + "px";
  logo.style.top = posY + "px";

  requestAnimationFrame(animate);
}

// Iniciar animação
animate();

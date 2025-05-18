const container = document.querySelector(".container");
const ranking = document.querySelector(".ranking");
const rankingTemplate = document.querySelector(".js-dvd-template");
let logos = [];

class DvdLogo {
  constructor(element, user) {
    this.element = element;
    this.user = user;
  }

  update(player) {
    this.element.style.left = player.position.w + "px";
    this.element.style.top = player.position.h + "px";

    if (player.hitWall && player.currentPlayer) {
      this.changeColor();
    }

    if (this.user.hitCorner) {
      this.cornerHitEffect();
    }
  }

  changeColor() {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    const bgColor = `rgb(${r}, ${g}, ${b})`;
    this.element.style.backgroundColor = bgColor;
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
}

function createLogo(user) {
  const logo = document.createElement("div");
  logo.className = `dvd-logo uuid-${user.id}`;
  const img = document.createElement("img");
  img.src = "/images/dvdDisco.png";
  img.alt = "DVD Logo";
  img.style.maxWidth = "75px";
  img.style.maxHeight = "35px";
  logo.style.left = user.position.w + "px";
  logo.style.top = user.position.h + "px";

  logo.appendChild(img);
  container.appendChild(logo);

  const dvdLogo = new DvdLogo(logo, user);
  dvdLogo.changeColor();

  return dvdLogo;
}

function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 5500);
}

container.addEventListener("click", function (event) {
  if (event.target === container) {
    socket.emit("clickEvent");
  }
});

const urlString = window.location.search;
const urlParams = new URLSearchParams(urlString);

const roomId = urlParams.get('room')

if (roomId == null || roomId == '') {
  window.location.href = '/login';
}

const socket = io("", {
  query: {
    room: roomId,
  },
});

function setPlayers(players) {
  const userLength = Object.keys(players).length;

  for (let i = 0; i < userLength; i++) {
    const player = players[i];
    logos.push(createLogo(player));
  }
}

socket.on("gameStart", (players) => {
  setPlayers(players);
});

socket.on("gameUpdate", (players) => {
  if (logos.length === 0) {
    setPlayers(players);
  }

  players.forEach((player) => {
    const logo = logos.find((logo) => logo.user.id === player.id);

    if (!logo) return;

    // console.log(player);

    // if (player.hitCorner) {
    //   element.style.transform = "scale(2)";
    //   setTimeout(() => {
    //     element.style.transform = "scale(1)";
    //   }, 1000);
    // }
    requestAnimationFrame(() => {
      logo.update(player);
    });
  });

  updateRanking(players);
});

function updateRanking(players) {
  console.log(players);
  const userLength = Object.keys(players).length;

  ranking.innerHTML = "";

  for (let i = 0; i < userLength; i++) {
    const player = players[i];
    const template = rankingTemplate.content.cloneNode(true);
    template.querySelector(".js-name").textContent = player.name;
    template.querySelector(".js-score").textContent = player.points;

    ranking.appendChild(template);
  }
};

socket.on("connect", () => {
  console.log("Connected to server");
});

socket.on("disconnect", () => {
  console.log("Disconnected from server");
});

socket.on('toast', (msg) => {
  showToast(msg.message);
})

socket.on('invalidRoom', () => {
  window.location.href = '/login';
});

socket.on('roomFinished', () => {
  window.location.href = `/ranking?room=${roomId}`;
})

socket.on('playVideo', () => {
  const overlay = document.createElement("div");
  overlay.id = "video-overlay";

  const iframe = document.createElement("iframe");
  iframe.src = "https://www.youtube.com/embed/zuxY44jE-Sk?autoplay=1&controls=0&modestbranding=1&rel=0";
  iframe.allow = "autoplay; fullscreen";

  overlay.appendChild(iframe);
  document.body.appendChild(overlay);
})

function start(e) {
  socket.emit("startGame");
}
function forceCorner(e) {
  socket.emit("forceCorner");
}
document.getElementById("startButton").addEventListener("click", start);
document.getElementById("forceCorner").addEventListener("click", forceCorner);
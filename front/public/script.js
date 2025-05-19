const container = document.querySelector(".container");
const ranking = document.querySelector(".ranking");
const rankingTemplate = document.querySelector(".js-dvd-template");
let logos = [];
const logoPath = {
  dvdDisco: "/images/dvdDisco.png",
  dvdAudio: "/images/dvdAudio.png",
  dvdBall: "/images/dvdBall.png",
  dvdBluRay: "/images/dvdBluRay.png",
  dvdDisney: "/images/dvdDisney.png",
  dvdRam: "/images/dvdRam.png",
  dvdRom: "/images/dvdRom.png",
  dvdRRW: "/images/dvdRRW.png",
  dvdVideo: "/images/dvdVideo.png",
  dvdVideoAudio: "/images/dvdVideoAudio.png",
  dvdVideoCd: "/images/dvdVideoCd.png",
  dvdGold: "/images/dvdGold.svg",
};

class DvdLogo {
  constructor(element, user) {
    this.element = element;
    this.user = user;
  }

  getActualColor() {
    return this.element.style.backgroundColor;
  }

  update(player) {
    this.element.style.left = player.position.w + "px";
    this.element.style.top = player.position.h + "px";

    if (player.hitWall && player.currentPlayer) {
      this.changeColor(player);
    }

    // if (this.user.hitCorner) {
    //   this.cornerHitEffect();
    // }
  }

  changeColor(player) {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    const bgColor = `rgb(${r}, ${g}, ${b})`;
    this.element.style.backgroundColor = bgColor;

    if (player.currentPlayer) {
      this.element.classList.add("current-player");
    }
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

  updateLogo(player) {
    const points = player.points;

    if (points < 100) {
      this.element.style.backgroundImage = `url(${logoPath.dvdDisco})`;
      return;
    }

    if (points >= 100 && points < 200) {
      this.element.style.backgroundImage = `url(${logoPath.dvdAudio})`;
      return;
    }

    if (points >= 200 && points < 300) {
      this.element.style.backgroundImage = `url(${logoPath.dvdBall})`;
      return;
    }

    if (points >= 300 && points < 400) {
      this.element.style.backgroundImage = `url(${logoPath.dvdBluRay})`;
      return;
    }

    if (points >= 400 && points < 500) {
      this.element.style.backgroundImage = `url(${logoPath.dvdDisney})`;
      return;
    }

    if (points >= 500 && points < 600) {
      this.element.style.backgroundImage = `url(${logoPath.dvdRam})`;
      return;
    }

    if (points >= 600 && points < 700) {
      this.element.style.backgroundImage = `url(${logoPath.dvdRom})`;
      return;
    }

    if (points >= 700 && points < 800) {
      this.element.style.backgroundImage = `url(${logoPath.dvdRRW})`;
      return;
    }

    if (points >= 800 && points < 900) {
      this.element.style.backgroundImage = `url(${logoPath.dvdVideo})`;
      return;
    }

    if (points >= 900 && points < 1000) {
      this.element.style.backgroundImage = `url(${logoPath.dvdVideoAudio})`;
      return;
    }

    if (points >= 1000 && points < 1100) {
      this.element.style.backgroundImage = `url(${logoPath.dvdVideoCd})`;
      return;
    }

    if (points >= 1200) {
      this.element.style.backgroundImage = `url(${logoPath.dvdGold})`;
    }
  }

  remove() {
    this.element.remove();
  }
}

function createLogo(user) {
  const logo = document.createElement("div");
  logo.className = `dvd-logo uuid-${user.id}`;
  logo.style.backgroundImage = `url(${logoPath.dvdDisco})`;
  logo.style.left = user.position.w + "px";
  logo.style.top = user.position.h + "px";

  container.appendChild(logo);

  const dvdLogo = new DvdLogo(logo, user);
  dvdLogo.changeColor(user);

  return dvdLogo;
}

function showToast(msg) {
  const toast = document.getElementById("toast");
  toast.textContent = msg;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 5500);
}

container.addEventListener("click", function (event) {
  if (event.target === container) {
    socket.emit("clickEvent");
  }
});

const socket = io("", {
  query: {
    room: "0a79e357-5c34-44e0-bb86-a86bfd666b15",
  },
});

function setPlayers(players) {
  const userLength = Object.keys(players).length;

  for (let i = 0; i < userLength; i++) {
    const player = players[i];
    const logo = logos.find((logo) => logo.user.id === player.id);

  if (!logo) logos.push(createLogo(player));
  }
}

socket.on("playerConnected", (user) => {
  const logo = logos.find((logo) => logo.user.id === user.id);

  if (logo) return;

  const newLogo = createLogo(user);
  logos.push(newLogo);
});

socket.on("gameStart", (players) => {
  setPlayers(players);
  console.log(players);
});

socket.on("gameUpdate", (players) => {
    console.log(players);
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
      logo.updateLogo(player);
    });
  });

  updateRanking(players);
});

function updateRanking(players) {
  const userLength = Object.keys(players).length;

  ranking.innerHTML = "";

  for (let i = 0; i < userLength; i++) {
    const player = players[i];
    const logoPlayer = logos.find((logo) => logo.user.id === player.id);

    if (!logoPlayer) return;

    const template = rankingTemplate.content.cloneNode(true);
    template.querySelector(".js-name").textContent = player.name;
    template.querySelector(".js-score").textContent = player.points;

    const logoColor = logoPlayer.getActualColor();
    template.querySelector(".js-dvd-ranking-player").style.backgroundColor =
      logoColor;
    const mostReadable = tinycolor
      .mostReadable(logoColor, ["#000", "#fff"])
      .toHexString();

    template.querySelector(".js-name").style.color = mostReadable;
    template.querySelector(".js-score").style.color = mostReadable;

    ranking.appendChild(template);
  }
}

socket.on("connect", () => {
  console.log("Connected to server");
});

socket.on("disconnect", () => {
  console.log("Disconnected from server");
});

socket.on("playerDisconnected", (player) => {
    const logo = logos.find((logo) => logo.user.id === player.id);
    
    if (logo) {
        logo.remove();
        logos = logos.filter((l) => l.user.id !== player.id);
    }
});

socket.on("toast", (msg) => {
  showToast(msg.message);
});

socket.on("invalidRoom", () => {
  window.location.href = "/login";
});

socket.on("roomFinished", () => {
  window.location.href = `/ranking?room=0a79e357-5c34-44e0-bb86-a86bfd666b15`;
});

socket.on("surprise", (e) => {
  const surpriseButton = container.querySelector(`.sp-uuid-${e.id}`);

  if (surpriseButton) return;

  const surprise = document.createElement("button");
  surprise.className = `surprise sp-uuid-${e.id}`;
  surprise.textContent = "Surprise!";
  surprise.style.zIndex = 5;
  surprise.style.left = e.position.w + "px";
  surprise.style.top = e.position.h + "px";

  container.appendChild(surprise);

  surprise.addEventListener("click", () => {
    socket.emit("executeSurprise", {id: e.id});
    // surprise.remove();
  });
});

socket.on("surpriseExecuted", (id) => {
    const surpriseButton = container.querySelector(`.sp-uuid-${id}`);

    if (surpriseButton) {
      surpriseButton.remove();
    }
});

socket.on("playVideo", () => {
  const overlay = document.createElement("div");
  overlay.id = "video-overlay";

  const iframe = document.createElement("iframe");
  iframe.src =
    "https://www.youtube.com/embed/zuxY44jE-Sk?autoplay=1&controls=0&modestbranding=1&rel=0";
  iframe.allow = "autoplay; fullscreen";

  overlay.appendChild(iframe);
  document.body.appendChild(overlay);
});

function start(e) {
  socket.emit("startGame");
}
function forceCorner(e) {
  socket.emit("forceCorner");
}

if (document.getElementById("startButton")) {
    document.getElementById("startButton").addEventListener("click", start);
}

if (document.getElementById("startButton")) {
    document.getElementById("forceCorner").addEventListener("click", forceCorner);
}

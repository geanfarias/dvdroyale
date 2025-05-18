const container = document.querySelector(".container");
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

const socket = io("", {
  query: {
    room: "padrao",
  },
});

socket.on("gameStart", (users) => {
  const userLength = Object.keys(users).length;

  for (let i = 0; i < userLength; i++) {
    const user = users[i];
    logos.push(createLogo(user));
  }
});

socket.on("gameUpdate", (players) => {
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

socket.on('invalidRoom', () => {
  window.location.href = '/login';
});

socket.on('roomFinished', () => {
  window.location.href = `/ranking?room=${roomId}`;
})

socket.on('playVideo', () => {
    console.log('playVideo');
    
})

function start(e) {
  socket.emit("startGame");
}
function forceCorner(e) {
  socket.emit("forceCorner");
}
document.getElementById("startButton").addEventListener("click", start);
document.getElementById("forceCorner").addEventListener("click", forceCorner);
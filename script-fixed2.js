// ===== TAP SCREEN FIREWORKS =====
class TapParticle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    const angle = Math.random() * Math.PI * 2;
    const velocity = 3 + Math.random() * 4;
    this.vx = Math.cos(angle) * velocity;
    this.vy = Math.sin(angle) * velocity;
    this.life = 1;
    this.decay = Math.random() * 0.015 + 0.01;
    const colors = ["#ffb3d9", "#ff99cc", "#d9a8ff", "#a8d5ff", "#ffe4a8", "#ffc9a8"];
    this.color = colors[Math.floor(Math.random() * colors.length)];
    this.size = Math.random() * 2 + 1;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vy += 0.15;
    this.life -= this.decay;
  }

  draw(ctx) {
    ctx.save();
    ctx.globalAlpha = this.life;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

let tapCanvas, tapCtx, tapParticles = [];

function initTapCanvas() {
  tapCanvas = document.getElementById("tapCanvas");
  if (!tapCanvas) {
    console.error("tapCanvas not found");
    return;
  }
  tapCtx = tapCanvas.getContext("2d");
  tapParticles = [];
  
  function resizeTapCanvas() {
    tapCanvas.width = window.innerWidth;
    tapCanvas.height = window.innerHeight;
  }
  window.addEventListener("resize", resizeTapCanvas);
  resizeTapCanvas();
}

function createTapFirework(x, y) {
  const count = 15 + Math.random() * 15;
  for (let i = 0; i < count; i++) {
    tapParticles.push(new TapParticle(x, y));
  }
}

function startTapFireworks() {
  if (!tapCanvas) return;
  setInterval(() => {
    createTapFirework(Math.random() * tapCanvas.width, Math.random() * tapCanvas.height);
  }, 1200);
  animateTapFireworks();
}

function animateTapFireworks() {
  if (!tapCtx) return;
  tapCtx.clearRect(0, 0, tapCanvas.width, tapCanvas.height);

  for (let i = tapParticles.length - 1; i >= 0; i--) {
    tapParticles[i].update();
    tapParticles[i].draw(tapCtx);
    if (tapParticles[i].life <= 0) {
      tapParticles.splice(i, 1);
    }
  }

  requestAnimationFrame(animateTapFireworks);
}

// ===== GAME LOGIC =====
let score = 0;
const heartContainer = document.getElementById("heartContainer");
const scoreDisplay = document.getElementById("score");
const popSound = document.getElementById("popSound");

function playPopSound() {
  if (popSound) {
    popSound.currentTime = 0;
    popSound.play().catch(() => console.log("Pop sound could not be played"));
  }
}

function spawnHeart() {
  if (!heartContainer) return;
  const heart = document.createElement("div");
  heart.className = "heart";
  heart.textContent = "❤️";
  heart.style.left = Math.random() * (window.innerWidth - 80) + "px";
  heart.style.top = Math.random() * (window.innerHeight - 300) + 100 + "px";

  heart.addEventListener("click", (e) => {
    e.stopPropagation();
    playPopSound();
    score++;
    scoreDisplay.textContent = score;
    heart.remove();

    if (score >= 7) {
      clearInterval(spawnInterval);
      setTimeout(() => finish(), 500);
    }
  });

  heartContainer.appendChild(heart);
  setTimeout(() => heart.remove(), 5000);
}

let spawnInterval;

// ===== SCREEN TRANSITIONS =====
const tapScreen = document.getElementById("tapScreen");
const gameScreen = document.getElementById("game");
const finalScreen = document.getElementById("final");

function startGame() {
  console.log("Game started!");
  if (!tapScreen || !gameScreen) {
    console.error("Missing screen elements");
    return;
  }
  
  tapScreen.style.animation = "slideDown 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards";
  setTimeout(() => {
    tapScreen.style.display = "none";
    gameScreen.style.display = "flex";
    spawnInterval = setInterval(spawnHeart, 800);
    const bgMusic = document.getElementById("bgMusic");
    if (bgMusic) bgMusic.play();
  }, 600);
}

// Attach click listener to entire tap screen
if (tapScreen) {
  tapScreen.addEventListener("click", startGame);
  tapScreen.style.zIndex = "1";
}

// Also attach to tap container for better UX
const tapContainer = document.querySelector(".tap-container");
if (tapContainer) {
  tapContainer.addEventListener("click", (e) => {
    e.stopPropagation();
    startGame();
  });
  tapContainer.style.zIndex = "3";
  tapContainer.style.cursor = "pointer";
}

function finish() {
  gameScreen.style.display = "none";
  finalScreen.style.display = "block";
  startFireworks();
}

// ===== FINAL SCREEN FIREWORKS =====
let W, H, fireworks = [];

const canvas = document.getElementById("fw");
const ctx = canvas ? canvas.getContext("2d") : null;

function resize() {
  if (!canvas) return;
  W = canvas.width = innerWidth;
  H = canvas.height = innerHeight;
}
window.onresize = resize;
resize();

class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    const angle = Math.random() * Math.PI * 2;
    const velocity = 5 + Math.random() * 5;
    this.vx = Math.cos(angle) * velocity;
    this.vy = Math.sin(angle) * velocity;
    this.life = 1;
    this.decay = Math.random() * 0.015 + 0.015;
    const colors = ["#ffb3d9", "#ff99cc", "#d9a8ff", "#a8d5ff", "#ffe4a8", "#ffc9a8"];
    this.color = colors[Math.floor(Math.random() * colors.length)];
    this.size = Math.random() * 3 + 2;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vy += 0.2;
    this.life -= this.decay;
  }

  draw() {
    if (!ctx) return;
    ctx.save();
    ctx.globalAlpha = this.life;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

function createFirework(x, y) {
  const particleCount = 50 + Math.random() * 40;
  for (let i = 0; i < particleCount; i++) {
    fireworks.push(new Particle(x, y));
  }
}

function startFireworks() {
  const burstPositions = [
    { x: W * 0.15, y: H * 0.15 },
    { x: W * 0.85, y: H * 0.15 },
    { x: W * 0.15, y: H * 0.85 },
    { x: W * 0.85, y: H * 0.85 },
    { x: W * 0.5, y: H * 0.3 },
    { x: W * 0.3, y: H * 0.5 },
    { x: W * 0.7, y: H * 0.5 },
    { x: W * 0.5, y: H * 0.7 },
  ];

  let burstIndex = 0;
  const burstInterval = setInterval(() => {
    if (burstIndex < burstPositions.length * 2.5) {
      const pos = burstPositions[burstIndex % burstPositions.length];
      const x = pos.x + (Math.random() - 0.5) * 150;
      const y = pos.y + (Math.random() - 0.5) * 150;
      createFirework(x, y);
      burstIndex++;
    } else {
      clearInterval(burstInterval);
    }
  }, 100);

  animateFireworks();
}

function animateFireworks() {
  if (!ctx) return;
  ctx.clearRect(0, 0, W, H);

  for (let i = fireworks.length - 1; i >= 0; i--) {
    fireworks[i].update();
    fireworks[i].draw();
    if (fireworks[i].life <= 0) {
      fireworks.splice(i, 1);
    }
  }

  if (fireworks.length > 0) {
    requestAnimationFrame(animateFireworks);
  }
}

// ===== LONG PRESS SECRET MESSAGE =====
let timer;
const finalText = document.getElementById("finalText");
const secret = document.getElementById("secret");

if (finalText) {
  finalText.addEventListener("touchstart", () => {
    timer = setTimeout(() => {
      secret.style.display = "block";
      createFirework(W / 2, H / 2);
    }, 1000);
  });
  finalText.addEventListener("touchend", () => clearTimeout(timer));

  finalText.addEventListener("mousedown", () => {
    timer = setTimeout(() => {
      secret.style.display = "block";
      createFirework(W / 2, H / 2);
    }, 1000);
  });
  finalText.addEventListener("mouseup", () => clearTimeout(timer));
}

// ===== INTERACTIVE BUTTONS =====
const btnMessage = document.getElementById("btn-message");
const btnWish = document.getElementById("btn-wish");
const btnConfetti = document.getElementById("btn-confetti");

if (btnMessage) {
  btnMessage.addEventListener("click", () => {
    alert("🎀 Special Message:\n\nA very very very Happy Birthday to my +1. I hope you acheive whatever you aspire,i believe in you and i'm very proud of you. Can't believe 9 saal hogye apne friendship ko, bohot se dost aaye bohot se gye but we somehow stayed in touch and i hope it'll stay that way. I know mein tujhe pareshaan karta hu kabhi kabhi but sorry i cant help it mujhe mazaa aata hai, so tujhe bear karna padega hehehehe. Always be the person, that you are (zyaada taarif nhi karunga warna sarr pe chadh jaayegi huddddd). 2026 will be ours and here's to creating more memories together! <3 \n Happy Birthday Kiddo \n With Love from Aaditya ");
    createFirework(Math.random() * W, Math.random() * H);
  });
}

if (btnWish) {
  btnWish.addEventListener("click", () => {
    alert("🎁 My Special Wish For You:\n\nTujhe jo make up aur kapde chahiye woh tujhe mil jaayeeeeee!!!! <3");
    createFirework(Math.random() * W, Math.random() * H);
    createFirework(Math.random() * W, Math.random() * H);
  });
}

if (btnConfetti) {
  btnConfetti.addEventListener("click", () => {
    createFirework(W * 0.25, H * 0.25);
    createFirework(W * 0.75, H * 0.25);
    createFirework(W * 0.25, H * 0.75);
    createFirework(W * 0.75, H * 0.75);
    createFirework(W * 0.5, H * 0.5);
  });
}

// ===== GALLERY IMAGE LOADING =====
function loadGalleryImages() {
  const images = [
    { img: document.querySelector(".img1"), placeholder: document.querySelector(".gallery-item:nth-child(1) .img-placeholder") },
    { img: document.querySelector(".img2"), placeholder: document.querySelector(".gallery-item:nth-child(2) .img-placeholder") },
    { img: document.querySelector(".img3"), placeholder: document.querySelector(".gallery-item:nth-child(3) .img-placeholder") }
  ];

  images.forEach(item => {
    if (item.img) {
      item.img.addEventListener("load", () => {
        item.img.classList.add("loaded");
        if (item.placeholder) {
          item.placeholder.style.opacity = "0";
        }
      });
      item.img.addEventListener("error", () => {
        if (item.placeholder) {
          item.placeholder.style.opacity = "1";
        }
      });
    }
  });
}

// Initialize on page load
document.addEventListener("DOMContentLoaded", () => {
  console.log("Page loaded, initializing...");
  initTapCanvas();
  startTapFireworks();
  loadGalleryImages();
});

// Also initialize if DOM is already ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    console.log("DOMContentLoaded fired");
    initTapCanvas();
    startTapFireworks();
    loadGalleryImages();
  });
} else {
  console.log("DOM already ready, initializing now");
  initTapCanvas();
  startTapFireworks();
  loadGalleryImages();
}

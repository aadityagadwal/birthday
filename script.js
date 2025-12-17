// ===== SVG FIREWORKS SYSTEM WITH REALISTIC NEON COLORS =====
const svgNamespace = "http://www.w3.org/2000/svg";
const fireworksContainer = document.getElementById("fireworksContainer");

// Bright neon colors for realistic fireworks
const neonColors = [
  "#FF006E", // Hot pink neon
  "#FF1493", // Deep pink neon
  "#00D9FF", // Cyan neon
  "#39FF14", // Neon green
  "#FFFF00", // Bright yellow
  "#FF4500", // Orange red neon
  "#9D4EDD", // Purple neon
  "#3A86FF", // Blue neon
  "#FB5607", // Orange neon
  "#FFB703", // Gold neon
];

function createSVGFireworks(x, y, intensity = 1) {
  if (!fireworksContainer) return;
  
  // Create a group for this burst
  const group = document.createElementNS(svgNamespace, "g");
  group.setAttribute("class", "fireworks-burst");
  
  const particleCount = Math.floor((50 + Math.random() * 80) * intensity);
  
  for (let i = 0; i < particleCount; i++) {
    const angle = (i / particleCount) * Math.PI * 2 + (Math.random() - 0.5) * 0.8;
    const velocity = 2 + Math.random() * 8;
    const distance = velocity * 30;
    const tx = Math.cos(angle) * distance;
    const ty = Math.sin(angle) * distance;
    
    // Realistic size variation
    const size = Math.random() * 3 + 1;
    const color = neonColors[Math.floor(Math.random() * neonColors.length)];
    
    // Create circle with glow effect
    const circle = document.createElementNS(svgNamespace, "circle");
    circle.setAttribute("cx", x);
    circle.setAttribute("cy", y);
    circle.setAttribute("r", size);
    circle.setAttribute("fill", color);
    circle.setAttribute("opacity", "1");
    
    // Add realistic glow
    const filter = document.createElementNS(svgNamespace, "filter");
    filter.setAttribute("id", `glow-${Math.random().toString(36).substr(2, 9)}`);
    const feGaussianBlur = document.createElementNS(svgNamespace, "feGaussianBlur");
    feGaussianBlur.setAttribute("stdDeviation", "2");
    feGaussianBlur.setAttribute("result", "coloredBlur");
    const feMerge = document.createElementNS(svgNamespace, "feMerge");
    const feMergeNode1 = document.createElementNS(svgNamespace, "feMergeNode");
    feMergeNode1.setAttribute("in", "coloredBlur");
    const feMergeNode2 = document.createElementNS(svgNamespace, "feMergeNode");
    feMergeNode2.setAttribute("in", "SourceGraphic");
    feMerge.appendChild(feMergeNode1);
    feMerge.appendChild(feMergeNode2);
    filter.appendChild(feGaussianBlur);
    filter.appendChild(feMerge);
    
    circle.setAttribute("class", "fireworks-particle");
    
    // Animate with realistic physics
    setTimeout(() => {
      circle.style.transition = `all ${1.2 + Math.random() * 0.8}s cubic-bezier(0.25, 0.46, 0.45, 0.94)`;
      circle.setAttribute("cx", x + tx);
      circle.setAttribute("cy", y + ty + 50); // Gravity effect
      circle.setAttribute("opacity", "0");
      circle.setAttribute("r", 0);
    }, 10);
    
    group.appendChild(circle);
  }
  
  fireworksContainer.appendChild(group);
  
  // Clean up after animation
  setTimeout(() => {
    group.remove();
  }, 2200);
}

function triggerMultipleFireworks() {
  // Create fireworks from multiple positions with staggered timing
  const positions = [
    { x: 200, y: 150, delay: 0 },
    { x: 1166, y: 150, delay: 60 },
    { x: 200, y: 618, delay: 120 },
    { x: 1166, y: 618, delay: 180 },
    { x: 683, y: 250, delay: 240 },
    { x: 400, y: 400, delay: 300 },
    { x: 966, y: 400, delay: 360 },
    { x: 683, y: 550, delay: 420 },
    { x: 100, y: 400, delay: 480 },
    { x: 1250, y: 300, delay: 540 },
  ];
  
  positions.forEach((pos) => {
    setTimeout(() => {
      createSVGFireworks(pos.x, pos.y, 1.2);
    }, pos.delay);
  });
}

function startContinuousFireworks() {
  // Fire continuous bursts from random positions
  let burstCount = 0;
  const maxBursts = 25; // Total bursts for celebration
  
  const burstInterval = setInterval(() => {
    if (burstCount >= maxBursts) {
      clearInterval(burstInterval);
      return;
    }
    
    const randomX = 100 + Math.random() * (window.innerWidth - 200);
    const randomY = 100 + Math.random() * (window.innerHeight - 200);
    createSVGFireworks(randomX, randomY, 0.9);
    
    burstCount++;
  }, 200); // New burst every 200ms
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

// Attach click listener to tap screen
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
  // Automatically trigger spectacular fireworks on finish
  startContinuousFireworks();
}

// ===== LONG PRESS SECRET MESSAGE =====
let timer;
const finalText = document.getElementById("finalText");
const secret = document.getElementById("secret");

if (finalText) {
  finalText.addEventListener("touchstart", () => {
    timer = setTimeout(() => {
      secret.style.display = "block";
      // Trigger fireworks on secret reveal
      triggerMultipleFireworks();
    }, 1000);
  });
  finalText.addEventListener("touchend", () => clearTimeout(timer));

  finalText.addEventListener("mousedown", () => {
    timer = setTimeout(() => {
      secret.style.display = "block";
      // Trigger fireworks on secret reveal
      triggerMultipleFireworks();
    }, 1000);
  });
  finalText.addEventListener("mouseup", () => clearTimeout(timer));
}

// ===== INTERACTIVE BUTTONS =====
const btnMessage = document.getElementById("btn-message");
const btnWish = document.getElementById("btn-wish");

if (btnMessage) {
  btnMessage.addEventListener("click", () => {
    alert("🎀 Special Message:\n\nA very very very Happy Birthday to my +1. I hope you acheive whatever you aspire, i believe in you and i'm very proud of you. Can't believe 9 saal hogye apne friendship ko, bohot se dost aaye bohot se gye but we somehow stayed in touch and i hope it'll stay that way. I know mein tujhe pareshaan karta hu kabhi kabhi but sorry i cant help it mujhe mazaa aata hai, so tujhe bear karna padega hehehehe. Always be the person, that you are (zyaada taarif nhi karunga warna sarr pe chadh jaayegi huddddd). 2026 will be ours and here's to creating more memories together! <3 \n Happy Birthday Kiddo \n With Love from Aaditya ");
    // Single firework burst on message
    createSVGFireworks(window.innerWidth / 2, window.innerHeight / 2, 1.5);
  });
}

if (btnWish) {
  btnWish.addEventListener("click", () => {
    alert("🎁 My Special Wish For You:\n\nTujhe jo make up aur kapde chahiye woh tujhe mil jaayeeeeee!!!! <3");
    // Multiple fireworks for wish
    triggerMultipleFireworks();
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
  loadGalleryImages();
});

// Also initialize if DOM is already ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    console.log("DOMContentLoaded fired");
    loadGalleryImages();
  });
} else {
  console.log("DOM already ready, initializing now");
  loadGalleryImages();
}

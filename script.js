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
const yaySound = document.getElementById("yaySound");

function playPopSound() {
  if (popSound) {
    popSound.currentTime = 0;
    popSound.play().catch(() => console.log("Pop sound could not be played"));
  }
  if (yaySound) {
    yaySound.currentTime = 0;
    yaySound.play().catch(() => console.log("Yay sound could not be played"));
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
    if (bgMusic) {
      bgMusic.muted = false;
      bgMusic.play().catch(err => console.log("Background music error:", err));
    }
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
  // Show speed game next
  const speedGame = document.getElementById("speedGame");
  speedGame.style.display = "flex";
  startSpeedGame();
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

// ===== MODAL FUNCTIONS =====
function showModal(message) {
  const modal = document.getElementById("messageModal");
  const modalMessage = document.getElementById("modalMessage");
  const closeBtn = document.querySelector(".modal-close");
  
  if (modalMessage) modalMessage.textContent = message;
  if (modal) modal.classList.add("active");
  
  if (closeBtn) {
    closeBtn.onclick = () => {
      if (modal) modal.classList.remove("active");
    };
  }
  
  if (modal) {
    modal.onclick = (e) => {
      if (e.target === modal || e.target.classList.contains("modal-overlay")) {
        modal.classList.remove("active");
      }
    };
  }
}

// ===== INTERACTIVE BUTTONS =====
const btnMessage = document.getElementById("btn-message");
const btnWish = document.getElementById("btn-wish");

if (btnMessage) {
  btnMessage.addEventListener("click", () => {
    const messageText = "🎀 Special Message:\nMuktai \n\nA very very very Happy Birthday to my +1. I hope you acheive whatever you aspire, i believe in you and i'm very proud of you. Can't believe 9 saal hogye apne friendship ko, bohot se dost aaye bohot se gye but we somehow stayed in touch and i hope it'll stay that way. I know mein tujhe pareshaan karta hu kabhi kabhi but sorry i cant help it mujhe mazaa aata hai, so tujhe bear karna padega hehehehe. Always be the person, that you are (zyaada taarif nhi karunga warna sarr pe chadh jaayegi huddddd). I Love you to the moon and back. Cant wait to see you soon cutie. Here's to creating more memories together! <3\n\nHappy Birthday Kiddo\n\nWith Love from Aaditya";
    showModal(messageText);
    // Single firework burst on message
    createSVGFireworks(window.innerWidth / 2, window.innerHeight / 2, 1.5);
  });
}

if (btnWish) {
  btnWish.addEventListener("click", () => {
    const wishText = "🎁 My Special Wish For You:\n\nTujhe jo make up aur kapde chahiye woh tujhe mil jaayeeeeee!!!! <3";
    showModal(wishText);
    // Multiple fireworks for wish
    triggerMultipleFireworks();
  });
}

// ===== GALLERY IMAGE LOADING =====
function loadGalleryImages() {
  const images = document.querySelectorAll(".gallery-img");

  images.forEach(img => {
    if (img.complete && img.naturalWidth !== 0) {
      img.classList.add("loaded");
    } else {
      img.addEventListener("load", () => {
        img.classList.add("loaded");
      });

      img.addEventListener("error", () => {
        console.error("Failed to load image:", img.src);
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
    initMusicVisualization();
  });
} else {
  console.log("DOM already ready, initializing now");
  loadGalleryImages();
  initMusicVisualization();
}

// ===== SPEED GAME =====
let speedScore = 0;
let speedGameRunning = false;

function startSpeedGame() {
  speedScore = 0;
  speedGameRunning = true;
  const speedScoreDisplay = document.getElementById("speedScore");
  const speedButton = document.getElementById("speedButton");
  
  if (speedScoreDisplay) speedScoreDisplay.textContent = "0";
  
  speedButton.addEventListener("click", onSpeedButtonClick);
}

function onSpeedButtonClick() {
  if (!speedGameRunning) return;
  speedScore++;
  const speedScoreDisplay = document.getElementById("speedScore");
  if (speedScoreDisplay) speedScoreDisplay.textContent = speedScore;
  playPopSound();
  
  // Check if reached 22 clicks
  if (speedScore >= 22) {
    speedGameRunning = false;
    const speedButton = document.getElementById("speedButton");
    speedButton.removeEventListener("click", onSpeedButtonClick);
    setTimeout(() => finishSpeedGame(), 300);
  }
}

function finishSpeedGame() {
  const speedGame = document.getElementById("speedGame");
  speedGame.style.display = "none";
  finalScreen.style.display = "block";
  
  // Automatically trigger spectacular fireworks on finish
  startContinuousFireworks();
  // Keep fireworks going continuously
  setInterval(() => {
    startContinuousFireworks();
  }, 6000);
  
  // Start music visualization
  const visualization = document.getElementById("visualization");
  if (visualization) visualization.classList.add("active");
}

// ===== MUSIC VISUALIZATION =====
let analyser = null;
let dataArray = null;

function initMusicVisualization() {
  const bgMusic = document.getElementById("bgMusic");
  if (!bgMusic || !window.AudioContext) return;
  
  bgMusic.addEventListener("play", () => {
    if (analyser) return; // Already initialized
    
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      
      const source = audioContext.createMediaElementAudioSource(bgMusic);
      source.connect(analyser);
      analyser.connect(audioContext.destination);
      
      const bufferLength = analyser.frequencyBinCount;
      dataArray = new Uint8Array(bufferLength);
      
      animateVisualization();
    } catch (e) {
      console.log("Audio visualization not supported");
    }
  });
}

function animateVisualization() {
  if (!analyser || !dataArray) return;
  
  analyser.getByteFrequencyData(dataArray);
  
  const bars = document.querySelectorAll("#visualization .bar");
  const barCount = bars.length;
  
  bars.forEach((bar, index) => {
    const average = dataArray[index * Math.floor(dataArray.length / barCount)];
    const height = 40 + (average / 255) * 80;
    bar.style.height = height + "px";
  });
  
  requestAnimationFrame(animateVisualization);
}


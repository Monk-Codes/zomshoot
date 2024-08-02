const gameArea = document.getElementById("game-area");
const scoreDisplay = document.getElementById("score");
const highScoreDisplay = document.getElementById("high-score");
const timePlayedDisplay = document.getElementById("time-played");
const backgroundMusic = document.getElementById("background-music");
const zombieAppearSound = document.getElementById("zombie-appear-sound");
const zombieKillSound = document.getElementById("zombie-kill-sound");
const restartBtn = document.getElementById("restart-btn");

let score = 0;
let highScore = localStorage.getItem("highScore") || 0;
let timePlayed = 0;
let gameInterval;
let timerInterval;

highScoreDisplay.textContent = `High Score: ${highScore}`;

// Start the game
function startGame() {
 score = 0;
 timePlayed = 0;
 updateScore();
 updateTimePlayed();
 backgroundMusic.play();

 gameInterval = setInterval(createZombie, 1100);
 timerInterval = setInterval(() => {
  timePlayed++;
  updateTimePlayed();
 }, 1000);
}

// Stop the game
function stopGame() {
 clearInterval(gameInterval);
 clearInterval(timerInterval);
 backgroundMusic.pause();
 backgroundMusic.currentTime = 0;
 saveHighScore();
}

// Restart the game
restartBtn.addEventListener("click", () => {
 stopGame();
 startGame();
});

// Create a zombie
function createZombie() {
 const zombie = document.createElement("div");
 zombie.className = "zombie";
 const zombieSize = Math.random() * 90 + 40;
 zombie.style.width = `${zombieSize}px`;
 zombie.style.height = `${zombieSize}px`;
 const xPos = Math.random() * (gameArea.offsetWidth - zombieSize);
 const yPos = Math.random() * (gameArea.offsetHeight - zombieSize);
 zombie.style.left = `${xPos}px`;
 zombie.style.top = `${yPos}px`;
 gameArea.appendChild(zombie);

 zombieAppearSound.play();

 // Animate zombie appearance
 gsap.fromTo(zombie, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.8 });

 // Animate zombie movement
 gsap.to(zombie, {
  x: Math.random() * 50 - 25, // Random horizontal movement
  y: Math.random() * 50 - 25, // Random vertical movement
  repeat: -1,
  yoyo: true,
  duration: 1,
  ease: "power1.inOut",
 });

 // Remove zombie when hit
 zombie.addEventListener("click", () => {
  if (gameArea.contains(zombie)) {
   zombieKillSound.play();
   gsap.to(zombie, {
    scale: 0,
    opacity: 0,
    duration: 0.2,
    onComplete: () => {
     gameArea.removeChild(zombie);
     updateScore();
    },
   });
  }
 });

 // Remove zombie after a few seconds if not clicked
 setTimeout(() => {
  if (gameArea.contains(zombie)) {
   gameArea.removeChild(zombie);
  }
 }, 50000); // Zombies stay for 5 seconds
}

// Update score
function updateScore() {
 score += 10;
 scoreDisplay.textContent = `Score: ${score}`;
 if (score > highScore) {
  highScore = score;
  highScoreDisplay.textContent = `High Score: ${highScore}`;
 }
}

// Update time played
function updateTimePlayed() {
 timePlayedDisplay.textContent = `Time Played: ${timePlayed}s`;
}

// Save high score to localStorage
function saveHighScore() {
 localStorage.setItem("highScore", highScore);
}

// Info and Help buttons
document.getElementById("info-btn").addEventListener("click", () => {
 alert("Use your mouse or tap on zombies to score points.");
});

document.getElementById("help-btn").addEventListener("click", () => {
 alert("Zombies appear randomly. Click or tap on them to score. Good luck!");
});

// Start the game initially
startGame();

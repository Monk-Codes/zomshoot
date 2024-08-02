const gameArea = document.getElementById("game-area");
const scoreDisplay = document.getElementById("score");
const gameContainer = document.getElementById("game-container");
const highScoreDisplay = document.getElementById("high-score");
const timePlayedDisplay = document.getElementById("time-played");
const backgroundMusic = document.getElementById("background-music");
const zombieAppearSound = document.getElementById("zombie-appear-sound");
const zombieKillSound = document.getElementById("zombie-kill-sound");
const gameOverSound = document.getElementById("game-over-sound");
const restartBtn = document.getElementById("restart-btn");
const gameOverScreen = document.getElementById("game-over-screen");
const finalScoreDisplay = document.getElementById("final-score");
const playAgainBtn = document.getElementById("play-again-btn");
const startBtn = document.getElementById("start-btn");

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
 backgroundMusic.play().catch((error) => {
  console.log("Background music could not be played:", error);
 });

 gameInterval = setInterval(createZombie, 400);
 timerInterval = setInterval(() => {
  timePlayed++;
  updateTimePlayed();
 }, 1000);

 toggleButtons(false);
}

// Stop the game
function stopGame() {
 clearInterval(gameInterval);
 clearInterval(timerInterval);
 backgroundMusic.pause();
 backgroundMusic.currentTime = 0;
 saveHighScore();
 clearZombies();
}

// Clear all zombies from the game area
function clearZombies() {
 const zombies = gameArea.getElementsByClassName("zombie");
 while (zombies.length > 0) {
  zombies[0].parentNode.removeChild(zombies[0]);
 }
}

// Restart the game
restartBtn.addEventListener("click", () => {
 stopGame();
 startGame();
});

// Play Again button interaction
playAgainBtn.addEventListener("click", () => {
 gameOverScreen.style.display = "none";
 gameArea.style.display = "block";
 stopGame();

 startGame();
});

// Start Game Button Interaction
startBtn.addEventListener("click", () => {
 startBtn.style.display = "none";
 startGame();
});

// Toggle visibility of Start and Restart buttons
function toggleButtons(isStartVisible) {
 startBtn.style.display = isStartVisible ? "block" : "none";
 restartBtn.style.display = isStartVisible ? "none" : "block";
}

// Create a zombie
function createZombie() {
 const zombie = document.createElement("div");
 zombie.className = "zombie";
 const zombieSize = Math.random() * 100 + 37;
 zombie.style.width = `${zombieSize}px`;
 zombie.style.height = `${zombieSize}px`;
 const xPos = Math.random() * (gameArea.offsetWidth - zombieSize);
 const yPos = Math.random() * (gameArea.offsetHeight - zombieSize);
 zombie.style.left = `${xPos}px`;
 zombie.style.top = `${yPos}px`;
 gameArea.appendChild(zombie);

 zombieAppearSound.play().catch((error) => {
  console.log("Zombie appear sound could not be played:", error);
 });

 // Animate zombie appearance
 gsap.fromTo(zombie, { scale: 0.1, opacity: 0.1 }, { scale: 1, opacity: 1, duration: 3 });

 // Animate zombie movement
 gsap.to(zombie, {
  x: Math.random() * 100 - 37, // Random horizontal movement
  y: Math.random() * 100 - 37, // Random vertical movement
  repeat: -1,
  yoyo: true,
  duration: 1,
  ease: "power1.inOut",
 });

 // Remove zombie when hit
 zombie.addEventListener("click", () => {
  if (gameArea.contains(zombie)) {
   zombieKillSound.play().catch((error) => {
    console.log("Zombie kill sound could not be played:", error);
   });
   gsap.to(zombie, {
    scale: 0,
    opacity: 0,
    duration: 0.2,
    onComplete: () => {
     if (gameArea.contains(zombie)) {
      gameArea.removeChild(zombie);
      updateScore();
     }
    },
   });
  }
 });

 // Check for game over condition
 setTimeout(() => {
  if (gameArea.contains(zombie)) {
   checkGameOver();
  }
 }, 10000);
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
 const minutes = Math.floor(timePlayed / 60);
 const seconds = timePlayed % 60;
 timePlayedDisplay.textContent = `Time Played: ${minutes}m ${seconds}s`;
}

// Save high score to localStorage
function saveHighScore() {
 localStorage.setItem("highScore", highScore);
}

// Check for game over condition
function checkGameOver() {
 const zombieCount = gameArea.getElementsByClassName("zombie").length;
 const areaWidth = gameArea.offsetWidth;
 const areaHeight = gameArea.offsetHeight;
 const totalArea = areaWidth * areaHeight;
 let occupiedArea = 0;

 Array.from(gameArea.getElementsByClassName("zombie")).forEach((zombie) => {
  const width = parseFloat(zombie.style.width);
  const height = parseFloat(zombie.style.height);
  occupiedArea += width * height;
 });

 const occupiedPercentage = (occupiedArea / totalArea) * 100;

 if (occupiedPercentage > 90) {
  gameOver();
 }
}

// Game over function
function gameOver() {
 gameOverSound.play();
 stopGame();
 gameArea.style.display = "none";
 gameContainer.style.marginTop = "100px";
 gameOverScreen.style.display = "block";
 finalScoreDisplay.textContent = score;
 toggleButtons(true);
}

// Info and Help buttons
document.getElementById("info-btn").addEventListener("click", () => {
 alert("Use your mouse or tap on zombies to score points.");
});

document.getElementById("help-btn").addEventListener("click", () => {
 alert("Zombies appear randomly. Click or tap on them to score. Good luck!");
});

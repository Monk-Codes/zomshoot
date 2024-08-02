const gameArea = document.getElementById("game-area");
const scoreDisplay = document.getElementById("score");
let score = 0;

// Create a zombie
function createZombie() {
 const zombie = document.createElement("div");
 zombie.className = "zombie";
 zombie.style.left = `${Math.random() * 90}%`; // Keep zombies within game area bounds
 zombie.style.top = `${Math.random() * 90}%`;
 gameArea.appendChild(zombie);

 // Remove zombie when hit
 zombie.addEventListener("click", (e) => {
  if (gameArea.contains(zombie)) {
   gameArea.removeChild(zombie);
   updateScore();
  }
 });

 // Remove zombie after a few seconds if not clicked
 setTimeout(() => {
  if (gameArea.contains(zombie)) {
   gameArea.removeChild(zombie);
  }
 }, 5000); // Adjust timing as needed
}

// Update score
function updateScore() {
 score += 10;
 scoreDisplay.textContent = `Score: ${score}`;
}

// Handle click events
document.addEventListener("click", (e) => {
 if (e.target.className === "zombie") {
  e.target.click();
 }
});

// Create zombies every 2 seconds
setInterval(createZombie, 1000);

// Info and Help buttons
document.getElementById("info-btn").addEventListener("click", () => {
 alert("Use your mouse to click on zombies to score points.");
});

document.getElementById("help-btn").addEventListener("click", () => {
 alert("Zombies appear randomly. Click on them to score. Good luck!");
});

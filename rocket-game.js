let gameArea, rocket, gameInterval, obstacleInterval;
let bullets = [];
let obstacles = [];
let gameActive = false;

document.addEventListener("DOMContentLoaded", () => {
    gameArea = document.getElementById("gameArea");
    rocket = document.getElementById("rocket");

    rocket.addEventListener("mousedown", startMove);
    rocket.addEventListener("touchstart", startMove);

    rocket.addEventListener("click", fireBullet);
    rocket.addEventListener("touchend", fireBullet);
});

function startGame() {
    if (gameActive) return;
    gameActive = true;
    document.getElementById("status").innerText = "";
    resetGame();
    gameInterval = setInterval(updateGameArea, 20);
    obstacleInterval = setInterval(createObstacle, 2000);
}

function resetGame() {
    rocket.style.left = "50%";
    bullets.forEach(bullet => bullet.remove());
    obstacles.forEach(obstacle => obstacle.remove());
    bullets = [];
    obstacles = [];
}

function startMove(e) {
    e.preventDefault();
    document.addEventListener("mousemove", moveRocket);
    document.addEventListener("touchmove", moveRocket);
    document.addEventListener("mouseup", stopMove);
    document.addEventListener("touchend", stopMove);
}

function moveRocket(e) {
    e.preventDefault();
    const x = e.touches ? e.touches[0].clientX : e.clientX;
    const rect = gameArea.getBoundingClientRect();
    let newLeft = x - rect.left - rocket.offsetWidth / 2;
    newLeft = Math.max(0, Math.min(newLeft, gameArea.offsetWidth - rocket.offsetWidth));
    rocket.style.left = newLeft + "px";
}

function stopMove(e) {
    document.removeEventListener("mousemove", moveRocket);
    document.removeEventListener("touchmove", moveRocket);
    document.removeEventListener("mouseup", stopMove);
    document.removeEventListener("touchend", stopMove);
}

function fireBullet(e) {
    e.preventDefault();
    const bullet = document.createElement("div");
    bullet.classList.add("bullet");
    bullet.style.left = rocket.offsetLeft + rocket.offsetWidth / 2 - 2.5 + "px";
    bullet.style.bottom = rocket.offsetHeight + "px";
    gameArea.appendChild(bullet);
    bullets.push(bullet);
}

function createObstacle() {
    const obstacle = document.createElement("div");
    obstacle.classList.add("obstacle");
    obstacle.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - 50)) + "px";
    obstacle.style.top = "0px";
    gameArea.appendChild(obstacle);
    obstacles.push(obstacle);
}

function updateGameArea() {
    bullets.forEach((bullet, index) => {
        bullet.style.bottom = parseInt(bullet.style.bottom) + 5 + "px";
        if (parseInt(bullet.style.bottom) > gameArea.offsetHeight) {
            bullet.remove();
            bullets.splice(index, 1);
        }
    });

    obstacles.forEach((obstacle, obsIndex) => {
        obstacle.style.top = parseInt(obstacle.style.top) + 2 + "px";
        if (parseInt(obstacle.style.top) > gameArea.offsetHeight) {
            obstacle.remove();
            obstacles.splice(obsIndex, 1);
        }

        bullets.forEach((bullet, bulIndex) => {
            if (isCollision(bullet, obstacle)) {
                bullet.remove();
                obstacle.remove();
                bullets.splice(bulIndex, 1);
                obstacles.splice(obsIndex, 1);
            }
        });

        if (isCollision(rocket, obstacle)) {
            endGame();
        }
    });
}

function isCollision(div1, div2) {
    const rect1 = div1.getBoundingClientRect();
    const rect2 = div2.getBoundingClientRect();

    return !(
        rect1.top > rect2.bottom ||
        rect1.bottom < rect2.top ||
        rect1.left > rect2.right ||
        rect1.right < rect2.left
    );
}

function endGame() {
    gameActive = false;
    clearInterval(gameInterval);
    clearInterval(obstacleInterval);
    document.getElementById("status").innerText = "Game Over! Try Again";
}
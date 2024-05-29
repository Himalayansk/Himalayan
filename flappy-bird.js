const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 600;
canvas.height = 400;

const bird = {
    x: 100,
    y: canvas.height / 2,
    radius: 20,
    velocity: 0,
    gravity: 0.5
};

let pipes = [];
let score = 0;
let isGameOver = false;

function drawBird() {
    ctx.beginPath();
    ctx.arc(bird.x, bird.y, bird.radius, 0, Math.PI * 2);
    ctx.fillStyle = "#f7f7f7";
    ctx.fill();
    ctx.closePath();
}

function drawPipe(x, y, height, pipeType) {
    ctx.fillStyle = pipeType === "top" ? "#4CAF50" : "#8BC34A";
    ctx.fillRect(x, y, 50, height);
}

function drawScore() {
    ctx.font = "30px Arial";
    ctx.fillStyle = "#fff";
    ctx.fillText("Score: " + score, 10, 30);
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    drawBird();

    pipes.forEach(pipe => {
        drawPipe(pipe.x, 0, pipe.topHeight, "top");
        drawPipe(pipe.x, canvas.height - pipe.bottomHeight, pipe.bottomHeight, "bottom");
    });

    drawScore();

    if (isGameOver) {
        ctx.font = "50px Arial";
        ctx.fillStyle = "#fff";
        ctx.fillText("Game Over", canvas.width / 2 - 150, canvas.height / 2);
    }
}

function update() {
    if (isGameOver) return;

    bird.velocity += bird.gravity;
    bird.y += bird.velocity;

    pipes.forEach(pipe => {
        pipe.x -= 2;

        if (bird.x + bird.radius > pipe.x && bird.x - bird.radius < pipe.x + 50) {
            if (bird.y - bird.radius < pipe.topHeight || bird.y + bird.radius > canvas.height - pipe.bottomHeight) {
                gameOver();
            }
        }

        if (pipe.x + 50 === bird.x - bird.radius) {
            score++;
        }
    });

    if (bird.y + bird.radius > canvas.height || bird.y - bird.radius < 0) {
        gameOver();
    }

    if (pipes.length === 0 || pipes[pipes.length - 1].x < canvas.width - 200) {
        createPipe();
    }
}

function createPipe() {
    const topHeight = Math.floor(Math.random() * (canvas.height / 2));
    const bottomHeight = Math.floor(Math.random() * (canvas.height / 2));
    pipes.push({ x: canvas.width, topHeight, bottomHeight });
}

function gameOver() {
    isGameOver = true;
}

function jump() {
    bird.velocity = -10;
}

document.addEventListener("keydown", function (e) {
    if (e.key === " ") {
        jump();
    }
});

setInterval(function () {
    update();
    draw();
}, 1000 / 60);


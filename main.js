const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Tamaño pantalla
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let ship = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    speed: 5
};

function drawShip() {
    ctx.strokeStyle = "white";
    ctx.beginPath();
    ctx.moveTo(ship.x, ship.y - 15);
    ctx.lineTo(ship.x - 10, ship.y + 10);
    ctx.lineTo(ship.x + 10, ship.y + 10);
    ctx.closePath();
    ctx.stroke();
}

function draw() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drawShip();
}

draw();

let keys = {};

document.addEventListener("keydown", (e) => {
    keys[e.key] = true;
});

document.addEventListener("keyup", (e) => {
    keys[e.key] = false;
});

function update() {
    if (keys["ArrowUp"]) ship.y -= ship.speed;
    if (keys["ArrowDown"]) ship.y += ship.speed;
    if (keys["ArrowLeft"]) ship.x -= ship.speed;
    if (keys["ArrowRight"]) ship.x += ship.speed;

    if (ship.x < 0) ship.x = 0;
if (ship.x > canvas.width) ship.x = canvas.width;
if (ship.y < 0) ship.y = 0;
if (ship.y > canvas.height) ship.y = canvas.height;
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();

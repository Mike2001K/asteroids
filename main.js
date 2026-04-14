const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Tamaño pantalla
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Nave
let ship = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    speed: 5
};

// Listas
let asteroids = [];
let bullets = [];
let keys = {};

// ======================
// CONTROLES
// ======================

document.addEventListener("keydown", (e) => {
    keys[e.key] = true;

    if (e.key === " ") {
        bullets.push({
            x: ship.x,
            y: ship.y,
            speed: 7
        });
    }
});

document.addEventListener("keyup", (e) => {
    keys[e.key] = false;
});

// ======================
// ASTEROIDES
// ======================

function createAsteroid() {
    let asteroid = {
        x: Math.random() * canvas.width,
        y: 0,
        size: Math.random() * 30 + 20,
        speed: Math.random() * 2 + 1
    };

    asteroids.push(asteroid);
}

setInterval(createAsteroid, 2000);

// ======================
// UPDATE
// ======================

function update() {

    // Movimiento nave
    if (keys["ArrowUp"]) ship.y -= ship.speed;
    if (keys["ArrowDown"]) ship.y += ship.speed;
    if (keys["ArrowLeft"]) ship.x -= ship.speed;
    if (keys["ArrowRight"]) ship.x += ship.speed;

    // Límites
    if (ship.x < 0) ship.x = 0;
    if (ship.x > canvas.width) ship.x = canvas.width;
    if (ship.y < 0) ship.y = 0;
    if (ship.y > canvas.height) ship.y = canvas.height;

    // Movimiento balas
    bullets.forEach(b => {
        b.y -= b.speed;
    });

    bullets = bullets.filter(b => b.y > 0);

    // Movimiento asteroides
    asteroids.forEach(a => {
        a.y += a.speed;
    });

    asteroids = asteroids.filter(a => a.y < canvas.height);
}

// ======================
// DIBUJO
// ======================

function drawShip() {
    ctx.strokeStyle = "white";
    ctx.beginPath();
    ctx.moveTo(ship.x, ship.y - 15);
    ctx.lineTo(ship.x - 10, ship.y + 10);
    ctx.lineTo(ship.x + 10, ship.y + 10);
    ctx.closePath();
    ctx.stroke();
}

function drawBullets() {
    ctx.fillStyle = "white";

    bullets.forEach(b => {
        ctx.fillRect(b.x, b.y, 3, 10);
    });
}

function drawAsteroids() {
    ctx.strokeStyle = "white";

    asteroids.forEach(a => {
        ctx.beginPath();
        ctx.arc(a.x, a.y, a.size, 0, Math.PI * 2);
        ctx.stroke();
    });
}

function draw() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drawShip();
    drawBullets();
    drawAsteroids();
}

// ======================
// GAME LOOP
// ======================

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();
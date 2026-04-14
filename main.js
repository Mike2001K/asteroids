const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// ======================
// NAVE
// ======================

let ship = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    speed: 5
};

let lives = 3;
let gameOver = false;

// ======================
// LISTAS
// ======================

let asteroids = [];
let bullets = [];
let keys = {};
let explosions = [];

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

function createAsteroid(level = 3, x = Math.random() * canvas.width, y = 0) {

    let size = level === 3 ? 40 : level === 2 ? 25 : 15;

    let asteroid = {
        x,
        y,
        level,
        size,
        speed: Math.random() * 2 + 1,
        angle: 0,
        rotation: Math.random() * 0.05,
        shape: []
    };

    generateShape(asteroid);

    asteroids.push(asteroid);
}

// generar forma irregular
function generateShape(a) {
    a.shape = [];
    let points = 8;

    for (let i = 0; i < points; i++) {
        let angle = (Math.PI * 2 / points) * i;
        let radius = a.size + (Math.random() * 10 - 5);
        a.shape.push({ angle, radius });
    }
}

// generar diferentes tamaños
setInterval(() => {
    let level = Math.floor(Math.random() * 3) + 1;
    createAsteroid(level);
}, 2000);

// ======================
// UPDATE
// ======================

function update() {

    // 💀 COLISIÓN NAVE
    asteroids.forEach(a => {
        let dx = a.x - ship.x;
        let dy = a.y - ship.y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < a.size && !gameOver) {

            explosions.push({
                x: ship.x,
                y: ship.y,
                radius: 0,
                max: 30
            });

            lives--;

            if (lives > 0) {
                ship.x = canvas.width / 2;
                ship.y = canvas.height / 2;
            } else {
                gameOver = true;
                alert("Game Over");
            }
        }
    });

    // 💥 COLISIÓN BALAS (DAÑO PROGRESIVO)
    asteroids.forEach((a, ai) => {
        bullets.forEach((b, bi) => {

            let dx = a.x - b.x;
            let dy = a.y - b.y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < a.size) {

                bullets.splice(bi, 1);

                a.level--;

                if (a.level <= 0) {
                    asteroids.splice(ai, 1);
                } else {
                    a.size = a.level === 2 ? 25 : 15;
                    generateShape(a);
                }
            }
        });
    });

    // Movimiento nave
    if (keys["ArrowUp"]) ship.y -= ship.speed;
    if (keys["ArrowDown"]) ship.y += ship.speed;
    if (keys["ArrowLeft"]) ship.x -= ship.speed;
    if (keys["ArrowRight"]) ship.x += ship.speed;

    // Límites
    let margin = 20;
    if (ship.x < margin) ship.x = margin;
    if (ship.x > canvas.width - margin) ship.x = canvas.width - margin;
    if (ship.y < margin) ship.y = margin;
    if (ship.y > canvas.height - margin) ship.y = canvas.height - margin;

    // Movimiento balas
    bullets.forEach(b => b.y -= b.speed);
    bullets = bullets.filter(b => b.y > 0);

    // Movimiento asteroides
    asteroids.forEach(a => {
        a.y += a.speed;
        a.angle += a.rotation;
    });

    asteroids = asteroids.filter(a => a.y < canvas.height);

    // Animación explosión
    explosions.forEach(e => e.radius += 2);
    explosions = explosions.filter(e => e.radius < e.max);
}

// ======================
// DIBUJO
// ======================

function drawShip(x, y) {
    ctx.strokeStyle = "white";
    ctx.beginPath();
    ctx.moveTo(x, y - 20);
    ctx.lineTo(x - 15, y + 15);
    ctx.lineTo(x + 15, y + 15);
    ctx.closePath();
    ctx.stroke();
}

// 🔥 Propulsor
function drawThruster() {
    if (keys["ArrowUp"]) {
        ctx.strokeStyle = "orange";
        ctx.beginPath();
        ctx.moveTo(ship.x, ship.y + 15);
        ctx.lineTo(ship.x - 7, ship.y + 25);
        ctx.lineTo(ship.x + 7, ship.y + 25);
        ctx.closePath();
        ctx.stroke();
    }
}

function drawBullets() {
    ctx.fillStyle = "white";
    bullets.forEach(b => ctx.fillRect(b.x, b.y, 3, 10));
}

function drawAsteroids() {

    asteroids.forEach(a => {

        if (a.level === 3) ctx.strokeStyle = "white";
        if (a.level === 2) ctx.strokeStyle = "yellow";
        if (a.level === 1) ctx.strokeStyle = "red";

        ctx.save();
        ctx.translate(a.x, a.y);
        ctx.rotate(a.angle);

        ctx.beginPath();
        a.shape.forEach((p, i) => {
            let x = Math.cos(p.angle) * p.radius;
            let y = Math.sin(p.angle) * p.radius;

            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        });

        ctx.closePath();
        ctx.stroke();
        ctx.restore();
    });
}

// 💥 Explosión
function drawExplosions() {
    ctx.strokeStyle = "red";

    explosions.forEach(e => {
        ctx.beginPath();
        ctx.arc(e.x, e.y, e.radius, 0, Math.PI * 2);
        ctx.stroke();
    });
}

// ❤️ Vidas
function drawLives() {
    for (let i = 0; i < lives; i++) {
        drawShip(30 + i * 40, 30);
    }
}

function draw() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drawShip(ship.x, ship.y);
    drawThruster();
    drawBullets();
    drawAsteroids();
    drawExplosions();
    drawLives();
}

// ======================
// GAME LOOP
// ======================

function gameLoop() {
    if (!gameOver) {
        update();
        draw();
        requestAnimationFrame(gameLoop);
    }
}

gameLoop();
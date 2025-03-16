const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const scale = 20;
const rows = canvas.height / scale;
const columns = canvas.width / scale;

let snake;
let food;
let score = 0;
let highScore = localStorage.getItem("highScore") || 0;
let speed = 100; // Default speed (Slow)
let snakeHeadColor = "#00FF00"; // Default head color
let snakeTailColor = "#000000"; // Default tail color
let gameOver = false;
let gameInterval; // Store the interval ID

// Show the high score on the menu
document.getElementById('highScore').innerText = "High Score: " + highScore;

(function setup() {
    snake = new Snake();
    food = new Food();
    gameInterval = window.setInterval(gameLoop, speed);
})();

function gameLoop() {
    if (gameOver) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    snake.update();
    snake.draw();
    food.draw();
    if (snake.eat(food)) {
        food = new Food();
        score++;
        document.getElementById('score').innerText = "Score: " + score;
    }

    if (snake.checkCollision()) {
        gameOver = true;
        document.getElementById('gameOverMessage').style.display = 'block';
        if (score > highScore) {
            highScore = score;
            localStorage.setItem("highScore", highScore);
        }
    }
}

function Snake() {
    this.body = [{ x: 10, y: 10 }];
    this.direction = "RIGHT";
    this.length = 1;

    this.update = function () {
        let head = { x: this.body[0].x, y: this.body[0].y };

        if (this.direction === "UP") head.y -= 1;
        if (this.direction === "DOWN") head.y += 1;
        if (this.direction === "LEFT") head.x -= 1;
        if (this.direction === "RIGHT") head.x += 1;

        this.body.unshift(head);
        if (this.body.length > this.length) {
            this.body.pop();
        }
    };

    this.draw = function () {
        for (let i = 0; i < this.body.length; i++) {
            ctx.fillStyle = i === 0 ? snakeHeadColor : snakeTailColor;
            ctx.fillRect(this.body[i].x * scale, this.body[i].y * scale, scale, scale);
        }
    };

    this.changeDirection = function (event) {
        if (event.keyCode === 37 && this.direction !== "RIGHT") this.direction = "LEFT";
        if (event.keyCode === 38 && this.direction !== "DOWN") this.direction = "UP";
        if (event.keyCode === 39 && this.direction !== "LEFT") this.direction = "RIGHT";
        if (event.keyCode === 40 && this.direction !== "UP") this.direction = "DOWN";
    };

    this.eat = function (food) {
        if (this.body[0].x === food.x && this.body[0].y === food.y) {
            this.length++;
            return true;
        }
        return false;
    };

    this.checkCollision = function () {
        if (this.body[0].x < 0 || this.body[0].x >= columns || this.body[0].y < 0 || this.body[0].y >= rows) {
            return true;
        }

        for (let i = 1; i < this.body.length; i++) {
            if (this.body[i].x === this.body[0].x && this.body[i].y === this.body[0].y) {
                return true;
            }
        }

        return false;
    };
}

function Food() {
    this.x = Math.floor(Math.random() * columns);
    this.y = Math.floor(Math.random() * rows);

    this.draw = function () {
        ctx.fillStyle = "red";
        ctx.fillRect(this.x * scale, this.y * scale, scale, scale);
    };
}

document.addEventListener("keydown", function (event) {
    if (gameOver && event.keyCode === 13) {
        startGame();
    }
    snake.changeDirection(event);
});

// Start a new game
function startGame() {
    score = 0;
    document.getElementById('score').innerText = "Score: 0";
    gameOver = false;
    document.getElementById('gameOverMessage').style.display = 'none';
    snake = new Snake();
    food = new Food();

    // Clear previous interval and set new one
    clearInterval(gameInterval);
    gameInterval = window.setInterval(gameLoop, speed);

    // Hide the menu and show the game area
    document.getElementById('menu').style.display = 'none';
    document.getElementById('gameArea').style.display = 'block';
}

// Open the settings menu
function openSettings() {
    document.getElementById('menu').style.display = 'none';
    document.getElementById('settingsPanel').style.display = 'block';
}

// Save settings (speed, colors)
function saveSettings() {
    speed = parseInt(document.getElementById('speedSelect').value);
    snakeHeadColor = document.getElementById('headColor').value;
    snakeTailColor = document.getElementById('tailColor').value;

    // Restart the game with new settings
    startGame();
}

// Cancel settings and go back to the main menu
function cancelSettings() {
    document.getElementById('settingsPanel').style.display = 'none';
    document.getElementById('menu').style.display = 'block';
}

// Quit Game (Return to Main Menu)
function quitGame() {
    document.getElementById('gameArea').style.display = 'none';
    document.getElementById('menu').style.display = 'block';
    document.getElementById('gameOverMessage').style.display = 'none';
    score = 0;
    gameOver = false;
    clearInterval(gameInterval);
}

// Simulate closing the game (Exit to Desktop)
function closeGame() {
    document.getElementById('exitMessage').style.display = 'none';
    window.close(); // This will work only if the window was opened by a script.
}

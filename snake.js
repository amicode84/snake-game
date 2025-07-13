// انتخاب المان‌های HTML
const canvas = document.getElementById("game-board");
const ctx = canvas.getContext("2d");
const restartBtn = document.getElementById("restart");
const scoreDisplay = document.getElementById("score");

// تنظیمات بازی
const gridSize = 20;
const tileCount = canvas.width / gridSize;
let gameSpeed = 150; // سرعت بازی (عدد بیشتر = سرعت کمتر)

// متغیرهای بازی
let snake = [{ x: 10, y: 10 }]; // موقعیت اولیه مار
let food = { x: 5, y: 5 }; // موقعیت اولیه غذا
let dx = 0; // جهت حرکت افقی
let dy = 0; // جهت حرکت عمودی
let score = 0; // امتیاز
let gameOver = false; // وضعیت بازی

// تابع رسم مار
function drawSnake() {
    snake.forEach(segment => {
        ctx.fillStyle = "green";
        ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize, gridSize);
        ctx.strokeStyle = "darkgreen";
        ctx.strokeRect(segment.x * gridSize, segment.y * gridSize, gridSize, gridSize);
    });
}

// تابع رسم غذا
function drawFood() {
    ctx.fillStyle = "red";
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);
}

// تابع تولید غذا در محل تصادفی
function generateFood() {
    food = {
        x: Math.floor(Math.random() * tileCount),
        y: Math.floor(Math.random() * tileCount)
    };
    
    // بررسی اینکه غذا روی مار نباشد
    snake.forEach(segment => {
        if (segment.x === food.x && segment.y === food.y) {
            generateFood();
        }
    });
}

// تابع حرکت مار
function moveSnake() {
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    snake.unshift(head);

    // بررسی برخورد با غذا
    if (head.x === food.x && head.y === food.y) {
        score += 10;
        scoreDisplay.textContent = `امتیاز: ${score}`;
        generateFood();
    } else {
        snake.pop();
    }
}

// تابع بررسی برخورد
function checkCollision() {
    const head = snake[0];
    
    // برخورد با دیوار
    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
        gameOver = true;
    }
    
    // برخورد با خود مار
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            gameOver = true;
        }
    }
}

// تابع نمایش Game Over
function drawGameOver() {
    ctx.fillStyle = "black";
    ctx.font = "30px Arial";
    const text = "Game Over!";
    const textWidth = ctx.measureText(text).width;
    ctx.fillText(text, (canvas.width - textWidth)/2, canvas.height/2);
}

// تابع شروع مجدد بازی
function restartGame() {
    snake = [{ x: 10, y: 10 }];
    dx = 0;
    dy = 0;
    score = 0;
    scoreDisplay.textContent = `امتیاز: ${score}`;
    gameOver = false;
    generateFood();
    gameLoop();
}

// حلقه اصلی بازی
function gameLoop() {
    if (gameOver) {
        drawGameOver();
        return;
    }
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawSnake();
    drawFood();
    moveSnake();
    checkCollision();
    
    setTimeout(() => {
        requestAnimationFrame(gameLoop);
    }, gameSpeed);
}

// کنترل با کیبورد
document.addEventListener("keydown", (e) => {
    if (gameOver) return;
    
    if (e.key === "ArrowUp" && dy !== 1) {
        dx = 0;
        dy = -1;
    } else if (e.key === "ArrowDown" && dy !== -1) {
        dx = 0;
        dy = 1;
    } else if (e.key === "ArrowLeft" && dx !== 1) {
        dx = -1;
        dy = 0;
    } else if (e.key === "ArrowRight" && dx !== -1) {
        dx = 1;
        dy = 0;
    }
});

// دکمه شروع مجدد
restartBtn.addEventListener("click", restartGame);

// شروع بازی
generateFood();
gameLoop();
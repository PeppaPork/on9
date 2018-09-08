function startGame() {
    snake = [new component(20, 20, "#01FF70", 140, 100, 0)];
    food = new component(20, 20, "#FF4136", 140, 140, 0);
    var ateFood = false;
    var score = 0;
    snakeArea.start();
    genFood();
}

function updateSnakeArea() {
    //check input
    if (snakeArea.key && snakeArea.key == 37 && snakeHead.direction != 1) { snakeHead.direction = 3; }
    else if (snakeArea.key && snakeArea.key == 39 && snakeHead.direction != 3) { snakeHead.direction = 1; }
    else if (snakeArea.key && snakeArea.key == 38 && snakeHead.direction != 2) { snakeHead.direction = 0; }
    else if (snakeArea.key && snakeArea.key == 40 && snakeHead.direction != 0) { snakeHead.direction = 2; }
    updateSnake();
    checkCrash();
    checkFood();
    snakeArea.clear();
    for (i = 0; i < snake.length; i += 1) {
        snake[i].update();
    }
    food.update();
}

function updateSnake() {
    if (snake.length > 0) {
        snake.unshift(snake[0].assign());
        if (!ateFood) {
            snake.pop();
        }
    }
    snake[0].newPos();
}

function checkCrash() {
    if (snakeHead.x < 0 || snakeHead.x > 280 || snakeHead.y < 0 || snakeHead.y > 220) {
        return gameOver();
    }
    for (key in snake) {
        if (key !==0 && snake[0].x == snake[key].x && snake[0].y == snake[key].y) {
            return gameOver();
        }
    }
}

function checkFood() {
    if (ateFood){
        genFood();
        ateFood = false;
    }
    if (snake[0].x == food.x && snake[0].y == food.y) {
        ateFood = true;
        score += 1;
    }
}

function genFood() {
    randX = Math.floor(Math.random() * (14 - 0)) + 0;
    randY = Math.floor(Math.random() * (11 - 0)) + 0;
    food.x = randX * 20;
    food.y = randY * 20;
    for (key in snake) {
        if (snake[key].x == food.x && snake[key].y == food.y) {
            genFood();
        }
    }
}

function gameOver() {
    snakeArea.stop();
    return;
}

var snakeArea = {
    canvas: document.createElement("canvas"),
    start: function () {
        this.canvas.width = 300;
        this.canvas.height = 240;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.interval = setInterval(updateSnakeArea, 100);
        window.addEventListener('keydown', function (e) {
            snakeArea.key = e.keyCode;
        })
        window.addEventListener('keyup', function (e) {
            snakeArea.key = false;
        })
    },
    clear: function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    stop: function () {
        clearInterval(this.interval);
    }
}

function component(width, height, color, x, y, direction = 0) {
    this.width = width;
    this.height = height;
    this.speed = 20;
    this.direction = direction;
    this.x = x;
    this.y = y;
    this.update = function () {
        ctx = snakeArea.context;
        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    this.newPos = function () {
        if (this.direction == 0) { this.y -= this.speed; }
        if (this.direction == 1) { this.x += this.speed; }
        if (this.direction == 2) { this.y += this.speed; }
        if (this.direction == 3) { this.x -= this.speed; }
    }
}

function startGame() {
    snake = [new component(20, 20, "#01FF70", 140, 100, 0)];
    food = new component(20, 20, "#FF4136", 140, 140, 0);
    wall = new component(300, 10, "85144b", 0, 240, 0);
    UpBtn = new component(40, 40, "#7FDBFF ", 130, 300);
    DownBtn = new component(40, 40, "#7FDBFF", 130, 380);
    LeftBtn = new component(40, 40, "#7FDBFF", 90, 340);
    RightBtn = new component(40, 40, "#7FDBFF", 170, 340); 
    ateFood = false;
    score = 0;
    snakeArea.start();
}

function updateSnakeArea() {
    //check keyboard input
    if (snakeArea.key) {
        if (snakeArea.key == 37 && snake[0].direction != 1) { snake[0].direction = 3; }
        else if (snakeArea.key == 39 && snake[0].direction != 3) { snake[0].direction = 1; }
        else if (snakeArea.key == 38 && snake[0].direction != 2) { snake[0].direction = 0; }
        else if (snakeArea.key == 40 && snake[0].direction != 0) { snake[0].direction = 2; }
    }
    //check touch input
    if (snakeArea.x && snakeArea.y) {
        if (UpBtn.clicked() && snake[0].direction != 2) { snake[0].direction = 0; }
        else if (DownBtn.clicked() && snake[0].direction != 0) { snake[0].direction = 2; }
        else if (LeftBtn.clicked() && snake[0].direction != 1) { snake[0].direction = 3; }
        else if (RightBtn.clicked() && snake[0].direction != 3) { snake[0].direction = 1; }
    }
    //game algro
    updateSnake();
    if (checkCrash()) { snakeArea.stop();  return; }
    checkFood();
    //update components positions on screen
    snakeArea.clear();
    for (key in snake) {
        snake[key].update();
    }
    food.update();
    wall.update();
    UpBtn.update();
    DownBtn.update();
    LeftBtn.update();
    RightBtn.update(); 
}

function updateSnake() {
    if (snake.length > 0) {
        snake.unshift(Object.assign({},snake[0]));
        if (!ateFood) {
            snake.pop();
        }
    }
    snake[0].newPos();
}

function checkCrash() {
    console.log("checkCrash");
    if (snake[0].x < 0 || snake[0].x > 280 || snake[0].y < 0 || snake[0].y > 220) {
        return true;
    }
    for (key in snake) {
        if (key !=0 && snake[0].x == snake[key].x && snake[0].y == snake[key].y) {
            return true;
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

var snakeArea = {
    canvas: document.createElement("canvas"),
    start: function () {
        this.canvas.width = 300;
        this.canvas.height = 480;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.interval = setInterval(updateSnakeArea, 100);
        //keyboard control
        window.addEventListener('keydown', function (e) {
            snakeArea.key = e.keyCode;
        })
        window.addEventListener('keyup', function (e) {
            snakeArea.key = false;
        })
        //touch control
        window.addEventListener('mousedown', function (e) {
            snakeArea.x = e.pageX;
            snakeArea.y = e.pageY;
        })
        window.addEventListener('mouseup', function (e) {
            snakeArea.x = false;
            snakeArea.y = false;
        })
        window.addEventListener('touchstart', function (e) {
            snakeArea.x = e.pageX;
            snakeArea.y = e.pageY;
        })
        window.addEventListener('touchend', function (e) {
            snakeArea.x = false;
            snakeArea.y = false;
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
    //for buttons
    this.clicked = function () {
        var myleft = this.x;
        var myright = this.x + (this.width);
        var mytop = this.y;
        var mybottom = this.y + (this.height);
        var clicked = true;
        if ((mybottom < snakeArea.y) || (mytop > snakeArea.y)
            || (myright < snakeArea.x) || (myleft > snakeArea.x)) {
            clicked = false;
        }
        return clicked;
    }    
}

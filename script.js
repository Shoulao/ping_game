var canvas;
var canvasContext;
var ballX = 50;
var ballY = 100;
var ballSpeedX = 10;
var ballSpeedY = 5; 
const PADDLE_THICKNESS = 10;
var paddle1Y = 250;
var paddle2Y = 250;
const PADDLE_HEIGHT = 100;
var stage = 1;
var showingWinScreen = false;
var player1Score = 0;
var player2Score = 0;

window.onload = function() {
    canvas = document.getElementById('gameCanvas');
    canvasContext = canvas.getContext('2d');
    var framesPerSecond = 60;
    if(stage === 1) {
        setInterval(function() {
            drawEverything();
            moveEverything();
        }, 1000/framesPerSecond);
    }
    canvas.addEventListener('mousemove', function(e) {
        var mousePos = calculateMousePosition(e);
        paddle1Y = mousePos.y-(PADDLE_HEIGHT/2);
    });

    canvas.addEventListener('mousedown', function(e) {
        showingWinScreen = false;
        ballReset();
        scoreReset();
    });
};

function moveEverything() {
    computerMovement();
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    if(ballX > canvas.width-30) {
        if(ballY > (paddle2Y-15) && ballY < (paddle2Y+PADDLE_HEIGHT+15)) {
            ballSpeedX = -ballSpeedX;
            var deltaY = ballY - (paddle2Y+PADDLE_HEIGHT/2);
            ballSpeedY = deltaY * 0.35;
        } else {
            ballReset();
            player1Score++;
            stage++;
        }
    } else if(ballX < 30) {
        if(ballY > (paddle1Y-15) && ballY < (paddle1Y+PADDLE_HEIGHT+15)) {
            ballSpeedX = -ballSpeedX;
            var deltaY = ballY - (paddle1Y+PADDLE_HEIGHT/2);
            ballSpeedY = deltaY * 0.35;
        } else {
            ballReset();
            player2Score++;
            stage++;
        }
    }

    if(ballY > canvas.height) {
        ballSpeedY = -ballSpeedY;
    } else if(ballY < 5) {
        ballSpeedY = -ballSpeedY;
    }
}

function drawEverything() {
    if(stage < 5) {
        colorRect(0, 0, canvas.width, canvas.height, 'black')
        // left player
        drawNet();
        colorRect(10 ,paddle1Y, PADDLE_THICKNESS, PADDLE_HEIGHT, 'green');
        //ball
        colorArc(ballX, ballY, 10, 'orange');
        //right player
        colorRect((canvas.width-PADDLE_THICKNESS-10),paddle2Y, 10, PADDLE_HEIGHT, 'red');
        //text
        canvasContext.fillStyle = 'rgba(255, 255, 255, 0.5)';
        canvasContext.font = 'bold 20px Helvetica';
        canvasContext.fillText(`STAGE: ${stage}`, 30, 50);
        canvasContext.font = 'bold 26px Helvetica';
        canvasContext.fillText(`PLAYER I: ${player1Score}`, 50, 300)
        canvasContext.fillText(`PLAYER II: ${player2Score}`, 600, 300)
    } else if(stage === 5){
        showingWinScreen = true;
        if((player1Score > player2Score) && showingWinScreen) {
            colorRect(0, 0, canvas.width, canvas.height, 'lightgreen')
            canvasContext.fillStyle = 'black';
            canvasContext.font = 'bold 26px Helvetica';
            canvasContext.fillText(`PLAYER I WIN`, 320, 100);
            canvasContext.fillStyle = 'white';
            canvasContext.font = 'bold 14px Helvetica';
            canvasContext.fillText(`click to continue`, 350, 550);
        } else if((player1Score < player2Score) && showingWinScreen) {
            colorRect(0, 0, canvas.width, canvas.height, 'crimson')
            canvasContext.fillStyle = 'black';
            canvasContext.font = 'bold 26px Helvetica';
            canvasContext.fillText(`PLAYER II WIN`, 320, 100)
            canvasContext.fillStyle = 'white';
            canvasContext.font = 'bold 14px Helvetica';
            canvasContext.fillText(`click to continue`, 350, 550);
        }
    }
}

function drawNet() {
    for(var i=0;i<canvas.height; i+=40) {
        colorRect(canvas.width/2-1, i, 2, 20, "white")
    }
}

function colorRect(leftX, topY, width, height, drawColor) {
    canvasContext.fillStyle = drawColor;
    canvasContext.fillRect(leftX, topY, width, height);
}

function colorArc(centerX, centerY, radius, drawColor) {
    canvasContext.fillStyle = drawColor;
    canvasContext.beginPath();
    canvasContext.arc(centerX, centerY, radius, 0, Math.PI*2, true);
    canvasContext.fill();
}

function calculateMousePosition(e) {
    var rect = canvas.getBoundingClientRect();
    var root = document.documentElement;
    var mouseX = e.clientX - rect.left - root.scroolLeft;
    var mouseY = e.clientY - rect.top - root.scrollTop;

    return {
        x: mouseX,
        y: mouseY
    }
}

function ballReset() {
    ballSpeedY = -ballSpeedY/ballSpeedY * 5;
    ballSpeedX = -ballSpeedX/ballSpeedX * 10;
    ballX = canvas.width/2;
    ballY = canvas.height/2;
}

function scoreReset() {
    player1Score = 0;
    player2Score = 0;
    stage = 1;
}

function computerMovement() {
    var paddle2YCenter = paddle2Y + (PADDLE_HEIGHT/2);
    if(paddle2YCenter < ballY-35) {
        switch(stage) {
            case 1:
                paddle2Y += 6;
                break;
            case 2:
                paddle2Y += 7;
                break;
            case 3:
                paddle2Y += 8;
                break;
            case 4:
                paddle2Y += 9;
                break;
            default:
                paddle2Y += 6;
        }
    } else if(paddle2YCenter > ballY+35){
        switch(stage) {
            case 1:
                paddle2Y -= 6;
                break;
            case 2:
                paddle2Y -= 7;
                break;
            case 3:
                paddle2Y -= 8;
                break;
            case 4:
                paddle2Y -= 9;
                break;
            default:
                paddle2Y -= 6;
        }
    }
}
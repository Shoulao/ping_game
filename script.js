var canvas;
var canvasContext;
var ballXPos = 50;
var ballYPos = 100;
var bSpeedX = 10;
var bSpeedY = 5; 
const PADDLE_THICKNESS = 10;
const SPEED_INC_RATE = 1.03;
var paddle1Y = 250;
var paddle2Y = 250;
const PADDLE_HEIGHT = 100;
var PADDLE_RIGHT_HEIGHT = 100;
var stage = 1;
var showingWinScreen = false;
var player1Score = 0;
var player2Score = 0;

window.onload = function() {
    canvas = document.getElementById('gameCanvas');
    canvasContext = canvas.getContext('2d');
    var framesPerSecond = 50;
    if(stage === 1) {
        setInterval(function() {
            startDrawing(stage);
            moveEverything();
        }, 1000/framesPerSecond);
    }
    canvas.addEventListener('mousemove', function(e) {
        var mousePos = calculateMousePosition(e);
        paddle1Y = mousePos.y-(PADDLE_HEIGHT/2);
    });

    canvas.addEventListener('mousedown', function(e) {
        scoreReset();
        bReset();
        showingWinScreen = false;
    });
};

function moveEverything() {
    computerMovement(stage);
    ballXPos += bSpeedX;
    ballYPos += bSpeedY;

    if(ballXPos > canvas.width-30) {
        if(ballYPos > (paddle2Y-15) && ballYPos < (paddle2Y+PADDLE_HEIGHT+15)) {
            bSpeedX = -bSpeedX * SPEED_INC_RATE;
            var delY = ballYPos - (paddle2Y+PADDLE_HEIGHT/2);
            bSpeedY = delY * 0.35;
        } else {
            bReset();
            player1Score++;
            stage++;
        }
    } else if(ballXPos < 30) {
        if(ballYPos > (paddle1Y-15) && ballYPos < (paddle1Y+PADDLE_HEIGHT+15)) {
            bSpeedX = -bSpeedX * SPEED_INC_RATE;
            var delY = ballYPos - (paddle1Y+PADDLE_HEIGHT/2);
            bSpeedY = delY * 0.35;
        } else {
            bReset();
            player2Score++;
            stage++;
        }
    }

    if(ballYPos > canvas.height) {
        bSpeedY = -bSpeedY;
    } else if(ballYPos < 5) {
        bSpeedY = -bSpeedY;
    }
}

function startDrawing(stage) {
    if(stage < 7) {
        colorRect(0, 0, canvas.width, canvas.height, 'black')
        // left player
        drawNet();
        colorRect(10 ,paddle1Y, PADDLE_THICKNESS, PADDLE_HEIGHT, 'green');
        //ball
        colorArc(ballXPos, ballYPos, 10, 'orange');
        //right player
        colorRect((canvas.width-PADDLE_THICKNESS-10),paddle2Y, 10, paddleRightHeight(stage), paddleRightColor(stage));
        //text
        canvasContext.fillStyle = 'rgba(255, 255, 255, 0.5)';
        canvasContext.font = 'bold 20px Helvetica';
        canvasContext.fillText(`STAGE: ${stage}`, 30, 50);
        canvasContext.font = 'bold 26px Helvetica';
        canvasContext.fillText(`PLAYER I: ${player1Score}`, 50, 300)
        canvasContext.fillText(`PLAYER II: ${player2Score}`, 600, 300)
    } else if(stage === 7){
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

function paddleRightHeight(stage) {
    switch(stage) {
        case 1:
            PADDLE_RIGHT_HEIGHT = 100;
            break;
        case 2:
            PADDLE_RIGHT_HEIGHT = 150;
            break;
        case 3:
            PADDLE_RIGHT_HEIGHT = 200;
            break;  
        case 4:
            PADDLE_RIGHT_HEIGHT = 250;
            break; 
        default: 
            PADDLE_RIGHT_HEIGHT = 100;
    }
    return PADDLE_RIGHT_HEIGHT;
}

function paddleRightColor(stage) {
    var paddleColor;
    switch(stage) {
        case 1:
            paddleColor = 'beige';
            break;
        case 2:
            paddleColor = 'yellow';
            break;
        case 3:
            paddleColor = 'orange';
            break;  
        case 4:
            paddleColor = 'crimson';
            break; 
        case 5:
            paddleColor = 'red';
            break; 
        case 6:
            paddleColor = 'deeppink';
            break;
        default: 
            paddleColor = 'white';
    }
    return paddleColor;
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
    var mouseX = e.clientX - rect.left - root.scrollLeft;
    var mouseY = e.clientY - rect.top - root.scrollTop;

    return {
        x: mouseX,
        y: mouseY
    }
}

function bReset() {
    ballResetPosition();
    bSpeedX = 0;
    bSpeedY = 0;
    setTimeout(function() {
        bSpeedX = 10;
        bSpeedY = 5;
    }, 1500)
}

function ballResetPosition() {
    ballXPos = canvas.width/2;
    ballYPos = canvas.height/2;
}

function ballResetSpeed() {
    bSpeedY = -bSpeedY;
    bSpeedX = -bSpeedX;
}

function scoreReset() {
    player1Score = 0;
    player2Score = 0;
    stage = 1;
}

function computerMovement(stage) {
    var paddle2YCenter = paddle2Y + (PADDLE_HEIGHT/2);
    if(paddle2YCenter < ballYPos-20) {
        switch(stage) {
            case 1:
                paddle2Y += 6;
                break;
            case 2:
                paddle2Y += 15;
                break;
            case 3:
                paddle2Y += 25;
                break;
            case 4:
                paddle2Y += 30;
                break;
            case 5:
                paddle2Y += 35;
                break;
            case 6:
                paddle2Y += 40;
                break;
            case 7:
                paddle2Y += 45;
                break;
            default:
                paddle2Y += 6;
        }
        return paddle2Y;
    } else if(paddle2YCenter > ballYPos+20){
        switch(stage) {
            case 1:
                paddle2Y -= 6;
                break;
            case 2:
                paddle2Y -= 15;
                break;
            case 3:
                paddle2Y -= 25;
                break;
            case 4:
                paddle2Y -= 30;
                break;
            case 5:
                paddle2Y -= 35;
                break;
            case 6:
                paddle2Y -= 40;
                break;
            case 7:
                paddle2Y -= 45;
                break;
            default:
                paddle2Y -= 6;
        }
        return paddle2Y;
    }
}
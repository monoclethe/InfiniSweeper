const drawArea = document.getElementById("playArea");
const ctx = drawArea.getContext("2d");
ctx.font = "10px Arial";

function drawNum (centerX, centerY, n, scale) {
    setDrawColor("white")
}

function drawLine (x0, y0, x1, y1) {
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.stroke()
}

function drawRect (posX, posY, dimX, dimY, color) {
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.rect(posX - dimX/2, posY-dimY/2, dimX, dimY);
    ctx.stroke();
}

function setDrawColor (color) {
    ctx.strokeStyle = color;
} 

setDrawColor("white");

function drawText (text, x, y, color, scale) {
    ctx.font = scale + "px Arial";
    ctx.fillStyle = color;
    ctx.fillText(text, x, y);
}

window.addEventListener("resize", function () {
    //resize canvas to keep proportional with window
    drawArea.width = window.innerWidth;
    drawArea.height = window.innerHeight * .95;
    drawGame();
})

//each cell should be 20vw by 20vw, cell 0,0 should be at
//center of canvas

var mineDistribution = 0.16;

const modGrid = [
    [0, 0],
    [1, 0],
    [-1, 0],
    [0, 1],
    [1, 1],
    [-1, 1],
    [0, -1],
    [1, -1],
    [-1, -1]
]

//tileType, isRevealed
var map = {
    "-1|-1": [0, true],
    "-1|0": [0, true],
    "-1|1": [0, true],
    "0|-1": [0, true],
    "0|0": [-1, true],
    "0|1": [0, true],
    "1|-1": [0, true],
    "1|0": [0, true],
    "1|1": [0, true]
}
var unassignedTiles = [
    "-1|-1",
    "-1|0",
    "-1|1",
    "0|-1",
    "0|1",
    "1|-1",
    "1|0",
    "1|1"
]
var exposedTiles = [
    "-1|-1",
    "-1|0",
    "-1|1",
    "0|-1",
    "0|1",
    "1|-1",
    "1|0",
    "1|1"
];
var flaggedTiles = [];

const orthoGrid = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1]
]

function lookupTile (x, y) {
    return map[x + "|" + y];
}

function checkTile (x, y) {
    return lookupTile(x, y) != undefined;
}

//how many cells fit vertically on the canvas
var cellDimY;
//how many cells fit horizontally on the canvas
const cellDimX = 25;

var cellDim;

var cameraLocation = [0, 0];

function drawGame () {
    console.log("frame rendered")
    //figure out how many cells fit vertically (round up)
    cellDimY = Math.ceil(drawArea.height / (drawArea.width / cellDimX));
    
    //calculate cell dimension
    cellDim = window.innerWidth/cellDimX;

    //draw numbered cells
    let cellXOffset = Math.floor(cameraLocation[0]);
    let cellYOffset = Math.floor(cameraLocation[1]);
    let drawPosOffsetX = cameraLocation[0] - cellXOffset;
    let drawPosOffsetY = cameraLocation[1] - cellYOffset;
    drawMineNumber(1, -100, -100); //if this line of code isn't here it breaks
    for (let y = -1 * cellYOffset - 1; y < cellDimY - cellYOffset + 1; y++) {
        for (let x = -1 * cellXOffset - 1; x < cellDimX - cellXOffset + 1; x++) {
            let cellID = Math.floor(x - cellDimX/2) + "|" + Math.floor(y - cellDimY/2);
            let drawX = (x + cellXOffset + drawPosOffsetX) * cellDim;
            let drawY = (y + cellYOffset + drawPosOffsetY) * cellDim;
            let numDisp = 0;
            if (map[cellID] !== undefined) {
                    if (map[cellID][1]){
                    drawRect(drawX, drawY, cellDim, cellDim, "white");
                    numDisp = map[cellID][0];
                    drawMineNumber(numDisp, drawX, drawY);
                }
            }
        }
    }
}

const numberColorMap = {
    1: "#2020e0",
    2: "#20e020",
    3: "#e02020",
    4: "#0000c0",
    5: "#c00000",
    6: "#20e0e0",
    7: "#404040",
    8: "#c0c0c0"
}

function drawFillRect(x0, y0, x1, y1, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x0, y0, x1, y1);
}

function drawMineNumber (n, drawX, drawY) {
    if (n == -1) {
        drawRect(drawX, drawY, cellDim*6/8, cellDim*6/8, "green");
    } else if (n < 9 && n > 0) {
        let textWidth = ctx.measureText(n).width;
        let textHeight = ctx.measureText(n).actualBoundingBoxAscent + ctx.measureText(n).actualBoundingBoxDescent;
        drawText(n, drawX, drawY, numberColors[n], cellDim);
    } else if (n == 10) {
        drawFillRect(drawX-(cellDim*3/8), drawY+(cellDim*3/8), (cellDim*6/8), (cellDim*1/16), "gray");
        drawFillRect(drawX-(cellDim*5/16), drawY+(cellDim*5/16), (cellDim*5/8), (cellDim*1/8), "gray");
        drawFillRect(drawX-(cellDim*1/32), drawY, (cellDim*1/16), (cellDim*3/8), "gray");
        drawFillRect(drawX-(cellDim*3/32), drawY-(cellDim*3/8), (cellDim*1/8), (cellDim*3/8), "red");
        drawFillRect(drawX-(cellDim*3/16), drawY-(cellDim*5/16), (cellDim*1/8), (cellDim*2/8), "red");
        drawFillRect(drawX-(cellDim*9/32), drawY-(cellDim*2/8), (cellDim*1/8), (cellDim*1/8), "red");
        drawFillRect(drawX-(cellDim*6/16), drawY-(cellDim*7/32), (cellDim*1/8), (cellDim*1/16), "red");
    } else if (n == 9) {
        drawFillRect(drawX-(cellDim*3/8), drawY-(cellDim*3/8), cellDim*6/8, cellDim*6/8, "yellow");
    }
}

drawArea.width = window.innerWidth;
drawArea.height = window.innerHeight * .95;
drawGame();


var scroll = false;
document.addEventListener('mousedown', function(event) {
    if (event.button === 0) {
        scroll = true;
        lastMouseX = mouseX;
        lastMouseY = mouseY;
        var scrollController = setInterval(function () {
            if (!scroll) {
                clearInterval(scrollController);
            }
            cameraLocation[0] += (mouseX - lastMouseX)/cellDim;
            cameraLocation[1] += (mouseY - lastMouseY)/cellDim;
            lastMouseX = mouseX;
            lastMouseY = mouseY;
            ctx.clearRect(0, 0, drawArea.width, drawArea.height);
            drawGame();
        }, 1000/60)
    }
});
document.addEventListener('mouseup', function(event) {
    if (event.button === 0) {
        scroll = false;
    }
});
var mouseX;
var mouseY;
document.addEventListener("mousemove", function(event) {
    mouseX = event.clientX;
    mouseY = event.clientY;
})
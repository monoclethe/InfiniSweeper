//load canvas element
const canvas = document.getElementById("playArea");
const ctx = canvas.getContext("2d");

//Load Utils
canvasUtilsInit();

//Variable definitions
var gameActive = true;

var cells = [
    "x|y",
    "0|0"
]
var types = {
    //Type info: 0-8: free cells | 9: mine
    "x|y": ["type"],
    "0|0": 0
}
var visibility = {
    //Visibility info: false: covered | true: uncovered
    "x|y": ["visibility"],
    "0|0": true
}
var edgeTiles = [
    "0|0"
]
var flagged = [

]

var scale = 25;

var cameraPos = [-1, -1];

var difficulty = .16

//Generation function
function generate () {
    let newEdgeTiles = [];
    for (tile of edgeTiles) {
        let coords = tile.split("|");
        let mines = 0;
        if (visibility[tile]) {
            for (let yMod = -1; yMod < 2; yMod++) {
                for (let xMod = -1; xMod < 2; xMod++) {
                    let newCoords = [parseInt(coords[0]) + xMod, parseInt(coords[1]) + yMod];
                    let newID = newCoords[0] + "|" + newCoords[1];
                    if (cells.includes(newID)) {
                        if (types[newID] == 9) {
                            mines++;
                        }
                    } else {
                        let mine = true;
                        if (Math.random() > difficulty) {
                            mine = false;
                        }
                        cells.push(newID);
                        visibility[newID] = false;
                        newEdgeTiles.push(newID);
                        if (mine) {
                            mines++;
                            types[newID] = 9;
                        } else {
                            types[newID] = 0;
                        }
                    }
                }
            }
            if (types[tile] !== 9) {
                types[tile] = mines;
            }

            for (let yMod = -1; yMod < 2; yMod++) {
                for (let xMod = -1; xMod < 2; xMod++) {
                    let newCoords = [parseInt(coords[0]) + xMod, parseInt(coords[1]) + yMod];
                    let newID = newCoords[0] + "|" + newCoords[1];

                    if ((types[tile] == 0)) {
                        visibility[newID] = true;
                    }
                }
            }


        } else {
            newEdgeTiles.push(tile);
        }
    }
    edgeTiles = newEdgeTiles
}

function arraysEqual(arr1, arr2) {
    if (arr1.length !== arr2.length) return false;
    for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i]) return false;
    }
    return true;
}

function clearOut() {
    let prevEdge = [];
    while (!arraysEqual(prevEdge, edgeTiles)) {
        prevEdge = [...edgeTiles];
        generate();
    }
    draw();
}

//Easier lookup for cells
function lookupXY (x, y, obj) {
    //Format the cell key
    let cellKey = x + "|" + y;
    //Detect if obj is an array
    if (Array.isArray(obj)) {
        //Test if cell exist in array
        return obj.includes(cellKey); 
    } else if (typeof obj === "object"){ //Else if dict
        //Return value from dict
        return obj[cellKey];
    }
}
let tileDimension = canvas.width/scale;
//Draw function
function draw () {
    //size canvas correctly
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight * .95;
    
    let cameraPosNormalized = [cameraPos[0] - Math.floor(cameraPos[0]), cameraPos[1] - Math.floor(cameraPos[1])];
    let tileOffset = [Math.floor(cameraPos[0]), Math.floor(cameraPos[1])];
    let tileDimension = canvas.width/scale;
    let openedMine = false;

    //How many tiles fit vertically/horizontally, add two to make sure
    //no gaps render
    let tileFitY = Math.ceil(canvas.height/tileDimension) + 2;
    let tileFitX = Math.ceil(scale) + 2
    //Loop over everything, drawing a square at the center

    for (let renderTileY = -1; renderTileY < tileFitY; renderTileY++) {
        for (let renderTileX = -1; renderTileX < tileFitX; renderTileX++) {
            
            let drawX = renderTileX * tileDimension + cameraPosNormalized[0] * tileDimension;
            let drawY = renderTileY * tileDimension + cameraPosNormalized[1] * tileDimension;
            
            let IDX = renderTileX - tileOffset[0] - Math.round(tileFitX/2);
            let IDY = renderTileY - tileOffset[1] - Math.round(tileFitY/2);
            let tileID = IDX + "|" + IDY;
            
            if (cells.includes(tileID) && !flagged.includes(tileID)) {
                if (visibility[tileID] == true) {
                    rectFill(drawX - tileDimension/2, drawY - tileDimension/2, drawX + tileDimension/2, drawY + tileDimension/2, "#222230");
                    rectOutline(renderTileX * tileDimension - tileDimension/2 + cameraPosNormalized[0] * tileDimension, renderTileY * tileDimension - tileDimension/2 + cameraPosNormalized[1] * tileDimension, renderTileX * tileDimension + tileDimension/2  + cameraPosNormalized[0] * tileDimension, renderTileY * tileDimension + tileDimension/2 + cameraPosNormalized[1] * tileDimension, "#3c3c54");
                    drawCellValue(types[tileID], drawX , drawY);
                    if (types[tileID] == 9) {
                        openedMine = true;
                    }
                } else {
                    /*
                    triFill(drawX, drawY, drawX - tileDimension/2 + 1, drawY - tileDimension/2 + 1, drawX + tileDimension/2 - 1, drawY - tileDimension/2 + 1, "#232343");
                    triFill(drawX, drawY, drawX - tileDimension/2 + 1, drawY - tileDimension/2 + 1, drawX - tileDimension/2 + 1, drawY + tileDimension/2 - 1, "#151526"); 
                    triFill(drawX, drawY, drawX + tileDimension/2 - 1, drawY - tileDimension/2 + 1, drawX + tileDimension/2 - 1, drawY + tileDimension/2 - 1, "#151526");
                    triFill(drawX, drawY, drawX - tileDimension/2 + 1, drawY + tileDimension/2 - 1, drawX + tileDimension/2 - 1, drawY + tileDimension/2 - 1, "#07070d");
                    rectFill(drawX - tileDimension*7/16, drawY - tileDimension*7/16, drawX + tileDimension*7/16, drawY + tileDimension*7/16, "#111120");
                    */
                }
            } else if (flagged.includes(tileID)) {
                drawCellValue(10, drawX, drawY)
            }
        }
    }
    if (openedMine) {
        gameActive = false;
        gameEnd();
    }
}
var mDisp = document.getElementById("mousePos");
function mousePos () {
    let cameraPosNormalized = [cameraPos[0] - Math.floor(cameraPos[0]), cameraPos[1] - Math.floor(cameraPos[1])];
    let tileOffset = [Math.floor(cameraPos[0]), Math.floor(cameraPos[1])];
    let tileFitY = Math.ceil(canvas.height/tileDimension) + 2;
    let tileFitX = Math.ceil(scale) + 2;
    let hoverX = Math.round(mouseX / tileDimension - cameraPosNormalized[0]) - tileOffset[0] - Math.round(tileFitX/2);
    let hoverY = Math.round((mouseY - window.innerHeight * 0.05) / tileDimension - cameraPosNormalized[1]) - tileOffset[1] - Math.round(tileFitY/2);
    return hoverX + "|" + hoverY
}

const numberColors = [undefined, "66A4DD", "50A050", "CC6677", "BB77DD", "AA9900", "55AAAA", "999999", "CCCCCC"]
function drawCellValue(n, drawX, drawY) {
    if (0 < n && n <= 8) { //number cells
        drawText(n, drawX, drawY, tileDimension, "#" + numberColors[n]);
    } else if (n == 10) { //mine cells
        
        rectFill(drawX - tileDimension*0/16, drawY + tileDimension*5/16, drawX + tileDimension*1/16, drawY-tileDimension*7/16, "gray");
        rectFill(drawX - tileDimension*7/16, drawY + tileDimension*7/16, drawX + tileDimension*7/16, drawY+tileDimension*6/16, "#555");
        rectFill(drawX - tileDimension*6/16, drawY + tileDimension*6.05/16, drawX + tileDimension*6/16, drawY+tileDimension*5/16, "#555");
        rectFill(drawX - tileDimension*1/16, drawY + tileDimension*0/16, drawX + tileDimension*0/16, drawY-tileDimension*7/16, "red");
        rectFill(drawX - tileDimension*3/16, drawY - tileDimension*1/16, drawX - tileDimension*.95/16, drawY-tileDimension*6/16, "red");
        rectFill(drawX - tileDimension*5/16, drawY - tileDimension*2/16, drawX - tileDimension*2.95/16, drawY-tileDimension*5/16, "red");
        rectFill(drawX - tileDimension*7/16, drawY - tileDimension*3/16, drawX - tileDimension*4.95/16, drawY-tileDimension*4/16, "red");
    } else if (n == 9) {
        rectFill(drawX - tileDimension*1/16, drawY + tileDimension*7/16, drawX + tileDimension*1/16, drawY + tileDimension*5/16, "yellow");
        rectFill(drawX - tileDimension*1/16, drawY + tileDimension*3/16, drawX + tileDimension*1/16, drawY - tileDimension*7/16, "yellow");
    }
}

//Scrolling
var scroll = false;
var clickScroll = false;
document.addEventListener('mousedown', function(event) {
    if (gameActive && mouseY > window.innerHeight * 0.05) {
        let startCameraPos;
        if (event.button === 0) {
            startCameraPos = [... cameraPos];
            clickScroll = true;
            scroll = true;
            lastMouseX = mouseX;
            lastMouseY = mouseY;
            var scrollController = setInterval(function () {
                if (!scroll) {
                    clickScroll = !arraysEqual(cameraPos, startCameraPos);
                    processClick();
                    clearInterval(scrollController);
                }
                cameraPos[0] += (mouseX - lastMouseX)/tileDimension;
                cameraPos[1] += (mouseY - lastMouseY)/tileDimension;
                lastMouseX = mouseX;
                lastMouseY = mouseY;
                ctx.clearRect(0, 0, playArea.width, playArea.height);
                draw();
            }, 1000/60)
        }
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

window.addEventListener("resize", function () {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight * .95;
    tileDimension = canvas.width / scale;
    draw();
})

function processRightClick () {
    if (gameActive) {
        let tileClick = mousePos();
        //check if target tile exists
        if (!visibility[tileClick] && cells.includes(tileClick) && (types[tileClick] !== 9 || !visibility[tileClick])) {
            //toggle flag
            if (flagged.includes(tileClick)) {
                flagged = flagged.filter(item => item !== tileClick);
            } else {
                flagged.push(tileClick);
                if (visibility[tileClick]) {
                    
                }
            }
        } else if (!cells.includes(tileClick)) {
            //if target doesn't exist, create it
            cells.push(tileClick);
            visibility[tileClick] = false;
            edgeTiles.push(tileClick);
            flagged.push(tileClick);
        }
        draw();
    }
}

function countAround (tile) {
    coords = tile.split("|");
    let tileMines = 0;
    let trapped = false;
    if (types[tile] > 0 && types[tile] < 9) {
        console.log("clicked number")
        for (let yMod = -1; yMod < 2; yMod++) {
            for (let xMod = -1; xMod < 2; xMod++) {
                let newCoords = [parseInt(coords[0]) + xMod, parseInt(coords[1]) + yMod];
                let newID = newCoords[0] + "|" + newCoords[1];
                if (flagged.includes(newID)) {
                    tileMines++;
                } else if (types[newID] == 9) {
                    trapped = true;
                    console.log(trapped)
                }
            }
        }
        if (tileMines == types[tile]) {
            for (let yMod = -1; yMod < 2; yMod++) {
                for (let xMod = -1; xMod < 2; xMod++) {
                    let newCoords = [parseInt(coords[0]) + xMod, parseInt(coords[1]) + yMod];
                    let newID = newCoords[0] + "|" + newCoords[1];
                    visibility[newID] = true;

                }
            }
        }
    }
    clearOut();
}

function processClick () {
    //make sure not scrolling
    if (!clickScroll) {
        let tileClick = mousePos();
        countAround(tileClick);
        //check if target tile exists
        if (cells.includes(tileClick)) {
            //if target is hidden, reveal it and clear around
            if (!visibility[tileClick]) {
                visibility[tileClick] = true;
                clearOut();
            }
        } else {
            //if target doesn't exist, create it
            cells.push(tileClick);
            visibility[tileClick] = true;
            edgeTiles.push(tileClick);
            clearOut();
        }
    } else {
        clickScroll = false;
    }
}

canvas.width = window.innerWidth;
canvas.height = window.innerHeight * .95;
clearOut();

function gameEnd () {
    rectFill(0, 0, canvas.width, canvas.height, "rgba(0, 0, 0, 0.5)");
    document.getElementById("endPopup").style.display = "block";
}
function restart() {
    document.getElementById("endPopup").style.display = "none";
    gameActive = true;

    cells = [
        "x|y",
        "0|0"
    ]
    types = {
        //Type info: 0-8: free cells | 9: mine
        "x|y": ["type"],
        "0|0": 0
    }
    visibility = {
        //Visibility info: false: covered | true: uncovered
        "x|y": ["visibility"],
        "0|0": true
    }
    edgeTiles = [
        "0|0"
    ]
    flagged = [

    ]
    draw();
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight * .95;
    clearOut();
}
function difficultyBar () {
    difficulty = document.getElementById("difficulty").value;
    let dDisp = document.getElementById("dDisp");
    if (difficulty == 0.1) {
        dDisp.innerHTML = "Easy"
    } else if (difficulty <= 0.14) {
        dDisp.innerHTML = "Medium";
    } else if (difficulty <= 0.18) {
        dDisp.innerHTML = "Hard";
    } else if (difficulty <= 0.20) {
        dDisp.innerHTML = "Extreme";
    } else if (difficulty <= 0.24) {
        dDisp.innerHTML = "Impossible";
    }
}

document.addEventListener("keydown", function (event) {
    try {
    if (event.key == "ArrowDown" ) {
            scale *= 1.25;
            tileDimension = canvas.width/scale;
            draw();
    } else if (event.key == "ArrowUp") {
            scale = scale / 1.25;
            tileDimension = canvas.width/scale;
            draw();
    } else if (event.key == "f") {
        processRightClick();
    } else if (event.key == "d") {
        clickScroll = false;
        processClick();
    }
    } catch (err) {
        alert(err);
    }
})
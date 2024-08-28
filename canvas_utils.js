function canvasUtilsInit () { //put this in your script
    console.log("Canvas Utils Loaded");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight * .95;
}

function line (x0, y0, x1, y1, color) {
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.stroke();
    
}

function rectOutline (x0, y0, x1, y1, color) {
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.strokeRect(x0, y0, x1-x0, y1-y0);
    ctx.closePath();
}

function rectFill (x0, y0, x1, y1, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x0, y0, x1-x0, y1-y0);
    ctx.closePath();
}

function drawText(text, x, y, size, color) {
    ctx.font = size + "px Arial";
    let textWidth = ctx.measureText(text).width;
    let textHeight = ctx.measureText(text).actualBoundingBoxAscent + ctx.measureText(text).actualBoundingBoxDescent;
    dText(text, x - textWidth/2, y + textHeight/2, color, size);
}

function dText (text, x, y, color, scale) {
    ctx.font = scale + "px Arial";
    ctx.fillStyle = color;
    ctx.fillText(text, x, y);
    ctx.closePath();
}

function triFill (x0, y0, x1, y1, x2, y2, color) {
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
}
var canvas, ctx;
var mouseX, mouseY, mouseDown=0;
var touchX, touchY;
var lastX, lastY = -1;
var image_data;

function drawLine(ctx, x, y) {
    if (lastX==-1) {
        lastX=x;
        lastY=y;
    }
    ctx.strokeStyle = "white";
    ctx.lineCap = "round";
    ctx.lineWidth = 20;

    ctx.beginPath();
    ctx.moveTo(lastX,lastY);
    ctx.lineTo(x,y);
    ctx.stroke();
    ctx.closePath();

    lastX=x;
    lastY=y;
}

function clearCanvas(canvas, ctx) {
    ctx.fillStyle = "black";
    ctx.clearRect(0,0, canvas.width, canvas.height);
}

function sketchpad_mouseDown() {
    mouseDown=1; // boolean value True
    drawLine(ctx, mouseX, mouseY);
}

function sketchpad_mouseUp() {
    mouseDown=0; // boolean value False
    lastX=-1;
    lastY=-1;
}

function sketchpad_mouseMove(e) {
    getMousePos(e);

    if (mouseDown == 1) {
        drawLine(ctx, mouseX, mouseY);
    }
}

function getMousePos(e) {
    if (e.offsetX) {
        mouseX = e.offsetX;
        mouseY = e.offsetY;
    } else if (e.layerX) {
        mouseX = e.layerX;
        mouseY = e.layerY;
    }
}

function sketchpad_touchStart() {
    getTouchPos();
    drawLine(ctx, touchX, touchY);
    preventDefault();
}

function sketchpad_touchMove(e) {
    getTouchPos(e);
    drawLine(ctx, touchX, touchY);
    preventDefault();
}

function sketchpad_touchEnd() {
    lastX = -1;
    lastY = -1;
}

function getTouchPos(e) {
    if (e.touches) {
        if (e.touches.length == 1) {
            var touch = e.touches[0];
            touchX = touch.pageX - touch.target.offsetLeft;
            touchY = touch.pageY - touch.target.offsetTop;
        }
    }
}

function init() {
    canvas = document.getElementById('sketchpad');
    if (canvas.getContext)
        ctx = canvas.getContext('2d');
    ctx.fillStyle = 'black';
    ctx.fillRect = (0,0,canvas.width, canvas.height);
    if (ctx) {
        canvas.addEventListener('mousedown', sketchpad_mouseDown, false);
        canvas.addEventListener('mousemove', sketchpad_mouseMove, false);
        window.addEventListener('mouseup', sketchpad_mouseUp, false);
        
        canvas.addEventListener('touchstart', sketchpad_touchStart, false);
        canvas.addEventListener('touchmove', sketchpad_touchMove, false);
        canvas.addEventListener('touchend', sketchpad_touchEnd, false);

        image_data = canvas.toDataURL("image/png");
    }
}

const barChart = new Chart("barChart", {
    type: "bar",
    data: {
        labels:['1','2','3'],
        datasets: [{
            backgroundColor: ["red", "green", "blue"],
            data: [11, 22, 33]
        }]
    }
    // options: {...}
  });

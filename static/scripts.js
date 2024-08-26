let canvas, context, docChart, barChart;
let X, Y, mouseDown = 0;
let lastX, lastY = -1;


function init() {
    canvas = document.getElementById("sketchpad");
    if (canvas.getContext) context = canvas.getContext("2d");
    if (context) {
        // draw w/ mouse click
        canvas.addEventListener("mousedown", sketchpad_mouseDown);
        canvas.addEventListener("mousemove", sketchpad_mouseMove);
        window.addEventListener("mouseup", sketchpad_mouseUp);
        // draw on touch screen
        canvas.addEventListener("touchstart", sketchpad_mouseDown);
        canvas.addEventListener("touchmove", sketchpad_mouseMove);
        window.addEventListener("touchend", sketchpad_mouseUp);        
    }
    // initialize chart
    docChart = document.getElementById("barChart");
    var chartData = {
        labels: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
        datasets: [{
            label: 'Confidence Percentage',
            data: [0,0,0,0,0,0,0,0,0,0],
            borderWidth: 1
        }]
    };
    var chartOptions = {
        scales: {
            y: {
                min: 0,
                max: 100
            }
        }
    }
    barChart = new Chart(docChart, {
        type: "bar",
        data: chartData,
        options: chartOptions
    });
}

/** event handlers for drawing **/
function sketchpad_mouseDown(e) {
    mouseDown=1; // boolean value True
    getPos(e);
    drawLine(context, X, Y);
}
function sketchpad_mouseMove(e) {
    getPos(e);
    if (mouseDown == 1) drawLine(context, X, Y);
}
function sketchpad_mouseUp() {
    mouseDown = 0; // boolean value False
    lastX = -1;
    lastY = -1;
}
function clearCanvas() { // clear canvas
    context.clearRect(0,0, canvas.width, canvas.height);
}

/** helper methods for drawing **/
function drawLine(context, x, y) {
    if (lastX == -1) {
        lastX = x;
        lastY = y;
    }
    context.strokeStyle = "white";
    context.lineCap = "round";
    context.lineWidth = 20;

    context.beginPath();
    context.moveTo(lastX,lastY);
    context.lineTo(x,y);
    context.stroke();

    lastX = x;
    lastY = y;
}
function getPos(e) {
    if (e.offsetX) {
        X = e.offsetX;
        Y = e.offsetY;
    } else if (e.touches) {
        if (e.touches.length == 1) { // only 1 touch point
            let touch = e.touches[0];
            let offsets = canvas.getBoundingClientRect();
            let top = offsets.top;
            let left = offsets.left;

            X = touch.clientX - left;
            Y = touch.clientY - top;
        }
    }
}

/** predict the number using CNN **/
function predict() {
    let imageData = canvas.toDataURL();
    fetch('/_predict', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ image_data: imageData })
    })
    .then(response => response.json())
    .then(response => response.results) // get prediction probabilities
    .then(predictions => {
        // get CNN's guess (num w/ max probability)
        let num = predictions.indexOf(Math.max(...predictions));
        document.getElementById("predictionText").innerHTML = num;
        // update bar chart w/ probabilities
        barChart.data.datasets[0].data = predictions.map(confidence => confidence*100);
        barChart.update();
    })
    .catch(error => {
        console.log(error);
    })
}

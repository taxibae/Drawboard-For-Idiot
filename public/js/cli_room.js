/*Point Function*/
function Point(event, target) {
    this.x = event.pageX - $(target).position().left;
    this.y = event.pageX - $(target).position().top;
}

/*jQuery Code*/

$(document).ready(function () {
    //Canvas
    var canvas = document.getElementById('canvasboard');
    var context = canvas.getContext('2d');

    //Initialize Variable
    var width = 5;
    var opacity = 1.0;
    var pressure = 1.0;
    var color = '#000000';
    var isDown = false;
    var newPoint, oldPoint;

    //UI Configuration
    $('#colorpicker').farbtastic(function (data) {
        color = data;
    });

    //Event Connection
    canvas.addEventListener('mousedown', function(event){
        isDown = true;
        oldPoint = new Point(event, this);
    });
    canvas.addEventListener('mouseup', function(event){
        isDown = false;
    });
    canvas.addEventListener('mousemove', function(event){
        if(isDown){
            newPoint = new Point(event, this);
            socket.emit('draw', {
                width : width,
                color : color,
                x1 : oldPoint.x,
                y1 : oldPoint.y,
                x2 : newPoint.x,
                y2 : newPoint.y
            });
            oldPoint = newPoint;
        }
    });
    $('#sliderA').change(function (e) { 
        e.preventDefault();
        width = $(this).val();
    });
    $('#sliderB').change(function (e) { 
        e.preventDefault();
        opacity = $(this).val();
    });

    // Socket Event Connection
    var socket = io.connect();
    socket.emit('join', '<%=room %>');
    socket.on('line', function(data){
        context.lineWidth = data.width;
        context.strokeStyle = data.color;
        context.globalAlpha = opacity * pressure;
        context.beginPath();
        context.moveTo(data.x1,data.y1);
        context.moveTo(data.x2,data.y2);
        context.stroke();
    });
});
/*Point Function*/
function Point(event, target) {
    this.x = event.pageX - $(target).position().left;
    this.y = event.pageY - $(target).position().top;
}


/*jQuery Code*/
$(document).ready(function () {
    var canvas = document.getElementById('canvasboard');
    var contextBoard = canvas.getContext('2d');

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
        opacity = $(this).val() / 100;
    });

    // Socket Event Connection
    socket.on('line', function(data){
        contextBoard.lineWidth = data.width;
        contextBoard.strokeStyle = data.color;
        contextBoard.lineCap='round';
        contextBoard.globalAlpha = opacity * pressure;
        contextBoard.beginPath();
        contextBoard.moveTo(data.x1,data.y1);
        contextBoard.lineTo(data.x2,data.y2);
        contextBoard.stroke();
    });
});


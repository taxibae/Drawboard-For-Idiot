$(document).ready(function () {
    /*Ajax*/
    $.getJSON("/room", function (data, textStatus, jqXHR) {
        $.each(data, function (indexInArray, valueOfElement) { 
            $('<button></button>').attr({
                'data-room' : valueOfElement
            }).text('Room Name : ' + valueOfElement).appendTo('#container');
        });
    });
    
    /*Socket Event Connection*/
    var socket = io.connect();

    //Create Room Event driven by onclick Evevt
    socket.on('create_room', function(data){
        $('<button></button>').attr({
            'data-room' : data
        }).text('Room Name : '+data).appendTo('#container');
    });

    /*Button Event Connection*/
    $('#container').on('click','button', function () {
        var room = $(this).attr('data-room');
        location = '/canvas/'+room;
    });    

    $('body>button').click(function (e) { 
        e.preventDefault();
        var room = $('#room').val();
        socket.emit('create_room',room)
        location = '/canvas/'+room;
    });

});
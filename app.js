/*Reqire Modules*/
var socketio = require('socket.io');
var express = require('express');
var ejs = require('ejs');
var fs = require('fs');
var http = require('http');

/*Creating Webserver*/
var app = express();

/*Modules Setting*/
app.use(express.static('public'));

var server = http.createServer(app);
server.listen(52273, function() {
    console.log('App listening on port 52273!');
});

/*Routing*/
// Robby
app.get('/', function(req, res) {
    fs.readFile('lobby.html', function(error,data){
        var output = '';
        output += data;
        res.send(output);
    });
});
// Go to Room
app.get('/canvas/:room', function(req, res) {
    fs.readFile('canvas.html', 'utf8', function(error, data){
        res.send(ejs.render(data, {
            room : req.params.room
        }));
        //log
        console.log('Canvas requested room is ' +req.params.room);
    });
});
// Show Room List
app.get('/room', function(req, res) {
    console.log(io.sockets.adapter.rooms);
    var rooms = Object.keys(io.sockets.adapter.rooms).filter(function (item) {
        return item.indexOf('/') < 0;
    });
    //log
    console.log('Get room list by /room : ' +rooms);
    res.send(rooms);
});

/*Creating Socket Server*/
var io = socketio.listen(server);
var roomId = '';
io.sockets.on('connection', function (socket) {
    // Event Define
    //var roomId = '';
    
    socket.on('disconnect', function(reason){
        console.log('User 1 disconnected because '+reason);
    });

    socket.on('join', function (data) {
        //log
        console.log('Joining the room : ' + data);
        socket.join(data);
        roomId = data;
    });
    
    socket.on('draw', function (data) {
        //log
        console.log('Draw to room named : ' + roomId);
        io.sockets.to(roomId).emit('line', data);
    });

    socket.on('create_room', function (data) {
        //log
        console.log('Receive create_room : ' + data);
        io.sockets.emit('create_room',data);
    });
});
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

app.get('/', function(req, res) {
    fs.readFile('lobby.html', function(error,data){
        var output = '';
        output += data;
        res.send(output);
    });
});

/*Creating Socket Server*/
var io = socketio.listen(server);
io.sockets.on('connection', function (socket) {
    // Event Define
    console.log('Socket Connection');
});
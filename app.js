var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var messages = [];

app.use(express.static(__dirname + '/node_modules'));
app.get('/', function(req, res,next) {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(client) {
    console.log('Client connected...');

    client.on('join', function (data) {
        messages.push(data);
        console.log(messages);
    });

    client.on('messages', function(data) {
        messages.push(data);
        client.emit('messages', data);
    });
});



server.listen(3000);
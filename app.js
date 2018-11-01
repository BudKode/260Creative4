var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var messages = [];
var curr_index = 1;

app.use(express.static(__dirname + '/node_modules'));
app.get('/', function(req, res,next) {
    res.sendFile(__dirname + '/index.html');
});

function getFormattedTime() {
    let date = new Date();
    let hours = date.getHours() % 12 === 0 ? 12 : date.getHours() % 12;
    let minutes = (date.getMinutes()<10?'0':'') + date.getMinutes();
    return hours + ':' + minutes;
}

io.on('connection', function(client) {

    client.on('join', function (data) {
        client.emit('initial', messages);
        client.emit('broad', {sender: 'SlackExchange', time: getFormattedTime(), content: 'Welcome to SlackExchange. Pick a name or remain anonymous and start slacking away!'})
        client.emit('anonymous-index', {index: curr_index++})
    });

    client.on('messages', function(data) {
        console.log(data.content);
        messages.push(data);
        io.emit('broad', data);
    });
});



server.listen(3000);
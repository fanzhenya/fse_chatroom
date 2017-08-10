var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var Chatroom = require('./chatroom');

// app.set("view engine", "jade");
// app.set("views", __dirname + "/views");
app.use(express.static("public"));

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/views/index.html");
    // res.render("index");
});

http.listen(3000);

var room = new Chatroom();

io.on('connection', function (socket) {
    console.log("new connection: " + socket.id);

    socket.on('up user join', function (loginInfo, loginCallback) {
        var username = loginInfo.username;
        var password = loginInfo.password;
        if (room.isValidLogin(username, password, loginCallback)) {
            room.userJoin(username, function (history) {
                // push history to this user
                socket.emit("down message", history);
            });

            socket.username = username;

            // notify other users
            io.emit("down user join", username);
            console.log("join: " + JSON.stringify(loginInfo));
        } else {
            console.log("invalid join: " + JSON.stringify(loginInfo));
        }
    });

    socket.on('up user leave', function () {
        room.userLeave(socket.username);
        // notify other uses
        io.emit("down user leave", socket.username);
        console.log("leave: " + socket.username);
    });

    socket.on('disconnect', function () {
        room.userLeave(socket.username);
        // notify other uses
        io.emit("down user leave", socket.username);
        console.log("connection " + socket.id + " for user " + socket.username + " closed");
    });

    socket.on('up message', function (msg) {
        var now = new Date();
        now = now.toLocaleTimeString() + ' ' + now.toDateString();
        var message =  {
            username: msg.username,
            ts: now,
            text: msg.text
        };
        room.newMessage(message);
        io.emit('down message', message);
        console.log("socket " + socket.username + ": " + msg.text);
    });

});

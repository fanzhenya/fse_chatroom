var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static("public"));

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/views/index.html");
});

http.listen(3000);

var Chatroom = require('./chatroom');
var room = new Chatroom();

io.on('connection', function (socket) {
    console.log("new connection: " + socket.id);

    socket.on('up user register', function (registerInfo, registerCallback) {
        room.userRegister(registerInfo)
            .then(function () {
                registerCallback(true, "You can login now");
                console.log("registered: " + JSON.stringify(registerInfo));
            })
            .catch(function (reason) {
                registerCallback(false, reason);
                console.log("userRegister fail: " + reason + " " + JSON.stringify(registerInfo));
            });
    });

    socket.on('up user join', function (loginInfo, loginCallback) {
        room.userJoin(loginInfo)
            .then(function () {
                loginCallback(true);
                // push history to this user
                room.getHistoryMessages(function (history) {
                    socket.emit("down message", history);
                });

                socket.username = loginInfo.username;

                // notify other users
                io.emit("down user join", loginInfo.username, room.getOnlineUsers());
                console.log("joined: " + JSON.stringify(loginInfo));
            })
            .catch(function (reason) {
                loginCallback(false, reason);
                console.log("userJoin fail: " + reason + " " + JSON.stringify(loginInfo));
            });
    });

    var userLeaveHandler = function () {
        room.userLeave(socket.username);
        // notify other uses
        io.emit("down user leave", socket.username, room.getOnlineUsers());
        console.log("userLeave: " + socket.username);
    };

    socket.on('up user leave', userLeaveHandler);

    socket.on('disconnect', function() {
        if (socket.username) { //if user already joined
            userLeaveHandler();
        }
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

var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

// app.set("view engine", "jade");
// app.set("views", __dirname + "/views");
app.use(express.static("public"));

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/views/index.html");
    // res.render("index");
});

http.listen(3000);

function Chatroom() {


    // if not online and password correct, return true
    this.join = function (socketId, username) {
        this.onlineUsers[socketId] = username;
        // TODO
        return "ok";
    };

    this.leave = function (socketId) {
        delete this.onlineUsers[socketId];
    };
}

var chatroom = Chatroom();

onlineUsers = [];

function isValidLogin(username, password, callback) {
    // TODO: if username and password match

    // if not already online
    console.log(onlineUsers);
    if (onlineUsers.indexOf(username) === -1) {
        callback(true);
        return true;
    } else {
        callback(false, "You are already on line");
        return false;
    }
}

function userJoin(username) {
    onlineUsers.push(username);
    io.emit("down user join", username);
}

function userLeave(username) {
    onlineUsers.splice(onlineUsers.indexOf(username), 1);
    io.emit("down user leave", username);
}

function newMessage(msg) {
    var now = new Date();
    now = now.toLocaleTimeString() + ' ' + now.toDateString();
    io.emit('down message', {
        username: msg.username,
        ts: now,
        text : msg.text
    });
}

io.on('connection', function (socket) {
    console.log("new connection: " + socket.id);
    socket.on('up user join', function (loginInfo, callback) {
        var username = loginInfo.username;
        var password = loginInfo.password;
        if (isValidLogin(username, password, callback)) {
            userJoin(username);
            socket.username = username;
            console.log("join: " + JSON.stringify(loginInfo));
        } else {
            console.log("invalid join: " + JSON.stringify(loginInfo));
        }
    });

    socket.on('up user leave', function () {
        userLeave(socket.username);
        console.log("leave: " + socket.username);
    });

    socket.on('disconnect', function () {
        userLeave(socket.username);
        console.log("connection " + socket.id + " for user " + socket.username + " closed");
    });

    socket.on('up message', function (msg) {
        newMessage(msg);
        console.log("socket " + socket.username + ": " + msg.text);
    });

});

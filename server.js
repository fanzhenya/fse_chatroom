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

    this.onlineUsers = [];

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

io.on('connection', function (socket) {
    console.log("new connection: " + socket.id);
    socket.on('up user join', function (user) {
        var username = user.username;
        var password = user.password;
        console.log("join: " + JSON.stringify(user));
        io.emit("down user join", username);
    });

    socket.on('up user leave', function (user) {
        var username = user.username;
        console.log("leave: " + username + " ");
        io.emit("down user leave", username);
    });


    socket.on('up message', function (msg) {
        console.log("socket " + socket.id + ": " + msg.text);
        var now = new Date();
        now = now.toLocaleTimeString() + ' ' + now.toDateString();
        io.emit('down message', {
            username: msg.username,
            ts: now,
            text : msg.text
        });
    });

    socket.on('disconnect', function () {
        console.log("connection closed: " + socket.id);
    });

});

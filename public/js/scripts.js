// Empty JS for your own code to be here


var io = io();

var joinDiv = $("#join-div");
var chatDiv = $("#chat-div");
var inputUsername = $("#inputUsername3");
var inputPassword = $("#inputPassword3");
var messages = $('#messages');

var myUsername = null;

$('#join-form').submit(function () {
    var username = inputUsername.val();
    var password = inputPassword.val();
    var isRegister = document.getElementById("inputRegister3").checked;
    console.log(username + " " + password + " is register: " + isRegister);
    io.emit("up user join", {username: username, password: password, isRegister: isRegister});
    return false;
});

io.on('down user join', function (username) {
    if (username == inputUsername.val()) {
        joinDiv.hide();
        chatDiv.show();
        // server acked. So this is our username
        myUsername = username;
        $('#m').focus();
        $('#my-username').append(myUsername);
    } else {
        insertSystemInfo(username + " joined");
    }
});

$('#leave-btn').click(function () {
    console.log("leave:" + myUsername);
    io.emit("up user leave", {username: myUsername});
});

io.on('down user leave', function (username) {
    if (username == myUsername) {
        joinDiv.show();
        chatDiv.hide();
    } else {
        insertSystemInfo(username + " left");
    }
});

function insertSystemInfo(info) {
    messages.append('<li class="list-unstyled info" >' + info + '</li>');
}

$('#chat-form').submit(function () {
    io.emit('up message', {
        username: myUsername,
        text: $('#m').val()
    });
    $('#m').val('');
    return false;
});

io.on('down message', function (msg) {
    var formattedMsg = "<span class='message-meta'><b>" + msg.username + "</b>&nbsp;&nbsp;" + msg.ts + "<br></span>"
        + "&nbsp;&nbsp;" + msg.text + "<br>";
    messages.append('<li class="list-unstyled">' + formattedMsg + '</li>');
});

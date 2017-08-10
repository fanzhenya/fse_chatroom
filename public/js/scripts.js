// Empty JS for your own code to be here


$(function () {
    var socket = io.connect();

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
        var loginInfo = {username: username, password: password, isRegister: isRegister};
        socket.emit("up user join", loginInfo, function (isSuccess, msg) {
            if(!isSuccess) {
                alert("Error: " + msg);
            } else {
                joinDiv.hide();
                chatDiv.show();
                // server acknowledged. So this is our username
                myUsername = username;
                $('#m').focus();
                $('#my-username').html(myUsername);
            }
        });
        return false;
    });

    socket.on('down user join', function (username) {
        if (myUsername !== null && username !== inputUsername.val()) {
            // some other guy logged in.
            insertSystemInfo(username + " joined");
        }
    });

    // up user leave
    $('#leave-btn').click(function () {
        console.log("leave:" + myUsername);
        joinDiv.show();
        chatDiv.hide();
        myUsername = null;
        messages.empty();
        socket.emit("up user leave");
    });

    // down user leave
    socket.on('down user leave', function (username) {
        if(myUsername !== null) {
            insertSystemInfo(username + " left");
        }
    });

    function insertSystemInfo(info) {
        messages.append('<li class="list-unstyled info" >' + info + '</li>');
    }

    // up message
    $('#chat-form').submit(function () {
        if($('#m').val().length > 0) {
            socket.emit('up message', {
                username: myUsername,
                text: $('#m').val()
            });
            $('#m').val('');
        }
        return false;
    });

    // down message
    socket.on('down message', function (msg) {
        if(myUsername !== null) {
            var who = (msg.username === myUsername) ?
                "<span style='color: green'>me</span>" : msg.username;
            var formattedMsg = "<div class='well'><span class='message-meta'><b>"
                + who + "</b>&nbsp;&nbsp;" + msg.ts + "<br></span>" + "&nbsp;&nbsp;"
                + msg.text + "</div>";
            messages.append('<li class="list-unstyled">' + formattedMsg + '</li>');
            window.scrollTo(0,document.body.scrollHeight);
        }
    });
});

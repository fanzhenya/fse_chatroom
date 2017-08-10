// Empty JS for your own code to be here


$(function () {
    var socket = io.connect();

    var joinDiv = $("#join-div");
    var chatDiv = $("#chat-div");
    var inputUsername = $("#inputUsername3");
    var inputPassword = $("#inputPassword3");
    var messages = $('#messages');
    var onlineUsers = $('#online-users');

    var myUsername = null;

    $('#join-btn').click(function () {
        var username = inputUsername.val();
        var password = inputPassword.val();
        console.log(username + " " + password);
        var loginInfo = {username: username, password: password};
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
    });

    $('#register-btn').click(function () {
        var username = inputUsername.val();
        var password = inputPassword.val();
        console.log(username + " " + password);
        var registerInfo = {username: username, password: password};
        socket.emit("up user register", registerInfo, function (isSuccess, msg) {
            if(!isSuccess) {
                alert("Error: " + msg);
            } else {
                alert("Success: " + msg);
            }
        });
    });

    socket.on('down user join', function (username, onlineUsers) {
        if (myUsername !== null && username !== inputUsername.val()) {
            // some other guy logged in.
            insertSystemInfo(username + " joined");
        }
        updateOnlineUsers(onlineUsers);
    });

    // up user leave
    $('#leave-btn').click(function () {
        console.log("leave:" + myUsername);
        resetView();
        socket.emit("up user leave");
    });

    // down user leave
    socket.on('down user leave', function (username, onlineUsers) {
        if(myUsername !== null) { // if user has already joined
            insertSystemInfo(username + " left");
            updateOnlineUsers(onlineUsers);
        }
    });

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

    socket.on("disconnect", function () {
        resetView();
    });

    function resetView() {
        joinDiv.show();
        chatDiv.hide();
        myUsername = null;
        messages.empty();
    }

    function updateOnlineUsers (users) {
        onlineUsers.empty();
        users.forEach(function (t) {
            onlineUsers.append ('<li class="list-unstyled info" >' + t + '</li>');
        });
    }

    function insertSystemInfo(info) {
        messages.append('<li class="list-unstyled info" >' + info + '</li>');
        window.scrollTo(0,document.body.scrollHeight);
    }

});

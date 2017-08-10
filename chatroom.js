module.exports = Chatroom;
Promise = require("promise");

function Chatroom() {
    var db = require('./db');
    var onlineUsers = [];

    this.userRegister = function (registerInfo) {
        return db.getUserPromise(registerInfo.username)
            .then(function (user) {
                return new Promise(function (resol, rej) {
                    if (user) {
                        rej("user " + registerInfo.username + " already exist");
                    } else {
                        db.insertUser({
                            name: registerInfo.username,
                            password: registerInfo.password
                        });
                        db.getUsers();
                        resol();
                    }
                });
            }, function (reason) {
                console.error("db error: " + reason);
            });
    };

    this.userJoin = function (loginInfo) {
        return db.getUserPromise(loginInfo.username)
            .then(function (user) {
                return new Promise(function (resol, rej) {
                    if (!user) {
                        rej("user " + loginInfo.username + "does not exist");
                    } else if (user.password !== loginInfo.password) {
                        rej("wrong username + password combination");
                    } else if (onlineUsers.indexOf(loginInfo.username) !== -1) {
                        rej("user " + loginInfo.username + " is already online")
                    } else {
                        onlineUsers.push(loginInfo.username);
                        resol();
                    }
                });
            }, function (reason) {
                console.error("db error: " + reason);
            });
    };

    this.getHistoryMessages = function (historyCallback) {
        // onlineUsers.push(username);
        db.getMessages(historyCallback);
    };

    this.userLeave = function (username) {
        onlineUsers.splice(onlineUsers.indexOf(username), 1);
    };

    this.getOnlineUsers = function () {
        return onlineUsers;
    };

    this.newMessage = function (msg) {
        // msg persisting
        db.insertMessage(msg);
    };
}


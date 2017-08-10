module.exports = Chatroom;

function Chatroom() {
    this.db = require('./db');
    var onlineUsers = [];
    this.isValidLogin = function (username, password, callback) {
        // TODO: if username and password match

        // if not already online
        if (onlineUsers.indexOf(username) === -1) {
            callback(true);
            return true;
        } else {
            callback(false, username + " is already online");
            return false;
        }
    };

    this.userJoin = function (username, historyCallback) {
        onlineUsers.push(username);
        this.db.getMessages(historyCallback);
    };

    this.userLeave = function (username) {
        onlineUsers.splice(onlineUsers.indexOf(username), 1);
    };

    this.newMessage = function (msg) {
        // msg persisting
        this.db.insertMessage(msg);
    };
}


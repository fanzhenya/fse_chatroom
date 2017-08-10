var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('chatroom.db');
var Promise = require('promise');

db.serialize(function () {
    db.run("CREATE TABLE IF NOT EXISTS users " +
        "(name TEXT, password TEXT)");
    db.run("CREATE TABLE IF NOT EXISTS messages " +
        "(username INTEGER, text TEXT, ts TEXT)");
});


module.exports.insertUser = function (user) {
    db.run("INSERT INTO users VALUES (?, ?)", [user.name, user.password]);
};

module.exports.getUsers = function () {
    db.each("SELECT * FROM users", function (err, row) {
        if (err) console.log(err);
        console.log("got: " + JSON.stringify(row));
    });
};

module.exports.getUserPromise = function (username) {
    return new Promise(function (resolve, reject) {
        db.get("SELECT password FROM users WHERE name = ?", username, function (err, row) {
            if (err) reject(err);
            else resolve(row);
        });
    });
};

module.exports.insertMessage = function(message) {
    db.run("INSERT INTO messages VALUES (?, ?, ?)",
        [message.username, message.text, message.ts]);
};

module.exports.getMessages = function (callback) {
    db.each("SELECT * FROM messages", function (err, records) {
        if (err) console.log(err);
        // console.log("got: " + JSON.stringify(records));
        callback(records);
    });
};

module.exports.populateDemoData = function () {
    this.insertUser({name: "alice", password: "alice123"});
    this.insertUser({name: "bob", password:"bob123"});
    this.insertMessage({username: "alice", ts: '10:35:04 PM Thu Aug 10 2017', text:"Hello every one I'm Alice"});
    this.insertMessage({username: "bob", ts: '10:35:30 PM Thu Aug 10 2017', text:"Hi, this is Bob"});
};

// this.populateDemoData();

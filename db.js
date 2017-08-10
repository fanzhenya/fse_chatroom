var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(':memory:');

db.serialize(function () {
    db.run("CREATE TABLE IF NOT EXISTS users " +
        "(name TEXT, password TEXT)");
    db.run("CREATE TABLE IF NOT EXISTS messages " +
        "(username INTEGER, text TEXT, ts TEXT)");
});


module.exports.insertUser = function (user) {
    db.run("INSERT INTO users VALUES (?, ?)",
        [user.name, user.password]);
};

module.exports.getUsers = function () {
    db.each("SELECT * FROM users", function (err, records) {
        if (err) console.log(err);
        console.log("got: " + JSON.stringify(records));
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
    this.insertMessage({username: "tom", ts: "1000", text:"hello this is tom"});
    this.insertMessage({username: "alice", ts: "2000", text:"hello this is alice"});
    this.insertMessage({username: "tom", ts: "3000", text:"nice to meet you alice"});
    this.insertMessage({username: "bob", ts: "4000", text:"nice to meet you alice"});
};


// this.populateDemoData();
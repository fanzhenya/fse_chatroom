var db = require("../db");
var Promise = require('promise');

db.getUsers();
db.checkUsernamePasswordComb("alice", "alice1x23", function (result) {

});

db.getPasswordOfUsername("bob", function (result) {
    // console.log("result: ", result);
});

db.getUserPromise("bob")
    .then(function (row) {
        console.log(row);
        return new Promise(function (resol, rej) {
            if (row === "bob123") {
                resol(true);
            } else {
                resol(false);
            }
        });
    })
    .then(function (result) {
        console.log("check success: " + result);
    })
    .catch(console.error);

db.getMessages(function (result) {
    var messages = [];
    messages = result;
    console.log("messages from db: " + JSON.stringify(messages));
});

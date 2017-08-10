var db = require("../db");

db.insertUser({name:"tom", password:"tompw"});
db.insertUser({name:"alice", password:"alicepw"});
db.getUsers();


db.populateDemoData();

db.getMessages(function (result) {
    var messages = [];
    messages = result;
    console.log("messages from db: " + JSON.stringify(messages));
});

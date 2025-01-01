const obj = require("mongoose");
const url =  "mongodb://127.0.0.1:27017/database";
obj.connect('mongodb://localhost/mydb', { useNewUrlParser: true, useUnifiedTopology: true });

const db = obj.connection;
db.on('connected',()=>{
    console.log("connected to datbase");

});
db.on('disconnected',()=>{
    console.log("disconnected to datbase");

});

module.exports =db;
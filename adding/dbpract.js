const mongoose = require("mongoose"); // Correct naming for clarity
console.log("enter");
const url = "mongodb://127.0.0.1:27017/database"; // Local MongoDB connection string

// Connect to MongoDB
mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("Connected to MongoDB successfully."))
  .catch((err) => console.error("Failed to connect to MongoDB:", err));


const db = mongoose.connection;
db.on('connected',()=>{
    console.log("connected to datbase");

});
db.on('disconnected',()=>{
    console.log("disconnected to datbase");

});

module.exports =db;
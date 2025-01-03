const express = require('express');
const app = new express();
app.use(express.json());
//database connection
// const url = 'mongodb://127.0.0.1:27017/database';
const url = "mongodb+srv://1harshfeb:vBtVZop744YodAs4@cluster0.hoam9.mongodb.net/";
const mongoose = require('mongoose');
mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("Connected to MongoDB successfully."))
  .catch((err) => console.error("Failed to connect to MongoDB:", err));
  
const menubar = new mongoose.Schema({
    item:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        default:0
    }
});  
const menu = mongoose.model('menu',menubar);
app.post('/s',async(req,res)=>{
   try{const data = new menu(req.body);
   await data.save();
   res.status(200).json(data);}
   catch (err){
    console.log(err);
    res.status(500).send('error');
   }
})
app.listen(4000,()=>{
    console.log("server running on port 4000");
  })
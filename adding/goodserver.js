const express = require('express');
const app = new express();
app.use(express.json());
require('dotenv').config();
const url = process.env.url;
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
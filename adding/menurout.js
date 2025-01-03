const express = require('express');
const app = express();
const rout = express.Router();
const converter = require('body-parser');
app.use(converter.json());

const menumodel = require('./.vscode/menuformate.js'); // Corrected path

rout.post('/s',async(req,res)=>{
    console.log("POST request received at /menu/s");
   try{ const menu = new menumodel(req.body);
    await menu.save();
    console.log("menu data saved");
    res.status(200).json(menu);}
    catch(err){
        console.log(err);
         res.status(500).send(err);
    }

});
rout.put('/:id',async(req,res)=>{
    const id = req.params.id;
    const response=await menumodel.findByIdAndUpdate(id,req.body);
    if(!response){
        console.log("do not match object");
        res.status(500).send("don not match object");
    }
    else{
        res.status(200).send("done  updated");
    }
});
rout.get('/',async(req,res)=>{
    try{const data = await menumodel.find();
    res.status(200).json(data);}
    catch(er){
        console.log(er);
        res.status(500).send("error");
    }
})
rout.delete('/:id',async(req,res)=>{
    try{const response =await menumodel.findByIdAndDelete(req.params.id);
    if(!response){
        console.log("do not match object");
        res.status(500).send("don not match object");
    }
    else{
        // res.status(200).json(await menumodel.find());
        //passing await inside can create problem;
        const allData = await menumodel.find();
        res.status(200).json(allData);
    }}
    catch(er){
                console.log(er);
              res.status(500).send('error');
    }

})
console.log("running file");
module.exports=rout;

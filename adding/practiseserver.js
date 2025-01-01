const express = require('express'); // Import Express
const db = require('./dbpract.js'); // Correct the path
const app = express(); // Create an Express app
const converter = require('body-parser');
app.use(converter.json());
const menurouter=require('./menurout.js');
const model = require('./formatedb.js');
const menumodel = require('./menuformate.js');
app.use('/menu',menurouter);


app.post('/data', async (req, res) => {
    try {
        // Create a new instance of the model using the request body
        const newPerson = new model(req.body);

        // Save the new person data
        await newPerson.save();
    
        // Send a success response
        res.status(200).send("Data saved successfully");
    } catch (err) {
        // Log the error and send a failure response
        console.error("Error:", err);
        res.status(500).send("Error saving data");
    }
});
// app.post('/menu',async(req,res)=>{
//    try{ const menu = new menumodel(req.body);
//     await menu.save();
//     console.log("menu data saved");
//     res.status(200).json(menu);}
//     catch(err){
//         console.log(err);
//          res.status(500).send(err);
//     }

// })
app.get('/getdata',async(req,res)=>{
    try{
        const data = await model.find();
        console.log("data fetched");
        res.status(200).json(data);
    }
    catch(er){
        console.log(er);
        res.status(500).send("Error saving data");
    }
});
app.get('/getdata/:variable',async(req,res)=>{
    try{
        const vari = req.params.variable;
        const data = await model.find({age:vari});
        console.log("data fetched");
        res.status(200).json(data);
    }
    catch(er){
        console.log(er);
        res.status(500).send("Error saving data");
    }
});


// Start the server
app.listen(4000, () => {
    console.log("Server started on port 4000");
});


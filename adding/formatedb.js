const mongoose = require('mongoose');
const personschema = new mongoose.Schema(
    {
        name:{
            
            required:true,type:String
            
        },
        age:{
            type:Number
        },
        id:{
            type:Number,
            required:true,
            unique:true
        }

    }
);
const model =mongoose.model("model",personschema);
module.exports=model;




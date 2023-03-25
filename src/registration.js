const express = require('express');
const reg_data = require('./notesDataModel');


const reg = express();
reg.post("/register/user", async(req,res)=>{
    try {
        let {email,password} = req.body;
        let check_user = await reg_data.find({email:email})
        if(check_user.length !== 0){
            res.header(401).json({
                status:"failed",
                massage : "user is already register."
            })
        }
        else{
            let reg_user = await reg_data.create(req.body);
            res.header(200).json({
                status:"SuccessFull",
                massage:"user registr successfull"
            })
        }       
    } catch (e) {
        res.header(404).json({
            status: "Failed",
            massage : e
        })
        
    }
})

module.exports= reg;


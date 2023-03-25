const express = require('express');
const reg_data = require('./notesDataModel');
const jwt = require('jsonwebtoken')


const login = express();
login.post("/login/user", async(req,res)=>{
   
    try {
        let {email,password} = req.body;
        console.log(email,password)
        let check_user = await reg_data.find({email:email})
        
        if(check_user[0].email !== email && check_user[0].password === password){
            res.header(401).json({
                status:"failed",
                massage : "please inter valide creadintal."
            })
        }
        else{
           const token = await jwt.sign({
            exp:Math.floor(Date.now()/ 1000)+(60 * 60),
            data:check_user[0]._id
           },"NotesUser")
            console.log(token)
            res.header(200).json({
                status:"SuccessFull",
                massage:"user registr login",
                token
            })
        }       
    } catch (e) {
        res.header(404).json({
            status: "Failed",
            massage : e
        })
        
    }
})
login.post("/login/user/event/post",async(req,res)=>{
    try{
        console.log(req.user)
        const id  = req.user;
        const data = req.body;
        let add_data = await reg_data.updateMany({_id:id}, {$push:{"data": data}})
        res.header(200).json({
            status:"Successful",
            add_data
        })

    }catch(e){
        res.header(404).json({
            status:"Failed",
            massage:"event cam not post"
        })
    }
})
login.put("/login/user/event/put",async(req,res)=>{
    try{
        let id = req.user;
        let update_event = req.body;
        let stored_event = await reg_data.find({_id:id});
        let len = stored_event.data.length;
        for(let i = 0; i < len; i++){
            if(i === update_event.idx){
                stored_event.data[i] = update_event.data;
                break;
            }
        }
        let add_data = await reg_data.updateOne({_id:id}, {$splice:{"data": update_event.idx}})
        res.header(200).json({
            status:"Successful",
            add_data
        })

    }catch(e){
        res.header(404).json({
            status:"Failed",
            massage:"event cam not post"
        })
    }
})
login.delete("/login/user/event/delete", async(req,res)=>{
    try{
        let id = req.user;
        let idx = req.body.idx ;
        let stored_event = await reg_data.find({_id:id});
        let len = stored_event.data.length;
        let data  = [];
        for(let i = 0; i < len; i++){
            if(i === idx){
                continue;
            }
            else{
                data.push(stored_event.data[i]);
            }
        }
        let add_data = await reg_data.updateOne({_id:id}, {$set:{"data": data}})
        res.header(200).json({
            status:"Successful",
            add_data
        })

    }catch(e){
        res.header(404).json({
            status:"Failed",
            massage:"event cam not post"
        })
    }
})

module.exports= login;


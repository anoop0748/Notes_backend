const mongoose = require("mongoose");

const schema = new mongoose.Schema({
    email:{type:String, require : true},
    password:{type:String, require : true},
    data:{type: Array , require:false}
})

const notes_model = mongoose.model("Notes_Data",schema);
module.exports = notes_model;
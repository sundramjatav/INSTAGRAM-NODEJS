const mongoose = require("mongoose")

const uploadSchema = new mongoose.Schema({
    caption:{type:String,default:""},
    url:{type:String,default:"https://imgs.search.brave.com/MgY-TJHmsrxAv_bnzlBwDNbZAO7pS-SG70fWbqv6k9M/rs:fit:860:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzAyLzM1LzM1LzM5/LzM2MF9GXzIzNTM1/MzkyNl8yQk1Bc0pF/bTlIalQwcFV6M0VZ/SjhUUXlaN3B5bDY4/ZS5qcGc"},
    types:{type:String,default:"image/jpeg"},
    views:{type:Number,default:0},
    ago:{type:Number,default:''},
    userid:{type:mongoose.Schema.Types.ObjectId,ref:"user"},
    likes:[{type:mongoose.Schema.Types.ObjectId,ref:"user"}],
    comments:[{type:mongoose.Schema.Types.ObjectId,ref:"comment"}],
},{versionKey:false,timestamps:true})
const uploadModel = mongoose.model("upload",uploadSchema)
module.exports = {uploadModel}
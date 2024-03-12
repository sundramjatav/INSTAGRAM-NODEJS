const mongoose = require("mongoose")
const messageSchema = new mongoose.Schema({
    message:{type:String,default:""},
    url:{type:String,default:""},
    senderid:{type:mongoose.Schema.Types.ObjectId,ref:"user"},
    receiverid:{type:mongoose.Schema.Types.ObjectId,ref:"user"},
},{timestamps:true,versionKey:false})
const messageModel = mongoose.model("message",messageSchema)
module.exports = {messageModel}
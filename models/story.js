const mongoose = require("mongoose")
const storySchema = new mongoose.Schema({
    url:{type:String, required:true},
    types:{type:String,default:"image/jpeg"},
    views:{type:Number,default:0},
    ago:{type:Number,default:''},
    userid:{type:mongoose.Schema.Types.ObjectId,ref:"user"},
    likes:[{type:mongoose.Schema.Types.ObjectId,ref:"user"}],
    comments:[{type:mongoose.Schema.Types.ObjectId,ref:"comment"}],
},{timestamps:true,versionKey:false})

const storyModel = mongoose.model("story",storySchema)
module.exports = {storyModel}
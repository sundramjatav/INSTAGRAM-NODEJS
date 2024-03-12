const mongoose = require('mongoose')
const commentSchema = new mongoose.Schema({
    comment:{type:String,required:true},
    postid:{type:mongoose.Schema.Types.ObjectId,ref:"upload"},
    userid:{type:mongoose.Schema.Types.ObjectId,ref:"user"}

},{versionKey:false,timestamps:true})
const commentModel = mongoose.model("comment",commentSchema)
module.exports = {commentModel}
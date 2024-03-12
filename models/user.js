const mongoose = require("mongoose")
const plm = require("passport-local-mongoose")

const userSchema = new mongoose.Schema({
    username:{type:String,required:{msg:"Please enter a username"}},
    name:{type:String,required:{msg:"Please enter a name"}},
    email:{type:String,required:{msg:"Please enter a email"}},
    picture:{type:String,default:""},
    bio:{type:String,default:null},
    url:{type:String,default:""},
    socketid:{type:String,default:""},
    postsave:[{type:mongoose.Schema.Types.ObjectId, ref:"upload"}],
    post:[{type:mongoose.Schema.Types.ObjectId, ref:"upload"}],
    stories:[{type:mongoose.Schema.Types.ObjectId, ref:"story"}],
    heighlight:[{type:mongoose.Schema.Types.ObjectId, ref:"upload"}],
    follower:[{type:mongoose.Schema.Types.ObjectId, ref:"user"}],
    following:[{type:mongoose.Schema.Types.ObjectId, ref:"user"}],
    messageUsers:[{type:mongoose.Schema.Types.ObjectId, ref:"user"}],
},{versionKey:false,timestamps:true})
userSchema.plugin(plm,{usernameField:"email"})

const userModel = mongoose.model("user",userSchema)

module.exports = {userModel}

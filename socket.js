const io = require("socket.io")()
const {userModel} = require("./models/user")
const {messageModel} = require("./models/message")
const socketApi = {
    io
}

io.on("connection",async function(socket){
    console.log("socket connection")

    // 1. join user
    socket.on("join",async curentUserId=>{
        const user = await userModel.findById(curentUserId)
        user.socketid = socket.id
        await user.save()
    })

    // 2. send message
    socket.on("send",async (msg)=>{
        console.log(msg)
        const currentUserFind = await userModel.findById(msg.senderid)
        const chatUserFind = await userModel.findById(msg.receiverid)
        if(currentUserFind.messageUsers.indexOf(msg.receiverid) == -1){
            currentUserFind.messageUsers.push(msg.receiverid)
            chatUserFind.messageUsers.push(msg.senderid)
            await currentUserFind.save()
            await chatUserFind.save()
        }
        const message = await messageModel.create({senderid:msg.senderid,receiverid:msg.receiverid,message:msg.message})

        // 3. received message
        if(msg.url){
            socket.emit("message-url",message)
        }
        socket.to(chatUserFind.socketid).emit("receive",msg)
    })

    // 4. search messages
    socket.on("searchMessage",async msg=>{
        const allMessages = await messageModel.find({
            '$or':[
                {
                    senderid:msg.senderid,
                    receiverid:msg.receiverid
                },
                {
                    receiverid:msg.senderid,
                    senderid:msg.receiverid
                }
            ]
        })
        if(allMessages.length != 0){
            // 5. all find messages
            return socket.emit("searchMessaged",allMessages)
        }
    })

    
    socket.on("disconnect",async function(){
        console.log("Socket disconnected")
        // 6. disconnect user socketid is empty
        await userModel.findOneAndUpdate({socketid:socket.id},{socketid:""},{new:true})
    })
})

module.exports = {socketApi}
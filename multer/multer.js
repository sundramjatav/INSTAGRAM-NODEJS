const multer = require("multer")
const path = require("path")
const {v4:uuid} = require("uuid")

// user 
const userMulter = multer({
    storage:multer.diskStorage({
        destination:(req,file,cb)=>{
            cb(null,'public/images')
        },
        filename:(req,file,cb)=>{
            cb(null,uuid()+path.extname(file.originalname))
        }
    }),
    limits:{fileSize:10*1024*1024}
})

// upload 
const uploadMulter = multer({
storage:multer.diskStorage({
destination:(req,file,cb)=>{
cb(null,'public/uploads')
},
filename:(req,file,cb)=>{
cb(null,uuid()+path.extname(file.originalname))
}
}),
limits:{fileSize:10*1024*1024}
})

// message 
const messageMulter = multer({
storage:multer.diskStorage({
destination:(req,file,cb)=>{
cb(null,'public/messages')
},
filename:(req,file,cb)=>{
cb(null,uuid()+path.extname(file.originalname))
}
}),
limits:{fileSize:10*1024*1024}
})

// story 
const storyMulter = multer({
storage:multer.diskStorage({
destination:(req,file,cb)=>{
cb(null,'public/stories')
},
filename:(req,file,cb)=>{
cb(null,uuid()+path.extname(file.originalname))
}
}),
limits:{fileSize:20*1024*1024}
})

module.exports = {userMulter, uploadMulter, messageMulter, storyMulter}
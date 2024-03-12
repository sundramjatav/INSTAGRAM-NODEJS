const express = require('express')
const path = require("path")
const {ExifImage} = require("exif")
const router = express.Router()

// app.use(express.urlencoded({extended:true}))
// app.use(express.json())
// app.use(express.static(path.join(__dirname,"public")))


// app.get("/",(req,res)=>{
//     new ExifImage({image:'public/images/fb20aa1f-fb34-45bc-acad-b885105801ea.jpg'},(err,data)=>{
//         console.log(data)
//     })
//     res.send("Welcome Home Page")
// })


app.get("/",(req,res)=>{

})

app.listen(3000,()=>{
    console.log("http://localhost:3000")
})
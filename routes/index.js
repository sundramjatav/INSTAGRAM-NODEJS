var express = require('express');
var router = express.Router();
const passport = require("passport")
const ImgKit = require("imagekit")
const moment = require("moment")
const {v2:Cloudinary} = require("cloudinary")
const fs = require("fs")

const {userModel} = require("../models/user")
const {uploadModel} = require("../models/upload")
const {messageModel} = require("../models/message")
const {commentModel} = require("../models/comment")
const {storyModel} = require("../models/story")
const {userMulter,uploadMulter,messageMulter,storyMulter} = require("../multer/multer")


// require("../mongotest")

console.log(moment().format())

const imgKit = new ImgKit({
  publicKey:process.env.KIT_PUBLIC_KEY,
  privateKey:process.env.KIT_PRIVATE_KEY,
  urlEndpoint:process.env.KIT_URL
})

Cloudinary.config({
  api_key:"248748554511259",
  cloud_name:"srappltd",
  api_secret:"nQtsXuD_wpnmbtHoiNtQ567Hx6I",
})

function isLoggedIn(req,res,next){
  if(req.isAuthenticated()){
    return next()
  }
  res.redirect("/login")
}

router.get('/',isLoggedIn,async function(req, res) {
  try {
    const user = await userModel.findById(req.user._id).populate("stories")
    const userFind = await userModel.findById(req.user._id)
    const posts = await uploadModel.find().populate("userid")
    const currentTime = moment()
    await posts.forEach(async post=>{
      const uploadTime = moment(post.createdAt)
      const diff = currentTime.diff(uploadTime,'seconds')
      post.ago = diff
      await post.save()
    })
  
    const allStoryUsers = await userModel.find({
      _id:{$in:user.following}
    }).populate("stories")
    
  
    allStory = await storyModel.find().populate("userid")
    allStory.forEach(async story=>{
      const uploadStory = moment(story.createdAt)
      const diff = currentTime.diff(uploadStory,'seconds')
      story.ago = diff
      await story.save()
    })
    // console.log(posts[0].createdAt.toLocaleString())
    res.render('feed', {footer: true, posts, user, allStoryUsers, userFind, pagename:"Deshboard"});
    
  } catch (error) {
    console.log(error)
  }
});

router.get('/login', function(req, res) {
  try {
    if(req.user){
      res.redirect("/")
    }
    res.render('login', {footer: false,pagename:"Login"});
    
  } catch (error) {
    console.log(error)
  }
});

router.get('/register', function(req, res) {
  try {
    if(req.user){
      res.redirect("/")
    }
    res.render('index', {footer: false, pagename:"Register"});
    
  } catch (error) {
    console.log(error)
    
  }
});

router.get('/profile/:userid',isLoggedIn,async function(req, res) {
  try {
    const user = await userModel.findById(req.params.userid,{email:0,socketid:0,messageUsers:0,postsave:0}).populate("post",{url:1,types:1})
    const userFind = await userModel.findById(req.user._id,{email:0,socketid:0,messageUsers:0,postsave:0}).populate("post",{url:1,types:1})
    console.log({user,userFind})
    if(req.params.userid == req.user._id){
      res.render('profile.ejs', {footer: true, user,userFind ,pagename:user.username});
    }else{
      res.render('other-profile.ejs', {footer: true, user, userFind,pagename:user.username});
    }
    
  } catch (error) {
    console.log(error)
    
  }
});

router.get('/search',isLoggedIn,async function(req, res) {
  try {
    const user = await userModel.findById(req.user._id)
    const userFind = await userModel.findById(req.user._id).populate("post")
    res.render('search', {footer: true,user, userFind, pagename:"Search"});
    
  } catch (error) {
    console.log(error)
  }
});

router.post('/login',passport.authenticate("local",{
  successRedirect:"/",
  failureRedirect:"/login"
}),async (req,res)=>{
  
})

router.post("/register",async (req,res)=>{
  try {
    const {username,email,password,name} = req.body
    const customUsername = username.split(" ").join("").toLowerCase()+Math.floor(Math.random()*10000)
    await userModel.register(new userModel({username:customUsername,email,name}),password).then(regsiter=>{
      passport.authenticate("local")(req,res,()=>{
        res.redirect("/")
      })
    })
  } catch (error) {
    console.log(error)
  }
})

router.get("/logout",isLoggedIn,(req,res)=>{
  try {
    req.logOut((err)=>{
      if(!err){
        return res.redirect("/login")
      }else{
        return res.redirect("/login")
      }
    })
    
  } catch (error) {
    console.log(error)
    
  }
})

router.get('/edit',isLoggedIn,async function(req, res) {
  try {
    const user = await userModel.findById(req.user._id)
    const userFind = await userModel.findById(req.user._id).populate("post")
    res.render('edit', {footer: true,user, userFind,pagename:"Update"});
    
  } catch (error) {
    console.log(error)
    
  }
});

router.get('/upload',isLoggedIn,async function(req, res) {
  try {
    const user = await userModel.findById(req.user._id)
    const userFind = await userModel.findById(req.user._id).populate("post")
    res.render('upload', {footer: true,user, userFind, pagename:"Upload"});
    
  } catch (error) {
    console.log(error)
    
  }
});
router.post("/update-picture",isLoggedIn,userMulter.single("picture"), async (req,res)=>{
  // if(!req.file){
  //   return res.redirect("/edit")
  // }
  // const cloudinary = await Cloudinary.uploader.upload(req.file.path,{
  //   folder:'INSTAGRAM',
  //   quality: 'auto:best',
  //   width: 450, // Adjust dimensions as needed
  //   height: 450,
  //   crop: 'limit',
  // })
  // const dataasd = await Cloudinary.url(cloudinary.public_id,{secure:true})
  // console.log(dataasd)

  try {
    const userFind = await userModel.findById(req.user._id)
    // userFind.picture = cloudinary.url
    fs.unlink(`public/${userFind.picture}`,async (err)=>{
      if(err){
        userFind.picture = '/images/'+req.file.filename
      }else{
        userFind.picture = '/images/'+req.file.filename
      }
      await userFind.save()
      res.redirect("/edit")
    })
    
  } catch (error) {
    console.log(error)
    
  }
})
router.post("/update-profile",isLoggedIn,async (req,res)=>{
  try {
    const {name,email,username,bio} = req.body
    console.log({name,email,username,bio})
    const userFind = await userModel.findById(req.user._id)
    userFind.name = name
    // userFind.email = email
    // userFind.username = username
    userFind.bio = bio
    await userFind.save()
    res.redirect(`/profile/${userFind._id}`)
  } catch (error) {
    console.log(error)
    
  }
})
router.post("/upload",isLoggedIn,uploadMulter.single("url"),async (req,res)=>{
  try {
    const {caption} = req.body
    const user = await userModel.findById(req.user._id)
    if(!req.file){
      const upload = await uploadModel.create({caption,userid:user._id})
      user.post.push(upload._id)
      await user.save()
      return res.redirect(`/profile/${user._id}`)
    }
    const upload = await uploadModel.create({caption,url:'/uploads/'+req.file.filename,userid:user._id,types:req.file.mimetype})
    user.post.push(upload._id)
    await user.save()
    return res.redirect(`/profile/${user._id}`)
    
  } catch (error) {
    console.log(error)
    
  }
})

router.post("/search",isLoggedIn,async (req,res)=>{
  try {
    const {search} = req.body
    const users = await userModel.find({
      "$or":[
        {username:{$regex:search,$options:"i"}},
        {name:{$regex:search,$options:"i"}}
      ]
    })
    res.json(users)
    
  } catch (error) {
    console.log(error)
    
  }
})

router.get("/like/:postid",isLoggedIn,async (req,res)=>{
  try {
    const postFind = await uploadModel.findById(req.params.postid)
    if(postFind.likes.indexOf(req.user._id) == -1){
      postFind.likes.push(req.user._id)
    }else{
      postFind.likes.splice(req.user._id,1)
    }
    await postFind.save()
    res.json(postFind)
    
  } catch (error) {
    console.log(error)
    
  }
})

router.get("/follow/:userid",isLoggedIn,async (req,res)=>{
  try {
    const user = await userModel.findById(req.user._id)
    const userFollow = await userModel.findById(req.params.userid)
    if(user.following.indexOf(userFollow._id) == -1){
      user.following.push(userFollow._id)
      userFollow.follower.push(user._id)
    }else{
      user.following.splice(userFollow._id,1)
      userFollow.follower.splice(user._id,1)
    }
    await user.save()
    await userFollow.save()
    res.status(200).json(userFollow)
    
  } catch (error) {
    
  }
})

router.post("/comment/:postid",isLoggedIn,async (req,res)=>{
  try {
    const {comment} = req.body
    const user = await uploadModel.findById(req.user._id)
    const postFind = await uploadModel.findById(req.params.postid)
    const commentFind = await commentModel.create({comment, postid:postFind._id,userid:user._id})
    postFind.comments.push(commentFind._id)
    await postFind.save()
    res.redirect("/")
    
  } catch (error) {
    console.log(error)
  }
})

router.get("/share",isLoggedIn,async (req,res)=>{
  try {
    const currentPageUrl = req.query.url;
    // WhatsApp share URL with the current page URL as parameter
    const whatsappUrl = `whatsapp://send?text=${encodeURIComponent(currentPageUrl)}`;
    // Send back the WhatsApp share URL
    res.send(whatsappUrl);
    
  } catch (error) {
    console.log(error)
  }
})

router.get("/messages",isLoggedIn,async (req,res)=>{
  try {
    const userFind = await userModel.findById(req.user._id,{picture:1,username:1,messageUsers:1}).populate("messageUsers",{name:1,picture:1})
    console.log(userFind)
    res.render("message.ejs",{footer:true, userFind ,pagename:"Messages"})
    
  } catch (error) {
    console.log(error)
  }
})

router.get("/message/:id",isLoggedIn,async (req,res)=>{
  try {
    const user = await userModel.findById(req.user._id,{picture:1,name:1})
    const chatUser = await userModel.findById(req.params.id)
    res.render("message-user.ejs",{footer:true, chatUser, user ,pagename:chatUser.username})
    
  } catch (error) {
    console.log(error)
  }
})

// message url add 
router.post("/message-url/:msg",isLoggedIn,messageMulter.single("image"),async (req,res)=>{
  try {
    const msg = await messageModel.findById(req.params.msg)
    msg.url = '/messages/'+req.file.filename
    await msg.save()
    res.status(200).json(msg)
    
  } catch (error) {
    console.log(error)
  }

})

router.get("/message/delete/:chatuserid/:messageid",isLoggedIn,async (req,res)=>{
  try {
    const message = await messageModel.findById(req.params.messageid);
    fs.unlink(`public/${message.url}`,async (err)=>{
      await messageModel.findByIdAndDelete(req.params.messageid)
      // res.redirect(`/message/${req.params.chatuserid}`)
      res.json({msg:"Message deleted successfully"})
    })
    
  } catch (error) {
    console.log(error)
  }
})

// stories routes
router.post("/story/create" ,isLoggedIn, storyMulter.single("url"), async (req,res)=>{
  try {
    const user = await userModel.findById(req.user._id)
    const storyData = await storyModel.create({url:'/stories/'+req.file.filename,types:req.file.mimetype,userid:user._id})
    user.stories.push(storyData._id)
    await user.save()
    res.redirect("/")
    
  } catch (error) {
    console.log(error)
  }
})


router.get("/save/:postid",isLoggedIn,async (req,res)=>{
  try {
    const user = await userModel.findById(req.user._id)
    const post = await uploadModel.findById(req.params.postid)
    if(user.postsave.indexOf(post._id) == -1){
      user.postsave.push(post._id)
    }else{
      user.postsave.splice(post._id,1)
    }
    await user.save()
    res.json(user.postsave)
    
  } catch (error) {
    console.log(error)
  }
})

router.get("/story/:storyid/:count",isLoggedIn,async (req,res)=>{
  try {
    const storyUser = await userModel.findById(req.params.storyid).populate("stories")
    const story = await storyUser.stories.reverse()[req.params.count - 1]
    if(storyUser.stories.length >= req.params.count){
      return res.render("story.ejs",{storyUser,story,count:req.params.count})
    }
    res.redirect("/")
  } catch (error) {
    console.log(error)
  }
})

// comment
router.get("/comment/:postid",isLoggedIn,async (req,res)=>{
  const userFind = await userModel.findById(req.user._id)
  const post = await uploadModel.findById(req.params.postid).populate("userid")
  const comments = await commentModel.find({postid:req.params.postid}).populate("userid")
  console.log(comments)
  res.render("comment.ejs",{footer:true,userFind,post,comments ,pagename:"comment"})
})
router.post("/comment/msg/:postid",isLoggedIn,async (req,res)=>{
  const post = await uploadModel.findById(req.params.postid)
  const comment = await commentModel.create({comment:req.body.comment,postid:req.params.postid,userid:req.user._id})
  post.comments.push = comment
  await post.save()
  const comments = await commentModel.find({postid:req.params.postid}).populate("userid")
  console.log({post,comments})
  res.json(comments)
})

module.exports = router;

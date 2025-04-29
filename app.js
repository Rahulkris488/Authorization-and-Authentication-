const cookieParser = require('cookie-parser')
const express = require('express')
const app = express()
const path= require('path')
const userModel = require("./models/user")
const postModel = require("./models/post")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
app.set("view engine","ejs")
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname,'public')))
app.use(cookieParser())
app.get('/',function(req , res){
    res.render('index')
    
})
app.post('/create',async function(req , res){
    let {username, email ,password,age}=req.body
    let user = await userModel.findOne({email:email })
    if(user) return res.status(500).send("user already registered")

    bcrypt.genSalt(10,(err, salt)=>{
        bcrypt.hash(password, salt ,async (err , hash)=>{
            let Createduser = await userModel.create({
                username,
                email,
                password: hash,
                age
            })
            let token = jwt.sign({email:email,userid : Createduser._id},"meowmeow")
            res.cookie("token",token)
            res.send("registered")
        })
    })
})

app.post("/login",async function(req, res){
  let {email,password} =req.body;
  let user= await userModel.findOne({email})
  bcrypt.compare(password, user.password, function(err, result){
   if(result) {
    let token = jwt.sign({email:email,userid : Createduser._id},"meowmeow")
   res.cookie("token",token)
    res.status(200).send("you can log in");
   }
  }) 
})
app.get("/logout",function(req,res){
    res.cookie("token","")
    res.redirect("/login")
})

function isLoggedin(req, res , next){
    if(req.cookies.token === "") redirect ("you must be logged in")
        else{
            let data=  jwt.verify(req.cookies.token, "meowmeow") 
            req.user =data;
            }
}
app.listen(3000)
const cookieParser = require('cookie-parser')
const express = require('express')
const app = express()
const path= require('path')
const userModel = require("./models/user")
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

app.post('/create', function(req , res){
   let {username, email ,password,age}=req.body

    bcrypt.genSalt(10,(err, salt)=>{
        bcrypt.hash(password, salt ,async (err , hash)=>{
            let Createduser = await userModel.create({
                username,
                email,
                password: hash,
                age
            })
            let token = jwt.sign({email},"meow meow")
            res.cookie("token",token)
            res.send(Createduser)
        })
    })
})
app.get("/login",function(req, res){
    res.render('login')
})

app.post("/login",async function(req, res){
  let user= await userModel.findOne({email:req.body.email})
  console.log(user)
})

app.get("/logout",function(req,res){
    res.cookie("token","")
    res.redirect("/")
})
    
    



app.listen(3000)
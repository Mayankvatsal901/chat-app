const User=require('../models/user.model')
const bcrypt=require("bcryptjs")
const generateToken=require('../lib/utils')
//const cloudinary = require("cloudinary").v2;
const cloudinary = require("../lib/cloudinary"); 


async function  handlesigup(req,res){
    const{fullName,email,password}=req.body 
    try {

        // hash password bcrypt js
        // if(!fullName||!email||!password){
        //     return res.status(400).json({message:"all fields are requiered "})
        // }
        if(password.length<6){
            return res.status(400).json({message:"password must be at least 6 characters"})
        }
        const user=await User.findOne({email})
        if(user) return res.status(400).json({message:"Email already exxits"})
        const salt=await bcrypt.genSalt(10)
        const hashedpassword=await bcrypt.hash(password,salt)
        const newUser=new User({
            fullName:fullName,
            email:email,
            password:hashedpassword


        })
        if(newUser){
            //genreate jwt token 
           
            await newUser.save();
             generateToken(newUser._id,res)
            res.status(201).json({
                id:newUser._id,
                fullName:newUser.fullName,
                 email:newUser.email,
                 
            })

        }else{
             res.status(400).json({message:"password must be at least 6 characters"})

        }
        
    } catch (error) {
         console.error("Signup error:", error.message);
  res.status(500).json({ message: "Internal Server Error" });
}
        
    }

async function handlelogin(req,res){
    const{email,password}=req.body
    try {
        const user=await User.findOne({email});
        if(!user){
            return res.status(400).json({message:"user do not exit"})

        }
        // password=user.password;
        // const salt=await bcrypt.genSalt(10)
        // const hashpassword=bcrypt.hash(password,salt);
        const isPasswordCorrect=await bcrypt.compare(password,user.password)
        if(!isPasswordCorrect){
            return res.status(400).json({message:"invalid credentials"})

        }
        generateToken(user._id,res)

        res.status(200).json({
            id:user._id

        })


        
    } catch (error) {
        console.log("Error in login controller")
        res.status(500).json({message:"Internal error"})
        
    }

    
}
async function handlelogout(req,res){
    try {
        res.cookie("jwt","",{maxAge:0});
        res.status(200).json({message:"logout"})
        
    } catch (error) {
        console.log("Error in logout ")
        res.status(500).json({message:"Internal error"})
        
    }
}
async function updateProfile(req,res) {
    try {
        const {profilepic}=req.body
        const userId=req.user._id;
        if(!profilepic){
            return res.status(400).json({message:"profile pic is required"});
        }
        const uploadResponse=await cloudinary.uploader.upload(profilepic)
        const updateuser=await User.findByIdAndUpdate(userId,{profilepic:uploadResponse.secure_url},
            {new:true}
        );
        res.status(200).json(updateuser);

        
    } catch (error) {
         console.log("Error in login controller")
        res.status(500).json({message:"Internal error"})
        
    }
    
}
async function checkAuth(req,res){
    try {
        res.status(200).json(req.user);
        
    } catch (error) {
        console.log("error in checkauth")
        res.status(500).json({message:"Internal error"})
        
        
    }
}


module.exports={
    handlesigup,
    handlelogin,
    handlelogout,
    updateProfile,
    checkAuth
}
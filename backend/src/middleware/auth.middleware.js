const jwt=require("jsonwebtoken")
const User=require('../models/user.model')



 const protectRoute=async(req,res,next)=>{

    try{
      const token = req.cookies.jwt;

        console.log(token)
        if(!token){
            return res.status(401).json({message:"unauthorized-No Token provided"})
        }


        const decoded=jwt.verify(token,process.env.SECRET)
        console.log(decoded)
        const user=await User.findById(decoded.userId).select("-password")
        
        if(!user){
            return res.status(404).json({message:"user not found"})
        }
        req.user=user// like that you can a attribute 
         next()
        
    }catch(error){
        res.status(500).json({message:"Internal error1"})

    }

}
module.exports={protectRoute}
const express=require("express")
const router=express.Router()
const{handlesigup,handlelogin,handlelogout,updateProfile,checkAuth}=require('../controllers/auth.controllers')
const{protectRoute}=require('../middleware/auth.middleware')
router.post("/signup",handlesigup)


router.post("/login",handlelogin
    
)
router.post("/logout",handlelogout)
router.put("/update-profile",protectRoute,updateProfile);
router.get("/check",protectRoute,checkAuth)// it will do if we refresh 

module.exports=router
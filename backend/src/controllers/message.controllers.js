
const User=require('../models/user.model')
const Message=require('../models/messaage.model')
const cloudinary=require('../lib/cloudinary');
const { getReceiverSocketId,io } = require('../lib/socket');

async function getUsersForSidebar(req,res){
    try{
        const loggedInUserId=req.user._id;
        const filteredUsers=await User.find({_id:{$ne:loggedInUserId}}).select("-password")
        res.status(200).json(filteredUsers) 

    }catch(error){
         res.status(500).json({message:"Internal error"})
        

    }

    
}
async function getMessages(req,res){
   try {
    const{id:userToChatId}=req.params
    const myId=req.user._id;

    const messages=await Message.find({
        $or:[
            {senderId:myId,receiverId:userToChatId},
            {senderId:userToChatId,receiverId:myId}
        ]
    })
    res.status(200).json(messages)
    
   } catch (error) {
     res.status(500).json({message:"Internal error"})
    
   }
}
async function sendMessage(req,res){
    try {
        const{text,image}=req.body
        const{id:receiverId}=req.params
        const senderId=req.user._id

        let imageUrl
        if(image){ // how to upload the image on cloudinary 
            const uploadResponse=await cloudinary.uploader.upload(image)
            imageUrl=uploadResponse.secure_url

        }

        const newMessage=new Message({
            senderId,
            receiverId,
            text,
            image:imageUrl
        })
        await newMessage.save()
        //realtime functionality send message online  
        const receiverSocketId=getReceiverSocketId(receiverId)
        if(receiverSocketId){
            io.to(receiverSocketId).emit("newMessage",newMessage);
        }
        
        res.status(201).json(newMessage)
    
        
    } catch (error) {
        console.log("Error in sendMessage controller:",error.message)
        res.status(500).json({message:"Internal error"})
        
    }
  

   
}




module.exports={getUsersForSidebar,getMessages,sendMessage}
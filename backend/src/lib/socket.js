const {Server}=require("socket.io")
const http=require("http")
const express=require("express")
const app=express()

const server=http.createServer(app) // as socket.io run on the raw http




const io=new Server(server,{
    cors:{
        origin:["http://localhost:5173"],


    },
})
function getReceiverSocketId(userId){
    return userSocketMap[userId];
    

}
// to store the online users 


const userSocketMap={} //{userId:socket.id}


// when someone is connected  io.on
io.on("connection",(socket)=>{
    console.log("hello")
    console.log("A user connected",socket.id);
    const userId=socket.handshake.query.userId
    if(userId) userSocketMap[userId]=socket.id
 
    // to send to all connected clients by socket.io
    io.emit("getOnlineUsers",Object.keys(userSocketMap))


    socket.on("disconnect",()=>{
        console.log("A user disconnected",socket.id);
        delete userSocketMap[userId]
        io.emit("getOnlineUsers",Object.keys(userSocketMap));

    })
})

module.exports={io,app,server,getReceiverSocketId};

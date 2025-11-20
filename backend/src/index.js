const express=require("express")
const dotenv=require('dotenv')
const{connections}=require('./lib/db.js')
const cookieparser=require('cookie-parser')
const cors=require("cors")
dotenv.config()
const authRoutes=require('./routes/auth.routes.js')
const messageroutes=require('./routes/message.routes.js')
const{app,server}=require('./lib/socket.js')
const PORT=process.env.PORT
const path=require("path")
const __dirname=path.resolve()




app.use(express.json())
app.use(cookieparser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);


app.use("/api/auth",authRoutes)
app.use("/api/message",messageroutes)
if(process.env.NODE_ENV==="production"){
  app.use(express.static(path.join(__dirname,"../frontend/dist")))
// request is coming on any route then the entry point will be the index.html 
  app.get("*",(req,res)=>{
    res.sendFile(path.join(__dirname,"../frontend","dist","index.html"));
  })
}


server.listen(PORT,()=>{console.log("server is running on port:"+PORT)
connections()

})
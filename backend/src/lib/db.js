const mongoose=require('mongoose')


const connections=async()=>{
    try {
        const conn=await mongoose.connect(process.env.MONGODB_URL)
        console.log(`Mongodb connected ${conn.connection.host}`)
        
    } catch (error) {
        console.log(`Mongodb connected error`)
        
        
    }
}
module.exports={connections}
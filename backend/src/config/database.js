const mongoose = require("mongoose")
async function connectToDB()
{
   try{
   console.log("Attempting to connect to:", process.env.MONGO_URI);
   await mongoose.connect(process.env.MONGO_URI)
   console.log("Connected to DB")

   }
   catch(err){
    console.error("Database connection error:", err.message)
   }
   
}
module.exports = connectToDB
    

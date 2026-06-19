const mongoose = require("mongoose")
const userSchema = new mongoose.Schema({
    username:{
        type : String,
        unique: [true, "User name already taken"],
        required : true,
    },
    email:
    {
        type : String,
        unique:[true,"Account already exist with this email address"],
        required : true,
    },
    password:// unique not required
    {
        type : String,
        required: true,
    }
})
const userModel = mongoose.model("users",userSchema)
module.exports = userModel
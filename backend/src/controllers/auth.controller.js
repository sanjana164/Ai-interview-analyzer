const userModel = require("../models/user.model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const tokenBlacklistModel = require("../models/blacklist.model")    
//@name registerUserController
async function registerUserController(req , res) {
    
    const {username , email , password} = req.body
    if(!username || !email || !password)
    {
        return res.status(400).json({
            message : "Please Provide username , email and password"
        })
    }
    const isUserAlreadyExist = await userModel.findOne({
        $or:[{username},{email}]
    })

    if(isUserAlreadyExist)
    {

        return res.status(400).json({
            message : "Account already exist with this email address or username"
        })
    }
    const hash = await bcrypt.hash(password, 10)
    const user = await userModel.create({
        username ,
        email,
        password : hash
    })

    const token = jwt.sign(
        { id:  user._id, username: user.username},
            process.env.JWT_SECRET,
            {expiresIn : "1d"}   
    )

    res.cookie("token", token)

    res.status(201).json({
        message: "User registered successfully",
        user:{
            id : user._id,
            username : user.username,
            email:user.email
        }
    })
}

async function loginUserController(req, res){
    const {email , password} = req.body
    
    console.log("Login attempt with:", {email, passwordLength: password?.length})
    
    // Validate input
    if(!email || !password)
    {
        console.log("Missing email or password")
        return res.status(400).json({
            message: "Please provide email and password"
        })
    }
    
    try{
        const user = await userModel.findOne({email})
        console.log("User found:", user ? "Yes" : "No")
        
        if(!user)
        {
            console.log("No user found with email:", email)
            return res.status(400).json({
                message: "Invalid email or password"
            })
        }
        const isPasswordValid =
             await bcrypt.compare(password, user.password)

        console.log("Password valid:", isPasswordValid)
        
        if(!isPasswordValid)
        {
            console.log("Password mismatch for user:", email)
            return res.status(400).json({
              message : "Invalid email or password"
            })
        } 
        
        const token = jwt.sign(
            { id:  user._id, username: user.username},
                process.env.JWT_SECRET,
                {expiresIn : "1d"}   
        )
        res.cookie("token", token, {httpOnly: true, sameSite: "lax"})
        res.status(200).json({
            message : "user logged in successfully",
            user : {
                id : user._id,
                username : user.username,
                email: user.email
            }
        })
    }
    catch(err){
        console.error("Login error:", err)
        res.status(500).json({
            message: "Server error during login",
            error: err.message
        })
    }
}

async function logoutUserController(req, res){

    const token = req.cookies.token
    console.log("Token:", token);
    if(token)
    {
        await tokenBlacklistModel.create({token})
    }

    res.clearCookie("token")
    res.status(200).json({
        message : "User logged out successfully"
    })
//  console.log(req.cookies);
// console.log(req.cookies.token);
}

// @name getMeController
async function getMeController(req, res)
{
    const user = await userModel.findById(req.user.id )   
    res.status(200).json({  
        message : "User details fetched successfully",
        user : {
            id : user._id,  
            username : user.username,
            email : user.email
        }
    })
}
module.exports= {registerUserController,
    loginUserController,
    logoutUserController,
    getMeController
}
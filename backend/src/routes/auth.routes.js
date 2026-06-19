const express = require('express')
const authcontroller = require("../controllers/auth.controller")
const authrouter = express.Router()
const authmiddleware = require("../middleware/auth.middleware")

// @route POST /api/uth/register
authrouter.post("/register",authcontroller.registerUserController)
//@route POST/api/auth/login
//@description
authrouter.post("/login",authcontroller.loginUserController)

authrouter.get("/logout",authcontroller.logoutUserController)

authrouter.get("/get-me",authmiddleware.authUser, authcontroller.getMeController)
module.exports = authrouter
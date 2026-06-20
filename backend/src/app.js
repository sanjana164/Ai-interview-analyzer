const express = require("express")
const cookieParser = require("cookie-parser");

const app = express()

app.use(express.json()) // middleware
app.use(cookieParser()) // middleware to parse cookies from incoming requests

const allowedOrigins = ["http://localhost:5173",
 "https://sanjana164-aiinterviewanalyzer-iu0qes3fh-sanjana164s-projects.vercel.app/login"
]
app.use((req, res, next) => {
  const origin = req.headers.origin
  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin)
    res.header("Access-Control-Allow-Credentials", "true")
    res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS")
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    )
  }

  if (req.method === "OPTIONS") {
    return res.sendStatus(204)
  }

  next()
})

// require all the router here
const authrouter = require("./routes/auth.routes");
const inteviewRouter = require("./routes/interview.route");


//using all the routes here
app.use("/api/auth", authrouter)
app.use("/api/interview", inteviewRouter)

module.exports = app
const express = require("express")
const cookieParser = require("cookie-parser");

const app = express()

app.use(express.json()) // middleware
app.use(cookieParser()) // middleware to parse cookies from incoming requests

// Allowed origins can be provided via env var (comma-separated), or fallback to common dev origin.
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map(s => s.trim())
  : ["http://localhost:5173"]

app.use((req, res, next) => {
  const origin = req.headers.origin
  if (origin && allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin)
    res.header("Access-Control-Allow-Credentials", "true")
    res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS")
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    )

    if (req.method === "OPTIONS") {
      return res.sendStatus(204)
    }
  } else if (origin) {
    console.warn(`Blocked CORS request from origin: ${origin}`)
    // If origin is present but not allowed, explicitly deny preflight
    if (req.method === "OPTIONS") {
      return res.sendStatus(403)
    }
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
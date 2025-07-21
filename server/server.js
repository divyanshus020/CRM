import dotenv from "dotenv"
dotenv.config({ path: "../.env" });
import express from "express"
import connectDB from "./config/databaseConnection.js";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes.js";


const app = express()

const PORT = process.env.PORT || 3000

//default middlewere 
app.use(express.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(cookieParser())

//routes
app.use("/api/v1/auth", authRoutes)

app.get("/", (req, res) => { 
  res.send("Hello, World!")
})  

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
  console.log("http://localhost:" + PORT)
  connectDB()
})
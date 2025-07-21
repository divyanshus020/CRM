import dotenv from "dotenv"
dotenv.config({ path: "../.env" });
import express from "express"
import connectDB from "./config/databaseConnection.js";


const app = express()

const PORT = process.env.PORT || 3000

app.get("/", (req, res) => { 
  res.send("Hello, World!")
})  

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
  console.log("http://localhost:" + PORT)
  connectDB()
})
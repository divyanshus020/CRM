import dotenv from "dotenv"
import mongoose from "mongoose";

const connectDB = async () => {
    try {

        await mongoose.connect(process.env.MONGO_URL) 
        console.log("MongoDB connected successfully");

    } catch (error) {

        console.log(error)
        console.error("MongoDB connection failed:", error.message);
        
        
    }
}

export default connectDB
import { generateToken } from "../config/genrateToken.js";
import { User } from "../model/userModel.js";
import bcrypt from "bcrypt";

// User Registration Controller
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    console.log(name, email, password);

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
   
    await User.create({
      name,
      email,
      password: hashedPassword,
    });

    return res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    return res.status(500).json({
     message:
     error.message === "User validation failed: name: Path `name` is required."
      ? "name is required"
      : "Failed To Register",
     error: error.message,
});
  }
};

export const loginUser = async (req, res) => {
    try {
        const {email, password} = req.body

        if(!email || !password){
            return res.status(400).json({
                success:false,
                message:"All fields are required."
            })
        }

        const user = await User.findOne({email})
        if(!user){
            return res.status(400).json({
                success:false,
                message:"incorrect email or password."
            })
        }

        const isPasswordMatched = await bcrypt.compare(password, user.password)

        if(!isPasswordMatched){
            return res.status(400).json({
                success:false,
                message:"incorrect email or password."
            })
        }

        generateToken(res,user, `welecome back ${user.name}`)

    } catch (error) {
        console.log(error)
        console.log(error)
        return res.status(500).json({
            success:false,
            message:"Failed To Login"
        })
    }
}
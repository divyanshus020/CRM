import express from "express"
import { registerUser, loginUser } from "../controller/userController.js"
import isAuthntiacted from "../middleware/isAuthenticated.js"
import { createChallan } from "../controller/challanController.js"

const router = express.Router()

router.route("/create-challan").post(isAuthntiacted, createChallan)



export default router
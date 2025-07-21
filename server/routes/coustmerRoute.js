import express from "express"
import { registerUser, loginUser } from "../controller/userController.js"
import isAuthntiacted from "../middleware/isAuthenticated.js"
import { createCustomer } from "../controller/coustmerController.js"

const router = express.Router()

router.route("/new-coustmer").post(isAuthntiacted, createCustomer)



export default router
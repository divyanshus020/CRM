import express from "express"
import { registerUser, loginUser } from "../controller/userController.js"
import isAuthntiacted from "../middleware/isAuthenticated.js"
import { createChallan, deleteChallan, getAllChallans, getChallanByID, updateChallan } from "../controller/challanController.js"

const router = express.Router()

router.route("/create-challan").post(isAuthntiacted, createChallan)
router.route("/get-challans").get(isAuthntiacted, getAllChallans)
router.route("/get-challan/:id").get(isAuthntiacted, getChallanByID)
router.route("/update-challan/:id").put(isAuthntiacted, updateChallan)
router.route("/delete-challan/:id").delete(isAuthntiacted, deleteChallan)



export default router
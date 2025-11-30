import express from "express"
import { registerUser, loginUser } from "../controller/userController.js"
import isAuthenticated from "../middleware/isAuthenticated.js"
import { createChallan, deleteChallan, getAllChallans, getChallanByID, updateChallan } from "../controller/challanController.js"

const router = express.Router()

router.route("/create-challan").post(isAuthenticated, createChallan)
router.route("/get-challans").get(isAuthenticated, getAllChallans)
router.route("/get-challan/:id").get(isAuthenticated, getChallanByID)
router.route("/update-challan/:id").put(isAuthenticated, updateChallan)
router.route("/delete-challan/:id").delete(isAuthenticated, deleteChallan)



export default router
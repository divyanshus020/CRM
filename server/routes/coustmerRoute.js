import express from "express"
import { registerUser, loginUser } from "../controller/userController.js"
import isAuthntiacted from "../middleware/isAuthenticated.js"
import { createCustomer, deleteCusomer, editCustomer, getAllCustomers } from "../controller/coustmerController.js"

const router = express.Router()

router.route("/new-coustmer").post(isAuthntiacted, createCustomer)
router.route("/get-coustmers").get(isAuthntiacted, getAllCustomers)
router.route("/edit-coustmer/:id").put(isAuthntiacted, editCustomer) // Assuming edit is same as create for simplicity
router.route("/delete-coustmer/:id").delete(isAuthntiacted, deleteCusomer)


export default router
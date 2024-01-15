import { Router } from "express";
import {
  getAllBorrowers,
  getSpecificBorrower,
  updateBorrowerDetails,
  deleteBorrowers,
  register,
  login,
} from "../controllers/borrowers.controller.js";
import { authenticate } from "../validations/auth.validate.js";
const router = Router();

router.route("/").get(authenticate, getAllBorrowers);

router
  .route("/:id")
  .get(authenticate, getSpecificBorrower)
  .put(authenticate, updateBorrowerDetails)
  .delete(authenticate, deleteBorrowers);
router.route("/register").post(register);
router.route("/login").post(login);

export { router };

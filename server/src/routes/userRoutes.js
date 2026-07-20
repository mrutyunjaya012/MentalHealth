import { Router } from "express";
import {
  getUsers,
  getUserByEmail,
  registerUser,
  loginUser,
  updateUserRole,
  deleteUser,
} from "../controllers/userController.js";

const router = Router();

router.get("/", getUsers);
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/:email", getUserByEmail);
router.patch("/:email/role", updateUserRole);
router.delete("/:email", deleteUser);

export default router;

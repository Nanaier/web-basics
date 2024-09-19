import express from "express";
import {
  registerUser,
  loginUser,
  getAllUsers,
  changePassword,
} from "./userController";
import { adminOnly, authenticateToken } from "./authMiddleware";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/", authenticateToken, adminOnly, getAllUsers);
router.put("/change-password", authenticateToken, changePassword);

export default router;

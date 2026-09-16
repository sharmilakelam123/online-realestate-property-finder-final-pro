import express from "express";

import {
  registerUser,
  loginUser,
  demoLogin,
  forgotPassword,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/register", registerUser);

// ONLY LOGIN — this will give Login successful
router.post("/login", demoLogin);

router.post("/forgot-password", forgotPassword);

export default router;
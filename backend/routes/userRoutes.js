import express from "express";

import {
  addToWishlist,
  removeFromWishlist,
  getWishlist,
} from "../controllers/userController.js";

import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// WISHLIST ROUTES
router.post("/wishlist/:id", protect, addToWishlist);
router.delete("/wishlist/:id", protect, removeFromWishlist);
router.get("/wishlist", protect, getWishlist);

export default router;
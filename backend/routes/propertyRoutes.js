import express from "express";

import {
  createProperty,
  getProperties,
  getMyProperties,
  getPropertyStats,
  getLocalityTrends,
  getPropertyById,
  updateProperty,
  deleteProperty,
} from "../controllers/propertyController.js";

import protect from "../middleware/authMiddleware.js";
import upload from "../middleware/upload.js";

const router = express.Router();

// CREATE WITH IMAGE
router.post(
  "/",
  protect,
  upload.single("image"),
  createProperty
);

// GET ALL
router.get("/", getProperties);

// STATS
// Must be before /:id
router.get("/stats", getPropertyStats);

// LOCALITY TRENDS
// Must be before /:id
router.get(
  "/locality-trends",
  getLocalityTrends
);

// MY PROPERTIES
// Must be before /:id
router.get(
  "/my",
  protect,
  getMyProperties
);

// SINGLE PROPERTY
router.get(
  "/:id",
  getPropertyById
);

// UPDATE PROPERTY
router.put(
  "/:id",
  protect,
  updateProperty
);

// DELETE PROPERTY
router.delete(
  "/:id",
  protect,
  deleteProperty
);

export default router;
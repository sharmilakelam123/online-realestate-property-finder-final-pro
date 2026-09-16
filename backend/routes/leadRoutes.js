import express from "express";
import protect from "../middleware/authMiddleware.js";
import { createLead, getMyLeads, getRecentLeads, updateLeadStatus } from "../controllers/leadController.js";

const router = express.Router();

// Public enquiry create (user optional)
router.post("/", createLead);

// Public demo feed (tracking without real auth)
router.get("/recent", getRecentLeads);

// User dashboard tracking
router.get("/my", protect, getMyLeads);
router.put("/:id/status", protect, updateLeadStatus);

export default router;


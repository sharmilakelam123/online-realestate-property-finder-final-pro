import express from "express";

import {
  createBooking,
  getAllBookings,
  cancelBooking,
  updateBookingStatus,
} from "../controllers/bookingController.js";

const router = express.Router();

// Create a property visit booking
router.post("/", createBooking);

// Get all bookings
router.get("/", getAllBookings);

// Cancel booking
router.put("/:id/cancel", cancelBooking);

// Admin: update booking status
router.put("/:id/status", updateBookingStatus);

export default router;
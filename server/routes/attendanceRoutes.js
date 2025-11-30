import express from "express";
import authMiddleware from "../middleware/auth.js";
import {
  checkIn,
  checkOut,
  getMyHistory,
  getMySummary,
  getTodayStatus
} from "../controllers/attendanceController.js";

const router = express.Router();

router.post("/checkin", authMiddleware, checkIn);
router.post("/checkout", authMiddleware, checkOut);
router.get("/my-history", authMiddleware, getMyHistory);
router.get("/my-summary", authMiddleware, getMySummary);
router.get("/today", authMiddleware, getTodayStatus);

export default router;

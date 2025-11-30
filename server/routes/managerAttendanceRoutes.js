import express from "express";
import authMiddleware from "../middleware/auth.js";
import managerOnly from "../middleware/role.js";
import {
  getAllAttendance,
  getEmployeeAttendance,
  getTeamSummary,
  getTodayTeamStatus,
  exportAttendanceCSV
} from "../controllers/managerAttendanceController.js";

const router = express.Router();

// All routes: protected + manager only
router.use(authMiddleware, managerOnly);

router.get("/all", getAllAttendance);
router.get("/employee/:id", getEmployeeAttendance);
router.get("/summary", getTeamSummary);
router.get("/today-status", getTodayTeamStatus);
router.get("/export", exportAttendanceCSV);

export default router;

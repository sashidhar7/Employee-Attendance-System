import express from "express";
import authMiddleware from "../middleware/auth.js";
import { getEmployeeDashboard, getManagerDashboard } from "../controllers/dashboardController.js";

const router = express.Router();

// employee dashboard
router.get("/employee", authMiddleware, getEmployeeDashboard);

// manager dashboard
router.get("/manager", authMiddleware, getManagerDashboard);

export default router;

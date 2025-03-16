import express from "express";
import {
  checkTodayAttendance,
  getAttendance,
  markAttendance,
} from "../../controllers/student/studentAttendanceController.js";
const router = express.Router();
router.get("/",getAttendance)
router.post("/mark", markAttendance);
router.get("/status", checkTodayAttendance);

export default router;

import express from "express";
import {
  checkTodayAttendace,
  getAttendance,
  markAttendance,
} from "../../controllers/student/studentAttendanceController.js";
const router = express.Router();
router.get("/",getAttendance)
router.post("/mark", markAttendance);
router.get("/status", checkTodayAttendace);
router.get("/", (req, res) => {
  res.send("send");
});

export default router;

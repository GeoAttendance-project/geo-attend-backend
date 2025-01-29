import express from "express";
import { markAttendance } from "../../controllers/student/studentAttendanceController.js";
const router = express.Router();

router.post("/mark", markAttendance);
router.get("/", (req, res) => {
  res.send("send");
});

export default router;

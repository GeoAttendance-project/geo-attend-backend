import express from "express";
const router = express.Router();
import attendanceRouter from "./studentAttendanceRoutes.js";
import authRouter from "./studentAuthenticationRoutes.js";
import profileRouter from "./studentProfileRoutes.js";
import { protect } from "../../controllers/student/studentAuthenticationController.js";

router.use("/auth", authRouter);
router.use(protect);
router.use("/attendance", attendanceRouter);
router.use("/profile",profileRouter)
export default router;

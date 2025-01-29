import express from "express";
import studentRouter from "./adminStudentRoutes.js";
import authRouter from './adminAuthenticationRoutes.js'
import attendanceLocationRouter from './adminAttendanceLocationRoutes.js'
import { addAdmin } from "../../controllers/admin/adminController.js";
import { protect } from "../../controllers/admin/adminAuthenticationController.js";
const router = express.Router();

router.use("/auth",authRouter)
router.use(protect)
router.use("/student", studentRouter);
router.use("/attendance-location", attendanceLocationRouter);
router.route("/").post(addAdmin)
export default router;

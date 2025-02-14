import express from "express";
import studentRouter from "./adminStudentRoutes.js";
import authRouter from './adminAuthenticationRoutes.js'
import attendanceLocationRouter from './adminAttendanceLocationRoutes.js'
import { addAdmin } from "../../controllers/admin/adminController.js";
import { protect } from "../../controllers/admin/adminAuthenticationController.js";
import { getAllAnnouncement, getAnnouncement, postAnnouncement } from "../../controllers/admin/adminAnnouncementController.js";
import { getAttendanceByDate } from "../../controllers/admin/adminAttendanceController.js";
const router = express.Router();

router.use("/auth",authRouter)
router.use(protect)
router.use("/student", studentRouter);
router.use("/attendance-location", attendanceLocationRouter);
router.use("/attendance", getAttendanceByDate);
router.route("/").post(addAdmin)
router.route("/announcement").post(postAnnouncement).get(getAllAnnouncement)
router.route("/announcement/:id").get(getAnnouncement)
export default router;

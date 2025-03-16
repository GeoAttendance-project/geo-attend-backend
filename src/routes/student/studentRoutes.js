import express from "express";
const router = express.Router();
import attendanceRouter from "./studentAttendanceRoutes.js";
import authRouter from "./studentAuthenticationRoutes.js";
import profileRouter from "./studentProfileRoutes.js";
import { protect } from "../../controllers/student/studentAuthenticationController.js";
import { getAllAnnouncement } from "../../controllers/student/studentAnnouncemntController.js";
import { requestDeviceChange, requestDeviceChangeStatus } from "../../controllers/student/studentDeviceChangeController.js";

router.use("/auth", authRouter);
router.use(protect);
router.use("/attendance", attendanceRouter);
router.use("/profile", profileRouter);
router.route("/announcement").get(getAllAnnouncement);
router.route("/device-change").post(requestDeviceChange);
router.route("/device-change/status").get(requestDeviceChangeStatus);

export default router;

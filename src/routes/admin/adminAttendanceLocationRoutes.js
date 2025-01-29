import express from "express";
import { addAttendanceLocation, getAllAttendanceLocations, getAttendanceLocation, updateAttendanceLocation } from "../../controllers/admin/adminAttendanceLocationController.js";
const router = express.Router();

router.route("/").get(getAllAttendanceLocations).post(addAttendanceLocation).put(updateAttendanceLocation);
router.route("/:department/:year").get(getAttendanceLocation).put();

export default router;

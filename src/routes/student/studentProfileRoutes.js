import express from "express";
import { protect } from "../../controllers/student/studentAuthenticationController.js";
import { getProfile } from "../../controllers/student/studentProfileController.js";
const router = express.Router();

router.get("/", getProfile);

export default router;

import express from "express"
import { login } from "../../controllers/student/studentAuthenticationController.js";
const router = express.Router();

router.post("/login",login);

export default router;
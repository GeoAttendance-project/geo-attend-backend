import express from "express"
import { login } from "../../controllers/admin/adminAuthenticationController.js";
const router = express.Router();

router.post("/login",login);

export default router;
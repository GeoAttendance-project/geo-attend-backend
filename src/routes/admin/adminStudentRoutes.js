import express from "express";
import {
  addStudent,
  getAllStudents,
  getAStudent,
  updateStudent,
} from "../../controllers/admin/adminStudentController.js";
const router = express.Router();

router.route("/").get(getAllStudents).post(addStudent);
router.route("/:id").get(getAStudent).put(updateStudent);

export default router;

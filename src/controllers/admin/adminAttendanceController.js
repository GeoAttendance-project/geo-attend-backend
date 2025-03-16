import moment from "moment";
import Student from "../../models/student/studentModel.js";
import AppError from "../../utils/appError.js";
import { catchAsync } from "../../utils/catchAsync.js";
import Attendance from "../../models/attenndance/attendanceModel.js";
import { getAttendanceByDateValidator } from "../../validators/admin/admin.student.attendance.validator.js";
import { matchedData, validationResult } from "express-validator";

export const getAttendanceByDate = catchAsync(async (req, res, next) => {
  await Promise.all(
    getAttendanceByDateValidator.map((validator) => validator.run(req))
  );

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AppError(`${errors.array().at(0)?.msg}`, 400));
  }

  const { department, year, date, session } = matchedData(req, {
    locations: ["body", "query"],
  });
console.log(department, year, date, session )
  const startDate = moment(date, "YYYY-MM-DD").startOf("day").toDate();
  const endDate = moment(date, "YYYY-MM-DD").endOf("day").toDate();

  // Fetch all students for the given department and year
  const students = await Student.find({
    department,
    year: parseInt(year),
    isActive: true,
  });

  if (!students.length) {
    return res.status(200).json({
      status: "success",
      results: 0,
      data: [],
    });
  }

  // Fetch attendance for students within the given date range
  const studentIds = students.map((student) => student._id);
  const attendanceRecords = await Attendance.find({
    student: { $in: studentIds },
    markedDate: { $gte: startDate, $lte: endDate },
  });

  // Create a map of student IDs with their attendance status
  const attendanceMap = new Map();
  attendanceRecords.forEach((record) => {
    if (record[session] && record[session].markedAt) {
      attendanceMap.set(record.student.toString(), true);
    }
  });

  // Prepare response data
  const attendanceStatus = students.map((student) => ({
    name: student.name,
    examNo: Number(student.examNo),
    department: student.department,
    year: student.year,
    present: attendanceMap.get(student._id.toString()) || false, // Ensure false if not found
  }));

  // Sort by exam number
  attendanceStatus.sort((a, b) => a.examNo - b.examNo);

  res.status(200).json({
    status: "success",
    results: attendanceStatus.length,
    data: attendanceStatus,
  });
});

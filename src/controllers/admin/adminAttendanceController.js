import moment from "moment";
import Student from "../../models/student/studentModel.js";
import AppError from "../../utils/appError.js";
import { catchAsync } from "../../utils/catchAsync.js";
import Attendance from "../../models/attenndance/attendanceModel.js";

export const getAttendanceByDate = catchAsync(async (req, res, next) => {
  const { department, year, date } = req.query;

  if (!department || !year || !date) {
    return next(new AppError("Department, year, and date are required", 400));
  }

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

  // Create a mapping of student IDs with attendance
  const attendanceMap = new Set(
    attendanceRecords.map((record) => record.student.toString())
  );

  // Prepare response data
  const attendanceStatus = students.map((student) => ({
    name: student.name,
    examNo: Number(student.examNo),
    department: student.department,
    year: student.year,
    present: attendanceMap.has(student._id.toString()),
  }));

  // Sort by roll number
  attendanceStatus.sort((a, b) => a.examNo - b.examNo);

  res.status(200).json({
    status: "success",
    results: attendanceStatus.length,
    data: attendanceStatus,
  });
});

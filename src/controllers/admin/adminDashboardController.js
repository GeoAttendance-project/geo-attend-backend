import { catchAsync } from "../../utils/catchAsync.js";
import Student from "../../models/student/studentModel.js";
import Attendance from "../../models/attenndance/attendanceModel.js";
import AttendanceLocation from "../../models/admin/adminAttendanceLocationModel.js";

export const getDashboard = catchAsync(async (req, res, next) => {
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  const totalStudents = (await Student.countDocuments({ isActive: true })) || 0;

  const studentsByYear = await Student.aggregate([
    { $match: { isActive: true, year: { $in: [2, 3, 4] } } },
    { $group: { _id: "$year", count: { $sum: 1 } } },
  ]);

  const studentsByYearObj = { year_2: 0, year_3: 0, year_4: 0 };
  studentsByYear.forEach((item) => {
    studentsByYearObj[`year_${item._id}`] = item.count;
  });

  const studentsByDepartment = await Student.aggregate([
    { $match: { isActive: true } },
    { $group: { _id: "$department", count: { $sum: 1 } } },
  ]);

  const studentsByDepartmentObj = {};
  studentsByDepartment.forEach((item) => {
    studentsByDepartmentObj[item._id] = item.count;
  });

  const totalAttendanceLocations =
    (await AttendanceLocation.countDocuments({})) || 0;
  const students = await Student.find(
    { year: { $in: [2, 3, 4] }, isActive: true },
    { _id: 1, year: 1 }
  );

  const studentYearMap = students.reduce((acc, student) => {
    acc[student._id.toString()] = student.year;
    return acc;
  }, {});

  const attendanceData = await Attendance.find({ markedDate: today });

  const attendanceReport = {
    year_2: { morning: 0, afternoon: 0 },
    year_3: { morning: 0, afternoon: 0 },
    year_4: { morning: 0, afternoon: 0 },
  };

  attendanceData.forEach((record) => {
    const studentYear = studentYearMap[record.student.toString()];
    if (studentYear) {
      if (record.morning?.markedAt) {
        attendanceReport[`year_${studentYear}`].morning += 1;
      }
      if (record.afternoon?.markedAt) {
        attendanceReport[`year_${studentYear}`].afternoon += 1;
      }
    }
  });

  res.status(200).json({
    status: "success",
    data: {
      totalStudents,
      studentsByYear: studentsByYearObj,
      studentsByDepartment: studentsByDepartmentObj,
      totalAttendanceLocations,
      todaysAttendance: attendanceReport,
    },
  });
});

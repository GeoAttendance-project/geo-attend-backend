import { catchAsync } from "../../utils/catchAsync.js";
import Student from "../../models/student/studentModel.js";
import AttendanceLocation from "../../models/attenndance/attendanceModel.js";

export const getDashboard = catchAsync(async (req, res, next) => {
  try {
    // Get total number of students
    const totalStudents = await Student.countDocuments({isActive:true});

    // Get student count by year
    const studentsByYear = await Student.aggregate([
      {$match:{ isActive:true}},
      { $group: { _id: "$year", count: { $sum: 1 } } },
    ]);

    // Get student count by department
    const studentsByDepartment = await Student.aggregate([
      {$match:{ isActive:true}},
      { $group: { _id: "$department", count: { $sum: 1 } } },
    ]);

    // Get total attendance locations
    const totalAttendanceLocations = await AttendanceLocation.countDocuments();

    // Send response
    res.status(200).json({
      status: "success",
      data: {
        totalStudents,
        studentsByYear,
        studentsByDepartment,
        totalAttendanceLocations,
      },
    });
  } catch (error) {
    next(error);
  }
});

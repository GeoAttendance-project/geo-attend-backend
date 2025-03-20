import AttendanceLocation from "../../models/admin/adminAttendanceLocationModel.js";
import Attendance from "../../models/attenndance/attendanceModel.js";
import Student from "../../models/student/studentModel.js";
import AppError from "../../utils/appError.js";
import { catchAsync } from "../../utils/catchAsync.js";

export const markAttendance = catchAsync(async (req, res, next) => {
  const { latitude, longitude } = req.body;
  const studentId = req.student._id;

  // Validate input
  if (!latitude || !longitude) {
    return next(new AppError("Latitude and Longitude are required.", 400));
  }

  // Get the student's department and year
  const student = await Student.findById(studentId);
  if (!student) {
    return next(new AppError("Student not found.", 404));
  }

  const { department, year } = student;

  // Find the geo-point for this department and year
  const geoPoint = await AttendanceLocation.findOne({ department, year });
  if (!geoPoint) {
    return next(
      new AppError(
        "Attendance location not set for this department and year.",
        404
      )
    );
  }

  const nearbyPoint = await AttendanceLocation.aggregate([
    {
      $geoNear: {
        near: {
          type: "Point",
          coordinates: [longitude, latitude], // [longitude, latitude]
        },
        distanceField: "distance",
        spherical: true,
        maxDistance: 35, // Use radius value (in meters)
      },
    },
  ]);

  // Check if the student is within the attendance range
  if (!nearbyPoint.length) {
    return next(
      new AppError("You are not within the allowed attendance range.", 400)
    );
  }

  // Get the current date (only date part)
  const markedDate = new Date().toISOString().split("T")[0];

  // Prevent duplicate attendance
  const existingAttendance = await Attendance.findOne({
    student: studentId,
    markedDate,
  });
  if (existingAttendance) {
    return next(new AppError("Attendance already marked for today.", 400));
  }

  // Create attendance record
  const attendance = await Attendance.create({
    student: studentId,
    markedDate,
    gpsLocation: { latitude, longitude },
  });

  // Send success response
  res.status(201).json({
    status: "success",
    message: "Attendance marked successfully!",
    data: attendance,
  });
});

export const checkTodayAttendace = catchAsync(async (req, res, next) => {
  // Get the current date (only date part)
  const studentId = req.student._id;

  const markedDate = new Date().toISOString().split("T")[0];

  // Prevent duplicate attendance
  const existingAttendance = await Attendance.findOne({
    student: studentId,
    markedDate,
  });
  res.status(201).json({
    status: "success",
    message: "Attendance marked successfully!",
    marked: existingAttendance ? true : false,
  });
});


export const getAttendance =catchAsync(async(req,res,next)=>{
  let studentId = req.student?.id
  const attenndance = await Attendance.find({student:studentId})
  res.status(201).json({
    status: "success",
    message: "Attendance marked successfully!",
    data:attenndance
  });
})
import { matchedData, validationResult } from "express-validator";
import AttendanceLocation from "../../models/admin/adminAttendanceLocationModel.js";
import Attendance from "../../models/attenndance/attendanceModel.js";
import Student from "../../models/student/studentModel.js";
import AppError from "../../utils/appError.js";
import { catchAsync } from "../../utils/catchAsync.js";
import { studentAttendanceMarkValidator } from "../../validators/student/student.attendance.validator.js";
import moment from "moment";

export const markAttendance = catchAsync(async (req, res, next) => {
  await Promise.all(
    studentAttendanceMarkValidator.map((validator) => validator.run(req))
  );

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AppError(`${errors.array().at(0)?.msg}`, 400));
  }
  const { latitude, longitude, session, deviceId } = matchedData(req);
  const studentId = req.student._id;

  const student = await Student.findById(studentId);
  if (!student) {
    return next(new AppError("Student not found.", 404));
  }

  const existingUser = await Student.findOne({
    deviceId,
    _id: { $ne: studentId },
  });
  if (existingUser) {
    return next(
      new AppError("This device is already registered to another student.", 403)
    );
  }

  if (!student.deviceId) {
    student.deviceId = deviceId;
    await student.save();
  } else if (student.deviceId !== deviceId) {
    return next(
      new AppError("Attendance must be marked from the registered device.", 403)
    );
  }

  const { department, year } = student;

  const geoPoint = await AttendanceLocation.findOne({ department, year });
  if (!geoPoint) {
    return next(
      new AppError(
        "Attendance location not set for this department and year.",
        404
      )
    );
  }

  const maxDistance = 10; // meters

  const nearbyPoint = await AttendanceLocation.aggregate([
    {
      $geoNear: {
        near: {
          type: "Point",
          coordinates: [Number(latitude), Number(longitude)],
        },
        distanceField: "distance",
        spherical: true,
        maxDistance: maxDistance,
        query: { department, year },
      },
    },
  ]);

  if (!nearbyPoint.length || nearbyPoint[0].distance > maxDistance) {
    return next(
      new AppError("You are not within the allowed attendance location.", 400)
    );
  }

  const markedDate = new Date().toISOString().split("T")[0];

  let attendance = await Attendance.findOne({ student: studentId, markedDate });

  if (attendance) {
    if (attendance[session]?.markedAt) {
      return next(
        new AppError(`Attendance already marked for ${session}.`, 400)
      );
    }

    attendance[session] = {
      gpsLocation: { latitude, longitude },
      markedAt: new Date(),
    };
    await attendance.save();
  } else {
    attendance = await Attendance.create({
      student: studentId,
      markedDate,
      [session]: {
        gpsLocation: { latitude, longitude },
        markedAt: new Date(),
      },
    });
  }

  res.status(201).json({
    status: "success",
    message: `Attendance marked successfully for ${session}!`,
    data: attendance,
  });
});

export const checkTodayAttendance = catchAsync(async (req, res, next) => {
  const studentId = req.student._id;
  const markedDate = moment().format("YYYY-MM-DD");

  const existingAttendance = await Attendance.findOne({
    student: studentId,
    markedDate,
  });

  const morningMarked = !!existingAttendance?.morning?.markedAt;
  const afternoonMarked = !!existingAttendance?.afternoon?.markedAt;

  const now = moment();
  const isMorningTime = 9 === 9 && now.minute() >= 0 && 13 <= 15;
  const isAfternoonTime =
    (13=== 13 && 47 >= 45 && 47 <= 59) ||
    (now.hour() === 14 && now.minute() === 0);

  res.status(200).json({
    status: "success",
    message: "Attendance status fetched successfully!",
    attendance: {
      morning: morningMarked,
      afternoon: afternoonMarked,
    },
    isMorningTime,
    isAfternoonTime,
  });
});

export const getAttendance = catchAsync(async (req, res, next) => {
  let studentId = req.student?.id;
  const attenndance = await Attendance.find({ student: studentId });
  res.status(201).json({
    status: "success",
    message: "Attendance marked successfully!",
    data: attenndance,
  });
});

import { matchedData, validationResult } from "express-validator";
import DeviceChangeRequest from "../../models/student/studentDeviceChangeModel.js";
import Student from "../../models/student/studentModel.js";
import AppError from "../../utils/appError.js";
import { catchAsync } from "../../utils/catchAsync.js";
import { studentDeviceChangeRequestValidator } from "../../validators/student/student.devicechange.validator.js";

export const requestDeviceChange = catchAsync(async (req, res, next) => {
  await Promise.all(
    studentDeviceChangeRequestValidator.map((validator) => validator.run(req))
  );

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AppError(`${errors.array().at(0)?.msg}`, 400));
  }
  const { newDeviceId, reason } = matchedData(req);
  const studentId = req.student._id;

  const student = await Student.findById(studentId);
  if (!student) {
    return next(new AppError("Student not found", 404));
  }

  // Store the request for admin approval
  await DeviceChangeRequest.create({
    student: studentId,
    oldDeviceId: student.deviceId || "Not Registered",
    newDeviceId,
    reason,
    status: "PENDING",
  });

  res.status(200).json({
    status: "success",
    message: "Device change request submitted. Waiting for admin approval.",
  });
});

export const requestDeviceChangeStatus = catchAsync(async (req, res, next) => {
  const studentId = req.student._id;
  const request = await DeviceChangeRequest.findOne({
    student: studentId,
  }).sort({ _id: -1 });

  if (!request) {
    return res.json({ status: "NO_REQUEST" });
  }

  return res.json({ status: request.status });
});

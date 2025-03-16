import { matchedData, validationResult } from "express-validator";
import { addAttendanceLocationValidator } from "../../validators/admin/admin.attendance.location.validator.js";
import AttendanceLocation from "../../models/admin/adminAttendanceLocationModel.js";
import AppError from "../../utils/appError.js";
import { catchAsync } from "../../utils/catchAsync.js";
import { getAttendanceByDateValidator } from "../../validators/admin/admin.student.attendance.validator.js";

export const addAttendanceLocation = catchAsync(async (req, res, next) => {
  await Promise.all(
    addAttendanceLocationValidator.map((validator) => validator.run(req))
  );

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AppError(`${errors.array().at(0)?.msg}`, 400));
  }

  const { department, year, radius, geoLocation } = matchedData(req, {
    locations: ["body", "params"],
  });

  const existingLocation = await AttendanceLocation.findOne({
    department,
    year,
  });
  if (existingLocation) {
    return next(
      new AppError("Location already set for this department and year", 400)
    );
  }

  const location = await AttendanceLocation.create({
    department,
    year,
    geoLocation,
    radius,
  });

  res.status(201).json({
    status: "success",
    message: "Attendance location set successfully!",
    data: location,
  });
});

export const updateAttendanceLocation = catchAsync(async (req, res, next) => {
  await Promise.all(
    addAttendanceLocationValidator.map((validator) => validator.run(req))
  );

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AppError(`${errors.array().at(0)?.msg}`, 400));
  }

  const { department, year, radius, geoLocation } = matchedData(req, {
    locations: ["body", "params"],
  });

  const location = await AttendanceLocation.findOneAndUpdate(
    { department, year },
    { geoLocation: geoLocation },
    { new: true, runValidators: true }
  );

  if (!location) {
    return next(
      new AppError(
        "Location not found for the specified department and year",
        404
      )
    );
  }

  res.status(200).json({
    status: "success",
    message: "Attendance location updated successfully!",
    data: location,
  });
});

export const getAttendanceLocation = catchAsync(async (req, res, next) => {
  await Promise.all(
    getAttendanceByDateValidator.map((validator) => validator.run(req))
  );

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AppError(`${errors.array().at(0)?.msg}`, 400));
  }

  const { department, year } = matchedData(req, {
    locations: ["body", "params"],
  });

  const location = await AttendanceLocation.findOne({ department, year });

  if (!location) {
    return next(new AppError("Attendance location not found", 404));
  }

  res.status(200).json({
    status: "success",
    data: location,
  });
});

export const getAllAttendanceLocations = catchAsync(async (req, res, next) => {
  const locations = await AttendanceLocation.find().select("-__v");

  if (!locations.length) {
    return next(new AppError("No attendance locations found", 404));
  }

  res.status(200).json({
    status: "success",
    results: locations.length,
    data: locations,
  });
});

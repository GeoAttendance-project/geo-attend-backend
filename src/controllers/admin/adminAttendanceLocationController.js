import AttendanceLocation from "../../models/admin/adminAttendanceLocationModel.js";
import AppError from "../../utils/appError.js";
import { catchAsync } from "../../utils/catchAsync.js";

export const addAttendanceLocation = catchAsync(async (req, res, next) => {
  const { department, year, latitude, longitude, radius } = req.body;

  if (!department || !year || !latitude || !longitude || !radius) {
    return next(new AppError("All fields are required", 400));
  }

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
    geoLocation:[latitude,longitude],
    radius,
  });

  res.status(201).json({
    status: "success",
    message: "Attendance location set successfully!",
  });
});

export const updateAttendanceLocation = catchAsync(async (req, res, next) => {
  const { department, year, latitude, longitude, radius } = req.body;

  const location = await AttendanceLocation.findOneAndUpdate(
    { department, year },
    { location: { latitude, longitude }, radius },
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
  });
});

export const getAttendanceLocation = catchAsync(async (req, res, next) => {
  const { department, year } = req.params;

  const location = await AttendanceLocation.findOne({ department, year });

  if (!location) {
    return next(new AppError("Attendance location not found", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      department: location.department,
      year: location.year,
      location: location.location,
      radius: location.radius,
    },
  });
});

export const getAllAttendanceLocations = catchAsync(async (req, res, next) => {
  const locations = await AttendanceLocation.find().select("-__v");

  if (locations.length === 0) {
    return next(new AppError("No attendance locations found", 404));
  }

  res.status(200).json({
    status: "success",
    results: locations.length,
    data: {
      locations,
    },
  });
});

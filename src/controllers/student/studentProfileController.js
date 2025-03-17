import Student from "../../models/student/studentModel.js";
import AppError from "../../utils/appError.js";
import { catchAsync } from "../../utils/catchAsync.js";

export const getProfile = catchAsync(async (req, res, next) => {
  if (!req.student?._id)
    return next(new AppError("Session Expire please login again!", 401));

  const student = await Student.findById(req.student._id).select("-deviceId");

  if (!student) {
    return next(new AppError("Student not found!", 404));
  }

  res.status(200).json({
    status: "success",
    data: student,
  });
});

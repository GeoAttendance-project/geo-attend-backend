import { matchedData, validationResult } from "express-validator";
import AppError from "../../utils/appError.js";
import { catchAsync } from "../../utils/catchAsync.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Student from "../../models/student/studentModel.js";
import { studentLoginValidator } from "../../validators/student/student.authentication.validator.js";

export const login = catchAsync(async (req, res, next) => {
  await Promise.all(
    studentLoginValidator.map((validator) => validator.run(req))
  );

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AppError(`${errors.array().at(0)?.msg}`, 400));
  }

  const { username, password } = matchedData(req);

  const student = await Student.findOne({ username: username }).select(
    "+password"
  );

  if (!student) {
    return next(new AppError("Incorrect username or password", 404));
  }

  const isPasswordCorrect = await bcrypt.compare(password, student.password);

  if (!isPasswordCorrect) {
    return next(new AppError("Incorrect username or password", 401));
  }

  const token = jwt.sign({ id: student._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  res.status(200).json({
    status: "success",
    token,
    data: {
      student: {
        id: student._id,
        username: student.username,
      },
    },
  });
});


export const protect = catchAsync(async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('You are not logged in! Please log in to get access.', 401));
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
console.log(decoded);
  const student = await Student.findById(decoded.id);
  if (!student) {
    return next(new AppError('The student belonging to this token no longer exists.', 401));
  }

  req.student = student;
  next();
});

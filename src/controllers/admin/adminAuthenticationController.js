import { matchedData, validationResult } from "express-validator";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { catchAsync } from "../../utils/catchAsync.js";
import { adminLoginValidator } from "../../validators/admin/admin.authentication.validator.js";
import AppError from "../../utils/appError.js";
import Admin from "../../models/admin/adminModel.js";

export const login = catchAsync(async (req, res, next) => {
  await Promise.all(adminLoginValidator.map((validator) => validator.run(req)));

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AppError(`${errors.array().at(0)?.msg}`, 400));
  }

  const { username, password } = matchedData(req);

  const admin = await Admin.findOne({ username: username }).select("+password");

  if (!admin) {
    return next(new AppError("Admin not found", 404));
  }

  const isPasswordCorrect = await bcrypt.compare(password, admin.password);

  if (!isPasswordCorrect) {
    return next(new AppError("Incorrect password", 401));
  }

  const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  res.status(200).json({
    status: "success",
    token,
    data: {
      admin: {
        id: admin._id,
        username: admin.username,
      },
    },
  });
});

export const protect = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(
      new AppError("You are not logged in! Please log in to get access.", 401)
    );
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  const student = await Admin.findById({ _id: decoded.id });
  if (!student) {
    return next(
      new AppError("The Admin belonging to this token no longer exists.", 401)
    );
  }

  req.student = student;
  next();
});

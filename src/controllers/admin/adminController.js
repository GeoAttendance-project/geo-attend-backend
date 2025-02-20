import { matchedData, validationResult } from "express-validator";
import AppError from "../../utils/appError.js";
import { catchAsync } from "../../utils/catchAsync.js";
import crypto from "crypto";
import { addAdminValidator } from "../../validators/admin/addAdmin.validator.js";
import Admin from "../../models/admin/adminModel.js";
import adminEventEmitter from "../../helpers/adminEventEmitter.js";

export const addAdmin = catchAsync(async (req, res, next) => {
  // Validate request body using admin validators
  await Promise.all(addAdminValidator.map((validator) => validator.run(req)));

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AppError(`${errors.array().at(0)?.msg}`, 400));
  }

  // Extract validated data
  const { firstName, lastName, email, username } = matchedData(req);

  // Generate a random password for the admin
  const rawPassword = `${username}-${crypto.randomBytes(4).toString("hex")}`;

  const checkAdminExists = await Admin.findOne({ email: email });

  if (checkAdminExists) {
    return next(new AppError("Admin Already Exsits", 400));
  }

  const checkUsernameAvailability = await Admin.findOne({ username: username });

  if (checkUsernameAvailability) {
    return next(
      new AppError(
        "Username already Exists. Please try different username",
        400
      )
    );
  }

  // Create the admin with the generated password
  const admin = await Admin.create({
    firstName,
    lastName,
    email,
    username,
    password: rawPassword,
  });
  
  adminEventEmitter.emit(
    "send_username_password_student",
    admin.email,
    admin.firstName,
    admin.username,
    rawPassword
  );

  res.status(201).json({
    status: "success",
    message: "Admin added successfully!",
    data: {
      username: admin.username,
      password: rawPassword,
    },
  });
});
export const getAdmin = catchAsync(async (req, res, next) => {
  // Create the admin with the generated password
  const admins = await Admin.find({});

  res.status(201).json({
    status: "success",
    data: {
      admins,
    },
  });
});

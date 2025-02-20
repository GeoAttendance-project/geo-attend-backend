import { matchedData, validationResult } from "express-validator";
import AppError from "../../utils/appError.js";
import { catchAsync } from "../../utils/catchAsync.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import Student from "../../models/student/studentModel.js";
import {
  addStudentValidator,
  studentUpdateValidator,
} from "../../validators/admin/admin.student.validator.js";
import adminEventEmitter from "../../helpers/adminEventEmitter.js";
export const addStudent = catchAsync(async (req, res, next) => {
  await Promise.all(addStudentValidator.map((validator) => validator.run(req)));

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AppError(`${errors.array().at(0)?.msg}`, 400));
  }

  const { name, email, examNo, department, year } = matchedData(req);

  const existingStudent = await Student.findOne({
    $or: [{ email }, { examNo }],
    isActive: true,
  });

  if (existingStudent) {
    return next(new AppError("Student with this email, exam number, or roll number already exists.", 400));
  }
  const rawPassword = `${examNo}@csice`;

  const student = await Student.create({
    name,
    email,
    examNo,
    department,
    year,
    password: rawPassword,
  });
  adminEventEmitter.emit(
    "send_username_password_student",
    student.email,
    student.name,
    student.examNo,
    rawPassword
  );

  res.status(201).json({
    status: "success",
    message: "Student added successfully!",
    data: {
      username: student.examNo,
      password: rawPassword,
    },
  });
});

export const getAllStudents = catchAsync(async (req, res, next) => {
  const students = await Student.find({ isActive: true });
  if (!students) {
    return next(new AppError("No Students available", 404));
  }

  res.status(200).json({
    status: "success",
    data: students,
  });
});

export const getAStudent = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const student = await Student.find({ _id: id });
  if (!student) {
    return next(new AppError("Student Not Found!", 404));
  }

  res.status(200).json({
    stauts: "success",
    data: student,
  });
});

export const updateStudent = catchAsync(async (req, res, next) => {
  await Promise.all(
    studentUpdateValidator.map((validator) => validator.run(req))
  );

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AppError(`${errors.array().at(0)?.msg}`, 400));
  }

  const { id, name, email, examNo, department, year } = matchedData(
    req,
    { locations: ["body", "params"] }
  );
  const student = await Student.findById(id);
  if (!student) {
    return next(new AppError("Student not found", 404));
  }

  student.name = name || student.name;
  student.email = email || student.email;
  student.examNo = examNo || student.examNo;
  student.department = department || student.department;
  student.year = year || student.year;

  await student.save();

  res.status(200).json({
    status: "success",
    message: "Student updated successfully!",
    data: {
      student,
    },
  });
});

export const deleteStudent = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const student = await Student.findByIdAndUpdate(
    { _id: id },
    { isActive: false },
    { upsert: true }
  );
  if (!student) {
    return next(new AppError("Student not found", 404));
  }

  await student.save();

  res.status(200).json({
    status: "success",
    message: "Student updated successfully!",
    data: {
      student,
    },
  });
});

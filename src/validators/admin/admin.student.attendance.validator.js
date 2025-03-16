import { query } from "express-validator";

export const getAttendanceByDateValidator = [
  query("department")
    .trim()
    .notEmpty()
    .withMessage("Department is required")
    .isString()
    .withMessage("Department must be a string"),

  query("year")
    .notEmpty()
    .withMessage("Year is required")
    .isString()
    .withMessage("Year must be an integer between 1 and 4"),

  query("date")
    .trim()
    .notEmpty()
    .withMessage("Date is required")
    .isISO8601()
    .withMessage("Date must be in YYYY-MM-DD format"),

  query("session")
    .trim()
    .notEmpty()
    .withMessage("Session is required")
    .isIn(["morning", "afternoon"])
    .withMessage("Session must be either 'morning' or 'afternoon'"),
];

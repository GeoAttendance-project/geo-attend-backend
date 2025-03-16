import { body } from "express-validator";

export const studentAttendanceMarkValidator = [
  body("latitude")
    .isFloat({ min: -90, max: 90 })
    .withMessage("Latitude must be a valid number between -90 and 90"),
  body("longitude")
    .isFloat({ min: -180, max: 180 })
    .withMessage("Longitude must be a valid number between -180 and 180"),
  body("session")
    .isString()
    .notEmpty()
    .isIn(["morning", "afternoon"])
    .withMessage("Session must be either 'morning' or 'afternoon'"),
  body("deviceId")
    .isString()
    .notEmpty()
    .withMessage("Device ID is required and must be a string"),
];

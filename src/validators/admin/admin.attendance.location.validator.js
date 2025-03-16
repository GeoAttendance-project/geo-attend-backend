import { body, param } from "express-validator";

export const addAttendanceLocationValidator = [
  body("department")
    .isString()
    .notEmpty()
    .withMessage("Department is required and must be a string")
    .isIn(["IT"])
    .withMessage("Invalid department"),

  body("year")
    .isInt({ min: 2, max: 4 })
    .withMessage("Year must be an integer between 2 and 4"),

  body("radius").isNumeric().withMessage("Radius must be a number").optional(),

  body("geoLocation").isObject().withMessage("geoLocation must be an object"),

  body("geoLocation.type")
    .equals("Point")
    .withMessage('geoLocation.type must be "Point"'),

  body("geoLocation.coordinates")
    .isArray({ min: 2, max: 2 })
    .withMessage(
      "geoLocation.coordinates must be an array with exactly two values"
    )
    .custom((coordinates) => {
      if (
        typeof coordinates[0] !== "number" ||
        typeof coordinates[1] !== "number"
      ) {
        throw new Error("Both latitude and longitude must be numbers");
      }
      return true;
    }),
];


export const getAttendanceLocationValidator = [
  param("department")
    .isString()
    .notEmpty()
    .withMessage("Department is required and must be a string")
    .isIn(["IT"])
    .withMessage("Invalid department"),

  param("year")
    .isInt({ min: 2, max: 4 })
    .withMessage("Year must be an integer between 2 and 4"),
];
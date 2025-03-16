
import { body } from "express-validator";

export const studentDeviceChangeRequestValidator = [
    body("newDeviceId")
    .isString()
    .notEmpty()
    .withMessage("New Device ID is required and must be a string"),
    
    body("reason")
    .isString()
    .notEmpty()
    .isLength({ min: 10, max: 200 })
    .withMessage("Reason must be between 10 and 200 characters"),
];



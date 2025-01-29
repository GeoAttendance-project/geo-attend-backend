import { body } from "express-validator";

export const addAdminValidator = [
  body("firstName")
    .notEmpty()
    .withMessage("First name is required")
    .isLength({ max: 50 })
    .withMessage("First name must not exceed 50 characters"),

  body("lastName")
    .notEmpty()
    .withMessage("Last name is required")
    .isLength({ max: 50 })
    .withMessage("Last name must not exceed 50 characters"),

  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email address"),

  body("username")
    .notEmpty()
    .withMessage("Username is required")
    .isLength({ min: 4, max: 30 })
    .withMessage("Username must be between 4 and 30 characters"),
];

import { body } from "express-validator";

export const addAnnouncementValidator = [
  body("title")
    .isString()
    .notEmpty()
    .withMessage("Title is required and must be a string")
    .isLength({ min: 3, max: 100 })
    .withMessage("Title must be between 3 and 100 characters"),

  body("content")
    .isString()
    .notEmpty()
    .withMessage("Content is required and must be a string")
    .isLength({ min: 10 })
    .withMessage("Content must be at least 10 characters long"),
];

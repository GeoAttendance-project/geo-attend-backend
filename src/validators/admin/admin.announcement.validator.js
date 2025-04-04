import { body } from "express-validator";

export const addAnnouncementValidator = [
  body("title")
    .isString()
    .notEmpty()
    .withMessage("Title is required and must be a string")
    .isLength({ min: 1, max: 100 })
    .withMessage("Title must be between 3 and 100 characters"),

  body("content")
    .isString()
    .notEmpty()
    .withMessage("Content is required and must be a string")
    .isLength({ min: 1 })
    .withMessage("Content must be at least 10 characters long"),
  body("department")
    .notEmpty()
    .withMessage("Department is required")
    .isIn(["IT", "ALL"])
    .withMessage("Invalid department"),
  body("year")
    .notEmpty()
    .withMessage("Year is required")
    .isIn(["1", "2", "3", "4", "ALL"])
    .withMessage("Invalid year"),
  body("attachmentLink")
    .optional()
    .isURL()
    .withMessage("Attachment link must be a valid URL"),
];

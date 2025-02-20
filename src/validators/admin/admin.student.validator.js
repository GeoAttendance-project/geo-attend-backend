import { body,param } from 'express-validator';

export const addStudentValidator = [
  body('name')
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ max: 50 })
    .withMessage('Name must not exceed 50 characters'),
  
  body('email')
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email address'),

  body('examNo')
    .notEmpty()
    .withMessage('Exam number is required')
    .isLength({ min: 4, max: 30 })
    .withMessage('Exam must be between 4 and 30 characters'),


  body('department')
    .notEmpty()
    .withMessage('Department is required')
    .isIn(['IT']) // Add other departments if necessary
    .withMessage('Invalid department'),

  body('year')
    .notEmpty()
    .withMessage('Year is required')
    .isInt({ min: 2, max: 4 })
    .withMessage('Year must be between 2 and 4'),
];


export const studentUpdateValidator = [
  param("id").notEmpty().withMessage("Student ID is required").isMongoId().withMessage("Invalid Student ID"),
  body("name").optional().isString().withMessage("Last name must be a string"),
  body("email").optional().isEmail().withMessage("Invalid email address"),
  body("examNo").optional().isString().withMessage("Exam number must be a string"),
  body("rollNo").optional().isString().withMessage("Roll number must be a string"),
  body("department").optional().isString().withMessage("Department must be a valid string"),
  body("year")
    .optional()
    .isInt({ min: 2, max: 4 })
    .withMessage("Year must be a valid number between 2 and 4"),
];
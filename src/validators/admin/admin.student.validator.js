import { body,param } from 'express-validator';

export const addStudentValidator = [
  body('firstName')
    .notEmpty()
    .withMessage('First name is required')
    .isLength({ max: 50 })
    .withMessage('First name must not exceed 50 characters'),
  
  body('lastName')
    .notEmpty()
    .withMessage('Last name is required')
    .isLength({ max: 50 })
    .withMessage('Last name must not exceed 50 characters'),
  
  body('email')
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email address'),

  body('username')
    .notEmpty()
    .withMessage('Username is required')
    .isLength({ min: 4, max: 30 })
    .withMessage('Username must be between 4 and 30 characters'),

  body('rollno')
    .notEmpty()
    .withMessage('Roll number is required'),

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
  body("firstName").optional().isString().withMessage("First name must be a string"),
  body("lastName").optional().isString().withMessage("Last name must be a string"),
  body("email").optional().isEmail().withMessage("Invalid email address"),
  body("username").optional().isString().withMessage("Username must be a string"),
  body("rollno").optional().isString().withMessage("Roll number must be a string"),
  body("department").optional().isString().withMessage("Department must be a valid string"),
  body("year")
    .optional()
    .isInt({ min: 2, max: 4 })
    .withMessage("Year must be a valid number between 2 and 4"),
];
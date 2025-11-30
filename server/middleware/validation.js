import { body, validationResult } from 'express-validator';

export const validateCustomer = [
  // Name validation
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),
    
  // Email validation
  body('email')
    .optional({ checkFalsy: true })
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(),
    
  // Phone validation
  body('phone')
    .optional({ checkFalsy: true })
    .trim(),
    
  // GST validation (optional)
  body('gstNumber')
    .optional({ checkFalsy: true })
    .trim(),
    
  // Address validation
  body('address')
    .optional({ checkFalsy: true })
    .isLength({ max: 500 }).withMessage('Address cannot be longer than 500 characters'),

  // Middleware to handle validation errors
  (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }
    
    const extractedErrors = [];
    errors.array().map(err => extractedErrors.push({ [err.param]: err.msg }));
    
    return res.status(422).json({
      success: false,
      errors: extractedErrors,
    });
  }
];

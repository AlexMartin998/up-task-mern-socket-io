'use strict';

import { body, validationResult } from 'express-validator';

const emailPassRules = () => [
  body('email', 'Invalid email!').isEmail(),
  body('password', 'Password must be longer than 6 characters!').isLength({
    min: 6,
  }),
];

export const signUpValidationRules = () => [
  body('name', 'Invalid name!').notEmpty(),
  ...emailPassRules(),
];

export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) return next();

  const extractedErrors = errors.array().map(err => ({ [err.param]: err.msg }));

  return res.status(422).json({
    errors: extractedErrors,
  });
};

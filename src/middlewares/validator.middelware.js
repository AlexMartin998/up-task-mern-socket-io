'use strict';

import { body, validationResult } from 'express-validator';
import { isValidPriority } from '../helpers';

// Auth
export const emailPassRules = () => [
  body('email', 'Invalid email!').isEmail(),
  body('password', 'Password must be longer than 6 characters!').isLength({
    min: 6,
  }),
];

export const signUpValidationRules = () => [
  body('name', 'Invalid name!').notEmpty(),
  ...emailPassRules(),
];

// Projects
export const createProjectRules = () => [
  body('name', 'Invalid name!').notEmpty(),
  body('description', 'Invalid description!').notEmpty(),
  body('client', 'Invalid client!').notEmpty(),
  // body('owner', 'Invalid owner!').isMongoId(),
];

// Tasks:
export const createTaskRules = () => [
  body('name', 'Invalid name!').notEmpty(),
  body('description', 'Invalid description!').notEmpty(),
  body('project', 'Invalid project!').isMongoId(),
  body('priority').custom(isValidPriority),
];

export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) return next();

  const extractedErrors = errors.array().map(err => ({ [err.param]: err.msg }));

  return res.status(422).json({
    errors: extractedErrors,
  });
};

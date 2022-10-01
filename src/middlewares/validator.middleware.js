'use strict';

import { body, validationResult, param } from 'express-validator';

import {
  idExistInDB,
  isAlreadyRegistered,
  isEmailRegistered,
  isSameUserOrPartner,
  isSameUserOrPartnerTask,
  isValidPriority,
} from '../helpers/index.js';
import { checkLoginCredentials, checkToken } from './index.js';

export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json(errors);

  return next();
};

// Auth
export const emailPassRules = () => [
  body('email', 'Invalid email!').isEmail(),
  body('password', 'Password must be longer than 6 characters!').isLength({
    min: 6,
  }),
];

export const signUpRules = () => [
  body('name', 'Invalid name!').notEmpty(),
  ...emailPassRules(),
  validate,

  body('email').custom(email => isAlreadyRegistered(email, 'user')),
  validate,
];

export const loginRules = () => [
  ...emailPassRules(),
  validate,
  checkLoginCredentials,
];

// Users
export const genRecoveryTokenRules = () => [
  body('email', 'Invalid email!').isEmail(),
  validate,
];

export const genNewPasswordRules = () => [
  body('password', 'Password is required!').notEmpty(),
  validate,
  checkToken,
];

export const getUserByEmailRules = () => [
  body('email', 'Invalid email!').isEmail(),
  validate,

  body('email').custom(isEmailRegistered),
  validate,
];

// Projects
export const createProjectRules = () => [
  body('name', 'Invalid name!').notEmpty(),
  body('description', 'Invalid description!').notEmpty(),
  body('client', 'Invalid client!').notEmpty(),
  validate,
];

export const getProjectRules = () => [
  param('id', 'Invalid ID!').isMongoId(),
  validate,

  param('id').custom((id, { req }) => isSameUserOrPartner(id, 'project', req)),
  validate,
];

export const projectIdRules = () => [
  param('id', 'Invalid ID!').isMongoId(),
  validate,

  param('id').custom((id, { req }) => idExistInDB(id, 'project', req)),
  validate,
];

export const removePartnerRules = () => [
  param('id', 'Invalid ID!').isMongoId(),
  body('partnerId', 'Invalid ID!').isMongoId(),
  validate,

  param('id').custom((id, { req }) => idExistInDB(id, 'project', req)),
  validate,
];

// Tasks
export const createTaskRules = () => [
  body('name', 'Invalid name!').notEmpty(),
  body('description', 'Invalid description!').notEmpty(),
  body('project', 'Invalid project!').isMongoId(),
  body('priority').custom(isValidPriority),
  validate,

  body('project').custom((id, { req }) => idExistInDB(id, 'project', req)),
  validate,
];

export const taskIdRules = () => [
  param('id', 'Invalid ID!').isMongoId(),
  validate,

  param('id').custom((id, { req }) => idExistInDB(id, 'task', req)),
  validate,
];

export const updateTaskRules = () => [
  body('priority').custom(isValidPriority),
  validate,
  ...taskIdRules(),
];

export const toggleStateRules = () => [
  param('id', 'Invalid ID!').isMongoId(),
  validate,

  param('id').custom((id, { req }) => isSameUserOrPartnerTask(id, 'task', req)),
  validate,
];

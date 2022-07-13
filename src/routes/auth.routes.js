'use strict';

import { Router } from 'express';
import { check } from 'express-validator';

import { signUpValidationRules, validate } from '../middlewares';
import { isAlreadyRegistered } from '../helpers';
import { signUp } from '../controllers';

const router = Router();

router.route('/signup').post(
  signUpValidationRules(),
  validate,
  check('email').custom(email => isAlreadyRegistered(email, 'user')),
  validate,

  signUp
);

export default router;

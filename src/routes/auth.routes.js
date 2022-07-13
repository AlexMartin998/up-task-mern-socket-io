'use strict';

import { Router } from 'express';
import { check } from 'express-validator';

import {
  checkLoginCredentials,
  emailPassRules,
  signUpValidationRules,
  validate,
} from '../middlewares';
import { isAlreadyRegistered } from '../helpers';
import { signIn, signUp } from '../controllers';

const router = Router();

router.route('/signup').post(
  [
    signUpValidationRules(),
    validate,
    check('email').custom(email => isAlreadyRegistered(email, 'user')),
    validate,
  ],

  signUp
);

router
  .route('/login')
  .post(emailPassRules(), validate, checkLoginCredentials, signIn);

export default router;

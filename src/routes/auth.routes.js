'use strict';

import { Router } from 'express';
import { check } from 'express-validator';

import {
  checkLoginCredentials,
  checkToken,
  emailPassRules,
  signUpValidationRules,
  validate,
} from '../middlewares';
import { isAlreadyRegistered } from '../helpers';
import {
  confirmUser,
  generateRecoveryToken,
  genNewPassword,
  signIn,
  signUp,
  validateToken,
} from '../controllers';

const router = Router();

router.route('/signup').post(
  signUpValidationRules(),
  validate,
  check('email').custom(email => isAlreadyRegistered(email, 'user')),
  validate,

  signUp
);

router
  .route('/login')
  .post(emailPassRules(), validate, checkLoginCredentials, signIn);

router.route('/confirm/:token').get(checkToken, confirmUser);

router.route('/token-recovery').post(
  check('email', 'Invalid email!').isEmail(),
  validate,

  generateRecoveryToken
);

router.route('/password-recovery/:token')
  .get(checkToken, validateToken)
  .post(
    check('password', 'Password is required!').notEmpty(),
    validate,
    checkToken,

    genNewPassword
  );

export default router;

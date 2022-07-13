'use strict';

import { Router } from 'express';
import { check } from 'express-validator';

import { checkToken, protectWithJwt, validate } from '../middlewares';
import {
  confirmUser,
  generateRecoveryToken,
  genNewPassword,
  isAuthenticated,
  validateToken,
} from '../controllers';

const router = Router();

router.route('/confirm/:token').get(checkToken, confirmUser);

router.route('/token-recovery').post(
  [check('email', 'Invalid email!').isEmail(), validate],

  generateRecoveryToken
);

router
  .route('/password-recovery/:token')
  .get(checkToken, validateToken)
  .post(
    [
      check('password', 'Password is required!').notEmpty(),
      validate,
      checkToken,
    ],

    genNewPassword
  );

// Private
router.route('/profile').get(protectWithJwt, isAuthenticated);

export default router;

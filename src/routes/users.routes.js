'use strict';

import { Router } from 'express';

import {
  checkToken,
  genNewPasswordRules,
  genRecoveryTokenRules,
  getUserByEmailRules,
  protectWithJwt,
} from '../middlewares';
import {
  confirmUser,
  genNewPassword,
  genRecoveryToken,
  getUserByEmail,
  isAuthenticated,
  validateToken,
} from '../controllers';

const router = Router();

router.post('/', [protectWithJwt, ...getUserByEmailRules()], getUserByEmail);

router.get('/confirm/:token', checkToken, confirmUser);

router.post('/recovery-token', genRecoveryTokenRules(), genRecoveryToken);

router
  .route('/password-recovery/:token')
  .get(checkToken, validateToken)
  .post(genNewPasswordRules(), genNewPassword);

// Private
router.get('/profile', protectWithJwt, isAuthenticated);

export default router;

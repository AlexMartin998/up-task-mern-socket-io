'use strict';

import { Router } from 'express';
import { check } from 'express-validator';

import { validateInputs } from '../middlewares';
import { isAlreadyRegistered } from '../helpers';
import { signUp } from '../controllers';

const router = Router();

router.route('/signup').post(
  check('email', 'Invalid email!').isEmail(),
  check('name', 'Invalid name!').notEmpty(),
  check('password', 'Password must be longer than 6 characters!').isLength({
    min: 6,
  }),
  validateInputs,
  check('email').custom(email => isAlreadyRegistered(email, 'user')),
  validateInputs,

  signUp
);

export default router;

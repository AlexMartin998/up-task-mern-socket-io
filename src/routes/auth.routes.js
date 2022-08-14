'use strict';

import { Router } from 'express';

import { signIn, signUp } from '../controllers';
import { loginRules, signUpRules } from '../middlewares';

const router = Router();

router.post('/signup', signUpRules(), signUp);

router.post('/login', loginRules(), signIn);

export default router;

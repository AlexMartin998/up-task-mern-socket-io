'use strict';

import { Router } from 'express';

import { signIn, signUp } from '../controllers/index.js';
import { loginRules, signUpRules } from '../middlewares/index.js';

const router = Router();

router.post('/signup', signUpRules(), signUp);

router.post('/login', loginRules(), signIn);

export default router;

'use strict';

import { Router } from 'express';
import { check } from 'express-validator';

import { createTaskRules, protectWithJwt, validate } from '../middlewares';
import { idExistInDB } from '../helpers';
import { createTask } from '../controllers';

const router = Router();

router.use(protectWithJwt);

router.route('/').post(
  [
    createTaskRules(),
    validate,
    check('project').custom((id, { req }) => idExistInDB(id, 'project', req)),
    validate,
  ],

  createTask
);

export default router;

'use strict';

import { Router } from 'express';
import { check } from 'express-validator';

import { createTaskRules, protectWithJwt, validate } from '../middlewares';
import { idExistInDB } from '../helpers';
import { createTask, getTask } from '../controllers';

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

router.route('/:id').get(
  [
    check('id', 'Invalid ID!').isMongoId(),
    validate,
    check('id').custom((id, { req }) => idExistInDB(id, 'task', req)),
    validate,
  ],

  getTask
);

export default router;

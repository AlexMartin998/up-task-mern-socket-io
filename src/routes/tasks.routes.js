'use strict';

import { Router } from 'express';

import {
  createTaskRules,
  protectWithJwt,
  taskIdRules,
  toggleStateRules,
  updateTaskRules,
} from '../middlewares/index.js';
import {
  createTask,
  deleteTask,
  getTask,
  toggleState,
  updateTask,
} from '../controllers/index.js';

const router = Router();

router.use(protectWithJwt);

router.post('/', createTaskRules(), createTask);

router
  .route('/:id')
  .get(taskIdRules(), getTask)
  .put(updateTaskRules(), updateTask)
  .delete(taskIdRules(), deleteTask);

router.patch('/state/:id', toggleStateRules(), toggleState);

export default router;

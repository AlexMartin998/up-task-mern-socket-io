'use strict';

import { Router } from 'express';

import { createProjectRules, protectWithJwt, validate } from '../middlewares';
import {
  addCollaborator,
  createProject,
  deleteProject,
  getProject,
  getProjects,
  getTask,
  removeCollaborator,
  updateProject,
} from '../controllers';

const router = Router();

// All routes will be protected
router.use(protectWithJwt);

router
  .route('/')
  .post([createProjectRules(), validate], createProject)
  .get(getProjects);

router.route('/:id').get(getProject).put(updateProject).delete(deleteProject);

router.route('/task/:id').get(getTask);

router.route('/add-collaborator/:id').post(addCollaborator);

router.route('/remove-collaborator/:id').post(removeCollaborator);

export default router;

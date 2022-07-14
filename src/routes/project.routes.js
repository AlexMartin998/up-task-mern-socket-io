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
import { check } from 'express-validator';
import { idExistInDB } from '../helpers';

const router = Router();

// All routes will be protected
router.use(protectWithJwt);

router
  .route('/')
  .post([createProjectRules(), validate], createProject)
  .get(getProjects);

router
  .route('/:id')
  .get(
    [
      check('id', 'Invalid ID!').isMongoId(),
      validate,
      check('id').custom((id, { req }) => idExistInDB(id, 'project', req)),
      validate,
    ],

    getProject
  )
  .put(
    [
      check('id', 'Invalid ID!').isMongoId(),
      validate,
      check('id').custom((id, { req }) => idExistInDB(id, 'project', req)),
      validate,
    ],

    updateProject
  )
  .delete(deleteProject);

router.route('/task/:id').get(getTask);

router.route('/add-collaborator/:id').post(addCollaborator);

router.route('/remove-collaborator/:id').post(removeCollaborator);

export default router;

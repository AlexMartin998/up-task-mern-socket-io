'use strict';

import { Router } from 'express';

import {
  createProjectRules,
  getProjectRules,
  projectIdRules,
  protectWithJwt,
  removePartnerRules,
} from '../middlewares/index.js';
import {
  addCollaborator,
  createProject,
  deleteProject,
  getProject,
  getProjects,
  removeCollaborator,
  updateProject,
} from '../controllers/index.js';

const router = Router();

// All routes will be protected
router.use(protectWithJwt);

router.route('/').post(createProjectRules(), createProject).get(getProjects);

router
  .route('/:id')
  .get(getProjectRules(), getProject)
  .put(projectIdRules(), updateProject)
  .delete(projectIdRules(), deleteProject);

router
  .route('/collaborator/:id')
  .post(projectIdRules(), addCollaborator)
  .put(removePartnerRules(), removeCollaborator);

export default router;

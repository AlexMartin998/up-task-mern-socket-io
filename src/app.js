'use strict';

import express from 'express';

import './db/db.js';
import { notFoundMiddleware, setupMiddlewares } from './middlewares/index.js';
import {
  authRoutes,
  projectsRoutes,
  tasksRoutes,
  usersRoutes,
} from './routes/index.js';

// Initializations:
const app = express();

// Middlewares
setupMiddlewares(app);

// Routes
app.use('/auth', authRoutes);
app.use('/users', usersRoutes);
app.use('/projects', projectsRoutes);
app.use('/tasks', tasksRoutes);

app.use(notFoundMiddleware);

export default app;

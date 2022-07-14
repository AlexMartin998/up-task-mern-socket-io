'use strict';

import express from 'express';

import './db/db';
import { setupMiddlewares } from './middlewares/setup.middleware';
import { authRoutes, projectRoutes, userRoutes } from './routes';

// Initializations:
const app = express();

// Middlewares
setupMiddlewares(app);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/project', projectRoutes);

export default app;

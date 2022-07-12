'use strict';

import express from 'express';

import './db/db';
import { setupMiddlewares } from './middlewares/setup.middleware';
import { authRoutes } from './routes';

// Initializations:
const app = express();

// Middlewares
setupMiddlewares(app);

// Routes
app.use('/api/auth/', authRoutes);

export default app;

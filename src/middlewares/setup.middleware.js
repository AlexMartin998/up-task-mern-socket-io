'use strict';

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';

export const setupMiddlewares = app => {
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  // app.use(express.static(path.join(__dirname, './../public')));
  app.use(compression()).use(helmet());
  app.use(morgan('dev'));

  // Other middlewares
};

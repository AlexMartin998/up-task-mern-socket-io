'use strict';

import jwt from 'jsonwebtoken';

import { SECRETORKEY_JWT } from '../config/index.js';

export const genJWT = id =>
  jwt.sign({ id }, SECRETORKEY_JWT, { expiresIn: '24h' });

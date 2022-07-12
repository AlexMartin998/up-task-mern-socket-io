'use strict';
console.clear();

import app from './app';
import { PORT } from './config';

export const server = app.listen(PORT, () => {
  console.log('Server is running on port', PORT);
});

import { logEvent } from './logEvent.js';

export const errorHandeler = (error, req, res, next) => {
  logEvent(`${error.name}: ${error.message}`);
  // console.error(error.stack);
  res.status(500).json({ error: error.message });
};

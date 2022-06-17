import { format } from 'date-fns';
import { v4 as uuid_v4 } from 'uuid';
import { logEvent, logger } from './util/logEvent.js';
import { errorHandeler } from './util/errorHandeler.js';

import { EventEmitter } from 'events';
import express from 'express';
import cors from 'cors';
import path from 'path';

class MyEmitter extends EventEmitter {}

// Initalize object
const myEmitter = new MyEmitter();

// add listener for the log event
myEmitter.on('log', (message) => logEvent(message));

// emit the event

// setTimeout(() => {
//   myEmitter.emit('log', 'Log event emitted');
// }, 2000);

const app = express();
const PORT = process.env.PORT || 3500;

// third party middleware cors
const whitelist = [
  'https://thedevsaroj.com',
  'https://www.google.com',
  'http://127.0.0.1',
  'http://localhost:3000',
];
const corsOptions = {
  origin: (origin, callback) => {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  optionsSuccessStatus: 200,
};
// filter the whitelist domain
app.use(cors(corsOptions));

// custome middleware logger
app.use(logger);

// built in middleware for json
app.use(express.json());

app.get('/', (req, res) => {
  res.status(200);
  if (req.accepts('html')) {
    res.sendFile(path.join(path.resolve(), 'views', 'health.html'));
  } else {
    res.json({ message: 'Health check done' });
  }
});

// handel 404
app.all('*', (req, res) => {
  res.status(404);
  if (req.accepts('html')) {
    res.sendFile(path.join(path.resolve(), 'views', '404.html'));
  } else if (req.accepts('json')) {
    res.json({ error: '404 Not found' });
  } else {
    res.type('text').send('404 Not Found');
  }
});

// error handeler
app.use(errorHandeler);

app.listen(PORT, () => console.log(`Server is running under port ${PORT}`));

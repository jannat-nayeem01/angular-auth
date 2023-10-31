import express from 'express';
import session from 'express-session';

const app = express();

app.use(express.json());
app.use(require('cookie-parser')()); // Add cookie parser middleware

// Enable CORS
import cors from 'cors';
app.use(cors());

// Enable CSRF tokens using the double submit cookie pattern for CSRF protection
import csurf from 'csurf';
const csrfFilter = csurf({ cookie: { sameSite: true } });
app.use(csrfFilter);



//root route
app.get('/', (req, res) => {
  res.send('App is Running!');
});


app.all('*', (req, res, next) => {
  const token = req.csrfToken();
  res.cookie('XSRF-TOKEN', token, { sameSite: true });
  return next();
});

app.use(function (err, req, res, next) {
  if (err.code !== 'EBADCSRFTOKEN') return next(err);
  console.log('CSRF error accessing', req.url);
  res.status(403).send('Error: Invalid or missing CSRF token');
});

// Connect to Mongo
const config = {
  dbUrl: 'mongodb+srv://st124438:Japan01@cluster0.wwgr6yd.mongodb.net/qouteboard-development',
  listenPort: 3333,
};

import mongoose from 'mongoose';
console.log('Attempting to connect to MongoDB...');
mongoose.connect(config.dbUrl, {})
  .then(() => {
    console.log('Mongo connection successful.');
  })
  .catch((err) => {
    console.log('Mongo connection failed. Reason:');
    console.log(err);
  });

// Load user controller
import { userController } from './controllers/user-controller';
app.use(userController);

// Log invalid incoming URLs
app.use((req, res, next) => {
  if (!req.route) {
    console.log('Invalid request for URL ' + req.url);
  }
  next();
});

// Start server
console.log('Listening on port ' + config.listenPort);
app.listen(config.listenPort);

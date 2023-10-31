// Load Express
import express from 'express';
import session from 'express-session'
const app = express();
// Turn on parsing of incoming JSON
app.use(express.json());
// Enable CORS
import cors from 'cors';
app.use(cors());


// Enable CSRF tokens using the double submit cookie pattern for CSRF protection
import csurf from 'csurf';
const csrfFilter = csurf({ cookie: { sameSite: true } });
app.use(csrfFilter);
app.all("*", (req, res, next) => {
const csrfReq = req as { csrfToken?(): string };
const token = csrfReq.csrfToken();
res.cookie("XSRF-TOKEN", token, { sameSite: true });
return next();
});
app.use(function (err, req, res, next) {
if (err.code !== 'EBADCSRFTOKEN') return next(err);
console.log('CSRF error accessing', req.url);
res.status(403);
res.send('Error: invalid CSRF token');
});


// Connect to Mongo
const config = {
    dbUrl: 'mongodb://localhost/quoteboard-development',
    listenPort: 3333
    };

    import mongoose from 'mongoose';
console.log('Attempting to connect to MongoDB...');
mongoose.connect(config.dbUrl, { })
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
app.use((req: any, res, next) => {
if (!req.route) {
console.log('Invalid request for URL ' + req.url);
}
next();
});


// Start server
console.log('Listening on port ' + config.listenPort);
app.listen(config.listenPort);
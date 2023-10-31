"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(require('cookie-parser')()); // Add cookie parser middleware
// Enable CORS
const cors_1 = __importDefault(require("cors"));
app.use((0, cors_1.default)());
// Enable CSRF tokens using the double submit cookie pattern for CSRF protection
const csurf_1 = __importDefault(require("csurf"));
const csrfFilter = (0, csurf_1.default)({ cookie: { sameSite: true } });
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
    if (err.code !== 'EBADCSRFTOKEN')
        return next(err);
    console.log('CSRF error accessing', req.url);
    res.status(403).send('Error: Invalid or missing CSRF token');
});
// Connect to Mongo
const config = {
    dbUrl: 'mongodb+srv://st124438:Japan01@cluster0.wwgr6yd.mongodb.net/qouteboard-development',
    listenPort: 3333,
};
const mongoose_1 = __importDefault(require("mongoose"));
console.log('Attempting to connect to MongoDB...');
mongoose_1.default.connect(config.dbUrl, {})
    .then(() => {
    console.log('Mongo connection successful.');
})
    .catch((err) => {
    console.log('Mongo connection failed. Reason:');
    console.log(err);
});
// Load user controller
const user_controller_1 = require("./controllers/user-controller");
app.use(user_controller_1.userController);
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
//# sourceMappingURL=server.js.map
const createError = require('http-errors');
const config = require('./config');
const express = require('express');
const cors = require("cors");
const logger = require('morgan');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const path = require('path');
const jwtDecode = require("jwt-decode");
const jwt = require("express-jwt");
const zip = require('express-easy-zip');

const csrf = require("csurf");
const csrfProtection = csrf({
  cookie: true,
});

//Routers
const indexRouter = require('./routes/index');
const uploadRouter = require('./routes/upload');
const registerRouter = require('./routes/register');
const loginRouter = require('./routes/login');
const logoutRouter = require('./routes/logout');

const app = express();

//DB Config
mongoose.Promise = global.Promise;
mongoose.connect(config.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
});

app.use(cors());
app.use(logger('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
app.use(zip());


// if(process.env.NODE_ENV === 'production'){
    app.use(express.static(path.join(__dirname, '../client/build')));
// }

// ROUTES
app.use('/api/login', loginRouter);
app.use('/api/register', registerRouter);
app.use('/api/logout', logoutRouter);


const attachUser = (req, res, next) => {
    const token = req.cookies.accessToken;
    if (!token)
    return res.status(401).json({ message: "Authentication invalid" });
    
    const decodedToken = jwtDecode(token);
    if (!decodedToken)
    return res
    .status(401)
    .json({ message: "There was a problem authorizing the request" });
    
    req.user = decodedToken;
    next();
};

const checkJwt = jwt({
    secret: config.ACCESS_TOKEN_SECRET,
    issuer: "api.reactFileManager",
    audience: "api.reactFileManager",
    algorithms: ["HS256"],
    getToken: (req) => req.cookies.accessToken,
});

app.use(csrfProtection);
app.get("/api/csrf-token", (req, res) => {
    res.json({ csrfToken: req.csrfToken() });
});



// app.use(attachUser);

app.use('/api', attachUser, checkJwt, indexRouter);
app.use('/api/upload', attachUser, checkJwt, uploadRouter);
app.use(
  "/uploads",
  attachUser,
  checkJwt,
  express.static(path.join(__dirname, "uploads"))
);

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname + './../client/build/index.html'));
});

// CSRF error handler
app.use(function (err, req, res, next) {
  if (err.code !== 'EBADCSRFTOKEN') return next(err)
 
  // handle CSRF token errors here
  res.status(403)
  res.send("You can't Hack this you fool!")
})

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;

    const errors = {
        status: err.status,
        stack: err.stack
    };

    res.locals.error = req.app.get('env') === 'development' ? errors : {};

    // render the error page
    res.status(err.status || 500);
    res.send('Server Error');
});


module.exports = app;
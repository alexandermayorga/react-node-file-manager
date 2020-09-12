const createError = require('http-errors');
const config = require('./config');
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const zip = require('express-easy-zip');

const indexRouter = require('./routes/index');
const uploadRouter = require('./routes/upload');
const registerRouter = require('./routes/register');
const loginRouter = require('./routes/login');
const logoutRouter = require('./routes/logout');
const authenticateRouter = require('./routes/authenticate');


const app = express();

//DB Config
mongoose.Promise = global.Promise;
mongoose.connect(config.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
});

app.use(logger('dev'));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use('/uploads',express.static(path.join(__dirname, 'uploads')));
app.use(zip());

// if(process.env.NODE_ENV === 'production'){
    app.use(express.static(path.join(__dirname, '../client/build')));
// }

//Middleware
const { auth } = require('./middleware/auth');

// ROUTES
app.use('/api', indexRouter);
app.use('/api/upload', uploadRouter);
app.use('/api/logout', auth, logoutRouter);
app.use('/api/login', auth, loginRouter);
app.use('/api/authenticate', auth, authenticateRouter);
app.use('/api/register', auth, registerRouter);


// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + '../client/build/index.html'));
});

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
    res.send('error');
});


module.exports = app;
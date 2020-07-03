const createError = require('http-errors');
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const logger = require('morgan');
const zip = require('express-easy-zip');

const indexRouter = require('./routes/index');

const app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use('/uploads',express.static(path.join(__dirname, 'uploads')));
app.use(zip());

// if(process.env.NODE_ENV === 'production'){
    app.use(express.static(path.join(__dirname, '../client/build')));
// }


// ROUTES
app.use('/api', indexRouter);

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
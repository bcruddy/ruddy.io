'use strict';

const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const busboy = require('connect-busboy');
const hbs = require('express-hbs');
const helmet = require('helmet');

const rootController = require('./controllers/root');

const app = express();

app.use(helmet());

// view engine setup
app.engine('hbs', hbs.express4({
    defaultLayout: path.join(__dirname, 'views/shared/_layout.hbs'),
    partialsDir: path.join(__dirname, 'views/shared')
}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));


// uncomment after placing your favicon in /assets
//app.use(favicon(path.join(__dirname, 'assets', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// file upload handling middleware
app.use(busboy());

app.use(express.static(path.join(__dirname, 'assets')));
app.use('/uploads', express.static(path.join(__dirname, 'temp-uploads')));

app.use('/', rootController);

// catch 404 and forward to error handler
app.use((req, res, next) => {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use((err, req, res, next) => {
        let view = err.status === 404 ? 'shared/404' : 'shared/error';
        res.status(err.status || 500);
        res.render(view, {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use((err, req, res, next) => {
    let view = err.status === 404 ? 'shared/404' : 'shared/error';
    res.status(err.status || 500);
    res.render(view, {
        message: err.message,
        error: {}
    });
});


module.exports = app;

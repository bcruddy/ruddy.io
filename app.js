const express = require('express'),
    hbs = require('express-hbs'),
    helmet = require('helmet'),
    path = require('path'),
    blogController = require('./controllers/blog'),
    rootController = require('./controllers/root'),
    app = express();

app
.use(helmet())
.engine('hbs', hbs.express4({
    defaultLayout: path.join(__dirname, 'views/shared/_layout.hbs'),
    partialsDir: path.join(__dirname, 'views/shared')
}))
.set('view engine', 'hbs')
.set('views', path.join(__dirname, 'views'))
.use(express.static(path.join(__dirname, 'assets')))
.use('/blog', blogController)
.use('/', rootController)

.use((req, res, next) => {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use((err, req, res, next) => {
        res.status(err.status || 500);

        let view = err.status === 404 ? 'shared/404' : 'shared/error';
        res.render(view, {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use((err, req, res) => {
    let view = err.status === 404 ? 'shared/404' : 'shared/error';
    res.status(err.status || 500);
    res.render(view, {
        message: err.message,
        error: {}
    });
});


module.exports = app;

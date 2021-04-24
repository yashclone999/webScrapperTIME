var createError = require('http-errors');
var express = require('express');
var bodyParser = require('body-parser');
var logger = require('morgan');
var NewsRouter = require('./router');
var app = express();

const redirectUnmatched = (req, res) => {
    res.redirect("http://localhost:3000/getTimeStories/");
}

app.set('view engine', 'jade');
app.use(bodyParser.json());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/getTimeStories', NewsRouter);
app.use(redirectUnmatched); 

app.use(function (req, res, next) {
    next(createError(404));
});

app.use(function (err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;

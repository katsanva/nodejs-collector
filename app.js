var createError = require('http-errors');
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var logger = require('morgan');
const initServices = require('./services');

var collectionRouter = require('./routes/collect');

var app = express();
const services = initServices();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());

app.use('/collect', collectionRouter(services));

app.use(function (req, res, next) {
  next(createError(404));
});

app.use(function (err, req, res) {
  res.status(err.status || 500);
  res.end();
});

module.exports = app;

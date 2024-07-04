var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/users', usersRouter);

// get index page
// const indexRouter = require('./routes/index')(db);
// app.use('/', indexRouter);


const bodyParser = require('body-parser');

const mysql = require('mysql2');

const db = mysql.createConnection ({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'snake_ladder_journey',
});

db.connect((err) => {
  if (err) {
    console.error('Database connection failed: ', error);
  } else {
    console.log('Connected to the database');
  }
});

const indexRouters = require('./routes/index')(db);
app.use('/', indexRouters)

const addRouters = require('./routes/add')(db);
app.use('/', addRouters);

/* GET login page. */
app.get('/login', (req, res) => {
  res.render('login', { title: 'LOGIN' });
});

/* GET registration page. */
app.get('/registration', (req, res) => {
  res.render('registration', { title: 'REGISTRATION' });
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

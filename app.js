var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

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

const session = require('express-session');

// Session config
app.use(session({
  secret: 'snake_ladder_journey',
  resave: true,
  saveUninitialized: true
}));

// Middleware to set cache control headers
app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-store');
  next();
})

//  checks if a user is logged in by checking the loggedin property of the session object
function checkLoggedIn(req, res, next) {
  if (req.session.loggedin) { 
    next(); 
  } else { 
    req.session.error = 'Please Login!'; 
    res.redirect('/login'); 
  } 
}  

const loginRoutes = require('./routes/login')(db);
app.use('/', loginRoutes)

const indexRouters = require('./routes/index')(db, checkLoggedIn);
app.use('/', indexRouters)

const addRouters = require('./routes/registration')(db);
app.use('/', addRouters);

const registrationRoutes = require('./routes/registration');
app.use('/registration', registrationRoutes);

const questionsRoutes = require('./routes/questions')(db);
app.use('/', questionsRoutes);

app.use(function(req, res, next) {
  req.db = db;
  next();
})

/* GET login page. */
app.get('/login', (req, res) => {
  res.render('login', { title: 'LOGIN' });
});

// Get handbook page
app.get('/handbook', (req, res) => {
  res.render('handbook', { title: 'USER MANUAL BOOK' });
});

// Get qrscanner page
app.get('/qrscanner', (req, res) => {
  res.render('qrscanner', { title: 'QR SCANNER' });
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

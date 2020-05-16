const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const bodyParser = require('body-parser');
const rateLimit = require("express-rate-limit");

const TWO_HOURS = 1000 * 60 * 60 * 2;

const {
  SESS_LIFETIME = TWO_HOURS,
  SESS_NAME = 'sid',
  SESS_SECRET = 'ssh!se#ssion:sec#ret',
  NODE_ENV = 'development'
} = process.env;

const IN_PROD = NODE_ENV === 'production';

// app.set('trust proxy', 1);
 
const limiter = rateLimit({
  windowMs: 2 * 60 * 1000, // 2 minutes
  max: 10000
});

const indexRouter = require('./routes/index');
const adminRouter = require('./routes/admin');

const app = express();

app.use(session({
  name: SESS_NAME,
  resave: false,
  saveUninitialized: false,
  secret: SESS_SECRET,
  cookie: {
    maxAge: SESS_LIFETIME,
    sameSite: true,
    secure: IN_PROD,
  }
}));

app.use(logger('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(limiter);
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/admin/', adminRouter);

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

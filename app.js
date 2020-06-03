require('dotenv').config();

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const bodyParser = require('body-parser');
const rateLimit = require("express-rate-limit");
const Redis = require('ioredis');
const RedisStore = require('connect-redis')(session);
const { REDIS_OPTIONS, SESSION_OPTIONS, APP_PORT } = require('./config');

const client = new Redis(REDIS_OPTIONS);

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//app.set('trust proxy', 1);

app.use(
  session({
    ...SESSION_OPTIONS,
    store : new RedisStore({ client })
  })
);

const limiter = rateLimit({
  windowMs: 2 * 60 * 1000,
  max: 10000
});

const indexRouter = require('./routes/index');
const adminRouter = require('./routes/admin');
const editorRouter = require('./routes/editor');

app.use(logger('dev'));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(limiter);
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'dist')));

app.use('/', indexRouter);
app.use('/admin/', adminRouter);
app.use('/editeur/', editorRouter);

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

app.listen(APP_PORT, () => console.log(`http://localhost:${APP_PORT}`));

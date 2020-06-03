const config = {};

// app
config.NODE_ENV = process.env.NODE_ENV || 'development';
config.APP_PORT = process.env.APP_PORT || 3000;
config.IN_PROD = config.NODE_ENV === 'production';

// cache
config.REDIS_PORT = process.env.REDIS_PORT || 6379;
config.REDIS_HOST = process.env.REDIS_HOST || 'localhost';
config.REDIS_PASSWORD = process.env.REDIS_PASSWORD || 'secret';

config.REDIS_OPTIONS = {
  port: parseInt(config.REDIS_PORT, 10),
  host: config.REDIS_HOST,
  password: config.REDIS_PASSWORD
};

// session
const ONE_HOUR = 1000 * 60 * 60;
const THIRTY_MINUTES = ONE_HOUR/2;

config.SESSION_SECRET = process.env.SESSION_SECRET || 'secret';
config.SESSION_NAME = process.env.SESSION_NAME || 'sid';
config.SESSION_IDLE_TIMEOUT = process.env.SESSION_IDLE_TIMEOUT || THIRTY_MINUTES;

config.SESSION_OPTIONS = {
  secret: config.SESSION_SECRET,
  name: config.SESSION_NAME,
  cookie: {
    maxAge: parseInt(config.SESSION_IDLE_TIMEOUT, 10),
    secure: config.IN_PROD,
    sameSite: true
  },
  rolling: true,
  resave: false,
  saveUninitialized: false
};

// db
config.DATABASE_URL = process.env.DATABASE_URL;

module.exports = config;

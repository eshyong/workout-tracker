'use strict';

// Third party packages
var bodyParser = require('body-parser'),
  express = require('express'),
  morgan = require('morgan'),
  nodemailer = require('nodemailer'),
  redis = require('redis'),
  session = require('express-session'),
  RedisStore = require('connect-redis')(session),
  app = express();

// Local packages
var db = require('./server/db'),
  database = db.connect();

// Use nodemailer for support emails
var emailer = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USERNAME,
    pass: process.env.GMAIL_PW
  }
});

// Test gmail connection
emailer.verify(function(err, success) {
  if (err) {
    throw err;
  }
  console.log('Connected to gmail');
});

// API endpoints
var userApi = require('./server/api/users')(database, emailer);
var workoutApi = require('./server/api/workouts')(database);

var sendFileOpts = {
  root: __dirname + '/public/views'
};

// Middleware setup
// Static files
app.use(express.static('./public'));

// Parse HTTP body as JSON
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

// Request logging
app.use(morgan('combined'));

// Use redis for client sessions
var redisClient = redis.createClient({
  host: '127.0.0.1',
  port: 6379,
  password: process.env.REDIS_PW
});

redisClient.on('error', function(err) {
  throw err;
});

redisClient.on('ready', function() {
  console.log('Connected to redis');
});

// Client login sessions
app.use(session({
  store: new RedisStore({
    client: redisClient
  }),
  secret: process.env.COOKIE_SECRET,
  resave: false,
  saveUninitialized: true,
  unset: 'destroy'
}));

// Check for authentication on all pages, except for login pages and
// user authentication endpoints
app.use(function(req, res, next) {
  if (!req.session.userInfo &&
    req.path !== '/login' && req.path !== '/forgot' &&
    req.path !== '/api/users/register' && req.path !== '/api/users/login' &&
    req.path !== '/api/users/forgot' && req.path !== '/api/users/send-username-reminder' &&
    req.path !== '/api/users/reset-user-password'
  ) {
    // Redirect user to login page
    res.redirect('/login');
  } else {
    // Authed
    next();
  }
});

// Pages
app.get('/', function(req, res) {
  res.sendFile('index.html', sendFileOpts);
});

app.get('/stats', function(req, res) {
  res.sendFile('stats.html', sendFileOpts);
});

app.get('/login', function(req, res) {
  if (req.session.userInfo) {
    // Redirect to home page if already authenticated
    res.redirect('/');
  } else {
    res.sendFile('login.html', sendFileOpts);
  }
});

app.get('/profile', function(req, res) {
  res.sendFile('profile.html', sendFileOpts);
});

app.get('/forgot', function(req, res) {
  res.sendFile('forgot.html', sendFileOpts);
});

app.get('/logout', function(req, res) {
  if (req.session.userInfo) {
    // Destroy user session on logout
    req.session.destroy(function(err) {
      if (err) {
        console.log('Unable to destroy session: ', err);
      }
    });
  }
  res.redirect('/login');
});

// Mount API routers at /api
app.use('/api/users', userApi);
app.use('/api/workouts', workoutApi);

if (process.env.NODE_ENV === 'development') {
  app.listen(8080, '0.0.0.0');
  console.log('Listening on http://0.0.0.0:8080');
}

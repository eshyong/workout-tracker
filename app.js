'use strict';

// Node stdlib packages
const fs = require('fs');

// Third party packages
const bodyParser = require('body-parser');
const express = require('express');
const morgan = require('morgan');
const mysql = require('mysql');
const nodemailer = require('nodemailer');
const redis = require('redis');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const app = express();

// Internal dependencies
const dbUtils = require('./server/dbUtils');

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

// Create connection pool to database
var pool;
const maxConnections = 100;
if (process.env.NODE_ENV === 'development') {
  pool = mysql.createPool({
    connectionLimit: maxConnections,
    host: 'localhost',
    user: 'workout_tracker',
    password: process.env.MYSQL_WORKOUT_TRACKER_PW,
    database: 'workouts'
  });
} else if (process.env.NODE_ENV === 'production') {
  pool = mysql.createPool({
    connectionLimit: maxConnections,
    host: process.env.AWS_MYSQL_INSTANCE_HOSTNAME,
    user: 'workout_tracker',
    password: process.env.MYSQL_WORKOUT_TRACKER_PW,
    database: 'workouts'
  });
} else {
  throw new Error(`Unknown NODE_ENV: ${process.env.NODE_ENV}`);
}
console.log('Created MySQL connection pool');

// API endpoints
var userApi = require('./server/api/users')(pool, emailer);
var workoutApi = require('./server/api/workouts')(pool);

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
var requestLogStream = fs.createWriteStream(__dirname + '/requests.log', {flags: 'a'});
app.use(morgan('combined', {stream: requestLogStream}));

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

// Error pages
app.get('/503', function(req, res) {
  res.sendFile('503.html', sendFileOpts);
});

// Check for authentication on all pages, except for login pages and
// user authentication endpoints
const whitelist = [
  '/login',
  '/forgot',
  '/api/users/register',
  '/api/users/login',
  '/api/users/forgot',
  '/api/users/send-username-reminder',
  '/api/users/reset-user-password',
  '/503',
];
app.use(function(req, res, next) {
  // If session info is not set and the request path is not in whitelist, redirect user
  if (!req.session.userInfo && whitelist.indexOf(req.path) === -1) {
    // Redirect user to login page
    res.redirect('/login');
  } else {
    // Authed
    next();
  }
});

// Regular pages
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

// Could not find page
app.use(function(req, res) {
  res.status(404).sendFile('/404.html', sendFileOpts);
});

module.exports = app;

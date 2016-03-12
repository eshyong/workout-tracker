'use strict';

var bodyParser = require('body-parser');
var express = require('express');
var hbs = require('hbs');
var mysql = require('mysql');
var app = express();

// Views setup
app.set('views', './views');
app.set('view engine', 'hbs');

// Middleware setup
app.use(express.static('./public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Database setup
// For local development only
// TODO: create module for models/db connections
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'workout_tracker',
  password: 'abc123',
  database: 'workouts'
});

connection.connect((err) => {
  if (err) {
    console.log('Error connecting to db: ' + err.stack);
    return;
  }
  console.log('Connected with ID ' + connection.threadId);
});

function addWorkout(db, workout, res) {
  // TODO: If workout for a certain date already exists, update it instead of inserting.
  var queryStatement = 'INSERT INTO workouts SET ?;';
  db.query(queryStatement, workout, (err, result) => {
    if (err) {
      console.log('Encountered db err: ' + err.message);
      res.json({
        'status': 'failure',
        'message': err.message
      });
      return;
    }
    console.log('Successfully added workout.');
    res.json({'status': 'success'});
  });
}

app.get('/', (req, res) => {
  console.log('Request for index page');
  res.render('index');
});

app.get('/enter-workout', (req, res) => {
  console.log('Request for enter-workout page');
  res.render('enter-workout');
});

app.post('/enter-workout', (req, res) => {
  console.log('Post from enter-workout page');
  addWorkout(connection, req.body, res);
});

app.get('/workouts', (req, res) => {
  console.log('Request for workouts page');
  res.render('workouts');
});

app.listen(8080, '127.0.0.1');
console.log('Listening on http://127.0.0.1:8080');

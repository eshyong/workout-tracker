'use strict';

// Third party packages
var bodyParser = require('body-parser'),
  express = require('express'),
  app = express();

// Local packages
var db = require('./db'),
  workouts = require('./workouts'),
  conn = db.connect();

var sendFileOpts = {
  root: __dirname + '/public/views'
};

// Middleware setup
app.use(express.static('./public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

// Pages
app.get('/', function(req, res) {
  res.sendFile('index.html', sendFileOpts);
});

// API endpoints
app.get('/api/get-workouts', function(req, res) {
  workouts.getWorkouts(conn, res);
});

app.post('/api/submit-workout', function(req, res) {
  workouts.submitWorkout(conn, req.body, res);
});

app.post('/api/update-workout', function(req, res) {
  workouts.updateWorkout(conn, req.body, res);
});

app.post('/api/delete-workout', function(req, res) {
  workouts.deleteWorkout(conn, req.body, res);
});

if (process.env.NODE_ENV === 'development') {
  app.listen(8080, '0.0.0.0');
  console.log('Listening on http://0.0.0.0:8080');
}

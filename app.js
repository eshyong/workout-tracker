'use strict';

// Third party packages
let bodyParser = require('body-parser'),
  express = require('express'),
  app = express();

// Local packages
let db = require('./db'),
  workouts = require('./workouts'),
  conn = db.connect();

let sendFileOpts = {
  root: __dirname + '/public/views'
}

// Middleware setup
app.use(express.static('./public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

// Pages
app.get('/', (req, res) => {
  res.sendFile('index.html', sendFileOpts);
});

app.get('/enter-workout', (req, res) => {
  res.sendFile('enter-workout.html', sendFileOpts);
});

app.get('/view-workouts', (req, res) => {
  res.sendFile('view-workouts.html', sendFileOpts);
});

// API endpoints
app.get('/api/get-workouts', (req, res) => {
  workouts.getWorkouts(conn, res);
});

app.post('/api/submit-workout', (req, res) => {
  workouts.submitWorkout(conn, req.body, res);
});

app.post('/api/update-workout', (req, res) => {
  workouts.updateWorkout(conn, req.body, res);
});

app.post('/api/delete-workout', (req, res) => {
  workouts.deleteWorkout(conn, req.body, res);
});

app.listen(8080, '127.0.0.1');
console.log('Listening on http://127.0.0.1:8080');

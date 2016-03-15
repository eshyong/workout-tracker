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

app.get('/', (req, res) => {
  console.log('Request for index page');
  res.sendFile('index.html', sendFileOpts);
});

app.get('/enter-workout', (req, res) => {
  console.log('Request for enter-workout page');
  res.sendFile('enter-workout.html', sendFileOpts);
});

app.post('/submit-workout', (req, res) => {
  console.log('User submitted workout');
  workouts.submitWorkout(conn, req.body, res);
});

app.get('/view-workouts', (req, res) => {
  console.log('Request for view-workouts page');
  res.sendFile('view-workouts.html', sendFileOpts);
});

app.get('/get-workouts', (req, res) => {
  console.log('User requested workouts');
  workouts.getWorkouts(conn, res);
});

app.post('/delete-workout', (req, res) => {
  console.log('User wants to delete workout');
  workouts.deleteWorkout(conn, req.body, res);
});

app.listen(8080, '127.0.0.1');
console.log('Listening on http://127.0.0.1:8080');

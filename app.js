'use strict';

// Third party packages
var bodyParser = require('body-parser'),
    express = require('express'),
    hbs = require('hbs'),
    app = express();

// Local packages
var db = require('./db'),
    workouts = require('./workouts'),
    conn = db.conn;

// Views setup
app.set('views', './views');
app.set('view engine', 'hbs');

// Middleware setup
app.use(express.static('./public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', (req, res) => {
  console.log('Request for index page');
  res.render('index');
});

app.get('/enter-workout', (req, res) => {
  console.log('Request for enter-workout page');
  res.render('enter-workout');
});

app.post('/submit-workout', (req, res) => {
  console.log('Post for submit-workout page');
  workouts.submitWorkout(conn, req.body, res);
});

app.get('/workouts', (req, res) => {
  console.log('Request for workouts page');
  res.render('workouts');
});

app.listen(8080, '127.0.0.1');
console.log('Listening on http://127.0.0.1:8080');

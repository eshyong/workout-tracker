'use strict';

var bodyParser = require('body-parser');
var express = require('express');
var hbs = require('hbs');
var app = express();

// Views setup
app.set('views', './views');
app.set('view engine', 'hbs');

// Middleware setup
app.use(express.static('./public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

var workouts = [];

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
  // TODO: Process data
  res.json({'status': 'success'});
});

app.get('/workouts', (req, res) => {
  console.log('Request for workouts page');
  res.render('workouts');
});

app.listen(8080, '127.0.0.1');
console.log('Listening on http://127.0.0.1:8080');

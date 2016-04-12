'use strict';

// External dependencies
const express = require('express');
const fs = require('fs');
const http = require('http');
const https = require('https');

// Internal dependencies
const app = require('./app');

const hostname = '0.0.0.0';
var sslOptions = {
  key: fs.readFileSync(process.env.KEY_FILE_PATH),
  cert: fs.readFileSync(process.env.CERT_FILE_PATH),
  ca: fs.readFileSync(process.env.CA_FILE_PATH),
};
var httpsPort, httpPort;
if (process.env.NODE_ENV === 'development') {
  httpPort = 8080;
  httpsPort = 8443;
} else if (process.env.NODE_ENV === 'production') {
  httpPort = 80;
  httpsPort = 443;
} else {
  throw new Error(`Unknown NODE_ENV: ${process.env.NODE_ENV}`);
}
// Put main app on HTTPS
var server = https.createServer(sslOptions, app).listen(httpsPort, hostname);
console.log(`Listening on http://${hostname}:${httpsPort}`);

// Redirect HTTP connections to the HTTP server
var redirecterApp = express();
redirecterApp.use(function(req, res) {
  // Preserve hostname and path when redirecting
  res.status(301).redirect(`https://${req.hostname}:${httpsPort}${req.path}`);
});

var httpsRedirecter = http.createServer(redirecterApp).listen(httpPort);

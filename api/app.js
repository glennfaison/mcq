const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const compression = require('compression');
const HttpStatus = require('http-status-codes');
const errorHandler = require('strong-error-handler');

/**
 *  Create new application
 *  @returns {import('express').Express}
 */
function createApplication () {
  const app = express();

  app.use(compression());

  // Configure express for CORS and request parsing
  app.use(cors());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());

  // API routes
  app.use('/', require('./components'));

  // Fallback route
  app.use('/', (req, res) => {
    return res.sendStatus(HttpStatus.NOT_FOUND);
  });

  // General error handler
  app.use(errorHandler({
    debug: process.env.NODE_ENV === 'development',
    log: true
  }));

  return app;
};

module.exports = createApplication;

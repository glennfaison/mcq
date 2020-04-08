const firebaseTesting = require('@firebase/testing');
require('dotenv').config();

let app;

/**
 *  Get a firebase admin service
 *  @returns {import('firebase-admin').app.App}
 */
function run () {
  if (app) { return app; }

  app = firebaseTesting.initializeAdminApp({
    databaseName: process.env.FIREBASE_PROJECT_ID
  });
  return app;
}

module.exports = run;

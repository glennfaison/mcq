const firebaseTesting = require('@firebase/testing');

/**
 *  Get a firebase admin service
 *  @returns {import('firebase-admin').app.App}
 */
function run () {
  const app = firebaseTesting.initializeAdminApp({
    databaseName: process.env.FIREBASE_PROJECT_ID
  });
  return app;
}

module.exports = run;

const firebaseTesting = require('@firebase/testing');

/**
 *  Get a firebase client service
 *  @returns {import('firebase').app.App}
 */
function run () {
  const app = firebaseTesting.initializeTestApp({
    databaseName: process.env.FIREBASE_PROJECT_ID
  });
  return app;
}

module.exports = run;

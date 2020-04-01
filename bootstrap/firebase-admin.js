const firebaseAdmin = require('firebase-admin');

/**
 *  Get a firebase admin service
 *  @returns {import('firebase-admin').app.App}
 */
function run () {
  const pathToServiceFile = process.env.FIREBASE_SERVICE_FILE;
  const serviceAccount = require(pathToServiceFile);

  if (!pathToServiceFile && process.env.NODE_ENV !== 'testing') {
    console.log('FIREBASE_SERVICE_FILE environment variable has not been set');
    process.exit(1);
  }

  const app = firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(serviceAccount),
    databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}.firebaseio.com`
  });

  return app;
}

module.exports = run;

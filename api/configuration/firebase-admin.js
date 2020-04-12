const firebaseAdmin = require('firebase-admin');
require('dotenv').config();

/**
 *  Initialize the firebase admin service
 *  @returns {import('firebase-admin').app.App}
 */
function run () {
  if (firebaseAdmin.apps.length) {
    return firebaseAdmin.apps[0];
  }

  const pathToServiceFile = process.env.FIREBASE_SERVICE_FILE;
  if (!pathToServiceFile && process.env.NODE_ENV === 'testing') {
    return {
      auth: () => ({})
    };
  }
  if (!pathToServiceFile) {
    console.log('FIREBASE_SERVICE_FILE environment variable has not been set');
    process.exit(1);
  }
  const serviceAccount = require(pathToServiceFile);

  const app = firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(serviceAccount),
    databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}.firebaseio.com`
  });

  return app;
}

module.exports = run;

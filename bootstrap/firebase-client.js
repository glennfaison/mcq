const firebase = require('firebase');
require('dotenv').config();

/**
 *  Initialize the firebase client service
 *  @returns {import('firebase').app.App}
 */
function run () {
  if (firebase.apps.length) {
    return;
  }

  const projectId = process.env.FIREBASE_PROJECT_ID;
  if (!projectId && process.env.NODE_ENV === 'testing') {
    return {
      auth: () => ({})
    };
  }
  if (!projectId) {
    console.log('FIREBASE_PROJECT_ID environment variable has not been set');
    process.exit(1);
  }

  const app = firebase.initializeApp({
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: `${projectId}.firebaseapp.com`,
    databaseURL: `https://${projectId}.firebaseio.com`,
    projectId: projectId,
    storageBucket: `${projectId}.appspot.com`,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
    measurementId: process.env.FIREBASE_MEASUREMENT_ID
  });

  return app;
}

module.exports = run;

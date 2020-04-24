const firebase = require('firebase');
const { config } = require('dotenv');

config();

/**
 *  Initialize the firebase client service
 *  @returns {import('firebase').app.App}
 */
function run () {
  if (firebase.apps.length) {
    return;
  }

  if (process.env.NODE_ENV === 'testing') {
    return {
      auth: () => ({})
    };
  }

  let options;
  try {
    options = {
      apiKey: process.env.FIREBASE_API_KEY,
      authDomain: `${process.env.FIREBASE_PROJECT_ID}.firebaseapp.com`,
      databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}.firebaseio.com`,
      projectId: process.env.FIREBASE_PROJECT_ID,
      storageBucket: `${process.env.FIREBASE_PROJECT_ID}.appspot.com`,
      messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.FIREBASE_APP_ID,
      measurementId: process.env.FIREBASE_MEASUREMENT_ID
    };
  } catch (e) {
    console.log(e);
    process.exit(1);
  }

  const app = firebase.initializeApp(options);

  return app;
}

module.exports = run;

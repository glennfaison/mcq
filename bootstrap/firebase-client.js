const firebase = require('firebase');

/**
 *  Get a firebase admin service
 *  @returns {import('firebase-admin').app.App}
 */
function run () {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  if (!projectId && process.env.NODE_ENV !== 'testing') {
    console.log('FIREBASE_PROJECT_ID environment variable has not been set');
    process.exit(1);
  }

  const app = firebase.initializeApp({
    apiKey: 'AIzaSyCtFpwJC91H7A_v8zX0Mo5PBw1-vpQBvZw',
    authDomain: `${projectId}.firebaseapp.com`,
    databaseURL: `https://${projectId}.firebaseio.com`,
    projectId: projectId,
    storageBucket: `${projectId}.appspot.com`,
    messagingSenderId: '204055794902',
    appId: '1:204055794902:web:147b9051ba92976d8fe577',
    measurementId: 'G-0659ED3ZFH'
  });

  return app;
}

module.exports = run;

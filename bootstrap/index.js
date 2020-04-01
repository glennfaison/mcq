const setUpMongoose = require('./mongoose');
const setUpFirebaseAdmin = require('./firebase-admin');
const setUpFirebaseClient = require('./firebase-client');

async function bootstrap () {
  console.log('Connecting to MongoDB...');
  const mongooseConnection = await setUpMongoose();
  console.log('Connected to MongoDB');
  if (process.env.NODE_ENV === 'development') {
    mongooseConnection.set('debug', true);
  }
  console.log('Connecting to Firebase...');
  setUpFirebaseAdmin();
  setUpFirebaseClient();
  console.log('Connected to Firebase');
}

module.exports = bootstrap;

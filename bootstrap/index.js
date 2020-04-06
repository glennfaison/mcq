const setUpMongoose = require('./mongoose');
const setUpFirebaseAdmin = require('./firebase-admin');
const setUpFirebaseClient = require('./firebase-client');

async function bootstrap () {
  console.log('Connecting to MongoDB...');
  await setUpMongoose();
  console.log('Connected to MongoDB');

  console.log('Connecting to Firebase...');
  setUpFirebaseAdmin();
  setUpFirebaseClient();
  console.log('Connected to Firebase');
}

module.exports = bootstrap;

const setUpMongoose = require('./mongoose');
const setUpFirebaseAdmin = require('./firebase-admin');

async function bootstrap () {
  console.log('Connecting to MongoDB...');
  const mongooseConnection = await setUpMongoose();
  console.log('Connected to MongoDB');
  if (process.env.NODE_ENV === 'development') {
    mongooseConnection.set('debug', true);
  }
  console.log('Connecting to Firebase...');
  setUpFirebaseAdmin();
  console.log('Connected to Firebase');
}

module.exports = bootstrap;

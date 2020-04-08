const setUpMongoose = require('./mongoose');
const setUpMockFirebaseAdmin = require('./firebase-admin');
const setUpMockFirebaseClient = require('./firebase-client');
const firebaseAdmin = require('../../src/services/firebase-admin');
const firebaseClient = require('../../src/services/firebase-client');

async function bootstrap () {
  await setUpMongoose();

  // Set up mock firebase apps
  const mockFirebaseAdmin = setUpMockFirebaseAdmin();
  const mockFirebaseClient = setUpMockFirebaseClient();
  try {
    // Inject mock dependencies into Firebase service
    firebaseAdmin.use({ firebase: mockFirebaseAdmin.auth() });
    firebaseClient.use({ firebase: mockFirebaseClient.auth() });
  } catch (e) {
    /* Catch the "auth/invalid-api-key" error and do nothing about it. */
  }
}

module.exports = bootstrap;
